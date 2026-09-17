import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { formatINR, formatDate } from "@/lib/helpers";

export function ReminderHistoryModal({
	open,
	onOpenChange,
	loading,
	data,
	type,
	pagination,
	onPageChange,
}) {
	// type: "booking" | "installment" — response shapes differ slightly
	const reminders = data?.reminders || [];
	const header = type === "booking" ? data?.booking : data?.installment;
	const summary =
		type === "booking"
			? data?.summary
			: { totalReminders: data?.totalReminders, sent: data?.sent, failed: data?.failed };

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Reminder History</DialogTitle>
				</DialogHeader>

				{loading && (
					<div className="space-y-2 py-4">
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-6 w-full" />
					</div>
				)}

				{!loading && data && (
					<>
						<div className="space-y-4">
							{type === "booking" ? (
								<div className="rounded-lg border bg-muted/30 p-3 text-sm">
									<div className="font-semibold">{header?.clientName}</div>
									<div className="text-xs text-muted-foreground">
										{header?.reference} · Flat {header?.flatNumber} · {header?.towerName}
									</div>
									<div className="text-xs text-muted-foreground">{header?.projectName}</div>
								</div>
							) : (
								<div className="rounded-lg border bg-muted/30 p-3 text-sm">
									<div className="font-semibold">
										{header?.description || `Installment #${header?.number}`}
									</div>
									<div className="text-xs text-muted-foreground">
										Amount: {formatINR(header?.amount)} · Due: {formatINR(header?.dueAmount)}
									</div>
									<div className="text-xs text-muted-foreground">
										Agreement Due:{" "}
										{header?.agreementDueDate ? formatDate(header.agreementDueDate) : "—"}
									</div>
									<div className="text-xs text-muted-foreground">
										Reminder Due:{" "}
										{header?.reminderDueDate ? formatDate(header.reminderDueDate) : "—"}
									</div>
									<div className="text-xs text-muted-foreground">
										Last Reminder:{" "}
										{header?.lastReminderSentAt ? formatDate(header.lastReminderSentAt) : "—"}
										{header?.lastReminderAmount > 0
											? ` · ${formatINR(header.lastReminderAmount)}`
											: ""}
									</div>
									<div className="text-xs text-muted-foreground">
										Status:{" "}
										<span
											className={`capitalize font-medium ${header?.status?.toLowerCase() === "paid"
													? "text-success"
													: header?.status?.toLowerCase() === "overdue"
														? "text-destructive"
														: "text-amber-600"
												}`}
										>
											{header?.status}
										</span>
									</div>
								</div>
							)}

							<div className="flex gap-4 text-xs text-muted-foreground">
								<span>Total: {summary?.totalReminders ?? 0}</span>
								<span className="text-success">Sent: {summary?.sent ?? 0}</span>
								<span className="text-destructive">Failed: {summary?.failed ?? 0}</span>
							</div>

							<div className="max-h-80 overflow-y-auto space-y-2">
								{reminders.length === 0 && (
									<p className="text-center text-sm text-muted-foreground py-6">
										No reminders sent yet.
									</p>
								)}

								<TooltipProvider>
									{reminders.map((r) => {
										const reminderTitle =
											r.installmentDescription ||
											(r.installmentNumber ? `Installment #${r.installmentNumber}` : null) ||
											r.milestone ||
											(r.reminderType
												? `${r.reminderType.charAt(0).toUpperCase()}${r.reminderType.slice(1)} Reminder`
												: "Reminder");
										const showMilestoneLine = r.milestone && r.milestone !== reminderTitle;

										return (
											<div
												key={r.id}
												className="flex items-start justify-between gap-3 rounded-lg border p-3 text-sm"
											>
												<div className="flex items-start gap-2">
													{r.channel === "whatsapp" ? (
														<MessageCircle className="h-4 w-4 mt-0.5 text-green-600" />
													) : (
														<Mail className="h-4 w-4 mt-0.5 text-primary" />
													)}
													<div>
														<div className="font-medium">
															{reminderTitle}
														</div>
														{showMilestoneLine && (
															<div className="text-xs text-muted-foreground">
																{r.milestone}
															</div>
														)}
														<div className="text-xs text-muted-foreground">
															To: {r.recipient}
															{r.amount > 0 ? ` · ${formatINR(r.amount)}` : ""}
														</div>
														<div className="text-[11px] text-muted-foreground">
															{r.sentAt ? formatDate(r.sentAt) : "—"}
															{r.reminderType && r.reminderType !== "normal" ? ` · ${r.reminderType}` : ""}
														</div>
													</div>
												</div>

												{r.sent ? (
													<Badge className="bg-success/10 text-success border-none">Sent</Badge>
												) : (
													<Tooltip>
														<TooltipTrigger asChild>
															<Badge variant="destructive" className="cursor-help">
																Failed
															</Badge>
														</TooltipTrigger>
														<TooltipContent>{r.error || "Unknown error"}</TooltipContent>
													</Tooltip>
												)}
											</div>
										);
									})}
								</TooltipProvider>
							</div>
						</div>

						{pagination && pagination.pages > 1 && (
							<div className="flex items-center justify-between pt-2 border-t">
								<p className="text-xs text-muted-foreground">
									Page {pagination.page} of {pagination.pages} · {pagination.total} total
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => onPageChange?.(pagination.page - 1)}
										disabled={pagination.page <= 1 || loading}
									>
										<ChevronLeft className="h-4 w-4 mr-1" />
										Prev
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onPageChange?.(pagination.page + 1)}
										disabled={pagination.page >= pagination.pages || loading}
									>
										Next
										<ChevronRight className="h-4 w-4 ml-1" />
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}