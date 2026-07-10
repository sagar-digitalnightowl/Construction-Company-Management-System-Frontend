import { useState, useCallback } from "react";
import { toast } from "sonner";
import { propertyInventoryApi } from "@/api/propertyInventoryApi";

export const usePropertyInventory = () => {
    const [dashboardData, setDashboardData] = useState({
        projectStats: {},
        projects: [],
        leads: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    });
    
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectBookings, setProjectBookings] = useState([]);
    
    // Naya state bookings ki pagination ke liye
    const [bookingsPagination, setBookingsPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    
    const [projectAgreements, setProjectAgreements] = useState([]);
    const [siteEngineers, setSiteEngineers] = useState([]);
    const [bookingPayment, setBookingPayment] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch dashboard with optional filters/pagination
    const fetchDashboard = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await propertyInventoryApi.getDashboard(params);
            const data = res.data?.data || res.data || {};
            setDashboardData({
                projectStats: data.projectStats || {},
                projects: data.projects || [],
                leads: data.leads || [],
                pagination: data.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
            });
        } catch (err) {
            console.log("Error : ", err)
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch single project details (full inventory)
    const fetchProjectDetails = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await propertyInventoryApi.getProjectById(id);
            setSelectedProject(res.data?.data || res.data);
            return res.data?.data || res.data;
        } catch (err) {
            toast.error("Failed to load project details");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch bookings list for a project (Updated for pagination)
    const fetchProjectBookings = useCallback(async (id, params = { page: 1, limit: 10 }) => {
        setLoading(true);
        try {
            const res = await propertyInventoryApi.getProjectBookings(id, params);
            setProjectBookings(res.data?.data || []);
            
            // Backend se aane wale pagination data ko state mein set karein
            if (res.data?.pagination) {
                setBookingsPagination(res.data.pagination);
            }
        } catch (err) {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch agreements for a project
    const fetchProjectAgreements = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await propertyInventoryApi.getProjectAgreements(id);
            setProjectAgreements(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to load agreements");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch site engineers for a project
    const fetchSiteEngineers = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await propertyInventoryApi.getProjectSiteEngineers(id);
            setSiteEngineers(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to load site engineers");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch payment details for a booking
    const fetchBookingPaymentDetails = useCallback(async (bookingId) => {
        setLoading(true);
        try {
            const res = await propertyInventoryApi.getBookingPaymentDetails(bookingId);
            const data = res.data?.data || res.data;
            setBookingPayment(data);
            return data;
        } catch (err) {
            toast.error("Failed to load payment details");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Export to Excel (triggers file download)
    const exportInventory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await propertyInventoryApi.exportInventory();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "property_inventory.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Export started");
        } catch (err) {
            toast.error("Export failed");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        dashboardData,
        selectedProject,
        projectBookings,
        bookingsPagination, // Updated: Returned the new pagination state
        projectAgreements,
        siteEngineers,
        bookingPayment,
        loading,
        fetchDashboard,
        fetchProjectDetails,
        fetchProjectBookings, // Updated function
        fetchProjectAgreements,
        fetchSiteEngineers,
        fetchBookingPaymentDetails,
        exportInventory,
    };
};