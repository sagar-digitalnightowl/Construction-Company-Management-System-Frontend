// src/pages/finance/Finance.jsx
import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceDashboard } from "./FinanceDashboard";
import { FinanceBookings } from "./FinanceBookings";
import { FinanceMilestones } from "./FinanceMilestones";
import { FinanceReminders } from "./FinanceReminders";
// Naya Payroll Approval component import
import { FinancePayrollApprovals } from "./FinancePayrollApprovals";

export default function Finance() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Finance Overview"
        description="Project‑wise dashboards, bookings, milestones, reminders, and payroll approvals."
      />

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="reminders">Reminder Logs</TabsTrigger>
          {/* Naya tab trigger */}
          <TabsTrigger value="payroll">Payroll Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <FinanceDashboard />
        </TabsContent>

        <TabsContent value="bookings">
          <FinanceBookings />
        </TabsContent>

        <TabsContent value="milestones">
          <FinanceMilestones />
        </TabsContent>

        <TabsContent value="reminders">
          <FinanceReminders />
        </TabsContent>

        {/* Naya tab content */}
        <TabsContent value="payroll">
          <FinancePayrollApprovals />
        </TabsContent>
      </Tabs>
    </div>
  );
}