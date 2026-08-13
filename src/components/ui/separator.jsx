import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../../lib/helpers";

const Separator = React.forwardRef(
	({
		className, orientation = "horizontal", decorative = true, ...props }, ref) => (
		<SeparatorPrimitive.Root
			ref={ref}
			decorative={decorative}
			orientation={orientation}
			className={cn(
				// BuildHive: Softer border/60 color to reduce visual noise across dense operational panels
				"shrink-0 bg-border/60",
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				className
			)}
			{...props}
		/>
	)
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };