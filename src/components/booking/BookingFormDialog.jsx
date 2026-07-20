// // src/components/booking/CreateBookingDialog.jsx
// import React, { useState, useEffect, useRef } from "react";
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
// import { Trash2, Plus } from "lucide-react";

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   // console.log("Edit bookig data  : ", editBooking);

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

//     // ---- NEW: Installment plan ----
//     useCustomPlan: false,
//     installments: [], // array of { installmentNumber, description, amount, dueDate }
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // Pre‑fill the whole form when editing and data is ready
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return; // wait until projects are fetched
//     if (editInitialized.current) return; // only run once per edit
//     editInitialized.current = true;

//     // Extract values safely
//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Find the project and get its towers
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     // Find the tower object
//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     // Find the floor object (floor number comparison)
//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor),
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     // Populate the form (including all other fields)
//     setForm({
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
//       bookingAmount: editBooking.bookingAmount || "",
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate
//         ? editBooking.agreementDate.slice(0, 10)
//         : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager:
//         editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       gstPaid: editBooking.gstPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       // Client fields (if any – editBooking may not have them)
//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "", // never pre‑fill password

//       // Personal details (if present)
//       dateOfBirth:
//         editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName:
//         editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone:
//         editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation:
//         editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country:
//         editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       // Bank details (if present)
//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       // ---- Installment plan ----
//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });

//     // Also pre‑select the flat object for summary display
//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);
//   }, [editBooking, open, projectsLoaded, projects]);


//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
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
//   // useEffect(() => {
//   //   if (form.projectId) {
//   //     const project = projects.find((p) => p._id === form.projectId);
//   //     if (project?.towers?.length) {
//   //       setTowers(project.towers);
//   //       setFloors([]);
//   //       setFlats([]);
//   //       setSelectedFlat(null);
//   //       setForm((prev) => ({
//   //         ...prev,
//   //         towerName: "",
//   //         floor: "",
//   //         flatId: "",
//   //       }));
//   //     } else {
//   //       setTowers([]);
//   //       setFloors([]);
//   //       setFlats([]);
//   //       setSelectedFlat(null);
//   //     }
//   //   } else {
//   //     setTowers([]);
//   //     setFloors([]);
//   //     setFlats([]);
//   //     setSelectedFlat(null);
//   //   }
//   // }, [form.projectId, projects]);

//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         // Only reset if the current towerName is NOT in this project
//         const towerExists =
//           form.towerName &&
//           project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({
//             ...prev,
//             towerName: "",
//             floor: "",
//             flatId: "",
//           }));
//         }
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
//   // useEffect(() => {
//   //   if (form.towerName) {
//   //     const tower = towers.find((t) => t.towerName === form.towerName);
//   //     if (tower) {
//   //       setFloors(tower.floors || []);
//   //       setFlats([]);
//   //       setSelectedFlat(null);
//   //       setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//   //     } else {
//   //       setFloors([]);
//   //       setFlats([]);
//   //       setSelectedFlat(null);
//   //     }
//   //   } else {
//   //     setFloors([]);
//   //     setFlats([]);
//   //     setSelectedFlat(null);
//   //   }
//   // }, [form.towerName, towers]);

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         // Only reset if the current floor is NOT in this tower
//         const floorExists =
//           form.floor &&
//           tower.floors.some(
//             (f) => String(f.floorNumber) === String(form.floor),
//           );
//         if (!floorExists) {
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//         }
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
//   // useEffect(() => {
//   //   if (form.floor !== "" && form.floor !== undefined) {
//   //     const floor = floors.find((f) => String(f.floorNumber) === form.floor);
//   //     if (floor) {
//   //       const availableFlats = floor.flats.filter(
//   //         (f) => f.status === "available",
//   //       );
//   //       setFlats(floor?.flats);
//   //       setSelectedFlat(null);
//   //       setForm((prev) => ({ ...prev, flatId: "" }));
//   //     } else {
//   //       setFlats([]);
//   //       setSelectedFlat(null);
//   //     }
//   //   } else {
//   //     setFlats([]);
//   //     setSelectedFlat(null);
//   //   }
//   // }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find(
//         (f) => String(f.floorNumber) === String(form.floor),
//       );
//       if (floor) {
//         setFlats(floor.flats || []);
//         // Only reset if the current flatId is NOT in this floor
//         const flatExists =
//           form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, flatId: "" }));
//         }
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

//   // ---- Installment plan helpers ----
//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     // Re-number
//     const renumbered = updated.map((inst, idx) => ({
//       ...inst,
//       installmentNumber: idx + 1,
//     }));
//     setForm((prev) => ({
//       ...prev,
//       installments: renumbered,
//     }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({
//       ...prev,
//       installments: updated,
//     }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce(
//       (sum, inst) => sum + (parseFloat(inst.amount) || 0),
//       0,
//     );
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     // Basic validation
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     // Custom plan validation
//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       // Check each installment has required fields
//       const invalid = form.installments.some(
//         (inst) => !inst.description || !inst.amount,
//       );
//       if (invalid) {
//         toast.error(
//           "All installment fields (description, amount) are required",
//         );
//         return;
//       }
//       // Optionally warn if total doesn't match flat price
//       const total = getTotalInstallmentAmount();
//       // if (selectedFlat && total !== selectedFlat.price) {
//       //   toast.warning(
//       //     `Total installment amount (${formatINR(total)}) does not match flat price (${formatINR(selectedFlat.price)}). Backend will validate.`,
//       //   );
//       // }
//     }

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

//     // Add installment plan if custom is enabled
//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     // Lead or client
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
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
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
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
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
//                     <SelectItem
//                       key={f._id}
//                       value={f._id}
//                       disabled={f.status !== "available"}
//                     >
//                       {f.flatNumber} - {f.bedrooms} BHK - {f.area} sqft -{" "}
//                       {new Intl.NumberFormat('en-IN', { 
//                        style: 'currency', 
//                          currency: 'INR', 
//                           maximumFractionDigits: 0 
//                          }).format(f.price || 0)} - ({f.status})
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
//                 <Label className="text-xs">Pricesss</Label>
//                 <p className="text-sm font-medium">
//                   {new Intl.NumberFormat('en-IN', { 
//                             style: 'currency', 
//                              currency: 'INR',
//                              maximumFractionDigits: 0 
//                    }).format(selectedFlat.price || 0)}
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
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
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

//           {/* ---- NEW: Custom Installment Plan Section ---- */}
//           <div className="border-t pt-2">
//             <div className="flex items-center gap-3 mb-2">
//               <h3 className="font-semibold">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       // Pre‑fill with one empty row for convenience
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span>Custom plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">
//                 (If unchecked, backend will create 3 equal installments)
//               </span>
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <p className="text-sm text-muted-foreground">
//                     Total installment amount:{" "}
//                     <span className="font-medium text-foreground">
//                       {formatINR(getTotalInstallmentAmount())}
//                     </span>
//                     {selectedFlat && (
//                       <span className="ml-2 text-xs">
//                         (Flat price: {formatINR(selectedFlat.price)})
//                       </span>
//                     )}
//                   </p>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addInstallment}
//                     className="gap-1"
//                   >
//                     <Plus className="h-4 w-4" /> Add
//                   </Button>
//                 </div>

//                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                   {form.installments.map((inst, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md"
//                     >
//                       <div className="col-span-1 text-sm font-medium text-center">
//                         {inst.installmentNumber}
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           placeholder="Description"
//                           value={inst.description}
//                           onChange={(e) =>
//                             updateInstallment(
//                               index,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Amount"
//                           value={inst.amount}
//                           onChange={(e) =>
//                             updateInstallment(index, "amount", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           type="date"
//                           value={inst.dueDate}
//                           onChange={(e) =>
//                             updateInstallment(index, "dueDate", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2 flex justify-end">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeInstallment(index)}
//                           className="h-8 w-8 p-0 text-destructive"
//                           disabled={form.installments.length <= 1}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {form.installments.length === 0 && (
//                   <p className="text-sm text-muted-foreground text-center py-2">
//                     No installments added. Click "Add" to start.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* New Client Fields (only when no lead) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Buyer Name"
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
//             {loading
//               ? "Saving..."
//               : isEdit
//                 ? "Update Booking"
//                 : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
// src/components/booking/CreateBookingDialog.jsx




// import React, { useState, useEffect, useRef } from "react";
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
// import { Trash2, Plus } from "lucide-react";

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

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
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
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

//     // ---- NEW: Installment plan ----
//     useCustomPlan: false,
//     installments: [], // array of { installmentNumber, description, amount, dueDate }
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // Pre‑fill the whole form when editing and data is ready
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return; // wait until projects are fetched
//     if (editInitialized.current) return; // only run once per edit
//     editInitialized.current = true;

//     // Extract values safely
//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Find the project and get its towers
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     // Find the tower object
//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     // Find the floor object (floor number comparison)
//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor),
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     // Populate the form (including all other fields)
//     setForm({
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
//       bookingAmount: editBooking.bookingAmount || "",
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate
//         ? editBooking.agreementDate.slice(0, 10)
//         : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager:
//         editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       // Client fields (if any – editBooking may not have them)
//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "", // never pre‑fill password

//       // Personal details (if present)
//       dateOfBirth:
//         editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName:
//         editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone:
//         editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation:
//         editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country:
//         editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       // Bank details (if present)
//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       // ---- Installment plan ----
//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });

//     // Also pre‑select the flat object for summary display
//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
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

//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         // Only reset if the current towerName is NOT in this project
//         const towerExists =
//           form.towerName &&
//           project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({
//             ...prev,
//             towerName: "",
//             floor: "",
//             flatId: "",
//           }));
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         // Only reset if the current floor is NOT in this tower
//         const floorExists =
//           form.floor &&
//           tower.floors.some(
//             (f) => String(f.floorNumber) === String(form.floor),
//           );
//         if (!floorExists) {
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find(
//         (f) => String(f.floorNumber) === String(form.floor),
//       );
//       if (floor) {
//         setFlats(floor.flats || []);
//         // Only reset if the current flatId is NOT in this floor
//         const flatExists =
//           form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, flatId: "" }));
//         }
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

//   // ---- Installment plan helpers ----
//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     // Re-number
//     const renumbered = updated.map((inst, idx) => ({
//       ...inst,
//       installmentNumber: idx + 1,
//     }));
//     setForm((prev) => ({
//       ...prev,
//       installments: renumbered,
//     }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({
//       ...prev,
//       installments: updated,
//     }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce(
//       (sum, inst) => sum + (parseFloat(inst.amount) || 0),
//       0,
//     );
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     // Basic validation
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     // Custom plan validation
//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       // Check each installment has required fields
//       const invalid = form.installments.some(
//         (inst) => !inst.description || !inst.amount,
//       );
//       if (invalid) {
//         toast.error(
//           "All installment fields (description, amount) are required",
//         );
//         return;
//       }
//     }

//     setLoading(true);

//     // ✅ Dynamic GST Calculation added here
//     const flatPrice = selectedFlat?.price || 0;
//     const calculatedGstPercent = flatPrice >= 4500000 ? 5 : 1;

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
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid
//         ? Number(form.serviceTaxPaid)
//         : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
      
//       // ✅ GST Percentage assigned to payload
//       gstPercentage: calculatedGstPercent,
//     };

//     // Add installment plan if custom is enabled
//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     // Lead or client
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
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
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
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
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
//                     <SelectItem
//                       key={f._id}
//                       value={f._id}
//                       disabled={f.status !== "available"}
//                     >
//                       {f.flatNumber} - {f.bedrooms} BHK - {f.area} sqft -{" "}
//                       {new Intl.NumberFormat('en-IN', { 
//                        style: 'currency', 
//                          currency: 'INR', 
//                           maximumFractionDigits: 0 
//                          }).format(f.price || 0)} - ({f.status})
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
//                   {new Intl.NumberFormat('en-IN', { 
//                             style: 'currency', 
//                              currency: 'INR',
//                               maximumFractionDigits: 0 
//                    }).format(selectedFlat.price || 0)}
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
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
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
//             {/* HATA DIYA GAYA HAI: Manual GST Input Field */}
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.remarks}
//                 onChange={(e) => updateForm("remarks", e.target.value)}
//               />
//             </div>
//           </div>

//           {/* ---- NEW: Custom Installment Plan Section ---- */}
//           <div className="border-t pt-2">
//             <div className="flex items-center gap-3 mb-2">
//               <h3 className="font-semibold">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       // Pre‑fill with one empty row for convenience
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span>Custom plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">
//                 (If unchecked, backend will create 3 equal installments)
//               </span>
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-3">
//                 <div className="flex justify-between items-start gap-4">
//                   <div className="text-sm text-muted-foreground flex-1">
//                     <p className="mb-2">
//                       Current Installment Total:{" "}
//                       <span className="font-medium text-foreground text-base">
//                         {formatINR(getTotalInstallmentAmount())}
//                       </span>
//                     </p>
                    
//                     {/* Live GST & Target Calculator */}
//                     {selectedFlat && (() => {
//                       const flatPrice = selectedFlat.price || 0;
//                       // Backend logic: 45L ya usse upar pe 5%, warna 1%
//                       const gstPercent = flatPrice >= 4500000 ? 5 : 1; 
//                       const totalGst = flatPrice * (gstPercent / 100);
//                       const bookingAmt = Number(form.bookingAmount) || 0;
                      
//                       // Naya Target = (Base Price + GST) - Booking Amount
//                       const targetTotal = (flatPrice + totalGst) - bookingAmt;
//                       const currentTotal = getTotalInstallmentAmount();
//                       const diff = targetTotal - currentTotal;

//                       return (
//                         <div className="p-3 bg-muted/30 border rounded-md space-y-1.5 text-xs">
//                           <div className="flex justify-between">
//                             <span>Base Price:</span> <strong>{formatINR(flatPrice)}</strong>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>GST ({gstPercent}%):</span> <strong>+ {formatINR(totalGst)}</strong>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Booking Amount:</span> <strong>- {formatINR(bookingAmt)}</strong>
//                           </div>
//                           <div className="flex justify-between text-primary font-semibold mt-1 pt-2 border-t">
//                             <span>Target Installments Total:</span> 
//                             <span>{formatINR(targetTotal)}</span>
//                           </div>
                          
//                           {/* Alert message agar total match nahi ho raha */}
//                           {diff !== 0 && (
//                             <div className={`mt-1 font-medium ${diff > 0 ? "text-amber-600" : "text-destructive"}`}>
//                               {diff > 0 
//                                 ? `⚠️ You need to add ${formatINR(diff)} more to match the target.` 
//                                 : `⚠️ Total exceeds the target by ${formatINR(Math.abs(diff))}.`}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addInstallment}
//                     className="gap-1 mt-1"
//                   >
//                     <Plus className="h-4 w-4" /> Add
//                   </Button>
//                 </div>

//                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                   {form.installments.map((inst, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md"
//                     >
//                       <div className="col-span-1 text-sm font-medium text-center">
//                         {inst.installmentNumber}
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           placeholder="Description"
//                           value={inst.description}
//                           onChange={(e) =>
//                             updateInstallment(
//                               index,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Amount"
//                           value={inst.amount}
//                           onChange={(e) =>
//                             updateInstallment(index, "amount", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           type="date"
//                           value={inst.dueDate}
//                           onChange={(e) =>
//                             updateInstallment(index, "dueDate", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2 flex justify-end">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeInstallment(index)}
//                           className="h-8 w-8 p-0 text-destructive"
//                           disabled={form.installments.length <= 1}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {form.installments.length === 0 && (
//                   <p className="text-sm text-muted-foreground text-center py-2">
//                     No installments added. Click "Add" to start.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* New Client Fields (only when no lead) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Buyer Name"
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
//             {loading
//               ? "Saving..."
//               : isEdit
//                 ? "Update Booking"
//                 : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }




// import React, { useState, useEffect, useRef } from "react";
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
// import { Trash2, Plus } from "lucide-react";

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

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
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
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

//     // ---- NEW: Installment plan ----
//     useCustomPlan: false,
//     installments: [], // array of { installmentNumber, description, amount, dueDate }
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // Pre‑fill the whole form when editing and data is ready
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return; // wait until projects are fetched
//     if (editInitialized.current) return; // only run once per edit
//     editInitialized.current = true;

//     // Extract values safely
//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Find the project and get its towers
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     // Find the tower object
//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     // Find the floor object (floor number comparison)
//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor),
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     // Populate the form (including all other fields)
//     setForm({
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
//       bookingAmount: editBooking.bookingAmount || "",
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate
//         ? editBooking.agreementDate.slice(0, 10)
//         : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager:
//         editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       // Client fields (if any – editBooking may not have them)
//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "", // never pre‑fill password

//       // Personal details (if present)
//       dateOfBirth:
//         editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName:
//         editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone:
//         editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation:
//         editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country:
//         editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       // Bank details (if present)
//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       // ---- Installment plan ----
//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });

//     // Also pre‑select the flat object for summary display
//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
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

//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         // Only reset if the current towerName is NOT in this project
//         const towerExists =
//           form.towerName &&
//           project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({
//             ...prev,
//             towerName: "",
//             floor: "",
//             flatId: "",
//           }));
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         // Only reset if the current floor is NOT in this tower
//         const floorExists =
//           form.floor &&
//           tower.floors.some(
//             (f) => String(f.floorNumber) === String(form.floor),
//           );
//         if (!floorExists) {
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find(
//         (f) => String(f.floorNumber) === String(form.floor),
//       );
//       if (floor) {
//         setFlats(floor.flats || []);
//         // Only reset if the current flatId is NOT in this floor
//         const flatExists =
//           form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, flatId: "" }));
//         }
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

//   // ---- Installment plan helpers ----
//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     // Re-number
//     const renumbered = updated.map((inst, idx) => ({
//       ...inst,
//       installmentNumber: idx + 1,
//     }));
//     setForm((prev) => ({
//       ...prev,
//       installments: renumbered,
//     }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({
//       ...prev,
//       installments: updated,
//     }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce(
//       (sum, inst) => sum + (parseFloat(inst.amount) || 0),
//       0,
//     );
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     // Basic validation
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     // Custom plan validation
//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       // Check each installment has required fields
//       const invalid = form.installments.some(
//         (inst) => !inst.description || !inst.amount,
//       );
//       if (invalid) {
//         toast.error(
//           "All installment fields (description, amount) are required",
//         );
//         return;
//       }
//     }

//     setLoading(true);

//     // ✅ Dynamic GST Calculation added here
//     const flatPrice = selectedFlat?.price || 0;
//     const calculatedGstPercent = flatPrice >= 4500000 ? 5 : 1;

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
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid
//         ? Number(form.serviceTaxPaid)
//         : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
      
//       // ✅ GST Percentage assigned to payload
//       gstPercentage: calculatedGstPercent,
//     };

//     // Add installment plan if custom is enabled
//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     // Lead or client
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
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
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
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
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
//                     <SelectItem
//                       key={f._id}
//                       value={f._id}
//                       disabled={f.status !== "available"}
//                     >
//                       {f.flatNumber} - {f.bedrooms} BHK - {f.area} sqft -{" "}
//                       {new Intl.NumberFormat('en-IN', { 
//                        style: 'currency', 
//                          currency: 'INR', 
//                           maximumFractionDigits: 0 
//                          }).format(f.price || 0)} - ({f.status})
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
//                   {new Intl.NumberFormat('en-IN', { 
//                             style: 'currency', 
//                              currency: 'INR',
//                               maximumFractionDigits: 0 
//                    }).format(selectedFlat.price || 0)}
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
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
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
//             {/* HATA DIYA GAYA HAI: Manual GST Input Field */}
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.remarks}
//                 onChange={(e) => updateForm("remarks", e.target.value)}
//               />
//             </div>
//           </div>

//           {/* ---- NEW: Custom Installment Plan Section ---- */}
//           <div className="border-t pt-2">
//             <div className="flex items-center gap-3 mb-2">
//               <h3 className="font-semibold">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       // Pre‑fill with one empty row for convenience
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span>Custom plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">
//                 (If unchecked, backend will create 3 equal installments)
//               </span>
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-3">
//                 <div className="flex justify-between items-start gap-4">
//                   <div className="text-sm text-muted-foreground flex-1">
//                     <p className="mb-2">
//                       Current Installment Total:{" "}
//                       <span className="font-medium text-foreground text-base">
//                         {formatINR(getTotalInstallmentAmount())}
//                       </span>
//                     </p>
                    
//                     {/* Live GST & Target Calculator */}
//                     {selectedFlat && (() => {
//                       const flatPrice = selectedFlat.price || 0;
//                       // Backend logic: 45L ya usse upar pe 5%, warna 1%
//                       const gstPercent = flatPrice >= 4500000 ? 5 : 1; 
//                       const totalGst = flatPrice * (gstPercent / 100);
//                       const bookingAmt = Number(form.bookingAmount) || 0;
                      
//                       // Naya Target = (Base Price + GST) - Booking Amount
//                       const targetTotal = (flatPrice + totalGst) - bookingAmt;
//                       const currentTotal = getTotalInstallmentAmount();
//                       const diff = targetTotal - currentTotal;

//                       return (
//                         <div className="p-3 bg-muted/30 border rounded-md space-y-1.5 text-xs">
//                           <div className="flex justify-between">
//                             <span>Base Price:</span> <strong>{formatINR(flatPrice)}</strong>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>GST ({gstPercent}%):</span> <strong>+ {formatINR(totalGst)}</strong>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Booking Amount:</span> <strong>- {formatINR(bookingAmt)}</strong>
//                           </div>
//                           <div className="flex justify-between text-primary font-semibold mt-1 pt-2 border-t">
//                             <span>Target Installments Total:</span> 
//                             <span>{formatINR(targetTotal)}</span>
//                           </div>
                          
