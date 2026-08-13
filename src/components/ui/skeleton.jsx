import { cn } from "@/lib/utils"

function Skeleton({
	className,
	...props
}) {
	return (
		<div
			data-slot="skeleton"
			// BuildHive: Smoother pulse duration and translucent muted tone for card/data loading states
			className={cn("animate-pulse duration-700 rounded-md bg-muted/65", className)}
			{...props} />
	);
}

export { Skeleton }