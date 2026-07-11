// // src/hooks/useFinance.js
// import { useState, useCallback } from "react";
// import { toast } from "sonner";
// import { financeApi } from "@/api";

// export const useFinance = () => {
//     const [dashboardData, setDashboardData] = useState([]);
//     const [milestones, setMilestones] = useState([]);
//     const [bookings, setBookings] = useState([]);
//     const [reminders, setReminders] = useState([]);
    
//     // ----- NEW: Payroll State -----
//     const [pendingPayrollBatches, setPendingPayrollBatches] = useState([]);
//     const [payrollBatches, setPayrollBatches] = useState([]);
//     const [currentPayrollBatch, setCurrentPayrollBatch] = useState(null);

//     const [loading, setLoading] = useState(false);
    
//     // Default pagination state
//     const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

//     // ----- Dashboard -----
//     const fetchDashboard = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await financeApi.getDashboard(params);
//             setDashboardData(res.data?.data || []);
//             if (res.data?.pagination) setPagination(res.data.pagination);
//         } catch (err) {
//             toast.error("Failed to load dashboard");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ----- Milestones -----
//     const fetchProjectMilestones = useCallback(async (projectId) => {
//         setLoading(true);
//         try {
//             const res = await financeApi.getProjectMilestones(projectId);
//             setMilestones(res.data || []);
//         } catch (err) {
//             toast.error("Failed to load milestones");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const markMilestone = async (projectId, data) => {
//         setLoading(true);
//         try {
//             await financeApi.markMilestone(projectId, data);
//             toast.success("Milestone marked as completed");
//             // refresh milestones
//             await fetchProjectMilestones(projectId);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to mark milestone");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ----- Reminders (manual) -----
//     const sendNormalReminder = async (bookingId, data) => {
//         setLoading(true);
//         try {
//             await financeApi.sendManualReminder(bookingId, data);
//             toast.success("Normal reminder sent");
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to send reminder");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const sendPenaltyReminder = async (bookingId, data) => {
//         setLoading(true);
//         try {
//             await financeApi.sendManualPenaltyReminder(bookingId, data);
//             toast.success("Penalty reminder sent");
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to send penalty reminder");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ----- Bookings -----
//     const fetchBookings = useCallback(async (params = {}) => {
//         setLoading(true);
//         setBookings([]);
//         try {
//             const res = await financeApi.getAllBookings(params);
//             setBookings(res.data?.data || []);
//             if (res.data?.pagination) setPagination(res.data.pagination);
//         } catch (err) {
//             toast.error("Failed to load bookings");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ----- Reminder Logs -----
//     const fetchReminderLogs = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await financeApi.getReminderLogs(params);
//             setReminders(res.data?.data || []);
//             if (res.data?.pagination) setPagination(res.data.pagination);
//         } catch (err) {
//             toast.error("Failed to load reminder logs");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ================= NEW PAYROLL APPROVAL WORKFLOW =================

//     // UPDATED: Added params for pagination
//     const fetchPendingPayrollApprovals = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await financeApi.getPendingPayrollApprovals(params);
//             setPendingPayrollBatches(res.data?.data || []);
//             // Added pagination state update
//             if (res.data?.pagination) setPagination(res.data.pagination);
//         } catch (err) {
//             toast.error("Failed to load pending payroll approvals");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchAllPayrollBatches = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await financeApi.getAllPayrollBatches(params);
//             setPayrollBatches(res.data?.data || []);
//             if (res.data?.pagination) setPagination(res.data.pagination);
//         } catch (err) {
//             toast.error("Failed to load payroll batches");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchPayrollBatchById = useCallback(async (id) => {
//         setLoading(true);
//         try {
//             const res = await financeApi.getPayrollBatchById(id);
//             setCurrentPayrollBatch(res.data?.data || null);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load payroll batch details");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const acknowledgePayrollBatch = async (id) => {
//         setLoading(true);
//         try {
//             await financeApi.acknowledgeReceipt(id);
//             toast.success("Payroll batch acknowledged successfully");
//             // Refetch is handled by the UI component to maintain pagination state
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to acknowledge payroll batch");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const approvePayrollBatch = async (id) => {
//         setLoading(true);
//         try {
//             await financeApi.approvePayrollBatch(id);
//             toast.success("Payroll batch approved successfully");
//             // Refetch is handled by the UI component to maintain pagination state
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to approve payroll batch");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const rejectPayrollBatch = async (id, reasonData) => {
//         setLoading(true);
//         try {
//             await financeApi.rejectPayrollBatch(id, reasonData); // reasonData = { reason: "..." }
//             toast.success("Payroll batch rejected");
//             // Refetch is handled by the UI component to maintain pagination state
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to reject payroll batch");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const sendPayrollToBank = async (id, bankData) => {
//         setLoading(true);
//         try {
//             await financeApi.sendPayrollToBank(id, bankData); // bankData = { bankReferenceNumber, bankName, remarks }
//             toast.success("Payroll marked as Sent to Bank");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to update bank status");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const markPayrollBankProcessed = async (id, confirmData) => {
//         setLoading(true);
//         try {
//             const res = await financeApi.markPayrollBankProcessed(id, confirmData); // confirmData = { bankConfirmationRef, remarks }
//             toast.success(`Bank processing confirmed. ${res.data?.data?.slipsUpdated || 0} salary slips marked as Paid!`);
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to mark as processed");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         // Core State
//         dashboardData,
//         milestones,
//         bookings,
//         reminders,
//         loading,
//         pagination,
        
