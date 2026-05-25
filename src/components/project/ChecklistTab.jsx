// src/components/project/ChecklistTab.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Plus, Loader2, X, RefreshCw, User } from "lucide-react";
import { projectApi } from "@/api/projectApi";
import { toast } from "sonner";

export function ChecklistTab({ projectId, canOperationsEdit }) {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null); // { checklistId, itemIndex, isCompleted }
  const [form, setForm] = useState({
    title: "",
    items: [{ item: "", isCompleted: false, remarks: "" }],
    inspectorName: "",
  });

  const fetchChecklists = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getSafetyChecklists(projectId);
      const data = res.data?.data || res.data || [];
      setChecklists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load checklists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchChecklists();
  }, [projectId]);

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { item: "", isCompleted: false, remarks: "" }],
    });
  };

  const removeItem = (idx) => {
    if (form.items.length === 1) {
      toast.warning("At least one item required");
      return;
    }
    const newItems = form.items.filter((_, i) => i !== idx);
    setForm({ ...form, items: newItems });
  };

  const updateFormItem = (idx, field, value) => {
    const newItems = [...form.items];
    newItems[idx][field] = value;
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.items.some((item) => item.item.trim())) {
      toast.error("At least one checklist item is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        items: form.items.map((item) => ({
          item: item.item,
          isCompleted: item.isCompleted,
          remarks: item.remarks || undefined,
        })),
        inspectorName: form.inspectorName || undefined,
      };
      await projectApi.createSafetyChecklist(projectId, payload);
      toast.success("Checklist created successfully");
      setOpen(false);
      setForm({
        title: "",
        items: [{ item: "", isCompleted: false, remarks: "" }],
        inspectorName: "",
      });
      await fetchChecklists();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create checklist";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update a single checklist item's completion status
  const toggleItemCompletion = async (
    checklistId,
    itemIndex,
    currentStatus,
  ) => {
    if (!canOperationsEdit) {
      toast.error("You don't have permission to edit checklists");
      return;
    }
    const checklist = checklists.find((c) => c._id === checklistId);
    if (!checklist) return;

    const updatedItems = [...checklist.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      isCompleted: !currentStatus,
      // Optionally set completedBy/completedAt if API supports
    };

    // Compute new overall status based on items
    const allCompleted = updatedItems.every((item) => item.isCompleted);
    const anyCompleted = updatedItems.some((item) => item.isCompleted);
    let newStatus = checklist.status;
    if (allCompleted) newStatus = "completed";
    else if (anyCompleted) newStatus = "in_progress";
    else newStatus = "pending";

    setUpdatingItem({ checklistId, itemIndex, isCompleted: !currentStatus });
    try {
      await projectApi.updateSafetyChecklist(projectId, checklistId, {
        items: updatedItems,
        status: newStatus,
      });
      toast.success("Item updated");
      await fetchChecklists(); // refresh all
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update item");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Manually update overall status (if needed)
  const updateOverallStatus = async (checklistId, newStatus) => {
    if (!canOperationsEdit) return;
    try {
      await projectApi.updateSafetyChecklist(projectId, checklistId, {
        status: newStatus,
      });
      toast.success(`Status changed to ${newStatus}`);
      await fetchChecklists();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getProgress = (items) => {
    if (!items?.length) return 0;
    const completed = items.filter((i) => i.isCompleted).length;
    return (completed / items.length) * 100;
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
        <h2 className="text-lg font-semibold">Safety Checklists</h2>
        {canOperationsEdit && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Checklist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Safety Checklist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label>Title *</Label>
                  <Input
                    placeholder="e.g., Daily Safety Inspection"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Inspector Name</Label>
                  <Input
                    placeholder="Name of person conducting inspection"
                    value={form.inspectorName}
                    onChange={(e) =>
                      setForm({ ...form, inspectorName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Checklist Items *</Label>
                  {form.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 border rounded-md p-3 relative"
                    >
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="Item description"
                            value={item.item}
                            onChange={(e) =>
                              updateFormItem(idx, "item", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Checkbox
                              checked={item.isCompleted}
                              onCheckedChange={(c) =>
                                updateFormItem(idx, "isCompleted", c)
                              }
                              id={`new-item-${idx}`}
                            />
                            <Label
                              htmlFor={`new-item-${idx}`}
                              className="text-xs"
                            >
                              Completed
                            </Label>
                          </div>
                          {form.items.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(idx)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <Textarea
                        placeholder="Remarks (optional)"
                        value={item.remarks || ""}
                        onChange={(e) =>
                          updateFormItem(idx, "remarks", e.target.value)
                        }
                        className="text-sm"
                        rows={1}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Item
                  </Button>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting && (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    )}
                    Create Checklist
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {checklists.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No safety checklists found.{" "}
            {canOperationsEdit && 'Click "New Checklist" to create one.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklists.map((cl) => {
            const progress = getProgress(cl.items);
            const completedCount =
              cl.items?.filter((i) => i.isCompleted).length || 0;
            const totalCount = cl.items?.length || 0;
            return (
              <Card key={cl._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{cl.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(cl.status)}>
                        {cl.status || "pending"}
                      </Badge>
                      {/* {canOperationsEdit && cl.status !== "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateOverallStatus(cl._id, "completed")
                          }
                          className="h-6 text-xs"
                        >
                          Mark Complete
                        </Button>
                      )} */}
                    </div>
                  </div>
                  {cl.inspectorName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Inspector: {cl.inspectorName}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Created by: {cl.createdBy?.name || "Unknown"}</span>
                    </div>
                    <span>{new Date(cl.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>
                        {completedCount}/{totalCount} items
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 mt-2">
                    {cl.items?.map((it, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Checkbox
                          checked={it.isCompleted}
                          onCheckedChange={() =>
                            toggleItemCompletion(cl._id, i, it.isCompleted)
                          }
                          disabled={
                            !canOperationsEdit ||
                            (updatingItem?.checklistId === cl._id &&
                              updatingItem?.itemIndex === i)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <span
                            className={
                              it.isCompleted
                                ? "line-through text-muted-foreground"
                                : ""
                            }
                          >
                            {it.item}
                          </span>
                          {it.remarks && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Note: {it.remarks}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
