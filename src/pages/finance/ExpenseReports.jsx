
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { projectApi } from "@/api/projectApi";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR, formatDate } from "@/lib/helpers";
import { Receipt, FileText, CheckCircle2, Hourglass, BarChart3, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";

export default function ExpenseReports() {
	const {
		expenseSummary,
		projectExpenseReport,
		employeeExpenseReport,
		fetchExpenseSummary,
		fetchProjectExpenseReport,
		fetchEmployeeExpenseReport,
		loading,
	} = useFinance();

	const [currentView, setCurrentView] = useState("overall");
	const [projects, setProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState("");
	const [selectedEmployee, setSelectedEmployee] = useState("");
	const [empProjectFilter, setEmpProjectFilter] = useState("");

	// Initial Load: Fetch summary and projects
	useEffect(() => {
		fetchExpenseSummary();

		// Fetch projects dropdown data
		const loadProjects = async () => {
			try {
				const projRes = await projectApi.getAll({ limit: 100 });
				setProjects(projRes.data?.data?.projects || []);
			} catch (err) {
				console.error("Failed to load projects", err);
			}
		};
		loadProjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Navigation Handler
	const handleBack = () => {
		if (currentView === "employee") {
			if (empProjectFilter && empProjectFilter !== "all") {
				setCurrentView("project");
			} else {
				setCurrentView("overall");
			}
		} else if (currentView === "project") {
			setCurrentView("overall");
		}
	};

	// Helper to render Status Badges consistently
	const renderStatus = (status) => {
		const s = (status || "").toLowerCase();
		if (s === "paid" || s === "approved" || s === "wallet adjusted") {
			return <Badge variant="secondary" className="bg-success/10 text-success border-none capitalize">{status}</Badge>;
		}
		if (s === "rejected") {
			return <Badge variant="secondary" className="bg-destructive/10 text-destructive border-none capitalize">{status}</Badge>;
		}
		return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none capitalize">{status || "Pending"}</Badge>;
	};

	return (
		<div className="space-y-6">
			{/* Top Bar with Tabs and Dynamic Back Button */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card p-4 rounded-xl border shadow-sm gap-4">
				<div className="flex items-center gap-2">
					{currentView !== "overall" && currentView !== "project" && (
						<Button variant="ghost" size="icon" className="h-8 w-8 mr-1" onClick={handleBack}>
							<ChevronLeft className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
						</Button>
					)}
					<h2 className="text-lg font-semibold">
						{currentView === "overall" && "Overall Expense Summary"}
						{currentView === "project" && "Project Expense Summary"}
						{currentView === "employee" && "Employee Expense Summary"}
					</h2>
				</div>

				{/* Navigation Tabs (Overall & Project-wise) */}
				<Tabs
					value={currentView === "employee" ? "project" : currentView}
					onValueChange={(val) => {
						setCurrentView(val);
						if (val === "project" && !selectedProject && projects.length > 0) {
							setSelectedProject(projects[0]._id);
							fetchProjectExpenseReport(projects[0]._id);
						}
					}}
					className="w-full sm:w-auto"
				>
					<TabsList className="bg-muted/60 p-1 w-full sm:w-auto">
						<TabsTrigger value="overall" className="rounded-md">Overall</TabsTrigger>
						<TabsTrigger value="project" className="rounded-md">Project-wise</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* ======================= OVERALL VIEW ======================= */}
			{currentView === "overall" && (
				<div className="space-y-6">
					{loading && !expenseSummary ? (
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
							<Skeleton className="h-24" /><Skeleton className="h-24" />
							<Skeleton className="h-24" /><Skeleton className="h-24" />
						</div>
					) : expenseSummary ? (
						<>
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Total Tickets" value={expenseSummary.totalTickets || 0} icon={Receipt} accent="info" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Total Expense" value={formatINR(expenseSummary.totalAmount || 0)} icon={FileText} accent="info" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Total Paid" value={formatINR(expenseSummary.totalPaid || 0)} icon={CheckCircle2} accent="success" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Pending Amount" value={formatINR(expenseSummary.pendingAmount || 0)} icon={Hourglass} accent="warning" /></div>
							</div>

							{/* Full Width All Expense Tickets Table */}
							<Card className="overflow-hidden border-border shadow-sm">
								<div className="bg-muted/30 px-4 py-3 border-b"><h3 className="font-semibold text-sm text-foreground">All Expense Tickets</h3></div>
								<CardContent className="p-0">
									<Table>
										<TableHeader className="bg-muted/10">
											<TableRow className="hover:bg-transparent">
												<TableHead className="font-semibold text-muted-foreground">Date</TableHead>
												<TableHead className="font-semibold text-muted-foreground">Employee</TableHead>
												<TableHead className="font-semibold text-muted-foreground">Project / Category</TableHead>
												<TableHead className="text-right font-semibold text-muted-foreground">Amount</TableHead>
												<TableHead className="text-right font-semibold text-muted-foreground">Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{expenseSummary.tickets?.length > 0 ? (
												expenseSummary.tickets.map((ticket) => (
													<TableRow key={ticket._id} className="group hover:bg-muted/40 transition-colors">
														<TableCell className="font-medium text-foreground tabular-nums text-nowrap">{formatDate(ticket.createdAt)}</TableCell>
														<TableCell>
															<div className="font-medium text-foreground">{ticket.employeeId?.name || "—"}</div>
															<div className="text-[11px] text-muted-foreground">{ticket.employeeId?.email}</div>
														</TableCell>
														<TableCell>
															<div className="font-medium text-foreground">{ticket.projectId?.name || "—"}</div>
															<div className="text-[11px] text-muted-foreground">{ticket.categoryId?.name || ticket.category || "—"}</div>
														</TableCell>
														<TableCell className="text-right font-bold tabular-nums text-foreground">{formatINR(ticket.amount)}</TableCell>
														<TableCell className="text-right">{renderStatus(ticket.paymentStatus || ticket.status)}</TableCell>
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
						<div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">No summary data available.</div>
					)}
				</div>
			)}

			{/* ======================= PROJECT-WISE VIEW ======================= */}
			{currentView === "project" && (
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
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Tickets" value={projectExpenseReport.totalTickets || 0} icon={Receipt} accent="info" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Total Expense" value={formatINR(projectExpenseReport.totalAmount || 0)} icon={FileText} accent="info" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Paid" value={formatINR(projectExpenseReport.totalPaid || 0)} icon={CheckCircle2} accent="success" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Pending" value={formatINR(projectExpenseReport.pendingAmount || 0)} icon={Hourglass} accent="warning" /></div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Employee Breakdown */}
								<Card className="overflow-hidden border-border shadow-sm h-full">
									<div className="bg-muted/30 px-4 py-3 border-b"><h3 className="font-semibold text-sm text-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Employee Breakdown</h3></div>
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
			)}

			{/* ======================= EMPLOYEE-WISE VIEW ======================= */}
			{currentView === "employee" && (
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
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Total Tickets" value={employeeExpenseReport.totalTickets || 0} icon={Receipt} accent="info" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Total Expense" value={formatINR(employeeExpenseReport.totalAmount || 0)} icon={FileText} accent="info" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Paid" value={formatINR(employeeExpenseReport.totalPaid || 0)} icon={CheckCircle2} accent="success" /></div>
								<div className="bg-white dark:bg-card rounded-xl shadow-sm"><StatCard size="compact" label="Pending" value={formatINR(employeeExpenseReport.pendingAmount || 0)} icon={Hourglass} accent="warning" /></div>
							</div>

							{/* Tickets Table */}
							<Card className="overflow-hidden border-border shadow-sm">
								<div className="bg-muted/30 px-4 py-3 border-b"><h3 className="font-semibold text-sm text-foreground">Expense Tickets</h3></div>
								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow className="hover:bg-transparent">
												<TableHead className="font-semibold text-muted-foreground">Date</TableHead>
												<TableHead className="font-semibold text-muted-foreground">Category</TableHead>
												<TableHead className="font-semibold text-muted-foreground">Project</TableHead>
												<TableHead className="font-semibold text-muted-foreground">Description</TableHead>
												<TableHead className="text-right font-semibold text-muted-foreground">Amount</TableHead>
												<TableHead className="text-right font-semibold text-muted-foreground">Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{employeeExpenseReport.tickets?.length > 0 ? (
												employeeExpenseReport.tickets.map((ticket) => (
													<TableRow key={ticket._id} className="group hover:bg-muted/40 transition-colors">
														<TableCell className="font-medium text-foreground tabular-nums text-nowrap">
															{formatDate(ticket.createdAt)}
														</TableCell>
														<TableCell className="text-muted-foreground font-medium">
															{ticket.categoryId?.name || "—"}
														</TableCell>
														<TableCell className="text-muted-foreground font-medium">
															{ticket.projectId?.name || "—"}
														</TableCell>
														<TableCell className="text-muted-foreground text-xs max-w-[200px] truncate" title={ticket.description}>
															{ticket.title || "—"}
														</TableCell>
														<TableCell className="text-right font-bold tabular-nums text-foreground">
															{formatINR(ticket.amount)}
														</TableCell>
														<TableCell className="text-right">
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
			)}
		</div>
	);
}