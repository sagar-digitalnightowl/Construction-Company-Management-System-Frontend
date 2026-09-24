import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ALL_MILESTONES } from "./allMilestones";

export function MarkMilestoneDialog({
	markOpen,
	setMarkOpen,
	markMilestoneName,
	setMarkMilestoneName,
	markCompletedAt,
	setMarkCompletedAt,
	handleMark,
	loading,
}) {
	return (
		<Dialog open={markOpen} onOpenChange={setMarkOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-xl">Mark Milestone as Completed</DialogTitle>
				</DialogHeader>

				<div className="grid gap-5 py-4">
					<div className="grid gap-2.5">
						<Label htmlFor="milestone-select" className="text-sm font-medium text-foreground/90">
							Milestone
						</Label>
						<Select
							value={markMilestoneName}
							onValueChange={setMarkMilestoneName}
						>
							<SelectTrigger id="milestone-select" className="w-full">
								<SelectValue placeholder="Select milestone" />
							</SelectTrigger>
							<SelectContent>
								{ALL_MILESTONES.map((name) => (
									<SelectItem key={name} value={name}>
										{name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2.5">
						<Label htmlFor="completed-at" className="text-sm font-medium text-foreground/90">
							Completed At
						</Label>
						<Input
							id="completed-at"
							type="datetime-local"
							value={markCompletedAt}
							onChange={(e) => setMarkCompletedAt(e.target.value)}
							className="w-full"
						/>
					</div>
				</div>

				<DialogFooter className="gap-2 pt-2 sm:space-x-0">
					<Button
						variant="outline"
						onClick={() => setMarkOpen(false)}
						disabled={loading}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
					<Button
						onClick={handleMark}
						disabled={!markMilestoneName || loading}
						className="w-full sm:w-auto shadow-sm transition-colors"
					>
						{loading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						Mark Completed
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}