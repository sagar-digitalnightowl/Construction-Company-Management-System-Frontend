// src/components/project/OverviewTab/ClientInfoCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

export function ClientInfoCard({ project }) {
    return (
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Client Information</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2"><Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><div><p className="text-muted-foreground text-xs">Client</p><p className="font-medium">{project?.clientName ?? '—'}</p></div></div>
                {project?.clientPhone && <div className="flex items-start gap-2"><Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{project.clientPhone}</p></div></div>}
                {project?.clientEmail && <div className="flex items-start gap-2"><Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{project.clientEmail}</p></div></div>}
                {project?.address && <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" /><div><p className="text-muted-foreground text-xs">Address</p><p className="font-medium">{Object.values(project.address).filter(Boolean).join(', ')}</p></div></div>}
            </CardContent>
        </Card>
    );
}