// import React, { useState, useEffect } from "react";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import { toast } from "sonner";
// import { PageHeader } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ConfirmDialog } from "@/components/common/ConfirmDialog";
// import { useAuthStore, useUsersStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { formatINR } from "@/lib/helpers";

// // Integrated API custom hook
// import { useLead } from "@/hooks/useLead";
// import { projectApi } from "@/api";
// import LeadDetailsModal from "@/components/lead/LeadDetailsModal";

// // Updated mapping to support backend pipeline status definitions
// const STAGES = [
// 	{ id: "new", label: "New", tint: "var(--color-chart-4)" },
// 	{ id: "contacted", label: "Contacted", tint: "var(--color-chart-2)" },
// 	{ id: "interested", label: "Interested", tint: "var(--color-chart-5)" },
// 	{ id: "negotiation", label: "Negotiation", tint: "var(--color-chart-1)" },
// 	{ id: "converted", label: "Converted / Won", tint: "var(--color-success)" },
// ];

// export default function CRM() {
// 	// Replaced localized data stores with live API hook properties
// 	const { leads, loading, fetchLeads, createLead, updateLead, getLeadById, deleteLead } = useLead();

// 	const users = useUsersStore((s) => s.users);
// 	const { current } = useAuthStore();
// 	const canEdit = canMutate(current.role, "crm");
// 	const [projects, setProjects] = useState([]);
// 	const [selectedLead, setSelectedLead] = useState(null);
// 	const [detailsOpen, setDetailsOpen] = useState(false);

// 	const empty = {
// 		clientName: "",
// 		clientContact: "", // Fallback representation map
// 		clientPhone: "",
// 		clientEmail: "",
// 		value: 0,
// 		status: "new",
// 		source: "direct",
// 		notes: "",
// 		interestedProject: "",
// 		interestedUnit: ""
// 	};

// 	const [open, setOpen] = useState(false);
// 	const [editing, setEditing] = useState(null);
// 	const [form, setForm] = useState(empty);
// 	const [confirmId, setConfirmId] = useState(null);

// 	// Fetch master lead data array on mount
// 	useEffect(() => {
// 		fetchLeads({});
// 	}, [fetchLeads]);

// 	// Fetch supporting project list references when modal forms open
// 	useEffect(() => {
// 		if (open) {
// 			projectApi
// 				.getAll()
// 				.then((res) => setProjects(res.data?.data?.projects || []))
// 				.catch(console.error);
// 		}
// 	}, [open]);

// 	const handleViewLead = async (leadId) => {
// 		const lead = await getLeadById(leadId);

// 		if (!lead) return;

// 		setSelectedLead(lead);
// 		setDetailsOpen(true);
// 	};

// 	const handleDeleteLead = async () => {
// 		if (!confirmId) return;

// 		const success = await deleteLead(confirmId);

// 		if (success) {
// 			setConfirmId(null);
// 		}
// 	};

// 	const startCreate = () => {
// 		setEditing(null);
// 		setForm(empty);
// 		setOpen(true);
// 	};

// 	const startEdit = (l) => {
// 		setEditing(l);
// 		setForm({
// 			clientName: l.clientName || "",
// 			clientPhone: l.clientPhone || "",
// 			clientEmail: l.clientEmail || "",
// 			value: l.value || 0,
// 			status: l.status || "new",
// 			source: l.source || "direct",
// 			notes: l.notes || "",
// 			interestedProject: l.interestedProject?._id || l.interestedProject || "",
// 			interestedUnit: l.interestedUnit || ""
// 		});
// 		setOpen(true);
// 	};

// 	const handleChange = (field, value) => {
// 		setForm((prev) => ({
// 			...prev,
// 			[field]: value,
// 		}));
// 	};

// 	const save = async () => {
// 		if (!form.clientName.trim()) {
// 			toast.error("Lead name required");
// 			return;
// 		}

// 		if (editing) {
// 			const payload = {
// 				status: form.status,
// 				notes: form.notes,
// 			};

// 			const res = await updateLead(editing._id, payload);

// 			if (res) {
// 				setOpen(false);
// 				setEditing(null);
// 				setForm(empty);
// 			}

// 			return;
// 		}

// 		const payload = {
// 			clientName: form.clientName,
// 			clientPhone: form.clientPhone || undefined,
// 			clientEmail: form.clientEmail || undefined,
// 			source: form.source,
// 			interestedProject: form.interestedProject || undefined,
// 			interestedUnit: form.interestedUnit || undefined,
// 			notes: form.notes || undefined,
// 		};

