import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, Archive, ArchiveRestore, Bell, BellOff, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { initials, cn } from "@/lib/helpers";
import { ROLES } from "@/data/permissions";
import { canDeleteMessage, idOf, isSeenBy } from "@/lib/chatHelpers";
import { avatarTone, buildMessageRows } from "@/lib/chatUi";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";

// Within this distance of the bottom, the list counts as "at the bottom" and follows new messages
const BOTTOM_THRESHOLD_PX = 120;

// Placeholder bubbles shown while the first page of messages loads
function MessageSkeleton() {
	const rows = [
		{ mine: false, width: "w-56" },
		{ mine: false, width: "w-40" },
		{ mine: true, width: "w-64" },
		{ mine: false, width: "w-72" },
		{ mine: true, width: "w-48" },
		{ mine: true, width: "w-36" },
	];
	return (
		<div className="space-y-4" aria-busy="true" aria-label="Loading messages" role="status">
			<div className="flex justify-center">
				<Skeleton className="h-5 w-20 rounded-full" />
			</div>
			{rows.map((row, index) => (
				<div key={index} className={cn("flex", row.mine ? "justify-end" : "justify-start")}>
					<Skeleton className={cn("h-11 rounded-2xl", row.width)} />
				</div>
			))}
		</div>
	);
}

function TypingBubble({ name }) {
	return (
		<div className="mt-3 flex items-end gap-2" aria-live="polite">
			<div className="flex items-center gap-1 rounded-2xl rounded-bl-md border bg-card px-3.5 py-3 shadow-sm">
				{[0, 1, 2].map((dot) => (
					<span
						key={dot}
						className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
						style={{ animationDelay: `${dot * 150}ms` }}
					/>
				))}
			</div>
			<span className="pb-1 text-[11px] text-muted-foreground">{name} is typing</span>
		</div>
	);
}

