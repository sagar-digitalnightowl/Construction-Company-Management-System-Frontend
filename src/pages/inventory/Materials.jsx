// src/pages/inventory/Materials.jsx
import React, { useState } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { MaterialTable } from "@/components/inventory/MaterialTable";
import { CreateMaterialDialog } from "@/components/inventory/CreateMaterialDialog";
import { useInventory } from "@/hooks/useInventory";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Materials() {
  const { current } = useAuthStore();
  const canEdit = canMutate(current?.role, "inventory");
  const {
    materials,
    lowStockAlerts,
    fetchMaterials,
    fetchLowStockAlerts,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    loading,
  } = useInventory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Load low stock alerts on mount
  React.useEffect(() => {
    if (canEdit) fetchLowStockAlerts();
  }, [canEdit]);

  const handleSave = async (data) => {
    let success;
    if (editing) {
      success = await updateMaterial(editing._id, data);
      if (success) toast.success("Material updated");
    } else {
      success = await createMaterial(data);
      if (success) toast.success("Material created");
    }
    if (success) {
      setDialogOpen(false);
      setEditing(null);
    }
  };

  const handleDelete = async (material) => {
    if (
      confirm(
        `Delete material "${material.name}"? This action cannot be undone.`,
      )
    ) {
      const success = await deleteMaterial(material._id);
      if (success) toast.success("Material deleted");
    }
  };

  // Count how many materials have low stock alerts
  const lowStockCount = lowStockAlerts?.length || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Master Data"
        title="Materials"
        description="Manage all construction materials and their specifications."
        actions={
          <div className="flex gap-2">
            {lowStockCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {lowStockCount} low stock
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Materials below minimum stock level</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {canEdit && (
              <Button
                onClick={() => {
                  setEditing(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> New Material
              </Button>
            )}
          </div>
        }
      />

      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : materials.length === 0 ? (
        <EmptyState
          title="No materials"
          description="Create materials to start tracking inventory."
        />
      ) : (
        <MaterialTable
          materials={materials}
          lowStockAlerts={lowStockAlerts}
          onEdit={(m) => {
            setEditing(m);
            setDialogOpen(true);
          }}
          onDelete={handleDelete}
          canEdit={canEdit}
        />
      )}

      <CreateMaterialDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
          setDialogOpen(open);
        }}
        initialData={editing}
        onSave={handleSave}
      />
    </div>
  );
}
