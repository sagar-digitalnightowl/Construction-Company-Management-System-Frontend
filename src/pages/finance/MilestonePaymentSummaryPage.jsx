import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { formatINR } from "@/lib/helpers";
import { StatCard } from "@/components/common/PageHeader";
import { projectApi } from "@/api";

const getPercentageColor = (pct) => {
	if (pct >= 80) return "#28A745";
	if (pct >= 50) return "#FFC107";
	if (pct >= 25) return "#FD7E14";
	return "#DC3545";
};

export function MilestonePaymentSummaryPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { projectId, projectName: projectNameFromState } = location.state || {};

	const { fetchMilestonePaymentSummary, fetchMilestoneBuyers, loading } = useProject();
	const [data, setData] = useState(location.state?.initialData || null);
	const [projectName, setProjectName] = useState(projectNameFromState || "");

	useEffect(() => {
		const fetchMissingName = async () => {
			if (!projectName && projectId) {
				try {
					const res = await projectApi.getById(projectId);
					if (res.data.success) {
						setProjectName(res.data.data?.project?.name || res.data.data?.name || "");
					}
				} catch (err) {
					console.error(err);
				}
			}
		};
		fetchMissingName();
	}, [projectId, projectName]);

	const handleLoad = async () => {
		const summary = await fetchMilestonePaymentSummary(projectId);
		if (summary) setData(summary);
		if (!projectNameFromState) {
			try {
				const res = await projectApi.getById(projectId);
				if (res.data.success) {
					setProjectName(res.data.data?.project?.name || res.data.data?.name || "");
				}
			} catch (err) {
				// Non-critical — page still works, just without a project name shown
			}
		}
	};

	const handleViewBuyers = async (milestoneName) => {
		const buyersData = await fetchMilestoneBuyers({
			projectId,
			milestone: milestoneName,
			page: 1,
			limit: 10,
		});
		if (buyersData) {
			navigate("/finance-milestones-buyers", {
				state: {
					projectId,
					projectName,
					milestone: milestoneName,
					initialData: buyersData,
				},
			});
		}
	};

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-10">
				<p className="text-muted-foreground">No summary loaded yet.</p>
				{projectId ? (
					<Button onClick={handleLoad} disabled={loading}>
						{loading ? "Loading..." : "Load Summary"}
					</Button>
				) : (
					<Button variant="outline" onClick={() => navigate(-1)}>
						<ArrowLeft className="mr-1.5 h-4 w-4" />
						Go Back
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4">
			<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
				<ArrowLeft className="mr-1.5 h-4 w-4" />
				Back
			</Button>

			{projectName && (
				<div>
					<p className="text-xs text-muted-foreground">Project</p>
					<h2 className="font-display text-lg font-semibold text-foreground">
						{projectName}
					</h2>
				</div>
			)}

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
				<StatCard
					label="Total Bookings"
					value={data.totalBookings}
					size="compact"
					accent="primary"
				/>

				<StatCard
					label="Milestones Completed"
					value={`${data.completedMilestones}/${data.totalMilestones}`}
					size="compact"
					accent="success"
				/>

				<StatCard
					label="Total Amount"
					value={formatINR(data.overall.totalAmount)}
					size="compact"
					accent="info"
				/>

				<StatCard
					label="Total Paid"
					value={formatINR(data.overall.totalPaid)}
					size="compact"
					accent="success"
				/>

				<StatCard
					label="Total Remaining"
					value={formatINR(data.overall.totalRemaining)}
					size="compact"
					accent="warning"
				/>

				<StatCard
					label="Collection %"
					value={`${data.overall.collectionPercentage}%`}
					size="compact"
					accent="primary"
					valueClassName="text-primary"
				/>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader className="bg-muted/10">
							<TableRow>
								<TableHead>Milestone</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Total Buyers</TableHead>
								<TableHead>Buyers (Paid/Partial/Unpaid)</TableHead>
								<TableHead className="text-right">Collection %</TableHead>
								<TableHead className="text-center">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.milestones.map((m) => (
								<TableRow key={m.milestone}>
									<TableCell className="min-w-[200px]">{m.milestone}</TableCell>
									<TableCell>
										{m.completed ? (
											<span className="flex items-center gap-1.5 text-sm font-medium text-success">
												<CheckCircle className="h-4 w-4" /> Completed
											</span>
										) : (
											<span className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
												<Clock className="h-4 w-4" /> Pending
											</span>
										)}
									</TableCell>
									<TableCell className="text-right">
										{m.totalBuyers}
									</TableCell>

									<TableCell>
										{m.paidCount} / {m.partialCount} / {m.unpaidCount}
									</TableCell>
									<TableCell
										className="text-right font-medium"
										style={{ color: getPercentageColor(m.collectionPercentage) }}
									>
										{m.collectionPercentage}%
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleViewBuyers(m.milestone)}
											disabled={loading || m.totalBuyers === 0}
										>
											View Buyers
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}