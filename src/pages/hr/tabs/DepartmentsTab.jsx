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
import { DepartmentDialog } from "@/components/hr/DepartmentDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

export function DepartmentsTab({ departments, canEdit, onRefresh }) {
  const { deleteDepartment } = useHR();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedDept(null);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteDepartment(deletingId);
    toast.success("Department deleted");
    onRefresh();
    setConfirmOpen(false);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {departments.length} department(s)
        </p>
        {canEdit && (
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-3 w-3 mr-1" /> Add Department
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                {canEdit && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept._id}>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{dept.code}</Badge>
                  </TableCell>
                  <TableCell>{dept.description || "-"}</TableCell>
                  {canEdit && (
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(dept)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => {
                          setDeletingId(dept._id);
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

      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={selectedDept}
        onSuccess={onRefresh}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
