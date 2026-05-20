// src/components/procurement/CreatePoDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { procurementApi } from "@/api/procurementApi";
import { formatINR } from "@/lib/helpers";

export function CreatePoDialog({ open, onOpenChange, onCreate, rfqs = [] }) {
  const [acceptedQuotations, setAcceptedQuotations] = useState([]);
  const [selectedQuotationId, setSelectedQuotationId] = useState("");
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingQuotation, setLoadingQuotation] = useState(false);

  // Form fields
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");

  // Fetch accepted quotations when dialog opens
  useEffect(() => {
    if (open) {
      const fetchQuotations = async () => {
        setLoadingQuotation(true);
        try {
          const res = await procurementApi.getQuotations({
            status: "accepted",
          });
          setAcceptedQuotations(res.data?.data || []);
        } catch (err) {
          toast.error("Failed to load accepted quotations");
        } finally {
          setLoadingQuotation(false);
        }
      };
      fetchQuotations();
    }
  }, [open]);

  // When a quotation is selected, find its associated RFQ
  useEffect(() => {
    if (!selectedQuotationId) {
      setSelectedRfq(null);
      return;
    }
    const quotation = acceptedQuotations.find(
      (q) => q._id === selectedQuotationId,
    );
    if (!quotation) return;

    // Try to find RFQ in the passed rfqs array
    let rfq = rfqs.find((r) => String(r._id) === String(quotation.rfqId));

    console.log("quotation.rfqId : ", quotation);
    console.log("RFQ : ", rfq);
    console.log("RFQS : ", rfqs);

    // If not found, fetch it directly from API
    const fetchRfq = async () => {
      try {
        const res = await procurementApi.getRfqById(quotation.rfqId);
        rfq = res.data?.data;
        setSelectedRfq(rfq || null);
        if (!rfq) toast.error("Associated RFQ not found");
      } catch (err) {
        console.error("Failed to fetch RFQ:", err);
        toast.error("Failed to fetch RFQ details");
        setSelectedRfq(null);
      }
    };

    if (rfq) {
      setSelectedRfq(rfq);
    } else {
      fetchRfq();
    }

    // Pre-fill expected delivery date (7 days from now) if not already set
    if (!expectedDeliveryDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setExpectedDeliveryDate(defaultDate.toISOString().split("T")[0]);
    }
  }, [selectedQuotationId, acceptedQuotations, rfqs]);

  const handleSubmit = async () => {
    if (!selectedQuotationId) {
      toast.error("Please select an accepted quotation");
      return;
    }
    if (!expectedDeliveryDate) {
      toast.error("Expected delivery date is required");
      return;
    }
    if (!selectedRfq) {
      toast.error("Unable to find associated RFQ details. Please try again.");
      return;
    }

    const quotation = acceptedQuotations.find(
      (q) => q._id === selectedQuotationId,
    );
    if (!quotation) {
      toast.error("Quotation not found");
      return;
    }

    // Build items array with all required fields
    const items = quotation.items.map((item) => ({
      materialId: item.materialId,
      materialName: item.materialName,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    const payload = {
      materialRequestId: selectedRfq.materialRequestId,
      projectId: selectedRfq.projectId,
      vendorId: quotation.vendorId?._id || quotation.vendorId,
      items: items,
      expectedDeliveryDate: expectedDeliveryDate,
      deliveryAddress: deliveryAddress || undefined,
      termsAndConditions: termsAndConditions || undefined,
    };

    setLoading(true);
    const success = await onCreate(payload);
    setLoading(false);
    if (success) {
      onOpenChange(false);
      // Reset form
      setSelectedQuotationId("");
      setSelectedRfq(null);
      setExpectedDeliveryDate("");
      setDeliveryAddress("");
      setTermsAndConditions("");
    }
  };

  const selectedQuotation = acceptedQuotations.find(
    (q) => q._id === selectedQuotationId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Quotation Selection */}
          <div className="space-y-1">
            <Label>Select Accepted Quotation *</Label>
            <Select
              value={selectedQuotationId}
              onValueChange={setSelectedQuotationId}
              disabled={loadingQuotation}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingQuotation ? "Loading..." : "Choose quotation"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {acceptedQuotations.map((q) => (
                  <SelectItem key={q._id} value={q._id}>
                    {q.vendorId?.name || "Vendor"} - {formatINR(q.totalAmount)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview selected quotation details */}
          {selectedQuotation && selectedRfq && (
            <div className="space-y-3 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Quotation Details</p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">Vendor:</span>{" "}
                  {selectedQuotation.vendorId?.name || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Total Amount:</span>{" "}
                  {formatINR(selectedQuotation.totalAmount)}
                </p>
                <p>
                  <span className="text-muted-foreground">Items:</span>{" "}
                  {selectedQuotation.items.length} item(s)
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">
                    View items
                  </summary>
                  <div className="mt-1 space-y-1">
                    {selectedQuotation.items.map((item, idx) => (
                      <div key={idx}>
                        {item.materialName} – {item.quantity} {item.unit} @{" "}
                        {formatINR(item.unitPrice)} ={" "}
                        {formatINR(item.totalPrice)}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          )}

          {/* Expected Delivery Date */}
          <div className="space-y-1">
            <Label>Expected Delivery Date *</Label>
            <Input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            />
          </div>

          {/* Delivery Address (optional) */}
          <div className="space-y-1">
            <Label>Delivery Address</Label>
            <Input
              placeholder="Site address or warehouse location"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          {/* Terms & Conditions (optional) */}
          <div className="space-y-1">
            <Label>Terms & Conditions</Label>
            <Textarea
              rows={2}
              placeholder="Payment terms, delivery instructions, etc."
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !selectedQuotationId}
          >
            Create PO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
