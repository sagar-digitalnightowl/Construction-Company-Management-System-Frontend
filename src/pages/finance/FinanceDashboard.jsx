// // // src/pages/finance/FinanceDashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useFinance } from "@/hooks/useFinance";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { StatCard } from "@/components/common/PageHeader";
// import { useProjectsStore } from "@/store/dataStore";
// import { formatINR } from "@/lib/helpers";
// import { Home, UserCheck, TrendingDown } from "lucide-react";

// export function FinanceDashboard() {
//   // Extract pagination here as well
//   const { dashboardData, loading, fetchDashboard, pagination } = useFinance();
//   const projects = useProjectsStore((s) => s.projects);

//   const [selectedProjectId, setSelectedProjectId] = useState("");
//   const [selectedTower, setSelectedTower] = useState("");
//   const [selectedFloor, setSelectedFloor] = useState("");

//   // Naya State: Pagination ke liye
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   // Jab bhi page change ho, naya data fetch karein
//   useEffect(() => {
//     fetchDashboard({ page, limit });
//   }, [fetchDashboard, page]);

//   // Reset tower/floor when project changes
//   useEffect(() => {
//     setSelectedTower("");
//     setSelectedFloor("");
//   }, [selectedProjectId]);

//   // Reset floor when tower changes
//   useEffect(() => {
//     setSelectedFloor("");
//   }, [selectedTower]);

//   // Compute aggregate stats (overall, not filtered)
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
//         totalPaid += f.bookingAmount - (f.remainingAmount || 0);
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

//   // Derived options for filters
//   const projectOptions = useMemo(() => {
//     return dashboardData.map((p) => ({
//       value: p.projectId,
//       label: p.projectName,
//     }));
//   }, [dashboardData]);

//   const selectedProject = useMemo(() => {
//     return dashboardData.find((p) => p.projectId === selectedProjectId);
//   }, [dashboardData, selectedProjectId]);

//   const towerOptions = useMemo(() => {
//     if (!selectedProject) return [];
//     const towers = new Set(selectedProject.flats.map((f) => f.tower));
//     return Array.from(towers).map((t) => ({ value: t, label: t }));
//   }, [selectedProject]);

//   const floorOptions = useMemo(() => {
//     if (!selectedProject || !selectedTower) return [];
//     const floors = new Set(
//       selectedProject.flats
//         .filter((f) => f.tower === selectedTower)
//         .map((f) => f.floor),
//     );
//     return Array.from(floors).map((f) => ({ value: f, label: f }));
//   }, [selectedProject, selectedTower]);

//   const filteredFlats = useMemo(() => {
//     if (!selectedProject) return [];
//     let flats = selectedProject.flats;
//     if (selectedTower) flats = flats.filter((f) => f.tower === selectedTower);
//     if (selectedFloor) flats = flats.filter((f) => f.floor === selectedFloor);
//     return flats;
//   }, [selectedProject, selectedTower, selectedFloor]);

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
//       {/* Stats Cards */}
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

//       {/* Filter Section */}
//       <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
//         <div className="flex items-center gap-2">
//           <label className="text-sm font-medium">Project</label>
//           <select
//             className="border rounded px-2 py-1 text-sm bg-background"
//             value={selectedProjectId}
//             onChange={(e) => setSelectedProjectId(e.target.value)}
//           >
//             <option value="">Select Project</option>
//             {projectOptions.map((opt) => (
//               <option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-sm font-medium">Tower</label>
//           <select
//             className="border rounded px-2 py-1 text-sm bg-background"
//             value={selectedTower}
//             onChange={(e) => setSelectedTower(e.target.value)}
//             disabled={!selectedProject}
//           >
//             <option value="">All Towers</option>
//             {towerOptions.map((opt) => (
//               <option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-sm font-medium">Floor</label>
//           <select
//             className="border rounded px-2 py-1 text-sm bg-background"
//             value={selectedFloor}
//             onChange={(e) => setSelectedFloor(e.target.value)}
//             disabled={!selectedTower}
//           >
//             <option value="">All Floors</option>
//             {floorOptions.map((opt) => (
//               <option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         {selectedProject && (
//           <span className="text-sm text-muted-foreground ml-auto">
//             Showing {filteredFlats.length} flats
//             {selectedTower && ` in tower ${selectedTower}`}
//             {selectedFloor && ` on floor ${selectedFloor}`}
//           </span>
//         )}
//       </div>

