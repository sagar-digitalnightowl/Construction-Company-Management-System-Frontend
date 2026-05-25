// src/components/booking/InstallmentStatusBadge.jsx
import React from "react";
import { Badge } from "@/components/ui/badge";

const config = {
  pending: { label: "Pending", variant: "secondary" },
  partial: { label: "Partial", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  overdue: { label: "Overdue", variant: "destructive" },
};

export function InstallmentStatusBadge({ status }) {
  const { label, variant } = config[status] || {
    label: status,
    variant: "secondary",
  };
  return <Badge variant={variant}>{label}</Badge>;
}
