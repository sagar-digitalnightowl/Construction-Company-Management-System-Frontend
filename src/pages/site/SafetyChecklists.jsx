// src/pages/site/SafetyChecklists.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle } from "lucide-react";
import { useSite } from "@/hooks/useSite";
import { CreateSafetyChecklistDialog } from "@/components/site/CreateSafetyChecklistDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";

export function SafetyChecklists({ canEdit, canOperationsEdit }) {
  const {
    safetyChecklists,
    fetchSafetyChecklists,
    createSafetyChecklist,
    updateSafetyChecklist,
    approveSafetyChecklist,
    loading,
  } = useSite();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  useEffect(() => {
    fetchSafetyChecklists();
  }, [fetchSafetyChecklists]);

  const handleEdit = (checklist) => {
    setSelectedChecklist(checklist);
    setDialogOpen(true);
  };

  const handleApprove = async (id) => {
    await approveSafetyChecklist(id);
  };

  const getStatusColor = (status) => {
    if (status === "approved") return "success";
    if (status === "in_progress") return "warning";
    return "secondary";
  };

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {safetyChecklists.length} checklist(s)
        </p>
        {canOperationsEdit && (
          <Button
            size="sm"
            onClick={() => {
              setSelectedChecklist(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> New Checklist
          </Button>
        )}
      </div>
      {safetyChecklists.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            No safety checklists
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {safetyChecklists.map((c) => (
            <Card key={c._id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Date: {formatDate(c.inspectionDate)}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(c.status)}>
                    {c.status || "pending"}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Safety Status:</span>{" "}
                  {c.safetyStatus || "not set"}
                </div>
                <div className="text-xs">
                  <span className="font-medium">Items:</span>{" "}
                  {c.items?.length || 0} items
                </div>
                <div className="flex gap-2">
                  {canOperationsEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(c)}
                    >
                      View / Edit
                    </Button>
                  )}
                  {canEdit && c.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(c._id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Approve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <CreateSafetyChecklistDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedChecklist}
        onSubmit={
          selectedChecklist
            ? (data) => updateSafetyChecklist(selectedChecklist._id, data)
            : createSafetyChecklist
        }
      />
    </div>
  );
}
