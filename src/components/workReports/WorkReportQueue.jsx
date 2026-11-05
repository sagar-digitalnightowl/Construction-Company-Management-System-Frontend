// Shared queue for the work report review flow (PDF v2.7).
// The panel passes `allowed`: the actions that panel may take on a report.
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, CheckCircle2, Forward, XCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { workReportApi } from "@/api/workReportApi";
import { formatDate, formatDateTime } from "@/lib/helpers";

export const STATUS_LABEL = {
	submitted: "Submitted",
	reviewed: "Reviewed",
	forwarded: "Forwarded",
	acknowledged: "Acknowledged",
	rejected: "Rejected",
};

const STATUS_VARIANT = {
	submitted: "secondary",
	reviewed: "outline",
	forwarded: "default",
	acknowledged: "success",
	rejected: "destructive",
};

// Which action a report in each status can take, if the panel allows it
const ACTIONS_BY_STATUS = {
	submitted: ["review", "reject"],
	reviewed: ["forward"],
	forwarded: ["acknowledge"],
};

const ACTION_LABEL = {
	review: "Review",
	reject: "Reject",
	forward: "Forward",
	acknowledge: "Acknowledge",
};

// Roles a Site Manager can forward to (PDF 4.6)
export const FORWARD_ROLES = [
	{ value: "admin", label: "Admin" },
	{ value: "hr_manager", label: "HR Manager" },
	{ value: "director", label: "Director" },
	{ value: "project_manager", label: "Project Manager" },
];

const ACTION_ICON = {
	review: CheckCircle2,
	reject: XCircle,
	forward: Forward,
	acknowledge: CheckCircle2,
};

const errMsg = (err, fallback) => err?.response?.data?.message || fallback;

