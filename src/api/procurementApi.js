import api from './axios';

export const procurementApi = {
    // RFQ
    getRfqs: (params) => api.get('/procurement/rfq', { params }),
    getRfqById: (id) => api.get(`/procurement/rfq/${id}`),
    createRfq: (data) => api.post('/procurement/rfq', data),
    sendRfq: (id) => api.patch(`/procurement/rfq/${id}/send`),

    // Quotations
    getQuotations: (params) => api.get('/procurement/quotations', { params }),
    getQuotationById: (id) => api.get(`/procurement/quotations/${id}`),
    submitQuotation: (data) => api.post('/procurement/quotations', data),
    acceptQuotation: (id) => api.patch(`/procurement/quotations/${id}/accept`),
    rejectQuotation: (id, data) => api.patch(`/procurement/quotations/${id}/reject`, data),

    // Purchase Orders
    getPurchaseOrders: (params) => api.get('/procurement/purchase-orders', { params }),
    getPurchaseOrderById: (id) => api.get(`/procurement/purchase-orders/${id}`),
    createPurchaseOrder: (data) => api.post('/procurement/purchase-orders', data),
    updatePurchaseOrderStatus: (id, data) => api.patch(`/procurement/purchase-orders/${id}/status`, data),

    // Deliveries
    getDeliveryStatus: (poId) => api.get(`/procurement/delivery/${poId}`),
    updateDeliveryStatus: (poId, data) => api.patch(`/procurement/delivery/${poId}/status`, data),
    addDeliveryTracking: (poId, data) => api.post(`/procurement/delivery/${poId}/track`, data),
    receiveDelivery: (poId, data) => api.post(`/procurement/delivery/${poId}/receive`, data),
};