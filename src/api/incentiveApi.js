import api from "./axios";

export const incentiveApi = {
	// ==================== INCENTIVES ====================

	// 1. Get All Incentives
	getAllIncentives: (params = {}) => api.get("/incentives", { params }),

	// 2. Get Incentive Detail
	getIncentiveById: (id) => api.get(`/incentives/${id}`),

	// 3. Get Monthly Summary
	getIncentiveSummary: (params = {}) =>
		api.get("/incentives/summary", { params }),

	// ==================== CONFIGURATION ====================

	// 4. Get Incentive Configuration
	getConfig: () => api.get("/incentives/config"),

	// 5. Update Incentive Configuration
	updateConfig: (data) => api.put("/incentives/config", data),

	// ==================== MANUAL INCENTIVE ====================

	// 6. Create Manual EXTRA WORK Incentive
	createManualIncentive: (data) => api.post("/incentives/manual", data),

	// ==================== SYNC / BACKFILL ====================

	// 7. Sync Existing Booking & Installment Data
	syncIncentives: (data = {}) => api.post("/incentives/sync", data),

	// ==================== INCENTIVE ADJUSTMENTS ====================

	// 8. Add / Update Extra Incentive
	updateExtraIncentive: (id, data) =>
		api.patch(`/incentives/${id}/extra`, data),

	// 9. Update Payment Metadata
	updatePaymentMeta: (id, data) =>
		api.patch(`/incentives/${id}/payment-meta`, data),

	// 10. Update Payout
	updatePayout: (id, data) => api.patch(`/incentives/${id}/payout`, data),

	// 11. Delete Incentive
	deleteIncentive: (id) => api.delete(`/incentives/${id}`),
};
