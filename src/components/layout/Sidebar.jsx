


// import React, { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
// 	LayoutDashboard,
// 	Users2,
// 	FolderKanban,
// 	HardHat,
// 	Boxes,
// 	Receipt,
// 	BadgeIndianRupee,
// 	HeartHandshake,
// 	FileText,
// 	BarChart3,
// 	Settings,
// 	ChevronDown,
// 	ChevronRight,
// 	BookCheck,
// } from "lucide-react";
// import { cn } from "@/lib/helpers";
// import { canView } from "@/data/permissions";

// // IMPORTANT: Import your logo here. Adjust the path based on your folder structure.
// import AshirwadLogo from "@/assets/logo.jpg";

// export function Sidebar({ role, onClickLink }) {
// 	const isFinanceExecutive =
// 		role?.toLowerCase() === "finance_executive";
// 	const isEmployee = role?.toLowerCase() === "employee";

// 	const navGroups = [
// 		{
// 			label: "Overview",
// 			items: [
// 				{
// 					to: "/dashboard",
// 					label: "Dashboard",
// 					icon: LayoutDashboard,
// 					key: "dashboard",
// 				},
// 			],
// 		},
// 		{
// 			label: "Operations",
// 			items: [
// 				{
// 					to: "/projects",
// 					label: "Projects",
// 					icon: FolderKanban,
// 					key: "projects",
// 				},
// 				{
// 					to: "/site-management",
// 					label: "Site Management",
// 					icon: HardHat,
// 					key: "site-management",
// 				},
// 				{
// 					label: "Booking",
// 					icon: BookCheck,
// 					key: "booking",
// 					children: [
// 						{ to: "/bookings", label: "Bookings", key: "bookings" },
// 						{ to: "/my-bookings", label: "My Bookings", key: "my-bookings" },
// 						{
// 							to: "/my-installments",
// 							label: "My Installments",
// 							key: "my-installments",
// 						},
// 						{
// 							to: "/pending-bookings",
// 							label: "Pending Bookings",
// 							key: "pending-bookings",
// 						},
// 					],
// 				},
// 			],
// 		},
// 		{
// 			label: "Business",
// 			items: [
// 				{
// 					to: "/property-inventory",
// 					label: "Property Inventory",
// 					icon: Boxes,
// 					key: "property-inventory",
// 				},
// 				...(isFinanceExecutive
// 					? [{
// 						label: "Finance & Accounts",
// 						icon: BadgeIndianRupee,
// 						key: "finance",
// 						children: [
// 							{
// 								to: "/finance/dashboard",
// 								label: "Dashboard",
// 								key: "finance",
// 							},
// 							{
// 								to: "/finance/bookings-reminder",
// 								label: "Bookings Reminder",
// 								key: "finance",
// 							},
// 							{
// 								to: "/finance/bookings",
// 								label: "Bookings",
// 								key: "finance",
// 							},
// 							{
// 								to: "/finance/due-installments",
// 								label: "WhatsApp Reminders",
// 								key: "finance",
// 							},
// 							{
// 								to: "/finance/milestones",
// 								label: "Milestones",
// 								key: "finance",
// 							},
// 							{
// 								to: "/finance/payroll",
// 								label: "Payroll Approvals",
// 								key: "finance",
// 							},
// 							{
// 								to: "/finance/expenses",
// 								label: "Expense Approvals",
// 								key: "finance",
// 							},
// 							{
// 								to: "/finance/reminders",
// 								label: "Reminder Logs",
// 								key: "finance",
// 							},
// 						],
// 					}]
// 					: [{
// 						to: "/finance",
// 						label: "Finance & Accounts",
// 						icon: BadgeIndianRupee,
// 						key: "finance",
// 					}]),
// 				// 👇 CHANGED: Direct link to HR
// 				{
// 					to: "/hr",
// 					label: "HR & Payroll",
// 					icon: Users2,
// 					key: "hr",
// 				},
// 				// 👇 CHANGED: Moved My Expenses here, as a direct self-service link
// 				{
// 					to: "/my-expenses",
// 					label: "My Expenses",
// 					icon: Receipt,
// 					key: "my-expenses",
// 				},
// 				...(isEmployee
// 					? [
// 						{
// 							to: "/employee-attendance",
// 							label: "My Attendance",
// 							icon: Users2,
// 							key: "leaves",
// 						},
// 						{
// 							to: "/employee-leaves",
// 							label: "My Leaves",
// 							icon: Users2,
// 							key: "leaves",
// 						},
// 						{
// 							to: "/employee-salary",
// 							label: "Salary Slips",
// 							icon: BadgeIndianRupee,
// 							key: "leaves",
// 						},
// 						{
// 							to: "/employee-announcements",
// 							label: "Announcements",
// 							icon: FileText,
// 							key: "leaves",
// 						},
// 					]
// 					: [
// 						{
// 							to: "/leaves",
// 							label: "Leaves & Attendance",
// 							icon: Users2,
// 							key: "leaves",
// 						},
// 					]),
// 				{
// 					to: "/crm",
// 					label: "CRM & Buyers",
// 					icon: HeartHandshake,
// 					key: "crm",
// 				},
// 				{
// 					to: "/documents",
// 					label: "Documents",
// 					icon: FileText,
// 					key: "documents",
// 				},
// 			],
// 		},
// 		{
// 			label: "Insights",
// 			items: [
// 				{ to: "/reports", label: "Reports", icon: BarChart3, key: "reports" },
// 			],
// 		},
// 		{
// 			label: "Administration",
// 			items: [
// 				{
// 					to: "/users",
// 					label: "User & Roles",
// 					icon: Users2,
// 					key: "users",
// 				},
// 				{ to: "/settings", label: "Settings", icon: Settings, key: "settings" },
// 			],
// 		},
// 	];

