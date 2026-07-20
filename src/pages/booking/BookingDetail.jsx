
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
// import { formatDate } from "@/lib/helpers"; 
// import { bookingApi } from "@/api";

// export default function BookingDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { current } = useAuthStore();
//   const canEdit = canMutate(current?.role, "booking");
//   const canPay = canMutate(current?.role, "booking_payment");
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

//   // Helper function for Indian Currency Formatting (₹ 8,00,000)
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0, 
//     }).format(amount || 0);
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

//   // Flattened snapshot for safer access
//   const flat = booking.flatSnapshot || {};

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

//               {booking.approvalStatus === "approved" && (
//                 <Button
//                   variant="outline"
//                   onClick={handleUploadAgreement}
//                   disabled={uploading}
//                 >
//                   <FileText className="h-4 w-4 mr-1" /> Upload Agreement
//                 </Button>
//               )}

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
//               {/* Original fields */}
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
//                 <span className="text-muted-foreground">Buyer:</span>{" "}
//                 {booking.clientId?.name || "Self"}
//               </div>

//               {/* FIXED: use flatSnapshot */}
//               <div>
//                 <span className="text-muted-foreground">Unit Number:</span>{" "}
//                 {flat.flatNumber || "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Tower:</span>{" "}
//                 {flat.towerName || "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Floor:</span>{" "}
//                 {flat.floor || "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Area:</span>{" "}
//                 {flat.area ? `${flat.area} sq ft` : "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Bedrooms:</span>{" "}
//                 {flat.bedrooms ? `${flat.bedrooms} BHK` : "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Bathrooms:</span>{" "}
//                 {flat.bathrooms || "—"}
//               </div>

//               {/* New useful fields */}
//               <div>
//                 <span className="text-muted-foreground">Facing:</span>{" "}
//                 {flat.features?.facing || "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Balcony:</span>{" "}
//                 {flat.features?.balcony ? "Yes" : "No"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Parking:</span>{" "}
//                 {flat.features?.parking ? "Yes" : "No"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Furnishing:</span>{" "}
//                 {flat.features?.furnished
//                   ? flat.features.furnished.replace("-", " ")
//                   : "—"}
//               </div>

//               {/* Updated amounts with formatCurrency */}
//               <div>
//                 <span className="text-muted-foreground">Total Price:</span>{" "}
//                 {formatCurrency(flat.price)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Total Paid:</span>{" "}
//                 {formatCurrency(booking.totalPaid)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Remaining:</span>{" "}
//                 {formatCurrency((flat.price || 0) - (booking.totalPaid || 0))}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Booking Date:</span>{" "}
//                 {formatDate(booking.createdAt)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Booking Amount:</span>{" "}
//                 {formatCurrency(booking.bookingAmount)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Payment Status :</span>{" "}
//                 {booking.paymentStatus || "-"}
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
//                 <span>Flat Price:</span>
//                 <span className="font-medium">
//                   {formatCurrency(flat.price)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Installment Plan Total:</span>
//                 <span>{formatCurrency(installmentSummary?.totalAmount)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Total Paid (Installments):</span>
//                 <span className="text-green-600">
//                   {formatCurrency(installmentSummary?.totalPaid)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Pending (Installments):</span>
//                 <span className="text-yellow-600">
//                   {formatCurrency(installmentSummary?.pendingAmount)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Overdue (Installments):</span>
//                 <span className="text-red-600">
//                   {formatCurrency(installmentSummary?.overdueAmount)}
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
// import { formatDate } from "@/lib/helpers"; 
// import { bookingApi } from "@/api";

// export default function BookingDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { current } = useAuthStore();
//   const canEdit = canMutate(current?.role, "booking");
//   const canPay = canMutate(current?.role, "booking_payment");
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

//   // Helper function for Indian Currency Formatting (₹ 8,00,000)
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0, 
//     }).format(amount || 0);
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

//   // Flattened snapshot for safer access
//   const flat = booking.flatSnapshot || {};

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

