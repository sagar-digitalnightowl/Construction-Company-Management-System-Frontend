import React, { useEffect } from "react";
import {
	CalendarCheck,
	Clock,
	AlertCircle,
	CalendarDays,
} from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { StatCard } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const EmployeeStatsCards = () => {
	const {
		employeeDashboard,
		fetchEmployeeDashboard,
		employeeDashboardLoading,
	} = useHR();

	useEffect(() => {
		fetchEmployeeDashboard();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (employeeDashboardLoading && !employeeDashboard) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<Skeleton key={index} className="h-[120px] w-full rounded-md" />
				))}
			</div>
		);
	}

	const { attendance } = employeeDashboard || {};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<StatCard
				label="Present Days"
				value={attendance?.present ?? 0}
				icon={CalendarCheck}
				accent="primary"
				delta={`Out of ${attendance?.totalWorkingDays ?? 0} working days`}
				deltaTone="neutral"
			/>

			<StatCard
				label="Attendance Rate"
				value={`${attendance?.attendanceRate ?? 0}%`}
				icon={Clock}
				accent="info"
				delta={`${attendance?.totalHours ?? 0} total hours logged`}
				deltaTone="neutral"
			/>

			<StatCard
				label="Late Arrivals"
				value={attendance?.late ?? 0}
				icon={AlertCircle}
				accent="warning"
				delta="Recorded late check-ins"
				deltaTone="neutral"
			/>

			<StatCard
				label="Absent Days"
				value={attendance?.absent ?? 0}
				icon={CalendarDays}
				accent="destructive"
				delta="Total missed working days"
				deltaTone="neutral"
			/>
		</div>
	);
};