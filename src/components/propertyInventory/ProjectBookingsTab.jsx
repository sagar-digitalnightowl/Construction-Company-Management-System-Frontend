import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	FileText,
	Search,
	Eye,
	CreditCard,
} from "lucide-react";

import { formatINR } from "@/lib/helpers";
import { TabsContent } from "../ui/tabs";

export default function ProjectBookingsTab({
	projectId,
	bookings,
	bookingsPagination,
	bookingSearch,
	setBookingSearch,
	fetchProjectBookings,
	handleBookingSearch,
	handleBookingPageChange,
	setSelectedBookingDetails,
	handleViewPayments,
}) {
	return (
		<TabsContent value="bookings">
			<div className="space-y-4">

				<div className="flex items-center gap-2 mb-4 bg-muted/20 p-3 rounded-lg border">
					<Input
						placeholder="Search by buyer name, email, phone, or flat no..."
						value={bookingSearch}
						onChange={(e) => {
							const value = e.target.value;

							setBookingSearch(value);

							// Clear search immediately when input becomes empty
							if (value.trim() === "") {
								fetchProjectBookings(projectId, {
									page: 1,
									limit: 10,
									search: "",
								});
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleBookingSearch();
							}
						}}
						className="max-w-md bg-white"
					/>

					<Button onClick={() => handleBookingSearch()}>
						<Search className="h-4 w-4 mr-2" />
						Search
					</Button>
				</div>

				{bookings.length ? (
					<div className="border rounded-lg overflow-hidden">
						<Table>
							<TableHeader className="bg-muted/50">
								<TableRow>
									<TableHead className="py-3 px-4 font-medium text-muted-foreground">Buyer Details</TableHead>
									<TableHead className="py-3 px-4 font-medium text-muted-foreground">Flat</TableHead>
									<TableHead className="py-3 px-4 font-medium text-muted-foreground">Booking Amount</TableHead>
									<TableHead className="py-3 px-4 font-medium text-muted-foreground">Payment Status</TableHead>
									<TableHead className="py-3 px-4 font-medium text-muted-foreground">Approval Status</TableHead>
									<TableHead className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{bookings.map((b) => (
									<TableRow key={b.id} className="hover:bg-muted/10 transition-colors">
										<TableCell className="py-3 px-4">
											<div className="font-medium text-foreground">{b.clientName}</div>
											<div className="text-xs text-muted-foreground">{b.clientEmail || b.clientDetails?.phone || "N/A"}</div>
										</TableCell>
										<TableCell className="py-3 px-4 font-medium">#{b.flatNumber}</TableCell>
										<TableCell className="py-3 px-4 font-semibold text-primary whitespace-nowrap">{formatINR(b.bookingAmount)}</TableCell>
										<TableCell className="py-3 px-4">
											<Badge variant="secondary" className="text-[10px] capitalize">{b.paymentStatus}</Badge>
										</TableCell>
										<TableCell className="py-3 px-4">
											<Badge variant="outline" className="text-[10px] capitalize">{b.approvalStatus}</Badge>
										</TableCell>
										<TableCell className="py-3 px-4 text-right">
											<div className="flex justify-end gap-2">
												{b.agreementDocumentUrl && (
													<Button
														variant="outline"
														size="sm"
														className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
														onClick={() => window.open(b.agreementDocumentUrl, '_blank')}
														title="View Agreement Document"
													>
														<FileText className="h-3.5 w-3.5 mr-1.5" /> Agreement
													</Button>
												)}
												<Button
													variant="outline"
													size="sm"
													className="h-8"
													onClick={() => setSelectedBookingDetails(b)}
												>
													<Eye className="h-3.5 w-3.5 mr-1.5" /> View
												</Button>
												<Button
													variant="default"
													size="sm"
													className="h-8"
													onClick={() => handleViewPayments(b.id)}
												>
													<CreditCard className="h-3.5 w-3.5 mr-1.5" /> Payments
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
						<p className="text-muted-foreground">No bookings found for this search/project.</p>
					</div>
				)}

				{/* Pagination */}
				{bookingsPagination?.total > 0 && (
					<div className="flex justify-between items-center py-2 px-1">
						<span className="text-sm text-muted-foreground">
							Page {bookingsPagination.page} of {bookingsPagination.pages} ({bookingsPagination.total} bookings)
						</span>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={bookingsPagination.page <= 1}
								onClick={() => handleBookingPageChange(bookingsPagination.page - 1)}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={bookingsPagination.page >= bookingsPagination.pages}
								onClick={() => handleBookingPageChange(bookingsPagination.page + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>
		</TabsContent>
	);
}