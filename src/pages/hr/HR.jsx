

// import React, { useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Users,
//   Building2,
//   Calendar,
//   Clock,
//   DollarSign,
//   Briefcase,
//   Megaphone,
//   UserPlus,
//   HardHat,
//   FileText, 
//   Receipt, // ✅ NEW: Import icon for Expense Approvals
// } from "lucide-react";

// import { PageHeader, StatCard } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { useHR } from "@/hooks/useHR";
// import { useAuthStore } from "@/store/authStore";

// // Tab components
// import { EmployeesTab } from "./tabs/EmployeesTab";
// import { DepartmentsTab } from "./tabs/DepartmentsTab";
// import { LeavesTab } from "./tabs/LeavesTab";
// import { SalaryTab } from "./tabs/SalaryTab"; 
// import { ShiftsTab } from "./tabs/ShiftsTab";
// import { LaborsTab } from "./tabs/LaborsTab";
// import { LaborWagesTab } from "./tabs/LaborWagesTab";
// import { AnnouncementsTab } from "./tabs/AnnouncementsTab";
// import { HRExpenseTab } from "./tabs/HRExpenseTab"; // ✅ NEW: Import HR Expense Tab

// export default function HR() {
//   const { current } = useAuthStore();
//   const canEdit = ["admin", "hr_manager"].includes(current?.role);
//   const onlyAdmin = current?.role === "admin";

//   const {
//     employees,
//     departments,
//     attendanceRecords,
//     myAttendance,
//     leaves,
//     salarySlips,
//     shifts,
//     labors,
//     announcements,
//     employeeStats,
//     todayAnalytics,
//     leaveBalance,
//     laborWages,
//     loading,
//     fetchEmployees,
//     fetchDepartments,
//     fetchAllAttendance,
//     fetchMyAttendance,
//     fetchLeaves,
//     fetchMySalarySlips,
//     fetchShifts,
//     fetchLabors,
//     fetchAnnouncements,
//     fetchEmployeeStats,
//     fetchTodayAnalytics,
//     fetchMyLeaveBalance,
//     checkIn,
//     checkOut,
//     fetchLaborWages,
//   } = useHR();

//   useEffect(() => {
//     fetchEmployeeStats();
//     fetchTodayAnalytics();
//     fetchAnnouncements();
//     fetchMyLeaveBalance();
//   }, []);

//   useEffect(() => {
//     fetchEmployees();
//     fetchDepartments();
//     fetchAllAttendance();
//     fetchLeaves();
//     fetchMySalarySlips();
//     fetchShifts();
//     fetchLabors();
//     fetchMyAttendance();
//     fetchLaborWages();
//   }, []);

//   if (loading && !employees.length) {
//     return (
//       <div className="space-y-5">
//         <Skeleton className="h-8 w-48" />
//         <div className="grid grid-cols-4 gap-3">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-20" />
//           ))}
//         </div>
//         <Skeleton className="h-64 w-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-5 sm:space-y-6">
//       <PageHeader
//         eyebrow="HR Management"
//         title="Human Resources"
//         description="Manage employees, departments, attendance, leaves, salary, shifts, labors, and announcements."
//       />

//       {/* Stats Row */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard
//           label="Active Employees"
//           value={employeeStats?.totalActiveEmployees || 0}
//           icon={Users}
//         />
//         <StatCard
//           label="Today Present"
//           value={todayAnalytics?.present || 0}
//           icon={Calendar}
//           accent="success"
//         />
//         <StatCard
//           label="Pending Leaves"
//           value={leaves.filter((l) => l.status === "Pending").length}
//           icon={Briefcase}
//           accent="warning"
//         />
//         <StatCard
//           label="Active Labors"
//           value={labors.filter((l) => l.isActive).length}
//           icon={HardHat}
//           accent="primary"
//         />
//       </div>

//       {/* Quick Check-in/out & Announcements */}
//       <div className="flex flex-wrap gap-3 justify-between items-center">
//         {announcements.length > 0 && (
//           <div className="bg-muted p-2 rounded-md flex gap-2 text-sm">
//             <Megaphone className="h-4 w-4 shrink-0" />
//             <span className="truncate">
//               {announcements[0].title}: {announcements[0].message}
//             </span>
//           </div>
//         )}
//         {/* ✅ Quick Check-in/out buttons for employees */}
//         <div className="flex gap-2">
//           <Button size="sm" variant="outline" onClick={checkIn}>
//             Check In
//           </Button>
//           <Button size="sm" variant="outline" onClick={checkOut}>
//             Check Out
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="employees">
//         <div className="w-full overflow-auto scrollbar-none">
//           <TabsList>
//             <TabsTrigger value="employees">
//               <Users className="h-3.5 w-3.5 mr-1.5" />
//               Employees
//             </TabsTrigger>
//             <TabsTrigger value="departments">
//               <Building2 className="h-3.5 w-3.5 mr-1.5" />
//               Departments
//             </TabsTrigger>
//             <TabsTrigger value="salary">
//               <FileText className="h-3.5 w-3.5 mr-1.5" />
//               Salary
//             </TabsTrigger>
//             {/* ✅ NEW: Expense Approvals Tab */}
//             <TabsTrigger value="expense-approvals">
//               <Receipt className="h-3.5 w-3.5 mr-1.5" />
//               Expense Approvals
//             </TabsTrigger>
//             <TabsTrigger value="shifts">
//               <Clock className="h-3.5 w-3.5 mr-1.5" />
//               Shifts
//             </TabsTrigger>
//             <TabsTrigger value="labor-wages">
//               <DollarSign className="h-3.5 w-3.5 mr-1.5" />
//               Labor Wages
//             </TabsTrigger>
//             <TabsTrigger value="labors">
//               <HardHat className="h-3.5 w-3.5 mr-1.5" />
//               Labors
//             </TabsTrigger>
//             <TabsTrigger value="announcements">
//               <Megaphone className="h-3.5 w-3.5 mr-1.5" />
//               Announcements
//             </TabsTrigger>
//           </TabsList>
//         </div>

