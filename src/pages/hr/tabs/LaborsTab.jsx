import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { LaborDialog } from "@/components/hr/LaborDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function LaborsTab({ labors, canEdit, onRefresh }) {

  const navigate = useNavigate();
  const { deleteLabor } = useHR();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleEdit = (labor) => {
    setSelectedLabor(labor);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedLabor(null);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteLabor(deletingId);
    toast.success("Labor deleted");
    onRefresh();
    setConfirmOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {labors.length} labor(s)
        </p>
        {canEdit && (
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-3 w-3 mr-1" /> Add Labor
          </Button>
        )}
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Trade</TableHead>
                <TableHead>Daily Wage</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                {canEdit && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {labors?.map((labor) => (
                <TableRow
                  key={labor._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/hr/labors/${labor._id}`)}
                >
                  <TableCell className="font-medium">{labor.name}</TableCell>
                  <TableCell>{labor.phone}</TableCell>
                  <TableCell>{labor.laborType}</TableCell>
                  <TableCell>{labor.trade}</TableCell>
                  <TableCell>₹{labor.dailyWage}</TableCell>
                  <TableCell>
                    {labor.assignedProject?.name || labor.assignedProject}
                  </TableCell>
                  <TableCell>
                    <Badge variant={labor.isActive ? "success" : "destructive"}>
                      {labor.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(labor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => {
                          setDeletingId(labor._id);
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
      <LaborDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        labor={selectedLabor}
        onSuccess={onRefresh}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Labor"
        description="Are you sure you want to delete this labor? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
