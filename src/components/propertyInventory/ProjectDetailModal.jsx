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

//           {/* Towers & Flats */}
//           {/* <TabsContent value="towers">
//             {project.towers?.length ? (
//               project.towers.map((tower) => (
//                 <div key={tower.towerName} className="mb-6">
//                   <h3 className="text-lg font-semibold mb-2">
//                     {tower.towerName}
//                   </h3>
//                   <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
//                     <span>Total Floors: {tower.totalFloors}</span>
//                     <span>Total Flats: {tower.totalFlats}</span>
//                     <span>Available: {tower.availableFlats}</span>
//                     <span>Booked: {tower.bookedFlats}</span>
//                   </div>
//                   {tower.floors?.map((floor) => (
//                     <div key={floor.floorNumber} className="mb-3">
//                       <h4 className="font-medium text-sm">
//                         Floor {floor.floorNumber}
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-1">
//                         {floor.flats?.map((flat) => (
//                           <div
//                             key={flat.flatNumber}
//                             className="border rounded-md p-2 text-sm space-y-1"
//                           >
//                             <div className="flex justify-between">
//                               <span className="font-medium">
//                                 {flat.flatNumber}
//                               </span>
//                               <StatusBadge status={flat.status} />
//                             </div>
//                             <div className="text-xs text-muted-foreground">
//                               {flat.area} sqft, ₹{flat.price?.toLocaleString()}
//                             </div>
//                             {flat.facing && (
//                               <div className="text-xs">
//                                 Facing: {flat.facing}
//                               </div>
//                             )}
//                             {flat.booking && (
//                               <div className="text-xs space-y-1 mt-1 border-t pt-1">
//                                 <p>Booking ID: {flat.booking.bookingId}</p>
//                                 <p>Buyer: {flat.booking.client?.name}</p>
//                                 <p>
//                                   Paid: ₹
//                                   {flat.booking.totalPaid?.toLocaleString()}
//                                 </p>
//                                 <p>
//                                   Payment Status:{" "}
//                                   <Badge>{flat.booking.paymentStatus}</Badge>
//                                 </p>
//                                 <p>Agreement: {flat.booking.agreementStatus}</p>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-muted-foreground">
//                 No tower data available.
//               </p>
//             )}
//           </TabsContent> */}

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
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr>
//                     <th>Buyer</th>
//                     <th>Flat</th>
//                     <th>Booking Amount</th>
//                     <th>Payment Status</th>
//                     <th>Next Due</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.map((b) => (
//                     <tr key={b.id}>
//                       <td>
//                         {b.clientName}
//                         <br />
//                         <span className="text-xs text-muted-foreground">
//                           {b.clientEmail}
//                         </span>
//                       </td>
//                       <td>{b.flatNumber}</td>
//                       <td>{formatINR(b.bookingAmount)}</td>
//                       <td>
//                         <Badge>{b.paymentStatus}</Badge>
//                       </td>
//                       <td>
//                         {b.nextInstallmentDue
//                           ? formatDate(b.nextInstallmentDue)
//                           : "—"}
//                       </td>
//                       <td>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => onViewPayments(b.id)}
//                         >
//                           Payments
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
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
// import { Building2, BookOpen, FileText, Users, Link as LinkIcon } from "lucide-react";

// const StatusBadge = ({ status }) => {
//   const variant =
//     status === "available" ? "success"
//       : status === "booked" ? "default"
//         : status === "sold" ? "secondary"
//           : "outline";
//   return <Badge variant={variant}>{status}</Badge>;
// };

// export default function ProjectDetailModal({
//   open,
//   onOpenChange,
//   project,
//   bookings,
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
//             <TabsTrigger value="towers"><Building2 className="h-4 w-4 mr-1" /> Towers & Flats</TabsTrigger>
//             <TabsTrigger value="bookings"><BookOpen className="h-4 w-4 mr-1" /> Bookings</TabsTrigger>
//             <TabsTrigger value="agreements"><FileText className="h-4 w-4 mr-1" /> Agreements</TabsTrigger>
//             <TabsTrigger value="engineers"><Users className="h-4 w-4 mr-1" /> Site Engineers</TabsTrigger>
//           </TabsList>

//           {/* Towers & Flats */}
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
//                             <StatusBadge status={flat.status} />
//                           </div>
//                           <p className="text-sm">{flat.area} sqft</p>
//                           <p className="text-sm font-semibold">₹{flat.price?.toLocaleString()}</p>
//                           {(flat.facing || flat.features?.facing) && (
//                             <p className="text-xs text-muted-foreground">Facing: {flat.facing || flat.features?.facing}</p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {currentFlats.length === 0 && selectedTower && (
//                   <p className="text-sm text-muted-foreground">No flats on this floor.</p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No towers found.</p>
//             )}
//           </TabsContent>

