// src/components/project/ProjectStats.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { formatINR, formatDate } from '@/lib/helpers';

function StatCard({ icon: Icon, label, value, sub, iconClass = 'text-primary' }) {
    return (
        <Card>
            <CardContent className="p-4 flex items-start gap-3">
                <div className={`mt-0.5 ${iconClass}`}><Icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-semibold text-sm mt-0.5 truncate">{value}</p>
                    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                </div>
            </CardContent>
        </Card>
    );
}

export function ProjectStats({ project }) {
    const burn = project?.budget ? Math.round(((project.spent ?? 0) / project.budget) * 100) : 0;
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={IndianRupee} label="Total Budget" value={formatINR(project?.budget)} sub={`${burn}% utilized`} iconClass="text-emerald-600" />
            <StatCard icon={TrendingUp} label="Amount Spent" value={formatINR(project?.spent ?? 0)} sub={formatINR((project?.budget ?? 0) - (project?.spent ?? 0)) + ' remaining'} iconClass="text-blue-500" />
            <StatCard icon={Calendar} label="Start Date" value={formatDate(project?.startDate)} />
            <StatCard icon={Calendar} label="End Date" value={formatDate(project?.endDate)} iconClass="text-orange-500" />
        </div>
    );
}