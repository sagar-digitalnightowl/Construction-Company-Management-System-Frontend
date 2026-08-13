import React from "react";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
	AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/helpers";

export function ConfirmDialog({
	open,
	onOpenChange,
	title = "Are you sure?",
	description,
	onConfirm,
	confirmLabel = "Delete",
	variant = "destructive", // "destructive" | "primary"
	className
}) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent
				data-testid="confirm-dialog"
				// BuildHive: Softer border for consistency with the rest of the floating UI
				className={cn("border-border/80 shadow-lg", className)}
			>
				<AlertDialogHeader>
					{/* BuildHive: Blueprint/industrial typography for dialog titles */}
					<AlertDialogTitle className="font-display text-xl tracking-wide text-foreground">
						{title}
					</AlertDialogTitle>
					{description && (
						<AlertDialogDescription className="text-muted-foreground">
							{description}
						</AlertDialogDescription>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel data-testid="confirm-cancel">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						data-testid="confirm-action"
						onClick={onConfirm}
						className={cn(
							// BuildHive: Native TW4 variables applied based on action severity
							variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
							variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90"
						)}
					>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}