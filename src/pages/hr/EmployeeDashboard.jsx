import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/common/PageHeader";
import { EmployeeStatsCards } from "./EmployeeStatsCards";
import { EmployeeAttendance } from "./EmployeeAttendance";
import { EmployeeLeaves } from "./EmployeeLeaves";
import { EmployeeSalary } from "./EmployeeSalary";
import { EmployeeAnnouncements } from "./EmployeeAnnouncements";

export default function EmployeeDashboard() {
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

	const [activeTab, setActiveTab] = useState("attendance");

	// Today’s check‑in/out logic (relies on myAttendance)
	const today = new Date().toISOString().split("T")[0];
	const todayRecord = myAttendance?.records?.find((rec) => rec.date === today);
	const isCheckedIn = todayRecord && !todayRecord.checkOut?.time;
	const isCheckedOut = todayRecord && todayRecord.checkOut?.time;

	// Fetch employee & today's attendance on mount for the header logic
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
			{/* Header */}
			<div>
				<PageHeader
					eyebrow="Dashboard"
					title="Leaves & Attendance"
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
			</div>

			{/* Stats Cards extracted to its own component */}
			<EmployeeStatsCards />

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="attendance">My Attendance</TabsTrigger>
					<TabsTrigger value="leaves">My Leaves</TabsTrigger>
					<TabsTrigger value="salary">Salary Slips</TabsTrigger>
					<TabsTrigger value="announcements">Announcements</TabsTrigger>
				</TabsList>

				<TabsContent value="attendance">
					<EmployeeAttendance />
				</TabsContent>

				<TabsContent value="leaves">
					<EmployeeLeaves />
				</TabsContent>

				<TabsContent value="salary">
					<EmployeeSalary />
				</TabsContent>

				<TabsContent value="announcements">
					<EmployeeAnnouncements />
				</TabsContent>
			</Tabs>
		</div>
	);
}