//               {booking.approvalStatus === "approved" && (
//                 <Button
//                   variant="outline"
//                   onClick={handleUploadAgreement}
//                   disabled={uploading}
//                 >
//                   <FileText className="h-4 w-4 mr-1" /> Upload Agreement
//                 </Button>
//               )}

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
//               {/* Original fields */}
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
//                 <span className="text-muted-foreground">Buyer:</span>{" "}
//                 {booking.clientId?.name || "Self"}
//               </div>

//               {/* FIXED: use flatSnapshot */}
//               <div>
//                 <span className="text-muted-foreground">Unit Number:</span>{" "}
//                 {flat.flatNumber || "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Tower:</span>{" "}
//                 {flat.towerName || "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Floor:</span>{" "}
//                 {flat.floor || "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Area:</span>{" "}
//                 {flat.area ? `${flat.area} sq ft` : "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Bedrooms:</span>{" "}
//                 {flat.bedrooms ? `${flat.bedrooms} BHK` : "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Bathrooms:</span>{" "}
//                 {flat.bathrooms || "—"}
//               </div>

//               {/* New useful fields */}
//               <div>
//                 <span className="text-muted-foreground">Facing:</span>{" "}
//                 {flat.features?.facing || "—"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Balcony:</span>{" "}
//                 {flat.features?.balcony ? "Yes" : "No"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Parking:</span>{" "}
//                 {flat.features?.parking ? "Yes" : "No"}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Furnishing:</span>{" "}
//                 {flat.features?.furnished
//                   ? flat.features.furnished.replace("-", " ")
//                   : "—"}
//               </div>

//               {/* === UPDATED GST & AMOUNT FIELDS === */}
//               <div>
//                 <span className="text-muted-foreground">Base Price:</span>{" "}
//                 {formatCurrency(flat.price)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">GST ({booking.gstPercentage || 0}%):</span>{" "}
//                 {formatCurrency(booking.totalGstAmount || 0)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Total Price (Inc. GST):</span>{" "}
//                 {formatCurrency((flat.price || 0) + (booking.totalGstAmount || 0))}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Total Paid:</span>{" "}
//                 {formatCurrency(booking.totalPaid)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Remaining Amount:</span>{" "}
//                 {formatCurrency(
//                   booking.remainingAmount ?? 
//                   ((flat.price || 0) + (booking.totalGstAmount || 0) - (booking.totalPaid || 0))
//                 )}
//               </div>
//               {/* ================================== */}

//               <div>
//                 <span className="text-muted-foreground">Booking Date:</span>{" "}
//                 {formatDate(booking.createdAt)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Booking Amount:</span>{" "}
//                 {formatCurrency(booking.bookingAmount)}
//               </div>
//               <div>
//                 <span className="text-muted-foreground">Payment Status :</span>{" "}
//                 {booking.paymentStatus || "-"}
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
//                 <span>Base Price:</span>
//                 <span className="font-medium">
//                   {formatCurrency(flat.price)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Installment Plan Total:</span>
//                 <span>{formatCurrency(installmentSummary?.totalAmount)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Total Paid (Installments):</span>
//                 <span className="text-green-600">
//                   {formatCurrency(installmentSummary?.totalPaid)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Pending (Installments):</span>
//                 <span className="text-yellow-600">
//                   {formatCurrency(installmentSummary?.pendingAmount)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Overdue (Installments):</span>
//                 <span className="text-red-600">
//                   {formatCurrency(installmentSummary?.overdueAmount)}
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







// // src/pages/booking/BookingDetail.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, FileText, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
// import { InstallmentTable } from "@/components/booking/InstallmentTable";
// import { PayInstallmentDialog } from "@/components/booking/PayInstallmentDialog";
// import { formatDate } from "@/lib/helpers"; 

// export default function BookingDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { current } = useAuthStore();
//   const canEdit = canMutate(current?.role, "booking");
//   const canPay = canMutate(current?.role, "booking_payment");
//   const {
//     currentBooking: booking,
//     installments,
//     installmentSummary,
//     fetchBookingById,
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

//   // Helper function for Indian Currency Formatting (₹ 8,00,000)
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0, 
//     }).format(amount || 0);
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

//   // Flattened snapshot for safer access
//   const flat = booking.flatSnapshot || {};

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
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