//         <div className="mt-5">
//           <TabsContent value="employees">
//             <EmployeesTab
//               employeesData={employees}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchEmployees}
//             />
//           </TabsContent>

//           <TabsContent value="departments">
//             <DepartmentsTab
//               departments={departments}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchDepartments}
//             />
//           </TabsContent>

//           <TabsContent value="salary">
//             <SalaryTab />
//           </TabsContent>

//           {/* ✅ NEW: Expense Approvals Content */}
//           <TabsContent value="expense-approvals">
//             <HRExpenseTab />
//           </TabsContent>

//           <TabsContent value="shifts">
//             <ShiftsTab
//               shifts={shifts}
//               canEdit={canEdit}
//               onRefresh={fetchShifts}
//             />
//           </TabsContent>

//           <TabsContent value="labor-wages">
//             <LaborWagesTab
//               wages={laborWages}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchLaborWages}
//             />
//           </TabsContent>

//           <TabsContent value="labors">
//             <LaborsTab
//               labors={labors}
//               canEdit={canEdit}
//               onRefresh={fetchLabors}
//             />
//           </TabsContent>

//           <TabsContent value="announcements">
//             <AnnouncementsTab
//               announcements={announcements}
//               canEdit={canEdit}
//               onRefresh={fetchAnnouncements}
//             />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// }















// import React, { useEffect } from "react";
// // 👇 NEW: Imported for URL syncing
// import { useNavigate, useLocation } from "react-router-dom";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Users,
//   Building2,
//   Calendar,
//   Clock,
//   DollarSign,
//   Briefcase,
//   Megaphone,
//   UserPlus,
//   HardHat,
//   FileText,
//   Receipt,
// } from "lucide-react";

// import { PageHeader, StatCard } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { useHR } from "@/hooks/useHR";
// import { useAuthStore } from "@/store/authStore";

// // Tab components
// import { EmployeesTab } from "./tabs/EmployeesTab";
// import { DepartmentsTab } from "./tabs/DepartmentsTab";
// import { LeavesTab } from "./tabs/LeavesTab";
// import { SalaryTab } from "./tabs/SalaryTab";
// import { ShiftsTab } from "./tabs/ShiftsTab";
// import { LaborsTab } from "./tabs/LaborsTab";
// import { LaborWagesTab } from "./tabs/LaborWagesTab";
// import { AnnouncementsTab } from "./tabs/AnnouncementsTab";
// import { HRExpenseTab } from "./tabs/HRExpenseTab";

// export default function HR() {
//   const { current } = useAuthStore();
  
//   // 👇 NEW: Check role permissions for Tabs visibility
//   const role = current?.role?.toLowerCase();
//   const showPageTabs = ["admin", "director"].includes(role);
//   const canEdit = ["admin", "hr_manager"].includes(role);
//   const onlyAdmin = role === "admin";

//   // 👇 NEW: Extract active tab from URL and setup navigation
//   const location = useLocation();
//   const navigate = useNavigate();
//   const currentTab = location.pathname.split("/")[2] || "employees";

//   const handleTabChange = (value) => {
//     navigate(`/hr/${value}`);
//   };

//   const {
//     employees,
//     departments,
//     attendanceRecords,
//     myAttendance,
//     leaves,
//     salarySlips,
//     shifts,
//     labors,
//     announcements,
//     employeeStats,
//     todayAnalytics,
//     leaveBalance,
//     laborWages,
//     loading,
//     fetchEmployees,
//     fetchDepartments,
//     fetchAllAttendance,
//     fetchMyAttendance,
//     fetchLeaves,
//     fetchMySalarySlips,
//     fetchShifts,
//     fetchLabors,
//     fetchAnnouncements,
//     fetchEmployeeStats,
//     fetchTodayAnalytics,
//     fetchMyLeaveBalance,
//     checkIn,
//     checkOut,
//     fetchLaborWages,
//   } = useHR();

//   useEffect(() => {
//     fetchEmployeeStats();
//     fetchTodayAnalytics();
//     fetchAnnouncements();
//     fetchMyLeaveBalance();
//   }, []);

//   useEffect(() => {
//     fetchEmployees();
//     fetchDepartments();
//     fetchAllAttendance();
//     fetchLeaves();
//     fetchMySalarySlips();
//     fetchShifts();
//     fetchLabors();
//     fetchMyAttendance();
//     fetchLaborWages();
//   }, []);

//   if (loading && !employees.length) {
//     return (
//       <div className="space-y-5">
//         <Skeleton className="h-8 w-48" />
//         <div className="grid grid-cols-4 gap-3">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-20" />
//           ))}
//         </div>
//         <Skeleton className="h-64 w-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-5 sm:space-y-6">
//       <PageHeader
//         eyebrow="HR Management"
//         title="Human Resources"
//         description="Manage employees, departments, attendance, leaves, salary, shifts, labors, and announcements."
//       />

