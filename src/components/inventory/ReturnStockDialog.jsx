// src/components/inventory/ReturnStockDialog.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { inventoryApi } from '@/api/inventoryApi';

export function ReturnStockDialog({ open, onOpenChange, stockItem, onReturn }) {
    const [form, setForm] = useState({
        materialId: '',
        quantity: '',
        condition: 'good',
        reason: '',
        remarks: '',
    });
    const [materials, setMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [loading, setLoading] = useState(false);

    // Safely extract data from stockItem (it could be null or partial)
    const preSelectedMaterialId = stockItem?.materialId?._id || null;
    const preSelectedMaterialName = stockItem?.materialId?.name  || '';
    const availableQty = stockItem?.availableQuantity ?? stockItem?.quantity ?? 0;
    const unit = stockItem?.material?.unit || stockItem?.unit || 'units';

    // Pre-fill or fetch materials when dialog opens
    useEffect(() => {
        if (!open) return;

        if (preSelectedMaterialId) {
            setForm(prev => ({ ...prev, materialId: preSelectedMaterialId }));
        } else {
            // No material preselected – load list for manual selection
            const fetchMaterials = async () => {
                setLoadingMaterials(true);
                try {
                    const res = await inventoryApi.getAllMaterials({ limit: 100 });
                    const list = res?.data?.data?.materials || [];
                    if (list.length === 0) {
                        toast.warning('No materials found. Please add materials first.');
                    }
                    setMaterials(list);
                } catch (err) {
                    console.error('Failed to load materials', err);
                    toast.error('Could not load material list');
                } finally {
                    setLoadingMaterials(false);
                }
            };
            fetchMaterials();
        }
    }, [open, preSelectedMaterialId]);

    const handleSubmit = async () => {
        // Validate material
        if (!form.materialId) {
            toast.error('Please select a material');
            return;
        }
        // Validate quantity
        if (!form.quantity) {
            toast.error('Quantity is required');
            return;
        }
        const qtyNum = Number(form.quantity);
        if (isNaN(qtyNum) || qtyNum <= 0) {
            toast.error('Quantity must be a positive number');
            return;
        }
        // Only enforce stock limit if we have a known available quantity (i.e., returning from a specific stock item)
        if (preSelectedMaterialId && qtyNum > availableQty) {
            toast.error(`Cannot return more than available stock (${availableQty} ${unit})`);
            return;
        }

        // Make sure onReturn exists and is a function
        if (typeof onReturn !== 'function') {
            toast.error('Return function not available');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                materialId: form.materialId,
                quantity: qtyNum,
                condition: form.condition,
                reason: form.reason || undefined,
                remarks: form.remarks || undefined,
            };
            const success = await onReturn(payload);
            if (success) {
                toast.success('Stock returned successfully');
                onOpenChange(false);
                // Reset form
                setForm({
                    materialId: preSelectedMaterialId || '',
                    quantity: '',
                    condition: 'good',
                    reason: '',
                    remarks: '',
                });
            } else {
                toast.error('Return failed – check console for details');
            }
        } catch (err) {
            console.error('Return error:', err);
            toast.error(err?.response?.data?.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // If dialog is open but we have no way to select a material (no preselected and no materials loaded yet), show loading
    const isLoading = !preSelectedMaterialId && loadingMaterials;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Return Stock to Warehouse</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center">Loading materials...</div>
                ) : (
                    <div className="space-y-3">
                        {/* Material selection */}
                        <div className="space-y-1">
                            <Label>Material *</Label>
                            {preSelectedMaterialId ? (
                                <div className="p-2 bg-muted rounded-md">
                                    <p className="text-sm font-medium">{preSelectedMaterialName}</p>
                                    <p className="text-xs text-muted-foreground">ID: {preSelectedMaterialId}</p>
                                </div>
                            ) : (
                                <Select
                                    value={form.materialId}
                                    onValueChange={(val) => setForm({ ...form, materialId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select material" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {materials.map((m) => (
                                            <SelectItem key={m._id} value={m._id}>
                                                {m.name} ({m.unit})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="space-y-1">
                            <Label>Quantity to Return *</Label>
                            <Input
                                type="number"
                                step="any"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                placeholder={preSelectedMaterialId ? `Max ${availableQty}` : 'Enter quantity'}
                            />
                            {preSelectedMaterialId && (
                                <p className="text-xs text-muted-foreground">
                                    Available: {availableQty} {unit}
                                </p>
                            )}
                        </div>

                        {/* Condition */}
                        <div className="space-y-1">
                            <Label>Condition</Label>
                            <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="good">Good Condition</SelectItem>
                                    <SelectItem value="damaged">Damaged</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reason */}
                        <div className="space-y-1">
                            <Label>Reason (optional)</Label>
                            <Input
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                placeholder="e.g., Project completed, unused material"
                            />
                        </div>

                        {/* Remarks */}
                        <div className="space-y-1">
                            <Label>Remarks (optional)</Label>
                            <Textarea
                                rows={2}
                                value={form.remarks}
                                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                                placeholder="Additional notes"
                            />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || isLoading}>Return Stock</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}