//               {booking.approvalStatus === "approved" && (
//                 <Button
//                   variant="outline"
//                   onClick={handleUploadAgreement}
//                   disabled={uploading}
//                 >
//                   <FileText className="h-4 w-4 mr-1" /> Upload Agreement
//                 </Button>
//               )}

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
        
//         {/* --- LEFT COLUMN: Property & Client Details --- */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Booking Details</CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
//               <div>
//                 <span className="text-muted-foreground block mb-1">Booking Reference</span>
//                 <span className="font-medium tracking-wide">{booking.bookingReferenceNumber}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Status</span>
//                 <BookingStatusBadge
//                   status={booking.status}
//                   approvalStatus={booking.approvalStatus}
//                   showApproval
//                 />
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Project</span>
//                 <span className="font-medium">{booking.projectId?.name}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Client Name</span>
//                 <span className="font-medium">{booking.clientId?.name || "Self"}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Unit Number</span>
//                 <span className="font-medium">{flat.flatNumber || "—"}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Tower & Floor</span>
//                 <span className="font-medium">{flat.towerName || "—"} (Floor {flat.floor || "—"})</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Area</span>
//                 <span className="font-medium">{flat.area ? `${flat.area} sq ft` : "—"}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Configuration</span>
//                 <span className="font-medium">
//                   {flat.bedrooms ? `${flat.bedrooms} BHK` : "—"} ({flat.bathrooms ? `${flat.bathrooms} Baths` : "—"})
//                 </span>
//               </div>
              
//               {/* Unit Features */}
//               <div className="col-span-2 mt-2 pt-4 border-t grid grid-cols-4 gap-4">
//                 <div>
//                   <span className="text-muted-foreground block text-xs mb-1">Facing</span>
//                   <span className="font-medium text-xs">{flat.features?.facing || "—"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block text-xs mb-1">Balcony</span>
//                   <span className="font-medium text-xs">{flat.features?.balcony ? "Yes" : "No"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block text-xs mb-1">Parking</span>
//                   <span className="font-medium text-xs">{flat.features?.parking ? "Yes" : "No"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block text-xs mb-1">Furnishing</span>
//                   <span className="font-medium text-xs capitalize">
//                     {flat.features?.furnished ? flat.features.furnished.replace("-", " ") : "—"}
//                   </span>
//                 </div>
//               </div>

//               <div className="col-span-2 mt-2 pt-4 border-t grid grid-cols-2 gap-4">
//                 <div>
//                   <span className="text-muted-foreground block mb-1">Booking Date</span>
//                   <span className="font-medium">{formatDate(booking.createdAt)}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block mb-1">Agreement Date</span>
//                   <span className="font-medium">{booking.agreementDate ? formatDate(booking.agreementDate) : "—"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block mb-1">Payment Status</span>
//                   <span className="font-medium capitalize">{booking.paymentStatus || "-"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block mb-1">Nominee</span>
//                   <span className="font-medium">
//                     {booking.nomineeName ? `${booking.nomineeName} (${booking.nomineeRelation})` : "—"}
//                   </span>
//                 </div>
//               </div>

//               {booking.cancellationReason && (
//                 <div className="col-span-2 p-3 mt-2 bg-red-50 text-red-800 rounded-md border border-red-100">
//                   <span className="font-semibold block mb-1">Cancellation Reason:</span> 
//                   {booking.cancellationReason}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* --- RIGHT COLUMN: Consolidated Financial Summary --- */}
//         <div className="space-y-6">
//           <Card className="border-primary/20 shadow-sm">
//             <CardHeader className="bg-muted/30 border-b pb-4">
//               <CardTitle>Financial Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 pt-5 text-sm">
              
//               {/* Base Calculation */}
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Base Value:</span>
//                   <span className="font-medium">{formatCurrency(flat.price)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground flex items-center gap-1.5">
//                     Taxes (GST)
//                     {booking.gstPercentage > 0 && (
//                       <span className="inline-flex items-center rounded bg-blue-50 px-1 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/20">
//                         {booking.gstPercentage}%
//                       </span>
//                     )}
//                   </span>
//                   <span className="font-medium">+{formatCurrency(booking.totalGstAmount || 0)}</span>
//                 </div>
//                 <div className="flex justify-between pt-2 border-t text-base">
//                   <span className="font-semibold text-foreground">Total Value:</span>
//                   <span className="font-semibold text-foreground">
//                     {formatCurrency((flat.price || 0) + (booking.totalGstAmount || 0))}
//                   </span>
//                 </div>
//               </div>