//       {/* Stats Row */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard
//           label="Active Employees"
//           value={employeeStats?.totalActiveEmployees || 0}
//           icon={Users}
//         />
//         <StatCard
//           label="Today Present"
//           value={todayAnalytics?.present || 0}
//           icon={Calendar}
//           accent="success"
//         />
//         <StatCard
//           label="Pending Leaves"
//           value={leaves.filter((l) => l.status === "Pending").length}
//           icon={Briefcase}
//           accent="warning"
//         />
//         <StatCard
//           label="Active Labors"
//           value={labors.filter((l) => l.isActive).length}
//           icon={HardHat}
//           accent="primary"
//         />
//       </div>

//       {/* Quick Check-in/out & Announcements */}
//       <div className="flex flex-wrap gap-3 justify-between items-center">
//         {announcements.length > 0 && (
//           <div className="bg-muted p-2 rounded-md flex gap-2 text-sm">
//             <Megaphone className="h-4 w-4 shrink-0" />
//             <span className="truncate">
//               {announcements[0].title}: {announcements[0].message}
//             </span>
//           </div>
//         )}
//         <div className="flex gap-2">
//           <Button size="sm" variant="outline" onClick={checkIn}>
//             Check In
//           </Button>
//           <Button size="sm" variant="outline" onClick={checkOut}>
//             Check Out
//           </Button>
//         </div>
//       </div>

//       {/* 👇 NEW: Make Tabs controlled by URL and onValueChange triggered conditionally */}
//       <Tabs value={currentTab} onValueChange={showPageTabs ? handleTabChange : undefined}>
        
//         {/* 👇 NEW: Only show tabs for Admin/Director */}
//         {showPageTabs && (
//             <div className="w-full overflow-auto scrollbar-none">
//             <TabsList>
//                 <TabsTrigger value="employees">
//                 <Users className="h-3.5 w-3.5 mr-1.5" />
//                 Employees
//                 </TabsTrigger>
//                 <TabsTrigger value="departments">
//                 <Building2 className="h-3.5 w-3.5 mr-1.5" />
//                 Departments
//                 </TabsTrigger>
//                 <TabsTrigger value="salary">
//                 <FileText className="h-3.5 w-3.5 mr-1.5" />
//                 Salary
//                 </TabsTrigger>
//                 <TabsTrigger value="expense-approvals">
//                 <Receipt className="h-3.5 w-3.5 mr-1.5" />
//                 Expense Approvals
//                 </TabsTrigger>
//                 <TabsTrigger value="shifts">
//                 <Clock className="h-3.5 w-3.5 mr-1.5" />
//                 Shifts
//                 </TabsTrigger>
//                 <TabsTrigger value="labor-wages">
//                 <DollarSign className="h-3.5 w-3.5 mr-1.5" />
//                 Labor Wages
//                 </TabsTrigger>
//                 <TabsTrigger value="labors">
//                 <HardHat className="h-3.5 w-3.5 mr-1.5" />
//                 Labors
//                 </TabsTrigger>
//                 <TabsTrigger value="announcements">
//                 <Megaphone className="h-3.5 w-3.5 mr-1.5" />
//                 Announcements
//                 </TabsTrigger>
//             </TabsList>
//             </div>
//         )}

//         <div className="mt-5">
//           <TabsContent value="employees">
//             <EmployeesTab
//               employeesData={employees}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchEmployees}
//             />
//           </TabsContent>

//           <TabsContent value="departments">
//             <DepartmentsTab
//               departments={departments}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchDepartments}
//             />
//           </TabsContent>

//           <TabsContent value="salary">
//             <SalaryTab />
//           </TabsContent>

//           <TabsContent value="expense-approvals">
//             <HRExpenseTab />
//           </TabsContent>

//           <TabsContent value="shifts">
//             <ShiftsTab
//               shifts={shifts}
//               canEdit={canEdit}
//               onRefresh={fetchShifts}
//             />
//           </TabsContent>

//           <TabsContent value="labor-wages">
//             <LaborWagesTab
//               wages={laborWages}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchLaborWages}
//             />
//           </TabsContent>

//           <TabsContent value="labors">
//             <LaborsTab
//               labors={labors}
//               canEdit={canEdit}
//               onRefresh={fetchLabors}
//             />
//           </TabsContent>

//           <TabsContent value="announcements">
//             <AnnouncementsTab
//               announcements={announcements}
//               canEdit={canEdit}
//               onRefresh={fetchAnnouncements}
//             />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// }













// import React, { useEffect } from "react";
// // 👇 NEW: Imported for URL syncing
// import { useNavigate, useLocation } from "react-router-dom";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Users,
//   Building2,
//   Calendar,
//   Clock,
//   DollarSign,
//   Briefcase,
//   Megaphone,
//   UserPlus,
//   HardHat,
//   FileText,
//   Receipt,
// } from "lucide-react";

// import { PageHeader, StatCard } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { useHR } from "@/hooks/useHR";
// import { useAuthStore } from "@/store/authStore";

