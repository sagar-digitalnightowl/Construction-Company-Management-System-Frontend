
// import React, { useEffect, useState } from "react";
// import { CheckCircle, XCircle, Search, FileText, ChevronLeft, ChevronRight, Eye, Hash, User, Tag, File, Calendar, DollarSign } from "lucide-react";
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
//       case "Paid": return "outline"; // Or you can use a custom class for green
//       case "Rejected": return "destructive";
//       default: return "secondary"; // Pending
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         {/* Added overflow-auto to prevent wrapping issues on small screens with 4 tabs */}
//         <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList>
//               <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//               <TabsTrigger value="Approved">Approved</TabsTrigger>
//               {/* ✅ NEW: Paid tab added for HR */}
//               <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//               <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//             </TabsList>
//           </Tabs>
//         </div>
//         <div className="relative w-full sm:w-64 shrink-0">
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
//                     <Badge 
//                       variant={getStatusBadgeVariant(selectedExpense.status)}
//                       className={selectedExpense.status === "Paid" ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" : ""}
//                     >
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

//               {/* Approval Info Section (Visible if Approved OR Paid) */}
//               {(selectedExpense.status === "Approved" || selectedExpense.status === "Paid") && (
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

//               {/* ✅ NEW: Payment Info Section (Only visible if status is Paid) */}
//               {selectedExpense.status === "Paid" && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
//                       <DollarSign className="h-4 w-4" /> Payment Details (Finance)
//                     </Label>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <span className="text-xs text-muted-foreground">Payment Method</span>
//                         <div className="font-medium text-sm">{selectedExpense.paymentMethod || "N/A"}</div>
//                       </div>
//                       <div>
//                         <span className="text-xs text-muted-foreground">Reference / Txn No</span>
//                         <div className="font-medium text-sm font-mono">{selectedExpense.paymentReference || "N/A"}</div>
//                       </div>
//                       <div>
//                         <span className="text-xs text-muted-foreground">Paid By</span>
//                         <div className="font-medium text-sm">{selectedExpense.paidBy?.name || "N/A"}</div>
//                       </div>
//                       <div>
//                         <span className="text-xs text-muted-foreground">Paid At</span>
//                         <div className="font-medium text-sm">{formatDate(selectedExpense.paidAt)}</div>
//                       </div>
//                       {selectedExpense.paymentRemarks && (
//                         <div className="md:col-span-2">
//                           <span className="text-xs text-muted-foreground">Payment Remarks</span>
//                           <div className="text-sm p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md mt-1">
//                             {selectedExpense.paymentRemarks}
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
















// import React, { useEffect, useState } from "react";
// import { 
//   CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
//   Wallet, Settings, Plus, CreditCard, ArrowDownCircle, ArrowUpCircle
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import { useHR } from "@/hooks/useHR"; 

// export function HRExpenseTab() {
//   const {
//     loading,
//     allExpenses,
//     fetchAllExpenses,
//     approveExpense,
//     rejectExpense,
//     employees,
//     fetchEmployees,
//     employeeWallet,
//     employeeWalletTransactions,
//     fetchEmployeeWallet,
//     fetchEmployeeWalletTransactions,
//     addWalletMoney,
//     refundWallet,
//     expenseCategories,
//     fetchExpenseCategories,
//     createExpenseCategory,
//     updateExpenseCategory,
//     deleteExpenseCategory
//   } = useHR();

//   // ==================== TICKET STATE ====================
//   const [ticketTab, setTicketTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   // ==================== WALLET STATE ====================
//   const [selectedEmpId, setSelectedEmpId] = useState("");
//   const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
//   const [isRefundOpen, setIsRefundOpen] = useState(false);
//   const [walletForm, setWalletForm] = useState({ amount: "", remarks: "" });

//   // ==================== CATEGORY STATE ====================
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [categoryForm, setCategoryForm] = useState({
//     name: "", code: "", description: "", color: "#3b82f6", icon: "fa-tag", sortOrder: 0
//   });

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     fetchEmployees({ limit: 100 }); 
//     fetchExpenseCategories();
//   }, [fetchEmployees, fetchExpenseCategories]);

//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchAllExpenses({ status: ticketTab, search: searchTerm, page: 1, limit: 10 });
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [ticketTab, searchTerm, fetchAllExpenses]);

//   useEffect(() => {
//     if (selectedEmpId) {
//       fetchEmployeeWallet(selectedEmpId);
//       fetchEmployeeWalletTransactions(selectedEmpId, { page: 1, limit: 10 });
//     }
//   }, [selectedEmpId, fetchEmployeeWallet, fetchEmployeeWalletTransactions]);

//   // ==================== TICKET HANDLERS ====================
//   const handleApprove = async () => {
//     if (!selectedExpense?._id) return; // ✅ Null Check added
//     const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
//     if (success) setIsApproveOpen(false);
//   };

//   const handleReject = async () => {
//     if (!selectedExpense?._id) return; // ✅ Null Check added
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
//     if (success) setIsRejectOpen(false);
//   };

//   const openTicketModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // ==================== WALLET HANDLERS ====================
//   const handleWalletSubmit = async (type) => {
//     if (!walletForm.amount || isNaN(walletForm.amount) || Number(walletForm.amount) <= 0) {
//       return toast.error("Enter a valid amount");
//     }
//     const payload = {
//       employeeId: selectedEmpId,
//       amount: Number(walletForm.amount),
//       remarks: walletForm.remarks
//     };

//     let success = false;
//     if (type === 'add') success = await addWalletMoney(payload);
//     if (type === 'refund') success = await refundWallet(payload);

//     if (success) {
//       setIsAddMoneyOpen(false);
//       setIsRefundOpen(false);
//       setWalletForm({ amount: "", remarks: "" });
//     }
//   };

//   // ==================== CATEGORY HANDLERS ====================
//   const openCategoryModal = (category = null) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ ...category });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "fa-tag", sortOrder: 0 });
//     }
//     setIsCategoryOpen(true);
//   };

//   const handleCategorySubmit = async () => {
//     if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
//     let success = false;
//     if (editingCategory?._id) { // ✅ Null Check added
//       success = await updateExpenseCategory(editingCategory._id, categoryForm);
//     } else {
//       success = await createExpenseCategory(categoryForm);
//     }

//     if (success) setIsCategoryOpen(false);
//   };

//   const handleDeleteCategory = async (id) => {
//     if (!id) return;
//     if (window.confirm("Are you sure you want to deactivate this category?")) {
//       await deleteExpenseCategory(id);
//     }
//   };

//   // ==================== HELPERS ====================
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Paid": return "outline"; 
//       case "Rejected": return "destructive";
//       default: return "secondary"; 
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="tickets" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
//           <TabsTrigger value="wallets" className="flex gap-2"><Wallet className="h-4 w-4"/> Employee Wallets</TabsTrigger>
//           <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
//         </TabsList>

//         {/* ==================== 1. TICKETS SECTION ==================== */}
//         <TabsContent value="tickets" className="space-y-4 m-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//               <Tabs value={ticketTab} onValueChange={setTicketTab}>
//                 <TabsList>
//                   <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//                   <TabsTrigger value="Approved">Approved</TabsTrigger>
//                   <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//                   <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//             <div className="relative w-full sm:w-64 shrink-0">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : allExpenses?.length === 0 ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
//                 ) : (
//                   allExpenses?.map((expense) => (
//                     <TableRow key={expense?._id}>
//                       <TableCell>{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.employeeId?.name}</div>
//                         <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.title}</div>
//                         <Badge variant="outline" className="mt-1 font-normal text-[10px]">{expense?.categoryId?.name || "N/A"}</Badge>
//                       </TableCell>
//                       <TableCell className="font-bold">₹{expense?.amount}</TableCell>
//                       <TableCell>
//                         <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
//                           {ticketTab === "Pending" && (
//                             <>
//                               <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* ==================== 2. WALLET SECTION ==================== */}
//         <TabsContent value="wallets" className="space-y-4 m-0">
//           <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
//             <div className="w-full max-w-sm">
//               <Label className="mb-2 block">Select Employee</Label>
//               <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Search & Select Employee..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {employees?.employees?.map((emp) => (
//                     <SelectItem key={emp?._id} value={emp?._id}>{emp?.name} ({emp?.employeeId})</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             {selectedEmpId && (
//               <div className="flex gap-2 ml-auto mt-6">
//                 <Button onClick={() => { setWalletForm({amount: "", remarks: ""}); setIsAddMoneyOpen(true); }} className="gap-2 bg-blue-600 hover:bg-blue-700">
//                   <ArrowDownCircle className="h-4 w-4"/> Add Advance
//                 </Button>
//                 <Button onClick={() => { setWalletForm({amount: "", remarks: ""}); setIsRefundOpen(true); }} variant="outline" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950">
//                   <ArrowUpCircle className="h-4 w-4"/> Refund Wallet
//                 </Button>
//               </div>
//             )}
//           </div>

//           {selectedEmpId && employeeWallet ? (
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="p-4 border rounded-xl bg-card shadow-sm">
//                   <div className="text-sm text-muted-foreground font-medium mb-1">Current Balance</div>
//                   <div className="text-3xl font-bold text-primary">₹{employeeWallet?.balance || 0}</div>
//                 </div>
//                 <div className="p-4 border rounded-xl bg-card shadow-sm">
//                   <div className="text-sm text-muted-foreground font-medium mb-1">Total Advance</div>
//                   <div className="text-xl font-semibold text-blue-600">₹{employeeWallet?.totalAdvance || 0}</div>
//                 </div>
//                 <div className="p-4 border rounded-xl bg-card shadow-sm">
//                   <div className="text-sm text-muted-foreground font-medium mb-1">Total Expense Utilized</div>
//                   <div className="text-xl font-semibold text-rose-600">₹{employeeWallet?.totalExpense || 0}</div>
//                 </div>
//                 <div className="p-4 border rounded-xl bg-card shadow-sm">
//                   <div className="text-sm text-muted-foreground font-medium mb-1">Total Refunded</div>
//                   <div className="text-xl font-semibold text-emerald-600">₹{employeeWallet?.totalRefund || 0}</div>
//                 </div>
//               </div>

//               <div className="border rounded-md">
//                 <div className="p-3 bg-muted border-b font-semibold flex items-center gap-2">
//                   <CreditCard className="h-4 w-4"/> Wallet Passbook
//                 </div>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Reference</TableHead>
//                       <TableHead>Remarks</TableHead>
//                       <TableHead className="text-right">Amount</TableHead>
//                       <TableHead className="text-right">Balance After</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {employeeWalletTransactions?.length === 0 ? (
//                       <TableRow><TableCell colSpan={6} className="text-center py-6">No transactions found.</TableCell></TableRow>
//                     ) : (
//                       employeeWalletTransactions?.map((txn) => (
//                         <TableRow key={txn?._id}>
//                           <TableCell>{formatDate(txn?.createdAt)}</TableCell>
//                           <TableCell>
//                             <Badge variant={txn?.type === 'CREDIT' ? 'success' : 'destructive'} className="text-[10px]">
//                               {txn?.type}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="font-medium">{txn?.referenceType}</TableCell>
//                           <TableCell className="text-muted-foreground text-sm">{txn?.remarks}</TableCell>
//                           <TableCell className={`text-right font-bold ${txn?.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
//                             {txn?.type === 'CREDIT' ? '+' : '-'}₹{txn?.amount}
//                           </TableCell>
//                           <TableCell className="text-right font-mono">₹{txn?.balanceAfter}</TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           ) : (
//             selectedEmpId && !loading && <div className="text-center py-10 text-muted-foreground border rounded-lg">No wallet data found for this employee.</div>
//           )}
//         </TabsContent>

//         {/* ==================== 3. CATEGORIES SECTION ==================== */}
//         <TabsContent value="categories" className="space-y-4 m-0">
//           <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
//             <div>
//               <h3 className="text-lg font-semibold">Expense Categories</h3>
//               <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
//             </div>
//             <Button onClick={() => openCategoryModal()} className="gap-2">
//               <Plus className="h-4 w-4"/> Add Category
//             </Button>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Color/Icon</TableHead>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseCategories?.map((cat) => (
//                   <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
//                     <TableCell>
//                       <div className="h-6 w-6 rounded-full flex items-center justify-center border shadow-sm" style={{ backgroundColor: cat?.color }}>
//                         <i className={`text-white text-[10px] fa-solid ${cat?.icon}`}></i>
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">{cat?.name}</TableCell>
//                     <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
//                     <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
//                       {cat?.isActive && (
//                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(cat?._id)}>Disable</Button>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* ==================== MODALS ==================== */}
      
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//              <div className="py-4 space-y-4">
//                <p className="text-sm text-muted-foreground">
//                  Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
//                </p>
//                <div>
//                  <Label>Remarks (Optional)</Label>
//                  <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//                </div>
//              </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="py-4">
//               <Label>Reason <span className="text-destructive">*</span></Label>
//               <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="space-y-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
//                   <div className="mt-2"><Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge></div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
//                 </div>
//               </div>
//               <Separator />
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
//                   <div className="font-medium text-base">
//                     <Badge variant="outline" style={{ borderColor: selectedExpense.categoryId?.color, color: selectedExpense.categoryId?.color }}>
//                       {selectedExpense.categoryId?.name || "N/A"}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//               <Separator />
//               <div className="space-y-4">
//                 <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
//                 <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
//               </div>
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
//                       <FileText className="h-4 w-4" /> View Document
//                     </a>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//           <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Add Money to Wallet (Advance)</DialogTitle></DialogHeader>
//           <div className="space-y-4 py-4">
//             <div>
//               <Label>Amount (₹) <span className="text-destructive">*</span></Label>
//               <Input type="number" placeholder="10000" value={walletForm.amount} onChange={(e) => setWalletForm({...walletForm, amount: e.target.value})} />
//             </div>
//             <div>
//               <Label>Remarks</Label>
//               <Input placeholder="Site visit advance..." value={walletForm.remarks} onChange={(e) => setWalletForm({...walletForm, remarks: e.target.value})} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsAddMoneyOpen(false)}>Cancel</Button>
//             <Button onClick={() => handleWalletSubmit('add')} className="bg-blue-600 hover:bg-blue-700 text-white">Add Amount</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Refund Money to Wallet</DialogTitle></DialogHeader>
//           <div className="space-y-4 py-4">
//             <div>
//               <Label>Amount (₹) <span className="text-destructive">*</span></Label>
//               <Input type="number" placeholder="500" value={walletForm.amount} onChange={(e) => setWalletForm({...walletForm, amount: e.target.value})} />
//             </div>
//             <div>
//               <Label>Reason</Label>
//               <Input placeholder="Returned unspent advance..." value={walletForm.remarks} onChange={(e) => setWalletForm({...walletForm, remarks: e.target.value})} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRefundOpen(false)}>Cancel</Button>
//             <Button onClick={() => handleWalletSubmit('refund')} className="bg-rose-600 hover:bg-rose-700 text-white">Process Refund</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-4">
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Name <span className="text-destructive">*</span></Label>
//               <Input value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Code <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. FUEL" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
//             </div>
//             <div className="col-span-2">
//               <Label>Description</Label>
//               <Input value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Color (Hex)</Label>
//               <div className="flex gap-2">
//                 <input type="color" className="h-9 w-12 cursor-pointer border rounded-md" value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
//                 <Input value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
//               </div>
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Icon Class</Label>
//               <Input placeholder="fa-gas-pump" value={categoryForm.icon} onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
//             <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }














// import React, { useEffect, useState } from "react";
// import { 
//   CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
//   Wallet, Settings, Plus, CreditCard, ArrowDownCircle, ArrowUpCircle
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import { useHR } from "@/hooks/useHR"; 

// // ==================== PREDEFINED UX DATA ====================
// const PREDEFINED_COLORS = [
//   "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", 
//   "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
//   "#f43f5e", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669", 
//   "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", 
//   "#db2777", "#e11d48", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"
// ];

// const PREDEFINED_ICONS = [
//   // Travel & Transport
//   "fa-car", "fa-car-side", "fa-taxi", "fa-bus", "fa-train", "fa-subway", "fa-plane", "fa-plane-departure", 
//   "fa-motorcycle", "fa-bicycle", "fa-gas-pump", "fa-route", "fa-map-location-dot", "fa-ticket",
//   // Food & Dining
//   "fa-utensils", "fa-burger", "fa-pizza-slice", "fa-mug-hot", "fa-cup-togo", "fa-bowl-food", "fa-martini-glass",
//   // Hotel & Accommodation
//   "fa-hotel", "fa-bed", "fa-building", "fa-house", "fa-tents",
//   // Office, Tech & Tools
//   "fa-laptop", "fa-computer", "fa-mobile-screen", "fa-print", "fa-paperclip", "fa-wifi", "fa-plug",
//   "fa-bolt", "fa-screwdriver-wrench", "fa-toolbox", "fa-hammer", "fa-lightbulb", "fa-headset",
//   // Finance & Shopping
//   "fa-money-bill-wave", "fa-coins", "fa-credit-card", "fa-receipt", "fa-file-invoice-dollar", "fa-cart-shopping", 
//   "fa-bag-shopping", "fa-store", "fa-basket-shopping",
//   // Medical & Health
//   "fa-stethoscope", "fa-kit-medical", "fa-pills", "fa-hospital", "fa-heart-pulse",
//   // General & Utility
//   "fa-tag", "fa-tags", "fa-box", "fa-boxes-stacked", "fa-gift", "fa-calendar-days", "fa-clock", 
//   "fa-briefcase", "fa-folder-open", "fa-envelope", "fa-star", "fa-shield-halved", "fa-key", 
//   "fa-magnifying-glass", "fa-bell", "fa-camera", "fa-video", "fa-microphone", "fa-users", "fa-user-tie",
//   "fa-graduation-cap", "fa-book", "fa-award", "fa-trophy", "fa-crown", "fa-leaf", "fa-fire", "fa-droplet"
// ];

// export function HRExpenseTab() {
//   const {
//     loading,
//     allExpenses,
//     fetchAllExpenses,
//     approveExpense,
//     rejectExpense,
//     employees,
//     fetchEmployees,
//     employeeWallet,
//     employeeWalletTransactions,
//     fetchEmployeeWallet,
//     fetchEmployeeWalletTransactions,
//     addWalletMoney,
//     refundWallet,
//     expenseCategories,
//     fetchExpenseCategories,
//     createExpenseCategory,
//     updateExpenseCategory,
//     deleteExpenseCategory
//   } = useHR();

//   // ==================== TICKET STATE ====================
//   const [ticketTab, setTicketTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   // ==================== WALLET STATE ====================
//   const [selectedEmpId, setSelectedEmpId] = useState("");
//   const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
//   const [isRefundOpen, setIsRefundOpen] = useState(false);
//   const [walletForm, setWalletForm] = useState({ amount: "", remarks: "" });

//   // ==================== CATEGORY STATE ====================
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [categoryForm, setCategoryForm] = useState({
//     name: "", code: "", description: "", color: "#3b82f6", icon: "fa-tag", sortOrder: 0
//   });

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     fetchEmployees({ limit: 100 }); 
//     fetchExpenseCategories();
//   }, [fetchEmployees, fetchExpenseCategories]);

//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchAllExpenses({ status: ticketTab, search: searchTerm, page: 1, limit: 10 });
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [ticketTab, searchTerm, fetchAllExpenses]);

//   useEffect(() => {
//     if (selectedEmpId) {
//       fetchEmployeeWallet(selectedEmpId);
//       fetchEmployeeWalletTransactions(selectedEmpId, { page: 1, limit: 10 });
//     }
//   }, [selectedEmpId, fetchEmployeeWallet, fetchEmployeeWalletTransactions]);

//   // ==================== TICKET HANDLERS ====================
//   const handleApprove = async () => {
//     if (!selectedExpense?._id) return; 
//     const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
//     if (success) setIsApproveOpen(false);
//   };

//   const handleReject = async () => {
//     if (!selectedExpense?._id) return; 
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
//     if (success) setIsRejectOpen(false);
//   };

//   const openTicketModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // ==================== WALLET HANDLERS ====================
//   const handleWalletSubmit = async (type) => {
//     if (!walletForm.amount || isNaN(walletForm.amount) || Number(walletForm.amount) <= 0) {
//       return toast.error("Enter a valid amount");
//     }
//     const payload = {
//       employeeId: selectedEmpId,
//       amount: Number(walletForm.amount),
//       remarks: walletForm.remarks
//     };

//     let success = false;
//     if (type === 'add') success = await addWalletMoney(payload);
//     if (type === 'refund') success = await refundWallet(payload);

//     if (success) {
//       setIsAddMoneyOpen(false);
//       setIsRefundOpen(false);
//       setWalletForm({ amount: "", remarks: "" });
//     }
//   };

//   // ==================== CATEGORY HANDLERS ====================
//   const openCategoryModal = (category = null) => {
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ ...category });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "fa-tag", sortOrder: 0 });
//     }
//     setIsCategoryOpen(true);
//   };