//               <div className="border-b border-dashed"></div>

//               {/* Payments & Balance */}
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Booking Amount:</span>
//                   <span>{formatCurrency(booking.bookingAmount)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-medium text-muted-foreground">Total Paid:</span>
//                   <span className="font-semibold text-primary">{formatCurrency(booking.totalPaid)}</span>
//                 </div>
//                 <div className="flex justify-between pt-2 border-t text-base">
//                   <span className="font-semibold text-foreground">Balance Due:</span>
//                   <span className="font-bold text-destructive">
//                     {formatCurrency(booking.remainingAmount)}
//                   </span>
//                 </div>
//               </div>

//               {/* Installment Plan Breakdown (Only shows if installments exist) */}
//               {installmentSummary?.totalAmount > 0 && (
//                 <>
//                   <div className="border-b border-dashed mt-2"></div>
//                   <div className="space-y-2 pt-2 bg-muted/20 p-3 rounded-md border mt-4">
//                     <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">
//                       Installment Plan Tracking
//                     </p>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-muted-foreground">Plan Target Total:</span>
//                       <span className="font-medium">{formatCurrency(installmentSummary.totalAmount)}</span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-muted-foreground">Cleared Installments:</span>
//                       <span className="font-medium text-green-600">{formatCurrency(installmentSummary.totalPaid)}</span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-muted-foreground">Pending Installments:</span>
//                       <span className="font-medium text-amber-600">{formatCurrency(installmentSummary.pendingAmount)}</span>
//                     </div>
//                     {installmentSummary.overdueAmount > 0 && (
//                       <div className="flex justify-between text-xs pt-1">
//                         <span className="font-semibold text-red-600">Overdue Amount:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(installmentSummary.overdueAmount)}</span>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* --- Installment Table --- */}
//       <div>
//         <h3 className="text-lg font-semibold mb-3 mt-4">Installment Timeline</h3>
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














// // src/pages/booking/BookingDetail.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, FileText, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
// import { InstallmentTable } from "@/components/booking/InstallmentTable";
// import { PayInstallmentDialog } from "@/components/booking/PayInstallmentDialog";
// import { formatDate } from "@/lib/helpers"; 

// export default function BookingDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { current } = useAuthStore();
//   const canEdit = canMutate(current?.role, "booking");
//   const canPay = canMutate(current?.role, "booking_payment");
//   const {
//     currentBooking: booking,
//     installments,
//     installmentSummary,
//     fetchBookingById,
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

//   // Helper function for Indian Currency Formatting (₹ 8,00,000)
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0, 
//     }).format(amount || 0);
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

//   // Flattened snapshot for safer access
//   const flat = booking.flatSnapshot || {};

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
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

//               {booking.approvalStatus === "approved" && (
//                 <Button
//                   variant="outline"
//                   onClick={handleUploadAgreement}
//                   disabled={uploading}
//                 >
//                   <FileText className="h-4 w-4 mr-1" /> Upload Agreement
//                 </Button>
//               )}

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
        
//         {/* --- LEFT COLUMN: Property & Client Details --- */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Booking Details</CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
//               <div>
//                 <span className="text-muted-foreground block mb-1">Booking Reference</span>
//                 <span className="font-medium tracking-wide">{booking.bookingReferenceNumber}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Status</span>
//                 <BookingStatusBadge
//                   status={booking.status}
//                   approvalStatus={booking.approvalStatus}
//                   showApproval
//                 />
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Project</span>
//                 <span className="font-medium">{booking.projectId?.name}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Client Name</span>
//                 <span className="font-medium">{booking.clientId?.name || "Self"}</span>
//                 {booking.clientId?.phone && (
//                   <span className="block text-xs text-muted-foreground mt-0.5">{booking.clientId.phone}</span>
//                 )}
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Unit Number</span>
//                 <span className="font-medium">{flat.flatNumber || "—"}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Tower & Floor</span>
//                 <span className="font-medium">{flat.towerName || "—"} (Floor {flat.floor || "—"})</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Area</span>
//                 <span className="font-medium">{flat.area ? `${flat.area} sq ft` : "—"}</span>
//               </div>
//               <div>
//                 <span className="text-muted-foreground block mb-1">Configuration</span>
//                 <span className="font-medium">
//                   {flat.bedrooms ? `${flat.bedrooms} BHK` : "—"} ({flat.bathrooms ? `${flat.bathrooms} Baths` : "—"})
//                 </span>
//               </div>
              