// // Tab components
// import { EmployeesTab } from "./tabs/EmployeesTab";
// import { DepartmentsTab } from "./tabs/DepartmentsTab";
// import { LeavesTab } from "./tabs/LeavesTab";
// import { SalaryTab } from "./tabs/SalaryTab";
// import { ShiftsTab } from "./tabs/ShiftsTab";
// import { LaborsTab } from "./tabs/LaborsTab";
// import { LaborWagesTab } from "./tabs/LaborWagesTab";
// import { AnnouncementsTab } from "./tabs/AnnouncementsTab";
// import { HRExpenseTab } from "./tabs/HRExpenseTab";

// // 👇 NEW: Mapping for dynamic page headers
// const TAB_HEADERS = {
//   employees: { title: "Employees", desc: "Manage employee records and profiles." },
//   departments: { title: "Departments", desc: "Manage company departments." },
//   salary: { title: "Salary & Payroll", desc: "Process and view employee salaries." },
//   "expense-approvals": { title: "Expense Approvals", desc: "Review and approve HR expenses." },
//   shifts: { title: "Shifts", desc: "Manage employee shifts and timings." },
//   "labor-wages": { title: "Labor Wages", desc: "Manage labor wages and payments." },
//   labors: { title: "Labors", desc: "Manage daily labors and attendance." },
//   announcements: { title: "Announcements", desc: "Manage company-wide announcements." },
// };

// export default function HR() {
//   const { current } = useAuthStore();
  
//   // 👇 NEW: Check role permissions for Tabs visibility
//   const role = current?.role?.toLowerCase();
//   const showPageTabs = ["admin", "director"].includes(role);
//   const canEdit = ["admin", "hr_manager"].includes(role);
//   const onlyAdmin = role === "admin";

//   // 👇 NEW: Extract active tab from URL and setup navigation
//   const location = useLocation();
//   const navigate = useNavigate();
//   const currentTab = location.pathname.split("/")[2] || "employees";

//   const handleTabChange = (value) => {
//     navigate(`/hr/${value}`);
//   };

//   const {
//     employees,
//     departments,
//     attendanceRecords,
//     myAttendance,
//     leaves,
//     salarySlips,
//     shifts,
//     labors,
//     announcements,
//     employeeStats,
//     todayAnalytics,
//     leaveBalance,
//     laborWages,
//     loading,
//     fetchEmployees,
//     fetchDepartments,
//     fetchAllAttendance,
//     fetchMyAttendance,
//     fetchLeaves,
//     fetchMySalarySlips,
//     fetchShifts,
//     fetchLabors,
//     fetchAnnouncements,
//     fetchEmployeeStats,
//     fetchTodayAnalytics,
//     fetchMyLeaveBalance,
//     checkIn,
//     checkOut,
//     fetchLaborWages,
//   } = useHR();

//   useEffect(() => {
//     fetchEmployeeStats();
//     fetchTodayAnalytics();
//     fetchAnnouncements();
//     fetchMyLeaveBalance();
//   }, []);

//   useEffect(() => {
//     fetchEmployees();
//     fetchDepartments();
//     fetchAllAttendance();
//     fetchLeaves();
//     fetchMySalarySlips();
//     fetchShifts();
//     fetchLabors();
//     fetchMyAttendance();
//     fetchLaborWages();
//   }, []);

//   if (loading && !employees.length) {
//     return (
//       <div className="space-y-5">
//         <Skeleton className="h-8 w-48" />
//         <div className="grid grid-cols-4 gap-3">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-20" />
//           ))}
//         </div>
//         <Skeleton className="h-64 w-full" />
//       </div>
//     );
//   }

//   // 👇 NEW: Determine header values based on current role and tab
//   const headerInfo = showPageTabs 
//     ? { title: "Human Resources", desc: "Manage employees, departments, attendance, leaves, salary, shifts, labors, and announcements." }
//     : (TAB_HEADERS[currentTab] || { title: "Human Resources", desc: "HR Management" });

//   return (
//     <div className="space-y-5 sm:space-y-6">
//       <PageHeader
//         eyebrow={showPageTabs ? "HR Management" : "Human Resources"}
//         title={headerInfo.title}
//         description={headerInfo.desc}
//       />

//       {/* 👇 NEW: Conditionally render Stats and Check-in for Admin/Director or when on 'employees' tab */}
//       {(showPageTabs || currentTab === "employees") && (
//         <>
//           {/* Stats Row */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <StatCard
//               label="Active Employees"
//               value={employeeStats?.totalActiveEmployees || 0}
//               icon={Users}
//             />
//             <StatCard
//               label="Today Present"
//               value={todayAnalytics?.present || 0}
//               icon={Calendar}
//               accent="success"
//             />
//             <StatCard
//               label="Pending Leaves"
//               value={leaves.filter((l) => l.status === "Pending").length}
//               icon={Briefcase}
//               accent="warning"
//             />
//             <StatCard
//               label="Active Labors"
//               value={labors.filter((l) => l.isActive).length}
//               icon={HardHat}
//               accent="primary"
//             />
//           </div>

//           {/* Quick Check-in/out & Announcements */}
//           <div className="flex flex-wrap gap-3 justify-between items-center">
//             {announcements.length > 0 && (
//               <div className="bg-muted p-2 rounded-md flex gap-2 text-sm">
//                 <Megaphone className="h-4 w-4 shrink-0" />
//                 <span className="truncate">
//                   {announcements[0].title}: {announcements[0].message}
//                 </span>
//               </div>
//             )}
//             <div className="flex gap-2">
//               <Button size="sm" variant="outline" onClick={checkIn}>
//                 Check In
//               </Button>
//               <Button size="sm" variant="outline" onClick={checkOut}>
//                 Check Out
//               </Button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* 👇 Make Tabs controlled by URL and onValueChange triggered conditionally */}
//       <Tabs value={currentTab} onValueChange={showPageTabs ? handleTabChange : undefined}>
        
