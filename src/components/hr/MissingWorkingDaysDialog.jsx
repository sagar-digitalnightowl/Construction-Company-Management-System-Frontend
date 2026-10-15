import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MissingWorkingDaysDialog = ({
	open,
	onOpenChange,
	employee,
	month,
	year,
	onContinue,
}) => {
	const navigate = useNavigate();

	const formatMonth = () => {
		if (!month || !year) return "";
		const monthNames = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December",
		];
		const monthIndex = monthNames.indexOf(month);
		if (monthIndex === -1) return `${month} ${year}`;
		
		// Convert to YYYY-MM format for URL
		const monthNum = String(monthIndex + 1).padStart(2, "0");
		return {
			display: `${month} ${year}`,
			urlFormat: `${year}-${monthNum}`,
		};
	};

	const handleGoToWorkingDays = () => {
		const formatted = formatMonth();
		if (formatted.urlFormat) {
			// Navigate to working days page with pre-selected month
			navigate(`/hr/salary/working-days?month=${formatted.urlFormat}`);
		} else {
			navigate("/hr/salary/working-days");
		}
		onOpenChange(false);
	};

	const handleContinue = () => {
		onContinue();
		onOpenChange(false);
	};

	const formatted = formatMonth();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<div className="flex items-center gap-2 mb-2">
						<AlertTriangle className="h-6 w-6 text-amber-500" />
						<DialogTitle>Missing Working Days Entry</DialogTitle>
					</div>
					<DialogDescription>
						This employee doesn't have a working days entry for the selected month.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Employee Info */}
					<div className="bg-muted p-4 rounded-lg space-y-2">
						<div className="flex items-start justify-between">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4 text-muted-foreground" />
									<span className="font-semibold">{employee?.name || "Unknown Employee"}</span>
								</div>
								{employee?.employeeCode && (
									<p className="text-sm text-muted-foreground font-mono">
										{employee.employeeCode}
									</p>
								)}
							</div>
							<Badge variant="outline">{employee?.role || "Employee"}</Badge>
						</div>
						
						<div className="flex items-center gap-2 pt-2 border-t">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">{formatted.display || `${month} ${year}`}</span>
						</div>
					</div>

					{/* Warning Message */}
					<div className="space-y-3">
						<div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
							<AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
							<div className="space-y-1">
								<p className="font-medium">Working days entry not found</p>
								<p className="text-amber-800">
									The salary slip will be generated using fallback calculations:
								</p>
							</div>
						</div>

						<div className="pl-7 space-y-2 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-blue-500"></div>
								<span>Attendance data (present + ½ × half-days)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-gray-500"></div>
								<span>OR default day divisor (26 for office / 30 for site)</span>
							</div>
						</div>

						<p className="text-sm text-muted-foreground pl-7">
							This may result in <strong>inaccurate salary calculations</strong>.
						</p>
					</div>

					{/* Recommendation */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
						<p className="text-sm text-blue-900">
							<strong className="font-semibold">Recommendation:</strong> Enter the working days first
							for accurate salary calculation.
						</p>
					</div>
				</div>

				<DialogFooter className="flex-col sm:flex-row gap-2">
					<Button
						variant="outline"
						onClick={handleGoToWorkingDays}
						className="w-full sm:w-auto"
					>
						<Calendar className="mr-2 h-4 w-4" />
						Go to Working Days
					</Button>
					<Button onClick={handleContinue} variant="secondary" className="w-full sm:w-auto">
						Continue Anyway
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
