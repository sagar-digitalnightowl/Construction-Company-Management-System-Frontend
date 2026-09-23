import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Download, Layers } from "lucide-react";

export function FinanceFloorsView({
	selectedProject,
	selectedTower,
	floors,
	loading,
	fetchProjectDetails,
	setSelectedProject,
	setSelectedTower,
	setSelectedFloor,
	setCurrentView,
	exportFinanceDashboard,
	goToFlats,
	getEffectiveFlatStatus
}) {
	return (
		<>
			<div className="flex items-start justify-between gap-3 mb-3 md:mb-4">
				{/* flex-1 tells this left section to stretch and fill all available space */}
				<div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
					<Button
						variant="ghost"
						size="icon"
						onClick={async () => {
							const fullProject = await fetchProjectDetails(selectedProject.projectId);
							setSelectedProject(fullProject);
							setSelectedTower("");
							setSelectedFloor("");
							setCurrentView("towers");
						}}
						// mt-0.5 slightly pushes the button down to perfectly align with the text
						className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 mt-0.5"
					>
						<ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
					</Button>

					<div className="flex-1 min-w-0">
						{/* flex-wrap ensures long names drop to the next line instead of truncating */}
						<h2 className="flex flex-wrap items-center text-base md:text-lg font-semibold leading-tight gap-x-1 gap-y-0.5">
							<span>{selectedProject.projectName}</span>
							<ChevronRight className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 text-muted-foreground/70" />
							<span>{selectedTower}</span>
						</h2>

						<p className="text-[11px] md:text-sm text-muted-foreground mt-1 truncate">
							{selectedProject.location}
						</p>
					</div>
				</div>

				{/* Export Button remains unchanged */}
				<Button
					onClick={() =>
						exportFinanceDashboard({
							projectId: selectedProject.projectId,
							tower: selectedTower,
						})
					}
					disabled={loading}
					className="h-8 px-3 text-xs md:h-9 md:px-4 md:text-sm flex-shrink-0"
				>
					<Download className="h-3.5 w-3.5 mr-1.5 md:h-4 md:w-4 md:mr-2" /> Export
				</Button>
			</div>
			<h3 className="text-sm font-medium mb-3">Select a Floor</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
				{floors.map((floor) => {
					const floorFlats = selectedProject.flats.filter(
						(f) => f.tower === selectedTower && f.floor === floor
					);
					const totalFlats = floorFlats.length;
					const bookedFlats = floorFlats.filter((f) => {
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
							key={floor}
							className={`group flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md ${isFullyBooked
								? "bg-primary/5 border-primary/40 dark:bg-primary/10 hover:border-primary"
								: hasBookings
									? "border-primary/30 hover:border-primary/70"
									: "hover:border-foreground/30"
								}`}
							onClick={() => goToFlats(floor)}
						>
							<CardContent className="p-4 space-y-4 flex-1 flex flex-col">
								{/* Header: Title and Layers Icon */}
								<div className="flex justify-between items-start gap-3">
									<h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
										{floor}
									</h3>
									<Layers className={`h-5 w-5 shrink-0 ${isFullyBooked || hasBookings ? "text-primary" : "text-muted-foreground"}`} />
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