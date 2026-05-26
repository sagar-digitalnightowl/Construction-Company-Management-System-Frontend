// src/components/vendor/SubmitQuotationDialog.jsx
import React, { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";

export function SubmitQuotationDialog({
  open,
  onOpenChange,
  rfqId,
  onSuccess,
}) {
  const [rfq, setRfq] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    validUntil: "",
    deliveryCharges: 0,
    notes: "",
  });

  useEffect(() => {
    if (open && rfqId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const rfqRes = await procurementApi.getRfqById(rfqId);
          const rfqData = rfqRes.data?.data;
          if (!rfqData) throw new Error("RFQ not found");
          setRfq(rfqData);

          // Extract material request details from rfqData.materialRequestId
          const mr = rfqData.materialRequestId;
          if (mr) {
            // Create a single item from the material request
            setItems([
              {
                materialId: mr.materialId,
                materialName: mr.materialName,
                quantity: mr.quantity,
                unit: mr.unit,
                unitPrice: "",
                totalPrice: 0,
              },
            ]);
          } else if (
            rfqData.materialRequestItems &&
            rfqData.materialRequestItems.length
          ) {
            // If multiple items are present (future case)
            setItems(
              rfqData.materialRequestItems.map((item) => ({
                materialId: item.materialId,
                materialName: item.materialName,
                quantity: item.quantity,
                unit: item.unit,
                unitPrice: "",
                totalPrice: 0,
              })),
            );
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to load RFQ details");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, rfqId]);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "unitPrice") {
      const qty = Number(newItems[index].quantity);
      const price = Number(value);
      newItems[index].totalPrice = qty * price;
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0,
    );
    return subtotal + Number(form.deliveryCharges);
  };

  const handleSubmit = async () => {
    if (!form.validUntil) {
      toast.error("Valid until date is required");
      return;
    }
    const hasPrices = items.every(
      (item) => item.unitPrice && Number(item.unitPrice) > 0,
    );
    if (!hasPrices) {
      toast.error("Please provide unit price for all items");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rfqId: rfq._id,
        items: items.map((item) => ({
          materialId: item.materialId,
          materialName: item.materialName,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: Number(item.unitPrice),
          totalPrice: item.totalPrice,
        })),
        validUntil: form.validUntil,
        deliveryCharges: Number(form.deliveryCharges),
        totalAmount: calculateTotal(),
        notes: form.notes,
      };
      const res = await procurementApi.submitQuotation(payload);
      if (res.data?.success) {
        toast.success("Quotation submitted successfully");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(res.data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quotation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="py-8 space-y-4">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!rfq) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Quotation</DialogTitle>
          <p className="text-sm text-muted-foreground">
            RFQ: {rfq.rfqNumber} - {rfq.title}
          </p>
          <p className="text-xs text-muted-foreground">
            Submission Deadline: {formatDate(rfq.submissionDeadline)}
          </p>
        </DialogHeader>
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No items to quote
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Items to Quote</Label>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-2 py-1 text-left">Material</th>
                      <th className="px-2 py-1 text-right">Qty</th>
                      <th className="px-2 py-1 text-right">Unit Price (₹)</th>
                      <th className="px-2 py-1 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-1">{item.materialName}</td>
                        <td className="px-2 py-1 text-right">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-2 py-1 ">
                          <Input
                            type="number"
                            step="any"
                            placeholder="Price"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(idx, "unitPrice", e.target.value)
                            }
                            className="w-28 text-right"
                          />
                        </td>
                        <td className="px-2 py-1 text-right font-medium">
                          ₹{(item.totalPrice || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Valid Until *</Label>
              <Input
                type="date"
                value={form.validUntil}
                onChange={(e) =>
                  setForm({ ...form, validUntil: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Delivery Charges (₹)</Label>
              <Input
                type="number"
                step="any"
                placeholder="0"
                value={form.deliveryCharges}
                onChange={(e) =>
                  setForm({ ...form, deliveryCharges: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Notes (optional)</Label>
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Delivery terms, validity conditions, etc."
            />
          </div>

          <div className="border-t pt-2 space-y-1 text-right">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>
                ₹{items.reduce((s, i) => s + (i.totalPrice || 0), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Charges:</span>
              <span>₹{Number(form.deliveryCharges).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total Amount:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            Submit Quotation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
