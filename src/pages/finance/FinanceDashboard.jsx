import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/PageHeader";
import { formatINR } from "@/lib/helpers";
import {
	ChevronLeft,
	Building2,
	Layers,
	Download,
	User,
	Mail,
	Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CountUp from 'react-countup';

// Helper: returns effective status and display label based on all 3 keys
const getEffectiveFlatStatus = (flat) => {
	const flatStatus = (flat.flatStatus || flat.status || "").toLowerCase();
	const bookingStatus = (flat.bookingStatus || "").toLowerCase();
	const approvalStatus = (flat.approvalStatus || "").toLowerCase();

	if (flatStatus === "cancelled" || approvalStatus === "rejected") {
		return "available";
	}

	const isBookedOrSold =
		flatStatus === "booked" || flatStatus === "sold" ||
		bookingStatus === "booked" || bookingStatus === "sold";

	if (isBookedOrSold && approvalStatus === "approved") {
		return "sold";
	}

	if ((isBookedOrSold || bookingStatus || flatStatus === "pending") && approvalStatus !== "approved") {
		return "pending";
	}

	return "available";
};

const getFlatDisplay = (flat) => {
	const eff = getEffectiveFlatStatus(flat);
	if (eff === "sold") return { status: "sold", label: "Sold", variant: "success" };
	if (eff === "pending") return { status: "pending", label: "Pending Approval", variant: "warning" };
	return { status: "available", label: "Available", variant: "secondary" };
};

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

	useEffect(() => {
		setCurrentView("projects");
		setSelectedProject(null);
		setSelectedTower("");
		setSelectedFloor("");
	}, [page]);

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

	const handlePageChange = (newPage) => {
		if (pagination && newPage >= 1 && newPage <= pagination.pages) {
			setPage(newPage);
		}
	};

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
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
				{/* Property Stats */}
				<StatCard
					size="compact"
					label="Total Flats"
					value={stats.totalFlats}
					accent="neutral"
					valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
				/>
				<StatCard
					size="compact"
					label="Booked / Sold"
					value={stats.bookedFlats}
					accent="neutral"
					valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
				/>
				<StatCard
					size="compact"
					label="Received (Incl. GST)"
					value={formatINR(stats.totalPaid)}
					accent="neutral"
					valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
				/>
				<StatCard
					size="compact"
					label="Due (Incl. GST)"
					value={formatINR(stats.totalRemaining)}
					accent="neutral"
					valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
				/>
				<StatCard
					size="compact"
					label="Pure Revenue"
					value={formatINR(pureBaseReceived > 0 ? pureBaseReceived : 0)}
					accent="neutral"
					valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
				/>

				{/* Tax & Expense Stats */}
				<StatCard
					size="compact"
					label="GST Collected"
					value={formatINR(stats.gstCollected)}
					accent="neutral"
					valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
				/>

				{currentView !== "floors" && currentView !== "flats" && (
					<>
						<StatCard
							size="compact"
							label="Total Expenses"
							value={formatINR(stats.totalExpenses)}
							accent="neutral"
							valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
						/>

						<StatCard
							size="compact"
							label="Expenses Paid"
							value={formatINR(stats.totalExpensesPaid)}
							accent="neutral"
							valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
						/>

						<StatCard
							size="compact"
							label="Expenses Pending"
							value={formatINR(stats.totalExpensesPending)}
							accent="neutral"
							valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
						/>

						<StatCard
							size="compact"
							label="Expense Tickets"
							value={stats.totalExpenseTickets}
							accent="neutral"
							valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
						/>
					</>
				)}
			</div>

			{/* Projects View */}
			{currentView === "projects" && (
				<>
					<div className="flex items-center justify-between mt-6 gap-3">
						<div>
							<h2 className="text-lg font-semibold">Projects</h2>

							<span className="text-sm text-muted-foreground">
								{pagination
									? `Page ${page} of ${pagination.pages}`
									: ""}
							</span>
						</div>

						<Button onClick={() => exportFinanceDashboard()} disabled={loading}>
							<Download className="h-4 w-4 mr-1" /> Export
						</Button>
					</div>
					{projects.length === 0 ? (
						<div className="text-center text-muted-foreground py-10 bg-muted/20 rounded-lg border border-dashed">
							No projects available.
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{projects.map((project) => {
								// Calculate stats for the project
								const bookedFlats = project.bookedSold || 0;
								const totalFlats = project.totalFlats || (project.flats ? project.flats.length : 0);

								// Calculate percentage for progress bar
								const bookingPercentage = totalFlats > 0 ? (bookedFlats / totalFlats) * 100 : 0;

								// Determine styling states
								const isFullyBooked = totalFlats > 0 && bookedFlats >= totalFlats;
								const hasBookings = bookedFlats > 0 && !isFullyBooked;

								return (
									<Card
										key={project.projectId}
										className={`group flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${isFullyBooked
											? "bg-primary/5 border-primary/40 dark:bg-primary/10 hover:border-primary"
											: hasBookings
												? "border-primary/30 hover:border-primary/70"
												: "hover:border-foreground/30"
											}`}
										onClick={() => goToTowers(project)}
									>
										<CardContent className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col">

											{/* 1. Header: Title, Location, and Building Icon */}
											<div className="flex justify-between items-start gap-3">
												<div className="min-w-0 flex-1">
													<h3 className="font-semibold text-base sm:text-lg truncate group-hover:text-primary transition-colors" title={project.projectName}>
														{project.projectName}
													</h3>
													<p className="text-xs sm:text-sm text-muted-foreground truncate" title={project.location}>
														{project.location}
													</p>
												</div>
												{/* Restored Building Icon with dynamic color */}
												<Building2 className={`h-5 w-5 shrink-0 ${isFullyBooked || hasBookings ? "text-primary" : "text-muted-foreground"}`} />
											</div>

											{/* 2. Progress Bar Section */}
											<div className="space-y-1.5 mt-auto pt-2">
												<div className="flex justify-between items-center text-xs sm:text-sm">
													{/* Changed label to "Booked" */}
													<span className="text-muted-foreground font-medium">Booked</span>
													<span className="font-medium">
														<span className={isFullyBooked ? "text-primary font-bold" : "text-foreground"}>{bookedFlats}</span>
														<span className="text-muted-foreground"> / {totalFlats} Flats</span>
													</span>
												</div>
												<div className="w-full bg-secondary h-2 sm:h-2.5 rounded-full overflow-hidden">
													<div
														className={`h-full transition-all duration-500 ${isFullyBooked ? 'bg-primary' : 'bg-primary/70'}`}
														style={{ width: `${bookingPercentage}%` }}
													/>
												</div>
											</div>

											{/* 3. Primary Financial Overview */}
											<div className="grid grid-cols-2 gap-3 pt-3 border-t">
												<div>
													<p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Received</p>
													<p className="font-bold text-success text-sm sm:text-base truncate" title={formatINR(project.totalReceived || 0)}>
														{formatINR(project.totalReceived || 0)}
													</p>
												</div>
												<div className="text-right">
													<p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Outstanding Due</p>
													<p className="font-bold text-destructive text-sm sm:text-base truncate" title={formatINR(project.outstanding || 0)}>
														{formatINR(project.outstanding || 0)}
													</p>
												</div>
											</div>

											{/* 4. GST Breakdown (Compact & Responsive Grid) */}
											<div className={`rounded-md p-2.5 text-xs grid grid-cols-3 gap-1 sm:gap-2 text-center mt-2 ${isFullyBooked ? "bg-primary/10" : "bg-muted/50"}`}>
												<div className="flex flex-col justify-center">
													<p className="text-muted-foreground text-[9px] sm:text-[10px] uppercase font-medium">Total GST</p>
													<p className="font-semibold text-[11px] sm:text-xs truncate">{formatINR(project.totalGst || 0)}</p>
												</div>
												<div className="flex flex-col justify-center border-x border-foreground/10 px-1">
													<p className="text-muted-foreground text-[9px] sm:text-[10px] uppercase font-medium">Collected</p>
													<p className="font-semibold text-success text-[11px] sm:text-xs truncate">{formatINR(project.gstCollected || 0)}</p>
												</div>
												<div className="flex flex-col justify-center">
													<p className="text-muted-foreground text-[9px] sm:text-[10px] uppercase font-medium">Remaining</p>
													<p className="font-semibold text-warning text-[11px] sm:text-xs truncate">{formatINR(project.gstRemaining || 0)}</p>
												</div>
											</div>

										</CardContent>
									</Card>
								);
							})}
						</div>
					)}
					{pagination && pagination.pages > 1 && (
						<div className="flex items-center justify-center gap-2 mt-4">
							<Button
								variant="outline"
								size="sm"
								disabled={page <= 1}
								onClick={() => handlePageChange(page - 1)}
							>
								Previous
							</Button>
							<span className="text-sm font-medium">
								Page {page} of {pagination.pages}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={page >= pagination.pages}
								onClick={() => handlePageChange(page + 1)}
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}

			{/* Towers View */}
			{currentView === "towers" && selectedProject && (
				<>
					<div className="flex items-center justify-between gap-3 mb-4">
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="icon"
								onClick={goToProjects}
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>

							<div>
								<h2 className="text-lg font-semibold">
									{selectedProject.projectName}
								</h2>

								<p className="text-sm text-muted-foreground">
									{selectedProject.location}
								</p>
							</div>
						</div>

						<Button onClick={() =>
							exportFinanceDashboard({
								projectId: selectedProject.projectId,
							})
						} disabled={loading}>
							<Download className="h-4 w-4 mr-1" /> Export
						</Button>
					</div>
					<h3 className="text-sm font-medium mb-3">Select a Tower</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{towers.map((tower) => {
							const towerFlats = selectedProject.flats.filter((f) => f.tower === tower);
							const totalFlats = towerFlats.length;
							const bookedFlats = towerFlats.filter((f) => {
								const eff = getEffectiveFlatStatus(f);
								return eff === "sold" || eff === "pending";
							}).length;

							// Calculate percentage for progress bar
							const bookingPercentage = totalFlats > 0 ? (bookedFlats / totalFlats) * 100 : 0;

							// Determine styling states
							const isFullyBooked = totalFlats > 0 && bookedFlats === totalFlats;
							const hasBookings = bookedFlats > 0 && !isFullyBooked;

							return (
								<Card
									key={tower}
									className={`group flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md ${isFullyBooked
										? "bg-primary/5 border-primary/40 dark:bg-primary/10 hover:border-primary"
										: hasBookings
											? "border-primary/30 hover:border-primary/70"
											: "hover:border-foreground/30"
										}`}
									onClick={() => goToFloors(tower)}
								>
									<CardContent className="p-4 space-y-4 flex-1 flex flex-col">
										{/* Header: Title and Building Icon */}
										<div className="flex justify-between items-start gap-3">
											<h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
												{tower}
											</h3>
											<Building2 className={`h-5 w-5 shrink-0 ${isFullyBooked || hasBookings ? "text-primary" : "text-muted-foreground"}`} />
										</div>

										{/* Progress Bar Section */}
										<div className="space-y-1.5 mt-auto pt-2">
											<div className="flex justify-between items-center text-xs sm:text-sm">
												<span className="text-muted-foreground font-medium">Booked</span>
												<span className="font-medium">
													<span className={isFullyBooked ? "text-primary font-bold" : "text-foreground"}>{bookedFlats}</span>
													<span className="text-muted-foreground"> / {totalFlats} Flats</span>
												</span>
											</div>
											<div className="w-full bg-secondary h-2 sm:h-2.5 rounded-full overflow-hidden">
												<div
													className={`h-full transition-all duration-500 ${isFullyBooked ? 'bg-primary' : 'bg-primary/70'}`}
													style={{ width: `${bookingPercentage}%` }}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</>
			)}

			{/* Floors View */}
			{currentView === "floors" && selectedProject && selectedTower && (
				<>
					<div className="flex items-center justify-between gap-3 mb-4">
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="icon"
								onClick={async () => {
									const fullProject =
										await fetchProjectDetails(
											selectedProject.projectId
										);

									setSelectedProject(fullProject);

									setSelectedTower("");
									setSelectedFloor("");
									setCurrentView("towers");
								}}
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>

							<div>
								<h2 className="text-lg font-semibold">
									{selectedProject.projectName} — {selectedTower}
								</h2>

								<p className="text-sm text-muted-foreground">
									{selectedProject.location}
								</p>
							</div>
						</div>

						<Button onClick={() =>
							exportFinanceDashboard({
								projectId: selectedProject.projectId,
								tower: selectedTower,
							})
						} disabled={loading}>
							<Download className="h-4 w-4 mr-1" /> Export
						</Button>
					</div>
					<h3 className="text-sm font-medium mb-3">Select a Floor</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{floors.map((floor) => {
							const floorFlats = selectedProject.flats.filter(
								(f) => f.tower === selectedTower && f.floor === floor
							);
							const totalFlats = floorFlats.length;
							const bookedFlats = floorFlats.filter((f) => {
								const eff = getEffectiveFlatStatus(f);
								return eff === "sold" || eff === "pending";
							}).length;

							// Calculate percentage for progress bar
							const bookingPercentage = totalFlats > 0 ? (bookedFlats / totalFlats) * 100 : 0;

							// Determine styling states
							const isFullyBooked = totalFlats > 0 && bookedFlats === totalFlats;
							const hasBookings = bookedFlats > 0 && !isFullyBooked;

							return (
								<Card
									key={floor}
									className={`group flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md ${isFullyBooked
										? "bg-primary/5 border-primary/40 dark:bg-primary/10 hover:border-primary"
										: hasBookings
											? "border-primary/30 hover:border-primary/70"
											: "hover:border-foreground/30"
										}`}
									onClick={() => goToFlats(floor)}
								>
									<CardContent className="p-4 space-y-4 flex-1 flex flex-col">
										{/* Header: Title and Layers Icon */}
										<div className="flex justify-between items-start gap-3">
											<h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
												{floor}
											</h3>
											<Layers className={`h-5 w-5 shrink-0 ${isFullyBooked || hasBookings ? "text-primary" : "text-muted-foreground"}`} />
										</div>

										{/* Progress Bar Section */}
										<div className="space-y-1.5 mt-auto pt-2">
											<div className="flex justify-between items-center text-xs sm:text-sm">
												<span className="text-muted-foreground font-medium">Booked</span>
												<span className="font-medium">
													<span className={isFullyBooked ? "text-primary font-bold" : "text-foreground"}>{bookedFlats}</span>
													<span className="text-muted-foreground"> / {totalFlats} Flats</span>
												</span>
											</div>
											<div className="w-full bg-secondary h-2 sm:h-2.5 rounded-full overflow-hidden">
												<div
													className={`h-full transition-all duration-500 ${isFullyBooked ? 'bg-primary' : 'bg-primary/70'}`}
													style={{ width: `${bookingPercentage}%` }}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</>
			)}

			{/* Flats View */}
			{currentView === "flats" && selectedProject && selectedTower && selectedFloor && (
				<>
					<div className="flex items-center gap-3 mb-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								setCurrentView("floors");
								setSelectedFloor("");
							}}
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<div>
							<h2 className="text-lg font-semibold">
								{selectedProject.projectName} — {selectedTower} — Floor {selectedFloor}
							</h2>
							<p className="text-sm text-muted-foreground">
								{selectedProject.location}
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
						{filteredFlats.map((flat) => {
							const uniqueKey = `${selectedProject.projectId}-${flat.tower}-${flat.floor}-${flat.flatNumber}`;
							const { status, label, variant } = getFlatDisplay(flat);

							const isSold = status === "sold";
							const isPending = status === "pending";

							// Calculate payment progress for sold/pending flats
							const totalAmount = (flat.totalPaid || 0) + (flat.remainingAmount || 0);
							const paidPercentage = totalAmount > 0 ? ((flat.totalPaid || 0) / totalAmount) * 100 : 0;

							return (
								<div
									key={uniqueKey}
									// Added h-full and flex-col to force uniform stretching across the grid
									className={`group h-full flex flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-md bg-card ${isSold
										? "border-primary/40 hover:border-primary"
										: isPending
											? "border-amber-500/40 hover:border-amber-500"
											: "hover:border-foreground/30"
										}`}
								>
									{/* 1. Header: Flat Number and Status Badge */}
									<div>
										<div className="flex justify-between items-start mb-1 gap-2">
											<span className={`font-bold text-lg truncate transition-colors ${isSold ? "text-primary group-hover:text-primary/80" :
												isPending ? "text-amber-600 dark:text-amber-500" : ""
												}`}>
												{flat.flatNumber}
											</span>
											<Badge variant={variant} className="capitalize text-[10px] sm:text-xs whitespace-nowrap shrink-0 shadow-sm">
												{label}
											</Badge>
										</div>

										<p className="text-muted-foreground text-xs font-medium">
											{flat.tower} • Floor {flat.floor}
										</p>
									</div>

									{/* 2. Bottom Section (Dynamically fills space) */}
									<div className="mt-4 pt-3 border-t border-foreground/10 flex-1 flex flex-col">
										{(isSold || isPending) ? (
											<div className="space-y-3 flex-1 flex flex-col justify-end">
												{/* Buyer Details */}
												<div className="space-y-1.5">
													{flat.buyerName && (
														<p
															className="text-xs sm:text-sm font-semibold truncate flex items-center gap-1.5"
															title={flat.buyerName}
														>
															<User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
															<span className="truncate">{flat.buyerName}</span>
														</p>
													)}

													{flat.buyerEmail && (
														<p
															className="text-[10px] sm:text-xs text-muted-foreground truncate flex items-center gap-1.5"
															title={flat.buyerEmail}
														>
															<Mail className="h-3.5 w-3.5 shrink-0" />
															<span className="truncate">{flat.buyerEmail}</span>
														</p>
													)}

													{flat.buyerPhone && (
														<p
															className="text-[10px] sm:text-xs text-muted-foreground truncate flex items-center gap-1.5"
															title={flat.buyerPhone}
														>
															<Phone className="h-3.5 w-3.5 shrink-0" />
															<span className="truncate">{flat.buyerPhone}</span>
														</p>
													)}
												</div>

												{/* Payment Progress Bar */}
												<div className="space-y-1.5">
													<div className="flex justify-between items-center text-[10px] sm:text-xs">
														<span className="text-muted-foreground font-medium">Payment</span>
														<span className="font-medium">{Math.round(paidPercentage)}%</span>
													</div>
													<div className="w-full bg-secondary h-1.5 sm:h-2 rounded-full overflow-hidden">
														<div
															className={`h-full transition-all duration-500 ${isSold ? 'bg-primary' : 'bg-amber-500'}`}
															style={{ width: `${paidPercentage}%` }}
														/>
													</div>
												</div>

												{/* Paid vs Due Breakdown */}
												<div className="grid grid-cols-2 gap-2 text-center pt-1 mt-auto">
													<div className="bg-success/10 rounded py-1.5 px-1">
														<p className="text-[9px] sm:text-[10px] text-success/80 uppercase font-bold">Paid</p>
														<p className="text-success font-semibold text-[11px] sm:text-xs truncate" title={formatINR(flat.totalPaid || 0)}>
															{formatINR(flat.totalPaid || 0)}
														</p>
													</div>
													<div className="bg-destructive/10 rounded py-1.5 px-1">
														<p className="text-[9px] sm:text-[10px] text-destructive/80 uppercase font-bold">Due</p>
														<p className="text-destructive font-semibold text-[11px] sm:text-xs truncate" title={formatINR(flat.remainingAmount || 0)}>
															{formatINR(flat.remainingAmount || 0)}
														</p>
													</div>
												</div>
											</div>
										) : (
											/* Placeholder state for Available Flats */
											<div className="flex-1 flex flex-col items-center justify-center min-h-[115px] bg-muted/20 border border-dashed border-muted-foreground/30 rounded-lg p-3 transition-colors group-hover:bg-muted/40">
												<p className="text-[10px] text-muted-foreground/60 text-center mt-1">
													No active buyer or payments assigned.
												</p>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}