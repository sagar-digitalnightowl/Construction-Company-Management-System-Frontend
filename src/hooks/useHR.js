// // 
// // src/hooks/useHR.ts

// import { useState, useCallback } from "react";
// import { toast } from "sonner";
// import { hrApi } from "@/api/hrApi";

// export const useHR = () => {
//     // ---- Employees (global list) ----
//     const [employees, setEmployees] = useState({
//         employees: [],
//         pagination: { page: 1, limit: 10, total: 0, pages: 0 },
//     });
//     const [employee, setEmployee] = useState(null);
//     const [employeeStats, setEmployeeStats] = useState(null);

//     // ---- Current employee specific data (for detail view) ----
//     const [currentEmployeeAttendance, setCurrentEmployeeAttendance] = useState([]);
//     const [currentEmployeeLeaves, setCurrentEmployeeLeaves] = useState([]);
//     const [currentEmployeeSalarySlips, setCurrentEmployeeSalarySlips] = useState([]);
//     const [currentEmployeeLeaveBalance, setCurrentEmployeeLeaveBalance] = useState(null);

//     // ---- Departments ----
//     const [departments, setDepartments] = useState([]);
//     const [departmentEmployees, setDepartmentEmployees] = useState([]);

//     // ---- Attendance (global) ----
//     const [attendanceRecords, setAttendanceRecords] = useState([]);
//     const [myAttendance, setMyAttendance] = useState({});
//     const [attendanceStats, setAttendanceStats] = useState(null);
//     const [todayAnalytics, setTodayAnalytics] = useState(null);

//     // ---- Leaves (global) ----
//     const [leaves, setLeaves] = useState([]);
//     const [myLeaves, setMyLeaves] = useState([]);
//     const [leaveBalance, setLeaveBalance] = useState(null);
//     const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(null);

//     // ---- Salary & Payroll (global) ----
//     const [salarySlips, setSalarySlips] = useState([]);
//     const [employeeSalarySlips, setEmployeeSalarySlips] = useState([]);
//     const [companySalarySlips, setCompanySalarySlips] = useState([]);
//     const [myPayrollBatches, setMyPayrollBatches] = useState([]);

//     // ---- Shifts ----
//     const [shifts, setShifts] = useState([]);
//     const [employeeShift, setEmployeeShift] = useState(null);

//     // ---- Labors ----
//     const [labors, setLabors] = useState([]);
//     const [labor, setLabor] = useState(null);
//     const [laborStats, setLaborStats] = useState(null);
//     const [laborWages, setLaborWages] = useState([]);
//     const [laborAttendance, setLaborAttendance] = useState([]);
//     const [laborAttendanceSummary, setLaborAttendanceSummary] = useState(null);

//     // ---- Announcements ----
//     const [announcements, setAnnouncements] = useState([]);

//     // ---- Common ----
//     const [loading, setLoading] = useState(false);
//     const [pagination, setPagination] = useState({
//         page: 1,
//         limit: 10,
//         total: 0,
//         pages: 0,
//     });

//     // ==================== Employees ====================
//     const fetchEmployees = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllEmployees(params);
//             const data = res.data?.data || {};
//             setEmployees({
//                 employees: data.employees || [],
//                 pagination: data.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
//             });
//         } catch (err) {
//             toast.error("Failed to load employees");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeById = useCallback(async (id) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeById(id);
//             setEmployee(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee details");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ---- Employee specific data fetchers (sets dedicated state) ----
//     const fetchCurrentEmployeeAttendance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAttendanceById(employeeId);
//             setCurrentEmployeeAttendance(res.data?.data?.records || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeLeaves = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLeaves({ employeeId });
//             setCurrentEmployeeLeaves(res.data?.data?.leaves || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leaves");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeLeaveBalance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeLeaveBalance(employeeId);
//             setCurrentEmployeeLeaveBalance(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leave balance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeSalarySlips = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
//             setCurrentEmployeeSalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getEmployeeStats();
//             setEmployeeStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const createEmployee = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createEmployee(data);
//             toast.success("Employee created");
//             await fetchEmployees();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getPresignedUrl = async (file, fileType) => {
//         try {
//             const res = await hrApi.getPresignedUrl({
//                 fileName: file.name,
//                 fileType,
//                 mimeType: file.type,
//             });
//             return res.data.data;
//         } catch (err) {
//             toast.error("Failed to get upload URL");
//             throw err;
//         }
//     };

//     const uploadFileToS3 = async (uploadUrl, file) => {
//         await fetch(uploadUrl, {
//             method: "PUT",
//             body: file,
//             headers: { "Content-Type": file.type },
//         });
//     };

//     const confirmUpload = async (fileKey, fileType) => {
//         const res = await hrApi.confirmUpload({ fileKey, fileType });
//         return res.data.data;
//     };

//     const uploadFile = async (file, fileType) => {
//         setLoading(true);
//         try {
//             const { uploadUrl, fileKey, publicUrl } = await getPresignedUrl(file, fileType);
//             await uploadFileToS3(uploadUrl, file);
//             const { fileUrl } = await confirmUpload(fileKey, fileType);
//             toast.success(`${fileType} uploaded`);
//             return publicUrl;
//         } catch (err) {
//             toast.error("Upload failed");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const registerEmployee = async (data) => {
//         setLoading(true)
//         try {
//             const res = await hrApi.registerEmployee(data);
//             toast.success("Employee created");
//             return res.data;
//         } catch (error) {
//             console.error(error);
//             toast.error(error?.response?.data?.message || "Failed to create employee");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const verifyOtp = async (payload) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.verifyOtp(payload);
//             toast.success(res.data?.message || "OTP verified successfully");
//             return res.data;
//         } catch (err) {
//             toast.error(err?.response?.data?.message || "OTP verification failed");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateEmployee = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateEmployee(id, data);
//             toast.success("Employee updated");
//             await fetchEmployees();
//             return true;
//         } catch (err) {
//             console.log("Error : ", err);    
//             toast.error("Failed to update employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteEmployee = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteEmployee(id);
//             toast.success("Employee deleted");
//             await fetchEmployees();
//         } catch (err) {
//             toast.error("Failed to delete employee");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteUser = useCallback(async (userId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.deleteUser(userId);
//             toast.success(res.data?.message || "Employee deleted successfully");
//             return true;
//         } catch (err) {
//             toast.error(err?.response?.data?.message || "Failed to delete employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Departments ====================
//     const fetchDepartments = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllDepartments();
//             setDepartments(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load departments");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchDepartmentEmployees = useCallback(async (departmentId, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeesByDepartment(departmentId, params);
//             setDepartmentEmployees(res.data?.data?.employees || []);
//         } catch (err) {
//             toast.error("Failed to load department employees");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createDepartment = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createDepartment(data);
//             toast.success("Department created");
//             await fetchDepartments();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create department");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateDepartment = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateDepartment(id, data);
//             toast.success("Department updated");
//             await fetchDepartments();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update department");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteDepartment = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteDepartment(id);
//             toast.success("Department deleted");
//             await fetchDepartments();
//         } catch (err) {
//             toast.error("Failed to delete department");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== Attendance (global) ====================
//     const checkIn = async () => {
//         setLoading(true);
//         try {
//             await hrApi.checkIn();
//             toast.success("Checked in successfully");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Check-in failed");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const checkOut = async () => {
//         setLoading(true);
//         try {
//             await hrApi.checkOut();
//             toast.success("Checked out successfully");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Check-out failed");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMyAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyAttendance(params);
//             setMyAttendance(res.data?.data || {});
//         } catch (err) {
//             toast.error("Failed to load your attendance");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchAllAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllAttendance(params);
//             setAttendanceRecords(res.data?.data?.attendance || []);
//         } catch (err) {
//             toast.error("Failed to load attendance records");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchAttendanceStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getAttendanceStats();
//             setAttendanceStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const fetchTodayAnalytics = useCallback(async () => {
//         try {
//             const res = await hrApi.getTodayAttendanceAnalytics();
//             setTodayAnalytics(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     // ==================== Leaves (global) ====================
//     const fetchLeaves = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLeaves(params);
//             setLeaves(res.data?.data?.leaves || []);
//         } catch (err) {
//             toast.error("Failed to load leaves");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMyLeaves = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyLeaves(params);
//             setMyLeaves(res.data?.data?.leaves || []);
//         } catch (err) {
//             toast.error("Failed to load your leaves");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMyLeaveBalance = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyLeaveBalance();
//             setLeaveBalance(res.data?.data);
//         } catch (err) {
//             toast.error("Failed to load leave balance");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeLeaveBalance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeLeaveBalance(employeeId);
//             setEmployeeLeaveBalance(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leave balance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const applyLeave = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.applyLeave(data);
//             toast.success("Leave application submitted");
//             await fetchMyLeaves();
//             await fetchMyLeaveBalance();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to apply leave");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const processLeave = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.processLeave(id, data);
//             toast.success(`Leave ${data.status}`);
//             await fetchLeaves();
//             return true;
//         } catch (err) {
//             toast.error("Failed to process leave");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== Salary (global) ====================
    
