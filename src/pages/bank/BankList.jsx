// Banks page (PDF section 9A): bank master list, overview cards, add / edit / activate / delete.
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, Pencil, Plus, Trash2, ArrowRightLeft } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BankFormDialog } from "@/components/bank/BankFormDialog";
import { bankApi } from "@/api/bankApi";
import { useAuthStore } from "@/store/authStore";
import { BANK_DELETE_ROLES, BANK_INACTIVE_ROLES, BANK_WRITE_ROLES, formatAmount, maskAccount } from "@/lib/bank";

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

export default function BankList() {
	const role = (useAuthStore((s) => s.current)?.role || "").toLowerCase();
	const canWrite = BANK_WRITE_ROLES.includes(role);
	const canDelete = BANK_DELETE_ROLES.includes(role);
	const canSeeInactive = BANK_INACTIVE_ROLES.includes(role);

	const [banks, setBanks] = useState([]);
	const [overview, setOverview] = useState(null);
	const [includeInactive, setIncludeInactive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [deleting, setDeleting] = useState(null);

	const loadOverview = useCallback(async () => {
		try {
			const res = await bankApi.overview();
			setOverview(res?.data?.data || null);
		} catch (err) {
			toast.error(errMsg(err, "Could not load the bank overview"));
		}
	}, []);

	const loadBanks = useCallback(async () => {
		setLoading(true);
		try {
			const res = await bankApi.list(includeInactive && canSeeInactive ? { includeInactive: true } : undefined);
			setBanks(res?.data?.data?.banks || []);
		} catch (err) {
			toast.error(errMsg(err, "Could not load banks"));
		} finally {
			setLoading(false);
		}
	}, [includeInactive, canSeeInactive]);

	useEffect(() => {
		loadOverview();
	}, [loadOverview]);

	useEffect(() => {
		loadBanks();
	}, [loadBanks]);

	const refreshAll = () => {
		loadBanks();
		loadOverview();
	};

	const saveBank = async (body, id) => {
		try {
			const res = id ? await bankApi.update(id, body) : await bankApi.create(body);
			toast.success(res?.data?.message || (id ? "Bank updated" : "Bank added"));
			refreshAll();
			return true;
		} catch (err) {
			toast.error(errMsg(err, "Could not save the bank"));
			return false;
		}
	};

	const toggleActive = async (bank, value) => {
		try {
			await bankApi.update(bank._id, { isActive: value });
			toast.success(value ? "Bank activated" : "Bank deactivated");
			refreshAll();
		} catch (err) {
			toast.error(errMsg(err, "Could not change the bank status"));
		}
	};

	const confirmDelete = async () => {
		try {
			const res = await bankApi.remove(deleting._id);
			toast.success(res?.data?.message || "Bank deleted. Its transactions are kept for reports.");
			setDeleting(null);
			refreshAll();
		} catch (err) {
			toast.error(errMsg(err, "Could not delete the bank"));
		}
	};

	const o = overview || {};

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Banks"
				description="Bank accounts where buyer payments are deposited, with their running balances."
				actions={
					<div className="flex gap-2">
						<Button variant="outline" asChild>
							<Link to="/banks/transactions">
								<ArrowRightLeft className="h-4 w-4 mr-2" /> Transactions
							</Link>
						</Button>
						{canWrite && (
							<Button
								onClick={() => {
									setEditing(null);
									setFormOpen(true);
								}}
							>
								<Plus className="h-4 w-4 mr-2" /> Add bank
							</Button>
						)}
					</div>
				}
			/>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
				<Stat label="Total banks" value={o.totalBanks ?? "—"} />
				<Stat label="Active banks" value={o.activeBanks ?? "—"} />
				<Stat label="Total balance" value={formatAmount(o.totalBalance)} />
				<Stat label="Total credits" value={formatAmount(o.totalCredits)} tone="text-emerald-600" />
				<Stat label="Total debits" value={formatAmount(o.totalDebits)} tone="text-red-600" />
				<Stat label="Transactions today" value={o.transactionsToday ?? "—"} />
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="text-base">Bank accounts</CardTitle>
						{canSeeInactive && (
							<label className="flex items-center gap-2 text-sm">
								<Switch checked={includeInactive} onCheckedChange={setIncludeInactive} />
								Show inactive
							</label>
						)}
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					{loading ? (
						<div className="text-sm text-muted-foreground">Loading...</div>
					) : banks.length === 0 ? (
						<div className="text-sm text-muted-foreground">No banks yet</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Bank</TableHead>
										<TableHead>Branch</TableHead>
										<TableHead>Account</TableHead>
										<TableHead>IFSC</TableHead>
										<TableHead className="text-right">Balance</TableHead>
										<TableHead>Active</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{banks.map((b) => (
										<TableRow key={b._id} className={b.isActive ? "" : "opacity-60"}>
											<TableCell className="font-medium">{b.bankName}</TableCell>
											<TableCell>{b.branchName}</TableCell>
											<TableCell className="font-mono text-xs">{maskAccount(b.accountNumber)}</TableCell>
											<TableCell className="font-mono text-xs">{b.ifscCode}</TableCell>
											<TableCell
												className={`text-right font-semibold ${(b.currentBalance ?? 0) < 0 ? "text-red-600" : "text-emerald-600"}`}
											>
												{formatAmount(b.currentBalance)}
											</TableCell>
											<TableCell>
												{canWrite ? (
													<Switch
														checked={!!b.isActive}
														onCheckedChange={(v) => toggleActive(b, v)}
														aria-label={`Active: ${b.bankName}`}
													/>
												) : (
													<Badge variant={b.isActive ? "success" : "secondary"}>{b.isActive ? "Active" : "Inactive"}</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-1">
													<Button variant="ghost" size="icon" asChild title="View" aria-label="View">
														<Link to={`/banks/${b._id}`}>
															<Eye className="h-4 w-4" />
														</Link>
													</Button>
													{canWrite && (
														<Button
															variant="ghost"
															size="icon"
															title="Edit"
															aria-label="Edit"
															onClick={() => {
																setEditing(b);
																setFormOpen(true);
															}}
														>
															<Pencil className="h-4 w-4" />
														</Button>
													)}
													{canDelete && (
														<Button variant="ghost" size="icon" title="Delete" aria-label="Delete" onClick={() => setDeleting(b)}>
															<Trash2 className="h-4 w-4 text-destructive" />
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			<BankFormDialog open={formOpen} onOpenChange={setFormOpen} bank={editing} onSave={saveBank} />

			<ConfirmDialog
				open={!!deleting}
				onOpenChange={(o) => !o && setDeleting(null)}
				title="Delete this bank?"
				description={`${deleting?.bankName || ""} will be hidden from the bank list and the payment picker. Its past transactions are kept in the reports.`}
				confirmLabel="Delete bank"
				onConfirm={confirmDelete}
			/>
		</div>
	);
}
