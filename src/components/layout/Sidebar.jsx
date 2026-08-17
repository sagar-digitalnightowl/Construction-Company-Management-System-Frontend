import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Users2,
	FolderKanban,
	HardHat,
	Boxes,
	Receipt,
	BadgeIndianRupee,
	HeartHandshake,
	FileText,
	BarChart3,
	Settings,
	ChevronDown,
	ChevronRight,
	BookCheck,
	Building2,
	Clock,
	DollarSign,
	Megaphone
} from "lucide-react";
import { cn } from "@/lib/helpers";
import { canView } from "@/data/permissions";

// IMPORTANT: Import your logo here. Adjust the path based on your folder structure.
import AshirwadLogo from "@/assets/logo-removebg.png";

export function Sidebar({ role, onClickLink }) {
	const userRole = role?.toLowerCase();
	const isFinanceExecutive = userRole === "finance_executive";
	const isEmployee = userRole === "employee";
	const isHRManager = userRole === "hr_manager";
	const showHRTabToAdminDirector = ["admin", "director"].includes(userRole);

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
					to: "/site-management",
					label: "Site Management",
					icon: HardHat,
					key: "site-management",
				},
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
				...(isFinanceExecutive
					? [
						{
							to: "/finance-dashboard",
							label: "Finance Dashboard",
							icon: BadgeIndianRupee,
							key: "finance-dashboard",
						},
						{
							to: "/finance-bookings-reminder",
							label: "Bookings Reminder",
							icon: Receipt,
							key: "finance-bookings-reminder",
						},
						{
							to: "/finance-bookings",
							label: "Bookings",
							icon: BookCheck,
							key: "finance-bookings",
						},
						{
							to: "/finance-expense-reports",
							label: "Expense Reports",
							icon: FileText,
							key: "finance-expense-reports",
						},
						{
							to: "/finance-due-installments",
							label: "WhatsApp Reminders",
							icon: Megaphone,
							key: "finance-due-installments",
						},
						{
							to: "/finance-milestones",
							label: "Milestones",
							icon: BarChart3,
							key: "finance-milestones",
						},
						{
							to: "/finance-payroll",
							label: "Payroll Approvals",
							icon: BadgeIndianRupee,
							key: "finance-payroll",
						},
						{
							to: "/finance-expenses",
							label: "Expense Approvals",
							icon: Receipt,
							key: "finance-expenses",
						},
						{
							to: "/finance-reminders",
							label: "Reminder Logs",
							icon: Clock,
							key: "finance-reminders",
						},
					]
					: [
						{
							to: "/finance",
							label: "Finance & Accounts",
							icon: BadgeIndianRupee,
							key: "finance",
						},
					]),

				...(showHRTabToAdminDirector
					? [{
						to: "/hr",
						label: "HR & Payroll",
						icon: Users2,
						key: "hr",
					}]
					: []
				),

				...(isEmployee
					? [
						{
							to: "/employee-overview",
							label: "Dashboard",
							icon: LayoutDashboard,
							key: "employee-overview",
						},
						{
							to: "/employee-attendance",
							label: "My Attendance",
							icon: Users2,
							key: "employee-attendance",
						},
						{
							to: "/employee-leaves",
							label: "My Leaves",
							icon: Users2,
							key: "employee-leaves",
						},
						{
							to: "/employee-salary",
							label: "Salary Slips",
							icon: BadgeIndianRupee,
							key: "employee-salary",
						},
						{
							to: "/employee-announcements",
							label: "Announcements",
							icon: FileText,
							key: "employee-announcements",
						},
					]
					: [
						{
							to: "/leaves",
							label: "Leaves & Attendance",
							icon: Users2,
							key: "leaves",
						},
					]),
				{
					to: "/my-expenses",
					label: "My Expenses",
					icon: Receipt,
					key: "my-expenses",
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

		...(isHRManager ? [{
			label: "HR Operations",
			items: [
				{ to: "/hr/employees", label: "Employees", icon: Users2, key: "hr" },
				{ to: "/hr/departments", label: "Departments", icon: Building2, key: "hr" },
				{ to: "/hr/salary", label: "Salary", icon: FileText, key: "hr" },
				{ to: "/hr/expense-approvals", label: "Expense Approvals", icon: Receipt, key: "hr" },
				{ to: "/hr/shifts", label: "Shifts", icon: Clock, key: "hr" },
				{ to: "/hr/labor-wages", label: "Labor Wages", icon: DollarSign, key: "hr" },
				{ to: "/hr/labors", label: "Labors", icon: HardHat, key: "hr" },
				{ to: "/hr/announcements", label: "Announcements", icon: Megaphone, key: "hr" },
			]
		}] : []),

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

	const location = useLocation();
	const [expandedMenus, setExpandedMenus] = useState(() => {
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

	const isActive = (to) =>
		location.pathname === to || location.pathname.startsWith(`${to}/`);

	return (
		<aside
			className="h-screen flex flex-col text-sidebar-foreground border-r border-sidebar-border overflow-hidden"
			style={{
				background: `
                    radial-gradient(
                        circle at 10% 10%,
                        color-mix(in oklch, var(--sidebar-primary) 18%, transparent),
                        transparent 32%
                    ),
                    radial-gradient(
                        circle at 90% 90%,
                        color-mix(in oklch, var(--sidebar-primary) 12%, transparent),
                        transparent 35%
                    ),
                    linear-gradient(
                        135deg,
                        var(--sidebar) 0%,
                        var(--sidebar-accent) 100%
                    )
                `,
			}}
		>
			{/* --- LOGO & BRANDING SECTION --- */}
			<div className="px-5 py-4 flex items-center gap-3 border-b border-sidebar-border/10 sticky top-0 z-10 backdrop-blur-md">
				<div className="bg-white p-1 rounded-md shadow-sm shrink-0 ring-1 ring-black/5">
					<img
						src={AshirwadLogo}
						alt="Ashirwad Logo"
						className="h-9 w-auto object-contain"
					/>
				</div>
				<div className="flex flex-col overflow-hidden">
					<div className="font-display text-[1rem] font-bold text-red-600/90 leading-none tracking-wider truncate drop-shadow-sm">
						ASHIRWAD
					</div>
					<div className="text-[9px] font-bold tracking-widest text-sidebar-foreground/80 mt-1 truncate">
						ENGICON GROUP
					</div>
				</div>
			</div>
			{/* ------------------------------- */}

			<nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 sidebar-scroll">
				{navGroups.map((group) => {
					const visibleItems = group.items.filter((it) => {
						if (it.children) {
							return it.children.some((child) => canView(role, child.key));
						}
						return canView(role, it.key);
					});
					if (visibleItems.length === 0) return null;

					return (
						<div key={group.label}>
							<div className="px-2 mb-1.5 text-[10.5px] uppercase tracking-[0.16em] text-sidebar-foreground/50 font-semibold">
								{group.label}
							</div>
							<ul className="space-y-0.5">
								{visibleItems.map((it) => {
									const Icon = it.icon;
									const hasChildren = it.children && it.children.length > 0;
									const isExpanded = expandedMenus[it.key];

									if (hasChildren) {
										const visibleChildren = it.children.filter((child) =>
											canView(role, child.key),
										);
										if (visibleChildren.length === 0) return null;

										return (
											<li key={it.key}>
												<button
													onClick={() => toggleMenu(it.key)}
													className="group w-full flex items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-200 text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 active:bg-sidebar-accent/60 cursor-pointer"
												>
													<div className="flex items-center gap-3">
														<Icon className="h-4 w-4 shrink-0 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors duration-200" />
														<span className="truncate">{it.label}</span>
													</div>
													<ChevronRight
														className={cn(
															"h-3.5 w-3.5 text-sidebar-foreground/50 transition-transform duration-200",
															isExpanded && "rotate-90"
														)}
													/>
												</button>
												{isExpanded && (
													<ul className="ml-6 mt-0.5 space-y-0.5 pl-2 border-l border-sidebar-border/40">
														{visibleChildren.map((child) => {
															const ChildIcon = child.icon || (() => null);
															const active = isActive(child.to);
															return (
																<li key={child.to}>
																	<NavLink
																		to={child.to}
																		onClick={onClickLink}
																		className={cn(
																			// Base styles
																			"group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-300 ease-out",

																			// Background, translation, and text colors
																			active
																				? "bg-sidebar-primary/15 text-sidebar-foreground shadow-sm backdrop-blur-md ring-1 ring-inset ring-sidebar-primary/20 translate-x-[2px]"
																				: "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 hover:translate-x-[2px]",

																			// The animated right-border indicator (Grows from the center smoothly without layout shift)
																			"after:absolute after:right-0 after:top-1/2 after:w-[3px] after:-translate-y-1/2 after:rounded-l-full after:bg-sidebar-primary after:transition-all after:duration-300 after:ease-out",
																			active
																				? "after:h-[65%] after:opacity-100"
																				: "after:h-0 after:opacity-0"
																		)}
																	>
																		{ChildIcon && (
																			<ChildIcon className={cn(
																				"h-3.5 w-3.5 shrink-0 transition-colors duration-200",
																				active ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
																			)} />
																		)}
																		<span className="truncate">{child.label}</span>
																	</NavLink>
																</li>
															);
														})}
													</ul>
												)}
											</li>
										);
									}

									const active = isActive(it.to);
									return (
										<li key={it.to}>
											<NavLink
												to={it.to}
												onClick={onClickLink}
												className={cn(
													// Base styles
													"group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-300 ease-out",

													// Background, translation, and text colors
													active
														? "bg-sidebar-primary/15 text-sidebar-foreground shadow-sm backdrop-blur-md ring-1 ring-inset ring-sidebar-primary/20 translate-x-[2px]"
														: "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 hover:translate-x-[2px]",

													// The animated right-border indicator (Grows from the center smoothly without layout shift)
													"after:absolute after:right-0 after:top-1/2 after:w-[3px] after:-translate-y-1/2 after:rounded-l-full after:bg-sidebar-primary after:transition-all after:duration-300 after:ease-out",
													active
														? "after:h-[65%] after:opacity-100"
														: "after:h-0 after:opacity-0"
												)}
											>
												<Icon
													className={cn(
														"h-4 w-4 shrink-0 transition-colors duration-200",
														active ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground",
													)}
												/>
												<span className="truncate">{it.label}</span>
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