import { useEffect } from "react";
import { canView } from "@/data/permissions";
import { useChatStore } from "@/store/chatStore";

// Keeps the chat socket open while an eligible user is logged in, so presence and new messages work on every page.
export function useChatConnection(user) {
	const userId = user?._id ?? user?.id ?? null;
	const role = user?.role;

	useEffect(() => {
		if (!userId || !canView(role, "chat")) return undefined;
		const { connect, disconnect } = useChatStore.getState();
		connect(user);
		return () => disconnect();
		// The socket follows the user id and role only, not every profile update
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, role]);
}
