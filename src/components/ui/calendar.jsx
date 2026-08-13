import * as React from "react";
import { cn } from "@/lib/utils";

export function Calendar({ selected, onSelect, className, ...props }) {
	const value = selected ? selected.toISOString().split("T")[0] : "";

	return (
		<input
			type="date"
			value={value}
			onChange={(e) =>
				onSelect(e.target.value ? new Date(e.target.value) : undefined)
			}
			className={cn(
				// BuildHive: Crisp geometry, subtle shadow, matches the Input component footprint exactly
				"flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all text-foreground",
				"placeholder:text-muted-foreground",
				// BuildHive: Architectural focus ring mapped to deep teal with a sharp 1px offset
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:border-primary",
				// BuildHive: Unified locked state
				"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
				className,
			)}
			{...props}
		/>
	);
}