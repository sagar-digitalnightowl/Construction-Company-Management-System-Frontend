// import React, { useEffect, useState } from "react";
// import { CheckCircle, XCircle, CreditCard, Search, FileText } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { hrApi } from "@/api/hrApi"; 
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { toast } from "sonner";

// export default function ExpenseApprovals() {
//   const { current } = useAuthStore();
  
//   // Explicit Admin check added along with permissions
//   const isAdmin = current?.role === "admin";
//   const canApprove = isAdmin || canMutate(current?.role, "expense-approvals");
//   const canPay = isAdmin || canMutate(current?.role, "expense-payment");

//   const [activeTab, setActiveTab] = useState("Pending");
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal States
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isPayOpen, setIsPayOpen] = useState(false);

//   // Form States
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");
//   const [paymentData, setPaymentData] = useState({
//     paymentMethod: "",
//     paymentReference: "",
//     remarks: ""
//   });

//   // Fetch expenses based on the active tab (status)
//   const fetchExpensesByStatus = async (status) => {
//     setLoading(true);
//     try {
//       const res = await hrApi.getAllExpenses({ status });
//       setExpenses(res.data?.data || []);
//     } catch (err) {
//       toast.error("Failed to load expenses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Re-fetch when tab changes
//   useEffect(() => {
//     fetchExpensesByStatus(activeTab);
//   }, [activeTab]);

//   // ================= ACTIONS =================
//   const handleApprove = async () => {
//     try {
//       await hrApi.approveExpense(selectedExpense._id, { remarks: approveRemarks });
//       toast.success("Expense Approved!");
//       setIsApproveOpen(false);
//       fetchExpensesByStatus(activeTab);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to approve");
//     }
//   };

//   const handleReject = async () => {
//     if (!rejectReason.trim()) return toast.error("Reason is required to reject!");
//     try {
//       await hrApi.rejectExpense(selectedExpense._id, { reason: rejectReason });
//       toast.success("Expense Rejected!");
//       setIsRejectOpen(false);
//       fetchExpensesByStatus(activeTab);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to reject");
//     }
//   };

//   const handlePay = async () => {
//     if (!paymentData.paymentMethod || !paymentData.paymentReference) {
//       return toast.error("Payment Method and Reference are required!");
//     }
//     try {
//       await hrApi.payExpense(selectedExpense._id, paymentData);
//       toast.success("Payment successful!");
//       setIsPayOpen(false);
//       fetchExpensesByStatus(activeTab);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to process payment");
//     }
//   };

//   // Helper to open specific modals
//   const openModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//     if (type === 'pay') { setPaymentData({ paymentMethod: "", paymentReference: "", remarks: "" }); setIsPayOpen(true); }
//   };

//   // Search Filter
//   const filteredExpenses = expenses.filter(exp => 
//     exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     (exp.employeeId?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-6 space-y-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-display font-semibold tracking-tight flex items-center gap-2">
//             <CheckCircle className="h-6 w-6 text-primary" />
//             Expense Approvals & Disbursements
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Review staff expenses, approve legitimate claims, and process payments.
//           </p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader className="border-b border-border pb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             {/* Tabs for Status */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
//               <TabsList>
//                 <TabsTrigger value="Pending">Pending (HR)</TabsTrigger>
//                 <TabsTrigger value="Approved">Approved (Finance)</TabsTrigger>
//                 <TabsTrigger value="Paid">Paid</TabsTrigger>
//                 <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//               </TabsList>
//             </Tabs>

//             {/* Search Bar */}
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by Title or Employee..."
//                 className="pl-9"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </CardHeader>
        
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Employee</TableHead>
//                 <TableHead>Title & Category</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Proof</TableHead>
//                 {/* Actions column only needed for Pending and Approved */}
//                 {(activeTab === "Pending" || activeTab === "Approved") && (
//                   <TableHead className="text-right">Actions</TableHead>
//                 )}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading tickets...</TableCell>
//                 </TableRow>
//               ) : filteredExpenses.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No {activeTab.toLowerCase()} tickets found.</TableCell>
//                 </TableRow>
//               ) : (
//                 filteredExpenses.map((expense) => (
//                   <TableRow key={expense._id}>
//                     <TableCell className="font-medium">
//                       {new Date(expense.createdAt).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>
//                       <div className="font-medium">{expense.employeeId?.name || "Unknown"}</div>
//                       <div className="text-xs text-muted-foreground">{expense.employeeId?.email}</div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="font-medium">{expense.title}</div>
//                       <Badge variant="outline" className="mt-1 text-[10px]">{expense.category}</Badge>
//                     </TableCell>
//                     <TableCell className="font-bold text-foreground">₹{expense.amount}</TableCell>
//                     <TableCell>
//                       {expense.proofUrl ? (
//                         <a href={expense.proofUrl} target="_blank" rel="noreferrer">
//                           <Button variant="ghost" size="xs" className="gap-1">
//                             <FileText className="h-3 w-3" /> View
//                           </Button>
//                         </a>
//                       ) : <span className="text-xs text-muted-foreground">N/A</span>}
//                     </TableCell>
                    
