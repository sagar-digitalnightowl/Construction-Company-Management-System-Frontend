// Bank transactions (PDF section 9C): filters, quick chips, paginated table, Excel and PDF export.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionDetailDialog } from "@/components/bank/TransactionDetailDialog";
import { bankApi } from "@/api/bankApi";
import { projectApi } from "@/api/projectApi";
import { useAuthStore } from "@/store/authStore";
import { BANK_EXPORT_ROLES, BANK_INACTIVE_ROLES, SOURCE_LABEL, bankOptionLabel, cleanParams, downloadBlobResponse, formatAmount } from "@/lib/bank";
import { formatDate } from "@/lib/helpers";

const errMsg = (err, fallback) => err?.response?.data?.message || fallback;

// Local date as YYYY-MM-DD (not UTC, so "today" matches the user's day)
const iso = (d) => {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
};

const DATE_CHIPS = {
	today: () => {
		const t = iso(new Date());
		return { startDate: t, endDate: t };
	},
	last7: () => {
		const end = new Date();
		const start = new Date();
		start.setDate(end.getDate() - 6);
		return { startDate: iso(start), endDate: iso(end) };
	},
	month: () => {
		const now = new Date();
		return { startDate: iso(new Date(now.getFullYear(), now.getMonth(), 1)), endDate: iso(now) };
	},
};

const CHIPS = [
	{ key: "today", label: "Today", params: () => ({ ...DATE_CHIPS.today() }) },
	{ key: "last7", label: "Last 7 days", params: () => ({ ...DATE_CHIPS.last7() }) },
	{ key: "month", label: "This month", params: () => ({ ...DATE_CHIPS.month() }) },
	{ key: "credits", label: "All credits", params: () => ({ type: "credit" }) },
	{ key: "debits", label: "All debits", params: () => ({ type: "debit" }) },
];

const EMPTY_FILTERS = { bankId: "", type: "", source: "", projectId: "", startDate: "", endDate: "", search: "" };
const PAGE_SIZE = 20;

