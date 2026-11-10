import { BellOff, MessageSquarePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { initials, cn } from "@/lib/helpers";
import { ROLES } from "@/data/permissions";
import { formatChatTime } from "@/lib/chatHelpers";
import { avatarTone } from "@/lib/chatUi";

const CONNECTION = {
	connected: { label: "Live", dot: "bg-emerald-500" },
	connecting: { label: "Connecting...", dot: "bg-amber-500" },
	disconnected: { label: "Offline", dot: "bg-amber-500" },
	"auth-failed": { label: "Not connected", dot: "bg-destructive" },
};

function ConversationRow({ conversation, active, online, onSelect }) {
	const other = conversation.otherParticipant || {};
	const name = other.name || "Unknown";
	const isOnline = !!online[other._id] || !!other.isOnline;
	const unread = conversation.unreadCount > 0;

	return (
		<button
			type="button"
			onClick={() => onSelect(conversation._id)}
			aria-current={active ? "true" : undefined}
			className={cn(
				"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted",
				active && "bg-accent hover:bg-accent",
			)}
		>
			<div className="relative shrink-0">
				<div className={cn("flex size-11 items-center justify-center rounded-full text-sm font-semibold", avatarTone(name))}>
					{initials(name)}
				</div>
				{isOnline && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-emerald-500" aria-label="Online" />}
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex items-baseline justify-between gap-2">
					<span className={cn("truncate text-sm", unread ? "font-semibold" : "font-medium")}>{name}</span>
					<span className={cn("shrink-0 text-[11px]", unread ? "text-primary font-medium" : "text-muted-foreground")}>
						{formatChatTime(conversation.lastMessageAt)}
					</span>
				</div>
				<div className="mt-0.5 flex items-center justify-between gap-2">
					<span className={cn("truncate text-xs", unread ? "text-foreground" : "text-muted-foreground")}>
						{conversation.lastMessagePreview || ROLES[other.role] || "No messages yet"}
					</span>
					<span className="flex shrink-0 items-center gap-1.5">
						{conversation.isMuted && <BellOff className="size-3.5 text-muted-foreground" aria-label="Muted" />}
						{unread && (
							<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
								{conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
							</span>
						)}
					</span>
				</div>
			</div>
		</button>
	);
}

export function ConversationList({
	conversations,
	activeId,
	onSelect,
	online,
	query,
	onQueryChange,
	showArchived,
	onToggleArchived,
	onNewChat,
	loading,
	socketStatus,
	archivedCount,
}) {
	const connection = CONNECTION[socketStatus];
	const emptyText = showArchived
		? "No archived conversations."
		: query
			? "No conversations match your search."
			: archivedCount > 0
				? `All ${archivedCount === 1 ? "your chat is" : `${archivedCount} chats are`} archived. Open the Archived tab to see ${archivedCount === 1 ? "it" : "them"}.`
				: "No conversations yet. Start a new chat.";

	return (
		<div className="flex h-full min-h-0 flex-col bg-card">
			<div className="space-y-3 border-b p-4">
				<div className="flex items-center justify-between gap-2">
					<div>
						<h2 className="text-lg font-semibold leading-tight">Chats</h2>
						{connection && (
							<p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground" role="status">
								<span className={cn("size-2 rounded-full", connection.dot)} />
								{connection.label}
							</p>
						)}
					</div>
					<Button size="icon" variant="outline" className="rounded-full" onClick={onNewChat} aria-label="New chat" title="New chat">
						<MessageSquarePlus className="size-4" />
					</Button>
				</div>

				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						placeholder="Search by name"
						className="h-9 rounded-full bg-muted/50 pl-9"
						aria-label="Search conversations"
					/>
				</div>

				<div role="tablist" className="grid grid-cols-2 rounded-lg bg-muted p-1 text-sm">
					{[
						{ label: "Chats", archived: false },
						{ label: "Archived", archived: true },
					].map((tab) => (
						<button
							key={tab.label}
							type="button"
							role="tab"
							aria-selected={showArchived === tab.archived}
							onClick={() => showArchived !== tab.archived && onToggleArchived()}
							className={cn(
								"rounded-md py-1.5 font-medium transition-colors",
								showArchived === tab.archived ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
							)}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto p-2">
				{loading && conversations.length === 0 &&
					[0, 1, 2, 3].map((item) => (
						<div key={item} className="flex items-center gap-3 px-3 py-2.5">
							<Skeleton className="size-11 rounded-full" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-3.5 w-2/3" />
								<Skeleton className="h-3 w-5/6" />
							</div>
						</div>
					))}
				{!loading && conversations.length === 0 && (
					<p className="px-4 py-10 text-center text-sm text-muted-foreground">{emptyText}</p>
				)}
				{conversations.map((conversation) => (
					<ConversationRow
						key={conversation._id}
						conversation={conversation}
						active={conversation._id === activeId}
						online={online}
						onSelect={onSelect}
					/>
				))}
			</div>
		</div>
	);
}