//           {/* Bookings */}
//           <TabsContent value="bookings">
//             {bookings.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-left">
//                     <th className="py-2">Buyer</th>
//                     <th className="py-2">Flat</th>
//                     <th className="py-2">Booking Amount</th>
//                     <th className="py-2">Payment Status</th>
//                     <th className="py-2">Next Due</th>
//                     <th className="py-2"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.map((b) => (
//                     <tr key={b.id} className="border-b last:border-0">
//                       <td className="py-2">
//                         {b.clientName}
//                         <br />
//                         <span className="text-xs text-muted-foreground">{b.clientEmail}</span>
//                       </td>
//                       <td className="py-2">{b.flatNumber}</td>
//                       <td className="py-2">{formatINR(b.bookingAmount)}</td>
//                       <td className="py-2"><Badge>{b.paymentStatus}</Badge></td>
//                       <td className="py-2">{b.nextInstallmentDue ? formatDate(b.nextInstallmentDue) : "—"}</td>
//                       <td className="py-2 text-right">
//                         <Button variant="outline" size="sm" onClick={() => onViewPayments(b.id)}>
//                           Payments
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">No bookings found.</p>
//             )}
//           </TabsContent>

//           {/* Agreements */}
//           <TabsContent value="agreements">
//             {agreements.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-left">
//                     <th className="py-2">Booking ID</th>
//                     <th className="py-2">Buyer</th>
//                     <th className="py-2">Flat</th>
//                     <th className="py-2">Status</th>
//                     <th className="py-2">Agreement Date</th>
//                     <th className="py-2">Approval</th>
//                     <th className="py-2">Document</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {agreements.map((a) => (
//                     <tr key={a.bookingId} className="border-b last:border-0">
//                       <td className="font-mono text-xs py-2">{a.bookingId}</td>
//                       <td className="py-2">{a.clientName}</td>
//                       <td className="py-2">{a.flatNumber}</td>
//                       <td className="py-2"><Badge>{a.status}</Badge></td>
//                       <td className="py-2">{a.agreementDate ? formatDate(a.agreementDate) : "—"}</td>
//                       <td className="py-2">{a.approvalStatus}</td>
//                       <td className="py-2">
//                         {a.documentUrl ? (
//                           <a href={a.documentUrl} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center hover:underline">
//                             <LinkIcon className="h-3 w-3 mr-1" /> View
//                           </a>
//                         ) : "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">No agreements found.</p>
//             )}
//           </TabsContent>

//           {/* Site Engineers */}
//           <TabsContent value="engineers">
//             {siteEngineers.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-left">
//                     <th className="py-2">Name</th>
//                     <th className="py-2">Email</th>
//                     <th className="py-2">Phone</th>
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
//               <p className="text-sm text-muted-foreground">No site engineers assigned.</p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </DialogContent>

//       {/* Nested Flat Detail Dialog */}
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
//               {/* --- Flat Information Card (Fixed Feature Mappings) --- */}
//               <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                 <div><span className="text-muted-foreground">Bedrooms:</span> {selectedFlat.bedrooms || selectedFlat.features?.bedrooms || "—"}</div>
//                 <div><span className="text-muted-foreground">Bathrooms:</span> {selectedFlat.bathrooms || selectedFlat.features?.bathrooms || "—"}</div>
//                 <div><span className="text-muted-foreground">Facing:</span> {selectedFlat.facing || selectedFlat.features?.facing || "—"}</div>
//                 <div><span className="text-muted-foreground">Parking:</span> {selectedFlat.parking || selectedFlat.features?.parking ? "Yes" : "No"}</div>
//                 <div><span className="text-muted-foreground">Balcony:</span> {selectedFlat.balcony || selectedFlat.features?.balcony ? "Yes" : "No"}</div>
//                 <div><span className="text-muted-foreground">Furnished:</span> {selectedFlat.furnished || selectedFlat.features?.furnished || "—"}</div>
//                 <div className="col-span-2"><span className="text-muted-foreground">Type of Booking:</span> {selectedFlat.typeOfBooking || "—"}</div>
//               </div>

