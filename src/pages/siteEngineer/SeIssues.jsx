import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
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
import { formatDate, formatDateTime } from "@/lib/helpers";
import {
	ConfirmDelete,
	Field,
	ListBlock,
	Pager,
	RecordDetailDialog,
	photoLinks,
	pick,
	ProjectSelect,
	StatusPill,
	errMsg,
	linesToList,
	listFrom,
	listToLines,
	unwrap,
	useAssignedProjects,
} from "./shared";

const SEVERITIES = ["low", "medium", "high"];
const STATUSES = ["open", "in-progress"];

const emptyForm = (projectId = "") => ({
	projectId,
	title: "",
	description: "",
	severity: "medium",
	category: "",
	photos: "",
	status: "open",
});

const severityTone = { low: "neutral", medium: "warn", high: "bad" };

export default function SeIssues() {
	const { projects } = useAssignedProjects();
	const [filters, setFilters] = useState({ projectId: "all", status: "all", severity: "all" });
	const [issues, setIssues] = useState([]);
	const [page, setPage] = useState({ page: 1, pages: 1 });
	const [loading, setLoading] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [form, setForm] = useState(emptyForm());
	const [saving, setSaving] = useState(false);

	const [viewingId, setViewingId] = useState(null);
	const [deleting, setDeleting] = useState(null);
	const [deleteBusy, setDeleteBusy] = useState(false);

	const load = useCallback(
		async (p = 1) => {
			setLoading(true);
			try {
				const params = { page: p, limit: 10 };
				if (filters.projectId !== "all") params.projectId = filters.projectId;
				if (filters.status !== "all") params.status = filters.status;
				if (filters.severity !== "all") params.severity = filters.severity;
				const res = await siteEngineerApi.listIssues(params);
				const body = unwrap(res) || {};
				setIssues(body.issues || listFrom(res, "issues"));
				setPage(body.pagination || { page: p, pages: 1 });
			} catch (err) {
				toast.error(errMsg(err, "Could not load issues"));
			} finally {
				setLoading(false);
			}
		},
		[filters]
	);

	useEffect(() => {
		load(1);
	}, [load]);

	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm(filters.projectId !== "all" ? filters.projectId : projects[0]?._id || ""));
		setDialogOpen(true);
	};

	const openEdit = (i) => {
		setEditing(i);
		setForm({
			projectId: i.projectId?._id || i.projectId || "",
			title: i.title || "",
			description: i.description || "",
			severity: i.severity || "medium",
			category: i.category || "",
			photos: listToLines(i.photos),
			status: i.status === "in-progress" ? "in-progress" : "open",
		});
		setDialogOpen(true);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		if (!form.projectId) return toast.error("Select a project");
		if (!form.title.trim()) return toast.error("Give the issue a title");
		setSaving(true);
		const body = {
			title: form.title.trim(),
			description: form.description,
			severity: form.severity,
			category: form.category,
			photos: linesToList(form.photos),
		};
		try {
			if (editing) {
				await siteEngineerApi.updateIssue(editing._id, { ...body, status: form.status });
				toast.success("Issue updated");
			} else {
				await submitOrQueue({ recordType: "issue", endpoint: "/site/issues", data: { ...body, projectId: form.projectId }, send: (payload) => siteEngineerApi.createIssue(payload) });
				toast.success("Issue reported");
			}
			setDialogOpen(false);
			load(page.page);
		} catch (err) {
			toast.error(errMsg(err, "Could not save the issue"));
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		setDeleteBusy(true);
		try {
			await siteEngineerApi.deleteIssue(deleting._id);
			toast.success("Issue deleted");
			setDeleting(null);
			load(page.page);
		} catch (err) {
			toast.error(errMsg(err, "Could not delete the issue"));
		} finally {
			setDeleteBusy(false);
		}
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Site Issues"
				description="Report problems on site. Your site manager and admin resolve them."
				actions={
					<Button onClick={openCreate} disabled={projects.length === 0}>
						<Plus className="h-4 w-4 mr-2" /> Report issue
					</Button>
				}
			/>

			<Card>
				<CardHeader>
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
						<CardTitle className="text-base">My issues</CardTitle>
						<div className="flex flex-wrap gap-2">
							<ProjectSelect
								value={filters.projectId}
								onChange={(v) => setFilters({ ...filters, projectId: v })}
								projects={projects}
								allowAll
							/>
							<Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
								<SelectTrigger className="w-36">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									<SelectItem value="open">Open</SelectItem>
									<SelectItem value="in-progress">In progress</SelectItem>
									<SelectItem value="resolved">Resolved</SelectItem>
								</SelectContent>
							</Select>
							<Select value={filters.severity} onValueChange={(v) => setFilters({ ...filters, severity: v })}>
								<SelectTrigger className="w-36">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All severities</SelectItem>
									{SEVERITIES.map((s) => (
										<SelectItem key={s} value={s}>
											{s}
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
					) : issues.length === 0 ? (
						<div className="text-sm text-muted-foreground">No issues found</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Severity</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Reported</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{issues.map((i) => (
										<TableRow key={i._id}>
											<TableCell className="font-medium max-w-[260px] truncate">{i.title}</TableCell>
											<TableCell>{i.category || "—"}</TableCell>
											<TableCell>
												<StatusPill tone={severityTone[i.severity] || "neutral"}>{i.severity}</StatusPill>
											</TableCell>
											<TableCell>{i.status}</TableCell>
											<TableCell>{formatDate(i.createdAt)}</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-1">
													<Button variant="ghost" size="sm" onClick={() => setViewingId(i._id)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => openEdit(i)}>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button variant="ghost" size="sm" onClick={() => setDeleting(i)}>
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
				<DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{editing ? "Edit issue" : "Report an issue"}</DialogTitle>
						<DialogDescription>Describe what happened and how serious it is.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSave} className="space-y-4">
						<div>
							<Label>Project</Label>
							<ProjectSelect
								value={form.projectId}
								onChange={(v) => setForm({ ...form, projectId: v })}
								projects={projects}
								className="w-full"
							/>
						</div>
						<div>
							<Label>Title</Label>
							<Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
						</div>
						<div>
							<Label>Description</Label>
							<Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Severity</Label>
								<Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SEVERITIES.map((s) => (
											<SelectItem key={s} value={s}>
												{s}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Category</Label>
								<Input value={form.category} placeholder="equipment" onChange={(e) => setForm({ ...form, category: e.target.value })} />
							</div>
						</div>
						{editing && (
							<div>
								<Label>Status</Label>
								<Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{STATUSES.map((s) => (
											<SelectItem key={s} value={s}>
												{s}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
						<div>
							<Label>Photo links (one per line)</Label>
							<Textarea rows={2} value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value })} />
						</div>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
								Cancel
							</Button>
							<Button type="submit" disabled={saving}>
								{saving ? "Saving..." : editing ? "Save changes" : "Report issue"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<RecordDetailDialog
				id={viewingId}
				onClose={() => setViewingId(null)}
				title="Site issue"
				load={(id) => siteEngineerApi.getIssue(id).then((res) => pick(unwrap(res), "issue"))}
				render={(i) => (
					<div className="space-y-5 text-sm">
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Field label="Project">{i.projectId?.name || i.projectName}</Field>
							<Field label="Status">{i.status}</Field>
							<Field label="Severity">{i.severity}</Field>
							<Field label="Category">{i.category}</Field>
							<Field label="Reported by">{i.reportedBy?.name}</Field>
							<Field label="Reported on">{formatDateTime(i.createdAt)}</Field>
						</div>
						<Field label="Description">{i.description}</Field>
						<ListBlock label="Photos" items={photoLinks(i.photos)} />
					</div>
				)}
			/>

			<ConfirmDelete
				open={!!deleting}
				onOpenChange={(o) => !o && setDeleting(null)}
				title="Delete this issue?"
				description="The issue will be removed. This cannot be undone."
				busy={deleteBusy}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
