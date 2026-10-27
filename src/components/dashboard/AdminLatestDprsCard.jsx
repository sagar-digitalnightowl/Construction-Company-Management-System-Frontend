import React from "react";
import { Boxes, Users2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";

// Latest DPRs card from the v2.5 admin dashboard API (data.latestDprs)
export function AdminLatestDprsCard({ data }) {
	if (!data) {
		return <Skeleton className="h-80 rounded-md" />;
	}

	const entries = data.entries || [];

	return (
		<Card>
			<CardHeader className="flex-row items-center justify-between border-b border-border/40 pb-4">
				<div>
					<CardTitle className="font-display text-sm uppercase tracking-wider text-foreground">
						{data.title}
					</CardTitle>
					<CardDescription className="mt-1">{data.subtitle}</CardDescription>
				</div>
				<Badge variant="outline" className="font-mono text-[11px]">
					{data.entryCount} ENTRIES
				</Badge>
			</CardHeader>
			<CardContent className="pt-2 divide-y divide-border/60">
				{entries.length === 0 && (
					<div className="py-6 text-sm text-muted-foreground">No reports from sites yet</div>
				)}
				{entries.map((r) => (
					<div key={r._id} className="py-3.5 first:pt-4 last:pb-2">
						<div className="flex items-center justify-between text-sm">
							<div className="font-medium text-foreground truncate">{r.projectName}</div>
							<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
								{formatDate(r.date)}
							</span>
						</div>
						<div className="text-sm text-muted-foreground mt-1">{r.title}</div>
						<div className="flex gap-3 mt-2 text-[11px] font-mono text-muted-foreground">
							<span className="flex items-center gap-1.5">
								<Users2 className="h-3 w-3" /> {r.workerCount} workers
							</span>
							<span className="flex items-center gap-1.5">
								<Boxes className="h-3 w-3" /> {r.photoCount} photos
							</span>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
