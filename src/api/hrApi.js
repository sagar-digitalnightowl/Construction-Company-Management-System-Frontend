// import api from "./axios";

// export const hrApi = {
// 	// ==================== EMPLOYEES ====================
// 	createEmployee: (data) => api.post("/hr/employees", data),

// 	// ─── PRESIGNED URL UPLOAD (UPDATED ENDPOINTS) ───
// 	getPresignedUrl: (data) => api.post("/auth/presigned-url", data),
// 	confirmUpload: (data) => api.post("/auth/confirm-upload", data),

// 	// ─── EMPLOYEE REGISTRATION & VERIFICATION ───
// 	registerEmployee: (data) => api.post("/auth/register", data),
// 	verifyOtp: (data) => api.post("/auth/verify-otp", data),

// 	updateEmployee: (id, data) => api.patch(`/auth/users/${id}`, data),

// 	getAllEmployees: (params) => api.get("/hr/employees", { params }),
// 	getEmployeeById: (id) => api.get(`/hr/employees/${id}`),
// 	deleteEmployee: (id) => api.delete(`/hr/employees/${id}`),

// 	// Delete user (soft delete)
// 	deleteUser: (userId) => api.delete(`/auth/users/${userId}`),

// 	getEmployeeStats: () => api.get("/hr/employees/stats"),

// 	// ==================== DEPARTMENTS ====================
// 	createDepartment: (data) => api.post("/hr/departments", data),
// 	getAllDepartments: () => api.get("/hr/departments"),
// 	getDepartmentById: (id) => api.get(`/hr/departments/${id}`),
// 	updateDepartment: (id, data) => api.put(`/hr/departments/${id}`, data),
// 	deleteDepartment: (id) => api.delete(`/hr/departments/${id}`),
// 	getEmployeesByDepartment: (departmentId, params) =>
// 		api.get(`/hr/departments/${departmentId}/employees`, { params }),
// 	getDepartmentsWithEmployeeCount: () =>
// 		api.get("/hr/departments/with-employee-count"),

// 	// ==================== ATTENDANCE ====================
// 	checkIn: () => api.post("/hr/attendance/check-in"),
// 	checkOut: () => api.post("/hr/attendance/check-out"),
// 	getMyAttendance: (params) => api.get("/hr/attendance/my", { params }),
// 	getAllAttendance: (params) => api.get("/hr/attendance", { params }),
// 	getAttendanceStats: () => api.get("/hr/attendance/stats"),
// 	getTodayAttendanceAnalytics: () =>
// 		api.get("/hr/attendance/today-analytics"),
// 	filterAttendance: (data) => api.post("/hr/attendance/filter", data),
// 	getMonthlyAttendanceReport: (data) =>
// 		api.post("/hr/attendance/monthly-report", data),
// 	getEmployeeAttendanceById: (employeeId, params) =>
// 		api.get(`/hr/attendance/employee/${employeeId}`, { params }),

// 	// ==================== SALARY & PAYROLL ====================
// 	generateSalarySlip: (data) => api.post("/hr/salary/generate", data),
// 	generateBulkSalarySlips: (data) =>
// 		api.post("/hr/salary/bulk-generate", data),
// 	getMySalarySlips: () => api.get("/hr/salary/my-slips"),
// 	getEmployeeAllSalarySlips: (employeeId) =>
// 		api.get(`/hr/salary/employee/${employeeId}`),
// 	getSalarySlipById: (id) => api.get(`/hr/salary/${id}`),
// 	updateSalarySlipStatus: (id, data) =>
// 		api.put(`/hr/salary/${id}/status`, data),

// 	// Get All Salary Slips (Paginated)
// 	getAllSalarySlips: (params) => api.get("/hr/salary/all", { params }),

// 	// Download Salary Slip PDF
// 	downloadSalarySlipPdf: (slipId) =>
// 		api.get(`/hr/salary/${slipId}/pdf`, { responseType: "blob" }),

// 	// ==================== PAYROLL APPROVAL WORKFLOW ====================
// 	// Download generated Excel report
// 	downloadSalaryReport: (params) =>
// 		api.get("/hr/salary/report", { params, responseType: "blob" }),

