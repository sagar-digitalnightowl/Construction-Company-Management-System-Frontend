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
import { toast } from "sonner";

export function LaborWageDialog({ open, onOpenChange, wage, onSuccess }) {
  const { createLaborWage, updateLaborWage, loading } = useHR();
  const [form, setForm] = useState({
    laborType: "",
    dailyWage: "",
    hoursPerDay: 8,
  });
  const isEdit = !!wage;

  useEffect(() => {
    if (wage) {
      setForm({
        laborType: wage.laborType || "",
        dailyWage: wage.dailyWage || "",
        hoursPerDay: wage.hoursPerDay || 8,
      });
    } else {
      setForm({ laborType: "", dailyWage: "", hoursPerDay: 8 });
    }
  }, [wage, open]);

  const handleSubmit = async () => {
    if (!form.laborType || !form.dailyWage) {
      toast.error("Labor type and daily wage are required");
      return;
    }
    const payload = {
      laborType: form.laborType,
      dailyWage: Number(form.dailyWage),
      hoursPerDay: Number(form.hoursPerDay),
    };
    let success;
    if (isEdit) {
      success = await updateLaborWage(wage._id, payload);
    } else {
      success = await createLaborWage(payload);
    }
    if (success) {
      onSuccess?.();
      onOpenChange(false);
    }
  };

  const laborTypes = [
    "Skilled", "Semi-Skilled", "Unskilled", "Supervisor", "Helper",
    "Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Welder",
    "Steel Fixer", "Concrete Worker", "General Helper"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Labor Wage" : "Add Labor Wage"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Labor Type *</Label>
            <Select value={form.laborType} onValueChange={(v) => setForm({ ...form, laborType: v })}>
              <SelectTrigger><SelectValue placeholder="Select labor type" /></SelectTrigger>
              <SelectContent>
                {laborTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
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
            <Label>Hours Per Day</Label>
            <Input
              type="number"
              placeholder="8"
              value={form.hoursPerDay}
              onChange={(e) => setForm({ ...form, hoursPerDay: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{isEdit ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}