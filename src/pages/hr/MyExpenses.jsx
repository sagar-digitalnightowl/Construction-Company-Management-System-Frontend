// // import React, { useEffect, useState } from "react";
// // import { Plus, Receipt, FileText, Search } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import { Badge } from "@/components/ui/badge";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { useHR } from "@/hooks/useHR"; // Adjust path if needed
// // import { toast } from "sonner"; // Added toast for local error handling

// // const EXPENSE_CATEGORIES = [
// //   "Travel", "Fuel", "Food", "Office Supplies", 
// //   "Site Material", "Accommodation", "Communication", "Medical", "Other"
// // ];

// // export default function MyExpenses() {
// //   // CRASH-PROOFING: Added default values so the app won't crash even if useHR is missing these functions
// //   const { 
// //     myExpenses = [], 
// //     fetchMyExpenses = () => console.warn("fetchMyExpenses is missing in useHR"), 
// //     createExpense = async () => { toast.error("createExpense is missing in useHR"); return false; }, 
// //     loading = false 
// //   } = useHR() || {};

// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");

// //   const [formData, setFormData] = useState({
// //     title: "",
// //     category: "",
// //     description: "",
// //     amount: "",
// //     proof: null,
// //   });

// //   // Fetch expenses when component mounts
// //   useEffect(() => {
// //     if (typeof fetchMyExpenses === 'function') {
// //       fetchMyExpenses();
// //     }
// //   }, [fetchMyExpenses]);