// 	const location = useLocation();
// 	const [expandedMenus, setExpandedMenus] = useState(() => {
// 		// Auto‑expand the menu that contains the current route
// 		const open = {};
// 		for (const group of navGroups) {
// 			for (const item of group.items) {
// 				if (item.children) {
// 					const hasActiveChild = item.children.some((child) =>
// 						location.pathname.startsWith(child.to),
// 					);
// 					if (hasActiveChild) open[item.key] = true;
// 				}
// 			}
// 		}
// 		return open;
// 	});

// 	const toggleMenu = (key) => {
// 		setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
// 	};

// 	// Helper to check if a route is active
// 	const isActive = (to) =>
// 		location.pathname === to || location.pathname.startsWith(`${to}/`);

// 	return (
// 		<aside className="h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
// 			{/* --- LOGO & BRANDING SECTION --- */}
// 			<div className="px-5 py-4 flex items-center gap-3 border-b border-sidebar-border">
// 				{/* New Logo Implementation */}
// 				<div className="bg-white p-1 rounded-md shadow-sm shrink-0">
// 					<img
// 						src={AshirwadLogo}
// 						alt="Ashirwad Logo"
// 						className="h-8 w-auto object-contain"
// 					/>
// 				</div>

// 				<div className="leading-tight overflow-hidden">
// 					<div className="font-display text-[1.05rem] font-semibold tracking-tight truncate text-sidebar-foreground">
// 						Ashirwaad
// 					</div>
// 					<div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60 truncate">
// 						Construction OS
// 					</div>
// 				</div>
// 			</div>
// 			{/* ------------------------------- */}

// 			<nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 sidebar-scroll">
// 				{navGroups.map((group) => {
// 					// Filter items based on permissions
// 					const visibleItems = group.items.filter((it) => {
// 						if (it.children) {
// 							// Parent is visible if at least one child is visible
// 							return it.children.some((child) => canView(role, child.key));
// 						}
// 						return canView(role, it.key);
// 					});
// 					if (visibleItems.length === 0) return null;

