import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatINR } from "@/lib/helpers";
import { ChevronLeft, ChevronRight, Mail, Phone, User } from "lucide-react";

export function FinanceFlatsView({
	selectedProject,
	selectedTower,
	selectedFloor,
	filteredFlats,
	dashboardFlatsMap,
	setSelectedFloor,
	setCurrentView,
	getFlatDisplay
}) {
	return (
		<>
			<div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4 min-w-0">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						setCurrentView("floors");
						setSelectedFloor("");
					}}
					// Scale down on mobile, mt-0.5 aligns it with the text
					className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 mt-0.5"
				>
					<ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
				</Button>

				<div className="flex-1 min-w-0">
					{/* flex-wrap ensures long paths drop to the next line instead of truncating */}
					<h2 className="flex flex-wrap items-center text-base md:text-lg font-semibold leading-tight gap-x-1 gap-y-0.5">
						<span>{selectedProject.projectName}</span>

						<ChevronRight className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 text-muted-foreground/70" />

						<span>{selectedTower}</span>

						<ChevronRight className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 text-muted-foreground/70" />

						<span>Floor {selectedFloor}</span>
					</h2>

					<p className="text-[11px] md:text-sm text-muted-foreground mt-1 truncate">
						{selectedProject.location}
					</p>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredFlats.map((flat) => {
					const uniqueKey = `${selectedProject.projectId}-${flat.tower}-${flat.floor}-${flat.flatNumber}`;
					const dashboardFlat = dashboardFlatsMap.get(uniqueKey);

					const { status, label, variant } = getFlatDisplay(flat);

					const isSold = status === "sold";
					const isPending = status === "pending";

					// Calculate payment progress for sold/pending flats
					const totalAmount = (flat.totalPaid || 0) + (flat.remainingAmount || 0);
					const paidPercentage = totalAmount > 0 ? ((flat.totalPaid || 0) / totalAmount) * 100 : 0;

					return (
						<div
							key={uniqueKey}
							// Added h-full and flex-col to force uniform stretching across the grid
							className={`group h-full flex flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-md bg-card ${isSold
								? "border-primary/40 hover:border-primary"
								: isPending
									? "border-amber-500/40 hover:border-amber-500"
									: "hover:border-foreground/30"
								}`}
						>
							{/* 1. Header: Flat Number and Status Badge */}
							<div>
								<div className="flex justify-between items-start mb-1 gap-2">
									<span className={`font-bold text-lg truncate transition-colors ${isSold ? "text-primary group-hover:text-primary/80" :
										isPending ? "text-amber-600 dark:text-amber-500" : ""
										}`}>
										{flat.flatNumber}
									</span>
									<Badge variant={variant} className="capitalize text-[10px] sm:text-xs whitespace-nowrap shrink-0 shadow-sm">
										{label}
									</Badge>
								</div>

								<p className="text-muted-foreground text-xs font-medium">
									{flat.tower} • Floor {flat.floor}
								</p>
							</div>

							{/* 2. Bottom Section (Dynamically fills space) */}
							<div className="mt-4 pt-3 border-t border-foreground/10 flex-1 flex flex-col">
								{(isSold || isPending) ? (
									<div className="space-y-3 flex-1 flex flex-col justify-end">
										{/* Buyer Details */}
										<div className="space-y-1.5">
											{flat.buyerName && (
												<p
													className="text-xs sm:text-sm font-semibold truncate flex items-center gap-1.5"
													title={flat.buyerName}
												>
													<User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
													<span className="truncate">{flat.buyerName}</span>
												</p>
											)}

											{flat.buyerEmail && (
												<p
													className="text-[10px] sm:text-xs text-muted-foreground truncate flex items-center gap-1.5"
													title={flat.buyerEmail}
												>
													<Mail className="h-3.5 w-3.5 shrink-0" />
													<span className="truncate">{flat.buyerEmail}</span>
												</p>
											)}

											{flat.buyerPhone && (
												<p
													className="text-[10px] sm:text-xs text-muted-foreground truncate flex items-center gap-1.5"
													title={flat.buyerPhone}
												>
													<Phone className="h-3.5 w-3.5 shrink-0" />
													<span className="truncate">{flat.buyerPhone}</span>
												</p>
											)}
										</div>

										{/* Payment Progress Bar */}
										<div className="space-y-1.5">
											<div className="flex justify-between items-center text-[10px] sm:text-xs">
												<span className="text-muted-foreground font-medium">Payment</span>
												<span className="font-medium">{Math.round(paidPercentage)}%</span>
											</div>
											<div className="w-full bg-secondary h-1.5 sm:h-2 rounded-full overflow-hidden">
												<div
													className={`h-full transition-all duration-500 ${isSold ? 'bg-primary' : 'bg-amber-500'}`}
													style={{ width: `${paidPercentage}%` }}
												/>
											</div>
										</div>

										{/* Paid vs Due Breakdown */}
										<div className="grid grid-cols-2 gap-2 text-center pt-1 mt-auto">
											<div className="bg-success/10 rounded py-1.5 px-1">
												<p className="text-[9px] sm:text-[10px] text-success/80 uppercase font-bold">Paid</p>
												<p className="text-success font-semibold text-[11px] sm:text-xs truncate" title={formatINR(flat.totalPaid || 0)}>
													{formatINR(flat.totalPaid || 0)}
												</p>
											</div>
											<div className="bg-destructive/10 rounded py-1.5 px-1">
												<p className="text-[9px] sm:text-[10px] text-destructive/80 uppercase font-bold">Due</p>
												<p className="text-destructive font-semibold text-[11px] sm:text-xs truncate" title={formatINR(flat.remainingAmount || 0)}>
													{formatINR(flat.remainingAmount || 0)}
												</p>
											</div>
										</div>

										{/* Next Installment / Reminder Details */}
										<div className="pt-2 space-y-1.5 text-[10px] sm:text-xs">
											{dashboardFlat?.nextInstallmentDue ? (
												<>
													<div className="flex items-center justify-between gap-2">
														<span className="text-muted-foreground">
															Next Installment
														</span>
														<span className="font-semibold text-foreground">
															{formatINR(dashboardFlat.nextInstallmentAmount || 0)}
														</span>
													</div>

													<div className="flex items-center justify-between gap-2">
														<span className="text-muted-foreground">
															Due Date
														</span>
														<span className="font-medium text-foreground">
															{formatDate(dashboardFlat.nextInstallmentDue)}
														</span>
													</div>

													{dashboardFlat.remindedInstallmentNumber ? (
														<div className="flex items-center justify-between gap-2">
															<span className="text-muted-foreground">
																Installment No.
															</span>
															<span className="font-medium text-foreground">
																#{dashboardFlat.remindedInstallmentNumber}
															</span>
														</div>
													) : null}

													{dashboardFlat.lastReminderSentAt ? (
														<div className="flex items-center justify-between gap-2">
															<span className="text-muted-foreground">
																Last Reminder Sent
															</span>
															<span className="font-medium text-foreground">
																{formatDate(dashboardFlat.lastReminderSentAt)}
															</span>
														</div>
													) : (
														<div className="flex items-center justify-between gap-2">
															<span className="text-muted-foreground">
																Reminder
															</span>
															<span className="italic text-muted-foreground/60">
																Not sent yet
															</span>
														</div>
													)}
												</>
											) : (
												<p className="text-muted-foreground/60 italic">
													No upcoming installment
												</p>
											)}
										</div>
									</div>
								) : (
									/* Placeholder state for Available Flats */
									<div className="flex-1 flex flex-col items-center justify-center min-h-[115px] bg-muted/20 border border-dashed border-muted-foreground/30 rounded-lg p-3 transition-colors group-hover:bg-muted/40">
										<p className="text-[10px] text-muted-foreground/60 text-center mt-1">
											No active buyer or payments assigned.
										</p>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}