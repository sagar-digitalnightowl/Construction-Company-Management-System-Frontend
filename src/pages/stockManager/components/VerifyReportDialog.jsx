// src/pages/stockManager/components/VerifyReportDialog.jsx

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function VerifyReportDialog({ report, action, open, onOpenChange, onSubmit }) {
	const [note, setNote] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			await onSubmit(note);
			setNote("");
		} finally {
			setLoading(false);
		}
	};

	const isVerify = action === "verified";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{isVerify ? (
							<>
								<CheckCircle className="h-5 w-5 text-success" />
								Verify Report
							</>
						) : (
							<>
								<XCircle className="h-5 w-5 text-destructive" />
								Reject Report
							</>
						)}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="p-4 bg-muted rounded-lg">
						<div className="text-sm font-medium mb-1">Report Details</div>
						<div className="text-sm text-muted-foreground">
							<div>Item: {report?.itemName}</div>
							<div>Quantity: {report?.qty} {report?.unit}</div>
							<div>Amount: ₹{report?.totalAmount?.toLocaleString()}</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="note">
							{isVerify ? "Verification Note" : "Rejection Reason"} *
						</Label>
						<Textarea
							id="note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder={
								isVerify
									? "e.g. Slip verified — quantities match."
									: "e.g. Quantity does not match slip. Please clarify."
							}
							rows={4}
							required
						/>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!note.trim() || loading}
						variant={isVerify ? "default" : "destructive"}
					>
						{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
						{isVerify ? "Verify" : "Reject"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