//         {/* Only show tabs for Admin/Director */}
//         {showPageTabs && (
//             <div className="w-full overflow-auto scrollbar-none">
//             <TabsList>
//                 <TabsTrigger value="employees">
//                 <Users className="h-3.5 w-3.5 mr-1.5" />
//                 Employees
//                 </TabsTrigger>
//                 <TabsTrigger value="departments">
//                 <Building2 className="h-3.5 w-3.5 mr-1.5" />
//                 Departments
//                 </TabsTrigger>
//                 <TabsTrigger value="salary">
//                 <FileText className="h-3.5 w-3.5 mr-1.5" />
//                 Salary
//                 </TabsTrigger>
//                 <TabsTrigger value="expense-approvals">
//                 <Receipt className="h-3.5 w-3.5 mr-1.5" />
//                 Expense Approvals
//                 </TabsTrigger>
//                 <TabsTrigger value="shifts">
//                 <Clock className="h-3.5 w-3.5 mr-1.5" />
//                 Shifts
//                 </TabsTrigger>
//                 <TabsTrigger value="labor-wages">
//                 <DollarSign className="h-3.5 w-3.5 mr-1.5" />
//                 Labor Wages
//                 </TabsTrigger>
//                 <TabsTrigger value="labors">
//                 <HardHat className="h-3.5 w-3.5 mr-1.5" />
//                 Labors
//                 </TabsTrigger>
//                 <TabsTrigger value="announcements">
//                 <Megaphone className="h-3.5 w-3.5 mr-1.5" />
//                 Announcements
//                 </TabsTrigger>
//             </TabsList>
//             </div>
//         )}

//         <div className="mt-5">
//           <TabsContent value="employees">
//             <EmployeesTab
//               employeesData={employees}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchEmployees}
//             />
//           </TabsContent>

//           <TabsContent value="departments">
//             <DepartmentsTab
//               departments={departments}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchDepartments}
//             />
//           </TabsContent>

//           <TabsContent value="salary">
//             <SalaryTab />
//           </TabsContent>

//           <TabsContent value="expense-approvals">
//             <HRExpenseTab />
//           </TabsContent>

//           <TabsContent value="shifts">
//             <ShiftsTab
//               shifts={shifts}
//               canEdit={canEdit}
//               onRefresh={fetchShifts}
//             />
//           </TabsContent>

//           <TabsContent value="labor-wages">
//             <LaborWagesTab
//               wages={laborWages}
//               onlyAdmin={onlyAdmin}
//               canEdit={canEdit}
//               onRefresh={fetchLaborWages}
//             />
//           </TabsContent>

//           <TabsContent value="labors">
//             <LaborsTab
//               labors={labors}
//               canEdit={canEdit}
//               onRefresh={fetchLabors}
//             />
//           </TabsContent>

//           <TabsContent value="announcements">
//             <AnnouncementsTab
//               announcements={announcements}
//               canEdit={canEdit}
//               onRefresh={fetchAnnouncements}
//             />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// }









// import React, { useEffect } from "react";
// // 👇 NEW: Imported for URL syncing
// import { useNavigate, useLocation } from "react-router-dom";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Users,
//   Building2,
//   Calendar,
//   Clock,
//   DollarSign,
//   Briefcase,
//   Megaphone,
//   UserPlus,
//   HardHat,
//   FileText,
//   Receipt,
// } from "lucide-react";

// import { PageHeader, StatCard } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { useHR } from "@/hooks/useHR";
// import { useAuthStore } from "@/store/authStore";

// // Tab components
// import { EmployeesTab } from "./tabs/EmployeesTab";
// import { DepartmentsTab } from "./tabs/DepartmentsTab";
// import { LeavesTab } from "./tabs/LeavesTab";
// import { SalaryTab } from "./tabs/SalaryTab";
// import { ShiftsTab } from "./tabs/ShiftsTab";
// import { LaborsTab } from "./tabs/LaborsTab";
// import { LaborWagesTab } from "./tabs/LaborWagesTab";
// import { AnnouncementsTab } from "./tabs/AnnouncementsTab";
// import { HRExpenseTab } from "./tabs/HRExpenseTab";

// // 👇 NEW: Mapping for dynamic page headers
// const TAB_HEADERS = {
//   employees: { title: "Employees", desc: "Manage employee records and profiles." },
//   departments: { title: "Departments", desc: "Manage company departments." },
//   salary: { title: "Salary & Payroll", desc: "Process and view employee salaries." },
//   "expense-approvals": { title: "Expense Approvals", desc: "Review and approve HR expenses." },
//   shifts: { title: "Shifts", desc: "Manage employee shifts and timings." },
//   "labor-wages": { title: "Labor Wages", desc: "Manage labor wages and payments." },
//   labors: { title: "Labors", desc: "Manage daily labors and attendance." },
//   announcements: { title: "Announcements", desc: "Manage company-wide announcements." },
// };

// export default function HR() {
//   const { current } = useAuthStore();
  
