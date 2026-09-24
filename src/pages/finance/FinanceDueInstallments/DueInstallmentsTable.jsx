import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DueInstallmentsTable({
	dueInstallments,
	loading,
	selectedIds,
	handleSelectAll,
	handleSelectOne,
	openBookingHistory,
	openInstallmentHistory,
	formatINR,
	formatDate,
}) {
	return (
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
	);
}