//     const fetchAllSalarySlips = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllSalarySlips(params);
//             setCompanySalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load company salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMySalarySlips = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMySalarySlips();
//             setSalarySlips(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load salary slips");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeSalarySlips = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
//             setEmployeeSalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const generateSalarySlip = async (data) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.generateSalarySlip(data);
//             toast.success("Salary slip generated");
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to generate salary slip");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ NEW: Bulk Generate Salary Slips
//     const generateBulkSalarySlips = async (data) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.generateBulkSalarySlips(data);
//             toast.success(res.data?.message || "Bulk salary slips generated successfully");
//             return res.data?.data;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to generate bulk salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateSalaryStatus = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateSalarySlipStatus(id, data);
//             toast.success("Salary status updated");
//             return true;
//         } catch (err) {
//             toast.error("Failed to update status");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadSalaryReport = async (params) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.downloadSalaryReport(params);
//             const url = window.URL.createObjectURL(new Blob([res.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `Salary_Report_${params.month}_${params.year}.xlsx`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             toast.success("Salary report downloaded");
//             return true;
//         } catch (err) {
//             toast.error("Failed to download salary report");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadSalarySlipPdf = useCallback(async (slipId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.downloadSalarySlipPdf(slipId);
//             const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `salary-slip-${slipId}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             toast.success('Salary slip downloaded');
//             return true;
//         } catch (err) {
//             toast.error('Failed to download salary slip');
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const submitPayrollForApproval = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.submitPayrollForApproval(data);
//             toast.success("Payroll batch submitted to Finance");
//             await fetchMyPayrollBatches(); 
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to submit payroll batch");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMyPayrollBatches = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyPayrollBatches(params);
//             setMyPayrollBatches(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load payroll batches");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Shifts ====================
//     const fetchShifts = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllShifts();
//             setShifts(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load shifts");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createShift = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createShift(data);
//             toast.success("Shift created");
//             await fetchShifts();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateShift = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateShift(id, data);
//             toast.success("Shift updated");
//             await fetchShifts();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteShift = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteShift(id);
//             toast.success("Shift deleted");
//             await fetchShifts();
//         } catch (err) {
//             toast.error("Failed to delete shift");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const assignShiftToEmployee = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.assignShiftToEmployee(data);
//             toast.success("Shift assigned");
//             return true;
//         } catch (err) {
//             toast.error("Failed to assign shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchEmployeeCurrentShift = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeCurrentShift(employeeId);
//             setEmployeeShift(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee shift");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Labor Management ====================
//     const fetchLabors = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLabors(params);
//             setLabors(res.data?.data?.labors || []);
//         } catch (err) {
//             toast.error("Failed to load labors");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchLaborById = useCallback(async (id) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborById(id);
//             setLabor(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load labor details");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchLaborStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getLaborStats();
//             setLaborStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const createLabor = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createLabor(data);
//             toast.success("Labor created");
//             await fetchLabors();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create labor");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateLabor = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateLabor(id, data);
//             toast.success("Labor updated");
//             await fetchLabors();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update labor");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteLabor = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteLabor(id);
//             toast.success("Labor deleted");
//             await fetchLabors();
//         } catch (err) {
//             toast.error("Failed to delete labor");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Labor Wages
//     const fetchLaborWages = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLaborWages(params);
//             setLaborWages(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load labor wages");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createLaborWage = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createLaborWage(data);
//             toast.success("Labor wage created");
//             await fetchLaborWages();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create labor wage");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateLaborWage = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateLaborWage(id, data);
//             toast.success("Labor wage updated");
//             await fetchLaborWages();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update labor wage");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteLaborWage = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteLaborWage(id);
//             toast.success("Labor wage deleted");
//             await fetchLaborWages();
//         } catch (err) {
//             toast.error("Failed to delete labor wage");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Labor Attendance
//     const fetchLaborAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborAttendance(params);
//             setLaborAttendance(res.data?.data?.attendances || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load labor attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const markLaborAttendance = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.markLaborAttendance(data);
//             toast.success("Labor attendance marked");
//             await fetchLaborAttendance();
//             return true;
//         } catch (err) {
//             toast.error("Failed to mark labor attendance");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const markBulkLaborAttendance = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.markBulkLaborAttendance(data);
//             toast.success("Bulk attendance marked");
//             await fetchLaborAttendance();
//             return true;
//         } catch (err) {
//             toast.error("Failed to mark bulk attendance");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchLaborAttendanceSummary = useCallback(async (laborId, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborAttendanceSummary(laborId, params);
//             setLaborAttendanceSummary(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load attendance summary");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchDailyLaborAttendance = useCallback(async (date, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getDailyLaborAttendance(date, params);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load daily attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Announcements ====================
//     const fetchAnnouncements = useCallback(async () => {
//         try {
//             const res = await hrApi.getAllAnnouncements();
//             setAnnouncements(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load announcements");
//         }
//     }, []);

//     const createAnnouncement = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createAnnouncement(data);
//             toast.success("Announcement posted");
//             await fetchAnnouncements();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create announcement");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         // Data
//         employees,
//         employee,
//         employeeStats,
//         departments,
//         departmentEmployees,
//         attendanceRecords,
//         myAttendance,
//         attendanceStats,
//         todayAnalytics,
//         leaves,
//         myLeaves,
//         leaveBalance,
//         employeeLeaveBalance,
//         salarySlips,
//         employeeSalarySlips,
//         companySalarySlips,
//         myPayrollBatches,
//         shifts,
//         employeeShift,
//         labors,
//         labor,
//         laborStats,
//         laborWages,
//         laborAttendance,
//         laborAttendanceSummary,
//         announcements,
//         loading,
//         pagination,

//         // Current employee specific data
//         currentEmployeeAttendance,
//         currentEmployeeLeaves,
//         currentEmployeeSalarySlips,
//         currentEmployeeLeaveBalance,

//         // Employee actions
//         fetchEmployees,
//         fetchEmployeeById,
//         fetchEmployeeStats,
//         createEmployee,
//         uploadFile,
//         registerEmployee,
//         verifyOtp,
//         updateEmployee,
//         deleteEmployee,
//         deleteUser,

//         // Current employee specific fetchers
//         fetchCurrentEmployeeAttendance,
//         fetchCurrentEmployeeLeaves,
//         fetchCurrentEmployeeLeaveBalance,
//         fetchCurrentEmployeeSalarySlips,

//         // Department actions
//         fetchDepartments,
//         fetchDepartmentEmployees,
//         createDepartment,
//         updateDepartment,
//         deleteDepartment,

//         // Attendance actions
//         checkIn,
//         checkOut,
//         fetchMyAttendance,
//         fetchAllAttendance,
//         fetchAttendanceStats,
//         fetchTodayAnalytics,

//         // Leave actions
//         fetchLeaves,
//         fetchMyLeaves,
//         fetchMyLeaveBalance,
//         fetchEmployeeLeaveBalance,
//         applyLeave,
//         processLeave,

//         // Salary & Payroll actions
//         fetchAllSalarySlips,
//         fetchMySalarySlips,
//         fetchEmployeeSalarySlips,
//         generateSalarySlip,
//         generateBulkSalarySlips,   // ✅ NEW: Exported Action
//         updateSalaryStatus,
//         downloadSalaryReport,
//         downloadSalarySlipPdf,
//         submitPayrollForApproval,
//         fetchMyPayrollBatches,

//         // Shift actions
//         fetchShifts,
//         createShift,
//         updateShift,
//         deleteShift,
//         assignShiftToEmployee,
//         fetchEmployeeCurrentShift,

//         // Labor actions
//         fetchLabors,
//         fetchLaborById,
//         fetchLaborStats,
//         createLabor,
//         updateLabor,
//         deleteLabor,
//         fetchLaborWages,
//         createLaborWage,
//         updateLaborWage,
//         deleteLaborWage,
//         fetchLaborAttendance,
//         markLaborAttendance,
//         markBulkLaborAttendance,
//         fetchLaborAttendanceSummary,
//         fetchDailyLaborAttendance,

//         // Announcement actions
//         fetchAnnouncements,
//         createAnnouncement,
//     };
// };















// // src/hooks/useHR.ts

