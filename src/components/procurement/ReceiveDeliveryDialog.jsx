// src/components/procurement/ReceiveDeliveryDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { procurementApi } from "@/api";

export function ReceiveDeliveryDialog({ open, onOpenChange, poId, onSuccess }) {
  const [receivedQuantity, setReceivedQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!receivedQuantity || Number(receivedQuantity) <= 0) {
      toast.error("Please enter valid received quantity");
      return;
    }
    setLoading(true);
    try {
      const res = await procurementApi.receiveDelivery(poId, {
        receivedQuantity: Number(receivedQuantity),
        remarks,
      });
      if (res.data?.success) {
        toast.success("Delivery received successfully");
        onSuccess?.();
        onOpenChange(false);
        setReceivedQuantity("");
        setRemarks("");
      } else {
        throw new Error(res.data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to receive delivery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Delivery</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Received Quantity *</Label>
            <Input
              type="number"
              placeholder="Enter quantity received"
              value={receivedQuantity}
              onChange={(e) => setReceivedQuantity(e.target.value)}
            />
          </div>
          <div>
            <Label>Remarks</Label>
            <Textarea
              rows={2}
              placeholder="Any issues or notes"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Confirm Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
