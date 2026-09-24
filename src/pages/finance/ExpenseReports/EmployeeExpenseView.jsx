import { StatCard } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { renderStatus } from "./expenseReportHelpers";

export function EmployeeExpenseView({
	employeeExpenseReport,
	loading,
	selectedEmployee,
	formatINR,
	formatDate,
}) {
	return (
		<div className="space-y-6">
			{loading && selectedEmployee ? (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<Skeleton className="h-24" /><Skeleton className="h-24" />
					<Skeleton className="h-24" /><Skeleton className="h-24" />
				</div>
			) : employeeExpenseReport ? (
				<>
					{/* Employee Info Header */}
					<div className="flex flex-col gap-1 p-4 bg-muted/20 border border-dashed rounded-xl">
						<h3 className="text-xl font-bold text-foreground">{employeeExpenseReport.employee?.name}</h3>
						<p className="text-sm text-muted-foreground font-medium">{employeeExpenseReport.employee?.email} • {employeeExpenseReport.employee?.phone || "N/A"}</p>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Total Tickets"
								value={employeeExpenseReport.totalTickets || 0}
								accent="info"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Total Expense"
								value={formatINR(employeeExpenseReport.totalAmount || 0)}
								accent="info"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Paid"
								value={formatINR(employeeExpenseReport.totalPaid || 0)}
								accent="success"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Pending"
								value={formatINR(employeeExpenseReport.pendingAmount || 0)}
								accent="warning"
							/>
						</div>
					</div>

					{/* Tickets Table */}
					<Card className="overflow-hidden border-border shadow-sm">
						<div className="bg-muted/30 px-4 py-3 border-b"><h3 className="font-semibold text-sm text-foreground">Expense Tickets</h3></div>
						<CardContent className="p-0">
							<Table>
								<TableHeader className="bg-muted/10">
									<TableRow className="hover:bg-transparent">
										<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
											Date
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
									{employeeExpenseReport.tickets?.length > 0 ? (
										employeeExpenseReport.tickets.map((ticket) => (
											<TableRow
												key={ticket._id}
												className="group transition-colors hover:bg-muted/40"
											>
												<TableCell className="whitespace-nowrap font-medium tabular-nums text-foreground">
													{formatDate(ticket.createdAt)}
												</TableCell>

												<TableCell className="whitespace-nowrap font-medium text-muted-foreground">
													{ticket.categoryId?.name || "—"}
												</TableCell>

												<TableCell className="min-w-[160px] max-w-[200px]">
													<div className="truncate font-medium text-muted-foreground">
														{ticket.projectId?.name || "—"}
													</div>
												</TableCell>

												<TableCell
													className="min-w-[200px] max-w-[280px] truncate text-xs text-muted-foreground"
													title={ticket.description}
												>
													{ticket.title || "—"}
												</TableCell>

												<TableCell className="whitespace-nowrap text-right font-bold tabular-nums text-foreground">
													{formatINR(ticket.amount)}
												</TableCell>

												<TableCell className="whitespace-nowrap text-right">
													{renderStatus(ticket.paymentStatus || ticket.status)}
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
					</Card>
				</>
			) : (
				<div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">No expenses found for this employee.</div>
			)}
		</div>
	)
}