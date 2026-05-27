// src/pages/site/VoiceNotes.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Trash2, Check } from "lucide-react";
import { useSite } from "@/hooks/useSite";
import { CreateVoiceNoteDialog } from "@/components/site/CreateVoiceNoteDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";

export function VoiceNotes({ canEdit }) {
  const {
    voiceNotes,
    fetchVoiceNotes,
    markVoiceNoteAsRead,
    deleteVoiceNote,
    createVoiceNote,
    loading,
  } = useSite();

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchVoiceNotes();
  }, [fetchVoiceNotes]);

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {voiceNotes.length} note(s)
        </p>
        {canEdit && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> Record Voice Note
          </Button>
        )}
      </div>
      {voiceNotes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">No voice notes</CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {voiceNotes.map((note) => (
            <Card key={note._id} className={note.isRead ? "opacity-70" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {note.projectId?.name || "Project"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(note.createdAt)}
                    </p>
                    {note.transcript && (
                      <p className="text-sm mt-1">{note.transcript}</p>
                    )}
                    <audio controls className="mt-2 h-8 w-full max-w-xs">
                      <source src={note.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="flex gap-2">
                    {!note.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markVoiceNoteAsRead(note._id)}
                      >
                        <Check className="h-3 w-3 mr-1" /> Mark Read
                      </Button>
                    )}
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteVoiceNote(note._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <CreateVoiceNoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={createVoiceNote}
      />
    </div>
  );
}
