// src/pages/stockManager/AddConsumptionFormPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteStockApi, projectApi, authApi } from "@/api";
import { useConsumption } from "@/hooks/useConsumption";
import { useProjectTowers } from "@/hooks/useProjectTowers";
import { CONSUMPTION_WORK_TYPES } from "@/data/stockConstants";
import { categoryLabel, formatQty, sanitizeNumeric, todayKey } from "./stockHelpers";

const EMPTY_FORM = {
	projectId: "",
	balanceKey: "",
	qtyConsumed: "",
	towerName: "",
	floor: "",
	workType: "",
	workDescription: "",
	consumedAt: todayKey(),
	notes: "",
};

export default function AddConsumptionFormPage() {
	const navigate = useNavigate();
	const { createConsumption } = useConsumption();
	const [projects, setProjects] = useState([]);
	const [balances, setBalances] = useState([]);
	const [balancesLoading, setBalancesLoading] = useState(false);
	const [form, setForm] = useState(EMPTY_FORM);
	const [photos, setPhotos] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const { towers, loading: towersLoading, error: towersError } = useProjectTowers(form.projectId);

	useEffect(() => {
		projectApi
			.getAll({ limit: 100 })
			.then((res) => setProjects(res.data?.data?.projects || []))
			.catch(() => setProjects([]));
	}, []);

	// Items with stock on the chosen project, from the dashboard balances
	useEffect(() => {
		if (!form.projectId) {
			setBalances([]);
			return;
		}
		setBalancesLoading(true);
		siteStockApi
			.getDashboard({ projectId: form.projectId })
			.then((res) => setBalances(res.data?.data?.itemBalances || []))
			.catch(() => setBalances([]))
			.finally(() => setBalancesLoading(false));
	}, [form.projectId]);

	const selected = balances.find((b) => `${b.itemName}|${b.unit}` === form.balanceKey);
	const remaining = selected ? Number(selected.remainingQty) || 0 : 0;
	const selectedTower = towers.find((t) => t.towerName === form.towerName);
	const floorOptions = (selectedTower?.floors || []).map((f) => String(f.floorNumber));

	const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

	const handleProjectChange = (projectId) => {
		setForm((prev) => ({ ...prev, projectId, balanceKey: "", qtyConsumed: "", towerName: "", floor: "" }));
	};

	const handleTowerChange = (towerName) => {
		setForm((prev) => ({ ...prev, towerName, floor: "" }));
	};

	const handlePhotoUpload = async (e) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;
		setUploading(true);
		try {
			for (const file of files) {
				const presigned = await authApi.getPresignedUrl({ fileName: file.name, fileType: "stock", mimeType: file.type });
				const { url, key, publicUrl } = presigned.data;
				await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
				setPhotos((prev) => [...prev, { key, publicUrl, name: file.name }]);
			}
			toast.success("Photos uploaded");
		} catch (error) {
			toast.error("Failed to upload photos");
		} finally {
			setUploading(false);
		}
	};

	const submit = async (e) => {
		e.preventDefault();
		if (!form.projectId) return toast.error("Please select a project");
		if (!form.towerName) return toast.error("Please select a tower");
		if (!selected) return toast.error("Please select an item");
		const qty = parseFloat(form.qtyConsumed);
		if (!qty || qty <= 0) return toast.error("Please enter the quantity used");
		if (qty > remaining) return toast.error(`Only ${formatQty(remaining)} ${selected.unit} is left in stock`);
		if (!form.workType) return toast.error("Please select the work type");
		if (!form.consumedAt) return toast.error("Please select the date used");

		setSaving(true);
		try {
			await createConsumption({
				projectId: form.projectId,
				itemName: selected.itemName,
				itemCategory: selected.itemCategory,
				unit: selected.unit,
				qtyConsumed: qty,
				towerName: form.towerName,
				floor: form.floor.trim(),
				workType: form.workType,
				workDescription: form.workDescription.trim(),
				consumedAt: form.consumedAt,
				photoKeys: photos.map((p) => p.key),
				notes: form.notes,
			});
			navigate("/site-manager/add-consumption");
		} catch (error) {
			// Toast shown by the hook
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Add Consumption"
				description="Record material used on site, by tower, floor and work type. Remaining stock updates from these records."
				actions={
					<Button variant="outline" onClick={() => navigate("/site-manager/add-consumption")}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>
				}
			/>

			<Card>
				<CardContent className="pt-6">
					<form onSubmit={submit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Project / Site *</Label>
								<Select value={form.projectId} onValueChange={handleProjectChange}>
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

							<div className="space-y-2">
								<Label>Item *</Label>
								<Select value={form.balanceKey} onValueChange={(v) => setField("balanceKey", v)} disabled={!form.projectId || balancesLoading}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder={!form.projectId ? "Select a project first" : balancesLoading ? "Loading items..." : "Select item"} />
									</SelectTrigger>
									<SelectContent>
										{balances.map((b) => (
											<SelectItem key={`${b.itemName}|${b.unit}`} value={`${b.itemName}|${b.unit}`}>
												{b.itemName} ({formatQty(b.remainingQty)} {b.unit} left)
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{form.projectId && !balancesLoading && balances.length === 0 && (
									<p className="text-xs text-muted-foreground">No stock has been recorded for this project yet.</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="cons-qty">Quantity used *</Label>
								<Input
									id="cons-qty"
									inputMode="decimal"
									value={form.qtyConsumed}
									placeholder={selected ? `Up to ${formatQty(remaining)} ${selected.unit}` : "Select an item first"}
									disabled={!selected}
									onChange={(e) => setField("qtyConsumed", sanitizeNumeric(e.target.value))}
								/>
								{selected && (
									<p className="text-xs text-muted-foreground">
										{categoryLabel(selected.itemCategory)} · {formatQty(remaining)} {selected.unit} remaining
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label>Tower *</Label>
								<Select value={form.towerName} onValueChange={handleTowerChange} disabled={!form.projectId || towersLoading}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder={!form.projectId ? "Select a project first" : towersLoading ? "Loading towers..." : "Select tower"} />
									</SelectTrigger>
									<SelectContent>
										{towers.map((t) => (
											<SelectItem key={t.towerName} value={t.towerName}>
												{t.towerName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{form.projectId && towersError && <p className="text-xs text-destructive">Could not load towers for this project. Try again later.</p>}
								{form.projectId && !towersLoading && !towersError && towers.length === 0 && (
									<p className="text-xs text-muted-foreground">This project has no towers yet.</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="cons-floor">Floor</Label>
								<Input
									id="cons-floor"
									list="cons-floor-options"
									value={form.floor}
									placeholder={form.towerName ? "Pick a floor or type one (e.g. Ground, Basement)" : "Select a tower first"}
									disabled={!form.towerName}
									onChange={(e) => setField("floor", e.target.value)}
								/>
								<datalist id="cons-floor-options">
									{floorOptions.map((f) => (
										<option key={f} value={f} />
									))}
								</datalist>
							</div>

							<div className="space-y-2">
								<Label>Work type *</Label>
								<Select value={form.workType} onValueChange={(v) => setField("workType", v)}>
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
								<Label htmlFor="cons-date">Date used *</Label>
								<Input id="cons-date" type="date" value={form.consumedAt} onChange={(e) => setField("consumedAt", e.target.value)} />
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="cons-description">Work description</Label>
								<Input
									id="cons-description"
									value={form.workDescription}
									placeholder="e.g. Column C3 concrete casting"
									onChange={(e) => setField("workDescription", e.target.value)}
								/>
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="cons-notes">Notes</Label>
								<Textarea id="cons-notes" rows={2} value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
							</div>
						</div>

						<div className="space-y-2">
							<Label>Proof photos (optional)</Label>
							<div className="border-2 border-dashed rounded-lg p-4">
								<input type="file" id="consumptionPhotos" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
								<label htmlFor="consumptionPhotos" className="cursor-pointer">
									<div className="flex flex-col items-center gap-2 text-center">
										<Upload className="h-8 w-8 text-muted-foreground" />
										<div className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Click to upload photos"}</div>
									</div>
								</label>
								{photos.length > 0 && (
									<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
										{photos.map((photo) => (
											<div key={photo.key} className="relative group">
												<img src={photo.publicUrl} alt={photo.name} className="w-full h-24 object-cover rounded" />
												<button
													type="button"
													onClick={() => setPhotos((prev) => prev.filter((p) => p.key !== photo.key))}
													className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
												>
													<X className="h-4 w-4" />
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => navigate("/site-manager/add-consumption")} disabled={saving}>
								Cancel
							</Button>
							<Button type="submit" disabled={saving || uploading}>
								{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
								Record Consumption
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
