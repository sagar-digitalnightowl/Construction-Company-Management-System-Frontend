// // src/components/booking/CreateBookingDialog.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
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
// import { projectApi, authApi } from "@/api";
// import { bookingApi } from "@/api/bookingApi";
// import { PAYMENT_MODE } from "@/data/constants/booking";
// import { formatINR } from "@/lib/helpers";
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";

// // const PAYMENT_MODEL_OPTIONS = [
// //   { value: "NEW", label: "New" },
// //   { value: "RESALE", label: "Resale" },
// //   { value: "PART_EXCHANGE", label: "Part Exchange" },
// //   { value: "RENT_TO_OWN", label: "Rent to Own" },
// // ];

// export function CreateBookingDialog({ open, onOpenChange, onSuccess }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);

//   const initialForm = {
//     // Flat selection
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     // Booking core
//     bookingAmount: "",
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     // New booking-level fields
//     keyNumber: "",
//     // paymentModel: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     gstPaid: "",
//     remarks: "",
//     transactionId: "",

//     // Lead or client
//     leadId: "",
//     // New client fields (only when no lead)
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

//     // Personal details
//     dateOfBirth: "",
//     gender: "",
//     bloodGroup: "",
//     maritalStatus: "",
//     aadharNumber: "",
//     panNumber: "",
//     fatherName: "",
//     motherName: "",
//     emergencyContactName: "",
//     emergencyContactPhone: "",
//     emergencyContactRelation: "",
//     addressLine1: "",
//     city: "",
//     state: "",
//     country: "India",
//     pincode: "",

//     // Bank details
//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",
//   };

//   const [form, setForm] = useState(initialForm);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load projects");
//     }
//   };

//   const fetchTeamManagers = async () => {
//     try {
//       const res = await authApi.getUsers();
//       if (res.data.success) {
//         const managers = res.data.data?.users?.filter(
//           (user) =>
//             user.role?.includes("manager") ||
//             user.role === "manager" ||
//             user.role === "admin",
//         );
//         setTeamManagers(managers || []);
//       }
//     } catch (err) {
//       console.error("Failed to fetch team managers", err);
//     }
//   };

//   useEffect(() => {
//     if (open) {
//       fetchProjects();
//       fetchTeamManagers();
//     } else {
//       resetForm();
//     }
//   }, [open]);

//   // Populate towers when project changes
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         setFloors([]);
//         setFlats([]);
//         setSelectedFlat(null);
//         setForm((prev) => ({
//           ...prev,
//           towerName: "",
//           floor: "",
//           flatId: "",
//         }));
//       } else {
//         setTowers([]);
//         setFloors([]);
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setTowers([]);
//       setFloors([]);
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.projectId, projects]);

//   // Populate floors when tower changes
//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         setFlats([]);
//         setSelectedFlat(null);
//         setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//       } else {
//         setFloors([]);
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFloors([]);
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.towerName, towers]);

//   // Populate flats when floor changes
//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === form.floor);
//       if (floor) {
//         const availableFlats = floor.flats.filter(
//           (f) => f.status === "available",
//         );
//         setFlats(availableFlats);
//         setSelectedFlat(null);
//         setForm((prev) => ({ ...prev, flatId: "" }));
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   // Store selected flat object when flatId changes
//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     // Basic validation
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     // // If no lead, client details must be provided
//     // if (!form.leadId) {
//     //   if (
//     //     !form.clientName ||
//     //     !form.clientEmail ||
//     //     !form.clientPhone ||
//     //     !form.clientPassword
//     //   ) {
//     //     toast.error("Client details are required when no lead is selected");
//     //     return;
//     //   }
//     // }

//     setLoading(true);

//     // Base payload
//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount),
//       paymentMode: form.paymentMode,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       // paymentModel: form.paymentModel || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid
//         ? Number(form.serviceTaxPaid)
//         : undefined,
//       gstPaid: form.gstPaid ? Number(form.gstPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       // Personal details
//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus)
//         personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName)
//         personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone)
//         personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation)
//         personalDetails.emergencyContactRelation =
//           form.emergencyContactRelation;

//       if (form.addressLine1 || form.city || form.state || form.pincode) {
//         personalDetails.permanentAddress = {
//           line1: form.addressLine1 || undefined,
//           city: form.city || undefined,
//           state: form.state || undefined,
//           country: form.country || "India",
//           pincode: form.pincode || undefined,
//         };
//       }

//       if (Object.keys(personalDetails).length) {
//         payload.personalDetails = personalDetails;
//       }

