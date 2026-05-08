import React, { useMemo } from "react";
import { ArrowUpRight, Briefcase, AlertTriangle, Wallet, Users2, FolderKanban, TrendingUp, ShoppingCart, Boxes } from "lucide-react";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/authStore";
import {
    useProjectsStore, useProcurementStore, useFinanceStore, useInventoryStore, useSiteStore,
} from "@/store/dataStore";
import { formatINR } from "@/lib/helpers";
import { ROLES } from "@/data/permissions";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const cashflow = [
    {
        m: "Aug", inflow: 64, outflow: 51
    }, { m: "Sep", inflow: 72, outflow: 58 },
    {
        m: "Oct", inflow: 81, outflow: 64
    }, { m: "Nov", inflow: 76, outflow: 69 },
    { m: "Dec", inflow: 92, outflow: 71 }, { m: "Jan", inflow: 88, outflow: 74 },
];
const matMix = [
    {
        name: "Steel", v: 38, c: "var(--color-chart-1)"
    },
    {
        name: "Cement", v: 24, c: "var(--color-chart-2)"
    },
    {
        name: "Aggregates", v: 14, c: "var(--color-chart-3)"
    },
    {
        name: "MEP", v: 16, c: "var(--color-chart-4)"
    },
    { name: "Finishing", v: 8, c: "var(--color-chart-5)" },
];

export default function Dashboard() {
    const { current } = useAuthStore();
    const projects = useProjectsStore((s) => s.projects);
    const orders = useProcurementStore((s) => s.orders);
    const invoices = useFinanceStore((s) => s.invoices);
    const items = useInventoryStore((s) => s.items);
    const reports = useSiteStore((s) => s.reports);

    const stats = useMemo(() => {
        const active = projects.filter((p) => p.status === "in_progress").length;
        const delayed = projects.filter((p) => p.status === "delayed").length;
        const budget = projects.reduce((a, p) => a + p.budget, 0);
        const spent = projects.reduce((a, p) => a + p.spent, 0);
        const lowStock = items.filter((i) => i.stock <= i.reorder).length;
        const overdue = invoices.filter((i) => i.status === "overdue").length;
        return { active, delayed, budget, spent, lowStock, overdue };
    }, [projects, items, invoices]);

    return (
        <div className="space-y-8">
            < PageHeader
                eyebrow={`Welcome, ${ROLES[current.role]}`
                }
                title={`Hello ${current.name.split(" ")[0]} — here's the pulse today.`}
                description="Real-time visibility across active projects, sites, procurement and cash."
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                < StatCard label="Active Projects" value={stats.active} delta={`${projects.length} total`} icon={FolderKanban} />
                < StatCard label="Delayed" value={stats.delayed} delta={stats.delayed ? "Needs attention" : "On track"} deltaTone={stats.delayed ? "down" : "up"} icon={AlertTriangle} accent="warning" />
                < StatCard label="Budget Utilisation" value={`${Math.round((stats.spent / stats.budget) * 100)}%`} delta={`${formatINR(stats.spent)} of ${formatINR(stats.budget)}`} icon={Wallet} accent="success" />
                < StatCard label="Overdue Invoices" value={stats.overdue} delta={stats.overdue ? "Follow-ups required" : "All current"} deltaTone={stats.overdue ? "down" : "up"} icon={TrendingUp} accent="primary" />
            </div >

            <div className="grid lg:grid-cols-3 gap-5">
                < Card className="lg:col-span-2">
                    < CardHeader className="flex-row items-center justify-between">
                        < div >
                            <CardTitle>Cashflow — last 6 months</CardTitle>
                            <CardDescription>Inflow vs outflow in ₹ Cr</CardDescription>
                        </div >
                        <Badge variant="outline" className="gap-1"><ArrowUpRight className="h-3 w-3" /> +18% YoY</Badge>
                    </CardHeader >
                    <CardContent>
                        <div className="h-[260px]">
                            <ResponsiveContainer>
                                <AreaChart data={cashflow} margin={{ left: 0, right: 8, top: 8 }}>
                                    <defs>
                                        <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity={0.18} />
                                            <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                    <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                                    <Area type="monotone" dataKey="outflow" stroke="var(--color-foreground)" strokeOpacity={0.55} fill="url(#gOut)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="inflow" stroke="var(--color-primary)" fill="url(#gIn)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer >
                        </div >
                    </CardContent >
                </Card >

                <Card>
                    <CardHeader>
                        <CardTitle>Material consumption mix</CardTitle>
                        <CardDescription>Across active sites</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[260px]">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={matMix} dataKey="v" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={2}>
                                        {matMix.map((e, i) => <Cell key={i} fill={e.c} />)}
                                    </Pie>
                                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent >
                </Card >
            </div >

            <div className="grid lg:grid-cols-2 gap-5">
                < Card >
                    <CardHeader className="flex-row items-center justify-between">
                        < div >
                            <CardTitle>Active projects</CardTitle>
                            <CardDescription>Progress vs schedule</CardDescription>
                        </div >
                        <Badge variant="muted">{projects.filter(p => p.status === "in_progress").length} live</Badge>
                    </CardHeader >
                    <CardContent className="space-y-5">
                        {
                            projects.filter((p) => p.status !== "completed").slice(0, 4).map((p) => (
                                < div key={p.id} className="space-y-2" data-testid={`dash-project-${p.code}`}>
                                    < div className="flex items-baseline justify-between gap-3">
                                        < div className="min-w-0">
                                            < div className="text-sm font-medium truncate">{p.name}</div>
                                            < div className="text-xs text-muted-foreground">{p.code} · {p.location}</div>
                                        </div >
                                        <div className="text-sm font-medium tabular-nums">{p.progress}%</div>
                                    </div >
                                    <Progress value={p.progress} indicatorClassName={p.status === "delayed" ? "bg-destructive" : p.progress > 70 ? "bg-[color:var(--color-success)]" : "bg-primary"} />
                                </div >
                            ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Latest from sites</CardTitle>
                            <CardDescription>Daily progress reports</CardDescription>
                        </div>
                        <Badge variant="outline">{reports.length} entries</Badge>
                    </CardHeader>
                    <CardContent className="divide-y divide-border">
                        {reports.slice(0, 4).map((r) => {
                            const project = projects.find(p => p.id === r.projectId);
                            return (
                                <div key={r.id} className="py-3 first:pt-0 last:pb-0">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="font-medium truncate">{project?.name}</div>
                                        <span className="text-xs text-muted-foreground">{r.date}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{r.milestone}</div>
                                    <div className="flex gap-2 mt-1.5 text-[11px] text-muted-foreground">
                                        <span>👷 {r.manpower} workers</span>
                                        <span>·</span>
                                        <span>📷 {r.photos} photos</span>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}