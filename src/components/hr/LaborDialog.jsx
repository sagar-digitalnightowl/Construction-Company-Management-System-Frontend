import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
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
import { toast } from "sonner";
import { projectApi } from "@/api";

export function LaborDialog({ open, onOpenChange, labor, onSuccess }) {
	const { createLabor, updateLabor, loading } = useHR();
	const [projects, setProjects] = useState([]);

	const [form, setForm] = useState({
		name: "",
		phone: "",
		laborType: "Unskilled",
		trade: "General Helper",
		dailyWage: "",
		assignedProject: "",
		assignedSite: "",
		joiningDate: "",
		standardHoursPerDay: 8,
		status: "Active",
	});

	const isEdit = !!labor;

	// Fetch projects only if we are creating a new labor record
	useEffect(() => {
		if (open && !isEdit) {
			projectApi
				.getAll()
				.then((res) => setProjects(res.data?.data?.projects || []))
				.catch(console.error);
		}
	}, [open, isEdit]);

	// Populate or reset form fields
	useEffect(() => {
		if (labor && open) {
			setForm({
				name: labor.name || "",
				phone: labor.phone || "",
				laborType: labor.laborType || "Unskilled",
				trade: labor.trade || "General Helper",
				dailyWage: labor.dailyWage || "",
				assignedProject: labor.assignedProject?._id || labor.assignedProject || "",
				assignedSite: labor.assignedSite || "",
				joiningDate: labor.joiningDate?.split("T")[0] || "",
				standardHoursPerDay: labor.standardHoursPerDay || 8,
				status: labor.status || "Active",
			});
		} else if (!open) {
			setForm({
				name: "",
				phone: "",
				laborType: "Unskilled",
				trade: "General Helper",
				dailyWage: "",
				assignedProject: "",
				assignedSite: "",
				joiningDate: "",
				standardHoursPerDay: 8,
				status: "Active",
			});
		}
	}, [labor, open]);

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		// Universal validation for fields required across both create and edit models
		if (!form.name || !form.phone || !form.dailyWage) {
			toast.error("Name, phone, and daily wage are required fields");
			return;
		}

		let success = false;

		if (isEdit) {
			const updatePayload = {
				name: form.name,
				phone: form.phone,
				dailyWage: Number(form.dailyWage),
				status: form.status,
			};
			success = await updateLabor(labor._id, updatePayload);
		} else {
			if (!form.assignedProject) {
				toast.error("An assigned project is required to enroll new labor");
				return;
			}

			const createPayload = {
				name: form.name,
				phone: form.phone,
				laborType: form.laborType,
				trade: form.trade,
				dailyWage: Number(form.dailyWage),
				assignedProject: form.assignedProject,
				assignedSite: form.assignedSite || undefined,
				joiningDate: form.joiningDate || undefined,
				standardHoursPerDay: Number(form.standardHoursPerDay),
			};
			success = await createLabor(createPayload);
		}

		if (success) {
			onSuccess?.();
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] rounded-lg flex flex-col p-4 sm:p-6 gap-4">
				<DialogHeader>
					<DialogTitle className="text-base sm:text-lg text-left">
						{isEdit ? "Modify Labor Entry" : "Enroll New Labor Profile"}
					</DialogTitle>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-0.5 py-1 space-y-4 pr-1 sm:pr-2">
					{isEdit ? (
						/* ========================================================
						   EDITING VIEW PROFILE: SHOWS ONLY 4 SPECIFIED PROFILE FIELDS 
						   ======================================================== */
						<div className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Full Name *</Label>
									<Input
										placeholder="Full name"
										value={form.name}
										onChange={(e) => handleChange("name", e.target.value)}
										className="text-xs sm:text-sm h-9 sm:h-10"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Mobile Number *</Label>
									<Input
										placeholder="Mobile phone number"
										value={form.phone}
										onChange={(e) => handleChange("phone", e.target.value)}
										className="text-xs sm:text-sm h-9 sm:h-10"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Daily Wage Amount (₹) *</Label>
									<Input
										type="number"
										placeholder="Daily Wage Amount"
										value={form.dailyWage}
										onChange={(e) => handleChange("dailyWage", e.target.value)}
										className="text-xs sm:text-sm h-9 sm:h-10"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Status</Label>
									<Select
										value={form.status}
										onValueChange={(v) => handleChange("status", v)}
									>
										<SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Active">Active</SelectItem>
											<SelectItem value="Inactive">Inactive</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					) : (
						/* ========================================================
						   CREATION VIEW PROFILE: SHOWS COMPLETE ENROLLMENT FORMS
						   ======================================================== */
						<div className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Full Name *</Label>
									<Input
										placeholder="e.g., Ramesh Kumar"
										value={form.name}
										onChange={(e) => handleChange("name", e.target.value)}
										className="text-xs sm:text-sm h-9 sm:h-10"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Mobile Number *</Label>
									<Input
										placeholder="+919876543210"
										value={form.phone}
										onChange={(e) => handleChange("phone", e.target.value)}
										className="text-xs sm:text-sm h-9 sm:h-10"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Labor Type</Label>
									<Select
										value={form.laborType}
										onValueChange={(v) => handleChange("laborType", v)}
									>
										<SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Skilled">Skilled</SelectItem>
											<SelectItem value="Semi-Skilled">Semi-Skilled</SelectItem>
											<SelectItem value="Unskilled">Unskilled</SelectItem>
											<SelectItem value="Supervisor">Supervisor</SelectItem>
											<SelectItem value="Helper">Helper</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Trade Classification</Label>
									<Select
										value={form.trade}
										onValueChange={(v) => handleChange("trade", v)}
									>
										<SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Mason">Mason</SelectItem>
											<SelectItem value="Carpenter">Carpenter</SelectItem>
											<SelectItem value="Electrician">Electrician</SelectItem>
											<SelectItem value="Plumber">Plumber</SelectItem>
											<SelectItem value="Painter">Painter</SelectItem>
											<SelectItem value="Welder">Welder</SelectItem>
											<SelectItem value="Steel Fixer">Steel Fixer</SelectItem>
											<SelectItem value="Concrete Worker">Concrete Worker</SelectItem>
											<SelectItem value="General Helper">General Helper</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Daily Wage Amount (₹) *</Label>
									<Input
										type="number"
										placeholder="500"
										value={form.dailyWage}
										onChange={(e) => handleChange("dailyWage", e.target.value)}
										className="text-xs sm:text-sm h-9 sm:h-10"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Assigned Project *</Label>
									<Select
										value={form.assignedProject}
										onValueChange={(v) => handleChange("assignedProject", v)}
									>
										<SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
											<SelectValue placeholder="Select project" />
										</SelectTrigger>
										<SelectContent>
											{projects?.map((p) => (
												<SelectItem key={p._id} value={p._id}>
													{p.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Site Location (Optional)</Label>
									<Input
										placeholder="Site name or ID"
										value={form.assignedSite}
										onChange={(e) => handleChange("assignedSite", e.target.value)}
										className="text-xs sm:text-sm h-9 sm:h-10"
									/>
								</div>
								<div className="space-y-1.5">
									<Label className="text-xs sm:text-sm">Joining Date</Label>
									<Input
										type="date"
										value={form.joiningDate}
										onChange={(e) => handleChange("joiningDate", e.target.value)}
										className="text-xs sm:text-sm h-9 sm:h-10 block w-full"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs sm:text-sm">Standard Shift Hours/Day</Label>
								<Input
									type="number"
									placeholder="8"
									value={form.standardHoursPerDay}
									onChange={(e) => handleChange("standardHoursPerDay", e.target.value)}
									className="text-xs sm:text-sm h-9 sm:h-10"
								/>
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t pt-3 mt-1">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						disabled={loading}
						className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
					>
						{loading ? "Processing..." : isEdit ? "Update Record" : "Create Profile"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}