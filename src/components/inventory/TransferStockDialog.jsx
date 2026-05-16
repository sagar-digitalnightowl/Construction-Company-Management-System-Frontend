// src/components/inventory/TransferStockDialog.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function TransferStockDialog({ open, onOpenChange, stockItem, warehouses = [], onTransfer }) {
    const [form, setForm] = useState({
        quantity: '',
        toWarehouse: '',
        reason: '',
        remarks: '',
    });
    const [loading, setLoading] = useState(false);
    const fromWarehouse = stockItem?.warehouse?._id || stockItem?.warehouseId;

    useEffect(() => {
        if (!open) {
            setForm({ quantity: '', toWarehouse: '', reason: '', remarks: '' });
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!form.quantity || !form.toWarehouse) {
            toast.error('Quantity and destination warehouse are required');
            return;
        }
        if (Number(form.quantity) > (stockItem?.quantity || 0)) {
            toast.error('Transfer quantity exceeds available stock');
            return;
        }
        if (form.toWarehouse === fromWarehouse) {
            toast.error('Cannot transfer to same warehouse');
            return;
        }
        setLoading(true);
        const success = await onTransfer({
            materialId: stockItem.material?._id || stockItem.materialId,
            quantity: Number(form.quantity),
            fromWarehouse: fromWarehouse,
            toWarehouse: form.toWarehouse,
            reason: form.reason,
            remarks: form.remarks,
        });
        setLoading(false);
        if (success) {
            onOpenChange(false);
        }
    };

    const otherWarehouses = warehouses.filter(w => w._id !== fromWarehouse);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Transfer Stock</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Material</Label>
                        <p className="text-sm font-medium">{stockItem?.material?.name || stockItem?.materialName}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>From Warehouse</Label>
                        <p className="text-sm text-muted-foreground">{stockItem?.warehouse?.name || stockItem?.warehouseName}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>To Warehouse *</Label>
                        <Select value={form.toWarehouse} onValueChange={(v) => setForm({ ...form, toWarehouse: v })}>
                            <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                            <SelectContent>
                                {otherWarehouses.map(w => <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Quantity *</Label>
                        <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                        <p className="text-xs text-muted-foreground">Available: {stockItem?.quantity} {stockItem?.unit}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>Reason</Label>
                        <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Stock redistribution" />
                    </div>
                    <div className="space-y-1">
                        <Label>Remarks</Label>
                        <Textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>Transfer Stock</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}