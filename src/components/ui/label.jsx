import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../lib/helpers";

const Label = React.forwardRef(({ className, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(
			// BuildHive: Crisp baseline legibility for dense forms
			"text-sm font-medium leading-none text-foreground",
			// BuildHive: Opacity exactly matches the Input's disabled state for a unified locked look
			"peer-disabled:cursor-not-allowed peer-disabled:opacity-50 transition-colors",
			className
		)}
		{...props}
	/>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };