// // src/components/task/TaskDetailDialog.jsx
// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Separator } from '@/components/ui/separator';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import {
//     CheckSquare, MessageSquare, Clock, Users, Play, StopCircle,
//     Calendar, AlertCircle, Bell, UserPlus, Paperclip, Download, Send,
//     Check, X, Plus, Trash2, Edit2
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { taskApi } from '@/api/taskApi';
// import { formatDate, formatDuration } from '@/lib/helpers';
// import { useAuthStore } from '@/store/authStore';
// import { canMutate } from '@/data/permissions';

// export function TaskDetailDialog({ open, onOpenChange, taskId, onUpdate }) {
//     const { current } = useAuthStore();
//     const canEdit = canMutate(current?.role, 'tasks');
//     const [task, setTask] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('details');
//     const [newComment, setNewComment] = useState('');
//     const [newChecklist, setNewChecklist] = useState('');
//     const [newSubtask, setNewSubtask] = useState('');
//     const [trackingActive, setTrackingActive] = useState(false);
//     const [updating, setUpdating] = useState(false);

//     useEffect(() => {
//         if (open && taskId) fetchTask();
//     }, [open, taskId]);

//     const fetchTask = async () => {
//         setLoading(true);
//         try {
//             const res = await taskApi.getTaskById(taskId);
//             setTask(res.data?.data?.task);
//             setTrackingActive(res.data?.data?.timeTracking?.active || false);
//         } catch (err) {
//             toast.error('Failed to load task');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateTaskField = async (field, value) => {
//         setUpdating(true);
//         try {
//             await taskApi.updateTask(taskId, { [field]: value });
//             toast.success(`${field} updated`);
//             fetchTask();
//             if (onUpdate) onUpdate();
//         } catch (err) {
//             toast.error(`Failed to update ${field}`);
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const updateStatus = async (status) => {
//         await updateTaskField('status', status);
//     };

//     // Comments
//     const addComment = async () => {
//         if (!newComment.trim()) return;
//         setUpdating(true);
//         try {
//             await taskApi.addComment(taskId, newComment);
//             setNewComment('');
//             fetchTask();
//             toast.success('Comment added');
//         } catch (err) {
//             toast.error('Failed to add comment');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // Checklist
//     const addChecklistItem = async () => {
//         if (!newChecklist.trim()) return;
//         setUpdating(true);
//         try {
//             await taskApi.addChecklistItem(taskId, newChecklist);
//             setNewChecklist('');
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to add checklist item');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const toggleChecklist = async (index, currentStatus) => {
//         setUpdating(true);
//         try {
//             await taskApi.updateChecklistItem(taskId, index, { isCompleted: !currentStatus });
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to update checklist');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const deleteChecklistItem = async (index) => {
//         setUpdating(true);
//         try {
//             // API may not support delete; we'll update with filtered list
//             const newChecklist = task.checklist.filter((_, i) => i !== index);
//             await taskApi.updateTask(taskId, { checklist: newChecklist });
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to delete item');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // Subtasks
//     const addSubtask = async () => {
//         if (!newSubtask.trim()) return;
//         setUpdating(true);
//         try {
//             const newSubtasks = [...(task.subtasks || []), { title: newSubtask, isCompleted: false }];
//             await taskApi.updateTask(taskId, { subtasks: newSubtasks });
//             setNewSubtask('');
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to add subtask');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const toggleSubtask = async (index, currentStatus) => {
//         setUpdating(true);
//         try {
//             await taskApi.updateSubtaskStatus(taskId, index, !currentStatus);
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to update subtask');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // Time tracking
//     const startTracking = async () => {
//         setUpdating(true);
//         try {
//             await taskApi.startTimeTrack(taskId, 'Started work');
//             setTrackingActive(true);
//             toast.success('Time tracking started');
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to start tracking');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const stopTracking = async () => {
//         setUpdating(true);
//         try {
//             await taskApi.stopTimeTrack(taskId, 'Stopped work');
//             setTrackingActive(false);
//             toast.success('Time tracking stopped');
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to stop tracking');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // Reminders
//     const addReminder = async () => {
//         const days = prompt('Reminder days before due date (1, 2, 3, 7):');
//         if (!days) return;
//         setUpdating(true);
//         try {
//             await taskApi.addReminder(taskId, { type: 'due_date', remindAt: `${days}d` });
//             toast.success('Reminder set');
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to set reminder');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // Watchers
//     const addWatcher = async () => {
//         const userId = prompt('Enter user ID to add as watcher:');
//         if (!userId) return;
//         setUpdating(true);
//         try {
//             await taskApi.addWatcher(taskId, userId);
//             toast.success('Watcher added');
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to add watcher');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     const removeWatcher = async (userId) => {
//         setUpdating(true);
//         try {
//             await taskApi.removeWatcher(taskId, userId);
//             toast.success('Watcher removed');
//             fetchTask();
//         } catch (err) {
//             toast.error('Failed to remove watcher');
//         } finally {
//             setUpdating(false);
//         }
//     };

//     // Attachments
//     const uploadAttachment = async () => {
//         const fileInput = document.createElement('input');
//         fileInput.type = 'file';
//         fileInput.onchange = async (e) => {
//             const file = e.target.files[0];
//             if (!file) return;
//             setUpdating(true);
//             try {
//                 const presigned = await taskApi.getPresignedUrl(taskId, file.name, file.type, file.type);
//                 const uploadUrl = presigned.data?.data?.uploadUrl;
//                 if (uploadUrl) {
//                     await fetch(uploadUrl, { method: 'PUT', body: file });
//                     await taskApi.confirmAttachment(taskId, presigned.data.data.fileKey);
//                     toast.success('File uploaded');
//                     fetchTask();
//                 }
//             } catch (err) {
//                 toast.error('Upload failed');
//             } finally {
//                 setUpdating(false);
//             }
//         };
//         fileInput.click();
//     };

//     if (loading || !task) {
//         return (
//             <Dialog open={open} onOpenChange={onOpenChange}>
//                 <DialogContent className="sm:max-w-3xl">
//                     <div className="flex justify-center py-12">Loading task details...</div>
//                 </DialogContent>
//             </Dialog>
//         );
//     }

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                     <div className="flex justify-between items-start flex-wrap gap-2">
//                         <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
//                         <div className="flex gap-2">
//                             <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'warning' : 'secondary'}>
//                                 {task.priority}
//                             </Badge>
//                             <Badge>{task.status.replace('_', ' ')}</Badge>
//                         </div>
//                     </div>
//                     {task.milestone && <p className="text-sm text-muted-foreground mt-1">Milestone: {task.milestone.name}</p>}
//                 </DialogHeader>

//                 {/* Quick Action Buttons */}
//                 <div className="flex flex-wrap gap-2 py-3 border-b">
//                     <Button size="sm" variant="outline" onClick={() => updateStatus('in_progress')} disabled={updating}>
//                         <Play className="h-3 w-3 mr-1" /> Start
//                     </Button>
//                     <Button size="sm" variant="outline" onClick={() => updateStatus('done')} disabled={updating}>
//                         <Check className="h-3 w-3 mr-1" /> Complete
//                     </Button>
//                     <Button size="sm" variant="outline" onClick={() => updateStatus('blocked')} disabled={updating}>
//                         <AlertCircle className="h-3 w-3 mr-1" /> Block
//                     </Button>
//                     {trackingActive ? (
//                         <Button size="sm" variant="destructive" onClick={stopTracking} disabled={updating}>
//                             <StopCircle className="h-3 w-3 mr-1" /> Stop Timer
//                         </Button>
//                     ) : (
//                         <Button size="sm" variant="outline" onClick={startTracking} disabled={updating}>
//                             <Clock className="h-3 w-3 mr-1" /> Track Time
//                         </Button>
//                     )}
//                     <Button size="sm" variant="outline" onClick={addReminder} disabled={updating}>
//                         <Bell className="h-3 w-3 mr-1" /> Remind
//                     </Button>
//                     <Button size="sm" variant="outline" onClick={addWatcher} disabled={updating}>
//                         <UserPlus className="h-3 w-3 mr-1" /> Watch
//                     </Button>
//                     <Button size="sm" variant="outline" onClick={uploadAttachment} disabled={updating}>
//                         <Paperclip className="h-3 w-3 mr-1" /> Attach
//                     </Button>
//                 </div>

//                 {/* Basic Info Grid */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm py-3">
//                     <div>
//                         <p className="text-muted-foreground text-xs">Due Date</p>
//                         <p className="font-medium">{task.dueDate ? formatDate(task.dueDate) : 'Not set'}</p>
//                     </div>
//                     <div>
//                         <p className="text-muted-foreground text-xs">Assigned To</p>
//                         <p className="font-medium">{task.assignedTo?.name || 'Unassigned'}</p>
//                     </div>
//                     <div>
//                         <p className="text-muted-foreground text-xs">Estimated Hours</p>
//                         <p className="font-medium">{task.estimatedHours || '—'}</p>
//                     </div>
//                     <div>
//                         <p className="text-muted-foreground text-xs">Time Spent</p>
//                         <p className="font-medium">{formatDuration(task.timeSpent || 0)}</p>
//                     </div>
//                 </div>

//                 {/* Tabs */}
//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                     <TabsList className="grid grid-cols-6 mb-4">
//                         <TabsTrigger value="details">Details</TabsTrigger>
//                         <TabsTrigger value="checklist">Checklist</TabsTrigger>
//                         <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
//                         <TabsTrigger value="comments">Comments</TabsTrigger>
//                         <TabsTrigger value="time">Time Logs</TabsTrigger>
//                         <TabsTrigger value="activity">Activity</TabsTrigger>
//                     </TabsList>

//                     {/* Details Tab */}
//                     <TabsContent value="details" className="space-y-4">
//                         <div>
//                             <Label>Description</Label>
//                             <p className="text-sm mt-1 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
//                         </div>
//                         <Separator />
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <Label>Priority</Label>
//                                 <Select value={task.priority} onValueChange={(v) => updateTaskField('priority', v)} disabled={!canEdit}>
//                                     <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="low">Low</SelectItem>
//                                         <SelectItem value="medium">Medium</SelectItem>
//                                         <SelectItem value="high">High</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div>
//                                 <Label>Due Date</Label>
//                                 <Input type="date" value={task.dueDate?.split('T')[0] || ''} onChange={(e) => updateTaskField('dueDate', e.target.value)} disabled={!canEdit} />
//                             </div>
//                             <div>
//                                 <Label>Estimated Hours</Label>
//                                 <Input type="number" step="0.5" value={task.estimatedHours || ''} onChange={(e) => updateTaskField('estimatedHours', e.target.value)} disabled={!canEdit} />
//                             </div>
//                             <div>
//                                 <Label>Assigned To</Label>
//                                 <Select value={task.assignedTo?._id || ''} onValueChange={(v) => updateTaskField('assignedTo', v)} disabled={!canEdit}>
//                                     <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
//                                     <SelectContent>{/* Options populated from parent */}</SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                     </TabsContent>

//                     {/* Checklist Tab */}
//                     <TabsContent value="checklist" className="space-y-3">
//                         <div className="flex gap-2">
//                             <Input placeholder="New checklist item" value={newChecklist} onChange={(e) => setNewChecklist(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()} />
//                             <Button size="sm" onClick={addChecklistItem} disabled={updating || !newChecklist.trim()}>Add</Button>
//                         </div>
//                         <ScrollArea className="h-64">
//                             <div className="space-y-2">
//                                 {task.checklist?.map((item, idx) => (
//                                     <div key={idx} className="flex items-center justify-between border rounded-md p-2">
//                                         <div className="flex items-center gap-2">
//                                             <input type="checkbox" checked={item.isCompleted} onChange={() => toggleChecklist(idx, item.isCompleted)} className="h-4 w-4" />
//                                             <span className={item.isCompleted ? 'line-through text-muted-foreground' : ''}>{item.title}</span>
//                                         </div>
//                                         <Button variant="ghost" size="icon" onClick={() => deleteChecklistItem(idx)} disabled={updating}>
//                                             <Trash2 className="h-3 w-3" />
//                                         </Button>
//                                     </div>
//                                 ))}
//                                 {(!task.checklist || task.checklist.length === 0) && <p className="text-center text-muted-foreground py-4">No checklist items</p>}
//                             </div>
//                         </ScrollArea>
//                     </TabsContent>

//                     {/* Subtasks Tab */}
//                     <TabsContent value="subtasks" className="space-y-3">
//                         <div className="flex gap-2">
//                             <Input placeholder="New subtask" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSubtask()} />
//                             <Button size="sm" onClick={addSubtask} disabled={updating || !newSubtask.trim()}>Add</Button>
//                         </div>
//                         <ScrollArea className="h-64">
//                             <div className="space-y-2">
//                                 {task.subtasks?.map((sub, idx) => (
//                                     <div key={idx} className="flex items-center gap-2 border rounded-md p-2">
//                                         <input type="checkbox" checked={sub.isCompleted} onChange={() => toggleSubtask(idx, sub.isCompleted)} className="h-4 w-4" />
//                                         <span className={sub.isCompleted ? 'line-through text-muted-foreground' : ''}>{sub.title}</span>
//                                     </div>
//                                 ))}
//                                 {(!task.subtasks || task.subtasks.length === 0) && <p className="text-center text-muted-foreground py-4">No subtasks</p>}
//                             </div>
//                         </ScrollArea>
//                     </TabsContent>

//                     {/* Comments Tab */}
//                     <TabsContent value="comments" className="space-y-3">
//                         <div className="flex gap-2">
//                             <Input placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addComment()} />
//                             <Button size="sm" onClick={addComment} disabled={updating || !newComment.trim()}><Send className="h-3 w-3 mr-1" /> Post</Button>
//                         </div>
//                         <ScrollArea className="h-80">
//                             <div className="space-y-3">
//                                 {task.comments?.map((c, idx) => (
//                                     <div key={idx} className="border rounded-md p-3">
//                                         <div className="flex justify-between items-start">
//                                             <div className="flex items-center gap-2">
//                                                 <Avatar className="h-6 w-6"><AvatarFallback>{c.user?.name?.charAt(0) || 'U'}</AvatarFallback></Avatar>
//                                                 <span className="font-medium text-sm">{c.user?.name}</span>
//                                             </div>
//                                             <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
//                                         </div>
//                                         <p className="text-sm mt-1">{c.text}</p>
//                                     </div>
//                                 ))}
//                                 {(!task.comments || task.comments.length === 0) && <p className="text-center text-muted-foreground py-4">No comments yet</p>}
//                             </div>
//                         </ScrollArea>
//                     </TabsContent>

//                     {/* Time Logs Tab */}
//                     <TabsContent value="time" className="space-y-3">
//                         <ScrollArea className="h-80">
//                             <div className="space-y-2">
//                                 {task.timeTracking?.logs?.map((log, idx) => (
//                                     <div key={idx} className="border rounded-md p-3 text-sm">
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Session {idx + 1}</span>
//                                             <span className="text-muted-foreground">{formatDuration(log.duration)}</span>
//                                         </div>
//                                         <div className="text-xs text-muted-foreground mt-1">
//                                             Started: {formatDate(log.startTime)}<br />
//                                             Stopped: {log.endTime ? formatDate(log.endTime) : 'In progress'}
//                                         </div>
//                                         {log.notes && <p className="text-xs mt-1 italic">{log.notes}</p>}
//                                     </div>
//                                 ))}
//                                 {(!task.timeTracking?.logs || task.timeTracking.logs.length === 0) && <p className="text-center text-muted-foreground py-4">No time logs</p>}
//                             </div>
//                         </ScrollArea>
//                     </TabsContent>

//                     {/* Activity Tab */}
//                     <TabsContent value="activity" className="space-y-3">
//                         <ScrollArea className="h-80">
//                             <div className="relative pl-4">
//                                 <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
//                                 {task.history?.map((h, idx) => (
//                                     <div key={idx} className="relative flex gap-3 pb-4">
//                                         <div className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
//                                         <div className="ml-3 flex-1">
//                                             <p className="text-sm">{h.action}</p>
//                                             <p className="text-xs text-muted-foreground">{formatDate(h.createdAt)}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 {(!task.history || task.history.length === 0) && <p className="text-center text-muted-foreground py-4">No activity recorded</p>}
//                             </div>
//                         </ScrollArea>
//                     </TabsContent>
//                 </Tabs>

//                 <DialogFooter>
//                     <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }











// src/components/task/TaskDetailDialog.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import {
    Check, Play, AlertCircle, Send, Trash2, Plus, Clock, StopCircle,
    Bell, UserPlus, UserMinus, Paperclip, Download, Upload, Calendar as CalendarIcon,
    TrendingUp, Link as LinkIcon, Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { taskApi } from '@/api/taskApi';
import { formatDate, formatDuration } from '@/lib/helpers';
import { useAuthStore } from '@/store/authStore';

// Helper to determine if user can perform web-only actions
const canPerformWebOnly = (role) => ['admin', 'director', 'project_manager'].includes(role);

export function TaskDetailDialog({ open, onOpenChange, taskId, onUpdate }) {
    const { current } = useAuthStore();
    const userRole = current?.role;
    const isWebOnlyUser = canPerformWebOnly(userRole);
    const isSiteEngineer = userRole === 'site_engineer';

    // State for task data (split as per API response)
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [history, setHistory] = useState([]);
    const [watchers, setWatchers] = useState([]);
    const [timeLogs, setTimeLogs] = useState([]);
    const [activeTimer, setActiveTimer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    // Form states
    const [newComment, setNewComment] = useState('');
    const [newChecklist, setNewChecklist] = useState('');
    const [newSubtask, setNewSubtask] = useState('');
    const [progress, setProgress] = useState(0);
    const [reminderMessage, setReminderMessage] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [newWatcherId, setNewWatcherId] = useState('');
    const [dueDateRequest, setDueDateRequest] = useState({ newDueDate: '', reason: '' });
    const [reassignRequest, setReassignRequest] = useState({ reassignTo: '', reason: '' });

    // Fetch all task data
    const fetchTask = async () => {
        setLoading(true);
        try {
            const res = await taskApi.getTaskById(taskId);
            const data = res.data?.data || {};
            setTask(data.task);
            setComments(data.comments || []);
            setHistory(data.history || []);
            setWatchers(data.watchers || []);
            setProgress(data.task?.progress || 0);
            // Fetch time tracking separately if needed
            const timeRes = await taskApi.getTimeTracking(taskId);
            setTimeLogs(timeRes.data?.data?.tracks || []);
            setActiveTimer(timeRes.data?.data?.active || false);
        } catch (err) {
            toast.error('Failed to load task');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && taskId) fetchTask();
    }, [open, taskId]);

    // ----- Status update -----
    const updateStatus = async (status) => {
        setUpdating(true);
        try {
            await taskApi.updateTaskStatus(taskId, status);
            toast.success('Status updated');
            await fetchTask();
            if (onUpdate) onUpdate();
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Comments -----
    const addComment = async () => {
        if (!newComment.trim()) return;
        setUpdating(true);
        try {
            await taskApi.addComment(taskId, newComment);
            setNewComment('');
            await fetchTask();
            toast.success('Comment added');
        } catch (err) {
            toast.error('Failed to add comment');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Checklist -----
    const addChecklistItem = async () => {
        if (!newChecklist.trim()) return;
        setUpdating(true);
        try {
            await taskApi.addChecklistItem(taskId, newChecklist);
            setNewChecklist('');
            await fetchTask();
        } catch (err) {
            toast.error('Failed to add checklist item');
        } finally {
            setUpdating(false);
        }
    };

    const updateChecklist = async (index, data) => {
        setUpdating(true);
        try {
            await taskApi.updateChecklistItem(taskId, index, data);
            await fetchTask();
        } catch (err) {
            toast.error('Failed to update checklist');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Subtasks (toggle only; add is web-only) -----
    const addSubtask = async () => {
        if (!newSubtask.trim()) return;
        if (!isWebOnlyUser) {
            toast.error('Only Admin, Director or PM can add subtasks');
            return;
        }
        setUpdating(true);
        try {
            await taskApi.addSubtask(taskId, { title: newSubtask });
            setNewSubtask('');
            await fetchTask();
        } catch (err) {
            toast.error('Failed to add subtask');
        } finally {
            setUpdating(false);
        }
    };

    const toggleSubtask = async (index, currentStatus) => {
        setUpdating(true);
        try {
            await taskApi.updateSubtaskStatus(taskId, index, !currentStatus);
            await fetchTask();
        } catch (err) {
            toast.error('Failed to update subtask');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Time tracking -----
    const startTracking = async () => {
        setUpdating(true);
        try {
            await taskApi.startTimeTrack(taskId, 'Started work');
            toast.success('Time tracking started');
            await fetchTask();
        } catch (err) {
            toast.error('Failed to start tracking');
        } finally {
            setUpdating(false);
        }
    };

    const stopTracking = async () => {
        setUpdating(true);
        try {
            await taskApi.stopTimeTrack(taskId, 'Stopped work');
            toast.success('Time tracking stopped');
            await fetchTask();
        } catch (err) {
            toast.error('Failed to stop tracking');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Progress -----
    const updateProgress = async (value) => {
        setUpdating(true);
        try {
            await taskApi.updateTaskProgress(taskId, value);
            toast.success('Progress updated');
            setProgress(value);
            await fetchTask();
            if (onUpdate) onUpdate();
        } catch (err) {
            toast.error('Failed to update progress');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Reminders -----
    const addReminder = async () => {
        if (!reminderMessage || !reminderDate) {
            toast.error('Message and date required');
            return;
        }
        setUpdating(true);
        try {
            await taskApi.addReminder(taskId, {
                message: reminderMessage,
                remindAt: reminderDate,
                type: 'custom',
            });
            toast.success('Reminder set');
            setReminderMessage('');
            setReminderDate('');
            await fetchTask();
        } catch (err) {
            toast.error('Failed to set reminder');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Watchers -----
    const addWatcher = async () => {
        if (!newWatcherId) {
            toast.error('User ID required');
            return;
        }
        setUpdating(true);
        try {
            await taskApi.addWatcher(taskId, newWatcherId);
            toast.success('Watcher added');
            setNewWatcherId('');
            await fetchTask();
        } catch (err) {
            toast.error('Failed to add watcher');
        } finally {
            setUpdating(false);
        }
    };

    const removeWatcher = async (userId) => {
        setUpdating(true);
        try {
            await taskApi.removeWatcher(taskId, userId);
            toast.success('Watcher removed');
            await fetchTask();
        } catch (err) {
            toast.error('Failed to remove watcher');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Due date change request (Site Engineer only) -----
    const requestDueDateChange = async () => {
        if (!dueDateRequest.newDueDate || !dueDateRequest.reason) {
            toast.error('New due date and reason required');
            return;
        }
        setUpdating(true);
        try {
            await taskApi.requestDueDateChange(taskId, dueDateRequest.newDueDate, dueDateRequest.reason);
            toast.success('Request sent to PM');
            setDueDateRequest({ newDueDate: '', reason: '' });
        } catch (err) {
            toast.error('Failed to send request');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Reassignment request (Site Engineer only) -----
    const requestReassignment = async () => {
        if (!reassignRequest.reassignTo || !reassignRequest.reason) {
            toast.error('User ID and reason required');
            return;
        }
        setUpdating(true);
        try {
            await taskApi.requestReassignment(taskId, reassignRequest.reassignTo, reassignRequest.reason);
            toast.success('Reassignment request sent');
            setReassignRequest({ reassignTo: '', reason: '' });
        } catch (err) {
            toast.error('Failed to send request');
        } finally {
            setUpdating(false);
        }
    };

    // ----- Attachments (presigned URL upload) -----
    const uploadAttachment = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            setUpdating(true);
            try {
                const presigned = await taskApi.getPresignedUrl(taskId, file.name, 'document', file.type);
                const { uploadUrl, fileKey } = presigned.data?.data || {};
                if (uploadUrl) {
                    await fetch(uploadUrl, { method: 'PUT', body: file });
                    await taskApi.confirmAttachment(taskId, fileKey, file.name);
                    toast.success('File uploaded');
                    await fetchTask();
                }
            } catch (err) {
                toast.error('Upload failed');
            } finally {
                setUpdating(false);
            }
        };
        fileInput.click();
    };

    const deleteAttachment = async (index) => {
        if (!isWebOnlyUser) {
            toast.error('Only Admin, Director or PM can delete attachments');
            return;
        }
        setUpdating(true);
        try {
            await taskApi.removeAttachment(taskId, index);
            toast.success('Attachment deleted');
            await fetchTask();
        } catch (err) {
            toast.error('Failed to delete');
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !task) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-3xl">
                    <div className="flex justify-center py-12">Loading task details...</div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                        <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
                        <div className="flex gap-2 mr-5">
                            <Badge variant={task.priority === 'high' ? 'destructive' : 'warning'}>
                                {task.priority}
                            </Badge>
                            <Badge>{task.status?.replace('_', ' ')}</Badge>
                        </div>
                    </div>
                    {task.milestoneId && (
                        <p className="text-sm text-muted-foreground mt-1">Milestone: {task.milestoneId.name}</p>
                    )}
                </DialogHeader>

                {/* Quick action buttons */}
                <div className="flex flex-wrap gap-2 py-3 border-b">
                    <Button size="sm" variant="outline" onClick={() => updateStatus('in_progress')} disabled={updating}>
                        <Play className="h-3 w-3 mr-1" /> Start
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus('done')} disabled={updating}>
                        <Check className="h-3 w-3 mr-1" /> Complete
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus('blocked')} disabled={updating}>
                        <AlertCircle className="h-3 w-3 mr-1" /> Block
                    </Button>
                    {activeTimer ? (
                        <Button size="sm" variant="destructive" onClick={stopTracking} disabled={updating}>
                            <StopCircle className="h-3 w-3 mr-1" /> Stop Timer
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" onClick={startTracking} disabled={updating}>
                            <Clock className="h-3 w-3 mr-1" /> Track Time
                        </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={uploadAttachment} disabled={updating}>
                        <Paperclip className="h-3 w-3 mr-1" /> Attach
                    </Button>
                </div>

                {/* Basic info grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm py-3">
                    <div><p className="text-muted-foreground text-xs">Due Date</p><p className="font-medium">{formatDate(task.dueDate)}</p></div>
                    <div><p className="text-muted-foreground text-xs">Assigned To</p><p className="font-medium">{task.assignedTo?.name || 'Unassigned'}</p></div>
                    <div><p className="text-muted-foreground text-xs">Estimated Hours</p><p className="font-medium">{task.estimatedHours || '—'}</p></div>
                    <div><p className="text-muted-foreground text-xs">Time Spent</p><p className="font-medium">{formatDuration(task.actualHours || 0)}</p></div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-6 mb-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="checklist">Checklist</TabsTrigger>
                        <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                        <TabsTrigger value="time">Time Logs</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>

                    {/* Details Tab */}
                    <TabsContent value="details" className="space-y-4">
                        <div><Label>Description</Label><p className="text-sm mt-1">{task.description || 'No description'}</p></div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Priority</Label><p className="text-sm capitalize">{task.priority}</p></div>
                            <div><Label>Due Date</Label><p className="text-sm">{formatDate(task.dueDate)}</p></div>
                            <div><Label>Estimated Hours</Label><p className="text-sm">{task.estimatedHours || '—'}</p></div>
                            <div><Label>Assigned To</Label><p className="text-sm">{task.assignedTo?.name || 'Unassigned'}</p></div>
                        </div>
                        <div><Label>Progress ({progress}%)</Label>
                            <Slider value={[progress]} onValueChange={([val]) => setProgress(val)} onValueCommit={([val]) => updateProgress(val)} disabled={updating} />
                        </div>
                        {/* Only Site Engineer can request due date change / reassign */}
                        {isSiteEngineer && (
                            <div className="border rounded-md p-3 space-y-3">
                                <h4 className="font-medium">Request Changes</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><Input placeholder="New Due Date (YYYY-MM-DD)" value={dueDateRequest.newDueDate} onChange={(e) => setDueDateRequest({ ...dueDateRequest, newDueDate: e.target.value })} /></div>
                                    <div><Input placeholder="Reason" value={dueDateRequest.reason} onChange={(e) => setDueDateRequest({ ...dueDateRequest, reason: e.target.value })} /></div>
                                </div>
                                <Button size="sm" onClick={requestDueDateChange} disabled={updating}>Request Due Date Change</Button>
                                <Separator />
                                <div className="grid grid-cols-2 gap-3">
                                    <div><Input placeholder="Reassign To User ID" value={reassignRequest.reassignTo} onChange={(e) => setReassignRequest({ ...reassignRequest, reassignTo: e.target.value })} /></div>
                                    <div><Input placeholder="Reason" value={reassignRequest.reason} onChange={(e) => setReassignRequest({ ...reassignRequest, reason: e.target.value })} /></div>
                                </div>
                                <Button size="sm" onClick={requestReassignment} disabled={updating}>Request Reassignment</Button>
                            </div>
                        )}
                        {/* Reminders section */}
                        <div className="border rounded-md p-3 space-y-3">
                            <h4 className="font-medium">Set Reminder</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <Input placeholder="Message" value={reminderMessage} onChange={(e) => setReminderMessage(e.target.value)} />
                                <Input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />
                            </div>
                            <Button size="sm" onClick={addReminder} disabled={updating}><Bell className="h-3 w-3 mr-1" /> Set Reminder</Button>
                        </div>
                        {/* Watchers section */}
                        <div className="border rounded-md p-3 space-y-3">
                            <h4 className="font-medium">Watchers</h4>
                            <div className="flex gap-2">
                                <Input placeholder="User ID to watch" value={newWatcherId} onChange={(e) => setNewWatcherId(e.target.value)} />
                                <Button size="sm" onClick={addWatcher} disabled={updating}><UserPlus className="h-3 w-3" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {watchers.map((w) => (
                                    <div key={w._id} className="flex items-center gap-1 bg-secondary rounded-full px-2 py-1 text-sm">
                                        <span>{w.name || w._id}</span>
                                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeWatcher(w._id)} disabled={updating}>
                                            <UserMinus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Attachments list */}
                        <div className="border rounded-md p-3 space-y-3">
                            <h4 className="font-medium">Attachments</h4>
                            <div className="space-y-2">
                                {task.attachments?.map((att, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">{att.name}</a>
                                        {isWebOnlyUser && (
                                            <Button variant="ghost" size="icon" onClick={() => deleteAttachment(idx)} disabled={updating}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {(!task.attachments || task.attachments.length === 0) && <p className="text-muted-foreground text-sm">No attachments</p>}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Checklist Tab */}
                    <TabsContent value="checklist" className="space-y-3">
                        <div className="flex gap-2">
                            <Input placeholder="New checklist item" value={newChecklist} onChange={(e) => setNewChecklist(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()} />
                            <Button size="sm" onClick={addChecklistItem} disabled={updating || !newChecklist.trim()}>Add</Button>
                        </div>
                        <ScrollArea className="h-64">
                            {task.checklist?.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border rounded-md p-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={item.isCompleted} onChange={() => updateChecklist(idx, { isCompleted: !item.isCompleted })} />
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => updateChecklist(idx, { title: e.target.value })}
                                            className="border-none bg-transparent focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </TabsContent>

                    {/* Subtasks Tab */}
                    <TabsContent value="subtasks" className="space-y-3">
                        <div className="flex gap-2">
                            <Input placeholder="New subtask" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSubtask()} />
                            <Button size="sm" onClick={addSubtask} disabled={updating || !newSubtask.trim() || !isWebOnlyUser}>Add</Button>
                        </div>
                        <ScrollArea className="h-64">
                            {task.subtasks?.map((sub, idx) => (
                                <div key={idx} className="flex items-center gap-2 border rounded-md p-2 mb-2">
                                    <input type="checkbox" checked={sub.isCompleted} onChange={() => toggleSubtask(idx, sub.isCompleted)} />
                                    <span className={sub.isCompleted ? 'line-through' : ''}>{sub.title}</span>
                                </div>
                            ))}
                        </ScrollArea>
                    </TabsContent>

                    {/* Comments Tab */}
                    <TabsContent value="comments" className="space-y-3">
                        <div className="flex gap-2">
                            <Input placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addComment()} />
                            <Button size="sm" onClick={addComment} disabled={updating || !newComment.trim()}><Send className="h-3 w-3 mr-1" /> Post</Button>
                        </div>
                        <ScrollArea className="h-80">
                            {comments.map((c) => (
                                <div key={c._id} className="border rounded-md p-3 mb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6"><AvatarFallback>{c.userId?.name?.charAt(0) || 'U'}</AvatarFallback></Avatar>
                                            <span className="font-medium text-sm">{c.userId?.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                                    </div>
                                    <p className="text-sm mt-1">{c.text}</p>
                                </div>
                            ))}
                        </ScrollArea>
                    </TabsContent>

                    {/* Time Logs Tab */}
                    <TabsContent value="time" className="space-y-3">
                        <ScrollArea className="h-80">
                            {timeLogs.map((log, idx) => (
                                <div key={idx} className="border rounded-md p-3 mb-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Session {idx + 1}</span>
                                        <span>{formatDuration(log.duration)}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Started: {formatDate(log.startTime)}<br />
                                        Stopped: {log.endTime ? formatDate(log.endTime) : 'In progress'}
                                    </div>
                                    {log.notes && <p className="text-xs mt-1 italic">{log.notes}</p>}
                                </div>
                            ))}
                        </ScrollArea>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-3">
                        <ScrollArea className="h-80">
                            <div className="relative pl-4">
                                <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
                                {history.map((h) => (
                                    <div key={h._id} className="relative flex gap-3 pb-4">
                                        <div className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm capitalize">
                                                {h.action === 'status_changed'
                                                    ? `Status changed from ${h.oldValue} to ${h.newValue}`
                                                    : h.action === 'commented'
                                                        ? 'Added a comment'
                                                        : h.action}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{formatDate(h.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}