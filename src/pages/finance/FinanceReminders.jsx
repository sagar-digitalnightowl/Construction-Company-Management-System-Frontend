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
import { Eye, Mail, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaWhatsapp } from "react-icons/fa";
import { LuMail } from "react-icons/lu";
import { projectApi } from "@/api";
import { toast } from "sonner";

export function FinanceReminders() {
	// Extract reminders pagination from useFinance
	const { reminders, fetchReminderLogs, loading, pagination } = useFinance();
	const [projects, setProjects] = useState([]);
	const [selectedReminder, setSelectedReminder] = useState(null);
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

								<TableHead className="text-center">Action</TableHead>
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
										<TableCell className="whitespace-nowrap text-center">
											<div className="flex items-center justify-start gap-2">
												{log.channel === "email" ? (
													<LuMail
														className="h-5 w-5 text-primary"
														title="Email"
													/>
												) : log.channel === "whatsapp" ? (
													<FaWhatsapp
														className="h-5 w-5 text-green-600"
														title="WhatsApp"
													/>
												) : (
													"—"
												)}

												{log.reminderType === "penalty" && (
													<AlertTriangle
														className="h-5 w-5 text-destructive"
														title="Penalty"
													/>
												)}
											</div>
										</TableCell>

										<TableCell className="whitespace-nowrap font-medium text-foreground">
											{log.recipient?.replace(/^\+/, "")}
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

										<TableCell className="text-center">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => setSelectedReminder(log)}
												title="View Reminder Details"
											>
												<Eye className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>

					<Dialog
						open={!!selectedReminder}
						onOpenChange={(open) => {
							if (!open) setSelectedReminder(null);
						}}
					>
						<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
							<DialogHeader>
								<DialogTitle>Reminder Details</DialogTitle>
							</DialogHeader>

							{selectedReminder && (
								<div className="space-y-6">
									{/* Booking Details */}
									<div className="rounded-lg border p-4">
										<h3 className="mb-4 text-sm font-semibold">
											Booking Details
										</h3>

										<div className="grid grid-cols-2 gap-x-6 gap-y-4">
											<div>
												<p className="text-xs text-muted-foreground">
													Project
												</p>
												<p className="font-medium">
													{selectedReminder.projectId?.name || "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Booking Reference
												</p>
												<p className="font-medium">
													{selectedReminder.bookingId
														?.bookingReferenceNumber || "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Flat
												</p>
												<p className="font-medium">
													Flat{" "}
													{selectedReminder.bookingId?.flatSnapshot
														?.flatNumber || "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Tower
												</p>
												<p className="font-medium">
													{selectedReminder.bookingId?.flatSnapshot
														?.towerName || "—"}
												</p>
											</div>
										</div>
									</div>

									{/* Reminder Details */}
									<div className="rounded-lg border p-4">
										<h3 className="mb-4 text-sm font-semibold">
											Reminder Details
										</h3>

										<div className="grid grid-cols-2 gap-x-6 gap-y-4">
											<div>
												<p className="text-xs text-muted-foreground">
													Recipient
												</p>
												<p className="break-all font-medium">
													{selectedReminder.recipient?.replace(
														/^\+/,
														""
													) || "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Channel
												</p>
												<p className="font-medium capitalize">
													{selectedReminder.channel || "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Reminder Type
												</p>
												<p className="font-medium capitalize">
													{selectedReminder.reminderType || "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Milestone
												</p>
												<p className="font-medium">
													{selectedReminder.milestone || "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Installment
												</p>
												<p className="font-medium">
													{selectedReminder.installmentNumber
														? `#${selectedReminder.installmentNumber}`
														: "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Amount
												</p>
												<p className="font-medium">
													{selectedReminder.amount > 0
														? `₹${selectedReminder.amount.toLocaleString(
															"en-IN"
														)}`
														: "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Created At
												</p>
												<p className="font-medium">
													{selectedReminder.createdAt
														? formatDate(selectedReminder.createdAt)
														: "—"}
												</p>
											</div>

											<div>
												<p className="text-xs text-muted-foreground">
													Sent At
												</p>
												<p className="font-medium">
													{selectedReminder.sentAt
														? formatDate(selectedReminder.sentAt)
														: "—"}
												</p>
											</div>
										</div>
									</div>

									{/* Delivery Status */}
									<div className="rounded-lg border p-4">
										<div className="mb-4 flex items-center justify-between">
											<h3 className="text-sm font-semibold">
												Delivery Status
											</h3>

											<span
												className={`rounded-full px-2.5 py-1 text-xs font-medium ${selectedReminder.sent
														? "bg-green-100 text-green-700"
														: "bg-red-100 text-red-700"
													}`}
											>
												{selectedReminder.sent ? "Sent" : "Failed"}
											</span>
										</div>

										{!selectedReminder.sent && selectedReminder.error && (
											<div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
												<p className="mb-1 font-semibold">
													Error
												</p>
												<p className="whitespace-pre-wrap break-words">
													{selectedReminder.error}
												</p>
											</div>
										)}
									</div>

									{/* Subject */}
									{selectedReminder.subject && (
										<div>
											<p className="mb-1 text-xs text-muted-foreground">
												Subject
											</p>

											<div className="rounded-md border bg-muted/30 p-3 text-sm font-medium">
												{selectedReminder.subject}
											</div>
										</div>
									)}

									{/* Message */}
									<div>
										<p className="mb-1 text-xs text-muted-foreground">
											Message
										</p>

										<div className="max-h-80 overflow-y-auto rounded-md border bg-muted/30 p-4 text-sm leading-6">
											<p className="whitespace-pre-wrap">
												{selectedReminder.message || "—"}
											</p>
										</div>
									</div>
								</div>
							)}
						</DialogContent>
					</Dialog>
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