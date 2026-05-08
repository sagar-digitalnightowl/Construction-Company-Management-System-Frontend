import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useCRMStore } from "@/store/dataStore";
import { useAuthStore, useUsersStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR } from "@/lib/helpers";

const STAGES = [
    {
        id: "qualified", label: "Qualified", tint: "var(--color-chart-4)"
    },
    {
        id: "proposal", label: "Proposal", tint: "var(--color-chart-3)"
    },
    {
        id: "negotiation", label: "Negotiation", tint: "var(--color-chart-1)"
    },
    { id: "won", label: "Won", tint: "var(--color-success)" },
];

export default function CRM() {
    const { leads, addLead, updateLead, removeLead } = useCRMStore();
    const users = useUsersStore((s) => s.users);
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "crm");
    const empty = {
        name: "", contact: "", phone: "", value: 0, stage: "qualified", owner: "", note: ""
    };
    const [open, setOpen] = useState(false); const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty); const [confirmId, setConfirmId] = useState(null);

    const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
    const startEdit = (l) => { setEditing(l); setForm({ ...l }); setOpen(true); };
    const save = () => {
        if (!form.name) {
            toast.error("Lead name required"); return;
        }
        const p = { ...form, value: Number(form.value) };
        if (editing) {
            updateLead(editing.id, p); toast.success("Lead updated");
        } else { addLead(p); toast.success("Lead added"); }
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Business" title="CRM & Client Pipeline" description="Track every opportunity from qualification to handshake."
                actions={canEdit && <Button onClick={startCreate}><Plus className="h-4 w-4" /> New lead</Button>
                } />

            < div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    STAGES.map((s) => {
                        const stageLeads = leads.filter(l => l.stage === s.id);
                        const total = stageLeads.reduce((a, l) => a + l.value, 0);
                        return (
                            <div key={s.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                                < div className="flex items-center justify-between">
                                    < div className="flex items-center gap-2">
                                        < span className="h-2 w-2 rounded-full" style={{ background: s.tint }} />
                                        < div className="font-medium text-sm">{s.label}</div>
                                    </div >
                                    <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
                                </div >
                                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Pipeline</div>
                                < div className="font-display text-xl font-semibold">{formatINR(total)}</div>
                                < div className="space-y-2 pt-1">
                                    {
                                        stageLeads.map(l => {
                                            const own = users.find(u => u.id === l.owner);
                                            return (
                                                <Card key={l.id} className="p-3 hover:shadow transition-shadow group">
                                                    < div className="flex items-start justify-between gap-2">
                                                        < div className="min-w-0">
                                                            < div className="text-sm font-medium truncate">{l.name}</div>
                                                            < div className="text-[11px] text-muted-foreground truncate">{l.contact}</div>
                                                        </div >
                                                        <Badge variant="outline" className="shrink-0 text-[10.5px]">{formatINR(l.value)}</Badge>
                                                    </div >
                                                    <div className="text-[11px] text-muted-foreground mt-1.5 line-clamp-1">{l.note}</div>
                                                    < div className="flex items-center justify-between mt-2">
                                                        < div className="text-[11px] text-muted-foreground">PM: {own?.name?.split(" ")[0] || "—"}</div>
                                                        {
                                                            canEdit && (
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                                                                    < Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(l)}><Pencil className="h-3.5 w-3.5" /></Button>
                                                                    < Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setConfirmId(l.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                                                </div >
                                                            )
                                                        }
                                                    </div >
                                                </Card >
                                            );
                                        })}
                                </div >
                            </div >
                        );
                    })}
            </div >

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? "Edit lead" : "New lead"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5"><Label>Lead name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Contact</Label><Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Value (₹)</Label><Input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Stage</Label>
                            < Select value={form.stage} onValueChange={v => setForm({ ...form, stage: v })} >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{STAGES.map(s => (<SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        <div className="col-span-2 space-y-1.5"><Label>Owner</Label>
                            < Select value={form.owner} onValueChange={v => setForm({ ...form, owner: v })} >
                                <SelectTrigger><SelectValue placeholder="Select PM" /></SelectTrigger>
                                <SelectContent>{users.filter(u => u.role === "project_manager").map(u => (<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        <div className="col-span-2 space-y-1.5"><Label>Note</Label><Textarea rows={2} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} /></div>
                    </div >
                    <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Add"}</Button></DialogFooter >
                </DialogContent >
            </Dialog >
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete lead?" onConfirm={() => { removeLead(confirmId); toast.success("Lead deleted"); setConfirmId(null); }} />
        </div >
    );
}