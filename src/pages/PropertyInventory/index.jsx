

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { usePropertyInventory } from "@/hooks/usePropertyInventory";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import {
	Building2,
	Home,
	BarChart3,
	Download,
	Search,
	Eye,
	TrendingUp,
	AlertCircle,
} from "lucide-react";
import ProjectDetailModal from "@/components/propertyInventory/ProjectDetailModal";
import BookingPaymentModal from "@/components/propertyInventory/BookingPaymentModal";

const getHealthColor = (health) => {
	switch (health) {
		case "green":
			return "success";
		case "yellow":
			return "warning";
		case "red":
			return "destructive";
		default:
			return "outline";
	}
};

export default function PropertyInventory() {
	const {
		dashboardData,
		selectedProject,
		projectBookings,
		bookingsPagination,
		projectAgreements,
		siteEngineers,
		bookingPayment,
		loading,
		fetchDashboard,
		fetchProjectDetails,
		fetchProjectBookings,
		fetchProjectAgreements,
		fetchSiteEngineers,
		fetchBookingPaymentDetails,
		exportInventory,
	} = usePropertyInventory();

	const { current } = useAuthStore();
	const canEdit = canMutate(current.role, "property");

	const [filters, setFilters] = useState({ status: "", search: "" });
	const [selectedProjectId, setSelectedProjectId] = useState(null);
	const [detailOpen, setDetailOpen] = useState(false);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [selectedBookingId, setSelectedBookingId] = useState(null);

	// Booking search state
	const [bookingSearch, setBookingSearch] = useState("");

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

	const handleViewProject = async (id) => {
		const project = await fetchProjectDetails(id);
		if (project) {
			setSelectedProjectId(id);
			setDetailOpen(true);
			fetchProjectBookings(id, { page: 1, limit: 10 });
			fetchProjectAgreements(id);
			fetchSiteEngineers(id);
			setBookingSearch("");
		}
	};

	const handleBookingPageChange = (page) => {
		if (!selectedProjectId) return;
		fetchProjectBookings(selectedProjectId, {
			page,
			limit: 10,
			search: bookingSearch,
		});
	};

	const handleBookingSearch = (value = bookingSearch) => {
		if (!selectedProjectId) return;

		fetchProjectBookings(selectedProjectId, {
			page: 1,
			limit: 10,
			search: value.trim(),
		});
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

	const handleViewPayments = async (bookingId) => {
		await fetchBookingPaymentDetails(bookingId);
		setPaymentModalOpen(true);
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
								<TableRow key={project.id}>
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
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleViewProject(project.id)}
										>
											<Eye className="h-4 w-4" />
										</Button>
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

			<ProjectDetailModal
				open={detailOpen}
				onOpenChange={setDetailOpen}
				project={selectedProject}
				bookings={projectBookings}
				bookingsPagination={bookingsPagination}
				onBookingPageChange={handleBookingPageChange}
				agreements={projectAgreements}
				siteEngineers={siteEngineers}
				loading={loading}
				onViewPayments={handleViewPayments}
				bookingSearch={bookingSearch}
				setBookingSearch={setBookingSearch}
				onBookingSearch={handleBookingSearch}
			/>

			<BookingPaymentModal
				open={paymentModalOpen}
				onOpenChange={setPaymentModalOpen}
				bookingPayment={bookingPayment}
			/>
		</div>
	);
}