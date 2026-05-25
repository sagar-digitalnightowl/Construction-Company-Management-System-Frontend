// src/api/inventoryApi.js
import api from './axios';

export const inventoryApi = {
    // ==================== MATERIALS ====================
    // Get all materials (with pagination & filters)
    getAllMaterials: (params) => api.get('/inventory/materials', { params }),
    // Get single material by ID
    getMaterialById: (id) => api.get(`/inventory/materials/${id}`),
    // Create new material
    createMaterial: (data) => api.post('/inventory/materials', data),
    // Update material
    updateMaterial: (id, data) => api.put(`/inventory/materials/${id}`, data),
    // Soft delete material
    deleteMaterial: (id) => api.delete(`/inventory/materials/${id}`),

    // ==================== WAREHOUSES ====================
    // Get all warehouses
    getWarehouses: () => api.get('/inventory/warehouses'),
    // Get single warehouse by ID
    getWarehouseById: (id) => api.get(`/inventory/warehouses/${id}`),
    // Create new warehouse
    createWarehouse: (data) => api.post('/inventory/warehouses', data),
    // Update warehouse
    updateWarehouse: (id, data) => api.put(`/inventory/warehouses/${id}`, data),
    // Soft delete warehouse
    deleteWarehouse: (id) => api.delete(`/inventory/warehouses/${id}`),

    // ==================== STOCK MANAGEMENT ====================
    // Get current stock levels (filter by materialId, warehouse)
    getStock: (params) => api.get('/inventory/stock', { params }),
    // Add stock (purchase)
    addStock: (data) => api.post('/inventory/stock/add', data),
    // Issue material to site/project
    issueStock: (data) => api.post('/inventory/stock/issue', data),
    // Return unused material
    returnStock: (data) => api.post('/inventory/stock/return', data),
    // Transfer stock between warehouses
    transferStock: (data) => api.post('/inventory/stock/transfer', data),

    // ==================== LOW STOCK ALERTS ====================
    // Get all low stock alerts
    getLowStockAlerts: () => api.get('/inventory/stock/low-stock'),
    // Update alert status (pending, resolved, ignored)
    updateStockAlert: (alertId, data) => api.patch(`/inventory/stock/alerts/${alertId}`, data),
    // Convenience method to resolve an alert
    resolveAlert: (alertId) => api.patch(`/inventory/stock/alerts/${alertId}`, { status: 'resolved' }),

    // ==================== INVENTORY COUNTS ====================
    // Create a new inventory count (draft)
    startCount: (data) => api.post('/inventory/count/start', data),
    // Get all inventory counts (filter by warehouse, status)
    getCounts: (params) => api.get('/inventory/count', { params }),
    // Get single inventory count by ID
    getCountById: (countId) => api.get(`/inventory/count/${countId}`),
    // Begin counting (change status to in_progress)
    beginCount: (countId) => api.patch(`/inventory/count/${countId}/start`),
    // Update counted items (array of { materialId, physicalQuantity, reason })
    updateCountItems: (countId, items) => api.put(`/inventory/count/${countId}/items`, items),
    // Complete the count (status → completed)
    completeCount: (countId) => api.patch(`/inventory/count/${countId}/complete`),
    // Approve completed count (status → approved)
    approveCount: (countId) => api.patch(`/inventory/count/${countId}/approve`),

    // ==================== TRANSACTIONS ====================
    // Get stock transaction history (filter by materialId, date range)
    getTransactions: (params) => api.get('/inventory/transactions', { params }),

    // ==================== VALUATION ====================
    // Get total inventory value
    getValuation: () => api.get('/inventory/valuation'),

    // ==================== BARCODE SCANNING ====================
    // Get material details by scanning barcode/QR
    scanBarcode: (code) => api.get(`/inventory/barcode/${code}`),
};