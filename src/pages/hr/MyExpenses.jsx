import React, { useEffect, useState } from "react";
import { 
  Plus, Receipt, FileText, Search, Filter, ChevronLeft, ChevronRight, 
  Eye, X, Hash, Tag, CheckCircle, XCircle, DollarSign 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(10);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    amount: "",
    proof: null,
  });

  const fetchExpenses = (page = currentPage, status = statusFilter, itemsPerPage = limit) => {
    const params = { page, limit: itemsPerPage };
    if (status && status !== "all") {
      params.status = status;
    }
    fetchMyExpenses(params);
  };

  useEffect(() => {
    fetchExpenses(currentPage, statusFilter, limit);
  }, [currentPage, statusFilter, limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= myExpensesPagination.pages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setCurrentPage(1);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.proof) {
      return toast.error("Please upload a receipt/proof image or PDF.");
    }

    setIsSubmitting(true);

    try {
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
        fetchExpenses(currentPage, statusFilter, limit);
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
      toast.error("Something went wrong while submitting the ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return <Badge variant="secondary" className="bg-green-100 text-green-800 border-transparent">Approved</Badge>;
      case "Paid": return <Badge variant="default" className="bg-blue-100 text-blue-800 border-transparent hover:bg-blue-200">Paid</Badge>;
      case "Rejected": return <Badge variant="destructive">Rejected</Badge>;
      case "Pending":
      default: return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    }
  };

  const safeExpenses = Array.isArray(myExpenses) ? myExpenses : [];
  const filteredExpenses = safeExpenses.filter(exp => 
    (exp?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (exp?.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp?.ticketNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp?.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp?.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setViewModalOpen(true);
  };

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

    if (startPage > 1) {
      buttons.push(<Button key="first" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handlePageChange(1)} disabled={loading}>1</Button>);
      if (startPage > 2) buttons.push(<span key="ellipsis1" className="px-1 text-muted-foreground">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button key={i} variant={page === i ? "default" : "outline"} size="sm" className="h-8 w-8 p-0" onClick={() => handlePageChange(i)} disabled={loading}>
          {i}
        </Button>
      );
    }

    if (endPage < pages) {
      if (endPage < pages - 1) buttons.push(<span key="ellipsis2" className="px-1 text-muted-foreground">...</span>);
      buttons.push(<Button key="last" variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handlePageChange(pages)} disabled={loading}>{pages}</Button>);
    }

    return buttons;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            My Expenses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track and claim your reimbursements for official work.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Raise Ticket
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>Your previously submitted expense claims.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search expenses..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={String(limit)} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-[100px]"><SelectValue placeholder="10" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead><TableHead>Date</TableHead><TableHead>Title</TableHead>
                <TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead>
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
                        No expenses found. <Button variant="link" className="text-primary px-1" onClick={() => { setSearchTerm(""); setStatusFilter("all"); setCurrentPage(1); }}>Clear filters</Button>
                      </>
                    ) : "No expense tickets found. Raise a new one to get started!"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense._id || Math.random()}>
                    <TableCell className="font-medium text-xs">
                      <Badge variant="outline" className="font-mono">{expense.ticketNumber || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{expense.title}</TableCell>
                    <TableCell>
                      {expense.category ? <Badge variant="outline" className="text-[10px] font-normal">{expense.category}</Badge> : <span className="text-xs text-muted-foreground">None</span>}
                    </TableCell>
                    <TableCell className="font-medium">₹{Number(expense.amount).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewExpense(expense)} title="View Details">
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {myExpensesPagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border flex-wrap gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {(myExpensesPagination.page - 1) * myExpensesPagination.limit + 1} to{' '}
                {Math.min(myExpensesPagination.page * myExpensesPagination.limit, myExpensesPagination.total)} of {myExpensesPagination.total} entries
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1 || loading}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {renderPaginationButtons()}
                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= myExpensesPagination.pages || loading}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE TICKET MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Raise Expense Ticket</DialogTitle>
              <DialogDescription>Fill in the details below to claim your reimbursement.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Expense Title <span className="text-destructive">*</span></Label>
                <Input id="title" name="title" required placeholder="e.g. Fuel for site visit" value={formData.title} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger><SelectValue placeholder="Select (Optional)" /></SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (₹) <span className="text-destructive">*</span></Label>
                  <Input id="amount" name="amount" type="number" required min="1" step="0.01" placeholder="0.00" value={formData.amount} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Detailed Description <span className="text-destructive">*</span></Label>
                <Textarea id="description" name="description" required placeholder="Explain why this expense was made..." value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="proof">Upload Receipt/Proof <span className="text-destructive">*</span></Label>
                <Input id="proof" name="proof" type="file" required accept="image/*,.pdf" onChange={handleFileChange} />
                <p className="text-[11px] text-muted-foreground">Formats: JPG, PNG, PDF</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>Submitting...</> : "Submit Ticket"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* FULLY DETAILED VIEW MODAL */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Expense Details
            </DialogTitle>
          </DialogHeader>

          {selectedExpense && (
            <div className="space-y-6 py-4">
              
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber || "N/A"}</span>
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(selectedExpense.status)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{formatCurrency(selectedExpense.amount)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Requested on: {formatDate(selectedExpense.createdAt)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2 mb-1">
                      <Tag className="h-4 w-4" /> Category
                    </Label>
                    <div className="font-medium text-base">{selectedExpense.category || "N/A"}</div>
                  </div>
                </div>
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

              {/* Approval Info Section */}
              {(selectedExpense.status === "Approved" || selectedExpense.status === "Paid") && selectedExpense.approvedAt && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4" /> Approval Details
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Approved On</span>
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

              {/* Payment Info Section */}
              {selectedExpense.status === "Paid" && selectedExpense.paidAt && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                      <DollarSign className="h-4 w-4" /> Payment Details
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
                        <span className="text-xs text-muted-foreground">Paid On</span>
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
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}