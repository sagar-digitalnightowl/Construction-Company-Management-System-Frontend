import React, { useMemo, useState, useEffect, useRef } from "react";
import {
	ArrowUpRight, AlertTriangle, Wallet, Users2, FolderKanban,
	TrendingUp, Boxes, X
} from "lucide-react";
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
	PieChart, Pie, Cell, Legend,
} from "recharts";

const cashflow = [
	{ m: "Aug", inflow: 64, outflow: 51 },
	{ m: "Sep", inflow: 72, outflow: 58 },
	{ m: "Oct", inflow: 81, outflow: 64 },
	{ m: "Nov", inflow: 76, outflow: 69 },
	{ m: "Dec", inflow: 92, outflow: 71 },
	{ m: "Jan", inflow: 88, outflow: 74 },
];

const matMix = [
	{ name: "Steel", v: 38, c: "var(--color-chart-1)" },
	{ name: "Cement", v: 24, c: "var(--color-chart-2)" },
	{ name: "Aggregates", v: 14, c: "var(--color-chart-3)" },
	{ name: "MEP", v: 16, c: "var(--color-chart-4)" },
	{ name: "Finishing", v: 8, c: "var(--color-chart-5)" },
];

// --- Custom Tooltip Components ---

const CustomAreaTooltip = ({ active, payload, label }) => {
	const [closed, setClosed] = useState(false);
	const prevLabel = useRef(label);

	// Re-open if the user taps a different data point
	useEffect(() => {
		if (label !== prevLabel.current) {
			setClosed(false);
			prevLabel.current = label;
		}
	}, [label]);

	// Handle clicks outside the chart to close the tooltip
	useEffect(() => {
		if (!active || closed) return;
		const handleClickOutside = (e) => {
			if (!e.target.closest('.recharts-tooltip-wrapper') && !e.target.closest('.recharts-surface')) {
				setClosed(true);
			}
		};
		// Small delay prevents the trigger click from instantly closing it
		const timer1 = setTimeout(() => document.addEventListener('touchstart', handleClickOutside), 10);
		const timer2 = setTimeout(() => document.addEventListener('click', handleClickOutside), 10);
		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			document.removeEventListener('touchstart', handleClickOutside);
			document.removeEventListener('click', handleClickOutside);
		};
	}, [active, closed]);

	if (!active || !payload?.length || closed) return null;

	const inflow = payload.find((item) => item.dataKey === "inflow");
	const outflow = payload.find((item) => item.dataKey === "outflow");

	return (
		<div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-md px-4 py-3 shadow-xl touch-none pointer-events-auto">
			<div className="mb-3 flex items-center justify-between gap-6">
				<span className="text-sm font-semibold text-foreground">{label}</span>
				<button
					onClick={(e) => { e.stopPropagation(); setClosed(true); }}
					className="-mr-1 -mt-1 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
					aria-label="Close tooltip"
				>
					<X className="h-3.5 w-3.5" />
				</button>
			</div>
			<div className="space-y-2.5">
				{inflow && (
					<div className="flex items-center justify-between gap-8">
						<div className="flex items-center gap-2.5">
							<span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
							<span className="text-[13px] font-medium text-muted-foreground">Inflow</span>
						</div>
						<span className="text-[13px] font-mono font-bold text-foreground">₹{inflow.value} Cr</span>
					</div>
				)}
				{outflow && (
					<div className="flex items-center justify-between gap-8">
						<div className="flex items-center gap-2.5">
							<span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--color-foreground)" }} />
							<span className="text-[13px] font-medium text-muted-foreground">Outflow</span>
						</div>
						<span className="text-[13px] font-mono font-bold text-foreground">₹{outflow.value} Cr</span>
					</div>
				)}
			</div>
		</div>
	);
};

