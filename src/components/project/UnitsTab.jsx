// src/components/project/UnitsTab.jsx
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/useProject";

const unitStatusColors = {
  available: "success",
  pending: "warning",
  booked: "default",
  reserved: "warning",
  sold: "secondary",
  cancelled: "destructive",
};

export function UnitsTab({ projectId }) {
  const { unitsData, fetchUnits, loading } = useProject();
  const { units, statistics } = unitsData;

  useEffect(() => {
    if (projectId) {
      fetchUnits(projectId);
    }
  }, [projectId, fetchUnits]);

  if (loading && !units?.length) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!units?.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No units/flats have been added to this project.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Floor-wise Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(statistics.byFloor || {}).map(
                  ([floor, count]) => (
                    <div key={floor} className="flex justify-between text-sm">
                      <span>Floor {floor}</span>
                      <span className="font-medium">{count} units</span>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">BHK-wise Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(statistics.byBHK || {}).map(([bhk, count]) => (
                  <div key={bhk} className="flex justify-between text-sm">
                    <span>{bhk} BHK</span>
                    <span className="font-medium">{count} units</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Status-wise Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(statistics.byStatus || {}).map(
                  ([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className="capitalize">{status}</span>
                      <Badge variant={unitStatusColors[status] || "secondary"}>
                        {count}
                      </Badge>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Units Table */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Inventory</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit #</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Area (sq ft)</TableHead>
                <TableHead>BHK</TableHead>
                <TableHead>Bathrooms</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Facing</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booked By</TableHead>
                <TableHead>Booked On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    {unit.unitNumber}
                  </TableCell>
                  <TableCell>{unit.floor}</TableCell>
                  <TableCell>{unit.area}</TableCell>
                  <TableCell>{unit.bedrooms}</TableCell>
                  <TableCell>{unit.bathrooms}</TableCell>
                  <TableCell>{formatINR(unit.price)}</TableCell>
                  <TableCell>{unit.features?.facing || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {unit.features?.parking && (
                        <Badge variant="outline">Parking</Badge>
                      )}
                      {unit.features?.balcony && (
                        <Badge variant="outline">Balcony</Badge>
                      )}
                      {unit.features?.furnished &&
                        unit.features.furnished !== "unfurnished" && (
                          <Badge variant="outline">
                            {unit.features.furnished}
                          </Badge>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={unitStatusColors[unit.status] || "secondary"}
                    >
                      {unit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {unit.bookedBy?.name || unit.bookedBy || "-"}
                  </TableCell>
                  <TableCell>
                    {unit.bookedAt ? formatDate(unit.bookedAt) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
