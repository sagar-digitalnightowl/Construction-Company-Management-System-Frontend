// Offline sync UI for the site engineer panel.
// OfflineSyncWatcher: mounted once in the shell; syncs the queue when the connection returns.
// OfflineSyncBar: shows how many entries are waiting, with a "Sync now" button.
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQueue, QUEUE_EVENT, syncQueue } from "@/lib/offlineQueue";

const errMsg = (err, fallback) => err?.response?.data?.message || fallback;

function useQueueCount() {
	const [count, setCount] = useState(() => getQueue().length);
	useEffect(() => {
		const update = () => setCount(getQueue().length);
		window.addEventListener(QUEUE_EVENT, update);
		window.addEventListener("storage", update);
		return () => {
			window.removeEventListener(QUEUE_EVENT, update);
			window.removeEventListener("storage", update);
		};
	}, []);
	return count;
}

// Runs one sync and reports the result. Returns false when nothing could be sent.
async function runSync({ quietWhenEmpty = true } = {}) {
	if (getQueue().length === 0) return false;
	if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
	try {
		const s = await syncQueue();
		const parts = [];
		if (s.synced) parts.push(`${s.synced} synced`);
		if (s.conflict) parts.push(`${s.conflict} replaced by newer server data`);
		if (s.failed) parts.push(`${s.failed} failed and will be retried`);
		if (parts.length) toast.success(`Offline sync: ${parts.join(", ")}`);
		else if (!quietWhenEmpty) toast.info("Nothing to sync");
		return true;
	} catch (err) {
		toast.error(errMsg(err, "Offline sync failed. It will try again."));
		return false;
	}
}

export function OfflineSyncWatcher() {
	useEffect(() => {
		const onOnline = () => runSync();
		window.addEventListener("online", onOnline);
		runSync(); // the device may have come back online while the app was closed
		return () => window.removeEventListener("online", onOnline);
	}, []);
	return null;
}

export function OfflineSyncBar() {
	const count = useQueueCount();
	const [busy, setBusy] = useState(false);
	const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && navigator.onLine === false);

	useEffect(() => {
		const on = () => setOffline(false);
		const off = () => setOffline(true);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);

	const syncNow = useCallback(async () => {
		setBusy(true);
		await runSync({ quietWhenEmpty: false });
		setBusy(false);
	}, []);

	if (count === 0 && !offline) return null;

	return (
		<div className="flex flex-wrap items-center gap-3 rounded-md border border-warning/40 bg-warning/10 p-3 text-sm">
			<CloudOff className="h-4 w-4 text-warning" />
			<div className="flex-1">
				{offline ? "You are offline. " : ""}
				{count > 0
					? `${count} ${count === 1 ? "entry is" : "entries are"} saved on this device and will sync when you are online.`
					: "Your entries will be saved on this device while you are offline."}
			</div>
			{count > 0 && (
				<Button size="sm" variant="outline" onClick={syncNow} disabled={busy || offline}>
					<RefreshCw className={`h-4 w-4 mr-2 ${busy ? "animate-spin" : ""}`} />
					Sync now
				</Button>
			)}
		</div>
	);
}
