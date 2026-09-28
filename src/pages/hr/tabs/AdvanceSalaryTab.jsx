import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Search, Eye, Check, X, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useHR } from "@/hooks/useHR";
import { Checkbox } from "@/components/ui/checkbox";

const STATUS_OPTIONS = [
	"pending",
	"approved",
	"disbursed",
	"recovering",
	"closed",
	"rejected",
	"cancelled",
];

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

const DISBURSEMENT_MODES = ["Bank Transfer", "Cash", "UPI", "Cheque"];

const ACTION_TITLES = {
	approve: "Approve advance",
	reject: "Reject advance",
	revise: "Revise repayment plan",
	skip: "Skip installment",
	waive: "Waive installment",
	cancel: "Cancel advance",
};

// Flat form – one object, reused by every action dialog
const EMPTY_FORM = {
	repaymentType: "one_time",
	emiCount: "",
	startMonth: "",
	approvedAmount: "",
	notes: "",
	reason: "",
	installmentNumber: "",
};

const formatINR = (n) =>
	`₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const formatDate = (d) =>
	d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const employeeOf = (adv) => {
	const e = adv?.employeeId;
	if (e && typeof e === "object") {
		return { name: e.name || "—", code: e.employeeId || e.email || "" };
	}
	return { name: adv?.employeeName || "—", code: "" };
};

const outstandingOf = (adv) =>
	adv?.outstandingAmount ??
	Math.max(
		0,
		Number(adv?.approvedAmount ?? adv?.amount ?? 0) - Number(adv?.totalRepaid || 0),
	);

function StatusBadge({ status }) {
	return (
		<Badge className={`capitalize font-medium ${STATUS_STYLES[status] || ""}`} variant="secondary">
			{status}
		</Badge>
	);
}

function Field({ label, children }) {
	return (
		<div className="space-y-1.5">
			<Label className="text-sm">{label}</Label>
			{children}
		</div>
	);
}

export function AdvanceSalaryTab({ advances = [], pagination, onRefresh, canEdit }) {
	const {
		loading,
		advanceDetail,
		fetchAdvanceById,
		approveAdvance,
		rejectAdvance,
		cancelAdvance,
		reviseAdvancePlan,
		skipAdvanceInstallment,
		waiveAdvanceInstallment,
	} = useHR();

	const [filters, setFilters] = useState({ status: "all", search: "", outstandingOnly: false });
	const [action, setAction] = useState(null);
	const [form, setForm] = useState(EMPTY_FORM);
	const [detailOpen, setDetailOpen] = useState(false);
	const searchTimer = useRef(null);

	// ─── Handlers ───
	const buildParams = (f, page = 1) => {

		const params = { page, limit: pagination?.limit || 10 };
		if (f.status && f.status !== "all") params.status = f.status;
		if (f.search.trim()) params.search = f.search.trim();
		if (f.outstandingOnly) params.outstandingOnly = true;
		return params;
	};

	const refresh = (f = filters, page = pagination?.page || 1) => onRefresh(buildParams(f, page));

	const handleFilterChange = (patch) => {
		clearTimeout(searchTimer.current);
		const next = { ...filters, ...patch };
		setFilters(next);
		refresh(next, 1);
	};

	const handleSearchChange = (e) => {
		const search = e.target.value;
		const next = { ...filters, search };
		setFilters(next);
		clearTimeout(searchTimer.current);
		searchTimer.current = setTimeout(() => refresh(next, 1), 400);
	};

	const handleFormChange = (patch) => setForm((prev) => ({ ...prev, ...patch }));

	const openAction = (type, advance, extra = {}) => {
		setForm({
			...EMPTY_FORM,
			repaymentType: advance.repaymentType || "one_time",
			emiCount: advance.emiCount || "",
			startMonth: advance.startMonth || "",
			approvedAmount: advance.amount || "",
			...extra,
		});
		setAction({ type, advance });
	};

	const closeAction = () => setAction(null);

	const handleOpenDetail = async (advance) => {
		setDetailOpen(true);
		await fetchAdvanceById(advance._id);
	};

	const buildPlanPayload = () => ({
		repaymentType: form.repaymentType,
		...(form.repaymentType === "emi" && {
			emiCount: Number(form.emiCount),
			startMonth: form.startMonth,
		}),
	});

	const validate = (type) => {
		if (["approve", "revise"].includes(type) && form.repaymentType === "emi") {
			if (!Number(form.emiCount) || Number(form.emiCount) < 1) return "EMI count is required";
			if (!form.startMonth) return "Start month is required";
		}
		if (["reject", "revise", "skip", "waive"].includes(type) && !form.reason.trim()) {
			return "Reason is required";
		}
		return null;
	};

	const handleSubmit = async () => {
		const { type, advance } = action;
		const error = validate(type);
		if (error) return toast.error(error);

		const id = advance._id;
		let result = null;

		switch (type) {
			case "approve":
				result = await approveAdvance(id, {
					...buildPlanPayload(),
					approvedAmount: Number(form.approvedAmount) || advance.amount,
					notes: form.notes,
				});
				break;
			case "reject":
				result = await rejectAdvance(id, { reason: form.reason });
				break;
			case "cancel":
				result = await cancelAdvance(id);
				break;
			case "revise":
				result = await reviseAdvancePlan(id, { ...buildPlanPayload(), reason: form.reason });
				break;
			case "skip":
				result = await skipAdvanceInstallment(id, {
					installmentNumber: Number(form.installmentNumber),
					reason: form.reason,
				});
				break;
			case "waive":
				result = await waiveAdvanceInstallment(id, {
					installmentNumber: Number(form.installmentNumber),
					reason: form.reason,
				});
				break;
			default:
				break;
		}

		if (result !== null) {
			closeAction();
			refresh();
		}
	};

	const renderActions = (adv) => {
		if (!canEdit) return null;
		const btn = "h-8 px-2";
		return (
			<div className="flex justify-end gap-1">
				<Button size="sm" variant="outline" className={btn} onClick={() => handleOpenDetail(adv)}>
					<Eye className="h-4 w-4 mr-1" /> View
				</Button>
				{adv.status === "pending" && (
					<>
						<Button size="sm" variant="outline" className={btn} onClick={() => openAction("approve", adv)}>
							<Check className="h-4 w-4 mr-1" /> Approve
						</Button>
						<Button size="sm" variant="outline" className={`${btn} text-red-600`} onClick={() => openAction("reject", adv)}>
							<X className="h-4 w-4 mr-1" /> Reject
						</Button>
					</>
				)}
				{adv.status === "approved" && (
					<>
						<Button size="sm" variant="outline" className={`${btn} text-red-600`} onClick={() => openAction("cancel", adv)}>
							<X className="h-4 w-4 mr-1" /> Cancel
						</Button>
					</>
				)}
				{["disbursed", "recovering"].includes(adv.status) && (
					<Button size="sm" variant="outline" className={btn} onClick={() => openAction("revise", adv)}>
						<CalendarClock className="h-4 w-4 mr-1" /> Revise
					</Button>
				)}
			</div>
		);
	};

	const type = action?.type;
	const isPlanForm = ["approve", "revise"].includes(type);
	const isInstallmentAction = ["skip", "waive"].includes(type);

	return (
		<div className="space-y-5">
			{/* Filters */}
			<div className="flex flex-wrap items-end gap-3">
				<div className="relative flex-1 min-w-[220px] max-w-md">
					<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="pl-8"
						placeholder="Search employee or advance number"
						value={filters.search}
						onChange={handleSearchChange}
					/>
				</div>

				<Select value={filters.status} onValueChange={(v) => handleFilterChange({ status: v })}>
					<SelectTrigger className="w-44 capitalize">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All statuses</SelectItem>
						{STATUS_OPTIONS.map((s) => (
							<SelectItem key={s} value={s} className="capitalize">
								{s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="flex items-center gap-2 h-9">
					<Checkbox
						id="outstanding-only"
						checked={filters.outstandingOnly}
						onCheckedChange={(checked) => handleFilterChange({ outstandingOnly: checked === true })}
					/>
					<Label htmlFor="outstanding-only" className="cursor-pointer text-sm">
						Outstanding only
					</Label>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Advance</TableHead>
							<TableHead>Employee</TableHead>
							<TableHead className="text-right">Amount</TableHead>
							<TableHead>Repayment</TableHead>
							<TableHead className="text-right">Outstanding</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{advances.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
									{loading ? "Loading advances…" : "No advance requests match these filters."}
								</TableCell>
							</TableRow>
						) : (
							advances.map((adv) => {
								const emp = employeeOf(adv);
								return (
									<TableRow key={adv._id}>
										<TableCell>
											<div className="font-medium">{adv.advanceNumber}</div>
											<div className="text-xs text-muted-foreground">{formatDate(adv.createdAt)}</div>
										</TableCell>
										<TableCell>
											<div>{emp.name}</div>
											<div className="text-xs text-muted-foreground">{emp.code}</div>
										</TableCell>
										<TableCell className="text-right">{formatINR(adv.approvedAmount ?? adv.amount)}</TableCell>
										<TableCell className="text-sm">
											{adv.repaymentType === "emi" ? `EMI × ${adv.emiCount || "—"}` : "One time"}
										</TableCell>
										<TableCell className="text-right">
											{["disbursed", "recovering"].includes(adv.status) ? formatINR(outstandingOf(adv)) : "—"}
										</TableCell>
										<TableCell>
											<StatusBadge status={adv.status} />
										</TableCell>
										<TableCell>{renderActions(adv)}</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{pagination?.pages > 1 && (
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">
						Page {pagination.page} of {pagination.pages} · {pagination.total} advances
					</span>
					<div className="flex gap-2">
						<Button size="sm" variant="outline" disabled={pagination.page <= 1} onClick={() => refresh(filters, pagination.page - 1)}>
							Previous
						</Button>
						<Button size="sm" variant="outline" disabled={pagination.page >= pagination.pages} onClick={() => refresh(filters, pagination.page + 1)}>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* ─── Action dialog (shared by all actions) ─── */}
			<Dialog open={Boolean(action)} onOpenChange={(open) => !open && closeAction()}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{ACTION_TITLES[type]}</DialogTitle>
						<DialogDescription>
							{action?.advance?.advanceNumber} · {employeeOf(action?.advance).name} ·{" "}
							{formatINR(action?.advance?.amount)}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						{type === "approve" && (
							<Field label="Approved amount">
								<Input type="number" value={form.approvedAmount} onChange={(e) => handleFormChange({ approvedAmount: e.target.value })} />
							</Field>
						)}

						{isPlanForm && (
							<>
								<Field label="Repayment type">
									<Select value={form.repaymentType} onValueChange={(v) => handleFormChange({ repaymentType: v })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="one_time">One time (single month)</SelectItem>
											<SelectItem value="emi">EMI (split across months)</SelectItem>
										</SelectContent>
									</Select>
								</Field>
								{form.repaymentType === "emi" && (
									<div className="grid grid-cols-2 gap-3">
										<Field label="Number of EMIs">
											<Input type="number" min={1} value={form.emiCount} onChange={(e) => handleFormChange({ emiCount: e.target.value })} />
										</Field>
										<Field label="First deduction month">
											<Input type="month" value={form.startMonth} onChange={(e) => handleFormChange({ startMonth: e.target.value })} />
										</Field>
									</div>
								)}
								{form.repaymentType === "emi" && Number(form.emiCount) > 0 && (
									<p className="text-xs text-muted-foreground">
										≈ {formatINR((type === "revise" ? outstandingOf(action?.advance) : Number(form.approvedAmount) || 0) / Number(form.emiCount))} per month
									</p>
								)}
							</>
						)}

						{type === "approve" && (
							<Field label="Notes (optional)">
								<Textarea rows={2} value={form.notes} onChange={(e) => handleFormChange({ notes: e.target.value })} />
							</Field>
						)}

						{["reject", "revise", "skip", "waive"].includes(type) && (
							<Field label="Reason">
								<Textarea rows={3} value={form.reason} onChange={(e) => handleFormChange({ reason: e.target.value })} />
							</Field>
						)}

						{type === "cancel" && (
							<p className="text-sm text-muted-foreground">
								This will cancel the approved advance. This can't be undone.
							</p>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={closeAction}>
							Close
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={loading}
							variant={["reject", "cancel"].includes(type) ? "destructive" : "default"}
						>
							{ACTION_TITLES[type]}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* ─── Detail dialog ─── */}
			<Dialog open={detailOpen} onOpenChange={setDetailOpen}>
				<DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{advanceDetail?.advanceNumber || "Advance details"}</DialogTitle>
						<DialogDescription>
							{employeeOf(advanceDetail).name} · {advanceDetail?.reason}
						</DialogDescription>
					</DialogHeader>

					{advanceDetail && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
								<div>
									<div className="text-muted-foreground">Amount</div>
									<div className="font-medium">{formatINR(advanceDetail.approvedAmount ?? advanceDetail.amount)}</div>
								</div>
								<div>
									<div className="text-muted-foreground">Repaid</div>
									<div className="font-medium">{formatINR(advanceDetail.totalRepaid)}</div>
								</div>
								<div>
									<div className="text-muted-foreground">Outstanding</div>
									<div className="font-medium">{formatINR(outstandingOf(advanceDetail))}</div>
								</div>
								<div>
									<div className="text-muted-foreground">Status</div>
									<StatusBadge status={advanceDetail.status} />
								</div>
							</div>

							<div className="rounded-md border overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>#</TableHead>
											<TableHead>Month</TableHead>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Remark</TableHead>
											{canEdit && <TableHead className="text-right">Action</TableHead>}
										</TableRow>
									</TableHeader>
									<TableBody>
										{(advanceDetail.installments || []).length === 0 ? (
											<TableRow>
												<TableCell colSpan={canEdit ? 6 : 5} className="h-16 text-center text-muted-foreground">
													No installments yet. They appear once the advance is approved.
												</TableCell>
											</TableRow>
										) : (
											advanceDetail.installments.map((inst) => (
												<TableRow key={inst.installmentNumber}>
													<TableCell>{inst.installmentNumber}</TableCell>
													<TableCell>{inst.month}</TableCell>
													<TableCell className="text-right">{formatINR(inst.amount)}</TableCell>
													<TableCell className="capitalize">
														<StatusBadge status={inst.status} />
													</TableCell>
													<TableCell className="text-sm text-muted-foreground">
														{inst.remarks || "—"}
													</TableCell>
													{canEdit && (
														<TableCell className="text-right">
															{inst.status === "pending" && (
																<div className="flex justify-end gap-1">
																	<Button
																		size="sm"
																		variant="ghost"
																		className="h-8 px-2"
																		onClick={() => openAction("skip", advanceDetail, { installmentNumber: inst.installmentNumber })}
																	>
																		Skip
																	</Button>
																	<Button
																		size="sm"
																		variant="ghost"
																		className="h-8 px-2"
																		onClick={() => openAction("waive", advanceDetail, { installmentNumber: inst.installmentNumber })}
																	>
																		Waive
																	</Button>
																</div>
															)}
														</TableCell>
													)}
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}