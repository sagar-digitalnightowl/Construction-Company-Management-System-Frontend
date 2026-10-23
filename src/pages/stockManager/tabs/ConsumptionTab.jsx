// src/pages/stockManager/tabs/ConsumptionTab.jsx

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle, XCircle, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { projectApi } from "@/api";
import { useConsumption } from "@/hooks/useConsumption";
import { useProjectTowers } from "@/hooks/useProjectTowers";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";
import {
	CONSUMPTION_WORK_TYPES,
	STOCK_ITEM_CATEGORIES,
	STOCK_UNITS,
	VERIFICATION_STATUS_COLORS,
	VERIFICATION_STATUS_LABELS,
	workTypeLabel,
	displayTower,
} from "@/data/stockConstants";
import { formatMoney, formatQty, sanitizeNumeric } from "../stockHelpers";
import { currentUserId, rolePerms, canEditConsumption, canDeleteConsumption } from "../stockPermissions";

const ALL = "all";
const PAGE_SIZE = 20;
const EMPTY_FILTERS = {
	projectId: ALL,
	towerName: ALL,
	floor: "",
	workType: ALL,
	itemCategory: ALL,
	unit: ALL,
	verificationStatus: ALL,
	dateFrom: "",
	dateTo: "",
	search: "",
};

const idOf = (value) => value?._id ?? value;

// Turns the filter state into the query params the list endpoint reads
function buildParams(filters, page) {
	const params = { page, limit: PAGE_SIZE };
	if (filters.projectId !== ALL) params.projectId = filters.projectId;
	if (filters.towerName !== ALL) params.towerName = filters.towerName;
	if (filters.floor.trim()) params.floor = filters.floor.trim();
	if (filters.workType !== ALL) params.workType = filters.workType;
	if (filters.itemCategory !== ALL) params.itemCategory = filters.itemCategory;
	if (filters.unit !== ALL) params.unit = filters.unit;
	if (filters.verificationStatus !== ALL) params.verificationStatus = filters.verificationStatus;
	if (filters.dateFrom) params.dateFrom = filters.dateFrom;
	if (filters.dateTo) params.dateTo = filters.dateTo;
	if (filters.search.trim()) params.search = filters.search.trim();
	return params;
}

