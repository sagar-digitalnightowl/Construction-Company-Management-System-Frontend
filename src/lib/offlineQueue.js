// Offline queue for the site engineer panel (backend contract: POST /site/offline/sync, GET /site/offline/pending,
// DELETE /site/offline/sync/clear). Entries are kept on the device until the server confirms them.
import api from "@/api/axios";

const QUEUE_KEY = "se.offlineQueue";
const DEVICE_KEY = "se.deviceId";
const BATCH_SIZE = 100; // the server accepts at most 100 entries per call
export const QUEUE_EVENT = "se-offline-queue-changed";

const newId = () =>
	typeof crypto !== "undefined" && crypto.randomUUID
		? crypto.randomUUID()
		: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function getDeviceId() {
	try {
		let id = localStorage.getItem(DEVICE_KEY);
		if (!id) {
			id = `device-${newId()}`;
			localStorage.setItem(DEVICE_KEY, id);
		}
		return id;
	} catch (err) {
		return "device-unknown";
	}
}

export function getQueue() {
	try {
		return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
	} catch (err) {
		return [];
	}
}

function saveQueue(queue) {
	try {
		localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
	} catch (err) {
		// storage full or blocked: the entry is not kept, so tell the user
		throw new Error("Could not save this offline. Free up space on the device and try again.");
	}
	window.dispatchEvent(new Event(QUEUE_EVENT));
}

export function enqueue({ recordType, endpoint, method = "POST", data }) {
	const entry = {
		localId: newId(),
		recordType,
		endpoint,
		method,
		data,
		clientTimestamp: new Date().toISOString(),
		lastError: null,
	};
	saveQueue([...getQueue(), entry]);
	return entry;
}

// A network error has no HTTP status. The app's axios interceptor adds a `response` object with a message
// for these errors, so the status is checked instead of the response. Server errors always have a status.
export const isNetworkError = (err) => !err?.response?.status;

// Sends a record now, or queues it when the device is offline or the connection drops mid-request.
// Returns { queued: boolean, res }.
export async function submitOrQueue({ recordType, endpoint, method = "POST", data, send }) {
	const queueIt = () => {
		enqueue({ recordType, endpoint, method, data });
		return { queued: true, res: null };
	};
	if (typeof navigator !== "undefined" && navigator.onLine === false) return queueIt();
	try {
		const res = await send(data);
		return { queued: false, res };
	} catch (err) {
		if (isNetworkError(err)) return queueIt();
		throw err;
	}
}

// Sends everything in the queue. Synced and conflicting entries are removed (the server copy wins
// for conflicts); failed entries stay so they can be retried. Returns a summary.
export async function syncQueue() {
	const summary = { synced: 0, conflict: 0, failed: 0, pending: 0 };
	const queue = getQueue();
	if (queue.length === 0) return summary;

	const deviceId = getDeviceId();
	for (let i = 0; i < queue.length; i += BATCH_SIZE) {
		const chunk = queue.slice(i, i + BATCH_SIZE);
		const entries = chunk.map(({ localId, recordType, endpoint, method, data, clientTimestamp }) => ({
			localId,
			recordType,
			endpoint,
			method,
			data,
			clientTimestamp,
		}));
		const res = await api.post("/site/offline/sync", { deviceId, entries });
		const results = res?.data?.data?.results || [];

		const remove = new Set();
		const errors = new Map();
		for (const r of results) {
			if (r.status === "synced") {
				summary.synced += 1;
				remove.add(r.localId);
			} else if (r.status === "conflict") {
				summary.conflict += 1;
				remove.add(r.localId);
			} else if (r.status === "failed") {
				summary.failed += 1;
				errors.set(r.localId, r.errorMessage || "Failed to sync");
			} else {
				summary.pending += 1;
			}
		}
		const current = getQueue()
			.filter((e) => !remove.has(e.localId))
			.map((e) => (errors.has(e.localId) ? { ...e, lastError: errors.get(e.localId) } : e));
		saveQueue(current);
	}
	return summary;
}
