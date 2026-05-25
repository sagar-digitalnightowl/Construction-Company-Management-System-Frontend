// src/components/booking/BookingStatusBadge.jsx
import React from "react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  booked: { label: "Booked", variant: "default" },
  sold: { label: "Sold", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const approvalConfig = {
  pending: { label: "Pending Approval", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function BookingStatusBadge({
  status,
  approvalStatus,
  showApproval = false,
}) {
  const statusInfo = statusConfig[status] || {
    label: status,
    variant: "secondary",
  };
  const approvalInfo = approvalConfig[approvalStatus] || {
    label: approvalStatus,
    variant: "secondary",
  };

  if (showApproval && approvalStatus && approvalStatus !== "approved") {
    return <Badge className={'max-h-min text-nowrap'} variant={approvalInfo.variant}>{approvalInfo.label}</Badge>;
  }
  return <Badge variant={statusInfo.variant} className={'max-h-min text-nowrap'}>{statusInfo.label}</Badge>;
}
