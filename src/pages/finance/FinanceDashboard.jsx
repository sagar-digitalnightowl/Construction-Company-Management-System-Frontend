
// src/pages/finance/FinanceDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/PageHeader";
import { formatINR } from "@/lib/helpers";
import {
	Home,
	UserCheck,
	TrendingDown,
	TrendingUp,
	ChevronLeft,
	Building2,
	Layers,
	Receipt,
	CheckCircle2,
	Hourglass,
	Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
	const { dashboardData, dashboardSummary, fetchDashboard, fetchProjectDetails, loading } = useFinance();

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
		if (selectedProject) {
			return {
				totalFlats: selectedProject.totalFlats || 0,
				bookedFlats: selectedProject.bookedSold || 0,
				totalPaid: selectedProject.totalReceived || 0,
				totalRemaining: selectedProject.outstanding || 0,
				totalGst: selectedProject.totalGst || 0,
				gstCollected: selectedProject.gstCollected || 0,
				gstRemaining: selectedProject.gstRemaining || 0,
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
			};
		}

		let totalFlats = 0,
			bookedFlats = 0,
			totalRemaining = 0,
			totalPaid = 0,
			totalGst = 0,
			gstCollected = 0,
			gstRemaining = 0;

		projects.forEach((project) => {
			totalGst += project.totalGst || 0;
			gstCollected += project.gstCollected || 0;
			gstRemaining += project.gstRemaining || 0;

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

		return { totalFlats, bookedFlats, totalRemaining, totalPaid, totalGst, gstCollected, gstRemaining };
	}, [projects, dashboardSummary]);

	// Derived Pure Base (Without GST)
	const pureBaseReceived = stats.totalPaid - stats.gstCollected;
	const pureBaseOutstanding = stats.totalRemaining - stats.gstRemaining;

	const goToProjects = useCallback(() => {
		setCurrentView("projects");
		setSelectedProject(null);
		setSelectedTower("");
		setSelectedFloor("");
	}, []);

	// Fetch full details (with GST/Amounts) when project is clicked
	const goToTowers = useCallback(async (project) => {
		const fullProject = await fetchProjectDetails(project.projectId);
		setSelectedProject(fullProject || project);
		setSelectedTower("");
		setSelectedFloor("");
		setCurrentView("towers");
	}, [fetchProjectDetails]);

	const goToFloors = useCallback((tower) => {
		setSelectedTower(tower);
		setSelectedFloor("");
		setCurrentView("floors");
	}, []);

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
			{/* Overview Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<StatCard
					size="compact"
					label="Total Flats"
					value={stats.totalFlats}
					icon={Home}
					accent="info"
					valueClassName="text-xl sm:text-2xl"
				/>
				<StatCard
					size="compact"
					label="Booked / Sold"
					value={stats.bookedFlats}
					icon={UserCheck}
					accent="success"
					valueClassName="text-xl sm:text-2xl"
				/>
				{/* 🔥 Updated Label: Included GST explicitly */}
				<StatCard
					size="compact"
					label="Total Received (Incl. GST)"
					value={formatINR(stats.totalPaid)}
					icon={TrendingUp}
					accent="success"
					valueClassName="text-xl sm:text-2xl"
				/>
				{/* 🔥 Updated Label: Included GST explicitly */}
				<StatCard
					size="compact"
					label="Outstanding Due (Incl. GST)"
					value={formatINR(stats.totalRemaining)}
					icon={TrendingDown}
					accent="destructive"
					valueClassName="text-xl sm:text-2xl"
				/>
			</div>

			{/* Finance Breakdown Stats (Pure Base vs GST) */}
			<h3 className="text-sm font-semibold text-muted-foreground mt-4 mb-2">Finance Breakdown</h3>
			<div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
				<StatCard
					size="compact"
					label="Pure Revenue (No GST)"
					value={formatINR(pureBaseReceived > 0 ? pureBaseReceived : 0)}
					icon={Landmark}
					accent="info"
					valueClassName="text-xl sm:text-2xl"
				/>
				{/* <StatCard
					size="compact"
					label="Pure Due (No GST)"
					value={formatINR(pureBaseOutstanding > 0 ? pureBaseOutstanding : 0)}
					icon={Landmark}
					accent="warning"
					valueClassName="text-xl sm:text-2xl"
				/> */}
				{/* <StatCard
					size="compact"
					label="Total GST"
					value={formatINR(stats.totalGst)}
					icon={Receipt}
					accent="info"
					valueClassName="text-xl sm:text-2xl"
				/> */}
				<StatCard
					size="compact"
					label="GST Collected"
					value={formatINR(stats.gstCollected)}
					icon={CheckCircle2}
					accent="success"
					valueClassName="text-xl sm:text-2xl"
				/>
				{/* <StatCard
					size="compact"
					label="GST Remaining"
					value={formatINR(stats.gstRemaining)}
					icon={Hourglass}
					accent="destructive"
					valueClassName="text-xl sm:text-2xl"
				/> */}
			</div>

			{/* Projects View */}
			{currentView === "projects" && (
				<>
					<div className="flex items-center justify-between mt-6">
						<h2 className="text-lg font-semibold">Projects</h2>
						<span className="text-sm text-muted-foreground">
							{pagination ? `Page ${page} of ${pagination.pages}` : ""}
						</span>
					</div>
					{projects.length === 0 ? (
						<div className="text-center text-muted-foreground py-10 bg-muted/20 rounded-lg border border-dashed">
							No projects available.
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{projects.map((project) => (
								<Card
									key={project.projectId}
									className="cursor-pointer hover:shadow-md transition-shadow"
									onClick={() => goToTowers(project)}
								>
									<CardContent className="p-4 space-y-3">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-semibold text-base">
													{project.projectName}
												</h3>
												<p className="text-sm text-muted-foreground">
													{project.location}
												</p>
											</div>
											<Building2 className="h-5 w-5 text-muted-foreground" />
										</div>

										<div className="flex flex-col gap-1 text-xs text-muted-foreground border-t pt-2">
											<div className="flex justify-between items-center">
												<span>Booked: <strong className="text-foreground">{project.bookedSold || 0}</strong></span>
												{/* 🔥 Mentioned explicitly */}
												<span>Total Recv: <strong className="text-success">{formatINR(project.totalReceived || 0)}</strong> <span className="text-[10px]">(Incl. GST)</span></span>
											</div>
										</div>

										{/* GST Breakdown Per Project */}
										<div className="bg-muted/40 rounded p-2 text-xs grid grid-cols-3 gap-1 text-center">
											<div>
												<p className="text-muted-foreground text-[10px]">Total GST</p>
												<p className="font-medium">{formatINR(project.totalGst || 0)}</p>
											</div>
											<div>
												<p className="text-muted-foreground text-[10px]">Collected</p>
												<p className="font-medium text-success">{formatINR(project.gstCollected || 0)}</p>
											</div>
											<div>
												<p className="text-muted-foreground text-[10px]">Remaining</p>
												<p className="font-medium text-warning">{formatINR(project.gstRemaining || 0)}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
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
					<div className="flex items-center gap-3 mb-4">
						<Button variant="ghost" size="icon" onClick={goToProjects}>
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
					<h3 className="text-sm font-medium mb-3">Select a Tower</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{towers.map((tower) => (
							<Card
								key={tower}
								className="cursor-pointer hover:bg-muted/40 transition-colors"
								onClick={() => goToFloors(tower)}
							>
								<CardContent className="p-4 flex items-center gap-3">
									<Building2 className="h-5 w-5 text-muted-foreground" />
									<span className="font-medium">{tower}</span>
								</CardContent>
							</Card>
						))}
					</div>
				</>
			)}

			{/* Floors View */}
			{currentView === "floors" && selectedProject && selectedTower && (
				<>
					<div className="flex items-center gap-3 mb-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								setCurrentView("towers");
								setSelectedFloor("");
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
					<h3 className="text-sm font-medium mb-3">Select a Floor</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{floors.map((floor) => (
							<Card
								key={floor}
								className="cursor-pointer hover:bg-muted/40 transition-colors"
								onClick={() => goToFlats(floor)}
							>
								<CardContent className="p-4 flex items-center gap-3">
									<Layers className="h-5 w-5 text-muted-foreground" />
									<span className="font-medium">{floor}</span>
								</CardContent>
							</Card>
						))}
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

							return (
								<div
									key={uniqueKey}
									className={`border rounded-lg p-3 text-sm transition-all shadow-sm ${isSold
										? "bg-primary/10 border-primary dark:bg-primary/20"
										: isPending
											? "bg-amber-500/10 border-amber-500 dark:bg-amber-500/20"
											: "bg-background hover:border-primary"
										}`}
								>
									<div className="flex justify-between items-start mb-2">
										<span className="font-semibold text-base">
											{flat.flatNumber}
										</span>
										<Badge variant={variant} className="capitalize text-[10px] text-center max-w-[80px] leading-tight">
											{label}
										</Badge>
									</div>
									<p className="text-muted-foreground text-xs font-medium">
										{flat.tower} • Floor {flat.floor}
									</p>

									{(isSold || isPending) && (
										<>
											{flat.buyerName && (
												<p
													className="text-xs mt-2 font-medium truncate"
													title={flat.buyerName}
												>
													👤 {flat.buyerName}
												</p>
											)}
											<div className="mt-2 space-y-1">
												{/* 🔥 Added (Incl. GST) tag explicitly for transparency */}
												{flat.totalPaid > 0 && (
													<p className="text-[11px] text-success font-medium flex justify-between">
														<span>Paid: {formatINR(flat.totalPaid)}</span>
														<span className="text-[9px] text-muted-foreground opacity-80">(Incl. GST)</span>
													</p>
												)}
												{/* 🔥 Added (Incl. GST) tag explicitly for transparency */}
												{flat.remainingAmount > 0 && (
													<p className="text-[11px] text-destructive font-medium flex justify-between">
														<span>Due: {formatINR(flat.remainingAmount)}</span>
														<span className="text-[9px] text-muted-foreground opacity-80">(Incl. GST)</span>
													</p>
												)}
											</div>
										</>
									)}
								</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}