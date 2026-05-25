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
import { Calendar, Package, Users, Send } from "lucide-react";
import { formatDate } from "@/lib/helpers";
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
          <div className="py-8 text-center">Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!rfq) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>RFQ Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">{rfq.rfqNumber}</p>
              <p className="text-lg font-semibold">{rfq.title}</p>
            </div>
            <Badge variant={statusColor[rfq.status]}>{rfq.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Deadline: {formatDate(rfq.submissionDeadline)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>
                Material Request:{" "}
                {rfq.materialRequestId?.title || rfq.materialRequestId}
              </span>
            </div>
          </div>

          {rfq.description && (
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{rfq.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium">Invited Vendors</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {rfq.invitedVendors?.map((vendor) => (
                <Badge key={vendor._id || vendor} variant="outline">
                  {vendor.name || vendor}
                </Badge>
              ))}
            </div>
          </div>

          {rfq.receivedQuotations?.length > 0 && (
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
