// src/pages/stockManager/tabs/AllReportsTab.jsx

import React, { useState } from "react";
import { Eye, CheckCircle, XCircle, Calendar, Package, MapPin, User, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VERIFICATION_STATUS_COLORS, STOCK_ITEM_CATEGORIES } from "@/data/stockConstants";
import { formatDate } from "@/lib/helpers";
import { ReportDetailDialog } from "../components/ReportDetailDialog";
import { VerifyReportDialog } from "../components/VerifyReportDialog";
import { useSiteStock } from "@/hooks/useSiteStock";

export function AllReportsTab({ reports = [], pagination, loading, onRefresh, onVerify, canVerify }) {
	const [selectedReport, setSelectedReport] = useState(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [verifyOpen, setVerifyOpen] = useState(false);
	const [verifyAction, setVerifyAction] = useState("verified");
	const [filters, setFilters] = useState({
		search: "",
		itemCategory: "",
		verificationStatus: "",
		dateFrom: "",
		dateTo: "",
	});

	const { fetchReportById } = useSiteStock();

	// Filter the loaded reports in the browser (filter changes do not call the API)
	const filteredReports = reports.filter((report) => {
		const term = filters.search.trim().toLowerCase();
		if (term) {
			const haystack = [report.itemName, report.vehicleNumber, report.supplierName, report.notes, report.reportedBy?.name]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			if (!haystack.includes(term)) return false;
		}
		if (filters.itemCategory && filters.itemCategory !== "all" && report.itemCategory !== filters.itemCategory) return false;
		if (filters.verificationStatus && filters.verificationStatus !== "all" && report.verificationStatus !== filters.verificationStatus) return false;
		return true;
	});

	const handleViewDetails = async (report) => {
		setDetailsOpen(true);
		try {
			// Show only the data returned by the report-by-id API
			const fullReport = await fetchReportById(report._id);
			setSelectedReport(fullReport);
		} catch (error) {
			console.error("Error fetching report details:", error);
			setDetailsOpen(false);
		}
	};

	const handleVerifyClick = (report, action) => {
		setSelectedReport(report);
		setVerifyAction(action);
		setVerifyOpen(true);
	};

	const handleVerifySubmit = async (note) => {
		try {
			await onVerify(selectedReport._id, verifyAction, note);
			setVerifyOpen(false);
			onRefresh();
		} catch (error) {
			console.error("Error verifying report:", error);
		}
	};

	const getStatusColor = (status) => {
		return VERIFICATION_STATUS_COLORS[status] || "default";
	};

	const handleExportCSV = () => {
		const headers = ["Date", "Project", "Item Name", "Category", "Quantity", "Unit", "Rate Per Unit", "Total Amount", "Supplier", "Vehicle Number", "Reported By", "Status", "Verified By", "Rejection Reason"];
		
		const rows = filteredReports.map(report => [
			formatDate(report.materialArrivedDate),
			report.projectName,
			report.itemName,
			report.itemCategory,
			report.qty,
			report.unit,
			report.ratePerUnit,
			report.totalAmount,
			report.supplierName || "-",
			report.vehicleNumber || "-",
			report.reportedBy?.name || "-",
			report.verificationStatus,
			report.verifiedBy?.name || "-",
			report.rejectionReason || "-"
		]);

		const csvContent = [
			headers.join(","),
			...rows.map(row => row.map(cell => `"${cell}"`).join(","))
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `all_stock_reports_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (loading) {
		return (
			<Card className="p-6">
				<div className="text-center text-muted-foreground">Loading reports...</div>
			</Card>
		);
	}

	if (!reports.length) {
		return (
			<Card className="p-6">
				<div className="text-center text-muted-foreground">
					No reports found.
				</div>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{/* Filters */}
			<Card className="p-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Input
						placeholder="Search by item, vehicle, supplier..."
						value={filters.search}
						onChange={(e) => setFilters({ ...filters, search: e.target.value })}
					/>

					<Select
						value={filters.itemCategory}
						onValueChange={(value) => setFilters({ ...filters, itemCategory: value })}
					>
						<SelectTrigger>
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							{STOCK_ITEM_CATEGORIES.map(cat => (
								<SelectItem key={cat.value} value={cat.value}>
									{cat.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={filters.verificationStatus}
						onValueChange={(value) => setFilters({ ...filters, verificationStatus: value })}
					>
						<SelectTrigger>
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="verified">Verified</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
						</SelectContent>
					</Select>

					<div className="flex gap-2">
						<Button onClick={handleExportCSV} variant="outline" size="sm">
							<Download className="h-4 w-4 mr-2" />
							Export CSV
						</Button>
						<Button onClick={onRefresh} variant="outline">
							Refresh
						</Button>
					</div>
				</div>
			</Card>

			{/* Reports Table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Project</TableHead>
							<TableHead>Item</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Reported By</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredReports.map((report) => (
							<TableRow key={report._id}>
								<TableCell>
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">
											{formatDate(report.materialArrivedDate)}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4 text-muted-foreground" />
										<span className="font-medium">{report.projectName}</span>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="flex items-center gap-2">
											<Package className="h-4 w-4 text-muted-foreground" />
											<span className="font-medium">{report.itemName}</span>
										</div>
										<span className="text-xs text-muted-foreground capitalize">
											{report.itemCategory}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<span className="font-medium">
										{report.qty} {report.unit}
									</span>
								</TableCell>
								<TableCell>
									<span className="font-medium">
										₹{report.totalAmount?.toLocaleString()}
									</span>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<User className="h-4 w-4 text-muted-foreground" />
										<div>
											<div className="text-sm">{report.reportedBy?.name}</div>
											<div className="text-xs text-muted-foreground capitalize">
												{report.reportedBy?.role?.replace("_", " ")}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant={getStatusColor(report.verificationStatus)}>
										{report.verificationStatus}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Button
											size="sm"
											variant="ghost"
											onClick={() => handleViewDetails(report)}
										>
											<Eye className="h-4 w-4" />
										</Button>
										{canVerify && report.verificationStatus === "pending" && (
											<>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleVerifyClick(report, "verified")}
												>
													<CheckCircle className="h-4 w-4 text-success" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleVerifyClick(report, "rejected")}
												>
													<XCircle className="h-4 w-4 text-destructive" />
												</Button>
											</>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>

			{/* Pagination */}
			{pagination && pagination.pages > 1 && (
				<div className="flex justify-between items-center">
					<div className="text-sm text-muted-foreground">
						Showing {reports.length} of {pagination.total} reports
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={pagination.page === 1}
							onClick={() => onRefresh({ page: pagination.page - 1 })}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={pagination.page === pagination.pages}
							onClick={() => onRefresh({ page: pagination.page + 1 })}
						>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Dialogs */}
			{selectedReport && (
				<>
					<ReportDetailDialog
						report={selectedReport}
						open={detailsOpen}
						onOpenChange={setDetailsOpen}
					/>
					<VerifyReportDialog
						report={selectedReport}
						action={verifyAction}
						open={verifyOpen}
						onOpenChange={setVerifyOpen}
						onSubmit={handleVerifySubmit}
					/>
				</>
			)}
		</div>
	);
}
