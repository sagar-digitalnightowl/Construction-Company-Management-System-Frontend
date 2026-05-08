import React, { useState } from "react";
import { Plus, Pencil, Trash2, AlertTriangle, Boxes } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useInventoryStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR } from "@/lib/helpers";

const empty = {
    sku: "", name: "", category: "", unit: "pc", stock: 0, reorder: 0, valuation: 0, warehouse: ""
};

export default function Inventory() {
    const { items, addItem, updateItem, removeItem } = useInventoryStore();
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "inventory");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const totalValue = items.reduce((a, i) => a + i.stock * i.valuation, 0);
    const lowStock = items.filter(i => i.stock <= i.reorder);

    const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
    const startEdit = (i) => { setEditing(i); setForm({ ...i }); setOpen(true); };
    const save = () => {
        if (!form.name || !form.sku) {
            toast.error("SKU and name required"); return;
        }
        const p = { ...form, stock: Number(form.stock), reorder: Number(form.reorder), valuation: Number(form.valuation) };
        if (editing) { updateItem(editing.id, p); toast.success("Item updated"); }
        else {
            addItem(p); toast.success("Item added");
        }
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Operations" title="Inventory & Warehouse" description="Material stock, valuation, reorder thresholds across all warehouses."
                actions={canEdit && <Button onClick={startCreate}><Plus className="h-4 w-4" /> Add item</Button>
                } />

            < div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                < StatCard label="SKUs" value={items.length} icon={Boxes} />
                < StatCard label="Inventory Value" value={formatINR(totalValue)} icon={Boxes} accent="success" />
                < StatCard label="Low Stock Alerts" value={lowStock.length} deltaTone={lowStock.length ? "down" : "up"} delta={lowStock.length ? "Reorder needed" : "All good"} icon={AlertTriangle} accent="warning" />
                < StatCard label="Warehouses" value={new Set(items.map(i => i.warehouse)).size} icon={Boxes} accent="neutral" />
            </div >

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Material</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead className="text-right">Stock</TableHead>
                                <TableHead className="text-right">Reorder @</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                                <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow >
                        </TableHeader >
                        <TableBody>
                            {items.map((i) => {
                                const low = i.stock <= i.reorder;
                                return (
                                    <TableRow key={i.id} data-testid={`inv-row-${i.sku}`} className={low ? "bg-[color-mix(in_oklab,var(--color-warning)_8%,transparent)]" : ""}>
                                        <TableCell className="font-mono text-xs">{i.sku}</TableCell>
                                        <TableCell><div className="font-medium">{i.name}</div></TableCell >
                                        <TableCell><Badge variant="outline">{i.category}</Badge></TableCell >
                                        <TableCell className="text-sm text-muted-foreground">{i.warehouse}</TableCell>
                                        < TableCell className="text-right tabular-nums">
                                            < span className={
                                                low ? "text-destructive font-medium" : ""}>{i.stock} {i.unit}</span>
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-muted-foreground">{i.reorder}</TableCell>
                                        < TableCell className="text-right tabular-nums font-medium">{formatINR(i.stock * i.valuation)}</TableCell>
                                        < TableCell className="text-right">
                                            {
                                                canEdit && (
                                                    <div className="flex justify-end gap-1">
                                                        < Button variant="ghost" size="icon" onClick={() => startEdit(i)}><Pencil className="h-4 w-4" /></Button>
                                                        < Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(i.id)}><Trash2 className="h-4 w-4" /></Button>
                                                    </div >
                                                )
                                            }
                                        </TableCell >
                                    </TableRow >
                                );
                            })}
                        </TableBody >
                    </Table >
                </CardContent >
            </Card >

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? "Edit item" : "Add inventory item"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                        <div className="col-span-2 space-y-1.5"><Label>Material name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Warehouse</Label><Input value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Unit</Label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="bag, ton, pc" /></div>
                        <div className="space-y-1.5"><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Reorder @</Label><Input type="number" value={form.reorder} onChange={(e) => setForm({ ...form, reorder: e.target.value })} /></div>
                        <div className="col-span-2 space-y-1.5"><Label>Unit valuation (₹)</Label><Input type="number" value={form.valuation} onChange={(e) => setForm({ ...form, valuation: e.target.value })} /></div>
                    </div >
                    <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Add"}</Button></DialogFooter >
                </DialogContent >
            </Dialog >
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete item?" onConfirm={() => { removeItem(confirmId); toast.success("Item deleted"); setConfirmId(null); }} />
        </div >
    );
}