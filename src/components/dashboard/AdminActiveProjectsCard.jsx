import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Active projects card from the v2.5 admin dashboard API (data.activeProjects)
export function AdminActiveProjectsCard({ data }) {
	if (!data) {
		return <Skeleton className="h-80 rounded-md" />;
	}

	const projects = data.projects || [];

	return (
		<Card>
			<CardHeader className="flex-row items-center justify-between border-b border-border/40 pb-4">
				<div>
					<CardTitle className="font-display text-sm uppercase tracking-wider text-foreground">
						{data.title}
					</CardTitle>
					<CardDescription className="mt-1">{data.subtitle}</CardDescription>
				</div>
				<Badge variant="secondary" className="font-mono text-[11px]">
					{data.liveCount} LIVE
				</Badge>
			</CardHeader>
			<CardContent className="pt-6 space-y-5">
				{projects.length === 0 && (
					<div className="text-sm text-muted-foreground">No active projects</div>
				)}
				{projects.map((p) => (
					<div key={p._id} className="space-y-2.5">
						<div className="flex items-baseline justify-between gap-3">
							<div className="min-w-0">
								<div className="text-sm font-medium text-foreground truncate">{p.name}</div>
								<div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
									{p.location}
									{p.isDelayed && (
										<span className="ml-2 text-destructive">{p.daysOverdue} days overdue</span>
									)}
								</div>
							</div>
							<div className="text-sm font-mono font-medium text-foreground">{p.progress}%</div>
						</div>
						<Progress
							value={p.progress}
							indicatorClassName={p.isDelayed ? "bg-destructive" : "bg-success"}
						/>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