//       {/* Flats List */}
//       {selectedProject ? (
//         <div className="space-y-4">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div>
//                   <h3 className="font-semibold text-lg">
//                     {selectedProject.projectName}
//                   </h3>
//                   <p className="text-sm text-muted-foreground">
//                     {selectedProject.location}
//                   </p>
//                 </div>
//                 <Badge variant="outline">{filteredFlats.length} flats</Badge>
//               </div>

//               {filteredFlats.length === 0 ? (
//                 <p className="text-muted-foreground text-sm">
//                   No flats match the selected filters.
//                 </p>
//               ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                   {filteredFlats.map((flat, idx) => (
//                     <div key={idx} className="border rounded-lg p-3 text-sm">
//                       <div className="flex justify-between">
//                         <span className="font-medium">
//                           Flat {flat.flatNumber}
//                         </span>
//                         <Badge
//                           variant={
//                             flat.status === "booked" || flat.status === "sold"
//                               ? "success"
//                               : "secondary"
//                           }
//                         >
//                           {flat.status}
//                         </Badge>
//                       </div>
//                       <p className="text-muted-foreground">
//                         Tower {flat.tower}, Floor {flat.floor}
//                       </p>
//                       {flat.buyerName && (
//                         <p className="text-xs mt-1">Buyer: {flat.buyerName}</p>
//                       )}
//                       {flat.remainingAmount > 0 && (
//                         <p className="text-xs text-destructive mt-1">
//                           Due: {formatINR(flat.remainingAmount)}   
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       ) : (
//         <div className="text-center text-muted-foreground py-8 border rounded-lg bg-card/50">
//           Select a project to view flats.
//         </div>
//       )}

//       {/* Pagination Controls */}
//       {dashboardData.length > 0 && pagination?.pages > 1 && (
//         <div className="flex items-center justify-end gap-4 p-4 mt-4">
//           <span className="text-sm text-muted-foreground">
//             Showing {dashboardData.length} of {pagination.total} projects
//           </span>
//           <div className="flex gap-2">
//             <button
//               className="px-3 py-1 text-sm border rounded bg-background disabled:opacity-50 hover:bg-muted"
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//             >
//               Previous
//             </button>
//             <span className="text-sm py-1 font-medium">
//               Page {pagination.page} of {pagination.pages}
//             </span>
//             <button
//               className="px-3 py-1 text-sm border rounded bg-background disabled:opacity-50 hover:bg-muted"
//               disabled={page >= pagination.pages}
//               onClick={() => setPage((p) => p + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// // src/pages/finance/FinanceDashboard.jsx
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { useFinance } from "@/hooks/useFinance";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { StatCard } from "@/components/common/PageHeader";
// import { formatINR } from "@/lib/helpers";
// import {
//   Home,
//   UserCheck,
//   TrendingDown,
//   TrendingUp,
//   ChevronLeft,
//   Building2,
//   Layers,
//   DoorOpen,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
 
// export function FinanceDashboard() {
//   const { dashboardData, loading, fetchDashboard } = useFinance();
 
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedTower, setSelectedTower] = useState("");
//   const [selectedFloor, setSelectedFloor] = useState("");
//   const [currentView, setCurrentView] = useState("projects"); // 'projects' | 'towers' | 'floors' | 'flats'
//   const [page, setPage] = useState(1);
 
//   // Fetch data when page changes
//   useEffect(() => {
//     fetchDashboard({ page });
//   }, [page, fetchDashboard]);
 
//   // Reset view when page changes (go back to projects list)
//   useEffect(() => {
//     setCurrentView("projects");
//     setSelectedProject(null);
//     setSelectedTower("");
//     setSelectedFloor("");
//   }, [page]);
 
//   // Extract data and pagination from the new response shape
//   const projects = useMemo(() => {
//     if (!dashboardData) return [];
//     // support both old array and new object shape
//     if (Array.isArray(dashboardData)) return dashboardData;
//     return dashboardData.data || [];
//   }, [dashboardData]);
 
//   const pagination = useMemo(() => {
//     if (!dashboardData || Array.isArray(dashboardData)) return null;
//     return dashboardData.pagination || null;
//   }, [dashboardData]);
 
//   // Aggregate stats based on currently loaded projects (from current page)
//   const stats = useMemo(() => {
//     let totalFlats = 0,
//       bookedFlats = 0,
//       totalRemaining = 0,
//       totalPaid = 0;
 
