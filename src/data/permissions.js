// Role-based permission map.
// Roles: admin, director, project_manager, site_engineer, accountant, hr_manager, vendor, client
// Resources roughly mirror sidebar modules.

export const ROLES = {
    admin: "Admin",
    director: "Director",
    project_manager: "Project Manager",
    site_engineer: "Site Engineer",
    accountant: "Accountant",
    hr_manager: "HR Manager",
    vendor: "Vendor",
    client: "Client",
};

// per-resource: who can VIEW the page
export const VIEW = {
    dashboard: ["admin", "director", "project_manager", "site_engineer", "accountant", "hr_manager", "vendor", "client"],
    users: ["admin"],
    projects: ["admin", "director", "project_manager", "site_engineer", "accountant", "client"],
    "project-templates": ["admin", "director", "project_manager", "site_engineer", "accountant", "client"],
    "site-management": ["admin", "director", "project_manager", "site_engineer"],
    "my-tasks": ["admin", "director", "project_manager", "site_engineer"],
    procurement: ["admin", "director", "project_manager", "site_engineer", "accountant"],
    'procurement-overview': ["admin", "director", "project_manager", "site_engineer", "accountant"],
    'procurement-rfqs': ["admin", "director", "project_manager", "site_engineer", "accountant"],
    'procurement-quotations': ["admin", "director", "project_manager", "site_engineer", "accountant"],
    'procurement-pos': ["admin", "director", "project_manager", "site_engineer", "accountant"],
    'procurement-deliveries': ["admin", "director", "project_manager", "site_engineer", "accountant"],
    vendor: ["admin", "director", "project_manager", "vendor"],
    inventory: ["admin", "director", "project_manager", "site_engineer"],
    "inventory-stock-management": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-materials": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-warehouses": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-transactions": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-alerts": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-valuation": ["admin", "director", "project_manager", "site_engineer"],
    "inventory-counts": ["admin", "director", "project_manager", "site_engineer"],
    bookings: ["admin", "director", "project_manager", "site_engineer"],
    my_bookings: ["admin", "client"],
    my_installments: ["admin", "client"],
    pending_bookings: ["admin", "director", "project_manager", "site_engineer"],
    finance: ["admin", "director", "accountant", "client"],
    hr: ["admin", "director", "hr_manager"],
    crm: ["admin", "director", "project_manager", "client"],
    documents: ["admin", "director", "project_manager", "site_engineer", "accountant", "client", "vendor"],
    reports: ["admin", "director"],
    settings: ["admin", "director", "project_manager", "site_engineer", "accountant", "hr_manager", "vendor", "client"],
};

// who can mutate (create / edit / delete) records on a resource
export const MUTATE = {
    users: ["admin"],
    projects: ["admin", "director", "project_manager"],
    "project-operations": ["admin", "director", "project_manager", "site_engineer"],
    "project-template": ["admin", "director", "project_manager"],
    "site-management": ["admin", "director", "project_manager"],
    "site-operations": ["admin", "director", "project_manager", "site_engineer"],
    procurement: ["admin", "director", "project_manager", "accountant"],
    'procurement-operations': ["admin", "director", "project_manager", "site_engineer", "accountant"],
    vendor: ["admin", "director", "project_manager", "vendor"],
    inventory: ["admin", "director", "project_manager"],
    "inventory-operations": ["  admin", "director", "project_manager", "site_engineer"],
    booking: ['admin', 'director', 'project_manager', 'accountant'],
    booking_payment: ['admin', 'director', 'project_manager', 'accountant', 'client'],
    finance: ["admin", "accountant"],
    hr: ["admin", "hr_manager"],
    crm: ["admin", "project_manager"],
    documents: ["admin", "project_manager", "site_engineer", "accountant"],
};

export function canView(role, resource) {
    return Boolean(VIEW[resource]?.includes(role));
}
export function canMutate(role, resource) {
    return Boolean(MUTATE[resource]?.includes(role));
}