//                           {/* Alert message agar total match nahi ho raha */}
//                           {diff !== 0 && (
//                             <div className={`mt-1 font-medium ${diff > 0 ? "text-amber-600" : "text-destructive"}`}>
//                               {diff > 0 
//                                 ? `⚠️ You need to add ${formatINR(diff)} more to match the target.` 
//                                 : `⚠️ Total exceeds the target by ${formatINR(Math.abs(diff))}.`}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addInstallment}
//                     className="gap-1 mt-1"
//                   >
//                     <Plus className="h-4 w-4" /> Add
//                   </Button>
//                 </div>

//                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                   {form.installments.map((inst, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md"
//                     >
//                       <div className="col-span-1 text-sm font-medium text-center">
//                         {inst.installmentNumber}
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           placeholder="Description"
//                           value={inst.description}
//                           onChange={(e) =>
//                             updateInstallment(
//                               index,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Amount"
//                           value={inst.amount}
//                           onChange={(e) =>
//                             updateInstallment(index, "amount", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           type="date"
//                           value={inst.dueDate}
//                           onChange={(e) =>
//                             updateInstallment(index, "dueDate", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2 flex justify-end">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeInstallment(index)}
//                           className="h-8 w-8 p-0 text-destructive"
//                           disabled={form.installments.length <= 1}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {form.installments.length === 0 && (
//                   <p className="text-sm text-muted-foreground text-center py-2">
//                     No installments added. Click "Add" to start.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* New Client Fields (only when no lead) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Buyer Name"
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
//             {loading
//               ? "Saving..."
//               : isEdit
//                 ? "Update Booking"
//                 : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// } 




// import React, { useState, useEffect, useRef } from "react";
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
// import { Trash2, Plus } from "lucide-react";

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [gstAmountOnBooking, setGstAmountOnBooking] = useState();

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

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
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
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

//     // Installment plan
//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getTotalGSTAmount = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     const gstPercent = getGSTPercentage();
//     return Math.round((flatPrice * gstPercent) / 100);
//   };

//   const getGSTOnBooking = () => {
//     // If user manually specified GST amount, use that
//     if (gstAmountOnBooking !== undefined) {
//       return gstAmountOnBooking;
//     }
//     // Otherwise calculate automatically
//     const amount = parseFloat(form.bookingAmount) || 0;
//     const gstPercent = getGSTPercentage();
//     return Math.round((amount * gstPercent) / 100);
//   };

//   const getGSTOnInstallments = () => {
//     return getTotalGSTAmount() - getGSTOnBooking();
//   };

//   const getTotalPayable = () => {
//     const amount = parseFloat(form.bookingAmount) || 0;
//     return amount + getGSTOnBooking();
//   };

//   const getInstallmentTarget = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     const bookingAmt = parseFloat(form.bookingAmount) || 0;
//     const totalGst = getTotalGSTAmount();
//     const gstOnBooking = getGSTOnBooking();
//     return flatPrice - bookingAmt + (totalGst - gstOnBooking);
//   };

