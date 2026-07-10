// // src/pages/finance/FinancePayrollApprovals.jsx
import React, { useEffect, useState } from "react";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinance } from "@/hooks/useFinance";
import { Loader2, CheckCircle, XCircle, Send, Banknote, Download, CheckSquare } from "lucide-react";
import { toast } from "sonner";

export function FinancePayrollApprovals() {
    const { 
        pendingPayrollBatches, 
        payrollBatches,
        pagination, // <-- Extract pagination here
        fetchPendingPayrollApprovals, 
        fetchAllPayrollBatches,
        fetchPayrollBatchById,
        acknowledgePayrollBatch,
        approvePayrollBatch, 
        rejectPayrollBatch, 
        sendPayrollToBank, 
        markPayrollBankProcessed, 
        loading 
    } = useFinance();

    const [activeTab, setActiveTab] = useState("pending");
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [action, setAction] = useState(null); // 'reject', 'sendToBank', 'confirmPayment'
    const [formData, setFormData] = useState({});
    
    // Naya State: Pagination ke liye
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // Fetch data based on active tab and currentPage
    useEffect(() => {
        if (activeTab === "pending") {
            fetchPendingPayrollApprovals({ page: currentPage, limit });
        } else {
            fetchAllPayrollBatches({ page: currentPage, limit });
        }
    }, [activeTab, currentPage, fetchPendingPayrollApprovals, fetchAllPayrollBatches]);

    // Reset pagination jab bhi tab change ho
    const handleTabChange = (value) => {
        setActiveTab(value);
        setCurrentPage(1);
    };

    // Helper function to refresh current view
    const refreshData = () => {
        if (activeTab === "pending") {
            fetchPendingPayrollApprovals({ page: currentPage, limit });
        } else {
            fetchAllPayrollBatches({ page: currentPage, limit });
        }
    };

    const handleActionSubmit = async () => {
        if (!selectedBatch) return;
        
        let success = false;
        if (action === 'reject') {
            success = await rejectPayrollBatch(selectedBatch._id, { reason: formData.reason });
        } else if (action === 'sendToBank') {
            success = await sendPayrollToBank(selectedBatch._id, formData);
        } else if (action === 'confirmPayment') {
            success = await markPayrollBankProcessed(selectedBatch._id, { 
                bankConfirmationRef: formData.utr,
                remarks: formData.remarks 
            });
        }
        
        if (success) {
            setAction(null);
            setFormData({});
            // Action ke baad current page ko clean refetch karo
            refreshData();
        }
    };

    const handleDownloadExcel = async (id) => {
        const batchDetail = await fetchPayrollBatchById(id);
        // Updated to use fileUrl instead of excelUrl
        if (batchDetail && batchDetail.fileUrl) {
            window.open(batchDetail.fileUrl, "_blank");
        } else {
            toast.error("Excel file not found for this batch.");
        }
    };

    const handleAcknowledge = async (id) => {
        const success = await acknowledgePayrollBatch(id);
        if (success) refreshData();
    };

    const handleApprove = async (id) => {
        const success = await approvePayrollBatch(id);
        if (success) refreshData();
    };

    const getStatusVariant = (status) => {
        switch(status) {
            case 'Pending Finance Approval': return "outline";
            case 'Approved': return "secondary";
            case 'Sent to Bank': return "default";
            case 'Bank Processed': return "success";
            case 'Rejected': return "destructive";
            default: return "default";
        }
    };

    const renderTable = (batches) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Month/Year</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {batches.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-6">No batches found</TableCell></TableRow>
                ) : (
                    batches.map((batch) => (
                        <TableRow key={batch._id}>
                            <TableCell className="font-medium">{batch.month} {batch.year}</TableCell>
                            <TableCell>₹{batch.totalAmount?.toLocaleString('en-IN')}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(batch.status)}>{batch.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                {/* Download/View Excel Button */}
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleDownloadExcel(batch._id)} 
                                    title="View Excel Details"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>

                                {/* Acknowledge & Approve/Reject */}
                                {batch.status === 'Pending Finance Approval' && (
                                    <>
                                        <Button size="sm" variant="outline" onClick={() => handleAcknowledge(batch._id)}>
                                            <CheckSquare className="mr-2 h-4 w-4"/>Acknowledge
                                        </Button>
                                        <Button size="sm" onClick={() => handleApprove(batch._id)}>
                                            <CheckCircle className="mr-2 h-4 w-4"/>Approve
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => { setSelectedBatch(batch); setAction('reject'); }}>
                                            <XCircle className="mr-2 h-4 w-4"/>Reject
                                        </Button>
                                    </>
                                )}

                                {/* Send to Bank */}
                                {batch.status === 'Approved' && (
                                    <Button size="sm" onClick={() => { setSelectedBatch(batch); setAction('sendToBank'); }}>
                                        <Send className="mr-2 h-4 w-4"/>Send to Bank
                                    </Button>
                                )}

                                {/* Confirm Bank Payment */}
                                {batch.status === 'Sent to Bank' && (
                                    <Button size="sm" variant="secondary" onClick={() => { setSelectedBatch(batch); setAction('confirmPayment'); }}>
                                        <Banknote className="mr-2 h-4 w-4"/>Confirm Payment
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    // Reusable Pagination UI Component
    const renderPagination = () => {
        if (loading || !pagination || pagination.total === 0) return null;
        
        return (
            <div className="flex items-center justify-between pt-4 mt-2 border-t">
                <div className="text-sm text-muted-foreground">
                    Showing page {pagination.page} of {pagination.pages} (Total: {pagination.total} batches)
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
        );
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Payroll Approvals</h3>
            
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                    <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
                    <TabsTrigger value="history">All Payroll History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="mt-4">
                    <div className="rounded-md border p-0">
                        {renderTable(pendingPayrollBatches)}
                    </div>
                    {/* Render Pagination specific to pending tab */}
                    {renderPagination()}
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                    <div className="rounded-md border p-0">
                        {renderTable(payrollBatches)}
                    </div>
                    {/* Render Pagination specific to history tab */}
                    {renderPagination()}
                </TabsContent>
            </Tabs>

            {/* ACTION DIALOGS */}
            <Dialog open={!!action} onOpenChange={() => setAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {action === 'reject' && "Reject Payroll Batch"}
                            {action === 'sendToBank' && "Send to Bank Instructions"}
                            {action === 'confirmPayment' && "Confirm Bank Payment"}
                        </DialogTitle>
                        <DialogDescription>
                            {action === 'reject' && "Provide a reason why this payroll batch is being rejected."}
                            {action === 'sendToBank' && "Enter bank transfer reference details to proceed."}
                            {action === 'confirmPayment' && "Enter the UTR or transaction confirmation number."}
                        </DialogDescription>
                    </DialogHeader>

                    {action === 'reject' && (
                        <div className="grid gap-2">
                            <Label>Rejection Reason</Label>
                            <Input onChange={(e) => setFormData({ reason: e.target.value })} placeholder="Enter reason..." />
                        </div>
                    )}

                    {action === 'sendToBank' && (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Bank Ref Number</Label>
                                <Input onChange={(e) => setFormData({...formData, bankReferenceNumber: e.target.value})} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Bank Name</Label>
                                <Input onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Remarks (Optional)</Label>
                                <Input onChange={(e) => setFormData({...formData, remarks: e.target.value})} placeholder="Any additional remarks..." />
                            </div>
                        </div>
                    )}

                    {action === 'confirmPayment' && (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>UTR Number</Label>
                                <Input onChange={(e) => setFormData({ ...formData, utr: e.target.value })} placeholder="Enter UTR number..." />
                            </div>
                            <div className="grid gap-2">
                                <Label>Remarks (Optional)</Label>
                                <Input onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Any additional remarks..." />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
                        <Button onClick={handleActionSubmit} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}