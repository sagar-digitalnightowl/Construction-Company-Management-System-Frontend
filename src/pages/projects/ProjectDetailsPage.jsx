// src/pages/ProjectDetail.jsx
import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Flag,
  ClipboardList,
  AlertCircle,
  Shield,
  Package,
  Activity,
  CheckSquare,
  FileText,
} from "lucide-react";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectStats } from "@/components/project/ProjectStats";
import { OverviewTab } from "@/components/project/OverviewTab";
import { MilestonesTab } from "@/components/project/MilestonesTab";
import { BOQTab } from "@/components/project/BOQTab";
import { IssuesTab } from "@/components/project/IssuesTab";
import { RisksTab } from "@/components/project/RisksTab";
import { MaterialRequestsTab } from "@/components/project/MaterialRequestsTab";
import { ActivityTab } from "@/components/project/ActivityTab";
import { TasksTab } from "@/components/project/TaskTab/index";
import { useProject } from "@/hooks/useProject";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { DprTab } from "@/components/project/DprTab";
import { ChecklistTab } from "@/components/project/ChecklistTab";
import { ResourceTab } from "@/components/project/ResourceTab";
import { DocumentsTab } from "@/components/project/DocumentsTab";

export default function ProjectDetail() {
  const { id } = useParams();
  const { current } = useAuthStore();
  const canEdit = canMutate(current?.role, "projects");
  const canOperationsEdit = canMutate(current?.role, "project-operations");
  const {
    loading,
    project,
    milestones,
    boq,
    comments,
    issues,
    risks,
    materialRequests,
    fetchProject,
    updateProgress,
    updatePhase,
    addMilestone,
    addBOQItem,
    addComment,
    addRisk,
    addIssue,
    resolveIssue,
    createMaterialRequest,
    assignTeam,
    updateTeamRole,
    removeTeamMember,
  } = useProject();

  useEffect(() => {
    fetchProject(id);
  }, [id]);

  if (loading)
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
  if (!project) return null;

  return (
    <div className="space-y-5 sm:space-y-6">
      <ProjectHeader project={project} />
      <ProjectStats project={project} />
      <Tabs defaultValue="overview">
        <div className="w-full h-full overflow-auto scrollbar-none">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5 ml-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="dpr">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              DPR
            </TabsTrigger>
            <TabsTrigger value="checklist">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Package className="h-3.5 w-3.5 mr-1.5" />
              Resources
            </TabsTrigger>

            <TabsTrigger value="milestones">
              <Flag className="h-3.5 w-3.5 mr-1.5" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="boq">
              <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
              BOQ
            </TabsTrigger>
            <TabsTrigger value="issues">
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="risks">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Risks
            </TabsTrigger>
            <TabsTrigger value="materials">
              <Package className="h-3.5 w-3.5 mr-1.5" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-3.5 w-3.5 mr-1.5" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-3.5 w-3.5 mr-3.5" />
              Documents
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="mt-5">
          <TabsContent value="overview">
            <OverviewTab
              project={project}
              comments={comments}
              canEdit={canEdit}
              canOperationsEdit={canOperationsEdit}
              onUpdateProgress={updateProgress}
              onUpdatePhase={updatePhase}
              onAddComment={(text) => addComment(project._id, text)}
              onAssignTeam={assignTeam}
              onUpdateTeamRole={updateTeamRole}
              onRemoveTeamMember={removeTeamMember}
            />
          </TabsContent>

          <TabsContent value="dpr">
            <DprTab
              projectId={project._id}
              canOperationsEdit={canOperationsEdit}
            />
          </TabsContent>
          <TabsContent value="checklist">
            <ChecklistTab
              projectId={project._id}
              canOperationsEdit={canOperationsEdit}
            />
          </TabsContent>
          <TabsContent value="resources">
            <ResourceTab projectId={project._id} canEdit={canEdit} />
          </TabsContent>

          <TabsContent value="milestones">
            <MilestonesTab
              project={project}
              milestones={milestones}
              canEdit={canEdit}
              onAddMilestone={addMilestone}
            />
          </TabsContent>

          <TabsContent value="boq">
            <BOQTab
              boq={boq}
              canEdit={canEdit}
              onAddBOQItem={(data) => addBOQItem(project._id, data)}
            />
          </TabsContent>

          <TabsContent value="issues">
            <IssuesTab
              issues={issues}
              canOperationsEdit={canOperationsEdit}
              teamMembers={project.teamMembers || []}
              onAddIssue={(data) => addIssue(project._id, data)}
              onResolveIssue={(issueId) => resolveIssue(project._id, issueId)}
            />
          </TabsContent>

          <TabsContent value="risks">
            <RisksTab
              risks={risks}
              canEdit={canEdit}
              onAddRisk={(data) => addRisk(project._id, data)}
            />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialRequestsTab projectId={project._id} canEdit={canEdit} />
          </TabsContent>

          <TabsContent value="tasks">
            {current?.role === "site_engineer" ? (
              <Navigate to={"/tasks/my-tasks"} />
            ) : (
              <TasksTab
                projectId={project._id}
                milestones={milestones}
                teamMembers={project.teamMembers || []}
                canEdit={canEdit}
                canOperationsEdit={canOperationsEdit}
              />
            )}
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTab projectId={project._id} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab
              projectId={project._id}
              canEdit={canEdit}
              canOperationsEdit={canOperationsEdit}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
