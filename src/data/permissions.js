
// export const ROLES = {
//     admin: "Admin",
//     director: "Director",
//     project_manager: "Project Manager",
//     site_engineer: "Site Engineer",
//     accountant: "Accountant",
//     hr_manager: "HR Manager",
//     vendor: "Vendor",
//     client: "Client",
//     employee: "Employee", // Added explicitly for clarity
// };

// // per-resource: who can VIEW the page
// export const VIEW = {
//     dashboard: ["admin", "director", "project_manager", "site_engineer", "accountant", "hr_manager", "vendor", "client", "employee"],
//     users: ["admin"],
//     projects: ["admin", "director", "project_manager", "site_engineer", "accountant"],
//     "project-templates": ["admin", "director", "project_manager", "site_engineer", "accountant"],
//     "property-inventory": ["admin", "director", "project_manager", "accountant"],
//     "site-management": ["admin", "director", "project_manager", "site_engineer"],
//     tasks: ["admin", "director", "project_manager", "site_engineer"],
//     procurement: ["admin", "director", "project_manager", "accountant"],
//     'procurement-overview': ["admin", "director", "project_manager", "accountant"],
//     'procurement-rfqs': ["admin", "director", "project_manager", "accountant"],
//     'procurement-quotations': ["admin", "director", "project_manager", "accountant"],
//     'procurement-pos': ["admin", "director", "project_manager", "accountant"],
//     'procurement-deliveries': ["admin", "director", "project_manager", "accountant"],
//     vendor: ["admin", "vendor"],
//     inventory: ["admin", "director", "project_manager", "site_engineer"],
//     "inventory-stock-management": ["admin", "director", "project_manager", "site_engineer"],
//     "inventory-materials": ["admin", "director", "project_manager", "site_engineer"],
//     "inventory-warehouses": ["admin", "director", "project_manager", "site_engineer"],
//     "inventory-transactions": ["admin", "director", "project_manager", "site_engineer"],
//     "inventory-alerts": ["admin", "director", "project_manager", "site_engineer"],
//     "inventory-valuation": ["admin", "director", "project_manager", "site_engineer"],
//     "inventory-counts": ["admin", "director", "project_manager", "site_engineer"],
//     bookings: ["admin", "director", "project_manager", "employee"],
//     "my-bookings": ["client"],
//     "my-installments": ["client"],
//     "pending-bookings": ["admin", "director", "project_manager"],
//     finance: ["admin", "director", "accountant"],
//     hr: ["admin", "director", "hr_manager"],
    
//     // --- NEW EXPENSE SYSTEM VIEW PERMISSIONS ---
//     "hr-module": ["admin", "director", "hr_manager", "accountant"], // Parent sidebar menu
//     "my-expenses": ["admin", "director", "project_manager", "site_engineer", "accountant", "hr_manager", "employee"], // Everyone except external clients/vendors
//     "expense-approvals": ["admin", "director", "hr_manager", "accountant"], // Only Management & Finance
    
//     leaves: ["admin", "director", "project_manager", "site_engineer", "accountant", "hr_manager", "employee"],
//     crm: ["admin", "director", "project_manager", "hr_manager", "employee"],
//     documents: ["admin", "director", "project_manager", "site_engineer", "accountant", "vendor"],
//     reports: ["admin", "director"],
//     settings: ["admin", "director", "project_manager", "site_engineer", "accountant", "hr_manager", "vendor", "client", "employee"],
// };

// // who can mutate (create / edit / delete) records on a resource
// export const MUTATE = {
//     users: ["admin"],
//     projects: ["admin", "director", "project_manager"],
//     "project-operations": ["admin", "director", "project_manager", "site_engineer"],
//     "tower-operations": ["admin", "director", "project_manager", "hr_manager"],
//     "project-template": ["admin", "director", "project_manager"],
//     tasks: ["admin", "director", "project_manager"],
//     "task-operations": ["admin", "director", "project_manager", "site_engineer"],
//     "site-management": ["admin", "director", "project_manager"],
//     "site-operations": ["admin", "director", "project_manager", "site_engineer"],
//     procurement: ["admin", "director", "project_manager", "accountant"],
//     'procurement-operations': ["admin", "director", "project_manager", "site_engineer", "accountant"],
//     vendor: ["admin", "director", "project_manager", "vendor"],
//     inventory: ["admin", "director", "project_manager"],
//     "inventory-operations": ["admin", "director", "project_manager", "site_engineer"], 
//     booking: ['admin', 'director', 'project_manager', 'accountant'],
//     booking_payment: ['admin', 'director', 'project_manager', 'accountant'],
//     finance: ["admin", "accountant"],
//     hr: ["admin", "hr_manager"],
    
//     // --- NEW EXPENSE SYSTEM MUTATE PERMISSIONS ---
//     "my-expenses": ["admin", "director", "project_manager", "site_engineer", "accountant", "hr_manager", "employee"], // Ability to raise ticket
//     "expense-approvals": ["admin", "director", "hr_manager", "accountant"], // Ability to Approve/Reject
//     "expense-payment": ["admin", "accountant"], // STRICT: Only finance can process final payment
    
//     crm: ["admin", "director", "hr_manager"],
//     documents: ["admin", "project_manager", "site_engineer", "accountant"],
// };

