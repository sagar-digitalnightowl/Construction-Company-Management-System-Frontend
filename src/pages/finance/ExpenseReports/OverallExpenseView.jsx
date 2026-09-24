import { StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { renderStatus } from "./expenseReportHelpers";

export function OverallExpenseView({
	expenseSummary,
	expenseSummaryPagination,
	loading,
	setCurrentPage,
	formatINR,
	formatDate,
}) {
	return (
		<div className="space-y-6">
			{loading && !expenseSummary ? (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<Skeleton className="h-24" /><Skeleton className="h-24" />
					<Skeleton className="h-24" /><Skeleton className="h-24" />
				</div>
			) : expenseSummary ? (
				<>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Total Tickets"
								value={expenseSummary.totalTickets || 0}
								accent="info"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Total Expense"
								value={formatINR(expenseSummary.totalAmount || 0)}
								accent="info"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Total Paid"
								value={formatINR(expenseSummary.totalPaid || 0)}
								accent="success"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Pending Amount"
								value={formatINR(expenseSummary.pendingAmount || 0)}
								accent="warning"
							/>
						</div>
					</div>

					{/* Full Width All Expense Tickets Table */}
					<Card className="overflow-hidden border-border shadow-sm">
						<div className="bg-muted/30 px-4 py-3 border-b"><h3 className="font-semibold text-sm text-foreground">All Expense Tickets</h3></div>
						<CardContent className="p-0">
							<Table>
								<TableHeader className="bg-muted/10">
									<TableRow className="hover:bg-transparent">
										<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
											Date
										</TableHead>

										<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
											Employee
										</TableHead>

										<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
											Category
										</TableHead>

										<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
											Project
										</TableHead>

										<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
											Description
										</TableHead>

										<TableHead className="whitespace-nowrap text-right font-semibold text-muted-foreground">
											Amount
										</TableHead>

										<TableHead className="whitespace-nowrap text-right font-semibold text-muted-foreground">
											Status
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{expenseSummary.tickets?.length > 0 ? (
										expenseSummary.tickets.map((ticket) => (
											<TableRow
												key={ticket.id}
												className="group transition-colors hover:bg-muted/40"
											>
												<TableCell className="whitespace-nowrap font-medium tabular-nums text-foreground">
													{formatDate(ticket.createdAt)}
												</TableCell>

												<TableCell className="whitespace-nowrap">
													<div className="font-medium text-muted-foreground">
														{ticket.employeeName || "—"}
													</div>
												</TableCell>

												<TableCell className="whitespace-nowrap font-medium text-muted-foreground">
													{ticket.categoryName || "—"}
												</TableCell>

												<TableCell className="min-w-[160px] max-w-[200px]">
													<div className="truncate font-medium text-muted-foreground">
														{ticket.projectName || "—"}
													</div>
												</TableCell>

												<TableCell
													className="min-w-[200px] max-w-[280px] truncate text-xs text-muted-foreground"
													title={ticket.description}
												>
													{ticket.description || "—"}
												</TableCell>

												<TableCell className="whitespace-nowrap text-right font-bold tabular-nums text-foreground">
													{formatINR(ticket.amount)}
												</TableCell>

												<TableCell className="whitespace-nowrap text-right">
													{renderStatus(ticket.paymentStatus)}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No tickets found.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>

						{/* Pagination Controls */}
						{expenseSummaryPagination && expenseSummaryPagination.pages > 1 && (
							<div className="flex justify-between items-center px-4 py-3 border-t bg-muted/10">
								<span className="text-sm text-muted-foreground">
									Page {expenseSummaryPagination.page} of {expenseSummaryPagination.pages}
								</span>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										disabled={expenseSummaryPagination.page <= 1}
										onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
									>
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										disabled={expenseSummaryPagination.page >= expenseSummaryPagination.pages}
										onClick={() => setCurrentPage((prev) => prev + 1)}
									>
										Next
									</Button>
								</div>
							</div>
						)}
					</Card>
				</>
			) : (
				<div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">No summary data available.</div>
			)}
		</div>
	)
}