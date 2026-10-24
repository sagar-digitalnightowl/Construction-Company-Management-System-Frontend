// src/hooks/useConsumption.js

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { siteStockApi } from "@/api";
import { pickList } from "@/pages/stockManager/stockHelpers";

export function useConsumption() {
	const [records, setRecords] = useState([]);
	const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
	const [loading, setLoading] = useState(false);

	const fetchConsumptions = useCallback(async (params = {}) => {
		try {
			setLoading(true);
			const res = await siteStockApi.getConsumptions({ page: 1, limit: 100, ...params });
			if (res.data.success) {
				setRecords(pickList(res.data.data));
				setPagination(res.data.data?.pagination || {});
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load consumption records");
		} finally {
			setLoading(false);
		}
	}, []);

	const createConsumption = useCallback(async (data) => {
		try {
			const res = await siteStockApi.createConsumption(data);
			toast.success("Consumption recorded");
			return res.data.data;
		} catch (error) {
			const message = error.response?.data?.message;
			toast.error((Array.isArray(message) ? message.join(", ") : message) || "Failed to record consumption");
			throw error;
		}
	}, []);

	const updateConsumption = useCallback(async (id, data) => {
		try {
			const res = await siteStockApi.updateConsumption(id, data);
			toast.success("Consumption updated");
			return res.data.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update consumption");
			throw error;
		}
	}, []);

	const deleteConsumption = useCallback(async (id) => {
		try {
			await siteStockApi.deleteConsumption(id);
			toast.success("Consumption deleted");
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete consumption");
			return false;
		}
	}, []);

	const verifyConsumption = useCallback(async (id, status, note) => {
		try {
			const res = await siteStockApi.verifyConsumption(id, { status, note });
			toast.success(`Consumption ${status}`);
			return res.data.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to verify consumption");
			throw error;
		}
	}, []);

	return {
		records,
		pagination,
		loading,
		fetchConsumptions,
		createConsumption,
		updateConsumption,
		deleteConsumption,
		verifyConsumption,
	};
}
