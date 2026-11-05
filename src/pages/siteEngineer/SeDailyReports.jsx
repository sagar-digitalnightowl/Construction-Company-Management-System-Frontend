import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { submitOrQueue } from "@/lib/offlineQueue";
import { formatDate } from "@/lib/helpers";
import {
	ConfirmDelete,
	Field,
	ListBlock,
	Pager,
	RecordDetailDialog,
	photoLinks,
	pick,
	ProjectSelect,
	RowsEditor,
	StatusPill,
	errMsg,
	linesToList,
	listFrom,
	listToLines,
	numOrUndef,
	todayISO,
	unwrap,
	useAssignedProjects,
} from "./shared";

const emptyForm = (projectId = "") => ({
	projectId,
	date: todayISO(),
	weather: "",
	temperature: "",
	humidity: "",
	workDone: [],
	laborCount: { skilled: "", unskilled: "", male: "", female: "" },
	machineryUsed: [],
	materialReceived: [],
	siteImages: "",
	safetyObservation: "",
	progress: "",
	nextDayPlan: "",
});

const WORK_COLUMNS = [
	{ key: "description", label: "Work done", span: "sm:col-span-4", placeholder: "e.g. Foundation casting" },
	{ key: "quantity", label: "Quantity", type: "number", span: "sm:col-span-2" },
	{ key: "unit", label: "Unit", span: "sm:col-span-2", placeholder: "cubic-meters" },
	{ key: "progress", label: "Progress %", type: "number", span: "sm:col-span-2" },
];
const MACHINE_COLUMNS = [
	{ key: "name", label: "Machinery", span: "sm:col-span-5", placeholder: "Concrete mixer" },
	{ key: "count", label: "Count", type: "number", span: "sm:col-span-3" },
	{ key: "hours", label: "Hours", type: "number", span: "sm:col-span-3" },
];
const MATERIAL_COLUMNS = [
	{ key: "item", label: "Item", span: "sm:col-span-3", placeholder: "Cement" },
	{ key: "qty", label: "Qty", type: "number", span: "sm:col-span-2" },
	{ key: "unit", label: "Unit", span: "sm:col-span-2", placeholder: "bags" },
	{ key: "fromVendor", label: "From vendor", span: "sm:col-span-5" },
];

// DPR form fields -> API body
const toBody = (f) => ({
	projectId: f.projectId,
	date: f.date,
	weather: f.weather || undefined,
	temperature: numOrUndef(f.temperature),
	humidity: numOrUndef(f.humidity),
	workDone: f.workDone.map((w) => ({
		taskName: w.description,
		quantity: numOrUndef(w.quantity),
		unit: w.unit,
		progress: numOrUndef(w.progress),
	})),
	laborCount: {
		skilled: numOrUndef(f.laborCount.skilled),
		unskilled: numOrUndef(f.laborCount.unskilled),
		male: numOrUndef(f.laborCount.male),
		female: numOrUndef(f.laborCount.female),
	},
	machineryUsed: f.machineryUsed.map((m) => ({ name: m.name, count: numOrUndef(m.count), hours: numOrUndef(m.hours) })),
	materialReceived: f.materialReceived.map((m) => ({
		item: m.item,
		qty: numOrUndef(m.qty),
		unit: m.unit,
		fromVendor: m.fromVendor,
	})),
	siteImages: linesToList(f.siteImages),
	safetyObservation: f.safetyObservation,
	progress: numOrUndef(f.progress),
	nextDayPlan: f.nextDayPlan,
});

// API report -> form fields
const toForm = (r) => ({
	projectId: r.projectId?._id || r.projectId || "",
	date: r.date ? String(r.date).slice(0, 10) : todayISO(),
	weather: r.weather || "",
	temperature: r.temperature ?? "",
	humidity: r.humidity ?? "",
	workDone: (r.workDone || []).map((w) => ({ ...w, description: w.taskName ?? w.description ?? "", quantity: w.quantity ?? "", progress: w.progress ?? "" })),
	laborCount: {
		skilled: r.laborCount?.skilled ?? "",
		unskilled: r.laborCount?.unskilled ?? "",
		male: r.laborCount?.male ?? "",
		female: r.laborCount?.female ?? "",
	},
	machineryUsed: r.machineryUsed || [],
	materialReceived: r.materialReceived || [],
	siteImages: listToLines(r.siteImages),
	safetyObservation: r.safetyObservation || "",
	progress: r.progress ?? "",
	nextDayPlan: r.nextDayPlan || "",
});

const laborText = (l) =>
	l ? `Skilled ${l.skilled ?? 0} · Unskilled ${l.unskilled ?? 0} · Male ${l.male ?? 0} · Female ${l.female ?? 0}` : null;

