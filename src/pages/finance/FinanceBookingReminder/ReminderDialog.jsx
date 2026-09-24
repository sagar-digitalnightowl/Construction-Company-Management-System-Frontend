import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function ReminderDialog({
	reminderOpen,
	setReminderOpen,
	reminderType,
	reminderData,
	setReminderData,
	reminderBooking,
	loading,
	handleSendReminder,
	calculateArrear,
	fmtReminderAmount,
}) {
	return (
		<Dialog
			open={!!reminderOpen}
			onOpenChange={(v) => !v && setReminderOpen(null)}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{reminderType === "normal"
							? "Send Normal Email Reminder"
							: reminderType === "penalty"
								? "Send Penalty Email Reminder"
								: "Send WhatsApp Reminder"}
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-3">
					{/* Show confirmation text for WhatsApp */}
					{reminderType === "whatsapp" ? (
						<div className="space-y-4">
							<div className="text-sm text-muted-foreground">
								<p>Are you sure you want to send a WhatsApp payment reminder to this client?</p>
								<p className="mt-2 text-amber-600 font-medium">This will immediately send a message to their registered mobile number.</p>
							</div>

							{/* ✅ Added Language Selector */}
							<div className="space-y-1.5">
								<Label>Message Language</Label>
								<Select
									value={reminderData.language}
									onValueChange={(val) => setReminderData({ ...reminderData, language: val })}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select Language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en">English</SelectItem>
										<SelectItem value="hi">Hindi</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					) : (
						/* Show inputs for Email Reminders */
						<>
							{reminderType === "normal" && (
								<div className="space-y-1.5">
									<Label>Milestone Name (optional)</Label>
									<Input
										placeholder="e.g. 2nd Slab Casting"
										value={reminderData.milestoneName}
										onChange={(e) =>
											setReminderData({
												...reminderData,
												milestoneName: e.target.value,
											})
										}
									/>
								</div>
							)}

							{reminderType !== "whatsapp" && reminderBooking && (() => {
								const pendingInstallment = reminderBooking.installments?.find(
									(i) => i.status === "pending",
								);

								if (!pendingInstallment) return null;

								const currentAmount = Math.max(
									0,
									Number(pendingInstallment.amount || 0) -
									Number(pendingInstallment.paidAmount || 0),
								);

								const arrear = calculateArrear(
									reminderBooking.installments,
									pendingInstallment.installmentNumber,
								);

								const totalDue = currentAmount + arrear;

								return (
									<div className="rounded-lg border bg-muted/30 p-3 space-y-2">
										<div className="text-sm font-medium">
											Reminder Amount
										</div>

										<div className="space-y-1 text-sm">
											<div className="flex justify-between gap-4">
												<span className="text-muted-foreground">
													Current installment
												</span>
												<span className="tabular-nums">
													{fmtReminderAmount(currentAmount)}
												</span>
											</div>

											{arrear > 0 && (
												<div className="flex justify-between gap-4">
													<span className="text-muted-foreground">
														Previous outstanding
													</span>
													<span className="text-destructive tabular-nums">
														{fmtReminderAmount(arrear)}
													</span>
												</div>
											)}

											<div className="border-t pt-2 flex justify-between gap-4">
												<span className="font-medium">
													Total reminder amount
												</span>
												<span className="font-semibold tabular-nums">
													{fmtReminderAmount(totalDue)}
												</span>
											</div>
										</div>

										{arrear > 0 && (
											<p className="text-xs text-amber-600">
												Previous outstanding amount will be included in this
												reminder.
											</p>
										)}
									</div>
								);
							})()}

							<div className="space-y-1.5">
								<Label>Due Date (optional)</Label>
								<Input
									type="date"
									value={reminderData.dueDate}
									onChange={(e) =>
										setReminderData({ ...reminderData, dueDate: e.target.value })
									}
								/>
							</div>
						</>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setReminderOpen(null)}>
						Cancel
					</Button>
					<Button
						onClick={() => handleSendReminder(reminderOpen)}
						disabled={loading}
						className={reminderType === "whatsapp" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
					>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Yes, Send
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}