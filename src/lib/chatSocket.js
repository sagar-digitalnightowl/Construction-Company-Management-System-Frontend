// Socket.IO connection for the internal chat (Chat System v1.0 guide, section 4).
// One socket per logged-in user, connected to the /chat namespace with the JWT in the auth option.
import { io } from "socket.io-client";

const { VITE_API_URL } = import.meta.env;
const API_ORIGIN = VITE_API_URL ? new URL(VITE_API_URL).origin : "https://constructor.meetmeall.com";
export const CHAT_SOCKET_URL = `${API_ORIGIN}/chat`;

const HEARTBEAT_MS = 60000;
const AUTH_ERROR = /unauthori|token|jwt|auth/i;
// Events the server sends that the store handles (section 4.3)
const SERVER_EVENTS = [
	"message:new",
	"message:sent",
	"message:read-receipt",
	"message:read-ack",
	"message:deleted",
	"typing:update",
	"presence:update",
	"chat:joined",
	"chat:left",
];

let socket = null;
let heartbeatTimer = null;
let handlers = {};
// Rooms the user has open. Kept across reconnects so chat:join can be sent again (section 6.C).
const joinedRooms = new Set();

const setStatus = (status) => handlers.onStatus?.(status);

function stopHeartbeat() {
	clearInterval(heartbeatTimer);
	heartbeatTimer = null;
}

export function connectChatSocket(token, nextHandlers) {
	closeSocket();
	handlers = nextHandlers;
	setStatus("connecting");

	// auth as a function is read on every (re)connect, so a token refreshed by api/axios.js is used after a reconnect
	const auth = (cb) => cb({ token: localStorage.getItem("accessToken") || token });
	const next = io(CHAT_SOCKET_URL, { auth, transports: ["websocket"], reconnection: true });
	socket = next;
	let everConnected = false;
	let lastError = null;

	const rejectAuth = (message) => {
		setStatus("auth-failed");
		handlers.onAuthError?.(message);
		next.close();
	};

	next.on("connect", () => {
		everConnected = true;
		setStatus("connected");
		joinedRooms.forEach((conversationId) => next.emit("chat:join", { conversationId }));
		stopHeartbeat();
		heartbeatTimer = setInterval(() => next.emit("heartbeat"), HEARTBEAT_MS);
	});

	next.on("disconnect", (reason) => {
		stopHeartbeat();
		// The server dropped us after sending an error, which is how a rejected token shows up
		if (reason === "io server disconnect" && lastError && AUTH_ERROR.test(lastError)) {
			rejectAuth(lastError);
			return;
		}
		setStatus("disconnected");
	});

	// The handshake was refused (for example a bad token)
	next.on("connect_error", (err) => {
		const message = err?.message || "";
		if (!everConnected && AUTH_ERROR.test(message)) {
			rejectAuth(message);
			return;
		}
		setStatus("disconnected");
	});

	// The server sends 'error' both for a failed login and for runtime errors (permission, rate limit).
	// Before the first successful connect, an 'error' means the token was rejected.
	next.on("error", (err) => {
		const message = err?.message || "Chat error";
		lastError = message;
		if (!everConnected) {
			rejectAuth(message);
			return;
		}
		handlers.onError?.(message);
	});

	SERVER_EVENTS.forEach((name) => {
		next.on(name, (payload) => handlers.onEvent?.(name, payload));
	});
	next.on("heartbeat:ack", () => {});

	return next;
}

function closeSocket() {
	stopHeartbeat();
	if (socket) {
		socket.removeAllListeners();
		socket.disconnect();
		socket = null;
	}
}

// Called on logout: closes the socket and forgets open rooms.
export function disconnectChatSocket() {
	closeSocket();
	joinedRooms.clear();
	handlers = {};
}

export function isChatConnected() {
	return !!socket?.connected;
}

export function joinChatRoom(conversationId) {
	if (!conversationId) return;
	joinedRooms.add(conversationId);
	if (isChatConnected()) socket.emit("chat:join", { conversationId });
}

export function leaveChatRoom(conversationId) {
	if (!conversationId) return;
	joinedRooms.delete(conversationId);
	if (isChatConnected()) socket.emit("chat:leave", { conversationId });
}

// Returns false when the socket is not connected, so the caller can fall back to REST.
export function emitChat(event, payload) {
	if (!isChatConnected()) return false;
	socket.emit(event, payload);
	return true;
}
