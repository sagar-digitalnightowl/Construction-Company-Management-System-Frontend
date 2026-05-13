// import React, { useState, useMemo } from "react";
// import { Plus, Pencil, Trash2, Search, MapPin, Calendar, IndianRupee, FolderKanban } from "lucide-react";
// import { toast } from "sonner";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ConfirmDialog } from "@/components/common/ConfirmDialog";
// import { useProjectsStore } from "@/store/dataStore";
// import { useAuthStore, useUsersStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { formatINR, formatDate } from "@/lib/helpers";

// const STATUS = {
//     planning: {
//         label: "Planning", variant: "muted"
//     },
//     in_progress: { label: "In Progress", variant: "default" },
//     delayed: { label: "Delayed", variant: "destructive" },
//     completed: { label: "Completed", variant: "success" },
//     on_hold: { label: "On Hold", variant: "warning" },
// };

// const empty = {
//     code: "", name: "", client: "", location: "", status: "planning", priority: "medium", startDate: "", endDate: "", budget: 0, spent: 0, progress: 0, manager: "", siteEngineer: "", description: ""
// };

// export default function Projects() {
//     const { projects, addProject, updateProject, removeProject } = useProjectsStore();
//     const users = useUsersStore((s) => s.users);
//     const { current } = useAuthStore();
//     const canEdit = canMutate(current.role, "projects");

//     const [tab, setTab] = useState("all");
//     const [search, setSearch] = useState("");
//     const [open, setOpen] = useState(false);
//     const [editing, setEditing] = useState(null);
//     const [form, setForm] = useState(empty);
//     const [confirmId, setConfirmId] = useState(null);

//     const filtered = useMemo(() => projects.filter((p) => {
//         const t = tab === "all" || p.status === tab;
//         const m = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
//         return t && m;
//     }), [projects, tab, search]);

//     const pms = users.filter(u => u.role === "project_manager");
//     const ses = users.filter(u => u.role === "site_engineer");

//     const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
//     const startEdit = (p) => { setEditing(p); setForm({ ...p }); setOpen(true); };
//     const save = () => {
//         if (!form.name || !form.code) {
//             toast.error("Project name and code required"); return;
//         }
//         if (editing) { updateProject(editing.id, { ...form, budget: Number(form.budget), spent: Number(form.spent), progress: Number(form.progress) }); toast.success("Project updated"); }
//         else {
//             addProject({ ...form, budget: Number(form.budget), spent: Number(form.spent), progress: Number(form.progress) }); toast.success("Project created");
//         }
//         setOpen(false);
//     };

//     return (
//         <div className="space-y-5 sm:space-y-6">
//             <PageHeader eyebrow="Operations" title="Projects" description="Track every construction project from BOQ to handover."
//                 actions={canEdit && <Button data-testid="proj-create-btn" onClick={startCreate}><Plus className="h-4 w-4" /> New project</Button>} />

//             <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//                 <Tabs value={tab} onValueChange={setTab} className="overflow-auto">
//                     <TabsList>
//                         <TabsTrigger value="all">All</TabsTrigger>
//                         <TabsTrigger value="planning">Planning</TabsTrigger>
//                         <TabsTrigger value="in_progress">In Progress</TabsTrigger>
//                         <TabsTrigger value="delayed">Delayed</TabsTrigger>
//                         <TabsTrigger value="completed">Completed</TabsTrigger>
//                     </TabsList>
//                 </Tabs>
//                 <div className="relative w-full sm:flex-1 sm:min-w-[240px] sm:max-w-sm">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input data-testid="proj-search" className="pl-9" placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} />
//                 </div>
//             </div >

