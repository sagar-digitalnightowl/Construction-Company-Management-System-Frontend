// src/hooks/useFinance.js
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { financeApi } from "@/api";

export const useFinance = () => {
    const [dashboardData, setDashboardData] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

    // ----- Dashboard -----
    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const res = await financeApi.getDashboard();
            setDashboardData(res.data || []);
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
    const fetchBookings = useCallback(async (params = {}) => {
        setLoading(true);
        setBookings([]);
        try {
            const res = await financeApi.getAllBookings(params);
            setBookings(res.data || []);
            // optional pagination if API supports it
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
            setReminders(res.data || []);
        } catch (err) {
            toast.error("Failed to load reminder logs");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        dashboardData,
        milestones,
        bookings,
        reminders,
        loading,
        pagination,
        fetchDashboard,
        fetchProjectMilestones,
        markMilestone,
        sendNormalReminder,
        sendPenaltyReminder,
        fetchBookings,
        fetchReminderLogs,
    };
};