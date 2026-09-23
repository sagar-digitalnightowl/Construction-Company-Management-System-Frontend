import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/helpers";
import { Building2, Download } from "lucide-react";

export function FinanceProjectsView({
	projects,
	pagination,
	page,
	loading,
	goToTowers,
	handlePageChange,
	exportFinanceDashboard,
}) {
	return (
		<>
			<div className="flex items-center justify-between mt-4 md:mt-6 gap-3">
				<div className="flex flex-col gap-0.5 md:gap-1">
					<h2 className="text-base md:text-lg font-semibold leading-none md:leading-normal">
						Projects
					</h2>
					<span className="text-[11px] md:text-sm text-muted-foreground">
						{pagination
							? `Page ${page} of ${pagination.pages}`
							: ""}
					</span>
				</div>

				<Button
					onClick={() => exportFinanceDashboard()}
					disabled={loading}
					className="h-8 px-3 text-xs md:h-9 md:px-4 md:text-sm"
				>
					<Download className="h-3.5 w-3.5 mr-1.5 md:h-4 md:w-4 md:mr-2" />
					Export
				</Button>
			</div>
			{projects.length === 0 ? (
				<div className="text-center text-muted-foreground py-10 bg-muted/20 rounded-lg border border-dashed">
					No projects available.
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{projects.map((project) => {
						// Calculate stats for the project
						const bookedFlats = project.bookedSold || 0;
						const totalFlats = project.totalFlats || (project.flats ? project.flats.length : 0);

						// Calculate percentage for progress bar
						const bookingPercentage = totalFlats > 0 ? (bookedFlats / totalFlats) * 100 : 0;

						// Determine styling states
						const isFullyBooked = totalFlats > 0 && bookedFlats >= totalFlats;
						const hasBookings = bookedFlats > 0 && !isFullyBooked;

						return (
							<Card
								key={project.projectId}
								className={`group flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${isFullyBooked
									? "bg-primary/5 border-primary/40 dark:bg-primary/10 hover:border-primary"
									: hasBookings
										? "border-primary/30 hover:border-primary/70"
										: "hover:border-foreground/30"
									}`}
								onClick={() => goToTowers(project)}
							>
								<CardContent className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col">

									{/* 1. Header: Title, Location, and Building Icon */}
									<div className="flex justify-between items-start gap-3">
										<div className="min-w-0 flex-1">
											<h3 className="font-semibold text-base sm:text-lg truncate group-hover:text-primary transition-colors" title={project.projectName}>
												{project.projectName}
											</h3>
											<p className="text-xs sm:text-sm text-muted-foreground truncate" title={project.location}>
												{project.location}
											</p>
										</div>
										{/* Restored Building Icon with dynamic color */}
										<Building2 className={`h-5 w-5 shrink-0 ${isFullyBooked || hasBookings ? "text-primary" : "text-muted-foreground"}`} />
									</div>

									{/* 2. Progress Bar Section */}
									<div className="space-y-1.5 mt-auto pt-2">
										<div className="flex justify-between items-center text-xs sm:text-sm">
											{/* Changed label to "Booked" */}
											<span className="text-muted-foreground font-medium">Booked</span>
											<span className="font-medium">
												<span className={isFullyBooked ? "text-primary font-bold" : "text-foreground"}>{bookedFlats}</span>
												<span className="text-muted-foreground"> / {totalFlats} Flats</span>
											</span>
										</div>
										<div className="w-full bg-secondary h-2 sm:h-2.5 rounded-full overflow-hidden">
											<div
												className={`h-full transition-all duration-500 ${isFullyBooked ? 'bg-primary' : 'bg-primary/70'}`}
												style={{ width: `${bookingPercentage}%` }}
											/>
										</div>
									</div>

									{/* 3. Primary Financial Overview */}
									<div className="grid grid-cols-2 gap-3 pt-3 border-t">
										<div>
											<p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Received</p>
											<p className="font-bold text-success text-sm sm:text-base truncate" title={formatINR(project.totalReceived || 0)}>
												{formatINR(project.totalReceived || 0)}
											</p>
										</div>
										<div className="text-right">
											<p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Outstanding Due</p>
											<p className="font-bold text-destructive text-sm sm:text-base truncate" title={formatINR(project.outstanding || 0)}>
												{formatINR(project.outstanding || 0)}
											</p>
										</div>
									</div>

									{/* 4. GST Breakdown (Compact & Responsive Grid) */}
									<div className={`rounded-md p-2.5 text-xs grid grid-cols-3 gap-1 sm:gap-2 text-center mt-2 ${isFullyBooked ? "bg-primary/10" : "bg-muted/50"}`}>
										<div className="flex flex-col justify-center">
											<p className="text-muted-foreground text-[9px] sm:text-[10px] uppercase font-medium">Total GST</p>
											<p className="font-semibold text-[11px] sm:text-xs truncate">{formatINR(project.totalGst || 0)}</p>
										</div>
										<div className="flex flex-col justify-center border-x border-foreground/10 px-1">
											<p className="text-muted-foreground text-[9px] sm:text-[10px] uppercase font-medium">Collected</p>
											<p className="font-semibold text-success text-[11px] sm:text-xs truncate">{formatINR(project.gstCollected || 0)}</p>
										</div>
										<div className="flex flex-col justify-center">
											<p className="text-muted-foreground text-[9px] sm:text-[10px] uppercase font-medium">Remaining</p>
											<p className="font-semibold text-warning text-[11px] sm:text-xs truncate">{formatINR(project.gstRemaining || 0)}</p>
										</div>
									</div>

								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
			{pagination && pagination.pages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-4">
					<Button
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => handlePageChange(page - 1)}
					>
						Previous
					</Button>
					<span className="text-sm font-medium">
						Page {page} of {pagination.pages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={page >= pagination.pages}
						onClick={() => handlePageChange(page + 1)}
					>
						Next
					</Button>
				</div>
			)}
		</>
	);
}