//             {
//                 filtered.length === 0 ? (
//                     <EmptyState icon={FolderKanban} title="No projects match your filters" description="Try adjusting filters or create a new project." />
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//                         {
//                             filtered.map((p) => {
//                                 const pm = users.find(u => u.id === p.manager);
//                                 const se = users.find(u => u.id === p.siteEngineer);
//                                 const burn = Math.round((p.spent / p.budget) * 100);
//                                 return (
//                                     <Card key={p.id} data-testid={`proj-card-${p.code}`} className="group transition-all hover:-translate-y-0.5 hover:shadow-md">
//                                         <CardContent className="p-3 sm:p-5 space-y-4">
//                                             <div className="flex items-start justify-between gap-3">
//                                                 <div className="min-w-0">
//                                                     <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{p.code}</div>
//                                                     <div className="font-display text-lg font-semibold leading-tight mt-0.5 truncate">{p.name}</div>
//                                                     <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</div>
//                                                 </div>
//                                                 <Badge variant={STATUS[p.status].variant} className={'text-nowrap'}>{STATUS[p.status].label}</Badge>
//                                             </div >

//                                             <div>
//                                                 <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Progress</span><span className="font-medium tabular-nums">{p.progress}%</span></div>
//                                                 <Progress value={p.progress} indicatorClassName={
//                                                     p.status === "delayed" ? "bg-destructive" : p.progress > 70 ? "bg-[color:var(--color-success)]" : "bg-primary"} />
//                                             </div>

//                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
//                                                 <div> <div className="text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3 w-3" />Budget</div><div className="font-medium mt-0.5">{formatINR(p.budget)}</div></div>
//                                                 <div> <div className="text-muted-foreground">Spent ({burn}%)</div><div className="font-medium mt-0.5">{formatINR(p.spent)}</div></div>
//                                                 <div> <div className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Start</div><div className="font-medium mt-0.5">{formatDate(p.startDate)}</div></div>
//                                                 <div> <div className="text-muted-foreground">End</div><div className="font-medium mt-0.5">{formatDate(p.endDate)}</div></div>
//                                             </div >

//                                             <div className="flex items-center justify-between border-t border-border pt-3 -mb-1">
//                                                 < div className="text-xs text-muted-foreground">
//                                                     < div > PM: <span className="text-foreground">{pm?.name ?? "—"}</span></div>
//                                                     < div > Client: <span className="text-foreground">{p.client}</span></div>
//                                                 </div >
//                                                 {canEdit && (
//                                                     <div className="flex gap-1">
//                                                         < Button variant="ghost" size="icon" onClick={() => startEdit(p)} data-testid={`proj-edit-${p.code}`}><Pencil className="h-4 w-4" /></Button>
//                                                         < Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(p.id)} data-testid={`proj-del-${p.code}`}><Trash2 className="h-4 w-4" /></Button>
//                                                     </div >
//                                                 )
//                                                 }
//                                             </div >
//                                         </CardContent >
//                                     </Card >
//                                 );
//                             })}
//                     </div >
//                 )}