//   // 👇 NEW: Check role permissions for Tabs visibility
//   const role = current?.role?.toLowerCase();
//   const showPageTabs = ["admin", "director"].includes(role);
//   const canEdit = ["admin", "hr_manager"].includes(role);
//   const onlyAdmin = role === "admin";

//   // 👇 NEW: Extract active tab from URL and setup navigation
//   const location = useLocation();
//   const navigate = useNavigate();
//   const currentTab = location.pathname.split("/")[2] || "employees";

//   const handleTabChange = (value) => {
//     navigate(`/hr/${value}`);
//   };

//   const {
//     employees,
//     departments,
//     attendanceRecords,
//     myAttendance,
//     leaves,
//     salarySlips,
//     shifts,
//     labors,
//     announcements,
//     employeeStats,
//     todayAnalytics,
//     leaveBalance,
//     laborWages,
//     loading,
//     fetchEmployees,
//     fetchDepartments,
//     fetchAllAttendance,
//     fetchMyAttendance,
//     fetchLeaves,
//     fetchMySalarySlips,
//     fetchShifts,
//     fetchLabors,
//     fetchAnnouncements,
//     fetchEmployeeStats,
//     fetchTodayAnalytics,
//     fetchMyLeaveBalance,
//     checkIn,
//     checkOut,
//     fetchLaborWages,
//   } = useHR();

//   useEffect(() => {
//     fetchEmployeeStats();
//     fetchTodayAnalytics();
//     fetchAnnouncements();
//     fetchMyLeaveBalance();
//   }, []);

//   useEffect(() => {
//     fetchEmployees();
//     fetchDepartments();
//     fetchAllAttendance();
//     fetchLeaves();
//     fetchMySalarySlips();
//     fetchShifts();
//     fetchLabors();
//     fetchMyAttendance();
//     fetchLaborWages();
//   }, []);

//   if (loading && !employees.length) {
//     return (
//       <div className="space-y-5">
//         <Skeleton className="h-8 w-48" />
//         <div className="grid grid-cols-4 gap-3">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-20" />
//           ))}
//         </div>
//         <Skeleton className="h-64 w-full" />
//       </div>
//     );
//   }

//   // 👇 NEW: Determine header values based on current role and tab
//   const headerInfo = showPageTabs 
//     ? { title: "Human Resources", desc: "Manage employees, departments, attendance, leaves, salary, shifts, labors, and announcements." }
//     : (TAB_HEADERS[currentTab] || { title: "Human Resources", desc: "HR Management" });

//   return (
//     <div className="space-y-5 sm:space-y-6">
//       <PageHeader
//         eyebrow={showPageTabs ? "HR Management" : "Human Resources"}
//         title={headerInfo.title}
//         description={headerInfo.desc}
//       />

//       {/* 👇 NEW: Conditionally render Stats and Check-in for Admin/Director or when on 'employees' tab */}
//       {(showPageTabs || currentTab === "employees") && (
//         <>
//           {/* Stats Row */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <StatCard
//               label="Active Employees"
//               value={employeeStats?.totalActiveEmployees || 0}
//               icon={Users}
//             />
//             <StatCard
//               label="Today Present"
//               value={todayAnalytics?.present || 0}
//               icon={Calendar}
//               accent="success"
//             />
//             <StatCard
//               label="Pending Leaves"
//               value={leaves.filter((l) => l.status === "Pending").length}
//               icon={Briefcase}
//               accent="warning"
//             />
//             <StatCard
//               label="Active Labors"
//               value={labors.filter((l) => l.isActive).length}
//               icon={HardHat}
//               accent="primary"
//             />
//           </div>

//           {/* Quick Check-in/out & Announcements */}
//           <div className="flex flex-wrap gap-3 justify-between items-center">
//             {announcements.length > 0 && (
//               <div className="bg-muted p-2 rounded-md flex gap-2 text-sm">
//                 <Megaphone className="h-4 w-4 shrink-0" />
//                 <span className="truncate">
//                   {announcements[0].title}: {announcements[0].message}
//                 </span>
//               </div>
//             )}
//             <div className="flex gap-2">
//               <Button size="sm" variant="outline" onClick={checkIn}>
//                 Check In
//               </Button>
//               <Button size="sm" variant="outline" onClick={checkOut}>
//                 Check Out
//               </Button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* 👇 Make Tabs controlled by URL and onValueChange triggered conditionally */}
//       <Tabs value={currentTab} onValueChange={showPageTabs ? handleTabChange : undefined}>
        
//         {/* Only show tabs for Admin/Director */}
//         {showPageTabs && (
//             <div className="w-full overflow-auto scrollbar-none">
//             <TabsList>
//                 <TabsTrigger value="employees">
//                 <Users className="h-3.5 w-3.5 mr-1.5" />
//                 Employees
//                 </TabsTrigger>
//                 <TabsTrigger value="departments">
//                 <Building2 className="h-3.5 w-3.5 mr-1.5" />
//                 Departments
//                 </TabsTrigger>
//                 <TabsTrigger value="salary">
//                 <FileText className="h-3.5 w-3.5 mr-1.5" />
//                 Salary
//                 </TabsTrigger>
//                 <TabsTrigger value="expense-approvals">
//                 <Receipt className="h-3.5 w-3.5 mr-1.5" />
//                 Expense Approvals
//                 </TabsTrigger>
//                 <TabsTrigger value="shifts">
//                 <Clock className="h-3.5 w-3.5 mr-1.5" />
//                 Shifts
//                 </TabsTrigger>
//                 <TabsTrigger value="labor-wages">
//                 <DollarSign className="h-3.5 w-3.5 mr-1.5" />
//                 Labor Wages
//                 </TabsTrigger>
//                 <TabsTrigger value="labors">
//                 <HardHat className="h-3.5 w-3.5 mr-1.5" />
//                 Labors
//                 </TabsTrigger>
//                 <TabsTrigger value="announcements">
//                 <Megaphone className="h-3.5 w-3.5 mr-1.5" />
//                 Announcements
//                 </TabsTrigger>
//             </TabsList>
//             </div>
//         )}

