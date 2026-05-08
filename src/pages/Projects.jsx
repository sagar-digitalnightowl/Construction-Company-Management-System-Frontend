import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, MapPin, Calendar, IndianRupee, FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useProjectsStore } from "@/store/dataStore";
import { useAuthStore, useUsersStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR, formatDate } from "@/lib/helpers";

const STATUS = {
    planning: {
        label: "Planning", variant: "muted"
    },
    in_progress: { label: "In Progress", variant: "default" },
    delayed: { label: "Delayed", variant: "destructive" },
    completed: { label: "Completed", variant: "success" },
    on_hold: { label: "On Hold", variant: "warning" },
};

const empty = {
    code: "", name: "", client: "", location: "", status: "planning", priority: "medium", startDate: "", endDate: "", budget: 0, spent: 0, progress: 0, manager: "", siteEngineer: "", description: ""
};

export default function Projects() {
    const { projects, addProject, updateProject, removeProject } = useProjectsStore();
    const users = useUsersStore((s) => s.users);
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "projects");

    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const filtered = useMemo(() => projects.filter((p) => {
        const t = tab === "all" || p.status === tab;
        const m = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
        return t && m;
    }), [projects, tab, search]);

    const pms = users.filter(u => u.role === "project_manager");
    const ses = users.filter(u => u.role === "site_engineer");

    const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
    const startEdit = (p) => { setEditing(p); setForm({ ...p }); setOpen(true); };
    const save = () => {
        if (!form.name || !form.code) {
            toast.error("Project name and code required"); return;
        }
        if (editing) { updateProject(editing.id, { ...form, budget: Number(form.budget), spent: Number(form.spent), progress: Number(form.progress) }); toast.success("Project updated"); }
        else {
            addProject({ ...form, budget: Number(form.budget), spent: Number(form.spent), progress: Number(form.progress) }); toast.success("Project created");
        }
        setOpen(false);
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Operations" title="Projects" description="Track every construction project from BOQ to handover."
                actions={canEdit && <Button data-testid="proj-create-btn" onClick={startCreate}><Plus className="h-4 w-4" /> New project</Button>} />

            < div className="flex flex-wrap gap-3 items-center justify-between">
                < Tabs value={tab} onValueChange={setTab} >
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="planning">Planning</TabsTrigger>
                        <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                        <TabsTrigger value="delayed">Delayed</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="relative flex-1 min-w-[240px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input data-testid="proj-search" className="pl-9" placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div >

            {
                filtered.length === 0 ? (
                    <EmptyState icon={FolderKanban} title="No projects match your filters" description="Try adjusting filters or create a new project." />
                ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {
                            filtered.map((p) => {
                                const pm = users.find(u => u.id === p.manager);
                                const se = users.find(u => u.id === p.siteEngineer);
                                const burn = Math.round((p.spent / p.budget) * 100);
                                return (
                                    <Card key={p.id} data-testid={`proj-card-${p.code}`} className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
                                        < CardContent className="p-5 space-y-4">
                                            < div className="flex items-start justify-between gap-3">
                                                < div className="min-w-0">
                                                    < div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{p.code}</div>
                                                    < div className="font-display text-lg font-semibold leading-tight mt-0.5 truncate">{p.name}</div>
                                                    < div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</div>
                                                </div >
                                                <Badge variant={STATUS[p.status].variant}>{STATUS[p.status].label}</Badge>
                                            </div >

                                            <div>
                                                <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Progress</span><span className="font-medium tabular-nums">{p.progress}%</span></div>
                                                < Progress value={p.progress} indicatorClassName={
                                                    p.status === "delayed" ? "bg-destructive" : p.progress > 70 ? "bg-[color:var(--color-success)]" : "bg-primary"} />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                < div > <div className="text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3 w-3" />Budget</div><div className="font-medium mt-0.5">{formatINR(p.budget)}</div></div>
                                                < div > <div className="text-muted-foreground">Spent ({burn}%)</div><div className="font-medium mt-0.5">{formatINR(p.spent)}</div></div>
                                                < div > <div className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Start</div><div className="font-medium mt-0.5">{formatDate(p.startDate)}</div></div>
                                                < div > <div className="text-muted-foreground">End</div><div className="font-medium mt-0.5">{formatDate(p.endDate)}</div></div>
                                            </div >

                                            <div className="flex items-center justify-between border-t border-border pt-3 -mb-1">
                                                < div className="text-xs text-muted-foreground">
                                                    < div > PM: <span className="text-foreground">{pm?.name ?? "—"}</span></div>
                                                    < div > Client: <span className="text-foreground">{p.client}</span></div>
                                                </div >
                                                {canEdit && (
                                                    <div className="flex gap-1">
                                                        < Button variant="ghost" size="icon" onClick={() => startEdit(p)} data-testid={`proj-edit-${p.code}`}><Pencil className="h-4 w-4" /></Button>
                                                        < Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(p.id)} data-testid={`proj-del-${p.code}`}><Trash2 className="h-4 w-4" /></Button>
                                                    </div >
                                                )
                                                }
                                            </div >
                                        </CardContent >
                                    </Card >
                                );
                            })}
                    </div >
                )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>{editing ? "Edit project" : "Create new project"}</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="space-y-1.5"><Label>Project code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="BH-XXX-25" /></div>
                        <div className="space-y-1.5"><Label>Status</Label>
                            < Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.entries(STATUS).map(([k, v]) => (<SelectItem key={k} value={k}>{v.label}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        <div className="col-span-2 space-y-1.5"><Label>Project name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Start date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>End date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Budget (₹)</Label><Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Spent (₹)</Label><Input type="number" value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Progress (%)</Label><Input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} /></div>
                        < div className="space-y-1.5"><Label>Priority</Label>
                            < Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                            </Select >
                        </div >
                        <div className="space-y-1.5"><Label>Project Manager</Label>
                            < Select value={form.manager} onValueChange={(v) => setForm({ ...form, manager: v })}>
                                <SelectTrigger><SelectValue placeholder="Select PM" /></SelectTrigger>
                                <SelectContent>{pms.map(u => (<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        <div className="space-y-1.5"><Label>Site Engineer</Label>
                            < Select value={form.siteEngineer} onValueChange={(v) => setForm({ ...form, siteEngineer: v })}>
                                <SelectTrigger><SelectValue placeholder="Select engineer" /></SelectTrigger>
                                <SelectContent>{ses.map(u => (<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        <div className="col-span-2 space-y-1.5"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                    </div >
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={save} data-testid="proj-form-save">{editing ? "Save" : "Create"}</Button>
                    </DialogFooter >
                </DialogContent >
            </Dialog >
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete project?" description="All linked dummy data references will remain but project disappears from this list." onConfirm={() => { removeProject(confirmId); toast.success("Project deleted"); setConfirmId(null); }} />
        </div >
    );
}