const CustomPieTooltip = ({ active, payload }) => {
	const [closed, setClosed] = useState(false);
	const name = payload?.[0]?.name;
	const prevName = useRef(name);

	useEffect(() => {
		if (name !== prevName.current) {
			setClosed(false);
			prevName.current = name;
		}
	}, [name]);

	useEffect(() => {
		if (!active || closed) return;
		const handleClickOutside = (e) => {
			if (!e.target.closest('.recharts-tooltip-wrapper') && !e.target.closest('.recharts-surface')) {
				setClosed(true);
			}
		};
		const timer1 = setTimeout(() => document.addEventListener('touchstart', handleClickOutside), 10);
		const timer2 = setTimeout(() => document.addEventListener('click', handleClickOutside), 10);
		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			document.removeEventListener('touchstart', handleClickOutside);
			document.removeEventListener('click', handleClickOutside);
		};
	}, [active, closed]);

	if (!active || !payload?.length || closed) return null;

	const item = payload[0];
	return (
		<div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-md px-4 py-3 shadow-xl touch-none pointer-events-auto">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-2.5">
					<span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.payload.c }} />
					<span className="text-[13px] font-medium text-muted-foreground">{name}</span>
				</div>
				<button
					onClick={(e) => { e.stopPropagation(); setClosed(true); }}
					className="-mr-1 -mt-1 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
					aria-label="Close tooltip"
				>
					<X className="h-3.5 w-3.5" />
				</button>
			</div>
			<div className="mt-2 text-base font-mono font-bold text-foreground">
				{item.value}%
			</div>
		</div>
	);
};

// --- Main Dashboard Component ---