//         <div className="mt-5">
//           <TabsContent value="employees">
//             <EmployeesTab
//               employeesData={employees}
//               onlyAdmin={canEdit} // 👇 CHANGED from onlyAdmin to canEdit
//               canEdit={canEdit}
//               onRefresh={fetchEmployees}
//             />
//           </TabsContent>

//           <TabsContent value="departments">
//             <DepartmentsTab
//               departments={departments}
//               onlyAdmin={canEdit} // 👇 CHANGED from onlyAdmin to canEdit
//               canEdit={canEdit}
//               onRefresh={fetchDepartments}
//             />
//           </TabsContent>

//           <TabsContent value="salary">
//             <SalaryTab />
//           </TabsContent>

//           <TabsContent value="expense-approvals">
//             <HRExpenseTab />
//           </TabsContent>

//           <TabsContent value="shifts">
//             <ShiftsTab
//               shifts={shifts}
//               canEdit={canEdit}
//               onRefresh={fetchShifts}
//             />
//           </TabsContent>

//           <TabsContent value="labor-wages">
//             <LaborWagesTab
//               wages={laborWages}
//               onlyAdmin={canEdit} // 👇 CHANGED from onlyAdmin to canEdit
//               canEdit={canEdit}
//               onRefresh={fetchLaborWages}
//             />
//           </TabsContent>

//           <TabsContent value="labors">
//             <LaborsTab
//               labors={labors}
//               canEdit={canEdit}
//               onRefresh={fetchLabors}
//             />
//           </TabsContent>

//           <TabsContent value="announcements">
//             <AnnouncementsTab
//               announcements={announcements}
//               canEdit={canEdit}
//               onRefresh={fetchAnnouncements}
//             />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// }














import React, { useEffect } from "react";
// 👇 NEW: Imported for URL syncing
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  Megaphone,
  UserPlus,
  HardHat,
  FileText,
  Receipt,
} from "lucide-react";

import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useHR } from "@/hooks/useHR";
import { useAuthStore } from "@/store/authStore";

// Tab components
import { EmployeesTab } from "./tabs/EmployeesTab";
import { DepartmentsTab } from "./tabs/DepartmentsTab";
import { LeavesTab } from "./tabs/LeavesTab";
import { SalaryTab } from "./tabs/SalaryTab";
import { ShiftsTab } from "./tabs/ShiftsTab";
import { LaborsTab } from "./tabs/LaborsTab";
import { LaborWagesTab } from "./tabs/LaborWagesTab";
import { AnnouncementsTab } from "./tabs/AnnouncementsTab";
import { HRExpenseTab } from "./tabs/HRExpenseTab";

// 👇 NEW: Mapping for dynamic page headers
const TAB_HEADERS = {
  employees: { title: "Employees", desc: "Manage employee records and profiles." },
  departments: { title: "Departments", desc: "Manage company departments." },
  salary: { title: "Salary & Payroll", desc: "Process and view employee salaries." },
  "expense-approvals": { title: "Expense Approvals", desc: "Review and approve HR expenses." },
  shifts: { title: "Shifts", desc: "Manage employee shifts and timings." },
  "labor-wages": { title: "Labor Wages", desc: "Manage labor wages and payments." },
  labors: { title: "Labors", desc: "Manage daily labors and attendance." },
  announcements: { title: "Announcements", desc: "Manage company-wide announcements." },
};

