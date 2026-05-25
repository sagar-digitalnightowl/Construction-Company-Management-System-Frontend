// src/components/project/ResourceTab.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Loader2,
  User,
  Wrench,
  Truck,
  Package,
  Users,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";
import { projectApi, authApi } from "@/api";

const RESOURCE_TYPES = [
  { value: "engineer", label: "Engineer", icon: User },
  { value: "labor", label: "Labor", icon: Users },
  { value: "machine", label: "Machine", icon: HardDrive },
  { value: "equipment", label: "Equipment", icon: Wrench },
  { value: "vehicle", label: "Vehicle", icon: Truck },
  { value: "material", label: "Material", icon: Package },
];

const getResourceIcon = (type) => {
  const found = RESOURCE_TYPES.find((t) => t.value === type);
  return found?.icon || Package;
};

export function ResourceTab({ projectId, canEdit }) {
  const [resources, setResources] = useState([]);
  const [totalResources, setTotalResources] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [form, setForm] = useState({
    resourceType: "",
    resourceId: "",
    resourceName: "",
    allocationStart: "",
    allocationEnd: "",
    quantity: 1,
  });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getResources(projectId);
      const data = res.data?.data || {};
      setResources(data.resources || []);
      setTotalResources(data.totalResources || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (users.length > 0) return;
    setLoadingUsers(true);
    try {
      const res = await authApi.getUsers({ limit: 100 });
      const usersList = res.data?.data?.users || [];
      setUsers(usersList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [projectId]);

  const handleResourceTypeChange = (type) => {
    setForm({ ...form, resourceType: type, resourceId: "", resourceName: "" });
    if (type === "engineer" || type === "labor") {
      fetchUsers();
    }
  };

  const handleUserSelect = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setForm({
        ...form,
        resourceId: userId,
        resourceName: `${user.name} (${user.role})`,
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.resourceType) {
      toast.error("Resource type is required");
      return;
    }
    if (!form.resourceName) {
      toast.error("Resource name is required");
      return;
    }
    if (!form.allocationStart || !form.allocationEnd) {
      toast.error("Allocation dates are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        resourceType: form.resourceType,
        resourceId: form.resourceId || `temp-${Date.now()}`,
        resourceName: form.resourceName,
        allocationStart: form.allocationStart,
        allocationEnd: form.allocationEnd,
        quantity: form.quantity || 1,
      };
      await projectApi.allocateResource(projectId, payload);
      toast.success("Resource allocated successfully");
      setOpen(false);
      resetForm();
      await fetchResources();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to allocate resource";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      resourceType: "",
      resourceId: "",
      resourceName: "",
      allocationStart: "",
      allocationEnd: "",
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Resources</h2>
          <p className="text-sm text-muted-foreground">
            Total allocated resources: {totalResources}
          </p>
        </div>
        {canEdit && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Allocate Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Allocate New Resource</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label>Resource Type *</Label>
                  <Select
                    value={form.resourceType}
                    onValueChange={handleResourceTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {form.resourceType === "engineer" ||
                form.resourceType === "labor" ? (
                  <div className="space-y-1">
                    <Label>
                      Select{" "}
                      {form.resourceType === "engineer" ? "Engineer" : "Labor"}
                    </Label>
                    <Select
                      value={form.resourceId}
                      onValueChange={handleUserSelect}
                      disabled={loadingUsers}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingUsers
                              ? "Loading users..."
                              : `Choose ${form.resourceType}`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label>Resource Name *</Label>
                    <Input
                      placeholder="e.g., JCB Excavator, Concrete Mixer"
                      value={form.resourceName}
                      onChange={(e) =>
                        setForm({ ...form, resourceName: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Allocation Start *</Label>
                    <Input
                      type="date"
                      value={form.allocationStart}
                      onChange={(e) =>
                        setForm({ ...form, allocationStart: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Allocation End *</Label>
                    <Input
                      type="date"
                      value={form.allocationEnd}
                      onChange={(e) =>
                        setForm({ ...form, allocationEnd: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">Default: 1</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting && (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    )}
                    Allocate
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No resources allocated yet.{" "}
            {canEdit && 'Click "Allocate Resource" to add one.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, idx) => {
            const resourceType = resource.resourceType || "unknown";
            const Icon = getResourceIcon(resourceType);
            const isActive = resource.isActive !== false;
            const displayName =
              resource.resourceName ||
              resource.resourceDetails?.name ||
              "Unnamed Resource";
            const hasUserDetails =
              resource.resourceDetails && resourceType !== "material";

            return (
              <Card key={idx} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {resourceType} • Qty: {resource.quantity}
                        </p>
                      </div>
                    </div>
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {resource.allocationStart && resource.allocationEnd && (
                    <p className="text-xs mt-2">
                      📅{" "}
                      {new Date(resource.allocationStart).toLocaleDateString()}{" "}
                      – {new Date(resource.allocationEnd).toLocaleDateString()}
                    </p>
                  )}
                  {hasUserDetails && (
                    <div className="mt-2 text-xs border-t pt-2 text-muted-foreground">
                      <p>
                        Email: {resource.resourceDetails.email} | Phone:{" "}
                        {resource.resourceDetails.phone}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
