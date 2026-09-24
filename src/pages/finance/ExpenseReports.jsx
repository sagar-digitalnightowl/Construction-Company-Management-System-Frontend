
import React, { useEffect, useRef, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { projectApi } from "@/api/projectApi";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatINR, formatDate } from "@/lib/helpers";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverallExpenseView } from "./ExpenseReports/OverallExpenseView";
import { ProjectExpenseView } from "./ExpenseReports/ProjectExpenseView";
import { EmployeeExpenseView } from "./ExpenseReports/EmployeeExpenseView";

export default function ExpenseReports() {
	const topRef = useRef(null);
	const {
		expenseSummary,
		expenseSummaryPagination,
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
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		// Scroll the ref into view instead of the window
		topRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [currentPage]);

	useEffect(() => {
		fetchExpenseSummary({
			page: currentPage,
			limit: 10,
		});
	}, [currentPage, fetchExpenseSummary]);

	// Initial Load: Fetch projects
	useEffect(() => {
		const loadProjects = async () => {
			try {
				const projRes = await projectApi.getAll({ limit: 100 });
				setProjects(projRes.data?.data?.projects || []);
			} catch (err) {
				console.error("Failed to load projects", err);
			}
		};
		loadProjects();
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


	return (
		<div className="space-y-6" ref={topRef}>
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
					<TabsList className="bg-muted/60 p-1 w-auto">
						<TabsTrigger value="overall" className="rounded-md">Overall</TabsTrigger>
						<TabsTrigger value="project" className="rounded-md">Project-wise</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* ======================= OVERALL VIEW ======================= */}
			{currentView === "overall" && (
				<OverallExpenseView
					expenseSummary={expenseSummary}
					expenseSummaryPagination={expenseSummaryPagination}
					loading={loading}
					setCurrentPage={setCurrentPage}
					formatINR={formatINR}
					formatDate={formatDate}
				/>
			)}

			{/* ======================= PROJECT-WISE VIEW ======================= */}
			{currentView === "project" && (
				<ProjectExpenseView
					projects={projects}
					selectedProject={selectedProject}
					setSelectedProject={setSelectedProject}
					fetchProjectExpenseReport={fetchProjectExpenseReport}
					projectExpenseReport={projectExpenseReport}
					loading={loading}
					setCurrentView={setCurrentView}
					setEmpProjectFilter={setEmpProjectFilter}
					setSelectedEmployee={setSelectedEmployee}
					fetchEmployeeExpenseReport={fetchEmployeeExpenseReport}
					formatINR={formatINR}
				/>
			)}

			{/* ======================= EMPLOYEE-WISE VIEW ======================= */}
			{currentView === "employee" && (
				<EmployeeExpenseView
					employeeExpenseReport={employeeExpenseReport}
					loading={loading}
					selectedEmployee={selectedEmployee}
					formatINR={formatINR}
					formatDate={formatDate}
				/>
			)}
		</div>
	);
}