// Single bank page (PDF section 9B): header, summary cards, 6-month trend, recent transactions, manual entries, statement download.
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Download, Plus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ManualTransactionDialog } from "@/components/bank/ManualTransactionDialog";
import { TransactionDetailDialog } from "@/components/bank/TransactionDetailDialog";
import { bankApi } from "@/api/bankApi";
import { useAuthStore } from "@/store/authStore";
import { BANK_VIEW_ROLES, BANK_WRITE_ROLES, downloadBlobResponse, flatLabel, formatAmount } from "@/lib/bank";
import { formatDateTime } from "@/lib/helpers";

const errMsg = (err, fallback) => err?.response?.data?.message || fallback;

function Stat({ label, value, tone }) {
	return (
		<Card>
			<CardContent className="pt-6">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className={`mt-1 text-xl font-semibold ${tone || ""}`}>{value}</p>
			</CardContent>
		</Card>
	);
}

export default function BankDetail() {
	const { id } = useParams();
	const role = (useAuthStore((s) => s.current)?.role || "").toLowerCase();
	const canWrite = BANK_WRITE_ROLES.includes(role);
	const canView = BANK_VIEW_ROLES.includes(role);

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [manualOpen, setManualOpen] = useState(false);
	const [viewing, setViewing] = useState(null);
	const [exporting, setExporting] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const res = await bankApi.dashboard(id);
			setData(res?.data?.data || null);
		} catch (err) {
			toast.error(errMsg(err, "Could not load this bank"));
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		load();
	}, [load]);

	const saveManual = async (bankId, body) => {
		try {
			const res = await bankApi.addManualTransaction(bankId, body);
			toast.success(res?.data?.message || `Transaction recorded. New balance: ${formatAmount(res?.data?.data?.newBalance)}`);
			load();
			return true;
		} catch (err) {
			toast.error(errMsg(err, "Could not record the transaction"));
			return false;
		}
	};

	const downloadStatement = async () => {
		setExporting(true);
		try {
			const res = await bankApi.exportTransactions("excel", { bankId: id });
			downloadBlobResponse(res, `bank-statement-${id}.xlsx`);
		} catch (err) {
			toast.error(errMsg(err, "Could not download the statement"));
		} finally {
			setExporting(false);
		}
	};

	if (!canView) return null;

	if (loading) {
		return <div className="text-sm text-muted-foreground">Loading...</div>;
	}
	if (!data) {
		return (
			<div className="space-y-4">
				<Link to="/banks" className="text-sm text-primary inline-flex items-center gap-1">
					<ArrowLeft className="h-4 w-4" /> Back to banks
				</Link>
				<p className="text-sm text-muted-foreground">Bank not found.</p>
			</div>
		);
	}

	const bank = data.bank || {};
	const s = data.summary || {};
	const trend = data.monthlyTrend || [];
	const recent = data.recentTransactions || [];

	return (
		<div className="space-y-5 sm:space-y-6">
			<Link to="/banks" className="text-sm text-primary inline-flex items-center gap-1">
				<ArrowLeft className="h-4 w-4" /> Back to banks
			</Link>

			<PageHeader
				title={bank.bankName || "Bank"}
				description={`${bank.branchName || ""} · A/c ${bank.accountNumber || "—"} · IFSC ${bank.ifscCode || "—"}`}
				actions={
					<div className="flex flex-wrap gap-2">
						<Button variant="outline" onClick={downloadStatement} disabled={exporting}>
							<Download className="h-4 w-4 mr-2" /> {exporting ? "Preparing..." : "Download statement"}
						</Button>
						{canWrite && (
							<Button onClick={() => setManualOpen(true)}>
								<Plus className="h-4 w-4 mr-2" /> Add manual transaction
							</Button>
						)}
					</div>
				}
			/>

			<Card>
				<CardContent className="flex flex-col gap-2 pt-6 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs text-muted-foreground">Current balance</p>
						<p className={`text-3xl font-bold ${(bank.currentBalance ?? 0) < 0 ? "text-red-600" : "text-emerald-600"}`}>
							{formatAmount(bank.currentBalance)}
						</p>
					</div>
					<Badge variant={bank.isActive ? "success" : "secondary"}>{bank.isActive ? "Active" : "Inactive"}</Badge>
				</CardContent>
			</Card>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
				<Stat label="Opening balance" value={formatAmount(s.openingBalance)} />
				<Stat label="Current balance" value={formatAmount(s.currentBalance)} />
				<Stat label="Total credits" value={formatAmount(s.totalCredits)} tone="text-emerald-600" />
				<Stat label="Total debits" value={formatAmount(s.totalDebits)} tone="text-red-600" />
				<Stat label="Transactions" value={s.totalTransactions ?? "—"} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Last 6 months</CardTitle>
				</CardHeader>
				<CardContent className="h-72 pt-2">
					{trend.length === 0 ? (
						<div className="text-sm text-muted-foreground">No transactions in the last 6 months</div>
					) : (
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis dataKey="month" tick={{ fontSize: 12 }} />
								<YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} tick={{ fontSize: 12 }} width={90} />
								<Tooltip formatter={(v) => formatAmount(v)} />
								<Legend />
								<Bar dataKey="credit" name="Credits" stackId="flow" fill="#16a34a" />
								<Bar dataKey="debit" name="Debits" stackId="flow" fill="#dc2626" />
							</BarChart>
						</ResponsiveContainer>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="text-base">Recent transactions</CardTitle>
						<Link to={`/banks/transactions?bankId=${id}`} className="text-sm text-primary">
							View all transactions
						</Link>
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					{recent.length === 0 ? (
						<div className="text-sm text-muted-foreground">No transactions yet</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Buyer</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Flat</TableHead>
										<TableHead>Installment</TableHead>
										<TableHead className="text-right">Amount</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recent.map((t) => (
										<TableRow key={t._id} className="cursor-pointer" onClick={() => setViewing(t)}>
											<TableCell className="whitespace-nowrap">{formatDateTime(t.transactionDate)}</TableCell>
											<TableCell>
												<Badge variant={t.type === "credit" ? "success" : "destructive"}>{t.type}</Badge>
											</TableCell>
											<TableCell>{t.buyerSnapshot?.name || t.clientId?.name || "—"}</TableCell>
											<TableCell>{t.projectSnapshot?.name || t.projectId?.name || "—"}</TableCell>
											<TableCell>{flatLabel(t)}</TableCell>
											<TableCell>{t.installmentSnapshot ? `#${t.installmentSnapshot.installmentNumber}` : "—"}</TableCell>
											<TableCell className={`text-right font-semibold ${t.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>
												{t.type === "credit" ? "+" : "−"}
												{formatAmount(t.amount)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<ManualTransactionDialog open={manualOpen} onOpenChange={setManualOpen} bank={bank} onSave={saveManual} />
			<TransactionDetailDialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} transaction={viewing} />
		</div>
	);
}
