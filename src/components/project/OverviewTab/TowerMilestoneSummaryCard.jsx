// src/components/project/OverviewTab/TowerMilestoneSummaryCard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/useProject";
import {
	AlertTriangle,
	TrendingUp,
	Building2,
	Target,
	ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tower Milestone Summary Card
 * Shows tower milestone progress summary on project overview page
 *
 * @param {Object} props
 * @param {string} props.projectId - Project ID
 */
export function TowerMilestoneSummaryCard({ projectId }) {
	const navigate = useNavigate();
	const {
		towerMilestoneMatrix,
		towerMilestoneLoading,
		fetchTowerMilestoneMatrix,
	} = useProject();

	useEffect(() => {
		if (projectId) {
			fetchTowerMilestoneMatrix(projectId);
		}
	}, [projectId, fetchTowerMilestoneMatrix]);

	// Loading state
	if (towerMilestoneLoading && !towerMilestoneMatrix) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-48" />
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<Skeleton className="h-16" />
						<Skeleton className="h-20" />
						<Skeleton className="h-10" />
					</div>
				</CardContent>
			</Card>
		);
	}

	// No data state
	if (!towerMilestoneMatrix) {
		// Show a minimal card if no data is available
		return (
			<Card className="border-l-4 border-l-gray-300">
				<CardHeader>
					<CardTitle className="text-base flex items-center gap-2">
						<Target className="h-5 w-5 text-gray-400" />
						Tower Milestone Progress
					</CardTitle>
					<p className="text-xs text-muted-foreground mt-1">
						No tower milestone data available
					</p>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Tower milestones will appear here once configured for this project.
					</p>
					<Button
						variant="outline"
						size="sm"
						className="w-full mt-4"
						onClick={() => navigate(`/projects/${projectId}/tower-milestones`)}
					>
						Configure Milestones
						<ExternalLink className="h-4 w-4 ml-2" />
					</Button>
				</CardContent>
			</Card>
		);
	}

	const {
		totalTowers = 0,
		totalMilestones = 0,
		overallCompletionPercentage = 0,
		pendingReminders = [],
	} = towerMilestoneMatrix;

	// Get top 3 most overdue reminders
	const topOverdueReminders = pendingReminders
		.filter((r) => r.daysOverdue > 0)
		.sort((a, b) => b.daysOverdue - a.daysOverdue)
		.slice(0, 3);

	return (
		<Card className="border-l-4 border-l-indigo-500">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div>
					<CardTitle className="text-base flex items-center gap-2">
						<Target className="h-5 w-5 text-indigo-500" />
						Tower Milestone Progress
					</CardTitle>
					<p className="text-xs text-muted-foreground mt-1">
						Track completion status across all towers
					</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate(`/projects/${projectId}/tower-milestones`)}
					className="h-8 px-2"
				>
					<ExternalLink className="h-4 w-4" />
				</Button>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Overall Progress */}
				<div>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">Overall Completion</span>
						<span className="text-2xl font-bold text-indigo-600">
							{overallCompletionPercentage}%
						</span>
					</div>
					<Progress value={overallCompletionPercentage} className="h-2" />
				</div>

				{/* Statistics Grid */}
				<div className="grid grid-cols-3 gap-3 text-center">
					<div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
						<div className="flex items-center justify-center gap-1 mb-1">
							<Building2 className="h-3 w-3 text-blue-600" />
							<p className="text-xs text-muted-foreground">Towers</p>
						</div>
						<p className="text-lg font-bold text-blue-600">{totalTowers}</p>
					</div>
					<div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
						<div className="flex items-center justify-center gap-1 mb-1">
							<Target className="h-3 w-3 text-purple-600" />
							<p className="text-xs text-muted-foreground">Milestones</p>
						</div>
						<p className="text-lg font-bold text-purple-600">
							{totalMilestones}
						</p>
					</div>
					<div className="p-2 rounded-lg bg-red-50 border border-red-200">
						<div className="flex items-center justify-center gap-1 mb-1">
							<AlertTriangle className="h-3 w-3 text-red-600" />
							<p className="text-xs text-muted-foreground">Pending</p>
						</div>
						<p className="text-lg font-bold text-red-600">
							{pendingReminders.length}
						</p>
					</div>
				</div>

				{/* Top Overdue Reminders */}
				{topOverdueReminders.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<AlertTriangle className="h-4 w-4 text-red-500" />
							<h4 className="text-sm font-semibold">Top Overdue Milestones</h4>
						</div>
						<div className="space-y-2">
							{topOverdueReminders.map((reminder, idx) => (
								<div
									key={idx}
									className={cn(
										"flex items-center justify-between p-2 rounded border",
										"bg-red-50 border-red-200 hover:shadow-sm transition-shadow cursor-pointer",
									)}
									onClick={() =>
										navigate(`/projects/${projectId}/tower-milestones`)
									}
								>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{reminder.towerName} • {reminder.milestoneName}
										</p>
										<p className="text-xs text-muted-foreground">
											Progress: {reminder.currentProgress}%
										</p>
									</div>
									<Badge variant="destructive" className="ml-2 shrink-0">
										{reminder.daysOverdue}d overdue
									</Badge>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Success Message */}
				{pendingReminders.length === 0 && totalMilestones > 0 && (
					<div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
						<TrendingUp className="h-5 w-5 text-green-600" />
						<div>
							<p className="text-sm font-medium text-green-900">
								All Caught Up! 🎉
							</p>
							<p className="text-xs text-green-700">
								All milestones are on track or completed
							</p>
						</div>
					</div>
				)}

				{/* View Full Matrix Button */}
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={() => navigate(`/projects/${projectId}/tower-milestones`)}
				>
					View Full Matrix
					<ExternalLink className="h-4 w-4 ml-2" />
				</Button>
			</CardContent>
		</Card>
	);
}