//   const handleCategorySubmit = async () => {
//     if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
//     let success = false;
//     if (editingCategory?._id) { 
//       success = await updateExpenseCategory(editingCategory._id, categoryForm);
//     } else {
//       success = await createExpenseCategory(categoryForm);
//     }

//     if (success) setIsCategoryOpen(false);
//   };

//   const handleDeleteCategory = async (id) => {
//     if (!id) return;
//     if (window.confirm("Are you sure you want to deactivate this category?")) {
//       await deleteExpenseCategory(id);
//     }
//   };

//   // ==================== HELPERS ====================
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Paid": return "outline"; 
//       case "Rejected": return "destructive";
//       default: return "secondary"; 
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="tickets" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
//           <TabsTrigger value="wallets" className="flex gap-2"><Wallet className="h-4 w-4"/> Employee Wallets</TabsTrigger>
//           <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
//         </TabsList>

//         {/* ==================== 1. TICKETS SECTION ==================== */}
//         <TabsContent value="tickets" className="space-y-4 m-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//               <Tabs value={ticketTab} onValueChange={setTicketTab}>
//                 <TabsList>
//                   <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//                   <TabsTrigger value="Approved">Approved</TabsTrigger>
//                   <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//                   <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//             <div className="relative w-full sm:w-64 shrink-0">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : allExpenses?.length === 0 ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
//                 ) : (
//                   allExpenses?.map((expense) => (
//                     <TableRow key={expense?._id}>
//                       <TableCell>{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.employeeId?.name}</div>
//                         <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.title}</div>
//                         <Badge variant="outline" className="mt-1 font-normal text-[10px]">{expense?.categoryId?.name || "N/A"}</Badge>
//                       </TableCell>
//                       <TableCell className="font-bold">₹{expense?.amount}</TableCell>
//                       <TableCell>
//                         <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
//                           {ticketTab === "Pending" && (
//                             <>
//                               <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* ==================== 2. WALLET SECTION ==================== */}
//         <TabsContent value="wallets" className="space-y-4 m-0">
//           <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
//             <div className="w-full max-w-sm">
//               <Label className="mb-2 block">Select Employee</Label>
//               <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Search & Select Employee..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {employees?.employees?.map((emp) => (
//                     <SelectItem key={emp?._id} value={emp?._id}>{emp?.name} ({emp?.employeeId})</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             {selectedEmpId && (
//               <div className="flex gap-2 ml-auto mt-6">
//                 <Button onClick={() => { setWalletForm({amount: "", remarks: ""}); setIsAddMoneyOpen(true); }} className="gap-2 bg-blue-600 hover:bg-blue-700">
//                   <ArrowDownCircle className="h-4 w-4"/> Add Advance
//                 </Button>
//                 <Button onClick={() => { setWalletForm({amount: "", remarks: ""}); setIsRefundOpen(true); }} variant="outline" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950">
//                   <ArrowUpCircle className="h-4 w-4"/> Refund Wallet
//                 </Button>
//               </div>
//             )}
//           </div>

//           {selectedEmpId && employeeWallet ? (
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="p-4 border rounded-xl bg-card shadow-sm">
//                   <div className="text-sm text-muted-foreground font-medium mb-1">Current Balance</div>
//                   <div className="text-3xl font-bold text-primary">₹{employeeWallet?.balance || 0}</div>
//                 </div>
//                 <div className="p-4 border rounded-xl bg-card shadow-sm">
//                   <div className="text-sm text-muted-foreground font-medium mb-1">Total Advance</div>
//                   <div className="text-xl font-semibold text-blue-600">₹{employeeWallet?.totalAdvance || 0}</div>
//                 </div>
//                 <div className="p-4 border rounded-xl bg-card shadow-sm">
//                   <div className="text-sm text-muted-foreground font-medium mb-1">Total Expense Utilized</div>
//                   <div className="text-xl font-semibold text-rose-600">₹{employeeWallet?.totalExpense || 0}</div>
//                 </div>
//                 <div className="p-4 border rounded-xl bg-card shadow-sm">
//                   <div className="text-sm text-muted-foreground font-medium mb-1">Total Refunded</div>
//                   <div className="text-xl font-semibold text-emerald-600">₹{employeeWallet?.totalRefund || 0}</div>
//                 </div>
//               </div>

//               <div className="border rounded-md">
//                 <div className="p-3 bg-muted border-b font-semibold flex items-center gap-2">
//                   <CreditCard className="h-4 w-4"/> Wallet Passbook
//                 </div>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Reference</TableHead>
//                       <TableHead>Remarks</TableHead>
//                       <TableHead className="text-right">Amount</TableHead>
//                       <TableHead className="text-right">Balance After</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {employeeWalletTransactions?.length === 0 ? (
//                       <TableRow><TableCell colSpan={6} className="text-center py-6">No transactions found.</TableCell></TableRow>
//                     ) : (
//                       employeeWalletTransactions?.map((txn) => (
//                         <TableRow key={txn?._id}>
//                           <TableCell>{formatDate(txn?.createdAt)}</TableCell>
//                           <TableCell>
//                             <Badge variant={txn?.type === 'CREDIT' ? 'success' : 'destructive'} className="text-[10px]">
//                               {txn?.type}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="font-medium">{txn?.referenceType}</TableCell>
//                           <TableCell className="text-muted-foreground text-sm">{txn?.remarks}</TableCell>
//                           <TableCell className={`text-right font-bold ${txn?.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
//                             {txn?.type === 'CREDIT' ? '+' : '-'}₹{txn?.amount}
//                           </TableCell>
//                           <TableCell className="text-right font-mono">₹{txn?.balanceAfter}</TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           ) : (
//             selectedEmpId && !loading && <div className="text-center py-10 text-muted-foreground border rounded-lg">No wallet data found for this employee.</div>
//           )}
//         </TabsContent>

//         {/* ==================== 3. CATEGORIES SECTION ==================== */}
//         <TabsContent value="categories" className="space-y-4 m-0">
//           <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
//             <div>
//               <h3 className="text-lg font-semibold">Expense Categories</h3>
//               <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
//             </div>
//             <Button onClick={() => openCategoryModal()} className="gap-2">
//               <Plus className="h-4 w-4"/> Add Category
//             </Button>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Color/Icon</TableHead>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseCategories?.map((cat) => (
//                   <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
//                     <TableCell>
//                       <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: cat?.color }}>
//                         <i className={`fa-solid ${cat?.icon}`}></i>
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">{cat?.name}</TableCell>
//                     <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
//                     <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
//                       {cat?.isActive && (
//                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(cat?._id)}>Disable</Button>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* ==================== MODALS ==================== */}
      
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//              <div className="py-4 space-y-4">
//                <p className="text-sm text-muted-foreground">
//                  Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
//                </p>
//                <div>
//                  <Label>Remarks (Optional)</Label>
//                  <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//                </div>
//              </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="py-4">
//               <Label>Reason <span className="text-destructive">*</span></Label>
//               <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="space-y-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
//                   <div className="mt-2"><Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge></div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
//                 </div>
//               </div>
//               <Separator />
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
//                   <div className="font-medium text-base">
//                     <Badge variant="outline" style={{ borderColor: selectedExpense.categoryId?.color, color: selectedExpense.categoryId?.color }}>
//                       {selectedExpense.categoryId?.name || "N/A"}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//               <Separator />
//               <div className="space-y-4">
//                 <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
//                 <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
//               </div>
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
//                       <FileText className="h-4 w-4" /> View Document
//                     </a>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//           <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Add Money to Wallet (Advance)</DialogTitle></DialogHeader>
//           <div className="space-y-4 py-4">
//             <div>
//               <Label>Amount (₹) <span className="text-destructive">*</span></Label>
//               <Input type="number" placeholder="10000" value={walletForm.amount} onChange={(e) => setWalletForm({...walletForm, amount: e.target.value})} />
//             </div>
//             <div>
//               <Label>Remarks</Label>
//               <Input placeholder="Site visit advance..." value={walletForm.remarks} onChange={(e) => setWalletForm({...walletForm, remarks: e.target.value})} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsAddMoneyOpen(false)}>Cancel</Button>
//             <Button onClick={() => handleWalletSubmit('add')} className="bg-blue-600 hover:bg-blue-700 text-white">Add Amount</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Refund Money to Wallet</DialogTitle></DialogHeader>
//           <div className="space-y-4 py-4">
//             <div>
//               <Label>Amount (₹) <span className="text-destructive">*</span></Label>
//               <Input type="number" placeholder="500" value={walletForm.amount} onChange={(e) => setWalletForm({...walletForm, amount: e.target.value})} />
//             </div>
//             <div>
//               <Label>Reason</Label>
//               <Input placeholder="Returned unspent advance..." value={walletForm.remarks} onChange={(e) => setWalletForm({...walletForm, remarks: e.target.value})} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRefundOpen(false)}>Cancel</Button>
//             <Button onClick={() => handleWalletSubmit('refund')} className="bg-rose-600 hover:bg-rose-700 text-white">Process Refund</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* NEW: Updated Category Modal with Palette & Icons */}
//       <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-2 max-h-[70vh] overflow-y-auto px-2">
            
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Name <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. Travel" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Code <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. TRV" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
//             </div>
            
//             <div className="col-span-2">
//               <Label>Description</Label>
//               <Input placeholder="Short description of this expense type..." value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
//             </div>

//             {/* COLOR PALETTE */}
//             <div className="col-span-2">
//               <Label className="mb-2 block">Select Theme Color</Label>
//               <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-md">
//                 {PREDEFINED_COLORS.map(color => (
//                   <div 
//                     key={color}
//                     onClick={() => setCategoryForm({...categoryForm, color})}
//                     className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${categoryForm.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
//                     style={{ backgroundColor: color }}
//                   >
//                     {categoryForm.color === color && <CheckCircle className="h-4 w-4 text-white opacity-80" />}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* ICON GRID */}
//             <div className="col-span-2">
//               <Label className="mb-2 block">Select Icon (FontAwesome)</Label>
//               <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-muted/30 border rounded-md max-h-48 overflow-y-auto">
//                 {PREDEFINED_ICONS.map(iconClass => (
//                   <div
//                     key={iconClass}
//                     onClick={() => setCategoryForm({...categoryForm, icon: iconClass})}
//                     className={`aspect-square flex items-center justify-center rounded-md cursor-pointer border transition-all hover:bg-muted ${categoryForm.icon === iconClass ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-background border-transparent text-muted-foreground'}`}
//                   >
//                     <i className={`fa-solid ${iconClass} text-lg`}></i>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
//             <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }











// import React, { useEffect, useState, useMemo } from "react";
// import * as LucideIcons from "lucide-react"; 
// import { 
//   CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
//   Wallet, Settings, Plus, CreditCard, ArrowDownCircle, ArrowUpCircle
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import { useHR } from "@/hooks/useHR"; 

// // ==================== PREDEFINED UX DATA ====================
// const PREDEFINED_COLORS = [
//   "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", 
//   "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
//   "#f43f5e", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669", 
//   "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", 
//   "#db2777", "#e11d48", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"
// ];

// // Pure Lucide Icons for Categories
// const PREDEFINED_ICONS = [
//   "Car", "Bus", "Train", "Plane", "Bike", "Truck", "Ship", "Fuel", "Compass", "MapPin", "Navigation", "Route", "Ticket",
//   "Utensils", "Coffee", "Pizza", "Soup", "CupSoda", "Wine", "Beer", "Cake", "Apple", "Cookie",
//   "Building", "Hotel", "Home", "Warehouse", "Factory", "Store", "Tent", "Bed", "DoorOpen",
//   "Laptop", "Smartphone", "Tablet", "Monitor", "Printer", "Server", "Cpu", "HardDrive", "Wifi", "Bluetooth", "Plug", "BatteryCharging", "Zap",
//   "Wrench", "Hammer", "Screwdriver", "Tool", "Lightbulb", "Headset", "Camera", "Video", "Mic", "Speaker", "Tv",
//   "Banknote", "Coins", "CreditCard", "Receipt", "Wallet", "PiggyBank", "Calculator", "ShoppingCart", "ShoppingBag", "Percent", "TrendingUp",
//   "Stethoscope", "Pill", "Syringe", "Activity", "HeartPulse", "FirstAidKit", "Cross",
//   "Tag", "Tags", "Box", "Boxes", "Package", "Gift", "Bookmark", "Calendar", "Clock", "Hourglass", "AlarmClock",
//   "Briefcase", "Folder", "FolderOpen", "FileText", "Clipboard", "Mail", "Send", "Inbox", "Archive",
//   "Star", "Shield", "Key", "Lock", "Unlock", "Search", "Bell", "Flag", "BookmarkCheck",
//   "Users", "User", "UserCheck", "UserPlus", "GraduationCap", "BookOpen", "Award", "Trophy", "Crown", "Medal",
//   "Sun", "Moon", "Cloud", "CloudRain", "Snowflake", "Wind", "Flame", "Droplets", "Leaf", "TreePine"
// ];

// export function HRExpenseTab() {
//   const {
//     loading,
//     allExpenses,
//     fetchAllExpenses,
//     approveExpense,
//     rejectExpense,
//     employees,
//     fetchEmployees,
//     employeeWallet,
//     employeeWalletTransactions,
//     fetchEmployeeWallet,
//     fetchEmployeeWalletTransactions,
//     addWalletMoney,
//     refundWallet,
//     expenseCategories,
//     fetchExpenseCategories,
//     createExpenseCategory,
//     updateExpenseCategory,
//     deleteExpenseCategory
//   } = useHR();

//   // ==================== TICKET STATE ====================
//   const [ticketTab, setTicketTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   // ==================== WALLET STATE ====================
//   const [selectedEmpId, setSelectedEmpId] = useState("");
//   const [empSearchTerm, setEmpSearchTerm] = useState(""); 
//   const [empPage, setEmpPage] = useState(1); // NEW: Employee Pagination State
//   const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
//   const [isRefundOpen, setIsRefundOpen] = useState(false);
//   const [walletForm, setWalletForm] = useState({ amount: "", remarks: "" });

//   // ==================== CATEGORY STATE ====================
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [iconSearch, setIconSearch] = useState(""); 
//   const [categoryForm, setCategoryForm] = useState({
//     name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0
//   });

//   // Filter Lucide icons based on search
//   const filteredIcons = useMemo(() => {
//     if (!iconSearch.trim()) return PREDEFINED_ICONS;
//     return PREDEFINED_ICONS.filter(iconName => 
//       iconName.toLowerCase().includes(iconSearch.toLowerCase())
//     );
//   }, [iconSearch]);

//   // ==================== EFFECTS ====================
  
//   // Fetch Categories once on mount
//   useEffect(() => {
//     fetchExpenseCategories();
//   }, [fetchExpenseCategories]);

//   // UPDATED: Debounced Employee Search with Pagination
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchEmployees({ search: empSearchTerm, page: empPage, limit: 10 });
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [empSearchTerm, empPage, fetchEmployees]);

//   // Debounced Ticket Search
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchAllExpenses({ status: ticketTab, search: searchTerm, page: 1, limit: 10 });
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [ticketTab, searchTerm, fetchAllExpenses]);

//   // Fetch Wallet when Employee selected
//   useEffect(() => {
//     if (selectedEmpId) {
//       fetchEmployeeWallet(selectedEmpId);
//       fetchEmployeeWalletTransactions(selectedEmpId, { page: 1, limit: 10 });
//     }
//   }, [selectedEmpId, fetchEmployeeWallet, fetchEmployeeWalletTransactions]);

//   // ==================== TICKET HANDLERS ====================
//   const handleApprove = async () => {
//     if (!selectedExpense?._id) return; 
//     const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
//     if (success) setIsApproveOpen(false);
//   };

//   const handleReject = async () => {
//     if (!selectedExpense?._id) return; 
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
//     if (success) setIsRejectOpen(false);
//   };

//   const openTicketModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // ==================== WALLET HANDLERS ====================
//   const handleWalletSubmit = async (type) => {
//     if (!walletForm.amount || isNaN(walletForm.amount) || Number(walletForm.amount) <= 0) {
//       return toast.error("Enter a valid amount");
//     }
//     const payload = {
//       employeeId: selectedEmpId,
//       amount: Number(walletForm.amount),
//       remarks: walletForm.remarks
//     };

//     let success = false;
//     if (type === 'add') success = await addWalletMoney(payload);
//     if (type === 'refund') success = await refundWallet(payload);

