import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { useHR } from "@/hooks/useHR";

export function DeleteEmployeeDialog({
	open,
	onOpenChange,
	employee,
	onSuccess,
}) {
	const { deleteUser, loading } = useHR();

	const handleDeactivate = async () => {
		if (!employee?._id) return;

		const success = await deleteUser(employee._id);

		if (success) {
			onOpenChange(false);
			onSuccess?.();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-destructive">
						<UserX className="h-5 w-5" />
						Deactivate Employee
					</DialogTitle>

					<DialogDescription className="pt-2">
						This employee will no longer be able to access the system.
					</DialogDescription>
				</DialogHeader>

				<div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
					<p className="text-sm">
						Are you sure you want to deactivate:
					</p>

					<div className="mt-2">
						<p className="font-semibold">
							{employee?.name}
						</p>

						<p className="text-sm text-muted-foreground">
							{employee?.email}
						</p>
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
						variant="destructive"
						onClick={handleDeactivate}
						disabled={loading}
					>
						{loading ? "Deactivating..." : "Deactivate Employee"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}