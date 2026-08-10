import api from "./axios";

export const financeApi = {
	// 1. Finance Dashboard
	getDashboard: (params) => api.get("/finance/dashboard", { params }),

	exportDashboard: (params = {}) =>
		api.get("/finance/dashboard/export", {
			params,
			responseType: "blob",
		}),

	// 🔥 NEW: Fetch single project finance details with GST
	getProjectDetails: (projectId) => api.get(`/finance/project/${projectId}`),

	// 2. Project Milestones
	getProjectMilestones: (projectId) =>
		api.get(`/finance/project/${projectId}/milestones`),

	// 3. Mark Milestone Completed
	markMilestone: (projectId, data) =>
		api.post(`/finance/project/${projectId}/milestone`, data),

	// 4. Manual Normal Reminder
	sendManualReminder: (bookingId, data) =>
		api.post(`/finance/booking/${bookingId}/reminder`, data),

	// 5. Manual Penalty Reminder
	sendManualPenaltyReminder: (bookingId, data) =>
		api.post(`/finance/booking/${bookingId}/penalty-reminder`, data),

	// 6. All Bookings
	getAllBookings: (params) => api.get("/finance/bookings", { params }),

	// 7. Reminder Logs
	getReminderLogs: (params) => api.get("/finance/reminders", { params }),

	// Payroll APIs
	getPendingPayrollApprovals: (params) =>
		api.get("/finance/payroll/pending", { params }),

	getAllPayrollBatches: (params) => api.get("/finance/payroll", { params }),

	getPayrollBatchById: (id) => api.get(`/finance/payroll/${id}`),

	acknowledgeReceipt: (id) =>
		api.put(`/finance/payroll/${id}/acknowledge-receipt`),

	approvePayrollBatch: (id) => api.put(`/finance/payroll/${id}/approve`),

	rejectPayrollBatch: (id, data) =>
		api.put(`/finance/payroll/${id}/reject`, data),

	sendPayrollToBank: (id, data) =>
		api.put(`/finance/payroll/${id}/send-to-bank`, data),

	markPayrollBankProcessed: (id, data) =>
		api.put(`/finance/payroll/${id}/bank-processed`, data),

	// WhatsApp Reminder APIs
	getDueInstallments: (params) =>
		api.get("/finance/installments/due", { params }),
	sendWhatsAppReminders: (data) =>
		api.post("/finance/reminders/whatsapp/send", data),

	// =========================
	// EXPENSE REPORTING
	// =========================

	getExpenseSummary: () => api.get("/finance/expenses/summary"),

	getProjectExpenseReport: (projectId) =>
		api.get(`/finance/expenses/project/${projectId}`),

	getEmployeeExpenseReport: (employeeId, params = {}) =>
		api.get(`/finance/expenses/employee/${employeeId}`, { params }),
};
