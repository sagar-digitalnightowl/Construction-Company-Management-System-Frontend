// // src/pages/booking/Bookings.jsx
// import React, { useState, useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookingCard } from "@/components/booking/BookingCard";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { useNavigate } from "react-router-dom";
// import { BookingFormDialog } from "@/components/booking/BookingFormDialog";

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
  
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [formOpen, setFormOpen] = useState(false);
//   const [editBookingData, setEditBookingData] = useState(null);
  
//   // 1. Pagination ke liye current page ki state
//   const [currentPage, setCurrentPage] = useState(1);

//   // 2. Jab bhi search ya filter change ho, page wapas 1 par reset kar do
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter]);

//   // 3. Data fetch karte waqt dynamic 'currentPage' bhejna hai
//   useEffect(() => {
//     fetchBookings({
//       page: currentPage,
//       limit: 12,
//       search: search || undefined,
//       status: statusFilter === "all" ? undefined : statusFilter,
//     });
//   }, [currentPage, search, statusFilter]);

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

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Real Estate"
//         title="Bookings"
//         description="Manage all flat/unit bookings across projects."
//         actions={
//           canCreate && (
//             <Button
//               onClick={() => {
//                 setEditBookingData(null);
//                 setFormOpen(true);
//               }}
//             >
//               <Plus className="h-4 w-4 mr-2" /> New Booking
//             </Button>
//           )
//         }
//       />
//       <div className="flex flex-col sm:flex-row gap-3 justify-between">
//         <Tabs value={statusFilter} onValueChange={setStatusFilter}>
//           <TabsList>
//             <TabsTrigger value="all">All</TabsTrigger>
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

//           {/* 4. Complete Pagination UI with Numbers */}
//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing page <span className="font-medium">{pagination.page}</span> of{" "}
//                 <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} bookings)
//               </div>
              
//               <div className="flex items-center gap-1">
//                 {/* Previous Button */}
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-2"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 {/* Page Numbers */}
//                 <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
//                   {[...Array(pagination.pages)].map((_, index) => {
//                     const pageNumber = index + 1;
                    
//                     // Logic to show limited pages with ellipsis (...)
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

//                 {/* Next Button */}
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
//     </div>
//   );
// }





// // src/pages/booking/Bookings.jsx
// import React, { useState, useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookingCard } from "@/components/booking/BookingCard";
// import { useBooking } from "@/hooks/useBooking";
// import { useAuthStore } from "@/store/authStore";
// import { canMutate } from "@/data/permissions";
// import { useNavigate } from "react-router-dom";
// import { BookingFormDialog } from "@/components/booking/BookingFormDialog";

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
  
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [formOpen, setFormOpen] = useState(false);
//   const [editBookingData, setEditBookingData] = useState(null);
  
//   // 1. Pagination ke liye current page ki state
//   const [currentPage, setCurrentPage] = useState(1);

//   // 2. Jab bhi search ya filter change ho, page wapas 1 par reset kar do
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter]);

//   // 3. Data fetch karte waqt dynamic 'currentPage' bhejna hai
//   useEffect(() => {
//     fetchBookings({
//       page: currentPage,
//       limit: 12,
//       search: search || undefined,
//       status: statusFilter === "all" ? undefined : statusFilter,
//     });
//   }, [currentPage, search, statusFilter]);

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

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Real Estate"
//         title="Bookings"
//         description="Manage all flat/unit bookings across projects."
//         actions={
//           canCreate && (
//             <Button
//               onClick={() => {
//                 setEditBookingData(null);
//                 setFormOpen(true);
//               }}
//             >
//               <Plus className="h-4 w-4 mr-2" /> New Booking
//             </Button>
//           )
//         }
//       />
//       <div className="flex flex-col sm:flex-row gap-3 justify-between">
//         <Tabs value={statusFilter} onValueChange={setStatusFilter}>
//           <TabsList>
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="booked">Booked</TabsTrigger>
//             <TabsTrigger value="sold">Sold</TabsTrigger>
//             <TabsTrigger value="on_hold">On Hold</TabsTrigger> {/* Naya Filter */}
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

//           {/* 4. Complete Pagination UI with Numbers */}
//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing page <span className="font-medium">{pagination.page}</span> of{" "}
//                 <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} bookings)
//               </div>
              
//               <div className="flex items-center gap-1">
//                 {/* Previous Button */}
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-2"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 {/* Page Numbers */}
//                 <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
//                   {[...Array(pagination.pages)].map((_, index) => {
//                     const pageNumber = index + 1;
                    
//                     // Logic to show limited pages with ellipsis (...)
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

//                 {/* Next Button */}
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
//     </div>
//   );
// }


// src/pages/booking/Bookings.jsx

import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingCard } from "@/components/booking/BookingCard";
import { useBooking } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { useNavigate } from "react-router-dom";
import { BookingFormDialog } from "@/components/booking/BookingFormDialog";

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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editBookingData, setEditBookingData] = useState(null);

  // 1. Pagination ke liye current page ki state
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Jab bhi search ya filter change ho, page wapas 1 par reset kar do
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // 3. Data fetch karte waqt dynamic 'currentPage' bhejna hai
  useEffect(() => {
    fetchBookings({
      page: currentPage,
      limit: 12,
      search: search || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
    });
  }, [currentPage, search, statusFilter]);

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
    if (success) fetchBookings();
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditBookingData(null);
    fetchBookings();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Real Estate"
        title="Bookings"
        description="Manage all flat/unit bookings across projects."
        actions={
          canCreate && (
            <Button
              onClick={() => {
                setEditBookingData(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> New Booking
            </Button>
          )
        }
      />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger> {/* Pehle Sold */}
            <TabsTrigger value="booked">Booked</TabsTrigger> {/* Phir Booked */}
            <TabsTrigger value="on_hold">On Hold</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            className="pl-7 w-64"
            placeholder="Search by unit/ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
          description="Create a new booking to get started."
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

          {/* 4. Complete Pagination UI with Numbers */}
          {pagination && pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing page <span className="font-medium">{pagination.page}</span> of{" "}
                <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} bookings)
              </div>

              <div className="flex items-center gap-1">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
                  {[...Array(pagination.pages)].map((_, index) => {
                    const pageNumber = index + 1;

                    // Logic to show limited pages with ellipsis (...)
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

                {/* Next Button */}
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
    </div>
  );
}