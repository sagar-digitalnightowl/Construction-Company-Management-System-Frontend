// src/pages/tasks/MyTasks.jsx
import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Search, Filter, ListTodo } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/project/TaskTab/TaskCard";
import { TaskDetailDialog } from "@/components/project/TaskTab/TaskDetailDialog";
import { taskApi } from "@/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getMyTasks();
      setTasks(res.data?.data?.tasks || []);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskApi.updateTaskStatus(taskId, status);
      toast.success("Status updated");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filtered = tasks.filter((t) => {
    const matchStatus = filter === "all" || t.status === filter;
    const matchSearch =
      !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tasks"
        title="My Tasks"
        description="View and manage tasks assigned to you."
      />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks assigned"
          description="When tasks are assigned to you, they will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onClick={setSelectedTask}
              showProject
            />
          ))}
        </div>
      )}
      <TaskDetailDialog
        open={!!selectedTask}
        onOpenChange={() => setSelectedTask(null)}
        taskId={selectedTask?._id}
        onUpdate={fetchTasks}
      />
    </div>
  );
}
