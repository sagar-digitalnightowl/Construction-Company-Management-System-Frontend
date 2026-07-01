// // src/pages/finance/FinanceDashboard.jsx
// import React, { useEffect, useMemo } from "react";
// import { useFinance } from "@/hooks/useFinance";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { StatCard } from "@/components/common/PageHeader";
// import { useProjectsStore } from "@/store/dataStore";
// import { formatINR } from "@/lib/helpers";
// import { Home, UserCheck, TrendingDown } from "lucide-react";

// export function FinanceDashboard() {
//   const { dashboardData, loading, fetchDashboard } = useFinance();
//   const projects = useProjectsStore((s) => s.projects);

//   useEffect(() => {
//     fetchDashboard();
//   }, [fetchDashboard]);

//   // Compute aggregate stats
//   const stats = useMemo(() => {
//     let totalFlats = 0,
//       bookedFlats = 0,
//       totalBookingAmount = 0,
//       totalRemaining = 0,
//       totalPaid = 0;

//     dashboardData.forEach((project) => {
//       const flats = project.flats || [];
//       totalFlats += flats.length;
//       bookedFlats += flats.filter(
//         (f) => f.status === "booked" || f.status === "sold",
//       ).length;
//       flats.forEach((f) => {
//         totalBookingAmount += f.bookingAmount || 0;
//         totalRemaining += f.remainingAmount || 0;
//         totalPaid += f.bookingAmount - (f.remainingAmount || 0); // approx
//       });
//     });

//     return {
//       totalFlats,
//       bookedFlats,
//       totalBookingAmount,
//       totalRemaining,
//       totalPaid,
//     };
//   }, [dashboardData]);

//   if (loading && dashboardData.length === 0) {
//     return (
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[...Array(4)].map((_, i) => (
//           <Skeleton key={i} className="h-24" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           label="Total Flats"
//           value={stats.totalFlats}
//           icon={Home}
//           accent="info"
//         />
//         <StatCard
//           label="Booked"
//           value={stats.bookedFlats}
//           icon={UserCheck}
//           accent="success"
//         />
//         <StatCard
//           label="Total Received"
//           value={formatINR(stats.totalPaid)}
//           icon={TrendingDown}
//           accent="success"
//         />
//         <StatCard
//           label="Outstanding"
//           value={formatINR(stats.totalRemaining)}
//           icon={TrendingDown}
//           accent="destructive"
//         />
//       </div>

//       <div className="space-y-4">
//         {dashboardData.map((project) => (
//           <Card key={project.projectId}>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div>
//                   <h3 className="font-semibold text-lg">
//                     {project.projectName}
//                   </h3>
//                   <p className="text-sm text-muted-foreground">
//                     {project.location}
//                   </p>
//                 </div>
//                 <Badge variant="outline">
//                   {project.flats?.length || 0} flats
//                 </Badge>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {project.flats?.map((flat, idx) => (
//                   <div key={idx} className="border rounded-lg p-3 text-sm">
//                     <div className="flex justify-between">
//                       <span className="font-medium">
//                         Flat {flat.flatNumber}
//                       </span>
//                       <Badge
//                         variant={
//                           flat.status === "booked" ? "success" : "secondary"
//                         }
//                       >
//                         {flat.status}
//                       </Badge>
//                     </div>
//                     <p className="text-muted-foreground">
//                       Tower {flat.tower}, Floor {flat.floor}
//                     </p>
//                     {flat.buyerName && (
//                       <p className="text-xs mt-1">Buyer: {flat.buyerName}</p>
//                     )}
//                     {flat.remainingAmount > 0 && (
//                       <p className="text-xs text-destructive mt-1">
//                         Due: {formatINR(flat.remainingAmount)}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

// src/pages/finance/FinanceDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
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

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTower, setSelectedTower] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Reset tower/floor when project changes
  useEffect(() => {
    setSelectedTower("");
    setSelectedFloor("");
  }, [selectedProjectId]);

  // Reset floor when tower changes
  useEffect(() => {
    setSelectedFloor("");
  }, [selectedTower]);

  // Compute aggregate stats (overall, not filtered)
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
        totalPaid += f.bookingAmount - (f.remainingAmount || 0);
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

  // Derived options for filters
  const projectOptions = useMemo(() => {
    return dashboardData.map((p) => ({
      value: p.projectId,
      label: p.projectName,
    }));
  }, [dashboardData]);

  const selectedProject = useMemo(() => {
    return dashboardData.find((p) => p.projectId === selectedProjectId);
  }, [dashboardData, selectedProjectId]);

  const towerOptions = useMemo(() => {
    if (!selectedProject) return [];
    const towers = new Set(selectedProject.flats.map((f) => f.tower));
    return Array.from(towers).map((t) => ({ value: t, label: t }));
  }, [selectedProject]);

  const floorOptions = useMemo(() => {
    if (!selectedProject || !selectedTower) return [];
    const floors = new Set(
      selectedProject.flats
        .filter((f) => f.tower === selectedTower)
        .map((f) => f.floor),
    );
    return Array.from(floors).map((f) => ({ value: f, label: f }));
  }, [selectedProject, selectedTower]);

  const filteredFlats = useMemo(() => {
    if (!selectedProject) return [];
    let flats = selectedProject.flats;
    if (selectedTower) flats = flats.filter((f) => f.tower === selectedTower);
    if (selectedFloor) flats = flats.filter((f) => f.floor === selectedFloor);
    return flats;
  }, [selectedProject, selectedTower, selectedFloor]);

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
      {/* Stats Cards */}
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

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Project</label>
          <select
            className="border rounded px-2 py-1 text-sm bg-background"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select Project</option>
            {projectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Tower</label>
          <select
            className="border rounded px-2 py-1 text-sm bg-background"
            value={selectedTower}
            onChange={(e) => setSelectedTower(e.target.value)}
            disabled={!selectedProject}
          >
            <option value="">All Towers</option>
            {towerOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Floor</label>
          <select
            className="border rounded px-2 py-1 text-sm bg-background"
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            disabled={!selectedTower}
          >
            <option value="">All Floors</option>
            {floorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <span className="text-sm text-muted-foreground ml-auto">
            Showing {filteredFlats.length} flats
            {selectedTower && ` in tower ${selectedTower}`}
            {selectedFloor && ` on floor ${selectedFloor}`}
          </span>
        )}
      </div>

      {/* Flats List */}
      {selectedProject ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedProject.projectName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedProject.location}
                  </p>
                </div>
                <Badge variant="outline">{filteredFlats.length} flats</Badge>
              </div>

              {filteredFlats.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No flats match the selected filters.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {filteredFlats.map((flat, idx) => (
                    <div key={idx} className="border rounded-lg p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          Flat {flat.flatNumber}
                        </span>
                        <Badge
                          variant={
                            flat.status === "booked" || flat.status === "sold"
                              ? "success"
                              : "secondary"
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
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          Select a project to view flats.
        </div>
      )}
    </div>
  );
}
