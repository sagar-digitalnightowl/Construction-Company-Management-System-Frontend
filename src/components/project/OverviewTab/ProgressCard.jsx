// src/components/project/OverviewTab/ProgressCard.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export function ProgressCard({ project, canEdit, onUpdateProgress }) {
  const [progress, setProgress] = useState(project?.progress ?? 0);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    const success = await onUpdateProgress(project._id, Number(progress));
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Project Completion
          {canEdit && (
            <Button size="sm" onClick={handleUpdate} disabled={saving}>
              {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Update
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Progress value={Number(progress)} className="flex-1" indicatorClassName={project?.status === 'delayed' ? 'bg-destructive' : Number(progress) > 70 ? 'bg-[color:var(--color-success)]' : 'bg-primary'} />
          {canEdit ? (
            <Input type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(e.target.value)} className="w-20 text-center" />
          ) : (
            <span className="font-semibold tabular-nums w-12 text-right">{progress}%</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}