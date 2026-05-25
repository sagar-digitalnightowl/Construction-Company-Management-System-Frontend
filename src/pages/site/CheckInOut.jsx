// src/pages/site/CheckInOut.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, LogIn, LogOut } from "lucide-react";
import { useSite } from "@/hooks/useSite";
import { projectApi } from "@/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/helpers";

export function CheckInOut({ canEdit, canOperationsEdit }) {
  const {
    activeCheckin,
    checkinHistory,
    fetchActiveCheckin,
    fetchCheckinHistory,
    checkIn,
    checkOut,
    loading,
  } = useSite();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchActiveCheckin();
    fetchCheckinHistory();
    projectApi
      .getAll()
      .then((res) => setProjects(res.data?.data?.projects || []))
      .catch(console.error);
  }, [fetchActiveCheckin, fetchCheckinHistory]);

  const handleCheckIn = async () => {
    if (!selectedProject) return toast.error("Select a project");
    // In real app, get GPS coordinates
    const dummyLat = 28.6139;
    const dummyLng = 77.209;
    setChecking(true);
    const success = await checkIn({
      projectId: selectedProject,
      checkInLatitude: dummyLat,
      checkInLongitude: dummyLng,
      checkInAddress: "Site location (auto-detected)",
      notes: "Checked in",
    });
    setChecking(false);
    if (success) setSelectedProject("");
  };

  const handleCheckOut = async () => {
    setChecking(true);
    const success = await checkOut({ workSummary });
    setChecking(false);
    if (success) setWorkSummary("");
  };

  if (loading && !activeCheckin) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      {/* Current status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {activeCheckin ? (
              <>
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Currently checked in</span>
              </>
            ) : (
              <>
                <div className="h-3 w-3 rounded-full bg-gray-400" />
                <span className="font-medium">Not checked in</span>
              </>
            )}
          </div>
          {activeCheckin ? (
            <div className="space-y-3">
              <p>
                Project: <strong>{activeCheckin.projectId?.name}</strong>
              </p>
              <p>Checked in at: {formatDate(activeCheckin.checkInTime)}</p>
              <div className="space-y-1">
                <Label>Work Summary (optional)</Label>
                <textarea
                  className="w-full border rounded-md p-2 text-sm"
                  rows={2}
                  value={workSummary}
                  onChange={(e) => setWorkSummary(e.target.value)}
                  placeholder="Describe what was done today"
                />
              </div>
              {canOperationsEdit && (
                <Button
                  onClick={handleCheckOut}
                  disabled={checking}
                  variant="destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Check Out
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Label>Select Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {canOperationsEdit && (
                <Button
                  onClick={handleCheckIn}
                  disabled={checking || !selectedProject}
                >
                  <LogIn className="h-4 w-4 mr-2" /> Check In
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Check-in History</h3>
        {checkinHistory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">No history</CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {checkinHistory.map((h) => (
              <Card key={h._id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{h.projectId?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        In: {formatDate(h.checkInTime)}
                      </p>
                      {h.checkOutTime && (
                        <p className="text-xs">
                          Out: {formatDate(h.checkOutTime)}
                        </p>
                      )}
                    </div>
                    {h.workSummary && (
                      <p className="text-sm italic max-w-md">{h.workSummary}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