//                     {/* Action Buttons Based on Tab & Role */}
//                     {(activeTab === "Pending" || activeTab === "Approved") && (
//                       <TableCell className="text-right">
//                         {activeTab === "Pending" && canApprove && (
//                           <div className="flex justify-end gap-2">
//                             <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openModal(expense, 'approve')}>
//                               <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                             </Button>
//                             <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openModal(expense, 'reject')}>
//                               <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                             </Button>
//                           </div>
//                         )}
                        
//                         {activeTab === "Approved" && canPay && (
//                           <Button size="sm" onClick={() => openModal(expense, 'pay')}>
//                             <CreditCard className="mr-1 h-3.5 w-3.5" /> Pay Now
//                           </Button>
//                         )}

//                         {/* If they are viewing a tab but don't have permissions */}
//                         {activeTab === "Pending" && !canApprove && (
//                           <span className="text-xs text-muted-foreground italic">HR Action Required</span>
//                         )}
//                         {activeTab === "Approved" && !canPay && (
//                           <span className="text-xs text-muted-foreground italic">Pending Payment</span>
//                         )}
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* ================= MODALS ================= */}
      
//       {/* 1. APPROVE MODAL */}
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Approve Expense</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to approve this expense of <b>₹{selectedExpense?.amount}</b> for <b>{selectedExpense?.employeeId?.name}</b>?
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-2 py-4">
//             <Label>Remarks (Optional)</Label>
//             <Input placeholder="Looks good..." value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove}>Confirm Approval</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* 2. REJECT MODAL */}
//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-destructive">Reject Expense</DialogTitle>
//             <DialogDescription>Please provide a valid reason for rejecting this claim.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-2 py-4">
//             <Label>Rejection Reason <span className="text-destructive">*</span></Label>
//             <Textarea placeholder="Receipt is blur, amount mismatch..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* 3. PAY (FINANCE) MODAL */}
//       <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Process Payment</DialogTitle>
//             <DialogDescription>Record the disbursement details for <b>₹{selectedExpense?.amount}</b>.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label>Payment Method <span className="text-destructive">*</span></Label>
//               <Select onValueChange={(val) => setPaymentData({...paymentData, paymentMethod: val})}>
//                 <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="UPI">UPI</SelectItem>
//                   <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
//                   <SelectItem value="Cheque">Cheque</SelectItem>
//                   <SelectItem value="Cash">Cash</SelectItem>
//                   <SelectItem value="NEFT">NEFT</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <Label>Reference ID / Transaction No. <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. UPI/20260711XXXX" value={paymentData.paymentReference} onChange={(e) => setPaymentData({...paymentData, paymentReference: e.target.value})} />
//             </div>
//             <div className="grid gap-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional remarks..." value={paymentData.remarks} onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsPayOpen(false)}>Cancel</Button>
//             <Button onClick={handlePay}>Mark as Paid</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { CheckCircle, XCircle, CreditCard, Search, FileText, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { hrApi } from "@/api/hrApi"; 
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { toast } from "sonner";

// export default function ExpenseApprovals() {
//   const { current } = useAuthStore();
  
//   // Explicit Admin check added along with permissions
//   const isAdmin = current?.role === "admin";
//   const canApprove = isAdmin || canMutate(current?.role, "expense-approvals");
//   const canPay = isAdmin || canMutate(current?.role, "expense-payment");

//   const [activeTab, setActiveTab] = useState("Pending");
//   const [expenses, setExpenses] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0
//   });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal States
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isPayOpen, setIsPayOpen] = useState(false);

