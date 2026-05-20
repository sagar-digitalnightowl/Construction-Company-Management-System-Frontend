// src/components/project/OverviewTab/index.jsx
import React from 'react';
import { ProgressCard } from './ProgressCard';
import { BudgetCard } from './BudgetCard';
import { ClientInfoCard } from './ClientInfoCard';
import { TeamCard } from './TeamCard';
import { PhaseCard } from './PhaseCard';
import { CommentsCard } from './CommentsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function OverviewTab({ project, comments, canEdit, onUpdateProgress, onUpdatePhase, onAddComment, onAssignTeam }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                    <ProgressCard project={project} canEdit={canEdit} onUpdateProgress={onUpdateProgress} />
                    <BudgetCard project={project} />
                    {project?.description && (
                        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Description</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{project.description}</p></CardContent></Card>
                    )}
                    <PhaseCard project={project} canEdit={canEdit} onUpdatePhase={onUpdatePhase} />
                    <CommentsCard comments={comments} onAddComment={onAddComment} />
                </div>
                <div className="space-y-2">
                    <ClientInfoCard project={project} />
                    <TeamCard project={project} canEdit={canEdit} onAssignTeam={onAssignTeam} />
                </div>
            </div>
        </div>
    );
}