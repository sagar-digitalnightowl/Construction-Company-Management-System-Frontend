// Shows one transaction. There is no single-transaction endpoint in PDF v2.8, so this uses the row data from the list.
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, formatDateTime } from "@/lib/helpers";
import { SOURCE_LABEL, TYPE_LABEL, flatLabel, formatAmount } from "@/lib/bank";

const Row = ({ label, children }) => (
	<div className="grid grid-cols-[9rem_1fr] gap-2 py-1 text-sm">
		<span className="text-muted-foreground">{label}</span>
		<span className="break-words">{children || "—"}</span>
	</div>
);

export function TransactionDetailDialog({ open, onOpenChange, transaction: t }) {
	if (!t) return null;
	const isCredit = t.type === "credit";
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className={isCredit ? "text-emerald-600" : "text-red-600"}>
						{isCredit ? "+" : "−"} {formatAmount(t.amount)} {TYPE_LABEL[t.type] || t.type}
					</DialogTitle>
					<DialogDescription>{SOURCE_LABEL[t.source] || t.source}</DialogDescription>
				</DialogHeader>
				<div className="divide-y">
					<Row label="Date">{formatDateTime(t.transactionDate)}</Row>
					<Row label="Bank">{t.bankId?.bankName && `${t.bankId.bankName}${t.bankId.branchName ? `, ${t.bankId.branchName}` : ""}`}</Row>
					<Row label="Buyer">{t.buyerSnapshot?.name || t.clientId?.name}</Row>
					<Row label="Project">{t.projectSnapshot?.name || t.projectId?.name}</Row>
					<Row label="Flat">{flatLabel(t)}</Row>
					<Row label="Installment">
						{t.installmentSnapshot
							? `#${t.installmentSnapshot.installmentNumber}${t.installmentSnapshot.description ? ` · ${t.installmentSnapshot.description}` : ""}`
							: null}
					</Row>
					<Row label="Payment mode">{t.paymentMode}</Row>
					<Row label="Cheque number">{t.chequeNumber}</Row>
					<Row label="Cheque date">{t.chequeDate ? formatDate(t.chequeDate) : null}</Row>
					<Row label="Transaction ID">{t.transactionId}</Row>
					<Row label="Reference">{t.referenceNumber}</Row>
					<Row label="Voucher #">{t.voucherNumber}</Row>
					<Row label="Receipt #">{t.receiptNumber}</Row>
					<Row label="Performed by">{t.performedBy?.name}</Row>
					<Row label="Remarks">{t.remarks}</Row>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default TransactionDetailDialog;
