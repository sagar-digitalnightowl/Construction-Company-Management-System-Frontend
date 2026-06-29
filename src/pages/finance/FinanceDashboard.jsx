// src/pages/finance/FinanceDashboard.jsx
import React, { useEffect, useMemo } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/PageHeader";
import { useProjectsStore } from "@/store/dataStore";
import { formatINR } from "@/lib/helpers";
import { Home, UserCheck, TrendingDown } from "lucide-react";

export function FinanceDashboard() {
  const { dashboardData, loading, fetchDashboard } = useFinance();
  const projects = useProjectsStore((s) => s.projects);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Compute aggregate stats
  const stats = useMemo(() => {
    let totalFlats = 0,
      bookedFlats = 0,
      totalBookingAmount = 0,
      totalRemaining = 0,
      totalPaid = 0;

    dashboardData.forEach((project) => {
      const flats = project.flats || [];
      totalFlats += flats.length;
      bookedFlats += flats.filter(
        (f) => f.status === "booked" || f.status === "sold",
      ).length;
      flats.forEach((f) => {
        totalBookingAmount += f.bookingAmount || 0;
        totalRemaining += f.remainingAmount || 0;
        totalPaid += f.bookingAmount - (f.remainingAmount || 0); // approx
      });
    });

    return {
      totalFlats,
      bookedFlats,
      totalBookingAmount,
      totalRemaining,
      totalPaid,
    };
  }, [dashboardData]);

  if (loading && dashboardData.length === 0) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Flats"
          value={stats.totalFlats}
          icon={Home}
          accent="info"
        />
        <StatCard
          label="Booked"
          value={stats.bookedFlats}
          icon={UserCheck}
          accent="success"
        />
        <StatCard
          label="Total Received"
          value={formatINR(stats.totalPaid)}
          icon={TrendingDown}
          accent="success"
        />
        <StatCard
          label="Outstanding"
          value={formatINR(stats.totalRemaining)}
          icon={TrendingDown}
          accent="destructive"
        />
      </div>

      <div className="space-y-4">
        {dashboardData.map((project) => (
          <Card key={project.projectId}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {project.projectName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.location}
                  </p>
                </div>
                <Badge variant="outline">
                  {project.flats?.length || 0} flats
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {project.flats?.slice(0, 4).map((flat, idx) => (
                  <div key={idx} className="border rounded-lg p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        Flat {flat.flatNumber}
                      </span>
                      <Badge
                        variant={
                          flat.status === "booked" ? "success" : "secondary"
                        }
                      >
                        {flat.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Tower {flat.tower}, Floor {flat.floor}
                    </p>
                    {flat.buyerName && (
                      <p className="text-xs mt-1">Buyer: {flat.buyerName}</p>
                    )}
                    {flat.remainingAmount > 0 && (
                      <p className="text-xs text-destructive mt-1">
                        Due: {formatINR(flat.remainingAmount)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
