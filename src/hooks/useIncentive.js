import { useCallback, useState } from "react";
import { toast } from "sonner";
import { incentiveApi } from "@/api";

export const useIncentive = () => {
	// ==================== INCENTIVE STATE ====================

	const [incentives, setIncentives] = useState([]);
	const [incentiveDetail, setIncentiveDetail] = useState(null);
	const [incentiveSummary, setIncentiveSummary] = useState(null);

	// ==================== CONFIG STATE ====================

	const [config, setConfig] = useState(null);

	// ==================== PAGINATION ====================

	const [pagination, setPagination] = useState({
		page: 1,
		limit: 20,
		total: 0,
		pages: 0,
	});

	// ==================== LOADING ====================

	const [loading, setLoading] = useState(false);

	// =========================================================
	// GET ALL INCENTIVES
	// =========================================================

	const fetchIncentives = useCallback(async (params = {}) => {
		setLoading(true);

		try {
			const res = await incentiveApi.getAllIncentives(params);

			setIncentives(res.data?.data?.items || []);

			if (res.data?.data?.pagination) {
				setPagination(res.data.data.pagination);
			}

			return res.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to load incentives",
			);

			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// =========================================================
	// GET INCENTIVE DETAIL
	// =========================================================

	const fetchIncentiveById = useCallback(async (id) => {
		if (!id) return null;

		setLoading(true);

		try {
			const res = await incentiveApi.getIncentiveById(id);

			setIncentiveDetail(res.data?.data || null);

			return res.data?.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to load incentive details",
			);

			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// =========================================================
	// MONTHLY SUMMARY
	// =========================================================

	const fetchIncentiveSummary = useCallback(async (params = {}) => {
		setLoading(true);

		try {
			const res = await incentiveApi.getIncentiveSummary(params);

			setIncentiveSummary(res.data?.data || null);

			return res.data?.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to load incentive summary",
			);

			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// =========================================================
	// GET CONFIG
	// =========================================================

	const fetchConfig = useCallback(async () => {
		setLoading(true);

		try {
			const res = await incentiveApi.getConfig();

			setConfig(res.data?.data || null);

			return res.data?.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to load incentive configuration",
			);

			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// =========================================================
	// UPDATE CONFIG
	// =========================================================

	const updateConfig = async (data) => {
		setLoading(true);

		try {
			const res = await incentiveApi.updateConfig(data);

			setConfig(res.data?.data || null);

			toast.success(
				res.data?.message ||
					"Incentive configuration updated successfully",
			);

			return res.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to update incentive configuration",
			);

			return null;
		} finally {
			setLoading(false);
		}
	};

	// =========================================================
	// CREATE MANUAL EXTRA WORK INCENTIVE
	// =========================================================

	const createManualIncentive = async (data) => {
		setLoading(true);

		try {
			const res = await incentiveApi.createManualIncentive(data);

			toast.success(
				res.data?.message || "Manual incentive created successfully",
			);

			return res.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to create manual incentive",
			);

			return null;
		} finally {
			setLoading(false);
		}
	};

	// =========================================================
	// SYNC / BACKFILL
	// =========================================================

	const syncIncentives = async (data = {}) => {
		setLoading(true);

		try {
			const res = await incentiveApi.syncIncentives(data);

			toast.success(
				res.data?.message || "Incentives synced successfully",
			);

			return res.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to sync incentives",
			);

			return null;
		} finally {
			setLoading(false);
		}
	};

	// =========================================================
	// UPDATE EXTRA INCENTIVE
	// =========================================================

	const updateExtraIncentive = async (id, data) => {
		setLoading(true);

		try {
			const res = await incentiveApi.updateExtraIncentive(id, data);

			toast.success(
				res.data?.message || "Extra incentive updated successfully",
			);

			return res.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to update extra incentive",
			);

			return null;
		} finally {
			setLoading(false);
		}
	};

	// =========================================================
	// UPDATE PAYMENT META
	// =========================================================

	const updatePaymentMeta = async (id, data) => {
		setLoading(true);

		try {
			const res = await incentiveApi.updatePaymentMeta(id, data);

			toast.success(
				res.data?.message || "Payment metadata updated successfully",
			);

			return res.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to update payment metadata",
			);

			return null;
		} finally {
			setLoading(false);
		}
	};

	// =========================================================
	// UPDATE PAYOUT
	// =========================================================

	const updatePayout = async (id, data) => {
		setLoading(true);

		try {
			const res = await incentiveApi.updatePayout(id, data);

			toast.success(
				res.data?.message || "Incentive payout updated successfully",
			);

			return res.data;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to update incentive payout",
			);

			return null;
		} finally {
			setLoading(false);
		}
	};

	// =========================================================
	// DELETE INCENTIVE
	// =========================================================

	const deleteIncentive = async (id) => {
		setLoading(true);

		try {
			const res = await incentiveApi.deleteIncentive(id);

			toast.success(
				res.data?.message || "Incentive deleted successfully",
			);

			return true;
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to delete incentive",
			);

			return false;
		} finally {
			setLoading(false);
		}
	};

	// =========================================================
	// CLEAR DETAIL
	// =========================================================

	const clearIncentiveDetail = () => {
		setIncentiveDetail(null);
	};

	// =========================================================
	// RETURN
	// =========================================================

	return {
		// State
		incentives,
		incentiveDetail,
		incentiveSummary,
		config,

		// Common
		loading,
		pagination,

		// Incentives
		fetchIncentives,
		fetchIncentiveById,
		fetchIncentiveSummary,

		// Config
		fetchConfig,
		updateConfig,

		// Manual
		createManualIncentive,

		// Sync
		syncIncentives,

		// Adjustments
		updateExtraIncentive,
		updatePaymentMeta,
		updatePayout,

		// Delete
		deleteIncentive,

		// Helpers
		clearIncentiveDetail,
	};
};
