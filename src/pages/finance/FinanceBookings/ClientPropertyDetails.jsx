import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/helpers";
import { Building, FileText, User, Calendar } from "lucide-react";

export function ClientPropertyDetails({
	booking,
	flat,
}) {
	return (
		<Card className="shadow-sm border-border/60 flex flex-col">
			<CardHeader className="bg-muted/20 border-b pb-3 pt-4">
				<div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
					<CardTitle className="flex items-center gap-2 text-base">
						<User className="h-4 w-4 text-muted-foreground" />
						Client & Property Details
					</CardTitle>
					<BookingStatusBadge
						status={booking.status}
						approvalStatus={booking.approvalStatus}
						showApproval
					/>
				</div>
			</CardHeader>

			<CardContent className="p-4 space-y-4 flex-1">
				{/* Top Section: Client & Dates (2-col Grid) */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">Booking Ref</span>
						<span className="font-mono text-xs font-semibold tracking-wide bg-muted px-1.5 py-0.5 rounded border border-border/50 break-words">
							{booking.bookingReferenceNumber}
						</span>
					</div>

					<div>
						<span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">Client Name</span>
						<span className="font-semibold text-sm text-foreground break-words block truncate">
							{booking.clientId?.name || "Self"}
						</span>
						{booking.clientId?.phone && (
							<span className="block text-xs text-muted-foreground">{booking.clientId.phone}</span>
						)}
					</div>

					<div className="flex items-start gap-2">
						<Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
						<div>
							<span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-0.5">Booking Date</span>
							<span className="font-medium text-xs">{formatDate(booking.createdAt)}</span>
						</div>
					</div>

					<div className="flex items-start gap-2">
						<FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
						<div>
							<span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-0.5">Agreement</span>
							<span className="font-medium text-xs">
								{booking.agreementDate
									? formatDate(booking.agreementDate)
									: booking.agreementDocument?.signedAt
										? formatDate(booking.agreementDocument.signedAt)
										: "—"}
							</span>
						</div>
					</div>
				</div>

				<div className="border-t border-border/40" />

				{/* Bottom Section: Property Info */}
				<div className="bg-accent/20 p-3 rounded-xl border border-border/40 space-y-3">
					<div className="flex items-center gap-2">
						<Building className="h-4 w-4 text-primary/80 flex-shrink-0" />
						<span className="font-semibold text-sm truncate">{booking.projectId?.name}</span>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background p-2.5 rounded-lg border border-border/50 shadow-sm w-full">
						<div>
							<span className="text-muted-foreground block text-[10px] mb-0.5 uppercase tracking-wider">Unit</span>
							<span className="font-semibold text-xs truncate block">Flat {flat.flatNumber || "—"}</span>
						</div>
						<div>
							<span className="text-muted-foreground block text-[10px] mb-0.5 uppercase tracking-wider">Tower/Flr</span>
							<span className="font-semibold text-xs truncate block">{flat.towerName || "—"} ({flat.floor || "—"})</span>
						</div>
						<div>
							<span className="text-muted-foreground block text-[10px] mb-0.5 uppercase tracking-wider">Area</span>
							<span className="font-semibold text-xs truncate block">{flat.area ? `${flat.area} sqft` : "—"}</span>
						</div>
						<div>
							<span className="text-muted-foreground block text-[10px] mb-0.5 uppercase tracking-wider">Config</span>
							<span className="font-semibold text-xs truncate block">{flat.bedrooms ? `${flat.bedrooms} BHK` : "—"}</span>
						</div>
					</div>
				</div>

				{booking.cancellation?.reason && (
					<div className="p-2.5 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-xs">
						<span className="font-bold block mb-0.5">Cancellation Reason:</span>
						{booking.cancellation.reason}
					</div>
				)}
			</CardContent>
		</Card>
	)
}