//   // Form States
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");
//   const [paymentData, setPaymentData] = useState({
//     paymentMethod: "",
//     paymentReference: "",
//     remarks: ""
//   });

//   // Fetch expenses based on the active tab (status) with search & pagination
//   const fetchExpensesByStatus = async (status, page = 1, limit = 10, search = "") => {
//     setLoading(true);
//     try {
//       const params = { 
//         status, 
//         page, 
//         limit 
//       };
      
//       // Add search if provided
//       if (search.trim()) {
//         params.search = search.trim();
//       }
      
//       const res = await hrApi.getAllExpenses(params);
//       const responseData = res.data?.data || {};
      
//       // ✅ API returns "tickets" array
//       const tickets = responseData.tickets || [];
//       setExpenses(Array.isArray(tickets) ? tickets : []);
      
//       // ✅ Set pagination data
//       if (responseData.pagination) {
//         setPagination({
//           page: responseData.pagination.page || 1,
//           limit: responseData.pagination.limit || 10,
//           total: responseData.pagination.total || 0,
//           pages: responseData.pagination.pages || 0,
//         });
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load expenses");
//       setExpenses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Re-fetch when tab changes
//   useEffect(() => {
//     fetchExpensesByStatus(activeTab, 1, 10, searchTerm);
//   }, [activeTab]);

//   // Handle search with debounce
//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       fetchExpensesByStatus(activeTab, 1, 10, searchTerm);
//     }, 500);
    
//     return () => clearTimeout(debounceTimer);
//   }, [searchTerm]);

//   // Handle pagination page change
//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > pagination.pages) return;
//     fetchExpensesByStatus(activeTab, newPage, pagination.limit, searchTerm);
//   };

//   // ================= ACTIONS =================
//   const handleApprove = async () => {
//     try {
//       await hrApi.approveExpense(selectedExpense._id, { remarks: approveRemarks });
//       toast.success("Expense Approved!");
//       setIsApproveOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, pagination.limit, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to approve");
//     }
//   };

//   const handleReject = async () => {
//     if (!rejectReason.trim()) return toast.error("Reason is required to reject!");
//     try {
//       await hrApi.rejectExpense(selectedExpense._id, { reason: rejectReason });
//       toast.success("Expense Rejected!");
//       setIsRejectOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, pagination.limit, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to reject");
//     }
//   };

//   const handlePay = async () => {
//     if (!paymentData.paymentMethod || !paymentData.paymentReference) {
//       return toast.error("Payment Method and Reference are required!");
//     }
//     try {
//       await hrApi.payExpense(selectedExpense._id, paymentData);
//       toast.success("Payment successful!");
//       setIsPayOpen(false);
//       fetchExpensesByStatus(activeTab, pagination.page, pagination.limit, searchTerm);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to process payment");
//     }
//   };

//   // Helper to open specific modals
//   const openModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//     if (type === 'pay') { setPaymentData({ paymentMethod: "", paymentReference: "", remarks: "" }); setIsPayOpen(true); }
//   };

//   // Get status badge variant
//   const getStatusBadge = (status) => {
//     const statusMap = {
//       'Pending': { variant: 'warning', label: 'Pending' },
//       'Approved': { variant: 'success', label: 'Approved' },
//       'Rejected': { variant: 'destructive', label: 'Rejected' },
//       'Paid': { variant: 'default', label: 'Paid' }
//     };
//     return statusMap[status] || { variant: 'secondary', label: status };
//   };

//   return (
//     <div className="p-6 space-y-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-display font-semibold tracking-tight flex items-center gap-2">
//             <CheckCircle className="h-6 w-6 text-primary" />
//             Expense Approvals & Disbursements
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Review staff expenses, approve legitimate claims, and process payments.
//           </p>
//         </div>
//         <div className="text-sm text-muted-foreground">
//           Total: {pagination.total} tickets
//         </div>
//       </div>

//       <Card>
//         <CardHeader className="border-b border-border pb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             {/* Tabs for Status */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
//               <TabsList>
//                 <TabsTrigger value="Pending">Pending (HR)</TabsTrigger>
//                 <TabsTrigger value="Approved">Approved (Finance)</TabsTrigger>
//                 <TabsTrigger value="Paid">Paid</TabsTrigger>
//                 <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//               </TabsList>
//             </Tabs>