export default function Dashboard() {
	const { current } = useAuthStore();
	const projects = useProjectsStore((s) => s.projects);
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
		<div className="space-y-6 md:space-y-8">
			<PageHeader
				eyebrow={`Welcome, ${ROLES[current.role]}`}
				title={`Hello ${current.name.split(" ")[0]} — here's the pulse today.`}
				description="Real-time visibility across active projects, sites, procurement and cash."
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
				<StatCard size="compact" label="Active Projects" value={stats.active} delta={`${projects.length} total`} icon={FolderKanban} />
				<StatCard size="compact" label="Delayed" value={stats.delayed} delta={stats.delayed ? "Needs attention" : "On track"} deltaTone={stats.delayed ? "down" : "up"} icon={AlertTriangle} accent="warning" />
				<StatCard size="compact" label="Budget Utilisation" value={`${Math.round((stats.spent / stats.budget) * 100)}%`} delta={`${formatINR(stats.spent)} of ${formatINR(stats.budget)}`} icon={Wallet} accent="success" />
				<StatCard size="compact" label="Overdue Invoices" value={stats.overdue} delta={stats.overdue ? "Follow-ups required" : "All current"} deltaTone={stats.overdue ? "down" : "up"} icon={TrendingUp} accent="primary" />
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardHeader className="flex-row items-center justify-between border-b border-border/40 pb-4">
						<div>
							<CardTitle className="font-display text-sm uppercase tracking-wider text-foreground">Cashflow — Last 6 Months</CardTitle>
							<CardDescription className="mt-1">Inflow vs outflow in ₹ Cr</CardDescription>
						</div>
						<Badge variant="secondary" className="gap-1 font-mono text-[11px]"><ArrowUpRight className="h-3 w-3" /> +18% YoY</Badge>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="h-[260px]">
							<ResponsiveContainer>
								<AreaChart data={cashflow} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
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
									<CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.15} vertical={false} />
									<XAxis dataKey="m" stroke="currentColor" strokeOpacity={0.5} fontSize={11} tickLine={false} axisLine={false} tickMargin={10} style={{ fontFamily: "var(--font-mono, monospace)" }} />
									<YAxis stroke="currentColor" strokeOpacity={0.5} fontSize={11} tickLine={false} axisLine={false} tickMargin={10} style={{ fontFamily: "var(--font-mono, monospace)" }} />

									<Tooltip
										trigger="click"
										content={<CustomAreaTooltip />}
										wrapperStyle={{ pointerEvents: 'auto' }} // Allows the 'X' button to be clicked
										cursor={{ stroke: "var(--color-border)", strokeDasharray: "4 4" }}
									/>

									<Area type="monotone" dataKey="outflow" stroke="var(--color-foreground)" strokeOpacity={0.55} fill="url(#gOut)" strokeWidth={2} activeDot={{ r: 4, strokeWidth: 0 }} />
									<Area type="monotone" dataKey="inflow" stroke="var(--color-primary)" fill="url(#gIn)" strokeWidth={2} activeDot={{ r: 4, strokeWidth: 0 }} />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="border-b border-border/40 pb-4">
						<CardTitle className="font-display text-sm uppercase tracking-wider text-foreground">Material Consumption</CardTitle>
						<CardDescription className="mt-1">Across active sites</CardDescription>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="h-[260px]">
							<ResponsiveContainer>
								<PieChart>
									<Pie data={matMix} dataKey="v" nameKey="name" innerRadius={64} outerRadius={88} paddingAngle={2} stroke="none">
										{matMix.map((e, i) => <Cell key={i} fill={e.c} />)}
									</Pie>
									<Tooltip
										trigger="click"
										content={<CustomPieTooltip />}
										wrapperStyle={{ pointerEvents: 'auto' }} // Allows the 'X' button to be clicked
									/>
									<Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: "20px" }} />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader className="flex-row items-center justify-between border-b border-border/40 pb-4">
						<div>
							<CardTitle className="font-display text-sm uppercase tracking-wider text-foreground">Active Projects</CardTitle>
							<CardDescription className="mt-1">Progress vs schedule</CardDescription>
						</div>
						<Badge variant="secondary" className="font-mono text-[11px]">{projects.filter(p => p.status === "in_progress").length} LIVE</Badge>
					</CardHeader>
					<CardContent className="pt-6 space-y-5">
						{
							projects.filter((p) => p.status !== "completed").slice(0, 4).map((p) => (
								<div key={p.id} className="space-y-2.5" data-testid={`dash-project-${p.code}`}>
									<div className="flex items-baseline justify-between gap-3">
										<div className="min-w-0">
											<div className="text-sm font-medium text-foreground truncate">{p.name}</div>
											<div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">{p.code} <span className="opacity-50 mx-1">/</span> {p.location}</div>
										</div>
										<div className="text-sm font-mono font-medium text-foreground">{p.progress}%</div>
									</div>
									<Progress value={p.progress} indicatorClassName={p.status === "delayed" ? "bg-destructive" : p.progress > 70 ? "bg-success" : "bg-primary"} />
								</div>
							))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex-row items-center justify-between border-b border-border/40 pb-4">
						<div>
							<CardTitle className="font-display text-sm uppercase tracking-wider text-foreground">Latest From Sites</CardTitle>
							<CardDescription className="mt-1">Daily progress reports</CardDescription>
						</div>
						<Badge variant="outline" className="font-mono text-[11px]">{reports.length} ENTRIES</Badge>
					</CardHeader>
					<CardContent className="pt-2 divide-y divide-border/60">
						{reports.slice(0, 4).map((r) => {
							const project = projects.find(p => p.id === r.projectId);
							return (
								<div key={r.id} className="py-3.5 first:pt-4 last:pb-2">
									<div className="flex items-center justify-between text-sm">
										<div className="font-medium text-foreground truncate">{project?.name}</div>
										<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{r.date}</span>
									</div>
									<div className="text-sm text-muted-foreground mt-1">{r.milestone}</div>
									<div className="flex gap-3 mt-2 text-[11px] font-mono text-muted-foreground">
										<span className="flex items-center gap-1.5"><Users2 className="h-3 w-3" /> {r.manpower} workers</span>
										<span className="flex items-center gap-1.5"><Boxes className="h-3 w-3" /> {r.photos} photos</span>
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