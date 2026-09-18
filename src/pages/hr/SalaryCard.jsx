import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download, Eye, FileText, PlusCircle, MinusCircle, Wallet, Gift, TrendingUp } from "lucide-react";
import { useHR } from "@/hooks/useHR";
import {
	dash,
	currency,
	formatMonthDisplay,
	formatDate,
	EARNING_LABELS,
	DEDUCTION_LABELS,
} from "./salaryHelpers";

/* ---------------- Grid cell helpers — mimic the printed slip's ruled table ---------------- */
const Cell = ({ children, bold = false, right = false, span = 1, shaded = false, className = "" }) => (
	<td
		colSpan={span}
		className={`py-1 px-2 border border-foreground/30 text-[11px] sm:text-xs align-top ${bold ? "font-bold text-foreground" : "text-foreground"
			} ${right ? "text-right tabular-nums" : ""} ${shaded ? "bg-muted/40" : ""} ${className}`}
	>
		{children}
	</td>
);

const LabelCell = ({ children, span = 1, shaded = false }) => (
	<Cell bold span={span} shaded={shaded}>
		{children}
	</Cell>
);

const ValueCell = ({ children, right = true, className = "text-primary" }) => (
	<Cell right={right} className={className}>
		{children}
	</Cell>
);

/* Converts a number to Indian-numbering words, e.g. 45200 -> "Rupees Forty Five Thousand Two Hundred Only" */
const numberToWords = (num) => {
	if (num == null || isNaN(num)) return "-";
	const n = Math.round(Number(num));
	if (n === 0) return "Rupees Zero Only";

	const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
		"Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
	const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

	const twoDigits = (val) => (val < 20 ? ones[val] : `${tens[Math.floor(val / 10)]}${val % 10 ? " " + ones[val % 10] : ""}`);
	const threeDigits = (val) =>
		val < 100 ? twoDigits(val) : `${ones[Math.floor(val / 100)]} Hundred${val % 100 ? " " + twoDigits(val % 100) : ""}`;

	let remainder = n;
	const crore = Math.floor(remainder / 10000000); remainder %= 10000000;
	const lakh = Math.floor(remainder / 100000); remainder %= 100000;
	const thousand = Math.floor(remainder / 1000); remainder %= 1000;
	const hundred = remainder;

	const parts = [];
	if (crore) parts.push(`${threeDigits(crore)} Crore`);
	if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
	if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
	if (hundred) parts.push(threeDigits(hundred));

	return `Rupees ${parts.join(" ")} Only`;
};