// export function canView(role, resource) {
//     if (!role || !resource) return false;
//     const lowerCaseRole = role.toLowerCase();
//     return Boolean(VIEW[resource]?.includes(lowerCaseRole));
// }

// export function canMutate(role, resource) {
//     if (!role || !resource) return false;
//     const lowerCaseRole = role.toLowerCase();
//     return Boolean(MUTATE[resource]?.includes(lowerCaseRole));
// }




export const ROLES = {
    admin: "Admin",
    director: "Director",
    project_manager: "Project Manager",
    site_engineer: "Site Engineer",
    accountant: "Accountant",
    finance_executive: "Finance Executive", // Added new role
    hr_manager: "HR Manager",
    vendor: "Vendor",
    client: "Client",
    employee: "Employee", // Added explicitly for clarity
};

// per-resource: who can VIEW the page
export const VIEW = {
    dashboard: ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive", "hr_manager", "vendor", "client", "employee"],
    users: ["admin"],
    projects: ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive"],
    "project-templates": ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive"],
    "property-inventory": ["admin", "director", "project_manager", "accountant", "finance_executive"],
    "site-management": ["admin", "director", "project_manager", "site_engineer"],
    tasks: ["admin", "director", "project_manager", "site_engineer"],
    procurement: ["admin", "director", "project_manager", "accountant", "finance_executive"],
    'procurement-overview': ["admin", "director", "project_manager", "accountant", "finance_executive"],
    'procurement-rfqs': ["admin", "director", "project_manager", "accountant", "finance_executive"],
    'procurement-quotations': ["admin", "director", "project_manager", "accountant", "finance_executive"],
    'procurement-pos': ["admin", "director", "project_manager", "accountant", "finance_executive"],
    'procurement-deliveries': ["admin", "director", "project_manager", "accountant", "finance_executive"],
    vendor: ["admin", "vendor"],
    inventory: ["admin", "director", "project_manager", "site_engineer"],
    "inventory-stock-management": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-materials": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-warehouses": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-transactions": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-alerts": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-valuation": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-counts": ["admin", "director", "project_manager", "site_engineer"],
    bookings: ["admin", "director", "project_manager", "employee"],
    "my-bookings": ["client"],
    "my-installments": ["client"],
    "pending-bookings": ["admin", "director", "project_manager"],
    finance: ["admin", "director", "accountant", "finance_executive"],
    hr: ["admin", "director", "hr_manager"],
    
    // --- NEW EXPENSE SYSTEM VIEW PERMISSIONS ---
    "hr-module": ["admin", "director", "hr_manager", "accountant", "finance_executive"], // Parent sidebar menu
    "my-expenses": ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive", "hr_manager", "employee"], // Everyone except external clients/vendors
    "expense-approvals": ["admin", "director", "hr_manager", "accountant", "finance_executive"], // Only Management & Finance
    
    leaves: ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive", "hr_manager", "employee"],
    crm: ["admin", "director", "project_manager", "hr_manager", "employee"],
    documents: ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive", "vendor"],
    reports: ["admin", "director"],
    settings: ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive", "hr_manager", "vendor", "client", "employee"],
};

// who can mutate (create / edit / delete) records on a resource
export const MUTATE = {
    users: ["admin"],
    projects: ["admin", "director", "project_manager"],
    "project-operations": ["admin", "director", "project_manager", "site_engineer"],
    "tower-operations": ["admin", "director", "project_manager", "hr_manager"],
    "project-template": ["admin", "director", "project_manager"],
    tasks: ["admin", "director", "project_manager"],
    "task-operations": ["admin", "director", "project_manager", "site_engineer"],
    "site-management": ["admin", "director", "project_manager"],
    "site-operations": ["admin", "director", "project_manager", "site_engineer"],
    procurement: ["admin", "director", "project_manager", "accountant", "finance_executive"],
    'procurement-operations': ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive"],
    vendor: ["admin", "director", "project_manager", "vendor"],
    inventory: ["admin", "director", "project_manager"],
    "inventory-operations": ["admin", "director", "project_manager", "site_engineer"], 
    booking: ['admin', 'director', 'project_manager', 'accountant', "finance_executive"],
    booking_payment: ['admin', 'director', 'project_manager', 'accountant', "finance_executive"],
    finance: ["admin", "accountant", "finance_executive"],
    hr: ["admin", "hr_manager"],
    
    // --- NEW EXPENSE SYSTEM MUTATE PERMISSIONS ---
    "my-expenses": ["admin", "director", "project_manager", "site_engineer", "accountant", "finance_executive", "hr_manager", "employee"], // Ability to raise ticket
    "expense-approvals": ["admin", "director", "hr_manager", "accountant", "finance_executive"], // Ability to Approve/Reject
    "expense-payment": ["admin", "accountant", "finance_executive"], // STRICT: Only finance can process final payment
    
    crm: ["admin", "director", "hr_manager"],
    documents: ["admin", "project_manager", "site_engineer", "accountant", "finance_executive"],
};

export function canView(role, resource) {
    if (!role || !resource) return false;
    const lowerCaseRole = role.toLowerCase();
    return Boolean(VIEW[resource]?.includes(lowerCaseRole));
}

export function canMutate(role, resource) {
    if (!role || !resource) return false;
    const lowerCaseRole = role.toLowerCase();
    return Boolean(MUTATE[resource]?.includes(lowerCaseRole));
}