// src/pages/vendor/VendorPurchaseOrders.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatINR } from "@/lib/helpers";
import { procurementApi } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  draft: "secondary",
  sent: "default",
  confirmed: "success",
  shipped: "info",
  delivered: "success",
  cancelled: "destructive",
};

export function VendorPurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    try {
      const res = await procurementApi.getPurchaseOrders();
      setPurchaseOrders(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (purchaseOrders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No purchase orders yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {purchaseOrders.map((po) => (
        <Card key={po._id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{po.poNumber}</p>
                <p className="text-xs text-muted-foreground">
                  Created: {formatDate(po.createdAt)}
                </p>
              </div>
              <Badge variant={statusColors[po.status]}>{po.status}</Badge>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total Amount:</span>{" "}
              {formatINR(po.totalAmount)}
            </div>
            {po.expectedDeliveryDate && (
              <div className="text-xs text-muted-foreground">
                Expected delivery: {formatDate(po.expectedDeliveryDate)}
              </div>
            )}
            {po.status === "sent" && (
              <div className="mt-2 text-xs text-blue-600">
                Please confirm this PO to proceed.
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
