import { StatCard } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, ChevronRight, Users } from "lucide-react";

export function ProjectExpenseView({
	projects,
	selectedProject,
	setSelectedProject,
	fetchProjectExpenseReport,
	projectExpenseReport,
	loading,
	setCurrentView,
	setEmpProjectFilter,
	setSelectedEmployee,
	fetchEmployeeExpenseReport,
	formatINR,
}) {
	return (
		<div className="space-y-6">
			<div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4 w-full md:w-auto">
				<span className="text-sm font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline-block">Select Project:</span>
				<Select
					value={selectedProject}
					onValueChange={(val) => {
						setSelectedProject(val);
						fetchProjectExpenseReport(val);
					}}
				>
					<SelectTrigger className="w-full sm:w-80 bg-background border-border/50">
						<SelectValue placeholder="Choose a project..." />
					</SelectTrigger>
					<SelectContent>
						{projects.map((p) => (
							<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{loading && selectedProject ? (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<Skeleton className="h-24" /><Skeleton className="h-24" />
					<Skeleton className="h-24" /><Skeleton className="h-24" />
				</div>
			) : projectExpenseReport ? (
				<>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Tickets"
								value={projectExpenseReport.totalTickets || 0}
								accent="info"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Total Expense"
								value={formatINR(projectExpenseReport.totalAmount || 0)}
								accent="info"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Paid"
								value={formatINR(projectExpenseReport.totalPaid || 0)}
								accent="success"
							/>
						</div>
						<div className="bg-white dark:bg-card rounded-xl shadow-sm">
							<StatCard
								size="compact"
								label="Pending"
								value={formatINR(projectExpenseReport.pendingAmount || 0)}
								accent="warning"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Employee Breakdown */}
						<Card className="overflow-hidden border-border shadow-sm h-full">
							<div className="bg-muted/30 px-4 py-3 border-b">
								<h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
									<Users className="h-4 w-4" /> Employee Breakdown
								</h3>
							</div>
							<CardContent className="p-0">
								<Table>
									<TableHeader className="bg-muted/10">
										<TableRow className="hover:bg-transparent">
											<TableHead className="font-semibold text-muted-foreground">Employee</TableHead>
											<TableHead className="text-right font-semibold text-muted-foreground">Tickets</TableHead>
											<TableHead className="text-right font-semibold text-muted-foreground">Expense</TableHead>
											<TableHead className="w-8"></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{projectExpenseReport.byEmployee?.length > 0 ? (
											projectExpenseReport.byEmployee.map((emp) => {
												const empId = emp.employee?._id || emp.employee?.id;
												return (
													<TableRow
														key={empId || "unknown"}
														className="group hover:bg-muted/40 transition-colors cursor-pointer"
														onClick={() => {
															setCurrentView("employee");
															setEmpProjectFilter(selectedProject);
															setSelectedEmployee(empId);
															fetchEmployeeExpenseReport(empId, selectedProject);
														}}
													>
														<TableCell>
															<div className="font-medium text-foreground">{emp.employee?.name || "—"}</div>
															<div className="text-[11px] text-muted-foreground">{emp.employee?.email}</div>
														</TableCell>
														<TableCell className="text-right tabular-nums">{emp.ticketCount}</TableCell>
														<TableCell className="text-right font-medium tabular-nums text-foreground">{formatINR(emp.totalExpense)}</TableCell>
														<TableCell className="text-right">
															<ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all inline-block" />
														</TableCell>
													</TableRow>
												);
											})
										) : (
											<TableRow>
												<TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No employee data found.</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>

						{/* Category Breakdown */}
						<Card className="overflow-hidden border-border shadow-sm h-full">
							<div className="bg-muted/30 px-4 py-3 border-b"><h3 className="font-semibold text-sm text-foreground flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Category Breakdown</h3></div>
							<CardContent className="p-0">
								<Table>
									<TableHeader className="bg-muted/10">
										<TableRow className="hover:bg-transparent">
											<TableHead className="font-semibold text-muted-foreground">Category</TableHead>
											<TableHead className="text-right font-semibold text-muted-foreground">Tickets</TableHead>
											<TableHead className="text-right font-semibold text-muted-foreground">Expense</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{projectExpenseReport.byCategory?.length > 0 ? (
											projectExpenseReport.byCategory.map((cat) => (
												<TableRow key={cat.category?._id || cat.category?.name || "unknown"} className="group hover:bg-muted/40 transition-colors">
													<TableCell className="font-medium text-foreground">{cat.category?.name || "—"}</TableCell>
													<TableCell className="text-right tabular-nums">{cat.count}</TableCell>
													<TableCell className="text-right font-medium tabular-nums text-foreground">{formatINR(cat.total)}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No category data found.</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</>
			) : (
				<div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">No expenses found for this project. Select a project above.</div>
			)}
		</div>
	)
}