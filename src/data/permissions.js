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
    sites: ["admin", "director", "project_manager", "site_engineer"],
    procurement: ["admin", "director", "project_manager", "site_engineer", "accountant"],
    vendors: ["admin", "director", "project_manager", "accountant", "vendor"],
    inventory: ["admin", "director", "project_manager", "site_engineer"],
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
    sites: ["admin", "project_manager", "site_engineer"],
    procurement: ["admin", "project_manager", "site_engineer"],
    vendors: ["admin", "project_manager"],
    inventory: ["admin", "project_manager", "site_engineer"],
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
