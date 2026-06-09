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
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import { useLead } from "@/hooks/useLead";
// import { projectApi } from "@/api";
// import { toast } from "sonner";

// const emptyLead = {
//   clientName: "",
//   clientPhone: "",
//   clientEmail: "",
//   source: "direct",
//   interestedProject: "",
//   interestedTower: "",
//   interestedFloor: "",
//   interestedFlat: "",
//   interestedUnit: "",
//   budgetRange: "",
//   notes: "",
//   followUpDate: "",
//   campaignName: "",
//   referralCode: "",
//   personalDetails: {
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
//     permanentAddress: {
//       line1: "",
//       city: "",
//       state: "",
//       country: "India",
//       pincode: "",
//     },
//   },
//   bankDetails: {
//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "Savings",
//     branchName: "",
//   },
// };

// const LeadFormModal = ({
//   canEdit,
//   open,
//   onOpenChange,
//   editingLead,
//   onSuccess,
// }) => {
//   const { createLead, updateLead } = useLead();
//   const [form, setForm] = useState(emptyLead);
//   const [projects, setProjects] = useState([]);
//   const [sections, setSections] = useState({ personal: false, bank: false });
//   const [loading, setLoading] = useState(false);

//   const selectedProject = projects.find(
//     (p) => p._id === form.interestedProject,
//   );
//   const towers = selectedProject?.towers || [];
//   const selectedTower = towers.find(
//     (t) => t.towerName === form.interestedTower,
//   );
//   const floors = selectedTower?.floors || [];
//   const selectedFloor = floors.find(
//     (f) => f.floorNumber.toString() === form.interestedFloor,
//   );
//   const flats = selectedFloor?.flats || [];

