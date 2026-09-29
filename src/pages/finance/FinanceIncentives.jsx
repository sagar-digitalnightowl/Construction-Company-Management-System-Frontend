import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, BadgeCheck, Pencil, Briefcase, Users, FolderKanban } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatCard } from "@/components/common/PageHeader";
import { useIncentive } from "@/hooks/useIncentive";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatDate, formatINR } from "@/lib/helpers";

const STATUS_OPTIONS = ["approved", "paid"];
const CLEARED_OPTIONS = ["pending", "cleared", "uncleared"];

const PAYMENT_TYPE_LABELS = {
	NEW: "New Booking",
	"RE-PYT": "Re-Payment",
	"L-RE-PYT": "Late Re-Payment",
	EXTRA_WORK: "Extra Work",
	NONE: "None",
};

const STATUS_STYLES = {
	pending: "bg-amber-100 text-amber-800",
	approved: "bg-blue-100 text-blue-800",
	paid: "bg-emerald-100 text-emerald-800",
};

const breakupOf = (s, status) =>
	s?.statusBreakup?.find((b) => b._id === status) || { count: 0, amount: 0 };

const ACTION_TITLES = {
	paid: "Mark as paid",
	meta: "Update payment details",
};

const ROLES = [
	{ key: "bm", label: "BM", name: "Business Manager", user: "businessManager", sum: "Bm", icon: Briefcase },
	{ key: "tm", label: "TM", name: "Team Manager", user: "teamManager", sum: "Tm", icon: Users },
	{ key: "pm", label: "PM", name: "Project Manager", user: "projectManager", sum: "Pm", icon: FolderKanban },
];

// Flat form – one object, reused by every action dialog
const EMPTY_FORM = {
	payoutMonth: "",
	paidDate: "",
	clearingDate: "",
	depositedBank: "",
	clearedStatus: "pending",
	remarks: "",
};

// Finance opens on the payout queue
const DEFAULT_FILTERS = { payoutStatus: "approved", payoutMonth: "" };

const currentMonth = () => new Date().toISOString().slice(0, 7);
const today = () => new Date().toISOString().slice(0, 10);
const toDateInput = (d) => (d ? String(d).slice(0, 10) : "");

// ─── Accessors ───
const nameOf = (u) => (u && typeof u === "object" ? u.name || "—" : "—");
const roleAmount = (inc, roleKey, kind) => Number(inc?.[`${roleKey}${kind}Incentive`] || 0);
const totalFinal = (inc) => ROLES.reduce((sum, r) => sum + roleAmount(inc, r.key, "Final"), 0);
const statusOf = (inc) => String(inc?.payoutStatus || "pending").toLowerCase();

