
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { projectApi } from "@/api";
import { toast } from "sonner";
import RemindersTable from "./FinanceReminders/RemindersTable";
import ReminderDetailsDialog from "./FinanceReminders/ReminderDetailsDialog";

export function FinanceReminders() {
	const { reminders, fetchReminderLogs, loading, pagination } = useFinance();
	const [projects, setProjects] = useState([]);
	const [selectedReminder, setSelectedReminder] = useState(null);
	const [projectFilter, setProjectFilter] = useState("all");

	const [page, setPage] = useState(1);
	const limit = 20;

	const [projectPage, setProjectPage] = useState(1);
	const [hasMoreProjects, setHasMoreProjects] = useState(true);

	const fetchProjects = async (pageNo = 1) => {
		try {
			const res = await projectApi.getAll({ page: pageNo, limit: 10 });

			if (res.data.success) {
				const fetchedProjects = res.data.data?.projects || [];
				const projectPagination = res.data.data?.pagination;

				if (pageNo === 1) {
					setProjects(fetchedProjects);
				} else {
					setProjects((prev) => [...prev, ...fetchedProjects]);
				}

				if (projectPagination && pageNo >= projectPagination.pages) {
					setHasMoreProjects(false);
				} else {
					setHasMoreProjects(true);
				}
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to load projects");
		}
	};

	useEffect(() => {
		fetchReminderLogs({
			projectId: projectFilter === "all" ? undefined : projectFilter,
			page,
			limit
		});
	}, [projectFilter, page, fetchReminderLogs]);

	useEffect(() => {
		setPage(1);
	}, [projectFilter]);

	useEffect(() => {
		fetchProjects(1);
	}, []);

	// Dropdown ke andar "Load More" handle karne ke liye
	const handleLoadMoreProjects = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const nextPage = projectPage + 1;
		setProjectPage(nextPage);
		fetchProjects(nextPage);
	};

	return (
		<div className="space-y-6">
			{/* Modern Top Filter Bar */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card p-4 rounded-xl border shadow-sm gap-4">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<span className="text-sm font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline-block">
						Filter by Project:
					</span>
					<Select value={projectFilter} onValueChange={setProjectFilter}>
						<SelectTrigger className="w-full sm:w-64 bg-background border-border/50 transition-all focus:ring-primary/30">
							<SelectValue placeholder="All Projects" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Projects</SelectItem>
							{projects.map((p) => (
								<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
							))}

							{/* Load More Button for Projects */}
							{hasMoreProjects && (
								<div
									className="w-full text-left px-2 py-2 text-xs text-primary font-medium hover:bg-muted/60 border-t border-border/50 mt-1 cursor-pointer transition-colors"
									onClick={handleLoadMoreProjects}
								>
									+ Load More Projects
								</div>
							)}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Main Data Table */}
			<RemindersTable
				reminders={reminders}
				loading={loading}
				onViewReminder={setSelectedReminder}
			/>

			{/* Modern Pagination Footer */}
			{!loading && reminders.length > 0 && pagination?.pages > 1 && (
				<div className="flex flex-col gap-3 border-t pt-4 mt-2 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
						Showing page{" "}
						<span className="font-semibold text-foreground">
							{pagination.page}
						</span>{" "}
						of{" "}
						<span className="font-semibold text-foreground">
							{pagination.pages}
						</span>
						<span className="mx-1.5 text-border">•</span>
						Total{" "}
						<span className="font-semibold text-foreground">
							{pagination.total}
						</span>{" "}
						reminders
					</div>

					<div className="flex w-full gap-2 sm:w-auto">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => p - 1)}
							disabled={page === 1}
							className="flex-1 sm:flex-none"
						>
							Previous
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => p + 1)}
							disabled={page >= pagination.pages}
							className="flex-1 sm:flex-none"
						>
							Next
						</Button>
					</div>
				</div>
			)}

			<ReminderDetailsDialog
				reminder={selectedReminder}
				open={!!selectedReminder}
				onOpenChange={(open) => {
					if (!open) setSelectedReminder(null);
				}}
			/>
		</div>
	);
}