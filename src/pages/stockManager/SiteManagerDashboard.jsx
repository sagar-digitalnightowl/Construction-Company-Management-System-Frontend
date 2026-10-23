// src/pages/stockManager/SiteManagerDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, Plus, Minus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteStockApi, projectApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";
import { workTypeLabel } from "@/data/stockConstants";
import { categoryLabel, formatMoney, formatQty, pickList } from "./stockHelpers";
import { rolePerms } from "./stockPermissions";

const CHART_COLORS = { arrived: "#0f766e", consumed: "#f59e0b" };

const countFor = (list, status) => list?.find((s) => s._id === status)?.count || 0;

export default function SiteManagerDashboard() {
	const navigate = useNavigate();
	const { current } = useAuthStore();
	const perms = rolePerms(current?.role);

	const [projects, setProjects] = useState([]);
	const [projectId, setProjectId] = useState("all");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		projectApi
			.getAll({ limit: 100 })
			.then((res) => setProjects(res.data?.data?.projects || []))
			.catch(() => setProjects([]));
	}, []);

	useEffect(() => {
		let cancelled = false;
		const load = async () => {
			setLoading(true);
			setError("");
			try {
				const params = projectId === "all" ? {} : { projectId };
				const res = await siteStockApi.getDashboard(params);
				if (!cancelled) setData(res.data?.data || null);
			} catch (err) {
				if (!cancelled) setError(err.response?.data?.message || "Could not load the dashboard");
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		load();
		return () => {
			cancelled = true;
		};
	}, [projectId]);

	const totals = data?.totals || {};
	const itemBalances = data?.itemBalances || [];
	const lowStockAlerts = data?.lowStockAlerts || [];
	const projectRows = data?.projects || [];
	const verification = data?.verificationStatus || {};

	const projectChart = useMemo(
		() =>
			projectRows.map((p) => ({
				name: p.projectName,
				arrived: Number(p.arrivedQty) || 0,
				consumed: Number(p.consumedQty) || 0,
			})),
		[projectRows]
	);

	// Arrivals and consumptions in one feed, newest first
	const activity = useMemo(() => {
		const arrivals = (data?.recentActivity?.arrivals || []).map((a) => ({
			key: `arr-${a._id}`,
			type: "arrival",
			date: a.createdAt,
			itemName: a.itemName,
			qty: a.qty,
			projectName: a.projectName,
			detail: a.reportedBy ? `Reported by ${a.reportedBy}` : "",
		}));
		const consumptions = (data?.recentActivity?.consumptions || []).map((c) => ({
			key: `con-${c._id}`,
			type: "consumption",
			date: c.consumedAt,
			itemName: c.itemName,
			qty: c.qty,
			projectName: c.projectName,
			detail: [
					c.towerName,
					c.floor ? `Floor ${c.floor}` : "",
					c.workType ? workTypeLabel(c.workType) : "",
					c.workDescription,
					c.consumedAmount != null ? formatMoney(c.consumedAmount) : "",
					c.consumedBy,
				]
					.filter(Boolean)
					.join(" · "),
		}));
		return [...arrivals, ...consumptions].sort((a, b) => new Date(b.date) - new Date(a.date));
	}, [data]);

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Dashboard"
				description="Stock arrived, used and remaining on your sites, with low-stock alerts."
				actions={
					<div className="flex flex-wrap gap-2">
						{perms.canAddStock && (
							<Button onClick={() => navigate("/site-manager/add-stock")}>
								<Plus className="h-4 w-4 mr-2" />
								Add Stock
							</Button>
						)}
						{perms.canAddConsumption && (
							<Button variant="outline" onClick={() => navigate("/site-manager/add-consumption/new")}>
								<Minus className="h-4 w-4 mr-2" />
								Add Consumption
							</Button>
						)}
					</div>
				}
			/>

			<div className="flex flex-wrap items-center gap-3">
				<span className="text-sm text-muted-foreground">Project</span>
				<Select value={projectId} onValueChange={setProjectId}>
					<SelectTrigger className="w-64 bg-background">
						<SelectValue placeholder="All projects" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All projects</SelectItem>
						{projects.map((p) => (
							<SelectItem key={p._id} value={p._id}>
								{p.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{error && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
			{loading && !data && <p className="text-sm text-muted-foreground">Loading dashboard...</p>}

			{data && (
				<>
					{/* KPI cards */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<StatCard label="Arrived Qty" value={formatQty(totals.totalArrivedQty)} icon={ArrowDownToLine} accent="primary" size="compact" />
						<StatCard label="Consumed Qty" value={formatQty(totals.totalConsumedQty)} icon={ArrowUpFromLine} accent="warning" size="compact" />
						<StatCard label="Remaining Qty" value={formatQty(totals.totalRemainingQty)} icon={Package} accent="success" size="compact" />
						<StatCard label="Low-Stock Alerts" value={totals.lowStockItemCount || 0} icon={AlertTriangle} accent="destructive" size="compact" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<Card>
							<CardContent className="pt-6">
								<div className="text-muted-foreground">Arrived value</div>
								<div className="text-xl font-semibold mt-1">{formatMoney(totals.totalArrivedAmount)}</div>
								<div className="text-xs text-muted-foreground mt-1">{totals.totalArrivedReports || 0} stock entries</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-muted-foreground">Consumption records</div>
								<div className="text-xl font-semibold mt-1">{totals.totalConsumedRecords || 0}</div>
								<div className="text-xs text-muted-foreground mt-1">
									Pending verification: {countFor(verification.consumptions, "pending")}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-muted-foreground">Stock entries pending verification</div>
								<div className="text-xl font-semibold mt-1">{countFor(verification.arrivals, "pending")}</div>
								<div className="text-xs text-muted-foreground mt-1">
									Reorder levels set: {data.reorderLevelsConfigured || 0}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Low-stock alerts */}
					{lowStockAlerts.length > 0 && (
						<Card className="border-destructive/50">
							<CardHeader>
								<CardTitle className="text-base text-destructive">Low-stock alerts</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{lowStockAlerts.map((a) => (
									<div key={`${a.itemName}-${a.unit}`} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3">
										<div>
											<div className="font-medium">{a.itemName}</div>
											<div className="text-xs text-muted-foreground">
												Remaining {formatQty(a.remainingQty)} {a.unit} · reorder at {formatQty(a.reorderLevel)} {a.unit}
											</div>
										</div>
										<Badge variant="destructive">Short by {formatQty(a.shortfall)} {a.unit}</Badge>
									</div>
								))}
							</CardContent>
						</Card>
					)}

					{/* Per-project chart */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Arrived vs consumed by project</CardTitle>
						</CardHeader>
						<CardContent>
							{projectChart.length === 0 ? (
								<p className="text-sm text-muted-foreground py-10 text-center">No stock entries yet.</p>
							) : (
								<ResponsiveContainer width="100%" height={280}>
									<BarChart data={projectChart} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
										<YAxis tick={{ fontSize: 11 }} />
										<Tooltip />
										<Legend />
										<Bar dataKey="arrived" name="Arrived" fill={CHART_COLORS.arrived} radius={[4, 4, 0, 0]} />
										<Bar dataKey="consumed" name="Consumed" fill={CHART_COLORS.consumed} radius={[4, 4, 0, 0]} />
									</BarChart>
								</ResponsiveContainer>
							)}
						</CardContent>
					</Card>

					{/* Per-item balances */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Item balances</CardTitle>
						</CardHeader>
						<CardContent>
							{itemBalances.length === 0 ? (
								<p className="text-sm text-muted-foreground py-6 text-center">No items yet.</p>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="text-left text-muted-foreground border-b">
												<th className="py-2 pr-4 font-medium">Item</th>
												<th className="py-2 pr-4 font-medium">Category</th>
												<th className="py-2 pr-4 font-medium">Unit</th>
												<th className="py-2 pr-4 font-medium text-right">Arrived</th>
												<th className="py-2 pr-4 font-medium text-right">Consumed</th>
												<th className="py-2 pr-4 font-medium text-right">Remaining</th>
												<th className="py-2 pr-4 font-medium text-right">Reorder at</th>
												<th className="py-2 pr-4 font-medium text-right">Target</th>
												<th className="py-2 pr-4 font-medium text-right">Shortfall</th>
												<th className="py-2 font-medium">Status</th>
											</tr>
										</thead>
										<tbody>
											{itemBalances.map((r) => (
												<tr key={`${r.itemName}-${r.unit}`} className={`border-b last:border-0 ${r.isLowStock ? "bg-destructive/5" : ""}`}>
													<td className="py-2 pr-4 font-medium">{r.itemName}</td>
													<td className="py-2 pr-4">{categoryLabel(r.itemCategory)}</td>
													<td className="py-2 pr-4">{r.unit}</td>
													<td className="py-2 pr-4 text-right">{formatQty(r.arrivedQty)}</td>
													<td className="py-2 pr-4 text-right">{formatQty(r.consumedQty)}</td>
													<td className="py-2 pr-4 text-right">{formatQty(r.remainingQty)}</td>
													<td className="py-2 pr-4 text-right">{r.reorderLevel != null ? formatQty(r.reorderLevel) : "—"}</td>
													<td className="py-2 pr-4 text-right">{r.targetQty != null ? formatQty(r.targetQty) : "—"}</td>
													<td className="py-2 pr-4 text-right">{formatQty(r.shortfall)}</td>
													<td className="py-2">
														{r.isLowStock ? <Badge variant="destructive">Low</Badge> : <Badge variant="success">OK</Badge>}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Recent activity */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Recent activity</CardTitle>
						</CardHeader>
						<CardContent>
							{activity.length === 0 ? (
								<p className="text-sm text-muted-foreground py-6 text-center">No activity yet.</p>
							) : (
								<div className="space-y-2">
									{activity.map((a) => (
										<div key={a.key} className="flex flex-wrap items-center justify-between gap-2 border rounded-md p-3">
											<div className="flex items-start gap-3">
												<Badge variant={a.type === "arrival" ? "success" : "warning"}>{a.type === "arrival" ? "Arrived" : "Used"}</Badge>
												<div>
													<div className="font-medium">{a.itemName}</div>
													<div className="text-xs text-muted-foreground">
														{a.projectName} · {formatDate(a.date)}
														{a.detail ? ` · ${a.detail}` : ""}
													</div>
												</div>
											</div>
											<span className="text-sm font-medium">{formatQty(a.qty)}</span>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
