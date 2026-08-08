import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";

export const EmployeeLeaves = () => {
	const { current } = useAuthStore();
	const { myLeaves, leaveBalance, fetchMyLeaves, fetchMyLeaveBalance, applyLeave } = useHR();
	const employeeId = current?._id;

	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({
		leaveType: "Casual Leave",
		startDate: "",
		endDate: "",
		reason: "",
	});

	useEffect(() => {
		const loadLeaves = async () => {
			setLoading(true);
			await fetchMyLeaves();
			await fetchMyLeaveBalance();
			setLoading(false);
		};
		loadLeaves();
	}, [fetchMyLeaves, fetchMyLeaveBalance]);

	const handleApplyLeave = async () => {
		if (!form.startDate || !form.endDate) {
			toast.error("Please select dates");
			return;
		}
		setSubmitting(true);
		const success = await applyLeave({ employeeId, ...form });
		setSubmitting(false);
		if (success) {
			setDialogOpen(false);
			setForm({ leaveType: "Casual Leave", startDate: "", endDate: "", reason: "" });
			await fetchMyLeaves();
			await fetchMyLeaveBalance();
		}
	};

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-9 w-32" />
				</div>
				<Skeleton className="h-24" />
				<Skeleton className="h-64" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Leave Balance</h3>
				<Button onClick={() => setDialogOpen(true)}>
					<Plus className="h-4 w-4 mr-1" /> Apply Leave
				</Button>
			</div>

			{leaveBalance && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted p-4 rounded-md">
					<div>
						<p className="text-sm text-muted-foreground">Sick Leave</p>
						<p className="text-xl font-bold">{leaveBalance.sickLeaveRemaining ?? 0}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Casual Leave</p>
						<p className="text-xl font-bold">{leaveBalance.casualLeaveRemaining ?? 0}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Annual Leave</p>
						<p className="text-xl font-bold">{leaveBalance.annualLeaveRemaining ?? 0}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Emergency Leave</p>
						<p className="text-xl font-bold">{leaveBalance.emergencyLeaveRemaining ?? 0}</p>
					</div>
				</div>
			)}

			<Card>
				<CardHeader className="pb-3">
					<CardTitle>Leave Requests</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Type</TableHead>
								<TableHead>Start Date</TableHead>
								<TableHead>End Date</TableHead>
								<TableHead>Days</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{myLeaves?.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center">No leave requests</TableCell>
								</TableRow>
							) : (
								myLeaves?.map((leave) => (
									<TableRow key={leave._id}>
										<TableCell>{leave.leaveType}</TableCell>
										<TableCell>{formatDate(leave.startDate)}</TableCell>
										<TableCell>{formatDate(leave.endDate)}</TableCell>
										<TableCell>{leave.days}</TableCell>
										<TableCell>
											<Badge
												variant={
													leave.status === "Approved" ? "success"
														: leave.status === "Pending" ? "warning"
															: "destructive"
												}
											>
												{leave.status}
											</Badge>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Apply for Leave</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label>Leave Type</Label>
							<Select value={form.leaveType} onValueChange={(v) => setForm({ ...form, leaveType: v })}>
								<SelectTrigger><SelectValue /></SelectTrigger>
								<SelectContent>
									<SelectItem value="Sick Leave">Sick Leave</SelectItem>
									<SelectItem value="Casual Leave">Casual Leave</SelectItem>
									<SelectItem value="Annual Leave">Annual Leave</SelectItem>
									<SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
									<SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Start Date</Label>
							<Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
						</div>
						<div>
							<Label>End Date</Label>
							<Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
						</div>
						<div>
							<Label>Reason (Optional)</Label>
							<Textarea rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
						<Button onClick={handleApplyLeave} disabled={submitting}>Submit</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};