export const SalaryCard = ({ slip }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { downloadSalarySlipPdf, loading: downloading } = useHR();
	const isPaid = slip.paymentStatus === "Paid";

	const handleToggle = () => setIsOpen((prev) => !prev);
	const handleViewPdf = () => window.open(slip.pdfUrl, "_blank", "noopener,noreferrer");
	const handleDownload = () => downloadSalarySlipPdf(slip._id);

	const totalLeaveTaken =
		(slip.leaveSummary?.paidLeaveTaken ?? 0) +
		(slip.leaveSummary?.unpaidLeaveTaken ?? 0) +
		(slip.leaveSummary?.sickLeaveTaken ?? 0) +
		(slip.leaveSummary?.casualLeaveTaken ?? 0) +
		(slip.leaveSummary?.annualLeaveTaken ?? 0);

	const netWorkingDays = slip.attendanceSummary?.presentDays || slip.attendanceSummary?.totalWorkingDays;

	// Core recurring earnings shown in the SALARY breakup (bonuses are broken out separately below)
	const bonusKeys = ["bonus", "performanceBonus", "safetyBonus"];
	const earningEntries = Object.entries(EARNING_LABELS)
		.filter(([key]) => !bonusKeys.includes(key) && (slip.earnings?.[key] ?? 0) !== 0)
		.map(([key, label]) => ({ key, label, amount: slip.earnings[key] }));

	const deductionEntries = Object.entries(DEDUCTION_LABELS)
		.filter(([key]) => (slip.deductions?.[key] ?? 0) !== 0)
		.map(([key, label]) => ({ key, label, amount: slip.deductions[key] }));

	const incentiveAmount = bonusKeys.reduce((sum, key) => sum + (slip.earnings?.[key] ?? 0), 0);

	return (
		<Card className="relative group rounded-xl border transition-all duration-300 overflow-hidden hover:shadow-md border-border bg-card">
			{/* Clickable summary header */}
			<div
				className="p-4 sm:p-6 relative z-10 cursor-pointer transition-colors hover:bg-accent/10"
				onClick={handleToggle}
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-3 sm:gap-5">
						<div className="p-3 rounded-lg transition-transform group-hover:scale-110 duration-300 shrink-0 bg-primary/10 text-primary">
							<FileText className="w-5 h-5 sm:w-6 sm:h-6" />
						</div>
						<div className="min-w-0">
							<h3 className="text-lg sm:text-xl font-bold tracking-tight truncate text-foreground font-display">
								{formatMonthDisplay(slip.month)}
							</h3>
							<div className="flex items-center gap-2 mt-0.5">
								<span
									className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter ${isPaid ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
										}`}
								>
									{dash(slip.paymentStatus)}
								</span>
								<span className="text-[10px] text-muted-foreground font-medium">
									#{dash(slip.slipNumber)}
								</span>
							</div>
						</div>
					</div>

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

			{/* Expanded panel — replicates the printed salary slip layout */}
			{isOpen && (
				<div className="p-4 sm:p-6 border-t border-border bg-white animate-in slide-in-from-top-2 duration-300 overflow-x-auto">
					<div className="min-w-[560px]">
						{/* Letterhead */}
						<p className="text-center text-base font-black uppercase tracking-wide text-foreground">
							{dash(slip.officeName)}
							{slip.officeCode ? ` (${slip.officeCode})` : ""}
						</p>
						<p className="text-center text-sm font-black uppercase tracking-wide mb-3">
							Salary Slip ({formatMonthDisplay(slip.month).toUpperCase()})
						</p>

						{/* Employee & attendance grid — only fields present in the API response */}
						<table className="w-full border-collapse mb-0">
							<tbody>
								<tr>
									<LabelCell>TOTAL WORKING DAYS</LabelCell>
									<ValueCell>{dash(slip.attendanceSummary?.totalWorkingDays)}</ValueCell>
								</tr>
								<tr>
									<LabelCell>LESS : LEAVE TAKEN</LabelCell>
									<ValueCell>{dash(totalLeaveTaken)}</ValueCell>
								</tr>
								<tr>
									<LabelCell>NET WORKING DAYS</LabelCell>
									<ValueCell>{dash(netWorkingDays)}</ValueCell>
								</tr>
								<tr>
									<LabelCell>BASIC SALARY</LabelCell>
									<ValueCell>{dash(slip.earnings?.basic)}</ValueCell>
								</tr>
							</tbody>
						</table>

						{/* Salary calculation — color-coded, easy to scan at a glance */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							{/* Earnings */}
							<div className="rounded-lg border border-success/30 bg-success/5 p-4 flex flex-col h-full">
								<h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-success mb-3">
									<PlusCircle size={14} /> Earnings
								</h4>
								<div className="space-y-2">
									{earningEntries.map((e) => (
										<div key={e.key} className="flex items-center justify-between text-xs sm:text-sm">
											<span className="text-muted-foreground">{e.label}</span>
											<span className="font-semibold text-success tabular-nums">+ {currency(e.amount)}</span>
										</div>
									))}
								</div>
								<div className="flex items-center justify-between mt-auto pt-3 border-t border-success/30">
									<span className="text-xs font-bold uppercase text-foreground">Gross Salary</span>
									<span className="font-black text-success tabular-nums">{currency(slip.grossEarnings)}</span>
								</div>
							</div>

							{/* Deductions */}
							<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col h-full">
								<h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-destructive mb-3">
									<MinusCircle size={14} /> Deductions
								</h4>
								{deductionEntries.length > 0 ? (
									<div className="space-y-2">
										{deductionEntries.map((d) => (
											<div key={d.key} className="flex items-center justify-between text-xs sm:text-sm">
												<span className="text-muted-foreground">{d.label}</span>
												<span className="font-semibold text-destructive tabular-nums">- {currency(d.amount)}</span>
											</div>
										))}
									</div>
								) : (
									<p className="text-xs text-muted-foreground italic">No deductions this month</p>
								)}
								<div className="flex items-center justify-between mt-auto pt-3 border-t border-destructive/30">
									<span className="text-xs font-bold uppercase text-foreground">Total Deductions</span>
									<span className="font-black text-destructive tabular-nums">- {currency(slip.totalDeductions)}</span>
								</div>
							</div>
						</div>

						{/* Incentive — shown only when there's something to report */}
						{incentiveAmount > 0 && (
							<div className="rounded-lg border border-warning/30 bg-warning/5 p-4 mt-4 flex items-center justify-between">
								<h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-warning">
									<Gift size={14} /> Incentive
								</h4>
								<span className="font-black text-warning tabular-nums">{currency(incentiveAmount)}</span>
							</div>
						)}

						{/* Net payable — the headline number */}
						<div className="rounded-lg border border-primary/40 bg-primary/10 p-4 mt-4 flex items-center justify-between">
							<h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-primary">
								<Wallet size={18} /> Net Payable Salary
							</h4>
							<span className="font-black text-2xl text-primary tabular-nums">{currency(slip.netSalary)}</span>
						</div>

						{/* Amount in words */}
						<p className="text-center text-xs font-semibold text-muted-foreground mt-3">
							{numberToWords(slip.netSalary)}
						</p>
					</div>

					{/* Status / approvals / download — app-only info, not part of the printed slip */}
					<div className="mt-6 pt-4 border-t border-border flex flex-wrap justify-between items-center gap-4">
						<div className="text-xs text-muted-foreground space-y-1">
							<p>
								<span className="font-semibold text-foreground">HR Apprv.:</span>{" "}
								<span className={slip.hrApproval?.status === "Approved" ? "text-success font-semibold" : ""}>
									{dash(slip.hrApproval?.status)}
								</span>
								&nbsp;|&nbsp;
								<span className="font-semibold text-foreground">Fin Apprv.:</span>{" "}
								<span className={slip.financeApproval?.status === "Approved" ? "text-success font-semibold" : ""}>
									{dash(slip.financeApproval?.status)}
								</span>
							</p>
							<p>
								<span className="font-semibold text-foreground">Pay Date:</span>{" "}
								{slip.paymentDate ? formatDate(slip.paymentDate) : dash(null)} &nbsp;|&nbsp;
								<span className="font-semibold text-foreground"> Method:</span> {dash(slip.paymentMethod)}
							</p>
						</div>

						<div className="flex gap-2 w-full sm:w-auto">
							<Button
								variant="outline"
								disabled={!slip.pdfUrl}
								onClick={handleViewPdf}
								className="flex-1 sm:flex-none gap-2"
							>
								<Eye className="h-4 w-4" />
								View PDF
							</Button>
							{/* <Button
								disabled={downloading}
								onClick={handleDownload}
								className="flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
							>
								{downloading ? <FileText className="h-4 w-4 animate-pulse" /> : <Download className="h-4 w-4" />}
								{downloading ? "Downloading..." : "Download"}
							</Button> */}
						</div>
					</div>
				</div>
			)}
		</Card>
	);
};