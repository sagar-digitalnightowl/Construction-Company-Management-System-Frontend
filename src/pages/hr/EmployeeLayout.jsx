import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { EmployeeStatsCards } from "./EmployeeStatsCards";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";

const pageTitles = {
	"/employee-attendance": "My Attendance",
	"/employee-leaves": "My Leaves",
	"/employee-salary": "Salary Slips",
	"/employee-announcements": "Announcements",
};

export default function EmployeeLayout() {
	const { pathname } = useLocation();
	const title = pageTitles[pathname] || "Employee Dashboard";

	const { current } = useAuthStore();
	const employeeId = current?._id;

	const {
		employee,
		myAttendance,
		fetchEmployeeById,
		fetchMyAttendance,
		checkIn,
		checkOut,
	} = useHR();

	// Check-in/out logic
	const today = new Date().toISOString().split("T")[0];
	const todayRecord = myAttendance?.records?.find((rec) => rec.date === today);
	const isCheckedIn = todayRecord && !todayRecord.checkOut?.time;
	const isCheckedOut = todayRecord && todayRecord.checkOut?.time;

	useEffect(() => {
		if (!employeeId) return;
		const init = async () => {
			await fetchEmployeeById(employeeId);
			await fetchMyAttendance();
		};
		init();
	}, [employeeId, fetchEmployeeById, fetchMyAttendance]);

	const handleCheckIn = async () => {
		const success = await checkIn();
		if (success) {
			await fetchMyAttendance();
			toast.success("Checked in successfully");
		}
	};

	const handleCheckOut = async () => {
		const success = await checkOut();
		if (success) {
			await fetchMyAttendance();
			toast.success("Checked out successfully");
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Dashboard"
				title={title}
				description={
					<p className="text-muted-foreground">
						{employee?.name} • {employee?.role} •{" "}
						{employee?.department?.name || "No department"}
					</p>
				}
				actions={
					<div className="flex gap-2">
						{!isCheckedIn && !isCheckedOut && (
							<Button variant="outline" onClick={handleCheckIn}>
								<LogIn className="h-4 w-4 mr-1" /> Check In
							</Button>
						)}
						{isCheckedIn && !isCheckedOut && (
							<Button variant="outline" onClick={handleCheckOut}>
								<LogOut className="h-4 w-4 mr-1" /> Check Out
							</Button>
						)}
						{isCheckedOut && (
							<Button variant="outline" disabled>
								<LogOut className="h-4 w-4 mr-1" /> Already Checked Out
							</Button>
						)}
					</div>
				}
			/>

			{/* Shared Stats Component */}
			<EmployeeStatsCards />

			{/* Render the specific tab route below */}
			<Outlet />
		</div>
	);
}