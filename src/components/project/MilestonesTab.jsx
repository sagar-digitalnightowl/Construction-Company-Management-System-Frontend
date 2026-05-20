// src/components/project/MilestonesTab.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/helpers';
import { toast } from 'sonner';

export function MilestonesTab({ project, milestones = [], canEdit, onAddMilestone }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', dueDate: '' });
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        if (!form.name) return toast.error('Name required');
        setSaving(true);
        const success = await onAddMilestone(project._id, form);
        setSaving(false);
        if (success) setOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">{milestones.length} milestone(s)</p>
                {canEdit && <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-3 w-3 mr-1" /> Add Milestone</Button>}
            </div>
            {milestones.length === 0 ? (
                <Card><CardContent className="p-8 text-center"><p className="text-sm font-medium text-muted-foreground">No milestones yet</p></CardContent></Card>
            ) : (

                <div className="space-y-2">
                    {milestones.map(m => (
                        <Card key={m._id}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 rounded-full p-1 ${m.isCompleted ? 'bg-green-100 text-green-600' : 'bg-muted'}`}><Check className="h-3 w-3" /></div>
                                    <div className="flex-1"><p className="font-medium text-sm">{m.name}</p>{m.description && <p className="text-xs text-muted-foreground">{m.description}</p>}</div>
                                    <div className="text-xs text-muted-foreground text-right">Due: {m.dueDate ? formatDate(m.dueDate) : 'No date'}</div>
                                </div>
                                {m.tasks?.length > 0 && (
                                    <>
                                        <Separator className="my-3" />
                                        <div className="space-y-2"><p className="text-xs text-muted-foreground">{m.tasks.length} tasks</p>{m.tasks.map(task => <div key={task._id} className="border rounded px-3 py-2"><p className="text-sm font-medium">{task.title}</p><p className="text-xs text-muted-foreground">{task.status}</p></div>)}</div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent><DialogHeader><DialogTitle>Add Milestone</DialogTitle></DialogHeader><div className="space-y-3"><Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><Textarea placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={handleAdd} disabled={saving}>Add</Button></DialogFooter></DialogContent>
            </Dialog>
        </div>
    );
}