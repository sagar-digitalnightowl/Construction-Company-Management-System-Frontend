import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
	ArrowLeft,
	ChevronDown,
	ChevronRight,
	ChevronLeft,
	Building2,
	Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useBooking } from "@/hooks/useBooking";
import { projectApi } from "@/api/projectApi";
import { formatDate, formatINR } from "@/lib/helpers";

export default function ManagerBookingDetail() {
	const { userId } = useParams();
	const navigate = useNavigate();
	const {
		managerDetail,
		managerDetailSummary,
		managerDetailBookings,
		fetchManagerBookings,
		loading,
		pagination,
	} = useBooking();

	const [projects, setProjects] = useState([]);
	const [projectId, setProjectId] = useState("all");
	const [status, setStatus] = useState("all");
	const [customerType, setCustomerType] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedId, setExpandedId] = useState(null);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const res = await projectApi.getAll({ page: 1, limit: 100 });
				setProjects(res.data?.data?.projects || []);
			} catch {
				toast.error("Failed to load projects for filter");
			}
		};
		loadProjects();
	}, []);

	const runFetch = useCallback(
		(page = currentPage) => {
			fetchManagerBookings(userId, {
				page,
				limit: 10,
				projectId: projectId === "all" ? undefined : projectId,
				status: status === "all" ? undefined : status,
				customerType: customerType === "all" ? undefined : customerType,
			});
		},
		[userId, currentPage, projectId, status, customerType, fetchManagerBookings],
	);

	useEffect(() => {
		setCurrentPage(1);
		runFetch(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, projectId, status, customerType]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		runFetch(page);
	};

	const toggleExpand = (id) =>
		setExpandedId((prev) => (prev === id ? null : id));

	if (loading && !managerDetail) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-32" />
				<Skeleton className="h-64" />
			</div>
		);
	}

	if (!managerDetail) {
		return <div className="text-center py-12">Manager not found</div>;
	}

	return (
		<div className="space-y-6">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => navigate("/managers-bookings")}
				className="-ml-2"
			>
				<ArrowLeft className="h-4 w-4 mr-1" /> Back to Managers
			</Button>

			<Card>
				<CardContent className="pt-5 flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-lg font-semibold">{managerDetail.name}</p>
						<p className="text-sm text-muted-foreground capitalize">
							{managerDetail.role?.replace("_", " ")}
							{managerDetail.employeeId ? ` · ${managerDetail.employeeId}` : ""}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{managerDetail.phone} {managerDetail.email ? `· ${managerDetail.email}` : ""}
						</p>
					</div>
				</CardContent>
			</Card>

			{managerDetailSummary && (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						label="Bookings"
						value={managerDetailSummary.bookingCount}
						accent="primary"
						size="compact"
					/>
					<StatCard
						label="Booking Amount"
						value={formatINR(managerDetailSummary.totalBookingAmount)}
						accent="neutral"
						size="compact"
					/>
					<StatCard
						label="Total Paid"
						value={formatINR(managerDetailSummary.totalPaid)}
						accent="success"
						valueClassName="text-success"
						size="compact"
					/>
					<StatCard
						label="Remaining"
						value={formatINR(managerDetailSummary.totalRemaining)}
						accent="warning"
						valueClassName="text-yellow-600"
						size="compact"
					/>
				</div>
			)}

			<div className="flex flex-col sm:flex-row gap-3">
				<Select value={projectId} onValueChange={setProjectId}>
					<SelectTrigger className="w-full sm:w-56 bg-background">
						<SelectValue placeholder="Select Project" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Projects</SelectItem>
						{projects.map((project) => (
							<SelectItem key={project._id} value={project._id}>
								{project.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className="w-full sm:w-40 bg-background">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="booked">Booked</SelectItem>
						<SelectItem value="sold">Sold</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
					</SelectContent>
				</Select>

				<Select value={customerType} onValueChange={setCustomerType}>
					<SelectTrigger className="w-full sm:w-40 bg-background">
						<SelectValue placeholder="Customer Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="loan">Loan</SelectItem>
						<SelectItem value="clp">CLP</SelectItem>
						<SelectItem value="otp">OTP</SelectItem>
						<SelectItem value="rental">Rental</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Bookings</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{loading ? (
						<div className="p-4 space-y-2">
							{[...Array(4)].map((_, i) => (
								<Skeleton key={i} className="h-14 w-full" />
							))}
						</div>
					) : managerDetailBookings.length === 0 ? (
						<div className="text-center py-10 text-muted-foreground">
							No bookings match the current filters.
						</div>
					) : (
						<div className="divide-y divide-border">
							{managerDetailBookings.map((b) => (
								<div key={b._id}>
									<div
										className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
										onClick={() => toggleExpand(b._id)}
									>
										{/* Left: project / flat / reference */}
										<div className="flex items-start gap-3 min-w-0">
											<div className="mt-0.5 shrink-0">
												{expandedId === b._id ? (
													<ChevronDown className="h-4 w-4 text-muted-foreground" />
												) : (
													<ChevronRight className="h-4 w-4 text-muted-foreground" />
												)}
											</div>
											<div className="min-w-0 space-y-1.5">
												<div className="flex items-center gap-1.5 min-w-0">
													<Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
													<p className="font-semibold text-foreground truncate">
														{b.projectId?.name || "—"}
													</p>
												</div>
												{(b.flatSnapshot?.towerName || b.flatSnapshot?.flatNumber) && (
													<div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
														<Home className="h-3.5 w-3.5 shrink-0" />
														<span className="truncate">
															{b.flatSnapshot?.towerName}
															{b.flatSnapshot?.floor ? ` · Floor ${b.flatSnapshot.floor}` : ""}
															{b.flatSnapshot?.flatNumber
																? ` · Flat ${b.flatSnapshot.flatNumber}`
																: ""}
														</span>
													</div>
												)}
												<p className="text-xs text-muted-foreground truncate">
													{b.bookingReferenceNumber} · {b.clientId?.name || "—"}
												</p>
												{/* {b.paymentStatus && (
													<span
														className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize ring-1 ring-inset ${b.paymentStatus === "paid"
																? "bg-green-50 text-green-700 ring-green-700/20"
																: b.paymentStatus === "partial"
																	? "bg-yellow-50 text-yellow-700 ring-yellow-700/20"
																	: "bg-muted text-muted-foreground ring-border"
															}`}
													>
														{b.paymentStatus}
													</span>
												)} */}
											</div>
										</div>

										{/* Right: figures */}
										<div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 sm:gap-x-8 sm:pl-4 sm:border-l sm:border-border shrink-0">
											<div className="hidden sm:flex flex-col justify-center">
												<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
													Role in Booking
												</span>
												<span className="text-sm text-foreground capitalize">
													{b.managerRoleInBooking?.replace("_", " ") || "—"}
												</span>
											</div>
											<div className="flex flex-col">
												<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
													Booking Amt
												</span>
												<span className="text-sm font-semibold">
													{formatINR(b.bookingAmount)}
												</span>
											</div>
											<div className="flex flex-col">
												<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
													Paid
												</span>
												<span className="text-sm font-semibold text-green-600">
													{formatINR(b.totalPaid)}
												</span>
											</div>
											<div className="flex flex-col">
												<span className="text-[10px] text-muted-foreground uppercase tracking-wide">
													Remaining
												</span>
												<span className="text-sm font-semibold text-yellow-600">
													{formatINR(b.remainingAmount)}
												</span>
											</div>
										</div>
									</div>

									{expandedId === b._id && (
										<div className="bg-muted/20 px-4 pb-4">
											{b.installmentSummary && (
												<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
													<div>
														<span className="text-muted-foreground block">Plan Total</span>
														<span className="font-medium">
															{formatINR(b.installmentSummary.totalAmount)}
														</span>
													</div>
													<div>
														<span className="text-muted-foreground block">Paid</span>
														<span className="font-medium text-green-600">
															{formatINR(b.installmentSummary.totalPaid)}
														</span>
													</div>
													<div>
														<span className="text-muted-foreground block">Remaining</span>
														<span className="font-medium text-yellow-600">
															{formatINR(b.installmentSummary.totalRemaining)}
														</span>
													</div>
													<div>
														<span className="text-muted-foreground block">Installments</span>
														<span className="font-medium">
															{b.installmentSummary.paidCount} paid,{" "}
															{b.installmentSummary.partialCount} partial,{" "}
															{b.installmentSummary.pendingCount} pending
														</span>
													</div>
												</div>
											)}

											{b.installments?.length > 0 && (
												<div className="overflow-x-auto rounded border bg-background">
													<table className="w-full text-xs">
														<thead className="bg-muted/40 text-muted-foreground uppercase tracking-wide">
															<tr>
																<th className="text-left px-3 py-2 font-medium">#</th>
																<th className="text-left px-3 py-2 font-medium">Description</th>
																<th className="text-right px-3 py-2 font-medium">Amount</th>
																<th className="text-right px-3 py-2 font-medium">Paid</th>
																<th className="text-right px-3 py-2 font-medium">Remaining</th>
																<th className="text-left px-3 py-2 font-medium">Due Date</th>
																<th className="text-left px-3 py-2 font-medium">Status</th>
															</tr>
														</thead>
														<tbody className="divide-y divide-border">
															{b.installments.map((inst) => (
																<tr key={inst.installmentId}>
																	<td className="px-3 py-2">{inst.installmentNumber}</td>
																	<td className="px-3 py-2">{inst.description}</td>
																	<td className="px-3 py-2 text-right">
																		{formatINR(inst.amount)}
																	</td>
																	<td className="px-3 py-2 text-right text-green-600">
																		{formatINR(inst.paidAmount)}
																	</td>
																	<td className="px-3 py-2 text-right text-yellow-600">
																		{formatINR(inst.remaining)}
																	</td>
																	<td className="px-3 py-2">
																		{inst.dueDate ? formatDate(inst.dueDate) : "—"}
																	</td>
																	<td className="px-3 py-2 capitalize">{inst.status}</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{pagination && pagination.pages > 1 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						Page {pagination.page} of {pagination.pages} (Total {pagination.total})
					</div>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
							disabled={currentPage === 1}
							className="px-2"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.pages))}
							disabled={currentPage === pagination.pages}
							className="px-2"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}