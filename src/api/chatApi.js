// Internal chat (Chat System v1.0 guide, section 3): REST endpoints under /api/v1/chat.
// Real-time messaging and presence use Socket.IO, see src/lib/chatSocket.js.
import api from "./axios";

// The guide shows { success, data: {...} } envelopes, but the live server returns some chat lists bare
// (contacts is an array, conversations and presence have no envelope, pagination is totalPages, presign uses url/key).
// Each read is normalised here to the guide shape so the store works the same either way.
const asEnvelope = (res, build) => ({ ...res, data: { success: true, data: build(res.data) } });
const unwrap = (body) => (body && typeof body === "object" && "data" in body ? body.data : body) || {};

export const chatApi = {
	contacts: async () => {
		const res = await api.get("/chat/contacts");
		return asEnvelope(res, (body) => {
			const list = Array.isArray(body) ? body : unwrap(body).contacts || body?.contacts || [];
			return { contacts: list };
		});
	},
	listConversations: async (params) => {
		const res = await api.get("/chat/conversations", { params });
		return asEnvelope(res, (body) => {
			const src = unwrap(body);
			return {
				conversations: src.conversations || [],
				pagination: { page: src.page, limit: src.limit, total: src.total, pages: src.totalPages ?? src.pages ?? 1 },
			};
		});
	},
	createConversation: async (participantId) => {
		const res = await api.post("/chat/conversations", { participantId });
		return asEnvelope(res, unwrap);
	},
	messages: async (conversationId, params) => {
		const res = await api.get(`/chat/conversations/${conversationId}/messages`, { params });
		return asEnvelope(res, (body) => {
			const src = unwrap(body);
			return { messages: Array.isArray(src) ? src : src.messages || [] };
		});
	},
	sendMessage: async (conversationId, data) => {
		const res = await api.post(`/chat/conversations/${conversationId}/messages`, data);
		return asEnvelope(res, unwrap);
	},
	markRead: (conversationId, lastReadMessageId) =>
		api.patch(`/chat/conversations/${conversationId}/read`, { lastReadMessageId }),
	archive: (conversationId, isArchived) => api.patch(`/chat/conversations/${conversationId}/archive`, { isArchived }),
	mute: (conversationId, isMuted) => api.patch(`/chat/conversations/${conversationId}/mute`, { isMuted }),
	presignedUpload: async (data) => {
		const res = await api.post("/chat/attachments/presigned-url", data);
		return asEnvelope(res, (body) => {
			// Live server names: url, key. Guide names: uploadUrl, fileKey.
			const src = unwrap(body);
			return {
				uploadUrl: src.uploadUrl ?? src.url,
				fileKey: src.fileKey ?? src.key,
				publicUrl: src.publicUrl,
				expiresIn: src.expiresIn,
			};
		});
	},
	confirmAttachment: async (data) => {
		const res = await api.post("/chat/attachments/confirm", data);
		return asEnvelope(res, unwrap);
	},
	deleteMessage: (messageId) => api.delete(`/chat/messages/${messageId}`),
	presence: (userId) => api.get(`/chat/presence/${userId}`),
	onlineUsers: async () => {
		const res = await api.get("/chat/presence/online");
		return asEnvelope(res, (body) => {
			const src = unwrap(body);
			return { onlineUsers: src.onlineUsers || src.online || [] };
		});
	},
};
