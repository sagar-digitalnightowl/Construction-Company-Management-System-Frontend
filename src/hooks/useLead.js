import { useState, useCallback } from "react";
import { toast } from "sonner";
import { leadApi } from "@/api/leadApi";

export const useLead = () => {
	const [leads, setLeads] = useState([]);
	const [leadStatistics, setLeadStatistics] = useState(null);

	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		pages: 0,
	});

	const [loading, setLoading] = useState(false);

	// ==================== Leads ====================

	const fetchLeads = useCallback(async (params = {}) => {
		setLoading(true);

		try {
			const res = await leadApi.getAllLeads(params);

			setLeads(res.data?.data?.leads || []);

			setLeadStatistics(res.data?.data?.statistics || null);

			setPagination(
				res.data?.data?.pagination || {
					page: 1,
					limit: 10,
					total: 0,
					pages: 0,
				},
			);

			return res.data?.data;
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to load leads");

			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const getLeadById = useCallback(async (id) => {
		try {
			const res = await leadApi.getLeadById(id);

			return res?.data?.data;
		} catch (error) {
			toast.error(
				error?.response?.data?.message || "Failed to fetch lead",
			);

			return null;
		}
	}, []);

	const createLead = async (data) => {
		setLoading(true);

		try {
			const res = await leadApi.generateLead(data);

			toast.success(res.data?.message || "Lead generated successfully");

			await fetchLeads();

			return res.data?.data;
		} catch (err) {
			toast.error(
				err?.response?.data?.message || "Failed to generate lead",
			);

			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateLead = async (id, data) => {
		setLoading(true);

		try {
			const res = await leadApi.updateLead(id, data);

			toast.success(res.data?.message || "Lead updated successfully");

			await fetchLeads();

			return res.data?.data;
		} catch (err) {
			toast.error(
				err?.response?.data?.message || "Failed to update lead",
			);

			return null;
		} finally {
			setLoading(false);
		}
	};

	const deleteLead = async (id) => {
		setLoading(true);

		try {
			const res = await leadApi.deleteLead(id);

			toast.success(res.data?.message || "Lead deleted successfully");

			await fetchLeads();

			return true;
		} catch (err) {
			toast.error(
				err?.response?.data?.message || "Failed to delete lead",
			);

			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		// Data
		leads,
		leadStatistics,
		pagination,
		loading,

		// Actions
		fetchLeads,
		getLeadById,
		createLead,
		updateLead,
		deleteLead
	};
};
