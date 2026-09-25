import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, Users } from "lucide-react";
import { ALL_MILESTONES } from "./allMilestones";

export function MilestoneTable({
	milestones,
	formatDate,
}) {
	return (
		<Card>
			<CardContent className="p-0">
				<Table>
					<TableHeader className="bg-muted/10">
						<TableRow className="hover:bg-transparent">
							<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
								Milestone
							</TableHead>
							<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
								Status
							</TableHead>
							<TableHead className="whitespace-nowrap font-semibold text-muted-foreground">
								Completed At
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{ALL_MILESTONES.map((name) => {
							const found = milestones.find((m) => m.milestone === name);
							const completed = found?.completed;
							return (
								<TableRow key={name} className="hover:bg-muted/40">
									<TableCell className="min-w-[220px]">
										<div className="truncate font-medium">{name}</div>
									</TableCell>

									<TableCell className="whitespace-nowrap">
										{completed ? (
											<span className="flex items-center gap-1.5 text-sm font-medium text-success">
												<CheckCircle className="h-4 w-4" />
												Completed
											</span>
										) : (
											<span className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
												<Clock className="h-4 w-4" />
												Pending
											</span>
										)}
									</TableCell>

									<TableCell className="whitespace-nowrap">
										{completed ? formatDate(found.completedAt) : "—"}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}