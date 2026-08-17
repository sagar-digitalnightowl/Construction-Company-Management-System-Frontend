export const ROLES = {
    admin: "Admin",
    director: "Director",
    project_manager: "Project Manager",
    site_engineer: "Site Engineer",
    accountant: "Accountant",
    finance_executive: "Finance Executive",
    hr_manager: "HR Manager",
    vendor: "Vendor",
    client: "Client",
    employee: "Employee",
};

// per-resource: who can VIEW the page
export const VIEW = {
    dashboard: [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
        "finance_executive",
        "hr_manager",
        "vendor",
        "client",
    ],
    users: ["admin"],
    projects: [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
    ],
    "project-templates": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
    ],
    "property-inventory": [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    "site-management": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    tasks: ["admin", "director", "project_manager", "site_engineer"],
    procurement: [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    "procurement-overview": [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    "procurement-rfqs": [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    "procurement-quotations": [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    "procurement-pos": [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    "procurement-deliveries": [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    vendor: ["admin", "vendor"],
    inventory: ["admin", "director", "project_manager", "site_engineer"],
    "inventory-stock-management": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    "inventory-materials": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    "inventory-warehouses": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    "inventory-transactions": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    "inventory-alerts": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    "inventory-valuation": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    "inventory-counts": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    bookings: ["admin", "director", "project_manager"],
    "my-bookings": ["client"],
    "my-installments": ["client"],
    "pending-bookings": ["admin", "director", "project_manager"],
    finance: ["admin", "director", "accountant", "finance_executive"],

    "finance-dashboard": [
        "admin",
        "director",
        "accountant",
        "finance_executive",
    ],

    "finance-bookings-reminder": [
        "admin",
        "director",
        "accountant",
        "finance_executive",
    ],

    "finance-bookings": [
        "admin",
        "director",
        "accountant",
        "finance_executive",
    ],

    "finance-expense-reports": [
        "admin",
        "director",
        "accountant",
        "finance_executive",
    ],

    "finance-due-installments": [
        "admin",
        "director",
        "accountant",
        "finance_executive",
    ],

    "finance-milestones": [
        "admin",
        "director",
        "accountant",
        "finance_executive",
    ],

    "finance-payroll": ["admin", "director", "accountant", "finance_executive"],

    "finance-expenses": [
        "admin",
        "director",
        "accountant",
        "finance_executive",
    ],

    "finance-reminders": [
        "admin",
        "director",
        "accountant",
        "finance_executive",
    ],

    hr: ["admin", "director", "hr_manager"],

    // --- EXPENSE SYSTEM VIEW PERMISSIONS ---
    // 👇 CHANGED: Added finance_executive back
    "my-expenses": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
        "employee",
        "finance_executive", // ✅ ADDED BACK
    ],

    // 👇 CHANGED: Removed hr_manager (finance_executive was already absent)
    leaves: [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
        "employee",
    ],

	"employee-overview": ["employee"],
    "employee-attendance": ["employee"],
    "employee-leaves": ["employee"],
    "employee-salary": ["employee"],
    "employee-announcements": ["employee"],
    crm: ["admin", "director", "project_manager"],
    documents: [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
        "vendor",
    ],
    reports: ["admin", "director"],
    settings: [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
        "finance_executive",
        "hr_manager",
        "vendor",
        "client",
        "employee",
    ],
};

// who can mutate (create / edit / delete) records on a resource
export const MUTATE = {
    users: ["admin"],
    projects: ["admin", "director", "project_manager"],
    "project-operations": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    "tower-operations": ["admin", "director", "project_manager", "hr_manager"],
    "project-template": ["admin", "director", "project_manager"],
    tasks: ["admin", "director", "project_manager"],
    "task-operations": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    "site-management": ["admin", "director", "project_manager"],
    "site-operations": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    procurement: [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    "procurement-operations": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
        "finance_executive",
    ],
    vendor: ["admin", "director", "project_manager", "vendor"],
    inventory: ["admin", "director", "project_manager"],
    "inventory-operations": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
    ],
    booking: [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    booking_payment: [
        "admin",
        "director",
        "project_manager",
        "accountant",
        "finance_executive",
    ],
    finance: ["admin", "accountant", "finance_executive"],
    hr: ["admin", "hr_manager"],

    // --- EXPENSE SYSTEM MUTATE PERMISSIONS ---
    // 👇 CHANGED: Added finance_executive back
    "my-expenses": [
        "admin",
        "director",
        "project_manager",
        "site_engineer",
        "accountant",
        "employee",
        "finance_executive", // ✅ ADDED BACK
    ],
    "expense-payment": ["admin", "accountant", "finance_executive"],

    crm: ["admin", "director"],

    documents: [
        "admin",
        "project_manager",
        "site_engineer",
        "accountant",
        "finance_executive",
    ],
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