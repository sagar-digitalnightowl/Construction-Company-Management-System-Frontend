// src/pages/stockManager/components/ReportDetailDialog.jsx

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VERIFICATION_STATUS_COLORS } from "@/data/stockConstants";
import { formatDate } from "@/lib/helpers";

export function ReportDetailDialog({ report, open, onOpenChange }) {
	if (!report) return null;

	const getStatusColor = (status) => {
		return VERIFICATION_STATUS_COLORS[status] || "default";
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Stock Report Details</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Header Info */}
					<Card>
						<CardContent className="pt-6">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<div className="text-sm text-muted-foreground">Project</div>
									<div className="font-medium">{report.projectName}</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Status</div>
									<Badge variant={getStatusColor(report.verificationStatus)}>
										{report.verificationStatus}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Item Details */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="font-semibold mb-3">Item Details</h3>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<div className="text-sm text-muted-foreground">Item Name</div>
									<div className="font-medium">{report.itemName}</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Category</div>
									<div className="capitalize">{report.itemCategory}</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Quantity</div>
									<div className="font-medium">
										{report.qty} {report.unit}
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Rate Per Unit</div>
									<div>₹{report.ratePerUnit?.toLocaleString()}</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Total Amount</div>
									<div className="font-medium text-lg">
										₹{report.totalAmount?.toLocaleString()}
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Estimated Value</div>
									<div>₹{report.estimatedValue?.toLocaleString()}</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Delivery Details */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="font-semibold mb-3">Delivery Details</h3>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<div className="text-sm text-muted-foreground">Vehicle Number</div>
									<div className="font-mono font-medium">
										{report.vehicleNumber || "N/A"}
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Arrived Date</div>
									<div>{formatDate(report.materialArrivedDate)}</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Supplier</div>
									<div>{report.supplierName || "N/A"}</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Invoice Number</div>
									<div>{report.invoiceNumber || "N/A"}</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Photos */}
					{report.photoUrls && report.photoUrls.length > 0 && (
						<Card>
							<CardContent className="pt-6">
								<h3 className="font-semibold mb-3">Photos</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{report.photoUrls.map((url, index) => (
										<a
											key={index}
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											className="block"
										>
											<img
												src={url}
												alt={`Photo ${index + 1}`}
												className="w-full h-32 object-cover rounded border hover:opacity-80 transition"
											/>
										</a>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Notes */}
					{report.notes && (
						<Card>
							<CardContent className="pt-6">
								<h3 className="font-semibold mb-3">Notes</h3>
								<p className="text-sm text-muted-foreground">{report.notes}</p>
							</CardContent>
						</Card>
					)}

					{/* Verification Info */}
					{report.verificationStatus !== "pending" && (
						<Card>
							<CardContent className="pt-6">
								<h3 className="font-semibold mb-3">Verification Details</h3>
								<div className="space-y-2">
									{report.verifiedBy && (
										<div>
											<div className="text-sm text-muted-foreground">Verified By</div>
											<div>{report.verifiedBy.name}</div>
										</div>
									)}
									{report.verifiedAt && (
										<div>
											<div className="text-sm text-muted-foreground">Verified At</div>
											<div>{formatDate(report.verifiedAt)}</div>
										</div>
									)}
									{report.verificationNote && (
										<div>
											<div className="text-sm text-muted-foreground">Note</div>
											<p className="text-sm">{report.verificationNote}</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Reported By */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="font-semibold mb-3">Report Information</h3>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<div className="text-sm text-muted-foreground">Reported By</div>
									<div>{report.reportedBy?.name}</div>
									<div className="text-xs text-muted-foreground capitalize">
										{report.reportedBy?.role?.replace("_", " ")}
									</div>
								</div>
								<div>
									<div className="text-sm text-muted-foreground">Created At</div>
									<div>{formatDate(report.createdAt)}</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
