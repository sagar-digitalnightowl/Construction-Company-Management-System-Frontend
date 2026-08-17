import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { EmployeeStatsCards } from "./EmployeeStatsCards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { LogIn, LogOut, Clock, CheckCircle2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useHR } from "@/hooks/useHR";

const pageTitles = {
	"/employee-overview": "Dashboard",
	"/employee-attendance": "My Attendance",
	"/employee-leaves": "My Leaves",
	"/employee-salary": "Salary Slips",
	"/employee-announcements": "Announcements",
};

export default function EmployeeLayout({ children }) {
	const { pathname } = useLocation();
	const title = pageTitles[pathname] || "Employee Dashboard";

	const {
		myAttendance,
		checkIn,
		checkOut,
		fetchMyAttendance,
	} = useHR();

	// Check-in/out logic
	const todayDate = new Date();
	const todayString = todayDate.toISOString().split("T")[0];

	// Format date for the UI (e.g., "Monday, August 17, 2026")
	const formattedDate = todayDate.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const todayRecord = myAttendance?.records?.find(
		(rec) => rec.date === todayString
	);

	const isCheckedIn = todayRecord && !todayRecord.checkOut?.time;
	const isCheckedOut = todayRecord && todayRecord.checkOut?.time;
	const checkInTime = todayRecord?.checkIn?.time;

	// Timer State
	const [elapsedTime, setElapsedTime] = useState("00:00:00");

	useEffect(() => {
		fetchMyAttendance();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Live Timer Effect
	useEffect(() => {
		let interval;

		const updateTimer = () => {
			if (!checkInTime) return;

			const start = new Date(checkInTime).getTime();
			const now = new Date().getTime();
			const diff = Math.max(0, now - start);

			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor(
				(diff % (1000 * 60 * 60)) / (1000 * 60)
			);
			const seconds = Math.floor(
				(diff % (1000 * 60)) / 1000
			);

			setElapsedTime(
				`${hours.toString().padStart(2, "0")}:${minutes
					.toString()
					.padStart(2, "0")}:${seconds
						.toString()
						.padStart(2, "0")}`
			);
		};

		if (isCheckedIn && !isCheckedOut && checkInTime) {
			updateTimer();
			interval = setInterval(updateTimer, 1000);
		}

		return () => clearInterval(interval);
	}, [isCheckedIn, isCheckedOut, checkInTime]);

	const handleCheckIn = async () => {
		const success = await checkIn();

		if (success) {
			toast.success("Checked in successfully");
			await fetchMyAttendance(); 
		}
	};

	const handleCheckOut = async () => {
		const success = await checkOut();

		if (success) {
			toast.success("Checked out successfully");
			await fetchMyAttendance(); 
		}
	};

	// Helper to format time strings nicely
	const formatTime = (isoString) => {
		if (!isoString) return "--:--";

		return new Date(isoString).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true, // Switched to AM/PM for better readability
		});
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title={title}
				actions={
					pathname === "/employee-overview" ? (
						<div className="flex gap-2">
							{!isCheckedIn && !isCheckedOut && (
								<Button
									variant="outline"
									className="border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white hover:border-emerald-700"
									onClick={handleCheckIn}
								>
									<LogIn className="h-4 w-4 mr-2" />
									Check In
								</Button>
							)}

							{isCheckedIn && !isCheckedOut && (
								<Button
									variant="destructive"
									onClick={handleCheckOut}
								>
									<LogOut className="h-4 w-4 mr-2" />
									Check Out
								</Button>
							)}
						</div>
					) : null
				}
			/>

			{/* Live Status and Time Dashboard Card */}
			{pathname === "/employee-overview" && (
				<div className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
					{/* Top Accent Line */}
					<div className={`absolute top-0 left-0 w-full h-1 ${isCheckedOut ? "bg-slate-400" : isCheckedIn ? "bg-emerald-500" : "bg-warning"
						}`} />

					<div className="p-5 sm:p-6">
						{/* Card Header: Date & Status Badges */}
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
							<div>
								<h3 className="font-semibold text-lg flex items-center gap-2">
									<Calendar className="w-5 h-5 text-muted-foreground" />
									Today's Activity
								</h3>
								<p className="text-sm text-muted-foreground mt-1">
									{formattedDate}
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								{/* Base Status Badge (Present/Late) */}
								{todayRecord?.status && (
									<Badge
										variant={todayRecord.status.toLowerCase() === 'present' ? 'success' : 'secondary'}
										className="gap-1 px-2 py-1"
									>
										<CheckCircle2 className="w-3.5 h-3.5" />
										{todayRecord.status}
									</Badge>
								)}

								{/* Late Indicator */}
								{todayRecord?.isLate && (
									<Badge variant="destructive" className="px-2 py-1">
										Late
									</Badge>
								)}

								{/* Live Clocked Status Badge */}
								<Badge
									variant={
										isCheckedOut ? "muted" :
											isCheckedIn ? "success" :
												"warning"
									}
									className="gap-1.5 px-2 py-1"
								>
									<span className="relative flex h-2 w-2">
										{isCheckedIn && !isCheckedOut && (
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
										)}
										{/* bg-current inherits the text color of the badge variant automatically */}
										<span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
									</span>
									{isCheckedOut ? "Clocked Out" : isCheckedIn ? "Clocked In" : "Not Clocked In"}
								</Badge>
							</div>
						</div>

						{/* Main Grid Data */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border">

							{/* Check In Block */}
							<div className="flex items-center justify-between pt-4 lg:pt-0 lg:pr-6">
								<span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
									<LogIn className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
									Check In Time
								</span>
								<span className="text-xl font-semibold text-emerald-600 dark:text-emerald-500">
									{formatTime(todayRecord?.checkIn?.time)}
								</span>
							</div>

							{/* Check Out Block */}
							<div className="flex items-center justify-between pt-4 lg:pt-0 lg:px-6">
								<span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
									<LogOut className="w-4 h-4 text-red-600 dark:text-red-500" />
									Check Out Time
								</span>
								<span className={`text-xl font-semibold ${!isCheckedOut ? 'text-muted-foreground' : 'text-red-600 dark:text-red-500'}`}>
									{formatTime(todayRecord?.checkOut?.time)}
								</span>
							</div>

							{/* Live Timer / Total Hours Block */}
							<div className="flex items-center justify-between pt-4 lg:pt-0 lg:pl-6">
								<span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
									<Clock className={`w-4 h-4 ${isCheckedIn && !isCheckedOut ? 'text-blue-500 animate-pulse' : ''}`} />
									{isCheckedOut ? "Total Hours" : "Active Session"}
								</span>
								<div className="flex items-baseline gap-1.5">
									<span className={`text-xl font-bold font-mono tracking-tighter ${isCheckedIn && !isCheckedOut ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'
										}`}>
										{isCheckedOut
											? todayRecord?.totalHours?.toFixed(2)
											: elapsedTime}
									</span>
									{isCheckedOut && <span className="text-xs text-muted-foreground font-medium">hrs</span>}
								</div>
							</div>

						</div>
					</div>
				</div>
			)}

			{/* Shared employee stats */}
			{pathname === "/employee-attendance" && (
				<EmployeeStatsCards />
			)}

			{/* Current employee page */}
			{children}
		</div>
	);
}