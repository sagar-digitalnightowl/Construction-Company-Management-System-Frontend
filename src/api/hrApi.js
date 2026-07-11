// 
// src/api/hrApi.ts

// import api from "./axios";

// export const hrApi = {
//     // ==================== EMPLOYEES ====================
//     createEmployee: (data) => api.post("/hr/employees", data),
    
//     // New API to create employee
//     getPresignedUrl: (data) => api.post("/auth/upload/presigned-url", data),
//     confirmUpload: (data) => api.post("/auth/upload/confirm", data),
//     registerEmployee: (data) => api.post("/auth/register", data),
//     // after successful registration verify otp
//     verifyOtp: (data) => api.post("/auth/verify-otp", data),

//     updateEmployee: (id, data) => api.patch(`/auth/users/${id}`, data),

//     getAllEmployees: (params) => api.get("/hr/employees", { params }),
//     getEmployeeById: (id) => api.get(`/hr/employees/${id}`),
//     deleteEmployee: (id) => api.delete(`/hr/employees/${id}`),

//     // delete user
//     deleteUser: (userId) => api.delete(`/auth/users/${userId}`),

//     getEmployeeStats: () => api.get("/hr/employees/stats"),

//     // ==================== DEPARTMENTS ====================
//     createDepartment: (data) => api.post("/hr/departments", data),
//     getAllDepartments: () => api.get("/hr/departments"),
//     getDepartmentById: (id) => api.get(`/hr/departments/${id}`),
//     updateDepartment: (id, data) => api.put(`/hr/departments/${id}`, data),
//     deleteDepartment: (id) => api.delete(`/hr/departments/${id}`),
//     getEmployeesByDepartment: (departmentId, params) =>
//         api.get(`/hr/departments/${departmentId}/employees`, { params }),
//     getDepartmentsWithEmployeeCount: () =>
//         api.get("/hr/departments/with-employee-count"),

//     // ==================== ATTENDANCE ====================
//     checkIn: () => api.post("/hr/attendance/check-in"),
//     checkOut: () => api.post("/hr/attendance/check-out"),
//     getMyAttendance: (params) => api.get("/hr/attendance/my", { params }),
//     getAllAttendance: (params) => api.get("/hr/attendance", { params }),
//     getAttendanceStats: () => api.get("/hr/attendance/stats"),
//     getTodayAttendanceAnalytics: () =>
//         api.get("/hr/attendance/today-analytics"),
//     filterAttendance: (data) => api.post("/hr/attendance/filter", data),
//     getMonthlyAttendanceReport: (data) =>
//         api.post("/hr/attendance/monthly-report", data),
//     getEmployeeAttendanceById: (employeeId, params) =>
//         api.get(`/hr/attendance/employee/${employeeId}`, { params }),

//     // ==================== SALARY & PAYROLL ====================
//     // Individual Salary Slip
//     generateSalarySlip: (data) => api.post("/hr/salary/generate", data),
//     generateBulkSalarySlips: (data) =>
//         api.post("/hr/salary/bulk-generate", data),
//     getMySalarySlips: () => api.get("/hr/salary/my-slips"),
//     getEmployeeAllSalarySlips: (employeeId) =>
//         api.get(`/hr/salary/employee/${employeeId}`),
//     getSalarySlipById: (id) => api.get(`/hr/salary/${id}`),
//     updateSalarySlipStatus: (id, data) =>
//         api.put(`/hr/salary/${id}/status`, data),

//     // ✅ NEW: Get All Salary Slips (Paginated) - MISSING IN YOUR FILE
//     getAllSalarySlips: (params) => 
//         api.get("/hr/salary/all", { params }),

//     // ✅ NEW: Download Salary Slip PDF - MISSING IN YOUR FILE
//     downloadSalarySlipPdf: (slipId) => 
//         api.get(`/hr/salary/${slipId}/pdf`, { responseType: "blob" }),

//     // ==================== PAYROLL APPROVAL WORKFLOW ====================
//     // Download generated Excel report (blob is important for file download)
//     downloadSalaryReport: (params) => 
//         api.get("/hr/salary/report", { params, responseType: "blob" }),
    
//     // Submit payroll batch to Finance for approval
//     submitPayrollForApproval: (data) => 
//         api.post("/hr/salary/report/submit-for-approval", data),
        
