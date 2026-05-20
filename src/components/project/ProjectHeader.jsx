// src/components/project/ProjectHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { STATUS } from '@/pages/projects/Projects';

export function ProjectHeader({ project }) {
    const navigate = useNavigate();
    return (
        <div>
            <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate('/projects')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
            </Button>
            <div className="flex flex-wrap items-start gap-3 justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold">{project?.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {project?.location}
                        </span>
                        <Badge variant={STATUS[project?.status]?.variant}>
                            {STATUS[project?.status]?.label ?? project?.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">{project?.priority} priority</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}