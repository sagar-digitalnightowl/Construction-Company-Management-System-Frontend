import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Package } from "lucide-react";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { formatDate } from "@/lib/helpers";
import { unwrap, errMsg } from "./shared";
import { toast } from "sonner";

// Site stock for the site engineer (guide section 11): balances from the stock dashboard, own stock reports,
// and the report / consumption forms, which are the same forms the site manager uses.
export default function SeStock() {
	const [dashboard, setDashboard] = useState(null);
	const [mine, setMine] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		Promise.allSettled([siteEngineerApi.getStockDashboard(), siteEngineerApi.getMyStockReports({ limit: 20 })]).then(
			([dash, reports]) => {
				if (cancelled) return;
				if (dash.status === "fulfilled") setDashboard(unwrap(dash.value));
				else toast.error(errMsg(dash.reason, "Could not load stock balances"));
				if (reports.status === "fulfilled") setMine(unwrap(reports.value)?.items || []);
				setLoading(false);
			}
		);
		return () => {
			cancelled = true;
		};
	}, []);

	const totals = dashboard?.totals || {};
	const balances = dashboard?.itemBalances || [];

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Site stock"
				description="Stock delivered to your sites, what has been used, and what is left."
				actions={
					<>
						<Button asChild variant="outline">
							<Link to="/site-engineer/stock/add">
								<ArrowDownToLine className="h-4 w-4 mr-2" /> Report stock
							</Link>
						</Button>
						<Button asChild>
							<Link to="/site-engineer/stock/consume">
								<ArrowUpFromLine className="h-4 w-4 mr-2" /> Log consumption
							</Link>
						</Button>
					</>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				<StatCard label="Arrived (qty)" icon={ArrowDownToLine} size="compact" value={loading ? "..." : totals.totalArrivedQty ?? 0} />
				<StatCard label="Used (qty)" icon={ArrowUpFromLine} size="compact" value={loading ? "..." : totals.totalConsumedQty ?? 0} />
				<StatCard label="Remaining (qty)" icon={Package} size="compact" value={loading ? "..." : totals.totalRemainingQty ?? 0} />
				<StatCard
					label="Low stock items"
					icon={AlertTriangle}
					size="compact"
					value={loading ? "..." : totals.lowStockItemCount ?? 0}
					accent={totals.lowStockItemCount ? "destructive" : "neutral"}
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Balances by item</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					{!loading && balances.length === 0 && <div className="text-sm text-muted-foreground">No stock recorded yet</div>}
					{balances.length > 0 && (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Unit</TableHead>
										<TableHead className="text-right">Arrived</TableHead>
										<TableHead className="text-right">Used</TableHead>
										<TableHead className="text-right">Remaining</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{balances.map((b) => (
										<TableRow key={b.itemName}>
											<TableCell className="font-medium">{b.itemName}</TableCell>
											<TableCell>{b.unit}</TableCell>
											<TableCell className="text-right">{b.arrivedQty ?? 0}</TableCell>
											<TableCell className="text-right">{b.consumedQty ?? 0}</TableCell>
											<TableCell className="text-right">{b.remainingQty ?? 0}</TableCell>
											<TableCell>
												{b.isLowStock ? <Badge variant="destructive">Low</Badge> : <Badge variant="outline">OK</Badge>}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">My stock reports</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					{!loading && mine.length === 0 && <div className="text-sm text-muted-foreground">You have not reported any stock yet</div>}
					{mine.length > 0 && (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Item</TableHead>
										<TableHead className="text-right">Quantity</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mine.map((r) => (
										<TableRow key={r._id}>
											<TableCell>{formatDate(r.createdAt)}</TableCell>
											<TableCell>{r.projectName || r.projectId?.name || "—"}</TableCell>
											<TableCell>{r.itemName || "—"}</TableCell>
											<TableCell className="text-right">
												{r.qtyArrived ?? r.quantity ?? r.qty ?? "—"} {r.unit || ""}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
