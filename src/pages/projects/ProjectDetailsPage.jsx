import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, MapPin, Calendar, IndianRupee, Users, Flag, BarChart3,
    ClipboardList, Activity, Loader2, Plus, Check, AlertCircle,
    Building2, Phone, Mail, TrendingUp, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { authApi, projectApi, taskApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR, formatDate } from "@/lib/helpers";
import { STATUS } from "./Projects";


const PHASES = [
    "tender",
    "planning",
    "excavation",
    "foundation",
    "structure",
    "brickwork",
    "electrical",
    "plumbing",
    "finishing",
    "handover",
    "maintenance",
];


// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, iconClass = "text-primary" }) {
    return (
        <Card>
            <CardContent className="p-4 flex items-start gap-3">
                <div className={`mt-0.5 ${iconClass}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-semibold text-sm mt-0.5 truncate">{value}</p>
                    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ project, comments, onProgressUpdate, canEdit, fetchProject }) {
    const [progress, setProgress] = useState(project.progress ?? 0);
    const [saving, setSaving] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [adding, setAdding] = useState(false);



    const [teamModal, setTeamModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [teamError, setTeamError] = useState("");

    const [phase, setPhase] = useState(project.currentPhase || "");
    const [updatingPhase, setUpdatingPhase] = useState(false);


    useEffect(() => {
        if (!teamModal) return;

        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await authApi.getUsers();
                if (res?.data?.success) {
                    const list = res.data.data.users || [];
                    setUsers(list);
                    setFilteredUsers(list);
                }
            } catch (err) {
                setTeamError("Failed to load users");
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [teamModal]);

    useEffect(() => {
        const q = search.toLowerCase();
        setFilteredUsers(
            users.filter(
                (u) =>
                    u.name?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q)
            )
        );
    }, [search, users]);

    const toggleUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((u) => u !== id)
                : [...prev, id]
        );
    };


    const handleAssignTeam = async () => {
        if (selectedUsers.length === 0) {
            setTeamError("Select at least one user");
            return;
        }

        setAssigning(true);
        setTeamError("");

        try {
            await projectApi.assignTeam(project._id, {
                teamMembers: selectedUsers,
            });

            project.teamMembers = [
                ...(project.teamMembers || []),
                ...selectedUsers,
            ];

            setTeamModal(false);
            setSelectedUsers([]);
        } catch (err) {
            setTeamError("Failed to assign team");
        } finally {
            setAssigning(false);
        }
    };


    const handleUpdateProgress = async () => {
        setSaving(true);
        try {
            await projectApi.updateProgress(project._id, { progress: Number(progress) });
            onProgressUpdate(Number(progress));
            toast.success("Progress updated");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update progress");
        } finally {
            setSaving(false);
        }
    };


    const handleAddComment = async () => {
        if (!newComment) return;
        setSaving(true);
        try {
            await projectApi.addComment(project._id, { comment: newComment });
            setNewComment("");
            toast.success("Comment added");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add comment");
        } finally {
            setSaving(false);
        }
    };



    const handleUpdatePhase = async () => {
        if (!phase) return;

        setUpdatingPhase(true);
        try {
            const res = await projectApi.updatePhase(project._id, { phase });

            if (res.data.success) {
                await fetchProject(false);
                toast.success("Phase updated successfully");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update phase");
        } finally {
            setUpdatingPhase(false);
        }
    };


    const burn = project.budget ? Math.round(((project.spent ?? 0) / project.budget) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    icon={IndianRupee}
                    label="Total Budget"
                    value={formatINR(project.budget)}
                    sub={`${burn}% utilized`}
                    iconClass="text-emerald-600"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Amount Spent"
                    value={formatINR(project.spent ?? 0)}
                    sub={formatINR((project.budget ?? 0) - (project.spent ?? 0)) + " remaining"}
                    iconClass="text-blue-500"
                />
                <StatCard
                    icon={Calendar}
                    label="Start Date"
                    value={formatDate(project.startDate)}
                />
                <StatCard
                    icon={Calendar}
                    label="End Date"
                    value={formatDate(project.endDate)}
                    iconClass="text-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
                {/* Left: Progress + Description */}
                <div className="lg:col-span-2 space-y-2">
                    {/* Progress Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center justify-between">
                                Project Completion
                                {canEdit && (
                                    <Button
                                        size="sm"
                                        // variant="outline"
                                        onClick={handleUpdateProgress}
                                        disabled={saving}
                                    >
                                        {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                                        Update
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Progress
                                    value={Number(progress)}
                                    className="flex-1"
                                    indicatorClassName={
                                        project.status === "delayed"
                                            ? "bg-destructive"
                                            : Number(progress) > 70
                                                ? "bg-[color:var(--color-success)]"
                                                : "bg-primary"
                                    }
                                />
                                {canEdit ? (
                                    <Input
                                        type="number"
                                        min={0} max={100}
                                        value={progress}
                                        onChange={(e) => setProgress(e.target.value)}
                                        className="w-20 text-center"
                                    />
                                ) : (
                                    <span className="font-semibold tabular-nums w-12 text-right">
                                        {progress}%
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Budget Utilization */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Budget Utilization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Spent</span>
                                <span>{burn}%</span>
                            </div>
                            <Progress
                                value={burn}
                                indicatorClassName={burn > 90 ? "bg-destructive" : burn > 70 ? "bg-warning" : "bg-emerald-500"}
                            />
                            <div className="flex justify-between text-xs pt-1">
                                <span className="text-muted-foreground">
                                    Spent: <span className="text-foreground font-medium">{formatINR(project.spent ?? 0)}</span>
                                </span>
                                <span className="text-muted-foreground">
                                    Budget: <span className="text-foreground font-medium">{formatINR(project.budget)}</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    {project.description && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {project.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex justify-between items-center">
                                Update Project Phase

                                {canEdit && (
                                    <Button
                                        size="sm"
                                        onClick={handleUpdatePhase}
                                        disabled={updatingPhase}
                                    >
                                        {updatingPhase && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Update
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <select
                                value={phase}
                                onChange={(e) => setPhase(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 text-sm"
                                disabled={!canEdit}
                            >
                                <option value="">Select Phase</option>
                                {PHASES.map((p) => (
                                    <option key={p} value={p}>
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Phase History</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {project.phaseHistory?.length > 0 ? (
                                project.phaseHistory.map((phase, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start justify-between border rounded-md px-3 py-2"
                                    >
                                        <div>
                                            <p className="font-medium capitalize">
                                                <span>{phase.phase}</span>
                                                <span>{phase.phase === project.currentPhase ? " (Current)" : ""}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(phase.startDate)}
                                            </p>
                                        </div>

                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${phase.isCompleted
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {phase.isCompleted ? "Completed" : "Active"}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No phase history available
                                </p>
                            )}
                        </CardContent>
                    </Card>



                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Comments</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Add Comment */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button
                                    size="lg"
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim() || adding}
                                >
                                    {adding ? "Posting..." : "Post"}
                                </Button>
                            </div>

                            {/* Comment List */}
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                {comments?.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-md p-3 space-y-1"
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-medium">
                                                    {comment?.userId?.name || "Unknown"}
                                                </p>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>

                                            <p className="text-sm text-muted-foreground">
                                                {comment.text}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-6">
                                        No comments yet
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>


                {/* Right: Client + Address info */}
                <div className="space-y-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Client Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-muted-foreground text-xs">Client</p>
                                    <p className="font-medium">{project.clientName ?? "—"}</p>
                                </div>
                            </div>
                            {project.clientPhone && (
                                <div className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Phone</p>
                                        <p className="font-medium">{project.clientPhone}</p>
                                    </div>
                                </div>
                            )}
                            {project.clientEmail && (
                                <div className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Email</p>
                                        <p className="font-medium">{project.clientEmail}</p>
                                    </div>
                                </div>
                            )}
                            {project.address && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Address</p>
                                        <p className="font-medium">
                                            {[project.address.city, project.address.state, project.address.pincode]
                                                .filter(Boolean).join(", ")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Team</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-muted-foreground text-xs">Project Manager</p>
                                        <p className="font-medium">{project.projectManager?.name ?? "—"}</p>
                                    </div>
                                </div>
                                {project.clientPhone && (
                                    <div className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Phone</p>
                                            <p className="font-medium">{project.projectManager?.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {project.clientEmail && (
                                    <div className="flex items-start gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Email</p>
                                            <p className="font-medium">{project.projectManager?.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Separator />
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-muted-foreground text-xs">Team Members</p>

                                    {canEdit && (
                                        <Button size="xs" onClick={() => setTeamModal(true)}>
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add
                                        </Button>
                                    )}
                                </div>


                                {project.teamMembers?.length > 0 ? (
                                    <div className="space-y-2">
                                        {project.teamMembers.map((member) => (
                                            <div
                                                key={member._id}
                                                className="flex items-center justify-between border rounded-md px-3 py-2"
                                            >
                                                <span className="font-medium text-sm">
                                                    {member?.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {/* {project.metadata?.teamRoles?.[member._id] || "member"} */}
                                                    {member?.role.split("_").join(" ")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No team assigned</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>





            <Dialog open={teamModal} onOpenChange={setTeamModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Team Members</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        {/* Error */}
                        {teamError && (
                            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                                {teamError}
                            </div>
                        )}

                        {/* Search */}
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* User List */}
                        <div className="max-h-[250px] overflow-y-auto space-y-2">
                            {loadingUsers ? (
                                <p className="text-sm text-muted-foreground text-center">
                                    Loading...
                                </p>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => toggleUser(user._id)}
                                        className={`flex justify-between items-center border rounded-md px-3 py-2 cursor-pointer ${selectedUsers.includes(user._id)
                                            ? "bg-primary/10 border-primary"
                                            : ""
                                            }`}
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>

                                        {selectedUsers.includes(user._id) && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center">
                                    No users found
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTeamModal(false)}>
                            Cancel
                        </Button>

                        <Button onClick={handleAssignTeam} disabled={assigning}>
                            {assigning ? "Assigning..." : "Assign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─── Milestones Tab ────────────────────────────────────────────────────────────
function MilestonesTab({ project, milestones, canEdit, fetchProject }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", dueDate: "" });
    const [list, setList] = useState(milestones ?? []);
    const [error, setError] = useState("");

    const [taskModal, setTaskModal] = useState({ open: false, milestoneId: null });
    const [taskForm, setTaskForm] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        assignedTo: "",
    });
    const [taskError, setTaskError] = useState("");


    useEffect(() => {
        setList(milestones ?? []);
    }, [milestones]);

    useEffect(() => {
        if (open) setError("");
    }, [open]);

    const handleAdd = async () => {
        if (!form.name) {
            setError("Milestone name is required");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const res = await projectApi.addMilestone(project._id, form);
            if (res.data?.success) {
                await fetchProject(false);
                toast.success("Milestone added");
                setOpen(false);
                setForm({ name: "", description: "", dueDate: "" });
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to add milestone");
        } finally {
            setSaving(false);
        }
    };



    const handleAddTask = async () => {
        if (!taskForm.title) {
            setTaskError("Task title is required");
            return;
        }

        try {
            const res = await taskApi.createTask(project._id, {
                ...taskForm,
                milestoneId: taskModal.milestoneId,
            });

            if (res.data?.success) {
                await fetchProject(false);
                toast.success("Task added");
                setTaskModal({ open: false, milestoneId: null });
                setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" });
            }
        } catch (err) {
            console.log("Error in task creation : ", err)
            setTaskError("Failed to create task");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{list.length} milestone{list.length !== 1 ? "s" : ""}</p>
                {canEdit && (
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="h-3 w-3 mr-1" /> Add Milestone
                    </Button>
                )}
            </div>

            {list.length === 0 ? (
                <EmptyCard title="No milestones yet" description="Add milestones to track key project phases." />
            ) : (
                <div className="space-y-2">
                    {list.map((m, i) => (
                        <Card key={m._id ?? i}>
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className={`mt-0.5 rounded-full p-1 ${m.isCompleted ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                                    <Check className="h-3 w-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{m.name}</p>
                                    {m.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground shrink-0 flex flex-col items-end">
                                    <p className="mb-1">Due Date : {m.dueDate ? formatDate(m.dueDate) : "No date"}</p>
                                    <p>Complete At : {m.completedAt ? formatDate(m.completedAt) : "No date"}</p>
                                </div>
                            </CardContent>

                            <Separator />

                            <CardContent className="space-y-3 mt-3">
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">
                                        {m.tasks?.length || 0} task{m.tasks?.length !== 1 ? "s" : ""}
                                    </p>

                                    {canEdit && (
                                        <Button
                                            size="xs"
                                            onClick={() =>
                                                setTaskModal({ open: true, milestoneId: m._id })
                                            }
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Task
                                        </Button>
                                    )}
                                </div>

                                {/* Task List */}
                                {m.tasks?.length > 0 ? (
                                    <div className="space-y-2">
                                        {m.tasks.map((task) => (
                                            <div
                                                key={task._id}
                                                className="flex items-center justify-between border rounded-md px-3 py-2"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {task.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {task.priority} • {task.status || "pending"}
                                                    </p>
                                                    {task.assignedTo && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Assigned to: {
                                                                project.teamMembers?.find(u => u._id === task.assignedTo)?.name
                                                                || "User"
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="text-xs text-muted-foreground text-right">
                                                    <p>{task.dueDate ? formatDate(task.dueDate) : "No due date"}</p>
                                                    <p>{task.estimatedHours || 0}h</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground text-center py-2">
                                        No tasks yet
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}



            {/* Add Milestone Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Add Milestone</DialogTitle></DialogHeader>
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label>Name <span className="text-destructive">*</span></Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Foundation Complete" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description</Label>
                            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Due Date</Label>
                            <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd} disabled={saving || !form.name}>
                            {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Add Task Modal */}
            <Dialog open={taskModal.open} onOpenChange={(val) => setTaskModal({ open: val, milestoneId: null })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Task</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        {/* Error */}
                        {taskError && (
                            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                                {taskError}
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-1.5">
                            <Label>Title <span className="text-destructive">*</span></Label>
                            <Input
                                value={taskForm.title}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, title: e.target.value })
                                }
                                placeholder="Complete foundation work"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label>Description</Label>
                            <Textarea
                                rows={2}
                                value={taskForm.description}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, description: e.target.value })
                                }
                            />
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <Label>Due Date</Label>
                            <Input
                                type="date"
                                value={taskForm.dueDate}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                                }
                            />
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <Label>Priority</Label>
                            <select
                                className="w-full border rounded-md px-2 py-2 text-sm"
                                value={taskForm.priority}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, priority: e.target.value })
                                }
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Assign To</Label>

                            <select
                                className="w-full border rounded-md px-2 py-2 text-sm"
                                value={taskForm.assignedTo}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, assignedTo: e.target.value })
                                }
                            >
                                <option value="">Select team member</option>

                                {project.teamMembers?.map((member) => (
                                    <option key={member._id} value={member._id}>
                                        {member.name || member.email || member._id} (
                                        {member.projectRole})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setTaskModal({ open: false, milestoneId: null })
                            }
                        >
                            Cancel
                        </Button>

                        <Button onClick={handleAddTask}>
                            Add Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─── BOQ Tab ───────────────────────────────────────────────────────────────────
function BOQTab({ project, boq, canEdit, fetchProject }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        itemName: "", description: "", quantity: "", unit: "", unitPrice: "", category: "",
    });
    const [boqError, setBoqError] = useState("");



    const handleAdd = async () => {
        if (!form.itemName || !form.description || !form.quantity || !form.unitPrice || !form.category || !form.unit) {
            setBoqError("All fields are required");
        }
        setSaving(true);
        try {
            const res = await projectApi.addBOQ(project._id, {
                ...form,
                quantity: Number(form.quantity),
                unitPrice: Number(form.unitPrice),
            });
            if (res.data?.success) {
                await fetchProject(false);
                toast.success("BOQ item added");
                setOpen(false);
                setForm({ itemName: "", description: "", quantity: "", unit: "", unitPrice: "", category: "" });
            }
        } catch (err) {
            setBoqError(err?.response?.data?.message || "Failed to add BOQ item");
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground flex items-center">
                    <span>{boq.items.length} item{boq.items.length !== 1 ? "s" : ""} · Total: <strong>{formatINR(boq?.totalAmount)}</strong></span>
                    <span className="ml-2">
                        {boq.isApproved ?
                            <Badge
                                variant="success"
                            >
                                Approved
                            </Badge>
                            : <Badge
                                variant="destructive"
                            >
                                Not Approved
                            </Badge>
                        }
                    </span>

                </p>
                {canEdit && (
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="h-3 w-3 mr-1" /> Add Item
                    </Button>
                )}
            </div>

            {boq.items.length === 0 ? (
                <EmptyCard title="No BOQ items" description="Add bill of quantity items to track materials and costs." />
            ) : (
                <div className="rounded-lg border overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Item</th>
                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Category</th>
                                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Qty</th>
                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Unit</th>
                                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Unit Price</th>
                                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Received Qty</th>
                                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Remaining Qty</th>
                                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boq.items.map((item, i) => (
                                <tr key={item._id ?? i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5">
                                        <p className="font-medium">{item.itemName}</p>
                                        {item.description && (
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-muted-foreground capitalize">{item.category ?? "—"}</td>
                                    <td className="px-4 py-2.5 text-right tabular-nums">{item.quantity}</td>
                                    <td className="px-4 py-2.5 text-muted-foreground">{item.unit}</td>
                                    <td className="px-4 py-2.5 text-right tabular-nums">{formatINR(item.unitPrice)}</td>
                                    <td className="px-4 py-2.5 text-right text-muted-foreground">{item.receivedQuantity}</td>
                                    <td className="px-4 py-2.5 text-right text-muted-foreground">{item.remainingQuantity}</td>
                                    <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                                        {formatINR((item.quantity ?? 0) * (item.unitPrice ?? 0))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-muted/50 border-t">
                            <tr>
                                <td colSpan={7} className="px-4 py-2.5 text-right font-medium">Grand Total</td>
                                <td className="px-4 py-2.5 text-right font-semibold">{formatINR(boq?.totalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Add Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>Add BOQ Item</DialogTitle></DialogHeader>
                    {boqError && (
                        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                            {boqError}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label>Item Name <span className="text-destructive">*</span></Label>
                            <Input value={form.itemName} required onChange={(e) => setForm({ ...form, itemName: e.target.value })} placeholder="Cement" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Category</Label>
                            <Input value={form.category} required onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="cement" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Unit</Label>
                            <Input value={form.unit} required onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="bags" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Quantity</Label>
                            <Input type="number" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Unit Price (₹)</Label>
                            <Input type="number" required value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Description</Label>
                            <Input value={form.description} required onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="OPC 53 Grade Cement" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd} disabled={saving || !form.itemName}>
                            {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─── DPR Tab ───────────────────────────────────────────────────────────────────
function DPRTab({ project, canEdit }) {
    const [dprs, setDprs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ date: "", workDone: "", manpower: "", remarks: "" });

    const fetchDPRs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await projectApi.getDPR(project._id);
            const list = res?.data?.data?.dprs ?? res?.data?.data ?? [];
            setDprs(Array.isArray(list) ? list : []);
        } catch {
            setDprs([]);
        } finally {
            setLoading(false);
        }
    }, [project._id]);

    useEffect(() => { fetchDPRs(); }, [fetchDPRs]);

    const handleCreate = async () => {
        if (!form.date) return;
        setSaving(true);
        try {
            await projectApi.createDPR(project._id, form);
            toast.success("DPR submitted");
            setOpen(false);
            setForm({ date: "", workDone: "", manpower: "", remarks: "" });
            fetchDPRs();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to submit DPR");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{dprs.length} report{dprs.length !== 1 ? "s" : ""}</p>
                {canEdit && (
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="h-3 w-3 mr-1" /> Add DPR
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            ) : dprs.length === 0 ? (
                <EmptyCard title="No daily reports" description="Submit daily progress reports to track site activity." />
            ) : (
                <div className="space-y-2">
                    {dprs.map((d, i) => (
                        <Card key={d._id ?? i}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-sm">{formatDate(d.date)}</p>
                                    {d.manpower && (
                                        <Badge variant="muted" className="text-xs">
                                            <Users className="h-3 w-3 mr-1" />{d.manpower} workers
                                        </Badge>
                                    )}
                                </div>
                                {d.workDone && <p className="text-sm text-muted-foreground">{d.workDone}</p>}
                                {d.remarks && <p className="text-xs text-muted-foreground mt-1 italic">{d.remarks}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Add Daily Progress Report</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label>Date <span className="text-destructive">*</span></Label>
                            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Work Done</Label>
                            <Textarea rows={3} value={form.workDone} onChange={(e) => setForm({ ...form, workDone: e.target.value })} placeholder="Describe today's work…" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Manpower</Label>
                            <Input type="number" value={form.manpower} onChange={(e) => setForm({ ...form, manpower: e.target.value })} placeholder="Number of workers" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Remarks</Label>
                            <Input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={saving || !form.date}>
                            {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─── Activity Tab ──────────────────────────────────────────────────────────────
function ActivityTab({ project }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await projectApi.getActivity(project._id);
                const list = res?.data?.data?.activities ?? res?.data?.data ?? [];
                setActivities(Array.isArray(list) ? list : []);
            } catch {
                setActivities([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [project._id]);

    return (
        <div className="space-y-3">
            {loading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : activities.length === 0 ? (
                <EmptyCard title="No activity yet" description="Actions on this project will appear here." />
            ) : (
                <div className="relative pl-4">
                    <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
                    {activities.map((a, i) => (
                        <div key={a._id ?? i} className="relative flex gap-3 pb-4">
                            <div className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm">{a.action ?? a.description}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {a.user?.name ?? "System"} · {formatDate(a.createdAt ?? a.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


// ─── Issues Tab ─────────────────────────────────────────────────────────────────
function IssuesTab({ project, canEdit, fetchProject }) {
    const [loading, setLoading] = useState(false);

    const issues = project?.issues || [];

    const handleResolve = async (issueId) => {
        setLoading(true);
        try {
            const res = await projectApi.resolveIssue(project._id, issueId, { resolved: true });
            if (res.data.status) {
                await fetchProject(false);
                toast.success("Issue resolved");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to resolve issue");
        } finally {
            setLoading(false);
        }
    };

    const severityVariant = { low: "muted", medium: "warning", high: "destructive" };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{issues.length} issue{issues.length !== 1 ? "s" : ""}</p>
                {/* {canEdit && (
                    <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
                        <AlertCircle className="h-3 w-3 mr-1" /> Report Issue
                    </Button>
                )} */}
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
            ) : issues.length === 0 ? (
                <EmptyCard title="No issues reported" description="Site issues will appear here once reported." />
            ) : (
                <div className="space-y-2">
                    {project?.issues.map((issue, i) => {
                        const isResolved = issue.status === "resolved";

                        return (
                            <Card key={issue._id ?? i} className={isResolved ? "opacity-60" : ""}>
                                <CardContent className="p-4 flex items-start gap-3">

                                    <AlertCircle
                                        className={`h-4 w-4 mt-0.5 shrink-0 ${isResolved ? "text-muted-foreground" : "text-destructive"
                                            }`}
                                    />

                                    <div className="flex-1 min-w-0">

                                        {/* HEADER */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium">
                                                {issue.title || "Untitled Issue"}
                                            </p>

                                            <Badge
                                                variant={severityVariant[issue.severity] ?? "muted"}
                                                className="text-xs"
                                            >
                                                {issue.severity || "low"}
                                            </Badge>

                                            {isResolved && (
                                                <Badge variant="success" className="text-xs">
                                                    Resolved
                                                </Badge>
                                            )}
                                        </div>

                                        {/* DESCRIPTION */}
                                        {issue.description && (
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {issue.description}
                                            </p>
                                        )}

                                        {/* RESOLUTION INFO */}
                                        {isResolved && (
                                            <div className="mt-2 text-xs text-green-600">
                                                <p><strong>Resolution:</strong> {issue.resolution}</p>
                                                {issue.resolvedAt && (
                                                    <p className="text-muted-foreground">
                                                        Resolved on: {new Date(issue.resolvedAt).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* ACTION BUTTON */}
                                    {canEdit && !isResolved && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleResolve(issue._id)}
                                            disabled={loading}>
                                            {loading && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Resolve
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Report Issue</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label>Title <span className="text-destructive">*</span></Label>
                            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Foundation crack detected" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Severity</Label>
                            <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description</Label>
                            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReport} disabled={saving || !form.title}>
                            {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </div>
    );
}

// ─── Risk Tab ───────────────────────────────────────────────────────────────────
function RisksTab({ project, canEdit, fetchProject }) {
    const risks = project?.risks || [];

    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        impact: "medium",
        probability: "medium",
        mitigationPlan: "",
        owner: "",
    });

    const impactVariant = {
        low: "muted",
        medium: "warning",
        high: "destructive",
    };

    const probabilityVariant = {
        low: "muted",
        medium: "secondary",
        high: "destructive",
    };


    const handleAddRisk = async () => {
        if (!form.title) {
            setError("Risk title is required");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const res = await projectApi.addRisk(project._id, form);

            if (res?.data?.success) {
                await fetchProject(false);
                toast.success("Risk added");

                setOpen(false);
                setForm({
                    title: "",
                    description: "",
                    impact: "medium",
                    probability: "medium",
                    mitigationPlan: "",
                    owner: "",
                });
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to add risk");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {risks.length} risk{risks.length !== 1 ? "s" : ""}
                </p>

                {canEdit && (
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="h-3 w-3 mr-1" /> Add Risk
                    </Button>
                )}
            </div>

            {risks.length === 0 ? (
                <EmptyCard
                    title="No risks added"
                    description="Project risks will appear here once added."
                />
            ) : (
                <div className="space-y-2">
                    {risks.map((risk, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 flex items-start gap-3">

                                <Shield className="h-4 w-4 mt-1 text-yellow-500" />

                                <div className="flex-1 min-w-0">

                                    {/* HEADER */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium">
                                            {risk.title || "Untitled Risk"}
                                        </p>

                                        <Badge
                                            variant={impactVariant[risk.impact] || "muted"}
                                            className="text-xs"
                                        >
                                            Impact: {risk.impact}
                                        </Badge>

                                        <Badge
                                            variant={probabilityVariant[risk.probability] || "muted"}
                                            className="text-xs"
                                        >
                                            Probability: {risk.probability}
                                        </Badge>
                                    </div>

                                    {/* DESCRIPTION */}
                                    {risk.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {risk.description}
                                        </p>
                                    )}

                                    {/* MITIGATION */}
                                    {risk.mitigationPlan && (
                                        <div className="mt-2 text-xs text-blue-600">
                                            <strong>Mitigation:</strong> {risk.mitigationPlan}
                                        </div>
                                    )}

                                    {/* STATUS */}
                                    <div className="mt-2">
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {risk.status || "identified"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}




            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Risk</DialogTitle>
                    </DialogHeader>

                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">

                        {/* TITLE */}
                        <div className="space-y-1.5">
                            <Label>Title *</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Material delay risk"
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-1.5">
                            <Label>Description</Label>
                            <Textarea
                                rows={2}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        {/* IMPACT */}
                        <div className="space-y-1.5">
                            <Label>Impact</Label>
                            <select
                                className="w-full border rounded-md px-2 py-2 text-sm"
                                value={form.impact}
                                onChange={(e) => setForm({ ...form, impact: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {/* PROBABILITY */}
                        <div className="space-y-1.5">
                            <Label>Probability</Label>
                            <select
                                className="w-full border rounded-md px-2 py-2 text-sm"
                                value={form.probability}
                                onChange={(e) => setForm({ ...form, probability: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {/* MITIGATION */}
                        <div className="space-y-1.5">
                            <Label>Mitigation Plan</Label>
                            <Textarea
                                rows={2}
                                value={form.mitigationPlan}
                                onChange={(e) => setForm({ ...form, mitigationPlan: e.target.value })}
                            />
                        </div>

                        {/* OWNER */}
                        <div className="space-y-1.5">
                            <Label>Owner</Label>
                            <select
                                className="w-full border rounded-md px-2 py-2 text-sm"
                                value={form.owner}
                                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                            >
                                <option value="">Select team member</option>

                                {project.teamMembers?.map((member) => (
                                    <option key={member._id} value={member._id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>

                        <Button onClick={handleAddRisk} disabled={saving}>
                            {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Add Risk
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


function MaterialRequestTab({ project, canEdit }) {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        quantity: "",
        unit: "",
        requiredByDate: "",
        priority: "medium",
        deliveryLocation: "",
    });

    // ─── Fetch Requests ─────────────────────────
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await projectApi.getMaterialRequests(project._id);
            if (res?.data.success) {
                setList(res?.data?.data || []);
            }
        } catch {
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // ─── Create Request ─────────────────────────
    const handleCreate = async () => {
        if (!form.title || !form.quantity || !form.unit || !form.requiredByDate) {
            setError("Required fields missing");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const res = await projectApi.createMaterialRequest(project._id, {
                ...form,
                quantity: Number(form.quantity),
            });

            if (res.data?.success) {
                await fetchRequests();
                toast.success("Material request created");
                setOpen(false);

                setForm({
                    title: "",
                    description: "",
                    quantity: "",
                    unit: "",
                    requiredByDate: "",
                    priority: "medium",
                    deliveryLocation: "",
                });
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create");
        } finally {
            setSaving(false);
        }
    };

    const statusColor = {
        pending: "secondary",
        approved: "success",
        rejected: "destructive",
        delivered: "outline",
    };

    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {list.length} request{list.length !== 1 ? "s" : ""}
                </p>

                {canEdit && (
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="h-3 w-3 mr-1" />
                        New Request
                    </Button>
                )}
            </div>

            {/* LIST */}
            {loading ? (
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
            ) : list.length === 0 ? (
                <EmptyCard
                    title="No material requests"
                    description="Create requests to manage materials."
                />
            ) : (
                <div className="space-y-2">
                    {list.map((item) => (
                        <Card key={item._id}>
                            <CardContent className="p-4 flex justify-between items-start">

                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.description}
                                    </p>

                                    <p className="text-xs mt-1">
                                        {item.quantity} {item.unit}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Required by: {item.requiredByDate}
                                    </p>
                                </div>

                                <div className="text-right space-y-2">
                                    <Badge variant={statusColor[item.status]}>
                                        {item.status}
                                    </Badge>

                                    <Badge variant="outline">
                                        {item.priority}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create Material Request</DialogTitle>
                    </DialogHeader>

                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">

                        <Input
                            placeholder="Title *"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Quantity *"
                            type="number"
                            value={form.quantity}
                            onChange={(e) =>
                                setForm({ ...form, quantity: e.target.value })
                            }
                        />

                        <Input
                            placeholder="Unit (bags, kg)"
                            value={form.unit}
                            onChange={(e) =>
                                setForm({ ...form, unit: e.target.value })
                            }
                        />

                        <Input
                            type="date"
                            value={form.requiredByDate}
                            onChange={(e) =>
                                setForm({ ...form, requiredByDate: e.target.value })
                            }
                        />

                        <Select
                            value={form.priority}
                            onValueChange={(val) =>
                                setForm({ ...form, priority: val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Delivery Location"
                            value={form.deliveryLocation}
                            onChange={(e) =>
                                setForm({ ...form, deliveryLocation: e.target.value })
                            }
                        />

                        <div className="col-span-2">
                            <Textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>

                        <Button onClick={handleCreate} disabled={saving}>
                            {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


// ─── Shared empty state ─────────────────────────────────────────────────────────
function EmptyCard({ title, description }) {
    return (
        <Card>
            <CardContent className="p-8 text-center">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}

// ─── Main ProjectDetail Page ────────────────────────────────────────────────────
export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { current } = useAuthStore();
    const canEdit = canMutate(current?.role, "projects");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProject = useCallback(async (loadingTrue = true) => {
        if (loadingTrue) setLoading(true);
        try {
            const res = await projectApi.getById(id);
            const data = res?.data?.data
            setData(data);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load project");
            navigate("/projects");
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => { fetchProject(); }, [fetchProject]);




    if (loading) {
        return (
            <div className="space-y-5">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-5 sm:space-y-6">
            {/* Back + Header */}
            <div>
                <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate("/projects")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
                </Button>
                <div className="flex flex-wrap items-start gap-3 justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold">{data?.project.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />{data?.project.location}
                            </span>
                            <Badge variant={STATUS[data?.project.status]?.variant}>
                                {STATUS[data?.project.status]?.label ?? data?.project.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{data?.project.priority} priority</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview">
                <TabsList className="overflow-x-auto">
                    <TabsTrigger value="overview" className="flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Overview</TabsTrigger>
                    <TabsTrigger value="milestones" className="flex items-center gap-1.5"><Flag className="h-3.5 w-3.5" />Milestones</TabsTrigger>
                    <TabsTrigger value="boq" className="flex items-center gap-1.5"><ClipboardList className="h-3.5 w-3.5" />BOQ</TabsTrigger>
                    {/* <TabsTrigger value="dpr" className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />DPR</TabsTrigger> */}
                    <TabsTrigger value="issues" className="flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" />Issues</TabsTrigger>
                    <TabsTrigger value="risks" className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Risks</TabsTrigger>
                    <TabsTrigger value="materials" className="flex items-center gap-1.5"><ClipboardList className="h-3.5 w-3.5" />Materials</TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" />Activity</TabsTrigger>
                </TabsList>

                <div className="mt-5">
                    <TabsContent value="overview">
                        <OverviewTab
                            project={data?.project}
                            comments={data?.comments}
                            canEdit={canEdit}
                            onProgressUpdate={(val) => setData((prev) => ({ ...prev, project: { ...prev.project, progress: val } }))}
                            fetchProject={fetchProject}
                        />
                    </TabsContent>
                    <TabsContent value="milestones">
                        <MilestonesTab
                            project={data?.project}
                            milestones={data?.milestones}
                            canEdit={canEdit}
                            fetchProject={fetchProject}
                        />
                    </TabsContent>
                    <TabsContent value="boq">
                        <BOQTab project={data?.project} boq={data?.boq} canEdit={canEdit} fetchProject={fetchProject} />
                    </TabsContent>
                    <TabsContent value="dpr">
                        <DPRTab project={data?.project?.dependencies} canEdit={canEdit} />
                    </TabsContent>
                    <TabsContent value="issues">
                        <IssuesTab project={data?.project} canEdit={canEdit} fetchProject={fetchProject} />
                    </TabsContent>
                    <TabsContent value="risks">
                        <RisksTab
                            project={data?.project}
                            canEdit={canEdit}
                            fetchProject={fetchProject}
                        />
                    </TabsContent>
                    <TabsContent value="materials">
                        <MaterialRequestTab
                            project={data?.project}
                            canEdit={canEdit}
                        />
                    </TabsContent>
                    <TabsContent value="activity">
                        <ActivityTab project={data?.project} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