//       const bankDetails = {};
//       if (form.bankName) bankDetails.bankName = form.bankName;
//       if (form.accountNumber) bankDetails.accountNumber = form.accountNumber;
//       if (form.ifscCode) bankDetails.ifscCode = form.ifscCode;
//       if (form.upiId) bankDetails.upiId = form.upiId;
//       if (form.accountHolderName)
//         bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       const res = await bookingApi.createBooking(payload);
//       toast.success("Booking created successfully");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Create New Booking</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select
//                 value={form.projectId}
//                 onValueChange={(v) => {
//                   updateForm("projectId", v);
//                   updateForm("towerName", "");
//                   updateForm("floor", "");
//                   updateForm("flatId", "");
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select project" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (
//                     <SelectItem key={p._id} value={p._id}>
//                       {p.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select
//                 value={form.towerName}
//                 onValueChange={(v) => {
//                   updateForm("towerName", v);
//                   updateForm("floor", "");
//                   updateForm("flatId", "");
//                 }}
//                 disabled={!form.projectId || towers.length === 0}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select tower" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (
//                     <SelectItem key={t.towerName} value={t.towerName}>
//                       {t.towerName} ({t.totalFloors || t.floors?.length} floors)
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select
//                 value={form.floor.toString()}
//                 onValueChange={(v) => {
//                   updateForm("floor", v);
//                   updateForm("flatId", "");
//                 }}
//                 disabled={!form.towerName || floors.length === 0}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select floor" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (
//                     <SelectItem
//                       key={f.floorNumber}
//                       value={f.floorNumber.toString()}
//                     >
//                       Floor {f.floorNumber}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select
//                 value={form.flatId}
//                 onValueChange={(v) => updateForm("flatId", v)}
//                 disabled={!form.floor || flats.length === 0}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select flat" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {f.area} sqft -{" "}
//                       {formatINR(f.price)}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-muted/40 rounded-md">
//               <div>
//                 <Label className="text-xs">Flat No.</Label>
//                 <p className="text-sm font-medium">{selectedFlat.flatNumber}</p>
//               </div>
//               <div>
//                 <Label className="text-xs">Area (sqft)</Label>
//                 <p className="text-sm font-medium">{selectedFlat.area}</p>
//               </div>
//               <div>
//                 <Label className="text-xs">Bedrooms</Label>
//                 <p className="text-sm font-medium">{selectedFlat.bedrooms}</p>
//               </div>
//               <div>
//                 <Label className="text-xs">Bathrooms</Label>
//                 <p className="text-sm font-medium">{selectedFlat.bathrooms}</p>
//               </div>
//               <div>
//                 <Label className="text-xs">Price</Label>
//                 <p className="text-sm font-medium">
//                   {formatINR(selectedFlat.price)}
//                 </p>
//               </div>
//               <div>
//                 <Label className="text-xs">Facing</Label>
//                 <p className="text-sm font-medium">
//                   {selectedFlat.features?.facing || "-"}
//                 </p>
//               </div>
//               <div>
//                 <Label className="text-xs">Furnished</Label>
//                 <p className="text-sm font-medium capitalize">
//                   {selectedFlat.features?.furnished || "unfurnished"}
//                 </p>
//               </div>
//               <div className="col-span-2 md:col-span-1 flex gap-4 text-sm">
//                 <span>
//                   Parking: {selectedFlat.features?.parking ? "Yes" : "No"}
//                 </span>
//                 <span>
//                   Balcony: {selectedFlat.features?.balcony ? "Yes" : "No"}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select
//                 value={form.leadId || "none"}
//                 onValueChange={(v) =>
//                   updateForm("leadId", v === "none" ? "" : v)
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select lead" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new client)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName}{" "}
//                       {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking Details (Consolidated) */}
//           <div className="border-t pt-2">
//             <h3 className="font-semibold">Booking Details</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Booking Amount </Label>
//               <Input
//                 type="number"
//                 value={form.bookingAmount}
//                 onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                 placeholder="e.g. 100000"
//               />
//             </div>
//             <div>
//               <Label>Payment Mode</Label>
//               <Select
//                 value={form.paymentMode}
//                 onValueChange={(v) => updateForm("paymentMode", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select payment mode" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE).map((mode) => (
//                     <SelectItem key={mode} value={mode}>
//                       {mode}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.transactionId}
//                 onChange={(e) => updateForm("transactionId", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input
//                 type="date"
//                 value={form.agreementDate}
//                 onChange={(e) => updateForm("agreementDate", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.nomineeName}
//                 onChange={(e) => updateForm("nomineeName", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.nomineeRelation}
//                 onChange={(e) => updateForm("nomineeRelation", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.keyNumber}
//                 onChange={(e) => updateForm("keyNumber", e.target.value)}
//               />
//             </div>
// {/*
//             <div>
//               <Label>Payment Model</Label>
//               <Select
//                 value={form.paymentModel}
//                 onValueChange={(v) => updateForm("paymentModel", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select model" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {PAYMENT_MODEL_OPTIONS.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div> */}