//             {/* Search Bar */}
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by Title or Employee..."
//                 className="pl-9"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </CardHeader>
        
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Employee</TableHead>
//                 <TableHead>Title & Category</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Proof</TableHead>
//                 {/* Actions column only needed for Pending and Approved */}
//                 {(activeTab === "Pending" || activeTab === "Approved") && (
//                   <TableHead className="text-right">Actions</TableHead>
//                 )}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading tickets...</TableCell>
//                 </TableRow>
//               ) : expenses.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No {activeTab.toLowerCase()} tickets found.</TableCell>
//                 </TableRow>
//               ) : (
//                 expenses.map((expense) => {
//                   const statusInfo = getStatusBadge(expense.status);
//                   return (
//                     <TableRow key={expense._id}>
//                       <TableCell className="font-medium">
//                         {new Date(expense.createdAt).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense.employeeId?.name || "Unknown"}</div>
//                         <div className="text-xs text-muted-foreground">{expense.employeeId?.email}</div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense.title}</div>
//                         <Badge variant="outline" className="mt-1 text-[10px]">{expense.category}</Badge>
//                       </TableCell>
//                       <TableCell className="font-bold text-foreground">₹{expense.amount}</TableCell>
//                       <TableCell>
//                         <Badge variant={statusInfo.variant}>
//                           {statusInfo.label}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {expense.proofUrl ? (
//                           <a href={expense.proofUrl} target="_blank" rel="noreferrer">
//                             <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
//                               <FileText className="h-3 w-3" /> View
//                             </Button>
//                           </a>
//                         ) : <span className="text-xs text-muted-foreground">N/A</span>}
//                       </TableCell>
                      
//                       {/* Action Buttons Based on Tab & Role */}
//                       {(activeTab === "Pending" || activeTab === "Approved") && (
//                         <TableCell className="text-right">
//                           {activeTab === "Pending" && canApprove && (
//                             <div className="flex justify-end gap-2">
//                               <Button 
//                                 size="sm" 
//                                 variant="outline" 
//                                 className="border-success/50 text-success hover:bg-success/10" 
//                                 onClick={() => openModal(expense, 'approve')}
//                               >
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button 
//                                 size="sm" 
//                                 variant="outline" 
//                                 className="border-destructive/50 text-destructive hover:bg-destructive/10" 
//                                 onClick={() => openModal(expense, 'reject')}
//                               >
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </div>
//                           )}
                          
//                           {activeTab === "Approved" && canPay && (
//                             <Button size="sm" onClick={() => openModal(expense, 'pay')}>
//                               <CreditCard className="mr-1 h-3.5 w-3.5" /> Pay Now
//                             </Button>
//                           )}

//                           {/* If they are viewing a tab but don't have permissions */}
//                           {activeTab === "Pending" && !canApprove && (
//                             <span className="text-xs text-muted-foreground italic">HR Action Required</span>
//                           )}
//                           {activeTab === "Approved" && !canPay && (
//                             <span className="text-xs text-muted-foreground italic">Pending Payment</span>
//                           )}
//                         </TableCell>
//                       )}
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
          
//           {/* ✅ Pagination Controls */}
//           {pagination.pages > 1 && (
//             <div className="flex items-center justify-between px-4 py-3 border-t border-border">
//               <div className="text-sm text-muted-foreground">
//                 Showing {((pagination.page - 1) * pagination.limit) + 1} -{' '}
//                 {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tickets
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(pagination.page - 1)}
//                   disabled={pagination.page <= 1}
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-1" />
//                   Previous
//                 </Button>
//                 <span className="flex items-center px-3 text-sm text-muted-foreground">
//                   Page {pagination.page} of {pagination.pages}
//                 </span>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(pagination.page + 1)}
//                   disabled={pagination.page >= pagination.pages}
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4 ml-1" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ================= MODALS ================= */}
      
