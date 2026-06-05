import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  CalendarDays,
  User,
  Phone,
  Mail,
  Briefcase,
  Layers,
  Building2,
  FileText,
  Compass,
  Banknote,
  Home,
  IdCard,
  Heart,
  PhoneCall,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit2,
} from "lucide-react";
import { useLead } from "@/hooks/useLead";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

// ----------------------------------------------------------------------
// Lead Call Status Section (NEW)
// ----------------------------------------------------------------------
const LeadCallStatusSection = ({ lead, updateLeadCallStatus, onUpdated }) => {
  const { current } = useAuthStore();
  const role = current?.role;
  const isEmployee = ["employee", "site_engineer", "project_manager"].includes(
    role,
  );

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    callStatus: ["called", "connected"].includes(lead.callStatus)
      ? "connected"
      : lead.callStatus || "pending",
    priority: lead.priority || "medium",
    nextCallDate: lead.nextCallDate
      ? new Date(lead.nextCallDate).toISOString().slice(0, 10)
      : "",
    notes: lead.callNotes || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      callStatus: form.callStatus,
      priority: form.priority,
      nextCallDate: form.nextCallDate || undefined,
      notes: form.notes,
    };
    const result = await updateLeadCallStatus(lead._id, payload, isEmployee);
    setSaving(false);
    if (result) {
      setEditing(false);
      if (onUpdated) onUpdated();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "connected":
      case "converted":
        return "success";
      case "pending":
      case "callback_requested":
        return "warning";
      case "not_interested":
      case "not_reachable":
      case "busy":
      case "no_answer":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-2">
      <Separator />
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <PhoneCall className="h-3.5 w-3.5" /> Lead Call Status
        </h4>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </div>

      {!editing ? (
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-muted/40 border">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              Status
            </span>
            <Badge
              variant={getStatusBadge(lead.callStatus)}
              className="capitalize"
            >
              {lead.callStatus || "pending"}
            </Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              Priority
            </span>
            <Badge
              variant={getPriorityBadge(lead.priority)}
              className="capitalize"
            >
              {lead.priority || "medium"}
            </Badge>
          </div>
          <div className="space-y-1 col-span-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              Next Call Date
            </span>
            <span className="text-sm">
              {lead.nextCallDate
                ? new Date(lead.nextCallDate).toLocaleDateString()
                : "Not set"}
            </span>
          </div>
          {lead.callNotes && (
            <div className="space-y-1 col-span-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Notes
              </span>
              <span className="text-sm">{lead.callNotes}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 border rounded-xl p-3 bg-muted/20">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Call Status</Label>
              <Select
                value={form.callStatus}
                onValueChange={(v) => setForm({ ...form, callStatus: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="not_reachable">Not Reachable</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="no_answer">No Answer</SelectItem>
                  <SelectItem value="callback_requested">
                    Callback Requested
                  </SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Next Call Date</Label>
              <Input
                type="date"
                value={form.nextCallDate}
                onChange={(e) =>
                  setForm({ ...form, nextCallDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes</Label>
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Call History Section (EXISTING – completely unchanged)
// ----------------------------------------------------------------------
const CallHistorySection = ({
  leadId,
  campaignId,
  callLogs,
  addCallLog,
  onLogAdded,
}) => {
  const [showLogs, setShowLogs] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCallLog, setNewCallLog] = useState({
    calledAt: new Date().toISOString().slice(0, 16),
    callDuration: "",
    callStatus: "connected",
    callType: "outbound",
    disposition: "",
    notes: "",
    summary: "",
    followUpRequired: false,
    nextFollowUpDate: "",
    recordingUrl: "",
    clientFeedback: "",
    callerId: "",
    metadata: { callSid: "", fromNumber: "", toNumber: "" },
  });
  const [savingLog, setSavingLog] = useState(false);

  const handleFormChange = (field, value) => {
    setNewCallLog((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetadataChange = (field, value) => {
    setNewCallLog((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }));
  };

  const handleAddCallLog = async () => {
    if (!newCallLog.calledAt) {
      toast.error("Please select call date/time");
      return;
    }
    setSavingLog(true);
    const payload = {
      leadId,
      campaignId: campaignId || undefined,
      calledAt: new Date(newCallLog.calledAt).toISOString(),
      callDuration: Number(newCallLog.callDuration) || 0,
      callStatus: newCallLog.callStatus,
      callType: newCallLog.callType,
      disposition: newCallLog.disposition || undefined,
      notes: newCallLog.notes,
      summary: newCallLog.summary,
      followUpRequired: newCallLog.followUpRequired,
      nextFollowUpDate: newCallLog.nextFollowUpDate || undefined,
      recordingUrl: newCallLog.recordingUrl || undefined,
      clientFeedback: newCallLog.clientFeedback,
      callerId: newCallLog.callerId,
      metadata: newCallLog.metadata,
    };
    const result = await addCallLog(payload);
    setSavingLog(false);
    if (result) {
      setShowAddForm(false);
      setNewCallLog({
        calledAt: new Date().toISOString().slice(0, 16),
        callDuration: "",
        callStatus: "connected",
        callType: "outbound",
        disposition: "",
        notes: "",
        summary: "",
        followUpRequired: false,
        nextFollowUpDate: "",
        recordingUrl: "",
        clientFeedback: "",
        callerId: "",
        metadata: { callSid: "", fromNumber: "", toNumber: "" },
      });
      if (onLogAdded) onLogAdded();
    }
  };

  const getStatusVariant = (status, color) => {
    const colorMap = {
      purple: "secondary",
      green: "success",
      red: "destructive",
      orange: "warning",
      blue: "default",
    };
    if (color && colorMap[color]) return colorMap[color];
    return "outline";
  };

  return (
    <div className="space-y-2">
      <Separator />
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setShowLogs(!showLogs)}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <PhoneCall className="h-3.5 w-3.5" /> Call History
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {callLogs?.length || 0} logs
          </span>
          {showLogs ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>
      {showLogs && (
        <div className="space-y-3">
          {callLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No call logs yet.
            </p>
          ) : (
            callLogs.map((log) => (
              <div
                key={log._id}
                className="p-3 rounded-lg bg-muted/40 border space-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">
                      {log.callStatus || "unknown"}
                    </span>
                    <Badge
                      variant={getStatusVariant(
                        log.callStatus,
                        log.statusBadgeColor,
                      )}
                      className="text-xs"
                    >
                      {log.callType || "outbound"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {log.calledAtFormatted ||
                      new Date(log.calledAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {log.calledBy?.name && <span>By: {log.calledBy.name}</span>}
                  {log.campaignId?.name && (
                    <span>Campaign: {log.campaignId.name}</span>
                  )}
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {log.callTimeFormatted && (
                    <span>Duration: {log.callTimeFormatted}</span>
                  )}
                  {log.disposition && (
                    <span>
                      Disposition: {log.disposition.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                {log.notes && (
                  <p className="text-sm mt-1 text-muted-foreground">
                    {log.notes}
                  </p>
                )}
                {log.followUp?.required && log.followUp?.scheduledDate && (
                  <div className="text-xs flex items-center gap-1 text-blue-600">
                    <CalendarDays className="h-3 w-3" />
                    Follow-up:{" "}
                    {new Date(log.followUp.scheduledDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          )}
          {showAddForm ? (
            <div className="space-y-3 border rounded-xl p-3 bg-muted/20">
              <h5 className="text-sm font-semibold">New Call Log</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Call Date/Time *</Label>
                  <Input
                    type="datetime-local"
                    value={newCallLog.calledAt}
                    onChange={(e) =>
                      handleFormChange("calledAt", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Duration (sec)</Label>
                  <Input
                    type="number"
                    value={newCallLog.callDuration}
                    onChange={(e) =>
                      handleFormChange("callDuration", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={newCallLog.callStatus}
                    onValueChange={(v) => handleFormChange("callStatus", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="not_connected">
                        Not Connected
                      </SelectItem>
                      <SelectItem value="wrong_number">Wrong Number</SelectItem>
                      <SelectItem value="callback_requested">
                        Callback Requested
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Call Type</Label>
                  <Select
                    value={newCallLog.callType}
                    onValueChange={(v) => handleFormChange("callType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outbound">Outbound</SelectItem>
                      <SelectItem value="inbound">Inbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Disposition</Label>
                  <Select
                    value={newCallLog.disposition}
                    onValueChange={(v) => handleFormChange("disposition", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment_scheduled">
                        Appointment Scheduled
                      </SelectItem>
                      <SelectItem value="site_visit_booked">
                        Site Visit Booked
                      </SelectItem>
                      <SelectItem value="price_query">Price Query</SelectItem>
                      <SelectItem value="documents_requested">
                        Documents Requested
                      </SelectItem>
                      <SelectItem value="callback_scheduled">
                        Callback Scheduled
                      </SelectItem>
                      <SelectItem value="not_interested">
                        Not Interested
                      </SelectItem>
                      <SelectItem value="wrong_timing">Wrong Timing</SelectItem>
                      <SelectItem value="will_call_back">
                        Will Call Back
                      </SelectItem>
                      <SelectItem value="requested_whatsapp">
                        Requested Whatsapp
                      </SelectItem>
                      <SelectItem value="requested_email">
                        Requested Email
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Notes</Label>
                <Textarea
                  rows={2}
                  value={newCallLog.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Summary</Label>
                <Textarea
                  rows={1}
                  value={newCallLog.summary}
                  onChange={(e) => handleFormChange("summary", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newCallLog.followUpRequired}
                    onCheckedChange={(checked) =>
                      handleFormChange("followUpRequired", checked)
                    }
                  />
                  <Label className="text-xs">Follow-up Required</Label>
                </div>
                {newCallLog.followUpRequired && (
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">Next Follow-up Date</Label>
                    <Input
                      type="date"
                      value={newCallLog.nextFollowUpDate}
                      onChange={(e) =>
                        handleFormChange("nextFollowUpDate", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Client Feedback</Label>
                  <Input
                    value={newCallLog.clientFeedback}
                    onChange={(e) =>
                      handleFormChange("clientFeedback", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Caller ID</Label>
                  <Input
                    value={newCallLog.callerId}
                    onChange={(e) =>
                      handleFormChange("callerId", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Call SID</Label>
                  <Input
                    value={newCallLog.metadata.callSid}
                    onChange={(e) =>
                      handleMetadataChange("callSid", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">From Number</Label>
                  <Input
                    value={newCallLog.metadata.fromNumber}
                    onChange={(e) =>
                      handleMetadataChange("fromNumber", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">To Number</Label>
                  <Input
                    value={newCallLog.metadata.toNumber}
                    onChange={(e) =>
                      handleMetadataChange("toNumber", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddCallLog}
                  disabled={savingLog}
                >
                  {savingLog ? "Saving..." : "Save Call Log"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Call Log
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Detail Item (unchanged)
// ----------------------------------------------------------------------
const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="space-y-1 p-3 rounded-xl bg-secondary/20 border border-border/40 flex items-start gap-3">
    {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
    <div className="min-w-0 flex-1">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground block truncate">
        {value || (
          <span className="text-muted-foreground/60 italic text-xs">
            Not Provided
          </span>
        )}
      </span>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// Main Modal
// ----------------------------------------------------------------------
const LeadDetailsModal = ({ open, onOpenChange, lead }) => {
  const {
    fetchCallLogsForLead,
    addCallLog,
    callLogs,
    updateLeadCallStatus,
    fetchLeadById,
  } = useLead();

  useEffect(() => {
    if (open && lead?._id) {
      fetchCallLogsForLead(lead._id);
    }
  }, [open, lead?._id]);

  if (!lead) return null;

  const getStatusVariant = (status) => {
    const mapping = {
      new: "secondary",
      contacted: "outline",
      interested: "default",
      negotiation: "warning",
      converted: "success",
      lost: "destructive",
      cancelled: "destructive",
    };
    return mapping[status?.toLowerCase()] || "default";
  };

  const personal = lead.personalDetails || {};
  const bank = lead.bankDetails || {};

  const handleLogAdded = () => {
    fetchCallLogsForLead(lead._id);
  };

  const handleStatusUpdated = async () => {
    // Refresh lead details to get updated call status, priority, etc.
    await fetchLeadById(lead._id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-xl max-h-[85vh] flex flex-col p-4 sm:p-6 rounded-xl gap-4 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b shrink-0">
          <div className="space-y-1 pr-4 min-w-0">
            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight truncate">
              {lead.clientName}
            </DialogTitle>
            <p className="text-xs text-muted-foreground font-mono">
              ID: {lead.leadId || "N/A"}
            </p>
          </div>
          <Badge
            variant={getStatusVariant(lead.status)}
            className="capitalize shrink-0"
          >
            {lead.status}
          </Badge>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-1">
          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3 w-3" /> Contact Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <DetailItem label="Phone" value={lead.clientPhone} icon={Phone} />
              <DetailItem label="Email" value={lead.clientEmail} icon={Mail} />
            </div>
          </div>

          {/* Project Interest */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="h-3 w-3" /> Opportunity
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <DetailItem label="Source" value={lead.source} icon={Compass} />
              <DetailItem
                label="Unit"
                value={lead.interestedUnit}
                icon={Layers}
              />
            </div>
            <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/60 flex items-start gap-3">
              <Building2 className="h-5 w-5 text-primary/80 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Target Project
                </span>
                <span className="text-sm font-semibold block">
                  {lead.interestedProject?.name || "Unassigned"}
                </span>
                {lead.interestedProject?.location && (
                  <span className="text-xs text-muted-foreground block">
                    {lead.interestedProject.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Budget & Campaign */}
          {(lead.budgetRange || lead.campaignName || lead.referralCode) && (
            <div className="space-y-2">
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {lead.budgetRange && (
                  <DetailItem
                    label="Budget"
                    value={lead.budgetRange}
                    icon={Banknote}
                  />
                )}
                {lead.campaignName && (
                  <DetailItem label="Campaign" value={lead.campaignName} />
                )}
                {lead.referralCode && (
                  <DetailItem label="Referral Code" value={lead.referralCode} />
                )}
              </div>
            </div>
          )}

          {/* Personal Details */}
          {(personal.dateOfBirth ||
            personal.gender ||
            personal.aadharNumber ||
            personal.permanentAddress?.city) && (
            <div className="space-y-2">
              <Separator />
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <IdCard className="h-3 w-3" /> Personal Details
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {personal.dateOfBirth && (
                  <DetailItem
                    label="DOB"
                    value={new Date(personal.dateOfBirth).toLocaleDateString()}
                  />
                )}
                {personal.gender && (
                  <DetailItem label="Gender" value={personal.gender} />
                )}
                {personal.bloodGroup && (
                  <DetailItem label="Blood Group" value={personal.bloodGroup} />
                )}
                {personal.maritalStatus && (
                  <DetailItem
                    label="Marital Status"
                    value={personal.maritalStatus}
                  />
                )}
                {personal.aadharNumber && (
                  <DetailItem label="Aadhar" value={personal.aadharNumber} />
                )}
                {personal.panNumber && (
                  <DetailItem label="PAN" value={personal.panNumber} />
                )}
                {personal.fatherName && (
                  <DetailItem
                    label="Father's Name"
                    value={personal.fatherName}
                  />
                )}
                {personal.motherName && (
                  <DetailItem
                    label="Mother's Name"
                    value={personal.motherName}
                  />
                )}
              </div>
              {personal.permanentAddress?.city && (
                <div className="p-3 rounded-xl bg-muted/40 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-semibold">
                      Permanent Address
                    </span>
                  </div>
                  <p className="text-sm">
                    {personal.permanentAddress.line1 &&
                      `${personal.permanentAddress.line1}, `}
                    {personal.permanentAddress.city &&
                      `${personal.permanentAddress.city}, `}
                    {personal.permanentAddress.state &&
                      `${personal.permanentAddress.state} `}
                    {personal.permanentAddress.pincode &&
                      `- ${personal.permanentAddress.pincode}`}
                  </p>
                </div>
              )}
              {personal.emergencyContactName && (
                <div className="p-3 rounded-xl bg-muted/40 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-semibold">
                      Emergency Contact
                    </span>
                  </div>
                  <p className="text-sm">
                    {personal.emergencyContactName} (
                    {personal.emergencyContactRelation})<br />
                    {personal.emergencyContactPhone}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bank Details */}
          {bank.bankName && (
            <div className="space-y-2">
              <Separator />
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Bank Details
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {bank.bankName && (
                  <DetailItem label="Bank" value={bank.bankName} />
                )}
                {bank.accountNumber && (
                  <DetailItem label="Account No." value={bank.accountNumber} />
                )}
                {bank.ifscCode && (
                  <DetailItem label="IFSC" value={bank.ifscCode} />
                )}
                {bank.upiId && <DetailItem label="UPI ID" value={bank.upiId} />}
                {bank.accountHolderName && (
                  <DetailItem
                    label="Holder Name"
                    value={bank.accountHolderName}
                  />
                )}
                {bank.accountType && (
                  <DetailItem label="Account Type" value={bank.accountType} />
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Separator />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3 w-3" /> Notes
            </h4>
            <div className="p-3 rounded-xl bg-muted/60 border text-sm whitespace-pre-wrap">
              {lead.notes || (
                <span className="text-muted-foreground/60 italic">
                  No notes
                </span>
              )}
            </div>
          </div>

          {/* Lead Call Status Section */}
          <LeadCallStatusSection
            lead={lead}
            updateLeadCallStatus={updateLeadCallStatus}
            onUpdated={handleStatusUpdated}
          />

          {/* Call History Section */}
          <CallHistorySection
            leadId={lead._id}
            campaignId={lead.campaignId?._id || lead.campaignId}
            callLogs={callLogs}
            addCallLog={addCallLog}
            onLogAdded={handleLogAdded}
          />

          {/* Timeline */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-dashed">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              <div>
                <span className="font-semibold block uppercase text-[9px] tracking-wide">
                  Next Follow Up
                </span>
                <span>
                  {lead.followUpDate
                    ? new Date(lead.followUpDate).toLocaleDateString()
                    : "Not set"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 border-l pl-3">
              <CalendarDays className="h-3.5 w-3.5" />
              <div>
                <span className="font-semibold block uppercase text-[9px] tracking-wide">
                  Created
                </span>
                <span>
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {lead.generatedBy && (
            <div className="text-xs text-muted-foreground/80 flex items-center gap-1 px-1">
              <span>Generated by:</span>
              <span className="font-semibold text-foreground">
                {lead.generatedBy.name || lead.generatedByName}
              </span>
              {lead.generatedBy.employeeId && (
                <span className="font-mono text-[10px] bg-secondary px-1 rounded">
                  ({lead.generatedBy.employeeId})
                </span>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsModal;
