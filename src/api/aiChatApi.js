/**
 * FILE: src/api/aiChatApi.js
 * PURPOSE: API service for the AI ChatBot (ask, conversations, settings, status).
 * UPDATED: Created for the AI ChatBot feature. Uses the shared axios instance
 *          (baseURL = VITE_API_URL, Bearer token interceptor already configured).
 */

import api from "./axios";

export const aiChatApi = {
	// ---------- chat ----------
	ask: (payload) => api.post(`/ai-chatbot/ask`, payload), // { message, conversationId?, projectId? }

	// ---------- conversations ----------
	listConversations: (params) => api.get(`/ai-chatbot/conversations`, { params }),
	getConversation: (id) => api.get(`/ai-chatbot/conversations/${id}`),
	deleteConversation: (id) => api.delete(`/ai-chatbot/conversations/${id}`),

	// ---------- status & suggestions ----------
	getStatus: () => api.get(`/ai-chatbot/status`),
	getSuggestions: () => api.get(`/ai-chatbot/suggestions`),
	getStats: () => api.get(`/ai-chatbot/stats`),

	// ---------- settings (admin) ----------
	getSettings: () => api.get(`/ai-chatbot/settings`),
	updateSettings: (payload) => api.put(`/ai-chatbot/settings`, payload),
	testConnection: (payload) => api.post(`/ai-chatbot/settings/test`, payload),
};
