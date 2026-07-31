
// // src/pages/Bookings.jsx
// import React, { useState, useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Plus, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight, 
//   AlertCircle,
//   Building2
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookingCard } from "@/components/booking/BookingCard";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { useNavigate } from "react-router-dom";
// import { BookingFormDialog } from "@/components/booking/BookingFormDialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useProject } from "@/hooks/useProject";
// import { projectApi } from "@/api/projectApi";
// import { toast } from "sonner";

// export default function Bookings() {
//   const { current } = useAuthStore();
//   const canCreate = canMutate(current?.role, "booking");
//   const navigate = useNavigate();

//   const {
//     bookings,
//     fetchBookings,
//     loading,
//     pagination,
//     softDeleteBooking,
//     updateBooking,
//   } = useBooking();

//   const {
//     cancelAllBookings,
//     loading: projectLoading,
//   } = useProject();

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [formOpen, setFormOpen] = useState(false);
//   const [editBookingData, setEditBookingData] = useState(null);

//   // Cancel All Bookings states
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [projectList, setProjectList] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter]);

//   useEffect(() => {
//     fetchBookings({
//       page: currentPage,
//       limit: 12,
//       search: search || undefined,
//       status: statusFilter === "all" ? undefined : statusFilter,
//     });
//   }, [currentPage, search, statusFilter, fetchBookings]);

//   // Fetch projects when cancel dialog opens
//   const handleOpenCancelDialog = async () => {
//     setCancelDialogOpen(true);
//     setLoadingProjects(true);
//     try {
//       // Use existing projectApi.getAll method
//       const res = await projectApi.getAll({ page: 1, limit: 100 });
//       const data = res.data?.data;
      
//       if (res.data?.success) {
//         // Filter projects that have at least one booking
//         const projectsWithBookings = data?.projects?.filter(
//           (project) => project.bookedFlats > 0 || project.totalFlats > 0
//         ) || [];
//         setProjectList(projectsWithBookings);
//         setSelectedProject(null);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load projects");
//     } finally {
//       setLoadingProjects(false);
//     }
//   };

//   const handleSelectProject = (project) => {
//     setSelectedProject(project);
//   };

//   const handleCancelAll = async () => {
//     if (!selectedProject) {
//       toast.error("Please select a project");
//       return;
//     }

//     setShowConfirmDialog(true);
//   };

//   const handleConfirmCancelAll = async () => {
//     if (!selectedProject) return;

//     try {
//       const success = await cancelAllBookings(selectedProject._id);

//       if (success) {
//         setCancelDialogOpen(false);
//         setShowConfirmDialog(false);
//         setSelectedProject(null);
//         // Refresh bookings list
//         await fetchBookings({
//           page: currentPage,
//           limit: 12,
//           search: search || undefined,
//           status: statusFilter === "all" ? undefined : statusFilter,
//         });
//       }
//     } catch (err) {
//       toast.error("Failed to cancel all bookings");
//     }
//   };

//   const handleView = (id) => navigate(`/bookings/${id}`);

//   const handleEdit = (booking) => {
//     setEditBookingData(booking);
//     setFormOpen(true);
//   };

//   const handleDelete = async (booking) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete booking ${booking.bookingReferenceNumber}?`,
//       )
//     )
//       return;
//     const success = await softDeleteBooking(booking._id);
//     if (success) fetchBookings();
//   };

//   const handleFormSuccess = () => {
//     setFormOpen(false);
//     setEditBookingData(null);
//     fetchBookings();
//   };

//   // -------------------------------------------------------------
//   // NEW FILTER LOGIC: Hide bookings where approvalStatus is "rejected" OR "pending"
//   // -------------------------------------------------------------
//   const displayedBookings = bookings.filter(
//     (b) => b.approvalStatus !== "rejected" && b.approvalStatus !== "pending"
//   );

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Real Estate"
//         title="Bookings"
//         description="Manage all flat/unit bookings across projects."
//         actions={
//           <div className="flex gap-2">
//             {canCreate && (
//               <>
//                 <Button
//                   variant="outline"
//                   onClick={handleOpenCancelDialog}
//                   className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
//                 >
//                   <AlertCircle className="h-4 w-4 mr-2" />
//                   Cancel All Bookings
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     setEditBookingData(null);
//                     setFormOpen(true);
//                   }}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> New Booking
//                 </Button>
//               </>
//             )}
//           </div>
//         }
//       />
//       <div className="flex flex-col sm:flex-row gap-3 justify-between">
//         <Tabs value={statusFilter} onValueChange={setStatusFilter}>
//           <TabsList>
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="sold">Sold</TabsTrigger>
//             <TabsTrigger value="booked">Booked</TabsTrigger>
//             <TabsTrigger value="on_hold">On Hold</TabsTrigger>
//             <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
//           </TabsList>
//         </Tabs>
//         <div className="relative">
//           <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
//           <Input
//             className="pl-7 w-64"
//             placeholder="Search by unit/ref..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[...Array(6)].map((_, i) => (
//             <Skeleton key={i} className="h-40" />
//           ))}
//         </div>
//       ) : displayedBookings.length === 0 ? (
//         <EmptyState
//           title="No bookings"
//           description="Create a new booking to get started."
//         />
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {/* USE displayedBookings INSTEAD OF bookings */}
//             {displayedBookings.map((b) => (
//               <BookingCard
//                 key={b._id}
//                 booking={b}
//                 onClick={handleView}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>

//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing page <span className="font-medium">{pagination.page}</span> of{" "}
//                 <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} bookings)
//               </div>

//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-2"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
//                   {[...Array(pagination.pages)].map((_, index) => {
//                     const pageNumber = index + 1;

