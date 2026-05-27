import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { taskApi } from "@/api";
import { toast } from "sonner";

export function SubtasksTab({ task, isOperator, isFullEdit, onUpdate }) {
  const [newSubtask, setNewSubtask] = useState("");
  const [updating, setUpdating] = useState(false);

  const addSubtask = async () => {
    if (!newSubtask.trim()) return;
    if (!isFullEdit)
      return toast.error("Only Admin, Director or PM can add subtasks");
    setUpdating(true);
    try {
      await taskApi.addSubtask(task._id, { title: newSubtask });
      setNewSubtask("");
      onUpdate();
      toast.success("Subtask added");
    } finally {
      setUpdating(false);
    }
  };

  const toggleSubtask = async (index, currentStatus) => {
    if (!isOperator) return toast.error("Permission denied");
    setUpdating(true);
    try {
      await taskApi.updateSubtaskStatus(task._id, index, !currentStatus);
      onUpdate();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {isFullEdit && (
        <div className="flex gap-2">
          <Input
            placeholder="New subtask"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSubtask()}
          />
          <Button onClick={addSubtask} disabled={updating}>
            Add
          </Button>
        </div>
      )}
      <ScrollArea className="h-96">
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
    </div>
  );
}
