import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

import StatusBadge from "./StatusBadge";
import { getEffectiveFlatStatus } from "./projectUtils";
import { TabsContent } from "../ui/tabs";

export default function ProjectTowersTab({
	towers,
	selectedTowerIdx,
	setSelectedTowerIdx,
	floors,
	safeFloorIdx,
	setSelectedFloorIdx,
	currentFloor,
	currentFlats,
	setSelectedFlat,
	selectedTower
}) {
	return (
		<TabsContent value="towers">
			{towers.length > 0 ? (
				<div className="space-y-6">

					{/* Tower selection & Stats */}
					<div className="bg-muted/10 border rounded-xl p-4">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div>
								<h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
									<Building2 className="h-4 w-4" /> Select Tower
								</h4>
								<div className="flex gap-2 flex-wrap">
									{towers.map((tower, idx) => (
										<Button
											key={tower.towerName}
											variant={idx === selectedTowerIdx ? "default" : "outline"}
											size="sm"
											className="rounded-lg shadow-sm"
											onClick={() => {
												setSelectedTowerIdx(idx);
												setSelectedFloorIdx(0);
											}}
										>
											{tower.towerName}
										</Button>
									))}
								</div>
							</div>

							{/* ✅ Tower Inventory Stats (Available & Booked Only) */}
							{selectedTower && (
								<div className="flex gap-3 flex-wrap">
									<div className="bg-green-50/50 border border-green-200 dark:border-green-900/50 dark:bg-green-900/10 rounded-lg px-4 py-2 min-w-[100px] shadow-sm">
										<p className="text-[10px] text-green-600 dark:text-green-500 uppercase font-bold tracking-wider mb-1">Available</p>
										<p className="text-xl font-extrabold text-green-700 dark:text-green-400">{selectedTower.availableFlats || 0}</p>
									</div>
									<div className="bg-amber-50/50 border border-amber-200 dark:border-amber-900/50 dark:bg-amber-900/10 rounded-lg px-4 py-2 min-w-[100px] shadow-sm">
										<p className="text-[10px] text-amber-600 dark:text-amber-500 uppercase font-bold tracking-wider mb-1">Booked</p>
										<p className="text-xl font-extrabold text-amber-700 dark:text-amber-400">{selectedTower.bookedFlats || 0}</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Floor selection */}
					{selectedTower && (
						<div>
							<h4 className="text-sm font-medium mb-2 text-muted-foreground">Select Floor</h4>
							<div className="flex gap-2 flex-wrap">
								{floors.map((floor, idx) => (
									<Button
										key={floor.floorNumber}
										variant={idx === safeFloorIdx ? "secondary" : "ghost"}
										size="sm"
										className={`border ${idx === safeFloorIdx ? 'border-primary/20 bg-primary/10 hover:bg-primary/20' : 'border-transparent'}`}
										onClick={() => setSelectedFloorIdx(idx)}
									>
										Floor {floor.floorNumber}
									</Button>
								))}
							</div>
						</div>
					)}

					{/* Flats grid */}
					{currentFlats.length > 0 && (
						<div className="pt-4 border-t">
							<h3 className="font-semibold mb-4 flex items-center gap-2">
								{selectedTower.towerName} <span className="text-muted-foreground">/</span> Floor {currentFloor.floorNumber}
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
								{currentFlats.map((flat) => {
									const effectiveStatus = getEffectiveFlatStatus(flat);
									const isSold = effectiveStatus === "sold";
									const isPending = effectiveStatus === "pending";

									return (
										<div
											key={flat.flatNumber}
											className={`border rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-sm transition-all ${isSold ? "bg-blue-50/50 border-blue-200 shadow-sm dark:bg-blue-900/20 dark:border-blue-800" :
												isPending ? "bg-amber-50/50 border-amber-200 shadow-sm dark:bg-amber-900/20 dark:border-amber-800" :
													"bg-background"
												}`}
											onClick={() => setSelectedFlat(flat)}
										>
											<div className="flex justify-between items-start mb-2">
												<span className="font-bold text-lg">{flat.flatNumber}</span>
												<StatusBadge status={effectiveStatus} />
											</div>
											<p className="text-sm text-muted-foreground mb-1">{flat.area} sq.ft.</p>
											<p className="font-semibold text-primary">
												₹{flat.price?.toLocaleString('en-IN') || 0}
											</p>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{currentFlats.length === 0 && selectedTower && (
						<p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg text-center mt-4">
							No flats available on this floor.
						</p>
					)}
				</div>
			) : (
				<p className="text-sm text-muted-foreground text-center py-8">No towers found in this project.</p>
			)}
		</TabsContent>
	);
}