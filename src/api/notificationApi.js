// src/api/notificationApi.js
// Booking notifications (PDF v2.9): notification history for a booking.
import api from "./axios";

export const notificationApi = {
	history: (bookingId) => api.get(`/notification/history/${bookingId}`),
};
