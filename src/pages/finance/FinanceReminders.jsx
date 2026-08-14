// src/pages/finance/FinanceReminders.jsx
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/helpers";
import { Mail, AlertTriangle } from "lucide-react";
import { projectApi } from "@/api";
import { toast } from "sonner";

export function FinanceReminders() {
	// Extract reminders pagination from useFinance
	const { reminders, fetchReminderLogs, loading, pagination } = useFinance();
	const [projects, setProjects] = useState([]);
	const [projectFilter, setProjectFilter] = useState("all");

	// State: Reminders table pagination
	const [page, setPage] = useState(1);
	const limit = 20;

	// State: Projects dropdown pagination
	const [projectPage, setProjectPage] = useState(1);
	const [hasMoreProjects, setHasMoreProjects] = useState(true);

	// Projects fetch function with pagination support
	const fetchProjects = async (pageNo = 1) => {
		try {
			// Backend ko exact limit 10 aur required page bhej rahe hain
			const res = await projectApi.getAll({ page: pageNo, limit: 10 });

			if (res.data.success) {
				const fetchedProjects = res.data.data?.projects || [];
				const projectPagination = res.data.data?.pagination;

				if (pageNo === 1) {
					setProjects(fetchedProjects);
				} else {
					// Naye projects ko purane list mein append karo
					setProjects((prev) => [...prev, ...fetchedProjects]);
				}

				// Check karein ki aur pages available hain ya nahi
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

	// Jab bhi filter ya page change ho, reminders API call karo
	useEffect(() => {
		fetchReminderLogs({
			projectId: projectFilter === "all" ? undefined : projectFilter,
			page,
			limit
		});
	}, [projectFilter, page, fetchReminderLogs]);

	// Project filter change hone pe reminder table ko page 1 par wapas aao
	useEffect(() => {
		setPage(1);
	}, [projectFilter]);

	// Initial load par pehle 10 projects fetch karo
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
			<Card className="overflow-hidden border-border shadow-sm">
				<CardContent className="p-0">
					<Table>
						<TableHeader className="bg-muted/30">
							<TableRow className="hover:bg-transparent">
								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Type
								</TableHead>

								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Recipient
								</TableHead>

								<TableHead className="min-w-[250px] whitespace-nowrap font-semibold text-muted-foreground">
									Subject
								</TableHead>

								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Milestone
								</TableHead>

								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Project Details
								</TableHead>

								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Sent At
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={6}>
										<div className="flex items-center gap-4 py-2">
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
										</div>
									</TableCell>
								</TableRow>
							) : reminders.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
										<div className="flex flex-col items-center justify-center gap-2">
											<span className="text-2xl opacity-40">📄</span>
											<p>No reminders found.</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								reminders.map((log) => (
									<TableRow
										key={log._id}
										className="group cursor-default transition-colors hover:bg-muted/40"
									>
										<TableCell className="whitespace-nowrap">
											{log.reminderType === "penalty" ? (
												<span className="flex items-center gap-1.5 text-sm font-medium text-destructive">
													<AlertTriangle className="h-3.5 w-3.5 shrink-0" />
													Penalty
												</span>
											) : (
												<span className="flex items-center gap-1.5 text-sm font-medium text-primary">
													<Mail className="h-3.5 w-3.5 shrink-0" />
													Normal
												</span>
											)}
										</TableCell>

										<TableCell className="whitespace-nowrap font-medium text-foreground">
											{log.recipient}
										</TableCell>

										<TableCell className="min-w-[250px] whitespace-nowrap text-sm text-muted-foreground">
											{log.subject}
										</TableCell>

										<TableCell className="whitespace-nowrap text-sm font-medium text-foreground">
											{log.milestone || "—"}
										</TableCell>

										<TableCell className="whitespace-nowrap">
											<div className="font-medium text-foreground">
												{log.projectId?.name || "—"}
											</div>

											{/* <div className="mt-0.5 text-[11px] text-muted-foreground">
												Ref: {log.bookingId?.bookingReferenceNumber || "—"}
											</div> */}
										</TableCell>

										<TableCell className="whitespace-nowrap font-medium tabular-nums text-foreground">
											{formatDate(log.sentAt || log.createdAt)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

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
		</div>
	);
}