//     if (success) {
//       setIsAddMoneyOpen(false);
//       setIsRefundOpen(false);
//       setWalletForm({ amount: "", remarks: "" });
//     }
//   };

//   // ==================== CATEGORY HANDLERS ====================
//   const openCategoryModal = (category = null) => {
//     setIconSearch(""); 
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ 
//         name: category.name || "", 
//         code: category.code || "", 
//         description: category.description || "", 
//         color: category.color || "#3b82f6", 
//         icon: category.icon || "Tag", 
//         sortOrder: category.sortOrder || 0 
//       });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0 });
//     }
//     setIsCategoryOpen(true);
//   };

//   const handleCategorySubmit = async () => {
//     if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
//     let success = false;
//     if (editingCategory?._id) { 
//       success = await updateExpenseCategory(editingCategory._id, categoryForm);
//     } else {
//       success = await createExpenseCategory(categoryForm);
//     }

//     if (success) setIsCategoryOpen(false);
//   };

//   const handleDeleteCategory = async (id) => {
//     if (!id) return;
//     if (window.confirm("Are you sure you want to deactivate this category?")) {
//       await deleteExpenseCategory(id);
//     }
//   };

//   const handleActivateCategory = async (category) => {
//     if (window.confirm("Are you sure you want to activate this category?")) {
//       await updateExpenseCategory(category._id, { ...category, isActive: true });
//     }
//   };

//   // ==================== HELPERS ====================
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Paid": return "outline"; 
//       case "Rejected": return "destructive";
//       default: return "secondary"; 
//     }
//   };

//   const renderDynamicIcon = (iconName, className) => {
//     const DynamicIcon = LucideIcons[iconName];
//     if (!DynamicIcon) return <LucideIcons.Tag className={className} />;
//     return <DynamicIcon className={className} />;
//   };

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="tickets" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
//           <TabsTrigger value="wallets" className="flex gap-2"><Wallet className="h-4 w-4"/> Employee Wallets</TabsTrigger>
//           <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
//         </TabsList>

//         {/* ==================== 1. TICKETS SECTION ==================== */}
//         <TabsContent value="tickets" className="space-y-4 m-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//               <Tabs value={ticketTab} onValueChange={setTicketTab}>
//                 <TabsList>
//                   <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//                   <TabsTrigger value="Approved">Approved</TabsTrigger>
//                   <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//                   <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//             <div className="relative w-full sm:w-64 shrink-0">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : allExpenses?.length === 0 ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
//                 ) : (
//                   allExpenses?.map((expense) => (
//                     <TableRow key={expense?._id}>
//                       <TableCell>{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.employeeId?.name}</div>
//                         <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.title}</div>
//                         <Badge variant="outline" className="mt-1 font-normal text-[10px] flex items-center w-fit gap-1">
//                           {expense?.categoryId?.icon && renderDynamicIcon(expense.categoryId.icon, "h-3 w-3")}
//                           {expense?.categoryId?.name || "N/A"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="font-bold">₹{expense?.amount}</TableCell>
//                       <TableCell>
//                         <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
//                           {ticketTab === "Pending" && (
//                             <>
//                               <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* ==================== 2. WALLET SECTION ==================== */}
//         <TabsContent value="wallets" className="space-y-4 m-0">
//           {!selectedEmpId ? (
//             // --------------------------------------------------------
//             // VIEW 1: EMPLOYEE LIST & SEARCH
//             // --------------------------------------------------------
//             <div className="space-y-4">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
//                 <div>
//                   <h3 className="text-lg font-semibold">Employee Wallets</h3>
//                   <p className="text-sm text-muted-foreground">Search and select an employee to view or manage their wallet.</p>
//                 </div>
//                 <div className="relative w-full sm:w-72">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search by name, ID or email..." 
//                     className="pl-9 bg-background" 
//                     value={empSearchTerm} 
//                     onChange={(e) => {
//                       setEmpSearchTerm(e.target.value);
//                       setEmpPage(1); // UPDATED: Reset page on search
//                     }} 
//                   />
//                 </div>
//               </div>

//               <div className="border rounded-md">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Employee ID</TableHead>
//                       <TableHead>Employee Name</TableHead>
//                       <TableHead>Email</TableHead>
//                       <TableHead className="text-right">Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow><TableCell colSpan={4} className="text-center py-6">Loading...</TableCell></TableRow>
//                     ) : employees?.employees?.length === 0 ? (
//                       <TableRow><TableCell colSpan={4} className="text-center py-6">No employees found.</TableCell></TableRow>
//                     ) : (
//                       employees?.employees?.map((emp) => (
//                         <TableRow key={emp?._id}>
//                           <TableCell className="font-mono text-xs">{emp?.employeeId}</TableCell>
//                           <TableCell className="font-medium">{emp?.name}</TableCell>
//                           <TableCell className="text-muted-foreground">{emp?.email}</TableCell>
//                           <TableCell className="text-right">
//                             <Button variant="outline" size="sm" onClick={() => setSelectedEmpId(emp?._id)}>
//                               <Wallet className="h-4 w-4 mr-2" /> View Wallet
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>

//               {/* NEW: Employee List Pagination Controls */}
//               {employees?.pagination?.pages > 1 && (
//                 <div className="flex items-center justify-between bg-muted/20 px-4 py-2 border rounded-md mt-4">
//                   <div className="text-sm text-muted-foreground">
//                     Page <span className="font-medium text-foreground">{employees.pagination.page}</span> of{" "}
//                     <span className="font-medium text-foreground">{employees.pagination.pages}</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button 
//                       variant="outline" 
//                       size="sm" 
//                       disabled={employees.pagination.page <= 1}
//                       onClick={() => setEmpPage(prev => Math.max(1, prev - 1))}
//                     >
//                       Previous
//                     </Button>
//                     <Button 
//                       variant="outline" 
//                       size="sm" 
//                       disabled={employees.pagination.page >= employees.pagination.pages}
//                       onClick={() => setEmpPage(prev => prev + 1)}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             // --------------------------------------------------------
//             // VIEW 2: WALLET DETAILS & PASSBOOK
//             // --------------------------------------------------------
//             <div className="space-y-4">
//               <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
//                 <div className="flex items-center gap-4">
//                   {/* BACK BUTTON */}
//                   <Button variant="ghost" size="sm" onClick={() => setSelectedEmpId("")} className="hover:bg-background">
//                     ← Back to List
//                   </Button>
//                   <Separator orientation="vertical" className="h-6" />
//                   <div>
//                     <h3 className="text-lg font-semibold">
//                       {employees?.employees?.find(e => e._id === selectedEmpId)?.name}'s Wallet
//                     </h3>
//                     <p className="text-sm text-muted-foreground font-mono">
//                       {employees?.employees?.find(e => e._id === selectedEmpId)?.employeeId}
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* ADVANCE & REFUND BUTTONS */}
//                 <div className="flex gap-2">
//                   <Button onClick={() => { setWalletForm({amount: "", remarks: ""}); setIsAddMoneyOpen(true); }} className="gap-2 bg-blue-600 hover:bg-blue-700">
//                     <ArrowDownCircle className="h-4 w-4"/> Add Advance
//                   </Button>
//                   <Button onClick={() => { setWalletForm({amount: "", remarks: ""}); setIsRefundOpen(true); }} variant="outline" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950">
//                     <ArrowUpCircle className="h-4 w-4"/> Refund Wallet
//                   </Button>
//                 </div>
//               </div>

//               {/* STATS CARDS & PASSBOOK TABLE */}
//               {employeeWallet ? (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="p-4 border rounded-xl bg-card shadow-sm">
//                       <div className="text-sm text-muted-foreground font-medium mb-1">Current Balance</div>
//                       <div className="text-3xl font-bold text-primary">₹{employeeWallet?.balance || 0}</div>
//                     </div>
//                     <div className="p-4 border rounded-xl bg-card shadow-sm">
//                       <div className="text-sm text-muted-foreground font-medium mb-1">Total Advance</div>
//                       <div className="text-xl font-semibold text-blue-600">₹{employeeWallet?.totalAdvance || 0}</div>
//                     </div>
//                     <div className="p-4 border rounded-xl bg-card shadow-sm">
//                       <div className="text-sm text-muted-foreground font-medium mb-1">Total Expense Utilized</div>
//                       <div className="text-xl font-semibold text-rose-600">₹{employeeWallet?.totalExpense || 0}</div>
//                     </div>
//                     <div className="p-4 border rounded-xl bg-card shadow-sm">
//                       <div className="text-sm text-muted-foreground font-medium mb-1">Total Refunded</div>
//                       <div className="text-xl font-semibold text-emerald-600">₹{employeeWallet?.totalRefund || 0}</div>
//                     </div>
//                   </div>

//                   <div className="border rounded-md">
//                     <div className="p-3 bg-muted border-b font-semibold flex items-center gap-2">
//                       <CreditCard className="h-4 w-4"/> Wallet Passbook
//                     </div>
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Date</TableHead>
//                           <TableHead>Type</TableHead>
//                           <TableHead>Reference</TableHead>
//                           <TableHead>Remarks</TableHead>
//                           <TableHead className="text-right">Amount</TableHead>
//                           <TableHead className="text-right">Balance After</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {employeeWalletTransactions?.length === 0 ? (
//                           <TableRow><TableCell colSpan={6} className="text-center py-6">No transactions found.</TableCell></TableRow>
//                         ) : (
//                           employeeWalletTransactions?.map((txn) => (
//                             <TableRow key={txn?._id}>
//                               <TableCell>{formatDate(txn?.createdAt)}</TableCell>
//                               <TableCell>
//                                 <Badge variant={txn?.type === 'CREDIT' ? 'success' : 'destructive'} className="text-[10px]">
//                                   {txn?.type}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell className="font-medium">{txn?.referenceType}</TableCell>
//                               <TableCell className="text-muted-foreground text-sm">{txn?.remarks}</TableCell>
//                               <TableCell className={`text-right font-bold ${txn?.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
//                                 {txn?.type === 'CREDIT' ? '+' : '-'}₹{txn?.amount}
//                               </TableCell>
//                               <TableCell className="text-right font-mono">₹{txn?.balanceAfter}</TableCell>
//                             </TableRow>
//                           ))
//                         )}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </div>
//               ) : (
//                 !loading && <div className="text-center py-10 text-muted-foreground border rounded-lg">Loading wallet data...</div>
//               )}
//             </div>
//           )}
//         </TabsContent>

//         {/* ==================== 3. CATEGORIES SECTION ==================== */}
//         <TabsContent value="categories" className="space-y-4 m-0">
//           <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
//             <div>
//               <h3 className="text-lg font-semibold">Expense Categories</h3>
//               <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
//             </div>
//             <Button onClick={() => openCategoryModal()} className="gap-2">
//               <Plus className="h-4 w-4"/> Add Category
//             </Button>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Color/Icon</TableHead>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseCategories?.map((cat) => (
//                   <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
//                     <TableCell>
//                       <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: cat?.color || '#3b82f6' }}>
//                         {renderDynamicIcon(cat?.icon, "h-4 w-4")}
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">{cat?.name}</TableCell>
//                     <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
//                     <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
                      
//                       {/* NEW: Conditional logic for Disable vs Activate */}
//                       {cat?.isActive ? (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-destructive hover:text-destructive" 
//                           onClick={() => handleDeleteCategory(cat?._id)}
//                         >
//                           Disable
//                         </Button>
//                       ) : (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-emerald-600 hover:text-emerald-700" 
//                           onClick={() => handleActivateCategory(cat)}
//                         >
//                           Activate
//                         </Button>
//                       )}
                      
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* ==================== MODALS ==================== */}
      
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//              <div className="py-4 space-y-4">
//                <p className="text-sm text-muted-foreground">
//                  Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
//                </p>
//                <div>
//                  <Label>Remarks (Optional)</Label>
//                  <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//                </div>
//              </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="py-4">
//               <Label>Reason <span className="text-destructive">*</span></Label>
//               <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="space-y-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
//                   <div className="mt-2"><Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge></div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
//                 </div>
//               </div>
//               <Separator />
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
//                   <div className="font-medium text-base flex items-center gap-2 mt-1">
//                     <Badge variant="outline" style={{ borderColor: selectedExpense.categoryId?.color, color: selectedExpense.categoryId?.color }}>
//                       {selectedExpense.categoryId?.icon && renderDynamicIcon(selectedExpense.categoryId.icon, "h-3 w-3 mr-1")}
//                       {selectedExpense.categoryId?.name || "N/A"}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//               <Separator />
//               <div className="space-y-4">
//                 <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
//                 <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
//               </div>
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
//                       <FileText className="h-4 w-4" /> View Document
//                     </a>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//           <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Add Money to Wallet (Advance)</DialogTitle></DialogHeader>
//           <div className="space-y-4 py-4">
//             <div>
//               <Label>Amount (₹) <span className="text-destructive">*</span></Label>
//               <Input type="number" placeholder="10000" value={walletForm.amount} onChange={(e) => setWalletForm({...walletForm, amount: e.target.value})} />
//             </div>
//             <div>
//               <Label>Remarks</Label>
//               <Input placeholder="Site visit advance..." value={walletForm.remarks} onChange={(e) => setWalletForm({...walletForm, remarks: e.target.value})} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsAddMoneyOpen(false)}>Cancel</Button>
//             <Button onClick={() => handleWalletSubmit('add')} className="bg-blue-600 hover:bg-blue-700 text-white">Add Amount</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Refund Money to Wallet</DialogTitle></DialogHeader>
//           <div className="space-y-4 py-4">
//             <div>
//               <Label>Amount (₹) <span className="text-destructive">*</span></Label>
//               <Input type="number" placeholder="500" value={walletForm.amount} onChange={(e) => setWalletForm({...walletForm, amount: e.target.value})} />
//             </div>
//             <div>
//               <Label>Reason</Label>
//               <Input placeholder="Returned unspent advance..." value={walletForm.remarks} onChange={(e) => setWalletForm({...walletForm, remarks: e.target.value})} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRefundOpen(false)}>Cancel</Button>
//             <Button onClick={() => handleWalletSubmit('refund')} className="bg-rose-600 hover:bg-rose-700 text-white">Process Refund</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Lucide Category Modal with Search */}
//       <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-2 max-h-[75vh] overflow-y-auto px-2">
            
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Name <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. Travel" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Code <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. TRV" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
//             </div>
            
//             <div className="col-span-2">
//               <Label>Description</Label>
//               <Input placeholder="Short description of this expense type..." value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
//             </div>

//             {/* COLOR PALETTE */}
//             <div className="col-span-2">
//               <div className="flex items-center justify-between mb-2">
//                 <Label>Select Theme Color</Label>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-muted-foreground">Custom:</span>
//                   <input type="color" className="h-6 w-8 cursor-pointer rounded-sm" value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-md">
//                 {PREDEFINED_COLORS.map(color => {
//                   const isSelected = categoryForm.color?.toLowerCase() === color.toLowerCase();
//                   return (
//                     <div 
//                       key={color}
//                       onClick={() => setCategoryForm({...categoryForm, color})}
//                       className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
//                       style={{ backgroundColor: color }}
//                     >
//                       {isSelected && <CheckCircle className="h-4 w-4 text-white opacity-80" />}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* SEARCHABLE LUCIDE ICON GRID */}
//             <div className="col-span-2 space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Select Icon ({filteredIcons.length} available)</Label>
//                 <div className="relative w-48">
//                   <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search icon..." 
//                     className="h-8 pl-8 text-xs" 
//                     value={iconSearch} 
//                     onChange={(e) => setIconSearch(e.target.value)} 
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-muted/30 border rounded-md max-h-48 overflow-y-auto">
//                 {filteredIcons.length === 0 ? (
//                   <div className="col-span-full text-center py-6 text-sm text-muted-foreground">
//                     No icons found matching "{iconSearch}"
//                   </div>
//                 ) : (
//                   filteredIcons.map(iconName => {
//                     const IconComponent = LucideIcons[iconName];
//                     if (!IconComponent) return null;

//                     const isSelected = categoryForm.icon === iconName;
//                     return (
//                       <div
//                         key={iconName}
//                         onClick={() => setCategoryForm({...categoryForm, icon: iconName})}
//                         className={`aspect-square flex items-center justify-center rounded-md cursor-pointer border transition-all hover:bg-muted ${isSelected ? 'bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/20' : 'bg-background border-transparent text-muted-foreground'}`}
//                         title={iconName}
//                       >
//                         <IconComponent className="h-5 w-5" />
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//           </div>
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
//             <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }












// import React, { useEffect, useState, useMemo } from "react";
// import * as LucideIcons from "lucide-react"; 
// import { 
//   CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
//   Settings, Plus 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import { useHR } from "@/hooks/useHR"; 

// // ==================== PREDEFINED UX DATA ====================
// const PREDEFINED_COLORS = [
//   "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", 
//   "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
//   "#f43f5e", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669", 
//   "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", 
//   "#db2777", "#e11d48", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"
// ];

// // Pure Lucide Icons for Categories
// const PREDEFINED_ICONS = [
//   "Car", "Bus", "Train", "Plane", "Bike", "Truck", "Ship", "Fuel", "Compass", "MapPin", "Navigation", "Route", "Ticket",
//   "Utensils", "Coffee", "Pizza", "Soup", "CupSoda", "Wine", "Beer", "Cake", "Apple", "Cookie",
//   "Building", "Hotel", "Home", "Warehouse", "Factory", "Store", "Tent", "Bed", "DoorOpen",
//   "Laptop", "Smartphone", "Tablet", "Monitor", "Printer", "Server", "Cpu", "HardDrive", "Wifi", "Bluetooth", "Plug", "BatteryCharging", "Zap",
//   "Wrench", "Hammer", "Screwdriver", "Tool", "Lightbulb", "Headset", "Camera", "Video", "Mic", "Speaker", "Tv",
//   "Banknote", "Coins", "CreditCard", "Receipt", "Wallet", "PiggyBank", "Calculator", "ShoppingCart", "ShoppingBag", "Percent", "TrendingUp",
//   "Stethoscope", "Pill", "Syringe", "Activity", "HeartPulse", "FirstAidKit", "Cross",
//   "Tag", "Tags", "Box", "Boxes", "Package", "Gift", "Bookmark", "Calendar", "Clock", "Hourglass", "AlarmClock",
//   "Briefcase", "Folder", "FolderOpen", "FileText", "Clipboard", "Mail", "Send", "Inbox", "Archive",
//   "Star", "Shield", "Key", "Lock", "Unlock", "Search", "Bell", "Flag", "BookmarkCheck",
//   "Users", "User", "UserCheck", "UserPlus", "GraduationCap", "BookOpen", "Award", "Trophy", "Crown", "Medal",
//   "Sun", "Moon", "Cloud", "CloudRain", "Snowflake", "Wind", "Flame", "Droplets", "Leaf", "TreePine"
// ];

