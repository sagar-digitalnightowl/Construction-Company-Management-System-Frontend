import { Package, Clock, PackageCheck, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STATUS_ICONS = {
	available: { icon: Package, className: "text-green-500" },
	pending: { icon: Clock, className: "text-yellow-500" },
	sold: { icon: PackageCheck, className: "text-green-600" },
	booked: { icon: Calendar, className: "text-blue-500" },
};

export function StatusBadge({ status }) {
	const s = String(status || "available").toLowerCase();
	const config = STATUS_ICONS[s] || STATUS_ICONS.available;
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
