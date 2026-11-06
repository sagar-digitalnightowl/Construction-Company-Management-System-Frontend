import { Archive, ArchiveRestore, MessageSquarePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initials, cn } from "@/lib/helpers";
import { ROLES } from "@/data/permissions";
import { formatChatTime } from "@/lib/chatHelpers";

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
}) {
	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center gap-2 border-b p-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						placeholder="Search conversations"
						className="pl-9"
						aria-label="Search conversations"
					/>
				</div>
				<Button size="icon" onClick={onNewChat} aria-label="New chat" title="New chat">
					<MessageSquarePlus className="size-4" />
				</Button>
			</div>

			<div className="flex items-center justify-between border-b px-3 py-2 text-xs text-muted-foreground">
				<span>{showArchived ? "Archived" : "Conversations"}</span>
				<button type="button" onClick={onToggleArchived} className="inline-flex items-center gap-1 hover:text-foreground">
					{showArchived ? <ArchiveRestore className="size-3.5" /> : <Archive className="size-3.5" />}
					{showArchived ? "Back to chats" : "Show archived"}
				</button>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto">
				{loading && conversations.length === 0 && <p className="p-4 text-sm text-muted-foreground">Loading...</p>}
				{!loading && conversations.length === 0 && (
					<p className="p-4 text-sm text-muted-foreground">
						{showArchived ? "No archived conversations." : "No conversations yet. Start a new chat."}
					</p>
				)}
				{conversations.map((conversation) => {
					const other = conversation.otherParticipant || {};
					const isActive = conversation._id === activeId;
					const isOnline = !!online[other._id] || !!other.isOnline;
					return (
						<button
							key={conversation._id}
							type="button"
							onClick={() => onSelect(conversation._id)}
							aria-current={isActive ? "true" : undefined}
							className={cn(
								"flex w-full items-center gap-3 border-b px-3 py-3 text-left hover:bg-muted/60",
								isActive && "bg-muted",
							)}
						>
							<div className="relative">
								<Avatar className="size-10">
									<AvatarFallback>{initials(other.name || "?")}</AvatarFallback>
								</Avatar>
								{isOnline && (
									<span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
								)}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between gap-2">
									<span className="truncate text-sm font-medium">{other.name || "Unknown"}</span>
									<span className="shrink-0 text-[11px] text-muted-foreground">
										{formatChatTime(conversation.lastMessageAt)}
									</span>
								</div>
								<div className="flex items-center justify-between gap-2">
									<span className="truncate text-xs text-muted-foreground">
										{conversation.lastMessagePreview
											? conversation.lastMessagePreview
											: ROLES[other.role] || "No messages yet"}
									</span>
									{conversation.unreadCount > 0 && (
										<Badge className="shrink-0 px-1.5">{conversation.unreadCount}</Badge>
									)}
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
