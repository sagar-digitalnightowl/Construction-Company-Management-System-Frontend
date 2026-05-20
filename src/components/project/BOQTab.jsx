// src/components/project/BOQTab.jsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatINR } from '@/lib/helpers';

export function BOQTab({ boq = { items: [], totalAmount: 0, isApproved: false }, canEdit, onAddBOQItem }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ itemName: '', category: '', unit: '', quantity: '', unitPrice: '', description: '' });
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        if (!form.itemName || !form.quantity || !form.unitPrice) return;
        setSaving(true);
        const success = await onAddBOQItem({...form, quantity: Number(form.quantity), unitPrice: Number(form.unitPrice)});
        setSaving(false);
        if (success) setOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center"><p className="text-sm text-muted-foreground">{boq.items.length} items · Total: <strong>{formatINR(boq.totalAmount)}</strong></p>{canEdit && <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>}</div>
            {boq.items.length === 0 ? <Card><CardContent className="p-8 text-center"><p className="text-sm font-medium text-muted-foreground">No BOQ items</p></CardContent></Card> : (
                <div className="rounded-lg border overflow-auto">
                    <table className="w-full text-sm"><thead className="bg-muted/50"><tr><th className="text-left px-4 py-2.5">Item</th><th className="text-left">Category</th><th className="text-right">Qty</th><th className="text-left">Unit</th><th className="text-right">Unit Price</th><th className="text-right">Total</th></tr></thead>
                        <tbody>{boq.items.map(item => <tr key={item._id}><td className="px-4 py-2.5"><p className="font-medium">{item.itemName}</p></td><td className="capitalize">{item.category}</td><td className="text-right">{item.quantity}</td><td>{item.unit}</td><td className="text-right">{formatINR(item.unitPrice)}</td><td className="text-right font-medium">{formatINR(item.quantity * item.unitPrice)}</td></tr>)}</tbody>
                        <tfoot><tr><td colSpan={5} className="text-right px-4 py-2.5 font-medium">Grand Total</td><td className="px-4 py-2.5 text-right font-semibold">{formatINR(boq.totalAmount)}</td></tr></tfoot></table>
                </div>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Add BOQ Item</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3"><Input placeholder="Item Name" value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} /><Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /><Input placeholder="Unit" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} /><Input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /><Input type="number" placeholder="Unit Price" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} /><Input placeholder="Description" className="col-span-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={handleAdd} disabled={saving}>Add</Button></DialogFooter></DialogContent>
            </Dialog>
        </div>
    );
}