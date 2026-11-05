import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, Pencil } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { submitOrQueue } from "@/lib/offlineQueue";
import { formatDate } from "@/lib/helpers";
import {
	Field,
	ListBlock,
	ProjectSelect,
	RecordDetailDialog,
	RowsEditor,
	StatusPill,
	errMsg,
	linesToList,
	listFrom,
	listToLines,
	pick,
	todayISO,
	unwrap,
	useAssignedProjects,
} from "./shared";

const ITEM_STATUS = [
	{ value: "compliant", label: "Compliant" },
	{ value: "needs-attention", label: "Needs attention" },
];

const ITEM_COLUMNS = [
	{ key: "category", label: "Category", span: "sm:col-span-3", placeholder: "PPE" },
	{ key: "description", label: "Check", span: "sm:col-span-5", placeholder: "All workers wearing helmets" },
	{ key: "status", label: "Status", span: "sm:col-span-4", options: ITEM_STATUS, placeholder: "Select status" },
];

const emptyForm = (projectId = "") => ({
	projectId,
	date: todayISO(),
	items: [{ category: "PPE", description: "", status: "compliant" }],
	photos: "",
	remarks: "",
});

const formFromChecklist = (c) => ({
	projectId: c.projectId?._id || c.projectId || "",
	date: (c.inspectionDate || c.date) ? String(c.inspectionDate || c.date).slice(0, 10) : todayISO(),
	items: (c.items || []).map((i) => ({ category: i.category || "", description: i.item ?? i.description ?? "", status: i.status || "compliant" })),
	photos: listToLines(c.photos),
	remarks: c.remarks || "",
});

