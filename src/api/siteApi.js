// src/api/siteApi.js
import api from './axios';

export const siteApi = {
    // Daily Progress Reports (DPR)
    getDailyReports: (params) => api.get('/site/daily-report', { params }),
    getDailyReportById: (id) => api.get(`/site/daily-report/${id}`),
    createDailyReport: (data) => api.post('/site/daily-report', data),
    updateDailyReport: (id, data) => api.patch(`/site/daily-report/${id}`, data),
    deleteDailyReport: (id) => api.delete(`/site/daily-report/${id}`),
    approveDailyReport: (id) => api.patch(`/site/daily-report/${id}/approve`),

    // Attendance
    markAttendance: (data) => api.post('/site/attendance/mark', data),
    getAttendance: (params) => api.get('/site/attendance', { params }),
    getMyAttendance: (params) => api.get('/site/attendance/my', { params }),
    updateAttendance: (id, data) => api.patch(`/site/attendance/${id}`, data),

    // Site Issues
    createIssue: (data) => api.post('/site/issues', data),
    getIssues: (params) => api.get('/site/issues', { params }),
    getIssueById: (id) => api.get(`/site/issues/${id}`),
    updateIssue: (id, data) => api.patch(`/site/issues/${id}`, data),
    deleteIssue: (id) => api.delete(`/site/issues/${id}`),
    resolveIssue: (id, data) => api.patch(`/site/issues/${id}/resolve`, data),

    // Check-in / Check-out (GPS)
    checkIn: (data) => api.post('/site/check-in', data),
    checkOut: (data) => api.patch('/site/check-out', data),
    getCheckinHistory: (params) => api.get('/site/check-in/history', { params }),
    getActiveCheckin: () => api.get('/site/check-in/active'),

    // Voice Notes
    createVoiceNote: (data) => api.post('/site/voice-note', data),
    getVoiceNotes: (params) => api.get('/site/voice-note', { params }),
    markVoiceNoteAsRead: (id) => api.patch(`/site/voice-note/${id}/read`),
    deleteVoiceNote: (id) => api.delete(`/site/voice-note/${id}`),

    // Safety Checklists
    createSafetyChecklist: (data) => api.post('/site/safety/checklist', data),
    getSafetyChecklists: (params) => api.get('/site/safety/checklist', { params }),
    getSafetyChecklistById: (id) => api.get(`/site/safety/checklist/${id}`),
    updateSafetyChecklist: (id, data) => api.patch(`/site/safety/checklist/${id}`, data),
    approveSafetyChecklist: (id) => api.patch(`/site/safety/checklist/${id}/approve`),

    // Offline Sync
    storeOfflineData: (data) => api.post('/site/offline/sync', data),
    getPendingOfflineData: (deviceId) => api.get(`/site/offline/pending?deviceId=${deviceId}`),
    markAsSynced: (dataId) => api.patch(`/site/offline/sync/${dataId}`),
    clearSyncedData: (deviceId) => api.delete(`/site/offline/sync/clear?deviceId=${deviceId}`),
};