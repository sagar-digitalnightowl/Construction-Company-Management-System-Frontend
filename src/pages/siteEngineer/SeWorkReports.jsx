import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Eye, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { submitOrQueue } from "@/lib/offlineQueue";
import { validatePhoto, uploadWorkReportPhoto } from "@/lib/workReportPhotos";
import { formatDate, formatDateTime } from "@/lib/helpers";
import {
	ConfirmDelete,
	Field,
	ListBlock,
	Pager,
	ProjectSelect,
	RecordDetailDialog,
	StatusPill,
	errMsg,
	getPositionOrNull,
	linesToList,
	listToLines,
	pick,
	unwrap,
	useAssignedProjects,
} from "./shared";

const STATUS_LABEL = {
	submitted: "Submitted",
	reviewed: "Reviewed",
	forwarded: "Forwarded",
	acknowledged: "Acknowledged",
	rejected: "Rejected",
};

const STATUS_TONE = {
	submitted: "warn",
	reviewed: "neutral",
	forwarded: "neutral",
	acknowledged: "good",
	rejected: "bad",
};

const NO_MANAGER_WARNING = "WARNING: This project has no Site Manager assigned";

const emptyForm = (projectId = "") => ({
	projectId,
	towerName: "",
	floorNumber: "",
	flatNumber: "",
	workTitle: "",
	workDescription: "",
	workProgress: 0,
	photos: "",
	notes: "",
});

// Fills the form from an existing report, used for resubmitting a rejected report
const formFromReport = (r) => ({
	projectId: r.projectId?._id || r.projectId || "",
	towerName: r.towerName || "",
	floorNumber: r.floorNumber || "",
	flatNumber: r.flatNumber || "",
	workTitle: r.workTitle || "",
	workDescription: r.workDescription || "",
	workProgress: r.workProgress ?? 0,
	photos: listToLines(r.photos),
	notes: r.notes || "",
});

const timelineOf = (r) => {
	const items = [`Submitted on ${formatDateTime(r.createdAt)}`];
	if (r.reviewedAt) items.push(`Reviewed on ${formatDateTime(r.reviewedAt)}${r.reviewComment ? `: ${r.reviewComment}` : ""}`);
	if (r.forwardedAt)
		items.push(
			`Forwarded on ${formatDateTime(r.forwardedAt)} to ${r.forwardedToRoles || "—"}${r.forwardNote ? `: ${r.forwardNote}` : ""}`
		);
	if (r.acknowledgedAt)
		items.push(`Acknowledged on ${formatDateTime(r.acknowledgedAt)}${r.acknowledgeComment ? `: ${r.acknowledgeComment}` : ""}`);
	if (r.rejectedAt) items.push(`Rejected on ${formatDateTime(r.rejectedAt)}`);
	return items;
};

