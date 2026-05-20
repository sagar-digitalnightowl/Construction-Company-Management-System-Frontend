// src/api/projectApi.js
import api from './axios';

export const projectApi = {
    // Basic CRUD
    getAll: (params) => api.get('/project', { params }),
    getById: (id) => api.get(`/project/${id}`),
    create: (data) => api.post('/project', data),
    update: (id, data) => api.put(`/project/${id}`, data),
    delete: (id) => api.delete(`/project/${id}`), // archive
    clone: (id) => api.post(`/project/${id}/clone`),
    export: (params) => api.get('/project/export', { params }),

    // Stats & Analytics
    getStats: () => api.get('/project/stats'),
    getDelayed: () => api.get('/project/delayed'),
    compare: (ids) => api.get(`/project/compare?ids=${ids.join(',')}`),

    // Team
    assignTeam: (id, data) => api.post(`/project/${id}/assign-team`, data),
    removeTeamMember: (projectId, userId) => api.delete(`/project/${projectId}/team/${userId}`),
    updateTeamRole: (projectId, userId, data) => api.patch(`/project/${projectId}/team/${userId}/role`, data),

    // Milestones
    addMilestone: (id, data) => api.post(`/project/${id}/milestones`, data),
    updateMilestone: (id, milestoneId, data) => api.put(`/project/${id}/milestones/${milestoneId}`, data),

    // Progress
    updateProgress: (id, data) => api.patch(`/project/${id}/progress`, data),

    // Phase
    updatePhase: (id, data) => api.patch(`/project/${id}/phase`, data),

    // BOQ
    addBOQItem: (id, data) => api.post(`/project/${id}/boq`, data),
    updateBOQItem: (id, itemId, data) => api.put(`/project/${id}/boq/${itemId}`, data),

    // Comments
    addComment: (id, data) => api.post(`/project/${id}/comments`, data),

    // Risks
    addRisk: (id, data) => api.post(`/project/${id}/risks`, data),
    updateRisk: (id, riskId, data) => api.put(`/project/${id}/risks/${riskId}`, data),

    // Issues
    reportIssue: (id, data) => api.post(`/project/${id}/issues`, data),
    getIssues: (id) => api.get(`/project/${id}/issues`),
    resolveIssue: (id, issueId, data) => api.patch(`/project/${id}/issues/${issueId}/resolve`, data),

    // Resources
    allocateResource: (id, data) => api.post(`/project/${id}/resources`, data),
    getResources: (id) => api.get(`/project/${id}/resources`),

    // Activity
    getActivity: (id, params) => api.get(`/project/${id}/activity`, { params }),

    // Health & Dependencies
    getHealth: (id) => api.get(`/project/${id}/health`),
    getDependencies: (id) => api.get(`/project/${id}/dependencies`),

    // Budget & Timeline
    getBudgetUtilization: (id) => api.get(`/project/${id}/budget-utilization`),
    getTimeline: (id) => api.get(`/project/${id}/timeline`),

    // Documents
    getPresignedUrl: (id, data) => api.post(`/project/${id}/documents/presigned-url`, data),
    confirmUpload: (id, data) => api.post(`/project/${id}/documents/confirm`, data),
    deleteDocument: (documentId) => api.delete(`/documents/${documentId}`),

    // DPR (Daily Progress Report)
    getDPR: (id, params) => api.get(`/project/${id}/dpr`, { params }),
    createDPR: (id, data) => api.post(`/project/${id}/dpr`, data),

    // Material Requests
    getMaterialRequests: (id) => api.get(`/project/${id}/material-requests`),
    createMaterialRequest: (id, data) => api.post(`/project/${id}/material-requests`, data),

    // Templates
    getTemplates: () => api.get('/project/templates'),
    createTemplate: (data) => api.post('/project/templates', data),
    applyTemplate: (id, templateId) => api.post(`/project/${id}/from-template/${templateId}`),
};