import api from "./axios";

export const projectApi = {

    // ================= BASIC =================
    getAll: () => api.get("/project"),

    getById: (id) => api.get(`/project/${id}`),

    create: (data) => api.post("/project", data),

    update: (id, data) => api.put(`/project/${id}`, data),

    delete: (id) => api.delete(`/project/${id}`), // archive

    // ================= STATS =================
    getStats: () => api.get("/project/stats"),

    // ================= TEAM =================
    assignTeam: (id, data) =>
        api.post(`/project/${id}/assign-team`, data),

    removeTeam: (projectId, userId) =>
        api.delete(`/project/${projectId}/team/${userId}`),

    updateTeamRole: (projectId, userId, data) =>
        api.patch(`/project/${projectId}/team/${userId}/role`, data),

    // ================= MILESTONES =================
    addMilestone: (id, data) =>
        api.post(`/project/${id}/milestones`, data),

    // ================= PROGRESS =================
    updateProgress: (id, data) =>
        api.patch(`/project/${id}/progress`, data),

    // ================= BOQ =================
    addBOQ: (id, data) =>
        api.post(`/project/${id}/boq`, data),

    // ================= COMMENTS =================
    addComment: (id, data) =>
        api.post(`/project/${id}/comments`, data),

    // ================= PHASE =================
    updatePhase: (id, data) =>
        api.patch(`/project/${id}/phase`, data),


        // ================= RISKS =================
    addRisk: (id, data) =>
        api.post(`/project/${id}/risks`, data),

    getRisks: (id) =>
        api.get(`/project/${id}/risks`),




    // ================= ACTIVITY =================
    getActivity: (id) =>
        api.get(`/project/${id}/activity`),

    // ================= RESOURCES =================
    allocateResource: (id, data) =>
        api.post(`/project/${id}/resources`, data),

    getResources: (id) =>
        api.get(`/project/${id}/resources`),



    // ================= ISSUES =================
    reportIssue: (id, data) =>
        api.post(`/project/${id}/issues`, data),

    getIssues: (id) =>
        api.get(`/project/${id}/issues`),

    resolveIssue: (id, issueId, data) =>
        api.patch(`/project/${id}/issues/${issueId}/resolve`, data),

    // ================= HEALTH =================
    getHealth: (id) =>
        api.get(`/project/${id}/health`),

    // ================= DEPENDENCIES =================
    getDependencies: (id) =>
        api.get(`/project/${id}/dependencies`),

    // ================= DOCUMENTS =================

    getPresignedUrl: (id, data) =>
        api.post(`/project/${id}/documents/presigned-url`, data),

    confirmUpload: (id, data) =>
        api.post(`/project/${id}/documents/confirm`, data),

    deleteDocument: (documentId) =>
        api.delete(`/project/documents/${documentId}`),

    // ================= ANALYTICS =================
    getDelayedProjects: () =>
        api.get(`/project/delayed`),

    getBudgetUtilization: (id) =>
        api.get(`/project/${id}/budget-utilization`),

    getTimeline: (id) =>
        api.get(`/project/${id}/timeline`),


    // ================= DPR =================

    getDPR: (id) =>
        api.get(`/project/${id}/dpr`),
};