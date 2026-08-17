import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
	dash,
	money,
	formatMonthDisplay,
	formatDate,
	EARNING_LABELS,
	DEDUCTION_LABELS,
	ATTENDANCE_LABELS,
	LEAVE_LABELS,
} from "./salaryHelpers";

/* ---------------- Design Tokens (Mapped from CSS to Hex for PDF) ---------------- */
const C = {
	primary: "#045157",       // Deep Teal
	primaryLight: "#147878",  // Mid Teal
	warning: "#C33C0F",       // Rust Orange
	textMain: "#1f2937",      // Dark Slate
	textMuted: "#64748b",     // Muted Gray
	border: "#e2e8f0",        // Light border
	borderDark: "#cbd5e1",
	bgMuted: "#f8fafc",       // Off-white backgrounds
	white: "#ffffff",
};

/* ---------------- PDF Stylesheet ---------------- */
const styles = StyleSheet.create({
	page: {
		padding: 35,
		backgroundColor: C.white,
		fontFamily: "Helvetica",
		fontSize: 9,
		color: C.textMain,
	},
	// --- Header Structure ---
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 20,
		paddingBottom: 15,
		borderBottomWidth: 2,
		borderBottomColor: C.primary
	},
	headerLeft: { flexDirection: "column", justifyContent: "flex-start" },
	headerRight: { flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-end" },
	companyName: { fontSize: 16, fontWeight: "bold", color: C.primary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
	payslipTitle: { fontSize: 16, fontWeight: "bold", color: C.textMain, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
	monthText: { fontSize: 11, fontWeight: "bold", color: C.primaryLight, marginBottom: 4 },
	textMuted: { color: C.textMuted, fontSize: 8.5, marginBottom: 3 },

	// --- Body Typography & Layout ---
	sectionTitle: { fontSize: 9.5, fontWeight: "bold", color: C.primary, textTransform: "uppercase", marginBottom: 6, borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 3 },
	section: { marginBottom: 16 },

	// Grids (For Employee, Attendance, Bank info)
	infoGrid: { flexDirection: "row", flexWrap: "wrap", backgroundColor: C.bgMuted, borderWidth: 1, borderColor: C.border, borderRadius: 2, padding: 8 },
	infoItem: { width: "25%", marginBottom: 8, paddingRight: 4 },
	infoLabel: { fontSize: 7.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 2 },
	infoValue: { fontSize: 9, fontWeight: "bold", color: C.textMain },

	// Financial Tables
	tableContainer: { flexDirection: "row", borderWidth: 1, borderColor: C.border, borderRadius: 2 },
	tableCol: { flex: 1 },
	tableDivider: { width: 1, backgroundColor: C.border },
	tableHeader: { flexDirection: "row", justifyContent: "space-between", backgroundColor: C.bgMuted, padding: 6, borderBottomWidth: 1, borderBottomColor: C.border },
	tableHeaderText: { fontWeight: "bold", color: C.primary, fontSize: 8.5 },
	tableRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
	tableFooter: { flexDirection: "row", justifyContent: "space-between", padding: 6, backgroundColor: C.bgMuted, borderTopWidth: 1, borderTopColor: C.borderDark },
	tableFooterText: { fontWeight: "bold", color: C.textMain },

	// Net Pay Block
	netPayBlock: { marginTop: 12, padding: 12, backgroundColor: "#f0f6f6", borderWidth: 1, borderColor: C.primaryLight, borderRadius: 2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
	netPayLeft: { flexDirection: "row", alignItems: "center" },
	netPayFormula: { alignItems: "center" },
	netPayFormulaLabel: { fontSize: 7.5, color: C.textMuted, textTransform: "uppercase", marginBottom: 2 },
	netPayFormulaValue: { fontSize: 10, fontWeight: "bold", color: C.textMain },
	netPayOperator: { fontSize: 14, color: C.textMuted, marginHorizontal: 12 },
	netPayFinal: { alignItems: "flex-end" },
	netPayFinalLabel: { fontSize: 10, fontWeight: "bold", color: C.primary, textTransform: "uppercase", marginBottom: 2 },
	netPayFinalValue: { fontSize: 16, fontWeight: "bold", color: C.primary },

	// Footer
	footer: { marginTop: 30, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", justifyContent: "space-between" }
});

/* ---------------- Helper Component ---------------- */
const GridItem = ({ label, value, width = "25%" }) => (
	<View style={[styles.infoItem, { width }]}>
		<Text style={styles.infoLabel}>{label}</Text>
		<Text style={styles.infoValue}>{dash(value)}</Text>
	</View>
);

/* ---------------- Main Document ---------------- */
export const SalarySlipPDF = ({ slip }) => {
	// 1. Explicitly map valid earnings using our predefined labels (Ignores _id)
	const activeEarnings = Object.entries(EARNING_LABELS)
		.filter(([key]) => slip.earnings?.[key] != null && slip.earnings[key] > 0)
		.map(([key, label]) => ({ label, value: slip.earnings[key] }));

	// 2. Explicitly map valid deductions using our predefined labels (Ignores _id)
	const activeDeductions = Object.entries(DEDUCTION_LABELS)
		.filter(([key]) => slip.deductions?.[key] != null && slip.deductions[key] > 0)
		.map(([key, label]) => ({ label, value: slip.deductions[key] }));

	// 3. Explicitly map Attendance & Leaves
	const activeAttendance = Object.entries(ATTENDANCE_LABELS)
		.filter(([key]) => slip.attendanceSummary?.[key] != null)
		.slice(0, 4) // Keep layout tight
		.map(([key, label]) => ({ label, value: slip.attendanceSummary[key] }));

	const activeLeaves = Object.entries(LEAVE_LABELS)
		.filter(([key]) => slip.leaveSummary?.[key] != null)
		.slice(0, 4) // Keep layout tight
		.map(([key, label]) => ({ label, value: slip.leaveSummary[key] }));

	return (
		<Document>
			<Page size="A4" style={styles.page}>

				{/* --- HEADER --- */}
				<View style={styles.headerContainer}>
					<View style={styles.headerLeft}>
						<Text style={styles.companyName}>Ashirwad Engicon Group</Text>
						<Text style={styles.textMuted}>Official Salary Statement</Text>
					</View>
					<View style={styles.headerRight}>
						<Text style={styles.payslipTitle}>Salary Slip</Text>
						<Text style={styles.monthText}>{formatMonthDisplay(slip.month)}</Text>
						<Text style={styles.textMuted}>Slip No: {dash(slip.slipNumber)}</Text>
					</View>
				</View>

				{/* --- EMPLOYEE SUMMARY --- */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Employee Details</Text>
					<View style={styles.infoGrid}>
						{/* Ensure we aren't showing the raw Mongo ID if a clean emp code exists */}
						<GridItem label="Employee Code" value={slip.employee?.employeeCode || "N/A"} />
						<GridItem label="Employee Name" value={slip.employee?.name || "N/A"} />
						<GridItem label="Designation" value={slip.employee?.designation || "N/A"} />
						<GridItem label="PAN Number" value={slip.employee?.pan || "N/A"} />
					</View>
				</View>

				{/* --- FINANCIALS (EARNINGS & DEDUCTIONS) --- */}
				<View style={styles.section}>
					<View style={styles.tableContainer}>
						{/* Earnings Column */}
						<View style={styles.tableCol}>
							<View style={styles.tableHeader}>
								<Text style={styles.tableHeaderText}>EARNINGS</Text>
								<Text style={styles.tableHeaderText}>AMOUNT</Text>
							</View>
							{activeEarnings.map((item, index) => (
								<View key={`earn-${index}`} style={styles.tableRow}>
									<Text>{item.label}</Text>
									<Text>{money(item.value)}</Text>
								</View>
							))}
							{/* Fill empty space if deductions list is longer */}
							{Array.from({ length: Math.max(0, activeDeductions.length - activeEarnings.length) }).map((_, i) => (
								<View key={`e-empty-${i}`} style={styles.tableRow}><Text> </Text></View>
							))}
							<View style={styles.tableFooter}>
								<Text style={styles.tableFooterText}>Gross Earnings</Text>
								<Text style={[styles.tableFooterText, { color: C.primary }]}>{money(slip.grossEarnings)}</Text>
							</View>
						</View>

						<View style={styles.tableDivider} />

						{/* Deductions Column */}
						<View style={styles.tableCol}>
							<View style={styles.tableHeader}>
								<Text style={styles.tableHeaderText}>DEDUCTIONS</Text>
								<Text style={styles.tableHeaderText}>AMOUNT</Text>
							</View>
							{activeDeductions.map((item, index) => (
								<View key={`ded-${index}`} style={styles.tableRow}>
									<Text>{item.label}</Text>
									<Text>{money(item.value)}</Text>
								</View>
							))}
							{/* Fill empty space if earnings list is longer */}
							{Array.from({ length: Math.max(0, activeEarnings.length - activeDeductions.length) }).map((_, i) => (
								<View key={`d-empty-${i}`} style={styles.tableRow}><Text> </Text></View>
							))}
							<View style={styles.tableFooter}>
								<Text style={styles.tableFooterText}>Total Deductions</Text>
								<Text style={[styles.tableFooterText, { color: C.warning }]}>{money(slip.totalDeductions)}</Text>
							</View>
						</View>
					</View>

					{/* Net Salary Block */}
					<View style={styles.netPayBlock}>
						<View style={styles.netPayLeft}>
							<View style={styles.netPayFormula}>
								<Text style={styles.netPayFormulaLabel}>Gross Earnings</Text>
								<Text style={styles.netPayFormulaValue}>{money(slip.grossEarnings)}</Text>
							</View>
							<Text style={styles.netPayOperator}>−</Text>
							<View style={styles.netPayFormula}>
								<Text style={styles.netPayFormulaLabel}>Total Deductions</Text>
								<Text style={[styles.netPayFormulaValue, { color: C.warning }]}>{money(slip.totalDeductions)}</Text>
							</View>
							<Text style={styles.netPayOperator}>=</Text>
						</View>

						<View style={styles.netPayFinal}>
							<Text style={styles.netPayFinalLabel}>Net Salary</Text>
							<Text style={styles.netPayFinalValue}>{money(slip.netSalary)}</Text>
						</View>
					</View>
				</View>

				{/* --- ATTENDANCE & LEAVES --- */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Attendance & Leave Summary</Text>
					<View style={styles.infoGrid}>
						{activeAttendance.map((item, index) => (
							<GridItem key={`att-${index}`} label={item.label} value={item.value} />
						))}
						{activeLeaves.map((item, index) => (
							<GridItem key={`lv-${index}`} label={item.label} value={item.value} />
						))}
					</View>
				</View>

				{/* --- PAYMENT & APPROVALS --- */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment & Bank Information</Text>
					<View style={styles.infoGrid}>
						<GridItem label="Payment Status" value={slip.paymentStatus} width="33.3%" />
						<GridItem label="Payment Method" value={slip.paymentMethod} width="33.3%" />
						<GridItem label="Payment Date" value={slip.paymentDate ? formatDate(slip.paymentDate) : null} width="33.3%" />

						{/* Explicitly mapping nested properties avoids ever hitting bankAccountDetails._id */}
						<GridItem label="Bank Name" value={slip.bankAccountDetails?.bankName} width="33.3%" />
						<GridItem label="Account Number" value={slip.bankAccountDetails?.accountNumber} width="33.3%" />
						<GridItem label="IFSC Code" value={slip.bankAccountDetails?.ifscCode} width="33.3%" />

						{/* Explicitly mapping approval statuses avoids hrApproval._id */}
						<GridItem label="HR Approval" value={slip.hrApproval?.status} width="33.3%" />
						<GridItem label="Finance Approval" value={slip.financeApproval?.status} width="33.3%" />
						<GridItem label="Remarks" value={slip.remarks} width="33.3%" />
					</View>
				</View>

				{/* --- FOOTER --- */}
				<View style={styles.footer}>
					<View>
						<Text style={styles.textMuted}>Generated on: {formatDate(slip.createdAt)}</Text>
					</View>
					<Text style={styles.textMuted}>This is a computer-generated document. No signature is required.</Text>
				</View>
			</Page>
		</Document>
	);
};