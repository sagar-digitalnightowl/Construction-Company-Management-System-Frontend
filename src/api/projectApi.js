
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



    towers: {
        getAll: (projectId) => api.get(`/project/${projectId}/towers`),
        getByName: (projectId, towerName) =>
            api.get(`/project/${projectId}/towers/${encodeURIComponent(towerName)}`),
        create: (projectId, data) => api.post(`/project/${projectId}/towers`, data),
        update: (projectId, towerIndex, data) =>
            api.put(`/project/${projectId}/towers/${towerIndex}`, data),
        delete: (projectId, towerIndex) =>
            api.delete(`/project/${projectId}/towers/${towerIndex}`),
        addFloor: (projectId, towerIndex, data) =>
            api.post(`/project/${projectId}/towers/${towerIndex}/floors`, data),
        updateFloor: (projectId, towerIndex, floorIndex, data) =>
            api.put(`/project/${projectId}/towers/${towerIndex}/floors/${floorIndex}`, data),
        deleteFloor: (projectId, towerIndex, floorIndex) =>
            api.delete(`/project/${projectId}/towers/${towerIndex}/floors/${floorIndex}`),
        addFlat: (projectId, towerIndex, floorIndex, data) =>
            api.post(`/project/${projectId}/towers/${towerIndex}/floors/${floorIndex}/flats`, data),
        updateFlat: (projectId, towerIndex, floorIndex, flatIndex, data) =>
            api.put(`/project/${projectId}/towers/${towerIndex}/floors/${floorIndex}/flats/${flatIndex}`, data),
        deleteFlat: (projectId, towerIndex, floorIndex, flatIndex) =>
            api.delete(`/project/${projectId}/towers/${towerIndex}/floors/${floorIndex}/flats/${flatIndex}`),
        getAvailableFlats: (projectId, towerName) =>
            api.get(`/project/${projectId}/towers/${encodeURIComponent(towerName)}/available-flats`),
        getAllFlats: (projectId, params) =>
            api.get(`/project/${projectId}/flats`, { params }),
    },
};