//     projects.forEach((project) => {
//       const flats = project.flats || [];
//       totalFlats += flats.length;
//       flats.forEach((f) => {
//         if (["booked", "sold", "pending"].includes(f.status?.toLowerCase())) {
//           bookedFlats += 1;
//         }
//         totalPaid += f.totalPaid || 0;
//         totalRemaining += f.remainingAmount || 0;
//       });
//     });
 
//     return { totalFlats, bookedFlats, totalRemaining, totalPaid };
//   }, [projects]);
 
//   // Navigation helpers
//   const goToProjects = useCallback(() => {
//     setCurrentView("projects");
//     setSelectedProject(null);
//     setSelectedTower("");
//     setSelectedFloor("");
//   }, []);
 
//   const goToTowers = useCallback((project) => {
//     setSelectedProject(project);
//     setSelectedTower("");
//     setSelectedFloor("");
//     setCurrentView("towers");
//   }, []);
 
//   const goToFloors = useCallback((tower) => {
//     setSelectedTower(tower);
//     setSelectedFloor("");
//     setCurrentView("floors");
//   }, []);
 
//   const goToFlats = useCallback((floor) => {
//     setSelectedFloor(floor);
//     setCurrentView("flats");
//   }, []);
 
//   // Compute unique towers / floors for selected project
//   const towers = useMemo(() => {
//     if (!selectedProject) return [];
//     const towerSet = new Set(selectedProject.flats.map((f) => f.tower));
//     return Array.from(towerSet);
//   }, [selectedProject]);
 
//   const floors = useMemo(() => {
//     if (!selectedProject || !selectedTower) return [];
//     const floorSet = new Set(
//       selectedProject.flats
//         .filter((f) => f.tower === selectedTower)
//         .map((f) => f.floor)
//     );
//     return Array.from(floorSet);
//   }, [selectedProject, selectedTower]);
 
//   const filteredFlats = useMemo(() => {
//     if (!selectedProject || !selectedTower || !selectedFloor) return [];
//     return selectedProject.flats.filter(
//       (f) => f.tower === selectedTower && f.floor === selectedFloor
//     );
//   }, [selectedProject, selectedTower, selectedFloor]);
 
//   const getStatusBadge = (status) => {
//     const s = status?.toLowerCase();
//     if (s === "booked" || s === "sold") return "success";
//     if (s === "pending") return "warning";
//     return "secondary";
//   };
 
//   // Pagination controls
//   const handlePageChange = (newPage) => {
//     if (pagination && newPage >= 1 && newPage <= pagination.pages) {
//       setPage(newPage);
//     }
//   };
 
//   if (loading && projects.length === 0) {
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
//       {/* Stats Cards – always visible */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           label="Total Flats"
//           value={stats.totalFlats}
//           icon={Home}
//           accent="info"
//         />
//         <StatCard
//           label="Booked / Pending"
//           value={stats.bookedFlats}
//           icon={UserCheck}
//           accent="success"
//         />
//         <StatCard
//           label="Total Received"
//           value={formatINR(stats.totalPaid)}
//           icon={TrendingUp}
//           accent="success"
//         />
//         <StatCard
//           label="Outstanding"
//           value={formatINR(stats.totalRemaining)}
//           icon={TrendingDown}
//           accent="destructive"
//         />
//       </div>
 
//       {/* Dynamic View */}
//       {currentView === "projects" && (
//         <>
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">Projects</h2>
//             <span className="text-sm text-muted-foreground">
//               {pagination ? `Page ${page} of ${pagination.pages}` : ""}
//             </span>
//           </div>
//           {projects.length === 0 ? (
//             <div className="text-center text-muted-foreground py-10 bg-muted/20 rounded-lg border border-dashed">
//               No projects available.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {projects.map((project) => (
//                 <Card
//                   key={project.projectId}
//                   className="cursor-pointer hover:shadow-md transition-shadow"
//                   onClick={() => goToTowers(project)}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h3 className="font-semibold text-base">
//                           {project.projectName}
//                         </h3>
//                         <p className="text-sm text-muted-foreground">
//                           {project.location}
//                         </p>
//                       </div>
//                       <Building2 className="h-5 w-5 text-muted-foreground" />
//                     </div>
//                     <div className="mt-3 flex items-center gap-2 text-sm">
//                       <Badge variant="outline">
//                         {project.flats?.length || 0} Flats
//                       </Badge>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
 
