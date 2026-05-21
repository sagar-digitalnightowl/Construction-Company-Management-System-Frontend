// src/pages/site/DailyReports.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { useSite } from "@/hooks/useSite";
import { CreateDailyReportDialog } from "@/components/site/CreateDailyReportDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/useProject";
import { projectApi } from "@/api";

export function DailyReports({ canEdit, canApprove }) {
  const {
    dailyReports,
    fetchDailyReports,
    createDailyReport,
    updateDailyReport,
    deleteDailyReport,
    approveDailyReport,
    loading,
  } = useSite();
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await projectApi.getAll();
      if (res.data.success) {
        setProjects(res.data.data?.projects || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchDailyReports();
    fetchProjects();
  }, []);

  const handleEdit = (report) => {
    setEditingReport(report);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this report?")) await deleteDailyReport(id);
  };

  const handleApprove = async (id) => {
    await approveDailyReport(id);
  };

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {dailyReports.length} report(s)
        </p>
        {canEdit && (
          <Button
            size="sm"
            onClick={() => {
              setEditingReport(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> New Report
          </Button>
        )}
      </div>
      {dailyReports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            No daily reports yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {dailyReports.map((report) => (
            <Card key={report._id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {report.projectId?.name || "Project"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(report.date)}
                    </p>
                  </div>
                  <Badge variant={report.isApproved ? "success" : "secondary"}>
                    {report.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm">
                  {report.workDone?.map((w) => w.taskName).join(", ") ||
                    "No work done"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Progress: {report.progress}%
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(report)}
                  >
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                  {canEdit && !report.isApproved && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(report)}
                      >
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(report._id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </>
                  )}
                  {canApprove && !report.isApproved && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(report._id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Approve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <CreateDailyReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projects={projects}
        initialData={editingReport}
        onSubmit={
          editingReport
            ? (data) => updateDailyReport(editingReport._id, data)
            : createDailyReport
        }
      />
    </div>
  );
}
