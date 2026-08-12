import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { usePropertyInventory } from "@/hooks/usePropertyInventory";
import {
	Building2,
	Home,
	Download,
	TrendingUp,
	AlertCircle,
	ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PropertyInventory() {
	const navigate = useNavigate();

	const {
		dashboardData,
		loading,
		fetchDashboard,
		exportInventory,
	} = usePropertyInventory();

	const [filters, setFilters] = useState({ status: "", search: "" });
	const { projectStats, projects, leads, pagination } = dashboardData;

	useEffect(() => {
		fetchDashboard({ ...filters });
	}, []);

	const applyFilters = () => {
		fetchDashboard({ ...filters, page: 1 });
	};

	const goToPage = (page) => {
		if (page < 1 || page > pagination.pages || page === pagination.page) return;
		fetchDashboard({ ...filters, page });
	};

	const handleViewProject = (id) => {
		navigate(`/property-inventory/${id}`);
	};


	const getBookingProgress = (project) => {
		const totalFlats =
			project.totalFlats ??
			project.towers?.reduce(
				(total, tower) => total + (tower.totalFlats || 0),
				0
			) ??
			0;

		const bookedFlats = project.totalBookedFlats || 0;

		if (!totalFlats) {
			return {
				booked: bookedFlats,
				total: 0,
				percentage: 0,
			};
		}

		return {
			booked: bookedFlats,
			total: totalFlats,
			percentage: Math.min((bookedFlats / totalFlats) * 100, 100),
		};
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Property Inventory"
				actions={
					<Button onClick={exportInventory} disabled={loading}>
						<Download className="h-4 w-4 mr-1" /> Export
					</Button>
				}
			/>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				<StatCard
					size="compact"
					label="Total Projects"
					value={projectStats.total || 0}
					icon={Building2}
					accent="neutral"
					className="bg-white dark:bg-card rounded-xl shadow-sm"
					valueClassName="text-lg sm:text-xl lg:text-2xl truncate"
				/>
				<StatCard
					size="compact"
					label="Active"
					value={projectStats.active || 0}
					icon={TrendingUp}
					accent="neutral"
					className="bg-white dark:bg-card rounded-xl shadow-sm"
					valueClassName="text-lg sm:text-xl lg:text-2xl truncate"
				/>
				<StatCard
					size="compact"
					label="Completed"
					value={projectStats.completed || 0}
					icon={Home}
					accent="neutral"
					className="bg-white dark:bg-card rounded-xl shadow-sm"
					valueClassName="text-lg sm:text-xl lg:text-2xl truncate"
				/>
				<StatCard
					size="compact"
					label="Delayed"
					value={projectStats.delayed || 0}
					icon={AlertCircle}
					accent="neutral"
					className="bg-white dark:bg-card rounded-xl shadow-sm"
					valueClassName="text-lg sm:text-xl lg:text-2xl truncate"
				/>
			</div>

			{/* Filters */}
			{/* <Card>
				<CardContent className="p-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<div>
							<Label>Status</Label>
							<Select
								value={filters.status}
								onValueChange={(v) => setFilters({ ...filters, status: v })}
							>
								<SelectTrigger>
									<SelectValue placeholder="All statuses" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value=" ">All</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="delayed">Delayed</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Search</Label>
							<Input
								placeholder="Project name..."
								value={filters.search}
								onChange={(e) =>
									setFilters({ ...filters, search: e.target.value })
								}
							/>
						</div>
						<div className="flex items-end">
							<Button onClick={applyFilters}>
								<Search className="h-4 w-4 mr-1" /> Search
							</Button>
						</div>
					</div>
				</CardContent>
			</Card> */}

			{/* Projects Table */}
			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Project Name</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Progress</TableHead>
								<TableHead>Towers</TableHead>
								<TableHead>Booked Flats</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{projects.map((project) => (
								<TableRow
									key={project.id}
									className="cursor-pointer hover:bg-muted/50"
									onClick={() => handleViewProject(project.id)}
								>
									<TableCell className="font-medium whitespace-nowrap">{project.name}</TableCell>
									<TableCell>{project.location}</TableCell>
									<TableCell className="capitalize">{project.status}</TableCell>
									<TableCell>{project.progress}%</TableCell>
									<TableCell>{project.totalTowers}</TableCell>
									<TableCell className="min-w-[180px]">
										{(() => {
											const booking = getBookingProgress(project);

											return (
												<div className="space-y-1.5">
													<div className="flex items-center justify-between text-xs">
														<span className="font-medium">
															{booking.booked} / {booking.total}
														</span>

														<span className="text-muted-foreground">
															{Math.round(booking.percentage)}%
														</span>
													</div>

													<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
														<div
															className="h-full rounded-full bg-primary transition-all"
															style={{
																width: `${booking.percentage}%`,
															}}
														/>
													</div>
												</div>
											);
										})()}
									</TableCell>
									<TableCell className="text-right">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleViewProject(project.id);
											}}
											className="inline-flex items-center justify-center size-8 rounded-lg transition-colors hover:bg-muted cursor-pointer"
										>
											<ChevronRight className="h-5 w-5 text-muted-foreground" />
										</button>
									</TableCell>
								</TableRow>
							))}
							{projects.length === 0 && !loading && (
								<TableRow>
									<TableCell colSpan={7} className="text-center">
										No projects found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					{/* Pagination */}
					{pagination.total > 0 && (
						<div className="flex justify-between items-center p-4">
							<span className="text-sm text-muted-foreground">
								Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
								projects)
							</span>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={pagination.page <= 1}
									onClick={() => goToPage(pagination.page - 1)}
								>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={pagination.page >= pagination.pages}
									onClick={() => goToPage(pagination.page + 1)}
								>
									Next
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}