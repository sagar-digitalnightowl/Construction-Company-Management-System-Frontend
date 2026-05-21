// src/pages/site/Attendance.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { useSite } from "@/hooks/useSite";
import { MarkAttendanceDialog } from "@/components/site/MarkAttendanceDialog";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";

export function Attendance({ canEdit }) {
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

  useEffect(() => {
    if (current?.role === "site_engineer") {
      fetchMyAttendance();
    } else {
      fetchAttendance();
    }
  }, [fetchAttendance, fetchMyAttendance, current]);

  const list = current?.role === "site_engineer" ? myAttendance : attendance;

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{list.length} record(s)</p>
        {canEdit && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> Mark Attendance
          </Button>
        )}
      </div>
      {list.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            No attendance records
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {list.map((att) => (
            <Card key={att._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {att.projectId?.name || "Project"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(att.date)}
                  </p>
                  <p className="text-sm mt-1">
                    Total labor: {att.totalLaborCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Skilled: {att.skilledLabor || 0}</p>
                  <p className="text-sm">
                    Semi-skilled: {att.semiSkilledLabor || 0}
                  </p>
                  <p className="text-sm">
                    Unskilled: {att.unskilledLabor || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <MarkAttendanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={markAttendance}
      />
    </div>
  );
}
