import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Download, Eye, Plus, RotateCcw, Trash2, X } from "lucide-react";
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
import { PHOTO_ACCEPT, validatePhoto, uploadWorkReportPhoto } from "@/lib/workReportPhotos";
import {
	LAST_PROJECT_KEY,
	STATUS_LABEL,
	pickDefaultProject,
	rejectionReasonOf,
	statusClass,
	towersFrom,
} from "@/lib/workReportFormat";
import { cn, formatDate, formatDateTime } from "@/lib/helpers";
import {
	ConfirmDelete,
	Field,
	ListBlock,
	Pager,
	ProjectSelect,
	RecordDetailDialog,
	errMsg,
	getPositionOrNull,
	linesToList,
	listToLines,
	pick,
	unwrap,
	useAssignedProjects,
} from "./shared";

const NO_MANAGER_WARNING = "WARNING: This project has no Site Manager assigned";
const PAGE_SIZE = 10;

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

const readLastProject = () => {
	try {
		return localStorage.getItem(LAST_PROJECT_KEY) || "";
	} catch (err) {
		return "";
	}
};

const saveLastProject = (projectId) => {
	try {
		if (projectId) localStorage.setItem(LAST_PROJECT_KEY, projectId);
	} catch (err) {
		// storage blocked: the default falls back to the first project
	}
};

// Native selects keep the tower, floor and flat choices simple. An empty option means "not set".
function PlaceField({ label, value, onChange, options, placeholder, disabled }) {
	if (options && options.length > 0) {
		return (
			<div>
				<Label>{label}</Label>
				<select
					aria-label={label}
					className="h-9 w-full rounded-md border bg-background px-3 text-sm disabled:opacity-60"
					value={value}
					disabled={disabled}
					onChange={(e) => onChange(e.target.value)}
				>
					<option value="">Not set</option>
					{options.map((o) => (
						<option key={o} value={o}>
							{o}
						</option>
					))}
				</select>
			</div>
		);
	}
	return (
		<div>
			<Label>{label}</Label>
			<Input value={value} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
		</div>
	);
}