// import { useState, useCallback } from "react";
// import { toast } from "sonner";
// import { hrApi } from "@/api/hrApi";

// export const useHR = () => {
//     // ---- Employees (global list) ----
//     const [employees, setEmployees] = useState({
//         employees: [],
//         pagination: { page: 1, limit: 10, total: 0, pages: 0 },
//     });
//     const [employee, setEmployee] = useState(null);
//     const [employeeStats, setEmployeeStats] = useState(null);

//     // ---- Current employee specific data (for detail view) ----
//     const [currentEmployeeAttendance, setCurrentEmployeeAttendance] = useState([]);
//     const [currentEmployeeLeaves, setCurrentEmployeeLeaves] = useState([]);
//     const [currentEmployeeSalarySlips, setCurrentEmployeeSalarySlips] = useState([]);
//     const [currentEmployeeLeaveBalance, setCurrentEmployeeLeaveBalance] = useState(null);

//     // ---- Departments ----
//     const [departments, setDepartments] = useState([]);
//     const [departmentEmployees, setDepartmentEmployees] = useState([]);

//     // ---- Attendance (global) ----
//     const [attendanceRecords, setAttendanceRecords] = useState([]);
//     const [myAttendance, setMyAttendance] = useState({});
//     const [attendanceStats, setAttendanceStats] = useState(null);
//     const [todayAnalytics, setTodayAnalytics] = useState(null);

//     // ---- Leaves (global) ----
//     const [leaves, setLeaves] = useState([]);
//     const [myLeaves, setMyLeaves] = useState([]);
//     const [leaveBalance, setLeaveBalance] = useState(null);
//     const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(null);

//     // ---- Salary & Payroll (global) ----
//     const [salarySlips, setSalarySlips] = useState([]);
//     const [employeeSalarySlips, setEmployeeSalarySlips] = useState([]);
//     const [companySalarySlips, setCompanySalarySlips] = useState([]);
//     const [myPayrollBatches, setMyPayrollBatches] = useState([]);

//     // ---- Shifts ----
//     const [shifts, setShifts] = useState([]);
//     const [employeeShift, setEmployeeShift] = useState(null);

//     // ---- Labors ----
//     const [labors, setLabors] = useState([]);
//     const [labor, setLabor] = useState(null);
//     const [laborStats, setLaborStats] = useState(null);
//     const [laborWages, setLaborWages] = useState([]);
//     const [laborAttendance, setLaborAttendance] = useState([]);
//     const [laborAttendanceSummary, setLaborAttendanceSummary] = useState(null);

//     // ---- Announcements ----
//     const [announcements, setAnnouncements] = useState([]);

//     // ---- Expenses (NEW) ----
//     const [myExpenses, setMyExpenses] = useState([]);
//     const [allExpenses, setAllExpenses] = useState([]); // For HR/Finance Approvals

//     // ---- Common ----
//     const [loading, setLoading] = useState(false);
//     const [pagination, setPagination] = useState({
//         page: 1,
//         limit: 10,
//         total: 0,
//         pages: 0,
//     });

//     // ==================== Employees ====================
//     const fetchEmployees = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllEmployees(params);
//             const data = res.data?.data || {};
//             setEmployees({
//                 employees: data.employees || [],
//                 pagination: data.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
//             });
//         } catch (err) {
//             toast.error("Failed to load employees");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeById = useCallback(async (id) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeById(id);
//             setEmployee(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee details");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ---- Employee specific data fetchers (sets dedicated state) ----
//     const fetchCurrentEmployeeAttendance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAttendanceById(employeeId);
//             setCurrentEmployeeAttendance(res.data?.data?.records || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeLeaves = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLeaves({ employeeId });
//             setCurrentEmployeeLeaves(res.data?.data?.leaves || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leaves");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeLeaveBalance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeLeaveBalance(employeeId);
//             setCurrentEmployeeLeaveBalance(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leave balance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeSalarySlips = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
//             setCurrentEmployeeSalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getEmployeeStats();
//             setEmployeeStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const createEmployee = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createEmployee(data);
//             toast.success("Employee created");
//             await fetchEmployees();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getPresignedUrl = async (file, fileType) => {
//         try {
//             const res = await hrApi.getPresignedUrl({
//                 fileName: file.name,
//                 fileType,
//                 mimeType: file.type,
//             });
//             return res.data.data;
//         } catch (err) {
//             toast.error("Failed to get upload URL");
//             throw err;
//         }
//     };

//     const uploadFileToS3 = async (uploadUrl, file) => {
//         await fetch(uploadUrl, {
//             method: "PUT",
//             body: file,
//             headers: { "Content-Type": file.type },
//         });
//     };

//     const confirmUpload = async (fileKey, fileType) => {
//         const res = await hrApi.confirmUpload({ fileKey, fileType });
//         return res.data.data;
//     };

//     const uploadFile = async (file, fileType) => {
//         setLoading(true);
//         try {
//             const { uploadUrl, fileKey, publicUrl } = await getPresignedUrl(file, fileType);
//             await uploadFileToS3(uploadUrl, file);
//             const { fileUrl } = await confirmUpload(fileKey, fileType);
//             toast.success(`${fileType} uploaded`);
//             return publicUrl;
//         } catch (err) {
//             toast.error("Upload failed");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const registerEmployee = async (data) => {
//         setLoading(true)
//         try {
//             const res = await hrApi.registerEmployee(data);
//             toast.success("Employee created");
//             return res.data;
//         } catch (error) {
//             console.error(error);
//             toast.error(error?.response?.data?.message || "Failed to create employee");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const verifyOtp = async (payload) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.verifyOtp(payload);
//             toast.success(res.data?.message || "OTP verified successfully");
//             return res.data;
//         } catch (err) {
//             toast.error(err?.response?.data?.message || "OTP verification failed");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateEmployee = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateEmployee(id, data);
//             toast.success("Employee updated");
//             await fetchEmployees();
//             return true;
//         } catch (err) {
//             console.log("Error : ", err);    
//             toast.error("Failed to update employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteEmployee = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteEmployee(id);
//             toast.success("Employee deleted");
//             await fetchEmployees();
//         } catch (err) {
//             toast.error("Failed to delete employee");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteUser = useCallback(async (userId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.deleteUser(userId);
//             toast.success(res.data?.message || "Employee deleted successfully");
//             return true;
//         } catch (err) {
//             toast.error(err?.response?.data?.message || "Failed to delete employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Departments ====================
//     const fetchDepartments = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllDepartments();
//             setDepartments(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load departments");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchDepartmentEmployees = useCallback(async (departmentId, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeesByDepartment(departmentId, params);
//             setDepartmentEmployees(res.data?.data?.employees || []);
//         } catch (err) {
//             toast.error("Failed to load department employees");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createDepartment = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createDepartment(data);
//             toast.success("Department created");
//             await fetchDepartments();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create department");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateDepartment = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateDepartment(id, data);
//             toast.success("Department updated");
//             await fetchDepartments();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update department");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteDepartment = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteDepartment(id);
//             toast.success("Department deleted");
//             await fetchDepartments();
//         } catch (err) {
//             toast.error("Failed to delete department");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== Attendance (global) ====================
//     const checkIn = async () => {
//         setLoading(true);
//         try {
//             await hrApi.checkIn();
//             toast.success("Checked in successfully");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Check-in failed");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const checkOut = async () => {
//         setLoading(true);
//         try {
//             await hrApi.checkOut();
//             toast.success("Checked out successfully");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Check-out failed");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMyAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyAttendance(params);
//             setMyAttendance(res.data?.data || {});
//         } catch (err) {
//             toast.error("Failed to load your attendance");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchAllAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllAttendance(params);
//             setAttendanceRecords(res.data?.data?.attendance || []);
//         } catch (err) {
//             toast.error("Failed to load attendance records");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchAttendanceStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getAttendanceStats();
//             setAttendanceStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const fetchTodayAnalytics = useCallback(async () => {
//         try {
//             const res = await hrApi.getTodayAttendanceAnalytics();
//             setTodayAnalytics(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     // ==================== Leaves (global) ====================
//     const fetchLeaves = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLeaves(params);
//             setLeaves(res.data?.data?.leaves || []);
//         } catch (err) {
//             toast.error("Failed to load leaves");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMyLeaves = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyLeaves(params);
//             setMyLeaves(res.data?.data?.leaves || []);
//         } catch (err) {
//             toast.error("Failed to load your leaves");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMyLeaveBalance = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyLeaveBalance();
//             setLeaveBalance(res.data?.data);
//         } catch (err) {
//             toast.error("Failed to load leave balance");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeLeaveBalance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeLeaveBalance(employeeId);
//             setEmployeeLeaveBalance(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leave balance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const applyLeave = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.applyLeave(data);
//             toast.success("Leave application submitted");
//             await fetchMyLeaves();
//             await fetchMyLeaveBalance();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to apply leave");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const processLeave = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.processLeave(id, data);
//             toast.success(`Leave ${data.status}`);
//             await fetchLeaves();
//             return true;
//         } catch (err) {
//             toast.error("Failed to process leave");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== Salary (global) ====================
    
