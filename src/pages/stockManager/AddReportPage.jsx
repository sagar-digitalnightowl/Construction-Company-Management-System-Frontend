// src/pages/stockManager/AddReportPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import { useSiteStock } from "@/hooks/useSiteStock";
import { projectApi, authApi } from "@/api";
import { STOCK_ITEM_CATEGORIES, STOCK_UNITS } from "@/data/stockConstants";

const NUMERIC_FIELDS = ["qty", "ratePerUnit", "totalAmount", "estimatedValue"];

export default function AddReportPage() {
	const navigate = useNavigate();
	const { createReport } = useSiteStock();

	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState([]);
	const [uploadedPhotos, setUploadedPhotos] = useState([]);
	const [uploadingPhoto, setUploadingPhoto] = useState(false);
	const [itemNameSuggestions, setItemNameSuggestions] = useState([]);

	const [formData, setFormData] = useState({
		projectId: "",
		itemName: "",
		itemCategory: "",
		unit: "",
		qty: "",
		ratePerUnit: "",
		totalAmount: "",
		estimatedValue: "",
		vehicleNumber: "",
		materialArrivedDate: new Date().toISOString().split("T")[0],
		supplierName: "",
		invoiceNumber: "",
		notes: "",
	});

	// Fetch projects on mount
	useEffect(() => {
		fetchProjects();
		loadItemNameHistory();
	}, []);

	const fetchProjects = async () => {
		try {
			const response = await projectApi.getAll({ limit: 100 });
			if (response.data.success) {
				setProjects(response.data.data.projects || []);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load projects");
		}
	};

	// Load item name history from localStorage
	const loadItemNameHistory = () => {
		try {
			const history = localStorage.getItem("stockItemNameHistory");
			if (history) {
				const items = JSON.parse(history);
				setItemNameSuggestions(items);
			}
		} catch (error) {
			console.error("Error loading item name history:", error);
		}
	};

	// Save item name to history
	const saveItemNameToHistory = (itemName) => {
		if (!itemName || itemName.trim().length < 3) return;

		try {
			const history = localStorage.getItem("stockItemNameHistory");
			let items = history ? JSON.parse(history) : [];
			
			// Add new item if not already present
			if (!items.includes(itemName)) {
				items.unshift(itemName);
				// Keep only last 50 items
				items = items.slice(0, 50);
				localStorage.setItem("stockItemNameHistory", JSON.stringify(items));
				setItemNameSuggestions(items);
			}
		} catch (error) {
			console.error("Error saving item name to history:", error);
		}
	};

	// Auto-calculate totalAmount when qty or ratePerUnit changes
	useEffect(() => {
		if (formData.qty && formData.ratePerUnit) {
			const total = parseFloat(formData.qty) * parseFloat(formData.ratePerUnit);
			setFormData(prev => ({ ...prev, totalAmount: total.toString() }));
		}
	}, [formData.qty, formData.ratePerUnit]);

	// Auto-calculate ratePerUnit when totalAmount and qty change
	useEffect(() => {
		if (formData.totalAmount && formData.qty && !formData.ratePerUnit) {
			const rate = parseFloat(formData.totalAmount) / parseFloat(formData.qty);
			setFormData(prev => ({ ...prev, ratePerUnit: rate.toFixed(2) }));
		}
	}, [formData.totalAmount, formData.qty]);

	// Keep only digits and a single decimal point (covers typed and pasted input)
	const sanitizeNumeric = (value) => {
		const cleaned = value.replace(/[^0-9.]/g, "");
		const [whole, ...decimals] = cleaned.split(".");
		return decimals.length ? `${whole}.${decimals.join("")}` : whole;
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		const nextValue = NUMERIC_FIELDS.includes(name) ? sanitizeNumeric(value) : value;
		setFormData(prev => ({ ...prev, [name]: nextValue }));
	};

	const handleSelectChange = (name, value) => {
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// Photo upload handler
	const handlePhotoUpload = async (e) => {
		const files = Array.from(e.target.files);
		if (!files.length) return;

		setUploadingPhoto(true);

		try {
			for (const file of files) {
				// Step 1: Get presigned URL
				const presignedResponse = await authApi.getPresignedUrl({
					fileName: file.name,
					fileType: "stock",
					mimeType: file.type,
				});

				if (!presignedResponse.data) {
					throw new Error("Failed to get presigned URL");
				}

				const { url, key, publicUrl } = presignedResponse.data;

				// Step 2: Upload file to S3
				await fetch(url, {
					method: "PUT",
					body: file,
					headers: {
						"Content-Type": file.type,
					},
				});

				// Add to uploaded photos
				setUploadedPhotos(prev => [...prev, { key, publicUrl, name: file.name }]);
			}

			toast.success("Photos uploaded successfully");
		} catch (error) {
			console.error("Error uploading photos:", error);
			toast.error("Failed to upload photos");
		} finally {
			setUploadingPhoto(false);
		}
	};

	const removePhoto = (keyToRemove) => {
		setUploadedPhotos(prev => prev.filter(photo => photo.key !== keyToRemove));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!formData.projectId) {
			toast.error("Please select a project");
			return;
		}

		if (!formData.itemName) {
			toast.error("Please enter item name");
			return;
		}

		if (!formData.itemCategory) {
			toast.error("Please select item category");
			return;
		}

		if (!formData.unit) {
			toast.error("Please select unit");
			return;
		}

		if (!formData.qty || parseFloat(formData.qty) <= 0) {
			toast.error("Please enter a valid quantity");
			return;
		}

		setLoading(true);

		try {
			const payload = {
				...formData,
				qty: parseFloat(formData.qty),
				ratePerUnit: formData.ratePerUnit ? parseFloat(formData.ratePerUnit) : undefined,
				totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
				estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
				photoKeys: uploadedPhotos.map(p => p.key),
			};

			await createReport(payload);
			
			// Save item name to history after successful submission
			saveItemNameToHistory(formData.itemName);
			
			toast.success("Stock report created successfully");
			navigate("/site-manager/list");
		} catch (error) {
			console.error("Error creating report:", error);
			// Toast already shown in hook
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Add Stock"
				description="Create a new material stock report for the site"
				actions={
					<Button variant="outline" onClick={() => navigate("/site-manager/list")}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>
				}
			/>

			<Card>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Project Selection */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="projectId">Project / Site *</Label>
								<Select
									value={formData.projectId}
									onValueChange={(value) => handleSelectChange("projectId", value)}
								>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select project" className="text-muted-foreground/60" />
									</SelectTrigger>
									<SelectContent>
										{projects.map(project => (
											<SelectItem key={project._id} value={project._id}>
												{project.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="itemName">Item Name *</Label>
								<Input
									id="itemName"
									name="itemName"
									value={formData.itemName}
									onChange={handleInputChange}
									placeholder="e.g. Ultratech Cement 53 Grade"
									list="itemNameSuggestions"
									required
								/>
								<datalist id="itemNameSuggestions">
									{itemNameSuggestions.map((item, index) => (
										<option key={index} value={item} />
									))}
								</datalist>
								{itemNameSuggestions.length > 0 && (
									<p className="text-xs text-muted-foreground">
										Start typing to see suggestions from history
									</p>
								)}
							</div>
						</div>

						{/* Item Category & Unit */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="itemCategory">Item Category *</Label>
								<Select
									value={formData.itemCategory}
									onValueChange={(value) => handleSelectChange("itemCategory", value)}
								>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select category" className="text-muted-foreground/60" />
									</SelectTrigger>
									<SelectContent>
										{STOCK_ITEM_CATEGORIES.map(cat => (
											<SelectItem key={cat.value} value={cat.value}>
												{cat.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="unit">Unit *</Label>
								<Select
									value={formData.unit}
									onValueChange={(value) => handleSelectChange("unit", value)}
								>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select unit" className="text-muted-foreground/60" />
									</SelectTrigger>
									<SelectContent>
										{STOCK_UNITS.map(unit => (
											<SelectItem key={unit.value} value={unit.value}>
												{unit.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Quantity & Pricing */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="qty">Quantity *</Label>
								<Input
									id="qty"
									name="qty"
									type="number"
									step="0.01"
									min="0"
									value={formData.qty}
									onChange={handleInputChange}
									onKeyDown={(e) => {
										// Allow: backspace, delete, tab, escape, enter, decimal point
										if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
											// Allow: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+V, Ctrl/cmd+X
											(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
											// Allow: home, end, left, right
											(e.keyCode >= 35 && e.keyCode <= 39)) {
											return;
										}
										// Ensure that it is a number and stop the keypress if not
										if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
											e.preventDefault();
										}
									}}
									placeholder="50"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="ratePerUnit">Rate Per Unit (₹)</Label>
								<Input
									id="ratePerUnit"
									name="ratePerUnit"
									type="number"
									step="0.01"
									min="0"
									value={formData.ratePerUnit}
									onChange={handleInputChange}
									onKeyDown={(e) => {
										if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
											(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode >= 35 && e.keyCode <= 39)) {
											return;
										}
										if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
											e.preventDefault();
										}
									}}
									placeholder="380"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="totalAmount">Total Amount (₹)</Label>
								<Input
									id="totalAmount"
									name="totalAmount"
									type="number"
									step="0.01"
									min="0"
									value={formData.totalAmount}
									onChange={handleInputChange}
									onKeyDown={(e) => {
										if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
											(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
											(e.keyCode >= 35 && e.keyCode <= 39)) {
											return;
										}
										if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
											e.preventDefault();
										}
									}}
									placeholder="19000"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="estimatedValue">Estimated Value (₹)</Label>
							<Input
								id="estimatedValue"
								name="estimatedValue"
								type="number"
								step="0.01"
								min="0"
								value={formData.estimatedValue}
								onChange={handleInputChange}
								onKeyDown={(e) => {
									if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
										(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
										(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
										(e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
										(e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
										(e.keyCode >= 35 && e.keyCode <= 39)) {
										return;
									}
									if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
										e.preventDefault();
									}
								}}
								placeholder="18000"
							/>
						</div>

						{/* Vehicle & Supplier Details */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="vehicleNumber">Vehicle Number</Label>
								<Input
									id="vehicleNumber"
									name="vehicleNumber"
									value={formData.vehicleNumber}
									onChange={handleInputChange}
									placeholder="BR01AB1234"
									style={{ textTransform: "uppercase" }}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="materialArrivedDate">Material Arrived Date</Label>
								<Input
									id="materialArrivedDate"
									name="materialArrivedDate"
									type="date"
									value={formData.materialArrivedDate}
									onChange={handleInputChange}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="supplierName">Supplier Name</Label>
								<Input
									id="supplierName"
									name="supplierName"
									value={formData.supplierName}
									onChange={handleInputChange}
									placeholder="Shree Cement Agency"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="invoiceNumber">Invoice Number</Label>
								<Input
									id="invoiceNumber"
									name="invoiceNumber"
									value={formData.invoiceNumber}
									onChange={handleInputChange}
									placeholder="INV-2026-1234"
								/>
							</div>
						</div>

						{/* Photo Upload */}
						<div className="space-y-2">
							<Label>Photos (Slip / Material / Vehicle)</Label>
							<div className="border-2 border-dashed rounded-lg p-4">
								<input
									type="file"
									id="photoUpload"
									multiple
									accept="image/*"
									onChange={handlePhotoUpload}
									className="hidden"
									disabled={uploadingPhoto}
								/>
								<label htmlFor="photoUpload" className="cursor-pointer">
									<div className="flex flex-col items-center gap-2 text-center">
										<Upload className="h-8 w-8 text-muted-foreground" />
										<div className="text-sm text-muted-foreground">
											{uploadingPhoto ? "Uploading..." : "Click to upload photos"}
										</div>
									</div>
								</label>

								{uploadedPhotos.length > 0 && (
									<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
										{uploadedPhotos.map((photo) => (
											<div key={photo.key} className="relative group">
												<img
													src={photo.publicUrl}
													alt={photo.name}
													className="w-full h-24 object-cover rounded"
												/>
												<button
													type="button"
													onClick={() => removePhoto(photo.key)}
													className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
												>
													<X className="h-4 w-4" />
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Notes */}
						<div className="space-y-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								name="notes"
								value={formData.notes}
								onChange={handleInputChange}
								placeholder="Material verified by site supervisor — slip attached."
								rows={3}
							/>
						</div>

						{/* Submit Buttons */}
						<div className="flex gap-3 justify-end pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/site-manager/list")}
								disabled={loading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
								Submit Report
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
