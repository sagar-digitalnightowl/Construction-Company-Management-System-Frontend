import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use `next/navigation` if Next.js
import {
	Building2,
	ChevronLeft,
	ChevronRight,
	Plus,
	Loader2,
	Eye,
	Edit,
} from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { OfficeFormDialog } from "@/components/hr/OfficeFormDialog";
import { OfficeEditDialog } from "@/components/hr/OfficeEditDialog";
import { useHR } from "@/hooks/useHR";

export function OfficesTab({
	officesData,
	onRefresh,
	onCreate,
	canCreate,
	loading, // Global table loading
}) {
	const navigate = useNavigate(); // Added for page routing

	const [createOpen, setCreateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);

	// Separated Loading States
	const [isFetchingCreate, setIsFetchingCreate] = useState(false);
	const [editLoadingId, setEditLoadingId] = useState(null);
	const [statusLoadingId, setStatusLoadingId] = useState(null);

	const [selectedOfficeData, setSelectedOfficeData] = useState(null);

	const { employees, fetchEmployees, fetchOfficeById, updateOffice, updateOfficeStatus, } = useHR();

	const offices = officesData?.offices || [];
	const pagination = officesData?.pagination || {
		page: 1,
		limit: 20,
		total: 0,
		pages: 0,
	};

	const handlePageChange = (newPage) => {
		if (newPage < 1 || newPage > pagination.pages) return;
		onRefresh({ page: newPage, limit: pagination.limit });
	};

	// 1. Create Modal Loading
	const handleOpenCreateModal = async () => {
		setIsFetchingCreate(true);
		try {
			await fetchEmployees({ limit: 1000 });
			setCreateOpen(true);
		} finally {
			setIsFetchingCreate(false);
		}
	};

	// 2. View Office Action (Routes to new page)
	const handleViewOffice = (id) => {
		navigate(`/hr/offices/${id}`); // Adjust this route to match your routing setup
	};

	// 3. Edit Modal Loading (Row Specific)
	const handleEditOffice = async (id) => {
		setEditLoadingId(id);
		try {
			const [_, data] = await Promise.all([
				fetchEmployees({ limit: 1000 }),
				fetchOfficeById(id),
			]);

			if (data) {
				setSelectedOfficeData(data);
				setEditOpen(true);
			}
		} finally {
			setEditLoadingId(null);
		}
	};

	const handleUpdateSubmit = async (id, payload) => {
		const success = await updateOffice(id, payload);
		if (success) {
			onRefresh({ page: pagination.page, limit: pagination.limit });
		}
		return success;
	};

	const handleStatusChange = async (office) => {
		setStatusLoadingId(office._id);

		try {
			const newStatus =
				office.status === "Active" ? "Inactive" : "Active";

			const success = await updateOfficeStatus(office._id, {
				status: newStatus,
			});

			if (success) {
				await onRefresh({
					page: pagination.page,
					limit: pagination.limit,
				});
			}
		} finally {
			setStatusLoadingId(null);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-muted-foreground">
						{pagination.total} office(s)
					</p>
				</div>

				{canCreate && (
					<Button
						size="sm"
						onClick={handleOpenCreateModal}
						disabled={isFetchingCreate}
					>
						{isFetchingCreate ? (
							<Loader2 className="h-3 w-3 mr-1 animate-spin" />
						) : (
							<Plus className="h-3 w-3 mr-1" />
						)}
						{isFetchingCreate ? "Loading..." : "Add Office"}
					</Button>
				)}
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Office</TableHead>
								<TableHead>Code</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>City</TableHead>
								<TableHead>Employees</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{/* Global Table Loading State */}
							{loading ? (
								<TableRow>
									<TableCell colSpan={7} className="h-32 text-center">
										<Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
									</TableCell>
								</TableRow>
							) : offices.length > 0 ? (
								offices.map((office) => {
									return (
										<TableRow key={office._id}
											className="cursor-pointer hover:bg-muted/40"
											onClick={() => handleViewOffice(office._id)}
										>
											<TableCell>
												<div className="flex items-center gap-2">
													<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
														<Building2 className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="font-medium">{office.name}</p>
														{office.isDeleted && (
															<p className="text-xs text-destructive">Deleted</p>
														)}
													</div>
												</div>
											</TableCell>

											<TableCell><span className="font-mono text-sm">{office.code || "-"}</span></TableCell>
											<TableCell>{office.officeType || "-"}</TableCell>
											<TableCell>{office.city || "-"}</TableCell>
											<TableCell>{office.employeeCount ?? 0}</TableCell>

											<TableCell>
												<div className="flex items-center gap-3">
													<Switch
														checked={office.status === "Active"}
														onCheckedChange={() => handleStatusChange(office)}
														disabled={
															statusLoadingId === office._id ||
															office.isDeleted
														}
													/>

													<Badge
														variant={
															office.status === "Active"
																? "success"
																: "destructive"
														}
													>
														{office.status || "Inactive"}
													</Badge>

													{statusLoadingId === office._id && (
														<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
													)}
												</div>
											</TableCell>

											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													{/* Navigation Button */}
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleViewOffice(office._id)}
														disabled={editLoadingId === office._id}
													>
														<Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
													</Button>

													{canCreate && (
														<Button
															variant="ghost"
															size="icon"
															onClick={(e) => {
																e.stopPropagation();
																handleEditOffice(office._id);
															}}
															disabled={editLoadingId === office._id}
														>
															{editLoadingId === office._id ? (
																<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
															) : (
																<Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
															)}
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
										No offices found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					{pagination.pages > 1 && (
						<div className="flex items-center justify-between px-4 py-3 border-t">
							<p className="text-sm text-muted-foreground">
								Page {pagination.page} of {pagination.pages}
							</p>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(pagination.page - 1)}
									disabled={pagination.page === 1}
								>
									<ChevronLeft className="h-4 w-4 mr-1" />
									Previous
								</Button>

								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(pagination.page + 1)}
									disabled={pagination.page === pagination.pages}
								>
									Next
									<ChevronRight className="h-4 w-4 ml-1" />
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<OfficeFormDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSubmit={onCreate}
				loading={loading}
				employeesList={employees?.employees || []}
			/>

			<OfficeEditDialog
				open={editOpen}
				onOpenChange={setEditOpen}
				onSubmit={handleUpdateSubmit}
				loading={loading}
				employeesList={employees?.employees || []}
				officeData={selectedOfficeData}
			/>
		</div>
	);
}