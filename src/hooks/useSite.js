// src/hooks/useSite.js
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { siteApi } from '@/api/siteApi';
import { useAuthStore } from '@/store/authStore';

export const useSite = () => {
    const { current } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [dailyReports, setDailyReports] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [myAttendance, setMyAttendance] = useState([]);
    const [issues, setIssues] = useState([]);
    const [activeCheckin, setActiveCheckin] = useState(null);
    const [checkinHistory, setCheckinHistory] = useState([]);
    const [voiceNotes, setVoiceNotes] = useState([]);
    const [safetyChecklists, setSafetyChecklists] = useState([]);

    // ---------- Daily Reports ----------
    const fetchDailyReports = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await siteApi.getDailyReports(params);
            setDailyReports(res.data?.data?.reports || []);
        } catch (err) {
            toast.error('Failed to load daily reports');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDailyReport = useCallback(async (data) => {
        try {
            const res = await siteApi.createDailyReport(data);
            if (res.data?.success) {
                toast.success('Daily report created');
                await fetchDailyReports();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create report');
            return false;
        }
    }, [fetchDailyReports]);

    const updateDailyReport = useCallback(async (id, data) => {
        try {
            const res = await siteApi.updateDailyReport(id, data);
            if (res.data?.success) {
                toast.success('Report updated');
                await fetchDailyReports();
                return true;
            }
        } catch (err) {
            toast.error('Failed to update report');
            return false;
        }
    }, [fetchDailyReports]);

    const deleteDailyReport = useCallback(async (id) => {
        try {
            const res = await siteApi.deleteDailyReport(id);
            if (res.data?.success) {
                toast.success('Report deleted');
                await fetchDailyReports();
                return true;
            }
        } catch (err) {
            toast.error('Failed to delete report');
            return false;
        }
    }, [fetchDailyReports]);

    const approveDailyReport = useCallback(async (id) => {
        try {
            const res = await siteApi.approveDailyReport(id);
            if (res.data?.success) {
                toast.success('Report approved');
                await fetchDailyReports();
                return true;
            }
        } catch (err) {
            toast.error('Failed to approve report');
            return false;
        }
    }, [fetchDailyReports]);

    // ---------- Attendance ----------
    const fetchAttendance = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await siteApi.getAttendance(params);
            setAttendance(res.data?.data?.attendance || []);
        } catch (err) {
            toast.error('Failed to load attendance');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyAttendance = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await siteApi.getMyAttendance(params);
            setMyAttendance(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load my attendance');
        } finally {
            setLoading(false);
        }
    }, []);

    const markAttendance = useCallback(async (data) => {
        try {
            const res = await siteApi.markAttendance(data);
            if (res.data?.success) {
                toast.success('Attendance marked');
                await fetchAttendance({ projectId: data.projectId });
                if (current?.role === 'site_engineer') await fetchMyAttendance();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to mark attendance');
            return false;
        }
    }, [fetchAttendance, fetchMyAttendance, current]);

    const updateAttendance = useCallback(async (id, data) => {
        try {
            const res = await siteApi.updateAttendance(id, data);
            if (res.data?.success) {
                toast.success('Attendance updated');
                await fetchAttendance();
                return true;
            }
        } catch (err) {
            toast.error('Failed to update attendance');
            return false;
        }
    }, [fetchAttendance]);

    // ---------- Issues ----------
    const fetchIssues = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await siteApi.getIssues(params);
            setIssues(res.data?.data?.issues || []);
        } catch (err) {
            toast.error('Failed to load issues');
        } finally {
            setLoading(false);
        }
    }, []);

    const createIssue = useCallback(async (data) => {
        try {
            const res = await siteApi.createIssue(data);
            if (res.data?.success) {
                toast.success('Issue reported');
                await fetchIssues({ projectId: data.projectId });
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to report issue');
            return false;
        }
    }, [fetchIssues]);

    const resolveIssue = useCallback(async (id, resolution) => {
        try {
            const res = await siteApi.resolveIssue(id, { resolution });
            if (res.data?.success) {
                toast.success('Issue resolved');
                await fetchIssues();
                return true;
            }
        } catch (err) {
            toast.error('Failed to resolve issue');
            return false;
        }
    }, [fetchIssues]);

    // ---------- Check-in / Check-out ----------
    const fetchActiveCheckin = useCallback(async () => {
        try {
            const res = await siteApi.getActiveCheckin();
            setActiveCheckin(res.data?.data);
        } catch (err) {
            console.error('Failed to fetch active checkin');
        }
    }, []);

    const fetchCheckinHistory = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await siteApi.getCheckinHistory(params);
            setCheckinHistory(res.data?.data?.history || []);
        } catch (err) {
            toast.error('Failed to load check-in history');
        } finally {
            setLoading(false);
        }
    }, []);

    const checkIn = useCallback(async (data) => {
        try {
            const res = await siteApi.checkIn(data);
            if (res.data?.success) {
                toast.success('Checked in successfully');
                await fetchActiveCheckin();
                await fetchCheckinHistory();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to check in');
            return false;
        }
    }, [fetchActiveCheckin, fetchCheckinHistory]);

    const checkOut = useCallback(async (data) => {
        try {
            const res = await siteApi.checkOut(data);
            if (res.data?.success) {
                toast.success('Checked out successfully');
                await fetchActiveCheckin();
                await fetchCheckinHistory();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to check out');
            return false;
        }
    }, [fetchActiveCheckin, fetchCheckinHistory]);

    // ---------- Voice Notes ----------
    const fetchVoiceNotes = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await siteApi.getVoiceNotes(params);
            setVoiceNotes(res.data?.data?.notes || []);
        } catch (err) {
            toast.error('Failed to load voice notes');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVoiceNote = useCallback(async (data) => {
        try {
            const res = await siteApi.createVoiceNote(data);
            if (res.data?.success) {
                toast.success('Voice note created');
                await fetchVoiceNotes({ projectId: data.projectId });
                return true;
            }
        } catch (err) {
            toast.error('Failed to create voice note');
            return false;
        }
    }, [fetchVoiceNotes]);

    const markVoiceNoteAsRead = useCallback(async (id) => {
        try {
            const res = await siteApi.markVoiceNoteAsRead(id);
            if (res.data?.success) {
                toast.success('Voice note marked as read');
                await fetchVoiceNotes();
                return true;
            }
        } catch (err) {
            toast.error('Failed to mark as read');
            return false;
        }
    }, [fetchVoiceNotes]);

    const deleteVoiceNote = useCallback(async (id) => {
        try {
            const res = await siteApi.deleteVoiceNote(id);
            if (res.data?.success) {
                toast.success('Voice note deleted');
                await fetchVoiceNotes();
                return true;
            }
        } catch (err) {
            toast.error('Failed to delete voice note');
            return false;
        }
    }, [fetchVoiceNotes]);

    // ---------- Safety Checklists ----------
    const fetchSafetyChecklists = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await siteApi.getSafetyChecklists(params);
            setSafetyChecklists(res.data?.data?.records || []);
        } catch (err) {
            toast.error('Failed to load safety checklists');
        } finally {
            setLoading(false);
        }
    }, []);

    const createSafetyChecklist = useCallback(async (data) => {
        try {
            const res = await siteApi.createSafetyChecklist(data);
            if (res.data?.success) {
                toast.success('Safety checklist created');
                await fetchSafetyChecklists({ projectId: data.projectId });
                return true;
            }
        } catch (err) {
            toast.error('Failed to create safety checklist');
            return false;
        }
    }, [fetchSafetyChecklists]);

    const updateSafetyChecklist = useCallback(async (id, data) => {
        try {
            const res = await siteApi.updateSafetyChecklist(id, data);
            if (res.data?.success) {
                toast.success('Safety checklist updated');
                await fetchSafetyChecklists();
                return true;
            }
        } catch (err) {
            toast.error('Failed to update safety checklist');
            return false;
        }
    }, [fetchSafetyChecklists]);

    const approveSafetyChecklist = useCallback(async (id) => {
        try {
            const res = await siteApi.approveSafetyChecklist(id);
            if (res.data?.success) {
                toast.success('Safety checklist approved');
                await fetchSafetyChecklists();
                return true;
            }
        } catch (err) {
            toast.error('Failed to approve safety checklist');
            return false;
        }
    }, [fetchSafetyChecklists]);

    // Auto-fetch for site engineer's active check-in
    useEffect(() => {
        if (current?.role === 'site_engineer') {
            fetchActiveCheckin();
        }
    }, [fetchActiveCheckin, current]);

    return {
        loading,
        dailyReports,
        attendance,
        myAttendance,
        issues,
        activeCheckin,
        checkinHistory,
        voiceNotes,
        safetyChecklists,
        fetchDailyReports,
        createDailyReport,
        updateDailyReport,
        deleteDailyReport,
        approveDailyReport,
        fetchAttendance,
        fetchMyAttendance,
        markAttendance,
        updateAttendance,
        fetchIssues,
        createIssue,
        resolveIssue,
        fetchActiveCheckin,
        fetchCheckinHistory,
        checkIn,
        checkOut,
        fetchVoiceNotes,
        createVoiceNote,
        markVoiceNoteAsRead,
        deleteVoiceNote,
        fetchSafetyChecklists,
        createSafetyChecklist,
        updateSafetyChecklist,
        approveSafetyChecklist,
    };
};