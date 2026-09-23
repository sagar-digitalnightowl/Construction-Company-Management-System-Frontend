import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Skeleton } from "@/components/ui/skeleton";
import { FinanceStats } from "./FinanceDashboard/FinanceStats";
import { FinanceProjectsView } from "./FinanceDashboard/FinanceProjectsView";
import { FinanceTowersView } from "./FinanceDashboard/FinanceTowersView";
import { FinanceFloorsView } from "./FinanceDashboard/FinanceFloorsView";
import { FinanceFlatsView } from "./FinanceDashboard/FinanceFlatsView";
import { getEffectiveFlatStatus, getFlatDisplay } from "./FinanceDashboard/financeDashboard.helpers";

export function FinanceDashboard() {
	const { dashboardData, dashboardSummary, fetchDashboard, fetchProjectDetails, exportFinanceDashboard, loading } = useFinance();

	const [towerSummary, setTowerSummary] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedTower, setSelectedTower] = useState("");
	const [selectedFloor, setSelectedFloor] = useState("");
	const [currentView, setCurrentView] = useState("projects");
	const [page, setPage] = useState(1);

	useEffect(() => {
		fetchDashboard({ page });
	}, [page, fetchDashboard]);

	const handlePageChange = (newPage) => {
		if (pagination && newPage >= 1 && newPage <= pagination.pages) {
			setCurrentView("projects");
			setSelectedProject(null);
			setSelectedTower("");
			setSelectedFloor("");
			setPage(newPage);
		}
	};

	const projects = useMemo(() => {
		if (!dashboardData) return [];
		if (Array.isArray(dashboardData)) return dashboardData;
		return dashboardData.data || [];
	}, [dashboardData]);

	const pagination = useMemo(() => {
		if (!dashboardData || Array.isArray(dashboardData)) return null;
		return dashboardData.pagination || null;
	}, [dashboardData]);

	// Use backend summary if present, fallback to client calculation
	const stats = useMemo(() => {
		if (selectedTower && towerSummary) {
			return {
				totalFlats: towerSummary.totalFlats || 0,
				bookedFlats: towerSummary.bookedSold || 0,
				totalPaid: towerSummary.totalReceived || 0,
				totalRemaining: towerSummary.outstanding || 0,
				totalGst: towerSummary.totalGst || 0,
				gstCollected: towerSummary.gstCollected || 0,
				gstRemaining: towerSummary.gstRemaining || 0,

				totalExpenses: towerSummary.totalExpenses || 0,
				totalExpensesPaid: towerSummary.totalExpensesPaid || 0,
				totalExpensesPending: towerSummary.totalExpensesPending || 0,
				totalExpenseTickets: towerSummary.totalExpenseTickets || 0,
			};
		}

		if (selectedProject) {
			return {
				totalFlats: selectedProject.totalFlats || 0,
				bookedFlats: selectedProject.bookedSold || 0,
				totalPaid: selectedProject.totalReceived || 0,
				totalRemaining: selectedProject.outstanding || 0,
				totalGst: selectedProject.totalGst || 0,
				gstCollected: selectedProject.gstCollected || 0,
				gstRemaining: selectedProject.gstRemaining || 0,

				totalExpenses: selectedProject.totalExpenses || 0,
				totalExpensesPaid: selectedProject.totalExpensesPaid || 0,
				totalExpensesPending: selectedProject.totalExpensesPending || 0,
				totalExpenseTickets: selectedProject.totalExpenseTickets || 0,
			};
		}

		if (dashboardSummary) {
			return {
				totalFlats: dashboardSummary.totalFlats || 0,
				bookedFlats: dashboardSummary.bookedSold || 0,
				totalPaid: dashboardSummary.totalReceived || 0, // Incl GST
				totalRemaining: dashboardSummary.outstanding || 0, // Incl GST
				totalGst: dashboardSummary.totalGst || 0,
				gstCollected: dashboardSummary.gstCollected || 0,
				gstRemaining: dashboardSummary.gstRemaining || 0,
				totalExpenses: dashboardSummary.totalExpenses || 0,
				totalExpensesPaid: dashboardSummary.totalExpensesPaid || 0,
				totalExpensesPending: dashboardSummary.totalExpensesPending || 0,
				totalExpenseTickets: dashboardSummary.totalExpenseTickets || 0,
			};
		}

		let totalFlats = 0,
			bookedFlats = 0,
			totalRemaining = 0,
			totalPaid = 0,
			totalGst = 0,
			gstCollected = 0,
			gstRemaining = 0,
			totalExpenses = 0,
			totalExpensesPaid = 0,
			totalExpensesPending = 0,
			totalExpenseTickets = 0;

		projects.forEach((project) => {
			totalGst += project.totalGst || 0;
			gstCollected += project.gstCollected || 0;
			gstRemaining += project.gstRemaining || 0;
			totalExpenses += project.totalExpenses || 0;
			totalExpensesPaid += project.totalExpensesPaid || 0;
			totalExpensesPending += project.totalExpensesPending || 0;
			totalExpenseTickets += project.totalExpenseTickets || 0;

			const flats = project.flats || [];
			totalFlats += flats.length;
			flats.forEach((f) => {
				const eff = getEffectiveFlatStatus(f);
				if (eff === "sold" || eff === "pending") {
					bookedFlats += 1;
					totalPaid += f.totalPaid || 0;
					totalRemaining += f.remainingAmount || 0;
				}
			});
		});

		return {
			totalFlats, bookedFlats, totalRemaining, totalPaid, totalGst, gstCollected, gstRemaining,
			totalExpenses,
			totalExpensesPaid,
			totalExpensesPending,
			totalExpenseTickets,
		};
	}, [
		projects,
		dashboardSummary,
		selectedProject,
		selectedTower,
		towerSummary,
	]);

	// Derived Pure Base (Without GST)
	const pureBaseReceived = stats.totalPaid - stats.gstCollected;
	const pureBaseOutstanding = stats.totalRemaining - stats.gstRemaining;

	const goToProjects = useCallback(async () => {
		await fetchDashboard({ page });

		setCurrentView("projects");
		setSelectedProject(null);
		setSelectedTower("");
		setSelectedFloor("");
		setTowerSummary(null);
	}, [fetchDashboard, page]);

	// Fetch full details (with GST/Amounts) when project is clicked
	const goToTowers = useCallback(async (project) => {
		const fullProject = await fetchProjectDetails(project.projectId);

		setTowerSummary(null);

		setSelectedProject(fullProject || project);
		setSelectedTower("");
		setSelectedFloor("");
		setCurrentView("towers");
	}, [fetchProjectDetails]);

	const goToFloors = useCallback(async (tower) => {
		if (!selectedProject) return;

		setSelectedTower(tower);
		setSelectedFloor("");

		const response = await fetchDashboard({
			page: 1,
			limit: 10,
			projectId: selectedProject.projectId,
			tower,
		});

		setTowerSummary(response.summary);

		setCurrentView("floors");
	}, [fetchDashboard, selectedProject]);

	const goToFlats = useCallback((floor) => {
		setSelectedFloor(floor);
		setCurrentView("flats");
	}, []);

	const towers = useMemo(() => {
		if (!selectedProject || !selectedProject.flats) return [];
		const towerSet = new Set(selectedProject.flats.map((f) => f.tower));
		return Array.from(towerSet);
	}, [selectedProject]);

	const floors = useMemo(() => {
		if (!selectedProject || !selectedTower || !selectedProject.flats) return [];
		const floorSet = new Set(
			selectedProject.flats
				.filter((f) => f.tower === selectedTower)
				.map((f) => f.floor)
		);
		return Array.from(floorSet);
	}, [selectedProject, selectedTower]);

	const filteredFlats = useMemo(() => {
		if (!selectedProject || !selectedTower || !selectedFloor || !selectedProject.flats) return [];
		return selectedProject.flats.filter(
			(f) => f.tower === selectedTower && f.floor === selectedFloor
		);
	}, [selectedProject, selectedTower, selectedFloor]);

	const dashboardFlatsMap = useMemo(() => {
		const map = new Map();

		projects.forEach((project) => {
			project.flats?.forEach((flat) => {
				const key = `${project.projectId}-${flat.tower}-${flat.floor}-${flat.flatNumber}`;
				map.set(key, flat);
			});
		});

		return map;
	}, [projects]);

	if (loading && projects.length === 0) {
		return (
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{[...Array(8)].map((_, i) => (
					<Skeleton key={i} className="h-24" />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Consolidated Finance & Expense Overview */}
			<FinanceStats
				stats={stats}
				pureBaseReceived={pureBaseReceived}
				currentView={currentView}
			/>

			{/* Projects View */}
			{currentView === "projects" && (
				<FinanceProjectsView
					projects={projects}
					pagination={pagination}
					page={page}
					loading={loading}
					goToTowers={goToTowers}
					handlePageChange={handlePageChange}
					exportFinanceDashboard={exportFinanceDashboard}
				/>
			)}

			{/* Towers View */}
			{currentView === "towers" && selectedProject && (
				<FinanceTowersView
					selectedProject={selectedProject}
					towers={towers}
					loading={loading}
					goToProjects={goToProjects}
					goToFloors={goToFloors}
					exportFinanceDashboard={exportFinanceDashboard}
					getEffectiveFlatStatus={getEffectiveFlatStatus}
				/>
			)}

			{/* Floors View */}
			{currentView === "floors" && selectedProject && selectedTower && (
				<FinanceFloorsView
					selectedProject={selectedProject}
					selectedTower={selectedTower}
					floors={floors}
					loading={loading}
					fetchProjectDetails={fetchProjectDetails}
					setSelectedProject={setSelectedProject}
					setSelectedTower={setSelectedTower}
					setSelectedFloor={setSelectedFloor}
					setCurrentView={setCurrentView}
					exportFinanceDashboard={exportFinanceDashboard}
					goToFlats={goToFlats}
					getEffectiveFlatStatus={getEffectiveFlatStatus}
				/>
			)}

			{/* Flats View */}
			{currentView === "flats" && selectedProject && selectedTower && selectedFloor && (
				<FinanceFlatsView
					selectedProject={selectedProject}
					selectedTower={selectedTower}
					selectedFloor={selectedFloor}
					filteredFlats={filteredFlats}
					dashboardFlatsMap={dashboardFlatsMap}
					setSelectedFloor={setSelectedFloor}
					setCurrentView={setCurrentView}
					getFlatDisplay={getFlatDisplay}
				/>
			)}
		</div>
	);
}