// src/hooks/useInventory.js
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { inventoryApi } from '@/api/inventoryApi';

export const useInventory = () => {
    const [materials, setMaterials] = useState([]);
    const [currentMaterial, setCurrentMaterial] = useState(null); // for single material
    const [stockData, setStockData] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [valuation, setValuation] = useState(null);
    const [stockCounts, setStockCounts] = useState([]);
    const [loading, setLoading] = useState(false);

    // ==================== MATERIALS ====================
    const fetchMaterials = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await inventoryApi.getAllMaterials(params);
            setMaterials(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load materials');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMaterialById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await inventoryApi.getMaterialById(id);
            setCurrentMaterial(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to load material details');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createMaterial = async (data) => {
        try {
            const res = await inventoryApi.createMaterial(data);
            if (res.data.success) {
                toast.success('Material created');
                await fetchMaterials();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create material');
            return false;
        }
    };

    const updateMaterial = async (id, data) => {
        try {
            const res = await inventoryApi.updateMaterial(id, data);
            if (res.data.success) {
                toast.success('Material updated');
                await fetchMaterials();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update material');
            return false;
        }
    };

    const deleteMaterial = async (id) => {
        try {
            const res = await inventoryApi.deleteMaterial(id);
            if (res.data.success) {
                toast.success('Material deleted');
                await fetchMaterials();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete material');
            return false;
        }
    };

    // ==================== WAREHOUSES ====================
    const fetchWarehouses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await inventoryApi.getWarehouses();
            setWarehouses(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load warehouses');
        } finally {
            setLoading(false);
        }
    }, []);

    const createWarehouse = async (data) => {
        try {
            const res = await inventoryApi.createWarehouse(data);
            if (res.data.success) {
                toast.success('Warehouse created');
                await fetchWarehouses();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create warehouse');
            return false;
        }
    };

    const updateWarehouse = async (id, data) => {
        try {
            const res = await inventoryApi.updateWarehouse(id, data);
            if (res.data.success) {
                toast.success('Warehouse updated');
                await fetchWarehouses();
                return true;
            }
        } catch (err) {
            toast.error('Failed to update warehouse');
            return false;
        }
    };

    const deleteWarehouse = async (id) => {
        try {
            const res = await inventoryApi.deleteWarehouse(id);
            if (res.data.success) {
                toast.success('Warehouse deleted');
                await fetchWarehouses();
                return true;
            }
        } catch (err) {
            toast.error('Failed to delete warehouse');
            return false;
        }
    };

    // ==================== STOCK ====================
    const fetchStock = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await inventoryApi.getStock(params);
            setStockData(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load stock');
        } finally {
            setLoading(false);
        }
    }, []);

    const addStock = async (data) => {
        try {
            const res = await inventoryApi.addStock(data);
            if (res.data.success) {
                toast.success('Stock added');
                await fetchStock({ materialId: data.materialId });
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add stock');
            return false;
        }
    };

    const issueStock = async (data) => {
        try {
            const res = await inventoryApi.issueStock(data);
            if (res.data.success) {
                toast.success('Stock issued');
                await fetchStock({ materialId: data.materialId });
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to issue stock');
            return false;
        }
    };

    const returnStock = async (data) => {
        try {
            const res = await inventoryApi.returnStock(data);
            if (res.data.success) {
                toast.success('Stock returned');
                await fetchStock({ materialId: data.materialId });
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to return stock');
            return false;
        }
    };

    const transferStock = async (data) => {
        try {
            const res = await inventoryApi.transferStock(data);
            if (res.data.success) {
                toast.success('Stock transferred');
                await fetchStock({ materialId: data.materialId });
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to transfer stock');
            return false;
        }
    };

    // ==================== TRANSACTIONS ====================
    const fetchTransactions = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await inventoryApi.getTransactions(params);
            setTransactions(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== LOW STOCK ALERTS ====================
    const fetchLowStockAlerts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await inventoryApi.getLowStockAlerts();
            setLowStockAlerts(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load alerts');
        } finally {
            setLoading(false);
        }
    }, []);

    const resolveAlert = async (alertId) => {
        try {
            const res = await inventoryApi.resolveAlert(alertId);
            if (res.data.success) {
                toast.success('Alert resolved');
                await fetchLowStockAlerts();
                return true;
            }
        } catch (err) {
            toast.error('Failed to resolve alert');
            return false;
        }
    };

    // ==================== INVENTORY COUNTS ====================
    const fetchStockCounts = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await inventoryApi.getCounts(params);
            setStockCounts(res.data?.data || []);
        } catch (err) {
            console.error('Failed to load stock counts', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const startCount = async (data) => {
        try {
            const res = await inventoryApi.startCount(data);
            if (res.data.success) {
                toast.success('Inventory count started');
                await fetchStockCounts();
                return res.data.data;
            }
        } catch (err) {
            toast.error('Failed to start count');
            return null;
        }
    };

    const updateCountItems = async (countId, items) => {
        try {
            const res = await inventoryApi.updateCountItems(countId, items);
            if (res.data.success) {
                toast.success('Count updated');
                return true;
            }
        } catch (err) {
            toast.error('Failed to update count');
            return false;
        }
    };

    const completeCount = async (countId) => {
        try {
            const res = await inventoryApi.completeCount(countId);
            if (res.data.success) {
                toast.success('Count completed');
                await fetchStockCounts();
                return true;
            }
        } catch (err) {
            toast.error('Failed to complete count');
            return false;
        }
    };

    const approveCount = async (countId) => {
        try {
            const res = await inventoryApi.approveCount(countId);
            if (res.data.success) {
                toast.success('Count approved');
                await fetchStock();
                await fetchStockCounts();
                return true;
            }
        } catch (err) {
            toast.error('Failed to approve count');
            return false;
        }
    };

    // ==================== VALUATION ====================
    const fetchValuation = useCallback(async () => {
        setLoading(true);
        try {
            const res = await inventoryApi.getValuation();
            setValuation(res.data?.data);
        } catch (err) {
            toast.error('Failed to load valuation');
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== BARCODE SCANNING ====================
    const scanBarcode = async (code) => {
        try {
            const res = await inventoryApi.scanBarcode(code);
            return res.data?.data;
        } catch (err) {
            toast.error('Material not found');
            return null;
        }
    };

    // ==================== INITIAL LOAD ====================
    useEffect(() => {
        fetchMaterials();
        fetchWarehouses();
        fetchStock();
    }, []);

    return {
        // Data
        materials,
        currentMaterial,
        stockData,
        warehouses,
        transactions,
        lowStockAlerts,
        valuation,
        stockCounts,
        loading,
        // Material actions
        fetchMaterials,
        fetchMaterialById,
        createMaterial,
        updateMaterial,
        deleteMaterial,
        // Warehouse actions
        fetchWarehouses,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse,
        // Stock actions
        fetchStock,
        addStock,
        issueStock,
        returnStock,
        transferStock,
        // Transaction actions
        fetchTransactions,
        // Alert actions
        fetchLowStockAlerts,
        resolveAlert,
        // Count actions
        fetchStockCounts,
        startCount,
        updateCountItems,
        completeCount,
        approveCount,
        // Valuation
        fetchValuation,
        // Barcode
        scanBarcode,
    };
};