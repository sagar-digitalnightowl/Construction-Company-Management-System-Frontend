
// // src/components/booking/BookingCard.jsx
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { BookingStatusBadge } from "./BookingStatusBadge";
// import { formatDate } from "@/lib/helpers"; 
// import { Pencil, Trash2 } from "lucide-react";
// import { Button } from "../ui/button";

// export function BookingCard({ booking, onClick, onEdit, onDelete }) {
//   // Amount ko Indian format (₹ 8,00,000) mein convert karne ke liye helper function
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0, // Point ke baad wale zero (.00) hatane ke liye
//     }).format(amount || 0);
//   };

//   return (
//     <Card
//       className="group transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
//       onClick={() => onClick(booking._id)}
//     >
//       <CardContent className="p-3 sm:p-5 space-y-4">
//         <div className="flex justify-between">
//           <div>
//             <p className="font-medium">{booking.unitNumber}</p>
//             <p className="text-xs text-muted-foreground">
//               {booking.projectId?.name}
//             </p>
//           </div>
//           <BookingStatusBadge
//             status={booking.status}
//             approvalStatus={booking.approvalStatus}
//             showApproval
//           />
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-muted-foreground">Buyer :</span>
//           <span>{booking.clientId?.name || "Self"}</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-muted-foreground">Total Price:</span>
//           <span>{formatCurrency(booking.flatSnapshot?.price)}</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-muted-foreground">Paid:</span>
//           <span>{formatCurrency(booking.totalPaid)}</span>
//         </div>
//         <div className="flex justify-between text-xs text-muted-foreground">
//           <span>Booked: {formatDate(booking.createdAt)}</span>
//           <span>Ref: {booking.bookingReferenceNumber}</span>
//         </div>

//         <div className="flex items-center justify-end gap-2 border-t border-border pt-3 -mb-1">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={(e) => {
//               e.stopPropagation();
//               onEdit?.(booking);
//             }}
//             className="p-2 rounded hover:bg-muted"
//             title="Edit booking"
//           >
//             <Pencil className="h-4 w-4" />
//           </Button>
//           <Button
//               variant="ghost"
//               size="icon"
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete?.(booking);
//             }}
//             className="p-1 rounded hover:bg-muted text-destructive"
//             title="Soft delete booking"
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }




// src/components/booking/BookingCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { formatDate } from "@/lib/helpers"; 
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export function BookingCard({ booking, onClick, onEdit, onDelete }) {
  // Amount ko Indian format (₹ 8,00,000) mein convert karne ke liye helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0, // Point ke baad wale zero (.00) hatane ke liye
    }).format(amount || 0);
  };

  return (
    <Card
      className="group transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      onClick={() => onClick(booking._id)}
    >
      <CardContent className="p-3 sm:p-5 space-y-4">
        <div className="flex justify-between">
          <div>
            {/* Note: JSON data mein unit number flatSnapshot.flatNumber ke andar hai, agar ye UI pe na dikhe toh isko {booking.flatSnapshot?.flatNumber} kar lijiyega */}
            <p className="font-medium">{booking.unitNumber || booking.flatSnapshot?.flatNumber}</p>
            <p className="text-xs text-muted-foreground">
              {booking.projectId?.name}
            </p>
          </div>
          
          {/* Yahan se showApproval aur approvalStatus hata diya gaya hai */}
          <BookingStatusBadge
            status={booking.status}
          />
          
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Buyer :</span>
          <span>{booking.clientId?.name || "Self"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Price:</span>
          <span>{formatCurrency(booking.flatSnapshot?.price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Paid:</span>
          <span>{formatCurrency(booking.totalPaid)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Booked: {formatDate(booking.createdAt)}</span>
          <span>Ref: {booking.bookingReferenceNumber}</span>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3 -mb-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(booking);
            }}
            className="p-2 rounded hover:bg-muted"
            title="Edit booking"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
              variant="ghost"
              size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(booking);
            }}
            className="p-1 rounded hover:bg-muted text-destructive"
            title="Soft delete booking"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}