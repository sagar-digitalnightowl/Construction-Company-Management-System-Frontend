// src/components/hr/CreateEmployeeDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "site_engineer",
  department: "",
  employeeId: "",

  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  aadharNumber: "",
  panNumber: "",
  fatherName: "",
  motherName: "",
  maritalStatus: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
  sameAsPermanent: true, // default true
  currentAddressLine1: "",
  currentCity: "",
  currentState: "",
  currentPincode: "",

  bankName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",

  designation: "",
  joiningDate: "",
  employmentType: "Full-Time",
  basicSalary: "",
  hra: "",
  allowances: "",
  totalCTC: "",
  totalExperienceYears: "",

  profileImageUrl: "",
  documents: {
    tenthMarksheetUrl: "",
    twelfthMarksheetUrl: "",
    graduationCertificateUrl: "",
    postGraduationCertificateUrl: "",
    aadharCardUrl: "",
    panCardUrl: "",
    offerLetterUrl: "",
  },
};

export function CreateEmployeeDialog({ open, onOpenChange, onSuccess }) {
  const {
    registerEmployee,
    verifyOtp,
    uploadFile,
    loading,
    fetchDepartments,
    departments,
  } = useHR();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialFormState);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [verificationData, setVerificationData] = useState({
    userId: "",
    email: "",
    phone: "",
    emailOtp: "",
    phoneOtp: "",
  });

  useEffect(() => {
    if (open) {
      fetchDepartments();
      setStep(1);
      setForm(initialFormState);
    }
  }, [open, fetchDepartments]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocChange = (docField, value) => {
    setForm((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docField]: value },
    }));
  };

  const handleFileUpload = async (file, field, fileType) => {
    if (!file) return;
    const publicUrl = await uploadFile(file, fileType);
    if (publicUrl) {
      setForm((prev) => ({ ...prev, [field]: publicUrl }));
    }
  };

  const handleDocUpload = async (file, docField, fileType) => {
    if (!file) return;
    const publicUrl = await uploadFile(file, fileType);
    if (publicUrl) {
      handleDocChange(docField, publicUrl);
    }
  };

  const validateStep1 = () => {
    if (!form.name.trim()) {
      toast.error("Employee name is required");
      return false;
    }
    if (!form.employeeId.trim()) {
      toast.error("Employee ID is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!/^\+?\d{10,15}$/.test(form.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (!form.password) {
      toast.error("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!form.department) {
      toast.error("Department is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.dateOfBirth) {
      toast.error("Date of birth is required");
      return false;
    }
    if (!form.gender) {
      toast.error("Gender is required");
      return false;
    }
    if (!form.bloodGroup) {
      toast.error("Blood group is required");
      return false;
    }
    if (!form.aadharNumber) {
      toast.error("Aadhar number is required");
      return false;
    }
    if (!/^\d{12}$/.test(form.aadharNumber)) {
      toast.error("Aadhar number must be 12 digits");
      return false;
    }
    if (!form.emergencyContactName) {
      toast.error("Emergency contact name is required");
      return false;
    }
    if (!form.emergencyContactPhone) {
      toast.error("Emergency contact phone is required");
      return false;
    }
    if (!/^\+?\d{10,15}$/.test(form.emergencyContactPhone)) {
      toast.error("Invalid emergency contact phone");
      return false;
    }
    if (!form.addressLine1) {
      toast.error("Address is required");
      return false;
    }
    if (!form.city) {
      toast.error("City is required");
      return false;
    }
    if (!form.state) {
      toast.error("State is required");
      return false;
    }
    if (!form.pincode) {
      toast.error("Pincode is required");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!form.designation) {
      toast.error("Designation is required");
      return false;
    }
    if (!form.joiningDate) {
      toast.error("Joining date is required");
      return false;
    }
    if (!form.basicSalary) {
      toast.error("Basic salary is required");
      return false;
    }
    if (!form.totalCTC) {
      toast.error("Total CTC is required");
      return false;
    }
    if (Number(form.totalCTC) < Number(form.basicSalary)) {
      toast.error("Total CTC cannot be less than basic salary");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const clearForm = () => {
    setForm(initialFormState);
    setStep(1);
  };

  const handleCancel = () => {
    clearForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!validateStep2()) {
      setStep(2);
      return;
    }
    if (!validateStep3()) {
      setStep(3);
      return;
    }

    const payload = {
      email: form.email,
      phone: form.phone,
      password: form.password,
      name: form.name,
      role: form.role,
      department: form.department || null,
      employeeId: form.employeeId,

      profileImageKey: form.profileImageUrl || undefined,

      personalDetails: {
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        bloodGroup: form.bloodGroup || undefined,
        maritalStatus: form.maritalStatus || undefined,
        aadharNumber: form.aadharNumber || undefined,
        panNumber: form.panNumber || undefined,
        fatherName: form.fatherName || undefined,
        motherName: form.motherName || undefined,
        emergencyContactName: form.emergencyContactName || undefined,
        emergencyContactPhone: form.emergencyContactPhone || undefined,
        emergencyContactRelation: form.emergencyContactRelation || undefined,
        permanentAddress: {
          line1: form.addressLine1 || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          pincode: form.pincode || undefined,
          country: "India",
        },
        sameAsPermanent: form.sameAsPermanent,
        currentAddress: form.sameAsPermanent
          ? undefined
          : {
              line1: form.currentAddressLine1 || undefined,
              city: form.currentCity || undefined,
              state: form.currentState || undefined,
              pincode: form.currentPincode || undefined,
              country: "India",
            },
      },

      bankDetails: {
        bankName: form.bankName || undefined,
        accountNumber: form.accountNumber || undefined,
        ifscCode: form.ifscCode || undefined,
        upiId: form.upiId || undefined,
        accountHolderName: form.name,
        accountType: "Savings",
        branchName: form.bankName || undefined,
      },

      jobDetails: {
        designation: form.designation || undefined,
        joiningDate: form.joiningDate || undefined,
        employmentType: form.employmentType || "Full-Time",
        basicSalary: Number(form.basicSalary) || 0,
        hra: Number(form.hra) || 0,
        allowances: Number(form.allowances) || 0,
        totalCTC: Number(form.totalCTC) || 0,
        probationPeriodMonths: undefined,
        reportingManager: undefined,
      },

      totalExperienceYears: form.totalExperienceYears
        ? Number(form.totalExperienceYears)
        : undefined,

      documents: {
        tenthMarksheetKey: form.documents.tenthMarksheetUrl || undefined,
        twelfthMarksheetKey: form.documents.twelfthMarksheetUrl || undefined,
        graduationCertificateKey:
          form.documents.graduationCertificateUrl || undefined,
        postGraduationCertificateKey:
          form.documents.postGraduationCertificateUrl || undefined,
        aadharCardKey: form.documents.aadharCardUrl || undefined,
        panCardKey: form.documents.panCardUrl || undefined,
        offerLetterKey: form.documents.offerLetterUrl || undefined,
      },
    };

    const response = await registerEmployee(payload);
    if (response?.success) {
      setVerificationData({
        userId: response.data.userId,
        email: response.data.email,
        phone: response.data.phone,
        emailOtp: response.data.emailOtp,
        phoneOtp: response.data.phoneOtp,
      });
      setStep(5);
    }
  };

  const verifyEmailOtp = async () => {
    const res = await verifyOtp({
      identifier: form.email,
      otp: emailOtp,
      type: "email",
    });
    if (res) {
      toast.success("Email verified");
      setStep(6);
    }
  };

  const verifyPhoneOtp = async () => {
    const res = await verifyOtp({
      identifier: form.phone,
      otp: phoneOtp,
      type: "phone",
    });
    if (res) {
      toast.success("Phone verified");
      clearForm();
      onSuccess?.();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
        {step <= 4 && (
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <div className="flex items-center space-x-2 pt-2 text-sm text-muted-foreground">
              <span className={step === 1 ? "font-bold text-primary" : ""}>
                1. Credentials
              </span>
              <span>&rarr;</span>
              <span className={step === 2 ? "font-bold text-primary" : ""}>
                2. Personal & Bank
              </span>
              <span>&rarr;</span>
              <span className={step === 3 ? "font-bold text-primary" : ""}>
                3. Job & Payroll
              </span>
              <span>&rarr;</span>
              <span className={step === 4 ? "font-bold text-primary" : ""}>
                4. Documents
              </span>
            </div>
          </DialogHeader>
        )}

        <div className="flex-1 overflow-y-auto py-4 px-1">
          {/* STEP 1: CREDENTIALS & CORE INFO */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    placeholder="EMP123"
                    value={form.employeeId}
                    onChange={(e) => handleChange("employeeId", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+919876543210"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => handleChange("role", v)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="project_manager">
                        Project Manager
                      </SelectItem>
                      <SelectItem value="site_engineer">
                        Site Engineer
                      </SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="hr_manager">HR Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={form.department}
                    onValueChange={(v) => handleChange("department", v)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept._id}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL & BANK DETAILS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground">
                  Personal Profile
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">DOB</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        handleChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={form.gender}
                      onValueChange={(v) => handleChange("gender", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={form.bloodGroup}
                      onValueChange={(v) => handleChange("bloodGroup", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Blood Group" />
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
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                    <Input
                      id="aadharNumber"
                      placeholder="12 digit number"
                      value={form.aadharNumber}
                      onChange={(e) =>
                        handleChange("aadharNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Card No.</Label>
                    <Input
                      id="panNumber"
                      placeholder="ABCDE1234F"
                      value={form.panNumber}
                      onChange={(e) =>
                        handleChange("panNumber", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      placeholder="Father's Name"
                      value={form.fatherName}
                      onChange={(e) =>
                        handleChange("fatherName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      placeholder="Mother's Name"
                      value={form.motherName}
                      onChange={(e) =>
                        handleChange("motherName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select
                      value={form.maritalStatus}
                      onValueChange={(v) => handleChange("maritalStatus", v)}
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
                </div>

                <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name *</Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="Name"
                      value={form.emergencyContactName}
                      onChange={(e) =>
                        handleChange("emergencyContactName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">
                      Contact Phone *
                    </Label>
                    <Input
                      id="emergencyContactPhone"
                      placeholder="Phone"
                      value={form.emergencyContactPhone}
                      onChange={(e) =>
                        handleChange("emergencyContactPhone", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="emergencyContactRelation">Relation</Label>
                  <Input
                    id="emergencyContactRelation"
                    placeholder="e.g., Spouse"
                    value={form.emergencyContactRelation}
                    onChange={(e) =>
                      handleChange("emergencyContactRelation", e.target.value)
                    }
                  />
                </div>

                <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                  Permanent Address
                </h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Line 1"
                    value={form.addressLine1}
                    onChange={(e) =>
                      handleChange("addressLine1", e.target.value)
                    }
                    className="mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                    <Input
                      placeholder="State"
                      value={form.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                    />
                    <Input
                      placeholder="Pincode"
                      value={form.pincode}
                      onChange={(e) => handleChange("pincode", e.target.value)}
                    />
                  </div>
                </div>

                {/* Current Address Section */}
                <div className="mt-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                      Current Address
                    </h4>
                    <Input
                      placeholder="Line 1"
                      value={form.currentAddressLine1}
                      onChange={(e) =>
                        handleChange("currentAddressLine1", e.target.value)
                      }
                      className="mb-2"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="City"
                        value={form.currentCity}
                        onChange={(e) =>
                          handleChange("currentCity", e.target.value)
                        }
                      />
                      <Input
                        placeholder="State"
                        value={form.currentState}
                        onChange={(e) =>
                          handleChange("currentState", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Pincode"
                        value={form.currentPincode}
                        onChange={(e) =>
                          handleChange("currentPincode", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground">
                  Bank Settlement
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="HDFC Bank"
                      value={form.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="50100XXXXXXXX"
                      value={form.accountNumber}
                      onChange={(e) =>
                        handleChange("accountNumber", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      placeholder="HDFC0000123"
                      value={form.ifscCode}
                      onChange={(e) => handleChange("ifscCode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="username@okaxis"
                      value={form.upiId}
                      onChange={(e) => handleChange("upiId", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: JOB & COMPENSATION DETAILS */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground">
                Employment Assignment
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    placeholder="Software Engineer"
                    value={form.designation}
                    onChange={(e) =>
                      handleChange("designation", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joiningDate">Joining Date *</Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    value={form.joiningDate}
                    onChange={(e) =>
                      handleChange("joiningDate", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select
                  value={form.employmentType}
                  onValueChange={(v) => handleChange("employmentType", v)}
                >
                  <SelectTrigger id="employmentType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalExperienceYears">
                  Total Experience (Years)
                </Label>
                <Input
                  id="totalExperienceYears"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="4.5"
                  value={form.totalExperienceYears}
                  onChange={(e) =>
                    handleChange("totalExperienceYears", e.target.value)
                  }
                />
              </div>

              <h3 className="text-sm font-semibold pt-4 mb-3 border-b pb-1 text-muted-foreground">
                Salary Breakdown Structure
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basicSalary">Basic Salary *</Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    placeholder="0"
                    value={form.basicSalary}
                    onChange={(e) =>
                      handleChange("basicSalary", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hra">HRA Component</Label>
                  <Input
                    id="hra"
                    type="number"
                    placeholder="0"
                    value={form.hra}
                    onChange={(e) => handleChange("hra", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allowances">Allowances</Label>
                  <Input
                    id="allowances"
                    type="number"
                    placeholder="0"
                    value={form.allowances}
                    onChange={(e) => handleChange("allowances", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalCTC">Total CTC (Annual) *</Label>
                  <Input
                    id="totalCTC"
                    type="number"
                    placeholder="0"
                    value={form.totalCTC}
                    onChange={(e) => handleChange("totalCTC", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENTS */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground">
                Upload Documents (optional)
              </h3>
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(
                      e.target.files[0],
                      "profileImageUrl",
                      "profile",
                    )
                  }
                />
                {form.profileImageUrl && (
                  <p className="text-xs text-green-600 mt-1">Uploaded ✓</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Aadhar Card</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) =>
                      handleDocUpload(
                        e.target.files[0],
                        "aadharCardUrl",
                        "document",
                      )
                    }
                  />
                  {form.documents.aadharCardUrl && (
                    <p className="text-xs text-green-600 mt-1">Uploaded ✓</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>PAN Card</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) =>
                      handleDocUpload(
                        e.target.files[0],
                        "panCardUrl",
                        "document",
                      )
                    }
                  />
                  {form.documents.panCardUrl && (
                    <p className="text-xs text-green-600 mt-1">Uploaded ✓</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>10th Marksheet</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) =>
                      handleDocUpload(
                        e.target.files[0],
                        "tenthMarksheetUrl",
                        "document",
                      )
                    }
                  />
                  {form.documents.tenthMarksheetUrl && (
                    <p className="text-xs text-green-600 mt-1">Uploaded ✓</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>12th Marksheet</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) =>
                      handleDocUpload(
                        e.target.files[0],
                        "twelfthMarksheetUrl",
                        "document",
                      )
                    }
                  />
                  {form.documents.twelfthMarksheetUrl && (
                    <p className="text-xs text-green-600 mt-1">Uploaded ✓</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Graduation Certificate</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) =>
                      handleDocUpload(
                        e.target.files[0],
                        "graduationCertificateUrl",
                        "document",
                      )
                    }
                  />
                  {form.documents.graduationCertificateUrl && (
                    <p className="text-xs text-green-600 mt-1">Uploaded ✓</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Post-Graduation Certificate</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) =>
                      handleDocUpload(
                        e.target.files[0],
                        "postGraduationCertificateUrl",
                        "document",
                      )
                    }
                  />
                  {form.documents.postGraduationCertificateUrl && (
                    <p className="text-xs text-green-600 mt-1">Uploaded ✓</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Offer Letter (Previous)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) =>
                      handleDocUpload(
                        e.target.files[0],
                        "offerLetterUrl",
                        "document",
                      )
                    }
                  />
                  {form.documents.offerLetterUrl && (
                    <p className="text-xs text-green-600 mt-1">Uploaded ✓</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: EMAIL OTP */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-muted/40 p-4">
                <h3 className="font-semibold text-green-600">
                  Employee Created Successfully
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Email verification required for:
                </p>
                <p className="font-medium">{verificationData.email}</p>
              </div>
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                <p className="text-xs uppercase font-semibold text-amber-700 mb-1">
                  Development OTP
                </p>
                <p className="text-3xl font-bold tracking-widest">
                  {verificationData.emailOtp}
                </p>
              </div>
              <Input
                placeholder="Enter Email OTP"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
              />
            </div>
          )}

          {/* STEP 6: PHONE OTP */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Phone verification required for:
                </p>
                <p className="font-medium">{verificationData.phone}</p>
              </div>
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                <p className="text-xs uppercase font-semibold text-amber-700 mb-1">
                  Development OTP
                </p>
                <p className="text-3xl font-bold tracking-widest">
                  {verificationData.phoneOtp}
                </p>
              </div>
              <Input
                placeholder="Enter Phone OTP"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between border-t pt-4">
          <div>
            {step === 1 && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            {step >= 2 && step <= 4 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>

          {step < 4 && <Button onClick={handleNext}>Next Step</Button>}

          {step === 4 && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Employee"}
            </Button>
          )}

          {step === 5 && (
            <Button onClick={verifyEmailOtp} disabled={loading}>
              Verify Email OTP
            </Button>
          )}

          {step === 6 && (
            <Button onClick={verifyPhoneOtp} disabled={loading}>
              Verify Phone OTP
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