// 					return (
// 						<div key={group.label}>
// 							<div className="px-2 mb-1.5 text-[10.5px] uppercase tracking-[0.16em] text-sidebar-foreground/40 font-medium">
// 								{group.label}
// 							</div>
// 							<ul className="space-y-0.5">
// 								{visibleItems.map((it) => {
// 									const Icon = it.icon;
// 									const hasChildren = it.children && it.children.length > 0;
// 									const isExpanded = expandedMenus[it.key];

// 									// If it has children, render a collapsible parent
// 									if (hasChildren) {
// 										// Filter children by permission
// 										const visibleChildren = it.children.filter((child) =>
// 											canView(role, child.key),
// 										);
// 										if (visibleChildren.length === 0) return null;

// 										return (
// 											<li key={it.key}>
// 												<button
// 													onClick={() => toggleMenu(it.key)}
// 													className="w-full flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-all duration-150 text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
// 												>
// 													<div className="flex items-center gap-3">
// 														<Icon className="h-4 w-4 shrink-0" />
// 														<span className="truncate">{it.label}</span>
// 													</div>
// 													{isExpanded ? (
// 														<ChevronDown className="h-3.5 w-3.5" />
// 													) : (
// 														<ChevronRight className="h-3.5 w-3.5" />
// 													)}
// 												</button>
// 												{isExpanded && (
// 													<ul className="ml-6 mt-0.5 space-y-0.5 pl-2 border-l border-sidebar-border">
// 														{visibleChildren.map((child) => {
// 															const ChildIcon = child.icon || (() => null); // Use parent icon or null
// 															const active = isActive(child.to);
// 															return (
// 																<li key={child.to}>
// 																	<NavLink
// 																		to={child.to}
// 																		onClick={onClickLink}
// 																		className={cn(
// 																			"flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all duration-150",
// 																			active
// 																				? "bg-sidebar-accent text-sidebar-accent-foreground"
// 																				: "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
// 																		)}
// 																	>
// 																		{ChildIcon && (
// 																			<ChildIcon className="h-3.5 w-3.5 shrink-0" />
// 																		)}
// 																		<span className="truncate">
// 																			{child.label}
// 																		</span>
// 																		{active && (
// 																			<span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
// 																		)}
// 																	</NavLink>
// 																</li>
// 															);
// 														})}
// 													</ul>
// 												)}
// 											</li>
// 										);
// 									}

// 									// Regular leaf item
// 									const active = isActive(it.to);
// 									return (
// 										<li key={it.to}>
// 											<NavLink
// 												to={it.to}
// 												onClick={onClickLink}
// 												className={cn(
// 													"flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all duration-150",
// 													active
// 														? "bg-sidebar-accent text-sidebar-accent-foreground"
// 														: "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
// 												)}
// 											>
// 												<Icon
// 													className={cn(
// 														"h-4 w-4 shrink-0",
// 														active && "text-sidebar-primary",
// 													)}
// 												/>
// 												<span className="truncate">{it.label}</span>
// 												{active && (
// 													<span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
// 												)}
// 											</NavLink>
// 										</li>
// 									);
// 								})}
// 							</ul>
// 						</div>
// 					);
// 				})}
// 			</nav>
// 		</aside>
// 	);
// }



















// import React, { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//     LayoutDashboard,
//     Users2,
//     FolderKanban,
//     HardHat,
//     Boxes,
//     Receipt,
//     BadgeIndianRupee,
//     HeartHandshake,
//     FileText,
//     BarChart3,
//     Settings,
//     ChevronDown,
//     ChevronRight,
//     BookCheck,
// } from "lucide-react";
// import { cn } from "@/lib/helpers";
// import { canView } from "@/data/permissions";

// // IMPORTANT: Import your logo here. Adjust the path based on your folder structure.
// import AshirwadLogo from "@/assets/logo.jpg";