//           {/* Pagination */}
//           {pagination && pagination.pages > 1 && (
//             <div className="flex items-center justify-center gap-2 mt-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={page <= 1}
//                 onClick={() => handlePageChange(page - 1)}
//               >
//                 Previous
//               </Button>
//               <span className="text-sm font-medium">
//                 Page {page} of {pagination.pages}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={page >= pagination.pages}
//                 onClick={() => handlePageChange(page + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </>
//       )}
 
//       {currentView === "towers" && selectedProject && (
//         <>
//           <div className="flex items-center gap-3 mb-4">
//             <Button variant="ghost" size="icon" onClick={goToProjects}>
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h2 className="text-lg font-semibold">
//                 {selectedProject.projectName}
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {selectedProject.location}
//               </p>
//             </div>
//           </div>
//           <h3 className="text-sm font-medium mb-3">Select a Tower</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//             {towers.map((tower) => (
//               <Card
//                 key={tower}
//                 className="cursor-pointer hover:bg-muted/40 transition-colors"
//                 onClick={() => goToFloors(tower)}
//               >
//                 <CardContent className="p-4 flex items-center gap-3">
//                   <Building2 className="h-5 w-5 text-muted-foreground" />
//                   <span className="font-medium">{tower}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </>
//       )}
 
//       {currentView === "floors" && selectedProject && selectedTower && (
//         <>
//           <div className="flex items-center gap-3 mb-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => {
//                 setCurrentView("towers");
//                 setSelectedFloor("");
//               }}
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h2 className="text-lg font-semibold">
//                 {selectedProject.projectName} — {selectedTower}
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {selectedProject.location}
//               </p>
//             </div>
//           </div>
//           <h3 className="text-sm font-medium mb-3">Select a Floor</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//             {floors.map((floor) => (
//               <Card
//                 key={floor}
//                 className="cursor-pointer hover:bg-muted/40 transition-colors"
//                 onClick={() => goToFlats(floor)}
//               >
//                 <CardContent className="p-4 flex items-center gap-3">
//                   <Layers className="h-5 w-5 text-muted-foreground" />
//                   <span className="font-medium">{floor}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </>
//       )}
 
//       {currentView === "flats" && selectedProject && selectedTower && selectedFloor && (
//         <>
//           <div className="flex items-center gap-3 mb-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => {
//                 setCurrentView("floors");
//                 setSelectedFloor("");
//               }}
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h2 className="text-lg font-semibold">
//                 {selectedProject.projectName} — {selectedTower} — Floor{" "}
//                 {selectedFloor}
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {selectedProject.location}
//               </p>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
//             {filteredFlats.map((flat) => {
//               const uniqueKey = `${selectedProject.projectId}-${flat.tower}-${flat.floor}-${flat.flatNumber}`;
//               return (
//                 <div
//                   key={uniqueKey}
//                   className="border rounded-lg p-3 text-sm shadow-sm"
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <span className="font-semibold text-base">
//                       {flat.flatNumber}
//                     </span>
//                     <Badge
//                       variant={getStatusBadge(flat.status)}
//                       className="capitalize text-[10px]"
//                     >
//                       {flat.status}
//                     </Badge>
//                   </div>
//                   <p className="text-muted-foreground text-xs font-medium">
//                     {flat.tower} • Floor {flat.floor}
//                   </p>
//                   {flat.buyerName && (
//                     <p
//                       className="text-xs mt-2 font-medium truncate"
//                       title={flat.buyerName}
//                     >
//                       👤 {flat.buyerName}
//                     </p>
//                   )}
//                   <div className="mt-2 space-y-1">
//                     {flat.totalPaid > 0 && (
//                       <p className="text-[11px] text-success font-medium">
//                         Paid: {formatINR(flat.totalPaid)}
//                       </p>
//                     )}
//                     {flat.remainingAmount > 0 && (
//                       <p className="text-[11px] text-destructive font-medium">
//                         Due: {formatINR(flat.remainingAmount)}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }












// // src/pages/finance/FinanceDashboard.jsx
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { useFinance } from "@/hooks/useFinance";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { StatCard } from "@/components/common/PageHeader";
// import { formatINR } from "@/lib/helpers";
// import {
//   Home,
//   UserCheck,
//   TrendingDown,
//   TrendingUp,
//   ChevronLeft,
//   Building2,
//   Layers,
//   DoorOpen,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// // Helper function to handle cancelled/rejected status as available
// const getEffectiveFlatStatus = (flat) => {
//   const status = flat.status?.toLowerCase();
//   if (status === "cancelled" || status === "rejected" || flat.approvalStatus === "rejected") {
//     return "available";
//   }
//   return status || "available";
// };
 
