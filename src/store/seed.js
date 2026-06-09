import { uid } from "../lib/helpers";

export const seedUsers = [
    {
        id: "u_admin", name: "Sagar Sharma", email: "admin@gmail.com", password: "admin123", role: "admin", phone: "+91 98100 11122", department: "Executive", joinedAt: "2021-04-12", status: "active"
    },
    {
        id: "u_dir", name: "Indira Rao", email: "director@gmail.com", password: "demo123", role: "director", phone: "+91 98200 22244", department: "Executive", joinedAt: "2020-01-08", status: "active"
    },
    {
        id: "u_pm1", name: "Aria Kapoor", email: "pm.aria@gmail.com", password: "demo123", role: "project_manager", phone: "+91 98301 33455", department: "Projects", joinedAt: "2022-08-20", status: "active"
    },
    {
        id: "u_pm2", name: "Rahul Iyer", email: "pm.rahul@gmail.com", password: "demo123", role: "project_manager", phone: "+91 98404 56611", department: "Projects", joinedAt: "2023-02-14", status: "active"
    },
    {
        id: "u_se1", name: "Kabir Shah", email: "site.kabir@gmail.com", password: "demo123", role: "site_engineer", phone: "+91 98515 77890", department: "Site Ops", joinedAt: "2023-06-01", status: "active"
    },
    {
        id: "u_se2", name: "Meera Joshi", email: "site.meera@gmail.com", password: "demo123", role: "site_engineer", phone: "+91 98623 12399", department: "Site Ops", joinedAt: "2024-01-19", status: "active"
    },
    {
        id: "u_acc", name: "Neha Verma", email: "finance.neha@gmail.com", password: "demo123", role: "accountant", phone: "+91 98744 19922", department: "Finance", joinedAt: "2022-11-04", status: "active"
    },
    {
        id: "u_hr", name: "Varun Singh", email: "hr.varun@gmail.com", password: "demo123", role: "hr_manager", phone: "+91 98865 88433", department: "HR", joinedAt: "2022-03-30", status: "active"
    },
    {
        id: "u_vnd", name: "SteelMart Industries", email: "vendor.steelmart@gmail.com", password: "demo123", role: "vendor", phone: "+91 90011 23344", department: "External", joinedAt: "2023-05-10", status: "active"
    },
    { id: "u_cli", name: "Zenith Realty", email: "client.zenith@gmail.com", password: "demo123", role: "client", phone: "+91 99877 66554", department: "External", joinedAt: "2023-09-25", status: "active" },
];

export const seedProjects = [
    {
        id: "p_001", code: "BH-VRT-24", name: "Verita Residences — Tower A & B", client: "Zenith Realty",
        location: "Whitefield, Bengaluru", status: "in_progress", priority: "high",
        startDate: "2024-03-01", endDate: "2026-02-28",
        budget: 480000000, spent: 268000000, progress: 56,
        manager: "u_pm1", siteEngineer: "u_se1",
        description: "Two-tower premium residential complex (G+24) with podium parking, clubhouse, and infinity pool deck.",
    },
    {
        id: "p_002", code: "BH-MTC-23", name: "Meridian Tech Campus — Phase 2", client: "Meridian Holdings",
        location: "Hinjewadi, Pune", status: "in_progress", priority: "high",
        startDate: "2023-09-15", endDate: "2025-12-15",
        budget: 720000000, spent: 532000000, progress: 74,
        manager: "u_pm2", siteEngineer: "u_se2",
        description: "Grade-A office campus with two B+G+18 towers and shared amenity block.",
    },
    {
        id: "p_003", code: "BH-CRL-25", name: "Coral Bay Mall Expansion", client: "Coral Hospitality",
        location: "Panjim, Goa", status: "planning", priority: "medium",
        startDate: "2025-06-01", endDate: "2027-03-31",
        budget: 320000000, spent: 18500000, progress: 6,
        manager: "u_pm1", siteEngineer: "u_se1",
        description: "Retail mall east-wing extension with 110 retail units and a multi-screen entertainment zone.",
    },
    {
        id: "p_004", code: "BH-SVN-22", name: "Savana Villas — Cluster D", client: "Zenith Realty",
        location: "Devanahalli, Bengaluru", status: "delayed", priority: "high",
        startDate: "2022-11-10", endDate: "2024-10-30",
        budget: 210000000, spent: 196000000, progress: 88,
        manager: "u_pm2", siteEngineer: "u_se2",
        description: "24 luxury villas with private pools and landscaped courtyards.",
    },
    {
        id: "p_005", code: "BH-ARC-21", name: "Arcadia Heights — Handover", client: "Arcadia Group",
        location: "Andheri East, Mumbai", status: "completed", priority: "medium",
        startDate: "2021-07-01", endDate: "2024-05-15",
        budget: 540000000, spent: 528000000, progress: 100,
        manager: "u_pm1", siteEngineer: "u_se1",
        description: "Mixed-use development handed over to client; defect-liability period in progress.",
    },
];

