// // src/pages/booking/BookingDetail.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, FileText, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
// import { InstallmentTable } from "@/components/booking/InstallmentTable";
// import { PayInstallmentDialog } from "@/components/booking/PayInstallmentDialog";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { bookingApi } from "@/api";

// export default function BookingDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { current } = useAuthStore();
//   const canEdit = canMutate(current?.role, "booking");
//   const canPay =
//     canMutate(current?.role, "booking_payment");
//   const {
//     currentBooking: booking,
//     installments,
//     installmentSummary,
//     fetchBookingById,
//     fetchInstallmentsByBooking,
//     fetchInstallmentSummary,
//     payInstallment,
//     updateBookingStatus,
//     cancelBooking,
//     uploadAgreement,
//     approveBooking,
//     rejectBooking,
//     loading,
//   } = useBooking();
//   const [selectedInstallment, setSelectedInstallment] = useState(null);
//   const [payDialogOpen, setPayDialogOpen] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchBookingById(id);
//     }
//   }, [id]);

//   const handlePay = (inst) => {
//     setSelectedInstallment(inst);
//     setPayDialogOpen(true);
//   };

//   const handlePaySuccess = async (instId, data) => {
//     const result = await payInstallment(instId, data);
//     if (result) {
//       await fetchBookingById(id);
//     }
//     return !!result;
//   };

//   const handleUploadAgreement = async () => {
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = "application/pdf,image/*";
//     fileInput.onchange = async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;
//       setUploading(true);
//       const url = await uploadAgreement(id, file);
//       setUploading(false);
//       if (url) {
//         await fetchBookingById(id);
//         toast.success("Agreement uploaded");
//       }
//     };
//     fileInput.click();
//   };

//   const handleStatusUpdate = async (status) => {
//     await updateBookingStatus(id, { status });
//     await fetchBookingById(id);
//   };

//   const handleCancel = async () => {
//     const reason = prompt("Enter cancellation reason:");
//     if (reason) {
//       await cancelBooking(id, {
//         reason,
//         refundAdvance: confirm("Refund advance amount?"),
//       });
//       await fetchBookingById(id);
//     }
//   };

//   if (loading && !booking) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-8 w-48" />
//         <Skeleton className="h-64" />
//       </div>
//     );
//   }
//   if (!booking)
//     return <div className="text-center py-12">Booking not found</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => navigate("/bookings")}
//           className="-ml-2"
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" /> Back
//         </Button>

