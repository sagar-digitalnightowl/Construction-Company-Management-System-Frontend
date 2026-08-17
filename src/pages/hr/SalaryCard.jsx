import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SalarySlipPDF } from "./SalarySlipPDF";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ChevronDown, ChevronUp, Download, FileText,
	Wallet, AlertCircle, Clock, Landmark, Info
} from "lucide-react";
import {
	dash,
	currency,
	formatMonthDisplay,
	formatDate,
	EARNING_LABELS,
	DEDUCTION_LABELS,
	ATTENDANCE_LABELS,
	LEAVE_LABELS,
} from "./salaryHelpers";

/* ---------------- Reusable Dotted Leader Row ---------------- */
const DataRow = ({ label, value, colorClass = "" }) => (
	<div className="flex items-end gap-2 group">
		<span className="text-xs whitespace-nowrap text-muted-foreground transition-colors duration-200">
			{label}
		</span>
		<div className="flex-1 border-b border-dotted mb-1 border-border/70 transition-colors duration-200" />
		<span className={`text-sm font-semibold tabular-nums ${colorClass || "text-foreground"}`}>
			{value}
		</span>
	</div>
);

export const SalaryCard = ({ slip }) => {
	const [isOpen, setIsOpen] = useState(false);
	const isPaid = slip.paymentStatus === "Paid";

	return (
		<Card className="relative group rounded-xl border transition-all duration-300 overflow-hidden hover:shadow-md border-border bg-card">
			{/* Clickable Header */}
			<div
				className="p-4 sm:p-6 relative z-10 cursor-pointer transition-colors hover:bg-accent/10"
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					{/* Left: Icon & Info */}
					<div className="flex items-center gap-3 sm:gap-5">
						<div className="p-3 rounded-lg transition-transform group-hover:scale-110 duration-300 shrink-0 bg-primary/10 text-primary">
							<FileText className="w-5 h-5 sm:w-6 sm:h-6" />
						</div>
						<div className="min-w-0">
							<h3 className="text-lg sm:text-xl font-bold tracking-tight truncate text-foreground font-display">
								{formatMonthDisplay(slip.month)}
							</h3>
							<div className="flex items-center gap-2 mt-0.5">
								<span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter ${isPaid ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
									}`}>
									{dash(slip.paymentStatus)}
								</span>
								<span className="text-[10px] text-muted-foreground font-medium">
									#{dash(slip.slipNumber)}
								</span>
							</div>
						</div>
					</div>

					{/* Right: Price & Action */}
					<div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
						<div className="text-left sm:text-right">
							<p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-0.5">
								Net Payable
							</p>
							<div className="flex items-center font-black text-xl sm:text-2xl tabular-nums text-primary">
								<span>{currency(slip.netSalary)}</span>
							</div>
						</div>

						<Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-primary hover:bg-primary/10">
							{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
						</Button>
					</div>
				</div>
			</div>

			{/* Collapsible Content */}
			{isOpen && (
				<div className="p-6 border-t border-border bg-background/50 animate-in slide-in-from-top-2 duration-300">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

						{/* Earnings */}
						<div className="space-y-4">
							<h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
								<Wallet size={14} /> Earnings
							</h4>
							<div className="space-y-2.5">
								{Object.entries(EARNING_LABELS).map(([key, label]) => {
									if (slip.earnings?.[key] == null) return null;
									return <DataRow key={key} label={label} value={currency(slip.earnings[key])} />;
								})}
							</div>
						</div>

						{/* Deductions */}
						<div className="space-y-4">
							<h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-destructive">
								<AlertCircle size={14} /> Deductions
							</h4>
							<div className="space-y-2.5">
								{Object.entries(DEDUCTION_LABELS).map(([key, label]) => {
									if (slip.deductions?.[key] == null) return null;
									return <DataRow key={key} label={label} value={currency(slip.deductions[key])} />;
								})}
							</div>
						</div>

						{/* Attendance & Leave */}
						<div className="space-y-4">
							<h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-info">
								<Clock size={14} /> Attendance & Leave
							</h4>
							<div className="space-y-2.5">
								{Object.entries(ATTENDANCE_LABELS).map(([key, label]) => {
									if (slip.attendanceSummary?.[key] == null) return null;
									return <DataRow key={key} label={label} value={dash(slip.attendanceSummary[key])} />;
								})}
								{Object.entries(LEAVE_LABELS).map(([key, label]) => {
									if (slip.leaveSummary?.[key] == null) return null;
									return <DataRow key={key} label={label} value={dash(slip.leaveSummary[key])} />;
								})}
							</div>
						</div>

						{/* Payment & Approvals */}
						<div className="space-y-4">
							<h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary-foreground">
								<Landmark size={14} /> Payment & Approvals
							</h4>
							<div className="space-y-2.5 p-4 rounded-lg border border-border bg-card shadow-sm">
								<DataRow label="Method" value={dash(slip.paymentMethod)} />
								<DataRow label="Pay Date" value={slip.paymentDate ? formatDate(slip.paymentDate) : dash(null)} />
								<DataRow label="Bank" value={dash(slip.bankAccountDetails?.bankName)} />
								<DataRow label="A/C No" value={dash(slip.bankAccountDetails?.accountNumber)} />
								<DataRow
									label="HR Apprv."
									value={dash(slip.hrApproval?.status)}
									colorClass={slip.hrApproval?.status === "Approved" ? "text-success" : ""}
								/>
								<DataRow
									label="Fin Apprv."
									value={dash(slip.financeApproval?.status)}
									colorClass={slip.financeApproval?.status === "Approved" ? "text-success" : ""}
								/>
							</div>
						</div>
					</div>

					{/* Salary Summary Cards */}
					<div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 font-display">
						<div className="p-4 rounded-lg text-center border border-border bg-card shadow-sm">
							<p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Gross Earnings</p>
							<p className="text-lg font-bold text-success">{currency(slip.grossEarnings)}</p>
						</div>
						<div className="p-4 rounded-lg text-center border border-border bg-card shadow-sm">
							<p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Total Deductions</p>
							<p className="text-lg font-bold text-destructive">{currency(slip.totalDeductions)}</p>
						</div>
						<div className="p-4 rounded-lg text-center border border-success/30 bg-success/10 shadow-sm">
							<p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Net Salary</p>
							<p className="text-xl font-black text-success">{currency(slip.netSalary)}</p>
						</div>
					</div>

					{/* Footer / Actions */}
					<div className="mt-8 pt-4 border-t border-border flex flex-wrap justify-between items-center gap-4">
						<div className="text-xs text-muted-foreground space-y-1">
							<p><span className="font-semibold text-foreground">Proj/Dept:</span> {dash(slip.projectId)} / {dash(slip.departmentId)}</p>
							<p><span className="font-semibold text-foreground">Generated:</span> {formatDate(slip.createdAt)}</p>
							<p className="flex items-center gap-1"><Info size={12} className="text-info" /> {dash(slip.remarks || "No remarks")}</p>
						</div>

						<PDFDownloadLink
							document={<SalarySlipPDF slip={slip} />}
							fileName={`Salary_Slip_${slip.month}.pdf`}
							className="w-full sm:w-auto"
						>
							{({ loading }) => (
								<Button
									disabled={loading}
									className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
								>
									{loading ? <FileText className="h-4 w-4 animate-pulse" /> : <Download className="h-4 w-4" />}
									{loading ? "Generating PDF..." : "Download PDF Slip"}
								</Button>
							)}
						</PDFDownloadLink>
					</div>
				</div>
			)}
		</Card>
	);
};