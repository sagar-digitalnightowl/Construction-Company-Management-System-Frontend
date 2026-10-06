import api from "./axios";

export const pfApi = {
	// ==================== PAYROLL CALCULATE PREVIEW ====================

	calculatePayrollPreview: (data) =>
		api.post("/hr/payroll/calculate-preview", data),

	// ==================== BOOKING LEDGER ====================

	getBookingLedger: (employeeId, upToMonth) =>
		api.get(`/hr/salary/booking-ledger/${employeeId}`, {
			params: upToMonth ? { upToMonth } : {},
		}),

	adjustBookingLedger: (data) =>
		api.post("/hr/salary/booking-ledger/adjust", data),
};
