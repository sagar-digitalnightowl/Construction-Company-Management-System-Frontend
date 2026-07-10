import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/helpers";
import { Building2, BookOpen, FileText, Users, Calendar } from "lucide-react";

const StatusBadge = ({ status }) => {
  const variant =
    status === "available"
      ? "success"
      : status === "booked"
        ? "default"
        : status === "sold"
          ? "secondary"
          : "outline";
  return <Badge variant={variant}>{status}</Badge>;
};

export default function ProjectDetailModal({
  open,
  onOpenChange,
  project,
  bookings,
  bookingsPagination, // <-- Naya prop add kiya
  onBookingPageChange, // <-- Naya prop add kiya
  agreements,
  siteEngineers,
  loading,
  onViewPayments,
}) {
  const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [selectedFlat, setSelectedFlat] = useState(null);

  const towers = project?.towers || [];
  const selectedTower = towers[selectedTowerIdx] || null;
  const floors = selectedTower?.floors || [];
  // Keep floor index in bounds when tower changes
  const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
  const currentFloor = floors[safeFloorIdx] || null;
  const currentFlats = currentFloor?.flats || [];

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {project.name} – Inventory
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="towers">
          <TabsList>
            <TabsTrigger value="towers">
              <Building2 className="h-4 w-4 mr-1" /> Towers & Flats
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <BookOpen className="h-4 w-4 mr-1" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="agreements">
              <FileText className="h-4 w-4 mr-1" /> Agreements
            </TabsTrigger>
            <TabsTrigger value="engineers">
              <Users className="h-4 w-4 mr-1" /> Site Engineers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="towers">
            {towers.length > 0 ? (
              <div className="space-y-4">
                {/* Tower selection */}
                <div>
                  <h4 className="text-sm font-medium mb-1">Select Tower</h4>
                  <div className="flex gap-2 flex-wrap">
                    {towers.map((tower, idx) => (
                      <Button
                        key={tower.towerName}
                        variant={
                          idx === selectedTowerIdx ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setSelectedTowerIdx(idx);
                          setSelectedFloorIdx(0); // reset floor when tower changes
                        }}
                      >
                        {tower.towerName}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Floor selection */}
                {selectedTower && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Select Floor</h4>
                    <div className="flex gap-2 flex-wrap">
                      {floors.map((floor, idx) => (
                        <Button
                          key={floor.floorNumber}
                          variant={idx === safeFloorIdx ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFloorIdx(idx)}
                        >
                          {floor.floorNumber}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flats grid */}
                {currentFlats.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">
                      {selectedTower.towerName} – Floor{" "}
                      {currentFloor.floorNumber}
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {currentFlats.map((flat) => (
                        <div
                          key={flat.flatNumber}
                          className="border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => setSelectedFlat(flat)}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium">
                              {flat.flatNumber}
                            </span>
                            <StatusBadge status={flat.status} />
                          </div>
                          <p className="text-sm">{flat.area} sqft</p>
                          <p className="text-sm font-semibold">
                            ₹{flat.price?.toLocaleString()}
                          </p>
                          {flat.facing && (
                            <p className="text-xs text-muted-foreground">
                              Facing: {flat.facing}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentFlats.length === 0 && selectedTower && (
                  <p className="text-sm text-muted-foreground">
                    No flats on this floor.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No towers found.</p>
            )}
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            {bookings.length ? (
              <div className="space-y-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th>Buyer</th>
                      <th>Flat</th>
                      <th>Booking Amount</th>
                      <th>Payment Status</th>
                      <th>Next Due</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          {b.clientName}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {b.clientEmail}
                          </span>
                        </td>
                        <td>{b.flatNumber}</td>
                        <td>{formatINR(b.bookingAmount)}</td>
                        <td>
                          <Badge>{b.paymentStatus}</Badge>
                        </td>
                        <td>
                          {b.nextInstallmentDue
                            ? formatDate(b.nextInstallmentDue)
                            : "—"}
                        </td>
                        <td>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewPayments(b.id)}
                          >
                            Payments
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* <-- Naya Pagination UI Start --> */}
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
                {/* <-- Naya Pagination UI End --> */}

              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No bookings found.
              </p>
            )}
          </TabsContent>

          {/* Agreements */}
          <TabsContent value="agreements">
            {agreements.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Buyer</th>
                    <th>Flat</th>
                    <th>Status</th>
                    <th>Agreement Date</th>
                    <th>Approval</th>
                    <th>Cancelled</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {agreements.map((a) => (
                    <tr key={a.bookingId}>
                      <td className="font-mono text-xs">{a.bookingId}</td>
                      <td>{a.clientName}</td>
                      <td>{a.flatNumber}</td>
                      <td>
                        <Badge>{a.status}</Badge>
                      </td>
                      <td>
                        {a.agreementDate ? formatDate(a.agreementDate) : "—"}
                      </td>
                      <td>{a.approvalStatus}</td>
                      <td>{a.cancelled ? "Yes" : "No"}</td>
                      <td>{a.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No agreements found.
              </p>
            )}
          </TabsContent>

          {/* Site Engineers */}
          <TabsContent value="engineers">
            {siteEngineers.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {siteEngineers.map((eng) => (
                    <tr key={eng.id}>
                      <td>{eng.name}</td>
                      <td>{eng.email}</td>
                      <td>{eng.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No site engineers assigned.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      <Dialog open={!!selectedFlat} onOpenChange={() => setSelectedFlat(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Flat {selectedFlat?.flatNumber} Details</span>
              {selectedFlat && <StatusBadge status={selectedFlat.status} />}
            </DialogTitle>
            {selectedFlat && (
              <p className="text-sm text-muted-foreground">
                {selectedFlat.area} sqft · ₹{formatINR(selectedFlat.price)}
              </p>
            )}
          </DialogHeader>

          {selectedFlat && (
            <div className="space-y-6">
              {/* --- Flat Information Card --- */}
              <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Bedrooms:</span>{" "}
                  {selectedFlat.bedrooms}
                </div>
                <div>
                  <span className="text-muted-foreground">Bathrooms:</span>{" "}
                  {selectedFlat.bathrooms}
                </div>
                <div>
                  <span className="text-muted-foreground">Facing:</span>{" "}
                  {selectedFlat.facing || "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Parking:</span>{" "}
                  {selectedFlat.parking ? "Yes" : "No"}
                </div>
                <div>
                  <span className="text-muted-foreground">Balcony:</span>{" "}
                  {selectedFlat.balcony ? "Yes" : "No"}
                </div>
                <div>
                  <span className="text-muted-foreground">Furnished:</span>{" "}
                  {selectedFlat.furnished}
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">
                    Type of Booking:
                  </span>{" "}
                  {selectedFlat.typeOfBooking || "—"}
                </div>
              </div>

              {/* --- Agreement & Status Card --- */}
              <div className="border rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Agreement Status:
                  </span>{" "}
                  <Badge
                    variant={
                      selectedFlat.agreementStatus === "REGISTERED"
                        ? "success"
                        : "outline"
                    }
                  >
                    {selectedFlat.agreementStatus}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Agreement Date:</span>{" "}
                  {selectedFlat.agreementDate
                    ? formatDate(selectedFlat.agreementDate)
                    : "—"}
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Cancelled:</span>{" "}
                  {selectedFlat.cancelled ? "Yes" : "No"}
                </div>
              </div>

              {/* --- Booking Details Card --- */}
              {selectedFlat.booking && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-base">Booking Details</h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Booking ID:</span>{" "}
                      <span className="font-mono text-xs">
                        {selectedFlat.booking.bookingId}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge variant="outline">
                        {selectedFlat.booking.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Approval:</span>{" "}
                      <Badge
                        variant={
                          selectedFlat.booking.approvalStatus === "approved"
                            ? "success"
                            : "warning"
                        }
                      >
                        {selectedFlat.booking.approvalStatus}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Payment Status:
                      </span>{" "}
                      <Badge>{selectedFlat.booking.paymentStatus}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Booking Amount:
                      </span>{" "}
                      {formatINR(selectedFlat.booking.bookingAmount)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Paid:</span>{" "}
                      {formatINR(selectedFlat.booking.totalPaid)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining:</span>{" "}
                      {formatINR(selectedFlat.booking.remainingAmount)}
                    </div>
                    {selectedFlat.booking.nextInstallmentDueDate && (
                      <div>
                        <span className="text-muted-foreground">Next Due:</span>{" "}
                        {formatDate(
                          selectedFlat.booking.nextInstallmentDueDate,
                        )}
                      </div>
                    )}
                    {selectedFlat.booking.nextInstallmentAmount > 0 && (
                      <div>
                        <span className="text-muted-foreground">
                          Next Installment:
                        </span>{" "}
                        {formatINR(selectedFlat.booking.nextInstallmentAmount)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- Payment History Card --- */}
              {selectedFlat.booking?.paymentDetails?.filter(
                (p) => p.clearedAmount > 0 || p.unclearedAmount > 0,
              ).length > 0 && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-base">Payment History</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1 pr-2">Mode</th>
                          <th className="text-left py-1 pr-2">Cleared</th>
                          <th className="text-left py-1 pr-2">Uncleared</th>
                          <th className="text-left py-1">Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFlat.booking.paymentDetails
                          .filter(
                            (p) => p.clearedAmount > 0 || p.unclearedAmount > 0,
                          )
                          .map((payment, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-1 pr-2">
                                {payment.paymentMode || "—"}
                              </td>
                              <td className="py-1 pr-2">
                                {formatINR(payment.clearedAmount)}
                              </td>
                              <td className="py-1 pr-2">
                                {formatINR(payment.unclearedAmount)}
                              </td>
                              <td className="py-1">
                                {payment.transactionId ||
                                  payment.chequeNumber ||
                                  payment.bankName ||
                                  "—"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}