//   // Pre‑fill the whole form when editing and data is ready
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     setForm({
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
//       bookingAmount: editBooking.bookingAmount || "",
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate
//         ? editBooking.agreementDate.slice(0, 10)
//         : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName:
//         editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone:
//         editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation:
//         editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });

//     // Set GST amount from existing booking
//     if (editBooking.gstPaid !== undefined) {
//       setGstAmountOnBooking(editBooking.gstPaid);
//     }

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//     setGstAmountOnBooking(undefined);
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
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
//             user.role === "admin"
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

//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists =
//           form.towerName &&
//           project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({
//             ...prev,
//             towerName: "",
//             floor: "",
//             flatId: "",
//           }));
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists =
//           form.floor &&
//           tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find(
//         (f) => String(f.floorNumber) === String(form.floor)
//       );
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists =
//           form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, flatId: "" }));
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

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

//   // ---- Installment plan helpers ----
//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({
//       ...inst,
//       installmentNumber: idx + 1,
//     }));
//     setForm((prev) => ({
//       ...prev,
//       installments: renumbered,
//     }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({
//       ...prev,
//       installments: updated,
//     }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce(
//       (sum, inst) => sum + (parseFloat(inst.amount) || 0),
//       0
//     );
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     // Validate GST amount
//     const totalGst = getTotalGSTAmount();
//     if (gstAmountOnBooking !== undefined) {
//       if (gstAmountOnBooking < 0 || gstAmountOnBooking > totalGst) {
//         toast.error(
//           `GST amount must be between ₹0 and ${formatINR(totalGst)}`
//         );
//         return;
//       }
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some(
//         (inst) => !inst.description || !inst.amount
//       );
//       if (invalid) {
//         toast.error(
//           "All installment fields (description, amount) are required"
//         );
//         return;
//       }
//     }

//     setLoading(true);

//     const flatPrice = selectedFlat?.price || 0;
//     const calculatedGstPercent = flatPrice >= 4500000 ? 5 : 1;

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount),
//       paymentMode: form.paymentMode,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid
//         ? Number(form.serviceTaxPaid)
//         : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//       gstPercentage: calculatedGstPercent,
//     };

//     // Add GST amount if specified
//     if (gstAmountOnBooking !== undefined) {
//       payload.gstAmountOnBooking = gstAmountOnBooking;
//     }

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
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
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
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
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
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
//                     <SelectItem
//                       key={f._id}
//                       value={f._id}
//                       disabled={f.status !== "available"}
//                     >
//                       {f.flatNumber} - {f.bedrooms} BHK - {f.area} sqft -{" "}
//                       {new Intl.NumberFormat("en-IN", {
//                         style: "currency",
//                         currency: "INR",
//                         maximumFractionDigits: 0,
//                       }).format(f.price || 0)}{" "}
//                       - ({f.status})
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
//                   {new Intl.NumberFormat("en-IN", {
//                     style: "currency",
//                     currency: "INR",
//                     maximumFractionDigits: 0,
//                   }).format(selectedFlat.price || 0)}
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
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
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

//           {/* Booking Details */}
//           <div className="border-t pt-2">
//             <h3 className="font-semibold">Booking Details</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* ============================================================ */}
//             {/* ✅ UPDATED: Booking Amount with GST & Payable Display */}
//             {/* ============================================================ */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <Label>Booking Amount *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-medium"
//                   />
//                 </div>

//                 {/* NEW: GST Amount on Booking (Manual) */}
//                 <div>
//                   <Label>GST with Booking (₹)</Label>
//                   <Input
//                     type="number"
//                     min={0}
//                     max={getTotalGSTAmount()}
//                     value={gstAmountOnBooking ?? ""}
//                     onChange={(e) => {
//                       const val = e.target.value === "" ? undefined : Number(e.target.value);
//                       const totalGst = getTotalGSTAmount();
//                       if (val !== undefined && (val < 0 || val > totalGst)) {
//                         toast.error(
//                           `GST amount must be between ₹0 and ${formatINR(totalGst)}`
//                         );
//                         return;
//                       }
//                       setGstAmountOnBooking(val);
//                     }}
//                     placeholder={`Auto (${formatINR(getGSTOnBooking())})`}
//                     disabled={!selectedFlat || !form.bookingAmount}
//                   />
//                   <span className="text-xs text-muted-foreground">
//                     {gstAmountOnBooking !== undefined
//                       ? `Manual: ${formatINR(gstAmountOnBooking)}`
//                       : `Auto: ${formatINR(getGSTOnBooking())}`}
//                   </span>
//                 </div>

//                 {/* GST Display */}
//                 <div>
//                   <Label className="text-xs text-muted-foreground">
//                     GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-lg font-semibold text-primary">
//                     {formatINR(getGSTOnBooking())}
//                   </div>
//                   <span className="text-xs text-muted-foreground">
//                     {gstAmountOnBooking !== undefined
//                       ? `Manual override`
//                       : `${getGSTPercentage()}% of booking amount`}
//                   </span>
//                 </div>

//                 {/* Total Payable */}
//                 <div>
//                   <Label className="text-xs text-muted-foreground">
//                     Total Payable Amount
//                   </Label>
//                   <div className="text-xl font-bold text-green-600">
//                     {formatINR(getTotalPayable())}
//                   </div>
//                   <span className="text-xs text-muted-foreground">
//                     Booking Amount + GST
//                   </span>
//                 </div>
//               </div>

//               {/* Breakup Summary */}
//               {selectedFlat && parseFloat(form.bookingAmount) > 0 && (
//                 <div className="mt-2 p-2 bg-muted/30 rounded-md text-xs flex gap-6 flex-wrap">
//                   <span>
//                     Booking Amount:{" "}
//                     <strong>{formatINR(parseFloat(form.bookingAmount) || 0)}</strong>
//                   </span>
//                   <span>
//                     + GST on Booking:{" "}
//                     <strong>{formatINR(getGSTOnBooking())}</strong>
//                     {gstAmountOnBooking !== undefined && (
//                       <span className="text-blue-600 ml-1">(manual)</span>
//                     )}
//                   </span>
//                   <span>
//                     = Total Payable:{" "}
//                     <strong className="text-primary">{formatINR(getTotalPayable())}</strong>
//                   </span>
//                   <span className="text-muted-foreground">
//                     GST Remaining (Installments):{" "}
//                     {formatINR(getGSTOnInstallments())}
//                   </span>
//                   <span className="text-muted-foreground">
//                     (GST Rate: {getGSTPercentage()}% -{" "}
//                     {selectedFlat.price >= 4500000 ? "≥ ₹45L slab" : "< ₹45L slab"})
//                   </span>
//                 </div>
//               )}
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
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.remarks}
//                 onChange={(e) => updateForm("remarks", e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-2">
//             <div className="flex items-center gap-3 mb-2">
//               <h3 className="font-semibold">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span>Custom plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">
//                 (If unchecked, backend will create 3 equal installments)
//               </span>
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-3">
//                 <div className="flex justify-between items-start gap-4">
//                   <div className="text-sm text-muted-foreground flex-1">
//                     <p className="mb-2">
//                       Current Installment Total:{" "}
//                       <span className="font-medium text-foreground text-base">
//                         {formatINR(getTotalInstallmentAmount())}
//                       </span>
//                     </p>

//                     {/* Live GST & Target Calculator */}
//                     {selectedFlat &&
//                       (() => {
//                         const flatPrice = selectedFlat.price || 0;
//                         const gstPercent = getGSTPercentage();
//                         const totalGst = getTotalGSTAmount();
//                         const bookingAmt = Number(form.bookingAmount) || 0;
//                         const gstOnBooking = getGSTOnBooking();

//                         const targetTotal = getInstallmentTarget();
//                         const currentTotal = getTotalInstallmentAmount();
//                         const diff = targetTotal - currentTotal;

//                         return (
//                           <div className="p-3 bg-muted/30 border rounded-md space-y-1.5 text-xs">
//                             <div className="flex justify-between">
//                               <span>Base Price:</span>{" "}
//                               <strong>{formatINR(flatPrice)}</strong>
//                             </div>
//                             <div className="flex justify-between">
//                               <span>Total GST ({gstPercent}%):</span>{" "}
//                               <strong>+ {formatINR(totalGst)}</strong>
//                             </div>
//                             <div className="flex justify-between text-blue-600">
//                               <span>GST Paid with Booking:</span>{" "}
//                               <strong>- {formatINR(gstOnBooking)}</strong>
//                               {gstAmountOnBooking !== undefined && (
//                                 <span className="text-xs ml-1">(manual)</span>
//                               )}
//                             </div>
//                             <div className="flex justify-between">
//                               <span>Booking Amount:</span>{" "}
//                               <strong>- {formatINR(bookingAmt)}</strong>
//                             </div>
//                             <div className="flex justify-between text-primary font-semibold mt-1 pt-2 border-t">
//                               <span>Target Installments Total:</span>
//                               <span>{formatINR(targetTotal)}</span>
//                             </div>
//                             <div className="flex justify-between text-muted-foreground">
//                               <span>Breakup:</span>
//                               <span>
//                                 Base: {formatINR(flatPrice - bookingAmt)} + GST:{" "}
//                                 {formatINR(totalGst - gstOnBooking)}
//                               </span>
//                             </div>
//                             {diff !== 0 && (
//                               <div
//                                 className={`mt-1 font-medium ${
//                                   diff > 0
//                                     ? "text-amber-600"
//                                     : "text-destructive"
//                                 }`}
//                               >
//                                 {diff > 0
//                                   ? `⚠️ You need to add ${formatINR(
//                                       diff
//                                     )} more to match the target.`
//                                   : `⚠️ Total exceeds the target by ${formatINR(
//                                       Math.abs(diff)
//                                     )}.`}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                   </div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addInstallment}
//                     className="gap-1 mt-1"
//                   >
//                     <Plus className="h-4 w-4" /> Add
//                   </Button>
//                 </div>

//                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                   {form.installments.map((inst, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md"
//                     >
//                       <div className="col-span-1 text-sm font-medium text-center">
//                         {inst.installmentNumber}
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           placeholder="Description"
//                           value={inst.description}
//                           onChange={(e) =>
//                             updateInstallment(
//                               index,
//                               "description",
//                               e.target.value
//                             )
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Amount"
//                           value={inst.amount}
//                           onChange={(e) =>
//                             updateInstallment(index, "amount", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           type="date"
//                           value={inst.dueDate}
//                           onChange={(e) =>
//                             updateInstallment(index, "dueDate", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2 flex justify-end">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeInstallment(index)}
//                           className="h-8 w-8 p-0 text-destructive"
//                           disabled={form.installments.length <= 1}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {form.installments.length === 0 && (
//                   <p className="text-sm text-muted-foreground text-center py-2">
//                     No installments added. Click "Add" to start.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* New Client Fields (only when no lead) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Buyer Name"
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
//                       )
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
//             {loading
//               ? "Saving..."
//               : isEdit
//               ? "Update Booking"
//               : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }




// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus } from "lucide-react";

// // ✅ NEW LOCAL FORMATTER: Ye function amount ko full format me dikhayega (e.g. ₹2,40,000) bina 'L' ya 'Cr' lagaye.
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [gstPaid, setGstPaid] = useState("");

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "",
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   // GST Hamesha Flat price par calculate hoga
//   const getTotalGSTAmount = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     const gstPercent = getGSTPercentage();
//     return Math.round((flatPrice * gstPercent) / 100);
//   };

//   // Upfront GST wahi hoga jo user type karega (Booking amount par percentage nahi nikalna hai)
//   const getGSTOnBooking = () => {
//     return Number(gstPaid) || 0;
//   };

//   const getGSTOnInstallments = () => {
//     return getTotalGSTAmount() - getGSTOnBooking();
//   };

//   const getTotalPayable = () => {
//     const amount = parseFloat(form.bookingAmount) || 0;
//     return amount + getGSTOnBooking();
//   };

//   const getInstallmentTarget = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     const bookingAmt = parseFloat(form.bookingAmount) || 0;
//     const totalGst = getTotalGSTAmount();
//     const gstOnBooking = getGSTOnBooking();
    
//     // Remaining Base + Remaining GST
//     return (flatPrice - bookingAmt) + (totalGst - gstOnBooking);
//   };

//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     setForm({
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
//       bookingAmount: editBooking.bookingAmount || "",
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate
//         ? editBooking.agreementDate.slice(0, 10)
//         : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName:
//         editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone:
//         editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation:
//         editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });

//     if (editBooking.gstPaid !== undefined && editBooking.gstPaid !== null) {
//       setGstPaid(editBooking.gstPaid);
//     } else {
//       setGstPaid("");
//     }

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//     setGstPaid("");
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
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
//             user.role === "admin"
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

//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists =
//           form.towerName &&
//           project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({
//             ...prev,
//             towerName: "",
//             floor: "",
//             flatId: "",
//           }));
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists =
//           form.floor &&
//           tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find(
//         (f) => String(f.floorNumber) === String(form.floor)
//       );
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists =
//           form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, flatId: "" }));
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

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

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({
//       ...inst,
//       installmentNumber: idx + 1,
//     }));
//     setForm((prev) => ({
//       ...prev,
//       installments: renumbered,
//     }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({
//       ...prev,
//       installments: updated,
//     }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce(
//       (sum, inst) => sum + (parseFloat(inst.amount) || 0),
//       0
//     );
//   };

//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some(
//         (inst) => !inst.description || !inst.amount
//       );
//       if (invalid) {
//         toast.error(
//           "All installment fields (description, amount) are required"
//         );
//         return;
//       }
//     }

//     setLoading(true);

//     const flatPrice = selectedFlat?.price || 0;
//     const calculatedGstPercent = flatPrice >= 4500000 ? 5 : 1;

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount),
//       paymentMode: form.paymentMode,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//       gstPercentage: calculatedGstPercent,
//       gstPaid: Number(gstPaid) || 0,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName)
//         personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone)
//         personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation)
//         personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
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
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
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
//                     <SelectItem
//                       key={f._id}
//                       value={f._id}
//                       disabled={f.status !== "available" && !isEdit}
//                     >
//                       {f.flatNumber} - {f.bedrooms} BHK - {f.area} sqft -{" "}
//                       {formatCurrency(f.price || 0)} - ({f.status})
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
//                 <p className="text-sm font-medium">{formatCurrency(selectedFlat.price || 0)}</p>
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
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
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

//           {/* Booking Details */}
//           <div className="border-t pt-2">
//             <h3 className="font-semibold">Booking Details</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <Label>Booking Amount *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-medium"
//                   />
//                   <span className="text-xs text-muted-foreground">
//                     Advance Token Amount
//                   </span>
//                 </div>

//                 <div>
//                   <Label>Upfront GST Payment (₹)</Label>
//                   <Input
//                     type="number"
//                     min={0}
//                     max={getTotalGSTAmount()}
//                     value={gstPaid}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       const numVal = Number(val);
//                       const totalGst = getTotalGSTAmount();
//                       if (val !== "" && !isNaN(numVal) && (numVal < 0 || numVal > totalGst)) {
//                         toast.error(
//                           `Upfront GST cannot exceed Total GST of ${formatCurrency(totalGst)}`
//                         );
//                         return;
//                       }
//                       setGstPaid(val);
//                     }}
//                     placeholder={`e.g. 15000`}
//                     disabled={!selectedFlat}
//                   />
//                   <span className="text-xs text-muted-foreground">
//                     Amount of GST paying now
//                   </span>
//                 </div>

//                 <div>
//                   <Label className="text-xs text-muted-foreground">
//                     Total Flat GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-lg font-semibold text-primary">
//                     {formatCurrency(getTotalGSTAmount())}
//                   </div>
//                   <span className="text-xs text-muted-foreground">
//                     Calculated on Flat Price
//                   </span>
//                 </div>

//                 <div>
//                   <Label className="text-xs text-muted-foreground">
//                     Total Payable Now
//                   </Label>
//                   <div className="text-xl font-bold text-green-600">
//                     {formatCurrency(getTotalPayable())}
//                   </div>
//                   <span className="text-xs text-muted-foreground">
//                     Booking Amount + Upfront GST
//                   </span>
//                 </div>
//               </div>

//               {selectedFlat && parseFloat(form.bookingAmount) > 0 && (
//                 <div className="mt-2 p-2 bg-muted/30 rounded-md text-xs flex gap-6 flex-wrap">
//                   <span>
//                     Booking Amount:{" "}
//                     <strong>{formatCurrency(parseFloat(form.bookingAmount) || 0)}</strong>
//                   </span>
//                   <span>
//                     + Upfront GST:{" "}
//                     <strong>{formatCurrency(getGSTOnBooking())}</strong>
//                   </span>
//                   <span>
//                     = Total Payable Now:{" "}
//                     <strong className="text-primary">{formatCurrency(getTotalPayable())}</strong>
//                   </span>
//                   <span className="text-muted-foreground">
//                     GST Remaining for Installments:{" "}
//                     <strong>{formatCurrency(getGSTOnInstallments())}</strong>
//                   </span>
//                 </div>
//               )}
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
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.remarks}
//                 onChange={(e) => updateForm("remarks", e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-2">
//             <div className="flex items-center gap-3 mb-2">
//               <h3 className="font-semibold">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span>Custom plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">
//                 (If unchecked, backend will create 3 equal installments)
//               </span>
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-3">
//                 <div className="flex justify-between items-start gap-4">
//                   <div className="text-sm text-muted-foreground flex-1">
//                     <p className="mb-2">
//                       Current Installment Total:{" "}
//                       <span className="font-medium text-foreground text-base">
//                         {formatCurrency(getTotalInstallmentAmount())}
//                       </span>
//                     </p>

//                     {selectedFlat &&
//                       (() => {
//                         const flatPrice = selectedFlat.price || 0;
//                         const gstPercent = getGSTPercentage();
//                         const totalGst = getTotalGSTAmount();
//                         const bookingAmt = Number(form.bookingAmount) || 0;
//                         const gstOnBooking = getGSTOnBooking();

//                         const targetTotal = getInstallmentTarget();
//                         const currentTotal = getTotalInstallmentAmount();
//                         const diff = targetTotal - currentTotal;

//                         return (
//                           <div className="p-3 bg-muted/30 border rounded-md space-y-1.5 text-xs">
//                             <div className="flex justify-between">
//                               <span>Base Price:</span>{" "}
//                               <strong>{formatCurrency(flatPrice)}</strong>
//                             </div>
//                             <div className="flex justify-between">
//                               <span>Total GST ({gstPercent}%):</span>{" "}
//                               <strong>+ {formatCurrency(totalGst)}</strong>
//                             </div>
//                             <div className="flex justify-between text-blue-600">
//                               <span>Upfront GST Paid:</span>{" "}
//                               <strong>- {formatCurrency(gstOnBooking)}</strong>
//                             </div>
//                             <div className="flex justify-between">
//                               <span>Booking Amount:</span>{" "}
//                               <strong>- {formatCurrency(bookingAmt)}</strong>
//                             </div>
//                             <div className="flex justify-between text-primary font-semibold mt-1 pt-2 border-t">
//                               <span>Target Installments Total:</span>
//                               <span>{formatCurrency(targetTotal)}</span>
//                             </div>
//                             <div className="flex justify-between text-muted-foreground">
//                               <span>Breakup:</span>
//                               <span>
//                                 Base: {formatCurrency(flatPrice - bookingAmt)} + GST:{" "}
//                                 {formatCurrency(totalGst - gstOnBooking)}
//                               </span>
//                             </div>
//                             {diff !== 0 && (
//                               <div
//                                 className={`mt-1 font-medium ${
//                                   diff > 0
//                                     ? "text-amber-600"
//                                     : "text-destructive"
//                                 }`}
//                               >
//                                 {diff > 0
//                                   ? `⚠️ You need to add ${formatCurrency(
//                                       diff
//                                     )} more to match the target.`
//                                   : `⚠️ Total exceeds the target by ${formatCurrency(
//                                       Math.abs(diff)
//                                     )}.`}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                   </div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addInstallment}
//                     className="gap-1 mt-1"
//                   >
//                     <Plus className="h-4 w-4" /> Add
//                   </Button>
//                 </div>

//                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                   {form.installments.map((inst, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md"
//                     >
//                       <div className="col-span-1 text-sm font-medium text-center">
//                         {inst.installmentNumber}
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           placeholder="Description"
//                           value={inst.description}
//                           onChange={(e) =>
//                             updateInstallment(
//                               index,
//                               "description",
//                               e.target.value
//                             )
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Amount"
//                           value={inst.amount}
//                           onChange={(e) =>
//                             updateInstallment(index, "amount", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           type="date"
//                           value={inst.dueDate}
//                           onChange={(e) =>
//                             updateInstallment(index, "dueDate", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2 flex justify-end">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeInstallment(index)}
//                           className="h-8 w-8 p-0 text-destructive"
//                           disabled={form.installments.length <= 1}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {form.installments.length === 0 && (
//                   <p className="text-sm text-muted-foreground text-center py-2">
//                     No installments added. Click "Add" to start.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* New Client Fields */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Buyer Name"
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
//                       )
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
//             {loading
//               ? "Saving..."
//               : isEdit
//               ? "Update Booking"
//               : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }





// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [gstAmountOnBooking, setGstAmountOnBooking] = useState(""); // ✅ renamed

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "",
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getTotalGSTAmount = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     const gstPercent = getGSTPercentage();
//     return Math.round((flatPrice * gstPercent) / 100);
//   };

//   const getGSTOnBooking = () => {
//     return Number(gstAmountOnBooking) || 0;
//   };

//   const getGSTOnInstallments = () => {
//     return getTotalGSTAmount() - getGSTOnBooking();
//   };

//   const getTotalPayable = () => {
//     const amount = parseFloat(form.bookingAmount) || 0;
//     return amount + getGSTOnBooking();
//   };

//   const getInstallmentTarget = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     const bookingAmt = parseFloat(form.bookingAmount) || 0;
//     const totalGst = getTotalGSTAmount();
//     const gstOnBooking = getGSTOnBooking();
//     return (flatPrice - bookingAmt) + (totalGst - gstOnBooking);
//   };

//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     setForm({
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
//       bookingAmount: editBooking.bookingAmount || "",
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate
//         ? editBooking.agreementDate.slice(0, 10)
//         : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName:
//         editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone:
//         editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation:
//         editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });

//     // ✅ Updated to handle both legacy gstPaid and new gstAmountOnBooking
//     setGstAmountOnBooking(
//       editBooking.gstPaid ||
//       editBooking.gstAmountOnBooking ||
//       0
//     );

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//     setGstAmountOnBooking(""); // ✅ reset
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
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
//             user.role === "admin"
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

//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists =
//           form.towerName &&
//           project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({
//             ...prev,
//             towerName: "",
//             floor: "",
//             flatId: "",
//           }));
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists =
//           form.floor &&
//           tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setFlats([]);
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find(
//         (f) => String(f.floorNumber) === String(form.floor)
//       );
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists =
//           form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setSelectedFlat(null);
//           setForm((prev) => ({ ...prev, flatId: "" }));
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

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

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({
//       ...inst,
//       installmentNumber: idx + 1,
//     }));
//     setForm((prev) => ({
//       ...prev,
//       installments: renumbered,
//     }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({
//       ...prev,
//       installments: updated,
//     }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce(
//       (sum, inst) => sum + (parseFloat(inst.amount) || 0),
//       0
//     );
//   };

//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some(
//         (inst) => !inst.description || !inst.amount
//       );
//       if (invalid) {
//         toast.error(
//           "All installment fields (description, amount) are required"
//         );
//         return;
//       }
//     }

//     setLoading(true);

//     const flatPrice = selectedFlat?.price || 0;
//     const calculatedGstPercent = flatPrice >= 4500000 ? 5 : 1;

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount),
//       paymentMode: form.paymentMode,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//       gstPercentage: calculatedGstPercent,
//       // ✅ Use new field name
//       gstAmountOnBooking: Number(gstAmountOnBooking) || 0,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName)
//         personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone)
//         personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation)
//         personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
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
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
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
//                     <SelectItem
//                       key={f._id}
//                       value={f._id}
//                       disabled={f.status !== "available" && !isEdit}
//                     >
//                       {f.flatNumber} - {f.bedrooms} BHK - {f.area} sqft -{" "}
//                       {formatCurrency(f.price || 0)} - ({f.status})
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
//                 <p className="text-sm font-medium">{formatCurrency(selectedFlat.price || 0)}</p>
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
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
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

//           {/* Booking Details */}
//           <div className="border-t pt-2">
//             <h3 className="font-semibold">Booking Details</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <Label>Booking Amount *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-medium"
//                   />
//                   <span className="text-xs text-muted-foreground">
//                     Advance Token Amount
//                   </span>
//                 </div>

//                 <div>
//                   {/* ✅ Updated label and hint */}
//                   <Label>GST Paid at Booking (₹)</Label>
//                   <Input
//                     type="number"
//                     min={0}
//                     max={getTotalGSTAmount()}
//                     value={gstAmountOnBooking}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       const numVal = Number(val);

//                       // ✅ Validation: Booking amount must be entered first
//                       if (!form.bookingAmount || Number(form.bookingAmount) <= 0) {
//                         toast.error("Please enter Booking Amount first");
//                         return;
//                       }

//                       const totalGst = getTotalGSTAmount();
//                       if (val !== "" && !isNaN(numVal) && (numVal < 0 || numVal > totalGst)) {
//                         toast.error(
//                           `GST paid cannot exceed Total GST of ${formatCurrency(totalGst)}`
//                         );
//                         return;
//                       }
//                       setGstAmountOnBooking(val);
//                     }}
//                     placeholder={`e.g. 15000`}
//                     disabled={!selectedFlat}
//                   />
//                   <span className="text-xs text-muted-foreground">
//                     Enter GST amount customer wants to pay during booking
//                   </span>
//                 </div>

//                 <div>
//                   <Label className="text-xs text-muted-foreground">
//                     Total Flat GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-lg font-semibold text-primary">
//                     {formatCurrency(getTotalGSTAmount())}
//                   </div>
//                   <span className="text-xs text-muted-foreground">
//                     Calculated on Flat Price
//                   </span>
//                 </div>

//                 <div>
//                   <Label className="text-xs text-muted-foreground">
//                     Customer Pays Today
//                   </Label>
//                   <div className="text-xl font-bold text-green-600">
//                     {formatCurrency(getTotalPayable())}
//                   </div>
//                   <span className="text-xs text-muted-foreground">
//                     Booking Amount + GST paid now
//                   </span>
//                 </div>
//               </div>

//               {selectedFlat && parseFloat(form.bookingAmount) > 0 && (
//                 <div className="mt-2 p-2 bg-muted/30 rounded-md text-xs flex gap-6 flex-wrap">
//                   <span>
//                     Booking Amount:{" "}
//                     <strong>{formatCurrency(parseFloat(form.bookingAmount) || 0)}</strong>
//                   </span>
//                   <span>
//                     + GST Paid Now:{" "}
//                     <strong>{formatCurrency(getGSTOnBooking())}</strong>
//                   </span>
//                   <span>
//                     = Customer Pays Today:{" "}
//                     <strong className="text-primary">{formatCurrency(getTotalPayable())}</strong>
//                   </span>
//                   <span className="text-muted-foreground">
//                     Remaining GST for Installments:{" "}
//                     <strong>{formatCurrency(getGSTOnInstallments())}</strong>
//                   </span>
//                 </div>
//               )}
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
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.remarks}
//                 onChange={(e) => updateForm("remarks", e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-2">
//             <div className="flex items-center gap-3 mb-2">
//               <h3 className="font-semibold">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span>Custom plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">
//                 (If unchecked, backend will create 3 equal installments)
//               </span>
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-3">
//                 <div className="flex justify-between items-start gap-4">
//                   <div className="text-sm text-muted-foreground flex-1">
//                     <p className="mb-2">
//                       Current Installment Total:{" "}
//                       <span className="font-medium text-foreground text-base">
//                         {formatCurrency(getTotalInstallmentAmount())}
//                       </span>
//                     </p>

//                     {selectedFlat &&
//                       (() => {
//                         const flatPrice = selectedFlat.price || 0;
//                         const gstPercent = getGSTPercentage();
//                         const totalGst = getTotalGSTAmount();
//                         const bookingAmt = Number(form.bookingAmount) || 0;
//                         const gstOnBooking = getGSTOnBooking();

//                         const targetTotal = getInstallmentTarget();
//                         const currentTotal = getTotalInstallmentAmount();
//                         const diff = targetTotal - currentTotal;

//                         return (
//                           <div className="p-3 bg-muted/30 border rounded-md space-y-1.5 text-xs">
//                             <div className="flex justify-between">
//                               <span>Base Price:</span>{" "}
//                               <strong>{formatCurrency(flatPrice)}</strong>
//                             </div>
//                             <div className="flex justify-between">
//                               <span>Total GST ({gstPercent}%):</span>{" "}
//                               <strong>+ {formatCurrency(totalGst)}</strong>
//                             </div>
//                             <div className="flex justify-between text-blue-600">
//                               <span>GST Paid at Booking:</span>{" "}
//                               <strong>- {formatCurrency(gstOnBooking)}</strong>
//                             </div>
//                             <div className="flex justify-between">
//                               <span>Booking Amount:</span>{" "}
//                               <strong>- {formatCurrency(bookingAmt)}</strong>
//                             </div>
//                             <div className="flex justify-between text-primary font-semibold mt-1 pt-2 border-t">
//                               <span>Target Installments Total:</span>
//                               <span>{formatCurrency(targetTotal)}</span>
//                             </div>
//                             <div className="flex justify-between text-muted-foreground">
//                               <span>Breakup:</span>
//                               <span>
//                                 Base: {formatCurrency(flatPrice - bookingAmt)} + GST:{" "}
//                                 {formatCurrency(totalGst - gstOnBooking)}
//                               </span>
//                             </div>
//                             {diff !== 0 && (
//                               <div
//                                 className={`mt-1 font-medium ${
//                                   diff > 0
//                                     ? "text-amber-600"
//                                     : "text-destructive"
//                                 }`}
//                               >
//                                 {diff > 0
//                                   ? `⚠️ You need to add ${formatCurrency(
//                                       diff
//                                     )} more to match the target.`
//                                   : `⚠️ Total exceeds the target by ${formatCurrency(
//                                       Math.abs(diff)
//                                     )}.`}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                   </div>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={addInstallment}
//                     className="gap-1 mt-1"
//                   >
//                     <Plus className="h-4 w-4" /> Add
//                   </Button>
//                 </div>

//                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                   {form.installments.map((inst, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md"
//                     >
//                       <div className="col-span-1 text-sm font-medium text-center">
//                         {inst.installmentNumber}
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           placeholder="Description"
//                           value={inst.description}
//                           onChange={(e) =>
//                             updateInstallment(
//                               index,
//                               "description",
//                               e.target.value
//                             )
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Input
//                           type="number"
//                           placeholder="Amount"
//                           value={inst.amount}
//                           onChange={(e) =>
//                             updateInstallment(index, "amount", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-3">
//                         <Input
//                           type="date"
//                           value={inst.dueDate}
//                           onChange={(e) =>
//                             updateInstallment(index, "dueDate", e.target.value)
//                           }
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                       <div className="col-span-2 flex justify-end">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeInstallment(index)}
//                           className="h-8 w-8 p-0 text-destructive"
//                           disabled={form.installments.length <= 1}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {form.installments.length === 0 && (
//                   <p className="text-sm text-muted-foreground text-center py-2">
//                     No installments added. Click "Add" to start.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* New Client Fields */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-2">
//                 <h3 className="font-semibold">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Buyer Name"
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
//                       )
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
//             {loading
//               ? "Saving..."
//               : isEdit
//               ? "Update Booking"
//               : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }



// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", // Base Amount (No GST)
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- TRANSPARENT GST CALCULATIONS FOR UI ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
//       bookingAmount: editBooking.bookingBaseAmount || editBooking.bookingAmount || "",
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName: editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone: editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation: editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

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

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount),
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount), // Sirf Base amount jayega, backend GST calculate karega
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail || undefined;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
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
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount. GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Rest of the original Booking Details Inputs */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input type="date" value={form.agreementDate} onChange={(e) => updateForm("agreementDate", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input placeholder="Optional" value={form.nomineeName} onChange={(e) => updateForm("nomineeName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input placeholder="Optional" value={form.nomineeRelation} onChange={(e) => updateForm("nomineeRelation", e.target.value)} />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
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
//               <Input type="number" placeholder="Optional" value={form.serviceTaxPaid} onChange={(e) => updateForm("serviceTaxPaid", e.target.value)} />
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground ml-2">(If unchecked, system creates 3 equal installments)</span>
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* New Client Fields (Original structure preserved exactly) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }








// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // Amount Calculator Component
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3");
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 12) {
//       toast.error("Maximum 12 installments allowed");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: "",
//         isFirst: true,
//       });
//       remaining -= firstAmount;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast 
//         ? adjustedRemaining 
//         : equalAmount;
      
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: "",
//       });
//     }

//     setCalculatedInstallments(installments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div>
//               <Label className="font-semibold">Number of Installments *</Label>
//               <Select value={numberOfInstallments} onValueChange={setNumberOfInstallments}>
//                 <SelectTrigger className="mt-1">
//                   <SelectValue placeholder="Select number" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num} Installment{num > 1 ? "s" : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label className="font-semibold">First Installment Percentage (Optional)</Label>
//               <div className="flex items-center gap-2 mt-1">
//                 <Input
//                   type="number"
//                   placeholder="e.g., 30"
//                   value={firstInstallmentPercentage}
//                   onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                   min="0"
//                   max="100"
//                 />
//                 <span className="text-muted-foreground">%</span>
//               </div>
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Leave empty for equal distribution
//               </span>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Calculate Installments
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-semibold text-sm">Calculated Plan</h4>
//                 <div className="text-xs">
//                   <span className="text-muted-foreground">Total: </span>
//                   <span className="font-bold">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className="flex items-center justify-between p-3 bg-white border rounded-md"
//                   >
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{inst.description}</p>
//                       <p className="text-xs text-muted-foreground">
//                         Installment #{index + 1}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-primary">{formatCurrency(inst.amount)}</p>
//                       {inst.isFirst && firstInstallmentPercentage && (
//                         <span className="text-xs text-muted-foreground">
//                           {firstInstallmentPercentage}% of total
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", // Base Amount (No GST)
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- TRANSPARENT GST CALCULATIONS FOR UI ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
//       bookingAmount: editBooking.bookingBaseAmount || editBooking.bookingAmount || "",
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName: editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone: editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation: editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

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

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount),
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount), // Sirf Base amount jayega, backend GST calculate karega
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail || undefined;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
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
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount. GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Rest of the original Booking Details Inputs */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input type="date" value={form.agreementDate} onChange={(e) => updateForm("agreementDate", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input placeholder="Optional" value={form.nomineeName} onChange={(e) => updateForm("nomineeName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input placeholder="Optional" value={form.nomineeRelation} onChange={(e) => updateForm("nomineeRelation", e.target.value)} />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
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
//               <Input type="number" placeholder="Optional" value={form.serviceTaxPaid} onChange={(e) => updateForm("serviceTaxPaid", e.target.value)} />
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* New Client Fields (Original structure preserved exactly) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }











// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // Amount Calculator Component (unchanged)
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3");
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 12) {
//       toast.error("Maximum 12 installments allowed");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: "",
//         isFirst: true,
//       });
//       remaining -= firstAmount;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast 
//         ? adjustedRemaining 
//         : equalAmount;
      
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: "",
//       });
//     }

//     setCalculatedInstallments(installments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div>
//               <Label className="font-semibold">Number of Installments *</Label>
//               <Select value={numberOfInstallments} onValueChange={setNumberOfInstallments}>
//                 <SelectTrigger className="mt-1">
//                   <SelectValue placeholder="Select number" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num} Installment{num > 1 ? "s" : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label className="font-semibold">First Installment Percentage (Optional)</Label>
//               <div className="flex items-center gap-2 mt-1">
//                 <Input
//                   type="number"
//                   placeholder="e.g., 30"
//                   value={firstInstallmentPercentage}
//                   onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                   min="0"
//                   max="100"
//                 />
//                 <span className="text-muted-foreground">%</span>
//               </div>
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Leave empty for equal distribution
//               </span>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Calculate Installments
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-semibold text-sm">Calculated Plan</h4>
//                 <div className="text-xs">
//                   <span className="text-muted-foreground">Total: </span>
//                   <span className="font-bold">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className="flex items-center justify-between p-3 bg-white border rounded-md"
//                   >
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{inst.description}</p>
//                       <p className="text-xs text-muted-foreground">
//                         Installment #{index + 1}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-primary">{formatCurrency(inst.amount)}</p>
//                       {inst.isFirst && firstInstallmentPercentage && (
//                         <span className="text-xs text-muted-foreground">
//                           {firstInstallmentPercentage}% of total
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", // ✅ Base Amount (NO GST)
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   // ---- Edit Initialization ----
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Load project/tower/floor/flat
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);

//     // ✅ CRITICAL: Convert Total Booking Amount (incl. GST) to Base Amount
//     const totalBookingAmount = parseFloat(editBooking.bookingAmount) || 0;
//     const flatPrice = flatObj?.price || 0;
//     const gstSlab = flatPrice >= 4500000 ? 5 : 1;
//     const baseBookingAmount = totalBookingAmount > 0
//       ? Math.round(totalBookingAmount / (1 + gstSlab / 100))
//       : 0;

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
      
//       // ✅ Store base amount
//       bookingAmount: baseBookingAmount.toString(),
      
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName: editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone: editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation: editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   // ---- Dependent useEffect for project/tower/floor/flat ----
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   // ---- Form update helpers ----
//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount), // ✅ Base amount
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount), // Base amount only
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail || undefined;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Render ----
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Rest of the original Booking Details Inputs */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input type="date" value={form.agreementDate} onChange={(e) => updateForm("agreementDate", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input placeholder="Optional" value={form.nomineeName} onChange={(e) => updateForm("nomineeName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input placeholder="Optional" value={form.nomineeRelation} onChange={(e) => updateForm("nomineeRelation", e.target.value)} />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
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
//               <Input type="number" placeholder="Optional" value={form.serviceTaxPaid} onChange={(e) => updateForm("serviceTaxPaid", e.target.value)} />
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* New Client Fields (Original structure preserved exactly) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }











// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator, RotateCcw } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // --- UPDATED: Amount Calculator Component ---
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3");
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 24) { // ✅ Updated limit to 24
//       toast.error("Maximum 24 installments allowed");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: "",
//         isFirst: true,
//         isManual: false, // ✅ Added flag for auto-adjustment logic
//       });
//       remaining -= firstAmount;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast 
//         ? adjustedRemaining 
//         : equalAmount;
      
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: "",
//         isManual: false, // ✅ Added flag for auto-adjustment logic
//       });
//     }

//     setCalculatedInstallments(installments);
//   };

//   // ✅ NEW LOGIC: Handle manual adjustment of specific installments
//   const handleManualAmountChange = (index, newAmountStr) => {
//     const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
//     const amount = parseFloat(totalAmount);
    
//     let updatedInstallments = [...calculatedInstallments];
    
//     // Lock this row as manually edited
//     updatedInstallments[index].amount = newAmount;
//     updatedInstallments[index].isManual = true;

//     // Calculate sum of all manual rows
//     let manualSum = 0;
//     let autoCount = 0;
//     let lastAutoIndex = -1;

//     updatedInstallments.forEach((inst, i) => {
//       if (inst.isManual) {
//         manualSum += inst.amount;
//       } else {
//         autoCount++;
//         lastAutoIndex = i; // Track the last auto row to dump rounding differences
//       }
//     });

//     if (manualSum > amount) {
//       toast.warning("Manual amounts exceed the total amount!");
//     }

//     // Distribute remaining balance equally among unlocked (auto) rows
//     const remainingBalance = amount - manualSum;
    
//     if (autoCount > 0) {
//       const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
//       let adjustedRemaining = Math.max(0, remainingBalance);

//       updatedInstallments.forEach((inst, i) => {
//         if (!inst.isManual) {
//           const isLastAuto = i === lastAutoIndex;
//           inst.amount = isLastAuto ? adjustedRemaining : equalShare;
//           adjustedRemaining -= inst.amount;
//         }
//       });
//     }

//     setCalculatedInstallments(updatedInstallments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   // ✅ Generate dropdown options up to 24
//   const installmentOptions = Array.from({ length: 24 }, (_, i) => i + 1);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div>
//               <Label className="font-semibold">Number of Installments *</Label>
//               <Select value={numberOfInstallments} onValueChange={setNumberOfInstallments}>
//                 <SelectTrigger className="mt-1">
//                   <SelectValue placeholder="Select number" />
//                 </SelectTrigger>
//                 <SelectContent className="max-h-60">
//                   {installmentOptions.map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num} Installment{num > 1 ? "s" : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label className="font-semibold">First Installment Percentage (Optional)</Label>
//               <div className="flex items-center gap-2 mt-1">
//                 <Input
//                   type="number"
//                   placeholder="e.g., 30"
//                   value={firstInstallmentPercentage}
//                   onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                   min="0"
//                   max="100"
//                 />
//                 <span className="text-muted-foreground">%</span>
//               </div>
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Leave empty for equal distribution
//               </span>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Generate Initial Plan
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h4 className="font-semibold text-sm flex items-center gap-2">
//                     Adjust Plan
//                     <span className="text-xs font-normal text-muted-foreground">
//                       (Edit amounts to auto-adjust)
//                     </span>
//                   </h4>
//                 </div>
//                 <div className="text-xs text-right">
//                   <span className="text-muted-foreground block mb-1">Total Allocated: </span>
//                   <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className={`flex items-center justify-between p-3 bg-white border rounded-md transition-colors ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
//                   >
//                     <div className="flex-1 mr-4">
//                       <p className="text-sm font-medium">{inst.description}</p>
//                       <p className="text-xs text-muted-foreground flex items-center gap-2">
//                         Installment #{index + 1}
//                         {inst.isManual && (
//                           <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
//                             Locked
//                           </span>
//                         )}
//                       </p>
//                     </div>
                    
//                     <div className="w-1/3 min-w-[120px]">
//                       <Input
//                         type="number"
//                         value={inst.amount === 0 ? "" : inst.amount}
//                         onChange={(e) => handleManualAmountChange(index, e.target.value)}
//                         className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // --- ORIGINAL PARENT COMPONENT (No changes required for calculation logic) ---
// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", // ✅ Base Amount (NO GST)
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   // ---- Edit Initialization ----
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Load project/tower/floor/flat
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);

//     // ✅ CRITICAL: Convert Total Booking Amount (incl. GST) to Base Amount
//     const totalBookingAmount = parseFloat(editBooking.bookingAmount) || 0;
//     const flatPrice = flatObj?.price || 0;
//     const gstSlab = flatPrice >= 4500000 ? 5 : 1;
//     const baseBookingAmount = totalBookingAmount > 0
//       ? Math.round(totalBookingAmount / (1 + gstSlab / 100))
//       : 0;

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
      
//       // ✅ Store base amount
//       bookingAmount: baseBookingAmount.toString(),
      
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName: editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone: editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation: editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   // ---- Dependent useEffect for project/tower/floor/flat ----
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   // ---- Form update helpers ----
//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount), // ✅ Base amount
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount), // Base amount only
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail || undefined;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Render ----
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Rest of the original Booking Details Inputs */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input type="date" value={form.agreementDate} onChange={(e) => updateForm("agreementDate", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input placeholder="Optional" value={form.nomineeName} onChange={(e) => updateForm("nomineeName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input placeholder="Optional" value={form.nomineeRelation} onChange={(e) => updateForm("nomineeRelation", e.target.value)} />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
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
//               <Input type="number" placeholder="Optional" value={form.serviceTaxPaid} onChange={(e) => updateForm("serviceTaxPaid", e.target.value)} />
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* New Client Fields (Original structure preserved exactly) */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }














// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator, RotateCcw } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // --- UPDATED: Amount Calculator Component ---
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3");
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 24) { // ✅ Updated limit to 24
//       toast.error("Maximum 24 installments allowed");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: "",
//         isFirst: true,
//         isManual: false, // ✅ Added flag for auto-adjustment logic
//       });
//       remaining -= firstAmount;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast 
//         ? adjustedRemaining 
//         : equalAmount;
      
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: "",
//         isManual: false, // ✅ Added flag for auto-adjustment logic
//       });
//     }

//     setCalculatedInstallments(installments);
//   };

//   // ✅ NEW LOGIC: Handle manual adjustment of specific installments
//   const handleManualAmountChange = (index, newAmountStr) => {
//     const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
//     const amount = parseFloat(totalAmount);
    
//     let updatedInstallments = [...calculatedInstallments];
    
//     // Lock this row as manually edited
//     updatedInstallments[index].amount = newAmount;
//     updatedInstallments[index].isManual = true;

//     // Calculate sum of all manual rows
//     let manualSum = 0;
//     let autoCount = 0;
//     let lastAutoIndex = -1;

//     updatedInstallments.forEach((inst, i) => {
//       if (inst.isManual) {
//         manualSum += inst.amount;
//       } else {
//         autoCount++;
//         lastAutoIndex = i; // Track the last auto row to dump rounding differences
//       }
//     });

//     if (manualSum > amount) {
//       toast.warning("Manual amounts exceed the total amount!");
//     }

//     // Distribute remaining balance equally among unlocked (auto) rows
//     const remainingBalance = amount - manualSum;
    
//     if (autoCount > 0) {
//       const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
//       let adjustedRemaining = Math.max(0, remainingBalance);

//       updatedInstallments.forEach((inst, i) => {
//         if (!inst.isManual) {
//           const isLastAuto = i === lastAutoIndex;
//           inst.amount = isLastAuto ? adjustedRemaining : equalShare;
//           adjustedRemaining -= inst.amount;
//         }
//       });
//     }

//     setCalculatedInstallments(updatedInstallments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   // ✅ Generate dropdown options up to 24
//   const installmentOptions = Array.from({ length: 24 }, (_, i) => i + 1);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div>
//               <Label className="font-semibold">Number of Installments *</Label>
//               <Select value={numberOfInstallments} onValueChange={setNumberOfInstallments}>
//                 <SelectTrigger className="mt-1">
//                   <SelectValue placeholder="Select number" />
//                 </SelectTrigger>
//                 <SelectContent className="max-h-60">
//                   {installmentOptions.map((num) => (
//                     <SelectItem key={num} value={num.toString()}>
//                       {num} Installment{num > 1 ? "s" : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label className="font-semibold">First Installment Percentage (Optional)</Label>
//               <div className="flex items-center gap-2 mt-1">
//                 <Input
//                   type="number"
//                   placeholder="e.g., 30"
//                   value={firstInstallmentPercentage}
//                   onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                   min="0"
//                   max="100"
//                 />
//                 <span className="text-muted-foreground">%</span>
//               </div>
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Leave empty for equal distribution
//               </span>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Generate Initial Plan
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h4 className="font-semibold text-sm flex items-center gap-2">
//                     Adjust Plan
//                     <span className="text-xs font-normal text-muted-foreground">
//                       (Edit amounts to auto-adjust)
//                     </span>
//                   </h4>
//                 </div>
//                 <div className="text-xs text-right">
//                   <span className="text-muted-foreground block mb-1">Total Allocated: </span>
//                   <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className={`flex items-center justify-between p-3 bg-white border rounded-md transition-colors ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
//                   >
//                     <div className="flex-1 mr-4">
//                       <p className="text-sm font-medium">{inst.description}</p>
//                       <p className="text-xs text-muted-foreground flex items-center gap-2">
//                         Installment #{index + 1}
//                         {inst.isManual && (
//                           <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
//                             Locked
//                           </span>
//                         )}
//                       </p>
//                     </div>
                    
//                     <div className="w-1/3 min-w-[120px]">
//                       <Input
//                         type="number"
//                         value={inst.amount === 0 ? "" : inst.amount}
//                         onChange={(e) => handleManualAmountChange(index, e.target.value)}
//                         className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // --- ORIGINAL PARENT COMPONENT ---
// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", // ✅ Base Amount (NO GST)
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   // ---- Edit Initialization ----
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Load project/tower/floor/flat
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);

//     // ✅ CRITICAL: Convert Total Booking Amount (incl. GST) to Base Amount
//     const totalBookingAmount = parseFloat(editBooking.bookingAmount) || 0;
//     const flatPrice = flatObj?.price || 0;
//     const gstSlab = flatPrice >= 4500000 ? 5 : 1;
//     const baseBookingAmount = totalBookingAmount > 0
//       ? Math.round(totalBookingAmount / (1 + gstSlab / 100))
//       : 0;

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
      
//       // ✅ Store base amount
//       bookingAmount: baseBookingAmount.toString(),
      
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName: editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone: editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation: editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   // ---- Dependent useEffect for project/tower/floor/flat ----
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   // ---- Form update helpers ----
//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount), // ✅ Base amount
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount), // Base amount only
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail || undefined;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Render ----
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                     disabled={isEdit} 
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Rest of the original Booking Details Inputs */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input type="date" value={form.agreementDate} onChange={(e) => updateForm("agreementDate", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input placeholder="Optional" value={form.nomineeName} onChange={(e) => updateForm("nomineeName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input placeholder="Optional" value={form.nomineeRelation} onChange={(e) => updateForm("nomineeRelation", e.target.value)} />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
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
//               <Input type="number" placeholder="Optional" value={form.serviceTaxPaid} onChange={(e) => updateForm("serviceTaxPaid", e.target.value)} />
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* New Client Fields */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }




// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator, RotateCcw, CalendarClock } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // --- UPDATED: Amount Calculator Component ---
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3"); // Now a dynamic number input
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
  
//   // ✅ New States for Auto-Date Calculation
//   const [startDate, setStartDate] = useState("");
//   const [frequency, setFrequency] = useState("monthly");
  
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   // Helper to add months accurately
//   const calculateDueDate = (startStr, index, freq) => {
//     if (!startStr) return "";
//     const date = new Date(startStr);
//     if (isNaN(date.getTime())) return ""; // Invalid date

//     let monthsToAdd = 0;
//     switch (freq) {
//       case "monthly": monthsToAdd = 1; break;
//       case "quarterly": monthsToAdd = 3; break;
//       case "biannually": monthsToAdd = 6; break;
//       case "annually": monthsToAdd = 12; break;
//       default: monthsToAdd = 1;
//     }

//     // Add required months
//     date.setMonth(date.getMonth() + (index * monthsToAdd));
    
//     // Format to YYYY-MM-DD for input type="date"
//     return date.toISOString().split("T")[0];
//   };

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 300) { // ✅ Updated limit to 25 Years (300 Months)
//       toast.error("Maximum 300 installments allowed (25 years limit)");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;
//     let rowIndexForDate = 0;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isFirst: true,
//         isManual: false,
//       });
//       remaining -= firstAmount;
//       rowIndexForDate++;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast 
//         ? adjustedRemaining 
//         : equalAmount;
      
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isManual: false,
//       });
//       rowIndexForDate++;
//     }

//     setCalculatedInstallments(installments);
//   };

//   const handleManualAmountChange = (index, newAmountStr) => {
//     const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
//     const amount = parseFloat(totalAmount);
    
//     let updatedInstallments = [...calculatedInstallments];
    
//     updatedInstallments[index].amount = newAmount;
//     updatedInstallments[index].isManual = true;

//     let manualSum = 0;
//     let autoCount = 0;
//     let lastAutoIndex = -1;

//     updatedInstallments.forEach((inst, i) => {
//       if (inst.isManual) {
//         manualSum += inst.amount;
//       } else {
//         autoCount++;
//         lastAutoIndex = i;
//       }
//     });

//     if (manualSum > amount) {
//       toast.warning("Manual amounts exceed the total amount!");
//     }

//     const remainingBalance = amount - manualSum;
    
//     if (autoCount > 0) {
//       const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
//       let adjustedRemaining = Math.max(0, remainingBalance);

//       updatedInstallments.forEach((inst, i) => {
//         if (!inst.isManual) {
//           const isLastAuto = i === lastAutoIndex;
//           inst.amount = isLastAuto ? adjustedRemaining : equalShare;
//           adjustedRemaining -= inst.amount;
//         }
//       });
//     }

//     setCalculatedInstallments(updatedInstallments);
//   };

//   // ✅ New handler for manual date adjustment in the generated plan
//   const handleManualDateChange = (index, newDate) => {
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].dueDate = newDate;
//     setCalculatedInstallments(updatedInstallments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1 bg-white"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="font-semibold">Number of Installments *</Label>
//                 <Input
//                   type="number"
//                   placeholder="e.g. 24"
//                   value={numberOfInstallments}
//                   onChange={(e) => setNumberOfInstallments(e.target.value)}
//                   min="1"
//                   max="300"
//                   className="mt-1 bg-white"
//                 />
//                 <span className="text-[10px] text-muted-foreground mt-1 block">Max 300 (25 Years)</span>
//               </div>

//               <div>
//                 <Label className="font-semibold">1st Installment % (Optional)</Label>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Input
//                     type="number"
//                     placeholder="e.g. 30"
//                     value={firstInstallmentPercentage}
//                     onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                     min="0"
//                     max="100"
//                     className="bg-white"
//                   />
//                   <span className="text-muted-foreground">%</span>
//                 </div>
//               </div>
//             </div>

//             {/* ✅ NEW: Auto-Date Configuration */}
//             <div className="border-t border-muted-foreground/20 pt-3">
//               <Label className="font-semibold flex items-center gap-2 mb-2 text-primary">
//                 <CalendarClock className="h-4 w-4" />
//                 Auto-Calculate Due Dates
//               </Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Start Date (Optional)</Label>
//                   <Input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="mt-1 bg-white"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Frequency</Label>
//                   <Select value={frequency} onValueChange={setFrequency}>
//                     <SelectTrigger className="mt-1 bg-white">
//                       <SelectValue placeholder="Select Frequency" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="monthly">Monthly</SelectItem>
//                       <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
//                       <SelectItem value="biannually">Bi-annually (6 Months)</SelectItem>
//                       <SelectItem value="annually">Annually (12 Months)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Generate Initial Plan
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h4 className="font-semibold text-sm flex items-center gap-2">
//                     Adjust Plan
//                     <span className="text-xs font-normal text-muted-foreground">
//                       (Edit amounts or dates manually)
//                     </span>
//                   </h4>
//                 </div>
//                 <div className="text-xs text-right">
//                   <span className="text-muted-foreground block mb-1">Total Allocated: </span>
//                   <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className={`p-3 bg-white border rounded-md transition-colors space-y-3 ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1 mr-4">
//                         <p className="text-sm font-medium">{inst.description}</p>
//                         <p className="text-xs text-muted-foreground flex items-center gap-2">
//                           Installment #{index + 1}
//                           {inst.isManual && (
//                             <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
//                               Locked
//                             </span>
//                           )}
//                         </p>
//                       </div>
                      
//                       <div className="w-1/3 min-w-[120px]">
//                         <Input
//                           type="number"
//                           value={inst.amount === 0 ? "" : inst.amount}
//                           onChange={(e) => handleManualAmountChange(index, e.target.value)}
//                           className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
//                           placeholder="Amount"
//                         />
//                       </div>
//                     </div>
                    
//                     {/* ✅ Inline Due Date Editor for adjustments */}
//                     <div className="flex items-center gap-3 bg-muted/20 p-2 rounded border border-muted/50">
//                       <Label className="text-xs text-muted-foreground w-16">Due Date</Label>
//                       <Input 
//                         type="date" 
//                         value={inst.dueDate} 
//                         onChange={(e) => handleManualDateChange(index, e.target.value)} 
//                         className="h-8 text-xs flex-1 bg-white" 
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // --- ORIGINAL PARENT COMPONENT ---
// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", // ✅ Base Amount (NO GST)
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   // ---- Edit Initialization ----
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Load project/tower/floor/flat
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);

//     // ✅ CRITICAL: Convert Total Booking Amount (incl. GST) to Base Amount
//     const totalBookingAmount = parseFloat(editBooking.bookingAmount) || 0;
//     const flatPrice = flatObj?.price || 0;
//     const gstSlab = flatPrice >= 4500000 ? 5 : 1;
//     const baseBookingAmount = totalBookingAmount > 0
//       ? Math.round(totalBookingAmount / (1 + gstSlab / 100))
//       : 0;

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
      
//       bookingAmount: baseBookingAmount.toString(),
      
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: editBooking.nomineeName || "",
//       nomineeRelation: editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       clientName: editBooking.clientId?.name || "",
//       clientEmail: editBooking.clientId?.email || "",
//       clientPhone: editBooking.clientId?.phone || "",
//       clientPassword: "",

//       dateOfBirth: editBooking.personalDetails?.dateOfBirth?.slice?.(0, 10) || "",
//       gender: editBooking.personalDetails?.gender || "",
//       bloodGroup: editBooking.personalDetails?.bloodGroup || "",
//       maritalStatus: editBooking.personalDetails?.maritalStatus || "",
//       aadharNumber: editBooking.personalDetails?.aadharNumber || "",
//       panNumber: editBooking.personalDetails?.panNumber || "",
//       fatherName: editBooking.personalDetails?.fatherName || "",
//       motherName: editBooking.personalDetails?.motherName || "",
//       emergencyContactName: editBooking.personalDetails?.emergencyContactName || "",
//       emergencyContactPhone: editBooking.personalDetails?.emergencyContactPhone || "",
//       emergencyContactRelation: editBooking.personalDetails?.emergencyContactRelation || "",
//       addressLine1: editBooking.personalDetails?.permanentAddress?.line1 || "",
//       city: editBooking.personalDetails?.permanentAddress?.city || "",
//       state: editBooking.personalDetails?.permanentAddress?.state || "",
//       country: editBooking.personalDetails?.permanentAddress?.country || "India",
//       pincode: editBooking.personalDetails?.permanentAddress?.pincode || "",

//       bankName: editBooking.bankDetails?.bankName || "",
//       accountNumber: editBooking.bankDetails?.accountNumber || "",
//       ifscCode: editBooking.bankDetails?.ifscCode || "",
//       upiId: editBooking.bankDetails?.upiId || "",
//       accountHolderName: editBooking.bankDetails?.accountHolderName || "",
//       accountType: editBooking.bankDetails?.accountType || "",
//       branchName: editBooking.bankDetails?.branchName || "",

//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   // ---- Dependent useEffect for project/tower/floor/flat ----
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   // ---- Form update helpers ----
//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount), 
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail || undefined;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Render ----
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                     disabled={isEdit} 
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Rest of the original Booking Details Inputs */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input type="date" value={form.agreementDate} onChange={(e) => updateForm("agreementDate", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input placeholder="Optional" value={form.nomineeName} onChange={(e) => updateForm("nomineeName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input placeholder="Optional" value={form.nomineeRelation} onChange={(e) => updateForm("nomineeRelation", e.target.value)} />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
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
//               <Input type="number" placeholder="Optional" value={form.serviceTaxPaid} onChange={(e) => updateForm("serviceTaxPaid", e.target.value)} />
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold bg-white" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* New Client Fields */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }







// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator, CalendarClock } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // --- UPDATED: Amount Calculator Component ---
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3");
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
  
//   // ✅ New States for Auto-Date Calculation
//   const [startDate, setStartDate] = useState("");
//   const [frequency, setFrequency] = useState("monthly");
  
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   // Helper to add months accurately
//   const calculateDueDate = (startStr, index, freq) => {
//     if (!startStr) return "";
//     const date = new Date(startStr);
//     if (isNaN(date.getTime())) return "";

//     let monthsToAdd = 0;
//     switch (freq) {
//       case "monthly": monthsToAdd = 1; break;
//       case "quarterly": monthsToAdd = 3; break;
//       case "biannually": monthsToAdd = 6; break;
//       case "annually": monthsToAdd = 12; break;
//       default: monthsToAdd = 1;
//     }

//     date.setMonth(date.getMonth() + (index * monthsToAdd));
//     return date.toISOString().split("T")[0];
//   };

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 300) { 
//       toast.error("Maximum 300 installments allowed (25 years limit)");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;
//     let rowIndexForDate = 0;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isFirst: true,
//         isManual: false,
//       });
//       remaining -= firstAmount;
//       rowIndexForDate++;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast ? adjustedRemaining : equalAmount;
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isManual: false,
//       });
//       rowIndexForDate++;
//     }

//     setCalculatedInstallments(installments);
//   };

//   const handleManualAmountChange = (index, newAmountStr) => {
//     const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
//     const amount = parseFloat(totalAmount);
    
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].amount = newAmount;
//     updatedInstallments[index].isManual = true;

//     let manualSum = 0;
//     let autoCount = 0;
//     let lastAutoIndex = -1;

//     updatedInstallments.forEach((inst, i) => {
//       if (inst.isManual) {
//         manualSum += inst.amount;
//       } else {
//         autoCount++;
//         lastAutoIndex = i;
//       }
//     });

//     if (manualSum > amount) {
//       toast.warning("Manual amounts exceed the total amount!");
//     }

//     const remainingBalance = amount - manualSum;
    
//     if (autoCount > 0) {
//       const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
//       let adjustedRemaining = Math.max(0, remainingBalance);

//       updatedInstallments.forEach((inst, i) => {
//         if (!inst.isManual) {
//           const isLastAuto = i === lastAutoIndex;
//           inst.amount = isLastAuto ? adjustedRemaining : equalShare;
//           adjustedRemaining -= inst.amount;
//         }
//       });
//     }

//     setCalculatedInstallments(updatedInstallments);
//   };

//   const handleManualDateChange = (index, newDate) => {
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].dueDate = newDate;
//     setCalculatedInstallments(updatedInstallments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1 bg-white"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="font-semibold">Number of Installments *</Label>
//                 <Input
//                   type="number"
//                   placeholder="e.g. 24"
//                   value={numberOfInstallments}
//                   onChange={(e) => setNumberOfInstallments(e.target.value)}
//                   min="1"
//                   max="300"
//                   className="mt-1 bg-white"
//                 />
//                 <span className="text-[10px] text-muted-foreground mt-1 block">Max 300 (25 Years)</span>
//               </div>

//               <div>
//                 <Label className="font-semibold">1st Installment % (Optional)</Label>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Input
//                     type="number"
//                     placeholder="e.g. 30"
//                     value={firstInstallmentPercentage}
//                     onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                     min="0"
//                     max="100"
//                     className="bg-white"
//                   />
//                   <span className="text-muted-foreground">%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-muted-foreground/20 pt-3">
//               <Label className="font-semibold flex items-center gap-2 mb-2 text-primary">
//                 <CalendarClock className="h-4 w-4" />
//                 Auto-Calculate Due Dates
//               </Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Start Date (Optional)</Label>
//                   <Input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="mt-1 bg-white"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Frequency</Label>
//                   <Select value={frequency} onValueChange={setFrequency}>
//                     <SelectTrigger className="mt-1 bg-white">
//                       <SelectValue placeholder="Select Frequency" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="monthly">Monthly</SelectItem>
//                       <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
//                       <SelectItem value="biannually">Bi-annually (6 Months)</SelectItem>
//                       <SelectItem value="annually">Annually (12 Months)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Generate Initial Plan
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h4 className="font-semibold text-sm flex items-center gap-2">
//                     Adjust Plan
//                     <span className="text-xs font-normal text-muted-foreground">
//                       (Edit amounts or dates manually)
//                     </span>
//                   </h4>
//                 </div>
//                 <div className="text-xs text-right">
//                   <span className="text-muted-foreground block mb-1">Total Allocated: </span>
//                   <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className={`p-3 bg-white border rounded-md transition-colors space-y-3 ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1 mr-4">
//                         <p className="text-sm font-medium">{inst.description}</p>
//                         <p className="text-xs text-muted-foreground flex items-center gap-2">
//                           Installment #{index + 1}
//                           {inst.isManual && (
//                             <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
//                               Locked
//                             </span>
//                           )}
//                         </p>
//                       </div>
                      
//                       <div className="w-1/3 min-w-[120px]">
//                         <Input
//                           type="number"
//                           value={inst.amount === 0 ? "" : inst.amount}
//                           onChange={(e) => handleManualAmountChange(index, e.target.value)}
//                           className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
//                           placeholder="Amount"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3 bg-muted/20 p-2 rounded border border-muted/50">
//                       <Label className="text-xs text-muted-foreground w-16">Due Date</Label>
//                       <Input 
//                         type="date" 
//                         value={inst.dueDate} 
//                         onChange={(e) => handleManualDateChange(index, e.target.value)} 
//                         className="h-8 text-xs flex-1 bg-white" 
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // --- ORIGINAL PARENT COMPONENT ---
// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", 
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     serviceTaxPaid: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   // ---- ✅ Edit Initialization (UPDATED TO MAP DEEP JSON FIELDS) ----
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Load project/tower/floor/flat
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);

//     // ✅ Safely extract nested objects from Detailed API Response
//     const pDetails = editBooking.personalDetails || {};
//     const bDetails = editBooking.bankDetails || {};
//     const client = editBooking.clientId || {};
//     const permAddress = pDetails.address?.permanentAddress || {};
//     const emergency = pDetails.emergencyContact || {};
//     const nominee = editBooking.nominee || {};

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
      
//       // Map API's base amount 
//       bookingAmount: editBooking.bookingBaseAmount ? editBooking.bookingBaseAmount.toString() : (editBooking.bookingAmount ? editBooking.bookingAmount.toString() : ""),
      
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: nominee.name || editBooking.nomineeName || "",
//       nomineeRelation: nominee.relation || editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       serviceTaxPaid: editBooking.serviceTaxPaid || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
      
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       // Nested Client Mapping
//       clientName: client.name || "",
//       clientEmail: client.email || "",
//       clientPhone: client.phone || "",
//       clientPassword: "",

//       // Nested Personal Details Mapping
//       dateOfBirth: pDetails.dateOfBirth ? pDetails.dateOfBirth.slice(0, 10) : "",
//       gender: pDetails.gender || "",
//       bloodGroup: pDetails.bloodGroup || "",
//       maritalStatus: pDetails.maritalStatus || "",
//       aadharNumber: pDetails.aadharNumber || "",
//       panNumber: pDetails.panNumber || "",
//       fatherName: pDetails.fatherName || "",
//       motherName: pDetails.motherName || "",
//       emergencyContactName: emergency.name || "",
//       emergencyContactPhone: emergency.phone || "",
//       emergencyContactRelation: emergency.relation || "",
      
//       // Nested Address Mapping
//       addressLine1: permAddress.line1 || "",
//       city: permAddress.city || "",
//       state: permAddress.state || "",
//       country: permAddress.country || "India",
//       pincode: permAddress.pincode || "",

//       // Bank Details Mapping
//       bankName: bDetails.bankName || "",
//       accountNumber: bDetails.accountNumber || "",
//       ifscCode: bDetails.ifscCode || "",
//       upiId: bDetails.upiId || "",
//       accountHolderName: bDetails.accountHolderName || "",
//       accountType: bDetails.accountType || "",
//       branchName: bDetails.branchName || "",

//       // Installments Mapping
//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   // ---- Dependent useEffect for project/tower/floor/flat ----
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   // ---- Form update helpers ----
//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount), 
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       serviceTaxPaid: form.serviceTaxPaid ? Number(form.serviceTaxPaid) : undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       payload.clientEmail = form.clientEmail || undefined;
//       payload.clientPhone = form.clientPhone;
//       payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Render ----
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                     disabled={isEdit} 
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Rest of the original Booking Details Inputs */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input type="date" value={form.agreementDate} onChange={(e) => updateForm("agreementDate", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input placeholder="Optional" value={form.nomineeName} onChange={(e) => updateForm("nomineeName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input placeholder="Optional" value={form.nomineeRelation} onChange={(e) => updateForm("nomineeRelation", e.target.value)} />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
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
//               <Input type="number" placeholder="Optional" value={form.serviceTaxPaid} onChange={(e) => updateForm("serviceTaxPaid", e.target.value)} />
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold bg-white" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* New Client Fields */}
//           {!form.leadId && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }








// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator, CalendarClock } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // --- UPDATED: Amount Calculator Component ---
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3");
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
  
//   // ✅ States for Auto-Date Calculation
//   const [startDate, setStartDate] = useState("");
//   const [frequency, setFrequency] = useState("monthly");
  
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   // Helper to add months accurately
//   const calculateDueDate = (startStr, index, freq) => {
//     if (!startStr) return "";
//     const date = new Date(startStr);
//     if (isNaN(date.getTime())) return "";

//     let monthsToAdd = 0;
//     switch (freq) {
//       case "monthly": monthsToAdd = 1; break;
//       case "quarterly": monthsToAdd = 3; break;
//       case "biannually": monthsToAdd = 6; break;
//       case "annually": monthsToAdd = 12; break;
//       default: monthsToAdd = 1;
//     }

//     date.setMonth(date.getMonth() + (index * monthsToAdd));
//     return date.toISOString().split("T")[0];
//   };

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 300) { 
//       toast.error("Maximum 300 installments allowed (25 years limit)");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;
//     let rowIndexForDate = 0;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isFirst: true,
//         isManual: false,
//       });
//       remaining -= firstAmount;
//       rowIndexForDate++;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast ? adjustedRemaining : equalAmount;
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isManual: false,
//       });
//       rowIndexForDate++;
//     }

//     setCalculatedInstallments(installments);
//   };

//   const handleManualAmountChange = (index, newAmountStr) => {
//     const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
//     const amount = parseFloat(totalAmount);
    
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].amount = newAmount;
//     updatedInstallments[index].isManual = true;

//     let manualSum = 0;
//     let autoCount = 0;
//     let lastAutoIndex = -1;

//     updatedInstallments.forEach((inst, i) => {
//       if (inst.isManual) {
//         manualSum += inst.amount;
//       } else {
//         autoCount++;
//         lastAutoIndex = i;
//       }
//     });

//     if (manualSum > amount) {
//       toast.warning("Manual amounts exceed the total amount!");
//     }

//     const remainingBalance = amount - manualSum;
    
//     if (autoCount > 0) {
//       const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
//       let adjustedRemaining = Math.max(0, remainingBalance);

//       updatedInstallments.forEach((inst, i) => {
//         if (!inst.isManual) {
//           const isLastAuto = i === lastAutoIndex;
//           inst.amount = isLastAuto ? adjustedRemaining : equalShare;
//           adjustedRemaining -= inst.amount;
//         }
//       });
//     }

//     setCalculatedInstallments(updatedInstallments);
//   };

//   const handleManualDateChange = (index, newDate) => {
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].dueDate = newDate;
//     setCalculatedInstallments(updatedInstallments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1 bg-white"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="font-semibold">Number of Installments *</Label>
//                 <Input
//                   type="number"
//                   placeholder="e.g. 24"
//                   value={numberOfInstallments}
//                   onChange={(e) => setNumberOfInstallments(e.target.value)}
//                   min="1"
//                   max="300"
//                   className="mt-1 bg-white"
//                 />
//                 <span className="text-[10px] text-muted-foreground mt-1 block">Max 300 (25 Years)</span>
//               </div>

//               <div>
//                 <Label className="font-semibold">1st Installment % (Optional)</Label>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Input
//                     type="number"
//                     placeholder="e.g. 30"
//                     value={firstInstallmentPercentage}
//                     onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                     min="0"
//                     max="100"
//                     className="bg-white"
//                   />
//                   <span className="text-muted-foreground">%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-muted-foreground/20 pt-3">
//               <Label className="font-semibold flex items-center gap-2 mb-2 text-primary">
//                 <CalendarClock className="h-4 w-4" />
//                 Auto-Calculate Due Dates
//               </Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Start Date (Optional)</Label>
//                   <Input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="mt-1 bg-white"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Frequency</Label>
//                   <Select value={frequency} onValueChange={setFrequency}>
//                     <SelectTrigger className="mt-1 bg-white">
//                       <SelectValue placeholder="Select Frequency" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="monthly">Monthly</SelectItem>
//                       <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
//                       <SelectItem value="biannually">Bi-annually (6 Months)</SelectItem>
//                       <SelectItem value="annually">Annually (12 Months)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Generate Initial Plan
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h4 className="font-semibold text-sm flex items-center gap-2">
//                     Adjust Plan
//                     <span className="text-xs font-normal text-muted-foreground">
//                       (Edit amounts or dates manually)
//                     </span>
//                   </h4>
//                 </div>
//                 <div className="text-xs text-right">
//                   <span className="text-muted-foreground block mb-1">Total Allocated: </span>
//                   <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className={`p-3 bg-white border rounded-md transition-colors space-y-3 ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1 mr-4">
//                         <p className="text-sm font-medium">{inst.description}</p>
//                         <p className="text-xs text-muted-foreground flex items-center gap-2">
//                           Installment #{index + 1}
//                           {inst.isManual && (
//                             <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
//                               Locked
//                             </span>
//                           )}
//                         </p>
//                       </div>
                      
//                       <div className="w-1/3 min-w-[120px]">
//                         <Input
//                           type="number"
//                           value={inst.amount === 0 ? "" : inst.amount}
//                           onChange={(e) => handleManualAmountChange(index, e.target.value)}
//                           className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
//                           placeholder="Amount"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3 bg-muted/20 p-2 rounded border border-muted/50">
//                       <Label className="text-xs text-muted-foreground w-16">Due Date</Label>
//                       <Input 
//                         type="date" 
//                         value={inst.dueDate} 
//                         onChange={(e) => handleManualDateChange(index, e.target.value)} 
//                         className="h-8 text-xs flex-1 bg-white" 
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // --- ORIGINAL PARENT COMPONENT ---
// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", 
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   // ---- Edit Initialization ----
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Load project/tower/floor/flat
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);

//     // Safely extract nested objects from Detailed API Response
//     const pDetails = editBooking.personalDetails || {};
//     const bDetails = editBooking.bankDetails || {};
//     const client = editBooking.clientId || {};
//     const permAddress = pDetails.address?.permanentAddress || {};
//     const emergency = pDetails.emergencyContact || {};
//     const nominee = editBooking.nominee || {};

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
      
//       bookingAmount: editBooking.bookingBaseAmount ? editBooking.bookingBaseAmount.toString() : (editBooking.bookingAmount ? editBooking.bookingAmount.toString() : ""),
      
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: nominee.name || editBooking.nomineeName || "",
//       nomineeRelation: nominee.relation || editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
      
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       // Client Details
//       clientName: client.name || "",
//       clientEmail: client.email || "",
//       clientPhone: client.phone || "",
//       clientPassword: "",

//       // Personal Details
//       dateOfBirth: pDetails.dateOfBirth ? pDetails.dateOfBirth.slice(0, 10) : "",
//       gender: pDetails.gender || "",
//       bloodGroup: pDetails.bloodGroup || "",
//       maritalStatus: pDetails.maritalStatus || "",
//       aadharNumber: pDetails.aadharNumber || "",
//       panNumber: pDetails.panNumber || "",
//       fatherName: pDetails.fatherName || "",
//       motherName: pDetails.motherName || "",
//       emergencyContactName: emergency.name || "",
//       emergencyContactPhone: emergency.phone || "",
//       emergencyContactRelation: emergency.relation || "",
      
//       // Address Details
//       addressLine1: permAddress.line1 || "",
//       city: permAddress.city || "",
//       state: permAddress.state || "",
//       country: permAddress.country || "India",
//       pincode: permAddress.pincode || "",

//       // Bank Details
//       bankName: bDetails.bankName || "",
//       accountNumber: bDetails.accountNumber || "",
//       ifscCode: bDetails.ifscCode || "",
//       upiId: bDetails.upiId || "",
//       accountHolderName: bDetails.accountHolderName || "",
//       accountType: bDetails.accountType || "",
//       branchName: bDetails.branchName || "",

//       // Installments
//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   // ---- Dependent useEffect for project/tower/floor/flat ----
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   // ---- Form update helpers ----
//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount), 
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId && !isEdit) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       if (form.clientEmail) payload.clientEmail = form.clientEmail;
//       payload.clientPhone = form.clientPhone;
//       if (form.clientPassword && !isEdit) payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Render ----
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} disabled={isEdit} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0 || isEdit} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0 || isEdit} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0 || isEdit} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} disabled={isEdit} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                     disabled={isEdit} 
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Editable/Unchangeable Booking Details */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} disabled={isEdit} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} disabled={isEdit} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input type="date" value={form.agreementDate} onChange={(e) => updateForm("agreementDate", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input placeholder="Optional" value={form.nomineeName} onChange={(e) => updateForm("nomineeName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input placeholder="Optional" value={form.nomineeRelation} onChange={(e) => updateForm("nomineeRelation", e.target.value)} />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
//                 <SelectContent>
//                   {teamManagers.map((mgr) => (
//                     <SelectItem key={mgr._id} value={mgr._id}>
//                       {mgr.name || mgr.email} ({mgr.role})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold bg-white" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Edit / New Client Fields */}
//           {(!form.leadId || isEdit) && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 {!isEdit && (
//                   <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//                 )}
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }









// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator, CalendarClock } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // --- UPDATED: Amount Calculator Component ---
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3");
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
  
//   // ✅ States for Auto-Date Calculation
//   const [startDate, setStartDate] = useState("");
//   const [frequency, setFrequency] = useState("monthly");
  
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   // Helper to add months accurately
//   const calculateDueDate = (startStr, index, freq) => {
//     if (!startStr) return "";
//     const date = new Date(startStr);
//     if (isNaN(date.getTime())) return "";

//     let monthsToAdd = 0;
//     switch (freq) {
//       case "monthly": monthsToAdd = 1; break;
//       case "quarterly": monthsToAdd = 3; break;
//       case "biannually": monthsToAdd = 6; break;
//       case "annually": monthsToAdd = 12; break;
//       default: monthsToAdd = 1;
//     }

//     date.setMonth(date.getMonth() + (index * monthsToAdd));
//     return date.toISOString().split("T")[0];
//   };

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 300) { 
//       toast.error("Maximum 300 installments allowed (25 years limit)");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;
//     let rowIndexForDate = 0;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isFirst: true,
//         isManual: false,
//       });
//       remaining -= firstAmount;
//       rowIndexForDate++;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast ? adjustedRemaining : equalAmount;
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isManual: false,
//       });
//       rowIndexForDate++;
//     }

//     setCalculatedInstallments(installments);
//   };

//   const handleManualAmountChange = (index, newAmountStr) => {
//     const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
//     const amount = parseFloat(totalAmount);
    
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].amount = newAmount;
//     updatedInstallments[index].isManual = true;

//     let manualSum = 0;
//     let autoCount = 0;
//     let lastAutoIndex = -1;

//     updatedInstallments.forEach((inst, i) => {
//       if (inst.isManual) {
//         manualSum += inst.amount;
//       } else {
//         autoCount++;
//         lastAutoIndex = i;
//       }
//     });

//     if (manualSum > amount) {
//       toast.warning("Manual amounts exceed the total amount!");
//     }

//     const remainingBalance = amount - manualSum;
    
//     if (autoCount > 0) {
//       const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
//       let adjustedRemaining = Math.max(0, remainingBalance);

//       updatedInstallments.forEach((inst, i) => {
//         if (!inst.isManual) {
//           const isLastAuto = i === lastAutoIndex;
//           inst.amount = isLastAuto ? adjustedRemaining : equalShare;
//           adjustedRemaining -= inst.amount;
//         }
//       });
//     }

//     setCalculatedInstallments(updatedInstallments);
//   };

//   const handleManualDateChange = (index, newDate) => {
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].dueDate = newDate;
//     setCalculatedInstallments(updatedInstallments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1 bg-white"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="font-semibold">Number of Installments *</Label>
//                 <Input
//                   type="number"
//                   placeholder="e.g. 24"
//                   value={numberOfInstallments}
//                   onChange={(e) => setNumberOfInstallments(e.target.value)}
//                   min="1"
//                   max="300"
//                   className="mt-1 bg-white"
//                 />
//                 <span className="text-[10px] text-muted-foreground mt-1 block">Max 300 (25 Years)</span>
//               </div>

//               <div>
//                 <Label className="font-semibold">1st Installment % (Optional)</Label>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Input
//                     type="number"
//                     placeholder="e.g. 30"
//                     value={firstInstallmentPercentage}
//                     onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                     min="0"
//                     max="100"
//                     className="bg-white"
//                   />
//                   <span className="text-muted-foreground">%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-muted-foreground/20 pt-3">
//               <Label className="font-semibold flex items-center gap-2 mb-2 text-primary">
//                 <CalendarClock className="h-4 w-4" />
//                 Auto-Calculate Due Dates
//               </Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Start Date (Optional)</Label>
//                   <Input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="mt-1 bg-white"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Frequency</Label>
//                   <Select value={frequency} onValueChange={setFrequency}>
//                     <SelectTrigger className="mt-1 bg-white">
//                       <SelectValue placeholder="Select Frequency" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="monthly">Monthly</SelectItem>
//                       <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
//                       <SelectItem value="biannually">Bi-annually (6 Months)</SelectItem>
//                       <SelectItem value="annually">Annually (12 Months)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Generate Initial Plan
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h4 className="font-semibold text-sm flex items-center gap-2">
//                     Adjust Plan
//                     <span className="text-xs font-normal text-muted-foreground">
//                       (Edit amounts or dates manually)
//                     </span>
//                   </h4>
//                 </div>
//                 <div className="text-xs text-right">
//                   <span className="text-muted-foreground block mb-1">Total Allocated: </span>
//                   <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className={`p-3 bg-white border rounded-md transition-colors space-y-3 ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1 mr-4">
//                         <p className="text-sm font-medium">{inst.description}</p>
//                         <p className="text-xs text-muted-foreground flex items-center gap-2">
//                           Installment #{index + 1}
//                           {inst.isManual && (
//                             <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
//                               Locked
//                             </span>
//                           )}
//                         </p>
//                       </div>
                      
//                       <div className="w-1/3 min-w-[120px]">
//                         <Input
//                           type="number"
//                           value={inst.amount === 0 ? "" : inst.amount}
//                           onChange={(e) => handleManualAmountChange(index, e.target.value)}
//                           className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
//                           placeholder="Amount"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3 bg-muted/20 p-2 rounded border border-muted/50">
//                       <Label className="text-xs text-muted-foreground w-16">Due Date</Label>
//                       <Input 
//                         type="date" 
//                         value={inst.dueDate} 
//                         onChange={(e) => handleManualDateChange(index, e.target.value)} 
//                         className="h-8 text-xs flex-1 bg-white" 
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // --- ORIGINAL PARENT COMPONENT (UPDATED) ---
// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", 
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     keyNumber: "",
//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   // ---- Edit Initialization ----
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Load project/tower/floor/flat
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);

