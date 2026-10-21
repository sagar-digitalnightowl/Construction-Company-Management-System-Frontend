// src/components/project/TowerMilestoneCell.jsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Clock, AlertTriangle, Circle } from "lucide-react";

/**
 * Tower Milestone Cell Component
 * Individual cell in the matrix table with color-coded status
 *
 * Color Scheme:
 * - Green: Completed (isCompleted = true)
 * - Yellow: In Progress (progress > 0 && !isCompleted)
 * - Red: Overdue (daysOverdue > 0 && !isCompleted)
 * - Gray: Not Started (progress = 0 && !overdue)
 *
 * @param {Object} props
 * @param {string} props.towerName - Tower name
 * @param {Object} props.milestone - Milestone object
 * @param {Object} props.data - Milestone progress data
 * @param {Function} props.onClick - Click handler
 */
export function TowerMilestoneCell({ towerName, milestone, data, onClick }) {
	if (!data) {
		return (
			<div className="p-2 text-center text-muted-foreground text-xs">
				No data
			</div>
		);
	}

	const {
		isCompleted,
		progress = 0,
		hasEntry,
		notes,
		completedAt,
	} = data;

	// Calculate if overdue
	const dueDate = milestone?.dueDate ? new Date(milestone.dueDate) : null;
	const now = new Date();
	const isOverdue = dueDate && dueDate < now && !isCompleted;
	const daysOverdue = isOverdue
		? Math.floor((now - dueDate) / (1000 * 60 * 60 * 24))
		: 0;

	// Determine status and color
	let status = "not-started";
	let statusColor = "gray";
	let bgColor = "bg-gray-50";
	let borderColor = "border-gray-200";
	let textColor = "text-gray-600";
	let icon = Circle;

	if (isCompleted) {
		status = "completed";
		statusColor = "green";
		bgColor = "bg-green-50";
		borderColor = "border-green-300";
		textColor = "text-green-700";
		icon = Check;
	} else if (isOverdue) {
		status = "overdue";
		statusColor = "red";
		bgColor = "bg-red-50";
		borderColor = "border-red-300";
		textColor = "text-red-700";
		icon = AlertTriangle;
	} else if (progress > 0) {
		status = "in-progress";
		statusColor = "yellow";
		bgColor = "bg-yellow-50";
		borderColor = "border-yellow-300";
		textColor = "text-yellow-700";
		icon = Clock;
	}

	const Icon = icon;

	return (
		<div
			className={cn(
				"p-2 border rounded-md cursor-pointer transition-all hover:shadow-md hover:scale-105",
				bgColor,
				borderColor,
				"min-h-[80px] flex flex-col items-center justify-center space-y-1",
			)}
			onClick={onClick}
		>
			{/* Icon */}
			<Icon className={cn("h-5 w-5", textColor)} />

			{/* Progress Percentage */}
			<div className={cn("text-lg font-bold", textColor)}>
				{progress}%
			</div>

			{/* Status Badge */}
			<Badge
				variant={
					statusColor === "green"
						? "default"
						: statusColor === "red"
							? "destructive"
							: statusColor === "yellow"
								? "warning"
								: "secondary"
				}
				className="text-xs"
			>
				{status === "completed" && "Complete"}
				{status === "in-progress" && "In Progress"}
				{status === "overdue" && `${daysOverdue}d overdue`}
				{status === "not-started" && "Not Started"}
			</Badge>

			{/* Additional Info */}
			{completedAt && status === "completed" && (
				<div className="text-xs text-muted-foreground">
					{new Date(completedAt).toLocaleDateString()}
				</div>
			)}

			{/* Notes Indicator */}
			{notes && (
				<div className="text-xs text-muted-foreground truncate w-full text-center">
					📝 {notes.substring(0, 20)}
					{notes.length > 20 && "..."}
				</div>
			)}
		</div>
	);
}
