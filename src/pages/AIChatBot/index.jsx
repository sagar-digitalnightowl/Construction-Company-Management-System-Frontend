/**
 * FILE: src/pages/AIChatBot/index.jsx
 * PURPOSE: Admin "AI ChatBot" page — ChatGPT-style chat panel wired to the backend
 *          /ai-chatbot endpoints. Features: conversation sidebar, quick-ask suggestion
 *          chips, AI/rules mode badge, admin-only settings dialog (API key), typing
 *          indicator, auto-scroll, Enter-to-send.
 */

import React, { useEffect, useRef, useState } from "react";
import { Bot, MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Send, Settings2, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/helpers";
import { ChatMessage, TypingBubble } from "@/components/chat/ChatMessage";
import { AISettingsDialog } from "@/components/chat/AISettingsDialog";
import { useAIChat } from "@/hooks/useAIChat";
import { useAuthStore } from "@/store/authStore";

export default function AIChatBot() {
	const {
		messages,
		sending,
		send,
		suggestions,
		conversations,
		conversationsLoading,
		conversationId,
		fetchConversations,
		openConversation,
		deleteConversation,
		startNewChat,
		status,
		statusLoading,
		fetchStatus,
		fetchSettings,
		saveSettings,
		testConnection,
	} = useAIChat();

	const { current } = useAuthStore();
	const isAdmin = ["admin", "director"].includes((current?.role || "").toLowerCase());

	const [input, setInput] = useState("");
	const [showSidebar, setShowSidebar] = useState(true);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);

	const scrollRef = useRef(null);
	const inputRef = useRef(null);

	// auto-scroll to bottom on new messages / typing
	useEffect(() => {
		const el = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]");
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages, sending]);

	// keep textarea auto-height
	useEffect(() => {
		const el = inputRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
	}, [input]);

	const handleSend = () => {
		if (!input.trim() || sending) return;
		send(input);
		setInput("");
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const modeBadge = () => {
		if (statusLoading) return null;
		if (!status?.aiConfigured) {
			return (
				<Badge variant="secondary" className="gap-1 text-[10px]">
					<Sparkles className="h-3 w-3" /> Built-in engine mode
				</Badge>
			);
		}
		if (!status?.aiEnabled) {
			return (
				<Badge variant="secondary" className="gap-1 text-[10px]">
					<Sparkles className="h-3 w-3" /> AI disabled — rules engine
				</Badge>
			);
		}
		return (
			<Badge className="gap-1 text-[10px] bg-primary/15 text-primary hover:bg-primary/20">
				<Sparkles className="h-3 w-3" /> AI connected · {status.provider}
			</Badge>
		);
	};

	return (
		<div className="space-y-4">
			<PageHeader
				eyebrow="Intelligence"
				title="AI ChatBot"
				description="Projects, flats, bookings aur leads ke baare me live data se poocho — jaise 'How many 2 bhk north facing is available'"
				actions={
					<>
						{modeBadge()}
						{isAdmin && (
							<Button variant="outline" onClick={() => setSettingsOpen(true)}>
								<Settings2 className="h-4 w-4 mr-1.5" /> AI Settings
							</Button>
						)}
					</>
				}
			/>

			<div className="flex gap-3 h-[calc(100vh-260px)] min-h-[520px]">
				{/* ================= LEFT: conversations ================= */}
				<Card
					className={cn(
						"hidden md:flex flex-col transition-all duration-200 overflow-hidden",
						showSidebar ? "w-64 shrink-0" : "w-0 border-0",
					)}
				>
					{showSidebar && (
						<>
							<div className="flex items-center justify-between border-b border-border/70 px-3 py-2.5">
								<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Conversations
								</span>
								<div className="flex items-center gap-1">
									<Button variant="ghost" size="icon" className="h-7 w-7" onClick={startNewChat} title="New chat">
										<MessageSquarePlus className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7"
										onClick={() => setShowSidebar(false)}
										title="Hide panel"
									>
										<PanelLeftClose className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<ScrollArea className="flex-1">
								<div className="p-2 space-y-1">
									{conversationsLoading && conversations.length === 0 && (
										<div className="px-2 py-6 text-center text-xs text-muted-foreground">Loading…</div>
									)}
									{!conversationsLoading && conversations.length === 0 && (
										<div className="px-2 py-6 text-center text-xs text-muted-foreground">
											Abhi koi conversation nahi. Naya chat shuru karein!
										</div>
									)}
									{conversations.map((c) => (
										<div
											key={c.id}
											className={cn(
												"group flex items-center gap-1 rounded-md px-2 py-2 text-sm cursor-pointer transition-colors",
												conversationId === c.id
													? "bg-primary/10 text-primary"
													: "hover:bg-muted text-foreground",
											)}
											onClick={() => openConversation(c.id)}
										>
											<div className="min-w-0 flex-1">
												<div className="truncate font-medium">{c.title}</div>
												<div className="text-[10px] text-muted-foreground">
													{c.messageCount} msg ·{" "}
													{c.lastMessageAt
														? new Date(c.lastMessageAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
														: ""}
												</div>
											</div>
											<button
												onClick={(e) => {
													e.stopPropagation();
													setDeleteTarget(c);
												}}
												className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
												title="Delete"
											>
												<Trash2 className="h-3.5 w-3.5" />
											</button>
										</div>
									))}
								</div>
							</ScrollArea>
						</>
					)}
				</Card>

				{/* ================= RIGHT: chat panel ================= */}
				<Card className="flex flex-1 flex-col overflow-hidden">
					{/* header */}
					<div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
						<div className="flex items-center gap-2">
							{!showSidebar && (
								<Button variant="ghost" size="icon" className="hidden md:inline-flex h-7 w-7" onClick={() => setShowSidebar(true)}>
									<PanelLeftOpen className="h-4 w-4" />
								</Button>
							)}
							<div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
								<Bot className="h-4 w-4" />
							</div>
							<div>
								<div className="text-sm font-semibold font-display leading-tight">Nirman AI</div>
								<div className="text-[10px] text-muted-foreground leading-tight">
									{status?.aiConfigured && status?.aiEnabled
										? `Live data + ${status.provider} AI`
										: "Live database answers"}
								</div>
							</div>
						</div>
						<Button variant="outline" size="sm" onClick={startNewChat}>
							<MessageSquarePlus className="h-4 w-4 mr-1.5" /> New Chat
						</Button>
					</div>

					{/* messages */}
					<ScrollArea className="flex-1" ref={scrollRef}>
						<div className="space-y-4 p-4">
							{messages.length === 0 && !sending && (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
										<Bot className="h-7 w-7" />
									</div>
									<div className="font-display text-lg font-semibold">Nirman AI me swagat hai</div>
									<p className="mt-1 max-w-md text-sm text-muted-foreground">
										Main aapke system ka live data padhta hoon — flat availability, prices, bookings,
										leads aur site stock ke baare me kuch bhi poocho.
									</p>
									{suggestions.length > 0 && (
										<div className="mt-5 flex flex-wrap justify-center gap-2 max-w-lg">
											{suggestions.map((s) => (
												<button
													key={s}
													onClick={() => send(s)}
													className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs transition-colors hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
												>
													{s}
												</button>
											))}
										</div>
									)}
								</div>
							)}

							{messages.map((m) => (
								<ChatMessage key={m.id} message={m} />
							))}
							{sending && <TypingBubble />}
						</div>
					</ScrollArea>

					{/* suggestions row (when chatting) */}
					{messages.length > 0 && suggestions.length > 0 && !sending && (
						<div className="flex gap-2 overflow-x-auto border-t border-border/60 px-4 py-2">
							{suggestions.slice(0, 4).map((s) => (
								<button
									key={s}
									onClick={() => send(s)}
									className="shrink-0 rounded-full border border-border/80 px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/40"
								>
									{s}
								</button>
							))}
						</div>
					)}

					{/* input */}
					<div className="border-t border-border/70 p-3">
						<div className="flex items-end gap-2">
							<Textarea
								ref={inputRef}
								rows={1}
								placeholder="Poocho… e.g. How many 2 bhk north facing is available?"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								className="min-h-[44px] max-h-[140px] resize-none"
								disabled={sending}
							/>
							<Button
								size="icon"
								className="h-11 w-11 shrink-0"
								onClick={handleSend}
								disabled={sending || !input.trim()}
							>
								<Send className="h-4 w-4" />
							</Button>
						</div>
						<div className="mt-1.5 text-[10px] text-muted-foreground">
							Enter = send · Shift+Enter = new line · Live data har answer me automatically include hota hai
						</div>
					</div>
				</Card>
			</div>

			{/* admin settings dialog */}
			<AISettingsDialog
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
				fetchSettings={fetchSettings}
				saveSettings={saveSettings}
				testConnection={testConnection}
				onSaved={() => {
					fetchStatus();
					fetchConversations();
				}}
			/>

			{/* delete confirm */}
			<ConfirmDialog
				open={Boolean(deleteTarget)}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
				title="Delete conversation?"
				description={`"${deleteTarget?.title}" hamesha ke liye delete ho jayegi.`}
				confirmLabel="Delete"
				onConfirm={() => {
					if (deleteTarget) deleteConversation(deleteTarget.id);
					setDeleteTarget(null);
				}}
			/>
		</div>
	);
}
