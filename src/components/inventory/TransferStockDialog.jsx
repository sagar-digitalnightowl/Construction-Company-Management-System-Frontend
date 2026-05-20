// src/components/inventory/TransferStockDialog.jsx
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

export function TransferStockDialog({ open, onOpenChange, stockItem, warehouses = [], onTransfer }) {
    const [form, setForm] = useState({
        materialId: '',
        quantity: '',
        toWarehouse: '',
        reason: '',
        remarks: '',
    });
    const [materials, setMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [loading, setLoading] = useState(false);


    // Extract data from stockItem (safe defaults)
    const preSelectedMaterialId = stockItem?.materialId?._id || null;
    const preSelectedMaterialName = stockItem?.materialId?.name || '';
    const fromWarehouseName = stockItem?.warehouse || '';
    const availableQty = stockItem?.availableQuantity ?? stockItem?.quantity ?? 0;
    const unit = stockItem?.materialId?.unit ||  'units';

    // Load material list if no material preselected
    useEffect(() => {
        if (!open) return;

        if (preSelectedMaterialId) {
            setForm(prev => ({ ...prev, materialId: preSelectedMaterialId }));
        } else {
            const fetchMaterials = async () => {
                setLoadingMaterials(true);
                try {
                    const res = await inventoryApi.getAllMaterials({ limit: 100 });
                    const list = res?.data?.data?.materials || [];
                    if (list.length === 0) toast.warning('No materials found');
                    setMaterials(list);
                } catch (err) {
                    console.error(err);
                    toast.error('Could not load materials');
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
        // Only check against available stock if we have a known quantity (i.e., transferring from a specific stock)
        if (preSelectedMaterialId && qtyNum > availableQty) {
            toast.error(`Transfer quantity exceeds available stock (${availableQty} ${unit})`);
            return;
        }
        // Validate destination warehouse
        if (!form.toWarehouse) {
            toast.error('Destination warehouse is required');
            return;
        }
        if (form.toWarehouse === fromWarehouseName) {
            toast.error('Cannot transfer to the same warehouse');
            return;
        }

        // Check onTransfer is a function
        if (typeof onTransfer !== 'function') {
            toast.error('Transfer function not available');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                materialId: form.materialId,
                quantity: qtyNum,
                fromWarehouse: fromWarehouseName,
                toWarehouse: form.toWarehouse,
                reason: form.reason || undefined,
                remarks: form.remarks || undefined,
            };
            const success = await onTransfer(payload);
            if (success) {
                toast.success('Stock transferred successfully');
                onOpenChange(false);
                // Reset form
                setForm({
                    materialId: preSelectedMaterialId || '',
                    quantity: '',
                    toWarehouse: '',
                    reason: '',
                    remarks: '',
                });
            } else {
                toast.error('Transfer failed – check console');
            }
        } catch (err) {
            console.error('Transfer error:', err);
            toast.error(err?.response?.data?.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const isLoading = !preSelectedMaterialId && loadingMaterials;
    const otherWarehouses = warehouses.filter(w => (w.name || w) !== fromWarehouseName);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Transfer Stock Between Warehouses</DialogTitle>
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

                        {/* From Warehouse */}
                        <div className="space-y-1">
                            <Label>From Warehouse</Label>
                            <p className="text-sm text-muted-foreground">{fromWarehouseName || 'Not specified'}</p>
                        </div>

                        {/* To Warehouse */}
                        <div className="space-y-1">
                            <Label>To Warehouse *</Label>
                            <Select
                                value={form.toWarehouse}
                                onValueChange={(val) => setForm({ ...form, toWarehouse: val })}
                                disabled={otherWarehouses.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={otherWarehouses.length === 0 ? 'No other warehouses' : 'Select destination'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {otherWarehouses.map((w) => (
                                        <SelectItem key={w._id} value={w.name}>
                                            {w.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-1">
                            <Label>Quantity to Transfer *</Label>
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

                        {/* Reason */}
                        <div className="space-y-1">
                            <Label>Reason (optional)</Label>
                            <Input
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                placeholder="e.g., Stock redistribution for project"
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
                    <Button onClick={handleSubmit} disabled={loading || isLoading || otherWarehouses.length === 0}>
                        Transfer Stock
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}