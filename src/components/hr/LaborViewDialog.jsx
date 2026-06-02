import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useHR } from "@/hooks/useHR";

export function LaborViewDialog({
	open,
	onOpenChange,
	laborId,
}) {
	const { fetchLaborById, loading } = useHR();
	const [labor, setLabor] = useState(null);

	useEffect(() => {
		if (!open || !laborId) return;

		const loadLabor = async () => {
			const data = await fetchLaborById(laborId);
			setLabor(data);
		};

		loadLabor();
	}, [open, laborId, fetchLaborById]);

	useEffect(() => {
		if (!open) {
			setLabor(null);
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>Labor Details</DialogTitle>
				</DialogHeader>

				{loading ? (
					<div className="space-y-3">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				) : labor ? (
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-muted-foreground text-sm">Name</p>
							<p>{labor.name}</p>
						</div>

						<div>
							<p className="text-muted-foreground text-sm">Phone</p>
							<p>{labor.phone || "-"}</p>
						</div>

						<div>
							<p className="text-muted-foreground text-sm">Labor Type</p>
							<p>{labor.laborType || "-"}</p>
						</div>

						<div>
							<p className="text-muted-foreground text-sm">Trade</p>
							<p>{labor.trade || "-"}</p>
						</div>

						<div>
							<p className="text-muted-foreground text-sm">Daily Wage</p>
							<p>₹{labor.dailyWage}</p>
						</div>

						<div>
							<p className="text-muted-foreground text-sm">Status</p>
							<Badge
								variant={labor.isActive ? "success" : "destructive"}
							>
								{labor.isActive ? "Active" : "Inactive"}
							</Badge>
						</div>
					</div>
				) : (
					<p className="text-sm text-muted-foreground">
						No labor details found.
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}