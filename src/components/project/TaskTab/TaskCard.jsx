// src/components/task/TaskCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { useNavigate } from "react-router-dom";

const priorityColors = {
  low: "muted",
  medium: "warning",
  high: "destructive",
};

const statusColors = {
  todo: "secondary",
  assigned: "secondary",
  in_progress: "default",
  blocked: "destructive",
  review: "warning",
  testing: "info",
  approved: "success",
  done: "success",
  cancelled: "outline",
};

export function TaskCard({
  task,
  onStatusChange,
  onClick,
  showProject = false,
}) {
  const navigate = useNavigate();
  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusChange(task._id, e.target.value);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
      onClick={() => navigate(`/tasks/${task._id}`)}
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
            {showProject && task.project?.name && (
              <p className="text-xs text-muted-foreground">
                {task.project.name}
              </p>
            )}
          </div>
          <Badge
            variant={priorityColors[task.priority]}
            className="shrink-0 ml-2"
          >
            {task.priority}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          {task.dueDate && (
            <>
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate)}</span>
            </>
          )}
          {task.estimatedHours && (
            <>
              <Clock className="h-3 w-3 ml-1" />
              <span>{task.estimatedHours}h</span>
            </>
          )}
          {task.assignedTo && (
            <>
              <User className="h-3 w-3 ml-1" />
              <span>{task.assignedTo.name}</span>
            </>
          )}
          {task.isOverdue && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>
        <div className="flex justify-between items-center pt-1">
          <Badge variant={statusColors[task.status]}>
            {task.status.replace("_", " ")}
          </Badge>
          <select
            className="text-xs border rounded px-1 py-0.5 bg-background"
            value={task.status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="todo">To Do</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="review">Review</option>
            <option value="testing">Testing</option>
            <option value="approved">Approved</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancel</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
