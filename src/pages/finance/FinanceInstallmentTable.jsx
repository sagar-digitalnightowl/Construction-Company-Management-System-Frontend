// src/components/finance/FinanceInstallmentTable.jsx
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { InstallmentStatusBadge } from "@/components/booking/InstallmentStatusBadge";
import { formatDate } from "@/lib/helpers";
import { PAYMENT_MODE } from "@/data/constants/booking";

export function FinanceInstallmentTable({ installments }) {
	// Helper function for Indian Currency Formatting (₹ 8,00,000)
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 0,
		}).format(amount || 0);
	};

	if (!installments || !installments.length) {
		return (
			<div className="text-center py-12 bg-muted/20 border border-dashed border-border/60 rounded-lg">
				<p className="text-muted-foreground text-sm font-medium">
					No installment records found for this booking.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-border/70 overflow-hidden shadow-sm">
			<Table>
				<TableHeader className="bg-muted/40">
					<TableRow>
						<TableHead className="w-16 font-semibold tracking-wide text-xs uppercase">#</TableHead>
						<TableHead className="font-semibold tracking-wide text-xs uppercase">Description</TableHead>
						<TableHead className="font-semibold tracking-wide text-xs uppercase">Due Date</TableHead>
						<TableHead className="font-semibold tracking-wide text-xs uppercase text-right">Amount</TableHead>
						<TableHead className="font-semibold tracking-wide text-xs uppercase text-right">Paid Amount</TableHead>
						<TableHead className="font-semibold tracking-wide text-xs uppercase">Status</TableHead>
						<TableHead className="font-semibold tracking-wide text-xs uppercase">Mode</TableHead>
						<TableHead className="font-semibold tracking-wide text-xs uppercase">Transaction ID</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{installments.map((inst) => (
						<TableRow key={inst._id} className="hover:bg-muted/30 transition-colors">
							<TableCell className="font-medium text-muted-foreground">
								{inst.installmentNumber}
							</TableCell>
							{/* Updated description cell to wrap text naturally instead of truncating */}
							<TableCell className="min-w-[250px] whitespace-normal">
								{inst.description}
							</TableCell>
							<TableCell className="whitespace-nowrap">
								{inst.dueDate ? (
									<span className="font-medium text-foreground">{formatDate(inst.dueDate)}</span>
								) : (
									<span className="text-muted-foreground italic text-xs">Not scheduled</span>
								)}
							</TableCell>
							<TableCell className="text-right font-semibold text-foreground">
								{formatCurrency(inst.amount)}
							</TableCell>
							<TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-500">
								{formatCurrency(inst.paidAmount)}
							</TableCell>
							<TableCell>
								<InstallmentStatusBadge status={inst.status} />
							</TableCell>
							<TableCell className="text-muted-foreground text-sm">
								{inst.paymentMode
									? PAYMENT_MODE[inst.paymentMode] || inst.paymentMode
									: "—"}
							</TableCell>
							<TableCell className="font-mono text-xs text-muted-foreground tracking-wider">
								{inst.transactionId || "—"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}