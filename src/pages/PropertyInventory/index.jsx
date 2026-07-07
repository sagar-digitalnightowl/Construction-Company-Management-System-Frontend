// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { PageHeader, StatCard } from "@/components/common/PageHeader";
// import { usePropertyInventory } from "@/hooks/usePropertyInventory";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import {
//   Building2,
//   Home,
//   BarChart3,
//   Download,
//   Search,
//   Eye,
//   TrendingUp,
//   AlertCircle,
// } from "lucide-react";
// import ProjectDetailModal from "@/components/propertyInventory/ProjectDetailModal";
// import BookingPaymentModal from "@/components/propertyInventory/BookingPaymentModal";



// const getHealthColor = (health) => {
//   switch (health) {
//     case "green":
//       return "success";
//     case "yellow":
//       return "warning";
//     case "red":
//       return "destructive";
//     default:
//       return "outline";
//   }
// };

// export default function PropertyInventory() {
//   const {
//     dashboardData,
//     selectedProject,
//     projectBookings,
//     projectAgreements,
//     siteEngineers,
//     bookingPayment,
//     loading,
//     fetchDashboard,
//     fetchProjectDetails,
//     fetchProjectBookings,
//     fetchProjectAgreements,
//     fetchSiteEngineers,
//     fetchBookingPaymentDetails,
//     exportInventory,
//   } = usePropertyInventory();

//   const { current } = useAuthStore();
//   const canEdit = canMutate(current.role, "property"); // adjust as needed

//   const [filters, setFilters] = useState({ status: "", search: "" });
//   const [selectedProjectId, setSelectedProjectId] = useState(null);
//   const [detailOpen, setDetailOpen] = useState(false);
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);

//   const { projectStats, projects, leads, pagination } = dashboardData;

//   // Load dashboard on mount and when filters change
//   useEffect(() => {
//     fetchDashboard({ ...filters });
//   }, []);

//   // Apply filters
//   const applyFilters = () => {
//     fetchDashboard({ ...filters, page: 1 });
//   };

//   // Pagination
//   const goToPage = (page) => {
//     if (page < 1 || page > pagination.pages || page === pagination.page) return;
//     fetchDashboard({ ...filters, page });
//   };

//   // Open project detail modal
//   const handleViewProject = async (id) => {
//     const project = await fetchProjectDetails(id);

//     if (project) {
//       setSelectedProjectId(id);
//       setDetailOpen(true);
//       // Also pre‑fetch bookings, agreements, site engineers
//       fetchProjectBookings(id);
//       fetchProjectAgreements(id);
//       fetchSiteEngineers(id);
//     }
//   };

