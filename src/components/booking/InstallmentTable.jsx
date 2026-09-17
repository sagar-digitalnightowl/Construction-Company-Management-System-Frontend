
// src/components/booking/InstallmentTable.jsx
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InstallmentStatusBadge } from "./InstallmentStatusBadge";
import { formatDate } from "@/lib/helpers";
import { PAYMENT_MODE } from "@/data/constants/booking";

export function InstallmentTable({ installments, onPay, canPay }) {
	// Amount ko Indian format (₹ 8,00,000) mein convert karne ke liye helper function
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 0,
		}).format(amount || 0);
	};

	if (!installments.length) {
		return (
			<p className="text-center text-muted-foreground py-8">
				No installments found.
			</p>
		);
	}

	return (
		<div className="rounded-lg border overflow-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12">#</TableHead>
						<TableHead>description</TableHead>
						{/* <TableHead>Due Date</TableHead> */}
						<TableHead className="w-[160px] min-w-[160px] text-right">
							Amount
						</TableHead>

						<TableHead className="w-[180px] min-w-[180px] text-right">
							Paid Amount
						</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Reminder</TableHead>
						<TableHead>Payment Mode</TableHead>
						<TableHead>Transaction ID</TableHead>
						{canPay && <TableHead className="w-24">Action</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{installments.map((inst, idx) => (
						<TableRow key={inst._id}>
							<TableCell>{inst.installmentNumber}</TableCell>
							<TableCell className="max-w-xs">{inst.description}</TableCell>
							{/* <TableCell>
								{" "}
								{inst.dueDate
									? formatDate(inst.dueDate)
									: "Not scheduled"}
							</TableCell> */}
							{/* formatCurrency lagaya gaya hai */}
							<TableCell className="text-right w-[160px] min-w-[160px]">
								<div className="text-xs font-semibold text-muted-foreground">
									{formatCurrency(inst.baseAmount)}
								</div>

								{inst.gstAmount > 0 && (
									<div className="text-xs text-muted-foreground">
										GST: {formatCurrency(inst.gstAmount)}
									</div>
								)}

								<div className="font-semibold text-red-600 dark:text-red-500">
									Total: {formatCurrency(inst.amount)}
								</div>
							</TableCell>
							<TableCell className="text-right w-[180px] min-w-[180px] text-foreground">
								<div className="text-muted-foreground">
									Amount Paid: {formatCurrency(inst.paidAmount - (inst.gstAmount || 0))}
								</div>

								{inst.gstAmount > 0 && (
									<div className="text-xs text-muted-foreground">
										GST Paid: {formatCurrency(inst.gstAmount)}
									</div>
								)}

								<div className="font-semibold text-emerald-600 dark:text-emerald-500 ">
									Total: {formatCurrency(inst.paidAmount)}
								</div>

								{inst.paidAt && (
									<div className="mt-0.5 text-xs font-normal text-muted-foreground">
										Paid At: {formatDate(inst.paidAt)}
									</div>
								)}
							</TableCell>
							<TableCell>
								<InstallmentStatusBadge status={inst.status} />
							</TableCell>
							<TableCell className="whitespace-nowrap">
								{inst.reminderSent && inst.lastReminderSentAt ? (
									<div className="text-xs">
										<span className="font-medium text-foreground">
											{formatDate(inst.lastReminderSentAt)}
										</span>
										{inst.lastReminderAmount > 0 && (
											<span className="text-muted-foreground">
												{" "}({formatCurrency(inst.lastReminderAmount)})
											</span>
										)}
										{inst.reminderDueDate && (
											<div className="text-muted-foreground">
												Due by {formatDate(inst.reminderDueDate)}
											</div>
										)}
									</div>
								) : (
									<span className="text-muted-foreground italic text-xs">Not sent</span>
								)}
							</TableCell>
							<TableCell>
								{inst.paymentMode
									? PAYMENT_MODE[inst.paymentMode] || inst.paymentMode
									: "-"}
							</TableCell>
							<TableCell>{inst.transactionId || "-"}</TableCell>
							{canPay && inst.status !== "paid" && (
								<TableCell>
									<Button size="sm" onClick={() => onPay(inst)}>
										Pay
									</Button>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}