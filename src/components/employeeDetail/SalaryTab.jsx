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
import { DollarSign } from "lucide-react";

export function SalaryTab({ salarySlips, canEdit }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Salary Slips</h3>
        {canEdit && (
          <Button size="sm" onClick={() => {}}>
            <DollarSign className="h-4 w-4 mr-1" /> Generate Salary Slip
          </Button>
        )}
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Basic</TableHead>
                <TableHead>HRA</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salarySlips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No salary slips
                  </TableCell>
                </TableRow>
              ) : (
                salarySlips.map((slip) => (
                  <TableRow key={slip._id}>
                    <TableCell>{slip.month}</TableCell>
                    <TableCell>{slip.year}</TableCell>
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