// export function HRExpenseTab() {
//   const {
//     loading,
//     allExpenses,
//     fetchAllExpenses,
//     approveExpense,
//     rejectExpense,
//     expenseCategories,
//     fetchExpenseCategories,
//     createExpenseCategory,
//     updateExpenseCategory,
//     deleteExpenseCategory
//   } = useHR();

//   // ==================== TICKET STATE ====================
//   const [ticketTab, setTicketTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   // ==================== CATEGORY STATE ====================
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [iconSearch, setIconSearch] = useState(""); 
//   const [categoryForm, setCategoryForm] = useState({
//     name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0
//   });

//   // Filter Lucide icons based on search
//   const filteredIcons = useMemo(() => {
//     if (!iconSearch.trim()) return PREDEFINED_ICONS;
//     return PREDEFINED_ICONS.filter(iconName => 
//       iconName.toLowerCase().includes(iconSearch.toLowerCase())
//     );
//   }, [iconSearch]);

//   // ==================== EFFECTS ====================
  
//   // Fetch Categories once on mount
//   useEffect(() => {
//     fetchExpenseCategories();
//   }, [fetchExpenseCategories]);

//   // Debounced Ticket Search
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchAllExpenses({ status: ticketTab, search: searchTerm, page: 1, limit: 10 });
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [ticketTab, searchTerm, fetchAllExpenses]);

//   // ==================== TICKET HANDLERS ====================
//   const handleApprove = async () => {
//     if (!selectedExpense?._id) return; 
//     const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
//     if (success) setIsApproveOpen(false);
//   };

//   const handleReject = async () => {
//     if (!selectedExpense?._id) return; 
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
//     if (success) setIsRejectOpen(false);
//   };

//   const openTicketModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // ==================== CATEGORY HANDLERS ====================
//   const openCategoryModal = (category = null) => {
//     setIconSearch(""); 
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ 
//         name: category.name || "", 
//         code: category.code || "", 
//         description: category.description || "", 
//         color: category.color || "#3b82f6", 
//         icon: category.icon || "Tag", 
//         sortOrder: category.sortOrder || 0 
//       });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0 });
//     }
//     setIsCategoryOpen(true);
//   };

//   const handleCategorySubmit = async () => {
//     if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
//     let success = false;
//     if (editingCategory?._id) { 
//       success = await updateExpenseCategory(editingCategory._id, categoryForm);
//     } else {
//       success = await createExpenseCategory(categoryForm);
//     }

//     if (success) setIsCategoryOpen(false);
//   };

//   const handleDeleteCategory = async (id) => {
//     if (!id) return;
//     if (window.confirm("Are you sure you want to deactivate this category?")) {
//       await deleteExpenseCategory(id);
//     }
//   };

//   const handleActivateCategory = async (category) => {
//     if (window.confirm("Are you sure you want to activate this category?")) {
//       await updateExpenseCategory(category._id, { ...category, isActive: true });
//     }
//   };

//   // ==================== HELPERS ====================
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Paid": return "outline"; 
//       case "Rejected": return "destructive";
//       default: return "secondary"; 
//     }
//   };

//   const renderDynamicIcon = (iconName, className) => {
//     const DynamicIcon = LucideIcons[iconName];
//     if (!DynamicIcon) return <LucideIcons.Tag className={className} />;
//     return <DynamicIcon className={className} />;
//   };

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="tickets" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
//           <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
//         </TabsList>

//         {/* ==================== 1. TICKETS SECTION ==================== */}
//         <TabsContent value="tickets" className="space-y-4 m-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//               <Tabs value={ticketTab} onValueChange={setTicketTab}>
//                 <TabsList>
//                   <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//                   <TabsTrigger value="Approved">Approved</TabsTrigger>
//                   <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//                   <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//             <div className="relative w-full sm:w-64 shrink-0">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : allExpenses?.length === 0 ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
//                 ) : (
//                   allExpenses?.map((expense) => (
//                     <TableRow key={expense?._id}>
//                       <TableCell>{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.employeeId?.name}</div>
//                         <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.title}</div>
//                         <Badge variant="outline" className="mt-1 font-normal text-[10px] flex items-center w-fit gap-1">
//                           {expense?.categoryId?.icon && renderDynamicIcon(expense.categoryId.icon, "h-3 w-3")}
//                           {expense?.categoryId?.name || "N/A"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="font-bold">₹{expense?.amount}</TableCell>
//                       <TableCell>
//                         <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
//                           {ticketTab === "Pending" && (
//                             <>
//                               <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* ==================== 2. CATEGORIES SECTION ==================== */}
//         <TabsContent value="categories" className="space-y-4 m-0">
//           <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
//             <div>
//               <h3 className="text-lg font-semibold">Expense Categories</h3>
//               <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
//             </div>
//             <Button onClick={() => openCategoryModal()} className="gap-2">
//               <Plus className="h-4 w-4"/> Add Category
//             </Button>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Color/Icon</TableHead>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseCategories?.map((cat) => (
//                   <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
//                     <TableCell>
//                       <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: cat?.color || '#3b82f6' }}>
//                         {renderDynamicIcon(cat?.icon, "h-4 w-4")}
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">{cat?.name}</TableCell>
//                     <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
//                     <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
                      
//                       {cat?.isActive ? (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-destructive hover:text-destructive" 
//                           onClick={() => handleDeleteCategory(cat?._id)}
//                         >
//                           Disable
//                         </Button>
//                       ) : (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-emerald-600 hover:text-emerald-700" 
//                           onClick={() => handleActivateCategory(cat)}
//                         >
//                           Activate
//                         </Button>
//                       )}
                      
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* ==================== MODALS ==================== */}
      
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//              <div className="py-4 space-y-4">
//                <p className="text-sm text-muted-foreground">
//                  Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
//                </p>
//                <div>
//                  <Label>Remarks (Optional)</Label>
//                  <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//                </div>
//              </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="py-4">
//               <Label>Reason <span className="text-destructive">*</span></Label>
//               <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="space-y-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
//                   <div className="mt-2"><Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge></div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
//                 </div>
//               </div>
//               <Separator />
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
//                   <div className="font-medium text-base flex items-center gap-2 mt-1">
//                     <Badge variant="outline" style={{ borderColor: selectedExpense.categoryId?.color, color: selectedExpense.categoryId?.color }}>
//                       {selectedExpense.categoryId?.icon && renderDynamicIcon(selectedExpense.categoryId.icon, "h-3 w-3 mr-1")}
//                       {selectedExpense.categoryId?.name || "N/A"}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//               <Separator />
//               <div className="space-y-4">
//                 <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
//                 <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
//               </div>
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
//                       <FileText className="h-4 w-4" /> View Document
//                     </a>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//           <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Lucide Category Modal with Search */}
//       <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-2 max-h-[75vh] overflow-y-auto px-2">
            
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Name <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. Travel" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Code <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. TRV" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
//             </div>
            
//             <div className="col-span-2">
//               <Label>Description</Label>
//               <Input placeholder="Short description of this expense type..." value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
//             </div>

//             {/* COLOR PALETTE */}
//             <div className="col-span-2">
//               <div className="flex items-center justify-between mb-2">
//                 <Label>Select Theme Color</Label>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-muted-foreground">Custom:</span>
//                   <input type="color" className="h-6 w-8 cursor-pointer rounded-sm" value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-md">
//                 {PREDEFINED_COLORS.map(color => {
//                   const isSelected = categoryForm.color?.toLowerCase() === color.toLowerCase();
//                   return (
//                     <div 
//                       key={color}
//                       onClick={() => setCategoryForm({...categoryForm, color})}
//                       className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
//                       style={{ backgroundColor: color }}
//                     >
//                       {isSelected && <CheckCircle className="h-4 w-4 text-white opacity-80" />}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* SEARCHABLE LUCIDE ICON GRID */}
//             <div className="col-span-2 space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Select Icon ({filteredIcons.length} available)</Label>
//                 <div className="relative w-48">
//                   <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search icon..." 
//                     className="h-8 pl-8 text-xs" 
//                     value={iconSearch} 
//                     onChange={(e) => setIconSearch(e.target.value)} 
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-muted/30 border rounded-md max-h-48 overflow-y-auto">
//                 {filteredIcons.length === 0 ? (
//                   <div className="col-span-full text-center py-6 text-sm text-muted-foreground">
//                     No icons found matching "{iconSearch}"
//                   </div>
//                 ) : (
//                   filteredIcons.map(iconName => {
//                     const IconComponent = LucideIcons[iconName];
//                     if (!IconComponent) return null;

//                     const isSelected = categoryForm.icon === iconName;
//                     return (
//                       <div
//                         key={iconName}
//                         onClick={() => setCategoryForm({...categoryForm, icon: iconName})}
//                         className={`aspect-square flex items-center justify-center rounded-md cursor-pointer border transition-all hover:bg-muted ${isSelected ? 'bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/20' : 'bg-background border-transparent text-muted-foreground'}`}
//                         title={iconName}
//                       >
//                         <IconComponent className="h-5 w-5" />
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//           </div>
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
//             <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }













// import React, { useEffect, useState, useMemo } from "react";
// import * as LucideIcons from "lucide-react"; 
// import { 
//   CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
//   Settings, Plus 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import { useHR } from "@/hooks/useHR"; 

// // ==================== PREDEFINED UX DATA ====================
// const PREDEFINED_COLORS = [
//   "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", 
//   "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
//   "#f43f5e", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669", 
//   "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", 
//   "#db2777", "#e11d48", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"
// ];

// // Pure Lucide Icons for Categories
// const PREDEFINED_ICONS = [
//   "Car", "Bus", "Train", "Plane", "Bike", "Truck", "Ship", "Fuel", "Compass", "MapPin", "Navigation", "Route", "Ticket",
//   "Utensils", "Coffee", "Pizza", "Soup", "CupSoda", "Wine", "Beer", "Cake", "Apple", "Cookie",
//   "Building", "Hotel", "Home", "Warehouse", "Factory", "Store", "Tent", "Bed", "DoorOpen",
//   "Laptop", "Smartphone", "Tablet", "Monitor", "Printer", "Server", "Cpu", "HardDrive", "Wifi", "Bluetooth", "Plug", "BatteryCharging", "Zap",
//   "Wrench", "Hammer", "Screwdriver", "Tool", "Lightbulb", "Headset", "Camera", "Video", "Mic", "Speaker", "Tv",
//   "Banknote", "Coins", "CreditCard", "Receipt", "Wallet", "PiggyBank", "Calculator", "ShoppingCart", "ShoppingBag", "Percent", "TrendingUp",
//   "Stethoscope", "Pill", "Syringe", "Activity", "HeartPulse", "FirstAidKit", "Cross",
//   "Tag", "Tags", "Box", "Boxes", "Package", "Gift", "Bookmark", "Calendar", "Clock", "Hourglass", "AlarmClock",
//   "Briefcase", "Folder", "FolderOpen", "FileText", "Clipboard", "Mail", "Send", "Inbox", "Archive",
//   "Star", "Shield", "Key", "Lock", "Unlock", "Search", "Bell", "Flag", "BookmarkCheck",
//   "Users", "User", "UserCheck", "UserPlus", "GraduationCap", "BookOpen", "Award", "Trophy", "Crown", "Medal",
//   "Sun", "Moon", "Cloud", "CloudRain", "Snowflake", "Wind", "Flame", "Droplets", "Leaf", "TreePine"
// ];

// export function HRExpenseTab() {
//   const {
//     loading,
//     allExpenses,
//     fetchAllExpenses,
//     approveExpense,
//     rejectExpense,
//     expenseCategories,
//     fetchExpenseCategories,
//     createExpenseCategory,
//     updateExpenseCategory,
//     deleteExpenseCategory
//   } = useHR();

//   // ==================== TICKET STATE ====================
//   const [ticketTab, setTicketTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   // ==================== CATEGORY STATE ====================
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [iconSearch, setIconSearch] = useState(""); 
//   const [categoryForm, setCategoryForm] = useState({
//     name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0
//   });

//   // Filter Lucide icons based on search
//   const filteredIcons = useMemo(() => {
//     if (!iconSearch.trim()) return PREDEFINED_ICONS;
//     return PREDEFINED_ICONS.filter(iconName => 
//       iconName.toLowerCase().includes(iconSearch.toLowerCase())
//     );
//   }, [iconSearch]);

//   // ==================== EFFECTS ====================
  
//   // Fetch Categories once on mount
//   useEffect(() => {
//     fetchExpenseCategories();
//   }, [fetchExpenseCategories]);

//   // Debounced Ticket Search
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchAllExpenses({ status: ticketTab, search: searchTerm, page: 1, limit: 10 });
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [ticketTab, searchTerm, fetchAllExpenses]);

//   // ==================== TICKET HANDLERS ====================
//   const handleApprove = async () => {
//     if (!selectedExpense?._id) return; 
//     const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
//     if (success) setIsApproveOpen(false);
//   };

//   const handleReject = async () => {
//     if (!selectedExpense?._id) return; 
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
//     if (success) setIsRejectOpen(false);
//   };

//   const openTicketModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // ==================== CATEGORY HANDLERS ====================
//   const openCategoryModal = (category = null) => {
//     setIconSearch(""); 
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ 
//         name: category.name || "", 
//         code: category.code || "", 
//         description: category.description || "", 
//         color: category.color || "#3b82f6", 
//         icon: category.icon || "Tag", 
//         sortOrder: category.sortOrder || 0 
//       });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0 });
//     }
//     setIsCategoryOpen(true);
//   };

//   const handleCategorySubmit = async () => {
//     if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
//     let success = false;
//     if (editingCategory?._id) { 
//       success = await updateExpenseCategory(editingCategory._id, categoryForm);
//     } else {
//       success = await createExpenseCategory(categoryForm);
//     }

//     if (success) setIsCategoryOpen(false);
//   };

//   const handleDeleteCategory = async (id) => {
//     if (!id) return;
//     if (window.confirm("Are you sure you want to deactivate this category?")) {
//       await deleteExpenseCategory(id);
//     }
//   };

//   const handleActivateCategory = async (category) => {
//     if (window.confirm("Are you sure you want to activate this category?")) {
//       await updateExpenseCategory(category._id, { ...category, isActive: true });
//     }
//   };

//   // ==================== HELPERS ====================
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Paid": return "outline"; 
//       case "Rejected": return "destructive";
//       default: return "secondary"; 
//     }
//   };

//   const renderDynamicIcon = (iconName, className) => {
//     const DynamicIcon = LucideIcons[iconName];
//     if (!DynamicIcon) return <LucideIcons.Tag className={className} />;
//     return <DynamicIcon className={className} />;
//   };

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="tickets" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
//           <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
//         </TabsList>

//         {/* ==================== 1. TICKETS SECTION ==================== */}
//         <TabsContent value="tickets" className="space-y-4 m-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//               <Tabs value={ticketTab} onValueChange={setTicketTab}>
//                 <TabsList>
//                   <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//                   <TabsTrigger value="Approved">Approved</TabsTrigger>
//                   <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//                   <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//             <div className="relative w-full sm:w-64 shrink-0">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : allExpenses?.length === 0 ? (
//                   <TableRow><TableCell colSpan={6} className="text-center py-8">No tickets found.</TableCell></TableRow>
//                 ) : (
//                   allExpenses?.map((expense) => (
//                     <TableRow key={expense?._id}>
//                       <TableCell>{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.employeeId?.name}</div>
//                         <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.title}</div>
//                         {/* UPDATE 1: Category aur Project dono dikhane ke liye yahan flex wrap add kiya hai */}
//                         <div className="flex flex-wrap items-center gap-2 mt-1">
//                           <Badge variant="outline" className="font-normal text-[10px] flex items-center w-fit gap-1">
//                             {expense?.categoryId?.icon && renderDynamicIcon(expense.categoryId.icon, "h-3 w-3")}
//                             {expense?.categoryId?.name || "N/A"}
//                           </Badge>
                          
//                           {/* Yahan se Project Name render hoga */}
//                           {expense?.projectId?.name && (
//                             <Badge variant="secondary" className="font-normal text-[10px] bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
//                               Project: {expense.projectId.name}
//                             </Badge>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell className="font-bold">₹{expense?.amount}</TableCell>
//                       <TableCell>
//                         <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
//                           {ticketTab === "Pending" && (
//                             <>
//                               <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* ==================== 2. CATEGORIES SECTION ==================== */}
//         <TabsContent value="categories" className="space-y-4 m-0">
//           <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
//             <div>
//               <h3 className="text-lg font-semibold">Expense Categories</h3>
//               <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
//             </div>
//             <Button onClick={() => openCategoryModal()} className="gap-2">
//               <Plus className="h-4 w-4"/> Add Category
//             </Button>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Color/Icon</TableHead>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseCategories?.map((cat) => (
//                   <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
//                     <TableCell>
//                       <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: cat?.color || '#3b82f6' }}>
//                         {renderDynamicIcon(cat?.icon, "h-4 w-4")}
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">{cat?.name}</TableCell>
//                     <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
//                     <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
                      
//                       {cat?.isActive ? (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-destructive hover:text-destructive" 
//                           onClick={() => handleDeleteCategory(cat?._id)}
//                         >
//                           Disable
//                         </Button>
//                       ) : (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-emerald-600 hover:text-emerald-700" 
//                           onClick={() => handleActivateCategory(cat)}
//                         >
//                           Activate
//                         </Button>
//                       )}
                      
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* ==================== MODALS ==================== */}
      
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//              <div className="py-4 space-y-4">
//                <p className="text-sm text-muted-foreground">
//                  Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
//                </p>
//                <div>
//                  <Label>Remarks (Optional)</Label>
//                  <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//                </div>
//              </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="py-4">
//               <Label>Reason <span className="text-destructive">*</span></Label>
//               <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="space-y-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
//                   <div className="mt-2"><Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge></div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
//                 </div>
//               </div>
//               <Separator />
              
