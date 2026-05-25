// src/components/inventory/MaterialTable.jsx
import React from "react";
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
import { Pencil, Trash2 } from "lucide-react";
import { formatINR } from "@/lib/helpers";
import { useNavigate } from "react-router-dom";

export function MaterialTable({ materials, onEdit, onDelete, canEdit }) {

    const navigate = useNavigate();

  return (
    <div className="rounded-lg border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name / Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Max Stock</TableHead>
            {canEdit && <TableHead className="w-20">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.materials?.map((mat) => (
            <TableRow key={mat._id} onClick={() => navigate(`/inventory/material/${mat._id}`)}>
              <TableCell>
                <div>
                  <p className="font-medium">{mat.name}</p>
                  <p className="text-xs text-muted-foreground">{mat.code}</p>
                </div>
              </TableCell>
              <TableCell className="capitalize">{mat.type}</TableCell>
              <TableCell>{mat.unit}</TableCell>
              <TableCell>{formatINR(mat.unitPrice)}</TableCell>
              <TableCell>{mat.minStockLevel}</TableCell>
              <TableCell>{mat.maxStockLevel}</TableCell>
              {canEdit && (
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {e.stopPropagation(); onEdit(mat)}}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={(e) => {e.stopPropagation(); onDelete(mat._id)}}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
