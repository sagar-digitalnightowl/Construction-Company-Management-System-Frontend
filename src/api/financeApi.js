// // // src/api/financeApi.js
// import api from './axios';

// export const financeApi = {
//     // 1. Finance Dashboard (Accepts params for pagination)
//     getDashboard: (params) => api.get('/finance/dashboard', { params }),

//     // 2. Project Milestones
//     getProjectMilestones: (projectId) =>
//         api.get(`/finance/project/${projectId}/milestones`),

//     // 3. Mark Milestone Completed
//     markMilestone: (projectId, data) =>
//         api.post(`/finance/project/${projectId}/milestone`, data),

//     // 4. Manual Normal Reminder
//     sendManualReminder: (bookingId, data) =>
//         api.post(`/finance/booking/${bookingId}/reminder`, data),

//     // 5. Manual Penalty Reminder
//     sendManualPenaltyReminder: (bookingId, data) =>
//         api.post(`/finance/booking/${bookingId}/penalty-reminder`, data),

//     // 6. All Bookings with Details (Accepts params for pagination)
//     getAllBookings: (params) =>
//         api.get('/finance/bookings', { params }),

//     // 7. Reminder Logs (Accepts params for pagination)
//     getReminderLogs: (params) =>
//         api.get('/finance/reminders', { params }),

//     // ================= NEW PAYROLL APPROVAL APIs =================
    
//     // 8. Get Pending Payroll Approvals (Finance Queue) - UPDATED TO ACCEPT PARAMS
//     getPendingPayrollApprovals: (params) => 
//         api.get('/finance/payroll/pending', { params }),

//     // 9. Get All Payroll Batches (Accepts params for pagination/filters)
//     getAllPayrollBatches: (params) => 
//         api.get('/finance/payroll', { params }),

//     // 10. Get Single Payroll Batch Detail (Includes Excel URL & slips)
//     getPayrollBatchById: (id) => 
//         api.get(`/finance/payroll/${id}`),

//     // 11. Acknowledge Payroll Batch Receipt (NEW)
//     acknowledgeReceipt: (id) => 
//         api.put(`/finance/payroll/${id}/acknowledge-receipt`),

//     // 12. Approve Payroll Batch
//     approvePayrollBatch: (id) => 
//         api.put(`/finance/payroll/${id}/approve`),

//     // 13. Reject Payroll Batch (Requires body: { reason: "..." })
//     rejectPayrollBatch: (id, data) => 
//         api.put(`/finance/payroll/${id}/reject`, data),

//     // 14. Send to Bank (Requires body: { bankReferenceNumber, bankName, remarks })
//     sendPayrollToBank: (id, data) => 
//         api.put(`/finance/payroll/${id}/send-to-bank`, data),

//     // 15. Mark as Bank Processed (Requires body: { bankConfirmationRef, remarks })
//     // NOTE: This call will automatically update all related Salary Slips to 'Paid'
//     markPayrollBankProcessed: (id, data) => 
//         api.put(`/finance/payroll/${id}/bank-processed`, data),

//     // ================= NEW WHATSAPP REMINDER APIs =================
// // 16. Get Due Installments (Accepts dueDate, overdue, page, limit)
// getDueInstallments: (params) => api.get('/finance/installments/due', { params }),

// // 17. Send WhatsApp Reminders (Requires body: { installmentIds: [...] })
// sendWhatsAppReminders: (data) => api.post('/finance/reminders/whatsapp/send', data),
        
//     // =============================================================
// };














import api from './axios';

export const financeApi = {
    // 1. Finance Dashboard
    getDashboard: (params) => api.get('/finance/dashboard', { params }),

    // 🔥 NEW: Fetch single project finance details with GST
    getProjectDetails: (projectId) => api.get(`/finance/project/${projectId}`),

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

    // 6. All Bookings
    getAllBookings: (params) =>
        api.get('/finance/bookings', { params }),

    // 7. Reminder Logs
    getReminderLogs: (params) =>
        api.get('/finance/reminders', { params }),

    // Payroll APIs
    getPendingPayrollApprovals: (params) => 
        api.get('/finance/payroll/pending', { params }),

    getAllPayrollBatches: (params) => 
        api.get('/finance/payroll', { params }),

    getPayrollBatchById: (id) => 
        api.get(`/finance/payroll/${id}`),

    acknowledgeReceipt: (id) => 
        api.put(`/finance/payroll/${id}/acknowledge-receipt`),

    approvePayrollBatch: (id) => 
        api.put(`/finance/payroll/${id}/approve`),

    rejectPayrollBatch: (id, data) => 
        api.put(`/finance/payroll/${id}/reject`, data),

    sendPayrollToBank: (id, data) => 
        api.put(`/finance/payroll/${id}/send-to-bank`, data),

    markPayrollBankProcessed: (id, data) => 
        api.put(`/finance/payroll/${id}/bank-processed`, data),

    // WhatsApp Reminder APIs
    getDueInstallments: (params) => api.get('/finance/installments/due', { params }),
    sendWhatsAppReminders: (data) => api.post('/finance/reminders/whatsapp/send', data),
};