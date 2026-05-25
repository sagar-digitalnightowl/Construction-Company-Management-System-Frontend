// src/components/inventory/AddStockDialog.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { inventoryApi } from '@/api';

export function AddStockDialog({ open, onOpenChange, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [form, setForm] = useState({
        materialId: '',
        quantity: '',
        unitPrice: '',
        warehouseName: '',
        poNumber: '',
        remarks: '',
    });

    // Fetch materials and warehouses when dialog opens
    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const [materialsRes, warehousesRes] = await Promise.all([
                        inventoryApi.getAllMaterials({ limit: 100 }),
                        inventoryApi.getWarehouses(),
                    ]);
                    setMaterials(materialsRes.data?.data?.materials || []);
                    setWarehouses(warehousesRes.data?.data || []);
                } catch (err) {
                    console.error('Failed to load form data', err);
                }
            };
            fetchData();
        }
    }, [open]);

    const handleSubmit = async () => {
        // Validation
        if (!form.materialId) {
            toast.error('Please select a material');
            return;
        }
        if (!form.quantity || Number(form.quantity) <= 0) {
            toast.error('Quantity must be a positive number');
            return;
        }
        if (!form.warehouseName) {
            toast.error('Please select a warehouse');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                materialId: form.materialId,
                quantity: Number(form.quantity),
                unitPrice: form.unitPrice ? Number(form.unitPrice) : undefined,
                warehouseName: form.warehouseName,
                poNumber: form.poNumber || undefined,
                remarks: form.remarks || undefined,
            };
            const res = await inventoryApi.addStock(payload);
            if (res.data?.success) {
                toast.success('Stock added successfully');
                onOpenChange(false);
                setForm({
                    materialId: '',
                    quantity: '',
                    unitPrice: '',
                    warehouseName: '',
                    poNumber: '',
                    remarks: '',
                });
                if (onSuccess) onSuccess();
            } else {
                throw new Error(res.data?.message || 'Failed to add stock');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add stock');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Stock</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1">
                        <Label>Material *</Label>
                        <Select value={form.materialId} onValueChange={(val) => setForm({ ...form, materialId: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                                {materials.map((m) => (
                                    <SelectItem key={m._id} value={m._id}>
                                        {m.name} ({m.code || m._id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label>Quantity *</Label>
                        <Input
                            type="number"
                            step="any"
                            placeholder="e.g., 500"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Unit Price (optional)</Label>
                        <Input
                            type="number"
                            step="any"
                            placeholder="e.g., 380"
                            value={form.unitPrice}
                            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Warehouse *</Label>
                        <Select value={form.warehouseName} onValueChange={(val) => setForm({ ...form, warehouseName: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map((w) => (
                                    <SelectItem key={w._id} value={w.name}>
                                        {w.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label>PO Number (optional)</Label>
                        <Input
                            placeholder="e.g., PO-2024-001"
                            value={form.poNumber}
                            onChange={(e) => setForm({ ...form, poNumber: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Remarks (optional)</Label>
                        <Input
                            placeholder="Received from vendor"
                            value={form.remarks}
                            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>Add Stock</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}