// Formatting helpers for the AI chat history list (guide section 2: title max 60, preview ~50, relative time).

export const TITLE_MAX = 60;
export const PREVIEW_MAX = 50;

// Cuts text to `max` characters, adding an ellipsis when it was longer.
export const truncate = (text, max) => {
	const value = (text || "").trim();
	return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
};

// Removes Markdown markers so a preview reads as plain text (the backend preview contains **bold** and bullets).
export const plainPreview = (text) =>
	(text || "")
		.replace(/\*\*(.+?)\*\*/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/^\s*(?:[-*•]|\d+[.)])\s+/gm, "")
		.replace(/^#+\s*/gm, "")
		.replace(/\s+/g, " ")
		.trim();

// "just now", "2 min ago", "3 h ago", "Yesterday", or "Nov 23" for older dates.
export const relativeTime = (iso, now = new Date()) => {
	if (!iso) return "";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	const diffMs = now.getTime() - date.getTime();
	const minutes = Math.floor(diffMs / 60000);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes} min ago`;
	const sameDay = date.toDateString() === now.toDateString();
	if (sameDay) return `${Math.floor(minutes / 60)} h ago`;
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
	return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};
