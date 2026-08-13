import * as React from "react";
import { cn } from "../../lib/helpers";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
	<input
		type={type}
		ref={ref}
		className={cn(
			// BuildHive: Crisp geometry, subtle shadow, and disabled state that visually recedes
			"flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all",
			"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
			"placeholder:text-muted-foreground",
			// BuildHive: Architectural focus ring mapping to the deep teal (--ring) with a sharp offset
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:border-primary",
			// BuildHive: Distinct locked state for read-only/disabled operational data
			"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
			className
		)}
		{...props}
	/>
));
Input.displayName = "Input";

export { Input };