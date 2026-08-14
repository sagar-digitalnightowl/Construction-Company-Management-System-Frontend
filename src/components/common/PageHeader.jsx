import React from "react";
import { cn } from "../../lib/helpers";

export function PageHeader({ title, eyebrow, description, actions, className }) {
	return (
		<div className={cn("mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
			<div className="space-y-2">
				{eyebrow && (
					<div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
						{eyebrow}
					</div>
				)}
				<h1 className="font-display text-3xl sm:text-[2.1rem] font-semibold tracking-tight leading-[1.1] text-foreground">
					{title}
				</h1>
				{description && (
					<p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
				)}
			</div>
			{actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
		</div>
	);
}

export function StatCard({
	label,
	value,
	delta,
	deltaTone = "neutral",
	icon: Icon,
	accent = "primary",
	valueClassName,
	className,
	size = "default",
}) {
	// BuildHive: Native TW4 colors based on your theme block
	const toneCls = {
		up: "text-success",
		down: "text-destructive",
		neutral: "text-muted-foreground",
	}[deltaTone];

	const compact = size === "compact";

	return (
		<div
			data-testid={`stat-${label?.replace(/\s+/g, "-").toLowerCase()}`}
			className={cn(
				"group relative overflow-hidden rounded-md border border-border/80 bg-card transition-all hover:shadow-md hover:border-border",
				"before:absolute before:inset-0 before:pointer-events-none before:opacity-50",
				"before:bg-[linear-gradient(90deg,color-mix(in_oklab,var(--primary)_3%,transparent)_1px,transparent_1px),linear-gradient(0deg,color-mix(in_oklab,var(--primary)_3%,transparent)_1px,transparent_1px)]",
				"before:bg-[size:18px_18px]",
				compact ? "p-3" : "p-5",
				className,
			)}
		>
			<div className="relative z-10 flex items-start justify-between">
				<div>
					<div
						className={cn(
							// Restored original label typography and sizing
							"uppercase tracking-[0.16em] text-muted-foreground font-medium",
							compact ? "text-[10px]" : "text-[11px]",
						)}
					>
						{label}
					</div>
					<div
						className={cn(
							"font-display font-semibold text-foreground",
							compact ? "mt-1 text-lg" : "mt-1.5 text-[1.85rem]",
							valueClassName,
						)}
					>
						{value}
					</div>
					{delta && <div className={cn("mt-2 text-xs font-medium", toneCls)}>{delta}</div>}
				</div>
				{Icon && (
					<div
						className={cn(
							// Restored original rounded-lg shape for the icon
							"grid shrink-0 place-items-center rounded-lg transition-transform group-hover:scale-105",
							compact ? "h-8 w-8" : "h-10 w-10",

							// BuildHive: Native TW4 variable mapping
							accent === "primary" && "bg-primary/10 text-primary",
							accent === "neutral" && "bg-muted text-foreground",
							accent === "warning" && "bg-warning/15 text-warning",
							accent === "success" && "bg-success/15 text-success",
							accent === "destructive" && "bg-destructive/10 text-destructive",
							accent === "info" && "bg-info/15 text-info",
							accent === "equipment" && "bg-equipment/15 text-equipment",
						)}
					>
						<Icon className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
					</div>
				)}
			</div>
		</div>
	);
}

export function EmptyState({ icon: Icon, title, description, action }) {
	return (
		// BuildHive: Updated to rounded-md to match Button and Card borders
		<div className="rounded-md border-2 border-dashed border-border/60 bg-muted/10 p-12 text-center transition-colors hover:border-border/80 hover:bg-muted/20">
			{Icon && (
				// Restored original rounded-full shape for the icon wrapper
				<div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
					<Icon className="h-5 w-5" />
				</div>
			)}
			<div className="font-display text-lg font-semibold tracking-wide text-foreground">
				{title}
			</div>
			{description && (
				<p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
					{description}
				</p>
			)}
			{action && <div className="mt-5">{action}</div>}
		</div>
	);
}