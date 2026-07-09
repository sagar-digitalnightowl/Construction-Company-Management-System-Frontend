// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { DollarSign } from "lucide-react";

// export function SalaryTab({ salarySlips, canEdit }) {
//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">Salary Slips</h3>
//         {canEdit && (
//           <Button size="sm" onClick={() => {}}>
//             <DollarSign className="h-4 w-4 mr-1" /> Generate Salary Slip
//           </Button>
//         )}
//       </div>
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Month</TableHead>
//                 <TableHead>Year</TableHead>
//                 <TableHead>Basic</TableHead>
//                 <TableHead>HRA</TableHead>
//                 <TableHead>Allowances</TableHead>
//                 <TableHead>Deductions</TableHead>
//                 <TableHead>Net Pay</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {salarySlips.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center">
//                     No salary slips
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 salarySlips.map((slip) => (
//                   <TableRow key={slip._id}>
//                     <TableCell>{slip.month}</TableCell>
//                     <TableCell>{slip.year}</TableCell>
//                     <TableCell>₹{slip.basicSalary?.toLocaleString()}</TableCell>
//                     <TableCell>₹{slip.hra?.toLocaleString()}</TableCell>
//                     <TableCell>₹{slip.allowances?.toLocaleString()}</TableCell>
//                     <TableCell>₹{slip.deductions?.toLocaleString()}</TableCell>
//                     <TableCell className="font-bold">
//                       ₹{slip.netPay?.toLocaleString()}
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           slip.paymentStatus === "Paid" ? "success" : "warning"
//                         }
//                       >
//                         {slip.paymentStatus}
//                       </Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




// // src/components/hr/employeeDetail/SalaryTab.tsx

// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { DollarSign, Download, Eye, Loader2 } from "lucide-react";
// import { useHR } from "@/hooks/useHR";
// import { useState } from "react";

// export function SalaryTab({ salarySlips, canEdit, employeeId, onGenerate }) {
//   const { downloadSalarySlipPdf, loading } = useHR();
//   const [downloadingId, setDownloadingId] = useState(null);

//   const handleDownloadPdf = async (slipId) => {
//     setDownloadingId(slipId);
//     try {
//       await downloadSalarySlipPdf(slipId);
//     } finally {
//       setDownloadingId(null);
//     }
//   };

//   const handleViewPdf = (pdfUrl) => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold">Salary Slips</h3>
//         {canEdit && (
//           <Button size="sm" onClick={onGenerate}>
//             <DollarSign className="h-4 w-4 mr-1" /> Generate Salary Slip
//           </Button>
//         )}
//       </div>
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Slip No.</TableHead>
//                 <TableHead>Month</TableHead>
//                 <TableHead>Year</TableHead>
//                 <TableHead>Gross Earnings</TableHead>
//                 <TableHead>Deductions</TableHead>
//                 <TableHead>Net Pay</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {salarySlips.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center py-8">
//                     No salary slips found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 salarySlips.map((slip) => (
//                   <TableRow key={slip._id}>
//                     <TableCell className="font-mono text-xs">
//                       {slip.slipNumber || "-"}
//                     </TableCell>
//                     <TableCell>{slip.month}</TableCell>
//                     <TableCell>{slip.year || new Date(slip.month).getFullYear()}</TableCell>
//                     <TableCell>
//                       ₹{(slip.grossEarnings || 0).toLocaleString()}
//                     </TableCell>
//                     <TableCell>
//                       ₹{(slip.totalDeductions || 0).toLocaleString()}
//                     </TableCell>
//                     <TableCell className="font-bold">
//                       ₹{(slip.netSalary || slip.netPay || 0).toLocaleString()}
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           slip.paymentStatus === "Paid" 
//                             ? "success" 
//                             : slip.paymentStatus === "Processed"
//                             ? "default"
//                             : "warning"
//                         }
//                       >
//                         {slip.paymentStatus || "Pending"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         {slip.pdfUrl && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleViewPdf(slip.pdfUrl)}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         )}
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleDownloadPdf(slip._id)}
//                           disabled={downloadingId === slip._id || loading}
//                         >
//                           {downloadingId === slip._id ? (
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                           ) : (
//                             <Download className="h-4 w-4" />
//                           )}
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




// src/components/hr/employeeDetail/SalaryTab.tsx

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DollarSign, Download, Eye, Loader2, RefreshCcw, FileText } from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export function SalaryTab({ salarySlips, canEdit, employeeId, onGenerate }) {
  const { downloadSalarySlipPdf, updateSalaryStatus, loading } = useHR();
  const { current } = useAuthStore();
  const [downloadingId, setDownloadingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ✅ NEW: Status Update Dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // ✅ NEW: Slip Detail Dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedSlipDetail, setSelectedSlipDetail] = useState(null);

  // Check if user can update status (Admin or HR Manager)
  const canUpdateStatus = current?.role === "admin" || current?.role === "hr_manager";

  const handleDownloadPdf = async (slipId) => {
    setDownloadingId(slipId);
    try {
      await downloadSalarySlipPdf(slipId);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleViewPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      toast.error("PDF not available for this slip");
    }
  };

  // ✅ NEW: Open Status Update Dialog
  const handleOpenStatusDialog = (slip) => {
    setSelectedSlip(slip);
    setNewStatus(slip.paymentStatus || "Pending");
    setStatusDialogOpen(true);
  };

  // ✅ NEW: Update Status
  const handleUpdateStatus = async () => {
    if (!selectedSlip || !newStatus) return;
    
    setUpdatingId(selectedSlip._id);
    try {
      const success = await updateSalaryStatus(selectedSlip._id, {
        paymentStatus: newStatus,
      });
      if (success) {
        setStatusDialogOpen(false);
        setSelectedSlip(null);
        setNewStatus("");
        // Refresh data - parent component will handle this
        if (onGenerate) {
          // Trigger refresh through parent
          onGenerate();
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ NEW: View Slip Detail
  const handleViewDetail = (slip) => {
    setSelectedSlipDetail(slip);
    setDetailDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Processed":
        return "default";
      case "Pending":
        return "warning";
      case "Pending Finance Approval":
        return "warning";
      case "Approved":
        return "default";
      case "Sent to Bank":
        return "secondary";
      case "Bank Processed":
        return "success";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatMonth = (monthStr) => {
    if (!monthStr) return "-";
    if (monthStr.includes("-")) {
      const [year, month] = monthStr.split("-");
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return monthStr;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Salary Slips</h3>
        {canEdit && (
          <Button size="sm" onClick={onGenerate}>
            <DollarSign className="h-4 w-4 mr-1" /> Generate Salary Slip
          </Button>
        )}
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slip No.</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Gross Earnings</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salarySlips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    No salary slips found
                  </TableCell>
                </TableRow>
              ) : (
                salarySlips.map((slip) => (
                  <TableRow key={slip._id}>
                    <TableCell className="font-mono text-xs">
                      {slip.slipNumber || "-"}
                    </TableCell>
                    <TableCell>{formatMonth(slip.month)}</TableCell>
                    <TableCell>
                      ₹{(slip.grossEarnings || 0).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      ₹{(slip.totalDeductions || 0).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="font-bold">
                      ₹{(slip.netSalary || slip.netPay || 0).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(slip.paymentStatus)}>
                        {slip.paymentStatus || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Detail */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetail(slip)}
                          title="View Details"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>

                        {/* View PDF */}
                        {slip.pdfUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewPdf(slip.pdfUrl)}
                            title="View PDF"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Download PDF */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadPdf(slip._id)}
                          disabled={downloadingId === slip._id || loading}
                          title="Download PDF"
                        >
                          {downloadingId === slip._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>

                        {/* Update Status - Only for Admin/HR */}
                        {canUpdateStatus && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenStatusDialog(slip)}
                            disabled={updatingId === slip._id}
                            title="Update Status"
                          >
                            {updatingId === slip._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCcw className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ==================== STATUS UPDATE DIALOG ==================== */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Salary Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedSlip && (
              <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
                <p><strong>Employee:</strong> {selectedSlip.employeeId?.name || "Unknown"}</p>
                <p><strong>Slip No.:</strong> {selectedSlip.slipNumber || "-"}</p>
                <p><strong>Month:</strong> {formatMonth(selectedSlip.month)}</p>
                <p><strong>Net Pay:</strong> ₹{(selectedSlip.netSalary || selectedSlip.netPay || 0).toLocaleString('en-IN')}</p>
              </div>
            )}
            <div>
              <Label>Payment Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processed">Processed</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={loading || updatingId}>
              {loading || updatingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== SLIP DETAIL DIALOG ==================== */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Salary Slip Details</DialogTitle>
          </DialogHeader>
          {selectedSlipDetail && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Slip Number</p>
                  <p className="font-medium font-mono">{selectedSlipDetail.slipNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Month</p>
                  <p className="font-medium">{formatMonth(selectedSlipDetail.month)}</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="font-semibold mb-2">Earnings</p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <p className="text-muted-foreground">Basic</p>
                  <p className="text-right">₹{(selectedSlipDetail.earnings?.basic || 0).toLocaleString('en-IN')}</p>
                  <p className="text-muted-foreground">HRA</p>
                  <p className="text-right">₹{(selectedSlipDetail.earnings?.hra || 0).toLocaleString('en-IN')}</p>
                  <p className="text-muted-foreground">Allowances</p>
                  <p className="text-right">₹{(selectedSlipDetail.earnings?.allowances || 0).toLocaleString('en-IN')}</p>
                  <p className="text-muted-foreground">Overtime Pay</p>
                  <p className="text-right">₹{(selectedSlipDetail.earnings?.overtimePay || 0).toLocaleString('en-IN')}</p>
                  <p className="font-medium text-muted-foreground">Gross Earnings</p>
                  <p className="font-medium text-right">₹{(selectedSlipDetail.grossEarnings || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="font-semibold mb-2">Deductions</p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <p className="text-muted-foreground">Provident Fund</p>
                  <p className="text-right">₹{(selectedSlipDetail.deductions?.providentFund || 0).toLocaleString('en-IN')}</p>
                  <p className="text-muted-foreground">Professional Tax</p>
                  <p className="text-right">₹{(selectedSlipDetail.deductions?.professionalTax || 0).toLocaleString('en-IN')}</p>
                  <p className="text-muted-foreground">Absent Deduction</p>
                  <p className="text-right">₹{(selectedSlipDetail.deductions?.absentDeduction || 0).toLocaleString('en-IN')}</p>
                  <p className="text-muted-foreground">Late Deduction</p>
                  <p className="text-right">₹{(selectedSlipDetail.deductions?.lateDeduction || 0).toLocaleString('en-IN')}</p>
                  <p className="font-medium text-muted-foreground">Total Deductions</p>
                  <p className="font-medium text-right">₹{(selectedSlipDetail.totalDeductions || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg">
                  <p className="font-bold">Net Payable</p>
                  <p className="font-bold text-primary">
                    ₹{(selectedSlipDetail.netSalary || selectedSlipDetail.netPay || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadge(selectedSlipDetail.paymentStatus)}>
                    {selectedSlipDetail.paymentStatus || "Pending"}
                  </Badge>
                </div>
              </div>

              {selectedSlipDetail.pdfUrl && (
                <Button
                  variant="outline"
                  onClick={() => handleViewPdf(selectedSlipDetail.pdfUrl)}
                  className="mt-2"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Full PDF
                </Button>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}