import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";

const statusColor = {
	Present: "text-emerald-600 dark:text-emerald-500",
	Absent: "text-destructive",
	"Half-Day": "text-amber-600 dark:text-amber-500",
	Late: "text-destructive",
};

export const EmployeeAttendance = () => {
	const { current } = useAuthStore();
	const {
		myAttendance,
		employeeShift,
		fetchMyAttendance,
		fetchEmployeeCurrentShift,
	} = useHR();

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadEmployeeData = async () => {
			setIsLoading(true);

			try {
				// 1. Always fetch attendance (does not require current._id)
				const apiCalls = [fetchMyAttendance()];

				// 2. Safely add the shift fetch ONLY if the user ID is available
				if (current?._id) {
					apiCalls.push(fetchEmployeeCurrentShift(current._id));
				}

				await Promise.all(apiCalls);
			} catch (error) {
				console.error("Failed to fetch HR data:", error);
			} finally {
				// 3. This is now GUARANTEED to execute and remove the skeleton
				setIsLoading(false);
			}
		};

		loadEmployeeData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [current?._id]);

	const records =
		myAttendance?.records ||
		myAttendance?.data?.records ||
		[];

	return (
		<>
			{/* ATTENDANCE CARD */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle>Attendance Records</CardTitle>
				</CardHeader>

				<CardContent className="p-0">
					{isLoading ? (
						<div className="p-6">
							<Skeleton className="h-32 w-full" />
						</div>
					) : records.length === 0 ? (
						<div className="p-6 text-center text-muted-foreground">
							No attendance records yet.
						</div>
					) : (
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
								{records.map((rec) => (
									<TableRow key={rec._id}>
										<TableCell className="font-medium">
											{formatDate(rec.date)}
										</TableCell>

										{/* Check-In */}
										<TableCell>
											{rec.checkIn?.time ? (
												<span
													className={`font-medium ${rec.isLate
														? "text-destructive"
														: "text-emerald-600 dark:text-emerald-500"
														}`}
												>
													{new Date(
														rec.checkIn.time
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: true,
													})}
												</span>
											) : (
												<span className="text-muted-foreground">
													-
												</span>
											)}
										</TableCell>

										{/* Check-Out */}
										<TableCell>
											{rec.checkOut?.time ? (
												<span className="font-medium text-red-600 dark:text-red-500">
													{new Date(
														rec.checkOut.time
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: true,
													})}
												</span>
											) : (
												<span className="text-muted-foreground">
													-
												</span>
											)}
										</TableCell>

										{/* Hours */}
										<TableCell>
											{rec.totalHours?.toFixed(2) || "0.00"}
										</TableCell>

										{/* Status */}
										<TableCell>
											<div className="flex items-center gap-2">
												<span
													className={`font-medium ${statusColor[rec.status] ||
														"text-foreground"
														}`}
												>
													{rec.status}
												</span>

												{rec.isLate &&
													rec.status !== "Late" && (
														<span className="text-xs font-medium text-destructive">
															(Late)
														</span>
													)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* SHIFT CARD */}
			{isLoading ? (
				<Card className="mt-4">
					<CardContent className="p-6">
						<Skeleton className="h-24 w-full" />
					</CardContent>
				</Card>
			) : employeeShift ? (
				<Card className="mt-4">
					<CardHeader className="pb-3">
						<CardTitle>Current Shift</CardTitle>
					</CardHeader>

					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">
									Shift Name
								</p>
								<p className="font-medium">
									{employeeShift.name}
								</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground">
									Timings
								</p>
								<p className="font-medium">
									{employeeShift.startTime} –{" "}
									{employeeShift.endTime}
								</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground">
									Working Days
								</p>
								<p className="font-medium">
									{employeeShift.workingDays?.join(", ")}
								</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground">
									Grace Period
								</p>
								<p className="font-medium">
									{employeeShift.gracePeriodMinutes} minutes
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card className="mt-4">
					<CardContent className="py-8 text-center">
						<p className="font-medium text-foreground">
							No Shift Assigned
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							You currently don't have a shift assigned. Please contact
							your HR or administrator.
						</p>
					</CardContent>
				</Card>
			)}
		</>
	);
};