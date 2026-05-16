// src/components/inventory/ReturnStockDialog.jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function ReturnStockDialog({ open, onOpenChange, stockItem, onReturn }) {
    const [form, setForm] = useState({
        quantity: '',
        condition: 'good',
        reason: '',
        remarks: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.quantity) {
            toast.error('Quantity is required');
            return;
        }
        if (Number(form.quantity) > (stockItem?.quantity || 0)) {
            toast.error('Return quantity cannot exceed current stock');
            return;
        }
        setLoading(true);
        const success = await onReturn({
            materialId: stockItem.material?._id || stockItem.materialId,
            quantity: Number(form.quantity),
            condition: form.condition,
            reason: form.reason,
            remarks: form.remarks,
        });
        setLoading(false);
        if (success) {
            onOpenChange(false);
            setForm({ quantity: '', condition: 'good', reason: '', remarks: '' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Return Stock to Warehouse</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Material</Label>
                        <p className="text-sm font-medium">{stockItem?.material?.name || stockItem?.materialName}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>Quantity *</Label>
                        <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                        <p className="text-xs text-muted-foreground">Available: {stockItem?.quantity} {stockItem?.unit}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>Condition</Label>
                        <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="good">Good Condition</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Reason</Label>
                        <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Project completed / unused" />
                    </div>
                    <div className="space-y-1">
                        <Label>Remarks</Label>
                        <Textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>Return Stock</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}