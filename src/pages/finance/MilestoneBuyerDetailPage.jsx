import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { formatDate, formatINR } from "@/lib/helpers";
import { StatCard } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusVariant = (status) => {
	if (status === "paid") return "success";
	if (status === "partial" || status === "pending") return "warning";
	return "destructive";
};

function CollapsibleMilestone({ milestone }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="border-b last:border-b-0">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="flex w-full cursor-pointer items-center gap-4 px-2 py-4 text-left transition-colors hover:bg-muted/30"
			>
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<p className="font-medium text-foreground">
							{milestone.milestone}
						</p>

						<Badge variant={statusVariant(milestone.status)}>
							{milestone.status}
						</Badge>
					</div>

					<p className="mt-1 text-xs text-muted-foreground">
						{milestone.installmentCount} installment
						{milestone.installmentCount !== 1 ? "s" : ""}
					</p>
				</div>

				<div className="shrink-0 text-right">
					<p className="text-xs text-muted-foreground">
						Paid / Total
					</p>

					<p className="text-sm font-semibold">
						{formatINR(milestone.totalPaid)} /{" "}
						{formatINR(milestone.totalAmount)}
					</p>

					{milestone.totalRemaining > 0 && (
						<p className="mt-0.5 text-xs text-warning">
							{formatINR(milestone.totalRemaining)} remaining
						</p>
					)}
				</div>

				<ChevronDown
					className={`h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""
						}`}
				/>
			</button>

			{open && (
				<div className="mb-4 ml-2 overflow-hidden rounded-md border bg-muted/10">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-12">#</TableHead>
									<TableHead>Description</TableHead>
									<TableHead className="text-right">
										Amount
									</TableHead>
									<TableHead className="text-right">
										Paid
									</TableHead>
									<TableHead className="text-right">
										Remaining
									</TableHead>
									<TableHead>GST</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Due Date</TableHead>
									<TableHead>Payment</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{milestone.installments.map((inst) => (
									<TableRow key={inst.installmentId}>
										<TableCell className="text-muted-foreground">
											{inst.installmentNumber}
										</TableCell>

										<TableCell>
											<div>
												<p className="font-medium">
													{inst.description}
												</p>

												{inst.voucherNumber && (
													<p className="mt-1 text-xs text-muted-foreground">
														Voucher:{" "}
														{inst.voucherNumber}
													</p>
												)}
											</div>
										</TableCell>

										<TableCell className="text-right font-medium">
											{formatINR(inst.amount)}
										</TableCell>

										<TableCell className="text-right text-success">
											{formatINR(inst.paidAmount)}
										</TableCell>

										<TableCell className="text-right">
											{inst.remaining > 0 ? (
												<span className="text-warning">
													{formatINR(inst.remaining)}
												</span>
											) : (
												<span className="text-muted-foreground">
													—
												</span>
											)}
										</TableCell>

										<TableCell>
											<div className="text-sm">
												<p>
													{formatINR(inst.gstAmount)}
												</p>
												<p className="text-xs text-muted-foreground">
													Paid:{" "}
													{formatINR(inst.gstPaid)}
												</p>
											</div>
										</TableCell>

										<TableCell>
											<Badge
												variant={statusVariant(
													inst.status
												)}
											>
												{inst.status}
											</Badge>
										</TableCell>

										<TableCell className="text-muted-foreground">
											{inst.dueDate
												? formatDate(inst.dueDate)
												: "—"}
										</TableCell>

										<TableCell>
											{inst.paymentMode ? (
												<div>
													<p className="font-medium">
														{inst.paymentMode}
													</p>

													{inst.receiptNumber && (
														<p className="text-xs text-muted-foreground">
															Receipt:{" "}
															{inst.receiptNumber}
														</p>
													)}

													{inst.paidAt && (
														<p className="text-xs text-muted-foreground">
															{formatDate(
																inst.paidAt
															)}
														</p>
													)}
												</div>
											) : (
												<span className="text-muted-foreground">
													Not paid
												</span>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			)}
		</div>
	);
}

export function MilestoneBuyerDetailPage() {
	const { bookingId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const { fetchMilestoneBuyerDetails, loading } = useProject();
	const [data, setData] = useState(location.state?.initialData || null);

	const handleLoad = async () => {
		const details = await fetchMilestoneBuyerDetails(bookingId);
		if (details) setData(details);
	};

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 p-10">
				<p className="text-muted-foreground">No buyer data loaded yet.</p>
				<Button onClick={handleLoad} disabled={loading}>
					{loading ? "Loading..." : "Load Buyer Details"}
				</Button>
			</div>
		);
	}

	const { buyer, project, flat, customerType, appliedMilestoneFilter, summary, milestoneBreakdown, paymentHistory, booking } = data;

	return (
		<div className="space-y-4 p-4">
			<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
				<ArrowLeft className="mr-1.5 h-4 w-4" />
				Back to Buyers
			</Button>

			{/* 1. Buyer Header */}
			<Card>
				<CardContent className="space-y-3 p-4">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<h2 className="font-display text-lg font-semibold text-foreground">
							{buyer.name?.trim()}
						</h2>
						<div className="flex items-center gap-2">
							{customerType && (
								<Badge variant="secondary">{customerType.toUpperCase()}</Badge>
							)}
							<span className="text-sm font-normal text-muted-foreground">
								{data.bookingReferenceNumber}
							</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
						<div>Phone: {buyer.phone}</div>
						<div>Email: {buyer.email}</div>
						<div>Project: {project.name?.trim()}</div>
						<div>Location: {project.location}</div>
						<div>Flat: {flat.number} ({flat.tower}, Floor {flat.floor})</div>
						<div>Flat Price: {formatINR(flat.flatPrice)}</div>
					</div>
				</CardContent>
			</Card>

			{/* 2. Booking Overview — whole-booking totals, shown before the scoped milestone summary */}
			<Card>
				<CardContent className="space-y-3 p-4">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-medium text-muted-foreground">Booking Overview</h3>
						<Badge variant={statusVariant(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
					</div>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						<StatCard
							label="Booking Amount"
							value={formatINR(booking.bookingAmount)}
							size="compact"
							accent="info"
						/>
						<StatCard
							label="Total Paid"
							value={formatINR(booking.totalPaid)}
							size="compact"
							accent="success"
						/>
						<StatCard
							label="Remaining"
							value={formatINR(booking.remainingAmount)}
							size="compact"
							accent="warning"
						/>
						<StatCard
							label="Booking Date"
							value={formatDate(booking.bookingDate)}
							size="compact"
							accent="primary"
						/>
					</div>
				</CardContent>
			</Card>

			{/* 3. Payment Summary — scoped to the applied milestone filter */}
			<Card>
				<CardContent className="space-y-3 p-4">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">Payment Summary</h3>
							{appliedMilestoneFilter && (
								<p className="text-xs text-muted-foreground">
									Filtered by milestone: <span className="font-medium">{appliedMilestoneFilter}</span>
								</p>
							)}
						</div>
						<Badge variant={statusVariant(summary.status)}>{summary.status}</Badge>
					</div>

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						<StatCard
							label="Total Amount"
							value={formatINR(summary.totalAmount)}
							size="compact"
							accent="info"
						/>
						<StatCard
							label="Total Paid"
							value={formatINR(summary.totalPaid)}
							size="compact"
							accent="success"
						/>
						<StatCard
							label="Total Remaining"
							value={formatINR(summary.totalRemaining)}
							size="compact"
							accent="warning"
						/>
						<StatCard
							label="Installments"
							value={`${summary.paidInstallments}/${summary.totalInstallments} paid`}
							size="compact"
							accent="primary"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						<StatCard
							label="GST Total"
							value={formatINR(summary.totalGst)}
							size="compact"
							accent="info"
						/>
						<StatCard
							label="GST Paid"
							value={formatINR(summary.totalGstPaid)}
							size="compact"
							accent="success"
						/>
						<StatCard
							label="GST Remaining"
							value={formatINR(summary.totalGstRemaining)}
							size="compact"
							accent="warning"
						/>
					</div>
				</CardContent>
			</Card>

			{/* 4. Milestone Breakdown */}
			<Card>
				<CardContent className="p-4">
					<h3 className="mb-2 text-sm font-medium text-muted-foreground">Milestone Breakdown</h3>
					{milestoneBreakdown.map((m) => (
						<CollapsibleMilestone key={m.milestone} milestone={m} />
					))}
				</CardContent>
			</Card>

			{/* 5. Payment History — transaction log, last since it's the most granular */}
			<Card>
				<CardContent className="space-y-2 p-4">
					<h3 className="mb-2 text-sm font-medium text-muted-foreground">Payment History</h3>
					{paymentHistory.length === 0 ? (
						<p className="text-sm text-muted-foreground">No payments recorded yet.</p>
					) : (
						paymentHistory.map((p, idx) => (
							<div key={idx} className="flex flex-wrap items-center justify-between border-b py-2 text-sm last:border-b-0">
								<span>{formatDate(p.date)}</span>
								<span>{p.description}</span>
								<span>{formatINR(p.paidAmount)}</span>
								<span className="text-muted-foreground">{p.paymentMode}</span>
								<span className="text-muted-foreground">{p.receiptNumber}</span>
							</div>
						))
					)}
				</CardContent>
			</Card>
		</div>
	);
}