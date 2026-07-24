// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Building2, BookOpen, FileText, Users, Calendar } from "lucide-react";

// const StatusBadge = ({ status }) => {
//   const variant =
//     status === "available"
//       ? "success"
//       : status === "booked"
//         ? "default"
//         : status === "sold"
//           ? "secondary"
//           : "outline";
//   return <Badge variant={variant}>{status}</Badge>;
// };

// export default function ProjectDetailModal({
//   open,
//   onOpenChange,
//   project,
//   bookings,
//   bookingsPagination, // <-- Naya prop add kiya
//   onBookingPageChange, // <-- Naya prop add kiya
//   agreements,
//   siteEngineers,
//   loading,
//   onViewPayments,
// }) {
//   const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
//   const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
//   const [selectedFlat, setSelectedFlat] = useState(null);

//   const towers = project?.towers || [];
//   const selectedTower = towers[selectedTowerIdx] || null;
//   const floors = selectedTower?.floors || [];
//   // Keep floor index in bounds when tower changes
//   const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
//   const currentFloor = floors[safeFloorIdx] || null;
//   const currentFlats = currentFloor?.flats || [];

//   if (!project) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Building2 className="h-5 w-5" />
//             {project.name} – Inventory
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="towers">
//           <TabsList>
//             <TabsTrigger value="towers">
//               <Building2 className="h-4 w-4 mr-1" /> Towers & Flats
//             </TabsTrigger>
//             <TabsTrigger value="bookings">
//               <BookOpen className="h-4 w-4 mr-1" /> Bookings
//             </TabsTrigger>
//             <TabsTrigger value="agreements">
//               <FileText className="h-4 w-4 mr-1" /> Agreements
//             </TabsTrigger>
//             <TabsTrigger value="engineers">
//               <Users className="h-4 w-4 mr-1" /> Site Engineers
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="towers">
//             {towers.length > 0 ? (
//               <div className="space-y-4">
//                 {/* Tower selection */}
//                 <div>
//                   <h4 className="text-sm font-medium mb-1">Select Tower</h4>
//                   <div className="flex gap-2 flex-wrap">
//                     {towers.map((tower, idx) => (
//                       <Button
//                         key={tower.towerName}
//                         variant={
//                           idx === selectedTowerIdx ? "default" : "outline"
//                         }
//                         size="sm"
//                         onClick={() => {
//                           setSelectedTowerIdx(idx);
//                           setSelectedFloorIdx(0); // reset floor when tower changes
//                         }}
//                       >
//                         {tower.towerName}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Floor selection */}
//                 {selectedTower && (
//                   <div>
//                     <h4 className="text-sm font-medium mb-1">Select Floor</h4>
//                     <div className="flex gap-2 flex-wrap">
//                       {floors.map((floor, idx) => (
//                         <Button
//                           key={floor.floorNumber}
//                           variant={idx === safeFloorIdx ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setSelectedFloorIdx(idx)}
//                         >
//                           {floor.floorNumber}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Flats grid */}
//                 {currentFlats.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-2">
//                       {selectedTower.towerName} – Floor{" "}
//                       {currentFloor.floorNumber}
//                     </h3>
//                     <div className="grid grid-cols-4 gap-4">
//                       {currentFlats.map((flat) => (
//                         <div
//                           key={flat.flatNumber}
//                           className="border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
//                           onClick={() => setSelectedFlat(flat)}
//                         >
//                           <div className="flex justify-between items-start">
//                             <span className="font-medium">
//                               {flat.flatNumber}
//                             </span>
//                             <StatusBadge status={flat.status} />
//                           </div>
//                           <p className="text-sm">{flat.area} sqft</p>
//                           <p className="text-sm font-semibold">
//                             ₹{flat.price?.toLocaleString()}
//                           </p>
//                           {flat.facing && (
//                             <p className="text-xs text-muted-foreground">
//                               Facing: {flat.facing}
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {currentFlats.length === 0 && selectedTower && (
//                   <p className="text-sm text-muted-foreground">
//                     No flats on this floor.
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No towers found.</p>
//             )}
//           </TabsContent>

//           {/* Bookings */}
//           <TabsContent value="bookings">
//             {bookings.length ? (
//               <div className="space-y-4">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr>
//                       <th>Buyer</th>
//                       <th>Flat</th>
//                       <th>Booking Amount</th>
//                       <th>Payment Status</th>
//                       <th>Next Due</th>
//                       <th></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {bookings.map((b) => (
//                       <tr key={b.id}>
//                         <td>
//                           {b.clientName}
//                           <br />
//                           <span className="text-xs text-muted-foreground">
//                             {b.clientEmail}
//                           </span>
//                         </td>
//                         <td>{b.flatNumber}</td>
//                         <td>{formatINR(b.bookingAmount)}</td>
//                         <td>
//                           <Badge>{b.paymentStatus}</Badge>
//                         </td>
//                         <td>
//                           {b.nextInstallmentDue
//                             ? formatDate(b.nextInstallmentDue)
//                             : "—"}
//                         </td>
//                         <td>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => onViewPayments(b.id)}
//                           >
//                             Payments
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
                
//                 {/* <-- Naya Pagination UI Start --> */}
//                 {bookingsPagination?.total > 0 && (
//                   <div className="flex justify-between items-center py-2 px-1">
//                     <span className="text-sm text-muted-foreground">
//                       Page {bookingsPagination.page} of {bookingsPagination.pages} ({bookingsPagination.total} bookings)
//                     </span>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         disabled={bookingsPagination.page <= 1}
//                         onClick={() => onBookingPageChange(bookingsPagination.page - 1)}
//                       >
//                         Previous
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         disabled={bookingsPagination.page >= bookingsPagination.pages}
//                         onClick={() => onBookingPageChange(bookingsPagination.page + 1)}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//                 {/* <-- Naya Pagination UI End --> */}

//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">
//                 No bookings found.
//               </p>
//             )}
//           </TabsContent>

//           {/* Agreements */}
//           <TabsContent value="agreements">
//             {agreements.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr>
//                     <th>Booking ID</th>
//                     <th>Buyer</th>
//                     <th>Flat</th>
//                     <th>Status</th>
//                     <th>Agreement Date</th>
//                     <th>Approval</th>
//                     <th>Cancelled</th>
//                     <th>Remarks</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {agreements.map((a) => (
//                     <tr key={a.bookingId}>
//                       <td className="font-mono text-xs">{a.bookingId}</td>
//                       <td>{a.clientName}</td>
//                       <td>{a.flatNumber}</td>
//                       <td>
//                         <Badge>{a.status}</Badge>
//                       </td>
//                       <td>
//                         {a.agreementDate ? formatDate(a.agreementDate) : "—"}
//                       </td>
//                       <td>{a.approvalStatus}</td>
//                       <td>{a.cancelled ? "Yes" : "No"}</td>
//                       <td>{a.remarks || "—"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">
//                 No agreements found.
//               </p>
//             )}
//           </TabsContent>

//           {/* Site Engineers */}
//           <TabsContent value="engineers">
//             {siteEngineers.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {siteEngineers.map((eng) => (
//                     <tr key={eng.id}>
//                       <td>{eng.name}</td>
//                       <td>{eng.email}</td>
//                       <td>{eng.phone}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">
//                 No site engineers assigned.
//               </p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </DialogContent>

//       <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
//         <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <span>Flat {selectedFlat?.flatNumber} Details</span>
//               {selectedFlat && <StatusBadge status={selectedFlat.status} />}
//             </DialogTitle>
//             {selectedFlat && (
//               <p className="text-sm text-muted-foreground">
//                 {selectedFlat.area} sqft · ₹{formatINR(selectedFlat.price)}
//               </p>
//             )}
//           </DialogHeader>

//           {selectedFlat && (
//             <div className="space-y-6">
//               {/* --- Flat Information Card --- */}
//               <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Bedrooms:</span>{" "}
//                   {selectedFlat.bedrooms}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Bathrooms:</span>{" "}
//                   {selectedFlat.bathrooms}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Facing:</span>{" "}
//                   {selectedFlat.facing || "—"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Parking:</span>{" "}
//                   {selectedFlat.parking ? "Yes" : "No"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Balcony:</span>{" "}
//                   {selectedFlat.balcony ? "Yes" : "No"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Furnished:</span>{" "}
//                   {selectedFlat.furnished}
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-muted-foreground">
//                     Type of Booking:
//                   </span>{" "}
//                   {selectedFlat.typeOfBooking || "—"}
//                 </div>
//               </div>

//               {/* --- Agreement & Status Card --- */}
//               <div className="border rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">
//                     Agreement Status:
//                   </span>{" "}
//                   <Badge
//                     variant={
//                       selectedFlat.agreementStatus === "REGISTERED"
//                         ? "success"
//                         : "outline"
//                     }
//                   >
//                     {selectedFlat.agreementStatus}
//                   </Badge>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Agreement Date:</span>{" "}
//                   {selectedFlat.agreementDate
//                     ? formatDate(selectedFlat.agreementDate)
//                     : "—"}
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-muted-foreground">Cancelled:</span>{" "}
//                   {selectedFlat.cancelled ? "Yes" : "No"}
//                 </div>
//               </div>

//               {/* --- Booking Details Card --- */}
//               {selectedFlat.booking && (
//                 <div className="border rounded-lg p-4 space-y-3">
//                   <h4 className="font-semibold text-base">Booking Details</h4>
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Booking ID:</span>{" "}
//                       <span className="font-mono text-xs">
//                         {selectedFlat.booking.bookingId}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Status:</span>{" "}
//                       <Badge variant="outline">
//                         {selectedFlat.booking.status}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Approval:</span>{" "}
//                       <Badge
//                         variant={
//                           selectedFlat.booking.approvalStatus === "approved"
//                             ? "success"
//                             : "warning"
//                         }
//                       >
//                         {selectedFlat.booking.approvalStatus}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">
//                         Payment Status:
//                       </span>{" "}
//                       <Badge>{selectedFlat.booking.paymentStatus}</Badge>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">
//                         Booking Amount:
//                       </span>{" "}
//                       {formatINR(selectedFlat.booking.bookingAmount)}
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Total Paid:</span>{" "}
//                       {formatINR(selectedFlat.booking.totalPaid)}
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Remaining:</span>{" "}
//                       {formatINR(selectedFlat.booking.remainingAmount)}
//                     </div>
//                     {selectedFlat.booking.nextInstallmentDueDate && (
//                       <div>
//                         <span className="text-muted-foreground">Next Due:</span>{" "}
//                         {formatDate(
//                           selectedFlat.booking.nextInstallmentDueDate,
//                         )}
//                       </div>
//                     )}
//                     {selectedFlat.booking.nextInstallmentAmount > 0 && (
//                       <div>
//                         <span className="text-muted-foreground">
//                           Next Installment:
//                         </span>{" "}
//                         {formatINR(selectedFlat.booking.nextInstallmentAmount)}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* --- Payment History Card --- */}
//               {selectedFlat.booking?.paymentDetails?.filter(
//                 (p) => p.clearedAmount > 0 || p.unclearedAmount > 0,
//               ).length > 0 && (
//                 <div className="border rounded-lg p-4 space-y-3">
//                   <h4 className="font-semibold text-base">Payment History</h4>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b">
//                           <th className="text-left py-1 pr-2">Mode</th>
//                           <th className="text-left py-1 pr-2">Cleared</th>
//                           <th className="text-left py-1 pr-2">Uncleared</th>
//                           <th className="text-left py-1">Reference</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedFlat.booking.paymentDetails
//                           .filter(
//                             (p) => p.clearedAmount > 0 || p.unclearedAmount > 0,
//                           )
//                           .map((payment, idx) => (
//                             <tr key={idx} className="border-b last:border-0">
//                               <td className="py-1 pr-2">
//                                 {payment.paymentMode || "—"}
//                               </td>
//                               <td className="py-1 pr-2">
//                                 {formatINR(payment.clearedAmount)}
//                               </td>
//                               <td className="py-1 pr-2">
//                                 {formatINR(payment.unclearedAmount)}
//                               </td>
//                               <td className="py-1">
//                                 {payment.transactionId ||
//                                   payment.chequeNumber ||
//                                   payment.bankName ||
//                                   "—"}
//                               </td>
//                             </tr>
//                           ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Dialog>
//   );
// }





// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Building2, BookOpen, FileText, Users, Calendar } from "lucide-react";

// // Helper function to compute display status
// const getEffectiveFlatStatus = (flat) => {
//   if (flat.booking) {
//     // If booking is cancelled or rejected, flat is available
//     if (flat.booking.status === "cancelled" || flat.booking.approvalStatus === "rejected") {
//       return "available";
//     }
//     // Otherwise, if booking exists, treat as booked (provided it's not cancelled/rejected)
//     return "booked";
//   }
//   // No booking means flat is available
//   return "available";
// };

// const StatusBadge = ({ status }) => {
//   const variant =
//     status === "available"
//       ? "success"
//       : status === "booked"
//       ? "default"
//       : status === "sold"
//       ? "secondary"
//       : "outline";
//   return <Badge variant={variant}>{status}</Badge>;
// };

// export default function ProjectDetailModal({
//   open,
//   onOpenChange,
//   project,
//   bookings,
//   bookingsPagination,
//   onBookingPageChange,
//   agreements,
//   siteEngineers,
//   loading,
//   onViewPayments,
// }) {
//   const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
//   const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
//   const [selectedFlat, setSelectedFlat] = useState(null);

//   const towers = project?.towers || [];
//   const selectedTower = towers[selectedTowerIdx] || null;
//   const floors = selectedTower?.floors || [];
//   const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
//   const currentFloor = floors[safeFloorIdx] || null;
//   const currentFlats = currentFloor?.flats || [];

//   if (!project) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Building2 className="h-5 w-5" />
//             {project.name} – Inventory
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="towers">
//           <TabsList>
//             <TabsTrigger value="towers">
//               <Building2 className="h-4 w-4 mr-1" /> Towers & Flats
//             </TabsTrigger>
//             <TabsTrigger value="bookings">
//               <BookOpen className="h-4 w-4 mr-1" /> Bookings
//             </TabsTrigger>
//             <TabsTrigger value="agreements">
//               <FileText className="h-4 w-4 mr-1" /> Agreements
//             </TabsTrigger>
//             <TabsTrigger value="engineers">
//               <Users className="h-4 w-4 mr-1" /> Site Engineers
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="towers">
//             {towers.length > 0 ? (
//               <div className="space-y-4">
//                 {/* Tower selection */}
//                 <div>
//                   <h4 className="text-sm font-medium mb-1">Select Tower</h4>
//                   <div className="flex gap-2 flex-wrap">
//                     {towers.map((tower, idx) => (
//                       <Button
//                         key={tower.towerName}
//                         variant={idx === selectedTowerIdx ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => {
//                           setSelectedTowerIdx(idx);
//                           setSelectedFloorIdx(0);
//                         }}
//                       >
//                         {tower.towerName}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Floor selection */}
//                 {selectedTower && (
//                   <div>
//                     <h4 className="text-sm font-medium mb-1">Select Floor</h4>
//                     <div className="flex gap-2 flex-wrap">
//                       {floors.map((floor, idx) => (
//                         <Button
//                           key={floor.floorNumber}
//                           variant={idx === safeFloorIdx ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setSelectedFloorIdx(idx)}
//                         >
//                           {floor.floorNumber}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Flats grid */}
//                 {currentFlats.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-2">
//                       {selectedTower.towerName} – Floor {currentFloor.floorNumber}
//                     </h3>
//                     <div className="grid grid-cols-4 gap-4">
//                       {currentFlats.map((flat) => (
//                         <div
//                           key={flat.flatNumber}
//                           className="border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
//                           onClick={() => setSelectedFlat(flat)}
//                         >
//                           <div className="flex justify-between items-start">
//                             <span className="font-medium">{flat.flatNumber}</span>
//                             {/* ✅ Use effective status here */}
//                             <StatusBadge status={getEffectiveFlatStatus(flat)} />
//                           </div>
//                           <p className="text-sm">{flat.area} sqft</p>
//                           <p className="text-sm font-semibold">
//                             ₹{flat.price?.toLocaleString()}
//                           </p>
//                           {flat.facing && (
//                             <p className="text-xs text-muted-foreground">
//                               Facing: {flat.facing}
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {currentFlats.length === 0 && selectedTower && (
//                   <p className="text-sm text-muted-foreground">
//                     No flats on this floor.
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No towers found.</p>
//             )}
//           </TabsContent>

//           {/* Bookings - unchanged */}
//           <TabsContent value="bookings">
//             {bookings.length ? (
//               <div className="space-y-4">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr>
//                       <th>Buyer</th>
//                       <th>Flat</th>
//                       <th>Booking Amount</th>
//                       <th>Payment Status</th>
//                       <th>Next Due</th>
//                       <th></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {bookings.map((b) => (
//                       <tr key={b.id}>
//                         <td>
//                           {b.clientName}
//                           <br />
//                           <span className="text-xs text-muted-foreground">
//                             {b.clientEmail}
//                           </span>
//                         </td>
//                         <td>{b.flatNumber}</td>
//                         <td>{formatINR(b.bookingAmount)}</td>
//                         <td>
//                           <Badge>{b.paymentStatus}</Badge>
//                         </td>
//                         <td>
//                           {b.nextInstallmentDue
//                             ? formatDate(b.nextInstallmentDue)
//                             : "—"}
//                         </td>
//                         <td>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => onViewPayments(b.id)}
//                           >
//                             Payments
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {bookingsPagination?.total > 0 && (
//                   <div className="flex justify-between items-center py-2 px-1">
//                     <span className="text-sm text-muted-foreground">
//                       Page {bookingsPagination.page} of {bookingsPagination.pages} ({bookingsPagination.total} bookings)
//                     </span>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         disabled={bookingsPagination.page <= 1}
//                         onClick={() => onBookingPageChange(bookingsPagination.page - 1)}
//                       >
//                         Previous
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         disabled={bookingsPagination.page >= bookingsPagination.pages}
//                         onClick={() => onBookingPageChange(bookingsPagination.page + 1)}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No bookings found.</p>
//             )}
//           </TabsContent>

//           {/* Agreements - unchanged */}
//           <TabsContent value="agreements">
//             {agreements.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr>
//                     <th>Booking ID</th>
//                     <th>Buyer</th>
//                     <th>Flat</th>
//                     <th>Status</th>
//                     <th>Agreement Date</th>
//                     <th>Approval</th>
//                     <th>Cancelled</th>
//                     <th>Remarks</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {agreements.map((a) => (
//                     <tr key={a.bookingId}>
//                       <td className="font-mono text-xs">{a.bookingId}</td>
//                       <td>{a.clientName}</td>
//                       <td>{a.flatNumber}</td>
//                       <td>
//                         <Badge>{a.status}</Badge>
//                       </td>
//                       <td>
//                         {a.agreementDate ? formatDate(a.agreementDate) : "—"}
//                       </td>
//                       <td>{a.approvalStatus}</td>
//                       <td>{a.cancelled ? "Yes" : "No"}</td>
//                       <td>{a.remarks || "—"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">No agreements found.</p>
//             )}
//           </TabsContent>

//           {/* Site Engineers - unchanged */}
//           <TabsContent value="engineers">
//             {siteEngineers.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {siteEngineers.map((eng) => (
//                     <tr key={eng.id}>
//                       <td>{eng.name}</td>
//                       <td>{eng.email}</td>
//                       <td>{eng.phone}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">
//                 No site engineers assigned.
//               </p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </DialogContent>

//       {/* Flat Details Dialog */}
//       <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
//         <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <span>Flat {selectedFlat?.flatNumber} Details</span>
//               {selectedFlat && (
//                 // ✅ Use effective status here too
//                 <StatusBadge status={getEffectiveFlatStatus(selectedFlat)} />
//               )}
//             </DialogTitle>
//             {selectedFlat && (
//               <p className="text-sm text-muted-foreground">
//                 {selectedFlat.area} sqft · ₹{formatINR(selectedFlat.price)}
//               </p>
//             )}
//           </DialogHeader>

//           {selectedFlat && (
//             <div className="space-y-6">
//               {/* Flat Information Card */}
//               <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Bedrooms:</span>{" "}
//                   {selectedFlat.bedrooms}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Bathrooms:</span>{" "}
//                   {selectedFlat.bathrooms}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Facing:</span>{" "}
//                   {selectedFlat.facing || "—"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Parking:</span>{" "}
//                   {selectedFlat.parking ? "Yes" : "No"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Balcony:</span>{" "}
//                   {selectedFlat.balcony ? "Yes" : "No"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Furnished:</span>{" "}
//                   {selectedFlat.furnished}
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-muted-foreground">Type of Booking:</span>{" "}
//                   {selectedFlat.typeOfBooking || "—"}
//                 </div>
//               </div>

//               {/* Agreement & Status Card */}
//               <div className="border rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Agreement Status:</span>{" "}
//                   <Badge
//                     variant={
//                       selectedFlat.agreementStatus === "REGISTERED"
//                         ? "success"
//                         : "outline"
//                     }
//                   >
//                     {selectedFlat.agreementStatus}
//                   </Badge>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Agreement Date:</span>{" "}
//                   {selectedFlat.agreementDate
//                     ? formatDate(selectedFlat.agreementDate)
//                     : "—"}
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-muted-foreground">Cancelled:</span>{" "}
//                   {selectedFlat.cancelled ? "Yes" : "No"}
//                 </div>
//               </div>

//               {/* Booking Details Card - unchanged */}
//               {selectedFlat.booking && (
//                 <div className="border rounded-lg p-4 space-y-3">
//                   <h4 className="font-semibold text-base">Booking Details</h4>
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Booking ID:</span>{" "}
//                       <span className="font-mono text-xs">
//                         {selectedFlat.booking.bookingId}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Status:</span>{" "}
//                       <Badge variant="outline">
//                         {selectedFlat.booking.status}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Approval:</span>{" "}
//                       <Badge
//                         variant={
//                           selectedFlat.booking.approvalStatus === "approved"
//                             ? "success"
//                             : "warning"
//                         }
//                       >
//                         {selectedFlat.booking.approvalStatus}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Payment Status:</span>{" "}
//                       <Badge>{selectedFlat.booking.paymentStatus}</Badge>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Booking Amount:</span>{" "}
//                       {formatINR(selectedFlat.booking.bookingAmount)}
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Total Paid:</span>{" "}
//                       {formatINR(selectedFlat.booking.totalPaid)}
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Remaining:</span>{" "}
//                       {formatINR(selectedFlat.booking.remainingAmount)}
//                     </div>
//                     {selectedFlat.booking.nextInstallmentDueDate && (
//                       <div>
//                         <span className="text-muted-foreground">Next Due:</span>{" "}
//                         {formatDate(selectedFlat.booking.nextInstallmentDueDate)}
//                       </div>
//                     )}
//                     {selectedFlat.booking.nextInstallmentAmount > 0 && (
//                       <div>
//                         <span className="text-muted-foreground">Next Installment:</span>{" "}
//                         {formatINR(selectedFlat.booking.nextInstallmentAmount)}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Payment History - unchanged */}
//               {selectedFlat.booking?.paymentDetails?.filter(
//                 (p) => p.clearedAmount > 0 || p.unclearedAmount > 0
//               ).length > 0 && (
//                 <div className="border rounded-lg p-4 space-y-3">
//                   <h4 className="font-semibold text-base">Payment History</h4>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b">
//                           <th className="text-left py-1 pr-2">Mode</th>
//                           <th className="text-left py-1 pr-2">Cleared</th>
//                           <th className="text-left py-1 pr-2">Uncleared</th>
//                           <th className="text-left py-1">Reference</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedFlat.booking.paymentDetails
//                           .filter((p) => p.clearedAmount > 0 || p.unclearedAmount > 0)
//                           .map((payment, idx) => (
//                             <tr key={idx} className="border-b last:border-0">
//                               <td className="py-1 pr-2">
//                                 {payment.paymentMode || "—"}
//                               </td>
//                               <td className="py-1 pr-2">
//                                 {formatINR(payment.clearedAmount)}
//                               </td>
//                               <td className="py-1 pr-2">
//                                 {formatINR(payment.unclearedAmount)}
//                               </td>
//                               <td className="py-1">
//                                 {payment.transactionId ||
//                                   payment.chequeNumber ||
//                                   payment.bankName ||
//                                   "—"}
//                               </td>
//                             </tr>
//                           ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Dialog>
//   );
// }






// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Building2, BookOpen, FileText, Users, Calendar } from "lucide-react";

// // Helper function to compute display status
// const getEffectiveFlatStatus = (flat) => {
//   if (flat.booking) {
//     // If booking is cancelled or rejected, flat is available
//     if (flat.booking.status === "cancelled" || flat.booking.approvalStatus === "rejected") {
//       return "available";
//     }
//     // Otherwise, if booking exists, treat as booked (provided it's not cancelled/rejected)
//     return "booked";
//   }
//   // No booking means flat is available
//   return "available";
// };

// const StatusBadge = ({ status }) => {
//   const variant =
//     status === "available"
//       ? "success"
//       : status === "booked"
//       ? "default"
//       : status === "sold"
//       ? "secondary"
//       : "outline";
//   return <Badge variant={variant}>{status}</Badge>;
// };

// export default function ProjectDetailModal({
//   open,
//   onOpenChange,
//   project,
//   bookings,
//   bookingsPagination,
//   onBookingPageChange,
//   agreements,
//   siteEngineers,
//   loading,
//   onViewPayments,
// }) {
//   const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
//   const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
//   const [selectedFlat, setSelectedFlat] = useState(null);

//   const towers = project?.towers || [];
//   const selectedTower = towers[selectedTowerIdx] || null;
//   const floors = selectedTower?.floors || [];
//   const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
//   const currentFloor = floors[safeFloorIdx] || null;
//   const currentFlats = currentFloor?.flats || [];

//   if (!project) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Building2 className="h-5 w-5" />
//             {project.name} – Inventory
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="towers">
//           <TabsList>
//             <TabsTrigger value="towers">
//               <Building2 className="h-4 w-4 mr-1" /> Towers & Flats
//             </TabsTrigger>
//             <TabsTrigger value="bookings">
//               <BookOpen className="h-4 w-4 mr-1" /> Bookings
//             </TabsTrigger>
//             <TabsTrigger value="agreements">
//               <FileText className="h-4 w-4 mr-1" /> Agreements
//             </TabsTrigger>
//             <TabsTrigger value="engineers">
//               <Users className="h-4 w-4 mr-1" /> Site Engineers
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="towers">
//             {towers.length > 0 ? (
//               <div className="space-y-4">
//                 {/* Tower selection */}
//                 <div>
//                   <h4 className="text-sm font-medium mb-1">Select Tower</h4>
//                   <div className="flex gap-2 flex-wrap">
//                     {towers.map((tower, idx) => (
//                       <Button
//                         key={tower.towerName}
//                         variant={idx === selectedTowerIdx ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => {
//                           setSelectedTowerIdx(idx);
//                           setSelectedFloorIdx(0);
//                         }}
//                       >
//                         {tower.towerName}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Floor selection */}
//                 {selectedTower && (
//                   <div>
//                     <h4 className="text-sm font-medium mb-1">Select Floor</h4>
//                     <div className="flex gap-2 flex-wrap">
//                       {floors.map((floor, idx) => (
//                         <Button
//                           key={floor.floorNumber}
//                           variant={idx === safeFloorIdx ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setSelectedFloorIdx(idx)}
//                         >
//                           {floor.floorNumber}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Flats grid */}
//                 {currentFlats.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold mb-2">
//                       {selectedTower.towerName} – Floor {currentFloor.floorNumber}
//                     </h3>
//                     <div className="grid grid-cols-4 gap-4">
//                       {currentFlats.map((flat) => (
//                         <div
//                           key={flat.flatNumber}
//                           className="border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
//                           onClick={() => setSelectedFlat(flat)}
//                         >
//                           <div className="flex justify-between items-start">
//                             <span className="font-medium">{flat.flatNumber}</span>
//                             <StatusBadge status={getEffectiveFlatStatus(flat)} />
//                           </div>
//                           <p className="text-sm">{flat.area} sqft</p>
//                           <p className="text-sm font-semibold">
//                             ₹{flat.price?.toLocaleString()}
//                           </p>
//                           {flat.facing && (
//                             <p className="text-xs text-muted-foreground">
//                               Facing: {flat.facing}
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {currentFlats.length === 0 && selectedTower && (
//                   <p className="text-sm text-muted-foreground">
//                     No flats on this floor.
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No towers found.</p>
//             )}
//           </TabsContent>

//           {/* Bookings */}
//           <TabsContent value="bookings">
//             {bookings.length ? (
//               <div className="space-y-4">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="text-left py-2 font-medium text-muted-foreground">Buyer</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Flat</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Booking Amount</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Payment Status</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Next Due</th>
//                       <th className="text-right py-2 font-medium text-muted-foreground">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {bookings.map((b) => (
//                       <tr key={b.id} className="border-b last:border-0">
//                         <td className="py-2">
//                           {b.clientName}
//                           <br />
//                           <span className="text-xs text-muted-foreground">
//                             {b.clientEmail}
//                           </span>
//                         </td>
//                         <td className="py-2">{b.flatNumber}</td>
//                         <td className="py-2">{formatINR(b.bookingAmount)}</td>
//                         <td className="py-2">
//                           <Badge>{b.paymentStatus}</Badge>
//                         </td>
//                         <td className="py-2">
//                           {b.nextInstallmentDue
//                             ? formatDate(b.nextInstallmentDue)
//                             : "—"}
//                         </td>
//                         <td className="py-2 text-right">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => onViewPayments(b.id)}
//                           >
//                             Payments
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {bookingsPagination?.total > 0 && (
//                   <div className="flex justify-between items-center py-2 px-1">
//                     <span className="text-sm text-muted-foreground">
//                       Page {bookingsPagination.page} of {bookingsPagination.pages} ({bookingsPagination.total} bookings)
//                     </span>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         disabled={bookingsPagination.page <= 1}
//                         onClick={() => onBookingPageChange(bookingsPagination.page - 1)}
//                       >
//                         Previous
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         disabled={bookingsPagination.page >= bookingsPagination.pages}
//                         onClick={() => onBookingPageChange(bookingsPagination.page + 1)}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No bookings found.</p>
//             )}
//           </TabsContent>

//           {/* Agreements */}
//           <TabsContent value="agreements">
//             {agreements.length ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="text-left py-2 font-medium text-muted-foreground">Booking ID</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Buyer</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Flat</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Agreement Date</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Approval</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Cancelled</th>
//                       <th className="text-left py-2 font-medium text-muted-foreground">Remarks</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {agreements.map((a) => (
//                       <tr key={a.bookingId} className="border-b last:border-0">
//                         <td className="py-2 font-mono text-xs">{a.bookingId}</td>
//                         <td className="py-2">{a.clientName}</td>
//                         <td className="py-2">{a.flatNumber}</td>
//                         <td className="py-2">
//                           <Badge>{a.status}</Badge>
//                         </td>
//                         <td className="py-2">
//                           {a.agreementDate ? formatDate(a.agreementDate) : "—"}
//                         </td>
//                         <td className="py-2">{a.approvalStatus}</td>
//                         <td className="py-2">{a.cancelled ? "Yes" : "No"}</td>
//                         <td className="py-2">{a.remarks || "—"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No agreements found.</p>
//             )}
//           </TabsContent>

//           {/* Site Engineers */}
//           <TabsContent value="engineers">
//             {siteEngineers.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left py-2 font-medium text-muted-foreground">Name</th>
//                     <th className="text-left py-2 font-medium text-muted-foreground">Email</th>
//                     <th className="text-left py-2 font-medium text-muted-foreground">Phone</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {siteEngineers.map((eng) => (
//                     <tr key={eng.id} className="border-b last:border-0">
//                       <td className="py-2">{eng.name}</td>
//                       <td className="py-2">{eng.email}</td>
//                       <td className="py-2">{eng.phone}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">
//                 No site engineers assigned.
//               </p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </DialogContent>

//       {/* Flat Details Dialog */}
//       <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
//         <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <span>Flat {selectedFlat?.flatNumber} Details</span>
//               {selectedFlat && (
//                 <StatusBadge status={getEffectiveFlatStatus(selectedFlat)} />
//               )}
//             </DialogTitle>
//             {selectedFlat && (
//               <p className="text-sm text-muted-foreground">
//                 {selectedFlat.area} sqft · ₹{formatINR(selectedFlat.price)}
//               </p>
//             )}
//           </DialogHeader>

//           {selectedFlat && (
//             <div className="space-y-6">
//               {/* Flat Information Card */}
//               <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Bedrooms:</span>{" "}
//                   {selectedFlat.bedrooms}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Bathrooms:</span>{" "}
//                   {selectedFlat.bathrooms}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Facing:</span>{" "}
//                   {selectedFlat.facing || "—"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Parking:</span>{" "}
//                   {selectedFlat.parking ? "Yes" : "No"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Balcony:</span>{" "}
//                   {selectedFlat.balcony ? "Yes" : "No"}
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Furnished:</span>{" "}
//                   {selectedFlat.furnished}
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-muted-foreground">Type of Booking:</span>{" "}
//                   {selectedFlat.typeOfBooking || "—"}
//                 </div>
//               </div>

//               {/* Agreement & Status Card */}
//               <div className="border rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Agreement Status:</span>{" "}
//                   <Badge
//                     variant={
//                       selectedFlat.agreementStatus === "REGISTERED"
//                         ? "success"
//                         : "outline"
//                     }
//                   >
//                     {selectedFlat.agreementStatus}
//                   </Badge>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Agreement Date:</span>{" "}
//                   {selectedFlat.agreementDate
//                     ? formatDate(selectedFlat.agreementDate)
//                     : "—"}
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-muted-foreground">Cancelled:</span>{" "}
//                   {selectedFlat.cancelled ? "Yes" : "No"}
//                 </div>
//               </div>

//               {/* Booking Details Card */}
//               {selectedFlat.booking && (
//                 <div className="border rounded-lg p-4 space-y-3">
//                   <h4 className="font-semibold text-base">Booking Details</h4>
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Booking ID:</span>{" "}
//                       <span className="font-mono text-xs">
//                         {selectedFlat.booking.bookingId}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Status:</span>{" "}
//                       <Badge variant="outline">
//                         {selectedFlat.booking.status}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Approval:</span>{" "}
//                       <Badge
//                         variant={
//                           selectedFlat.booking.approvalStatus === "approved"
//                             ? "success"
//                             : "warning"
//                         }
//                       >
//                         {selectedFlat.booking.approvalStatus}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Payment Status:</span>{" "}
//                       <Badge>{selectedFlat.booking.paymentStatus}</Badge>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Booking Amount:</span>{" "}
//                       {formatINR(selectedFlat.booking.bookingAmount)}
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Total Paid:</span>{" "}
//                       {formatINR(selectedFlat.booking.totalPaid)}
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Remaining:</span>{" "}
//                       {formatINR(selectedFlat.booking.remainingAmount)}
//                     </div>
//                     {selectedFlat.booking.nextInstallmentDueDate && (
//                       <div>
//                         <span className="text-muted-foreground">Next Due:</span>{" "}
//                         {formatDate(selectedFlat.booking.nextInstallmentDueDate)}
//                       </div>
//                     )}
//                     {selectedFlat.booking.nextInstallmentAmount > 0 && (
//                       <div>
//                         <span className="text-muted-foreground">Next Installment:</span>{" "}
//                         {formatINR(selectedFlat.booking.nextInstallmentAmount)}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Payment History */}
//               {selectedFlat.booking?.paymentDetails?.filter(
//                 (p) => p.clearedAmount > 0 || p.unclearedAmount > 0
//               ).length > 0 && (
//                 <div className="border rounded-lg p-4 space-y-3">
//                   <h4 className="font-semibold text-base">Payment History</h4>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b">
//                           <th className="text-left py-1 pr-2 font-medium text-muted-foreground">Mode</th>
//                           <th className="text-left py-1 pr-2 font-medium text-muted-foreground">Cleared</th>
//                           <th className="text-left py-1 pr-2 font-medium text-muted-foreground">Uncleared</th>
//                           <th className="text-left py-1 font-medium text-muted-foreground">Reference</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedFlat.booking.paymentDetails
//                           .filter((p) => p.clearedAmount > 0 || p.unclearedAmount > 0)
//                           .map((payment, idx) => (
//                             <tr key={idx} className="border-b last:border-0">
//                               <td className="py-2 pr-2">
//                                 {payment.paymentMode || "—"}
//                               </td>
//                               <td className="py-2 pr-2">
//                                 {formatINR(payment.clearedAmount)}
//                               </td>
//                               <td className="py-2 pr-2">
//                                 {formatINR(payment.unclearedAmount)}
//                               </td>
//                               <td className="py-2">
//                                 {payment.transactionId ||
//                                   payment.chequeNumber ||
//                                   payment.bankName ||
//                                   "—"}
//                               </td>
//                             </tr>
//                           ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Dialog>
//   );
// }













// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Building2, BookOpen, FileText, Users, Search, Eye, CreditCard, User, IndianRupee, Calendar } from "lucide-react";

// // Helper function to compute display status
// const getEffectiveFlatStatus = (flat) => {
//   // 1. Agar flat ka apna status cancelled hai
//   // 2. YA uski booking ka status cancelled/rejected hai
//   // 3. YA uski booking ka approvalStatus rejected hai
//   if (
//     flat.status === "cancelled" || 
//     flat.booking?.status === "cancelled" ||
//     flat.booking?.status === "rejected" ||
//     flat.booking?.approvalStatus === "rejected"
//   ) {
//     return "available";
//   }
  
//   // Agar upar me se kuch nahi hai, toh jo status backend se aa raha hai wahi dikhao
//   return flat.status || "available";
// };

// const StatusBadge = ({ status }) => {
//   const variant =
//     status === "available"
//       ? "success"
//       : status === "booked"
//       ? "default"
//       : status === "sold"
//       ? "secondary"
//       : "outline";
//   return <Badge variant={variant}>{status}</Badge>;
// };

// export default function ProjectDetailModal({
//   open,
//   onOpenChange,
//   project,
//   bookings,
//   bookingsPagination,
//   onBookingPageChange,
//   agreements,
//   siteEngineers,
//   loading,
//   onViewPayments,
//   // Search Props
//   bookingSearch,
//   setBookingSearch,
//   onBookingSearch,
// }) {
//   const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
//   const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
//   const [selectedFlat, setSelectedFlat] = useState(null);
  
//   // ✅ NAYA STATE: For Full Booking View Modal
//   const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

//   const towers = project?.towers || [];
//   const selectedTower = towers[selectedTowerIdx] || null;
//   const floors = selectedTower?.floors || [];
//   const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
//   const currentFloor = floors[safeFloorIdx] || null;
//   const currentFlats = currentFloor?.flats || [];

//   if (!project) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-xl">
//             <Building2 className="h-6 w-6" />
//             {project.name} – Inventory Dashboard
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="towers" className="mt-2">
//           <TabsList className="mb-4">
//             <TabsTrigger value="towers">
//               <Building2 className="h-4 w-4 mr-2" /> Towers & Flats
//             </TabsTrigger>
//             <TabsTrigger value="bookings">
//               <BookOpen className="h-4 w-4 mr-2" /> Bookings
//             </TabsTrigger>
//             <TabsTrigger value="agreements">
//               <FileText className="h-4 w-4 mr-2" /> Agreements
//             </TabsTrigger>
//             <TabsTrigger value="engineers">
//               <Users className="h-4 w-4 mr-2" /> Site Engineers
//             </TabsTrigger>
//           </TabsList>

//           {/* ==================== TOWERS & FLATS TAB ==================== */}
//           <TabsContent value="towers">
//             {towers.length > 0 ? (
//               <div className="space-y-4">
//                 {/* Tower selection */}
//                 <div>
//                   <h4 className="text-sm font-medium mb-2 text-muted-foreground">Select Tower</h4>
//                   <div className="flex gap-2 flex-wrap">
//                     {towers.map((tower, idx) => (
//                       <Button
//                         key={tower.towerName}
//                         variant={idx === selectedTowerIdx ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => {
//                           setSelectedTowerIdx(idx);
//                           setSelectedFloorIdx(0);
//                         }}
//                       >
//                         {tower.towerName}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Floor selection */}
//                 {selectedTower && (
//                   <div className="pt-2">
//                     <h4 className="text-sm font-medium mb-2 text-muted-foreground">Select Floor</h4>
//                     <div className="flex gap-2 flex-wrap">
//                       {floors.map((floor, idx) => (
//                         <Button
//                           key={floor.floorNumber}
//                           variant={idx === safeFloorIdx ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setSelectedFloorIdx(idx)}
//                         >
//                           Floor {floor.floorNumber}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Flats grid */}
//                 {currentFlats.length > 0 && (
//                   <div className="pt-4 border-t mt-4">
//                     <h3 className="font-semibold mb-4 flex items-center gap-2">
//                       {selectedTower.towerName} <span className="text-muted-foreground">/</span> Floor {currentFloor.floorNumber}
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                       {currentFlats.map((flat) => (
//                         <div
//                           key={flat.flatNumber}
//                           className="border rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-sm transition-all"
//                           onClick={() => setSelectedFlat(flat)}
//                         >
//                           <div className="flex justify-between items-start mb-2">
//                             <span className="font-bold text-lg">{flat.flatNumber}</span>
//                             <StatusBadge status={getEffectiveFlatStatus(flat)} />
//                           </div>
//                           <p className="text-sm text-muted-foreground mb-1">{flat.area} sq.ft.</p>
//                           <p className="font-semibold text-primary">
//                             ₹{flat.price?.toLocaleString('en-IN')}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {currentFlats.length === 0 && selectedTower && (
//                   <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg text-center mt-4">
//                     No flats available on this floor.
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground text-center py-8">No towers found in this project.</p>
//             )}
//           </TabsContent>

//           {/* ==================== BOOKINGS TAB ==================== */}
//           <TabsContent value="bookings">
//             <div className="space-y-4">
              
//               {/* ✅ NAYA: Search Bar API Integration */}
//               <div className="flex items-center gap-2 mb-4 bg-muted/20 p-3 rounded-lg border">
//                 <Input
//                   placeholder="Search by buyer name, email, phone, or flat no..."
//                   value={bookingSearch}
//                   onChange={(e) => setBookingSearch(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && onBookingSearch()}
//                   className="max-w-md bg-white"
//                 />
//                 <Button onClick={onBookingSearch}>
//                   <Search className="h-4 w-4 mr-2" /> Search
//                 </Button>
//               </div>

//               {bookings.length ? (
//                 <div className="border rounded-lg overflow-hidden">
//                   <table className="w-full text-sm">
//                     <thead className="bg-muted/50">
//                       <tr>
//                         <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buyer Details</th>
//                         <th className="text-left py-3 px-4 font-medium text-muted-foreground">Flat</th>
//                         <th className="text-left py-3 px-4 font-medium text-muted-foreground">Booking Amount</th>
//                         <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
//                         <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {bookings.map((b) => (
//                         <tr key={b.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
//                           <td className="py-3 px-4">
//                             <div className="font-medium text-foreground">{b.clientName}</div>
//                             <div className="text-xs text-muted-foreground">{b.clientEmail || b.clientDetails?.phone || "N/A"}</div>
//                           </td>
//                           <td className="py-3 px-4 font-medium">#{b.flatNumber}</td>
//                           <td className="py-3 px-4 font-semibold text-primary">{formatINR(b.bookingAmount)}</td>
//                           <td className="py-3 px-4">
//                             <div className="flex flex-col gap-1 items-start">
//                               <Badge variant="outline" className="text-[10px]">{b.approvalStatus}</Badge>
//                               <Badge variant="secondary" className="text-[10px]">{b.paymentStatus}</Badge>
//                             </div>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             {/* ✅ NAYA: Actions Menu */}
//                             <div className="flex justify-end gap-2">
//                               <Button 
//                                 variant="outline" 
//                                 size="sm" 
//                                 className="h-8"
//                                 onClick={() => setSelectedBookingDetails(b)}
//                               >
//                                 <Eye className="h-3.5 w-3.5 mr-1.5" /> View
//                               </Button>
//                               <Button 
//                                 variant="default" 
//                                 size="sm" 
//                                 className="h-8"
//                                 onClick={() => onViewPayments(b.id)}
//                               >
//                                 <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Payments
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
//                   <p className="text-muted-foreground">No bookings found for this search/project.</p>
//                 </div>
//               )}

//               {/* Pagination */}
//               {bookingsPagination?.total > 0 && (
//                 <div className="flex justify-between items-center py-2 px-1">
//                   <span className="text-sm text-muted-foreground">
//                     Page {bookingsPagination.page} of {bookingsPagination.pages} ({bookingsPagination.total} bookings)
//                   </span>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={bookingsPagination.page <= 1}
//                       onClick={() => onBookingPageChange(bookingsPagination.page - 1)}
//                     >
//                       Previous
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={bookingsPagination.page >= bookingsPagination.pages}
//                       onClick={() => onBookingPageChange(bookingsPagination.page + 1)}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           {/* ==================== AGREEMENTS TAB ==================== */}
//           <TabsContent value="agreements">
//             {agreements.length ? (
//               <div className="border rounded-lg overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-muted/50">
//                     <tr>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Booking ID</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buyer</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Flat</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Agreement Date</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {agreements.map((a) => (
//                       <tr key={a.bookingId} className="border-b last:border-0 hover:bg-muted/10">
//                         <td className="py-3 px-4 font-mono text-xs">{a.bookingId}</td>
//                         <td className="py-3 px-4">{a.clientName}</td>
//                         <td className="py-3 px-4 font-medium">#{a.flatNumber}</td>
//                         <td className="py-3 px-4">
//                           {a.agreementDate ? formatDate(a.agreementDate) : <span className="text-muted-foreground">—</span>}
//                         </td>
//                         <td className="py-3 px-4">
//                           <Badge variant={a.status === 'approved' ? 'success' : 'outline'}>{a.status}</Badge>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground text-center py-8">No agreements found.</p>
//             )}
//           </TabsContent>

//           {/* ==================== SITE ENGINEERS TAB ==================== */}
//           <TabsContent value="engineers">
//             {siteEngineers.length ? (
//               <div className="border rounded-lg overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-muted/50">
//                     <tr>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {siteEngineers.map((eng) => (
//                       <tr key={eng.id} className="border-b last:border-0 hover:bg-muted/10">
//                         <td className="py-3 px-4 font-medium">{eng.name}</td>
//                         <td className="py-3 px-4">{eng.email}</td>
//                         <td className="py-3 px-4">{eng.phone}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground text-center py-8">No site engineers assigned.</p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </DialogContent>

//       {/* ========================================================================= */}
//       {/* ==================== NEW: FULL BOOKING DETAILS MODAL ==================== */}
//       {/* ========================================================================= */}
//       <Dialog open={!!selectedBookingDetails} onOpenChange={() => setSelectedBookingDetails(null)}>
//         <DialogContent className="sm:max-w-3xl">
//           <DialogHeader className="border-b pb-4 mb-4">
//             <DialogTitle className="flex items-center justify-between text-xl">
//               <span className="flex items-center gap-2">
//                 <BookOpen className="h-5 w-5 text-primary" />
//                 Booking Overview (Flat #{selectedBookingDetails?.flatNumber})
//               </span>
//               <Badge variant="default" className="capitalize">{selectedBookingDetails?.status}</Badge>
//             </DialogTitle>
//           </DialogHeader>

//           {selectedBookingDetails && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               {/* Card 1: Client Details */}
//               <div className="border rounded-xl p-5 bg-muted/10">
//                 <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary border-b pb-2">
//                   <User className="h-4 w-4" /> Client Information
//                 </div>
//                 <div className="space-y-3 text-sm">
//                   <div className="grid grid-cols-3 gap-2">
//                     <span className="text-muted-foreground font-medium">Name:</span>
//                     <span className="col-span-2 font-semibold">{selectedBookingDetails.clientName || 'N/A'}</span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2">
//                     <span className="text-muted-foreground font-medium">Email:</span>
//                     <span className="col-span-2">{selectedBookingDetails.clientEmail || 'N/A'}</span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2">
//                     <span className="text-muted-foreground font-medium">Phone:</span>
//                     <span className="col-span-2">{selectedBookingDetails.clientDetails?.phone || 'N/A'}</span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t">
//                     <span className="text-muted-foreground font-medium">Booking Date:</span>
//                     <span className="col-span-2">
//                       {selectedBookingDetails.bookingDate ? formatDate(selectedBookingDetails.bookingDate) : 'N/A'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 2: Financial/Amount Details */}
//               <div className="border rounded-xl p-5 bg-muted/10">
//                 <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary border-b pb-2">
//                   <IndianRupee className="h-4 w-4" /> Financial Summary
//                 </div>
//                 <div className="space-y-3 text-sm">
//                   <div className="grid grid-cols-2 gap-2">
//                     <span className="text-muted-foreground font-medium">Total Booking Amount:</span>
//                     <span className="font-bold text-base">{formatINR(selectedBookingDetails.bookingAmount)}</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 text-green-600">
//                     <span className="font-medium">Total Paid:</span>
//                     <span className="font-bold">{formatINR(selectedBookingDetails.totalPaid)}</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 text-red-500 pb-2 mb-2 border-b">
//                     <span className="font-medium">Remaining Amount:</span>
//                     <span className="font-bold">{formatINR(selectedBookingDetails.remainingAmount)}</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <span className="text-muted-foreground font-medium">Payment Status:</span>
//                     <span><Badge variant="outline" className="capitalize">{selectedBookingDetails.paymentStatus}</Badge></span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <span className="text-muted-foreground font-medium">Approval Status:</span>
//                     <span><Badge variant="secondary" className="capitalize">{selectedBookingDetails.approvalStatus}</Badge></span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 3: Next Installment Details (Full Width if needed) */}
//               {(selectedBookingDetails.nextInstallmentAmount > 0 || selectedBookingDetails.nextInstallmentDue) && (
//                 <div className="col-span-1 md:col-span-2 border rounded-xl p-5 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
//                   <div className="flex items-center gap-2 font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400">
//                     <Calendar className="h-4 w-4" /> Next Installment Details
//                   </div>
//                   <div className="flex flex-col md:flex-row gap-6 text-sm">
//                     <div>
//                       <span className="text-muted-foreground block mb-1">Due Amount</span>
//                       <span className="font-bold text-lg text-foreground">
//                         {formatINR(selectedBookingDetails.nextInstallmentAmount)}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground block mb-1">Due Date</span>
//                       <span className="font-semibold text-base text-foreground">
//                         {selectedBookingDetails.nextInstallmentDue ? formatDate(selectedBookingDetails.nextInstallmentDue) : 'Not specified'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//       {/* ========================================================================= */}


//       {/* ==================== EXISTING FLAT DETAILS MODAL ==================== */}
//       <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
//         <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
//           {/* Flat details UI (same as before) ... */}
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <span>Flat {selectedFlat?.flatNumber} Details</span>
//               {selectedFlat && <StatusBadge status={getEffectiveFlatStatus(selectedFlat)} />}
//             </DialogTitle>
//             {selectedFlat && (
//               <p className="text-sm text-muted-foreground">
//                 {selectedFlat.area} sqft · ₹{selectedFlat.price?.toLocaleString('en-IN')}
//               </p>
//             )}
//           </DialogHeader>

//           {selectedFlat && (
//             <div className="space-y-6">
//               {/* Flat Information Card */}
//               <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div><span className="text-muted-foreground">Bedrooms:</span> {selectedFlat.bedrooms}</div>
//                 <div><span className="text-muted-foreground">Bathrooms:</span> {selectedFlat.bathrooms}</div>
//                 <div><span className="text-muted-foreground">Facing:</span> {selectedFlat.facing || "—"}</div>
//                 <div><span className="text-muted-foreground">Parking:</span> {selectedFlat.parking ? "Yes" : "No"}</div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Dialog>
//   );
// }













// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Building2, BookOpen, FileText, Users, Search, Eye, CreditCard, User, IndianRupee, Calendar } from "lucide-react";

// // Helper function to compute display status
// const getEffectiveFlatStatus = (flat) => {
//   // 1. Agar flat ka apna status cancelled hai
//   // 2. YA uski booking ka status cancelled/rejected hai
//   // 3. YA uski booking ka approvalStatus rejected hai
//   if (
//     flat.status === "cancelled" || 
//     flat.booking?.status === "cancelled" ||
//     flat.booking?.status === "rejected" ||
//     flat.booking?.approvalStatus === "rejected"
//   ) {
//     return "available";
//   }
  
//   // Agar upar me se kuch nahi hai, toh jo status backend se aa raha hai wahi dikhao
//   return flat.status || "available";
// };

// const StatusBadge = ({ status }) => {
//   const variant =
//     status === "available"
//       ? "success"
//       : status === "booked"
//       ? "default"
//       : status === "sold"
//       ? "secondary"
//       : "outline";
//   return <Badge variant={variant}>{status}</Badge>;
// };

// export default function ProjectDetailModal({
//   open,
//   onOpenChange,
//   project,
//   bookings,
//   bookingsPagination,
//   onBookingPageChange,
//   agreements,
//   siteEngineers,
//   loading,
//   onViewPayments,
//   // Search Props
//   bookingSearch,
//   setBookingSearch,
//   onBookingSearch,
// }) {
//   const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
//   const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
//   const [selectedFlat, setSelectedFlat] = useState(null);
  
//   // ✅ NAYA STATE: For Full Booking View Modal
//   const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

//   const towers = project?.towers || [];
//   const selectedTower = towers[selectedTowerIdx] || null;
//   const floors = selectedTower?.floors || [];
//   const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
//   const currentFloor = floors[safeFloorIdx] || null;
//   const currentFlats = currentFloor?.flats || [];

//   if (!project) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-xl">
//             <Building2 className="h-6 w-6" />
//             {project.name} – Inventory Dashboard
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="towers" className="mt-2">
//           <TabsList className="mb-4">
//             <TabsTrigger value="towers">
//               <Building2 className="h-4 w-4 mr-2" /> Towers & Flats
//             </TabsTrigger>
//             <TabsTrigger value="bookings">
//               <BookOpen className="h-4 w-4 mr-2" /> Bookings
//             </TabsTrigger>
//             <TabsTrigger value="agreements">
//               <FileText className="h-4 w-4 mr-2" /> Agreements
//             </TabsTrigger>
//             <TabsTrigger value="engineers">
//               <Users className="h-4 w-4 mr-2" /> Site Engineers
//             </TabsTrigger>
//           </TabsList>

//           {/* ==================== TOWERS & FLATS TAB ==================== */}
//           <TabsContent value="towers">
//             {towers.length > 0 ? (
//               <div className="space-y-4">
//                 {/* Tower selection */}
//                 <div>
//                   <h4 className="text-sm font-medium mb-2 text-muted-foreground">Select Tower</h4>
//                   <div className="flex gap-2 flex-wrap">
//                     {towers.map((tower, idx) => (
//                       <Button
//                         key={tower.towerName}
//                         variant={idx === selectedTowerIdx ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => {
//                           setSelectedTowerIdx(idx);
//                           setSelectedFloorIdx(0);
//                         }}
//                       >
//                         {tower.towerName}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Floor selection */}
//                 {selectedTower && (
//                   <div className="pt-2">
//                     <h4 className="text-sm font-medium mb-2 text-muted-foreground">Select Floor</h4>
//                     <div className="flex gap-2 flex-wrap">
//                       {floors.map((floor, idx) => (
//                         <Button
//                           key={floor.floorNumber}
//                           variant={idx === safeFloorIdx ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setSelectedFloorIdx(idx)}
//                         >
//                           Floor {floor.floorNumber}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Flats grid */}
//                 {currentFlats.length > 0 && (
//                   <div className="pt-4 border-t mt-4">
//                     <h3 className="font-semibold mb-4 flex items-center gap-2">
//                       {selectedTower.towerName} <span className="text-muted-foreground">/</span> Floor {currentFloor.floorNumber}
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                       {/* ✅ UPDATED: Sirf Booked flats pe color aayega */}
//                       {currentFlats.map((flat) => {
//                         const effectiveStatus = getEffectiveFlatStatus(flat);
//                         const isBooked = effectiveStatus === "booked";

//                         return (
//                           <div
//                             key={flat.flatNumber}
//                             className={`border rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-sm transition-all ${
//                               isBooked ? "bg-primary/10 border-primary shadow-sm dark:bg-primary/20" : ""
//                             }`}
//                             onClick={() => setSelectedFlat(flat)}
//                           >
//                             <div className="flex justify-between items-start mb-2">
//                               <span className="font-bold text-lg">{flat.flatNumber}</span>
//                               <StatusBadge status={effectiveStatus} />
//                             </div>
//                             <p className="text-sm text-muted-foreground mb-1">{flat.area} sq.ft.</p>
//                             <p className="font-semibold text-primary">
//                               ₹{flat.price?.toLocaleString('en-IN') || 0}
//                             </p>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 {currentFlats.length === 0 && selectedTower && (
//                   <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg text-center mt-4">
//                     No flats available on this floor.
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground text-center py-8">No towers found in this project.</p>
//             )}
//           </TabsContent>

//           {/* ==================== BOOKINGS TAB ==================== */}
//           <TabsContent value="bookings">
//             <div className="space-y-4">
              
//               {/* ✅ Search Bar API Integration */}
//               <div className="flex items-center gap-2 mb-4 bg-muted/20 p-3 rounded-lg border">
//                 <Input
//                   placeholder="Search by buyer name, email, phone, or flat no..."
//                   value={bookingSearch}
//                   onChange={(e) => setBookingSearch(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && onBookingSearch()}
//                   className="max-w-md bg-white"
//                 />
//                 <Button onClick={onBookingSearch}>
//                   <Search className="h-4 w-4 mr-2" /> Search
//                 </Button>
//               </div>

//               {bookings.length ? (
//                 <div className="border rounded-lg overflow-hidden">
//                   <table className="w-full text-sm">
//                     <thead className="bg-muted/50">
//                       <tr>
//                         <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buyer Details</th>
//                         <th className="text-left py-3 px-4 font-medium text-muted-foreground">Flat</th>
//                         <th className="text-left py-3 px-4 font-medium text-muted-foreground">Booking Amount</th>
//                         <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
//                         <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {bookings.map((b) => (
//                         <tr key={b.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
//                           <td className="py-3 px-4">
//                             <div className="font-medium text-foreground">{b.clientName}</div>
//                             <div className="text-xs text-muted-foreground">{b.clientEmail || b.clientDetails?.phone || "N/A"}</div>
//                           </td>
//                           <td className="py-3 px-4 font-medium">#{b.flatNumber}</td>
//                           <td className="py-3 px-4 font-semibold text-primary">{formatINR(b.bookingAmount)}</td>
//                           <td className="py-3 px-4">
//                             <div className="flex flex-col gap-1 items-start">
//                               <Badge variant="outline" className="text-[10px]">{b.approvalStatus}</Badge>
//                               <Badge variant="secondary" className="text-[10px]">{b.paymentStatus}</Badge>
//                             </div>
//                           </td>
//                           <td className="py-3 px-4 text-right">
//                             {/* ✅ Actions Menu */}
//                             <div className="flex justify-end gap-2">
//                               <Button 
//                                 variant="outline" 
//                                 size="sm" 
//                                 className="h-8"
//                                 onClick={() => setSelectedBookingDetails(b)}
//                               >
//                                 <Eye className="h-3.5 w-3.5 mr-1.5" /> View
//                               </Button>
//                               <Button 
//                                 variant="default" 
//                                 size="sm" 
//                                 className="h-8"
//                                 onClick={() => onViewPayments(b.id)}
//                               >
//                                 <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Payments
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
//                   <p className="text-muted-foreground">No bookings found for this search/project.</p>
//                 </div>
//               )}

//               {/* Pagination */}
//               {bookingsPagination?.total > 0 && (
//                 <div className="flex justify-between items-center py-2 px-1">
//                   <span className="text-sm text-muted-foreground">
//                     Page {bookingsPagination.page} of {bookingsPagination.pages} ({bookingsPagination.total} bookings)
//                   </span>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={bookingsPagination.page <= 1}
//                       onClick={() => onBookingPageChange(bookingsPagination.page - 1)}
//                     >
//                       Previous
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={bookingsPagination.page >= bookingsPagination.pages}
//                       onClick={() => onBookingPageChange(bookingsPagination.page + 1)}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           {/* ==================== AGREEMENTS TAB ==================== */}
//           <TabsContent value="agreements">
//             {agreements.length ? (
//               <div className="border rounded-lg overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-muted/50">
//                     <tr>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Booking ID</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buyer</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Flat</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Agreement Date</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {agreements.map((a) => (
//                       <tr key={a.bookingId} className="border-b last:border-0 hover:bg-muted/10">
//                         <td className="py-3 px-4 font-mono text-xs">{a.bookingId}</td>
//                         <td className="py-3 px-4">{a.clientName}</td>
//                         <td className="py-3 px-4 font-medium">#{a.flatNumber}</td>
//                         <td className="py-3 px-4">
//                           {a.agreementDate ? formatDate(a.agreementDate) : <span className="text-muted-foreground">—</span>}
//                         </td>
//                         <td className="py-3 px-4">
//                           <Badge variant={a.status === 'approved' ? 'success' : 'outline'}>{a.status}</Badge>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground text-center py-8">No agreements found.</p>
//             )}
//           </TabsContent>

//           {/* ==================== SITE ENGINEERS TAB ==================== */}
//           <TabsContent value="engineers">
//             {siteEngineers.length ? (
//               <div className="border rounded-lg overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-muted/50">
//                     <tr>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
//                       <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {siteEngineers.map((eng) => (
//                       <tr key={eng.id} className="border-b last:border-0 hover:bg-muted/10">
//                         <td className="py-3 px-4 font-medium">{eng.name}</td>
//                         <td className="py-3 px-4">{eng.email}</td>
//                         <td className="py-3 px-4">{eng.phone}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground text-center py-8">No site engineers assigned.</p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </DialogContent>

//       {/* ========================================================================= */}
//       {/* ==================== FULL BOOKING DETAILS MODAL ==================== */}
//       {/* ========================================================================= */}
//       <Dialog open={!!selectedBookingDetails} onOpenChange={() => setSelectedBookingDetails(null)}>
//         <DialogContent className="sm:max-w-3xl">
//           <DialogHeader className="border-b pb-4 mb-4">
//             <DialogTitle className="flex items-center justify-between text-xl">
//               <span className="flex items-center gap-2">
//                 <BookOpen className="h-5 w-5 text-primary" />
//                 Booking Overview (Flat #{selectedBookingDetails?.flatNumber})
//               </span>
//               <Badge variant="default" className="capitalize">{selectedBookingDetails?.status}</Badge>
//             </DialogTitle>
//           </DialogHeader>

//           {selectedBookingDetails && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
//               {/* Card 1: Client Details */}
//               <div className="border rounded-xl p-5 bg-muted/10">
//                 <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary border-b pb-2">
//                   <User className="h-4 w-4" /> Client Information
//                 </div>
//                 <div className="space-y-3 text-sm">
//                   <div className="grid grid-cols-3 gap-2">
//                     <span className="text-muted-foreground font-medium">Name:</span>
//                     <span className="col-span-2 font-semibold">{selectedBookingDetails.clientName || 'N/A'}</span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2">
//                     <span className="text-muted-foreground font-medium">Email:</span>
//                     <span className="col-span-2">{selectedBookingDetails.clientEmail || 'N/A'}</span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2">
//                     <span className="text-muted-foreground font-medium">Phone:</span>
//                     <span className="col-span-2">{selectedBookingDetails.clientDetails?.phone || 'N/A'}</span>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t">
//                     <span className="text-muted-foreground font-medium">Booking Date:</span>
//                     <span className="col-span-2">
//                       {selectedBookingDetails.bookingDate ? formatDate(selectedBookingDetails.bookingDate) : 'N/A'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 2: Financial/Amount Details */}
//               <div className="border rounded-xl p-5 bg-muted/10">
//                 <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary border-b pb-2">
//                   <IndianRupee className="h-4 w-4" /> Financial Summary
//                 </div>
//                 <div className="space-y-3 text-sm">
//                   <div className="grid grid-cols-2 gap-2">
//                     <span className="text-muted-foreground font-medium">Total Booking Amount:</span>
//                     <span className="font-bold text-base">{formatINR(selectedBookingDetails.bookingAmount)}</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 text-green-600">
//                     <span className="font-medium">Total Paid:</span>
//                     <span className="font-bold">{formatINR(selectedBookingDetails.totalPaid)}</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 text-red-500 pb-2 mb-2 border-b">
//                     <span className="font-medium">Remaining Amount:</span>
//                     <span className="font-bold">{formatINR(selectedBookingDetails.remainingAmount)}</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <span className="text-muted-foreground font-medium">Payment Status:</span>
//                     <span><Badge variant="outline" className="capitalize">{selectedBookingDetails.paymentStatus}</Badge></span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <span className="text-muted-foreground font-medium">Approval Status:</span>
//                     <span><Badge variant="secondary" className="capitalize">{selectedBookingDetails.approvalStatus}</Badge></span>
//                   </div>
//                 </div>
//               </div>

//               {/* Card 3: Next Installment Details */}
//               {(selectedBookingDetails.nextInstallmentAmount > 0 || selectedBookingDetails.nextInstallmentDue) && (
//                 <div className="col-span-1 md:col-span-2 border rounded-xl p-5 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
//                   <div className="flex items-center gap-2 font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400">
//                     <Calendar className="h-4 w-4" /> Next Installment Details
//                   </div>
//                   <div className="flex flex-col md:flex-row gap-6 text-sm">
//                     <div>
//                       <span className="text-muted-foreground block mb-1">Due Amount</span>
//                       <span className="font-bold text-lg text-foreground">
//                         {formatINR(selectedBookingDetails.nextInstallmentAmount)}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground block mb-1">Due Date</span>
//                       <span className="font-semibold text-base text-foreground">
//                         {selectedBookingDetails.nextInstallmentDue ? formatDate(selectedBookingDetails.nextInstallmentDue) : 'Not specified'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//       {/* ========================================================================= */}


//       {/* ==================== EXISTING FLAT DETAILS MODAL ==================== */}
//       <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
//         <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <span>Flat {selectedFlat?.flatNumber} Details</span>
//               {selectedFlat && <StatusBadge status={getEffectiveFlatStatus(selectedFlat)} />}
//             </DialogTitle>
//             {selectedFlat && (
//               <p className="text-sm text-muted-foreground">
//                 {selectedFlat.area} sqft · ₹{selectedFlat.price?.toLocaleString('en-IN') || 0}
//               </p>
//             )}
//           </DialogHeader>

//           {selectedFlat && (
//             <div className="space-y-6">
//               {/* Flat Information Card */}
//               <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div><span className="text-muted-foreground">Bedrooms:</span> {selectedFlat.bedrooms}</div>
//                 <div><span className="text-muted-foreground">Bathrooms:</span> {selectedFlat.bathrooms}</div>
//                 <div><span className="text-muted-foreground">Facing:</span> {selectedFlat.facing || "—"}</div>
//                 <div><span className="text-muted-foreground">Parking:</span> {selectedFlat.parking ? "Yes" : "No"}</div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Dialog>
//   );
// }



import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/helpers";
import { Building2, BookOpen, FileText, Search, Eye, CreditCard, User, IndianRupee, Calendar } from "lucide-react";

// Helper function to compute display status
const getEffectiveFlatStatus = (flat) => {
  // 1. Agar flat ka apna status cancelled hai
  // 2. YA uski booking ka status cancelled/rejected hai
  // 3. YA uski booking ka approvalStatus rejected hai
  if (
    flat.status === "cancelled" || 
    flat.booking?.status === "cancelled" ||
    flat.booking?.status === "rejected" ||
    flat.booking?.approvalStatus === "rejected"
  ) {
    return "available";
  }
  
  // Agar upar me se kuch nahi hai, toh jo status backend se aa raha hai wahi dikhao
  return flat.status || "available";
};

const StatusBadge = ({ status }) => {
  const variant =
    status === "available"
      ? "success"
      : status === "booked"
      ? "default"
      : status === "sold"
      ? "secondary"
      : "outline";
  return <Badge variant={variant}>{status}</Badge>;
};

export default function ProjectDetailModal({
  open,
  onOpenChange,
  project,
  bookings,
  bookingsPagination,
  onBookingPageChange,
  agreements, // Keep props just in case parent passes them, even if unused here
  siteEngineers,
  loading,
  onViewPayments,
  // Search Props
  bookingSearch,
  setBookingSearch,
  onBookingSearch,
}) {
  const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [selectedFlat, setSelectedFlat] = useState(null);
  
  // ✅ STATE: For Full Booking View Modal
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const towers = project?.towers || [];
  const selectedTower = towers[selectedTowerIdx] || null;
  const floors = selectedTower?.floors || [];
  const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
  const currentFloor = floors[safeFloorIdx] || null;
  const currentFlats = currentFloor?.flats || [];

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6" />
            {project.name} – Inventory Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="towers" className="mt-2">
          <TabsList className="mb-4">
            <TabsTrigger value="towers">
              <Building2 className="h-4 w-4 mr-2" /> Towers & Flats
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <BookOpen className="h-4 w-4 mr-2" /> Bookings
            </TabsTrigger>
          </TabsList>

          {/* ==================== TOWERS & FLATS TAB ==================== */}
          <TabsContent value="towers">
            {towers.length > 0 ? (
              <div className="space-y-4">
                {/* Tower selection */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Select Tower</h4>
                  <div className="flex gap-2 flex-wrap">
                    {towers.map((tower, idx) => (
                      <Button
                        key={tower.towerName}
                        variant={idx === selectedTowerIdx ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedTowerIdx(idx);
                          setSelectedFloorIdx(0);
                        }}
                      >
                        {tower.towerName}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Floor selection */}
                {selectedTower && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Select Floor</h4>
                    <div className="flex gap-2 flex-wrap">
                      {floors.map((floor, idx) => (
                        <Button
                          key={floor.floorNumber}
                          variant={idx === safeFloorIdx ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFloorIdx(idx)}
                        >
                          Floor {floor.floorNumber}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flats grid */}
                {currentFlats.length > 0 && (
                  <div className="pt-4 border-t mt-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      {selectedTower.towerName} <span className="text-muted-foreground">/</span> Floor {currentFloor.floorNumber}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {currentFlats.map((flat) => {
                        const effectiveStatus = getEffectiveFlatStatus(flat);
                        const isBooked = effectiveStatus === "booked";

                        return (
                          <div
                            key={flat.flatNumber}
                            className={`border rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-sm transition-all ${
                              isBooked ? "bg-primary/10 border-primary shadow-sm dark:bg-primary/20" : ""
                            }`}
                            onClick={() => setSelectedFlat(flat)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-lg">{flat.flatNumber}</span>
                              <StatusBadge status={effectiveStatus} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{flat.area} sq.ft.</p>
                            <p className="font-semibold text-primary">
                              ₹{flat.price?.toLocaleString('en-IN') || 0}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {currentFlats.length === 0 && selectedTower && (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg text-center mt-4">
                    No flats available on this floor.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No towers found in this project.</p>
            )}
          </TabsContent>

          {/* ==================== BOOKINGS TAB ==================== */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              
              {/* ✅ Search Bar API Integration */}
              <div className="flex items-center gap-2 mb-4 bg-muted/20 p-3 rounded-lg border">
                <Input
                  placeholder="Search by buyer name, email, phone, or flat no..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onBookingSearch()}
                  className="max-w-md bg-white"
                />
                <Button onClick={onBookingSearch}>
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>

              {bookings.length ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buyer Details</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Flat</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Booking Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground">{b.clientName}</div>
                            <div className="text-xs text-muted-foreground">{b.clientEmail || b.clientDetails?.phone || "N/A"}</div>
                          </td>
                          <td className="py-3 px-4 font-medium">#{b.flatNumber}</td>
                          <td className="py-3 px-4 font-semibold text-primary">{formatINR(b.bookingAmount)}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <Badge variant="outline" className="text-[10px]">{b.approvalStatus}</Badge>
                              <Badge variant="secondary" className="text-[10px]">{b.paymentStatus}</Badge>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {/* ✅ Actions Menu */}
                            <div className="flex justify-end gap-2">
                              {/* ✅ NAYA BUTTON: Agreement dikhane ke liye (Sirf tab dikhega jab document url available ho) */}
                              {b.agreementDocumentUrl && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  onClick={() => window.open(b.agreementDocumentUrl, '_blank')}
                                  title="View Agreement Document"
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1.5" /> Agreement
                                </Button>
                              )}

                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => setSelectedBookingDetails(b)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="h-8"
                                onClick={() => onViewPayments(b.id)}
                              >
                                <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Payments
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No bookings found for this search/project.</p>
                </div>
              )}

              {/* Pagination */}
              {bookingsPagination?.total > 0 && (
                <div className="flex justify-between items-center py-2 px-1">
                  <span className="text-sm text-muted-foreground">
                    Page {bookingsPagination.page} of {bookingsPagination.pages} ({bookingsPagination.total} bookings)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={bookingsPagination.page <= 1}
                      onClick={() => onBookingPageChange(bookingsPagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={bookingsPagination.page >= bookingsPagination.pages}
                      onClick={() => onBookingPageChange(bookingsPagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>

      {/* ========================================================================= */}
      {/* ==================== FULL BOOKING DETAILS MODAL ==================== */}
      {/* ========================================================================= */}
      <Dialog open={!!selectedBookingDetails} onOpenChange={() => setSelectedBookingDetails(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="flex items-center justify-between text-xl">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Booking Overview (Flat #{selectedBookingDetails?.flatNumber})
              </span>
              <Badge variant="default" className="capitalize">{selectedBookingDetails?.status}</Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedBookingDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Client Details */}
              <div className="border rounded-xl p-5 bg-muted/10">
                <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary border-b pb-2">
                  <User className="h-4 w-4" /> Client Information
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Name:</span>
                    <span className="col-span-2 font-semibold">{selectedBookingDetails.clientName || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Email:</span>
                    <span className="col-span-2">{selectedBookingDetails.clientEmail || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Phone:</span>
                    <span className="col-span-2">{selectedBookingDetails.clientDetails?.phone || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t">
                    <span className="text-muted-foreground font-medium">Booking Date:</span>
                    <span className="col-span-2">
                      {selectedBookingDetails.bookingDate ? formatDate(selectedBookingDetails.bookingDate) : 'N/A'}
                    </span>
                  </div>
                  
                  {/* ✅ NAYA LINK: Agreement Details Modal me bhi */}
                  {selectedBookingDetails.agreementDocumentUrl && (
                    <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t">
                      <span className="text-muted-foreground font-medium">Agreement:</span>
                      <span className="col-span-2">
                        <a 
                          href={selectedBookingDetails.agreementDocumentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-3.5 w-3.5" /> View Document
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Financial/Amount Details */}
              <div className="border rounded-xl p-5 bg-muted/10">
                <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary border-b pb-2">
                  <IndianRupee className="h-4 w-4" /> Financial Summary
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground font-medium">Total Booking Amount:</span>
                    <span className="font-bold text-base">{formatINR(selectedBookingDetails.bookingAmount)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-green-600">
                    <span className="font-medium">Total Paid:</span>
                    <span className="font-bold">{formatINR(selectedBookingDetails.totalPaid)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-red-500 pb-2 mb-2 border-b">
                    <span className="font-medium">Remaining Amount:</span>
                    <span className="font-bold">{formatINR(selectedBookingDetails.remainingAmount)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground font-medium">Payment Status:</span>
                    <span><Badge variant="outline" className="capitalize">{selectedBookingDetails.paymentStatus}</Badge></span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground font-medium">Approval Status:</span>
                    <span><Badge variant="secondary" className="capitalize">{selectedBookingDetails.approvalStatus}</Badge></span>
                  </div>
                </div>
              </div>

              {/* Card 3: Next Installment Details */}
              {(selectedBookingDetails.nextInstallmentAmount > 0 || selectedBookingDetails.nextInstallmentDue) && (
                <div className="col-span-1 md:col-span-2 border rounded-xl p-5 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400">
                    <Calendar className="h-4 w-4" /> Next Installment Details
                  </div>
                  <div className="flex flex-col md:flex-row gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Due Amount</span>
                      <span className="font-bold text-lg text-foreground">
                        {formatINR(selectedBookingDetails.nextInstallmentAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Due Date</span>
                      <span className="font-semibold text-base text-foreground">
                        {selectedBookingDetails.nextInstallmentDue ? formatDate(selectedBookingDetails.nextInstallmentDue) : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* ========================================================================= */}


      {/* ==================== EXISTING FLAT DETAILS MODAL ==================== */}
      <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Flat {selectedFlat?.flatNumber} Details</span>
              {selectedFlat && <StatusBadge status={getEffectiveFlatStatus(selectedFlat)} />}
            </DialogTitle>
            {selectedFlat && (
              <p className="text-sm text-muted-foreground">
                {selectedFlat.area} sqft · ₹{selectedFlat.price?.toLocaleString('en-IN') || 0}
              </p>
            )}
          </DialogHeader>

          {selectedFlat && (
            <div className="space-y-6">
              {/* Flat Information Card */}
              <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div><span className="text-muted-foreground">Bedrooms:</span> {selectedFlat.bedrooms}</div>
                <div><span className="text-muted-foreground">Bathrooms:</span> {selectedFlat.bathrooms}</div>
                <div><span className="text-muted-foreground">Facing:</span> {selectedFlat.facing || "—"}</div>
                <div><span className="text-muted-foreground">Parking:</span> {selectedFlat.parking ? "Yes" : "No"}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}