// 
// src/api/hrApi.ts

import api from "./axios";

export const hrApi = {
    // ==================== EMPLOYEES ====================
    createEmployee: (data) => api.post("/hr/employees", data),
    
    // New API to create employee
    getPresignedUrl: (data) => api.post("/auth/upload/presigned-url", data),
    confirmUpload: (data) => api.post("/auth/upload/confirm", data),
    registerEmployee: (data) => api.post("/auth/register", data),
    // after successful registration verify otp
    verifyOtp: (data) => api.post("/auth/verify-otp", data),

    updateEmployee: (id, data) => api.patch(`/auth/users/${id}`, data),

    getAllEmployees: (params) => api.get("/hr/employees", { params }),
    getEmployeeById: (id) => api.get(`/hr/employees/${id}`),
    deleteEmployee: (id) => api.delete(`/hr/employees/${id}`),

    // delete user
    deleteUser: (userId) => api.delete(`/auth/users/${userId}`),

    getEmployeeStats: () => api.get("/hr/employees/stats"),

    // ==================== DEPARTMENTS ====================
    createDepartment: (data) => api.post("/hr/departments", data),
    getAllDepartments: () => api.get("/hr/departments"),
    getDepartmentById: (id) => api.get(`/hr/departments/${id}`),
    updateDepartment: (id, data) => api.put(`/hr/departments/${id}`, data),
    deleteDepartment: (id) => api.delete(`/hr/departments/${id}`),
    getEmployeesByDepartment: (departmentId, params) =>
        api.get(`/hr/departments/${departmentId}/employees`, { params }),
    getDepartmentsWithEmployeeCount: () =>
        api.get("/hr/departments/with-employee-count"),

    // ==================== ATTENDANCE ====================
    checkIn: () => api.post("/hr/attendance/check-in"),
    checkOut: () => api.post("/hr/attendance/check-out"),
    getMyAttendance: (params) => api.get("/hr/attendance/my", { params }),
    getAllAttendance: (params) => api.get("/hr/attendance", { params }),
    getAttendanceStats: () => api.get("/hr/attendance/stats"),
    getTodayAttendanceAnalytics: () =>
        api.get("/hr/attendance/today-analytics"),
    filterAttendance: (data) => api.post("/hr/attendance/filter", data),
    getMonthlyAttendanceReport: (data) =>
        api.post("/hr/attendance/monthly-report", data),
    getEmployeeAttendanceById: (employeeId, params) =>
        api.get(`/hr/attendance/employee/${employeeId}`, { params }),

    // ==================== SALARY & PAYROLL ====================
    // Individual Salary Slip
    generateSalarySlip: (data) => api.post("/hr/salary/generate", data),
    generateBulkSalarySlips: (data) =>
        api.post("/hr/salary/bulk-generate", data),
    getMySalarySlips: () => api.get("/hr/salary/my-slips"),
    getEmployeeAllSalarySlips: (employeeId) =>
        api.get(`/hr/salary/employee/${employeeId}`),
    getSalarySlipById: (id) => api.get(`/hr/salary/${id}`),
    updateSalarySlipStatus: (id, data) =>
        api.put(`/hr/salary/${id}/status`, data),

    // ✅ NEW: Get All Salary Slips (Paginated) - MISSING IN YOUR FILE
    getAllSalarySlips: (params) => 
        api.get("/hr/salary/all", { params }),

    // ✅ NEW: Download Salary Slip PDF - MISSING IN YOUR FILE
    downloadSalarySlipPdf: (slipId) => 
        api.get(`/hr/salary/${slipId}/pdf`, { responseType: "blob" }),

    // ==================== PAYROLL APPROVAL WORKFLOW ====================
    // Download generated Excel report (blob is important for file download)
    downloadSalaryReport: (params) => 
        api.get("/hr/salary/report", { params, responseType: "blob" }),
    
    // Submit payroll batch to Finance for approval
    submitPayrollForApproval: (data) => 
        api.post("/hr/salary/report/submit-for-approval", data),
        
    // Get HR's own submission history/batches
    getMyPayrollBatches: (params) => 
        api.get("/hr/salary/report/my-batches", { params }),

    // ==================== LEAVES ====================
    applyLeave: (data) => api.post("/hr/leaves", data),
    getAllLeaves: (params) => api.get("/hr/leaves", { params }),
    getMyLeaves: (params) => api.get("/hr/leaves/my", { params }),
    processLeave: (id, data) => api.put(`/hr/leaves/${id}/process`, data),
    getMyLeaveBalance: () => api.get("/hr/leaves/balance"),
    getEmployeeLeaveBalance: (employeeId) =>
        api.get(`/hr/leaves/balance/${employeeId}`),

    // ==================== SHIFTS ====================
    createShift: (data) => api.post("/hr/shifts", data),
    getAllShifts: () => api.get("/hr/shifts"),
    getShiftById: (id) => api.get(`/hr/shifts/${id}`),
    updateShift: (id, data) => api.put(`/hr/shifts/${id}`, data),
    deleteShift: (id) => api.delete(`/hr/shifts/${id}`),
    assignShiftToEmployee: (data) => api.post("/hr/shifts/assign", data),
    getEmployeeCurrentShift: (employeeId) =>
        api.get(`/hr/shifts/employee/${employeeId}`),

    // ==================== LABOR ====================
    createLabor: (data) => api.post("/hr/labors", data),
    getAllLabors: (params) => api.get("/hr/labors", { params }),
    getLaborById: (id) => api.get(`/hr/labors/${id}`),
    updateLabor: (id, data) => api.put(`/hr/labors/${id}`, data),
    deleteLabor: (id) => api.delete(`/hr/labors/${id}`),
    getLaborStats: () => api.get("/hr/labors/stats"),

    // ==================== LABOR WAGES ====================
    createLaborWage: (data) => api.post("/hr/labor-wages", data),
    getAllLaborWages: (params) => api.get("/hr/labor-wages", { params }),
    getLaborWageById: (id) => api.get(`/hr/labor-wages/${id}`),
    updateLaborWage: (id, data) => api.put(`/hr/labor-wages/${id}`, data),
    deleteLaborWage: (id) => api.delete(`/hr/labor-wages/${id}`),

    // ==================== LABOR ATTENDANCE ====================
    markLaborAttendance: (data) => api.post("/hr/labor-attendance", data),
    markBulkLaborAttendance: (data) =>
        api.post("/hr/labor-attendance/bulk", data),
    getLaborAttendance: (params) => api.get("/hr/labor-attendance", { params }),
    getLaborAttendanceSummary: (laborId, params) =>
        api.get(`/hr/labor-attendance/summary/${laborId}`, { params }),
    getDailyLaborAttendance: (date, params) =>
        api.get(`/hr/labor-attendance/daily/${date}`, { params }),

    // ==================== ANNOUNCEMENTS ====================
    createAnnouncement: (data) => api.post("/hr/announcements", data),
    getAllAnnouncements: () => api.get("/hr/announcements"),
};