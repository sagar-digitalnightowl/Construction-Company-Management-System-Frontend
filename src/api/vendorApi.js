import api from './axios';

export const vendorApi = {
    getAll: () => api.get('/auth/users?role=vendor'), 
    getById: (id) => api.get(`/auth/users/${id}`),
};