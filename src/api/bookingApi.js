// src/api/bookingApi.js
import api from './axios';

export const bookingApi = {
    // ==================== BOOKINGS ====================
    // Create booking (admin/PM for client, or client self)
    createBooking: (data) => api.post('/booking', data),
    // Get all bookings (admin/director/PM/accountant)
    getAllBookings: (params) => api.get('/booking', { params }),
    // Get my bookings (client only)
    getMyBookings: () => api.get('/booking/my-bookings'),
    // Get booking by ID
    getBookingById: (id) => api.get(`/booking/${id}`),
    // Update booking status (admin/director/PM)
    updateBookingStatus: (id, data) => api.patch(`/booking/${id}`, data),
    // Cancel booking (admin/director/PM)
    cancelBooking: (id, data) => api.delete(`/booking/${id}`, { data }),
    // Approve pending booking (admin/director)
    approveBooking: (id, data) => api.patch(`/booking/${id}/approve`, data),
    // Reject pending booking (admin/director)
    rejectBooking: (id, data) => api.patch(`/booking/${id}/reject`, data),
    // Get pending booking requests (admin/director)
    getPendingBookings: (params) => api.get('/booking/pending-requests', { params }),

    // ==================== INSTALLMENTS ====================
    // Get installments by booking ID
    getInstallmentsByBooking: (bookingId) => api.get(`/booking/installments/booking/${bookingId}`),
    // Get my installments (client only)
    getMyInstallments: (params) => api.get('/booking/installments/my', { params }),
    // Get installments for a project (admin/PM/director/accountant)
    getProjectInstallments: (projectId, params) => api.get(`/booking/installments/project/${projectId}`, { params }),
    // Get installment summary for a booking
    getInstallmentSummary: (bookingId) => api.get(`/booking/installments/summary/${bookingId}`),
    // Get upcoming installments (client)
    getUpcomingInstallments: (days) => api.get('/booking/installments/upcoming', { params: { days } }),
    // Pay an installment
    payInstallment: (installmentId, data) => api.post(`/booking/installments/${installmentId}/pay`, data),
    // Mark installment as due by milestone (admin/PM)
    markInstallmentDueByMilestone: (data) => api.post('/booking/installments/mark-due', data),
    // Mark overdue installments (admin/director)
    markOverdueInstallments: () => api.post('/booking/installments/mark-overdue'),
    // Create 13 installments from template (admin/PM)
    createInstallmentsFromTemplate: (bookingId, data) => api.post(`/booking/${bookingId}/installments/template`, data),
    // Create custom installments (admin/PM)
    createCustomInstallments: (bookingId, data) => api.post(`/booking/${bookingId}/installments`, data),

    // ==================== AGREEMENT DOCUMENTS ====================
    // Get presigned URL for agreement upload (admin/PM)
    getAgreementPresignedUrl: (bookingId, data) => api.post(`/booking/${bookingId}/agreement/presigned-url`, data),
    // Confirm agreement upload
    confirmAgreementUpload: (bookingId, data) => api.post(`/booking/${bookingId}/agreement/confirm`, data),
};