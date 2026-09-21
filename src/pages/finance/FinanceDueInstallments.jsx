import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
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
import { Calendar, ChevronLeft, ChevronRight, Loader2, MessageCircle, Search, History } from "lucide-react";
import { ReminderHistoryModal } from "@/components/finance/ReminderHistoryModal";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceDueInstallments() {
	const {
		dueInstallments,
		duePagination,
		fetchDueInstallments,
		sendWhatsAppReminders,
		loading,
		reminderHistory,
		reminderHistoryLoading,
		reminderHistoryPagination,
		fetchBookingReminderHistory,
		fetchInstallmentReminderHistory,
		clearReminderHistory,
	} = useFinance();

	const [currentPage, setCurrentPage] = useState(1);
	const [dueDateFilter, setDueDateFilter] = useState("");
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [overdueOnly, setOverdueOnly] = useState(false);
	const [selectedIds, setSelectedIds] = useState([]);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState("en");
	const [historyOpen, setHistoryOpen] = useState(false);
	const [historyBookingId, setHistoryBookingId] = useState(null);
	const [historyType, setHistoryType] = useState("booking");

	const openBookingHistory = async (bookingId) => {
		if (!bookingId) {
			toast.error("Booking reference not found for this installment.");
			return;
		}
		setHistoryOpen(true);
		setHistoryType("booking");
		setHistoryBookingId(bookingId);
		await fetchBookingReminderHistory(bookingId, { page: 1, limit: 20 });
	};

	const handleHistoryPageChange = (newPage) => {
		if (historyType === "booking" && historyBookingId) {
			fetchBookingReminderHistory(historyBookingId, { page: newPage, limit: 20 });
		}
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

	// Debounce raw search input before it hits the API
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search.trim());
			setCurrentPage(1);
		}, 400);
		return () => clearTimeout(timer);
	}, [search]);

	useEffect(() => {
		fetchDueInstallments({
			page: currentPage,
			limit: 10,
			dueDate: dueDateFilter || undefined,
			overdue: overdueOnly || undefined,
			search: debouncedSearch || undefined,
		});

		setSelectedIds([]);
	}, [currentPage, dueDateFilter, overdueOnly, debouncedSearch, fetchDueInstallments]);

	const handleSelectAll = (checked) => {
		if (checked) {
			setSelectedIds(dueInstallments.map((item) => item.installment.id));
		} else {
			setSelectedIds([]);
		}
	};

	const handleSelectOne = (checked, id) => {
		if (checked) {
			setSelectedIds((prev) => [...prev, id]);
		} else {
			setSelectedIds((prev) => prev.filter((item) => item !== id));
		}
	};

	// ✅ Opens the dialog instead of sending directly
	const handleOpenDialog = () => {
		if (selectedIds.length === 0) {
			toast.error("Please select at least one installment.");
			return;
		}
		setIsDialogOpen(true);
	};

	// ✅ Actual send function called from the dialog
	const handleConfirmSend = async () => {
		const success = await sendWhatsAppReminders(selectedIds, selectedLanguage);

		if (success) {
			setSelectedIds([]);
			setIsDialogOpen(false);
			setSelectedLanguage("en");

			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "WhatsApp reminders sent successfully.",
				confirmButtonColor: "#16a34a",
				timer: 2000,
				showConfirmButton: false,
			});
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
				<div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-end">
					<div className="space-y-1.5">
						<Label>Search</Label>

						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

							<Input
								type="text"
								placeholder="Search client, phone, project..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full pl-9 sm:w-[240px]"
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label>Due Date</Label>

						<div className="relative">
							<Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

							<Input
								type="date"
								value={dueDateFilter}
								onChange={(e) => {
									setDueDateFilter(e.target.value);
									setCurrentPage(1);
								}}
								className="w-full pl-9 sm:w-[180px]"
							/>
						</div>
					</div>

					<div className="flex items-center gap-2 sm:mb-2">
						<Checkbox
							id="overdue"
							checked={overdueOnly}
							onCheckedChange={(val) => {
								setOverdueOnly(val);
								setCurrentPage(1);
							}}
						/>

						<Label
							htmlFor="overdue"
							className="cursor-pointer whitespace-nowrap"
						>
							Show Overdue Only
						</Label>
					</div>
				</div>

				<Button
					onClick={handleOpenDialog}
					disabled={selectedIds.length === 0 || loading}
					className="w-full bg-green-600 text-white hover:bg-green-700 lg:w-auto"
				>
					{loading && (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					)}

					<MessageCircle className="mr-2 h-4 w-4" />

					Send WhatsApp to Selected ({selectedIds.length})
				</Button>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader className="bg-muted/10">
							<TableRow className="hover:bg-transparent">
								<TableHead className="w-12 min-w-12 text-center">
									<Checkbox
										checked={
											dueInstallments.length > 0 &&
											selectedIds.length === dueInstallments.length
										}
										onCheckedChange={handleSelectAll}
									/>
								</TableHead>

								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Client Details
								</TableHead>

								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Project / Flat
								</TableHead>

								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Installment Details
								</TableHead>
								<TableHead className="whitespace-nowrap text-center font-semibold text-muted-foreground">
									History
								</TableHead>
								<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
									Status
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={6} className="py-4">
										<Skeleton className="h-8 w-full mb-2" />
										<Skeleton className="h-8 w-full" />
									</TableCell>
								</TableRow>
							) : dueInstallments.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
										No due installments found.
									</TableCell>
								</TableRow>
							) : (
								dueInstallments.map((item) => {
									const id = item.installment.id;
									const isOverdue = new Date(item.installment.dueDate) < new Date();
									return (
										<TableRow key={id} className="hover:bg-muted/40">
											<TableCell className="w-12 min-w-12 text-center">
												<Checkbox
													checked={selectedIds.includes(id)}
													onCheckedChange={(checked) => handleSelectOne(checked, id)}
												/>
											</TableCell>

											<TableCell className="min-w-[180px]">
												<div className="whitespace-nowrap font-medium">
													{item.client?.name || "—"}
												</div>

												<div className="whitespace-nowrap text-xs text-muted-foreground">
													{item.client?.phone || "—"}
												</div>
											</TableCell>

											<TableCell className="min-w-[180px]">
												<div className="font-semibold text-foreground">
													Flat: {item.booking?.flatNumber || "—"}
												</div>

												<div className="text-xs text-muted-foreground">
													{item.booking?.tower || "—"}
												</div>

												<div className="text-sm text-muted-foreground">
													{item.booking?.projectName || "—"}
												</div>
											</TableCell>

											<TableCell className="text-xs whitespace-nowrap">
												<div className="flex flex-col gap-0.5 whitespace-nowrap">
													<span className="font-semibold text-destructive tabular-nums whitespace-nowrap">
														{formatINR(item.installment.dueAmount)}
													</span>

													<span className="text-[11px] text-muted-foreground whitespace-nowrap">
														Reminder Due:{" "}
														{item.installment.reminderDueDate
															? formatDate(item.installment.reminderDueDate)
															: "—"}
													</span>

													<span className="text-[11px] text-muted-foreground whitespace-nowrap">
														Last Reminder:{" "}
														{item.installment.lastReminderSentAt
															? formatDate(item.installment.lastReminderSentAt)
															: "—"}
													</span>

													<span className="text-[11px] text-muted-foreground whitespace-nowrap">
														Last Reminder Amount:{" "}
														{formatINR(item.installment.lastReminderAmount || 0)}
													</span>
												</div>
											</TableCell>

											<TableCell>
												<div className="flex flex-col items-center gap-1">
													<button
														type="button"
														onClick={() => openBookingHistory(item.booking?.id)}
														className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline whitespace-nowrap cursor-pointer"
													>
														<History className="h-3.5 w-3.5" />
														View Reminder History
													</button>

													<button
														type="button"
														onClick={() => openInstallmentHistory(id)}
														className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline whitespace-nowrap cursor-pointer"
													>
														<History className="h-3.5 w-3.5" />
														View Installment History
													</button>
												</div>
											</TableCell>

											<TableCell className="whitespace-nowrap">
												<span
													className={`text-xs font-medium capitalize ${item.installment.status?.toLowerCase() === "paid"
														? "text-success"
														: item.installment.status?.toLowerCase() === "overdue"
															? "text-destructive"
															: "text-amber-600"
														}`}
												>
													{item.installment.status || "Pending"}
												</span>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{duePagination.pages > 1 && (
				<div className="flex flex-col items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm sm:flex-row">
					<p className="text-sm text-muted-foreground">
						Page {duePagination.page} of {duePagination.pages} · {duePagination.total} total
					</p>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1 || loading}
						>
							<ChevronLeft className="mr-1 h-4 w-4" />
							Previous
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.min(duePagination.pages, p + 1))}
							disabled={currentPage === duePagination.pages || loading}
						>
							Next
							<ChevronRight className="ml-1 h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* ✅ Popup / Dialog for Bulk WhatsApp */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Send Bulk WhatsApp Reminders</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="text-sm text-muted-foreground">
							You are about to send WhatsApp reminders to <strong className="text-foreground">{selectedIds.length}</strong> selected clients.
						</div>

						<div className="space-y-1.5">
							<Label>Message Language</Label>
							<Select
								value={selectedLanguage}
								onValueChange={setSelectedLanguage}
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

					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmSend}
							disabled={loading}
							className="bg-green-600 hover:bg-green-700 text-white"
						>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Yes, Send to All
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