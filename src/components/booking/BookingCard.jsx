
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
//       maximumFractionDigits: 0, 
//     }).format(amount || 0);
//   };

//   return (
//     <Card
//       className="group transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer overflow-hidden"
//       onClick={() => onClick(booking._id)}
//     >
//       <CardContent className="p-4 space-y-4">
//         {/* ---- Header Section ---- */}
//         <div className="flex justify-between items-start">
//           <div>
//             <p className="font-bold text-lg text-foreground">
//               {booking.unitNumber || booking.flatSnapshot?.flatNumber}
//             </p>
//             <p className="text-xs text-muted-foreground font-medium">
//               {booking.projectId?.name}
//             </p>
//           </div>
//           <BookingStatusBadge status={booking.status} />
//         </div>
        
//         {/* ---- Professional Financial Summary Box ---- */}
//         <div className="bg-muted/30 border border-border/50 rounded-lg p-3 space-y-2">
          
//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground">Client Name</span>
//             <span className="font-medium text-foreground truncate max-w-[150px] text-right">
//               {booking.clientId?.name || "Self"}
//             </span>
//           </div>

//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground">Base Value</span>
//             <span className="font-medium text-foreground">
//               {formatCurrency(booking.flatSnapshot?.price)}
//             </span>
//           </div>
          
//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground flex items-center gap-1.5">
//               Taxes (GST) 
//               {booking.gstPercentage > 0 && (
//                 <span className="inline-flex items-center rounded bg-blue-50 px-1 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/20">
//                   {booking.gstPercentage}%
//                 </span>
//               )}
//             </span>
//             <span className="text-muted-foreground">
//               +{formatCurrency(booking.totalGstAmount || 0)}
//             </span>
//           </div>

//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground">Booking Amount</span>
//             <span className="text-foreground">{formatCurrency(booking.bookingAmount)}</span>
//           </div>
          
//           <div className="my-2 border-t border-border/70"></div>

//           <div className="flex justify-between text-sm">
//             <span className="font-medium text-muted-foreground">Total Paid</span>
//             <span className="font-semibold text-primary">
//               {formatCurrency(booking.totalPaid)}
//             </span>
//           </div>

//           {/* Remaining Amount ko as 'Balance Due' dikhaya hai */}
//           <div className="flex justify-between text-sm">
//             <span className="font-medium text-muted-foreground">Balance Due</span>
//             <span className="font-semibold text-destructive">
//               {formatCurrency(booking.remainingAmount)}
//             </span>
//           </div>
//         </div>

//         {/* ---- Footer Section ---- */}
//         <div className="flex justify-between items-end pt-1">
//           <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
//             <span>Booked: {formatDate(booking.createdAt)}</span>
//             <span>Ref: <span className="font-medium tracking-wide text-foreground/80">{booking.bookingReferenceNumber}</span></span>
//           </div>

//           <div className="flex items-center gap-1">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onEdit?.(booking);
//               }}
//               className="h-7 w-7 rounded hover:bg-muted"
//               title="Edit booking"
//             >
//               <Pencil className="h-3.5 w-3.5" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete?.(booking);
//               }}
//               className="h-7 w-7 rounded hover:bg-red-50 hover:text-destructive text-muted-foreground"
//               title="Soft delete booking"
//             >
//               <Trash2 className="h-3.5 w-3.5" />
//             </Button>
//           </div>
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
      maximumFractionDigits: 0, 
    }).format(amount || 0);
  };

  return (
    <Card
      className="group transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer overflow-hidden"
      onClick={() => onClick(booking._id)}
    >
      <CardContent className="p-4 space-y-4">
        {/* ---- Header Section ---- */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg text-foreground">
              {booking.unitNumber || booking.flatSnapshot?.flatNumber}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              {booking.projectId?.name}
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
        
        {/* ---- Professional Financial Summary Box ---- */}
        <div className="bg-muted/30 border border-border/50 rounded-lg p-3 space-y-2">
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Client Name</span>
            <span className="font-medium text-foreground truncate max-w-[150px] text-right">
              {booking.clientId?.name || "Self"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Value</span>
            <span className="font-medium text-foreground">
              {formatCurrency(booking.flatSnapshot?.price)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              Taxes (GST) 
              {booking.gstPercentage > 0 && (
                <span className="inline-flex items-center rounded bg-blue-50 px-1 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/20">
                  {booking.gstPercentage}%
                </span>
              )}
            </span>
            <span className="text-muted-foreground">
              +{formatCurrency(booking.totalGstAmount || 0)}
            </span>
          </div>

          {/* --- Sirf yahan label change kiya hai --- */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Booking Amount + GST</span>
            <span className="text-foreground">{formatCurrency(booking.bookingAmount)}</span>
          </div>
          
          <div className="my-2 border-t border-border/70"></div>

          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Total Paid</span>
            <span className="font-semibold text-primary">
              {formatCurrency(booking.totalPaid)}
            </span>
          </div>

          {/* Remaining Amount ko as 'Balance Due' dikhaya hai */}
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Balance Due</span>
            <span className="font-semibold text-destructive">
              {formatCurrency(booking.remainingAmount)}
            </span>
          </div>
        </div>

        {/* ---- Footer Section ---- */}
        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
            <span>Booked: {formatDate(booking.createdAt)}</span>
            <span>Ref: <span className="font-medium tracking-wide text-foreground/80">{booking.bookingReferenceNumber}</span></span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(booking);
              }}
              className="h-7 w-7 rounded hover:bg-muted"
              title="Edit booking"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(booking);
              }}
              className="h-7 w-7 rounded hover:bg-red-50 hover:text-destructive text-muted-foreground"
              title="Soft delete booking"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}