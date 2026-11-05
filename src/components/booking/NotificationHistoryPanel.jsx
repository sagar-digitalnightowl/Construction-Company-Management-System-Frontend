// Notification history for a booking (PDF v2.9, section 5 and 7D)
import React, { useCallback, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notificationApi } from "@/api/notificationApi";
import { formatDateTime } from "@/lib/helpers";

export const NOTIFICATION_TYPE_LABEL = {
	booking_confirmation: "Booking Confirmation",
	agreement_uploaded: "Agreement Uploaded",
	flat_cancellation: "Flat Cancellation",
};

const STATUS_STYLE = {
	sent: { label: "Sent", className: "bg-emerald-100 text-emerald-800 border-transparent" },
	failed: { label: "Failed", className: "bg-red-100 text-red-800 border-transparent" },
	pending: { label: "Pending", className: "bg-amber-100 text-amber-800 border-transparent" },
};

// Only WhatsApp is shown for now. Email notifications are not part of this release.
const CHANNEL = {
	whatsapp: { label: "WhatsApp", Icon: MessageCircle },
};

export function NotificationHistoryPanel({ bookingId, refreshKey = 0 }) {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		setError(false);
		try {
			const res = await notificationApi.history(bookingId);
			const all = res?.data?.data?.logs || [];
			setLogs(all.filter((log) => log.channel === "whatsapp"));
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [bookingId]);

	useEffect(() => {
		if (bookingId) load();
	}, [bookingId, refreshKey, load]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Notification History</CardTitle>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="text-sm text-muted-foreground">Loading...</div>
				) : error ? (
					<div className="text-sm text-destructive">Could not load notification history.</div>
				) : logs.length === 0 ? (
					<div className="text-sm text-muted-foreground">No notifications sent for this booking yet.</div>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Channel</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Recipient</TableHead>
									<TableHead>Sent at</TableHead>
									<TableHead>PDF</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{logs.map((log) => {
									const channel = CHANNEL[log.channel];
									const status = STATUS_STYLE[log.status] || { label: log.status, className: "" };
									const Icon = channel.Icon;
									return (
										<TableRow key={log._id}>
											<TableCell>
												<span className="inline-flex items-center gap-1.5">
													<Icon className="h-4 w-4" aria-hidden="true" /> {channel.label}
												</span>
											</TableCell>
											<TableCell>
												<div>{NOTIFICATION_TYPE_LABEL[log.type] || log.type}</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline" className={status.className}>{status.label}</Badge>
												{log.status === "failed" && log.errorMessage && (
													<div className="mt-1 text-xs text-destructive">{log.errorMessage}</div>
												)}
											</TableCell>
											<TableCell className="font-mono text-xs">{log.recipient || "—"}</TableCell>
											<TableCell className="whitespace-nowrap">{formatDateTime(log.createdAt)}</TableCell>
											<TableCell>
												{log.type === "flat_cancellation" && log.attachmentUrl ? (
													<a href={log.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
														View PDF
													</a>
												) : (
													"—"
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default NotificationHistoryPanel;
