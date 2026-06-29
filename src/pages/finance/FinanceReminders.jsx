// src/pages/finance/FinanceReminders.jsx
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useProjectsStore } from "@/store/dataStore";
import { formatDate } from "@/lib/helpers";
import { Mail, AlertTriangle, Loader2 } from "lucide-react";
import { projectApi } from "@/api";

export function FinanceReminders() {
  const { reminders, fetchReminderLogs, loading } = useFinance();
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState("all");


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
    fetchReminderLogs({ projectId: projectFilter === "all" ? undefined : projectFilter });
  }, [projectFilter, fetchReminderLogs]);

  useEffect(() => {
    fetchProjects();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filter by Project:</span>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Milestone / Installment</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Booking Ref</TableHead>
                <TableHead>Sent At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No reminders found.
                  </TableCell>
                </TableRow>
              ) : (
                reminders.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      {log.reminderType === "penalty" ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> Penalty
                        </Badge>
                      ) : (
                        <Badge variant="default" className="gap-1">
                          <Mail className="h-3 w-3" /> Normal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{log.recipient}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{log.subject}</TableCell>
                    <TableCell>{log.milestone}</TableCell>
                    <TableCell>{log.projectId?.name || "—"}</TableCell>
                    <TableCell>{log.bookingId?.bookingReferenceNumber || "—"}</TableCell>
                    <TableCell>{formatDate(log.sentAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}