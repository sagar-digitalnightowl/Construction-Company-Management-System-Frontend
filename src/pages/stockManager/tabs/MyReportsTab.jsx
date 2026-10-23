// src/pages/stockManager/tabs/MyReportsTab.jsx

import React, { useState } from "react";
import { Eye, Edit, Trash2, Calendar, Package, MapPin, Download } from "lucide-react";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { VERIFICATION_STATUS_COLORS, STOCK_ITEM_CATEGORIES, STOCK_UNITS } from "@/data/stockConstants";
import { formatDate } from "@/lib/helpers";
import { ReportDetailDialog } from "../components/ReportDetailDialog";
import { useSiteStock } from "@/hooks/useSiteStock";
import { useAuthStore } from "@/store/authStore";
import { currentUserId, canEditStock, canDeleteStock } from "../stockPermissions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function MyReportsTab({ reports = [], pagination, loading, onRefresh, onDelete }) {
	const { fetchReportById, updateReport } = useSiteStock();
		const { current } = useAuthStore();
		const userId = currentUserId(current);
	const [selectedReport, setSelectedReport] = useState(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [reportToDelete, setReportToDelete] = useState(null);
	const [filters, setFilters] = useState({
		search: "",
		itemCategory: "",
		verificationStatus: "",
		dateFrom: "",
		dateTo: "",
	});

	// Filter the loaded reports in the browser (filter changes do not call the API)
	const filteredReports = reports.filter((report) => {
		const term = filters.search.trim().toLowerCase();
		if (term) {
			const haystack = [report.itemName, report.vehicleNumber, report.supplierName, report.notes]
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
		setLoadingDetails(true);
		setDetailsOpen(true);
		try {
			// Show only the data returned by the report-by-id API
			const fullReport = await fetchReportById(report._id);
			setSelectedReport(fullReport);
		} catch (error) {
			console.error("Error fetching report details:", error);
			setDetailsOpen(false);
		} finally {
			setLoadingDetails(false);
		}
	};

	const [editOpen, setEditOpen] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editReportId, setEditReportId] = useState(null);
	const [editForm, setEditForm] = useState(null);

	const setEditField = (key, value) => setEditForm((prev) => ({ ...prev, [key]: value }));

	// Same rule as the Add Report form: digits and one decimal point only
	const sanitizeNumeric = (value) => {
		const cleaned = value.replace(/[^0-9.]/g, "");
		const [whole, ...decimals] = cleaned.split(".");
		return decimals.length ? `${whole}.${decimals.join("")}` : whole;
	};

	const openEdit = (report) => {
		setEditReportId(report._id);
		setEditForm({
			itemName: report.itemName || "",
			itemCategory: report.itemCategory || "",
			unit: report.unit || "",
			qty: report.qty != null ? String(report.qty) : "",
			ratePerUnit: report.ratePerUnit != null ? String(report.ratePerUnit) : "",
			totalAmount: report.totalAmount != null ? String(report.totalAmount) : "",
			estimatedValue: report.estimatedValue != null ? String(report.estimatedValue) : "",
			vehicleNumber: report.vehicleNumber || "",
			materialArrivedDate: report.materialArrivedDate ? report.materialArrivedDate.split("T")[0] : "",
			supplierName: report.supplierName || "",
			invoiceNumber: report.invoiceNumber || "",
			notes: report.notes || "",
		});
		setEditOpen(true);
	};

	const handleEditSubmit = async () => {
		if (!editForm.itemName.trim()) return toast.error("Please enter item name");
		if (!editForm.itemCategory) return toast.error("Please select item category");
		if (!editForm.unit) return toast.error("Please select unit");
		if (!editForm.qty || parseFloat(editForm.qty) <= 0) return toast.error("Please enter a valid quantity");

		const payload = {
			...editForm,
			itemName: editForm.itemName.trim(),
			qty: parseFloat(editForm.qty),
			ratePerUnit: editForm.ratePerUnit ? parseFloat(editForm.ratePerUnit) : undefined,
			totalAmount: editForm.totalAmount ? parseFloat(editForm.totalAmount) : undefined,
			estimatedValue: editForm.estimatedValue ? parseFloat(editForm.estimatedValue) : undefined,
		};

		setEditSaving(true);
		try {
			await updateReport(editReportId, payload);
			setEditOpen(false);
			onRefresh();
		} catch (error) {
			// The hook already shows the error toast; keep the dialog open so the user can fix the form
		} finally {
			setEditSaving(false);
		}
	};

	const handleDelete = async (reportId) => {
		const success = await onDelete(reportId);
		if (success) {
			setDeleteDialogOpen(false);
			setReportToDelete(null);
			onRefresh();
		}
	};

	const confirmDelete = (report) => {
		setReportToDelete(report);
		setDeleteDialogOpen(true);
	};

	const getStatusColor = (status) => {
		return VERIFICATION_STATUS_COLORS[status] || "default";
	};

	const handleExportCSV = () => {
		const headers = ["Date", "Project", "Item Name", "Category", "Quantity", "Unit", "Rate Per Unit", "Total Amount", "Supplier", "Vehicle Number", "Status", "Verified By", "Rejection Reason"];
		
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
		link.setAttribute("download", `my_stock_reports_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

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
						<Button onClick={() => onRefresh()} variant="outline">
							Refresh
						</Button>
					</div>
				</div>
			</Card>

			{/* Reports Table */}
			<Card>
				{loading ? (
					<div className="p-6 text-center text-muted-foreground">Loading reports...</div>
				) : !reports.length ? (
					<div className="p-6 text-center text-muted-foreground">
						No reports found. Click "Add Stock" to record your first stock entry.
					</div>
				) : !filteredReports.length ? (
					<div className="p-6 text-center text-muted-foreground">
						No reports match the current filters.
					</div>
				) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Project</TableHead>
							<TableHead>Item</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead>Amount</TableHead>
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
									<div className="flex items-center gap-2">
										<Package className="h-4 w-4 text-muted-foreground" />
										<span>{report.itemName}</span>
									</div>
								</TableCell>
								<TableCell>
									<span className="text-sm capitalize">{report.itemCategory}</span>
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
										{canEditStock(current?.role, userId, report) && (
															<Button size="sm" variant="ghost" onClick={() => openEdit(report)}>
																<Edit className="h-4 w-4" />
															</Button>
														)}
														{canDeleteStock(current?.role, userId, report) && (
											<Button
												size="sm"
												variant="ghost"
												onClick={() => confirmDelete(report)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				)}
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

			{/* Detail Dialog */}
			{selectedReport && (
				<ReportDetailDialog
					report={selectedReport}
					open={detailsOpen}
					onOpenChange={setDetailsOpen}
				/>
			)}

			{/* Edit Report Dialog */}
			{editForm && (
				<Dialog open={editOpen} onOpenChange={setEditOpen}>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Edit Stock Report</DialogTitle>
							<DialogDescription>Only pending reports can be edited.</DialogDescription>
						</DialogHeader>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="edit-itemName">Item Name *</Label>
								<Input id="edit-itemName" value={editForm.itemName} onChange={(e) => setEditField("itemName", e.target.value)} />
							</div>

							<div className="space-y-2">
								<Label>Item Category *</Label>
								<Select value={editForm.itemCategory} onValueChange={(value) => setEditField("itemCategory", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{STOCK_ITEM_CATEGORIES.map(cat => (
											<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Unit *</Label>
								<Select value={editForm.unit} onValueChange={(value) => setEditField("unit", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select unit" />
									</SelectTrigger>
									<SelectContent>
										{STOCK_UNITS.map(unit => (
											<SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{[
								["qty", "Quantity *"],
								["ratePerUnit", "Rate Per Unit (₹)"],
								["totalAmount", "Total Amount (₹)"],
								["estimatedValue", "Estimated Value (₹)"],
							].map(([key, label]) => (
								<div className="space-y-2" key={key}>
									<Label htmlFor={`edit-${key}`}>{label}</Label>
									<Input
										id={`edit-${key}`}
										inputMode="decimal"
										value={editForm[key]}
										onChange={(e) => setEditField(key, sanitizeNumeric(e.target.value))}
									/>
								</div>
							))}

							<div className="space-y-2">
								<Label htmlFor="edit-vehicleNumber">Vehicle Number</Label>
								<Input
									id="edit-vehicleNumber"
									value={editForm.vehicleNumber}
									onChange={(e) => setEditField("vehicleNumber", e.target.value.toUpperCase())}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="edit-materialArrivedDate">Material Arrived Date</Label>
								<Input
									id="edit-materialArrivedDate"
									type="date"
									value={editForm.materialArrivedDate}
									onChange={(e) => setEditField("materialArrivedDate", e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="edit-supplierName">Supplier Name</Label>
								<Input id="edit-supplierName" value={editForm.supplierName} onChange={(e) => setEditField("supplierName", e.target.value)} />
							</div>

							<div className="space-y-2">
								<Label htmlFor="edit-invoiceNumber">Invoice Number</Label>
								<Input id="edit-invoiceNumber" value={editForm.invoiceNumber} onChange={(e) => setEditField("invoiceNumber", e.target.value)} />
							</div>

							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="edit-notes">Notes</Label>
								<Textarea id="edit-notes" rows={3} value={editForm.notes} onChange={(e) => setEditField("notes", e.target.value)} />
							</div>
						</div>

						<DialogFooter>
							<Button variant="outline" onClick={() => setEditOpen(false)} disabled={editSaving}>
								Cancel
							</Button>
							<Button onClick={handleEditSubmit} disabled={editSaving}>
								{editSaving ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Stock Report</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this stock report?
							{reportToDelete && (
								<div className="mt-3 p-3 bg-muted rounded-md">
									<p className="font-medium">{reportToDelete.itemName}</p>
									<p className="text-sm text-muted-foreground">
										{reportToDelete.projectName} • {reportToDelete.qty} {reportToDelete.unit}
									</p>
								</div>
							)}
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setDeleteDialogOpen(false);
								setReportToDelete(null);
							}}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => reportToDelete && handleDelete(reportToDelete._id)}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