export default function SeWorkReports() {
	const { projects } = useAssignedProjects();
	const [summary, setSummary] = useState(null);
	const [filters, setFilters] = useState({ projectId: "all", status: "all", towerName: "", flatNumber: "", from: "", to: "" });
	const [reports, setReports] = useState([]);
	const [rejected, setRejected] = useState([]);
	const [page, setPage] = useState({ page: 1, pages: 1 });
	const [loading, setLoading] = useState(false);
	const [exporting, setExporting] = useState(false);
	const [noManagerWarning, setNoManagerWarning] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [form, setForm] = useState(emptyForm());
	const [towers, setTowers] = useState([]);
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

	// Towers, floors and flats for the chosen project (guide section 12)
	useEffect(() => {
		if (!dialogOpen || !form.projectId) {
			setTowers([]);
			return undefined;
		}
		let cancelled = false;
		siteEngineerApi
			.getProject(form.projectId)
			.then((res) => {
				if (cancelled) return;
				const body = unwrap(res) || {};
				setTowers(towersFrom(body.project || body));
			})
			.catch(() => {
				if (!cancelled) setTowers([]);
			});
		return () => {
			cancelled = true;
		};
	}, [dialogOpen, form.projectId]);

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

	const serverParams = useCallback(() => {
		const params = {};
		if (filters.projectId !== "all") params.projectId = filters.projectId;
		if (filters.status !== "all") params.status = filters.status;
		if (filters.towerName.trim()) params.towerName = filters.towerName.trim();
		if (filters.flatNumber.trim()) params.flatNumber = filters.flatNumber.trim();
		if (filters.from) params.createdFrom = filters.from;
		if (filters.to) params.createdTo = filters.to;
		return params;
	}, [filters]);

	const load = useCallback(
		async (p = 1) => {
			setLoading(true);
			try {
				const res = await siteEngineerApi.listWorkReports({ ...serverParams(), page: p, limit: PAGE_SIZE });
				const body = unwrap(res) || {};
				setReports(body.reports || []);
				setPage(body.pagination || { page: p, pages: 1 });
			} catch (err) {
				toast.error(errMsg(err, "Could not load work reports"));
			} finally {
				setLoading(false);
			}
		},
		[serverParams]
	);

	// Rejected reports are shown at the top, with their reasons, so the engineer can fix and resubmit
	const loadRejected = useCallback(() => {
		siteEngineerApi
			.listWorkReports({ status: "rejected", limit: 20 })
			.then((res) => setRejected(unwrap(res)?.reports || []))
			.catch(() => setRejected([]));
	}, []);

	useEffect(() => {
		load(1);
	}, [load]);

	useEffect(() => {
		loadSummary();
		loadRejected();
	}, [loadSummary, loadRejected]);

	const reloadAll = () => {
		load(page.page);
		loadSummary();
		loadRejected();
	};

	const openCreate = (prefill) => {
		const fallback = filters.projectId !== "all" ? filters.projectId : pickDefaultProject(projects, readLastProject());
		setForm(prefill || emptyForm(fallback));
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
			saveLastProject(form.projectId);
			toast.success(outcome.queued ? "Saved offline. It will be sent when you are online" : "Work report submitted");
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

	const downloadFile = (blob, name) => {
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = name;
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	};

	const handleExport = async () => {
		setExporting(true);
		const stamp = new Date().toISOString().slice(0, 10);
		try {
			// Excel workbook from the server, with the project, status, tower, flat and date filters applied there
			const res = await siteEngineerApi.exportWorkReports(serverParams());
			if (!res.data || res.data.size === 0) return toast.error("No work reports to export for these filters");
			downloadFile(res.data, `work-reports-${stamp}.xlsx`);
			toast.success("Excel file downloaded");
		} catch (err) {
			toast.error(errMsg(err, "Could not export the work reports"));
		} finally {
			setExporting(false);
		}
	};

	const selectedTower = towers.find((t) => t.towerName === form.towerName);
	const selectedFloor = selectedTower?.floors.find((f) => f.floorNumber === form.floorNumber);

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

			{rejected.length > 0 && (
				<Card className="border-destructive/50">
					<CardHeader>
						<CardTitle className="text-base text-destructive flex items-center gap-2">
							<AlertTriangle className="h-4 w-4" /> {rejected.length} rejected work report{rejected.length === 1 ? "" : "s"}
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-2 space-y-3">
						{rejected.map((r) => (
							<div key={r._id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-md border p-3">
								<div className="min-w-0 space-y-1">
									<div className="text-sm font-medium truncate">{r.workTitle}</div>
									<div className="text-xs text-muted-foreground">{r.projectId?.name || "—"} · {formatDate(r.createdAt)}</div>
									<div className="text-sm">
										<span className="font-medium">Reason: </span>
										{rejectionReasonOf(r) || "No reason was given. Ask your site manager, then resubmit."}
									</div>
								</div>
								<div className="flex gap-2 shrink-0">
									<Button variant="outline" size="sm" onClick={() => setViewingId(r._id)}>
										View
									</Button>
									<Button size="sm" onClick={() => openCreate(formFromReport(r))}>
										<RotateCcw className="h-4 w-4 mr-2" /> Fix and resubmit
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
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
							<Input
								type="date"
								className="w-40"
								aria-label="From date"
								title="From date"
								value={filters.from}
								onChange={(e) => setFilters({ ...filters, from: e.target.value })}
							/>
							<Input
								type="date"
								className="w-40"
								aria-label="To date"
								title="To date"
								value={filters.to}
								onChange={(e) => setFilters({ ...filters, to: e.target.value })}
							/>
							<Button variant="outline" onClick={handleExport} disabled={exporting}>
								<Download className="h-4 w-4 mr-2" /> {exporting ? "Exporting..." : "Export to Excel"}
							</Button>
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
												<span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", statusClass(r.status))}>
													{STATUS_LABEL[r.status] || r.status}
												</span>
												{r.status === "rejected" && rejectionReasonOf(r) && (
													<div className="mt-1 max-w-[220px] truncate text-xs text-destructive" title={rejectionReasonOf(r)}>
														{rejectionReasonOf(r)}
													</div>
												)}
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
								onChange={(v) => setForm({ ...form, projectId: v, towerName: "", floorNumber: "", flatNumber: "" })}
								projects={projects}
								className="w-full"
							/>
						</div>
						<PlaceField
							label="Tower (optional)"
							value={form.towerName}
							placeholder="Tower A"
							options={towers.map((t) => t.towerName)}
							onChange={(v) => setForm({ ...form, towerName: v, floorNumber: "", flatNumber: "" })}
						/>
						<div className="grid grid-cols-2 gap-3">
							<PlaceField
								label="Floor"
								value={form.floorNumber}
								placeholder="1"
								options={selectedTower?.floors.map((f) => f.floorNumber).filter(Boolean)}
								onChange={(v) => setForm({ ...form, floorNumber: v, flatNumber: "" })}
							/>
							<PlaceField
								label="Flat"
								value={form.flatNumber}
								placeholder="101"
								options={selectedFloor?.flats}
								onChange={(v) => setForm({ ...form, flatNumber: v })}
							/>
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
							<Label>Photos and documents</Label>
							<Input type="file" accept={PHOTO_ACCEPT} multiple disabled={!online} onChange={handlePickPhotos} />
							<div className="text-xs text-muted-foreground">
								JPG, PNG, WebP or PDF, up to 10 MB each. Large photos are made smaller before upload. HEIC photos must be converted to JPEG first.
							</div>
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
						{r.status === "rejected" && (
							<div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
								<div className="font-medium text-destructive">This report was rejected</div>
								<div>{rejectionReasonOf(r) || "No reason was given. Ask your site manager, then resubmit."}</div>
							</div>
						)}
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
						<ListBlock label="Timeline" items={timelineOf(r)} />
						<Field label="Notes">{r.notes}</Field>
						<ListBlock
							label="Photos and documents"
							items={(r.photos || []).map((u, i) => (
								<a key={i} href={u} target="_blank" rel="noreferrer" className="text-primary underline">
									File {i + 1}
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
