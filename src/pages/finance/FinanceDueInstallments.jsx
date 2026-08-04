

// src/pages/finance/FinanceDueInstallments.jsx
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // ✅ New states for Bulk Sending Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

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

  // ✅ Opens the dialog instead of sending directly
  const handleOpenDialog = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one installment.");
      return;
    }
    setIsDialogOpen(true);
  };

  // ✅ Actual send function called from the dialog
  const handleConfirmSend = async () => {
    const success = await sendWhatsAppReminders(selectedIds, selectedLanguage);
    if (success) {
      setSelectedIds([]);
      setIsDialogOpen(false);
      setSelectedLanguage("en"); // Reset to default
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
          onClick={handleOpenDialog}
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

      {/* ✅ Popup / Dialog for Bulk WhatsApp */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Bulk WhatsApp Reminders</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              You are about to send WhatsApp reminders to <strong className="text-foreground">{selectedIds.length}</strong> selected clients.
            </div>
            
            <div className="space-y-1.5">
              <Label>Message Language</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSend}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Send to All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}