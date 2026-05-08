import React, { useState } from "react";
import { Plus, Pencil, Trash2, Receipt, ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useFinanceStore, useProjectsStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR, formatDate } from "@/lib/helpers";

const INV_STATUS = {
    draft: "muted", sent: "default", paid: "success", overdue: "destructive"
};

export default function Finance() {
    const { invoices, expenses, addInvoice, updateInvoice, removeInvoice, addExpense, removeExpense } = useFinanceStore();
    const projects = useProjectsStore((s) => s.projects);
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "finance");

    const [open, setOpen] = useState(false); const [editing, setEditing] = useState(null);
    const empty = {
        code: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, "0")}`, projectId: "", clientName: "", amount: 0, gst: 0, total: 0, status: "draft", issuedOn: new Date().toISOString().slice(0, 10), dueOn: ""
    };
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const [expOpen, setExpOpen] = useState(false);
    const expEmpty = {
        projectId: "", category: "Material", note: "", amount: 0, date: new Date().toISOString().slice(0, 10)
    };
    const [expForm, setExpForm] = useState(expEmpty);

    const totals = {
        billed: invoices.reduce((a, i) => a + i.total, 0),
        paid: invoices.filter(i => i.status === "paid").reduce((a, i) => a + i.total, 0),
        overdue: invoices.filter(i => i.status === "overdue").reduce((a, i) => a + i.total, 0),
        expenses: expenses.reduce((a, e) => a + e.amount, 0),
    };

    const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
    const startEdit = (i) => { setEditing(i); setForm({ ...i }); setOpen(true); };
    const save = () => {
        const amount = Number(form.amount); const gst = Number(form.gst); const total = amount + gst;
        const p = { ...form, amount, gst, total };
        if (editing) { updateInvoice(editing.id, p); toast.success("Invoice updated"); }
        else {
            addInvoice(p); toast.success("Invoice raised");
        }
        setOpen(false);
    };
    const saveExp = () => {
        addExpense({ ...expForm, amount: Number(expForm.amount) }); toast.success("Expense logged"); setExpOpen(false); setExpForm(expEmpty);
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Business" title="Finance & Billing" description="GST invoices, project P&L, expense ledger and outstanding receivables."
                actions={canEdit && <Button onClick={startCreate}><Plus className="h-4 w-4" /> New invoice</Button>
                } />

            < div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                < StatCard label="Billed (incl. GST)" value={formatINR(totals.billed)} icon={Receipt} accent="primary" />
                < StatCard label="Collected" value={formatINR(totals.paid)} icon={ArrowDownToLine} accent="success" />
                < StatCard label="Overdue" value={formatINR(totals.overdue)} icon={Receipt} accent="warning" deltaTone={totals.overdue ? "down" : "up"} delta={totals.overdue ? "Action required" : "Clear"} />
                < StatCard label="Project Expenses" value={formatINR(totals.expenses)} icon={Receipt} />
            </div >

            <Tabs defaultValue="invoices">
                < TabsList >
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    < TabsTrigger value="expenses">Expense Ledger</TabsTrigger>
                </TabsList >

                <TabsContent value="invoices">
                    < Card > <CardContent className="p-0">
                        < Table >
                            <TableHeader><TableRow>
                                <TableHead>Invoice #</TableHead><TableHead>Project</TableHead><TableHead>Client</TableHead>
                                <TableHead className="text-right">Amount</TableHead><TableHead className="text-right">GST</TableHead><TableHead className="text-right">Total</TableHead>
                                < TableHead > Status</TableHead ><TableHead>Due</TableHead><TableHead className="text-right w-[90px]">Actions</TableHead>
                            </TableRow ></TableHeader >
                            <TableBody>
                                {invoices.map((i) => (
                                    <TableRow key={i.id} data-testid={`inv-${i.code}`}>
                                        <TableCell className="font-mono text-xs">{i.code}</TableCell>
                                        <TableCell className="text-sm">{projects.find(p => p.id === i.projectId)?.code || "—"}</TableCell>
                                        <TableCell className="text-sm">{i.clientName}</TableCell>
                                        < TableCell className="text-right tabular-nums">{formatINR(i.amount)}</TableCell>
                                        < TableCell className="text-right tabular-nums text-muted-foreground">{formatINR(i.gst)}</TableCell>
                                        < TableCell className="text-right tabular-nums font-medium">{formatINR(i.total)}</TableCell>
                                        < TableCell > <Badge variant={INV_STATUS[i.status]}>{i.status}</Badge></TableCell >
                                        <TableCell className="text-sm">{formatDate(i.dueOn)}</TableCell>
                                        < TableCell className="text-right">{canEdit && <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => startEdit(i)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(i.id)}><Trash2 className="h-4 w-4" /></Button></div>}</TableCell>
                                    </TableRow >
                                ))}
                            </TableBody >
                        </Table >
                    </CardContent ></Card >
                </TabsContent >

                <TabsContent value="expenses">
                    < div className="flex justify-end mb-3">{canEdit && <Button variant="outline" onClick={() => setExpOpen(true)}><Plus className="h-4 w-4" /> Log expense</Button>}</div>
                    < Card > <CardContent className="p-0">
                        < Table >
                            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Project</TableHead><TableHead>Category</TableHead><TableHead>Note</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right w-[80px]"></TableHead></TableRow ></TableHeader >
                            <TableBody>
                                {expenses.map(e => (
                                    <TableRow key={e.id}>
                                        <TableCell className="text-sm">{formatDate(e.date)}</TableCell>
                                        <TableCell className="text-sm">{projects.find(p => p.id === e.projectId)?.code || "—"}</TableCell>
                                        <TableCell><Badge variant="outline">{e.category}</Badge></TableCell >
                                        <TableCell className="text-sm">{e.note}</TableCell>
                                        < TableCell className="text-right tabular-nums font-medium">{formatINR(e.amount)}</TableCell>
                                        < TableCell className="text-right">{canEdit && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { removeExpense(e.id); toast.success("Expense removed"); }}><Trash2 className="h-4 w-4" /></Button>}</TableCell>
                                    </TableRow >
                                ))}
                            </TableBody >
                        </Table >
                    </CardContent ></Card >
                </TabsContent >
            </Tabs >

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? "Edit invoice" : "Raise GST invoice"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>Invoice #</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Status</Label>
                            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.keys(INV_STATUS).map(k => (<SelectItem key={k} value={k}>{k}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5"><Label>Project</Label>
                            < Select value={form.projectId} onValueChange={v => setForm({ ...form, projectId: v })} >
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>{projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        <div className="space-y-1.5"><Label>Client name</Label><Input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>GST (₹)</Label><Input type="number" value={form.gst} onChange={e => setForm({ ...form, gst: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Issued</Label><Input type="date" value={form.issuedOn} onChange={e => setForm({ ...form, issuedOn: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Due</Label><Input type="date" value={form.dueOn} onChange={e => setForm({ ...form, dueOn: e.target.value })} /></div>
                    </div >
                    <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Raise"}</Button></DialogFooter >
                </DialogContent >
            </Dialog >

            <Dialog open={expOpen} onOpenChange={setExpOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Log project expense</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label>Project</Label>
                            <Select value={expForm.projectId} onValueChange={v => setExpForm({ ...expForm, projectId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>{projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5"><Label>Category</Label>
                            <Select value={expForm.category} onValueChange={v => setExpForm({ ...expForm, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Material">Material</SelectItem><SelectItem value="Labour">Labour</SelectItem><SelectItem value="Consultancy">Consultancy</SelectItem><SelectItem value="Logistics">Logistics</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                            </Select >
                        </div >
                        <div className="col-span-2 space-y-1.5"><Label>Note</Label><Input value={expForm.note} onChange={e => setExpForm({ ...expForm, note: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={expForm.amount} onChange={e => setExpForm({ ...expForm, amount: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Date</Label><Input type="date" value={expForm.date} onChange={e => setExpForm({ ...expForm, date: e.target.value })} /></div>
                    </div >
                    <DialogFooter><Button variant="outline" onClick={() => setExpOpen(false)}>Cancel</Button><Button onClick={saveExp}>Log</Button></DialogFooter >
                </DialogContent >
            </Dialog >
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete invoice?" onConfirm={() => { removeInvoice(confirmId); toast.success("Invoice deleted"); setConfirmId(null); }} />
        </div >
    );
}