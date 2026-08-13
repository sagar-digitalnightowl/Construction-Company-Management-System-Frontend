// src/components/ui/checkbox.jsx
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			// BuildHive: Crisp geometry, subtle shadow, and matching transition
			"peer h-4 w-4 shrink-0 rounded-sm border border-input bg-background shadow-sm transition-all",
			// BuildHive: Architectural focus ring mapped to deep teal with a sharp 1px offset
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
			// BuildHive: Unified locked state mirroring the Input component
			"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
			// Checked state pulls in the deep teal brand color
			"data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground cursor-pointer",
			className,
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn("flex items-center justify-center text-current")}
		>
			{/* BuildHive: Slightly thicker stroke for a more industrial, definitive checkmark */}
			<Check className="h-3 w-3 stroke-[3]" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };