// src/components/task/TaskStats.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, PlayCircle } from 'lucide-react';
import { taskApi } from '@/api';
import { Skeleton } from '@/components/ui/skeleton';

export function TaskStats({ projectId }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await taskApi.getProjectTaskStats(projectId);
                setStats(res.data?.data);
            } catch (err) { } finally { setLoading(false); }
        };
        fetchStats();
    }, [projectId]);

    if (loading) return <div className="grid grid-cols-2 md:grid-cols-5 gap-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>;
    if (!stats) return null;

    const total = stats.total || 1;
    const donePercent = Math.round((stats.done / total) * 100);
    const inProgressPercent = Math.round((stats.inProgress / total) * 100);
    const todoPercent = Math.round((stats.todo / total) * 100);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Card><CardContent className="p-3 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" /><p className="text-2xl font-bold">{stats.done}</p><p className="text-xs text-muted-foreground">Done</p></CardContent></Card>
                <Card><CardContent className="p-3 text-center"><PlayCircle className="h-5 w-5 text-blue-500 mx-auto mb-1" /><p className="text-2xl font-bold">{stats.inProgress}</p><p className="text-xs text-muted-foreground">In Progress</p></CardContent></Card>
                <Card><CardContent className="p-3 text-center"><Clock className="h-5 w-5 text-yellow-500 mx-auto mb-1" /><p className="text-2xl font-bold">{stats.todo}</p><p className="text-xs text-muted-foreground">To Do</p></CardContent></Card>
                <Card><CardContent className="p-3 text-center"><AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-1" /><p className="text-2xl font-bold">{stats.blocked || 0}</p><p className="text-xs text-muted-foreground">Blocked</p></CardContent></Card>
                <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{stats.completionRate || 0}%</p><p className="text-xs text-muted-foreground">Completion</p></CardContent></Card>
            </div>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Task Progress Distribution</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <div><div className="flex justify-between text-xs"><span>Done ({stats.done})</span><span>{donePercent}%</span></div><Progress value={donePercent} indicatorClassName="bg-green-500" /></div>
                    <div><div className="flex justify-between text-xs"><span>In Progress ({stats.inProgress})</span><span>{inProgressPercent}%</span></div><Progress value={inProgressPercent} indicatorClassName="bg-blue-500" /></div>
                    <div><div className="flex justify-between text-xs"><span>To Do ({stats.todo})</span><span>{todoPercent}%</span></div><Progress value={todoPercent} indicatorClassName="bg-yellow-500" /></div>
                </CardContent>
            </Card>
        </div>
    );
}