//               {/* UPDATE 2: md:grid-cols-2 ko md:grid-cols-3 kiya gaya hai aur Project ka block add kiya hai */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                 </div>
                
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
//                   <div className="font-medium text-base flex items-center gap-2 mt-1">
//                     <Badge variant="outline" style={{ borderColor: selectedExpense.categoryId?.color, color: selectedExpense.categoryId?.color }}>
//                       {selectedExpense.categoryId?.icon && renderDynamicIcon(selectedExpense.categoryId.icon, "h-3 w-3 mr-1")}
//                       {selectedExpense.categoryId?.name || "N/A"}
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Yahan se Modal ke andar Project block render hoga */}
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Hash className="h-4 w-4" /> Project</Label>
//                   <div className="font-medium text-base mt-1">
//                     {selectedExpense?.projectId?.name ? (
//                       <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 text-sm">
//                         {selectedExpense.projectId.name}
//                       </span>
//                     ) : (
//                       <span className="text-muted-foreground text-sm">N/A</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Separator />
//               <div className="space-y-4">
//                 <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
//                 <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
//               </div>
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
//                       <FileText className="h-4 w-4" /> View Document
//                     </a>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//           <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Lucide Category Modal with Search */}
//       <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-2 max-h-[75vh] overflow-y-auto px-2">
            
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Name <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. Travel" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Code <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. TRV" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
//             </div>
            
//             <div className="col-span-2">
//               <Label>Description</Label>
//               <Input placeholder="Short description of this expense type..." value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
//             </div>

//             {/* COLOR PALETTE */}
//             <div className="col-span-2">
//               <div className="flex items-center justify-between mb-2">
//                 <Label>Select Theme Color</Label>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-muted-foreground">Custom:</span>
//                   <input type="color" className="h-6 w-8 cursor-pointer rounded-sm" value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-md">
//                 {PREDEFINED_COLORS.map(color => {
//                   const isSelected = categoryForm.color?.toLowerCase() === color.toLowerCase();
//                   return (
//                     <div 
//                       key={color}
//                       onClick={() => setCategoryForm({...categoryForm, color})}
//                       className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
//                       style={{ backgroundColor: color }}
//                     >
//                       {isSelected && <CheckCircle className="h-4 w-4 text-white opacity-80" />}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* SEARCHABLE LUCIDE ICON GRID */}
//             <div className="col-span-2 space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Select Icon ({filteredIcons.length} available)</Label>
//                 <div className="relative w-48">
//                   <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search icon..." 
//                     className="h-8 pl-8 text-xs" 
//                     value={iconSearch} 
//                     onChange={(e) => setIconSearch(e.target.value)} 
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-muted/30 border rounded-md max-h-48 overflow-y-auto">
//                 {filteredIcons.length === 0 ? (
//                   <div className="col-span-full text-center py-6 text-sm text-muted-foreground">
//                     No icons found matching "{iconSearch}"
//                   </div>
//                 ) : (
//                   filteredIcons.map(iconName => {
//                     const IconComponent = LucideIcons[iconName];
//                     if (!IconComponent) return null;

//                     const isSelected = categoryForm.icon === iconName;
//                     return (
//                       <div
//                         key={iconName}
//                         onClick={() => setCategoryForm({...categoryForm, icon: iconName})}
//                         className={`aspect-square flex items-center justify-center rounded-md cursor-pointer border transition-all hover:bg-muted ${isSelected ? 'bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/20' : 'bg-background border-transparent text-muted-foreground'}`}
//                         title={iconName}
//                       >
//                         <IconComponent className="h-5 w-5" />
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//           </div>
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
//             <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }









// import React, { useEffect, useState, useMemo } from "react";
// import * as LucideIcons from "lucide-react"; 
// import { 
//   CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
//   Settings, Plus 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import { useHR } from "@/hooks/useHR"; 

// // ==================== PREDEFINED UX DATA ====================
// const PREDEFINED_COLORS = [
//   "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", 
//   "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
//   "#f43f5e", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669", 
//   "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", 
//   "#db2777", "#e11d48", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"
// ];

// // Pure Lucide Icons for Categories
// const PREDEFINED_ICONS = [
//   "Car", "Bus", "Train", "Plane", "Bike", "Truck", "Ship", "Fuel", "Compass", "MapPin", "Navigation", "Route", "Ticket",
//   "Utensils", "Coffee", "Pizza", "Soup", "CupSoda", "Wine", "Beer", "Cake", "Apple", "Cookie",
//   "Building", "Hotel", "Home", "Warehouse", "Factory", "Store", "Tent", "Bed", "DoorOpen",
//   "Laptop", "Smartphone", "Tablet", "Monitor", "Printer", "Server", "Cpu", "HardDrive", "Wifi", "Bluetooth", "Plug", "BatteryCharging", "Zap",
//   "Wrench", "Hammer", "Screwdriver", "Tool", "Lightbulb", "Headset", "Camera", "Video", "Mic", "Speaker", "Tv",
//   "Banknote", "Coins", "CreditCard", "Receipt", "Wallet", "PiggyBank", "Calculator", "ShoppingCart", "ShoppingBag", "Percent", "TrendingUp",
//   "Stethoscope", "Pill", "Syringe", "Activity", "HeartPulse", "FirstAidKit", "Cross",
//   "Tag", "Tags", "Box", "Boxes", "Package", "Gift", "Bookmark", "Calendar", "Clock", "Hourglass", "AlarmClock",
//   "Briefcase", "Folder", "FolderOpen", "FileText", "Clipboard", "Mail", "Send", "Inbox", "Archive",
//   "Star", "Shield", "Key", "Lock", "Unlock", "Search", "Bell", "Flag", "BookmarkCheck",
//   "Users", "User", "UserCheck", "UserPlus", "GraduationCap", "BookOpen", "Award", "Trophy", "Crown", "Medal",
//   "Sun", "Moon", "Cloud", "CloudRain", "Snowflake", "Wind", "Flame", "Droplets", "Leaf", "TreePine"
// ];

// export function HRExpenseTab() {
//   const {
//     loading,
//     allExpenses,
//     fetchAllExpenses,
//     approveExpense,
//     rejectExpense,
//     expenseCategories,
//     fetchExpenseCategories,
//     createExpenseCategory,
//     updateExpenseCategory,
//     deleteExpenseCategory
//   } = useHR();

//   // ==================== TICKET STATE ====================
//   const [ticketTab, setTicketTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   // ==================== CATEGORY STATE ====================
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [iconSearch, setIconSearch] = useState(""); 
//   const [categoryForm, setCategoryForm] = useState({
//     name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0
//   });

//   // Filter Lucide icons based on search
//   const filteredIcons = useMemo(() => {
//     if (!iconSearch.trim()) return PREDEFINED_ICONS;
//     return PREDEFINED_ICONS.filter(iconName => 
//       iconName.toLowerCase().includes(iconSearch.toLowerCase())
//     );
//   }, [iconSearch]);

//   // ==================== EFFECTS ====================
  
//   // Fetch Categories once on mount
//   useEffect(() => {
//     fetchExpenseCategories();
//   }, [fetchExpenseCategories]);

//   // Debounced Ticket Search
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchAllExpenses({ status: ticketTab, search: searchTerm, page: 1, limit: 10 });
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [ticketTab, searchTerm, fetchAllExpenses]);

//   // ==================== TICKET HANDLERS ====================
//   const handleApprove = async () => {
//     if (!selectedExpense?._id) return; 
//     const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
//     if (success) setIsApproveOpen(false);
//   };

//   const handleReject = async () => {
//     if (!selectedExpense?._id) return; 
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
//     if (success) setIsRejectOpen(false);
//   };

//   const openTicketModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // ==================== CATEGORY HANDLERS ====================
//   const openCategoryModal = (category = null) => {
//     setIconSearch(""); 
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ 
//         name: category.name || "", 
//         code: category.code || "", 
//         description: category.description || "", 
//         color: category.color || "#3b82f6", 
//         icon: category.icon || "Tag", 
//         sortOrder: category.sortOrder || 0 
//       });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0 });
//     }
//     setIsCategoryOpen(true);
//   };

//   const handleCategorySubmit = async () => {
//     if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
//     let success = false;
//     if (editingCategory?._id) { 
//       success = await updateExpenseCategory(editingCategory._id, categoryForm);
//     } else {
//       success = await createExpenseCategory(categoryForm);
//     }

//     if (success) setIsCategoryOpen(false);
//   };

//   const handleDeleteCategory = async (id) => {
//     if (!id) return;
//     if (window.confirm("Are you sure you want to deactivate this category?")) {
//       await deleteExpenseCategory(id);
//     }
//   };

//   const handleActivateCategory = async (category) => {
//     if (window.confirm("Are you sure you want to activate this category?")) {
//       await updateExpenseCategory(category._id, { ...category, isActive: true });
//     }
//   };

//   // ==================== HELPERS ====================
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Paid": return "outline"; 
//       case "Rejected": return "destructive";
//       default: return "secondary"; 
//     }
//   };

//   const renderDynamicIcon = (iconName, className) => {
//     const DynamicIcon = LucideIcons[iconName];
//     if (!DynamicIcon) return <LucideIcons.Tag className={className} />;
//     return <DynamicIcon className={className} />;
//   };

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="tickets" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
//           <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
//         </TabsList>

//         {/* ==================== 1. TICKETS SECTION ==================== */}
//         <TabsContent value="tickets" className="space-y-4 m-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//               <Tabs value={ticketTab} onValueChange={setTicketTab}>
//                 <TabsList>
//                   <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//                   <TabsTrigger value="Approved">Approved</TabsTrigger>
//                   <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//                   <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//             <div className="relative w-full sm:w-64 shrink-0">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Project</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : allExpenses?.length === 0 ? (
//                   <TableRow><TableCell colSpan={7} className="text-center py-8">No tickets found.</TableCell></TableRow>
//                 ) : (
//                   allExpenses?.map((expense) => (
//                     <TableRow key={expense?._id}>
//                       <TableCell>{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.employeeId?.name}</div>
//                         <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
//                       </TableCell>
                      
//                       {/* Project Name ka Naya Column */}
//                       <TableCell>
//                         {expense?.projectId?.name ? (
//                           <Badge variant="secondary" className="font-normal text-xs bg-muted">
//                             {expense.projectId.name}
//                           </Badge>
//                         ) : (
//                           <span className="text-xs text-muted-foreground">N/A</span>
//                         )}
//                       </TableCell>

//                       {/* Purana Title & Category Column */}
//                       <TableCell>
//                         <div className="font-medium">{expense?.title}</div>
//                         <Badge variant="outline" className="mt-1 font-normal text-[10px] flex items-center w-fit gap-1">
//                           {expense?.categoryId?.icon && renderDynamicIcon(expense.categoryId.icon, "h-3 w-3")}
//                           {expense?.categoryId?.name || "N/A"}
//                         </Badge>
//                       </TableCell>

//                       <TableCell className="font-bold">₹{expense?.amount}</TableCell>
//                       <TableCell>
//                         <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
//                           {ticketTab === "Pending" && (
//                             <>
//                               <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* ==================== 2. CATEGORIES SECTION ==================== */}
//         <TabsContent value="categories" className="space-y-4 m-0">
//           <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
//             <div>
//               <h3 className="text-lg font-semibold">Expense Categories</h3>
//               <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
//             </div>
//             <Button onClick={() => openCategoryModal()} className="gap-2">
//               <Plus className="h-4 w-4"/> Add Category
//             </Button>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Color/Icon</TableHead>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseCategories?.map((cat) => (
//                   <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
//                     <TableCell>
//                       <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: cat?.color || '#3b82f6' }}>
//                         {renderDynamicIcon(cat?.icon, "h-4 w-4")}
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">{cat?.name}</TableCell>
//                     <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
//                     <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
                      
//                       {cat?.isActive ? (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-destructive hover:text-destructive" 
//                           onClick={() => handleDeleteCategory(cat?._id)}
//                         >
//                           Disable
//                         </Button>
//                       ) : (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-emerald-600 hover:text-emerald-700" 
//                           onClick={() => handleActivateCategory(cat)}
//                         >
//                           Activate
//                         </Button>
//                       )}
                      
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* ==================== MODALS ==================== */}
      
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//              <div className="py-4 space-y-4">
//                <p className="text-sm text-muted-foreground">
//                  Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
//                </p>
//                <div>
//                  <Label>Remarks (Optional)</Label>
//                  <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//                </div>
//              </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="py-4">
//               <Label>Reason <span className="text-destructive">*</span></Label>
//               <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="space-y-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
//                   <div className="mt-2"><Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge></div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
//                 </div>
//               </div>
//               <Separator />
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                 </div>
                
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
//                   <div className="font-medium text-base flex items-center gap-2 mt-1">
//                     <Badge variant="outline" style={{ borderColor: selectedExpense.categoryId?.color, color: selectedExpense.categoryId?.color }}>
//                       {selectedExpense.categoryId?.icon && renderDynamicIcon(selectedExpense.categoryId.icon, "h-3 w-3 mr-1")}
//                       {selectedExpense.categoryId?.name || "N/A"}
//                     </Badge>
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Hash className="h-4 w-4" /> Project</Label>
//                   <div className="font-medium text-base mt-1">
//                     {selectedExpense?.projectId?.name ? (
//                       <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 text-sm">
//                         {selectedExpense.projectId.name}
//                       </span>
//                     ) : (
//                       <span className="text-muted-foreground text-sm">N/A</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Separator />
//               <div className="space-y-4">
//                 <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
//                 <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
//               </div>
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
//                       <FileText className="h-4 w-4" /> View Document
//                     </a>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//           <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Lucide Category Modal with Search */}
//       <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-2 max-h-[75vh] overflow-y-auto px-2">
            
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Name <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. Travel" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Code <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. TRV" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
//             </div>
            
//             <div className="col-span-2">
//               <Label>Description</Label>
//               <Input placeholder="Short description of this expense type..." value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
//             </div>

//             {/* COLOR PALETTE */}
//             <div className="col-span-2">
//               <div className="flex items-center justify-between mb-2">
//                 <Label>Select Theme Color</Label>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-muted-foreground">Custom:</span>
//                   <input type="color" className="h-6 w-8 cursor-pointer rounded-sm" value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-md">
//                 {PREDEFINED_COLORS.map(color => {
//                   const isSelected = categoryForm.color?.toLowerCase() === color.toLowerCase();
//                   return (
//                     <div 
//                       key={color}
//                       onClick={() => setCategoryForm({...categoryForm, color})}
//                       className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
//                       style={{ backgroundColor: color }}
//                     >
//                       {isSelected && <CheckCircle className="h-4 w-4 text-white opacity-80" />}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* SEARCHABLE LUCIDE ICON GRID */}
//             <div className="col-span-2 space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Select Icon ({filteredIcons.length} available)</Label>
//                 <div className="relative w-48">
//                   <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search icon..." 
//                     className="h-8 pl-8 text-xs" 
//                     value={iconSearch} 
//                     onChange={(e) => setIconSearch(e.target.value)} 
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-muted/30 border rounded-md max-h-48 overflow-y-auto">
//                 {filteredIcons.length === 0 ? (
//                   <div className="col-span-full text-center py-6 text-sm text-muted-foreground">
//                     No icons found matching "{iconSearch}"
//                   </div>
//                 ) : (
//                   filteredIcons.map(iconName => {
//                     const IconComponent = LucideIcons[iconName];
//                     if (!IconComponent) return null;

//                     const isSelected = categoryForm.icon === iconName;
//                     return (
//                       <div
//                         key={iconName}
//                         onClick={() => setCategoryForm({...categoryForm, icon: iconName})}
//                         className={`aspect-square flex items-center justify-center rounded-md cursor-pointer border transition-all hover:bg-muted ${isSelected ? 'bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/20' : 'bg-background border-transparent text-muted-foreground'}`}
//                         title={iconName}
//                       >
//                         <IconComponent className="h-5 w-5" />
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//           </div>
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
//             <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }









// import React, { useEffect, useState, useMemo } from "react";
// import * as LucideIcons from "lucide-react"; 
// import { 
//   CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
//   Settings, Plus, DollarSign 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import { useHR } from "@/hooks/useHR"; 

// // ==================== PREDEFINED UX DATA ====================
// const PREDEFINED_COLORS = [
//   "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", 
//   "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
//   "#f43f5e", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669", 
//   "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", 
//   "#db2777", "#e11d48", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"
// ];

// // Pure Lucide Icons for Categories
// const PREDEFINED_ICONS = [
//   "Car", "Bus", "Train", "Plane", "Bike", "Truck", "Ship", "Fuel", "Compass", "MapPin", "Navigation", "Route", "Ticket",
//   "Utensils", "Coffee", "Pizza", "Soup", "CupSoda", "Wine", "Beer", "Cake", "Apple", "Cookie",
//   "Building", "Hotel", "Home", "Warehouse", "Factory", "Store", "Tent", "Bed", "DoorOpen",
//   "Laptop", "Smartphone", "Tablet", "Monitor", "Printer", "Server", "Cpu", "HardDrive", "Wifi", "Bluetooth", "Plug", "BatteryCharging", "Zap",
//   "Wrench", "Hammer", "Screwdriver", "Tool", "Lightbulb", "Headset", "Camera", "Video", "Mic", "Speaker", "Tv",
//   "Banknote", "Coins", "CreditCard", "Receipt", "Wallet", "PiggyBank", "Calculator", "ShoppingCart", "ShoppingBag", "Percent", "TrendingUp",
//   "Stethoscope", "Pill", "Syringe", "Activity", "HeartPulse", "FirstAidKit", "Cross",
//   "Tag", "Tags", "Box", "Boxes", "Package", "Gift", "Bookmark", "Calendar", "Clock", "Hourglass", "AlarmClock",
//   "Briefcase", "Folder", "FolderOpen", "FileText", "Clipboard", "Mail", "Send", "Inbox", "Archive",
//   "Star", "Shield", "Key", "Lock", "Unlock", "Search", "Bell", "Flag", "BookmarkCheck",
//   "Users", "User", "UserCheck", "UserPlus", "GraduationCap", "BookOpen", "Award", "Trophy", "Crown", "Medal",
//   "Sun", "Moon", "Cloud", "CloudRain", "Snowflake", "Wind", "Flame", "Droplets", "Leaf", "TreePine"
// ];

// export function HRExpenseTab() {
//   const {
//     loading,
//     allExpenses,
//     fetchAllExpenses,
//     approveExpense,
//     rejectExpense,
//     expenseCategories,
//     fetchExpenseCategories,
//     createExpenseCategory,
//     updateExpenseCategory,
//     deleteExpenseCategory
//   } = useHR();

//   // ==================== TICKET STATE ====================
//   const [ticketTab, setTicketTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   // ==================== CATEGORY STATE ====================
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [iconSearch, setIconSearch] = useState(""); 
//   const [categoryForm, setCategoryForm] = useState({
//     name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0
//   });

//   // Filter Lucide icons based on search
//   const filteredIcons = useMemo(() => {
//     if (!iconSearch.trim()) return PREDEFINED_ICONS;
//     return PREDEFINED_ICONS.filter(iconName => 
//       iconName.toLowerCase().includes(iconSearch.toLowerCase())
//     );
//   }, [iconSearch]);

//   // ==================== EFFECTS ====================
  
//   // Fetch Categories once on mount
//   useEffect(() => {
//     fetchExpenseCategories();
//   }, [fetchExpenseCategories]);

//   // Debounced Ticket Search
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       fetchAllExpenses({ status: ticketTab, search: searchTerm, page: 1, limit: 10 });
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [ticketTab, searchTerm, fetchAllExpenses]);

//   // ==================== TICKET HANDLERS ====================
//   const handleApprove = async () => {
//     if (!selectedExpense?._id) return; 
//     const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
//     if (success) setIsApproveOpen(false);
//   };

//   const handleReject = async () => {
//     if (!selectedExpense?._id) return; 
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
//     if (success) setIsRejectOpen(false);
//   };

//   const openTicketModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // ==================== CATEGORY HANDLERS ====================
//   const openCategoryModal = (category = null) => {
//     setIconSearch(""); 
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ 
//         name: category.name || "", 
//         code: category.code || "", 
//         description: category.description || "", 
//         color: category.color || "#3b82f6", 
//         icon: category.icon || "Tag", 
//         sortOrder: category.sortOrder || 0 
//       });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0 });
//     }
//     setIsCategoryOpen(true);
//   };

//   const handleCategorySubmit = async () => {
//     if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
//     let success = false;
//     if (editingCategory?._id) { 
//       success = await updateExpenseCategory(editingCategory._id, categoryForm);
//     } else {
//       success = await createExpenseCategory(categoryForm);
//     }

//     if (success) setIsCategoryOpen(false);
//   };

//   const handleDeleteCategory = async (id) => {
//     if (!id) return;
//     if (window.confirm("Are you sure you want to deactivate this category?")) {
//       await deleteExpenseCategory(id);
//     }
//   };

//   const handleActivateCategory = async (category) => {
//     if (window.confirm("Are you sure you want to activate this category?")) {
//       await updateExpenseCategory(category._id, { ...category, isActive: true });
//     }
//   };

//   // ==================== HELPERS ====================
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Paid": return "outline"; 
//       case "Rejected": return "destructive";
//       default: return "secondary"; 
//     }
//   };

//   const renderDynamicIcon = (iconName, className) => {
//     const DynamicIcon = LucideIcons[iconName];
//     if (!DynamicIcon) return <LucideIcons.Tag className={className} />;
//     return <DynamicIcon className={className} />;
//   };

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="tickets" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
//           <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
//         </TabsList>

//         {/* ==================== 1. TICKETS SECTION ==================== */}
//         <TabsContent value="tickets" className="space-y-4 m-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//               <Tabs value={ticketTab} onValueChange={setTicketTab}>
//                 <TabsList>
//                   <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//                   <TabsTrigger value="Approved">Approved</TabsTrigger>
//                   <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//                   <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//             <div className="relative w-full sm:w-64 shrink-0">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Project</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : allExpenses?.length === 0 ? (
//                   <TableRow><TableCell colSpan={7} className="text-center py-8">No tickets found.</TableCell></TableRow>
//                 ) : (
//                   allExpenses?.map((expense) => (
//                     <TableRow key={expense?._id}>
//                       <TableCell>{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.employeeId?.name}</div>
//                         {/* New Employee ID in Table */}
//                         {expense?.employeeId?.employeeId && (
//                           <div className="text-[10px] font-semibold text-primary">
//                             ID: {expense.employeeId.employeeId}
//                           </div>
//                         )}
//                         <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
//                       </TableCell>
                      
//                       <TableCell>
//                         {expense?.projectId?.name ? (
//                           <Badge variant="secondary" className="font-normal text-xs bg-muted">
//                             {expense.projectId.name}
//                           </Badge>
//                         ) : (
//                           <span className="text-xs text-muted-foreground">N/A</span>
//                         )}
//                       </TableCell>

//                       <TableCell>
//                         <div className="font-medium">{expense?.title}</div>
//                         <Badge variant="outline" className="mt-1 font-normal text-[10px] flex items-center w-fit gap-1">
//                           {expense?.categoryId?.icon && renderDynamicIcon(expense.categoryId.icon, "h-3 w-3")}
//                           {expense?.categoryId?.name || "N/A"}
//                         </Badge>
//                       </TableCell>

//                       <TableCell>
//                         <div className="font-bold">₹{expense?.amount}</div>
//                         {/* New Pending Amount in Table */}
//                         {expense?.paymentPendingAmount > 0 && expense?.paymentPendingAmount !== expense?.amount && (
//                           <div className="text-[10px] text-destructive mt-1">
//                             Pending: ₹{expense.paymentPendingAmount}
//                           </div>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
//                           {ticketTab === "Pending" && (
//                             <>
//                               <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* ==================== 2. CATEGORIES SECTION ==================== */}
//         <TabsContent value="categories" className="space-y-4 m-0">
//           <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
//             <div>
//               <h3 className="text-lg font-semibold">Expense Categories</h3>
//               <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
//             </div>
//             <Button onClick={() => openCategoryModal()} className="gap-2">
//               <Plus className="h-4 w-4"/> Add Category
//             </Button>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Color/Icon</TableHead>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseCategories?.map((cat) => (
//                   <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
//                     <TableCell>
//                       <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: cat?.color || '#3b82f6' }}>
//                         {renderDynamicIcon(cat?.icon, "h-4 w-4")}
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">{cat?.name}</TableCell>
//                     <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
//                     <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
                      
//                       {cat?.isActive ? (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-destructive hover:text-destructive" 
//                           onClick={() => handleDeleteCategory(cat?._id)}
//                         >
//                           Disable
//                         </Button>
//                       ) : (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-emerald-600 hover:text-emerald-700" 
//                           onClick={() => handleActivateCategory(cat)}
//                         >
//                           Activate
//                         </Button>
//                       )}
                      
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* ==================== MODALS ==================== */}
      
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//              <div className="py-4 space-y-4">
//                <p className="text-sm text-muted-foreground">
//                  Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
//                </p>
//                <div>
//                  <Label>Remarks (Optional)</Label>
//                  <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//                </div>
//              </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="py-4">
//               <Label>Reason <span className="text-destructive">*</span></Label>
//               <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="space-y-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
//                   <div className="mt-2"><Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge></div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
//                 </div>
//               </div>
//               <Separator />
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
//                   {/* New Employee ID in Modal */}
//                   {selectedExpense.employeeId?.employeeId && (
//                     <div className="text-xs font-semibold bg-secondary/50 inline-block px-2 py-1 rounded-md mb-1 mt-1">
//                       EMP ID: {selectedExpense.employeeId.employeeId}
//                     </div>
//                   )}
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                 </div>
                
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
//                   <div className="font-medium text-base flex items-center gap-2 mt-1">
//                     <Badge variant="outline" style={{ borderColor: selectedExpense.categoryId?.color, color: selectedExpense.categoryId?.color }}>
//                       {selectedExpense.categoryId?.icon && renderDynamicIcon(selectedExpense.categoryId.icon, "h-3 w-3 mr-1")}
//                       {selectedExpense.categoryId?.name || "N/A"}
//                     </Badge>
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Hash className="h-4 w-4" /> Project</Label>
//                   <div className="font-medium text-base mt-1">
//                     {selectedExpense?.projectId?.name ? (
//                       <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 text-sm">
//                         {selectedExpense.projectId.name}
//                       </span>
//                     ) : (
//                       <span className="text-muted-foreground text-sm">N/A</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Separator />
//               <div className="space-y-4">
//                 <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
//                 <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
//               </div>
              
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
//                       <FileText className="h-4 w-4" /> View Document
//                     </a>
//                   </div>
//                 </>
//               )}

//               {/* NEW: Financial Breakdown Section */}
//               <Separator />
//               <div className="space-y-3">
//                 <Label className="text-muted-foreground flex items-center gap-2">
//                   <DollarSign className="h-4 w-4" /> Financial Breakdown
//                 </Label>
                
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
//                   <div>
//                     <div className="text-xs text-muted-foreground">Total Amount</div>
//                     <div className="font-semibold text-primary">₹{selectedExpense.amount || 0}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-muted-foreground">Pending Amount</div>
//                     <div className={`font-semibold ${selectedExpense.paymentPendingAmount > 0 ? 'text-destructive' : 'text-success'}`}>
//                       ₹{selectedExpense.paymentPendingAmount || 0}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-muted-foreground">Wallet Used</div>
//                     <div className="font-medium">₹{selectedExpense.walletUsed || 0}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-muted-foreground">Cash Amount</div>
//                     <div className="font-medium">₹{selectedExpense.cashAmount || 0}</div>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-4 mt-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-muted-foreground">Payment Status:</span>
//                     <Badge variant="outline" className={selectedExpense.paymentStatus === 'Paid' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
//                       {selectedExpense.paymentStatus || 'Pending'}
//                     </Badge>
//                   </div>
                  
//                   {selectedExpense.walletTransactionId && (
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-muted-foreground">Wallet Txn ID:</span>
//                       <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded border">
//                         {selectedExpense.walletTransactionId}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//             </div>
//           )}
//           <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Lucide Category Modal with Search */}
//       <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-2 max-h-[75vh] overflow-y-auto px-2">
            
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Name <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. Travel" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Code <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. TRV" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
//             </div>
            
//             <div className="col-span-2">
//               <Label>Description</Label>
//               <Input placeholder="Short description of this expense type..." value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
//             </div>

//             {/* COLOR PALETTE */}
//             <div className="col-span-2">
//               <div className="flex items-center justify-between mb-2">
//                 <Label>Select Theme Color</Label>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-muted-foreground">Custom:</span>
//                   <input type="color" className="h-6 w-8 cursor-pointer rounded-sm" value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-md">
//                 {PREDEFINED_COLORS.map(color => {
//                   const isSelected = categoryForm.color?.toLowerCase() === color.toLowerCase();
//                   return (
//                     <div 
//                       key={color}
//                       onClick={() => setCategoryForm({...categoryForm, color})}
//                       className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
//                       style={{ backgroundColor: color }}
//                     >
//                       {isSelected && <CheckCircle className="h-4 w-4 text-white opacity-80" />}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* SEARCHABLE LUCIDE ICON GRID */}
//             <div className="col-span-2 space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Select Icon ({filteredIcons.length} available)</Label>
//                 <div className="relative w-48">
//                   <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search icon..." 
//                     className="h-8 pl-8 text-xs" 
//                     value={iconSearch} 
//                     onChange={(e) => setIconSearch(e.target.value)} 
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-muted/30 border rounded-md max-h-48 overflow-y-auto">
//                 {filteredIcons.length === 0 ? (
//                   <div className="col-span-full text-center py-6 text-sm text-muted-foreground">
//                     No icons found matching "{iconSearch}"
//                   </div>
//                 ) : (
//                   filteredIcons.map(iconName => {
//                     const IconComponent = LucideIcons[iconName];
//                     if (!IconComponent) return null;

//                     const isSelected = categoryForm.icon === iconName;
//                     return (
//                       <div
//                         key={iconName}
//                         onClick={() => setCategoryForm({...categoryForm, icon: iconName})}
//                         className={`aspect-square flex items-center justify-center rounded-md cursor-pointer border transition-all hover:bg-muted ${isSelected ? 'bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/20' : 'bg-background border-transparent text-muted-foreground'}`}
//                         title={iconName}
//                       >
//                         <IconComponent className="h-5 w-5" />
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//           </div>
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
//             <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }












// import React, { useEffect, useState, useMemo } from "react";
// import * as LucideIcons from "lucide-react"; 
// import { 
//   CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
//   Settings, Plus, DollarSign, History
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Separator } from "@/components/ui/separator";
// import { toast } from "sonner";
// import { useHR } from "@/hooks/useHR"; 

// // ==================== PREDEFINED UX DATA ====================
// const PREDEFINED_COLORS = [
//   "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", 
//   "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
//   "#f43f5e", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669", 
//   "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", 
//   "#db2777", "#e11d48", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"
// ];

// // Pure Lucide Icons for Categories
// const PREDEFINED_ICONS = [
//   "Car", "Bus", "Train", "Plane", "Bike", "Truck", "Ship", "Fuel", "Compass", "MapPin", "Navigation", "Route", "Ticket",
//   "Utensils", "Coffee", "Pizza", "Soup", "CupSoda", "Wine", "Beer", "Cake", "Apple", "Cookie",
//   "Building", "Hotel", "Home", "Warehouse", "Factory", "Store", "Tent", "Bed", "DoorOpen",
//   "Laptop", "Smartphone", "Tablet", "Monitor", "Printer", "Server", "Cpu", "HardDrive", "Wifi", "Bluetooth", "Plug", "BatteryCharging", "Zap",
//   "Wrench", "Hammer", "Screwdriver", "Tool", "Lightbulb", "Headset", "Camera", "Video", "Mic", "Speaker", "Tv",
//   "Banknote", "Coins", "CreditCard", "Receipt", "Wallet", "PiggyBank", "Calculator", "ShoppingCart", "ShoppingBag", "Percent", "TrendingUp",
//   "Stethoscope", "Pill", "Syringe", "Activity", "HeartPulse", "FirstAidKit", "Cross",
//   "Tag", "Tags", "Box", "Boxes", "Package", "Gift", "Bookmark", "Calendar", "Clock", "Hourglass", "AlarmClock",
//   "Briefcase", "Folder", "FolderOpen", "FileText", "Clipboard", "Mail", "Send", "Inbox", "Archive",
//   "Star", "Shield", "Key", "Lock", "Unlock", "Search", "Bell", "Flag", "BookmarkCheck",
//   "Users", "User", "UserCheck", "UserPlus", "GraduationCap", "BookOpen", "Award", "Trophy", "Crown", "Medal",
//   "Sun", "Moon", "Cloud", "CloudRain", "Snowflake", "Wind", "Flame", "Droplets", "Leaf", "TreePine"
// ];

// export function HRExpenseTab() {
//   const {
//     loading,
//     allExpenses,
//     fetchAllExpenses,
//     approveExpense,
//     rejectExpense,
//     expenseCategories,
//     fetchExpenseCategories,
//     createExpenseCategory,
//     updateExpenseCategory,
//     deleteExpenseCategory
//   } = useHR();

//   // ==================== TICKET STATE ====================
//   const [ticketTab, setTicketTab] = useState("Pending");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [isApproveOpen, setIsApproveOpen] = useState(false);
//   const [isRejectOpen, setIsRejectOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [approveRemarks, setApproveRemarks] = useState("");
//   const [rejectReason, setRejectReason] = useState("");

//   // ==================== CATEGORY STATE ====================
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [iconSearch, setIconSearch] = useState(""); 
//   const [categoryForm, setCategoryForm] = useState({
//     name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0
//   });

//   // Filter Lucide icons based on search
//   const filteredIcons = useMemo(() => {
//     if (!iconSearch.trim()) return PREDEFINED_ICONS;
//     return PREDEFINED_ICONS.filter(iconName => 
//       iconName.toLowerCase().includes(iconSearch.toLowerCase())
//     );
//   }, [iconSearch]);

//   // ==================== EFFECTS ====================
  
//   // Fetch Categories once on mount
//   useEffect(() => {
//     fetchExpenseCategories();
//   }, [fetchExpenseCategories]);

//   // Debounced Ticket Search
//   useEffect(() => {
//     const debounce = setTimeout(() => {
//       const params = {
//         search: searchTerm,
//         page: 1,
//         limit: 10,
//       };

//       if (ticketTab === "Paid") {
//         params.paymentStatus = "Paid";
//       } else {
//         params.status = ticketTab;
//       }

//       fetchAllExpenses(params);
//     }, 500);
//     return () => clearTimeout(debounce);
//   }, [ticketTab, searchTerm, fetchAllExpenses]);

//   // ==================== TICKET HANDLERS ====================
//   const handleApprove = async () => {
//     if (!selectedExpense?._id) return; 
//     const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
//     if (success) setIsApproveOpen(false);
//   };

//   const handleReject = async () => {
//     if (!selectedExpense?._id) return; 
//     if (!rejectReason.trim()) return toast.error("Reason is required!");
//     const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
//     if (success) setIsRejectOpen(false);
//   };

//   const openTicketModal = (expense, type) => {
//     setSelectedExpense(expense);
//     if (type === 'view') setIsViewOpen(true);
//     if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
//     if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
//   };

//   // ==================== CATEGORY HANDLERS ====================
//   const openCategoryModal = (category = null) => {
//     setIconSearch(""); 
//     if (category) {
//       setEditingCategory(category);
//       setCategoryForm({ 
//         name: category.name || "", 
//         code: category.code || "", 
//         description: category.description || "", 
//         color: category.color || "#3b82f6", 
//         icon: category.icon || "Tag", 
//         sortOrder: category.sortOrder || 0 
//       });
//     } else {
//       setEditingCategory(null);
//       setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0 });
//     }
//     setIsCategoryOpen(true);
//   };

//   const handleCategorySubmit = async () => {
//     if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
//     let success = false;
//     if (editingCategory?._id) { 
//       success = await updateExpenseCategory(editingCategory._id, categoryForm);
//     } else {
//       success = await createExpenseCategory(categoryForm);
//     }

//     if (success) setIsCategoryOpen(false);
//   };

//   const handleDeleteCategory = async (id) => {
//     if (!id) return;
//     if (window.confirm("Are you sure you want to deactivate this category?")) {
//       await deleteExpenseCategory(id);
//     }
//   };

//   const handleActivateCategory = async (category) => {
//     if (window.confirm("Are you sure you want to activate this category?")) {
//       await updateExpenseCategory(category._id, { ...category, isActive: true });
//     }
//   };

//   // ==================== HELPERS ====================
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     return new Date(isoString).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Approved": return "default";
//       case "Paid": return "outline"; 
//       case "Rejected": return "destructive";
//       default: return "secondary"; 
//     }
//   };

//   const renderDynamicIcon = (iconName, className) => {
//     const DynamicIcon = LucideIcons[iconName];
//     if (!DynamicIcon) return <LucideIcons.Tag className={className} />;
//     return <DynamicIcon className={className} />;
//   };

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="tickets" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
//           <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
//         </TabsList>

