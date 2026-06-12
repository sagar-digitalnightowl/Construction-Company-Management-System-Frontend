import React from "react";
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
  agreements,
  siteEngineers,
  loading,
  onViewPayments,
}) {
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

          {/* Towers & Flats */}
          <TabsContent value="towers">
            {project.towers?.length ? (
              project.towers.map((tower) => (
                <div key={tower.towerName} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {tower.towerName}
                  </h3>
                  <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
                    <span>Total Floors: {tower.totalFloors}</span>
                    <span>Total Flats: {tower.totalFlats}</span>
                    <span>Available: {tower.availableFlats}</span>
                    <span>Booked: {tower.bookedFlats}</span>
                  </div>
                  {tower.floors?.map((floor) => (
                    <div key={floor.floorNumber} className="mb-3">
                      <h4 className="font-medium text-sm">
                        Floor {floor.floorNumber}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-1">
                        {floor.flats?.map((flat) => (
                          <div
                            key={flat.flatNumber}
                            className="border rounded-md p-2 text-sm space-y-1"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {flat.flatNumber}
                              </span>
                              <StatusBadge status={flat.status} />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {flat.area} sqft, ₹{flat.price?.toLocaleString()}
                            </div>
                            {flat.facing && (
                              <div className="text-xs">
                                Facing: {flat.facing}
                              </div>
                            )}
                            {flat.booking && (
                              <div className="text-xs space-y-1 mt-1 border-t pt-1">
                                <p>Booking ID: {flat.booking.bookingId}</p>
                                <p>Client: {flat.booking.client?.name}</p>
                                <p>
                                  Paid: ₹
                                  {flat.booking.totalPaid?.toLocaleString()}
                                </p>
                                <p>
                                  Payment Status:{" "}
                                  <Badge>{flat.booking.paymentStatus}</Badge>
                                </p>
                                <p>Agreement: {flat.booking.agreementStatus}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No tower data available.
              </p>
            )}
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            {bookings.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Client</th>
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
                    <th>Client</th>
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
    </Dialog>
  );
}
