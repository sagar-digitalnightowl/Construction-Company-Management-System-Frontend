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

export function SalaryTab({ salarySlips, canEdit }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month/Year</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Basic</TableHead>
              <TableHead>HRA</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead>Status</TableHead>
              {canEdit && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {salarySlips.map((slip) => (
              <TableRow key={slip._id}>
                <TableCell>
                  {slip.month} {slip.year}
                </TableCell>
                <TableCell>
                  {slip.employeeId?.name || slip.employeeId}
                </TableCell>
                <TableCell>₹{slip.basicSalary?.toLocaleString()}</TableCell>
                <TableCell>₹{slip.hra?.toLocaleString()}</TableCell>
                <TableCell>₹{slip.allowances?.toLocaleString()}</TableCell>
                <TableCell>₹{slip.deductions?.toLocaleString()}</TableCell>
                <TableCell className="font-bold">
                  ₹{slip.netPay?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      slip.paymentStatus === "Paid" ? "success" : "warning"
                    }
                  >
                    {slip.paymentStatus}
                  </Badge>
                </TableCell>
                {canEdit && slip.paymentStatus !== "Paid" && (
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      Mark Paid
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
