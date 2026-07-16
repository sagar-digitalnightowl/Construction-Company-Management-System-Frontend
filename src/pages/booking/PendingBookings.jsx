// // src/pages/booking/PendingBookings.jsx
// import React, { useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useBooking } from "@/hooks/useBooking";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Check, X } from "lucide-react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// export default function PendingBookings() {
//   const navigate = useNavigate();
//   const {
//     pendingBookings,
//     fetchPendingBookings,
//     approveBooking,
//     rejectBooking,
//     loading,
//   } = useBooking();

//   useEffect(() => {
//     fetchPendingBookings();
//   }, []);

//   const handleApprove = async (id) => {
//     await approveBooking(id, { notes: "Approved by admin" });
//     await fetchPendingBookings();
//   };

//   const handleReject = async (id) => {
//     const reason = prompt("Rejection reason:");
//     if (reason) {
//       await rejectBooking(id, { reason });
//       await fetchPendingBookings();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-8 w-48" />
//         <Skeleton className="h-32" />
//         <Skeleton className="h-32" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Approvals"
//         title="Pending Booking Requests"
//         description="Review and approve/reject buyer booking requests."
//       />
//       {pendingBookings.length === 0 ? (
//         <EmptyState
//           title="No pending requests"
//           description="All booking requests have been processed."
//         />
//       ) : (
//         <div className="space-y-3">
//           {pendingBookings.map((b) => (
//             <Card key={b._id} className="cursor-pointer" onClick={() =>  navigate(`/bookings/${b._id}`)}>
//               <CardContent className="p-4 flex flex-wrap justify-between items-center gap-3">
//                 <div>
//                   <p className="font-medium">
//                     {b.unitNumber} - {b.projectId?.name}
//                   </p>
//                   <p className="text-sm">Buyer: {b.clientId?.name}</p>
//                   <p className="text-xs text-muted-foreground">
//                     Booking Ref: {b.bookingReferenceNumber}
//                   </p>
//                   <p className="text-xs">
//                     Advance Paid: {formatINR(b.advancePaid)} | Booked:{" "}
//                     {formatDate(b.createdAt)}
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="default"
//                     onClick={(e) =>{
//                       e.stopPropagation()
//                       handleApprove(b._id)
//                     } 
//                     }
//                   >
//                     <Check className="h-3 w-3 mr-1" /> Approve
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleReject(b._id)
//                     }}
//                   >
//                     <X className="h-3 w-3 mr-1" /> Reject
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useBooking } from "@/hooks/useBooking";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// export default function PendingBookings() {
//   const navigate = useNavigate();
//   const {
//     pendingBookings,
//     fetchPendingBookings,
//     approveBooking,
//     rejectBooking,
//     loading,
//     pagination, // 1. Pagination yahan destructure kiya
//   } = useBooking();

//   // 2. Current page state add ki
//   const [currentPage, setCurrentPage] = useState(1);

//   // 3. fetchPendingBookings mein page params bheje
//   useEffect(() => {
//     fetchPendingBookings({ page: currentPage, limit: 10 });
//   }, [currentPage]);

//   const handleApprove = async (id) => {
//     await approveBooking(id, { notes: "Approved by admin" });
//     await fetchPendingBookings({ page: currentPage, limit: 10 }); // Page maintain rakha
//   };

//   const handleReject = async (id) => {
//     const reason = prompt("Rejection reason:");
//     if (reason) {
//       await rejectBooking(id, { reason });
//       await fetchPendingBookings({ page: currentPage, limit: 10 }); // Page maintain rakha
//     }
//   };

//   if (loading && pendingBookings.length === 0) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-8 w-48" />
//         <Skeleton className="h-32" />
//         <Skeleton className="h-32" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Approvals"
//         title="Pending Booking Requests"
//         description="Review and approve/reject buyer booking requests."
//       />
      
//       {pendingBookings.length === 0 ? (
//         <EmptyState
//           title="No pending requests"
//           description="All booking requests have been processed."
//         />
//       ) : (
//         <>
//           <div className="space-y-3">
//             {pendingBookings.map((b) => (
//               <Card key={b._id} className="cursor-pointer" onClick={() => navigate(`/bookings/${b._id}`)}>
//                 <CardContent className="p-4 flex flex-wrap justify-between items-center gap-3">
//                   <div>
//                     <p className="font-medium">
//                       {b.unitNumber} - {b.projectId?.name}
//                     </p>
//                     <p className="text-sm">Buyer: {b.clientId?.name}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Booking Ref: {b.bookingReferenceNumber}
//                     </p>
//                     <p className="text-xs">
//                       Advance Paid: {formatINR(b.advancePaid)} | Booked:{" "}
//                       {formatDate(b.createdAt)}
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="default"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleApprove(b._id);
//                       }}
//                     >
//                       <Check className="h-3 w-3 mr-1" /> Approve
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleReject(b._id);
//                       }}
//                     >
//                       <X className="h-3 w-3 mr-1" /> Reject
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* 4. Pagination UI Add Kiya */}
//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing page <span className="font-medium">{pagination.page}</span> of{" "}
//                 <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} requests)
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
//     </div>
//   );
// }




// // src/pages/PendingBookings.jsx
// import React, { useState, useEffect } from "react";
// import { PageHeader, EmptyState } from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useBooking } from "@/hooks/useBooking";
// import { formatINR, formatDate } from "@/lib/helpers";
// import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// export default function PendingBookings() {
//   const navigate = useNavigate();
  
