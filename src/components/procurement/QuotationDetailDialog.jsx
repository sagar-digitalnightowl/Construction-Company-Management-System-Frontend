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
import { formatINR, formatDate } from "@/lib/helpers";
import { procurementApi } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
};

export function QuotationDetailDialog({
  open,
  onOpenChange,
  quotation,
  onAccept,
  onReject,
}) {

  if (!quotation) return null;

  const vendorName =
    quotation.vendorId?.name || quotation.vendor?.name || "Unknown Vendor";
  const rfqInfo = quotation.rfqId
    ? `${quotation.rfqId.rfqNumber} - ${quotation.rfqId.title}`
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quotation Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Vendor / RFQ</p>
              <p className="font-medium">{vendorName}</p>
              {rfqInfo && (
                <p className="text-xs text-muted-foreground">{rfqInfo}</p>
              )}
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

          {/* Reviewed by info for accepted quotations */}
          {quotation.status === "accepted" && quotation.reviewedBy && (
            <div className="border-t pt-2">
              <p className="text-xs text-muted-foreground">Accepted by</p>
              <p className="text-sm">{quotation.reviewedBy.name}</p>
              <p className="text-xs text-muted-foreground">
                on {formatDate(quotation.reviewedAt)}
              </p>
            </div>
          )}

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