// //   // Handle form input changes
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleFileChange = (e) => {
// //     setFormData((prev) => ({ ...prev, proof: e.target.files[0] }));
// //   };

// //   const handleCategoryChange = (value) => {
// //     setFormData((prev) => ({ ...prev, category: value }));
// //   };

// //   // Handle form submission
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     // FormData is required for file uploads
// //     const payload = new FormData();
// //     payload.append("title", formData.title);
// //     payload.append("category", formData.category);
// //     payload.append("description", formData.description);
// //     payload.append("amount", formData.amount);
// //     if (formData.proof) {
// //       payload.append("proof", formData.proof);
// //     }

// //     const success = await createExpense(payload);
    
// //     if (success) {
// //       setIsModalOpen(false);
// //       setFormData({ title: "", category: "", description: "", amount: "", proof: null }); // Reset form
// //       if (typeof fetchMyExpenses === 'function') fetchMyExpenses(); // Refresh table data
// //     }
// //     setIsSubmitting(false);
// //   };

// //   // Helper to style status badges
// //   const getStatusBadge = (status) => {
// //     switch (status?.toUpperCase()) {
// //       case "APPROVED": return <Badge variant="secondary">Approved</Badge>;
// //       case "PAID": return <Badge variant="success">Paid</Badge>;
// //       case "REJECTED": return <Badge variant="destructive">Rejected</Badge>;
// //       default: return <Badge variant="warning">Pending</Badge>;
// //     }
// //   };

// //   // Filter logic for search (added fallback for safety)
// //   const safeExpenses = Array.isArray(myExpenses) ? myExpenses : [];
// //   const filteredExpenses = safeExpenses.filter(exp => 
// //     (exp?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
// //     (exp?.category || "").toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   return (
// //     <div className="p-6 space-y-6 max-w-7xl mx-auto">
// //       {/* Header Section */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground flex items-center gap-2">
// //             <Receipt className="h-6 w-6 text-primary" />
// //             My Expenses
// //           </h1>
// //           <p className="text-sm text-muted-foreground mt-1">
// //             Track and claim your reimbursements for official work.
// //           </p>
// //         </div>
        
// //         <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
// //           <Plus className="mr-2 h-4 w-4" />
// //           Raise Ticket
// //         </Button>
// //       </div>

// //       {/* Main Table Card */}
// //       <Card>
// //         <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
// //           <div>
// //             <CardTitle>Expense History</CardTitle>
// //             <CardDescription>Your previously submitted expense claims.</CardDescription>
// //           </div>
// //           <div className="relative w-full sm:w-64">
// //             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// //             <Input
// //               placeholder="Search expenses..."
// //               className="pl-9"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>
// //         </CardHeader>
// //         <CardContent className="p-0">
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Date</TableHead>
// //                 <TableHead>Title</TableHead>
// //                 <TableHead>Category</TableHead>
// //                 <TableHead>Amount</TableHead>
// //                 <TableHead>Status</TableHead>
// //                 <TableHead className="text-right">Proof</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {loading && filteredExpenses.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
// //                     Loading your expenses...
// //                   </TableCell>
// //                 </TableRow>
// //               ) : filteredExpenses.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
// //                     No expense tickets found. Raise a new one to get started!
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 filteredExpenses.map((expense) => (
// //                   <TableRow key={expense._id || Math.random()}>
// //                     <TableCell className="font-medium">
// //                       {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}
// //                     </TableCell>
// //                     <TableCell>{expense.title}</TableCell>
// //                     <TableCell>{expense.category}</TableCell>
// //                     <TableCell>₹{expense.amount}</TableCell>
// //                     <TableCell>{getStatusBadge(expense.status)}</TableCell>
// //                     <TableCell className="text-right">
// //                       {expense.proofUrl ? (
// //                         <a href={expense.proofUrl} target="_blank" rel="noreferrer">
// //                           <Button variant="ghost" size="icon-sm" title="View Proof">
// //                             <FileText className="h-4 w-4" />
// //                           </Button>
// //                         </a>
// //                       ) : (
// //                         <span className="text-xs text-muted-foreground">N/A</span>
// //                       )}
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </CardContent>
// //       </Card>

// //       {/* Raise Ticket Modal */}
// //       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
// //         <DialogContent className="sm:max-w-[500px]">
// //           <form onSubmit={handleSubmit}>
// //             <DialogHeader>
// //               <DialogTitle>Raise Expense Ticket</DialogTitle>
// //               <DialogDescription>
// //                 Fill in the details below to claim your reimbursement. Don't forget to attach a valid receipt.
// //               </DialogDescription>
// //             </DialogHeader>
            
// //             <div className="grid gap-4 py-4">
// //               <div className="grid gap-2">
// //                 <Label htmlFor="title">Expense Title <span className="text-destructive">*</span></Label>
// //                 <Input 
// //                   id="title" name="title" required 
// //                   placeholder="e.g. Fuel for site visit" 
// //                   value={formData.title} onChange={handleInputChange} 
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="grid gap-2">
// //                   <Label>Category <span className="text-destructive">*</span></Label>
// //                   <Select required onValueChange={handleCategoryChange} value={formData.category}>
// //                     <SelectTrigger>
// //                       <SelectValue placeholder="Select Category" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {EXPENSE_CATEGORIES.map(cat => (
// //                         <SelectItem key={cat} value={cat}>{cat}</SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div className="grid gap-2">
// //                   <Label htmlFor="amount">Amount (₹) <span className="text-destructive">*</span></Label>
// //                   <Input 
// //                     id="amount" name="amount" type="number" required min="1"
// //                     placeholder="0.00" 
// //                     value={formData.amount} onChange={handleInputChange} 
// //                   />
// //                 </div>
// //               </div>

// //               <div className="grid gap-2">
// //                 <Label htmlFor="description">Detailed Description <span className="text-destructive">*</span></Label>
// //                 <Textarea 
// //                   id="description" name="description" required 
// //                   placeholder="Explain why this expense was made..." 
// //                   value={formData.description} onChange={handleInputChange} 
// //                 />
// //               </div>

// //               <div className="grid gap-2">
// //                 <Label htmlFor="proof">Upload Receipt/Proof <span className="text-destructive">*</span></Label>
// //                 <Input 
// //                   id="proof" name="proof" type="file" required 
// //                   accept="image/*,.pdf"
// //                   onChange={handleFileChange} 
// //                 />
// //                 <p className="text-[11px] text-muted-foreground">Formats: JPG, PNG, PDF</p>
// //               </div>
// //             </div>
            
// //             <DialogFooter>
// //               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
// //                 Cancel
// //               </Button>
// //               <Button type="submit" disabled={isSubmitting}>
// //                 {isSubmitting ? "Submitting..." : "Submit Ticket"}
// //               </Button>
// //             </DialogFooter>
// //           </form>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }




// // import React, { useEffect, useState } from "react";
// // import { Plus, Receipt, FileText, Search } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import { Badge } from "@/components/ui/badge";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { useHR } from "@/hooks/useHR"; // Adjust path if needed
// // import { toast } from "sonner"; 

// // const EXPENSE_CATEGORIES = [
// //   "Travel", "Fuel", "Food", "Office Supplies", 
// //   "Site Material", "Accommodation", "Communication", "Medical", "Other"
// // ];

// // export default function MyExpenses() {
// //   // CRASH-PROOFING: Added default values
// //   const { 
// //     myExpenses = [], 
// //     fetchMyExpenses = () => console.warn("fetchMyExpenses is missing in useHR"), 
// //     createExpense = async () => { toast.error("createExpense is missing in useHR"); return false; }, 
// //     loading = false 
// //   } = useHR() || {};

// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");

// //   const [formData, setFormData] = useState({
// //     title: "",
// //     category: "", // Optional
// //     description: "",
// //     amount: "",
// //     proof: null,
// //   });

// //   // Fetch expenses when component mounts
// //   useEffect(() => {
// //     if (typeof fetchMyExpenses === 'function') {
// //       fetchMyExpenses();
// //     }
// //   }, [fetchMyExpenses]);

// //   // Handle form input changes
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleFileChange = (e) => {
// //     // Safe check if user clicks cancel on file dialog
// //     if (e.target.files && e.target.files.length > 0) {
// //       setFormData((prev) => ({ ...prev, proof: e.target.files[0] }));
// //     } else {
// //       setFormData((prev) => ({ ...prev, proof: null }));
// //     }
// //   };

// //   const handleCategoryChange = (value) => {
// //     setFormData((prev) => ({ ...prev, category: value }));
// //   };

// //   // Handle form submission
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!formData.proof) {
// //       return toast.error("Please upload a receipt/proof image or PDF.");
// //     }

// //     setIsSubmitting(true);

// //     // FormData is required for file uploads
// //     const payload = new FormData();
// //     payload.append("title", formData.title);
// //     payload.append("description", formData.description);
// //     payload.append("amount", formData.amount);
// //     payload.append("proof", formData.proof);
    
// //     // Append category only if user selected it (since it's optional)
// //     if (formData.category) {
// //       payload.append("category", formData.category);
// //     }

// //     const success = await createExpense(payload);
    
// //     if (success) {
// //       setIsModalOpen(false);
// //       setFormData({ title: "", category: "", description: "", amount: "", proof: null }); // Reset form
// //       if (typeof fetchMyExpenses === 'function') fetchMyExpenses(); // Refresh table data
// //     }
// //     setIsSubmitting(false);
// //   };

// //   // Helper to style status badges
// //   const getStatusBadge = (status) => {
// //     switch (status?.toUpperCase()) {
// //       case "APPROVED": return <Badge variant="secondary">Approved</Badge>;
// //       case "PAID": return <Badge variant="success">Paid</Badge>;
// //       case "REJECTED": return <Badge variant="destructive">Rejected</Badge>;
// //       default: return <Badge variant="warning">Pending</Badge>;
// //     }
// //   };

// //   // Filter logic for search
// //   const safeExpenses = Array.isArray(myExpenses) ? myExpenses : [];
// //   const filteredExpenses = safeExpenses.filter(exp => 
// //     (exp?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
// //     (exp?.category || "").toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   return (
// //     <div className="p-6 space-y-6 max-w-7xl mx-auto">
// //       {/* Header Section */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground flex items-center gap-2">
// //             <Receipt className="h-6 w-6 text-primary" />
// //             My Expenses
// //           </h1>
// //           <p className="text-sm text-muted-foreground mt-1">
// //             Track and claim your reimbursements for official work.
// //           </p>
// //         </div>
        
// //         <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
// //           <Plus className="mr-2 h-4 w-4" />
// //           Raise Ticket
// //         </Button>
// //       </div>

// //       {/* Main Table Card */}
// //       <Card>
// //         <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
// //           <div>
// //             <CardTitle>Expense History</CardTitle>
// //             <CardDescription>Your previously submitted expense claims.</CardDescription>
// //           </div>
// //           <div className="relative w-full sm:w-64">
// //             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// //             <Input
// //               placeholder="Search expenses..."
// //               className="pl-9"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>
// //         </CardHeader>
// //         <CardContent className="p-0">
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Date</TableHead>
// //                 <TableHead>Title</TableHead>
// //                 <TableHead>Category</TableHead>
// //                 <TableHead>Amount</TableHead>
// //                 <TableHead>Status</TableHead>
// //                 <TableHead className="text-right">Proof</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {loading && filteredExpenses.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
// //                     Loading your expenses...
// //                   </TableCell>
// //                 </TableRow>
// //               ) : filteredExpenses.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
// //                     No expense tickets found. Raise a new one to get started!
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 filteredExpenses.map((expense) => (
// //                   <TableRow key={expense._id || Math.random()}>
// //                     <TableCell className="font-medium">
// //                       {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}
// //                     </TableCell>
// //                     <TableCell>{expense.title}</TableCell>
// //                     {/* Fallback rendering for optional category */}
// //                     <TableCell>
// //                       {expense.category ? (
// //                         <Badge variant="outline" className="text-[10px] font-normal">{expense.category}</Badge>
// //                       ) : (
// //                         <span className="text-xs text-muted-foreground">None</span>
// //                       )}
// //                     </TableCell>
// //                     <TableCell>₹{expense.amount}</TableCell>
// //                     <TableCell>{getStatusBadge(expense.status)}</TableCell>
// //                     <TableCell className="text-right">
// //                       {expense.proofUrl ? (
// //                         <a href={expense.proofUrl} target="_blank" rel="noreferrer">
// //                           <Button variant="ghost" size="icon-sm" title="View Proof">
// //                             <FileText className="h-4 w-4" />
// //                           </Button>
// //                         </a>
// //                       ) : (
// //                         <span className="text-xs text-muted-foreground">N/A</span>
// //                       )}
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </CardContent>
// //       </Card>

// //       {/* Raise Ticket Modal */}
// //       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
// //         <DialogContent className="sm:max-w-[500px]">
// //           <form onSubmit={handleSubmit}>
// //             <DialogHeader>
// //               <DialogTitle>Raise Expense Ticket</DialogTitle>
// //               <DialogDescription>
// //                 Fill in the details below to claim your reimbursement. Don't forget to attach a valid receipt.
// //               </DialogDescription>
// //             </DialogHeader>
            
// //             <div className="grid gap-4 py-4">
// //               <div className="grid gap-2">
// //                 <Label htmlFor="title">Expense Title <span className="text-destructive">*</span></Label>
// //                 <Input 
// //                   id="title" name="title" required 
// //                   placeholder="e.g. Fuel for site visit" 
// //                   value={formData.title} onChange={handleInputChange} 
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="grid gap-2">
// //                   {/* Removed required asterisk from Category */}
// //                   <Label>Category</Label>
// //                   <Select onValueChange={handleCategoryChange} value={formData.category}>
// //                     <SelectTrigger>
// //                       <SelectValue placeholder="Select (Optional)" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {EXPENSE_CATEGORIES.map(cat => (
// //                         <SelectItem key={cat} value={cat}>{cat}</SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div className="grid gap-2">
// //                   <Label htmlFor="amount">Amount (₹) <span className="text-destructive">*</span></Label>
// //                   <Input 
// //                     id="amount" name="amount" type="number" required min="1" step="0.01"
// //                     placeholder="0.00" 
// //                     value={formData.amount} onChange={handleInputChange} 
// //                   />
// //                 </div>
// //               </div>

// //               <div className="grid gap-2">
// //                 <Label htmlFor="description">Detailed Description <span className="text-destructive">*</span></Label>
// //                 <Textarea 
// //                   id="description" name="description" required 
// //                   placeholder="Explain why this expense was made..." 
// //                   value={formData.description} onChange={handleInputChange} 
// //                 />
// //               </div>

// //               <div className="grid gap-2">
// //                 <Label htmlFor="proof">Upload Receipt/Proof <span className="text-destructive">*</span></Label>
// //                 <Input 
// //                   id="proof" name="proof" type="file" required 
// //                   accept="image/*,.pdf"
// //                   onChange={handleFileChange} 
// //                 />
// //                 <p className="text-[11px] text-muted-foreground">Formats: JPG, PNG, PDF</p>
// //               </div>
// //             </div>
            
// //             <DialogFooter>
// //               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
// //                 Cancel
// //               </Button>
// //               <Button type="submit" disabled={isSubmitting}>
// //                 {isSubmitting ? "Submitting..." : "Submit Ticket"}
// //               </Button>
// //             </DialogFooter>
// //           </form>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }




// import React, { useEffect, useState } from "react";
// import { Plus, Receipt, FileText, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useHR } from "@/hooks/useHR";
// import { toast } from "sonner";

// const EXPENSE_CATEGORIES = [
//   { value: "Travel", label: "Travel" },
//   { value: "Fuel", label: "Fuel" },
//   { value: "Food", label: "Food" },
//   { value: "Office Supplies", label: "Office Supplies" },
//   { value: "Site Material", label: "Site Material" },
//   { value: "Accommodation", label: "Accommodation" },
//   { value: "Communication", label: "Communication" },
//   { value: "Medical", label: "Medical" },
//   { value: "Other", label: "Other" },
// ];

// // Status filter options - use "all" instead of empty string
// const STATUS_OPTIONS = [
//   { value: "all", label: "All Status" },
//   { value: "PENDING", label: "Pending" },
//   { value: "APPROVED", label: "Approved" },
//   { value: "REJECTED", label: "Rejected" },
//   { value: "PAID", label: "Paid" },
// ];

// export default function MyExpenses() {
//   const { 
//     myExpenses = [], 
//     myExpensesPagination = { page: 1, limit: 10, total: 0, pages: 0 },
//     fetchMyExpenses = () => console.warn("fetchMyExpenses is missing in useHR"), 
//     createExpense = async () => { toast.error("createExpense is missing in useHR"); return false; }, 
//     loading = false 
//   } = useHR() || {};

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // Pagination & Filter state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [limit, setLimit] = useState(10);

//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     description: "",
//     amount: "",
//     proof: null,
//   });

//   // Fetch expenses with filters
//   const fetchExpenses = (page = currentPage, status = statusFilter, itemsPerPage = limit) => {
//     const params = {
//       page,
//       limit: itemsPerPage,
//     };
    
//     // Only add status filter if not "all"
//     if (status && status !== "all") {
//       params.status = status;
//     }
    
//     fetchMyExpenses(params);
//   };

//   // Initial fetch and when filters change
//   useEffect(() => {
//     fetchExpenses(currentPage, statusFilter, limit);
//   }, [currentPage, statusFilter, limit]);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= myExpensesPagination.pages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // Handle status filter change
//   const handleStatusFilterChange = (value) => {
//     setStatusFilter(value);
//     setCurrentPage(1); // Reset to first page when filter changes
//   };

//   // Handle limit change
//   const handleLimitChange = (value) => {
//     setLimit(Number(value));
//     setCurrentPage(1); // Reset to first page when limit changes
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFormData((prev) => ({ ...prev, proof: e.target.files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, proof: null }));
//     }
//   };

//   const handleCategoryChange = (value) => {
//     setFormData((prev) => ({ ...prev, category: value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.proof) {
//       return toast.error("Please upload a receipt/proof image or PDF.");
//     }

//     setIsSubmitting(true);

//     const payload = new FormData();
//     payload.append("title", formData.title);
//     payload.append("description", formData.description);
//     payload.append("amount", formData.amount);
//     payload.append("proof", formData.proof);
    
//     if (formData.category) {
//       payload.append("category", formData.category);
//     }

//     const success = await createExpense(payload);
    
//     if (success) {
//       setIsModalOpen(false);
//       setFormData({ title: "", category: "", description: "", amount: "", proof: null });
//       fetchExpenses(currentPage, statusFilter, limit); // Refresh table data
//     }
//     setIsSubmitting(false);
//   };

//   // Helper to style status badges
//   const getStatusBadge = (status) => {
//     switch (status?.toUpperCase()) {
//       case "APPROVED": 
//         return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
//       case "PAID": 
//         return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Paid</Badge>;
//       case "REJECTED": 
//         return <Badge variant="destructive">Rejected</Badge>;
//       default: 
//         return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">Pending</Badge>;
//     }
//   };

//   // Filter logic for search (client-side search on filtered data)
//   const safeExpenses = Array.isArray(myExpenses) ? myExpenses : [];
//   const filteredExpenses = safeExpenses.filter(exp => 
//     (exp?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
//     (exp?.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (exp?.ticketNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Render pagination buttons
//   const renderPaginationButtons = () => {
//     const { pages, page } = myExpensesPagination;
//     if (pages <= 1) return null;

//     const buttons = [];
//     const maxVisible = 5;
//     let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
//     let endPage = Math.min(pages, startPage + maxVisible - 1);

//     if (endPage - startPage + 1 < maxVisible) {
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }

//     // First page button
//     if (startPage > 1) {
//       buttons.push(
//         <Button
//           key="first"
//           variant="outline"
//           size="sm"
//           className="h-8 w-8 p-0"
//           onClick={() => handlePageChange(1)}
//           disabled={loading}
//         >
//           1
//         </Button>
//       );
//       if (startPage > 2) {
//         buttons.push(
//           <span key="ellipsis1" className="px-1 text-muted-foreground">...</span>
//         );
//       }
//     }

//     // Page buttons
//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(
//         <Button
//           key={i}
//           variant={page === i ? "default" : "outline"}
//           size="sm"
//           className="h-8 w-8 p-0"
//           onClick={() => handlePageChange(i)}
//           disabled={loading}
//         >
//           {i}
//         </Button>
//       );
//     }

//     // Last page button
//     if (endPage < pages) {
//       if (endPage < pages - 1) {
//         buttons.push(
//           <span key="ellipsis2" className="px-1 text-muted-foreground">...</span>
//         );
//       }
//       buttons.push(
//         <Button
//           key="last"
//           variant="outline"
//           size="sm"
//           className="h-8 w-8 p-0"
//           onClick={() => handlePageChange(pages)}
//           disabled={loading}
//         >
//           {pages}
//         </Button>
//       );
//     }

//     return buttons;
//   };

//   return (
//     <div className="p-6 space-y-6 max-w-7xl mx-auto">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground flex items-center gap-2">
//             <Receipt className="h-6 w-6 text-primary" />
//             My Expenses
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Track and claim your reimbursements for official work.
//           </p>
//         </div>
        
//         <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
//           <Plus className="mr-2 h-4 w-4" />
//           Raise Ticket
//         </Button>
//       </div>

//       {/* Main Table Card */}
//       <Card>
//         <CardHeader className="flex flex-col gap-4 border-b border-border pb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <CardTitle>Expense History</CardTitle>
//               <CardDescription>Your previously submitted expense claims.</CardDescription>
//             </div>
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search expenses..."
//                 className="pl-9"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
          
//           {/* Filters Row */}
//           <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm font-medium">Filters:</span>
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
//                 <SelectTrigger className="w-[150px]">
//                   <SelectValue placeholder="All Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {STATUS_OPTIONS.map(opt => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={String(limit)} onValueChange={handleLimitChange}>
//                 <SelectTrigger className="w-[100px]">
//                   <SelectValue placeholder="10" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="5">5</SelectItem>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="20">20</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardHeader>
        
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Ticket #</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Title</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Proof</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading && filteredExpenses.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
//                       Loading your expenses...
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : filteredExpenses.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                     {searchTerm || statusFilter !== "all" ? (
//                       <>
//                         No expenses found matching your filters. 
//                         <Button 
//                           variant="link" 
//                           className="text-primary px-1" 
//                           onClick={() => {
//                             setSearchTerm("");
//                             setStatusFilter("all");
//                             setCurrentPage(1);
//                           }}
//                         >
//                           Clear filters
//                         </Button>
//                       </>
//                     ) : (
//                       "No expense tickets found. Raise a new one to get started!"
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredExpenses.map((expense) => (
//                   <TableRow key={expense._id || Math.random()}>
//                     <TableCell className="font-medium text-xs">
//                       <Badge variant="outline" className="font-mono">
//                         {expense.ticketNumber || 'N/A'}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}
//                     </TableCell>
//                     <TableCell className="max-w-[180px] truncate">{expense.title}</TableCell>
//                     <TableCell>
//                       {expense.category ? (
//                         <Badge variant="outline" className="text-[10px] font-normal">{expense.category}</Badge>
//                       ) : (
//                         <span className="text-xs text-muted-foreground">None</span>
//                       )}
//                     </TableCell>
//                     <TableCell>₹{Number(expense.amount).toFixed(2)}</TableCell>
//                     <TableCell>{getStatusBadge(expense.status)}</TableCell>
//                     <TableCell className="text-right">
//                       {expense.proofUrl ? (
//                         <a href={expense.proofUrl} target="_blank" rel="noreferrer">
//                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Proof">
//                             <FileText className="h-4 w-4" />
//                           </Button>
//                         </a>
//                       ) : (
//                         <span className="text-xs text-muted-foreground">N/A</span>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>

//           {/* Pagination */}
//           {myExpensesPagination.pages > 1 && (
//             <div className="flex items-center justify-between px-4 py-3 border-t border-border flex-wrap gap-2">
//               <div className="text-sm text-muted-foreground">
//                 Showing {(myExpensesPagination.page - 1) * myExpensesPagination.limit + 1} to{' '}
//                 {Math.min(myExpensesPagination.page * myExpensesPagination.limit, myExpensesPagination.total)} of{' '}
//                 {myExpensesPagination.total} entries
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage <= 1 || loading}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
                
//                 {renderPaginationButtons()}
                
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage >= myExpensesPagination.pages || loading}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Raise Ticket Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <form onSubmit={handleSubmit}>
//             <DialogHeader>
//               <DialogTitle>Raise Expense Ticket</DialogTitle>
//               <DialogDescription>
//                 Fill in the details below to claim your reimbursement. Don't forget to attach a valid receipt.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="title">Expense Title <span className="text-destructive">*</span></Label>
//                 <Input 
//                   id="title" name="title" required 
//                   placeholder="e.g. Fuel for site visit" 
//                   value={formData.title} 
//                   onChange={handleInputChange} 
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label>Category</Label>
//                   <Select value={formData.category} onValueChange={handleCategoryChange}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select (Optional)" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {EXPENSE_CATEGORIES.map(cat => (
//                         <SelectItem key={cat.value} value={cat.value}>
//                           {cat.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="amount">Amount (₹) <span className="text-destructive">*</span></Label>
//                   <Input 
//                     id="amount" name="amount" type="number" required min="1" step="0.01"
//                     placeholder="0.00" 
//                     value={formData.amount} 
//                     onChange={handleInputChange} 
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="description">Detailed Description <span className="text-destructive">*</span></Label>
//                 <Textarea 
//                   id="description" name="description" required 
//                   placeholder="Explain why this expense was made..." 
//                   value={formData.description} 
//                   onChange={handleInputChange} 
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="proof">Upload Receipt/Proof <span className="text-destructive">*</span></Label>
//                 <Input 
//                   id="proof" name="proof" type="file" required 
//                   accept="image/*,.pdf"
//                   onChange={handleFileChange} 
//                 />
//                 <p className="text-[11px] text-muted-foreground">Formats: JPG, PNG, PDF</p>
//               </div>
//             </div>
            
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit Ticket"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { Plus, Receipt, FileText, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useHR } from "@/hooks/useHR";
// import { toast } from "sonner";

// const EXPENSE_CATEGORIES = [
//   { value: "Travel", label: "Travel" },
//   { value: "Fuel", label: "Fuel" },
//   { value: "Food", label: "Food" },
//   { value: "Office Supplies", label: "Office Supplies" },
//   { value: "Site Material", label: "Site Material" },
//   { value: "Accommodation", label: "Accommodation" },
//   { value: "Communication", label: "Communication" },
//   { value: "Medical", label: "Medical" },
//   { value: "Other", label: "Other" },
// ];

// // Status filter options - use "all" instead of empty string
// const STATUS_OPTIONS = [
//   { value: "all", label: "All Status" },
//   { value: "Pending", label: "Pending" },
//   { value: "Approved", label: "Approved" },
//   { value: "Rejected", label: "Rejected" },
//   { value: "Paid", label: "Paid" },
// ];

// export default function MyExpenses() {
//   const { 
//     myExpenses = [], 
//     myExpensesPagination = { page: 1, limit: 10, total: 0, pages: 0 },
//     fetchMyExpenses = () => console.warn("fetchMyExpenses is missing in useHR"), 
//     createExpense = async () => { toast.error("createExpense is missing in useHR"); return false; }, 
//     loading = false 
//   } = useHR() || {};

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // Pagination & Filter state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [limit, setLimit] = useState(10);

//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     description: "",
//     amount: "",
//     proof: null,
//   });

//   // Fetch expenses with filters
//   const fetchExpenses = (page = currentPage, status = statusFilter, itemsPerPage = limit) => {
//     const params = {
//       page,
//       limit: itemsPerPage,
//     };
    
//     // Only add status filter if not "all"
//     if (status && status !== "all") {
//       params.status = status;
//     }
    
//     fetchMyExpenses(params);
//   };

//   // Initial fetch and when filters change
//   useEffect(() => {
//     fetchExpenses(currentPage, statusFilter, limit);
//   }, [currentPage, statusFilter, limit]);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= myExpensesPagination.pages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // Handle status filter change
//   const handleStatusFilterChange = (value) => {
//     setStatusFilter(value);
//     setCurrentPage(1); // Reset to first page when filter changes
//   };

//   // Handle limit change
//   const handleLimitChange = (value) => {
//     setLimit(Number(value));
//     setCurrentPage(1); // Reset to first page when limit changes
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFormData((prev) => ({ ...prev, proof: e.target.files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, proof: null }));
//     }
//   };

//   const handleCategoryChange = (value) => {
//     setFormData((prev) => ({ ...prev, category: value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.proof) {
//       return toast.error("Please upload a receipt/proof image or PDF.");
//     }

//     setIsSubmitting(true);

//     const payload = new FormData();
//     payload.append("title", formData.title);
//     payload.append("description", formData.description);
//     payload.append("amount", formData.amount);
//     payload.append("proof", formData.proof);
    
//     if (formData.category) {
//       payload.append("category", formData.category);
//     }

//     const success = await createExpense(payload);
    
//     if (success) {
//       setIsModalOpen(false);
//       setFormData({ title: "", category: "", description: "", amount: "", proof: null });
//       fetchExpenses(currentPage, statusFilter, limit); // Refresh table data
//     }
//     setIsSubmitting(false);
//   };

//   // Helper to style status badges
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Approved": 
//         return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
//       case "Paid": 
//         return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Paid</Badge>;
//       case "Rejected": 
//         return <Badge variant="destructive">Rejected</Badge>;
//       case "Pending":
//       default: 
//         return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">Pending</Badge>;
//     }
//   };

//   // Filter logic for search (client-side search on filtered data)
//   const safeExpenses = Array.isArray(myExpenses) ? myExpenses : [];
//   const filteredExpenses = safeExpenses.filter(exp => 
//     (exp?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
//     (exp?.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (exp?.ticketNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Render pagination buttons
//   const renderPaginationButtons = () => {
//     const { pages, page } = myExpensesPagination;
//     if (pages <= 1) return null;

//     const buttons = [];
//     const maxVisible = 5;
//     let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
//     let endPage = Math.min(pages, startPage + maxVisible - 1);

//     if (endPage - startPage + 1 < maxVisible) {
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }

//     // First page button
//     if (startPage > 1) {
//       buttons.push(
//         <Button
//           key="first"
//           variant="outline"
//           size="sm"
//           className="h-8 w-8 p-0"
//           onClick={() => handlePageChange(1)}
//           disabled={loading}
//         >
//           1
//         </Button>
//       );
//       if (startPage > 2) {
//         buttons.push(
//           <span key="ellipsis1" className="px-1 text-muted-foreground">...</span>
//         );
//       }
//     }

//     // Page buttons
//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(
//         <Button
//           key={i}
//           variant={page === i ? "default" : "outline"}
//           size="sm"
//           className="h-8 w-8 p-0"
//           onClick={() => handlePageChange(i)}
//           disabled={loading}
//         >
//           {i}
//         </Button>
//       );
//     }

//     // Last page button
//     if (endPage < pages) {
//       if (endPage < pages - 1) {
//         buttons.push(
//           <span key="ellipsis2" className="px-1 text-muted-foreground">...</span>
//         );
//       }
//       buttons.push(
//         <Button
//           key="last"
//           variant="outline"
//           size="sm"
//           className="h-8 w-8 p-0"
//           onClick={() => handlePageChange(pages)}
//           disabled={loading}
//         >
//           {pages}
//         </Button>
//       );
//     }

//     return buttons;
//   };

//   return (
//     <div className="p-6 space-y-6 max-w-7xl mx-auto">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground flex items-center gap-2">
//             <Receipt className="h-6 w-6 text-primary" />
//             My Expenses
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Track and claim your reimbursements for official work.
//           </p>
//         </div>
        
//         <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
//           <Plus className="mr-2 h-4 w-4" />
//           Raise Ticket
//         </Button>
//       </div>

//       {/* Main Table Card */}
//       <Card>
//         <CardHeader className="flex flex-col gap-4 border-b border-border pb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div>
//               <CardTitle>Expense History</CardTitle>
//               <CardDescription>Your previously submitted expense claims.</CardDescription>
//             </div>
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search expenses..."
//                 className="pl-9"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
          
//           {/* Filters Row */}
//           <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm font-medium">Filters:</span>
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
//                 <SelectTrigger className="w-[150px]">
//                   <SelectValue placeholder="All Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {STATUS_OPTIONS.map(opt => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={String(limit)} onValueChange={handleLimitChange}>
//                 <SelectTrigger className="w-[100px]">
//                   <SelectValue placeholder="10" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="5">5</SelectItem>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="20">20</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardHeader>
        
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Ticket #</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Title</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Proof</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading && filteredExpenses.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
//                       Loading your expenses...
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : filteredExpenses.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
//                     {searchTerm || statusFilter !== "all" ? (
//                       <>
//                         No expenses found matching your filters. 
//                         <Button 
//                           variant="link" 
//                           className="text-primary px-1" 
//                           onClick={() => {
//                             setSearchTerm("");
//                             setStatusFilter("all");
//                             setCurrentPage(1);
//                           }}
//                         >
//                           Clear filters
//                         </Button>
//                       </>
//                     ) : (
//                       "No expense tickets found. Raise a new one to get started!"
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredExpenses.map((expense) => (
//                   <TableRow key={expense._id || Math.random()}>
//                     <TableCell className="font-medium text-xs">
//                       <Badge variant="outline" className="font-mono">
//                         {expense.ticketNumber || 'N/A'}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}
//                     </TableCell>
//                     <TableCell className="max-w-[180px] truncate">{expense.title}</TableCell>
//                     <TableCell>
//                       {expense.category ? (
//                         <Badge variant="outline" className="text-[10px] font-normal">{expense.category}</Badge>
//                       ) : (
//                         <span className="text-xs text-muted-foreground">None</span>
//                       )}
//                     </TableCell>
//                     <TableCell>₹{Number(expense.amount).toFixed(2)}</TableCell>
//                     <TableCell>{getStatusBadge(expense.status)}</TableCell>
//                     <TableCell className="text-right">
//                       {expense.proofUrl ? (
//                         <a href={expense.proofUrl} target="_blank" rel="noreferrer">
//                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Proof">
//                             <FileText className="h-4 w-4" />
//                           </Button>
//                         </a>
//                       ) : (
//                         <span className="text-xs text-muted-foreground">N/A</span>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>

//           {/* Pagination */}
//           {myExpensesPagination.pages > 1 && (
//             <div className="flex items-center justify-between px-4 py-3 border-t border-border flex-wrap gap-2">
//               <div className="text-sm text-muted-foreground">
//                 Showing {(myExpensesPagination.page - 1) * myExpensesPagination.limit + 1} to{' '}
//                 {Math.min(myExpensesPagination.page * myExpensesPagination.limit, myExpensesPagination.total)} of{' '}
//                 {myExpensesPagination.total} entries
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage <= 1 || loading}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
                
//                 {renderPaginationButtons()}
                
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage >= myExpensesPagination.pages || loading}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Raise Ticket Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <form onSubmit={handleSubmit}>
//             <DialogHeader>
//               <DialogTitle>Raise Expense Ticket</DialogTitle>
//               <DialogDescription>
//                 Fill in the details below to claim your reimbursement. Don't forget to attach a valid receipt.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="title">Expense Title <span className="text-destructive">*</span></Label>
//                 <Input 
//                   id="title" name="title" required 
//                   placeholder="e.g. Fuel for site visit" 
//                   value={formData.title} 
//                   onChange={handleInputChange} 
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label>Category</Label>
//                   <Select value={formData.category} onValueChange={handleCategoryChange}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select (Optional)" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {EXPENSE_CATEGORIES.map(cat => (
//                         <SelectItem key={cat.value} value={cat.value}>
//                           {cat.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="amount">Amount (₹) <span className="text-destructive">*</span></Label>
//                   <Input 
//                     id="amount" name="amount" type="number" required min="1" step="0.01"
//                     placeholder="0.00" 
//                     value={formData.amount} 
//                     onChange={handleInputChange} 
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="description">Detailed Description <span className="text-destructive">*</span></Label>
//                 <Textarea 
//                   id="description" name="description" required 
//                   placeholder="Explain why this expense was made..." 
//                   value={formData.description} 
//                   onChange={handleInputChange} 
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="proof">Upload Receipt/Proof <span className="text-destructive">*</span></Label>
//                 <Input 
//                   id="proof" name="proof" type="file" required 
//                   accept="image/*,.pdf"
//                   onChange={handleFileChange} 
//                 />
//                 <p className="text-[11px] text-muted-foreground">Formats: JPG, PNG, PDF</p>
//               </div>
//             </div>
            
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit Ticket"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { Plus, Receipt, FileText, Search, Filter, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

const EXPENSE_CATEGORIES = [
  { value: "Travel", label: "Travel" },
  { value: "Fuel", label: "Fuel" },
  { value: "Food", label: "Food" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Site Material", label: "Site Material" },
  { value: "Accommodation", label: "Accommodation" },
  { value: "Communication", label: "Communication" },
  { value: "Medical", label: "Medical" },
  { value: "Other", label: "Other" },
];

// Status filter options - use "all" instead of empty string
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Paid", label: "Paid" },
];

export default function MyExpenses() {
  const { 
    myExpenses = [], 
    myExpensesPagination = { page: 1, limit: 10, total: 0, pages: 0 },
    fetchMyExpenses = () => console.warn("fetchMyExpenses is missing in useHR"), 
    createExpense = async () => { toast.error("createExpense is missing in useHR"); return false; }, 
    loading = false 
  } = useHR() || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination & Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(10);

  // View Details Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    amount: "",
    proof: null,
  });

  // Fetch expenses with filters
  const fetchExpenses = (page = currentPage, status = statusFilter, itemsPerPage = limit) => {
    const params = {
      page,
      limit: itemsPerPage,
    };
    
    // Only add status filter if not "all"
    if (status && status !== "all") {
      params.status = status;
    }
    
    fetchMyExpenses(params);
  };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchExpenses(currentPage, statusFilter, limit);
  }, [currentPage, statusFilter, limit]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= myExpensesPagination.pages) {
      setCurrentPage(newPage);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle limit change
  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, proof: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, proof: null }));
    }
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.proof) {
      return toast.error("Please upload a receipt/proof image or PDF.");
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("amount", formData.amount);
    payload.append("proof", formData.proof);
    
    if (formData.category) {
      payload.append("category", formData.category);
    }

    const success = await createExpense(payload);
    
    if (success) {
      setIsModalOpen(false);
      setFormData({ title: "", category: "", description: "", amount: "", proof: null });
      fetchExpenses(currentPage, statusFilter, limit); // Refresh table data
    }
    setIsSubmitting(false);
  };

  // Helper to style status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": 
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
      case "Paid": 
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Paid</Badge>;
      case "Rejected": 
        return <Badge variant="destructive">Rejected</Badge>;
      case "Pending":
      default: 
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">Pending</Badge>;
    }
  };

  // Filter logic for search (client-side search on filtered data)
  const safeExpenses = Array.isArray(myExpenses) ? myExpenses : [];
  const filteredExpenses = safeExpenses.filter(exp => 
    (exp?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (exp?.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp?.ticketNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp?.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp?.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // View Expense Details
  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setViewModalOpen(true);
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const { pages, page } = myExpensesPagination;
    if (pages <= 1) return null;

    const buttons = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(pages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page button
    if (startPage > 1) {
      buttons.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handlePageChange(1)}
          disabled={loading}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-1 text-muted-foreground">...</span>
        );
      }
    }

    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={page === i ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handlePageChange(i)}
          disabled={loading}
        >
          {i}
        </Button>
      );
    }

    // Last page button
    if (endPage < pages) {
      if (endPage < pages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-1 text-muted-foreground">...</span>
        );
      }
      buttons.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handlePageChange(pages)}
          disabled={loading}
        >
          {pages}
        </Button>
      );
    }

    return buttons;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            My Expenses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and claim your reimbursements for official work.
          </p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Raise Ticket
        </Button>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>Your previously submitted expense claims.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={String(limit)} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      Loading your expenses...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter !== "all" ? (
                      <>
                        No expenses found matching your filters. 
                        <Button 
                          variant="link" 
                          className="text-primary px-1" 
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setCurrentPage(1);
                          }}
                        >
                          Clear filters
                        </Button>
                      </>
                    ) : (
                      "No expense tickets found. Raise a new one to get started!"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense._id || Math.random()}>
                    <TableCell className="font-medium text-xs">
                      <Badge variant="outline" className="font-mono">
                        {expense.ticketNumber || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{expense.title}</TableCell>
                    <TableCell>
                      {expense.category ? (
                        <Badge variant="outline" className="text-[10px] font-normal">{expense.category}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">₹{Number(expense.amount).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewExpense(expense)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {myExpensesPagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border flex-wrap gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {(myExpensesPagination.page - 1) * myExpensesPagination.limit + 1} to{' '}
                {Math.min(myExpensesPagination.page * myExpensesPagination.limit, myExpensesPagination.total)} of{' '}
                {myExpensesPagination.total} entries
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {renderPaginationButtons()}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= myExpensesPagination.pages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raise Ticket Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Raise Expense Ticket</DialogTitle>
              <DialogDescription>
                Fill in the details below to claim your reimbursement. Don't forget to attach a valid receipt.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Expense Title <span className="text-destructive">*</span></Label>
                <Input 
                  id="title" name="title" required 
                  placeholder="e.g. Fuel for site visit" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (₹) <span className="text-destructive">*</span></Label>
                  <Input 
                    id="amount" name="amount" type="number" required min="1" step="0.01"
                    placeholder="0.00" 
                    value={formData.amount} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Detailed Description <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="description" name="description" required 
                  placeholder="Explain why this expense was made..." 
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="proof">Upload Receipt/Proof <span className="text-destructive">*</span></Label>
                <Input 
                  id="proof" name="proof" type="file" required 
                  accept="image/*,.pdf"
                  onChange={handleFileChange} 
                />
                <p className="text-[11px] text-muted-foreground">Formats: JPG, PNG, PDF</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Expense Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-8">
              <span>Expense Details</span>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedExpense?.ticketNumber || 'N/A'}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Complete information about this expense claim
            </DialogDescription>
          </DialogHeader>
          
          {selectedExpense && (
            <div className="space-y-4 py-4">
              {/* Status & Amount Row */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedExpense.status)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Amount</Label>
                  <p className="text-lg font-semibold text-primary mt-1">
                    {formatCurrency(selectedExpense.amount)}
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Title</Label>
                  <p className="font-medium mt-1 break-words">{selectedExpense.title || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Category</Label>
                  <p className="mt-1">
                    {selectedExpense.category ? (
                      <Badge variant="outline">{selectedExpense.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not specified</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Description</Label>
                <p className="mt-1 text-sm bg-muted/20 p-3 rounded-md border border-border/50 whitespace-pre-wrap break-words">
                  {selectedExpense.description || 'No description provided'}
                </p>
              </div>

              {/* Proof */}
              {selectedExpense.proofUrl && (
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Proof / Receipt</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <a 
                      href={selectedExpense.proofUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      View Receipt
                    </a>
                    <span className="text-xs text-muted-foreground">
                      ({selectedExpense.proofMimeType || 'image'})
                    </span>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Created</Label>
                  <p className="text-sm mt-1">{formatDate(selectedExpense.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Last Updated</Label>
                  <p className="text-sm mt-1">{formatDate(selectedExpense.updatedAt)}</p>
                </div>
              </div>

              {/* Approval/Rejection Details */}
              {(selectedExpense.status === 'Approved' || selectedExpense.status === 'Paid') && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Label className="text-xs text-green-700 dark:text-green-400 uppercase tracking-wider">Approval Details</Label>
                  <div className="mt-1 space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Approved by:</span> {selectedExpense.approvedBy || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Approved at:</span> {formatDate(selectedExpense.approvedAt)}</p>
                    {selectedExpense.approverRemarks && (
                      <p><span className="text-muted-foreground">Remarks:</span> {selectedExpense.approverRemarks}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedExpense.status === 'Rejected' && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <Label className="text-xs text-red-700 dark:text-red-400 uppercase tracking-wider">Rejection Details</Label>
                  <div className="mt-1 space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Rejected by:</span> {selectedExpense.approvedBy || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Rejected at:</span> {formatDate(selectedExpense.approvedAt)}</p>
                    {selectedExpense.rejectionReason && (
                      <p><span className="text-muted-foreground">Reason:</span> {selectedExpense.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedExpense.status === 'Paid' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Label className="text-xs text-blue-700 dark:text-blue-400 uppercase tracking-wider">Payment Details</Label>
                  <div className="mt-1 space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Method:</span> {selectedExpense.paymentMethod || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Reference:</span> {selectedExpense.paymentReference || 'N/A'}</p>
                    <p><span className="text-muted-foreground">Paid at:</span> {formatDate(selectedExpense.paidAt)}</p>
                    {selectedExpense.paymentRemarks && (
                      <p><span className="text-muted-foreground">Remarks:</span> {selectedExpense.paymentRemarks}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}