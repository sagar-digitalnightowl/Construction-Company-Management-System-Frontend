import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useBooking } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/authStore";
import { projectApi } from "@/api/projectApi";
import { formatINR } from "@/lib/helpers";
import { toast } from "sonner";

const ALL = "all";
const PAGE_LIMIT = 10;
// GST deferred is admin panel only
const ADD_AMOUNT_ROLES = ["admin"];

function SummaryCard({ label, value }) {
	return (
		<div className="rounded-md border border-border/80 bg-card p-4">
			<div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
				{label}
			</div>
			<div className="mt-1.5 font-display text-xl font-semibold text-foreground">{value}</div>
		</div>
	);
}

export default function GstDeferredBookings() {
	const navigate = useNavigate();
	const { current } = useAuthStore();
	const {
		gstDeferredBookings,
		gstDeferredSummary,
		gstDeferredPagination,
		fetchGstDeferredBookings,
		addGstDeferredAmount,
		updateGstDeferredAmount,
		resetGstDeferredAmount,
		loading,
		managersList,
		fetchManagersList,
	} = useBooking();

	const [projects, setProjects] = useState([]);
	const [towers, setTowers] = useState([]);
	const [projectId, setProjectId] = useState(ALL);
	const [towerName, setTowerName] = useState(ALL);
	const [status, setStatus] = useState(ALL);
	const [businessManagerId, setBusinessManagerId] = useState(ALL);
	const [projectManagerId, setProjectManagerId] = useState(ALL);
	const [teamManagerId, setTeamManagerId] = useState(ALL);
	const [labelInput, setLabelInput] = useState("");
	const [label, setLabel] = useState("");
	const [page, setPage] = useState(1);
	const [refreshKey, setRefreshKey] = useState(0);

	// Add Amount modal state
	const [selected, setSelected] = useState(null);
	const [amountToAdd, setAmountToAdd] = useState("");
	const [note, setNote] = useState("");
	const [submitting, setSubmitting] = useState(false);

	// Edit modal state (replaces the amount)
	const [editTarget, setEditTarget] = useState(null);
	const [newAmount, setNewAmount] = useState("");
	const [editNote, setEditNote] = useState("");
	const [editSubmitting, setEditSubmitting] = useState(false);

	// Reset confirmation state
	const [resetTarget, setResetTarget] = useState(null);
	const [resetting, setResetting] = useState(false);

	const canAddAmount = ADD_AMOUNT_ROLES.includes(current?.role);

	// Debounce the label search
	useEffect(() => {
		const timer = setTimeout(() => setLabel(labelInput), 500);
		return () => clearTimeout(timer);
	}, [labelInput]);

	// Load projects and managers for the filters
	useEffect(() => {
		const loadProjects = async () => {
			try {
				const res = await projectApi.getAll({ page: 1, limit: 100 });
				setProjects(res.data?.data?.projects || []);
			} catch (err) {
				toast.error("Failed to load projects for filter");
			}
		};
		loadProjects();
		fetchManagersList({ includeZero: true });
	}, [fetchManagersList]);

	// Load towers when a project is picked
	useEffect(() => {
		if (projectId === ALL) {
			setTowers([]);
			return;
		}
		const loadTowers = async () => {
			try {
				const res = await projectApi.towers.getAll(projectId);
				setTowers(res.data?.data?.towers || []);
			} catch (err) {
				setTowers([]);
				toast.error("Failed to load towers");
			}
		};
		loadTowers();
	}, [projectId]);

	const handleProjectChange = (value) => {
		setProjectId(value);
		setTowerName(ALL);
	};

	// Go back to page 1 whenever a filter changes
	useEffect(() => {
		setPage(1);
	}, [projectId, towerName, status, businessManagerId, projectManagerId, teamManagerId, label]);

	useEffect(() => {
		fetchGstDeferredBookings({
			page,
			limit: PAGE_LIMIT,
			projectId: projectId === ALL ? undefined : projectId,
			towerName: towerName === ALL ? undefined : towerName,
			status: status === ALL ? undefined : status,
			businessManagerId: businessManagerId === ALL ? undefined : businessManagerId,
			projectManagerId: projectManagerId === ALL ? undefined : projectManagerId,
			teamManagerId: teamManagerId === ALL ? undefined : teamManagerId,
			gstDeferredLabel: label.trim() || undefined,
		});
	}, [
		page,
		projectId,
		towerName,
		status,
		businessManagerId,
		projectManagerId,
		teamManagerId,
		label,
		refreshKey,
		fetchGstDeferredBookings,
	]);

	const openAddAmount = (booking) => {
		setSelected(booking);
		setAmountToAdd("");
		setNote("");
	};

	const closeAddAmount = () => {
		if (submitting) return;
		setSelected(null);
	};

	const submitAddAmount = async () => {
		const amount = Number(amountToAdd);
		if (!amount || amount <= 0) {
			toast.error("Enter an amount greater than 0");
			return;
		}
		setSubmitting(true);
		const result = await addGstDeferredAmount(selected._id, {
			amount,
			note: note.trim() || undefined,
		});
		setSubmitting(false);
		// The hook returns null on failure and shows the error itself
		if (result !== null) {
			setSelected(null);
			setRefreshKey((k) => k + 1);
		}
	};

	const openEdit = (booking) => {
		setEditTarget(booking);
		setNewAmount(String(booking.gstDeferredAmount ?? 0));
		setEditNote("");
	};

	const closeEdit = () => {
		if (editSubmitting) return;
		setEditTarget(null);
	};

	const submitEdit = async () => {
		const amount = Number(newAmount);
		if (newAmount === "" || Number.isNaN(amount) || amount < 0) {
			toast.error("Enter an amount of 0 or more");
			return;
		}
		setEditSubmitting(true);
		const result = await updateGstDeferredAmount(editTarget._id, {
			amount,
			note: editNote.trim() || undefined,
		});
		setEditSubmitting(false);
		if (result !== null) {
			setEditTarget(null);
			setRefreshKey((k) => k + 1);
		}
	};

	const confirmReset = async () => {
		setResetting(true);
		const result = await resetGstDeferredAmount(resetTarget._id);
		setResetting(false);
		if (result !== null) {
			setResetTarget(null);
			setRefreshKey((k) => k + 1);
		}
	};

	const summary = gstDeferredSummary || {};
	const totalPages = gstDeferredPagination?.pages || 0;

	const managerSelect = (value, onChange, placeholder) => (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full bg-background">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={ALL}>All</SelectItem>
				{managersList.map(({ manager }) => (
					<SelectItem key={manager._id} value={manager._id}>
						{manager.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Real Estate"
				title="GST Deferred Bookings"
				description="Bookings registered at the lower amount, with the GST added later."
				actions={
					<Button variant="outline" onClick={() => navigate("/bookings")}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Bookings
					</Button>
				}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
				<SummaryCard label="Total deferred bookings" value={summary.totalBookings ?? 0} />
				<SummaryCard label="Total original amount" value={formatINR(summary.totalOriginalAmount ?? 0)} />
				<SummaryCard label="Total deferred amount (GST)" value={formatINR(summary.totalDeferredAmount ?? 0)} />
				<SummaryCard label="Total with deferred" value={formatINR(summary.totalAmountWithDeferred ?? 0)} />
				<SummaryCard label="Pending (no GST added yet)" value={summary.pendingDeferredCount ?? 0} />
				<SummaryCard label="Completed (GST added)" value={summary.completedDeferredCount ?? 0} />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				<Select value={projectId} onValueChange={handleProjectChange}>
					<SelectTrigger className="w-full bg-background">
						<SelectValue placeholder="All projects" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All projects</SelectItem>
						{projects.map((p) => (
							<SelectItem key={p._id} value={p._id}>
								{p.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={towerName} onValueChange={setTowerName} disabled={projectId === ALL}>
					<SelectTrigger className="w-full bg-background">
						<SelectValue placeholder={projectId === ALL ? "Pick a project first" : "All towers"} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All towers</SelectItem>
						{towers.map((t) => (
							<SelectItem key={t.towerName} value={t.towerName}>
								{t.towerName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className="w-full bg-background">
						<SelectValue placeholder="All statuses" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>All statuses</SelectItem>
						<SelectItem value="booked">Booked</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
					</SelectContent>
				</Select>

				<div className="relative">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						className="pl-8 bg-background"
						placeholder="Search GST label"
						value={labelInput}
						onChange={(e) => setLabelInput(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{managerSelect(businessManagerId, setBusinessManagerId, "Business manager")}
				{managerSelect(projectManagerId, setProjectManagerId, "Project manager")}
				{managerSelect(teamManagerId, setTeamManagerId, "Team manager")}
			</div>

			<div className="overflow-x-auto rounded-md border border-border/80 bg-card">
				<table className="w-full text-sm">
					<thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
						<tr>
							<th className="px-4 py-3 font-medium">Ref no</th>
							<th className="px-4 py-3 font-medium">Client</th>
							<th className="px-4 py-3 font-medium">Project</th>
							<th className="px-4 py-3 font-medium">Tower / flat</th>
							<th className="px-4 py-3 font-medium text-right">Original</th>
							<th className="px-4 py-3 font-medium text-right">Deferred</th>
							<th className="px-4 py-3 font-medium text-right">Total</th>
							<th className="px-4 py-3 font-medium">Status</th>
							<th className="px-4 py-3 font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading && gstDeferredBookings.length === 0 &&
							Array.from({ length: 5 }).map((_, i) => (
								<tr key={i} className="border-t">
									<td colSpan={9} className="px-4 py-3">
										<Skeleton className="h-5 w-full" />
									</td>
								</tr>
							))}

						{!loading && gstDeferredBookings.length === 0 && (
							<tr className="border-t">
								<td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
									No GST deferred bookings found
								</td>
							</tr>
						)}

						{gstDeferredBookings.map((b) => (
							<tr key={b._id} className="border-t hover:bg-muted/20">
								<td className="px-4 py-3 font-medium">{b.bookingReferenceNumber || "—"}</td>
								<td className="px-4 py-3">{b.clientId?.name || "—"}</td>
								<td className="px-4 py-3">{b.projectId?.name || "—"}</td>
								<td className="px-4 py-3">
									{b.flatSnapshot?.towerName || "—"} / {b.flatSnapshot?.flatNumber || "—"}
								</td>
								<td className="px-4 py-3 text-right">{formatINR(b.originalBookingAmount ?? b.bookingAmount)}</td>
								<td className="px-4 py-3 text-right">{formatINR(b.gstDeferredAmount ?? 0)}</td>
								<td className="px-4 py-3 text-right">{formatINR(b.totalAmountWithDeferred)}</td>
								<td className="px-4 py-3">
									<span
										className={
											b.gstDeferredAmountAdded
												? "rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success"
												: "rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning"
										}
									>
										{b.gstDeferredAmountAdded ? "Completed" : "Pending"}
									</span>
								</td>
								<td className="px-4 py-3">
									{canAddAmount && (
										<div className="flex flex-wrap gap-2">
											<Button variant="outline" size="sm" onClick={() => openAddAmount(b)}>
												Add Amount
											</Button>
											<Button variant="outline" size="sm" onClick={() => openEdit(b)}>
												Edit
											</Button>
											<Button variant="outline" size="sm" onClick={() => setResetTarget(b)}>
												Reset
											</Button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">
						Page {page} of {totalPages} · {gstDeferredPagination.total} records
					</span>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
							<ChevronLeft className="h-4 w-4 mr-1" />
							Previous
						</Button>
						<Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}>
							Next
							<ChevronRight className="h-4 w-4 ml-1" />
						</Button>
					</div>
				</div>
			)}

			{/* Add Amount: adds to the existing amount */}
			<Dialog open={Boolean(selected)} onOpenChange={(open) => !open && closeAddAmount()}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Add GST Deferred Amount</DialogTitle>
						<DialogDescription>
							Adds to any amount already recorded for this booking.
						</DialogDescription>
					</DialogHeader>

					{selected && (
						<div className="space-y-4">
							<div className="rounded-md border bg-muted/30 p-3 text-sm space-y-1">
								<div>
									<span className="text-muted-foreground">Booking: </span>
									<span className="font-medium">{selected.bookingReferenceNumber || "—"}</span>
								</div>
								<div>
									<span className="text-muted-foreground">Client: </span>
									{selected.clientId?.name || "—"}
								</div>
								<div>
									<span className="text-muted-foreground">Unit: </span>
									{selected.projectId?.name || "—"} · {selected.flatSnapshot?.towerName || "—"} /{" "}
									{selected.flatSnapshot?.flatNumber || "—"}
								</div>
								<div>
									<span className="text-muted-foreground">Original amount: </span>
									{formatINR(selected.originalBookingAmount ?? selected.bookingAmount)}
								</div>
								<div>
									<span className="text-muted-foreground">Current deferred amount: </span>
									{formatINR(selected.gstDeferredAmount ?? 0)}
								</div>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="gst-amount">Amount to add (₹)</Label>
								<Input
									id="gst-amount"
									type="number"
									min="0"
									step="any"
									value={amountToAdd}
									onChange={(e) => setAmountToAdd(e.target.value)}
									placeholder="e.g. 5000"
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="gst-note">Note</Label>
								<Input
									id="gst-note"
									value={note}
									onChange={(e) => setNote(e.target.value)}
									placeholder="e.g. GST 5% on booking amount"
								/>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={closeAddAmount} disabled={submitting}>
							Cancel
						</Button>
						<Button onClick={submitAddAmount} disabled={submitting || !amountToAdd}>
							{submitting ? "Adding..." : "Add Amount"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit: replaces the amount with the new value */}
			<Dialog open={Boolean(editTarget)} onOpenChange={(open) => !open && closeEdit()}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Edit GST Deferred Amount</DialogTitle>
						<DialogDescription>
							Replaces the current amount. Enter 0 to clear it.
						</DialogDescription>
					</DialogHeader>

					{editTarget && (
						<div className="space-y-4">
							<div className="rounded-md border bg-muted/30 p-3 text-sm space-y-1">
								<div>
									<span className="text-muted-foreground">Booking: </span>
									<span className="font-medium">{editTarget.bookingReferenceNumber || "—"}</span>
								</div>
								<div>
									<span className="text-muted-foreground">Client: </span>
									{editTarget.clientId?.name || "—"}
								</div>
								<div>
									<span className="text-muted-foreground">Original amount: </span>
									{formatINR(editTarget.originalBookingAmount ?? editTarget.bookingAmount)}
								</div>
								<div>
									<span className="text-muted-foreground">Current deferred amount: </span>
									{formatINR(editTarget.gstDeferredAmount ?? 0)}
								</div>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="gst-new-amount">New deferred amount (₹)</Label>
								<Input
									id="gst-new-amount"
									type="number"
									min="0"
									step="any"
									value={newAmount}
									onChange={(e) => setNewAmount(e.target.value)}
								/>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="gst-edit-note">Note</Label>
								<Input
									id="gst-edit-note"
									value={editNote}
									onChange={(e) => setEditNote(e.target.value)}
									placeholder="e.g. Corrected GST amount"
								/>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={closeEdit} disabled={editSubmitting}>
							Cancel
						</Button>
						<Button onClick={submitEdit} disabled={editSubmitting || newAmount === ""}>
							{editSubmitting ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Reset: confirm before clearing the amount to 0 */}
			<AlertDialog open={Boolean(resetTarget)} onOpenChange={(open) => !open && !resetting && setResetTarget(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Reset GST deferred amount?</AlertDialogTitle>
						<AlertDialogDescription>
							{resetTarget
								? `The deferred amount for ${resetTarget.bookingReferenceNumber || "this booking"} (${formatINR(resetTarget.gstDeferredAmount ?? 0)}) will be set back to ₹0.`
								: ""}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={resetting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								confirmReset();
							}}
							disabled={resetting}
						>
							{resetting ? "Resetting..." : "Reset to ₹0"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