//     // Safely extract nested objects from Detailed API Response
//     const pDetails = editBooking.personalDetails || {};
//     const bDetails = editBooking.bankDetails || {};
//     const client = editBooking.clientId || {};
//     const permAddress = pDetails.address?.permanentAddress || {};
//     const emergency = pDetails.emergencyContact || {};
//     const nominee = editBooking.nominee || {};

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
      
//       bookingAmount: editBooking.bookingBaseAmount ? editBooking.bookingBaseAmount.toString() : (editBooking.bookingAmount ? editBooking.bookingAmount.toString() : ""),
      
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: nominee.name || editBooking.nomineeName || "",
//       nomineeRelation: nominee.relation || editBooking.nomineeRelation || "",
//       keyNumber: editBooking.keyNumber || "",
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
      
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       // Client Details
//       clientName: client.name || "",
//       clientEmail: client.email || "",
//       clientPhone: client.phone || "",
//       clientPassword: "",

//       // Personal Details
//       dateOfBirth: pDetails.dateOfBirth ? pDetails.dateOfBirth.slice(0, 10) : "",
//       gender: pDetails.gender || "",
//       bloodGroup: pDetails.bloodGroup || "",
//       maritalStatus: pDetails.maritalStatus || "",
//       aadharNumber: pDetails.aadharNumber || "",
//       panNumber: pDetails.panNumber || "",
//       fatherName: pDetails.fatherName || "",
//       motherName: pDetails.motherName || "",
//       emergencyContactName: emergency.name || "",
//       emergencyContactPhone: emergency.phone || "",
//       emergencyContactRelation: emergency.relation || "",
      
