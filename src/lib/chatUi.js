// Display helpers for the chat screens: date separators, message grouping and avatar colours.

// Messages sent within this gap of each other, by the same person, form one visual group
const GROUP_GAP_MS = 5 * 60 * 1000;

const dayKey = (value) => {
	const date = new Date(value);
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export function dayLabel(value, now = new Date()) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	if (dayKey(date) === dayKey(now)) return "Today";
	if (dayKey(date) === dayKey(yesterday)) return "Yesterday";
	return date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export function bubbleTime(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Builds the rows for the message list: day separators, and each message knows whether it starts or ends a group
export function buildMessageRows(messages, currentUserId) {
	const rows = [];
	messages.forEach((message, index) => {
		const previous = messages[index - 1];
		const next = messages[index + 1];
		const newDay = !previous || dayKey(previous.createdAt) !== dayKey(message.createdAt);
		if (newDay) rows.push({ type: "day", key: `day-${message._id}`, label: dayLabel(message.createdAt) });
		const senderOf = (item) => (item?.senderId && typeof item.senderId === "object" ? item.senderId._id : item?.senderId);
		const sameGroup = (other) =>
			!!other &&
			senderOf(other) === senderOf(message) &&
			Math.abs(new Date(other.createdAt) - new Date(message.createdAt)) <= GROUP_GAP_MS &&
			dayKey(other.createdAt) === dayKey(message.createdAt);
		rows.push({
			type: "message",
			key: message._id,
			message,
			mine: senderOf(message) === currentUserId,
			first: newDay || !sameGroup(previous),
			last: !sameGroup(next),
		});
	});
	return rows;
}

// Stable colour for a name, so each person keeps the same avatar colour
const AVATAR_TONES = [
	"bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200",
	"bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200",
	"bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
	"bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
	"bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200",
	"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
];

export function avatarTone(name = "") {
	let hash = 0;
	for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
	return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}