export default function SeSafety() {
	const { projects } = useAssignedProjects();
	const [projectId, setProjectId] = useState("");
	const [checklists, setChecklists] = useState([]);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState(emptyForm());
	const [editingId, setEditingId] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [viewingId, setViewingId] = useState(null);

	useEffect(() => {
		if (!projectId && projects.length) setProjectId(projects[0]._id);
	}, [projects, projectId]);

	const load = () => {
		if (!projectId) return;
		setLoading(true);
		siteEngineerApi
			.listSafetyChecklists({ projectId })
			.then((res) => setChecklists(listFrom(res, "records")))
			.catch((err) => toast.error(errMsg(err, "Could not load checklists")))
			.finally(() => setLoading(false));
	};

	useEffect(load, [projectId]);

	const openCreate = () => {
		setEditingId(null);
		setForm(emptyForm(projectId));
		setShowForm(true);
	};

	const openEdit = (c) => {
		setEditingId(c._id);
		setForm(formFromChecklist(c));
		setShowForm(true);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		if (!form.projectId) return toast.error("Select a project");
		const items = form.items.filter((i) => i.description?.trim());
		if (items.length === 0) return toast.error("Add at least one checklist item");
		const body = {
			inspectionDate: form.date,
			items: items.map((i) => ({ category: i.category, item: i.description, status: i.status })),
			photos: linesToList(form.photos),
			remarks: form.remarks,
		};
		setSaving(true);
		try {
			if (editingId) {
				await siteEngineerApi.updateSafetyChecklist(editingId, body);
				toast.success("Safety checklist updated");
			} else {
				await submitOrQueue({ recordType: "safety_checklist", endpoint: "/site/safety/checklist", data: { ...body, projectId: form.projectId }, send: (payload) => siteEngineerApi.createSafetyChecklist(payload) });
				toast.success("Safety checklist saved");
			}
			setShowForm(false);
			setEditingId(null);
			load();
		} catch (err) {
			toast.error(errMsg(err, "Could not save the checklist"));
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Safety Checklists"
				description="Record the site safety checks for the day. Items that need attention are flagged for your site manager."
				actions={
					<div className="flex gap-2">
						<ProjectSelect value={projectId} onChange={setProjectId} projects={projects} />
						<Button onClick={openCreate} disabled={!projectId}>
							New checklist
						</Button>
					</div>
				}
			/>

			{showForm && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">{editingId ? "Edit safety checklist" : "New safety checklist"}</CardTitle>
					</CardHeader>
					<CardContent className="pt-4">
						<form onSubmit={handleSave} className="space-y-5">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
									<Label>Date</Label>
									<Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
								</div>
							</div>
							<div className="space-y-2">
								<Label className="font-display text-xs uppercase tracking-wider">Checks</Label>
								<RowsEditor
									rows={form.items}
									onChange={(rows) => setForm({ ...form, items: rows })}
									columns={ITEM_COLUMNS}
									addLabel="Add check"
									emptyRow={{ category: "", description: "", status: "compliant" }}
								/>
							</div>
							<div>
								<Label>Photo links (one per line)</Label>
								<Textarea rows={2} value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value })} />
							</div>
							<div>
								<Label>Remarks</Label>
								<Textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
							</div>
							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowForm(false);
										setEditingId(null);
									}}
									disabled={saving}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={saving}>
									{saving ? "Saving..." : editingId ? "Save changes" : "Save checklist"}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Past checklists</CardTitle>
				</CardHeader>
				<CardContent className="pt-4 space-y-4">
					{loading && <div className="text-sm text-muted-foreground">Loading...</div>}
					{!loading && checklists.length === 0 && <div className="text-sm text-muted-foreground">No checklists for this project</div>}
					{checklists.map((c) => {
						const flagged = (c.items || []).filter((i) => i.status === "needs-attention").length;
						return (
							<div key={c._id} className="rounded-md border p-4 space-y-3">
								<div className="flex items-center justify-between gap-3">
									<div className="text-sm font-medium">{formatDate(c.date)}</div>
									<div className="flex items-center gap-2">
										{flagged > 0 ? (
											<StatusPill tone="warn">{flagged} need attention</StatusPill>
										) : (
											<StatusPill tone="good">All compliant</StatusPill>
										)}
										<Button variant="ghost" size="icon" title="View" aria-label="View" onClick={() => setViewingId(c._id)}>
											<Eye className="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="icon" title="Edit" aria-label="Edit" onClick={() => openEdit(c)}>
											<Pencil className="h-4 w-4" />
										</Button>
									</div>
								</div>
								<ul className="space-y-1 text-sm">
									{(c.items || []).map((i, idx) => (
										<li key={idx} className="flex justify-between gap-3">
											<span className="text-muted-foreground">
												{i.category ? `${i.category}: ` : ""}
												{i.item ?? i.description}
											</span>
											<span className={i.status === "needs-attention" ? "text-warning" : "text-success"}>{i.status}</span>
										</li>
									))}
								</ul>
								{c.remarks && <div className="text-xs text-muted-foreground">Remarks: {c.remarks}</div>}
							</div>
						);
					})}
				</CardContent>
			</Card>

			<RecordDetailDialog
				id={viewingId}
				onClose={() => setViewingId(null)}
				title="Safety checklist"
				load={(id) => siteEngineerApi.getSafetyChecklist(id).then((res) => pick(unwrap(res), "checklist", "record"))}
				render={(c) => (
					<div className="space-y-5 text-sm">
						<div className="grid grid-cols-2 gap-4">
							<Field label="Project">{c.projectId?.name || c.projectName}</Field>
							<Field label="Date">{formatDate(c.date)}</Field>
						</div>
						<ListBlock
							label="Checks"
							items={(c.items || []).map((i) => `${i.category ? `${i.category}: ` : ""}${i.item ?? i.description} · ${i.status}`)}
						/>
						<Field label="Remarks">{c.remarks}</Field>
						<ListBlock
							label="Photos"
							items={(c.photos || []).map((u, i) => (
								<a key={i} href={u} target="_blank" rel="noreferrer" className="text-primary underline">
									Photo {i + 1}
								</a>
							))}
						/>
					</div>
				)}
			/>
		</div>
	);
}
