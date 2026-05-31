// src/components/site/CreateVoiceNoteDialog.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, Upload } from "lucide-react";
import { toast } from "sonner";
import { projectApi } from "@/api";

// ── Fixes broken WebM duration metadata (Chrome MediaRecorder bug) ──────────
// Chrome writes duration=Infinity in the WebM header. Seeking to a huge time
// forces the browser to scan the file and rewrite the real duration.
function fixBlobDuration(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = url;
    audio.onloadedmetadata = () => {
      if (audio.duration === Infinity || isNaN(audio.duration)) {
        audio.currentTime = 1e101; // seek past end → triggers scan
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          audio.currentTime = 0;
          resolve({ url, duration: Math.round(audio.duration) });
        };
      } else {
        resolve({ url, duration: Math.round(audio.duration) });
      }
    };
    audio.onerror = () => resolve({ url, duration: 0 }); // fallback
  });
}

export function CreateVoiceNoteDialog({ open, onOpenChange, onSubmit }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: "",
    audioUrl: "",
    duration: 0,
    transcript: "",
    notes: "",
  });
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds shown while recording
  const [loading, setLoading] = useState(false);

  // ── refs (never stale inside callbacks) ──────────────────────────────────
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null); // ← FIX 1: store stream so we can stop it immediately
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      projectApi
        .getAll()
        .then((res) => setProjects(res.data?.data?.projects || []))
        .catch(console.error);
    }
  }, [open]);

  // Clear timer on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // ← store for stopRecording

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data?.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const chunks = audioChunksRef.current;
        if (!chunks.length) {
          toast.error("No audio captured — try again");
          return;
        }

        const blob = new Blob(chunks, { type: mimeType });
        const rawUrl = URL.createObjectURL(blob);

        // ── FIX 2: patch WebM duration header so player shows real length ──
        const { url, duration } = await fixBlobDuration(rawUrl);
        setForm((prev) => ({ ...prev, audioUrl: url, duration }));
        toast.success("Recording saved");
      };

      recorder.start(250); // flush chunks every 250 ms
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setElapsed(0);

      // elapsed timer
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);

    // ── FIX 1: stop mic tracks HERE, immediately, not inside onstop ──────
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop(); // still fires onstop → builds blob
    }
    mediaRecorderRef.current = null;
    setRecording(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, audioUrl: url }));
  };

  const handleSubmit = async () => {
    if (!form.projectId) return toast.error("Project is required");
    if (!form.audioUrl)                                                                        
      return toast.error("Please record or upload an audio file");
    setLoading(true);
    try {                
      await onSubmit?.(form);             
      toast.success("Voice note created");
      onOpenChange(false);
      setForm({                                    
        projectId: "",
        audioUrl: "",
        duration: 0,
        transcript: "",
        notes: "",
      });
    } catch {
      toast.error("Failed to save voice note");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Voice Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Project */}
          <div className="space-y-1">
            <Label>Project *</Label>
            <Select
              value={form.projectId}         
              onValueChange={(v) => setForm({ ...form, projectId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>                 
                {projects.map((p) => (     
                  <SelectItem key={p._id} value={p._id}>     
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>                                           x  
            </Select>
          </div>

          {/* Audio */}
          <div className="space-y-1">
            <Label>Audio</Label>
            <div className="flex gap-2 items-center">
              {!recording ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={startRecording}
                >
                  <Mic className="h-4 w-4 mr-2" /> Record
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={stopRecording}
                >
                  <Square className="h-4 w-4 mr-2" /> Stop
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
              <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* live timer shown while recording */}
              {recording && (
                <span className="ml-1 text-sm font-mono text-red-500 flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  {fmt(elapsed)}
                </span>
              )}
            </div>

            {form.audioUrl && (
              <audio controls className="mt-2 w-full" src={form.audioUrl} />
            )}
          </div>

          {/* Transcript */}
          <div className="space-y-1">
            <Label>Transcript (auto-generated optional)</Label>
            <Textarea
              rows={2}
              value={form.transcript}
              onChange={(e) => setForm({ ...form, transcript: e.target.value })}
              placeholder="Auto-generated transcript will appear here"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label>Notes</Label>                          
            <Input              
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}  
              placeholder="Additional notes"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Save Voice Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