//             <div>
//               <Label>Business Code</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.businessCode}
//                 onChange={(e) => updateForm("businessCode", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.businessName}
//                 onChange={(e) => updateForm("businessName", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select
//                 value={form.teamManager}
//                 onValueChange={(v) => updateForm("teamManager", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select manager" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {teamManagers.map((mgr) => (
//                     <SelectItem key={mgr._id} value={mgr._id}>
//                       {mgr.name || mgr.email} ({mgr.role})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Service Tax Paid (₹)</Label>
//               <Input
//                 type="number"
//                 placeholder="Optional"
//                 value={form.serviceTaxPaid}
//                 onChange={(e) => updateForm("serviceTaxPaid", e.target.value)}
//               />
//             </div>
//             <div>
//               <Label>GST Paid (₹)</Label>
//               <Input
//                 type="number"
//                 placeholder="Optional"
//                 value={form.gstPaid}
//                 onChange={(e) => updateForm("gstPaid", e.target.value)}
//               />
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.remarks}
//                 onChange={(e) => updateForm("remarks", e.target.value)}
//               />
//             </div>
//           </div>

//           {/* New Client Fields (only when no lead) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Client Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Client Name"
//                   value={form.clientName}
//                   onChange={(e) => updateForm("clientName", e.target.value)}
//                 />
//                 <Input
//                   type="email"
//                   placeholder="Email"
//                   value={form.clientEmail}
//                   onChange={(e) => updateForm("clientEmail", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Phone"
//                   value={form.clientPhone}
//                   onChange={(e) => updateForm("clientPhone", e.target.value)}
//                 />
//                 <Input
//                   type="password"
//                   placeholder="Password"
//                   value={form.clientPassword}
//                   onChange={(e) => updateForm("clientPassword", e.target.value)}
//                 />
//               </div>

//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   type="date"
//                   placeholder="Date of Birth"
//                   value={form.dateOfBirth}
//                   onChange={(e) => updateForm("dateOfBirth", e.target.value)}
//                 />
//                 <Select
//                   value={form.gender}
//                   onValueChange={(v) => updateForm("gender", v)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Gender" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={form.bloodGroup}
//                   onValueChange={(v) => updateForm("bloodGroup", v)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Blood Group" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
//                       (bg) => (
//                         <SelectItem key={bg} value={bg}>
//                           {bg}
//                         </SelectItem>
//                       ),
//                     )}
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={form.maritalStatus}
//                   onValueChange={(v) => updateForm("maritalStatus", v)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Marital Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input
//                   placeholder="Aadhar Number"
//                   value={form.aadharNumber}
//                   onChange={(e) => updateForm("aadharNumber", e.target.value)}
//                 />
//                 <Input
//                   placeholder="PAN Number"
//                   value={form.panNumber}
//                   onChange={(e) => updateForm("panNumber", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Father's Name"
//                   value={form.fatherName}
//                   onChange={(e) => updateForm("fatherName", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Mother's Name"
//                   value={form.motherName}
//                   onChange={(e) => updateForm("motherName", e.target.value)}
//                 />
//               </div>

//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Emergency Contact Name"
//                   value={form.emergencyContactName}
//                   onChange={(e) =>
//                     updateForm("emergencyContactName", e.target.value)
//                   }
//                 />
//                 <Input
//                   placeholder="Emergency Contact Phone"
//                   value={form.emergencyContactPhone}
//                   onChange={(e) =>
//                     updateForm("emergencyContactPhone", e.target.value)
//                   }
//                 />
//                 <Input
//                   placeholder="Relationship"
//                   value={form.emergencyContactRelation}
//                   onChange={(e) =>
//                     updateForm("emergencyContactRelation", e.target.value)
//                   }
//                 />
//               </div>

//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Address Line 1"
//                   value={form.addressLine1}
//                   onChange={(e) => updateForm("addressLine1", e.target.value)}
//                 />
//                 <Input
//                   placeholder="City"
//                   value={form.city}
//                   onChange={(e) => updateForm("city", e.target.value)}
//                 />
//                 <Input
//                   placeholder="State"
//                   value={form.state}
//                   onChange={(e) => updateForm("state", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Country"
//                   value={form.country}
//                   onChange={(e) => updateForm("country", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Pincode"
//                   value={form.pincode}
//                   onChange={(e) => updateForm("pincode", e.target.value)}
//                 />
//               </div>