//       // Address Details
//       addressLine1: permAddress.line1 || "",
//       city: permAddress.city || "",
//       state: permAddress.state || "",
//       country: permAddress.country || "India",
//       pincode: permAddress.pincode || "",

//       // Bank Details
//       bankName: bDetails.bankName || "",
//       accountNumber: bDetails.accountNumber || "",
//       ifscCode: bDetails.ifscCode || "",
//       upiId: bDetails.upiId || "",
//       accountHolderName: bDetails.accountHolderName || "",
//       accountType: bDetails.accountType || "",
//       branchName: bDetails.branchName || "",

//       // Installments
//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   // ---- Dependent useEffect for project/tower/floor/flat ----
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   // ---- Form update helpers ----
//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount), 
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       keyNumber: form.keyNumber || undefined,
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId && !isEdit) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       if (form.clientEmail) payload.clientEmail = form.clientEmail;
//       payload.clientPhone = form.clientPhone;
//       if (form.clientPassword && !isEdit) payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Render ----
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} disabled={isEdit} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0 || isEdit} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0 || isEdit} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0 || isEdit} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} disabled={isEdit} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                     disabled={isEdit} 
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Editable / Unchangeable Booking Details */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} disabled={isEdit} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} disabled={isEdit} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input
//                 type="date"
//                 value={form.agreementDate}
//                 onChange={(e) => updateForm("agreementDate", e.target.value)}
//                 disabled={isEdit}   // <--- UPDATED: Disabled on edit
//               />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.nomineeName}
//                 onChange={(e) => updateForm("nomineeName", e.target.value)}
//                 disabled={isEdit}   // <--- UPDATED: Disabled on edit
//               />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.nomineeRelation}
//                 onChange={(e) => updateForm("nomineeRelation", e.target.value)}
//                 disabled={isEdit}   // <--- UPDATED: Disabled on edit
//               />
//             </div>
//             <div>
//               <Label>Key Number (KYC ID)</Label>
//               <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
//                 <SelectContent>
//                   {teamManagers.map((mgr) => (
//                     <SelectItem key={mgr._id} value={mgr._id}>
//                       {mgr.name || mgr.email} ({mgr.role})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold bg-white" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Edit / New Client Fields */}
//           {(!form.leadId || isEdit) && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 {!isEdit && (
//                   <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//                 )}
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }











