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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { hrApi } from "@/api/hrApi";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function FinanceExpenses() {
	const topRef = useRef(null);

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

	useEffect(() => {
		topRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [empPage]);

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

							{/* Employee Details */}
							<div>
								<Label className="text-muted-foreground flex items-center gap-2 mb-3 text-primary">
									<User className="h-4 w-4" /> Employee Details
								</Label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/10 rounded-lg border">
									<div>
										<span className="text-xs text-muted-foreground block mb-0.5">Name</span>
										<span className="font-medium text-sm">{selectedExpense.employeeId?.name || "N/A"}</span>
									</div>
									<div>
										<span className="text-xs text-muted-foreground block mb-0.5">Emp ID</span>
										<span className="font-mono text-sm">{selectedExpense.employeeId?.employeeId || "N/A"}</span>
									</div>
									<div>
										<span className="text-xs text-muted-foreground block mb-0.5">Email</span>
										<span className="text-sm">{selectedExpense.employeeId?.email || "N/A"}</span>
									</div>
									<div>
										<span className="text-xs text-muted-foreground block mb-0.5">Phone</span>
										<span className="text-sm">{selectedExpense.employeeId?.phone || "N/A"}</span>
									</div>
								</div>
							</div>

							<Separator />

							{/* Basic Details with Project & Category */}
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border">
									<div>
										<Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
											<LucideIcons.FolderOpen className="h-3.5 w-3.5" /> Project
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