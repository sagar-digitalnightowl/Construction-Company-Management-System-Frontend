// src/components/site/CreateSafetyChecklistDialog.jsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { projectApi } from "@/api/projectApi";

export function CreateSafetyChecklistDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: "",
    title: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    items: [],
    overallRemarks: "",
    safetyStatus: "safe",
    nextInspectionDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      projectApi
        .getAll()
        .then((res) => setProjects(res.data?.data?.projects || []))
        .catch(console.error);
    }
    if (initialData) {
      setForm({
        projectId: initialData.projectId?._id || initialData.projectId || "",
        title: initialData.title || "",
        inspectionDate: initialData.inspectionDate?.split("T")[0] || "",
        items: initialData.items || [],
        overallRemarks: initialData.overallRemarks || "",
        safetyStatus: initialData.safetyStatus || "safe",
        nextInspectionDate: initialData.nextInspectionDate?.split("T")[0] || "",
      });
    } else {
      setForm({
        projectId: "",
        title: "",
        inspectionDate: new Date().toISOString().split("T")[0],
        items: [],
        overallRemarks: "",
        safetyStatus: "safe",
        nextInspectionDate: "",
      });
    }
  }, [open, initialData]);

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { item: "", isCompleted: false, remarks: "" }],
    });
  };
  const updateItem = (idx, field, value) => {
    const newItems = [...form.items];
    newItems[idx][field] = value;
    setForm({ ...form, items: newItems });
  };
  const removeItem = (idx) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async () => {
    if (!form.projectId) return toast.error("Project is required");
    if (!form.title) return toast.error("Title is required");
    if (form.items.length === 0)
      return toast.error("At least one checklist item is required");
    setLoading(true);
    const success = await onSubmit(form);
    setLoading(false);
    if (success) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Safety Checklist" : "Create Safety Checklist"}
          </DialogTitle>
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
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Daily Safety Inspection"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Inspection Date</Label>
              <Input
                type="date"
                value={form.inspectionDate}
                onChange={(e) =>
                  setForm({ ...form, inspectionDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Next Inspection</Label>
              <Input
                type="date"
                value={form.nextInspectionDate}
                onChange={(e) =>
                  setForm({ ...form, nextInspectionDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Checklist Items</Label>
            {form.items.map((item, idx) => (
              <div key={idx} className="border rounded-md p-2 space-y-2">
                <Input
                  placeholder="Item description"
                  value={item.item}
                  onChange={(e) => updateItem(idx, "item", e.target.value)}
                />
                <div className="flex gap-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={(e) =>
                        updateItem(idx, "isCompleted", e.target.checked)
                      }
                    />
                    Completed
                  </label>
                  <Input
                    placeholder="Remarks"
                    value={item.remarks}
                    onChange={(e) => updateItem(idx, "remarks", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItem(idx)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={addItem}>
              + Add Item
            </Button>
          </div>
          <div className="space-y-1">
            <Label>Safety Status</Label>
            <Select
              value={form.safetyStatus}
              onValueChange={(v) => setForm({ ...form, safetyStatus: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="caution">Caution</SelectItem>
                <SelectItem value="unsafe">Unsafe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Overall Remarks</Label>
            <Textarea
              rows={2}
              value={form.overallRemarks}
              onChange={(e) =>
                setForm({ ...form, overallRemarks: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