// export function Sidebar({ role, onClickLink }) {
//     // 👇 ADDED: Role-based variables for cleaner logic
//     const userRole = role?.toLowerCase();
//     const isFinanceExecutive = userRole === "finance_executive";
//     const isEmployee = userRole === "employee";
    
//     // 👇 ADDED: Variables for HR conditionally rendering
//     const isHRManager = userRole === "hr_manager";
//     const showHRTabToAdminDirector = ["admin", "director"].includes(userRole);

//     const navGroups = [
//         {
//             label: "Overview",
//             items: [
//                 {
//                     to: "/dashboard",
//                     label: "Dashboard",
//                     icon: LayoutDashboard,
//                     key: "dashboard",
//                 },
//             ],
//         },
//         {
//             label: "Operations",
//             items: [
//                 {
//                     to: "/projects",
//                     label: "Projects",
//                     icon: FolderKanban,
//                     key: "projects",
//                 },
//                 {
//                     to: "/site-management",
//                     label: "Site Management",
//                     icon: HardHat,
//                     key: "site-management",
//                 },
//                 {
//                     label: "Booking",
//                     icon: BookCheck,
//                     key: "booking",
//                     children: [
//                         { to: "/bookings", label: "Bookings", key: "bookings" },
//                         { to: "/my-bookings", label: "My Bookings", key: "my-bookings" },
//                         {
//                             to: "/my-installments",
//                             label: "My Installments",
//                             key: "my-installments",
//                         },
//                         {
//                             to: "/pending-bookings",
//                             label: "Pending Bookings",
//                             key: "pending-bookings",
//                         },
//                     ],
//                 },
//             ],
//         },
//         {
//             label: "Business",
//             items: [
//                 {
//                     to: "/property-inventory",
//                     label: "Property Inventory",
//                     icon: Boxes,
//                     key: "property-inventory",
//                 },
//                 ...(isFinanceExecutive
//                     ? [{
//                         label: "Finance & Accounts",
//                         icon: BadgeIndianRupee,
//                         key: "finance",
//                         children: [
//                             {
//                                 to: "/finance/dashboard",
//                                 label: "Dashboard",
//                                 key: "finance",
//                             },
//                             {
//                                 to: "/finance/bookings-reminder",
//                                 label: "Bookings Reminder",
//                                 key: "finance",
//                             },
//                             {
//                                 to: "/finance/bookings",
//                                 label: "Bookings",
//                                 key: "finance",
//                             },
//                             {
//                                 to: "/finance/due-installments",
//                                 label: "WhatsApp Reminders",
//                                 key: "finance",
//                             },
//                             {
//                                 to: "/finance/milestones",
//                                 label: "Milestones",
//                                 key: "finance",
//                             },
//                             {
//                                 to: "/finance/payroll",
//                                 label: "Payroll Approvals",
//                                 key: "finance",
//                             },
//                             {
//                                 to: "/finance/expenses",
//                                 label: "Expense Approvals",
//                                 key: "finance",
//                             },
//                             {
//                                 to: "/finance/reminders",
//                                 label: "Reminder Logs",
//                                 key: "finance",
//                             },
//                         ],
//                     }]
//                     : [{
//                         to: "/finance",
//                         label: "Finance & Accounts",
//                         icon: BadgeIndianRupee,
//                         key: "finance",
//                     }]),
                
//                 // 👇 CHANGED: Conditionally render HR Dropdown for HR Manager
//                 ...(isHRManager
//                     ? [{
//                         label: "HR & Payroll",
//                         icon: Users2,
//                         key: "hr",
//                         children: [
//                             { to: "/hr/employees", label: "Employees", key: "hr" },
//                             { to: "/hr/departments", label: "Departments", key: "hr" },
//                             { to: "/hr/salary", label: "Salary", key: "hr" },
//                             { to: "/hr/expense-approvals", label: "Expense Approvals", key: "hr" },
//                             { to: "/hr/shifts", label: "Shifts", key: "hr" },
//                             { to: "/hr/labor-wages", label: "Labor Wages", key: "hr" },
//                             { to: "/hr/labors", label: "Labors", key: "hr" },
//                             { to: "/hr/announcements", label: "Announcements", key: "hr" },
//                         ]
//                     }]
//                     : []
//                 ),