//                     if (
//                       pagination.pages <= 7 ||
//                       pageNumber === 1 ||
//                       pageNumber === pagination.pages ||
//                       (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
//                     ) {
//                       return (
//                         <Button
//                           key={pageNumber}
//                           variant={currentPage === pageNumber ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setCurrentPage(pageNumber)}
//                           className={`w-8 h-8 p-0 ${currentPage === pageNumber ? "" : "text-muted-foreground"}`}
//                         >
//                           {pageNumber}
//                         </Button>
//                       );
//                     }

//                     if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
//                       return <span key={pageNumber} className="px-1 text-muted-foreground">...</span>;
//                     }

//                     return null;
//                   })}
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
//                   disabled={currentPage === pagination.pages}
//                   className="px-2"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       <BookingFormDialog
//         open={formOpen}
//         onOpenChange={(open) => {
//           setFormOpen(open);
//           if (!open) setEditBookingData(null);
//         }}
//         editBooking={editBookingData}
//         onSuccess={handleFormSuccess}
//       />

//       {/* Cancel All Bookings - Project Selection Dialog */}
//       <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[80vh]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               Cancel All Bookings
//             </DialogTitle>
//             <DialogDescription>
//               Select a project to cancel all its bookings. This action will cancel all pending and confirmed bookings for the selected project.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 my-4">
//             {loadingProjects ? (
//               <div className="space-y-2">
//                 <Skeleton className="h-12 w-full" />
//                 <Skeleton className="h-12 w-full" />
//                 <Skeleton className="h-12 w-full" />
//               </div>
//             ) : projectList.length === 0 ? (
//               <div className="text-center py-8">
//                 <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//                 <p className="text-muted-foreground">No projects with bookings found</p>
//               </div>
//             ) : (
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {projectList.map((project) => (
//                   <div
//                     key={project._id}
//                     className={`
//                       flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
//                       ${selectedProject?._id === project._id 
//                         ? 'border-red-500 bg-red-50' 
//                         : 'hover:border-gray-300 hover:bg-gray-50'
//                       }
//                     `}
//                     onClick={() => handleSelectProject(project)}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`
//                         w-5 h-5 rounded-full border-2 flex items-center justify-center
//                         ${selectedProject?._id === project._id 
//                           ? 'border-red-500 bg-red-500' 
//                           : 'border-gray-300'
//                         }
//                       `}>
//                         {selectedProject?._id === project._id && (
//                           <div className="w-1.5 h-1.5 bg-white rounded-full" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium">{project.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           Location: {project.location}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleCancelAll}
//               disabled={!selectedProject || projectLoading}
//             >
//               {projectLoading ? "Cancelling..." : "Cancel All Bookings"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Confirmation Alert Dialog */}
//       <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-red-600">
//               <AlertCircle className="h-5 w-5" />
//               Confirm Cancellation
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-2">
//               <p>
//                 You are about to cancel <strong>ALL</strong> bookings for the project:
//               </p>
//               <p className="font-semibold text-foreground">
//                 {selectedProject?.name}
//               </p>
//               <p className="text-sm text-red-600 font-medium">
//                 This action cannot be undone. All bookings will be permanently cancelled.
//               </p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction 
//               onClick={handleConfirmCancelAll}
//               className="bg-red-600 hover:bg-red-700 text-white font-medium"
//             >
//               Yes, Cancel All Bookings
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }






// // src/pages/Bookings.jsx
// import React, { useState, useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Plus, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight, 
//   AlertCircle,
//   Building2
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookingCard } from "@/components/booking/BookingCard";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { useNavigate } from "react-router-dom";
// import { BookingFormDialog } from "@/components/booking/BookingFormDialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { useProject } from "@/hooks/useProject";
// import { projectApi } from "@/api/projectApi";
// import { toast } from "sonner";

// export default function Bookings() {
//   const { current } = useAuthStore();
//   const canCreate = canMutate(current?.role, "booking");
//   const navigate = useNavigate();

//   const {
//     bookings,
//     fetchBookings,
//     loading,
//     pagination,
//     softDeleteBooking,
//     updateBooking,
//   } = useBooking();

//   const {
//     cancelAllBookings,
//     loading: projectLoading,
//   } = useProject();

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("booked");
//   const [formOpen, setFormOpen] = useState(false);
//   const [editBookingData, setEditBookingData] = useState(null);

//   // Cancel All Bookings states
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [projectList, setProjectList] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   // Helper object to keep fetch parameters consistent across updates/deletes
//   const fetchParams = {
//     page: currentPage,
//     limit: 12,
//     search: search || undefined,
//     status: statusFilter,
//     approvalStatus: "approved", // Ab sirf approved bookings hi mangwayega
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter]);

//   useEffect(() => {
//     fetchBookings(fetchParams);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage, search, statusFilter]); 

//   // Fetch projects when cancel dialog opens
//   const handleOpenCancelDialog = async () => {
//     setCancelDialogOpen(true);
//     setLoadingProjects(true);
//     try {
//       const res = await projectApi.getAll({ page: 1, limit: 100 });
//       const data = res.data?.data;
      
//       if (res.data?.success) {
//         const projectsWithBookings = data?.projects?.filter(
//           (project) => project.bookedFlats > 0 || project.totalFlats > 0
//         ) || [];
//         setProjectList(projectsWithBookings);
//         setSelectedProject(null);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load projects");
//     } finally {
//       setLoadingProjects(false);
//     }
//   };

//   const handleSelectProject = (project) => {
//     setSelectedProject(project);
//   };

