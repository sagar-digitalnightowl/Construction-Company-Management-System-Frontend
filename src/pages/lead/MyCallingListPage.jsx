import React, { useState, useEffect, useCallback } from "react";
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
import { toast } from "sonner";
import { useLead } from "@/hooks/useLead";
import {
  Phone,
  PhoneCall,
  Clock,
  Star,
  PhoneOff,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
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
// Convert To Lead Dialog Component (same file – unchanged)
// ----------------------------------------------------------------------
const INITIAL_CONVERT_FORM = {
  projectId: "",
  interestedUnit: "",
  budgetRange: "",
  notes: "",
  personalDetails: {
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    aadharNumber: "",
    panNumber: "",
    fatherName: "",
    motherName: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    permanentAddress: {
      line1: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  },
  bankDetails: {
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    accountHolderName: "",
    accountType: "",
    branchName: "",
  },
};

const ConvertToLeadDialog = ({
  open,
  onOpenChange,
  selectedRecord,
  projects,
  loading,
  onConvert,
}) => {
  const [form, setForm] = useState(INITIAL_CONVERT_FORM);

  useEffect(() => {
    if (open && selectedRecord) {
      setForm({
        ...INITIAL_CONVERT_FORM,
        notes: `Converted from calling record: ${selectedRecord.clientName} - ${selectedRecord.clientPhone}`,
      });
    }
  }, [open, selectedRecord]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateNested = (parent, field, value) => {
    setForm((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const updateAddress = (field, value) => {
    setForm((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        permanentAddress: {
          ...prev.personalDetails.permanentAddress,
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = () => {
    if (!form.projectId) {
      toast.error("Please select a project");
      return;
    }
    onConvert(selectedRecord._id, form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert to Lead</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium border-b pb-1">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Project *</Label>
                <Select
                  value={form.projectId}
                  onValueChange={(v) => updateField("projectId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Interested Unit (optional)</Label>
                <Input
                  value={form.interestedUnit}
                  onChange={(e) =>
                    updateField("interestedUnit", e.target.value)
                  }
                  placeholder="e.g., A-101"
                />
              </div>
              <div className="space-y-2">
                <Label>Budget Range (optional)</Label>
                <Input
                  value={form.budgetRange}
                  onChange={(e) => updateField("budgetRange", e.target.value)}
                  placeholder="e.g., 80-100 Lakhs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                rows={2}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h4 className="font-medium border-b pb-1">Personal Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.personalDetails.dateOfBirth}
                  onChange={(e) =>
                    updateNested(
                      "personalDetails",
                      "dateOfBirth",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={form.personalDetails.gender}
                  onValueChange={(v) =>
                    updateNested("personalDetails", "gender", v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Select
                  value={form.personalDetails.bloodGroup}
                  onValueChange={(v) =>
                    updateNested("personalDetails", "bloodGroup", v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Marital Status</Label>
                <Select
                  value={form.personalDetails.maritalStatus}
                  onValueChange={(v) =>
                    updateNested("personalDetails", "maritalStatus", v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Aadhar Number</Label>
                <Input
                  value={form.personalDetails.aadharNumber}
                  onChange={(e) =>
                    updateNested(
                      "personalDetails",
                      "aadharNumber",
                      e.target.value,
                    )
                  }
                  placeholder="12-digit number"
                />
              </div>
              <div className="space-y-2">
                <Label>PAN Number</Label>
                <Input
                  value={form.personalDetails.panNumber}
                  onChange={(e) =>
                    updateNested("personalDetails", "panNumber", e.target.value)
                  }
                  placeholder="ABCDE1234F"
                />
              </div>
              <div className="space-y-2">
                <Label>Father's Name</Label>
                <Input
                  value={form.personalDetails.fatherName}
                  onChange={(e) =>
                    updateNested(
                      "personalDetails",
                      "fatherName",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Mother's Name</Label>
                <Input
                  value={form.personalDetails.motherName}
                  onChange={(e) =>
                    updateNested(
                      "personalDetails",
                      "motherName",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <h5 className="text-sm font-medium">Emergency Contact</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={form.personalDetails.emergencyContactName}
                    onChange={(e) =>
                      updateNested(
                        "personalDetails",
                        "emergencyContactName",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={form.personalDetails.emergencyContactPhone}
                    onChange={(e) =>
                      updateNested(
                        "personalDetails",
                        "emergencyContactPhone",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Input
                    value={form.personalDetails.emergencyContactRelation}
                    onChange={(e) =>
                      updateNested(
                        "personalDetails",
                        "emergencyContactRelation",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <h5 className="text-sm font-medium">Permanent Address</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Line 1</Label>
                  <Input
                    value={form.personalDetails.permanentAddress.line1}
                    onChange={(e) => updateAddress("line1", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={form.personalDetails.permanentAddress.city}
                    onChange={(e) => updateAddress("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={form.personalDetails.permanentAddress.state}
                    onChange={(e) => updateAddress("state", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={form.personalDetails.permanentAddress.country}
                    onChange={(e) => updateAddress("country", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input
                    value={form.personalDetails.permanentAddress.pincode}
                    onChange={(e) => updateAddress("pincode", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h4 className="font-medium border-b pb-1">Bank Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  value={form.bankDetails.bankName}
                  onChange={(e) =>
                    updateNested("bankDetails", "bankName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  value={form.bankDetails.accountNumber}
                  onChange={(e) =>
                    updateNested("bankDetails", "accountNumber", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>IFSC Code</Label>
                <Input
                  value={form.bankDetails.ifscCode}
                  onChange={(e) =>
                    updateNested("bankDetails", "ifscCode", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input
                  value={form.bankDetails.upiId}
                  onChange={(e) =>
                    updateNested("bankDetails", "upiId", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Account Holder Name</Label>
                <Input
                  value={form.bankDetails.accountHolderName}
                  onChange={(e) =>
                    updateNested(
                      "bankDetails",
                      "accountHolderName",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select
                  value={form.bankDetails.accountType}
                  onValueChange={(v) =>
                    updateNested("bankDetails", "accountType", v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Current">Current</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch Name</Label>
                <Input
                  value={form.bankDetails.branchName}
                  onChange={(e) =>
                    updateNested("bankDetails", "branchName", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Converting..." : "Create Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------
const MyCallingListPage = () => {
  const {
    myCallingList,
    updateCallingRecordStatus,
    convertCallingRecordToLead,
    projects,
    fetchProjects,
    fetchMyCallingList,
    loading,
  } = useLead();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({
    callStatus: "",
    notes: "",
    nextCallDate: "",
    priority: "medium",
  });

  // Central data loader
  const loadData = useCallback(
    async (page = 1, limit = 20) => {
      try {
        await fetchMyCallingList({ page, limit });
      } catch (error) {
        toast.error("Failed to load calling list");
      } finally {
      }
    },
    [fetchMyCallingList],
  );

  useEffect(() => {
    fetchProjects();
    loadData(1, 20);
  }, []);

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > myCallingList.pagination?.pages ||
      page === myCallingList.pagination?.page
    )
      return;
    loadData(page);
  };

  // Refresh data after mutations

  const handleUpdateStatus = async () => {
    if (!selectedRecord) return;
    await updateCallingRecordStatus(selectedRecord._id, statusForm, {
      page: myCallingList.pagination?.page,
      limit: 20,
    });
    setSelectedRecord(null);
    setStatusOpen(false);
  };

  const handleConvert = async (recordId, payload) => {
    await convertCallingRecordToLead(recordId, payload, {
      page: myCallingList.pagination?.page,
      limit: 20,
    });

    setSelectedRecord(null);
    setConvertOpen(false);
  };

  const openStatusDialog = (record) => {
    setSelectedRecord(record);
    setStatusForm({
      callStatus: record.callStatus || "called",
      notes: record.notes || "",
      nextCallDate: record.nextCallDate || "",
      priority: record.priority || "medium",
    });
    setStatusOpen(true);
  };

  const openConvertDialog = (record) => {
    setSelectedRecord(record);
    setConvertOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          icon={Phone}
          label="Total"
          value={myCallingList.statistics?.total || 0}
        />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={myCallingList.statistics?.pending || 0}
          colorClass="text-amber-500"
        />
        <StatsCard
          icon={PhoneCall}
          label="Called"
          value={myCallingList.statistics?.called || 0}
          colorClass="text-blue-500"
        />
        <StatsCard
          icon={Star}
          label="Interested"
          value={myCallingList.statistics?.interested || 0}
          colorClass="text-purple-500"
        />
        <StatsCard
          icon={PhoneOff}
          label="Callback"
          value={myCallingList.statistics?.callbackRequested || 0}
          colorClass="text-orange-500"
        />
        <StatsCard
          icon={CheckCircle}
          label="Converted"
          value={myCallingList.statistics?.converted || 0}
          colorClass="text-green-500"
        />
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Calling List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap">Client Name</TableHead>
                <TableHead className="text-nowrap">Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-nowrap">Call Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-nowrap">Last Call Notes</TableHead>
                <TableHead className="text-nowrap">Next Call Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myCallingList?.records?.map((rec) => (
                <TableRow key={rec._id}>
                  <TableCell className="font-medium text-nowrap">
                    {rec.clientName}
                  </TableCell>
                  <TableCell>{rec.clientPhone}</TableCell>
                  <TableCell>{rec.clientEmail || "-"}</TableCell>
                  <TableCell className="capitalize">
                    <Badge
                      variant={
                        rec.callStatus === "converted" ? "success" : "outline"
                      }
                    >
                      {rec.callStatus || "pending"}
                    </Badge>
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
                  <TableCell className="max-w-xs truncate">
                    {rec.notes || "-"}
                  </TableCell>
                  <TableCell>
                    {rec.nextCallDate
                      ? new Date(rec.nextCallDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openStatusDialog(rec)}
                      >
                        Update Call
                      </Button>
                      {rec.callStatus === "interested" && (
                        <Button
                          size="sm"
                          onClick={() => openConvertDialog(rec)}
                        >
                          Convert to Lead
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!myCallingList?.records ||
                myCallingList?.records?.length === 0) &&
                !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No calling records assigned to you
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {myCallingList?.pagination?.total > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {(myCallingList?.pagination.page - 1) *
              myCallingList?.pagination.limit +
              1}
            –
            {Math.min(
              myCallingList?.pagination.page * myCallingList?.pagination.limit,
              myCallingList?.pagination.total,
            )}{" "}
            of {myCallingList?.pagination.total} records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={myCallingList?.pagination.page === 1}
              onClick={() => goToPage(myCallingList?.pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm">
              Page {myCallingList?.pagination.page} of{" "}
              {myCallingList?.pagination?.total}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={
                myCallingList?.pagination.page ===
                myCallingList?.pagination?.total
              }
              onClick={() => goToPage(myCallingList?.pagination.page + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Update Call Status Dialog (unchanged) */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Call Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Call Status</Label>
              <Select
                value={statusForm.callStatus}
                onValueChange={(v) =>
                  setStatusForm({ ...statusForm, callStatus: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="called">Called – No Decision</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
                  <SelectItem value="callback_requested">
                    Callback Requested
                  </SelectItem>
                  <SelectItem value="wrong_number">Wrong Number</SelectItem>
                  <SelectItem value="invalid_number">Invalid Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes / Summary</Label>
              <Textarea
                rows={3}
                value={statusForm.notes}
                onChange={(e) =>
                  setStatusForm({ ...statusForm, notes: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Next Call Date</Label>
              <Input
                type="date"
                value={statusForm.nextCallDate}
                onChange={(e) =>
                  setStatusForm({ ...statusForm, nextCallDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={statusForm.priority}
                onValueChange={(v) =>
                  setStatusForm({ ...statusForm, priority: v })
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
            <Button onClick={handleUpdateStatus} disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Lead Dialog */}
      <ConvertToLeadDialog
        open={convertOpen}
        onOpenChange={setConvertOpen}
        selectedRecord={selectedRecord}
        projects={projects}
        loading={loading}
        onConvert={handleConvert}
      />
    </div>
  );
};

export default MyCallingListPage;
