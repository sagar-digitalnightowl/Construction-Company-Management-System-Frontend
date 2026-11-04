// src/api/bankApi.js
// Bank module (PDF v2.8): bank master, dashboards, transactions and exports.
import api from "./axios";

export const bankApi = {
	list: (params) => api.get("/bank", { params }),
	get: (id) => api.get(`/bank/${id}`),
	create: (data) => api.post("/bank", data),
	update: (id, data) => api.patch(`/bank/${id}`, data),
	remove: (id) => api.delete(`/bank/${id}`),

	overview: () => api.get("/bank/dashboard/overview"),
	dashboard: (id) => api.get(`/bank/${id}/dashboard`),

	transactions: (params) => api.get("/bank/transactions", { params }),
	addManualTransaction: (id, data) => api.post(`/bank/${id}/transactions`, data),

	// Export returns a binary file (xlsx or pdf), so it must be requested as a blob
	exportTransactions: (format, params) =>
		api.get("/bank/transactions/export", { params: { ...params, format }, responseType: "blob" }),
};
