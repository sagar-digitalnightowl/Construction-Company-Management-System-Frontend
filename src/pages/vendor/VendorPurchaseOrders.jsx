// src/pages/vendor/VendorPurchaseOrders.jsx
import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import { formatDate, formatINR } from "@/lib/helpers";
import { procurementApi } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { VendorPODetailDialog } from "@/components/vendor/VendorPODetailDialog";
import { useAuthStore } from "@/store/authStore";

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  confirmed: { label: "Confirmed", variant: "success" },
  shipped: { label: "Shipped", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function VendorPurchaseOrders() {
  const { current } = useAuthStore();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    try {
      const res = await procurementApi.getPurchaseOrders();
      setPurchaseOrders(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const updateStatus = async (poId, newStatus) => {
    setUpdating(true);
    try {
      const res = await procurementApi.updatePurchaseOrderStatus(poId, {
        status: newStatus,
      });
      if (res.data?.success) {
        toast.success(`PO status updated to ${newStatus}`);
        await fetchPurchaseOrders();
        return true;
      }
      throw new Error(res.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const filtered = purchaseOrders.filter((po) => {
    const matchStatus = statusFilter === "all" || po.status === statusFilter;
    const matchSearch =
      !search ||
      po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      (po.vendorId?.name || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleView = (poId) => {
    setSelectedPoId(poId);
    setDetailDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Orders"
        title="Purchase Orders"
        description="View and manage your purchase orders from project managers."
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search PO number or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No purchase orders"
          description="You don't have any purchase orders yet."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((po) => {
            const status = statusConfig[po.status] || {
              label: po.status,
              variant: "secondary",
            };
            const showConfirm = po.status === "sent";
            const showShip = po.status === "confirmed";
            const showDeliveryNote = po.status === "shipped";
            const showDelivered = po.status === "delivered";
            const showCancelled = po.status === "cancelled";

            return (
              <Card key={po._id} className="hover:shadow-md transition">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left side: PO info */}
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleView(po._id)}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">{po.poNumber}</p>
                        <Badge variant={status.variant} className="capitalize">
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Project: {po.projectId?.name || "N/A"}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                        <span>Created: {formatDate(po.createdAt)}</span>
                        {po.expectedDeliveryDate && (
                          <span>
                            Expected: {formatDate(po.expectedDeliveryDate)}
                          </span>
                        )}
                        <span>Items: {po.items?.length || 0}</span>
                        <span>Total: {formatINR(po.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Right side: Action buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(po._id)}
                      >
                        <Eye className="h-3 w-3 mr-1" /> Details
                      </Button>
                      {showConfirm && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={async () => {
                            const success = await updateStatus(
                              po._id,
                              "confirmed",
                            );
                            if (success) setDetailDialogOpen(false);
                          }}
                          disabled={updating}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Confirm
                        </Button>
                      )}
                      {showShip && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={async () => {
                            const success = await updateStatus(
                              po._id,
                              "shipped",
                            );
                            if (success) setDetailDialogOpen(false);
                          }}
                          disabled={updating}
                        >
                          <Truck className="h-3 w-3 mr-1" /> Mark Shipped
                        </Button>
                      )}
                      {showDeliveryNote && (
                        <Badge variant="warning" className="text-xs">
                          Waiting for delivery confirmation
                        </Badge>
                      )}
                      {showDelivered && (
                        <Badge variant="success" className="text-xs">
                          Delivered ✓
                        </Badge>
                      )}
                      {showCancelled && (
                        <Badge variant="destructive" className="text-xs">
                          Cancelled
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <VendorPODetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        poId={selectedPoId}
        onStatusUpdate={updateStatus}
      />
    </div>
  );
}
