// src/components/procurement/QuotationCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { formatINR, formatDate } from "@/lib/helpers";

const statusColors = {
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
};

export function QuotationCard({
  quotation,
  canAccept,
  onAccept,
  onReject,
  onView,
}) {
  // Extract vendor name – could be under vendorId or vendor, or fallback to RFQ title
  const vendorName =
    quotation.vendorId?.name ||
    quotation.vendor?.name ||
    (quotation.rfqId?.title ? `RFQ: ${quotation.rfqId.title}` : "Vendor");

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">{vendorName}</p>
            <p className="text-xs text-muted-foreground">
              Valid until {formatDate(quotation.validUntil)}
            </p>
            {quotation.rfqId?.rfqNumber && (
              <p className="text-xs text-muted-foreground mt-1">
                {quotation.rfqId.rfqNumber}
              </p>
            )}
          </div>
          <Badge
            variant={statusColors[quotation.status]}
            className="capitalize max-h-min"
          >
            {quotation.status}
          </Badge>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Total Amount:</span>{" "}
          <span className="font-semibold">
            {formatINR(quotation.totalAmount)}
          </span>
        </div>
        {quotation.deliveryCharges > 0 && (
          <div className="text-xs text-muted-foreground">
            + {formatINR(quotation.deliveryCharges)} delivery
          </div>
        )}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(quotation)}
          >
            <Eye className="h-3 w-3 mr-1" /> Details
          </Button>
          {canAccept && quotation.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => onAccept(quotation._id)}
              >
                <Check className="h-3 w-3 mr-1" /> Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(quotation._id)}
              >
                <X className="h-3 w-3 mr-1" /> Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
