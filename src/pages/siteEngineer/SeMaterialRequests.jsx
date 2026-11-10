import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, Plus } from "lucide-react";
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
	Field,
	ListBlock,
	Pager,
	ProjectSelect,
	RecordDetailDialog,
	RowsEditor,
	StatusPill,
	errMsg,
	listFrom,
	pick,
	unwrap,
	useAssignedProjects,
} from "./shared";

const STATUS_OPTIONS = ["submitted", "approved", "rejected", "fulfilled"];
const statusTone = { submitted: "neutral", approved: "good", rejected: "bad", fulfilled: "good" };

const ITEM_COLUMNS = [
	{ key: "itemName", label: "Item", placeholder: "Cement", span: "sm:col-span-6" },
	{ key: "unit", label: "Unit", placeholder: "bag", span: "sm:col-span-3" },
	{ key: "qty", label: "Quantity", type: "number", placeholder: "1", span: "sm:col-span-3" },
];
const emptyItem = { itemName: "", unit: "", qty: "" };

const emptyForm = (projectId = "") => ({
	projectId,
	items: [{ ...emptyItem }],
	neededBy: "",
	notes: "",
});

// Items the engineer has actually filled in; blank rows are dropped before sending
const cleanItems = (items) =>
	items
		.filter((i) => i.itemName.trim() || i.unit.trim() || i.qty !== "")
		.map((i) => ({ itemName: i.itemName.trim(), unit: i.unit.trim(), qty: Number(i.qty) }));

export default function SeMaterialRequests() {
	const { projects } = useAssignedProjects();
	const [filters, setFilters] = useState({ projectId: "all", status: "all" });
	const [requests, setRequests] = useState([]);
	const [page, setPage] = useState({ page: 1, pages: 1 });
	const [loading, setLoading] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [form, setForm] = useState(emptyForm());
	const [saving, setSaving] = useState(false);

	const [viewingId, setViewingId] = useState(null);

	const load = useCallback(
		async (p = 1) => {
			setLoading(true);
			try {
				const params = { page: p, limit: 10 };
				if (filters.projectId !== "all") params.projectId = filters.projectId;
				if (filters.status !== "all") params.status = filters.status;
				const res = await siteEngineerApi.listMaterialRequests(params);
				const body = unwrap(res) || {};
				setRequests(body.requests || listFrom(res, "requests"));
				setPage(body.pagination || { page: p, pages: 1 });
			} catch (err) {
				toast.error(errMsg(err, "Could not load material requests"));
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
		setForm(emptyForm(filters.projectId !== "all" ? filters.projectId : projects[0]?._id || ""));
		setDialogOpen(true);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		if (!form.projectId) return toast.error("Select a project");
		const items = cleanItems(form.items);
		if (items.length === 0) return toast.error("Add at least one item");
		if (items.some((i) => !i.itemName || !i.unit || !(i.qty >= 1))) {
			return toast.error("Every item needs a name, a unit and a quantity of at least 1");
		}
		setSaving(true);
		const body = {
			projectId: form.projectId,
			items,
			neededBy: form.neededBy || undefined,
			notes: form.notes.trim() || undefined,
		};
		try {
			const outcome = await submitOrQueue({
				recordType: "material_request",
				endpoint: "/site/material-request",
				data: body,
				send: (payload) => siteEngineerApi.createMaterialRequest(payload),
			});
			toast.success(outcome.queued ? "No connection. The request will be sent when you're back online" : "Material request sent");
			setDialogOpen(false);
			load(page.page);
		} catch (err) {
			toast.error(errMsg(err, "Could not send the material request"));
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Material Requests"
				description="Ask for the materials your site needs. Your site manager reviews each request."
				actions={
					<Button onClick={openCreate} disabled={projects.length === 0}>
						<Plus className="h-4 w-4 mr-2" /> New request
					</Button>
				}
			/>

			<Card>
				<CardHeader>
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
						<CardTitle className="text-base">My requests</CardTitle>
						<div className="flex flex-wrap gap-2">
							<ProjectSelect
								value={filters.projectId}
								onChange={(v) => setFilters({ ...filters, projectId: v })}
								projects={projects}
								allowAll
							/>
							<Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
								<SelectTrigger className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									{STATUS_OPTIONS.map((s) => (
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
					) : requests.length === 0 ? (
						<div className="text-sm text-muted-foreground">No material requests found</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Project</TableHead>
										<TableHead>Items</TableHead>
										<TableHead>Needed by</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Requested</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{requests.map((r) => (
										<TableRow key={r._id}>
											<TableCell className="font-medium">{r.projectId?.name || r.projectName || "—"}</TableCell>
											<TableCell className="max-w-[260px] truncate">
												{(r.items || []).map((i) => `${i.itemName} (${i.qty} ${i.unit})`).join(", ") || "—"}
											</TableCell>
											<TableCell>{r.neededBy ? formatDate(r.neededBy) : "—"}</TableCell>
											<TableCell>
												<StatusPill tone={statusTone[r.status] || "neutral"}>{r.status}</StatusPill>
											</TableCell>
											<TableCell>{formatDate(r.createdAt)}</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" onClick={() => setViewingId(r._id)}>
													<Eye className="h-4 w-4" />
												</Button>
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
						<DialogTitle>New material request</DialogTitle>
						<DialogDescription>List what the site needs. Quantities must be at least 1.</DialogDescription>
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
							<Label className="mb-2 block">Items</Label>
							<RowsEditor
								rows={form.items}
								onChange={(items) => setForm({ ...form, items })}
								columns={ITEM_COLUMNS}
								emptyRow={emptyItem}
								addLabel="Add item"
							/>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<Label>Needed by</Label>
								<Input type="date" value={form.neededBy} onChange={(e) => setForm({ ...form, neededBy: e.target.value })} />
							</div>
						</div>
						<div>
							<Label>Notes</Label>
							<Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
						</div>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
								Cancel
							</Button>
							<Button type="submit" disabled={saving}>
								{saving ? "Sending..." : "Send request"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<RecordDetailDialog
				id={viewingId}
				onClose={() => setViewingId(null)}
				title="Material request"
				load={(id) => siteEngineerApi.getMaterialRequest(id).then((res) => pick(unwrap(res), "request", "materialRequest"))}
				render={(r) => (
					<div className="space-y-5 text-sm">
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							<Field label="Project">{r.projectId?.name || r.projectName}</Field>
							<Field label="Status">{r.status}</Field>
							<Field label="Needed by">{r.neededBy ? formatDate(r.neededBy) : "—"}</Field>
							<Field label="Requested on">{formatDateTime(r.createdAt)}</Field>
						</div>
						<ListBlock
							label="Items"
							items={(r.items || []).map((i) => `${i.itemName}: ${i.qty} ${i.unit}`)}
						/>
						<Field label="Notes">{r.notes}</Field>
					</div>
				)}
			/>
		</div>
	);
}
