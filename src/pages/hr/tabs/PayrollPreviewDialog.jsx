import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

import { usePF } from "@/hooks/usePF";
import { formatINR } from "@/lib/helpers";

const INITIAL_FORM = {
	monthlySalary: "",
	newSalary: "",
	basicRateOfWages: "",
	designation: "",
	workedDays: "",
};

const FIELDS = [
	{
		key: "monthlySalary",
		label: "Monthly Salary",
		placeholder: "Enter monthly salary",
		type: "number",
	},
	{
		key: "newSalary",
		label: "New Salary",
		placeholder: "Enter new salary",
		type: "number",
	},
	{
		key: "basicRateOfWages",
		label: "Basic Rate of Wages",
		placeholder: "Enter basic rate of wages",
		type: "number",
	},
	{
		key: "workedDays",
		label: "Worked Days",
		placeholder: "Enter worked days",
		type: "number",
	},
	{
		key: "designation",
		label: "Designation",
		placeholder: "Enter designation",
		type: "text",
	},
];

const ADDITION_ROWS = [
	["payableSalary", "Payable Salary"],
	["payableBonus", "Bonus"],
	["previousDefaulterReceived", "Previous Defaulter Received"],
	["khoraki", "Khoraki"],
];

const DEDUCTION_ROWS = [
	["pf", "PF (12%)"],
	["esi", "ESI (0.75%)"],
	["tds", "TDS"],
	["advanceSalary", "Advance Salary"],
	["defaulterDeduction", "Defaulter Deduction"],
	["insuranceDeduction", "Insurance Deduction"],
];

export function PayrollPreviewDialog({ open, onOpenChange, employeeId }) {
	const { payrollPreview, loading, calculatePayrollPreview, clearPayrollPreview } =
		usePF();
	const [form, setForm] = useState(INITIAL_FORM);

	const handleChange = (key, value) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleOpenChange = (next) => {
		onOpenChange(next);
		if (!next) {
			setForm(INITIAL_FORM);
			clearPayrollPreview();
		}
	};

	const buildPayload = () => {
		const payload = employeeId ? { employeeId } : {};
		FIELDS.forEach(({ key, type }) => {
			const val = form[key];
			if (val === "") return;
			payload[key] = type === "number" ? Number(val) : val;
		});
		return payload;
	};

	const handleCalculate = async () => {
		await calculatePayrollPreview(buildPayload());
	};

	useEffect(() => {
		if (open && employeeId) {
			calculatePayrollPreview({ employeeId });
		}
	}, [open, employeeId]);

	const b = payrollPreview?.breakdown;

	const sumRows = (rows) => rows.reduce((acc, [key]) => acc + (b?.[key] || 0), 0);
	const totalAdditions = b ? sumRows(ADDITION_ROWS) : 0;
	const totalDeductions = b ? sumRows(DEDUCTION_ROWS) : 0;

	const renderRows = (rows, sign, colorClass) =>
		rows.map(([key, label]) => {
			const amount = b[key] || 0;
			return (
				<div key={key} className="flex justify-between">
					<span className="text-muted-foreground">
						{label}
						{key === "esi" && !b.esiApplicable && (
							<span className="text-xs ml-1">(not applicable)</span>
						)}
					</span>
					<span className={amount > 0 ? colorClass : "text-muted-foreground"}>
						{amount > 0 ? `${sign} ` : ""}
						{formatINR(amount)}
					</span>
				</div>
			);
		});

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						Payroll Preview {employeeId ? "" : "(Manual)"}
					</DialogTitle>
				</DialogHeader>

				{!employeeId && (
					<>
						<div className="grid grid-cols-2 gap-3">
							{FIELDS.map(({ key, label, type, placeholder }) => (
								<div key={key} className="space-y-1.5">
									<Label>{label}</Label>
									<Input
										type={type}
										min={type === "number" ? 0 : undefined}
										placeholder={placeholder}
										value={form[key]}
										onChange={(e) => handleChange(key, e.target.value)}
									/>
								</div>
							))}
						</div>

						<Button className="w-full" onClick={handleCalculate} disabled={loading}>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Calculate
						</Button>
					</>
				)}

				{employeeId && loading && (
					<div className="flex justify-center py-6">
						<Loader2 className="h-5 w-5 animate-spin" />
					</div>
				)}

				{b && (
					<div className="space-y-3 text-sm">
						<div className="rounded-md border p-3 space-y-1">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Employee</span>
								<span>
									{payrollPreview.employee?.name}{" "}
									{payrollPreview.employee?.employeeCode &&
										`(${payrollPreview.employee.employeeCode})`}
								</span>
							</div>
							{payrollPreview.employee?.designation && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Designation</span>
									<span>{payrollPreview.employee.designation}</span>
								</div>
							)}
							<div className="flex justify-between">
								<span className="text-muted-foreground">Monthly salary</span>
								<span>{formatINR(payrollPreview.inputs?.monthlySalary ?? 0)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Basic rate of wages</span>
								<span>{formatINR(payrollPreview.inputs?.basicRateOfWages ?? 0)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Worked days</span>
								<span>{payrollPreview.inputs?.workedDays}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Day divisor</span>
								<span>{payrollPreview.inputs?.dayDivisor}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">PF registered</span>
								<Badge variant={payrollPreview.inputs?.isPfRegistered ? "success" : "outline"}>
									{payrollPreview.inputs?.isPfRegistered ? "Yes" : "No"}
								</Badge>
							</div>
						</div>

						{/* Additions */}
						<div className="rounded-md border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 p-3 space-y-1">
							<p className="font-semibold text-green-700 dark:text-green-400">Additions</p>
							{renderRows(ADDITION_ROWS, "+", "text-green-600 dark:text-green-400")}
							<div className="flex justify-between font-medium border-t pt-2">
								<span>Total additions</span>
								<span className="text-green-600 dark:text-green-400">
									+ {formatINR(totalAdditions)}
								</span>
							</div>
						</div>

						{/* Deductions */}
						<div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-3 space-y-1">
							<p className="font-semibold text-red-700 dark:text-red-400">Deductions</p>
							{renderRows(DEDUCTION_ROWS, "−", "text-red-600 dark:text-red-400")}
							<div className="flex justify-between font-medium border-t pt-2">
								<span>Total deductions</span>
								<span className="text-red-600 dark:text-red-400">
									− {formatINR(totalDeductions)}
								</span>
							</div>
						</div>

						{/* Net */}
						<div className="rounded-md border p-3 space-y-1">
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>PF basis (actual basic)</span>
								<span>{formatINR(b.actualBasic ?? 0)}</span>
							</div>
							<div className="flex justify-between text-base font-bold">
								<span>Net Payable</span>
								<span className="text-primary">{formatINR(b.finalPayableSalary)}</span>
							</div>
						</div>

						{payrollPreview.arrears?.totalArrear > 0 && (
							<p className="text-xs text-amber-600">
								Total arrear: {formatINR(payrollPreview.arrears.totalArrear)}
							</p>
						)}
					</div>
				)}

				<DialogFooter>
					<Button variant="outline" onClick={() => handleOpenChange(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}