//             {/* <DialogContent className="w-[95%] sm:max-w-2xl max-h-[90vh] flex flex-col p-4 sm:p-6"> */}
//                 <Dialog open={open} onOpenChange={setOpen}>
//                     <DialogContent className="w-[95%] sm:max-w-2xl max-h-[90vh] flex flex-col">
//                         <DialogHeader><DialogTitle>{editing ? "Edit project" : "Create new project"}</DialogTitle></DialogHeader>
//                         <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                                 <div className="space-y-1.5"><Label>Project code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="BH-XXX-25" /></div>
//                                 <div className="space-y-1.5"><Label>Status</Label>
//                                     < Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
//                                         <SelectTrigger><SelectValue /></SelectTrigger>
//                                         <SelectContent>{Object.entries(STATUS).map(([k, v]) => (<SelectItem key={k} value={k}>{v.label}</SelectItem>))}</SelectContent>
//                                     </Select >
//                                 </div >
//                                 <div className="col-span-2 space-y-1.5"><Label>Project name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
//                                 < div className="space-y-1.5"><Label>Client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
//                                 < div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
//                                 < div className="space-y-1.5"><Label>Start date</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
//                                 < div className="space-y-1.5"><Label>End date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
//                                 < div className="space-y-1.5"><Label>Budget (₹)</Label><Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
//                                 < div className="space-y-1.5"><Label>Spent (₹)</Label><Input type="number" value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} /></div>
//                                 < div className="space-y-1.5"><Label>Progress (%)</Label><Input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} /></div>
//                                 < div className="space-y-1.5"><Label>Priority</Label>
//                                     < Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
//                                         <SelectTrigger><SelectValue /></SelectTrigger>
//                                         <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
//                                     </Select >
//                                 </div >
//                                 <div className="space-y-1.5"><Label>Project Manager</Label>
//                                     < Select value={form.manager} onValueChange={(v) => setForm({ ...form, manager: v })}>
//                                         <SelectTrigger><SelectValue placeholder="Select PM" /></SelectTrigger>
//                                         <SelectContent>{pms.map(u => (<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>))}</SelectContent>
//                                     </Select >
//                                 </div >
//                                 <div className="space-y-1.5"><Label>Site Engineer</Label>
//                                     < Select value={form.siteEngineer} onValueChange={(v) => setForm({ ...form, siteEngineer: v })}>
//                                         <SelectTrigger><SelectValue placeholder="Select engineer" /></SelectTrigger>
//                                         <SelectContent>{ses.map(u => (<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>))}</SelectContent>
//                                     </Select >
//                                 </div >
//                                 <div className="col-span-2 space-y-1.5"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
//                             </div >
//                         </div>
//                         <DialogFooter>
//                             <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//                             <Button onClick={save} data-testid="proj-form-save">{editing ? "Save" : "Create"}</Button>
//                         </DialogFooter >
//                     </DialogContent >
//                 </Dialog >
//             {/* </DialogContent> */}
//             <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete project?" description="All linked dummy data references will remain but project disappears from this list." onConfirm={() => { removeProject(confirmId); toast.success("Project deleted"); setConfirmId(null); }} />
//         </div >
//     );
// }






import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, FolderKanban, MapPin, Calendar, IndianRupee, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR, formatDate } from "@/lib/helpers";
import { ProjectForm } from "@/components/project/ProjectForm";
import { projectApi } from "@/api";