//   const handleCancelAll = async () => {
//     if (!selectedProject) {
//       toast.error("Please select a project");
//       return;
//     }

//     setShowConfirmDialog(true);
//   };

//   const handleConfirmCancelAll = async () => {
//     if (!selectedProject) return;

//     try {
//       const success = await cancelAllBookings(selectedProject._id);

//       if (success) {
//         setCancelDialogOpen(false);
//         setShowConfirmDialog(false);
//         setSelectedProject(null);
//         await fetchBookings(fetchParams);
//       }
//     } catch (err) {
//       toast.error("Failed to cancel all bookings");
//     }
//   };

//   const handleView = (id) => navigate(`/bookings/${id}`);

//   const handleEdit = (booking) => {
//     setEditBookingData(booking);
//     setFormOpen(true);
//   };

//   const handleDelete = async (booking) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete booking ${booking.bookingReferenceNumber}?`,
//       )
//     )
//       return;
//     const success = await softDeleteBooking(booking._id);
//     if (success) fetchBookings(fetchParams);
//   };

//   const handleFormSuccess = () => {
//     setFormOpen(false);
//     setEditBookingData(null);
//     fetchBookings(fetchParams);
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Real Estate"
//         title="Bookings"
//         description="Manage all flat/unit bookings across projects."
//         actions={
//           <div className="flex gap-2">
//             {canCreate && (
//               <>
//                 <Button
//                   variant="outline"
//                   onClick={handleOpenCancelDialog}
//                   className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
//                 >
//                   <AlertCircle className="h-4 w-4 mr-2" />
//                   Cancel All Bookings
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     setEditBookingData(null);
//                     setFormOpen(true);
//                   }}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> New Booking
//                 </Button>
//               </>
//             )}
//           </div>
//         }
//       />
//       <div className="flex flex-col sm:flex-row gap-3 justify-between">
//         <Tabs value={statusFilter} onValueChange={setStatusFilter}>
//           <TabsList>
//             <TabsTrigger value="booked">Booked</TabsTrigger>
//             <TabsTrigger value="sold">Sold</TabsTrigger>
//             <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
//           </TabsList>
//         </Tabs>
//         <div className="relative">
//           <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
//           <Input
//             className="pl-7 w-64"
//             placeholder="Search by unit/ref..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[...Array(6)].map((_, i) => (
//             <Skeleton key={i} className="h-40" />
//           ))}
//         </div>
//       ) : bookings.length === 0 ? (
//         <EmptyState
//           title="No bookings"
//           description="Create a new booking to get started."
//         />
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {bookings.map((b) => (
//               <BookingCard
//                 key={b._id}
//                 booking={b}
//                 onClick={handleView}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>

//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing page <span className="font-medium">{pagination.page}</span> of{" "}
//                 <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} bookings)
//               </div>

//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-2"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
//                   {[...Array(pagination.pages)].map((_, index) => {
//                     const pageNumber = index + 1;

//                     if (
//                       pagination.pages <= 7 ||
//                       pageNumber === 1 ||
//                       pageNumber === pagination.pages ||
//                       (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
//                     ) {
//                       return (
//                         <Button
//                           key={pageNumber}
//                           variant={currentPage === pageNumber ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setCurrentPage(pageNumber)}
//                           className={`w-8 h-8 p-0 ${currentPage === pageNumber ? "" : "text-muted-foreground"}`}
//                         >
//                           {pageNumber}
//                         </Button>
//                       );
//                     }

//                     if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
//                       return <span key={pageNumber} className="px-1 text-muted-foreground">...</span>;
//                     }

//                     return null;
//                   })}
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
//                   disabled={currentPage === pagination.pages}
//                   className="px-2"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       <BookingFormDialog
//         open={formOpen}
//         onOpenChange={(open) => {
//           setFormOpen(open);
//           if (!open) setEditBookingData(null);
//         }}
//         editBooking={editBookingData}
//         onSuccess={handleFormSuccess}
//       />

//       {/* Cancel All Bookings - Project Selection Dialog */}
//       <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[80vh]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               Cancel All Bookings
//             </DialogTitle>
//             <DialogDescription>
//               Select a project to cancel all its bookings. This action will cancel all pending and confirmed bookings for the selected project.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 my-4">
//             {loadingProjects ? (
//               <div className="space-y-2">
//                 <Skeleton className="h-12 w-full" />
//                 <Skeleton className="h-12 w-full" />
//                 <Skeleton className="h-12 w-full" />
//               </div>
//             ) : projectList.length === 0 ? (
//               <div className="text-center py-8">
//                 <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//                 <p className="text-muted-foreground">No projects with bookings found</p>
//               </div>
//             ) : (
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {projectList.map((project) => (
//                   <div
//                     key={project._id}
//                     className={`
//                       flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
//                       ${selectedProject?._id === project._id 
//                         ? 'border-red-500 bg-red-50' 
//                         : 'hover:border-gray-300 hover:bg-gray-50'
//                       }
//                     `}
//                     onClick={() => handleSelectProject(project)}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`
//                         w-5 h-5 rounded-full border-2 flex items-center justify-center
//                         ${selectedProject?._id === project._id 
//                           ? 'border-red-500 bg-red-500' 
//                           : 'border-gray-300'
//                         }
//                       `}>
//                         {selectedProject?._id === project._id && (
//                           <div className="w-1.5 h-1.5 bg-white rounded-full" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium">{project.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           Location: {project.location}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleCancelAll}
//               disabled={!selectedProject || projectLoading}
//             >
//               {projectLoading ? "Cancelling..." : "Cancel All Bookings"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Confirmation Alert Dialog */}
//       <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-red-600">
//               <AlertCircle className="h-5 w-5" />
//               Confirm Cancellation
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-2">
//               <p>
//                 You are about to cancel <strong>ALL</strong> bookings for the project:
//               </p>
//               <p className="font-semibold text-foreground">
//                 {selectedProject?.name}
//               </p>
//               <p className="text-sm text-red-600 font-medium">
//                 This action cannot be undone. All bookings will be permanently cancelled.
//               </p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction 
//               onClick={handleConfirmCancelAll}
//               className="bg-red-600 hover:bg-red-700 text-white font-medium"
//             >
//               Yes, Cancel All Bookings
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }









// // src/pages/Bookings.jsx
// import React, { useState, useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Plus, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight, 
//   AlertCircle,
//   Building2
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookingCard } from "@/components/booking/BookingCard";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { useNavigate } from "react-router-dom";
// import { BookingFormDialog } from "@/components/booking/BookingFormDialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// // 🆕 NEW: Select component imports
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useProject } from "@/hooks/useProject";
// import { projectApi } from "@/api/projectApi";
// import { toast } from "sonner";

// export default function Bookings() {
//   const { current } = useAuthStore();
//   const canCreate = canMutate(current?.role, "booking");
//   const navigate = useNavigate();

//   const {
//     bookings,
//     fetchBookings,
//     loading,
//     pagination,
//     softDeleteBooking,
//     updateBooking,
//   } = useBooking();

//   const {
//     cancelAllBookings,
//     loading: projectLoading,
//   } = useProject();

//   // Core filter states
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("booked");
//   const [formOpen, setFormOpen] = useState(false);
//   const [editBookingData, setEditBookingData] = useState(null);

//   // 🆕 NEW: Project Dropdown states
//   const [filterProjects, setFilterProjects] = useState([]);
//   const [projectName, setProjectName] = useState("");

//   // Cancel All Bookings states
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [projectList, setProjectList] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   // 🆕 NEW: Load projects on mount and set the default selected project
//   useEffect(() => {
//     const loadProjectsForFilter = async () => {
//       try {
//         const res = await projectApi.getAll({ page: 1, limit: 100 });
//         const projectsData = res.data?.data?.projects || [];
//         setFilterProjects(projectsData);
        
//         // Auto-select the first project if available
//         if (projectsData.length > 0) {
//           setProjectName(projectsData[0].name);
//         }
//       } catch (err) {
//         toast.error("Failed to load projects for filter");
//       }
//     };

//     loadProjectsForFilter();
//   }, []);

//   // 🔄 UPDATE: Helper object now includes projectName
//   const fetchParams = {
//     page: currentPage,
//     limit: 12,
//     search: search || undefined,
//     projectName: projectName || undefined,
//     status: statusFilter,
//     approvalStatus: "approved", // Ab sirf approved bookings hi mangwayega
//   };

//   // 🔄 UPDATE: Reset page to 1 when any filter changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, projectName, statusFilter]);

//   // 🔄 UPDATE: Fetch bookings ONLY when a projectName is set (prevents premature empty calls)
//   useEffect(() => {
//     if (projectName) {
//       fetchBookings(fetchParams);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage, search, projectName, statusFilter]); 

//   // Fetch projects when cancel dialog opens
//   const handleOpenCancelDialog = async () => {
//     setCancelDialogOpen(true);
//     setLoadingProjects(true);
//     try {
//       const res = await projectApi.getAll({ page: 1, limit: 100 });
//       const data = res.data?.data;
      
//       if (res.data?.success) {
//         const projectsWithBookings = data?.projects?.filter(
//           (project) => project.bookedFlats > 0 || project.totalFlats > 0
//         ) || [];
//         setProjectList(projectsWithBookings);
//         setSelectedProject(null);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load projects");
//     } finally {
//       setLoadingProjects(false);
//     }
//   };

//   const handleSelectProject = (project) => {
//     setSelectedProject(project);
//   };

//   const handleCancelAll = async () => {
//     if (!selectedProject) {
//       toast.error("Please select a project");
//       return;
//     }

//     setShowConfirmDialog(true);
//   };

//   const handleConfirmCancelAll = async () => {
//     if (!selectedProject) return;

//     try {
//       const success = await cancelAllBookings(selectedProject._id);

//       if (success) {
//         setCancelDialogOpen(false);
//         setShowConfirmDialog(false);
//         setSelectedProject(null);
//         await fetchBookings(fetchParams);
//       }
//     } catch (err) {
//       toast.error("Failed to cancel all bookings");
//     }
//   };

//   const handleView = (id) => navigate(`/bookings/${id}`);

//   const handleEdit = (booking) => {
//     setEditBookingData(booking);
//     setFormOpen(true);
//   };

//   const handleDelete = async (booking) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete booking ${booking.bookingReferenceNumber}?`,
//       )
//     )
//       return;
//     const success = await softDeleteBooking(booking._id);
//     if (success) fetchBookings(fetchParams);
//   };

//   const handleFormSuccess = () => {
//     setFormOpen(false);
//     setEditBookingData(null);
//     fetchBookings(fetchParams);
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Real Estate"
//         title="Bookings"
//         description="Manage all flat/unit bookings across projects."
//         actions={
//           <div className="flex gap-2">
//             {canCreate && (
//               <>
//                 <Button
//                   variant="outline"
//                   onClick={handleOpenCancelDialog}
//                   className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
//                 >
//                   <AlertCircle className="h-4 w-4 mr-2" />
//                   Cancel All Bookings
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     setEditBookingData(null);
//                     setFormOpen(true);
//                   }}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> New Booking
//                 </Button>
//               </>
//             )}
//           </div>
//         }
//       />
//       <div className="flex flex-col sm:flex-row gap-3 justify-between">
//         <Tabs value={statusFilter} onValueChange={setStatusFilter}>
//           <TabsList>
//             <TabsTrigger value="booked">Booked</TabsTrigger>
//             <TabsTrigger value="sold">Sold</TabsTrigger>
//             <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
//           </TabsList>
//         </Tabs>
        
//         {/* 🔄 UPDATE: Filter Group Container */}
//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          
//           {/* 🆕 NEW: Project Select Dropdown */}
//           <Select 
//             value={projectName} 
//             onValueChange={(val) => setProjectName(val)}
//             disabled={filterProjects.length === 0}
//           >
//             <SelectTrigger className="w-full sm:w-56 bg-background">
//               <SelectValue placeholder="Select Project" />
//             </SelectTrigger>
//             <SelectContent>
//               {filterProjects.map((project) => (
//                 <SelectItem key={project._id} value={project.name}>
//                   {project.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Search Input */}
//           <div className="relative">
//             <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               className="pl-8 w-full sm:w-64 bg-background"
//               placeholder="Search by unit/ref..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[...Array(6)].map((_, i) => (
//             <Skeleton key={i} className="h-40" />
//           ))}
//         </div>
//       ) : bookings.length === 0 ? (
//         <EmptyState
//           title="No bookings"
//           description="Create a new booking to get started or try a different filter."
//         />
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {bookings.map((b) => (
//               <BookingCard
//                 key={b._id}
//                 booking={b}
//                 onClick={handleView}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>

//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing page <span className="font-medium">{pagination.page}</span> of{" "}
//                 <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} bookings)
//               </div>

//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-2"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
//                   {[...Array(pagination.pages)].map((_, index) => {
//                     const pageNumber = index + 1;

//                     if (
//                       pagination.pages <= 7 ||
//                       pageNumber === 1 ||
//                       pageNumber === pagination.pages ||
//                       (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
//                     ) {
//                       return (
//                         <Button
//                           key={pageNumber}
//                           variant={currentPage === pageNumber ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setCurrentPage(pageNumber)}
//                           className={`w-8 h-8 p-0 ${currentPage === pageNumber ? "" : "text-muted-foreground"}`}
//                         >
//                           {pageNumber}
//                         </Button>
//                       );
//                     }

//                     if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
//                       return <span key={pageNumber} className="px-1 text-muted-foreground">...</span>;
//                     }

//                     return null;
//                   })}
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
//                   disabled={currentPage === pagination.pages}
//                   className="px-2"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       <BookingFormDialog
//         open={formOpen}
//         onOpenChange={(open) => {
//           setFormOpen(open);
//           if (!open) setEditBookingData(null);
//         }}
//         editBooking={editBookingData}
//         onSuccess={handleFormSuccess}
//       />

//       {/* Cancel All Bookings - Project Selection Dialog */}
//       <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[80vh]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               Cancel All Bookings
//             </DialogTitle>
//             <DialogDescription>
//               Select a project to cancel all its bookings. This action will cancel all pending and confirmed bookings for the selected project.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 my-4">
//             {loadingProjects ? (
//               <div className="space-y-2">
//                 <Skeleton className="h-12 w-full" />
//                 <Skeleton className="h-12 w-full" />
//                 <Skeleton className="h-12 w-full" />
//               </div>
//             ) : projectList.length === 0 ? (
//               <div className="text-center py-8">
//                 <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//                 <p className="text-muted-foreground">No projects with bookings found</p>
//               </div>
//             ) : (
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {projectList.map((project) => (
//                   <div
//                     key={project._id}
//                     className={`
//                       flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
//                       ${selectedProject?._id === project._id 
//                         ? 'border-red-500 bg-red-50' 
//                         : 'hover:border-gray-300 hover:bg-gray-50'
//                       }
//                     `}
//                     onClick={() => handleSelectProject(project)}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`
//                         w-5 h-5 rounded-full border-2 flex items-center justify-center
//                         ${selectedProject?._id === project._id 
//                           ? 'border-red-500 bg-red-500' 
//                           : 'border-gray-300'
//                         }
//                       `}>
//                         {selectedProject?._id === project._id && (
//                           <div className="w-1.5 h-1.5 bg-white rounded-full" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium">{project.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           Location: {project.location}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleCancelAll}
//               disabled={!selectedProject || projectLoading}
//             >
//               {projectLoading ? "Cancelling..." : "Cancel All Bookings"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Confirmation Alert Dialog */}
//       <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-red-600">
//               <AlertCircle className="h-5 w-5" />
//               Confirm Cancellation
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-2">
//               <p>
//                 You are about to cancel <strong>ALL</strong> bookings for the project:
//               </p>
//               <p className="font-semibold text-foreground">
//                 {selectedProject?.name}
//               </p>
//               <p className="text-sm text-red-600 font-medium">
//                 This action cannot be undone. All bookings will be permanently cancelled.
//               </p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction 
//               onClick={handleConfirmCancelAll}
//               className="bg-red-600 hover:bg-red-700 text-white font-medium"
//             >
//               Yes, Cancel All Bookings
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }












// // src/pages/Bookings.jsx
// import React, { useState, useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Plus, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight, 
//   AlertCircle,
//   Building2,
//   X // 🆕 NEW: X icon for clearing search
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookingCard } from "@/components/booking/BookingCard";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { useNavigate } from "react-router-dom";
// import { BookingFormDialog } from "@/components/booking/BookingFormDialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useProject } from "@/hooks/useProject";
// import { projectApi } from "@/api/projectApi";
// import { toast } from "sonner";

// export default function Bookings() {
//   const { current } = useAuthStore();
//   const canCreate = canMutate(current?.role, "booking");
//   const navigate = useNavigate();

//   const {
//     bookings,
//     fetchBookings,
//     loading,
//     pagination,
//     softDeleteBooking,
//     updateBooking,
//   } = useBooking();

//   const {
//     cancelAllBookings,
//     loading: projectLoading,
//   } = useProject();

//   // Core filter states
//   const [searchInput, setSearchInput] = useState(""); // 🆕 NEW: Immediate input state
//   const [search, setSearch] = useState(""); // 🆕 NEW: Debounced state for API
//   const [statusFilter, setStatusFilter] = useState("booked");
//   const [formOpen, setFormOpen] = useState(false);
//   const [editBookingData, setEditBookingData] = useState(null);

//   // Project Dropdown states
//   const [filterProjects, setFilterProjects] = useState([]);
//   const [projectName, setProjectName] = useState("");

//   // Cancel All Bookings states
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [projectList, setProjectList] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   // 🆕 NEW: Debounce Effect (waits 500ms before updating the actual search state)
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setSearch(searchInput);
//     }, 500);

//     // Cleanup timeout if user types again before 500ms
//     return () => clearTimeout(handler);
//   }, [searchInput]);

//   // Load projects on mount and set the default selected project
//   useEffect(() => {
//     const loadProjectsForFilter = async () => {
//       try {
//         const res = await projectApi.getAll({ page: 1, limit: 100 });
//         const projectsData = res.data?.data?.projects || [];
//         setFilterProjects(projectsData);
        
//         // Auto-select the first project if available
//         if (projectsData.length > 0) {
//           setProjectName(projectsData[0].name);
//         }
//       } catch (err) {
//         toast.error("Failed to load projects for filter");
//       }
//     };

//     loadProjectsForFilter();
//   }, []);

//   // Helper object now includes projectName
//   const fetchParams = {
//     page: currentPage,
//     limit: 12,
//     search: search || undefined, // using debounced search value here
//     projectName: projectName || undefined,
//     status: statusFilter,
//     approvalStatus: "approved", 
//   };

//   // Reset page to 1 when any filter changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, projectName, statusFilter]);

//   // Fetch bookings ONLY when a projectName is set
//   useEffect(() => {
//     if (projectName) {
//       fetchBookings(fetchParams);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage, search, projectName, statusFilter]); 

//   // Fetch projects when cancel dialog opens
//   const handleOpenCancelDialog = async () => {
//     setCancelDialogOpen(true);
//     setLoadingProjects(true);
//     try {
//       const res = await projectApi.getAll({ page: 1, limit: 100 });
//       const data = res.data?.data;
      
//       if (res.data?.success) {
//         const projectsWithBookings = data?.projects?.filter(
//           (project) => project.bookedFlats > 0 || project.totalFlats > 0
//         ) || [];
//         setProjectList(projectsWithBookings);
//         setSelectedProject(null);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load projects");
//     } finally {
//       setLoadingProjects(false);
//     }
//   };

//   const handleSelectProject = (project) => {
//     setSelectedProject(project);
//   };

//   const handleCancelAll = async () => {
//     if (!selectedProject) {
//       toast.error("Please select a project");
//       return;
//     }

//     setShowConfirmDialog(true);
//   };

//   const handleConfirmCancelAll = async () => {
//     if (!selectedProject) return;

//     try {
//       const success = await cancelAllBookings(selectedProject._id);

//       if (success) {
//         setCancelDialogOpen(false);
//         setShowConfirmDialog(false);
//         setSelectedProject(null);
//         await fetchBookings(fetchParams);
//       }
//     } catch (err) {
//       toast.error("Failed to cancel all bookings");
//     }
//   };

//   const handleView = (id) => navigate(`/bookings/${id}`);

//   const handleEdit = (booking) => {
//     setEditBookingData(booking);
//     setFormOpen(true);
//   };

//   const handleDelete = async (booking) => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete booking ${booking.bookingReferenceNumber}?`,
//       )
//     )
//       return;
//     const success = await softDeleteBooking(booking._id);
//     if (success) fetchBookings(fetchParams);
//   };

//   const handleFormSuccess = () => {
//     setFormOpen(false);
//     setEditBookingData(null);
//     fetchBookings(fetchParams);
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Real Estate"
//         title="Bookings"
//         description="Manage all flat/unit bookings across projects."
//         actions={
//           <div className="flex gap-2">
//             {canCreate && (
//               <>
//                 <Button
//                   variant="outline"
//                   onClick={handleOpenCancelDialog}
//                   className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
//                 >
//                   <AlertCircle className="h-4 w-4 mr-2" />
//                   Cancel All Bookings
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     setEditBookingData(null);
//                     setFormOpen(true);
//                   }}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> New Booking
//                 </Button>
//               </>
//             )}
//           </div>
//         }
//       />
//       <div className="flex flex-col sm:flex-row gap-3 justify-between">
//         <Tabs value={statusFilter} onValueChange={setStatusFilter}>
//           <TabsList>
//             <TabsTrigger value="booked">Booked</TabsTrigger>
//             <TabsTrigger value="sold">Sold</TabsTrigger>
//             <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
//           </TabsList>
//         </Tabs>
        
//         {/* Filter Group Container */}
//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          
//           {/* Project Select Dropdown */}
//           <Select 
//             value={projectName} 
//             onValueChange={(val) => setProjectName(val)}
//             disabled={filterProjects.length === 0}
//           >
//             <SelectTrigger className="w-full sm:w-56 bg-background">
//               <SelectValue placeholder="Select Project" />
//             </SelectTrigger>
//             <SelectContent>
//               {filterProjects.map((project) => (
//                 <SelectItem key={project._id} value={project.name}>
//                   {project.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* 🔄 UPDATE: Search Input with clear icon */}
//           <div className="relative">
//             <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               className="pl-8 pr-8 w-full sm:w-64 bg-background"
//               placeholder="Search by unit/ref..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//             {searchInput && (
//               <button
//                 type="button"
//                 onClick={() => setSearchInput("")}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                 aria-label="Clear search"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[...Array(6)].map((_, i) => (
//             <Skeleton key={i} className="h-40" />
//           ))}
//         </div>
//       ) : bookings.length === 0 ? (
//         <EmptyState
//           title="No bookings"
//           description="Create a new booking to get started or try a different filter."
//         />
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {bookings.map((b) => (
//               <BookingCard
//                 key={b._id}
//                 booking={b}
//                 onClick={handleView}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </div>

//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing page <span className="font-medium">{pagination.page}</span> of{" "}
//                 <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} bookings)
//               </div>

//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-2"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
//                   {[...Array(pagination.pages)].map((_, index) => {
//                     const pageNumber = index + 1;

//                     if (
//                       pagination.pages <= 7 ||
//                       pageNumber === 1 ||
//                       pageNumber === pagination.pages ||
//                       (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
//                     ) {
//                       return (
//                         <Button
//                           key={pageNumber}
//                           variant={currentPage === pageNumber ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setCurrentPage(pageNumber)}
//                           className={`w-8 h-8 p-0 ${currentPage === pageNumber ? "" : "text-muted-foreground"}`}
//                         >
//                           {pageNumber}
//                         </Button>
//                       );
//                     }

//                     if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
//                       return <span key={pageNumber} className="px-1 text-muted-foreground">...</span>;
//                     }

//                     return null;
//                   })}
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
//                   disabled={currentPage === pagination.pages}
//                   className="px-2"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       <BookingFormDialog
//         open={formOpen}
//         onOpenChange={(open) => {
//           setFormOpen(open);
//           if (!open) setEditBookingData(null);
//         }}
//         editBooking={editBookingData}
//         onSuccess={handleFormSuccess}
//       />

//       {/* Cancel All Bookings - Project Selection Dialog */}
//       <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[80vh]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               Cancel All Bookings
//             </DialogTitle>
//             <DialogDescription>
//               Select a project to cancel all its bookings. This action will cancel all pending and confirmed bookings for the selected project.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 my-4">
//             {loadingProjects ? (
//               <div className="space-y-2">
//                 <Skeleton className="h-12 w-full" />
//                 <Skeleton className="h-12 w-full" />
//                 <Skeleton className="h-12 w-full" />
//               </div>
//             ) : projectList.length === 0 ? (
//               <div className="text-center py-8">
//                 <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//                 <p className="text-muted-foreground">No projects with bookings found</p>
//               </div>
//             ) : (
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {projectList.map((project) => (
//                   <div
//                     key={project._id}
//                     className={`
//                       flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
//                       ${selectedProject?._id === project._id 
//                         ? 'border-red-500 bg-red-50' 
//                         : 'hover:border-gray-300 hover:bg-gray-50'
//                       }
//                     `}
//                     onClick={() => handleSelectProject(project)}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`
//                         w-5 h-5 rounded-full border-2 flex items-center justify-center
//                         ${selectedProject?._id === project._id 
//                           ? 'border-red-500 bg-red-500' 
//                           : 'border-gray-300'
//                         }
//                       `}>
//                         {selectedProject?._id === project._id && (
//                           <div className="w-1.5 h-1.5 bg-white rounded-full" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium">{project.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           Location: {project.location}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleCancelAll}
//               disabled={!selectedProject || projectLoading}
//             >
//               {projectLoading ? "Cancelling..." : "Cancel All Bookings"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Confirmation Alert Dialog */}
//       <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-red-600">
//               <AlertCircle className="h-5 w-5" />
//               Confirm Cancellation
//             </AlertDialogTitle>
//             <AlertDialogDescription className="space-y-2">
//               <p>
//                 You are about to cancel <strong>ALL</strong> bookings for the project:
//               </p>
//               <p className="font-semibold text-foreground">
//                 {selectedProject?.name}
//               </p>
//               <p className="text-sm text-red-600 font-medium">
//                 This action cannot be undone. All bookings will be permanently cancelled.
//               </p>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction 
//               onClick={handleConfirmCancelAll}
//               className="bg-red-600 hover:bg-red-700 text-white font-medium"
//             >
//               Yes, Cancel All Bookings
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }












// src/pages/Bookings.jsx
import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Building2,
  X 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingCard } from "@/components/booking/BookingCard";
import { useBooking } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { useNavigate } from "react-router-dom";
import { BookingFormDialog } from "@/components/booking/BookingFormDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/hooks/useProject";
import { projectApi } from "@/api/projectApi";
import { toast } from "sonner";

export default function Bookings() {
  const { current } = useAuthStore();
  const canCreate = canMutate(current?.role, "booking");
  const navigate = useNavigate();

  const {
    bookings,
    fetchBookings,
    loading,
    pagination,
    softDeleteBooking,
    updateBooking,
  } = useBooking();

  const {
    cancelAllBookings,
    loading: projectLoading,
  } = useProject();

  // Core filter states
  const [searchInput, setSearchInput] = useState(""); 
  const [search, setSearch] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("booked");
  const [formOpen, setFormOpen] = useState(false);
  const [editBookingData, setEditBookingData] = useState(null);

  // Project Dropdown states
  const [filterProjects, setFilterProjects] = useState([]);
  const [projectName, setProjectName] = useState("");

  // Cancel All Bookings states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Debounce Effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Load projects on mount
  useEffect(() => {
    const loadProjectsForFilter = async () => {
      try {
        const res = await projectApi.getAll({ page: 1, limit: 100 });
        const projectsData = res.data?.data?.projects || [];
        setFilterProjects(projectsData);
        
        if (projectsData.length > 0) {
          setProjectName(projectsData[0].name);
        }
      } catch (err) {
        toast.error("Failed to load projects for filter");
      }
    };

    loadProjectsForFilter();
  }, []);

  const fetchParams = {
    page: currentPage,
    limit: 12,
    search: search || undefined, 
    projectName: projectName || undefined,
    status: statusFilter,
    approvalStatus: "approved", 
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, projectName, statusFilter]);

  useEffect(() => {
    if (projectName) {
      fetchBookings(fetchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, projectName, statusFilter]); 

  const handleOpenCancelDialog = async () => {
    setCancelDialogOpen(true);
    setLoadingProjects(true);
    try {
      const res = await projectApi.getAll({ page: 1, limit: 100 });
      const data = res.data?.data;
      
      if (res.data?.success) {
        const projectsWithBookings = data?.projects?.filter(
          (project) => project.bookedFlats > 0 || project.totalFlats > 0
        ) || [];
        setProjectList(projectsWithBookings);
        setSelectedProject(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleCancelAll = async () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmCancelAll = async () => {
    if (!selectedProject) return;

    try {
      const success = await cancelAllBookings(selectedProject._id);
      if (success) {
        setCancelDialogOpen(false);
        setShowConfirmDialog(false);
        setSelectedProject(null);
        await fetchBookings(fetchParams);
      }
    } catch (err) {
      toast.error("Failed to cancel all bookings");
    }
  };

  const handleView = (id) => navigate(`/bookings/${id}`);

  const handleEdit = (booking) => {
    setEditBookingData(booking);
    setFormOpen(true);
  };

  const handleDelete = async (booking) => {
    if (
      !window.confirm(
        `Are you sure you want to delete booking ${booking.bookingReferenceNumber}?`,
      )
    )
      return;
    const success = await softDeleteBooking(booking._id);
    if (success) fetchBookings(fetchParams);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditBookingData(null);
    fetchBookings(fetchParams);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Real Estate"
        title="Bookings"
        description="Manage all flat/unit bookings across projects."
        actions={
          <div className="flex gap-2">
            {canCreate && (
              <>
                <Button
                  variant="outline"
                  onClick={handleOpenCancelDialog}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Cancel All Bookings
                </Button>
                <Button
                  onClick={() => {
                    setEditBookingData(null);
                    setFormOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> New Booking
                </Button>
              </>
            )}
          </div>
        }
      />
      <div className="flex flex-col xl:flex-row gap-3 justify-between items-start xl:items-center">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full xl:w-auto">
          <TabsList>
            <TabsTrigger value="booked">Booked</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Filter Group Container */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          
          {/* Project Select Dropdown */}
          <Select 
            value={projectName} 
            onValueChange={(val) => setProjectName(val)}
            disabled={filterProjects.length === 0}
          >
            <SelectTrigger className="w-full sm:w-56 bg-background">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {filterProjects.map((project) => (
                <SelectItem key={project._id} value={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 🔄 UPDATE: Expanded Search Input with clear icon & new placeholder */}
          <div className="relative w-full sm:w-80 lg:w-96">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 pr-8 w-full bg-background"
              placeholder="Search name, email, phone, flat..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings"
          description="Create a new booking to get started or try a different filter."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookings.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                onClick={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing page <span className="font-medium">{pagination.page}</span> of{" "}
                <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} bookings)
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                  {[...Array(pagination.pages)].map((_, index) => {
                    const pageNumber = index + 1;

                    if (
                      pagination.pages <= 7 ||
                      pageNumber === 1 ||
                      pageNumber === pagination.pages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-8 h-8 p-0 ${currentPage === pageNumber ? "" : "text-muted-foreground"}`}
                        >
                          {pageNumber}
                        </Button>
                      );
                    }

                    if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return <span key={pageNumber} className="px-1 text-muted-foreground">...</span>;
                    }

                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
                  disabled={currentPage === pagination.pages}
                  className="px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <BookingFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditBookingData(null);
        }}
        editBooking={editBookingData}
        onSuccess={handleFormSuccess}
      />

      {/* Cancel All Bookings - Project Selection Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Cancel All Bookings
            </DialogTitle>
            <DialogDescription>
              Select a project to cancel all its bookings. This action will cancel all pending and confirmed bookings for the selected project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {loadingProjects ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : projectList.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No projects with bookings found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {projectList.map((project) => (
                  <div
                    key={project._id}
                    className={`
                      flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
                      ${selectedProject?._id === project._id 
                        ? 'border-red-500 bg-red-50' 
                        : 'hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${selectedProject?._id === project._id 
                          ? 'border-red-500 bg-red-500' 
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedProject?._id === project._id && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Location: {project.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAll}
              disabled={!selectedProject || projectLoading}
            >
              {projectLoading ? "Cancelling..." : "Cancel All Bookings"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Cancellation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                You are about to cancel <strong>ALL</strong> bookings for the project:
              </p>
              <p className="font-semibold text-foreground">
                {selectedProject?.name}
              </p>
              <p className="text-sm text-red-600 font-medium">
                This action cannot be undone. All bookings will be permanently cancelled.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancelAll}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Yes, Cancel All Bookings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}