//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Bank Name"
//                   value={form.bankName}
//                   onChange={(e) => updateForm("bankName", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Account Number"
//                   value={form.accountNumber}
//                   onChange={(e) => updateForm("accountNumber", e.target.value)}
//                 />
//                 <Input
//                   placeholder="IFSC Code"
//                   value={form.ifscCode}
//                   onChange={(e) => updateForm("ifscCode", e.target.value)}
//                 />
//                 <Input
//                   placeholder="UPI ID"
//                   value={form.upiId}
//                   onChange={(e) => updateForm("upiId", e.target.value)}
//                 />
//                 <Input
//                   placeholder="Account Holder Name"
//                   value={form.accountHolderName}
//                   onChange={(e) =>
//                     updateForm("accountHolderName", e.target.value)
//                   }
//                 />
//                 <Select
//                   value={form.accountType}
//                   onValueChange={(v) => updateForm("accountType", v)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Account Type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input
//                   placeholder="Branch Name"
//                   value={form.branchName}
//                   onChange={(e) => updateForm("branchName", e.target.value)}
//                 />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Creating..." : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// src/components/booking/CreateBookingDialog.jsx
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
import { projectApi, authApi } from "@/api";
import { bookingApi } from "@/api/bookingApi";
import { PAYMENT_MODE } from "@/data/constants/booking";
import { formatINR } from "@/lib/helpers";
import { toast } from "sonner";
import { useLeadList } from "@/hooks/useLeadList";
import { Trash2, Plus } from "lucide-react";

