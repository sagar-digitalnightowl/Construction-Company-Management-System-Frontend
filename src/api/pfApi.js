import api from "./axios";

export const pfApi = {
	// ==================== PAYROLL CALCULATE PREVIEW ====================

	calculatePayrollPreview: (data) =>
		api.post("/hr/payroll/calculate-preview", data),
};
