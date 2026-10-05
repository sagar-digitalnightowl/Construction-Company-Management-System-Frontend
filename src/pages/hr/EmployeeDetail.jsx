import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Clock,
	Edit,
	UserCheck,
	Loader2,
	UserX,
	Calculator,
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
import { formatDate, formatINR } from "@/lib/helpers";
import { canMutate } from "@/data/permissions";
import { EditEmployeeDialog } from "@/components/hr/EditEmployeeDialog";
import { OverviewTab } from "../../components/employeeDetail/OverviewTab";
import { AttendanceTab } from "../../components/employeeDetail/AttendanceTab";
import { LeavesTab } from "../../components/employeeDetail/LeavesTab";
import { SalaryTab } from "../../components/employeeDetail/SalaryTab";
import { StatCard } from "@/components/common/PageHeader";
import { AdvanceSummaryTab } from "./tabs/AdvanceSummaryTab";
import { PayrollPreviewDialog } from "./tabs/PayrollPreviewDialog";

export default function EmployeeDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { current } = useAuthStore();
	const canEdit = canMutate(current?.role, "hr");

	const {
		fetchEmployeeById,
		fetchEmployeeAttendanceById,
		fetchEmployeeSalarySlips,
		fetchEmployeeAdvanceSummary,
		fetchEmployeeLeaveBalance,
		fetchEmployeeCurrentShift,
		fetchLeaves,
		processLeave,
		assignShiftToEmployee,
		previewSalarySlip,
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
	const [advanceSummary, setAdvanceSummary] = useState(null);
	const [leaveBalance, setLeaveBalance] = useState(null);
	const [shift, setShift] = useState(null);
	const [employeeLeaves, setEmployeeLeaves] = useState([]);

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [payrollPreviewOpen, setPayrollPreviewOpen] = useState(false);
	const [assignShiftDialogOpen, setAssignShiftDialogOpen] = useState(false);
	const [generateSalaryDialogOpen, setGenerateSalaryDialogOpen] = useState(false);
	const [selectedShiftId, setSelectedShiftId] = useState("");
	const [salaryForm, setSalaryForm] = useState({
		month: "January",
		year: new Date().getFullYear(),
	});
	const [salaryPreview, setSalaryPreview] = useState(null);
	const [advanceDeduction, setAdvanceDeduction] = useState("");
	const [previewedDeduction, setPreviewedDeduction] = useState("");
	const [previewing, setPreviewing] = useState(false);
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

	const loadAdvanceSummaryData = async () => {
		try {
			const res = await fetchEmployeeAdvanceSummary(id);
			setAdvanceSummary(res);
			return true;
		} catch (err) {
			console.error("Failed to load advance summary:", err);
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
			loadAdvanceSummaryData(),
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

	const buildSalaryPayload = () => ({
		employeeId: id,
		month: salaryForm.month,
		year: salaryForm.year,
		...(advanceDeduction !== "" && {
			manualAdvanceDeduction: Number(advanceDeduction),
		}),
	});

	const isValidDeduction = () => {
		if (advanceDeduction === "") return true;
		const amount = Number(advanceDeduction);
		return !Number.isNaN(amount) && amount >= 0;
	};

	const handleSalaryFormChange = (patch) => {
		setSalaryForm((prev) => ({ ...prev, ...patch }));
		setSalaryPreview(null);
	};

	const handleGenerateDialogChange = (open) => {
		setGenerateSalaryDialogOpen(open);
		if (!open) {
			setSalaryPreview(null);
			setAdvanceDeduction("");
			setPreviewedDeduction("");
		}
	};

	const handlePreviewSalary = async () => {
		if (!isValidDeduction()) return toast.error("Enter a valid advance deduction amount");

		setPreviewing(true);
		const data = await previewSalarySlip(buildSalaryPayload());
		setSalaryPreview(data);
		setPreviewedDeduction(advanceDeduction);
		setPreviewing(false);
	};

	const handleGenerateSalary = async () => {
		if (!isValidDeduction()) return toast.error("Enter a valid advance deduction amount");

		// Removed the totalDue check since this input is for manual deduction
		const slip = await generateSalarySlip(buildSalaryPayload());
		if (slip) {
			toast.success("Salary slip generated");
			handleGenerateDialogChange(false);
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

	const previewGross = salaryPreview?.earnings?.grossEarnings || 0;
	const previewBase = salaryPreview?.deductions?.baseDeductions || 0;

	const previewDeductions = salaryPreview?.deductions;
	const deductionRows = previewDeductions
		? [
			["Provident Fund", previewDeductions.providentFund],
			["ESI", previewDeductions.esiDeduction],
			["Professional Tax", previewDeductions.professionalTax],
			["Absent deduction", previewDeductions.absentDeduction],
			["Late deduction", previewDeductions.lateDeduction],
		]
		: [];

	const autoScenario = salaryPreview?.preview?.autoDeduction;
	const manualScenario = salaryPreview?.preview?.manualDeduction;
	const usingManual = previewedDeduction !== "" && Boolean(manualScenario);
	const previewScenario = usingManual ? manualScenario : autoScenario;
	const previewAdvanceDeducted = usingManual
		? manualScenario.actualDeducted
		: autoScenario?.advanceDeduction;
	const previewNet =
		previewScenario?.netSalary ??
		previewGross - previewBase - (previewAdvanceDeducted || 0);
	const previewTotalDue = salaryPreview?.advanceDues?.totalDue || 0;
	const previewCarriedForward = Math.max(0, previewTotalDue - (previewAdvanceDeducted || 0));
	const isManualCapped =
		usingManual && manualScenario.actualDeducted < manualScenario.requestedAmount;
	const isPreviewStale = Boolean(salaryPreview) && previewedDeduction !== advanceDeduction;

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

						<Button
							variant="outline"
							size="sm"
							onClick={() => setPayrollPreviewOpen(true)}
							className="w-full sm:w-auto"
						>
							<Calculator className="h-4 w-4 mr-1" />
							Payroll Preview
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
					<TabsTrigger value="advance-summary">Advance Summary</TabsTrigger>
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
				<TabsContent value="advance-summary">
					<AdvanceSummaryTab
						summary={advanceSummary}
					/>
				</TabsContent>

				<TabsContent value="statutory">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* PAN */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm">PAN Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">PAN Number</span>
									<span className="font-mono">
										{employee.personalDetails?.panNumber || "Not Provided"}
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Payroll Settings */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm">Payroll Settings</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Basic Rate of Wages</span>
									<span>
										{employee.jobDetails?.basicRateOfWages > 0
											? formatINR(employee.jobDetails.basicRateOfWages)
											: "Auto"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">New Salary (Revised)</span>
									<span>
										{employee.jobDetails?.newSalary > 0
											? formatINR(employee.jobDetails.newSalary)
											: "-"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Salary Payment Day</span>
									<span>{employee.jobDetails?.salaryPaymentDay || "10th of every month"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Payroll Day Divisor</span>
									<span>{employee.jobDetails?.payrollDayDivisor || 26}</span>
								</div>
								{employee.jobDetails?.khorakiPerDay > 0 && (
									<div className="flex justify-between">
										<span className="text-muted-foreground">Khoraki Per Day</span>
										<span>{formatINR(employee.jobDetails.khorakiPerDay)}</span>
									</div>
								)}
							</CardContent>
						</Card>

						{/* PF */}
						<Card>
							<CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
								<CardTitle className="text-sm">Provident Fund (PF)</CardTitle>
								<Badge variant={employee.jobDetails?.isPfApplicable ? "success" : "outline"}>
									{employee.jobDetails?.isPfApplicable ? "Applicable" : "Not Applicable"}
								</Badge>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								{employee.jobDetails?.isPfApplicable ? (
									<>
										<div className="flex justify-between">
											<span className="text-muted-foreground">PF Number</span>
											<span className="font-mono">{employee.jobDetails?.pfNumber || "-"}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">UAN Number</span>
											<span className="font-mono">
												{employee.jobDetails?.uanNumber || employee.personalDetails?.uanNumber || "-"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Employee Contribution</span>
											<span>
												{employee.jobDetails?.pfEmployeeContributionPercent != null
													? `${employee.jobDetails.pfEmployeeContributionPercent}%`
													: "-"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Joining Date</span>
											<span>{formatDate(employee.jobDetails?.pfJoiningDate) || "-"}</span>
										</div>
									</>
								) : (
									<p className="text-muted-foreground">PF is not applicable for this employee.</p>
								)}
							</CardContent>
						</Card>

						{/* ESI */}
						<Card>
							<CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
								<CardTitle className="text-sm">ESI</CardTitle>
								<Badge variant={employee.jobDetails?.isEsiApplicable ? "success" : "outline"}>
									{employee.jobDetails?.isEsiApplicable ? "Applicable" : "Not Applicable"}
								</Badge>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								{employee.jobDetails?.isEsiApplicable ? (
									<>
										<div className="flex justify-between">
											<span className="text-muted-foreground">ESI Number</span>
											<span className="font-mono">
												{employee.jobDetails?.esiNumber || employee.personalDetails?.esicNumber || "-"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Employee Contribution</span>
											<span>
												{employee.jobDetails?.esiEmployeeContributionPercent != null
													? `${employee.jobDetails.esiEmployeeContributionPercent}%`
													: "-"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Joining Date</span>
											<span>{formatDate(employee.jobDetails?.esiJoiningDate) || "-"}</span>
										</div>
									</>
								) : (
									<p className="text-muted-foreground">ESI is not applicable for this employee.</p>
								)}
							</CardContent>
						</Card>
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

			<PayrollPreviewDialog
				open={payrollPreviewOpen}
				onOpenChange={setPayrollPreviewOpen}
				employeeId={id}
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
			<Dialog open={generateSalaryDialogOpen} onOpenChange={handleGenerateDialogChange}>
				<DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Generate Salary Slip</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label>Month</Label>
								<Select value={salaryForm.month} onValueChange={(v) => handleSalaryFormChange({ month: v })}>
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
									onChange={(e) => handleSalaryFormChange({ year: parseInt(e.target.value) })}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label>Manual advance deduction (optional)</Label>
							<Input
								type="number"
								min={0}
								placeholder="Leave empty to auto-deduct the due EMI"
								value={advanceDeduction}
								onChange={(e) => setAdvanceDeduction(e.target.value)}
							/>
							<p className="text-xs text-muted-foreground">
								If you enter an amount, it is used for both the preview and the salary slip.
							</p>
						</div>

						<Button variant="outline" className="w-full" onClick={handlePreviewSalary} disabled={previewing}>
							{previewing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							{salaryPreview ? "Refresh preview" : "Preview salary slip"}
						</Button>

						{salaryPreview && (
							<div className="space-y-3 text-sm">
								<div className="rounded-md border p-3 space-y-1">
									{/* Earnings */}
									{[
										["Basic", salaryPreview.earnings?.basic],
										["HRA", salaryPreview.earnings?.hra],
										["Allowances", salaryPreview.earnings?.allowances],
										["Overtime", salaryPreview.earnings?.overtimePay],
									].map(([label, amount]) => (
										<div key={label} className="flex justify-between pl-3">
											<span className="text-muted-foreground">{label}</span>
											<span className={amount > 0 ? "text-green-600" : "text-muted-foreground"}>
												{amount > 0 ? "+ " : ""}
												{formatINR(amount ?? 0)}
											</span>
										</div>
									))}
									<div className="flex justify-between font-medium border-t pt-1">
										<span>Gross earnings</span>
										<span className="text-green-600">+ {formatINR(previewGross)}</span>
									</div>

									{/* Base deductions */}
									{deductionRows.map(([label, amount]) => (
										<div key={label} className="flex justify-between pl-3">
											<span className="text-muted-foreground">
												{label}
												{label === "ESI" && !previewDeductions.esiApplicable && (
													<span className="text-xs ml-1">(not applicable)</span>
												)}
											</span>
											<span className={amount > 0 ? "text-red-600" : "text-muted-foreground"}>
												{amount > 0 ? "− " : ""}
												{formatINR(amount ?? 0)}
											</span>
										</div>
									))}
									<div className="flex justify-between font-medium border-t pt-1">
										<span>Total base deductions</span>
										<span className="text-red-600">− {formatINR(previewBase)}</span>
									</div>

									{/* Advance */}
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Advance deduction ({usingManual ? "manual" : "auto"})
										</span>
										<span className={previewAdvanceDeducted > 0 ? "text-red-600" : "text-muted-foreground"}>
											{previewAdvanceDeducted > 0 ? "− " : ""}
											{formatINR(previewAdvanceDeducted ?? 0)}
										</span>
									</div>
									{previewTotalDue > 0 && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Carried forward</span>
											<span>{formatINR(previewCarriedForward)}</span>
										</div>
									)}
									<div className="flex justify-between">
										<span className="text-muted-foreground">Present / working days</span>
										<span>
											{salaryPreview.attendance?.presentDays ?? 0} / {salaryPreview.attendance?.totalWorkingDays ?? 0}
										</span>
									</div>
								</div>

								<div className="rounded-md border p-3 space-y-2">
									<p className="font-semibold">Advance dues</p>
									{(salaryPreview.advanceDues?.breakdown || []).length === 0 ? (
										<p className="text-muted-foreground">No advance is due for this month.</p>
									) : (
										<>
											{salaryPreview.advanceDues.breakdown.map((item, index) => (
												<div key={`${item.advanceId}-${item.installmentNumber}-${index}`} className="flex justify-between gap-2">
													<span className="text-muted-foreground">
														{item.advanceNumber} · #{item.installmentNumber} · {item.month}
														{item.isArrear && <Badge variant="warning" className="ml-2">Arrear</Badge>}
													</span>
													<span>{formatINR(item.amount)}</span>
												</div>
											))}
											<div className="flex justify-between font-medium border-t pt-2">
												<span>Total due</span>
												<span>{formatINR(salaryPreview.advanceDues.totalDue)}</span>
											</div>
											<p className="text-xs text-muted-foreground">
												Suggested deduction: {formatINR(salaryPreview.advanceDues.suggestedDeduction)}. Confirm the amount with the employee; anything not deducted is carried forward.
											</p>

											<div className="grid grid-cols-2 gap-2 pt-1">
												<div className={`rounded-md border p-2 ${!usingManual ? "border-primary bg-primary/5" : ""}`}>
													<div className="text-xs text-muted-foreground">Auto (EMI)</div>
													<div className="font-medium">{formatINR(autoScenario?.advanceDeduction)}</div>
													<div className="text-xs text-muted-foreground">Net {formatINR(autoScenario?.netSalary)}</div>
												</div>
												{manualScenario && (
													<div className={`rounded-md border p-2 ${usingManual ? "border-primary bg-primary/5" : ""}`}>
														<div className="text-xs text-muted-foreground">Manual</div>
														<div className="font-medium">{formatINR(manualScenario.actualDeducted)}</div>
														<div className="text-xs text-muted-foreground">Net {formatINR(manualScenario.netSalary)}</div>
													</div>
												)}
											</div>

											{isManualCapped && (
												<p className="text-xs text-amber-600">
													You requested {formatINR(manualScenario.requestedAmount)}, but only {formatINR(manualScenario.actualDeducted)} can be deducted from this salary.
												</p>
											)}
										</>
									)}
								</div>

								<div className="rounded-md border p-3 space-y-1">
									<div className="flex justify-between text-xs text-muted-foreground">
										<span>Gross − base deductions − advance</span>
										<span>
											{formatINR(previewGross)} − {formatINR(previewBase)} − {formatINR(previewAdvanceDeducted || 0)}
										</span>
									</div>
									<div className="flex justify-between text-base font-bold">
										<span>Net payable</span>
										<span className="text-primary">{formatINR(previewNet)}</span>
									</div>
								</div>

								{isPreviewStale && (
									<p className="text-xs text-amber-600">
										Deduction amount changed. Refresh the preview before generating.
									</p>
								)}
							</div>
						)}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => handleGenerateDialogChange(false)}>
							Cancel
						</Button>
						<Button onClick={handleGenerateSalary} disabled={!salaryPreview || isPreviewStale || loading}>
							Generate
						</Button>
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