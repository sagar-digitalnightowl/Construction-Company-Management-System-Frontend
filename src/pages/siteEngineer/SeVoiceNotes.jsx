import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { submitOrQueue } from "@/lib/offlineQueue";
import { formatDateTime } from "@/lib/helpers";
import { ConfirmDelete, ProjectSelect, errMsg, listFrom, numOrUndef, useAssignedProjects } from "./shared";

export default function SeVoiceNotes() {
	const { projects } = useAssignedProjects();
	const [projectId, setProjectId] = useState("");
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({ audioUrl: "", duration: "", transcript: "" });
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(null);
	const [deleteBusy, setDeleteBusy] = useState(false);

	useEffect(() => {
		if (!projectId && projects.length) setProjectId(projects[0]._id);
	}, [projects, projectId]);

	const load = () => {
		if (!projectId) return;
		setLoading(true);
		siteEngineerApi
			.listVoiceNotes({ projectId })
			.then((res) => setNotes(listFrom(res, "notes")))
			.catch((err) => toast.error(errMsg(err, "Could not load voice notes")))
			.finally(() => setLoading(false));
	};

	useEffect(load, [projectId]);

	const handleAdd = async (e) => {
		e.preventDefault();
		if (!projectId) return toast.error("Select a project");
		if (!form.audioUrl.trim()) return toast.error("Add the audio link");
		setSaving(true);
		try {
			await submitOrQueue({ recordType: "voice_note", endpoint: "/site/voice-note", data: {
				projectId,
				audioUrl: form.audioUrl.trim(),
				duration: numOrUndef(form.duration),
				transcript: form.transcript,
			}, send: (payload) => siteEngineerApi.createVoiceNote(payload) });
			toast.success("Voice note sent");
			setForm({ audioUrl: "", duration: "", transcript: "" });
			load();
		} catch (err) {
			toast.error(errMsg(err, "Could not send the voice note"));
		} finally {
			setSaving(false);
		}
	};

	const handleMarkRead = async (n) => {
		try {
			await siteEngineerApi.markVoiceNoteRead(n._id);
			toast.success("Marked as read");
			load();
		} catch (err) {
			toast.error(errMsg(err, "Could not mark the note as read"));
		}
	};

	const handleDelete = async () => {
		setDeleteBusy(true);
		try {
			await siteEngineerApi.deleteVoiceNote(deleting._id);
			toast.success("Voice note deleted");
			setDeleting(null);
			load();
		} catch (err) {
			toast.error(errMsg(err, "Could not delete the voice note"));
		} finally {
			setDeleteBusy(false);
		}
	};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader title="Voice Notes" description="Send a short spoken update from site, with a transcript." />

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Send a voice note</CardTitle>
				</CardHeader>
				<CardContent className="pt-4">
					<form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<Label>Project</Label>
							<ProjectSelect value={projectId} onChange={setProjectId} projects={projects} className="w-full" />
						</div>
						<div>
							<Label>Audio link</Label>
							<Input value={form.audioUrl} placeholder="https://..." onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} />
						</div>
						<div>
							<Label>Duration (seconds)</Label>
							<Input type="number" min="0" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
						</div>
						<div className="sm:col-span-2">
							<Label>Transcript</Label>
							<Textarea rows={3} value={form.transcript} onChange={(e) => setForm({ ...form, transcript: e.target.value })} />
						</div>
						<div className="sm:col-span-2 flex justify-end">
							<Button type="submit" disabled={saving || !projectId}>
								{saving ? "Sending..." : "Send voice note"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Sent notes</CardTitle>
				</CardHeader>
				<CardContent className="pt-4 space-y-3">
					{loading && <div className="text-sm text-muted-foreground">Loading...</div>}
					{!loading && notes.length === 0 && <div className="text-sm text-muted-foreground">No voice notes for this project</div>}
					{notes.map((n) => (
						<div key={n._id} className="flex items-start justify-between gap-3 rounded-md border p-3">
							<div className="min-w-0 space-y-1">
								<div className="text-xs text-muted-foreground">
									{formatDateTime(n.createdAt)} · {n.duration ?? 0}s
								</div>
								<div className="text-sm">{n.transcript || "No transcript"}</div>
								{n.audioUrl && (
									<a href={n.audioUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
										Open audio
									</a>
								)}
							</div>
							<Button variant="ghost" size="sm" title="Mark as read" aria-label="Mark as read" onClick={() => handleMarkRead(n)}>
								<CheckCheck className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="sm" onClick={() => setDeleting(n)}>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</CardContent>
			</Card>

			<ConfirmDelete
				open={!!deleting}
				onOpenChange={(o) => !o && setDeleting(null)}
				title="Delete this voice note?"
				description="The voice note will be removed. This cannot be undone."
				busy={deleteBusy}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
