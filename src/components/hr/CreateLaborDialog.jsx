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
import { useHR } from "@/hooks/useHR";
import { useProject } from "@/hooks/useProject";
import { toast } from "sonner";
import { projectApi } from "@/api";

export function CreateLaborDialog({ open, onOpenChange, onSuccess }) {
  const { createLabor, loading } = useHR();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    laborType: "Unskilled",
    trade: "General Helper",
    dailyWage: "",
    assignedProject: "",
    assignedSite: "",
    standardHoursPerDay: 8,
  });

  useEffect(() => {
    if (open)
      projectApi
        .getAll()
        .then((res) => setProjects(res.data?.data?.projects || []))
        .catch(console.error);
  }, [open]);   

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.dailyWage || !form.assignedProject) {
      toast.error("Name, phone, daily wage and project are required");
      return;
    }
    const success = await createLabor(form);
    if (success) {
      onSuccess?.();
      onOpenChange(false);
      setForm({
        name: "",
        phone: "",
        laborType: "Unskilled",
        trade: "General Helper",
        dailyWage: "",
        assignedProject: "",
        assignedSite: "",
        standardHoursPerDay: 8,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Labor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Ramesh Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="+919876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="laborType">Labor Type</Label>
            <Select
              value={form.laborType}
              onValueChange={(v) => setForm({ ...form, laborType: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select labor type" />
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
            <Label htmlFor="trade">Trade / Skill</Label>
            <Select
              value={form.trade}
              onValueChange={(v) => setForm({ ...form, trade: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trade" />
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
            <Label htmlFor="dailyWage">Daily Wage (₹) *</Label>
            <Input
              id="dailyWage"
              type="number"
              placeholder="e.g., 500"
              value={form.dailyWage}
              onChange={(e) => setForm({ ...form, dailyWage: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="assignedProject">Project *</Label>
            <Select
              value={form.assignedProject}
              onValueChange={(v) => setForm({ ...form, assignedProject: v })}
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
          <div>
            <Label htmlFor="assignedSite">Site (Optional)</Label>
            <Input
              id="assignedSite"
              placeholder="Site name or ID"
              value={form.assignedSite}
              onChange={(e) =>
                setForm({ ...form, assignedSite: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="standardHoursPerDay">Standard Hours/Day</Label>
            <Input
              id="standardHoursPerDay"
              type="number"
              placeholder="Default 8"
              value={form.standardHoursPerDay}
              onChange={(e) =>
                setForm({
                  ...form,
                  standardHoursPerDay: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Create Labor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
