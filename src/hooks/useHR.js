import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { hrApi } from '@/api/hrApi';

export const useHR = () => {
    // ---- Employees ----
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [employeeStats, setEmployeeStats] = useState(null);

    // ---- Departments ----
    const [departments, setDepartments] = useState([]);
    const [departmentEmployees, setDepartmentEmployees] = useState([]);

    // ---- Attendance ----
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [myAttendance, setMyAttendance] = useState([]);
    const [attendanceStats, setAttendanceStats] = useState(null);
    const [todayAnalytics, setTodayAnalytics] = useState(null);

    // ---- Leaves ----
    const [leaves, setLeaves] = useState([]);
    const [myLeaves, setMyLeaves] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(null);

    // ---- Salary ----
    const [salarySlips, setSalarySlips] = useState([]);
    const [employeeSalarySlips, setEmployeeSalarySlips] = useState([]);

    // ---- Shifts ----
    const [shifts, setShifts] = useState([]);
    const [employeeShift, setEmployeeShift] = useState(null);

    // ---- Labors ----
    const [labors, setLabors] = useState([]);
    const [labor, setLabor] = useState(null);
    const [laborStats, setLaborStats] = useState(null);
    const [laborWages, setLaborWages] = useState([]);
    const [laborAttendance, setLaborAttendance] = useState([]);
    const [laborAttendanceSummary, setLaborAttendanceSummary] = useState(null);

    // ---- Announcements ----
    const [announcements, setAnnouncements] = useState([]);

    // ---- Common ----
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

    // ==================== Employees ====================
    const fetchEmployees = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllEmployees(params);
            setEmployees(res.data?.data?.employees || []);
            setPagination(res.data?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
        } catch (err) {
            toast.error('Failed to load employees');
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
            toast.error('Failed to load employee details');
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
            toast.success('Employee created');
            await fetchEmployees();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create employee');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateEmployee = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateEmployee(id, data);
            toast.success('Employee updated');
            await fetchEmployees();
            return true;
        } catch (err) {
            toast.error('Failed to update employee');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteEmployee(id);
            toast.success('Employee deleted');
            await fetchEmployees();
        } catch (err) {
            toast.error('Failed to delete employee');
        } finally {
            setLoading(false);
        }
    };

    // ==================== Departments ====================
    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await hrApi.getAllDepartments();
            setDepartments(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load departments');
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
            toast.error('Failed to load department employees');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDepartment = async (data) => {
        setLoading(true);
        try {
            await hrApi.createDepartment(data);
            toast.success('Department created');
            await fetchDepartments();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create department');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateDepartment = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateDepartment(id, data);
            toast.success('Department updated');
            await fetchDepartments();
            return true;
        } catch (err) {
            toast.error('Failed to update department');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteDepartment = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteDepartment(id);
            toast.success('Department deleted');
            await fetchDepartments();
        } catch (err) {
            toast.error('Failed to delete department');
        } finally {
            setLoading(false);
        }
    };

    // ==================== Attendance ====================
    const checkIn = async () => {
        setLoading(true);
        try {
            await hrApi.checkIn();
            toast.success('Checked in successfully');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Check-in failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const checkOut = async () => {
        setLoading(true);
        try {
            await hrApi.checkOut();
            toast.success('Checked out successfully');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Check-out failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyAttendance = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getMyAttendance(params);
            setMyAttendance(res.data?.data?.attendance || []);
        } catch (err) {
            toast.error('Failed to load your attendance');
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
            toast.error('Failed to load attendance records');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeAttendanceById = useCallback(async (employeeId, params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeAttendanceById(employeeId, params);
            return res.data;
        } catch (err) {
            toast.error('Failed to load employee attendance');
            return null;
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
            toast.error('Failed to load leaves');
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
            toast.error('Failed to load your leaves');
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
            toast.error('Failed to load leave balance');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeLeaveBalance = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeLeaveBalance(employeeId);
            setEmployeeLeaveBalance(res.data?.data);
        } catch (err) {
            toast.error('Failed to load employee leave balance');
        } finally {
            setLoading(false);
        }
    }, []);

    const applyLeave = async (data) => {
        setLoading(true);
        try {
            await hrApi.applyLeave(data);
            toast.success('Leave application submitted');
            await fetchMyLeaves();
            await fetchMyLeaveBalance();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to apply leave');
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
            toast.error('Failed to process leave');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ==================== Salary ====================
    const fetchMySalarySlips = useCallback(async () => {
        setLoading(true);
        try {
            const res = await hrApi.getMySalarySlips();
            setSalarySlips(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load salary slips');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeSalarySlips = useCallback(async (employeeId) => {
        setLoading(true);
        try {
            const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
            setEmployeeSalarySlips(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load employee salary slips');
        } finally {
            setLoading(false);
        }
    }, []);

    const generateSalarySlip = async (data) => {
        setLoading(true);
        try {
            const res = await hrApi.generateSalarySlip(data);
            toast.success('Salary slip generated');
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to generate salary slip');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateSalaryStatus = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateSalarySlipStatus(id, data);
            toast.success('Salary status updated');
            return true;
        } catch (err) {
            toast.error('Failed to update status');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ==================== Shifts ====================
    const fetchShifts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await hrApi.getAllShifts();
            setShifts(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load shifts');
        } finally {
            setLoading(false);
        }
    }, []);

    const createShift = async (data) => {
        setLoading(true);
        try {
            await hrApi.createShift(data);
            toast.success('Shift created');
            await fetchShifts();
            return true;
        } catch (err) {
            toast.error('Failed to create shift');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateShift = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateShift(id, data);
            toast.success('Shift updated');
            await fetchShifts();
            return true;
        } catch (err) {
            toast.error('Failed to update shift');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteShift = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteShift(id);
            toast.success('Shift deleted');
            await fetchShifts();
        } catch (err) {
            toast.error('Failed to delete shift');
        } finally {
            setLoading(false);
        }
    };

    const assignShiftToEmployee = async (data) => {
        setLoading(true);
        try {
            await hrApi.assignShiftToEmployee(data);
            toast.success('Shift assigned');
            return true;
        } catch (err) {
            toast.error('Failed to assign shift');
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
        } catch (err) {
            toast.error('Failed to load employee shift');
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
            toast.error('Failed to load labors');
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
            toast.error('Failed to load labor details');
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
            toast.success('Labor created');
            await fetchLabors();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create labor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateLabor = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateLabor(id, data);
            toast.success('Labor updated');
            await fetchLabors();
            return true;
        } catch (err) {
            toast.error('Failed to update labor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteLabor = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteLabor(id);
            toast.success('Labor deleted');
            await fetchLabors();
        } catch (err) {
            toast.error('Failed to delete labor');
        } finally {
            setLoading(false);
        }
    };

    // Labor Wages
    const fetchLaborWages = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllLaborWages(params);
            setLaborWages(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load labor wages');
        } finally {
            setLoading(false);
        }
    }, []);

    const createLaborWage = async (data) => {
        setLoading(true);
        try {
            await hrApi.createLaborWage(data);
            toast.success('Labor wage created');
            await fetchLaborWages();
            return true;
        } catch (err) {
            toast.error('Failed to create labor wage');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateLaborWage = async (id, data) => {
        setLoading(true);
        try {
            await hrApi.updateLaborWage(id, data);
            toast.success('Labor wage updated');
            await fetchLaborWages();
            return true;
        } catch (err) {
            toast.error('Failed to update labor wage');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteLaborWage = async (id) => {
        setLoading(true);
        try {
            await hrApi.deleteLaborWage(id);
            toast.success('Labor wage deleted');
            await fetchLaborWages();
        } catch (err) {
            toast.error('Failed to delete labor wage');
        } finally {
            setLoading(false);
        }
    };

    // Labor Attendance
    const fetchLaborAttendance = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getLaborAttendance(params);
            setLaborAttendance(res.data?.data?.attendances || []);
            return res.data?.data;
        } catch (err) {
            toast.error('Failed to load labor attendance');
        } finally {
            setLoading(false);
        }
    }, []);

    const markLaborAttendance = async (data) => {
        setLoading(true);
        try {
            await hrApi.markLaborAttendance(data);
            toast.success('Labor attendance marked');
            await fetchLaborAttendance();
            return true;
        } catch (err) {
            toast.error('Failed to mark labor attendance');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const markBulkLaborAttendance = async (data) => {
        setLoading(true);
        try {
            await hrApi.markBulkLaborAttendance(data);
            toast.success('Bulk attendance marked');
            await fetchLaborAttendance();
            return true;
        } catch (err) {
            toast.error('Failed to mark bulk attendance');
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
            toast.error('Failed to load attendance summary');
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
            toast.error('Failed to load daily attendance');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== Announcements ====================
    const fetchAnnouncements = useCallback(async () => {
        try {
            const res = await hrApi.getAllAnnouncements();
            setAnnouncements(res.data?.data || []);
        } catch (err) {
            toast.error('Failed to load announcements');
        }
    }, []);

    const createAnnouncement = async (data) => {
        setLoading(true);
        try {
            await hrApi.createAnnouncement(data);
            toast.success('Announcement posted');
            await fetchAnnouncements();
            return true;
        } catch (err) {
            toast.error('Failed to create announcement');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        // Data
        employees, employee, employeeStats,
        departments, departmentEmployees,
        attendanceRecords, myAttendance, attendanceStats, todayAnalytics,
        leaves, myLeaves, leaveBalance, employeeLeaveBalance,
        salarySlips, employeeSalarySlips,
        shifts, employeeShift,
        labors, labor, laborStats, laborWages, laborAttendance, laborAttendanceSummary,
        announcements,
        loading, pagination,
        // Employee actions
        fetchEmployees, fetchEmployeeById, fetchEmployeeStats,
        createEmployee, updateEmployee, deleteEmployee,
        // Department actions
        fetchDepartments, fetchDepartmentEmployees,
        createDepartment, updateDepartment, deleteDepartment,
        // Attendance actions
        checkIn, checkOut,
        fetchMyAttendance, fetchAllAttendance, fetchEmployeeAttendanceById,
        fetchAttendanceStats, fetchTodayAnalytics,
        // Leave actions
        fetchLeaves, fetchMyLeaves, fetchMyLeaveBalance, fetchEmployeeLeaveBalance,
        applyLeave, processLeave,
        // Salary actions
        fetchMySalarySlips, fetchEmployeeSalarySlips, generateSalarySlip, updateSalaryStatus,
        // Shift actions
        fetchShifts, createShift, updateShift, deleteShift, assignShiftToEmployee, fetchEmployeeCurrentShift,
        // Labor actions
        fetchLabors, fetchLaborById, fetchLaborStats, createLabor, updateLabor, deleteLabor,
        fetchLaborWages, createLaborWage, updateLaborWage, deleteLaborWage,
        fetchLaborAttendance, markLaborAttendance, markBulkLaborAttendance,
        fetchLaborAttendanceSummary, fetchDailyLaborAttendance,
        // Announcement actions
        fetchAnnouncements, createAnnouncement,
    };
};