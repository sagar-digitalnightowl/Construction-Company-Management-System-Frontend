import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../lib/helpers";

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		// BuildHive: Swapped rounded-full for rounded-md for an ID-badge/structural look
		className={cn("relative flex h-9 w-9 shrink-0 overflow-hidden rounded-md", className)}
		{...props}
	/>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		// BuildHive: Added object-cover so squared images don't stretch
		className={cn("aspect-square h-full w-full object-cover", className)}
		{...props}
	/>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			// BuildHive: Matching ID-badge geometry, deep teal branding, and stenciled font-display
			"flex h-full w-full items-center justify-center rounded-md bg-primary/10 font-display text-xs font-semibold tracking-wider text-primary",
			className
		)}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };