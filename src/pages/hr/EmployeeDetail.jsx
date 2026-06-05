import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";
import { canMutate } from "@/data/permissions";
import { EditEmployeeDialog } from "@/components/hr/EditEmployeeDialog";

// Tab components
import { OverviewTab } from "../../components/employeeDetail/OverviewTab";
import { AttendanceTab } from "../../components/employeeDetail/AttendanceTab";
import { LeavesTab } from "../../components/employeeDetail/LeavesTab";
import { SalaryTab } from "../../components/employeeDetail/SalaryTab";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { current } = useAuthStore();
  const canEdit = canMutate(current?.role, "hr");

  const {
    fetchEmployeeById,
    fetchEmployeeAttendanceById,
    fetchEmployeeSalarySlips,
    fetchEmployeeLeaveBalance,
    fetchEmployeeCurrentShift,
    fetchLeaves,
    processLeave,
    assignShiftToEmployee,
    generateSalarySlip,
    updateEmployee,
    checkIn,
    checkOut,
    shifts,
    fetchShifts,
    loading,
  } = useHR();

  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [salarySlips, setSalarySlips] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [shift, setShift] = useState(null);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignShiftDialogOpen, setAssignShiftDialogOpen] = useState(false);
  const [generateSalaryDialogOpen, setGenerateSalaryDialogOpen] =
    useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState("");
  const [salaryForm, setSalaryForm] = useState({
    month: "January",
    year: new Date().getFullYear(),
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const loadAllData = async () => {
    const emp = await fetchEmployeeById(id);
    if (!emp) {
      navigate("/hr");
      return;
    }
    setEmployee(emp);
    const [attRes, salRes, balRes, shiftRes, leavesRes] = await Promise.all([
      fetchEmployeeAttendanceById(id),
      fetchEmployeeSalarySlips(id),
      fetchEmployeeLeaveBalance(id),
      fetchEmployeeCurrentShift(id),
      fetchLeaves({ employeeId: id }),
    ]);
    setAttendance(attRes?.data?.attendance || []);
    setSalarySlips(salRes?.data || []);
    setLeaveBalance(balRes?.data);
    setShift(shiftRes?.data);
    setEmployeeLeaves(leavesRes?.data?.leaves || []);
  };

  useEffect(() => {
    loadAllData();
    fetchShifts();
  }, [id]);

  const handleAssignShift = async () => {
    if (!selectedShiftId) return toast.error("Select a shift");
    const success = await assignShiftToEmployee({
      employeeId: id,
      shiftId: selectedShiftId,
      effectiveFrom: new Date().toISOString().split("T")[0],
    });
    if (success) {
      toast.success("Shift assigned");
      setAssignShiftDialogOpen(false);
      const newShift = await fetchEmployeeCurrentShift(id);
      setShift(newShift?.data);
    }
  };

  const handleGenerateSalary = async () => {
    const slip = await generateSalarySlip({
      employeeId: id,
      month: salaryForm.month,
      year: salaryForm.year,
    });
    if (slip) {
      toast.success("Salary slip generated");
      setGenerateSalaryDialogOpen(false);
      await loadAllData();
    }
  };

  const handleManualCheckIn = async () => {
    await checkIn(id);
    loadAllData();
  };
  const handleManualCheckOut = async () => {
    await checkOut(id);
    loadAllData();
  };
  const handleUpdateEmployee = async (data) => {
    const success = await updateEmployee(id, data);
    if (success) {
      loadAllData();
      setEditDialogOpen(false);
    }
  };

  if (!employee && loading) return <Skeleton className="h-96" />;
  if (!employee) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/hr")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{employee.name}</h1>
          <Badge variant={employee.isActive ? "success" : "destructive"}>
            {employee.isActive ? "Active" : "Inactive"}
          </Badge>
          {employee.employeeId && (
            <Badge variant="outline">ID: {employee.employeeId}</Badge>
          )}
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleManualCheckIn}>
              <UserCheck className="h-4 w-4 mr-1" /> Check In
            </Button>
            <Button variant="outline" size="sm" onClick={handleManualCheckOut}>
              <UserX className="h-4 w-4 mr-1" /> Check Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignShiftDialogOpen(true)}
            >
              <Clock className="h-4 w-4 mr-1" /> Assign Shift
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit Profile
            </Button>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{employee.role}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{employee.department?.name || "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <Mail className="inline h-3 w-3 mr-1" /> {employee.email}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <Phone className="inline h-3 w-3 mr-1" /> {employee.phone}
            </p>
          </CardContent>
        </Card>
        {employee.employeeId && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Employee ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono">{employee.employeeId}</p>
            </CardContent>
          </Card>
        )}
        {employee.dailyRate > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Daily Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p>₹{employee.dailyRate.toLocaleString()}</p>
            </CardContent>
          </Card>
        )}
        {employee.hourlyRate > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Hourly Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p>₹{employee.hourlyRate.toLocaleString()}</p>
            </CardContent>
          </Card>
        )}
        {shift && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Current Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {shift.name} ({shift.startTime} - {shift.endTime})
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leaves</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab employee={employee} />
        </TabsContent>
        <TabsContent value="attendance">
          <AttendanceTab
            employee={employee}
            attendance={attendance}
            canEdit={canEdit}
          />
        </TabsContent>
        <TabsContent value="leaves">
          <LeavesTab
            employeeLeaves={employeeLeaves}
            leaveBalance={leaveBalance}
            canEdit={canEdit}
            onProcessLeave={processLeave}
            loadAllData={loadAllData}
          />
        </TabsContent>
        <TabsContent value="salary">
          <SalaryTab salarySlips={salarySlips} canEdit={canEdit} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EditEmployeeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        employee={employee}
        onSuccess={loadAllData}
      />
      <Dialog
        open={assignShiftDialogOpen}
        onOpenChange={setAssignShiftDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Shift</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Select Shift</Label>
            <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name} ({s.startTime} - {s.endTime})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignShiftDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignShift}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={generateSalaryDialogOpen}
        onOpenChange={setGenerateSalaryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Salary Slip</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Month</Label>
            <Select
              value={salaryForm.month}
              onValueChange={(v) => setSalaryForm({ ...salaryForm, month: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Year</Label>
            <Input
              type="number"
              value={salaryForm.year}
              onChange={(e) =>
                setSalaryForm({ ...salaryForm, year: parseInt(e.target.value) })
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGenerateSalaryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleGenerateSalary}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(v) =>
          !v && setConfirmDialog({ ...confirmDialog, open: false })
        }
        title={confirmDialog.title}
        description={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  );
}
