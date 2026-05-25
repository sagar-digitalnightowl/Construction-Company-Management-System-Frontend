// // src/components/task/CreateTaskDialog.jsx
// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from 'sonner';
// import { taskApi } from '@/api/taskApi';

// export function CreateTaskDialog({ open, onOpenChange, projectId, milestones = [], teamMembers = [], onTaskCreated }) {
//     const [form, setForm] = useState({
//         title: '',
//         description: '',
//         dueDate: '',
//         priority: 'medium',
//         estimatedHours: '',
//         assignedTo: '',
//         milestoneId: '',
//     });
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!open) {
//             setForm({
//                 title: '',
//                 description: '',
//                 dueDate: '',
//                 priority: 'medium',
//                 estimatedHours: '',
//                 assignedTo: '',
//                 milestoneId: '',
//             });
//         }
//     }, [open]);

//     const handleSubmit = async () => {
//         if (!form.title) {
//             toast.error('Task title is required');
//             return;
//         }
//         setLoading(true);
//         const payload = {
//             ...form,
//             estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : undefined,
//             milestoneId: form.milestoneId || undefined,
//         };
//         try {
//             const res = await taskApi.createTask(projectId, payload);
//             if (res.data?.success) {
//                 toast.success('Task created');
//                 onOpenChange(false);
//                 if (onTaskCreated) onTaskCreated();
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to create task');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-lg">
//                 <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
//                 <div className="space-y-3">
//                     <div className="space-y-1">
//                         <Label>Title *</Label>
//                         <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Pour concrete for foundation" />
//                     </div>
//                     <div className="space-y-1">
//                         <Label>Description</Label>
//                         <Textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="space-y-1">
//                             <Label>Due Date</Label>
//                             <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
//                         </div>
//                         <div className="space-y-1">
//                             <Label>Estimated Hours</Label>
//                             <Input type="number" step="0.5" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: e.target.value })} />
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="space-y-1">
//                             <Label>Priority</Label>
//                             <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
//                                 <SelectTrigger><SelectValue /></SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="low">Low</SelectItem>
//                                     <SelectItem value="medium">Medium</SelectItem>
//                                     <SelectItem value="high">High</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div className="space-y-1">
//                             <Label>Assign To</Label>
//                             <Select value={form.assignedTo} onValueChange={v => setForm({ ...form, assignedTo: v })}>
//                                 <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="">Unassigned</SelectItem>
//                                     {teamMembers.map(m => <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>)}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                     <div className="space-y-1">
//                         <Label>Milestone (Optional)</Label>
//                         <Select value={form.milestoneId} onValueChange={v => setForm({ ...form, milestoneId: v })}>
//                             <SelectTrigger><SelectValue placeholder="No milestone" />No milestone</SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="">None</SelectItem>
//                                 {milestones.map(m => <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>)}
//                             </SelectContent>
//                         </Select>
//                     </div>
//                 </div>
//                 <DialogFooter>
//                     <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
//                     <Button onClick={handleSubmit} disabled={loading}>Create Task</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }




// src/components/task/CreateTaskDialog.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { taskApi } from '@/api';

export function CreateTaskDialog({ open, onOpenChange, projectId, milestones = [], teamMembers = [], onTaskCreated }) {
    // Use sentinel values instead of empty strings
    const UNASSIGNED = 'unassigned';
    const NO_MILESTONE = 'none';

    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        estimatedHours: '',
        assignedTo: UNASSIGNED,      // sentinel
        milestoneId: NO_MILESTONE,   // sentinel
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setForm({
                title: '',
                description: '',
                dueDate: '',
                priority: 'medium',
                estimatedHours: '',
                assignedTo: UNASSIGNED,
                milestoneId: NO_MILESTONE,
            });
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!form.title) {
            toast.error('Task title is required');
            return;
        }
        setLoading(true);

        // Convert sentinel values to undefined for the API
        const payload = {
            ...form,
            estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : undefined,
            assignedTo: form.assignedTo === UNASSIGNED ? undefined : form.assignedTo,
            milestoneId: form.milestoneId === NO_MILESTONE ? undefined : form.milestoneId,
        };

        try {
            const res = await taskApi.createTask(projectId, payload);
            if (res.data?.success) {
                toast.success('Task created');
                onOpenChange(false);
                if (onTaskCreated) onTaskCreated();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-lg"
                aria-describedby="create-task-description"   // Fix a11y warning
            >
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div id="create-task-description" className="sr-only">
                    Fill in the details to create a new task in the project.
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Title *</Label>
                        <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Pour concrete for foundation" />
                    </div>
                    <div className="space-y-1">
                        <Label>Description</Label>
                        <Textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label>Due Date</Label>
                            <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <Label>Estimated Hours</Label>
                            <Input type="number" step="0.5" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label>Priority</Label>
                            <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Assign To</Label>
                            <Select value={form.assignedTo} onValueChange={v => setForm({ ...form, assignedTo: v })}>
                                <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                                    {teamMembers.map(m => <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Milestone (Optional)</Label>
                        <Select value={form.milestoneId} onValueChange={v => setForm({ ...form, milestoneId: v })}>
                            <SelectTrigger><SelectValue placeholder="No milestone" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NO_MILESTONE}>None</SelectItem>
                                {milestones.map(m => <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>Create Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}