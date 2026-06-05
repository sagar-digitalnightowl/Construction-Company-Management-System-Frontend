import React, { useEffect } from "react";
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
import { AnnouncementsTab } from "./tabs/AnnouncementsTab"; // NEW

export default function HR() {
  const { current } = useAuthStore();
  const canEdit = ["admin", "hr_manager"].includes(current?.role);
  const onlyAdmin = current?.role === "admin";

  const {
    employees,
    departments,
    attendanceRecords,
    myAttendance,
    leaves,
    salarySlips,
    shifts,
    labors,
    announcements, // already in useHR
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
    fetchAnnouncements, // already in useHR  
    fetchEmployeeStats,
    fetchTodayAnalytics,
    fetchMyLeaveBalance,
    checkIn,
    checkOut,
    fetchLaborWages,
  } = useHR();          
  
  

  useEffect(() => {
    fetchEmployeeStats();
    fetchTodayAnalytics();
    fetchAnnouncements();
    fetchMyLeaveBalance();
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchAllAttendance();
    fetchLeaves();
    fetchMySalarySlips();
    fetchShifts();
    fetchLabors();
    fetchMyAttendance();
    fetchLaborWages();
  }, []);

  if (loading && !employees.length) {
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

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="HR Management"
        title="Human Resources"
        description="Manage employees, departments, attendance, leaves, salary, shifts, labors, and announcements."
      />

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
      </div>

      <Tabs defaultValue="employees">
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

        <div className="mt-5">
          <TabsContent value="employees">
            <EmployeesTab
              employeesData={employees}
              onlyAdmin={onlyAdmin}
              canEdit={canEdit}
              onRefresh={fetchEmployees}
            />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentsTab
              departments={departments}
              onlyAdmin={onlyAdmin}
              canEdit={canEdit}
              onRefresh={fetchDepartments}
            />
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
              onlyAdmin={onlyAdmin}
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