//                 // 👇 CHANGED: Render single link for Admin & Director
//                 ...(showHRTabToAdminDirector
//                     ? [{
//                         to: "/hr/employees",
//                         label: "HR & Payroll",
//                         icon: Users2,
//                         key: "hr",
//                     }]
//                     : []
//                 ),

//                 // 👇 CHANGED: Moved My Expenses here, as a direct self-service link
//                 {
//                     to: "/my-expenses",
//                     label: "My Expenses",
//                     icon: Receipt,
//                     key: "my-expenses",
//                 },
//                 ...(isEmployee
//                     ? [
//                         {
//                             to: "/employee-attendance",
//                             label: "My Attendance",
//                             icon: Users2,
//                             key: "leaves",
//                         },
//                         {
//                             to: "/employee-leaves",
//                             label: "My Leaves",
//                             icon: Users2,
//                             key: "leaves",
//                         },
//                         {
//                             to: "/employee-salary",
//                             label: "Salary Slips",
//                             icon: BadgeIndianRupee,
//                             key: "leaves",
//                         },
//                         {
//                             to: "/employee-announcements",
//                             label: "Announcements",
//                             icon: FileText,
//                             key: "leaves",
//                         },
//                     ]
//                     : [
//                         {
//                             to: "/leaves",
//                             label: "Leaves & Attendance",
//                             icon: Users2,
//                             key: "leaves",
//                         },
//                     ]),
//                 {
//                     to: "/crm",
//                     label: "CRM & Buyers",
//                     icon: HeartHandshake,
//                     key: "crm",
//                 },
//                 {
//                     to: "/documents",
//                     label: "Documents",
//                     icon: FileText,
//                     key: "documents",
//                 },
//             ],
//         },
//         {
//             label: "Insights",
//             items: [
//                 { to: "/reports", label: "Reports", icon: BarChart3, key: "reports" },
//             ],
//         },
//         {
//             label: "Administration",
//             items: [
//                 {
//                     to: "/users",
//                     label: "User & Roles",
//                     icon: Users2,
//                     key: "users",
//                 },
//                 { to: "/settings", label: "Settings", icon: Settings, key: "settings" },
//             ],
//         },
//     ];

//     const location = useLocation();
//     const [expandedMenus, setExpandedMenus] = useState(() => {
//         // Auto‑expand the menu that contains the current route
//         const open = {};
//         for (const group of navGroups) {
//             for (const item of group.items) {
//                 if (item.children) {
//                     const hasActiveChild = item.children.some((child) =>
//                         location.pathname.startsWith(child.to),
//                     );
//                     if (hasActiveChild) open[item.key] = true;
//                 }
//             }
//         }
//         return open;
//     });

//     const toggleMenu = (key) => {
//         setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
//     };

//     // Helper to check if a route is active
//     const isActive = (to) =>
//         location.pathname === to || location.pathname.startsWith(`${to}/`);

//     return (
//         <aside className="h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
//             {/* --- LOGO & BRANDING SECTION --- */}
//             <div className="px-5 py-4 flex items-center gap-3 border-b border-sidebar-border">
//                 {/* New Logo Implementation */}
//                 <div className="bg-white p-1 rounded-md shadow-sm shrink-0">
//                     <img
//                         src={AshirwadLogo}
//                         alt="Ashirwad Logo"
//                         className="h-8 w-auto object-contain"
//                     />
//                 </div>

