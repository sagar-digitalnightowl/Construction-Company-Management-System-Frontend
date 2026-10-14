import {
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	DollarSign,
	BanknoteIcon,
	Loader2,
	Ban,
	RefreshCw,
	Wallet,
	Package,
	PackageCheck,
	ShoppingCart,
	Calendar,
	AlertTriangle,
} from "lucide-react";

// Status icon and color mappings for consistent UI
export const STATUS_ICONS = {
	// Payment & Approval Statuses
	pending: { icon: Clock, className: "text-yellow-500" },
	approved: { icon: CheckCircle, className: "text-green-500" },
	rejected: { icon: XCircle, className: "text-red-500" },
	paid: { icon: DollarSign, className: "text-emerald-500" },
	partial: { icon: Wallet, className: "text-blue-500" },
	overdue: { icon: AlertTriangle, className: "text-red-600" },
	
	// Advance Salary & Recovery Statuses
	disbursed: { icon: BanknoteIcon, className: "text-cyan-500" },
	recovering: { icon: Loader2, className: "text-orange-500" },
	closed: { icon: CheckCircle, className: "text-gray-500" },
	cancelled: { icon: Ban, className: "text-gray-400" },
	waived: { icon: AlertCircle, className: "text-purple-500" },
	skipped: { icon: RefreshCw, className: "text-slate-500" },
	deducted: { icon: DollarSign, className: "text-indigo-500" },
	
	// Booking & Property Statuses
	booked: { icon: Calendar, className: "text-blue-500" },
	sold: { icon: PackageCheck, className: "text-green-600" },
	available: { icon: Package, className: "text-green-500" },
	
	// Workflow Statuses
	in_progress: { icon: Loader2, className: "text-blue-500" },
	completed: { icon: CheckCircle, className: "text-green-500" },
	active: { icon: CheckCircle, className: "text-emerald-500" },
	inactive: { icon: XCircle, className: "text-gray-400" },
	draft: { icon: Clock, className: "text-gray-500" },
};

// Get status icon component
export function getStatusIcon(status) {
	const normalized = String(status || "pending").toLowerCase().replace(/\s+/g, "_");
	const config = STATUS_ICONS[normalized] || STATUS_ICONS.pending;
	const IconComponent = config.icon;
	
	return {
		Icon: IconComponent,
		className: config.className,
	};
}

// Status Icon Component for inline use
export function StatusIcon({ status, size = "h-4 w-4", showTooltip = true }) {
	const { Icon, className } = getStatusIcon(status);
	
	return (
		<span className="inline-flex items-center" title={showTooltip ? status : undefined}>
			<Icon className={`${size} ${className}`} />
		</span>
	);
}
