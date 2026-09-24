import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatINR, formatDate } from "@/lib/helpers";
import { Calendar, ChevronLeft, ChevronRight, Loader2, MessageCircle, Search } from "lucide-react";
import { ReminderHistoryModal } from "@/components/finance/ReminderHistoryModal";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { DueInstallmentsTable } from "./FinanceDueInstallments/DueInstallmentsTable";
import { BulkWhatsAppDialog } from "./FinanceDueInstallments/BulkWhatsAppDialog";

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

	const handleOpenDialog = () => {
		if (selectedIds.length === 0) {
			toast.error("Please select at least one installment.");
			return;
		}
		setIsDialogOpen(true);
	};

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

			<DueInstallmentsTable
				dueInstallments={dueInstallments}
				loading={loading}
				selectedIds={selectedIds}
				handleSelectAll={handleSelectAll}
				handleSelectOne={handleSelectOne}
				openBookingHistory={openBookingHistory}
				openInstallmentHistory={openInstallmentHistory}
				formatINR={formatINR}
				formatDate={formatDate}
			/>

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

			<BulkWhatsAppDialog
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				selectedIds={selectedIds}
				selectedLanguage={selectedLanguage}
				setSelectedLanguage={setSelectedLanguage}
				handleConfirmSend={handleConfirmSend}
				loading={loading}
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