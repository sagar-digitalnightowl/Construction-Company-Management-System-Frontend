// src/components/project/OverviewTab/PhaseCard.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/helpers';

const PHASES = ['tender', 'planning', 'excavation', 'foundation', 'structure', 'brickwork', 'electrical', 'plumbing', 'finishing', 'handover', 'maintenance'];

export function PhaseCard({ project, canEdit, onUpdatePhase }) {
    const [phase, setPhase] = useState(project?.currentPhase || '');
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async () => {
        if (!phase) return;
        setUpdating(true);
        await onUpdatePhase(project._id, phase);
        setUpdating(false);
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex justify-between items-center">
                    Update Project Phase
                    {canEdit && <Button size="sm" onClick={handleUpdate} disabled={updating}>Update</Button>}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <select value={phase} onChange={e => setPhase(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" disabled={!canEdit}>
                    <option value="">Select Phase</option>
                    {PHASES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
            </CardContent>
        </Card>
    );
}