// export function FinanceDashboard() {
//   const { dashboardData, loading, fetchDashboard } = useFinance();
 
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedTower, setSelectedTower] = useState("");
//   const [selectedFloor, setSelectedFloor] = useState("");
//   const [currentView, setCurrentView] = useState("projects"); // 'projects' | 'towers' | 'floors' | 'flats'
//   const [page, setPage] = useState(1);
 
//   // Fetch data when page changes
//   useEffect(() => {
//     fetchDashboard({ page });
//   }, [page, fetchDashboard]);
 
//   // Reset view when page changes (go back to projects list)
//   useEffect(() => {
//     setCurrentView("projects");
//     setSelectedProject(null);
//     setSelectedTower("");
//     setSelectedFloor("");
//   }, [page]);
 
//   // Extract data and pagination from the new response shape
//   const projects = useMemo(() => {
//     if (!dashboardData) return [];
//     if (Array.isArray(dashboardData)) return dashboardData;
//     return dashboardData.data || [];
//   }, [dashboardData]);
 
//   const pagination = useMemo(() => {
//     if (!dashboardData || Array.isArray(dashboardData)) return null;
//     return dashboardData.pagination || null;
//   }, [dashboardData]);
 
//   // Aggregate stats based on currently loaded projects (from current page)
//   const stats = useMemo(() => {
//     let totalFlats = 0,
//       bookedFlats = 0,
//       totalRemaining = 0,
//       totalPaid = 0;
 
//     projects.forEach((project) => {
//       const flats = project.flats || [];
//       totalFlats += flats.length;
//       flats.forEach((f) => {
//         const effectiveStatus = getEffectiveFlatStatus(f);
//         if (["booked", "sold", "pending"].includes(effectiveStatus)) {
//           bookedFlats += 1;
//         }
//         totalPaid += f.totalPaid || 0;
//         totalRemaining += f.remainingAmount || 0;
//       });
//     });
 
//     return { totalFlats, bookedFlats, totalRemaining, totalPaid };
//   }, [projects]);
 
//   // Navigation helpers
//   const goToProjects = useCallback(() => {
//     setCurrentView("projects");
//     setSelectedProject(null);
//     setSelectedTower("");
//     setSelectedFloor("");
//   }, []);
 
//   const goToTowers = useCallback((project) => {
//     setSelectedProject(project);
//     setSelectedTower("");
//     setSelectedFloor("");
//     setCurrentView("towers");
//   }, []);
 
//   const goToFloors = useCallback((tower) => {
//     setSelectedTower(tower);
//     setSelectedFloor("");
//     setCurrentView("floors");
//   }, []);
 
//   const goToFlats = useCallback((floor) => {
//     setSelectedFloor(floor);
//     setCurrentView("flats");
//   }, []);
 
//   // Compute unique towers / floors for selected project
//   const towers = useMemo(() => {
//     if (!selectedProject) return [];
//     const towerSet = new Set(selectedProject.flats.map((f) => f.tower));
//     return Array.from(towerSet);
//   }, [selectedProject]);
 
//   const floors = useMemo(() => {
//     if (!selectedProject || !selectedTower) return [];
//     const floorSet = new Set(
//       selectedProject.flats
//         .filter((f) => f.tower === selectedTower)
//         .map((f) => f.floor)
//     );
//     return Array.from(floorSet);
//   }, [selectedProject, selectedTower]);
 
//   const filteredFlats = useMemo(() => {
//     if (!selectedProject || !selectedTower || !selectedFloor) return [];
//     return selectedProject.flats.filter(
//       (f) => f.tower === selectedTower && f.floor === selectedFloor
//     );
//   }, [selectedProject, selectedTower, selectedFloor]);
 
//   const getStatusBadge = (status) => {
//     const s = status?.toLowerCase();
//     if (s === "booked" || s === "sold") return "success";
//     if (s === "pending") return "warning";
//     return "secondary";
//   };
 
//   // Pagination controls
//   const handlePageChange = (newPage) => {
//     if (pagination && newPage >= 1 && newPage <= pagination.pages) {
//       setPage(newPage);
//     }
//   };
 
