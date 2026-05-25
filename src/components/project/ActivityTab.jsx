// // src/components/project/ActivityTab.jsx
// import React, { useEffect, useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';
// import { projectApi } from '@/api/projectApi';
// import { formatDate } from '@/lib/helpers';

// export function ActivityTab({ projectId }) {
//     const [activities, setActivities] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetch = async () => {
//             try {
//                 const res = await projectApi.getActivity(projectId);
//                 setActivities(res.data?.data || []);
//             } catch (err) { } finally { setLoading(false); }
//         };
//         fetch();
//     }, [projectId]);

//     if (loading) return <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
//     if (activities.length === 0) return <Card><CardContent className="p-8 text-center">No activity yet</CardContent></Card>;
//     return (
//         <div className="relative pl-4"><div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />{activities.map(a => <div key={a._id} className="relative flex gap-3 pb-4"><div className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" /><div className="ml-3 flex-1"><p className="text-sm">{a.action}</p><p className="text-xs text-muted-foreground mt-0.5">{a.user?.name} · {formatDate(a.createdAt)}</p></div></div>)}</div>
//     );
// }



// src/components/project/ActivityTab.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { projectApi } from '@/api';
import { formatDate } from '@/lib/helpers';
import {
    Activity, Calendar, CheckCircle, Clock, FileText, Flag,
    MessageSquare, PlusCircle, RefreshCw, AlertTriangle,
    Users, Truck, HardHat, ClipboardList, Box, Edit,
    XCircle, Eye, UserPlus, UserMinus, File, DollarSign
} from 'lucide-react';

// Map action types to icons and display names
const getActionMeta = (action) => {
    const meta = {
        project_created: { icon: PlusCircle, label: 'Project Created', color: 'text-green-600' },
        project_updated: { icon: Edit, label: 'Project Updated', color: 'text-blue-600' },
        milestone_added: { icon: Flag, label: 'Milestone Added', color: 'text-purple-600' },
        team_assigned: { icon: UserPlus, label: 'Team Assigned', color: 'text-indigo-600' },
        team_role_updated: { icon: RefreshCw, label: 'Role Updated', color: 'text-orange-600' },
        team_member_removed: { icon: UserMinus, label: 'Team Member Removed', color: 'text-red-600' },
        progress_updated: { icon: Activity, label: 'Progress Updated', color: 'text-emerald-600' },
        phase_changed: { icon: RefreshCw, label: 'Phase Changed', color: 'text-cyan-600' },
        boq_item_added: { icon: DollarSign, label: 'BOQ Item Added', color: 'text-yellow-600' },
        issue_reported: { icon: AlertTriangle, label: 'Issue Reported', color: 'text-red-500' },
        issue_resolved: { icon: CheckCircle, label: 'Issue Resolved', color: 'text-green-600' },
        comment_added: { icon: MessageSquare, label: 'Comment Added', color: 'text-gray-600' },
        dpr_created: { icon: FileText, label: 'Daily Report Created', color: 'text-blue-500' },
        dpr_updated: { icon: Edit, label: 'Daily Report Updated', color: 'text-blue-500' },
        dpr_approved: { icon: CheckCircle, label: 'Daily Report Approved', color: 'text-green-600' },
        material_request_created: { icon: Box, label: 'Material Request Created', color: 'text-amber-600' },
        material_request_approved: { icon: CheckCircle, label: 'Material Request Approved', color: 'text-green-600' },
        material_request_rejected: { icon: XCircle, label: 'Material Request Rejected', color: 'text-red-600' },
        rfq_generated: { icon: FileText, label: 'RFQ Generated', color: 'text-indigo-600' },
        purchase_order_created: { icon: File, label: 'Purchase Order Created', color: 'text-purple-600' },
        purchase_order_updated: { icon: Edit, label: 'Purchase Order Updated', color: 'text-blue-600' },
        delivery_status_updated: { icon: Truck, label: 'Delivery Updated', color: 'text-teal-600' },
        safety_checklist_created: { icon: ClipboardList, label: 'Safety Checklist Created', color: 'text-lime-600' },
        visitor_added: { icon: Users, label: 'Visitor Added', color: 'text-pink-600' },
        weather_log_added: { icon: Calendar, label: 'Weather Log Added', color: 'text-sky-600' },
        note_added: { icon: ClipboardList, label: 'Note Added', color: 'text-gray-500' },
        risk_added: { icon: AlertTriangle, label: 'Risk Added', color: 'text-orange-500' },
        resource_allocated: { icon: HardHat, label: 'Resource Allocated', color: 'text-gray-700' },
    };
    return meta[action] || { icon: Activity, label: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), color: 'text-gray-600' };
};

export function ActivityTab({ projectId }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                const res = await projectApi.getActivity(projectId);
                // The API returns: { success, data: { logs: [...], pagination } }
                const logs = res.data?.data?.logs || [];
                setActivities(logs);
            } catch (err) {
                console.error('Failed to load activity logs', err);
            } finally {
                setLoading(false);
            }
        };
        if (projectId) fetchActivities();
    }, [projectId]);

    if (loading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    No activity recorded yet.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="relative pl-6 space-y-4">
            {/* Vertical timeline line */}
            <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-border" />

            {activities.map((log) => {
                const { icon: Icon, label, color } = getActionMeta(log.action);
                const performer = log.performedBy?.name || 'System';
                const description = log.description || '';

                return (
                    <div key={log._id} className="relative flex gap-4 pb-4">
                        {/* Timeline dot */}
                        <div className="absolute -left-[13px] mt-1.5 h-5 w-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                            <Icon className={`h-3 w-3 ${color}`} />
                        </div>

                        {/* Content */}
                        <div className="ml-4 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-medium">{label}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{description}</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                                by {performer}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}