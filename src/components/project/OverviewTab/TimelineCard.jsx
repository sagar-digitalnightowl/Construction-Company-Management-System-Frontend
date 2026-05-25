// src/components/project/OverviewTab/TimelineCard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { projectApi } from "@/api/projectApi";

export function TimelineCard({ projectId }) {
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    projectApi
      .getTimeline(projectId)
      .then((res) => setTimeline(res.data?.data))
      .catch(console.error);
  }, [projectId]);

  if (!timeline) return null;

  // Safeguard against division by zero
  const totalDays = timeline.totalDays || 1;
  const elapsedDays = timeline.elapsedDays || 0;
  const progressPercent = Math.min(100, (elapsedDays / totalDays) * 100);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CalendarDays className="h-4 w-4" /> Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Start:</span>
          <span>{new Date(timeline.startDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">End:</span>
          <span>{new Date(timeline.endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Remaining:</span>
          <span className="font-medium">
            {timeline.remainingDays ?? 0} days
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* Optional: show elapsed/total days as text */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{elapsedDays} days elapsed</span>
          <span>{totalDays} days total</span>
        </div>
      </CardContent>
    </Card>
  );
}
