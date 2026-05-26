// src/pages/procurement/PurchaseOrders.jsx
import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POCard } from "@/components/procurement/POCard";
import { CreatePoDialog } from "@/components/procurement/CreatePoDialog";
import { useProcurement } from "@/hooks/useProcurement";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { Skeleton } from "@/components/ui/skeleton";
import { PODetailDialog } from "@/components/procurement/PODetailDialog";
import { ReceiveDeliveryDialog } from "@/components/procurement/ReceiveDeliveryDialog";

export default function PurchaseOrders() {
  const { current } = useAuthStore();
  const canEdit = canMutate(current?.role, "procurement");
  const { purchaseOrders, fetchPurchaseOrders, updatePoStatus, rfqs, loading } =
    useProcurement();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [receiveDialogOpen, setreceiveDialogOpen] = useState(false);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const filtered = purchaseOrders.filter((po) => {
    const matchStatus = statusFilter === "all" || po.status === statusFilter;
    const matchSearch =
      !search || po.poNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleView = (poId) => {
    setSelectedPoId(poId);
    setDetailDialogOpen(true);
  };

  const markReceived = (id) => {
    setSelectedPoId(id);
    setreceiveDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Procurement"
        title="Purchase Orders"
        description="Create and manage purchase orders from accepted quotations."
        actions={
          canEdit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create PO
            </Button>
          )
        }
      />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search PO number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No purchase orders"
          description="Create a PO from an accepted quotation."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((po) => (
            <POCard
              key={po._id}
              po={po}
              onView={handleView}
              onUpdateStatus={updatePoStatus}
              markReceived={markReceived}
            />
          ))}
        </div>
      )}
      <CreatePoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={useProcurement().createPurchaseOrder}
        fetchPurchaseOrders={fetchPurchaseOrders}
      />

      <PODetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        poId={selectedPoId}
        onUpdateStatus={updatePoStatus}
      />

      <ReceiveDeliveryDialog
        open={receiveDialogOpen}
        onOpenChange={setreceiveDialogOpen}
        poId={selectedPoId}
        onSuccess={fetchPurchaseOrders}
      />
    </div>
  );
}
