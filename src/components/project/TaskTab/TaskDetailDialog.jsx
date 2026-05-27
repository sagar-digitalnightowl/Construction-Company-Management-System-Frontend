// src/components/task/TaskDetailDialog.jsx
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import {
  Check,
  Play,
  AlertCircle,
  Send,
  Trash2,
  Plus,
  Clock,
  StopCircle,
  Bell,
  UserPlus,
  UserMinus,
  Paperclip,
  Calendar as CalendarIcon,
  TrendingUp,
  Link as LinkIcon,
  Tag,
  Archive,
  Flag,
  User,
  Calendar,
  GitBranch,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { authApi, taskApi } from "@/api";
import { formatDate, formatDuration } from "@/lib/helpers";
import { useAuthStore } from "@/store/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Permission helpers
const canFullEdit = (role) =>
  ["admin", "director", "project_manager"].includes(role);
const canOperate = (role) =>
  ["admin", "director", "project_manager", "site_engineer"].includes(role);

export function TaskDetailDialog({ open, onOpenChange, taskId, onUpdate }) {
  const { current } = useAuthStore();
  const userRole = current?.role;
  const isFullEdit = canFullEdit(userRole);
  const isOperator = canOperate(userRole);
  const isSiteEngineer = userRole === "site_engineer";

  // State
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [watchers, setWatchers] = useState([]);
  const [reminders, setReminders] = useState([]); // NEW: store existing reminders
  const [timeLogs, setTimeLogs] = useState([]);
  const [activeTimer, setActiveTimer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [users, setUsers] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  // Form states
  const [newComment, setNewComment] = useState("");
  const [newChecklist, setNewChecklist] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [progress, setProgress] = useState(0);
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
  const [newTag, setNewTag] = useState({ name: "", color: "#3b82f6" });
  const [newDependency, setNewDependency] = useState({
    dependsOn: "",
    blockingReason: "",
  });

  // Fetch all task data
  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getTaskById(taskId);
      const data = res.data?.data || {};
      setTask(data.task);
      setComments(data.comments || []);
      setHistory(data.history || []);
      setWatchers(data.watchers || []);
      setReminders(data.reminders || []); // NEW: populate reminders
      setProgress(data.task?.progress || 0);
      // Fetch time tracking separately
      const timeRes = await taskApi.getTimeTracking(taskId);
      const tracks = timeRes.data?.data?.tracks || [];
      setTimeLogs(tracks);
      // Check if any track is active
      const hasActiveTrack = tracks.some((track) => track.isActive === true);
      setActiveTimer(hasActiveTrack);

      if (data.task?.projectId?._id) {
        try {
          const tasksRes = await taskApi.getTasksByProject(
            data.task.projectId._id,
          );
          setProjectTasks(tasksRes.data?.data?.tasks || []);
        } catch (err) {
          console.error("Failed to load project tasks for dependency");
        }
      }
    } catch (err) {
      toast.error("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for watcher selection (admin only or from auth/users)
  const fetchUsers = async () => {
    try {
      const res = await authApi.getUsers({ limit: 100 });
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      console.error("Failed to load users");
    }
  };

  useEffect(() => {
    if (open && taskId) {
      fetchTask();
      if (isFullEdit) fetchUsers();
    }
  }, [open, taskId]);

  // ----- Status update (available to operators) -----
  const updateStatus = async (status) => {
    if (!isOperator) return toast.error("You don't have permission");
    setUpdating(true);
    try {
      await taskApi.updateTaskStatus(taskId, status);
      toast.success("Status updated");
      await fetchTask();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Comments (operators) -----
  const addComment = async () => {
    if (!newComment.trim()) return;
    setUpdating(true);
    try {
      await taskApi.addComment(taskId, newComment);
      setNewComment("");
      await fetchTask();
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Checklist (operators) -----
  const addChecklistItem = async () => {
    if (!newChecklist.trim()) return;
    setUpdating(true);
    try {
      await taskApi.addChecklistItem(taskId, newChecklist);
      setNewChecklist("");
      await fetchTask();
    } catch (err) {
      toast.error("Failed to add checklist item");
    } finally {
      setUpdating(false);
    }
  };

  const updateChecklist = async (index, data) => {
    setUpdating(true);
    try {
      await taskApi.updateChecklistItem(taskId, index, data);
      await fetchTask();
    } catch (err) {
      toast.error("Failed to update checklist");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Subtasks: add (full edit only), toggle (operator) -----
  const addSubtask = async () => {
    if (!newSubtask.trim()) return;
    if (!isFullEdit)
      return toast.error("Only Admin, Director or PM can add subtasks");
    setUpdating(true);
    try {
      await taskApi.addSubtask(taskId, { title: newSubtask });
      setNewSubtask("");
      await fetchTask();
    } catch (err) {
      toast.error("Failed to add subtask");
    } finally {
      setUpdating(false);
    }
  };

  const toggleSubtask = async (index, currentStatus) => {
    if (!isOperator) return toast.error("Permission denied");
    setUpdating(true);
    try {
      await taskApi.updateSubtaskStatus(taskId, index, !currentStatus);
      await fetchTask();
    } catch (err) {
      toast.error("Failed to update subtask");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Time tracking (operators) -----
  const startTracking = async () => {
    setUpdating(true);
    try {
      await taskApi.startTimeTrack(taskId, "Started work");
      toast.success("Time tracking started");
      await fetchTask();
    } catch (err) {
      toast.error("Failed to start tracking");
    } finally {
      setUpdating(false);
    }
  };

  const stopTracking = async () => {
    setUpdating(true);
    try {
      await taskApi.stopTimeTrack(taskId, "Stopped work");
      toast.success("Time tracking stopped");
      await fetchTask();
    } catch (err) {
      toast.error("Failed to stop tracking");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Progress (operators) -----
  const updateProgress = async (value) => {
    if (!isOperator) return;
    setUpdating(true);
    try {
      await taskApi.updateTaskProgress(taskId, value);
      toast.success("Progress updated");
      setProgress(value);
      await fetchTask();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error("Failed to update progress");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Reminders (operators) -----
  const addReminder = async () => {
    if (!reminderMessage || !reminderDate) {
      toast.error("Message and date required");
      return;
    }
    setUpdating(true);
    try {
      await taskApi.addReminder(taskId, {
        message: reminderMessage,
        remindAt: reminderDate,
        type: "custom",
      });
      toast.success("Reminder set");
      setReminderMessage("");
      setReminderDate("");
      await fetchTask();
    } catch (err) {
      toast.error("Failed to set reminder");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Watchers (full edit only) -----
  const addWatcher = async () => {
    if (!newWatcherId) {
      toast.error("Select a user");
      return;
    }
    setUpdating(true);
    try {
      await taskApi.addWatcher(taskId, newWatcherId);
      toast.success("Watcher added");
      setNewWatcherId("");
      await fetchTask();
    } catch (err) {
      toast.error("Failed to add watcher");
    } finally {
      setUpdating(false);
    }
  };

  const removeWatcher = async (userId) => {
    if (!isFullEdit) return;
    setUpdating(true);
    try {
      await taskApi.removeWatcher(taskId, userId);
      toast.success("Watcher removed");
      await fetchTask();
    } catch (err) {
      toast.error("Failed to remove watcher");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Due date change request (site engineer only) -----
  const requestDueDateChange = async () => {
    if (!dueDateRequest.newDueDate || !dueDateRequest.reason) {
      toast.error("New due date and reason required");
      return;
    }
    setUpdating(true);
    try {
      await taskApi.requestDueDateChange(
        taskId,
        dueDateRequest.newDueDate,
        dueDateRequest.reason,
      );
      toast.success("Request sent to PM");
      setDueDateRequest({ newDueDate: "", reason: "" });
    } catch (err) {
      toast.error("Failed to send request");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Reassignment request (site engineer only) -----
  const requestReassignment = async () => {
    if (!reassignRequest.reassignTo || !reassignRequest.reason) {
      toast.error("User ID and reason required");
      return;
    }
    setUpdating(true);
    try {
      await taskApi.requestReassignment(
        taskId,
        reassignRequest.reassignTo,
        reassignRequest.reason,
      );
      toast.success("Reassignment request sent");
      setReassignRequest({ reassignTo: "", reason: "" });
    } catch (err) {
      toast.error("Failed to send request");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Attachments (operators can upload, full edit can delete) -----
  const uploadAttachment = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUpdating(true);
      try {
        const presigned = await taskApi.getPresignedUrl(
          taskId,
          file.name,
          "document",
          file.type,
        );
        const { uploadUrl, fileKey } = presigned.data?.data || {};
        if (uploadUrl) {
          await fetch(uploadUrl, { method: "PUT", body: file });
          await taskApi.confirmAttachment(taskId, fileKey, file.name);
          toast.success("File uploaded");
          await fetchTask();
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
    if (!isFullEdit) {
      toast.error("Only Admin, Director or PM can delete attachments");
      return;
    }
    setUpdating(true);
    try {
      await taskApi.removeAttachment(taskId, index);
      toast.success("Attachment deleted");
      await fetchTask();
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Tags (full edit only) -----
  const addTag = async () => {
    if (!newTag.name) return;
    setUpdating(true);
    try {
      await taskApi.addTag(taskId, newTag.name, newTag.color);
      toast.success("Tag added");
      setNewTag({ name: "", color: "#3b82f6" });
      await fetchTask();
    } catch (err) {
      toast.error("Failed to add tag");
    } finally {
      setUpdating(false);
    }
  };

  // ----- Dependencies (full edit only) -----
  const addDependency = async () => {
    if (!newDependency.dependsOn) return;
    setUpdating(true);
    try {
      await taskApi.addDependency(
        taskId,
        newDependency.dependsOn,
        newDependency.blockingReason,
      );
      toast.success("Dependency added");
      setNewDependency({ dependsOn: "", blockingReason: "" });
      await fetchTask();
    } catch (err) {
      toast.error("Failed to add dependency");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !task) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <div className="flex justify-center py-12">
            Loading task details...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Helper to show overdue badge with days
  const overdueText = task.isOverdue
    ? `Overdue${task.daysOverdue ? ` by ${task.daysOverdue} day${task.daysOverdue !== 1 ? "s" : ""}` : ""}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start flex-wrap gap-2">
            <DialogTitle className="text-xl font-semibold">
              {task.title}
            </DialogTitle>
            <div className="flex gap-2 mr-3">
              <Badge
                variant={task.priority === "high" ? "destructive" : "warning"}
              >
                {task.priority}
              </Badge>
              <Badge>{task.status?.replace("_", " ")}</Badge>
              {task.isArchived && <Badge variant="outline">Archived</Badge>}
              {task.isOverdue && (
                <Badge variant="destructive">{overdueText}</Badge>
              )}
            </div>
          </div>
          {task.milestoneId && (
            <p className="text-sm text-muted-foreground mt-1">
              Milestone: {task.milestoneId.name} (Due:{" "}
              {formatDate(task.milestoneId.dueDate)})
            </p>
          )}
          {task.projectId && (
            <p className="text-sm text-muted-foreground">
              Project: {task.projectId.name} - {task.projectId.clientName}
            </p>
          )}
        </DialogHeader>

        {/* Quick actions – only operators see status/timer/upload */}
        <div className="flex flex-wrap gap-2 py-3 border-b">
          {isOperator && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus("in_progress")}
                disabled={updating}
              >
                <Play className="h-3 w-3 mr-1" /> Start
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus("done")}
                disabled={updating}
              >
                <Check className="h-3 w-3 mr-1" /> Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus("blocked")}
                disabled={updating}
              >
                <AlertCircle className="h-3 w-3 mr-1" /> Block
              </Button>
              {activeTimer ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={stopTracking}
                  disabled={updating}
                >
                  <StopCircle className="h-3 w-3 mr-1" /> Stop Timer
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={startTracking}
                  disabled={updating}
                >
                  <Clock className="h-3 w-3 mr-1" /> Track Time
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={uploadAttachment}
                disabled={updating}
              >
                <Paperclip className="h-3 w-3 mr-1" /> Attach
              </Button>
            </>
          )}
        </div>

        {/* Basic info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm py-3">
          <div>
            <p className="text-muted-foreground text-xs">Due Date</p>
            <p className="font-medium">{formatDate(task.dueDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Assigned To</p>
            <p className="font-medium">
              {task.assignedTo?.name || "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Assigned By</p>
            <p className="font-medium">{task.assignedBy?.name || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Created</p>
            <p className="font-medium">{formatDate(task.createdAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Estimated Hours</p>
            <p className="font-medium">{task.estimatedHours || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Actual Hours</p>
            <p className="font-medium">{task.actualHours?.toFixed(1) || "0"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Remaining Hours</p>
            <p className="font-medium">
              {task.remainingHours?.toFixed(1) || "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Completion %</p>
            <p className="font-medium">{task.completionPercentage || 0}%</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="time">Time Logs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Details Tab – full info */}
          <TabsContent value="details" className="space-y-4">
            <div>
              <Label>Description</Label>
              <p className="text-sm mt-1">
                {task.description || "No description"}
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <p className="text-sm capitalize">{task.priority}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p className="text-sm capitalize">
                  {task.status?.replace("_", " ")}
                </p>
              </div>
              <div>
                <Label>Due Date</Label>
                <p className="text-sm">{formatDate(task.dueDate)}</p>
              </div>
              <div>
                <Label>Completed At</Label>
                <p className="text-sm">
                  {task.completedAt ? formatDate(task.completedAt) : "—"}
                </p>
              </div>
              <div>
                <Label>Requires Safety Approval</Label>
                <p className="text-sm">
                  {task.requiresSafetyApproval ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Progress slider – operators only */}
            {isOperator && (
              <div>
                <Label>Progress ({progress}%)</Label>
                <Slider
                  value={[progress]}
                  onValueChange={([val]) => setProgress(val)}
                  onValueCommit={([val]) => updateProgress(val)}
                  disabled={updating}
                />
              </div>
            )}

            {/* Tags – full edit can add */}
            {isFullEdit && (
              <div className="border rounded-md p-3 space-y-2">
                <h4 className="font-medium">Tags</h4>
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
                    onChange={(e) =>
                      setNewTag({ ...newTag, name: e.target.value })
                    }
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
                    <Tag className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
              </div>
            )}

            {/* Labels – display if any (NEW) */}
            {task.labels && task.labels.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <h4 className="font-medium">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((label, idx) => (
                    <Badge key={idx} variant="secondary">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies – full edit only */}
            {isFullEdit && (
              <div className="border rounded-md p-3 space-y-2">
                <h4 className="font-medium">Dependencies</h4>
                <div className="space-y-1">
                  {task.dependencies?.map((dep, idx) => (
                    <div key={idx} className="text-sm">
                      Depends on: {dep.dependsOnTitle || dep.dependsOn} –{" "}
                      {dep.blockingReason || "No reason"}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select
                      value={newDependency.dependsOn}
                      onValueChange={(val) =>
                        setNewDependency({ ...newDependency, dependsOn: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task to depend on..." />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTasks
                          .filter((t) => t._id !== task?._id)
                          .map((t) => (
                            <SelectItem key={t._id} value={t._id}>
                              {t.title} ({t.status})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="Blocking reason (optional)"
                    value={newDependency.blockingReason}
                    onChange={(e) =>
                      setNewDependency({
                        ...newDependency,
                        blockingReason: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addDependency} disabled={updating}>
                    <LinkIcon className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
              </div>
            )}

            {/* Site engineer request forms */}
            {isSiteEngineer && (
              <div className="border rounded-md p-3 space-y-3">
                <h4 className="font-medium">Request Changes</h4>
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
                <Button
                  size="sm"
                  onClick={requestDueDateChange}
                  disabled={updating}
                >
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
                <Button
                  size="sm"
                  onClick={requestReassignment}
                  disabled={updating}
                >
                  Request Reassignment
                </Button>
              </div>
            )}

            {/* Reminders – operators (display existing + set new) */}
            {isOperator && (
              <div className="border rounded-md p-3 space-y-3">
                <h4 className="font-medium">Reminders</h4>
                {/* Existing reminders list (NEW) */}
                {reminders.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <p className="text-xs text-muted-foreground">
                      Upcoming / existing reminders:
                    </p>
                    {reminders.map((rem) => (
                      <div
                        key={rem._id}
                        className="text-sm bg-muted/30 p-2 rounded-md"
                      >
                        <div className="flex justify-between items-start">
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
                <p className="text-sm">Set a new reminder:</p>
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
                <Button size="sm" onClick={addReminder} disabled={updating}>
                  <Bell className="h-3 w-3 mr-1" /> Set Reminder
                </Button>
              </div>
            )}

            {/* Watchers – full edit only */}
            {isFullEdit && (
              <div className="border rounded-md p-3 space-y-3">
                <h4 className="font-medium">Watchers</h4>
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
                  <Button size="sm" onClick={addWatcher} disabled={updating}>
                    <UserPlus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {watchers.map((w) => (
                    <div
                      key={w._id}
                      className="flex items-center gap-1 bg-secondary rounded-full px-2 py-1 text-sm"
                    >
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
              </div>
            )}

            {/* Attachments list */}
            <div className="border rounded-md p-3 space-y-3">
              <h4 className="font-medium">Attachments</h4>
              <div className="space-y-2">
                {task.attachments?.map((att, idx) => (
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
                {(!task.attachments || task.attachments.length === 0) && (
                  <p className="text-muted-foreground text-sm">
                    No attachments
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Checklist Tab – operators can add/update */}
          <TabsContent value="checklist" className="space-y-3">
            {isOperator && (
              <div className="flex gap-2">
                <Input
                  placeholder="New checklist item"
                  value={newChecklist}
                  onChange={(e) => setNewChecklist(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
                />
                <Button
                  size="sm"
                  onClick={addChecklistItem}
                  disabled={updating || !newChecklist.trim()}
                >
                  Add
                </Button>
              </div>
            )}
            <ScrollArea className="h-64">
              {task.checklist?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border rounded-md p-2 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() =>
                        updateChecklist(idx, { isCompleted: !item.isCompleted })
                      }
                      disabled={!isOperator}
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateChecklist(idx, { title: e.target.value })
                      }
                      className="border-none bg-transparent focus:outline-none"
                      disabled={!isOperator}
                    />
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          {/* Subtasks Tab – operators can toggle, full edit can add */}
          <TabsContent value="subtasks" className="space-y-3">
            {isFullEdit && (
              <div className="flex gap-2">
                <Input
                  placeholder="New subtask"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                />
                <Button
                  size="sm"
                  onClick={addSubtask}
                  disabled={updating || !newSubtask.trim()}
                >
                  Add
                </Button>
              </div>
            )}
            <ScrollArea className="h-64">
              {task.subtasks?.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 border rounded-md p-2 mb-2"
                >
                  <input
                    type="checkbox"
                    checked={sub.isCompleted}
                    onChange={() => toggleSubtask(idx, sub.isCompleted)}
                    disabled={!isOperator}
                  />
                  <span className={sub.isCompleted ? "line-through" : ""}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          {/* Comments Tab – operators can add */}
          <TabsContent value="comments" className="space-y-3">
            {isOperator && (
              <div className="flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment()}
                />
                <Button
                  size="sm"
                  onClick={addComment}
                  disabled={updating || !newComment.trim()}
                >
                  <Send className="h-3 w-3 mr-1" /> Post
                </Button>
              </div>
            )}
            <ScrollArea className="h-80">
              {comments.map((c) => (
                <div key={c._id} className="border rounded-md p-3 mb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {c.userId?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {c.userId?.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{c.text}</p>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          {/* Time Logs Tab */}
          <TabsContent value="time" className="space-y-3">
            <ScrollArea className="h-80">
              {timeLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No time tracking records
                </p>
              ) : (
                timeLogs.map((log, idx) => (
                  <div
                    key={log._id || idx}
                    className="border rounded-md p-3 mb-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">Session {idx + 1}</span>
                        {log.isActive && (
                          <Badge variant="success" className="ml-2 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <span className="font-medium">
                        {!log.isActive
                          ? `${formatDuration(log.durationMinutes * 60)}`
                          : "In progress"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Started: {formatDate(log.startTime)}
                      <br />
                      {log.endTime && `Stopped: ${formatDate(log.endTime)}`}
                    </div>
                    {log.notes && (
                      <p className="text-xs mt-1 italic">Notes: {log.notes}</p>
                    )}
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>

          {/* Activity Tab – history */}
          <TabsContent value="activity" className="space-y-3">
            <ScrollArea className="h-80">
              <div className="relative pl-4">
                <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
                {history.map((h) => (
                  <div key={h._id} className="relative flex gap-3 pb-4">
                    <div className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div className="ml-3 flex-1">
                      <p className="text-sm capitalize">
                        {h.action === "status_changed"
                          ? `Status changed from ${h.oldValue} to ${h.newValue}`
                          : h.action === "commented"
                            ? "Added a comment"
                            : h.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {h.changedBy?.name || "System"} –{" "}
                        {formatDate(h.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