//     const fetchAllSalarySlips = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllSalarySlips(params);
//             setCompanySalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load company salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMySalarySlips = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMySalarySlips();
//             setSalarySlips(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load salary slips");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeSalarySlips = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
//             setEmployeeSalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const generateSalarySlip = async (data) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.generateSalarySlip(data);
//             toast.success("Salary slip generated");
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to generate salary slip");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ NEW: Bulk Generate Salary Slips
//     const generateBulkSalarySlips = async (data) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.generateBulkSalarySlips(data);
//             toast.success(res.data?.message || "Bulk salary slips generated successfully");
//             return res.data?.data;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to generate bulk salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateSalaryStatus = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateSalarySlipStatus(id, data);
//             toast.success("Salary status updated");
//             return true;
//         } catch (err) {
//             toast.error("Failed to update status");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadSalaryReport = async (params) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.downloadSalaryReport(params);
//             const url = window.URL.createObjectURL(new Blob([res.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `Salary_Report_${params.month}_${params.year}.xlsx`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             toast.success("Salary report downloaded");
//             return true;
//         } catch (err) {
//             toast.error("Failed to download salary report");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadSalarySlipPdf = useCallback(async (slipId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.downloadSalarySlipPdf(slipId);
//             const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `salary-slip-${slipId}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             toast.success('Salary slip downloaded');
//             return true;
//         } catch (err) {
//             toast.error('Failed to download salary slip');
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const submitPayrollForApproval = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.submitPayrollForApproval(data);
//             toast.success("Payroll batch submitted to Finance");
//             await fetchMyPayrollBatches(); 
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to submit payroll batch");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMyPayrollBatches = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyPayrollBatches(params);
//             setMyPayrollBatches(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load payroll batches");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Shifts ====================
//     const fetchShifts = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllShifts();
//             setShifts(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load shifts");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createShift = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createShift(data);
//             toast.success("Shift created");
//             await fetchShifts();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateShift = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateShift(id, data);
//             toast.success("Shift updated");
//             await fetchShifts();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteShift = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteShift(id);
//             toast.success("Shift deleted");
//             await fetchShifts();
//         } catch (err) {
//             toast.error("Failed to delete shift");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const assignShiftToEmployee = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.assignShiftToEmployee(data);
//             toast.success("Shift assigned");
//             return true;
//         } catch (err) {
//             toast.error("Failed to assign shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchEmployeeCurrentShift = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeCurrentShift(employeeId);
//             setEmployeeShift(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee shift");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Labor Management ====================
//     const fetchLabors = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLabors(params);
//             setLabors(res.data?.data?.labors || []);
//         } catch (err) {
//             toast.error("Failed to load labors");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchLaborById = useCallback(async (id) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborById(id);
//             setLabor(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load labor details");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchLaborStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getLaborStats();
//             setLaborStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const createLabor = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createLabor(data);
//             toast.success("Labor created");
//             await fetchLabors();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create labor");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateLabor = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateLabor(id, data);
//             toast.success("Labor updated");
//             await fetchLabors();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update labor");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteLabor = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteLabor(id);
//             toast.success("Labor deleted");
//             await fetchLabors();
//         } catch (err) {
//             toast.error("Failed to delete labor");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Labor Wages
//     const fetchLaborWages = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLaborWages(params);
//             setLaborWages(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load labor wages");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createLaborWage = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createLaborWage(data);
//             toast.success("Labor wage created");
//             await fetchLaborWages();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create labor wage");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateLaborWage = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateLaborWage(id, data);
//             toast.success("Labor wage updated");
//             await fetchLaborWages();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update labor wage");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteLaborWage = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteLaborWage(id);
//             toast.success("Labor wage deleted");
//             await fetchLaborWages();
//         } catch (err) {
//             toast.error("Failed to delete labor wage");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Labor Attendance
//     const fetchLaborAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborAttendance(params);
//             setLaborAttendance(res.data?.data?.attendances || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load labor attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const markLaborAttendance = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.markLaborAttendance(data);
//             toast.success("Labor attendance marked");
//             await fetchLaborAttendance();
//             return true;
//         } catch (err) {
//             toast.error("Failed to mark labor attendance");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const markBulkLaborAttendance = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.markBulkLaborAttendance(data);
//             toast.success("Bulk attendance marked");
//             await fetchLaborAttendance();
//             return true;
//         } catch (err) {
//             toast.error("Failed to mark bulk attendance");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchLaborAttendanceSummary = useCallback(async (laborId, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborAttendanceSummary(laborId, params);
//             setLaborAttendanceSummary(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load attendance summary");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchDailyLaborAttendance = useCallback(async (date, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getDailyLaborAttendance(date, params);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load daily attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Announcements ====================
//     const fetchAnnouncements = useCallback(async () => {
//         try {
//             const res = await hrApi.getAllAnnouncements();
//             setAnnouncements(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load announcements");
//         }
//     }, []);

//     const createAnnouncement = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createAnnouncement(data);
//             toast.success("Announcement posted");
//             await fetchAnnouncements();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create announcement");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== Expenses (NEW & UPDATED) ====================
//     const fetchMyExpenses = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyExpenses(params);
//             setMyExpenses(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load your expenses");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createExpense = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createExpense(data);
//             toast.success("Expense ticket raised successfully!");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to raise ticket");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // --- Added for Expense Approvals Page (HR & Finance) ---
//     const fetchAllExpenses = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllExpenses(params);
//             setAllExpenses(res.data?.data || []);
//             if (res.data?.pagination) setPagination(res.data.pagination);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load company expenses");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const approveExpense = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.approveExpense(id, data);
//             toast.success("Expense approved successfully!");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to approve expense");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const rejectExpense = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.rejectExpense(id, data);
//             toast.success("Expense rejected successfully!");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to reject expense");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const payExpense = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.payExpense(id, data);
//             toast.success("Expense paid successfully!");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to process payment");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         // Data
//         employees,
//         employee,
//         employeeStats,
//         departments,
//         departmentEmployees,
//         attendanceRecords,
//         myAttendance,
//         attendanceStats,
//         todayAnalytics,
//         leaves,
//         myLeaves,
//         leaveBalance,
//         employeeLeaveBalance,
//         salarySlips,
//         employeeSalarySlips,
//         companySalarySlips,
//         myPayrollBatches,
//         shifts,
//         employeeShift,
//         labors,
//         labor,
//         laborStats,
//         laborWages,
//         laborAttendance,
//         laborAttendanceSummary,
//         announcements,
        
//         // Expenses (Exporting ALL)
//         myExpenses,
//         allExpenses,
//         fetchMyExpenses,
//         createExpense,
//         fetchAllExpenses,
//         approveExpense,
//         rejectExpense,
//         payExpense,

//         loading,
//         pagination,

//         // Current employee specific data
//         currentEmployeeAttendance,
//         currentEmployeeLeaves,
//         currentEmployeeSalarySlips,
//         currentEmployeeLeaveBalance,

//         // Employee actions
//         fetchEmployees,
//         fetchEmployeeById,
//         fetchEmployeeStats,
//         createEmployee,
//         uploadFile,
//         registerEmployee,
//         verifyOtp,
//         updateEmployee,
//         deleteEmployee,
//         deleteUser,

//         // Current employee specific fetchers
//         fetchCurrentEmployeeAttendance,
//         fetchCurrentEmployeeLeaves,
//         fetchCurrentEmployeeLeaveBalance,
//         fetchCurrentEmployeeSalarySlips,

//         // Department actions
//         fetchDepartments,
//         fetchDepartmentEmployees,
//         createDepartment,
//         updateDepartment,
//         deleteDepartment,

//         // Attendance actions
//         checkIn,
//         checkOut,
//         fetchMyAttendance,
//         fetchAllAttendance,
//         fetchAttendanceStats,
//         fetchTodayAnalytics,

//         // Leave actions
//         fetchLeaves,
//         fetchMyLeaves,
//         fetchMyLeaveBalance,
//         fetchEmployeeLeaveBalance,
//         applyLeave,
//         processLeave,

