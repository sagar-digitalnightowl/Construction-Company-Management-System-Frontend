import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatINR } from "@/lib/helpers";

export function StatutoryTab({ employee }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{/* PAN */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm">PAN Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">PAN Number</span>
						<span className="font-mono">
							{employee.personalDetails?.panNumber || "Not Provided"}
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Payroll Settings */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm">Payroll Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Basic Rate of Wages</span>
						<span>
							{employee.jobDetails?.basicRateOfWages > 0
								? formatINR(employee.jobDetails.basicRateOfWages)
								: "Auto"}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">New Salary (Revised)</span>
						<span>
							{employee.jobDetails?.newSalary > 0
								? formatINR(employee.jobDetails.newSalary)
								: "-"}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Salary Payment Day</span>
						<span>{employee.jobDetails?.salaryPaymentDay || "10th of every month"}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Payroll Day Divisor</span>
						<span>{employee.jobDetails?.payrollDayDivisor || 26}</span>
					</div>
					{employee.jobDetails?.khorakiPerDay > 0 && (
						<div className="flex justify-between">
							<span className="text-muted-foreground">Khoraki Per Day</span>
							<span>{formatINR(employee.jobDetails.khorakiPerDay)}</span>
						</div>
					)}
				</CardContent>
			</Card>

			{/* PF */}
			<Card>
				<CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
					<CardTitle className="text-sm">Provident Fund (PF)</CardTitle>
					<Badge variant={employee.jobDetails?.isPfApplicable ? "success" : "outline"}>
						{employee.jobDetails?.isPfApplicable ? "Applicable" : "Not Applicable"}
					</Badge>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					{employee.jobDetails?.isPfApplicable ? (
						<>
							<div className="flex justify-between">
								<span className="text-muted-foreground">PF Number</span>
								<span className="font-mono">{employee.jobDetails?.pfNumber || "-"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">UAN Number</span>
								<span className="font-mono">
									{employee.jobDetails?.uanNumber || employee.personalDetails?.uanNumber || "-"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Employee Contribution</span>
								<span>
									{employee.jobDetails?.pfEmployeeContributionPercent != null
										? `${employee.jobDetails.pfEmployeeContributionPercent}%`
										: "-"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Joining Date</span>
								<span>{formatDate(employee.jobDetails?.pfJoiningDate) || "-"}</span>
							</div>
						</>
					) : (
						<p className="text-muted-foreground">PF is not applicable for this employee.</p>
					)}
				</CardContent>
			</Card>

			{/* ESI */}
			<Card>
				<CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
					<CardTitle className="text-sm">ESI</CardTitle>
					<Badge variant={employee.jobDetails?.isEsiApplicable ? "success" : "outline"}>
						{employee.jobDetails?.isEsiApplicable ? "Applicable" : "Not Applicable"}
					</Badge>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					{employee.jobDetails?.isEsiApplicable ? (
						<>
							<div className="flex justify-between">
								<span className="text-muted-foreground">ESI Number</span>
								<span className="font-mono">
									{employee.jobDetails?.esiNumber || employee.personalDetails?.esicNumber || "-"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Employee Contribution</span>
								<span>
									{employee.jobDetails?.esiEmployeeContributionPercent != null
										? `${employee.jobDetails.esiEmployeeContributionPercent}%`
										: "-"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Joining Date</span>
								<span>{formatDate(employee.jobDetails?.esiJoiningDate) || "-"}</span>
							</div>
						</>
					) : (
						<p className="text-muted-foreground">ESI is not applicable for this employee.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}