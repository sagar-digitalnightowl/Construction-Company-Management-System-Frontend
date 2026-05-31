import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { ShiftDialog } from "@/components/hr/ShiftDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function ShiftsTab({ shifts, canEdit, onRefresh }) {
  const { deleteShift } = useHR();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleEdit = (shift) => {
    setSelectedShift(shift);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedShift(null);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteShift(deletingId);
    toast.success("Shift deleted");
    onRefresh();
    setConfirmOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {shifts.length} shift(s)
        </p>
        {canEdit && (
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-3 w-3 mr-1" /> Add Shift
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Night Shift</TableHead>
                <TableHead>Allowance</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift._id}>
                  <TableCell>{shift.name}</TableCell>
                  <TableCell>{shift.startTime}</TableCell>
                  <TableCell>{shift.endTime}</TableCell>
                  <TableCell>{shift.totalHours}</TableCell>
                  <TableCell>{shift.isNightShift ? "Yes" : "No"}</TableCell>
                  <TableCell>₹{shift.nightShiftAllowance || 0}</TableCell>
                  <TableCell>
                    <Badge variant={shift.isActive ? "success" : "secondary"}>
                      {shift.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(shift)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => {
                          setDeletingId(shift._id);
                          setConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ShiftDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shift={selectedShift}
        onSuccess={onRefresh}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Shift"
        description="Are you sure you want to delete this shift? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
