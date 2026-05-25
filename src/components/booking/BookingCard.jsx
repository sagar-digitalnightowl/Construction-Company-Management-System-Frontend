// src/components/booking/BookingCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { formatINR, formatDate } from "@/lib/helpers";

export function BookingCard({ booking, onClick }) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition"
      onClick={() => onClick(booking._id)}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">{booking.unitNumber}</p>
            <p className="text-xs text-muted-foreground">
              {booking.projectId?.name}
            </p>
          </div>
          <BookingStatusBadge
            status={booking.status}
            approvalStatus={booking.approvalStatus}
            showApproval
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Client:</span>
          <span>{booking.clientId?.name || "Self"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Price:</span>
          <span>{formatINR(booking.totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Paid:</span>
          <span>{formatINR(booking.totalPaid || 0)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Booked: {formatDate(booking.createdAt)}</span>
          <span>Ref: {booking.bookingReferenceNumber}</span>
        </div>
      </CardContent>
    </Card>
  );
}