//                 <div className="leading-tight overflow-hidden">
//                     <div className="font-display text-[1.05rem] font-semibold tracking-tight truncate text-sidebar-foreground">
//                         Ashirwaad
//                     </div>
//                     <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60 truncate">
//                         Construction OS
//                     </div>
//                 </div>
//             </div>
//             {/* ------------------------------- */}

//             <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 sidebar-scroll">
//                 {navGroups.map((group) => {
//                     // Filter items based on permissions
//                     const visibleItems = group.items.filter((it) => {
//                         if (it.children) {
//                             // Parent is visible if at least one child is visible
//                             return it.children.some((child) => canView(role, child.key));
//                         }
//                         return canView(role, it.key);
//                     });
//                     if (visibleItems.length === 0) return null;

//                     return (
//                         <div key={group.label}>
//                             <div className="px-2 mb-1.5 text-[10.5px] uppercase tracking-[0.16em] text-sidebar-foreground/40 font-medium">
//                                 {group.label}
//                             </div>
//                             <ul className="space-y-0.5">
//                                 {visibleItems.map((it) => {
//                                     const Icon = it.icon;
//                                     const hasChildren = it.children && it.children.length > 0;
//                                     const isExpanded = expandedMenus[it.key];

//                                     // If it has children, render a collapsible parent
//                                     if (hasChildren) {
//                                         // Filter children by permission
//                                         const visibleChildren = it.children.filter((child) =>
//                                             canView(role, child.key),
//                                         );
//                                         if (visibleChildren.length === 0) return null;

//                                         return (
//                                             <li key={it.key}>
//                                                 <button
//                                                     onClick={() => toggleMenu(it.key)}
//                                                     className="w-full flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-all duration-150 text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
//                                                 >
//                                                     <div className="flex items-center gap-3">
//                                                         <Icon className="h-4 w-4 shrink-0" />
//                                                         <span className="truncate">{it.label}</span>
//                                                     </div>
//                                                     {isExpanded ? (
//                                                         <ChevronDown className="h-3.5 w-3.5" />
//                                                     ) : (
//                                                         <ChevronRight className="h-3.5 w-3.5" />
//                                                     )}
//                                                 </button>
//                                                 {isExpanded && (
//                                                     <ul className="ml-6 mt-0.5 space-y-0.5 pl-2 border-l border-sidebar-border">
//                                                         {visibleChildren.map((child) => {
//                                                             const ChildIcon = child.icon || (() => null); // Use parent icon or null
//                                                             const active = isActive(child.to);
//                                                             return (
//                                                                 <li key={child.to}>
//                                                                     <NavLink
//                                                                         to={child.to}
//                                                                         onClick={onClickLink}
//                                                                         className={cn(
//                                                                             "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all duration-150",
//                                                                             active
//                                                                                 ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                                                                                 : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
//                                                                         )}
//                                                                     >
//                                                                         {ChildIcon && (
//                                                                             <ChildIcon className="h-3.5 w-3.5 shrink-0" />
//                                                                         )}
//                                                                         <span className="truncate">
//                                                                             {child.label}
//                                                                         </span>
//                                                                         {active && (
//                                                                             <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
//                                                                         )}
//                                                                     </NavLink>
//                                                                 </li>
//                                                             );
//                                                         })}
//                                                     </ul>
//                                                 )}
//                                             </li>
//                                         );
//                                     }

//                                     // Regular leaf item
//                                     const active = isActive(it.to);
//                                     return (
//                                         <li key={it.to}>
//                                             <NavLink
//                                                 to={it.to}
//                                                 onClick={onClickLink}
//                                                 className={cn(
//                                                     "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all duration-150",
//                                                     active
//                                                         ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                                                         : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60",
//                                                 )}
//                                             >
//                                                 <Icon
//                                                     className={cn(
//                                                         "h-4 w-4 shrink-0",
//                                                         active && "text-sidebar-primary",
//                                                     )}
//                                                 />
//                                                 <span className="truncate">{it.label}</span>
//                                                 {active && (
//                                                     <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
//                                                 )}
//                                             </NavLink>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         </div>
//                     );
//                 })}
//             </nav>
//         </aside>
//     );
// }












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
import AshirwadLogo from "@/assets/logo.jpg";

