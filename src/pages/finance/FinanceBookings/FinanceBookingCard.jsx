import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/helpers";
import { ArrowRight, Building } from "lucide-react";

const FinanceBookingCard = ({ booking, onClick }) => {
	const flat = booking.flatSnapshot || {};

	const isBooked = booking.status === "booked";
	const statusColor = isBooked
		? "bg-primary/70" 
		: booking.status === "sold"
			? "bg-emerald-500/80"
			: "bg-destructive/80";

	return (
		<Card
			className="relative overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-0.5 border-border/50 hover:border-primary/40 transition-all duration-300 flex flex-col h-full bg-card"
			onClick={() => onClick(booking._id)}
		>
			{/* Subtle top indicator line for quick status recognition */}
			<div className={`absolute top-0 left-0 w-full h-1 ${statusColor}`} />

			<CardContent className="p-5 flex flex-col flex-grow justify-between space-y-5 pt-6">
				{/* Header & Main Info */}
				<div className="space-y-4">
					<div className="flex justify-between items-start">
						<span className="text-[11px] font-bold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md tracking-wider border border-border/50">
							{booking.bookingReferenceNumber}
						</span>
						<Badge variant={isBooked ? "outline" : "secondary"} className="capitalize shadow-sm">
							{booking.status}
						</Badge>
					</div>

					<div>
						<h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors" title={booking.clientId?.name || "Self"}>
							{booking.clientId?.name || "Self"}
						</h3>

						{/* Project & Unit Container */}
						<div className="flex items-center text-sm mt-2 gap-2 bg-accent/40 p-2.5 rounded-lg border border-border/30">
							<Building className="h-4 w-4 text-muted-foreground" />
							<span className="truncate font-medium text-muted-foreground">{booking.projectId?.name}</span>
							<span className="text-border">•</span>
							<span className="whitespace-nowrap font-semibold text-foreground">Flat {flat.flatNumber || "—"}</span>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-between items-center pt-4 border-t border-border/40 mt-auto">
					<span className="text-xs text-muted-foreground font-medium">
						{formatDate(booking.createdAt)}
					</span>
					{/* View Details Indicator */}
					<div className="flex items-center text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
						View Details
						<ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default FinanceBookingCard;