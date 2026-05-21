// src/components/site/ReportIssueDialog.jsx
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

export function ReportIssueDialog({ open, onOpenChange, onSubmit }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    severity: "medium",
    assignedTo: "",
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
    if (!form.title) return toast.error("Title is required");
    setLoading(true);
    const success = await onSubmit(form);
    setLoading(false);
    if (success) {
      onOpenChange(false);
      setForm({
        projectId: "",
        title: "",
        description: "",
        severity: "medium",
        assignedTo: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Site Issue</DialogTitle>
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
              placeholder="e.g., Cement shortage"
            />
          </div>
          <div className="space-y-1">
            <Label>Severity *</Label>
            <Select
              value={form.severity}
              onValueChange={(v) => setForm({ ...form, severity: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low – Minor issue</SelectItem>
                <SelectItem value="medium">Medium – Needs attention</SelectItem>
                <SelectItem value="high">High – Immediate action</SelectItem>
                <SelectItem value="critical">
                  Critical – Project-blocking
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Detailed description"
            />
          </div>
          <div className="space-y-1">
            <Label>Assign To (optional)</Label>
            <Input
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              placeholder="User ID"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Report Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
