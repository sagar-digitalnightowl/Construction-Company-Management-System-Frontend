// src/components/procurement/QuotationDetailDialog.jsx
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatINR, formatDate } from "@/lib/helpers";
import { procurementApi } from "@/api/procurementApi";
import { Skeleton } from "@/components/ui/skeleton";



export function QuotationDetailDialog({
  open,
  onOpenChange,
  quotationId,
  onAccept,
  onReject,
}) {
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (open && quotationId) {
      const fetchQuotation = async () => {
        setLoading(true);
        try {
          const res = await procurementApi.getQuotationById(quotationId?._id);
          setQuotation(res.data?.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);   
        }
      };
      fetchQuotation();
    }
  }, [open, quotationId]);

  const statusColors = {
    pending: "warning",
    accepted: "success",
    rejected: "destructive",
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

  if (!quotation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quotation Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Vendor</p>
              <p className="font-medium">
                {quotation.vendorId?.name || quotation.vendor?.name || "N/A"}
              </p>
            </div>
            <Badge
              variant={statusColors[quotation.status]}
              className="capitalize"
            >
              {quotation.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="font-semibold">
                {formatINR(quotation.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivery Charges</p>
              <p>{formatINR(quotation.deliveryCharges || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Valid Until</p>
              <p>{formatDate(quotation.validUntil)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Submitted On</p>
              <p>{formatDate(quotation.createdAt)}</p>
            </div>
          </div>

          {quotation.notes && (
            <div>
              <p className="text-xs text-muted-foreground">Notes</p>
              <p className="text-sm">{quotation.notes}</p>
            </div>
          )}

          <div>
            <Label>Items</Label>
            <div className="border rounded-md overflow-hidden mt-1">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-2 py-1 text-left">Material</th>
                    <th className="px-2 py-1 text-right">Qty</th>
                    <th className="px-2 py-1 text-right">Unit Price</th>
                    <th className="px-2 py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items?.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-2 py-1">{item.materialName}</td>
                      <td className="px-2 py-1 text-right">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {formatINR(item.unitPrice)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {formatINR(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {quotation.status === "rejected" && quotation.rejectionReason && (
            <div className="border-l-4 border-destructive pl-3">
              <p className="text-xs text-muted-foreground">Rejection Reason</p>
              <p className="text-sm">{quotation.rejectionReason}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {quotation.status === "pending" && (
            <>
              <Button variant="default" onClick={() => onAccept(quotation._id)}>
                Accept
              </Button>
              <Button
                variant="destructive"
                onClick={() => onReject(quotation._id)}
              >
                Reject
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
