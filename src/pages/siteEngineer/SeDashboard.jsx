import React, { useEffect, useState } from "react";
import { AlertTriangle, Building2, Clock, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";
import { listActive, listFrom, unwrap, useAssignedProjects, projectName, StatusPill } from "./shared";

export default function SeDashboard() {
	const { current } = useAuthStore();
	const { projects, loading: projectsLoading } = useAssignedProjects();
	const [activeCheckIns, setActiveCheckIns] = useState([]);
	const [openIssues, setOpenIssues] = useState([]);
	// const [stock, setStock] = useState(null); // stock module not in the v2.7 flow

	useEffect(() => {
		let cancelled = false;
		Promise.allSettled([
			siteEngineerApi.getActiveCheckIns(),
			siteEngineerApi.listIssues({ status: "open", limit: 5 }),
			// siteEngineerApi.getStockDashboard(), // stock module not in the v2.7 flow
		]).then(([active, issues]) => {
			if (cancelled) return;
			if (active.status === "fulfilled") setActiveCheckIns(listActive(active.value));
			if (issues.status === "fulfilled") setOpenIssues(listFrom(issues.value, "issues"));
			// if (dash.status === "fulfilled") setStock(unwrap(dash.value));
		});
		return () => {
			cancelled = true;
		};
	}, []);

	const checkedIn = activeCheckIns.length > 0;
	// const lowStock = stock?.totals?.lowStockItemCount ?? 0;

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title={`Hello, ${current?.name?.split(" ")[0] || "there"}`}
				description="Your sites, today's check-in status and anything that needs attention."
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				<StatCard label="Check-in status" icon={Clock} size="compact" value={checkedIn ? "On site" : "Not checked in"} accent={checkedIn ? "success" : "neutral"} />
				<StatCard label="Assigned projects" icon={Building2} size="compact" value={projectsLoading ? "..." : projects.length} />
				<StatCard label="Open issues" icon={AlertTriangle} size="compact" value={openIssues.length} accent={openIssues.length ? "destructive" : "neutral"} />
				{/* <StatCard label="Low stock items" icon={Package} size="compact" value={stock ? lowStock : "..."} accent={lowStock ? "destructive" : "neutral"} /> */}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">My projects</CardTitle>
					</CardHeader>
					<CardContent className="pt-4 space-y-2">
						{!projectsLoading && projects.length === 0 && (
							<div className="text-sm text-muted-foreground">No projects assigned yet</div>
						)}
						{projects.map((p) => (
							<div
								key={p._id}
								className="flex items-center justify-between rounded-md border p-3 hover:bg-muted"
							>
								<span className="text-sm font-medium">{projectName(p)}</span>
								<span className="text-xs text-muted-foreground">{p.location || p.address || ""}</span>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Open issues</CardTitle>
					</CardHeader>
					<CardContent className="pt-4 space-y-3">
						{openIssues.length === 0 && <div className="text-sm text-muted-foreground">No open issues</div>}
						{openIssues.map((i) => (
							<div key={i._id} className="flex items-start justify-between gap-3 border-b last:border-0 pb-3 last:pb-0">
								<div className="min-w-0">
									<div className="text-sm font-medium truncate">{i.title}</div>
									<div className="text-xs text-muted-foreground">
										{formatDate(i.createdAt)} · {i.category}
									</div>
								</div>
								<Badge variant="outline">{i.severity}</Badge>
							</div>
						))}
						<Link to="/site-engineer/issues" className="text-sm text-primary">
							View all issues
						</Link>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Quick actions</CardTitle>
				</CardHeader>
				<CardContent className="pt-4 flex flex-wrap gap-2">
					<StatusPill tone="good">
						<Link to="/site-engineer/attendance">Check in / out</Link>
					</StatusPill>
					<StatusPill>
						<Link to="/site-engineer/daily-reports">Write daily report</Link>
					</StatusPill>
					<StatusPill tone="warn">
						<Link to="/site-engineer/issues">Report issue</Link>
					</StatusPill>
{/* Record stock: stock module is not in the v2.7 flow */}
					<StatusPill>
						<Link to="/site-engineer/safety">Safety checklist</Link>
					</StatusPill>
				</CardContent>
			</Card>
		</div>
	);
}
