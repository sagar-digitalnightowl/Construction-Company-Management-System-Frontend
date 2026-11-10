import React, { useEffect, useState } from "react";
import { AlertTriangle, Building2, ClipboardCheck, MessageSquare, Package, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { useAuthStore } from "@/store/authStore";
import { selectUnreadTotal, useChatStore } from "@/store/chatStore";
import { getQueue, QUEUE_EVENT } from "@/lib/offlineQueue";
import { countToday } from "@/lib/workReportFormat";
import { formatDate } from "@/lib/helpers";
import { listFrom, unwrap, useAssignedProjects, projectName, StatusPill } from "./shared";

// Attendance, GPS check-in/check-out and daily reports are switched off for this release, so they are not shown here.
export default function SeDashboard() {
	const { current } = useAuthStore();
	const { projects, loading: projectsLoading } = useAssignedProjects();
	const [openIssues, setOpenIssues] = useState([]);
	const [todayReports, setTodayReports] = useState(null);
	const [stock, setStock] = useState(null);
	const [pendingSync, setPendingSync] = useState(() => getQueue().length);
	const unreadChat = useChatStore(selectUnreadTotal);

	useEffect(() => {
		let cancelled = false;
		Promise.allSettled([
			siteEngineerApi.listIssues({ status: "open", limit: 5 }),
			siteEngineerApi.listWorkReports({ limit: 100 }),
			siteEngineerApi.getStockDashboard(),
		]).then(([issues, reports, dash]) => {
			if (cancelled) return;
			if (issues.status === "fulfilled") setOpenIssues(listFrom(issues.value, "issues"));
			if (reports.status === "fulfilled") setTodayReports(countToday(unwrap(reports.value)?.reports || []));
			if (dash.status === "fulfilled") setStock(unwrap(dash.value));
		});
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const refresh = () => setPendingSync(getQueue().length);
		window.addEventListener(QUEUE_EVENT, refresh);
		window.addEventListener("storage", refresh);
		return () => {
			window.removeEventListener(QUEUE_EVENT, refresh);
			window.removeEventListener("storage", refresh);
		};
	}, []);

	const lowStock = stock?.totals?.lowStockItemCount ?? 0;

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title={`Hello, ${current?.name?.split(" ")[0] || "there"}`}
				description="Your sites, today's work and anything that needs attention."
			/>

			<div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
				<StatCard label="Assigned projects" icon={Building2} size="compact" value={projectsLoading ? "..." : projects.length} />
				<StatCard label="Work reports today" icon={ClipboardCheck} size="compact" value={todayReports ?? "..."} />
				<StatCard
					label="Pending sync"
					icon={RefreshCw}
					size="compact"
					value={pendingSync}
					accent={pendingSync ? "warning" : "neutral"}
				/>
				<StatCard
					label="Unread chat"
					icon={MessageSquare}
					size="compact"
					value={unreadChat}
					accent={unreadChat ? "warning" : "neutral"}
				/>
				<StatCard label="Open issues" icon={AlertTriangle} size="compact" value={openIssues.length} accent={openIssues.length ? "destructive" : "neutral"} />
				<StatCard label="Low stock items" icon={Package} size="compact" value={stock ? lowStock : "..."} accent={lowStock ? "destructive" : "neutral"} />
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
							<div key={p._id} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted">
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
						<Link to="/site-engineer/work-reports">New work report</Link>
					</StatusPill>
					<StatusPill tone="warn">
						<Link to="/site-engineer/issues">Report issue</Link>
					</StatusPill>
					<StatusPill>
						<Link to="/site-engineer/stock">Site stock</Link>
					</StatusPill>
					<StatusPill>
						<Link to="/site-engineer/safety">Safety checklist</Link>
					</StatusPill>
					<StatusPill>
						<Link to="/site-engineer/voice-notes">Voice note</Link>
					</StatusPill>
					<StatusPill>
						<Link to="/chat">Chat with management</Link>
					</StatusPill>
				</CardContent>
			</Card>
		</div>
	);
}
