// src/api/siteStockApi.js

import api from "./axios";

export const siteStockApi = {
	// ─── STOCK IN (arrived material) ───

	createStockReport: (data) => api.post("/site-stock", data),

	getStockReports: (params) => api.get("/site-stock", { params }),

	getReportById: (id) => api.get(`/site-stock/${id}`),

	updateReport: (id, data) => api.patch(`/site-stock/${id}`, data),

	deleteReport: (id) => api.delete(`/site-stock/${id}`),

	verifyReport: (id, data) => api.patch(`/site-stock/${id}/verify`, data),

	getStats: (params) => api.get("/site-stock/stats", { params }),

	getProjectSummary: (projectId) => api.get(`/site-stock/project/${projectId}/summary`),

	// ─── DASHBOARD ───

	getDashboard: (params) => api.get("/site-stock/dashboard", { params }),

	// ─── STOCK OUT (material used) ───

	createConsumption: (data) => api.post("/site-stock/consumption", data),

	getConsumptions: (params) => api.get("/site-stock/consumption", { params }),

	getConsumptionById: (id) => api.get(`/site-stock/consumption/${id}`),

	// Tower / floor / work type report (v2.3): { filters, grandTotals, byTower, byWorkType, byItem }
	getConsumptionReport: (params) => api.get("/site-stock/consumption/report", { params }),

	updateConsumption: (id, data) => api.patch(`/site-stock/consumption/${id}`, data),

	deleteConsumption: (id) => api.delete(`/site-stock/consumption/${id}`),

	verifyConsumption: (id, data) => api.patch(`/site-stock/consumption/${id}/verify`, data),

	// ─── REORDER LEVELS (low-stock thresholds) ───

	createReorderLevel: (data) => api.post("/site-stock/reorder-level", data),

	getReorderLevels: (params) => api.get("/site-stock/reorder-level", { params }),

	updateReorderLevel: (id, data) => api.patch(`/site-stock/reorder-level/${id}`, data),

	deleteReorderLevel: (id) => api.delete(`/site-stock/reorder-level/${id}`),
};
