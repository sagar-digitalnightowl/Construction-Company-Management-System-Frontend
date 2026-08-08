// src/pages/finance/FinanceBookingDetail.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Wallet, User, Building, Receipt, Calendar, FileText } from "lucide-react";
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
				<Button variant="outline" className="mt-4" onClick={() => navigate("/finance/bookings")}>
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
					onClick={() => navigate("/finance/bookings")}
					className="-ml-2 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4 mr-1.5" /> Back
				</Button>

				<div className="flex gap-2 flex-wrap w-full sm:w-auto">
					{booking.agreementDocument?.documentUrl && (
						<Button variant="outline" asChild className="bg-background shadow-sm w-full sm:w-auto">
							<a
								href={booking.agreementDocument.documentUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex justify-center"
							>
								<Download className="h-4 w-4 mr-1.5" /> View Agreement
							</a>
						</Button>
					)}
				</div>
			</div>

			{/* Main Content Area */}
			<div className="space-y-6">

				{/* --- TOP CARD: Property & Client Details --- */}
				<Card className="shadow-sm border-border/60">
					<CardHeader className="bg-muted/20 border-b pb-4">
						{/* FIX: Added items-start here to prevent the badge from stretching on mobile */}
						<div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
							<CardTitle className="flex items-center gap-2 text-lg">
								<User className="h-5 w-5 text-muted-foreground" />
								Client & Property Details
							</CardTitle>
							<BookingStatusBadge
								status={booking.status}
								approvalStatus={booking.approvalStatus}
								showApproval
							/>
						</div>
					</CardHeader>

					<CardContent className="pt-6 space-y-6">
						{/* Top Section: Client & Dates (Responsive Grid) */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							<div>
								<span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1.5">Booking Reference</span>
								<span className="font-mono text-sm font-semibold tracking-wide bg-muted px-2 py-1 rounded border border-border/50 break-words">
									{booking.bookingReferenceNumber}
								</span>
							</div>

							<div>
								<span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1.5">Client Name</span>
								<span className="font-semibold text-base text-foreground break-words block">
									{booking.clientId?.name || "Self"}
								</span>
								{booking.clientId?.phone && (
									<span className="block text-sm text-muted-foreground mt-0.5">{booking.clientId.phone}</span>
								)}
							</div>

							<div className="flex items-start gap-3">
								<Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
								<div>
									<span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Booking Date</span>
									<span className="font-medium text-sm">{formatDate(booking.createdAt)}</span>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
								<div>
									<span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Agreement Date</span>
									<span className="font-medium text-sm">
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
						<div className="bg-accent/20 p-4 rounded-xl border border-border/40 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
							<div className="flex items-center gap-2 lg:min-w-[200px]">
								<Building className="h-5 w-5 text-primary/80 flex-shrink-0" />
								<span className="font-semibold text-base truncate">{booking.projectId?.name}</span>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background p-3 rounded-lg border border-border/50 shadow-sm w-full">
								<div>
									<span className="text-muted-foreground block text-xs mb-1 uppercase tracking-wider">Unit</span>
									<span className="font-semibold text-sm">Flat {flat.flatNumber || "—"}</span>
								</div>
								<div>
									<span className="text-muted-foreground block text-xs mb-1 uppercase tracking-wider">Tower/Floor</span>
									<span className="font-semibold text-sm">{flat.towerName || "—"} (Fl {flat.floor || "—"})</span>
								</div>
								<div>
									<span className="text-muted-foreground block text-xs mb-1 uppercase tracking-wider">Area</span>
									<span className="font-semibold text-sm">{flat.area ? `${flat.area} sq ft` : "—"}</span>
								</div>
								<div>
									<span className="text-muted-foreground block text-xs mb-1 uppercase tracking-wider">Config</span>
									<span className="font-semibold text-sm">
										{flat.bedrooms ? `${flat.bedrooms} BHK` : "—"}
									</span>
								</div>
							</div>
						</div>

						{booking.cancellation?.reason && (
							<div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
								<span className="font-bold block mb-1">Cancellation Reason:</span>
								{booking.cancellation.reason}
							</div>
						)}
					</CardContent>
				</Card>

				{/* --- BOTTOM CARD: Financial Ledger --- */}
				<Card className="shadow-sm border-border/60">
					<CardHeader className="bg-primary/5 border-b pb-4">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Wallet className="h-5 w-5 text-primary" />
							Financial Details
						</CardTitle>
					</CardHeader>

					<CardContent className="pt-6">
						{/* Split Financials into a 1-col mobile, 3-col desktop grid */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">

							{/* Column 1: Base Calculation */}
							<div className="space-y-3 bg-muted/10 p-4 rounded-xl border border-border/40 flex flex-col justify-between">
								<div>
									<div className="flex justify-between items-center mb-3 gap-2">
										<span className="text-muted-foreground font-medium">Base Property Value:</span>
										<span className="font-semibold text-foreground text-base text-right">{formatCurrency(flat.price)}</span>
									</div>
									<div className="flex justify-between items-center gap-2">
										<span className="text-muted-foreground font-medium flex items-center gap-2 flex-wrap">
											Taxes (GST)
											{booking.gstPercentage > 0 && (
												<span className="inline-flex items-center rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-foreground ring-1 ring-inset ring-border">
													{booking.gstPercentage}%
												</span>
											)}
										</span>
										<span className="font-semibold text-muted-foreground text-right">+{formatCurrency(booking.totalGstAmount || 0)}</span>
									</div>
								</div>
								<div className="flex justify-between items-center pt-3 border-t border-border/60 gap-2">
									<span className="font-bold text-foreground text-base">Total Value:</span>
									<span className="font-bold text-primary text-lg text-right">
										{formatCurrency((flat.price || 0) + (booking.totalGstAmount || 0))}
									</span>
								</div>
							</div>

							{/* Column 2: Payments & Balance */}
							<div className="space-y-3 px-0 lg:px-2 flex flex-col justify-center">
								<div className="flex justify-between items-center gap-2">
									<span className="text-muted-foreground">Booking Advance (Base):</span>
									<span className="text-muted-foreground text-right">{formatCurrency(booking.bookingBaseAmount || 0)}</span>
								</div>
								<div className="flex justify-between items-center gap-2">
									<span className="text-muted-foreground">Booking Advance (GST):</span>
									<span className="text-muted-foreground text-right">+{formatCurrency(booking.gstPaid || 0)}</span>
								</div>

								<div className="border-b border-dashed border-border/60 py-1"></div>

								<div className="flex justify-between items-center pt-1 gap-2">
									<span className="font-semibold text-foreground">Total Paid / Cleared:</span>
									<span className="font-bold text-emerald-600 dark:text-emerald-500 text-base bg-emerald-500/10 px-2 py-0.5 rounded text-right whitespace-nowrap">
										{formatCurrency(booking.totalPaid)}
									</span>
								</div>

								<div className="flex justify-between items-center pt-2 mt-1 border-t border-border/60 gap-2">
									<span className="font-bold text-foreground text-base">Balance Due:</span>
									<span className="font-bold text-destructive text-xl bg-destructive/10 px-2 py-0.5 rounded text-right whitespace-nowrap">
										{formatCurrency(booking.remainingAmount)}
									</span>
								</div>
							</div>

							{/* Column 3: Installment Plan Summary */}
							<div className="h-full">
								{installmentSummary?.totalAmount > 0 ? (
									<div className="space-y-3 bg-muted/40 p-4 rounded-xl border border-border/50 h-full flex flex-col justify-between">
										<div>
											<p className="font-bold text-[11px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
												<Receipt className="h-3.5 w-3.5" /> Installment Tracking Summary
											</p>
											<div className="flex justify-between text-xs items-center mb-2 gap-2">
												<span className="text-muted-foreground font-medium">Plan Target:</span>
												<span className="font-semibold text-sm text-right">{formatCurrency(installmentSummary.totalAmount)}</span>
											</div>
											<div className="flex justify-between text-xs items-center mb-2 gap-2">
												<span className="text-muted-foreground font-medium">Cleared:</span>
												<span className="font-semibold text-emerald-600 dark:text-emerald-500 text-sm text-right">{formatCurrency(installmentSummary.totalPaid)}</span>
											</div>
											<div className="flex justify-between text-xs items-center gap-2">
												<span className="text-muted-foreground font-medium">Pending:</span>
												<span className="font-semibold text-amber-600 dark:text-amber-500 text-sm text-right">{formatCurrency(installmentSummary.pendingAmount)}</span>
											</div>
										</div>

										{installmentSummary.overdueAmount > 0 && (
											<div className="flex justify-between text-xs items-center pt-3 mt-2 border-t border-destructive/20 gap-2">
												<span className="font-bold text-destructive">Overdue:</span>
												<span className="font-bold text-destructive bg-destructive/10 px-2 py-1 rounded text-sm text-right whitespace-nowrap">{formatCurrency(installmentSummary.overdueAmount)}</span>
											</div>
										)}
									</div>
								) : (
									<div className="flex items-center justify-center h-full min-h-[100px] bg-muted/20 border border-dashed border-border/60 rounded-xl">
										<p className="text-muted-foreground text-xs font-medium">No installment plan generated.</p>
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