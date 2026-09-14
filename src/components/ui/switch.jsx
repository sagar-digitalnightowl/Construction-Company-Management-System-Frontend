// src/components/ui/switch.jsx

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/helpers";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		ref={ref}
		className={cn(
			"peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center",
			"rounded-full border border-border/60 shadow-sm",
			"transition-colors duration-200 ease-in-out",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			"focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"disabled:cursor-not-allowed disabled:opacity-50",
			"data-[state=checked]:border-primary",
			"data-[state=checked]:bg-primary",
			"data-[state=unchecked]:bg-muted",
			"data-[state=unchecked]:border-border",
			className,
		)}
		{...props}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				"pointer-events-none block h-4 w-4 rounded-full",
				"bg-background shadow-sm",
				"ring-0",
				"transition-transform duration-200 ease-in-out",
				"data-[state=checked]:translate-x-[18px]",
				"data-[state=unchecked]:translate-x-[2px]",
			)}
		/>
	</SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };