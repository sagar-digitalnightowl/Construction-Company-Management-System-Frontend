// Pure helpers for the internal chat. No React, no network, so they can be unit tested directly.

export const MESSAGE_PAGE_SIZE = 30;
export const CONVERSATION_PAGE_SIZE = 50;
// Stop sending "typing" 3 s after the last keypress (guide section 6.B)
export const TYPING_STOP_DELAY_MS = 3000;
// Hide a "typing..." label if no update arrives for this long
export const TYPING_EXPIRE_MS = 5000;
export const DELETED_TEXT = "This message was deleted";
// Upload guard in the UI. The guide gives no limit, so this is an assumption to confirm with the backend.
export const CHAT_MAX_FILE_BYTES = 25 * 1024 * 1024;

const TYPE_LABELS = { image: "Photo", pdf: "PDF", audio: "Audio", video: "Video", document: "Document" };

// senderId is an id string on some responses and a populated user object on others
export const idOf = (value) => (value && typeof value === "object" ? value._id : value) ?? null;
export const senderIdOf = (message) => idOf(message?.senderId);
export const conversationIdOf = (message) => idOf(message?.conversationId);
export const isOwnMessage = (message, userId) => !!userId && senderIdOf(message) === userId;
export const canDeleteMessage = (message, userId) => isOwnMessage(message, userId) && !message?.isDeleted;

export function messageTypeFromMime(mime = "") {
	if (mime.startsWith("image/")) return "image";
	if (mime === "application/pdf") return "pdf";
	if (mime.startsWith("audio/")) return "audio";
	if (mime.startsWith("video/")) return "video";
	return "document";
}

// Text shown in the conversation list and in notifications
export function messagePreview(message) {
	if (!message) return "";
	if (message.isDeleted) return DELETED_TEXT;
	const text = (message.content || "").trim();
	if (text) return text.length > 120 ? `${text.slice(0, 117)}...` : text;
	return TYPE_LABELS[message.messageType] || "Attachment";
}

const time = (value) => new Date(value || 0).getTime();

// Oldest first. Ties are broken by id so the order is stable.
export function sortMessages(list) {
	return [...list].sort((a, b) => time(a.createdAt) - time(b.createdAt) || String(a._id).localeCompare(String(b._id)));
}

// Adds incoming messages to an existing list, replacing any with the same id
export function mergeMessages(existing, incoming) {
	const byId = new Map();
	[...existing, ...incoming].forEach((message) => {
		if (message?._id) byId.set(message._id, message);
	});
	return sortMessages([...byId.values()]);
}

// Newest activity first
export function sortConversations(list) {
	return [...list].sort((a, b) => time(b.lastMessageAt || b.createdAt) - time(a.lastMessageAt || a.createdAt));
}

export function upsertConversation(list, conversation) {
	const exists = list.some((item) => item._id === conversation._id);
	const next = exists
		? list.map((item) => (item._id === conversation._id ? { ...item, ...conversation } : item))
		: [conversation, ...list];
	return sortConversations(next);
}

export function patchConversation(list, conversationId, patch) {
	return list.map((item) => (item._id === conversationId ? { ...item, ...patch } : item));
}

export function filterConversations(list, { query = "", showArchived = false } = {}) {
	const needle = query.trim().toLowerCase();
	return list.filter((conversation) => {
		if (!showArchived && conversation.isArchived) return false;
		if (showArchived && !conversation.isArchived) return false;
		if (!needle) return true;
		return (conversation.otherParticipant?.name || "").toLowerCase().includes(needle);
	});
}

export function filterContacts(contacts, query = "") {
	const needle = query.trim().toLowerCase();
	if (!needle) return contacts;
	return contacts.filter((contact) => (contact.name || "").toLowerCase().includes(needle));
}

// True when the other participant has read this message (the read pointer is at or after it)
export function isSeenBy(messages, message, lastReadMessageId) {
	if (!lastReadMessageId || !message) return false;
	const readIndex = messages.findIndex((item) => item._id === lastReadMessageId);
	const messageIndex = messages.findIndex((item) => item._id === message._id);
	return readIndex !== -1 && messageIndex !== -1 && messageIndex <= readIndex;
}

export function typingText(names) {
	if (!names.length) return "";
	if (names.length === 1) return `${names[0]} is typing...`;
	return "Several people are typing...";
}

export function formatChatTime(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const now = new Date();
	const sameDay = date.toDateString() === now.toDateString();
	return sameDay
		? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
		: date.toLocaleDateString([], { day: "2-digit", month: "short" });
}

// Maps a failed request to the message shown to the user. Server messages are used when they exist.
export function chatErrorMessage(error, fallback = "Something went wrong. Please try again.") {
	const status = error?.response?.status;
	const raw = error?.response?.data?.message;
	const serverMessage = Array.isArray(raw) ? raw.join(", ") : raw;
	if (status === 401) return "Your session has expired. Please log in again.";
	if (status === 403) return serverMessage || "You are not allowed to do that.";
	if (status === 404) return serverMessage || "This conversation or message no longer exists.";
	if (status === 429) return serverMessage || "Too many messages. Please slow down.";
	if (status === 400) return serverMessage || "Please check the message and try again.";
	return serverMessage || fallback;
}

export function attachmentName(attachment) {
	if (!attachment || typeof attachment !== "object") return "Attachment";
	return attachment.fileName || "Attachment";
}

export function attachmentUrl(attachment) {
	return attachment && typeof attachment === "object" ? attachment.fileUrl || null : null;
}

export function isImageAttachment(attachment) {
	return !!attachment && typeof attachment === "object" && (attachment.mimeType || "").startsWith("image/");
}
