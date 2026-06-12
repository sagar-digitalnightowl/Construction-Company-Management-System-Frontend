import api from "./axios";


export const propertyInventoryApi = {

    // Dashboard (list + stats + leads)
    getDashboard: (params) => api.get(`/property-inventory/dashboard`, { params }),

    // Export inventory to Excel
    exportInventory: () =>
        api.get(`/property-inventory/export`, { responseType: "blob" }),

    // Single project inventory (full towers/flats/bookings)
    getProjectById: (id) => api.get(`/property-inventory/project/${id}`),

    // Bookings for a project (summary list)
    getProjectBookings: (id) => api.get(`/property-inventory/project/${id}/bookings`),

    // Site engineers for a project
    getProjectSiteEngineers: (id) =>
        api.get(`/property-inventory/project/${id}/site-engineers`),

    // Payment details for a booking
    getBookingPaymentDetails: (bookingId) =>
        api.get(`/property-inventory/booking/${bookingId}/payments`),

    // Agreements for a project
    getProjectAgreements: (id) =>
        api.get(`/property-inventory/project/${id}/agreements`),

};