export default function SeWorkReports() {
	const { projects } = useAssignedProjects();
	const [summary, setSummary] = useState(null);
	const [filters, setFilters] = useState({ projectId: "all", status: "all", towerName: "", flatNumber: "" });
	const [reports, setReports] = useState([]);
	const [page, setPage] = useState({ page: 1, pages: 1 });
	const [loading, setLoading] = useState(false);
	const [noManagerWarning, setNoManagerWarning] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [form, setForm] = useState(emptyForm());
	const [saving, setSaving] = useState(false);
	const [uploaded, setUploaded] = useState([]);
	const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine !== false);

	useEffect(() => {
		const on = () => setOnline(true);
		const off = () => setOnline(false);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);

	const handlePickPhotos = async (e) => {
		const files = Array.from(e.target.files || []);
		e.target.value = "";
		for (const file of files) {
			const problem = validatePhoto(file);
			if (problem) {
				toast.error(`${file.name}: ${problem}`);
				continue;
			}
			const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
			setUploaded((prev) => [...prev, { id, name: file.name, status: "uploading" }]);
			try {
				const url = await uploadWorkReportPhoto(file);
				setUploaded((prev) => prev.map((x) => (x.id === id ? { ...x, status: "done", url } : x)));
			} catch (err) {
				const error = err?.response?.data?.message || err.message || "Upload failed";
				setUploaded((prev) => prev.map((x) => (x.id === id ? { ...x, status: "error", error } : x)));
			}
		}
	};

	const [viewingId, setViewingId] = useState(null);
	const [deleting, setDeleting] = useState(null);
	const [deleteBusy, setDeleteBusy] = useState(false);

	const loadSummary = useCallback(() => {
		siteEngineerApi
			.workReportSummary()
			.then((res) => setSummary(unwrap(res)))
			.catch(() => setSummary(null));
	}, []);

	const load = useCallback(
		async (p = 1) => {
			setLoading(true);
			try {
				const params = { page: p, limit: 10 };
				if (filters.projectId !== "all") params.projectId = filters.projectId;
				if (filters.status !== "all") params.status = filters.status;
				if (filters.towerName.trim()) params.towerName = filters.towerName.trim();
				if (filters.flatNumber.trim()) params.flatNumber = filters.flatNumber.trim();
				const res = await siteEngineerApi.listWorkReports(params);
				const body = unwrap(res) || {};
				setReports(body.reports || []);
				setPage(body.pagination || { page: p, pages: 1 });
			} catch (err) {
				toast.error(errMsg(err, "Could not load work reports"));
			} finally {
				setLoading(false);
			}
		},
		[filters]
	);

	useEffect(() => {
		load(1);
	}, [load]);

	useEffect(() => {
		loadSummary();
	}, [loadSummary]);

	const reloadAll = () => {
		load(page.page);
		loadSummary();
	};

	const openCreate = (prefill) => {
		setForm(prefill || emptyForm(filters.projectId !== "all" ? filters.projectId : projects[0]?._id || ""));
		setDialogOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.projectId) return toast.error("Select a project");
		if (!form.workTitle.trim()) return toast.error("Give the work a title");
		if (!form.workDescription.trim()) return toast.error("Describe the work done");
		if (uploaded.some((u) => u.status === "uploading")) return toast.error("Wait for the photos to finish uploading");
		setSaving(true);
		try {
			const location = await getPositionOrNull();
			const body = {
				projectId: form.projectId,
				towerName: form.towerName.trim() || undefined,
				floorNumber: form.floorNumber.trim() || undefined,
				flatNumber: form.flatNumber.trim() || undefined,
				workTitle: form.workTitle.trim(),
				workDescription: form.workDescription.trim(),
				workProgress: Number(form.workProgress) || 0,
				photos: [...linesToList(form.photos), ...uploaded.filter((u) => u.status === "done").map((u) => u.url)],
				notes: form.notes.trim() || undefined,
				location: location || undefined,
			};
			const outcome = await submitOrQueue({ recordType: "work_report", endpoint: "/site/work-reports", data: body, send: (payload) => siteEngineerApi.createWorkReport(payload) });
			const message = outcome.res?.data?.message || "Work report submitted";
			setNoManagerWarning(message.includes(NO_MANAGER_WARNING));
			toast.success("Work report submitted");
			setDialogOpen(false);
			setUploaded([]);
			reloadAll();
		} catch (err) {
			toast.error(errMsg(err, "Could not submit the work report"));
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		setDeleteBusy(true);
		try {
			await siteEngineerApi.deleteWorkReport(deleting._id);
			toast.success("Work report deleted");
			setDeleting(null);
			reloadAll();
		} catch (err) {
			toast.error(errMsg(err, "Could not delete the work report"));
		} finally {
			setDeleteBusy(false);
		}
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Work Reports"
				description="Report work done on any running project. Your site manager reviews each report and forwards it to admin."
				actions={
					<Button onClick={() => openCreate()} disabled={projects.length === 0}>
						<Plus className="h-4 w-4 mr-2" /> New work report
					</Button>
				}
			/>

			{noManagerWarning && (
				<div className="flex items-start gap-3 rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
					<AlertTriangle className="h-4 w-4 mt-0.5 text-warning" />
					<div className="flex-1">
						Your last report was saved, but this project has no Site Manager assigned, so it has no reviewer yet. Ask the
						admin to assign one.
					</div>
					<Button variant="ghost" size="sm" onClick={() => setNoManagerWarning(false)}>
						Dismiss
					</Button>
				</div>
			)}

			<div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
				<StatCard label="Total" icon={Eye} size="compact" value={summary?.total ?? "—"} />
				<StatCard label="Submitted" icon={Eye} size="compact" value={summary?.submitted ?? "—"} accent="warning" />
				<StatCard label="Reviewed" icon={Eye} size="compact" value={summary?.reviewed ?? "—"} />
				<StatCard label="Forwarded" icon={Eye} size="compact" value={summary?.forwarded ?? "—"} />
				<StatCard label="Acknowledged" icon={Eye} size="compact" value={summary?.acknowledged ?? "—"} accent="success" />
				<StatCard label="Rejected" icon={Eye} size="compact" value={summary?.rejected ?? "—"} accent={summary?.rejected ? "destructive" : "neutral"} />
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
						<CardTitle className="text-base">My work reports</CardTitle>
						<div className="flex flex-wrap gap-2">
							<ProjectSelect
								value={filters.projectId}
								onChange={(v) => setFilters({ ...filters, projectId: v })}
								projects={projects}
								allowAll
							/>
							<Input
								className="w-32"
								placeholder="Tower"
								value={filters.towerName}
								onChange={(e) => setFilters({ ...filters, towerName: e.target.value })}
							/>
							<Input
								className="w-28"
								placeholder="Flat"
								value={filters.flatNumber}
								onChange={(e) => setFilters({ ...filters, flatNumber: e.target.value })}
							/>
							<Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
								<SelectTrigger className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									{Object.entries(STATUS_LABEL).map(([value, label]) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					{loading ? (
						<div className="text-sm text-muted-foreground">Loading...</div>
					) : reports.length === 0 ? (
						<div className="text-sm text-muted-foreground">No work reports found</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Work</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Progress</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{reports.map((r) => (
										<TableRow key={r._id}>
											<TableCell>{formatDate(r.createdAt)}</TableCell>
											<TableCell>{r.projectId?.name || "—"}</TableCell>
											<TableCell className="font-medium max-w-[240px] truncate">{r.workTitle}</TableCell>
											<TableCell>
												{[r.towerName, r.floorNumber && `Floor ${r.floorNumber}`, r.flatNumber && `Flat ${r.flatNumber}`]
													.filter(Boolean)
													.join(" / ") || "—"}
											</TableCell>
											<TableCell>{r.workProgress ?? 0}%</TableCell>
											<TableCell>
												<StatusPill tone={STATUS_TONE[r.status] || "neutral"}>{STATUS_LABEL[r.status] || r.status}</StatusPill>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-1">
													<Button variant="ghost" size="icon" title="View" aria-label="View" onClick={() => setViewingId(r._id)}>
														<Eye className="h-4 w-4" />
													</Button>
													{r.status === "rejected" && (
														<Button
															variant="ghost"
															size="icon"
															title="Resubmit"
															aria-label="Resubmit"
															onClick={() => openCreate(formFromReport(r))}
														>
															<RotateCcw className="h-4 w-4" />
														</Button>
													)}
													<Button variant="ghost" size="icon" title="Delete" aria-label="Delete" onClick={() => setDeleting(r)}>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
					<Pager page={page.page} pages={page.pages} onChange={(p) => load(p)} />
				</CardContent>
			</Card>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>New work report</DialogTitle>
						<DialogDescription>Describe the work you did. Your location is captured if you allow it.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="sm:col-span-2">
							<Label>Project</Label>
							<ProjectSelect
								value={form.projectId}
								onChange={(v) => setForm({ ...form, projectId: v })}
								projects={projects}
								className="w-full"
							/>
						</div>
						<div>
							<Label>Tower (optional)</Label>
							<Input value={form.towerName} placeholder="Tower A" onChange={(e) => setForm({ ...form, towerName: e.target.value })} />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label>Floor</Label>
								<Input value={form.floorNumber} placeholder="1" onChange={(e) => setForm({ ...form, floorNumber: e.target.value })} />
							</div>
							<div>
								<Label>Flat</Label>
								<Input value={form.flatNumber} placeholder="101" onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} />
							</div>
						</div>
						<div className="sm:col-span-2">
							<Label>Work title</Label>
							<Input value={form.workTitle} placeholder="Plinth casting completed" onChange={(e) => setForm({ ...form, workTitle: e.target.value })} />
						</div>
						<div className="sm:col-span-2">
							<Label>Work description</Label>
							<Textarea rows={3} value={form.workDescription} onChange={(e) => setForm({ ...form, workDescription: e.target.value })} />
						</div>
						<div className="sm:col-span-2">
							<Label>Progress: {form.workProgress}%</Label>
							<input
								type="range"
								min="0"
								max="100"
								value={form.workProgress}
								onChange={(e) => setForm({ ...form, workProgress: Number(e.target.value) })}
								className="w-full"
							/>
						</div>
						<div className="sm:col-span-2">
							<Label>Photos</Label>
							<Input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={!online} onChange={handlePickPhotos} />
							{!online && <div className="text-xs text-muted-foreground">Photos can be uploaded when you are online. You can still add photo links below.</div>}
							{uploaded.map((u) => (
								<div key={u.id} className="flex items-center justify-between gap-2 text-sm">
									<span className="truncate">{u.name}</span>
									<span className={u.status === "error" ? "text-destructive" : "text-muted-foreground"}>
										{u.status === "uploading" ? "Uploading..." : u.status === "error" ? u.error : "Uploaded"}
									</span>
									<Button type="button" variant="ghost" size="icon" title="Remove photo" aria-label="Remove photo" onClick={() => setUploaded((prev) => prev.filter((x) => x.id !== u.id))}>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
							<Label>Photo links (one per line)</Label>
							<Textarea rows={2} value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value })} />
						</div>
						<div className="sm:col-span-2">
							<Label>Notes</Label>
							<Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
						</div>
						<DialogFooter className="sm:col-span-2">
							<Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
								Cancel
							</Button>
							<Button type="submit" disabled={saving}>
								{saving ? "Submitting..." : "Submit report"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<RecordDetailDialog
				id={viewingId}
				onClose={() => setViewingId(null)}
				title="Work report"
				load={(id) => siteEngineerApi.getWorkReport(id).then((res) => pick(unwrap(res), "report", "workReport"))}
				render={(r) => (
					<div className="space-y-5 text-sm">
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Field label="Project">{r.projectId?.name}</Field>
							<Field label="Status">{STATUS_LABEL[r.status] || r.status}</Field>
							<Field label="Progress">{r.workProgress != null ? `${r.workProgress}%` : null}</Field>
							<Field label="Tower / floor / flat">
								{[r.towerName, r.floorNumber && `Floor ${r.floorNumber}`, r.flatNumber && `Flat ${r.flatNumber}`]
									.filter(Boolean)
									.join(" / ")}
							</Field>
							<Field label="Routed to Site Manager">{r.routedToSiteManagerId?.name || "Not assigned"}</Field>
							<Field label="Forwarded to">{r.forwardedToRoles}</Field>
						</div>
						<Field label="Work title">{r.workTitle}</Field>
						<Field label="Work description">{r.workDescription}</Field>
						{r.status === "rejected" && <Field label="Rejection reason">{r.rejectionReason}</Field>}
						<ListBlock label="Timeline" items={timelineOf(r)} />
						<Field label="Notes">{r.notes}</Field>
						<ListBlock
							label="Photos"
							items={(r.photos || []).map((u, i) => (
								<a key={i} href={u} target="_blank" rel="noreferrer" className="text-primary underline">
									Photo {i + 1}
								</a>
							))}
						/>
					</div>
				)}
			/>

			<ConfirmDelete
				open={!!deleting}
				onOpenChange={(o) => !o && setDeleting(null)}
				title="Delete this work report?"
				description="The report will be removed from your list. This cannot be undone."
				busy={deleteBusy}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