// 	// Submit payroll batch to Finance for approval
// 	submitPayrollForApproval: (data) =>
// 		api.post("/hr/salary/report/submit-for-approval", data),

// 	// Get HR's own submission history/batches
// 	getMyPayrollBatches: (params) =>
// 		api.get("/hr/salary/report/my-batches", { params }),

// 	// ==================== LEAVES ====================
// 	applyLeave: (data) => api.post("/hr/leaves", data),
// 	getAllLeaves: (params) => api.get("/hr/leaves", { params }),
// 	getMyLeaves: (params) => api.get("/hr/leaves/my", { params }),
// 	processLeave: (id, data) => api.put(`/hr/leaves/${id}/process`, data),
// 	getMyLeaveBalance: () => api.get("/hr/leaves/balance"),
// 	getEmployeeLeaveBalance: (employeeId) =>
// 		api.get(`/hr/leaves/balance/${employeeId}`),

// 	// ==================== SHIFTS ====================
// 	createShift: (data) => api.post("/hr/shifts", data),
// 	getAllShifts: () => api.get("/hr/shifts"),
// 	getShiftById: (id) => api.get(`/hr/shifts/${id}`),
// 	updateShift: (id, data) => api.put(`/hr/shifts/${id}`, data),
// 	deleteShift: (id) => api.delete(`/hr/shifts/${id}`),
// 	assignShiftToEmployee: (data) => api.post("/hr/shifts/assign", data),
// 	getEmployeeCurrentShift: (employeeId) =>
// 		api.get(`/hr/shifts/employee/${employeeId}`),

// 	// ==================== LABOR ====================
// 	createLabor: (data) => api.post("/hr/labors", data),
// 	getAllLabors: (params) => api.get("/hr/labors", { params }),
// 	getLaborById: (id) => api.get(`/hr/labors/${id}`),
// 	updateLabor: (id, data) => api.put(`/hr/labors/${id}`, data),
// 	deleteLabor: (id) => api.delete(`/hr/labors/${id}`),
// 	getLaborStats: () => api.get("/hr/labors/stats"),

// 	// ==================== LABOR WAGES ====================
// 	createLaborWage: (data) => api.post("/hr/labor-wages", data),
// 	getAllLaborWages: (params) => api.get("/hr/labor-wages", { params }),
// 	getLaborWageById: (id) => api.get(`/hr/labor-wages/${id}`),
// 	updateLaborWage: (id, data) => api.put(`/hr/labor-wages/${id}`, data),
// 	deleteLaborWage: (id) => api.delete(`/hr/labor-wages/${id}`),

// 	// ==================== LABOR ATTENDANCE ====================
// 	markLaborAttendance: (data) => api.post("/hr/labor-attendance", data),
// 	markBulkLaborAttendance: (data) =>
// 		api.post("/hr/labor-attendance/bulk", data),
// 	getLaborAttendance: (params) => api.get("/hr/labor-attendance", { params }),
// 	getLaborAttendanceSummary: (laborId, params) =>
// 		api.get(`/hr/labor-attendance/summary/${laborId}`, { params }),
// 	getDailyLaborAttendance: (date, params) =>
// 		api.get(`/hr/labor-attendance/daily/${date}`, { params }),

// 	// ==================== ANNOUNCEMENTS ====================
// 	createAnnouncement: (data) => api.post("/hr/announcements", data),
// 	getAllAnnouncements: () => api.get("/hr/announcements"),

// 	// ==================== EXPENSES (PRESIGNED URL FLOW) ====================

// 	/**
// 	 * 🚀 Create a new expense ticket (USING PRESIGNED URL)
// 	 * @param {Object} data - Expense data with fileKey instead of file
// 	 *
// 	 * Usage:
// 	 * 1. First upload proof via presigned URL:
// 	 *    const presigned = await hrApi.getPresignedUrl({
// 	 *        fileName: 'receipt.jpg',
// 	 *        fileType: 'expense',
// 	 *        mimeType: 'image/jpeg'
// 	 *    });
// 	 *    await fetch(presigned.url, { method: 'PUT', body: file });
// 	 *    await hrApi.confirmUpload({ fileKey: presigned.key, fileType: 'expense' });
// 	 *
// 	 * 2. Then create expense with fileKey:
// 	 *    await hrApi.createExpense({
// 	 *        title: 'Fuel for site visit',
// 	 *        category: 'Fuel',
// 	 *        description: 'Fuel expenses for project site visit',
// 	 *        amount: '1500',
// 	 *        proofKey: presigned.key
// 	 *    });
// 	 */
// 	getExpenseCategories: () => api.get("/hr/expense-category"),
// 	createExpense: (data) => api.post("/hr/expenses", data),

