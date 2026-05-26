// src/components/procurement/RFQDetailDialog.jsx
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
import { Calendar, Package, Users, Send, FileText, Clock } from "lucide-react";
import { formatDate, formatINR } from "@/lib/helpers";
import { procurementApi } from "@/api";
import { toast } from "sonner";

export function RFQDetailDialog({ open, onOpenChange, rfqId, onSend }) {
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open && rfqId) {
      const fetchRfq = async () => {
        setLoading(true);
        try {
          const res = await procurementApi.getRfqById(rfqId);
          setRfq(res.data?.data);
        } catch (err) {
          toast.error("Failed to load RFQ details");
        } finally {
          setLoading(false);
        }
      };
      fetchRfq();
    }
  }, [open, rfqId]);

  const handleSend = async () => {
    setSending(true);
    const success = await onSend(rfqId);
    setSending(false);
    if (success) {
      // Refresh the RFQ data to update status
      const res = await procurementApi.getRfqById(rfqId);
      setRfq(res.data?.data);
    }
  };

  const statusColor = {
    draft: "secondary",
    sent: "default",
    expired: "destructive",
    closed: "outline",
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="py-8 text-center text-muted-foreground">
            Loading RFQ details...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!rfq) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>RFQ Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground">{rfq.rfqNumber}</p>
              <p className="text-lg font-semibold mt-1">{rfq.title}</p>
            </div>
            <Badge
              variant={statusColor[rfq.status] || "secondary"}
              className="capitalize"
            >
              {rfq.status}
            </Badge>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Deadline:</span>
              <span className="font-medium">
                {formatDate(rfq.submissionDeadline)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Created:</span>
              <span>{formatDate(rfq.createdAt)}</span>
            </div>
          </div>

          {/* Material Request Details */}
          {rfq.materialRequestId && (
            <div className="border rounded-md p-3 space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" /> Material Request
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium">
                    {rfq.materialRequestId.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material:</span>
                  <span>{rfq.materialRequestId.materialName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span>
                    {rfq.materialRequestId.quantity}{" "}
                    {rfq.materialRequestId.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required By:</span>
                  <span>
                    {formatDate(rfq.materialRequestId.requiredByDate)}
                  </span>
                </div>
                {rfq.materialRequestId.deliveryLocation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Location:
                    </span>
                    <span>{rfq.materialRequestId.deliveryLocation}</span>
                  </div>
                )}
                {rfq.materialRequestId.description && (
                  <div>
                    <p className="text-muted-foreground">Description:</p>
                    <p className="text-sm">
                      {rfq.materialRequestId.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {rfq.description && (
            <div>
              <p className="text-sm font-medium">Additional Details</p>
              <p className="text-sm text-muted-foreground mt-1">
                {rfq.description}
              </p>
            </div>
          )}

          {/* Invited Vendors */}
          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Invited Vendors (
              {rfq.invitedVendors?.length || 0})
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {rfq.invitedVendors?.map((vendor) => (
                <Badge
                  key={vendor._id || vendor}
                  variant="outline"
                  className="text-xs"
                >
                  {vendor.name || vendor}
                </Badge>
              ))}
              {(!rfq.invitedVendors || rfq.invitedVendors.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No vendors invited yet
                </p>
              )}
            </div>
          </div>

          {/* Received Quotations */}
          {rfq.receivedQuotations && rfq.receivedQuotations.length > 0 && (
            <div>
              <p className="text-sm font-medium">Received Quotations</p>
              <p className="text-sm text-muted-foreground">
                {rfq.receivedQuotations.length} quotation(s) received
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {rfq.status === "draft" && (
            <Button onClick={handleSend} disabled={sending}>
              <Send className="h-4 w-4 mr-2" /> Send to Vendors
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