//               {/* Unit Features */}
//               <div className="col-span-2 mt-2 pt-4 border-t grid grid-cols-4 gap-4">
//                 <div>
//                   <span className="text-muted-foreground block text-xs mb-1">Facing</span>
//                   <span className="font-medium text-xs">{flat.features?.facing || "—"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block text-xs mb-1">Balcony</span>
//                   <span className="font-medium text-xs">{flat.features?.balcony ? "Yes" : "No"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block text-xs mb-1">Parking</span>
//                   <span className="font-medium text-xs">{flat.features?.parking ? "Yes" : "No"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block text-xs mb-1">Furnishing</span>
//                   <span className="font-medium text-xs capitalize">
//                     {flat.features?.furnished ? flat.features.furnished.replace("-", " ") : "—"}
//                   </span>
//                 </div>
//               </div>

//               <div className="col-span-2 mt-2 pt-4 border-t grid grid-cols-2 gap-4">
//                 <div>
//                   <span className="text-muted-foreground block mb-1">Booking Date</span>
//                   <span className="font-medium">{formatDate(booking.createdAt)}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block mb-1">Agreement Date</span>
//                   <span className="font-medium">{booking.agreementDate ? formatDate(booking.agreementDate) : "—"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block mb-1">Payment Status</span>
//                   <span className="font-medium capitalize">{booking.paymentStatus || "-"}</span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground block mb-1">Nominee</span>
//                   <span className="font-medium">
//                     {/* Fixed: Nominee structured properly based on JSON response */}
//                     {booking.nominee?.name ? `${booking.nominee.name} (${booking.nominee.relation})` : "—"}
//                   </span>
//                 </div>
//               </div>

//               {/* Fixed: Cancellation mapping */}
//               {booking.cancellation?.reason && (
//                 <div className="col-span-2 p-3 mt-2 bg-red-50 text-red-800 rounded-md border border-red-100">
//                   <span className="font-semibold block mb-1">Cancellation Reason:</span> 
//                   {booking.cancellation.reason}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* --- RIGHT COLUMN: Consolidated Financial Summary --- */}
//         <div className="space-y-6">
//           <Card className="border-primary/20 shadow-sm">
//             <CardHeader className="bg-muted/30 border-b pb-4">
//               <CardTitle>Financial Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 pt-5 text-sm">
              
//               {/* Base Calculation */}
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Base Value:</span>
//                   <span className="font-medium">{formatCurrency(flat.price)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground flex items-center gap-1.5">
//                     Taxes (GST)
//                     {booking.gstPercentage > 0 && (
//                       <span className="inline-flex items-center rounded bg-blue-50 px-1 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/20">
//                         {booking.gstPercentage}%
//                       </span>
//                     )}
//                   </span>
//                   <span className="font-medium">+{formatCurrency(booking.totalGstAmount || 0)}</span>
//                 </div>
//                 <div className="flex justify-between pt-2 border-t text-base">
//                   <span className="font-semibold text-foreground">Total Value:</span>
//                   <span className="font-semibold text-foreground">
//                     {formatCurrency((flat.price || 0) + (booking.totalGstAmount || 0))}
//                   </span>
//                 </div>
//               </div>

//               <div className="border-b border-dashed"></div>

//               {/* Payments & Balance - Updated to explicitly show Base + GST for initial booking amount */}
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Booking Base Amount:</span>
//                   <span>{formatCurrency(booking.bookingBaseAmount || 0)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Booking GST:</span>
//                   <span>+{formatCurrency(booking.gstPaid || 0)}</span>
//                 </div>
//                 <div className="flex justify-between pb-1">
//                   <span className="text-muted-foreground font-medium text-foreground">Total Booking Paid:</span>
//                   <span className="font-medium text-foreground">{formatCurrency(booking.bookingAmount || 0)}</span>
//                 </div>
                
