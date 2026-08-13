import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/helpers";

const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		// BuildHive: Crisp rounded-sm geometry and a lighter, translucent empty track
		className={cn("relative h-2 w-full overflow-hidden rounded-sm bg-muted/60", className)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			// BuildHive: Uses the deep brand teal by default with smooth mechanical easing
			className={cn(
				"h-full w-full flex-1 bg-primary transition-all duration-500 ease-in-out",
				indicatorClassName
			)}
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };