// src/components/inventory/IssueStockDialog.jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function IssueStockDialog({ open, onOpenChange, stockItem, projects = [], onIssue }) {
    const [form, setForm] = useState({
        quantity: '',
        projectId: '',
        purpose: '',
        location: '',
        remarks: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    

    const handleSubmit = async () => {
        if (!form.quantity || !form.projectId) {
            toast.error('Quantity and Project are required');
            return;
        }
        setLoading(true);
        const success = await onIssue({
            materialId: stockItem.materialId?._id,
            quantity: Number(form.quantity),
            projectId: form.projectId,
            purpose: form.purpose,
            location: form.location,
            remarks: form.remarks,
        });
        setLoading(false);
        if (success) {
            onOpenChange(false);
            setForm({ quantity: '', projectId: '', purpose: '', location: '', remarks: '' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Issue Stock</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Material</Label>
                        <p className="text-sm font-medium">{stockItem?.material?.name || stockItem?.materialName}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>Quantity *</Label>
                        <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Project *</Label>
                        <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                            <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                            <SelectContent>
                                {projects.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Purpose</Label>
                        <Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Location</Label>
                        <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Remarks</Label>
                        <Textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>Issue Stock</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}