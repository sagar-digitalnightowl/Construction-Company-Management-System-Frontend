
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { ReminderHistoryModal } from "@/components/finance/ReminderHistoryModal";
import { toast } from "sonner";
import { projectApi } from "@/api";
import { FinanceBookingsTable } from "./FinanceBookingReminder/FinanceBookingsTable";
import { ReminderDialog } from "./FinanceBookingReminder/ReminderDialog";

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

			<FinanceBookingsTable
				bookings={bookings}
				loading={loading}
				openBookingHistory={openBookingHistory}
				openInstallmentHistory={openInstallmentHistory}
				openReminderDialog={openReminderDialog}
				searchQuery={searchQuery}
				clearSearch={clearSearch}
			/>

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
			<ReminderDialog
				reminderOpen={reminderOpen}
				setReminderOpen={setReminderOpen}
				reminderType={reminderType}
				reminderData={reminderData}
				setReminderData={setReminderData}
				reminderBooking={reminderBooking}
				loading={loading}
				handleSendReminder={handleSendReminder}
				calculateArrear={calculateArrear}
				fmtReminderAmount={fmtReminderAmount}
			/>

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