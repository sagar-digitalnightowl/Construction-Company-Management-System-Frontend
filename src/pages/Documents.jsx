import React, { useState } from "react";
import { Upload, Trash2, FileText, FileImage, FileCheck, FileSpreadsheet, Pencil } from "lucide-react";
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
import { useDocumentsStore, useProjectsStore } from "@/store/dataStore";
import { useAuthStore, useUsersStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatDate } from "@/lib/helpers";

const TYPE_ICON = { Drawing: FileImage, Contract: FileCheck, Report: FileText, Compliance: FileSpreadsheet };

export default function Documents() {
    const { docs, addDoc, updateDoc, removeDoc } = useDocumentsStore();
    const projects = useProjectsStore((s) => s.projects);
    const users = useUsersStore((s) => s.users);
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "documents");
    const empty = {
        name: "", type: "Drawing", projectId: "", size: "1 MB", version: "v1.0", uploadedBy: current.id
    };
    const [open, setOpen] = useState(false); const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty); const [confirmId, setConfirmId] = useState(null);

    const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
    const startEdit = (d) => { setEditing(d); setForm({ ...d }); setOpen(true); };
    const save = () => {
        if (!form.name) {
            toast.error("Document name required"); return;
        }
        if (editing) { updateDoc(editing.id, form); toast.success("Document updated"); }
        else {
            addDoc(form); toast.success("Document uploaded");
        }
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Business" title="Document Management" description="Drawings, contracts, reports & compliance — version-controlled."
                actions={canEdit && <Button onClick={startCreate}><Upload className="h-4 w-4" /> Upload</Button>
                } />

            < Card > <CardContent className="p-0">
                < Table >
                    <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Project</TableHead><TableHead>Size</TableHead><TableHead>Version</TableHead><TableHead>Uploaded by</TableHead><TableHead>Date</TableHead><TableHead className="text-right w-[100px]">Actions</TableHead></TableRow></TableHeader >
                    <TableBody>
                        {docs.map(d => {
                            const Icon = TYPE_ICON[d.type] || FileText;
                            const u = users.find(x => x.id === d.uploadedBy);
                            const p = projects.find(x => x.id === d.projectId);
                            return (
                                <TableRow key={d.id}>
                                    <TableCell><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-md bg-muted grid place-items-center"><Icon className="h-4 w-4 text-muted-foreground" /></div><div className="font-medium">{d.name}</div></div></TableCell >
                                    <TableCell><Badge variant="outline">{d.type}</Badge></TableCell >
                                    <TableCell className="text-sm">{p?.code || "—"}</TableCell>
                                    < TableCell className="text-sm text-muted-foreground tabular-nums">{d.size}</TableCell>
                                    < TableCell className="font-mono text-xs">{d.version}</TableCell>
                                    < TableCell className="text-sm">{u?.name || "—"}</TableCell>
                                    < TableCell className="text-sm">{formatDate(d.uploadedAt)}</TableCell>
                                    < TableCell className="text-right">{canEdit && <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => startEdit(d)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(d.id)}><Trash2 className="h-4 w-4" /></Button></div>}</TableCell>
                                </TableRow >
                            );
                        })}
                    </TableBody >
                </Table >
            </CardContent ></Card >

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? "Edit document" : "Upload document"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5"><Label>Document name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Type</Label>
                            <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.keys(TYPE_ICON).map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5"><Label>Project</Label>
                            < Select value={
                                form.projectId || ""} onValueChange={v => setForm({ ...form, projectId: v })}>
                                <SelectTrigger>< SelectValue placeholder="None" /></SelectTrigger>
                                < SelectContent > {projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent >
                            </Select >
                        </div >
                        <div className="space-y-1.5"><Label>Size</Label><Input value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Version</Label><Input value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} /></div>
                    </div >
                    <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Upload"}</Button></DialogFooter >
                </DialogContent >
            </Dialog >
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete document?" onConfirm={() => { removeDoc(confirmId); toast.success("Document deleted"); setConfirmId(null); }} />
        </div >
    );
}