function StatusBadge({ status }) {
	const s = String(status || "").toLowerCase();
	return (
		<Badge className={`capitalize font-medium ${STATUS_STYLES[s] || ""}`} variant="secondary">
			{s || "—"}
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

export function FinanceIncentives() {
	const { current } = useAuthStore();
	const canPay = canMutate(current?.role, "finance");

	const {
		incentives,
		pagination,
		incentiveSummary: summary,
		loading,
		incentiveDetail,
		fetchIncentives,
		fetchIncentiveSummary,
		fetchIncentiveById,
		clearIncentiveDetail,
		updatePayout,
		updatePaymentMeta,
	} = useIncentive();

	const [filters, setFilters] = useState(DEFAULT_FILTERS);
	const [activeTab, setActiveTab] = useState("incentives");
	const [action, setAction] = useState(null);
	const [form, setForm] = useState(EMPTY_FORM);
	const [detailOpen, setDetailOpen] = useState(false);

	// ─── Handlers ───
	const buildParams = (f, page = 1) => {
		const params = { page, limit: pagination?.limit || 10 };
		if (f.payoutStatus !== "all") params.payoutStatus = f.payoutStatus;
		if (f.payoutMonth) params.payoutMonth = f.payoutMonth;
		return params;
	};

	const buildSummaryParams = (f) => {
		const params = {};
		if (f.payoutMonth) params.payoutMonth = f.payoutMonth;
		return params;
	};

	const refresh = (f = filters, page = pagination?.page || 1) => {
		fetchIncentives(buildParams(f, page));
		fetchIncentiveSummary(buildSummaryParams(f));
	};

	// Initial load: this page is mounted by a route/tab with no props, so it fetches its own queue once
	useEffect(() => {
		refresh(DEFAULT_FILTERS, 1);
	}, []);

	const handleFilterChange = (patch) => {
		const next = { ...filters, ...patch };
		setFilters(next);
		refresh(next, 1);
	};

	const handleFormChange = (patch) => setForm((prev) => ({ ...prev, ...patch }));

	const openAction = (type, incentive) => {
		setForm({
			...EMPTY_FORM,
			payoutMonth: incentive.payoutMonth || currentMonth(),
			paidDate: toDateInput(incentive.paidDate) || today(),
			clearingDate: toDateInput(incentive.clearingDate),
			depositedBank: incentive.depositedBank || "",
			clearedStatus: incentive.clearedStatus || "pending",
		});
		setAction({ type, incentive });
	};

	const closeAction = () => {
		setAction(null);
		setForm({ ...EMPTY_FORM });
	};

	const handleOpenDetail = async (incentive) => {
		setDetailOpen(true);
		await fetchIncentiveById(incentive._id);
	};

	const handleDetailOpenChange = (open) => {
		setDetailOpen(open);
		if (!open) clearIncentiveDetail();
	};

	const validate = (type) => {
		if (type === "paid") {
			if (!form.payoutMonth) return "Payout month is required";
			if (!form.paidDate) return "Paid date is required";
		}
		return null;
	};

	const handleSubmit = async () => {
		const { type, incentive } = action;
		const error = validate(type);
		if (error) return toast.error(error);

		const id = incentive._id;
		let result = null;

		switch (type) {
			case "paid":
				result = await updatePayout(id, {
					payoutMonth: form.payoutMonth,
					payoutStatus: "paid",
					paidDate: form.paidDate,
					remarks: form.remarks,
				});
				break;
			case "meta":
				result = await updatePaymentMeta(id, {
					...(form.clearingDate && { clearingDate: form.clearingDate }),
					depositedBank: form.depositedBank,
					clearedStatus: form.clearedStatus,
				});
				break;
			default:
				break;
		}

		if (result !== null) {
			closeAction();
			refresh();
			if (detailOpen) fetchIncentiveById(id);
		}
	};

	const renderActions = (inc) => {
		const btn = "h-8 px-2";
		const status = statusOf(inc);
		return (
			<div className="flex justify-end gap-1">
				<Button size="sm" variant="outline" className={btn} onClick={() => handleOpenDetail(inc)}>
					<Eye className="h-4 w-4 mr-1" /> View
				</Button>
				{canPay && status === "approved" && (
					<Button size="sm" variant="outline" className={btn} onClick={() => openAction("paid", inc)}>
						<BadgeCheck className="h-4 w-4 mr-1" /> Pay
					</Button>
				)}
				{canPay && status === "paid" && (
					<Button
						size="sm"
						variant="ghost"
						className={btn}
						onClick={() => openAction("meta", inc)}
					>
						<Pencil className="h-4 w-4 mr-1" />
						Edit Payment
					</Button>
				)}
			</div>
		);
	};

	const type = action?.type;
	const target = action?.incentive;

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
			<TabsList>
				<TabsTrigger value="incentives">Incentives</TabsTrigger>
				<TabsTrigger value="bonus" disabled>
					Bonus
				</TabsTrigger>
			</TabsList>

			<TabsContent value="incentives" className="space-y-5">
				{/* Summary (all statuses; only payout month filter applies) */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					<StatCard label="Total Base" value={formatINR(summary?.totalPaidAmount)} size="compact" />
					<StatCard label="Total Incentive" value={formatINR(summary?.totalFinalIncentive)} accent="success" size="compact" />
					{ROLES.map((r) => (
						<StatCard
							key={r.key}
							label={r.name}
							value={formatINR(summary?.[`total${r.sum}Final`])}
							accent="primary"
							size="compact"
						/>
					))}
					<StatCard
						label={`Approved (${breakupOf(summary, "approved").count})`}
						value={formatINR(breakupOf(summary, "approved").amount)}
						accent="warning"
						size="compact"
					/>
					<StatCard
						label={`Paid (${breakupOf(summary, "paid").count})`}
						value={formatINR(breakupOf(summary, "paid").amount)}
						accent="success"
						size="compact"
					/>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap items-end gap-3">
					<Tabs
						value={filters.payoutStatus}
						onValueChange={(v) => handleFilterChange({ payoutStatus: v })}
					>
						<TabsList>
							{STATUS_OPTIONS.map((status) => (
								<TabsTrigger key={status} value={status} className="capitalize">
									{status}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>

					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground">Payout month</Label>
						<Input type="month" className="w-44" value={filters.payoutMonth} onChange={(e) => handleFilterChange({ payoutMonth: e.target.value })} />
					</div>

					<Button variant="ghost" size="sm" onClick={() => handleFilterChange(DEFAULT_FILTERS)}>
						Reset
					</Button>
				</div>

				{/* Table */}
				<div className="rounded-md border overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Client / Project</TableHead>
								<TableHead className="text-right">Base Pay</TableHead>
								<TableHead className="text-right">GST</TableHead>
								<TableHead className="text-right">Auto Incentive</TableHead>
								<TableHead className="text-right">Extra Incentive</TableHead>
								<TableHead className="text-right">Final Incentive</TableHead>
								<TableHead>Payout Month</TableHead>
								<TableHead>Paid Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{incentives.length === 0 ? (
								<TableRow>
									<TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
										{loading ? "Loading incentives…" : "No incentives in this queue."}
									</TableCell>
								</TableRow>
							) : (
								incentives.map((inc) => (
									<TableRow key={inc._id}>
										<TableCell>
											<div className="font-medium">
												{inc.clientName || "—"}
											</div>
											<div className="text-xs text-muted-foreground">
												{inc.projectName || "—"}
											</div>
										</TableCell>

										<TableCell className="text-right">
											<div className="font-medium">
												{formatINR(inc.paidAmount)}
											</div>
										</TableCell>

										<TableCell className="text-right">
											<div className="font-medium">
												{formatINR(inc.gstAmount)}
											</div>
										</TableCell>

										<TableCell className="text-right">
											{formatINR(
												ROLES.reduce(
													(sum, r) => sum + roleAmount(inc, r.key, "Auto"),
													0
												)
											)}
										</TableCell>

										<TableCell className="text-right">
											{formatINR(
												ROLES.reduce(
													(sum, r) => sum + roleAmount(inc, r.key, "Extra"),
													0
												)
											)}
										</TableCell>

										<TableCell className="text-right font-semibold">
											{formatINR(totalFinal(inc))}
										</TableCell>

										<TableCell className="text-sm">
											{inc.payoutMonth
												? new Date(`${inc.payoutMonth}-01`).toLocaleDateString("en-IN", {
													month: "long",
													year: "numeric",
												})
												: "—"}
										</TableCell>

										<TableCell className="text-sm">
											{formatDate(inc.paidDate)}
										</TableCell>

										<TableCell>
											<StatusBadge status={statusOf(inc)} />
										</TableCell>

										<TableCell>
											{renderActions(inc)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				{pagination?.pages > 1 && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							Page {pagination.page} of {pagination.pages} · {pagination.total} incentives
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

				{/* ─── Action dialog (shared) ─── */}
				<Dialog open={Boolean(action)} onOpenChange={(open) => !open && closeAction()}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>{ACTION_TITLES[type]}</DialogTitle>
							<DialogDescription>
								{target?.clientName || "—"} · {target?.projectName || "—"} · Payable {formatINR(target ? totalFinal(target) : 0)}
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4">
							{type === "paid" && (
								<>
									<div className="rounded-md border divide-y text-sm">
										{ROLES.map((r) => (
											<div key={r.key} className="flex items-center justify-between px-3 py-2">
												<span>
													{r.label} · <span className="text-muted-foreground">{nameOf(target?.[r.user])}</span>
												</span>
												<span className="font-medium">{formatINR(roleAmount(target, r.key, "Final"))}</span>
											</div>
										))}
									</div>
									<div className="grid grid-cols-2 gap-3">
										<Field label="Payout month">
											<Input type="month" value={form.payoutMonth} onChange={(e) => handleFormChange({ payoutMonth: e.target.value })} />
										</Field>
										<Field label="Paid date">
											<Input type="date" value={form.paidDate} onChange={(e) => handleFormChange({ paidDate: e.target.value })} />
										</Field>
									</div>
									<Field label="Remarks (optional)">
										<Textarea rows={3} value={form.remarks} onChange={(e) => handleFormChange({ remarks: e.target.value })} />
									</Field>
								</>
							)}

							{type === "meta" && (
								<>
									<Field label="Clearing date">
										<Input type="date" value={form.clearingDate} onChange={(e) => handleFormChange({ clearingDate: e.target.value })} />
									</Field>
									<Field label="Deposited bank">
										<Input value={form.depositedBank} onChange={(e) => handleFormChange({ depositedBank: e.target.value })} />
									</Field>
									<Field label="Cleared status">
										<Select value={form.clearedStatus} onValueChange={(v) => handleFormChange({ clearedStatus: v })}>
											<SelectTrigger className="capitalize">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{CLEARED_OPTIONS.map((s) => (
													<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								</>
							)}
						</div>

						<DialogFooter>
							<Button variant="outline" onClick={closeAction}>Close</Button>
							<Button onClick={handleSubmit} disabled={loading}>
								{ACTION_TITLES[type]}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* ─── Detail dialog ─── */}
				<Dialog open={detailOpen} onOpenChange={handleDetailOpenChange}>
					<DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Incentive details</DialogTitle>
							<DialogDescription>
								{incentiveDetail?.clientName || "—"} · {incentiveDetail?.projectName || "—"}
							</DialogDescription>
						</DialogHeader>

						{incentiveDetail && (
							<div className="space-y-4 text-sm">
								<div className="rounded-md border overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Role</TableHead>
												<TableHead>Manager</TableHead>
												<TableHead className="text-right">Auto</TableHead>
												<TableHead className="text-right">Extra</TableHead>
												<TableHead className="text-right">Final</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{ROLES.map((r) => (
												<TableRow key={r.key}>
													<TableCell>{r.name}</TableCell>
													<TableCell>{nameOf(incentiveDetail[r.user])}</TableCell>
													<TableCell className="text-right">{formatINR(roleAmount(incentiveDetail, r.key, "Auto"))}</TableCell>
													<TableCell className="text-right">{formatINR(roleAmount(incentiveDetail, r.key, "Extra"))}</TableCell>
													<TableCell className="text-right font-medium">{formatINR(roleAmount(incentiveDetail, r.key, "Final"))}</TableCell>
												</TableRow>
											))}
											<TableRow className="bg-muted/50 font-semibold">
												<TableCell>Total</TableCell>
												<TableCell></TableCell>

												<TableCell className="text-right">
													{formatINR(
														ROLES.reduce(
															(sum, r) => sum + roleAmount(incentiveDetail, r.key, "Auto"),
															0
														)
													)}
												</TableCell>

												<TableCell className="text-right">
													{formatINR(
														ROLES.reduce(
															(sum, r) => sum + roleAmount(incentiveDetail, r.key, "Extra"),
															0
														)
													)}
												</TableCell>

												<TableCell className="text-right">
													{formatINR(totalFinal(incentiveDetail))}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>

								<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
									{[
										["Status", <StatusBadge key="s" status={statusOf(incentiveDetail)} />],
										["Payout month", incentiveDetail.payoutMonth || "—"],
										["Paid date", formatDate(incentiveDetail.paidDate)],
										["Payment type", PAYMENT_TYPE_LABELS[incentiveDetail.paymentType] || incentiveDetail.paymentType || "—"],
										["Payment mode", incentiveDetail.paymentMode || "—"],
										["Payment date", formatDate(incentiveDetail.paymentDate)],
										["Incentive base", formatINR(incentiveDetail.paidAmount)],
										["Clearing date", formatDate(incentiveDetail.clearingDate)],
										["Deposited bank", incentiveDetail.depositedBank || "—"],
										["Cleared status", incentiveDetail.clearedStatus || "—"],
									].map(([label, value]) => (
										<div key={label}>
											<div className="text-muted-foreground">{label}</div>
											<div>{value}</div>
										</div>
									))}
								</div>

								<div>
									<div className="text-muted-foreground">Remarks</div>
									<div>{incentiveDetail.remarks || "—"}</div>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</TabsContent>
		</Tabs>
	);
}