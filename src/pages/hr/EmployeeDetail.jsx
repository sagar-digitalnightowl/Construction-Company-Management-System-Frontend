// // src/pages/hr/EmployeeDetail.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Mail,
	Phone,
	Calendar,
	Clock,
	DollarSign,
	Edit,
	UserCheck,
	UserX,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";
import { canMutate } from "@/data/permissions";
import { EditEmployeeDialog } from "@/components/hr/EditEmployeeDialog";

// Tab components
import { OverviewTab } from "../../components/employeeDetail/OverviewTab";
import { AttendanceTab } from "../../components/employeeDetail/AttendanceTab";
import { LeavesTab } from "../../components/employeeDetail/LeavesTab";
import { SalaryTab } from "../../components/employeeDetail/SalaryTab";
import { StatCard } from "@/components/common/PageHeader";

export default function EmployeeDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { current } = useAuthStore();
	const canEdit = canMutate(current?.role, "hr");

	const {
		fetchEmployeeById,
		fetchEmployeeAttendanceById,
		fetchEmployeeSalarySlips,
		fetchEmployeeLeaveBalance,
		fetchEmployeeCurrentShift,
		fetchLeaves,
		processLeave,
		assignShiftToEmployee,
		generateSalarySlip,
		updateEmployee,
		checkIn,
		checkOut,
		shifts,
		fetchShifts,
		loading,
	} = useHR();

	const [employee, setEmployee] = useState(null);
	const [attendance, setAttendance] = useState([]);
	const [salarySlips, setSalarySlips] = useState([]);
	const [leaveBalance, setLeaveBalance] = useState(null);
	const [shift, setShift] = useState(null);
	const [employeeLeaves, setEmployeeLeaves] = useState([]);

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [assignShiftDialogOpen, setAssignShiftDialogOpen] = useState(false);
	const [generateSalaryDialogOpen, setGenerateSalaryDialogOpen] = useState(false);
	const [selectedShiftId, setSelectedShiftId] = useState("");
	const [salaryForm, setSalaryForm] = useState({
		month: "January",
		year: new Date().getFullYear(),
	});
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	// ✅ FIXED: Individual load functions with proper error handling
	const loadEmployeeData = async () => {
		try {
			const emp = await fetchEmployeeById(id);
			if (!emp) {
				// Only navigate if it's initial load and employee not found
				if (isInitialLoad) {
					toast.error("Employee not found");
					navigate("/hr");
				}
				return false;
			}
			setEmployee(emp);
			return true;
		} catch (err) {
			console.error("Failed to load employee:", err);
			if (isInitialLoad) {
				toast.error("Failed to load employee details");
			}
			return false;
		}
	};

	const loadAttendanceData = async () => {
		try {
			const res = await fetchEmployeeAttendanceById(id);
			setAttendance(res?.records || res?.data?.records || []);
			return true;
		} catch (err) {
			console.error("Failed to load attendance:", err);
			return false;
		}
	};

	const loadSalaryData = async () => {
		try {
			const res = await fetchEmployeeSalarySlips(id);
			setSalarySlips(res || []);
			return true;
		} catch (err) {
			console.error("Failed to load salary slips:", err);
			return false;
		}
	};

	const loadLeaveBalanceData = async () => {
		try {
			const res = await fetchEmployeeLeaveBalance(id);
			setLeaveBalance(res);
			return true;
		} catch (err) {
			console.error("Failed to load leave balance:", err);
			return false;
		}
	};

	const loadShiftData = async () => {
		try {
			const res = await fetchEmployeeCurrentShift(id);
			setShift(res);
			return true;
		} catch (err) {
			console.error("Failed to load shift:", err);
			return false;
		}
	};

	const loadLeavesData = async () => {
		try {
			const res = await fetchLeaves({ employeeId: id });
			setEmployeeLeaves(res?.leaves || res?.data?.leaves || []);
			return true;
		} catch (err) {
			console.error("Failed to load leaves:", err);
			return false;
		}
	};

	// ✅ FIXED: loadAllData with error handling - won't break if one API fails
	const loadAllData = async () => {
		setIsInitialLoad(true);

		// Employee data is critical - show error if fails
		const empSuccess = await loadEmployeeData();
		if (!empSuccess && isInitialLoad) {
			return;
		}

		// Other data loads independently - won't break the page
		await Promise.allSettled([
			loadAttendanceData(),
			loadSalaryData(),
			loadLeaveBalanceData(),
			loadShiftData(),
			loadLeavesData(),
		]);

		setIsInitialLoad(false);
	};

	// ✅ NEW: Refresh only salary slips (for after generate/update)
	const refreshSalaryOnly = async () => {
		try {
			const res = await fetchEmployeeSalarySlips(id);
			setSalarySlips(res || []);
			return true;
		} catch (err) {
			console.error("Failed to refresh salary slips:", err);
			toast.error("Failed to refresh salary data");
			return false;
		}
	};

	// ✅ NEW: Refresh only attendance (for check-in/check-out)
	const refreshAttendanceOnly = async () => {
		try {
			const res = await fetchEmployeeAttendanceById(id);
			setAttendance(res?.records || res?.data?.records || []);
			return true;
		} catch (err) {
			console.error("Failed to refresh attendance:", err);
			return false;
		}
	};

	useEffect(() => {
		loadAllData();
		fetchShifts();
	}, [id]);

	const handleAssignShift = async () => {
		if (!selectedShiftId) return toast.error("Select a shift");
		const success = await assignShiftToEmployee({
			employeeId: id,
			shiftId: selectedShiftId,
			effectiveFrom: new Date().toISOString().split("T")[0],
		});
		if (success) {
			toast.success("Shift assigned");
			setAssignShiftDialogOpen(false);
			const newShift = await fetchEmployeeCurrentShift(id);
			setShift(newShift);
		}
	};

	const handleGenerateSalary = async () => {
		const slip = await generateSalarySlip({
			employeeId: id,
			month: salaryForm.month,
			year: salaryForm.year,
		});
		if (slip) {
			toast.success("Salary slip generated");
			setGenerateSalaryDialogOpen(false);
			// ✅ FIXED: Only refresh salary data, not everything
			await refreshSalaryOnly();
		}
	};

	const handleManualCheckIn = async () => {
		await checkIn(id);
		await refreshAttendanceOnly();
	};

	const handleManualCheckOut = async () => {
		await checkOut(id);
		await refreshAttendanceOnly();
	};

	const handleUpdateEmployee = async (data) => {
		const success = await updateEmployee(id, data);
		if (success) {
			await loadEmployeeData();
			setEditDialogOpen(false);
		}
	};

	// ✅ NEW: Handle salary status update refresh from SalaryTab
	const handleSalaryUpdate = async () => {
		await refreshSalaryOnly();
	};

	if (!employee && loading) return <Skeleton className="h-96" />;
	if (!employee) return null;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				{/* Employee Info */}
				<div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/hr")}
						className="shrink-0"
					>
						<ArrowLeft className="h-4 w-4 mr-1" />
						Back
					</Button>

					<h1 className="text-xl sm:text-2xl font-bold truncate max-w-full sm:max-w-[300px] lg:max-w-none">
						{employee.name}
					</h1>

					<Badge variant={employee.isActive ? "success" : "destructive"}>
						{employee.isActive ? "Active" : "Inactive"}
					</Badge>

					{employee.employeeId && (
						<Badge variant="outline" className="shrink-0">
							ID: {employee.employeeId}
						</Badge>
					)}
				</div>

				{/* Actions */}
				{canEdit && (
					<div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full lg:w-auto">
						<Button
							variant="outline"
							size="sm"
							onClick={handleManualCheckIn}
							className="w-full sm:w-auto"
						>
							<UserCheck className="h-4 w-4 mr-1" />
							Check In
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={handleManualCheckOut}
							className="w-full sm:w-auto"
						>
							<UserX className="h-4 w-4 mr-1" />
							Check Out
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => setAssignShiftDialogOpen(true)}
							className="w-full sm:w-auto"
						>
							<Clock className="h-4 w-4 mr-1" />
							Assign Shift
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => setEditDialogOpen(true)}
							className="w-full sm:w-auto"
						>
							<Edit className="h-4 w-4 mr-1" />
							Edit Profile
						</Button>
					</div>
				)}
			</div>

			{/* Info Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				<StatCard
					size="compact"
					label="Role"
					value={employee.role}
					valueClassName="text-sm"
				/>

				<StatCard
					size="compact"
					label="Department"
					value={employee.department?.name || "-"}
					valueClassName="text-sm"
				/>

				<StatCard
					size="compact"
					label="Office"
					value={employee.office?.name || "-"}
					valueClassName="text-sm"
				/>

				<StatCard
					size="compact"
					label="Email"
					value={employee.email}
					valueClassName="text-sm break-all"
				/>

				<StatCard
					size="compact"
					label="Phone"
					value={employee.phone}
					valueClassName="text-sm"
				/>

				{employee.employeeId && (
					<StatCard
						size="compact"
						label="Employee ID"
						value={employee.employeeId}
						valueClassName="text-sm font-mono"
					/>
				)}

				{employee.dailyRate > 0 && (
					<StatCard
						size="compact"
						label="Daily Rate"
						value={`₹${employee.dailyRate.toLocaleString()}`}
						valueClassName="text-sm"
					/>
				)}

				{employee.hourlyRate > 0 && (
					<StatCard
						size="compact"
						label="Hourly Rate"
						value={`₹${employee.hourlyRate.toLocaleString()}`}
						valueClassName="text-sm"
					/>
				)}

				{shift && (
					<StatCard
						size="compact"
						label="Current Shift"
						value={`${shift.shiftId?.name || shift.name} (${shift.shiftId?.startTime || shift.startTime
							} - ${shift.shiftId?.endTime || shift.endTime})`}
						valueClassName="text-sm"
					/>
				)}
			</div>

			{/* Tabs */}
			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="attendance">Attendance</TabsTrigger>
					<TabsTrigger value="leaves">Leaves</TabsTrigger>
					<TabsTrigger value="salary">Salary</TabsTrigger>
					<TabsTrigger value="statutory">Statutory</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<OverviewTab employee={employee} />
				</TabsContent>
				<TabsContent value="attendance">
					<AttendanceTab
						employee={employee}
						attendance={attendance}
						canEdit={canEdit}
					/>
				</TabsContent>
				<TabsContent value="leaves">
					<LeavesTab
						employeeLeaves={employeeLeaves}
						leaveBalance={leaveBalance}
						canEdit={canEdit}
						onProcessLeave={processLeave}
						loadAllData={loadAllData}
					/>
				</TabsContent>
				<TabsContent value="salary">
					<SalaryTab
						salarySlips={salarySlips}
						canEdit={canEdit}
						employeeId={id}
						onGenerate={() => setGenerateSalaryDialogOpen(true)}
						onStatusUpdate={handleSalaryUpdate}
					/>
				</TabsContent>

				<TabsContent value="statutory">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm">PAN Number</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="font-mono">
									{employee.personalDetails?.panNumber || "Not Provided"}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm">PF Status</CardTitle>
							</CardHeader>
							<CardContent>
								<Badge variant={employee.jobDetails?.isPfApplicable ? "success" : "outline"}>
									{employee.jobDetails?.isPfApplicable ? "Applicable" : "Not Applicable"}
								</Badge>
							</CardContent>
						</Card>

						{employee.jobDetails?.isPfApplicable && (
							<>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">PF Number</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="font-mono">{employee.jobDetails?.pfNumber || "-"}</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">UAN Number</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="font-mono">{employee.jobDetails?.uanNumber || "-"}</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">PF Employee Contribution</CardTitle>
									</CardHeader>
									<CardContent>
										<p>
											{employee.jobDetails?.pfEmployeeContributionPercent != null
												? `${employee.jobDetails.pfEmployeeContributionPercent}%`
												: "-"}
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">PF Joining Date</CardTitle>
									</CardHeader>
									<CardContent>
										<p>{formatDate(employee.jobDetails?.pfJoiningDate) || "-"}</p>
									</CardContent>
								</Card>
							</>
						)}

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm">ESI Status</CardTitle>
							</CardHeader>
							<CardContent>
								<Badge variant={employee.jobDetails?.isEsiApplicable ? "success" : "outline"}>
									{employee.jobDetails?.isEsiApplicable ? "Applicable" : "Not Applicable"}
								</Badge>
							</CardContent>
						</Card>

						{employee.jobDetails?.isEsiApplicable && (
							<>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">ESI Number</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="font-mono">{employee.jobDetails?.esiNumber || "-"}</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">ESI Employee Contribution</CardTitle>
									</CardHeader>
									<CardContent>
										<p>
											{employee.jobDetails?.esiEmployeeContributionPercent != null
												? `${employee.jobDetails.esiEmployeeContributionPercent}%`
												: "-"}
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">ESI Joining Date</CardTitle>
									</CardHeader>
									<CardContent>
										<p>{formatDate(employee.jobDetails?.esiJoiningDate) || "-"}</p>
									</CardContent>
								</Card>
							</>
						)}
					</div>
				</TabsContent>
			</Tabs>

			{/* Dialogs */}
			<EditEmployeeDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				employee={employee}
				onSuccess={loadAllData}
			/>
			<Dialog open={assignShiftDialogOpen} onOpenChange={setAssignShiftDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Assign Shift</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label>Select Shift</Label>
							<Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
								<SelectTrigger>
									<SelectValue placeholder="Choose a shift" />
								</SelectTrigger>
								<SelectContent>
									{shifts.map((s) => (
										<SelectItem key={s._id} value={s._id}>
											{s.name} ({s.startTime} - {s.endTime})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setAssignShiftDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleAssignShift}>Assign</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={generateSalaryDialogOpen} onOpenChange={setGenerateSalaryDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Generate Salary Slip</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label>Month</Label>
							<Select
								value={salaryForm.month}
								onValueChange={(v) => setSalaryForm({ ...salaryForm, month: v })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{[
										"January", "February", "March", "April", "May", "June",
										"July", "August", "September", "October", "November", "December",
									].map((m) => (
										<SelectItem key={m} value={m}>
											{m}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Year</Label>
							<Input
								type="number"
								value={salaryForm.year}
								onChange={(e) =>
									setSalaryForm({ ...salaryForm, year: parseInt(e.target.value) })
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setGenerateSalaryDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleGenerateSalary}>Generate</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<ConfirmDialog
				open={confirmDialog.open}
				onOpenChange={(v) =>
					!v && setConfirmDialog({ ...confirmDialog, open: false })
				}
				title={confirmDialog.title}
				description={confirmDialog.message}
				onConfirm={confirmDialog.onConfirm}
			/>
		</div>
	);
}