

import React, { useEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import {
    CreditCard, Search, FileText, Eye, DollarSign, Hash, User, Tag, Calendar,
    CheckCircle, RotateCcw, Wallet, ArrowDownCircle, ArrowUpCircle, Plus, FolderOpen, XCircle
import React, { useEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import {
	CreditCard, Search, FileText, Eye, DollarSign, Hash, User, Tag, Calendar,
	CheckCircle, Wallet, ArrowDownCircle, ArrowUpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { hrApi } from "@/api/hrApi";
import { projectApi } from "@/api/projectApi";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";
import { formatINR } from "@/lib/helpers";

export function FinanceExpenses() {
<<<<<<< HEAD
    const topRef = useRef(null);
=======
	const topRef = useRef(null);

	// ==================== MAIN TABS STATE ====================
	const [mainTab, setMainTab] = useState("expenses");
>>>>>>> 961b5227981497a3d3847709375b079642756be3

    // ==================== MAIN TABS STATE ====================
    const [mainTab, setMainTab] = useState("expenses");

    // ==================== EXPENSE TICKETS STATE ====================
    const [activeTab, setActiveTab] = useState("PendingApprovals");
    const [expenses, setExpenses] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isRefundOpen, setIsRefundOpen] = useState(false);
    
    // ✅ Admin Rejection State
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const [paymentData, setPaymentData] = useState({ paymentMethod: "", paymentReference: "", remarks: "", amount: "" });
    const [refundData, setRefundData] = useState({ amount: "", reason: "" });

    // ==================== FINANCE EXECUTIVE SPECIFIC STATE ====================
    const [isRaisePaymentOpen, setIsRaisePaymentOpen] = useState(false);
    const [isManualRecipient, setIsManualRecipient] = useState(false);
    const [projects, setProjects] = useState([]);
    
    const [financeForm, setFinanceForm] = useState({
        title: "",
        description: "",
        amount: "",
        projectId: "",
        paidToUserId: "none", 
        paidToName: "", 
        paidToEmail: "", 
        paidToPhone: "", 
        categoryId: "",
        paymentPurpose: "",
        paymentReference: "",
        paymentMode: "Bank Transfer",
        paymentDate: new Date().toISOString().split('T')[0],
        proof: null
    });

    // ==================== WALLET STATE & HOOKS ====================
    const {
        employees, fetchEmployees,
        employeeWallet, employeeWalletTransactions,
        fetchEmployeeWallet, fetchEmployeeWalletTransactions,
        addWalletMoney, refundWallet,
        // 🏦 Finance Exports
        createFinanceExpense, fetchFinanceDashboard, financeDashboard,
        expenseCategories, fetchExpenseCategories,
        // ✅ Approval Exports
        approveExpense, rejectExpense
    } = useHR();

    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [empSearchTerm, setEmpSearchTerm] = useState("");
    const [empPage, setEmpPage] = useState(1);
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
    const [isWalletRefundOpen, setIsWalletRefundOpen] = useState(false);
    const [walletForm, setWalletForm] = useState({ amount: "", remarks: "" });

    // ==================== EFFECTS: INITIAL DATA ====================
    useEffect(() => {
        fetchExpenseCategories();
        projectApi.getAll().then(res => {
            setProjects(res.data?.data?.projects || res.data?.data || []);
        }).catch(err => console.error("Failed to load projects", err));
        
        fetchEmployees({ limit: 100 });
    }, []);

<<<<<<< HEAD
    // ==================== EFFECTS: EXPENSE TICKETS ====================
    const fetchExpensesData = async (tab, page = 1, limit = 10, search = "") => {
        setLoading(true);
        try {
            const params = { page, limit };
            if (search.trim()) params.search = search.trim();
=======
	// Tab switch (Approved <-> Paid) => fetch immediately, no debounce, and clear stale rows
	useEffect(() => {
		if (mainTab !== "expenses") return;

		setExpenses([]);
		setLoading(true);
		fetchExpensesData(activeTab, 1, 10, searchTerm);
	}, [activeTab, mainTab]);

	// Search typing => debounce only, don't refetch on every keystroke
	useEffect(() => {
		if (mainTab !== "expenses") return;
>>>>>>> 961b5227981497a3d3847709375b079642756be3

            if (tab === "MyRaised") {
                await fetchFinanceDashboard(params);
            } else {
                let res;
                if (tab === "PendingApprovals") {
                    params.status = "Pending";
                    res = await hrApi.getAllExpenses(params);
                } else if (tab === "Approved") {
                    res = await hrApi.getPendingPayments(params);
                } else {
                    params.paymentStatus = "Paid";
                    res = await hrApi.getAllExpenses(params);
                }
                
                const responseData = res.data?.data || {};
                setExpenses(Array.isArray(responseData.tickets) ? responseData.tickets : []);
                if (responseData.pagination) setPagination(responseData.pagination);
            }
        } catch (err) {
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    // Tab switch => fetch immediately, no debounce, and clear stale rows
    useEffect(() => {
        if (mainTab !== "expenses") return;
        setExpenses([]);
        setLoading(true);
        fetchExpensesData(activeTab, 1, 10, searchTerm);
    }, [activeTab, mainTab]);
=======
		return () => clearTimeout(timer);
	}, [searchTerm]);
>>>>>>> 961b5227981497a3d3847709375b079642756be3

    // Search typing => debounce only, don't refetch on every keystroke
    useEffect(() => {
        if (mainTab !== "expenses") return;
        const timer = setTimeout(() => {
            fetchExpensesData(activeTab, 1, 10, searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // ==================== EFFECTS: WALLETS ====================
    useEffect(() => {
        if (mainTab === "wallets") {
            const debounce = setTimeout(() => {
                fetchEmployees({ search: empSearchTerm, page: empPage, limit: 10 });
            }, 500);
            return () => clearTimeout(debounce);
        }
    }, [empSearchTerm, empPage, mainTab]);

    useEffect(() => {
        if (selectedEmpId && mainTab === "wallets") {
            fetchEmployeeWallet(selectedEmpId);
            fetchEmployeeWalletTransactions(selectedEmpId, { page: 1, limit: 10 });
        }
    }, [selectedEmpId, fetchEmployeeWallet, fetchEmployeeWalletTransactions, mainTab]);

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [empPage]);

    // ==================== HANDLERS: ADMIN APPROVAL ====================
    const handleApproveTicket = async (expense) => {
        if(window.confirm("Are you sure you want to approve this expense? Wallet deduction will be applied automatically if applicable.")) {
            const success = await approveExpense(expense._id, { remarks: "Approved by Admin" });
            if (success) {
                fetchExpensesData(activeTab, pagination.page, 10, searchTerm);
            }
        }
    };

    const openRejectModal = (expense) => {
        setSelectedExpense(expense);
        setRejectReason("");
        setIsRejectOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) return toast.error("Rejection reason is required!");
        const success = await rejectExpense(selectedExpense._id, { reason: rejectReason });
        if (success) {
            setIsRejectOpen(false);
            fetchExpensesData(activeTab, pagination.page, 10, searchTerm);
        }
    };

    // ==================== HANDLERS: EXPENSE PAYMENTS ====================
    const handlePay = async () => {
        if (!paymentData.paymentMethod || !paymentData.paymentReference) return toast.error("Method & Ref required!");
        if (!paymentData.amount || Number(paymentData.amount) <= 0) return toast.error("Please enter a valid amount!");

        try {
            await hrApi.payExpenseCash(selectedExpense._id, {
                paymentMethod: paymentData.paymentMethod,
                paymentReference: paymentData.paymentReference,
                remarks: paymentData.remarks,
                amount: Number(paymentData.amount)
            });
            toast.success("Payment processed successfully!");
            setIsPayOpen(false);
            fetchExpensesData(activeTab, pagination.page, 10, searchTerm);
        } catch (err) {
            toast.error(err.response?.data?.message || "Payment failed");
        }
    };

    const handleTicketRefund = async () => {
        if (!refundData.reason.trim()) return toast.error("Refund reason is required!");

        try {
            const payload = { reason: refundData.reason };
            if (refundData.amount) payload.amount = Number(refundData.amount);

            await hrApi.refundExpenseTicket(selectedExpense._id, payload);
            toast.success("Refund processed and added to wallet!");
            setIsRefundOpen(false);
            fetchExpensesData(activeTab, pagination.page, 10, searchTerm);
        } catch (err) {
            toast.error(err.response?.data?.message || "Refund failed");
        }
    };

    const openModal = (expense, type) => {
        setSelectedExpense(expense);
        if (type === 'view') setIsViewOpen(true);
        if (type === 'pay') {
            setPaymentData({ paymentMethod: "", paymentReference: "", remarks: "", amount: expense.paymentPendingAmount || "" });
            setIsPayOpen(true);
        }
        if (type === 'refund') {
            setRefundData({ amount: "", reason: "" });
            setIsRefundOpen(true);
        }
    };

<<<<<<< HEAD
    // ==================== HANDLERS: RAISE FINANCE EXPENSE ====================
    const handleFinanceFormChange = (e) => {
        const { name, value } = e.target;
        setFinanceForm((prev) => ({ ...prev, [name]: value }));
    };
=======
	useEffect(() => {
		topRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [empPage]);

	return (
		<div ref={topRef} className="space-y-4 mt-5">
>>>>>>> 961b5227981497a3d3847709375b079642756be3

    const handleFinanceFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFinanceForm((prev) => ({ ...prev, proof: e.target.files[0] }));
        } else {
            setFinanceForm((prev) => ({ ...prev, proof: null }));
        }
    };

    const handleRaiseFinanceExpense = async (e) => {
        e.preventDefault();
        
        if (!financeForm.projectId) return toast.error("Please select a project.");
        
        if (isManualRecipient) {
            if (!financeForm.paidToName.trim()) return toast.error("Recipient Name is required for manual entry.");
        } else {
            if (!financeForm.paidToUserId || financeForm.paidToUserId === "none") return toast.error("Please select whom you are paying.");
        }

<<<<<<< HEAD
        const payload = new FormData();
        Object.keys(financeForm).forEach(key => {
            if (isManualRecipient && key === "paidToUserId") return;
            if (!isManualRecipient && (key === "paidToName" || key === "paidToEmail" || key === "paidToPhone")) return;

            if (financeForm[key] !== null && financeForm[key] !== "" && financeForm[key] !== "none") {
                payload.append(key, financeForm[key]);
            }
        });

        const success = await createFinanceExpense(payload);
        if (success) {
            setIsRaisePaymentOpen(false);
            setIsManualRecipient(false);
            setFinanceForm({
                title: "", description: "", amount: "", projectId: "", 
                paidToUserId: "none", paidToName: "", paidToEmail: "", paidToPhone: "",
                categoryId: "", paymentPurpose: "", paymentReference: "",
                paymentMode: "Bank Transfer", paymentDate: new Date().toISOString().split('T')[0], proof: null
            });
            setActiveTab("MyRaised");
            fetchExpensesData("MyRaised", 1, 10, "");
        }
    };

    // ==================== HANDLERS: WALLETS ====================
    const handleWalletSubmit = async (type) => {
        if (!walletForm.amount || isNaN(walletForm.amount) || Number(walletForm.amount) <= 0) {
            return toast.error("Enter a valid amount");
        }
        const payload = {
            employeeId: selectedEmpId,
            amount: Number(walletForm.amount),
            remarks: walletForm.remarks
        };

        let success = false;
        if (type === 'add') success = await addWalletMoney(payload);
        if (type === 'refund') success = await refundWallet(payload);

        if (success) {
            setIsAddMoneyOpen(false);
            setIsWalletRefundOpen(false);
            setWalletForm({ amount: "", remarks: "" });
        }
    };

    // ==================== HELPERS ====================
    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        return new Date(isoString).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    };

    const renderDynamicIcon = (iconName, className) => {
        const DynamicIcon = LucideIcons[iconName];
        if (!DynamicIcon) return <LucideIcons.Tag className={className} />;
        return <DynamicIcon className={className} />;
    };

    const displayExpenses = activeTab === "MyRaised" ? financeDashboard : expenses;

    return (
        <div ref={topRef} className="space-y-4 mt-5">

            {/* ==================== MASTER TABS ==================== */}
            <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="expenses" className="flex gap-2"><DollarSign className="h-4 w-4" /> Expense Payouts</TabsTrigger>
                    <TabsTrigger value="wallets" className="flex gap-2"><Wallet className="h-4 w-4" /> Employee Wallets</TabsTrigger>
                </TabsList>

                {/* ==================== 1. EXPENSES TAB CONTENT ==================== */}
                <TabsContent value="expenses" className="space-y-4 m-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="PendingApprovals" className="text-amber-600 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
                                    Pending Approvals
                                </TabsTrigger>
                                <TabsTrigger value="Approved">Pending Payments</TabsTrigger>
                                <TabsTrigger value="Paid">Paid History</TabsTrigger>
                                <TabsTrigger value="MyRaised" className="bg-blue-50/50 text-blue-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                                    My Raised Payments
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search ticket or title..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <Button onClick={() => setIsRaisePaymentOpen(true)} className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="h-4 w-4 mr-1"/> Raise Payment
                            </Button>
                        </div>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="whitespace-nowrap">Date</TableHead>
                                    <TableHead className="whitespace-nowrap">Title</TableHead>
                                    <TableHead className="whitespace-nowrap">{activeTab === "MyRaised" ? "Paid To" : "Employee"}</TableHead>
                                    <TableHead className="whitespace-nowrap">Project</TableHead>
                                    <TableHead className="whitespace-nowrap">Category</TableHead>
                                    <TableHead className="whitespace-nowrap">Total Amount</TableHead>
                                    <TableHead className="whitespace-nowrap">Cash Pending</TableHead>
                                    <TableHead className="whitespace-nowrap">Status</TableHead>
                                    <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && mainTab === "expenses" ? (
                                    <TableRow><TableCell colSpan={9} className="text-center py-8">Loading...</TableCell></TableRow>
                                ) : displayExpenses.length === 0 ? (
                                    <TableRow><TableCell colSpan={9} className="text-center py-8">No tickets found.</TableCell></TableRow>
                                ) : (
                                    displayExpenses.map((expense) => {
                                        const categoryName = expense?.categoryId?.name || expense?.category;
                                        const categoryIcon = expense?.categoryId?.icon;
                                        const categoryColor = expense?.categoryId?.color || "#3b82f6";
                                        const recipientName = expense.paidToName || expense.paidToUserId?.name || "N/A";
=======
					<div className="border rounded-md">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="whitespace-nowrap">Date</TableHead>
									<TableHead className="whitespace-nowrap">Title</TableHead>
									<TableHead className="whitespace-nowrap">Employee</TableHead>
									<TableHead className="whitespace-nowrap">Project</TableHead>
									<TableHead className="whitespace-nowrap">Category</TableHead>
									<TableHead className="whitespace-nowrap">Total Amount</TableHead>
									<TableHead className="whitespace-nowrap">Cash Pending</TableHead>
									<TableHead className="whitespace-nowrap">Payment Status</TableHead>
									<TableHead className="whitespace-nowrap text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading && mainTab === "expenses" ? (
									<TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
								) : expenses.length === 0 ? (
									<TableRow><TableCell colSpan={7} className="text-center py-8">No tickets found.</TableCell></TableRow>
								) : (
									expenses.map((expense) => {
										const categoryName = expense?.categoryId?.name || expense?.category;
										const categoryIcon = expense?.categoryId?.icon;
										const categoryColor = expense?.categoryId?.color || "#3b82f6";

										return (
											<TableRow
												key={expense._id}
												className="hover:bg-muted/40 transition-colors"
											>
												<TableCell className="whitespace-nowrap">
													{new Date(expense.createdAt).toLocaleDateString()}
												</TableCell>

												<TableCell className="whitespace-nowrap">
													{expense.title}
												</TableCell>

												<TableCell className="whitespace-nowrap">
													<div className="font-medium">{expense.employeeId?.name}</div>
													{/* <div className="text-xs text-muted-foreground">
														{expense.ticketNumber}
													</div> */}
												</TableCell>

												<TableCell className="whitespace-nowrap">
													<div className="font-medium">
														{expense.projectId?.name || "N/A"}
													</div>
												</TableCell>

												<TableCell className="whitespace-nowrap">
													{categoryName ? (
														<div
															className={`text-xs font-medium flex items-center w-fit ${categoryIcon ? "gap-1.5" : ""
																}`}
														>
															{categoryIcon && (
																<div
																	className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-white"
																	style={{ backgroundColor: categoryColor }}
																>
																	{renderDynamicIcon(categoryIcon, "h-2.5 w-2.5")}
																</div>
															)}

															<span className="text-foreground">
																{categoryName}
															</span>
														</div>
													) : (
														<span className="text-xs text-muted-foreground">
															None
														</span>
													)}
												</TableCell>

												<TableCell className="whitespace-nowrap font-bold tabular-nums">
													₹{expense.amount}
												</TableCell>

												<TableCell className="whitespace-nowrap">
													<span
														className={`text-sm font-medium ${expense.paymentPendingAmount > 0
															? "text-destructive"
															: expense.paymentPendingAmount === 0
																? "text-muted-foreground"
																: "text-muted-foreground"
															}`}
													>
														₹{expense.paymentPendingAmount || 0}
													</span>
												</TableCell>

												<TableCell className="whitespace-nowrap">
													<span
														className={`text-sm font-medium ${expense.paymentStatus === "Paid"
															? "text-success"
															: expense.paymentStatus === "Wallet Adjusted"
																? "text-blue-600"
																: expense.paymentStatus === "Partially Paid"
																	? "text-orange-600"
																	: expense.paymentStatus === "Pending" || !expense.paymentStatus
																		? "text-amber-600"
																		: "text-muted-foreground"
															}`}
													>
														{expense.paymentStatus || "Pending"}
													</span>
												</TableCell>

												<TableCell className="whitespace-nowrap text-right">
													<div className="flex justify-end gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => openModal(expense, "view")}
														>
															<Eye className="h-4 w-4" />
														</Button>

														{activeTab === "Approved" && (
															<Button
																size="sm"
																onClick={() => openModal(expense, "pay")}
															>
																<CreditCard className="mr-1 h-3.5 w-3.5" />
																Pay
															</Button>
														)}
													</div>
												</TableCell>
											</TableRow>
										)
									})
								)}
							</TableBody>
						</Table>
					</div>
				</TabsContent>
>>>>>>> 961b5227981497a3d3847709375b079642756be3

                                        return (
                                            <TableRow key={expense._id} className="hover:bg-muted/40 transition-colors">
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(expense.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                
                                                <TableCell className="whitespace-nowrap max-w-[200px] truncate" title={expense.title}>
                                                    {expense.title}
                                                </TableCell>

<<<<<<< HEAD
                                                <TableCell className="whitespace-nowrap">
                                                    {activeTab === "MyRaised" ? (
                                                        <div className="font-medium text-blue-700">{recipientName}</div>
                                                    ) : (
                                                        <>
                                                            <div className="font-medium">{expense.employeeId?.name}</div>
                                                            {/* <div className="text-xs text-muted-foreground">{expense.ticketNumber}</div> */}
                                                        </>
                                                    )}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap">
                                                    <div className="font-medium text-xs text-muted-foreground">
                                                        {expense.projectId?.name || "N/A"}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap">
                                                    {categoryName ? (
                                                        <div className={`text-xs font-medium flex items-center w-fit ${categoryIcon ? "gap-1.5" : ""}`}>
                                                            {categoryIcon && (
                                                                <div
                                                                    className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-white"
                                                                    style={{ backgroundColor: categoryColor }}
                                                                >
                                                                    {renderDynamicIcon(categoryIcon, "h-2.5 w-2.5")}
                                                                </div>
                                                            )}
                                                            <span className="text-foreground">{categoryName}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">None</span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap font-bold tabular-nums">
                                                    ₹{expense.amount}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap">
                                                    <span
                                                        className={`text-sm font-medium ${expense.paymentPendingAmount > 0
                                                            ? "text-destructive"
                                                            : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        ₹{expense.paymentPendingAmount || 0}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap">
                                                    {activeTab === "MyRaised" || activeTab === "PendingApprovals" ? (
                                                        <Badge variant={expense.status === "Approved" ? "success" : expense.status === "Rejected" ? "destructive" : "outline"}>
                                                            {expense.status}
                                                        </Badge>
                                                    ) : (
                                                        <span
                                                            className={`text-sm font-medium ${expense.paymentStatus === "Paid"
                                                                ? "text-success"
                                                                : expense.paymentStatus === "Wallet Adjusted"
                                                                    ? "text-blue-600"
                                                                    : expense.paymentStatus === "Partially Paid"
                                                                        ? "text-orange-600"
                                                                        : "text-amber-600"
                                                                }`}
                                                        >
                                                            {expense.paymentStatus || "Pending"}
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => openModal(expense, 'view')}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        
                                                        {/* ✅ Admin Action Buttons */}
                                                        {activeTab === "PendingApprovals" && (
                                                            <>
                                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApproveTicket(expense)}>
                                                                    <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                                                                </Button>
                                                                <Button size="sm" variant="destructive" onClick={() => openRejectModal(expense)}>
                                                                    <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                                                                </Button>
                                                            </>
                                                        )}
=======
							{/* 🟢 NEW CLEAN EMPLOYEE TABLE 🟢 */}
							<div className="border rounded-md">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead className="whitespace-nowrap">Employee</TableHead>
											<TableHead className="whitespace-nowrap">Emp ID</TableHead>
											<TableHead className="whitespace-nowrap">Role</TableHead>
											<TableHead className="whitespace-nowrap">Status</TableHead>
											<TableHead className="whitespace-nowrap text-right">Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{loading && mainTab === "wallets" && !employees?.employees?.length ? (
											<TableRow><TableCell colSpan={5} className="text-center py-6">Loading...</TableCell></TableRow>
										) : employees?.employees?.length === 0 ? (
											<TableRow><TableCell colSpan={5} className="text-center py-6">No employees found.</TableCell></TableRow>
										) : (
											employees?.employees?.map((emp) => (
												<TableRow
													key={emp?._id}
													className={`${!emp?.isActive ? "opacity-60 bg-muted/20" : ""
														}`}
												>
													{/* Profile, Name & Email */}
													<TableCell className="whitespace-nowrap">
														<div className="flex items-center gap-3">
															<div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden border shrink-0">
																{emp?.profileImage ? (
																	<img
																		src={emp.profileImage}
																		alt={emp.name}
																		className="h-full w-full object-cover"
																	/>
																) : (
																	<User className="h-5 w-5 text-muted-foreground" />
																)}
															</div>

															<div className="min-w-0">
																<div className="font-medium text-sm leading-none">
																	{emp?.name}
																</div>
																<div className="text-xs text-muted-foreground mt-1">
																	{emp?.email}
																</div>
															</div>
														</div>
													</TableCell>

													{/* Employee ID */}
													<TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
														{emp?.employeeId || "N/A"}
													</TableCell>

													{/* Role */}
													<TableCell className="whitespace-nowrap">
														<div className="font-medium text-sm capitalize">
															{emp?.role?.replace("_", " ") || "N/A"}
														</div>
													</TableCell>

													{/* Status */}
													<TableCell className="whitespace-nowrap">
														<span
															className={`text-sm font-medium ${emp?.isActive
																? "text-success"
																: "text-destructive"
																}`}
														>
															{emp?.status || (emp?.isActive ? "Active" : "Inactive")}
														</span>
													</TableCell>

													{/* Action */}
													<TableCell className="whitespace-nowrap text-right">
														<Button
															variant="outline"
															size="sm"
															onClick={() => setSelectedEmpId(emp?._id)}
															disabled={!emp?.isActive}
														>
															<Wallet className="h-4 w-4 mr-2" />
															View Wallet
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
>>>>>>> 961b5227981497a3d3847709375b079642756be3

                                                        {activeTab === "Approved" && (
                                                            <Button size="sm" onClick={() => openModal(expense, 'pay')}>
                                                                <CreditCard className="mr-1 h-3.5 w-3.5" /> Pay
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* ==================== 2. WALLETS TAB CONTENT ==================== */}
                <TabsContent value="wallets" className="space-y-4 m-0">
                    {!selectedEmpId ? (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
                                <div>
                                    <h3 className="text-lg font-semibold">Employee Wallets</h3>
                                    <p className="text-sm text-muted-foreground">Search and select an employee to view or manage their wallet.</p>
                                </div>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, ID or email..."
                                        className="pl-9 bg-background"
                                        value={empSearchTerm}
                                        onChange={(e) => {
                                            setEmpSearchTerm(e.target.value);
                                            setEmpPage(1);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="whitespace-nowrap">Employee</TableHead>
                                            <TableHead className="whitespace-nowrap">Emp ID</TableHead>
                                            <TableHead className="whitespace-nowrap">Role</TableHead>
                                            <TableHead className="whitespace-nowrap">Status</TableHead>
                                            <TableHead className="whitespace-nowrap text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading && mainTab === "wallets" && !employees?.employees?.length ? (
                                            <TableRow><TableCell colSpan={5} className="text-center py-6">Loading...</TableCell></TableRow>
                                        ) : employees?.employees?.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="text-center py-6">No employees found.</TableCell></TableRow>
                                        ) : (
                                            employees?.employees?.map((emp) => (
                                                <TableRow key={emp?._id} className={!emp?.isActive ? "opacity-60 bg-muted/20" : ""}>
                                                    <TableCell className="whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden border shrink-0">
                                                                {emp?.profileImage ? (
                                                                    <img src={emp.profileImage} alt={emp.name} className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-medium text-sm leading-none">{emp?.name}</div>
                                                                <div className="text-xs text-muted-foreground mt-1">{emp?.email}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">{emp?.employeeId || "N/A"}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <div className="font-medium text-sm capitalize">{emp?.role?.replace('_', ' ') || "N/A"}</div>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <span className={`text-sm font-medium ${emp?.isActive ? "text-success" : "text-destructive"}`}>
                                                            {emp?.status || (emp?.isActive ? "Active" : "Inactive")}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap text-right">
                                                        <Button variant="outline" size="sm" onClick={() => setSelectedEmpId(emp?._id)} disabled={!emp?.isActive}>
                                                            <Wallet className="h-4 w-4 mr-2" /> View Wallet
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {employees?.pagination?.pages > 1 && (
                                <div className="flex items-center justify-between bg-muted/20 px-4 py-2 border rounded-md mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Page <span className="font-medium text-foreground">{employees.pagination.page}</span> of{" "}
                                        <span className="font-medium text-foreground">{employees.pagination.pages}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline" size="sm" disabled={employees.pagination.page <= 1}
                                            onClick={() => setEmpPage(prev => Math.max(1, prev - 1))}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline" size="sm" disabled={employees.pagination.page >= employees.pagination.pages}
                                            onClick={() => setEmpPage(prev => prev + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedEmpId("")} className="hover:bg-background">
                                        ← Back
                                    </Button>
                                    <Separator orientation="vertical" className="h-6" />
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {employees?.employees?.find(e => e._id === selectedEmpId)?.name}'s Wallet
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-mono">
                                            {employees?.employees?.find(e => e._id === selectedEmpId)?.employeeId}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={() => { setWalletForm({ amount: "", remarks: "" }); setIsAddMoneyOpen(true); }} className="gap-2 bg-blue-600 hover:bg-blue-700">
                                        <ArrowDownCircle className="h-4 w-4" /> Add Advance
                                    </Button>
                                    <Button onClick={() => { setWalletForm({ amount: "", remarks: "" }); setIsWalletRefundOpen(true); }} variant="outline" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950">
                                        <ArrowUpCircle className="h-4 w-4" /> Refund Wallet
                                    </Button>
                                </div>
                            </div>

                            {employeeWallet ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 border rounded-xl bg-card shadow-sm">
                                            <div className="text-sm text-muted-foreground font-medium mb-1">Current Balance</div>
                                            <div className="text-3xl font-bold text-primary">₹{employeeWallet?.balance || 0}</div>
                                        </div>
                                        <div className="p-4 border rounded-xl bg-card shadow-sm">
                                            <div className="text-sm text-muted-foreground font-medium mb-1">Total Advance</div>
                                            <div className="text-xl font-semibold text-blue-600">₹{employeeWallet?.totalAdvance || 0}</div>
                                        </div>
                                        <div className="p-4 border rounded-xl bg-card shadow-sm">
                                            <div className="text-sm text-muted-foreground font-medium mb-1">Total Expense Utilized</div>
                                            <div className="text-xl font-semibold text-rose-600">₹{employeeWallet?.totalExpense || 0}</div>
                                        </div>
                                        <div className="p-4 border rounded-xl bg-card shadow-sm">
                                            <div className="text-sm text-muted-foreground font-medium mb-1">Total Refunded</div>
                                            <div className="text-xl font-semibold text-emerald-600">₹{employeeWallet?.totalRefund || 0}</div>
                                        </div>
                                    </div>

                                    <div className="border rounded-md">
                                        <div className="p-3 bg-muted border-b font-semibold flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" /> Wallet Passbook
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Reference</TableHead>
                                                    <TableHead>Remarks</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                    <TableHead className="text-right">Balance After</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {employeeWalletTransactions?.length === 0 ? (
                                                    <TableRow><TableCell colSpan={6} className="text-center py-6">No transactions found.</TableCell></TableRow>
                                                ) : (
                                                    employeeWalletTransactions?.map((txn) => (
                                                        <TableRow key={txn?._id}>
                                                            <TableCell>{formatDate(txn?.createdAt)}</TableCell>
                                                            <TableCell>
                                                                <Badge variant={txn?.type === 'CREDIT' ? 'success' : 'destructive'} className="text-[10px]">
                                                                    {txn?.type}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="font-medium">{txn?.referenceType}</TableCell>
                                                            <TableCell className="text-muted-foreground text-sm">{txn?.remarks}</TableCell>
                                                            <TableCell className={`text-right font-bold ${txn?.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                {txn?.type === 'CREDIT' ? '+' : '-'}₹{txn?.amount}
                                                            </TableCell>
                                                            <TableCell className="text-right font-mono">₹{txn?.balanceAfter}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : (
                                !loading && <div className="text-center py-10 text-muted-foreground border rounded-lg">Loading wallet data...</div>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* ==================== MODALS: RAISE FINANCE PAYMENT ==================== */}
            <Dialog open={isRaisePaymentOpen} onOpenChange={setIsRaisePaymentOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleRaiseFinanceExpense}>
                        <DialogHeader>
                            <DialogTitle className="text-indigo-700 flex items-center gap-2">
                                <DollarSign className="h-5 w-5"/> Record New Finance Payment
                            </DialogTitle>
                            <DialogDescription>
                                Register a payment made to a vendor, contractor, or user. This will be sent to the Admin for approval.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Title <span className="text-destructive">*</span></Label>
                                <Input name="title" required placeholder="e.g. Payment for TMT Steel" value={financeForm.title} onChange={handleFinanceFormChange} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Project <span className="text-destructive">*</span></Label>
                                <Select value={financeForm.projectId} onValueChange={(val) => setFinanceForm({ ...financeForm, projectId: val })}>
                                    <SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger>
                                    <SelectContent>
                                        {projects.map((proj) => (
                                            <SelectItem key={proj._id} value={proj._id}>{proj.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* ✅ NEW: RECIPIENT TOGGLE & FIELDS */}
                            <div className="grid gap-3 border p-3 rounded-md bg-muted/20 mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <Label className="text-base font-semibold">Payment Recipient <span className="text-destructive">*</span></Label>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            type="button" 
                                            variant={!isManualRecipient ? "default" : "outline"} 
                                            size="sm" 
                                            className="h-7 text-xs"
                                            onClick={() => {
                                                setIsManualRecipient(false);
                                                setFinanceForm(prev => ({ ...prev, paidToName: "", paidToEmail: "", paidToPhone: "" }));
                                            }}
                                        >
                                            Registered User
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant={isManualRecipient ? "default" : "outline"} 
                                            size="sm" 
                                            className="h-7 text-xs"
                                            onClick={() => {
                                                setIsManualRecipient(true);
                                                setFinanceForm(prev => ({ ...prev, paidToUserId: "none" }));
                                            }}
                                        >
                                            Manual Entry
                                        </Button>
                                    </div>
                                </div>

                                {!isManualRecipient ? (
                                    <div className="grid gap-2">
                                        <Select value={financeForm.paidToUserId} onValueChange={(val) => setFinanceForm({ ...financeForm, paidToUserId: val })}>
                                            <SelectTrigger><SelectValue placeholder="Select Recipient from Users" /></SelectTrigger>
                                            <SelectContent>
                                                {employees?.employees?.map((emp) => (
                                                    <SelectItem key={emp._id} value={emp._id}>{emp.name} ({emp.role})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground mt-1">Select an existing employee, vendor, or contractor from the system.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label>Recipient Name <span className="text-destructive">*</span></Label>
                                            <Input name="paidToName" placeholder="e.g. Shree Cement Agency" value={financeForm.paidToName} onChange={handleFinanceFormChange} required={isManualRecipient} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Email <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                            <Input name="paidToEmail" type="email" placeholder="vendor@example.com" value={financeForm.paidToEmail} onChange={handleFinanceFormChange} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Phone <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                            <Input name="paidToPhone" placeholder="+91..." value={financeForm.paidToPhone} onChange={handleFinanceFormChange} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Amount (₹) <span className="text-destructive">*</span></Label>
                                    <Input name="amount" type="number" required min="1" placeholder="0.00" value={financeForm.amount} onChange={handleFinanceFormChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Payment Mode <span className="text-destructive">*</span></Label>
                                    <Select value={financeForm.paymentMode} onValueChange={(val) => setFinanceForm({ ...financeForm, paymentMode: val })}>
                                        <SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="UPI">UPI</SelectItem>
                                            <SelectItem value="Cheque">Cheque</SelectItem>
                                            <SelectItem value="NEFT">NEFT</SelectItem>
                                            <SelectItem value="RTGS">RTGS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Category (Optional)</Label>
                                <Select value={financeForm.categoryId} onValueChange={(val) => setFinanceForm({ ...financeForm, categoryId: val })}>
                                    <SelectTrigger><SelectValue placeholder="Default: Finance Payment" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No specific category</SelectItem>
                                        {expenseCategories.filter(c => c.isActive).map((cat) => (
                                            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Description <span className="text-destructive">*</span></Label>
                                <Textarea name="description" required placeholder="Full details regarding this payment..." value={financeForm.description} onChange={handleFinanceFormChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Payment Reference</Label>
                                    <Input name="paymentReference" placeholder="Txn ID / Inv No." value={financeForm.paymentReference} onChange={handleFinanceFormChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Payment Date</Label>
                                    <Input name="paymentDate" type="date" value={financeForm.paymentDate} onChange={handleFinanceFormChange} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Upload Invoice/Proof (Optional)</Label>
                                <Input type="file" accept="image/*,.pdf" onChange={handleFinanceFileChange} />
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRaisePaymentOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {loading ? "Submitting..." : "Submit Payment Record"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ==================== MODALS: ADMIN REJECT ==================== */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-rose-600">Reject Expense Ticket</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            You are about to reject the ticket <b>{selectedExpense?.ticketNumber}</b>.
                        </p>
                        <div>
                            <Label>Reason for Rejection <span className="text-destructive">*</span></Label>
                            <Textarea 
                                placeholder="E.g. Invoice not visible, duplicate entry..." 
                                value={rejectReason} 
                                onChange={(e) => setRejectReason(e.target.value)} 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleRejectSubmit}>Confirm Rejection</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ==================== MODALS: PROCESS PAYMENT ==================== */}
            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Process Cash Payment</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                            <span className="text-sm font-medium">Pending Amount:</span>
                            <span className="text-lg font-bold text-rose-600">₹{selectedExpense?.paymentPendingAmount}</span>
                        </div>
                        <div>
                            <Label>Amount to Pay (₹) *</Label>
                            <Input type="number" placeholder="Enter amount" value={paymentData.amount} onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })} />
                        </div>
                        <div>
                            <Label>Method *</Label>
                            <Select onValueChange={(val) => setPaymentData({ ...paymentData, paymentMethod: val })}>
                                <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Ref ID *</Label>
                            <Input placeholder="Txn No." onChange={(e) => setPaymentData({ ...paymentData, paymentReference: e.target.value })} />
                        </div>
                        <div>
                            <Label>Remarks (Optional)</Label>
                            <Input placeholder="Any payment notes..." onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setIsPayOpen(false)}>Cancel</Button><Button onClick={handlePay}>Process Payment</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ==================== MODALS: REFUND ==================== */}
            <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-rose-600">Refund Expense to Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            This will refund the money back to <b>{selectedExpense?.employeeId?.name}'s</b> virtual wallet.
                        </p>
                        <div>
                            <Label>Amount to Refund (₹)</Label>
                            <Input type="number" placeholder={`Leave blank to refund full paid amount`} value={refundData.amount} onChange={(e) => setRefundData({ ...refundData, amount: e.target.value })} />
                        </div>
                        <div>
                            <Label>Reason *</Label>
                            <Input placeholder="e.g. Duplicate entry, overpaid..." value={refundData.reason} onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setIsRefundOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleTicketRefund}>Process Refund</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ==================== MODALS: VIEW DETAILS ==================== */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                                        <span className="font-mono text-sm font-medium">
                                            {selectedExpense.ticketNumber || "N/A"}
                                        </span>
                                        {!selectedExpense.isActive && (
                                            <Badge variant="destructive" className="ml-2 text-[10px]">Inactive</Badge>
                                        )}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <Badge variant={selectedExpense.status === "Approved" ? "success" : selectedExpense.status === "Rejected" ? "destructive" : "outline"}>
                                            {selectedExpense.status}
                                        </Badge>
                                        {selectedExpense.paymentStatus && (
                                            <Badge variant={selectedExpense.paymentStatus === "Paid" ? "default" : "secondary"}>
                                                Payment: {selectedExpense.paymentStatus}
                                            </Badge>
                                        )}
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

                            {/* Employee Details / Paid To Details */}
                            <div>
                                <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-primary">
                                    <User className="h-4 w-4" /> {selectedExpense.expenseType === "Finance Payment" ? "Paid To (Recipient)" : "Employee Details"}
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/10 rounded-lg border">
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-0.5">Name</span>
                                        <span className="font-medium text-sm">
                                            {selectedExpense.expenseType === "Finance Payment" 
                                                ? (selectedExpense.paidToName || selectedExpense.paidToUserId?.name || "N/A") 
                                                : (selectedExpense.employeeId?.name || "N/A")}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-0.5">Email</span>
                                        <span className="text-sm">
                                            {selectedExpense.expenseType === "Finance Payment" 
                                                ? (selectedExpense.paidToEmail || selectedExpense.paidToUserId?.email || "N/A") 
                                                : (selectedExpense.employeeId?.email || "N/A")}
                                        </span>
                                    </div>
                                    
                                    {selectedExpense.expenseType !== "Finance Payment" ? (
                                        <>
                                            <div>
                                                <span className="text-xs text-muted-foreground block mb-0.5">Emp ID</span>
                                                <span className="font-mono text-sm">{selectedExpense.employeeId?.employeeId || "N/A"}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground block mb-0.5">Phone</span>
                                                <span className="text-sm">{selectedExpense.employeeId?.phone || "N/A"}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <span className="text-xs text-muted-foreground block mb-0.5">Phone</span>
                                            <span className="text-sm">
                                                {selectedExpense.paidToPhone || selectedExpense.paidToUserId?.phone || "N/A"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Basic Details with Project & Category */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border">
                                    <div>
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                            <FolderOpen className="h-3.5 w-3.5" /> Project
                                        </Label>
                                        <div className="font-medium text-sm mt-1">
                                            {selectedExpense.projectId?.name || "N/A"}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                            <Tag className="h-3.5 w-3.5" /> Category
                                        </Label>
                                        <div className="font-medium text-sm mt-1 flex items-center gap-2">
                                            {selectedExpense.categoryId?.name ? (
                                                <Badge variant="outline" className="text-xs font-normal flex items-center gap-1.5 px-2 py-0.5">
                                                    <div
                                                        className="h-3 w-3 rounded-full flex items-center justify-center shrink-0 text-white"
                                                        style={{ backgroundColor: selectedExpense.categoryId?.color || "#3b82f6" }}
                                                    >
                                                        {selectedExpense.categoryId?.icon && renderDynamicIcon(selectedExpense.categoryId.icon, "h-2 w-2")}
                                                    </div>
                                                    {selectedExpense.categoryId.name}
                                                </Badge>
                                            ) : (
                                                <span>{selectedExpense.category || "N/A"}</span>
                                            )}
                                        </div>
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

                            <Separator />

                            {/* Wallet & Payment Distribution Summary */}
                            <div>
                                <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-primary">
                                    <DollarSign className="h-4 w-4" /> Payment Distribution
                                </Label>
                                <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg border text-center">
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-1">Wallet Adjusted</span>
                                        <span className="font-semibold text-emerald-600">₹{selectedExpense.walletUsed || 0}</span>
                                    </div>
                                    <div className="border-l border-r border-border">
                                        <span className="text-xs text-muted-foreground block mb-1">Cash Paid</span>
                                        <span className="font-semibold text-blue-600">₹{selectedExpense.cashAmount || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-1">Pending</span>
                                        <span className="font-semibold text-rose-600">₹{selectedExpense.paymentPendingAmount || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Approval Info Section */}
                            {selectedExpense.approvalHistory && selectedExpense.approvalHistory.length > 0 && (
                                <>
                                    <Separator className="mt-8" />
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle className="h-4 w-4" /> Approval Details
                                        </Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs text-muted-foreground block">Approved By</span>
                                                <div className="font-medium text-sm">
                                                    {selectedExpense.approvalHistory[0]?.by?.name || selectedExpense.approvedBy?.name || "N/A"}
                                                    <span className="text-xs text-muted-foreground block">{selectedExpense.approvedBy?.email}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-muted-foreground block">Approved On</span>
                                                <div className="font-medium text-sm">
                                                    {formatDate(selectedExpense.approvalHistory[0]?.date || selectedExpense.approvedAt)}
                                                </div>
                                            </div>
                                            {selectedExpense.approverRemarks && (
                                                <div className="md:col-span-2">
                                                    <span className="text-xs text-muted-foreground">Approver Remarks</span>
                                                    <div className="text-sm p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-md mt-1 border border-emerald-100 dark:border-emerald-900/50">
                                                        {selectedExpense.approverRemarks}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Cash Payment History Section */}
                            {selectedExpense.paymentHistory && selectedExpense.paymentHistory.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <Label className="text-muted-foreground flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                                            <LucideIcons.Receipt className="h-4 w-4" /> Cash Payment History
                                        </Label>
                                        <div className="space-y-3">
                                            {selectedExpense.paymentHistory.map((pay, idx) => (
                                                <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-md border border-blue-100 dark:border-blue-900/50 text-sm">
                                                    <div><span className="text-xs text-muted-foreground block mb-0.5">Amount</span><span className="font-bold text-blue-600">₹{pay.amount}</span></div>
                                                    <div><span className="text-xs text-muted-foreground block mb-0.5">Method</span><span className="font-medium">{pay.method}</span></div>
                                                    <div><span className="text-xs text-muted-foreground block mb-0.5">Reference</span><span className="font-mono text-xs">{pay.reference || "N/A"}</span></div>
                                                    <div>
                                                        <span className="text-xs text-muted-foreground block mb-0.5">Paid By</span>
                                                        <span className="font-medium truncate block" title={pay.paidBy?.email}>{pay.paidBy?.name || "N/A"}</span>
                                                    </div>
                                                    <div><span className="text-xs text-muted-foreground block mb-0.5">Date</span><span className="font-medium">{formatDate(pay.paidAt)}</span></div>
                                                    {pay.remarks && <div className="col-span-full text-muted-foreground italic mt-1 text-xs">Note: {pay.remarks}</div>}
                                                </div>
                                            ))}
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
                                            <LucideIcons.XCircle className="h-4 w-4" /> Rejection Details
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