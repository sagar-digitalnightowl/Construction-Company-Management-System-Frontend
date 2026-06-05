import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLead } from "@/hooks/useLead";
import { useHR } from "@/hooks/useHR";
import { projectApi } from "@/api";

const emptyCampaign = {
  name: "",
  description: "",
  priority: "medium",
  type: "cold_calling",
  startDate: "",
  endDate: "",
  targetDailyCalls: 50,
  targetTotalLeads: 500,
  assignedAgents: [],
  autoAssign: true,
  callScriptUrl: "", // added back
  offerDocumentUrl: "", // added back
  filters: {
    minBudget: "",
    maxBudget: "",
    interestedProject: "",
    sources: [],
  },
};

const sourceOptions = [
  "employee",
  "referral",
  "website",
  "social_media",
  "direct",
  "cold_call",
];

const CampaignFormModal = ({
  open,
  onOpenChange,
  editingCampaign,
  onSuccess,
}) => {
  const { createCampaign, updateCampaign } = useLead();
  const { employees, fetchEmployees } = useHR();
  const [form, setForm] = useState(emptyCampaign);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [fetchedEmployees, setFetchedEmployees] = useState(false);

  useEffect(() => {
    if (open) {
      projectApi
        .getAll()
        .then((res) => setProjects(res.data?.data?.projects || []))
        .catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    if (open && !fetchedEmployees && employees.length === 0) {
      fetchEmployees().then(() => setFetchedEmployees(true));
    }
  }, [open, fetchedEmployees, employees.length, fetchEmployees]);

  useEffect(() => {
    if (employees.length) {
      const agents = employees.filter((u) =>
        ["employee", "site_engineer", "project_manager"].includes(u.role),
      );
      setAvailableAgents(agents);
    }
  }, [employees]);

  useEffect(() => {
    if (open) {
      if (editingCampaign) {
        setForm({
          ...emptyCampaign,
          ...editingCampaign,
          startDate: editingCampaign.startDate?.split("T")[0] || "",
          endDate: editingCampaign.endDate?.split("T")[0] || "",
          assignedAgents: editingCampaign.assignedAgents || [],
          callScriptUrl: editingCampaign.callScriptUrl || "",
          offerDocumentUrl: editingCampaign.offerDocumentUrl || "",
          filters: {
            minBudget: editingCampaign.filters?.minBudget || "",
            maxBudget: editingCampaign.filters?.maxBudget || "",
            interestedProject: editingCampaign.filters?.interestedProject || "",
            sources: editingCampaign.filters?.sources || [],
          },
        });
      } else {
        setForm(emptyCampaign);
      }
    }
  }, [open, editingCampaign]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      filters: { ...prev.filters, [field]: value },
    }));
  };

  const handleSourcesChange = (source, checked) => {
    setForm((prev) => {
      const current = [...prev.filters.sources];
      if (checked) {
        if (!current.includes(source)) current.push(source);
      } else {
        const index = current.indexOf(source);
        if (index !== -1) current.splice(index, 1);
      }
      return { ...prev, filters: { ...prev.filters, sources: current } };
    });
  };

  const handleAgentToggle = (agentId) => {
    setForm((prev) => {
      const current = [...prev.assignedAgents];
      if (current.includes(agentId)) {
        return {
          ...prev,
          assignedAgents: current.filter((id) => id !== agentId),
        };
      } else {
        return { ...prev, assignedAgents: [...current, agentId] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    setLoading(true);
    const payload = {
      name: form.name,
      description: form.description || undefined,
      priority: form.priority,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      targetDailyCalls: form.targetDailyCalls,
      targetTotalLeads: form.targetTotalLeads,
      assignedAgents: form.assignedAgents.length
        ? form.assignedAgents
        : undefined,
      autoAssign: form.autoAssign,
      callScriptUrl: form.callScriptUrl || "", // send empty string if not filled
      offerDocumentUrl: form.offerDocumentUrl || "", // send empty string if not filled
      filters: {},
    };

    if (form.filters.minBudget)
      payload.filters.minBudget = Number(form.filters.minBudget);
    if (form.filters.maxBudget)
      payload.filters.maxBudget = Number(form.filters.maxBudget);
    if (form.filters.interestedProject)
      payload.filters.interestedProject = form.filters.interestedProject;
    if (form.filters.sources.length)
      payload.filters.sources = form.filters.sources;

    if (Object.keys(payload.filters).length === 0) delete payload.filters;

    let res;
    if (editingCampaign) {
      res = await updateCampaign(editingCampaign._id, payload);
    } else {
      res = await createCampaign(payload);
    }
    setLoading(false);
    if (res) {
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label>Campaign Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Festive Season Campaign"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Priority & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => handleChange("priority", v)}
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
            <div className="space-y-2">
              <Label>Campaign Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => handleChange("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold_calling">Cold Calling</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="survey">Survey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Target Daily Calls</Label>
              <Input
                type="number"
                value={form.targetDailyCalls}
                onChange={(e) =>
                  handleChange(
                    "targetDailyCalls",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Target Total Leads</Label>
              <Input
                type="number"
                value={form.targetTotalLeads}
                onChange={(e) =>
                  handleChange(
                    "targetTotalLeads",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
            </div>
          </div>

          {/* URL Fields (temporary text inputs) */}
          <div className="space-y-2">
            <Label>Call Script Document</Label>
            <Input
              type="file"
              value={form.callScriptUrl}
              onChange={(e) => handleChange("callScriptUrl", e.target.value)}
              placeholder="https://example.com/script.pdf"
            />
          </div>
          <div className="space-y-2">
            <Label>Offer Document</Label>
            <Input
              type="file"
              value={form.offerDocumentUrl}
              onChange={(e) => handleChange("offerDocumentUrl", e.target.value)}
              placeholder="https://example.com/offer.pdf"
            />
          </div>

          {/* Auto Assign Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoAssign"
              checked={form.autoAssign}
              onChange={(e) => handleChange("autoAssign", e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <Label
              htmlFor="autoAssign"
              className="text-sm font-normal cursor-pointer"
            >
              Auto-assign leads based on filters
            </Label>
          </div>

          {/* Assigned Agents */}
          <div className="space-y-2">
            <Label>Assign to Agents (Employees)</Label>
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              {availableAgents.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No eligible employees found
                </p>
              ) : (
                availableAgents.map((agent) => (
                  <label
                    key={agent._id}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.assignedAgents.includes(agent._id)}
                      onChange={() => handleAgentToggle(agent._id)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-sm">
                      {agent.name} ({agent.role})
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="border rounded-md">
            <div
              className="flex items-center justify-between p-3 cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Label className="font-medium cursor-pointer">
                Lead Filters (for auto-assign)
              </Label>
              {showFilters ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
            {showFilters && (
              <div className="p-3 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Min Budget (₹)</Label>
                    <Input
                      type="number"
                      value={form.filters.minBudget}
                      onChange={(e) =>
                        handleFilterChange("minBudget", e.target.value)
                      }
                      placeholder="e.g., 5000000"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max Budget (₹)</Label>
                    <Input
                      type="number"
                      value={form.filters.maxBudget}
                      onChange={(e) =>
                        handleFilterChange("maxBudget", e.target.value)
                      }
                      placeholder="e.g., 10000000"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Interested Project</Label>
                  <Select
                    value={form.filters.interestedProject || "any"}
                    onValueChange={(v) =>
                      handleFilterChange(
                        "interestedProject",
                        v === "any" ? "" : v,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Lead Sources</Label>
                  <div className="flex flex-wrap gap-3">
                    {sourceOptions.map((src) => (
                      <label
                        key={src}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.filters.sources.includes(src)}
                          onChange={(e) =>
                            handleSourcesChange(src, e.target.checked)
                          }
                          className="h-3 w-3"
                        />
                        <span className="text-xs capitalize">
                          {src.replace("_", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {editingCampaign ? "Save Changes" : "Create Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignFormModal;
