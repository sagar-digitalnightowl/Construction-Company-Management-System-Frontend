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

    const fetchProject = useCallback(async (id, loading = true) => {
        if (loading) setLoading(true);
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

    const updateProgress = async (id, progress) => {
        try {
            await projectApi.updateProgress(id, { progress });
            setProject(prev => ({ ...prev, progress }));
            toast.success('Progress updated');
            return true;
        } catch (err) {
            toast.error('Failed to update progress');
            return false;
        }
    };

    const updatePhase = async (id, phase) => {
        try {
            await projectApi.updatePhase(id, { phase });
            setProject(prev => ({ ...prev, currentPhase: phase }));
            toast.success('Phase updated');
            return true;
        } catch (err) {
            toast.error('Failed to update phase');
            return false;
        }
    };

    const addMilestone = async (id, data) => {
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
    };

    const addBOQItem = async (id, data) => {
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
    };

    const addComment = async (id, text) => {
        try {
            const res = await projectApi.addComment(id, { comment: text });
            if (res.data.success) {
                await fetchProject(id, false);
                toast.success('Comment added');
                return true;
            }
        } catch (err) {
            toast.error('Failed to add comment');
            return false;
        }
    };

    const addRisk = async (id, data) => {
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
    };

    const addIssue = async (id, data) => {
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
    };

    const resolveIssue = async (projectId, issueId) => {
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
    };

    const createMaterialRequest = async (id, data) => {
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
    };

    const assignTeam = async (id, userIds) => {
        try {
            await projectApi.assignTeam(id, { teamMembers: userIds });
            await fetchProject(id, false);
            toast.success('Team members added');
            return true;
        } catch (err) {
            toast.error('Failed to assign team');
            return false;
        }
    };

    return {
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
    };
};