export function ChatWindow({
	conversation,
	messages,
	messagesReady,
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
	const [unseenBelow, setUnseenBelow] = useState(false);
	const listRef = useRef(null);
	const atBottom = useRef(true);
	// Height of the list before "load older" ran, so the view stays on the same message afterwards
	const heightBeforeOlder = useRef(null);

	const conversationId = conversation?._id ?? null;
	const lastMessage = messages[messages.length - 1];
	const lastMessageId = lastMessage?._id ?? null;

	// Reply, delete and scroll state belong to one conversation
	useLayoutEffect(() => {
		setReplyTo(null);
		setPendingDelete(null);
		setUnseenBelow(false);
		heightBeforeOlder.current = null;
		atBottom.current = true;
	}, [conversationId]);

	useLayoutEffect(() => {
		const list = listRef.current;
		if (!list) return;
		if (heightBeforeOlder.current !== null) {
			list.scrollTop += list.scrollHeight - heightBeforeOlder.current;
			heightBeforeOlder.current = null;
			return;
		}
		const sentByMe = lastMessage && idOf(lastMessage.senderId) === currentUserId;
		if (atBottom.current || sentByMe) {
			list.scrollTop = list.scrollHeight;
			setUnseenBelow(false);
		} else {
			setUnseenBelow(true);
		}
		// Only a new last message or a change of conversation should move the view
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastMessageId, messages.length, conversationId, typingNames.length]);

	const rows = useMemo(() => buildMessageRows(messages, currentUserId), [messages, currentUserId]);
	const byId = useMemo(() => new Map(messages.map((item) => [item._id, item])), [messages]);

	if (!conversation) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
				<div className="flex size-16 items-center justify-center rounded-full bg-card shadow-sm">
					<MessageSquare className="size-7 text-muted-foreground" />
				</div>
				<div>
					<p className="font-medium">Select a conversation</p>
					<p className="mt-1 text-sm text-muted-foreground">Choose a chat from the list, or start a new one.</p>
				</div>
			</div>
		);
	}

	const other = conversation.otherParticipant || {};
	const otherName = other.name || "Unknown";
	const online = isOnline;
	const subtitle = typingNames.length
		? null
		: `${ROLES[other.role] || other.role || "Team member"} · ${online ? "Online" : "Offline"}`;

	const onScroll = () => {
		const list = listRef.current;
		if (!list) return;
		atBottom.current = list.scrollHeight - list.scrollTop - list.clientHeight < BOTTOM_THRESHOLD_PX;
		if (atBottom.current) setUnseenBelow(false);
	};

	const jumpToLatest = () => {
		const list = listRef.current;
		if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
		setUnseenBelow(false);
	};

	const loadOlder = () => {
		heightBeforeOlder.current = listRef.current?.scrollHeight ?? null;
		onLoadOlder();
	};

	return (
		<div className="flex h-full min-h-0 flex-col">
			<header className="flex items-center gap-3 border-b bg-card px-4 py-3">
				<Button variant="ghost" size="icon" className="-ml-2 md:hidden" onClick={onBack} aria-label="Back to conversations">
					<ArrowLeft className="size-5" />
				</Button>
				<div className="relative shrink-0">
					<div className={cn("flex size-10 items-center justify-center rounded-full text-sm font-semibold", avatarTone(otherName))}>
						{initials(otherName)}
					</div>
					{online && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-emerald-500" aria-label="Online" />}
				</div>
				<div className="min-w-0 flex-1">
					<div className="truncate font-semibold leading-tight">{otherName}</div>
					<div className="mt-0.5 truncate text-xs text-muted-foreground" aria-live="polite">
						{typingNames.length ? (
							<span className="font-medium text-primary">typing...</span>
						) : (
							subtitle
						)}
					</div>
				</div>
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full"
						onClick={() => onSetMuted(conversation._id, !conversation.isMuted)}
						aria-label={conversation.isMuted ? "Unmute conversation" : "Mute conversation"}
						title={conversation.isMuted ? "Unmute notifications" : "Mute notifications"}
					>
						{conversation.isMuted ? <BellOff className="size-4" /> : <Bell className="size-4" />}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full"
						onClick={() => onSetArchived(conversation._id, !conversation.isArchived)}
						aria-label={conversation.isArchived ? "Unarchive conversation" : "Archive conversation"}
						title={conversation.isArchived ? "Move back to chats" : "Archive conversation"}
					>
						{conversation.isArchived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
					</Button>
				</div>
			</header>

			<div className="relative min-h-0 flex-1">
				<div
					ref={listRef}
					onScroll={onScroll}
					className="h-full overflow-y-auto bg-muted/30 px-4 py-4 md:px-8"
					data-testid="chat-messages"
				>
					{!messagesReady && loading && <MessageSkeleton />}

					{hasOlder && (
						<div className="mb-2 flex justify-center">
							<Button variant="outline" size="sm" className="rounded-full bg-card" onClick={loadOlder} disabled={loading}>
								{loading && <Loader2 className="size-3.5 animate-spin" />}
								Load older messages
							</Button>
						</div>
					)}

					{messagesReady && !loading && messages.length === 0 && (
						<div className="flex h-full min-h-40 flex-col items-center justify-center gap-1 text-center">
							<p className="font-medium">No messages yet</p>
							<p className="text-sm text-muted-foreground">Say hello to {otherName.split(" ")[0]} to start the conversation.</p>
						</div>
					)}

					{rows.map((row) =>
						row.type === "day" ? (
							<div key={row.key} className="my-5 flex justify-center">
								<span className="rounded-full border bg-card px-3 py-0.5 text-[11px] font-medium text-muted-foreground shadow-sm">
									{row.label}
								</span>
							</div>
						) : (
							<MessageBubble
								key={row.key}
								message={row.message}
								mine={row.mine}
								first={row.first}
								last={row.last}
								seen={row.mine && isSeenBy(messages, row.message, lastReadMessageId)}
								quoted={
									row.message.replyTo && typeof row.message.replyTo === "object"
										? row.message.replyTo
										: byId.get(idOf(row.message.replyTo))
								}
								canDelete={canDeleteMessage(row.message, currentUserId)}
								onReply={setReplyTo}
								onDelete={setPendingDelete}
							/>
						),
					)}

					{typingNames.length > 0 && <TypingBubble name={otherName.split(" ")[0]} />}
				</div>

				{unseenBelow && (
					<button
						type="button"
						onClick={jumpToLatest}
						className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-lg"
					>
						<ArrowDown className="size-3.5" />
						New messages
					</button>
				)}
			</div>

			<ConfirmDialog
				open={!!pendingDelete}
				onOpenChange={(open) => !open && setPendingDelete(null)}
				title="Delete this message?"
				description="The message will show as deleted for everyone in this conversation."
				confirmLabel="Delete"
				onConfirm={() => {
					onDelete(conversation._id, pendingDelete?._id ?? null);
					setPendingDelete(null);
				}}
			/>

			<Composer
				key={conversation._id}
				disabled={false}
				replyTo={replyTo}
				onCancelReply={() => setReplyTo(null)}
				onSend={(payload) => onSend(conversation._id, payload)}
				onTyping={(isTyping) => onTyping(conversation._id, isTyping)}
			/>
		</div>
	);
}
