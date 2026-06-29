// src/api/financeApi.js
import api from './axios';

export const financeApi = {
    // 1. Finance Dashboard
    getDashboard: () => api.get('/finance/dashboard'),

    // 2. Project Milestones
    getProjectMilestones: (projectId) =>
        api.get(`/finance/project/${projectId}/milestones`),

    // 3. Mark Milestone Completed
    markMilestone: (projectId, data) =>
        api.post(`/finance/project/${projectId}/milestone`, data),

    // 4. Manual Normal Reminder
    sendManualReminder: (bookingId, data) =>
        api.post(`/finance/booking/${bookingId}/reminder`, data),

    // 5. Manual Penalty Reminder
    sendManualPenaltyReminder: (bookingId, data) =>
        api.post(`/finance/booking/${bookingId}/penalty-reminder`, data),

    // 6. All Bookings with Details
    getAllBookings: (params) =>
        api.get('/finance/bookings', { params }),

    // 7. Reminder Logs
    getReminderLogs: (params) =>
        api.get('/finance/reminders', { params }),
};