export const STATUS = {
    planning: { label: "Planning", variant: "muted" },
    in_progress: { label: "In Progress", variant: "default" },
    delayed: { label: "Delayed", variant: "destructive" },
    completed: { label: "Completed", variant: "success" },
    on_hold: { label: "On Hold", variant: "warning" },
};

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, canEdit, onEdit, onDelete }) {
    const navigate = useNavigate();
    const burn = project.budget ? Math.round((project.spent / project.budget) * 100) : 0;

    return (
        <Card
            data-testid={`proj-card-${project._id}`}
            className="group transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/projects/${project._id}`)}
        >
            <CardContent className="p-3 sm:p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="font-display text-lg font-semibold leading-tight mt-0.5 truncate">
                            {project.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {project.location}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                            Client: <span className="text-foreground">{project.clientName}</span>
                        </div>
                    </div>
                    <Badge variant={STATUS[project.status]?.variant} className="text-nowrap shrink-0">
                        {STATUS[project.status]?.label ?? project.status}
                    </Badge>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium tabular-nums">{project.progress ?? 0}%</span>
                    </div>
                    <Progress
                        value={project.progress ?? 0}
                        indicatorClassName={
                            project.status === "delayed"
                                ? "bg-destructive"
                                : (project.progress ?? 0) > 70
                                    ? "bg-[color:var(--color-success)]"
                                    : "bg-primary"
                        }
                    />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />Budget
                        </div>
                        <div className="font-medium mt-0.5">{formatINR(project.budget)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground">Spent ({burn || 0}%)</div>
                        <div className="font-medium mt-0.5">{formatINR(project.spent ?? 0)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />Start
                        </div>
                        <div className="font-medium mt-0.5">{formatDate(project.startDate)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground">End</div>
                        <div className="font-medium mt-0.5">{formatDate(project.endDate)}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border pt-3 -mb-1">
                    <div className="text-xs text-muted-foreground">
                        <div>PM: <span className="text-foreground">{project.projectManager?.name ?? "—"}</span></div>
                        <div>Priority: <span className="text-foreground capitalize">{project.priority ?? "—"}</span></div>
                    </div>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/projects/${project._id}`)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        {canEdit && (
                            <>
                                <Button
                                    variant="ghost" size="icon"
                                    onClick={() => onEdit(project)}
                                    data-testid={`proj-edit-${project._id}`}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost" size="icon"
                                    className="text-destructive"
                                    onClick={() => onDelete(project._id)}
                                    data-testid={`proj-del-${project._id}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function ProjectSkeleton() {
    return (
        <Card>
            <CardContent className="p-5 space-y-4">
                <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Projects() {
    const { current } = useAuthStore();
    const canEdit = canMutate(current?.role, "projects");

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);   // project object or null
    const [confirmId, setConfirmId] = useState(null);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await projectApi.getAll();
            // Support both { data: [] } and { data: { projects: [] } } shapes
            const list = res?.data?.data?.projects ?? res?.data?.data ?? res?.data ?? [];
            setProjects(Array.isArray(list) ? list : []);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load projects");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    // ── Derived list ───────────────────────────────────────────────────────────
    const filtered = useMemo(() => projects.filter((p) => {
        const matchTab = tab === "all" || p.status === tab;
        const q = search.toLowerCase();
        const matchSearch = !q
            || p.name?.toLowerCase().includes(q)
            || p.clientName?.toLowerCase().includes(q)
            || p.location?.toLowerCase().includes(q);
        return matchTab && matchSearch;
    }), [projects, tab, search]);

    // ── Handlers ───────────────────────────────────────────────────────────────
    const startCreate = () => { setEditing(null); setFormOpen(true); };
    const startEdit = (p) => { setEditing(p); setFormOpen(true); };

    const handleSave = async (formData) => {
        try {
            if (editing) {
                await projectApi.update(editing._id, formData);
                toast.success("Project updated");
            } else {
                await projectApi.create(formData);
                toast.success("Project created");
            }
            setFormOpen(false);
            fetchProjects();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    };

    const handleDelete = async () => {
        try {
            await projectApi.delete(confirmId);
            toast.success("Project deleted");
            setConfirmId(null);
            fetchProjects();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete project");
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-5 sm:space-y-6">
            <PageHeader
                eyebrow="Operations"
                title="Projects"
                description="Track every construction project from BOQ to handover."
                actions={
                    canEdit && (
                        <Button data-testid="proj-create-btn" onClick={startCreate}>
                            <Plus className="h-4 w-4" /> New project
                        </Button>
                    )
                }
            />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <Tabs value={tab} onValueChange={setTab} className="overflow-auto">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="planning">Planning</TabsTrigger>
                        <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                        <TabsTrigger value="delayed">Delayed</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="relative w-full sm:flex-1 sm:min-w-[240px] sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        data-testid="proj-search"
                        className="pl-9"
                        placeholder="Search projects…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={FolderKanban}
                    title="No projects match your filters"
                    description="Try adjusting filters or create a new project."
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((p) => (
                        <ProjectCard
                            key={p._id}
                            project={p}
                            canEdit={canEdit}
                            onEdit={startEdit}
                            onDelete={setConfirmId}
                        />
                    ))}
                </div>
            )}

            {/* Create / Edit Dialog */}
            <ProjectForm
                open={formOpen}
                onOpenChange={setFormOpen}
                initialData={editing}
                onSave={handleSave}
            />

            {/* Delete Confirm */}
            <ConfirmDialog
                open={!!confirmId}
                onOpenChange={(v) => !v && setConfirmId(null)}
                title="Delete project?"
                description="This will permanently remove the project and all linked data."
                onConfirm={handleDelete}
            />
        </div>
    );
}