//   useEffect(() => {
//     if (open) {
//       projectApi
//         .getAll()
//         .then((res) => setProjects(res.data?.data?.projects || []))
//         .catch(console.error);
//       if (editingLead) {
//         setForm({
//           ...emptyLead,
//           clientName: editingLead.clientName || "",
//           clientPhone: editingLead.clientPhone || "",
//           clientEmail: editingLead.clientEmail || "",
//           source: editingLead.source || "direct",
//           interestedProject:
//             editingLead.interestedProject?._id ||
//             editingLead.interestedProject ||
//             "",
//           interestedTower: editingLead.interestedTower || "",
//           interestedFloor: editingLead.interestedFloor || "",
//           interestedFlat:
//             editingLead.interestedFlat || editingLead.interestedUnit || "",
//           interestedUnit: editingLead.interestedUnit || "",
//           budgetRange: editingLead.budgetRange || "",
//           notes: editingLead.notes || "",
//           followUpDate: editingLead.followUpDate || "",
//           campaignName: editingLead.campaignName || "",
//           referralCode: editingLead.referralCode || "",
//           personalDetails:
//             editingLead.personalDetails || emptyLead.personalDetails,
//           bankDetails: editingLead.bankDetails || emptyLead.bankDetails,
//         });
//       } else {
//         setForm(emptyLead);
//       }
//     }
//   }, [open, editingLead]);

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleNestedChange = (section, subField, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [section]: { ...prev[section], [subField]: value },
//     }));
//   };

//   const handleAddressChange = (field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       personalDetails: {
//         ...prev.personalDetails,
//         permanentAddress: {
//           ...prev.personalDetails.permanentAddress,
//           [field]: value,
//         },
//       },
//     }));
//   };

//   const toggleSection = (section) => {
//     setSections((prev) => ({ ...prev, [section]: !prev[section] }));
//   };

//   const handleProjectChange = (projectId) => {
//     setForm((prev) => ({
//       ...prev,
//       interestedProject: projectId,
//       interestedTower: "",
//       interestedFloor: "",
//       interestedFlat: "",
//     }));
//   };

//   const handleTowerChange = (towerName) => {
//     setForm((prev) => ({
//       ...prev,
//       interestedTower: towerName,
//       interestedFloor: "",
//       interestedFlat: "",
//     }));
//   };

//   const handleFloorChange = (floorNumber) => {
//     setForm((prev) => ({
//       ...prev,
//       interestedFloor: floorNumber,
//       interestedFlat: "",
//     }));
//   };

//   const handleFlatChange = (flatNumber) => {
//     setForm((prev) => ({ ...prev, interestedFlat: flatNumber }));
//   };

//   const handleSubmit = async () => {
//     if (!form.clientName.trim()) {
//       toast.error("Lead name is required");
//       return;
//     }
//     setLoading(true);
//     let res;
//     if (editingLead) {
//       // Edit mode: only status and notes allowed
//       res = await updateLead(
//         editingLead._id,
//         {
//           status: form.status,
//           notes: form.notes,
//         },
//         !canEdit,
//       );
//     } else {
//       // Create mode: full payload
//       const payload = {
//         clientName: form.clientName,
//         clientPhone: form.clientPhone || undefined,
//         clientEmail: form.clientEmail || undefined,
//         source: form.source,
//         interestedProject: form.interestedProject || undefined,
//         interestedTower: form.interestedTower || undefined,
//         interestedFloor: Number(form.interestedFloor) || undefined,
//         interestedFlat: form.interestedFlat || undefined,
//         // interestedUnit: form.interestedUnit || undefined,
//         budgetRange: form.budgetRange || undefined,
//         notes: form.notes || undefined,
//         followUpDate: form.followUpDate || undefined,
//         campaignName: form.campaignName || undefined,
//         referralCode: form.referralCode || undefined,
//         personalDetails: {
//           dateOfBirth: form.personalDetails.dateOfBirth || undefined,
//           gender: form.personalDetails.gender || undefined,
//           bloodGroup: form.personalDetails.bloodGroup || undefined,
//           maritalStatus: form.personalDetails.maritalStatus || undefined,
//           aadharNumber: form.personalDetails.aadharNumber || undefined,
//           panNumber: form.personalDetails.panNumber || undefined,
//           fatherName: form.personalDetails.fatherName || undefined,
//           motherName: form.personalDetails.motherName || undefined,
//           emergencyContactName:
//             form.personalDetails.emergencyContactName || undefined,
//           emergencyContactPhone:
//             form.personalDetails.emergencyContactPhone || undefined,
//           emergencyContactRelation:
//             form.personalDetails.emergencyContactRelation || undefined,
//           permanentAddress: {
//             line1: form.personalDetails.permanentAddress.line1 || undefined,
//             city: form.personalDetails.permanentAddress.city || undefined,
//             state: form.personalDetails.permanentAddress.state || undefined,
//             country: form.personalDetails.permanentAddress.country || "India",
//             pincode: form.personalDetails.permanentAddress.pincode || undefined,
//           },
//         },
//         bankDetails: {
//           bankName: form.bankDetails.bankName || undefined,
//           accountNumber: form.bankDetails.accountNumber || undefined,
//           ifscCode: form.bankDetails.ifscCode || undefined,
//           upiId: form.bankDetails.upiId || undefined,
//           accountHolderName: form.bankDetails.accountHolderName || undefined,
//           accountType: form.bankDetails.accountType || undefined,
//           branchName: form.bankDetails.branchName || undefined,
//         },
//       };
//       res = await createLead(payload, !canEdit);
//     }
//     setLoading(false);
//     if (res) {
//       onSuccess?.();
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col p-4 sm:p-6 rounded-lg">
//         <DialogHeader>
//           <DialogTitle>
//             {editingLead ? "Edit Lead" : "Create New Lead"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex-1 overflow-y-auto py-1 px-1 space-y-4 text-sm">
//           {/* Basic Info */}
//           <div className="space-y-3 border rounded-md p-3">
//             <h4 className="font-medium text-sm">Basic Information</h4>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <Label>Lead / Client Name *</Label>
//                 <Input
//                   value={form.clientName}
//                   onChange={(e) => handleChange("clientName", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label>Phone Number</Label>
//                 <Input
//                   value={form.clientPhone}
//                   onChange={(e) => handleChange("clientPhone", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label>Email Address</Label>
//                 <Input
//                   type="email"
//                   value={form.clientEmail}
//                   onChange={(e) => handleChange("clientEmail", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label>Lead Source</Label>
//                 <Select
//                   value={form.source}
//                   onValueChange={(v) => handleChange("source", v)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="direct">Direct</SelectItem>
//                     <SelectItem value="employee">Employee</SelectItem>
//                     <SelectItem value="referral">Referral</SelectItem>
//                     <SelectItem value="website">Website</SelectItem>
//                     <SelectItem value="social_media">Social Media</SelectItem>
//                     <SelectItem value="cold_call">Cold Call</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-1.5">
//                 <Label>Budget Range</Label>
//                 <Input
//                   placeholder="e.g., 50-70 Lakhs"
//                   value={form.budgetRange}
//                   onChange={(e) => handleChange("budgetRange", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label>Follow-up Date</Label>
//                 <Input
//                   type="date"
//                   value={form.followUpDate}
//                   onChange={(e) => handleChange("followUpDate", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label>Campaign Name</Label>
//                 <Input
//                   value={form.campaignName}
//                   onChange={(e) => handleChange("campaignName", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label>Referral Code</Label>
//                 <Input
//                   value={form.referralCode}
//                   onChange={(e) => handleChange("referralCode", e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Project Interest */}
//           <div className="space-y-3 border rounded-md p-3">
//             <h4 className="font-medium text-sm">Project Interest</h4>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <Label>Interested Project</Label>
//                 <Select
//                   value={form.interestedProject}
//                   onValueChange={handleProjectChange}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select project" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {projects.map((p) => (
//                       <SelectItem key={p._id} value={p._id}>
//                         {p.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Tower – shown only when a project is selected */}
//               {form.interestedProject && (
//                 <div className="space-y-1.5">
//                   <Label>Interested Tower</Label>
//                   <Select
//                     value={form.interestedTower}
//                     onValueChange={handleTowerChange}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select tower" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {towers.map((t) => (
//                         <SelectItem key={t.towerName} value={t.towerName}>
//                           {t.towerName}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}

//               {/* Floor – shown only when a tower is selected */}
//               {form.interestedTower && (
//                 <div className="space-y-1.5">
//                   <Label>Interested Floor</Label>
//                   <Select
//                     value={form.interestedFloor}
//                     onValueChange={handleFloorChange}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select floor" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {floors.map((f) => (
//                         <SelectItem
//                           key={f.floorNumber}
//                           value={f.floorNumber.toString()}
//                         >
//                           Floor {f.floorNumber}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}

//               {/* Flat – shown only when a floor is selected */}
//               {form.interestedFloor && (
//                 <div className="space-y-1.5">
//                   <Label>Interested Flat</Label>
//                   <Select
//                     value={form.interestedFlat}
//                     onValueChange={handleFlatChange}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select flat" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {flats.map((flat) => (
//                         <SelectItem
//                           key={flat.flatNumber}
//                           value={flat.flatNumber}
//                         >
//                           {flat.flatNumber} ({flat.area} sqft, ₹{flat.price})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Personal Details (collapsible) */}
//           <div className="border rounded-md p-3">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleSection("personal")}
//             >
//               <h4 className="font-medium text-sm">Personal Details</h4>
//               {sections.personal ? (
//                 <ChevronDown className="h-4 w-4" />
//               ) : (
//                 <ChevronRight className="h-4 w-4" />
//               )}
//             </div>
//             {sections.personal && (
//               <div className="mt-3 space-y-3">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <div className="space-y-1.5">
//                     <Label>Date of Birth</Label>
//                     <Input
//                       type="date"
//                       value={form.personalDetails.dateOfBirth}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "dateOfBirth",
//                           e.target.value,
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="space-y-1.5">
//                     <Label>Gender</Label>
//                     <Select
//                       value={form.personalDetails.gender}
//                       onValueChange={(v) =>
//                         handleNestedChange("personalDetails", "gender", v)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Male">Male</SelectItem>
//                         <SelectItem value="Female">Female</SelectItem>
//                         <SelectItem value="Other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1.5">
//                     <Label>Blood Group</Label>
//                     <Select
//                       value={form.personalDetails.bloodGroup}
//                       onValueChange={(v) =>
//                         handleNestedChange("personalDetails", "bloodGroup", v)
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
//                           (bg) => (
//                             <SelectItem key={bg} value={bg}>
//                               {bg}
//                             </SelectItem>
//                           ),
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1.5">
//                     <Label>Marital Status</Label>
//                     <Select
//                       value={form.personalDetails.maritalStatus}
//                       onValueChange={(v) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "maritalStatus",
//                           v,
//                         )
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Single">Single</SelectItem>
//                         <SelectItem value="Married">Married</SelectItem>
//                         <SelectItem value="Divorced">Divorced</SelectItem>
//                         <SelectItem value="Widowed">Widowed</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1.5">
//                     <Label>Aadhar Number</Label>
//                     <Input
//                       value={form.personalDetails.aadharNumber}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "aadharNumber",
//                           e.target.value,
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="space-y-1.5">
//                     <Label>PAN Number</Label>
//                     <Input
//                       value={form.personalDetails.panNumber}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "panNumber",
//                           e.target.value,
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="space-y-1.5">
//                     <Label>Father's Name</Label>
//                     <Input
//                       value={form.personalDetails.fatherName}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "fatherName",
//                           e.target.value,
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="space-y-1.5">
//                     <Label>Mother's Name</Label>
//                     <Input
//                       value={form.personalDetails.motherName}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "motherName",
//                           e.target.value,
//                         )
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Emergency Contact</Label>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     <Input
//                       placeholder="Name"
//                       value={form.personalDetails.emergencyContactName}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "emergencyContactName",
//                           e.target.value,
//                         )
//                       }
//                     />
//                     <Input
//                       placeholder="Phone"
//                       value={form.personalDetails.emergencyContactPhone}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "emergencyContactPhone",
//                           e.target.value,
//                         )
//                       }
//                     />
//                     <Input
//                       placeholder="Relation"
//                       value={form.personalDetails.emergencyContactRelation}
//                       onChange={(e) =>
//                         handleNestedChange(
//                           "personalDetails",
//                           "emergencyContactRelation",
//                           e.target.value,
//                         )
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Permanent Address</Label>
//                   <div className="grid grid-cols-1 gap-3">
//                     <Input
//                       placeholder="Line 1"
//                       value={form.personalDetails.permanentAddress.line1}
//                       onChange={(e) =>
//                         handleAddressChange("line1", e.target.value)
//                       }
//                     />
//                     <div className="grid grid-cols-2 gap-3">
//                       <Input
//                         placeholder="City"
//                         value={form.personalDetails.permanentAddress.city}
//                         onChange={(e) =>
//                           handleAddressChange("city", e.target.value)
//                         }
//                       />
//                       <Input
//                         placeholder="State"
//                         value={form.personalDetails.permanentAddress.state}
//                         onChange={(e) =>
//                           handleAddressChange("state", e.target.value)
//                         }
//                       />
//                       <Input
//                         placeholder="Country"
//                         value={form.personalDetails.permanentAddress.country}
//                         onChange={(e) =>
//                           handleAddressChange("country", e.target.value)
//                         }
//                       />
//                       <Input
//                         placeholder="Pincode"
//                         value={form.personalDetails.permanentAddress.pincode}
//                         onChange={(e) =>
//                           handleAddressChange("pincode", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Bank Details (collapsible) */}
//           <div className="border rounded-md p-3">
//             <div
//               className="flex items-center justify-between cursor-pointer"
//               onClick={() => toggleSection("bank")}
//             >
//               <h4 className="font-medium text-sm">Bank Details</h4>
//               {sections.bank ? (
//                 <ChevronDown className="h-4 w-4" />
//               ) : (
//                 <ChevronRight className="h-4 w-4" />
//               )}
//             </div>
//             {sections.bank && (
//               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="space-y-1.5">
//                   <Label>Bank Name</Label>
//                   <Input
//                     value={form.bankDetails.bankName}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "bankDetails",
//                         "bankName",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label>Account Number</Label>
//                   <Input
//                     value={form.bankDetails.accountNumber}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "bankDetails",
//                         "accountNumber",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label>IFSC Code</Label>
//                   <Input
//                     value={form.bankDetails.ifscCode}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "bankDetails",
//                         "ifscCode",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label>UPI ID</Label>
//                   <Input
//                     value={form.bankDetails.upiId}
//                     onChange={(e) =>
//                       handleNestedChange("bankDetails", "upiId", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label>Account Holder Name</Label>
//                   <Input
//                     value={form.bankDetails.accountHolderName}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "bankDetails",
//                         "accountHolderName",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label>Account Type</Label>
//                   <Select
//                     value={form.bankDetails.accountType}
//                     onValueChange={(v) =>
//                       handleNestedChange("bankDetails", "accountType", v)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Savings">Savings</SelectItem>
//                       <SelectItem value="Current">Current</SelectItem>
//                       <SelectItem value="Salary">Salary</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label>Branch Name</Label>
//                   <Input
//                     value={form.bankDetails.branchName}
//                     onChange={(e) =>
//                       handleNestedChange(
//                         "bankDetails",
//                         "branchName",
//                         e.target.value,
//                       )
//                     }
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Notes */}
//           <div className="space-y-1.5">
//             <Label>Notes / Remarks</Label>
//             <Textarea
//               rows={2}
//               value={form.notes}
//               onChange={(e) => handleChange("notes", e.target.value)}
//             />
//           </div>
//         </div>

