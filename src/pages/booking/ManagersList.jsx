import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader, EmptyState, StatCard } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X, ChevronRight } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useBooking } from "@/hooks/useBooking";
import { projectApi } from "@/api/projectApi";
import { formatINR } from "@/lib/helpers";

const ROLE_LABELS = {
	project_manager: "PM",
	business_manager: "BM",
	team_manager: "TM",
};

export default function ManagersList() {
	const navigate = useNavigate();
	const { managersList, managersListSummary, fetchManagersList, loading } =
		useBooking();

	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [role, setRole] = useState("all");
	const [projectId, setProjectId] = useState("all");
	const [includeZero, setIncludeZero] = useState(false);
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		const handler = setTimeout(() => setSearch(searchInput), 500);
		return () => clearTimeout(handler);
	}, [searchInput]);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const res = await projectApi.getAll({ page: 1, limit: 100 });
				setProjects(res.data?.data?.projects || []);
			} catch {
				toast.error("Failed to load projects for filter");
			}
		};
		loadProjects();
	}, []);

	const runFetch = useCallback(() => {
		fetchManagersList({
			role: role === "all" ? undefined : role,
			search: search || undefined,
			projectId: projectId === "all" ? undefined : projectId,
			includeZero,
		});
	}, [role, search, projectId, includeZero, fetchManagersList]);

	useEffect(() => {
		runFetch();
	}, [runFetch]);

	const handleRowClick = (managerId) => navigate(`/managers-bookings/${managerId}`);

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Booking"
				title="Managers"
				description="Every PM/BM/TM with their booking counts and collections."
			/>

			{managersListSummary && (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						label="Managers"
						value={managersListSummary.totalManagers}
						accent="neutral"
						size="compact"
					/>
					<StatCard
						label="Total Bookings"
						value={managersListSummary.totalBookings}
						accent="primary"
						size="compact"
					/>
					<StatCard
						label="Total Paid"
						value={formatINR(managersListSummary.totalPaid)}
						accent="success"
						valueClassName="text-success"
						size="compact"
					/>
					<StatCard
						label="Total Remaining"
						value={formatINR(managersListSummary.totalRemaining)}
						accent="warning"
						valueClassName="text-yellow-600"
						size="compact"
					/>
				</div>
			)}

			<div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						className="pl-8 pr-8 bg-background"
						placeholder="Search name, email, phone..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					{searchInput && (
						<button
							type="button"
							onClick={() => setSearchInput("")}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							aria-label="Clear search"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				<Select value={role} onValueChange={setRole}>
					<SelectTrigger className="w-full sm:w-48 bg-background">
						<SelectValue placeholder="Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Roles</SelectItem>
						<SelectItem value="project_manager">Project Manager</SelectItem>
						<SelectItem value="business_manager">Business Manager</SelectItem>
						<SelectItem value="team_manager">Team Manager</SelectItem>
					</SelectContent>
				</Select>

				<Select value={projectId} onValueChange={setProjectId}>
					<SelectTrigger className="w-full sm:w-56 bg-background">
						<SelectValue placeholder="Select Project" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Projects</SelectItem>
						{projects.map((project) => (
							<SelectItem key={project._id} value={project._id}>
								{project.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
					<Checkbox
						checked={includeZero}
						onCheckedChange={(v) => setIncludeZero(Boolean(v))}
					/>
					Include managers with 0 bookings
				</label>
			</div>

			{loading ? (
				<div className="space-y-2">
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className="h-16 w-full" />
					))}
				</div>
			) : managersList.length === 0 ? (
				<EmptyState
					title="No managers found"
					description="Try a different filter or search term."
				/>
			) : (
				<div className="border rounded-lg overflow-x-auto bg-background">
					<table className="w-full text-sm">
						<thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
							<tr>
								<th className="text-left px-4 py-3 font-medium">Manager</th>
								<th className="text-left px-4 py-3 font-medium">Role(s)</th>
								<th className="text-right px-4 py-3 font-medium">Bookings</th>
								<th className="text-right px-4 py-3 font-medium">Booking Amount</th>
								<th className="text-right px-4 py-3 font-medium">Paid</th>
								<th className="text-right px-4 py-3 font-medium">Remaining</th>
								<th className="text-left px-4 py-3 font-medium">Status Breakdown</th>
								<th className="w-8"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{managersList.map(({ manager, ...stats }) => (
								<tr
									key={manager._id}
									className="cursor-pointer hover:bg-muted/30 transition-colors"
									onClick={() => handleRowClick(manager._id)}
								>
									<td className="px-4 py-3">
										<div className="font-medium">{manager.name}</div>
										<div className="text-xs text-muted-foreground">
											{manager.phone || manager.email}
										</div>
									</td>
									<td className="px-4 py-3">
										{(stats.roles || [manager.role]).map((r) => (
											<span
												key={r}
												className="inline-flex items-center rounded bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/20 px-1.5 py-0.5 text-[10px] font-semibold mr-1"
											>
												{ROLE_LABELS[r] || r}
											</span>
										))}
									</td>
									<td className="px-4 py-3 text-right">{stats.totalBookings}</td>
									<td className="px-4 py-3 text-right font-medium">
										{formatINR(stats.bookingAmount)}
									</td>
									<td className="px-4 py-3 text-right text-green-600">
										{formatINR(stats.totalPaid)}
									</td>
									<td className="px-4 py-3 text-right text-yellow-600">
										{formatINR(stats.remaining)}
									</td>
									<td className="px-4 py-3 text-xs text-muted-foreground">
										{stats.paidCount} paid, {stats.partialCount} partial
										{stats.unpaidCount ? `, ${stats.unpaidCount} unpaid` : ""}
									</td>
									<td className="px-2">
										<ChevronRight className="h-4 w-4 text-muted-foreground" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}