export function ConsumptionTab({ refreshKey = 0 }) {
	const { current } = useAuthStore();
	const userId = currentUserId(current);
	const perms = rolePerms(current?.role);
	const { records, pagination, loading, fetchConsumptions, updateConsumption, deleteConsumption, verifyConsumption } = useConsumption();

	const [projects, setProjects] = useState([]);
	const [filters, setFilters] = useState(EMPTY_FILTERS);
	const [searchInput, setSearchInput] = useState("");
	const [page, setPage] = useState(1);

	const [editing, setEditing] = useState(null);
	const [editForm, setEditForm] = useState(null);
	const [saving, setSaving] = useState(false);
	const [verifying, setVerifying] = useState(null); // { record, status }
	const [note, setNote] = useState("");
	const [deleting, setDeleting] = useState(null);

	const { towers: filterTowers, error: filterTowersError } = useProjectTowers(filters.projectId === ALL ? null : filters.projectId);
	const { towers: editTowers } = useProjectTowers(editing ? idOf(editing.projectId) : null);

	useEffect(() => {
		projectApi
			.getAll({ limit: 100 })
			.then((res) => setProjects(res.data?.data?.projects || []))
			.catch(() => setProjects([]));
	}, []);

	// Search waits briefly after the last keystroke so the list does not refetch on every letter
	useEffect(() => {
		if (searchInput === filters.search) return;
		const timer = setTimeout(() => setFilter("search", searchInput), 400);
		return () => clearTimeout(timer);
	}, [searchInput]);

	useEffect(() => {
		fetchConsumptions(buildParams(filters, page));
	}, [refreshKey, filters, page]);

	const setFilter = (key, value) => {
		setFilters((prev) => {
			const next = { ...prev, [key]: value };
			// A tower belongs to one project, so changing the project clears the tower
			if (key === "projectId") next.towerName = ALL;
			return next;
		});
		setPage(1);
	};

	const clearFilters = () => {
		setSearchInput("");
		setFilters(EMPTY_FILTERS);
		setPage(1);
	};

	const reload = () => fetchConsumptions(buildParams(filters, page));

	const openEdit = (record) => {
		setEditing(record);
		setEditForm({
			qtyConsumed: String(record.qtyConsumed ?? ""),
			towerName: record.towerName || "",
			floor: record.floor || "",
			workType: record.workType || "",
			workDescription: record.workDescription || "",
			consumedAt: record.consumedAt ? record.consumedAt.split("T")[0] : "",
			notes: record.notes || "",
		});
	};

	const saveEdit = async () => {
		if (!editForm.qtyConsumed || parseFloat(editForm.qtyConsumed) <= 0) return;
		if (!editForm.towerName || !editForm.workType) return;
		setSaving(true);
		try {
			await updateConsumption(editing?._id, { ...editForm, qtyConsumed: parseFloat(editForm.qtyConsumed), floor: editForm.floor.trim() });
			setEditing(null);
			reload();
		} catch (error) {
			// Toast shown by the hook
		} finally {
			setSaving(false);
		}
	};

	const submitVerify = async () => {
		setSaving(true);
		try {
			await verifyConsumption(verifying?.record?._id, verifying?.status, note);
			setVerifying(null);
			setNote("");
			reload();
		} catch (error) {
			// Toast shown by the hook
		} finally {
			setSaving(false);
		}
	};

	const confirmDelete = async () => {
		const ok = await deleteConsumption(deleting?._id);
		setDeleting(null);
		if (ok) reload();
	};

	const editSelectedTower = editTowers.find((t) => t.towerName === editForm?.towerName);
	const editFloorOptions = (editSelectedTower?.floors || []).map((f) => String(f.floorNumber));

	const pageCount = pagination?.pages || 0;
	const hasActiveFilters = JSON.stringify({ ...filters, search: "" }) !== JSON.stringify({ ...EMPTY_FILTERS, search: "" }) || searchInput !== "";

	const filterBar = (
		<div className="space-y-3">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				<Select value={filters.projectId} onValueChange={(v) => setFilter("projectId", v)}>
					<SelectTrigger className="bg-background">
						<SelectValue placeholder="All projects" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All projects</SelectItem>
						{projects.map((p) => (
							<SelectItem key={p._id} value={p._id}>
								{p.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={filters.towerName} onValueChange={(v) => setFilter("towerName", v)} disabled={filters.projectId === ALL}>
					<SelectTrigger className="bg-background">
						<SelectValue placeholder={filters.projectId === ALL ? "Pick a project first" : "All towers"} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All towers</SelectItem>
						{filterTowers.map((t) => (
							<SelectItem key={t.towerName} value={t.towerName}>
								{t.towerName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="relative">
					<Input value={filters.floor} placeholder="Floor (e.g. 3, Ground)" onChange={(e) => setFilter("floor", e.target.value)} className="bg-background pr-9" />
					{filters.floor && (
						<button type="button" onClick={() => setFilter("floor", "")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear floor">
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				<Select value={filters.workType} onValueChange={(v) => setFilter("workType", v)}>
					<SelectTrigger className="bg-background">
						<SelectValue placeholder="All work types" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All work types</SelectItem>
						{CONSUMPTION_WORK_TYPES.map((w) => (
							<SelectItem key={w.value} value={w.value}>
								{w.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={filters.itemCategory} onValueChange={(v) => setFilter("itemCategory", v)}>
					<SelectTrigger className="bg-background">
						<SelectValue placeholder="All categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All categories</SelectItem>
						{STOCK_ITEM_CATEGORIES.map((c) => (
							<SelectItem key={c.value} value={c.value}>
								{c.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={filters.unit} onValueChange={(v) => setFilter("unit", v)}>
					<SelectTrigger className="bg-background">
						<SelectValue placeholder="All units" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All units</SelectItem>
						{STOCK_UNITS.map((u) => (
							<SelectItem key={u.value} value={u.value}>
								{u.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={filters.verificationStatus} onValueChange={(v) => setFilter("verificationStatus", v)}>
					<SelectTrigger className="bg-background">
						<SelectValue placeholder="All statuses" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All statuses</SelectItem>
						{Object.entries(VERIFICATION_STATUS_LABELS).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="space-y-1">
					<Label htmlFor="cons-filter-from" className="text-xs text-muted-foreground">
						Date from
					</Label>
					<Input id="cons-filter-from" type="date" value={filters.dateFrom} onChange={(e) => setFilter("dateFrom", e.target.value)} className="bg-background" />
				</div>

				<div className="space-y-1">
					<Label htmlFor="cons-filter-to" className="text-xs text-muted-foreground">
						Date to
					</Label>
					<Input id="cons-filter-to" type="date" value={filters.dateTo} onChange={(e) => setFilter("dateTo", e.target.value)} className="bg-background" />
				</div>

				<Input value={searchInput} placeholder="Search item, purpose or description" onChange={(e) => setSearchInput(e.target.value)} className="bg-background lg:col-span-2" />
			</div>

			{filterTowersError && <p className="text-xs text-destructive">Could not load towers for the selected project. Try again later.</p>}

			{hasActiveFilters && (
				<button type="button" onClick={clearFilters} className="text-sm text-primary hover:underline">
					Clear all filters
				</button>
			)}
		</div>
	);

	const hasRecords = records.length > 0;

	return (
		<div className="space-y-4">
			{filterBar}

			{loading && !hasRecords ? (
				<Card className="p-6 text-center text-muted-foreground">Loading consumption records...</Card>
			) : !hasRecords ? (
				<Card className="p-6 text-center text-muted-foreground">No consumption records match these filters.</Card>
			) : (
				<Card>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date used</TableHead>
									<TableHead>Project</TableHead>
									<TableHead>Item</TableHead>
									<TableHead>Quantity used</TableHead>
									<TableHead>Tower / floor</TableHead>
									<TableHead>Work type</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{records.map((r) => {
									const pending = r.verificationStatus === "pending";
									return (
										<TableRow key={r._id}>
											<TableCell>
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">{formatDate(r.consumedAt)}</span>
												</div>
											</TableCell>
											<TableCell className="font-medium">{r.projectName}</TableCell>
											<TableCell>{r.itemName}</TableCell>
											<TableCell className="font-medium">
												{formatQty(r.qtyConsumed)} {r.unit}
											</TableCell>
											<TableCell className="text-sm">
												<div className={r.towerName && r.towerName !== "Unknown" ? "" : "italic text-muted-foreground"}>{displayTower(r.towerName)}</div>
												{r.floor ? <div className="text-xs text-muted-foreground">Floor {r.floor}</div> : null}
											</TableCell>
											<TableCell>
												<Badge variant="default">{workTypeLabel(r.workType)}</Badge>
											</TableCell>
											<TableCell className="text-sm max-w-55 truncate" title={r.workDescription || ""}>
												{r.workDescription || "—"}
											</TableCell>
											<TableCell className="text-sm">{r.consumedAmount != null ? formatMoney(r.consumedAmount) : "—"}</TableCell>
											<TableCell>
												<Badge variant={VERIFICATION_STATUS_COLORS[r.verificationStatus] || "default"}>{r.verificationStatus}</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													{canEditConsumption(current?.role, userId, r) && (
														<Button size="sm" variant="ghost" onClick={() => openEdit(r)} title="Edit">
															<Pencil className="h-4 w-4" />
														</Button>
													)}
													{perms.canVerify && pending && (
														<>
															<Button size="sm" variant="ghost" onClick={() => setVerifying({ record: r, status: "verified" })} title="Verify">
																<CheckCircle className="h-4 w-4 text-success" />
															</Button>
															<Button size="sm" variant="ghost" onClick={() => setVerifying({ record: r, status: "rejected" })} title="Reject">
																<XCircle className="h-4 w-4 text-destructive" />
															</Button>
														</>
													)}
													{canDeleteConsumption(current?.role, userId, r) && (
														<Button size="sm" variant="ghost" onClick={() => setDeleting(r)} title="Delete">
															<Trash2 className="h-4 w-4 text-destructive" />
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>

					{pageCount > 1 && (
						<div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm">
							<span className="text-muted-foreground">
								Page {page} of {pageCount} · {pagination.total} records
							</span>
							<div className="flex items-center gap-2">
								<Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}>
									<ChevronLeft className="h-4 w-4 mr-1" />
									Previous
								</Button>
								<Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount || loading}>
									Next
									<ChevronRight className="h-4 w-4 ml-1" />
								</Button>
							</div>
						</div>
					)}
				</Card>
			)}

			{/* Edit (owner, or admin / finance / PM) */}
			{editing && editForm && (
				<Dialog open onOpenChange={() => setEditing(null)}>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Edit Consumption</DialogTitle>
							<DialogDescription>
								{editing.itemName} · {editing.projectName}
							</DialogDescription>
						</DialogHeader>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="cons-qty">Quantity used *</Label>
								<Input id="cons-qty" inputMode="decimal" value={editForm.qtyConsumed} onChange={(e) => setEditForm({ ...editForm, qtyConsumed: sanitizeNumeric(e.target.value) })} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="cons-date">Date used</Label>
								<Input id="cons-date" type="date" value={editForm.consumedAt} onChange={(e) => setEditForm({ ...editForm, consumedAt: e.target.value })} />
							</div>
							<div className="space-y-2">
								<Label>Tower *</Label>
								<Select value={editForm.towerName} onValueChange={(v) => setEditForm({ ...editForm, towerName: v, floor: "" })}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select tower" />
									</SelectTrigger>
									<SelectContent>
										{editTowers.map((t) => (
											<SelectItem key={t.towerName} value={t.towerName}>
												{t.towerName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="cons-floor-edit">Floor</Label>
								<Input id="cons-floor-edit" list="cons-floor-edit-options" value={editForm.floor} onChange={(e) => setEditForm({ ...editForm, floor: e.target.value })} />
								<datalist id="cons-floor-edit-options">
									{editFloorOptions.map((f) => (
										<option key={f} value={f} />
									))}
								</datalist>
							</div>
							<div className="space-y-2">
								<Label>Work type *</Label>
								<Select value={editForm.workType} onValueChange={(v) => setEditForm({ ...editForm, workType: v })}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select work type" />
									</SelectTrigger>
									<SelectContent>
										{CONSUMPTION_WORK_TYPES.map((w) => (
											<SelectItem key={w.value} value={w.value}>
												{w.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="cons-description-edit">Work description</Label>
								<Input id="cons-description-edit" value={editForm.workDescription} onChange={(e) => setEditForm({ ...editForm, workDescription: e.target.value })} />
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="cons-notes">Notes</Label>
								<Textarea id="cons-notes" rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>
								Cancel
							</Button>
							<Button onClick={saveEdit} disabled={saving || !editForm.towerName || !editForm.workType}>
								{saving ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* Verify / reject (admin, HR, finance, PM) */}
			{verifying && (
				<Dialog open onOpenChange={() => setVerifying(null)}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>{verifying.status === "verified" ? "Verify consumption" : "Reject consumption"}</DialogTitle>
							<DialogDescription>
								{verifying.record.itemName} · {formatQty(verifying.record.qtyConsumed)} {verifying.record.unit}
							</DialogDescription>
						</DialogHeader>
						<Textarea rows={3} placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
						<DialogFooter>
							<Button variant="outline" onClick={() => setVerifying(null)} disabled={saving}>
								Cancel
							</Button>
							<Button variant={verifying.status === "verified" ? "default" : "destructive"} onClick={submitVerify} disabled={saving || !note.trim()}>
								{verifying.status === "verified" ? "Verify" : "Reject"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* Delete */}
			{deleting && (
				<Dialog open onOpenChange={() => setDeleting(null)}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>Delete consumption record</DialogTitle>
							<DialogDescription>
								{deleting.itemName} · {formatQty(deleting.qtyConsumed)} {deleting.unit}. This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDeleting(null)}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={confirmDelete}>
								Delete
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
