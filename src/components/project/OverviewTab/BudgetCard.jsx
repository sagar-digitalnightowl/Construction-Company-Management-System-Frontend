// src/components/project/OverviewTab/BudgetCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatINR } from '@/lib/helpers';

export function BudgetCard({ project }) {
    const burn = project?.budget ? Math.round(((project.spent ?? 0) / project.budget) * 100) : 0;
    return (
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Budget Utilization</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground"><span>Spent</span><span>{burn}%</span></div>
                <Progress value={burn} indicatorClassName={burn > 90 ? 'bg-destructive' : burn > 70 ? 'bg-warning' : 'bg-emerald-500'} />
                <div className="flex justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Spent: <span className="text-foreground font-medium">{formatINR(project?.spent ?? 0)}</span></span>
                    <span className="text-muted-foreground">Budget: <span className="text-foreground font-medium">{formatINR(project?.budget)}</span></span>
                </div>
            </CardContent>
        </Card>
    );
}