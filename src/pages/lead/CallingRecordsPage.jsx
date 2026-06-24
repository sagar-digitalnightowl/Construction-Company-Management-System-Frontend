import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLead } from "@/hooks/useLead";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";
import { leadApi } from "@/api/leadApi";
import {
  Phone,
  PhoneCall,
  Clock,
  Star,
  PhoneOff,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ThumbsDown,
  XCircle,
  UserCheck,
  UserX,
  Percent,
  TrendingUp,
} from "lucide-react";

// ----------------------------------------------------------------------
// Statistics Card Component
// ----------------------------------------------------------------------
const StatsCard = ({
  icon: Icon,
  label,
  value,
  colorClass = "text-muted-foreground",
}) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className={`p-2 rounded-full bg-muted ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------
const CallingRecordsPage = () => {
  const {
    callingRecords, // now { records, statistics, pagination }
    campaigns,
    fetchAllCallingRecords,
    fetchCampaigns,
    bulkUploadCallingRecords,
    assignCallingRecords,
    deleteCallingRecord,
  } = useLead();

  const { employees, fetchEmployees, loading: hrLoading } = useHR();

  // Dialog states
  const [uploadOpen, setUploadOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);

  // Form data
  const [uploadData, setUploadData] = useState({
    campaignId: "",
    priority: "medium",
  });
  const [jsonInput, setJsonInput] = useState("");
  const [assignData, setAssignData] = useState({
    assignedTo: "",
    recordIds: [],
  });
  const [bulkAssignData, setBulkAssignData] = useState({
    assignedTo: "",
    priority: "medium",
    limit: 50,
  });

  const [loading, setLoading] = useState(false);
  const [fetchedEmployees, setFetchedEmployees] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // match API default

  // Derived data from hook
  const records = callingRecords.records || [];
  const stats = callingRecords.statistics || {
    total: 0,
    pending: 0,
    called: 0,
    interested: 0,
    notInterested: 0,
    callbackRequested: 0,
    converted: 0,
    wrongNumber: 0,
    assigned: 0,
    unassigned: 0,
    conversionRate: 0,
    interestRate: 0,
  };

  const pagination = callingRecords.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  };

  // Fetch initial data
  useEffect(() => {
    fetchAllCallingRecords({ page: currentPage, limit: pageSize });
    fetchCampaigns();
  }, []);

  // Re-fetch when page changes
  useEffect(() => {
    fetchAllCallingRecords({ page: currentPage, limit: pageSize });
  }, [currentPage]);

  // Fetch employees when assign dialogs open
  useEffect(() => {
    if (
      (assignOpen || bulkAssignOpen) &&
      !fetchedEmployees
    ) {
        fetchEmployees().then(() => setFetchedEmployees(true));
    }
  }, [
    assignOpen,
    bulkAssignOpen,
    fetchedEmployees,
    employees.length,
    fetchEmployees,
  ]);

  // Helper to refresh current page data (used after mutations)
  const refreshData = () => {
    fetchAllCallingRecords({ page: currentPage, limit: pageSize });
  };

  // ─── Handlers ───
  const handleBulkUpload = async () => {
    let jsonRecords;
    try {
      jsonRecords = JSON.parse(jsonInput);
      if (!Array.isArray(jsonRecords)) throw new Error("Not an array");
    } catch {
      toast.error("Invalid JSON. Please provide an array of records.");
      return;
    }
    setLoading(true);
    const payload = {
      records: jsonRecords,
      campaignId: uploadData.campaignId || undefined,
      priority: uploadData.priority,
    };
    const res = await bulkUploadCallingRecords(payload);
    setLoading(false);
    if (res) {
      setUploadOpen(false);
      setJsonInput("");
      refreshData();
    }
  };

  const handleAssign = async () => {
    if (!assignData.assignedTo) {
      toast.error("Please select an employee");
      return;
    }
    if (assignData.recordIds.length === 0) {
      toast.error("No records selected");
      return;
    }
    setLoading(true);
    const res = await assignCallingRecords(assignData);
    setLoading(false);
    if (res) {
      setAssignOpen(false);
      setAssignData({ assignedTo: "", recordIds: [] });
      refreshData();
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkAssignData.assignedTo) {
      toast.error("Please select an employee");
      return;
    }
    setLoading(true);
    try {
      const res = await leadApi.assignBulkCallingRecords({
        assignedTo: bulkAssignData.assignedTo,
        priority: bulkAssignData.priority,
        limit: Number(bulkAssignData.limit),
      });
      toast.success(`${res.data?.data?.assignedCount || 0} records assigned`);
      setBulkAssignOpen(false);
      setBulkAssignData({ assignedTo: "", priority: "medium", limit: 50 });
      refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Bulk assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (recordId) => {
    setAssignData((prev) => ({
      ...prev,
      recordIds: prev.recordIds.includes(recordId)
        ? prev.recordIds.filter((id) => id !== recordId)
        : [...prev.recordIds, recordId],
    }));
  };

  // Handle delete with page edge case
  const handleDelete = async (id) => {
    await deleteCallingRecord(id);
    // If we just deleted the last item on the page (and not the first page),
    // go to previous page, otherwise refresh current page
    if (records.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else {
      refreshData();
    }
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      setAssignData({ ...assignData, recordIds: [] }); // clear selection on page change
    }
  };

  // Filter eligible agents
  const eligibleAgents = employees?.employees?.filter(
    (u) =>
      u.isActive !== false &&
      (["employee", "site_engineer", "project_manager"].includes(u.role) || u.role.includes("manager")),
  );

  return (
    <div className="space-y-4">
      {/* ─── Statistics Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard icon={Phone} label="Total" value={stats.total} />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          colorClass="text-amber-500"
        />
        <StatsCard
          icon={PhoneCall}
          label="Called"
          value={stats.called}
          colorClass="text-blue-500"
        />
        <StatsCard
          icon={Star}
          label="Interested"
          value={stats.interested}
          colorClass="text-purple-500"
        />
        <StatsCard
          icon={ThumbsDown}
          label="Not Interested"
          value={stats.notInterested}
          colorClass="text-gray-500"
        />
        <StatsCard
          icon={PhoneOff}
          label="Callback"
          value={stats.callbackRequested}
          colorClass="text-orange-500"
        />
        <StatsCard
          icon={CheckCircle}
          label="Converted"
          value={stats.converted}
          colorClass="text-green-500"
        />
        <StatsCard
          icon={XCircle}
          label="Wrong Number"
          value={stats.wrongNumber}
          colorClass="text-red-500"
        />
        <StatsCard
          icon={UserCheck}
          label="Assigned"
          value={stats.assigned}
          colorClass="text-cyan-500"
        />
        <StatsCard
          icon={UserX}
          label="Unassigned"
          value={stats.unassigned}
          colorClass="text-slate-500"
        />
        <StatsCard
          icon={Percent}
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          colorClass="text-emerald-500"
        />
        <StatsCard
          icon={TrendingUp}
          label="Interest Rate"
          value={`${stats.interestRate}%`}
          colorClass="text-indigo-500"
        />
      </div>

      {/* ─── Action Buttons ─── */}
      <div className="flex gap-2">
        <Button onClick={() => setUploadOpen(true)}>
          Bulk Upload Calling Data
        </Button>
        <Button variant="outline" onClick={() => setAssignOpen(true)}>
          Assign Selected Records
        </Button>
        <Button variant="outline" onClick={() => setBulkAssignOpen(true)}>
          Bulk Assign by Limit
        </Button>
      </div>

      {/* ─── Records Table ─── */}
      <Card>
        <CardHeader>
          <CardTitle>All Calling Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">Select</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Call Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((rec) => (
                <TableRow key={rec._id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={assignData.recordIds.includes(rec._id)}
                      onChange={() => toggleSelect(rec._id)}
                      className="h-4 w-4 rounded border-border"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {rec.clientName}
                  </TableCell>
                  <TableCell>{rec.clientPhone}</TableCell>
                  <TableCell>{rec.clientEmail || "-"}</TableCell>
                  <TableCell className="capitalize">
                    {rec.callStatus || "pending"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        rec.priority === "high" ? "destructive" : "secondary"
                      }
                    >
                      {rec.priority || "medium"}
                    </Badge>
                  </TableCell>
                  <TableCell>{rec.assignedTo?.name || "Unassigned"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDelete(rec._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {records.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No calling records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {records.length} of {pagination.total} records
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Bulk Upload Dialog ─── */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Upload Calling Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>JSON Data (array of records)</Label>
              <Textarea
                rows={8}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[{"clientName":"Rajesh Kumar","clientPhone":"+919876543210","location":"Delhi"}]'
              />
              <p className="text-xs text-muted-foreground">
                Each record must have at least clientName and clientPhone.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Select Campaign (optional)</Label>
              <Select
                value={uploadData.campaignId}
                onValueChange={(v) =>
                  setUploadData({ ...uploadData, campaignId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">No campaign</SelectItem>
                  {campaigns.map((camp) => (
                    <SelectItem key={camp._id} value={camp._id}>
                      {camp.name} ({camp.campaignCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Priority</Label>
              <Select
                value={uploadData.priority}
                onValueChange={(v) =>
                  setUploadData({ ...uploadData, priority: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleBulkUpload} disabled={loading}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Assign Selected Records Dialog ─── */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Calling Records</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assign To Employee</Label>
              <Select
                value={assignData.assignedTo}
                onValueChange={(v) =>
                  setAssignData({ ...assignData, assignedTo: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {hrLoading && eligibleAgents.length === 0 && (
                    <SelectItem value="loading" disabled>
                      Loading employees...
                    </SelectItem>
                  )}
                  {eligibleAgents.map((emp) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.name} ({emp.role})
                    </SelectItem>
                  ))}
                  {eligibleAgents.length === 0 && !hrLoading && (
                    <SelectItem value="none" disabled>
                      No eligible employees found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              {assignData.recordIds.length} records selected
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleAssign} disabled={loading}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Bulk Assign by Limit Dialog ─── */}
      <Dialog open={bulkAssignOpen} onOpenChange={setBulkAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Assign (by Limit)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assign To Employee</Label>
              <Select
                value={bulkAssignData.assignedTo}
                onValueChange={(v) =>
                  setBulkAssignData({ ...bulkAssignData, assignedTo: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {hrLoading && eligibleAgents.length === 0 && (
                    <SelectItem value="loading" disabled>
                      Loading employees...
                    </SelectItem>
                  )}
                  {eligibleAgents.map((emp) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.name} ({emp.role})
                    </SelectItem>
                  ))}
                  {eligibleAgents.length === 0 && !hrLoading && (
                    <SelectItem value="none" disabled>
                      No eligible employees found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={bulkAssignData.priority}
                onValueChange={(v) =>
                  setBulkAssignData({ ...bulkAssignData, priority: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Number of Records</Label>
              <Input
                type="number"
                min={1}
                value={bulkAssignData.limit}
                onChange={(e) =>
                  setBulkAssignData({
                    ...bulkAssignData,
                    limit: e.target.value,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Assigns the specified number of unassigned records with this
                priority.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleBulkAssign} disabled={loading}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallingRecordsPage;
