
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Download,
	Wallet,
	Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/hooks/useBooking";
import { FinanceInstallmentTable } from "../FinanceInstallmentTable";
import { ClientPropertyDetails } from "./ClientPropertyDetails";
import { FinancialDetails } from "./FinancialDetails";

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
				<ClientPropertyDetails
					booking={booking}
					flat={flat}
				/>

				{/* --- RIGHT CARD: Financial Ledger --- */}
				<FinancialDetails
					booking={booking}
					flat={flat}
					installmentSummary={installmentSummary}
					formatCurrency={formatCurrency}
				/>
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