import * as React from "react";
import { cn } from "../../lib/helpers";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
	<textarea
		ref={ref}
		className={cn(
			// BuildHive: Crisp geometry, subtle shadow, matches the Input component surface footprint
			"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all",
			"placeholder:text-muted-foreground text-foreground",
			// BuildHive: Architectural focus ring mapped to deep teal with a sharp 1px offset
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:border-primary",
			// BuildHive: Unified locked state
			"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
			className
		)}
		{...props}
	/>
));
Textarea.displayName = "Textarea";

export { Textarea };