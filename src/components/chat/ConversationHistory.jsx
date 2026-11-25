/**
 * FILE: src/components/chat/ConversationHistory.jsx
 * PURPOSE: Conversation list for the Nirman AI popup (guide section 2): title (max 60 chars),
 *          last-message preview (~50 chars), relative time, active highlight and a delete
 *          button that shows on hover. Clicking a row opens that conversation.
 */

import React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/helpers";
import { PREVIEW_MAX, TITLE_MAX, plainPreview, relativeTime, truncate } from "@/lib/aiChatFormat";

export function ConversationHistory({ conversations, loading, activeId, onOpen, onDelete }) {
	if (loading && conversations.length === 0) {
		return <div className="px-3 py-8 text-center text-xs text-muted-foreground">Loading…</div>;
	}
	if (conversations.length === 0) {
		return <div className="px-3 py-8 text-center text-xs text-muted-foreground">Abhi koi conversation nahi. Naya chat shuru karein!</div>;
	}
	return (
		<ul className="space-y-1 p-2" data-testid="conversation-history">
			{conversations.map((c) => {
				const preview = plainPreview(c.lastMessagePreview || c.lastMessage?.content || "");
				return (
					<li
						key={c.id}
						data-testid="conversation-item"
						onClick={() => onOpen(c.id)}
						className={cn(
							"group flex cursor-pointer items-start gap-2 rounded-lg px-2.5 py-2 chat-interactive",
							activeId === c.id ? "bg-primary/10 text-primary" : "hover:bg-muted",
						)}
					>
						<div className="min-w-0 flex-1">
							<div className="flex items-baseline justify-between gap-2">
								<span className="truncate text-xs font-semibold">{truncate(c.title || "Untitled", TITLE_MAX)}</span>
								<span className="shrink-0 text-[10px] text-muted-foreground">{relativeTime(c.lastMessageAt)}</span>
							</div>
							{preview && <div className="truncate text-[11px] text-muted-foreground">{truncate(preview, PREVIEW_MAX)}</div>}
						</div>
						<button
							type="button"
							aria-label="Delete conversation"
							title="Delete"
							onClick={(e) => {
								e.stopPropagation();
								onDelete(c);
							}}
							className="mt-0.5 shrink-0 text-muted-foreground opacity-0 chat-interactive hover:text-destructive group-hover:opacity-100 focus:opacity-100"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</li>
				);
			})}
		</ul>
	);
}
