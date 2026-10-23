// src/pages/stockManager/tabs/ReorderLevelsTab.jsx

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { siteStockApi, projectApi } from "@/api";
import { useReorderLevels } from "@/hooks/useReorderLevels";
import { useAuthStore } from "@/store/authStore";
import { STOCK_ITEM_CATEGORIES, STOCK_UNITS } from "@/data/stockConstants";
import { categoryLabel, formatQty, sanitizeNumeric } from "../stockHelpers";
import { rolePerms } from "../stockPermissions";

const EMPTY_FORM = {
	projectId: "",
	itemName: "",
	itemCategory: "",
	unit: "",
	reorderLevel: "",
	targetQty: "",
	notes: "",
};

export function ReorderLevelsTab() {
	const { current } = useAuthStore();
	const perms = rolePerms(current?.role);
	const { levels, loading, fetchReorderLevels, saveReorderLevel, deleteReorderLevel } = useReorderLevels();

	const [projects, setProjects] = useState([]);
	const [balances, setBalances] = useState([]);
	const [dialog, setDialog] = useState(null); // null | { id?: string }
	const [form, setForm] = useState(EMPTY_FORM);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(null);

	useEffect(() => {
		fetchReorderLevels();
		projectApi
			.getAll({ limit: 100 })
			.then((res) => setProjects(res.data?.data?.projects || []))
			.catch(() => setProjects([]));
	}, []);

	// Items already in stock for the chosen project, so the admin picks real item names
	useEffect(() => {
		if (!form.projectId) {
			setBalances([]);
			return;
		}
		siteStockApi
			.getDashboard({ projectId: form.projectId })
			.then((res) => setBalances(res.data?.data?.itemBalances || []))
			.catch(() => setBalances([]));
	}, [form.projectId]);

	const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

	const openNew = () => {
		setForm(EMPTY_FORM);
		setDialog({});
	};

	const openEdit = (level) => {
		setForm({
			projectId: level.projectId?._id || level.projectId || "",
			itemName: level.itemName || "",
			itemCategory: level.itemCategory || "",
			unit: level.unit || "",
			reorderLevel: level.reorderLevel != null ? String(level.reorderLevel) : "",
			targetQty: level.targetQty != null ? String(level.targetQty) : "",
			notes: level.notes || "",
		});
		setDialog({ id: level._id });
	};

	const pickItem = (name) => {
		const match = balances.find((b) => b.itemName === name);
		setForm((prev) => ({
			...prev,
			itemName: name,
			itemCategory: match?.itemCategory || prev.itemCategory,
			unit: match?.unit || prev.unit,
		}));
	};

	const save = async () => {
		const reorder = parseFloat(form.reorderLevel);
		const target = parseFloat(form.targetQty);
		if (!form.projectId || !form.itemName.trim() || !form.itemCategory || !form.unit) return;
		if (Number.isNaN(reorder) || reorder < 0) return;
		if (Number.isNaN(target) || target < reorder) return;

		setSaving(true);
		const ok = await saveReorderLevel(dialog?.id, {
			projectId: form.projectId,
			itemName: form.itemName.trim(),
			itemCategory: form.itemCategory,
			unit: form.unit,
			reorderLevel: reorder,
			targetQty: target,
			notes: form.notes,
		});
		setSaving(false);
		if (ok) {
			setDialog(null);
			fetchReorderLevels();
		}
	};

	const confirmDelete = async () => {
		const ok = await deleteReorderLevel(deleting?._id);
		setDeleting(null);
		if (ok) fetchReorderLevels();
	};

	const canSubmit =
		form.projectId && form.itemName.trim() && form.itemCategory && form.unit && form.reorderLevel !== "" && form.targetQty !== "";

	return (
		<div className="space-y-4">
			{perms.canSetReorder && (
				<div className="flex justify-end">
					<Button onClick={openNew}>
						<Plus className="h-4 w-4 mr-2" />
						Set Reorder Level
					</Button>
				</div>
			)}

			{loading && levels.length === 0 ? (
				<Card className="p-6 text-center text-muted-foreground">Loading reorder levels...</Card>
			) : levels.length === 0 ? (
				<Card className="p-6 text-center text-muted-foreground">No reorder levels set yet.</Card>
			) : (
				<Card>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Project</TableHead>
								<TableHead>Item</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Unit</TableHead>
								<TableHead>Reorder at</TableHead>
								<TableHead>Target</TableHead>
								<TableHead>Notes</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{levels.map((l) => (
								<TableRow key={l._id}>
									<TableCell className="font-medium">{l.projectName || "—"}</TableCell>
									<TableCell>{l.itemName}</TableCell>
									<TableCell>{categoryLabel(l.itemCategory)}</TableCell>
									<TableCell>{l.unit}</TableCell>
									<TableCell>{formatQty(l.reorderLevel)}</TableCell>
									<TableCell>{formatQty(l.targetQty)}</TableCell>
									<TableCell className="text-sm text-muted-foreground">{l.notes || "—"}</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											{perms.canSetReorder && (
												<Button size="sm" variant="ghost" onClick={() => openEdit(l)} title="Edit">
													<Pencil className="h-4 w-4" />
												</Button>
											)}
											{perms.canDeleteReorder && (
												<Button size="sm" variant="ghost" onClick={() => setDeleting(l)} title="Delete">
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			)}

			{dialog && (
				<Dialog open onOpenChange={() => setDialog(null)}>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>{dialog.id ? "Edit Reorder Level" : "Set Reorder Level"}</DialogTitle>
							<DialogDescription>Stock below the reorder level shows as low stock on the dashboard.</DialogDescription>
						</DialogHeader>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2 md:col-span-2">
								<Label>Project *</Label>
								<Select value={form.projectId} onValueChange={(v) => setField("projectId", v)} disabled={Boolean(dialog.id)}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select project" />
									</SelectTrigger>
									<SelectContent>
										{projects.map((p) => (
											<SelectItem key={p._id} value={p._id}>
												{p.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="rl-item">Item *</Label>
								<Input
									id="rl-item"
									value={form.itemName}
									list="rl-balances"
									placeholder={form.projectId ? "Type or pick an item in stock" : "Select a project first"}
									onChange={(e) => pickItem(e.target.value)}
								/>
								<datalist id="rl-balances">
									{balances.map((b) => (
										<option key={`${b.itemName}-${b.unit}`} value={b.itemName} />
									))}
								</datalist>
							</div>

							<div className="space-y-2">
								<Label>Category *</Label>
								<Select value={form.itemCategory} onValueChange={(v) => setField("itemCategory", v)}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{STOCK_ITEM_CATEGORIES.map((c) => (
											<SelectItem key={c.value} value={c.value}>
												{c.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Unit *</Label>
								<Select value={form.unit} onValueChange={(v) => setField("unit", v)}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select unit" />
									</SelectTrigger>
									<SelectContent>
										{STOCK_UNITS.map((u) => (
											<SelectItem key={u.value} value={u.value}>
												{u.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="rl-reorder">Reorder level *</Label>
								<Input id="rl-reorder" inputMode="decimal" value={form.reorderLevel} onChange={(e) => setField("reorderLevel", sanitizeNumeric(e.target.value))} />
								<p className="text-xs text-muted-foreground">Remaining at or below this quantity is low stock.</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="rl-target">Target quantity *</Label>
								<Input id="rl-target" inputMode="decimal" value={form.targetQty} onChange={(e) => setField("targetQty", sanitizeNumeric(e.target.value))} />
								<p className="text-xs text-muted-foreground">Stock level to keep on site. Must be at least the reorder level.</p>
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="rl-notes">Notes</Label>
								<Textarea id="rl-notes" rows={2} value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
							</div>
						</div>
						{form.reorderLevel !== "" && form.targetQty !== "" && parseFloat(form.targetQty) < parseFloat(form.reorderLevel) && (
							<p className="text-sm text-destructive">Target quantity must be at least the reorder level.</p>
						)}
						<DialogFooter>
							<Button variant="outline" onClick={() => setDialog(null)} disabled={saving}>
								Cancel
							</Button>
							<Button onClick={save} disabled={saving || !canSubmit}>
								{saving ? "Saving..." : "Save"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{deleting && (
				<Dialog open onOpenChange={() => setDeleting(null)}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>Delete reorder level</DialogTitle>
							<DialogDescription>{deleting.itemName} will no longer show low-stock alerts. This action cannot be undone.</DialogDescription>
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
