// src/components/ui/switch.jsx
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/helpers";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			// BuildHive: Crisp rounded-sm track geometry, shadow-sm, and smooth color transitions
			"peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-sm border-2 border-transparent shadow-sm transition-colors",
			// BuildHive: Architectural focus ring mapped to deep teal with a sharp 1px offset
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
			// BuildHive: Unified locked state mirroring inputs and checkboxes
			"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
			// Checked state pulls in deep brand teal, unchecked uses input border color
			"data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
			className,
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				// BuildHive: Squared-off rounded-sm thumb matching the track geometry
				"pointer-events-none block h-4 w-4 rounded-sm bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0",
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };