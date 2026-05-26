// // src/api/projectApi.js
// import api from './axios';

// export const projectApi = {
//     // Basic CRUD
//     getAll: (params) => api.get('/project', { params }),
//     getById: (id) => api.get(`/project/${id}`),
//     create: (data) => api.post('/project', data),
//     update: (id, data) => api.put(`/project/${id}`, data),
//     delete: (id) => api.delete(`/project/${id}`), // archive
//     clone: (id) => api.post(`/project/${id}/clone`),
//     export: (params) => api.get('/project/export', { params }),


//     // Stats & Analytics
//     getStats: () => api.get('/project/stats'),
//     getDelayed: () => api.get('/project/delayed'),
//     compare: (ids) => api.get(`/project/compare?ids=${ids.join(',')}`),

//     // Team
//     assignTeam: (id, data) => api.post(`/project/${id}/assign-team`, data),
//     removeTeamMember: (projectId, userId) => api.delete(`/project/${projectId}/team/${userId}`),
//     updateTeamRole: (projectId, userId, data) => api.patch(`/project/${projectId}/team/${userId}/role`, data),

//     // Milestones
//     addMilestone: (id, data) => api.post(`/project/${id}/milestones`, data),
//     updateMilestone: (id, milestoneId, data) => api.put(`/project/${id}/milestones/${milestoneId}`, data),

//     // Progress
//     updateProgress: (id, data) => api.patch(`/project/${id}/progress`, data),

//     // Phase
//     updatePhase: (id, data) => api.patch(`/project/${id}/phase`, data),

//     // BOQ
//     addBOQItem: (id, data) => api.post(`/project/${id}/boq`, data),
//     updateBOQItem: (id, itemId, data) => api.put(`/project/${id}/boq/${itemId}`, data),

//     // Comments
//     addComment: (id, data) => api.post(`/project/${id}/comments`, data),

//     // Risks
//     addRisk: (id, data) => api.post(`/project/${id}/risks`, data),
//     updateRisk: (id, riskId, data) => api.put(`/project/${id}/risks/${riskId}`, data),

//     // Issues
//     reportIssue: (id, data) => api.post(`/project/${id}/issues`, data),
//     getIssues: (id) => api.get(`/project/${id}/issues`),
//     resolveIssue: (id, issueId, data) => api.patch(`/project/${id}/issues/${issueId}/resolve`, data),

//     // Resources
//     allocateResource: (id, data) => api.post(`/project/${id}/resources`, data),
//     getResources: (id) => api.get(`/project/${id}/resources`),

//     // Activity
//     getActivity: (id, params) => api.get(`/project/${id}/activity`, { params }),

//     // Health & Dependencies
//     getHealth: (id) => api.get(`/project/${id}/health`),
//     getHealth: (id) => api.get(`/project/${id}/health`),
//     getDependencies: (id) => api.get(`/project/${id}/dependencies`),

//     // Budget & Timeline
//     getBudgetUtilization: (id) => api.get(`/project/${id}/budget-utilization`),
//     getTimeline: (id) => api.get(`/project/${id}/timeline`),

//     // Documents
//     getPresignedUrl: (id, data) => api.post(`/project/${id}/documents/presigned-url`, data),
//     confirmUpload: (id, data) => api.post(`/project/${id}/documents/confirm`, data),
//     deleteDocument: (documentId) => api.delete(`/documents/${documentId}`),

//     // DPR (Daily Progress Report)
//     getDPR: (id, params) => api.get(`/project/${id}/dpr`, { params }),
//     createDPR: (id, data) => api.post(`/project/${id}/dpr`, data),

//     // Material Requests
//     getMaterialRequests: (id) => api.get(`/project/${id}/material-requests`),
//     createMaterialRequest: (id, data) => api.post(`/project/${id}/material-requests`, data),

//     // Templates
//     getTemplates: () => api.get('/project/templates'),
//     createTemplate: (data) => api.post('/project/templates', data),
//     applyTemplate: (id, templateId) => api.post(`/project/${id}/from-template/${templateId}`),



