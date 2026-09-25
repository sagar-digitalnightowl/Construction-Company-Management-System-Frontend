import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { formatDate, formatINR } from "@/lib/helpers";

const STATUS_COLORS = {
	paid: { bg: "#D4EDDA", text: "#155724" },
	partial: { bg: "#FFF3CD", text: "#856404" },
	unpaid: { bg: "#F8D7DA", text: "#721C24" },
	pending: { bg: "#F8D7DA", text: "#721C24" },
};

function StatusBadge({ status }) {
	const c = STATUS_COLORS[status] || STATUS_COLORS.unpaid;
	return (
		<span style={{ background: c.bg, color: c.text }} className="rounded-full px-3 py-1 text-xs font-semibold uppercase">
			{status}
		</span>
	);
}

function CollapsibleMilestone({ milestone }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="border-t first:border-t-0">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="flex w-full items-center justify-between py-3 text-left text-sm"
			>
				<span className="flex items-center gap-2">
					<ChevronDown
						className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
					/>
					{milestone.milestone}
				</span>
				<span className="flex items-center gap-2">
					<StatusBadge status={milestone.status} />
					{formatINR(milestone.totalPaid)} / {formatINR(milestone.totalAmount)}
				</span>
			</button>

			{open && (
				<div className="pb-3 pl-6">
					{milestone.installments.map((inst) => (
						<div
							key={inst.installmentId}
							className="flex flex-wrap items-center justify-between border-t py-2 text-sm first:border-t-0"
						>
							<span>{inst.description}</span>
							<span>{formatINR(inst.paidAmount)} / {formatINR(inst.amount)}</span>
							<StatusBadge status={inst.status} />
							<span className="text-muted-foreground">
								{inst.paidAt ? formatDate(inst.paidAt) : "Not paid"}
							</span>
						</div>
					))}
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

	const { buyer, project, flat, summary, milestoneBreakdown, paymentHistory, booking } = data;

	return (
		<div className="space-y-4 p-4">
			<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
				<ArrowLeft className="mr-1.5 h-4 w-4" />
				Back to Buyers
			</Button>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between text-lg">
						{buyer.name}
						<span className="text-sm font-normal text-muted-foreground">
							{data.bookingReferenceNumber}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
					<div>Phone: {buyer.phone}</div>
					<div>Email: {buyer.email}</div>
					<div>Project: {project.name}</div>
					<div>Flat: {flat.number} ({flat.tower}, Floor {flat.floor})</div>
					<div>Flat Price: {formatINR(flat.flatPrice)}</div>
					<div>Customer Type: {data.customerType}</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
					<div>
						<p className="text-xs text-muted-foreground">Total Amount</p>
						<p className="text-lg font-semibold">{formatINR(summary.totalAmount)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Total Paid</p>
						<p className="text-lg font-semibold">{formatINR(summary.totalPaid)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Remaining</p>
						<p className="text-lg font-semibold">{formatINR(summary.totalRemaining)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Status</p>
						<StatusBadge status={summary.status} />
					</div>
					<div>
						<p className="text-xs text-muted-foreground">GST Total</p>
						<p className="text-sm font-medium">{formatINR(summary.totalGst)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">GST Paid</p>
						<p className="text-sm font-medium">{formatINR(summary.totalGstPaid)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">GST Remaining</p>
						<p className="text-sm font-medium">{formatINR(summary.totalGstRemaining)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Installments</p>
						<p className="text-sm font-medium">
							{summary.paidInstallments} paid / {summary.partialInstallments} partial / {summary.pendingInstallments} pending
						</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Milestone Breakdown</CardTitle>
				</CardHeader>
				<CardContent>
					{milestoneBreakdown.map((m) => (
						<CollapsibleMilestone key={m.milestone} milestone={m} />
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Payment History</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
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

			<Card>
				<CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
					<div>
						<p className="text-xs text-muted-foreground">Booking Amount</p>
						<p className="font-medium">{formatINR(booking.bookingAmount)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Total Paid</p>
						<p className="font-medium">{formatINR(booking.totalPaid)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Remaining</p>
						<p className="font-medium">{formatINR(booking.remainingAmount)}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Booking Date</p>
						<p className="font-medium">{formatDate(booking.bookingDate)}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}