 import api from "./axios";

export const authApi = {
    login: (data) => api.post("/auth/login", data),

    getProfile: () => api.get("/auth/profile"),

    updateProfile: (data) => api.patch("/auth/profile", data),

    logout: () => api.post("/auth/logout"),

    refreshToken: () => api.post("/auth/refresh-token"),

    forgotPassword: (data) => api.post("/auth/forgot-password", data),

    // Yahan params add kiye hain for pagination, search, etc.
    getUsers: (params) => api.get("/auth/users", { params }),

    registerUser: (data) => api.post("/auth/register", data),

    verifyOtp: (data) => api.post("/auth/verify-otp", data),

    getPresignedUrl: (data) => api.post("/auth/upload/presigned-url", data),

    confirmUpload: (data) => api.post("/auth/upload/confirm", data),
};