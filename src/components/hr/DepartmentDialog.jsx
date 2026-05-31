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
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function DepartmentDialog({
  open,
  onOpenChange,
  department,
  onSuccess,
}) {
  const { createDepartment, updateDepartment, loading } = useHR();
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  const isEdit = !!department;

  useEffect(() => {
    if (department) {
      setForm({
        name: department.name || "",
        code: department.code || "",
        description: department.description || "",
      });
    } else {
      setForm({ name: "", code: "", description: "" });
    }
  }, [department, open]);

  const handleSubmit = async () => {
    if (!form.name || !form.code) {
      toast.error("Name and code are required");
      return;
    }

    let success;
    if (isEdit) {
      success = await updateDepartment(department._id, form);
    } else {
      success = await createDepartment(form);
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
          <DialogTitle>
            {isEdit ? "Edit Department" : "Add Department"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Engineering"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="code">Department Code *</Label>
            <Input
              id="code"
              placeholder="e.g., ENG"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the department"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
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
