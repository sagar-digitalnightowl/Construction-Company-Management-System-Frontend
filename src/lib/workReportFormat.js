// Pure helpers for the site engineer work report screens: status colours, rejection reasons,
// today's count and the last used project. No React or network code here.

export const STATUS_LABEL = {
	submitted: "Submitted",
	reviewed: "Reviewed",
	forwarded: "Forwarded",
	acknowledged: "Acknowledged",
	rejected: "Rejected",
};

// Colours from the Site Engineer guide (section 15.3): submitted blue, reviewed yellow, forwarded orange,
// acknowledged green, rejected red.
export const STATUS_CLASS = {
	submitted: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
	reviewed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200",
	forwarded: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
	acknowledged: "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200",
	rejected: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
};

export const statusClass = (status) => STATUS_CLASS[status] || "bg-muted text-muted-foreground";

// The guide does not name the rejection-reason field. The review screen sends `rejectionReason`, so that is read
// first, with a few fallbacks in case the server uses another name.
export const rejectionReasonOf = (report) =>
	report?.rejectionReason || report?.rejectReason || report?.rejectionNote || null;

export const rejectedReports = (reports) => (reports || []).filter((r) => r.status === "rejected");

const dayKey = (value) => {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return null;
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const countToday = (reports, now = new Date()) => {
	const today = dayKey(now);
	return (reports || []).filter((r) => dayKey(r.createdAt) === today).length;
};

export const LAST_PROJECT_KEY = "se.lastProjectId";

// Picks the project to start a new report with: the last one used, if still assigned, else the first one.
export function pickDefaultProject(projects, saved) {
	const list = projects || [];
	if (saved && list.some((p) => p._id === saved)) return saved;
	return list[0]?._id || "";
}

// Towers, floors and flats from GET /project/:id (guide section 12). Returns empty lists when the shape is missing,
// so the form can fall back to free text.
export function towersFrom(project) {
	const towers = Array.isArray(project?.towers) ? project.towers : [];
	return towers.map((t) => ({
		towerName: t.towerName,
		floors: (Array.isArray(t.floors) ? t.floors : []).map((f) => ({
			floorNumber: String(f.floorNumber ?? ""),
			flats: (Array.isArray(f.flats) ? f.flats : []).map((flat) => String(flat.flatNumber ?? flat)),
		})),
	}));
}
