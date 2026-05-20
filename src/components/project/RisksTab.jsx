// src/components/project/RisksTab.jsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function RisksTab({ risks = [], canEdit, onAddRisk }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    impact: "medium",
    probability: "medium",
    mitigationPlan: "",
  });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.title) {
      toast.error("Risk title is required");
      return;
    }
    setSaving(true);
    const success = await onAddRisk(form);
    setSaving(false);
    if (success) {
      setOpen(false);
      setForm({
        title: "",
        description: "",
        impact: "medium",
        probability: "medium",
        mitigationPlan: "",
      });
    }
  };

  const impactVariant = {
    low: "muted",
    medium: "warning",
    high: "destructive",
    critical: "destructive",
  };
  const probabilityVariant = {
    low: "muted",
    medium: "secondary",
    high: "destructive",
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{risks.length} risk(s)</p>
        {canEdit && (
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> Add Risk
          </Button>
        )}
      </div>

      {risks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">No risks added</CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {risks.map((risk) => (
            <Card key={risk._id}>
              <CardContent className="p-4 flex items-start gap-3">
                <Shield className="h-4 w-4 mt-1 text-yellow-500" />
                <div className="flex-1">
                  <div className="flex gap-2 flex-wrap">
                    <p className="font-medium">{risk.title}</p>
                    <Badge variant={impactVariant[risk.impact] || "secondary"}>
                      Impact: {risk.impact}
                    </Badge>
                    <Badge
                      variant={
                        probabilityVariant[risk.probability] || "secondary"
                      }
                    >
                      Probability: {risk.probability}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {risk.description}
                  </p>
                  {risk.mitigationPlan && (
                    <p className="text-xs text-blue-600 mt-2">
                      <strong>Mitigation:</strong> {risk.mitigationPlan}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Risk Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Project Risk</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Material delay risk"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the risk"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Impact *</Label>
                <Select
                  value={form.impact}
                  onValueChange={(val) => setForm({ ...form, impact: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low – Minor impact</SelectItem>
                    <SelectItem value="medium">
                      Medium – Moderate impact
                    </SelectItem>
                    <SelectItem value="high">
                      High – Significant impact
                    </SelectItem>
                    <SelectItem value="critical">
                      Critical – Project-threatening
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Probability *</Label>
                <Select
                  value={form.probability}
                  onValueChange={(val) =>
                    setForm({ ...form, probability: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select probability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low – {"<"}20% chance</SelectItem>
                    <SelectItem value="medium">
                      Medium – 20-60% chance
                    </SelectItem>
                    <SelectItem value="high">High – {">"}60% chance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Mitigation Plan</Label>
              <Textarea
                placeholder="How will this risk be mitigated?"
                rows={2}
                value={form.mitigationPlan}
                onChange={(e) =>
                  setForm({ ...form, mitigationPlan: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving}>
              Add Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