// 		const res = await createLead(payload);

// 		if (res) {
// 			setOpen(false);
// 			setForm(empty);
// 		}
// 	};

// 	return (
// 		<div className="space-y-6">
// 			<PageHeader
// 				eyebrow="Business"
// 				title="CRM & Client Pipeline"
// 				description="Track every opportunity from qualification to handshake."
// 				actions={canEdit && <Button onClick={startCreate}><Plus className="h-4 w-4" /> New lead</Button>}
// 			/>

// 			{loading ? (
// 				<div className="flex items-center justify-center h-64 text-sm text-muted-foreground animate-pulse bg-card rounded-xl border border-border">
// 					Syncing live CRM pipeline records...
// 				</div>
// 			) : (
// 				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4">
// 					{STAGES.map((s) => {
// 						// Filters fields matching the server response object key pattern (.status)
// 						const stageLeads = leads.filter(l => l.status === s.id);
// 						const total = stageLeads.reduce((a, l) => a + (Number(l.value) || 0), 0);

// 						return (
// 							<div key={s.id} className="rounded-xl border border-border bg-card p-4 space-y-3 flex flex-col h-[75vh]">
// 								<div className="flex items-center justify-between shrink-0">
// 									<div className="flex items-center gap-2">
// 										<span className="h-2 w-2 rounded-full" style={{ background: s.tint }} />
// 										<div className="font-medium text-sm">{s.label}</div>
// 									</div>
// 									<span className="text-xs text-muted-foreground font-semibold bg-secondary/80 px-1.5 py-0.5 rounded">
// 										{stageLeads.length}
// 									</span>
// 								</div>
// 								{/* <div className="shrink-0">
// 									<div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pipeline Value</div>
// 									<div className="font-display text-lg font-bold truncate">{formatINR(total)}</div>
// 								</div> */}

// 								{/* Scroll-contained board list columns */}
// 								<div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar pt-1">
// 									{stageLeads.map(l => {
// 										return (
// 											<Card key={l._id} onClick={() => handleViewLead(l._id)} className="p-3 hover:shadow-md transition-all group border-border/60 cursor-pointer">
// 												<div className="flex items-start justify-between gap-2">
// 													<div className="min-w-0">
// 														<div className="text-xs sm:text-sm font-semibold truncate text-foreground">{l.clientName}</div>
// 														<div className="text-[10.5px] text-muted-foreground truncate">{l.clientPhone}</div>
// 													</div>
// 													{l.value > 0 && (
// 														<Badge variant="secondary" className="shrink-0 text-[10px] font-medium px-1.5 py-0">
// 															{formatINR(l.value)}
// 														</Badge>
// 													)}
// 												</div>
// 												{l.notes && (
// 													<div className="text-[11px] text-muted-foreground mt-2 line-clamp-2 bg-secondary/30 p-1.5 rounded border border-border/20">
// 														{l.notes}
// 													</div>
// 												)}
// 												<div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/40">
// 													<div className="text-[10px] text-muted-foreground font-medium truncate">
// 														Proj: {l.interestedProject?.name || "Unassigned"}
// 													</div>
// 													{canEdit && (
// 														<div className="flex gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
// 															<Button
// 																size="icon"
// 																variant="ghost"
// 																className="h-6 w-6"
// 																onClick={(e) => {
// 																	e.stopPropagation();
// 																	startEdit(l);
// 																}}
// 															>
// 																<Pencil className="h-3 w-3" />
// 															</Button>

// 															<Button
// 																size="icon"
// 																variant="ghost"
// 																className="h-6 w-6 text-destructive"
// 																onClick={(e) => {
// 																	e.stopPropagation();
// 																	setConfirmId(l._id);
// 																}}
// 															>
// 																<Trash2 className="h-3 w-3" />
// 															</Button>
// 														</div>
// 													)}
// 												</div>
// 											</Card>
// 										);
// 									})}
// 									{stageLeads.length === 0 && (
// 										<div className="text-center py-6 text-[11px] text-muted-foreground/60 italic border border-dashed rounded-lg">
// 											No leads here
// 										</div>
// 									)}
// 								</div>
// 							</div>
// 						);
// 					})}
// 				</div>
// 			)}

