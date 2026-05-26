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
import { procurementApi } from "@/api";
import { formatINR } from "@/lib/helpers";
import { Skeleton } from "@/components/ui/skeleton";

export function CreatePoDialog({ open, onOpenChange, onCreate, fetchPurchaseOrders }) {
  const [acceptedQuotations, setAcceptedQuotations] = useState([]);
  const [selectedQuotationId, setSelectedQuotationId] = useState("");
  const [quotation, setQuotation] = useState(null);
  const [associatedRfq, setAssociatedRfq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingQuotations, setFetchingQuotations] = useState(true);

  // Form fields
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");

  // Load accepted quotations
  useEffect(() => {
    if (open) {
      const fetchQuotations = async () => {
        setFetchingQuotations(true);
        try {
          const res = await procurementApi.getQuotations({
            status: "accepted",
          });
          setAcceptedQuotations(res.data?.data || []);
        } catch (err) {
          toast.error("Failed to load accepted quotations");
        } finally {
          setFetchingQuotations(false);
        }
      };
      fetchQuotations();
    }
  }, [open]);

  // When a quotation is selected, fetch its RFQ to get materialRequestId and projectId
  useEffect(() => {
    if (!selectedQuotationId) {
      setQuotation(null);
      setAssociatedRfq(null);
      return;
    }
    const quot = acceptedQuotations.find((q) => q._id === selectedQuotationId);
    if (quot) {
      setQuotation(quot);
      // Fetch associated RFQ
      const fetchRfq = async () => {
        try {
          const res = await procurementApi.getRfqById(quot.rfqId?._id);
          setAssociatedRfq(res.data?.data);
        } catch (err) {
          toast.error("Failed to load RFQ details for this quotation");
        }
      };
      fetchRfq();
    }
  }, [selectedQuotationId, acceptedQuotations]);

  const handleSubmit = async () => {
    if (!selectedQuotationId) {
      toast.error("Please select a quotation");
      return;
    }
    if (!expectedDeliveryDate) {
      toast.error("Expected delivery date is required");
      return;
    }
    if (!quotation || !associatedRfq) {
      toast.error("Quotation or RFQ details missing");
      return;
    }

    const items = quotation.items.map((item) => ({
      materialId: item.materialId,
      materialName: item.materialName,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    const payload = {
      materialRequestId: associatedRfq.materialRequestId?._id,
      projectId: associatedRfq.projectId,
      vendorId: quotation.vendorId?._id || quotation.vendorId,
      items,
      expectedDeliveryDate,
      deliveryAddress: deliveryAddress || undefined,
      termsAndConditions: termsAndConditions || undefined,
    };

    setLoading(true);
    const success = await onCreate(payload);
    setLoading(false);
    if (success) {
      await fetchPurchaseOrders();
      onOpenChange(false);
      // Reset form
      setSelectedQuotationId("");
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select an accepted quotation to convert into a PO.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          {/* Quotation selection */}
          <div className="space-y-1">
            <Label>Accepted Quotation *</Label>
            <Select
              value={selectedQuotationId}
              onValueChange={setSelectedQuotationId}
              disabled={fetchingQuotations}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    fetchingQuotations ? "Loading..." : "Choose quotation"
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

          {/* Preview selected quotation */}
          {selectedQuotation && (
            <div className="border rounded-md p-3 space-y-2 bg-muted/50">
              <p className="text-sm font-medium">Selected Quotation</p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span>{selectedQuotation.vendorId?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span>{formatINR(selectedQuotation.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span>
                    {new Date(
                      selectedQuotation.validUntil,
                    ).toLocaleDateString()}
                  </span>
                </div>
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

          {/* PO Form Fields */}
          <div className="space-y-1">
            <Label>Expected Delivery Date *</Label>
            <Input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-1">
            <Label>Delivery Address</Label>
            <Input
              placeholder="Site address or warehouse location"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>
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