//         // Salary & Payroll actions
//         fetchAllSalarySlips,
//         fetchMySalarySlips,
//         fetchEmployeeSalarySlips,
//         generateSalarySlip,
//         generateBulkSalarySlips, 
//         updateSalaryStatus,
//         downloadSalaryReport,
//         downloadSalarySlipPdf,
//         submitPayrollForApproval,
//         fetchMyPayrollBatches,

//         // Shift actions
//         fetchShifts,
//         createShift,
//         updateShift,
//         deleteShift,
//         assignShiftToEmployee,
//         fetchEmployeeCurrentShift,

//         // Labor actions
//         fetchLabors,
//         fetchLaborById,
//         fetchLaborStats,
//         createLabor,
//         updateLabor,
//         deleteLabor,
//         fetchLaborWages,
//         createLaborWage,
//         updateLaborWage,
//         deleteLaborWage,
//         fetchLaborAttendance,
//         markLaborAttendance,
//         markBulkLaborAttendance,
//         fetchLaborAttendanceSummary,
//         fetchDailyLaborAttendance,

//         // Announcement actions
//         fetchAnnouncements,
//         createAnnouncement,
//     };
// };



// import { useState, useCallback } from "react";
// import { toast } from "sonner";
// import { hrApi } from "@/api/hrApi";

// export const useHR = () => {
//     // ---- Employees (global list) ----
//     const [employees, setEmployees] = useState({
//         employees: [],
//         pagination: { page: 1, limit: 10, total: 0, pages: 0 },
//     });
//     const [employee, setEmployee] = useState(null);
//     const [employeeStats, setEmployeeStats] = useState(null);

//     // ---- Current employee specific data (for detail view) ----
//     const [currentEmployeeAttendance, setCurrentEmployeeAttendance] = useState([]);
//     const [currentEmployeeLeaves, setCurrentEmployeeLeaves] = useState([]);
//     const [currentEmployeeSalarySlips, setCurrentEmployeeSalarySlips] = useState([]);
//     const [currentEmployeeLeaveBalance, setCurrentEmployeeLeaveBalance] = useState(null);

//     // ---- Departments ----
//     const [departments, setDepartments] = useState([]);
//     const [departmentEmployees, setDepartmentEmployees] = useState([]);

//     // ---- Attendance (global) ----
//     const [attendanceRecords, setAttendanceRecords] = useState([]);
//     const [myAttendance, setMyAttendance] = useState({});
//     const [attendanceStats, setAttendanceStats] = useState(null);
//     const [todayAnalytics, setTodayAnalytics] = useState(null);

//     // ---- Leaves (global) ----
//     const [leaves, setLeaves] = useState([]);
//     const [myLeaves, setMyLeaves] = useState([]);
//     const [leaveBalance, setLeaveBalance] = useState(null);
//     const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(null);

//     // ---- Salary & Payroll (global) ----
//     const [salarySlips, setSalarySlips] = useState([]);
//     const [employeeSalarySlips, setEmployeeSalarySlips] = useState([]);
//     const [companySalarySlips, setCompanySalarySlips] = useState([]);
//     const [myPayrollBatches, setMyPayrollBatches] = useState([]);

//     // ---- Shifts ----
//     const [shifts, setShifts] = useState([]);
//     const [employeeShift, setEmployeeShift] = useState(null);

//     // ---- Labors ----
//     const [labors, setLabors] = useState([]);
//     const [labor, setLabor] = useState(null);
//     const [laborStats, setLaborStats] = useState(null);
//     const [laborWages, setLaborWages] = useState([]);
//     const [laborAttendance, setLaborAttendance] = useState([]);
//     const [laborAttendanceSummary, setLaborAttendanceSummary] = useState(null);

//     // ---- Announcements ----
//     const [announcements, setAnnouncements] = useState([]);

//     // ---- Expenses ----
//     const [myExpenses, setMyExpenses] = useState([]);
//     const [myExpensesPagination, setMyExpensesPagination] = useState({
//         page: 1,
//         limit: 10,
//         total: 0,
//         pages: 0,
//     });
//     const [allExpenses, setAllExpenses] = useState([]);
//     const [allExpensesPagination, setAllExpensesPagination] = useState({
//         page: 1,
//         limit: 10,
//         total: 0,
//         pages: 0,
//     });
//     const [expenseDetail, setExpenseDetail] = useState(null);

//     // ---- Common ----
//     const [loading, setLoading] = useState(false);
//     const [pagination, setPagination] = useState({
//         page: 1,
//         limit: 10,
//         total: 0,
//         pages: 0,
//     });

//     // ==================== Employees ====================
//     const fetchEmployees = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllEmployees(params);
//             const data = res.data?.data || {};
//             setEmployees({
//                 employees: data.employees || [],
//                 pagination: data.pagination || { page: 1, limit: 10, total: 0, pages: 0 },
//             });
//         } catch (err) {
//             toast.error("Failed to load employees");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeById = useCallback(async (id) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeById(id);
//             setEmployee(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee details");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ---- Employee specific data fetchers (sets dedicated state) ----
//     const fetchCurrentEmployeeAttendance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAttendanceById(employeeId);
//             setCurrentEmployeeAttendance(res.data?.data?.records || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeLeaves = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLeaves({ employeeId });
//             setCurrentEmployeeLeaves(res.data?.data?.leaves || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leaves");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeLeaveBalance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeLeaveBalance(employeeId);
//             setCurrentEmployeeLeaveBalance(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leave balance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchCurrentEmployeeSalarySlips = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
//             setCurrentEmployeeSalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getEmployeeStats();
//             setEmployeeStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const createEmployee = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createEmployee(data);
//             toast.success("Employee created");
//             await fetchEmployees();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getPresignedUrl = async (file, fileType) => {
//         try {
//             const res = await hrApi.getPresignedUrl({
//                 fileName: file.name,
//                 fileType,
//                 mimeType: file.type,
//             });
//             return res.data.data;
//         } catch (err) {
//             toast.error("Failed to get upload URL");
//             throw err;
//         }
//     };

//     const uploadFileToS3 = async (uploadUrl, file) => {
//         await fetch(uploadUrl, {
//             method: "PUT",
//             body: file,
//             headers: { "Content-Type": file.type },
//         });
//     };

//     const confirmUpload = async (fileKey, fileType) => {
//         const res = await hrApi.confirmUpload({ fileKey, fileType });
//         return res.data.data;
//     };

//     const uploadFile = async (file, fileType) => {
//         setLoading(true);
//         try {
//             const { uploadUrl, fileKey, publicUrl } = await getPresignedUrl(file, fileType);
//             await uploadFileToS3(uploadUrl, file);
//             const { fileUrl } = await confirmUpload(fileKey, fileType);
//             toast.success(`${fileType} uploaded`);
//             return publicUrl;
//         } catch (err) {
//             toast.error("Upload failed");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const registerEmployee = async (data) => {
//         setLoading(true)
//         try {
//             const res = await hrApi.registerEmployee(data);
//             toast.success("Employee created");
//             return res.data;
//         } catch (error) {
//             console.error(error);
//             toast.error(error?.response?.data?.message || "Failed to create employee");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const verifyOtp = async (payload) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.verifyOtp(payload);
//             toast.success(res.data?.message || "OTP verified successfully");
//             return res.data;
//         } catch (err) {
//             toast.error(err?.response?.data?.message || "OTP verification failed");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateEmployee = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateEmployee(id, data);
//             toast.success("Employee updated");
//             await fetchEmployees();
//             return true;
//         } catch (err) {
//             console.log("Error : ", err);    
//             toast.error("Failed to update employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteEmployee = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteEmployee(id);
//             toast.success("Employee deleted");
//             await fetchEmployees();
//         } catch (err) {
//             toast.error("Failed to delete employee");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteUser = useCallback(async (userId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.deleteUser(userId);
//             toast.success(res.data?.message || "Employee deleted successfully");
//             return true;
//         } catch (err) {
//             toast.error(err?.response?.data?.message || "Failed to delete employee");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Departments ====================
//     const fetchDepartments = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllDepartments();
//             setDepartments(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load departments");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchDepartmentEmployees = useCallback(async (departmentId, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeesByDepartment(departmentId, params);
//             setDepartmentEmployees(res.data?.data?.employees || []);
//         } catch (err) {
//             toast.error("Failed to load department employees");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createDepartment = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createDepartment(data);
//             toast.success("Department created");
//             await fetchDepartments();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create department");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateDepartment = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateDepartment(id, data);
//             toast.success("Department updated");
//             await fetchDepartments();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update department");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteDepartment = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteDepartment(id);
//             toast.success("Department deleted");
//             await fetchDepartments();
//         } catch (err) {
//             toast.error("Failed to delete department");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== Attendance (global) ====================
//     const checkIn = async () => {
//         setLoading(true);
//         try {
//             await hrApi.checkIn();
//             toast.success("Checked in successfully");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Check-in failed");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const checkOut = async () => {
//         setLoading(true);
//         try {
//             await hrApi.checkOut();
//             toast.success("Checked out successfully");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Check-out failed");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMyAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyAttendance(params);
//             setMyAttendance(res.data?.data || {});
//         } catch (err) {
//             toast.error("Failed to load your attendance");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchAllAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllAttendance(params);
//             setAttendanceRecords(res.data?.data?.attendance || []);
//         } catch (err) {
//             toast.error("Failed to load attendance records");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchAttendanceStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getAttendanceStats();
//             setAttendanceStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const fetchTodayAnalytics = useCallback(async () => {
//         try {
//             const res = await hrApi.getTodayAttendanceAnalytics();
//             setTodayAnalytics(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     // ==================== Leaves (global) ====================
//     const fetchLeaves = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLeaves(params);
//             setLeaves(res.data?.data?.leaves || []);
//         } catch (err) {
//             toast.error("Failed to load leaves");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMyLeaves = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyLeaves(params);
//             setMyLeaves(res.data?.data?.leaves || []);
//         } catch (err) {
//             toast.error("Failed to load your leaves");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMyLeaveBalance = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyLeaveBalance();
//             setLeaveBalance(res.data?.data);
//         } catch (err) {
//             toast.error("Failed to load leave balance");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeLeaveBalance = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeLeaveBalance(employeeId);
//             setEmployeeLeaveBalance(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee leave balance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const applyLeave = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.applyLeave(data);
//             toast.success("Leave application submitted");
//             await fetchMyLeaves();
//             await fetchMyLeaveBalance();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to apply leave");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const processLeave = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.processLeave(id, data);
//             toast.success(`Leave ${data.status}`);
//             await fetchLeaves();
//             return true;
//         } catch (err) {
//             toast.error("Failed to process leave");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== Salary (global) ====================
    
