// src/components/project/OverviewTab/HealthCard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { projectApi } from "@/api/projectApi";

export function HealthCard({ projectId }) {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    projectApi
      .getHealth(projectId)
      .then((res) => setHealth(res.data?.data))
      .catch(console.error);
  }, [projectId]);

  if (!health) return null;

  const colorMap = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" /> Project Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${colorMap[health.health] || "bg-gray-500"}`}
          />
          <span className="font-medium capitalize">{health.health}</span>
        </div>
        {health.riskFactors?.length > 0 && (
          <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
            {health.riskFactors.map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
