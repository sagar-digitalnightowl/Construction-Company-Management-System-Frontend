// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { formatINR, formatDate } from "@/lib/helpers";

// export default function BookingPaymentModal({
//   open,
//   onOpenChange,
//   bookingPayment,
// }) {
//   if (!bookingPayment) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Payment Details</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 text-sm">
//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <span className="font-medium">Booking ID:</span>{" "}
//               {bookingPayment.bookingId}
//             </div>
//             <div>
//               <span className="font-medium">Buyer:</span>{" "}
//               {bookingPayment.clientName}
//             </div>
//             <div>
//               <span className="font-medium">Flat:</span>{" "}
//               {bookingPayment.flatNumber}
//             </div>
//             <div>
//               <span className="font-medium">Total Paid:</span>{" "}
//               {formatINR(bookingPayment.totalPaid)}
//             </div>
//             <div>
//               <span className="font-medium">Remaining:</span>{" "}
//               {formatINR(bookingPayment.remainingAmount)}
//             </div>
//             <div>
//               <span className="font-medium">Payment Status:</span>{" "}
//               <Badge>{bookingPayment.paymentStatus}</Badge>
//             </div>
//             <div>
//               <span className="font-medium">Model:</span>{" "}
//               {bookingPayment.paymentModel}
//             </div>
//           </div>

//           <h4 className="font-semibold mt-4">Installments</h4>
//           {bookingPayment.paymentDetails?.length ? (
//             <table className="w-full border">
//               <thead>
//                 <tr className="bg-muted">
//                   <th className="p-2 text-left">#</th>
//                   <th className="p-2 text-left">Due Date</th>
//                   <th className="p-2 text-left">Amount</th>
//                   <th className="p-2 text-left">Paid</th>
//                   <th className="p-2 text-left">Status</th>
//                   <th className="p-2 text-left">Cleared</th>
//                   <th className="p-2 text-left">Uncleared</th>
//                   <th className="p-2 text-left">Mode</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bookingPayment.paymentDetails.map((inst, idx) => (
//                   <tr key={idx} className="border-t">
//                     <td className="p-2">{inst.installmentNumber}</td>
//                     <td className="p-2">
//                       {inst.dueDate ? formatDate(inst.dueDate) : "—"}
//                     </td>
//                     <td className="p-2">{formatINR(inst.amount)}</td>
//                     <td className="p-2">{formatINR(inst.paidAmount)}</td>
//                     <td className="p-2">
//                       <Badge>{inst.status}</Badge>
//                     </td>
//                     <td className="p-2">{formatINR(inst.clearedAmount)}</td>
//                     <td className="p-2">{formatINR(inst.unclearedAmount)}</td>
//                     <td className="p-2 capitalize">{inst.paymentMode}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-muted-foreground">No installment details.</p>
//           )}

//           <div className="grid grid-cols-2 gap-2 mt-4">
//             {bookingPayment.businessCode && (
//               <div>
//                 <span className="font-medium">Business Code:</span>{" "}
//                 {bookingPayment.businessCode}
//               </div>
//             )}
//             {bookingPayment.businessName && (
//               <div>
//                 <span className="font-medium">Business Name:</span>{" "}
//                 {bookingPayment.businessName}
//               </div>
//             )}
//             {bookingPayment.teamManager && (
//               <div>
//                 <span className="font-medium">Team Manager:</span>{" "}
//                 {bookingPayment.teamManager}
//               </div>
//             )}
//             {bookingPayment.kycNumber && (
//               <div>
//                 <span className="font-medium">KYC:</span>{" "}
//                 {bookingPayment.kycNumber}
//               </div>
//             )}
//             {bookingPayment.serviceTaxPaid > 0 && (
//               <div>
//                 <span className="font-medium">Service Tax:</span>{" "}
//                 {formatINR(bookingPayment.serviceTaxPaid)}
//               </div>
//             )}
//             {bookingPayment.gstPaid > 0 && (
//               <div>
//                 <span className="font-medium">GST:</span>{" "}
//                 {formatINR(bookingPayment.gstPaid)}
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }




// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Link as LinkIcon } from "lucide-react";

// export default function BookingPaymentModal({
//   open,
//   onOpenChange,
//   bookingPayment,
// }) {
//   if (!bookingPayment) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Payment Details</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 text-sm">
//           <div className="grid grid-cols-2 gap-2">
//             <div><span className="font-medium">Booking ID:</span> {bookingPayment.bookingId}</div>
//             <div><span className="font-medium">Buyer:</span> {bookingPayment.clientName}</div>
//             <div><span className="font-medium">Flat:</span> {bookingPayment.flatNumber}</div>
//             <div><span className="font-medium">Total Paid:</span> {formatINR(bookingPayment.totalPaid)}</div>
//             <div><span className="font-medium">Remaining:</span> {formatINR(bookingPayment.remainingAmount)}</div>
//             <div><span className="font-medium">Payment Status:</span> <Badge>{bookingPayment.paymentStatus}</Badge></div>
//           </div>

//           <h4 className="font-semibold mt-4">Installments & Payment History</h4>
//           {bookingPayment.paymentDetails?.length ? (
//             <div className="overflow-x-auto">
//               <table className="w-full border text-xs sm:text-sm whitespace-nowrap">
//                 <thead>
//                   <tr className="bg-muted">
//                     <th className="p-2 text-left">#</th>
//                     <th className="p-2 text-left">Due Date</th>
//                     <th className="p-2 text-left">Amount</th>
//                     <th className="p-2 text-left">Status</th>
//                     <th className="p-2 text-left">Cleared</th>
//                     <th className="p-2 text-left">Mode</th>
//                     <th className="p-2 text-left">Receipt No.</th>
//                     <th className="p-2 text-left">Proof</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookingPayment.paymentDetails.map((inst, idx) => (
//                     <tr key={idx} className="border-t">
//                       <td className="p-2">{inst.installmentNumber}</td>
//                       <td className="p-2">{inst.dueDate ? formatDate(inst.dueDate) : "—"}</td>
//                       <td className="p-2">{formatINR(inst.amount)}</td>
//                       <td className="p-2"><Badge>{inst.status}</Badge></td>
//                       <td className="p-2">{formatINR(inst.clearedAmount)}</td>
//                       <td className="p-2 capitalize">{inst.paymentMode || "—"}</td>
//                       <td className="p-2">{inst.receiptNumber || inst.transactionId || "—"}</td>
//                       <td className="p-2">
//                         {inst.proofUrl ? (
//                           <a href={inst.proofUrl} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center hover:underline">
//                             <LinkIcon className="h-3 w-3 mr-1" /> View
//                           </a>
//                         ) : "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-muted-foreground">No installment details.</p>
//           )}

//           <div className="grid grid-cols-2 gap-2 mt-4 bg-muted/30 p-3 rounded-lg">
//             {bookingPayment.kycNumber && <div><span className="font-medium">KYC:</span> {bookingPayment.kycNumber}</div>}
//             {bookingPayment.serviceTaxPaid > 0 && <div><span className="font-medium">Service Tax:</span> {formatINR(bookingPayment.serviceTaxPaid)}</div>}
//             {bookingPayment.gstPaid > 0 && <div><span className="font-medium">GST:</span> {formatINR(bookingPayment.gstPaid)}</div>}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }



// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Link as LinkIcon } from "lucide-react";