export function WorkReportQueue({ title, description, allowed, defaultStatus = "all", statusOptions }) {
	const [status, setStatus] = useState(defaultStatus);
	const [reports, setReports] = useState([]);
	const [page, setPage] = useState({ page: 1, pages: 1 });
	const [loading, setLoading] = useState(false);
	const [viewing, setViewing] = useState(null);
	const [detail, setDetail] = useState(null);
	const [action, setAction] = useState(null); // { kind, report }
	const [form, setForm] = useState({ comment: "", reason: "", note: "", roles: [] });
	const [saving, setSaving] = useState(false);

	const load = useCallback(
		async (p = 1) => {
			setLoading(true);
			try {
				const params = { page: p, limit: 10 };
				if (status !== "all") params.status = status;
				const res = await workReportApi.list(params);
				const body = res?.data?.data || {};
				setReports(body.reports || []);
				setPage(body.pagination || { page: p, pages: 1 });
			} catch (err) {
				toast.error(errMsg(err, "Could not load work reports"));
			} finally {
				setLoading(false);
			}
		},
		[status]
	);

	useEffect(() => {
		load(1);
	}, [load]);

	useEffect(() => {
		if (!viewing) return;
		setDetail(null);
		workReportApi
			.get(viewing)
			.then((res) => setDetail(res?.data?.data?.report || res?.data?.data || null))
			.catch((err) => toast.error(errMsg(err, "Could not load the report")));
	}, [viewing]);

	const openAction = (kind, report) => {
		setAction({ kind, report });
		setForm({ comment: "", reason: "", note: "", roles: [] });
	};

	const submitAction = async (e) => {
		e.preventDefault();
		const { kind, report } = action;
		let request;
		if (kind === "review") request = () => workReportApi.review(report._id, { reviewComment: form.comment.trim() || undefined });
		if (kind === "acknowledge")
			request = () => workReportApi.acknowledge(report._id, { acknowledgeComment: form.comment.trim() || undefined });
		if (kind === "reject") {
			if (!form.reason.trim()) return toast.error("Give the reason for rejecting this report");
			request = () => workReportApi.reject(report._id, { rejectionReason: form.reason.trim() });
		}
		if (kind === "forward") {
			if (form.roles.length === 0) return toast.error("Choose at least one role to forward to");
			request = () =>
				workReportApi.forward(report._id, {
					forwardedToRoles: form.roles.join(","),
					forwardNote: form.note.trim() || undefined,
				});
		}
		setSaving(true);
		try {
			const res = await request();
			toast.success(res?.data?.message || `${ACTION_LABEL[kind]} done`);
			setAction(null);
			load(page.page);
		} catch (err) {
			toast.error(errMsg(err, `Could not ${ACTION_LABEL[kind].toLowerCase()} this report`));
		} finally {
			setSaving(false);
		}
	};

	const toggleRole = (role) =>
		setForm((f) => ({ ...f, roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role] }));

	const options = statusOptions || [{ value: "all", label: "All statuses" }, ...Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))];

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader title={title} description={description} />

			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">Reports</CardTitle>
						<Select value={status} onValueChange={(v) => setStatus(v)}>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{options.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					{loading ? (
						<div className="text-sm text-muted-foreground">Loading...</div>
					) : reports.length === 0 ? (
						<div className="text-sm text-muted-foreground">No work reports here</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Submitted</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Engineer</TableHead>
										<TableHead>Work</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{reports.map((r) => {
										const panelActions = (ACTIONS_BY_STATUS[r.status] || []).filter((k) => allowed.includes(k));
										return (
											<TableRow key={r._id}>
												<TableCell>{formatDate(r.createdAt)}</TableCell>
												<TableCell>{r.projectId?.name || "—"}</TableCell>
												<TableCell>{r.siteEngineerId?.name || "—"}</TableCell>
												<TableCell className="max-w-[260px] truncate font-medium">{r.workTitle}</TableCell>
												<TableCell>
													<Badge variant={STATUS_VARIANT[r.status] || "secondary"}>{STATUS_LABEL[r.status] || r.status}</Badge>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-1">
														<Button variant="ghost" size="icon" title="View" aria-label="View" onClick={() => setViewing(r._id)}>
															<Eye className="h-4 w-4" />
														</Button>
														{panelActions.map((k) => {
															const Icon = ACTION_ICON[k];
															return (
																<Button
																	key={k}
																	variant="ghost"
																	size="icon"
																	title={ACTION_LABEL[k]}
																	aria-label={ACTION_LABEL[k]}
																	onClick={() => openAction(k, r)}
																>
																	<Icon className="h-4 w-4" />
																</Button>
															);
														})}
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
					{page.pages > 1 && (
						<div className="flex items-center justify-end gap-2 pt-4">
							<Button variant="outline" size="sm" disabled={page.page <= 1} onClick={() => load(page.page - 1)}>
								Previous
							</Button>
							<span className="text-sm text-muted-foreground">
								Page {page.page} of {page.pages}
							</span>
							<Button variant="outline" size="sm" disabled={page.page >= page.pages} onClick={() => load(page.page + 1)}>
								Next
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			<Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{detail?.workTitle || "Work report"}</DialogTitle>
						<DialogDescription>{detail ? STATUS_LABEL[detail.status] : "Loading..."}</DialogDescription>
					</DialogHeader>
					{detail && (
						<div className="space-y-3 text-sm">
							<div>Project: {detail.projectId?.name || "—"}</div>
							<div>Engineer: {detail.siteEngineerId?.name || "—"}</div>
							<div>
								Location: {[detail.towerName, detail.floorNumber && `Floor ${detail.floorNumber}`, detail.flatNumber && `Flat ${detail.flatNumber}`].filter(Boolean).join(" / ") || "—"}
							</div>
							<div>Progress: {detail.workProgress ?? 0}%</div>
							<div className="whitespace-pre-wrap">{detail.workDescription}</div>
							{detail.notes && <div className="text-muted-foreground">Notes: {detail.notes}</div>}
							{detail.reviewedAt && <div>Reviewed {formatDateTime(detail.reviewedAt)}{detail.reviewComment ? `: ${detail.reviewComment}` : ""}</div>}
							{detail.forwardedAt && (
								<div>
									Forwarded {formatDateTime(detail.forwardedAt)} to {detail.forwardedToRoles}
									{detail.forwardNote ? `: ${detail.forwardNote}` : ""}
								</div>
							)}
							{detail.acknowledgedAt && (
								<div>Acknowledged {formatDateTime(detail.acknowledgedAt)}{detail.acknowledgeComment ? `: ${detail.acknowledgeComment}` : ""}</div>
							)}
							{detail.status === "rejected" && <div className="text-destructive">Rejected: {detail.rejectionReason}</div>}
						</div>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={!!action} onOpenChange={(o) => !o && setAction(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{action ? ACTION_LABEL[action.kind] : ""} work report</DialogTitle>
						<DialogDescription>{action?.report?.workTitle}</DialogDescription>
					</DialogHeader>
					{action && (
						<form onSubmit={submitAction} className="space-y-4">
							{(action.kind === "review" || action.kind === "acknowledge") && (
								<div>
									<Label>Comment (optional)</Label>
									<Textarea rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
								</div>
							)}
							{action.kind === "reject" && (
								<div>
									<Label>Reason (required)</Label>
									<Textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
								</div>
							)}
							{action.kind === "forward" && (
								<>
									<div className="space-y-2">
										<Label>Forward to (required)</Label>
										{FORWARD_ROLES.map((r) => (
											<label key={r.value} className="flex items-center gap-2 text-sm">
												<Checkbox checked={form.roles.includes(r.value)} onCheckedChange={() => toggleRole(r.value)} />
												{r.label}
											</label>
										))}
									</div>
									<div>
										<Label>Note (optional)</Label>
										<Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
									</div>
								</>
							)}
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setAction(null)} disabled={saving}>
									Cancel
								</Button>
								<Button type="submit" disabled={saving}>
									{saving ? "Saving..." : ACTION_LABEL[action.kind]}
								</Button>
							</DialogFooter>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default WorkReportQueue;
