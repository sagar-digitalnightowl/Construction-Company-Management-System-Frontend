import { Calendar, PackageCheck, Ban } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STATUS_ICONS = {
	booked: { icon: Calendar, className: "text-blue-500" },
	sold: { icon: PackageCheck, className: "text-green-600" },
	cancelled: { icon: Ban, className: "text-gray-400" },
};

export function BookingStatusBadge({ status }) {
	const s = String(status || "booked").toLowerCase();
	const config = STATUS_ICONS[s] || STATUS_ICONS.booked;
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
