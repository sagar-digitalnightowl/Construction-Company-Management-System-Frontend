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
import { formatDate } from "@/lib/helpers";
import { Mail, AlertTriangle, Loader2 } from "lucide-react";
import { projectApi } from "@/api";
import { toast } from "sonner";

export function FinanceReminders() {
  // Extract reminders pagination from useFinance
  const { reminders, fetchReminderLogs, loading, pagination } = useFinance();
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState("all");

  // State: Reminders table pagination
  const [page, setPage] = useState(1);
  const limit = 20;

  // State: Projects dropdown pagination
  const [projectPage, setProjectPage] = useState(1);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);

  // Projects fetch function with pagination support
  const fetchProjects = async (pageNo = 1) => {
    try {
      // Backend ko exact limit 10 aur required page bhej rahe hain
      const res = await projectApi.getAll({ page: pageNo, limit: 10 });
      
      if (res.data.success) {
        const fetchedProjects = res.data.data?.projects || [];
        const projectPagination = res.data.data?.pagination;

        if (pageNo === 1) {
          setProjects(fetchedProjects);
        } else {
          // Naye projects ko purane list mein append karo
          setProjects((prev) => [...prev, ...fetchedProjects]);
        }

        // Check karein ki aur pages available hain ya nahi
        if (projectPagination && pageNo >= projectPagination.pages) {
          setHasMoreProjects(false);
        } else {
          setHasMoreProjects(true);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    }
  };

  // Jab bhi filter ya page change ho, reminders API call karo
  useEffect(() => {
    fetchReminderLogs({ 
      projectId: projectFilter === "all" ? undefined : projectFilter,
      page,
      limit
    });
  }, [projectFilter, page, fetchReminderLogs]);

  // Project filter change hone pe reminder table ko page 1 par wapas aao
  useEffect(() => {
    setPage(1);
  }, [projectFilter]);

  // Initial load par pehle 10 projects fetch karo
  useEffect(() => {
    fetchProjects(1);
  }, []);

  // Dropdown ke andar "Load More" handle karne ke liye
  const handleLoadMoreProjects = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextPage = projectPage + 1;
    setProjectPage(nextPage);
    fetchProjects(nextPage);
  };

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
            
            {/* Load More Button for Projects */}
            {hasMoreProjects && (
              <div 
                className="w-full text-left px-2 py-1.5 text-xs text-blue-600 font-medium hover:bg-muted border-t mt-1 cursor-pointer"
                onClick={handleLoadMoreProjects}
              >
                + Load More Projects
              </div>
            )}
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
                    {/* Fallback to createdAt if sentAt is null */}
                    <TableCell>{formatDate(log.sentAt || log.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Reminders Table Pagination Controls */}
          {reminders.length > 0 && pagination?.pages > 1 && (
            <div className="flex items-center justify-end gap-4 p-4 border-t">
              <span className="text-sm text-muted-foreground">
                Showing {reminders.length} of {pagination.total} reminders
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm border rounded bg-background disabled:opacity-50 hover:bg-muted"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span className="text-sm py-1 font-medium">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="px-3 py-1 text-sm border rounded bg-background disabled:opacity-50 hover:bg-muted"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}