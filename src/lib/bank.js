// src/lib/bank.js
// Shared helpers and role rules for the bank module (PDF v2.8).

// Who can add, edit and record manual transactions (PDF 1.1, 3.4, 5.3)
export const BANK_WRITE_ROLES = ["admin", "director", "finance_executive", "accountant"];
// Who can soft-delete a bank (PDF 3.5)
export const BANK_DELETE_ROLES = ["admin", "director"];
// Who can download exports (PDF 1.1 role table: admin, director, finance, accountant, HR)
export const BANK_EXPORT_ROLES = [...BANK_WRITE_ROLES, "hr_manager"];
// Who can see inactive banks (PDF 3.2)
export const BANK_INACTIVE_ROLES = ["admin", "director", "finance_executive", "accountant"];
// Who can open the bank pages, dashboards, transactions and exports
export const BANK_VIEW_ROLES = [...BANK_WRITE_ROLES, "hr_manager", "project_manager"];

export const TYPE_LABEL = { credit: "Credit", debit: "Debit" };

export const SOURCE_LABEL = {
	installment_payment: "Installment payment",
	booking_payment: "Booking payment",
	manual: "Manual",
	opening_balance: "Opening balance",
	adjustment: "Adjustment",
};

export const PAYMENT_MODES = ["Cash", "Cheque", "Bank Transfer", "Card", "NEFT", "RTGS", "TRF", "L-NEFT", "Demand Draft"];

export const formatAmount = (n) => {
	if (n == null || isNaN(n)) return "—";
	return `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
};

// Shows only the last four digits of an account number
export const lastFour = (accountNumber) => {
	const s = String(accountNumber || "");
	return s.length > 4 ? s.slice(-4) : s;
};

export const maskAccount = (accountNumber) => {
	const s = String(accountNumber || "");
	return s.length > 4 ? `••••${s.slice(-4)}` : s || "—";
};

// Option label used by every bank picker: "State Bank of India ••••012"
export const bankOptionLabel = (bank) => `${bank.bankName} ${maskAccount(bank.accountNumber)}`;

export const flatLabel = (t) => {
	const parts = [t.flatSnapshot?.towerName, t.flatSnapshot?.floor && `Floor ${t.flatSnapshot.floor}`, t.flatSnapshot?.flatNumber && `Flat ${t.flatSnapshot.flatNumber}`];
	return parts.filter(Boolean).join(" / ") || "—";
};

// Saves a binary response as a file. The name comes from Content-Disposition when present.
export const downloadBlobResponse = (res, fallbackName) => {
	const disposition = res.headers?.["content-disposition"] || "";
	const match = /filename="?([^";]+)"?/i.exec(disposition);
	const name = match ? match[1] : fallbackName;
	const url = URL.createObjectURL(res.data);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Turns the active filters into query params (empty values are dropped)
export const cleanParams = (params) =>
	Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null && v !== "all"));
