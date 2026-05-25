// src/components/site/MarkAttendanceDialog.jsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { projectApi } from "@/api";

export function MarkAttendanceDialog({ open, onOpenChange, onSubmit }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: "",
    date: new Date().toISOString().split("T")[0],
    totalLaborCount: "",
    skilledLabor: "",
    semiSkilledLabor: "",
    unskilledLabor: "",
    laborNames: "",
    isOvertime: false,
    overtimeHours: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      projectApi
        .getAll()
        .then((res) => {
          setProjects(res.data?.data?.projects || []);
        })
        .catch(console.error);
    }
  }, [open]);

  // Auto-calculate total when skilled/semi/unskilled change
  useEffect(() => {
    const skilled = parseInt(form.skilledLabor) || 0;
    const semi = parseInt(form.semiSkilledLabor) || 0;
    const unskilled = parseInt(form.unskilledLabor) || 0;
    const total = skilled + semi + unskilled;
    setForm((prev) => ({ ...prev, totalLaborCount: total || "" }));
  }, [form.skilledLabor, form.semiSkilledLabor, form.unskilledLabor]);

  const handleSubmit = async () => {
    if (!form.projectId) return toast.error("Project is required");
    if (!form.totalLaborCount || parseInt(form.totalLaborCount) <= 0) {
      return toast.error("Total labor count must be greater than 0");
    }

    setLoading(true);
    const payload = {
      projectId: form.projectId,
      date: form.date,
      totalLaborCount: parseInt(form.totalLaborCount),
      skilledLabor: parseInt(form.skilledLabor) || 0,
      semiSkilledLabor: parseInt(form.semiSkilledLabor) || 0,
      unskilledLabor: parseInt(form.unskilledLabor) || 0,
      isOvertime: form.isOvertime,
      remarks: form.remarks || undefined,
    };

    // Add laborNames if provided (split by comma)
    if (form.laborNames && form.laborNames.trim()) {
      payload.laborNames = form.laborNames
        .split(",")
        .map((name) => name.trim());
    }

    // Add overtimeHours if overtime is true
    if (form.isOvertime && form.overtimeHours) {
      payload.overtimeHours = parseInt(form.overtimeHours);
    }

    const success = await onSubmit(payload);
    setLoading(false);
    if (success) {
      onOpenChange(false);
      setForm({
        projectId: "",
        date: new Date().toISOString().split("T")[0],
        totalLaborCount: "",
        skilledLabor: "",
        semiSkilledLabor: "",
        unskilledLabor: "",
        laborNames: "",
        isOvertime: false,
        overtimeHours: "",
        remarks: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Project *</Label>
            <Select
              value={form.projectId}
              onValueChange={(v) => setForm({ ...form, projectId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Date *</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Labor Count</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Skilled"
                value={form.skilledLabor}
                onChange={(e) =>
                  setForm({ ...form, skilledLabor: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Semi-skilled"
                value={form.semiSkilledLabor}
                onChange={(e) =>
                  setForm({ ...form, semiSkilledLabor: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Unskilled"
                value={form.unskilledLabor}
                onChange={(e) =>
                  setForm({ ...form, unskilledLabor: e.target.value })
                }
              />
            </div>
            <div className="mt-2">
              <Label>Total Labor</Label>
              <Input
                type="number"
                value={form.totalLaborCount}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Labor Names (optional)</Label>
            <Input
              placeholder="Ramesh, Suresh, Mahesh"
              value={form.laborNames}
              onChange={(e) => setForm({ ...form, laborNames: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of worker names
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label>Overtime</Label>
            <Switch
              checked={form.isOvertime}
              onCheckedChange={(checked) =>
                setForm({ ...form, isOvertime: checked })
              }
            />
          </div>

          {form.isOvertime && (
            <div className="space-y-1">
              <Label>Overtime Hours</Label>
              <Input
                type="number"
                step="0.5"
                placeholder="e.g., 2"
                value={form.overtimeHours}
                onChange={(e) =>
                  setForm({ ...form, overtimeHours: e.target.value })
                }
              />
            </div>
          )}

          <div className="space-y-1">
            <Label>Remarks</Label>
            <Input
              placeholder="Additional notes"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Mark Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
