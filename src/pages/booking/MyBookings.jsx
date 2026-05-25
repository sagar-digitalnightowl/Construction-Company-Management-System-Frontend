// src/pages/booking/MyBookings.jsx
import React, { useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingCard } from "@/components/booking/BookingCard";
import { useBooking } from "@/hooks/useBooking";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const { myBookings, fetchMyBookings, loading } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Portfolio"
        title="My Bookings"
        description="View all your booked units and payment progress."
      />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myBookings.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              onClick={(id) => navigate(`/my-bookings/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