// import React, { useState, useEffect, useRef } from "react";
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
// import { toast } from "sonner";
// import { useLeadList } from "@/hooks/useLeadList";
// import { Trash2, Plus, Info, Calculator, CalendarClock } from "lucide-react";

// // ✅ Currency formatter (INR without L/Cr)
// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val)) return "₹0";
//   return "₹" + Number(val).toLocaleString("en-IN");
// };

// // --- UPDATED: Amount Calculator Component ---
// function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
//   const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
//   const [numberOfInstallments, setNumberOfInstallments] = useState("3");
//   const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
  
//   // ✅ States for Auto-Date Calculation
//   const [startDate, setStartDate] = useState("");
//   const [frequency, setFrequency] = useState("monthly");
  
//   const [calculatedInstallments, setCalculatedInstallments] = useState([]);

//   useEffect(() => {
//     if (remainingAmount) {
//       setTotalAmount(remainingAmount.toString());
//     }
//   }, [remainingAmount, open]);

//   // Helper to add months accurately
//   const calculateDueDate = (startStr, index, freq) => {
//     if (!startStr) return "";
//     const date = new Date(startStr);
//     if (isNaN(date.getTime())) return "";

//     let monthsToAdd = 0;
//     switch (freq) {
//       case "monthly": monthsToAdd = 1; break;
//       case "quarterly": monthsToAdd = 3; break;
//       case "biannually": monthsToAdd = 6; break;
//       case "annually": monthsToAdd = 12; break;
//       default: monthsToAdd = 1;
//     }

//     date.setMonth(date.getMonth() + (index * monthsToAdd));
//     return date.toISOString().split("T")[0];
//   };

//   const calculateInstallments = () => {
//     const amount = parseFloat(totalAmount);
//     const numInst = parseInt(numberOfInstallments);
    
//     if (!amount || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
//     if (!numInst || numInst < 1) {
//       toast.error("Number of installments must be at least 1");
//       return;
//     }
//     if (numInst > 300) { 
//       toast.error("Maximum 300 installments allowed (25 years limit)");
//       return;
//     }

//     const firstPct = parseFloat(firstInstallmentPercentage) || 0;
//     const installments = [];
//     let remaining = amount;
//     let rowIndexForDate = 0;

//     if (firstPct > 0 && firstPct <= 100) {
//       const firstAmount = Math.round((amount * firstPct) / 100);
//       installments.push({
//         description: `1st Installment (${firstPct}%)`,
//         amount: firstAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isFirst: true,
//         isManual: false,
//       });
//       remaining -= firstAmount;
//       rowIndexForDate++;
//     }

//     const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
//     let adjustedRemaining = remaining;

//     for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
//       const isLast = i === numInst - 1;
//       const installmentAmount = isLast ? adjustedRemaining : equalAmount;
//       adjustedRemaining -= installmentAmount;
      
//       installments.push({
//         description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
//         amount: installmentAmount,
//         dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
//         isManual: false,
//       });
//       rowIndexForDate++;
//     }

//     setCalculatedInstallments(installments);
//   };

//   const handleManualAmountChange = (index, newAmountStr) => {
//     const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
//     const amount = parseFloat(totalAmount);
    
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].amount = newAmount;
//     updatedInstallments[index].isManual = true;

//     let manualSum = 0;
//     let autoCount = 0;
//     let lastAutoIndex = -1;

//     updatedInstallments.forEach((inst, i) => {
//       if (inst.isManual) {
//         manualSum += inst.amount;
//       } else {
//         autoCount++;
//         lastAutoIndex = i;
//       }
//     });

//     if (manualSum > amount) {
//       toast.warning("Manual amounts exceed the total amount!");
//     }

//     const remainingBalance = amount - manualSum;
    
//     if (autoCount > 0) {
//       const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
//       let adjustedRemaining = Math.max(0, remainingBalance);

//       updatedInstallments.forEach((inst, i) => {
//         if (!inst.isManual) {
//           const isLastAuto = i === lastAutoIndex;
//           inst.amount = isLastAuto ? adjustedRemaining : equalShare;
//           adjustedRemaining -= inst.amount;
//         }
//       });
//     }

//     setCalculatedInstallments(updatedInstallments);
//   };

//   const handleManualDateChange = (index, newDate) => {
//     let updatedInstallments = [...calculatedInstallments];
//     updatedInstallments[index].dueDate = newDate;
//     setCalculatedInstallments(updatedInstallments);
//   };

//   const getOrdinalSuffix = (num) => {
//     const j = num % 10;
//     const k = num % 100;
//     if (j === 1 && k !== 11) return "st";
//     if (j === 2 && k !== 12) return "nd";
//     if (j === 3 && k !== 13) return "rd";
//     return "th";
//   };

//   const handleApply = () => {
//     if (calculatedInstallments.length === 0) {
//       toast.error("Please calculate installments first");
//       return;
//     }
    
//     const formattedInstallments = calculatedInstallments.map((inst, index) => ({
//       installmentNumber: index + 1,
//       description: inst.description,
//       amount: inst.amount.toString(),
//       dueDate: inst.dueDate || "",
//     }));
    
//     onApply(formattedInstallments);
//     onOpenChange(false);
//     toast.success("Installment plan applied!");
//   };

//   const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
//   const difference = parseFloat(totalAmount) - totalCalculated;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Installment Calculator
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <div className="bg-muted/50 p-4 rounded-lg space-y-4">
//             <div>
//               <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter total amount"
//                 value={totalAmount}
//                 onChange={(e) => setTotalAmount(e.target.value)}
//                 className="text-lg font-bold mt-1 bg-white"
//               />
//               <span className="text-xs text-muted-foreground mt-1 block">
//                 Remaining target: {formatCurrency(remainingAmount)}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="font-semibold">Number of Installments *</Label>
//                 <Input
//                   type="number"
//                   placeholder="e.g. 24"
//                   value={numberOfInstallments}
//                   onChange={(e) => setNumberOfInstallments(e.target.value)}
//                   min="1"
//                   max="300"
//                   className="mt-1 bg-white"
//                 />
//                 <span className="text-[10px] text-muted-foreground mt-1 block">Max 300 (25 Years)</span>
//               </div>

//               <div>
//                 <Label className="font-semibold">1st Installment % (Optional)</Label>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Input
//                     type="number"
//                     placeholder="e.g. 30"
//                     value={firstInstallmentPercentage}
//                     onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
//                     min="0"
//                     max="100"
//                     className="bg-white"
//                   />
//                   <span className="text-muted-foreground">%</span>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-muted-foreground/20 pt-3">
//               <Label className="font-semibold flex items-center gap-2 mb-2 text-primary">
//                 <CalendarClock className="h-4 w-4" />
//                 Auto-Calculate Due Dates
//               </Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-xs">Start Date (Optional)</Label>
//                   <Input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="mt-1 bg-white"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Frequency</Label>
//                   <Select value={frequency} onValueChange={setFrequency}>
//                     <SelectTrigger className="mt-1 bg-white">
//                       <SelectValue placeholder="Select Frequency" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="monthly">Monthly</SelectItem>
//                       <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
//                       <SelectItem value="biannually">Bi-annually (6 Months)</SelectItem>
//                       <SelectItem value="annually">Annually (12 Months)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             <Button 
//               onClick={calculateInstallments} 
//               className="w-full"
//               variant="secondary"
//             >
//               <Calculator className="h-4 w-4 mr-2" />
//               Generate Initial Plan
//             </Button>
//           </div>

//           {calculatedInstallments.length > 0 && (
//             <div className="space-y-3">
//               <div className="flex justify-between items-end">
//                 <div>
//                   <h4 className="font-semibold text-sm flex items-center gap-2">
//                     Adjust Plan
//                     <span className="text-xs font-normal text-muted-foreground">
//                       (Edit amounts or dates manually)
//                     </span>
//                   </h4>
//                 </div>
//                 <div className="text-xs text-right">
//                   <span className="text-muted-foreground block mb-1">Total Allocated: </span>
//                   <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
//                   {difference !== 0 && (
//                     <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
//                       ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
//                 {calculatedInstallments.map((inst, index) => (
//                   <div 
//                     key={index} 
//                     className={`p-3 bg-white border rounded-md transition-colors space-y-3 ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1 mr-4">
//                         <p className="text-sm font-medium">{inst.description}</p>
//                         <p className="text-xs text-muted-foreground flex items-center gap-2">
//                           Installment #{index + 1}
//                           {inst.isManual && (
//                             <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
//                               Locked
//                             </span>
//                           )}
//                         </p>
//                       </div>
                      
//                       <div className="w-1/3 min-w-[120px]">
//                         <Input
//                           type="number"
//                           value={inst.amount === 0 ? "" : inst.amount}
//                           onChange={(e) => handleManualAmountChange(index, e.target.value)}
//                           className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
//                           placeholder="Amount"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3 bg-muted/20 p-2 rounded border border-muted/50">
//                       <Label className="text-xs text-muted-foreground w-16">Due Date</Label>
//                       <Input 
//                         type="date" 
//                         value={inst.dueDate} 
//                         onChange={(e) => handleManualDateChange(index, e.target.value)} 
//                         className="h-8 text-xs flex-1 bg-white" 
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Button onClick={handleApply} className="w-full">
//                 Apply This Plan
//               </Button>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // --- ORIGINAL PARENT COMPONENT (UPDATED) ---
// export function BookingFormDialog({
//   open,
//   onOpenChange,
//   onSuccess,
//   editBooking,
// }) {
//   const [projects, setProjects] = useState([]);
//   const [towers, setTowers] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [flats, setFlats] = useState([]);
//   const [selectedFlat, setSelectedFlat] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [teamManagers, setTeamManagers] = useState([]);
//   const [calculatorOpen, setCalculatorOpen] = useState(false);

//   const [projectsLoaded, setProjectsLoaded] = useState(false);
//   const editInitialized = useRef(false);

//   const initialForm = {
//     projectId: "",
//     towerName: "",
//     floor: "",
//     flatId: "",

//     bookingAmount: "", 
//     paymentMode: "",
//     agreementDate: "",
//     nomineeName: "",
//     nomineeRelation: "",

//     // keyNumber REMOVED

//     businessCode: "",
//     businessName: "",
//     teamManager: "",
//     remarks: "",
//     transactionId: "",

//     leadId: "",
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientPassword: "",

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

//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     accountHolderName: "",
//     accountType: "",
//     branchName: "",

//     useCustomPlan: false,
//     installments: [],
//   };

//   const [form, setForm] = useState(initialForm);
//   const isEdit = Boolean(editBooking);

//   // ---- GST Helper Functions ----
//   const getGSTPercentage = () => {
//     if (!selectedFlat) return 0;
//     const flatPrice = selectedFlat.price || 0;
//     return flatPrice >= 4500000 ? 5 : 1;
//   };

//   const getFlatBasePrice = () => selectedFlat?.price || 0;
//   const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
//   const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

//   const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
//   const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
//   const getTotalPayableToday = () => getBookingBase() + getBookingGST();

//   const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
//   const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
//   const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

//   // ---- Edit Initialization ----
//   useEffect(() => {
//     if (!editBooking || !open) {
//       editInitialized.current = false;
//       return;
//     }
//     if (!projectsLoaded) return;
//     if (editInitialized.current) return;
//     editInitialized.current = true;

//     const projectId = editBooking.projectId?._id || editBooking.projectId;
//     const towerName = editBooking.flatSnapshot?.towerName || "";
//     const floor = editBooking.flatSnapshot?.floor || "";
//     const flatId = editBooking.flatId;

//     // Load project/tower/floor/flat
//     const project = projects.find((p) => p._id === projectId);
//     if (project?.towers) setTowers(project.towers);

//     const tower = project?.towers?.find((t) => t.towerName === towerName);
//     if (tower?.floors) setFloors(tower.floors);

//     const floorObj = tower?.floors?.find(
//       (f) => String(f.floorNumber) === String(floor)
//     );
//     if (floorObj?.flats) setFlats(floorObj.flats);

//     const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
//     if (flatObj) setSelectedFlat(flatObj);

//     // Safely extract nested objects from Detailed API Response
//     const pDetails = editBooking.personalDetails || {};
//     const bDetails = editBooking.bankDetails || {};
//     const client = editBooking.clientId || {};
//     const permAddress = pDetails.address?.permanentAddress || {};
//     const emergency = pDetails.emergencyContact || {};
//     const nominee = editBooking.nominee || {};

//     setForm({
//       ...initialForm,
//       projectId: projectId || "",
//       towerName: towerName,
//       floor: floor.toString(),
//       flatId: flatId || "",
      
//       bookingAmount: editBooking.bookingBaseAmount ? editBooking.bookingBaseAmount.toString() : (editBooking.bookingAmount ? editBooking.bookingAmount.toString() : ""),
      
//       paymentMode: editBooking.paymentMode || "",
//       agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
//       nomineeName: nominee.name || editBooking.nomineeName || "",
//       nomineeRelation: nominee.relation || editBooking.nomineeRelation || "",
//       // keyNumber removed
//       businessCode: editBooking.businessCode || "",
//       businessName: editBooking.businessName || "",
//       teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
//       remarks: editBooking.remarks || "",
//       transactionId: editBooking.transactionId || "",
      
//       leadId: editBooking.leadId?._id || editBooking.leadId || "",

//       // Client Details
//       clientName: client.name || "",
//       clientEmail: client.email || "",
//       clientPhone: client.phone || "",
//       clientPassword: "",

//       // Personal Details
//       dateOfBirth: pDetails.dateOfBirth ? pDetails.dateOfBirth.slice(0, 10) : "",
//       gender: pDetails.gender || "",
//       bloodGroup: pDetails.bloodGroup || "",
//       maritalStatus: pDetails.maritalStatus || "",
//       aadharNumber: pDetails.aadharNumber || "",
//       panNumber: pDetails.panNumber || "",
//       fatherName: pDetails.fatherName || "",
//       motherName: pDetails.motherName || "",
//       emergencyContactName: emergency.name || "",
//       emergencyContactPhone: emergency.phone || "",
//       emergencyContactRelation: emergency.relation || "",
      
//       // Address Details
//       addressLine1: permAddress.line1 || "",
//       city: permAddress.city || "",
//       state: permAddress.state || "",
//       country: permAddress.country || "India",
//       pincode: permAddress.pincode || "",

//       // Bank Details
//       bankName: bDetails.bankName || "",
//       accountNumber: bDetails.accountNumber || "",
//       ifscCode: bDetails.ifscCode || "",
//       upiId: bDetails.upiId || "",
//       accountHolderName: bDetails.accountHolderName || "",
//       accountType: bDetails.accountType || "",
//       branchName: bDetails.branchName || "",

//       // Installments
//       useCustomPlan: Boolean(editBooking.installmentPlan?.length),
//       installments: editBooking.installmentPlan?.length
//         ? editBooking.installmentPlan.map((inst) => ({
//             installmentNumber: inst.installmentNumber,
//             description: inst.description,
//             amount: inst.baseAmount || inst.amount,
//             dueDate: inst.dueDate?.slice?.(0, 10) || "",
//           }))
//         : [],
//     });
//   }, [editBooking, open, projectsLoaded, projects]);

//   const resetForm = () => {
//     setForm(initialForm);
//     setTowers([]);
//     setFloors([]);
//     setFlats([]);
//     setSelectedFlat(null);
//     setProjectsLoaded(false);
//     editInitialized.current = false;
//   };

//   const { leads, loading: leadsLoading } = useLeadList();

//   const fetchProjects = async () => {
//     try {
//       const res = await projectApi.getAll();
//       if (res.data.success) {
//         setProjects(res.data.data?.projects || []);
//         setProjectsLoaded(true);
//       }
//     } catch (err) {
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
//             user.role === "admin"
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