export const seedVendors = [
    {
        id: "v_01", name: "SteelMart Industries", category: "Steel & Rebar", contact: "Rohit Khanna", phone: "+91 90011 23344", email: "sales@steelmart.in", gst: "29ABCDE1234F1Z5", rating: 4.6, status: "active", outstanding: 1280000
    },
    {
        id: "v_02", name: "BlueRidge Cement Co.", category: "Cement & Aggregates", contact: "Priya Nair", phone: "+91 90012 88997", email: "po@blueridge.in", gst: "27FGHIJ5678K1L9", rating: 4.4, status: "active", outstanding: 845000
    },
    {
        id: "v_03", name: "Voltaic Electricals", category: "Electrical", contact: "Anand Pillai", phone: "+91 90456 11220", email: "orders@voltaic.in", gst: "33MNOPQ9012R1S2", rating: 4.1, status: "active", outstanding: 312000
    },
    {
        id: "v_04", name: "AquaFlow Plumbing", category: "Plumbing", contact: "Sneha Patel", phone: "+91 90567 33880", email: "ops@aquaflow.in", gst: "24TUVWX3456Y1Z8", rating: 3.9, status: "active", outstanding: 0
    },
    {
        id: "v_05", name: "GreenTile Interiors", category: "Tiles & Finishing", contact: "Kunal Mehta", phone: "+91 90678 44991", email: "biz@greentile.in", gst: "07ABCMN6789D1E2", rating: 4.2, status: "on_hold", outstanding: 178000
    },
    { id: "v_06", name: "Ironclad Safety Gear", category: "Safety Equipment", contact: "Devika Sharma", phone: "+91 90789 55332", email: "sales@ironclad.in", gst: "06PQRST1357U1V0", rating: 4.7, status: "active", outstanding: 56000 },
];

export const seedInventory = [
    {
        id: "i_01", sku: "CMT-OPC53-50", name: "OPC 53 Grade Cement (50kg)", category: "Cement", unit: "bag", stock: 1240, reorder: 400, valuation: 420, warehouse: "Bengaluru — Main", lastUpdated: "2025-01-22"
    },
    {
        id: "i_02", sku: "STL-TMT-12MM", name: "TMT Rebar 12mm (Fe 550D)", category: "Steel", unit: "ton", stock: 38, reorder: 15, valuation: 62000, warehouse: "Bengaluru — Main", lastUpdated: "2025-01-21"
    },
    {
        id: "i_03", sku: "STL-TMT-16MM", name: "TMT Rebar 16mm (Fe 550D)", category: "Steel", unit: "ton", stock: 9, reorder: 12, valuation: 61500, warehouse: "Pune — Site B", lastUpdated: "2025-01-20"
    },
    {
        id: "i_04", sku: "AGR-MSAND-10", name: "M-Sand (Construction Grade)", category: "Aggregates", unit: "ton", stock: 220, reorder: 80, valuation: 1800, warehouse: "Bengaluru — Main", lastUpdated: "2025-01-19"
    },
    {
        id: "i_05", sku: "ELC-COND-25", name: "PVC Conduit 25mm", category: "Electrical", unit: "m", stock: 5400, reorder: 2000, valuation: 38, warehouse: "Pune — Site B", lastUpdated: "2025-01-18"
    },
    {
        id: "i_06", sku: "PLB-CPVC-32", name: "CPVC Pipe 32mm", category: "Plumbing", unit: "m", stock: 1880, reorder: 1000, valuation: 145, warehouse: "Goa — Coral Bay", lastUpdated: "2025-01-17"
    },
    {
        id: "i_07", sku: "SFT-HELM-Y", name: "Safety Helmet (Yellow, ISI)", category: "Safety", unit: "pc", stock: 64, reorder: 80, valuation: 280, warehouse: "Bengaluru — Main", lastUpdated: "2025-01-16"
    },
    { id: "i_08", sku: "TIL-VITR-60", name: "Vitrified Tile 600x600 (Carrara)", category: "Tiles", unit: "box", stock: 312, reorder: 150, valuation: 1450, warehouse: "Mumbai — Arcadia", lastUpdated: "2025-01-15" },
];

