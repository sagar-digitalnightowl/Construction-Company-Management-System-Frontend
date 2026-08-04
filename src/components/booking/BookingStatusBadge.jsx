
import React from "react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  booked: { label: "Booked", variant: "default" },
  sold: { label: "Sold", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function BookingStatusBadge({ status }) {
  const statusInfo = statusConfig[status] || {
    label: status,
    variant: "secondary",
  };

  return (
    <Badge variant={statusInfo.variant} className={'max-h-min text-nowrap'}>
      {statusInfo.label}
    </Badge>
  );
}