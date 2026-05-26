// // src/components/project/OverviewTab/index.jsx
// import React from "react";
// import { ProgressCard } from "./ProgressCard";
// import { BudgetCard } from "./BudgetCard";
// import { ClientInfoCard } from "./ClientInfoCard";
// import { TeamCard } from "./TeamCard";
// import { PhaseCard } from "./PhaseCard";
// import { CommentsCard } from "./CommentsCard";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { WeatherCard } from "./WeatherCard";

// export function OverviewTab({
//   project,
//   comments,
//   canEdit,
//   onUpdateProgress,
//   onUpdatePhase,
//   onAddComment,
//   onAssignTeam,
//   onUpdateTeamRole,
//   onRemoveTeamMember,
// }) {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//         <div className="lg:col-span-2 space-y-2">
//           <ProgressCard
//             project={project}
//             canEdit={canEdit}
//             onUpdateProgress={onUpdateProgress}
//           />
//           <BudgetCard project={project} />
//           {project?.description && (
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm">Description</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground">
//                   {project.description}
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//           <PhaseCard
//             project={project}
//             canEdit={canEdit}
//             onUpdatePhase={onUpdatePhase}
//           />
//           <CommentsCard comments={comments} onAddComment={onAddComment} />
//         </div>
//         <div className="space-y-2">
//           <WeatherCard projectId={project._id} canEdit={canEdit} />
//           <ClientInfoCard project={project} />
//           <TeamCard
//             project={project}
//             canEdit={canEdit}
//             onAssignTeam={onAssignTeam}
//             onUpdateTeamRole={onUpdateTeamRole}
//             onRemoveTeamMember={onRemoveTeamMember}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/project/OverviewTab/index.jsx (updated)
import React from "react";
import { ProgressCard } from "./ProgressCard";
import { BudgetCard } from "./BudgetCard";
import { ClientInfoCard } from "./ClientInfoCard";
import { TeamCard } from "./TeamCard";
import { PhaseCard } from "./PhaseCard";
import { CommentsCard } from "./CommentsCard";
import { WeatherCard } from "./WeatherCard";
import { VisitorsCard } from "./VisitorsCard";
import { NotesCard } from "./NotesCard";
import { HealthCard } from "./HealthCard";
import { TimelineCard } from "./TimelineCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverviewTab({
  project,
  comments,
  canEdit,
  canOperationsEdit,
  onUpdateProgress,
  onUpdatePhase,
  onAddComment,
  onAssignTeam,
  onUpdateTeamRole,
  onRemoveTeamMember,
}) {
  return (
    <div className="space-y-6">
      {/* Top stats row (already exists in ProjectStats component, but you can keep as is) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left column – main content */}
        <div className="lg:col-span-2 space-y-3">
          <ProgressCard
            project={project}
            canEdit={canEdit}
            onUpdateProgress={onUpdateProgress}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BudgetCard project={project} />
            <PhaseCard
              project={project}
              canEdit={canEdit}
              onUpdatePhase={onUpdatePhase}
            />
            <HealthCard projectId={project._id} />
            <TimelineCard projectId={project._id} />
          </div>
          {project?.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          )}
          <CommentsCard comments={comments} onAddComment={onAddComment} />
        </div>

        {/* Right column – side cards */}
        <div className="space-y-3">
          <WeatherCard
            projectId={project._id}
            canOperationsEdit={canOperationsEdit}
          />
          <ClientInfoCard project={project} />
          <TeamCard
            project={project}
            canEdit={canEdit}
            onAssignTeam={onAssignTeam}
            onUpdateTeamRole={onUpdateTeamRole}
            onRemoveTeamMember={onRemoveTeamMember}
          />
          <VisitorsCard
            projectId={project._id}
            canOperationsEdit={canOperationsEdit}
          />
          <NotesCard projectId={project._id} canEdit={canEdit} />
        </div>
      </div>
    </div>
  );
}
