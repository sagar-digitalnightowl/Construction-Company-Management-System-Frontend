// src/pages/vendor/VendorQuotations.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatINR } from "@/lib/helpers";
import { procurementApi } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
};

export function VendorQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const res = await procurementApi.getQuotations();
      setQuotations(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (quotations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            You haven't submitted any quotations yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {quotations.map((q) => (
        <Card key={q._id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  RFQ: {q.rfqId?.title || q.rfqId}
                </p>
                <p className="text-xs text-muted-foreground">
                  Submitted: {formatDate(q.createdAt)}
                </p>
              </div>
              <Badge variant={statusColors[q.status]}>{q.status}</Badge>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total Amount:</span>{" "}
              {formatINR(q.totalAmount)}
            </div>
            {q.validUntil && (
              <div className="text-xs text-muted-foreground">
                Valid until: {formatDate(q.validUntil)}
              </div>
            )}
            {q.status === "accepted" && (
              <div className="mt-2 text-xs text-green-600">
                Quotation accepted! Purchase order will be issued.
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
