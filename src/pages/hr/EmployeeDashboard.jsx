import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, DollarSign, LogIn, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

const statusColor = {
  Present: "success",
  Absent: "destructive",
  "Half-Day": "warning",
  Late: "secondary",
};

// ----------------------------------------------------------------------
// Tab Content Components
// ----------------------------------------------------------------------

const AttendanceTabContent = ({
  myAttendance,
  employeeShift,
  loadingShift,
  formatDate,
}) => {
  if (!myAttendance?.records?.length && !loadingShift) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No attendance records yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check-In</TableHead>
                <TableHead>Check-Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myAttendance?.records?.map((rec) => (
                <TableRow key={rec._id}>
                  <TableCell>{formatDate(rec.date)}</TableCell>
                  <TableCell>
                    {rec.checkIn?.time
                      ? new Date(rec.checkIn.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {rec.checkOut?.time
                      ? new Date(rec.checkOut.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>{rec.totalHours?.toFixed(1) || 0}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor[rec.status]}>                 
                      {rec.status}
                    </Badge>  
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {loadingShift ? (
        <Skeleton className="h-32 mt-4" />
      ) : employeeShift ? (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle>Current Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Shift Name</p>
                <p className="font-medium">{employeeShift.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timings</p>
                <p className="font-medium">
                  {employeeShift.startTime} – {employeeShift.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Working Days</p>
                <p className="font-medium">
                  {employeeShift.workingDays?.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grace Period</p>
                <p className="font-medium">
                  {employeeShift.gracePeriodMinutes} minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
};

const LeavesTabContent = ({
  myLeaves,
  leaveBalance,
  loading,
  formatDate,
  employeeId,
  applyLeave,
  onLeaveApplied,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

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
      setForm({
        leaveType: "Casual Leave",
        startDate: "",
        endDate: "",
        reason: "",
      });
      onLeaveApplied();
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
            <p className="text-xl font-bold">
              {leaveBalance.sickLeaveRemaining ?? 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Casual Leave</p>
            <p className="text-xl font-bold">
              {leaveBalance.casualLeaveRemaining ?? 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Leave</p>
            <p className="text-xl font-bold">
              {leaveBalance.annualLeaveRemaining ?? 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Emergency Leave</p>
            <p className="text-xl font-bold">
              {leaveBalance.emergencyLeaveRemaining ?? 0}
            </p>
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
                  <TableCell colSpan={5} className="text-center">
                    No leave requests
                  </TableCell>
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
                          leave.status === "Approved"
                            ? "success"
                            : leave.status === "Pending"
                              ? "warning"
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
              <Select
                value={form.leaveType}
                onValueChange={(v) => setForm({ ...form, leaveType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Emergency Leave">
                    Emergency Leave
                  </SelectItem>
                  <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Reason (Optional)</Label>
              <Textarea
                rows={2}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyLeave} disabled={submitting}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SalaryTabContent = ({ salarySlips, loading }) => {
  if (loading) return <Skeleton className="h-64" />;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Salary Slips</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Basic</TableHead>
              <TableHead>HRA</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salarySlips?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No salary slips found
                </TableCell>
              </TableRow>
            ) : (
              salarySlips?.map((slip) => (
                <TableRow key={slip._id}>
                  <TableCell>{slip.month}</TableCell>
                  <TableCell>{slip.year}</TableCell>
                  <TableCell>₹{slip.basicSalary?.toLocaleString()}</TableCell>
                  <TableCell>₹{slip.hra?.toLocaleString()}</TableCell>
                  <TableCell>₹{slip.allowances?.toLocaleString()}</TableCell>
                  <TableCell>₹{slip.deductions?.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">
                    ₹{slip.netPay?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        slip.paymentStatus === "Paid" ? "success" : "warning"
                      }
                    >
                      {slip.paymentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const AnnouncementsTabContent = ({ announcements, loading, formatDate }) => {
  if (loading) return <Skeleton className="h-64" />;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Company Announcements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements?.length === 0 ? (
          <p className="text-center text-muted-foreground">No announcements</p>
        ) : (
          announcements?.map((ann) => (
            <div key={ann._id} className="border-b last:border-0 pb-3">
              <h4 className="font-semibold">{ann.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {ann.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Posted on {formatDate(ann.createdAt)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------
export default function EmployeeDashboard() {
  const { current } = useAuthStore();
  const employeeId = current?._id;

  const {
    employee,
    myAttendance,
    myLeaves,
    leaveBalance,
    salarySlips,
    announcements,
    employeeShift,
    fetchEmployeeById,
    fetchMyAttendance,
    fetchMyLeaves,
    fetchMyLeaveBalance,
    fetchMySalarySlips,
    fetchAnnouncements,
    fetchEmployeeCurrentShift,
    applyLeave,
    checkIn,
    checkOut,
  } = useHR();

  const [activeTab, setActiveTab] = useState("attendance");

  // Separate loading flags for tabs (except attendance, which is loaded on mount)
  const [loading, setLoading] = useState({
    leaves: false,
    salary: false,
    announcements: false,
    shift: false, // shift is fetched only when attendance tab is opened
  });

  // Track which heavy tabs have already been fetched
  const [fetched, setFetched] = useState({
    leaves: false,
    salary: false,
    announcements: false,
    shift: false,
  });

  // ─── Today’s check‑in/out logic (relies on myAttendance) ───
  const today = new Date().toISOString().split("T")[0];
  const todayRecord = myAttendance?.records?.find((rec) => rec.date == today);
  const isCheckedIn = todayRecord && !todayRecord.checkOut?.time;
  const isCheckedOut = todayRecord && todayRecord.checkOut?.time;

  // ─── Fetch employee & today's attendance on mount ─────
  useEffect(() => {
    if (!employeeId) return;
    const init = async () => {
      await fetchEmployeeById(employeeId);
      // Fetch attendance immediately so header buttons are correct
      await fetchMyAttendance();
    };
    init();
  }, [employeeId]);

  // ─── Lazy load data when tabs are switched ──────────────
  useEffect(() => {
    if (!employeeId) return;

    const loadTabData = async () => {
      switch (activeTab) {
        case "leaves":
          if (!fetched.leaves) {
            setLoading((prev) => ({ ...prev, leaves: true }));
            await fetchMyLeaves();
            await fetchMyLeaveBalance();
            setFetched((prev) => ({ ...prev, leaves: true }));
            setLoading((prev) => ({ ...prev, leaves: false }));
          }
          break;
        case "salary":
          if (!fetched.salary) {
            setLoading((prev) => ({ ...prev, salary: true }));
            await fetchMySalarySlips();
            setFetched((prev) => ({ ...prev, salary: true }));
            setLoading((prev) => ({ ...prev, salary: false }));
          }
          break;
        case "announcements":
          if (!fetched.announcements) {
            setLoading((prev) => ({ ...prev, announcements: true }));
            await fetchAnnouncements();
            setFetched((prev) => ({ ...prev, announcements: true }));
            setLoading((prev) => ({ ...prev, announcements: false }));
          }
          break;
        case "attendance":
          // Attendance data already loaded, just fetch shift if missing
          if (!fetched.shift && !employeeShift && !loading.shift) {
            setLoading((prev) => ({ ...prev, shift: true }));
            await fetchEmployeeCurrentShift(employeeId);
            setFetched((prev) => ({ ...prev, shift: true }));
            setLoading((prev) => ({ ...prev, shift: false }));
          }
          break;
        default:
          break;
      }
    };
    loadTabData();
  }, [activeTab, employeeId, fetched, employeeShift, loading.shift]);

  // ─── Action handlers ─────────────────────────────────────
  const handleCheckIn = async () => {
    const success = await checkIn();
    if (success) {
      await fetchMyAttendance();
      toast.success("Checked in successfully");
    }
  };

  const handleCheckOut = async () => {
    const success = await checkOut();
    if (success) {
      await fetchMyAttendance();
      toast.success("Checked out successfully");
    }
  };

  const handleLeaveApplied = async () => {
    await fetchMyLeaves();
    await fetchMyLeaveBalance();
  };

  // ─── Derived stats ─────────────────────────────────────
  const presentCount = myAttendance?.records?.filter(
    (a) => a.status === "Present",
  )?.length;
  const pendingLeaveCount = myLeaves?.filter(
    (l) => l.status === "Pending",
  )?.length;
  const currentMonthSalary = salarySlips.find(
    (s) =>
      s.month === new Date().toLocaleString("default", { month: "long" }) &&
      s.year === new Date().getFullYear(),
  )?.netPay;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <PageHeader
          eyebrow="Dashboard"
          title="Leaves & Attendance"
          description={
            <p className="text-muted-foreground">
              {employee?.name} • {employee?.role} •{" "}
              {employee?.department?.name || "No department"}
            </p>
          }
          actions={
            <div className="flex gap-2">
              {!isCheckedIn && !isCheckedOut && (
                <Button variant="outline" onClick={handleCheckIn}>
                  <LogIn className="h-4 w-4 mr-1" /> Check In
                </Button>
              )}
              {isCheckedIn && !isCheckedOut && (
                <Button variant="outline" onClick={handleCheckOut}>
                  <LogOut className="h-4 w-4 mr-1" /> Check Out
                </Button>
              )}
              {isCheckedOut && (
                <Button variant="outline" disabled>
                  <LogOut className="h-4 w-4 mr-1" /> Already Checked Out
                </Button>
              )}
            </div>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Present (This Month)
              </p>
              <p className="text-2xl font-bold">{presentCount}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Pending Leaves</p>
              <p className="text-2xl font-bold">{pendingLeaveCount}</p>
            </div>
            <Clock className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Salary (Current Month)
              </p>
              <p className="text-2xl font-bold">
                ₹{currentMonthSalary?.toLocaleString() || 0}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="attendance">My Attendance</TabsTrigger>
          <TabsTrigger value="leaves">My Leaves</TabsTrigger>
          <TabsTrigger value="salary">Salary Slips</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <AttendanceTabContent
            myAttendance={myAttendance}
            employeeShift={employeeShift}
            loadingShift={loading.shift}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="leaves">
          <LeavesTabContent
            myLeaves={myLeaves}
            leaveBalance={leaveBalance}
            loading={loading.leaves}
            formatDate={formatDate}
            employeeId={employeeId}
            applyLeave={applyLeave}
            onLeaveApplied={handleLeaveApplied}
          />
        </TabsContent>

        <TabsContent value="salary">
          <SalaryTabContent
            salarySlips={salarySlips}
            loading={loading.salary}
          />
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementsTabContent
            announcements={announcements}
            loading={loading.announcements}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
