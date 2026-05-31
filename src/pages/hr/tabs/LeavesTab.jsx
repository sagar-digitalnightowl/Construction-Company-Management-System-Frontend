import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatDate } from "@/lib/helpers";

export function LeavesTab({ leaves, leaveBalance, canEdit, onProcessLeave }) {
  return (
    <div className="space-y-4">
      {leaveBalance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted rounded-md">
          <div>
            <p className="text-sm text-muted-foreground">Sick Leave</p>
            <p className="text-xl font-bold">{leaveBalance.sickLeave || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Casual Leave</p>
            <p className="text-xl font-bold">{leaveBalance.casualLeave || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Leave</p>
            <p className="text-xl font-bold">{leaveBalance.annualLeave || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Emergency Leave</p>
            <p className="text-xl font-bold">
              {leaveBalance.emergencyLeave || 0}
            </p>
          </div>
        </div>
      )}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((l) => (
                <TableRow key={l._id}>
                  <TableCell>{l.employeeId?.name || l.employeeId}</TableCell>
                  <TableCell>{l.leaveType}</TableCell>
                  <TableCell>{formatDate(l.startDate)}</TableCell>
                  <TableCell>{formatDate(l.endDate)}</TableCell>
                  <TableCell>{l.days}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        l.status === "Approved"
                          ? "success"
                          : l.status === "Pending"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {l.status}
                    </Badge>
                  </TableCell>
                  {canEdit && l.status === "Pending" && (
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600"
                        onClick={() => onProcessLeave(l._id, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => onProcessLeave(l._id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
