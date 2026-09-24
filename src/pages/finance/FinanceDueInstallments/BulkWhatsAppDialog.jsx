import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function BulkWhatsAppDialog({
	isDialogOpen,
	setIsDialogOpen,
	selectedIds,
	selectedLanguage,
	setSelectedLanguage,
	handleConfirmSend,
	loading,
}) {
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-xl">Send Bulk WhatsApp Reminders</DialogTitle>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					{/* Polished informational callout box */}
					<div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground leading-relaxed">
						You are about to send WhatsApp reminders to <strong className="font-semibold text-foreground">{selectedIds.length}</strong> selected clients.
					</div>

					<div className="grid gap-2.5">
						<Label htmlFor="language" className="text-sm font-medium text-foreground/90">
							Message Language
						</Label>
						<Select
							value={selectedLanguage}
							onValueChange={setSelectedLanguage}
						>
							<SelectTrigger id="language" className="w-full">
								<SelectValue placeholder="Select Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="hi">Hindi</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Polished footer with mobile-responsive button sizing */}
				<DialogFooter className="gap-2 pt-2 sm:space-x-0">
					<Button
						variant="outline"
						onClick={() => setIsDialogOpen(false)}
						disabled={loading}
						className="w-full sm:w-auto"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmSend}
						disabled={loading}
						className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors"
					>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Yes, Send to All
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}