//               {/* --- Booking Details Card (Added Nominee/CoApplicant) --- */}
//               {selectedFlat.booking && (
//                 <div className="border rounded-lg p-4 space-y-3">
//                   <h4 className="font-semibold text-base">Booking Details</h4>
                  
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Booking ID:</span>{" "}
//                       <span className="font-mono text-xs">{selectedFlat.booking.bookingId}</span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Status:</span>{" "}
//                       <Badge variant="outline">{selectedFlat.booking.status}</Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Approval:</span>{" "}
//                       <Badge variant={selectedFlat.booking.approvalStatus === "approved" ? "success" : "warning"}>
//                         {selectedFlat.booking.approvalStatus}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Payment Status:</span>{" "}
//                       <Badge>{selectedFlat.booking.paymentStatus}</Badge>
//                     </div>
//                     {/* Nominee & Co-applicant */}
//                     {selectedFlat.booking.coApplicantName && (
//                       <div>
//                         <span className="text-muted-foreground">Co-Applicant:</span>{" "}
//                         {selectedFlat.booking.coApplicantName}
//                       </div>
//                     )}
//                     {selectedFlat.booking.nomineeName && (
//                       <div>
//                         <span className="text-muted-foreground">Nominee:</span>{" "}
//                         {selectedFlat.booking.nomineeName}
//                       </div>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm pt-2 border-t mt-2">
//                     <div><span className="text-muted-foreground">Booking Amount:</span> {formatINR(selectedFlat.booking.bookingAmount)}</div>
//                     <div><span className="text-muted-foreground">Total Paid:</span> {formatINR(selectedFlat.booking.totalPaid)}</div>
//                     <div><span className="text-muted-foreground">Remaining:</span> {formatINR(selectedFlat.booking.remainingAmount)}</div>
//                     {selectedFlat.booking.nextInstallmentDueDate && (
//                       <div><span className="text-muted-foreground">Next Due:</span> {formatDate(selectedFlat.booking.nextInstallmentDueDate)}</div>
//                     )}
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
// import { Building2, BookOpen, FileText, Users, Link as LinkIcon, CalendarDays, Timer } from "lucide-react";

// const StatusBadge = ({ status }) => {
//   const variant =
//     status === "available" ? "success"
//       : status === "booked" ? "default"
//         : status === "sold" ? "secondary"
//           : "outline";
//   return <Badge variant={variant}>{status}</Badge>;
// };

// export default function ProjectDetailModal({
//   open,
//   onOpenChange,
//   project,
//   bookings,
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
//           <DialogTitle className="flex flex-col gap-2">
//             <div className="flex items-center gap-2">
//               <Building2 className="h-5 w-5" />
//               {project.name} – Inventory
//             </div>
//             {/* Project Timeline & Status */}
//             <div className="flex flex-wrap items-center gap-4 text-sm font-normal text-muted-foreground mt-1">
//               {project.startDate && project.endDate && (
//                 <div className="flex items-center gap-1">
//                   <CalendarDays className="h-4 w-4" /> 
//                   {formatDate(project.startDate)} to {formatDate(project.endDate)}
//                 </div>
//               )}
//               <div className="flex items-center gap-1 text-blue-600">
//                 <Timer className="h-4 w-4" /> Elapsed: {project.elapsedDays || 0} Days
//               </div>
//               <div className="flex items-center gap-1 text-orange-600">
//                 <Timer className="h-4 w-4" /> Remaining: {project.remainingDays || 0} Days
//               </div>
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="towers" className="mt-4">
//           <TabsList>
//             <TabsTrigger value="towers"><Building2 className="h-4 w-4 mr-1" /> Towers & Flats</TabsTrigger>
//             <TabsTrigger value="bookings"><BookOpen className="h-4 w-4 mr-1" /> Bookings</TabsTrigger>
//             <TabsTrigger value="agreements"><FileText className="h-4 w-4 mr-1" /> Agreements</TabsTrigger>
//             <TabsTrigger value="engineers"><Users className="h-4 w-4 mr-1" /> Site Engineers</TabsTrigger>
//           </TabsList>

//           {/* Towers & Flats */}
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

