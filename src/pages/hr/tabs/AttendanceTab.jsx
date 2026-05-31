import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/helpers";

export function AttendanceTab({ attendanceRecords, isPersonal = false }) {
  const statusColor = (status) => {
    switch (status) {
      case "Present": return "success";
      case "Absent": return "destructive";
      case "Half-Day": return "warning";
      case "Late": return "secondary";
      default: return "default";
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {!isPersonal && <TableHead>Employee</TableHead>}
              <TableHead>Check-In</TableHead>
              <TableHead>Check-Out</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((rec) => (
              <TableRow key={rec._id}>
                <TableCell>{formatDate(rec.date)}</TableCell>
                {!isPersonal && <TableCell>{rec.employeeId?.name || rec.employeeId}</TableCell>}
                <TableCell>{rec.checkInTime ? formatDate(rec.checkInTime, "HH:mm") : "-"}</TableCell>
                <TableCell>{rec.checkOutTime ? formatDate(rec.checkOutTime, "HH:mm") : "-"}</TableCell>
                <TableCell>{rec.totalHours?.toFixed(1) || 0}</TableCell>
                <TableCell><Badge variant={statusColor(rec.status)}>{rec.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}