//     const fetchAllSalarySlips = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllSalarySlips(params);
//             setCompanySalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load company salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchMySalarySlips = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMySalarySlips();
//             setSalarySlips(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load salary slips");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchEmployeeSalarySlips = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeAllSalarySlips(employeeId);
//             setEmployeeSalarySlips(res.data?.data || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const generateSalarySlip = async (data) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.generateSalarySlip(data);
//             toast.success("Salary slip generated");
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to generate salary slip");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generateBulkSalarySlips = async (data) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.generateBulkSalarySlips(data);
//             toast.success(res.data?.message || "Bulk salary slips generated successfully");
//             return res.data?.data;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to generate bulk salary slips");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateSalaryStatus = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateSalarySlipStatus(id, data);
//             toast.success("Salary status updated");
//             return true;
//         } catch (err) {
//             toast.error("Failed to update status");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadSalaryReport = async (params) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.downloadSalaryReport(params);
//             const url = window.URL.createObjectURL(new Blob([res.data]));
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `Salary_Report_${params.month}_${params.year}.xlsx`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             toast.success("Salary report downloaded");
//             return true;
//         } catch (err) {
//             toast.error("Failed to download salary report");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadSalarySlipPdf = useCallback(async (slipId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.downloadSalarySlipPdf(slipId);
//             const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `salary-slip-${slipId}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             toast.success('Salary slip downloaded');
//             return true;
//         } catch (err) {
//             toast.error('Failed to download salary slip');
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const submitPayrollForApproval = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.submitPayrollForApproval(data);
//             toast.success("Payroll batch submitted to Finance");
//             await fetchMyPayrollBatches(); 
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to submit payroll batch");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMyPayrollBatches = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyPayrollBatches(params);
//             setMyPayrollBatches(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load payroll batches");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Shifts ====================
//     const fetchShifts = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllShifts();
//             setShifts(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load shifts");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createShift = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createShift(data);
//             toast.success("Shift created");
//             await fetchShifts();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateShift = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateShift(id, data);
//             toast.success("Shift updated");
//             await fetchShifts();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteShift = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteShift(id);
//             toast.success("Shift deleted");
//             await fetchShifts();
//         } catch (err) {
//             toast.error("Failed to delete shift");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const assignShiftToEmployee = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.assignShiftToEmployee(data);
//             toast.success("Shift assigned");
//             return true;
//         } catch (err) {
//             toast.error("Failed to assign shift");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchEmployeeCurrentShift = useCallback(async (employeeId) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getEmployeeCurrentShift(employeeId);
//             setEmployeeShift(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load employee shift");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Labor Management ====================
//     const fetchLabors = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLabors(params);
//             setLabors(res.data?.data?.labors || []);
//         } catch (err) {
//             toast.error("Failed to load labors");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchLaborById = useCallback(async (id) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborById(id);
//             setLabor(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load labor details");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchLaborStats = useCallback(async () => {
//         try {
//             const res = await hrApi.getLaborStats();
//             setLaborStats(res.data?.data);
//         } catch (err) {
//             console.error(err);
//         }
//     }, []);

//     const createLabor = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createLabor(data);
//             toast.success("Labor created");
//             await fetchLabors();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create labor");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateLabor = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateLabor(id, data);
//             toast.success("Labor updated");
//             await fetchLabors();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update labor");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteLabor = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteLabor(id);
//             toast.success("Labor deleted");
//             await fetchLabors();
//         } catch (err) {
//             toast.error("Failed to delete labor");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Labor Wages
//     const fetchLaborWages = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllLaborWages(params);
//             setLaborWages(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load labor wages");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const createLaborWage = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createLaborWage(data);
//             toast.success("Labor wage created");
//             await fetchLaborWages();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create labor wage");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateLaborWage = async (id, data) => {
//         setLoading(true);
//         try {
//             await hrApi.updateLaborWage(id, data);
//             toast.success("Labor wage updated");
//             await fetchLaborWages();
//             return true;
//         } catch (err) {
//             toast.error("Failed to update labor wage");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteLaborWage = async (id) => {
//         setLoading(true);
//         try {
//             await hrApi.deleteLaborWage(id);
//             toast.success("Labor wage deleted");
//             await fetchLaborWages();
//         } catch (err) {
//             toast.error("Failed to delete labor wage");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Labor Attendance
//     const fetchLaborAttendance = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborAttendance(params);
//             setLaborAttendance(res.data?.data?.attendances || []);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load labor attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const markLaborAttendance = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.markLaborAttendance(data);
//             toast.success("Labor attendance marked");
//             await fetchLaborAttendance();
//             return true;
//         } catch (err) {
//             toast.error("Failed to mark labor attendance");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const markBulkLaborAttendance = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.markBulkLaborAttendance(data);
//             toast.success("Bulk attendance marked");
//             await fetchLaborAttendance();
//             return true;
//         } catch (err) {
//             toast.error("Failed to mark bulk attendance");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchLaborAttendanceSummary = useCallback(async (laborId, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getLaborAttendanceSummary(laborId, params);
//             setLaborAttendanceSummary(res.data?.data);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load attendance summary");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const fetchDailyLaborAttendance = useCallback(async (date, params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getDailyLaborAttendance(date, params);
//             return res.data?.data;
//         } catch (err) {
//             toast.error("Failed to load daily attendance");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== Announcements ====================
//     const fetchAnnouncements = useCallback(async () => {
//         try {
//             const res = await hrApi.getAllAnnouncements();
//             setAnnouncements(res.data?.data || []);
//         } catch (err) {
//             toast.error("Failed to load announcements");
//         }
//     }, []);

//     const createAnnouncement = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createAnnouncement(data);
//             toast.success("Announcement posted");
//             await fetchAnnouncements();
//             return true;
//         } catch (err) {
//             toast.error("Failed to create announcement");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== EXPENSES (FIXED) ====================
    
//     /**
//      * Fetch current user's expenses with pagination and filtering
//      * @param {Object} params - Query parameters
//      * @param {string} params.status - Filter by status (Pending, Approved, Rejected, Paid)
//      * @param {string} params.search - Search by title or employee name
//      * @param {number} params.page - Page number (default: 1)
//      * @param {number} params.limit - Items per page (default: 10)
//      * @returns {Object} Response data with tickets and pagination
//      */
//     const fetchMyExpenses = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getMyExpenses(params);
//             const data = res.data?.data || {};
            
//             // ✅ API returns "tickets" array
//             const tickets = data.tickets || [];
//             setMyExpenses(Array.isArray(tickets) ? tickets : []);
            
//             // ✅ Set pagination data
//             if (data.pagination) {
//                 setMyExpensesPagination(data.pagination);
//             }
            