//         {/* ==================== 1. TICKETS SECTION ==================== */}
//         <TabsContent value="tickets" className="space-y-4 m-0">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="w-full sm:w-auto overflow-auto scrollbar-none">
//               <Tabs value={ticketTab} onValueChange={setTicketTab}>
//                 <TabsList>
//                   <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
//                   <TabsTrigger value="Approved">Approved</TabsTrigger>
//                   <TabsTrigger value="Paid">Paid History</TabsTrigger> 
//                   <TabsTrigger value="Rejected">Rejected</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//             <div className="relative w-full sm:w-64 shrink-0">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Project</TableHead>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Ticket Status</TableHead>
//                   <TableHead>Payment</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow><TableCell colSpan={8} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : allExpenses?.length === 0 ? (
//                   <TableRow><TableCell colSpan={8} className="text-center py-8">No tickets found.</TableCell></TableRow>
//                 ) : (
//                   allExpenses?.map((expense) => (
//                     <TableRow key={expense?._id}>
//                       <TableCell>{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="font-medium">{expense?.employeeId?.name}</div>
//                         {expense?.employeeId?.employeeId && (
//                           <div className="text-[10px] font-semibold text-primary">
//                             ID: {expense.employeeId.employeeId}
//                           </div>
//                         )}
//                         <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
//                       </TableCell>
                      
//                       <TableCell>
//                         {expense?.projectId?.name ? (
//                           <Badge variant="secondary" className="font-normal text-xs bg-muted">
//                             {expense.projectId.name}
//                           </Badge>
//                         ) : (
//                           <span className="text-xs text-muted-foreground">N/A</span>
//                         )}
//                       </TableCell>

//                       <TableCell>
//                         <div className="font-medium">{expense?.title}</div>
//                         {/* CATEGORY ICON WITH BACKGROUND COLOR */}
//                         <Badge variant="outline" className="mt-1 font-normal text-[10px] flex items-center w-fit gap-1 pl-0.5 pr-2 py-0.5">
//                           <span 
//                             className="flex items-center justify-center h-4 w-4 rounded-full text-white" 
//                             style={{ backgroundColor: expense?.categoryId?.color || '#3b82f6' }}
//                           >
//                             {expense?.categoryId?.icon && renderDynamicIcon(expense.categoryId.icon, "h-2.5 w-2.5")}
//                           </span>
//                           <span>{expense?.categoryId?.name || "N/A"}</span>
//                         </Badge>
//                       </TableCell>

//                       <TableCell>
//                         <div className="font-bold">₹{expense?.amount}</div>
//                         {expense?.paymentPendingAmount > 0 && expense?.paymentPendingAmount !== expense?.amount && (
//                           <div className="text-[10px] text-destructive mt-1">
//                             Pending: ₹{expense.paymentPendingAmount}
//                           </div>
//                         )}
//                       </TableCell>
                      
//                       <TableCell>
//                         <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
//                       </TableCell>

//                       <TableCell>
//                         <Badge variant="outline" className={`font-normal text-xs ${expense?.paymentStatus === 'Paid' ? 'text-emerald-600 border-emerald-600/30 bg-emerald-50' : 'text-amber-600 border-amber-600/30 bg-amber-50'}`}>
//                           {expense?.paymentStatus || 'Pending'}
//                         </Badge>
//                       </TableCell>

//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
                          
//                           {/* ONLY SHOW APPROVE/REJECT BUTTONS IF PAYMENT STATUS IS PENDING */}
//                           {ticketTab === "Pending" && expense?.paymentStatus === "Pending" && (
//                             <>
//                               <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
//                                 <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
//                               </Button>
//                               <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
//                                 <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>

//         {/* ==================== 2. CATEGORIES SECTION ==================== */}
//         <TabsContent value="categories" className="space-y-4 m-0">
//           <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
//             <div>
//               <h3 className="text-lg font-semibold">Expense Categories</h3>
//               <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
//             </div>
//             <Button onClick={() => openCategoryModal()} className="gap-2">
//               <Plus className="h-4 w-4"/> Add Category
//             </Button>
//           </div>

//           <div className="border rounded-md">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Color/Icon</TableHead>
//                   <TableHead>Category Name</TableHead>
//                   <TableHead>Code</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenseCategories?.map((cat) => (
//                   <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
//                     <TableCell>
//                       <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: cat?.color || '#3b82f6' }}>
//                         {renderDynamicIcon(cat?.icon, "h-4 w-4")}
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">{cat?.name}</TableCell>
//                     <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
//                     <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
                      
//                       {cat?.isActive ? (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-destructive hover:text-destructive" 
//                           onClick={() => handleDeleteCategory(cat?._id)}
//                         >
//                           Disable
//                         </Button>
//                       ) : (
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           className="text-emerald-600 hover:text-emerald-700" 
//                           onClick={() => handleActivateCategory(cat)}
//                         >
//                           Activate
//                         </Button>
//                       )}
                      
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* ==================== MODALS ==================== */}
      
//       <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//              <div className="py-4 space-y-4">
//                <p className="text-sm text-muted-foreground">
//                  Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
//                </p>
//                <div>
//                  <Label>Remarks (Optional)</Label>
//                  <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
//                </div>
//              </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
//             <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="py-4">
//               <Label>Reason <span className="text-destructive">*</span></Label>
//               <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
//           {selectedExpense && (
//             <div className="space-y-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
//                   <div className="mt-2 flex items-center gap-2">
//                     <Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge>
//                     <Badge variant="outline" className={`text-xs ${selectedExpense.paymentStatus === 'Paid' ? 'text-emerald-600 border-emerald-600/30' : 'text-amber-600 border-amber-600/30'}`}>
//                       Payment: {selectedExpense.paymentStatus || 'Pending'}
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
//                   <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
//                 </div>
//               </div>
//               <Separator />
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
//                   <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
//                   {selectedExpense.employeeId?.employeeId && (
//                     <div className="text-xs font-semibold bg-secondary/50 inline-block px-2 py-1 rounded-md mb-1 mt-1">
//                       EMP ID: {selectedExpense.employeeId.employeeId}
//                     </div>
//                   )}
//                   <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
//                 </div>
                
//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
//                   <div className="font-medium text-base mt-1">
//                     {/* MODAL CATEGORY ICON WITH BACKGROUND COLOR */}
//                     <Badge variant="outline" className="flex items-center w-fit gap-2 pl-1 pr-3 py-1 text-sm shadow-sm" style={{ borderColor: selectedExpense.categoryId?.color }}>
//                       <span 
//                         className="flex items-center justify-center h-6 w-6 rounded-full text-white"
//                         style={{ backgroundColor: selectedExpense.categoryId?.color || '#3b82f6' }}
//                       >
//                         {selectedExpense.categoryId?.icon && renderDynamicIcon(selectedExpense.categoryId.icon, "h-3.5 w-3.5")}
//                       </span>
//                       <span style={{ color: selectedExpense.categoryId?.color, fontWeight: 500 }}>
//                         {selectedExpense.categoryId?.name || "N/A"}
//                       </span>
//                     </Badge>
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Hash className="h-4 w-4" /> Project</Label>
//                   <div className="font-medium text-base mt-1">
//                     {selectedExpense?.projectId?.name ? (
//                       <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 text-sm">
//                         {selectedExpense.projectId.name}
//                       </span>
//                     ) : (
//                       <span className="text-muted-foreground text-sm">N/A</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Separator />
//               <div className="space-y-4">
//                 <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
//                 <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
//               </div>
              
//               {selectedExpense.proofUrl && (
//                 <>
//                   <Separator />
//                   <div>
//                     <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
//                     <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
//                       <FileText className="h-4 w-4" /> View Document
//                     </a>
//                   </div>
//                 </>
//               )}

//               {/* REMARKS & APPROVAL DETAILS */}
//               <Separator />
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-lg">Activity Details</h3>
                
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
//                   {/* Approval / Rejection Information */}
//                   {(() => {
//                     const isRejected = selectedExpense.status === 'Rejected';
//                     return (
//                       <div className={`lg:col-span-1 space-y-3 p-4 rounded-lg border ${isRejected ? 'bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-900/50' : 'bg-muted/20'}`}>
//                         <Label className={`flex items-center gap-2 ${isRejected ? 'text-destructive' : 'text-muted-foreground'}`}>
//                           {isRejected ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />} 
//                           {isRejected ? 'Rejection Information' : 'Approval Information'}
//                         </Label>
                        
//                         <div className="grid grid-cols-2 gap-2 text-sm">
//                           <div className="text-muted-foreground">Status:</div>
//                           <div className={`font-medium ${isRejected ? 'text-destructive' : ''}`}>{selectedExpense.status}</div>
                          
//                           {selectedExpense.approvedBy && !isRejected && (
//                             <>
//                               <div className="text-muted-foreground mt-1">Approved By:</div>
//                               <div className="font-medium mt-1">{selectedExpense.approvedBy.name}</div>
//                             </>
//                           )}
                          
//                           {selectedExpense.approvedAt && !isRejected && (
//                             <>
//                               <div className="text-muted-foreground mt-1">Approved At:</div>
//                               <div className="font-medium mt-1">{formatDate(selectedExpense.approvedAt)}</div>
//                             </>
//                           )}
//                         </div>

//                         {selectedExpense.approverRemarks && (
//                           <div className="mt-3">
//                             <Label className="text-xs text-muted-foreground">
//                               Approver Remarks 
//                               {selectedExpense.approvedBy?.name && <span> (by {selectedExpense.approvedBy.name})</span>}
//                             </Label>
//                             <div className="text-sm p-2 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-md mt-1 border border-green-100 dark:border-green-900">
//                               {selectedExpense.approverRemarks}
//                             </div>
//                           </div>
//                         )}
                        
//                         {selectedExpense.rejectionReason && (
//                           <div className="mt-3">
//                             <Label className="text-xs text-destructive">Rejection Reason</Label>
//                             <div className="text-sm p-2 bg-red-50 dark:bg-red-950/20 text-destructive rounded-md mt-1 border border-red-200 dark:border-red-900/50">
//                               {selectedExpense.rejectionReason}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })()}

//                   {/* Payment Information */}
//                   <div className="lg:col-span-2 space-y-3 bg-muted/20 p-4 rounded-lg border">
//                     <Label className="text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4" /> Payment Information</Label>
                    
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="text-muted-foreground">Status:</div>
//                       <div className="font-medium">{selectedExpense.paymentStatus || 'Pending'}</div>

//                       {(selectedExpense.paymentStatus === 'Paid' || selectedExpense.status === 'Paid') && (
//                         <>
//                           {selectedExpense.paymentMethod && (
//                             <>
//                               <div className="text-muted-foreground mt-1">Method:</div>
//                               <div className="font-medium mt-1">{selectedExpense.paymentMethod}</div>
//                             </>
//                           )}
                          
//                           {selectedExpense.paymentReference && (
//                             <>
//                               <div className="text-muted-foreground mt-1">Ref No:</div>
//                               <div className="font-medium font-mono text-xs break-all mt-1">{selectedExpense.paymentReference}</div>
//                             </>
//                           )}
                          
//                           {selectedExpense.paidBy && (
//                             <>
//                               <div className="text-muted-foreground mt-1">Paid By:</div>
//                               <div className="font-medium mt-1">{selectedExpense.paidBy.name}</div>
//                             </>
//                           )}
                          
//                           {selectedExpense.paidAt && (
//                             <>
//                               <div className="text-muted-foreground mt-1">Paid At:</div>
//                               <div className="font-medium mt-1">{formatDate(selectedExpense.paidAt)}</div>
//                             </>
//                           )}
//                         </>
//                       )}
//                     </div>

//                     {selectedExpense.paymentRemarks && (
//                       <div className="mt-3">
//                         <Label className="text-xs text-muted-foreground">
//                           Payment Remarks
//                           {selectedExpense.paidBy?.name && <span> (by {selectedExpense.paidBy.name})</span>}
//                         </Label>
//                         <div className="text-sm p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-md mt-1 border border-blue-100 dark:border-blue-900">
//                           {selectedExpense.paymentRemarks}
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* PAYMENT HISTORY LOGS */}
//                     {selectedExpense.paymentHistory && selectedExpense.paymentHistory.length > 0 && (
//                       <div className="mt-4 pt-3 border-t border-dashed border-border/50">
//                         <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
//                           <History className="h-3 w-3" /> Payment History Logs
//                         </Label>
//                         <div className="space-y-2">
//                           {selectedExpense.paymentHistory.map((ph, idx) => (
//                             <div key={ph._id || idx} className="bg-background p-2.5 rounded-md border text-xs grid grid-cols-2 gap-x-2 gap-y-1.5 shadow-sm">
//                               <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">₹{ph.amount}</span></div>
//                               <div><span className="text-muted-foreground">Method:</span> <span className="font-medium">{ph.method}</span></div>
//                               <div className="col-span-2 break-all"><span className="text-muted-foreground">Ref:</span> <span className="font-mono">{ph.reference || 'N/A'}</span></div>
//                               <div className="col-span-2"><span className="text-muted-foreground">Date:</span> {formatDate(ph.paidAt)}</div>
//                               <div className="col-span-2"><span className="text-muted-foreground">By:</span> {ph.paidBy?.name}</div>
//                               {ph.remarks && <div className="col-span-2 mt-1 p-1.5 bg-muted/50 rounded italic"><span className="text-muted-foreground not-italic">Remarks:</span> {ph.remarks}</div>}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <Separator />
//               <div className="space-y-2">
//                 <Label className="text-muted-foreground text-xs">System Information</Label>
//                 <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
//                   <div><span className="font-medium">Ticket ID:</span> {selectedExpense._id}</div>
//                   <div><span className="font-medium">Last Updated:</span> {formatDate(selectedExpense.updatedAt)}</div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Lucide Category Modal with Search */}
//       <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-2 gap-4 py-2 max-h-[75vh] overflow-y-auto px-2">
            
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Name <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. Travel" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
//             </div>
//             <div className="col-span-2 md:col-span-1">
//               <Label>Category Code <span className="text-destructive">*</span></Label>
//               <Input placeholder="e.g. TRV" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
//             </div>
            
//             <div className="col-span-2">
//               <Label>Description</Label>
//               <Input placeholder="Short description of this expense type..." value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
//             </div>

//             {/* COLOR PALETTE */}
//             <div className="col-span-2">
//               <div className="flex items-center justify-between mb-2">
//                 <Label>Select Theme Color</Label>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-muted-foreground">Custom:</span>
//                   <input type="color" className="h-6 w-8 cursor-pointer rounded-sm" value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-md">
//                 {PREDEFINED_COLORS.map(color => {
//                   const isSelected = categoryForm.color?.toLowerCase() === color.toLowerCase();
//                   return (
//                     <div 
//                       key={color}
//                       onClick={() => setCategoryForm({...categoryForm, color})}
//                       className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
//                       style={{ backgroundColor: color }}
//                     >
//                       {isSelected && <CheckCircle className="h-4 w-4 text-white opacity-80" />}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* SEARCHABLE LUCIDE ICON GRID */}
//             <div className="col-span-2 space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Select Icon ({filteredIcons.length} available)</Label>
//                 <div className="relative w-48">
//                   <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
//                   <Input 
//                     placeholder="Search icon..." 
//                     className="h-8 pl-8 text-xs" 
//                     value={iconSearch} 
//                     onChange={(e) => setIconSearch(e.target.value)} 
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-muted/30 border rounded-md max-h-48 overflow-y-auto">
//                 {filteredIcons.length === 0 ? (
//                   <div className="col-span-full text-center py-6 text-sm text-muted-foreground">
//                     No icons found matching "{iconSearch}"
//                   </div>
//                 ) : (
//                   filteredIcons.map(iconName => {
//                     const IconComponent = LucideIcons[iconName];
//                     if (!IconComponent) return null;

//                     const isSelected = categoryForm.icon === iconName;
//                     return (
//                       <div
//                         key={iconName}
//                         onClick={() => setCategoryForm({...categoryForm, icon: iconName})}
//                         className={`aspect-square flex items-center justify-center rounded-md cursor-pointer border transition-all hover:bg-muted ${isSelected ? 'bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/20' : 'bg-background border-transparent text-muted-foreground'}`}
//                         title={iconName}
//                       >
//                         <IconComponent className="h-5 w-5" />
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//           </div>
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
//             <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }















import React, { useEffect, useState, useMemo } from "react";
import * as LucideIcons from "lucide-react"; 
import { 
  CheckCircle, XCircle, Search, FileText, Eye, Hash, User, Tag, 
  Settings, Plus, DollarSign, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useHR } from "@/hooks/useHR"; 

// ==================== PREDEFINED UX DATA ====================
const PREDEFINED_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", 
  "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
  "#f43f5e", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669", 
  "#0d9488", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea", "#c026d3", 
  "#db2777", "#e11d48", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a"
];

const PREDEFINED_ICONS = [
  "Car", "Bus", "Train", "Plane", "Bike", "Truck", "Ship", "Fuel", "Compass", "MapPin", "Navigation", "Route", "Ticket",
  "Utensils", "Coffee", "Pizza", "Soup", "CupSoda", "Wine", "Beer", "Cake", "Apple", "Cookie",
  "Building", "Hotel", "Home", "Warehouse", "Factory", "Store", "Tent", "Bed", "DoorOpen",
  "Laptop", "Smartphone", "Tablet", "Monitor", "Printer", "Server", "Cpu", "HardDrive", "Wifi", "Bluetooth", "Plug", "BatteryCharging", "Zap",
  "Wrench", "Hammer", "Screwdriver", "Tool", "Lightbulb", "Headset", "Camera", "Video", "Mic", "Speaker", "Tv",
  "Banknote", "Coins", "CreditCard", "Receipt", "Wallet", "PiggyBank", "Calculator", "ShoppingCart", "ShoppingBag", "Percent", "TrendingUp",
  "Stethoscope", "Pill", "Syringe", "Activity", "HeartPulse", "FirstAidKit", "Cross",
  "Tag", "Tags", "Box", "Boxes", "Package", "Gift", "Bookmark", "Calendar", "Clock", "Hourglass", "AlarmClock",
  "Briefcase", "Folder", "FolderOpen", "FileText", "Clipboard", "Mail", "Send", "Inbox", "Archive",
  "Star", "Shield", "Key", "Lock", "Unlock", "Search", "Bell", "Flag", "BookmarkCheck",
  "Users", "User", "UserCheck", "UserPlus", "GraduationCap", "BookOpen", "Award", "Trophy", "Crown", "Medal",
  "Sun", "Moon", "Cloud", "CloudRain", "Snowflake", "Wind", "Flame", "Droplets", "Leaf", "TreePine"
];

