import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/helpers";

export default function ReminderDetailsDialog({
	reminder,
	open,
	onOpenChange,
}) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Reminder Details</DialogTitle>
				</DialogHeader>

				{reminder && (
					<div className="space-y-6">
						{/* Booking Details */}
						<div className="rounded-lg border p-4">
							<h3 className="mb-4 text-sm font-semibold">
								Booking Details
							</h3>

							<div className="grid grid-cols-2 gap-x-6 gap-y-4">
								<div>
									<p className="text-xs text-muted-foreground">
										Project
									</p>
									<p className="font-medium">
										{reminder.projectId?.name || "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Booking Reference
									</p>
									<p className="font-medium">
										{reminder.bookingId
											?.bookingReferenceNumber || "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Flat
									</p>
									<p className="font-medium">
										Flat{" "}
										{reminder.bookingId?.flatSnapshot
											?.flatNumber || "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Tower
									</p>
									<p className="font-medium">
										{reminder.bookingId?.flatSnapshot
											?.towerName || "—"}
									</p>
								</div>
							</div>
						</div>

						{/* Reminder Details */}
						<div className="rounded-lg border p-4">
							<h3 className="mb-4 text-sm font-semibold">
								Reminder Details
							</h3>

							<div className="grid grid-cols-2 gap-x-6 gap-y-4">
								<div>
									<p className="text-xs text-muted-foreground">
										Recipient
									</p>
									<p className="break-all font-medium">
										{reminder.recipient?.replace(
											/^\+/,
											""
										) || "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Channel
									</p>
									<p className="font-medium capitalize">
										{reminder.channel || "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Reminder Type
									</p>
									<p className="font-medium capitalize">
										{reminder.reminderType || "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Milestone
									</p>
									<p className="font-medium">
										{reminder.milestone || "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Installment
									</p>
									<p className="font-medium">
										{reminder.installmentNumber
											? `#${reminder.installmentNumber}`
											: "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Amount
									</p>
									<p className="font-medium">
										{reminder.amount > 0
											? `₹${reminder.amount.toLocaleString(
												"en-IN"
											)}`
											: "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Created At
									</p>
									<p className="font-medium">
										{reminder.createdAt
											? formatDate(reminder.createdAt)
											: "—"}
									</p>
								</div>

								<div>
									<p className="text-xs text-muted-foreground">
										Sent At
									</p>
									<p className="font-medium">
										{reminder.sentAt
											? formatDate(reminder.sentAt)
											: "—"}
									</p>
								</div>
							</div>
						</div>

						{/* Delivery Status */}
						<div className="rounded-lg border p-4">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-sm font-semibold">
									Delivery Status
								</h3>

								<span
									className={`rounded-full px-2.5 py-1 text-xs font-medium ${reminder.sent
										? "bg-green-100 text-green-700"
										: "bg-red-100 text-red-700"
										}`}
								>
									{reminder.sent ? "Sent" : "Failed"}
								</span>
							</div>

							{!reminder.sent && reminder.error && (
								<div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
									<p className="mb-1 font-semibold">
										Error
									</p>
									<p className="whitespace-pre-wrap break-words">
										{reminder.error}
									</p>
								</div>
							)}
						</div>

						{/* Subject */}
						{reminder.subject && (
							<div>
								<p className="mb-1 text-xs text-muted-foreground">
									Subject
								</p>

								<div className="rounded-md border bg-muted/30 p-3 text-sm font-medium">
									{reminder.subject}
								</div>
							</div>
						)}

						{/* Message */}
						<div>
							<p className="mb-1 text-xs text-muted-foreground">
								Message
							</p>

							<div className="max-h-80 overflow-y-auto rounded-md border bg-muted/30 p-4 text-sm leading-6">
								<p className="whitespace-pre-wrap">
									{reminder.message || "—"}
								</p>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}