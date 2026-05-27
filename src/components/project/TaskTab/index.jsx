// src/components/project/TasksTab.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskDetailDialog } from "@/components/project/TaskTab/TaskDetailDialog";
import { CreateTaskDialog } from "@/components/project/TaskTab/CreateTaskDialog";
import { taskApi } from "@/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const priorityColors = { low: "muted", medium: "warning", high: "destructive" };
const statusColors = {
  todo: "secondary",
  in_progress: "default",
  review: "warning",
  done: "success",
  blocked: "destructive",
};

function TaskCard({ task, onStatusChange, onClick, canOperationsEdit }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/tasks/${task._id}`)}
      className="cursor-pointer hover:shadow-md transition"
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{task.title}</p>
            {task.milestone?.name && (
              <p className="text-xs text-muted-foreground">
                {task.milestone.name}
              </p>
            )}
          </div>
          <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            Due:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No date"}
          </span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <Badge variant={statusColors[task.status]}>
            {task.status.replace("_", " ")}
          </Badge>
          <select
            className="text-xs border rounded px-1 py-0.5"
            value={task.status}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(task._id, e.target.value);
            }}
            disabled={!canOperationsEdit}
          >
            {" "}
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>{" "}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}

export function TasksTab({
  projectId,
  milestones = [],
  teamMembers = [],
  canEdit,
  canOperationsEdit,
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getTasksByProject(projectId);

      // console.log("resp[onse from api : ", res)
      setTasks(res.data?.data?.tasks || []);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskApi.updateTaskStatus(taskId, status);
      toast.success("Status updated");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filtered = tasks?.filter(
    (t) =>
      (filter === "all" || t.status === filter) &&
      (!search || t.title.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="todo">To Do</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              className="pl-7 w-48"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {canEdit && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> New Task
          </Button>
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">No tasks found</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onClick={setSelectedTask}
              canOperationsEdit={canOperationsEdit}
            />
          ))}
        </div>
      )}
      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        projectId={projectId}
        milestones={milestones}
        teamMembers={teamMembers}
        onCreate={taskApi.createTask}
        onTaskCreated={fetchTasks}
      />
      <TaskDetailDialog
        open={!!selectedTask}
        onOpenChange={() => setSelectedTask(null)}
        taskId={selectedTask?._id}
        onUpdate={fetchTasks}
        canEdit={canEdit}
        canOperationsEdit={canOperationsEdit}
      />
    </div>
  );
}