//         <DialogFooter className="border-t pt-3 gap-2">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {editingLead ? "Save Changes" : "Create Lead"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default LeadFormModal;

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLead } from "@/hooks/useLead";
import { projectApi } from "@/api";
import { toast } from "sonner";

const emptyLead = {
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  source: "direct",
  interestedProject: "",
  interestedTower: "",
  interestedFloor: "",
  interestedFlat: "",
  interestedUnit: "", // kept for backward compat, not sent
  budgetRange: "",
  notes: "",
  followUpDate: "",
  campaignName: "",
  referralCode: "",
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
    accountType: "Savings",
    branchName: "",
  },
};

const LeadFormModal = ({
  canEdit,
  open,
  onOpenChange,
  editingLead,
  onSuccess,
}) => {
  const { createLead, updateLead } = useLead();
  const [form, setForm] = useState(emptyLead);
  const [projects, setProjects] = useState([]);
  const [sections, setSections] = useState({ personal: false, bank: false });
  const [loading, setLoading] = useState(false);

  // Derived selections for cascading dropdowns
  const selectedProject = projects.find(
    (p) => p._id === form.interestedProject,
  );
  const towers = selectedProject?.towers || [];
  const selectedTower = towers.find(
    (t) => t.towerName === form.interestedTower,
  );
  const floors = selectedTower?.floors || [];
  const selectedFloor = floors.find(
    (f) => f.floorNumber.toString() === form.interestedFloor?.toString(),
  );
  const flats = selectedFloor?.flats || [];

  useEffect(() => {
    if (open) {
      // Fetch projects
      projectApi
        .getAll()
        .then((res) => setProjects(res.data?.data?.projects || []))
        .catch(console.error);

      if (editingLead) {
        // Map editing lead into form shape, handling nested objects safely
        setForm({
          ...emptyLead,
          clientName: editingLead.clientName || "",
          clientPhone: editingLead.clientPhone || "",
          clientEmail: editingLead.clientEmail || "",
          source: editingLead.source || "direct",
          interestedProject:
            editingLead.interestedProject?._id ||
            editingLead.interestedProject ||
            "",
          interestedTower: editingLead.interestedTower || "",
          interestedFloor: editingLead.interestedFloor
            ? String(editingLead.interestedFloor) // ensure string for Select
            : "",
          interestedFlat: editingLead.interestedFlat || "",
          interestedUnit: editingLead.interestedUnit || "", // kept for backward compat
          budgetRange: editingLead.budgetRange || "",
          notes: editingLead.notes || "",
          followUpDate: editingLead.followUpDate || "",
          campaignName: editingLead.campaignName || "",
          referralCode: editingLead.referralCode || "",
          personalDetails: {
            ...emptyLead.personalDetails,
            ...(editingLead.personalDetails || {}),
            permanentAddress: {
              ...emptyLead.personalDetails.permanentAddress,
              ...(editingLead.personalDetails?.permanentAddress || {}),
            },
          },
          bankDetails: {
            ...emptyLead.bankDetails,
            ...(editingLead.bankDetails || {}),
          },
        });
      } else {
        setForm(emptyLead);
      }
    }
  }, [open, editingLead]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, subField, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [subField]: value },
    }));
  };

  const handleAddressChange = (field, value) => {
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

  const toggleSection = (section) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Cascading handlers – clear dependent fields
  const handleProjectChange = (projectId) => {
    setForm((prev) => ({
      ...prev,
      interestedProject: projectId,
      interestedTower: "",
      interestedFloor: "",
      interestedFlat: "",
    }));
  };

  const handleTowerChange = (towerName) => {
    setForm((prev) => ({
      ...prev,
      interestedTower: towerName,
      interestedFloor: "",
      interestedFlat: "",
    }));
  };

  const handleFloorChange = (floorNumber) => {
    setForm((prev) => ({
      ...prev,
      interestedFloor: floorNumber, // keep as string for Select compatibility
      interestedFlat: "",
    }));
  };

  const handleFlatChange = (flatNumber) => {
    setForm((prev) => ({ ...prev, interestedFlat: flatNumber }));
  };

  // Build payload for both create and update
  const buildPayload = () => {
    return {
      clientName: form.clientName,
      clientPhone: form.clientPhone || undefined,
      clientEmail: form.clientEmail || undefined,
      source: form.source,
      interestedProject: form.interestedProject || undefined,
      interestedTower: form.interestedTower || undefined,
      interestedFloor: form.interestedFloor
        ? Number(form.interestedFloor)
        : undefined,
      interestedFlat: form.interestedFlat || undefined,
      budgetRange: form.budgetRange || undefined,
      notes: form.notes || undefined,
      followUpDate: form.followUpDate || undefined,
      campaignName: form.campaignName || undefined,
      referralCode: form.referralCode || undefined,
      personalDetails: {
        dateOfBirth: form.personalDetails.dateOfBirth || undefined,
        gender: form.personalDetails.gender || undefined,
        bloodGroup: form.personalDetails.bloodGroup || undefined,
        maritalStatus: form.personalDetails.maritalStatus || undefined,
        aadharNumber: form.personalDetails.aadharNumber || undefined,
        panNumber: form.personalDetails.panNumber || undefined,
        fatherName: form.personalDetails.fatherName || undefined,
        motherName: form.personalDetails.motherName || undefined,
        emergencyContactName:
          form.personalDetails.emergencyContactName || undefined,
        emergencyContactPhone:
          form.personalDetails.emergencyContactPhone || undefined,
        emergencyContactRelation:
          form.personalDetails.emergencyContactRelation || undefined,
        permanentAddress: {
          line1: form.personalDetails.permanentAddress.line1 || undefined,
          city: form.personalDetails.permanentAddress.city || undefined,
          state: form.personalDetails.permanentAddress.state || undefined,
          country: form.personalDetails.permanentAddress.country || "India",
          pincode: form.personalDetails.permanentAddress.pincode || undefined,
        },
      },
      bankDetails: {
        bankName: form.bankDetails.bankName || undefined,
        accountNumber: form.bankDetails.accountNumber || undefined,
        ifscCode: form.bankDetails.ifscCode || undefined,
        upiId: form.bankDetails.upiId || undefined,
        accountHolderName: form.bankDetails.accountHolderName || undefined,
        accountType: form.bankDetails.accountType || undefined,
        branchName: form.bankDetails.branchName || undefined,
      },
    };
  };

  const handleSubmit = async () => {
    if (!form.clientName.trim()) {
      toast.error("Lead name is required");
      return;
    }
    setLoading(true);
    let res;

    const payload = buildPayload();

    if (editingLead) {
      // Full update with all fields
      res = await updateLead(editingLead._id, payload, !canEdit);
    } else {
      // Create new lead
      res = await createLead(payload, !canEdit);
    }

    setLoading(false);
    if (res) {
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col p-4 sm:p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>
            {editingLead ? "Edit Lead" : "Create New Lead"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-1 px-1 space-y-4 text-sm">
          {/* Basic Info */}
          <div className="space-y-3 border rounded-md p-3">
            <h4 className="font-medium text-sm">Basic Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Lead / Client Name *</Label>
                <Input
                  value={form.clientName}
                  onChange={(e) => handleChange("clientName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input
                  value={form.clientPhone}
                  onChange={(e) => handleChange("clientPhone", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => handleChange("clientEmail", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Lead Source</Label>
                <Select
                  value={form.source}
                  onValueChange={(v) => handleChange("source", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="cold_call">Cold Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Budget Range</Label>
                <Input
                  placeholder="e.g., 50-70 Lakhs"
                  value={form.budgetRange}
                  onChange={(e) => handleChange("budgetRange", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Follow-up Date</Label>
                <Input
                  type="date"
                  value={form.followUpDate}
                  onChange={(e) => handleChange("followUpDate", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Campaign Name</Label>
                <Input
                  value={form.campaignName}
                  onChange={(e) => handleChange("campaignName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Referral Code</Label>
                <Input
                  value={form.referralCode}
                  onChange={(e) => handleChange("referralCode", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Project Interest – Cascading selects */}
          <div className="space-y-3 border rounded-md p-3">
            <h4 className="font-medium text-sm">Project Interest</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Interested Project</Label>
                <Select
                  value={form.interestedProject}
                  onValueChange={handleProjectChange}
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

              {form.interestedProject && (
                <div className="space-y-1.5">
                  <Label>Interested Tower</Label>
                  <Select
                    value={form.interestedTower}
                    onValueChange={handleTowerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tower" />
                    </SelectTrigger>
                    <SelectContent>
                      {towers.map((t) => (
                        <SelectItem key={t.towerName} value={t.towerName}>
                          {t.towerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {form.interestedTower && (
                <div className="space-y-1.5">
                  <Label>Interested Floor</Label>
                  <Select
                    value={form.interestedFloor}
                    onValueChange={handleFloorChange}
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
              )}

              {form.interestedFloor && (
                <div className="space-y-1.5">
                  <Label>Interested Flat</Label>
                  <Select
                    value={form.interestedFlat}
                    onValueChange={handleFlatChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select flat" />
                    </SelectTrigger>
                    <SelectContent>
                      {flats.map((flat) => (
                        <SelectItem
                          key={flat.flatNumber}
                          value={flat.flatNumber}
                        >
                          {flat.flatNumber} ({flat.area} sqft, ₹{flat.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Personal Details (collapsible) */}
          <div className="border rounded-md p-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("personal")}
            >
              <h4 className="font-medium text-sm">Personal Details</h4>
              {sections.personal ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
            {sections.personal && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={form.personalDetails.dateOfBirth}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalDetails",
                          "dateOfBirth",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Gender</Label>
                    <Select
                      value={form.personalDetails.gender}
                      onValueChange={(v) =>
                        handleNestedChange("personalDetails", "gender", v)
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
                  <div className="space-y-1.5">
                    <Label>Blood Group</Label>
                    <Select
                      value={form.personalDetails.bloodGroup}
                      onValueChange={(v) =>
                        handleNestedChange("personalDetails", "bloodGroup", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                          (bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Marital Status</Label>
                    <Select
                      value={form.personalDetails.maritalStatus}
                      onValueChange={(v) =>
                        handleNestedChange(
                          "personalDetails",
                          "maritalStatus",
                          v,
                        )
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
                  <div className="space-y-1.5">
                    <Label>Aadhar Number</Label>
                    <Input
                      value={form.personalDetails.aadharNumber}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalDetails",
                          "aadharNumber",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>PAN Number</Label>
                    <Input
                      value={form.personalDetails.panNumber}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalDetails",
                          "panNumber",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Father's Name</Label>
                    <Input
                      value={form.personalDetails.fatherName}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalDetails",
                          "fatherName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mother's Name</Label>
                    <Input
                      value={form.personalDetails.motherName}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalDetails",
                          "motherName",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      placeholder="Name"
                      value={form.personalDetails.emergencyContactName}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalDetails",
                          "emergencyContactName",
                          e.target.value,
                        )
                      }
                    />
                    <Input
                      placeholder="Phone"
                      value={form.personalDetails.emergencyContactPhone}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalDetails",
                          "emergencyContactPhone",
                          e.target.value,
                        )
                      }
                    />
                    <Input
                      placeholder="Relation"
                      value={form.personalDetails.emergencyContactRelation}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalDetails",
                          "emergencyContactRelation",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Permanent Address</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      placeholder="Line 1"
                      value={form.personalDetails.permanentAddress.line1}
                      onChange={(e) =>
                        handleAddressChange("line1", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="City"
                        value={form.personalDetails.permanentAddress.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                      />
                      <Input
                        placeholder="State"
                        value={form.personalDetails.permanentAddress.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Country"
                        value={form.personalDetails.permanentAddress.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Pincode"
                        value={form.personalDetails.permanentAddress.pincode}
                        onChange={(e) =>
                          handleAddressChange("pincode", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bank Details (collapsible) */}
          <div className="border rounded-md p-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("bank")}
            >
              <h4 className="font-medium text-sm">Bank Details</h4>
              {sections.bank ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
            {sections.bank && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Bank Name</Label>
                  <Input
                    value={form.bankDetails.bankName}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankDetails",
                        "bankName",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Account Number</Label>
                  <Input
                    value={form.bankDetails.accountNumber}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankDetails",
                        "accountNumber",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>IFSC Code</Label>
                  <Input
                    value={form.bankDetails.ifscCode}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankDetails",
                        "ifscCode",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>UPI ID</Label>
                  <Input
                    value={form.bankDetails.upiId}
                    onChange={(e) =>
                      handleNestedChange("bankDetails", "upiId", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Account Holder Name</Label>
                  <Input
                    value={form.bankDetails.accountHolderName}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankDetails",
                        "accountHolderName",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Account Type</Label>
                  <Select
                    value={form.bankDetails.accountType}
                    onValueChange={(v) =>
                      handleNestedChange("bankDetails", "accountType", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Branch Name</Label>
                  <Input
                    value={form.bankDetails.branchName}
                    onChange={(e) =>
                      handleNestedChange(
                        "bankDetails",
                        "branchName",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Notes / Remarks</Label>
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="border-t pt-3 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {editingLead ? "Save Changes" : "Create Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormModal;
