// src/components/procurement/CreateRfqDialog.jsx
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
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";
import { projectApi, vendorApi } from "@/api";

export function CreateRfqDialog({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState({
    materialRequestId: "",
    projectId: "",
    title: "",
    description: "",
    submissionDeadline: "",
    invitedVendors: [],
  });
  const [projects, setProjects] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);


  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoadingProjects(true);
        try {
          const [projRes, vendorRes] = await Promise.all([
            projectApi.getAll(),
            vendorApi.getAll(),
          ]);
          setProjects(projRes.data?.data?.projects || []);
          setVendors(vendorRes.data?.data?.users || []);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load data");
        } finally {
          setLoadingProjects(false);
        }
      };
      fetchData();
    }
  }, [open]);

  const fetchMaterialRequests = async (projectId) => {
    if (!projectId) return;
    try {
      const res = await projectApi.getMaterialRequests(projectId);
      setMaterialRequests(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load material requests");
    }
  };

  const handleSubmit = async () => {
    // All fields except description are required
    if (!form.title) return toast.error("Title is required");
    if (!form.projectId) return toast.error("Project is required");
    if (!form.materialRequestId)
      return toast.error("Material request is required");
    if (!form.submissionDeadline)
      return toast.error("Submission deadline is required");
    if (form.invitedVendors.length === 0)
      return toast.error("At least one vendor must be invited");

    setLoading(true);
    const success = await onCreate(form);
    setLoading(false);
    if (success) {
      onOpenChange(false);
      setForm({
        materialRequestId: "",
        projectId: "",
        title: "",
        description: "",
        submissionDeadline: "",
        invitedVendors: [],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create RFQ</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Cement required for Sky Tower"
            />
          </div>
          <div className="space-y-1">
            <Label>Project *</Label>
            <Select
              value={form.projectId}
              onValueChange={(val) => {
                setForm({ ...form, projectId: val, materialRequestId: "" });
                fetchMaterialRequests(val);
              }}
              disabled={loadingProjects}
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
            <Label>Material Request *</Label>
            <Select
              value={form.materialRequestId}
              onValueChange={(val) =>
                setForm({ ...form, materialRequestId: val })
              }
              disabled={!form.projectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material request" />
              </SelectTrigger>
              <SelectContent>
                {materialRequests.map((mr) => (
                  <SelectItem key={mr._id} value={mr._id}>
                    {mr.title} – {mr.materialName} ({mr.quantity} {mr.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Description (optional)</Label>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe the requirement"
            />
          </div>
          <div className="space-y-1">
            <Label>Submission Deadline *</Label>
            <Input
              type="date"
              value={form.submissionDeadline}
              onChange={(e) =>
                setForm({ ...form, submissionDeadline: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Invited Vendors *</Label>
            <MultiSelect
              options={vendors?.map((v) => ({ label: v.name, value: v._id }))}
              value={form.invitedVendors}
              onValueChange={(val) => setForm({ ...form, invitedVendors: val })}
              placeholder="Select vendors"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Create RFQ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