// 			{/* Creation & Modification Input Overlay */}
// 			<Dialog open={open} onOpenChange={setOpen}>
// 				<DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col p-4 sm:p-6 rounded-lg">
// 					<DialogHeader>
// 						<DialogTitle>{editing ? "Edit Lead Dossier" : "Initialize New Lead"}</DialogTitle>
// 					</DialogHeader>

// 					<div className="flex-1 overflow-y-auto py-1 px-1 space-y-4 text-xs sm:text-sm">

// 						<div className="grid grid-cols-2 gap-3">
// 							<div className="space-y-1.5">
// 								<Label>Lead / Client Name *</Label>
// 								<Input value={form.clientName} onChange={e => handleChange("clientName", e.target.value)} />
// 							</div>
// 							<div className="space-y-1.5">
// 								<Label>Phone Number</Label>
// 								<Input value={form.clientPhone} onChange={e => handleChange("clientPhone", e.target.value)} />
// 							</div>
// 						</div>
// 						<div className="space-y-1.5">
// 							<Label>Email Address</Label>
// 							<Input type="email" value={form.clientEmail} onChange={e => handleChange("clientEmail", e.target.value)} />
// 						</div>
// 						<div className="grid grid-cols-2 gap-3">
// 							<div className="space-y-1.5">
// 								<Label>Estimated Value (₹)</Label>
// 								<Input type="number" value={form.value} onChange={e => handleChange("value", e.target.value)} />
// 							</div>
// 							<div className="space-y-1.5">
// 								<Label>Pipeline Status</Label>
// 								<Select value={form.status} onValueChange={v => handleChange("status", v)}>
// 									<SelectTrigger><SelectValue /></SelectTrigger>
// 									<SelectContent>
// 										{STAGES.map(s => (<SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>))}
// 									</SelectContent>
// 								</Select>
// 							</div>
// 						</div>
// 						<div className="grid grid-cols-2 gap-3">
// 							<div className="space-y-1.5">
// 								<Label>Lead Source</Label>
// 								<Select value={form.source} onValueChange={v => handleChange("source", v)}>
// 									<SelectTrigger><SelectValue /></SelectTrigger>
// 									<SelectContent>
// 										<SelectItem value="direct">Direct</SelectItem>
// 										<SelectItem value="employee">Employee</SelectItem>
// 										<SelectItem value="referral">Referral</SelectItem>
// 										<SelectItem value="website">Website</SelectItem>
// 										<SelectItem value="social_media">Social Media</SelectItem>
// 									</SelectContent>
// 								</Select>
// 							</div>
// 							<div className="space-y-1.5">
// 								<Label>Interested Unit</Label>
// 								<Input placeholder="e.g. 101" value={form.interestedUnit} onChange={e => handleChange("interestedUnit", e.target.value)} />
// 							</div>
// 						</div>
// 						<div className="space-y-1.5">
// 							<Label>Target Project Opportunity</Label>
// 							<Select value={form.interestedProject} onValueChange={v => handleChange("interestedProject", v)}>
// 								<SelectTrigger><SelectValue placeholder="Select target project" /></SelectTrigger>
// 								<SelectContent>
// 									{projects.map(p => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
// 								</SelectContent>
// 							</Select>
// 						</div>
// 						<div className="space-y-1.5">
// 							<Label>Timeline Notes</Label>
// 							<Textarea rows={2} value={form.notes} onChange={e => handleChange("notes", e.target.value)} />
// 						</div>
// 					</div>

// 					<DialogFooter className="border-t pt-3 gap-2">
// 						<Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
// 						<Button onClick={save}>{editing ? "Save Changes" : "Create Lead"}</Button>
// 					</DialogFooter>
// 				</DialogContent>
// 			</Dialog>

// 			<LeadDetailsModal
// 				open={detailsOpen}
// 				onOpenChange={setDetailsOpen}
// 				lead={selectedLead}
// 			/>

// 			<ConfirmDialog
// 				open={!!confirmId}
// 				onOpenChange={(v) => !v && setConfirmId(null)}
// 				title="Delete Lead?"
// 				description="This will soft delete the lead and remove it from all lead lists."
// 				confirmText="Delete"
// 				onConfirm={handleDeleteLead}
// 			/>
// 		</div>
// 	);
// }

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuthStore, useUsersStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { formatINR } from "@/lib/helpers";
import { useLead } from "@/hooks/useLead";
import { projectApi } from "@/api";
import LeadDetailsModal from "@/components/lead/LeadDetailsModal";