// 	/**
// 	 * 👤 Get current user's expenses with pagination and filtering
// 	 * @param {Object} params - Query parameters
// 	 * @param {string} params.status - Filter by status (Pending, Approved, Rejected, Paid)
// 	 * @param {string} params.search - Search by title or employee name
// 	 * @param {number} params.page - Page number (default: 1)
// 	 * @param {number} params.limit - Items per page (default: 10)
// 	 * @returns {Promise} API response with paginated expenses
// 	 *
// 	 * Response Structure:
// 	 * {
// 	 *   success: true,
// 	 *   data: {
// 	 *     tickets: [...],
// 	 *     pagination: { page, limit, total, pages }
// 	 *   }
// 	 * }
// 	 */
// 	getMyExpenses: (params) => api.get("/hr/expenses/my", { params }),

// 	/**
// 	 * 👁️ Get all expenses (Admin/HR/Finance) with pagination and filters
// 	 * @param {Object} params - Query parameters
// 	 * @param {string} params.status - Filter by status (Pending, Approved, Rejected, Paid)
// 	 * @param {string} params.category - Filter by category (Fuel, Travel, Food, etc.)
// 	 * @param {string} params.employeeId - Filter by specific employee ID
// 	 * @param {string} params.search - Search by title or employee name
// 	 * @param {number} params.page - Page number (default: 1)
// 	 * @param {number} params.limit - Items per page (default: 10)
// 	 * @returns {Promise} API response with paginated expenses
// 	 */
// 	getAllExpenses: (params) => api.get("/hr/expenses", { params }),

// 	/**
// 	 * 📄 Get single expense ticket details
// 	 * @param {string} id - Expense ID
// 	 * @returns {Promise} API response with expense details
// 	 */
// 	getExpenseById: (id) => api.get(`/hr/expenses/${id}`),

// 	/**
// 	 * ✅ Approve an expense ticket (HR role)
// 	 * @param {string} id - Expense ID
// 	 * @param {Object} data - Approval data
// 	 * @param {string} data.remarks - Approval remarks (optional)
// 	 */
// 	approveExpense: (id, data) => api.put(`/hr/expenses/${id}/approve`, data),

// 	/**
// 	 * ❌ Reject an expense ticket (HR role)
// 	 * @param {string} id - Expense ID
// 	 * @param {Object} data - Rejection data
// 	 * @param {string} data.reason - Reason for rejection (required)
// 	 */
// 	rejectExpense: (id, data) => api.put(`/hr/expenses/${id}/reject`, data),

// 	/**
// 	 * 💰 Mark expense as paid (Finance role)
// 	 * @param {string} id - Expense ID
// 	 * @param {Object} data - Payment data
// 	 * @param {string} data.paymentMethod - Payment method (UPI, Bank Transfer, Cheque, Cash, NEFT, RTGS)
// 	 * @param {string} data.paymentReference - Payment reference/transaction ID (required)
// 	 * @param {string} data.remarks - Payment remarks (optional)
// 	 */
// 	payExpense: (id, data) => api.put(`/hr/expenses/${id}/pay`, data),

// 	// ==================== WALLET ====================

// 	getMyWallet: () => api.get("/hr/wallet/my"),

// 	getWalletTransactions: (params) =>
// 		api.get("/hr/wallet/transactions", { params }),
// };



















// import api from "./axios";

// export const hrApi = {
//     // ==================== EMPLOYEES ====================
//     createEmployee: (data) => api.post("/hr/employees", data),

//     // ─── PRESIGNED URL UPLOAD (UPDATED ENDPOINTS) ───
//     getPresignedUrl: (data) => api.post("/auth/presigned-url", data),
//     confirmUpload: (data) => api.post("/auth/confirm-upload", data),

