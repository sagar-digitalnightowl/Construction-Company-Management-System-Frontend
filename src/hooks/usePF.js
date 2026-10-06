import { useCallback, useState } from "react";
import { toast } from "sonner";

import { pfApi } from "@/api";

export const usePF = () => {
	const [payrollPreview, setPayrollPreview] = useState(null);
	const [bookingLedger, setBookingLedger] = useState(null);
	const [ledgerLoading, setLedgerLoading] = useState(false);
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

	// ==================== BOOKING LEDGER ====================

	const fetchBookingLedger = useCallback(async (employeeId, upToMonth) => {
		try {
			setLedgerLoading(true);

			const res = await pfApi.getBookingLedger(employeeId, upToMonth);

			if (res.data?.success) {
				setBookingLedger(res.data.data);
				return res.data.data;
			}

			toast.error(res.data?.message || "Failed to load booking ledger");
			return null;
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Failed to load booking ledger",
			);
			return null;
		} finally {
			setLedgerLoading(false);
		}
	}, []);

	const adjustBookingLedger = useCallback(async (data) => {
		try {
			setLedgerLoading(true);

			const res = await pfApi.adjustBookingLedger(data);

			if (res.data?.success) {
				toast.success(res.data?.message || "Ledger updated");
				return res.data.data ?? true;
			}

			toast.error(res.data?.message || "Failed to update ledger");
			return null;
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to update ledger",
			);
			return null;
		} finally {
			setLedgerLoading(false);
		}
	}, []);

	// ==================== RESET ====================

	const clearPayrollPreview = useCallback(() => {
		setPayrollPreview(null);
	}, []);

	return {
		payrollPreview,
		loading,
		bookingLedger,
		ledgerLoading,

		fetchBookingLedger,
		adjustBookingLedger,
		calculatePayrollPreview,
		clearPayrollPreview,
	};
};
