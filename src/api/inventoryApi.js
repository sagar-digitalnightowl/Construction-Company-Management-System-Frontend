import api from './axios';

export const inventoryApi = {
    // MATERIALS
    getMaterials: () => api.get('/inventory/materials'),
    getMaterialById: (id) => api.get(`/inventory/materials/${id}`),
    createMaterial: (data) => api.post('/inventory/materials', data),
    updateMaterial: (id, data) => api.put(`/inventory/materials/${id}`, data),
    deleteMaterial: (id) => api.delete(`/inventory/materials/${id}`),

    // WAREHOUSES
    getWarehouses: () => api.get('/inventory/warehouses'),
    createWarehouse: (data) => api.post('/inventory/warehouses', data),
    updateWarehouse: (id, data) => api.put(`/inventory/warehouses/${id}`, data),

    // STOCK
    getStock: (params) => api.get('/inventory/stock', { params }),
    issueStock: (data) => api.post('/inventory/stock/issue', data),
    returnStock: (data) => api.post('/inventory/stock/return', data),
    transferStock: (data) => api.post('/inventory/stock/transfer', data),

    // ALERTS
    getLowStock: () => api.get('/inventory/stock/low-stock'),
    resolveAlert: (alertId) => api.patch(`/inventory/stock/alerts/${alertId}`),

    // STOCK COUNTS
    startCount: (data) => api.post('/inventory/count/start', data),
    updateCount: (countId, items) => api.put(`/inventory/count/${countId}/items`, items),
    completeCount: (countId) => api.patch(`/inventory/count/${countId}/complete`),
    approveCount: (countId) => api.patch(`/inventory/count/${countId}/approve`),
    getCounts: () => api.get('/inventory/counts'), // if available

    // TRANSACTIONS
    getTransactions: (params) => api.get('/inventory/transactions', { params }),

    // VALUATION
    getValuation: () => api.get('/inventory/valuation'),
};