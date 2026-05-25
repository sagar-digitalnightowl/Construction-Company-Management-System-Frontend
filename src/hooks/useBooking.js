// src/hooks/useBooking.js
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { bookingApi } from '@/api';

export const useBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [myInstallments, setMyInstallments] = useState([]);
    const [installmentSummary, setInstallmentSummary] = useState(null);
    const [upcomingInstallments, setUpcomingInstallments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

    // Fetch all bookings (admin/director/PM/accountant)
    const fetchBookings = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await bookingApi.getAllBookings(params);
            setBookings(res.data?.data?.bookings || []);
            setPagination(res.data?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
        } catch (err) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch my bookings (client)
    const fetchMyBookings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await bookingApi.getMyBookings();
            setMyBookings(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch pending booking requests (admin/director)
    const fetchPendingBookings = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await bookingApi.getPendingBookings(params);
            setPendingBookings(res.data?.data?.bookings || []);
            setPagination(res.data?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
        } catch (err) {
            toast.error('Failed to load pending bookings');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch single booking
    const fetchBookingById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await bookingApi.getBookingById(id);
            setCurrentBooking(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to load booking details');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create booking
    const createBooking = async (data) => {
        setLoading(true);
        try {
            const res = await bookingApi.createBooking(data);
            toast.success('Booking created successfully');
            return res.data?.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Update booking status
    const updateBookingStatus = async (id, data) => {
        setLoading(true);
        try {
            const res = await bookingApi.updateBookingStatus(id, data);
            toast.success('Booking updated');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to update booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Cancel booking
    const cancelBooking = async (id, data) => {
        setLoading(true);
        try {
            const res = await bookingApi.cancelBooking(id, data);
            toast.success('Booking cancelled');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to cancel booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Approve booking
    const approveBooking = async (id, data) => {
        setLoading(true);
        try {
            const res = await bookingApi.approveBooking(id, data);
            toast.success('Booking approved');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to approve booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Reject booking
    const rejectBooking = async (id, data) => {
        setLoading(true);
        try {
            const res = await bookingApi.rejectBooking(id, data);
            toast.success('Booking rejected');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to reject booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fetch installments by booking
    const fetchInstallmentsByBooking = useCallback(async (bookingId) => {
        setLoading(true);
        try {
            const res = await bookingApi.getInstallmentsByBooking(bookingId);
            setInstallments(res.data?.data?.installments || []);
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to load installments');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch my installments (client)
    const fetchMyInstallments = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await bookingApi.getMyInstallments(params);
            setMyInstallments(res.data?.data?.installments || []);
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to load your installments');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch project installments (admin/PM/director/accountant)
    const fetchProjectInstallments = useCallback(async (projectId, params = {}) => {
        setLoading(true);
        try {
            const res = await bookingApi.getProjectInstallments(projectId, params);
            setInstallments(res.data?.data?.installments || []);
            setPagination(res.data?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to load project installments');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch installment summary
    const fetchInstallmentSummary = useCallback(async (bookingId) => {
        setLoading(true);
        try {
            const res = await bookingApi.getInstallmentSummary(bookingId);
            setInstallmentSummary(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to load summary');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch upcoming installments (client)
    const fetchUpcomingInstallments = useCallback(async (days = 30) => {
        setLoading(true);
        try {
            const res = await bookingApi.getUpcomingInstallments(days);
            setUpcomingInstallments(res.data?.data || []);
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to load upcoming installments');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Pay installment
    const payInstallment = async (installmentId, data) => {
        setLoading(true);
        try {
            const res = await bookingApi.payInstallment(installmentId, data);
            toast.success('Payment recorded');
            return res.data?.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Mark installment as due by milestone
    const markInstallmentDue = async (data) => {
        setLoading(true);
        try {
            const res = await bookingApi.markInstallmentDueByMilestone(data);
            toast.success('Installments marked as due');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to mark installments');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Mark overdue installments
    const markOverdueInstallments = async () => {
        setLoading(true);
        try {
            const res = await bookingApi.markOverdueInstallments();
            toast.success('Overdue installments updated');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to mark overdue');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Create installments from template
    const createInstallmentsFromTemplate = async (bookingId, data) => {
        setLoading(true);
        try {
            const res = await bookingApi.createInstallmentsFromTemplate(bookingId, data);
            toast.success('Installments created');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to create installments');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Create custom installments
    const createCustomInstallments = async (bookingId, data) => {
        setLoading(true);
        try {
            const res = await bookingApi.createCustomInstallments(bookingId, data);
            toast.success('Custom installments created');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to create custom installments');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Agreement upload
    const uploadAgreement = async (bookingId, file) => {
        try {
            // Step 1: get presigned URL
            const presignRes = await bookingApi.getAgreementPresignedUrl(bookingId, {
                fileName: file.name,
                mimeType: file.type,
            });
            const { uploadUrl, fileKey, publicUrl } = presignRes.data?.data || {};
            if (uploadUrl) {
                // Step 2: upload to S3
                await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
                // Step 3: confirm upload
                await bookingApi.confirmAgreementUpload(bookingId, { fileKey, documentUrl: publicUrl });
                toast.success('Agreement uploaded');
                return publicUrl;
            }
        } catch (err) {
            toast.error('Failed to upload agreement');
            return null;
        }
    };

    return {
        // Data
        bookings,
        myBookings,
        pendingBookings,
        currentBooking,
        installments,
        myInstallments,
        installmentSummary,
        upcomingInstallments,
        loading,
        pagination,
        // Fetch functions
        fetchBookings,
        fetchMyBookings,
        fetchPendingBookings,
        fetchBookingById,
        fetchInstallmentsByBooking,
        fetchMyInstallments,
        fetchProjectInstallments,
        fetchInstallmentSummary,
        fetchUpcomingInstallments,
        // Mutations
        createBooking,
        updateBookingStatus,
        cancelBooking,
        approveBooking,
        rejectBooking,
        payInstallment,
        markInstallmentDue,
        markOverdueInstallments,
        createInstallmentsFromTemplate,
        createCustomInstallments,
        uploadAgreement,
    };
};