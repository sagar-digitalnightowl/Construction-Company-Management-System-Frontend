// src/pages/tasks/TaskRequests.jsx
import React, { useState, useEffect } from 'react';
import { PageHeader, EmptyState } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock } from 'lucide-react';
import { taskApi } from '@/api/taskApi';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/helpers';

export default function TaskRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await taskApi.getRequests(statusFilter);
            setRequests(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, [statusFilter]);

    const handleApprove = async (id) => {
        try {
            await taskApi.approveRequest(id);
            toast.success('Request approved');
            fetchRequests();
        } catch (err) {
            toast.error('Failed to approve');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Reason for rejection:');
        if (!reason) return;
        try {
            await taskApi.rejectRequest(id, reason);
            toast.success('Request rejected');
            fetchRequests();
        } catch (err) {
            toast.error('Failed to reject');
        }
    };

    const getRequestTypeLabel = (type) => {
        if (type.includes('due')) return 'Due Date Change';
        if (type.includes('reassign')) return 'Reassignment';
        return type;
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Administration"
                title="Task Requests"
                description="Approve or reject due date changes and reassignment requests."
            />
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
            </Tabs>
            {loading ? (
                <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
            ) : requests.length === 0 ? (
                <EmptyState title="No requests" description={`No ${statusFilter} requests found.`} />
            ) : (
                <div className="space-y-3">
                    {requests.map(req => (
                        <Card key={req._id}>
                            <CardContent className="p-4">
                                <div className="flex flex-wrap justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge>{getRequestTypeLabel(req.type)}</Badge>
                                            <Badge variant="outline">Task: {req.task?.title}</Badge>
                                        </div>
                                        <p className="text-sm mt-2"><strong>Requested by:</strong> {req.requestedBy?.name}</p>
                                        {req.newDueDate && <p className="text-sm"><strong>New Due Date:</strong> {formatDate(req.newDueDate)}</p>}
                                        {req.reassignTo && <p className="text-sm"><strong>Reassign to:</strong> {req.reassignTo?.name}</p>}
                                        <p className="text-sm"><strong>Reason:</strong> {req.reason}</p>
                                        {req.status !== 'pending' && <p className="text-sm text-muted-foreground mt-1"><strong>Response:</strong> {req.responseReason || 'No reason provided'}</p>}
                                    </div>
                                    {req.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="default" onClick={() => handleApprove(req._id)}><Check className="h-3 w-3 mr-1" /> Approve</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleReject(req._id)}><X className="h-3 w-3 mr-1" /> Reject</Button>
                                        </div>
                                    )}
                                    {req.status === 'approved' && <Badge variant="success">Approved</Badge>}
                                    {req.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}