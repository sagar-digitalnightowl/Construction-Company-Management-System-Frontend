import { create } from "zustand";
import {
    seedProjects,
    seedVendors,
    seedInventory,
    seedSiteReports,
    seedPurchaseOrders,
    seedInvoices,
    seedExpenses,
    seedAttendance,
    seedLeads,
    seedDocuments,
} from "./seed";
import { uid } from "../lib/helpers";

const crud = (key, prefix) => (set, get) => ({
    [key]: [],
    [`add${cap(key)}`]: (data) => {
        const item = { id: uid(prefix), ...data };
        set((s) => ({ [key]: [item, ...s[key]] }));
        return item;
    },
    [`update${cap(key)}`]: (id, patch) =>
        set((s) => ({ [key]: s[key].map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
    [`remove${cap(key)}`]: (id) => set((s) => ({ [key]: s[key].filter((x) => x.id !== id) })),
});
const cap = (s) => s[0].toUpperCase() + s.slice(1);

export const useProjectsStore = create((set) => ({
    projects: seedProjects,
    addProject: (data) => set((s) => ({
        projects: [{
            id: uid("p"), progress: 0, spent: 0, status: "planning", ...data
        }, ...s.projects]
    })),
    updateProject: (id, patch) => set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
}));

export const useVendorsStore = create((set) => ({
    vendors: seedVendors,
    addVendor: (data) => set((s) => ({
        vendors: [{
            id: uid("v"), rating: 4, status: "active", outstanding: 0, ...data
        }, ...s.vendors]
    })),
    updateVendor: (id, patch) => set((s) => ({ vendors: s.vendors.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeVendor: (id) => set((s) => ({ vendors: s.vendors.filter((p) => p.id !== id) })),
}));

export const useInventoryStore = create((set) => ({
    items: seedInventory,
    addItem: (data) => set((s) => ({
        items: [{
            id: uid("i"), lastUpdated: new Date().toISOString().slice(0, 10), ...data
        }, ...s.items]
    })),
    updateItem: (id, patch) => set((s) => ({ items: s.items.map((p) => (p.id === id ? { ...p, ...patch, lastUpdated: new Date().toISOString().slice(0, 10) } : p)) })),
    removeItem: (id) => set((s) => ({ items: s.items.filter((p) => p.id !== id) })),
}));

export const useSiteStore = create((set) => ({
    reports: seedSiteReports,
    addReport: (data) => set((s) => ({
        reports: [{
            id: uid("r"), photos: 0, ...data
        }, ...s.reports]
    })),
    updateReport: (id, patch) => set((s) => ({ reports: s.reports.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeReport: (id) => set((s) => ({ reports: s.reports.filter((p) => p.id !== id) })),
}));

export const useProcurementStore = create((set) => ({
    orders: seedPurchaseOrders,
    addOrder: (data) => set((s) => ({
        orders: [{
            id: uid("po"), status: "draft", ...data
        }, ...s.orders]
    })),
    updateOrder: (id, patch) => set((s) => ({ orders: s.orders.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeOrder: (id) => set((s) => ({ orders: s.orders.filter((p) => p.id !== id) })),
}));

export const useFinanceStore = create((set) => ({
    invoices: seedInvoices,
    expenses: seedExpenses,
    addInvoice: (data) => set((s) => ({
        invoices: [{
            id: uid("inv"), status: "draft", ...data
        }, ...s.invoices]
    })),
    updateInvoice: (id, patch) => set((s) => ({ invoices: s.invoices.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeInvoice: (id) => set((s) => ({ invoices: s.invoices.filter((p) => p.id !== id) })),
    addExpense: (data) => set((s) => ({
        expenses: [{
            id: uid("ex"), ...data
        }, ...s.expenses]
    })),
    updateExpense: (id, patch) => set((s) => ({ expenses: s.expenses.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeExpense: (id) => set((s) => ({ expenses: s.expenses.filter((p) => p.id !== id) })),
}));

export const useHRStore = create((set) => ({
    attendance: seedAttendance,
    addAttendance: (data) => set((s) => ({
        attendance: [{
            id: uid("at"), ...data
        }, ...s.attendance]
    })),
    updateAttendance: (id, patch) => set((s) => ({ attendance: s.attendance.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeAttendance: (id) => set((s) => ({ attendance: s.attendance.filter((p) => p.id !== id) })),
}));

export const useCRMStore = create((set) => ({
    leads: seedLeads,
    addLead: (data) => set((s) => ({
        leads: [{
            id: uid("ld"), stage: "qualified", ...data
        }, ...s.leads]
    })),
    updateLead: (id, patch) => set((s) => ({ leads: s.leads.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeLead: (id) => set((s) => ({ leads: s.leads.filter((p) => p.id !== id) })),
}));

export const useDocumentsStore = create((set) => ({
    docs: seedDocuments,
    addDoc: (data) => set((s) => ({
        docs: [{
            id: uid("d"), uploadedAt: new Date().toISOString().slice(0, 10), ...data
        }, ...s.docs]
    })),
    updateDoc: (id, patch) => set((s) => ({ docs: s.docs.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    removeDoc: (id) => set((s) => ({ docs: s.docs.filter((p) => p.id !== id) })),
}));