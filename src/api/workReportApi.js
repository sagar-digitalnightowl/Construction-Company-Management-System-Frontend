// src/api/workReportApi.js
// Work report review flow (v2.7): Site Manager reviews, forwards or rejects; Admin/HR/Director/PM acknowledge.
import api from "./axios";

export const workReportApi = {
	list: (params) => api.get("/site/work-reports", { params }),
	summary: () => api.get("/site/work-reports/summary"),
	get: (id) => api.get(`/site/work-reports/${id}`),
	review: (id, data) => api.patch(`/site/work-reports/${id}/review`, data),
	forward: (id, data) => api.patch(`/site/work-reports/${id}/forward`, data),
	acknowledge: (id, data) => api.patch(`/site/work-reports/${id}/acknowledge`, data),
	reject: (id, data) => api.patch(`/site/work-reports/${id}/reject`, data),
};
