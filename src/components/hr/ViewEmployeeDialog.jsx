import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent
} from "@/components/ui/tabs";
import { useHR } from "@/hooks/useHR";

export function ViewEmployeeDialog({ open, onOpenChange, employeeId }) {
	const { fetchEmployeeById, loading } = useHR();
	const [employee, setEmployee] = useState(null);

	// Fetch deep employee details whenever the dialog opens for a specific ID
	useEffect(() => {
		if (open && employeeId) {
			const getDetails = async () => {
				const res = await fetchEmployeeById(employeeId);
				if (res?.success && res?.data) {
					setEmployee(res.data);
				} else if (res) {
					setEmployee(res);
				}
			};
			getDetails();
		}
	}, [open, employeeId, fetchEmployeeById]);

	// Helper method to strip timestamps safely
	const formatDate = (isoString) => {
		if (!isoString) return null;
		return isoString.split("T")[0];
	};

	// Helper component to render clean, responsive read-only text fields
	const DataField = ({ label, value, className = "" }) => (
		<div className={`space-y-1 ${className}`}>
			<span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
				{label}
			</span>
			<div className="text-xs sm:text-sm font-medium text-foreground bg-secondary/50 px-3 py-2 rounded-md min-h-[38px] flex items-center border border-border/40 break-all sm:break-normal">
				{value || <span className="text-muted-foreground italic text-[11px] sm:text-xs">Not Provided</span>}
			</div>
		</div>
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{/* Added max-w-xl with mobile fallback padding and standard edge containment */}
			<DialogContent className="w-[95vw] sm:max-w-xl max-h-[90vh] rounded-lg flex flex-col p-4 sm:p-6 gap-4">
				<DialogHeader className="pb-1">
					<DialogTitle className="text-base sm:text-lg text-left">Employee Profile Details</DialogTitle>
				</DialogHeader>

				{loading ? (
					<div className="flex-1 flex items-center justify-center h-64 text-xs sm:text-sm text-muted-foreground animate-pulse">
						Retrieving employee dossier...
					</div>
				) : !employee ? (
					<div className="flex-1 flex items-center justify-center h-64 text-center text-xs sm:text-sm text-destructive">
						Failed to load employee records.
					</div>
				) : (
					/* Layout isolation to prevent container breakages */
					<Tabs defaultValue="core" className="flex-1 flex flex-col overflow-hidden">

						{/* Responsive Navigation Bar: switches structure fluidly across screen width profiles */}
						<TabsList className="flex sm:grid w-full h-auto sm:h-10 grid-cols-3 p-1 bg-muted rounded-lg overflow-x-auto sm:overflow-visible no-scrollbar gap-1 sm:gap-0">
							<TabsTrigger value="core" className="flex-1 sm:flex-initial py-1.5 px-2.5 text-[11px] sm:text-sm min-w-[85px] sm:min-w-0 shrink-0">
								Core Info
							</TabsTrigger>
							<TabsTrigger value="personal" className="flex-1 sm:flex-initial py-1.5 px-2.5 text-[11px] sm:text-sm min-w-[110px] sm:min-w-0 shrink-0">
								Personal & Bank
							</TabsTrigger>
							<TabsTrigger value="job" className="flex-1 sm:flex-initial py-1.5 px-2.5 text-[11px] sm:text-sm min-w-[95px] sm:min-w-0 shrink-0">
								Job & Payroll
							</TabsTrigger>
						</TabsList>

						{/* Scrollable container with padding safety logic applied */}
						<div className="flex-1 overflow-y-auto px-0.5 py-2 mt-2 space-y-4 pr-1 sm:pr-2">

							{/* TAB 1: CORE CREDENTIALS & INFO */}
							<TabsContent value="core" className="space-y-3 sm:space-y-4 mt-0">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<DataField label="Full Name" value={employee.name} />
									<DataField label="Employee ID" value={employee.employeeId} />
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<DataField label="Email Address" value={employee.email} />
									<DataField label="Phone Number" value={employee.phone} />
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<DataField label="System Role" value={employee.role} />
									<DataField
										label="Assigned Department"
										value={employee.department ? `${employee.department.name} (${employee.department.code})` : "Unassigned"}
									/>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<DataField label="Account Status" value={employee.status} />
									<DataField label="Last Login" value={formatDate(employee.lastLogin)} />
								</div>
							</TabsContent>

							{/* TAB 2: PERSONAL & BANK DETAILS */}
							<TabsContent value="personal" className="space-y-5 sm:space-y-6 mt-0">
								<div className="space-y-3 sm:space-y-4">
									<h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-primary/80 border-b pb-1">
										Personal Profile
									</h3>
									{/* Switched to responsive grid configurations */}
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
										<DataField label="Date of Birth" value={formatDate(employee.personalDetails?.dateOfBirth)} />
										<DataField label="Gender" value={employee.personalDetails?.gender} />
										<DataField label="Blood Group" value={employee.personalDetails?.bloodGroup} />
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										<DataField label="Identity Proof" value={employee.personalDetails?.aadharNumber ? "[Aadhaar Redacted]" : null} />
										<DataField label="PAN Card No." value={employee.personalDetails?.panNumber} />
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										<DataField label="Father's Name" value={employee.personalDetails?.fatherName} />
										<DataField label="Emergency Contact Name" value={employee.personalDetails?.emergencyContact?.name} />
									</div>
									<div>
										<DataField label="Emergency Contact Phone" value={employee.personalDetails?.emergencyContact?.phone} />
									</div>

									<div className="space-y-1">
										<span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
											Permanent Address
										</span>
										<div className="text-xs sm:text-sm font-medium text-foreground bg-secondary/50 p-3 rounded-md border border-border/40 space-y-1">
											<p className="break-words">{employee.personalDetails?.address?.permanentAddress?.line1 || <span className="text-muted-foreground italic text-xs">No address line</span>}</p>
											<p className="text-[11px] sm:text-xs text-muted-foreground">
												{[
													employee.personalDetails?.address?.permanentAddress?.city,
													employee.personalDetails?.address?.permanentAddress?.state,
													employee.personalDetails?.address?.permanentAddress?.pincode
												].filter(Boolean).join(", ") || "City, State, Pincode details missing"}
											</p>
										</div>
									</div>
								</div>

								<div className="space-y-3 sm:space-y-4">
									<h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-primary/80 border-b pb-1">
										Bank Settlement
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										<DataField label="Bank Name" value={employee.bankDetails?.bankName} />
										<DataField label="Account Number" value={employee.bankDetails?.accountNumber} />
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										<DataField label="IFSC Code" value={employee.bankDetails?.ifscCode} />
										<DataField label="UPI ID" value={employee.bankDetails?.upiId} />
									</div>
								</div>
							</TabsContent>

							{/* TAB 3: JOB & COMPENSATION DETAILS */}
							<TabsContent value="job" className="space-y-4 mt-0">
								<div className="space-y-3 sm:space-y-4">
									<h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-primary/80 border-b pb-1">
										Employment Assignment
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										<DataField label="Designation" value={employee.jobDetails?.designation} />
										<DataField label="Joining Date" value={formatDate(employee.jobDetails?.joiningDate)} />
									</div>
									<DataField label="Employment Type" value={employee.jobDetails?.employmentType} />
								</div>

								<div className="space-y-3 sm:space-y-4 pt-2">
									<h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-primary/80 border-b pb-1">
										Salary Breakdown Structure
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										<DataField
											label="Basic Salary"
											value={employee.jobDetails?.salary?.basic ? `₹${employee.jobDetails.salary.basic.toLocaleString("en-IN")}` : "₹0"}
										/>
										<DataField
											label="HRA Component"
											value={employee.jobDetails?.salary?.hra ? `₹${employee.jobDetails.salary.hra.toLocaleString("en-IN")}` : "₹0"}
										/>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										<DataField
											label="Allowances"
											value={employee.jobDetails?.salary?.allowances ? `₹${employee.jobDetails.salary.allowances.toLocaleString("en-IN")}` : "₹0"}
										/>
										<DataField
											label="Total CTC (Annual)"
											value={employee.jobDetails?.salary?.totalCTC ? `₹${employee.jobDetails.salary.totalCTC.toLocaleString("en-IN")}` : "₹0"}
										/>
									</div>
								</div>
							</TabsContent>
						</div>
					</Tabs>
				)}

				<DialogFooter className="border-t pt-3 mt-1 sm:mt-2">
					<Button type="button" className="w-full sm:w-auto text-xs sm:text-sm" onClick={() => onOpenChange(false)}>
						Close Profile
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}