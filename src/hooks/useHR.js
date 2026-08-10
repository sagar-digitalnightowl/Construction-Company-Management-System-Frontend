import { useState, useCallback } from "react";
import { toast } from "sonner";
import { hrApi } from "@/api/hrApi";

export const useHR = () => {
    const [employees, setEmployees] = useState({
        employees: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    });
    const [employee, setEmployee] = useState(null);
    const [employeeStats, setEmployeeStats] = useState(null);
    const [currentEmployeeAttendance, setCurrentEmployeeAttendance] = useState([]);
    const [currentEmployeeLeaves, setCurrentEmployeeLeaves] = useState([]);
    const [currentEmployeeSalarySlips, setCurrentEmployeeSalarySlips] = useState([]);
    const [currentEmployeeLeaveBalance, setCurrentEmployeeLeaveBalance] = useState(null);
    
    const [departments, setDepartments] = useState([]);
    const [departmentEmployees, setDepartmentEmployees] = useState([]);
    
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [myAttendance, setMyAttendance] = useState({});
    const [attendanceStats, setAttendanceStats] = useState(null);
    const [todayAnalytics, setTodayAnalytics] = useState(null);
    
    const [leaves, setLeaves] = useState([]);
    const [myLeaves, setMyLeaves] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(null);
    
    const [salarySlips, setSalarySlips] = useState([]);
    const [employeeSalarySlips, setEmployeeSalarySlips] = useState([]);
    const [companySalarySlips, setCompanySalarySlips] = useState([]);
    const [myPayrollBatches, setMyPayrollBatches] = useState([]);
    
    const [shifts, setShifts] = useState([]);
    const [employeeShift, setEmployeeShift] = useState(null);
    
    const [labors, setLabors] = useState([]);
    const [labor, setLabor] = useState(null);
    const [laborStats, setLaborStats] = useState(null);
    const [laborWages, setLaborWages] = useState([]);
    const [laborAttendance, setLaborAttendance] = useState([]);
    const [laborAttendanceSummary, setLaborAttendanceSummary] = useState(null);
    
    const [announcements, setAnnouncements] = useState([]);

    // ==================== Expenses & Wallet State ====================
    // Employee Wallet (Self)
    const [wallet, setWallet] = useState(null);
    const [walletTransactions, setWalletTransactions] = useState([]);
    const [walletTransactionsPagination, setWalletTransactionsPagination] = useState({
        page: 1, limit: 10, total: 0, pages: 0,
    });

    // HR Wallet View (Other Employees)
    const [employeeWallet, setEmployeeWallet] = useState(null);
    const [employeeWalletTransactions, setEmployeeWalletTransactions] = useState([]);
    
    // Expense Categories
    const [expenseCategories, setExpenseCategories] = useState([]);
    
    // Expense Tickets
    const [myExpenses, setMyExpenses] = useState([]);
    const [myExpensesPagination, setMyExpensesPagination] = useState({
        page: 1, limit: 10, total: 0, pages: 0,
    });
    const [allExpenses, setAllExpenses] = useState([]);
    const [allExpensesPagination, setAllExpensesPagination] = useState({
        page: 1, limit: 10, total: 0, pages: 0,
    });
    const [expenseDetail, setExpenseDetail] = useState(null);

    // Pending Cash Payments (Finance)
    const [pendingPayments, setPendingPayments] = useState([]);
    const [pendingPaymentsPagination, setPendingPaymentsPagination] = useState({
        page: 1, limit: 10, total: 0, pages: 0,
    });

    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1, limit: 10, total: 0, pages: 0,
    });

    // ==================== Employees ====================
    const fetchEmployees = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllEmployees(params);
            const data = res.data?.data || {};
            setEmployees({
                employees: data.employees || [],
                pagination: data.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
            });
        } catch (err) {
            toast.error("Failed to load employees");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeById(id);
            setEmployee(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee details");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCurrentEmployeeAttendance = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeAttendanceById(employeeId);
            setCurrentEmployeeAttendance(res.data?.data?.records || []);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee attendance");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCurrentEmployeeLeaves = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllLeaves({ employeeId });
            setCurrentEmployeeLeaves(res.data?.data?.leaves || []);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee leaves");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCurrentEmployeeLeaveBalance = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeLeaveBalance(employeeId);
            setCurrentEmployeeLeaveBalance(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee leave balance");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCurrentEmployeeSalarySlips = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
            setCurrentEmployeeSalarySlips(res.data?.data || []);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee salary slips");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeStats = useCallback(async () => {
        try {
            const res = await hrApi.getEmployeeStats();
            setEmployeeStats(res.data?.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const createEmployee = async (data) => {
        setLoading(true);
        try {
            await hrApi.createEmployee(data);
            toast.success("Employee created");
            await fetchEmployees();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create employee");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ─── PRESIGNED URL UPLOAD HELPERS ───
    const getPresignedUrl = async (file, fileType) => {
        try {
            const res = await hrApi.getPresignedUrl({
                fileName: file.name,
                fileType,
                mimeType: file.type,
            });
            return res.data;
        } catch (err) {
            toast.error("Failed to get upload URL");
            throw err;
        }
    };

    const uploadFileToS3 = async (uploadUrl, file) => {
        await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
        });
    };

    const confirmUpload = async (fileKey, fileType) => {
        const res = await hrApi.confirmUpload({ fileKey, fileType });
        return res.data;
    };

    const uploadFile = async (file, fileType) => {
        setLoading(true);
        try {
            const { uploadUrl, fileKey, publicUrl } = await getPresignedUrl(file, fileType);
            await uploadFileToS3(uploadUrl, file);
            const { fileUrl } = await confirmUpload(fileKey, fileType);
            toast.success(`${fileType} uploaded`);
            return publicUrl;
        } catch (err) {
            toast.error("Upload failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const registerEmployee = async (data) => {
        setLoading(true);
        try {
            const res = await hrApi.registerEmployee(data);
            toast.success("Employee created");
            return res.data;
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to create employee");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (payload) => {
        setLoading(true);
        try {
            const res = await hrApi.verifyOtp(payload);
            toast.success(res.data?.message || "OTP verified successfully");
            return res.data;
        } catch (err) {
            toast.error(err?.response?.data?.message || "OTP verification failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateEmployee = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateEmployee(id, data);
            toast.success("Employee updated");
            await fetchEmployees();
            return true;
        } catch (err) {
            console.log("Error : ", err);
            toast.error("Failed to update employee");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteEmployee(id);
            toast.success("Employee deleted");
            await fetchEmployees();
        } catch (err) {
            toast.error("Failed to delete employee");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = useCallback(async (userId) => {
        setLoading(true);
        try {
            const res = await hrApi.deleteUser(userId);
            toast.success(res.data?.message || "Employee deleted successfully");
            return true;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete employee");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== Departments ====================
    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await hrApi.getAllDepartments();
            setDepartments(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to load departments");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDepartmentEmployees = useCallback(async (departmentId, params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeesByDepartment(departmentId, params);
            setDepartmentEmployees(res.data?.data?.employees || []);
        } catch (err) {
            toast.error("Failed to load department employees");
        } finally {
            setLoading(false);
        }
    }, []);

    const createDepartment = async (data) => {
        setLoading(true);
        try {
            await hrApi.createDepartment(data);
            toast.success("Department created");
            await fetchDepartments();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create department");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateDepartment = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateDepartment(id, data);
            toast.success("Department updated");
            await fetchDepartments();
            return true;
        } catch (err) {
            toast.error("Failed to update department");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteDepartment = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteDepartment(id);
            toast.success("Department deleted");
            await fetchDepartments();
        } catch (err) {
            toast.error("Failed to delete department");
        } finally {
            setLoading(false);
        }
    };

    // ==================== Attendance ====================
    const checkIn = async () => {
        setLoading(true);
        try {
            await hrApi.checkIn();
            toast.success("Checked in successfully");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Check-in failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const checkOut = async () => {
        setLoading(true);
        try {
            await hrApi.checkOut();
            toast.success("Checked out successfully");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Check-out failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyAttendance = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getMyAttendance(params);
            setMyAttendance(res.data?.data || {});
        } catch (err) {
            toast.error("Failed to load your attendance");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllAttendance = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllAttendance(params);
            setAttendanceRecords(res.data?.data?.attendance || []);
        } catch (err) {
            toast.error("Failed to load attendance records");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAttendanceStats = useCallback(async () => {
        try {
            const res = await hrApi.getAttendanceStats();
            setAttendanceStats(res.data?.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchTodayAnalytics = useCallback(async () => {
        try {
            const res = await hrApi.getTodayAttendanceAnalytics();
            setTodayAnalytics(res.data?.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    // ==================== Leaves ====================
    const fetchLeaves = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllLeaves(params);
            setLeaves(res.data?.data?.leaves || []);
        } catch (err) {
            toast.error("Failed to load leaves");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyLeaves = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getMyLeaves(params);
            setMyLeaves(res.data?.data?.leaves || []);
        } catch (err) {
            toast.error("Failed to load your leaves");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyLeaveBalance = useCallback(async () => {
        setLoading(true);
        try {
            const res = await hrApi.getMyLeaveBalance();
            setLeaveBalance(res.data?.data);
        } catch (err) {
            toast.error("Failed to load leave balance");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeLeaveBalance = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeLeaveBalance(employeeId);
            setEmployeeLeaveBalance(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee leave balance");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const applyLeave = async (data) => {
        setLoading(true);
        try {
            await hrApi.applyLeave(data);
            toast.success("Leave application submitted");
            await fetchMyLeaves();
            await fetchMyLeaveBalance();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to apply leave");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const processLeave = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.processLeave(id, data);
            toast.success(`Leave ${data.status}`);
            await fetchLeaves();
            return true;
        } catch (err) {
            toast.error("Failed to process leave");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ==================== Salary ====================
    const fetchAllSalarySlips = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllSalarySlips(params);
            setCompanySalarySlips(res.data?.data || []);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load company salary slips");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMySalarySlips = useCallback(async () => {
        setLoading(true);
        try {
            const res = await hrApi.getMySalarySlips();
            setSalarySlips(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to load salary slips");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeSalarySlips = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
            setEmployeeSalarySlips(res.data?.data || []);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee salary slips");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const generateSalarySlip = async (data) => {
        setLoading(true);
        try {
            const res = await hrApi.generateSalarySlip(data);
            toast.success("Salary slip generated");
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to generate salary slip");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const generateBulkSalarySlips = async (data) => {
        setLoading(true);
        try {
            const res = await hrApi.generateBulkSalarySlips(data);
            toast.success(res.data?.message || "Bulk salary slips generated successfully");
            return res.data?.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to generate bulk salary slips");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateSalaryStatus = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateSalarySlipStatus(id, data);
            toast.success("Salary status updated");
            return true;
        } catch (err) {
            toast.error("Failed to update status");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const downloadSalaryReport = async (params) => {
        setLoading(true);
        try {
            const res = await hrApi.downloadSalaryReport(params);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Salary_Report_${params.month}_${params.year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Salary report downloaded");
            return true;
        } catch (err) {
            toast.error("Failed to download salary report");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const downloadSalarySlipPdf = useCallback(async (slipId) => {
        setLoading(true);
        try {
            const res = await hrApi.downloadSalarySlipPdf(slipId);
            const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `salary-slip-${slipId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Salary slip downloaded");
            return true;
        } catch (err) {
            toast.error("Failed to download salary slip");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const submitPayrollForApproval = async (data) => {
        setLoading(true);
        try {
            await hrApi.submitPayrollForApproval(data);
            toast.success("Payroll batch submitted to Finance");
            await fetchMyPayrollBatches();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit payroll batch");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyPayrollBatches = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getMyPayrollBatches(params);
            setMyPayrollBatches(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to load payroll batches");
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== Shifts ====================
    const fetchShifts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await hrApi.getAllShifts();
            setShifts(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to load shifts");
        } finally {
            setLoading(false);
        }
    }, []);

    const createShift = async (data) => {
        setLoading(true);
        try {
            await hrApi.createShift(data);
            toast.success("Shift created");
            await fetchShifts();
            return true;
        } catch (err) {
            toast.error("Failed to create shift");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateShift = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateShift(id, data);
            toast.success("Shift updated");
            await fetchShifts();
            return true;
        } catch (err) {
            toast.error("Failed to update shift");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteShift = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteShift(id);
            toast.success("Shift deleted");
            await fetchShifts();
        } catch (err) {
            toast.error("Failed to delete shift");
        } finally {
            setLoading(false);
        }
    };

    const assignShiftToEmployee = async (data) => {
        setLoading(true);
        try {
            await hrApi.assignShiftToEmployee(data);
            toast.success("Shift assigned");
            return true;
        } catch (err) {
            toast.error("Failed to assign shift");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployeeCurrentShift = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeCurrentShift(employeeId);
            setEmployeeShift(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee shift");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== Labor Management ====================
    const fetchLabors = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllLabors(params);
            setLabors(res.data?.data?.labors || []);
        } catch (err) {
            toast.error("Failed to load labors");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLaborById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await hrApi.getLaborById(id);
            setLabor(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load labor details");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLaborStats = useCallback(async () => {
        try {
            const res = await hrApi.getLaborStats();
            setLaborStats(res.data?.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const createLabor = async (data) => {
        setLoading(true);
        try {
            await hrApi.createLabor(data);
            toast.success("Labor created");
            await fetchLabors();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create labor");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateLabor = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateLabor(id, data);
            toast.success("Labor updated");
            await fetchLabors();
            return true;
        } catch (err) {
            toast.error("Failed to update labor");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteLabor = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteLabor(id);
            toast.success("Labor deleted");
            await fetchLabors();
        } catch (err) {
            toast.error("Failed to delete labor");
        } finally {
            setLoading(false);
        }
    };

    const fetchLaborWages = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllLaborWages(params);
            setLaborWages(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to load labor wages");
        } finally {
            setLoading(false);
        }
    }, []);

    const createLaborWage = async (data) => {
        setLoading(true);
        try {
            await hrApi.createLaborWage(data);
            toast.success("Labor wage created");
            await fetchLaborWages();
            return true;
        } catch (err) {
            toast.error("Failed to create labor wage");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateLaborWage = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateLaborWage(id, data);
            toast.success("Labor wage updated");
            await fetchLaborWages();
            return true;
        } catch (err) {
            toast.error("Failed to update labor wage");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteLaborWage = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteLaborWage(id);
            toast.success("Labor wage deleted");
            await fetchLaborWages();
        } catch (err) {
            toast.error("Failed to delete labor wage");
        } finally {
            setLoading(false);
        }
    };

    const fetchLaborAttendance = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getLaborAttendance(params);
            setLaborAttendance(res.data?.data?.attendances || []);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load labor attendance");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const markLaborAttendance = async (data) => {
        setLoading(true);
        try {
            await hrApi.markLaborAttendance(data);
            toast.success("Labor attendance marked");
            await fetchLaborAttendance();
            return true;
        } catch (err) {
            toast.error("Failed to mark labor attendance");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const markBulkLaborAttendance = async (data) => {
        setLoading(true);
        try {
            await hrApi.markBulkLaborAttendance(data);
            toast.success("Bulk attendance marked");
            await fetchLaborAttendance();
            return true;
        } catch (err) {
            toast.error("Failed to mark bulk attendance");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchLaborAttendanceSummary = useCallback(async (laborId, params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getLaborAttendanceSummary(laborId, params);
            setLaborAttendanceSummary(res.data?.data);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load attendance summary");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDailyLaborAttendance = useCallback(async (date, params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getDailyLaborAttendance(date, params);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load daily attendance");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAnnouncements = useCallback(async () => {
        try {
            const res = await hrApi.getAllAnnouncements();
            setAnnouncements(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to load announcements");
        }
    }, []);

    const createAnnouncement = async (data) => {
        setLoading(true);
        try {
            await hrApi.createAnnouncement(data);
            toast.success("Announcement posted");
            await fetchAnnouncements();
            return true;
        } catch (err) {
            toast.error("Failed to create announcement");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ==================== EXPENSE CATEGORIES ====================
    const fetchExpenseCategories = useCallback(async (params = {}) => {
        try {
            const res = await hrApi.getAllExpenseCategories(params);
            setExpenseCategories(res.data?.data || []);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load expense categories");
            return null;
        }
    }, []);

    const createExpenseCategory = async (data) => {
        setLoading(true);
        try {
            await hrApi.createExpenseCategory(data);
            toast.success("Expense category created successfully");
            await fetchExpenseCategories();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create category");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateExpenseCategory = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateExpenseCategory(id, data);
            toast.success("Expense category updated");
            await fetchExpenseCategories();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update category");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteExpenseCategory = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteExpenseCategory(id);
            toast.success("Expense category deleted");
            await fetchExpenseCategories();
            return true;
        } catch (err) {
            toast.error("Failed to delete category");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ==================== WALLET MANAGEMENT ====================
    // --- Employee View ---
    const fetchMyWallet = useCallback(async () => {
        try {
            const res = await hrApi.getMyWallet();
            setWallet(res.data?.data || null);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load wallet");
            return null;
        }
    }, []);

    const fetchWalletTransactions = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getMyWalletTransactions(params);
            const data = res.data?.data || {};
            setWalletTransactions(data.transactions || []);
            setWalletTransactionsPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load wallet transactions");
            setWalletTransactions([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // --- HR View ---
    const fetchEmployeeWallet = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeWallet(employeeId);
            setEmployeeWallet(res.data?.data || null);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee wallet");
            setEmployeeWallet(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeWalletTransactions = useCallback(async (employeeId, params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeWalletTransactions(employeeId, params);
            setEmployeeWalletTransactions(res.data?.data?.transactions || []);
            return res.data?.data;
        } catch (err) {
            toast.error("Failed to load employee wallet transactions");
            setEmployeeWalletTransactions([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const addWalletMoney = async (data) => {
        setLoading(true);
        try {
            await hrApi.addWalletMoney(data);
            toast.success("Money added to wallet successfully");
            if (data.employeeId) {
                await fetchEmployeeWallet(data.employeeId);
                await fetchEmployeeWalletTransactions(data.employeeId);
            }
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add money");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const refundWallet = async (data) => {
        setLoading(true);
        try {
            await hrApi.refundWallet(data);
            toast.success("Amount refunded to wallet");
            if (data.employeeId) {
                await fetchEmployeeWallet(data.employeeId);
                await fetchEmployeeWalletTransactions(data.employeeId);
            }
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to process refund");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ==================== EXPENSE TICKETS ====================
    const fetchMyExpenses = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getMyExpenses(params);
            const data = res.data?.data || {};
            setMyExpenses(Array.isArray(data.tickets) ? data.tickets : []);
            if (data.pagination) setMyExpensesPagination(data.pagination);
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load your expenses");
            setMyExpenses([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 🆕 PROJECT ID VALIDATION ADDED IN CREATE EXPENSE
    const createExpense = async (data) => {
        const title = data instanceof FormData ? data.get("title") : data.title;
        const amount = data instanceof FormData ? data.get("amount") : data.amount;
        const categoryId = data instanceof FormData ? data.get("categoryId") : data.categoryId;
        const projectId = data instanceof FormData ? data.get("projectId") : data.projectId; // 🆕 ADDED

        if (!title || (typeof title === "string" && !title.trim())) {
            toast.error("Title is required");
            return false;
        }
        if (!amount) {
            toast.error("Amount is required");
            return false;
        }
        if (!categoryId) {
            toast.error("Category is required");
            return false;
        }
        // 🆕 ADDED VALIDATION FOR PROJECT
        if (!projectId) { 
            toast.error("Project is required");
            return false;
        }

        setLoading(true);
        try {
            await hrApi.createExpense(data);
            toast.success("Expense ticket raised successfully!");
            await fetchMyExpenses();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to raise ticket");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchAllExpenses = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllExpenses(params);
            const data = res.data?.data || {};
            setAllExpenses(Array.isArray(data.tickets) ? data.tickets : []);
            if (data.pagination) {
                setAllExpensesPagination({
                    page: data.pagination.page || 1,
                    limit: data.pagination.limit || 10,
                    total: data.pagination.total || 0,
                    pages: data.pagination.pages || 0,
                });
            }
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load expenses");
            setAllExpenses([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchExpenseById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await hrApi.getExpenseById(id);
            const data = res.data?.data;
            setExpenseDetail(data);
            return data;
        } catch (err) {
            toast.error("Failed to load expense details");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const approveExpense = async (id, data = {}) => {
        setLoading(true);
        try {
            await hrApi.approveExpense(id, data);
            toast.success("Expense approved successfully!");
            await fetchMyExpenses();
            await fetchAllExpenses();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to approve expense");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const rejectExpense = async (id, data = {}) => {
        if (!data.reason?.trim()) {
            toast.error("Rejection reason is required");
            return false;
        }
        setLoading(true);
        try {
            await hrApi.rejectExpense(id, data);
            toast.success("Expense rejected successfully!");
            await fetchMyExpenses();
            await fetchAllExpenses();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reject expense");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const payExpenseCash = async (id, data = {}) => {
        if (!data.paymentMethod || !data.paymentReference) {
            toast.error("Payment method and reference are required");
            return false;
        }
        setLoading(true);
        try {
            await hrApi.payExpenseCash(id, data);
            toast.success("Cash payment processed successfully!");
            await fetchAllExpenses();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to process payment");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const refundExpenseTicket = async (id, data = {}) => {
        if (!data.reason?.trim()) {
            toast.error("Refund reason is required");
            return false;
        }
        setLoading(true);
        try {
            await hrApi.refundExpenseTicket(id, data);
            toast.success("Ticket refunded successfully!");
            await fetchAllExpenses();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to refund ticket");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingPayments = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getPendingPayments(params);
            const data = res.data?.data || {};
            setPendingPayments(Array.isArray(data.tickets) ? data.tickets : []);
            if (data.pagination) setPendingPaymentsPagination(data.pagination);
            return data;
        } catch (err) {
            toast.error("Failed to load pending payments");
            setPendingPayments([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // For backward compatibility if needed elsewhere
    const payExpense = payExpenseCash;

    return {
        // States
        employees, employee, employeeStats, departments, departmentEmployees,
        attendanceRecords, myAttendance, attendanceStats, todayAnalytics,
        leaves, myLeaves, leaveBalance, employeeLeaveBalance,
        salarySlips, employeeSalarySlips, companySalarySlips, myPayrollBatches,
        shifts, employeeShift, labors, labor, laborStats, laborWages,
        laborAttendance, laborAttendanceSummary, announcements,
        wallet, walletTransactions, walletTransactionsPagination,
        employeeWallet, employeeWalletTransactions,
        expenseCategories,
        myExpenses, myExpensesPagination, allExpenses, allExpensesPagination, expenseDetail,
        pendingPayments, pendingPaymentsPagination,
        loading, pagination,
        currentEmployeeAttendance, currentEmployeeLeaves, currentEmployeeSalarySlips, currentEmployeeLeaveBalance,

        // Employee Setup
        fetchEmployees, fetchEmployeeById, fetchEmployeeStats, createEmployee,
        uploadFile, registerEmployee, verifyOtp, updateEmployee, deleteEmployee, deleteUser,
        getPresignedUrl, confirmUpload,
        
        // Employee Extras
        fetchCurrentEmployeeAttendance, fetchCurrentEmployeeLeaves, 
        fetchCurrentEmployeeLeaveBalance, fetchCurrentEmployeeSalarySlips,
        
        // Departments
        fetchDepartments, fetchDepartmentEmployees, createDepartment, updateDepartment, deleteDepartment,
        
        // Attendance
        checkIn, checkOut, fetchMyAttendance, fetchAllAttendance, fetchAttendanceStats, fetchTodayAnalytics,
        
        // Leaves
        fetchLeaves, fetchMyLeaves, fetchMyLeaveBalance, fetchEmployeeLeaveBalance, applyLeave, processLeave,
        
        // Salary
        fetchAllSalarySlips, fetchMySalarySlips, fetchEmployeeSalarySlips, generateSalarySlip,
        generateBulkSalarySlips, updateSalaryStatus, downloadSalaryReport, downloadSalarySlipPdf,
        submitPayrollForApproval, fetchMyPayrollBatches,
        
        // Shifts
        fetchShifts, createShift, updateShift, deleteShift, assignShiftToEmployee, fetchEmployeeCurrentShift,
        
        // Labors
        fetchLabors, fetchLaborById, fetchLaborStats, createLabor, updateLabor, deleteLabor,
        fetchLaborWages, createLaborWage, updateLaborWage, deleteLaborWage,
        fetchLaborAttendance, markLaborAttendance, markBulkLaborAttendance,
        fetchLaborAttendanceSummary, fetchDailyLaborAttendance,
        
        // Announcements
        fetchAnnouncements, createAnnouncement,

        // Expense Categories
        fetchExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory,
        
        // Employee Wallet (Self)
        fetchMyWallet, fetchWalletTransactions,
        
        // HR Wallet Management (Others)
        fetchEmployeeWallet, fetchEmployeeWalletTransactions, addWalletMoney, refundWallet,
        
        // Expense Tickets & Finance Actions
        fetchMyExpenses, createExpense, fetchAllExpenses, fetchExpenseById,
        approveExpense, rejectExpense, payExpenseCash, payExpense, refundExpenseTicket,
        fetchPendingPayments,
    };
};