//   // ---- Dependent useEffect for project/tower/floor/flat ----
//   useEffect(() => {
//     if (form.projectId) {
//       const project = projects.find((p) => p._id === form.projectId);
//       if (project?.towers?.length) {
//         setTowers(project.towers);
//         const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
//         if (!towerExists) {
//           setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
//           setFloors([]);
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.towerName) {
//       const tower = towers.find((t) => t.towerName === form.towerName);
//       if (tower) {
//         setFloors(tower.floors || []);
//         const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
//         if (!floorExists) {
//           setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
//           setFlats([]);
//           setSelectedFlat(null);
//         }
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

//   useEffect(() => {
//     if (form.floor !== "" && form.floor !== undefined) {
//       const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
//       if (floor) {
//         setFlats(floor.flats || []);
//         const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
//         if (!flatExists) {
//           setForm((prev) => ({ ...prev, flatId: "" }));
//           setSelectedFlat(null);
//         }
//       } else {
//         setFlats([]);
//         setSelectedFlat(null);
//       }
//     } else {
//       setFlats([]);
//       setSelectedFlat(null);
//     }
//   }, [form.floor, floors]);

//   useEffect(() => {
//     if (form.flatId && flats.length) {
//       const flat = flats.find((f) => f._id === form.flatId);
//       setSelectedFlat(flat || null);
//     } else {
//       setSelectedFlat(null);
//     }
//   }, [form.flatId, flats]);

//   // ---- Form update helpers ----
//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addInstallment = () => {
//     const newNumber = form.installments.length + 1;
//     const newInstallment = {
//       installmentNumber: newNumber,
//       description: "",
//       amount: "",
//       dueDate: "",
//     };
//     setForm((prev) => ({
//       ...prev,
//       installments: [...prev.installments, newInstallment],
//     }));
//   };

//   const removeInstallment = (index) => {
//     if (form.installments.length <= 1) {
//       toast.warning("At least one installment is required");
//       return;
//     }
//     const updated = form.installments.filter((_, i) => i !== index);
//     const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
//     setForm((prev) => ({ ...prev, installments: renumbered }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...form.installments];
//     updated[index][field] = value;
//     setForm((prev) => ({ ...prev, installments: updated }));
//   };

//   const getTotalInstallmentAmount = () => {
//     return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
//   };

//   const handleCalculatorApply = (calculatedInstallments) => {
//     setForm((prev) => ({
//       ...prev,
//       installments: calculatedInstallments,
//       useCustomPlan: true,
//     }));
//   };

//   // ---- Submit ----
//   const handleSubmit = async () => {
//     if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
//       toast.error("Project, Tower, Floor, and Flat are required");
//       return;
//     }

//     if (form.useCustomPlan) {
//       if (form.installments.length === 0) {
//         toast.error("Please add at least one installment");
//         return;
//       }
//       const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
//       if (invalid) {
//         toast.error("All installment fields (description, amount) are required");
//         return;
//       }
//     }

//     setLoading(true);

//     const payload = {
//       projectId: form.projectId,
//       flatId: form.flatId,
//       bookingAmount: Number(form.bookingAmount), 
//       paymentMode: form.paymentMode || undefined,
//       agreementDate: form.agreementDate || undefined,
//       nomineeName: form.nomineeName || undefined,
//       nomineeRelation: form.nomineeRelation || undefined,
//       // keyNumber REMOVED
//       businessCode: form.businessCode || undefined,
//       businessName: form.businessName || undefined,
//       teamManager: form.teamManager || undefined,
//       remarks: form.remarks || undefined,
//       transactionId: form.transactionId || undefined,
//     };

//     if (form.useCustomPlan && form.installments.length > 0) {
//       const installments = form.installments.map((inst) => ({
//         installmentNumber: inst.installmentNumber,
//         description: inst.description,
//         amount: Number(inst.amount),
//         dueDate: inst.dueDate || undefined,
//       }));
//       payload.installmentPlan = { installments };
//     }

//     if (form.leadId && !isEdit) {
//       payload.leadId = form.leadId;
//     } else {
//       payload.clientName = form.clientName;
//       if (form.clientEmail) payload.clientEmail = form.clientEmail;
//       payload.clientPhone = form.clientPhone;
//       if (form.clientPassword && !isEdit) payload.clientPassword = form.clientPassword;

//       const personalDetails = {};
//       if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
//       if (form.gender) personalDetails.gender = form.gender;
//       if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
//       if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
//       if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
//       if (form.panNumber) personalDetails.panNumber = form.panNumber;
//       if (form.fatherName) personalDetails.fatherName = form.fatherName;
//       if (form.motherName) personalDetails.motherName = form.motherName;
//       if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
//       if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
//       if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
//       if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
//       if (form.accountType) bankDetails.accountType = form.accountType;
//       if (form.branchName) bankDetails.branchName = form.branchName;

//       if (Object.keys(bankDetails).length) {
//         payload.bankDetails = bankDetails;
//       }
//     }

//     try {
//       let res;
//       if (isEdit) {
//         res = await bookingApi.updateBooking(editBooking._id, payload);
//       } else {
//         res = await bookingApi.createBooking(payload);
//       }
//       toast.success(isEdit ? "Booking updated" : "Booking created");
//       onSuccess?.(res.data?.data);
//       onOpenChange(false);
//       resetForm();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Render ----
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEdit ? "Edit Booking" : "Create New Booking"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-6 p-1">
//           {/* Flat Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <Label>Project *</Label>
//               <Select value={form.projectId} disabled={isEdit} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
//                 <SelectContent>
//                   {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Tower *</Label>
//               <Select value={form.towerName} disabled={!form.projectId || towers.length === 0 || isEdit} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
//                 <SelectContent>
//                   {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Floor *</Label>
//               <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0 || isEdit} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
//                 <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
//                 <SelectContent>
//                   {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Flat *</Label>
//               <Select value={form.flatId} disabled={!form.floor || flats.length === 0 || isEdit} onValueChange={(v) => updateForm("flatId", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
//                 <SelectContent>
//                   {flats.map((f) => (
//                     <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
//                       {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Flat & GST Summary */}
//           {selectedFlat && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
//               <div>
//                 <Label className="text-xs text-muted-foreground">Flat Price</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">GST Slab</Label>
//                 <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-muted-foreground">Total GST</Label>
//                 <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
//               </div>
//               <div>
//                 <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
//                 <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
//               </div>
//             </div>
//           )}

//           {/* Lead Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Lead (Optional)</Label>
//               <Select value={form.leadId || "none"} disabled={isEdit} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
//                 <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None (Create new buyer)</SelectItem>
//                   {leads?.map((lead) => (
//                     <SelectItem key={lead._id} value={lead._id}>
//                       {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Booking & Payment Details */}
//           <div className="border-t pt-4">
//             <h3 className="font-semibold text-lg flex items-center gap-2">
//               Booking Details
//               <Info className="h-4 w-4 text-muted-foreground" />
//             </h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Payment Calculator Box */}
//             <div className="md:col-span-2">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
//                 <div>
//                   <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
//                   <Input
//                     type="number"
//                     value={form.bookingAmount}
//                     onChange={(e) => updateForm("bookingAmount", e.target.value)}
//                     placeholder="e.g. 150000"
//                     className="font-bold text-lg mt-1"
//                     disabled={isEdit} 
//                   />
//                   <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     + Auto-Calculated GST ({getGSTPercentage()}%)
//                   </Label>
//                   <div className="text-xl font-bold text-amber-600">
//                     {formatCurrency(getBookingGST())}
//                   </div>
//                 </div>

//                 <div className="flex flex-col justify-center">
//                   <Label className="text-sm text-muted-foreground mb-1">
//                     = Client Pays Today
//                   </Label>
//                   <div className="text-2xl font-black text-green-600">
//                     {formatCurrency(getTotalPayableToday())}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Editable / Unchangeable Booking Details */}
//             <div>
//               <Label>Payment Mode</Label>
//               <Select value={form.paymentMode} disabled={isEdit} onValueChange={(v) => updateForm("paymentMode", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
//                 <SelectContent>
//                   {Object.values(PAYMENT_MODE || {
//                     CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
//                     CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
//                   }).map((mode) => (
//                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Transaction ID</Label>
//               <Input placeholder="Optional" value={form.transactionId} disabled={isEdit} onChange={(e) => updateForm("transactionId", e.target.value)} />
//             </div>
//             <div>
//               <Label>Agreement Date</Label>
//               <Input
//                 type="date"
//                 value={form.agreementDate}
//                 onChange={(e) => updateForm("agreementDate", e.target.value)}
//                 disabled={isEdit}
//               />
//             </div>
//             <div>
//               <Label>Nominee Name</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.nomineeName}
//                 onChange={(e) => updateForm("nomineeName", e.target.value)}
//                 disabled={isEdit}
//               />
//             </div>
//             <div>
//               <Label>Nominee Relation</Label>
//               <Input
//                 placeholder="Optional"
//                 value={form.nomineeRelation}
//                 onChange={(e) => updateForm("nomineeRelation", e.target.value)}
//                 disabled={isEdit}
//               />
//             </div>
//             {/* Key Number (KYC ID) field REMOVED */}
//             <div>
//               <Label>Business Code</Label>
//               <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
//             </div>
//             <div>
//               <Label>Business Name</Label>
//               <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
//             </div>
//             <div>
//               <Label>Team Manager</Label>
//               <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
//                 <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
//                 <SelectContent>
//                   {teamManagers.map((mgr) => (
//                     <SelectItem key={mgr._id} value={mgr._id}>
//                       {mgr.name || mgr.email} ({mgr.role})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="md:col-span-2">
//               <Label>Remarks</Label>
//               <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
//             </div>
//           </div>

//           {/* Installment Plan Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-3 mb-2 flex-wrap">
//               <h3 className="font-semibold text-lg">Installment Plan</h3>
//               <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
//                 <input
//                   type="checkbox"
//                   checked={form.useCustomPlan}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     if (checked && form.installments.length === 0) {
//                       addInstallment();
//                     }
//                     updateForm("useCustomPlan", checked);
//                   }}
//                   className="w-4 h-4"
//                 />
//                 <span className="font-medium">Use Custom Plan</span>
//               </label>
//               <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
//               {form.useCustomPlan && selectedFlat && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalculatorOpen(true)}
//                   className="ml-auto gap-2"
//                 >
//                   <Calculator className="h-4 w-4" />
//                   Amount Calculator
//                 </Button>
//               )}
//             </div>

//             {form.useCustomPlan && (
//               <div className="space-y-4">
                
//                 {/* Visual Target Tracker */}
//                 {selectedFlat && (
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
//                     <div className="space-y-1 w-full md:w-auto text-sm">
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining Target:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
//                         <span>Remaining GST:</span> 
//                         <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
//                       </div>
//                       <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
//                         <span>Total (Payable):</span> 
//                         <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 flex justify-end">
//                       {(() => {
//                         const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
//                         return (
//                           <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
//                             {diff === 0 
//                               ? "✅ Amounts matched perfectly!" 
//                               : diff > 0 
//                                 ? `⚠️ Add ${formatCurrency(diff)} more.` 
//                                 : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
//                           </div>
//                         );
//                       })()}
//                     </div>

//                     <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
//                       <Plus className="h-4 w-4" /> Add Row
//                     </Button>
//                   </div>
//                 )}

//                 {/* Installment Rows */}
//                 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
//                   {form.installments.map((inst, index) => {
//                     const instBase = parseFloat(inst.amount) || 0;
//                     const instGST = Math.round((instBase * getGSTPercentage()) / 100);
//                     const instTotal = instBase + instGST;

//                     return (
//                       <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
//                         <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
//                           #{inst.installmentNumber}
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Description</Label>
//                           <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
//                           <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
//                           <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold bg-white" />
//                           <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
//                             <span>+ GST: {formatCurrency(instGST)}</span>
//                             <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
//                           </div>
//                         </div>

//                         <div className="col-span-12 md:col-span-3">
//                           <Label className="text-xs mb-1 block">Due Date</Label>
//                           <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
//                         </div>
                        
//                         <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
//                           <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Edit / New Client Fields */}
//           {(!form.leadId || isEdit) && (
//             <>
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Buyer Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
//                 <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
//                 <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
//                 {!isEdit && (
//                   <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
//                 )}
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Personal Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
//                 <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
//                   <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
//                   <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
//                   <SelectContent>
//                     {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//                       <SelectItem key={bg} value={bg}>{bg}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
//                   <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Married">Married</SelectItem>
//                     <SelectItem value="Divorced">Divorced</SelectItem>
//                     <SelectItem value="Widowed">Widowed</SelectItem>
//                     <SelectItem value="Separated">Separated</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
//                 <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
//                 <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
//                 <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Emergency Contact</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
//                 <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
//                 <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Permanent Address</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
//                 <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
//                 <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
//                 <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
//                 <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
//               </div>

//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg">Bank Details</h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
//                 <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
//                 <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
//                 <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
//                 <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
//                 <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
//                   <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Savings">Savings</SelectItem>
//                     <SelectItem value="Current">Current</SelectItem>
//                     <SelectItem value="Salary">Salary</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter className="bg-muted/30 p-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} size="lg">
//             {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>

//       {/* Amount Calculator Dialog */}
//       <AmountCalculatorDialog
//         open={calculatorOpen}
//         onOpenChange={setCalculatorOpen}
//         onApply={handleCalculatorApply}
//         remainingAmount={getInstallmentTargetBase()}
//       />
//     </Dialog>
//   );
// }





import React, { useState, useEffect, useRef } from "react";
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
import { toast } from "sonner";
import { useLeadList } from "@/hooks/useLeadList";
import { Trash2, Plus, Info, Calculator, CalendarClock } from "lucide-react";

// ✅ Currency formatter (INR without L/Cr)
const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "₹0";
  return "₹" + Number(val).toLocaleString("en-IN");
};

