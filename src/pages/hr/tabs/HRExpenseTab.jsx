// import React, { useEffect, useState } from "react";
// import { CheckCircle, XCircle, Search, FileText, ChevronLeft, ChevronRight, Eye, Hash, User, Tag, File } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { hrApi } from "@/api/hrApi"; 
// import { toast } from "sonner";

// export function HRExpenseTab() {
//   const [activeTab, setActiveTab] = useState("Pending");
//   const [expenses, setExpenses] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal States
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);

//   // Form States
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   const fetchExpensesByStatus = async (status, page = 1, limit = 10, search = "") => {
//     setLoading(true);
//     try {
//       const params = { status, page, limit };
//       if (search.trim()) params.search = search.trim();
      
//       const res = await hrApi.getAllExpenses(params);
//       const responseData = res.data?.data || {};
//       setExpenses(Array.isArray(responseData.tickets) ? responseData.tickets : []);
//       if (responseData.pagination) setPagination(responseData.pagination);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load expenses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpensesByStatus(activeTab, 1, 10, searchTerm);
//   }, [activeTab]);

//   useEffect(() => {
//     const debounce = setTimeout(() => fetchExpensesByStatus(activeTab, 1, 10, searchTerm), 500);
//     return () => clearTimeout(debounce);
//   }, [searchTerm]);

//   const handleApprove = async () => {
//     try {
//       await hrApi.approveExpense(selectedExpense._id, { remarks: approveRemarks });
//       toast.success("Expense Approved!");
//       setIsApproveOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, 10, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to approve");
//     }
//   };

//   const handleReject = async () => {
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     try {
//       await hrApi.rejectExpense(selectedExpense._id, { reason: rejectReason });
//       toast.success("Expense Rejected!");
//       setIsRejectOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, 10, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to reject");
//     }
//   };

//   const openModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
//           <TabsList>
//             <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//             <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//           </TabsList>
//         </Tabs>
//         <div className="relative w-full sm:w-64">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>
//       </div>

//       <div className="border rounded-md">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Employee</TableHead>
//               <TableHead>Title</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Proof</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
//             ) : expenses.length === 0 ? (
//               <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
//             ) : (
//               expenses.map((expense) => (
//                 <TableRow key={expense._id}>
//                   <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <div className="font-medium">{expense.employeeId?.name}</div>
//                     <div className="text-xs text-muted-foreground">{expense.employeeId?.email}</div>
//                   </TableCell>
//                   <TableCell><div className="font-medium">{expense.title}</div></TableCell>
//                   <TableCell className="font-bold">₹{expense.amount}</TableCell>
//                   <TableCell>
//                     {expense.proofUrl ? (
//                       <a href={expense.proofUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
//                         <FileText className="h-3 w-3" /> View
//                       </a>
//                     ) : "N/A"}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button variant="ghost" size="sm" onClick={() => openModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
//                       {activeTab === "Pending" && (
//                         <>
//                           <Button size="sm" variant="outline" className="border-success/50 text-success" onClick={() => openModal(expense, 'approve')}>
//                             <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                           </Button>
//                           <Button size="sm" variant="outline" className="border-destructive/50 text-destructive" onClick={() => openModal(expense, 'reject')}>
//                             <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* MODALS: Approve & Reject */}
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Approve Expense</DialogTitle>
//           </DialogHeader>
//           <div className="py-4"><Label>Remarks</Label><Input value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} /></div>
//           <DialogFooter><Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button><Button onClick={handleApprove}>Approve</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           <div className="py-4"><Label>Reason *</Label><Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></div>
//           <DialogFooter><Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleReject}>Reject</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
      
//       {/* View Modal Basic implementation */}
//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Expense Details</DialogTitle></DialogHeader>
//           <div className="space-y-2 py-4">
//             <p><strong>Title:</strong> {selectedExpense?.title}</p>
//             <p><strong>Amount:</strong> ₹{selectedExpense?.amount}</p>
//             <p><strong>Description:</strong> {selectedExpense?.description}</p>
//             {selectedExpense?.rejectionReason && <p className="text-destructive"><strong>Rejection Reason:</strong> {selectedExpense?.rejectionReason}</p>}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { CheckCircle, XCircle, Search, FileText, ChevronLeft, ChevronRight, Eye, Hash, User, Tag, File } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { hrApi } from "@/api/hrApi"; 
// import { toast } from "sonner";

// export function HRExpenseTab() {
//   const [activeTab, setActiveTab] = useState("Pending");
//   const [expenses, setExpenses] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal States
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);

//   // Form States
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   const fetchExpensesByStatus = async (status, page = 1, limit = 10, search = "") => {
//     setLoading(true);
//     try {
//       const params = { status, page, limit };
//       if (search.trim()) params.search = search.trim();
      
//       const res = await hrApi.getAllExpenses(params);
//       const responseData = res.data?.data || {};
//       setExpenses(Array.isArray(responseData.tickets) ? responseData.tickets : []);
//       if (responseData.pagination) setPagination(responseData.pagination);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load expenses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpensesByStatus(activeTab, 1, 10, searchTerm);
//   }, [activeTab]);

//   useEffect(() => {
//     const debounce = setTimeout(() => fetchExpensesByStatus(activeTab, 1, 10, searchTerm), 500);
//     return () => clearTimeout(debounce);
//   }, [searchTerm]);

//   const handleApprove = async () => {
//     try {
//       await hrApi.approveExpense(selectedExpense._id, { remarks: approveRemarks });
//       toast.success("Expense Approved!");
//       setIsApproveOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, 10, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to approve");
//     }
//   };

//   const handleReject = async () => {
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     try {
//       await hrApi.rejectExpense(selectedExpense._id, { reason: rejectReason });
//       toast.success("Expense Rejected!");
//       setIsRejectOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, 10, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to reject");
//     }
//   };

//   const openModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
//           <TabsList>
//             <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//             {/* ✅ NEW: Approved Tab Added for HR to track history */}
//             <TabsTrigger value="Approved">Approved</TabsTrigger>
//             <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//           </TabsList>
//         </Tabs>
//         <div className="relative w-full sm:w-64">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>
//       </div>

//       <div className="border rounded-md">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Employee</TableHead>
//               <TableHead>Title</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Proof</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
//             ) : expenses.length === 0 ? (
//               <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
//             ) : (
//               expenses.map((expense) => (
//                 <TableRow key={expense._id}>
//                   <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <div className="font-medium">{expense.employeeId?.name}</div>
//                     <div className="text-xs text-muted-foreground">{expense.employeeId?.email}</div>
//                   </TableCell>
//                   <TableCell><div className="font-medium">{expense.title}</div></TableCell>
//                   <TableCell className="font-bold">₹{expense.amount}</TableCell>
//                   <TableCell>
//                     {expense.proofUrl ? (
//                       <a href={expense.proofUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
//                         <FileText className="h-3 w-3" /> View
//                       </a>
//                     ) : "N/A"}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       {/* View button is always visible */}
//                       <Button variant="ghost" size="sm" onClick={() => openModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
                      
//                       {/* Actions buttons are ONLY visible in the Pending tab */}
//                       {activeTab === "Pending" && (
//                         <>
//                           <Button size="sm" variant="outline" className="border-success/50 text-success" onClick={() => openModal(expense, 'approve')}>
//                             <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                           </Button>
//                           <Button size="sm" variant="outline" className="border-destructive/50 text-destructive" onClick={() => openModal(expense, 'reject')}>
//                             <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* MODALS: Approve & Reject */}
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Approve Expense</DialogTitle>
//           </DialogHeader>
//           <div className="py-4"><Label>Remarks</Label><Input value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} /></div>
//           <DialogFooter><Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button><Button onClick={handleApprove}>Approve</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           <div className="py-4"><Label>Reason *</Label><Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></div>
//           <DialogFooter><Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleReject}>Reject</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
      
//       {/* View Modal Basic implementation */}
//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Expense Details</DialogTitle></DialogHeader>
//           <div className="space-y-2 py-4">
//             <p><strong>Title:</strong> {selectedExpense?.title}</p>
//             <p><strong>Amount:</strong> ₹{selectedExpense?.amount}</p>
//             <p><strong>Description:</strong> {selectedExpense?.description}</p>
//             {selectedExpense?.rejectionReason && <p className="text-destructive"><strong>Rejection Reason:</strong> {selectedExpense?.rejectionReason}</p>}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }











// import React, { useEffect, useState } from "react";
// import { CheckCircle, XCircle, Search, FileText, ChevronLeft, ChevronRight, Eye, Hash, User, Tag, File, Calendar } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { hrApi } from "@/api/hrApi"; 
// import { toast } from "sonner";

// export function HRExpenseTab() {
//   const [activeTab, setActiveTab] = useState("Pending");
//   const [expenses, setExpenses] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal States
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);

//   // Form States
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   const fetchExpensesByStatus = async (status, page = 1, limit = 10, search = "") => {
//     setLoading(true);
//     try {
//       const params = { status, page, limit };
//       if (search.trim()) params.search = search.trim();
      
//       const res = await hrApi.getAllExpenses(params);
//       const responseData = res.data?.data || {};
//       setExpenses(Array.isArray(responseData.tickets) ? responseData.tickets : []);
//       if (responseData.pagination) setPagination(responseData.pagination);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load expenses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpensesByStatus(activeTab, 1, 10, searchTerm);
//   }, [activeTab]);

//   useEffect(() => {
//     const debounce = setTimeout(() => fetchExpensesByStatus(activeTab, 1, 10, searchTerm), 500);
//     return () => clearTimeout(debounce);
//   }, [searchTerm]);

//   const handleApprove = async () => {
//     try {
//       await hrApi.approveExpense(selectedExpense._id, { remarks: approveRemarks });
//       toast.success("Expense Approved!");
//       setIsApproveOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, 10, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to approve");
//     }
//   };

//   const handleReject = async () => {
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     try {
//       await hrApi.rejectExpense(selectedExpense._id, { reason: rejectReason });
//       toast.success("Expense Rejected!");
//       setIsRejectOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, 10, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to reject");
//     }
//   };

//   const openModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // Helper function for date formatting
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//       hour: "2-digit", minute: "2-digit", hour12: true
//     });
//   };

//   // Helper to color-code status badge
//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Rejected": return "destructive";
//       default: return "secondary"; // Pending
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
//           <TabsList>
//             <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//             <TabsTrigger value="Approved">Approved</TabsTrigger>
//             <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//           </TabsList>
//         </Tabs>
//         <div className="relative w-full sm:w-64">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>
//       </div>

//       <div className="border rounded-md">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Employee</TableHead>
//               <TableHead>Title</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Proof</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
//             ) : expenses.length === 0 ? (
//               <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
//             ) : (
//               expenses.map((expense) => (
//                 <TableRow key={expense._id}>
//                   <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <div className="font-medium">{expense.employeeId?.name}</div>
//                     <div className="text-xs text-muted-foreground">{expense.employeeId?.email}</div>
//                   </TableCell>
//                   <TableCell><div className="font-medium">{expense.title}</div></TableCell>
//                   <TableCell className="font-bold">₹{expense.amount}</TableCell>
//                   <TableCell>
//                     {expense.proofUrl ? (
//                       <a href={expense.proofUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
//                         <FileText className="h-3 w-3" /> View
//                       </a>
//                     ) : "N/A"}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button variant="ghost" size="sm" onClick={() => openModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
                      
//                       {activeTab === "Pending" && (
//                         <>
//                           <Button size="sm" variant="outline" className="border-success/50 text-success" onClick={() => openModal(expense, 'approve')}>
//                             <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                           </Button>
//                           <Button size="sm" variant="outline" className="border-destructive/50 text-destructive" onClick={() => openModal(expense, 'reject')}>
//                             <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* MODALS: Approve & Reject */}
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Approve Expense</DialogTitle>
//           </DialogHeader>
//           <div className="py-4"><Label>Remarks</Label><Input value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} /></div>
//           <DialogFooter><Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button><Button onClick={handleApprove}>Approve</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           <div className="py-4"><Label>Reason *</Label><Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></div>
//           <DialogFooter><Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleReject}>Reject</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
      
//       {/* View Modal - FULLY DETAILED */}
//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-xl">
//               <FileText className="h-5 w-5 text-primary" />
//               Expense Details
//             </DialogTitle>
//           </DialogHeader>

//           {selectedExpense && (
//             <div className="space-y-6 py-4">
              
//               {/* Top Section: Ticket ID, Status, Amount */}
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <Hash className="h-4 w-4 text-muted-foreground" />
//                     <span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber || "N/A"}</span>
//                   </div>
//                   <div className="mt-2">
//                     <Badge variant={getStatusBadgeVariant(selectedExpense.status)}>
//                       {selectedExpense.status}
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">
//                     Requested on: {formatDate(selectedExpense.createdAt)}
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               {/* Basic Details: Employee & Category */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1">
//                     <User className="h-4 w-4" /> Employee Info
//                   </Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name || "N/A"}</div>
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.phone}</div>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1">
//                     <Tag className="h-4 w-4" /> Expense Category
//                   </Label>
//                   <div className="font-medium text-base">{selectedExpense.category || "N/A"}</div>
//                 </div>
//               </div>

//               <Separator />

//               {/* Title & Description */}
//               <div className="space-y-4">
//                 <div>
//                   <Label className="text-muted-foreground">Title</Label>
//                   <div className="font-medium text-lg">{selectedExpense.title}</div>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground">Description</Label>
//                   <div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">
//                     {selectedExpense.description || "No description provided."}
//                   </div>
//                 </div>
//               </div>

//               {/* Approval Info Section (Visible if status is not Pending) */}
//               {selectedExpense.status === "Approved" && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
//                       <CheckCircle className="h-4 w-4" /> Approval Details
//                     </Label>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <span className="text-xs text-muted-foreground">Approved By</span>
//                         <div className="font-medium text-sm">{selectedExpense.approvedBy?.name || "N/A"}</div>
//                       </div>
//                       <div>
//                         <span className="text-xs text-muted-foreground">Approved At</span>
//                         <div className="font-medium text-sm">{formatDate(selectedExpense.approvedAt)}</div>
//                       </div>
//                       {selectedExpense.approverRemarks && (
//                         <div className="md:col-span-2">
//                           <span className="text-xs text-muted-foreground">Approver Remarks</span>
//                           <div className="text-sm p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-md mt-1">
//                             {selectedExpense.approverRemarks}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}

//               {/* Rejection Info Section */}
//               {selectedExpense.status === "Rejected" && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-destructive">
//                       <XCircle className="h-4 w-4" /> Rejection Details
//                     </Label>
//                     <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
//                       <span className="text-xs font-semibold text-destructive uppercase tracking-wide">Reason for Rejection</span>
//                       <p className="mt-1 text-sm font-medium">
//                         {selectedExpense.rejectionReason || "No explicit reason provided."}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               )}

//               {/* Proof Attachment */}
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a 
//                       href={selectedExpense.proofUrl} 
//                       target="_blank" 
//                       rel="noreferrer"
//                       className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary"
//                     >
//                       <FileText className="h-4 w-4" />
//                       View Document ({selectedExpense.proofMimeType?.split('/')[1]?.toUpperCase() || "FILE"})
//                     </a>
//                   </div>
//                 </>
//               )}

//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Search, FileText, ChevronLeft, ChevronRight, Eye, Hash, User, Tag, File, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { hrApi } from "@/api/hrApi"; 
import { toast } from "sonner";

export function HRExpenseTab() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Form States
  const [approveRemarks, setApproveRemarks] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchExpensesByStatus = async (status, page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const params = { status, page, limit };
      if (search.trim()) params.search = search.trim();
      
      const res = await hrApi.getAllExpenses(params);
      const responseData = res.data?.data || {};
      setExpenses(Array.isArray(responseData.tickets) ? responseData.tickets : []);
      if (responseData.pagination) setPagination(responseData.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesByStatus(activeTab, 1, 10, searchTerm);
  }, [activeTab]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchExpensesByStatus(activeTab, 1, 10, searchTerm), 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleApprove = async () => {
    try {
      await hrApi.approveExpense(selectedExpense._id, { remarks: approveRemarks });
      toast.success("Expense Approved!");
      setIsApproveOpen(false);
      fetchExpensesByStatus(activeTab, pagination.page, 10, searchTerm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error("Reason is required!");
    try {
      await hrApi.rejectExpense(selectedExpense._id, { reason: rejectReason });
      toast.success("Expense Rejected!");
      setIsRejectOpen(false);
      fetchExpensesByStatus(activeTab, pagination.page, 10, searchTerm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  const openModal = (expense, type) => {
    setSelectedExpense(expense);
    if (type === 'view') setIsViewOpen(true);
    if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
    if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
  };

  // Helper function for date formatting
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true
    });
  };

  // Helper to color-code status badge
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Approved": return "default";
      case "Paid": return "outline"; // Or you can use a custom class for green
      case "Rejected": return "destructive";
      default: return "secondary"; // Pending
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Added overflow-auto to prevent wrapping issues on small screens with 4 tabs */}
        <div className="w-full sm:w-auto overflow-auto scrollbar-none">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="Approved">Approved</TabsTrigger>
              {/* ✅ NEW: Paid tab added for HR */}
              <TabsTrigger value="Paid">Paid History</TabsTrigger> 
              <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : expenses.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{expense.employeeId?.name}</div>
                    <div className="text-xs text-muted-foreground">{expense.employeeId?.email}</div>
                  </TableCell>
                  <TableCell><div className="font-medium">{expense.title}</div></TableCell>
                  <TableCell className="font-bold">₹{expense.amount}</TableCell>
                  <TableCell>
                    {expense.proofUrl ? (
                      <a href={expense.proofUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                        <FileText className="h-3 w-3" /> View
                      </a>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
                      
                      {activeTab === "Pending" && (
                        <>
                          <Button size="sm" variant="outline" className="border-success/50 text-success" onClick={() => openModal(expense, 'approve')}>
                            <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-destructive/50 text-destructive" onClick={() => openModal(expense, 'reject')}>
                            <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODALS: Approve & Reject */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Expense</DialogTitle>
          </DialogHeader>
          <div className="py-4"><Label>Remarks</Label><Input value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} /></div>
          <DialogFooter><Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button><Button onClick={handleApprove}>Approve</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
          <div className="py-4"><Label>Reason *</Label><Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></div>
          <DialogFooter><Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleReject}>Reject</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Modal - FULLY DETAILED */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Expense Details
            </DialogTitle>
          </DialogHeader>

          {selectedExpense && (
            <div className="space-y-6 py-4">
              
              {/* Top Section: Ticket ID, Status, Amount */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber || "N/A"}</span>
                  </div>
                  <div className="mt-2">
                    <Badge 
                      variant={getStatusBadgeVariant(selectedExpense.status)}
                      className={selectedExpense.status === "Paid" ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" : ""}
                    >
                      {selectedExpense.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Requested on: {formatDate(selectedExpense.createdAt)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Details: Employee & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" /> Employee Info
                  </Label>
                  <div className="font-medium text-base">{selectedExpense.employeeId?.name || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
                  <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.phone}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2 mb-1">
                    <Tag className="h-4 w-4" /> Expense Category
                  </Label>
                  <div className="font-medium text-base">{selectedExpense.category || "N/A"}</div>
                </div>
              </div>

              <Separator />

              {/* Title & Description */}
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <div className="font-medium text-lg">{selectedExpense.title}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">
                    {selectedExpense.description || "No description provided."}
                  </div>
                </div>
              </div>

              {/* Approval Info Section (Visible if Approved OR Paid) */}
              {(selectedExpense.status === "Approved" || selectedExpense.status === "Paid") && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4" /> Approval Details
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Approved By</span>
                        <div className="font-medium text-sm">{selectedExpense.approvedBy?.name || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Approved At</span>
                        <div className="font-medium text-sm">{formatDate(selectedExpense.approvedAt)}</div>
                      </div>
                      {selectedExpense.approverRemarks && (
                        <div className="md:col-span-2">
                          <span className="text-xs text-muted-foreground">Approver Remarks</span>
                          <div className="text-sm p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-md mt-1">
                            {selectedExpense.approverRemarks}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ✅ NEW: Payment Info Section (Only visible if status is Paid) */}
              {selectedExpense.status === "Paid" && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                      <DollarSign className="h-4 w-4" /> Payment Details (Finance)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Payment Method</span>
                        <div className="font-medium text-sm">{selectedExpense.paymentMethod || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Reference / Txn No</span>
                        <div className="font-medium text-sm font-mono">{selectedExpense.paymentReference || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Paid By</span>
                        <div className="font-medium text-sm">{selectedExpense.paidBy?.name || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Paid At</span>
                        <div className="font-medium text-sm">{formatDate(selectedExpense.paidAt)}</div>
                      </div>
                      {selectedExpense.paymentRemarks && (
                        <div className="md:col-span-2">
                          <span className="text-xs text-muted-foreground">Payment Remarks</span>
                          <div className="text-sm p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md mt-1">
                            {selectedExpense.paymentRemarks}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Rejection Info Section */}
              {selectedExpense.status === "Rejected" && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-destructive">
                      <XCircle className="h-4 w-4" /> Rejection Details
                    </Label>
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <span className="text-xs font-semibold text-destructive uppercase tracking-wide">Reason for Rejection</span>
                      <p className="mt-1 text-sm font-medium">
                        {selectedExpense.rejectionReason || "No explicit reason provided."}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Proof Attachment */}
              {selectedExpense.proofUrl && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
                    <a 
                      href={selectedExpense.proofUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary"
                    >
                      <FileText className="h-4 w-4" />
                      View Document ({selectedExpense.proofMimeType?.split('/')[1]?.toUpperCase() || "FILE"})
                    </a>
                  </div>
                </>
              )}

            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}