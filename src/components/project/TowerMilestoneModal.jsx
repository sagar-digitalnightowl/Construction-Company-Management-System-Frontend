// src/components/project/TowerMilestoneModal.jsx
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useProject } from "@/hooks/useProject";
import { Loader2, Check, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Tower Milestone Modal Component
 * Handles marking complete, updating progress, and unmarking milestones
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onOpenChange - Handler for open state change
 * @param {string} props.projectId - Project ID
 * @param {string} props.towerName - Tower name (e.g., "Tower A")
 * @param {Object} props.milestone - Milestone object with _id, name, description, dueDate
 * @param {Object} props.existingData - Existing progress data (for edit mode)
 * @param {Function} props.onSuccess - Callback after successful operation
 */
export function TowerMilestoneModal({
	open,
	onOpenChange,
	projectId,
	towerName,
	milestone,
	existingData,
	onSuccess,
}) {
	const {
		markTowerMilestoneComplete,
		updateTowerMilestoneProgress,
		unmarkTowerMilestone,
	} = useProject();

	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		isCompleted: false,
		progress: 0,
		notes: "",
		expectedCompletionDate: "",
	});

	// Initialize form data when modal opens or data changes
	useEffect(() => {
		if (open && milestone) {
			if (existingData && existingData.hasEntry) {
				// Edit mode - populate with existing data
				setFormData({
					isCompleted: existingData.isCompleted || false,
					progress: existingData.progress || 0,
					notes: existingData.notes || "",
					expectedCompletionDate:
						existingData.expectedCompletionDate || "",
				});
			} else {
				// Add mode - reset to defaults
				setFormData({
					isCompleted: false,
					progress: 0,
					notes: "",
					expectedCompletionDate: "",
				});
			}
		}
	}, [open, milestone, existingData]);

	const handleSave = async () => {
		if (!projectId || !towerName || !milestone?._id) return;

		setLoading(true);
		try {
			await markTowerMilestoneComplete(
				projectId,
				towerName,
				milestone._id,
				formData,
			);
			onSuccess?.();
			onOpenChange(false);
		} catch (err) {
			// Error already handled by hook
		} finally {
			setLoading(false);
		}
	};

	const handleUnmark = async () => {
		if (!projectId || !towerName || !milestone?._id) return;

		setLoading(true);
		try {
			await unmarkTowerMilestone(projectId, towerName, milestone._id);
			onSuccess?.();
			onOpenChange(false);
		} catch (err) {
			// Error already handled by hook
		} finally {
			setLoading(false);
		}
	};

	const handleProgressChange = (value) => {
		setFormData((prev) => ({
			...prev,
			progress: value[0],
		}));
	};

	const handleCompletedToggle = (checked) => {
		setFormData((prev) => ({
			...prev,
			isCompleted: checked,
			progress: checked ? 100 : prev.progress,
		}));
	};

	if (!milestone) return null;

	const isEditMode = existingData && existingData.hasEntry;
	const isDueDatePassed =
		milestone.dueDate && new Date(milestone.dueDate) < new Date();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Update" : "Mark"} Milestone Progress
					</DialogTitle>
					<DialogDescription>
						{towerName} • {milestone.name}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Due Date Warning */}
					{isDueDatePassed && !formData.isCompleted && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								This milestone is overdue! Due date was{" "}
								{new Date(milestone.dueDate).toLocaleDateString()}
							</AlertDescription>
						</Alert>
					)}

					{/* Milestone Details */}
					<div className="text-sm text-muted-foreground">
						{milestone.description && <p>{milestone.description}</p>}
						{milestone.dueDate && (
							<p className="mt-1">
								Due: {new Date(milestone.dueDate).toLocaleDateString()}
							</p>
						)}
					</div>

					{/* Completion Status */}
					<div className="flex items-center space-x-2">
						<Checkbox
							id="isCompleted"
							checked={formData.isCompleted}
							onCheckedChange={handleCompletedToggle}
						/>
						<Label
							htmlFor="isCompleted"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Mark as completed
						</Label>
					</div>

					{/* Progress Slider */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>Progress</Label>
							<span className="text-sm font-medium">
								{formData.progress}%
							</span>
						</div>
						<Slider
							value={[formData.progress]}
							onValueChange={handleProgressChange}
							max={100}
							step={5}
							className="w-full"
							disabled={formData.isCompleted}
						/>
					</div>

					{/* Expected Completion Date (only if not completed) */}
					{!formData.isCompleted && (
						<div className="space-y-2">
							<Label htmlFor="expectedDate">
								Expected Completion Date
							</Label>
							<Input
								id="expectedDate"
								type="date"
								value={formData.expectedCompletionDate}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										expectedCompletionDate: e.target.value,
									}))
								}
							/>
						</div>
					)}

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Notes (Optional)</Label>
						<Textarea
							id="notes"
							placeholder="Add notes about this milestone progress..."
							value={formData.notes}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									notes: e.target.value,
								}))
							}
							rows={3}
						/>
					</div>
				</div>

				<DialogFooter className="flex justify-between sm:justify-between">
					<div>
						{isEditMode && (
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={handleUnmark}
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Unmarking...
									</>
								) : (
									<>
										<X className="h-4 w-4 mr-2" />
										Unmark
									</>
								)}
							</Button>
						)}
					</div>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="button" onClick={handleSave} disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Check className="h-4 w-4 mr-2" />
									Save
								</>
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
