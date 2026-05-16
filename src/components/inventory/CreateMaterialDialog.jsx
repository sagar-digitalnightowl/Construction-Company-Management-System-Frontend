// src/components/inventory/CreateMaterialDialog.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CreateMaterialDialog({ open, onOpenChange, initialData, onSave }) {
    const [form, setForm] = useState({
        name: '',
        code: '',
        type: 'cement',
        unit: '',
        unitPrice: '',
        minStockLevel: '',
        maxStockLevel: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                code: initialData.code || '',
                type: initialData.type || 'cement',
                unit: initialData.unit || '',
                unitPrice: initialData.unitPrice || '',
                minStockLevel: initialData.minStockLevel || '',
                maxStockLevel: initialData.maxStockLevel || '',
                description: initialData.description || '',
            });
        } else {
            setForm({
                name: '',
                code: '',
                type: 'cement',
                unit: '',
                unitPrice: '',
                minStockLevel: '',
                maxStockLevel: '',
                description: '',
            });
        }
    }, [initialData, open]);

    const handleSubmit = async () => {
        if (!form.name || !form.code || !form.unit) {
            toast.error('Name, Code, and Unit are required');
            return;
        }
        setLoading(true);
        const success = await onSave({
            ...form,
            unitPrice: form.unitPrice ? Number(form.unitPrice) : 0,
            minStockLevel: form.minStockLevel ? Number(form.minStockLevel) : 0,
            maxStockLevel: form.maxStockLevel ? Number(form.maxStockLevel) : 0,
        });
        setLoading(false);
        if (success) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Material' : 'Create Material'}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label>Name *</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Code *</Label>
                        <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Type</Label>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cement">Cement</SelectItem>
                                <SelectItem value="steel">Steel</SelectItem>
                                <SelectItem value="sand">Sand</SelectItem>
                                <SelectItem value="aggregate">Aggregate</SelectItem>
                                <SelectItem value="electrical">Electrical</SelectItem>
                                <SelectItem value="plumbing">Plumbing</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Unit *</Label>
                        <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="bags, kg, tons" />
                    </div>
                    <div className="space-y-1">
                        <Label>Unit Price (₹)</Label>
                        <Input type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Min Stock Level</Label>
                        <Input type="number" value={form.minStockLevel} onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label>Max Stock Level</Label>
                        <Input type="number" value={form.maxStockLevel} onChange={(e) => setForm({ ...form, maxStockLevel: e.target.value })} />
                    </div>
                    <div className="col-span-2 space-y-1">
                        <Label>Description</Label>
                        <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}