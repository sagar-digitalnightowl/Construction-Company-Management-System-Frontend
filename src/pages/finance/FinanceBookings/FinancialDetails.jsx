import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Wallet } from "lucide-react";

export function FinancialDetails({
	booking,
	flat,
	installmentSummary,
	formatCurrency,
}) {
	return (
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
	)
}