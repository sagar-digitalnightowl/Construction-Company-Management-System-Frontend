// Shared pieces for the Site Engineer panel
import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteEngineerApi } from "@/api/siteEngineerApi";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const MONTHS = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

export const todayISO = () => {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const errMsg = (err, fallback) => err?.response?.data?.message || fallback;

// Responses are { success, data } or unwrapped. A null data payload must stay null,
// otherwise the whole response body would be read as the result.
export const unwrap = (res) => {
	const body = res?.data;
	if (body && typeof body === "object" && "data" in body) return body.data;
	return body ?? null;
};

// Pulls a list out of a response, whatever key it sits under
export const listFrom = (res, key) => {
	const body = unwrap(res);
	if (Array.isArray(body)) return body;
	return body?.[key] ?? [];
};

export function useAssignedProjects() {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		siteEngineerApi
			.listProjects({ limit: 100 })
			.then((res) => {
				if (!cancelled) setProjects(listFrom(res, "projects"));
			})
			.catch(() => {
				if (!cancelled) setProjects([]);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	return { projects, loading };
}

export const projectName = (p) => p?.name || p?.projectName || "Project";

export function ProjectSelect({ value, onChange, projects, allowAll = false, className = "w-full sm:w-64" }) {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select project" />
			</SelectTrigger>
			<SelectContent>
				{allowAll && <SelectItem value="all">All projects</SelectItem>}
				{projects.map((p) => (
					<SelectItem key={p._id} value={p._id}>
						{projectName(p)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export function Pager({ page, pages, onChange }) {
	if (!pages || pages <= 1) return null;
	return (
		<div className="flex items-center justify-end gap-2 pt-4">
			<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
				Previous
			</Button>
			<span className="text-sm text-muted-foreground">
				Page {page} of {pages}
			</span>
			<Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
				Next
			</Button>
		</div>
	);
}

export function ConfirmDelete({ open, onOpenChange, title, description, busy, onConfirm }) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={busy}
						onClick={(e) => {
							e.preventDefault();
							onConfirm();
						}}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{busy ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

// Repeatable rows, e.g. work done items or safety checklist items
export function RowsEditor({ rows, onChange, columns, addLabel = "Add row", emptyRow }) {
	const update = (index, key, value) =>
		onChange(rows.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
	const remove = (index) => onChange(rows.filter((_, i) => i !== index));

	return (
		<div className="space-y-3">
			{rows.map((row, index) => (
				<div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end rounded-md border p-3">
					{columns.map((col) => (
						<div key={col.key} className={col.span || "sm:col-span-3"}>
							<Label className="text-xs text-muted-foreground">{col.label}</Label>
							{col.options ? (
								<Select value={row[col.key] ?? ""} onValueChange={(v) => update(index, col.key, v)}>
									<SelectTrigger>
										<SelectValue placeholder={col.placeholder || "Select"} />
									</SelectTrigger>
									<SelectContent>
										{col.options.map((o) => (
											<SelectItem key={o.value} value={o.value}>
												{o.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<Input
									type={col.type || "text"}
									value={row[col.key] ?? ""}
									placeholder={col.placeholder}
									onChange={(e) => update(index, col.key, e.target.value)}
								/>
							)}
						</div>
					))}
					<div className="sm:col-span-12 flex justify-end">
						<Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
							<Trash2 className="h-4 w-4 mr-1" /> Remove
						</Button>
					</div>
				</div>
			))}
			<Button type="button" variant="outline" size="sm" onClick={() => onChange([...rows, { ...emptyRow }])}>
				<Plus className="h-4 w-4 mr-1" /> {addLabel}
			</Button>
		</div>
	);
}

export function StatusPill({ tone = "neutral", children }) {
	const tones = {
		neutral: "bg-muted text-muted-foreground",
		good: "bg-success/15 text-success",
		warn: "bg-warning/15 text-warning",
		bad: "bg-destructive/15 text-destructive",
	};
	return (
		<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
			{children}
		</span>
	);
}

// Turns a textarea of one URL per line into an array
export const linesToList = (text) =>
	String(text || "")
		.split("\n")
		.map((s) => s.trim())
		.filter(Boolean);

export const listToLines = (list) => (Array.isArray(list) ? list.join("\n") : "");


// ---- Read-only detail views ----

// Label and value pair; shows a dash when there is no value
export function Field({ label, children }) {
	return (
		<div>
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className="text-sm break-words">{children || children === 0 ? children : "—"}</div>
		</div>
	);
}

// Bulleted list with a heading; shows the empty text when there are no items
export function ListBlock({ label, items, empty = "None recorded" }) {
	return (
		<div className="space-y-1.5">
			<div className="text-xs text-muted-foreground">{label}</div>
			{items.length === 0 ? (
				<div className="text-sm">{empty}</div>
			) : (
				<ul className="list-disc pl-5 space-y-1 text-sm">
					{items.map((item, i) => (
						<li key={i}>{item}</li>
					))}
				</ul>
			)}
		</div>
	);
}

// Photo links from a list of URLs
export const photoLinks = (urls) =>
	(urls || []).map((url, i) => (
		<a key={i} href={url} target="_blank" rel="noreferrer" className="text-primary underline">
			Photo {i + 1}
		</a>
	));

// Picks the record out of a response body, whatever key it sits under
export const pick = (body, ...keys) => {
	for (const k of keys) {
		if (body?.[k] != null) return body[k];
	}
	return body;
};

// Loads one record when id is set and shows it in a dialog
export function RecordDetailDialog({ id, onClose, title, load, render }) {
	const [state, setState] = useState({ data: null, loading: false, error: "" });

	useEffect(() => {
		if (!id) return;
		let cancelled = false;
		setState({ data: null, loading: true, error: "" });
		load(id)
			.then((data) => !cancelled && setState({ data, loading: false, error: "" }))
			.catch((err) => !cancelled && setState({ data: null, loading: false, error: errMsg(err, "Could not load this record") }));
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return (
		<Dialog open={!!id} onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>Read-only details</DialogDescription>
				</DialogHeader>
				{state.loading && <div className="text-sm text-muted-foreground">Loading...</div>}
				{state.error && <div className="text-sm text-destructive">{state.error}</div>}
				{state.data && render(state.data)}
			</DialogContent>
		</Dialog>
	);
}

// Active check-in: the API returns null, one object, or a list
export const listActive = (res) => {
	const body = unwrap(res);
	if (Array.isArray(body)) return body;
	return body ? [body] : [];
};

// Hours between two timestamps, rounded to one decimal; null when either is missing
export const hoursBetween = (start, end) => {
	if (!start || !end) return null;
	const h = (new Date(end) - new Date(start)) / 3600000;
	return h > 0 ? Math.round(h * 10) / 10 : null;
};

export const numOrUndef = (v) => (v === "" || v == null ? undefined : Number(v));

// Device position for GPS capture; resolves to null when location is not available
export const getPositionOrNull = () =>
	new Promise((resolve) => {
		if (!navigator.geolocation) return resolve(null);
		navigator.geolocation.getCurrentPosition(
			(pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
			() => resolve(null),
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	});
