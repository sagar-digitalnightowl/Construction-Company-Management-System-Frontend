// src/lib/towerMilestoneHelpers.js
/**
 * Utility functions for Tower Milestone feature
 */

/**
 * Calculate days overdue from a due date
 * @param {string|Date} dueDate - Due date
 * @returns {number} Days overdue (0 if not overdue)
 */
export function calculateDaysOverdue(dueDate) {
	if (!dueDate) return 0;
	const due = new Date(dueDate);
	const now = new Date();
	const diffTime = now - due;
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	return Math.max(0, diffDays);
}

/**
 * Get status color class based on milestone state
 * @param {boolean} isCompleted - Is milestone completed
 * @param {number} progress - Progress percentage
 * @param {number} daysOverdue - Days overdue
 * @returns {string} Color class name
 */
export function getStatusColor(isCompleted, progress, daysOverdue) {
	if (isCompleted) return "green";
	if (daysOverdue > 0) return "red";
	if (progress > 0) return "yellow";
	return "gray";
}

/**
 * Get status label based on milestone state
 * @param {boolean} isCompleted - Is milestone completed
 * @param {number} progress - Progress percentage
 * @param {number} daysOverdue - Days overdue
 * @returns {string} Status label
 */
export function getStatusLabel(isCompleted, progress, daysOverdue) {
	if (isCompleted) return "Complete";
	if (daysOverdue > 0) return `${daysOverdue}d overdue`;
	if (progress > 0) return "In Progress";
	return "Not Started";
}

/**
 * Sort reminders by priority (most critical first)
 * @param {Array} reminders - Array of reminder objects
 * @returns {Array} Sorted reminders
 */
export function sortRemindersByPriority(reminders) {
	return [...reminders].sort((a, b) => {
		// First priority: days overdue (descending)
		if (a.daysOverdue !== b.daysOverdue) {
			return b.daysOverdue - a.daysOverdue;
		}
		// Second priority: progress (ascending - less progress = higher priority)
		if (a.currentProgress !== b.currentProgress) {
			return a.currentProgress - b.currentProgress;
		}
		// Third priority: alphabetical by tower name
		return a.towerName.localeCompare(b.towerName);
	});
}

/**
 * Calculate overall statistics from matrix data
 * @param {Object} matrixData - Tower milestone matrix data
 * @returns {Object} Statistics object
 */
export function calculateStatistics(matrixData) {
	if (!matrixData || !matrixData.towers) {
		return {
			totalMilestones: 0,
			completedMilestones: 0,
			pendingMilestones: 0,
			overdueMilestones: 0,
			inProgressMilestones: 0,
		};
	}

	const stats = {
		totalMilestones: 0,
		completedMilestones: 0,
		pendingMilestones: 0,
		overdueMilestones: 0,
		inProgressMilestones: 0,
	};

	matrixData.towers.forEach((tower) => {
		tower.milestones?.forEach((milestone) => {
			stats.totalMilestones++;
			if (milestone.isCompleted) {
				stats.completedMilestones++;
			} else if (milestone.daysOverdue > 0) {
				stats.overdueMilestones++;
			} else if (milestone.progress > 0) {
				stats.inProgressMilestones++;
			} else {
				stats.pendingMilestones++;
			}
		});
	});

	return stats;
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format style ('short', 'medium', 'long')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = "short") {
	if (!date) return "N/A";
	
	const d = new Date(date);
	if (isNaN(d.getTime())) return "Invalid Date";

	const options = {
		short: { month: "short", day: "numeric", year: "numeric" },
		medium: { month: "long", day: "numeric", year: "numeric" },
		long: { 
			weekday: "long", 
			month: "long", 
			day: "numeric", 
			year: "numeric" 
		},
	};

	return d.toLocaleDateString("en-US", options[format] || options.short);
}

/**
 * Export matrix data to CSV format
 * @param {Object} matrixData - Tower milestone matrix data
 * @returns {string} CSV string
 */
export function exportToCSV(matrixData) {
	if (!matrixData || !matrixData.towers || !matrixData.milestones) {
		return "";
	}

	// CSV Header
	let csv = "Tower Name,Milestone Name,Due Date,Status,Progress,Completed Date,Notes\n";

	// CSV Rows
	matrixData.towers.forEach((tower) => {
		tower.milestones?.forEach((milestoneData) => {
			const milestone = matrixData.milestones.find(
				(m) => m._id === milestoneData.milestoneId,
			);
			if (!milestone) return;

			const status = getStatusLabel(
				milestoneData.isCompleted,
				milestoneData.progress,
				calculateDaysOverdue(milestone.dueDate),
			);

			const row = [
				tower.towerName,
				milestone.name,
				formatDate(milestone.dueDate),
				status,
				`${milestoneData.progress}%`,
				milestoneData.completedAt ? formatDate(milestoneData.completedAt) : "",
				(milestoneData.notes || "").replace(/,/g, ";"), // Escape commas
			];

			csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
		});
	});

	return csv;
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} fileName - File name (without extension)
 */
export function downloadCSV(csvContent, fileName = "tower-milestones") {
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);
	
	link.setAttribute("href", url);
	link.setAttribute("download", `${fileName}-${Date.now()}.csv`);
	link.style.visibility = "hidden";
	
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	
	URL.revokeObjectURL(url);
}

/**
 * Validate milestone data
 * @param {Object} data - Milestone data to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateMilestoneData(data) {
	const errors = [];

	if (data.progress < 0 || data.progress > 100) {
		errors.push("Progress must be between 0 and 100");
	}

	if (data.isCompleted && data.progress !== 100) {
		errors.push("Completed milestones must have 100% progress");
	}

	if (!data.isCompleted && data.progress === 100) {
		errors.push("100% progress milestones should be marked as completed");
	}

	if (data.expectedCompletionDate) {
		const date = new Date(data.expectedCompletionDate);
		if (isNaN(date.getTime())) {
			errors.push("Invalid expected completion date");
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
