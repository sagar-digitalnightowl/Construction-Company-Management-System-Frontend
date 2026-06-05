import React, { useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PhoneCall,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLead } from "@/hooks/useLead";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import LeadFormModal from "@/components/lead/LeadFormModal";
import LeadDetailsModal from "@/components/lead/LeadDetailsModal";

const STAGES = [
  { id: "new", label: "New", tint: "var(--color-chart-4)" },
  { id: "contacted", label: "Contacted", tint: "var(--color-chart-2)" },
  { id: "interested", label: "Interested", tint: "var(--color-chart-5)" },
  { id: "negotiation", label: "Negotiation", tint: "var(--color-chart-1)" },
  { id: "converted", label: "Converted", tint: "var(--color-success)" },
  { id: "lost", label: "Lost", tint: "var(--color-destructive)" },
  { id: "cancelled", label: "Cancelled", tint: "var(--color-destructive)" },
];

const LeadKanbanPage = () => {
  const { leads, loading, fetchLeads, fetchMyLeads, deleteLead, pagination } =
    useLead();
  const { current } = useAuthStore();
  const canEdit = canMutate(current.role, "crm");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const stats = leads.statistics || { byStatus: {}, bySource: {} };
  console.log("Leads : ", leads)
  const totalLeads = leads.pagination?.total;

  // Fetch leads with pagination
  const fetchData = (page = 1, limit = 10) => {
    if (canEdit) {
      fetchLeads({ page, limit });
    } else {
      fetchMyLeads({ page, limit });
    }
  };

  useEffect(() => {
    fetchData(pagination.page, pagination.limit);
  }, []);

  // After mutations (create, edit, delete) we refetch current page
  const refresh = () => {
    fetchData(pagination.page, pagination.limit);
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setDetailsOpen(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      await deleteLead(confirmDelete, !canEdit);
      setConfirmDelete(null);
      refresh();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchData(newPage, pagination.limit);
    }
  };

  const allLeads = leads.leads || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading leads...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages} · Total{" "}
            {pagination.total} leads
          </span>
        </div>
        <Button
          onClick={() => {
            setEditingLead(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> New Lead
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card className="p-3 flex items-center gap-3 border-l-4 border-l-blue-500">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-xs text-muted-foreground">Total Leads</p>
            <p className="text-lg font-bold">{totalLeads}</p>
          </div>
        </Card>

        {Object.entries(stats.byStatus || {}).map(([status, count]) => (
          <Card
            key={status}
            className="p-3 flex items-center gap-3 border-l-4 border-l-purple-500"
          >
            <Users className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground capitalize">
                {status}
              </p>
              <p className="text-lg font-bold">{count}</p>
            </div>
          </Card>
        ))}

        {Object.entries(stats.bySource || {})
          .slice(0, 4)
          .map(([source, count]) => (
            <Card
              key={source}
              className="p-3 flex items-center gap-3 border-l-4 border-l-emerald-500"
            >
              <PhoneCall className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-muted-foreground capitalize">
                  {source.replace("_", " ")}
                </p>
                <p className="text-lg font-bold">{count}</p>
              </div>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 gap-2">
        {STAGES.map((stage) => {
          const stageLeads = allLeads.filter((l) => l.status === stage.id);
          return (
            <div
              key={stage.id}
              className="rounded-xl border border-border bg-card p-4 space-y-3 flex flex-col h-[75vh]"
            >
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: stage.tint }}
                  />
                  <span className="font-medium text-sm">{stage.label}</span>
                </div>
                <span className="text-xs text-muted-foreground font-semibold bg-secondary/80 px-1.5 py-0.5 rounded">
                  {stageLeads.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {stageLeads.map((lead) => (
                  <Card
                    key={lead._id}
                    onClick={() => handleViewLead(lead)}
                    className="p-3 hover:shadow-md transition-all group border-border/60 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {lead.clientName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {lead.clientPhone}
                        </div>
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-secondary/30 p-1.5 rounded">
                        {lead.notes}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/40">
                      <div className="text-xs text-muted-foreground truncate">
                        Proj: {lead.interestedProject?.name || "Unassigned"}
                      </div>
                      {canEdit && (
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLead(lead);
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
                              setConfirmDelete(lead._id);
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
                  <div className="text-center py-6 text-xs text-muted-foreground/60 italic border border-dashed rounded-lg">
                    No leads here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <LeadFormModal
        canEdit={canEdit}
        open={formOpen}
        onOpenChange={setFormOpen}
        editingLead={editingLead}
        onSuccess={() => {
          setFormOpen(false);
          setEditingLead(null);
          refresh();
        }}
      />

      <LeadDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        lead={selectedLead}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(v) => !v && setConfirmDelete(null)}
        title="Delete Lead?"
        description="This will soft delete the lead and remove it from all lead lists."
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default LeadKanbanPage;