//   if (loading && projects.length === 0) {
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
//       {/* Stats Cards – always visible */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           label="Total Flats"
//           value={stats.totalFlats}
//           icon={Home}
//           accent="info"
//         />
//         <StatCard
//           label="Booked / Pending"
//           value={stats.bookedFlats}
//           icon={UserCheck}
//           accent="success"
//         />
//         <StatCard
//           label="Total Received"
//           value={formatINR(stats.totalPaid)}
//           icon={TrendingUp}
//           accent="success"
//         />
//         <StatCard
//           label="Outstanding"
//           value={formatINR(stats.totalRemaining)}
//           icon={TrendingDown}
//           accent="destructive"
//         />
//       </div>
 
//       {/* Dynamic View */}
//       {currentView === "projects" && (
//         <>
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">Projects</h2>
//             <span className="text-sm text-muted-foreground">
//               {pagination ? `Page ${page} of ${pagination.pages}` : ""}
//             </span>
//           </div>
//           {projects.length === 0 ? (
//             <div className="text-center text-muted-foreground py-10 bg-muted/20 rounded-lg border border-dashed">
//               No projects available.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {projects.map((project) => (
//                 <Card
//                   key={project.projectId}
//                   className="cursor-pointer hover:shadow-md transition-shadow"
//                   onClick={() => goToTowers(project)}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h3 className="font-semibold text-base">
//                           {project.projectName}
//                         </h3>
//                         <p className="text-sm text-muted-foreground">
//                           {project.location}
//                         </p>
//                       </div>
//                       <Building2 className="h-5 w-5 text-muted-foreground" />
//                     </div>
//                     <div className="mt-3 flex items-center gap-2 text-sm">
//                       <Badge variant="outline">
//                         {project.flats?.length || 0} Flats
//                       </Badge>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
 
//           {/* Pagination */}
//           {pagination && pagination.pages > 1 && (
//             <div className="flex items-center justify-center gap-2 mt-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={page <= 1}
//                 onClick={() => handlePageChange(page - 1)}
//               >
//                 Previous
//               </Button>
//               <span className="text-sm font-medium">
//                 Page {page} of {pagination.pages}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={page >= pagination.pages}
//                 onClick={() => handlePageChange(page + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </>
//       )}
 
//       {currentView === "towers" && selectedProject && (
//         <>
//           <div className="flex items-center gap-3 mb-4">
//             <Button variant="ghost" size="icon" onClick={goToProjects}>
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h2 className="text-lg font-semibold">
//                 {selectedProject.projectName}
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {selectedProject.location}
//               </p>
//             </div>
//           </div>
//           <h3 className="text-sm font-medium mb-3">Select a Tower</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//             {towers.map((tower) => (
//               <Card
//                 key={tower}
//                 className="cursor-pointer hover:bg-muted/40 transition-colors"
//                 onClick={() => goToFloors(tower)}
//               >
//                 <CardContent className="p-4 flex items-center gap-3">
//                   <Building2 className="h-5 w-5 text-muted-foreground" />
//                   <span className="font-medium">{tower}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </>
//       )}
 
//       {currentView === "floors" && selectedProject && selectedTower && (
//         <>
//           <div className="flex items-center gap-3 mb-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => {
//                 setCurrentView("towers");
//                 setSelectedFloor("");
//               }}
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h2 className="text-lg font-semibold">
//                 {selectedProject.projectName} — {selectedTower}
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {selectedProject.location}
//               </p>
//             </div>
//           </div>
//           <h3 className="text-sm font-medium mb-3">Select a Floor</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//             {floors.map((floor) => (
//               <Card
//                 key={floor}
//                 className="cursor-pointer hover:bg-muted/40 transition-colors"
//                 onClick={() => goToFlats(floor)}
//               >
//                 <CardContent className="p-4 flex items-center gap-3">
//                   <Layers className="h-5 w-5 text-muted-foreground" />
//                   <span className="font-medium">{floor}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </>
//       )}
 
//       {currentView === "flats" && selectedProject && selectedTower && selectedFloor && (
//         <>
//           <div className="flex items-center gap-3 mb-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => {
//                 setCurrentView("floors");
//                 setSelectedFloor("");
//               }}
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h2 className="text-lg font-semibold">
//                 {selectedProject.projectName} — {selectedTower} — Floor{" "}
//                 {selectedFloor}
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {selectedProject.location}
//               </p>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
//             {filteredFlats.map((flat) => {
//               const uniqueKey = `${selectedProject.projectId}-${flat.tower}-${flat.floor}-${flat.flatNumber}`;
//               const effectiveStatus = getEffectiveFlatStatus(flat);
//               const isBooked = effectiveStatus === "booked" || effectiveStatus === "sold";

