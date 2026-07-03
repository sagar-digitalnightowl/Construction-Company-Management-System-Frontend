
// src/components/booking/InstallmentTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InstallmentStatusBadge } from "./InstallmentStatusBadge";
import { formatDate } from "@/lib/helpers"; 
import { PAYMENT_MODE } from "@/data/constants/booking";

export function InstallmentTable({ installments, onPay, canPay }) {
  // Amount ko Indian format (₹ 8,00,000) mein convert karne ke liye helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!installments.length) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No installments found.
      </p>
    );
  }

  return (       
    <div className="rounded-lg border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>description</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Paid Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Mode</TableHead>
            <TableHead>Transaction ID</TableHead>
            {canPay && <TableHead className="w-24">Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments.map((inst, idx) => (
            <TableRow key={inst._id}>
              <TableCell>{inst.installmentNumber}</TableCell>
              <TableCell className="max-w-xs">{inst.description}</TableCell>
              <TableCell>
                {" "}
                {inst.dueDate
                  ? formatDate(inst.dueDate)
                  : "Not scheduled"}
              </TableCell>
              {/* formatCurrency lagaya gaya hai */}
              <TableCell>{formatCurrency(inst.amount)}</TableCell>
              <TableCell>{formatCurrency(inst.paidAmount)}</TableCell>
              <TableCell>
                <InstallmentStatusBadge status={inst.status} />
              </TableCell>
              <TableCell>
                {inst.paymentMode
                  ? PAYMENT_MODE[inst.paymentMode] || inst.paymentMode
                  : "-"}
              </TableCell>
              <TableCell>{inst.transactionId || "-"}</TableCell>
              {canPay && inst.status !== "paid" && (
                <TableCell>
                  <Button size="sm" onClick={() => onPay(inst)}>
                    Pay
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}