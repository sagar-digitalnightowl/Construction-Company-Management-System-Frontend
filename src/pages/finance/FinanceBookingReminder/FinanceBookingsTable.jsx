import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatINR } from "@/lib/helpers";
import { AlertTriangle, Mail, MessageCircle } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Search, History } from "lucide-react";
import { toast } from "sonner";

export function FinanceBookingsTable({
	bookings,
	loading,
	openBookingHistory,
	openInstallmentHistory,
	openReminderDialog,
	searchQuery,
	clearSearch
}) {
	return (
		<Card className="overflow-hidden border-border shadow-sm">
			<CardContent className="p-0">
				<Table>
					<TableHeader className="bg-muted/30">
						<TableRow className="hover:bg-transparent">
							<TableHead className="font-semibold text-muted-foreground">Buyer Details</TableHead>
							<TableHead className="font-semibold text-muted-foreground">
								Property Details
							</TableHead>

							<TableHead className="text-right w-[180px] min-w-[180px] text-nowrap font-semibold text-muted-foreground">
								Total Paid
							</TableHead>
							<TableHead className="text-right text-nowrap font-semibold text-muted-foreground">
								Remaining
							</TableHead>
							<TableHead className="text-nowrap font-semibold text-muted-foreground">Next Installment</TableHead>
							<TableHead className="text-center text-nowrap font-semibold text-muted-foreground">
								History
							</TableHead>
							<TableHead className="text-right text-nowrap font-semibold text-muted-foreground">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading && (
							<TableRow>
								<TableCell colSpan={7}>
									<div className="flex items-center gap-4 py-2">
										<Skeleton className="h-10 w-full" />
										<Skeleton className="h-10 w-full" />
										<Skeleton className="h-10 w-full" />
										<Skeleton className="h-10 w-full" />
										<Skeleton className="h-10 w-full" />
										<Skeleton className="h-10 w-full" />
										<Skeleton className="h-10 w-full" />
									</div>
								</TableCell>
							</TableRow>
						)}

						{!loading && !searchQuery && bookings.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
									<div className="flex flex-col items-center justify-center gap-2">
										<span className="text-2xl opacity-40">📄</span>
										<p>No bookings found.</p>
									</div>
								</TableCell>
							</TableRow>
						)}

						{!loading && searchQuery && bookings.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-12">
									<div className="flex flex-col items-center gap-3">
										<div className="bg-muted p-3 rounded-full">
											<Search className="h-6 w-6 text-muted-foreground" />
										</div>
										<p className="text-muted-foreground">No bookings found matching "<span className="font-medium text-foreground">{searchQuery}</span>"</p>
										<Button variant="outline" size="sm" onClick={clearSearch} className="mt-2">
											Clear search
										</Button>
									</div>
								</TableCell>
							</TableRow>
						)}

						{!loading && bookings.map((b) => (
							<TableRow key={b.bookingId} className="group hover:bg-muted/40 transition-colors cursor-default">
								<TableCell>
									<div className="font-semibold text-foreground">{b.buyer?.name}</div>
									<div className="text-[11px] text-muted-foreground mt-0.5 text-nowrap">
										{b.buyer?.email}
									</div>
									{b.buyer?.phone && (
										<div className="text-[11px] text-muted-foreground">
											{b.buyer.phone}
										</div>
									)}
								</TableCell>
								<TableCell className="min-w-[200px]">
									<div className="flex flex-col text-xs">
										{/* Flat */}
										<div>
											Flat: {b.flat?.flatNumber || "—"}
										</div>

										{/* Floor */}
										<div>
											Floor: {b.flat?.floor || "—"}
										</div>

										{/* Tower */}
										<div>
											Tower: {b.flat?.tower || "—"}
										</div>

										{/* Project */}
										<div className="text-muted-foreground">
											Project: {b.projectName || "N/A"}
										</div>
									</div>
								</TableCell>
								<TableCell className="text-right w-[180px] min-w-[180px] font-medium tabular-nums">
									<div>
										Amount Paid: {formatINR(b.totalPaid - (b.gstPaid || 0))}
									</div>

									{b.gstPaid > 0 && (
										<div className="text-xs text-muted-foreground">
											GST Paid: {formatINR(b.gstPaid)}
										</div>
									)}

									<div className="font-semibold text-success">
										Total: {formatINR(b.totalPaid)}
									</div>
								</TableCell>
								<TableCell className="text-right font-bold text-destructive tabular-nums">
									{formatINR(b.remainingAmount)}
								</TableCell>
								<TableCell className="text-xs whitespace-nowrap">
									{b.installmentSummary?.pendingInstallments > 0 ? (
										(() => {
											const nextInstallment = b.installments?.find(
												(i) => i.status === "pending"
											);

											return nextInstallment ? (
												<div className="flex flex-col gap-0.5 whitespace-nowrap">
													<span className="font-semibold text-foreground tabular-nums whitespace-nowrap">
														{formatINR(nextInstallment.amount)}
													</span>

													<span className="text-[11px] text-muted-foreground whitespace-nowrap">
														Reminder Due:{" "}
														{nextInstallment.reminderDueDate
															? formatDate(nextInstallment.reminderDueDate)
															: "—"}
													</span>

													<span className="text-[11px] text-muted-foreground whitespace-nowrap">
														Last Reminder:{" "}
														{nextInstallment.lastReminderSentAt
															? formatDate(nextInstallment.lastReminderSentAt)
															: "—"}
													</span>

													<span className="text-[11px] text-muted-foreground whitespace-nowrap">
														Last Reminder Amount:{" "}
														{formatINR(nextInstallment.lastReminderAmount || 0)}
													</span>
												</div>
											) : (
												<Badge variant="secondary" className="whitespace-nowrap">
													No Pending Installment
												</Badge>
											);
										})()
									) : (
										<Badge
											variant="secondary"
											className="bg-success/10 text-success border-none hover:bg-success/20 pointer-events-none whitespace-nowrap"
										>
											All Paid
										</Badge>
									)}
								</TableCell>
								<TableCell>
									<div className="flex flex-col items-center gap-1">
										<button
											type="button"
											onClick={() => openBookingHistory(b.bookingId)}
											className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer whitespace-nowrap"
										>
											<History className="h-3.5 w-3.5" />
											View Reminder History
										</button>

										<button
											type="button"
											onClick={() => {
												const pendingInstallment = b.installments?.find(
													(i) => i.status === "pending"
												);

												if (pendingInstallment) {
													openInstallmentHistory(
														pendingInstallment._id || pendingInstallment.id
													);
												} else {
													toast.error("No pending installment found.");
												}
											}}
											className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer whitespace-nowrap"
										>
											<History className="h-3.5 w-3.5" />
											View Installment History
										</button>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex gap-1.5 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
										{/* Email - Normal */}
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
											title="Send Normal Reminder"
											onClick={() => openReminderDialog(b.bookingId, "normal", null, b)}
											disabled={!b.buyer?.email}
										>
											<Mail className="h-4 w-4" />
										</Button>

										{/* Email - Penalty */}
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
											title="Send Penalty Reminder"
											onClick={() => openReminderDialog(b.bookingId, "penalty", null, b)}
											disabled={!b.buyer?.email}
										>
											<AlertTriangle className="h-4 w-4 text-destructive/80" />
										</Button>

										{/* WhatsApp Reminder */}
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 hover:bg-green-600/10 hover:text-green-600 transition-colors"
											title="Send WhatsApp Reminder"
											onClick={() => {
												const pendingInstallment = b.installments?.find(
													(i) => i.status === "pending"
												);

												if (pendingInstallment) {
													const id = pendingInstallment._id || pendingInstallment.id;
													openReminderDialog(
														b.bookingId,
														"whatsapp",
														{ installmentId: id },
														b,
													);
												} else {
													toast.error("No pending installment found to send reminder.");
												}
											}}
											disabled={!b.buyer?.phone || b.installmentSummary?.pendingInstallments === 0 || loading}
										>
											<MessageCircle className="h-4 w-4 text-green-600/80" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}