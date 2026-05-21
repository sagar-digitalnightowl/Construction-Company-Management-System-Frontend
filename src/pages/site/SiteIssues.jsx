// src/pages/site/SiteIssues.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { useSite } from "@/hooks/useSite";
import { ReportIssueDialog } from "@/components/site/ReportIssueDialog";
import { Skeleton } from "@/components/ui/skeleton";

const severityVariant = {
  low: "muted",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
};

export function SiteIssues({ canEdit }) {
  const { issues, fetchIssues, createIssue, resolveIssue, loading } = useSite();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleResolve = async (id) => {
    const resolution = prompt("Enter resolution details:");
    if (resolution) await resolveIssue(id, resolution);
  };

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {issues.length} issue(s)
        </p>
        {canEdit && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> Report Issue
          </Button>
        )}
      </div>
      {issues.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            No issues reported
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {issues.map((issue) => (
            <Card
              key={issue._id}
              className={issue.status === "resolved" ? "opacity-60" : ""}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Reported: {formatDate(issue.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={severityVariant[issue.severity]}>
                      {issue.severity}
                    </Badge>
                    <Badge
                      variant={
                        issue.status === "resolved" ? "success" : "secondary"
                      }
                    >
                      {issue.status}
                    </Badge>
                  </div>
                </div>
                {issue.description && (
                  <p className="text-sm text-muted-foreground">
                    {issue.description}
                  </p>
                )}
                {issue.status === "resolved" && issue.resolution && (
                  <p className="text-xs text-green-600 mt-1">
                    <strong>Resolution:</strong> {issue.resolution}
                  </p>
                )}
                {canEdit && issue.status !== "resolved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(issue._id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ReportIssueDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={createIssue}
      />
    </div>
  );
}
