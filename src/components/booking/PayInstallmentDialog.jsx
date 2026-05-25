// src/components/booking/PayInstallmentDialog.jsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatINR } from "@/lib/helpers";
import { toast } from "sonner";
import { PAYMENT_MODE } from "@/data/constants/booking";

export function PayInstallmentDialog({
  open,
  onOpenChange,
  installment,
  onPay,
}) {
  const [form, setForm] = useState({
    amount: installment?.amount || 0,
    paymentMode: "",
    transactionId: "",
    chequeNumber: "",
    bankName: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (installment) {
      setForm({
        amount: installment.amount,
        paymentMode: "",
        transactionId: "",
        chequeNumber: "",
        bankName: "",
        remarks: "",
      });
    }
  }, [installment]);

  const handleSubmit = async () => {
    if (!form.paymentMode) {
      toast.error("Select payment mode");
      return;
    }
    if (form.amount <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    if (
      form.paymentMode === "Cheque" &&
      (!form.chequeNumber || !form.bankName)
    ) {
      toast.error("Cheque number and bank name required");
      return;
    }
    if (
      (form.paymentMode === "Bank Transfer" || form.paymentMode === "Card") &&
      !form.transactionId
    ) {
      toast.error("Transaction ID required");
      return;
    }
    setLoading(true);
    const success = await onPay(installment._id, form);
    setLoading(false);
    if (success) onOpenChange(false);
  };

  if (!installment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Pay Installment #{installment.installmentNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Milestone:</span>{" "}
              {installment.milestoneName}
            </div>
            <div>
              <span className="text-muted-foreground">Due Date:</span>{" "}
              {new Date(installment.dueDate).toLocaleDateString()}
            </div>
            <div>
              <span className="text-muted-foreground">Total Amount:</span>{" "}
              {formatINR(installment.amount)}
            </div>
            <div>
              <span className="text-muted-foreground">Paid So Far:</span>{" "}
              {formatINR(installment.paidAmount || 0)}
            </div>
            <div>
              <span className="text-muted-foreground">Remaining:</span>{" "}
              {formatINR(installment.amount - (installment.paidAmount || 0))}
            </div>
          </div>
          <div>
            <Label>Amount to Pay *</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
              max={installment.amount - (installment.paidAmount || 0)}
            />
          </div>
          <div>
            <Label>Payment Mode *</Label>
            <Select
              value={form.paymentMode}
              onValueChange={(v) => setForm({ ...form, paymentMode: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PAYMENT_MODE).map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.paymentMode === "Cheque" && (
            <>
              <div>
                <Label>Cheque Number *</Label>
                <Input
                  value={form.chequeNumber}
                  onChange={(e) =>
                    setForm({ ...form, chequeNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Bank Name *</Label>
                <Input
                  value={form.bankName}
                  onChange={(e) =>
                    setForm({ ...form, bankName: e.target.value })
                  }
                />
              </div>
            </>
          )}
          {(form.paymentMode === "Bank Transfer" ||
            form.paymentMode === "Card") && (
            <div>
              <Label>Transaction ID *</Label>
              <Input
                value={form.transactionId}
                onChange={(e) =>
                  setForm({ ...form, transactionId: e.target.value })
                }
              />
            </div>
          )}
          <div>
            <Label>Remarks</Label>
            <Textarea
              rows={2}
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
