// src/components/project/MaterialRequestsTab.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { projectApi, inventoryApi } from "@/api";

export function MaterialRequestsTab({ projectId, canEdit = true }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    materialId: "",
    materialName: "",
    quantity: "",
    unit: "",
    requiredByDate: "",
    priority: "medium",
    deliveryLocation: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [requestsRes, materialsRes] = await Promise.all([
        projectApi.getMaterialRequests(projectId),
        inventoryApi.getAllMaterials({ limit: 100 }),
      ]);
      setRequests(requestsRes.data?.data || []);
      setMaterials(materialsRes.data?.data?.materials || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId]);

  const handleCreate = async () => {
    if (!form.title) return toast.error("Title is required");
    if (!form.materialId && !form.materialName)
      return toast.error("Please select or enter a material");
    if (!form.quantity) return toast.error("Quantity is required");
    if (!form.unit) return toast.error("Unit is required");
    if (!form.requiredByDate)
      return toast.error("Required by date is required");

    setSaving(true);
    try {
      let payload = {
        title: form.title,
        description: form.description,
        materialId: form.materialId,
        materialName: form.materialName,
        quantity: Number(form.quantity),
        unit: form.unit,
        requiredByDate: form.requiredByDate,
        priority: form.priority,
        deliveryLocation: form.deliveryLocation || undefined,
      };

      if (!form.materialId && form.materialName) {
        payload.materialId = `temp-${Date.now()}`;
      }

      const res = await projectApi.createMaterialRequest(projectId, payload);
      if (res.data?.success) {
        toast.success("Material request created");
        setOpen(false);
        resetForm();
        fetchData();
      } else {
        throw new Error(res.data?.message || "Creation failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create request");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      materialId: "",
      materialName: "",
      quantity: "",
      unit: "",
      requiredByDate: "",
      priority: "medium",
      deliveryLocation: "",
    });
  };

  const statusColor = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
    rfq_generated: "default",
    po_generated: "default",
    delivered: "outline",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {requests.length} request(s)
        </p>
        {canEdit && (
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> New Request
          </Button>
        )}
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            No material requests yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {requests.map((r) => (
            <Card key={r._id}>
              <CardContent className="p-4 flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.description}
                  </p>
                  <p className="text-xs">
                    {r.quantity} {r.unit} – {r.materialName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Required by: {r.requiredByDate?.split("T")[0]}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <Badge variant={statusColor[r.status] || "secondary"}>
                    {r.status}
                  </Badge>
                  <Badge variant="outline">{r.priority}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Material Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Cement required"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Material *</Label>
                <Select
                  value={form.materialId}
                  onValueChange={(val) => {
                    if (val === "other") {
                      setForm({
                        ...form,
                        materialId: "other",
                        materialName: "",
                        unit: "",
                      });
                    } else {
                      const selected = materials.find((m) => m._id === val);
                      setForm({
                        ...form,
                        materialId: val,
                        materialName: selected ? selected.name : "",
                        unit: selected ? selected.unit : "",
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.name} ({m.unit})
                      </SelectItem>
                    ))}
                    <SelectItem value="other">
                      Other (Enter manually)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.materialId === "other" && (
                <div className="space-y-1">
                  <Label>Material Name *</Label>
                  <Input
                    placeholder="Material name"
                    value={form.materialName}
                    onChange={(e) =>
                      setForm({ ...form, materialName: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label>Unit *</Label>
                <Input
                  placeholder="bags, kg, tons"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Required By Date *</Label>
                <Input
                  type="date"
                  value={form.requiredByDate}
                  onChange={(e) =>
                    setForm({ ...form, requiredByDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-1">
                <Label>Delivery Location (optional)</Label>
                <Input
                  placeholder="Site location"
                  value={form.deliveryLocation}
                  onChange={(e) =>
                    setForm({ ...form, deliveryLocation: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Description (optional)</Label>
              <Textarea
                rows={2}
                placeholder="Additional details"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
    