import {
	Eye,
	Check,
	X,
	Edit,
	Trash2,
	Plus,
	Download,
	Upload,
	Send,
	CalendarCheck,
	BadgeCheck,
	CheckSquare,
	PlusCircle,
	Pencil,
	CalendarClock,
	FileText,
	Ban,
	RefreshCw,
} from "lucide-react";

// Action button icon mappings for consistent UI
export const ACTION_ICONS = {
	view: Eye,
	approve: CheckApproval,
	reject: X,
	edit: Edit,
	delete: Trash2,
	add: Plus,
	create: PlusCircle,
	download: Download,
	upload: Upload,
	send: Send,
	entry: PlusCircle,
	pay: BadgeCheck,
	acknowledge: CheckSquare,
	extra: PlusCircle,
	cancel: Ban,
	revise: CalendarClock,
	generate: FileText,
	refresh: RefreshCw,
};

// Get action icon component
export function getActionIcon(action) {
	const normalized = String(action || "view").toLowerCase();
	return ACTION_ICONS[normalized] || Eye;
}

// Helper function for approve icon (uses CalendarCheck by default)
function CheckApproval(props) {
	return <CalendarCheck {...props} />;
}
