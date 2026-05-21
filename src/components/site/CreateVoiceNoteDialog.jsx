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
import { projectApi } from "@/api/projectApi";

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
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      projectApi
        .getAll()
        .then((res) => setProjects(res.data?.data?.projects || []))
        .catch(console.error);
    }
  }, [open]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setAudioChunks([]);
      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        // In real app, upload to server and get URL
        // For demo, we create a local URL
        const url = URL.createObjectURL(audioBlob);
        setForm((prev) => ({ ...prev, audioUrl: url, duration: 0 }));
        toast.success("Recording saved");
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setMediaRecorder(null);
      setRecording(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, audioUrl: url }));
    }
  };

  const handleSubmit = async () => {
    if (!form.projectId) return toast.error("Project is required");
    if (!form.audioUrl)
      return toast.error("Please record or upload an audio file");
    setLoading(true);
    // In real implementation, you would upload the file to S3 via presigned URL
    // For now, we simulate success
    toast.success("Voice note created (demo – upload to server required)");
    setLoading(false);
    onOpenChange(false);
    setForm({
      projectId: "",
      audioUrl: "",
      duration: 0,
      transcript: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Voice Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
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
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Audio</Label>
            <div className="flex gap-2">
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
                onClick={() => fileInputRef.current.click()}
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
            </div>
            {form.audioUrl && (
              <audio controls className="mt-2 w-full">
                <source src={form.audioUrl} type="audio/mpeg" />
              </audio>
            )}
          </div>
          <div className="space-y-1">
            <Label>Transcript (auto-generated optional)</Label>
            <Textarea
              rows={2}
              value={form.transcript}
              onChange={(e) => setForm({ ...form, transcript: e.target.value })}
              placeholder="Auto-generated transcript will appear here"
            />
          </div>
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
