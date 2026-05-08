import React from "react";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectsStore, useFinanceStore, useProcurementStore } from "@/store/dataStore";
import { formatINR } from "@/lib/helpers";
import { TrendingUp, BarChart3, Activity, Briefcase } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const monthly = [
    {
        m: "Aug", revenue: 64, profit: 12
    }, { m: "Sep", revenue: 72, profit: 15 },
    {
        m: "Oct", revenue: 81, profit: 18
    }, { m: "Nov", revenue: 76, profit: 14 },
    { m: "Dec", revenue: 92, profit: 21 }, { m: "Jan", revenue: 88, profit: 17 },
];
const procurementTrend = [
    { m: "Aug", v: 22 }, { m: "Sep", v: 28 }, { m: "Oct", v: 35 }, { m: "Nov", v: 31 }, { m: "Dec", v: 42 }, { m: "Jan", v: 38 },
];

export default function Reports() {
    const projects = useProjectsStore(s => s.projects);
    const invoices = useFinanceStore(s => s.invoices);
    const orders = useProcurementStore(s => s.orders);

    const budgetUtil = Math.round((projects.reduce((a, p) => a + p.spent, 0) / projects.reduce((a, p) => a + p.budget, 0)) * 100);
    const onTime = Math.round((projects.filter(p => p.status !== "delayed").length / projects.length) * 100);

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Insights" title="Reports & Analytics" description="Operational and financial KPIs across the construction portfolio." />

            < div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                < StatCard label="Portfolio Revenue (Q)" value={formatINR(220000000)} delta="+18% YoY" deltaTone="up" icon={TrendingUp} accent="success" />
                < StatCard label="Net Margin" value="14.6%" delta="+1.8 pts" deltaTone="up" icon={Activity} />
                < StatCard label="Budget Utilisation" value={`${budgetUtil}%`} icon={BarChart3} accent="warning" />
                < StatCard label="Projects on Schedule" value={`${onTime}%`} delta={`${projects.length} active`} deltaTone="up" icon={Briefcase} accent="primary" />
            </div >

            <Tabs defaultValue="financial">
                < TabsList >
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    < TabsTrigger value="operational">Operational</TabsTrigger>
                    < TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList >

                <TabsContent value="financial" className="space-y-5">
                    < div className="grid lg:grid-cols-3 gap-5">
                        < Card className="lg:col-span-2">
                            < CardHeader ><CardTitle>Revenue vs Net Profit</CardTitle><CardDescription>₹ Cr</CardDescription></CardHeader >
                            <CardContent>
                                <div className="h-[280px]">
                                    <ResponsiveContainer>
                                        <BarChart data={monthly}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                            <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                                            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                                            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                                            <Bar dataKey="revenue" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                                            <Bar dataKey="profit" fill="var(--color-foreground)" fillOpacity={0.6} radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent >
                        </Card >
                        <Card>
                            <CardHeader><CardTitle>Receivables status</CardTitle><CardDescription>By value (₹)</CardDescription></CardHeader>
                            <CardContent className="space-y-3">
                                {["paid", "sent", "overdue", "draft"].map(s => {
                                    const total = invoices.filter(i => i.status === s).reduce((a, i) => a + i.total, 0);
                                    const max = invoices.reduce((a, i) => a + i.total, 0) || 1;
                                    return (
                                        <div key={s}>
                                            <div className="flex justify-between text-sm mb-1.5"><span className="capitalize">{s}</span><span className="font-medium tabular-nums">{formatINR(total)}</span></div >
                                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                < div className="h-full" style={{ width: `${(total / max) * 100}%`, background: s === "overdue" ? "var(--color-destructive)" : s === "paid" ? "var(--color-success)" : "var(--color-primary)" }} />
                                            </div >
                                        </div >
                                    );
                                })}
                            </CardContent >
                        </Card >
                    </div >
                </TabsContent >

                <TabsContent value="operational" className="space-y-5">
                    < div className="grid lg:grid-cols-2 gap-5">
                        < Card >
                            <CardHeader><CardTitle>Procurement spend trend</CardTitle><CardDescription>POs raised per month (₹ L)</CardDescription></CardHeader>
                            <CardContent>
                                <div className="h-[280px]">
                                    <ResponsiveContainer>
                                        <LineChart data={procurementTrend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                            <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                                            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                                            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                                            <Line type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--color-primary)" }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent >
                        </Card >
                        <Card>
                            <CardHeader><CardTitle>PO status mix</CardTitle><CardDescription>Live procurement</CardDescription></CardHeader>
                            <CardContent className="space-y-2">
                                {["draft", "in_review", "approved", "delivered"].map(s => {
                                    const c = orders.filter(o => o.status === s).length;
                                    return <div key={s} className="flex items-center justify-between p-3 rounded-md border border-border"><div className="text-sm capitalize">{s.replace("_", " ")}</div><Badge variant="outline">{c}</Badge></div>;
                                })}
                            </CardContent >
                        </Card >
                    </div >
                </TabsContent >

                <TabsContent value="portfolio">
                    <Card>
                        <CardHeader><CardTitle>Project health snapshot</CardTitle><CardDescription>Progress, budget burn, status</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            {
                                projects.map(p => {
                                    const burn = Math.round((p.spent / p.budget) * 100);
                                    return (
                                        <div key={p.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_120px] items-center gap-3 py-2 border-b border-border last:border-0">
                                            < div > <div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.code} · {p.location}</div></div>
                                            < div > <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Progress</div><div className="font-medium tabular-nums">{p.progress}%</div></div>
                                            < div > <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Budget burn</div><div className="font-medium tabular-nums">{burn}%</div></div>
                                            < Badge variant={
                                                p.status === "delayed" ? "destructive" : p.status === "completed" ? "success" : "outline"} className="justify-self-start md:justify-self-end capitalize">{p.status.replace("_", " ")}</Badge>
                                        </div>
                                    );
                                })}
                        </CardContent >
                    </Card >
                </TabsContent >
            </Tabs >
        </div >
    );
}