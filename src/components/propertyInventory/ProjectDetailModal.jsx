
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/helpers";
import { Building2, BookOpen, FileText, Search, Eye, CreditCard, User, IndianRupee, Calendar, BarChart2 } from "lucide-react";

// ✅ Comprehensive logic checking all 3 status fields
const getEffectiveFlatStatus = (flat) => {
  const flatStatus = (flat.flatStatus || flat.status || "").toLowerCase();
  const bookingStatus = (flat.bookingStatus || flat.booking?.status || "").toLowerCase();
  const approvalStatus = (flat.approvalStatus || flat.booking?.approvalStatus || "").toLowerCase();

  // 1. If explicitly cancelled or rejected
  if (
    flatStatus === "cancelled" || 
    bookingStatus === "cancelled" || 
    bookingStatus === "rejected" || 
    approvalStatus === "rejected"
  ) {
    return "available";
  }

  const hasBookingIntention = 
    flatStatus === "booked" || flatStatus === "sold" || 
    bookingStatus === "booked" || bookingStatus === "sold";

  // 2. Booking confirmed AND approved
  if (hasBookingIntention && approvalStatus === "approved") {
    return "sold";
  }

  // 3. Booking initiated but waiting for approval
  if ((hasBookingIntention || bookingStatus || flatStatus === "pending") && approvalStatus !== "approved") {
    return "pending";
  }

  // 4. Default Fallback
  return "available";
};

// ✅ Includes 'pending' warning badge
const StatusBadge = ({ status }) => {
  const variant =
    status === "available"
      ? "success"
      : status === "pending"
      ? "warning"
      : status === "sold" || status === "booked"
      ? "secondary"
      : "outline";
      
  const displayLabel = status === "pending" ? "Pending Approval" : status;

  return <Badge variant={variant} className="capitalize">{displayLabel}</Badge>;
};

