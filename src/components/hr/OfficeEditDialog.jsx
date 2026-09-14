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

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const OFFICE_TYPES = ["Head Office", "Branch Office", "Regional Office", "Site Office", "Warehouse", "Other"];

export function OfficeEditDialog({
	open,
	onOpenChange,
	onSubmit, 
	loading = false,
	employeesList = [],
	officeData = null,
}) {
	const [form, setForm] = useState({});

	useEffect(() => {
		if (open && officeData) {
			setForm({
				name: officeData.name || "",
				code: officeData.code || "",
				description: officeData.description || "",
				officeType: officeData.officeType || "Branch Office",
				status: officeData.status || "Active",
				addressLine1: officeData.addressLine1 || "",
				addressLine2: officeData.addressLine2 || "",
				city: officeData.city || "",
				state: officeData.state || "",
				country: officeData.country || "India",
				pincode: officeData.pincode || "",
				contactNumber: officeData.contactNumber || "",
				alternateContactNumber: officeData.alternateContactNumber || "",
				email: officeData.email || "",
				// Safely extract IDs if populated by the backend
				headOfOffice: officeData.headOfOffice?._id || officeData.headOfOffice || "",
				hrRepresentative: officeData.hrRepresentative?._id || officeData.hrRepresentative || "",
				defaultStartTime: officeData.defaultStartTime || "",
				defaultEndTime: officeData.defaultEndTime || "",
				workingDays: officeData.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			});
		}
	}, [open, officeData]);

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const toggleWorkingDay = (day) => {
		setForm((prev) => ({
			...prev,
			workingDays: prev.workingDays.includes(day)
				? prev.workingDays.filter((item) => item !== day)
				: [...prev.workingDays, day],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name?.trim() || !form.code?.trim()) return;

		// Construct payload dynamically (send all fields, API will patch)
		const payload = {
			name: form.name.trim(),
			code: form.code.trim(),
			description: form.description?.trim(),
			officeType: form.officeType,
			status: form.status,
			addressLine1: form.addressLine1?.trim(),
			addressLine2: form.addressLine2?.trim(),
			city: form.city?.trim(),
			state: form.state?.trim(),
			country: form.country?.trim(),
			pincode: form.pincode?.trim(),
			contactNumber: form.contactNumber?.trim(),
			alternateContactNumber: form.alternateContactNumber?.trim(),
			email: form.email?.trim(),
			headOfOffice: form.headOfOffice || null,
			hrRepresentative: form.hrRepresentative || null,
			defaultStartTime: form.defaultStartTime?.trim(),
			defaultEndTime: form.defaultEndTime?.trim(),
			workingDays: form.workingDays,
		};

		const success = await onSubmit(officeData._id, payload);
		if (success) onOpenChange(false);
	};

	if (!officeData) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[calc(100vw-2rem)] max-w-4xl max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto rounded-xl p-6">
				<DialogHeader>
					<DialogTitle>Edit Office: {officeData.name}</DialogTitle>
					<DialogDescription>
						Update details for this office location.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 mt-4">
					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Basic Information</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="edit-office-name">Office Name *</Label>
								<Input
									id="edit-office-name"
									value={form.name || ""}
									onChange={(e) => handleChange("name", e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-office-code">Office Code *</Label>
								<Input
									id="edit-office-code"
									value={form.code || ""}
									onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
									maxLength={30}
									required
								/>
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="edit-office-description">Description</Label>
								<textarea
									id="edit-office-description"
									value={form.description || ""}
									onChange={(e) => handleChange("description", e.target.value)}
									className="w-full min-h-[6rem] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								/>
							</div>
							<div className="space-y-2">
								<Label>Office Type</Label>
								<select
									value={form.officeType || ""}
									onChange={(e) => handleChange("officeType", e.target.value)}
									className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								>
									{OFFICE_TYPES.map((type) => (
										<option key={type} value={type}>{type}</option>
									))}
								</select>
							</div>
							<div className="space-y-2">
								<Label>Status</Label>
								<select
									value={form.status || ""}
									onChange={(e) => handleChange("status", e.target.value)}
									className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								>
									<option value="Active">Active</option>
									<option value="Inactive">Inactive</option>
								</select>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Address</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2 md:col-span-2">
								<Label>Address Line 1</Label>
								<Input value={form.addressLine1 || ""} onChange={(e) => handleChange("addressLine1", e.target.value)} />
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label>Address Line 2</Label>
								<Input value={form.addressLine2 || ""} onChange={(e) => handleChange("addressLine2", e.target.value)} />
							</div>
							<div className="space-y-2">
								<Label>City</Label>
								<Input value={form.city || ""} onChange={(e) => handleChange("city", e.target.value)} />
							</div>
							<div className="space-y-2">
								<Label>State</Label>
								<Input value={form.state || ""} onChange={(e) => handleChange("state", e.target.value)} />
							</div>
							<div className="space-y-2">
								<Label>Country</Label>
								<Input value={form.country || ""} onChange={(e) => handleChange("country", e.target.value)} />
							</div>
							<div className="space-y-2">
								<Label>Pincode</Label>
								<Input value={form.pincode || ""} onChange={(e) => handleChange("pincode", e.target.value)} maxLength={10} />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Contact & Management</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Contact Number</Label>
								<Input value={form.contactNumber || ""} onChange={(e) => handleChange("contactNumber", e.target.value)} />
							</div>
							<div className="space-y-2">
								<Label>Email</Label>
								<Input type="email" value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
							</div>
							<div className="space-y-2">
								<Label>Head of Office</Label>
								<select
									value={form.headOfOffice || ""}
									onChange={(e) => handleChange("headOfOffice", e.target.value)}
									className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								>
									<option value="">Select Employee</option>
									{employeesList.map((emp) => (
										<option key={emp._id} value={emp._id}>{emp.name} ({emp.role || "Employee"})</option>
									))}
								</select>
							</div>
							<div className="space-y-2">
								<Label>HR Representative</Label>
								<select
									value={form.hrRepresentative || ""}
									onChange={(e) => handleChange("hrRepresentative", e.target.value)}
									className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								>
									<option value="">Select Employee</option>
									{employeesList.map((emp) => (
										<option key={emp._id} value={emp._id}>{emp.name} ({emp.role || "Employee"})</option>
									))}
								</select>
							</div>
							<div className="space-y-2">
								<Label>Default Start Time</Label>
								<Input type="time" value={form.defaultStartTime || ""} onChange={(e) => handleChange("defaultStartTime", e.target.value)} />
							</div>
							<div className="space-y-2">
								<Label>Default End Time</Label>
								<Input type="time" value={form.defaultEndTime || ""} onChange={(e) => handleChange("defaultEndTime", e.target.value)} />
							</div>
						</div>
						<div className="space-y-2">
							<Label>Working Days</Label>
							<div className="flex flex-wrap gap-2">
								{WEEK_DAYS.map((day) => {
									const selected = form.workingDays?.includes(day);
									return (
										<Button
											key={day}
											type="button"
											variant={selected ? "default" : "outline"}
											size="sm"
											onClick={() => toggleWorkingDay(day)}
										>
											{day}
										</Button>
									);
								})}
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}