// export default function BookingPaymentModal({
//   open,
//   onOpenChange,
//   bookingPayment,
// }) {
//   if (!bookingPayment) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-5xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Payment Details</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 text-sm">
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-muted/40 p-4 rounded-lg border">
//             <div><span className="text-muted-foreground block text-xs">Booking ID</span> <span className="font-mono text-sm">{bookingPayment.bookingId}</span></div>
//             <div><span className="text-muted-foreground block text-xs">Buyer</span> <span className="font-medium">{bookingPayment.clientName}</span></div>
//             <div><span className="text-muted-foreground block text-xs">Flat Number</span> <span className="font-medium">{bookingPayment.flatNumber}</span></div>
//             <div><span className="text-muted-foreground block text-xs">Total Paid</span> <span className="font-medium text-green-600">{formatINR(bookingPayment.totalPaid)}</span></div>
//             <div><span className="text-muted-foreground block text-xs">Remaining</span> <span className="font-medium text-orange-600">{formatINR(bookingPayment.remainingAmount)}</span></div>
//             <div><span className="text-muted-foreground block text-xs">Status</span> <Badge className="mt-1">{bookingPayment.paymentStatus}</Badge></div>
//           </div>

//           <h4 className="font-semibold mt-6">Installments & Payment History</h4>
//           {bookingPayment.paymentDetails?.length ? (
//             <div className="overflow-x-auto border rounded-lg">
//               <table className="w-full text-xs sm:text-sm whitespace-nowrap">
//                 <thead>
//                   <tr className="bg-muted/50 border-b">
//                     <th className="p-3 text-left font-medium">#</th>
//                     <th className="p-3 text-left font-medium">Due Date</th>
//                     <th className="p-3 text-left font-medium">Amount</th>
//                     <th className="p-3 text-left font-medium">Status</th>
//                     <th className="p-3 text-left font-medium text-green-600">Cleared</th>
//                     <th className="p-3 text-left font-medium text-orange-600">Uncleared</th>
//                     <th className="p-3 text-left font-medium">Mode</th>
//                     <th className="p-3 text-left font-medium">Bank Details</th>
//                     <th className="p-3 text-left font-medium">Proof</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookingPayment.paymentDetails.map((inst, idx) => (
//                     <tr key={idx} className="border-b last:border-0 hover:bg-muted/20">
//                       <td className="p-3">{inst.installmentNumber || (idx + 1)}</td>
//                       <td className="p-3">{inst.dueDate ? formatDate(inst.dueDate) : "—"}</td>
//                       <td className="p-3 font-medium">{formatINR(inst.amount || 0)}</td>
//                       <td className="p-3">
//                         <Badge variant={inst.status === "cleared" ? "success" : "outline"}>
//                           {inst.status || "pending"}
//                         </Badge>
//                       </td>
//                       <td className="p-3">{formatINR(inst.clearedAmount)}</td>
//                       <td className="p-3">{inst.unclearedAmount > 0 ? formatINR(inst.unclearedAmount) : "—"}</td>
//                       <td className="p-3 capitalize">{inst.paymentMode || "—"}</td>
//                       <td className="p-3">
//                         <div className="flex flex-col">
//                           <span>{inst.bankName || "—"}</span>
//                           {(inst.chequeNumber || inst.transactionId || inst.receiptNumber) && (
//                             <span className="text-[10px] text-muted-foreground">
//                               Ref: {inst.chequeNumber || inst.transactionId || inst.receiptNumber}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="p-3">
//                         {inst.proofUrl ? (
//                           <a href={inst.proofUrl} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center hover:underline">
//                             <LinkIcon className="h-3 w-3 mr-1" /> View
//                           </a>
//                         ) : "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center p-6 bg-muted/20 rounded-lg border border-dashed">
//               <p className="text-muted-foreground text-sm">No installment details found.</p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 bg-muted/30 p-4 rounded-lg border">
//             {bookingPayment.kycNumber && <div><span className="text-muted-foreground text-xs block">KYC Number</span> <span className="font-mono text-sm">{bookingPayment.kycNumber}</span></div>}
//             {bookingPayment.serviceTaxPaid > 0 && <div><span className="text-muted-foreground text-xs block">Service Tax Paid</span> <span className="font-medium text-sm">{formatINR(bookingPayment.serviceTaxPaid)}</span></div>}
//             {bookingPayment.gstPaid > 0 && <div><span className="text-muted-foreground text-xs block">GST Paid</span> <span className="font-medium text-sm">{formatINR(bookingPayment.gstPaid)}</span></div>}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }



import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/helpers";
import { Link as LinkIcon } from "lucide-react";

export default function BookingPaymentModal({
  open,
  onOpenChange,
  bookingPayment,
}) {
  if (!bookingPayment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-muted/40 p-4 rounded-lg border">
            <div>
              <span className="text-muted-foreground block text-xs">Booking ID</span> 
              {/* ✅ UPDATED: Added fallback for booking ID */}
              <span className="font-mono text-sm">{bookingPayment.bookingId || bookingPayment.id || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Buyer</span> 
              {/* ✅ UPDATED: Safe handling for nested client name */}
              <span className="font-medium">{bookingPayment.client?.name || bookingPayment.clientName || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Flat Number</span> 
              <span className="font-medium">{bookingPayment.flatNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Total Paid</span> 
              <span className="font-medium text-green-600">{formatINR(bookingPayment.totalPaid)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Remaining</span> 
              <span className="font-medium text-orange-600">{formatINR(bookingPayment.remainingAmount)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Status</span> 
              <Badge className="mt-1">{bookingPayment.paymentStatus}</Badge>
            </div>
          </div>

          <h4 className="font-semibold mt-6">Installments & Payment History</h4>
          {bookingPayment.paymentDetails?.length ? (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="p-3 text-left font-medium">#</th>
                    <th className="p-3 text-left font-medium">Due Date</th>
                    <th className="p-3 text-left font-medium">Amount</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium text-green-600">Cleared</th>
                    <th className="p-3 text-left font-medium text-orange-600">Uncleared</th>
                    <th className="p-3 text-left font-medium">Mode</th>
                    <th className="p-3 text-left font-medium">Bank Details</th>
                    <th className="p-3 text-left font-medium">Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingPayment.paymentDetails.map((inst, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="p-3">{inst.installmentNumber || (idx + 1)}</td>
                      <td className="p-3">{inst.dueDate ? formatDate(inst.dueDate) : "—"}</td>
                      <td className="p-3 font-medium">{formatINR(inst.amount || 0)}</td>
                      <td className="p-3">
                        <Badge variant={inst.status === "cleared" ? "success" : "outline"}>
                          {inst.status || "pending"}
                        </Badge>
                      </td>
                      <td className="p-3">{formatINR(inst.clearedAmount)}</td>
                      <td className="p-3">{inst.unclearedAmount > 0 ? formatINR(inst.unclearedAmount) : "—"}</td>
                      <td className="p-3 capitalize">{inst.paymentMode || "—"}</td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span>{inst.bankName || "—"}</span>
                          {(inst.chequeNumber || inst.transactionId || inst.receiptNumber) && (
                            <span className="text-[10px] text-muted-foreground">
                              Ref: {inst.chequeNumber || inst.transactionId || inst.receiptNumber}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        {inst.proofUrl ? (
                          <a href={inst.proofUrl} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center hover:underline">
                            <LinkIcon className="h-3 w-3 mr-1" /> View
                          </a>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-6 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">No installment details found.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 bg-muted/30 p-4 rounded-lg border">
            {bookingPayment.kycNumber && <div><span className="text-muted-foreground text-xs block">KYC Number</span> <span className="font-mono text-sm">{bookingPayment.kycNumber}</span></div>}
            {bookingPayment.serviceTaxPaid > 0 && <div><span className="text-muted-foreground text-xs block">Service Tax Paid</span> <span className="font-medium text-sm">{formatINR(bookingPayment.serviceTaxPaid)}</span></div>}
            {bookingPayment.gstPaid > 0 && <div><span className="text-muted-foreground text-xs block">GST Paid</span> <span className="font-medium text-sm">{formatINR(bookingPayment.gstPaid)}</span></div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}