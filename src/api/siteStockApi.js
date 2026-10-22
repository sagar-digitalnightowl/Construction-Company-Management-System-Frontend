// src/api/siteStockApi.js

import api from "./axios";

export const siteStockApi = {
	// ─── CREATE & READ ───

	createStockReport: (data) => api.post("/site-stock", data),

	getStockReports: (params) => api.get("/site-stock", { params }),

	getMyReports: (params) => api.get("/site-stock/my", { params }),

	getReportById: (id) => api.get(`/site-stock/${id}`),

	// ─── UPDATE & DELETE ───

	updateReport: (id, data) => api.patch(`/site-stock/${id}`, data),

	deleteReport: (id) => api.delete(`/site-stock/${id}`),

	// ─── VERIFICATION ───

	verifyReport: (id, data) => api.patch(`/site-stock/${id}/verify`, data),

	// ─── STATS & ANALYTICS ───

	getStats: (params) => api.get("/site-stock/stats", { params }),

	getProjectSummary: (projectId) => api.get(`/site-stock/project/${projectId}/summary`),
};
