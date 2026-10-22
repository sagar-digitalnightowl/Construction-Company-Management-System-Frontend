// src/components/project/StockSummaryTab.jsx

import React, { useState, useEffect } from "react";
import { Package, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteStock } from "@/hooks/useSiteStock";
import { formatDate } from "@/lib/helpers";

export function StockSummaryTab({ projectId }) {
	const { projectSummary, loading, fetchProjectSummary } = useSiteStock();
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (projectId) {
			fetchProjectSummary(projectId);
		}
	}, [projectId]);

	const handleRefresh = () => {
		fetchProjectSummary(projectId);
	};

	const handleExportCSV = () => {
		if (!projectSummary?.items?.length) return;

		// Prepare CSV data
		const headers = ["Item Name", "Category", "Unit", "Total Qty", "Total Amount", "Estimated Value", "# Reports", "Last Arrival"];
		const rows = projectSummary.items.map(item => [
			item.itemName,
			item.itemCategory,
			item.unit,
			item.totalQty,
			item.totalAmount,
			item.totalEstimated,
			item.reportCount,
			formatDate(item.lastArrivalDate),
		]);

		// Create CSV content
		const csvContent = [
			headers.join(","),
			...rows.map(row => row.join(","))
		].join("\n");

		// Download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `stock-summary-${projectId}-${Date.now()}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Filter items based on search
	const filteredItems = projectSummary?.items?.filter(item =>
		item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
		item.itemCategory.toLowerCase().includes(searchTerm.toLowerCase())
	) || [];

	if (loading) {
		return (
			<Card className="p-6">
				<div className="text-center text-muted-foreground">Loading stock summary...</div>
			</Card>
		);
	}

	if (!projectSummary?.items?.length) {
		return (
			<Card className="p-6">
				<div className="text-center text-muted-foreground">
					<Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
					<p>No stock reports found for this project.</p>
				</div>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Stock Summary</CardTitle>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={handleRefresh}>
								<RefreshCw className="h-4 w-4 mr-2" />
								Refresh
							</Button>
							<Button variant="outline" size="sm" onClick={handleExportCSV}>
								<Download className="h-4 w-4 mr-2" />
								Export CSV
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className="mb-4">
						<Input
							placeholder="Search by item name or category..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-sm"
						/>
					</div>

					{/* Summary Table */}
					<div className="border rounded-lg overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Item Name</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Unit</TableHead>
									<TableHead>Total Qty</TableHead>
									<TableHead>Total Amount</TableHead>
									<TableHead>Estimated</TableHead>
									<TableHead># Reports</TableHead>
									<TableHead>Last Arrival</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredItems.map((item, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium">{item.itemName}</TableCell>
										<TableCell className="capitalize">{item.itemCategory}</TableCell>
										<TableCell>{item.unit}</TableCell>
										<TableCell className="font-medium">{item.totalQty?.toLocaleString()}</TableCell>
										<TableCell>₹{item.totalAmount?.toLocaleString()}</TableCell>
										<TableCell>₹{item.totalEstimated?.toLocaleString()}</TableCell>
										<TableCell>
											<span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
												{item.reportCount}
											</span>
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{formatDate(item.lastArrivalDate)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Summary Stats */}
					<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="p-4 bg-muted rounded-lg">
							<div className="text-sm text-muted-foreground">Total Items</div>
							<div className="text-2xl font-bold">{projectSummary.items.length}</div>
						</div>
						<div className="p-4 bg-muted rounded-lg">
							<div className="text-sm text-muted-foreground">Total Reports</div>
							<div className="text-2xl font-bold">
								{projectSummary.items.reduce((sum, item) => sum + item.reportCount, 0)}
							</div>
						</div>
						<div className="p-4 bg-muted rounded-lg">
							<div className="text-sm text-muted-foreground">Total Amount</div>
							<div className="text-2xl font-bold">
								₹{projectSummary.items.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
							</div>
						</div>
						<div className="p-4 bg-muted rounded-lg">
							<div className="text-sm text-muted-foreground">Total Estimated</div>
							<div className="text-2xl font-bold">
								₹{projectSummary.items.reduce((sum, item) => sum + item.totalEstimated, 0).toLocaleString()}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
