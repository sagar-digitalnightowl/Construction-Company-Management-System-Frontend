import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Clock,
  PhoneCall,
} from "lucide-react";
import { useLead } from "@/hooks/useLead";

const StatsCard = ({
  icon: Icon,
  label,
  value,
  colorClass = "text-muted-foreground",
}) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className={`p-2 rounded-full bg-muted ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const MyCallLogsPage = () => {
  const { myCallLogs, fetchMyCallLogs, loading } = useLead();
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchMyCallLogs({ page, limit });
  }, [page]);

  const { logs, summary, pagination } = myCallLogs;
  const totalPages = Math.ceil((pagination.total || 0) / limit);

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Map API status badge color to Shadcn variant
  const getStatusVariant = (status, color) => {
    const colorMap = {
      purple: "secondary",
      green: "success",
      red: "destructive",
      orange: "warning",
      blue: "default",
    };
    if (color && colorMap[color]) return colorMap[color];
    // Fallback based on status string
    const statusMap = {
      connected: "success",
      not_connected: "secondary",
      wrong_number: "destructive",
      callback_requested: "warning",
    };
    return statusMap[status] || "outline";
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatsCard
            icon={Phone}
            label="Total Calls"
            value={summary.totalCalls}
          />
          <StatsCard
            icon={Clock}
            label="Total Duration"
            value={formatDuration(summary.totalDuration)}
            colorClass="text-blue-500"
          />
          <StatsCard
            icon={PhoneCall}
            label="Connected Calls"
            value={summary.connectedCalls}
            colorClass="text-green-500"
          />
        </div>
      )}

      {/* Call Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Call Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Lead / Buyer</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No call logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      {log.calledAtFormatted ||
                        (log.calledAt
                          ? new Date(log.calledAt).toLocaleString()
                          : "-")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.leadId?.clientName || "N/A"}
                    </TableCell>
                    <TableCell>
                      {log.callTimeFormatted ||
                        (log.callDuration
                          ? formatDuration(log.callDuration)
                          : "-")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(
                          log.callStatus,
                          log.statusBadgeColor,
                        )}
                        className="capitalize"
                      >
                        {log.callStatus || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1}–
            {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
            logs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />                                    
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCallLogsPage;
