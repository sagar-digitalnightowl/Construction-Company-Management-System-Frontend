// src/components/ui/sonner.jsx
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
	return (
		<Sonner
			theme="light"
			className="toaster group"
			position="top-right"
			richColors={false}
			closeButton
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border/80 group-[.toaster]:shadow-md group-[.toaster]:rounded-md group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:font-sans",
					title: "group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:text-foreground",
					description:
						"group-[.toast]:text-xs group-[.toast]:text-muted-foreground group-[.toast]:mt-0.5",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-sm group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs hover:group-[.toast]:opacity-90 transition-opacity",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toaster]:text-muted-foreground group-[.toast]:rounded-sm group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs hover:group-[.toast]:bg-muted/80 transition-colors",
					closeButton:
						"group-[.toast]:bg-transparent group-[.toast]:border-none group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground",
					success:
						"group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-primary group-[.toaster]:!bg-card",
					error:
						"group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-destructive group-[.toaster]:!bg-card",
					warning:
						"group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-warning group-[.toaster]:!bg-card",
					info:
						"group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-primary group-[.toaster]:!bg-card",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };