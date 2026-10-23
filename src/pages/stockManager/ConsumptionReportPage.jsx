// src/pages/stockManager/ConsumptionReportPage.jsx

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteStockApi, projectApi } from "@/api";
import { useProjectTowers } from "@/hooks/useProjectTowers";
import { CONSUMPTION_WORK_TYPES, displayFloor, displayTower, workTypeLabel } from "@/data/stockConstants";
import { formatMoney, formatQty } from "./stockHelpers";

const ALL = "all";

const floorLabel = displayFloor;

// Each API view becomes a tree; a node's children appear when the node is expanded.
// The columns for each level are listed in LEVEL_HEADERS below.
const buildTreeByTower = (data) =>
	(data.byTower || []).map((t) => ({
		key: t.towerName,
		label: displayTower(t.towerName),
		qty: t.totalQty,
		amount: t.totalAmount,
		records: t.recordCount,
		children: (t.byFloor || []).map((f) => ({
			key: String(f.floor ?? ""),
			label: floorLabel(f.floor),
			qty: f.totalQty,
			amount: f.totalAmount,
			records: f.recordCount,
			children: (f.byWorkType || []).map((w) => ({
				key: w.workType,
				label: workTypeLabel(w.workType),
				qty: w.totalQty,
				amount: w.totalAmount,
				records: w.recordCount,
			})),
		})),
	}));

const buildTreeByWorkType = (data) =>
	(data.byWorkType || []).map((w) => ({
		key: w.workType,
		label: workTypeLabel(w.workType),
		qty: w.totalQty,
		amount: w.totalAmount,
		records: w.recordCount,
		children: (w.byItem || []).map((i) => ({
			key: `${i.itemName}|${i.unit}`,
			label: `${i.itemName} (${i.unit})`,
			qty: i.totalQty,
			amount: i.totalAmount,
			records: i.recordCount,
		})),
	}));

const buildTreeByItem = (data) =>
	(data.byItem || []).map((i) => ({
		key: `${i.itemName}|${i.unit}`,
		label: `${i.itemName} (${i.unit})`,
		qty: i.totalQty,
		amount: i.totalAmount,
		records: i.recordCount,
		children: (i.byTower || []).map((t) => ({
			key: t.towerName,
			label: displayTower(t.towerName),
			qty: t.totalQty,
			amount: t.totalAmount,
			records: t.recordCount,
		})),
	}));

const LEVEL_HEADERS = {
	byTower: ["Tower", "Floor", "Work type"],
	byWorkType: ["Work type", "Item"],
	byItem: ["Item", "Tower"],
};

