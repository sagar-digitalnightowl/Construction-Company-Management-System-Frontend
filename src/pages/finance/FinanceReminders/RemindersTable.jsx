import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/helpers";
import { Eye, AlertTriangle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { LuMail } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";

export default function RemindersTable({
	reminders,
	loading,
	onViewReminder,
}) {
	return (
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
											onClick={() => onViewReminder(log)}
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
			</CardContent>
		</Card>
	);
}