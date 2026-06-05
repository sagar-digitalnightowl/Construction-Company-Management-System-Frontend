import { Button } from "@/components/ui/button";
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
import { CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/helpers";

export function LeavesTab({
  employeeLeaves,
  leaveBalance,
  canEdit,
  onProcessLeave,
}) {
  return (
    <div className="space-y-4">
      {leaveBalance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted p-4 rounded-md">
          <div>
            <p className="text-sm text-muted-foreground">Sick Leave</p>
            <p className="text-2xl font-bold">{leaveBalance.sickLeave || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Casual Leave</p>
            <p className="text-2xl font-bold">
              {leaveBalance.casualLeave || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Leave</p>
            <p className="text-2xl font-bold">
              {leaveBalance.annualLeave || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Emergency Leave</p>
            <p className="text-2xl font-bold">
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
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No leave requests
                  </TableCell>
                </TableRow>
              ) : (
                employeeLeaves.map((leave) => (
                  <TableRow key={leave._id}>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{formatDate(leave.startDate)}</TableCell>
                    <TableCell>{formatDate(leave.endDate)}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          leave.status === "Approved"
                            ? "success"
                            : leave.status === "Pending"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {leave.status}
                      </Badge>
                    </TableCell>
                    {canEdit && leave.status === "Pending" && (
                      <TableCell className="text-right space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600"
                          onClick={() => onProcessLeave(leave._id, "Approved")}
                        >
                          <CheckCircle className="h-4 w-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => onProcessLeave(leave._id, "Rejected")}
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </TableCell>
                    )}
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
