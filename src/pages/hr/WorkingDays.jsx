import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Lock, Unlock, Trash2, Save, Calendar } from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export const WorkingDays = () => {
	const {
		fetchWorkingDaysList,
		workingDaysList,
		workingDaysLoading,
		saveWorkingDays,
		bulkSaveWorkingDays,
		deleteWorkingDaysEntry,
		lockWorkingDaysEntry,
		fetchActiveOffices,
		activeOffices,
		fetchDepartments,
		departments,
	} = useHR();

	// Current month as default (YYYY-MM format)
	const getCurrentMonth = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		return `${year}-${month}`;
	};

	// Filters
	const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
	const [selectedOffice, setSelectedOffice] = useState("all");
	const [selectedDepartment, setSelectedDepartment] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [includeMissing, setIncludeMissing] = useState(true);

	// Editable data
	const [editableData, setEditableData] = useState({});
	const [saving, setSaving] = useState(false);

	// Delete dialog
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);

	// Load data on mount and filter changes
	useEffect(() => {
		fetchActiveOffices();
		fetchDepartments();
	}, []);

	useEffect(() => {
		if (selectedMonth) {
			loadWorkingDays();
		}
	}, [selectedMonth, selectedOffice, selectedDepartment, includeMissing]);

	const loadWorkingDays = async () => {
		const params = {
			month: selectedMonth,
			includeMissing: includeMissing,
		};

		if (selectedOffice !== "all") {
			params.officeId = selectedOffice;
		}

		if (selectedDepartment !== "all") {
			params.departmentId = selectedDepartment;
		}

		if (searchQuery.trim()) {
			params.search = searchQuery.trim();
		}

		await fetchWorkingDaysList(params);
	};

	// Handle search with debounce
	useEffect(() => {
		const timer = setTimeout(() => {
			if (selectedMonth) {
				loadWorkingDays();
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Initialize editable data when list loads
	useEffect(() => {
		if (workingDaysList?.rows) {
			const initialData = {};
			workingDaysList.rows.forEach((row) => {
				if (row.hasEntry) {
					initialData[row.employeeId] = {
						workedDays: row.workedDays || 0,
						presentDays: row.presentDays || 0,
						halfDays: row.halfDays || 0,
						absentDays: row.absentDays || 0,
						lateDays: row.lateDays || 0,
						totalOvertimeHours: row.totalOvertimeHours || 0,
						notes: row.notes || "",
						locked: row.locked || false,
					};
				} else {
					// Initialize empty entry for employees without data
					initialData[row.employeeId] = {
						workedDays: null,
						presentDays: null,
						halfDays: null,
						absentDays: null,
						lateDays: 0,
						totalOvertimeHours: 0,
						notes: "",
						locked: false,
					};
				}
			});
			setEditableData(initialData);
		}
	}, [workingDaysList]);

	// Handle field change
	const handleFieldChange = (employeeId, field, value) => {
		setEditableData((prev) => {
			const updated = {
				...prev,
				[employeeId]: {
					...(prev[employeeId] || {}),
					[field]: value === "" ? null : parseFloat(value) || 0,
				},
			};

			// Auto-calculate workedDays if presentDays or halfDays change
			if (field === "presentDays" || field === "halfDays") {
				const present = field === "presentDays" ? (value === "" ? 0 : parseFloat(value) || 0) : (updated[employeeId].presentDays || 0);
				const half = field === "halfDays" ? (value === "" ? 0 : parseFloat(value) || 0) : (updated[employeeId].halfDays || 0);
				updated[employeeId].workedDays = present + half * 0.5;
			}

			return updated;
		});
	};

	// Save single entry
	const handleSaveSingle = async (employeeId) => {
		const data = editableData[employeeId];
		if (!data) return;

		// Validation
		if (data.presentDays === null || data.halfDays === null || data.absentDays === null) {
			toast.error("Please fill in Present, Half, and Absent days");
			return;
		}

		const payload = {
			employeeId,
			month: selectedMonth,
			...data,
		};

		const result = await saveWorkingDays(payload);
		if (result) {
			await loadWorkingDays();
		}
	};

	// Save all entries
	const handleSaveAll = async () => {
		setSaving(true);

		const entries = Object.entries(editableData)
			.filter(([employeeId, data]) => {
				// Only save if has data
				return data.presentDays !== null || data.halfDays !== null || data.absentDays !== null;
			})
			.map(([employeeId, data]) => ({
				employeeId,
				...data,
			}));

		if (entries.length === 0) {
			toast.error("No entries to save");
			setSaving(false);
			return;
		}

		const result = await bulkSaveWorkingDays({
			month: selectedMonth,
			entries,
		});

		if (result) {
			await loadWorkingDays();
		}

		setSaving(false);
	};

	// Lock/Unlock entry
	const handleToggleLock = async (employeeId, currentLocked) => {
		const result = await lockWorkingDaysEntry(employeeId, selectedMonth, !currentLocked);
		if (result) {
			await loadWorkingDays();
		}
	};

	// Delete entry
	const handleDeleteClick = (employeeId, employeeName) => {
		setDeleteTarget({ employeeId, employeeName });
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;

		const result = await deleteWorkingDaysEntry(deleteTarget.employeeId, selectedMonth);
		if (result) {
			await loadWorkingDays();
		}

		setDeleteDialogOpen(false);
		setDeleteTarget(null);
	};

	// Lock all unlocked entries
	const handleLockAll = async () => {
		const promises = workingDaysList.rows
			.filter((row) => row.hasEntry && !row.locked)
			.map((row) => lockWorkingDaysEntry(row.employeeId, selectedMonth, true));

		await Promise.all(promises);
		await loadWorkingDays();
	};

	// Filter rows based on search
	const filteredRows = useMemo(() => {
		if (!workingDaysList?.rows) return [];
		return workingDaysList.rows;
	}, [workingDaysList]);

	// Month formatter
	const formatMonth = (monthStr) => {
		if (!monthStr) return "";
		const [year, month] = monthStr.split("-");
		const date = new Date(year, parseInt(month) - 1);
		return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
	};

	return (
		<div className="space-y-4 p-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Monthly Working Days</h1>
					<p className="text-sm text-muted-foreground">
						Manage employee working days for salary calculation
					</p>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						Filters
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						{/* Month Picker */}
						<div className="space-y-2">
							<Label>Month</Label>
							<Input
								type="month"
								value={selectedMonth}
								onChange={(e) => setSelectedMonth(e.target.value)}
							/>
						</div>

						{/* Office Filter */}
						<div className="space-y-2">
							<Label>Office</Label>
							<Select value={selectedOffice} onValueChange={setSelectedOffice}>
								<SelectTrigger>
									<SelectValue placeholder="All Offices" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Offices</SelectItem>
									{activeOffices.map((office) => (
										<SelectItem key={office._id} value={office._id}>
											{office.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Department Filter */}
						<div className="space-y-2">
							<Label>Department</Label>
							<Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
								<SelectTrigger>
									<SelectValue placeholder="All Departments" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Departments</SelectItem>
									{departments.map((dept) => (
										<SelectItem key={dept._id} value={dept._id}>
											{dept.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Search */}
						<div className="space-y-2">
							<Label>Search</Label>
							<Input
								placeholder="Name, code, email..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						{/* Include Missing Toggle */}
						<div className="space-y-2">
							<Label>Options</Label>
							<div className="flex items-center space-x-2 h-9">
								<Checkbox
									id="includeMissing"
									checked={includeMissing}
									onCheckedChange={setIncludeMissing}
								/>
								<label
									htmlFor="includeMissing"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Show employees without entries
								</label>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Summary */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{workingDaysList?.total || 0}</div>
						<p className="text-xs text-muted-foreground">Total Employees</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-green-600">
							{workingDaysList?.withEntry || 0}
						</div>
						<p className="text-xs text-muted-foreground">With Entries</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-orange-600">
							{workingDaysList?.withoutEntry || 0}
						</div>
						<p className="text-xs text-muted-foreground">Without Entries</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-sm font-medium">{formatMonth(selectedMonth)}</div>
						<p className="text-xs text-muted-foreground">Selected Month</p>
					</CardContent>
				</Card>
			</div>

			{/* Table */}
			<Card>
				<CardContent className="p-0">
					{workingDaysLoading ? (
						<div className="flex items-center justify-center py-20">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : filteredRows.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground">No employees found</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[180px]">Employee</TableHead>
										<TableHead className="w-[120px]">Code</TableHead>
										<TableHead className="w-[120px]">Office</TableHead>
										<TableHead className="w-[80px] text-center">Divisor</TableHead>
										<TableHead className="w-[90px] text-center">Worked</TableHead>
										<TableHead className="w-[90px] text-center">Present</TableHead>
										<TableHead className="w-[90px] text-center">Half</TableHead>
										<TableHead className="w-[90px] text-center">Absent</TableHead>
										<TableHead className="w-[90px] text-center">Late</TableHead>
										<TableHead className="w-[90px] text-center">OT Hrs</TableHead>
										<TableHead className="w-[80px] text-center">Status</TableHead>
										<TableHead className="w-[120px] text-center">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredRows.map((row) => {
										const data = editableData[row.employeeId] || {};
										const isLocked = data.locked;
										const hasEntry = row.hasEntry;

										return (
											<TableRow key={row.employeeId}>
												<TableCell>
													<div>
														<div className="font-medium">{row.name}</div>
														<div className="text-xs text-muted-foreground">{row.role}</div>
													</div>
												</TableCell>
												<TableCell>
													<span className="text-xs font-mono">{row.employeeCode}</span>
												</TableCell>
												<TableCell>
													<span className="text-xs">{row.office?.name || "-"}</span>
												</TableCell>
												<TableCell className="text-center">
													<Badge variant="outline">{row.dayDivisor}</Badge>
												</TableCell>

												{/* Worked Days - Auto calculated */}
												<TableCell className="text-center">
													<div className="font-semibold text-green-600">
														{data.workedDays !== null && data.workedDays !== undefined
															? data.workedDays.toFixed(1)
															: "-"}
													</div>
												</TableCell>

												{/* Editable fields */}
												<TableCell className="text-center">
													<Input
														type="number"
														min="0"
														max={row.dayDivisor}
														value={data.presentDays ?? ""}
														onChange={(e) =>
															handleFieldChange(row.employeeId, "presentDays", e.target.value)
														}
														disabled={isLocked}
														className="w-16 h-8 text-center"
													/>
												</TableCell>
												<TableCell className="text-center">
													<Input
														type="number"
														min="0"
														max={row.dayDivisor}
														value={data.halfDays ?? ""}
														onChange={(e) =>
															handleFieldChange(row.employeeId, "halfDays", e.target.value)
														}
														disabled={isLocked}
														className="w-16 h-8 text-center"
													/>
												</TableCell>
												<TableCell className="text-center">
													<Input
														type="number"
														min="0"
														max={row.dayDivisor}
														value={data.absentDays ?? ""}
														onChange={(e) =>
															handleFieldChange(row.employeeId, "absentDays", e.target.value)
														}
														disabled={isLocked}
														className="w-16 h-8 text-center"
													/>
												</TableCell>
												<TableCell className="text-center">
													<Input
														type="number"
														min="0"
														value={data.lateDays ?? 0}
														onChange={(e) =>
															handleFieldChange(row.employeeId, "lateDays", e.target.value)
														}
														disabled={isLocked}
														className="w-16 h-8 text-center"
													/>
												</TableCell>
												<TableCell className="text-center">
													<Input
														type="number"
														min="0"
														value={data.totalOvertimeHours ?? 0}
														onChange={(e) =>
															handleFieldChange(row.employeeId, "totalOvertimeHours", e.target.value)
														}
														disabled={isLocked}
														className="w-16 h-8 text-center"
													/>
												</TableCell>

												{/* Status */}
												<TableCell className="text-center">
													{hasEntry ? (
														isLocked ? (
															<Badge variant="secondary">
																<Lock className="h-3 w-3 mr-1" />
																Locked
															</Badge>
														) : (
															<Badge variant="outline">
																<Unlock className="h-3 w-3 mr-1" />
																Unlocked
															</Badge>
														)
													) : (
														<Badge variant="destructive">No Entry</Badge>
													)}
												</TableCell>

												{/* Actions */}
												<TableCell className="text-center">
													<div className="flex items-center justify-center gap-1">
														{!isLocked && (
															<Button
																size="sm"
																variant="ghost"
																onClick={() => handleSaveSingle(row.employeeId)}
																title="Save"
															>
																<Save className="h-4 w-4" />
															</Button>
														)}
														{hasEntry && (
															<>
																<Button
																	size="sm"
																	variant="ghost"
																	onClick={() => handleToggleLock(row.employeeId, isLocked)}
																	title={isLocked ? "Unlock" : "Lock"}
																>
																	{isLocked ? (
																		<Unlock className="h-4 w-4" />
																	) : (
																		<Lock className="h-4 w-4" />
																	)}
																</Button>
																{!isLocked && (
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() => handleDeleteClick(row.employeeId, row.name)}
																		title="Delete"
																	>
																		<Trash2 className="h-4 w-4 text-destructive" />
																	</Button>
																)}
															</>
														)}
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Bottom Actions */}
			<div className="flex justify-between items-center">
				<p className="text-sm text-muted-foreground">
					{workingDaysList?.withEntry || 0} entries saved, {workingDaysList?.withoutEntry || 0}{" "}
					pending
				</p>
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleLockAll}>
						<Lock className="h-4 w-4 mr-2" />
						Lock All
					</Button>
					<Button onClick={handleSaveAll} disabled={saving}>
						{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
						Save All Changes
					</Button>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Working Days Entry</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete the working days entry for{" "}
							<strong>{deleteTarget?.employeeName}</strong> for {formatMonth(selectedMonth)}?
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteConfirm}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