//   // Open payment details for a booking
//   const handleViewPayments = async (bookingId) => {
//     await fetchBookingPaymentDetails(bookingId);
//     setPaymentModalOpen(true);
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Property"
//         title="Property Inventory"
//         description="Real‑time dashboard and drill‑down into every project."
//         actions={
//           <Button onClick={exportInventory} disabled={loading}>
//             <Download className="h-4 w-4 mr-1" /> Export
//           </Button>
//         }
//       />

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard
//           label="Total Projects"
//           value={projectStats.total || 0}
//           icon={Building2}
//         />
//         <StatCard
//           label="Active"
//           value={projectStats.active || 0}
//           icon={TrendingUp}
//           accent="success"
//         />
//         <StatCard
//           label="Completed"
//           value={projectStats.completed || 0}
//           icon={Home}
//           accent="default"
//         />
//         <StatCard
//           label="Delayed"
//           value={projectStats.delayed || 0}
//           icon={AlertCircle}
//           accent="destructive"
//         />
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             <div>
//               <Label>Status</Label>
//               <Select
//                 value={filters.status}
//                 onValueChange={(v) => setFilters({ ...filters, status: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="All statuses" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value=" ">All</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="completed">Completed</SelectItem>
//                   <SelectItem value="delayed">Delayed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Search</Label>
//               <Input
//                 placeholder="Project name..."
//                 value={filters.search}
//                 onChange={(e) =>
//                   setFilters({ ...filters, search: e.target.value })
//                 }
//               />
//             </div>
//             <div className="flex items-end">
//               <Button onClick={applyFilters}>
//                 <Search className="h-4 w-4 mr-1" /> Search
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Projects Table */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Project Name</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Progress</TableHead>
//                 <TableHead>Towers</TableHead>
//                 <TableHead>Booked Flats</TableHead>
//                 <TableHead>Health</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {projects.map((project) => (
//                 <TableRow key={project.id}>
//                   <TableCell className="font-medium">{project.name}</TableCell>
//                   <TableCell>{project.location}</TableCell>
//                   <TableCell className="capitalize">{project.status}</TableCell>
//                   <TableCell>{project.progress}%</TableCell>
//                   <TableCell>{project.totalTowers}</TableCell>
//                   <TableCell>{project.totalBookedFlats}</TableCell>
//                   <TableCell>
//                     {project.health && (
//                       <Badge variant={getHealthColor(project.health)}>
//                         {project.health}
//                       </Badge>
//                     )}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleViewProject(project.id)}
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {projects.length === 0 && !loading && (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center">
//                     No projects found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>

//           {/* Pagination */}
//           {pagination.total > 0 && (
//             <div className="flex justify-between items-center p-4">
//               <span className="text-sm text-muted-foreground">
//                 Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
//                 projects)
//               </span>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={pagination.page <= 1}
//                   onClick={() => goToPage(pagination.page - 1)}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={pagination.page >= pagination.pages}
//                   onClick={() => goToPage(pagination.page + 1)}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Project Detail Dialog */}
//       <ProjectDetailModal
//         open={detailOpen}
//         onOpenChange={setDetailOpen}
//         project={selectedProject}
//         bookings={projectBookings}
//         agreements={projectAgreements}
//         siteEngineers={siteEngineers}
//         loading={loading}
//         onViewPayments={handleViewPayments}
//       />

//       {/* Booking Payment Dialog */}
//       <BookingPaymentModal
//         open={paymentModalOpen}
//         onOpenChange={setPaymentModalOpen}
//         bookingPayment={bookingPayment}
//       />
//     </div>
//   );
// }



// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { PageHeader, StatCard } from "@/components/common/PageHeader";
// import { usePropertyInventory } from "@/hooks/usePropertyInventory";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import {
//   Building2,
//   Home,
//   Download,
//   Search,
//   Eye,
//   TrendingUp,
//   AlertCircle,
//   Users
// } from "lucide-react";
// import ProjectDetailModal from "@/components/propertyInventory/ProjectDetailModal";
// import BookingPaymentModal from "@/components/propertyInventory/BookingPaymentModal";

// const getHealthColor = (health) => {
//   switch (health) {
//     case "green": return "success";
//     case "yellow": return "warning";
//     case "red": return "destructive";
//     default: return "outline";
//   }
// };

// export default function PropertyInventory() {
//   const {
//     dashboardData,
//     selectedProject,
//     projectBookings,
//     projectAgreements,
//     siteEngineers,
//     bookingPayment,
//     loading,
//     fetchDashboard,
//     fetchProjectDetails,
//     fetchProjectBookings,
//     fetchProjectAgreements,
//     fetchSiteEngineers,
//     fetchBookingPaymentDetails,
//     exportInventory,
//   } = usePropertyInventory();

//   const { current } = useAuthStore();
//   const canEdit = canMutate(current?.role, "property");

//   const [filters, setFilters] = useState({ status: "", search: "" });
//   const [selectedProjectId, setSelectedProjectId] = useState(null);
//   const [detailOpen, setDetailOpen] = useState(false);
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);

//   const { projectStats, projects, leads, pagination } = dashboardData;

//   useEffect(() => {
//     fetchDashboard({ ...filters });
//   }, []);

//   const applyFilters = () => {
//     fetchDashboard({ ...filters, page: 1 });
//   };

//   const goToPage = (page) => {
//     if (page < 1 || page > pagination.pages || page === pagination.page) return;
//     fetchDashboard({ ...filters, page });
//   };

//   const handleViewProject = async (id) => {
//     const project = await fetchProjectDetails(id);
//     if (project) {
//       setSelectedProjectId(id);
//       setDetailOpen(true);
//       fetchProjectBookings(id);
//       fetchProjectAgreements(id);
//       fetchSiteEngineers(id);
//     }
//   };

//   const handleViewPayments = async (bookingId) => {
//     await fetchBookingPaymentDetails(bookingId);
//     setPaymentModalOpen(true);
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Property"
//         title="Property Inventory"
//         description="Real-time dashboard and drill-down into every project."
//         actions={
//           <Button onClick={exportInventory} disabled={loading}>
//             <Download className="h-4 w-4 mr-1" /> Export
//           </Button>
//         }
//       />

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard label="Total Projects" value={projectStats.total || 0} icon={Building2} />
//         <StatCard label="Active" value={projectStats.active || 0} icon={TrendingUp} accent="success" />
//         <StatCard label="Completed" value={projectStats.completed || 0} icon={Home} accent="default" />
//         <StatCard label="Delayed" value={projectStats.delayed || 0} icon={AlertCircle} accent="destructive" />
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             <div>
//               <Label>Status</Label>
//               <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
//                 <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value=" ">All</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="completed">Completed</SelectItem>
//                   <SelectItem value="delayed">Delayed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Search</Label>
//               <Input
//                 placeholder="Project name..."
//                 value={filters.search}
//                 onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//               />
//             </div>
//             <div className="flex items-end">
//               <Button onClick={applyFilters}>
//                 <Search className="h-4 w-4 mr-1" /> Search
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Projects Table */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Project Name</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Progress</TableHead>
//                 <TableHead>Towers</TableHead>
//                 <TableHead>Booked Flats</TableHead>
//                 <TableHead>Health</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {projects.map((project) => (
//                 <TableRow key={project.id}>
//                   <TableCell className="font-medium">{project.name}</TableCell>
//                   <TableCell>{project.location}</TableCell>
//                   <TableCell className="capitalize">{project.status}</TableCell>
//                   <TableCell>{project.progress}%</TableCell>
//                   <TableCell>{project.totalTowers}</TableCell>
//                   <TableCell>{project.totalBookedFlats}</TableCell>
//                   <TableCell>
//                     {project.health && (
//                       <Badge variant={getHealthColor(project.health)}>{project.health}</Badge>
//                     )}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button variant="ghost" size="icon" onClick={() => handleViewProject(project.id)}>
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {projects.length === 0 && !loading && (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center">No projects found</TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>

//           {pagination.total > 0 && (
//             <div className="flex justify-between items-center p-4">
//               <span className="text-sm text-muted-foreground">
//                 Page {pagination.page} of {pagination.pages} ({pagination.total} projects)
//               </span>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => goToPage(pagination.page - 1)}>
//                   Previous
//                 </Button>
//                 <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => goToPage(pagination.page + 1)}>
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Leads Table (New Section Added) */}
//       {/* {leads && leads.length > 0 && (
//         <Card>
//           <CardHeader className="py-4">
//             <CardTitle className="text-lg flex items-center gap-2">
//               <Users className="h-5 w-5" /> Recent Property Leads
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email / Phone</TableHead>
//                   <TableHead>Interested In</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {leads.map((lead) => (
//                   <TableRow key={lead.id}>
//                     <TableCell className="font-medium">{lead.name}</TableCell>
//                     <TableCell>
//                       {lead.email} <br />
//                       <span className="text-xs text-muted-foreground">{lead.phone}</span>
//                     </TableCell>
//                     <TableCell>{lead.interestedIn || "—"}</TableCell>
//                     <TableCell>
//                       <Badge variant="outline">{lead.status}</Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       )} */}

//       <ProjectDetailModal
//         open={detailOpen}
//         onOpenChange={setDetailOpen}
//         project={selectedProject}
//         bookings={projectBookings}
//         agreements={projectAgreements}
//         siteEngineers={siteEngineers}
//         loading={loading}
//         onViewPayments={handleViewPayments}
//       />

//       <BookingPaymentModal
//         open={paymentModalOpen}
//         onOpenChange={setPaymentModalOpen}
//         bookingPayment={bookingPayment}
//       />
//     </div>
//   );
// }






import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { usePropertyInventory } from "@/hooks/usePropertyInventory";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import {
  Building2,
  Home,
  Download,
  Search,
  Eye,
  TrendingUp,
  AlertCircle,
  Users
} from "lucide-react";
import ProjectDetailModal from "@/components/propertyInventory/ProjectDetailModal";
import BookingPaymentModal from "@/components/propertyInventory/BookingPaymentModal";

const getHealthColor = (health) => {
  switch (health) {
    case "green": return "success";
    case "yellow": return "warning";
    case "red": return "destructive";
    default: return "outline";
  }
};

export default function PropertyInventory() {
  const {
    dashboardData,
    selectedProject,
    projectBookings,
    projectAgreements,
    siteEngineers,
    bookingPayment,
    loading,
    fetchDashboard,
    fetchProjectDetails,
    fetchProjectBookings,
    fetchProjectAgreements,
    fetchSiteEngineers,
    fetchBookingPaymentDetails,
    exportInventory,
  } = usePropertyInventory();

  const { current } = useAuthStore();
  const canEdit = canMutate(current?.role, "property");

  const [filters, setFilters] = useState({ status: "", search: "" });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // ✅ UPDATED: Safe Destructuring to prevent crashes if API sends null/undefined
  const { 
    projectStats = {}, 
    projects = [], 
    leads = [], 
    pagination = { page: 1, pages: 1, total: 0 } 
  } = dashboardData || {};

  useEffect(() => {
    fetchDashboard({ ...filters });
  }, []);

  const applyFilters = () => {
    fetchDashboard({ ...filters, page: 1 });
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.pages || page === pagination.page) return;
    fetchDashboard({ ...filters, page });
  };

  const handleViewProject = async (id) => {
    const project = await fetchProjectDetails(id);
    if (project) {
      setSelectedProjectId(id);
      setDetailOpen(true);
      fetchProjectBookings(id);
      fetchProjectAgreements(id);
      fetchSiteEngineers(id);
    }
  };

  const handleViewPayments = async (bookingId) => {
    await fetchBookingPaymentDetails(bookingId);
    setPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Property"
        title="Property Inventory"
        description="Real-time dashboard and drill-down into every project."
        actions={
          <Button onClick={exportInventory} disabled={loading}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* ✅ UPDATED: Safe access for projectStats */}
        <StatCard label="Total Projects" value={projectStats?.total || 0} icon={Building2} />
        <StatCard label="Active" value={projectStats?.active || 0} icon={TrendingUp} accent="success" />
        <StatCard label="Completed" value={projectStats?.completed || 0} icon={Home} accent="default" />
        <StatCard label="Delayed" value={projectStats?.delayed || 0} icon={AlertCircle} accent="destructive" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Project name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={applyFilters}>
                <Search className="h-4 w-4 mr-1" /> Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Towers</TableHead>
                <TableHead>Booked Flats</TableHead>
                <TableHead>Health</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* ✅ UPDATED: Added optional chaining map (projects?.map) */}
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name || "N/A"}</TableCell>
                  <TableCell>{project.location || "N/A"}</TableCell>
                  <TableCell className="capitalize">{project.status || "—"}</TableCell>
                  <TableCell>{project.progress || 0}%</TableCell>
                  <TableCell>{project.totalTowers || 0}</TableCell>
                  <TableCell>{project.totalBookedFlats || 0}</TableCell>
                  <TableCell>
                    {project.health && (
                      <Badge variant={getHealthColor(project.health)}>{project.health}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleViewProject(project.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!projects || projects.length === 0) && !loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No projects found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* ✅ UPDATED: Safe handling for pagination */}
          {pagination?.total > 0 && (
            <div className="flex justify-between items-center p-4">
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages} ({pagination.total} projects)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => goToPage(pagination.page - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => goToPage(pagination.page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads Table (Commented but safely updated for future) */}
      {/* {leads && leads.length > 0 && (
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" /> Recent Property Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email / Phone</TableHead>
                  <TableHead>Interested In</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead?.client?.name || lead?.name || "N/A"}</TableCell>
                    <TableCell>
                      {lead?.client?.email || lead?.email || "N/A"} <br />
                      <span className="text-xs text-muted-foreground">{lead?.client?.phone || lead?.phone || ""}</span>
                    </TableCell>
                    <TableCell>{lead?.interestedIn || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead?.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )} */}

      {/* Modals */}
      <ProjectDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        project={selectedProject}
        bookings={projectBookings}
        agreements={projectAgreements}
        siteEngineers={siteEngineers}
        loading={loading}
        onViewPayments={handleViewPayments}
      />

      <BookingPaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        bookingPayment={bookingPayment}
      />
    </div>
  );
}