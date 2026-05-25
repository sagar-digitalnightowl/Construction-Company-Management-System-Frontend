// src/pages/site/Attendance.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Users, Clock } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { useSite } from "@/hooks/useSite";
import { MarkAttendanceDialog } from "@/components/site/MarkAttendanceDialog";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectApi } from "@/api";

export function Attendance({ canEdit, canOperationsEdit }) {
  const { current } = useAuthStore();
  const {
    attendance,
    myAttendance,
    fetchAttendance,
    fetchMyAttendance,
    markAttendance,
    loading,
  } = useSite();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(false);

  const isSiteEngineer = current?.role === "site_engineer";

  // Fetch projects for non-site-engineer roles
  useEffect(() => {
    if (!isSiteEngineer) {
      const fetchProjects = async () => {
        setLoadingProjects(true);                                                                 
        try {
          const res = await projectApi.getAll();
          setProjects(res.data?.data?.projects || []);
        } catch (err) {         
          console.error("Failed to load projects", err);
        } finally {     
          setLoadingProjects(false);
        }
      };
      fetchProjects();
    }
  }, [isSiteEngineer]);                                 

  // For site engineer, fetch their own attendance automatically                                                        
  useEffect(() => {              
    if (isSiteEngineer) {                    
      fetchMyAttendance();
    }
  }, [fetchMyAttendance, isSiteEngineer]);

  // For manager/admin, fetch attendance when project is selected
  useEffect(() => {
    if (!isSiteEngineer && selectedProjectId) {
      fetchAttendance({ projectId: selectedProjectId });
    }
  }, [fetchAttendance, isSiteEngineer, selectedProjectId]);

  const list = isSiteEngineer ? myAttendance : attendance;

  // Map project IDs to names (for display when projectId is just an ID)
  const projectMap = projects.reduce((acc, p) => {
    acc[p._id] = p.name;
    return acc;
  }, {});

  if (loadingProjects) {
    return <Skeleton className="h-32" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">{list.length} record(s)</p>
        <div className="flex gap-2">
          {!isSiteEngineer && (
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {canOperationsEdit && (
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="h-3 w-3 mr-1" /> Mark Attendance
            </Button>
          )}
        </div>
      </div>

      {!isSiteEngineer && !selectedProjectId && projects.length > 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Select a project to view attendance records.
            </p>
          </CardContent>
        </Card>
      )}

      {(loading || (isSiteEngineer && loading === undefined)) && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}

      {!loading && list.length === 0 && selectedProjectId && (
        <Card>
          <CardContent className="p-8 text-center">
            No attendance records for this project.
          </CardContent>
        </Card>
      )}

      {!loading && list.length > 0 && (
        <div className="space-y-3">
          {list.map((att) => (
            <Card key={att._id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {att.projectId?.name ||
                        projectMap[att.projectId] ||
                        att.projectId ||
                        "Unknown Project"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Date: {formatDate(att.date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Marked by: {att.markedBy?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Labor Count</p>
                    <p className="text-sm">Skilled: {att.skilledLabor || 0}</p>
                    <p className="text-sm">
                      Semi-skilled: {att.semiSkilledLabor || 0}
                    </p>
                    <p className="text-sm">
                      Unskilled: {att.unskilledLabor || 0}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Total: {att.totalLaborCount}
                    </p>
                  </div>
                </div>
                {att.laborNames && att.laborNames.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Labor Names:
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {att.laborNames.map((name, idx) => (
                        <span
                          key={idx}
                          className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(att.isOvertime || att.remarks) && (
                  <div className="mt-3 pt-2 border-t text-sm text-muted-foreground">
                    {att.isOvertime && (
                      <p className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Overtime:{" "}
                        {att.overtimeHours} hours
                      </p>
                    )}
                    {att.remarks && <p>Remarks: {att.remarks}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MarkAttendanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => {
          const res = markAttendance(data);
          setSelectedProjectId(data.projectIds)
          return res;
        }}
      />
    </div>
  );
}
