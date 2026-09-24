
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Search,
	ChevronLeft,
	ChevronRight,
	X,
	Download,
} from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { projectApi } from "@/api/projectApi";
import { toast } from "sonner";
import FinanceBookingCard from "./FinanceBookings/FinanceBookingCard";

export default function FinanceBookings() {
	const navigate = useNavigate();

	const {
		bookings,
		fetchBookings,
		exportBookings,
		loading,
		pagination,
	} = useBooking();

	// Core filter states
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("booked");

	// Project Dropdown states
	const [filterProjects, setFilterProjects] = useState([]);
	const [projectName, setProjectName] = useState("all");

	const [currentPage, setCurrentPage] = useState(1);

	// Debounce Effect for Search
	useEffect(() => {
		const handler = setTimeout(() => {
			setSearch(searchInput);
		}, 500);
		return () => clearTimeout(handler);
	}, [searchInput]);

	// Load projects on mount
	useEffect(() => {
		const loadProjectsForFilter = async () => {
			try {
				const res = await projectApi.getAll({ page: 1, limit: 100 });
				const projectsData = res.data?.data?.projects || [];
				setFilterProjects(projectsData);
			} catch (err) {
				toast.error("Failed to load projects for filter");
			}
		};
		loadProjectsForFilter();
	}, []);

	const fetchParams = {
		page: currentPage,
		limit: 12,
		search: search || undefined,
		projectName: projectName === "all" ? undefined : projectName,
		status: statusFilter,
		approvalStatus: "approved",
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [search, projectName, statusFilter]);

	useEffect(() => {
		fetchBookings(fetchParams);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, search, projectName, statusFilter]);

	// Scroll to top whenever page changes
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [currentPage]);

	const handleExport = async () => {
		await exportBookings(fetchParams);
	};

	// Navigate to Details Page
	const handleView = (id) => navigate(`/finance-bookings/${id}`);

	return (
		<div className="space-y-6">

			<div className="flex flex-col xl:flex-row gap-3 justify-between items-start xl:items-center bg-card p-4 rounded-xl border shadow-sm">
				<Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full xl:w-auto">
					<TabsList className="bg-muted/60 p-1">
						<TabsTrigger value="booked" className="rounded-md">Booked</TabsTrigger>
						<TabsTrigger value="sold" className="rounded-md">Sold</TabsTrigger>
						<TabsTrigger value="cancelled" className="rounded-md">Cancelled</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
					<Select
						value={projectName}
						onValueChange={(val) => setProjectName(val)}
					>
						<SelectTrigger className="w-full sm:w-56 bg-background border-border/50">
							<SelectValue placeholder="Select Project" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Projects</SelectItem>
							{filterProjects.map((project) => (
								<SelectItem key={project._id} value={project.name}>
									{project.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="relative w-full sm:w-80 lg:w-96">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							className="pl-9 pr-9 w-full bg-background border-border/50 transition-all focus-visible:ring-primary/30"
							placeholder="Search reference, client name, flat..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
						{searchInput && (
							<button
								type="button"
								onClick={() => setSearchInput("")}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-full transition-colors"
								aria-label="Clear search"
							>
								<X className="h-3 w-3" />
							</button>
						)}
					</div>

					<Button
						type="button"
						variant="outline"
						onClick={handleExport}
						disabled={loading}
						className="w-full sm:w-auto shrink-0"
					>
						<Download className="h-4 w-4 mr-2" />
						Export
					</Button>
				</div>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
					{[...Array(8)].map((_, i) => (
						<Skeleton key={i} className="h-[200px] rounded-xl" />
					))}
				</div>
			) : bookings.length === 0 ? (
				<EmptyState
					title="No financial records found"
					description="Try adjusting your filters or search query to find specific bookings."
				/>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
						{bookings.map((b) => (
							<FinanceBookingCard
								key={b._id}
								booking={b}
								onClick={handleView}
							/>
						))}
					</div>

					{pagination && pagination.pages > 1 && (
						<div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 mt-6 gap-4">
							<div className="text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/30">
								Showing page <span className="font-semibold text-foreground">{pagination.page}</span> of{" "}
								<span className="font-semibold text-foreground">{pagination.pages}</span>
								<span className="mx-1">•</span>
								Total <span className="font-semibold text-foreground">{pagination.total}</span> records
							</div>

							<div className="flex items-center gap-1">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
									disabled={currentPage === 1}
									className="px-2"
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>

								<div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar px-1">
									{[...Array(pagination.pages)].map((_, index) => {
										const pageNumber = index + 1;

										if (
											pagination.pages <= 7 ||
											pageNumber === 1 ||
											pageNumber === pagination.pages ||
											(pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
										) {
											return (
												<Button
													key={pageNumber}
													variant={currentPage === pageNumber ? "default" : "outline"}
													size="sm"
													onClick={() => setCurrentPage(pageNumber)}
													className={`w-8 h-8 p-0 ${currentPage === pageNumber ? "shadow-md" : "text-muted-foreground border-border/50"}`}
												>
													{pageNumber}
												</Button>
											);
										}

										if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
											return <span key={pageNumber} className="px-1 text-muted-foreground">...</span>;
										}

										return null;
									})}
								</div>

								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
									disabled={currentPage === pagination.pages}
									className="px-2"
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}