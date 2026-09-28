import React, { useEffect, useState } from "react";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

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
import { Loader2, WalletCards, Plus, ChevronRight } from "lucide-react";

import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";
import RequestAdvanceModal from "../EmployeeAdvanceSalary/RequestAdvanceModal";
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

export function EmployeeAdvanceSalary() {
	const {
		myAdvances,
		fetchMyAdvances,
		loading,
	} = useHR();

	const { user } = useAuthStore();

	const [requestModalOpen, setRequestModalOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [selectedAdvance, setSelectedAdvance] = useState(null);
	const [expandedId, setExpandedId] = useState(null);

	useEffect(() => {
		fetchMyAdvances();
	}, [user?._id]);

	const loadAdvances = async () => {
		await fetchMyAdvances();
	};

	const handleToggleRow = (id) => setExpandedId((prev) => (prev === id ? null : id));

	const advanceList = Array.isArray(myAdvances)
		? myAdvances
		: myAdvances?.advances || [];

	return (
		<div className="space-y-5">
			<div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Advance Salary
					</h2>
				</div>

				<Button onClick={() => setRequestModalOpen(true)}>
					<Plus size={16} className="mr-2" />
					Request Advance
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>My Advance Salary Requests</CardTitle>
					<CardDescription>
						View your advance salary requests and repayment details.
					</CardDescription>
				</CardHeader>

				<CardContent>
					{loading && advanceList.length === 0 ? (
						<div className="py-12 text-center text-muted-foreground">
							<Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
							Loading advance requests...
						</div>
					) : advanceList.length === 0 ? (
						<div className="py-12 text-center text-muted-foreground">
							<WalletCards className="h-10 w-10 mx-auto mb-3 opacity-30" />
							<p>No advance salary requests found.</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-10" />
										<TableHead>Amount</TableHead>
										<TableHead>Repayment</TableHead>
										<TableHead>Outstanding</TableHead>
										<TableHead>Requested On</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{advanceList.map((advance) => {
										const isOpen = expandedId === advance._id;
										const isActive = ["disbursed", "recovering"].includes(advance.status);

										return (
											<React.Fragment key={advance._id}>
												<TableRow
													className="cursor-pointer hover:bg-muted/50"
													onClick={() => handleToggleRow(advance._id)}
												>
													<TableCell>
														<button type="button" aria-expanded={isOpen} aria-label="Toggle details" className="flex items-center">
															<ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
														</button>
													</TableCell>

													<TableCell className="font-medium">{formatINR(advance.amount)}</TableCell>

													<TableCell>
														<div className="capitalize">
															{advance.repaymentType?.replace("_", " ") || "-"}
														</div>
														{advance.repaymentType === "emi" && advance.emiCount && (
															<p className="text-xs text-muted-foreground">{advance.emiCount} EMIs</p>
														)}
													</TableCell>

													<TableCell>
														{isActive
															? formatINR(advance.totalOutstanding ?? advance.outstandingAmount)
															: "—"}
													</TableCell>

													<TableCell>{formatDate(advance.requestedAt || advance.createdAt)}</TableCell>

													<TableCell>
														<StatusBadge status={advance.status} />
													</TableCell>
												</TableRow>

												{isOpen && (
													<TableRow className="bg-muted/30 hover:bg-muted/30">
														<TableCell colSpan={6} className="p-4">
															<div className="space-y-4">
																<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
																	<Detail label="Advance no." value={advance.advanceNumber} />
																	<Detail label="Reason" value={advance.reason} />
																	<Detail label="Start month" value={advance.startMonth} />
																	{advance.repaymentType === "emi" && (
																		<Detail label="EMI amount" value={formatINR(advance.emiAmount)} />
																	)}
																	<Detail label="Total repaid" value={formatINR(advance.totalRepaid)} />
																	{advance.totalWaived > 0 && (
																		<Detail label="Total waived" value={formatINR(advance.totalWaived)} />
																	)}
																	<Detail label="Approved on" value={advance.approvedAt && formatDate(advance.approvedAt)} />
																	<Detail label="Disbursed on" value={advance.disbursedAt && formatDate(advance.disbursedAt)} />
																	<Detail label="Disbursement mode" value={advance.disbursementMode} />
																	<Detail label="Reference" value={advance.disbursementReference} />
																	{advance.rejectionReason && (
																		<>
																			<Detail label="Rejected on" value={advance.rejectedAt && formatDate(advance.rejectedAt)} />
																			<Detail label="Rejection reason" value={advance.rejectionReason} />
																		</>
																	)}
																	{advance.notes && <Detail label="Notes" value={advance.notes} />}
																</div>

																{advance.installments?.length > 0 ? (
																	<div className="rounded-md border overflow-x-auto bg-background">
																		<Table>
																			<TableHeader>
																				<TableRow>
																					<TableHead>#</TableHead>
																					<TableHead>Month</TableHead>
																					<TableHead className="text-right">Amount</TableHead>
																					<TableHead className="text-right">Deducted</TableHead>
																					<TableHead>Status</TableHead>
																					<TableHead>Remark</TableHead>
																				</TableRow>
																			</TableHeader>
																			<TableBody>
																				{advance.installments.map((inst, index) => (
																					<TableRow key={inst._id || index}>
																						<TableCell>{inst.installmentNumber ?? index + 1}</TableCell>
																						<TableCell>{inst.month || inst.dueMonth || "-"}</TableCell>
																						<TableCell className="text-right">{formatINR(inst.amount)}</TableCell>
																						<TableCell className="text-right">{formatINR(inst.deductedAmount)}</TableCell>
																						<TableCell>
																							<StatusBadge status={inst.status} />
																						</TableCell>
																						<TableCell className="text-sm text-muted-foreground">
																							{inst.remarks || "—"}
																						</TableCell>
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
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<RequestAdvanceModal
				open={requestModalOpen}
				onOpenChange={setRequestModalOpen}
				onSuccess={() => loadAdvances()}
			/>
		</div>
	);
}