export function HRExpenseTab() {
  const {
    loading,
    allExpenses,
    fetchAllExpenses,
    approveExpense,
    rejectExpense,
    expenseCategories,
    fetchExpenseCategories,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory
  } = useHR();

  // ==================== TICKET STATE ====================
  const [ticketTab, setTicketTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [approveRemarks, setApproveRemarks] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // ==================== CATEGORY STATE ====================
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [iconSearch, setIconSearch] = useState(""); 
  const [categoryForm, setCategoryForm] = useState({
    name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0
  });

  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return PREDEFINED_ICONS;
    return PREDEFINED_ICONS.filter(iconName => 
      iconName.toLowerCase().includes(iconSearch.toLowerCase())
    );
  }, [iconSearch]);

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchExpenseCategories();
  }, [fetchExpenseCategories]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      const params = {
        search: searchTerm,
        page: 1,
        limit: 10,
      };

      if (ticketTab === "Paid") {
        params.paymentStatus = "Paid";
      } else {
        params.status = ticketTab;
      }

      fetchAllExpenses(params);
    }, 500);
    return () => clearTimeout(debounce);
  }, [ticketTab, searchTerm, fetchAllExpenses]);

  // ==================== TICKET HANDLERS ====================
  const handleApprove = async () => {
    if (!selectedExpense?._id) return; 
    const success = await approveExpense(selectedExpense._id, { remarks: approveRemarks });
    if (success) setIsApproveOpen(false);
  };

  const handleReject = async () => {
    if (!selectedExpense?._id) return; 
    if (!rejectReason.trim()) return toast.error("Reason is required!");
    const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
    if (success) setIsRejectOpen(false);
  };

  const openTicketModal = (expense, type) => {
    setSelectedExpense(expense);
    if (type === 'view') setIsViewOpen(true);
    if (type === 'approve') { setApproveRemarks(""); setIsApproveOpen(true); }
    if (type === 'reject') { setRejectReason(""); setIsRejectOpen(true); }
  };

  // ==================== CATEGORY HANDLERS ====================
  const openCategoryModal = (category = null) => {
    setIconSearch(""); 
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ 
        name: category.name || "", 
        code: category.code || "", 
        description: category.description || "", 
        color: category.color || "#3b82f6", 
        icon: category.icon || "Tag", 
        sortOrder: category.sortOrder || 0 
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", code: "", description: "", color: "#3b82f6", icon: "Tag", sortOrder: 0 });
    }
    setIsCategoryOpen(true);
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name || !categoryForm.code) return toast.error("Name and Code are required");
    
    let success = false;
    if (editingCategory?._id) { 
      success = await updateExpenseCategory(editingCategory._id, categoryForm);
    } else {
      success = await createExpenseCategory(categoryForm);
    }

    if (success) setIsCategoryOpen(false);
  };

  const handleDeleteCategory = async (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to deactivate this category?")) {
      await deleteExpenseCategory(id);
    }
  };

  const handleActivateCategory = async (category) => {
    if (window.confirm("Are you sure you want to activate this category?")) {
      await updateExpenseCategory(category._id, { ...category, isActive: true });
    }
  };

  // ==================== HELPERS ====================
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Approved": return "default";
      case "Paid": return "outline"; 
      case "Rejected": return "destructive";
      default: return "secondary"; 
    }
  };

  const renderDynamicIcon = (iconName, className) => {
    const DynamicIcon = LucideIcons[iconName];
    if (!DynamicIcon) return <LucideIcons.Tag className={className} />;
    return <DynamicIcon className={className} />;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tickets" className="flex gap-2"><FileText className="h-4 w-4"/> Tickets</TabsTrigger>
          <TabsTrigger value="categories" className="flex gap-2"><Settings className="h-4 w-4"/> Categories</TabsTrigger>
        </TabsList>

        {/* ==================== 1. TICKETS SECTION ==================== */}
        <TabsContent value="tickets" className="space-y-4 m-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto overflow-auto scrollbar-none">
              <Tabs value={ticketTab} onValueChange={setTicketTab}>
                <TabsList>
                  <TabsTrigger value="Pending">Pending Approvals</TabsTrigger>
                  <TabsTrigger value="Approved">Approved</TabsTrigger>
                  <TabsTrigger value="Paid">Paid History</TabsTrigger> 
                  <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tickets..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee / Paid To</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Ticket Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : allExpenses?.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No tickets found.</TableCell></TableRow>
                ) : (
                  allExpenses?.map((expense) => (
                    <TableRow key={expense?._id}>
                      <TableCell className="whitespace-nowrap">{new Date(expense?.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {expense?.expenseType === "Finance Payment" ? (
                          <>
                            <div className="font-medium text-blue-700">
                              {expense.paidToName || expense.paidToUserId?.name || "External Recipient"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {expense.paidToEmail || expense.paidToUserId?.email || expense.paidToPhone}
                            </div>
                            <Badge variant="outline" className="mt-1 text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                              Finance Payment
                            </Badge>
                          </>
                        ) : (
                          <>
                            <div className="font-medium">{expense?.employeeId?.name || "Unknown"}</div>
                            {expense?.employeeId?.employeeId && (
                              <div className="text-[10px] font-semibold text-primary">
                                ID: {expense.employeeId.employeeId}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">{expense?.employeeId?.email}</div>
                          </>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {expense?.projectId?.name ? (
                          <Badge variant="secondary" className="font-normal text-xs bg-muted">
                            {expense.projectId.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="font-medium max-w-[200px] truncate" title={expense?.title}>{expense?.title}</div>
                        <Badge variant="outline" className="mt-1 font-normal text-[10px] flex items-center w-fit gap-1 pl-0.5 pr-2 py-0.5">
                          <span 
                            className="flex items-center justify-center h-4 w-4 rounded-full text-white" 
                            style={{ backgroundColor: expense?.categoryId?.color || '#3b82f6' }}
                          >
                            {expense?.categoryId?.icon && renderDynamicIcon(expense.categoryId.icon, "h-2.5 w-2.5")}
                          </span>
                          <span className="truncate max-w-[120px]" title={expense?.categoryId?.name}>{expense?.categoryId?.name || "N/A"}</span>
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="font-bold">₹{expense?.amount}</div>
                        {expense?.paymentPendingAmount > 0 && expense?.paymentPendingAmount !== expense?.amount && (
                          <div className="text-[10px] text-destructive mt-1">
                            Pending: ₹{expense.paymentPendingAmount}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(expense?.status)}>{expense?.status}</Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className={`font-normal text-xs whitespace-nowrap ${expense?.paymentStatus === 'Paid' ? 'text-emerald-600 border-emerald-600/30 bg-emerald-50' : 'text-amber-600 border-amber-600/30 bg-amber-50'}`}>
                          {expense?.paymentStatus || 'Pending'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openTicketModal(expense, 'view')}><Eye className="h-4 w-4" /></Button>
                          
                          {ticketTab === "Pending" && expense?.paymentStatus === "Pending" && (
                            <>
                              <Button size="sm" variant="outline" className="border-success/50 text-success hover:bg-success/10" onClick={() => openTicketModal(expense, 'approve')}>
                                <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => openTicketModal(expense, 'reject')}>
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
        </TabsContent>

        {/* ==================== 2. CATEGORIES SECTION ==================== */}
        <TabsContent value="categories" className="space-y-4 m-0">
          <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
            <div>
              <h3 className="text-lg font-semibold">Expense Categories</h3>
              <p className="text-sm text-muted-foreground">Manage allowed expense types and their limits.</p>
            </div>
            <Button onClick={() => openCategoryModal()} className="gap-2">
              <Plus className="h-4 w-4"/> Add Category
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Color/Icon</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategories?.map((cat) => (
                  <TableRow key={cat?._id} className={!cat?.isActive ? "opacity-50 bg-muted/20" : ""}>
                    <TableCell>
                      <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-sm text-white" style={{ backgroundColor: cat?.color || '#3b82f6' }}>
                        {renderDynamicIcon(cat?.icon, "h-4 w-4")}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{cat?.name}</TableCell>
                    <TableCell><Badge variant="outline">{cat?.code}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cat?.description || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={cat?.isActive ? "default" : "secondary"}>{cat?.isActive ? "Active" : "Inactive"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openCategoryModal(cat)}>Edit</Button>
                      
                      {cat?.isActive ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteCategory(cat?._id)}
                        >
                          Disable
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-emerald-600 hover:text-emerald-700" 
                          onClick={() => handleActivateCategory(cat)}
                        >
                          Activate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ==================== MODALS ==================== */}
      
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Approve Expense</DialogTitle></DialogHeader>
          {selectedExpense && (
             <div className="py-4 space-y-4">
               <p className="text-sm text-muted-foreground">
                 Approve <b className="text-foreground">₹{selectedExpense.amount}</b> for <b className="text-foreground">{selectedExpense.employeeId?.name}</b>?
               </p>
               <div>
                 <Label>Remarks (Optional)</Label>
                 <Input placeholder="Looks good" value={approveRemarks} onChange={(e) => setApproveRemarks(e.target.value)} />
               </div>
             </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve & Adjust Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-destructive">Reject Expense</DialogTitle></DialogHeader>
          {selectedExpense && (
            <div className="py-4">
              <Label>Reason <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Missing clear proof..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><FileText className="h-5 w-5 text-primary" /> Expense Details</DialogTitle></DialogHeader>
          {selectedExpense && (
            <div className="space-y-6 py-4">
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber}</span></div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(selectedExpense.status)}>{selectedExpense.status}</Badge>
                    <Badge variant="outline" className={`text-xs ${selectedExpense.paymentStatus === 'Paid' ? 'text-emerald-600 border-emerald-600/30' : 'text-amber-600 border-amber-600/30'}`}>
                      Payment: {selectedExpense.paymentStatus || 'Pending'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Requested: {formatDate(selectedExpense.createdAt)}</div>
                </div>
              </div>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" /> 
                    {selectedExpense.expenseType === "Finance Payment" ? "Paid To (Recipient)" : "Employee Info"}
                  </Label>

                  {/* CONDITIONALLY RENDER EMPLOYEE OR PAID TO INFO */}
                  {selectedExpense.expenseType === "Finance Payment" ? (
                    <>
                      <div className="font-medium text-base text-blue-700">
                        {selectedExpense.paidToName || selectedExpense.paidToUserId?.name || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedExpense.paidToEmail || selectedExpense.paidToUserId?.email || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Phone: {selectedExpense.paidToPhone || selectedExpense.paidToUserId?.phone || "N/A"}
                      </div>
                      <div className="mt-2 text-xs">
                        <span className="text-muted-foreground">Recorded By: </span>
                        <span className="font-medium text-primary">{selectedExpense.employeeId?.name || "N/A"}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-medium text-base">{selectedExpense.employeeId?.name}</div>
                      {selectedExpense.employeeId?.employeeId && (
                        <div className="text-xs font-semibold bg-secondary/50 inline-block px-2 py-1 rounded-md mb-1 mt-1">
                          EMP ID: {selectedExpense.employeeId.employeeId}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
                    </>
                  )}
                </div>
                
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Category</Label>
                  <div className="font-medium text-base mt-1">
                    <Badge variant="outline" className="flex items-center w-fit gap-2 pl-1 pr-3 py-1 text-sm shadow-sm" style={{ borderColor: selectedExpense.categoryId?.color }}>
                      <span 
                        className="flex items-center justify-center h-6 w-6 rounded-full text-white"
                        style={{ backgroundColor: selectedExpense.categoryId?.color || '#3b82f6' }}
                      >
                        {selectedExpense.categoryId?.icon && renderDynamicIcon(selectedExpense.categoryId.icon, "h-3.5 w-3.5")}
                      </span>
                      <span style={{ color: selectedExpense.categoryId?.color, fontWeight: 500 }}>
                        {selectedExpense.categoryId?.name || "N/A"}
                      </span>
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground flex items-center gap-2 mb-1"><Hash className="h-4 w-4" /> Project</Label>
                  <div className="font-medium text-base mt-1">
                    {selectedExpense?.projectId?.name ? (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200 text-sm">
                        {selectedExpense.projectId.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </div>
                </div>
              </div>

              <Separator />
              <div className="space-y-4">
                <div><Label className="text-muted-foreground">Title</Label><div className="font-medium text-lg">{selectedExpense.title}</div></div>
                <div><Label className="text-muted-foreground">Description</Label><div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description}</div></div>
              </div>
              
              {selectedExpense.proofUrl && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground block mb-2">Attached Proof</Label>
                    <a href={selectedExpense.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium text-primary">
                      <FileText className="h-4 w-4" /> View Document
                    </a>
                  </div>
                </>
              )}

              {/* REMARKS & APPROVAL DETAILS */}
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Activity Details</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Approval / Rejection Information */}
                  {(() => {
                    const isRejected = selectedExpense.status === 'Rejected';
                    return (
                      <div className={`lg:col-span-1 space-y-3 p-4 rounded-lg border ${isRejected ? 'bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-900/50' : 'bg-muted/20'}`}>
                        <Label className={`flex items-center gap-2 ${isRejected ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {isRejected ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />} 
                          {isRejected ? 'Rejection Information' : 'Approval Information'}
                        </Label>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Status:</div>
                          <div className={`font-medium ${isRejected ? 'text-destructive' : ''}`}>{selectedExpense.status}</div>
                          
                          {selectedExpense.approvedBy && !isRejected && (
                            <>
                              <div className="text-muted-foreground mt-1">Approved By:</div>
                              <div className="font-medium mt-1">{selectedExpense.approvedBy.name}</div>
                            </>
                          )}
                          
                          {selectedExpense.approvedAt && !isRejected && (
                            <>
                              <div className="text-muted-foreground mt-1">Approved At:</div>
                              <div className="font-medium mt-1">{formatDate(selectedExpense.approvedAt)}</div>
                            </>
                          )}
                        </div>

                        {selectedExpense.approverRemarks && (
                          <div className="mt-3">
                            <Label className="text-xs text-muted-foreground">
                              Approver Remarks 
                              {selectedExpense.approvedBy?.name && <span> (by {selectedExpense.approvedBy.name})</span>}
                            </Label>
                            <div className="text-sm p-2 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-md mt-1 border border-green-100 dark:border-green-900">
                              {selectedExpense.approverRemarks}
                            </div>
                          </div>
                        )}
                        
                        {selectedExpense.rejectionReason && (
                          <div className="mt-3">
                            <Label className="text-xs text-destructive">Rejection Reason</Label>
                            <div className="text-sm p-2 bg-red-50 dark:bg-red-950/20 text-destructive rounded-md mt-1 border border-red-200 dark:border-red-900/50">
                              {selectedExpense.rejectionReason}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Payment Information */}
                  <div className="lg:col-span-2 space-y-3 bg-muted/20 p-4 rounded-lg border">
                    <Label className="text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4" /> Payment Information</Label>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Status:</div>
                      <div className="font-medium">{selectedExpense.paymentStatus || 'Pending'}</div>

                      {/* CONDITIONS FOR SHOWING PAYMENT DETAILS:
                          1. If normal expense ticket is 'Paid'
                          2. If ticket type is 'Finance Payment' (always show upfront fields)
                      */}
                      {(selectedExpense.paymentStatus === 'Paid' || selectedExpense.status === 'Paid' || selectedExpense.expenseType === 'Finance Payment') && (
                        <>
                          {(selectedExpense.paymentMethod || selectedExpense.paymentMode) && (
                            <>
                              <div className="text-muted-foreground mt-1">Method:</div>
                              <div className="font-medium mt-1">{selectedExpense.paymentMethod || selectedExpense.paymentMode}</div>
                            </>
                          )}
                          
                          {selectedExpense.paymentReference && (
                            <>
                              <div className="text-muted-foreground mt-1">Ref No:</div>
                              <div className="font-medium font-mono text-xs break-all mt-1">{selectedExpense.paymentReference}</div>
                            </>
                          )}

                          {/* Specific to Finance Payment upfront form */}
                          {selectedExpense.expenseType === "Finance Payment" && selectedExpense.paymentDate && (
                             <>
                               <div className="text-muted-foreground mt-1">Payment Date:</div>
                               <div className="font-medium mt-1">{new Date(selectedExpense.paymentDate).toLocaleDateString("en-IN")}</div>
                             </>
                          )}
                          
                          {selectedExpense.paidBy && (
                            <>
                              <div className="text-muted-foreground mt-1">Paid By:</div>
                              <div className="font-medium mt-1">{selectedExpense.paidBy.name}</div>
                            </>
                          )}
                          
                          {selectedExpense.paidAt && (
                            <>
                              <div className="text-muted-foreground mt-1">Paid At:</div>
                              <div className="font-medium mt-1">{formatDate(selectedExpense.paidAt)}</div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">System Information</Label>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div><span className="font-medium">Ticket ID:</span> {selectedExpense._id}</div>
                  <div><span className="font-medium">Last Updated:</span> {formatDate(selectedExpense.updatedAt)}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lucide Category Modal with Search */}
      <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2 max-h-[75vh] overflow-y-auto px-2">
            
            <div className="col-span-2 md:col-span-1">
              <Label>Category Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Travel" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Label>Category Code <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. TRV" value={categoryForm.code} onChange={(e) => setCategoryForm({...categoryForm, code: e.target.value.toUpperCase()})} />
            </div>
            
            <div className="col-span-2">
              <Label>Description</Label>
              <Input placeholder="Short description of this expense type..." value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
            </div>

            {/* COLOR PALETTE */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Select Theme Color</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Custom:</span>
                  <input type="color" className="h-6 w-8 cursor-pointer rounded-sm" value={categoryForm.color} onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border rounded-md">
                {PREDEFINED_COLORS.map(color => {
                  const isSelected = categoryForm.color?.toLowerCase() === color.toLowerCase();
                  return (
                    <div 
                      key={color}
                      onClick={() => setCategoryForm({...categoryForm, color})}
                      className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                      style={{ backgroundColor: color }}
                    >
                      {isSelected && <CheckCircle className="h-4 w-4 text-white opacity-80" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEARCHABLE LUCIDE ICON GRID */}
            <div className="col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Select Icon ({filteredIcons.length} available)</Label>
                <div className="relative w-48">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    placeholder="Search icon..." 
                    className="h-8 pl-8 text-xs" 
                    value={iconSearch} 
                    onChange={(e) => setIconSearch(e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-3 bg-muted/30 border rounded-md max-h-48 overflow-y-auto">
                {filteredIcons.length === 0 ? (
                  <div className="col-span-full text-center py-6 text-sm text-muted-foreground">
                    No icons found matching "{iconSearch}"
                  </div>
                ) : (
                  filteredIcons.map(iconName => {
                    const IconComponent = LucideIcons[iconName];
                    if (!IconComponent) return null;

                    const isSelected = categoryForm.icon === iconName;
                    return (
                      <div
                        key={iconName}
                        onClick={() => setCategoryForm({...categoryForm, icon: iconName})}
                        className={`aspect-square flex items-center justify-center rounded-md cursor-pointer border transition-all hover:bg-muted ${isSelected ? 'bg-primary/10 border-primary text-primary shadow-sm ring-2 ring-primary/20' : 'bg-background border-transparent text-muted-foreground'}`}
                        title={iconName}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>Cancel</Button>
            <Button onClick={handleCategorySubmit}>{editingCategory ? "Update" : "Create"} Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}