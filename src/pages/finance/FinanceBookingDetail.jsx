
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Download,
	Wallet,
	User,
	Building,
	Receipt,
	Calendar,
	FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/hooks/useBooking";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { formatDate } from "@/lib/helpers";
import { FinanceInstallmentTable } from "./FinanceInstallmentTable";

export default function FinanceBookingDetail() {
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		currentBooking: booking,
		installments,
		installmentSummary,
		fetchBookingById,
		exportBooking,
		loading,
	} = useBooking();

	useEffect(() => {
		if (id) {
			fetchBookingById(id);
		}
	}, [id, fetchBookingById]);

	// Helper function for Indian Currency Formatting
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 0,
		}).format(amount || 0);
	};

	const handleExport = async () => {
		if (!id) return;

		await exportBooking(id);
	};

	if (loading && !booking) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-8 w-48" />
				<div className="space-y-6">
					<Skeleton className="h-64" />
					<Skeleton className="h-64" />
				</div>
			</div>
		);
	}

	if (!booking)
		return (
			<div className="text-center py-16 bg-card rounded-lg border border-border shadow-sm mx-4 sm:mx-0">
				<Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
				<h3 className="text-lg font-medium">Financial Record Not Found</h3>
				<p className="text-muted-foreground mt-1">The booking details you are looking for do not exist.</p>
				<Button variant="outline" className="mt-4" onClick={() => navigate("/finance-bookings")}>
					Return to Accounts Receivable
				</Button>
			</div>
		);

	const flat = booking.flatSnapshot || {};

	return (
		<div className="space-y-6 px-2 sm:px-0">
			{/* Header Actions */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate("/finance-bookings")}
					className="-ml-2 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4 mr-1.5" /> Back
				</Button>

				<div className="flex gap-2 flex-wrap w-full sm:w-auto">
					<Button
						variant="outline"
						onClick={handleExport}
						disabled={loading}
						className="bg-background shadow-sm w-full sm:w-auto"
					>
						<Download className="h-4 w-4 mr-1.5" />
						Download Excel
					</Button>

					{booking.agreementDocument?.documentUrl && (
						<Button
							variant="outline"
							asChild
							className="bg-background shadow-sm w-full sm:w-auto"
						>
							<a
								href={booking.agreementDocument.documentUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex justify-center"
							>
								<Download className="h-4 w-4 mr-1.5" />
								View Agreement
							</a>
						</Button>
					)}
				</div>
			</div>

			{/* Main Content Area - Changed to a 2-column layout to reduce vertical scroll */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

				{/* --- LEFT CARD: Property & Client Details --- */}
				<Card className="shadow-sm border-border/60 flex flex-col">
					<CardHeader className="bg-muted/20 border-b pb-3 pt-4">
						<div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
							<CardTitle className="flex items-center gap-2 text-base">
								<User className="h-4 w-4 text-muted-foreground" />
								Client & Property Details
							</CardTitle>
							<BookingStatusBadge
								status={booking.status}
								approvalStatus={booking.approvalStatus}
								showApproval
							/>
						</div>
					</CardHeader>

					<CardContent className="p-4 space-y-4 flex-1">
						{/* Top Section: Client & Dates (2-col Grid) */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">Booking Ref</span>
								<span className="font-mono text-xs font-semibold tracking-wide bg-muted px-1.5 py-0.5 rounded border border-border/50 break-words">
									{booking.bookingReferenceNumber}
								</span>
							</div>

							<div>
								<span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">Client Name</span>
								<span className="font-semibold text-sm text-foreground break-words block truncate">
									{booking.clientId?.name || "Self"}
								</span>
								{booking.clientId?.phone && (
									<span className="block text-xs text-muted-foreground">{booking.clientId.phone}</span>
								)}
							</div>

							<div className="flex items-start gap-2">
								<Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
								<div>
									<span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-0.5">Booking Date</span>
									<span className="font-medium text-xs">{formatDate(booking.createdAt)}</span>
								</div>
							</div>

							<div className="flex items-start gap-2">
								<FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
								<div>
									<span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-0.5">Agreement</span>
									<span className="font-medium text-xs">
										{booking.agreementDate
											? formatDate(booking.agreementDate)
											: booking.agreementDocument?.signedAt
												? formatDate(booking.agreementDocument.signedAt)
												: "—"}
									</span>
								</div>
							</div>
						</div>

						<div className="border-t border-border/40" />

						{/* Bottom Section: Property Info */}
						<div className="bg-accent/20 p-3 rounded-xl border border-border/40 space-y-3">
							<div className="flex items-center gap-2">
								<Building className="h-4 w-4 text-primary/80 flex-shrink-0" />
								<span className="font-semibold text-sm truncate">{booking.projectId?.name}</span>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background p-2.5 rounded-lg border border-border/50 shadow-sm w-full">
								<div>
									<span className="text-muted-foreground block text-[10px] mb-0.5 uppercase tracking-wider">Unit</span>
									<span className="font-semibold text-xs truncate block">Flat {flat.flatNumber || "—"}</span>
								</div>
								<div>
									<span className="text-muted-foreground block text-[10px] mb-0.5 uppercase tracking-wider">Tower/Flr</span>
									<span className="font-semibold text-xs truncate block">{flat.towerName || "—"} ({flat.floor || "—"})</span>
								</div>
								<div>
									<span className="text-muted-foreground block text-[10px] mb-0.5 uppercase tracking-wider">Area</span>
									<span className="font-semibold text-xs truncate block">{flat.area ? `${flat.area} sqft` : "—"}</span>
								</div>
								<div>
									<span className="text-muted-foreground block text-[10px] mb-0.5 uppercase tracking-wider">Config</span>
									<span className="font-semibold text-xs truncate block">{flat.bedrooms ? `${flat.bedrooms} BHK` : "—"}</span>
								</div>
							</div>
						</div>

						{booking.cancellation?.reason && (
							<div className="p-2.5 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-xs">
								<span className="font-bold block mb-0.5">Cancellation Reason:</span>
								{booking.cancellation.reason}
							</div>
						)}
					</CardContent>
				</Card>

				{/* --- RIGHT CARD: Financial Ledger --- */}
				<Card className="shadow-sm border-border/60 flex flex-col">
					<CardHeader className="bg-primary/5 border-b pb-3 pt-4">
						<CardTitle className="flex items-center gap-2 text-base">
							<Wallet className="h-4 w-4 text-primary" />
							Financial Details
						</CardTitle>
					</CardHeader>

					<CardContent className="p-4 flex-1">
						{/* Financials split into a 2-col inner grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">

							{/* Column 1: Base Calc + Payments Summary */}
							<div className="space-y-4 flex flex-col">
								{/* Base Calculation */}
								<div className="bg-muted/10 p-3 rounded-xl border border-border/40 space-y-2 text-sm">
									<div className="flex justify-between items-center gap-2">
										<span className="text-muted-foreground text-xs font-medium">Base Value:</span>
										<span className="font-semibold text-foreground">{formatCurrency(flat.price)}</span>
									</div>
									<div className="flex justify-between items-center gap-2">
										<span className="text-muted-foreground text-xs font-medium flex items-center gap-1.5 flex-wrap">
											Taxes (GST)
											{booking.gstPercentage > 0 && (
												<span className="inline-flex items-center rounded bg-accent px-1 py-0 text-[9px] font-bold text-foreground ring-1 ring-inset ring-border">
													{booking.gstPercentage}%
												</span>
											)}
										</span>
										<span className="font-semibold text-muted-foreground">+{formatCurrency(booking.totalGstAmount || 0)}</span>
									</div>
									<div className="flex justify-between items-center pt-2 border-t border-border/60 gap-2">
										<span className="font-bold text-foreground text-sm">Total Value:</span>
										<span className="font-bold text-primary text-sm">
											{formatCurrency((flat.price || 0) + (booking.totalGstAmount || 0))}
										</span>
									</div>
								</div>

								{/* Payments & Balance */}
								<div className="space-y-1.5 px-1 text-xs flex-1 flex flex-col justify-end">
									<div className="flex justify-between items-center">
										<span className="text-muted-foreground">Booking Base:</span>
										<span className="text-muted-foreground">{formatCurrency(booking.bookingBaseAmount || 0)}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-muted-foreground">Booking GST:</span>
										<span className="text-muted-foreground">+{formatCurrency(booking.gstPaid || 0)}</span>
									</div>
									<div className="flex justify-between items-center font-medium text-foreground">
										<span>Total Booking Paid:</span>
										<span>{formatCurrency((booking.bookingBaseAmount || 0) + (booking.gstPaid || 0))}</span>
									</div>

									<div className="border-b border-dashed border-border/60 my-1" />

									<div className="flex justify-between items-center font-semibold">
										<span className="text-foreground">Overall Paid:</span>
										<span className="text-teal-700 dark:text-teal-400">{formatCurrency(booking.totalPaid || 0)}</span>
									</div>
									<div className="flex justify-between items-center pt-1.5 mt-0.5 border-t border-border/60">
										<span className="font-bold text-foreground text-sm">Balance Due:</span>
										<span className="font-bold text-destructive text-base">
											{formatCurrency(booking.remainingAmount || 0)}
										</span>
									</div>
								</div>
							</div>

							{/* Column 2: Installment Plan Summary */}
							<div className="h-full">
								{installmentSummary?.totalAmount > 0 ? (
									<div className="space-y-3 bg-muted/40 p-3 rounded-xl border border-border/50 h-full flex flex-col">
										<p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1.5">
											<Receipt className="h-3 w-3" /> Installments
										</p>
										<div className="flex-1 space-y-2">
											<div className="flex justify-between text-xs items-center gap-2">
												<span className="text-muted-foreground font-medium">Plan Target:</span>
												<span className="font-semibold">{formatCurrency(installmentSummary.totalAmount)}</span>
											</div>
											<div className="flex justify-between text-xs items-center gap-2">
												<span className="text-muted-foreground font-medium">Cleared:</span>
												<span className="font-semibold text-emerald-600 dark:text-emerald-500">{formatCurrency(installmentSummary.totalPaid)}</span>
											</div>
											<div className="flex justify-between text-xs items-center gap-2">
												<span className="text-muted-foreground font-medium">Pending:</span>
												<span className="font-semibold text-amber-600 dark:text-amber-500">{formatCurrency(installmentSummary.pendingAmount)}</span>
											</div>
										</div>

										{installmentSummary.overdueAmount > 0 && (
											<div className="flex justify-between text-xs items-center pt-2 mt-auto border-t border-destructive/20 gap-2">
												<span className="font-bold text-destructive">Overdue:</span>
												<span className="font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded whitespace-nowrap">
													{formatCurrency(installmentSummary.overdueAmount)}
												</span>
											</div>
										)}
									</div>
								) : (
									<div className="flex items-center justify-center h-full min-h-[120px] bg-muted/20 border border-dashed border-border/60 rounded-xl">
										<p className="text-muted-foreground text-[11px] font-medium text-center px-4">
											No installment plan generated.
										</p>
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

			</div>

			{/* --- Installment Table (Read Only) --- */}
			<div className="pt-2">
				<h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
					Installments
				</h3>
				{/* Note: Ensure FinanceInstallmentTable itself has overflow-x-auto on its wrapper if it doesn't already */}
				<FinanceInstallmentTable installments={installments} />
			</div>
		</div>
	);
}