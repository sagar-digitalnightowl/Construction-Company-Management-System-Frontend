
// src/pages/finance/FinanceBookings.jsx
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatINR, formatDate } from "@/lib/helpers";
import { Mail, AlertTriangle, Loader2, Search, X, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { projectApi } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceBookingsReminder() {
	const {
		bookings,
		pagination,
		fetchBookings,
		sendNormalReminder,
		sendPenaltyReminder,
		sendWhatsAppReminders,
		loading,
	} = useFinance();

	// Projects Dropdown States
	const [projects, setProjects] = useState([]);
	const [projectFilter, setProjectFilter] = useState("all");
	const [projectPage, setProjectPage] = useState(1);
	const [hasMoreProjects, setHasMoreProjects] = useState(true);

	// Bookings Table State
	const [currentPage, setCurrentPage] = useState(1);

	// Search States
	const [searchQuery, setSearchQuery] = useState("");
	const [searchInputValue, setSearchInputValue] = useState("");

	// Reminder States
	const [reminderOpen, setReminderOpen] = useState(null);
	const [reminderType, setReminderType] = useState("normal");
	const [reminderData, setReminderData] = useState({
		dueDate: "",
		milestoneName: "",
		installmentId: null, // ✅ Added to store WhatsApp installment ID
		language: "en", // ✅ Added language for WhatsApp notification
	});

	const fetchProjects = async (pageNo = 1) => {
		try {
			const res = await projectApi.getAll({ page: pageNo, limit: 10 });
			if (res.data.success) {
				const fetchedProjects = res.data.data?.projects || res.data.data?.docs || res.data.data || [];
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

	const handleProjectFilterChange = (val) => {
		setProjectFilter(val);
		setCurrentPage(1);
	};

	// ✅ Server-Side Search trigger
	const handleSearch = (e) => {
		e.preventDefault();
		const trimmedQuery = searchInputValue.trim();
		if (trimmedQuery !== searchQuery) {
			setSearchQuery(trimmedQuery);
			setCurrentPage(1);
		}
	};

	// ✅ Clear search triggers an API call without the search param
	const clearSearch = () => {
		setSearchInputValue("");
		if (searchQuery) {
			setSearchQuery("");
			setCurrentPage(1);
		}
	};

	useEffect(() => {
		fetchBookings({
			projectId: projectFilter === "all" ? undefined : projectFilter,
			search: searchQuery || undefined,
			page: currentPage,
			limit: 10,
		});
	}, [projectFilter, currentPage, searchQuery, fetchBookings]);

	useEffect(() => {
		fetchProjects(1);
	}, []);

	const handleLoadMoreProjects = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const nextPage = projectPage + 1;
		setProjectPage(nextPage);
		fetchProjects(nextPage);
	};

	// ✅ Updated to handle WhatsApp sending with language
	const handleSendReminder = async (bookingId) => {
		if (reminderType === "whatsapp") {
			await sendWhatsAppReminders([reminderData.installmentId], reminderData.language);
		} else {
			const payload = {
				dueDate: reminderData.dueDate || undefined,
				milestoneName: reminderData.milestoneName || undefined,
			};
			if (reminderType === "normal") {
				await sendNormalReminder(bookingId, payload);
			} else if (reminderType === "penalty") {
				await sendPenaltyReminder(bookingId, payload);
			}
		}

		// Close dialog and reset state
		setReminderOpen(null);
		setReminderData({ dueDate: "", milestoneName: "", installmentId: null, language: "en" });
	};

	// ✅ Updated to accept extra data for WhatsApp and reset language
	const openReminderDialog = (bookingId, type, extraData = null) => {
		setReminderOpen(bookingId);
		setReminderType(type);

		if (type === "whatsapp" && extraData) {
			setReminderData({ dueDate: "", milestoneName: "", installmentId: extraData.installmentId, language: "en" });
		} else {
			setReminderData({ dueDate: "", milestoneName: "", installmentId: null, language: "en" });
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-card p-4 rounded-xl border shadow-sm">
				<div className="flex items-center gap-3 w-full xl:w-auto">
					<span className="text-sm font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline-block">
						Filter by Project:
					</span>
					<Select value={projectFilter} onValueChange={handleProjectFilterChange}>
						<SelectTrigger className="w-full sm:w-64 bg-background border-border/50 transition-all focus:ring-primary/30">
							<SelectValue placeholder="All Projects" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Projects</SelectItem>
							{projects.map((p) => (
								<SelectItem key={p._id} value={p._id}>
									{p.name}
								</SelectItem>
							))}

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

				<form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
					<div className="relative w-full sm:w-80 lg:w-96">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search by name, email, phone, ref, flat..."
							value={searchInputValue}
							onChange={(e) => {
								setSearchInputValue(e.target.value);
								// Auto-clear if user deletes the text manually
								if (e.target.value === "" && searchQuery !== "") {
									clearSearch();
								}
							}}
							className="pl-9 pr-9 w-full bg-background border-border/50 transition-all focus-visible:ring-primary/30 shadow-sm"
						/>
						{searchInputValue && (
							<button
								type="button"
								onClick={clearSearch}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-full transition-colors"
							>
								<X className="h-3 w-3" />
							</button>
						)}
					</div>
					<div className="flex gap-2 w-full sm:w-auto">
						<Button type="submit" variant="default" size="sm" disabled={!searchInputValue.trim()} className="w-full sm:w-auto shadow-sm">
							Search
						</Button>
						{searchQuery && (
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={clearSearch}
								className="w-full sm:w-auto shadow-sm bg-muted/60 hover:bg-muted"
							>
								Clear
							</Button>
						)}
					</div>
				</form>
			</div>

			{searchQuery && (
				<div className="flex items-center gap-2 text-sm bg-accent/40 px-3 py-2 rounded-lg border border-border/30 w-fit">
					<Badge variant="secondary" className="gap-1.5 bg-background border-border/50 shadow-sm">
						<Search className="h-3 w-3 text-muted-foreground" />
						<span className="max-w-[150px] truncate">{searchQuery}</span>
					</Badge>
					<span className="text-muted-foreground font-medium">
						{pagination?.total > 0
							? `Found ${pagination.total} result${pagination.total > 1 ? 's' : ''}`
							: 'No results found'}
					</span>
				</div>
			)}

			<Card className="overflow-hidden border-border shadow-sm">
				<CardContent className="p-0">
					<Table>
						<TableHeader className="bg-muted/30">
							<TableRow className="hover:bg-transparent">
								<TableHead className="font-semibold text-muted-foreground">Buyer Details</TableHead>
								<TableHead className="font-semibold text-muted-foreground">Property Details</TableHead>
								<TableHead className="font-semibold text-muted-foreground">Project</TableHead>
								<TableHead className="text-right text-nowrap font-semibold text-muted-foreground">
									Total Paid
								</TableHead>
								<TableHead className="text-right text-nowrap font-semibold text-muted-foreground">
									Remaining
								</TableHead>
								<TableHead className="text-nowrap font-semibold text-muted-foreground">Next Installment</TableHead>
								<TableHead className="text-right text-nowrap font-semibold text-muted-foreground">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading && (
								<TableRow>
									<TableCell colSpan={7}>
										<div className="flex items-center gap-4 py-2">
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
											<Skeleton className="h-10 w-full" />
										</div>
									</TableCell>
								</TableRow>
							)}

							{!loading && !searchQuery && bookings.length === 0 && (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
										<div className="flex flex-col items-center justify-center gap-2">
											<span className="text-2xl opacity-40">📄</span>
											<p>No bookings found.</p>
										</div>
									</TableCell>
								</TableRow>
							)}

							{!loading && searchQuery && bookings.length === 0 && (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-12">
										<div className="flex flex-col items-center gap-3">
											<div className="bg-muted p-3 rounded-full">
												<Search className="h-6 w-6 text-muted-foreground" />
											</div>
											<p className="text-muted-foreground">No bookings found matching "<span className="font-medium text-foreground">{searchQuery}</span>"</p>
											<Button variant="outline" size="sm" onClick={clearSearch} className="mt-2">
												Clear search
											</Button>
										</div>
									</TableCell>
								</TableRow>
							)}

							{!loading && bookings.map((b) => (
								<TableRow key={b.bookingId} className="group hover:bg-muted/40 transition-colors cursor-default">
									<TableCell>
										<div className="font-semibold text-foreground">{b.buyer?.name}</div>
										<div className="text-[11px] text-muted-foreground mt-0.5 text-nowrap">
											{b.buyer?.email}
										</div>
										{b.buyer?.phone && (
											<div className="text-[11px] text-muted-foreground">
												{b.buyer.phone}
											</div>
										)}
									</TableCell>
									<TableCell className="min-w-32">
										<div className="font-semibold text-foreground">
											Flat: {b.flat?.flatNumber}
										</div>
										<div className="text-[11px] text-muted-foreground mt-0.5 text-nowrap">
											Tower: {b.flat?.tower}
										</div>
										<div className="text-[11px] text-muted-foreground text-nowrap">
											Floor: {b.flat?.floor}
										</div>
									</TableCell>
									<TableCell className="min-w-32 font-medium text-sm text-muted-foreground">
										{b.projectName}
									</TableCell>
									<TableCell className="text-right font-medium text-success tabular-nums">
										{formatINR(b.totalPaid)}
									</TableCell>
									<TableCell className="text-right font-bold text-destructive tabular-nums">
										{formatINR(b.remainingAmount)}
									</TableCell>
									<TableCell className="text-xs">
										{b.installmentSummary?.pendingInstallments > 0 ? (
											<div className="flex flex-col gap-0.5">
												<span className="font-semibold text-foreground tabular-nums">
													{formatINR(
														b.installments?.find((i) => !i.paid)?.amount || 0,
													)}
												</span>
												<span className="text-[10px] text-muted-foreground uppercase tracking-wider block text-nowrap">
													Due: {formatDate(
														b.installments?.find((i) => !i.paid)?.dueDate,
													)}
												</span>
											</div>
										) : (
											<Badge variant="secondary" className="bg-success/10 text-success border-none hover:bg-success/20 pointer-events-none">
												All Paid
											</Badge>
										)}
									</TableCell>
									<TableCell>
										<div className="flex gap-1.5 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
											{/* Email - Normal */}
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
												title="Send Normal Reminder"
												onClick={() => openReminderDialog(b.bookingId, "normal")}
												disabled={!b.buyer?.email}
											>
												<Mail className="h-4 w-4" />
											</Button>

											{/* Email - Penalty */}
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
												title="Send Penalty Reminder"
												onClick={() => openReminderDialog(b.bookingId, "penalty")}
												disabled={!b.buyer?.email}
											>
												<AlertTriangle className="h-4 w-4 text-destructive/80" />
											</Button>

											{/* WhatsApp Reminder */}
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 hover:bg-green-600/10 hover:text-green-600 transition-colors"
												title="Send WhatsApp Reminder"
												onClick={() => {
													const pendingInstallment = b.installments?.find((i) => !i.paid);
													if (pendingInstallment) {
														const id = pendingInstallment._id || pendingInstallment.id;
														openReminderDialog(b.bookingId, "whatsapp", { installmentId: id });
													} else {
														toast.error("No pending installment found to send reminder.");
													}
												}}
												disabled={!b.buyer?.phone || b.installmentSummary?.pendingInstallments === 0 || loading}
											>
												<MessageCircle className="h-4 w-4 text-green-600/80" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{!loading && pagination && pagination.total > 0 && (
				<div className="flex items-center justify-between pt-2">
					<div className="text-sm text-muted-foreground">
						Showing page {pagination.page} of {pagination.pages} (Total: {pagination.total} bookings)
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((prev) => prev - 1)}
							disabled={pagination.page <= 1}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((prev) => prev + 1)}
							disabled={pagination.page >= pagination.pages}
						>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* ✅ Popup / Dialog Section */}
			<Dialog
				open={!!reminderOpen}
				onOpenChange={(v) => !v && setReminderOpen(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{reminderType === "normal"
								? "Send Normal Email Reminder"
								: reminderType === "penalty"
									? "Send Penalty Email Reminder"
									: "Send WhatsApp Reminder"}
						</DialogTitle>
					</DialogHeader>

					<div className="grid gap-3">
						{/* Show confirmation text for WhatsApp */}
						{reminderType === "whatsapp" ? (
							<div className="space-y-4">
								<div className="text-sm text-muted-foreground">
									<p>Are you sure you want to send a WhatsApp payment reminder to this client?</p>
									<p className="mt-2 text-amber-600 font-medium">This will immediately send a message to their registered mobile number.</p>
								</div>

								{/* ✅ Added Language Selector */}
								<div className="space-y-1.5">
									<Label>Message Language</Label>
									<Select
										value={reminderData.language}
										onValueChange={(val) => setReminderData({ ...reminderData, language: val })}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select Language" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="en">English</SelectItem>
											<SelectItem value="hi">Hindi</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						) : (
							/* Show inputs for Email Reminders */
							<>
								{reminderType === "normal" && (
									<div className="space-y-1.5">
										<Label>Milestone Name (optional)</Label>
										<Input
											placeholder="e.g. 2nd Slab Casting"
											value={reminderData.milestoneName}
											onChange={(e) =>
												setReminderData({
													...reminderData,
													milestoneName: e.target.value,
												})
											}
										/>
									</div>
								)}
								<div className="space-y-1.5">
									<Label>Due Date (optional)</Label>
									<Input
										type="date"
										value={reminderData.dueDate}
										onChange={(e) =>
											setReminderData({ ...reminderData, dueDate: e.target.value })
										}
									/>
								</div>
							</>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setReminderOpen(null)}>
							Cancel
						</Button>
						<Button
							onClick={() => handleSendReminder(reminderOpen)}
							disabled={loading}
							className={reminderType === "whatsapp" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
						>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Yes, Send
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}