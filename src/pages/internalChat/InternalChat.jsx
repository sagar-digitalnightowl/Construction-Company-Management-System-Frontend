import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConversationList } from "@/components/internalChat/ConversationList";
import { ChatWindow } from "@/components/internalChat/ChatWindow";
import { ContactPicker } from "@/components/internalChat/ContactPicker";
import { useChatStore } from "@/store/chatStore";
import { filterConversations } from "@/lib/chatHelpers";
import { cn } from "@/lib/helpers";

const STATUS_TEXT = {
	idle: "",
	connecting: "Connecting...",
	connected: "",
	disconnected: "Offline. Messages will be sent over the connection when it returns.",
	"auth-failed": "Chat could not connect. Please log in again.",
};

export default function InternalChat() {
	const conversations = useChatStore((s) => s.conversations);
	const conversationsLoading = useChatStore((s) => s.conversationsLoading);
	const activeId = useChatStore((s) => s.activeId);
	const messages = useChatStore((s) => s.messages);
	const hasOlder = useChatStore((s) => s.hasOlder);
	const messagesLoading = useChatStore((s) => s.messagesLoading);
	const readUpTo = useChatStore((s) => s.readUpTo);
	const typing = useChatStore((s) => s.typing);
	const online = useChatStore((s) => s.online);
	const currentUserId = useChatStore((s) => s.currentUserId);
	const socketStatus = useChatStore((s) => s.socketStatus);
	const loadConversations = useChatStore((s) => s.loadConversations);
	const openConversation = useChatStore((s) => s.openConversation);
	const closeConversation = useChatStore((s) => s.closeConversation);
	const loadMessages = useChatStore((s) => s.loadMessages);
	const sendMessage = useChatStore((s) => s.sendMessage);
	const sendTyping = useChatStore((s) => s.sendTyping);
	const deleteMessage = useChatStore((s) => s.deleteMessage);
	const setMuted = useChatStore((s) => s.setMuted);
	const setArchived = useChatStore((s) => s.setArchived);

	const [query, setQuery] = useState("");
	const [showArchived, setShowArchived] = useState(false);
	const [pickerOpen, setPickerOpen] = useState(false);
	// On small screens the list and the window are shown one at a time
	const [mobileWindow, setMobileWindow] = useState(false);

	useEffect(() => {
		loadConversations();
		return () => closeConversation();
	}, [loadConversations, closeConversation]);

	const visible = useMemo(
		() => filterConversations(conversations, { query, showArchived }),
		[conversations, query, showArchived],
	);
	const active = conversations.find((item) => item._id === activeId) || null;
	const activeMessages = activeId ? messages[activeId] || [] : [];
	const activeTyping = (activeId && typing[activeId]) || [];
	// The server sends typing updates only for other participants, so any entry means the other person
	const typingNames =
		activeTyping.length > 0 && active?.otherParticipant?.name ? [active.otherParticipant.name] : [];
	const isOnline = !!active && (!!online[active.otherParticipant?._id] || !!active.otherParticipant?.isOnline);
	const statusText = STATUS_TEXT[socketStatus];

	const select = (id) => {
		setMobileWindow(true);
		openConversation(id);
	};

	return (
		<div className="flex h-full min-h-0 flex-col">
			<PageHeader
				eyebrow="Internal"
				title="Chat"
				description="Message management and your team. Employees can talk to management, and management can talk to everyone."
			/>
			{statusText && (
				<div className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
					{statusText}
				</div>
			)}
			<div className="grid min-h-[480px] grid-cols-1 overflow-hidden rounded-xl border bg-card md:grid-cols-[320px_1fr]" style={{ height: "calc(100vh - 13rem)" }}>
				<div className={cn("min-h-0", mobileWindow && "hidden md:block")}>
					<ConversationList
						conversations={visible}
						activeId={activeId}
						onSelect={select}
						online={online}
						query={query}
						onQueryChange={setQuery}
						showArchived={showArchived}
						onToggleArchived={() => setShowArchived((value) => !value)}
						onNewChat={() => setPickerOpen(true)}
						loading={conversationsLoading}
					/>
				</div>
				<div className={cn("min-h-0", !mobileWindow && "hidden md:block")}>
					<ChatWindow
						conversation={active}
						messages={activeMessages}
						hasOlder={!!hasOlder[activeId]}
						loading={messagesLoading}
						typingNames={typingNames}
						currentUserId={currentUserId}
						isOnline={isOnline}
						lastReadMessageId={activeId ? readUpTo[activeId] : null}
						onBack={() => setMobileWindow(false)}
						onLoadOlder={() => loadMessages(activeId, { older: true })}
						onSend={(id, payload) => sendMessage(id, payload)}
						onDelete={deleteMessage}
						onSetMuted={setMuted}
						onSetArchived={setArchived}
						onTyping={sendTyping}
					/>
				</div>
			</div>
			<ContactPicker open={pickerOpen} onOpenChange={setPickerOpen} />
		</div>
	);
}