export function CreateBookingDialog({ open, onOpenChange, onSuccess }) {
  const [projects, setProjects] = useState([]);
  const [towers, setTowers] = useState([]);
  const [floors, setFloors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teamManagers, setTeamManagers] = useState([]);

  const initialForm = {
    // Flat selection
    projectId: "",
    towerName: "",
    floor: "",
    flatId: "",

    // Booking core
    bookingAmount: "",
    paymentMode: "",
    agreementDate: "",
    nomineeName: "",
    nomineeRelation: "",

    // New booking-level fields
    keyNumber: "",
    businessCode: "",
    businessName: "",
    teamManager: "",
    serviceTaxPaid: "",
    gstPaid: "",
    remarks: "",
    transactionId: "",

    // Lead or client
    leadId: "",
    // New client fields (only when no lead)
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientPassword: "",

    // Personal details
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
    addressLine1: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",

    // Bank details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    accountHolderName: "",
    accountType: "",
    branchName: "",

    // ---- NEW: Installment plan ----
    useCustomPlan: false,
    installments: [], // array of { installmentNumber, description, amount, dueDate }
  };

  const [form, setForm] = useState(initialForm);

  const resetForm = () => {
    setForm(initialForm);
    setTowers([]);
    setFloors([]);
    setFlats([]);
    setSelectedFlat(null);
  };

  const { leads, loading: leadsLoading } = useLeadList();

  const fetchProjects = async () => {
    try {
      const res = await projectApi.getAll();
      if (res.data.success) {
        setProjects(res.data.data?.projects || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    }
  };

  const fetchTeamManagers = async () => {
    try {
      const res = await authApi.getUsers();
      if (res.data.success) {
        const managers = res.data.data?.users?.filter(
          (user) =>
            user.role?.includes("manager") ||
            user.role === "manager" ||
            user.role === "admin",
        );
        setTeamManagers(managers || []);
      }
    } catch (err) {
      console.error("Failed to fetch team managers", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProjects();
      fetchTeamManagers();
    } else {
      resetForm();
    }
  }, [open]);

  // Populate towers when project changes
  useEffect(() => {
    if (form.projectId) {
      const project = projects.find((p) => p._id === form.projectId);
      if (project?.towers?.length) {
        setTowers(project.towers);
        setFloors([]);
        setFlats([]);
        setSelectedFlat(null);
        setForm((prev) => ({
          ...prev,
          towerName: "",
          floor: "",
          flatId: "",
        }));
      } else {
        setTowers([]);
        setFloors([]);
        setFlats([]);
        setSelectedFlat(null);
      }
    } else {
      setTowers([]);
      setFloors([]);
      setFlats([]);
      setSelectedFlat(null);
    }
  }, [form.projectId, projects]);

  // Populate floors when tower changes
  useEffect(() => {
    if (form.towerName) {
      const tower = towers.find((t) => t.towerName === form.towerName);
      if (tower) {
        setFloors(tower.floors || []);
        setFlats([]);
        setSelectedFlat(null);
        setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
      } else {
        setFloors([]);
        setFlats([]);
        setSelectedFlat(null);
      }
    } else {
      setFloors([]);
      setFlats([]);
      setSelectedFlat(null);
    }
  }, [form.towerName, towers]);

  // Populate flats when floor changes
  useEffect(() => {
    if (form.floor !== "" && form.floor !== undefined) {
      const floor = floors.find((f) => String(f.floorNumber) === form.floor);
      if (floor) {
        const availableFlats = floor.flats.filter(
          (f) => f.status === "available",
        );
        setFlats(floor?.flats);
        setSelectedFlat(null);
        setForm((prev) => ({ ...prev, flatId: "" }));
      } else {
        setFlats([]);
        setSelectedFlat(null);
      }
    } else {
      setFlats([]);
      setSelectedFlat(null);
    }
  }, [form.floor, floors]);

  // Store selected flat object when flatId changes
  useEffect(() => {
    if (form.flatId && flats.length) {
      const flat = flats.find((f) => f._id === form.flatId);
      setSelectedFlat(flat || null);
    } else {
      setSelectedFlat(null);
    }
  }, [form.flatId, flats]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ---- Installment plan helpers ----
  const addInstallment = () => {
    const newNumber = form.installments.length + 1;
    const newInstallment = {
      installmentNumber: newNumber,
      description: "",
      amount: "",
      dueDate: "",
    };
    setForm((prev) => ({
      ...prev,
      installments: [...prev.installments, newInstallment],
    }));
  };

  const removeInstallment = (index) => {
    if (form.installments.length <= 1) {
      toast.warning("At least one installment is required");
      return;
    }
    const updated = form.installments.filter((_, i) => i !== index);
    // Re-number
    const renumbered = updated.map((inst, idx) => ({
      ...inst,
      installmentNumber: idx + 1,
    }));
    setForm((prev) => ({
      ...prev,
      installments: renumbered,
    }));
  };

  const updateInstallment = (index, field, value) => {
    const updated = [...form.installments];
    updated[index][field] = value;
    setForm((prev) => ({
      ...prev,
      installments: updated,
    }));
  };

  const getTotalInstallmentAmount = () => {
    return form.installments.reduce(
      (sum, inst) => sum + (parseFloat(inst.amount) || 0),
      0,
    );
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    // Basic validation
    if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
      toast.error("Project, Tower, Floor, and Flat are required");
      return;
    }

    // Custom plan validation
    if (form.useCustomPlan) {
      if (form.installments.length === 0) {
        toast.error("Please add at least one installment");
        return;
      }
      // Check each installment has required fields
      const invalid = form.installments.some(
        (inst) => !inst.description || !inst.amount
      );
      if (invalid) {
        toast.error(
          "All installment fields (description, amount, due date) are required",
        );
        return;
      }
      // Optionally warn if total doesn't match flat price
      const total = getTotalInstallmentAmount();
      // if (selectedFlat && total !== selectedFlat.price) {
      //   toast.warning(
      //     `Total installment amount (${formatINR(total)}) does not match flat price (${formatINR(selectedFlat.price)}). Backend will validate.`,
      //   );
      // }
    }

    setLoading(true);

    // Base payload
    const payload = {
      projectId: form.projectId,
      flatId: form.flatId,
      bookingAmount: Number(form.bookingAmount),
      paymentMode: form.paymentMode,
      agreementDate: form.agreementDate || undefined,
      nomineeName: form.nomineeName || undefined,
      nomineeRelation: form.nomineeRelation || undefined,
      keyNumber: form.keyNumber || undefined,
      businessCode: form.businessCode || undefined,
      businessName: form.businessName || undefined,
      teamManager: form.teamManager || undefined,
      serviceTaxPaid: form.serviceTaxPaid
        ? Number(form.serviceTaxPaid)
        : undefined,
      gstPaid: form.gstPaid ? Number(form.gstPaid) : undefined,
      remarks: form.remarks || undefined,
      transactionId: form.transactionId || undefined,
    };

    // Add installment plan if custom is enabled
    if (form.useCustomPlan && form.installments.length > 0) {
      const installments = form.installments.map((inst) => ({
        installmentNumber: inst.installmentNumber,
        description: inst.description,
        amount: Number(inst.amount),
        dueDate: inst.dueDate,
      }));
      payload.installmentPlan = { installments };
    }

    // Lead or client
    if (form.leadId) {
      payload.leadId = form.leadId;
    } else {
      payload.clientName = form.clientName;
      payload.clientEmail = form.clientEmail;
      payload.clientPhone = form.clientPhone;
      payload.clientPassword = form.clientPassword;

      // Personal details
      const personalDetails = {};
      if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
      if (form.gender) personalDetails.gender = form.gender;
      if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
      if (form.maritalStatus)
        personalDetails.maritalStatus = form.maritalStatus;
      if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
      if (form.panNumber) personalDetails.panNumber = form.panNumber;
      if (form.fatherName) personalDetails.fatherName = form.fatherName;
      if (form.motherName) personalDetails.motherName = form.motherName;
      if (form.emergencyContactName)
        personalDetails.emergencyContactName = form.emergencyContactName;
      if (form.emergencyContactPhone)
        personalDetails.emergencyContactPhone = form.emergencyContactPhone;
      if (form.emergencyContactRelation)
        personalDetails.emergencyContactRelation =
          form.emergencyContactRelation;

      if (form.addressLine1 || form.city || form.state || form.pincode) {
        personalDetails.permanentAddress = {
          line1: form.addressLine1 || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          country: form.country || "India",
          pincode: form.pincode || undefined,
        };
      }

      if (Object.keys(personalDetails).length) {
        payload.personalDetails = personalDetails;
      }

      const bankDetails = {};
      if (form.bankName) bankDetails.bankName = form.bankName;
      if (form.accountNumber) bankDetails.accountNumber = form.accountNumber;
      if (form.ifscCode) bankDetails.ifscCode = form.ifscCode;
      if (form.upiId) bankDetails.upiId = form.upiId;
      if (form.accountHolderName)
        bankDetails.accountHolderName = form.accountHolderName;
      if (form.accountType) bankDetails.accountType = form.accountType;
      if (form.branchName) bankDetails.branchName = form.branchName;

      if (Object.keys(bankDetails).length) {
        payload.bankDetails = bankDetails;
      }
    }

    try {
      const res = await bookingApi.createBooking(payload);
      toast.success("Booking created successfully");
      onSuccess?.(res.data?.data);
      onOpenChange(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-1">
          {/* Flat Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project *</Label>
              <Select
                value={form.projectId}
                onValueChange={(v) => {
                  updateForm("projectId", v);
                  updateForm("towerName", "");
                  updateForm("floor", "");
                  updateForm("flatId", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
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

            <div>
              <Label>Tower *</Label>
              <Select
                value={form.towerName}
                onValueChange={(v) => {
                  updateForm("towerName", v);
                  updateForm("floor", "");
                  updateForm("flatId", "");
                }}
                disabled={!form.projectId || towers.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tower" />
                </SelectTrigger>
                <SelectContent>
                  {towers.map((t) => (
                    <SelectItem key={t.towerName} value={t.towerName}>
                      {t.towerName} ({t.totalFloors || t.floors?.length} floors)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Floor *</Label>
              <Select
                value={form.floor.toString()}
                onValueChange={(v) => {
                  updateForm("floor", v);
                  updateForm("flatId", "");
                }}
                disabled={!form.towerName || floors.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((f) => (
                    <SelectItem
                      key={f.floorNumber}
                      value={f.floorNumber.toString()}
                    >
                      Floor {f.floorNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Flat *</Label>
              <Select
                value={form.flatId}
                onValueChange={(v) => updateForm("flatId", v)}
                disabled={!form.floor || flats.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select flat" />
                </SelectTrigger>
                <SelectContent>
                  {flats.map((f) => (
                    <SelectItem key={f._id} value={f._id} disabled={f.status !== "available"}>
                      {f.flatNumber} - {f.bedrooms} BHK - {f.area} sqft -{" "}
                      {formatINR(f.price)} - ({f.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Flat Summary */}
          {selectedFlat && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-muted/40 rounded-md">
              <div>
                <Label className="text-xs">Flat No.</Label>
                <p className="text-sm font-medium">{selectedFlat.flatNumber}</p>
              </div>
              <div>
                <Label className="text-xs">Area (sqft)</Label>
                <p className="text-sm font-medium">{selectedFlat.area}</p>
              </div>
              <div>
                <Label className="text-xs">Bedrooms</Label>
                <p className="text-sm font-medium">{selectedFlat.bedrooms}</p>
              </div>
              <div>
                <Label className="text-xs">Bathrooms</Label>
                <p className="text-sm font-medium">{selectedFlat.bathrooms}</p>
              </div>
              <div>
                <Label className="text-xs">Price</Label>
                <p className="text-sm font-medium">
                  {formatINR(selectedFlat.price)}
                </p>
              </div>
              <div>
                <Label className="text-xs">Facing</Label>
                <p className="text-sm font-medium">
                  {selectedFlat.features?.facing || "-"}
                </p>
              </div>
              <div>
                <Label className="text-xs">Furnished</Label>
                <p className="text-sm font-medium capitalize">
                  {selectedFlat.features?.furnished || "unfurnished"}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 flex gap-4 text-sm">
                <span>
                  Parking: {selectedFlat.features?.parking ? "Yes" : "No"}
                </span>
                <span>
                  Balcony: {selectedFlat.features?.balcony ? "Yes" : "No"}
                </span>
              </div>
            </div>
          )}

          {/* Lead Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Lead (Optional)</Label>
              <Select
                value={form.leadId || "none"}
                onValueChange={(v) =>
                  updateForm("leadId", v === "none" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Create new buyer)</SelectItem>
                  {leads?.map((lead) => (
                    <SelectItem key={lead._id} value={lead._id}>
                      {lead.clientName}{" "}
                      {lead.clientPhone ? `(${lead.clientPhone})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Booking Details (Consolidated) */}
          <div className="border-t pt-2">
            <h3 className="font-semibold">Booking Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Booking Amount </Label>
              <Input
                type="number"
                value={form.bookingAmount}
                onChange={(e) => updateForm("bookingAmount", e.target.value)}
                placeholder="e.g. 100000"
              />
            </div>
            <div>
              <Label>Payment Mode</Label>
              <Select
                value={form.paymentMode}
                onValueChange={(v) => updateForm("paymentMode", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PAYMENT_MODE).map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transaction ID</Label>
              <Input
                placeholder="Optional"
                value={form.transactionId}
                onChange={(e) => updateForm("transactionId", e.target.value)}
              />
            </div>
            <div>
              <Label>Agreement Date</Label>
              <Input
                type="date"
                value={form.agreementDate}
                onChange={(e) => updateForm("agreementDate", e.target.value)}
              />
            </div>
            <div>
              <Label>Nominee Name</Label>
              <Input
                placeholder="Optional"
                value={form.nomineeName}
                onChange={(e) => updateForm("nomineeName", e.target.value)}
              />
            </div>
            <div>
              <Label>Nominee Relation</Label>
              <Input
                placeholder="Optional"
                value={form.nomineeRelation}
                onChange={(e) => updateForm("nomineeRelation", e.target.value)}
              />
            </div>
            <div>
              <Label>Key Number (KYC ID)</Label>
              <Input
                placeholder="Optional"
                value={form.keyNumber}
                onChange={(e) => updateForm("keyNumber", e.target.value)}
              />
            </div>

            <div>
              <Label>Business Code</Label>
              <Input
                placeholder="Optional"
                value={form.businessCode}
                onChange={(e) => updateForm("businessCode", e.target.value)}
              />
            </div>
            <div>
              <Label>Business Name</Label>
              <Input
                placeholder="Optional"
                value={form.businessName}
                onChange={(e) => updateForm("businessName", e.target.value)}
              />
            </div>
            <div>
              <Label>Team Manager</Label>
              <Select
                value={form.teamManager}
                onValueChange={(v) => updateForm("teamManager", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {teamManagers.map((mgr) => (
                    <SelectItem key={mgr._id} value={mgr._id}>
                      {mgr.name || mgr.email} ({mgr.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Service Tax Paid (₹)</Label>
              <Input
                type="number"
                placeholder="Optional"
                value={form.serviceTaxPaid}
                onChange={(e) => updateForm("serviceTaxPaid", e.target.value)}
              />
            </div>
            <div>
              <Label>GST Paid (₹)</Label>
              <Input
                type="number"
                placeholder="Optional"
                value={form.gstPaid}
                onChange={(e) => updateForm("gstPaid", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Remarks</Label>
              <Input
                placeholder="Optional"
                value={form.remarks}
                onChange={(e) => updateForm("remarks", e.target.value)}
              />
            </div>
          </div>

          {/* ---- NEW: Custom Installment Plan Section ---- */}
          <div className="border-t pt-2">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold">Installment Plan</h3>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.useCustomPlan}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked && form.installments.length === 0) {
                      // Pre‑fill with one empty row for convenience
                      addInstallment();
                    }
                    updateForm("useCustomPlan", checked);
                  }}
                  className="w-4 h-4"
                />
                <span>Custom plan</span>
              </label>
              <span className="text-xs text-muted-foreground">
                (If unchecked, backend will create 3 equal installments)
              </span>
            </div>

            {form.useCustomPlan && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Total installment amount:{" "}
                    <span className="font-medium text-foreground">
                      {formatINR(getTotalInstallmentAmount())}
                    </span>
                    {selectedFlat && (
                      <span className="ml-2 text-xs">
                        (Flat price: {formatINR(selectedFlat.price)})
                      </span>
                    )}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addInstallment}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {form.installments.map((inst, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md"
                    >
                      <div className="col-span-1 text-sm font-medium text-center">
                        {inst.installmentNumber}
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="Description"
                          value={inst.description}
                          onChange={(e) =>
                            updateInstallment(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={inst.amount}
                          onChange={(e) =>
                            updateInstallment(index, "amount", e.target.value)
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="date"
                          value={inst.dueDate}
                          onChange={(e) =>
                            updateInstallment(index, "dueDate", e.target.value)
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInstallment(index)}
                          className="h-8 w-8 p-0 text-destructive"
                          disabled={form.installments.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {form.installments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No installments added. Click "Add" to start.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* New Client Fields (only when no lead) */}
          {!form.leadId && (
            <>
              <div className="border-t pt-2">
                <h3 className="font-semibold">Buyer Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Buyer Name"
                  value={form.clientName}
                  onChange={(e) => updateForm("clientName", e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={form.clientEmail}
                  onChange={(e) => updateForm("clientEmail", e.target.value)}
                />
                <Input
                  placeholder="Phone"
                  value={form.clientPhone}
                  onChange={(e) => updateForm("clientPhone", e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={form.clientPassword}
                  onChange={(e) => updateForm("clientPassword", e.target.value)}
                />
              </div>

              <div className="border-t pt-2">
                <h3 className="font-semibold">Personal Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Date of Birth"
                  value={form.dateOfBirth}
                  onChange={(e) => updateForm("dateOfBirth", e.target.value)}
                />
                <Select
                  value={form.gender}
                  onValueChange={(v) => updateForm("gender", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={form.bloodGroup}
                  onValueChange={(v) => updateForm("bloodGroup", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Blood Group" />
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
                <Select
                  value={form.maritalStatus}
                  onValueChange={(v) => updateForm("maritalStatus", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Aadhar Number"
                  value={form.aadharNumber}
                  onChange={(e) => updateForm("aadharNumber", e.target.value)}
                />
                <Input
                  placeholder="PAN Number"
                  value={form.panNumber}
                  onChange={(e) => updateForm("panNumber", e.target.value)}
                />
                <Input
                  placeholder="Father's Name"
                  value={form.fatherName}
                  onChange={(e) => updateForm("fatherName", e.target.value)}
                />
                <Input
                  placeholder="Mother's Name"
                  value={form.motherName}
                  onChange={(e) => updateForm("motherName", e.target.value)}
                />
              </div>

              <div className="border-t pt-2">
                <h3 className="font-semibold">Emergency Contact</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Emergency Contact Name"
                  value={form.emergencyContactName}
                  onChange={(e) =>
                    updateForm("emergencyContactName", e.target.value)
                  }
                />
                <Input
                  placeholder="Emergency Contact Phone"
                  value={form.emergencyContactPhone}
                  onChange={(e) =>
                    updateForm("emergencyContactPhone", e.target.value)
                  }
                />
                <Input
                  placeholder="Relationship"
                  value={form.emergencyContactRelation}
                  onChange={(e) =>
                    updateForm("emergencyContactRelation", e.target.value)
                  }
                />
              </div>

              <div className="border-t pt-2">
                <h3 className="font-semibold">Permanent Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Address Line 1"
                  value={form.addressLine1}
                  onChange={(e) => updateForm("addressLine1", e.target.value)}
                />
                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                />
                <Input
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                />
                <Input
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => updateForm("country", e.target.value)}
                />
                <Input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(e) => updateForm("pincode", e.target.value)}
                />
              </div>

              <div className="border-t pt-2">
                <h3 className="font-semibold">Bank Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Bank Name"
                  value={form.bankName}
                  onChange={(e) => updateForm("bankName", e.target.value)}
                />
                <Input
                  placeholder="Account Number"
                  value={form.accountNumber}
                  onChange={(e) => updateForm("accountNumber", e.target.value)}
                />
                <Input
                  placeholder="IFSC Code"
                  value={form.ifscCode}
                  onChange={(e) => updateForm("ifscCode", e.target.value)}
                />
                <Input
                  placeholder="UPI ID"
                  value={form.upiId}
                  onChange={(e) => updateForm("upiId", e.target.value)}
                />
                <Input
                  placeholder="Account Holder Name"
                  value={form.accountHolderName}
                  onChange={(e) =>
                    updateForm("accountHolderName", e.target.value)
                  }
                />
                <Select
                  value={form.accountType}
                  onValueChange={(v) => updateForm("accountType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Current">Current</SelectItem>
                    <SelectItem value="Salary">Salary</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Branch Name"
                  value={form.branchName}
                  onChange={(e) => updateForm("branchName", e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
