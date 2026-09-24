import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
	BookOpen,
	FileText,
	User,
	IndianRupee,
	Calendar,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/helpers";

export default function BookingDetailsDialog({
	selectedBookingDetails,
	setSelectedBookingDetails,
}) {
	return (
		<Dialog
			open={!!selectedBookingDetails}
			onOpenChange={() => setSelectedBookingDetails(null)}
		>
			<DialogContent
				className="
						w-[calc(100%-1rem)]
						sm:w-[calc(100%-2rem)]
						max-w-3xl
						max-h-[90vh]
						overflow-y-auto
						p-4
						sm:p-6
						rounded-xl
					"
			>
				<DialogHeader className="border-b pb-4 mb-4">
					<DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-lg sm:text-xl">
						<span className="flex items-center gap-2 min-w-0">
							<BookOpen className="h-5 w-5 text-primary shrink-0" />
							<span className="truncate">
								Booking Overview
								{selectedBookingDetails?.flatNumber
									? ` (Flat #${selectedBookingDetails.flatNumber})`
									: ""}
							</span>
						</span>

						{selectedBookingDetails?.status && (
							<Badge
								variant="default"
								className="capitalize w-fit shrink-0"
							>
								{selectedBookingDetails.status}
							</Badge>
						)}
					</DialogTitle>
				</DialogHeader>

				{selectedBookingDetails && (
					<div className="space-y-4 sm:space-y-6">

						{/* CLIENT + FINANCIAL INFORMATION */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

							{/* Client Information */}
							<div className="border rounded-xl p-4 sm:p-5 bg-muted/10 min-w-0">
								<div className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-4 text-primary border-b pb-2">
									<User className="h-4 w-4 shrink-0" />
									<span>Client Information</span>
								</div>

								<div className="space-y-3 text-sm">

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
										<span className="text-muted-foreground font-medium">
											Name:
										</span>

										<span className="sm:col-span-2 font-semibold break-words">
											{selectedBookingDetails.clientName || "N/A"}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
										<span className="text-muted-foreground font-medium">
											Email:
										</span>

										<span className="sm:col-span-2 break-all">
											{selectedBookingDetails.clientEmail || "N/A"}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
										<span className="text-muted-foreground font-medium">
											Phone:
										</span>

										<span className="sm:col-span-2 break-words">
											{selectedBookingDetails.clientDetails?.phone || "N/A"}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 pt-2 mt-2 border-t">
										<span className="text-muted-foreground font-medium">
											Booking Date:
										</span>

										<span className="sm:col-span-2">
											{selectedBookingDetails.bookingDate
												? formatDate(selectedBookingDetails.bookingDate)
												: "N/A"}
										</span>
									</div>

									{selectedBookingDetails.agreementDocumentUrl && (
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 pt-2 mt-2 border-t">
											<span className="text-muted-foreground font-medium">
												Agreement:
											</span>

											<span className="sm:col-span-2">
												<a
													href={selectedBookingDetails.agreementDocumentUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="
                                                text-blue-600
                                                hover:underline
                                                inline-flex
                                                items-center
                                                gap-1
                                                max-w-full
                                            "
												>
													<FileText className="h-3.5 w-3.5 shrink-0" />
													<span>View Document</span>
												</a>
											</span>
										</div>
									)}
								</div>
							</div>

							{/* Financial Summary */}
							<div className="border rounded-xl p-4 sm:p-5 bg-muted/10 min-w-0">
								<div className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-4 text-primary border-b pb-2">
									<IndianRupee className="h-4 w-4 shrink-0" />
									<span>Financial Summary</span>
								</div>

								<div className="space-y-3 text-sm">

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
										<span className="text-muted-foreground font-medium">
											Total Booking Amount:
										</span>

										<span className="font-bold text-base sm:text-right">
											{formatINR(selectedBookingDetails.bookingAmount)}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-green-600">
										<span className="font-medium">
											Total Paid:
										</span>

										<span className="font-bold sm:text-right">
											{formatINR(selectedBookingDetails.totalPaid)}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-red-500 pb-2 mb-2 border-b">
										<span className="font-medium">
											Remaining Amount:
										</span>

										<span className="font-bold sm:text-right">
											{formatINR(selectedBookingDetails.remainingAmount)}
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 items-center">
										<span className="text-muted-foreground font-medium">
											Payment Status:
										</span>

										<span className="sm:text-right">
											<Badge
												variant="outline"
												className="capitalize"
											>
												{selectedBookingDetails.paymentStatus || "N/A"}
											</Badge>
										</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 items-center">
										<span className="text-muted-foreground font-medium">
											Approval Status:
										</span>

										<span className="sm:text-right">
											<Badge
												variant="secondary"
												className="capitalize"
											>
												{selectedBookingDetails.approvalStatus || "N/A"}
											</Badge>
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* NEXT INSTALLMENT */}
						{(selectedBookingDetails.nextInstallmentAmount > 0 ||
							selectedBookingDetails.nextInstallmentDue) && (
								<div
									className="
											border
											rounded-xl
											p-4
											sm:p-5
											bg-blue-50/50
											dark:bg-blue-900/10
											border-blue-100
											dark:border-blue-800
										"
								>
									<div className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-4 text-blue-700 dark:text-blue-400">
										<Calendar className="h-4 w-4 shrink-0" />
										<span>Next Installment Details</span>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-sm">

										<div>
											<span className="text-muted-foreground block mb-1">
												Due Amount
											</span>

											<span className="font-bold text-lg text-foreground">
												{formatINR(
													selectedBookingDetails.nextInstallmentAmount
												)}
											</span>
										</div>

										{selectedBookingDetails.nextInstallmentDue && (
											<div>
												<span className="text-muted-foreground block mb-1">
													Due Date
												</span>

												<span className="font-semibold text-base text-foreground">
													{formatDate(selectedBookingDetails.nextInstallmentDue)}
												</span>
											</div>
										)}
									</div>
								</div>
							)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}