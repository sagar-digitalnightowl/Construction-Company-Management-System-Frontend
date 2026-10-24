/**
 * FILE: src/hooks/useAIChat.js
 * PURPOSE: Domain hook for the AI ChatBot page — messages state, send/receive,
 *          conversations CRUD, status + settings loading. Follows the usePropertyInventory
 *          pattern (useState + useCallback + sonner toasts).
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { aiChatApi } from "@/api/aiChatApi";

export const useAIChat = () => {
	// ---------- chat state ----------
	const [messages, setMessages] = useState([]); // { role, content, source, stats, createdAt, id }
	const [conversationId, setConversationId] = useState(null);
	const [conversations, setConversations] = useState([]);
	const [conversationsLoading, setConversationsLoading] = useState(false);
	const [sending, setSending] = useState(false);
	const [suggestions, setSuggestions] = useState([]);

	// ---------- status & settings ----------
	const [status, setStatus] = useState(null); // { aiConfigured, aiEnabled, provider, mode, ... }
	const [statusLoading, setStatusLoading] = useState(true);

	const conversationIdRef = useRef(null);
	useEffect(() => {
		conversationIdRef.current = conversationId;
	}, [conversationId]);

	// ---------- status ----------
	const fetchStatus = useCallback(async () => {
		setStatusLoading(true);
		try {
			const res = await aiChatApi.getStatus();
			setStatus(res.data?.data || res.data || null);
		} catch (err) {
			toast.error(err?.response?.data?.message || "ChatBot status load nahi hua");
		} finally {
			setStatusLoading(false);
		}
	}, []);

	// ---------- suggestions ----------
	const fetchSuggestions = useCallback(async () => {
		try {
			const res = await aiChatApi.getSuggestions();
			setSuggestions(res.data?.data?.suggestions || []);
		} catch {
			// non-critical — silent
		}
	}, []);

	// ---------- send ----------
	const send = useCallback(
		async (text) => {
			const trimmed = (text || "").trim();
			if (!trimmed || sending) return;

			const tempId = `temp_${Date.now()}`;
			setMessages((prev) => [...prev, { id: tempId, role: "user", content: trimmed, createdAt: new Date().toISOString() }]);
			setSending(true);

			try {
				const res = await aiChatApi.ask({
					message: trimmed,
					conversationId: conversationIdRef.current || undefined,
				});
				const data = res.data || {};
				if (data.conversationId) setConversationId(data.conversationId);
				setMessages((prev) => [
					...prev,
					{
						id: `a_${Date.now()}`,
						role: "assistant",
						content: data.answer || "Sorry, koi response nahi mila.",
						source: data.source,
						stats: data.stats,
						provider: data.provider,
						model: data.model,
						createdAt: new Date().toISOString(),
					},
				]);
				// refresh conversation list lazily (title may be new)
				fetchConversations();
			} catch (err) {
				const msg = err?.response?.data?.message || "Message send nahi hua. Thodi der baad try karein.";
				toast.error(msg);
				setMessages((prev) => [
					...prev,
					{ id: `e_${Date.now()}`, role: "assistant", content: msg, source: "error", createdAt: new Date().toISOString() },
				]);
			} finally {
				setSending(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[sending],
	);

	// ---------- conversations ----------
	const fetchConversations = useCallback(async () => {
		setConversationsLoading(true);
		try {
			const res = await aiChatApi.listConversations({ page: 1, limit: 50 });
			const data = res.data?.data || {};
			setConversations(data.items || []);
		} catch {
			// silent — list is secondary
		} finally {
			setConversationsLoading(false);
		}
	}, []);

	const openConversation = useCallback(async (id) => {
		try {
			const res = await aiChatApi.getConversation(id);
			const data = res.data?.data || {};
			setConversationId(data.id || id);
			setMessages(
				(data.messages || []).map((m, i) => ({
					id: `${id}_${i}`,
					role: m.role,
					content: m.content,
					source: m.source,
					stats: m.stats,
					createdAt: m.createdAt,
				})),
			);
		} catch (err) {
			toast.error(err?.response?.data?.message || "Conversation open nahi hui");
		}
	}, []);

	const deleteConversation = useCallback(
		async (id) => {
			try {
				await aiChatApi.deleteConversation(id);
				toast.success("Conversation delete ho gayi");
				if (conversationIdRef.current === id) startNewChat();
				fetchConversations();
			} catch (err) {
				toast.error(err?.response?.data?.message || "Delete nahi hua");
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const startNewChat = useCallback(() => {
		setConversationId(null);
		setMessages([]);
	}, []);

	// ---------- settings (admin) ----------
	const fetchSettings = useCallback(async () => {
		const res = await aiChatApi.getSettings();
		return res.data?.data || res.data || null;
	}, []);

	const saveSettings = useCallback(async (payload) => {
		const res = await aiChatApi.updateSettings(payload);
		return res.data?.data || res.data || null;
	}, []);

	const testConnection = useCallback(async (payload) => {
		const res = await aiChatApi.testConnection(payload);
		return res.data || {};
	}, []);

	// ---------- initial load ----------
	useEffect(() => {
		fetchStatus();
		fetchSuggestions();
		fetchConversations();
	}, [fetchStatus, fetchSuggestions, fetchConversations]);

	return {
		// chat
		messages,
		sending,
		send,
		suggestions,
		// conversations
		conversations,
		conversationsLoading,
		conversationId,
		fetchConversations,
		openConversation,
		deleteConversation,
		startNewChat,
		// status
		status,
		statusLoading,
		fetchStatus,
		// settings
		fetchSettings,
		saveSettings,
		testConnection,
	};
};
