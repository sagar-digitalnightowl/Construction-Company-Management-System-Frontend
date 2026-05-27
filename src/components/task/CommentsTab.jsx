import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { taskApi } from "@/api";
import { toast } from "sonner";
import { formatDate } from "@/lib/helpers";

export function CommentsTab({ comments, isOperator, taskId, onCommentAdded }) {
  const [newComment, setNewComment] = useState("");
  const [updating, setUpdating] = useState(false);

  const addComment = async () => {
    if (!newComment.trim()) return;
    setUpdating(true);
    try {
      await taskApi.addComment(taskId, newComment);
      setNewComment("");
      onCommentAdded();
      toast.success("Comment added");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {isOperator && (
        <div className="flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
          />
          <Button onClick={addComment} disabled={updating}>
            <Send className="h-3 w-3 mr-1" /> Post
          </Button>
        </div>
      )}
      <ScrollArea className="h-96">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground">No comments yet</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="border rounded-md p-3 mb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {c.userId?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{c.userId?.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(c.createdAt)}
                </span>
              </div>
              <p className="text-sm mt-1">{c.text}</p>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
