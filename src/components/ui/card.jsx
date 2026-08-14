import * as React from "react";
import { cn } from "../../lib/helpers";

const Card = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"group relative overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-[0_1px_0_rgba(15,15,15,0.04),0_1px_2px_rgba(15,15,15,0.04)]",
			"before:absolute before:inset-0 before:pointer-events-none before:opacity-50",
			"before:bg-[linear-gradient(90deg,color-mix(in_oklab,var(--primary)_3%,transparent)_1px,transparent_1px),linear-gradient(0deg,color-mix(in_oklab,var(--primary)_3%,transparent)_1px,transparent_1px)]",
			"before:bg-[size:18px_18px]",
			className
		)}
		{...props}
	/>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn("font-display text-lg font-semibold leading-tight tracking-tight", className)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
	<p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };