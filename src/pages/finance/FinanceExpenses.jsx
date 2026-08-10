import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import {
	CreditCard, Search, FileText, Eye, DollarSign, Hash, User, Tag, Calendar,
	CheckCircle, RotateCcw, Wallet, ArrowDownCircle, ArrowUpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { hrApi } from "@/api/hrApi";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function FinanceExpenses() {
	// ==================== MAIN TABS STATE ====================
	const [mainTab, setMainTab] = useState("expenses");

	// ==================== EXPENSE TICKETS STATE ====================
	const [activeTab, setActiveTab] = useState("Approved");
	const [expenses, setExpenses] = useState([]);
	const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const [selectedExpense, setSelectedExpense] = useState(null);
	const [isPayOpen, setIsPayOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isRefundOpen, setIsRefundOpen] = useState(false);

	const [paymentData, setPaymentData] = useState({ paymentMethod: "", paymentReference: "", remarks: "", amount: "" });
	const [refundData, setRefundData] = useState({ amount: "", reason: "" });

	// ==================== WALLET STATE & HOOKS ====================
	const {
		employees, fetchEmployees,
		employeeWallet, employeeWalletTransactions,
		fetchEmployeeWallet, fetchEmployeeWalletTransactions,
		addWalletMoney, refundWallet
	} = useHR();

	const [selectedEmpId, setSelectedEmpId] = useState("");
	const [empSearchTerm, setEmpSearchTerm] = useState("");
	const [empPage, setEmpPage] = useState(1);
	const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
	const [isWalletRefundOpen, setIsWalletRefundOpen] = useState(false);
	const [walletForm, setWalletForm] = useState({ amount: "", remarks: "" });

	// ==================== EFFECTS: EXPENSE TICKETS ====================
	const fetchExpensesData = async (tab, page = 1, limit = 10, search = "") => {
		setLoading(true);
		try {
			const params = { page, limit };
			if (search.trim()) params.search = search.trim();

			let res;
			if (tab === "Approved") {
				res = await hrApi.getPendingPayments(params);
			} else {
				params.paymentStatus = "Paid";
				res = await hrApi.getAllExpenses(params);
			}

			const responseData = res.data?.data || {};
			setExpenses(Array.isArray(responseData.tickets) ? responseData.tickets : []);
			if (responseData.pagination) setPagination(responseData.pagination);
		} catch (err) {
			toast.error("Failed to load expenses");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (mainTab === "expenses") {
			fetchExpensesData(activeTab, 1, 10, searchTerm);
		}
	}, [activeTab, mainTab]);

	// ==================== EFFECTS: WALLETS ====================
	useEffect(() => {
		if (mainTab === "wallets") {
			const debounce = setTimeout(() => {
				fetchEmployees({ search: empSearchTerm, page: empPage, limit: 10 });
			}, 500);
			return () => clearTimeout(debounce);
		}
	}, [empSearchTerm, empPage, fetchEmployees, mainTab]);

	useEffect(() => {
		if (selectedEmpId && mainTab === "wallets") {
			fetchEmployeeWallet(selectedEmpId);
			fetchEmployeeWalletTransactions(selectedEmpId, { page: 1, limit: 10 });
		}
	}, [selectedEmpId, fetchEmployeeWallet, fetchEmployeeWalletTransactions, mainTab]);

	// ==================== HANDLERS: EXPENSE TICKETS ====================
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

	return (
		<div className="space-y-4 mt-5">

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
								<TabsTrigger value="Approved">Pending Payments</TabsTrigger>
								<TabsTrigger value="Paid">Paid History</TabsTrigger>
							</TabsList>
						</Tabs>
						<div className="relative w-full sm:w-64">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search ticket or title..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
						</div>
					</div>

					<div className="border rounded-md">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Employee</TableHead>
									<TableHead>Title</TableHead>
									<TableHead>Project</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Total Amount</TableHead>
									<TableHead>Cash Pending</TableHead>
									<TableHead>Proof</TableHead>
									<TableHead className="text-right">Actions</TableHead>
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
											<TableRow key={expense._id}>
												<TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
												<TableCell>
													<div className="font-medium">{expense.employeeId?.name}</div>
													<div className="text-xs text-muted-foreground">{expense.ticketNumber}</div>
												</TableCell>
												<TableCell>{expense.title}</TableCell>
												<TableCell>
													<div className="font-medium">
														{expense.projectId?.name || "N/A"}
													</div>
												</TableCell>
												<TableCell>
													{categoryName ? (
														<Badge variant="outline" className="text-[10px] font-normal flex items-center w-fit gap-1.5 pl-1 pr-2 py-1">
															<div
																className="h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-white"
																style={{ backgroundColor: categoryColor }}
															>
																{categoryIcon && renderDynamicIcon(categoryIcon, "h-2.5 w-2.5")}
															</div>
															{categoryName}
														</Badge>
													) : (
														<span className="text-xs text-muted-foreground">None</span>
													)}
												</TableCell>
												<TableCell className="font-bold">₹{expense.amount}</TableCell>
												<TableCell>
													<Badge variant={expense.paymentPendingAmount > 0 ? "destructive" : "success"}>
														₹{expense.paymentPendingAmount}
													</Badge>
												</TableCell>
												<TableCell>
													{expense.proofUrl ? (
														<a href={expense.proofUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
															<FileText className="h-3 w-3" /> View
														</a>
													) : "N/A"}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button variant="ghost" size="sm" onClick={() => openModal(expense, 'view')}>
															<Eye className="h-4 w-4" />
														</Button>
														{activeTab === "Approved" && (
															<Button size="sm" onClick={() => openModal(expense, 'pay')}>
																<CreditCard className="mr-1 h-3.5 w-3.5" /> Pay
															</Button>
														)}

														{/* COMMMENTED OUT REFUND BUTTON */}
														{/* activeTab === "Paid" && (
                            <Button size="sm" variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => openModal(expense, 'refund')}>
                              <RotateCcw className="mr-1 h-3.5 w-3.5" /> Refund
                            </Button>
                          ) */}

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

							{/* 🟢 NEW CLEAN EMPLOYEE TABLE 🟢 */}
							<div className="border rounded-md">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Employee</TableHead>
											<TableHead>Emp ID</TableHead>
											<TableHead>Designation & Dept</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Action</TableHead>
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

													{/* Profile, Name & Email */}
													<TableCell>
														<div className="flex items-center gap-3">
															<div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
																{emp?.profileImage ? (
																	<img src={emp.profileImage} alt={emp.name} className="h-full w-full object-cover" />
																) : (
																	<User className="h-5 w-5 text-muted-foreground" />
																)}
															</div>
															<div>
																<div className="font-medium text-sm leading-none">{emp?.name}</div>
																<div className="text-xs text-muted-foreground mt-1">{emp?.email}</div>
															</div>
														</div>
													</TableCell>

													{/* Employee ID */}
													<TableCell className="font-mono text-xs text-muted-foreground">
														{emp?.employeeId || "N/A"}
													</TableCell>

													{/* Designation & Department */}
													<TableCell>
														<div className="font-medium text-sm capitalize">
															{emp?.jobDetails?.designation || emp?.role?.replace('_', ' ')}
														</div>
														<div className="text-xs text-muted-foreground mt-1">
															{emp?.department?.name || "No Department"}
														</div>
													</TableCell>

													{/* Status Badge */}
													<TableCell>
														<Badge variant={emp?.isActive ? "success" : "secondary"} className="text-[10px]">
															{emp?.status || (emp?.isActive ? "Active" : "Inactive")}
														</Badge>
													</TableCell>

													{/* Action Button */}
													<TableCell className="text-right">
														<Button
															variant="outline"
															size="sm"
															onClick={() => setSelectedEmpId(emp?._id)}
															disabled={!emp?.isActive}
														>
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
										← Back to List
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

			{/* ==================== MODALS: EXPENSES TAB ==================== */}
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

			<Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-xl">
							<FileText className="h-5 w-5 text-primary" /> Expense Details
						</DialogTitle>
					</DialogHeader>

					{selectedExpense && (
						<div className="space-y-6 py-4">
							<div className="flex justify-between items-start">
								<div>
									<div className="flex items-center gap-2">
										<Hash className="h-4 w-4 text-muted-foreground" />
										<span className="font-mono text-sm font-medium">{selectedExpense.ticketNumber || "N/A"}</span>
									</div>
									<div className="mt-2 flex gap-2">
										<Badge variant="outline">{selectedExpense.status}</Badge>
										<Badge variant={selectedExpense.paymentStatus === "Paid" ? "default" : "secondary"}>
											Payment: {selectedExpense.paymentStatus}
										</Badge>
									</div>
								</div>
								<div className="text-right">
									<div className="text-3xl font-bold text-primary">₹{selectedExpense.amount}</div>
									<div className="text-xs text-muted-foreground mt-1">Requested on: {formatDate(selectedExpense.createdAt)}</div>
								</div>
							</div>

							<Separator />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<Label className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-4 w-4" /> Employee Info</Label>
									<div className="font-medium text-base">{selectedExpense.employeeId?.name || "N/A"}</div>
									<div className="text-sm text-muted-foreground">{selectedExpense.employeeId?.email}</div>
								</div>
								<div>
									<Label className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-4 w-4" /> Wallet Adjustments</Label>
									<div className="text-sm">Wallet Used: <span className="font-medium">₹{selectedExpense.walletUsed || 0}</span></div>
									<div className="text-sm mt-1">Cash Paid/Pending: <span className="font-medium text-rose-600">₹{selectedExpense.cashAmount || 0}</span></div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<div>
									<Label className="text-muted-foreground">Title</Label>
									<div className="font-medium text-lg">{selectedExpense.title}</div>
								</div>
								<div>
									<Label className="text-muted-foreground">Description</Label>
									<div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap mt-1">{selectedExpense.description || "No description."}</div>
								</div>
							</div>

							{selectedExpense.paymentHistory && selectedExpense.paymentHistory.length > 0 && (
								<>
									<Separator />
									<div>
										<Label className="text-muted-foreground flex items-center gap-2 mb-3 text-emerald-600">
											<DollarSign className="h-4 w-4" /> Cash Payment History
										</Label>
										<div className="space-y-3">
											{selectedExpense.paymentHistory.map((pay, idx) => (
												<div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/30 rounded-md border text-sm">
													<div><span className="text-xs text-muted-foreground block">Amount</span><span className={`font-bold ${pay.amount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>₹{pay.amount}</span></div>
													<div><span className="text-xs text-muted-foreground block">Method</span>{pay.method}</div>
													<div><span className="text-xs text-muted-foreground block">Reference</span><span className="font-mono">{pay.reference}</span></div>
													<div><span className="text-xs text-muted-foreground block">Date</span>{new Date(pay.paidAt).toLocaleDateString()}</div>
													{pay.remarks && <div className="col-span-full text-muted-foreground italic mt-1">Note: {pay.remarks}</div>}
												</div>
											))}
										</div>
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

			{/* ==================== MODALS: WALLETS TAB ==================== */}
			<Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
				<DialogContent>
					<DialogHeader><DialogTitle>Add Money to Wallet (Advance)</DialogTitle></DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>Amount (₹) <span className="text-destructive">*</span></Label>
							<Input type="number" placeholder="10000" value={walletForm.amount} onChange={(e) => setWalletForm({ ...walletForm, amount: e.target.value })} />
						</div>
						<div>
							<Label>Remarks</Label>
							<Input placeholder="Site visit advance..." value={walletForm.remarks} onChange={(e) => setWalletForm({ ...walletForm, remarks: e.target.value })} />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddMoneyOpen(false)}>Cancel</Button>
						<Button onClick={() => handleWalletSubmit('add')} className="bg-blue-600 hover:bg-blue-700 text-white">Add Amount</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={isWalletRefundOpen} onOpenChange={setIsWalletRefundOpen}>
				<DialogContent>
					<DialogHeader><DialogTitle>Refund Money to Wallet</DialogTitle></DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>Amount (₹) <span className="text-destructive">*</span></Label>
							<Input type="number" placeholder="500" value={walletForm.amount} onChange={(e) => setWalletForm({ ...walletForm, amount: e.target.value })} />
						</div>
						<div>
							<Label>Reason</Label>
							<Input placeholder="Returned unspent advance..." value={walletForm.remarks} onChange={(e) => setWalletForm({ ...walletForm, remarks: e.target.value })} />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsWalletRefundOpen(false)}>Cancel</Button>
						<Button onClick={() => handleWalletSubmit('refund')} className="bg-rose-600 hover:bg-rose-700 text-white">Process Refund</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

		</div>
	);
}