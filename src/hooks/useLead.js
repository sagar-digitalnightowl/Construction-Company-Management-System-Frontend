import { useState, useCallback } from "react";
import { toast } from "sonner";
import { leadApi } from "@/api/leadApi";
import { projectApi } from "@/api"; // assume exists

export const useLead = () => {
	// Lead data
	const [leads, setLeads] = useState({
		leads: [],
		pagination: { page: 1, limit: 10, total: 0, pages: 0 },
		statistics: null,
	});

	const [lead, setLead] = useState(null);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

	// Campaign data
	const [campaigns, setCampaigns] = useState([]);
	const [campaign, setCampaign] = useState(null);

	// Calling records
	const [callingRecords, setCallingRecords] = useState({
		records: [],
		statistics: null,
		pagination: { page: 1, limit: 20, total: 0, pages: 0 },
	});

	const [myCallingList, setMyCallingList] = useState({});
	const [callLogs, setCallLogs] = useState([]);
	const [myCallLogs, setMyCallLogs] = useState({
		logs: [],
		summary: null,
		pagination: { page: 1, limit: 20, total: 0, pages: 0 },
	});

	// Stats
	const [leadStats, setLeadStats] = useState(null);
	const [assignmentStats, setAssignmentStats] = useState(null);
	const [agentPerformance, setAgentPerformance] = useState([]);

	// Projects (for conversion)
	const [projects, setProjects] = useState([]);
	const fetchProjects = useCallback(async () => {
		try {
			const res = await projectApi.getAll();
			setProjects(res.data?.data?.projects || []);
		} catch (err) {
			console.error(err);
		}
	}, []);

	// ========== LEADS ==========
	const fetchLeads = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getAllLeads(params);
			const data = res.data?.data || {};
			setLeads({
				leads: data.leads || [],
				pagination: data.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
				statistics: data.statistics || null,
			});
		} catch (err) {
			toast.error("Failed to load leads");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchMyLeads = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getAllMyLeads(params);
			const data = res.data?.data || {};
			setLeads({
				leads: data.leads || [],
				pagination: data.pagination || { page: 1, limit: 10, total: data.totalLeads, pages: 0 } || { page: 1, limit: 10, total: 0, pages: 0 },
				statistics: data.statistics || null,
			});
		} catch (err) {
			toast.error("Failed to load leads");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchLeadById = useCallback(async (id) => {
		setLoading(true);
		try {
			const res = await leadApi.getLeadById(id);
			setLead(res.data?.data);
			return res.data?.data;
		} catch (err) {
			toast.error("Failed to load lead details");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const createLead = async (data, isEmployee = false) => {
		setLoading(true);
		try {
			const res = await leadApi.createLead(data);
			toast.success("Lead created successfully");
			await (isEmployee ? fetchMyLeads() : fetchLeads());
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to create lead");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateLead = async (id, data, isEmployee = false) => {
		setLoading(true);
		try {
			const res = await leadApi.updateLead(id, data);
			toast.success("Lead updated");
			await (isEmployee ? fetchMyLeads() : fetchLeads());
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to update lead");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const deleteLead = async (id, isEmployee = false) => {
		setLoading(true);
		try {
			await leadApi.deleteLead(id);
			toast.success("Lead deleted");
			await (isEmployee ? fetchMyLeads() : fetchLeads());
			return true;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to delete lead");
			return false;
		} finally {
			setLoading(false);
		}
	};

	const convertLeadToBooking = async (id) => {
		setLoading(true);
		try {
			const res = await leadApi.convertLeadToBooking(id);
			toast.success("Lead converted to booking");
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Conversion failed");
			return null;
		} finally {
			setLoading(false);
		}
	};

	// ========== CAMPAIGNS ==========
	const fetchCampaigns = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getAllCampaigns(params);
			setCampaigns(res.data?.data?.campaigns || []);
		} catch (err) {
			toast.error("Failed to load campaigns");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchCampaignById = useCallback(async (id) => {
		setLoading(true);
		try {
			const res = await leadApi.getCampaignById(id);
			setCampaign(res.data?.data);
			return res.data?.data;
		} catch (err) {
			toast.error("Failed to load campaign");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const createCampaign = async (data) => {
		setLoading(true);
		try {
			const res = await leadApi.createCampaign(data);
			toast.success("Campaign created");
			await fetchCampaigns();
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to create campaign");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateCampaign = async (id, data) => {
		setLoading(true);
		try {
			const res = await leadApi.updateCampaign(id, data);
			toast.success("Campaign updated");
			await fetchCampaigns();
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to update campaign");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const deleteCampaign = async (id) => {
		setLoading(true);
		try {
			await leadApi.deleteCampaign(id);
			toast.success("Campaign deleted");
			await fetchCampaigns();
			return true;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to delete campaign");
			return false;
		} finally {
			setLoading(false);
		}
	};

	// ========== CALLING RECORDS ==========
	const bulkUploadCallingRecords = async (data) => {
		setLoading(true);
		try {
			const res = await leadApi.bulkUploadCallingRecords(data);
			toast.success(`${res.data?.data?.successCount} records uploaded`);
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Bulk upload failed");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const assignCallingRecords = async (data) => {
		setLoading(true);
		try {
			const res = await leadApi.assignCallingRecords(data);
			toast.success(`${res.data?.data?.assignedCount} records assigned`);
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Assignment failed");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const fetchMyCallingList = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getMyCallingList(params);
			setMyCallingList(res.data?.data || {});
		} catch (err) {
			toast.error("Failed to load your calling list");
		} finally {
			setLoading(false);
		}
	}, []);

	const updateCallingRecordStatus = async (id, data, params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.updateCallingRecordStatus(id, data);
			toast.success("Call status updated");
			await fetchMyCallingList(params);
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to update status");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const convertCallingRecordToLead = async (id, data, params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.convertCallingRecordToLead(id, data);
			toast.success("Record converted to lead");
			await fetchMyCallingList(params);
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Conversion failed");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const fetchAllCallingRecords = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getAllCallingRecords(params);
			const data = res.data?.data || {};
			setCallingRecords({
				records: data.records || [],
				statistics: data.statistics || null,
				pagination: data.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
			});
		} catch (err) {
			toast.error("Failed to load calling records");
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteCallingRecord = async (id) => {
		setLoading(true);
		try {
			await leadApi.deleteCallingRecord(id);
			toast.success("Calling record deleted");
			await fetchAllCallingRecords();
			return true;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to delete");
			return false;
		} finally {
			setLoading(false);
		}
	};

	// ========== CALL LOGS ==========
	const addCallLog = async (data) => {
		setLoading(true);
		try {
			const res = await leadApi.addCallLog(data);
			toast.success("Call log added");
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to add call log");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const fetchCallLogsForLead = useCallback(async (leadId, params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getCallLogsForLead(leadId, params);
			setCallLogs(res.data?.data?.logs || []);
			return res.data?.data;
		} catch (err) {
			toast.error("Failed to load call logs");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchMyCallLogs = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getMyCallLogs(params);
			const data = res.data?.data || {};
			setMyCallLogs({
				logs: data.logs || [],
				summary: data.summary || null,
				pagination: data.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
			});
		} catch (err) {
			toast.error("Failed to load your call logs");
		} finally {
			setLoading(false);
		}
	}, []);

	// ========== ASSIGNMENTS ==========
	const assignLead = async (id, data) => {
		setLoading(true);
		try {
			const res = await leadApi.assignLead(id, data);
			toast.success("Lead assigned");
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Assignment failed");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const bulkAssignLeads = async (data) => {
		setLoading(true);
		try {
			const res = await leadApi.bulkAssignLeads(data);
			toast.success(`${res.data?.data?.assigned} leads assigned`);
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Bulk assignment failed");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const assignLeadsByFilter = async (data) => {
		setLoading(true);
		try {
			const res = await leadApi.assignLeadsByFilter(data);
			toast.success(`${res.data?.data?.assigned} leads assigned from filter`);
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Filter assignment failed");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const fetchLeadsAssignedToMe = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getLeadsAssignedToMe(params);
			return res.data?.data;
		} catch (err) {
			toast.error("Failed to load assigned leads");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// ========== STATISTICS ==========
	const fetchLeadStats = useCallback(async (params = {}) => {
		try {
			const res = await leadApi.getLeadStats(params);
			setLeadStats(res.data?.data);
		} catch (err) {
			toast.error("Failed to load lead stats");
		}
	}, []);

	const fetchAssignmentStats = useCallback(async (params = {}) => {
		try {
			const res = await leadApi.getAssignmentStats(params);
			setAssignmentStats(res.data?.data);
		} catch (err) {
			toast.error("Failed to load assignment stats");
		}
	}, []);

	const fetchAgentPerformance = useCallback(async (params = {}) => {
		try {
			const res = await leadApi.getAgentPerformance(params);
			setAgentPerformance(res.data?.data || []);
		} catch (err) {
			toast.error("Failed to load agent performance");
		}
	}, []);

	const fetchFollowUpLeads = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await leadApi.getLeadsForFollowUp(params);
			return res.data?.data;
		} catch (err) {
			toast.error("Failed to load follow-up leads");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateLeadCallStatus = async (id, data, isEmployee = false) => {
		setLoading(true);
		try {
			const res = await leadApi.updateLeadCallStatus(id, data);
			toast.success("Lead call status updated");
			await (isEmployee ? fetchMyLeads() : fetchLeads());
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to update call status");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const recontactLead = async (id, data) => {
		setLoading(true);
		try {
			const res = await leadApi.recontactLead(id, data);
			toast.success("Lead marked for re-contact");
			return res.data?.data;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to re-contact");
			return null;
		} finally {
			setLoading(false);
		}
	};

	return {
		// Data
		leads,
		lead,
		campaigns,
		campaign,
		callingRecords,
		myCallingList,
		callLogs,
		leadStats,
		assignmentStats,
		agentPerformance,
		projects,
		loading,
		pagination,
		myCallLogs,

		// Helper
		fetchProjects,

		// Lead CRUD
		fetchLeads,
		fetchMyLeads,
		fetchLeadById,
		createLead,
		updateLead,
		deleteLead,
		convertLeadToBooking,

		// Campaigns
		fetchCampaigns,
		fetchCampaignById,
		createCampaign,
		updateCampaign,
		deleteCampaign,

		// Calling Records
		bulkUploadCallingRecords,
		assignCallingRecords,
		fetchMyCallingList,
		updateCallingRecordStatus,
		convertCallingRecordToLead,
		fetchAllCallingRecords,
		deleteCallingRecord,

		// Call Logs
		addCallLog,
		fetchCallLogsForLead,
		fetchMyCallLogs,

		// Assignments
		assignLead,
		bulkAssignLeads,
		assignLeadsByFilter,
		fetchLeadsAssignedToMe,

		// Stats & Follow-up
		fetchLeadStats,
		fetchAssignmentStats,
		fetchAgentPerformance,
		fetchFollowUpLeads,
		updateLeadCallStatus,
		recontactLead,
	};
};