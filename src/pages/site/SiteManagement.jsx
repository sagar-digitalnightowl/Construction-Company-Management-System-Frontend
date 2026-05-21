// src/pages/site/SiteManagement.jsx
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { DailyReports } from "./DailyReports";
import { Attendance } from "./Attendance";
import { SiteIssues } from "./SiteIssues";
import { CheckInOut } from "./CheckInOut";
import { SafetyChecklists } from "./SafetyChecklists";
import { VoiceNotes } from "./VoiceNotes";
import { useAuthStore } from "@/store/authStore";

export default function SiteManagement() {
  const { current } = useAuthStore();
  const [activeTab, setActiveTab] = useState("reports");

  // Roles that can access these features (adjust as needed)
  const isSiteEngineer = current?.role === "site_engineer";
  const isManager = ["admin", "director", "project_manager"].includes(
    current?.role,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Site Management"
        title="Site Operations"
        description="Daily reports, attendance, issues, check-in, safety, and voice notes."
      />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="checkin">Check-in/out</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="voice">Voice Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="reports" className="mt-6">
          <DailyReports
            canEdit={isSiteEngineer || isManager}
            canApprove={isManager}
          />
        </TabsContent>
        <TabsContent value="attendance" className="mt-6">
          <Attendance canEdit={isSiteEngineer || isManager} />
        </TabsContent>
        <TabsContent value="issues" className="mt-6">
          <SiteIssues canEdit={isSiteEngineer || isManager} />
        </TabsContent>
        <TabsContent value="checkin" className="mt-6">
          <CheckInOut canCheckIn={isSiteEngineer || isManager} />
        </TabsContent>
        <TabsContent value="safety" className="mt-6">
          <SafetyChecklists
            canEdit={isSiteEngineer || isManager}
            canApprove={isManager}
          />
        </TabsContent>
        <TabsContent value="voice" className="mt-6">
          <VoiceNotes canEdit={isSiteEngineer || isManager} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