//         <div className="flex gap-2 flex-wrap">
//           {canEdit && (
//             <>
//               {/* Approval actions – only when pending */}
//               {booking.approvalStatus === "pending" && (
//                 <>
//                   <Button
//                     variant="default"
//                     onClick={() =>
//                       approveBooking(id, {
//                         notes: "Payment verified, booking confirmed",
//                       })
//                     }
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     onClick={() => {
//                       const reason = prompt("Rejection reason:");
//                       if (reason) rejectBooking(id, { reason });
//                     }}
//                   >
//                     Reject
//                   </Button>
//                 </>
//               )}

//               {/* Status actions – only when approved and not cancelled */}
//               {booking.approvalStatus === "approved" &&
//                 booking.status !== "cancelled" && (
//                   <>
//                     {booking.status === "booked" ? (
//                       <>
//                         <Button
//                           variant="outline"
//                           onClick={() => handleStatusUpdate("sold")}
//                         >
//                           Mark as Sold
//                         </Button>
//                         <Button variant="destructive" onClick={handleCancel}>
//                           Cancel Booking
//                         </Button>
//                       </>
//                     ) : booking.status === "sold" ? (
//                       <Button variant="outline" disabled>
//                         Sold
//                       </Button>
//                     ) : null}
//                   </>
//                 )}

//               {/* Agreement upload – only when approved (even if sold or booked) */}
//               {booking.approvalStatus === "approved" && (
//                 <Button
//                   variant="outline"
//                   onClick={handleUploadAgreement}
//                   disabled={uploading}
//                 >
//                   <FileText className="h-4 w-4 mr-1" /> Upload Agreement
//                 </Button>
//               )}

//               {/* View Agreement – always visible if document exists */}
//               {booking.agreementDocumentUrl && (
//                 <Button variant="outline" asChild>
//                   <a
//                     href={booking.agreementDocumentUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Download className="h-4 w-4 mr-1" /> View Agreement
//                   </a>
//                 </Button>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Booking Details</CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <span className="text-muted-foreground">
//                   Booking Reference:
//                 </span>{" "}
//                 {booking.bookingReferenceNumber}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Status:</span>{" "}
//                 <BookingStatusBadge
//                   status={booking.status}
//                   approvalStatus={booking.approvalStatus}
//                   showApproval
//                 />
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Project:</span>{" "}
//                 {booking.projectId?.name}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Client:</span>{" "}
//                 {booking.clientId?.name || "Self"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Unit Number:</span>{" "}
//                 {booking.unitNumber}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Floor:</span>{" "}
//                 {booking.floor}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Area:</span>{" "}
//                 {booking.area} sq ft
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Bedrooms:</span>{" "}
//                 {booking.bedrooms} BHK
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Bathrooms:</span>{" "}
//                 {booking.bathrooms}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Total Price:</span>{" "}
//                 {formatINR(booking.totalPrice)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Total Paid:</span>{" "}
//                 {formatINR(booking.totalPaid || 0)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Remaining:</span>{" "}
//                 {formatINR(
//                   (booking.totalPrice || 0) - (booking.totalPaid || 0),
//                 )}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Booking Date:</span>{" "}
//                 {formatDate(booking.createdAt)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Agreement Date:</span>{" "}
//                 {booking.agreementDate
//                   ? formatDate(booking.agreementDate)
//                   : "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Nominee:</span>{" "}
//                 {booking.nomineeName
//                   ? `${booking.nomineeName} (${booking.nomineeRelation})`
//                   : "—"}
//               </div>
//               {booking.cancellationReason && (
//                 <div className="col-span-2">
//                   <span className="text-muted-foreground">
//                     Cancellation Reason:
//                   </span>{" "}
//                   {booking.cancellationReason}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Payment Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Total Amount:</span>
//                 <span className="font-medium">
//                   {formatINR(
//                     installmentSummary?.totalAmount || booking.totalPrice,
//                   )}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Total Paid:</span>
//                 <span className="text-green-600">
//                   {formatINR(installmentSummary?.totalPaid || 0)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Pending:</span>
//                 <span className="text-yellow-600">
//                   {formatINR(installmentSummary?.pendingAmount || 0)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Overdue:</span>
//                 <span className="text-red-600">
//                   {formatINR(installmentSummary?.overdueAmount || 0)}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-lg font-semibold mb-3">Installments</h3>
//         <InstallmentTable
//           installments={installments}
//           onPay={handlePay}
//           canPay={canPay}

//         />
//       </div>

//       <PayInstallmentDialog
//         open={payDialogOpen}
//         onOpenChange={setPayDialogOpen}
//         installment={selectedInstallment}
//         onPay={handlePaySuccess}
//       />
//     </div>
//   );
// }

// src/pages/booking/BookingDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useBooking } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { InstallmentTable } from "@/components/booking/InstallmentTable";
import { PayInstallmentDialog } from "@/components/booking/PayInstallmentDialog";
import { formatINR, formatDate } from "@/lib/helpers";
import { bookingApi } from "@/api";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { current } = useAuthStore();
  const canEdit = canMutate(current?.role, "booking");
  const canPay = canMutate(current?.role, "booking_payment");
  const {
    currentBooking: booking,
    installments,
    installmentSummary,
    fetchBookingById,
    fetchInstallmentsByBooking,
    fetchInstallmentSummary,
    payInstallment,
    updateBookingStatus,
    cancelBooking,
    uploadAgreement,
    approveBooking,
    rejectBooking,
    loading,
  } = useBooking();
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookingById(id);
    }
  }, [id]);

  const handlePay = (inst) => {
    setSelectedInstallment(inst);
    setPayDialogOpen(true);
  };

  const handlePaySuccess = async (instId, data) => {
    const result = await payInstallment(instId, data);
    if (result) {
      await fetchBookingById(id);
    }
    return !!result;
  };

  const handleUploadAgreement = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf,image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      const url = await uploadAgreement(id, file);
      setUploading(false);
      if (url) {
        await fetchBookingById(id);
        toast.success("Agreement uploaded");
      }
    };
    fileInput.click();
  };

  const handleStatusUpdate = async (status) => {
    await updateBookingStatus(id, { status });
    await fetchBookingById(id);
  };

  const handleCancel = async () => {
    const reason = prompt("Enter cancellation reason:");
    if (reason) {
      await cancelBooking(id, {
        reason,
        refundAdvance: confirm("Refund advance amount?"),
      });
      await fetchBookingById(id);
    }
  };

  if (loading && !booking) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }
  if (!booking)
    return <div className="text-center py-12">Booking not found</div>;

  // Flattened snapshot for safer access
  const flat = booking.flatSnapshot || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/bookings")}
          className="-ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="flex gap-2 flex-wrap">
          {canEdit && (
            <>
              {booking.approvalStatus === "pending" && (
                <>
                  <Button
                    variant="default"
                    onClick={() =>
                      approveBooking(id, {
                        notes: "Payment verified, booking confirmed",
                      })
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const reason = prompt("Rejection reason:");
                      if (reason) rejectBooking(id, { reason });
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}

              {booking.approvalStatus === "approved" &&
                booking.status !== "cancelled" && (
                  <>
                    {booking.status === "booked" ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleStatusUpdate("sold")}
                        >
                          Mark as Sold
                        </Button>
                        <Button variant="destructive" onClick={handleCancel}>
                          Cancel Booking
                        </Button>
                      </>
                    ) : booking.status === "sold" ? (
                      <Button variant="outline" disabled>
                        Sold
                      </Button>
                    ) : null}
                  </>
                )}

              {booking.approvalStatus === "approved" && (
                <Button
                  variant="outline"
                  onClick={handleUploadAgreement}
                  disabled={uploading}
                >
                  <FileText className="h-4 w-4 mr-1" /> Upload Agreement
                </Button>
              )}

              {booking.agreementDocumentUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={booking.agreementDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-1" /> View Agreement
                  </a>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              {/* Original fields */}
              <div>
                <span className="text-muted-foreground">
                  Booking Reference:
                </span>{" "}
                {booking.bookingReferenceNumber}
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>{" "}
                <BookingStatusBadge
                  status={booking.status}
                  approvalStatus={booking.approvalStatus}
                  showApproval
                />
              </div>
              <div>
                <span className="text-muted-foreground">Project:</span>{" "}
                {booking.projectId?.name}
              </div>
              <div>
                <span className="text-muted-foreground">Buyer:</span>{" "}
                {booking.clientId?.name || "Self"}
              </div>

              {/* FIXED: use flatSnapshot */}
              <div>
                <span className="text-muted-foreground">Unit Number:</span>{" "}
                {flat.flatNumber || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Tower:</span>{" "}
                {flat.towerName || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Floor:</span>{" "}
                {flat.floor || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Area:</span>{" "}
                {flat.area ? `${flat.area} sq ft` : "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Bedrooms:</span>{" "}
                {flat.bedrooms ? `${flat.bedrooms} BHK` : "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Bathrooms:</span>{" "}
                {flat.bathrooms || "—"}
              </div>

              {/* New useful fields */}
              <div>
                <span className="text-muted-foreground">Facing:</span>{" "}
                {flat.features?.facing || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Balcony:</span>{" "}
                {flat.features?.balcony ? "Yes" : "No"}
              </div>
              <div>
                <span className="text-muted-foreground">Parking:</span>{" "}
                {flat.features?.parking ? "Yes" : "No"}
              </div>
              <div>
                <span className="text-muted-foreground">Furnishing:</span>{" "}
                {flat.features?.furnished
                  ? flat.features.furnished.replace("-", " ")
                  : "—"}
              </div>

              <div>
                <span className="text-muted-foreground">Total Price:</span>{" "}
                {formatINR(flat.price || 0)}
              </div>
              <div>
                <span className="text-muted-foreground">Total Paid:</span>{" "}
                {formatINR(booking.totalPaid || 0)}
              </div>
              <div>
                <span className="text-muted-foreground">Remaining:</span>{" "}
                {formatINR((flat.price || 0) - (booking.totalPaid || 0))}
              </div>
              <div>
                <span className="text-muted-foreground">Booking Date:</span>{" "}
                {formatDate(booking.createdAt)}
              </div>
              <div>
                <span className="text-muted-foreground">Booking Amount:</span>{" "}
                {formatINR(booking.bookingAmount || 0)}
              </div>
              <div>
                <span className="text-muted-foreground">Payment Status :</span>{" "}
                {booking.paymentStatus || "-"}
              </div>
              <div>
                <span className="text-muted-foreground">Agreement Date:</span>{" "}
                {booking.agreementDate
                  ? formatDate(booking.agreementDate)
                  : "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Nominee:</span>{" "}
                {booking.nomineeName
                  ? `${booking.nomineeName} (${booking.nomineeRelation})`
                  : "—"}
              </div>
              {booking.cancellationReason && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">
                    Cancellation Reason:
                  </span>{" "}
                  {booking.cancellationReason}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Flat Price:</span>
                <span className="font-medium">
                  {formatINR(flat.price || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Installment Plan Total:</span>
                <span>{formatINR(installmentSummary?.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid (Installments):</span>
                <span className="text-green-600">
                  {formatINR(installmentSummary?.totalPaid || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending (Installments):</span>
                <span className="text-yellow-600">
                  {formatINR(installmentSummary?.pendingAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Overdue (Installments):</span>
                <span className="text-red-600">
                  {formatINR(installmentSummary?.overdueAmount || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Installments</h3>
        <InstallmentTable
          installments={installments}
          onPay={handlePay}
          canPay={canPay}
        />
      </div>

      <PayInstallmentDialog
        open={payDialogOpen}
        onOpenChange={setPayDialogOpen}
        installment={selectedInstallment}
        onPay={handlePaySuccess}
      />
    </div>
  );
}
