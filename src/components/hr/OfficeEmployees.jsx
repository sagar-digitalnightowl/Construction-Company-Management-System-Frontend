import React from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
	ChevronLeft,
	ChevronRight,
	Loader2,
	Users,
} from "lucide-react";

export function OfficeEmployees({
	employeesData,
	loading,
	onPageChange,
	onAddEmployees,
}) {
	const employees = employeesData?.employees || [];

	const pagination = employeesData?.pagination || {
		page: 1,
		limit: 10,
		total: 0,
		pages: 0,
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Users className="h-5 w-5 text-muted-foreground" />

					<div>
						<h2 className="text-lg font-semibold">
							Office Employees
						</h2>

						<p className="text-sm text-muted-foreground">
							{pagination.total} employee
							{pagination.total !== 1 ? "s" : ""}
						</p>
					</div>
				</div>

				<Button size="sm" onClick={onAddEmployees}>
					<Plus className="h-4 w-4 mr-1" />
					Add Employees
				</Button>
			</div>

			{employees.length === 0 ? (
				<div className="border rounded-lg py-12 text-center">
					<Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />

					<p className="text-sm text-muted-foreground">
						No employees assigned to this office.
					</p>
				</div>
			) : (
				<div className="border rounded-lg overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Employee ID</TableHead>
								<TableHead>Department</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{employees.map((employee) => (
								<TableRow key={employee._id}>
									<TableCell className="font-medium">
										{employee.name || "-"}
									</TableCell>

									<TableCell>
										<Badge variant="outline">
											{employee.employeeId || "-"}
										</Badge>
									</TableCell>

									<TableCell>
										{employee.department?.name || "-"}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{pagination.pages > 1 && (
						<div className="flex items-center justify-between px-4 py-3 border-t">
							<p className="text-sm text-muted-foreground">
								Page {pagination.page} of{" "}
								{pagination.pages}
							</p>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										onPageChange(
											pagination.page - 1,
										)
									}
									disabled={pagination.page === 1}
								>
									<ChevronLeft className="h-4 w-4 mr-1" />
									Previous
								</Button>

								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										onPageChange(
											pagination.page + 1,
										)
									}
									disabled={
										pagination.page ===
										pagination.pages
									}
								>
									Next
									<ChevronRight className="h-4 w-4 ml-1" />
								</Button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}