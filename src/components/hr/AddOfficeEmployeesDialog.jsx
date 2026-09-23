import React, { useEffect, useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

import {
	ChevronLeft,
	ChevronRight,
	Loader2,
	Users,
} from "lucide-react";

import { useHR } from "@/hooks/useHR";

export function AddOfficeEmployeesDialog({
	open,
	onOpenChange,
	officeId,
	onSuccess,
}) {
	const {
		fetchUnassignedEmployees,
		unassignedEmployees,
		unassignedEmployeesLoading,
		assignEmployeesToOffice,
		assigningEmployees,
	} = useHR();

	const [selectedIds, setSelectedIds] = useState([]);

	const employees = unassignedEmployees?.employees || [];

	const pagination = unassignedEmployees?.pagination || {
		page: 1,
		limit: 20,
		total: 0,
		pages: 0,
	};

	useEffect(() => {
		if (!open) return;

		setSelectedIds([]);

		fetchUnassignedEmployees({
			page: 1,
			limit: 20,
		});
	}, [open, fetchUnassignedEmployees]);

	const handleSelect = (employeeId, checked) => {
		setSelectedIds((prev) => {
			if (checked) {
				return prev.includes(employeeId) ? prev : [...prev, employeeId];
			}

			return prev.filter((id) => id !== employeeId);
		});
	};

	const handleSelectAll = (checked) => {
		const currentPageIds = employees.map((employee) => employee._id);

		setSelectedIds((prev) => {
			if (checked) {
				return [
					...prev,
					...currentPageIds.filter((id) => !prev.includes(id)),
				];
			}

			return prev.filter((id) => !currentPageIds.includes(id));
		});
	};

	const handlePageChange = (page) => {
		fetchUnassignedEmployees({
			page,
			limit: 20,
		});
	};

	const handleAssign = async () => {
		if (!officeId || selectedIds.length === 0) return;

		const result = await assignEmployeesToOffice({
			officeId,
			employeeIds: selectedIds,
			onlyUnassigned: true,
		});

		if (result?.success) {
			setSelectedIds([]);

			onOpenChange(false);

			onSuccess?.();
		}
	};

	const allSelected =
		employees.length > 0 &&
		employees.every((employee) => selectedIds.includes(employee._id));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Add Employees to Office
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto border rounded-lg">
					{unassignedEmployeesLoading ? (
						<div className="flex items-center justify-center py-16">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					) : employees.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 text-center">
							<Users className="h-8 w-8 text-muted-foreground mb-2" />

							<p className="font-medium">
								No unassigned employees
							</p>

							<p className="text-sm text-muted-foreground mt-1">
								All employees have already been assigned
								to an office.
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-12">
										<Checkbox
											checked={allSelected}
											onCheckedChange={
												handleSelectAll
											}
										/>
									</TableHead>

									<TableHead>Name</TableHead>
									<TableHead>Employee ID</TableHead>
									<TableHead>Department</TableHead>
									<TableHead>Role</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{employees.map((employee) => {
									const selected =
										selectedIds.includes(
											employee._id,
										);

									return (
										<TableRow
											key={employee._id}
											className={
												selected
													? "bg-muted/50"
													: ""
											}
										>
											<TableCell>
												<Checkbox
													checked={selected}
													onCheckedChange={(
														checked,
													) =>
														handleSelect(
															employee._id,
															checked,
														)
													}
												/>
											</TableCell>

											<TableCell className="font-medium">
												{employee.name}
											</TableCell>

											<TableCell>
												{employee.employeeId ||
													"-"}
											</TableCell>

											<TableCell>
												{employee.department
													?.name || "-"}
											</TableCell>

											<TableCell>
												{employee.role || "-"}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</div>

				{pagination.pages > 1 && (
					<div className="flex items-center justify-between border-t pt-3">
						<p className="text-sm text-muted-foreground">
							Page {pagination.page} of{" "}
							{pagination.pages}
						</p>

						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={
									pagination.page === 1 ||
									unassignedEmployeesLoading
								}
								onClick={() =>
									handlePageChange(
										pagination.page - 1,
									)
								}
							>
								<ChevronLeft className="h-4 w-4 mr-1" />
								Previous
							</Button>

							<Button
								variant="outline"
								size="sm"
								disabled={
									pagination.page ===
									pagination.pages ||
									unassignedEmployeesLoading
								}
								onClick={() =>
									handlePageChange(
										pagination.page + 1,
									)
								}
							>
								Next
								<ChevronRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</div>
				)}

				{selectedIds.length > 0 && (
					<div className="text-sm text-muted-foreground">
						{selectedIds.length} employee{selectedIds.length !== 1 ? "s" : ""} selected
						across pages
					</div>
				)}

				<DialogFooter className="border-t pt-3">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={assigningEmployees}
					>
						Cancel
					</Button>

					<Button
						onClick={handleAssign}
						disabled={
							selectedIds.length === 0 ||
							assigningEmployees
						}
					>
						{assigningEmployees && (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						)}

						Assign{" "}
						{selectedIds.length > 0
							? `${selectedIds.length} `
							: ""}
						Employee
						{selectedIds.length !== 1 ? "s" : ""}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}