
import React, { useState } from "react";
import { Eye, Receipt } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InstallmentStatusBadge } from "@/components/booking/InstallmentStatusBadge";
import { formatDate } from "@/lib/helpers";
import { PAYMENT_MODE } from "@/data/constants/booking";

export function FinanceInstallmentTable({ installments }) {
	const [selectedInstallment, setSelectedInstallment] = useState(null);

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
		<>
			<div className="rounded-lg border border-border/70 overflow-hidden shadow-sm overflow-x-auto">
				<Table>
					<TableHeader className="bg-muted/40">
						<TableRow>
							<TableHead className="w-16 font-semibold tracking-wide text-xs uppercase">#</TableHead>
							<TableHead className="font-semibold tracking-wide text-xs uppercase">Description</TableHead>
							<TableHead className="font-semibold tracking-wide text-xs uppercase">Due Date</TableHead>
							<TableHead className="font-semibold tracking-wide text-xs uppercase text-right">Amount</TableHead>
							<TableHead className="font-semibold tracking-wide text-xs uppercase text-right">Paid Amount</TableHead>
							<TableHead className="text-right">
								Remaining Amount
							</TableHead>
							<TableHead className="font-semibold tracking-wide text-xs uppercase">Status</TableHead>
							<TableHead className="font-semibold tracking-wide text-xs uppercase">Mode</TableHead>
							{/* <TableHead className="font-semibold tracking-wide text-xs uppercase">Transaction ID</TableHead> */}
							<TableHead className="font-semibold tracking-wide text-xs uppercase text-center">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{installments.map((inst) => (
							<TableRow key={inst._id} className="hover:bg-muted/30 transition-colors">
								<TableCell className="font-medium text-muted-foreground">
									{inst.installmentNumber}
								</TableCell>
								<TableCell className="min-w-[200px] whitespace-normal">
									{inst.description}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{inst.dueDate ? (
										<span className="font-medium text-foreground">{formatDate(inst.dueDate)}</span>
									) : (
										<span className="text-muted-foreground italic text-xs">Not scheduled</span>
									)}
								</TableCell>
								<TableCell className="text-right">
									{/* <div className="text-xs font-semibold text-muted-foreground">
										{formatCurrency(inst.baseAmount)}
									</div>

									{inst.gstAmount > 0 && (
										<div className="text-xs text-muted-foreground">
											GST: {formatCurrency(inst.gstAmount)}
										</div>
									)} */}

									<div className="font-semibold text-red-600 dark:text-red-500">
										{formatCurrency(inst.amount)}
									</div>

									{inst.dueDate && (
										<div className="mt-0.5 text-xs font-normal text-muted-foreground">
											Due: {formatDate(inst.dueDate)}
										</div>
									)}
								</TableCell>
								<TableCell className="text-right text-foreground">
									{/* <div className="text-muted-foreground">
										Amount Paid: {formatCurrency(inst.paidAmount - (inst.gstAmount || 0))}
									</div>

									{inst.gstAmount > 0 && (
										<div className="text-xs text-muted-foreground">
											GST Paid: {formatCurrency(inst.gstAmount)}
										</div>
									)} */}

									<div className="font-semibold text-emerald-600 dark:text-emerald-500 ">
										{formatCurrency(inst.paidAmount)}
									</div>

									{inst.paidAt && (
										<div className="mt-0.5 text-xs font-normal text-muted-foreground">
											Paid At: {formatDate(inst.paidAt)}
										</div>
									)}
								</TableCell>
								<TableCell className="text-right">
									{(() => {
										const remainingAmount = Math.max(
											0,
											Number(inst.amount || 0) - Number(inst.paidAmount || 0)
										);

										return remainingAmount > 0 ? (
											<div className="font-semibold text-amber-600 dark:text-amber-500">
												{formatCurrency(remainingAmount)}
											</div>
										) : (
											<span className="text-muted-foreground">-</span>
										);
									})()}
								</TableCell>
								<TableCell>
									<InstallmentStatusBadge status={inst.status} />
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{inst.paymentMode
										? PAYMENT_MODE[inst.paymentMode] || inst.paymentMode
										: "—"}
								</TableCell>
								{/* <TableCell className="font-mono text-xs text-muted-foreground tracking-wider">
									{inst.transactionId || "—"}
								</TableCell> */}
								<TableCell className="text-center">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setSelectedInstallment(inst)}
										className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
									>
										<Eye className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Installment Details Modal */}
			<Dialog open={!!selectedInstallment} onOpenChange={(open) => !open && setSelectedInstallment(null)}>
				<DialogContent className="sm:max-w-[550px] p-6">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
							<Receipt className="h-5 w-5 text-muted-foreground" />
							Installment Details
						</DialogTitle>
					</DialogHeader>

					{selectedInstallment && (() => {
						// Proper Receipt Calculation: Proportionally split paid amount into Base & GST
						let gstPaid = 0;
						let basePaid = 0;
						if (selectedInstallment.amount > 0 && selectedInstallment.paidAmount > 0) {
							gstPaid = Math.round((selectedInstallment.paidAmount * selectedInstallment.gstAmount) / selectedInstallment.amount);
							basePaid = selectedInstallment.paidAmount - gstPaid;
						}
						const pendingBalance = selectedInstallment.amount - selectedInstallment.paidAmount;

						return (
							<div className="space-y-6 pt-2 text-sm">
								{/* Header Info */}
								<div className="grid grid-cols-2 gap-4">
									<div>
										<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Installment #</span>
										<span className="font-semibold text-base">{selectedInstallment.installmentNumber}</span>
									</div>
									<div>
										<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Status</span>
										<div>
											<InstallmentStatusBadge status={selectedInstallment.status} />
										</div>
									</div>
									<div className="col-span-2">
										<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Description</span>
										<span className="font-semibold text-base">{selectedInstallment.description}</span>
									</div>
								</div>

								{/* Financial Summary Cards */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{/* Total Payable Card */}
									<div className="bg-card p-4 rounded-xl border border-border shadow-sm">
										<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Total Payable</span>
										<span className="font-bold text-2xl text-red-600 dark:text-red-500 block mb-3">
											{formatCurrency(selectedInstallment.amount)}
										</span>
										<div className="flex flex-col gap-1 text-[13px] text-muted-foreground">
											<span>Base Amount: <span className="font-medium text-foreground">{formatCurrency(selectedInstallment.baseAmount)}</span></span>
											{selectedInstallment.gstAmount > 0 && (
												<span>GST Applied: <span className="font-medium text-foreground">{formatCurrency(selectedInstallment.gstAmount)}</span></span>
											)}
										</div>
									</div>

									{/* Amount Paid Card */}
									<div className="bg-card p-4 rounded-xl border border-border shadow-sm">
										<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Amount Paid</span>
										<span className="font-bold text-2xl text-emerald-600 dark:text-emerald-500 block mb-3">
											{formatCurrency(selectedInstallment.paidAmount)}
										</span>
										<div className="flex flex-col gap-1 text-[13px] text-muted-foreground">
											<span>Pending Balance: <span className="font-semibold text-amber-600 dark:text-amber-500">{formatCurrency(pendingBalance)}</span></span>
											{selectedInstallment.paidAmount > 0 && (
												<>
													<span>Base Paid: <span className="font-medium text-foreground">{formatCurrency(basePaid)}</span></span>
													{selectedInstallment.gstAmount > 0 && (
														<span>GST Paid: <span className="font-medium text-foreground">{formatCurrency(gstPaid)}</span></span>
													)}
												</>
											)}
										</div>
									</div>
								</div>

								{/* Meta Information Grid */}
								<div className="grid grid-cols-2 gap-y-5 gap-x-4">
									{selectedInstallment.dueDate && (
										<div>
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Due Date</span>
											<span className="font-semibold">{formatDate(selectedInstallment.dueDate)}</span>
										</div>
									)}
									{selectedInstallment.unitNumber && (
										<div>
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Unit Number</span>
											<span className="font-semibold">{selectedInstallment.unitNumber}</span>
										</div>
									)}

									{selectedInstallment.paymentMode && (
										<div>
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Payment Mode</span>
											<span className="font-semibold">{PAYMENT_MODE?.[selectedInstallment.paymentMode] || selectedInstallment.paymentMode}</span>
										</div>
									)}
									{selectedInstallment.paidAt && (
										<div>
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Paid At</span>
											<span className="font-semibold">{formatDate(selectedInstallment.paidAt)}</span>
										</div>
									)}

									{selectedInstallment.receiptNumber && (
										<div>
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Receipt No.</span>
											<span className="font-semibold font-mono text-xs bg-muted px-2 py-1 rounded border border-border/60">
												{selectedInstallment.receiptNumber}
											</span>
										</div>
									)}
									{selectedInstallment.voucherNumber && (
										<div>
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Voucher No.</span>
											<span className="font-semibold font-mono text-xs">{selectedInstallment.voucherNumber}</span>
										</div>
									)}

									{selectedInstallment.transactionId && (
										<div className="col-span-2 sm:col-span-1">
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Transaction ID</span>
											<span className="font-semibold font-mono text-xs break-all">{selectedInstallment.transactionId}</span>
										</div>
									)}
									{selectedInstallment.bankName && (
										<div>
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Bank Name</span>
											<span className="font-semibold">{selectedInstallment.bankName}</span>
										</div>
									)}

									{selectedInstallment.chequeNumber && (
										<div>
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Cheque No.</span>
											<span className="font-semibold font-mono text-xs">{selectedInstallment.chequeNumber}</span>
										</div>
									)}
									{selectedInstallment.remarks && (
										<div className="col-span-2">
											<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Remarks</span>
											<p className="font-medium text-sm bg-muted/20 p-3 rounded-lg border border-border/40">
												{selectedInstallment.remarks}
											</p>
										</div>
									)}
								</div>

								{/* Reminder Information */}
								{selectedInstallment.status === "pending" && (
									<div className="border-t border-border/60 pt-5">
										<span className="block text-muted-foreground text-xs uppercase tracking-wider mb-3">
											Reminder Details
										</span>

										<div className="grid grid-cols-2 gap-y-5 gap-x-4">
											{selectedInstallment.reminderSent !== undefined && (
												<div>
													<span className="block text-muted-foreground text-xs mb-1">
														Reminder Status
													</span>
													<span
														className={`font-semibold ${selectedInstallment.reminderSent
															? "text-emerald-600 dark:text-emerald-500"
															: "text-muted-foreground"
															}`}
													>
														{selectedInstallment.reminderSent
															? "Sent"
															: "Not Sent"}
													</span>
												</div>
											)}

											{selectedInstallment.lastReminderSentAt && (
												<div>
													<span className="block text-muted-foreground text-xs mb-1">
														Last Reminder Sent
													</span>
													<span className="font-semibold">
														{formatDate(
															selectedInstallment.lastReminderSentAt
														)}
													</span>
												</div>
											)}

											{selectedInstallment.lastReminderAmount > 0 && (
												<div>
													<span className="block text-muted-foreground text-xs mb-1">
														Reminder Amount
													</span>
													<span className="font-semibold text-amber-600 dark:text-amber-500">
														{formatCurrency(
															selectedInstallment.lastReminderAmount
														)}
													</span>
												</div>
											)}

											{selectedInstallment.reminderDueDate && (
												<div>
													<span className="block text-muted-foreground text-xs mb-1">
														Reminder Due Date
													</span>
													<span className="font-semibold">
														{formatDate(
															selectedInstallment.reminderDueDate
														)}
													</span>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						);
					})()}
				</DialogContent>
			</Dialog>
		</>
	);
}