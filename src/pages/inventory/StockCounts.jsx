// src/pages/inventory/StockCounts.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Eye, RefreshCw } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";
import { StockCountDialog } from "@/components/inventory/StockCountDialog";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { toast } from "sonner";

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
};

export default function StockCounts() {
  const navigate = useNavigate();
  const { current } = useAuthStore();
  const canStartCount = canMutate(current?.role, "inventory");
  const { stockCounts, fetchStockCounts, loading } = useInventory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadCounts = async () => {
    setRefreshing(true);
    await fetchStockCounts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadCounts();
  }, []);

  if (loading && !refreshing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit"
        title="Physical Stock Counts"
        description="Manage periodic inventory verification."
        actions={
          <div className="flex gap-2">
            {canStartCount && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Start Count
              </Button>
            )}
          </div>
        }
      />

      {!loading && stockCounts.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No counts yet"
          description="Start a physical count to reconcile stock."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockCounts.map((count) => (
            <Card
              key={count._id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => navigate(`/inventory/counts/${count._id}`)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {count.warehouse?.name || count.warehouseName || "Unknown Warehouse"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Count #{count.countNumber?.slice(-6) || count._id.slice(-6)}
                    </p>
                  </div>
                  <Badge
                    variant={statusConfig[count.status]?.variant || "secondary"}
                    className="capitalize text-nowrap"
                  >
                    {statusConfig[count.status]?.label || count.status}
                  </Badge>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{formatDate(count.createdAt)}</span>
                  </div>
                  {count.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed:</span>
                      <span>{formatDate(count.completedAt)}</span>
                    </div>
                  )}
                  {count.approvedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved:</span>
                      <span>{formatDate(count.approvedAt)}</span>
                    </div>
                  )}
                </div>

                {count.items && count.items.length > 0 && (
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    📦 {count.items.length} item(s) counted
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/inventory/counts/${count._id}`);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" /> View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <StockCountDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={loadCounts} />
    </div>
  );
}