export default function ProjectDetailModal({
  open,
  onOpenChange,
  project,
  bookings,
  bookingsPagination,
  onBookingPageChange,
  agreements,
  siteEngineers,
  loading,
  onViewPayments,
  bookingSearch,
  setBookingSearch,
  onBookingSearch,
}) {
  const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [selectedFlat, setSelectedFlat] = useState(null);
  
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const towers = project?.towers || [];
  const selectedTower = towers[selectedTowerIdx] || null;
  const floors = selectedTower?.floors || [];
  const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
  const currentFloor = floors[safeFloorIdx] || null;
  const currentFlats = currentFloor?.flats || [];

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6" />
            {project.name} – Inventory Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="towers" className="mt-2">
          <TabsList className="mb-4">
            <TabsTrigger value="towers">
              <Building2 className="h-4 w-4 mr-2" /> Towers & Flats
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <BookOpen className="h-4 w-4 mr-2" /> Bookings
            </TabsTrigger>
          </TabsList>

          {/* ==================== TOWERS & FLATS TAB ==================== */}
          <TabsContent value="towers">
            {towers.length > 0 ? (
              <div className="space-y-6">
                
                {/* Tower selection & Stats */}
                <div className="bg-muted/10 border rounded-xl p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Select Tower
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {towers.map((tower, idx) => (
                          <Button
                            key={tower.towerName}
                            variant={idx === selectedTowerIdx ? "default" : "outline"}
                            size="sm"
                            className="rounded-lg shadow-sm"
                            onClick={() => {
                              setSelectedTowerIdx(idx);
                              setSelectedFloorIdx(0);
                            }}
                          >
                            {tower.towerName}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* ✅ Tower Inventory Stats (Available & Booked Only) */}
                    {selectedTower && (
                      <div className="flex gap-3 flex-wrap">
                        <div className="bg-green-50/50 border border-green-200 dark:border-green-900/50 dark:bg-green-900/10 rounded-lg px-4 py-2 min-w-[100px] shadow-sm">
                          <p className="text-[10px] text-green-600 dark:text-green-500 uppercase font-bold tracking-wider mb-1">Available</p>
                          <p className="text-xl font-extrabold text-green-700 dark:text-green-400">{selectedTower.availableFlats || 0}</p>
                        </div>
                        <div className="bg-amber-50/50 border border-amber-200 dark:border-amber-900/50 dark:bg-amber-900/10 rounded-lg px-4 py-2 min-w-[100px] shadow-sm">
                          <p className="text-[10px] text-amber-600 dark:text-amber-500 uppercase font-bold tracking-wider mb-1">Booked</p>
                          <p className="text-xl font-extrabold text-amber-700 dark:text-amber-400">{selectedTower.bookedFlats || 0}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floor selection */}
                {selectedTower && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Select Floor</h4>
                    <div className="flex gap-2 flex-wrap">
                      {floors.map((floor, idx) => (
                        <Button
                          key={floor.floorNumber}
                          variant={idx === safeFloorIdx ? "secondary" : "ghost"}
                          size="sm"
                          className={`border ${idx === safeFloorIdx ? 'border-primary/20 bg-primary/10 hover:bg-primary/20' : 'border-transparent'}`}
                          onClick={() => setSelectedFloorIdx(idx)}
                        >
                          Floor {floor.floorNumber}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flats grid */}
                {currentFlats.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      {selectedTower.towerName} <span className="text-muted-foreground">/</span> Floor {currentFloor.floorNumber}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {currentFlats.map((flat) => {
                        const effectiveStatus = getEffectiveFlatStatus(flat);
                        const isSold = effectiveStatus === "sold";
                        const isPending = effectiveStatus === "pending";

                        return (
                          <div
                            key={flat.flatNumber}
                            className={`border rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-sm transition-all ${
                              isSold ? "bg-blue-50/50 border-blue-200 shadow-sm dark:bg-blue-900/20 dark:border-blue-800" : 
                              isPending ? "bg-amber-50/50 border-amber-200 shadow-sm dark:bg-amber-900/20 dark:border-amber-800" : 
                              "bg-background"
                            }`}
                            onClick={() => setSelectedFlat(flat)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-lg">{flat.flatNumber}</span>
                              <StatusBadge status={effectiveStatus} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{flat.area} sq.ft.</p>
                            <p className="font-semibold text-primary">
                              ₹{flat.price?.toLocaleString('en-IN') || 0}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {currentFlats.length === 0 && selectedTower && (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg text-center mt-4">
                    No flats available on this floor.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No towers found in this project.</p>
            )}
          </TabsContent>

          {/* ==================== BOOKINGS TAB ==================== */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              
              <div className="flex items-center gap-2 mb-4 bg-muted/20 p-3 rounded-lg border">
                <Input
                  placeholder="Search by buyer name, email, phone, or flat no..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onBookingSearch()}
                  className="max-w-md bg-white"
                />
                <Button onClick={onBookingSearch}>
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>

              {bookings.length ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Buyer Details</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Flat</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Booking Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground">{b.clientName}</div>
                            <div className="text-xs text-muted-foreground">{b.clientEmail || b.clientDetails?.phone || "N/A"}</div>
                          </td>
                          <td className="py-3 px-4 font-medium">#{b.flatNumber}</td>
                          <td className="py-3 px-4 font-semibold text-primary">{formatINR(b.bookingAmount)}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <Badge variant="outline" className="text-[10px]">{b.approvalStatus}</Badge>
                              <Badge variant="secondary" className="text-[10px]">{b.paymentStatus}</Badge>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              {b.agreementDocumentUrl && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  onClick={() => window.open(b.agreementDocumentUrl, '_blank')}
                                  title="View Agreement Document"
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1.5" /> Agreement
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => setSelectedBookingDetails(b)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="h-8"
                                onClick={() => onViewPayments(b.id)}
                              >
                                <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Payments
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No bookings found for this search/project.</p>
                </div>
              )}

              {/* Pagination */}
              {bookingsPagination?.total > 0 && (
                <div className="flex justify-between items-center py-2 px-1">
                  <span className="text-sm text-muted-foreground">
                    Page {bookingsPagination.page} of {bookingsPagination.pages} ({bookingsPagination.total} bookings)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={bookingsPagination.page <= 1}
                      onClick={() => onBookingPageChange(bookingsPagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={bookingsPagination.page >= bookingsPagination.pages}
                      onClick={() => onBookingPageChange(bookingsPagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* FULL BOOKING DETAILS MODAL */}
      <Dialog open={!!selectedBookingDetails} onOpenChange={() => setSelectedBookingDetails(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="flex items-center justify-between text-xl">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Booking Overview (Flat #{selectedBookingDetails?.flatNumber})
              </span>
              <Badge variant="default" className="capitalize">{selectedBookingDetails?.status}</Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedBookingDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="border rounded-xl p-5 bg-muted/10">
                <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary border-b pb-2">
                  <User className="h-4 w-4" /> Client Information
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Name:</span>
                    <span className="col-span-2 font-semibold">{selectedBookingDetails.clientName || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Email:</span>
                    <span className="col-span-2">{selectedBookingDetails.clientEmail || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Phone:</span>
                    <span className="col-span-2">{selectedBookingDetails.clientDetails?.phone || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t">
                    <span className="text-muted-foreground font-medium">Booking Date:</span>
                    <span className="col-span-2">
                      {selectedBookingDetails.bookingDate ? formatDate(selectedBookingDetails.bookingDate) : 'N/A'}
                    </span>
                  </div>
                  
                  {selectedBookingDetails.agreementDocumentUrl && (
                    <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t">
                      <span className="text-muted-foreground font-medium">Agreement:</span>
                      <span className="col-span-2">
                        <a 
                          href={selectedBookingDetails.agreementDocumentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-3.5 w-3.5" /> View Document
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-xl p-5 bg-muted/10">
                <div className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary border-b pb-2">
                  <IndianRupee className="h-4 w-4" /> Financial Summary
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground font-medium">Total Booking Amount:</span>
                    <span className="font-bold text-base">{formatINR(selectedBookingDetails.bookingAmount)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-green-600">
                    <span className="font-medium">Total Paid:</span>
                    <span className="font-bold">{formatINR(selectedBookingDetails.totalPaid)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-red-500 pb-2 mb-2 border-b">
                    <span className="font-medium">Remaining Amount:</span>
                    <span className="font-bold">{formatINR(selectedBookingDetails.remainingAmount)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground font-medium">Payment Status:</span>
                    <span><Badge variant="outline" className="capitalize">{selectedBookingDetails.paymentStatus}</Badge></span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground font-medium">Approval Status:</span>
                    <span><Badge variant="secondary" className="capitalize">{selectedBookingDetails.approvalStatus}</Badge></span>
                  </div>
                </div>
              </div>

              {(selectedBookingDetails.nextInstallmentAmount > 0 || selectedBookingDetails.nextInstallmentDue) && (
                <div className="col-span-1 md:col-span-2 border rounded-xl p-5 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400">
                    <Calendar className="h-4 w-4" /> Next Installment Details
                  </div>
                  <div className="flex flex-col md:flex-row gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Due Amount</span>
                      <span className="font-bold text-lg text-foreground">
                        {formatINR(selectedBookingDetails.nextInstallmentAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Due Date</span>
                      <span className="font-semibold text-base text-foreground">
                        {selectedBookingDetails.nextInstallmentDue ? formatDate(selectedBookingDetails.nextInstallmentDue) : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* EXISTING FLAT DETAILS MODAL */}
      <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Flat {selectedFlat?.flatNumber} Details</span>
              {selectedFlat && <StatusBadge status={getEffectiveFlatStatus(selectedFlat)} />}
            </DialogTitle>
            {selectedFlat && (
              <p className="text-sm text-muted-foreground">
                {selectedFlat.area} sqft · ₹{selectedFlat.price?.toLocaleString('en-IN') || 0}
              </p>
            )}
          </DialogHeader>

          {selectedFlat && (
            <div className="space-y-6">
              <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div><span className="text-muted-foreground">Bedrooms:</span> {selectedFlat.bedrooms}</div>
                <div><span className="text-muted-foreground">Bathrooms:</span> {selectedFlat.bathrooms}</div>
                <div><span className="text-muted-foreground">Facing:</span> {selectedFlat.facing || "—"}</div>
                <div><span className="text-muted-foreground">Parking:</span> {selectedFlat.parking ? "Yes" : "No"}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}