import React, { useState } from "react";
import { Plus, Pencil, Trash2, Star, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useVendorsStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR, initials } from "@/lib/helpers";

const empty = {
    name: "", category: "", contact: "", phone: "", email: "", gst: "", rating: 4.0, status: "active", outstanding: 0
};

export default function Vendors() {
    const { vendors, addVendor, updateVendor, removeVendor } = useVendorsStore();
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "vendors");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
    const startEdit = (v) => { setEditing(v); setForm({ ...v }); setOpen(true); };
    const save = () => {
        if (!form.name) {
            toast.error("Vendor name required"); return;
        }
        const payload = { ...form, rating: Number(form.rating), outstanding: Number(form.outstanding) };
        if (editing) { updateVendor(editing.id, payload); toast.success("Vendor updated"); }
        else {
            addVendor(payload); toast.success("Vendor onboarded");
        }
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Operations" title="Vendors & Contractors" description="Onboarded suppliers, payment status, compliance & ratings."
                actions={canEdit && <Button onClick={startCreate}><Plus className="h-4 w-4" /> Onboard vendor</Button>
                } />

            < div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    vendors.map((v) => (
                        <Card key={v.id} className="hover:shadow-md transition-shadow">
                            < CardContent className="p-5 space-y-4">
                                < div className="flex items-start gap-3">
                                    < Avatar className="h-11 w-11"><AvatarFallback className="bg-primary/10 text-primary">{initials(v.name)}</AvatarFallback></Avatar>
                                    < div className="min-w-0 flex-1">
                                        < div className="font-display text-base font-semibold leading-tight truncate">{v.name}</div>
                                        < div className="text-xs text-muted-foreground mt-0.5">{v.category}</div>
                                        < div className="flex items-center gap-1 mt-1.5">
                                            < Star className="h-3.5 w-3.5 fill-[color:var(--color-warning)] text-[color:var(--color-warning)]" />
                                            < span className="text-xs font-medium tabular-nums">{v.rating.toFixed(1)}</span>
                                        </div >
                                    </div >
                                    <Badge variant={v.status === "active" ? "success" : "warning"}>{v.status.replace("_", " ")}</Badge>
                                </div >

                                <div className="space-y-1.5 text-xs">
                                    < div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3 w-3" />{v.phone}</div>
                                    < div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3 w-3" />{v.email}</div>
                                    < div className="text-muted-foreground">GST: <span className="font-mono text-foreground">{v.gst}</span></div>
                                </div >

                                <div className="flex items-center justify-between border-t border-border pt-3 -mb-1">
                                    < div >
                                        <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Outstanding</div>
                                        < div className="font-medium">{formatINR(v.outstanding)}</div>
                                    </div >
                                    {canEdit && (
                                        <div className="flex gap-1">
                                            < Button variant="ghost" size="icon" onClick={() => startEdit(v)}><Pencil className="h-4 w-4" /></Button>
                                            < Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(v.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div >
                                    )}
                                </div >
                            </CardContent >
                        </Card >
                    ))}
            </div >

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? "Edit vendor" : "Onboard new vendor"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5"><Label>Vendor name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Contact person</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>GST #</Label><Input value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Rating</Label><Input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Outstanding (₹)</Label><Input type="number" value={form.outstanding} onChange={(e) => setForm({ ...form, outstanding: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Status</Label>
                            < Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="on_hold">On hold</SelectItem><SelectItem value="blacklisted">Blacklisted</SelectItem></SelectContent>
                            </Select >
                        </div >
                    </div >
                    <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Onboard"}</Button></DialogFooter >
                </DialogContent >
            </Dialog >
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Remove vendor?" onConfirm={() => { removeVendor(confirmId); toast.success("Vendor removed"); setConfirmId(null); }} />
        </div >
    );
}