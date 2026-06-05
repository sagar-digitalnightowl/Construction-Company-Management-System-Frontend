import api from "./axios";

export const leadApi = {
	// Leads
	getAllLeads: (params) => api.get("/lead", { params }),
	getAllMyLeads: (params) => api.get("/lead/my-leads", { params }),
	getLeadById: (id) => api.get(`/lead/${id}`),
	createLead: (data) => api.post("/lead", data),
	updateLead: (id, data) => api.patch(`/lead/${id}`, data),
	deleteLead: (id) => api.delete(`/lead/${id}`),
	convertLeadToBooking: (id) => api.post(`/lead/${id}/convert`),

	// Campaigns
	getAllCampaigns: (params) => api.get("/lead/campaigns", { params }),
	getCampaignById: (id) => api.get(`/lead/campaigns/${id}`),
	createCampaign: (data) => api.post("/lead/campaigns", data),
	updateCampaign: (id, data) => api.patch(`/lead/campaigns/${id}`, data),
	deleteCampaign: (id) => api.delete(`/lead/campaigns/${id}`),

	// Calling Records (Cold Calling)
	bulkUploadCallingRecords: (data) => api.post("/lead/bulk-upload", data),
	assignCallingRecords: (data) => api.post("/lead/assign-calling-records", data),
	assignBulkCallingRecords: (data) => api.post("/lead/calling-records/bulk-assign", data),
	getMyCallingList: (params) => api.get("/lead/my-calling-list", { params }),
	updateCallingRecordStatus: (id, data) => api.patch(`/lead/calling-record/${id}/call-status`, data),
	convertCallingRecordToLead: (id, data) => api.post(`/lead/calling-record/${id}/convert-to-lead`, data),
	getAllCallingRecords: (params) => api.get("/lead/calling-records", { params }),
	getCallingStats: (params) => api.get("/lead/calling-stats", { params }),
	deleteCallingRecord: (id) => api.delete(`/lead/calling-record/${id}`),

	// Call Logs
	addCallLog: (data) => api.post("/lead/call-log", data),
	getCallLogsForLead: (leadId, params) => api.get(`/lead/${leadId}/call-logs`, { params }),
	getMyCallLogs: (params) => api.get("/lead/my-call-logs", { params }),
	
	// Assignments
	assignLead: (id, data) => api.post(`/lead/${id}/assign`, data),
	bulkAssignLeads: (data) => api.post("/lead/bulk-assign", data),
	assignLeadsByFilter: (data) => api.post("/lead/assign-by-filter", data),
	getLeadsAssignedToMe: (params) => api.get("/lead/assigned-to-me", { params }),

	// Stats & Follow-up
	getLeadStats: (params) => api.get("/lead/stats", { params }),
	getAssignmentStats: (params) => api.get("/lead/assignment-stats", { params }),
	getAgentPerformance: (params) => api.get("/lead/agent-performance", { params }),
	getLeadsForFollowUp: (params) => api.get("/lead/follow-up-required", { params }),
	updateLeadCallStatus: (id, data) => api.patch(`/lead/${id}/call-status`, data),
	recontactLead: (id, data) => api.post(`/lead/${id}/recontact`, data),
};