// --- UPDATED: Amount Calculator Component ---
function AmountCalculatorDialog({ open, onOpenChange, onApply, remainingAmount }) {
  const [totalAmount, setTotalAmount] = useState(remainingAmount ? remainingAmount.toString() : "");
  const [numberOfInstallments, setNumberOfInstallments] = useState("3");
  const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState("");
  
  // ✅ States for Auto-Date Calculation
  const [startDate, setStartDate] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  
  const [calculatedInstallments, setCalculatedInstallments] = useState([]);

  useEffect(() => {
    if (remainingAmount) {
      setTotalAmount(remainingAmount.toString());
    }
  }, [remainingAmount, open]);

  // Helper to add months accurately
  const calculateDueDate = (startStr, index, freq) => {
    if (!startStr) return "";
    const date = new Date(startStr);
    if (isNaN(date.getTime())) return "";

    let monthsToAdd = 0;
    switch (freq) {
      case "monthly": monthsToAdd = 1; break;
      case "quarterly": monthsToAdd = 3; break;
      case "biannually": monthsToAdd = 6; break;
      case "annually": monthsToAdd = 12; break;
      default: monthsToAdd = 1;
    }

    date.setMonth(date.getMonth() + (index * monthsToAdd));
    return date.toISOString().split("T")[0];
  };

  const calculateInstallments = () => {
    const amount = parseFloat(totalAmount);
    const numInst = parseInt(numberOfInstallments);
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!numInst || numInst < 1) {
      toast.error("Number of installments must be at least 1");
      return;
    }
    if (numInst > 300) { 
      toast.error("Maximum 300 installments allowed (25 years limit)");
      return;
    }

    const firstPct = parseFloat(firstInstallmentPercentage) || 0;
    const installments = [];
    let remaining = amount;
    let rowIndexForDate = 0;

    if (firstPct > 0 && firstPct <= 100) {
      const firstAmount = Math.round((amount * firstPct) / 100);
      installments.push({
        description: `1st Installment (${firstPct}%)`,
        amount: firstAmount,
        dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
        isFirst: true,
        isManual: false,
      });
      remaining -= firstAmount;
      rowIndexForDate++;
    }

    const equalAmount = Math.round(remaining / (numInst - (firstPct > 0 ? 1 : 0)));
    let adjustedRemaining = remaining;

    for (let i = firstPct > 0 ? 1 : 0; i < numInst; i++) {
      const isLast = i === numInst - 1;
      const installmentAmount = isLast ? adjustedRemaining : equalAmount;
      adjustedRemaining -= installmentAmount;
      
      installments.push({
        description: `${i + 1}${getOrdinalSuffix(i + 1)} Installment${isLast ? " (Balance)" : ""}`,
        amount: installmentAmount,
        dueDate: calculateDueDate(startDate, rowIndexForDate, frequency),
        isManual: false,
      });
      rowIndexForDate++;
    }

    setCalculatedInstallments(installments);
  };

  const handleManualAmountChange = (index, newAmountStr) => {
    const newAmount = newAmountStr === "" ? 0 : parseFloat(newAmountStr) || 0;
    const amount = parseFloat(totalAmount);
    
    let updatedInstallments = [...calculatedInstallments];
    updatedInstallments[index].amount = newAmount;
    updatedInstallments[index].isManual = true;

    let manualSum = 0;
    let autoCount = 0;
    let lastAutoIndex = -1;

    updatedInstallments.forEach((inst, i) => {
      if (inst.isManual) {
        manualSum += inst.amount;
      } else {
        autoCount++;
        lastAutoIndex = i;
      }
    });

    if (manualSum > amount) {
      toast.warning("Manual amounts exceed the total amount!");
    }

    const remainingBalance = amount - manualSum;
    
    if (autoCount > 0) {
      const equalShare = Math.max(0, Math.round(remainingBalance / autoCount));
      let adjustedRemaining = Math.max(0, remainingBalance);

      updatedInstallments.forEach((inst, i) => {
        if (!inst.isManual) {
          const isLastAuto = i === lastAutoIndex;
          inst.amount = isLastAuto ? adjustedRemaining : equalShare;
          adjustedRemaining -= inst.amount;
        }
      });
    }

    setCalculatedInstallments(updatedInstallments);
  };

  const handleManualDateChange = (index, newDate) => {
    let updatedInstallments = [...calculatedInstallments];
    updatedInstallments[index].dueDate = newDate;
    setCalculatedInstallments(updatedInstallments);
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const handleApply = () => {
    if (calculatedInstallments.length === 0) {
      toast.error("Please calculate installments first");
      return;
    }
    
    const formattedInstallments = calculatedInstallments.map((inst, index) => ({
      installmentNumber: index + 1,
      description: inst.description,
      amount: inst.amount.toString(),
      dueDate: inst.dueDate || "",
    }));
    
    onApply(formattedInstallments);
    onOpenChange(false);
    toast.success("Installment plan applied!");
  };

  const totalCalculated = calculatedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
  const difference = parseFloat(totalAmount) - totalCalculated;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Installment Calculator
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div>
              <Label className="font-semibold">Total Amount to Distribute (Base) *</Label>
              <Input
                type="number"
                placeholder="Enter total amount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="text-lg font-bold mt-1 bg-white"
              />
              <span className="text-xs text-muted-foreground mt-1 block">
                Remaining target: {formatCurrency(remainingAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Number of Installments *</Label>
                <Input
                  type="number"
                  placeholder="e.g. 24"
                  value={numberOfInstallments}
                  onChange={(e) => setNumberOfInstallments(e.target.value)}
                  min="1"
                  max="300"
                  className="mt-1 bg-white"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">Max 300 (25 Years)</span>
              </div>

              <div>
                <Label className="font-semibold">1st Installment % (Optional)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    placeholder="e.g. 30"
                    value={firstInstallmentPercentage}
                    onChange={(e) => setFirstInstallmentPercentage(e.target.value)}
                    min="0"
                    max="100"
                    className="bg-white"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <div className="border-t border-muted-foreground/20 pt-3">
              <Label className="font-semibold flex items-center gap-2 mb-2 text-primary">
                <CalendarClock className="h-4 w-4" />
                Auto-Calculate Due Dates
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Start Date (Optional)</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs">Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="mt-1 bg-white">
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
                      <SelectItem value="biannually">Bi-annually (6 Months)</SelectItem>
                      <SelectItem value="annually">Annually (12 Months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={calculateInstallments} 
              className="w-full"
              variant="secondary"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Generate Initial Plan
            </Button>
          </div>

          {calculatedInstallments.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    Adjust Plan
                    <span className="text-xs font-normal text-muted-foreground">
                      (Edit amounts or dates manually)
                    </span>
                  </h4>
                </div>
                <div className="text-xs text-right">
                  <span className="text-muted-foreground block mb-1">Total Allocated: </span>
                  <span className="font-bold text-base">{formatCurrency(totalCalculated)}</span>
                  {difference !== 0 && (
                    <span className={`ml-2 block ${difference > 0 ? "text-amber-600" : "text-red-600"}`}>
                      ({difference > 0 ? "-" : "+"}{formatCurrency(Math.abs(difference))})
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                {calculatedInstallments.map((inst, index) => (
                  <div 
                    key={index} 
                    className={`p-3 bg-white border rounded-md transition-colors space-y-3 ${inst.isManual ? 'border-primary shadow-sm' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-medium">{inst.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          Installment #{index + 1}
                          {inst.isManual && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                              Locked
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="w-1/3 min-w-[120px]">
                        <Input
                          type="number"
                          value={inst.amount === 0 ? "" : inst.amount}
                          onChange={(e) => handleManualAmountChange(index, e.target.value)}
                          className={`text-right font-bold h-9 ${inst.isManual ? 'bg-primary/5' : ''}`}
                          placeholder="Amount"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-muted/20 p-2 rounded border border-muted/50">
                      <Label className="text-xs text-muted-foreground w-16">Due Date</Label>
                      <Input 
                        type="date" 
                        value={inst.dueDate} 
                        onChange={(e) => handleManualDateChange(index, e.target.value)} 
                        className="h-8 text-xs flex-1 bg-white" 
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleApply} className="w-full">
                Apply This Plan
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- ORIGINAL PARENT COMPONENT (UPDATED) ---
export function BookingFormDialog({
  open,
  onOpenChange,
  onSuccess,
  editBooking,
}) {
  const [projects, setProjects] = useState([]);
  const [towers, setTowers] = useState([]);
  const [floors, setFloors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teamManagers, setTeamManagers] = useState([]);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const editInitialized = useRef(false);

  const initialForm = {
    projectId: "",
    towerName: "",
    floor: "",
    flatId: "",

    bookingAmount: "", 
    paymentMode: "",
    agreementDate: "",
    nomineeName: "",
    nomineeRelation: "",

    keyNumber: "",
    businessCode: "",
    businessName: "",
    teamManager: "",
    remarks: "",
    transactionId: "",

    leadId: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientPassword: "",

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

    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    accountHolderName: "",
    accountType: "",
    branchName: "",

    useCustomPlan: false,
    installments: [],
  };

  const [form, setForm] = useState(initialForm);
  const isEdit = Boolean(editBooking);

  // ---- GST Helper Functions ----
  const getGSTPercentage = () => {
    if (!selectedFlat) return 0;
    const flatPrice = selectedFlat.price || 0;
    return flatPrice >= 4500000 ? 5 : 1;
  };

  const getFlatBasePrice = () => selectedFlat?.price || 0;
  const getTotalFlatGST = () => Math.round((getFlatBasePrice() * getGSTPercentage()) / 100);
  const getGrandTotal = () => getFlatBasePrice() + getTotalFlatGST();

  const getBookingBase = () => parseFloat(form.bookingAmount) || 0;
  const getBookingGST = () => Math.round((getBookingBase() * getGSTPercentage()) / 100);
  const getTotalPayableToday = () => getBookingBase() + getBookingGST();

  const getInstallmentTargetBase = () => getFlatBasePrice() - getBookingBase();
  const getInstallmentTargetGST = () => getTotalFlatGST() - getBookingGST();
  const getInstallmentTargetTotal = () => getInstallmentTargetBase() + getInstallmentTargetGST();

  // ---- Edit Initialization ----
  useEffect(() => {
    if (!editBooking || !open) {
      editInitialized.current = false;
      return;
    }
    if (!projectsLoaded) return;
    if (editInitialized.current) return;
    editInitialized.current = true;

    const projectId = editBooking.projectId?._id || editBooking.projectId;
    const towerName = editBooking.flatSnapshot?.towerName || "";
    const floor = editBooking.flatSnapshot?.floor || "";
    const flatId = editBooking.flatId;

    // Load project/tower/floor/flat
    const project = projects.find((p) => p._id === projectId);
    if (project?.towers) setTowers(project.towers);

    const tower = project?.towers?.find((t) => t.towerName === towerName);
    if (tower?.floors) setFloors(tower.floors);

    const floorObj = tower?.floors?.find(
      (f) => String(f.floorNumber) === String(floor)
    );
    if (floorObj?.flats) setFlats(floorObj.flats);

    const flatObj = floorObj?.flats?.find((f) => f._id === flatId);
    if (flatObj) setSelectedFlat(flatObj);

    // Safely extract nested objects from Detailed API Response
    const pDetails = editBooking.personalDetails || {};
    const bDetails = editBooking.bankDetails || {};
    const client = editBooking.clientId || {};
    const permAddress = pDetails.address?.permanentAddress || {};
    const emergency = pDetails.emergencyContact || {};
    const nominee = editBooking.nominee || {};

    setForm({
      ...initialForm,
      projectId: projectId || "",
      towerName: towerName,
      floor: floor.toString(),
      flatId: flatId || "",
      
      bookingAmount: editBooking.bookingBaseAmount ? editBooking.bookingBaseAmount.toString() : (editBooking.bookingAmount ? editBooking.bookingAmount.toString() : ""),
      
      paymentMode: editBooking.paymentMode || "",
      agreementDate: editBooking.agreementDate ? editBooking.agreementDate.slice(0, 10) : "",
      nomineeName: nominee.name || editBooking.nomineeName || "",
      nomineeRelation: nominee.relation || editBooking.nomineeRelation || "",
      keyNumber: editBooking.keyNumber || "",
      businessCode: editBooking.businessCode || "",
      businessName: editBooking.businessName || "",
      teamManager: editBooking.teamManager?._id || editBooking.teamManager || "",
      remarks: editBooking.remarks || "",
      transactionId: editBooking.transactionId || "",
      
      leadId: editBooking.leadId?._id || editBooking.leadId || "",

      // Client Details
      clientName: client.name || "",
      clientEmail: client.email || "",
      clientPhone: client.phone || "",
      clientPassword: "",

      // Personal Details
      dateOfBirth: pDetails.dateOfBirth ? pDetails.dateOfBirth.slice(0, 10) : "",
      gender: pDetails.gender || "",
      bloodGroup: pDetails.bloodGroup || "",
      maritalStatus: pDetails.maritalStatus || "",
      aadharNumber: pDetails.aadharNumber || "",
      panNumber: pDetails.panNumber || "",
      fatherName: pDetails.fatherName || "",
      motherName: pDetails.motherName || "",
      emergencyContactName: emergency.name || "",
      emergencyContactPhone: emergency.phone || "",
      emergencyContactRelation: emergency.relation || "",
      
      // Address Details
      addressLine1: permAddress.line1 || "",
      city: permAddress.city || "",
      state: permAddress.state || "",
      country: permAddress.country || "India",
      pincode: permAddress.pincode || "",

      // Bank Details
      bankName: bDetails.bankName || "",
      accountNumber: bDetails.accountNumber || "",
      ifscCode: bDetails.ifscCode || "",
      upiId: bDetails.upiId || "",
      accountHolderName: bDetails.accountHolderName || "",
      accountType: bDetails.accountType || "",
      branchName: bDetails.branchName || "",

      // Installments
      useCustomPlan: Boolean(editBooking.installmentPlan?.length),
      installments: editBooking.installmentPlan?.length
        ? editBooking.installmentPlan.map((inst) => ({
            installmentNumber: inst.installmentNumber,
            description: inst.description,
            amount: inst.baseAmount || inst.amount,
            dueDate: inst.dueDate?.slice?.(0, 10) || "",
          }))
        : [],
    });
  }, [editBooking, open, projectsLoaded, projects]);

  const resetForm = () => {
    setForm(initialForm);
    setTowers([]);
    setFloors([]);
    setFlats([]);
    setSelectedFlat(null);
    setProjectsLoaded(false);
    editInitialized.current = false;
  };

  const { leads, loading: leadsLoading } = useLeadList();

  const fetchProjects = async () => {
    try {
      const res = await projectApi.getAll();
      if (res.data.success) {
        setProjects(res.data.data?.projects || []);
        setProjectsLoaded(true);
      }
    } catch (err) {
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
            user.role === "admin"
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

  // ---- Dependent useEffect for project/tower/floor/flat ----
  useEffect(() => {
    if (form.projectId) {
      const project = projects.find((p) => p._id === form.projectId);
      if (project?.towers?.length) {
        setTowers(project.towers);
        const towerExists = form.towerName && project.towers.some((t) => t.towerName === form.towerName);
        if (!towerExists) {
          setForm((prev) => ({ ...prev, towerName: "", floor: "", flatId: "" }));
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
    } else {
      setTowers([]);
      setFloors([]);
      setFlats([]);
      setSelectedFlat(null);
    }
  }, [form.projectId, projects]);

  useEffect(() => {
    if (form.towerName) {
      const tower = towers.find((t) => t.towerName === form.towerName);
      if (tower) {
        setFloors(tower.floors || []);
        const floorExists = form.floor && tower.floors.some((f) => String(f.floorNumber) === String(form.floor));
        if (!floorExists) {
          setForm((prev) => ({ ...prev, floor: "", flatId: "" }));
          setFlats([]);
          setSelectedFlat(null);
        }
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

  useEffect(() => {
    if (form.floor !== "" && form.floor !== undefined) {
      const floor = floors.find((f) => String(f.floorNumber) === String(form.floor));
      if (floor) {
        setFlats(floor.flats || []);
        const flatExists = form.flatId && floor.flats.some((f) => f._id === form.flatId);
        if (!flatExists) {
          setForm((prev) => ({ ...prev, flatId: "" }));
          setSelectedFlat(null);
        }
      } else {
        setFlats([]);
        setSelectedFlat(null);
      }
    } else {
      setFlats([]);
      setSelectedFlat(null);
    }
  }, [form.floor, floors]);

  useEffect(() => {
    if (form.flatId && flats.length) {
      const flat = flats.find((f) => f._id === form.flatId);
      setSelectedFlat(flat || null);
    } else {
      setSelectedFlat(null);
    }
  }, [form.flatId, flats]);

  // ---- Form update helpers ----
  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
    const renumbered = updated.map((inst, idx) => ({ ...inst, installmentNumber: idx + 1 }));
    setForm((prev) => ({ ...prev, installments: renumbered }));
  };

  const updateInstallment = (index, field, value) => {
    const updated = [...form.installments];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, installments: updated }));
  };

  const getTotalInstallmentAmount = () => {
    return form.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0);
  };

  const handleCalculatorApply = (calculatedInstallments) => {
    setForm((prev) => ({
      ...prev,
      installments: calculatedInstallments,
      useCustomPlan: true,
    }));
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    if (!form.projectId || !form.towerName || !form.floor || !form.flatId) {
      toast.error("Project, Tower, Floor, and Flat are required");
      return;
    }

    if (form.useCustomPlan) {
      if (form.installments.length === 0) {
        toast.error("Please add at least one installment");
        return;
      }
      const invalid = form.installments.some((inst) => !inst.description || !inst.amount);
      if (invalid) {
        toast.error("All installment fields (description, amount) are required");
        return;
      }
    }

    setLoading(true);

    const payload = {
      projectId: form.projectId,
      flatId: form.flatId,
      bookingAmount: Number(form.bookingAmount), 
      paymentMode: form.paymentMode || undefined,
      agreementDate: form.agreementDate || undefined,
      nomineeName: form.nomineeName || undefined,
      nomineeRelation: form.nomineeRelation || undefined,
      keyNumber: form.keyNumber || undefined,
      businessCode: form.businessCode || undefined,
      businessName: form.businessName || undefined,
      teamManager: form.teamManager || undefined,
      remarks: form.remarks || undefined,
      transactionId: form.transactionId || undefined,
    };

    if (form.useCustomPlan && form.installments.length > 0) {
      const installments = form.installments.map((inst) => ({
        installmentNumber: inst.installmentNumber,
        description: inst.description,
        amount: Number(inst.amount),
        dueDate: inst.dueDate || undefined,
      }));
      payload.installmentPlan = { installments };
    }

    if (form.leadId && !isEdit) {
      payload.leadId = form.leadId;
    } else {
      payload.clientName = form.clientName;
      if (form.clientEmail) payload.clientEmail = form.clientEmail;
      payload.clientPhone = form.clientPhone;
      if (form.clientPassword && !isEdit) payload.clientPassword = form.clientPassword;

      const personalDetails = {};
      if (form.dateOfBirth) personalDetails.dateOfBirth = form.dateOfBirth;
      if (form.gender) personalDetails.gender = form.gender;
      if (form.bloodGroup) personalDetails.bloodGroup = form.bloodGroup;
      if (form.maritalStatus) personalDetails.maritalStatus = form.maritalStatus;
      if (form.aadharNumber) personalDetails.aadharNumber = form.aadharNumber;
      if (form.panNumber) personalDetails.panNumber = form.panNumber;
      if (form.fatherName) personalDetails.fatherName = form.fatherName;
      if (form.motherName) personalDetails.motherName = form.motherName;
      if (form.emergencyContactName) personalDetails.emergencyContactName = form.emergencyContactName;
      if (form.emergencyContactPhone) personalDetails.emergencyContactPhone = form.emergencyContactPhone;
      if (form.emergencyContactRelation) personalDetails.emergencyContactRelation = form.emergencyContactRelation;

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
      if (form.accountHolderName) bankDetails.accountHolderName = form.accountHolderName;
      if (form.accountType) bankDetails.accountType = form.accountType;
      if (form.branchName) bankDetails.branchName = form.branchName;

      if (Object.keys(bankDetails).length) {
        payload.bankDetails = bankDetails;
      }
    }

    try {
      let res;
      if (isEdit) {
        res = await bookingApi.updateBooking(editBooking._id, payload);
      } else {
        res = await bookingApi.createBooking(payload);
      }
      toast.success(isEdit ? "Booking updated" : "Booking created");
      onSuccess?.(res.data?.data);
      onOpenChange(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // ---- Render ----
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Booking" : "Create New Booking"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-1">
          {/* Flat Selection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Project *</Label>
              <Select value={form.projectId} disabled={isEdit} onValueChange={(v) => { updateForm("projectId", v); updateForm("towerName", ""); updateForm("floor", ""); updateForm("flatId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tower *</Label>
              <Select value={form.towerName} disabled={!form.projectId || towers.length === 0 || isEdit} onValueChange={(v) => { updateForm("towerName", v); updateForm("floor", ""); updateForm("flatId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select tower" /></SelectTrigger>
                <SelectContent>
                  {towers.map((t) => (<SelectItem key={t.towerName} value={t.towerName}>{t.towerName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Floor *</Label>
              <Select value={form.floor.toString()} disabled={!form.towerName || floors.length === 0 || isEdit} onValueChange={(v) => { updateForm("floor", v); updateForm("flatId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
                <SelectContent>
                  {floors.map((f) => (<SelectItem key={f.floorNumber} value={f.floorNumber.toString()}>Floor {f.floorNumber}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Flat *</Label>
              <Select value={form.flatId} disabled={!form.floor || flats.length === 0 || isEdit} onValueChange={(v) => updateForm("flatId", v)}>
                <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
                <SelectContent>
                  {flats.map((f) => (
                    <SelectItem key={f._id} value={f._id} disabled={f.status !== "available" && !isEdit}>
                      {f.flatNumber} - {f.bedrooms} BHK - {formatCurrency(f.price || 0)} - ({f.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Flat & GST Summary */}
          {selectedFlat && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-primary/5 border border-primary/20 rounded-md">
              <div>
                <Label className="text-xs text-muted-foreground">Flat Price</Label>
                <p className="text-sm font-semibold">{formatCurrency(getFlatBasePrice())}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">GST Slab</Label>
                <p className="text-sm font-semibold">{getGSTPercentage()}%</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Total GST</Label>
                <p className="text-sm font-semibold">{formatCurrency(getTotalFlatGST())}</p>
              </div>
              <div>
                <Label className="text-xs text-primary font-bold">Total Flat Value</Label>
                <p className="text-base font-bold text-primary">{formatCurrency(getGrandTotal())}</p>
              </div>
            </div>
          )}

          {/* Lead Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Lead (Optional)</Label>
              <Select value={form.leadId || "none"} disabled={isEdit} onValueChange={(v) => updateForm("leadId", v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Select lead" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Create new buyer)</SelectItem>
                  {leads?.map((lead) => (
                    <SelectItem key={lead._id} value={lead._id}>
                      {lead.clientName} {lead.clientPhone ? `(${lead.clientPhone})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Booking & Payment Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Booking Details
              <Info className="h-4 w-4 text-muted-foreground" />
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Enter the Booking Amount (Base). GST will be automatically calculated based on the flat's GST slab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Calculator Box */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/40 rounded-lg border">
                <div>
                  <Label className="font-semibold text-foreground">Booking Amount (Base) *</Label>
                  <Input
                    type="number"
                    value={form.bookingAmount}
                    onChange={(e) => updateForm("bookingAmount", e.target.value)}
                    placeholder="e.g. 150000"
                    className="font-bold text-lg mt-1"
                    disabled={isEdit} 
                  />
                  <span className="text-xs text-muted-foreground block mt-1">Amount excluding GST</span>
                </div>

                <div className="flex flex-col justify-center">
                  <Label className="text-sm text-muted-foreground mb-1">
                    + Auto-Calculated GST ({getGSTPercentage()}%)
                  </Label>
                  <div className="text-xl font-bold text-amber-600">
                    {formatCurrency(getBookingGST())}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <Label className="text-sm text-muted-foreground mb-1">
                    = Client Pays Today
                  </Label>
                  <div className="text-2xl font-black text-green-600">
                    {formatCurrency(getTotalPayableToday())}
                  </div>
                </div>
              </div>
            </div>

            {/* Editable / Unchangeable Booking Details */}
            <div>
              <Label>Payment Mode</Label>
              <Select value={form.paymentMode} disabled={isEdit} onValueChange={(v) => updateForm("paymentMode", v)}>
                <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
                <SelectContent>
                  {Object.values(PAYMENT_MODE || {
                    CASH: 'Cash', CHEQUE: 'Cheque', BANK_TRANSFER: 'Bank Transfer', 
                    CARD: 'Card', NEFT: 'NEFT', RTGS: 'RTGS', TRF: 'TRF', L_NEFT: 'L-NEFT'
                  }).map((mode) => (
                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transaction ID</Label>
              <Input placeholder="Optional" value={form.transactionId} disabled={isEdit} onChange={(e) => updateForm("transactionId", e.target.value)} />
            </div>
            <div>
              <Label>Agreement Date</Label>
              <Input
                type="date"
                value={form.agreementDate}
                onChange={(e) => updateForm("agreementDate", e.target.value)}
                disabled={isEdit}   // <--- UPDATED: Disabled on edit
              />
            </div>
            <div>
              <Label>Nominee Name</Label>
              <Input
                placeholder="Optional"
                value={form.nomineeName}
                onChange={(e) => updateForm("nomineeName", e.target.value)}
                disabled={isEdit}   // <--- UPDATED: Disabled on edit
              />
            </div>
            <div>
              <Label>Nominee Relation</Label>
              <Input
                placeholder="Optional"
                value={form.nomineeRelation}
                onChange={(e) => updateForm("nomineeRelation", e.target.value)}
                disabled={isEdit}   // <--- UPDATED: Disabled on edit
              />
            </div>
            <div>
              <Label>Key Number (KYC ID)</Label>
              <Input placeholder="Optional" value={form.keyNumber} onChange={(e) => updateForm("keyNumber", e.target.value)} />
            </div>
            <div>
              <Label>Business Code</Label>
              <Input placeholder="Optional" value={form.businessCode} onChange={(e) => updateForm("businessCode", e.target.value)} />
            </div>
            <div>
              <Label>Business Name</Label>
              <Input placeholder="Optional" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
            </div>
            <div>
              <Label>Team Manager</Label>
              <Select value={form.teamManager} onValueChange={(v) => updateForm("teamManager", v)}>
                <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                <SelectContent>
                  {teamManagers.map((mgr) => (
                    <SelectItem key={mgr._id} value={mgr._id}>
                      {mgr.name || mgr.email} ({mgr.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Remarks</Label>
              <Input placeholder="Optional" value={form.remarks} onChange={(e) => updateForm("remarks", e.target.value)} />
            </div>
          </div>

          {/* Installment Plan Section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-semibold text-lg">Installment Plan</h3>
              <label className="flex items-center gap-2 text-sm cursor-pointer ml-4 p-2 bg-muted/50 rounded-md">
                <input
                  type="checkbox"
                  checked={form.useCustomPlan}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked && form.installments.length === 0) {
                      addInstallment();
                    }
                    updateForm("useCustomPlan", checked);
                  }}
                  className="w-4 h-4"
                />
                <span className="font-medium">Use Custom Plan</span>
              </label>
              <span className="text-xs text-muted-foreground">(If unchecked, system creates 3 equal installments)</span>
              {form.useCustomPlan && selectedFlat && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCalculatorOpen(true)}
                  className="ml-auto gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Amount Calculator
                </Button>
              )}
            </div>

            {form.useCustomPlan && (
              <div className="space-y-4">
                
                {/* Visual Target Tracker */}
                {selectedFlat && (
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 border rounded-md">
                    <div className="space-y-1 w-full md:w-auto text-sm">
                      <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
                        <span>Remaining Target:</span> 
                        <span className="font-mono">{formatCurrency(getInstallmentTargetBase())}</span>
                      </div>
                      <div className="flex justify-between md:justify-start gap-4 text-muted-foreground">
                        <span>Remaining GST:</span> 
                        <span className="font-mono">{formatCurrency(getInstallmentTargetGST())}</span>
                      </div>
                      <div className="flex justify-between md:justify-start gap-4 font-bold text-foreground">
                        <span>Total (Payable):</span> 
                        <span className="font-mono text-primary">{formatCurrency(getInstallmentTargetTotal())}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex justify-end">
                      {(() => {
                        const diff = getInstallmentTargetBase() - getTotalInstallmentAmount();
                        return (
                          <div className={`px-4 py-2 rounded-md font-bold text-sm ${diff === 0 ? "bg-green-100 text-green-700" : diff > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                            {diff === 0 
                              ? "✅ Amounts matched perfectly!" 
                              : diff > 0 
                                ? `⚠️ Add ${formatCurrency(diff)} more.` 
                                : `⚠️ Amount exceeds by ${formatCurrency(Math.abs(diff))}.`}
                          </div>
                        );
                      })()}
                    </div>

                    <Button type="button" variant="default" size="sm" onClick={addInstallment} className="gap-1">
                      <Plus className="h-4 w-4" /> Add Row
                    </Button>
                  </div>
                )}

                {/* Installment Rows */}
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {form.installments.map((inst, index) => {
                    const instBase = parseFloat(inst.amount) || 0;
                    const instGST = Math.round((instBase * getGSTPercentage()) / 100);
                    const instTotal = instBase + instGST;

                    return (
                      <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-white border shadow-sm rounded-md relative">
                        <div className="col-span-12 md:col-span-1 flex items-center justify-center font-bold text-muted-foreground h-10 bg-muted/40 rounded">
                          #{inst.installmentNumber}
                        </div>
                        
                        <div className="col-span-12 md:col-span-3">
                          <Label className="text-xs mb-1 block">Description</Label>
                          <Input placeholder="e.g. 1st Installment" value={inst.description} onChange={(e) => updateInstallment(index, "description", e.target.value)} />
                        </div>
                        
                        <div className="col-span-12 md:col-span-4 bg-primary/5 p-2 rounded border border-primary/10">
                          <Label className="text-xs font-semibold text-primary mb-1 block">Amount (Base) *</Label>
                          <Input type="number" placeholder="Enter Amount" value={inst.amount} onChange={(e) => updateInstallment(index, "amount", e.target.value)} className="font-bold bg-white" />
                          <div className="text-[11px] text-muted-foreground mt-2 flex justify-between font-mono">
                            <span>+ GST: {formatCurrency(instGST)}</span>
                            <span className="font-bold text-foreground">= Total: {formatCurrency(instTotal)}</span>
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-3">
                          <Label className="text-xs mb-1 block">Due Date</Label>
                          <Input type="date" value={inst.dueDate} onChange={(e) => updateInstallment(index, "dueDate", e.target.value)} />
                        </div>
                        
                        <div className="col-span-12 md:col-span-1 flex justify-end items-center h-full">
                          <Button type="button" variant="ghost" onClick={() => removeInstallment(index)} className="text-destructive hover:bg-destructive/10" disabled={form.installments.length <= 1}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Edit / New Client Fields */}
          {(!form.leadId || isEdit) && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg">Buyer Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Buyer Name" value={form.clientName} onChange={(e) => updateForm("clientName", e.target.value)} />
                <Input type="email" placeholder="Email" value={form.clientEmail} onChange={(e) => updateForm("clientEmail", e.target.value)} />
                <Input placeholder="Phone" value={form.clientPhone} onChange={(e) => updateForm("clientPhone", e.target.value)} />
                {!isEdit && (
                  <Input type="password" placeholder="Password" value={form.clientPassword} onChange={(e) => updateForm("clientPassword", e.target.value)} />
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg">Personal Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => updateForm("dateOfBirth", e.target.value)} />
                <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.bloodGroup} onValueChange={(v) => updateForm("bloodGroup", v)}>
                  <SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.maritalStatus} onValueChange={(v) => updateForm("maritalStatus", v)}>
                  <SelectTrigger><SelectValue placeholder="Marital Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Aadhar Number" value={form.aadharNumber} onChange={(e) => updateForm("aadharNumber", e.target.value)} />
                <Input placeholder="PAN Number" value={form.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
                <Input placeholder="Father's Name" value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
                <Input placeholder="Mother's Name" value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg">Emergency Contact</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => updateForm("emergencyContactName", e.target.value)} />
                <Input placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => updateForm("emergencyContactPhone", e.target.value)} />
                <Input placeholder="Relationship" value={form.emergencyContactRelation} onChange={(e) => updateForm("emergencyContactRelation", e.target.value)} />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg">Permanent Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
                <Input placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} />
                <Input placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} />
                <Input placeholder="Country" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
                <Input placeholder="Pincode" value={form.pincode} onChange={(e) => updateForm("pincode", e.target.value)} />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg">Bank Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
                <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
                <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
                <Input placeholder="UPI ID" value={form.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
                <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
                <Select value={form.accountType} onValueChange={(v) => updateForm("accountType", v)}>
                  <SelectTrigger><SelectValue placeholder="Account Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Current">Current</SelectItem>
                    <SelectItem value="Salary">Salary</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Branch Name" value={form.branchName} onChange={(e) => updateForm("branchName", e.target.value)} />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="bg-muted/30 p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} size="lg">
            {loading ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Amount Calculator Dialog */}
      <AmountCalculatorDialog
        open={calculatorOpen}
        onOpenChange={setCalculatorOpen}
        onApply={handleCalculatorApply}
        remainingAmount={getInstallmentTargetBase()}
      />
    </Dialog>
  );
}  