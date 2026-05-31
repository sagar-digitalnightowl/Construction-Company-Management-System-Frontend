import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useHR } from "@/hooks/useHR";
import { formatDate } from "@/lib/helpers";

export default function LaborDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchLaborById, fetchLaborAttendanceSummary, loading } = useHR();

  const [labor, setLabor] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      const lab = await fetchLaborById(id);
      if (lab) {
        setLabor(lab);
        const summary = await fetchLaborAttendanceSummary(id);
        setAttendanceSummary(summary);
      } else {
        navigate("/hr");
      }
    };
    load();
  }, [id]);

  if (!labor && loading) return <Skeleton className="h-96" />;
  if (!labor) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/hr")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{labor.name}</h1>
        <Badge variant={labor.isActive ? "success" : "destructive"}>
          {labor.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <Phone className="inline h-3 w-3 mr-1" /> {labor.phone}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Labor Type</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{labor.laborType}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{labor.trade}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Daily Wage</CardTitle>
          </CardHeader>
          <CardContent>
            <p>₹{labor.dailyWage}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{labor.assignedProject?.name || labor.assignedProject || "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Standard Hours/Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{labor.standardHoursPerDay} hrs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Attendance Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Card>
            <CardContent className="p-6">
              {attendanceSummary ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Days</p>
                    <p className="text-2xl font-bold">
                      {attendanceSummary.totalDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-green-600">
                      {attendanceSummary.presentDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-red-600">
                      {attendanceSummary.absentDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Half Days</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {attendanceSummary.halfDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-xl font-bold">
                      {attendanceSummary.totalHours || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Overtime
                    </p>
                    <p className="text-xl font-bold">
                      {attendanceSummary.totalOvertime || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Earnings
                    </p>
                    <p className="text-xl font-bold">
                      ₹{attendanceSummary.totalEarnings?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No attendance data available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
