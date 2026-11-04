// Create or edit a bank (PDF 3.1 and 3.4). Opening balance is only set on create.
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { formatAmount } from "@/lib/bank";

const EMPTY = {
	bankName: "",
	branchName: "",
	accountName: "",
	accountNumber: "",
	ifscCode: "",
	micrCode: "",
	swiftCode: "",
	upiId: "",
	openingBalance: "",
	description: "",
	isActive: true,
};

// Fields the PDF marks as required on create
const REQUIRED = ["bankName", "branchName", "accountName", "accountNumber", "ifscCode"];

export function BankFormDialog({ open, onOpenChange, bank, onSave }) {
	const editing = !!bank;
	const [form, setForm] = useState(EMPTY);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!open) return;
		setError("");
		setForm(
			bank
				? {
						bankName: bank.bankName || "",
						branchName: bank.branchName || "",
						accountName: bank.accountName || "",
						accountNumber: bank.accountNumber || "",
						ifscCode: bank.ifscCode || "",
						micrCode: bank.micrCode || "",
						swiftCode: bank.swiftCode || "",
						upiId: bank.upiId || "",
						openingBalance: bank.openingBalance ?? "",
						description: bank.description || "",
						isActive: bank.isActive !== false,
					}
				: EMPTY
		);
	}, [open, bank]);

	const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

	const submit = async (e) => {
		e.preventDefault();
		const missing = REQUIRED.filter((k) => !String(form[k] || "").trim());
		if (!editing && (form.openingBalance === "" || form.openingBalance === null)) missing.push("openingBalance");
		if (missing.length) {
			setError(`Fill in: ${missing.join(", ")}`);
			return;
		}
		if (!editing && Number(form.openingBalance) < 0) {
			setError("Opening balance cannot be negative");
			return;
		}

		// Edit sends identity fields only. Balances are changed through manual transactions (PDF 3.4).
		const body = {
			bankName: form.bankName.trim(),
			branchName: form.branchName.trim(),
			accountName: form.accountName.trim(),
			accountNumber: form.accountNumber.trim(),
			ifscCode: form.ifscCode.trim(),
			micrCode: form.micrCode.trim() || undefined,
			swiftCode: form.swiftCode.trim() || undefined,
			upiId: form.upiId.trim() || undefined,
			description: form.description.trim() || undefined,
			isActive: form.isActive,
		};
		if (!editing) body.openingBalance = Number(form.openingBalance);

		setSaving(true);
		const ok = await onSave(body, bank?._id);
		setSaving(false);
		if (ok) onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{editing ? "Edit bank" : "Add bank"}</DialogTitle>
					<DialogDescription>
						{editing
							? "Balances cannot be changed here. Use a manual transaction to adjust the balance."
							: "The opening balance is recorded as the first credit in this bank's ledger."}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={submit} className="space-y-4" noValidate>
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<Label>Bank name *</Label>
							<Input value={form.bankName} onChange={set("bankName")} placeholder="State Bank of India" />
						</div>
						<div>
							<Label>Branch *</Label>
							<Input value={form.branchName} onChange={set("branchName")} placeholder="Andheri West" />
						</div>
						<div>
							<Label>Account holder name *</Label>
							<Input value={form.accountName} onChange={set("accountName")} />
						</div>
						<div>
							<Label>Account number *</Label>
							<Input value={form.accountNumber} onChange={set("accountNumber")} inputMode="numeric" />
						</div>
						<div>
							<Label>IFSC code *</Label>
							<Input value={form.ifscCode} onChange={set("ifscCode")} placeholder="SBIN0001234" />
						</div>
						<div>
							<Label>MICR code</Label>
							<Input value={form.micrCode} onChange={set("micrCode")} />
						</div>
						<div>
							<Label>SWIFT code</Label>
							<Input value={form.swiftCode} onChange={set("swiftCode")} />
						</div>
						<div>
							<Label>UPI ID</Label>
							<Input value={form.upiId} onChange={set("upiId")} placeholder="ashirwad@upi" />
						</div>
						{editing ? (
							<div>
								<Label>Opening balance</Label>
								<Input value={formatAmount(bank.openingBalance)} disabled />
								<p className="mt-1 text-xs text-muted-foreground">Set at creation and cannot be changed.</p>
							</div>
						) : (
							<div>
								<Label>Opening balance (₹) *</Label>
								<Input type="number" min="0" value={form.openingBalance} onChange={set("openingBalance")} />
							</div>
						)}
						<div className="flex items-center justify-between gap-3 rounded-md border p-3 sm:mt-6">
							<div>
								<Label>Active</Label>
								<p className="text-xs text-muted-foreground">Inactive banks are hidden from the payment picker.</p>
							</div>
							<Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
						</div>
					</div>
					<div>
						<Label>Description</Label>
						<Textarea rows={2} value={form.description} onChange={set("description")} />
					</div>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
							Cancel
						</Button>
						<Button type="submit" disabled={saving}>
							{saving ? "Saving..." : editing ? "Save changes" : "Add bank"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default BankFormDialog;
