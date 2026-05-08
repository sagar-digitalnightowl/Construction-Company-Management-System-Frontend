import React from "react";
import { cn } from "@/lib/helpers";

export function PageHeader({ title, eyebrow, description, actions, className }) {
    return (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-7", className)}>
            <div className="space-y-2">
                {eyebrow && (
                    <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                        {eyebrow}
                    </div>
                )}
                <h1 className="font-display text-3xl sm:text-[2.1rem] font-semibold tracking-tight leading-[1.1]">
                    {title}
                </h1 >
                {description && (
                    <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
                )
                }
            </div >
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div >
    );
}

export function StatCard({ label, value, delta, deltaTone = "neutral", icon: Icon, accent = "primary" }) {
    const toneCls = {
        up: "text-[color:var(--color-success)]",
        down: "text-destructive",
        neutral: "text-muted-foreground",
    }[deltaTone];

    return (
        <div data-testid={`stat-${label?.replace(/s+/g, '-').toLowerCase()}`} className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
            < div className="flex items-start justify-between">
                < div >
                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-medium">{label}</div>
                    < div className="font-display text-[1.85rem] font-semibold mt-1.5 leading-none">{value}</div>
                    {
                        delta && (
                            <div className={cn("mt-2 text-xs font-medium", toneCls)}>{delta}</div>
                        )}
                </ div>
                {Icon && (
                    <div className={cn(
                        "h-10 w-10 rounded-lg grid place-items-center shrink-0 transition-transform group-hover:scale-105",
                        accent === "primary" && "bg-primary/10 text-primary",
                        accent === "neutral" && "bg-muted text-foreground",
                        accent === "warning" && "bg-[color-mix(in_oklab,var(--color-warning)_18%,transparent)] text-[color:color-mix(in_oklab,var(--color-warning)_60%,black)]",
                        accent === "success" && "bg-[color-mix(in_oklab,var(--color-success)_18%,transparent)] text-[color:var(--color-success)]",
                    )}>
                        <Icon className="h-5 w-5" />
                    </div>
                )
                }
            </div >
        </div >
    );
}

export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="border border-dashed border-border rounded-xl p-12 text-center">
            {
                Icon && (
                    <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground grid place-items-center mx-auto mb-4">
                        < Icon className="h-5 w-5" />
                    </div >
                )
            }
            <div className="font-display text-lg font-semibold">{title}</div>
            {
                description && <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{description}</p>}
            {
                action && <div className="mt-4">{action}</div>}
        </div >
    );
}
