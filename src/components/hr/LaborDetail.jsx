import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useHR } from "@/hooks/useHR";
import { formatDate } from "@/lib/helpers";
import { toast } from "sonner";

export default function LaborDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchLaborById,
    fetchLaborAttendanceSummary,
    fetchLaborAttendance,
    markLaborAttendance,
    loading,
  } = useHR();

  const [labor, setLabor] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    hoursWorked: 8,
    overtimeHours: 0,
    status: "Present",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const lab = await fetchLaborById(id);
      if (lab) {
        setLabor(lab);
        const summary = await fetchLaborAttendanceSummary(id);
        setAttendanceSummary(summary);
        const records = await fetchLaborAttendance({ laborId: id });
        setAttendanceRecords(records?.attendances || []);
      } else {
        navigate("/hr");
      }
    };
    load();
  }, [id]);

  const handleMarkAttendance = async () => {
    if (!attendanceForm.date) return toast.error("Date required");
    setSubmitting(true);
    const success = await markLaborAttendance({
      laborId: id,
      siteId: labor.assignedSite || labor.assignedProject?._id,
      date: attendanceForm.date,
      hoursWorked: Number(attendanceForm.hoursWorked),
      overtimeHours: Number(attendanceForm.overtimeHours),
      status: attendanceForm.status,
    });
    setSubmitting(false);
    if (success) {
      setAttendanceDialogOpen(false);
      // Refresh summary and records
      const newSummary = await fetchLaborAttendanceSummary(id);
      setAttendanceSummary(newSummary);
      const newRecords = await fetchLaborAttendance({ laborId: id });
      setAttendanceRecords(newRecords?.attendances || []);
    }
  };

  if (!labor && loading) return <Skeleton className="h-96" />;
  if (!labor) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/hr")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{labor.name}</h1>
          <Badge variant={labor.isActive ? "success" : "destructive"}>
            {labor.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <Button onClick={() => setAttendanceDialogOpen(true)} variant="outline">
          <CheckCircle className="h-4 w-4 mr-1" /> Mark Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <Phone className="inline h-3 w-3 mr-1" /> {labor.phone}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Labor Type</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{labor.laborType}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{labor.trade}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Daily Wage</CardTitle>
          </CardHeader>
          <CardContent>
            <p>₹{labor.dailyWage}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{labor.assignedProject?.name || labor.assignedProject || "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Standard Hours/Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{labor.standardHoursPerDay} hrs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Attendance Summary</TabsTrigger>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Card>
            <CardContent className="p-6">
              {attendanceSummary ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Days</p>
                    <p className="text-2xl font-bold">
                      {attendanceSummary.totalDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-green-600">
                      {attendanceSummary.presentDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-red-600">
                      {attendanceSummary.absentDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Half Days</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {attendanceSummary.halfDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-xl font-bold">
                      {attendanceSummary.totalHours || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Overtime
                    </p>
                    <p className="text-xl font-bold">
                      {attendanceSummary.totalOvertime || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Earnings
                    </p>
                    <p className="text-xl font-bold">
                      ₹{attendanceSummary.totalEarnings?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No attendance data available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="records">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((rec) => (
                    <TableRow key={rec._id}>
                      <TableCell>{formatDate(rec.date)}</TableCell>
                      <TableCell>{rec.hoursWorked}</TableCell>
                      <TableCell>{rec.overtimeHours || 0}</TableCell>
                      <TableCell>
                        <Badge>{rec.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mark Attendance Dialog */}
      <Dialog
        open={attendanceDialogOpen}
        onOpenChange={setAttendanceDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={attendanceForm.date}
                onChange={(e) =>
                  setAttendanceForm({ ...attendanceForm, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Hours Worked</Label>
              <Input
                type="number"
                step="0.5"
                value={attendanceForm.hoursWorked}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    hoursWorked: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Overtime Hours</Label>
              <Input
                type="number"
                step="0.5"
                value={attendanceForm.overtimeHours}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    overtimeHours: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full border rounded p-2"
                value={attendanceForm.status}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    status: e.target.value,
                  })
                }
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half-Day">Half-Day</option>
                <option value="Late">Late</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAttendanceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMarkAttendance} disabled={submitting}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
