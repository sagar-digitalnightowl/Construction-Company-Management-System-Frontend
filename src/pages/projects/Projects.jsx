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
import { Copy, MoreVertical, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const STATUS = {
    planning: { label: "Planning", variant: "muted" },
    in_progress: { label: "In Progress", variant: "default" },
    delayed: { label: "Delayed", variant: "destructive" },
    completed: { label: "Completed", variant: "success" },
    on_hold: { label: "On Hold", variant: "warning" },
};

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, canEdit, onEdit, onDelete, onClone }) {
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onClone(project._id)}
                                    title="Clone Project"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </>
                        )}


                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/projects/${project._id}`)}>
                                    View
                                </DropdownMenuItem>

                                {canEdit && (
                                    <>
                                        <DropdownMenuItem onClick={() => onEdit(project)}>
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => onClone(project._id)}>
                                            Clone
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => onDelete(project._id)}
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu> */}
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

    const [cloning, setCloning] = useState(null);

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
            const res = await projectApi.delete(confirmId);
            if (res.data.success) {
                toast.success("Project deleted");
                setConfirmId(null);
                fetchProjects();
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete project");
        }
    };

    const handleClone = async (id) => {
        try {
            const res = await projectApi.clone(id);
            if (res.data.success) {
                toast.success("Project cloned successfully");
                fetchProjects();
            }
        } catch (err) {
            toast.error(err?.message || err?.response?.data?.message || "Failed to clone project");
        }
    };


    const exportToCSV = (data) => {
        const headers = Object.keys(data[0]);

        const csvRows = [
            headers.join(","), // header
            ...data.map(row =>
                headers.map(field => `"${row[field] ?? ""}"`).join(",")
            )
        ];

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "projects.csv";
        a.click();
    };



    const exportToPDF = (data) => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Projects Report", 14, 15);

        let startY = 25;

        data.forEach((project, index) => {
            // Section Title
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${project.name}`, 14, startY);

            startY += 4;

            // Table for project details
            autoTable(doc, {
                startY,
                theme: "grid",
                head: [["Field", "Value"]],
                body: [
                    ["Client", project.clientName],
                    ["Location", project.location],
                    ["Status", project.status],
                    ["Phase", project.currentPhase],
                    ["Priority", project.priority],
                    ["Progress", `${project.progress}%`],
                    ["Budget", project.budget],
                    ["Start Date", new Date(project.startDate).toLocaleDateString()],
                    ["End Date", new Date(project.endDate).toLocaleDateString()],
                    ["Manager", project.projectManager?.name || "-"],
                    ["Email", project.projectManager?.email || "-"],
                ],
            });

            startY = doc.lastAutoTable.finalY + 10;

            // Page break if needed
            if (startY > 270) {
                doc.addPage();
                startY = 20;
            }
        });

        doc.save("projects.pdf");
    };



    const handleExport = async (format = "excel", filters = {}) => {
        try {
            const res = await projectApi.export({
                format,
                ...filters,
            });

            if (res.data.success) {

                const data = res.data?.data || [];

                if (!data.length) {
                    toast.error("No data to export");
                    return;
                }

                if (format === "excel" || format === "csv") {
                    exportToCSV(data);
                } else if (format === "pdf") {
                    exportToPDF(data);
                }

                // const blob = new Blob([res.data]);
                // const url = window.URL.createObjectURL(blob);

                // const link = document.createElement("a");
                // link.href = url;
                // link.download = `projects.${format === "excel" ? "xlsx" : format}`;
                // link.click();

                toast.success("Export started");
            }
        } catch (err) {
            toast.error("Export failed");
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
                    <div className="flex gap-2">
                        {canEdit && (
                            <Button onClick={startCreate}>
                                <Plus className="h-4 w-4" /> New project
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleExport("excel")}>
                                    Export as Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport("csv")}>
                                    Export as CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
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
                            onClone={handleClone}
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