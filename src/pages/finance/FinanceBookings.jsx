// // src/pages/finance/FinanceBookings.jsx
// import React, { useEffect, useState } from "react";
// import { useFinance } from "@/hooks/useFinance";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useProjectsStore } from "@/store/dataStore";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Mail, AlertTriangle, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { projectApi } from "@/api";
// import { Skeleton } from "@/components/ui/skeleton";

// export function FinanceBookings() {
//   const {
//     bookings,
//     fetchBookings,
//     sendNormalReminder,
//     sendPenaltyReminder,
//     loading,
//   } = useFinance();
//   const [projects, setProjects] = useState([]);
//   const [projectFilter, setProjectFilter] = useState("all");
//   const [reminderOpen, setReminderOpen] = useState(null); // bookingId or null
//   const [reminderType, setReminderType] = useState("normal"); // "normal" | "penalty"
//   const [reminderData, setReminderData] = useState({
//     dueDate: "",
//     milestoneName: "",
//   });


//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load projects");
//     }
//   };

//   useEffect(() => {
//     fetchBookings({
//       projectId: projectFilter === "all" ? undefined : projectFilter,
//     });
//   }, [projectFilter, fetchBookings]);

//   useEffect(() => {
//     fetchProjects();
//   }, [])

//   const handleSendReminder = async (bookingId) => {
//     const payload = {
//       dueDate: reminderData.dueDate || undefined,
//       milestoneName: reminderData.milestoneName || undefined,
//     };
//     if (reminderType === "normal") {
//       await sendNormalReminder(bookingId, payload);
//     } else {
//       await sendPenaltyReminder(bookingId, payload);
//     }
//     setReminderOpen(null);
//     setReminderData({ dueDate: "", milestoneName: "" });
//   };

//   const openReminderDialog = (bookingId, type) => {
//     setReminderOpen(bookingId);
//     setReminderType(type);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium">Filter by Project:</span>
//           <Select value={projectFilter} onValueChange={setProjectFilter}>
//             <SelectTrigger className="w-[200px]">
//               <SelectValue placeholder="All Projects" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Projects</SelectItem>
//               {projects.map((p) => (
//                 <SelectItem key={p._id} value={p._id}>
//                   {p.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-nowrap">Booking Ref</TableHead>
//                 <TableHead>Buyer</TableHead>
//                 <TableHead>Flat</TableHead>
//                 <TableHead>Project</TableHead>
//                 <TableHead className="text-right text-nowrap">
//                   Total Paid
//                 </TableHead>
//                 <TableHead className="text-right text-nowrap">
//                   Remaining
//                 </TableHead>
//                 <TableHead className="text-nowrap">Next Installment</TableHead>
//                 <TableHead className="text-right text-nowrap">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//                 {
//                 loading &&
//                 <TableRow>
//                     <TableCell colSpan={8}>
//                         <div className="flex bg-center gap-4">
//                         <Skeleton className="h-8 w-full" />
//                         <Skeleton className="h-8 w-full" />
//                         <Skeleton className="h-8 w-full" />
//                         <Skeleton className="h-8 w-full" />
//                         <Skeleton className="h-8 w-full" />
//                         <Skeleton className="h-8 w-full" />
//                         <Skeleton className="h-8 w-full" />
//                         </div>
//                     </TableCell>
//                 </TableRow>
//               }

//               {bookings.map((b) => (
//                 <TableRow key={b.bookingId}>
//                   <TableCell className="font-mono text-xs text-nowrap">
//                     {b.bookingReference}
//                   </TableCell>
//                   <TableCell>
//                     <div>{b.buyer?.name}</div>
//                     <div className="text-xs text-muted-foreground text-nowrap">
//                       {b.buyer?.email}
//                     </div>
//                   </TableCell>
//                   <TableCell className="min-w-40">
//                     Flat {b.flat?.flatNumber}, Tower {b.flat?.tower}
//                   </TableCell>
//                   <TableCell className="min-w-40">{b.projectName}</TableCell>
//                   <TableCell className="text-right">
//                     {formatINR(b.totalPaid)}
//                   </TableCell>
//                   <TableCell className="text-right font-medium text-destructive">
//                     {formatINR(b.remainingAmount)}
//                   </TableCell>
//                   <TableCell className="text-xs">
//                     {b.installmentSummary?.pendingInstallments > 0 ? (
//                       <>
//                         <span>
//                           {formatINR(
//                             b.installments?.find((i) => !i.paid)?.amount || 0,
//                           )}
//                         </span>
//                         <span className="text-muted-foreground ml-1 block text-nowrap">
//                           due{" "}
//                           {formatDate(
//                             b.installments?.find((i) => !i.paid)?.dueDate,
//                           )}
//                         </span>
//                       </>
//                     ) : (
//                       "All paid"
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-1">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         title="Send Normal Reminder"
//                         onClick={() =>
//                           openReminderDialog(b.bookingId, "normal")
//                         }
//                         disabled={!b.buyer?.email}
//                       >
//                         <Mail className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         title="Send Penalty Reminder"
//                         onClick={() =>
//                           openReminderDialog(b.bookingId, "penalty")
//                         }
//                         disabled={!b.buyer?.email}
//                       >
//                         <AlertTriangle className="h-4 w-4 text-destructive" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}

//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Reminder Dialog */}
//       <Dialog
//         open={!!reminderOpen}
//         onOpenChange={(v) => !v && setReminderOpen(null)}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               {reminderType === "normal"
//                 ? "Send Normal Reminder"
//                 : "Send Penalty Reminder"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-3">
//             {reminderType === "normal" && (
//               <div className="space-y-1.5">
//                 <Label>Milestone Name (optional)</Label>
//                 <Input
//                   placeholder="e.g. 2nd Slab Casting"
//                   value={reminderData.milestoneName}
//                   onChange={(e) =>
//                     setReminderData({
//                       ...reminderData,
//                       milestoneName: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             )}
//             <div className="space-y-1.5">
//               <Label>Due Date (optional)</Label>
//               <Input
//                 type="date"
//                 value={reminderData.dueDate}
//                 onChange={(e) =>
//                   setReminderData({ ...reminderData, dueDate: e.target.value })
//                 }
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setReminderOpen(null)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={() => handleSendReminder(reminderOpen)}
//               disabled={loading}
//             >
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Send
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatINR, formatDate } from "@/lib/helpers";
import { Mail, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { projectApi } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceBookings() {
  const {
    bookings,
    fetchBookings,
    sendNormalReminder,
    sendPenaltyReminder,
    loading,
    pagination,
  } = useFinance();
  
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [reminderOpen, setReminderOpen] = useState(null);
  const [reminderType, setReminderType] = useState("normal");
  const [reminderData, setReminderData] = useState({
    dueDate: "",
    milestoneName: "",
  });

  const fetchProjects = async () => {
    try {
      const res = await projectApi.getAll();
      if (res.data.success) {
        setProjects(res.data.data?.projects || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    }
  };

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [projectFilter]);

  useEffect(() => {
    fetchBookings({
      projectId: projectFilter === "all" ? undefined : projectFilter,
      page: currentPage,
      limit: 10,
    });
  }, [projectFilter, currentPage, fetchBookings]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSendReminder = async (bookingId) => {
    const payload = {
      dueDate: reminderData.dueDate || undefined,
      milestoneName: reminderData.milestoneName || undefined,
    };
    if (reminderType === "normal") {
      await sendNormalReminder(bookingId, payload);
    } else {
      await sendPenaltyReminder(bookingId, payload);
    }
    setReminderOpen(null);
    setReminderData({ dueDate: "", milestoneName: "" });
  };

  const openReminderDialog = (bookingId, type) => {
    setReminderOpen(bookingId);
    setReminderType(type);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by Project:</span>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap">Booking Ref</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right text-nowrap">Total Paid</TableHead>
                <TableHead className="text-right text-nowrap">Remaining</TableHead>
                <TableHead className="text-nowrap">Next Installment</TableHead>
                <TableHead className="text-right text-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex bg-center gap-4">
                      {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {bookings.map((b) => (
                <TableRow key={b.bookingId}>
                  <TableCell className="font-mono text-xs text-nowrap">
                    {b.bookingReference}
                  </TableCell>
                  <TableCell>
                    <div>{b.buyer?.name}</div>
                    <div className="text-xs text-muted-foreground text-nowrap">
                      {b.buyer?.email}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-40">
                    Flat {b.flat?.flatNumber}, Tower {b.flat?.tower}
                  </TableCell>
                  <TableCell className="min-w-40">{b.projectName}</TableCell>
                  <TableCell className="text-right">
                    {formatINR(b.totalPaid)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-destructive">
                    {formatINR(b.remainingAmount)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {b.installmentSummary?.pendingInstallments > 0 ? (
                      <>
                        <span>
                          {formatINR(
                            b.installments?.find((i) => !i.paid)?.amount || 0,
                          )}
                        </span>
                        <span className="text-muted-foreground ml-1 block text-nowrap">
                          due{" "}
                          {formatDate(
                            b.installments?.find((i) => !i.paid)?.dueDate,
                          )}
                        </span>
                      </>
                    ) : (
                      "All paid"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Send Normal Reminder"
                        onClick={() => openReminderDialog(b.bookingId, "normal")}
                        disabled={!b.buyer?.email}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Send Penalty Reminder"
                        onClick={() => openReminderDialog(b.bookingId, "penalty")}
                        disabled={!b.buyer?.email}
                      >
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing page {pagination.page} of {pagination.pages} ({pagination.total} total bookings)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === pagination.pages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Dialog */}
      <Dialog
        open={!!reminderOpen}
        onOpenChange={(v) => !v && setReminderOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reminderType === "normal"
                ? "Send Normal Reminder"
                : "Send Penalty Reminder"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {reminderType === "normal" && (
              <div className="space-y-1.5">
                <Label>Milestone Name (optional)</Label>
                <Input
                  placeholder="e.g. 2nd Slab Casting"
                  value={reminderData.milestoneName}
                  onChange={(e) =>
                    setReminderData({
                      ...reminderData,
                      milestoneName: e.target.value,
                    })
                  }
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Due Date (optional)</Label>
              <Input
                type="date"
                value={reminderData.dueDate}
                onChange={(e) =>
                  setReminderData({ ...reminderData, dueDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderOpen(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSendReminder(reminderOpen)}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}