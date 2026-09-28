import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Search, Eye, Banknote, HandCoins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
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

const PAYMENT_MODES = ["Bank Transfer", "Cash", "UPI", "Cheque"];

const ACTION_TITLES = {
	disburse: "Disburse advance",
	repayment: "Record repayment",
};

const today = () => new Date().toISOString().slice(0, 10);

// Flat form – shared by both action dialogs
const EMPTY_FORM = {
	disbursementMode: "Bank Transfer",
	disbursementReference: "",
	disbursedAt: "",
	amount: "",
	mode: "Cash",
	remarks: "",
};

const formatLabel = (value) =>
	value?.replace(/_/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) || "-";

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
		<Badge variant="secondary" className={`font-medium ${STATUS_STYLES[status] || ""}`}>
			{formatLabel(status)}
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

function Detail({ label, value }) {
	return (
		<div>
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className="text-sm font-medium break-words">{value || "-"}</div>
		</div>
	);
}

export function FinanceAdvanceSalary() {
	const { current } = useAuthStore();
	const canAct = canMutate(current?.role, "finance");

	const {
		advances,
		advancesPagination: pagination,
		fetchAdvances,
		advanceDetail,
		fetchAdvanceById,
		disburseAdvance,
		manualAdvanceRepayment,
		loading,
	} = useHR();

	// Default view: advances that HR approved and finance still has to disburse
	const [filters, setFilters] = useState({ status: "approved", search: "" });
	const [action, setAction] = useState(null); // { type, advance }
	const [form, setForm] = useState(EMPTY_FORM);
	const [detailOpen, setDetailOpen] = useState(false);
	const searchTimer = useRef(null);

	// One-time initial load for this page
	useEffect(() => {
		fetchAdvances(buildParams(filters, 1));
	}, []);

	// ─── Handlers ───
	const buildParams = (f, page = 1) => {
		const params = { page, limit: pagination?.limit || 10 };
		params.status = f.status;
		if (f.search.trim()) params.search = f.search.trim();
		return params;
	};

	const refresh = (f = filters, page = pagination?.page || 1) =>
		fetchAdvances(buildParams(f, page));

	const handleTabChange = (status) => {
		clearTimeout(searchTimer.current);
		const next = { ...filters, status };
		setFilters(next);
		refresh(next, 1);
	};

	const handleSearchChange = (e) => {
		const next = { ...filters, search: e.target.value };
		setFilters(next);
		clearTimeout(searchTimer.current);
		searchTimer.current = setTimeout(() => refresh(next, 1), 400);
	};

	const handleFormChange = (patch) => setForm((prev) => ({ ...prev, ...patch }));

	const openAction = (type, advance) => {
		setForm({ ...EMPTY_FORM, disbursedAt: today() });
		setAction({ type, advance });
	};

	const closeAction = () => setAction(null);

	const handleOpenDetail = async (advance) => {
		setDetailOpen(true);
		await fetchAdvanceById(advance._id);
	};

	const validate = (type, advance) => {
		if (type === "disburse") {
			if (form.disbursementMode !== "Cash" && !form.disbursementReference.trim()) {
				return "Reference / UTR is required";
			}
		}
		if (type === "repayment") {
			const amount = Number(form.amount);
			if (!(amount > 0)) return "Enter a valid amount";
			if (amount > outstandingOf(advance)) {
				return `Amount can't exceed the outstanding ${formatINR(outstandingOf(advance))}`;
			}
		}
		return null;
	};

	const handleSubmit = async () => {
		const { type, advance } = action;
		const error = validate(type, advance);
		if (error) return toast.error(error);

		let result = null;

		if (type === "disburse") {
			result = await disburseAdvance(advance._id, {
				disbursementMode: form.disbursementMode,
				disbursementReference: form.disbursementReference,
				...(form.disbursedAt && { disbursedAt: form.disbursedAt }),
			});
		}

		if (type === "repayment") {
			result = await manualAdvanceRepayment(advance._id, {
				amount: Number(form.amount),
				mode: form.mode,
				remarks: form.remarks,
			});
		}

		if (result !== null) {
			closeAction();
			refresh();
		}
	};

	const renderActions = (adv) => {
		const btn = "h-8 px-2";
		return (
			<div className="flex justify-end gap-1">
				<Button size="sm" variant="outline" className={btn} onClick={() => handleOpenDetail(adv)}>
					<Eye className="h-4 w-4 mr-1" /> View
				</Button>
				{canAct && adv.status === "approved" && (
					<Button size="sm" className={btn} onClick={() => openAction("disburse", adv)}>
						<Banknote className="h-4 w-4 mr-1" /> Disburse
					</Button>
				)}
				{canAct && ["disbursed", "recovering"].includes(adv.status) && (
					<Button size="sm" variant="outline" className={btn} onClick={() => openAction("repayment", adv)}>
						<HandCoins className="h-4 w-4 mr-1" /> Repayment
					</Button>
				)}
			</div>
		);
	};

	// ─── Derived ───
	const type = action?.type;

	return (
		<div className="space-y-5">

			{/* Tabs + search */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Tabs value={filters.status} onValueChange={handleTabChange}>
					<TabsList>
						<TabsTrigger value="approved">Approved</TabsTrigger>
						<TabsTrigger value="disbursed">Disbursed</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="relative flex-1 min-w-[220px] max-w-md">
					<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="pl-8"
						placeholder="Search employee or advance number"
						value={filters.search}
						onChange={handleSearchChange}
					/>
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
									{loading ? "Loading advances…" : `No ${filters.status} advances found.`}
								</TableCell>
							</TableRow>
						) : (
							advances.map((adv) => {
								const emp = employeeOf(adv);
								return (
									<TableRow key={adv._id}>
										<TableCell>
											<div className="font-medium">{adv.advanceNumber}</div>
											<div className="text-xs text-muted-foreground">{formatDate(adv.requestedAt || adv.createdAt)}</div>
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

			{/* ─── Action dialog: disburse / repayment ─── */}
			<Dialog open={Boolean(action)} onOpenChange={(open) => !open && closeAction()}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{ACTION_TITLES[type]}</DialogTitle>
						<DialogDescription>
							{action?.advance?.advanceNumber} · {employeeOf(action?.advance).name} ·{" "}
							{formatINR(action?.advance?.approvedAmount ?? action?.advance?.amount)}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						{type === "disburse" && (
							<>
								<Field label="Payment mode">
									<Select value={form.disbursementMode} onValueChange={(v) => handleFormChange({ disbursementMode: v })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{PAYMENT_MODES.map((m) => (
												<SelectItem key={m} value={m}>
													{m}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
								<Field label={form.disbursementMode === "Cash" ? "Reference (optional)" : "Reference / UTR"}>
									<Input
										value={form.disbursementReference}
										onChange={(e) => handleFormChange({ disbursementReference: e.target.value })}
									/>
								</Field>
								<Field label="Disbursed on">
									<Input type="date" value={form.disbursedAt} onChange={(e) => handleFormChange({ disbursedAt: e.target.value })} />
								</Field>
							</>
						)}

						{type === "repayment" && (
							<>
								<Field label={`Amount (outstanding ${formatINR(outstandingOf(action?.advance))})`}>
									<Input type="number" min={0} value={form.amount} onChange={(e) => handleFormChange({ amount: e.target.value })} />
								</Field>
								<Field label="Mode">
									<Select value={form.mode} onValueChange={(v) => handleFormChange({ mode: v })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{PAYMENT_MODES.map((m) => (
												<SelectItem key={m} value={m}>
													{m}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
								<Field label="Remarks">
									<Input value={form.remarks} onChange={(e) => handleFormChange({ remarks: e.target.value })} />
								</Field>
							</>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={closeAction}>
							Close
						</Button>
						<Button onClick={handleSubmit} disabled={loading}>
							{ACTION_TITLES[type]}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* ─── Detail dialog (read-only) ─── */}
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
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								<Detail label="Amount" value={formatINR(advanceDetail.approvedAmount ?? advanceDetail.amount)} />
								<Detail label="Repaid" value={formatINR(advanceDetail.totalRepaid)} />
								<Detail label="Outstanding" value={formatINR(outstandingOf(advanceDetail))} />
								<div>
									<div className="text-xs text-muted-foreground">Status</div>
									<StatusBadge status={advanceDetail.status} />
								</div>
								<Detail label="Approved on" value={advanceDetail.approvedAt && formatDate(advanceDetail.approvedAt)} />
								<Detail label="Disbursed on" value={advanceDetail.disbursedAt && formatDate(advanceDetail.disbursedAt)} />
								<Detail label="Mode" value={advanceDetail.disbursementMode} />
								<Detail label="Reference" value={advanceDetail.disbursementReference} />
								{advanceDetail.totalWaived > 0 && (
									<Detail label="Total waived" value={formatINR(advanceDetail.totalWaived)} />
								)}
								{advanceDetail.notes && (
									<div className="col-span-2 sm:col-span-4">
										<Detail label="Notes" value={advanceDetail.notes} />
									</div>
								)}
							</div>

							<div className="rounded-md border overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>#</TableHead>
											<TableHead>Month</TableHead>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead className="text-right">Deducted</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{(advanceDetail.installments || []).length === 0 ? (
											<TableRow>
												<TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
													No installments yet.
												</TableCell>
											</TableRow>
										) : (
											advanceDetail.installments.map((inst) => (
												<TableRow key={inst.installmentNumber}>
													<TableCell>{inst.installmentNumber}</TableCell>
													<TableCell>{inst.month}</TableCell>
													<TableCell className="text-right">{formatINR(inst.amount)}</TableCell>
													<TableCell className="text-right">{formatINR(inst.deductedAmount)}</TableCell>
													<TableCell>
														<StatusBadge status={inst.status} />
													</TableCell>
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