import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users2, FolderKanban, HardHat, ShoppingCart, Truck,
    Boxes, Receipt, BadgeIndianRupee, HeartHandshake, FileText, BarChart3, Settings, ConstructionIcon,
} from "lucide-react";
import { cn } from "@/lib/helpers";
import { canView } from "@/data/permissions";

const navGroups = [
    {
        label: "Overview",
        items: [
            { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
        ],
    },
    {
        label: "Operations",
        items: [
            {
                to: "/projects", label: "Projects", icon: FolderKanban, key: "projects"
            },
            {
                to: "/sites", label: "Site Management", icon: HardHat, key: "sites"
            },
            {
                to: "/procurement", label: "Procurement", icon: ShoppingCart, key: "procurement"
            },
            {
                to: "/vendors", label: "Vendors", icon: Truck, key: "vendors"
            },
            { to: "/inventory", label: "Inventory", icon: Boxes, key: "inventory" },
        ],
    },
    {
        label: "Business",
        items: [
            {
                to: "/finance", label: "Finance & Billing", icon: BadgeIndianRupee, key: "finance"
            },
            {
                to: "/hr", label: "HR & Payroll", icon: Users2, key: "hr"
            },
            {
                to: "/crm", label: "CRM & Clients", icon: HeartHandshake, key: "crm"
            },
            { to: "/documents", label: "Documents", icon: FileText, key: "documents" },
        ],
    },
    {
        label: "Insights",
        items: [
            { to: "/reports", label: "Reports", icon: BarChart3, key: "reports" },
        ],
    },
    {
        label: "Administration",
        items: [
            {
                to: "/users", label: "User & Roles", icon: Users2, key: "users"
            },
            { to: "/settings", label: "Settings", icon: Settings, key: "settings" },
        ],
    },
];

export function Sidebar({ role }) {
    const location = useLocation();
    return (
        <aside
            data-testid="app-sidebar"
            className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
        >
            <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
                < div className="h-9 w-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center shadow-sm">
                    < ConstructionIcon className="h-5 w-5" />
                </div >
                <div className="leading-tight">
                    < div className="font-display text-[1.05rem] font-semibold tracking-tight">CCMS</div>
                    < div className="text-[10.5px] uppercase tracking-[0.18em] text-sidebar-foreground/55">
                        Construction OS
                    </div >
                </div >
            </div >

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {
                    navGroups.map((group) => {
                        const items = group.items.filter((it) => canView(role, it.key));
                        if (!items.length) return null;
                        return (
                            <div key={group.label}>
                                <div className="px-2 mb-1.5 text-[10.5px] uppercase tracking-[0.16em] text-sidebar-foreground/40 font-medium">
                                    {group.label}
                                </div>
                                <ul className="space-y-0.5">
                                    {
                                        items.map((it) => {
                                            const Icon = it.icon;
                                            const active = location.pathname.startsWith(it.to);
                                            return (
                                                <li key={it.to}>
                                                    <NavLink
                                                        to={it.to}
                                                        data-testid={`nav-${it.key}`}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all duration-150",
                                                            active
                                                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                                : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                                                        )}
                                                    >
                                                        <Icon className={cn("h-4 w-4 shrink-0", active && "text-sidebar-primary")} />
                                                        <span className="truncate">{it.label}</span>
                                                        {
                                                            active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
                                                    </NavLink >
                                                </li >
                                            );
                                        })
                                    }
                                </ul >
                            </div >
                        );
                    })}
            </nav >

           
        </aside >
    );
}