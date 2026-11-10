import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { filterContacts } from "@/lib/chatHelpers";
import { initials } from "@/lib/helpers";
import { ROLES } from "@/data/permissions";

export function ContactPicker({ open, onOpenChange }) {
	const [query, setQuery] = useState("");
	const contacts = useChatStore((s) => s.contacts);
	const contactsLoading = useChatStore((s) => s.contactsLoading);
	const online = useChatStore((s) => s.online);
	const loadContacts = useChatStore((s) => s.loadContacts);
	const startConversation = useChatStore((s) => s.startConversation);
	const [startingId, setStartingId] = useState(null);

	useEffect(() => {
		if (open) {
			setQuery("");
			loadContacts();
		}
	}, [open, loadContacts]);

	const visible = filterContacts(contacts, query);

	const pick = async (contact) => {
		setStartingId(contact._id);
		try {
			await startConversation(contact._id);
			onOpenChange(false);
		} catch (error) {
			// The store has already shown the message
		} finally {
			setStartingId(null);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>New chat</DialogTitle>
					<DialogDescription>Choose someone you are allowed to message.</DialogDescription>
				</DialogHeader>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search by name"
						className="pl-9"
						aria-label="Search contacts"
					/>
				</div>
				<div className="max-h-80 overflow-y-auto divide-y rounded-md border">
					{contactsLoading && <p className="p-4 text-sm text-muted-foreground">Loading contacts...</p>}
					{!contactsLoading && visible.length === 0 && (
						<p className="p-4 text-sm text-muted-foreground">No contacts found.</p>
					)}
					{visible.map((contact) => (
						<button
							key={contact._id}
							type="button"
							onClick={() => pick(contact)}
							disabled={startingId !== null}
							className="flex w-full items-center gap-3 p-3 text-left hover:bg-muted/60 disabled:opacity-60"
						>
							<div className="relative">
								<Avatar className="size-9">
									<AvatarFallback>{initials(contact.name)}</AvatarFallback>
								</Avatar>
								{online[contact._id] && (
									<span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
								)}
							</div>
							<div className="min-w-0 flex-1">
								<div className="truncate text-sm font-medium">{contact.name}</div>
								<div className="truncate text-xs text-muted-foreground">
									{ROLES[contact.role] || contact.role}
								</div>
							</div>
							{startingId === contact._id && <span className="text-xs text-muted-foreground">Opening...</span>}
						</button>
					))}
				</div>
				<div className="flex justify-end">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
