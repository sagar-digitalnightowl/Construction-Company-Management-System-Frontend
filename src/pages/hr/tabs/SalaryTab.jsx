// import React, { useEffect, useState } from "react";
// import { 
//     Card, CardContent, CardHeader, CardTitle, CardDescription 
// } from "@/components/ui/card";
// import { 
//     Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//     Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { 
//     Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
// } from "@/components/ui/select";
// import { Download, Send, FileSpreadsheet, RefreshCcw } from "lucide-react";
// import { useHR } from "@/hooks/useHR";
// import { formatDate } from "@/lib/helpers"; 

// export function SalaryTab() {
//     const { 
//         companySalarySlips,  // ✅ Using company-wide slips instead of personal ones
//         fetchAllSalarySlips, // ✅ New API hook
//         myPayrollBatches, 
//         fetchMyPayrollBatches, 
//         downloadSalaryReport, 
//         submitPayrollForApproval,
//         loading 
//     } = useHR();

//     const [actionDialogOpen, setActionDialogOpen] = useState(false);
//     const [actionType, setActionType] = useState("download"); // 'download' or 'submit'
    
//     // Default to current month and year for Modal Actions
//     const [selectedMonth, setSelectedMonth] = useState(
//         new Date().toLocaleString('default', { month: 'long' })
//     );
//     const [selectedYear, setSelectedYear] = useState(
//         new Date().getFullYear().toString()
//     );

//     // Filters for "Individual Salary Slips" Tab
//     const [slipMonth, setSlipMonth] = useState(
//         new Date().toLocaleString('default', { month: 'long' })
//     );
//     const [slipYear, setSlipYear] = useState(
//         new Date().getFullYear().toString()
//     );

//     // Fetch batches on mount
//     useEffect(() => {
//         fetchMyPayrollBatches();
//     }, [fetchMyPayrollBatches]);

//     // Fetch company salary slips whenever the slip tab filters change
//     useEffect(() => {
//         fetchAllSalarySlips({ month: slipMonth, year: parseInt(slipYear) });
//     }, [slipMonth, slipYear, fetchAllSalarySlips]);

//     const months = [
//         "January", "February", "March", "April", "May", "June", 
//         "July", "August", "September", "October", "November", "December"
//     ];
//     const years = ["2024", "2025", "2026", "2027"];

//     const handleActionClick = (type) => {
//         setActionType(type);
//         setActionDialogOpen(true);
//     };

//     // Auto-fill and open modal for Rejected batches
//     const handleResubmit = (batch) => {
//         setSelectedMonth(batch.month);
//         setSelectedYear(batch.year.toString());
//         setActionType("submit");
//         setActionDialogOpen(true);
//     };

//     const handleConfirmAction = async () => {
//         const payload = { month: selectedMonth, year: parseInt(selectedYear) };
        
//         if (actionType === "download") {
//             await downloadSalaryReport(payload);
//         } else if (actionType === "submit") {
//             const success = await submitPayrollForApproval(payload);
//             if (success) {
//                 setActionDialogOpen(false);
//             }
//         }
//     };

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case "Pending Finance Approval": return "warning";
//             case "Approved": return "default";
//             case "Sent to Bank": return "secondary";
//             case "Bank Processed": return "success";
//             case "Rejected": return "destructive";
//             default: return "outline";
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                     <h2 className="text-2xl font-bold tracking-tight">Payroll & Salary</h2>
//                     <p className="text-muted-foreground text-sm">Manage company salary slips and submit payroll batches to finance.</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" onClick={() => handleActionClick("download")}>
//                         <Download className="mr-2 h-4 w-4" />
//                         Preview Excel Report
//                     </Button>
//                     <Button onClick={() => handleActionClick("submit")}>
//                         <Send className="mr-2 h-4 w-4" />
//                         Submit to Finance
//                     </Button>
//                 </div>
//             </div>

//             <Tabs defaultValue="batches" className="w-full">
//                 <TabsList className="grid w-full max-w-md grid-cols-2">
//                     <TabsTrigger value="batches">Payroll Batches (Finance)</TabsTrigger>
//                     <TabsTrigger value="slips">All Salary Slips</TabsTrigger>
//                 </TabsList>

//                 {/* PAYROLL BATCHES TAB */}
//                 <TabsContent value="batches" className="mt-4">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>My Payroll Submissions</CardTitle>
//                             <CardDescription>Track the status of payroll batches submitted to finance.</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             {myPayrollBatches.length === 0 ? (
//                                 <div className="text-center py-10 text-muted-foreground">
//                                     <FileSpreadsheet className="mx-auto h-10 w-10 mb-3 opacity-20" />
//                                     <p>No payroll batches submitted yet.</p>
//                                 </div>
//                             ) : (
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead>Month</TableHead>
//                                             <TableHead>Total Employees</TableHead>
//                                             <TableHead>Total Amount</TableHead>
//                                             <TableHead>Status</TableHead>
//                                             <TableHead>Submitted On</TableHead>
//                                             <TableHead className="text-right">Action</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {myPayrollBatches.map((batch) => (
//                                             <TableRow key={batch._id}>
//                                                 <TableCell className="font-medium">
//                                                     {batch.month} {batch.year}
//                                                 </TableCell>
//                                                 <TableCell>{batch.totalEmployees}</TableCell>
//                                                 <TableCell>₹{(batch.totalAmount || 0).toLocaleString('en-IN')}</TableCell>
//                                                 <TableCell>
//                                                     <Badge variant={getStatusBadge(batch.status)}>
//                                                         {batch.status}
//                                                     </Badge>
//                                                     {batch.status === "Rejected" && batch.remarks && (
//                                                         <p className="text-xs text-destructive mt-1">Reason: {batch.remarks}</p>
//                                                     )}
//                                                 </TableCell>
//                                                 <TableCell>{formatDate(batch.createdAt)}</TableCell>
//                                                 <TableCell className="text-right">
//                                                     {batch.status === "Rejected" && (
//                                                         <Button 
//                                                             variant="outline" 
//                                                             size="sm" 
//                                                             onClick={() => handleResubmit(batch)}
//                                                         >
//                                                             <RefreshCcw className="mr-2 h-3 w-3" />
//                                                             Resubmit
//                                                         </Button>
//                                                     )}
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 {/* SALARY SLIPS TAB (Updated to show company-wide slips with filters) */}
//                 <TabsContent value="slips" className="mt-4">
//                     <Card>
//                         <CardHeader className="flex flex-row items-center justify-between pb-2">
//                             <div>
//                                 <CardTitle>Generated Salary Slips</CardTitle>
//                                 <CardDescription>View all employee salary slips for a specific month.</CardDescription>
//                             </div>
//                             {/* ✅ NEW: Month & Year Filters */}
//                             <div className="flex gap-2">
//                                 <Select value={slipMonth} onValueChange={setSlipMonth}>
//                                     <SelectTrigger className="w-[140px]">
//                                         <SelectValue placeholder="Month" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
//                                     </SelectContent>
//                                 </Select>
//                                 <Select value={slipYear} onValueChange={setSlipYear}>
//                                     <SelectTrigger className="w-[100px]">
//                                         <SelectValue placeholder="Year" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {companySalarySlips.length === 0 ? (
//                                 <div className="text-center py-10 text-muted-foreground">
//                                     <p>No salary slips found for {slipMonth} {slipYear}.</p>
//                                 </div>
//                             ) : (
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead>Employee</TableHead>
//                                             <TableHead>Month</TableHead>
//                                             <TableHead>Net Pay</TableHead>
//                                             <TableHead>Status</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {companySalarySlips.map((slip) => (
//                                             <TableRow key={slip._id}>
//                                                 <TableCell className="font-medium">{slip.employeeId?.name || "Unknown"}</TableCell>
//                                                 <TableCell>{slip.month} {slip.year}</TableCell>
//                                                 <TableCell>₹{(slip.netPay || 0).toLocaleString('en-IN')}</TableCell>
//                                                 <TableCell>
//                                                     <Badge variant={slip.paymentStatus === 'Paid' ? 'success' : 'outline'}>
//                                                         {slip.paymentStatus}
//                                                     </Badge>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>

//             {/* ACTION DIALOG (Download / Submit) */}
//             <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
//                 <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>
//                             {actionType === "download" ? "Download Salary Report" : "Submit Payroll for Approval"}
//                         </DialogTitle>
//                     </DialogHeader>
                    
//                     <div className="grid gap-4 py-4">
//                         {/* ✅ NEW: Verification Warning */}
//                         {actionType === "download" && (
//                             <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
//                                 ⚠️ Please verify the downloaded Excel sheet data carefully before submitting it to Finance for approval.
//                             </p>
//                         )}
//                         <div className="grid grid-cols-4 items-center gap-4">
//                             <Label htmlFor="month" className="text-right">Month</Label>
//                             <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                                 <SelectTrigger className="col-span-3">
//                                     <SelectValue placeholder="Select Month" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div className="grid grid-cols-4 items-center gap-4">
//                             <Label htmlFor="year" className="text-right">Year</Label>
//                             <Select value={selectedYear} onValueChange={setSelectedYear}>
//                                 <SelectTrigger className="col-span-3">
//                                     <SelectValue placeholder="Select Year" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
//                         <Button onClick={handleConfirmAction} disabled={loading}>
//                             {loading ? "Processing..." : actionType === "download" ? "Download Excel" : "Confirm Submit"}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }



// src/pages/hr/tabs/SalaryTab.tsx

import React, { useEffect, useState } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Download, Send, FileSpreadsheet, RefreshCcw, Eye, Loader2,
    FileText, Users, AlertCircle
} from "lucide-react";
import { useHR } from "@/hooks/useHR";
import { formatDate } from "@/lib/helpers";
import { toast } from "sonner";

