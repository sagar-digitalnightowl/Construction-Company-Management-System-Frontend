import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/common/PageHeader";
import { formatDate, formatINR } from "@/lib/helpers";

const STATUS_STYLES = {
	pending: "bg-amber-100 text-amber-800",
	approved: "bg-blue-100 text-blue-800",
	disbursed: "bg-indigo-100 text-indigo-800",
	recovering: "bg-orange-100 text-orange-800",
	closed: "bg-emerald-100 text-emerald-800",
	rejected: "bg-red-100 text-red-800",
	cancelled: "bg-slate-100 text-slate-700",
	// installment statuses
	deducted: "bg-emerald-100 text-emerald-800",
	paid: "bg-emerald-100 text-emerald-800",
	waived: "bg-violet-100 text-violet-800",
	skipped: "bg-slate-100 text-slate-700",
};

function StatusBadge({ status }) {
	return (
		<Badge variant="secondary" className={`font-medium ${STATUS_STYLES[status] || ""}`}>
			{formatLabel(status)}
		</Badge>
	);
}

const formatLabel = (value) =>

	value?.replace(/_/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) || "-";

function Detail({ label, value }) {
	return (
		<div>
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className="text-sm font-medium break-words">{value || "-"}</div>
		</div>
	);
}

export function AdvanceSummaryTab({ summary }) {
	const [expandedId, setExpandedId] = useState(null);

	const advances = summary?.advances || [];

	const handleToggleRow = (id) => setExpandedId((prev) => (prev === id ? null : id))

	return (
		<div className="space-y-5">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard size="compact" label="Total advanced" value={formatINR(summary?.totalAdvanced)} />
				<StatCard size="compact" label="Total repaid" value={formatINR(summary?.totalRepaid)} accent="success" />
				<StatCard size="compact" label="Outstanding" value={formatINR(summary?.totalOutstanding)} accent="primary" />
				<StatCard size="compact" label="Next month deduction" value={formatINR(summary?.nextMonthDeduction)} accent="warning" />
			</div>

			{/* Advances list (collapsible rows) */}
			<Card>
				<CardHeader>
					<CardTitle>Advance history</CardTitle>
					<CardDescription>
						{summary?.totalAdvances || 0} advances · {summary?.activeAdvances || 0} active. Click a row to see details and installments.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-10" />
								<TableHead>Advance</TableHead>
								<TableHead className="text-right">Amount</TableHead>
								<TableHead>Repayment</TableHead>
								<TableHead className="text-right">Outstanding</TableHead>
								<TableHead>Requested on</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{advances.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="h-20 text-center text-muted-foreground">
										No advance requests for this employee.
									</TableCell>
								</TableRow>
							) : (
								advances.map((adv) => {
									const isOpen = expandedId === adv._id;
									const isActive = ["disbursed", "recovering"].includes(adv.status);
									return (
										<React.Fragment key={adv._id}>
											<TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => handleToggleRow(adv._id)}>
												<TableCell>
													<button type="button" aria-expanded={isOpen} aria-label="Toggle details" className="flex items-center">
														<ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
													</button>
												</TableCell>
												<TableCell className="font-medium">{adv.advanceNumber}</TableCell>
												<TableCell className="text-right">{formatINR(adv.amount)}</TableCell>
												<TableCell>
													{adv.repaymentType === "emi" ? `EMI × ${adv.emiCount || "-"}` : "One time"}
												</TableCell>
												<TableCell className="text-right">
													{isActive ? formatINR(adv.outstandingAmount) : "—"}
												</TableCell>
												<TableCell>{formatDate(adv.requestedAt || adv.createdAt)}</TableCell>
												<TableCell>
													<StatusBadge status={adv.status} />
												</TableCell>
											</TableRow>

											{isOpen && (
												<TableRow className="bg-muted/30 hover:bg-muted/30">
													<TableCell colSpan={7} className="p-4">
														<div className="space-y-4">
															<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
																<Detail label="Reason" value={adv.reason} />
																<Detail label="Start month" value={adv.startMonth} />
																{adv.repaymentType === "emi" && (
																	<Detail label="EMI amount" value={formatINR(adv.emiAmount)} />
																)}
																<Detail label="Total repaid" value={formatINR(adv.totalRepaid)} />
																{adv.totalWaived > 0 && (
																	<Detail label="Total waived" value={formatINR(adv.totalWaived)} />
																)}
																<Detail label="Approved on" value={adv.approvedAt && formatDate(adv.approvedAt)} />
																<Detail label="Disbursed on" value={adv.disbursedAt && formatDate(adv.disbursedAt)} />
																<Detail label="Disbursement mode" value={adv.disbursementMode} />
																<Detail label="Reference" value={adv.disbursementReference} />
																{adv.rejectionReason && (
																	<Detail label="Rejection reason" value={adv.rejectionReason} />
																)}
																<Detail label="Notes" value={adv.notes} />
															</div>

															{adv.installments?.length > 0 ? (
																<div className="rounded-md border overflow-x-auto bg-background">
																	<Table>
																		<TableHeader>
																			<TableRow>
																				<TableHead>#</TableHead>
																				<TableHead>Month</TableHead>
																				<TableHead className="text-right">Amount</TableHead>
																				<TableHead className="text-right">Deducted</TableHead>
																				<TableHead>Status</TableHead>
																				<TableHead>Remarks</TableHead>
																			</TableRow>
																		</TableHeader>
																		<TableBody>
																			{adv.installments.map((inst) => (
																				<TableRow key={inst.installmentNumber}>
																					<TableCell>{inst.installmentNumber}</TableCell>
																					<TableCell>{inst.month}</TableCell>
																					<TableCell className="text-right">{formatINR(inst.amount)}</TableCell>
																					<TableCell className="text-right">{formatINR(inst.deductedAmount)}</TableCell>
																					<TableCell>
																						<StatusBadge status={inst.status} />
																					</TableCell>
																					<TableCell className="text-muted-foreground">{inst.remarks || "-"}</TableCell>
																				</TableRow>
																			))}
																		</TableBody>
																	</Table>
																</div>
															) : (
																<p className="text-sm text-muted-foreground">No installments generated yet.</p>
															)}
														</div>
													</TableCell>
												</TableRow>
											)}
										</React.Fragment>
									);
								})
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}