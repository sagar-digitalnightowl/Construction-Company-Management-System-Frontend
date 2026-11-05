// src/api/siteEngineerApi.js
// Every endpoint the Site Engineer panel uses, with the paths from the Site Engineer API reference (PDF).
import api from "./axios";

export const siteEngineerApi = {
	// Daily progress reports (DPR)
	listDailyReports: (params) => api.get("/site/daily-report", { params }),
	getDailyReport: (id) => api.get(`/site/daily-report/${id}`),
	createDailyReport: (data) => api.post("/site/daily-report", data),
	updateDailyReport: (id, data) => api.patch(`/site/daily-report/${id}`, data),
	deleteDailyReport: (id) => api.delete(`/site/daily-report/${id}`),

	// Attendance (site)
	markAttendance: (data) => api.post("/site/attendance/mark", data),
	getMyAttendance: (params) => api.get("/site/attendance/my", { params }),
	updateAttendance: (id, data) => api.patch(`/site/attendance/${id}`, data),
	getProjectAttendance: (params) => api.get("/site/attendance", { params }),

	// Work reports (v2.7): submitted to the project's Site Manager, who reviews and forwards them
	listWorkReports: (params) => api.get("/site/work-reports", { params }),
	workReportSummary: () => api.get("/site/work-reports/summary"),
	getWorkReport: (id) => api.get(`/site/work-reports/${id}`),
	createWorkReport: (data) => api.post("/site/work-reports", data),
	deleteWorkReport: (id) => api.delete(`/site/work-reports/${id}`),

	// Site issues
	listIssues: (params) => api.get("/site/issues", { params }),
	getIssue: (id) => api.get(`/site/issues/${id}`),
	createIssue: (data) => api.post("/site/issues", data),
	updateIssue: (id, data) => api.patch(`/site/issues/${id}`, data),
	deleteIssue: (id) => api.delete(`/site/issues/${id}`),

	// GPS check-in / check-out
	checkIn: (data) => api.post("/site/check-in", data),
	checkOut: (data) => api.patch("/site/check-out", data),
	getCheckInHistory: (params) => api.get("/site/check-in/history", { params }),
	getActiveCheckIns: () => api.get("/site/check-in/active"),

	// Voice notes
	createVoiceNote: (data) => api.post("/site/voice-note", data),
	listVoiceNotes: (params) => api.get("/site/voice-note", { params }),
	markVoiceNoteRead: (id) => api.patch(`/site/voice-note/${id}/read`),
	deleteVoiceNote: (id) => api.delete(`/site/voice-note/${id}`),

	// Safety checklists
	createSafetyChecklist: (data) => api.post("/site/safety/checklist", data),
	listSafetyChecklists: (params) => api.get("/site/safety/checklist", { params }),
	getSafetyChecklist: (id) => api.get(`/site/safety/checklist/${id}`),
	updateSafetyChecklist: (id, data) => api.patch(`/site/safety/checklist/${id}`, data),

	// Site stock: material consumption
	// createConsumption: (data) => api.post("/site-stock/consumption", data),
	// listConsumptions: (params) => api.get("/site-stock/consumption", { params }),
	// getConsumption: (id) => api.get(`/site-stock/consumption/${id}`),
	// getConsumptionReport: (params) => api.get("/site-stock/consumption/report", { params }),
	// updateConsumption: (id, data) => api.patch(`/site-stock/consumption/${id}`, data),
	// deleteConsumption: (id) => api.delete(`/site-stock/consumption/${id}`),
	// getStockDashboard: (params) => api.get("/site-stock/dashboard", { params }),

	// Site stock: stock-in reports (material arrived)
	// createStockReport: (data) => api.post("/site-stock", data),
	// listStockReports: (params) => api.get("/site-stock", { params }),
	// getStockReport: (id) => api.get(`/site-stock/${id}`),
	// updateStockReport: (id, data) => api.patch(`/site-stock/${id}`, data),
	// deleteStockReport: (id) => api.delete(`/site-stock/${id}`),

	// Assigned projects
	listProjects: (params) => api.get("/project", { params }),
	// getProject: (id) => api.get(`/project/${id}`),
	// getProjectTowers: (id) => api.get(`/project/${id}/towers`),
	// getTower: (id, towerName) => api.get(`/project/${id}/towers/${encodeURIComponent(towerName)}`),
	// getAvailableFlats: (id, towerName) =>
	// api.get(`/project/${id}/towers/${encodeURIComponent(towerName)}/available-flats`),
	// getProjectTimeline: (id) => api.get(`/project/${id}/timeline`),
	// getProjectDprs: (id) => api.get(`/project/${id}/dpr`),
	// getProjectIssues: (id) => api.get(`/project/${id}/issues`),

	// Tower milestones
	// getTowerMilestoneMatrix: (id) => api.get(`/project/${id}/tower-milestones`),
	// getTowerMilestones: (id, towerName) =>
	// api.get(`/project/${id}/towers/${encodeURIComponent(towerName)}/milestones`),
	// completeMilestone: (id, towerName, milestoneId, data = {}) =>
	// api.post(
	// `/project/${id}/towers/${encodeURIComponent(towerName)}/milestones/${milestoneId}/complete`,
	// data
	// ),
	// updateMilestone: (id, towerName, milestoneId, data) =>
	// api.patch(`/project/${id}/towers/${encodeURIComponent(towerName)}/milestones/${milestoneId}`, data),

	// HR and payroll (own)
	// The PDF path (/hr/salary/all) is forbidden to site engineers on the live server; the self-service path works
	// getSalarySlips: () => api.get("/hr/salary/my-slips"),
	// getSalaryReport: (params) => api.get("/hr/salary/report", { params, responseType: "blob" }),
	// // The PDF path (/hr/attendance) is forbidden to site engineers on the live server; the self-service path works
	// getHrAttendance: (params) => api.get("/hr/attendance/my", { params }),
	// applyLeave: (data) => api.post("/hr/leaves", data),

	// Procurement
	// createMaterialRequest: (data) => api.post("/procurement/material-requests", data),
};
