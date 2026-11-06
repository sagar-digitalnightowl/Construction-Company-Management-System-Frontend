// Internal chat state: conversations, messages, typing, presence and the socket connection.
import { create } from "zustand";
import { toast } from "sonner";
import { chatApi } from "@/api/chatApi";
import {
	connectChatSocket,
	disconnectChatSocket,
	emitChat,
	isChatConnected,
	joinChatRoom,
	leaveChatRoom,
} from "@/lib/chatSocket";
import {
	CONVERSATION_PAGE_SIZE,
	MESSAGE_PAGE_SIZE,
	TYPING_EXPIRE_MS,
	chatErrorMessage,
	conversationIdOf,
	isOwnMessage,
	mergeMessages,
	messagePreview,
	patchConversation,
	sortConversations,
	DELETED_TEXT,
} from "@/lib/chatHelpers";

const typingExpiry = {};

const withoutKey = (object, key) => {
	const next = { ...object };
	delete next[key];
	return next;
};

const initialState = {
	currentUserId: null,
	socketStatus: "idle",
	conversations: [],
	conversationsLoading: false,
	activeId: null,
	messages: {},
	hasOlder: {},
	messagesLoading: false,
	// conversationId -> id of the last message the other participant read
	readUpTo: {},
	// conversationId -> [userId] currently typing
	typing: {},
	// userId -> true while online
	online: {},
	contacts: [],
	contactsLoading: false,
};