//                 <div className="border-b border-dashed"></div>
                
//                 <div className="flex justify-between pt-1">
//                   <span className="font-medium text-muted-foreground">Overall Paid:</span>
//                   <span className="font-semibold text-primary">{formatCurrency(booking.totalPaid)}</span>
//                 </div>
//                 <div className="flex justify-between pt-2 border-t text-base">
//                   <span className="font-semibold text-foreground">Balance Due:</span>
//                   <span className="font-bold text-destructive">
//                     {formatCurrency(booking.remainingAmount)}
//                   </span>
//                 </div>
//               </div>

//               {/* Installment Plan Breakdown (Only shows if installments exist) */}
//               {installmentSummary?.totalAmount > 0 && (
//                 <>
//                   <div className="border-b border-dashed mt-2"></div>
//                   <div className="space-y-2 pt-2 bg-muted/20 p-3 rounded-md border mt-4">
//                     <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">
//                       Installment Plan Tracking
//                     </p>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-muted-foreground">Plan Target Total:</span>
//                       <span className="font-medium">{formatCurrency(installmentSummary.totalAmount)}</span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-muted-foreground">Cleared Installments:</span>
//                       <span className="font-medium text-green-600">{formatCurrency(installmentSummary.totalPaid)}</span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-muted-foreground">Pending Installments:</span>
//                       <span className="font-medium text-amber-600">{formatCurrency(installmentSummary.pendingAmount)}</span>
//                     </div>
//                     {installmentSummary.overdueAmount > 0 && (
//                       <div className="flex justify-between text-xs pt-1">
//                         <span className="font-semibold text-red-600">Overdue Amount:</span>
//                         <span className="font-bold text-red-600">{formatCurrency(installmentSummary.overdueAmount)}</span>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* --- Installment Table --- */}
//       <div>
//         <h3 className="text-lg font-semibold mb-3 mt-4">Installment Timeline</h3>
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useBooking } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { InstallmentTable } from "@/components/booking/InstallmentTable";
import { PayInstallmentDialog } from "@/components/booking/PayInstallmentDialog";
import { formatDate } from "@/lib/helpers"; 

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

  // Helper function for Indian Currency Formatting (₹ 8,00,000)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0, 
    }).format(amount || 0);
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
      {/* Header Actions */}
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

              {/* FIXED: Updated logic to check for nested documentUrl */}
              {booking.agreementDocument?.documentUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={booking.agreementDocument.documentUrl}
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
        
        {/* --- LEFT COLUMN: Property & Client Details --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Booking Reference</span>
                <span className="font-medium tracking-wide">{booking.bookingReferenceNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Status</span>
                <BookingStatusBadge
                  status={booking.status}
                  approvalStatus={booking.approvalStatus}
                  showApproval
                />
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Project</span>
                <span className="font-medium">{booking.projectId?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Client Name</span>
                <span className="font-medium">{booking.clientId?.name || "Self"}</span>
                {booking.clientId?.phone && (
                  <span className="block text-xs text-muted-foreground mt-0.5">{booking.clientId.phone}</span>
                )}
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Unit Number</span>
                <span className="font-medium">{flat.flatNumber || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Tower & Floor</span>
                <span className="font-medium">{flat.towerName || "—"} (Floor {flat.floor || "—"})</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Area</span>
                <span className="font-medium">{flat.area ? `${flat.area} sq ft` : "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Configuration</span>
                <span className="font-medium">
                  {flat.bedrooms ? `${flat.bedrooms} BHK` : "—"} ({flat.bathrooms ? `${flat.bathrooms} Baths` : "—"})
                </span>
              </div>
              
              {/* Unit Features */}
              <div className="col-span-2 mt-2 pt-4 border-t grid grid-cols-4 gap-4">
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Facing</span>
                  <span className="font-medium text-xs">{flat.features?.facing || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Balcony</span>
                  <span className="font-medium text-xs">{flat.features?.balcony ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Parking</span>
                  <span className="font-medium text-xs">{flat.features?.parking ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Furnishing</span>
                  <span className="font-medium text-xs capitalize">
                    {flat.features?.furnished ? flat.features.furnished.replace("-", " ") : "—"}
                  </span>
                </div>
              </div>

              <div className="col-span-2 mt-2 pt-4 border-t grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground block mb-1">Booking Date</span>
                  <span className="font-medium">{formatDate(booking.createdAt)}</span>
                </div>
                {/* FIXED: Updated logic to show signedAt date from agreementDocument */}
                <div>
                  <span className="text-muted-foreground block mb-1">Agreement Date</span>
                  <span className="font-medium">
                    {booking.agreementDocument?.signedAt 
                      ? formatDate(booking.agreementDocument.signedAt) 
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Payment Status</span>
                  <span className="font-medium capitalize">{booking.paymentStatus || "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Nominee</span>
                  <span className="font-medium">
                    {booking.nominee?.name ? `${booking.nominee.name} (${booking.nominee.relation})` : "—"}
                  </span>
                </div>
              </div>

              {booking.cancellation?.reason && (
                <div className="col-span-2 p-3 mt-2 bg-red-50 text-red-800 rounded-md border border-red-100">
                  <span className="font-semibold block mb-1">Cancellation Reason:</span> 
                  {booking.cancellation.reason}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: Consolidated Financial Summary --- */}
        <div className="space-y-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5 text-sm">
              
              {/* Base Calculation */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Value:</span>
                  <span className="font-medium">{formatCurrency(flat.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    Taxes (GST)
                    {booking.gstPercentage > 0 && (
                      <span className="inline-flex items-center rounded bg-blue-50 px-1 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/20">
                        {booking.gstPercentage}%
                      </span>
                    )}
                  </span>
                  <span className="font-medium">+{formatCurrency(booking.totalGstAmount || 0)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-base">
                  <span className="font-semibold text-foreground">Total Value:</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency((flat.price || 0) + (booking.totalGstAmount || 0))}
                  </span>
                </div>
              </div>

              <div className="border-b border-dashed"></div>

              {/* Payments & Balance */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking Base Amount:</span>
                  <span>{formatCurrency(booking.bookingBaseAmount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking GST:</span>
                  <span>+{formatCurrency(booking.gstPaid || 0)}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground font-medium text-foreground">Total Booking Paid:</span>
                  <span className="font-medium text-foreground">{formatCurrency(booking.bookingAmount || 0)}</span>
                </div>
                
                <div className="border-b border-dashed"></div>
                
                <div className="flex justify-between pt-1">
                  <span className="font-medium text-muted-foreground">Overall Paid:</span>
                  <span className="font-semibold text-primary">{formatCurrency(booking.totalPaid)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-base">
                  <span className="font-semibold text-foreground">Balance Due:</span>
                  <span className="font-bold text-destructive">
                    {formatCurrency(booking.remainingAmount)}
                  </span>
                </div>
              </div>

              {/* Installment Plan Breakdown */}
              {installmentSummary?.totalAmount > 0 && (
                <>
                  <div className="border-b border-dashed mt-2"></div>
                  <div className="space-y-2 pt-2 bg-muted/20 p-3 rounded-md border mt-4">
                    <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">
                      Installment Plan Tracking
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Plan Target Total:</span>
                      <span className="font-medium">{formatCurrency(installmentSummary.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Cleared Installments:</span>
                      <span className="font-medium text-green-600">{formatCurrency(installmentSummary.totalPaid)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Pending Installments:</span>
                      <span className="font-medium text-amber-600">{formatCurrency(installmentSummary.pendingAmount)}</span>
                    </div>
                    {installmentSummary.overdueAmount > 0 && (
                      <div className="flex justify-between text-xs pt-1">
                        <span className="font-semibold text-red-600">Overdue Amount:</span>
                        <span className="font-bold text-red-600">{formatCurrency(installmentSummary.overdueAmount)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- Installment Table --- */}
      <div>
        <h3 className="text-lg font-semibold mb-3 mt-4">Installment Timeline</h3>
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