// src/components/task/TaskKanban.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskCard } from './TaskCard';
import { taskApi } from '@/api/taskApi';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'review', title: 'Review', color: 'bg-yellow-50' },
    { id: 'done', title: 'Done', color: 'bg-green-50' },
    { id: 'blocked', title: 'Blocked', color: 'bg-red-50' },
];

export function TaskKanban({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await taskApi.getProjectTasks(projectId);
                setTasks(res.data?.data || []);
            } catch (err) {
                toast.error('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [projectId]);

    const handleStatusChange = async (taskId, status) => {
        try {
            await taskApi.updateTaskStatus(taskId, status);
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
            toast.success('Status updated');
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="grid grid-cols-5 gap-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-96" />)}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
            {columns.map(col => (
                <Card key={col.id} className={col.color}>
                    <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium">{col.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                        <ScrollArea className="h-[calc(100vh-250px)]">
                            <div className="space-y-2">
                                {tasks.filter(t => t.status === col.id).map(task => (
                                    <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onClick={() => { }} />
                                ))}
                                {tasks.filter(t => t.status === col.id).length === 0 && (
                                    <p className="text-center text-xs text-muted-foreground py-4">No tasks</p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}