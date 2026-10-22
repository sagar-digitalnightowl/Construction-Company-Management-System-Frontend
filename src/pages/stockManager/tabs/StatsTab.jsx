// src/pages/stockManager/tabs/StatsTab.jsx

import React from "react";
import { Package, TrendingUp, FileText, CheckCircle, Clock, XCircle, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/common/PageHeader";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

export function StatsTab({ stats, loading }) {
	if (loading || !stats) {
		return (
			<Card className="p-6">
				<div className="text-center text-muted-foreground">Loading statistics...</div>
			</Card>
		);
	}

	const { totals, byCategory, byProject, topVehicles, byVerificationStatus } = stats;

	// Colors for charts
	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"];

	// Prepare data for category pie chart
	const categoryChartData = byCategory?.slice(0, 8).map((cat, index) => ({
		name: cat._id?.charAt(0).toUpperCase() + cat._id?.slice(1),
		value: cat.totalAmount,
		count: cat.count,
		color: COLORS[index % COLORS.length],
	})) || [];

	// Prepare data for project bar chart
	const projectChartData = byProject?.slice(0, 10).map((proj) => ({
		name: proj._id?.projectName?.substring(0, 20) || "Unknown",
		amount: proj.totalAmount,
		estimated: proj.totalEstimated,
		count: proj.count,
	})) || [];

	return (
		<div className="space-y-6">
			{/* Overview Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard
					label="Total Reports"
					value={totals?.totalReports || 0}
					icon={FileText}
					size="compact"
				/>
				<StatCard
					label="Total Quantity"
					value={(totals?.totalQty || 0).toLocaleString()}
					icon={Package}
					accent="primary"
					size="compact"
				/>
				<StatCard
					label="Total Amount"
					value={`₹${(totals?.totalAmount || 0).toLocaleString()}`}
					icon={TrendingUp}
					accent="success"
					size="compact"
				/>
				<StatCard
					label="Estimated Value"
					value={`₹${(totals?.totalEstimated || 0).toLocaleString()}`}
					icon={TrendingUp}
					accent="warning"
					size="compact"
				/>
			</div>

			{/* Verification Status */}
			<Card>
				<CardHeader>
					<CardTitle>Verification Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4">
						{byVerificationStatus?.map((status) => (
							<div key={status._id} className="text-center p-4 border rounded-lg">
								<div className="flex items-center justify-center gap-2 mb-2">
									{status._id === "pending" && <Clock className="h-5 w-5 text-warning" />}
									{status._id === "verified" && <CheckCircle className="h-5 w-5 text-success" />}
									{status._id === "rejected" && <XCircle className="h-5 w-5 text-destructive" />}
									<span className="text-sm font-medium capitalize">{status._id}</span>
								</div>
								<div className="text-2xl font-bold">{status.count}</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* By Category - Chart & Table */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Pie Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Reports by Category - Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={categoryChartData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{categoryChartData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									formatter={(value) => `₹${value.toLocaleString()}`}
									contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
								/>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Table */}
				<Card>
					<CardHeader>
						<CardTitle>Reports by Category - Details</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Category</TableHead>
									<TableHead>Count</TableHead>
									<TableHead>Total Qty</TableHead>
									<TableHead>Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{byCategory?.map((cat) => (
									<TableRow key={cat._id}>
										<TableCell className="capitalize font-medium">{cat._id}</TableCell>
										<TableCell>{cat.count}</TableCell>
										<TableCell>{cat.totalQty?.toLocaleString()}</TableCell>
										<TableCell>₹{cat.totalAmount?.toLocaleString()}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			{/* By Project - Bar Chart & Table */}
			<Card>
				<CardHeader>
					<CardTitle>Reports by Project</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Bar Chart */}
					<div>
						<h4 className="text-sm font-medium mb-4">Amount Comparison</h4>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={projectChartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
								<XAxis
									dataKey="name"
									tick={{ fontSize: 12 }}
									stroke="hsl(var(--muted-foreground))"
								/>
								<YAxis
									tick={{ fontSize: 12 }}
									stroke="hsl(var(--muted-foreground))"
									tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
								/>
								<Tooltip
									formatter={(value) => `₹${value.toLocaleString()}`}
									contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
								/>
								<Legend />
								<Bar dataKey="amount" fill="#0088FE" name="Total Amount" />
								<Bar dataKey="estimated" fill="#00C49F" name="Estimated" />
							</BarChart>
						</ResponsiveContainer>
					</div>

					{/* Table */}
					<div>
						<h4 className="text-sm font-medium mb-4">Detailed Breakdown</h4>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Project</TableHead>
									<TableHead>Count</TableHead>
									<TableHead>Total Amount</TableHead>
									<TableHead>Estimated Value</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{byProject?.map((proj) => (
									<TableRow key={proj._id?.projectId}>
										<TableCell className="font-medium">
											{proj._id?.projectName || "Unknown"}
										</TableCell>
										<TableCell>{proj.count}</TableCell>
										<TableCell>₹{proj.totalAmount?.toLocaleString()}</TableCell>
										<TableCell>₹{proj.totalEstimated?.toLocaleString()}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Top Vehicles */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Truck className="h-5 w-5" />
						Top Vehicles
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Vehicle Number</TableHead>
								<TableHead>Trips</TableHead>
								<TableHead>Total Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{topVehicles?.map((vehicle) => (
								<TableRow key={vehicle._id}>
									<TableCell className="font-mono font-medium">
										{vehicle._id}
									</TableCell>
									<TableCell>{vehicle.count}</TableCell>
									<TableCell>₹{vehicle.totalAmount?.toLocaleString()}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
