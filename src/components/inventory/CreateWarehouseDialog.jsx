// src/components/inventory/CreateWarehouseDialog.jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function CreateWarehouseDialog({ open, onOpenChange, onSave }) {
    const [form, setForm] = useState({
        name: '',
        code: '',
        location: '',
        capacity: '',
        manager: '',
        contactNumber: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.name || !form.code) {
            toast.error('Name and Code are required');
            return;
        }
        setLoading(true);
        const success = await onSave({
            ...form,
            capacity: form.capacity ? Number(form.capacity) : undefined,
        });
        setLoading(false);
        if (success) {
            onOpenChange(false);
            setForm({ name: '', code: '', location: '', capacity: '', manager: '', contactNumber: '' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Warehouse</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Name *</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Code *</Label>
                        <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Location</Label>
                        <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Capacity (units)</Label>
                        <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Manager Name</Label>
                        <Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Contact Number</Label>
                        <Input value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>Create Warehouse</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}