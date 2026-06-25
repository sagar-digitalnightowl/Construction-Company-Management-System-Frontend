// src/pages/booking/PendingBookings.jsx
import React, { useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/hooks/useBooking";
import { formatINR, formatDate } from "@/lib/helpers";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function PendingBookings() {
  const navigate = useNavigate();
  const {
    pendingBookings,
    fetchPendingBookings,
    approveBooking,
    rejectBooking,
    loading,
  } = useBooking();

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const handleApprove = async (id) => {
    await approveBooking(id, { notes: "Approved by admin" });
    await fetchPendingBookings();
  };

  const handleReject = async (id) => {
    const reason = prompt("Rejection reason:");
    if (reason) {
      await rejectBooking(id, { reason });
      await fetchPendingBookings();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Approvals"
        title="Pending Booking Requests"
        description="Review and approve/reject buyer booking requests."
      />
      {pendingBookings.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="All booking requests have been processed."
        />
      ) : (
        <div className="space-y-3">
          {pendingBookings.map((b) => (
            <Card key={b._id} className="cursor-pointer" onClick={() =>  navigate(`/bookings/${b._id}`)}>
              <CardContent className="p-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <p className="font-medium">
                    {b.unitNumber} - {b.projectId?.name}
                  </p>
                  <p className="text-sm">Buyer: {b.clientId?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Booking Ref: {b.bookingReferenceNumber}
                  </p>
                  <p className="text-xs">
                    Advance Paid: {formatINR(b.advancePaid)} | Booked:{" "}
                    {formatDate(b.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={(e) =>{
                      e.stopPropagation()
                      handleApprove(b._id)
                    } 
                    }
                  >
                    <Check className="h-3 w-3 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReject(b._id)
                    }}
                  >
                    <X className="h-3 w-3 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
