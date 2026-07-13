//  import api from "./axios";

// export const authApi = {
//     login: (data) => api.post("/auth/login", data),

//     getProfile: () => api.get("/auth/profile"),

//     updateProfile: (data) => api.patch("/auth/profile", data),

//     logout: () => api.post("/auth/logout"),

//     refreshToken: () => api.post("/auth/refresh-token"),

//     forgotPassword: (data) => api.post("/auth/forgot-password", data),

//     // Yahan params add kiye hain for pagination, search, etc.
//     getUsers: (params) => api.get("/auth/users", { params }),

//     registerUser: (data) => api.post("/auth/register", data),

//     verifyOtp: (data) => api.post("/auth/verify-otp", data),

//     getPresignedUrl: (data) => api.post("/auth/upload/presigned-url", data),

//     confirmUpload: (data) => api.post("/auth/upload/confirm", data),
// };





// src/api/authApi.js

import api from "./axios";

export const authApi = {
    // ─── AUTHENTICATION ───
    
    login: (data) => api.post("/auth/login", {
        identifier: data.identifier,
        password: data.password,
        deviceInfo: {
            deviceId: data.deviceInfo?.deviceId || "web-" + Date.now(),
            deviceName: data.deviceInfo?.deviceName || "Web Browser",
            deviceType: data.deviceInfo?.deviceType || "web",
            browser: data.deviceInfo?.browser || navigator.userAgent,
            os: data.deviceInfo?.os || navigator.platform,
        }
    }),

    logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),

    logoutAll: () => api.post("/auth/logout-all"),

    refreshToken: (refreshToken) => api.post("/auth/refresh-token", { refreshToken }),

    // ─── USER PROFILE ───

    getProfile: () => api.get("/auth/profile"),

    updateProfile: (data) => api.patch("/auth/profile", data),

    changePassword: (data) => api.patch("/auth/change-password", data),

    // ─── OTP & VERIFICATION ───

    verifyOtp: (data) => api.post("/auth/verify-otp", data),

    resendOtp: (identifier, type) => api.post("/auth/resend-otp", { identifier, type }),

    getVerificationStatus: (userId) => api.get("/auth/verification-status", { params: { userId } }),

    // ─── PASSWORD RESET ───

    forgotPassword: (data) => api.post("/auth/forgot-password", data),

    resetPassword: (data) => api.post("/auth/reset-password", data),

    // ─── USER MANAGEMENT (Admin Only) ───

    getUsers: (params) => api.get("/auth/users", { params }),

    getUserById: (userId) => api.get(`/auth/users/${userId}`),

    registerUser: (data) => {
        // data can contain: email, phone, password, name, role, department, 
        // employeeId, personalDetails, bankDetails, jobDetails, workExperience,
        // profileImageKey, tenthMarksheetKey, twelfthMarksheetKey, 
        // graduationCertKey, postGraduationCertKey, aadharCardKey, panCardKey
        return api.post("/auth/register", data);
    },

    updateUser: (userId, data) => api.patch(`/auth/users/${userId}`, data),

    updateUserRole: (userId, role) => api.patch(`/auth/users/${userId}/role`, { role }),

    deleteUser: (userId) => api.delete(`/auth/users/${userId}`),

    // ─── EMPLOYEE DOCUMENT UPLOAD ───

    uploadDocument: (employeeId, documentType, fileKey) => 
        api.post("/auth/upload-document", { employeeId, documentType, fileKey }),

    // ─── SESSIONS ───

    getSessions: () => api.get("/auth/sessions"),

    revokeSession: (sessionId) => api.delete(`/auth/sessions/${sessionId}`),

    // ─── PRESIGNED URL UPLOAD (UPDATED ENDPOINTS) ───

    getPresignedUrl: (data) => {
        // data: { fileName, fileType, mimeType, associatedId? }
        return api.post("/auth/presigned-url", data);
    },

    confirmUpload: (data) => {
        // data: { fileKey, fileType }
        return api.post("/auth/confirm-upload", data);
    },
};