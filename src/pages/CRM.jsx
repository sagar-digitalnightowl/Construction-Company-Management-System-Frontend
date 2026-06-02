import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuthStore, useUsersStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR } from "@/lib/helpers";

// Integrated API custom hook
import { useLead } from "@/hooks/useLead";
import { projectApi } from "@/api";
import LeadDetailsModal from "@/components/lead/LeadDetailsModal";

// Updated mapping to support backend pipeline status definitions
const STAGES = [
	{ id: "new", label: "New", tint: "var(--color-chart-4)" },
	{ id: "contacted", label: "Contacted", tint: "var(--color-chart-2)" },
	{ id: "interested", label: "Interested", tint: "var(--color-chart-5)" },
	{ id: "negotiation", label: "Negotiation", tint: "var(--color-chart-1)" },
	{ id: "converted", label: "Converted / Won", tint: "var(--color-success)" },
];

export default function CRM() {
	// Replaced localized data stores with live API hook properties
	const { leads, loading, fetchLeads, createLead, updateLead, getLeadById, deleteLead } = useLead();

	const users = useUsersStore((s) => s.users);
	const { current } = useAuthStore();
	const canEdit = canMutate(current.role, "crm");
	const [projects, setProjects] = useState([]);
	const [selectedLead, setSelectedLead] = useState(null);
	const [detailsOpen, setDetailsOpen] = useState(false);

	const empty = {
		clientName: "",
		clientContact: "", // Fallback representation map
		clientPhone: "",
		clientEmail: "",
		value: 0,
		status: "new",
		source: "direct",
		notes: "",
		interestedProject: "",
		interestedUnit: ""
	};

	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [form, setForm] = useState(empty);
	const [confirmId, setConfirmId] = useState(null);

	// Fetch master lead data array on mount
	useEffect(() => {
		fetchLeads({});
	}, [fetchLeads]);

	// Fetch supporting project list references when modal forms open
	useEffect(() => {
		if (open) {
			projectApi
				.getAll()
				.then((res) => setProjects(res.data?.data?.projects || []))
				.catch(console.error);
		}
	}, [open]);

	const handleViewLead = async (leadId) => {
		const lead = await getLeadById(leadId);

		if (!lead) return;

		setSelectedLead(lead);
		setDetailsOpen(true);
	};

	const handleDeleteLead = async () => {
		if (!confirmId) return;

		const success = await deleteLead(confirmId);

		if (success) {
			setConfirmId(null);
		}
	};

	const startCreate = () => {
		setEditing(null);
		setForm(empty);
		setOpen(true);
	};

	const startEdit = (l) => {
		setEditing(l);
		setForm({
			clientName: l.clientName || "",
			clientPhone: l.clientPhone || "",
			clientEmail: l.clientEmail || "",
			value: l.value || 0,
			status: l.status || "new",
			source: l.source || "direct",
			notes: l.notes || "",
			interestedProject: l.interestedProject?._id || l.interestedProject || "",
			interestedUnit: l.interestedUnit || ""
		});
		setOpen(true);
	};

	const handleChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const save = async () => {
		if (!form.clientName.trim()) {
			toast.error("Lead name required");
			return;
		}

		if (editing) {
			const payload = {
				status: form.status,
				notes: form.notes,
			};

			const res = await updateLead(editing._id, payload);

			if (res) {
				setOpen(false);
				setEditing(null);
				setForm(empty);
			}

			return;
		}

		const payload = {
			clientName: form.clientName,
			clientPhone: form.clientPhone || undefined,
			clientEmail: form.clientEmail || undefined,
			source: form.source,
			interestedProject: form.interestedProject || undefined,
			interestedUnit: form.interestedUnit || undefined,
			notes: form.notes || undefined,
		};

		const res = await createLead(payload);

		if (res) {
			setOpen(false);
			setForm(empty);
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Business"
				title="CRM & Client Pipeline"
				description="Track every opportunity from qualification to handshake."
				actions={canEdit && <Button onClick={startCreate}><Plus className="h-4 w-4" /> New lead</Button>}
			/>

			{loading ? (
				<div className="flex items-center justify-center h-64 text-sm text-muted-foreground animate-pulse bg-card rounded-xl border border-border">
					Syncing live CRM pipeline records...
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4">
					{STAGES.map((s) => {
						// Filters fields matching the server response object key pattern (.status)
						const stageLeads = leads.filter(l => l.status === s.id);
						const total = stageLeads.reduce((a, l) => a + (Number(l.value) || 0), 0);

						return (
							<div key={s.id} className="rounded-xl border border-border bg-card p-4 space-y-3 flex flex-col h-[75vh]">
								<div className="flex items-center justify-between shrink-0">
									<div className="flex items-center gap-2">
										<span className="h-2 w-2 rounded-full" style={{ background: s.tint }} />
										<div className="font-medium text-sm">{s.label}</div>
									</div>
									<span className="text-xs text-muted-foreground font-semibold bg-secondary/80 px-1.5 py-0.5 rounded">
										{stageLeads.length}
									</span>
								</div>
								{/* <div className="shrink-0">
									<div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pipeline Value</div>
									<div className="font-display text-lg font-bold truncate">{formatINR(total)}</div>
								</div> */}

								{/* Scroll-contained board list columns */}
								<div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar pt-1">
									{stageLeads.map(l => {
										return (
											<Card key={l._id} onClick={() => handleViewLead(l._id)} className="p-3 hover:shadow-md transition-all group border-border/60 cursor-pointer">
												<div className="flex items-start justify-between gap-2">
													<div className="min-w-0">
														<div className="text-xs sm:text-sm font-semibold truncate text-foreground">{l.clientName}</div>
														<div className="text-[10.5px] text-muted-foreground truncate">{l.clientPhone}</div>
													</div>
													{l.value > 0 && (
														<Badge variant="secondary" className="shrink-0 text-[10px] font-medium px-1.5 py-0">
															{formatINR(l.value)}
														</Badge>
													)}
												</div>
												{l.notes && (
													<div className="text-[11px] text-muted-foreground mt-2 line-clamp-2 bg-secondary/30 p-1.5 rounded border border-border/20">
														{l.notes}
													</div>
												)}
												<div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/40">
													<div className="text-[10px] text-muted-foreground font-medium truncate">
														Proj: {l.interestedProject?.name || "Unassigned"}
													</div>
													{canEdit && (
														<div className="flex gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
															<Button
																size="icon"
																variant="ghost"
																className="h-6 w-6"
																onClick={(e) => {
																	e.stopPropagation();
																	startEdit(l);
																}}
															>
																<Pencil className="h-3 w-3" />
															</Button>

															<Button
																size="icon"
																variant="ghost"
																className="h-6 w-6 text-destructive"
																onClick={(e) => {
																	e.stopPropagation();
																	setConfirmId(l._id);
																}}
															>
																<Trash2 className="h-3 w-3" />
															</Button>
														</div>
													)}
												</div>
											</Card>
										);
									})}
									{stageLeads.length === 0 && (
										<div className="text-center py-6 text-[11px] text-muted-foreground/60 italic border border-dashed rounded-lg">
											No leads here
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Creation & Modification Input Overlay */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col p-4 sm:p-6 rounded-lg">
					<DialogHeader>
						<DialogTitle>{editing ? "Edit Lead Dossier" : "Initialize New Lead"}</DialogTitle>
					</DialogHeader>

					<div className="flex-1 overflow-y-auto py-1 px-1 space-y-4 text-xs sm:text-sm">

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label>Lead / Client Name *</Label>
								<Input value={form.clientName} onChange={e => handleChange("clientName", e.target.value)} />
							</div>
							<div className="space-y-1.5">
								<Label>Phone Number</Label>
								<Input value={form.clientPhone} onChange={e => handleChange("clientPhone", e.target.value)} />
							</div>
						</div>
						<div className="space-y-1.5">
							<Label>Email Address</Label>
							<Input type="email" value={form.clientEmail} onChange={e => handleChange("clientEmail", e.target.value)} />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label>Estimated Value (₹)</Label>
								<Input type="number" value={form.value} onChange={e => handleChange("value", e.target.value)} />
							</div>
							<div className="space-y-1.5">
								<Label>Pipeline Status</Label>
								<Select value={form.status} onValueChange={v => handleChange("status", v)}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent>
										{STAGES.map(s => (<SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label>Lead Source</Label>
								<Select value={form.source} onValueChange={v => handleChange("source", v)}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent>
										<SelectItem value="direct">Direct</SelectItem>
										<SelectItem value="employee">Employee</SelectItem>
										<SelectItem value="referral">Referral</SelectItem>
										<SelectItem value="website">Website</SelectItem>
										<SelectItem value="social_media">Social Media</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1.5">
								<Label>Interested Unit</Label>
								<Input placeholder="e.g. 101" value={form.interestedUnit} onChange={e => handleChange("interestedUnit", e.target.value)} />
							</div>
						</div>
						<div className="space-y-1.5">
							<Label>Target Project Opportunity</Label>
							<Select value={form.interestedProject} onValueChange={v => handleChange("interestedProject", v)}>
								<SelectTrigger><SelectValue placeholder="Select target project" /></SelectTrigger>
								<SelectContent>
									{projects.map(p => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1.5">
							<Label>Timeline Notes</Label>
							<Textarea rows={2} value={form.notes} onChange={e => handleChange("notes", e.target.value)} />
						</div>
					</div>

					<DialogFooter className="border-t pt-3 gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
						<Button onClick={save}>{editing ? "Save Changes" : "Create Lead"}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<LeadDetailsModal
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
				lead={selectedLead}
			/>

			<ConfirmDialog
				open={!!confirmId}
				onOpenChange={(v) => !v && setConfirmId(null)}
				title="Delete Lead?"
				description="This will soft delete the lead and remove it from all lead lists."
				confirmText="Delete"
				onConfirm={handleDeleteLead}
			/>
		</div>
	);
}
