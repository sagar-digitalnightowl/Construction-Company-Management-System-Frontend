import { useState, useCallback } from "react";
import { toast } from "sonner";
import { financeApi } from "@/api";
import { hrApi } from "@/api/hrApi";

export const useFinance = () => {
	const [dashboardData, setDashboardData] = useState([]);
	const [dashboardSummary, setDashboardSummary] = useState(null); // 🔥 NEW: Overall Dashboard Summary State
	const [projectDetail, setProjectDetail] = useState(null); // 🔥 NEW: Selected Project Details
	const [milestones, setMilestones] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [reminders, setReminders] = useState([]);

	// Payroll State
	const [pendingPayrollBatches, setPendingPayrollBatches] = useState([]);
	const [payrollBatches, setPayrollBatches] = useState([]);
	const [currentPayrollBatch, setCurrentPayrollBatch] = useState(null);

	// Expense State
	const [approvedExpenses, setApprovedExpenses] = useState([]);

	const [loading, setLoading] = useState(false);

	// Pagination State
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		pages: 0,
	});
	const [dueInstallments, setDueInstallments] = useState([]);
	const [duePagination, setDuePagination] = useState({
		page: 1,
		limit: 20,
		total: 0,
		pages: 0,
	});

	// ----- Dashboard -----
	const fetchDashboard = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await financeApi.getDashboard(params);
			setDashboardData(res.data?.data || []);
			if (res.data?.summary) setDashboardSummary(res.data.summary); // 🔥 Save backend summary
			if (res.data?.pagination) setPagination(res.data.pagination);

			return res.data;
		} catch (err) {
			toast.error("Failed to load dashboard");
		} finally {
			setLoading(false);
		}
	}, []);

	// ----- 🔥 NEW: Project Details -----
	const fetchProjectDetails = useCallback(async (projectId) => {
		setLoading(true);
		try {
			const res = await financeApi.getProjectDetails(projectId);
			setProjectDetail(res.data?.data || null);
			return res.data?.data;
		} catch (err) {
			toast.error("Failed to load project details");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	// ----- Milestones -----
	const fetchProjectMilestones = useCallback(async (projectId) => {
		setLoading(true);
		try {
			const res = await financeApi.getProjectMilestones(projectId);
			setMilestones(res.data || []);
		} catch (err) {
			toast.error("Failed to load milestones");
		} finally {
			setLoading(false);
		}
	}, []);

	const markMilestone = async (projectId, data) => {
		setLoading(true);
		try {
			await financeApi.markMilestone(projectId, data);
			toast.success("Milestone marked as completed");
			await fetchProjectMilestones(projectId);
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to mark milestone",
			);
		} finally {
			setLoading(false);
		}
	};

	// ----- Reminders (manual) -----
	const sendNormalReminder = async (bookingId, data) => {
		setLoading(true);
		try {
			await financeApi.sendManualReminder(bookingId, data);
			toast.success("Normal reminder sent");
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to send reminder",
			);
		} finally {
			setLoading(false);
		}
	};

	const sendPenaltyReminder = async (bookingId, data) => {
		setLoading(true);
		try {
			await financeApi.sendManualPenaltyReminder(bookingId, data);
			toast.success("Penalty reminder sent");
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to send penalty reminder",
			);
		} finally {
			setLoading(false);
		}
	};

	// ----- Bookings -----
	const fetchBookings = useCallback(async (params = {}) => {
		setLoading(true);
		setBookings([]);
		try {
			const res = await financeApi.getAllBookings(params);
			setBookings(res.data?.data || []);
			if (res.data?.pagination) setPagination(res.data.pagination);
		} catch (err) {
			toast.error("Failed to load bookings");
		} finally {
			setLoading(false);
		}
	}, []);

	// ----- Reminder Logs -----
	const fetchReminderLogs = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await financeApi.getReminderLogs(params);
			setReminders(res.data?.data || []);
			if (res.data?.pagination) setPagination(res.data.pagination);
		} catch (err) {
			toast.error("Failed to load reminder logs");
		} finally {
			setLoading(false);
		}
	}, []);

	// ----- Expense Payment -----
	const fetchApprovedExpenses = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await hrApi.getAllExpenses({
				status: "Approved",
				...params,
			});
			setApprovedExpenses(res.data?.data || []);
			if (res.data?.pagination) setPagination(res.data.pagination);
		} catch (err) {
			toast.error("Failed to load approved expenses");
		} finally {
			setLoading(false);
		}
	}, []);

	const payExpenseTicket = async (id, paymentData) => {
		setLoading(true);
		try {
			await hrApi.payExpense(id, paymentData);
			toast.success("Expense ticket marked as Paid successfully!");
			await fetchApprovedExpenses();
			return true;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to process expense payment",
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	// ----- Payroll Workflow -----
	const fetchPendingPayrollApprovals = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await financeApi.getPendingPayrollApprovals(params);
			setPendingPayrollBatches(res.data?.data || []);
			if (res.data?.pagination) setPagination(res.data.pagination);
		} catch (err) {
			toast.error("Failed to load pending payroll approvals");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchAllPayrollBatches = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await financeApi.getAllPayrollBatches(params);
			setPayrollBatches(res.data?.data || []);
			if (res.data?.pagination) setPagination(res.data.pagination);
		} catch (err) {
			toast.error("Failed to load payroll batches");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchPayrollBatchById = useCallback(async (id) => {
		setLoading(true);
		try {
			const res = await financeApi.getPayrollBatchById(id);
			setCurrentPayrollBatch(res.data?.data || null);
			return res.data?.data;
		} catch (err) {
			toast.error("Failed to load payroll batch details");
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const acknowledgePayrollBatch = async (id) => {
		setLoading(true);
		try {
			await financeApi.acknowledgeReceipt(id);
			toast.success("Payroll batch acknowledged successfully");
			return true;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to acknowledge payroll batch",
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const approvePayrollBatch = async (id) => {
		setLoading(true);
		try {
			await financeApi.approvePayrollBatch(id);
			toast.success("Payroll batch approved successfully");
			return true;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to approve payroll batch",
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const rejectPayrollBatch = async (id, reasonData) => {
		setLoading(true);
		try {
			await financeApi.rejectPayrollBatch(id, reasonData);
			toast.success("Payroll batch rejected");
			return true;
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to reject payroll batch",
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const sendPayrollToBank = async (id, bankData) => {
		setLoading(true);
		try {
			await financeApi.sendPayrollToBank(id, bankData);
			toast.success("Payroll marked as Sent to Bank");
			return true;
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to update bank status",
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const markPayrollBankProcessed = async (id, confirmData) => {
		setLoading(true);
		try {
			const res = await financeApi.markPayrollBankProcessed(
				id,
				confirmData,
			);
			toast.success(
				`Bank processing confirmed. ${res.data?.data?.slipsUpdated || 0} salary slips marked as Paid!`,
			);
			return true;
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to mark as processed",
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const fetchDueInstallments = useCallback(async (params = {}) => {
		setLoading(true);
		try {
			const res = await financeApi.getDueInstallments(params);
			setDueInstallments(res.data?.data || []);
			if (res.data?.pagination) setDuePagination(res.data.pagination);
		} catch (err) {
			toast.error("Failed to load due installments");
		} finally {
			setLoading(false);
		}
	}, []);

	// ✅ Updated to accept language parameter and pass it in the payload
	const sendWhatsAppReminders = async (installmentIds, language = "en") => {
		setLoading(true);
		try {
			const res = await financeApi.sendWhatsAppReminders({
				installmentIds,
				language,
			});
			// toast.success(res.data?.message || "WhatsApp reminders processing started!");
			await fetchDueInstallments();
			return true;
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Failed to send WhatsApp reminders",
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return {
		dashboardData,
		dashboardSummary, // 🔥 Exported
		projectDetail, // 🔥 Exported
		milestones,
		bookings,
		reminders,
		loading,
		pagination,
		dueInstallments,
		duePagination,
		pendingPayrollBatches,
		payrollBatches,
		currentPayrollBatch,
		approvedExpenses,

		fetchDashboard,
		fetchProjectDetails, // 🔥 Exported
		fetchProjectMilestones,
		markMilestone,
		sendNormalReminder,
		sendPenaltyReminder,
		fetchBookings,
		fetchReminderLogs,
		fetchApprovedExpenses,
		payExpenseTicket,
		fetchPendingPayrollApprovals,
		fetchAllPayrollBatches,
		fetchPayrollBatchById,
		acknowledgePayrollBatch,
		approvePayrollBatch,
		rejectPayrollBatch,
		sendPayrollToBank,
		markPayrollBankProcessed,
		fetchDueInstallments,
		sendWhatsAppReminders,
	};
};
