import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";

const statusColor = {
	Present: "success",
	Absent: "destructive",
	"Half-Day": "warning",
	Late: "secondary",
};

export const EmployeeAttendance = () => {
	const { current } = useAuthStore();
	const { myAttendance, employeeShift, fetchEmployeeCurrentShift } = useHR();
	const [loadingShift, setLoadingShift] = useState(false);

	useEffect(() => {
		const loadShift = async () => {
			if (current?._id && !employeeShift) {
				setLoadingShift(true);
				await fetchEmployeeCurrentShift(current._id);
				setLoadingShift(false);
			}
		};
		loadShift();
	}, [current?._id, employeeShift, fetchEmployeeCurrentShift]);

	if (!myAttendance?.records?.length && !loadingShift) {
		return (
			<Card>
				<CardContent className="p-6 text-center text-muted-foreground">
					No attendance records yet.
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader className="pb-3">
					<CardTitle>Attendance Records</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Check-In</TableHead>
								<TableHead>Check-Out</TableHead>
								<TableHead>Hours</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{myAttendance?.records?.map((rec) => (
								<TableRow key={rec._id}>
									<TableCell>{formatDate(rec.date)}</TableCell>
									<TableCell>
										{rec.checkIn?.time
											? new Date(rec.checkIn.time).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
												hour12: false,
											})
											: "-"}
									</TableCell>
									<TableCell>
										{rec.checkOut?.time
											? new Date(rec.checkOut.time).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
												hour12: false,
											})
											: "-"}
									</TableCell>
									<TableCell>{rec.totalHours?.toFixed(1) || 0}</TableCell>
									<TableCell>
										<Badge variant={statusColor[rec.status]}>{rec.status}</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{loadingShift ? (
				<Skeleton className="h-32 mt-4" />
			) : employeeShift ? (
				<Card className="mt-4">
					<CardHeader className="pb-3">
						<CardTitle>Current Shift</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Shift Name</p>
								<p className="font-medium">{employeeShift.name}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Timings</p>
								<p className="font-medium">
									{employeeShift.startTime} – {employeeShift.endTime}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Working Days</p>
								<p className="font-medium">
									{employeeShift.workingDays?.join(", ")}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Grace Period</p>
								<p className="font-medium">
									{employeeShift.gracePeriodMinutes} minutes
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			) : null}
		</>
	);
};