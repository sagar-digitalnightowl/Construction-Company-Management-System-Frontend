import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuthStore } from "@/store/authStore";
import LeadKanbanPage from "./LeadKanbanPage";
import CampaignsPage from "./CampaignsPage";
import CallingRecordsPage from "./CallingRecordsPage";
import MyCallingListPage from "./MyCallingListPage";
import LeadStatsPage from "./LeadStatsPage";
import MyCallLogsPage from "./MyCallLogsPage";

const LeadManagement = () => {
  const { current } = useAuthStore();
  const role = current?.role;
  const isAdminOrDirector = ["admin", "director"].includes(role);
  const isHR = role === "hr_manager";
  const isEmployee = ["employee", "site_engineer", "project_manager"].includes(
    role,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lead Management"
        title="CRM Pipeline"
        description="Manage leads, campaigns, and cold calling activities"
      />
      <Tabs defaultValue={"kanban"} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="kanban">Pipeline</TabsTrigger>

          {(isAdminOrDirector || isHR) && (
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          )}
          {(isAdminOrDirector || isHR) && (
            <TabsTrigger value="calling-records">Calling Records</TabsTrigger>
          )}
          {isEmployee && (
            <TabsTrigger value="my-calling-list">My Calling List</TabsTrigger>
          )}
          {isEmployee && (
            <TabsTrigger value="my-call-logs">My Call Logs</TabsTrigger>
          )}
          {(isAdminOrDirector || isHR) && (
            <TabsTrigger value="stats">Analytics</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="kanban">
          <LeadKanbanPage />
        </TabsContent>

        {(isAdminOrDirector || isHR) && (
          <TabsContent value="campaigns">
            <CampaignsPage />
          </TabsContent>
        )}

        {(isAdminOrDirector || isHR) && (
          <TabsContent value="calling-records">
            <CallingRecordsPage />
          </TabsContent>
        )}

        {isEmployee && (
          <TabsContent value="my-calling-list">
            <MyCallingListPage />
          </TabsContent>
        )}

        {isEmployee && (
          <TabsContent value="my-call-logs">
            <MyCallLogsPage />
          </TabsContent>
        )}

        {(isAdminOrDirector || isHR) && (
          <TabsContent value="stats">
            <LeadStatsPage />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default LeadManagement;
