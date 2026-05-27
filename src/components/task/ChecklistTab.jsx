import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { taskApi } from "@/api";
import { toast } from "sonner";

export function ChecklistTab({ task, isOperator, onUpdate }) {
  const [newItem, setNewItem] = useState("");
  const [updating, setUpdating] = useState(false);

  const addItem = async () => {
    if (!newItem.trim()) return;
    setUpdating(true);
    try {
      await taskApi.addChecklistItem(task._id, newItem);
      setNewItem("");
      onUpdate();
      toast.success("Item added");
    } finally {
      setUpdating(false);
    }
  };

  const updateItem = async (index, data) => {
    setUpdating(true);
    try {
      await taskApi.updateChecklistItem(task._id, index, data);
      onUpdate();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {isOperator && (
        <div className="flex gap-2">
          <Input
            placeholder="New checklist item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <Button onClick={addItem} disabled={updating}>
            Add
          </Button>
        </div>
      )}
      <ScrollArea className="h-96">
        {task.checklist?.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 border rounded-md p-2 mb-2"
          >
            <input
              type="checkbox"
              checked={item.isCompleted}
              onChange={() =>
                updateItem(idx, { isCompleted: !item.isCompleted })
              }
              disabled={!isOperator}
            />
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(idx, { title: e.target.value })}
              className="flex-1 bg-transparent border-none focus:outline-none"
              disabled={!isOperator}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
