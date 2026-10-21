// src/pages/projects/TowerMilestonesMatrix.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/hooks/useProject";
import { TowerMilestoneCell } from "@/components/project/TowerMilestoneCell";
import { ReminderCard } from "@/components/project/ReminderCard";
import { TowerMilestoneProgressBar } from "@/components/project/TowerMilestoneProgressBar";
import { TowerMilestoneModal } from "@/components/project/TowerMilestoneModal";
import { BulkMilestoneImport } from "@/components/project/BulkMilestoneImport";
import {
	ArrowLeft,
	Building2,
	Target,
	AlertCircle,
	TrendingUp,
	Download,
	RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV, downloadCSV } from "@/lib/towerMilestoneHelpers";

/**
 * Tower Milestones Matrix Page
 * Main feature page for tracking tower milestone completion
 *
 * Features:
 * - Matrix View: Table with towers × milestones
 * - Reminder View: Overdue/pending milestone cards
 * - Tower Detail View: Progress bars per tower
 * - Summary statistics
 * - Bulk import/export
 */
export default function TowerMilestonesMatrix() {
	const { id: projectId } = useParams();
	const navigate = useNavigate();

	const {
		towerMilestoneMatrix,
		towerMilestoneLoading,
		fetchTowerMilestoneMatrix,
	} = useProject();

	const [activeTab, setActiveTab] = useState("matrix");
	const [modalState, setModalState] = useState({
		open: false,
		towerName: null,
		milestone: null,
		existingData: null,
	});

	// Fetch matrix data on mount
	useEffect(() => {
		if (projectId) {
			fetchTowerMilestoneMatrix(projectId);
		}
	}, [projectId, fetchTowerMilestoneMatrix]);

	// Loading skeleton
	if (towerMilestoneLoading && !towerMilestoneMatrix) {
		return <LoadingSkeleton />;
	}

	// Extract data with fallbacks
	const data = towerMilestoneMatrix || {};
	const {
		projectName = "Project",
		totalTowers = 0,
		totalMilestones = 0,
		overallCompletionPercentage = 0,
		towers = [],
		milestones = [],
		pendingReminders = [],
	} = data;

	// Calculate additional stats
	const totalCompleted = towers.reduce(
		(sum, tower) => sum + (tower.completedMilestones || 0),
		0,
	);
	const totalPossible = totalTowers * totalMilestones;
	const overdueCount = pendingReminders.filter((r) => r.daysOverdue > 0).length;

	// Handle cell click - open modal to mark/update milestone
	const handleCellClick = (towerName, milestone, existingData) => {
		setModalState({
			open: true,
			towerName,
			milestone,
			existingData,
		});
	};

	// Handle modal success - close and refresh
	const handleModalSuccess = () => {
		setModalState({
			open: false,
			towerName: null,
			milestone: null,
			existingData: null,
		});
		fetchTowerMilestoneMatrix(projectId);
	};

	// Handle reminder card click
	const handleReminderClick = (reminder) => {
		const milestone = milestones.find((m) => m._id === reminder.milestoneId);
		if (milestone) {
			handleCellClick(reminder.towerName, milestone, null);
		}
	};

	// Refresh data
	const handleRefresh = () => {
		fetchTowerMilestoneMatrix(projectId);
	};

	// Export to CSV
	const handleExportCSV = () => {
		if (!towerMilestoneMatrix) return;
		const csv = exportToCSV(towerMilestoneMatrix);
		downloadCSV(csv, `${projectName}-tower-milestones`);
	};

	return (
		<div className="p-6 space-y-6 max-w-[1600px] mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate(`/projects/${projectId}`)}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold">{projectName}</h1>
						<p className="text-sm text-muted-foreground">
							Tower Milestone Progress Tracking
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={towerMilestoneLoading}
					>
						<RefreshCw
							className={cn(
								"h-4 w-4 mr-2",
								towerMilestoneLoading && "animate-spin",
							)}
						/>
						Refresh
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleExportCSV}
						disabled={!towerMilestoneMatrix || towers.length === 0}
					>
						<Download className="h-4 w-4 mr-2" />
						Export CSV
					</Button>
					<BulkMilestoneImport
						projectId={projectId}
						towers={towers}
						milestones={milestones}
						onSuccess={() => fetchTowerMilestoneMatrix(projectId)}
					/>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				{/* Total Towers */}
				<Card className="border-l-4 border-l-blue-500">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm flex items-center gap-2">
							<Building2 className="h-4 w-4 text-blue-500" />
							Total Towers
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalTowers}</p>
					</CardContent>
				</Card>

				{/* Total Milestones */}
				<Card className="border-l-4 border-l-purple-500">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm flex items-center gap-2">
							<Target className="h-4 w-4 text-purple-500" />
							Total Milestones
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{totalMilestones}</p>
					</CardContent>
				</Card>

				{/* Completed */}
				<Card className="border-l-4 border-l-green-500">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-green-500" />
							Completed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">
							{totalCompleted}
							<span className="text-sm text-muted-foreground ml-1">
								/ {totalPossible}
							</span>
						</p>
					</CardContent>
				</Card>

				{/* Pending Reminders */}
				<Card className="border-l-4 border-l-amber-500">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm flex items-center gap-2">
							<AlertCircle className="h-4 w-4 text-amber-500" />
							Pending
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">
							{pendingReminders.length}
							{overdueCount > 0 && (
								<Badge variant="destructive" className="ml-2 text-xs">
									{overdueCount} overdue
								</Badge>
							)}
						</p>
					</CardContent>
				</Card>

				{/* Overall Completion */}
				<Card className="border-l-4 border-l-indigo-500">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Overall Progress</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-indigo-600">
							{overallCompletionPercentage}%
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-grid">
					<TabsTrigger value="matrix">Matrix View</TabsTrigger>
					<TabsTrigger value="reminders">
						Reminders
						{pendingReminders.length > 0 && (
							<Badge variant="secondary" className="ml-2">
								{pendingReminders.length}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="towers">Tower Details</TabsTrigger>
				</TabsList>

				{/* TAB 1: Matrix View */}
				<TabsContent value="matrix" className="space-y-4 mt-4">
					<Card>
						<CardHeader>
							<CardTitle>Tower × Milestone Matrix</CardTitle>
							<p className="text-sm text-muted-foreground">
								Click any cell to mark complete or update progress
							</p>
						</CardHeader>
						<CardContent className="overflow-x-auto">
							{towers.length === 0 || milestones.length === 0 ? (
								<div className="text-center py-12 text-muted-foreground">
									<Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p className="font-medium">No data available</p>
									<p className="text-sm">
										{towers.length === 0
											? "No towers found in this project"
											: "No milestones defined for this project"}
									</p>
								</div>
							) : (
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th className="border p-3 text-left font-semibold bg-muted sticky left-0 z-10">
												Tower / Milestone
											</th>
											{milestones.map((milestone) => (
												<th
													key={milestone._id}
													className="border p-3 text-center font-semibold bg-muted min-w-[150px]"
												>
													<div className="text-sm font-semibold">
														{milestone.name}
													</div>
													<div className="text-xs text-muted-foreground mt-1">
														Due:{" "}
														{milestone.dueDate
															? new Date(
																	milestone.dueDate,
																).toLocaleDateString()
															: "N/A"}
													</div>
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{towers.map((tower) => (
											<tr key={tower.towerName}>
												<td className="border p-3 font-medium bg-muted/50 sticky left-0 z-10">
													<div className="flex items-center justify-between">
														<span>{tower.towerName}</span>
														<Badge variant="outline" className="text-xs">
															{tower.completionPercentage}%
														</Badge>
													</div>
												</td>
												{tower.milestones.map((milestoneData) => {
													const milestone = milestones.find(
														(m) => m._id === milestoneData.milestoneId,
													);
													return (
														<td key={milestoneData.milestoneId} className="border p-2">
															<TowerMilestoneCell
																towerName={tower.towerName}
																milestone={milestone}
																data={milestoneData}
																onClick={() =>
																	handleCellClick(
																		tower.towerName,
																		milestone,
																		milestoneData.hasEntry
																			? milestoneData
																			: null,
																	)
																}
															/>
														</td>
													);
												})}
											</tr>
										))}
									</tbody>
								</table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* TAB 2: Reminders View */}
				<TabsContent value="reminders" className="space-y-4 mt-4">
					{pendingReminders.length === 0 ? (
						<Card>
							<CardContent className="p-12 text-center">
								<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
									<TrendingUp className="h-8 w-8 text-green-600" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									All Caught Up! 🎉
								</h3>
								<p className="text-muted-foreground">
									No pending reminders. All milestones are on track or completed.
								</p>
							</CardContent>
						</Card>
					) : (
						<>
							{/* Filter Badges */}
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">
									Showing {pendingReminders.length} pending milestone(s)
								</span>
								{overdueCount > 0 && (
									<Badge variant="destructive">
										{overdueCount} overdue
									</Badge>
								)}
							</div>

							{/* Reminder Cards Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{pendingReminders
									.sort((a, b) => b.daysOverdue - a.daysOverdue)
									.map((reminder, idx) => (
										<ReminderCard
											key={idx}
											reminder={reminder}
											onMarkComplete={() =>
												handleReminderClick(reminder)
											}
										/>
									))}
							</div>
						</>
					)}
				</TabsContent>

				{/* TAB 3: Tower Details View */}
				<TabsContent value="towers" className="space-y-4 mt-4">
					{towers.length === 0 ? (
						<Card>
							<CardContent className="p-12 text-center text-muted-foreground">
								<Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p className="font-medium">No towers found</p>
								<p className="text-sm">
									Add towers to this project to track their milestone progress
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{towers.map((tower) => (
								<Card key={tower.towerName}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="flex items-center gap-2">
												<Building2 className="h-5 w-5 text-blue-500" />
												{tower.towerName}
											</CardTitle>
											<Badge
												variant={
													tower.completionPercentage === 100
														? "default"
														: tower.completionPercentage > 0
															? "secondary"
															: "outline"
												}
											>
												{tower.completionPercentage}% Complete
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{tower.completedMilestones} of {tower.totalMilestones}{" "}
											milestones completed
										</p>
									</CardHeader>
									<CardContent className="space-y-3">
										{tower.milestones.length === 0 ? (
											<p className="text-sm text-muted-foreground text-center py-4">
												No milestones defined
											</p>
										) : (
											tower.milestones.map((milestoneData) => {
												const milestone = milestones.find(
													(m) => m._id === milestoneData.milestoneId,
												);
												return (
													<TowerMilestoneProgressBar
														key={milestoneData.milestoneId}
														milestone={milestone}
														progress={milestoneData.progress}
														isCompleted={milestoneData.isCompleted}
														completedAt={milestoneData.completedAt}
														notes={milestoneData.notes}
														onClick={() =>
															handleCellClick(
																tower.towerName,
																milestone,
																milestoneData.hasEntry
																	? milestoneData
																	: null,
															)
														}
													/>
												);
											})
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Modal */}
			<TowerMilestoneModal
				open={modalState.open}
				onOpenChange={(open) =>
					!open &&
					setModalState({
						open: false,
						towerName: null,
						milestone: null,
						existingData: null,
					})
				}
				projectId={projectId}
				towerName={modalState.towerName}
				milestone={modalState.milestone}
				existingData={modalState.existingData}
				onSuccess={handleModalSuccess}
			/>
		</div>
	);
}

/**
 * Loading Skeleton Component
 */
function LoadingSkeleton() {
	return (
		<div className="p-6 space-y-6 max-w-[1600px] mx-auto">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Skeleton className="h-10 w-10 rounded" />
					<div className="space-y-2">
						<Skeleton className="h-8 w-64" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-9 w-24" />
					<Skeleton className="h-9 w-32" />
				</div>
			</div>

			{/* Summary Cards Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton key={i} className="h-24" />
				))}
			</div>

			{/* Content Skeleton */}
			<Skeleton className="h-96" />
		</div>
	);
}
