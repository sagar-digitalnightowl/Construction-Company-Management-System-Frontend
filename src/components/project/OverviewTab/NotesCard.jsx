// src/components/project/OverviewTab/NotesCard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, Pencil, Trash2 } from "lucide-react";
import { projectApi } from "@/api/projectApi";
import { toast } from "sonner";

export function NotesCard({ projectId, canEdit }) {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", type: "general" });

  const fetchNotes = async () => {
    try {
      const res = await projectApi.getNotes(projectId);
      setNotes(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and content required");
      return;
    }
    try {
      if (editingNote) {
        await projectApi.updateNote(projectId, editingNote._id, form);
        toast.success("Note updated");
      } else {
        await projectApi.addNote(projectId, form);
        toast.success("Note added");
      }
      setOpen(false);
      fetchNotes();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save note");
    }
  };

  const handleDelete = async (noteId) => {
    if (confirm("Delete this note?")) {
      await projectApi.deleteNote(projectId, noteId);
      toast.success("Note deleted");
      fetchNotes();
    }
  };

  const resetForm = () => {
    setForm({ title: "", content: "", type: "general" });
    setEditingNote(null);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content, type: note.type });
    setOpen(true);
  };

  const typeColors = {
    general: "secondary",
    important: "default",
    urgent: "destructive",
    confidential: "outline",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" /> Notes
          </span>
          {canEdit && (
            <Dialog
              open={open}
              onOpenChange={(val) => {
                if (!val) resetForm();
                setOpen(val);
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 px-2">
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingNote ? "Edit Note" : "New Note"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm({ ...form, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="confidential">
                          Confidential
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      rows={4}
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleSubmit}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-auto">
        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground">No notes yet</p>
        )}
        {notes.map((note) => (
          <div key={note._id} className="border rounded-md p-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{note.title}</p>
                <Badge variant={typeColors[note.type]} className="text-xs mt-1">
                  {note.type}
                </Badge>
              </div>
              {canEdit && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => openEdit(note)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={() => handleDelete(note._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {note.content}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
