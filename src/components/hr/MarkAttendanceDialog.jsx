import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function MarkAttendanceDialog({ open, onOpenChange, onSuccess }) {
  const { fetchAllAttendance } = useHR();
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Present");
  const [hoursWorked, setHoursWorked] = useState(8);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!employeeId) return toast.error("Select employee");
    setLoading(true);
    try {
      await fetchAllAttendance({ employeeId, date, status, hoursWorked });
      toast.success("Attendance marked");
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Attendance (Admin Only)</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Employee ID</Label>
            <Input
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
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
              value={hoursWorked}
              onChange={(e) => setHoursWorked(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Mark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