//                 {/* Tower Level Stats */}
//                 {selectedTower && (
//                   <div className="bg-muted/40 p-3 rounded-lg border grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
//                     <div><span className="text-muted-foreground block text-xs">Total Floors</span> <span className="font-medium">{selectedTower.totalFloors}</span></div>
//                     <div><span className="text-muted-foreground block text-xs">Total Flats</span> <span className="font-medium">{selectedTower.totalFlats}</span></div>
//                     <div><span className="text-muted-foreground block text-xs">Available</span> <span className="font-medium text-green-600">{selectedTower.availableFlats}</span></div>
//                     <div><span className="text-muted-foreground block text-xs">Booked</span> <span className="font-medium text-blue-600">{selectedTower.bookedFlats}</span></div>
//                     <div><span className="text-muted-foreground block text-xs">Sold</span> <span className="font-medium text-gray-700">{selectedTower.soldFlats}</span></div>
//                   </div>
//                 )}

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
//                           className={`border rounded-lg p-3 cursor-pointer transition-colors ${flat.cancelled ? 'bg-red-50/50 border-red-200 hover:bg-red-50' : 'hover:bg-accent'}`}
//                           onClick={() => setSelectedFlat(flat)}
//                         >
//                           <div className="flex justify-between items-start">
//                             <span className="font-medium flex items-center gap-2">
//                               {flat.flatNumber}
//                               {flat.cancelled && <Badge variant="destructive" className="text-[10px] h-4 px-1">Cancelled</Badge>}
//                             </span>
//                             <StatusBadge status={flat.status} />
//                           </div>
//                           <p className="text-sm">{flat.area} sqft</p>
//                           <p className="text-sm font-semibold">₹{flat.price?.toLocaleString()}</p>
//                           {(flat.facing || flat.features?.facing) && (
//                             <p className="text-xs text-muted-foreground">Facing: {flat.facing || flat.features?.facing}</p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {currentFlats.length === 0 && selectedTower && (
//                   <p className="text-sm text-muted-foreground">No flats on this floor.</p>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No towers found.</p>
//             )}
//           </TabsContent>

//           {/* Bookings */}
//           <TabsContent value="bookings">
//             {bookings.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-left">
//                     <th className="py-2">Buyer</th>
//                     <th className="py-2">Flat</th>
//                     <th className="py-2">Booking Amount</th>
//                     <th className="py-2">Payment Status</th>
//                     <th className="py-2">Next Due</th>
//                     <th className="py-2"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.map((b) => (
//                     <tr key={b.id} className="border-b last:border-0">
//                       <td className="py-2">
//                         {b.clientName}
//                         <br />
//                         <span className="text-xs text-muted-foreground">{b.clientEmail}</span>
//                       </td>
//                       <td className="py-2">{b.flatNumber}</td>
//                       <td className="py-2">{formatINR(b.bookingAmount)}</td>
//                       <td className="py-2"><Badge>{b.paymentStatus}</Badge></td>
//                       <td className="py-2">{b.nextInstallmentDue ? formatDate(b.nextInstallmentDue) : "—"}</td>
//                       <td className="py-2 text-right">
//                         <Button variant="outline" size="sm" onClick={() => onViewPayments(b.id)}>
//                           Payments
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">No bookings found.</p>
//             )}
//           </TabsContent>

//           {/* Agreements */}
//           <TabsContent value="agreements">
//             {agreements.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-left">
//                     <th className="py-2">Booking ID</th>
//                     <th className="py-2">Buyer</th>
//                     <th className="py-2">Flat</th>
//                     <th className="py-2">Status</th>
//                     <th className="py-2">Agreement Date</th>
//                     <th className="py-2">Approval</th>
//                     <th className="py-2">Document</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {agreements.map((a) => (
//                     <tr key={a.bookingId} className="border-b last:border-0">
//                       <td className="font-mono text-xs py-2">{a.bookingId}</td>
//                       <td className="py-2">{a.clientName}</td>
//                       <td className="py-2">{a.flatNumber}</td>
//                       <td className="py-2"><Badge>{a.status}</Badge></td>
//                       <td className="py-2">{a.agreementDate ? formatDate(a.agreementDate) : "—"}</td>
//                       <td className="py-2">{a.approvalStatus}</td>
//                       <td className="py-2">
//                         {a.documentUrl ? (
//                           <a href={a.documentUrl} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center hover:underline">
//                             <LinkIcon className="h-3 w-3 mr-1" /> View
//                           </a>
//                         ) : "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p className="text-sm text-muted-foreground">No agreements found.</p>
//             )}
//           </TabsContent>

//           {/* Site Engineers */}
//           <TabsContent value="engineers">
//             {siteEngineers.length ? (
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b text-left">
//                     <th className="py-2">Name</th>
//                     <th className="py-2">Email</th>
//                     <th className="py-2">Phone</th>
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
//               <p className="text-sm text-muted-foreground">No site engineers assigned.</p>
//             )}
//           </TabsContent>
//         </Tabs>
//       </DialogContent>

