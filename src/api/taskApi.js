// src/api/taskApi.js
import api from './axios';

export const taskApi = {
    // ---------- Task CRUD (Web only: create, update, delete) ----------
    createTask: (projectId, data) => api.post(`/task/project/${projectId}`, data),
    getTaskById: (id) => api.get(`/task/${id}`),
    updateTask: (id, data) => api.put(`/task/${id}`, data),         // Web only
    deleteTask: (id) => api.delete(`/task/${id}`),                 // Web only

    // ---------- Lists & Views ----------
    getMyTasks: (params) => api.get('/task/my-tasks', { params }),
    getOverdueTasks: () => api.get('/task/overdue'),
    getTasksByProject: (projectId, params) => api.get(`/task/project/${projectId}`, { params }),
    getTaskStats: (projectId) => api.get(`/task/stats/${projectId}`),
    getMyTaskStats: () => api.get('/task/stats/my'),
    getKanbanBoard: (projectId) => api.get(`/task/kanban/${projectId}`),
    getGanttChart: (projectId) => api.get(`/task/gantt/${projectId}`),
    getCalendarView: (month) => api.get('/task/calendar', { params: { month } }),

    // ---------- Export & Bulk ----------
    exportTasks: (params) => api.get('/task/export', { params }),   // params: format, projectId, status
    bulkUpdateStatus: (data) => api.patch('/task/bulk-status', data), // { taskIds, status }

    // ---------- Task Status ----------
    updateTaskStatus: (id, status) => api.patch(`/task/${id}/status`, { status }),

    // ---------- Comments ----------
    addComment: (id, text, parentId = null) => api.post(`/task/${id}/comments`, { text, parentId }),

    // ---------- Checklist ----------
    addChecklistItem: (id, title) => api.post(`/task/${id}/checklist`, { title }),
    updateChecklistItem: (id, index, data) => api.patch(`/task/${id}/checklist/${index}`, data),

    // ---------- Subtasks ----------
    addSubtask: (id, data) => api.post(`/task/${id}/subtasks`, data),   // Web only
    updateSubtaskStatus: (id, index, isCompleted) => api.patch(`/task/${id}/subtasks/${index}`, { isCompleted }),

    // ---------- Time Tracking ----------
    startTimeTrack: (id, notes) => api.post(`/task/${id}/time-track/start`, { notes }),
    stopTimeTrack: (id, notes) => api.post(`/task/${id}/time-track/stop`, { notes }),
    getTimeTracking: (id) => api.get(`/task/${id}/time-track`),

    // ---------- Task Progress ----------
    updateTaskProgress: (id, progress) => api.patch(`/task/${id}/progress`, { progress }),

    // ---------- Reminders ----------
    addReminder: (id, data) => api.post(`/task/${id}/reminders`, data), // data: { message, remindAt, type }
    getReminders: () => api.get('/task/reminders'),

    // ---------- Watchers ----------
    addWatcher: (id, userId) => api.post(`/task/${id}/watchers`, { userId }),
    removeWatcher: (id, userId) => api.delete(`/task/${id}/watchers/${userId}`),

    // ---------- Task Requests (due date change / reassign) ----------
    requestDueDateChange: (id, newDueDate, reason) => api.post(`/task/${id}/due-date-request`, { newDueDate, reason }),
    requestReassignment: (id, reassignTo, reason) => api.post(`/task/${id}/reassign-request`, { reassignTo, reason }),
    getTaskRequests: (status) => api.get('/task/requests', { params: { status } }),
    approveTaskRequest: (requestId) => api.patch(`/task/requests/${requestId}/approve`),
    rejectTaskRequest: (requestId, reason) => api.patch(`/task/requests/${requestId}/reject`, { reason }),

    // ---------- Attachments ----------
    getPresignedUrl: (id, fileName, fileType, mimeType) =>
        api.post(`/task/${id}/attachments/presigned-url`, { fileName, fileType, mimeType }),
    confirmAttachment: (id, fileKey, name = null) =>
        api.post(`/task/${id}/attachments/confirm`, { fileKey, name }),
    removeAttachment: (id, index) => api.delete(`/task/${id}/attachments/${index}`), // Web only

    // ---------- Tags ----------
    addTag: (id, name, color) => api.post(`/task/${id}/tags`, { name, color }), // Web only

    // ---------- Dependencies ----------
    addDependency: (id, dependsOn, blockingReason) =>
        api.post(`/task/${id}/dependencies`, { dependsOn, blockingReason }),
};