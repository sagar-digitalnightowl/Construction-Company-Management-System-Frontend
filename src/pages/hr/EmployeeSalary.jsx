import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useHR } from "@/hooks/useHR";

export const EmployeeSalary = () => {
	const { salarySlips, fetchMySalarySlips } = useHR();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadSalary = async () => {
			setLoading(true);
			await fetchMySalarySlips();
			setLoading(false);
		};
		loadSalary();
	}, [fetchMySalarySlips]);

	if (loading) return <Skeleton className="h-64" />;

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle>Salary Slips</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Month</TableHead>
							<TableHead>Year</TableHead>
							<TableHead>Basic</TableHead>
							<TableHead>HRA</TableHead>
							<TableHead>Allowances</TableHead>
							<TableHead>Deductions</TableHead>
							<TableHead>Net Pay</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{salarySlips?.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center">No salary slips found</TableCell>
							</TableRow>
						) : (
							salarySlips?.map((slip) => (
								<TableRow key={slip._id}>
									<TableCell>{slip.month}</TableCell>
									<TableCell>{slip.year}</TableCell>
									<TableCell>₹{slip.basicSalary?.toLocaleString()}</TableCell>
									<TableCell>₹{slip.hra?.toLocaleString()}</TableCell>
									<TableCell>₹{slip.allowances?.toLocaleString()}</TableCell>
									<TableCell>₹{slip.deductions?.toLocaleString()}</TableCell>
									<TableCell className="font-bold">₹{slip.netPay?.toLocaleString()}</TableCell>
									<TableCell>
										<Badge variant={slip.paymentStatus === "Paid" ? "success" : "warning"}>
											{slip.paymentStatus}
										</Badge>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};