//     // Get HR's own submission history/batches
//     getMyPayrollBatches: (params) => 
//         api.get("/hr/salary/report/my-batches", { params }),

//     // ==================== LEAVES ====================
//     applyLeave: (data) => api.post("/hr/leaves", data),
//     getAllLeaves: (params) => api.get("/hr/leaves", { params }),
//     getMyLeaves: (params) => api.get("/hr/leaves/my", { params }),
//     processLeave: (id, data) => api.put(`/hr/leaves/${id}/process`, data),
//     getMyLeaveBalance: () => api.get("/hr/leaves/balance"),
//     getEmployeeLeaveBalance: (employeeId) =>
//         api.get(`/hr/leaves/balance/${employeeId}`),

//     // ==================== SHIFTS ====================
//     createShift: (data) => api.post("/hr/shifts", data),
//     getAllShifts: () => api.get("/hr/shifts"),
//     getShiftById: (id) => api.get(`/hr/shifts/${id}`),
//     updateShift: (id, data) => api.put(`/hr/shifts/${id}`, data),
//     deleteShift: (id) => api.delete(`/hr/shifts/${id}`),
//     assignShiftToEmployee: (data) => api.post("/hr/shifts/assign", data),
//     getEmployeeCurrentShift: (employeeId) =>
//         api.get(`/hr/shifts/employee/${employeeId}`),

//     // ==================== LABOR ====================
//     createLabor: (data) => api.post("/hr/labors", data),
//     getAllLabors: (params) => api.get("/hr/labors", { params }),
//     getLaborById: (id) => api.get(`/hr/labors/${id}`),
//     updateLabor: (id, data) => api.put(`/hr/labors/${id}`, data),
//     deleteLabor: (id) => api.delete(`/hr/labors/${id}`),
//     getLaborStats: () => api.get("/hr/labors/stats"),

//     // ==================== LABOR WAGES ====================
//     createLaborWage: (data) => api.post("/hr/labor-wages", data),
//     getAllLaborWages: (params) => api.get("/hr/labor-wages", { params }),
//     getLaborWageById: (id) => api.get(`/hr/labor-wages/${id}`),
//     updateLaborWage: (id, data) => api.put(`/hr/labor-wages/${id}`, data),
//     deleteLaborWage: (id) => api.delete(`/hr/labor-wages/${id}`),

//     // ==================== LABOR ATTENDANCE ====================
//     markLaborAttendance: (data) => api.post("/hr/labor-attendance", data),
//     markBulkLaborAttendance: (data) =>
//         api.post("/hr/labor-attendance/bulk", data),
//     getLaborAttendance: (params) => api.get("/hr/labor-attendance", { params }),
//     getLaborAttendanceSummary: (laborId, params) =>
//         api.get(`/hr/labor-attendance/summary/${laborId}`, { params }),
//     getDailyLaborAttendance: (date, params) =>
//         api.get(`/hr/labor-attendance/daily/${date}`, { params }),

//     // ==================== ANNOUNCEMENTS ====================
//     createAnnouncement: (data) => api.post("/hr/announcements", data),
//     getAllAnnouncements: () => api.get("/hr/announcements"),
// };




// import api from "./axios";

// export const hrApi = {
//     // ==================== EMPLOYEES ====================
//     createEmployee: (data) => api.post("/hr/employees", data),
    
//     // New API to create employee
//     getPresignedUrl: (data) => api.post("/auth/upload/presigned-url", data),
//     confirmUpload: (data) => api.post("/auth/upload/confirm", data),
//     registerEmployee: (data) => api.post("/auth/register", data),
//     // after successful registration verify otp
//     verifyOtp: (data) => api.post("/auth/verify-otp", data),

//     updateEmployee: (id, data) => api.patch(`/auth/users/${id}`, data),

//     getAllEmployees: (params) => api.get("/hr/employees", { params }),
//     getEmployeeById: (id) => api.get(`/hr/employees/${id}`),
//     deleteEmployee: (id) => api.delete(`/hr/employees/${id}`),

//     // delete user
//     deleteUser: (userId) => api.delete(`/auth/users/${userId}`),

//     getEmployeeStats: () => api.get("/hr/employees/stats"),

//     // ==================== DEPARTMENTS ====================
//     createDepartment: (data) => api.post("/hr/departments", data),
//     getAllDepartments: () => api.get("/hr/departments"),
//     getDepartmentById: (id) => api.get(`/hr/departments/${id}`),
//     updateDepartment: (id, data) => api.put(`/hr/departments/${id}`, data),
//     deleteDepartment: (id) => api.delete(`/hr/departments/${id}`),
//     getEmployeesByDepartment: (departmentId, params) =>
//         api.get(`/hr/departments/${departmentId}/employees`, { params }),
//     getDepartmentsWithEmployeeCount: () =>
//         api.get("/hr/departments/with-employee-count"),

//     // ==================== ATTENDANCE ====================
//     checkIn: () => api.post("/hr/attendance/check-in"),
//     checkOut: () => api.post("/hr/attendance/check-out"),
//     getMyAttendance: (params) => api.get("/hr/attendance/my", { params }),
//     getAllAttendance: (params) => api.get("/hr/attendance", { params }),
//     getAttendanceStats: () => api.get("/hr/attendance/stats"),
//     getTodayAttendanceAnalytics: () =>
//         api.get("/hr/attendance/today-analytics"),
//     filterAttendance: (data) => api.post("/hr/attendance/filter", data),
//     getMonthlyAttendanceReport: (data) =>
//         api.post("/hr/attendance/monthly-report", data),
//     getEmployeeAttendanceById: (employeeId, params) =>
//         api.get(`/hr/attendance/employee/${employeeId}`, { params }),

//     // ==================== SALARY & PAYROLL ====================
//     // Individual Salary Slip
//     generateSalarySlip: (data) => api.post("/hr/salary/generate", data),
//     generateBulkSalarySlips: (data) =>
//         api.post("/hr/salary/bulk-generate", data),
//     getMySalarySlips: () => api.get("/hr/salary/my-slips"),
//     getEmployeeAllSalarySlips: (employeeId) =>
//         api.get(`/hr/salary/employee/${employeeId}`),
//     getSalarySlipById: (id) => api.get(`/hr/salary/${id}`),
//     updateSalarySlipStatus: (id, data) =>
//         api.put(`/hr/salary/${id}/status`, data),

//     // ✅ NEW: Get All Salary Slips (Paginated)
//     getAllSalarySlips: (params) => 
//         api.get("/hr/salary/all", { params }),

//     // ✅ NEW: Download Salary Slip PDF
//     downloadSalarySlipPdf: (slipId) => 
//         api.get(`/hr/salary/${slipId}/pdf`, { responseType: "blob" }),

//     // ==================== PAYROLL APPROVAL WORKFLOW ====================
//     // Download generated Excel report (blob is important for file download)
//     downloadSalaryReport: (params) => 
//         api.get("/hr/salary/report", { params, responseType: "blob" }),
    
//     // Submit payroll batch to Finance for approval
//     submitPayrollForApproval: (data) => 
//         api.post("/hr/salary/report/submit-for-approval", data),
        
//     // Get HR's own submission history/batches
//     getMyPayrollBatches: (params) => 
//         api.get("/hr/salary/report/my-batches", { params }),

//     // ==================== LEAVES ====================
//     applyLeave: (data) => api.post("/hr/leaves", data),
//     getAllLeaves: (params) => api.get("/hr/leaves", { params }),
//     getMyLeaves: (params) => api.get("/hr/leaves/my", { params }),
//     processLeave: (id, data) => api.put(`/hr/leaves/${id}/process`, data),
//     getMyLeaveBalance: () => api.get("/hr/leaves/balance"),
//     getEmployeeLeaveBalance: (employeeId) =>
//         api.get(`/hr/leaves/balance/${employeeId}`),

//     // ==================== SHIFTS ====================
//     createShift: (data) => api.post("/hr/shifts", data),
//     getAllShifts: () => api.get("/hr/shifts"),
//     getShiftById: (id) => api.get(`/hr/shifts/${id}`),
//     updateShift: (id, data) => api.put(`/hr/shifts/${id}`, data),
//     deleteShift: (id) => api.delete(`/hr/shifts/${id}`),
//     assignShiftToEmployee: (data) => api.post("/hr/shifts/assign", data),
//     getEmployeeCurrentShift: (employeeId) =>
//         api.get(`/hr/shifts/employee/${employeeId}`),

