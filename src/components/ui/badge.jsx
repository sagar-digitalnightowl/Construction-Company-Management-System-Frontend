import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/helpers";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary/10 text-primary",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
                destructive: "border-transparent bg-destructive/10 text-destructive",
                success: "border-transparent bg-[color-mix(in_oklab,var(--color-success)_15%,transparent)] text-[color:var(--color-success)]",
                warning: "border-transparent bg-[color-mix(in_oklab,var(--color-warning)_18%,transparent)] text-[color:color-mix(in_oklab,var(--color-warning)_60%,black)]",
                outline: "text-foreground border-border",
                muted: "border-transparent bg-muted text-muted-foreground",
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
