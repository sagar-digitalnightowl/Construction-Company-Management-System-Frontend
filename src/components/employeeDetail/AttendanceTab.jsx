import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { formatDate } from "@/lib/helpers";
import { useHR } from "@/hooks/useHR";

const statusColor = {
  Present: "success",
  Absent: "destructive",
  "Half-Day": "warning",
  Late: "secondary",
};

export function AttendanceTab({
  employee,
  attendance,
  canEdit,
  onAttendanceMarked,
}) {
  const { markAttendance } = useHR();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    status: "Present",
    hoursWorked: 8,
  });
  const [loading, setLoading] = useState(false);

  const handleMarkAttendance = async () => {
    if (!form.date) return toast.error("Date is required");
    setLoading(true);
    const res = await markAttendance({
      employeeId: employee._id,
      date: form.date,
      status: form.status,
      hoursWorked: Number(form.hoursWorked),
    });
    setLoading(false);
    if (res) {
      toast.success("Attendance marked");
      setDialogOpen(false);
      await onAttendanceMarked();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Attendance Records</h3>
        {canEdit && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Calendar className="h-4 w-4 mr-1" /> Mark Attendance
          </Button>
        )}
      </div>
      {employee.currentMonthAttendance && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-muted p-4 rounded-md">
          <div>
            <p className="text-sm text-muted-foreground">Present</p>
            <p className="text-xl font-bold text-green-600">
              {employee.currentMonthAttendance.present}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Absent</p>
            <p className="text-xl font-bold text-red-600">
              {employee.currentMonthAttendance.absent}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Late</p>
            <p className="text-xl font-bold text-yellow-600">
              {employee.currentMonthAttendance.late}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Half Day</p>
            <p className="text-xl font-bold text-orange-600">
              {employee.currentMonthAttendance.halfDay}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="text-xl font-bold">
              {employee.currentMonthAttendance.totalHours}
            </p>
          </div>
        </div>
      )}
      <Card>
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
              {attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No attendance records
                  </TableCell>
                </TableRow>
              ) : (
                attendance.map((rec) => (
                  <TableRow key={rec._id}>
                    <TableCell>{formatDate(rec.date)}</TableCell>
                    <TableCell>
                      {rec.checkInTime
                        ? formatDate(rec.checkInTime, "HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {rec.checkOutTime
                        ? formatDate(rec.checkOutTime, "HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell>{rec.totalHours?.toFixed(1) || 0}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor[rec.status]}>
                        {rec.status}
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
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Half-Day">Half-Day</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hours Worked</Label>
              <Input
                type="number"
                step="0.5"
                value={form.hoursWorked}
                onChange={(e) =>
                  setForm({ ...form, hoursWorked: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkAttendance} disabled={loading}>
              Mark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
