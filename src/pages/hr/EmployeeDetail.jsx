// src/pages/hr/EmployeeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Mail,
	Phone,
	Calendar,
	Clock,
	DollarSign,
	Briefcase,
	Edit,
	UserCheck,
	UserX,
	RefreshCw,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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

const statusColor = {
	Present: "success",
	Absent: "destructive",
	"Half-Day": "warning",
	Late: "secondary",
};

export default function EmployeeDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { current } = useAuthStore();
	const canEdit = canMutate(current?.role, "hr");

	// All required actions from useHR
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
		markAttendance,
		checkIn,
		checkOut,
		shifts,
		fetchShifts,
		loading,
	} = useHR();

	// Local state for the page
	const [employee, setEmployee] = useState(null);
	const [attendance, setAttendance] = useState([]);
	const [salarySlips, setSalarySlips] = useState([]);
	const [leaveBalance, setLeaveBalance] = useState(null);
	const [shift, setShift] = useState(null);
	const [employeeLeaves, setEmployeeLeaves] = useState([]);

	// Dialog states
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
	const [assignShiftDialogOpen, setAssignShiftDialogOpen] = useState(false);
	const [generateSalaryDialogOpen, setGenerateSalaryDialogOpen] =
		useState(false);

	// Form states
	const [editForm, setEditForm] = useState({ name: "", phone: "" });
	const [attendanceForm, setAttendanceForm] = useState({
		date: "",
		status: "Present",
		hoursWorked: 8,
	});
	const [salaryForm, setSalaryForm] = useState({
		month: "January",
		year: new Date().getFullYear(),
	});
	const [selectedShiftId, setSelectedShiftId] = useState("");

	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	const loadAllData = async () => {
		const emp = await fetchEmployeeById(id);
		// if (!emp) {
		//   navigate("/hr");
		//   return;
		// }
		setEmployee(emp);

		const [attRes, salRes, balRes, shiftRes, leavesRes] = await Promise.all([
			fetchEmployeeAttendanceById(id),
			fetchEmployeeSalarySlips(id),
			fetchEmployeeLeaveBalance(id),
			fetchEmployeeCurrentShift(id),
			fetchLeaves({ employeeId: id }),
		]);

		setAttendance(attRes?.data?.attendance || []);
		setSalarySlips(salRes?.data || []);
		setLeaveBalance(balRes?.data);
		setShift(shiftRes?.data);
		setEmployeeLeaves(leavesRes?.data?.leaves || []);
	};

	useEffect(() => {
		loadAllData();
		fetchShifts();
	}, [id]);

	// ----- Action Handlers -----
	const handleMarkAttendance = async () => {
		if (!attendanceForm.date) return toast.error("Date is required");
		const res = await markAttendance({
			employeeId: id,
			date: attendanceForm.date,
			status: attendanceForm.status,
			hoursWorked: Number(attendanceForm.hoursWorked),
		});
		if (res) {
			toast.success("Attendance marked");
			setAttendanceDialogOpen(false);
			await loadAllData();
		}
	};

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
			setShift(newShift?.data);
		}
	};

	const handleProcessLeave = async (leaveId, status) => {
		const success = await processLeave(leaveId, { status });
		if (success) {
			toast.success(`Leave ${status}`);
			await loadAllData();
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
			await loadAllData();
		}
	};

	const handleUpdateEmployee = async () => {
		if (!editForm.name || !editForm.phone) {
			toast.error("Name and phone are required");
			return;
		}
		const success = await updateEmployee(id, {
			name: editForm.name,
			phone: editForm.phone,
		});
		if (success) {
			toast.success("Employee updated");
			setEditDialogOpen(false);
			await loadAllData();
		}
	};

	// Helper to manually trigger check-in/out
	const handleManualCheckIn = async () => {
		const success = await checkIn(id); // Assuming checkIn accepts employeeId
		if (success) toast.success("Checked in");
		await loadAllData();
	};

	const handleManualCheckOut = async () => {
		const success = await checkOut(id); // Assuming checkOut accepts employeeId
		if (success) toast.success("Checked out");
		await loadAllData();
	};

	if (!employee && loading) return <Skeleton className="h-96" />;
	if (!employee) return null;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="sm" onClick={() => navigate("/hr")}>
						<ArrowLeft className="h-4 w-4 mr-1" /> Back
					</Button>
					<h1 className="text-2xl font-bold">{employee.name}</h1>
					<Badge variant={employee.isActive ? "success" : "destructive"}>
						{employee.isActive ? "Active" : "Inactive"}
					</Badge>
				</div>
				{canEdit && (
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={handleManualCheckIn}>
							<UserCheck className="h-4 w-4 mr-1" /> Check In
						</Button>
						<Button variant="outline" size="sm" onClick={handleManualCheckOut}>
							<UserX className="h-4 w-4 mr-1" /> Check Out
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setAssignShiftDialogOpen(true)}
						>
							<Clock className="h-4 w-4 mr-1" /> Assign Shift
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setEditForm({ name: employee.name, phone: employee.phone });
								setEditDialogOpen(true);
							}}
						>
							<Edit className="h-4 w-4 mr-1" /> Edit Profile
						</Button>
					</div>
				)}
			</div>

			{/* Info Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Role</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg font-medium">{employee.role}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Department</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{employee.department?.name || "-"}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Email</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<Mail className="inline h-3 w-3 mr-1" /> {employee.email}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Phone</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<Phone className="inline h-3 w-3 mr-1" /> {employee.phone}
						</p>
					</CardContent>
				</Card>
				{shift && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Current Shift</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								{shift.name} ({shift.startTime} - {shift.endTime})
							</p>
						</CardContent>
					</Card>
				)}
				{employee.dailyRate > 0 && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Daily Rate</CardTitle>
						</CardHeader>
						<CardContent>
							<p>₹{employee.dailyRate}</p>
						</CardContent>
					</Card>
				)}
				{employee.hourlyRate > 0 && (
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Hourly Rate</CardTitle>
						</CardHeader>
						<CardContent>
							<p>₹{employee.hourlyRate}</p>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Tabs */}
			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="attendance">Attendance</TabsTrigger>
					<TabsTrigger value="leaves">Leaves</TabsTrigger>
					<TabsTrigger value="salary">Salary</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Basic Info Card */}
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="grid grid-cols-2 gap-2">
									<div>
										<span className="font-medium">Employee ID:</span>{" "}
										{employee.employeeId || "—"}
									</div>
									<div>
										<span className="font-medium">Status:</span>{" "}
										<Badge
											variant={employee.isActive ? "success" : "destructive"}
										>
											{employee.status ||
												(employee.isActive ? "Active" : "Inactive")}
										</Badge>
									</div>
									<div>
										<span className="font-medium">Role:</span> {employee.role}
									</div>
									<div>
										<span className="font-medium">Department:</span>{" "}
										{employee.department?.name || "—"}
									</div>
									<div>
										<span className="font-medium">Department Code:</span>{" "}
										{employee.department?.code || "—"}
									</div>
									<div>
										<span className="font-medium">Joined:</span>{" "}
										{formatDate(employee.createdAt)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Job Details Card */}
						<Card>
							<CardHeader>
								<CardTitle>Job Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="grid grid-cols-2 gap-2">
									<div>
										<span className="font-medium">Designation:</span>{" "}
										{employee.jobDetails?.designation || "—"}
									</div>
									<div>
										<span className="font-medium">Employment Type:</span>{" "}
										{employee.jobDetails?.employmentType || "—"}
									</div>
									<div>
										<span className="font-medium">Joining Date:</span>{" "}
										{employee.jobDetails?.joiningDate
											? formatDate(employee.jobDetails.joiningDate)
											: "—"}
									</div>
									<div>
										<span className="font-medium">Probation (months):</span>{" "}
										{employee.jobDetails?.probationPeriodMonths || "—"}
									</div>
									<div>
										<span className="font-medium">Shift Timing:</span>{" "}
										{employee.jobDetails?.shiftTiming?.start &&
											employee.jobDetails?.shiftTiming?.end
											? `${employee.jobDetails.shiftTiming.start} - ${employee.jobDetails.shiftTiming.end}`
											: "—"}
									</div>
									<div>
										<span className="font-medium">Weekly Off:</span>{" "}
										{employee.jobDetails?.weeklyOff?.join(", ") || "—"}
									</div>
									<div>
										<span className="font-medium">Manager:</span>{" "}
										{employee.jobDetails?.manager?.name ||
											employee.jobDetails?.manager ||
											"—"}
									</div>
									<div>
										<span className="font-medium">Daily Rate:</span> ₹
										{employee.dailyRate?.toLocaleString() || 0}
									</div>
									<div>
										<span className="font-medium">Hourly Rate:</span> ₹
										{employee.hourlyRate?.toLocaleString() || 0}
									</div>
								</div>
								{employee.jobDetails?.salary && (
									<div className="mt-2 pt-2 border-t">
										<p className="font-medium mb-1">Salary Breakdown</p>
										<div className="grid grid-cols-2 gap-1 text-sm">
											<div>
												Basic: ₹
												{employee.jobDetails.salary.basic?.toLocaleString() ||
													0}
											</div>
											<div>
												HRA: ₹
												{employee.jobDetails.salary.hra?.toLocaleString() || 0}
											</div>
											<div>
												Allowances: ₹
												{employee.jobDetails.salary.allowances?.toLocaleString() ||
													0}
											</div>
											<div>
												Total CTC: ₹
												{employee.jobDetails.salary.totalCTC?.toLocaleString() ||
													0}
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Personal Details Card */}
						<Card className="md:col-span-2">
							<CardHeader>
								<CardTitle>Personal Details</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<p>
											<span className="font-medium">Date of Birth:</span>{" "}
											{employee.personalDetails?.dateOfBirth
												? formatDate(employee.personalDetails.dateOfBirth)
												: "—"}
										</p>
										<p>
											<span className="font-medium">Gender:</span>{" "}
											{employee.personalDetails?.gender || "—"}
										</p>
										<p>
											<span className="font-medium">Blood Group:</span>{" "}
											{employee.personalDetails?.bloodGroup || "—"}
										</p>
										<p>
											<span className="font-medium">Marital Status:</span>{" "}
											{employee.personalDetails?.maritalStatus || "—"}
										</p>
									</div>
									<div className="space-y-2">
										<p>
											<span className="font-medium">Aadhar Number:</span>{" "}
											{employee.personalDetails?.aadharNumber || "—"}
										</p>
										<p>
											<span className="font-medium">PAN Number:</span>{" "}
											{employee.personalDetails?.panNumber || "—"}
										</p>
										<p>
											<span className="font-medium">UAN Number:</span>{" "}
											{employee.personalDetails?.uanNumber || "—"}
										</p>
										<p>
											<span className="font-medium">ESIC Number:</span>{" "}
											{employee.personalDetails?.esicNumber || "—"}
										</p>
									</div>
									<div className="space-y-2">
										<p>
											<span className="font-medium">Emergency Contact:</span>
										</p>
										{employee.personalDetails?.emergencyContact ? (
											<div className="pl-4 text-sm">
												<p>
													Name: {employee.personalDetails.emergencyContact.name}
												</p>
												<p>
													Phone:{" "}
													{employee.personalDetails.emergencyContact.phone}
												</p>
												<p>
													Relation:{" "}
													{employee.personalDetails.emergencyContact.relation}
												</p>
											</div>
										) : (
											<p className="text-muted-foreground">—</p>
										)}
									</div>
									<div className="space-y-2">
										<p>
											<span className="font-medium">Address:</span>
										</p>
										{employee.personalDetails?.address ? (
											<div className="pl-4 text-sm">
												<p>{employee.personalDetails.address.line1 || "—"}</p>
												<p>
													{employee.personalDetails.address.city || ""}{" "}
													{employee.personalDetails.address.state || ""}{" "}
													{employee.personalDetails.address.pincode || ""}
												</p>
											</div>
										) : (
											<p className="text-muted-foreground">—</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{!employee.jobDetails && !employee.personalDetails && (
							<div className="col-span-2 text-center py-8 text-muted-foreground">
								<p>
									Employee details not yet updated. Click "Edit Profile" to add
									information.
								</p>
							</div>
						)}
					</div>
				</TabsContent>

				{/* Attendance Tab */}
				<TabsContent value="attendance">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Attendance Records</h3>
							{canEdit && (
								<Button size="sm" onClick={() => setAttendanceDialogOpen(true)}>
									<Calendar className="h-4 w-4 mr-1" /> Mark Attendance
								</Button>
							)}
						</div>
						{employee.currentMonthAttendance && (
							<div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-muted p-4 rounded-md">
								<div>
									<p className="text-sm text-muted-foreground">Present</p>
									<p className="text-xl font-bold text-green-600">
										{employee.currentMonthAttendance.present}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Absent</p>
									<p className="text-xl font-bold text-red-600">
										{employee.currentMonthAttendance.absent}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Late</p>
									<p className="text-xl font-bold text-yellow-600">
										{employee.currentMonthAttendance.late}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Half Day</p>
									<p className="text-xl font-bold text-orange-600">
										{employee.currentMonthAttendance.halfDay}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Total Hours</p>
									<p className="text-xl font-bold">
										{employee.currentMonthAttendance.totalHours}
									</p>
								</div>
							</div>
						)}
						<Card>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Date</TableHead>
											<TableHead>Check-In</TableHead>
											<TableHead>Check-Out</TableHead>
											<TableHead>Hours</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{attendance.length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} className="text-center">
													No attendance records
												</TableCell>
											</TableRow>
										) : (
											attendance.map((rec) => (
												<TableRow key={rec._id}>
													<TableCell>{formatDate(rec.date)}</TableCell>
													<TableCell>
														{rec.checkInTime
															? formatDate(rec.checkInTime, "HH:mm")
															: "-"}
													</TableCell>
													<TableCell>
														{rec.checkOutTime
															? formatDate(rec.checkOutTime, "HH:mm")
															: "-"}
													</TableCell>
													<TableCell>
														{rec.totalHours?.toFixed(1) || 0}
													</TableCell>
													<TableCell>
														<Badge variant={statusColor[rec.status]}>
															{rec.status}
														</Badge>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Leaves Tab */}
				<TabsContent value="leaves">
					<div className="space-y-4">
						{leaveBalance && (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted p-4 rounded-md">
								<div>
									<p className="text-sm text-muted-foreground">Sick Leave</p>
									<p className="text-2xl font-bold">
										{leaveBalance.sickLeave || 0}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Casual Leave</p>
									<p className="text-2xl font-bold">
										{leaveBalance.casualLeave || 0}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Annual Leave</p>
									<p className="text-2xl font-bold">
										{leaveBalance.annualLeave || 0}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Emergency Leave
									</p>
									<p className="text-2xl font-bold">
										{leaveBalance.emergencyLeave || 0}
									</p>
								</div>
							</div>
						)}
						<Card>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Type</TableHead>
											<TableHead>Start Date</TableHead>
											<TableHead>End Date</TableHead>
											<TableHead>Days</TableHead>
											<TableHead>Status</TableHead>
											{canEdit && (
												<TableHead className="text-right">Actions</TableHead>
											)}
										</TableRow>
									</TableHeader>
									<TableBody>
										{employeeLeaves.length === 0 ? (
											<TableRow>
												<TableCell colSpan={6} className="text-center">
													No leave requests
												</TableCell>
											</TableRow>
										) : (
											employeeLeaves.map((leave) => (
												<TableRow key={leave._id}>
													<TableCell>{leave.leaveType}</TableCell>
													<TableCell>{formatDate(leave.startDate)}</TableCell>
													<TableCell>{formatDate(leave.endDate)}</TableCell>
													<TableCell>{leave.days}</TableCell>
													<TableCell>
														<Badge
															variant={
																leave.status === "Approved"
																	? "success"
																	: leave.status === "Pending"
																		? "warning"
																		: "destructive"
															}
														>
															{leave.status}
														</Badge>
													</TableCell>
													{canEdit && leave.status === "Pending" && (
														<TableCell className="text-right space-x-1">
															<Button
																size="sm"
																variant="ghost"
																className="text-green-600"
																onClick={() =>
																	handleProcessLeave(leave._id, "Approved")
																}
															>
																<CheckCircle className="h-4 w-4" /> Approve
															</Button>
															<Button
																size="sm"
																variant="ghost"
																className="text-red-600"
																onClick={() =>
																	handleProcessLeave(leave._id, "Rejected")
																}
															>
																<XCircle className="h-4 w-4" /> Reject
															</Button>
														</TableCell>
													)}
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Salary Tab */}
				<TabsContent value="salary">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Salary Slips</h3>
							{canEdit && (
								<Button
									size="sm"
									onClick={() => setGenerateSalaryDialogOpen(true)}
								>
									<DollarSign className="h-4 w-4 mr-1" /> Generate Salary Slip
								</Button>
							)}
						</div>
						<Card>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Month</TableHead>
											<TableHead>Year</TableHead>
											<TableHead>Basic</TableHead>
											<TableHead>HRA</TableHead>
											<TableHead>Allowances</TableHead>
											<TableHead>Deductions</TableHead>
											<TableHead>Net Pay</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{salarySlips.length === 0 ? (
											<TableRow>
												<TableCell colSpan={8} className="text-center">
													No salary slips
												</TableCell>
											</TableRow>
										) : (
											salarySlips.map((slip) => (
												<TableRow key={slip._id}>
													<TableCell>{slip.month}</TableCell>
													<TableCell>{slip.year}</TableCell>
													<TableCell>
														₹{slip.basicSalary?.toLocaleString()}
													</TableCell>
													<TableCell>₹{slip.hra?.toLocaleString()}</TableCell>
													<TableCell>
														₹{slip.allowances?.toLocaleString()}
													</TableCell>
													<TableCell>
														₹{slip.deductions?.toLocaleString()}
													</TableCell>
													<TableCell className="font-bold">
														₹{slip.netPay?.toLocaleString()}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																slip.paymentStatus === "Paid"
																	? "success"
																	: "warning"
															}
														>
															{slip.paymentStatus}
														</Badge>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* ==================== DIALOGS ==================== */}

			{/* Edit Employee Dialog */}
			<EditEmployeeDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				employee={employee}
				onSuccess={loadAllData}
			/>

			{/* Mark Attendance Dialog */}
			<Dialog
				open={attendanceDialogOpen}
				onOpenChange={setAttendanceDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Mark Attendance</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div>
							<Label>Date</Label>
							<Input
								type="date"
								value={attendanceForm.date}
								onChange={(e) =>
									setAttendanceForm({ ...attendanceForm, date: e.target.value })
								}
							/>
						</div>
						<div>
							<Label>Status</Label>
							<Select
								value={attendanceForm.status}
								onValueChange={(v) =>
									setAttendanceForm({ ...attendanceForm, status: v })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Present">Present</SelectItem>
									<SelectItem value="Absent">Absent</SelectItem>
									<SelectItem value="Half-Day">Half-Day</SelectItem>
									<SelectItem value="Late">Late</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Hours Worked</Label>
							<Input
								type="number"
								step="0.5"
								value={attendanceForm.hoursWorked}
								onChange={(e) =>
									setAttendanceForm({
										...attendanceForm,
										hoursWorked: e.target.value,
									})
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setAttendanceDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleMarkAttendance}>Mark</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Assign Shift Dialog */}
			<Dialog
				open={assignShiftDialogOpen}
				onOpenChange={setAssignShiftDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Assign Shift</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div>
							<Label>Select Shift</Label>
							<Select
								value={selectedShiftId}
								onValueChange={setSelectedShiftId}
							>
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
						<Button
							variant="outline"
							onClick={() => setAssignShiftDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleAssignShift}>Assign</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Generate Salary Dialog */}
			<Dialog
				open={generateSalaryDialogOpen}
				onOpenChange={setGenerateSalaryDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Generate Salary Slip</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div>
							<Label>Month</Label>
							<Select
								value={salaryForm.month}
								onValueChange={(v) =>
									setSalaryForm({ ...salaryForm, month: v })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{[
										"January",
										"February",
										"March",
										"April",
										"May",
										"June",
										"July",
										"August",
										"September",
										"October",
										"November",
										"December",
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
									setSalaryForm({
										...salaryForm,
										year: parseInt(e.target.value),
									})
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setGenerateSalaryDialogOpen(false)}
						>
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
