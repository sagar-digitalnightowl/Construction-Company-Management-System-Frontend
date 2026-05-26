// src/components/procurement/PODetailDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatINR, formatDate } from "@/lib/helpers";
import { procurementApi } from "@/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  confirmed: { label: "Confirmed", variant: "success" },
  shipped: { label: "Shipped", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function PODetailDialog({ open, onOpenChange, poId, onUpdateStatus }) {
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");

  useEffect(() => {
    if (open && poId) {
      const fetchPo = async () => {
        setLoading(true);
        try {
          const res = await procurementApi.getPurchaseOrderById(poId);
          setPo(res.data?.data);
          setExpectedDeliveryDate(
            res.data?.data?.expectedDeliveryDate?.split("T")[0] || "",
          );
        } catch (err) {
          toast.error("Failed to load PO details");
        } finally {
          setLoading(false);
        }
      };
      fetchPo();
    }
  }, [open, poId]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    const success = await onUpdateStatus(poId, status, expectedDeliveryDate);
    setUpdating(false);
    if (success) {
      // Refresh PO data
      const res = await procurementApi.getPurchaseOrderById(poId);
      setPo(res.data?.data);
    }
  };

  const handleDateChange = async () => {
    setUpdating(true);
    const success = await onUpdateStatus(poId, po.status, expectedDeliveryDate);
    setUpdating(false);
    if (success) {
      toast.success("Expected delivery date updated");
      const res = await procurementApi.getPurchaseOrderById(poId);
      setPo(res.data?.data);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!po) return null;

  const totalAmount =
    po.items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Order Details</DialogTitle>
          <p className="text-sm text-muted-foreground">{po.poNumber}</p>
        </DialogHeader>
        <div className="space-y-4">
          {/* Header info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Vendor:</span>
              <p className="font-medium">{po.vendorId?.name || "N/A"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={statusConfig[po.status]?.variant}
                className="ml-2"
              >
                {statusConfig[po.status]?.label || po.status}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p>{formatDate(po.createdAt)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Expected Delivery:</span>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="w-36"
                  disabled={updating}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDateChange}
                  disabled={updating}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div>
            <Label>Items</Label>
            <div className="border rounded-md overflow-hidden mt-1">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-2 py-1 text-left">Material</th>
                    <th className="px-2 py-1 text-right">Qty</th>
                    <th className="px-2 py-1 text-right">Unit</th>
                    <th className="px-2 py-1 text-right">Unit Price</th>
                    <th className="px-2 py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {po.items?.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-2 py-1">{item.materialName}</td>
                      <td className="px-2 py-1 text-right">{item.quantity}</td>
                      <td className="px-2 py-1 text-right">{item.unit}</td>
                      <td className="px-2 py-1 text-right">
                        {formatINR(item.unitPrice)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {formatINR(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td
                      colSpan="4"
                      className="px-2 py-1 text-right font-medium"
                    >
                      Total:
                    </td>
                    <td className="px-2 py-1 text-right font-bold">
                      {formatINR(totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Delivery address */}
          {po.deliveryAddress && (
            <div>
              <Label>Delivery Address</Label>
              <p className="text-sm mt-1">{po.deliveryAddress}</p>
            </div>
          )}

          {/* Terms */}
          {po.termsAndConditions && (
            <div>
              <Label>Terms & Conditions</Label>
              <p className="text-sm mt-1 whitespace-pre-wrap">
                {po.termsAndConditions}
              </p>
            </div>
          )}

          {/* Status action buttons */}
          <div className="border-t pt-3">
            <Label>Update Status</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {po.status === "draft" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("sent")}
                  disabled={updating}
                >
                  Send to Vendor
                </Button>
              )}
              {po.status === "sent" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("confirmed")}
                  disabled={updating}
                >
                  Confirm Order
                </Button>
              )}
              {po.status === "confirmed" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("shipped")}
                  disabled={updating}
                >
                  Mark as Shipped
                </Button>
              )}
              {po.status === "shipped" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate("delivered")}
                  disabled={updating}
                >
                  Mark as Delivered
                </Button>
              )}
              {(po.status === "draft" || po.status === "sent") && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate("cancelled")}
                  disabled={updating}
                >
                  Cancel PO
                </Button>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
