// src/hooks/useReorderLevels.js

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { siteStockApi } from "@/api";
import { pickList } from "@/pages/stockManager/stockHelpers";

export function useReorderLevels() {
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchReorderLevels = useCallback(async (params = {}) => {
		try {
			setLoading(true);
			const res = await siteStockApi.getReorderLevels(params);
			if (res.data.success) {
				setLevels(pickList(res.data.data, "reorderLevels"));
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load reorder levels");
		} finally {
			setLoading(false);
		}
	}, []);

	const saveReorderLevel = useCallback(async (id, data) => {
		try {
			if (id) {
				await siteStockApi.updateReorderLevel(id, data);
				toast.success("Reorder level updated");
			} else {
				await siteStockApi.createReorderLevel(data);
				toast.success("Reorder level saved");
			}
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to save reorder level");
			return false;
		}
	}, []);

	const deleteReorderLevel = useCallback(async (id) => {
		try {
			await siteStockApi.deleteReorderLevel(id);
			toast.success("Reorder level deleted");
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete reorder level");
			return false;
		}
	}, []);

	return { levels, loading, fetchReorderLevels, saveReorderLevel, deleteReorderLevel };
}
