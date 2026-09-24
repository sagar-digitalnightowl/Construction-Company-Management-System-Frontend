import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import StatusBadge from "./StatusBadge";
import { getEffectiveFlatStatus } from "./projectUtils";

export default function FlatDetailsDialog({
	selectedFlat,
	setSelectedFlat,
}) {
	return (
		<Dialog
			open={!!selectedFlat}
			onOpenChange={() => setSelectedFlat(null)}
		>
			<DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
				<Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
					<DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="flex items-center justify-between">
								<span>Flat {selectedFlat?.flatNumber} Details</span>
								{selectedFlat && <StatusBadge status={getEffectiveFlatStatus(selectedFlat)} />}
							</DialogTitle>
							{selectedFlat && (
								<p className="text-sm text-muted-foreground">
									{selectedFlat.area} sqft · ₹{selectedFlat.price?.toLocaleString('en-IN') || 0}
								</p>
							)}
						</DialogHeader>

						{selectedFlat && (
							<div className="space-y-6">
								<div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
									<div><span className="text-muted-foreground">Bedrooms:</span> {selectedFlat.bedrooms}</div>
									<div><span className="text-muted-foreground">Bathrooms:</span> {selectedFlat.bathrooms}</div>
									<div><span className="text-muted-foreground">Facing:</span> {selectedFlat.facing || "—"}</div>
									<div><span className="text-muted-foreground">Parking:</span> {selectedFlat.parking ? "Yes" : "No"}</div>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</DialogContent>
		</Dialog>
	);
}