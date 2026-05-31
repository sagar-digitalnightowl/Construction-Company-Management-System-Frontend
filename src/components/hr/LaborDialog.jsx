import React, { useState, useEffect, use } from "react";
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
import { useProject } from "@/hooks/useProject";
import { toast } from "sonner";
import { projectApi } from "@/api";

export function LaborDialog({ open, onOpenChange, labor, onSuccess }) {
  const { createLabor, updateLabor, loading } = useHR();
   const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    laborType: "Unskilled",
    trade: "General Helper",
    dailyWage: "",
    assignedProject: "",
    assignedSite: "",
    joiningDate: "",
    standardHoursPerDay: 8,
  });

  const isEdit = !!labor;

  useEffect(() => {
    if (open) projectApi
      .getAll()
      .then((res) => setProjects(res.data?.data?.projects || []))
      .catch(console.error);;
  }, [open]);



  useEffect(() => {
    if (labor) {
      setForm({
        name: labor.name || "",
        phone: labor.phone || "",
        laborType: labor.laborType || "Unskilled",
        trade: labor.trade || "General Helper",
        dailyWage: labor.dailyWage || "",
        assignedProject:
          labor.assignedProject?._id || labor.assignedProject || "",
        assignedSite: labor.assignedSite || "",
        joiningDate: labor.joiningDate?.split("T")[0] || "",
        standardHoursPerDay: labor.standardHoursPerDay || 8,
      });
    } else {
      setForm({
        name: "",
        phone: "",
        laborType: "Unskilled",
        trade: "General Helper",
        dailyWage: "",
        assignedProject: "",
        assignedSite: "",
        joiningDate: "",
        standardHoursPerDay: 8,
      });
    }
  }, [labor, open]);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.dailyWage || !form.assignedProject) {
      toast.error("Name, phone, daily wage and project are required");
      return;
    }
    const payload = {
      name: form.name,
      phone: form.phone,
      laborType: form.laborType,
      trade: form.trade,
      dailyWage: Number(form.dailyWage),
      assignedProject: form.assignedProject,
      assignedSite: form.assignedSite || undefined,
      joiningDate: form.joiningDate || undefined,
      standardHoursPerDay: Number(form.standardHoursPerDay),
    };
    let success;
    if (isEdit) {
      success = await updateLabor(labor._id, payload);
    } else {
      success = await createLabor(payload);
    }
    if (success) {
      onSuccess?.();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Labor" : "Add Labor"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Full Name *</Label>
            <Input
              placeholder="e.g., Ramesh Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Phone Number *</Label>
            <Input
              placeholder="+919876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label>Labor Type</Label>
            <Select
              value={form.laborType}
              onValueChange={(v) => setForm({ ...form, laborType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Skilled">Skilled</SelectItem>
                <SelectItem value="Semi-Skilled">Semi-Skilled</SelectItem>
                <SelectItem value="Unskilled">Unskilled</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Helper">Helper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Trade</Label>
            <Select
              value={form.trade}
              onValueChange={(v) => setForm({ ...form, trade: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mason">Mason</SelectItem>
                <SelectItem value="Carpenter">Carpenter</SelectItem>
                <SelectItem value="Electrician">Electrician</SelectItem>
                <SelectItem value="Plumber">Plumber</SelectItem>
                <SelectItem value="Painter">Painter</SelectItem>
                <SelectItem value="Welder">Welder</SelectItem>
                <SelectItem value="Steel Fixer">Steel Fixer</SelectItem>
                <SelectItem value="Concrete Worker">Concrete Worker</SelectItem>
                <SelectItem value="General Helper">General Helper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Daily Wage (₹) *</Label>
            <Input
              type="number"
              placeholder="500"
              value={form.dailyWage}
              onChange={(e) => setForm({ ...form, dailyWage: e.target.value })}
            />
          </div>
          <div>
            <Label>Project *</Label>
            <Select
              value={form.assignedProject}
              onValueChange={(v) => setForm({ ...form, assignedProject: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Site (Optional)</Label>
            <Input
              placeholder="Site name or ID"
              value={form.assignedSite}
              onChange={(e) =>
                setForm({ ...form, assignedSite: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Joining Date</Label>
            <Input
              type="date"
              value={form.joiningDate}
              onChange={(e) =>
                setForm({ ...form, joiningDate: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Standard Hours/Day</Label>
            <Input
              type="number"
              placeholder="8"
              value={form.standardHoursPerDay}
              onChange={(e) =>
                setForm({ ...form, standardHoursPerDay: e.target.value })
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