//         // Payroll State
//         pendingPayrollBatches,
//         payrollBatches,
//         currentPayrollBatch,

//         // Core Functions
//         fetchDashboard,
//         fetchProjectMilestones,
//         markMilestone,
//         sendNormalReminder,
//         sendPenaltyReminder,
//         fetchBookings,
//         fetchReminderLogs,

//         // Payroll Functions
//         fetchPendingPayrollApprovals,
//         fetchAllPayrollBatches,
//         fetchPayrollBatchById,
//         acknowledgePayrollBatch,  
//         approvePayrollBatch,
//         rejectPayrollBatch,
//         sendPayrollToBank,
//         markPayrollBankProcessed,
//     };
// };





// src/hooks/useFinance.js
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { financeApi } from "@/api";
import { hrApi } from "@/api/hrApi"; // Added to handle Finance side of Expense Tickets

export const useFinance = () => {
    const [dashboardData, setDashboardData] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [reminders, setReminders] = useState([]);
    
    // ----- NEW: Payroll State -----
    const [pendingPayrollBatches, setPendingPayrollBatches] = useState([]);
    const [payrollBatches, setPayrollBatches] = useState([]);
    const [currentPayrollBatch, setCurrentPayrollBatch] = useState(null);

    // ----- NEW: Expense Payment State (Finance Queue) -----
    const [approvedExpenses, setApprovedExpenses] = useState([]);

    const [loading, setLoading] = useState(false);
    
    // Default pagination state
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

    // ----- Dashboard -----
    const fetchDashboard = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await financeApi.getDashboard(params);
            setDashboardData(res.data?.data || []);
            if (res.data?.pagination) setPagination(res.data.pagination);
        } catch (err) {
            toast.error("Failed to load dashboard");
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
            // refresh milestones
            await fetchProjectMilestones(projectId);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to mark milestone");
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
            toast.error(err.response?.data?.message || "Failed to send reminder");
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
            toast.error(err.response?.data?.message || "Failed to send penalty reminder");
        } finally {
            setLoading(false);
        }
    };

    // ----- Bookings -----
    // UPDATED: Inherently supports { search: 'keyword', projectId: '123' } via params
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

    // ================= NEW EXPENSE PAYMENT WORKFLOW (FINANCE) =================
    
    // Fetch only 'Approved' tickets for the Finance queue
    const fetchApprovedExpenses = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllExpenses({ status: 'Approved', ...params });
            setApprovedExpenses(res.data?.data || []);
            if (res.data?.pagination) setPagination(res.data.pagination);
        } catch (err) {
            toast.error("Failed to load approved expenses");
        } finally {
            setLoading(false);
        }
    }, []);

    // Process the instant payment (Step 7 of Radhe's doc)
    const payExpenseTicket = async (id, paymentData) => {
        setLoading(true);
        try {
            await hrApi.payExpense(id, paymentData); // paymentData = { paymentMethod, paymentReference, remarks }
            toast.success("Expense ticket marked as Paid successfully!");
            await fetchApprovedExpenses(); // Refresh list to remove the paid ticket from pending queue
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to process expense payment");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ================= NEW PAYROLL APPROVAL WORKFLOW =================

    // UPDATED: Added params for pagination
    const fetchPendingPayrollApprovals = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await financeApi.getPendingPayrollApprovals(params);
            setPendingPayrollBatches(res.data?.data || []);
            // Added pagination state update
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
            // Refetch is handled by the UI component to maintain pagination state
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to acknowledge payroll batch");
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
            // Refetch is handled by the UI component to maintain pagination state
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to approve payroll batch");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const rejectPayrollBatch = async (id, reasonData) => {
        setLoading(true);
        try {
            await financeApi.rejectPayrollBatch(id, reasonData); // reasonData = { reason: "..." }
            toast.success("Payroll batch rejected");
            // Refetch is handled by the UI component to maintain pagination state
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reject payroll batch");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const sendPayrollToBank = async (id, bankData) => {
        setLoading(true);
        try {
            await financeApi.sendPayrollToBank(id, bankData); // bankData = { bankReferenceNumber, bankName, remarks }
            toast.success("Payroll marked as Sent to Bank");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update bank status");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const markPayrollBankProcessed = async (id, confirmData) => {
        setLoading(true);
        try {
            const res = await financeApi.markPayrollBankProcessed(id, confirmData); // confirmData = { bankConfirmationRef, remarks }
            toast.success(`Bank processing confirmed. ${res.data?.data?.slipsUpdated || 0} salary slips marked as Paid!`);
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to mark as processed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        // Core State
        dashboardData,
        milestones,
        bookings,
        reminders,
        loading,
        pagination,
        
        // Payroll State
        pendingPayrollBatches,
        payrollBatches,
        currentPayrollBatch,

        // Expense State (Finance)
        approvedExpenses,

        // Core Functions
        fetchDashboard,
        fetchProjectMilestones,
        markMilestone,
        sendNormalReminder,
        sendPenaltyReminder,
        fetchBookings,
        fetchReminderLogs,

        // Expense Functions (Finance)
        fetchApprovedExpenses,
        payExpenseTicket,

        // Payroll Functions
        fetchPendingPayrollApprovals,
        fetchAllPayrollBatches,
        fetchPayrollBatchById,
        acknowledgePayrollBatch,  
        approvePayrollBatch,
        rejectPayrollBatch,
        sendPayrollToBank,
        markPayrollBankProcessed,
    };
};