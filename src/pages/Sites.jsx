import React, { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Camera, Users as UsersIcon, AlertCircle, CloudSun } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useSiteStore, useProjectsStore } from "@/store/dataStore";
import { useAuthStore, useUsersStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatDate } from "@/lib/helpers";

const empty = {
    date: new Date().toISOString().slice(0, 10), projectId: "", engineer: "", weather: "", manpower: 0, milestone: "", issues: "", photos: 0
};

export default function Sites() {
    const { reports, addReport, updateReport, removeReport } = useSiteStore();
    const projects = useProjectsStore((s) => s.projects);
    const users = useUsersStore((s) => s.users);
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "sites");

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const startCreate = () => { setEditing(null); setForm({ ...empty, engineer: current.id }); setOpen(true); };
    const startEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };
    const save = () => {
        if (!form.projectId || !form.milestone) {
            toast.error("Project and milestone are required"); return;
        }
        if (editing) { updateReport(editing.id, { ...form, manpower: Number(form.manpower), photos: Number(form.photos) }); toast.success("Report updated"); }
        else {
            addReport({ ...form, manpower: Number(form.manpower), photos: Number(form.photos) }); toast.success("Daily progress report submitted");
        }
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Operations" title="Site Management" description="Daily progress reports, manpower, weather and on-site issues."
                actions={canEdit && <Button data-testid="site-add-btn" onClick={startCreate}><Plus className="h-4 w-4" /> New report</Button>} />

            < div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {
                    reports.map((r) => {
                        const p = projects.find(x => x.id === r.projectId);
                        const eng = users.find(u => u.id === r.engineer);
                        return (
                            <Card key={r.id} data-testid={`site-rep-${r.id}`} className="hover:shadow-md transition-shadow">
                                < CardHeader >
                                    <div className="flex justify-between items-start gap-3">
                                        < div >
                                            <CardTitle className="text-base">{p?.name ?? "—"}</CardTitle>
                                            < CardDescription className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{p?.location}</CardDescription>
                                        </div >
                                        <Badge variant="outline" className={'text-nowrap'}>{formatDate(r.date)}</Badge>
                                    </div >
                                </CardHeader >
                                <CardContent className="space-y-3">
                                    < div className="text-sm font-medium">{r.milestone}</div>
                                    {
                                        r.issues && r.issues !== "None" && (
                                            < div className="text-xs flex items-start gap-2 p-2 rounded-md bg-[color-mix(in_oklab,var(--color-warning)_12%,transparent)] text-[color:color-mix(in_oklab,var(--color-warning)_55%,black)]">
                                                < AlertCircle className="h-3.5 w-3.5 mt-0.5" /><span>{r.issues}</span>
                                            </div >
                                        )
                                    }
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        < div className="flex items-center gap-1.5 text-muted-foreground"><UsersIcon className="h-3.5 w-3.5" /><span className="text-foreground font-medium">{r.manpower}</span> workers</div>
                                        < div className="flex items-center gap-1.5 text-muted-foreground"><CloudSun className="h-3.5 w-3.5" />{r.weather}</div>
                                        < div className="flex items-center gap-1.5 text-muted-foreground"><Camera className="h-3.5 w-3.5" /><span className="text-foreground font-medium">{r.photos}</span></div>
                                    </div >
                                    <div className="flex items-center justify-between border-t border-border pt-3 -mb-1">
                                        < div className="text-xs text-muted-foreground">By {eng?.name ?? "—"}</div>
                                        {
                                            canEdit && (
                                                <div className="flex gap-1">
                                                    < Button variant="ghost" size="icon" onClick={() => startEdit(r)}><Pencil className="h-4 w-4" /></Button>
                                                    < Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(r.id)}><Trash2 className="h-4 w-4" /></Button>
                                                </div >
                                            )
                                        }
                                    </div >
                                </CardContent >
                            </Card >
                        );
                    })}
            </div >

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? "Edit report" : "Daily Progress Report"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5"><Label>Project</Label>
                            <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                                <SelectTrigger data-testid="site-form-project"><SelectValue placeholder="Select project" /></SelectTrigger>
                                <SelectContent>{projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Date</Label>
                            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                        </div>
                        <div className="space-y-1.5"><Label>Weather</Label><Input value={form.weather} onChange={(e) => setForm({ ...form, weather: e.target.value })} placeholder="Clear, 26°C" /></div>
                        <div className="space-y-1.5"><Label>Manpower</Label><Input type="number" value={form.manpower} onChange={(e) => setForm({ ...form, manpower: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Photos uploaded</Label><Input type="number" value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value })} /></div>
                        <div className="col-span-2 space-y-1.5"><Label>Milestone / progress</Label><Textarea rows={2} value={form.milestone} onChange={(e) => setForm({ ...form, milestone: e.target.value })} /></div>
                        <div className="col-span-2 space-y-1.5"><Label>Issues / blockers</Label><Textarea rows={2} value={form.issues} onChange={(e) => setForm({ ...form, issues: e.target.value })} placeholder="None" /></div>
                    </div >
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={save}>{editing ? "Save" : "Submit"}</Button>
                    </DialogFooter >
                </DialogContent >
            </Dialog >
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete report?" onConfirm={() => { removeReport(confirmId); toast.success("Report deleted"); setConfirmId(null); }} />
        </div >
    );
}