export function SalaryTab() {
    const {
        companySalarySlips,
        fetchAllSalarySlips,
        myPayrollBatches,
        fetchMyPayrollBatches,
        downloadSalaryReport,
        downloadSalarySlipPdf,
        submitPayrollForApproval,
        updateSalaryStatus,
        generateBulkSalarySlips,
        departments,        // ✅ Real departments from API
        fetchDepartments,   // ✅ Fetch departments function
        loading
    } = useHR();

    // ---- State ----
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState("download");
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString('default', { month: 'long' })
    );
    const [selectedYear, setSelectedYear] = useState(
        new Date().getFullYear().toString()
    );

    // Slips filter
    const [slipMonth, setSlipMonth] = useState(
        new Date().toLocaleString('default', { month: 'long' })
    );
    const [slipYear, setSlipYear] = useState(
        new Date().getFullYear().toString()
    );

    // Bulk Generate Dialog
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [bulkMonth, setBulkMonth] = useState(
        new Date().toLocaleString('default', { month: 'long' })
    );
    const [bulkYear, setBulkYear] = useState(
        new Date().getFullYear().toString()
    );
    const [bulkDepartment, setBulkDepartment] = useState("all");

    // Status Update Dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    // PDF Download Loading
    const [downloadingId, setDownloadingId] = useState(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = ["2024", "2025", "2026", "2027"];

    // ---- Fetch Data ----
    useEffect(() => {
        fetchMyPayrollBatches();
        fetchDepartments(); // ✅ Fetch departments on mount
    }, [fetchMyPayrollBatches, fetchDepartments]);

    useEffect(() => {
        fetchAllSalarySlips({
            month: slipMonth,
            year: parseInt(slipYear),
            page: 1,
            limit: 50
        });
    }, [slipMonth, slipYear, fetchAllSalarySlips]);

    // ---- Handlers ----
    const handleActionClick = (type) => {
        setActionType(type);
        setActionDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        const payload = { month: selectedMonth, year: parseInt(selectedYear) };

        if (actionType === "download") {
            await downloadSalaryReport(payload);
        } else if (actionType === "submit") {
            const success = await submitPayrollForApproval(payload);
            if (success) {
                setActionDialogOpen(false);
            }
        }
    };

    const handleResubmit = (batch) => {
        setSelectedMonth(batch.month);
        setSelectedYear(batch.year.toString());
        setActionType("submit");
        setActionDialogOpen(true);
    };

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

    const handleBulkGenerate = async () => {
        const data = {
            month: bulkMonth,
            year: parseInt(bulkYear),
        };
        if (bulkDepartment && bulkDepartment !== "all") {
            data.departmentId = bulkDepartment;
        }
        const res = await generateBulkSalarySlips(data);
        if (res) {
            setBulkDialogOpen(false);
            setBulkDepartment("all");
            fetchAllSalarySlips({ month: slipMonth, year: parseInt(slipYear) });
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedSlip || !newStatus) return;
        const success = await updateSalaryStatus(selectedSlip._id, {
            paymentStatus: newStatus
        });
        if (success) {
            setStatusDialogOpen(false);
            setSelectedSlip(null);
            setNewStatus("");
            fetchAllSalarySlips({ month: slipMonth, year: parseInt(slipYear) });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending Finance Approval": return "warning";
            case "Pending": return "warning";
            case "Approved": return "default";
            case "Sent to Bank": return "secondary";
            case "Bank Processed": return "success";
            case "Paid": return "success";
            case "Processed": return "default";
            case "Rejected": return "destructive";
            default: return "outline";
        }
    };

    // Extract data for display
    const slips = companySalarySlips?.slips || companySalarySlips || [];
    const pagination = companySalarySlips?.pagination || null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Payroll & Salary</h2>
                    <p className="text-muted-foreground text-sm">
                        Manage company salary slips and submit payroll batches to finance.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => handleActionClick("download")}>
                        <Download className="mr-2 h-4 w-4" />
                        Excel Report
                    </Button>
                    <Button variant="outline" onClick={() => setBulkDialogOpen(true)}>
                        <Users className="mr-2 h-4 w-4" />
                        Bulk Generate
                    </Button>
                    <Button onClick={() => handleActionClick("submit")}>
                        <Send className="mr-2 h-4 w-4" />
                        Submit to Finance
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="slips" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="slips">All Salary Slips</TabsTrigger>
                    <TabsTrigger value="batches">Payroll Batches</TabsTrigger>
                </TabsList>

                {/* ==================== ALL SALARY SLIPS TAB ==================== */}
                <TabsContent value="slips" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
                            <div>
                                <CardTitle>Generated Salary Slips</CardTitle>
                                <CardDescription>View all employee salary slips for a specific month.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Select value={slipMonth} onValueChange={setSlipMonth}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select value={slipYear} onValueChange={setSlipYear}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading && slips.length === 0 ? (
                                <div className="text-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                    <p className="mt-2 text-muted-foreground">Loading salary slips...</p>
                                </div>
                            ) : slips.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    <FileText className="mx-auto h-10 w-10 mb-3 opacity-20" />
                                    <p>No salary slips found for {slipMonth} {slipYear}.</p>
                                </div>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Employee</TableHead>
                                                <TableHead>Slip No.</TableHead>
                                                <TableHead>Month</TableHead>
                                                <TableHead className="text-right">Gross</TableHead>
                                                <TableHead className="text-right">Deductions</TableHead>
                                                <TableHead className="text-right">Net Pay</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {slips.map((slip) => (
                                                <TableRow key={slip._id}>
                                                    <TableCell className="font-medium">
                                                        {slip.employeeId?.name || "Unknown"}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs">
                                                        {slip.slipNumber || "-"}
                                                    </TableCell>
                                                    <TableCell>{slip.month}</TableCell>
                                                    <TableCell className="text-right">
                                                        ₹{(slip.grossEarnings || 0).toLocaleString('en-IN')}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        ₹{(slip.totalDeductions || 0).toLocaleString('en-IN')}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        ₹{(slip.netSalary || slip.netPay || 0).toLocaleString('en-IN')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadge(slip.paymentStatus)}>
                                                            {slip.paymentStatus || "Pending"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
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
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDownloadPdf(slip._id)}
                                                                disabled={downloadingId === slip._id}
                                                                title="Download PDF"
                                                            >
                                                                {downloadingId === slip._id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Download className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setSelectedSlip(slip);
                                                                    setNewStatus(slip.paymentStatus || "Pending");
                                                                    setStatusDialogOpen(true);
                                                                }}
                                                                title="Update Status"
                                                            >
                                                                <RefreshCcw className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {pagination && (
                                        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                                            <span>
                                                Showing {slips.length} of {pagination.total || slips.length} slips
                                            </span>
                                            {pagination.pages > 1 && (
                                                <span>Page {pagination.page} of {pagination.pages}</span>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ==================== PAYROLL BATCHES TAB ==================== */}
                <TabsContent value="batches" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Payroll Submissions</CardTitle>
                            <CardDescription>Track the status of payroll batches submitted to finance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {myPayrollBatches.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    <FileSpreadsheet className="mx-auto h-10 w-10 mb-3 opacity-20" />
                                    <p>No payroll batches submitted yet.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Month</TableHead>
                                            <TableHead>Total Employees</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted On</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myPayrollBatches.map((batch) => (
                                            <TableRow key={batch._id}>
                                                <TableCell className="font-medium">
                                                    {batch.month} {batch.year}
                                                </TableCell>
                                                <TableCell>{batch.totalEmployees}</TableCell>
                                                <TableCell>₹{(batch.totalAmount || 0).toLocaleString('en-IN')}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadge(batch.status)}>
                                                        {batch.status}
                                                    </Badge>
                                                    {batch.status === "Rejected" && batch.remarks && (
                                                        <p className="text-xs text-destructive mt-1 max-w-[200px]">
                                                            Reason: {batch.remarks}
                                                        </p>
                                                    )}
                                                </TableCell>
                                                <TableCell>{formatDate(batch.createdAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    {batch.status === "Rejected" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleResubmit(batch)}
                                                        >
                                                            <RefreshCcw className="mr-2 h-3 w-3" />
                                                            Resubmit
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* ==================== ACTION DIALOG ==================== */}
            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "download" ? "Download Salary Report" : "Submit Payroll for Approval"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "download" 
                                ? "Download the monthly payroll Excel report for verification." 
                                : "Submit the payroll batch to Finance for approval."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {actionType === "download" && (
                            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <span>Please verify the downloaded Excel sheet data carefully before submitting it to Finance for approval.</span>
                            </div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Month</Label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Year</Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmAction} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                actionType === "download" ? "Download Excel" : "Confirm Submit"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ==================== BULK GENERATE DIALOG ==================== */}
            <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Bulk Generate Salary Slips</DialogTitle>
                        <DialogDescription>
                            Generate salary slips for all employees or a specific department.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Month</Label>
                            <Select value={bulkMonth} onValueChange={setBulkMonth}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Year</Label>
                            <Select value={bulkYear} onValueChange={setBulkYear}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Department</Label>
                            {/* ✅ REAL DEPARTMENTS FROM API */}
                            <Select
                                value={bulkDepartment}
                                onValueChange={setBulkDepartment}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept._id} value={dept._id}>
                                            {dept.name} ({dept.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleBulkGenerate} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Users className="mr-2 h-4 w-4" />
                                    Generate All
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ==================== STATUS UPDATE DIALOG ==================== */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Update Salary Status</DialogTitle>
                        <DialogDescription>
                            Update payment status for {selectedSlip?.employeeId?.name || "employee"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                        {selectedSlip && (
                            <div className="text-sm bg-muted p-3 rounded-md">
                                <p><strong>Employee:</strong> {selectedSlip.employeeId?.name || "Unknown"}</p>
                                <p><strong>Month:</strong> {selectedSlip.month}</p>
                                <p><strong>Net Pay:</strong> ₹{(selectedSlip.netSalary || selectedSlip.netPay || 0).toLocaleString('en-IN')}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateStatus} disabled={loading}>
                            {loading ? (
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
        </div>
    );
}