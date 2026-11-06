import { useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Archive, ArchiveRestore, Bell, BellOff, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/helpers";
import { ROLES } from "@/data/permissions";
import { canDeleteMessage, idOf, isSeenBy, typingText } from "@/lib/chatHelpers";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";

export function ChatWindow({
	conversation,
	messages,
	hasOlder,
	loading,
	typingNames,
	currentUserId,
	isOnline,
	lastReadMessageId,
	onBack,
	onLoadOlder,
	onSend,
	onDelete,
	onSetMuted,
	onSetArchived,
	onTyping,
}) {
	const [replyTo, setReplyTo] = useState(null);
	const [pendingDelete, setPendingDelete] = useState(null);
	const endRef = useRef(null);
	const listRef = useRef(null);
	// Height of the list before "load older" ran, so the view can stay on the same message afterwards
	const heightBeforeOlder = useRef(null);

	// Reply and scroll state belong to one conversation
	useLayoutEffect(() => {
		setReplyTo(null);
		setPendingDelete(null);
		heightBeforeOlder.current = null;
	}, [conversation?._id]);

	useLayoutEffect(() => {
		const list = listRef.current;
		if (!list) return;
		if (heightBeforeOlder.current !== null) {
			// Older messages were added above: keep the same message in view
			list.scrollTop += list.scrollHeight - heightBeforeOlder.current;
			heightBeforeOlder.current = null;
			return;
		}
		endRef.current?.scrollIntoView({ block: "end" });
	}, [conversation?._id, messages.length]);

	const loadOlder = () => {
		heightBeforeOlder.current = listRef.current?.scrollHeight ?? null;
		onLoadOlder();
	};

	if (!conversation) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
				<MessageSquare className="size-10 opacity-40" />
				<p className="text-sm">Select a conversation to start chatting.</p>
			</div>
		);
	}

	const other = conversation.otherParticipant || {};
	// Read with ?. so the render does not touch a null pending message
	const pendingId = pendingDelete?._id ?? null;
	const byId = new Map(messages.map((item) => [item._id, item]));
	const typingLabel = typingText(typingNames);

	const handleSend = async (payload) => {
		await onSend(conversation._id, payload);
	};

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center gap-3 border-b px-4 py-3">
				<Button variant="ghost" size="icon" className="md:hidden" onClick={onBack} aria-label="Back to conversations">
					<ArrowLeft className="size-4" />
				</Button>
				<div className="relative">
					<Avatar className="size-9">
						<AvatarFallback>{initials(other.name || "?")}</AvatarFallback>
					</Avatar>
					{isOnline && (
						<span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
					)}
				</div>
				<div className="min-w-0 flex-1">
					<div className="truncate text-sm font-semibold">{other.name || "Unknown"}</div>
					<div className="truncate text-xs text-muted-foreground" aria-live="polite">
						{typingLabel || `${ROLES[other.role] || other.role || ""}${other.role ? " · " : ""}${isOnline ? "Online" : "Offline"}`}
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onSetMuted(conversation._id, !conversation.isMuted)}
					aria-label={conversation.isMuted ? "Unmute conversation" : "Mute conversation"}
					title={conversation.isMuted ? "Unmute" : "Mute"}
				>
					{conversation.isMuted ? <BellOff className="size-4" /> : <Bell className="size-4" />}
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onSetArchived(conversation._id, !conversation.isArchived)}
					aria-label={conversation.isArchived ? "Unarchive conversation" : "Archive conversation"}
					title={conversation.isArchived ? "Unarchive" : "Archive"}
				>
					{conversation.isArchived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
				</Button>
			</div>

			<div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
				{hasOlder && (
					<div className="flex justify-center">
						<Button variant="outline" size="sm" onClick={loadOlder} disabled={loading}>
							{loading ? <Loader2 className="size-3.5 animate-spin" /> : null}
							Load older messages
						</Button>
					</div>
				)}
				{!loading && messages.length === 0 && (
					<p className="pt-10 text-center text-sm text-muted-foreground">No messages yet. Say hello.</p>
				)}
				{messages.map((message) => {
					const mine = idOf(message.senderId) === currentUserId;
					const quotedRaw = message.replyTo;
					const quoted = quotedRaw && typeof quotedRaw === "object" ? quotedRaw : byId.get(idOf(quotedRaw));
					return (
						<MessageBubble
							key={message._id}
							message={message}
							mine={mine}
							seen={mine && isSeenBy(messages, message, lastReadMessageId)}
							quoted={quoted}
							canDelete={canDeleteMessage(message, currentUserId)}
							onReply={setReplyTo}
							onDelete={setPendingDelete}
						/>
					);
				})}
				<div ref={endRef} />
			</div>

			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				title="Delete this message?"
				description="The message will show as deleted for everyone in this conversation."
				confirmLabel="Delete"
				onConfirm={() => {
					onDelete(conversation._id, pendingId);
					setPendingDelete(null);
				}}
			/>

			<Composer
				disabled={false}
				replyTo={replyTo}
				onCancelReply={() => setReplyTo(null)}
				onSend={handleSend}
				onTyping={(isTyping) => onTyping(conversation._id, isTyping)}
			/>
		</div>
	);
}
