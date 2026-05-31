import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function ShiftDialog({ open, onOpenChange, shift, onSuccess }) {
  const { createShift, updateShift, loading } = useHR();
  const [form, setForm] = useState({
    name: "",
    startTime: "09:00",
    endTime: "18:00",
    description: "",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    isActive: true,
    totalHours: 8,
    gracePeriodMinutes: 30,
    isNightShift: false,
    nightShiftAllowance: 0,
  });

  const isEdit = !!shift;

  useEffect(() => {
    if (shift) {
      setForm({
        name: shift.name || "",
        startTime: shift.startTime || "09:00",
        endTime: shift.endTime || "18:00",
        description: shift.description || "",
        workingDays: shift.workingDays || [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        isActive: shift.isActive !== undefined ? shift.isActive : true,
        totalHours: shift.totalHours || 8,
        gracePeriodMinutes: shift.gracePeriodMinutes || 30,
        isNightShift: shift.isNightShift || false,
        nightShiftAllowance: shift.nightShiftAllowance || 0,
      });
    } else {
      setForm({
        name: "",
        startTime: "09:00",
        endTime: "18:00",
        description: "",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        isActive: true,
        totalHours: 8,
        gracePeriodMinutes: 30,
        isNightShift: false,
        nightShiftAllowance: 0,
      });
    }
  }, [shift, open]);

  const handleWorkingDaysChange = (day) => {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.startTime || !form.endTime) {
      toast.error("Name, start time, and end time are required");
      return;
    }

    const payload = {
      name: form.name,
      startTime: form.startTime,
      endTime: form.endTime,
      description: form.description || undefined,
      workingDays: form.workingDays,
      isActive: form.isActive,
      totalHours: Number(form.totalHours),
      gracePeriodMinutes: Number(form.gracePeriodMinutes),
      isNightShift: form.isNightShift,
      nightShiftAllowance: Number(form.nightShiftAllowance),
    };

    let success;
    if (isEdit) {
      success = await updateShift(shift._id, payload);
    } else {
      success = await createShift(payload);
    }

    if (success) {
      onSuccess?.();
      onOpenChange(false);
    }
  };

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Shift" : "Create Shift"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Shift Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Morning Shift"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="totalHours">Total Hours</Label>
              <Input
                id="totalHours"
                type="number"
                step="0.5"
                value={form.totalHours}
                onChange={(e) =>
                  setForm({ ...form, totalHours: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="gracePeriod">Grace Period (minutes)</Label>
              <Input
                id="gracePeriod"
                type="number"
                value={form.gracePeriodMinutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gracePeriodMinutes: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label>Working Days</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {weekdays.map((day) => (
                <Button
                  key={day}
                  type="button"
                  size="sm"
                  variant={
                    form.workingDays.includes(day) ? "default" : "outline"
                  }
                  onClick={() => handleWorkingDaysChange(day)}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isNightShift">Night Shift</Label>
            <Switch
              id="isNightShift"
              checked={form.isNightShift}
              onCheckedChange={(checked) =>
                setForm({ ...form, isNightShift: checked })
              }
            />
          </div>

          {form.isNightShift && (
            <div>
              <Label htmlFor="nightShiftAllowance">
                Night Shift Allowance (₹)
              </Label>
              <Input
                id="nightShiftAllowance"
                type="number"
                value={form.nightShiftAllowance}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nightShiftAllowance: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Shift description"
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm({ ...form, isActive: checked })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
