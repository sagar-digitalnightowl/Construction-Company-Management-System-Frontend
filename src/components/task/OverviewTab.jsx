import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  Link as LinkIcon,
  Bell,
  UserPlus,
  UserMinus,
  Trash2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { taskApi, authApi } from "@/api";
import { formatDate } from "@/lib/helpers";

export function OverviewTab({
  task,
  watchers,
  reminders,
  isOperator,
  isFullEdit,
  isSiteEngineer,
  onTaskUpdate,
}) {
  const [progress, setProgress] = useState(task.progress || 0);
  const [updating, setUpdating] = useState(false);
  const [users, setUsers] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [newTag, setNewTag] = useState({ name: "", color: "#3b82f6" });
  const [newDependency, setNewDependency] = useState({
    dependsOn: "",
    blockingReason: "",
  });
  const [reminderMessage, setReminderMessage] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [newWatcherId, setNewWatcherId] = useState("");
  const [dueDateRequest, setDueDateRequest] = useState({
    newDueDate: "",
    reason: "",
  });
  const [reassignRequest, setReassignRequest] = useState({
    reassignTo: "",
    reason: "",
  });

  useEffect(() => {
    if (isFullEdit && task.projectId?._id) {
      authApi.getUsers({ limit: 100 }).then((res) => {
        setUsers(res.data?.data?.users || []);
      });
      taskApi.getTasksByProject(task.projectId._id).then((res) => {
        setProjectTasks(res.data?.data?.tasks || []);
      });
    }
  }, [isFullEdit, task.projectId]);

  const updateProgress = async (value) => {
    if (!isOperator) return;
    setUpdating(true);
    try {
      await taskApi.updateTaskProgress(task._id, value);
      toast.success("Progress updated");
      setProgress(value);
      onTaskUpdate();
    } finally {
      setUpdating(false);
    }
  };

  const addTag = async () => {
    if (!newTag.name) return;
    setUpdating(true);
    try {
      await taskApi.addTag(task._id, newTag.name, newTag.color);
      toast.success("Tag added");
      setNewTag({ name: "", color: "#3b82f6" });
      onTaskUpdate();
    } finally {
      setUpdating(false);
    }
  };

  const addDependency = async () => {
    if (!newDependency.dependsOn) return;
    setUpdating(true);
    try {
      await taskApi.addDependency(
        task._id,
        newDependency.dependsOn,
        newDependency.blockingReason,
      );
      toast.success("Dependency added");
      setNewDependency({ dependsOn: "", blockingReason: "" });
      onTaskUpdate();
    } finally {
      setUpdating(false);
    }
  };

  const addReminder = async () => {
    if (!reminderMessage || !reminderDate) {
      toast.error("Message and date required");
      return;
    }
    setUpdating(true);
    try {
      await taskApi.addReminder(task._id, {
        message: reminderMessage,
        remindAt: reminderDate,
        type: "custom",
      });
      toast.success("Reminder set");
      setReminderMessage("");
      setReminderDate("");
      onTaskUpdate();
    } finally {
      setUpdating(false);
    }
  };

  const addWatcher = async () => {
    if (!newWatcherId) return toast.error("Select a user");
    setUpdating(true);
    try {
      await taskApi.addWatcher(task._id, newWatcherId);
      toast.success("Watcher added");
      setNewWatcherId("");
      onTaskUpdate();
    } finally {
      setUpdating(false);
    }
  };

  const removeWatcher = async (userId) => {
    setUpdating(true);
    try {
      await taskApi.removeWatcher(task._id, userId);
      toast.success("Watcher removed");
      onTaskUpdate();
    } finally {
      setUpdating(false);
    }
  };

  const requestDueDateChange = async () => {
    if (!dueDateRequest.newDueDate || !dueDateRequest.reason) return;
    setUpdating(true);
    try {
      await taskApi.requestDueDateChange(
        task._id,
        dueDateRequest.newDueDate,
        dueDateRequest.reason,
      );
      toast.success("Request sent");
      setDueDateRequest({ newDueDate: "", reason: "" });
    } finally {
      setUpdating(false);
    }
  };

  const requestReassignment = async () => {
    if (!reassignRequest.reassignTo || !reassignRequest.reason) return;
    setUpdating(true);
    try {
      await taskApi.requestReassignment(
        task._id,
        reassignRequest.reassignTo,
        reassignRequest.reason,
      );
      toast.success("Request sent");
      setReassignRequest({ reassignTo: "", reason: "" });
    } finally {
      setUpdating(false);
    }
  };

  // Attachment upload
  const uploadAttachment = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUpdating(true);
      try {
        const presigned = await taskApi.getPresignedUrl(
          task._id,
          file.name,
          "document",
          file.type,
        );
        const { uploadUrl, fileKey } = presigned.data?.data || {};
        if (uploadUrl) {
          await fetch(uploadUrl, { method: "PUT", body: file });
          await taskApi.confirmAttachment(task._id, fileKey, file.name);
          toast.success("File uploaded");
          onTaskUpdate();
        }
      } catch (err) {
        toast.error("Upload failed");
      } finally {
        setUpdating(false);
      }
    };
    fileInput.click();
  };

  const deleteAttachment = async (index) => {
    if (!isFullEdit) return toast.error("Permission denied");
    setUpdating(true);
    try {
      await taskApi.removeAttachment(task._id, index);
      toast.success("Attachment deleted");
      onTaskUpdate();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {task.description || "No description"}
          </p>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label>Priority</Label>
            <p className="capitalize">{task.priority}</p>
          </div>
          <div>
            <Label>Status</Label>
            <p className="capitalize">{task.status?.replace("_", " ")}</p>
          </div>
          <div>
            <Label>Due Date</Label>
            <p>{formatDate(task.dueDate)}</p>
          </div>
          <div>
            <Label>Completed At</Label>
            <p>{task.completedAt ? formatDate(task.completedAt) : "—"}</p>
          </div>
          <div>
            <Label>Requires Safety Approval</Label>
            <p>{task.requiresSafetyApproval ? "Yes" : "No"}</p>
          </div>
          <div>
            <Label>Assigned To</Label>
            <p>{task.assignedTo?.name || "Unassigned"}</p>
          </div>
          <div>
            <Label>Assigned By</Label>
            <p>{task.assignedBy?.name || "—"}</p>
          </div>
          <div>
            <Label>Created</Label>
            <p>{formatDate(task.createdAt)}</p>
          </div>
          <div>
            <Label>Estimated Hours</Label>
            <p>{task.estimatedHours || "—"}</p>
          </div>
          <div>
            <Label>Actual Hours</Label>
            <p>{task.actualHours?.toFixed(1) || "0"}</p>
          </div>
          <div>
            <Label>Remaining Hours</Label>
            <p>{task.remainingHours?.toFixed(1) || "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Slider */}
      {isOperator && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{progress}%</span>
              <Slider
                value={[progress]}
                onValueChange={([val]) => setProgress(val)}
                onValueCommit={([val]) => updateProgress(val)}
                disabled={updating}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {isFullEdit && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-4 w-4" /> Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {task.tags?.map((tag, idx) => (
                <Badge
                  key={idx}
                  style={{ backgroundColor: tag.color }}
                  className="text-white"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Tag name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              />
              <Input
                type="color"
                value={newTag.color}
                onChange={(e) =>
                  setNewTag({ ...newTag, color: e.target.value })
                }
                className="w-16"
              />
              <Button size="sm" onClick={addTag} disabled={updating}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Labels */}
      {task.labels?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Labels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {task.labels.map((label, idx) => (
                <Badge key={idx} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dependencies */}
      {isFullEdit && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <LinkIcon className="h-4 w-4" /> Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {task.dependencies?.map((dep, idx) => (
              <div key={idx} className="text-sm border-b pb-2">
                Depends on: {dep.dependsOnTitle || dep.dependsOn} –{" "}
                {dep.blockingReason || "No reason"}
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={newDependency.dependsOn}
                onValueChange={(val) =>
                  setNewDependency({ ...newDependency, dependsOn: val })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a task to depend on..." />
                </SelectTrigger>
                <SelectContent>
                  {projectTasks
                    .filter((t) => t._id !== task._id)
                    .map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.title} ({t.status})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Blocking reason (optional)"
                value={newDependency.blockingReason}
                onChange={(e) =>
                  setNewDependency({
                    ...newDependency,
                    blockingReason: e.target.value,
                  })
                }
              />
              <Button onClick={addDependency} disabled={updating}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Site Engineer Request Forms */}
      {isSiteEngineer && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Request Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="New Due Date (YYYY-MM-DD)"
                value={dueDateRequest.newDueDate}
                onChange={(e) =>
                  setDueDateRequest({
                    ...dueDateRequest,
                    newDueDate: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Reason"
                value={dueDateRequest.reason}
                onChange={(e) =>
                  setDueDateRequest({
                    ...dueDateRequest,
                    reason: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={requestDueDateChange} disabled={updating}>
              Request Due Date Change
            </Button>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Reassign To User ID"
                value={reassignRequest.reassignTo}
                onChange={(e) =>
                  setReassignRequest({
                    ...reassignRequest,
                    reassignTo: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Reason"
                value={reassignRequest.reason}
                onChange={(e) =>
                  setReassignRequest({
                    ...reassignRequest,
                    reason: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={requestReassignment} disabled={updating}>
              Request Reassignment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reminders */}
      {isOperator && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-4 w-4" /> Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.length > 0 && (
              <div className="space-y-2">
                {reminders.map((rem) => (
                  <div
                    key={rem._id}
                    className="text-sm bg-muted p-2 rounded-md"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{rem.message}</span>
                      <Badge variant={rem.isSent ? "secondary" : "outline"}>
                        {rem.isSent ? "Sent" : "Pending"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(rem.remindAt)} • {rem.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Message"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
              />
              <Input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>
            <Button onClick={addReminder} disabled={updating}>
              Set Reminder
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Watchers */}
      {isFullEdit && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Watchers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={newWatcherId}
                onChange={(e) => setNewWatcherId(e.target.value)}
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              <Button onClick={addWatcher} disabled={updating}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchers.map((w) => (
                <div
                  key={w._id}
                  className="flex items-center gap-1 bg-secondary rounded-full px-2 py-1 text-sm"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback>{w.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span>{w.name || w._id}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => removeWatcher(w._id)}
                    disabled={updating}
                  >
                    <UserMinus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-4 w-4" /> Attachments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={uploadAttachment}
            disabled={updating}
          >
            Upload Attachment
          </Button>
          {task.attachments?.length > 0 ? (
            <div className="space-y-2">
              {task.attachments.map((att, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    {att.name}
                  </a>
                  {isFullEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAttachment(idx)}
                      disabled={updating}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No attachments</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
