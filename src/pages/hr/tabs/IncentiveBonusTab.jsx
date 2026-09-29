import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Eye, PlusCircle, CalendarCheck, Briefcase, Users, FolderKanban, Plus, Pencil, Loader2, UserCheck } from "lucide-react";
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
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/ui/tabs";
import { StatCard } from "@/components/common/PageHeader";
import { useIncentive } from "@/hooks/useIncentive";
import { projectApi, authApi } from "@/api";
import { bookingApi } from "@/api/bookingApi";
import { formatDate, formatINR } from "@/lib/helpers";

const STATUS_OPTIONS = ["pending", "approved", "paid"];
const PAYMENT_TYPES = [
	{ value: "NEW", label: "New Booking" },
	{ value: "RE-PYT", label: "Re-Payment" },
	{ value: "L-RE-PYT", label: "Late Re-Payment" },
	{ value: "EXTRA_WORK", label: "Extra Work" },
	{ value: "NONE", label: "None" },
];
const CLEARED_OPTIONS = ["pending", "cleared", "uncleared"];
const PAYMENT_MODES = ["Cash", "Cheque", "Bank Transfer", "Card", "NEFT", "RTGS", "Demand Draft"];

const STATUS_STYLES = {
	pending: "bg-amber-100 text-amber-800",
	approved: "bg-blue-100 text-blue-800",
	paid: "bg-emerald-100 text-emerald-800",
};

const ACTION_TITLES = {
	extra: "Add / update extra incentive",
	approve: "Approve & set payout month",
	manual: "Add extra work entry",
};

// BM / TM / PM share the same field pattern: bmAutoIncentive, bmExtraIncentive, ...
const ROLES = [
	{ key: "bm", label: "BM", name: "Business Manager", user: "businessManager", sum: "Bm", icon: Briefcase },
	{ key: "tm", label: "TM", name: "Team Manager", user: "teamManager", sum: "Tm", icon: Users },
	{ key: "pm", label: "PM", name: "Project Manager", user: "projectManager", sum: "Pm", icon: FolderKanban },
];

const breakupOf = (s, status) =>
	s?.statusBreakup?.find((b) => b._id === status) || { count: 0, amount: 0 };

// Flat form – one object, reused by every action dialog
const EMPTY_FORM = {
	bmExtraIncentive: "",
	tmExtraIncentive: "",
	pmExtraIncentive: "",
	payoutMonth: "",
	clearingDate: "",
	depositedBank: "",
	clearedStatus: "pending",
	remarks: "",
	// manual extra work entry
	paidAmount: "",
	projectId: "",
	clientId: "",
	clientName: "",
	clientPhone: "",
	businessManager: "",
	teamManager: "",
	projectManager: "",
	paymentDate: "",
	paymentMode: "Cash",
};

const EMPTY_FILTERS = {
	payoutStatus: "pending",
	paymentType: "all",
	payoutMonth: "",
};

const currentMonth = () => new Date().toISOString().slice(0, 7);
const toDateInput = (d) => (d ? String(d).slice(0, 10) : "");

// ─── Accessors ───
const nameOf = (u) => (u && typeof u === "object" ? u.name || "—" : "—");
const num = (inc, field) => Number(inc?.[field] || 0);
const roleAmount = (inc, roleKey, kind) => num(inc, `${roleKey}${kind}Incentive`);
const totalFinal = (inc) => ROLES.reduce((sum, r) => sum + roleAmount(inc, r.key, "Final"), 0);
const totalExtra = (inc) =>
	ROLES.reduce(
		(sum, r) => sum + roleAmount(inc, r.key, "Extra"),
		0
	);
const statusOf = (inc) => String(inc?.payoutStatus || "pending").toLowerCase();

const formatRole = (role) =>
	role
		?.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

