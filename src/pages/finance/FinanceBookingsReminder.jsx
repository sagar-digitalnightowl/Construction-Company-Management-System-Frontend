
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
import { Mail, AlertTriangle, Loader2, Search, X, MessageCircle, History } from "lucide-react";
import { ReminderHistoryModal } from "@/components/finance/ReminderHistoryModal";
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
		reminderHistory,
		reminderHistoryLoading,
		reminderHistoryPagination,
		fetchBookingReminderHistory,
		fetchInstallmentReminderHistory,
		clearReminderHistory,
		loading,
	} = useFinance();

	// Projects Dropdown States
	const [projects, setProjects] = useState([]);
	const [projectFilter, setProjectFilter] = useState("all");
	const [projectPage, setProjectPage] = useState(1);
	const [hasMoreProjects, setHasMoreProjects] = useState(true);
	const [historyOpen, setHistoryOpen] = useState(false);
	const [historyBookingId, setHistoryBookingId] = useState(null);
	const [historyType, setHistoryType] = useState("booking");

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
	const [reminderBooking, setReminderBooking] = useState(null);

	const openBookingHistory = async (bookingId) => {
		setHistoryOpen(true);
		setHistoryType("booking");
		setHistoryBookingId(bookingId);
		await fetchBookingReminderHistory(bookingId, { page: 1, limit: 20 });
	};

	const openInstallmentHistory = async (installmentId) => {
		if (!installmentId) {
			toast.error("Installment not found.");
			return;
		}
		setHistoryOpen(true);
		setHistoryType("installment");
		await fetchInstallmentReminderHistory(installmentId);
	};

	const handleHistoryPageChange = (newPage) => {
		if (historyType === "booking" && historyBookingId) {
			fetchBookingReminderHistory(historyBookingId, { page: newPage, limit: 20 });
		}
	};

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

	const fmtReminderAmount = (amount) =>
		`₹${Number(amount || 0).toLocaleString("en-IN")}`;

	const calculateArrear = (installments, currentInstallmentNumber) => {
		return (installments || [])
			.filter(
				(i) =>
					Number(i.installmentNumber) < Number(currentInstallmentNumber) &&
					i.status !== "paid",
			)
			.reduce(
				(sum, i) =>
					sum +
					Math.max(
						0,
						Number(i.amount || 0) - Number(i.paidAmount || 0),
					),
				0,
			);
	};

	// ✅ Updated to handle WhatsApp sending with language
	const handleSendReminder = async (bookingId) => {
		try {
			if (reminderType === "whatsapp") {
				await sendWhatsAppReminders(
					[reminderData.installmentId],
					reminderData.language,
				);

				toast.success("WhatsApp reminder sent");

				setReminderOpen(null);
				setReminderData({
					dueDate: "",
					milestoneName: "",
					installmentId: null,
					language: "en",
				});

				return;
			}

			const payload = {
				dueDate: reminderData.dueDate || undefined,
				milestoneName: reminderData.milestoneName || undefined,
			};

			let response;

			if (reminderType === "normal") {
				response = await sendNormalReminder(bookingId, payload);
			} else if (reminderType === "penalty") {
				await sendPenaltyReminder(bookingId, payload);

				toast.success("Penalty reminder sent");

				setReminderOpen(null);
				setReminderData({
					dueDate: "",
					milestoneName: "",
					installmentId: null,
					language: "en",
				});

				return;
			}

			const breakdown = response?.data?.breakdown;

			if (breakdown) {
				if (Number(breakdown.previousOutstanding) > 0) {
					toast.success(
						`Reminder sent: ${fmtReminderAmount(breakdown.totalDue)} `,
						{
							description:
								`Current installment: ${fmtReminderAmount(
									breakdown.currentInstallment,
								)
								} + Previous outstanding: ${fmtReminderAmount(
									breakdown.previousOutstanding,
								)
								} `,
						},
					);
				} else {
					toast.success(
						`Reminder sent: ${fmtReminderAmount(breakdown.totalDue)} `,
					);
				}
			} else {
				toast.success("Normal reminder sent");
			}

			setReminderOpen(null);
			setReminderData({
				dueDate: "",
				milestoneName: "",
				installmentId: null,
				language: "en",
			});
		} catch (err) {
			console.error("Reminder send failed:", err);
		}
	};

	// ✅ Updated to accept extra data for WhatsApp and reset language
	const openReminderDialog = (bookingId, type, extraData = null, booking = null) => {
		setReminderOpen(bookingId);
		setReminderType(type);
		setReminderBooking(booking);

		if (type === "whatsapp" && extraData) {
			setReminderData({
				dueDate: "",
				milestoneName: "",
				installmentId: extraData.installmentId,
				language: "en",
			});
		} else {
			setReminderData({
				dueDate: "",
				milestoneName: "",
				installmentId: null,
				language: "en",
			});
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
								<TableHead className="font-semibold text-muted-foreground">
									Property Details
								</TableHead>

								<TableHead className="text-right w-[180px] min-w-[180px] text-nowrap font-semibold text-muted-foreground">
									Total Paid
								</TableHead>
								<TableHead className="text-right text-nowrap font-semibold text-muted-foreground">
									Remaining
								</TableHead>
								<TableHead className="text-nowrap font-semibold text-muted-foreground">Next Installment</TableHead>
								<TableHead className="text-center text-nowrap font-semibold text-muted-foreground">
									History
								</TableHead>
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
									<TableCell className="min-w-[200px]">
										<div className="flex flex-col text-xs">
											{/* Flat */}
											<div>
												Flat: {b.flat?.flatNumber || "—"}
											</div>

											{/* Floor */}
											<div>
												Floor: {b.flat?.floor || "—"}
											</div>

											{/* Tower */}
											<div>
												Tower: {b.flat?.tower || "—"}
											</div>

											{/* Project */}
											<div className="text-muted-foreground">
												Project: {b.projectName || "N/A"}
											</div>
										</div>
									</TableCell>
									<TableCell className="text-right w-[180px] min-w-[180px] font-medium tabular-nums">
										<div>
											Amount Paid: {formatINR(b.totalPaid - (b.gstPaid || 0))}
										</div>

										{b.gstPaid > 0 && (
											<div className="text-xs text-muted-foreground">
												GST Paid: {formatINR(b.gstPaid)}
											</div>
										)}

										<div className="font-semibold text-success">
											Total: {formatINR(b.totalPaid)}
										</div>
									</TableCell>
									<TableCell className="text-right font-bold text-destructive tabular-nums">
										{formatINR(b.remainingAmount)}
									</TableCell>
									<TableCell className="text-xs">
										{b.installmentSummary?.pendingInstallments > 0 ? (
											(() => {
												const nextInstallment = b.installments?.find(
													(i) => i.status === "pending"
												);

												return nextInstallment ? (
													<div className="flex flex-col gap-0.5">
														<span className="font-semibold text-foreground tabular-nums">
															{formatINR(nextInstallment.amount)}
														</span>

														<span className="text-[11px] text-muted-foreground">
															Reminder Due:{" "}
															{nextInstallment.reminderDueDate
																? formatDate(nextInstallment.reminderDueDate)
																: "—"}
														</span>

														<span className="text-[11px] text-muted-foreground">
															Last Reminder:{" "}
															{nextInstallment.lastReminderSentAt
																? formatDate(nextInstallment.lastReminderSentAt)
																: "—"}
														</span>

														<span className="text-[11px] text-muted-foreground">
															Last Reminder Amount:{" "}
															{formatINR(nextInstallment.lastReminderAmount || 0)}
														</span>
													</div>
												) : (
													<Badge variant="secondary">No Pending Installment</Badge>
												);
											})()
										) : (
											<Badge
												variant="secondary"
												className="bg-success/10 text-success border-none hover:bg-success/20 pointer-events-none"
											>
												All Paid
											</Badge>
										)}
									</TableCell>
									<TableCell>
										<div className="flex flex-col items-center gap-1">
											<button
												type="button"
												onClick={() => openBookingHistory(b.bookingId)}
												className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer whitespace-nowrap"
											>
												<History className="h-3.5 w-3.5" />
												View Reminder History
											</button>

											<button
												type="button"
												onClick={() => {
													const pendingInstallment = b.installments?.find(
														(i) => i.status === "pending"
													);

													if (pendingInstallment) {
														openInstallmentHistory(
															pendingInstallment._id || pendingInstallment.id
														);
													} else {
														toast.error("No pending installment found.");
													}
												}}
												className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer whitespace-nowrap"
											>
												<History className="h-3.5 w-3.5" />
												View Installment History
											</button>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex gap-1.5 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
											{/* Email - Normal */}
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
												title="Send Normal Reminder"
												onClick={() => openReminderDialog(b.bookingId, "normal", null, b)}
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
												onClick={() => openReminderDialog(b.bookingId, "penalty", null, b)}
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
													const pendingInstallment = b.installments?.find(
														(i) => i.status === "pending"
													);

													if (pendingInstallment) {
														const id = pendingInstallment._id || pendingInstallment.id;
														openReminderDialog(
															b.bookingId,
															"whatsapp",
															{ installmentId: id },
															b,
														);
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

			{
				!loading && pagination && pagination.total > 0 && (
					<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
						<div className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
							Showing page {pagination.page} of {pagination.pages}{" "}
							<span className="hidden xs:inline">(Total: {pagination.total} bookings)</span>
							<span className="xs:hidden">({pagination.total} total)</span>
						</div>

						<div className="flex w-full gap-2 sm:w-auto">
							<Button
								variant="outline"
								size="sm"
								className="flex-1 sm:flex-none"
								onClick={() => setCurrentPage((prev) => prev - 1)}
								disabled={pagination.page <= 1}
							>
								Previous
							</Button>

							<Button
								variant="outline"
								size="sm"
								className="flex-1 sm:flex-none"
								onClick={() => setCurrentPage((prev) => prev + 1)}
								disabled={pagination.page >= pagination.pages}
							>
								Next
							</Button>
						</div>
					</div>
				)
			}

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

								{reminderType !== "whatsapp" && reminderBooking && (() => {
									const pendingInstallment = reminderBooking.installments?.find(
										(i) => i.status === "pending",
									);

									if (!pendingInstallment) return null;

									const currentAmount = Math.max(
										0,
										Number(pendingInstallment.amount || 0) -
										Number(pendingInstallment.paidAmount || 0),
									);

									const arrear = calculateArrear(
										reminderBooking.installments,
										pendingInstallment.installmentNumber,
									);

									const totalDue = currentAmount + arrear;

									return (
										<div className="rounded-lg border bg-muted/30 p-3 space-y-2">
											<div className="text-sm font-medium">
												Reminder Amount
											</div>

											<div className="space-y-1 text-sm">
												<div className="flex justify-between gap-4">
													<span className="text-muted-foreground">
														Current installment
													</span>
													<span className="tabular-nums">
														{fmtReminderAmount(currentAmount)}
													</span>
												</div>

												{arrear > 0 && (
													<div className="flex justify-between gap-4">
														<span className="text-muted-foreground">
															Previous outstanding
														</span>
														<span className="text-destructive tabular-nums">
															{fmtReminderAmount(arrear)}
														</span>
													</div>
												)}

												<div className="border-t pt-2 flex justify-between gap-4">
													<span className="font-medium">
														Total reminder amount
													</span>
													<span className="font-semibold tabular-nums">
														{fmtReminderAmount(totalDue)}
													</span>
												</div>
											</div>

											{arrear > 0 && (
												<p className="text-xs text-amber-600">
													Previous outstanding amount will be included in this
													reminder.
												</p>
											)}
										</div>
									);
								})()}

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

			<ReminderHistoryModal
				open={historyOpen}
				onOpenChange={(v) => {
					setHistoryOpen(v);
					if (!v) {
						clearReminderHistory();
						setHistoryBookingId(null);
					}
				}}
				loading={reminderHistoryLoading}
				data={reminderHistory}
				type={historyType}
				pagination={historyType === "booking" ? reminderHistoryPagination : undefined}
				onPageChange={historyType === "booking" ? handleHistoryPageChange : undefined}
			/>
		</div>
	);
}