// Flattens a tree into rows. A node's label sits in the column for its level, so Tower, Floor and
// Work type each have their own column.
function treeRows(nodes, levels, expanded, toggle, depth = 0, parentKey = "") {
	return nodes.flatMap((node) => {
		const key = `${parentKey}/${node.key}`;
		const hasChildren = node.children?.length > 0;
		const open = expanded.has(key);
		const levelCells = levels.map((_, i) =>
			i === depth ? (
				<td key={i} className="py-2 pr-4" style={{ paddingLeft: `${depth * 16}px` }}>
					<div className="flex items-center gap-1">
						{hasChildren ? (
							<button type="button" onClick={() => toggle(key)} className="text-muted-foreground hover:text-foreground" aria-label={open ? "Collapse" : "Expand"}>
								{open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
							</button>
						) : (
							<span className="inline-block w-4" />
						)}
						<span className={depth === 0 ? "font-medium" : ""}>{node.label}</span>
					</div>
				</td>
			) : (
				<td key={i} className="py-2 pr-4" />
			)
		);
		const row = (
			<tr key={key} className="border-b last:border-0">
				{levelCells}
				<td className="py-2 pr-4 text-right">{formatQty(node.qty)}</td>
				<td className="py-2 pr-4 text-right">{formatMoney(node.amount)}</td>
				<td className="py-2 text-right">{node.records || 0}</td>
			</tr>
		);
		const childRows = open && hasChildren ? treeRows(node.children, levels, expanded, toggle, depth + 1, key) : [];
		return [row, ...childRows];
	});
}

function ReportTable({ headers, nodes, grandTotals, expanded, toggle, emptyText }) {
	if (nodes.length === 0) {
		return <p className="text-sm text-muted-foreground py-10 text-center">{emptyText}</p>;
	}
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="text-left text-muted-foreground border-b">
						{headers.map((h) => (
							<th key={h} className="py-2 pr-4 font-medium">
								{h}
							</th>
						))}
						<th className="py-2 pr-4 font-medium text-right">Total Qty</th>
						<th className="py-2 pr-4 font-medium text-right">Total Amount</th>
						<th className="py-2 font-medium text-right">Records</th>
					</tr>
				</thead>
				<tbody>
					{treeRows(nodes, headers, expanded, toggle)}
					<tr className="border-t-2 font-semibold bg-muted/40">
						<td className="py-2 pr-4" colSpan={headers.length}>
							Grand total
						</td>
						<td className="py-2 pr-4 text-right">{formatQty(grandTotals.totalQty)}</td>
						<td className="py-2 pr-4 text-right">{formatMoney(grandTotals.totalAmount)}</td>
						<td className="py-2 text-right">{grandTotals.totalRecords || 0}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default function ConsumptionReportPage() {
	const [projects, setProjects] = useState([]);
	const [projectId, setProjectId] = useState("");
	const [towerName, setTowerName] = useState(ALL);
	const [floor, setFloor] = useState("");
	const [workType, setWorkType] = useState(ALL);
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [itemSearch, setItemSearch] = useState("");

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [expanded, setExpanded] = useState(() => new Set());

	const { towers, error: towersError } = useProjectTowers(projectId || null);

	useEffect(() => {
		projectApi
			.getAll({ limit: 100 })
			.then((res) => setProjects(res.data?.data?.projects || []))
			.catch(() => setProjects([]));
	}, []);

	// Open on the first project so the report shows numbers straight away
	useEffect(() => {
		if (!projectId && projects.length > 0) setProjectId(projects[0]._id);
	}, [projects, projectId]);

	useEffect(() => {
		if (!projectId) {
			setData(null);
			return;
		}
		let cancelled = false;
		const params = { projectId };
		if (towerName !== ALL) params.towerName = towerName;
		if (floor.trim()) params.floor = floor.trim();
		if (workType !== ALL) params.workType = workType;
		if (dateFrom) params.dateFrom = dateFrom;
		if (dateTo) params.dateTo = dateTo;

		setLoading(true);
		setError("");
		siteStockApi
			.getConsumptionReport(params)
			.then((res) => {
				if (!cancelled) setData(res.data?.data || null);
			})
			.catch((err) => {
				if (!cancelled) {
					setData(null);
					setError(err.response?.data?.message || "Could not load the consumption report");
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [projectId, towerName, floor, workType, dateFrom, dateTo]);

	const toggle = (key) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	};

	const grandTotals = data?.grandTotals || { totalQty: 0, totalAmount: 0, totalRecords: 0, totalTowers: 0, totalItems: 0 };
	const hasProject = Boolean(projectId);
	const emptyText = loading ? "Loading report..." : "No consumption records match these filters.";
	const itemNodes = buildTreeByItem(data || {}).filter((n) => n.label.toLowerCase().includes(itemSearch.trim().toLowerCase()));

	const clearFilters = () => {
		setTowerName(ALL);
		setFloor("");
		setWorkType(ALL);
		setDateFrom("");
		setDateTo("");
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader title="Consumption Report" description="Material used by tower, floor and work type, with item-wise and work-type-wise totals." />

			<Card>
				<CardContent className="pt-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label>Project / Site *</Label>
							<Select
								value={projectId}
								onValueChange={(v) => {
									setProjectId(v);
									setTowerName(ALL);
								}}
							>
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
							<Label>Tower</Label>
							<Select value={towerName} onValueChange={setTowerName} disabled={!hasProject}>
								<SelectTrigger className="bg-background">
									<SelectValue placeholder="All towers" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={ALL}>All towers</SelectItem>
									{towers.map((t) => (
										<SelectItem key={t.towerName} value={t.towerName}>
											{t.towerName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="report-floor">Floor</Label>
							<div className="relative">
								<Input id="report-floor" value={floor} placeholder="e.g. 3, Ground" onChange={(e) => setFloor(e.target.value)} className="pr-9" />
								{floor && (
									<button type="button" onClick={() => setFloor("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" title="Clear floor">
										<X className="h-4 w-4" />
									</button>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<Label>Work type</Label>
							<Select value={workType} onValueChange={setWorkType}>
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
						</div>

						<div className="space-y-2">
							<Label htmlFor="report-from">Date from</Label>
							<Input id="report-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="report-to">Date to</Label>
							<Input id="report-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
						</div>

						<div className="flex items-end">
							<button type="button" onClick={clearFilters} className="text-sm text-primary hover:underline">
								Clear tower, floor, work type and dates
							</button>
						</div>
					</div>
				</CardContent>
			</Card>

			{towersError && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">Could not load the towers for this project. Tower filter is unavailable.</div>}
			{error && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

			{!hasProject ? (
				<p className="text-sm text-muted-foreground py-10 text-center">Select a project to see its consumption report.</p>
			) : (
				<>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						<Card>
							<CardContent className="pt-6">
								<div className="text-muted-foreground">Total amount</div>
								<div className="text-xl font-semibold mt-1">{formatMoney(grandTotals.totalAmount)}</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-muted-foreground">Total qty</div>
								<div className="text-xl font-semibold mt-1">{formatQty(grandTotals.totalQty)}</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-muted-foreground">Towers</div>
								<div className="text-xl font-semibold mt-1">{grandTotals.totalTowers || 0}</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-muted-foreground">Records · items</div>
								<div className="text-xl font-semibold mt-1">
									{grandTotals.totalRecords || 0} · {grandTotals.totalItems || 0}
								</div>
							</CardContent>
						</Card>
					</div>

					<Tabs defaultValue="byTower">
						<TabsList>
							<TabsTrigger value="byTower">By Tower</TabsTrigger>
							<TabsTrigger value="byWorkType">By Work Type</TabsTrigger>
							<TabsTrigger value="byItem">By Item</TabsTrigger>
						</TabsList>

						<TabsContent value="byTower">
							<Card>
								<CardContent className="pt-6">
									<ReportTable
										headers={LEVEL_HEADERS.byTower}
										nodes={buildTreeByTower(data || {})}
										grandTotals={grandTotals}
										expanded={expanded}
										toggle={toggle}
										emptyText={emptyText}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="byWorkType">
							<Card>
								<CardContent className="pt-6">
									<ReportTable
										headers={LEVEL_HEADERS.byWorkType}
										nodes={buildTreeByWorkType(data || {})}
										grandTotals={grandTotals}
										expanded={expanded}
										toggle={toggle}
										emptyText={emptyText}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="byItem">
							<Card>
								<CardContent className="pt-6 space-y-4">
									<Input placeholder="Search item name" value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} className="max-w-sm bg-background" />
									<ReportTable
										headers={LEVEL_HEADERS.byItem}
										nodes={itemNodes}
										grandTotals={grandTotals}
										expanded={expanded}
										toggle={toggle}
										emptyText={emptyText}
									/>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</>
			)}
		</div>
	);
}