export default function BankTransactions() {
	const [searchParams] = useSearchParams();
	const role = (useAuthStore((s) => s.current)?.role || "").toLowerCase();
	const canSeeInactive = BANK_INACTIVE_ROLES.includes(role);
	const canExport = BANK_EXPORT_ROLES.includes(role);

	const [filters, setFilters] = useState({ ...EMPTY_FILTERS, bankId: searchParams.get("bankId") || "" });
	const [draftSearch, setDraftSearch] = useState("");
	const [chip, setChip] = useState(null);
	const [page, setPage] = useState(1);
	const [rows, setRows] = useState([]);
	const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
	const [loading, setLoading] = useState(false);
	const [banks, setBanks] = useState([]);
	const [projects, setProjects] = useState([]);
	const [viewing, setViewing] = useState(null);
	const [exporting, setExporting] = useState("");

	useEffect(() => {
		bankApi
			.list(canSeeInactive ? { includeInactive: true } : undefined)
			.then((res) => setBanks(res?.data?.data?.banks || []))
			.catch(() => toast.error("Could not load the bank list"));
		projectApi
			.getAll({ page: 1, limit: 100 })
			.then((res) => setProjects(res?.data?.data?.projects || []))
			.catch(() => setProjects([]));
	}, [canSeeInactive]);

	const query = useMemo(() => cleanParams(filters), [filters]);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const res = await bankApi.transactions({ ...query, page, limit: PAGE_SIZE });
			const body = res?.data?.data || {};
			setRows(body.transactions || []);
			setPagination(body.pagination || { page, pages: 1, total: 0 });
		} catch (err) {
			toast.error(errMsg(err, "Could not load transactions"));
		} finally {
			setLoading(false);
		}
	}, [query, page]);

	useEffect(() => {
		load();
	}, [load]);

	const change = (patch) => {
		setFilters((f) => ({ ...f, ...patch }));
		setPage(1);
	};

	const pickChip = (c) => {
		if (chip === c.key) {
			setChip(null);
			change({ startDate: "", endDate: "", type: "" });
			return;
		}
		setChip(c.key);
		const p = c.params();
		// Date chips replace the date range; type chips replace the type. Other filters are kept.
		change({ startDate: p.startDate || "", endDate: p.endDate || "", type: p.type || "" });
	};

	const applySearch = (e) => {
		e.preventDefault();
		change({ search: draftSearch.trim() });
	};

	const clearAll = () => {
		setChip(null);
		setDraftSearch("");
		setPage(1);
		setFilters({ ...EMPTY_FILTERS });
	};

	const exportAs = async (format) => {
		setExporting(format);
		try {
			const res = await bankApi.exportTransactions(format, query);
			const ext = format === "excel" ? "xlsx" : "pdf";
			downloadBlobResponse(res, `bank-transactions.${ext}`);
		} catch (err) {
			toast.error(errMsg(err, "Could not export the transactions"));
		} finally {
			setExporting("");
		}
	};

	const selectValue = (v) => (v === "" ? "all" : v);
	const fromSelect = (v) => (v === "all" ? "" : v);

	return (
		<div className="space-y-5 sm:space-y-6">
			<Link to="/banks" className="text-sm text-primary inline-flex items-center gap-1">
				<ArrowLeft className="h-4 w-4" /> Back to banks
			</Link>

			<PageHeader
				title="Bank transactions"
				description="Every credit and debit across the bank accounts, with buyer, flat and installment details."
				actions={
					<div className="flex flex-wrap gap-2">
						{canExport && (
						<>
						<Button variant="outline" onClick={() => exportAs("excel")} disabled={!!exporting}>
							<FileSpreadsheet className="h-4 w-4 mr-2" /> {exporting === "excel" ? "Preparing..." : "Export to Excel"}
						</Button>
						<Button variant="outline" onClick={() => exportAs("pdf")} disabled={!!exporting}>
							<FileText className="h-4 w-4 mr-2" /> {exporting === "pdf" ? "Preparing..." : "Export to PDF"}
						</Button>
						</>
						)}
					</div>
				}
			/>

			<Card>
				<CardContent className="space-y-4 pt-6">
					<div className="flex flex-wrap gap-2">
						{CHIPS.map((c) => (
							<Button
								key={c.key}
								size="sm"
								variant={chip === c.key ? "default" : "outline"}
								aria-pressed={chip === c.key}
								onClick={() => pickChip(c)}
							>
								{c.label}
							</Button>
						))}
						<Button size="sm" variant="ghost" onClick={clearAll}>
							Clear filters
						</Button>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div>
							<Label>Bank</Label>
							<Select value={selectValue(filters.bankId)} onValueChange={(v) => change({ bankId: fromSelect(v) })}>
								<SelectTrigger>
									<SelectValue placeholder="All banks" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All banks</SelectItem>
									{banks.map((b) => (
										<SelectItem key={b._id} value={b._id}>
											{bankOptionLabel(b)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Type</Label>
							<Select value={selectValue(filters.type)} onValueChange={(v) => change({ type: fromSelect(v) })}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Credit and debit</SelectItem>
									<SelectItem value="credit">Credit</SelectItem>
									<SelectItem value="debit">Debit</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Source</Label>
							<Select value={selectValue(filters.source)} onValueChange={(v) => change({ source: fromSelect(v) })}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All sources</SelectItem>
									{Object.entries(SOURCE_LABEL).map(([v, label]) => (
										<SelectItem key={v} value={v}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Project</Label>
							<Select value={selectValue(filters.projectId)} onValueChange={(v) => change({ projectId: fromSelect(v) })}>
								<SelectTrigger>
									<SelectValue placeholder="All projects" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All projects</SelectItem>
									{projects.map((p) => (
										<SelectItem key={p._id} value={p._id}>
											{p.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>From</Label>
							<Input type="date" value={filters.startDate} onChange={(e) => change({ startDate: e.target.value })} />
						</div>
						<div>
							<Label>To</Label>
							<Input type="date" value={filters.endDate} onChange={(e) => change({ endDate: e.target.value })} />
						</div>
						<form onSubmit={applySearch} className="sm:col-span-2 lg:col-span-2">
							<Label>Search buyer, flat, tower, reference, voucher or receipt</Label>
							<div className="flex gap-2">
								<Input value={draftSearch} onChange={(e) => setDraftSearch(e.target.value)} placeholder="e.g. Rajesh or 303" />
								<Button type="submit" variant="secondary">
									Search
								</Button>
							</div>
						</form>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
						<span>{pagination.total ?? 0} transactions</span>
					</div>
					{loading ? (
						<div className="text-sm text-muted-foreground">Loading...</div>
					) : rows.length === 0 ? (
						<div className="text-sm text-muted-foreground">No transactions match these filters</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Date</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Source</TableHead>
										<TableHead>Bank</TableHead>
										<TableHead>Buyer</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Tower</TableHead>
										<TableHead>Flat</TableHead>
										<TableHead>Installment</TableHead>
										<TableHead className="text-right">Amount</TableHead>
										<TableHead>Mode</TableHead>
										<TableHead>Reference</TableHead>
										<TableHead>Voucher</TableHead>
										<TableHead>Receipt</TableHead>
										<TableHead>Performed by</TableHead>
										<TableHead>Remarks</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.map((t) => (
										<TableRow key={t._id} className="cursor-pointer" onClick={() => setViewing(t)}>
											<TableCell className="whitespace-nowrap">{formatDate(t.transactionDate)}</TableCell>
											<TableCell>
												<Badge variant={t.type === "credit" ? "success" : "destructive"}>{t.type}</Badge>
											</TableCell>
											<TableCell>{SOURCE_LABEL[t.source] || t.source}</TableCell>
											<TableCell className="whitespace-nowrap">{t.bankId?.bankName || "—"}</TableCell>
											<TableCell>{t.buyerSnapshot?.name || t.clientId?.name || "—"}</TableCell>
											<TableCell>{t.projectSnapshot?.name || t.projectId?.name || "—"}</TableCell>
											<TableCell>{t.flatSnapshot?.towerName || "—"}</TableCell>
											<TableCell>{t.flatSnapshot?.flatNumber || "—"}</TableCell>
											<TableCell>{t.installmentSnapshot ? `#${t.installmentSnapshot.installmentNumber}` : "—"}</TableCell>
											<TableCell className={`text-right font-semibold whitespace-nowrap ${t.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>
												{t.type === "credit" ? "+" : "−"}
												{formatAmount(t.amount)}
											</TableCell>
											<TableCell>{t.paymentMode || "—"}</TableCell>
											<TableCell>{t.referenceNumber || t.transactionId || "—"}</TableCell>
											<TableCell>{t.voucherNumber || "—"}</TableCell>
											<TableCell>{t.receiptNumber || "—"}</TableCell>
											<TableCell>{t.performedBy?.name || "—"}</TableCell>
											<TableCell className="max-w-[200px] truncate">{t.remarks || "—"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}

					{pagination.pages > 1 && (
						<div className="flex items-center justify-end gap-2 pt-4">
							<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
								Previous
							</Button>
							<span className="text-sm text-muted-foreground">
								Page {page} of {pagination.pages}
							</span>
							<Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>
								Next
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			<TransactionDetailDialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} transaction={viewing} />
		</div>
	);
}
