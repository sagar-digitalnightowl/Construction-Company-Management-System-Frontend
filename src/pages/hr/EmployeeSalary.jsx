import React, { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { SalaryCard } from "./SalaryCard";

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

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-3">
				<Loader2 className="animate-spin text-primary" size={40} />
				<p className="text-muted-foreground">Fetching records...</p>
			</div>
		);
	}

	const safeSlips = Array.isArray(salarySlips) ? salarySlips : [];

	return (
		<div className="space-y-4">
			{safeSlips.length === 0 ? (
				<div className="text-center py-16 rounded-2xl border-2 border-dashed border-border flex flex-col items-center gap-3">
					<FileText size={48} strokeWidth={1.5} className="text-muted-foreground/50" />
					<h3 className="text-lg font-medium">No Salary Slips Found</h3>
					<p className="text-muted-foreground text-sm">
						Your salary history will appear here once processed.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{safeSlips.map((slip) => (
						<SalaryCard key={slip._id} slip={slip} />
					))}
				</div>
			)}
		</div>
	);
};