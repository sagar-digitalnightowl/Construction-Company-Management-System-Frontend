import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Play,
  Check,
  AlertCircle,
  Clock,
  StopCircle,
  Paperclip,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { taskApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/helpers";

// Tab components (same as before)
import { OverviewTab } from "@/components/task/OverviewTab";
import { ChecklistTab } from "@/components/task/ChecklistTab";
import { SubtasksTab } from "@/components/task/SubtasksTab";
import { CommentsTab } from "@/components/task/CommentsTab";
import { TimeLogsTab } from "@/components/task/TimeLogsTab";
import { ActivityTab } from "@/components/task/ActivityTab";
import { ViewsTab } from "@/components/task/ViewsTab";

// Permission helpers
const canFullEdit = (role) =>
  ["admin", "director", "project_manager"].includes(role);
const canOperate = (role) =>
  ["admin", "director", "project_manager", "site_engineer"].includes(role);

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
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
  const [reminders, setReminders] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [activeTimer, setActiveTimer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch data
  const fetchTaskData = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getTaskById(taskId);
      const data = res.data?.data || {};
      setTask(data.task);
      setComments(data.comments || []);
      setHistory(data.history || []);
      setWatchers(data.watchers || []);
      setReminders(data.reminders || []);

      const timeRes = await taskApi.getTimeTracking(taskId);
      const tracks = timeRes.data?.data?.tracks || [];
      setTimeLogs(tracks);
      const hasActiveTrack = tracks.some((track) => track.isActive === true);
      setActiveTimer(hasActiveTrack);
    } catch (err) {
      toast.error("Failed to load task details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) fetchTaskData();
  }, [taskId]);

  // --- Status update ---
  const updateStatus = async (status) => {
    if (!isOperator) return toast.error("You don't have permission");
    setUpdating(true);
    try {
      await taskApi.updateTaskStatus(taskId, status);
      toast.success("Status updated");
      await fetchTaskData();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // --- Time tracking ---
  const startTracking = async () => {
    setUpdating(true);
    try {
      await taskApi.startTimeTrack(taskId, "Started work");
      toast.success("Time tracking started");
      await fetchTaskData();
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
      await fetchTaskData();
    } catch (err) {
      toast.error("Failed to stop tracking");
    } finally {
      setUpdating(false);
    }
  };

  // --- Attachments upload ---
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
          await fetchTaskData();
        }
      } catch (err) {
        toast.error("Upload failed");
      } finally {
        setUpdating(false);
      }
    };
    fileInput.click();
  };

  const handleBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="min-w-max px-1 mb-1"
          >
            <ArrowLeft className="h-5 w-5 mr-1" /> Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) return null;

  const overdueText = task.isOverdue
    ? `Overdue${task.daysOverdue ? ` by ${task.daysOverdue} day${task.daysOverdue !== 1 ? "s" : ""}` : ""}`
    : "";

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="min-w-max px-1 mb-1"
          >
            <ArrowLeft className="h-5 w-5 mr-1" /> Back
          </Button>
          <PageHeader
            title={task.title}
            description={
              <>
                {task.projectId?.name} • {task.projectId?.clientName}
                {task.milestoneId && ` • Milestone: ${task.milestoneId.name}`}
              </>
            }
            eyebrow="Task Details"
          />
        </div>
        <div className="flex gap-2">
          {task.isArchived && (
            <span className="text-xs text-muted-foreground">Archived</span>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-xl font-semibold capitalize mt-1">
              {task.status?.replace("_", " ")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Priority</p>
            <p className="text-xl font-semibold capitalize mt-1">
              {task.priority}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="text-xl font-semibold mt-1">
              {formatDate(task.dueDate)}
            </p>
            {task.isOverdue && (
              <p className="text-xs text-red-500 mt-1">{overdueText}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-xl font-semibold mt-1">
              {task.completionPercentage || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions bar – same as modal */}
      {isOperator && (
        <div className="flex flex-wrap gap-2 py-3 border-b">
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
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="timelogs">Time Logs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            task={task}
            watchers={watchers}
            reminders={reminders}
            isOperator={isOperator}
            isFullEdit={isFullEdit}
            isSiteEngineer={isSiteEngineer}
            onTaskUpdate={fetchTaskData}
          />
        </TabsContent>

        <TabsContent value="checklist">
          <ChecklistTab
            task={task}
            isOperator={isOperator}
            onUpdate={fetchTaskData}
          />
        </TabsContent>

        <TabsContent value="subtasks">
          <SubtasksTab
            task={task}
            isOperator={isOperator}
            isFullEdit={isFullEdit}
            onUpdate={fetchTaskData}
          />
        </TabsContent>

        <TabsContent value="comments">
          <CommentsTab
            comments={comments}
            isOperator={isOperator}
            taskId={taskId}
            onCommentAdded={fetchTaskData}
          />
        </TabsContent>

        <TabsContent value="timelogs">
          <TimeLogsTab timeLogs={timeLogs} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab history={history} />
        </TabsContent>

        <TabsContent value="views">
          <ViewsTab projectId={task.projectId?._id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
