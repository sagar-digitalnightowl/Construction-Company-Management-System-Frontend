import React from "react";
import { AlertTriangle, FolderKanban, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

// KPI row from the v2.5 admin dashboard API (data.kpiCards)
export function AdminKpiCards({ kpiCards, error }) {
	if (!kpiCards) {
		if (error) {
			return (
				<div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
					{error}
				</div>
			);
		}
		return (
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-28 rounded-md" />
				))}
			</div>
		);
	}

	const { activeProjects, delayed, budgetUtilisation, overdueInvoices } = kpiCards;

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
			<StatCard
				size="compact"
				label={activeProjects.label}
				value={activeProjects.count}
				delta={`${activeProjects.total} total`}
				icon={FolderKanban}
			/>
			<StatCard
				size="compact"
				label={delayed.label}
				value={delayed.count}
				delta={delayed.subtext}
				deltaTone={delayed.count > 0 ? "down" : "up"}
				icon={AlertTriangle}
				accent="warning"
			/>
			<StatCard
				size="compact"
				label={budgetUtilisation.label}
				value={`${budgetUtilisation.percentage}%`}
				delta={budgetUtilisation.subtext}
				icon={Wallet}
				accent="success"
			/>
			<StatCard
				size="compact"
				label={overdueInvoices.label}
				value={overdueInvoices.count}
				delta={overdueInvoices.subtext}
				deltaTone={overdueInvoices.count > 0 ? "down" : "up"}
				icon={TrendingUp}
				accent="primary"
			/>
		</div>
	);
}
