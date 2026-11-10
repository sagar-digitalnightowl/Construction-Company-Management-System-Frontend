// SWITCHED OFF FOR THIS RELEASE: Attendance (mark attendance, my attendance, GPS check-in/check-out).
// The whole module is commented out so it can be restored by removing this block comment.
// Its route, navigation and API calls are also commented out in App.jsx, Sidebar.jsx and siteEngineerApi.js.
/*
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapPin, LogIn, LogOut, AlarmClock, CheckCircle2, Clock, Pencil, XCircle } from "lucide-react";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { submitOrQueue } from "@/lib/offlineQueue";
import { formatDate } from "@/lib/helpers";
import {
	MONTHS,
	Pager,
	listActive,
	hoursBetween,
	ProjectSelect,
	StatusPill,
	errMsg,
	listFrom,
	todayISO,
	unwrap,
	useAssignedProjects,
} from "./shared";

// Summary cards are worked out from the list when the API returns only the records
const summarize = (records) => ({
	presentDays: records.filter((r) => r.status === "Present").length,
	absentDays: records.filter((r) => r.status === "Absent").length,
	lateDays: records.filter((r) => r.isLate).length,
});

const STATUSES = ["Present", "Absent", "Half Day", "Leave"];

// Reads the device position; resolves with { latitude, longitude }
const getPosition = () =>
	new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error("Location is not available on this device"));
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
			() => reject(new Error("Allow location access to check in or out")),
			{ enableHighAccuracy: true, timeout: 15000 }
		);
	});

function ProjectAttendanceCard({ projects }) {
	const [projectId, setProjectId] = useState("");
	const [date, setDate] = useState(todayISO());
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!projectId && projects.length) setProjectId(projects[0]._id);
	}, [projects, projectId]);

	useEffect(() => {
		if (!projectId) return;
		setLoading(true);
		siteEngineerApi
			.getProjectAttendance({ projectId, date })
			.then((res) => setRows(listFrom(res, "attendance")))
			.catch((err) => {
				setRows([]);
				toast.error(errMsg(err, "Could not load project attendance"));
			})
			.finally(() => setLoading(false));
	}, [projectId, date]);

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<CardTitle className="text-base">Project attendance</CardTitle>
					<div className="flex gap-2">
						<ProjectSelect value={projectId} onChange={setProjectId} projects={projects} />
						<Input type="date" className="w-40" value={date} onChange={(e) => setDate(e.target.value)} />
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				{loading && <div className="text-sm text-muted-foreground">Loading...</div>}
				{!loading && rows.length === 0 && <div className="text-sm text-muted-foreground">No attendance for this day</div>}
				{!loading && rows.length > 0 && (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>In</TableHead>
									<TableHead>Out</TableHead>
									<TableHead>Hours</TableHead>
									<TableHead>Late</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((r) => (
									<TableRow key={r._id}>
										<TableCell>{r.employeeId?.name || r.employeeName || r.name || "—"}</TableCell>
										<TableCell>{r.status}</TableCell>
										<TableCell>{r.checkInTime || "—"}</TableCell>
										<TableCell>{r.checkOutTime || "—"}</TableCell>
										<TableCell>{r.totalHours ?? "—"}</TableCell>
										<TableCell>{r.isLate ? <StatusPill tone="bad">Late</StatusPill> : "—"}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default function SeAttendance() {
	const { projects } = useAssignedProjects();
	const now = new Date();

	const [projectId, setProjectId] = useState("");
	const [activeCheckIns, setActiveCheckIns] = useState([]);
	const [busy, setBusy] = useState(false);

	const [history, setHistory] = useState([]);
	const [historyPage, setHistoryPage] = useState({ page: 1, pages: 1 });

	const [month, setMonth] = useState(String(now.getMonth() + 1));
	const [year, setYear] = useState(String(now.getFullYear()));
	const [myRecords, setMyRecords] = useState([]);
	const [summary, setSummary] = useState(null);

	const [mark, setMark] = useState({
		projectId: "",
		date: todayISO(),
		status: "Present",
		checkInTime: "09:00",
		checkOutTime: "18:00",
		totalHours: "9",
		totalLaborCount: "0",
		isLate: false,
	});
	const [marking, setMarking] = useState(false);
	const [editRec, setEditRec] = useState(null);
	const [editForm, setEditForm] = useState({ status: "Present", checkInTime: "", checkOutTime: "", totalHours: "", isLate: false });
	const [editSaving, setEditSaving] = useState(false);

	const openEdit = (r) => {
		setEditRec(r);
		setEditForm({ status: r.status || "Present", checkInTime: r.checkInTime || "", checkOutTime: r.checkOutTime || "", totalHours: r.totalHours ?? "", isLate: !!r.isLate });
	};

	const handleEditSave = async (e) => {
		e.preventDefault();
		setEditSaving(true);
		try {
			await siteEngineerApi.updateAttendance(editRec._id, {
				status: editForm.status,
				checkInTime: editForm.checkInTime,
				checkOutTime: editForm.checkOutTime,
				totalHours: Number(editForm.totalHours) || 0,
				isLate: editForm.isLate,
			});
			toast.success("Attendance updated");
			setEditRec(null);
			loadMine();
		} catch (err) {
			toast.error(errMsg(err, "Could not update the attendance"));
		} finally {
			setEditSaving(false);
		}
	};

	const loadActive = () =>
		siteEngineerApi
			.getActiveCheckIns()
			.then((res) => setActiveCheckIns(listActive(res)))
			.catch(() => setActiveCheckIns([]));

	const loadHistory = (page = 1) =>
		siteEngineerApi
			.getCheckInHistory({ page, limit: 10 })
			.then((res) => {
				const body = unwrap(res) || {};
				setHistory(body.checkIns || body.history || (Array.isArray(body) ? body : []));
				setHistoryPage(body.pagination || { page, pages: 1 });
			})
			.catch(() => setHistory([]));

	const loadMine = () =>
		siteEngineerApi
			.getMyAttendance({ month, year })
			.then((res) => {
				const body = unwrap(res);
				const records = Array.isArray(body) ? body : body?.records || [];
				setMyRecords(records);
				setSummary(body?.summary || summarize(records));
			})
			.catch((err) => toast.error(errMsg(err, "Could not load attendance")));

	useEffect(() => {
		loadActive();
		loadHistory(1);
	}, []);

	useEffect(() => {
		loadMine();
	}, [month, year]);

	useEffect(() => {
		if (!projectId && projects.length) {
			setProjectId(projects[0]._id);
			setMark((m) => (m.projectId ? m : { ...m, projectId: projects[0]._id }));
		}
	}, [projects, projectId]);

	const checkedIn = activeCheckIns.length > 0;

	const handleCheckIn = async () => {
		if (!projectId) return toast.error("Select a project first");
		setBusy(true);
		try {
			const { latitude, longitude } = await getPosition();
			await siteEngineerApi.checkIn({ projectId, checkInLatitude: latitude, checkInLongitude: longitude });
			toast.success("Checked in");
			await Promise.all([loadActive(), loadHistory(1)]);
		} catch (err) {
			toast.error(err.message && !err.response ? err.message : errMsg(err, "Check-in failed"));
		} finally {
			setBusy(false);
		}
	};

	const handleCheckOut = async () => {
		setBusy(true);
		try {
			const { latitude, longitude } = await getPosition();
			await siteEngineerApi.checkOut({ checkOutLatitude: latitude, checkOutLongitude: longitude });
			toast.success("Checked out");
			await Promise.all([loadActive(), loadHistory(1)]);
		} catch (err) {
			toast.error(err.message && !err.response ? err.message : errMsg(err, "Check-out failed"));
		} finally {
			setBusy(false);
		}
	};

	const handleMark = async (e) => {
		e.preventDefault();
		if (!mark.projectId) return toast.error("Select a project");
		setMarking(true);
		try {
			await submitOrQueue({ recordType: "attendance", endpoint: "/site/attendance/mark", data: {
				projectId: mark.projectId,
				date: mark.date,
				status: mark.status,
				checkInTime: mark.checkInTime,
				checkOutTime: mark.checkOutTime,
				totalHours: Number(mark.totalHours) || 0,
				totalLaborCount: Number(mark.totalLaborCount) || 0,
				isLate: mark.isLate,
			}, send: (payload) => siteEngineerApi.markAttendance(payload) });
			toast.success("Attendance marked");
			loadMine();
		} catch (err) {
			toast.error(errMsg(err, "Could not mark attendance"));
		} finally {
			setMarking(false);
		}
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader title="Attendance & GPS" description="Check in on site with your location, mark attendance and see your month." />

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				<StatCard label="Status" icon={Clock} size="compact" value={checkedIn ? "On site" : "Off site"} accent={checkedIn ? "success" : "neutral"} />
				<StatCard label="Present days" icon={CheckCircle2} size="compact" value={summary?.presentDays ?? "—"} />
				<StatCard label="Late days" icon={AlarmClock} size="compact" value={summary?.lateDays ?? "—"} accent={summary?.lateDays ? "destructive" : "neutral"} />
				<StatCard label="Absent days" icon={XCircle} size="compact" value={summary?.absentDays ?? "—"} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">GPS check-in</CardTitle>
				</CardHeader>
				<CardContent className="pt-4 space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-end gap-3">
						<div className="flex-1">
							<Label className="text-xs text-muted-foreground">Project</Label>
							<ProjectSelect value={projectId} onChange={setProjectId} projects={projects} className="w-full" />
						</div>
						{checkedIn ? (
							<Button onClick={handleCheckOut} disabled={busy} variant="outline">
								<LogOut className="h-4 w-4 mr-2" /> Check out
							</Button>
						) : (
							<Button onClick={handleCheckIn} disabled={busy || !projectId}>
								<LogIn className="h-4 w-4 mr-2" /> Check in
							</Button>
						)}
					</div>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<MapPin className="h-3.5 w-3.5" />
						Your location is captured when you check in or out.
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Mark attendance</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					<form onSubmit={handleMark} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<div>
							<Label>Project</Label>
							<ProjectSelect
								value={mark.projectId}
								onChange={(v) => setMark({ ...mark, projectId: v })}
								projects={projects}
								className="w-full"
							/>
						</div>
						<div>
							<Label>Date</Label>
							<Input type="date" value={mark.date} onChange={(e) => setMark({ ...mark, date: e.target.value })} />
						</div>
						<div>
							<Label>Status</Label>
							<Select value={mark.status} onValueChange={(v) => setMark({ ...mark, status: v })}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{STATUSES.map((s) => (
										<SelectItem key={s} value={s}>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Check-in time</Label>
							<Input type="time" value={mark.checkInTime} onChange={(e) => setMark({ ...mark, checkInTime: e.target.value })} />
						</div>
						<div>
							<Label>Check-out time</Label>
							<Input type="time" value={mark.checkOutTime} onChange={(e) => setMark({ ...mark, checkOutTime: e.target.value })} />
						</div>
						<div>
							<Label>Total hours</Label>
							<Input type="number" min="0" step="0.5" value={mark.totalHours} onChange={(e) => setMark({ ...mark, totalHours: e.target.value })} />
						</div>
						<div>
							<Label>Total labour count</Label>
							<Input type="number" min="0" step="1" value={mark.totalLaborCount} onChange={(e) => setMark({ ...mark, totalLaborCount: e.target.value })} />
						</div>
						<label className="flex items-center gap-2 text-sm sm:col-span-2">
							<input type="checkbox" checked={mark.isLate} onChange={(e) => setMark({ ...mark, isLate: e.target.checked })} />
							Arrived late
						</label>
						<div className="sm:col-span-2 lg:col-span-3 flex justify-end">
							<Button type="submit" disabled={marking}>
								{marking ? "Saving..." : "Mark attendance"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">My attendance</CardTitle>
						<div className="flex gap-2">
							<Select value={month} onValueChange={setMonth}>
								<SelectTrigger className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{MONTHS.map((m, i) => (
										<SelectItem key={m} value={String(i + 1)}>
											{m}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input type="number" className="w-24" value={year} onChange={(e) => setYear(e.target.value)} />
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					{myRecords.length === 0 ? (
						<div className="text-sm text-muted-foreground">No attendance for this month</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>In</TableHead>
										<TableHead>Out</TableHead>
										<TableHead>Hours</TableHead>
										<TableHead>Late</TableHead>
										<TableHead className="text-right">Edit</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{myRecords.map((r) => (
										<TableRow key={r._id}>
											<TableCell>{formatDate(r.date)}</TableCell>
											<TableCell>{r.status}</TableCell>
											<TableCell>{r.checkInTime || "—"}</TableCell>
											<TableCell>{r.checkOutTime || "—"}</TableCell>
											<TableCell>{r.totalHours ?? "—"}</TableCell>
											<TableCell>{r.isLate ? <StatusPill tone="bad">Late</StatusPill> : "—"}</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="icon" title="Edit" aria-label="Edit" onClick={() => openEdit(r)}>
													<Pencil className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">GPS check-in history</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					{history.length === 0 ? (
						<div className="text-sm text-muted-foreground">No check-ins yet</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Check-in</TableHead>
										<TableHead>Check-out</TableHead>
										<TableHead>Hours</TableHead>
										<TableHead>Location</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{history.map((h) => (
										<TableRow key={h._id}>
											<TableCell>{h.checkInTime ? new Date(h.checkInTime).toLocaleString("en-IN") : "—"}</TableCell>
											<TableCell>{h.checkOutTime ? new Date(h.checkOutTime).toLocaleString("en-IN") : "—"}</TableCell>
											<TableCell>{h.totalHours ?? hoursBetween(h.checkInTime, h.checkOutTime) ?? "—"}</TableCell>
											<TableCell className="max-w-55 truncate">{h.location?.address || h.checkInAddress || "—"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
					<Pager
						page={historyPage.page}
						pages={historyPage.pages}
						onChange={(p) => {
							setHistoryPage({ ...historyPage, page: p });
							loadHistory(p);
						}}
					/>
				</CardContent>
			</Card>
			<Dialog open={!!editRec} onOpenChange={(o) => !o && setEditRec(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Edit attendance</DialogTitle>
						<DialogDescription>Correct the status and times for this day.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleEditSave} className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<Label>Status</Label>
							<Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{STATUSES.map((s) => (
										<SelectItem key={s} value={s}>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Check-in time</Label>
							<Input type="time" value={editForm.checkInTime} onChange={(e) => setEditForm({ ...editForm, checkInTime: e.target.value })} />
						</div>
						<div>
							<Label>Check-out time</Label>
							<Input type="time" value={editForm.checkOutTime} onChange={(e) => setEditForm({ ...editForm, checkOutTime: e.target.value })} />
						</div>
						<div>
							<Label>Total hours</Label>
							<Input type="number" min="0" step="0.5" value={editForm.totalHours} onChange={(e) => setEditForm({ ...editForm, totalHours: e.target.value })} />
						</div>
						<label className="flex items-center gap-2 text-sm self-end">
							<input type="checkbox" checked={editForm.isLate} onChange={(e) => setEditForm({ ...editForm, isLate: e.target.checked })} />
							Arrived late
						</label>
						<DialogFooter className="col-span-2">
							<Button type="button" variant="outline" onClick={() => setEditRec(null)} disabled={editSaving}>
								Cancel
							</Button>
							<Button type="submit" disabled={editSaving}>
								{editSaving ? "Saving..." : "Save changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<ProjectAttendanceCard projects={projects} />
		</div>
	);
}

*/
