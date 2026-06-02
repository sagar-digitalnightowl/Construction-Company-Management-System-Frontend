import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Edit, Trash2, Plus, Eye, UserX } from "lucide-react";
import { CreateEmployeeDialog } from "@/components/hr/CreateEmployeeDialog";
import { ViewEmployeeDialog } from "@/components/hr/ViewEmployeeDialog";
import { DeleteEmployeeDialog } from "@/components/hr/DeleteEmployeeDialog";

export function EmployeesTab({ employees, onlyAdmin, canEdit, onRefresh }) {
	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);

	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState(null);

	const handleViewEmployee = (employeeId) => {
		setSelectedEmployeeId(employeeId);
		setViewDialogOpen(true);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<p className="text-sm text-muted-foreground">
					{employees.length} employee(s)
				</p>
				{onlyAdmin && (
					<Button size="sm" onClick={() => setDialogOpen(true)}>
						<Plus className="h-3 w-3 mr-1" /> Add Employee
					</Button>
				)}
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Department</TableHead>
								<TableHead>Status</TableHead>
								{canEdit && <TableHead className="text-right">Actions</TableHead>}
							</TableRow>
						</TableHeader>
						<TableBody>
							{employees.map((emp) => (
								<TableRow
									key={emp._id}
									className="cursor-pointer hover:bg-muted/50"
								// onClick={() => navigate(`/hr/employees/${emp._id}`)}
								>
									<TableCell className="font-medium">{emp.name}</TableCell>
									<TableCell>{emp.email}</TableCell>
									<TableCell>
										<Badge variant="outline">{emp.role}</Badge>
									</TableCell>
									<TableCell>{emp.department?.name || "-"}</TableCell>
									<TableCell>
										<Badge variant={emp.isActive ? "success" : "destructive"}>
											{emp.isActive ? "Active" : "Inactive"}
										</Badge>
									</TableCell>
									{canEdit && (
										<TableCell
											className="text-right"
											onClick={(e) => e.stopPropagation()}
										>
											<div className="flex items-center justify-end gap-1">
												<Button
													size="icon"
													variant="ghost"
													onClick={() => handleViewEmployee(emp._id)}
												>
													<Eye className="h-4 w-4" />
												</Button>

												{/* <Button
													size="icon"
													variant="ghost"
													onClick={() => handleEdit(emp)}
												>
													<Edit className="h-4 w-4" />
												</Button> */}

												{onlyAdmin && (
													<Button
														size="icon"
														variant="ghost"
														className="text-destructive"
														onClick={() => {
															setSelectedEmployee(emp);
															setDeleteOpen(true);
														}}
													>
														<UserX className="h-4 w-4" />
													</Button>
												)}
											</div>
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<CreateEmployeeDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSuccess={onRefresh}
			/>

			<ViewEmployeeDialog
				open={viewDialogOpen}
				onOpenChange={(open) => {
					setViewDialogOpen(open);

					if (!open) {
						setSelectedEmployeeId(null);
					}
				}}
				employeeId={selectedEmployeeId}
			/>

			<DeleteEmployeeDialog
				open={deleteOpen}
				onOpenChange={(open) => {
					setDeleteOpen(open);

					if (!open) {
						setSelectedEmployee(null);
					}
				}}
				employee={selectedEmployee}
				onSuccess={() => {
					setDeleteOpen(false);
					setSelectedEmployee(null);
					onRefresh();
				}}
			/>
		</div>
	);
}