export default function HR() {
  const { current } = useAuthStore();
  
  // 👇 NEW: Check role permissions for Tabs visibility
  const role = current?.role?.toLowerCase();
  const showPageTabs = ["admin", "director"].includes(role);
  const canEdit = ["admin", "hr_manager"].includes(role);
  const onlyAdmin = role === "admin";

  // 👇 NEW: Extract active tab from URL and setup navigation
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split("/")[2] || "employees";

  const handleTabChange = (value) => {
    navigate(`/hr/${value}`);
  };

  const {
    employees,
    departments,
    attendanceRecords,
    myAttendance,
    leaves,
    salarySlips,
    shifts,
    labors,
    announcements,
    employeeStats,
    todayAnalytics,
    leaveBalance,
    laborWages,
    loading,
    fetchEmployees,
    fetchDepartments,
    fetchAllAttendance,
    fetchMyAttendance,
    fetchLeaves,
    fetchMySalarySlips,
    fetchShifts,
    fetchLabors,
    fetchAnnouncements,
    fetchEmployeeStats,
    fetchTodayAnalytics,
    fetchMyLeaveBalance,
    checkIn,
    checkOut,
    fetchLaborWages,
  } = useHR();

  // 1. Initial Load: Fetch only globally required data
  useEffect(() => {
    fetchEmployeeStats();
    fetchTodayAnalytics();
    fetchAnnouncements();
    fetchMyLeaveBalance();
  }, []);

  // 2. Lazy Load: Fetch data based on active tab
  useEffect(() => {
    switch (currentTab) {
      case "employees":
        // Check if data is already fetched to prevent redundant API calls
        if (!employees?.employees?.length && !employees?.length) fetchEmployees();
        if (!leaves?.length) fetchLeaves();
        if (!attendanceRecords?.length) fetchAllAttendance();
        if (!myAttendance?.records?.length) fetchMyAttendance();
        break;
      case "departments":
        if (!departments?.length) fetchDepartments();
        break;
      case "salary":
        if (!salarySlips?.length) fetchMySalarySlips();
        break;
      case "shifts":
        if (!shifts?.length) fetchShifts();
        break;
      case "labor-wages":
        if (!laborWages?.length) fetchLaborWages();
        break;
      case "labors":
        if (!labors?.length) fetchLabors();
        break;
      case "expense-approvals":
      case "announcements":
        // Components like HRExpenseTab handle their own specific API logic inside their files
        break;
      default:
        break;
    }
  }, [currentTab]);

  // Safe check for employees object/array
  const hasNoEmployees = !employees?.employees?.length && !employees?.length;

  if (loading && hasNoEmployees) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // 👇 NEW: Determine header values based on current role and tab
  const headerInfo = showPageTabs 
    ? { title: "Human Resources", desc: "Manage employees, departments, attendance, leaves, salary, shifts, labors, and announcements." }
    : (TAB_HEADERS[currentTab] || { title: "Human Resources", desc: "HR Management" });

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow={showPageTabs ? "HR Management" : "Human Resources"}
        title={headerInfo.title}
        description={headerInfo.desc}
      />

      {/* 👇 NEW: Conditionally render Stats and Check-in for Admin/Director or when on 'employees' tab */}
      {(showPageTabs || currentTab === "employees") && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Active Employees"
              value={employeeStats?.totalActiveEmployees || 0}
              icon={Users}
            />
            <StatCard
              label="Today Present"
              value={todayAnalytics?.present || 0}
              icon={Calendar}
              accent="success"
            />
            <StatCard
              label="Pending Leaves"
              value={leaves.filter((l) => l.status === "Pending").length}
              icon={Briefcase}
              accent="warning"
            />
            <StatCard
              label="Active Labors"
              value={labors.filter((l) => l.isActive).length}
              icon={HardHat}
              accent="primary"
            />
          </div>

          {/* Quick Check-in/out & Announcements */}
          <div className="flex flex-wrap gap-3 justify-between items-center">
            {announcements.length > 0 && (
              <div className="bg-muted p-2 rounded-md flex gap-2 text-sm">
                <Megaphone className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {announcements[0].title}: {announcements[0].message}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={checkIn}>
                Check In
              </Button>
              <Button size="sm" variant="outline" onClick={checkOut}>
                Check Out
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 👇 Make Tabs controlled by URL and onValueChange triggered conditionally */}
      <Tabs value={currentTab} onValueChange={showPageTabs ? handleTabChange : undefined}>
        
        {/* Only show tabs for Admin/Director */}
        {showPageTabs && (
            <div className="w-full overflow-auto scrollbar-none">
            <TabsList>
                <TabsTrigger value="employees">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Employees
                </TabsTrigger>
                <TabsTrigger value="departments">
                <Building2 className="h-3.5 w-3.5 mr-1.5" />
                Departments
                </TabsTrigger>
                <TabsTrigger value="salary">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Salary
                </TabsTrigger>
                <TabsTrigger value="expense-approvals">
                <Receipt className="h-3.5 w-3.5 mr-1.5" />
                Expense Approvals
                </TabsTrigger>
                <TabsTrigger value="shifts">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Shifts
                </TabsTrigger>
                <TabsTrigger value="labor-wages">
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                Labor Wages
                </TabsTrigger>
                <TabsTrigger value="labors">
                <HardHat className="h-3.5 w-3.5 mr-1.5" />
                Labors
                </TabsTrigger>
                <TabsTrigger value="announcements">
                <Megaphone className="h-3.5 w-3.5 mr-1.5" />
                Announcements
                </TabsTrigger>
            </TabsList>
            </div>
        )}

        <div className="mt-5">
          <TabsContent value="employees">
            <EmployeesTab
              employeesData={employees}
              onlyAdmin={canEdit}
              canEdit={canEdit}
              onRefresh={fetchEmployees}
            />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentsTab
              departments={departments}
              onlyAdmin={canEdit}
              canEdit={canEdit}
              onRefresh={fetchDepartments}
            />
          </TabsContent>

          <TabsContent value="salary">
            <SalaryTab />
          </TabsContent>

          <TabsContent value="expense-approvals">
            <HRExpenseTab />
          </TabsContent>

          <TabsContent value="shifts">
            <ShiftsTab
              shifts={shifts}
              canEdit={canEdit}
              onRefresh={fetchShifts}
            />
          </TabsContent>

          <TabsContent value="labor-wages">
            <LaborWagesTab
              wages={laborWages}
              onlyAdmin={canEdit}
              canEdit={canEdit}
              onRefresh={fetchLaborWages}
            />
          </TabsContent>

          <TabsContent value="labors">
            <LaborsTab
              labors={labors}
              canEdit={canEdit}
              onRefresh={fetchLabors}
            />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsTab
              announcements={announcements}
              canEdit={canEdit}
              onRefresh={fetchAnnouncements}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}