export default function SeDailyReports() {
	const { projects } = useAssignedProjects();
	const [filterProject, setFilterProject] = useState("all");
	const [reports, setReports] = useState([]);
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
				if (filterProject !== "all") params.projectId = filterProject;
				const res = await siteEngineerApi.listDailyReports(params);
				const body = unwrap(res) || {};
				setReports(body.reports || []);
				setPage(body.pagination || { page: p, pages: 1 });
			} catch (err) {
				toast.error(errMsg(err, "Could not load daily reports"));
			} finally {
				setLoading(false);
			}
		},
		[filterProject]
	);

	useEffect(() => {
		load(1);
	}, [load]);

	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm(filterProject !== "all" ? filterProject : projects[0]?._id || ""));
		setDialogOpen(true);
	};

	const openEdit = (r) => {
		setEditing(r);
		setForm(toForm(r));
		setDialogOpen(true);
	};

	const setLabor = (key, value) => setForm({ ...form, laborCount: { ...form.laborCount, [key]: value } });

	const handleSave = async (e) => {
		e.preventDefault();
		if (!form.projectId) return toast.error("Select a project");
		setSaving(true);
		try {
			const body = toBody(form);
			if (editing) {
				await siteEngineerApi.updateDailyReport(editing._id, body);
				toast.success("Daily report updated");
			} else {
				await submitOrQueue({ recordType: "daily_report", endpoint: "/site/daily-report", data: body, send: (payload) => siteEngineerApi.createDailyReport(payload) });
				toast.success("Daily report created");
			}
			setDialogOpen(false);
			load(page.page);
		} catch (err) {
			toast.error(errMsg(err, "Could not save the report"));
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		setDeleteBusy(true);
		try {
			await siteEngineerApi.deleteDailyReport(deleting._id);
			toast.success("Daily report deleted");
			setDeleting(null);
			load(page.page);
		} catch (err) {
			toast.error(errMsg(err, "Could not delete the report"));
		} finally {
			setDeleteBusy(false);
		}
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Daily Progress Reports"
				description="Record the day's work, labour, machinery and materials. You can edit a report until it is approved."
				actions={
					<Button onClick={openCreate} disabled={projects.length === 0}>
						<Plus className="h-4 w-4 mr-2" /> New report
					</Button>
				}
			/>

			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">My reports</CardTitle>
						<ProjectSelect value={filterProject} onChange={setFilterProject} projects={projects} allowAll />
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					{loading ? (
						<div className="text-sm text-muted-foreground">Loading...</div>
					) : reports.length === 0 ? (
						<div className="text-sm text-muted-foreground">No reports yet</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Progress</TableHead>
										<TableHead>Workers</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{reports.map((r) => {
										const workers = (r.laborCount?.skilled || 0) + (r.laborCount?.unskilled || 0);
										return (
											<TableRow key={r._id}>
												<TableCell>{formatDate(r.date)}</TableCell>
												<TableCell>{r.projectId?.name || r.projectName || "—"}</TableCell>
												<TableCell>{r.progress ?? 0}%</TableCell>
												<TableCell>{workers}</TableCell>
												<TableCell>
													{r.isApproved ? <StatusPill tone="good">Approved</StatusPill> : <StatusPill tone="warn">Pending</StatusPill>}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-1">
														<Button variant="ghost" size="sm" onClick={() => setViewingId(r._id)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="sm" disabled={r.isApproved} onClick={() => openEdit(r)}>
															<Pencil className="h-4 w-4" />
														</Button>
														<Button variant="ghost" size="sm" disabled={r.isApproved} onClick={() => setDeleting(r)}>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
					<Pager page={page.page} pages={page.pages} onChange={(p) => load(p)} />
				</CardContent>
			</Card>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{editing ? "Edit daily report" : "New daily report"}</DialogTitle>
						<DialogDescription>Fill in what happened on site today.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSave} className="space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div>
								<Label>Project</Label>
								<ProjectSelect value={form.projectId} onChange={(v) => setForm({ ...form, projectId: v })} projects={projects} className="w-full" />
							</div>
							<div>
								<Label>Date</Label>
								<Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
							</div>
							<div>
								<Label>Weather</Label>
								<Input value={form.weather} placeholder="sunny" onChange={(e) => setForm({ ...form, weather: e.target.value })} />
							</div>
							<div>
								<Label>Temperature (°C)</Label>
								<Input type="number" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} />
							</div>
							<div>
								<Label>Humidity (%)</Label>
								<Input type="number" value={form.humidity} onChange={(e) => setForm({ ...form, humidity: e.target.value })} />
							</div>
							<div>
								<Label>Overall progress (%)</Label>
								<Input type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
							</div>
						</div>

						<section className="space-y-2">
							<Label className="font-display text-xs uppercase tracking-wider">Work done</Label>
							<RowsEditor
								rows={form.workDone}
								onChange={(rows) => setForm({ ...form, workDone: rows })}
								columns={WORK_COLUMNS}
								addLabel="Add work item"
								emptyRow={{ description: "", quantity: "", unit: "", progress: "" }}
							/>
						</section>

						<section className="space-y-2">
							<Label className="font-display text-xs uppercase tracking-wider">Labour</Label>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								{[
									["skilled", "Skilled"],
									["unskilled", "Unskilled"],
									["male", "Male"],
									["female", "Female"],
								].map(([key, label]) => (
									<div key={key}>
										<Label className="text-xs text-muted-foreground">{label}</Label>
										<Input type="number" min="0" value={form.laborCount[key]} onChange={(e) => setLabor(key, e.target.value)} />
									</div>
								))}
							</div>
						</section>

						<section className="space-y-2">
							<Label className="font-display text-xs uppercase tracking-wider">Machinery used</Label>
							<RowsEditor
								rows={form.machineryUsed}
								onChange={(rows) => setForm({ ...form, machineryUsed: rows })}
								columns={MACHINE_COLUMNS}
								addLabel="Add machine"
								emptyRow={{ name: "", count: "", hours: "" }}
							/>
						</section>

						<section className="space-y-2">
							<Label className="font-display text-xs uppercase tracking-wider">Material received</Label>
							<RowsEditor
								rows={form.materialReceived}
								onChange={(rows) => setForm({ ...form, materialReceived: rows })}
								columns={MATERIAL_COLUMNS}
								addLabel="Add material"
								emptyRow={{ item: "", qty: "", unit: "", fromVendor: "" }}
							/>
						</section>

						<div className="grid grid-cols-1 gap-4">
							<div>
								<Label>Site photo links (one per line)</Label>
								<Textarea rows={3} value={form.siteImages} onChange={(e) => setForm({ ...form, siteImages: e.target.value })} />
							</div>
							<div>
								<Label>Safety observation</Label>
								<Textarea rows={2} value={form.safetyObservation} onChange={(e) => setForm({ ...form, safetyObservation: e.target.value })} />
							</div>
							<div>
								<Label>Plan for next day</Label>
								<Textarea rows={2} value={form.nextDayPlan} onChange={(e) => setForm({ ...form, nextDayPlan: e.target.value })} />
							</div>
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
								Cancel
							</Button>
							<Button type="submit" disabled={saving}>
								{saving ? "Saving..." : editing ? "Save changes" : "Create report"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<RecordDetailDialog
				id={viewingId}
				onClose={() => setViewingId(null)}
				title="Daily progress report"
				load={(id) => siteEngineerApi.getDailyReport(id).then((res) => pick(unwrap(res), "report"))}
				render={(r) => (
					<div className="space-y-5 text-sm">
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Field label="Date">{formatDate(r.date)}</Field>
							<Field label="Project">{r.projectId?.name || r.projectName}</Field>
							<Field label="Status">{r.isApproved ? "Approved" : "Pending approval"}</Field>
							<Field label="Weather">{r.weather}</Field>
							<Field label="Temperature">{r.temperature != null ? `${r.temperature} °C` : null}</Field>
							<Field label="Humidity">{r.humidity != null ? `${r.humidity}%` : null}</Field>
							<Field label="Progress">{r.progress != null ? `${r.progress}%` : null}</Field>
							<Field label="Labour">{laborText(r.laborCount)}</Field>
						</div>
						<ListBlock
							label="Work done"
							items={(r.workDone || []).map((w) => `${w.taskName ?? w.description} · ${w.quantity ?? ""} ${w.unit ?? ""} · ${w.progress ?? 0}%`)}
						/>
						<ListBlock
							label="Machinery used"
							items={(r.machineryUsed || []).map((m) => `${m.name} · ${m.count ?? 0} × ${m.hours ?? 0} h`)}
						/>
						<ListBlock
							label="Material received"
							items={(r.materialReceived || []).map(
								(m) => `${m.item} · ${m.qty ?? ""} ${m.unit ?? ""}${m.fromVendor ? ` from ${m.fromVendor}` : ""}`
							)}
						/>
						<Field label="Safety observation">{r.safetyObservation}</Field>
						<Field label="Plan for next day">{r.nextDayPlan}</Field>
						<ListBlock label="Site photos" items={photoLinks(r.siteImages)} />
					</div>
				)}
			/>

			<ConfirmDelete
				open={!!deleting}
				onOpenChange={(o) => !o && setDeleting(null)}
				title="Delete this report?"
				description="The daily report will be removed. This cannot be undone."
				busy={deleteBusy}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
