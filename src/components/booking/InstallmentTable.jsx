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
import { formatINR, formatDate } from "@/lib/helpers";
import { PAYMENT_MODE } from "@/data/constants/booking";

export function InstallmentTable({ installments, onPay, canPay }) {
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
            <TableHead>Milestone</TableHead>
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
              <TableCell className="max-w-xs">{inst.milestoneName}</TableCell>
              <TableCell>
                {" "}
                {inst.dueDate
                  ? formatDate(inst.dueDate)
                  : "Not scheduled"}
              </TableCell>
              <TableCell>{formatINR(inst.amount)}</TableCell>
              <TableCell>{formatINR(inst.paidAmount || 0)}</TableCell>
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
