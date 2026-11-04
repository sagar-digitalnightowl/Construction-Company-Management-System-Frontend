// Add a manual credit or debit to a bank (PDF 5.3)
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAYMENT_MODES, formatAmount } from "@/lib/bank";

const EMPTY = {
	type: "credit",
	amount: "",
	paymentMode: "",
	transactionId: "",
	chequeNumber: "",
	chequeDate: "",
	referenceNumber: "",
	transactionDate: "",
	remarks: "",
};

export function ManualTransactionDialog({ open, onOpenChange, bank, onSave }) {
	const [form, setForm] = useState(EMPTY);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (open) {
			setForm(EMPTY);
			setError("");
		}
	}, [open]);

	const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

	const submit = async (e) => {
		e.preventDefault();
		const amount = Number(form.amount);
		if (!form.amount || !(amount > 0)) {
			setError("Enter an amount greater than zero");
			return;
		}
		const body = {
			type: form.type,
			amount,
			paymentMode: form.paymentMode || undefined,
			transactionId: form.transactionId.trim() || undefined,
			chequeNumber: form.chequeNumber.trim() || undefined,
			chequeDate: form.chequeDate || undefined,
			referenceNumber: form.referenceNumber.trim() || undefined,
			transactionDate: form.transactionDate || undefined,
			remarks: form.remarks.trim() || undefined,
		};
		setSaving(true);
		const ok = await onSave(bank._id, body);
		setSaving(false);
		if (ok) onOpenChange(false);
	};

	const isCheque = form.paymentMode === "Cheque";
	const needsTxnId = ["Bank Transfer", "NEFT", "RTGS", "TRF", "L-NEFT", "Card"].includes(form.paymentMode);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add manual transaction</DialogTitle>
					<DialogDescription>
						{bank?.bankName} · balance {formatAmount(bank?.currentBalance)}. A credit increases it, a debit decreases it.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={submit} className="space-y-4" noValidate>
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<Label>Type *</Label>
							<Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="credit">Credit (money in)</SelectItem>
									<SelectItem value="debit">Debit (money out)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Amount (₹) *</Label>
							<Input type="number" min="0" step="0.01" value={form.amount} onChange={set("amount")} />
						</div>
						<div>
							<Label>Payment mode</Label>
							<Select value={form.paymentMode || "none"} onValueChange={(v) => setForm({ ...form, paymentMode: v === "none" ? "" : v })}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">Not specified</SelectItem>
									{PAYMENT_MODES.map((m) => (
										<SelectItem key={m} value={m}>
											{m}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Transaction date</Label>
							<Input type="date" value={form.transactionDate} onChange={set("transactionDate")} />
							<p className="mt-1 text-xs text-muted-foreground">Leave empty to use today.</p>
						</div>
						{needsTxnId && (
							<div>
								<Label>Transaction ID</Label>
								<Input value={form.transactionId} onChange={set("transactionId")} />
							</div>
						)}
						{isCheque && (
							<>
								<div>
									<Label>Cheque number</Label>
									<Input value={form.chequeNumber} onChange={set("chequeNumber")} />
								</div>
								<div>
									<Label>Cheque date</Label>
									<Input type="date" value={form.chequeDate} onChange={set("chequeDate")} />
								</div>
							</>
						)}
						<div>
							<Label>Reference number</Label>
							<Input value={form.referenceNumber} onChange={set("referenceNumber")} />
						</div>
					</div>
					<div>
						<Label>Remarks *</Label>
						<Textarea rows={2} value={form.remarks} onChange={set("remarks")} placeholder="Cash deposit from buyer Ramesh" />
					</div>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
							Cancel
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? "Saving..." : "Record transaction"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default ManualTransactionDialog;
