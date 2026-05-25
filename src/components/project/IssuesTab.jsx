// src/components/project/IssuesTab.jsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const severityVariant = {
  low: "muted",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
};

export function IssuesTab({
  issues = [],
  canOperationsEdit,
  teamMembers = [],
  onAddIssue,
  onResolveIssue,
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "medium",
    assignedTo: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const success = await onAddIssue(form);
    setSaving(false);
    if (success) {
      setOpen(false);
      setForm({
        title: "",
        description: "",
        severity: "medium",
        assignedTo: "",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {issues.length} issue(s)
        </p>

        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3 w-3 mr-1" /> Report Issue
        </Button>
      </div>

      {issues.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            No issues reported
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {issues.map((issue) => (
            <Card
              key={issue._id}
              className={issue.status === "resolved" ? "opacity-60" : ""}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle
                  className={`h-4 w-4 mt-0.5 ${issue.status === "resolved" ? "text-muted-foreground" : "text-destructive"}`}
                />
                <div className="flex-1">
                  <div className="flex gap-2 flex-wrap">
                    <p className="font-medium">{issue.title}</p>
                    <Badge
                      variant={severityVariant[issue.severity] || "secondary"}
                    >
                      {issue.severity}
                    </Badge>
                    {issue.status === "resolved" && (
                      <Badge variant="success">Resolved</Badge>
                    )}
                  </div>
                  {issue.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {issue.description}
                    </p>
                  )}
                  {issue.status === "resolved" && issue.resolution && (
                    <p className="text-xs text-green-600 mt-2">
                      <strong>Resolution:</strong> {issue.resolution}
                    </p>
                  )}
                </div>
                {canOperationsEdit && issue.status !== "resolved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResolveIssue(issue._id)}
                  >
                    Resolve
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Issue Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report New Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Cement shortage"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Severity *</Label>
              <Select
                value={form.severity}
                onValueChange={(val) => setForm({ ...form, severity: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    Low – Minor issue, minimal impact
                  </SelectItem>
                  <SelectItem value="medium">
                    Medium – Moderate issue, needs attention
                  </SelectItem>
                  <SelectItem value="high">
                    High – Significant issue, requires immediate action
                  </SelectItem>
                  <SelectItem value="critical">
                    Critical – Project-blocking issue, escalation needed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Description (optional)</Label>
              <Textarea
                rows={2}
                placeholder="Detailed description of the issue"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Assign To (optional)</Label>
              <Select
                value={form.assignedTo}
                onValueChange={(val) => setForm({ ...form, assignedTo: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name} ({member.role || "member"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Assign issue to a project team member
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              Report Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