//       {/* 1. APPROVE MODAL */}
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Approve Expense</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to approve this expense of <b>₹{selectedExpense?.amount}</b> for <b>{selectedExpense?.employeeId?.name}</b>?
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-2 py-4">
//             <Label>Remarks (Optional)</Label>
//             <Input 
//               placeholder="Looks good..." 
//               value={approveRemarks} 
//               onChange={(e) => setApproveRemarks(e.target.value)} 
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove}>Confirm Approval</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* 2. REJECT MODAL */}
//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-destructive">Reject Expense</DialogTitle>
//             <DialogDescription>Please provide a valid reason for rejecting this claim.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-2 py-4">
//             <Label>Rejection Reason <span className="text-destructive">*</span></Label>
//             <Textarea 
//               placeholder="Receipt is blur, amount mismatch..." 
//               value={rejectReason} 
//               onChange={(e) => setRejectReason(e.target.value)} 
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* 3. PAY (FINANCE) MODAL */}
//       <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Process Payment</DialogTitle>
//             <DialogDescription>Record the disbursement details for <b>₹{selectedExpense?.amount}</b>.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label>Payment Method <span className="text-destructive">*</span></Label>
//               <Select onValueChange={(val) => setPaymentData({...paymentData, paymentMethod: val})}>
//                 <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="UPI">UPI</SelectItem>
//                   <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
//                   <SelectItem value="Cheque">Cheque</SelectItem>
//                   <SelectItem value="Cash">Cash</SelectItem>
//                   <SelectItem value="NEFT">NEFT</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <Label>Reference ID / Transaction No. <span className="text-destructive">*</span></Label>
//               <Input 
//                 placeholder="e.g. UPI/20260711XXXX" 
//                 value={paymentData.paymentReference} 
//                 onChange={(e) => setPaymentData({...paymentData, paymentReference: e.target.value})} 
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label>Remarks</Label>
//               <Input 
//                 placeholder="Optional remarks..." 
//                 value={paymentData.remarks} 
//                 onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})} 
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsPayOpen(false)}>Cancel</Button>
//             <Button onClick={handlePay}>Mark as Paid</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, CreditCard, Search, FileText, ChevronLeft, ChevronRight, Eye, Calendar, User, Tag, DollarSign, File, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { hrApi } from "@/api/hrApi"; 
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { toast } from "sonner";