//     // ==================== LABOR ====================
//     createLabor: (data) => api.post("/hr/labors", data),
//     getAllLabors: (params) => api.get("/hr/labors", { params }),
//     getLaborById: (id) => api.get(`/hr/labors/${id}`),
//     updateLabor: (id, data) => api.put(`/hr/labors/${id}`, data),
//     deleteLabor: (id) => api.delete(`/hr/labors/${id}`),
//     getLaborStats: () => api.get("/hr/labors/stats"),

//     // ==================== LABOR WAGES ====================
//     createLaborWage: (data) => api.post("/hr/labor-wages", data),
//     getAllLaborWages: (params) => api.get("/hr/labor-wages", { params }),
//     getLaborWageById: (id) => api.get(`/hr/labor-wages/${id}`),
//     updateLaborWage: (id, data) => api.put(`/hr/labor-wages/${id}`, data),
//     deleteLaborWage: (id) => api.delete(`/hr/labor-wages/${id}`),

//     // ==================== LABOR ATTENDANCE ====================
//     markLaborAttendance: (data) => api.post("/hr/labor-attendance", data),
//     markBulkLaborAttendance: (data) =>
//         api.post("/hr/labor-attendance/bulk", data),
//     getLaborAttendance: (params) => api.get("/hr/labor-attendance", { params }),
//     getLaborAttendanceSummary: (laborId, params) =>
//         api.get(`/hr/labor-attendance/summary/${laborId}`, { params }),
//     getDailyLaborAttendance: (date, params) =>
//         api.get(`/hr/labor-attendance/daily/${date}`, { params }),

//     // ==================== ANNOUNCEMENTS ====================
//     createAnnouncement: (data) => api.post("/hr/announcements", data),
//     getAllAnnouncements: () => api.get("/hr/announcements"),

//     // ==================== EXPENSES (NEW TICKETING SYSTEM) ====================
    
//     // 🚀 POST: Ticket Raise Karna (Accepts FormData: title, category, description, amount, proof)
//     createExpense: (data) => api.post("/hr/expenses", data),
    
//     // 👤 GET: Apne Tickets Dekhna (Accepts params: { status, page, limit })
//     getMyExpenses: (params) => api.get("/hr/expenses/my", { params }),
    
//     // 👁️ GET: Sab Tickets Dekhna (Accepts params: { status, category, employeeId, page, limit })
//     getAllExpenses: (params) => api.get("/hr/expenses", { params }),
    
//     // 📄 GET: Single Ticket Detail
//     getExpenseById: (id) => api.get(`/hr/expenses/${id}`),
    
//     // ✅ PUT: Ticket Approve Karna (Accepts body: { remarks })
//     approveExpense: (id, data) => api.put(`/hr/expenses/${id}/approve`, data),
    
//     // ❌ PUT: Ticket Reject Karna (Accepts body: { reason })
//     rejectExpense: (id, data) => api.put(`/hr/expenses/${id}/reject`, data),
    
//     // 💰 PUT: Instant Payment by Finance (Accepts body: { paymentMethod, paymentReference, remarks })
//     payExpense: (id, data) => api.put(`/hr/expenses/${id}/pay`, data),
// };




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

    // ✅ NEW: Get All Salary Slips (Paginated)
    getAllSalarySlips: (params) => 
        api.get("/hr/salary/all", { params }),

    // ✅ NEW: Download Salary Slip PDF
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

    // ==================== EXPENSES (TICKETING SYSTEM WITH PAGINATION) ====================
    
    /**
     * 🚀 Create a new expense ticket
     * @param {FormData} data - FormData containing: title, category, description, amount, proof
     * @returns {Promise} API response
     * 
     * Usage:
     * const formData = new FormData();
     * formData.append('title', 'Fuel for site visit');
     * formData.append('category', 'Fuel');
     * formData.append('description', 'Fuel expenses for project site visit');
     * formData.append('amount', '1500');
     * formData.append('proof', fileObject);
     * await hrApi.createExpense(formData);
     */
    createExpense: (data) => api.post("/hr/expenses", data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    
    /**
     * 👤 Get current user's expenses with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {string} params.status - Filter by status (Pending, Approved, Rejected, Paid)
     * @param {string} params.search - Search by title or employee name (server-side filtering)
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 10)
     * @returns {Promise} API response with paginated expenses
     * 
     * Response Structure:
     * {
     *   success: true,
     *   data: {
     *     tickets: [...],      // Array of expense tickets
     *     pagination: {
     *       page: 1,
     *       limit: 10,
     *       total: 50,
     *       pages: 5
     *     }
     *   }
     * }
     * 
     * Usage:
     * // Get first page, 10 items, PENDING status
     * await hrApi.getMyExpenses({
     *     page: 1,
     *     limit: 10,
     *     status: 'Pending'
     * });
     * 
     * // Search by title or employee name
     * await hrApi.getMyExpenses({
     *     search: 'Shashi',
     *     status: 'Pending'
     * });
     */
    getMyExpenses: (params) => api.get("/hr/expenses/my", { params }),
    
    /**
     * 👁️ Get all expenses (Admin/HR/Finance) with pagination and filters
     * @param {Object} params - Query parameters
     * @param {string} params.status - Filter by status (Pending, Approved, Rejected, Paid)
     * @param {string} params.category - Filter by category (Fuel, Travel, Food, etc.)
     * @param {string} params.employeeId - Filter by specific employee ID
     * @param {string} params.search - Search by title or employee name (server-side filtering)
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 10)
     * @returns {Promise} API response with paginated expenses
     * 
     * Response Structure:
     * {
     *   success: true,
     *   data: {
     *     tickets: [...],      // Array of expense tickets
     *     pagination: {
     *       page: 1,
     *       limit: 10,
     *       total: 50,
     *       pages: 5
     *     }
     *   }
     * }
     * 
     * Usage:
     * await hrApi.getAllExpenses({
     *     page: 1,
     *     limit: 20,
     *     status: 'Pending',
     *     category: 'Travel',
     *     search: 'Shashi'
     * });
     */
    getAllExpenses: (params) => api.get("/hr/expenses", { params }),
    
    /**
     * 📄 Get single expense ticket details
     * @param {string} id - Expense ID
     * @returns {Promise} API response with expense details
     * 
     * Response Structure:
     * {
     *   success: true,
     *   data: {
     *     _id: "...",
     *     ticketNumber: "EXP-20260711-6041",
     *     employeeId: {...},
     *     title: "...",
     *     category: "Fuel",
     *     description: "...",
     *     amount: 500,
     *     proofUrl: "...",
     *     status: "Pending",
     *     // ... other fields
     *   }
     * }
     */
    getExpenseById: (id) => api.get(`/hr/expenses/${id}`),
    
    /**
     * ✅ Approve an expense ticket (HR role)
     * @param {string} id - Expense ID
     * @param {Object} data - Approval data
     * @param {string} data.remarks - Approval remarks (optional)
     * @returns {Promise} API response
     * 
     * Usage:
     * await hrApi.approveExpense('expense_id', { 
     *     remarks: 'Approved for reimbursement' 
     * });
     */
    approveExpense: (id, data) => api.put(`/hr/expenses/${id}/approve`, data),
    
    /**
     * ❌ Reject an expense ticket (HR role)
     * @param {string} id - Expense ID
     * @param {Object} data - Rejection data
     * @param {string} data.reason - Reason for rejection (required)
     * @returns {Promise} API response
     * 
     * Usage:
     * await hrApi.rejectExpense('expense_id', { 
     *     reason: 'Invalid receipt - amount mismatch' 
     * });
     */
    rejectExpense: (id, data) => api.put(`/hr/expenses/${id}/reject`, data),
    
    /**
     * 💰 Mark expense as paid (Finance role)
     * @param {string} id - Expense ID
     * @param {Object} data - Payment data
     * @param {string} data.paymentMethod - Payment method (UPI, Bank Transfer, Cheque, Cash, NEFT)
     * @param {string} data.paymentReference - Payment reference/transaction ID (required)
     * @param {string} data.remarks - Payment remarks (optional)
     * @returns {Promise} API response
     * 
     * Usage:
     * await hrApi.payExpense('expense_id', {
     *     paymentMethod: 'Bank Transfer',
     *     paymentReference: 'TRX123456',
     *     remarks: 'Payment processed successfully'
     * });
     */
    payExpense: (id, data) => api.put(`/hr/expenses/${id}/pay`, data),
};