export const useChatStore = create((set, get) => ({
	...initialState,

	connect: (user) => {
		const token = localStorage.getItem("accessToken");
		if (!token || !user) return;
		set({ currentUserId: user._id ?? user.id ?? null });
		connectChatSocket(token, {
			onStatus: (socketStatus) => set({ socketStatus }),
			onEvent: (name, payload) => get().handleSocketEvent(name, payload),
			onError: (message) => toast.error(message),
			onAuthError: () => toast.error("Chat could not connect. Please log in again."),
		});
		get().loadOnline();
	},

	disconnect: () => {
		Object.keys(typingExpiry).forEach((key) => {
			clearTimeout(typingExpiry[key]);
			delete typingExpiry[key];
		});
		disconnectChatSocket();
		set({ ...initialState });
	},

	handleSocketEvent: (name, payload) => {
		switch (name) {
			case "message:new":
				get().receiveMessage(payload);
				break;
			case "message:sent":
				get().receiveMessage(payload, { mine: true });
				break;
			case "message:read-receipt":
				set((state) => ({
					readUpTo: { ...state.readUpTo, [payload.conversationId]: payload.lastReadMessageId },
				}));
				break;
			case "message:read-ack":
				set((state) => ({
					conversations: patchConversation(state.conversations, payload.conversationId, {
						unreadCount: payload.unreadCount,
					}),
				}));
				break;
			case "typing:update":
				get().setTyping(payload.conversationId, payload.userId, payload.isTyping);
				break;
			case "presence:update":
				get().setOnline(payload.userId, payload.isOnline);
				break;
			default:
				break;
		}
	},

	setOnline: (userId, isOnline) =>
		set((state) => ({
			online: isOnline ? { ...state.online, [userId]: true } : withoutKey(state.online, userId),
		})),

	setTyping: (conversationId, userId, isTyping) => {
		const key = `${conversationId}:${userId}`;
		clearTimeout(typingExpiry[key]);
		if (isTyping) {
			typingExpiry[key] = setTimeout(() => get().setTyping(conversationId, userId, false), TYPING_EXPIRE_MS);
		} else {
			delete typingExpiry[key];
		}
		set((state) => {
			const current = state.typing[conversationId] || [];
			const next = isTyping
				? current.includes(userId) ? current : [...current, userId]
				: current.filter((id) => id !== userId);
			return { typing: { ...state.typing, [conversationId]: next } };
		});
	},

	loadOnline: async () => {
		try {
			const res = await chatApi.onlineUsers();
			const ids = res.data?.data?.onlineUsers || [];
			set({ online: Object.fromEntries(ids.map((id) => [id, true])) });
		} catch (error) {
			// Presence is informational; the chat still works without it
		}
	},

	loadConversations: async () => {
		set({ conversationsLoading: true });
		try {
			let page = 1;
			let pages = 1;
			let all = [];
			do {
				const res = await chatApi.listConversations({ page, limit: CONVERSATION_PAGE_SIZE });
				const data = res.data.data;
				all = [...all, ...(data.conversations || [])];
				pages = data.pagination?.pages ?? 1;
				page += 1;
			} while (page <= pages);
			set({ conversations: sortConversations(all) });
		} catch (error) {
			toast.error(chatErrorMessage(error, "Could not load conversations."));
		} finally {
			set({ conversationsLoading: false });
		}
	},

	loadContacts: async () => {
		set({ contactsLoading: true });
		try {
			const res = await chatApi.contacts();
			set({ contacts: res.data.data.contacts || [] });
		} catch (error) {
			toast.error(chatErrorMessage(error, "Could not load contacts."));
		} finally {
			set({ contactsLoading: false });
		}
	},

	loadMessages: async (conversationId, { older = false } = {}) => {
		const current = get().messages[conversationId] || [];
		// The oldest loaded message is first in the sorted list
		const before = older && current.length ? current[0]._id : undefined;
		set({ messagesLoading: true });
		try {
			const res = await chatApi.messages(conversationId, {
				limit: MESSAGE_PAGE_SIZE,
				...(before ? { before } : {}),
			});
			const batch = res.data.data.messages || [];
			set((state) => ({
				messages: {
					...state.messages,
					[conversationId]: mergeMessages(state.messages[conversationId] || [], batch),
				},
				hasOlder: { ...state.hasOlder, [conversationId]: batch.length >= MESSAGE_PAGE_SIZE },
			}));
		} catch (error) {
			toast.error(chatErrorMessage(error, "Could not load messages."));
		} finally {
			set({ messagesLoading: false });
		}
	},

	openConversation: async (conversationId) => {
		const previous = get().activeId;
		if (previous && previous !== conversationId) leaveChatRoom(previous);
		set({ activeId: conversationId });
		joinChatRoom(conversationId);
		if (!get().messages[conversationId]) await get().loadMessages(conversationId);
		get().markRead(conversationId);
	},

	closeConversation: () => {
		const previous = get().activeId;
		if (previous) leaveChatRoom(previous);
		set({ activeId: null });
	},

	// Adds a saved message. Used for socket events and REST responses. Mine = sent by this user.
	receiveMessage: (message, { mine = false } = {}) => {
		const conversationId = conversationIdOf(message);
		if (!conversationId) return;
		const state = get();
		const ownMessage = mine || isOwnMessage(message, state.currentUserId);
		const isActive = state.activeId === conversationId;
		const known = state.conversations.find((item) => item._id === conversationId);

		if (!known) {
			// A conversation we have not loaded yet (someone started a new chat with us)
			get().loadConversations();
		}

		set((current) => {
			const existing = current.messages[conversationId];
			const conversation = current.conversations.find((item) => item._id === conversationId);
			const unread = conversation?.unreadCount || 0;
			const nextUnread = ownMessage || isActive ? unread : unread + 1;
			return {
				messages: existing
					? { ...current.messages, [conversationId]: mergeMessages(existing, [message]) }
					: current.messages,
				conversations: conversation
					? patchConversation(current.conversations, conversationId, {
						lastMessagePreview: messagePreview(message),
						lastMessageAt: message.createdAt,
						unreadCount: nextUnread,
					})
					: current.conversations,
			};
		});

		if (!ownMessage && isActive) get().markRead(conversationId);
		if (!ownMessage && !isActive && known && !known.isMuted) {
			toast(`${known.otherParticipant?.name || "New message"}: ${messagePreview(message)}`);
		}
	},

	sendMessage: async (conversationId, { content = "", attachmentIds = [], messageType = "text", replyTo = null }) => {
		const payload = { conversationId, content, messageType, attachmentIds };
		if (replyTo) payload.replyTo = replyTo;
		emitChat("typing:stop", { conversationId });

		// The socket path returns right away. The saved message arrives later as message:sent.
		if (isChatConnected()) {
			emitChat("message:send", payload);
			return;
		}
		const res = await chatApi.sendMessage(conversationId, {
			content,
			messageType,
			replyTo,
			attachmentIds,
		});
		get().receiveMessage(res.data.data, { mine: true });
	},

	sendTyping: (conversationId, isTyping) => {
		emitChat(isTyping ? "typing:start" : "typing:stop", { conversationId });
	},

	markRead: async (conversationId) => {
		const list = get().messages[conversationId] || [];
		const last = list[list.length - 1];
		set((state) => ({
			conversations: patchConversation(state.conversations, conversationId, { unreadCount: 0 }),
		}));
		if (!last) return;
		if (emitChat("message:read", { conversationId, lastReadMessageId: last._id })) return;
		try {
			await chatApi.markRead(conversationId, last._id);
		} catch (error) {
			// The next open will try again
		}
	},

	deleteMessage: async (conversationId, messageId) => {
		try {
			await chatApi.deleteMessage(messageId);
		} catch (error) {
			toast.error(chatErrorMessage(error, "Could not delete the message."));
			return;
		}
		set((state) => {
			const list = state.messages[conversationId] || [];
			const wasLast = list[list.length - 1]?._id === messageId;
			return {
				messages: {
					...state.messages,
					[conversationId]: list.map((item) =>
						item._id === messageId ? { ...item, isDeleted: true, content: DELETED_TEXT } : item,
					),
				},
				conversations: wasLast
					? patchConversation(state.conversations, conversationId, { lastMessagePreview: DELETED_TEXT })
					: state.conversations,
			};
		});
	},

	setMuted: async (conversationId, isMuted) => {
		const previous = get().conversations.find((item) => item._id === conversationId)?.isMuted ?? false;
		set((state) => ({ conversations: patchConversation(state.conversations, conversationId, { isMuted }) }));
		try {
			await chatApi.mute(conversationId, isMuted);
		} catch (error) {
			set((state) => ({ conversations: patchConversation(state.conversations, conversationId, { isMuted: previous }) }));
			toast.error(chatErrorMessage(error, "Could not update the mute setting."));
		}
	},

	setArchived: async (conversationId, isArchived) => {
		const previous = get().conversations.find((item) => item._id === conversationId)?.isArchived ?? false;
		set((state) => ({ conversations: patchConversation(state.conversations, conversationId, { isArchived }) }));
		try {
			await chatApi.archive(conversationId, isArchived);
			if (isArchived && get().activeId === conversationId) get().closeConversation();
		} catch (error) {
			set((state) => ({ conversations: patchConversation(state.conversations, conversationId, { isArchived: previous }) }));
			toast.error(chatErrorMessage(error, "Could not update the archive setting."));
		}
	},

	startConversation: async (participantId) => {
		try {
			const res = await chatApi.createConversation(participantId);
			const created = res.data.data;
			// The create response has no participant details, so reload the list to get the name
			await get().loadConversations();
			await get().openConversation(created._id);
		} catch (error) {
			toast.error(chatErrorMessage(error, "Could not start the conversation."));
			throw error;
		}
	},
}));

// Dev-only handle used by the browser tests to feed server events into the live store
if (import.meta.env.DEV && typeof window !== "undefined") {
	window.__chatStore = useChatStore;
}

export const selectUnreadTotal = (state) =>
	state.conversations.reduce((total, item) => (item.isArchived ? total : total + (item.unreadCount || 0)), 0);
