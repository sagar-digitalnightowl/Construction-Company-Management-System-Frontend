import { useEffect, useMemo, useState } from "react";
import { ConversationList } from "@/components/internalChat/ConversationList";
import { ChatWindow } from "@/components/internalChat/ChatWindow";
import { ContactPicker } from "@/components/internalChat/ContactPicker";
import { useChatStore } from "@/store/chatStore";
import { filterConversations } from "@/lib/chatHelpers";
import { cn } from "@/lib/helpers";

// Full-height chat workspace: conversation list on the left, the open conversation on the right.
// On small screens the two panels are shown one at a time.
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
	// Phones show the list or the open chat, not both
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
	// Show "typing" only when the other participant is typing. Our own typing is never shown, even if the server echoes it.
	const otherId = active?.otherParticipant?._id ?? null;
	const otherTyping = !!otherId && activeTyping.includes(otherId) && otherId !== currentUserId;
	const typingNames = otherTyping ? [active.otherParticipant.name] : [];
	const isOnline = !!active && (!!online[active.otherParticipant?._id] || !!active.otherParticipant?.isOnline);

	const select = (id) => {
		setMobileWindow(true);
		openConversation(id);
	};

	return (
		<div className="flex h-full min-h-0 bg-background">
			<aside
				className={cn(
					"flex min-h-0 w-full flex-col border-r md:flex md:w-80 md:shrink-0 xl:w-96",
					mobileWindow && "hidden md:flex",
				)}
			>
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
					socketStatus={socketStatus}
					archivedCount={conversations.filter((item) => item.isArchived).length}
				/>
			</aside>

			<section className={cn("flex min-h-0 min-w-0 flex-1 flex-col", !mobileWindow && "hidden md:flex")}>
				<ChatWindow
					conversation={active}
					messages={activeMessages}
					messagesReady={!!activeId && messages[activeId] !== undefined}
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
			</section>

			<ContactPicker open={pickerOpen} onOpenChange={setPickerOpen} />
		</div>
	);
}
