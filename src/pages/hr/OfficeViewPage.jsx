import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Building2, Users, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHR } from "@/hooks/useHR";
import { OfficeEmployees } from "@/components/hr/OfficeEmployees";
import { AddOfficeEmployeesDialog } from "@/components/hr/AddOfficeEmployeesDialog";

export function OfficeViewPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const {
		fetchOfficeById,
		fetchOfficeEmployees,
		officeEmployees,
		employeesLoading,
	} = useHR();

	const [office, setOffice] = useState(null);
	const [addEmployeesOpen, setAddEmployeesOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadOffice = async () => {
			if (id) {
				const data = await fetchOfficeById(id);
				setOffice(data);
			}
			setLoading(false);
		};
		loadOffice();
	}, [id, fetchOfficeById]);

	useEffect(() => {
		if (!id) return;

		fetchOfficeEmployees(id, {
			page: 1,
			limit: 10,
		});
	}, [id, fetchOfficeEmployees]);

	const handleEmployeePageChange = (page) => {
		if (!id) return;

		fetchOfficeEmployees(id, {
			page,
			limit: 10,
		});
	};

	if (loading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!office) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
				<p className="text-muted-foreground">Office not found or deleted.</p>
				<Button variant="outline" onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4 mr-2" /> Go Back
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-6xl mx-auto pb-10 animate-in fade-in duration-300">
			{/* Header */}
			<div className="flex items-center gap-4 border-b pb-4">
				<Button variant="outline" size="icon" onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<Building2 className="h-6 w-6 text-muted-foreground" />
						{office.name}
						{office.isDeleted && <Badge variant="destructive">Deleted</Badge>}
					</h1>
					<p className="text-muted-foreground text-sm">Office Details & Live Statistics</p>
				</div>
			</div>

			{/* Top Stats Row */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<p className="text-sm text-muted-foreground mb-1">Status</p>
						<Badge variant={office.status === "Active" ? "success" : "secondary"}>
							{office.status}
						</Badge>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<p className="text-sm text-muted-foreground mb-1">Office Code</p>
						<p className="font-medium font-mono">{office.code || "-"}</p>
					</CardContent>
				</Card>
				<Card className="bg-primary/5 border-primary/20">
					<CardContent className="p-4 flex items-center gap-4">
						<div className="p-2 bg-primary/10 rounded-full text-primary">
							<Users className="h-5 w-5" />
						</div>
						<div>
							<p className="text-sm font-medium text-primary uppercase tracking-wide">Total Employees</p>
							<p className="text-2xl font-bold text-primary">{office.employeeCount ?? 0}</p>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-emerald-500/5 border-emerald-500/20">
					<CardContent className="p-4 flex items-center gap-4">
						<div className="p-2 bg-emerald-500/10 rounded-full text-emerald-600">
							<UserCheck className="h-5 w-5" />
						</div>
						<div>
							<p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Active Staff</p>
							<p className="text-2xl font-bold text-emerald-600">{office.activeEmployeeCount ?? 0}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Details Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Management & Location */}
				<Card>
					<CardHeader className="pb-3 border-b">
						<CardTitle className="text-lg">Management & Location</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 pt-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Office Type</p>
								<p className="font-medium">{office.officeType || "-"}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">City</p>
								<p className="font-medium">{office.city || "-"}</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4 pt-2">
							<div>
								<p className="text-sm text-muted-foreground">Head of Office</p>
								<p className="font-medium">{office.headOfOffice?.name || "Not Assigned"}</p>
								{office.headOfOffice?.email && (
									<p className="text-xs text-muted-foreground truncate">{office.headOfOffice.email}</p>
								)}
							</div>
							<div>
								<p className="text-sm text-muted-foreground">HR Representative</p>
								<p className="font-medium">{office.hrRepresentative?.name || "Not Assigned"}</p>
								{office.hrRepresentative?.email && (
									<p className="text-xs text-muted-foreground truncate">{office.hrRepresentative.email}</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Timings & Description */}
				<Card>
					<CardHeader className="pb-3 border-b">
						<CardTitle className="text-lg">Schedule & Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 pt-4">
						<div>
							<p className="text-sm text-muted-foreground">Working Days</p>
							<p className="font-medium">{office.workingDays?.join(", ") || "-"}</p>
						</div>
						<div className="flex gap-8 pt-2">
							<div>
								<p className="text-sm text-muted-foreground">Start Time</p>
								<p className="font-medium">{office.defaultStartTime || "-"}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">End Time</p>
								<p className="font-medium">{office.defaultEndTime || "-"}</p>
							</div>
						</div>
						{office.description && (
							<div className="pt-2">
								<p className="text-sm text-muted-foreground mb-1">Description</p>
								<p className="text-sm bg-muted/30 p-3 rounded-md">{office.description}</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<OfficeEmployees
				employeesData={officeEmployees}
				loading={employeesLoading}
				onPageChange={handleEmployeePageChange}
				onAddEmployees={() => setAddEmployeesOpen(true)}
			/>

			<AddOfficeEmployeesDialog
				open={addEmployeesOpen}
				onOpenChange={setAddEmployeesOpen}
				officeId={id}
				onSuccess={() => {
					fetchOfficeEmployees(id, {
						page: 1,
						limit: 10,
					});
				}}
			/>
		</div>
	);
}