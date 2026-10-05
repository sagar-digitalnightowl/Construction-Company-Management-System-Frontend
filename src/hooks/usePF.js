import { useCallback, useState } from "react";
import { toast } from "sonner";

import { pfApi } from "@/api";

export const usePF = () => {
	const [payrollPreview, setPayrollPreview] = useState(null);
	const [loading, setLoading] = useState(false);

	// ==================== PAYROLL CALCULATE PREVIEW ====================

	const calculatePayrollPreview = useCallback(async (data) => {
		try {
			setLoading(true);

			const res = await pfApi.calculatePayrollPreview(data);

			if (res.data?.success) {
				setPayrollPreview(res.data.data);
				return res.data.data;
			}

			toast.error(
				res.data?.message || "Failed to calculate payroll preview",
			);

			return null;
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Failed to calculate payroll preview",
			);

			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// ==================== RESET ====================

	const clearPayrollPreview = useCallback(() => {
		setPayrollPreview(null);
	}, []);

	return {
		payrollPreview,
		loading,

		calculatePayrollPreview,
		clearPayrollPreview,
	};
};
