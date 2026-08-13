import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
	// BuildHive Base: Added cursor-pointer alongside the sharper geometry and focus rings
	"group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				// Core structural actions
				default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",

				// Data/Form actions - Uses mid-teal accent wash on hover
				outline:
					"border-border/80 bg-background hover:bg-accent/10 hover:text-foreground hover:border-border aria-expanded:bg-accent/10 aria-expanded:text-foreground shadow-sm",

				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground shadow-sm",

				// Navigation/Subtle actions - Uses mid-teal accent wash
				ghost:
					"hover:bg-accent/10 hover:text-foreground aria-expanded:bg-accent/10 aria-expanded:text-foreground",

				// Critical actions (Ashirwad Red)
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm focus-visible:ring-destructive",

				// BuildHive specific: Machinery/Warning actions (Rust Orange)
				warning:
					"bg-warning text-primary-foreground hover:bg-warning/90 shadow-sm focus-visible:ring-warning",

				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default:
					"h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
				xs: "h-6 gap-1 rounded-sm px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-8 gap-1 rounded-sm px-2.5 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
				lg: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
				icon: "size-9",
				"icon-xs":
					"size-6 rounded-sm in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
				"icon-sm":
					"size-8 rounded-sm in-data-[slot=button-group]:rounded-md",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props} />
	);
}

export { Button, buttonVariants }