export default function ExpenseApprovals() {
  const { current } = useAuthStore();
  
  // Explicit Admin check added along with permissions
  const isAdmin = current?.role === "admin";
  const canApprove = isAdmin || canMutate(current?.role, "expense-approvals");
  const canPay = isAdmin || canMutate(current?.role, "expense-payment");

  const [activeTab, setActiveTab] = useState("Pending");
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false); // New View Modal State

  // Form States
  const [approveRemarks, setApproveRemarks] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    paymentReference: "",
    remarks: ""
  });

  // Fetch expenses based on the active tab (status) with search & pagination
  const fetchExpensesByStatus = async (status, page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const params = { 
        status, 
        page, 
        limit 
      };
      
      // Add search if provided
      if (search.trim()) {
        params.search = search.trim();
      }
      
      const res = await hrApi.getAllExpenses(params);
      const responseData = res.data?.data || {};
      
      // ✅ API returns "tickets" array
      const tickets = responseData.tickets || [];
      setExpenses(Array.isArray(tickets) ? tickets : []);
      
      // ✅ Set pagination data
      if (responseData.pagination) {
        setPagination({
          page: responseData.pagination.page || 1,
          limit: responseData.pagination.limit || 10,
          total: responseData.pagination.total || 0,
          pages: responseData.pagination.pages || 0,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load expenses");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when tab changes
  useEffect(() => {
    fetchExpensesByStatus(activeTab, 1, 10, searchTerm);
  }, [activeTab]);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchExpensesByStatus(activeTab, 1, 10, searchTerm);
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle pagination page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchExpensesByStatus(activeTab, newPage, pagination.limit, searchTerm);
  };

  // ================= ACTIONS =================
  const handleApprove = async () => {
    try {
      await hrApi.approveExpense(selectedExpense._id, { remarks: approveRemarks });
      toast.success("Expense Approved!");
      setIsApproveOpen(false);
      fetchExpensesByStatus(activeTab, pagination.page, pagination.limit, searchTerm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error("Reason is required to reject!");
    try {
      await hrApi.rejectExpense(selectedExpense._id, { reason: rejectReason });
      toast.success("Expense Rejected!");
      setIsRejectOpen(false);
      fetchExpensesByStatus(activeTab, pagination.page, pagination.limit, searchTerm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  const handlePay = async () => {
    if (!paymentData.paymentMethod || !paymentData.paymentReference) {
      return toast.error("Payment Method and Reference are required!");
    }
    try {
      await hrApi.payExpense(selectedExpense._id, paymentData);
      toast.success("Payment successful!");
      setIsPayOpen(false);
      fetchExpensesByStatus(activeTab, pagination.page, pagination.limit, searchTerm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process payment");
    }
  };

  // Helper to open specific modals
  const openModal = (expense, type) => {
    setSelectedExpense(expense);
    if (type === 'view') { setIsViewOpen(true); }
    if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
    if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
    if (type === 'pay') { setPaymentData({ paymentMethod: "", paymentReference: "", remarks: "" }); setIsPayOpen(true); }
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': { variant: 'warning', label: 'Pending' },
      'Approved': { variant: 'success', label: 'Approved' },
      'Rejected': { variant: 'destructive', label: 'Rejected' },
      'Paid': { variant: 'default', label: 'Paid' }
    };
    return statusMap[status] || { variant: 'secondary', label: status };
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            Expense Approvals & Disbursements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review staff expenses, approve legitimate claims, and process payments.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {pagination.total} tickets
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs for Status */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="Pending">Pending (HR)</TabsTrigger>
                <TabsTrigger value="Approved">Approved (Finance)</TabsTrigger>
                <TabsTrigger value="Paid">Paid</TabsTrigger>
                <TabsTrigger value="Rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Title or Employee..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Title & Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading tickets...</TableCell>
                </TableRow>
              ) : expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No {activeTab.toLowerCase()} tickets found.</TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => {
                  const statusInfo = getStatusBadge(expense.status);
                  return (
                    <TableRow key={expense._id}>
                      <TableCell className="font-medium">
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{expense.employeeId?.name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{expense.employeeId?.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{expense.title}</div>
                        <Badge variant="outline" className="mt-1 text-[10px]">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-foreground">₹{expense.amount}</TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {expense.proofUrl ? (
                          <a href={expense.proofUrl} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                              <FileText className="h-3 w-3" /> View
                            </Button>
                          </a>
                        ) : <span className="text-xs text-muted-foreground">N/A</span>}
                      </TableCell>
                      
                      {/* Action Buttons - View always visible, others based on tab & role */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* View Button - Always visible */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => openModal(expense, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Conditional Action Buttons Based on Tab & Role */}
                          {activeTab === "Pending" && canApprove && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-success/50 text-success hover:bg-success/10" 
                                onClick={() => openModal(expense, 'approve')}
                              >
                                <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-destructive/50 text-destructive hover:bg-destructive/10" 
                                onClick={() => openModal(expense, 'reject')}
                              >
                                <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                              </Button>
                            </>
                          )}
                          
                          {activeTab === "Approved" && canPay && (
                            <Button size="sm" onClick={() => openModal(expense, 'pay')}>
                              <CreditCard className="mr-1 h-3.5 w-3.5" /> Pay Now
                            </Button>
                          )}

                          {/* If they are viewing a tab but don't have permissions */}
                          {activeTab === "Pending" && !canApprove && (
                            <span className="text-xs text-muted-foreground italic">HR Action Required</span>
                          )}
                          {activeTab === "Approved" && !canPay && (
                            <span className="text-xs text-muted-foreground italic">Pending Payment</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          
          {/* ✅ Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tickets
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="flex items-center px-3 text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= VIEW MODAL ================= */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Expense Details
            </DialogTitle>
            <DialogDescription>
              Complete information about the expense ticket
            </DialogDescription>
          </DialogHeader>
          
          {selectedExpense && (
            <div className="space-y-6 py-4">
              {/* Header with Ticket Number and Status */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium">
                      {selectedExpense.ticketNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Badge variant={getStatusBadge(selectedExpense.status).variant} className="text-sm">
                      {selectedExpense.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ₹{selectedExpense.amount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(selectedExpense.createdAt)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Employee
                  </Label>
                  <div className="font-medium">{selectedExpense.employeeId?.name || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.phone || 'N/A'}</div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Category
                  </Label>
                  <div className="font-medium">{selectedExpense.category || 'N/A'}</div>
                </div>
              </div>

              <Separator />

              {/* Title and Description */}
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Title
                </Label>
                <div className="font-medium text-lg">{selectedExpense.title || 'N/A'}</div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground">Description</Label>
                <div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap">
                  {selectedExpense.description || 'No description provided'}
                </div>
              </div>

              <Separator />

              {/* Proof Document */}
              {selectedExpense.proofUrl && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <File className="h-4 w-4" /> Proof Document
                  </Label>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {selectedExpense.proofMimeType || 'File'}
                    </Badge>
                    <a 
                      href={selectedExpense.proofUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      View Document ↗
                    </a>
                  </div>
                  {selectedExpense.proofMimeType?.startsWith('image/') && (
                    <div className="mt-2 border rounded-md p-2 max-w-xs">
                      <img 
                        src={selectedExpense.proofUrl} 
                        alt="Proof" 
                        className="w-full h-auto max-h-48 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Approval Information */}
              <div className="space-y-3">
                <Label className="text-muted-foreground">Approval Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Approved By</div>
                    <div className="font-medium">
                      {selectedExpense.approvedBy?.name || 'Pending'}
                    </div>
                    {selectedExpense.approvedBy?.email && (
                      <div className="text-sm text-muted-foreground">
                        {selectedExpense.approvedBy.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Approved At</div>
                    <div className="font-medium">
                      {formatDate(selectedExpense.approvedAt) || 'Not approved yet'}
                    </div>
                  </div>
                </div>
                {selectedExpense.approverRemarks && (
                  <div>
                    <div className="text-sm text-muted-foreground">Approver Remarks</div>
                    <div className="text-sm p-2 bg-green-50 dark:bg-green-950/20 rounded-md">
                      {selectedExpense.approverRemarks}
                    </div>
                  </div>
                )}
                {selectedExpense.rejectionReason && (
                  <div>
                    <div className="text-sm text-muted-foreground text-destructive">Rejection Reason</div>
                    <div className="text-sm p-2 bg-red-50 dark:bg-red-950/20 rounded-md text-destructive">
                      {selectedExpense.rejectionReason}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Information - Only show if status is Paid */}
              {selectedExpense.status === 'Paid' && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Label className="text-muted-foreground">Payment Details</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Payment Method</div>
                        <div className="font-medium">{selectedExpense.paymentMethod || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Reference</div>
                        <div className="font-medium font-mono text-sm">{selectedExpense.paymentReference || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Paid By</div>
                        <div className="font-medium">{selectedExpense.paidBy?.name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Paid At</div>
                        <div className="font-medium">{formatDate(selectedExpense.paidAt) || 'N/A'}</div>
                      </div>
                    </div>
                    {selectedExpense.paymentRemarks && (
                      <div>
                        <div className="text-sm text-muted-foreground">Payment Remarks</div>
                        <div className="text-sm p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                          {selectedExpense.paymentRemarks}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* System Information */}
              <Separator />
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">System Information</Label>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">ID:</span> {selectedExpense._id}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {formatDate(selectedExpense.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= APPROVE MODAL ================= */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this expense of <b>₹{selectedExpense?.amount}</b> for <b>{selectedExpense?.employeeId?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label>Remarks (Optional)</Label>
            <Input 
              placeholder="Looks good..." 
              value={approveRemarks} 
              onChange={(e) => setApproveRemarks(e.target.value)} 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove}>Confirm Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= REJECT MODAL ================= */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Reject Expense</DialogTitle>
            <DialogDescription>Please provide a valid reason for rejecting this claim.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label>Rejection Reason <span className="text-destructive">*</span></Label>
            <Textarea 
              placeholder="Receipt is blur, amount mismatch..." 
              value={rejectReason} 
              onChange={(e) => setRejectReason(e.target.value)} 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= PAY MODAL ================= */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Record the disbursement details for <b>₹{selectedExpense?.amount}</b>.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Payment Method <span className="text-destructive">*</span></Label>
              <Select onValueChange={(val) => setPaymentData({...paymentData, paymentMethod: val})}>
                <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="NEFT">NEFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Reference ID / Transaction No. <span className="text-destructive">*</span></Label>
              <Input 
                placeholder="e.g. UPI/20260711XXXX" 
                value={paymentData.paymentReference} 
                onChange={(e) => setPaymentData({...paymentData, paymentReference: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Remarks</Label>
              <Input 
                placeholder="Optional remarks..." 
                value={paymentData.remarks} 
                onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayOpen(false)}>Cancel</Button>
            <Button onClick={handlePay}>Mark as Paid</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}