//       {/* Nested Flat Detail Dialog */}
//       <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
//         <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <span>Flat {selectedFlat?.flatNumber} Details</span>
//                 {selectedFlat?.cancelled && <Badge variant="destructive">CANCELLED</Badge>}
//               </div>
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
//               <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm border">
//                 <div><span className="text-muted-foreground">Bedrooms:</span> {selectedFlat.bedrooms || selectedFlat.features?.bedrooms || "—"}</div>
//                 <div><span className="text-muted-foreground">Bathrooms:</span> {selectedFlat.bathrooms || selectedFlat.features?.bathrooms || "—"}</div>
//                 <div><span className="text-muted-foreground">Facing:</span> {selectedFlat.facing || selectedFlat.features?.facing || "—"}</div>
//                 <div><span className="text-muted-foreground">Parking:</span> {selectedFlat.parking || selectedFlat.features?.parking ? "Yes" : "No"}</div>
//                 <div><span className="text-muted-foreground">Balcony:</span> {selectedFlat.balcony || selectedFlat.features?.balcony ? "Yes" : "No"}</div>
//                 <div><span className="text-muted-foreground">Furnished:</span> {selectedFlat.furnished || selectedFlat.features?.furnished || "—"}</div>
                
//                 {/* Agreement Details Added Here */}
//                 <div className="col-span-2 pt-2 border-t mt-1 grid grid-cols-2 gap-x-8">
//                   <div><span className="text-muted-foreground">Agreement Status:</span> <Badge variant="outline" className="ml-1">{selectedFlat.agreementStatus || "PENDING"}</Badge></div>
//                   {selectedFlat.agreementDate && (
//                     <div><span className="text-muted-foreground">Agreement Date:</span> {formatDate(selectedFlat.agreementDate)}</div>
//                   )}
//                 </div>
//               </div>

//               {/* --- Booking Details Card --- */}
//               {selectedFlat.booking && (
//                 <div className="border rounded-lg p-4 space-y-3">
//                   <h4 className="font-semibold text-base flex items-center justify-between">
//                     Booking Details
//                     <span className="text-xs font-normal text-muted-foreground font-mono">ID: {selectedFlat.booking.bookingId}</span>
//                   </h4>
                  
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
//                     <div>
//                       <span className="text-muted-foreground">Status:</span>{" "}
//                       <Badge variant="outline">{selectedFlat.booking.status}</Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Approval:</span>{" "}
//                       <Badge variant={selectedFlat.booking.approvalStatus === "approved" ? "success" : "warning"}>
//                         {selectedFlat.booking.approvalStatus}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Payment Status:</span>{" "}
//                       <Badge>{selectedFlat.booking.paymentStatus}</Badge>
//                     </div>
                    
//                     {/* Team Manager & Payment Model Added Here */}
//                     {selectedFlat.booking.paymentModel && (
//                       <div><span className="text-muted-foreground">Payment Model:</span> {selectedFlat.booking.paymentModel}</div>
//                     )}
//                     {selectedFlat.booking.teamManager && (
//                       <div><span className="text-muted-foreground">Team Manager:</span> {selectedFlat.booking.teamManager}</div>
//                     )}

//                     {selectedFlat.booking.coApplicantName && (
//                       <div><span className="text-muted-foreground">Co-Applicant:</span> {selectedFlat.booking.coApplicantName}</div>
//                     )}
//                     {selectedFlat.booking.nomineeName && (
//                       <div><span className="text-muted-foreground">Nominee:</span> {selectedFlat.booking.nomineeName}</div>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm pt-2 border-t mt-2 bg-slate-50 p-2 rounded">
//                     <div><span className="text-muted-foreground">Booking Amount:</span> {formatINR(selectedFlat.booking.bookingAmount)}</div>
//                     <div><span className="text-muted-foreground">Total Paid:</span> {formatINR(selectedFlat.booking.totalPaid)}</div>
//                     <div><span className="text-muted-foreground">Remaining:</span> {formatINR(selectedFlat.booking.remainingAmount)}</div>
                    
//                     {/* Next Installment Detailed Information */}
//                     {selectedFlat.booking.nextInstallmentDueDate && (
//                       <div className="col-span-2 flex justify-between border-t mt-1 pt-2">
//                         <div><span className="text-muted-foreground">Next Due Date:</span> {formatDate(selectedFlat.booking.nextInstallmentDueDate)}</div>
//                         <div className="font-semibold text-blue-600">Amount: {formatINR(selectedFlat.booking.nextInstallmentAmount)}</div>
//                       </div>
//                     )}
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




