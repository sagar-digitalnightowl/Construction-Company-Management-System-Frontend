import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/helpers";

const badgeVariants = cva(
	// BuildHive: Industrial rounded-sm geometry, blueprint typography, and crisp focus rings
	"inline-flex items-center rounded-sm border px-2.5 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary/15 text-primary",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				destructive: "border-transparent bg-destructive/15 text-destructive",

				// BuildHive: Native TW4 variables based on your theme block
				success: "border-transparent bg-success/15 text-success",
				warning: "border-transparent bg-warning/15 text-warning",
				outline: "text-foreground border-border/80",
				muted: "border-transparent bg-muted/60 text-muted-foreground",

				// BuildHive Specific: Added info and equipment tags for asset/site management
				info: "border-transparent bg-info/15 text-info",
				equipment: "border-transparent bg-equipment/15 text-equipment",
			},
		},
		defaultVariants: {
			variant: "default"
		},
	}
);

function Badge({ className, variant, ...props }) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };