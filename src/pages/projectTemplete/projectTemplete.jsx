import React, { useEffect, useState, useCallback } from "react";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { projectApi } from "@/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";

export default function ProjectTemplate() {
  const { current } = useAuthStore();
  const canEdit = canMutate(current?.role, "project-template");

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    defaultSettings: {
      budget: "",
      priority: "medium",
    },
    defaultMilestones: [],
  });

  const [milestoneInput, setMilestoneInput] = useState("");

  // ─── Fetch Templates ─────────────────────────────
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectApi.getTemplates();
      const list = res?.data?.data || [];
      setTemplates(list);
    } catch (err) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // ─── Create Template ─────────────────────────────
  const handleSave = async () => {
    if (!form.name) {
      toast.error("Template name is required");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description || undefined,
      defaultSettings: {
        ...(form.defaultSettings.budget && {
          budget: Number(form.defaultSettings.budget),
        }),
        ...(form.defaultSettings.priority && {
          priority: form.defaultSettings.priority,
        }),
      },
      defaultMilestones: form.defaultMilestones,
    };

    try {
      const res = await projectApi.createTemplate(payload);

      if (res.data.success) {
        toast.success("Template created");
        setOpen(false);
        resetForm();
        fetchTemplates();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create template");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      defaultSettings: {
        budget: "",
        priority: "medium",
      },
      defaultMilestones: [],
    });
  };

  // ─── Milestone Add ─────────────────────────────
  const addMilestone = () => {
    if (!milestoneInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      defaultMilestones: [...prev.defaultMilestones, milestoneInput],
    }));
    setMilestoneInput("");
  };

  const removeMilestone = (index) => {
    setForm((prev) => ({
      ...prev,
      defaultMilestones: prev.defaultMilestones.filter((_, i) => i !== index),
    }));
  };

  // ─── UI ─────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Project Templates"
        description="Create reusable templates for faster project setup."
        actions={
          canEdit && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Template
            </Button>
          )
        }
      />

      {/* LIST */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : templates.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No templates found"
          description="Create your first project template."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Card key={t._id}>
              <CardContent className="h-full p-4 space-y-3 flex flex-col gap-2 ">
                <div>
                  <p className="font-semibold text-lg">{t.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.description || "No description"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {t.defaultMilestones?.map((m, i) => (
                    <Badge key={i} variant="secondary">
                      {m}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs mt-auto">
                  Budget: {t.defaultSettings?.budget || "—"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Template name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              {/* Budget */}
              <Input
                placeholder="Budget"
                type="number"
                value={form.defaultSettings.budget}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultSettings: {
                      ...form.defaultSettings,
                      budget: e.target.value,
                    },
                  })
                }
              />

              {/* Priority */}
              <Select
                value={form.defaultSettings.priority}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    defaultSettings: {
                      ...form.defaultSettings,
                      priority: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Milestones */}
            <div>
              <p className="text-sm mb-1">Milestones</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Add milestone"
                  value={milestoneInput}
                  onChange={(e) => setMilestoneInput(e.target.value)}
                />
                <Button onClick={addMilestone}>Add</Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {form.defaultMilestones.map((m, i) => (
                  <Badge
                    key={i}
                    onClick={() => removeMilestone(i)}
                    className="cursor-pointer"
                  >
                    {m} ✕
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