//   // 1. fetchPendingBookings ki jagah fetchBookings aur bookings use kar rahe hain
//   const {
//     bookings,
//     fetchBookings,
//     approveBooking,
//     rejectBooking,
//     loading,
//     pagination,
//   } = useBooking();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("pending"); // Naya state tab filter ke liye

//   // Helper object API parameters ke liye
//   const fetchParams = {
//     page: currentPage,
//     limit: 10,
//     approvalStatus: statusFilter, // "pending" ya "rejected"
//   };

//   // Jab filter change ho toh page 1 par reset karo
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [statusFilter]);

//   // 2. Main API call with dynamic filter
//   useEffect(() => {
//     fetchBookings(fetchParams);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage, statusFilter]);

//   const handleApprove = async (id) => {
//     await approveBooking(id, { notes: "Approved by admin" });
//     await fetchBookings(fetchParams); // Action ke baad current filter aur page refresh
//   };

//   const handleReject = async (id) => {
//     const reason = prompt("Rejection reason:");
//     if (reason) {
//       await rejectBooking(id, { reason });
//       await fetchBookings(fetchParams); // Action ke baad current filter aur page refresh
//     }
//   };

//   if (loading && bookings.length === 0) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-8 w-48" />
//         <Skeleton className="h-32" />
//         <Skeleton className="h-32" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         eyebrow="Approvals"
//         title="Booking Approvals"
//         description="Review and manage pending or rejected buyer booking requests."
//       />
      
//       {/* 3. Filter Tabs */}
//       <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
//         <TabsList>
//           <TabsTrigger value="pending">Pending</TabsTrigger>
//           <TabsTrigger value="rejected">Rejected</TabsTrigger>
//         </TabsList>
//       </Tabs>

//       {bookings.length === 0 ? (
//         <EmptyState
//           title={`No ${statusFilter} requests`}
//           description={`All booking requests for ${statusFilter} status have been processed.`}
//         />
//       ) : (
//         <>
//           <div className="space-y-3">
//             {bookings.map((b) => (
//               <Card key={b._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/bookings/${b._id}`)}>
//                 <CardContent className="p-4 flex flex-wrap justify-between items-center gap-3">
//                   <div>
//                     <p className="font-medium">
//                       {b.unitNumber} - {b.projectId?.name}
//                     </p>
//                     <p className="text-sm">Buyer: {b.clientId?.name}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Booking Ref: {b.bookingReferenceNumber}
//                     </p>
//                     <p className="text-xs">
//                       Advance Paid: {formatINR(b.advancePaid)} | Booked:{" "}
//                       {formatDate(b.createdAt)}
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="default"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleApprove(b._id);
//                       }}
//                     >
//                       <Check className="h-3 w-3 mr-1" /> Approve
//                     </Button>
//                     {/* Sirf pending tab mein reject button dikhana better hai, par agar reject wali ko wapas reject karna allow nahi karna toh conditional rendering kar sakte ho. Abhi dono mein dikhega. */}
//                     {statusFilter === "pending" && (
//                       <Button
//                         size="sm"
//                         variant="destructive"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleReject(b._id);
//                         }}
//                       >
//                         <X className="h-3 w-3 mr-1" /> Reject
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Pagination UI */}
//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing page <span className="font-medium">{pagination.page}</span> of{" "}
//                 <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} requests)
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
//     </div>
//   );
// }




// src/pages/PendingBookings.jsx
import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBooking } from "@/hooks/useBooking";
import { formatINR, formatDate } from "@/lib/helpers";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function PendingBookings() {
  const navigate = useNavigate();
  
  const {
    bookings,
    fetchBookings,
    approveBooking,
    rejectBooking,
    loading,
    pagination,
  } = useBooking();

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");

  const fetchParams = {
    page: currentPage,
    limit: 10,
    approvalStatus: statusFilter,
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchBookings(fetchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const handleApprove = async (id) => {
    await approveBooking(id, { notes: "Approved by admin" });
    await fetchBookings(fetchParams);
  };

  const handleReject = async (id) => {
    const reason = prompt("Rejection reason:");
    if (reason) {
      await rejectBooking(id, { reason });
      await fetchBookings(fetchParams);
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Approvals"
        title="Booking Approvals"
        description="Review and manage pending or rejected buyer booking requests."
      />
      
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {bookings.length === 0 ? (
        <EmptyState
          title={`No ${statusFilter} requests`}
          description={`All booking requests for ${statusFilter} status have been processed.`}
        />
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map((b) => (
              <Card key={b._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/bookings/${b._id}`)}>
                <CardContent className="p-4 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <p className="font-medium">
                      {b.unitNumber} - {b.projectId?.name}
                    </p>
                    <p className="text-sm">Buyer: {b.clientId?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Booking Ref: {b.bookingReferenceNumber}
                    </p>
                    <p className="text-xs">
                      Advance Paid: {formatINR(b.advancePaid)} | Booked:{" "}
                      {formatDate(b.createdAt)}
                    </p>
                  </div>
                  
                  {/* Approve aur Reject dono buttons sirf Pending tab me dikhenge */}
                  {statusFilter === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(b._id);
                        }}
                      >
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(b._id);
                        }}
                      >
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                  {/* Rejected tab ke liye koi action field/badge nahi hai */}
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 mt-4 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing page <span className="font-medium">{pagination.page}</span> of{" "}
                <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} requests)
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
    </div>
  );
}