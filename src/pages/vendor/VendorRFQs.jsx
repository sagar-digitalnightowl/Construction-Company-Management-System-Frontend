// src/pages/vendor/VendorRFQs.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, FileText, Send } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { procurementApi } from "@/api";
import { SubmitQuotationDialog } from "@/components/vendor/SubmitQuotationDialog";
import { Skeleton } from "@/components/ui/skeleton";

export function VendorRFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    setLoading(true);
    try {
      const res = await procurementApi.getRfqs({ status: "sent" });
      setRfqs(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuotation = (rfqId) => {
    setSelectedRfqId(rfqId);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (rfqs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No open RFQs available at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rfqs.map((rfq) => (
          <Card key={rfq._id} className="hover:shadow-md transition">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="font-semibold">{rfq.title}</p>
                <p className="text-xs text-muted-foreground">{rfq.rfqNumber}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {rfq.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Deadline: {formatDate(rfq.submissionDeadline)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="h-3 w-3" />
                <span>{rfq.invitedVendors?.length || 0} vendors invited</span>
              </div>
              <Button
                className="w-full mt-2"
                size="sm"
                onClick={() => handleSubmitQuotation(rfq._id)}
              >
                <Send className="h-3 w-3 mr-2" /> Submit Quotation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedRfqId && (
        <SubmitQuotationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          rfqId={selectedRfqId}
          onSuccess={fetchRFQs}
        />
      )}
    </>
  );
}
