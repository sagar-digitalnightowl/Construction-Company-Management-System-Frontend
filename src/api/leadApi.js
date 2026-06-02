import api from "./axios";

export const leadApi = {
	// Generate Lead
	generateLead: (data) => api.post("/lead", data),

	// Get Leads
	getAllLeads: (params) => api.get("/lead", { params }),
	getMyLeads: (params) => api.get("/lead/my-leads", { params }),
	getLeadsByEmployee: (employeeId, params) =>
		api.get(`/lead/employee/${employeeId}`, { params }),

	// Statistics
	getLeadStats: () => api.get("/lead/stats"),

	// Single Lead
	getLeadById: (id) => api.get(`/lead/${id}`),

	// Update Lead
	updateLead: (id, data) => api.patch(`/lead/${id}`, data),

	// Delete Lead
	deleteLead: (id) => api.delete(`/lead/${id}`),

	// Convert Lead to Booking
	convertLeadToBooking: (id, data) => api.post(`/lead/${id}/convert`, data),
};
