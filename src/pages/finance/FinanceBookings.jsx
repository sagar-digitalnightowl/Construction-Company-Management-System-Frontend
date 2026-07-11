// // // src/pages/finance/FinanceBookings.jsx
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
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Mail, AlertTriangle, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { projectApi } from "@/api";
// import { Skeleton } from "@/components/ui/skeleton";

// export function FinanceBookings() {
//   const {
//     bookings,
//     pagination, // <-- Bookings Table Pagination
//     fetchBookings,
//     sendNormalReminder,
//     sendPenaltyReminder,
//     loading,
//   } = useFinance();
  
//   // Projects Dropdown States
//   const [projects, setProjects] = useState([]);
//   const [projectFilter, setProjectFilter] = useState("all");
//   const [projectPage, setProjectPage] = useState(1);
//   const [hasMoreProjects, setHasMoreProjects] = useState(true);

//   // Bookings Table State
//   const [currentPage, setCurrentPage] = useState(1); 
  
//   // Reminder States
//   const [reminderOpen, setReminderOpen] = useState(null);
//   const [reminderType, setReminderType] = useState("normal");
//   const [reminderData, setReminderData] = useState({
//     dueDate: "",
//     milestoneName: "",
//   });

//   // Fetch Projects with Pagination support for dropdown
//   const fetchProjects = async (pageNo = 1) => {
//     try {
//       const res = await projectApi.getAll({ page: pageNo, limit: 10 });
//       if (res.data.success) {
//         const fetchedProjects = res.data.data?.projects || res.data.data?.docs || res.data.data || [];
//         const projectPagination = res.data.data?.pagination;

//         if (pageNo === 1) {
//           setProjects(fetchedProjects);
//         } else {
//           setProjects((prev) => [...prev, ...fetchedProjects]);
//         }

//         if (projectPagination && pageNo >= projectPagination.pages) {
//           setHasMoreProjects(false);
//         } else {
//           setHasMoreProjects(true);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load projects");
//     }
//   };

//   // Reset page to 1 whenever project filter is changed
//   const handleProjectFilterChange = (val) => {
//     setProjectFilter(val);
//     setCurrentPage(1);
//   };

//   useEffect(() => {
//     fetchBookings({
//       projectId: projectFilter === "all" ? undefined : projectFilter,
//       page: currentPage, 
//       limit: 10,       
//     });
//   }, [projectFilter, currentPage, fetchBookings]);

//   useEffect(() => {
//     fetchProjects(1);
//   }, []);

//   // Dropdown ke andar "Load More Projects" handle karne ke liye
//   const handleLoadMoreProjects = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const nextPage = projectPage + 1;
//     setProjectPage(nextPage);
//     fetchProjects(nextPage);
//   };

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
//           <Select value={projectFilter} onValueChange={handleProjectFilterChange}>
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
              
//               {/* Load More Button for Projects */}
//               {hasMoreProjects && (
//                 <div 
//                   className="w-full text-left px-2 py-1.5 text-xs text-blue-600 font-medium hover:bg-muted border-t mt-1 cursor-pointer"
//                   onClick={handleLoadMoreProjects}
//                 >
//                   + Load More Projects
//                 </div>
//               )}
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
//               {loading && (
//                 <TableRow>
//                   <TableCell colSpan={8}>
//                     <div className="flex bg-center gap-4">
//                       <Skeleton className="h-8 w-full" />
//                       <Skeleton className="h-8 w-full" />
//                       <Skeleton className="h-8 w-full" />
//                       <Skeleton className="h-8 w-full" />
//                       <Skeleton className="h-8 w-full" />
//                       <Skeleton className="h-8 w-full" />
//                       <Skeleton className="h-8 w-full" />
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               )}

//               {!loading && bookings.map((b) => (
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
//                     <div className="flex gap-1 justify-end">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         title="Send Normal Reminder"
//                         onClick={() => openReminderDialog(b.bookingId, "normal")}
//                         disabled={!b.buyer?.email}
//                       >
//                         <Mail className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         title="Send Penalty Reminder"
//                         onClick={() => openReminderDialog(b.bookingId, "penalty")}
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

//       {/* Pagination Controls */}
//       {!loading && pagination && pagination.total > 0 && (
//         <div className="flex items-center justify-between pt-2">
//           <div className="text-sm text-muted-foreground">
//             Showing page {pagination.page} of {pagination.pages} (Total: {pagination.total} bookings)
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//               disabled={pagination.page <= 1}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               disabled={pagination.page >= pagination.pages}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}

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





// src/pages/finance/FinanceBookings.jsx
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { formatINR, formatDate } from "@/lib/helpers";
import { Mail, AlertTriangle, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { projectApi } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceBookings() {
  const {
    bookings,
    pagination, // <-- Bookings Table Pagination
    fetchBookings,
    sendNormalReminder,
    sendPenaltyReminder,
    loading,
  } = useFinance();
  
  // Projects Dropdown States
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState("all");
  const [projectPage, setProjectPage] = useState(1);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);

  // Bookings Table State
  const [currentPage, setCurrentPage] = useState(1);
  
  // ✅ NEW: Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  
  // Reminder States
  const [reminderOpen, setReminderOpen] = useState(null);
  const [reminderType, setReminderType] = useState("normal");
  const [reminderData, setReminderData] = useState({
    dueDate: "",
    milestoneName: "",
  });

  // Fetch Projects with Pagination support for dropdown
  const fetchProjects = async (pageNo = 1) => {
    try {
      const res = await projectApi.getAll({ page: pageNo, limit: 10 });
      if (res.data.success) {
        const fetchedProjects = res.data.data?.projects || res.data.data?.docs || res.data.data || [];
        const projectPagination = res.data.data?.pagination;

        if (pageNo === 1) {
          setProjects(fetchedProjects);
        } else {
          setProjects((prev) => [...prev, ...fetchedProjects]);
        }

        if (projectPagination && pageNo >= projectPagination.pages) {
          setHasMoreProjects(false);
        } else {
          setHasMoreProjects(true);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    }
  };

  // Reset page to 1 whenever project filter is changed
  const handleProjectFilterChange = (val) => {
    setProjectFilter(val);
    setCurrentPage(1);
  };

  // ✅ NEW: Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchInputValue.trim();
    setSearchQuery(trimmedQuery);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // ✅ NEW: Handle Clear Search
  const clearSearch = () => {
    setSearchInputValue("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // ✅ UPDATED: Include search parameter in fetchBookings
  useEffect(() => {
    fetchBookings({
      projectId: projectFilter === "all" ? undefined : projectFilter,
      search: searchQuery || undefined,
      page: currentPage,
      limit: 10,
    });
  }, [projectFilter, currentPage, searchQuery, fetchBookings]);

  useEffect(() => {
    fetchProjects(1);
  }, []);

  // Dropdown ke andar "Load More Projects" handle karne ke liye
  const handleLoadMoreProjects = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextPage = projectPage + 1;
    setProjectPage(nextPage);
    fetchProjects(nextPage);
  };

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
      {/* ✅ UPDATED: Filter Section with Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">Filter by Project:</span>
          <Select value={projectFilter} onValueChange={handleProjectFilterChange}>
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
              
              {/* Load More Button for Projects */}
              {hasMoreProjects && (
                <div 
                  className="w-full text-left px-2 py-1.5 text-xs text-blue-600 font-medium hover:bg-muted border-t mt-1 cursor-pointer"
                  onClick={handleLoadMoreProjects}
                >
                  + Load More Projects
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* ✅ NEW: Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, ref, flat..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="pl-8 pr-8"
            />
            {searchInputValue && (
              <button
                type="button"
                onClick={() => setSearchInputValue("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" variant="default" size="sm" disabled={!searchInputValue.trim()}>
            Search
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="text-muted-foreground"
            >
              Clear
            </Button>
          )}
        </form>
      </div>

      {/* ✅ NEW: Active Search Badge */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary" className="gap-1">
            <Search className="h-3 w-3" />
            {searchQuery}
          </Badge>
          <span className="text-muted-foreground">
            {pagination?.total > 0 
              ? `Found ${pagination.total} result${pagination.total > 1 ? 's' : ''}`
              : 'No results found'}
          </span>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap">Booking Ref</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right text-nowrap">
                  Total Paid
                </TableHead>
                <TableHead className="text-right text-nowrap">
                  Remaining
                </TableHead>
                <TableHead className="text-nowrap">Next Installment</TableHead>
                <TableHead className="text-right text-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!loading && !searchQuery && bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}

              {!loading && searchQuery && bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No bookings found matching "<span className="font-medium text-foreground">{searchQuery}</span>"</p>
                      <Button variant="link" onClick={clearSearch} className="text-sm">
                        Clear search
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!loading && bookings.map((b) => (
                <TableRow key={b.bookingId}>
                  <TableCell className="font-mono text-xs text-nowrap">
                    {b.bookingReference}
                  </TableCell>
                  <TableCell>
                    <div>{b.buyer?.name}</div>
                    <div className="text-xs text-muted-foreground text-nowrap">
                      {b.buyer?.email}
                    </div>
                    {b.buyer?.phone && (
                      <div className="text-xs text-muted-foreground">
                        {b.buyer.phone}
                      </div>
                    )}
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
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {!loading && pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Showing page {pagination.page} of {pagination.pages} (Total: {pagination.total} bookings)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

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