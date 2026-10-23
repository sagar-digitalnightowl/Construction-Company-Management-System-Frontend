// src/hooks/useSiteStock.js

import { useState, useCallback } from "react";
import { siteStockApi } from "@/api";
import { toast } from "sonner";

export function useSiteStock() {
	const [reports, setReports] = useState([]);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 20,
		total: 0,
		pages: 0,
	});
	const [stats, setStats] = useState(null);
	const [projectSummary, setProjectSummary] = useState(null);
	const [loading, setLoading] = useState(false);

	// Fetch all reports (with filters)
	const fetchReports = useCallback(async (params = {}) => {
		try {
			setLoading(true);
			const response = await siteStockApi.getStockReports(params);
			
			if (response.data.success) {
				setReports(response.data.data.items || []);
				setPagination(response.data.data.pagination || {});
			}
		} catch (error) {
			console.error("Error fetching stock reports:", error);
			toast.error(error.response?.data?.message || "Failed to fetch stock reports");
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch my reports (Site Manager)
	const fetchMyReports = useCallback(async (params = {}) => {
		try {
			setLoading(true);
			const response = await siteStockApi.getStockReports(params);
			
			if (response.data.success) {
				setReports(response.data.data.items || []);
				setPagination(response.data.data.pagination || {});
			}
		} catch (error) {
			console.error("Error fetching my reports:", error);
			toast.error(error.response?.data?.message || "Failed to fetch reports");
		} finally {
			setLoading(false);
		}
	}, []);

	// Create stock report
	const createReport = useCallback(async (data) => {
		try {
			const response = await siteStockApi.createStockReport(data);
			
			if (response.data.success) {
				toast.success("Stock report created successfully");
				return response.data.data;
			}
		} catch (error) {
			console.error("Error creating stock report:", error);
			toast.error(error.response?.data?.message || "Failed to create stock report");
			throw error;
		}
	}, []);

	// Update stock report
	const updateReport = useCallback(async (id, data) => {
		try {
			const response = await siteStockApi.updateReport(id, data);
			
			if (response.data.success) {
				toast.success("Stock report updated successfully");
				return response.data.data;
			}
		} catch (error) {
			console.error("Error updating stock report:", error);
			toast.error(error.response?.data?.message || "Failed to update stock report");
			throw error;
		}
	}, []);

	// Delete stock report
	const deleteReport = useCallback(async (id) => {
		try {
			const response = await siteStockApi.deleteReport(id);
			
			if (response.data.success) {
				toast.success("Stock report deleted successfully");
				return true;
			}
		} catch (error) {
			console.error("Error deleting stock report:", error);
			toast.error(error.response?.data?.message || "Failed to delete stock report");
			return false;
		}
	}, []);

	// Verify/Reject report
	const verifyReport = useCallback(async (id, status, note) => {
		try {
			const response = await siteStockApi.verifyReport(id, { status, note });
			
			if (response.data.success) {
				toast.success(`Report ${status} successfully`);
				return response.data.data;
			}
		} catch (error) {
			console.error("Error verifying stock report:", error);
			toast.error(error.response?.data?.message || "Failed to verify stock report");
			throw error;
		}
	}, []);

	// Fetch stats
	const fetchStats = useCallback(async (params = {}) => {
		try {
			setLoading(true);
			const response = await siteStockApi.getStats(params);
			
			if (response.data.success) {
				setStats(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching stats:", error);
			toast.error(error.response?.data?.message || "Failed to fetch statistics");
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch project summary
	const fetchProjectSummary = useCallback(async (projectId) => {
		try {
			setLoading(true);
			const response = await siteStockApi.getProjectSummary(projectId);
			
			if (response.data.success) {
				setProjectSummary(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching project summary:", error);
			toast.error(error.response?.data?.message || "Failed to fetch project summary");
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch single report by ID
	const fetchReportById = useCallback(async (id) => {
		try {
			const response = await siteStockApi.getReportById(id);
			
			if (response.data.success) {
				return response.data.data;
			}
		} catch (error) {
			console.error("Error fetching report:", error);
			toast.error(error.response?.data?.message || "Failed to fetch report details");
			throw error;
		}
	}, []);

	return {
		reports,
		pagination,
		stats,
		projectSummary,
		loading,
		fetchReports,
		fetchMyReports,
		fetchReportById,
		createReport,
		updateReport,
		deleteReport,
		verifyReport,
		fetchStats,
		fetchProjectSummary,
	};
}
