// src/pages/booking/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingCard } from "@/components/booking/BookingCard";
import { useBooking } from "@/hooks/useBooking";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingFormDialog } from "@/components/booking/BookingFormDialog";

export default function MyBookings() {
  const { myBookings, fetchMyBookings, loading } = useBooking();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Portfolio"
        title="My Bookings"
        description="View all your booked units and payment progress."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Booking
          </Button>
        }
      />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : myBookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="You haven't booked any units."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {myBookings.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              onClick={(id) => navigate(`/my-bookings/${id}`)}
            />
          ))}
        </div>
      )}

      <BookingFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        editBooking={null} 
        onSuccess={() => fetchMyBookings()}
      />
    </div>
  );
}
