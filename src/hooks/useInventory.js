// src/hooks/useInventory.js
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { inventoryApi } from '@/api/inventoryApi';

export const useInventory = () => {
    const [materials, setMaterials] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [valuation, setValuation] = useState(null);
    const [stockCounts, setStockCounts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all materials
    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const res = await inventoryApi.getMaterials();
            setMaterials(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load materials');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch stock levels (with filters: materialId, warehouse, etc.)
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

    // Fetch warehouses
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

    // Fetch transactions
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

    // Fetch low stock alerts
    const fetchLowStockAlerts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await inventoryApi.getLowStock();
            setLowStockAlerts(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load alerts');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch valuation
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

    // Fetch stock counts
    const fetchStockCounts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await inventoryApi.getCounts();
            setStockCounts(res.data?.data || []);
        } catch (err) {
            console.error('Failed to load stock counts', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Issue stock
    const issueStock = async (data) => {
        try {
            const res = await inventoryApi.issueStock(data);
            if (res.data.success) {
                toast.success('Stock issued successfully');
                await fetchStock();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to issue stock');
            return false;
        }
    };

    // Return stock
    const returnStock = async (data) => {
        try {
            const res = await inventoryApi.returnStock(data);
            if (res.data.success) {
                toast.success('Stock returned successfully');
                await fetchStock();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to return stock');
            return false;
        }
    };

    // Transfer stock
    const transferStock = async (data) => {
        try {
            const res = await inventoryApi.transferStock(data);
            if (res.data.success) {
                toast.success('Stock transferred successfully');
                await fetchStock();
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to transfer stock');
            return false;
        }
    };

    // Resolve low stock alert
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

    // Create material
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

    // Update material
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

    // Delete material
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

    // Create warehouse
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

    // Stock count operations
    const startCount = async (data) => {
        try {
            const res = await inventoryApi.startCount(data);
            if (res.data.success) {
                toast.success('Stock count started');
                await fetchStockCounts();
                return res.data.data;
            }
        } catch (err) {
            toast.error('Failed to start count');
            return null;
        }
    };

    const updateCount = async (countId, items) => {
        try {
            const res = await inventoryApi.updateCount(countId, items);
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
                return true;
            }
        } catch (err) {
            toast.error('Failed to approve count');
            return false;
        }
    };

    // Initial load of common data
    useEffect(() => {
        fetchMaterials();
        fetchWarehouses();
        fetchStock();
    }, []);

    return {
        // Data
        materials,
        stockData,
        warehouses,
        transactions,
        lowStockAlerts,
        valuation,
        stockCounts,
        loading,
        // Actions
        fetchMaterials,
        fetchStock,
        fetchWarehouses,
        fetchTransactions,
        fetchLowStockAlerts,
        fetchValuation,
        fetchStockCounts,
        issueStock,
        returnStock,
        transferStock,
        resolveAlert,
        createMaterial,
        updateMaterial,
        deleteMaterial,
        createWarehouse,
        startCount,
        updateCount,
        completeCount,
        approveCount,
    };
};