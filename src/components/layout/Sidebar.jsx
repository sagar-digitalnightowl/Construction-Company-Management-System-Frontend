import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users2,
  FolderKanban,
  HardHat,
  ShoppingCart,
  Truck,
  Boxes,
  Receipt,
  BadgeIndianRupee,
  HeartHandshake,
  FileText,
  BarChart3,
  Settings,
  ConstructionIcon,
  LayoutTemplate,
  ChevronDown,
  ChevronRight,
  BookCheck,
} from "lucide-react";
import { cn } from "@/lib/helpers";
import { canView } from "@/data/permissions";

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        key: "dashboard",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        to: "/projects",
        label: "Projects",
        icon: FolderKanban,
        key: "projects",
      },
      {
        to: "/project-templates",
        label: "Project Templates",
        icon: LayoutTemplate,
        key: "project-templates",
      },
      {
        to: "/site-management",
        label: "Site Management",
        icon: HardHat,
        key: "site-management",
      },
      // {
      //   label: "Procurement",
      //   icon: ShoppingCart,
      //   key: "procurement",
      //   children: [
      //     {
      //       to: "/procurement/dashboard",
      //       label: "Dashboard",
      //       key: "procurement-overview",
      //     },
      //     { to: "/procurement/rfqs", label: "RFQs", key: "procurement-rfqs" },
      //     {
      //       to: "/procurement/quotations",
      //       label: "Quotations",
      //       key: "procurement-quotations",
      //     },
      //     {
      //       to: "/procurement/purchase-orders",
      //       label: "Purchase Orders",
      //       key: "procurement-pos",
      //     },
      //     {
      //       to: "/procurement/deliveries",
      //       label: "Deliveries",
      //       key: "procurement-deliveries",
      //     },
      //   ],
      // },
      // {
      //   to: "/vendor/dashboard",
      //   label: "Vendor",
      //   icon: Truck,
      //   key: "vendor",
      // },
      // {
      //   // Inventory with sub-items
      //   label: "Inventory",
      //   icon: Boxes,
      //   key: "inventory",
      //   children: [
      //     {
      //       to: "/inventory/stock-management",
      //       label: "Stock Management",
      //       key: "inventory-stock-management",
      //     },
      //     {
      //       to: "/inventory/materials",
      //       label: "Materials Master",
      //       key: "inventory-materials",
      //     },
      //     {
      //       to: "/inventory/warehouses",
      //       label: "Warehouses",
      //       key: "inventory-warehouses",
      //     },
      //     {
      //       to: "/inventory/transactions",
      //       label: "Stock Transactions",
      //       key: "inventory-transactions",
      //     },
      //     {
      //       to: "/inventory/alerts",
      //       label: "Low Stock Alerts",
      //       key: "inventory-alerts",
      //     },
      //     {
      //       to: "/inventory/valuation",
      //       label: "Inventory Valuation",
      //       key: "inventory-valuation",
      //     },
      //     {
      //       to: "/inventory/counts",
      //       label: "Physical Counts",
      //       key: "inventory-counts",
      //     },
      //   ],
      // },
      {
        label: "Booking",
        icon: BookCheck,
        key: "booking",
        children: [
          { to: "/bookings", label: "Bookings", key: "bookings" },
          { to: "/my-bookings", label: "My Bookings", key: "my-bookings" },
          {
            to: "/my-installments",
            label: "My Installments",
            key: "my-installments",
          },
          {
            to: "/pending-bookings",
            label: "Pending Bookings",
            key: "pending-bookings",
          },
        ],
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        to: "/property-inventory",
        label: "Property Inventory",
        icon: Boxes,
        key: "property-inventory",
      },
      {
        to: "/finance",
        label: "Finance & Billing",
        icon: BadgeIndianRupee,
        key: "finance",
      },
      {
        to: "/hr",
        label: "HR & Payroll",
        icon: Users2,
        key: "hr",
      },
      {
        to: "/leaves",
        label: "Leaves & Attendance",
        icon: Users2,
        key: "leaves",
      },
      {
        to: "/crm",
        label: "CRM & Buyers",
        icon: HeartHandshake,
        key: "crm",
      },
      {
        to: "/documents",
        label: "Documents",
        icon: FileText,
        key: "documents",
      },
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
        to: "/users",
        label: "User & Roles",
        icon: Users2,
        key: "users",
      },
      { to: "/settings", label: "Settings", icon: Settings, key: "settings" },
    ],
  },
];

export function Sidebar({ role, onClickLink }) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(() => {
    // Auto‑expand the menu that contains the current route
    const open = {};
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.children) {
          const hasActiveChild = item.children.some((child) =>
            location.pathname.startsWith(child.to),
          );
          if (hasActiveChild) open[item.key] = true;
        }
      }
    }
    return open;
  });

  const toggleMenu = (key) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to check if a route is active (exact or starts with)
  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to);

  return (
    <aside className="h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center shadow-sm">
          <ConstructionIcon className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-[1.05rem] font-semibold tracking-tight">
            Ashirwaad
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-sidebar-foreground/55">
            Construction OS
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 sidebar-scroll">
        {navGroups.map((group) => {
          // Filter items based on permissions
          const visibleItems = group.items.filter((it) => {
            if (it.children) {
              // Parent is visible if at least one child is visible
              return it.children.some((child) => canView(role, child.key));
            }
            return canView(role, it.key);
          });
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <div className="px-2 mb-1.5 text-[10.5px] uppercase tracking-[0.16em] text-sidebar-foreground/40 font-medium">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {visibleItems.map((it) => {
                  const Icon = it.icon;
                  const hasChildren = it.children && it.children.length > 0;
                  const isExpanded = expandedMenus[it.key];

                  // If it has children, render a collapsible parent
                  if (hasChildren) {
                    // Filter children by permission
                    const visibleChildren = it.children.filter((child) =>
                      canView(role, child.key),
                    );
                    if (visibleChildren.length === 0) return null;

                    return (
                      <li key={it.key}>
                        <button
                          onClick={() => toggleMenu(it.key)}
                          className="w-full flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-all duration-150 text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{it.label}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                        {isExpanded && (
                          <ul className="ml-6 mt-0.5 space-y-0.5 pl-2 border-l border-sidebar-border">
                            {visibleChildren.map((child) => {
                              const ChildIcon = child.icon || (() => null); // Use parent icon or null
                              const active = isActive(child.to);
                              return (
                                <li key={child.to}>
                                  <NavLink
                                    to={child.to}
                                    onClick={onClickLink}
                                    className={cn(
                                      "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all duration-150",
                                      active
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
                                    )}
                                  >
                                    {ChildIcon && (
                                      <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                                    )}
                                    <span className="truncate">
                                      {child.label}
                                    </span>
                                    {active && (
                                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                                    )}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  // Regular leaf item
                  const active = isActive(it.to);
                  return (
                    <li key={it.to}>
                      <NavLink
                        to={it.to}
                        onClick={onClickLink}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all duration-150",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active && "text-sidebar-primary",
                          )}
                        />
                        <span className="truncate">{it.label}</span>
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
