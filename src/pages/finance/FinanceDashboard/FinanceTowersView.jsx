import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ChevronLeft, Download } from "lucide-react";

export function FinanceTowersView({
	selectedProject,
	towers,
	loading,
	goToProjects,
	goToFloors,
	exportFinanceDashboard,
	getEffectiveFlatStatus
}) {
	return (
		<>
			<div className="flex items-center justify-between gap-2 md:gap-3 mb-3 md:mb-4">
				{/* Left Side Container - min-w-0 is required for child truncation to work in flexbox */}
				<div className="flex items-center gap-1.5 md:gap-3 min-w-0">
					<Button
						variant="ghost"
						size="icon"
						onClick={goToProjects}
						// Scale down the back button on mobile, flex-shrink-0 prevents it from squishing
						className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
					>
						<ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
					</Button>

					<div className="min-w-0">
						<h2 className="text-base md:text-lg font-semibold truncate leading-tight">
							{selectedProject.projectName}
						</h2>
						<p className="text-[11px] md:text-sm text-muted-foreground truncate mt-0.5">
							{selectedProject.location}
						</p>
					</div>
				</div>

				{/* Export Button - flex-shrink-0 ensures the button never shrinks when the title is long */}
				<Button
					onClick={() =>
						exportFinanceDashboard({
							projectId: selectedProject.projectId,
						})
					}
					disabled={loading}
					className="h-8 px-3 text-xs md:h-9 md:px-4 md:text-sm flex-shrink-0"
				>
					<Download className="h-3.5 w-3.5 mr-1.5 md:h-4 md:w-4 md:mr-2" />
					Export
				</Button>
			</div>
			<h3 className="text-sm font-medium mb-3">Select a Tower</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
				{towers.map((tower) => {
					const towerFlats = selectedProject.flats.filter((f) => f.tower === tower);
					const totalFlats = towerFlats.length;
					const bookedFlats = towerFlats.filter((f) => {
						const eff = getEffectiveFlatStatus(f);
						return eff === "sold" || eff === "pending";
					}).length;

					// Calculate percentage for progress bar
					const bookingPercentage = totalFlats > 0 ? (bookedFlats / totalFlats) * 100 : 0;

					// Determine styling states
					const isFullyBooked = totalFlats > 0 && bookedFlats === totalFlats;
					const hasBookings = bookedFlats > 0 && !isFullyBooked;

					return (
						<Card
							key={tower}
							className={`group flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md ${isFullyBooked
								? "bg-primary/5 border-primary/40 dark:bg-primary/10 hover:border-primary"
								: hasBookings
									? "border-primary/30 hover:border-primary/70"
									: "hover:border-foreground/30"
								}`}
							onClick={() => goToFloors(tower)}
						>
							<CardContent className="p-4 space-y-4 flex-1 flex flex-col">
								{/* Header: Title and Building Icon */}
								<div className="flex justify-between items-start gap-3">
									<h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
										{tower}
									</h3>
									<Building2 className={`h-5 w-5 shrink-0 ${isFullyBooked || hasBookings ? "text-primary" : "text-muted-foreground"}`} />
								</div>

								{/* Progress Bar Section */}
								<div className="space-y-1.5 mt-auto pt-2">
									<div className="flex justify-between items-center text-xs sm:text-sm">
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
							</CardContent>
						</Card>
					);
				})}
			</div>
		</>
	);
}