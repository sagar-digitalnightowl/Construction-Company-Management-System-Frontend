/* ---------------- Formatters ---------------- */

export const dash = (val) =>
	val === null || val === undefined || val === "" ? "-" : val;

export const currency = (val) =>
	val === null || val === undefined
		? "-"
		: `₹${Number(val).toLocaleString("en-IN")}`;

// Plain-text version for react-pdf (no ₹ glyph issues in some PDF fonts unless configured)
export const money = (val) =>
	val === null || val === undefined
		? "-"
		: `Rs. ${Number(val).toLocaleString("en-IN")}`;

export const formatMonthDisplay = (monthStr) => {
	if (!monthStr) return "-";
	const [year, month] = monthStr.split("-");
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
};

export const formatDate = (dateStr) => {
	if (!dateStr) return "-";
	return new Date(dateStr).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

export const getStatusBadge = (status) => {
	switch (status) {
		case "Paid":
			return "success";
		case "Processed":
			return "default";
		case "Pending":
			return "warning";
		case "Failed":
			return "destructive";
		default:
			return "secondary";
	}
};

/* ---------------- Field label maps (single source of truth) ---------------- */

export const EARNING_LABELS = {
	basic: "Basic Salary",
	hra: "House Rent Allowance (HRA)",
	allowances: "Other Allowances",
	dearnessAllowance: "Dearness Allowance",
	conveyanceAllowance: "Conveyance Allowance",
	medicalAllowance: "Medical Allowance",
	specialAllowance: "Special Allowance",
	siteAllowance: "Site Allowance",
	travelAllowance: "Travel Allowance",
	foodAllowance: "Food Allowance",
	nightShiftAllowance: "Night Shift Allowance",
	hazardousAllowance: "Hazardous Allowance",
	overtimePay: "Overtime Pay",
	bonus: "Bonus",
	performanceBonus: "Performance Bonus",
	safetyBonus: "Safety Bonus",
	otherEarnings: "Other Earnings",
};

export const DEDUCTION_LABELS = {
	providentFund: "Provident Fund (PF)",
	professionalTax: "Professional Tax",
	taxDeduction: "Income Tax (TDS)",
	loanDeduction: "Loan Deduction",
	advanceDeduction: "Advance Deduction",
	lateDeduction: "Late Deduction",
	absentDeduction: "Absent Deduction",
	esiDeduction: "ESI Deduction",
	labourWelfareFund: "Labour Welfare Fund",
	uniformDeduction: "Uniform Deduction",
	accommodationDeduction: "Accommodation Deduction",
	otherDeductions: "Other Deductions",
};

export const ATTENDANCE_LABELS = {
	totalWorkingDays: "Total Working Days",
	presentDays: "Present Days",
	absentDays: "Absent Days",
	lateDays: "Late Days",
	halfDays: "Half Days",
	totalOvertimeHours: "Overtime Hours",
	totalWorkingHours: "Total Working Hours",
	nightShiftDays: "Night Shift Days",
	holidayWorkDays: "Holiday Work Days",
	weeklyOffWorkDays: "Weekly-Off Work Days",
};

export const LEAVE_LABELS = {
	paidLeaveTaken: "Paid Leave",
	unpaidLeaveTaken: "Unpaid Leave",
	sickLeaveTaken: "Sick Leave",
	casualLeaveTaken: "Casual Leave",
	annualLeaveTaken: "Annual Leave",
};
