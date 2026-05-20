import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { procurementApi } from '@/api/procurementApi';

export const useProcurement = () => {
    const [loading, setLoading] = useState(false);
    const [rfqs, setRfqs] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [deliveries, setDeliveries] = useState([]);


    // ---------- Purchase Orders ----------
    const fetchPurchaseOrders = useCallback(async (loading = true, params = {}) => {
        setLoading(loading);
        try {
            const res = await procurementApi.getPurchaseOrders(params);
            setPurchaseOrders(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load purchase orders');
        } finally {
            setLoading(false);
        }
    }, []);

    const createPurchaseOrder = useCallback(async (data) => {
        try {
            const res = await procurementApi.createPurchaseOrder(data);
            if (res.data?.success) {
                toast.success('Purchase Order created');
                await fetchPurchaseOrders(false);
                return true;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create PO');
            return false;
        }
    }, [fetchPurchaseOrders]);

    const updatePoStatus = useCallback(async (id, status, expectedDeliveryDate) => {
        try {
            const payload = { status };
            if (expectedDeliveryDate) payload.expectedDeliveryDate = expectedDeliveryDate;
            const res = await procurementApi.updatePurchaseOrderStatus(id, payload);
            if (res.data?.success) {
                toast.success(`PO status updated to ${status}`);
                await fetchPurchaseOrders(false);
                return true;
            }
        } catch (err) {
            toast.error('Failed to update PO status');
            return false;
        }
    }, [fetchPurchaseOrders]);

    // ---------- RFQ ----------
    const fetchRfqs = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await procurementApi.getRfqs(params);
            setRfqs(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load RFQs');
        } finally {
            setLoading(false);
        }
    }, []);

    const createRfq = useCallback(async (data) => {
        try {
            const res = await procurementApi.createRfq(data);
            if (res.data?.success) {
                toast.success('RFQ created successfully');
                await fetchRfqs();
                return true;
            }
            throw new Error(res.data?.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create RFQ');
            return false;
        }
    }, [fetchRfqs]);

    const sendRfq = useCallback(async (id) => {
        try {
            const res = await procurementApi.sendRfq(id);
            if (res.data?.success) {
                toast.success('RFQ sent to vendors');
                await fetchRfqs();
                return true;
            }
        } catch (err) {
            toast.error('Failed to send RFQ');
            return false;
        }
    }, [fetchRfqs]);

    // ---------- Quotations ----------
    const fetchQuotations = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await procurementApi.getQuotations(params);
            setQuotations(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load quotations');
        } finally {
            setLoading(false);
        }
    }, []);

    const acceptQuotation = useCallback(async (id) => {
        try {
            const res = await procurementApi.acceptQuotation(id);
            if (res.data?.success) {
                toast.success('Quotation accepted');
                await fetchQuotations();
                await fetchPurchaseOrders(false); // refresh POs because new PO might be created
                return true;
            }
        } catch (err) {
            toast.error('Failed to accept quotation');
            return false;
        }
    }, [fetchQuotations, fetchPurchaseOrders]);

    const rejectQuotation = useCallback(async (id, reason) => {
        try {
            const res = await procurementApi.rejectQuotation(id, { reason });
            if (res.data?.success) {
                toast.success('Quotation rejected');
                await fetchQuotations();
                return true;
            }
        } catch (err) {
            toast.error('Failed to reject quotation');
            return false;
        }
    }, [fetchQuotations]);


    // ---------- Deliveries ----------
    const fetchDeliveries = useCallback(async () => {
        setLoading(true);
        try {
            // Note: there is no global deliveries endpoint; we fetch each PO's delivery status.
            // For simplicity, we'll fetch all POs with status 'shipped' or 'in_transit'
            const res = await procurementApi.getPurchaseOrders({ status: 'shipped' });
            const shipped = res.data?.data || [];
            const res2 = await procurementApi.getPurchaseOrders({ status: 'in_transit' });
            const intransit = res2.data?.data || [];
            setDeliveries([...shipped, ...intransit]);
        } catch (err) {
            toast.error('Failed to load deliveries');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDeliveryStatus = useCallback(async (poId, data) => {
        try {
            const res = await procurementApi.updateDeliveryStatus(poId, data);
            if (res.data?.success) {
                toast.success('Delivery status updated');
                await fetchDeliveries();
                await fetchPurchaseOrders(false);
                return true;
            }
        } catch (err) {
            toast.error('Failed to update delivery');
            return false;
        }
    }, [fetchDeliveries, fetchPurchaseOrders]);

    const receiveDelivery = useCallback(async (poId, data) => {
        try {
            const res = await procurementApi.receiveDelivery(poId, data);
            if (res.data?.success) {
                toast.success('Delivery received');
                await fetchDeliveries();
                await fetchPurchaseOrders(false);
                return true;
            }
        } catch (err) {
            toast.error('Failed to receive delivery');
            return false;
        }
    }, [fetchDeliveries, fetchPurchaseOrders]);

    // Auto-fetch on mount
    useEffect(() => {
        fetchRfqs();
        fetchQuotations();
        fetchPurchaseOrders();
        fetchDeliveries();
    }, []);

    return {
        loading,
        rfqs,
        quotations,
        purchaseOrders,
        deliveries,
        fetchRfqs,
        createRfq,
        sendRfq,
        fetchQuotations,
        acceptQuotation,
        rejectQuotation,
        fetchPurchaseOrders,
        createPurchaseOrder,
        updatePoStatus,
        fetchDeliveries,
        updateDeliveryStatus,
        receiveDelivery,
    };
};