//             return data;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to load your expenses");
//             setMyExpenses([]);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     /**
//      * Create a new expense ticket
//      * @param {FormData} data - FormData with title, category, description, amount, proof
//      * @returns {boolean} Success status
//      */
//     const createExpense = async (data) => {
//         setLoading(true);
//         try {
//             await hrApi.createExpense(data);
//             toast.success("Expense ticket raised successfully!");
//             await fetchMyExpenses();
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to raise ticket");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     /**
//      * Fetch all expenses (Admin/HR/Finance) with pagination and filters
//      * @param {Object} params - Query parameters
//      * @param {string} params.status - Filter by status (Pending, Approved, Rejected, Paid)
//      * @param {string} params.category - Filter by category
//      * @param {string} params.employeeId - Filter by specific employee
//      * @param {string} params.search - Search by title or employee name
//      * @param {number} params.page - Page number (default: 1)
//      * @param {number} params.limit - Items per page (default: 10)
//      * @returns {Object} Response data with tickets and pagination
//      */
//     const fetchAllExpenses = useCallback(async (params = {}) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getAllExpenses(params);
//             const data = res.data?.data || {};
            
//             // ✅ API returns "tickets" array
//             const tickets = data.tickets || [];
//             setAllExpenses(Array.isArray(tickets) ? tickets : []);
            
//             // ✅ Set pagination data
//             if (data.pagination) {
//                 setAllExpensesPagination({
//                     page: data.pagination.page || 1,
//                     limit: data.pagination.limit || 10,
//                     total: data.pagination.total || 0,
//                     pages: data.pagination.pages || 0,
//                 });
//             }
            
//             return data;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to load expenses");
//             setAllExpenses([]);
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     /**
//      * Get single expense ticket details
//      * @param {string} id - Expense ID
//      * @returns {Object} Expense detail data
//      */
//     const fetchExpenseById = useCallback(async (id) => {
//         setLoading(true);
//         try {
//             const res = await hrApi.getExpenseById(id);
//             const data = res.data?.data;
//             setExpenseDetail(data);
//             return data;
//         } catch (err) {
//             toast.error("Failed to load expense details");
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     /**
//      * Approve an expense ticket (HR role)
//      * @param {string} id - Expense ID
//      * @param {Object} data - Approval data with optional remarks
//      * @param {string} data.remarks - Approval remarks (optional)
//      * @returns {boolean} Success status
//      */
//     const approveExpense = async (id, data = {}) => {
//         setLoading(true);
//         try {
//             await hrApi.approveExpense(id, data);
//             toast.success("Expense approved successfully!");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to approve expense");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     /**
//      * Reject an expense ticket (HR role)
//      * @param {string} id - Expense ID
//      * @param {Object} data - Rejection data with reason
//      * @param {string} data.reason - Reason for rejection (required)
//      * @returns {boolean} Success status
//      */
//     const rejectExpense = async (id, data = {}) => {
//         if (!data.reason?.trim()) {
//             toast.error("Rejection reason is required");
//             return false;
//         }
//         setLoading(true);
//         try {
//             await hrApi.rejectExpense(id, data);
//             toast.success("Expense rejected successfully!");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to reject expense");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     /**
//      * Mark expense as paid (Finance role)
//      * @param {string} id - Expense ID
//      * @param {Object} data - Payment data
//      * @param {string} data.paymentMethod - Payment method (UPI, Bank Transfer, Cheque, Cash, NEFT)
//      * @param {string} data.paymentReference - Payment reference/transaction ID
//      * @param {string} data.remarks - Payment remarks (optional)
//      * @returns {boolean} Success status
//      */
//     const payExpense = async (id, data = {}) => {
//         if (!data.paymentMethod || !data.paymentReference) {
//             toast.error("Payment method and reference are required");
//             return false;
//         }
//         setLoading(true);
//         try {
//             await hrApi.payExpense(id, data);
//             toast.success("Payment processed successfully!");
//             return true;
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to process payment");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         // Data
//         employees,
//         employee,
//         employeeStats,
//         departments,
//         departmentEmployees,
//         attendanceRecords,
//         myAttendance,
//         attendanceStats,
//         todayAnalytics,
//         leaves,
//         myLeaves,
//         leaveBalance,
//         employeeLeaveBalance,
//         salarySlips,
//         employeeSalarySlips,
//         companySalarySlips,
//         myPayrollBatches,
//         shifts,
//         employeeShift,
//         labors,
//         labor,
//         laborStats,
//         laborWages,
//         laborAttendance,
//         laborAttendanceSummary,
//         announcements,
        
//         // ✅ Expenses with pagination
//         myExpenses,
//         myExpensesPagination,
//         allExpenses,
//         allExpensesPagination,
//         expenseDetail,
        
//         // ✅ Expense methods
//         fetchMyExpenses,
//         createExpense,
//         fetchAllExpenses,
//         fetchExpenseById,
//         approveExpense,
//         rejectExpense,
//         payExpense,

//         loading,
//         pagination,

//         // Current employee specific data
//         currentEmployeeAttendance,
//         currentEmployeeLeaves,
//         currentEmployeeSalarySlips,
//         currentEmployeeLeaveBalance,

//         // Employee actions
//         fetchEmployees,
//         fetchEmployeeById,
//         fetchEmployeeStats,
//         createEmployee,
//         uploadFile,
//         registerEmployee,
//         verifyOtp,
//         updateEmployee,
//         deleteEmployee,
//         deleteUser,

//         // Current employee specific fetchers
//         fetchCurrentEmployeeAttendance,
//         fetchCurrentEmployeeLeaves,
//         fetchCurrentEmployeeLeaveBalance,
//         fetchCurrentEmployeeSalarySlips,

//         // Department actions
//         fetchDepartments,
//         fetchDepartmentEmployees,
//         createDepartment,
//         updateDepartment,
//         deleteDepartment,

//         // Attendance actions
//         checkIn,
//         checkOut,
//         fetchMyAttendance,
//         fetchAllAttendance,
//         fetchAttendanceStats,
//         fetchTodayAnalytics,

//         // Leave actions
//         fetchLeaves,
//         fetchMyLeaves,
//         fetchMyLeaveBalance,
//         fetchEmployeeLeaveBalance,
//         applyLeave,
//         processLeave,

//         // Salary & Payroll actions
//         fetchAllSalarySlips,
//         fetchMySalarySlips,
//         fetchEmployeeSalarySlips,
//         generateSalarySlip,
//         generateBulkSalarySlips,
//         updateSalaryStatus,
//         downloadSalaryReport,
//         downloadSalarySlipPdf,
//         submitPayrollForApproval,
//         fetchMyPayrollBatches,

//         // Shift actions
//         fetchShifts,
//         createShift,
//         updateShift,
//         deleteShift,
//         assignShiftToEmployee,
//         fetchEmployeeCurrentShift,

//         // Labor actions
//         fetchLabors,
//         fetchLaborById,
//         fetchLaborStats,
//         createLabor,
//         updateLabor,
//         deleteLabor,
//         fetchLaborWages,
//         createLaborWage,
//         updateLaborWage,
//         deleteLaborWage,
//         fetchLaborAttendance,
//         markLaborAttendance,
//         markBulkLaborAttendance,
//         fetchLaborAttendanceSummary,
//         fetchDailyLaborAttendance,

//         // Announcement actions
//         fetchAnnouncements,
//         createAnnouncement,
//     };
// };

















import { useState, useCallback } from "react";
import { toast } from "sonner";
import { hrApi } from "@/api/hrApi";