export const seedSiteReports = [
    {
        id: "r_01", projectId: "p_001", date: "2025-01-22", engineer: "u_se1", weather: "Clear, 26°C", manpower: 84, milestone: "Tower A — slab L18 casting completed", issues: "Minor delay in MEP shafts due to vendor late dispatch", photos: 12
    },
    {
        id: "r_02", projectId: "p_002", date: "2025-01-22", engineer: "u_se2", weather: "Cloudy, 24°C", manpower: 132, milestone: "Tower 2 — facade glazing 60% complete", issues: "None", photos: 18
    },
    {
        id: "r_03", projectId: "p_001", date: "2025-01-21", engineer: "u_se1", weather: "Light rain, 24°C", manpower: 76, milestone: "Tower B — column shuttering for L12", issues: "Halted concrete pour 2hr due to rain", photos: 9
    },
    { id: "r_04", projectId: "p_004", date: "2025-01-21", engineer: "u_se2", weather: "Hot, 32°C", manpower: 38, milestone: "Villa 14 — interior finishing", issues: "Snag list pending client review", photos: 7 },
];

export const seedPurchaseOrders = [
    {
        id: "po_01", code: "PO-2501-0042", projectId: "p_001", vendorId: "v_01", item: "TMT Rebar 16mm — 24 ton", amount: 1480000, status: "approved", raisedBy: "u_se1", raisedOn: "2025-01-15", expectedDelivery: "2025-01-28"
    },
    {
        id: "po_02", code: "PO-2501-0043", projectId: "p_002", vendorId: "v_02", item: "OPC 53 Cement — 1200 bags", amount: 504000, status: "delivered", raisedBy: "u_se2", raisedOn: "2025-01-10", expectedDelivery: "2025-01-18"
    },
    {
        id: "po_03", code: "PO-2501-0044", projectId: "p_001", vendorId: "v_03", item: "Bus duct & DBs (Tower A — L1 to L8)", amount: 720000, status: "in_review", raisedBy: "u_pm1", raisedOn: "2025-01-19", expectedDelivery: "2025-02-05"
    },
    {
        id: "po_04", code: "PO-2501-0045", projectId: "p_003", vendorId: "v_05", item: "Vitrified tile sample lot", amount: 88000, status: "draft", raisedBy: "u_pm1", raisedOn: "2025-01-21", expectedDelivery: "2025-01-30"
    },
    { id: "po_05", code: "PO-2412-0398", projectId: "p_004", vendorId: "v_06", item: "Safety harness & helmets", amount: 142000, status: "delivered", raisedBy: "u_se2", raisedOn: "2024-12-29", expectedDelivery: "2025-01-08" },
];

export const seedInvoices = [
    {
        id: "inv_01", code: "INV-25-0011", projectId: "p_001", clientName: "Zenith Realty", amount: 22500000, gst: 4050000, total: 26550000, status: "paid", issuedOn: "2025-01-05", dueOn: "2025-01-25"
    },
    {
        id: "inv_02", code: "INV-25-0012", projectId: "p_002", clientName: "Meridian Holdings", amount: 31000000, gst: 5580000, total: 36580000, status: "sent", issuedOn: "2025-01-10", dueOn: "2025-02-09"
    },
    {
        id: "inv_03", code: "INV-25-0013", projectId: "p_004", clientName: "Zenith Realty", amount: 9800000, gst: 1764000, total: 11564000, status: "overdue", issuedOn: "2024-12-12", dueOn: "2025-01-11"
    },
    { id: "inv_04", code: "INV-25-0014", projectId: "p_005", clientName: "Arcadia Group", amount: 4500000, gst: 810000, total: 5310000, status: "draft", issuedOn: "2025-01-20", dueOn: "2025-02-19" },
];

export const seedExpenses = [
    {
        id: "ex_01", projectId: "p_001", category: "Material", note: "Steel — January ramp-up", amount: 1480000, date: "2025-01-15"
    },
    {
        id: "ex_02", projectId: "p_001", category: "Labour", note: "Subcontract — block work crew", amount: 642000, date: "2025-01-18"
    },
    {
        id: "ex_03", projectId: "p_002", category: "Material", note: "Glazing facade Phase 1", amount: 2310000, date: "2025-01-12"
    },
    { id: "ex_04", projectId: "p_003", category: "Consultancy", note: "Structural design revision", amount: 185000, date: "2025-01-09" },
];

export const seedPayroll = [
    {
        id: "pay-1",
        employeeId: "u1",
        month: "2025-04",
        basic: 30000,
        allowances: 5000,
        deductions: 2000,
        netPay: 33000,
        paidOn: "2025-04-30",
    },
    {
        id: "pay-2",
        employeeId: "u2",
        month: "2025-04",
        basic: 45000,
        allowances: 7000,
        deductions: 3000,
        netPay: 49000,
        paidOn: "2025-04-30",
    },
]

