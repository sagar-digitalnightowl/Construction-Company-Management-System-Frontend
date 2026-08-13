// src/components/ui/toggle.jsx
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
	// BuildHive: Industrial rounded-md geometry, cursor-pointer, and 1px offset architectural focus ring
	"inline-flex items-center justify-center rounded-md text-sm font-medium transition-all cursor-pointer hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent/20 data-[state=on]:text-foreground data-[state=on]:font-semibold",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				outline:
					"border border-input bg-transparent hover:bg-accent/10 hover:text-foreground data-[state=on]:bg-accent/20 data-[state=on]:border-border",
			},
			size: {
				// BuildHive: Matched to h-9 footprint for form consistency
				default: "h-9 px-3",
				sm: "h-8 px-2.5 text-xs",
				lg: "h-10 px-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const Toggle = React.forwardRef(
	({ className, variant, size, ...props }, ref) => (
		<TogglePrimitive.Root
			ref={ref}
			className={cn(toggleVariants({ variant, size, className }))}
			{...props}
		/>
	),
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };