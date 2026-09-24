
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/helpers";
import { projectApi } from "@/api";
import { toast } from "sonner";
import { MilestoneTable } from "./FinanceMilestones/MilestoneTable";
import { MarkMilestoneDialog } from "./FinanceMilestones/MarkMilestoneDialog";

export function FinanceMilestones() {
	const { milestones, fetchProjectMilestones, markMilestone, loading } = useFinance();

	// Projects Dropdown States
	const [projects, setProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState("");
	const [projectPage, setProjectPage] = useState(1);
	const [hasMoreProjects, setHasMoreProjects] = useState(true);

	// Dialog States
	const [markOpen, setMarkOpen] = useState(false);
	const [markMilestoneName, setMarkMilestoneName] = useState("");
	const [markCompletedAt, setMarkCompletedAt] = useState(
		new Date().toISOString().slice(0, 16),
	);

	// Fetch Projects with Pagination support for dropdown
	const fetchProjects = async (pageNo = 1) => {
		try {
			const res = await projectApi.getAll({ page: pageNo, limit: 10 });
			if (res.data.success) {
				const fetchedProjects = res.data.data?.projects || res.data.data?.docs || res.data.data || [];
				const projectPagination = res.data.data?.pagination;

				if (pageNo === 1) {
					setProjects(fetchedProjects);
					// Auto select first project if nothing is selected
					if (!selectedProject && fetchedProjects.length > 0) {
						setSelectedProject(fetchedProjects[0]._id);
					}
				} else {
					setProjects((prev) => [...prev, ...fetchedProjects]);
				}

				// Check if more projects exist
				if (projectPagination && pageNo >= projectPagination.pages) {
					setHasMoreProjects(false);
				} else {
					setHasMoreProjects(true);
				}
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to load projects");
		}
	};

	useEffect(() => {
		fetchProjects(1);
	}, []); // Remove selectedProject from dependency array to prevent loop

	useEffect(() => {
		if (projects.length && selectedProject) {
			fetchProjectMilestones(selectedProject);
		}
	}, [selectedProject, fetchProjectMilestones]);

	// Handle "Load More" for project dropdown
	const handleLoadMoreProjects = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const nextPage = projectPage + 1;
		setProjectPage(nextPage);
		fetchProjects(nextPage);
	};

	const handleMark = async () => {
		if (!markMilestoneName) return;
		await markMilestone(selectedProject, {
			milestone: markMilestoneName,
			completedAt: new Date(markCompletedAt).toISOString(),
		});
		setMarkOpen(false);
		setMarkMilestoneName("");
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
				<div className="space-y-1.5 w-full sm:w-auto">
					<Label className="text-sm font-medium">
						Select Project
					</Label>

					<Select
						value={selectedProject}
						onValueChange={setSelectedProject}
					>
						<SelectTrigger className="w-full sm:w-[300px]">
							<SelectValue placeholder="Choose a project" />
						</SelectTrigger>

						<SelectContent>
							{projects.map((p) => (
								<SelectItem key={p._id} value={p._id}>
									{p.name}
								</SelectItem>
							))}

							{hasMoreProjects && (
								<div
									className="mt-1 w-full cursor-pointer border-t px-2 py-2 text-left text-xs font-medium text-primary hover:bg-muted/60"
									onClick={handleLoadMoreProjects}
								>
									+ Load More Projects
								</div>
							)}
						</SelectContent>
					</Select>
				</div>

				{selectedProject && (
					<Button
						onClick={() => setMarkOpen(true)}
						className="w-full sm:w-auto"
					>
						Mark Milestone Completed
					</Button>
				)}
			</div>

			{selectedProject && (
				<MilestoneTable
					milestones={milestones}
					formatDate={formatDate}
				/>
			)}

			{/* Mark Milestone Dialog */}
			<MarkMilestoneDialog
				markOpen={markOpen}
				setMarkOpen={setMarkOpen}
				markMilestoneName={markMilestoneName}
				setMarkMilestoneName={setMarkMilestoneName}
				markCompletedAt={markCompletedAt}
				setMarkCompletedAt={setMarkCompletedAt}
				handleMark={handleMark}
				loading={loading}
			/>
		</div>
	);
}