function StatusBadge({ status }) {
	const s = String(status || "").toLowerCase();
	return (
		<Badge className={`capitalize font-medium ${STATUS_STYLES[s] || ""}`} variant="secondary">
			{s || "—"}
		</Badge>
	);
}

function Field({ label, children, className = "" }) {
	return (
		<div className={`space-y-1.5 ${className}`}>
			<Label className="text-sm">{label}</Label>
			{children}
		</div>
	);
}

export function IncentiveBonusTab({
	incentives = [],
	pagination,
	summary,
	onRefresh,
	onRefreshSummary,
	canEdit,
	isAdmin = false,
}) {
	const {
		loading,
		incentiveDetail,
		fetchIncentiveById,
		clearIncentiveDetail,
		updateExtraIncentive,
		updatePayout,
		updatePaymentMeta,
		createManualIncentive,
	} = useIncentive();

	const [filters, setFilters] = useState(EMPTY_FILTERS);
	const [activeTab, setActiveTab] = useState("incentives");
	const [action, setAction] = useState(null);
	const [form, setForm] = useState(EMPTY_FORM);
	const [detailOpen, setDetailOpen] = useState(false);
	const [projects, setProjects] = useState([]);
	const [managers, setManagers] = useState([]);
	const [searchingCustomer, setSearchingCustomer] = useState(false);
	const searchTimer = useRef(null);

	// ─── Handlers ───
	const buildParams = (f, page = 1) => {
		const params = { page, limit: pagination?.limit || 10 };

		if (f.payoutStatus !== "all") params.payoutStatus = f.payoutStatus;
		if (f.paymentType !== "all") params.paymentType = f.paymentType;
		if (f.payoutMonth) params.payoutMonth = f.payoutMonth;

		return params;
	};

	const buildSummaryParams = (f) => {
		const params = {};
		if (f.payoutMonth) params.payoutMonth = f.payoutMonth;
		return params;
	};

	const refresh = (f = filters, page = pagination?.page || 1) => {
		onRefresh(buildParams(f, page));
		onRefreshSummary(buildSummaryParams(f));
	};

	const handleFilterChange = (patch) => {
		const next = { ...filters, ...patch };
		setFilters(next);
		refresh(next, 1);
	};

	const handleFormChange = (patch) => setForm((prev) => ({ ...prev, ...patch }));

	const openAction = (type, incentive) => {
		setForm({
			...EMPTY_FORM,
			bmExtraIncentive: incentive.bmExtraIncentive || "",
			tmExtraIncentive: incentive.tmExtraIncentive || "",
			pmExtraIncentive: incentive.pmExtraIncentive || "",
			payoutMonth: incentive.payoutMonth || currentMonth(),
			clearingDate: toDateInput(incentive.clearingDate),
			depositedBank: incentive.depositedBank || "",
			clearedStatus: incentive.clearedStatus || "pending",
			remarks: "",
		});
		setAction({ type, incentive });
	};

	const openManual = async () => {
		if (!isAdmin) return;
		setForm({ ...EMPTY_FORM, paymentDate: new Date().toISOString().slice(0, 10) });
		setAction({ type: "manual", incentive: null });

		try {
			const [projectRes, userRes] = await Promise.all([
				projectApi.getAll(),
				authApi.getUsers(),
			]);

			if (projectRes.data.success) {
				setProjects(projectRes.data.data?.projects || []);
			}

			if (userRes.data.success) {
				const list = userRes.data.data?.users?.filter(
					(user) =>
						user.role?.includes("manager") ||
						user.role === "manager" ||
						user.role === "admin"
				);
				setManagers(list || []);
			}
		} catch (err) {
			toast.error("Failed to load projects / managers");
		}
	};

	const searchExistingCustomer = async (searchTerm) => {
		if (!searchTerm || searchTerm.length < 5) return;
		try {
			setSearchingCustomer(true);
			const res = await bookingApi.searchCustomer(searchTerm);

			if (res.data?.success && res.data?.data?.customer) {
				const customer = res.data.data.customer;
				handleFormChange({
					clientId: customer._id,
					clientName: customer.name || "",
					clientPhone: customer.phone || searchTerm,
				});
				toast.success(`Client linked: ${customer.name}`);
			}
		} catch (err) {
			// not found - user can keep typing
		} finally {
			setSearchingCustomer(false);
		}
	};

	const handleClientPhoneChange = (value) => {
		handleFormChange({ clientPhone: value });
		clearTimeout(searchTimer.current);
		searchTimer.current = setTimeout(() => searchExistingCustomer(value.trim()), 500);
	};

	const unlinkCustomer = () => {
		clearTimeout(searchTimer.current);
		handleFormChange({ clientId: "", clientName: "", clientPhone: "" });
	}

	const closeAction = () => {
		clearTimeout(searchTimer.current);
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
		if (type === "extra") {
			const amounts = ROLES.map((r) => form[`${r.key}ExtraIncentive`]);
			if (amounts.some((a) => a !== "" && Number.isNaN(Number(a)))) return "Enter valid extra amounts";
			if (!form.remarks.trim()) return "Remarks are required for an extra incentive";
		}
		if (type === "approve" && !form.payoutMonth) return "Payout month is required";
		if (type === "manual") {
			if (!Number(form.paidAmount) || Number(form.paidAmount) <= 0) return "Enter a valid amount";
			if (!form.projectId) return "Select a project";
			if (!form.clientId) return "Select a client";
			if (!form.businessManager || !form.teamManager || !form.projectManager) return "Select BM, TM and PM";
			if (!form.paymentDate) return "Payment date is required";
		}
		return null;
	};

	const handleSubmit = async () => {
		const { type, incentive } = action;
		const error = validate(type);
		if (error) return toast.error(error);

		const id = incentive?._id;
		let result = null;

		switch (type) {
			case "manual":
				result = await createManualIncentive({
					paymentType: "EXTRA_WORK",
					paidAmount: Number(form.paidAmount),
					projectId: form.projectId,
					clientId: form.clientId,
					businessManager: form.businessManager,
					teamManager: form.teamManager,
					projectManager: form.projectManager,
					paymentDate: form.paymentDate,
					paymentMode: form.paymentMode,
					remarks: form.remarks,
				});
				break;
			case "extra":
				result = await updateExtraIncentive(id, {
					bmExtraIncentive: Number(form.bmExtraIncentive) || 0,
					tmExtraIncentive: Number(form.tmExtraIncentive) || 0,
					pmExtraIncentive: Number(form.pmExtraIncentive) || 0,
					remarks: form.remarks,
				});
				break;
			case "approve":
				result = await updatePayout(id, {
					payoutMonth: form.payoutMonth,
					payoutStatus: "approved",
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
			if (detailOpen && id) fetchIncentiveById(id);
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
				{canEdit && status !== "paid" && (
					<Button
						size="sm"
						variant="outline"
						className={btn}
						onClick={() => openAction("extra", inc)}
					>
						{totalExtra(inc) > 0 ? (
							<Pencil className="h-4 w-4 mr-1" />
						) : (
							<PlusCircle className="h-4 w-4 mr-1" />
						)}
						Extra
					</Button>
				)}
				{canEdit && status === "pending" && (
					<Button size="sm" variant="outline" className={btn} onClick={() => openAction("approve", inc)}>
						<CalendarCheck className="h-4 w-4 mr-1" /> Approve
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
				<TabsTrigger value="incentives">
					Incentives
				</TabsTrigger>

				<TabsTrigger value="bonus" disabled>
					Bonus
				</TabsTrigger>
			</TabsList>

			<TabsContent value="incentives" className="space-y-5">
				{/* Summary Stats */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					<StatCard
						label="Total Base"
						value={formatINR(summary?.totalPaidAmount)}
						size="compact"
					/>

					<StatCard
						label="Total Incentive"
						value={formatINR(summary?.totalFinalIncentive)}
						accent="success"
						size="compact"
					/>

					<StatCard
						label="Business Manager"
						value={formatINR(summary?.totalBmFinal)}
						accent="primary"
						size="compact"
					/>

					<StatCard
						label="Team Manager"
						value={formatINR(summary?.totalTmFinal)}
						accent="primary"
						size="compact"
					/>

					<StatCard
						label="Project Manager"
						value={formatINR(summary?.totalPmFinal)}
						accent="primary"
						size="compact"
					/>

					<StatCard
						label={`Pending (${breakupOf(summary, "pending").count})`}
						value={formatINR(breakupOf(summary, "pending").amount)}
						accent="warning"
						size="compact"
					/>

					<StatCard
						label={`Paid (${breakupOf(summary, "paid").count})`}
						value={formatINR(breakupOf(summary, "paid").amount)}
						accent="success"
						size="compact"
					/>

					<StatCard
						label={`Approved (${breakupOf(summary, "approved").count})`}
						value={formatINR(breakupOf(summary, "approved").amount)}
						accent="primary"
						size="compact"
					/>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap items-end gap-3">
					<Tabs
						value={filters.payoutStatus}
						onValueChange={(value) =>
							handleFilterChange({ payoutStatus: value })
						}
					>
						<TabsList>
							{STATUS_OPTIONS.map((status) => (
								<TabsTrigger
									key={status}
									value={status}
									className="capitalize"
								>
									{status}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>

					<Select value={filters.paymentType} onValueChange={(v) => handleFilterChange({ paymentType: v })}>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Payment type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All types</SelectItem>
							{PAYMENT_TYPES.map((type) => (
								<SelectItem key={type.value} value={type.value}>
									{type.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="space-y-1">
						<Label className="text-xs text-muted-foreground">Payout month</Label>
						<Input type="month" className="w-44" value={filters.payoutMonth} onChange={(e) => handleFilterChange({ payoutMonth: e.target.value })} />
					</div>

					<Button variant="ghost" size="sm" onClick={() => handleFilterChange(EMPTY_FILTERS)}>
						Reset
					</Button>

					{isAdmin && (
						<Button size="sm" className="ml-auto" onClick={openManual}>
							<Plus className="h-4 w-4 mr-1" /> Add Extra Work
						</Button>
					)}
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
									<TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
										{loading ? "Loading incentives…" : "No incentives match these filters."}
									</TableCell>
								</TableRow>
							) : (
								incentives.map((inc) => (
									<TableRow key={inc._id}>
										<TableCell>
											<div className="font-medium">{inc.clientName || "—"}</div>
											<div className="text-xs text-muted-foreground">{inc.projectName || "—"}</div>
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
											{formatINR(totalExtra(inc))}
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
										<TableCell>{renderActions(inc)}</TableCell>
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
					<DialogContent className={`w-[calc(100%-2rem)] max-h-[90vh] flex flex-col ${type === "manual" ? "sm:max-w-3xl" : "max-w-lg"}`}>
						<DialogHeader>
							<DialogTitle>{ACTION_TITLES[type]}</DialogTitle>
							<DialogDescription>
								{type === "manual"
									? "For extra work cash entries that don't come from a booking or installment."
									: `${target?.clientName || "—"} · ${target?.projectName || "—"} · Base ${formatINR(target?.paidAmount)}`}
							</DialogDescription>
						</DialogHeader>

						<div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-1">
							{type === "extra" && (
								<div className="grid grid-cols-3 gap-3">
									{ROLES.map((r) => (
										<Field key={r.key} label={`${r.label} extra`}>
											<Input
												type="number"
												value={form[`${r.key}ExtraIncentive`]}
												onChange={(e) => handleFormChange({ [`${r.key}ExtraIncentive`]: e.target.value })}
											/>
										</Field>
									))}
								</div>
							)}

							{type === "manual" && (
								<>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<Field label="Amount">
											<Input type="number" placeholder="2000" min={0} value={form.paidAmount} onChange={(e) => handleFormChange({ paidAmount: e.target.value })} />
										</Field>
										<Field label="Payment date">
											<Input type="date" value={form.paymentDate} onChange={(e) => handleFormChange({ paymentDate: e.target.value })} />
										</Field>
										<Field label="Payment mode">
											<Select value={form.paymentMode} onValueChange={(v) => handleFormChange({ paymentMode: v })}>
												<SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
												<SelectContent>
													{PAYMENT_MODES.map((mode) => (
														<SelectItem key={mode} value={mode}>{mode}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>

										<Field label="Project">
											<Select value={form.projectId} onValueChange={(v) => handleFormChange({ projectId: v })}>
												<SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
												<SelectContent>
													{projects.map((p) => (
														<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</Field>

										<Field label="Client" className="md:col-span-2">
											{form.clientId ? (
												<div className="bg-green-50/60 border border-green-200 p-3 rounded-md flex items-center justify-between">
													<div>
														<p className="font-semibold text-green-800 flex items-center gap-2 text-sm">
															<UserCheck className="h-4 w-4" />
															Client Linked
														</p>
														<p className="text-sm text-green-700 mt-0.5">
															<strong>{form.clientName}</strong> | {form.clientPhone}
														</p>
													</div>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7"
														onClick={unlinkCustomer}
													>
														Unlink
													</Button>
												</div>
											) : (
												<div className="relative">
													<Input
														placeholder="Type phone number or email to search client"
														value={form.clientPhone}
														onChange={(e) => handleClientPhoneChange(e.target.value)}
													/>
													{searchingCustomer && (
														<Loader2 className="h-4 w-4 animate-spin text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
													)}
												</div>
											)}
										</Field>

										{ROLES.map((r) => (
											<Field key={r.key} label={r.name}>
												<Select value={form[r.user]} onValueChange={(v) => handleFormChange({ [r.user]: v })}>
													<SelectTrigger><SelectValue placeholder={`Select ${r.name}`} /></SelectTrigger>
													<SelectContent>
														{managers.map((mgr) => (
															<SelectItem key={mgr._id} value={mgr._id}>
																{mgr.name || mgr.email} ({formatRole(mgr.role)})
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</Field>
										))}
									</div>
								</>
							)}

							{type === "approve" && (
								<Field label="Payout month">
									<Input type="month" value={form.payoutMonth} onChange={(e) => handleFormChange({ payoutMonth: e.target.value })} />
								</Field>
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

							{type !== "meta" && (
								<Field label={type === "extra" ? "Remarks" : "Remarks (optional)"}>
									<Textarea rows={3} value={form.remarks} onChange={(e) => handleFormChange({ remarks: e.target.value })} />
								</Field>
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
													{formatINR(totalExtra(incentiveDetail))}
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
										["Source", <span key="src" className="capitalize">{incentiveDetail.sourceType || "—"}</span>],
										["Payout month", incentiveDetail.payoutMonth || "—"],
										["Paid date", formatDate(incentiveDetail.paidDate)],
										["Payment type", incentiveDetail.paymentType || "—"],
										["Payment mode", incentiveDetail.paymentMode || "—"],
										["Payment date", formatDate(incentiveDetail.paymentDate)],
										["Booking date", formatDate(incentiveDetail.bookingDate)],
										["Incentive base", formatINR(incentiveDetail.paidAmount)],
										["Gross paid", formatINR(incentiveDetail.grossPaidAmount)],
										["GST", `${formatINR(incentiveDetail.gstAmount)}${incentiveDetail.gstPercentage ? ` (${incentiveDetail.gstPercentage}%)` : ""}`],
										["Transaction ID", incentiveDetail.transactionId || "—"],
										["Cheque no.", incentiveDetail.chequeNumber || "—"],
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