export function Sidebar({ role, onClickLink }) {
    // 👇 ADDED: Role-based variables for cleaner logic
    const userRole = role?.toLowerCase();
    const isFinanceExecutive = userRole === "finance_executive";
    const isEmployee = userRole === "employee";
    
    // 👇 ADDED: Variables for HR conditionally rendering
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
                    ? [{
                        label: "Finance & Accounts",
                        icon: BadgeIndianRupee,
                        key: "finance",
                        children: [
                            {
                                to: "/finance/dashboard",
                                label: "Dashboard",
                                key: "finance",
                            },
                            {
                                to: "/finance/bookings-reminder",
                                label: "Bookings Reminder",
                                key: "finance",
                            },
                            {
                                to: "/finance/bookings",
                                label: "Bookings",
                                key: "finance",
                            },
                            {
                                to: "/finance/due-installments",
                                label: "WhatsApp Reminders",
                                key: "finance",
                            },
                            {
                                to: "/finance/milestones",
                                label: "Milestones",
                                key: "finance",
                            },
                            {
                                to: "/finance/payroll",
                                label: "Payroll Approvals",
                                key: "finance",
                            },
                            {
                                to: "/finance/expenses",
                                label: "Expense Approvals",
                                key: "finance",
                            },
                            {
                                to: "/finance/reminders",
                                label: "Reminder Logs",
                                key: "finance",
                            },
                        ],
                    }]
                    : [{
                        to: "/finance",
                        label: "Finance & Accounts",
                        icon: BadgeIndianRupee,
                        key: "finance",
                    }]),

                // 👇 CHANGED: Render single link for Admin & Director
                ...(showHRTabToAdminDirector
                    ? [{
                        to: "/hr/employees",
                        label: "HR & Payroll",
                        icon: Users2,
                        key: "hr",
                    }]
                    : []
                ),

                // 👇 CHANGED: Moved My Expenses here, as a direct self-service link
                {
                    to: "/my-expenses",
                    label: "My Expenses",
                    icon: Receipt,
                    key: "my-expenses",
                },
                ...(isEmployee
                    ? [
                        {
                            to: "/employee-attendance",
                            label: "My Attendance",
                            icon: Users2,
                            key: "leaves",
                        },
                        {
                            to: "/employee-leaves",
                            label: "My Leaves",
                            icon: Users2,
                            key: "leaves",
                        },
                        {
                            to: "/employee-salary",
                            label: "Salary Slips",
                            icon: BadgeIndianRupee,
                            key: "leaves",
                        },
                        {
                            to: "/employee-announcements",
                            label: "Announcements",
                            icon: FileText,
                            key: "leaves",
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

        // 👇 NEW: HR Manager ke liye standalone group banaya hai (Submenu hata kar)
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

    // Helper to check if a route is active
    const isActive = (to) =>
        location.pathname === to || location.pathname.startsWith(`${to}/`);

    return (
        <aside className="h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            {/* --- LOGO & BRANDING SECTION --- */}
            <div className="px-5 py-4 flex items-center gap-3 border-b border-sidebar-border">
                {/* New Logo Implementation */}
                <div className="bg-white p-1 rounded-md shadow-sm shrink-0">
                    <img
                        src={AshirwadLogo}
                        alt="Ashirwad Logo"
                        className="h-8 w-auto object-contain"
                    />
                </div>

                <div className="leading-tight overflow-hidden">
                    <div className="font-display text-[1.05rem] font-semibold tracking-tight truncate text-sidebar-foreground">
                        Ashirwaad
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60 truncate">
                        Construction OS
                    </div>
                </div>
            </div>
            {/* ------------------------------- */}

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