import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/helpers";
import { Building2, BookOpen, FileText, Users, Link as LinkIcon, CalendarDays, Timer } from "lucide-react";

const StatusBadge = ({ status }) => {
  const variant =
    status === "available" ? "success"
      : status === "booked" ? "default"
        : status === "sold" ? "secondary"
          : "outline";
  return <Badge variant={variant}>{status}</Badge>;
};

export default function ProjectDetailModal({
  open,
  onOpenChange,
  project,
  bookings,
  agreements,
  siteEngineers,
  loading,
  onViewPayments,
}) {
  const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [selectedFlat, setSelectedFlat] = useState(null);

  const towers = project?.towers || [];
  const selectedTower = towers[selectedTowerIdx] || null;
  const floors = selectedTower?.floors || [];
  const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
  const currentFloor = floors[safeFloorIdx] || null;
  const currentFlats = currentFloor?.flats || [];

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {project.name} – Inventory
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-normal text-muted-foreground mt-1">
              {project.startDate && project.endDate && (
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" /> 
                  {formatDate(project.startDate)} to {formatDate(project.endDate)}
                </div>
              )}
              <div className="flex items-center gap-1 text-blue-600">
                <Timer className="h-4 w-4" /> Elapsed: {project.elapsedDays || 0} Days
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <Timer className="h-4 w-4" /> Remaining: {project.remainingDays || 0} Days
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="towers" className="mt-4">
          <TabsList>
            <TabsTrigger value="towers"><Building2 className="h-4 w-4 mr-1" /> Towers & Flats</TabsTrigger>
            <TabsTrigger value="bookings"><BookOpen className="h-4 w-4 mr-1" /> Bookings</TabsTrigger>
            <TabsTrigger value="agreements"><FileText className="h-4 w-4 mr-1" /> Agreements</TabsTrigger>
            <TabsTrigger value="engineers"><Users className="h-4 w-4 mr-1" /> Site Engineers</TabsTrigger>
          </TabsList>

          {/* Towers & Flats */}
          <TabsContent value="towers">
            {towers.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Select Tower</h4>
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

                {selectedTower && (
                  <div className="bg-muted/40 p-3 rounded-lg border grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div><span className="text-muted-foreground block text-xs">Total Floors</span> <span className="font-medium">{selectedTower.totalFloors}</span></div>
                    <div><span className="text-muted-foreground block text-xs">Total Flats</span> <span className="font-medium">{selectedTower.totalFlats}</span></div>
                    <div><span className="text-muted-foreground block text-xs">Available</span> <span className="font-medium text-green-600">{selectedTower.availableFlats}</span></div>
                    <div><span className="text-muted-foreground block text-xs">Booked</span> <span className="font-medium text-blue-600">{selectedTower.bookedFlats}</span></div>
                    <div><span className="text-muted-foreground block text-xs">Sold</span> <span className="font-medium text-gray-700">{selectedTower.soldFlats}</span></div>
                  </div>
                )}

                {selectedTower && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Select Floor</h4>
                    <div className="flex gap-2 flex-wrap">
                      {floors.map((floor, idx) => (
                        <Button
                          key={floor.floorNumber}
                          variant={idx === safeFloorIdx ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFloorIdx(idx)}
                        >
                          {floor.floorNumber}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {currentFlats.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">
                      {selectedTower.towerName} – Floor {currentFloor.floorNumber}
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {currentFlats.map((flat) => (
                        <div
                          key={flat.flatNumber}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${flat.cancelled ? 'bg-red-50/50 border-red-200 hover:bg-red-50' : 'hover:bg-accent'}`}
                          onClick={() => setSelectedFlat(flat)}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium flex items-center gap-2">
                              {flat.flatNumber}
                              {flat.cancelled && <Badge variant="destructive" className="text-[10px] h-4 px-1">Cancelled</Badge>}
                            </span>
                            <StatusBadge status={flat.status} />
                          </div>
                          <p className="text-sm">{flat.area} sqft</p>
                          <p className="text-sm font-semibold">₹{flat.price?.toLocaleString()}</p>
                          {(flat.facing || flat.features?.facing) && (
                            <p className="text-xs text-muted-foreground">Facing: {flat.facing || flat.features?.facing}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentFlats.length === 0 && selectedTower && (
                  <p className="text-sm text-muted-foreground">No flats on this floor.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No towers found.</p>
            )}
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            {bookings.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Buyer</th>
                    <th className="py-2">Flat</th>
                    <th className="py-2">Booking Amount</th>
                    <th className="py-2">Payment Status</th>
                    <th className="py-2">Next Due</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, idx) => {
                    // ✅ ULTIMATE SMART MAPPING: Handle both Flat Object and Booking Object
                    const bookingData = b.booking || b;
                    const clientData = bookingData.client || {};
                    
                    const clientName = clientData.name || bookingData.clientName || b.clientName || "N/A";
                    const clientEmail = clientData.email || bookingData.clientEmail || b.clientEmail || "";
                    const flatNum = b.flatNumber || bookingData.flatNumber || b.flat?.flatNumber || "—";
                    const bkgAmount = bookingData.bookingAmount || b.bookingAmount || 0;
                    const payStatus = bookingData.paymentStatus || b.paymentStatus || "—";
                    const nextDue = bookingData.nextInstallmentDueDate || bookingData.nextInstallmentDue || b.nextInstallmentDue;
                    const bkgId = bookingData.bookingId || bookingData.id || b.bookingId || b.id;

                    return (
                      <tr key={bkgId || idx} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="py-2">
                          {clientName}
                          <br />
                          {clientEmail && <span className="text-xs text-muted-foreground">{clientEmail}</span>}
                        </td>
                        <td className="py-2 font-medium">{flatNum}</td>
                        <td className="py-2">{formatINR(bkgAmount)}</td>
                        <td className="py-2 capitalize">
                          {payStatus !== "—" ? <Badge variant={payStatus === 'cleared' ? 'success' : 'default'}>{payStatus}</Badge> : "—"}
                        </td>
                        <td className="py-2">{nextDue ? formatDate(nextDue) : "—"}</td>
                        <td className="py-2 text-right">
                          {bkgId && (
                            <Button variant="outline" size="sm" onClick={() => onViewPayments(bkgId)}>
                              Payments
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">No bookings found.</p>
            )}
          </TabsContent>

          {/* Agreements */}
          <TabsContent value="agreements">
            {agreements.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Booking ID</th>
                    <th className="py-2">Buyer</th>
                    <th className="py-2">Flat</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Agreement Date</th>
                    <th className="py-2">Approval</th>
                    <th className="py-2">Document</th>
                  </tr>
                </thead>
                <tbody>
                  {agreements.map((a, idx) => {
                    // ✅ ULTIMATE SMART MAPPING FOR AGREEMENTS
                    const bookingData = a.booking || a;
                    const clientData = bookingData.client || {};
                    
                    const bkgId = bookingData.bookingId || bookingData.id || a.bookingId || a.id;
                    const clientName = clientData.name || bookingData.clientName || a.clientName || "N/A";
                    const flatNum = a.flatNumber || bookingData.flatNumber || a.flat?.flatNumber || "—";
                    const agmStatus = a.agreementStatus || bookingData.agreementStatus || a.status || "—";
                    const agmDate = a.agreementDate || bookingData.agreementDate;
                    const approvalStatus = bookingData.approvalStatus || a.approvalStatus || "—";
                    const docUrl = a.documentUrl || bookingData.documentUrl;

                    return (
                      <tr key={bkgId || idx} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="font-mono text-xs py-2">{bkgId || "—"}</td>
                        <td className="py-2">{clientName}</td>
                        <td className="py-2 font-medium">{flatNum}</td>
                        <td className="py-2">
                          {agmStatus !== "—" ? <Badge variant={agmStatus === 'REGISTERED' ? 'success' : 'outline'}>{agmStatus}</Badge> : "—"}
                        </td>
                        <td className="py-2">{agmDate ? formatDate(agmDate) : "—"}</td>
                        <td className="py-2 capitalize">{approvalStatus}</td>
                        <td className="py-2">
                          {docUrl ? (
                            <a href={docUrl} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center hover:underline">
                              <LinkIcon className="h-3 w-3 mr-1" /> View
                            </a>
                          ) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">No agreements found.</p>
            )}
          </TabsContent>

          {/* Site Engineers */}
          <TabsContent value="engineers">
            {siteEngineers.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {siteEngineers.map((eng) => (
                    <tr key={eng.id} className="border-b last:border-0">
                      <td className="py-2">{eng.name}</td>
                      <td className="py-2">{eng.email}</td>
                      <td className="py-2">{eng.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">No site engineers assigned.</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Nested Flat Detail Dialog */}
      <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>Flat {selectedFlat?.flatNumber} Details</span>
                {selectedFlat?.cancelled && <Badge variant="destructive">CANCELLED</Badge>}
              </div>
              {selectedFlat && <StatusBadge status={selectedFlat.status} />}
            </DialogTitle>
            {selectedFlat && (
              <p className="text-sm text-muted-foreground">
                {selectedFlat.area} sqft · ₹{formatINR(selectedFlat.price)}
              </p>
            )}
          </DialogHeader>

          {selectedFlat && (
            <div className="space-y-6">
              {/* --- Flat Information Card --- */}
              <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm border">
                <div><span className="text-muted-foreground">Bedrooms:</span> {selectedFlat.bedrooms || selectedFlat.features?.bedrooms || "—"}</div>
                <div><span className="text-muted-foreground">Bathrooms:</span> {selectedFlat.bathrooms || selectedFlat.features?.bathrooms || "—"}</div>
                <div><span className="text-muted-foreground">Facing:</span> {selectedFlat.facing || selectedFlat.features?.facing || "—"}</div>
                <div><span className="text-muted-foreground">Parking:</span> {selectedFlat.parking || selectedFlat.features?.parking ? "Yes" : "No"}</div>
                <div><span className="text-muted-foreground">Balcony:</span> {selectedFlat.balcony || selectedFlat.features?.balcony ? "Yes" : "No"}</div>
                <div><span className="text-muted-foreground">Furnished:</span> {selectedFlat.furnished || selectedFlat.features?.furnished || "—"}</div>
                
                {/* Agreement Details */}
                <div className="col-span-2 pt-2 border-t mt-1 grid grid-cols-2 gap-x-8">
                  <div><span className="text-muted-foreground">Agreement Status:</span> <Badge variant="outline" className="ml-1">{selectedFlat.agreementStatus || "PENDING"}</Badge></div>
                  {selectedFlat.agreementDate && (
                    <div><span className="text-muted-foreground">Agreement Date:</span> {formatDate(selectedFlat.agreementDate)}</div>
                  )}
                </div>
              </div>

              {/* --- Booking Details Card --- */}
              {selectedFlat.booking && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-base flex items-center justify-between">
                    Booking Details
                    <span className="text-xs font-normal text-muted-foreground font-mono">ID: {selectedFlat.booking.bookingId}</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge variant="outline">{selectedFlat.booking.status}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Approval:</span>{" "}
                      <Badge variant={selectedFlat.booking.approvalStatus === "approved" ? "success" : "warning"}>
                        {selectedFlat.booking.approvalStatus}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment Status:</span>{" "}
                      <Badge>{selectedFlat.booking.paymentStatus}</Badge>
                    </div>
                    
                    {selectedFlat.booking.paymentModel && (
                      <div><span className="text-muted-foreground">Payment Model:</span> {selectedFlat.booking.paymentModel}</div>
                    )}
                    
                    {selectedFlat.booking.teamManager && (
                      <div>
                        <span className="text-muted-foreground">Team Manager:</span>{" "}
                        {typeof selectedFlat.booking.teamManager === 'object' 
                          ? selectedFlat.booking.teamManager?.name || "N/A" 
                          : selectedFlat.booking.teamManager}
                      </div>
                    )}

                    {selectedFlat.booking.coApplicantName && (
                      <div><span className="text-muted-foreground">Co-Applicant:</span> {selectedFlat.booking.coApplicantName}</div>
                    )}
                    {selectedFlat.booking.nomineeName && (
                      <div><span className="text-muted-foreground">Nominee:</span> {selectedFlat.booking.nomineeName}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm pt-2 border-t mt-2 bg-slate-50 p-2 rounded">
                    <div><span className="text-muted-foreground">Booking Amount:</span> {formatINR(selectedFlat.booking.bookingAmount)}</div>
                    <div><span className="text-muted-foreground">Total Paid:</span> {formatINR(selectedFlat.booking.totalPaid)}</div>
                    <div><span className="text-muted-foreground">Remaining:</span> {formatINR(selectedFlat.booking.remainingAmount)}</div>
                    
                    {/* Next Installment Detailed Information */}
                    {selectedFlat.booking.nextInstallmentDueDate && (
                      <div className="col-span-2 flex justify-between border-t mt-1 pt-2">
                        <div><span className="text-muted-foreground">Next Due Date:</span> {formatDate(selectedFlat.booking.nextInstallmentDueDate)}</div>
                        <div className="font-semibold text-blue-600">Amount: {formatINR(selectedFlat.booking.nextInstallmentAmount)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}