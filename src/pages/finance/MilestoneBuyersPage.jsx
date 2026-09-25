import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { formatINR } from "@/lib/helpers";
import { StatCard } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";

export function MilestoneBuyersPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { projectId, projectName: projectNameFromState, milestone } = location.state || {};

	const [exporting, setExporting] = useState(false);
	const {
		fetchMilestoneBuyers,
		exportMilestoneBuyers,
		fetchMilestoneBuyerDetails,
		milestoneBuyersPagination,
		loading,
	} = useProject();

	const [data, setData] = useState(location.state?.initialData || null);
	const [projectName, setProjectName] = useState(
		projectNameFromState || location.state?.initialData?.buyers?.[0]?.project?.name || ""
	);
	const [status, setStatus] = useState("all");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const fetchBuyers = async (overrides = {}) => {
		if (!projectId || !milestone) return;
		const result = await fetchMilestoneBuyers({
			projectId,
			milestone,
			status: overrides.status ?? status,
			search: overrides.search ?? search,
			page: overrides.page ?? page,
			limit: 10,
		});
		if (result) setData(result);
		if (result) {
			setData(result);
			if (!projectName && result.buyers?.[0]?.project?.name) {
				setProjectName(result.buyers[0].project.name);
			}
		}
	};

	const handleStatusChange = (value) => {
		setStatus(value);
		setPage(1);
		fetchBuyers({ status: value, page: 1 });
	};

	const handleSearch = () => {
		setPage(1);
		fetchBuyers({ page: 1 });
	};

	const handlePageChange = (nextPage) => {
		setPage(nextPage);
		fetchBuyers({ page: nextPage });
	};

	const handleExport = async () => {
		setExporting(true);
		await exportMilestoneBuyers({ projectId, milestone, status, search });
		setExporting(false);
	};

	const handleViewBuyerDetails = async (bookingId) => {
		const details = await fetchMilestoneBuyerDetails(bookingId, {
			milestone: data.milestone,
		});

		if (details) {
			navigate(`/finance-milestones-buyers/${bookingId}`, {
				state: {
					initialData: details,
				},
			});
		}
	};

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-10">
				<p className="text-muted-foreground">
					No data loaded — this page needs a project and milestone to load.
				</p>
				{projectId && milestone ? (
					<Button onClick={() => fetchBuyers()} disabled={loading}>
						{loading ? "Loading..." : "Load Buyers"}
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

	const { summary, buyers } = data;

	return (
		<div className="space-y-4 p-4">
			<div className="flex items-center justify-between">
				<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
					<ArrowLeft className="mr-1.5 h-4 w-4" />
					Back to Milestones
				</Button>
				<Button onClick={handleExport} disabled={exporting}>
					<Download className="mr-1.5 h-4 w-4" />
					{exporting ? "Exporting..." : "Export to Excel"}
				</Button>
			</div>

			<div className="space-y-4">
				<div>
					<p className="text-xs text-muted-foreground">Project</p>
					<h2 className="font-display text-lg font-semibold text-foreground">
						{projectName || "Project"}
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						{milestone}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					<StatCard
						label="Total Buyers"
						value={summary.totalBuyers}
						size="compact"
						accent="primary"
					/>

					<StatCard
						label="Total Amount"
						value={formatINR(summary.totalAmount)}
						size="compact"
						accent="info"
					/>

					<StatCard
						label="Total Paid"
						value={formatINR(summary.totalPaid)}
						size="compact"
						accent="success"
					/>

					<StatCard
						label="Total Remaining"
						value={formatINR(summary.totalRemaining)}
						size="compact"
						accent="warning"
					/>
				</div>
			</div>

			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<Select
							value={status}
							onValueChange={handleStatusChange}
						>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="paid">Paid</SelectItem>
								<SelectItem value="partial">Partial</SelectItem>
								<SelectItem value="unpaid">Unpaid</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
							</SelectContent>
						</Select>

						<div className="flex flex-1 gap-2">
							<Input
								placeholder="Search buyer, phone, flat..."
								value={search}
								onChange={(e) => {
									const value = e.target.value;

									setSearch(value);

									if (!value.trim()) {
										setPage(1);
										fetchBuyers({
											search: "",
											page: 1,
										});
									}
								}}
								onKeyDown={(e) =>
									e.key === "Enter" && handleSearch()
								}
							/>

							<Button
								variant="outline"
								onClick={handleSearch}
								disabled={loading}
							>
								Search
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader className="bg-muted/10">
							<TableRow>
								<TableHead>Booking Ref</TableHead>
								<TableHead>Buyer</TableHead>
								<TableHead>Phone</TableHead>
								<TableHead>Flat</TableHead>
								<TableHead>Tower</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Total</TableHead>
								<TableHead className="text-right">Paid</TableHead>
								<TableHead className="text-right">Remaining</TableHead>
								<TableHead className="text-center">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{buyers.map((b) => (
								<TableRow key={b.bookingId}>
									<TableCell>{b.bookingReferenceNumber}</TableCell>
									<TableCell>{b.buyer.name}</TableCell>
									<TableCell>{b.buyer.phone}</TableCell>
									<TableCell>{b.flat.number}</TableCell>
									<TableCell>{b.flat.tower}</TableCell>
									<TableCell>
										<Badge
											variant={
												b.summary.status === "paid"
													? "success"
													: b.summary.status === "partial"
														? "warning"
														: b.summary.status === "pending"
															? "warning"
															: "destructive"
											}
										>
											{b.summary.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">{formatINR(b.summary.totalAmount)}</TableCell>
									<TableCell className="text-right">{formatINR(b.summary.totalPaid)}</TableCell>
									<TableCell className="text-right">{formatINR(b.summary.totalRemaining)}</TableCell>
									<TableCell className="text-center">
										<Button
											variant="ghost"
											size="sm"
											className="gap-1.5"
											onClick={() => handleViewBuyerDetails(b.bookingId)}
										>
											View Detail
											<ArrowRight className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{milestoneBuyersPagination.pages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={
							milestoneBuyersPagination.page <= 1 || loading
						}
						onClick={() =>
							handlePageChange(milestoneBuyersPagination.page - 1)
						}
					>
						Previous
					</Button>

					<span className="text-sm text-muted-foreground">
						Page {milestoneBuyersPagination.page} of{" "}
						{milestoneBuyersPagination.pages}
					</span>

					<Button
						variant="outline"
						size="sm"
						disabled={
							milestoneBuyersPagination.page >=
							milestoneBuyersPagination.pages || loading
						}
						onClick={() =>
							handlePageChange(milestoneBuyersPagination.page + 1)
						}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}