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
import { toast } from "sonner";
import { projectApi } from "@/api/projectApi";

export function MarkAttendanceDialog({ open, onOpenChange, onSubmit }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: "",
    date: new Date().toISOString().split("T")[0],
    skilledLabor: "",
    semiSkilledLabor: "",
    unskilledLabor: "",
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

  const handleSubmit = async () => {
    if (!form.projectId) return toast.error("Project is required");
    if (!form.skilledLabor || !form.semiSkilledLabor || !form.unskilledLabor)
      return toast.error("Labor count is required");

    setLoading(true);
    const success = await onSubmit({
        ...form, 
        skilledLabor: parseInt(form.skilledLabor),
        semiSkilledLabor: parseInt(form.semiSkilledLabor),  
        unskilledLabor: parseInt(form.unskilledLabor),
        totalLaborCount: parseInt(form.skilledLabor) + parseInt(form.semiSkilledLabor) + parseInt(form.unskilledLabor),
        });
    setLoading(false);
    if (success) {
      onOpenChange(false);
      setForm({
        projectId: "",
        date: new Date().toISOString().split("T")[0],
        skilledLabor: "",
        semiSkilledLabor: "",
        unskilledLabor: "",
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
          <div className="">
            <Label>Labor Count</Label>
            <div className="flex gap-2">
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
          </div>
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
