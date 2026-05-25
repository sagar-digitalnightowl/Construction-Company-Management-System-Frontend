import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ClipboardList, ShoppingCart, Package } from "lucide-react";
import { useProcurement } from "@/hooks/useProcurement";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";

export default function Procurement() {
  const navigate = useNavigate();
  const { rfqs, quotations, purchaseOrders, loading } = useProcurement();

   const { current } = useAuthStore();
  
    const canEdit = canMutate(current.role, "procurement");
    const canOperationsEdit = canMutate(current.role, "procurement-operations");

  const stats = {
    rfqs: rfqs.length,
    pendingQuotes: quotations.filter((q) => q.status === "pending").length,
    activePOs: purchaseOrders.filter(
      (po) =>
        po.status === "confirmed" ||
        po.status === "shipped" ||
        po.status === "in_transit",
    ).length,
    totalPOValue: purchaseOrders.reduce(
      (sum, po) => sum + (po.totalAmount || 0),
      0,
    ),
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Procurement"
        title="Procurement Dashboard"
        description="Manage RFQs, quotations, purchase orders, and deliveries."
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => navigate("/procurement/rfqs")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.rfqs}</p>
              <p className="text-sm text-muted-foreground">Active RFQs</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => navigate("/procurement/quotations")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-warning" />
            <div>
              <p className="text-2xl font-bold">{stats.pendingQuotes}</p>
              <p className="text-sm text-muted-foreground">
                Pending Quotations
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => navigate("/procurement/purchase-orders")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold">{stats.activePOs}</p>
              <p className="text-sm text-muted-foreground">Active POs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">
                ₹{(stats.totalPOValue / 100000).toFixed(1)}L
              </p>
              <p className="text-sm text-muted-foreground">Total PO Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent RFQs</CardTitle>
          </CardHeader>
          <CardContent>
            {rfqs.slice(0, 5).map((rfq) => (
              <div
                key={rfq._id}
                className="flex justify-between py-2 border-b last:border-0"
              >
                <span>{rfq.rfqNumber}</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {rfq.status}
                </span>
              </div>
            ))}
            {rfqs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No RFQs
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {purchaseOrders.slice(0, 5).map((po) => (
              <div
                key={po._id}
                className="flex justify-between py-2 border-b last:border-0"
              >
                <span>{po.poNumber}</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {po.status}
                </span>
              </div>
            ))}
            {purchaseOrders.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No Purchase Orders
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
