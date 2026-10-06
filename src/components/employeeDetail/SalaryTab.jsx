import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { DollarSign, Download, Eye, Loader2, RefreshCcw, FileText } from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { useState } from "react";
import { toast } from "sonner";
import { formatINR } from "@/lib/helpers";
import { useAuthStore } from "@/store/authStore";

const currentMonth = () => new Date().toISOString().slice(0, 7);

export function SalaryTab({ salarySlips, canEdit, employeeId, onGenerate }) {
	const { downloadSalarySlipPdf, updateSalaryStatus, fetchEmployeeAdvanceDueForMonth, loading } = useHR();
	const { current } = useAuthStore();
	const [downloadingId, setDownloadingId] = useState(null);
	const [updatingId, setUpdatingId] = useState(null);

	// ✅ NEW: Status Update Dialog
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [selectedSlip, setSelectedSlip] = useState(null);
	const [newStatus, setNewStatus] = useState("");

	// ✅ NEW: Slip Detail Dialog
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const [selectedSlipDetail, setSelectedSlipDetail] = useState(null);

	const [dueMonth, setDueMonth] = useState(currentMonth());
	const [due, setDue] = useState(null);
	const [checkingDue, setCheckingDue] = useState(false);

	// Check if user can update status (Admin or HR Manager)
	const canUpdateStatus = current?.role === "admin" || current?.role === "hr_manager";

	const handleDownloadPdf = async (slipId) => {
		setDownloadingId(slipId);
		try {
			await downloadSalarySlipPdf(slipId);
		} finally {
			setDownloadingId(null);
		}
	};

	const handleViewPdf = (pdfUrl) => {
		if (pdfUrl) {
			window.open(pdfUrl, "_blank");
		} else {
			toast.error("PDF not available for this slip");
		}
	};

	// ✅ NEW: Open Status Update Dialog
	const handleOpenStatusDialog = (slip) => {
		setSelectedSlip(slip);
		setNewStatus(slip.paymentStatus || "Pending");
		setStatusDialogOpen(true);
	};

	// ✅ NEW: Update Status
	const handleUpdateStatus = async () => {
		if (!selectedSlip || !newStatus) return;

		setUpdatingId(selectedSlip._id);
		try {
			const success = await updateSalaryStatus(selectedSlip._id, {
				paymentStatus: newStatus,
			});
			if (success) {
				setStatusDialogOpen(false);
				setSelectedSlip(null);
				setNewStatus("");
				// Refresh data - parent component will handle this
				if (onGenerate) {
					// Trigger refresh through parent
					onGenerate();
				}
			}
		} finally {
			setUpdatingId(null);
		}
	};

	// ✅ NEW: View Slip Detail
	const handleViewDetail = (slip) => {
		setSelectedSlipDetail(slip);
		setDetailDialogOpen(true);
	};

	const handleDueMonthChange = (e) => {
		setDueMonth(e.target.value);
		setDue(null);
	};

	const handleCheckDue = async () => {
		if (!dueMonth) return;
		setCheckingDue(true);
		const data = await fetchEmployeeAdvanceDueForMonth(employeeId, dueMonth);
		setDue(data);
		setCheckingDue(false);
	};

	const getStatusBadge = (status) => {
		switch (status) {
			case "Paid":
				return "success";
			case "Processed":
				return "default";
			case "Pending":
				return "warning";
			case "Pending Finance Approval":
				return "warning";
			case "Approved":
				return "default";
			case "Sent to Bank":
				return "secondary";
			case "Bank Processed":
				return "success";
			case "Rejected":
				return "destructive";
			default:
				return "outline";
		}
	};

	const formatMonth = (monthStr) => {
		if (!monthStr) return "-";
		if (monthStr.includes("-")) {
			const [year, month] = monthStr.split("-");
			const monthNames = [
				"January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
			];
			return `${monthNames[parseInt(month) - 1]} ${year}`;
		}
		return monthStr;
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Salary Slips</h3>
				{canEdit && (
					<Button size="sm" onClick={onGenerate}>
						<DollarSign className="h-4 w-4 mr-1" /> Generate Salary Slip
					</Button>
				)}
			</div>

			{canEdit && (
				<Card>
					<CardHeader>
						<CardTitle>Advance dues for a month</CardTitle>
						<CardDescription>
							Check how much advance is due before generating the salary slip.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-wrap items-end gap-3">
							<div className="space-y-1.5">
								<Label className="text-sm">Month</Label>
								<Input type="month" value={dueMonth} onChange={handleDueMonthChange} className="w-44" />
							</div>
							<Button onClick={handleCheckDue} disabled={checkingDue || !dueMonth}>
								{checkingDue && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
								Check dues
							</Button>
						</div>
						{due && (
							<div className="space-y-3">
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
									<div>
										<div className="text-muted-foreground">Total due</div>
										<div className="font-semibold">{formatINR(due.totalDue)}</div>
									</div>
									<div>
										<div className="text-muted-foreground">Suggested deduction</div>
										<div className="font-semibold">{formatINR(due.suggestedDeduction)}</div>
									</div>
									<div>
										<div className="text-muted-foreground">Can deduct up to</div>
										<div className="font-semibold">{formatINR(due.canDeductUpTo)}</div>
									</div>
								</div>

								{(due.breakdown || []).length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No advance installment is due for {due.month || dueMonth}.
									</p>
								) : (
									<div className="rounded-md border overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Advance</TableHead>
													<TableHead>Installment</TableHead>
													<TableHead>Month</TableHead>
													<TableHead className="text-right">Amount</TableHead>
													<TableHead>Type</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{due.breakdown.map((item, index) => (
													<TableRow key={`${item.advanceId}-${item.installmentNumber}-${index}`}>
														<TableCell className="font-medium">{item.advanceNumber}</TableCell>
														<TableCell>#{item.installmentNumber}</TableCell>
														<TableCell>{item.month}</TableCell>
														<TableCell className="text-right">{formatINR(item.amount)}</TableCell>
														<TableCell>
															<Badge variant={item.isArrear ? "warning" : "outline"}>
																{item.isArrear ? "Arrear" : "Current"}
															</Badge>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			)}

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Slip No.</TableHead>
								<TableHead>Month</TableHead>
								<TableHead>Gross Earnings</TableHead>
								<TableHead>Deductions</TableHead>
								<TableHead>Net Pay</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{salarySlips.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
										<FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
										No salary slips found
									</TableCell>
								</TableRow>
							) : (
								salarySlips.map((slip) => (
									<TableRow key={slip._id}>
										<TableCell className="font-mono text-xs">
											{slip.slipNumber || "-"}
										</TableCell>
										<TableCell>{formatMonth(slip.month)}</TableCell>
										<TableCell>
											₹{(slip.grossEarnings || 0).toLocaleString('en-IN')}
										</TableCell>
										<TableCell>
											₹{(slip.totalDeductions || 0).toLocaleString('en-IN')}
										</TableCell>
										<TableCell className="font-bold">
											₹{(slip.netSalary || slip.netPay || 0).toLocaleString('en-IN')}
										</TableCell>
										<TableCell>
											<Badge variant={getStatusBadge(slip.paymentStatus)}>
												{slip.paymentStatus || "Pending"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-1">
												{/* View Detail */}
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleViewDetail(slip)}
													title="View Details"
												>
													<FileText className="h-4 w-4" />
												</Button>

												{/* View PDF */}
												{/* {slip.pdfUrl && (
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleViewPdf(slip.pdfUrl)}
														title="View PDF"
													>
														<Eye className="h-4 w-4" />
													</Button>
												)} */}

												{/* Download PDF */}
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleDownloadPdf(slip._id)}
													disabled={downloadingId === slip._id || loading}
													title="Download PDF"
												>
													{downloadingId === slip._id ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<Download className="h-4 w-4" />
													)}
												</Button>

												{/* Update Status - Only for Admin/HR */}
												{canUpdateStatus && (
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleOpenStatusDialog(slip)}
														disabled={updatingId === slip._id}
														title="Update Status"
													>
														{updatingId === slip._id ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<RefreshCcw className="h-4 w-4" />
														)}
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* ==================== STATUS UPDATE DIALOG ==================== */}
			<Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
				<DialogContent className="sm:max-w-[400px]">
					<DialogHeader>
						<DialogTitle>Update Salary Status</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						{selectedSlip && (
							<div className="bg-muted p-3 rounded-md space-y-1 text-sm">
								<p><strong>Employee:</strong> {selectedSlip.employeeId?.name || "Unknown"}</p>
								<p><strong>Slip No.:</strong> {selectedSlip.slipNumber || "-"}</p>
								<p><strong>Month:</strong> {formatMonth(selectedSlip.month)}</p>
								<p><strong>Net Pay:</strong> ₹{(selectedSlip.netSalary || selectedSlip.netPay || 0).toLocaleString('en-IN')}</p>
							</div>
						)}
						<div>
							<Label>Payment Status</Label>
							<Select value={newStatus} onValueChange={setNewStatus}>
								<SelectTrigger>
									<SelectValue placeholder="Select Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Pending">Pending</SelectItem>
									<SelectItem value="Processed">Processed</SelectItem>
									<SelectItem value="Paid">Paid</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleUpdateStatus} disabled={loading || updatingId}>
							{loading || updatingId ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Updating...
								</>
							) : (
								"Update Status"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* ==================== SLIP DETAIL DIALOG ==================== */}
			<Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
				<DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Salary Slip Details</DialogTitle>
					</DialogHeader>
					{selectedSlipDetail && (
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-2 gap-2 text-sm">
								<div>
									<p className="text-muted-foreground">Slip Number</p>
									<p className="font-medium font-mono">{selectedSlipDetail.slipNumber || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground">Month</p>
									<p className="font-medium">{formatMonth(selectedSlipDetail.month)}</p>
								</div>
							</div>

							<div className="border-t pt-3">
								<p className="font-semibold mb-2">Earnings</p>

								<div className="rounded-md border p-3 space-y-1.5 text-sm">
									{[
										["Basic", selectedSlipDetail.earnings?.basic],
										["HRA", selectedSlipDetail.earnings?.hra],
										["Allowances", selectedSlipDetail.earnings?.allowances],
										["Bonus", selectedSlipDetail.earnings?.bonus],
										["Held-back release", selectedSlipDetail.earnings?.heldBackSalary],
										["Booking bonus", selectedSlipDetail.earnings?.bookingBonus],
										["Overtime Pay", selectedSlipDetail.earnings?.overtimePay],
									].map(([label, amount]) => (
										<div key={label} className="flex justify-between">
											<span className="text-muted-foreground">{label}</span>

											<span className="text-green-600">
												{Number(amount) > 0 ? "+ " : ""}
												{formatINR(amount || 0)}
											</span>
										</div>
									))}

									<div className="flex justify-between border-t pt-2 font-semibold">
										<span>Gross Earnings</span>

										<span className="text-green-600">
											+ {formatINR(selectedSlipDetail.grossEarnings || 0)}
										</span>
									</div>
								</div>
							</div>

							<div className="border-t pt-3">
								<p className="font-semibold mb-2">Deductions</p>

								<div className="rounded-md border p-3 space-y-1.5 text-sm">
									{[
										["Provident Fund", selectedSlipDetail.deductions?.providentFund],
										["ESI", selectedSlipDetail.deductions?.esiDeduction],
										["Professional Tax", selectedSlipDetail.deductions?.professionalTax],
										["Tax Deduction", selectedSlipDetail.deductions?.taxDeduction],
										["Loan Deduction", selectedSlipDetail.deductions?.loanDeduction],
										["Absent Deduction", selectedSlipDetail.deductions?.absentDeduction],
										["Late Deduction", selectedSlipDetail.deductions?.lateDeduction],
										["Labour Welfare Fund", selectedSlipDetail.deductions?.labourWelfareFund],
										["Uniform Deduction", selectedSlipDetail.deductions?.uniformDeduction],
										["Accommodation Deduction", selectedSlipDetail.deductions?.accommodationDeduction],
										["Other Deductions", selectedSlipDetail.deductions?.otherDeductions],
										["Advance Deduction", selectedSlipDetail.deductions?.advanceDeduction],
										["Held back (booking rule)", selectedSlipDetail.deductions?.heldBackSalaryDeduction],
									].map(([label, amount]) => (
										<div key={label} className="flex justify-between">
											<span className="text-muted-foreground">{label}</span>

											<span className="text-red-600">
												{Number(amount) > 0 ? "− " : ""}
												{formatINR(amount || 0)}
											</span>
										</div>
									))}

									<div className="flex justify-between border-t pt-2 font-semibold">
										<span>Total Deductions</span>

										<span className="text-red-600">
											− {formatINR(selectedSlipDetail.totalDeductions || 0)}
										</span>
									</div>
								</div>
							</div>

							{selectedSlipDetail.deductions?.advanceDeduction > 0 && (
								<div className="border-t pt-3">
									<p className="font-semibold mb-2">Advance Recovery</p>

									<div className="rounded-md border p-3 bg-muted/30">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">
												Deducted in this slip
											</span>
											<span className="font-semibold text-red-600">
												{formatINR(
													selectedSlipDetail.deductions?.advanceDeduction || 0
												)}
											</span>
										</div>

										{selectedSlipDetail.advanceRecovery?.due != null && (
											<div className="flex justify-between text-sm mt-1">
												<span className="text-muted-foreground">
													Total due
												</span>
												<span>
													{formatINR(selectedSlipDetail.advanceRecovery.due)}
												</span>
											</div>
										)}

										{selectedSlipDetail.advanceRecovery?.carriedForward > 0 && (
											<div className="flex justify-between text-sm mt-1">
												<span className="text-muted-foreground">
													Carried forward
												</span>
												<span className="text-amber-600 font-medium">
													{formatINR(
														selectedSlipDetail.advanceRecovery.carriedForward
													)}
												</span>
											</div>
										)}
									</div>

									{(selectedSlipDetail.advanceRecovery?.breakdown || []).length > 0 && (
										<div className="mt-2 space-y-1 text-sm">
											{selectedSlipDetail.advanceRecovery.breakdown.map(
												(item, index) => (
													<div
														key={`${item.advanceId}-${item.installmentNumber}-${index}`}
														className="flex justify-between gap-2"
													>
														<span className="text-muted-foreground">
															{item.advanceNumber} · #
															{item.installmentNumber} · {item.month}

															{item.isArrear && (
																<Badge
																	variant="warning"
																	className="ml-2"
																>
																	Arrear
																</Badge>
															)}
														</span>

														<span>{formatINR(item.amount)}</span>
													</div>
												)
											)}
										</div>
									)}
								</div>
							)}

							<div className="border-t pt-3">
								<div className="rounded-md border p-3">
									<div className="flex justify-between text-lg">
										<p className="font-bold">Net Payable</p>

										<p className="font-bold text-primary">
											{formatINR(
												selectedSlipDetail.netSalary ||
												selectedSlipDetail.netPay ||
												0
											)}
										</p>
									</div>

									<p className="text-xs text-muted-foreground mt-1">
										Gross earnings − total deductions
									</p>
								</div>

								<div className="flex justify-between text-sm mt-2">
									<p className="text-muted-foreground">Status</p>

									<Badge variant={getStatusBadge(selectedSlipDetail.paymentStatus)}>
										{selectedSlipDetail.paymentStatus || "Pending"}
									</Badge>
								</div>
							</div>

							{selectedSlipDetail.pdfUrl && (
								<Button
									variant="outline"
									onClick={() => handleViewPdf(selectedSlipDetail.pdfUrl)}
									className="mt-2"
								>
									<Eye className="mr-2 h-4 w-4" />
									View Full PDF
								</Button>
							)}
						</div>
					)}
					<DialogFooter>
						<Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}