export const seedSales = [
    {
        id: "sale-1",
        projectId: "p_001",
        unitNo: "A-101",
        buyerName: "Rahul Mehta",
        saleAmount: 8000000,
        date: "2025-06-01",
        paymentMode: "bank",
    },
    {
        id: "sale-2",
        projectId: "p_002",
        unitNo: "B-202",
        buyerName: "Neha Agarwal",
        saleAmount: 9500000,
        date: "2025-07-15",
        paymentMode: "cheque",
    },
]

export const seedProcurement = [
    {
        id: "proc-1",
        projectId: "p_001",
        item: "Steel TMT Bars",
        quantity: 50,
        unitPrice: 62000,
        totalCost: 3100000,
        orderDate: "2025-04-05",
        received: true,
    },
    {
        id: "proc-2",
        projectId: "p_002",
        item: "Cement",
        quantity: 100,
        unitPrice: 380,
        totalCost: 38000,
        orderDate: "2025-05-20",
        received: false,
    },
]

export const seedBookings = [
    {
        id: "book-1",
        projectId: "p_001",
        unitNo: "A-102",
        customerName: "Vikram Singh",
        totalAmount: 8500000,
        paidAmount: 2000000,
        dueAmount: 6500000,
        status: "pending",
        bookingDate: "2025-06-10",
    },
    {
        id: "book-2",
        projectId: "p_002",
        unitNo: "B-301",
        customerName: "Ananya Patel",
        totalAmount: 12000000,
        paidAmount: 6000000,
        dueAmount: 6000000,
        status: "partially_paid",
        bookingDate: "2025-07-05",
    },
]

export const seedAttendance = [
    {
        id: "at_01", employeeId: "u_se1", date: "2025-01-22", checkIn: "08:12", checkOut: "18:34", site: "Verita Residences", hours: 10.3
    },
    {
        id: "at_02", employeeId: "u_se2", date: "2025-01-22", checkIn: "08:05", checkOut: "19:01", site: "Meridian Campus", hours: 10.9
    },
    {
        id: "at_03", employeeId: "u_pm1", date: "2025-01-22", checkIn: "09:20", checkOut: "19:40", site: "HQ + Site visit", hours: 10.3
    },
    { id: "at_04", employeeId: "u_acc", date: "2025-01-22", checkIn: "09:45", checkOut: "18:10", site: "HQ", hours: 8.4 },
];

export const seedLeads = [
    {
        id: "ld_01", name: "Skyline Developers — Phase 1 RFP", contact: "Karthik Reddy", phone: "+91 99001 22334", value: 380000000, stage: "qualified", owner: "u_pm1", note: "Awaiting BOQ submission"
    },
    {
        id: "ld_02", name: "Aurora Hospitals — New Wing", contact: "Dr. Lakshmi N.", phone: "+91 99110 33445", value: 240000000, stage: "proposal", owner: "u_pm2", note: "Site visit scheduled 28-Jan"
    },
    {
        id: "ld_03", name: "Zenith Realty — Phase 3 villas", contact: "Rohan Bhalla", phone: "+91 99877 66554", value: 620000000, stage: "negotiation", owner: "u_pm1", note: "Pricing pushback on M&E"
    },
    { id: "ld_04", name: "Coral Hospitality — Beach Resort", contact: "Tara D'Souza", phone: "+91 99221 44556", value: 510000000, stage: "won", owner: "u_pm1", note: "Kick-off in March" },
];

export const seedDocuments = [
    {
        id: "d_01", name: "Verita — Master Drawing Set v4", type: "Drawing", projectId: "p_001", size: "84 MB", version: "v4.2", uploadedBy: "u_pm1", uploadedAt: "2025-01-18"
    },
    {
        id: "d_02", name: "Meridian — Contract Agreement (Signed)", type: "Contract", projectId: "p_002", size: "3.1 MB", version: "v1.0", uploadedBy: "u_acc", uploadedAt: "2024-09-22"
    },
    {
        id: "d_03", name: "Coral Bay — Soil Investigation Report", type: "Report", projectId: "p_003", size: "12 MB", version: "v1.1", uploadedBy: "u_pm1", uploadedAt: "2025-01-09"
    },
    {
        id: "d_04", name: "Savana — Snag List January", type: "Report", projectId: "p_004", size: "1.4 MB", version: "v3.0", uploadedBy: "u_se2", uploadedAt: "2025-01-21"
    },
    { id: "d_05", name: "Vendor Compliance — SteelMart", type: "Compliance", projectId: null, size: "780 KB", version: "v2.0", uploadedBy: "u_acc", uploadedAt: "2024-12-30" },
];

export { uid };