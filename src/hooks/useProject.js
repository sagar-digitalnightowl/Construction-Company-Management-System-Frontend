// src/hooks/useProject.js
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { projectApi } from '@/api/projectApi';

export const useProject = () => {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [boq, setBoq] = useState({ items: [], totalAmount: 0, isApproved: false });
    const [comments, setComments] = useState([]);
    const [issues, setIssues] = useState([]);
    const [risks, setRisks] = useState([]);
    const [activity, setActivity] = useState([]);
    const [materialRequests, setMaterialRequests] = useState([]);
    const [documents, setDocuments] = useState([]);

    // New state
    const [weatherLogs, setWeatherLogs] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [notes, setNotes] = useState([]);
    const [checklists, setChecklists] = useState([]);
    const [resources, setResources] = useState([]);
    const [health, setHealth] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [budgetUtilization, setBudgetUtilization] = useState(null);
    const [activityPagination, setActivityPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

    const [unitsData, setUnitsData] = useState({ units: [], statistics: null });


    const [towersData, setTowersData] = useState({
        projectId: null,
        projectName: "",
        totalTowers: 0,
        towers: [],
    });

    // Existing fetchProject
    const fetchProject = useCallback(async (id, showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const res = await projectApi.getById(id);
            const data = res.data?.data;
            setProject(data?.project);
            setMilestones(data?.milestones || []);
            setBoq(data?.boq || { items: [], totalAmount: 0, isApproved: false });
            setComments(data?.comments || []);
            setIssues(data?.project?.issues || []);
            setRisks(data?.project?.risks || []);
            setMaterialRequests(data?.materialRequests || []);
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load project');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Activity with pagination
    const fetchActivity = useCallback(async (id, page = 1, limit = 20) => {
        try {
            const res = await projectApi.getActivity(id, { page, limit });
            const data = res.data?.data;
            setActivity(data?.activities || []);
            setActivityPagination({
                page: data?.page || page,
                limit: data?.limit || limit,
                total: data?.total || 0,
                pages: data?.pages || 0,
            });
            return data;
        } catch (err) {
            toast.error('Failed to load activity');
            return null;
        }
    }, []);

    // Weather
    const fetchWeatherLogs = useCallback(async (id, params = {}) => {
        try {
            const res = await projectApi.getWeatherLogs(id, params);
            const data = res.data?.data || [];
            setWeatherLogs(data);
            return data;
        } catch (err) {
            toast.error('Failed to load weather logs');
            return [];
        }
    }, []);

    const addWeatherLog = useCallback(async (id, logData) => {
        try {
            const res = await projectApi.addWeatherLog(id, logData);
            if (res.data?.success) {
                toast.success('Weather log added');
                await fetchWeatherLogs(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add weather log');
            return false;
        }
    }, [fetchWeatherLogs]);

    // Visitors
    const fetchVisitors = useCallback(async (id, params = {}) => {
        try {
            const res = await projectApi.getVisitors(id, params);
            const data = res.data?.data || [];
            setVisitors(data);
            return data;
        } catch (err) {
            toast.error('Failed to load visitors');
            return [];
        }
    }, []);

    const addVisitor = useCallback(async (id, visitorData) => {
        try {
            const res = await projectApi.addVisitor(id, visitorData);
            if (res.data?.success) {
                toast.success('Visitor added');
                await fetchVisitors(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add visitor');
            return false;
        }
    }, [fetchVisitors]);

    const checkoutVisitor = useCallback(async (id, visitorId) => {
        try {
            const res = await projectApi.checkoutVisitor(id, visitorId);
            if (res.data?.success) {
                toast.success('Visitor checked out');
                await fetchVisitors(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error('Failed to checkout visitor');
            return false;
        }
    }, [fetchVisitors]);

    // Notes
    const fetchNotes = useCallback(async (id, params = {}) => {
        try {
            const res = await projectApi.getNotes(id, params);
            const data = res.data?.data || [];
            setNotes(data);
            return data;
        } catch (err) {
            toast.error('Failed to load notes');
            return [];
        }
    }, []);

    const addNote = useCallback(async (id, noteData) => {
        try {
            const res = await projectApi.addNote(id, noteData);
            if (res.data?.success) {
                toast.success('Note added');
                await fetchNotes(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add note');
            return false;
        }
    }, [fetchNotes]);

    const updateNote = useCallback(async (id, noteId, noteData) => {
        try {
            const res = await projectApi.updateNote(id, noteId, noteData);
            if (res.data?.success) {
                toast.success('Note updated');
                await fetchNotes(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update note');
            return false;
        }
    }, [fetchNotes]);

    const deleteNote = useCallback(async (id, noteId) => {
        try {
            const res = await projectApi.deleteNote(id, noteId);
            if (res.data?.success) {
                toast.success('Note deleted');
                await fetchNotes(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete note');
            return false;
        }
    }, [fetchNotes]);

    // Safety Checklists
    const fetchChecklists = useCallback(async (id) => {
        try {
            const res = await projectApi.getSafetyChecklists(id);
            const data = res.data?.data || [];
            setChecklists(data);
            return data;
        } catch (err) {
            toast.error('Failed to load checklists');
            return [];
        }
    }, []);

    const createChecklist = useCallback(async (id, checklistData) => {
        try {
            const res = await projectApi.createSafetyChecklist(id, checklistData);
            if (res.data?.success) {
                toast.success('Checklist created');
                await fetchChecklists(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create checklist');
            return false;
        }
    }, [fetchChecklists]);

    const updateChecklist = useCallback(async (id, checklistId, data) => {
        try {
            const res = await projectApi.updateSafetyChecklist(id, checklistId, data);
            if (res.data?.success) {
                toast.success('Checklist updated');
                await fetchChecklists(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update checklist');
            return false;
        }
    }, [fetchChecklists]);

    // Resources
    const fetchResources = useCallback(async (id) => {
        try {
            const res = await projectApi.getResources(id);
            const data = res.data?.data || [];
            setResources(data);
            return data;
        } catch (err) {
            toast.error('Failed to load resources');
            return [];
        }
    }, []);

    const allocateResource = useCallback(async (id, resourceData) => {
        try {
            const res = await projectApi.allocateResource(id, resourceData);
            if (res.data?.success) {
                toast.success('Resource allocated');
                await fetchResources(id);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to allocate resource');
            return false;
        }
    }, [fetchResources]);

    // Team management (additional)
    const removeTeamMember = useCallback(async (projectId, userId) => {
        try {
            const res = await projectApi.removeTeamMember(projectId, userId);
            if (res.data?.success) {
                toast.success('Team member removed');
                await fetchProject(projectId, false);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member');
            return false;
        }
    }, [fetchProject]);

    const updateTeamRole = useCallback(async (projectId, userId, roleData) => {
        try {
            const res = await projectApi.updateTeamRole(projectId, userId, roleData);
            if (res.data?.success) {
                toast.success('Role updated');
                await fetchProject(projectId, false);
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update role');
            return false;
        }
    }, [fetchProject]);

    // Health, Timeline, Budget
    const fetchHealth = useCallback(async (id) => {
        try {
            const res = await projectApi.getHealth(id);
            const data = res.data?.data;
            setHealth(data);
            return data;
        } catch (err) {
            toast.error('Failed to load health status');
            return null;
        }
    }, []);

    const fetchTimeline = useCallback(async (id) => {
        try {
            const res = await projectApi.getTimeline(id);
            const data = res.data?.data;
            setTimeline(data);
            return data;
        } catch (err) {
            toast.error('Failed to load timeline');
            return null;
        }
    }, []);

    const fetchBudgetUtilization = useCallback(async (id) => {
        try {
            const res = await projectApi.getBudgetUtilization(id);
            const data = res.data?.data;
            setBudgetUtilization(data);
            return data;
        } catch (err) {
            toast.error('Failed to load budget utilization');
            return null;
        }
    }, []);

    // Documents
    const fetchDocuments = useCallback(async (id) => {
        try {
            const res = await projectApi.getDocuments(id);
            const data = res.data?.data || [];
            setDocuments(data);
            return data;
        } catch (err) {
            toast.error('Failed to load documents');
            return [];
        }
    }, []);

    const uploadDocument = useCallback(async (id, file, metadata = {}) => {
        try {
            // Step 1: presigned URL
            const presignRes = await projectApi.getPresignedUrl(id, {
                fileName: file.name,
                fileType: 'document',
                mimeType: file.type,
            });
            const { uploadUrl, fileKey } = presignRes.data.data;
            // Step 2: upload to S3
            await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
            // Step 3: confirm
            await projectApi.confirmUpload(id, { fileKey, ...metadata });
            toast.success('Document uploaded');
            await fetchDocuments(id);
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload document');
            return false;
        }
    }, [fetchDocuments]);

    const deleteDocument = useCallback(async (documentId) => {
        try {
            const res = await projectApi.deleteDocument(documentId);
            if (res.data?.success) {
                toast.success('Document deleted');
                // need to refresh documents from current project – caller should handle or we can refetch if we know projectId
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete document');
            return false;
        }
    }, []);

    // Existing methods unchanged but listed for completeness
    const updateProgress = useCallback(async (id, progress) => {
        try {
            await projectApi.updateProgress(id, { progress });
            setProject(prev => ({ ...prev, progress }));
            toast.success('Progress updated');
            return true;
        } catch (err) {
            toast.error('Failed to update progress');
            return false;
        }
    }, []);

    const updatePhase = useCallback(async (id, phase) => {
        try {
            await projectApi.updatePhase(id, { phase });
            setProject(prev => ({ ...prev, currentPhase: phase }));
            toast.success('Phase updated');
            return true;
        } catch (err) {
            toast.error('Failed to update phase');
            return false;
        }
    }, []);

    const addMilestone = useCallback(async (id, data) => {
        try {
            const res = await projectApi.addMilestone(id, data);
            if (res.data.success) {
                await fetchProject(id, false);
                toast.success('Milestone added');
                return true;
            }
        } catch (err) {
            toast.error('Failed to add milestone');
            return false;
        }
    }, [fetchProject]);

    const addBOQItem = useCallback(async (id, data) => {
        try {
            const res = await projectApi.addBOQItem(id, data);
            if (res.data.success) {
                await fetchProject(id, false);
                toast.success('BOQ item added');
                return true;
            }
        } catch (err) {
            toast.error('Failed to add BOQ item');
            return false;
        }
    }, [fetchProject]);

    const addComment = useCallback(async (id, text) => {
        try {
            const res = await projectApi.addComment(id, { text });
            if (res.data.success) {
                await fetchProject(id, false);
                toast.success('Comment added');
                return true;
            }
        } catch (err) {
            toast.error('Failed to add comment');
            return false;
        }
    }, [fetchProject]);

    const addRisk = useCallback(async (id, data) => {
        try {
            const res = await projectApi.addRisk(id, data);
            if (res.data.success) {
                await fetchProject(id, false);
                toast.success('Risk added');
                return true;
            }
        } catch (err) {
            toast.error('Failed to add risk');
            return false;
        }
    }, [fetchProject]);

    const addIssue = useCallback(async (id, data) => {
        try {
            const res = await projectApi.reportIssue(id, data);
            if (res.data.success) {
                await fetchProject(id, false);
                toast.success('Issue reported');
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to report issue');
            return false;
        }
    }, [fetchProject]);

    const resolveIssue = useCallback(async (projectId, issueId) => {
        try {
            const res = await projectApi.resolveIssue(projectId, issueId, { resolved: true });
            if (res.data.success) {
                await fetchProject(projectId, false);
                toast.success('Issue resolved');
                return true;
            }
        } catch (err) {
            toast.error('Failed to resolve issue');
            return false;
        }
    }, [fetchProject]);

    const createMaterialRequest = useCallback(async (id, data) => {
        try {
            const res = await projectApi.createMaterialRequest(id, data);
            if (res.data.success) {
                await fetchProject(id, false);
                toast.success('Material request created');
                return true;
            }
        } catch (err) {
            toast.error('Failed to create request');
            return false;
        }
    }, [fetchProject]);

    const assignTeam = useCallback(async (id, userIds) => {
        try {
            await projectApi.assignTeam(id, { teamMembers: userIds });
            await fetchProject(id, false);
            toast.success('Team members added');
            return true;
        } catch (err) {
            toast.error('Failed to assign team');
            return false;
        }
    }, [fetchProject]);

    const fetchUnits = useCallback(async (id) => {
        if (!id) return;
        try {
            const res = await projectApi.getUnits(id);
            const data = res.data?.data;
            setUnitsData({
                units: data?.units || [],
                statistics: data?.statistics || null,
            });
            return data;
        } catch (err) {
            toast.error('Failed to load units data');
            return null;
        }
    }, []);




    const fetchTowers = useCallback(async (projectId, showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const res = await projectApi.towers.getAll(projectId);
            if (res.data.success) {
                setTowersData(res.data.data);
            }
        } catch (err) {
            toast.error('Failed to load towers');
        } finally {
            setLoading(false);
        }
    }, []);

    const addTower = useCallback(async (projectId, towerData) => {
        try {
            const res = await projectApi.towers.create(projectId, towerData);
            if (res.data.success) {
                toast.success('Tower added');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add tower');
            return false;
        }
    }, [fetchTowers]);

    const updateTower = useCallback(async (projectId, towerIndex, towerData) => {
        try {
            const res = await projectApi.towers.update(projectId, towerIndex, towerData);
            if (res.data.success) {
                toast.success('Tower updated');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update tower');
            return false;
        }
    }, [fetchTowers]);

    const deleteTower = useCallback(async (projectId, towerIndex) => {
        try {
            const res = await projectApi.towers.delete(projectId, towerIndex);
            if (res.data.success) {
                toast.success('Tower deleted');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete tower');
            return false;
        }
    }, [fetchTowers]);

    const addFloor = useCallback(async (projectId, towerIndex, floorData) => {
        try {
            const res = await projectApi.towers.addFloor(projectId, towerIndex, floorData);
            if (res.data.success) {
                toast.success('Floor added');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add floor');
            return false;
        }
    }, [fetchTowers]);

    const updateFloor = useCallback(async (projectId, towerIndex, floorIndex, floorData) => {
        try {
            const res = await projectApi.towers.updateFloor(projectId, towerIndex, floorIndex, floorData);
            if (res.data.success) {
                toast.success('Floor updated');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update floor');
            return false;
        }
    }, [fetchTowers]);

    const deleteFloor = useCallback(async (projectId, towerIndex, floorIndex) => {
        try {
            const res = await projectApi.towers.deleteFloor(projectId, towerIndex, floorIndex);
            if (res.data.success) {
                toast.success('Floor deleted');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete floor');
            return false;
        }
    }, [fetchTowers]);

    const addFlat = useCallback(async (projectId, towerIndex, floorIndex, flatData) => {
        try {
            const res = await projectApi.towers.addFlat(projectId, towerIndex, floorIndex, flatData);
            if (res.data.success) {
                toast.success('Flat added');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add flat');
            return false;
        }
    }, [fetchTowers]);

    const updateFlat = useCallback(async (projectId, towerIndex, floorIndex, flatIndex, flatData) => {
        try {
            const res = await projectApi.towers.updateFlat(projectId, towerIndex, floorIndex, flatIndex, flatData);
            if (res.data.success) {
                toast.success('Flat updated');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update flat');
            return false;
        }
    }, [fetchTowers]);

    const deleteFlat = useCallback(async (projectId, towerIndex, floorIndex, flatIndex) => {
        try {
            const res = await projectApi.towers.deleteFlat(projectId, towerIndex, floorIndex, flatIndex);
            if (res.data.success) {
                toast.success('Flat deleted');
                await fetchTowers(projectId, false);
                return true;
            }
            throw new Error(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete flat');
            return false;
        }
    }, [fetchTowers]);

    const fetchAvailableFlats = useCallback(async (projectId, towerName, params) => {
        try {
            const res = await projectApi.towers.getAvailableFlats(projectId, towerName);
            if (res.data.success) {
                return res.data.data;
            }
            return null;
        } catch (err) {
            toast.error('Failed to load available flats');
            return null;
        }
    }, []);

    const fetchAllFlats = useCallback(async (projectId, params) => {
        try {
            const res = await projectApi.towers.getAllFlats(projectId, params);
            if (res.data.success) {
                return res.data.data;
            }
            return [];
        } catch (err) {
            toast.error('Failed to load flats');
            return [];
        }
    }, []);



    return {
        // State
        loading,
        project,
        milestones,
        boq,
        comments,
        issues,
        risks,
        activity,
        materialRequests,
        documents,
        weatherLogs,
        visitors,
        notes,
        checklists,
        resources,
        health,
        timeline,
        budgetUtilization,
        activityPagination,
        unitsData,

        // Core
        fetchProject,
        updateProgress,
        updatePhase,
        addMilestone,
        addBOQItem,
        addComment,
        addRisk,
        addIssue,
        resolveIssue,
        createMaterialRequest,
        assignTeam,
        fetchUnits,

        // Activity
        fetchActivity,

        // Weather
        fetchWeatherLogs,
        addWeatherLog,

        // Visitors
        fetchVisitors,
        addVisitor,
        checkoutVisitor,

        // Notes
        fetchNotes,
        addNote,
        updateNote,
        deleteNote,

        // Checklists
        fetchChecklists,
        createChecklist,
        updateChecklist,

        // Resources
        fetchResources,
        allocateResource,

        // Team management
        removeTeamMember,
        updateTeamRole,

        // Health, Timeline, Budget
        fetchHealth,
        fetchTimeline,
        fetchBudgetUtilization,

        // Documents
        fetchDocuments,
        uploadDocument,
        deleteDocument,



        // Towers
        towersData,
        fetchTowers,
        addTower,
        updateTower,
        deleteTower,
        addFloor,
        updateFloor,
        deleteFloor,
        addFlat,
        updateFlat,
        deleteFlat,
        fetchAvailableFlats,
        fetchAllFlats,
    };
};