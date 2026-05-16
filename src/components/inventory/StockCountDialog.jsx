// src/components/inventory/StockCountDialog.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function StockCountDialog({ open, onOpenChange, warehouses = [], onStartCount }) {
    const [form, setForm] = useState({
        warehouseId: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.warehouseId) {
            toast.error('Please select a warehouse');
            return;
        }
        setLoading(true);
        const result = await onStartCount(form);
        setLoading(false);
        if (result) {
            onOpenChange(false);
            setForm({ warehouseId: '', notes: '' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Start Physical Stock Count</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Warehouse *</Label>
                        <Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })}>
                            <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                            <SelectContent>
                                {warehouses.map(w => <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Notes</Label>
                        <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional instructions" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>Start Count</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}