//     // Weather
//     addWeatherLog: (id, data) => api.post(`/project/${id}/weather`, data),
//     getWeatherLogs: (id, params) => api.get(`/project/${id}/weather`, { params }),

//     // Visitors
//     addVisitor: (id, data) => api.post(`/project/${id}/visitors`, data),
//     getVisitors: (id, params) => api.get(`/project/${id}/visitors`, { params }),
//     checkoutVisitor: (id, visitorId) => api.patch(`/project/${id}/visitors/${visitorId}/checkout`),

//     // Safety Checklists
//     createSafetyChecklist: (id, data) => api.post(`/project/${id}/safety-checklist`, data),
//     getSafetyChecklists: (id) => api.get(`/project/${id}/safety-checklist`),
//     getSafetyChecklistById: (id, checklistId) => api.get(`/project/${id}/safety-checklist/${checklistId}`),
//     updateSafetyChecklist: (id, checklistId, data) => api.patch(`/project/${id}/safety-checklist/${checklistId}`, data),

//     // Notes
//     addNote: (id, data) => api.post(`/project/${id}/notes`, data),
//     getNotes: (id, params) => api.get(`/project/${id}/notes`, { params }),
//     updateNote: (id, noteId, data) => api.patch(`/project/${id}/notes/${noteId}`, data),
//     deleteNote: (id, noteId) => api.delete(`/project/${id}/notes/${noteId}`),

//     // Resources (already partly there – add get if missing)
//     getResources: (id) => api.get(`/project/${id}/resources`), // already present, but ensure

//     // Team – additional endpoints
//     removeTeamMember: (projectId, userId) => api.delete(`/project/${projectId}/team/${userId}`),
//     updateTeamRole: (projectId, userId, data) => api.patch(`/project/${projectId}/team/${userId}/role`, data),

//     // Project Health, Timeline, Budget
//     getHealth: (id) => api.get(`/project/${id}/health`),
//     getTimeline: (id) => api.get(`/project/${id}/timeline`),
//     getBudgetUtilization: (id) => api.get(`/project/${id}/budget-utilization`),

//     // Documents (already there – ensure get list)
//     getDocuments: (id) => api.get(`/project/${id}/documents`),
// };



// src/api/projectApi.js
import api from './axios';

export const projectApi = {

    // =========================
    // BASIC CRUD
    // =========================
    getAll: (params) => api.get('/project', { params }),
    getById: (id) => api.get(`/project/${id}`),
    create: (data) => api.post('/project', data),
    update: (id, data) => api.put(`/project/${id}`, data),
    delete: (id) => api.delete(`/project/${id}`),
    clone: (id) => api.post(`/project/${id}/clone`),
    export: (params) => api.get('/project/export', { params }),

    // =========================
    // STATS & ANALYTICS
    // =========================
    getStats: () => api.get('/project/stats'),
    getDelayed: () => api.get('/project/delayed'),
    compare: (ids) => api.get(`/project/compare?ids=${ids.join(',')}`),

    // =========================
    // TEAM MANAGEMENT
    // =========================
    assignTeam: (id, data) => api.post(`/project/${id}/assign-team`, data),
    removeTeamMember: (projectId, userId) => api.delete(`/project/${projectId}/team/${userId}`),
    updateTeamRole: (projectId, userId, data) => api.patch(`/project/${projectId}/team/${userId}/role`, data),

    // =========================
    // MILESTONES
    // =========================
    addMilestone: (id, data) => api.post(`/project/${id}/milestones`, data),
    updateMilestone: (id, milestoneId, data) => api.put(`/project/${id}/milestones/${milestoneId}`, data),

    // =========================
    // PROGRESS & PHASE
    // =========================
    updateProgress: (id, data) => api.patch(`/project/${id}/progress`, data),
    updatePhase: (id, data) => api.patch(`/project/${id}/phase`, data),

    // =========================
    // BOQ
    // =========================
    addBOQItem: (id, data) => api.post(`/project/${id}/boq`, data),
    updateBOQItem: (id, itemId, data) => api.put(`/project/${id}/boq/${itemId}`, data),

    // =========================
    // COMMENTS
    // =========================
    addComment: (id, data) => api.post(`/project/${id}/comments`, data),

    // =========================
    // RISKS
    // =========================
    addRisk: (id, data) => api.post(`/project/${id}/risks`, data),
    updateRisk: (id, riskId, data) => api.put(`/project/${id}/risks/${riskId}`, data),

    // =========================
    // ISSUES
    // =========================
    reportIssue: (id, data) => api.post(`/project/${id}/issues`, data),
    getIssues: (id) => api.get(`/project/${id}/issues`),
    resolveIssue: (id, issueId, data) => api.patch(`/project/${id}/issues/${issueId}/resolve`, data),

    // =========================
    // RESOURCES
    // =========================
    allocateResource: (id, data) => api.post(`/project/${id}/resources`, data),
    getResources: (id) => api.get(`/project/${id}/resources`),

    // =========================
    // ACTIVITY
    // =========================
    getActivity: (id, params) => api.get(`/project/${id}/activity`, { params }),

    // =========================
    // HEALTH & DEPENDENCIES
    // =========================
    getHealth: (id) => api.get(`/project/${id}/health`),
    getDependencies: (id) => api.get(`/project/${id}/dependencies`),

    // =========================
    // BUDGET & TIMELINE
    // =========================
    getBudgetUtilization: (id) => api.get(`/project/${id}/budget-utilization`),
    getTimeline: (id) => api.get(`/project/${id}/timeline`),

    // =========================
    // DOCUMENTS
    // =========================
    getDocuments: (id) => api.get(`/project/${id}/documents`),
    getPresignedUrl: (id, data) => api.post(`/project/${id}/documents/presigned-url`, data),
    confirmUpload: (id, data) => api.post(`/project/${id}/documents/confirm`, data),
    deleteDocument: (documentId) => api.delete(`/project/documents/${documentId}`),

    // =========================
    // DPR (DAILY PROGRESS REPORT)
    // =========================
    getDPR: (id, params) => api.get(`/project/${id}/dpr`, { params }),
    createDPR: (id, data) => api.post(`/project/${id}/dpr`, data),

    // =========================
    // MATERIAL REQUESTS
    // =========================
    getMaterialRequests: (id) => api.get(`/project/${id}/material-requests`),
    createMaterialRequest: (id, data) => api.post(`/project/${id}/material-requests`, data),

    // =========================
    // TEMPLATES
    // =========================
    getTemplates: () => api.get('/project/templates'),
    createTemplate: (data) => api.post('/project/templates', data),
    applyTemplate: (id, templateId) => api.post(`/project/${id}/from-template/${templateId}`),

    // =========================
    // WEATHER
    // =========================
    addWeatherLog: (id, data) => api.post(`/project/${id}/weather`, data),
    getWeatherLogs: (id, params) => api.get(`/project/${id}/weather`, { params }),

    // =========================
    // VISITORS
    // =========================
    addVisitor: (id, data) => api.post(`/project/${id}/visitors`, data),
    getVisitors: (id, params) => api.get(`/project/${id}/visitors`, { params }),
    checkoutVisitor: (id, visitorId) => api.patch(`/project/${id}/visitors/${visitorId}/checkout`),

    // =========================
    // SAFETY CHECKLIST
    // =========================
    createSafetyChecklist: (id, data) => api.post(`/project/${id}/safety-checklist`, data),
    getSafetyChecklists: (id) => api.get(`/project/${id}/safety-checklist`),
    getSafetyChecklistById: (id, checklistId) => api.get(`/project/${id}/safety-checklist/${checklistId}`),
    updateSafetyChecklist: (id, checklistId, data) => api.patch(`/project/${id}/safety-checklist/${checklistId}`, data),

    // =========================
    // NOTES
    // =========================
    addNote: (id, data) => api.post(`/project/${id}/notes`, data),
    getNotes: (id, params) => api.get(`/project/${id}/notes`, { params }),
    updateNote: (id, noteId, data) => api.patch(`/project/${id}/notes/${noteId}`, data),
    deleteNote: (id, noteId) => api.delete(`/project/${id}/notes/${noteId}`),

    // =========================
    // Units
    // =========================
    getUnits: (id) => api.get(`/project/${id}/units`),
};