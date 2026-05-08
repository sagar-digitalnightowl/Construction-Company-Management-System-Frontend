import React, { useState } from "react";
import { Plus, Pencil, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useProcurementStore, useProjectsStore, useVendorsStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR, formatDate } from "@/lib/helpers";

const STATUS = {
    draft: "muted", in_review: "warning", approved: "default", delivered: "success", rejected: "destructive",
};

const empty = {
    code: "", projectId: "", vendorId: "", item: "", amount: 0, status: "draft", raisedOn: new Date().toISOString().slice(0, 10), expectedDelivery: ""
};

export default function Procurement() {
    const { orders, addOrder, updateOrder, removeOrder } = useProcurementStore();
    const projects = useProjectsStore((s) => s.projects);
    const vendors = useVendorsStore((s) => s.vendors);
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "procurement");

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const startCreate = () => {
        setEditing(null); setForm({
            ...empty, raisedBy: current.id, code: `PO-${new Date().toISOString().slice(2, 7).replace("-", "")}-${String(Math.floor(Math.random() * 9000) + 1000)}`
        }); setOpen(true);
    };
    const startEdit = (o) => { setEditing(o); setForm({ ...o }); setOpen(true); };
    const save = () => {
        if (!form.item || !form.vendorId) {
            toast.error("Item and vendor required"); return;
        }
        if (editing) { updateOrder(editing.id, { ...form, amount: Number(form.amount) }); toast.success("PO updated"); }
        else {
            addOrder({ ...form, amount: Number(form.amount) }); toast.success("PO raised");
        }
        setOpen(false);
    };

    const stats = {
        inFlight: orders.filter(o => ["in_review", "approved"].includes(o.status)).length,
        pendingApproval: orders.filter(o => o.status === "in_review").length,
        spendThisMonth: orders.filter(o => o.status !== "draft").reduce((a, o) => a + o.amount, 0),
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Operations" title="Procurement" description="Material requests → RFQ → PO → delivery → inventory."
                actions={canEdit && <Button data-testid="po-create-btn" onClick={startCreate}><Plus className="h-4 w-4" /> New PO</Button>} />

            < div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                < Card > <CardContent className="p-5"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">In Flight</div><div className="font-display text-3xl font-semibold mt-1.5">{stats.inFlight}</div></CardContent></Card>
                < Card > <CardContent className="p-5"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Pending Approval</div><div className="font-display text-3xl font-semibold mt-1.5">{stats.pendingApproval}</div></CardContent></Card>
                < Card > <CardContent className="p-5"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Spend (open POs)</div><div className="font-display text-3xl font-semibold mt-1.5">{formatINR(stats.spendThisMonth)}</div></CardContent></Card>
            </div >

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PO #</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expected</TableHead>
                                <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((o) => (
                                <TableRow key={o.id} data-testid={`po-row-${o.code}`}>
                                    <TableCell className="font-mono text-xs">{o.code}</TableCell>
                                    <TableCell className="text-sm">{projects.find(p => p.id === o.projectId)?.code || "—"}</TableCell>
                                    <TableCell className="text-sm">{vendors.find(v => v.id === o.vendorId)?.name || "—"}</TableCell>
                                    < TableCell className="text-sm max-w-xs truncate">{o.item}</TableCell>
                                    < TableCell className="text-right font-medium tabular-nums">{formatINR(o.amount)}</TableCell>
                                    < TableCell > <Badge variant={STATUS[o.status]}>{o.status.replace("_", " ")}</Badge></TableCell >
                                    <TableCell className="text-sm">{formatDate(o.expectedDelivery)}</TableCell>
                                    < TableCell className="text-right">
                                        {
                                            canEdit && (
                                                <div className="flex justify-end gap-1">
                                                    < Button variant="ghost" size="icon" onClick={() => startEdit(o)}><Pencil className="h-4 w-4" /></Button>
                                                    < Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(o.id)}><Trash2 className="h-4 w-4" /></Button>
                                                </div >
                                            )
                                        }
                                    </TableCell >
                                </TableRow >
                            ))}
                        </TableBody >
                    </Table >
                </CardContent >
            </Card >

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? "Edit PO" : "Raise Purchase Order"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>PO #</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Status</Label>
                            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.keys(STATUS).map(k => (<SelectItem key={k} value={k}>{k.replace("_", " ")}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5"><Label>Project</Label>
                            < Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>{projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        <div className="space-y-1.5"><Label>Vendor</Label>
                            < Select value={form.vendorId} onValueChange={(v) => setForm({ ...form, vendorId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>{vendors.map(v => (<SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        <div className="col-span-2 space-y-1.5"><Label>Item / description</Label><Input value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Expected delivery</Label><Input type="date" value={form.expectedDelivery} onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })} /></div>
                    </div >
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={save}>{editing ? "Save" : "Raise PO"}</Button>
                    </DialogFooter >
                </DialogContent >
            </Dialog >
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete purchase order?" onConfirm={() => { removeOrder(confirmId); toast.success("PO deleted"); setConfirmId(null); }} />
        </div >
    );
}