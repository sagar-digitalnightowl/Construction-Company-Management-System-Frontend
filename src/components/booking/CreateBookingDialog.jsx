// src/components/booking/CreateBookingDialog.jsx
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
import { useProject } from "@/hooks/useProject";
import { authApi, projectApi } from "@/api";
import { bookingApi } from "@/api/bookingApi";
import { PAYMENT_MODE } from "@/data/constants/booking";
import { formatINR } from "@/lib/helpers";
import { toast } from "sonner";
import { useLeadList } from "@/hooks/useLeadList";

export function CreateBookingDialog({ open, onOpenChange, onSuccess }) {
	const [projects, setProjects] = useState([]);
	const [units, setUnits] = useState([]);
	const [loading, setLoading] = useState(false);
	const initialForm = {
		projectId: "",
		leadId: "",
		unitNumber: "",
		advanceAmount: "",
		paymentMode: "",
		transactionId: "",
		remarks: "",
		agreementDate: "",
		nomineeName: "",
		nomineeRelation: "",

		clientName: "",
		clientEmail: "",
		clientPhone: "",
		clientPassword: "",

		dateOfBirth: "",
		gender: "",
		bloodGroup: "",
		maritalStatus: "",
		aadharNumber: "",
		panNumber: "",
		fatherName: "",
		motherName: "",
		emergencyContactName: "",
		emergencyContactPhone: "",
		emergencyContactRelation: "",

		addressLine1: "",
		city: "",
		state: "",
		country: "India",
		pincode: "",

		bankName: "",
		accountNumber: "",
		ifscCode: "",
		upiId: "",
		accountHolderName: "",
		accountType: "",
		branchName: "",
	};

	const [form, setForm] = useState(initialForm);

	const resetForm = () => {
		setForm(initialForm);
		setUnits([]);
	};

	const { leads, loading: leadsLoading } = useLeadList();

	const fetchProjects = async () => {
		try {
			const res = await projectApi.getAll();
			if (res.data.success) {
				setProjects(res.data.data?.projects || []);
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to load projects");
		}
	};

	useEffect(() => {
		if (open) {
			fetchProjects();
		}
	}, [open]);

	useEffect(() => {
		if (form.projectId) {
			const project = projects.find((p) => p._id === form.projectId);
			if (project?.units)
				setUnits(project.units.filter((u) => u.status === "available"));
			else setUnits([]);
		} else setUnits([]);
	}, [form.projectId, projects]);

	const handleSubmit = async () => {
		if (!form.projectId || !form.unitNumber || !form.advanceAmount) {
			toast.error("Project, unit, and advance amount required");
			return;
		}
		if (!form.leadId) {
			if (
				!form.clientName ||
				!form.clientEmail ||
				!form.clientPhone ||
				!form.clientPassword
			) {
				toast.error("Client details are required");
				return;
			}
		}
		setLoading(true);
		const payload = {
			projectId: form.projectId,
			unitNumber: form.unitNumber,
			bookingAmount: Number(form.advanceAmount),
			paymentMode: form.paymentMode,
			transactionId: form.transactionId || undefined,
			remarks: form.remarks || undefined,
			agreementDate: form.agreementDate || undefined,
			nomineeName: form.nomineeName || undefined,
			nomineeRelation: form.nomineeRelation || undefined,
		};

		if (form.leadId) {
			payload.leadId = form.leadId;
		} else {
			payload.clientName = form.clientName;
			payload.clientEmail = form.clientEmail;
			payload.clientPhone = form.clientPhone;
			payload.clientPassword = form.clientPassword;

			payload.personalDetails = {
				dateOfBirth: form.dateOfBirth,
				gender: form.gender,
				bloodGroup: form.bloodGroup,
				maritalStatus: form.maritalStatus,
				aadharNumber: form.aadharNumber,
				panNumber: form.panNumber,
				fatherName: form.fatherName,
				motherName: form.motherName,
				emergencyContactName: form.emergencyContactName,
				emergencyContactPhone: form.emergencyContactPhone,
				emergencyContactRelation: form.emergencyContactRelation,
				permanentAddress: {
					line1: form.addressLine1,
					city: form.city,
					state: form.state,
					country: form.country,
					pincode: form.pincode,
				},
			};

			payload.bankDetails = {
				bankName: form.bankName,
				accountNumber: form.accountNumber,
				ifscCode: form.ifscCode,
				upiId: form.upiId,
				accountHolderName: form.accountHolderName,
				accountType: form.accountType,
				branchName: form.branchName,
			};
		}
		try {
			const res = await bookingApi.createBooking(payload);
			toast.success("Booking created successfully");
			onSuccess?.(res.data?.data);
			onOpenChange(false);
			resetForm();
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to create booking");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange} >
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create New Booking</DialogTitle>
				</DialogHeader>
				<div className="space-y-3 max-h-[70vh] overflow-y-auto p-1">
					<div>
						<Label>Project *</Label>
						<Select
							value={form.projectId}
							onValueChange={(v) =>
								setForm({ ...form, projectId: v, unitNumber: "" })
							}
						>
							<SelectTrigger>
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
					<div>
						<Label>Lead (Optional)</Label>
						<Select
							value={form.leadId || "none"}
							onValueChange={(v) =>
								setForm({
									...form,
									leadId: v === "none" ? "" : v,
								})
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select lead" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="none">None</SelectItem>

								{leads?.map((lead) => (
									<SelectItem key={lead._id} value={lead._id}>
										{lead.clientName}
										{lead.clientPhone ? ` (${lead.clientPhone})` : ""}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{!form.leadId && (
						<>
							<div className="border-t pt-4">
								<h3 className="font-semibold">Client Details</h3>
							</div>

							<div>
								<Label>Client Name *</Label>
								<Input
									value={form.clientName}
									onChange={(e) =>
										setForm({ ...form, clientName: e.target.value })
									}
								/>
							</div>

							<div>
								<Label>Email *</Label>
								<Input
									type="email"
									value={form.clientEmail}
									onChange={(e) =>
										setForm({ ...form, clientEmail: e.target.value })
									}
								/>
							</div>

							<div>
								<Label>Phone *</Label>
								<Input
									value={form.clientPhone}
									onChange={(e) =>
										setForm({ ...form, clientPhone: e.target.value })
									}
								/>
							</div>

							<div>
								<Label>Password *</Label>
								<Input
									type="password"
									value={form.clientPassword}
									onChange={(e) =>
										setForm({ ...form, clientPassword: e.target.value })
									}
								/>
							</div>
						</>
					)}
					{!form.leadId && (
						<>
							<div className="border-t pt-4">
								<h3 className="font-semibold">Personal Details</h3>
							</div>

							<Input
								type="date"
								value={form.dateOfBirth}
								onChange={(e) =>
									setForm({ ...form, dateOfBirth: e.target.value })
								}
							/>

							<div>
								<Label>Gender</Label>
								<Select
									value={form.gender}
									onValueChange={(v) => setForm({ ...form, gender: v })}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select Gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Male">Male</SelectItem>
										<SelectItem value="Female">Female</SelectItem>
										<SelectItem value="Other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label>Blood Group</Label>
								<Select
									value={form.bloodGroup}
									onValueChange={(v) => setForm({ ...form, bloodGroup: v })}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select Blood Group" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="A+">A+</SelectItem>
										<SelectItem value="A-">A-</SelectItem>
										<SelectItem value="B+">B+</SelectItem>
										<SelectItem value="B-">B-</SelectItem>
										<SelectItem value="AB+">AB+</SelectItem>
										<SelectItem value="AB-">AB-</SelectItem>
										<SelectItem value="O+">O+</SelectItem>
										<SelectItem value="O-">O-</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label>Marital Status</Label>
								<Select
									value={form.maritalStatus}
									onValueChange={(v) =>
										setForm({ ...form, maritalStatus: v })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select Marital Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Single">Single</SelectItem>
										<SelectItem value="Married">Married</SelectItem>
										<SelectItem value="Divorced">Divorced</SelectItem>
										<SelectItem value="Widowed">Widowed</SelectItem>
										<SelectItem value="Separated">Separated</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Input
								placeholder="Aadhar Number"
								value={form.aadharNumber}
								onChange={(e) =>
									setForm({ ...form, aadharNumber: e.target.value })
								}
							/>

							<Input
								placeholder="PAN Number"
								value={form.panNumber}
								onChange={(e) =>
									setForm({ ...form, panNumber: e.target.value })
								}
							/>

							<Input
								placeholder="Father Name"
								value={form.fatherName}
								onChange={(e) =>
									setForm({ ...form, fatherName: e.target.value })
								}
							/>

							<Input
								placeholder="Mother Name"
								value={form.motherName}
								onChange={(e) =>
									setForm({ ...form, motherName: e.target.value })
								}
							/>
						</>
					)}
					{!form.leadId && (
						<>
							<div className="border-t pt-4">
								<h3 className="font-semibold">Emergency Contact</h3>
							</div>

							<Input
								placeholder="Emergency Contact Name"
								value={form.emergencyContactName}
								onChange={(e) =>
									setForm({
										...form,
										emergencyContactName: e.target.value,
									})
								}
							/>

							<Input
								placeholder="Emergency Contact Phone"
								value={form.emergencyContactPhone}
								onChange={(e) =>
									setForm({
										...form,
										emergencyContactPhone: e.target.value,
									})
								}
							/>

							<Input
								placeholder="Relationship"
								value={form.emergencyContactRelation}
								onChange={(e) =>
									setForm({
										...form,
										emergencyContactRelation: e.target.value,
									})
								}
							/>
						</>
					)}
					{!form.leadId && (
						<>
							<div className="border-t pt-4">
								<h3 className="font-semibold">Permanent Address</h3>
							</div>

							<Input
								placeholder="Address Line 1"
								value={form.addressLine1}
								onChange={(e) =>
									setForm({ ...form, addressLine1: e.target.value })
								}
							/>

							<Input
								placeholder="City"
								value={form.city}
								onChange={(e) =>
									setForm({ ...form, city: e.target.value })
								}
							/>

							<Input
								placeholder="State"
								value={form.state}
								onChange={(e) =>
									setForm({ ...form, state: e.target.value })
								}
							/>

							<Input
								placeholder="Country"
								value={form.country}
								onChange={(e) =>
									setForm({ ...form, country: e.target.value })
								}
							/>

							<Input
								placeholder="Pincode"
								value={form.pincode}
								onChange={(e) =>
									setForm({ ...form, pincode: e.target.value })
								}
							/>
						</>
					)}
					{!form.leadId && (
						<>
							<div className="border-t pt-4">
								<h3 className="font-semibold">Bank Details</h3>
							</div>

							<Input
								placeholder="Bank Name"
								value={form.bankName}
								onChange={(e) =>
									setForm({ ...form, bankName: e.target.value })
								}
							/>

							<Input
								placeholder="Account Number"
								value={form.accountNumber}
								onChange={(e) =>
									setForm({ ...form, accountNumber: e.target.value })
								}
							/>

							<Input
								placeholder="IFSC Code"
								value={form.ifscCode}
								onChange={(e) =>
									setForm({ ...form, ifscCode: e.target.value })
								}
							/>

							<Input
								placeholder="UPI ID"
								value={form.upiId}
								onChange={(e) =>
									setForm({ ...form, upiId: e.target.value })
								}
							/>

							<Input
								placeholder="Account Holder Name"
								value={form.accountHolderName}
								onChange={(e) =>
									setForm({
										...form,
										accountHolderName: e.target.value,
									})
								}
							/>

							<div>
								<Label>Account Type</Label>
								<Select
									value={form.accountType}
									onValueChange={(v) =>
										setForm({ ...form, accountType: v })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select Account Type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Savings">Savings</SelectItem>
										<SelectItem value="Current">Current</SelectItem>
										<SelectItem value="Salary">Salary</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Input
								placeholder="Branch Name"
								value={form.branchName}
								onChange={(e) =>
									setForm({ ...form, branchName: e.target.value })
								}
							/>
						</>
					)}
					<div>
						<Label>Unit Number *</Label>
						<Select
							value={form.unitNumber}
							onValueChange={(v) => setForm({ ...form, unitNumber: v })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select unit" />
							</SelectTrigger>
							<SelectContent>
								{units?.map((u) => (
									<SelectItem key={u.unitNumber} value={u.unitNumber}>
										#{u.unitNumber} - {u.bedrooms} BHK - {formatINR(u.price)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label>Advance Amount *</Label>
						<Input
							type="number"
							value={form.advanceAmount}
							onChange={(e) =>
								setForm({ ...form, advanceAmount: e.target.value })
							}
						/>
					</div>
					<div>
						<Label>Payment Mode</Label>
						<Select
							value={form.paymentMode}
							onValueChange={(v) => setForm({ ...form, paymentMode: v })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(PAYMENT_MODE).map((m) => (
									<SelectItem key={m} value={m}>
										{m}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label>Transaction ID (if Cheque/Bank Transfer/Card)</Label>
						<Input
							value={form.transactionId}
							onChange={(e) =>
								setForm({ ...form, transactionId: e.target.value })
							}
						/>
					</div>
					<div>
						<Label>Agreement Date</Label>
						<Input
							type="date"
							value={form.agreementDate}
							onChange={(e) =>
								setForm({ ...form, agreementDate: e.target.value })
							}
						/>
					</div>
					<div>
						<Label>Nominee Name</Label>
						<Input
							value={form.nomineeName}
							onChange={(e) =>
								setForm({ ...form, nomineeName: e.target.value })
							}
						/>
					</div>
					<div>
						<Label>Nominee Relation</Label>
						<Input
							value={form.nomineeRelation}
							onChange={(e) =>
								setForm({ ...form, nomineeRelation: e.target.value })
							}
						/>
					</div>
					<div>
						<Label>Remarks</Label>
						<Input
							value={form.remarks}
							onChange={(e) => setForm({ ...form, remarks: e.target.value })}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => {
							resetForm();
							onOpenChange(false);
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={loading}>
						Create Booking
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
