import { Clock, CheckCircle, DollarSign, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STATUS_ICONS = {
	pending: { icon: Clock, className: "text-yellow-500" },
	partial: { icon: DollarSign, className: "text-blue-500" },
	paid: { icon: CheckCircle, className: "text-emerald-500" },
	overdue: { icon: AlertTriangle, className: "text-red-600" },
};

export function InstallmentStatusBadge({ status }) {
	const s = String(status || "pending").toLowerCase();
	const config = STATUS_ICONS[s] || STATUS_ICONS.pending;
	const IconComponent = config.icon;
	
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="inline-flex items-center cursor-help">
						<IconComponent className={`h-5 w-5 ${config.className}`} />
					</span>
				</TooltipTrigger>
				<TooltipContent>
					<p className="capitalize">{s}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
