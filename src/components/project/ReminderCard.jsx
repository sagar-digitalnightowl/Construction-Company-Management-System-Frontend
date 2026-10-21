// src/components/project/ReminderCard.jsx
import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	AlertTriangle,
	Calendar,
	TrendingUp,
	Building2,
	Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reminder Card Component
 * Displays overdue or pending milestone information
 *
 * @param {Object} props
 * @param {Object} props.reminder - Reminder data object
 * @param {string} props.reminder.towerName - Tower name
 * @param {string} props.reminder.milestoneName - Milestone name
 * @param {string} props.reminder.milestoneDueDate - Due date (ISO string)
 * @param {number} props.reminder.currentProgress - Current progress (0-100)
 * @param {number} props.reminder.daysOverdue - Days overdue (0 = not overdue)
 * @param {string} props.reminder.expectedCompletionDate - Expected completion date
 * @param {Function} props.onMarkComplete - Handler for mark complete button
 */
export function ReminderCard({ reminder, onMarkComplete }) {
	const {
		towerName,
		milestoneName,
		milestoneDueDate,
		currentProgress = 0,
		daysOverdue = 0,
		expectedCompletionDate,
	} = reminder;

	const isOverdue = daysOverdue > 0;
	const isPending = !isOverdue && currentProgress === 0;
	const isInProgress = !isOverdue && currentProgress > 0;

	// Determine card styling based on status
	const getBorderColor = () => {
		if (isOverdue) return "border-l-red-500";
		if (isInProgress) return "border-l-yellow-500";
		return "border-l-blue-500";
	};

	const getStatusBadge = () => {
		if (isOverdue) {
			return (
				<Badge variant="destructive" className="font-semibold">
					<AlertTriangle className="h-3 w-3 mr-1" />
					{daysOverdue} day{daysOverdue !== 1 ? "s" : ""} overdue
				</Badge>
			);
		}
		if (isInProgress) {
			return (
				<Badge variant="warning" className="font-semibold">
					<TrendingUp className="h-3 w-3 mr-1" />
					In Progress
				</Badge>
			);
		}
		return (
			<Badge variant="secondary" className="font-semibold">
				<Target className="h-3 w-3 mr-1" />
				Pending
			</Badge>
		);
	};

	return (
		<Card
			className={cn(
				"border-l-4 hover:shadow-lg transition-shadow",
				getBorderColor(),
			)}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-base flex items-center gap-2">
							<Building2 className="h-4 w-4 text-muted-foreground" />
							{towerName}
						</CardTitle>
						<p className="text-sm text-muted-foreground mt-1">
							{milestoneName}
						</p>
					</div>
					{getStatusBadge()}
				</div>
			</CardHeader>

			<CardContent className="space-y-3">
				{/* Progress Bar */}
				{currentProgress > 0 && (
					<div className="space-y-1">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Progress</span>
							<span className="font-medium">{currentProgress}%</span>
						</div>
						<Progress value={currentProgress} className="h-2" />
					</div>
				)}

				{/* Due Date */}
				<div className="flex items-center gap-2 text-sm">
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<span className="text-muted-foreground">Due:</span>
					<span
						className={cn(
							"font-medium",
							isOverdue && "text-red-600",
						)}
					>
						{milestoneDueDate
							? new Date(milestoneDueDate).toLocaleDateString()
							: "No date"}
					</span>
				</div>

				{/* Expected Completion Date */}
				{expectedCompletionDate && (
					<div className="flex items-center gap-2 text-sm">
						<Target className="h-4 w-4 text-muted-foreground" />
						<span className="text-muted-foreground">Expected:</span>
						<span className="font-medium">
							{new Date(expectedCompletionDate).toLocaleDateString()}
						</span>
					</div>
				)}

				{/* Action Button */}
				<Button
					variant={isOverdue ? "destructive" : "default"}
					size="sm"
					className="w-full mt-2"
					onClick={onMarkComplete}
				>
					{isOverdue && <AlertTriangle className="h-4 w-4 mr-2" />}
					Mark as Complete
				</Button>
			</CardContent>
		</Card>
	);
}
