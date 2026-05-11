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
import { projectApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR, formatDate } from "@/lib/helpers";
import { STATUS } from "./Projects";

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
function OverviewTab({ project, onProgressUpdate, canEdit }) {
    const [progress, setProgress] = useState(project.progress ?? 0);
    const [saving, setSaving] = useState(false);

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Progress + Description */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Progress Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center justify-between">
                                Project Completion
                                {canEdit && (
                                    <Button
                                        size="sm"
                                        variant="outline"
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
                </div>

                {/* Right: Client + Address info */}
                <div className="space-y-4">
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
                            <div>
                                <p className="text-muted-foreground text-xs">Project Manager</p>
                                <p className="font-medium">{project.manager?.name ?? "—"}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-xs">Team Members</p>
                                <p className="font-medium">{project.teamMembers?.length ?? 0} assigned</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ─── Milestones Tab ────────────────────────────────────────────────────────────
function MilestonesTab({ project, canEdit }) {
    const milestones = project.milestones ?? [];
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", dueDate: "" });
    const [list, setList] = useState(milestones);

    const handleAdd = async () => {
        if (!form.name) return;
        setSaving(true);
        try {
            const res = await projectApi.addMilestone(project._id, form);
            const updated = res?.data?.data?.milestones ?? [...list, { ...form, _id: Date.now() }];
            setList(Array.isArray(updated) ? updated : list);
            toast.success("Milestone added");
            setOpen(false);
            setForm({ name: "", description: "", dueDate: "" });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add milestone");
        } finally {
            setSaving(false);
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
                                <div className={`mt-0.5 rounded-full p-1 ${m.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                                    <Check className="h-3 w-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{m.name}</p>
                                    {m.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground shrink-0">
                                    {m.dueDate ? formatDate(m.dueDate) : "No date"}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Add Milestone</DialogTitle></DialogHeader>
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
        </div>
    );
}

// ─── BOQ Tab ───────────────────────────────────────────────────────────────────
function BOQTab({ project, canEdit }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [list, setList] = useState(project.boq ?? []);
    const [form, setForm] = useState({
        itemName: "", description: "", quantity: "", unit: "", unitPrice: "", category: "",
    });

    const handleAdd = async () => {
        if (!form.itemName) return;
        setSaving(true);
        try {
            const res = await projectApi.addBOQ(project._id, {
                ...form,
                quantity: Number(form.quantity),
                unitPrice: Number(form.unitPrice),
            });
            const updated = res?.data?.data?.boq ?? [...list, { ...form, _id: Date.now() }];
            setList(Array.isArray(updated) ? updated : list);
            toast.success("BOQ item added");
            setOpen(false);
            setForm({ itemName: "", description: "", quantity: "", unit: "", unitPrice: "", category: "" });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to add BOQ item");
        } finally {
            setSaving(false);
        }
    };

    const total = list.reduce((sum, i) => sum + ((i.quantity ?? 0) * (i.unitPrice ?? 0)), 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {list.length} item{list.length !== 1 ? "s" : ""} · Total: <strong>{formatINR(total)}</strong>
                </p>
                {canEdit && (
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="h-3 w-3 mr-1" /> Add Item
                    </Button>
                )}
            </div>

            {list.length === 0 ? (
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
                                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, i) => (
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
                                    <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                                        {formatINR((item.quantity ?? 0) * (item.unitPrice ?? 0))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-muted/50 border-t">
                            <tr>
                                <td colSpan={5} className="px-4 py-2.5 text-right font-medium">Grand Total</td>
                                <td className="px-4 py-2.5 text-right font-semibold">{formatINR(total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Add Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>Add BOQ Item</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label>Item Name <span className="text-destructive">*</span></Label>
                            <Input value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} placeholder="Cement" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Category</Label>
                            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="cement" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Unit</Label>
                            <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="bags" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Quantity</Label>
                            <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Unit Price (₹)</Label>
                            <Input type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label>Description</Label>
                            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="OPC 53 Grade Cement" />
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

// ─── Issues Tab ────────────────────────────────────────────────────────────────
function IssuesTab({ project, canEdit }) {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", severity: "medium" });

    const fetchIssues = useCallback(async () => {
        setLoading(true);
        try {
            const res = await projectApi.getIssues(project._id);
            const list = res?.data?.data?.issues ?? res?.data?.data ?? [];
            setIssues(Array.isArray(list) ? list : []);
        } catch {
            setIssues([]);
        } finally {
            setLoading(false);
        }
    }, [project._id]);

    useEffect(() => { fetchIssues(); }, [fetchIssues]);

    const handleReport = async () => {
        if (!form.title) return;
        setSaving(true);
        try {
            await projectApi.reportIssue(project._id, form);
            toast.success("Issue reported");
            setOpen(false);
            setForm({ title: "", description: "", severity: "medium" });
            fetchIssues();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to report issue");
        } finally {
            setSaving(false);
        }
    };

    const handleResolve = async (issueId) => {
        try {
            await projectApi.resolveIssue(project._id, issueId, { resolved: true });
            toast.success("Issue resolved");
            fetchIssues();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to resolve issue");
        }
    };

    const severityVariant = { low: "muted", medium: "warning", high: "destructive" };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{issues.length} issue{issues.length !== 1 ? "s" : ""}</p>
                {canEdit && (
                    <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
                        <AlertCircle className="h-3 w-3 mr-1" /> Report Issue
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
            ) : issues.length === 0 ? (
                <EmptyCard title="No issues reported" description="Site issues will appear here once reported." />
            ) : (
                <div className="space-y-2">
                    {issues.map((issue, i) => (
                        <Card key={issue._id ?? i} className={issue.resolved ? "opacity-60" : ""}>
                            <CardContent className="p-4 flex items-start gap-3">
                                <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${issue.resolved ? "text-muted-foreground" : "text-destructive"}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{issue.title}</p>
                                        <Badge variant={severityVariant[issue.severity] ?? "muted"} className="text-xs">
                                            {issue.severity}
                                        </Badge>
                                        {issue.resolved && <Badge variant="success" className="text-xs">Resolved</Badge>}
                                    </div>
                                    {issue.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
                                    )}
                                </div>
                                {canEdit && !issue.resolved && (
                                    <Button size="sm" variant="outline" onClick={() => handleResolve(issue._id)}>
                                        Resolve
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
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
            </Dialog>
        </div>
    );
}

// ─── Shared empty state ────────────────────────────────────────────────────────
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

// ─── Main ProjectDetail Page ───────────────────────────────────────────────────
export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { current } = useAuthStore();
    const canEdit = canMutate(current?.role, "projects");

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProject = useCallback(async () => {
        setLoading(true);
        try {
            const res = await projectApi.getById(id);
            const data = res?.data?.data?.project ?? res?.data?.data ?? res?.data;
            setProject(data);
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

    if (!project) return null;

    return (
        <div className="space-y-5 sm:space-y-6">
            {/* Back + Header */}
            <div>
                <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate("/projects")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
                </Button>
                <div className="flex flex-wrap items-start gap-3 justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold">{project.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />{project.location}
                            </span>
                            <Badge variant={STATUS[project.status]?.variant}>
                                {STATUS[project.status]?.label ?? project.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{project.priority} priority</Badge>
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
                    <TabsTrigger value="dpr" className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />DPR</TabsTrigger>
                    <TabsTrigger value="issues" className="flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" />Issues</TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" />Activity</TabsTrigger>
                </TabsList>

                <div className="mt-5">
                    <TabsContent value="overview">
                        <OverviewTab
                            project={project}
                            canEdit={canEdit}
                            onProgressUpdate={(val) => setProject((p) => ({ ...p, progress: val }))}
                        />
                    </TabsContent>
                    <TabsContent value="milestones">
                        <MilestonesTab project={project} canEdit={canEdit} />
                    </TabsContent>
                    <TabsContent value="boq">
                        <BOQTab project={project} canEdit={canEdit} />
                    </TabsContent>
                    <TabsContent value="dpr">
                        <DPRTab project={project} canEdit={canEdit} />
                    </TabsContent>
                    <TabsContent value="issues">
                        <IssuesTab project={project} canEdit={canEdit} />
                    </TabsContent>
                    <TabsContent value="activity">
                        <ActivityTab project={project} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}