export const useHR = () => {
    // ---- Employees (global list) ----
    const [employees, setEmployees] = useState({
        employees: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    });
    const [employee, setEmployee] = useState(null);
    const [employeeStats, setEmployeeStats] = useState(null);

    // ---- Current employee specific data (for detail view) ----
    const [currentEmployeeAttendance, setCurrentEmployeeAttendance] = useState([]);
    const [currentEmployeeLeaves, setCurrentEmployeeLeaves] = useState([]);
    const [currentEmployeeSalarySlips, setCurrentEmployeeSalarySlips] = useState([]);
    const [currentEmployeeLeaveBalance, setCurrentEmployeeLeaveBalance] = useState(null);

    // ---- Departments ----
    const [departments, setDepartments] = useState([]);
    const [departmentEmployees, setDepartmentEmployees] = useState([]);

    // ---- Attendance (global) ----
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [myAttendance, setMyAttendance] = useState({});
    const [attendanceStats, setAttendanceStats] = useState(null);
    const [todayAnalytics, setTodayAnalytics] = useState(null);

    // ---- Leaves (global) ----
    const [leaves, setLeaves] = useState([]);
    const [myLeaves, setMyLeaves] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(null);

    // ---- Salary & Payroll (global) ----
    const [salarySlips, setSalarySlips] = useState([]);
    const [employeeSalarySlips, setEmployeeSalarySlips] = useState([]);
    const [companySalarySlips, setCompanySalarySlips] = useState([]);
    const [myPayrollBatches, setMyPayrollBatches] = useState([]);

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

    // ---- Expenses ----
    const [myExpenses, setMyExpenses] = useState([]);
    const [myExpensesPagination, setMyExpensesPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });
    const [allExpenses, setAllExpenses] = useState([]);
    const [allExpensesPagination, setAllExpensesPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });
    const [expenseDetail, setExpenseDetail] = useState(null);

    // ---- Common ----
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
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

    // ---- Employee specific data fetchers (sets dedicated state) ----
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
        setLoading(true)
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

    // ==================== Attendance (global) ====================
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

    // ==================== Leaves (global) ====================
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

    // ==================== Salary (global) ====================
    
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
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `salary-slip-${slipId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Salary slip downloaded');
            return true;
        } catch (err) {
            toast.error('Failed to download salary slip');
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

    // Labor Wages
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

    // Labor Attendance
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

    // ==================== Announcements ====================
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

    // ==================== EXPENSES (PRESIGNED URL FLOW) ====================
    
    /**
     * Fetch current user's expenses with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {string} params.status - Filter by status (Pending, Approved, Rejected, Paid)
     * @param {string} params.search - Search by title or employee name
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 10)
     * @returns {Object} Response data with tickets and pagination
     */
    const fetchMyExpenses = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getMyExpenses(params);
            const data = res.data?.data || {};
            
            const tickets = data.tickets || [];
            setMyExpenses(Array.isArray(tickets) ? tickets : []);
            
            if (data.pagination) {
                setMyExpensesPagination(data.pagination);
            }
            
            return data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load your expenses");
            setMyExpenses([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Create a new expense ticket (USING PRESIGNED URL FLOW)
     * @param {Object} data - Expense data with proofKey instead of file
     * @param {string} data.title - Expense title
     * @param {string} data.category - Category (Fuel, Travel, Food, etc.)
     * @param {string} data.description - Expense description
     * @param {string|number} data.amount - Amount
     * @param {string} data.proofKey - File key from presigned URL upload
     * @returns {boolean} Success status
     * 
     * Usage:
     * const success = await createExpense({
     *     title: 'Fuel for site visit',
     *     category: 'Fuel',
     *     description: 'Fuel expenses for project site visit',
     *     amount: '1500',
     *     proofKey: presignedData.key
     * });
     */
    const createExpense = async (data) => {
        // Validate required fields
        if (!data.title?.trim()) {
            toast.error("Title is required");
            return false;
        }
        if (!data.amount) {
            toast.error("Amount is required");
            return false;
        }
        if (!data.proofKey?.trim()) {
            toast.error("Proof file is required. Please upload the file first.");
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

    /**
     * Fetch all expenses (Admin/HR/Finance) with pagination and filters
     * @param {Object} params - Query parameters
     * @param {string} params.status - Filter by status (Pending, Approved, Rejected, Paid)
     * @param {string} params.category - Filter by category
     * @param {string} params.employeeId - Filter by specific employee
     * @param {string} params.search - Search by title or employee name
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 10)
     * @returns {Object} Response data with tickets and pagination
     */
    const fetchAllExpenses = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await hrApi.getAllExpenses(params);
            const data = res.data?.data || {};
            
            const tickets = data.tickets || [];
            setAllExpenses(Array.isArray(tickets) ? tickets : []);
            
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

    /**
     * Get single expense ticket details
     * @param {string} id - Expense ID
     * @returns {Object} Expense detail data
     */
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

    /**
     * Approve an expense ticket (HR role)
     * @param {string} id - Expense ID
     * @param {Object} data - Approval data with optional remarks
     * @param {string} data.remarks - Approval remarks (optional)
     * @returns {boolean} Success status
     */
    const approveExpense = async (id, data = {}) => {
        setLoading(true);
        try {
            await hrApi.approveExpense(id, data);
            toast.success("Expense approved successfully!");
            // Refresh lists
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

    /**
     * Reject an expense ticket (HR role)
     * @param {string} id - Expense ID
     * @param {Object} data - Rejection data with reason
     * @param {string} data.reason - Reason for rejection (required)
     * @returns {boolean} Success status
     */
    const rejectExpense = async (id, data = {}) => {
        if (!data.reason?.trim()) {
            toast.error("Rejection reason is required");
            return false;
        }
        setLoading(true);
        try {
            await hrApi.rejectExpense(id, data);
            toast.success("Expense rejected successfully!");
            // Refresh lists
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

    /**
     * Mark expense as paid (Finance role)
     * @param {string} id - Expense ID
     * @param {Object} data - Payment data
     * @param {string} data.paymentMethod - Payment method (UPI, Bank Transfer, Cheque, Cash, NEFT, RTGS)
     * @param {string} data.paymentReference - Payment reference/transaction ID (required)
     * @param {string} data.remarks - Payment remarks (optional)
     * @returns {boolean} Success status
     */
    const payExpense = async (id, data = {}) => {
        if (!data.paymentMethod || !data.paymentReference) {
            toast.error("Payment method and reference are required");
            return false;
        }
        setLoading(true);
        try {
            await hrApi.payExpense(id, data);
            toast.success("Payment processed successfully!");
            // Refresh lists
            await fetchMyExpenses();
            await fetchAllExpenses();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to process payment");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        // Data
        employees,
        employee,
        employeeStats,
        departments,
        departmentEmployees,
        attendanceRecords,
        myAttendance,
        attendanceStats,
        todayAnalytics,
        leaves,
        myLeaves,
        leaveBalance,
        employeeLeaveBalance,
        salarySlips,
        employeeSalarySlips,
        companySalarySlips,
        myPayrollBatches,
        shifts,
        employeeShift,
        labors,
        labor,
        laborStats,
        laborWages,
        laborAttendance,
        laborAttendanceSummary,
        announcements,
        
        // ✅ Expenses with pagination
        myExpenses,
        myExpensesPagination,
        allExpenses,
        allExpensesPagination,
        expenseDetail,
        
        // ✅ Expense methods
        fetchMyExpenses,
        createExpense,
        fetchAllExpenses,
        fetchExpenseById,
        approveExpense,
        rejectExpense,
        payExpense,

        loading,
        pagination,

        // Current employee specific data
        currentEmployeeAttendance,
        currentEmployeeLeaves,
        currentEmployeeSalarySlips,
        currentEmployeeLeaveBalance,

        // Employee actions
        fetchEmployees,
        fetchEmployeeById,
        fetchEmployeeStats,
        createEmployee,
        uploadFile,
        registerEmployee,
        verifyOtp,
        updateEmployee,
        deleteEmployee,
        deleteUser,

        // Current employee specific fetchers
        fetchCurrentEmployeeAttendance,
        fetchCurrentEmployeeLeaves,
        fetchCurrentEmployeeLeaveBalance,
        fetchCurrentEmployeeSalarySlips,

        // Department actions
        fetchDepartments,
        fetchDepartmentEmployees,
        createDepartment,
        updateDepartment,
        deleteDepartment,

        // Attendance actions
        checkIn,
        checkOut,
        fetchMyAttendance,
        fetchAllAttendance,
        fetchAttendanceStats,
        fetchTodayAnalytics,

        // Leave actions
        fetchLeaves,
        fetchMyLeaves,
        fetchMyLeaveBalance,
        fetchEmployeeLeaveBalance,
        applyLeave,
        processLeave,

        // Salary & Payroll actions
        fetchAllSalarySlips,
        fetchMySalarySlips,
        fetchEmployeeSalarySlips,
        generateSalarySlip,
        generateBulkSalarySlips,
        updateSalaryStatus,
        downloadSalaryReport,
        downloadSalarySlipPdf,
        submitPayrollForApproval,
        fetchMyPayrollBatches,

        // Shift actions
        fetchShifts,
        createShift,
        updateShift,
        deleteShift,
        assignShiftToEmployee,
        fetchEmployeeCurrentShift,

        // Labor actions
        fetchLabors,
        fetchLaborById,
        fetchLaborStats,
        createLabor,
        updateLabor,
        deleteLabor,
        fetchLaborWages,
        createLaborWage,
        updateLaborWage,
        deleteLaborWage,
        fetchLaborAttendance,
        markLaborAttendance,
        markBulkLaborAttendance,
        fetchLaborAttendanceSummary,
        fetchDailyLaborAttendance,
        getPresignedUrl,
        confirmUpload,

        // Announcement actions
        fetchAnnouncements,
        createAnnouncement,
    };
};