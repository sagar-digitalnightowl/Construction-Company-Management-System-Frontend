import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/helpers";

export default function BookingPaymentModal({
  open,
  onOpenChange,
  bookingPayment,
}) {
  if (!bookingPayment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Booking ID:</span>{" "}
              {bookingPayment.bookingId}
            </div>
            <div>
              <span className="font-medium">Client:</span>{" "}
              {bookingPayment.clientName}
            </div>
            <div>
              <span className="font-medium">Flat:</span>{" "}
              {bookingPayment.flatNumber}
            </div>
            <div>
              <span className="font-medium">Total Paid:</span>{" "}
              {formatINR(bookingPayment.totalPaid)}
            </div>
            <div>
              <span className="font-medium">Remaining:</span>{" "}
              {formatINR(bookingPayment.remainingAmount)}
            </div>
            <div>
              <span className="font-medium">Payment Status:</span>{" "}
              <Badge>{bookingPayment.paymentStatus}</Badge>
            </div>
            <div>
              <span className="font-medium">Model:</span>{" "}
              {bookingPayment.paymentModel}
            </div>
          </div>

          <h4 className="font-semibold mt-4">Installments</h4>
          {bookingPayment.paymentDetails?.length ? (
            <table className="w-full border">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Paid</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Cleared</th>
                  <th className="p-2 text-left">Uncleared</th>
                  <th className="p-2 text-left">Mode</th>
                </tr>
              </thead>
              <tbody>
                {bookingPayment.paymentDetails.map((inst, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{inst.installmentNumber}</td>
                    <td className="p-2">
                      {inst.dueDate ? formatDate(inst.dueDate) : "—"}
                    </td>
                    <td className="p-2">{formatINR(inst.amount)}</td>
                    <td className="p-2">{formatINR(inst.paidAmount)}</td>
                    <td className="p-2">
                      <Badge>{inst.status}</Badge>
                    </td>
                    <td className="p-2">{formatINR(inst.clearedAmount)}</td>
                    <td className="p-2">{formatINR(inst.unclearedAmount)}</td>
                    <td className="p-2 capitalize">{inst.paymentMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground">No installment details.</p>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4">
            {bookingPayment.businessCode && (
              <div>
                <span className="font-medium">Business Code:</span>{" "}
                {bookingPayment.businessCode}
              </div>
            )}
            {bookingPayment.businessName && (
              <div>
                <span className="font-medium">Business Name:</span>{" "}
                {bookingPayment.businessName}
              </div>
            )}
            {bookingPayment.teamManager && (
              <div>
                <span className="font-medium">Team Manager:</span>{" "}
                {bookingPayment.teamManager}
              </div>
            )}
            {bookingPayment.kycNumber && (
              <div>
                <span className="font-medium">KYC:</span>{" "}
                {bookingPayment.kycNumber}
              </div>
            )}
            {bookingPayment.serviceTaxPaid > 0 && (
              <div>
                <span className="font-medium">Service Tax:</span>{" "}
                {formatINR(bookingPayment.serviceTaxPaid)}
              </div>
            )}
            {bookingPayment.gstPaid > 0 && (
              <div>
                <span className="font-medium">GST:</span>{" "}
                {formatINR(bookingPayment.gstPaid)}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
