import React, { useEffect, useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useHR } from "@/hooks/useHR";

const MONTH_OPTIONS = [
	{ value: "01", label: "January" },
	{ value: "02", label: "February" },
	{ value: "03", label: "March" },
	{ value: "04", label: "April" },
	{ value: "05", label: "May" },
	{ value: "06", label: "June" },
	{ value: "07", label: "July" },
	{ value: "08", label: "August" },
	{ value: "09", label: "September" },
	{ value: "10", label: "October" },
	{ value: "11", label: "November" },
	{ value: "12", label: "December" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 3 }, (_, i) => String(CURRENT_YEAR + i));

const initialForm = {
	amount: "",
	reason: "",
	repaymentType: "one_time",
	emiCount: "",
	startMonth: "",
	notes: "",
};

export default function RequestAdvanceModal({ open, onOpenChange, onSuccess }) {
	const { createAdvance, loading } = useHR();
	const [form, setForm] = useState(initialForm);

	useEffect(() => {
		if (open) {
			setForm(initialForm);
		}
	}, [open]);

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.amount || !form.reason.trim() || !form.startMonth) return;
		if (form.repaymentType === "emi" && !form.emiCount) return;

		const payload = {
			amount: Number(form.amount),
			reason: form.reason.trim(),
			repaymentType: form.repaymentType,
			startMonth: form.startMonth,
			...(form.repaymentType === "emi" && { emiCount: Number(form.emiCount) }),
			...(form.notes.trim() && { notes: form.notes.trim() }),
		};

		const result = await createAdvance(payload);
		if (result) {
			onSuccess?.(result);
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[calc(100vw-2rem)] max-w-lg rounded-xl p-6">
				<DialogHeader>
					<DialogTitle>Request Salary Advance</DialogTitle>
					<DialogDescription>
						Submit a salary advance request for approval. Amount, reason and start month are required.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					<div className="space-y-2">
						<Label htmlFor="advance-amount">Amount *</Label>
						<Input
							id="advance-amount"
							type="number"
							min="1"
							value={form.amount}
							onChange={(e) => handleChange("amount", e.target.value)}
							placeholder="e.g. 50000"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="advance-reason">Reason *</Label>
						<Input
							id="advance-reason"
							value={form.reason}
							onChange={(e) => handleChange("reason", e.target.value)}
							placeholder="e.g. Medical emergency in family"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Repayment Type</Label>
							<select
								value={form.repaymentType}
								onChange={(e) => handleChange("repaymentType", e.target.value)}
								className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<option value="one_time">One Time</option>
								<option value="emi">EMI</option>
							</select>
						</div>

						{form.repaymentType === "emi" && (
							<div className="space-y-2">
								<Label htmlFor="advance-emi-count">EMI Count *</Label>
								<Input
									id="advance-emi-count"
									type="number"
									min="2"
									max="24"
									value={form.emiCount}
									onChange={(e) => handleChange("emiCount", e.target.value)}
									placeholder="e.g. 5"
									required
								/>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<Label>Start Month *</Label>
						<div className="grid grid-cols-2 gap-4">
							<Select
								value={form.startMonth.split("-")[1] || ""}
								onValueChange={(month) =>
									handleChange(
										"startMonth",
										`${form.startMonth.split("-")[0] || CURRENT_YEAR}-${month}`,
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Month" />
								</SelectTrigger>
								<SelectContent>
									{MONTH_OPTIONS.map((month) => (
										<SelectItem key={month.value} value={month.value}>
											{month.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={form.startMonth.split("-")[0] || ""}
								onValueChange={(year) =>
									handleChange(
										"startMonth",
										`${year}-${form.startMonth.split("-")[1] || "01"}`,
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Year" />
								</SelectTrigger>
								<SelectContent>
									{YEAR_OPTIONS.map((year) => (
										<SelectItem key={year} value={year}>
											{year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="advance-notes">Notes</Label>
						<textarea
							id="advance-notes"
							value={form.notes}
							onChange={(e) => handleChange("notes", e.target.value)}
							className="w-full min-h-[5rem] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							placeholder="e.g. Approved verbally by GM"
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Submitting..." : "Submit Request"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}