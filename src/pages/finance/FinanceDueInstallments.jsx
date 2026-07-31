import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR, formatDate } from "@/lib/helpers";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceDueInstallments() {
  const {
    dueInstallments,
    duePagination,
    fetchDueInstallments,
    sendWhatsAppReminders,
    loading,
  } = useFinance();

  const [currentPage, setCurrentPage] = useState(1);
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchDueInstallments({
      page: currentPage,
      limit: 20,
      dueDate: dueDateFilter || undefined,
      overdue: overdueOnly || undefined,
    });
    // Selection clear on page change or filter change
    setSelectedIds([]);
  }, [currentPage, dueDateFilter, overdueOnly, fetchDueInstallments]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(dueInstallments.map((item) => item.installment.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (checked, id) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSendReminders = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one installment.");
      return;
    }
    const success = await sendWhatsAppReminders(selectedIds);
    if (success) {
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <Label>Filter by Due Date</Label>
            <Input
              type="date"
              value={dueDateFilter}
              onChange={(e) => {
                setDueDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-auto"
            />
          </div>
          <div className="flex items-center gap-2 mb-2 mt-auto">
            <Checkbox
              id="overdue"
              checked={overdueOnly}
              onCheckedChange={(val) => {
                setOverdueOnly(val);
                setCurrentPage(1);
              }}
            />
            <Label htmlFor="overdue" className="cursor-pointer">
              Show Overdue Only
            </Label>
          </div>
        </div>

        <Button
          onClick={handleSendReminders}
          disabled={selectedIds.length === 0 || loading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <MessageCircle className="mr-2 h-4 w-4" />
          Send WhatsApp to Selected ({selectedIds.length})
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={
                      dueInstallments.length > 0 &&
                      selectedIds.length === dueInstallments.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Client Details</TableHead>
                <TableHead>Project / Flat</TableHead>
                <TableHead className="text-right">Amount Due</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-4">
                    <Skeleton className="h-8 w-full mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : dueInstallments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No due installments found.
                  </TableCell>
                </TableRow>
              ) : (
                dueInstallments.map((item) => {
                  const id = item.installment.id;
                  const isOverdue = new Date(item.installment.dueDate) < new Date();
                  return (
                    <TableRow key={id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedIds.includes(id)}
                          onCheckedChange={(checked) => handleSelectOne(checked, id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.client?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.client?.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{item.booking?.projectName}</div>
                        <div className="text-xs text-muted-foreground">
                          Flat: {item.booking?.flatNumber} | {item.booking?.tower}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-destructive">
                        {formatINR(item.installment.dueAmount)}
                      </TableCell>
                      <TableCell>
                        <span className={isOverdue ? "text-destructive font-medium" : ""}>
                          {formatDate(item.installment.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                          {item.installment.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination component can be added here similar to FinanceBookings */}
    </div>
  );
}