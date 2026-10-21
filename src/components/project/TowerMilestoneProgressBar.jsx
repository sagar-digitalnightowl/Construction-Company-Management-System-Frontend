// src/components/project/TowerMilestoneProgressBar.jsx
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Circle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tower Milestone Progress Bar Component
 * Visual progress bar for tower detail view
 *
 * @param {Object} props
 * @param {Object} props.milestone - Milestone object with name, dueDate, etc.
 * @param {number} props.progress - Progress value (0-100)
 * @param {boolean} props.isCompleted - Completion status
 * @param {string} props.completedAt - Completion date (ISO string)
 * @param {string} props.notes - Optional notes
 * @param {Function} props.onClick - Optional click handler
 */
export function TowerMilestoneProgressBar({
	milestone,
	progress = 0,
	isCompleted = false,
	completedAt,
	notes,
	onClick,
}) {
	// Determine status icon and color
	const getStatusIcon = () => {
		if (isCompleted) return Check;
		if (progress > 0) return Clock;
		return Circle;
	};

	const getStatusColor = () => {
		if (isCompleted) return "text-green-600";
		if (progress > 0) return "text-yellow-600";
		return "text-gray-400";
	};

	const getProgressBarColor = () => {
		if (isCompleted) return "bg-green-500";
		if (progress > 0) return "bg-yellow-500";
		return "bg-gray-300";
	};

	const StatusIcon = getStatusIcon();

	return (
		<div
			className={cn(
				"p-3 border rounded-lg space-y-2 transition-all",
				onClick && "cursor-pointer hover:shadow-md hover:border-primary",
				isCompleted && "bg-green-50 border-green-200",
				!isCompleted && progress > 0 && "bg-yellow-50 border-yellow-200",
			)}
			onClick={onClick}
		>
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-2 flex-1">
					<StatusIcon className={cn("h-5 w-5", getStatusColor())} />
					<div className="flex-1">
						<h4 className="font-medium text-sm">
							{milestone?.name || milestone?.milestoneName || "Milestone"}
						</h4>
						{milestone?.dueDate && (
							<p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
								<Calendar className="h-3 w-3" />
								Due: {new Date(milestone.dueDate).toLocaleDateString()}
							</p>
						)}
					</div>
				</div>

				{/* Status Badge */}
				<Badge
					variant={
						isCompleted
							? "default"
							: progress > 0
								? "secondary"
								: "outline"
					}
					className="text-xs"
				>
					{isCompleted ? "Complete" : progress > 0 ? "In Progress" : "Pending"}
				</Badge>
			</div>

			{/* Progress Bar */}
			<div className="space-y-1">
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">Progress</span>
					<span className="font-semibold">{progress}%</span>
				</div>
				<Progress
					value={progress}
					className="h-2"
					indicatorClassName={getProgressBarColor()}
				/>
			</div>

			{/* Completion Info */}
			{isCompleted && completedAt && (
				<div className="text-xs text-muted-foreground flex items-center gap-1">
					<Check className="h-3 w-3 text-green-600" />
					Completed on {new Date(completedAt).toLocaleDateString()}
				</div>
			)}

			{/* Notes */}
			{notes && (
				<div className="text-xs text-muted-foreground bg-white rounded p-2 border">
					<span className="font-medium">Notes:</span> {notes}
				</div>
			)}
		</div>
	);
}