//     // ─── EMPLOYEE REGISTRATION & VERIFICATION ───
//     registerEmployee: (data) => api.post("/auth/register", data),
//     verifyOtp: (data) => api.post("/auth/verify-otp", data),

//     updateEmployee: (id, data) => api.patch(`/auth/users/${id}`, data),

//     getAllEmployees: (params) => api.get("/hr/employees", { params }),
//     getEmployeeById: (id) => api.get(`/hr/employees/${id}`),
//     deleteEmployee: (id) => api.delete(`/hr/employees/${id}`),

//     // Delete user (soft delete)
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
//     generateSalarySlip: (data) => api.post("/hr/salary/generate", data),
//     generateBulkSalarySlips: (data) =>
//         api.post("/hr/salary/bulk-generate", data),
//     getMySalarySlips: () => api.get("/hr/salary/my-slips"),
//     getEmployeeAllSalarySlips: (employeeId) =>
//         api.get(`/hr/salary/employee/${employeeId}`),
//     getSalarySlipById: (id) => api.get(`/hr/salary/${id}`),
//     updateSalarySlipStatus: (id, data) =>
//         api.put(`/hr/salary/${id}/status`, data),

//     // Get All Salary Slips (Paginated)
//     getAllSalarySlips: (params) => api.get("/hr/salary/all", { params }),

//     // Download Salary Slip PDF
//     downloadSalarySlipPdf: (slipId) =>
//         api.get(`/hr/salary/${slipId}/pdf`, { responseType: "blob" }),

//     // ==================== PAYROLL APPROVAL WORKFLOW ====================
//     // Download generated Excel report
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

//     // ==================== ⚙️ EXPENSE CATEGORIES ====================
//     createExpenseCategory: (data) => api.post("/hr/expense-category", data),
//     getAllExpenseCategories: (params) => api.get("/hr/expense-category", { params }),
//     getExpenseCategoryById: (id) => api.get(`/hr/expense-category/${id}`),
//     updateExpenseCategory: (id, data) => api.put(`/hr/expense-category/${id}`, data),
//     deleteExpenseCategory: (id) => api.delete(`/hr/expense-category/${id}`),

//     // Legacy support for your existing component if it uses this exact name
//     getExpenseCategories: (params) => api.get("/hr/expense-category", { params }),

//     // ==================== 🎫 EXPENSE TICKETS ====================
//     createExpense: (data) => api.post("/hr/expenses", data),
//     getMyExpenses: (params) => api.get("/hr/expenses/my", { params }),
//     getAllExpenses: (params) => api.get("/hr/expenses", { params }),
//     getExpenseById: (id) => api.get(`/hr/expenses/${id}`),
    
//     // Approvals
//     approveExpense: (id, data) => api.put(`/hr/expenses/${id}/approve`, data),
//     rejectExpense: (id, data) => api.put(`/hr/expenses/${id}/reject`, data),
    
//     // Payments & Refunds
//     payExpenseCash: (id, data) => api.put(`/hr/expenses/${id}/pay-cash`, data),
//     payExpense: (id, data) => api.put(`/hr/expenses/${id}/pay`, data), // Legacy backward compatibility
//     refundExpenseTicket: (id, data) => api.put(`/hr/expenses/${id}/refund`, data),

//     // ==================== 💰 WALLET MANAGEMENT ====================
    
//     // --- Employee Side ---
//     getMyWallet: () => api.get("/hr/wallet/my"),
//     getMyWalletTransactions: (params) => api.get("/hr/wallet/transactions", { params }),

//     // --- HR / Admin / Finance Side ---
//     addWalletMoney: (data) => api.post("/hr/wallet/add-money", data),
//     refundWallet: (data) => api.post("/hr/wallet/refund", data),
//     getEmployeeWallet: (employeeId) => api.get(`/hr/wallet/employee/${employeeId}`),
//     getEmployeeWalletTransactions: (employeeId, params) => 
//         api.get(`/hr/wallet/transactions/${employeeId}`, { params }),
    
//     // Pending Payments (Finance)
//     getPendingPayments: (params) => api.get("/hr/wallet/pending-payments", { params }),
// };











import api from "./axios";

export const hrApi = {
    // ==================== EMPLOYEES ====================
    createEmployee: (data) => api.post("/hr/employees", data),

    // ─── PRESIGNED URL UPLOAD (UPDATED ENDPOINTS) ───
    getPresignedUrl: (data) => api.post("/auth/presigned-url", data),
    confirmUpload: (data) => api.post("/auth/confirm-upload", data),

    // ─── EMPLOYEE REGISTRATION & VERIFICATION ───
    registerEmployee: (data) => api.post("/auth/register", data),
    verifyOtp: (data) => api.post("/auth/verify-otp", data),

    updateEmployee: (id, data) => api.patch(`/auth/users/${id}`, data),

    getAllEmployees: (params) => api.get("/hr/employees", { params }),
    getEmployeeById: (id) => api.get(`/hr/employees/${id}`),
    deleteEmployee: (id) => api.delete(`/hr/employees/${id}`),

    // Delete user (soft delete)
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
    generateSalarySlip: (data) => api.post("/hr/salary/generate", data),
    generateBulkSalarySlips: (data) =>
        api.post("/hr/salary/bulk-generate", data),
    getMySalarySlips: () => api.get("/hr/salary/my-slips"),
    getEmployeeAllSalarySlips: (employeeId) =>
        api.get(`/hr/salary/employee/${employeeId}`),
    getSalarySlipById: (id) => api.get(`/hr/salary/${id}`),
    updateSalarySlipStatus: (id, data) =>
        api.put(`/hr/salary/${id}/status`, data),

    // Get All Salary Slips (Paginated)
    getAllSalarySlips: (params) => api.get("/hr/salary/all", { params }),

    // Download Salary Slip PDF
    downloadSalarySlipPdf: (slipId) =>
        api.get(`/hr/salary/${slipId}/pdf`, { responseType: "blob" }),

    // ==================== PAYROLL APPROVAL WORKFLOW ====================
    // Download generated Excel report
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

    // ==================== ⚙️ EXPENSE CATEGORIES ====================
    createExpenseCategory: (data) => api.post("/hr/expense-category", data),
    getAllExpenseCategories: (params) => api.get("/hr/expense-category", { params }),
    getExpenseCategoryById: (id) => api.get(`/hr/expense-category/${id}`),
    updateExpenseCategory: (id, data) => api.put(`/hr/expense-category/${id}`, data),
    deleteExpenseCategory: (id) => api.delete(`/hr/expense-category/${id}`),

    // Legacy support for your existing component if it uses this exact name
    getExpenseCategories: (params) => api.get("/hr/expense-category", { params }),

    // ==================== 🎫 EXPENSE TICKETS ====================
    createExpense: (data) => api.post("/hr/expenses", data),
    getMyExpenses: (params) => api.get("/hr/expenses/my", { params }),
    getAllExpenses: (params) => api.get("/hr/expenses", { params }),
    getExpenseById: (id) => api.get(`/hr/expenses/${id}`),
    
    // Approvals
    approveExpense: (id, data) => api.put(`/hr/expenses/${id}/approve`, data),
    rejectExpense: (id, data) => api.put(`/hr/expenses/${id}/reject`, data),
    
    // Payments & Refunds
    payExpenseCash: (id, data) => api.put(`/hr/expenses/${id}/pay-cash`, data),
    payExpense: (id, data) => api.put(`/hr/expenses/${id}/pay`, data), // Legacy backward compatibility
    refundExpenseTicket: (id, data) => api.put(`/hr/expenses/${id}/refund`, data),

    // ==================== 💰 WALLET MANAGEMENT ====================
    
    // --- Employee Side ---
    getMyWallet: () => api.get("/hr/wallet/my"),
    getMyWalletTransactions: (params) => api.get("/hr/wallet/transactions", { params }),

    // --- HR / Admin / Finance Side ---
    addWalletMoney: (data) => api.post("/hr/wallet/add-money", data),
    refundWallet: (data) => api.post("/hr/wallet/refund", data),
    getEmployeeWallet: (employeeId) => api.get(`/hr/wallet/employee/${employeeId}`),
    getEmployeeWalletTransactions: (employeeId, params) => 
        api.get(`/hr/wallet/transactions/${employeeId}`, { params }),
    
    // Pending Payments (Finance)
    getPendingPayments: (params) => api.get("/hr/wallet/pending-payments", { params }),
};