
import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceDashboard } from "./FinanceDashboard";
import { FinanceBookings } from "./FinanceBookings";
import { FinanceMilestones } from "./FinanceMilestones";
import { FinanceReminders } from "./FinanceReminders";
import { FinancePayrollApprovals } from "./FinancePayrollApprovals";
// ✅ Consistent naming import
import { FinanceExpenses } from "./FinanceExpenses";
// ✅ Import the new WhatsApp Reminders component
import { FinanceDueInstallments } from "./FinanceDueInstallments";

export default function Finance() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Finance Overview"
        description="Project‑wise dashboards, bookings, milestones, reminders, payroll, and expense approvals."
      />

      <Tabs defaultValue="dashboard">
        <div className="w-full overflow-auto scrollbar-none">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            {/* ✅ New WhatsApp Reminders Tab */}
            <TabsTrigger value="due-installments">WhatsApp Reminders</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="reminders">Reminder Logs</TabsTrigger>
            <TabsTrigger value="payroll">Payroll Approvals</TabsTrigger>
            <TabsTrigger value="expenses">Expense Approvals</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard">
          <FinanceDashboard />
        </TabsContent>

        <TabsContent value="bookings">
          <FinanceBookings />
        </TabsContent>

        {/* ✅ New WhatsApp Reminders Content */}
        <TabsContent value="due-installments">
          <FinanceDueInstallments />
        </TabsContent>

        <TabsContent value="milestones">
          <FinanceMilestones />
        </TabsContent>

        <TabsContent value="reminders">
          <FinanceReminders />
        </TabsContent>

        <TabsContent value="payroll">
          <FinancePayrollApprovals />
        </TabsContent>

        <TabsContent value="expenses">
          <FinanceExpenses />
        </TabsContent>
      </Tabs>
    </div>
  );
}