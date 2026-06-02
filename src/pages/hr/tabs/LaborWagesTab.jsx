import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { LaborWageDialog } from "@/components/hr/LaborWageDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function LaborWagesTab({ wages, onlyAdmin, canEdit, onRefresh }) {
	const { deleteLaborWage } = useHR();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedWage, setSelectedWage] = useState(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [deletingId, setDeletingId] = useState(null);

	const handleEdit = (wage) => {
		setSelectedWage(wage);
		setDialogOpen(true);
	};

	const handleAdd = () => {
		setSelectedWage(null);
		setDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!deletingId) return;
		await deleteLaborWage(deletingId);
		toast.success("Wage configuration deleted");
		onRefresh();
		setConfirmOpen(false);
		setDeletingId(null);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<p className="text-sm text-muted-foreground">
					{wages.length} wage configuration(s)
				</p>
				{canEdit && (
					<Button size="sm" onClick={handleAdd}>
						<Plus className="h-3 w-3 mr-1" /> Add Wage Config
					</Button>
				)}
			</div>
			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Labor Type</TableHead>
								<TableHead>Daily Wage</TableHead>
								<TableHead>Hours/Day</TableHead>
								<TableHead>Status</TableHead>
								{canEdit && (
									<TableHead className="text-right">Actions</TableHead>
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{wages.map((wage) => (
								<TableRow key={wage._id}>
									<TableCell>{wage.laborType}</TableCell>
									<TableCell>₹{wage.dailyWage}</TableCell>
									<TableCell>{wage.hoursPerDay} hrs</TableCell>
									<TableCell>
										<Badge
											variant={
												wage.isActive !== false ? "success" : "secondary"
											}
										>
											{wage.isActive !== false ? "Active" : "Inactive"}
										</Badge>
									</TableCell>
									{canEdit && (
										<TableCell className="text-right space-x-1">
											<Button
												size="icon"
												variant="ghost"
												onClick={() => handleEdit(wage)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											
											{onlyAdmin && (
												<Button
													size="icon"
													variant="ghost"
													className="text-destructive"
													onClick={() => {
														setDeletingId(wage._id);
														setConfirmOpen(true);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											)}
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			<LaborWageDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				wage={selectedWage}
				onSuccess={onRefresh}
			/>
			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete Wage Configuration"
				description="Are you sure you want to delete this wage configuration?"
				onConfirm={handleDelete}
			/>
		</div>
	);
}