//               return (
//                 <div
//                   key={uniqueKey}
//                   className={`border rounded-lg p-3 text-sm transition-all shadow-sm ${
//                     isBooked 
//                       ? "bg-primary/10 border-primary dark:bg-primary/20" 
//                       : "bg-background hover:border-primary"
//                   }`}
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <span className="font-semibold text-base">
//                       {flat.flatNumber}
//                     </span>
//                     <Badge
//                       variant={getStatusBadge(effectiveStatus)}
//                       className="capitalize text-[10px]"
//                     >
//                       {effectiveStatus}
//                     </Badge>
//                   </div>
//                   <p className="text-muted-foreground text-xs font-medium">
//                     {flat.tower} • Floor {flat.floor}
//                   </p>
//                   {flat.buyerName && (
//                     <p
//                       className="text-xs mt-2 font-medium truncate"
//                       title={flat.buyerName}
//                     >
//                       👤 {flat.buyerName}
//                     </p>
//                   )}
//                   <div className="mt-2 space-y-1">
//                     {flat.totalPaid > 0 && (
//                       <p className="text-[11px] text-success font-medium">
//                         Paid: {formatINR(flat.totalPaid)}
//                       </p>
//                     )}
//                     {flat.remainingAmount > 0 && (
//                       <p className="text-[11px] text-destructive font-medium">
//                         Due: {formatINR(flat.remainingAmount)}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }













// src/pages/finance/FinanceDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/PageHeader";
import { formatINR } from "@/lib/helpers";
import {
  Home,
  UserCheck,
  TrendingDown,
  TrendingUp,
  ChevronLeft,
  Building2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper: returns effective status and display label
const getEffectiveFlatStatus = (flat) => {
  const status = flat.status?.toLowerCase();
  const approval = flat.approvalStatus?.toLowerCase();

  // Cancelled, rejected, or pending approval → available
  if (status === "cancelled" || approval === "rejected" || approval === "pending") {
    return "available";
  }
  // Booked / sold → sold
  if (status === "booked" || status === "sold") {
    return "sold";
  }
  // Fallback
  return "available";
};

// Get display label and badge variant
const getFlatDisplay = (flat) => {
  const eff = getEffectiveFlatStatus(flat);
  return {
    status: eff,
    label: eff === "sold" ? "Sold" : "Available",
    variant: eff === "sold" ? "success" : "secondary",
  };
};

export function FinanceDashboard() {
  const { dashboardData, loading, fetchDashboard } = useFinance();

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTower, setSelectedTower] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [currentView, setCurrentView] = useState("projects");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchDashboard({ page });
  }, [page, fetchDashboard]);

  useEffect(() => {
    setCurrentView("projects");
    setSelectedProject(null);
    setSelectedTower("");
    setSelectedFloor("");
  }, [page]);

  const projects = useMemo(() => {
    if (!dashboardData) return [];
    if (Array.isArray(dashboardData)) return dashboardData;
    return dashboardData.data || [];
  }, [dashboardData]);

  const pagination = useMemo(() => {
    if (!dashboardData || Array.isArray(dashboardData)) return null;
    return dashboardData.pagination || null;
  }, [dashboardData]);

  // Stats – only count "sold" as booked, and sum paid/remaining for sold only
  const stats = useMemo(() => {
    let totalFlats = 0,
      bookedFlats = 0,
      totalRemaining = 0,
      totalPaid = 0;

    projects.forEach((project) => {
      const flats = project.flats || [];
      totalFlats += flats.length;
      flats.forEach((f) => {
        const eff = getEffectiveFlatStatus(f);
        if (eff === "sold") {
          bookedFlats += 1;
          totalPaid += f.totalPaid || 0;
          totalRemaining += f.remainingAmount || 0;
        }
      });
    });

    return { totalFlats, bookedFlats, totalRemaining, totalPaid };
  }, [projects]);

  // Navigation helpers
  const goToProjects = useCallback(() => {
    setCurrentView("projects");
    setSelectedProject(null);
    setSelectedTower("");
    setSelectedFloor("");
  }, []);

  const goToTowers = useCallback((project) => {
    setSelectedProject(project);
    setSelectedTower("");
    setSelectedFloor("");
    setCurrentView("towers");
  }, []);

  const goToFloors = useCallback((tower) => {
    setSelectedTower(tower);
    setSelectedFloor("");
    setCurrentView("floors");
  }, []);

  const goToFlats = useCallback((floor) => {
    setSelectedFloor(floor);
    setCurrentView("flats");
  }, []);

  const towers = useMemo(() => {
    if (!selectedProject) return [];
    const towerSet = new Set(selectedProject.flats.map((f) => f.tower));
    return Array.from(towerSet);
  }, [selectedProject]);

  const floors = useMemo(() => {
    if (!selectedProject || !selectedTower) return [];
    const floorSet = new Set(
      selectedProject.flats
        .filter((f) => f.tower === selectedTower)
        .map((f) => f.floor)
    );
    return Array.from(floorSet);
  }, [selectedProject, selectedTower]);

  const filteredFlats = useMemo(() => {
    if (!selectedProject || !selectedTower || !selectedFloor) return [];
    return selectedProject.flats.filter(
      (f) => f.tower === selectedTower && f.floor === selectedFloor
    );
  }, [selectedProject, selectedTower, selectedFloor]);

  const handlePageChange = (newPage) => {
    if (pagination && newPage >= 1 && newPage <= pagination.pages) {
      setPage(newPage);
    }
  };

  if (loading && projects.length === 0) {
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
          label="Booked / Sold"
          value={stats.bookedFlats}
          icon={UserCheck}
          accent="success"
        />
        <StatCard
          label="Total Received"
          value={formatINR(stats.totalPaid)}
          icon={TrendingUp}
          accent="success"
        />
        <StatCard
          label="Outstanding"
          value={formatINR(stats.totalRemaining)}
          icon={TrendingDown}
          accent="destructive"
        />
      </div>

      {/* Projects View */}
      {currentView === "projects" && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Projects</h2>
            <span className="text-sm text-muted-foreground">
              {pagination ? `Page ${page} of ${pagination.pages}` : ""}
            </span>
          </div>
          {projects.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 bg-muted/20 rounded-lg border border-dashed">
              No projects available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.projectId}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => goToTowers(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base">
                          {project.projectName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {project.location}
                        </p>
                      </div>
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Badge variant="outline">
                        {project.flats?.length || 0} Flats
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Towers View */}
      {currentView === "towers" && selectedProject && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={goToProjects}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">
                {selectedProject.projectName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedProject.location}
              </p>
            </div>
          </div>
          <h3 className="text-sm font-medium mb-3">Select a Tower</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {towers.map((tower) => (
              <Card
                key={tower}
                className="cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => goToFloors(tower)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{tower}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Floors View */}
      {currentView === "floors" && selectedProject && selectedTower && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCurrentView("towers");
                setSelectedFloor("");
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">
                {selectedProject.projectName} — {selectedTower}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedProject.location}
              </p>
            </div>
          </div>
          <h3 className="text-sm font-medium mb-3">Select a Floor</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {floors.map((floor) => (
              <Card
                key={floor}
                className="cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => goToFlats(floor)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{floor}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Flats View */}
      {currentView === "flats" && selectedProject && selectedTower && selectedFloor && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCurrentView("floors");
                setSelectedFloor("");
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">
                {selectedProject.projectName} — {selectedTower} — Floor {selectedFloor}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedProject.location}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredFlats.map((flat) => {
              const uniqueKey = `${selectedProject.projectId}-${flat.tower}-${flat.floor}-${flat.flatNumber}`;
              const { status, label, variant } = getFlatDisplay(flat);
              const isSold = status === "sold";

              return (
                <div
                  key={uniqueKey}
                  className={`border rounded-lg p-3 text-sm transition-all shadow-sm ${
                    isSold
                      ? "bg-primary/10 border-primary dark:bg-primary/20"
                      : "bg-background hover:border-primary"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-base">
                      {flat.flatNumber}
                    </span>
                    <Badge variant={variant} className="capitalize text-[10px]">
                      {label}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs font-medium">
                    {flat.tower} • Floor {flat.floor}
                  </p>

                  {/* Only show buyer & payment details if sold */}
                  {isSold && (
                    <>
                      {flat.buyerName && (
                        <p
                          className="text-xs mt-2 font-medium truncate"
                          title={flat.buyerName}
                        >
                          👤 {flat.buyerName}
                        </p>
                      )}
                      <div className="mt-2 space-y-1">
                        {flat.totalPaid > 0 && (
                          <p className="text-[11px] text-success font-medium">
                            Paid: {formatINR(flat.totalPaid)}
                          </p>
                        )}
                        {flat.remainingAmount > 0 && (
                          <p className="text-[11px] text-destructive font-medium">
                            Due: {formatINR(flat.remainingAmount)}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}