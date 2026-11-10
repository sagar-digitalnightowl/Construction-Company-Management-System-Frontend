// Every endpoint the Site Engineer panel uses, with the paths from the Site Engineer API guide (v2.9).
// Attendance, GPS check-in/check-out and daily progress reports are switched off for this release (commented out below).
import api from "./axios";

export const siteEngineerApi = {
	// Work reports (guide section 2): submitted to the project's Site Manager, who reviews and forwards them
	listWorkReports: (params) => api.get("/site/work-reports", { params }),
	workReportSummary: () => api.get("/site/work-reports/summary"),
	getWorkReport: (id) => api.get(`/site/work-reports/${id}`),
	createWorkReport: (data) => api.post("/site/work-reports", data),
	deleteWorkReport: (id) => api.delete(`/site/work-reports/${id}`),
	// Excel workbook (.xlsx) of the work reports, with the same filters as the list (live server, checked in the v2.9 backend pass)
	exportWorkReports: (params) => api.get("/site/work-reports/export", { params: { ...params, format: "xlsx" }, responseType: "blob" }),

	// Material requests (guide section 1.1, item 13). The request body and response shape follow the v2.9 backend update.
	listMaterialRequests: (params) => api.get("/site/material-request", { params }),
	getMaterialRequest: (id) => api.get(`/site/material-request/${id}`),
	createMaterialRequest: (data) => api.post("/site/material-request", data),

	// Site issues (guide section 8)
	listIssues: (params) => api.get("/site/issues", { params }),
	getIssue: (id) => api.get(`/site/issues/${id}`),
	createIssue: (data) => api.post("/site/issues", data),
	updateIssue: (id, data) => api.patch(`/site/issues/${id}`, data),
	deleteIssue: (id) => api.delete(`/site/issues/${id}`),

	// Voice notes (guide section 10): create, list own, mark as read and delete own. Mark-as-read was tested live (v2.9 check).
	createVoiceNote: (data) => api.post("/site/voice-note", data),
	listVoiceNotes: (params) => api.get("/site/voice-note", { params }),
	markVoiceNoteRead: (id) => api.patch(`/site/voice-note/${id}/read`),
	deleteVoiceNote: (id) => api.delete(`/site/voice-note/${id}`),

	// Safety checklists (guide section 9)
	createSafetyChecklist: (data) => api.post("/site/safety/checklist", data),
	listSafetyChecklists: (params) => api.get("/site/safety/checklist", { params }),
	getSafetyChecklist: (id) => api.get(`/site/safety/checklist/${id}`),
	updateSafetyChecklist: (id, data) => api.patch(`/site/safety/checklist/${id}`, data),

	// Site stock (guide section 11): dashboard balances, own stock reports, and the forms reused from the stock module
	getStockDashboard: (params) => api.get("/site-stock/dashboard", { params }),
	getMyStockReports: (params) => api.get("/site-stock/my", { params }),

	// Assigned projects (guide section 12). The detail includes towers, floors and flats for the work report form.
	listProjects: (params) => api.get("/project", { params }),
	getProject: (id) => api.get(`/project/${id}`),

	// ---- Switched off for this release: attendance, GPS check-in/check-out, daily progress reports ----
	// markAttendance: (data) => api.post("/site/attendance/mark", data),
	// getMyAttendance: (params) => api.get("/site/attendance/my", { params }),
	// updateAttendance: (id, data) => api.patch(`/site/attendance/${id}`, data),
	// getProjectAttendance: (params) => api.get("/site/attendance", { params }),
	// checkIn: (data) => api.post("/site/check-in", data),
	// checkOut: (data) => api.patch("/site/check-out", data),
	// getCheckInHistory: (params) => api.get("/site/check-in/history", { params }),
	// getActiveCheckIns: () => api.get("/site/check-in/active"),
	// listDailyReports: (params) => api.get("/site/daily-report", { params }),
	// getDailyReport: (id) => api.get(`/site/daily-report/${id}`),
	// createDailyReport: (data) => api.post("/site/daily-report", data),
	// updateDailyReport: (id, data) => api.patch(`/site/daily-report/${id}`, data),
	// deleteDailyReport: (id) => api.delete(`/site/daily-report/${id}`),
};
