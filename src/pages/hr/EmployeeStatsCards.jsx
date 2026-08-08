import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { useHR } from "@/hooks/useHR";

export const EmployeeStatsCards = () => {
	const { myAttendance, myLeaves, salarySlips } = useHR();

	const presentCount = myAttendance?.records?.filter(
		(a) => a.status === "Present"
	)?.length || 0;

	const pendingLeaveCount = myLeaves?.filter(
		(l) => l.status === "Pending"
	)?.length || 0;

	const currentMonthSalary = salarySlips?.find(
		(s) =>
			s.month === new Date().toLocaleString("default", { month: "long" }) &&
			s.year === new Date().getFullYear()
	)?.netPay || 0;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<Card>
				<CardContent className="p-4 flex justify-between items-center">
					<div>
						<p className="text-sm text-muted-foreground">
							Total Present (This Month)
						</p>
						<p className="text-2xl font-bold">{presentCount}</p>
					</div>
					<Calendar className="h-8 w-8 text-muted-foreground" />
				</CardContent>
			</Card>
			<Card>
				<CardContent className="p-4 flex justify-between items-center">
					<div>
						<p className="text-sm text-muted-foreground">Pending Leaves</p>
						<p className="text-2xl font-bold">{pendingLeaveCount}</p>
					</div>
					<Clock className="h-8 w-8 text-muted-foreground" />
				</CardContent>
			</Card>
			<Card>
				<CardContent className="p-4 flex justify-between items-center">
					<div>
						<p className="text-sm text-muted-foreground">
							Total Salary (Current Month)
						</p>
						<p className="text-2xl font-bold">
							₹{currentMonthSalary.toLocaleString()}
						</p>
					</div>
					<DollarSign className="h-8 w-8 text-muted-foreground" />
				</CardContent>
			</Card>
		</div>
	);
};