const STAGES = [
  { id: "new", label: "New", tint: "var(--color-chart-4)" },
  { id: "contacted", label: "Contacted", tint: "var(--color-chart-2)" },
  { id: "interested", label: "Interested", tint: "var(--color-chart-5)" },
  { id: "negotiation", label: "Negotiation", tint: "var(--color-chart-1)" },
  { id: "converted", label: "Converted / Won", tint: "var(--color-success)" },
];

export default function CRM() {
  const {
    leads,
    loading,
    fetchLeads,
    createLead,
    updateLead,
    getLeadById,
    deleteLead,
  } = useLead();
  const users = useUsersStore((s) => s.users);
  const { current } = useAuthStore();
  const canEdit = canMutate(current.role, "crm");
  const [projects, setProjects] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Extended empty state for full lead creation
  const empty = {
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    source: "direct",
    interestedProject: "",
    interestedUnit: "",
    budgetRange: "",
    notes: "",
    followUpDate: "",
    campaignName: "",
    referralCode: "",
    personalDetails: {
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      maritalStatus: "",
      aadharNumber: "",
      panNumber: "",
      fatherName: "",
      motherName: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      permanentAddress: {
        line1: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      },
    },
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      accountHolderName: "",
      accountType: "Savings",
      branchName: "",
    },
  };

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirmId, setConfirmId] = useState(null);
  const [sections, setSections] = useState({
    personal: true,
    bank: true,
  });

  useEffect(() => {
    fetchLeads({});
  }, [fetchLeads]);

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
    if (success) setConfirmId(null);
  };

  const startCreate = () => {
    setEditing(null);
    setForm(JSON.parse(JSON.stringify(empty))); // deep copy
    setOpen(true);
  };

  const startEdit = (l) => {
    setEditing(l);
    setForm({
      clientName: l.clientName || "",
      clientPhone: l.clientPhone || "",
      clientEmail: l.clientEmail || "",
      source: l.source || "direct",
      interestedProject: l.interestedProject?._id || l.interestedProject || "",
      interestedUnit: l.interestedUnit || "",
      budgetRange: l.budgetRange || "",
      notes: l.notes || "",
      followUpDate: l.followUpDate || "",
      campaignName: l.campaignName || "",
      referralCode: l.referralCode || "",
      personalDetails: l.personalDetails || empty.personalDetails,
      bankDetails: l.bankDetails || empty.bankDetails,
    });
    setOpen(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, subField, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subField]: value,
      },
    }));
  };

  const handleAddressChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        permanentAddress: {
          ...prev.personalDetails.permanentAddress,
          [field]: value,
        },
      },
    }));
  };

  const save = async () => {
    if (!form.clientName.trim()) {
      toast.error("Lead name required");
      return;
    }

    if (editing) {
      // Edit mode: only update status and notes (as per original)
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

    // Create mode: full payload
    const payload = {
      clientName: form.clientName,
      clientPhone: form.clientPhone || undefined,
      clientEmail: form.clientEmail || undefined,
      source: form.source,
      interestedProject: form.interestedProject || undefined,
      interestedUnit: form.interestedUnit || undefined,
      budgetRange: form.budgetRange || undefined,
      notes: form.notes || undefined,
      followUpDate: form.followUpDate || undefined,
      campaignName: form.campaignName || undefined,
      referralCode: form.referralCode || undefined,
      personalDetails: {
        dateOfBirth: form.personalDetails.dateOfBirth || undefined,
        gender: form.personalDetails.gender || undefined,
        bloodGroup: form.personalDetails.bloodGroup || undefined,
        maritalStatus: form.personalDetails.maritalStatus || undefined,
        aadharNumber: form.personalDetails.aadharNumber || undefined,
        panNumber: form.personalDetails.panNumber || undefined,
        fatherName: form.personalDetails.fatherName || undefined,
        motherName: form.personalDetails.motherName || undefined,
        emergencyContactName:
          form.personalDetails.emergencyContactName || undefined,
        emergencyContactPhone:
          form.personalDetails.emergencyContactPhone || undefined,
        emergencyContactRelation:
          form.personalDetails.emergencyContactRelation || undefined,
        permanentAddress: {
          line1: form.personalDetails.permanentAddress.line1 || undefined,
          city: form.personalDetails.permanentAddress.city || undefined,
          state: form.personalDetails.permanentAddress.state || undefined,
          country: form.personalDetails.permanentAddress.country || "India",
          pincode: form.personalDetails.permanentAddress.pincode || undefined,
        },
      },
      bankDetails: {
        bankName: form.bankDetails.bankName || undefined,
        accountNumber: form.bankDetails.accountNumber || undefined,
        ifscCode: form.bankDetails.ifscCode || undefined,
        upiId: form.bankDetails.upiId || undefined,
        accountHolderName: form.bankDetails.accountHolderName || undefined,
        accountType: form.bankDetails.accountType || undefined,
        branchName: form.bankDetails.branchName || undefined,
      },
    };

    const res = await createLead(payload);
    if (res) {
      setOpen(false);
      setForm(empty);
    }
  };

  const toggleSection = (section) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Business"
        title="CRM & Client Pipeline"
        description="Track every opportunity from qualification to handshake."
        actions={
          canEdit && (
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" /> New lead
            </Button>
          )
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64 text-sm text-muted-foreground animate-pulse bg-card rounded-xl border border-border">
          Syncing live CRM pipeline records...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4">
          {STAGES.map((s) => {
            const stageLeads = leads.filter((l) => l.status === s.id);
            const total = stageLeads.reduce(
              (a, l) => a + (Number(l.value) || 0),
              0,
            );
            return (
              <div
                key={s.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3 flex flex-col h-[75vh]"
              >
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: s.tint }}
                    />
                    <div className="font-medium text-sm">{s.label}</div>
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold bg-secondary/80 px-1.5 py-0.5 rounded">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar pt-1">
                  {stageLeads.map((l) => (
                    <Card
                      key={l._id}
                      onClick={() => handleViewLead(l._id)}
                      className="p-3 hover:shadow-md transition-all group border-border/60 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold truncate text-foreground">
                            {l.clientName}
                          </div>
                          <div className="text-[10.5px] text-muted-foreground truncate">
                            {l.clientPhone}
                          </div>
                        </div>
                        {l.value > 0 && (
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-[10px] font-medium px-1.5 py-0"
                          >
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
                  ))}
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

      {/* Creation/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col p-4 sm:p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Lead" : "Create New Lead"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-1 px-1 space-y-4 text-xs sm:text-sm">
            {/* Basic Info */}
            <div className="space-y-3 border rounded-md p-3">
              <h4 className="font-medium text-sm">Basic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Lead / Client Name *</Label>
                  <Input
                    value={form.clientName}
                    onChange={(e) => handleChange("clientName", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input
                    value={form.clientPhone}
                    onChange={(e) =>
                      handleChange("clientPhone", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) =>
                      handleChange("clientEmail", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Lead Source</Label>
                  <Select
                    value={form.source}
                    onValueChange={(v) => handleChange("source", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  <Label>Budget Range</Label>
                  <Input
                    placeholder="e.g., 50-70 Lakhs"
                    value={form.budgetRange}
                    onChange={(e) =>
                      handleChange("budgetRange", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Follow-up Date</Label>
                  <Input
                    type="date"
                    value={form.followUpDate}
                    onChange={(e) =>
                      handleChange("followUpDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Campaign Name</Label>
                  <Input
                    value={form.campaignName}
                    onChange={(e) =>
                      handleChange("campaignName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Referral Code</Label>
                  <Input
                    value={form.referralCode}
                    onChange={(e) =>
                      handleChange("referralCode", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Project Interest */}
            <div className="space-y-3 border rounded-md p-3">
              <h4 className="font-medium text-sm">Project Interest</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Interested Project</Label>
                  <Select
                    value={form.interestedProject}
                    onValueChange={(v) => handleChange("interestedProject", v)}
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
                <div className="space-y-1.5">
                  <Label>Interested Unit</Label>
                  <Input
                    placeholder="e.g., 101"
                    value={form.interestedUnit}
                    onChange={(e) =>
                      handleChange("interestedUnit", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Personal Details (collapsible) */}
            <div className="border rounded-md p-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("personal")}
              >
                <h4 className="font-medium text-sm">Personal Details</h4>
                {sections.personal ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
              {sections.personal && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={form.personalDetails.dateOfBirth}
                        onChange={(e) =>
                          handleNestedChange(
                            "personalDetails",
                            "dateOfBirth",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Gender</Label>
                      <Select
                        value={form.personalDetails.gender}
                        onValueChange={(v) =>
                          handleNestedChange("personalDetails", "gender", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Blood Group</Label>
                      <Select
                        value={form.personalDetails.bloodGroup}
                        onValueChange={(v) =>
                          handleNestedChange("personalDetails", "bloodGroup", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "O+",
                            "O-",
                            "AB+",
                            "AB-",
                          ].map((bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Marital Status</Label>
                      <Select
                        value={form.personalDetails.maritalStatus}
                        onValueChange={(v) =>
                          handleNestedChange(
                            "personalDetails",
                            "maritalStatus",
                            v,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Aadhar Number</Label>
                      <Input
                        value={form.personalDetails.aadharNumber}
                        onChange={(e) =>
                          handleNestedChange(
                            "personalDetails",
                            "aadharNumber",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>PAN Number</Label>
                      <Input
                        value={form.personalDetails.panNumber}
                        onChange={(e) =>
                          handleNestedChange(
                            "personalDetails",
                            "panNumber",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Father's Name</Label>
                      <Input
                        value={form.personalDetails.fatherName}
                        onChange={(e) =>
                          handleNestedChange(
                            "personalDetails",
                            "fatherName",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Mother's Name</Label>
                      <Input
                        value={form.personalDetails.motherName}
                        onChange={(e) =>
                          handleNestedChange(
                            "personalDetails",
                            "motherName",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        placeholder="Name"
                        value={form.personalDetails.emergencyContactName}
                        onChange={(e) =>
                          handleNestedChange(
                            "personalDetails",
                            "emergencyContactName",
                            e.target.value,
                          )
                        }
                      />
                      <Input
                        placeholder="Phone"
                        value={form.personalDetails.emergencyContactPhone}
                        onChange={(e) =>
                          handleNestedChange(
                            "personalDetails",
                            "emergencyContactPhone",
                            e.target.value,
                          )
                        }
                      />
                      <Input
                        placeholder="Relation"
                        value={form.personalDetails.emergencyContactRelation}
                        onChange={(e) =>
                          handleNestedChange(
                            "personalDetails",
                            "emergencyContactRelation",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Permanent Address</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        placeholder="Line 1"
                        value={form.personalDetails.permanentAddress.line1}
                        onChange={(e) =>
                          handleAddressChange("line1", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="City"
                          value={form.personalDetails.permanentAddress.city}
                          onChange={(e) =>
                            handleAddressChange("city", e.target.value)
                          }
                        />
                        <Input
                          placeholder="State"
                          value={form.personalDetails.permanentAddress.state}
                          onChange={(e) =>
                            handleAddressChange("state", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Country"
                          value={form.personalDetails.permanentAddress.country}
                          onChange={(e) =>
                            handleAddressChange("country", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Pincode"
                          value={form.personalDetails.permanentAddress.pincode}
                          onChange={(e) =>
                            handleAddressChange("pincode", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bank Details (collapsible) */}
            <div className="border rounded-md p-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("bank")}
              >
                <h4 className="font-medium text-sm">Bank Details</h4>
                {sections.bank ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
              {sections.bank && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Bank Name</Label>
                    <Input
                      value={form.bankDetails.bankName}
                      onChange={(e) =>
                        handleNestedChange(
                          "bankDetails",
                          "bankName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Account Number</Label>
                    <Input
                      value={form.bankDetails.accountNumber}
                      onChange={(e) =>
                        handleNestedChange(
                          "bankDetails",
                          "accountNumber",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>IFSC Code</Label>
                    <Input
                      value={form.bankDetails.ifscCode}
                      onChange={(e) =>
                        handleNestedChange(
                          "bankDetails",
                          "ifscCode",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>UPI ID</Label>
                    <Input
                      value={form.bankDetails.upiId}
                      onChange={(e) =>
                        handleNestedChange(
                          "bankDetails",
                          "upiId",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Account Holder Name</Label>
                    <Input
                      value={form.bankDetails.accountHolderName}
                      onChange={(e) =>
                        handleNestedChange(
                          "bankDetails",
                          "accountHolderName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Account Type</Label>
                    <Select
                      value={form.bankDetails.accountType}
                      onValueChange={(v) =>
                        handleNestedChange("bankDetails", "accountType", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                        <SelectItem value="Salary">Salary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Branch Name</Label>
                    <Input
                      value={form.bankDetails.branchName}
                      onChange={(e) =>
                        handleNestedChange(
                          "bankDetails",
                          "branchName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Notes / Remarks</Label>
              <Textarea
                rows={2}
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-3 gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>
              {editing ? "Save Changes" : "Create Lead"}
            </Button>
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
