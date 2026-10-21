// src/components/project/BulkMilestoneImport.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProject } from "@/hooks/useProject";
import { Upload, FileSpreadsheet, Download, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

/**
 * Bulk Milestone Import Component
 * CSV import for bulk operations
 *
 * CSV Format:
 * towerName,milestoneId,isCompleted,progress,notes
 * Tower A,milestone123,true,100,Foundation complete
 * Tower B,milestone123,false,50,In progress
 *
 * @param {Object} props
 * @param {string} props.projectId - Project ID
 * @param {Array} props.towers - Array of tower objects
 * @param {Array} props.milestones - Array of milestone objects
 * @param {Function} props.onSuccess - Callback after successful import
 */
export function BulkMilestoneImport({
	projectId,
	towers = [],
	milestones = [],
	onSuccess,
}) {
	const { bulkMarkTowerMilestones } = useProject();

	const [open, setOpen] = useState(false);
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [previewData, setPreviewData] = useState([]);
	const [errors, setErrors] = useState([]);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			parseCSV(selectedFile);
		}
	};

	const parseCSV = (file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const text = e.target?.result;
				const lines = text.split("\n").filter((line) => line.trim());

				if (lines.length < 2) {
					setErrors(["CSV file is empty or invalid"]);
					return;
				}

				// Skip header line
				const dataLines = lines.slice(1);
				const parsed = [];
				const validationErrors = [];

				dataLines.forEach((line, index) => {
					const [towerName, milestoneId, isCompleted, progress, notes] =
						line.split(",").map((v) => v.trim());

					// Validate
					if (!towerName || !milestoneId) {
						validationErrors.push(
							`Line ${index + 2}: Missing tower name or milestone ID`,
						);
						return;
					}

					// Check if tower exists
					const towerExists = towers.some(
						(t) =>
							t.towerName.toLowerCase() === towerName.toLowerCase(),
					);
					if (!towerExists) {
						validationErrors.push(
							`Line ${index + 2}: Tower "${towerName}" not found`,
						);
						return;
					}

					// Check if milestone exists
					const milestoneExists = milestones.some(
						(m) => m._id === milestoneId,
					);
					if (!milestoneExists) {
						validationErrors.push(
							`Line ${index + 2}: Milestone ID "${milestoneId}" not found`,
						);
						return;
					}

					parsed.push({
						towerName,
						milestoneId,
						isCompleted: isCompleted?.toLowerCase() === "true",
						progress: parseInt(progress) || 0,
						notes: notes || "",
					});
				});

				setPreviewData(parsed);
				setErrors(validationErrors);
			} catch (err) {
				setErrors(["Failed to parse CSV file. Please check the format."]);
			}
		};
		reader.readAsText(file);
	};

	const handleImport = async () => {
		if (previewData.length === 0) {
			toast.error("No valid data to import");
			return;
		}

		if (errors.length > 0) {
			toast.error("Please fix validation errors before importing");
			return;
		}

		setLoading(true);
		try {
			await bulkMarkTowerMilestones(projectId, previewData);
			toast.success(`Successfully imported ${previewData.length} entries`);
			onSuccess?.();
			handleClose();
		} catch (err) {
			// Error already handled by hook
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setFile(null);
		setPreviewData([]);
		setErrors([]);
	};

	const downloadTemplate = () => {
		// Create CSV template
		const header = "towerName,milestoneId,isCompleted,progress,notes\n";
		const examples = towers
			.slice(0, 2)
			.map((tower) => {
				const milestone = milestones[0];
				return `${tower.towerName},${milestone?._id || "MILESTONE_ID_HERE"},false,0,Optional notes`;
			})
			.join("\n");

		const csvContent = header + examples;
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "tower_milestones_template.csv";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);

		toast.success("Template downloaded");
	};

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				onClick={() => setOpen(true)}
				className="gap-2"
			>
				<Upload className="h-4 w-4" />
				Bulk Import
			</Button>

			<Dialog open={open} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Bulk Import Milestones</DialogTitle>
						<DialogDescription>
							Import multiple tower milestone updates from a CSV file
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Download Template */}
						<div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
							<div className="flex items-center gap-2">
								<FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
								<div className="text-sm">
									<p className="font-medium">Download CSV Template</p>
									<p className="text-xs text-muted-foreground">
										Get started with a pre-filled example
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={downloadTemplate}
							>
								<Download className="h-4 w-4 mr-2" />
								Download
							</Button>
						</div>

						{/* File Upload */}
						<div className="space-y-2">
							<Label htmlFor="csv-file">Upload CSV File</Label>
							<Input
								id="csv-file"
								type="file"
								accept=".csv"
								onChange={handleFileChange}
							/>
						</div>

						{/* Validation Errors */}
						{errors.length > 0 && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									<div className="font-medium mb-1">
										Validation Errors:
									</div>
									<ul className="list-disc list-inside text-xs space-y-1">
										{errors.map((err, idx) => (
											<li key={idx}>{err}</li>
										))}
									</ul>
								</AlertDescription>
							</Alert>
						)}

						{/* Preview Data */}
						{previewData.length > 0 && errors.length === 0 && (
							<div className="space-y-2">
								<Label>Preview ({previewData.length} entries)</Label>
								<div className="max-h-48 overflow-y-auto border rounded-lg">
									<table className="w-full text-xs">
										<thead className="bg-muted sticky top-0">
											<tr>
												<th className="p-2 text-left">Tower</th>
												<th className="p-2 text-left">Status</th>
												<th className="p-2 text-right">Progress</th>
											</tr>
										</thead>
										<tbody>
											{previewData.map((entry, idx) => (
												<tr key={idx} className="border-t">
													<td className="p-2">{entry.towerName}</td>
													<td className="p-2">
														{entry.isCompleted
															? "✅ Complete"
															: "⏳ In Progress"}
													</td>
													<td className="p-2 text-right">
														{entry.progress}%
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							onClick={handleImport}
							disabled={
								loading ||
								previewData.length === 0 ||
								errors.length > 0
							}
						>
							{loading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Importing...
								</>
							) : (
								<>
									<Upload className="h-4 w-4 mr-2" />
									Import {previewData.length} Entries
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
