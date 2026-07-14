// // src/components/project/ProjectForm.jsx
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2, Plus, Trash2, Edit } from "lucide-react";
// import { formatINR } from "@/lib/helpers";
// import { Card, CardContent } from "@/components/ui/card";

// const STATUS_OPTIONS = [
//   { value: "planning", label: "Planning" },
//   { value: "in_progress", label: "In Progress" },
//   { value: "delayed", label: "Delayed" },
//   { value: "completed", label: "Completed" },
//   { value: "on_hold", label: "On Hold" },
// ];

// const PRIORITY_OPTIONS = [
//   { value: "low", label: "Low" },
//   { value: "medium", label: "Medium" },
//   { value: "high", label: "High" },
// ];

// const FACING_OPTIONS = [
//   { value: "East", label: "East" },
//   { value: "West", label: "West" },
//   { value: "North", label: "North" },
//   { value: "South", label: "South" },
// ];

// const FURNISHED_OPTIONS = [
//   { value: "unfurnished", label: "Unfurnished" },
//   { value: "semi-furnished", label: "Semi-Furnished" },
//   { value: "fully-furnished", label: "Fully Furnished" },
// ];

// const EMPTY_FLAT = {
//   flatNumber: "",
//   area: "",
//   bedrooms: "",
//   bathrooms: "",
//   price: "",
//   facing: "",
//   parking: false,
//   balcony: false,
//   furnished: "unfurnished",

//   typeOfBooking: "",
//   agreementStatus: "",
//   agreementDate: "",
//   cancelled: false,
// };

// const EMPTY_ADDRESS = {
//   street: "",
//   city: "",
//   state: "",
//   pincode: "",
//   country: "India",
// };

// const EMPTY_PROJECT = {
//   name: "",
//   description: "",
//   location: "",
//   startDate: "",
//   endDate: "",
//   budget: "",
//   status: "planning",
//   priority: "medium",
//   address: { ...EMPTY_ADDRESS },
//   towers: [],
// };

// // ---------- Flat Editor Dialog ----------
// function FlatFormDialog({ open, onOpenChange, flat, onSave }) {
//   const [form, setForm] = useState(flat || { ...EMPTY_FLAT });

//   useEffect(() => {
//     if (open) {
//       setForm(flat || { ...EMPTY_FLAT });
//     }
//   }, [open, flat]);

//   const handleSave = () => {
//     if (!form.flatNumber) return;
//     onSave({
//       ...form,

//       area: Number(form.area) || 0,
//       bedrooms: Number(form.bedrooms) || 0,
//       bathrooms: Number(form.bathrooms) || 0,
//       price: Number(form.price) || 0,

//       typeOfBooking: form.typeOfBooking || undefined,
//       agreementStatus: form.agreementStatus || undefined,
//       agreementDate: form.agreementDate || undefined,
//       cancelled: form.cancelled || false,
//     });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>{flat ? "Edit Flat" : "Add Flat"}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-3 max-h-[60vh] overflow-y-auto">
//           <div className="grid grid-cols-2 gap-2 p-1">
//             <div>
//               <Label>Flat Number *</Label>
//               <Input
//                 value={form.flatNumber}
//                 onChange={(e) =>
//                   setForm({ ...form, flatNumber: e.target.value })
//                 }
//                 placeholder="101"
//               />
//             </div>
//             <div>
//               <Label>Area (sq ft)</Label>
//               <Input
//                 type="number"
//                 value={form.area}
//                 onChange={(e) => setForm({ ...form, area: e.target.value })}
//                 placeholder="650"
//               />
//             </div>
//             <div>
//               <Label>Bedrooms</Label>
//               <Input
//                 type="number"
//                 value={form.bedrooms}
//                 onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
//                 placeholder="1-5"
//               />
//             </div>
//             <div>
//               <Label>Bathrooms</Label>
//               <Input
//                 type="number"
//                 value={form.bathrooms}
//                 onChange={(e) =>
//                   setForm({ ...form, bathrooms: e.target.value })
//                 }
//                 placeholder="1"
//               />
//             </div>
//             <div>
//               <Label>Price (₹)</Label>
//               <Input
//                 type="number"
//                 value={form.price}
//                 onChange={(e) => setForm({ ...form, price: e.target.value })}
//                 placeholder="4500000"
//               />
//             </div>
//             <div>
//               <Label>Facing</Label>
//               <Select
//                 value={form.facing}
//                 onValueChange={(v) => setForm({ ...form, facing: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {FACING_OPTIONS.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Furnished</Label>
//               <Select
//                 value={form.furnished}
//                 onValueChange={(v) => setForm({ ...form, furnished: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {FURNISHED_OPTIONS.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-center gap-4 col-span-2">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.parking}
//                   onChange={(e) =>
//                     setForm({ ...form, parking: e.target.checked })
//                   }
//                 />
//                 Parking
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.balcony}
//                   onChange={(e) =>
//                     setForm({ ...form, balcony: e.target.checked })
//                   }
//                 />
//                 Balcony
//               </label>
//             </div>

//             <div className="col-span-2 border-t pt-3 mt-2">
//               <Label className="text-xs text-muted-foreground mb-2 block">
//                 Booking & Agreement Details (Optional)
//               </Label>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <Label>Type of Booking</Label>
//                   <Select
//                     value={form.typeOfBooking}
//                     onValueChange={(v) =>
//                       setForm({ ...form, typeOfBooking: v })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="CLP">CLP</SelectItem>
//                       <SelectItem value="ONE_TIME">ONE TIME</SelectItem>
//                       <SelectItem value="OTP">OTP</SelectItem>
//                       <SelectItem value="RENTAL">RENTAL</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Agreement Status</Label>
//                   <Select
//                     value={form.agreementStatus}
//                     onValueChange={(v) =>
//                       setForm({ ...form, agreementStatus: v })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="REGISTERED">REGISTERED</SelectItem>
//                       <SelectItem value="CANCELLED">CANCELLED</SelectItem>
//                       <SelectItem value="PENDING">PENDING</SelectItem>
//                       <SelectItem value="APPROVED">APPROVED</SelectItem>
//                       <SelectItem value="REJECTED">REJECTED</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Agreement Date</Label>
//                   <Input
//                     type="date"
//                     value={form.agreementDate}
//                     onChange={(e) =>
//                       setForm({ ...form, agreementDate: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="flex items-center">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={form.cancelled}
//                       onChange={(e) =>
//                         setForm({ ...form, cancelled: e.target.checked })
//                       }
//                     />
//                     Cancelled
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>
//             {flat ? "Update Flat" : "Add Flat"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ---------- Tower Editor Dialog (Floors & Flats) ----------
// function TowerEditorDialog({ open, onOpenChange, tower, onSave }) {
//   const [towerName, setTowerName] = useState("");
//   const [floors, setFloors] = useState([]);
//   const [flatDialogOpen, setFlatDialogOpen] = useState(false);
//   const [editingFlat, setEditingFlat] = useState(null);
//   const [currentFloorIdx, setCurrentFloorIdx] = useState(null);

//   useEffect(() => {
//     if (open) {
//       if (tower) {
//         setTowerName(tower.towerName || "");
//         setFloors(tower.floors ? [...tower.floors] : []);
//       } else {
//         setTowerName("");
//         setFloors([]);
//       }
//     }
//   }, [open, tower]);

//   const addFloor = () => {
//     let nextNumber;
//     if (floors.length === 0) {
//       nextNumber = "Ground";
//     } else {
//       const last = floors[floors.length - 1].floorNumber;
//       if (last === "Ground") {
//         nextNumber = "1";
//       } else if (!isNaN(Number(last))) {
//         nextNumber = String(Number(last) + 1);
//       } else {
//         nextNumber = String(floors.length + 1);
//       }
//     }
//     setFloors([...floors, { floorNumber: nextNumber, flats: [] }]);
//   };

//   const updateFloorNumber = (idx, value) => {
//     const updated = floors.map((f, i) =>
//       i === idx ? { ...f, floorNumber: value } : f,
//     );
//     setFloors(updated);
//   };

//   const deleteFloor = (idx) => setFloors(floors.filter((_, i) => i !== idx));

//   const openAddFlat = (floorIdx) => {
//     setEditingFlat(null);
//     setCurrentFloorIdx(floorIdx);
//     setFlatDialogOpen(true);
//   };

//   const openEditFlat = (floorIdx, flatIdx) => {
//     setEditingFlat(floors[floorIdx].flats[flatIdx]);
//     setCurrentFloorIdx(floorIdx);
//     setFlatDialogOpen(true);
//   };

//   const handleSaveFlat = (flatData) => {
//     if (currentFloorIdx === null) return;
//     const updatedFloors = floors.map((floor, idx) => {
//       if (idx === currentFloorIdx) {
//         let updatedFlats;
//         if (editingFlat) {
//           // find and replace
//           updatedFlats = floor.flats.map((f, fi) =>
//             fi === floor.flats.indexOf(editingFlat) ? flatData : f,
//           );
//         } else {
//           updatedFlats = [...floor.flats, flatData];
//         }
//         return { ...floor, flats: updatedFlats };
//       }
//       return floor;
//     });
//     setFloors(updatedFloors);
//     setFlatDialogOpen(false);
//   };

//   const deleteFlat = (floorIdx, flatIdx) => {
//     const updatedFloors = floors.map((floor, idx) => {
//       if (idx === floorIdx) {
//         return {
//           ...floor,
//           flats: floor.flats.filter((_, fi) => fi !== flatIdx),
//         };
//       }
//       return floor;
//     });
//     setFloors(updatedFloors);
//   };

//   const handleSubmit = () => {
//     if (!towerName.trim()) return;
//     onSave({ towerName: towerName.trim(), floors });
//     onOpenChange(false);
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
//           <DialogHeader>
//             <DialogTitle>{tower ? "Edit Tower" : "Add Tower"}</DialogTitle>
//           </DialogHeader>
//           <div className="flex-1 overflow-y-auto space-y-4 p-2 ">
//             <div>
//               <Label>Tower Name *</Label>
//               <Input
//                 value={towerName}
//                 onChange={(e) => setTowerName(e.target.value)}
//                 placeholder="Tower A"
//               />
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <Label>Floors</Label>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={addFloor}
//                 >
//                   <Plus className="h-3 w-3 mr-1" /> Add Floor
//                 </Button>
//               </div>
//               {floors?.length === 0 ? (
//                 <p className="text-sm text-muted-foreground">
//                   No floors added.
//                 </p>
//               ) : (
//                 floors?.map((floor, floorIdx) => (
//                   <Card key={floorIdx}>
//                     <CardContent className="p-3 space-y-2">
//                       <div className="flex justify-between items-center">
//                         <Label className="text-xs">Floor #</Label>
//                         <Input
//                           value={floor.floorNumber}
//                           onChange={(e) =>
//                             updateFloorNumber(floorIdx, e.target.value)
//                           }
//                           className="h-7 w-24"
//                           placeholder="e.g. Ground"
//                         />
//                         <div className="flex-1" />
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => deleteFloor(floorIdx)}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>

//                       {/* Flats list */}
//                       <div className="ml-2 space-y-1">
//                         {floor.flats?.length === 0 ? (
//                           <p className="text-xs text-muted-foreground">
//                             No flats
//                           </p>
//                         ) : (
//                           floor.flats?.map((flat, flatIdx) => (
//                             <div
//                               key={flatIdx}
//                               className="flex items-center justify-between p-2 bg-muted/40 rounded"
//                             >
//                               <div>
//                                 <span className="text-sm font-medium">
//                                   {flat.flatNumber}
//                                 </span>
//                                 <span className="text-xs text-muted-foreground ml-2">
//                                   {flat.bedrooms} BHK · {flat.area} sqft ·{" "}
//                                   {formatINR(flat.price)}
//                                 </span>
//                                 {flat.cancelled && (
//                                   <span className="text-xs text-red-500 ml-2">
//                                     (Cancelled)
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="flex gap-1">
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="icon"
//                                   onClick={() =>
//                                     openEditFlat(floorIdx, flatIdx)
//                                   }
//                                 >
//                                   <Edit className="h-3 w-3" />
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="icon"
//                                   onClick={() => deleteFlat(floorIdx, flatIdx)}
//                                 >
//                                   <Trash2 className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>

//                       <Button
//                         type="button"
//                         variant="link"
//                         size="sm"
//                         onClick={() => openAddFlat(floorIdx)}
//                         className="p-0 h-auto text-xs"
//                       >
//                         <Plus className="h-3 w-3 mr-1" /> Add Flat
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} disabled={!towerName.trim()}>
//               Save Tower
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Flat dialog nested inside tower editor */}
//       <FlatFormDialog
//         open={flatDialogOpen}
//         onOpenChange={setFlatDialogOpen}
//         flat={editingFlat}
//         onSave={handleSaveFlat}
//       />
//     </>
//   );
// }

// // ---------- Towers Manager (used in main form) ----------
// function TowersManager({ towers, setTowers }) {
//   const [towerDialogOpen, setTowerDialogOpen] = useState(false);
//   const [editingTower, setEditingTower] = useState(null);

//   const openAddTower = () => {
//     setEditingTower(null);
//     setTowerDialogOpen(true);
//   };

//   const openEditTower = (index) => {
//     setEditingTower(towers[index]);
//     setTowerDialogOpen(true);
//   };

//   const handleSaveTower = (towerData) => {
//     if (editingTower) {
//       const updated = towers.map((t, i) =>
//         i === towers.indexOf(editingTower) ? towerData : t,
//       );
//       setTowers(updated);
//     } else {
//       setTowers([...towers, towerData]);
//     }
//   };

//   const deleteTower = (index) => {
//     setTowers(towers.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-3">
//       <div className="flex justify-between items-center">
//         <Label>Towers</Label>
//         <Button
//           type="button"
//           size="sm"
//           variant="outline"
//           onClick={openAddTower}
//         >
//           <Plus className="h-3 w-3 mr-1" /> Add Tower
//         </Button>
//       </div>
//       {towers?.length === 0 ? (
//         <p className="text-sm text-muted-foreground">No towers added yet.</p>
//       ) : (
//         <div className="space-y-2 max-h-80 overflow-y-auto">
//           {towers.map((tower, idx) => {
//             const totalFlats = tower.floors.reduce(
//               (sum, f) => sum + f.flats?.length,
//               0,
//             );
//             return (
//               <Card key={idx}>
//                 <CardContent className="p-3">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-medium">{tower.towerName}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {tower.floors?.length} Floor
//                         {tower.floors?.length !== 1 && "s"} · {totalFlats} Flat
//                         {totalFlats !== 1 && "s"}
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => openEditTower(idx)}
//                       >
//                         <Edit className="h-3 w-3" />
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => deleteTower(idx)}
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* Tower Editor Dialog */}
//       <TowerEditorDialog
//         open={towerDialogOpen}
//         onOpenChange={setTowerDialogOpen}
//         tower={editingTower}
//         onSave={handleSaveTower}
//       />
//     </div>
//   );
// }

// // ---------- Main Project Form ----------
// export function ProjectForm({ open, onOpenChange, initialData, onSave }) {
//   const [form, setForm] = useState(EMPTY_PROJECT);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (open) {
//       if (initialData) {
//         setForm({
//           name: initialData.name ?? "",
//           description: initialData.description ?? "",
//           location: initialData.location ?? "",
//           startDate: initialData.startDate
//             ? initialData.startDate.slice(0, 10)
//             : "",
//           endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
//           budget: initialData.budget ?? "",
//           status: initialData.status ?? "planning",
//           priority: initialData.priority ?? "medium",
//           address: {
//             street: initialData.address?.street ?? "",
//             city: initialData.address?.city ?? "",
//             state: initialData.address?.state ?? "",
//             pincode: initialData.address?.pincode ?? "",
//             country: initialData.address?.country ?? "India",
//           },
//           towers: initialData.towers ?? [],
//         });
//       } else {
//         setForm({ ...EMPTY_PROJECT, towers: [] });
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
//   const setAddressField = (key, val) =>
//     setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));

//   const handleSubmit = async () => {
//     if (!form.name?.trim()) return;
//     setSaving(true);
//     try {
//       await onSave({
//         ...form,
//         budget: Number(form.budget) || 0,
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const isEditing = !!initialData;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="w-[95%] sm:max-w-3xl max-h-[90vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle>
//             {isEditing ? "Edit Project" : "Create New Project"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex-1 overflow-y-auto p-2">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Project Name */}
//             <div className="col-span-2 space-y-1.5">
//               <Label>
//                 Project Name <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 value={form.name}
//                 onChange={(e) => setField("name", e.target.value)}
//                 placeholder="Sky Tower Construction"
//               />
//             </div>

//             {/* Status + Priority */}
//             <div className="space-y-1.5">
//               <Label>Status</Label>
//               <Select
//                 value={form.status}
//                 onValueChange={(v) => setField("status", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {STATUS_OPTIONS.map((o) => (
//                     <SelectItem key={o.value} value={o.value}>
//                       {o.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-1.5">
//               <Label>Priority</Label>
//               <Select
//                 value={form.priority}
//                 onValueChange={(v) => setField("priority", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {PRIORITY_OPTIONS.map((o) => (
//                     <SelectItem key={o.value} value={o.value}>
//                       {o.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Location */}
//             <div className="space-y-1.5">
//               <Label>Location (City/Area)</Label>
//               <Input
//                 value={form.location}
//                 onChange={(e) => setField("location", e.target.value)}
//                 placeholder="Mumbai, Maharashtra"
//               />
//             </div>

//             {/* Dates */}
//             <div className="space-y-1.5">
//               <Label>Start Date</Label>
//               <Input
//                 type="date"
//                 value={form.startDate}
//                 onChange={(e) => setField("startDate", e.target.value)}
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label>End Date (optional)</Label>
//               <Input
//                 type="date"
//                 value={form.endDate}
//                 onChange={(e) => setField("endDate", e.target.value)}
//               />
//             </div>

//             {/* Budget */}
//             <div className="space-y-1.5">
//               <Label>Budget (₹)</Label>
//               <Input
//                 type="number"
//                 value={form.budget}
//                 onChange={(e) => setField("budget", e.target.value)}
//                 placeholder="10000000"
//               />
//             </div>

//             {/* Detailed Address */}
//             <div className="col-span-2">
//               <p className="text-sm font-medium text-muted-foreground mb-2">
//                 Address Details
//               </p>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="col-span-2">
//                   <Label>Street / Building</Label>
//                   <Input
//                     value={form.address.street}
//                     onChange={(e) => setAddressField("street", e.target.value)}
//                     placeholder="MG Road, Andheri East"
//                   />
//                 </div>
//                 <div>
//                   <Label>City</Label>
//                   <Input
//                     value={form.address.city}
//                     onChange={(e) => setAddressField("city", e.target.value)}
//                     placeholder="Mumbai"
//                   />
//                 </div>
//                 <div>
//                   <Label>State</Label>
//                   <Input
//                     value={form.address.state}
//                     onChange={(e) => setAddressField("state", e.target.value)}
//                     placeholder="Maharashtra"
//                   />
//                 </div>
//                 <div>
//                   <Label>Pincode</Label>
//                   <Input
//                     value={form.address.pincode}
//                     onChange={(e) => setAddressField("pincode", e.target.value)}
//                     placeholder="400069"
//                   />
//                 </div>
//                 <div>
//                   <Label>Country</Label>
//                   <Input
//                     value={form.address.country}
//                     onChange={(e) => setAddressField("country", e.target.value)}
//                     placeholder="India"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Towers Management (replaces Units) */}
//             <div className="col-span-2">
//               <TowersManager
//                 towers={form.towers}
//                 setTowers={(towers) => setField("towers", towers)}
//               />
//             </div>

//             {/* Description */}
//             <div className="col-span-2 space-y-1.5">
//               <Label>Description</Label>
//               <Textarea
//                 rows={3}
//                 value={form.description}
//                 onChange={(e) => setField("description", e.target.value)}
//                 placeholder="Brief description of the project…"
//               />
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             disabled={saving}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={saving || !form.name?.trim()}
//           >
//             {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
//             {isEditing ? "Save Changes" : "Create Project"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }








// // src/components/project/ProjectForm.jsx
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2, Plus, Trash2, Edit, X, Image } from "lucide-react";
// import { formatINR } from "@/lib/helpers";
// import { Card, CardContent } from "@/components/ui/card";
// import { toast } from "sonner";
// import { authApi } from "@/api";

// const STATUS_OPTIONS = [
//   { value: "planning", label: "Planning" },
//   { value: "in_progress", label: "In Progress" },
//   { value: "delayed", label: "Delayed" },
//   { value: "completed", label: "Completed" },
//   { value: "on_hold", label: "On Hold" },
// ];

// const PRIORITY_OPTIONS = [
//   { value: "low", label: "Low" },
//   { value: "medium", label: "Medium" },
//   { value: "high", label: "High" },
// ];

// const FACING_OPTIONS = [
//   { value: "East", label: "East" },
//   { value: "West", label: "West" },
//   { value: "North", label: "North" },
//   { value: "South", label: "South" },
// ];

// const FURNISHED_OPTIONS = [
//   { value: "unfurnished", label: "Unfurnished" },
//   { value: "semi-furnished", label: "Semi-Furnished" },
//   { value: "fully-furnished", label: "Fully Furnished" },
// ];

// const EMPTY_FLAT = {
//   flatNumber: "",
//   area: "",
//   bedrooms: "",
//   bathrooms: "",
//   price: "",
//   facing: "",
//   parking: false,
//   balcony: false,
//   furnished: "unfurnished",
//   typeOfBooking: "",
//   agreementStatus: "",
//   agreementDate: "",
//   cancelled: false,
// };

// const EMPTY_ADDRESS = {
//   street: "",
//   city: "",
//   state: "",
//   pincode: "",
//   country: "India",
// };

// const EMPTY_PROJECT = {
//   name: "",
//   description: "",
//   location: "",
//   startDate: "",
//   endDate: "",
//   budget: "",
//   status: "planning",
//   priority: "medium",
//   address: { ...EMPTY_ADDRESS },
//   towers: [],
// };

// // ---------- Flat Editor Dialog ----------
// function FlatFormDialog({ open, onOpenChange, flat, onSave }) {
//   const [form, setForm] = useState(flat || { ...EMPTY_FLAT });

//   useEffect(() => {
//     if (open) {
//       setForm(flat || { ...EMPTY_FLAT });
//     }
//   }, [open, flat]);

//   const handleSave = () => {
//     if (!form.flatNumber) return;
//     onSave({
//       ...form,
//       area: Number(form.area) || 0,
//       bedrooms: Number(form.bedrooms) || 0,
//       bathrooms: Number(form.bathrooms) || 0,
//       price: Number(form.price) || 0,
//       typeOfBooking: form.typeOfBooking || undefined,
//       agreementStatus: form.agreementStatus || undefined,
//       agreementDate: form.agreementDate || undefined,
//       cancelled: form.cancelled || false,
//     });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>{flat ? "Edit Flat" : "Add Flat"}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-3 max-h-[60vh] overflow-y-auto">
//           <div className="grid grid-cols-2 gap-2 p-1">
//             <div>
//               <Label>Flat Number *</Label>
//               <Input
//                 value={form.flatNumber}
//                 onChange={(e) =>
//                   setForm({ ...form, flatNumber: e.target.value })
//                 }
//                 placeholder="101"
//               />
//             </div>
//             <div>
//               <Label>Area (sq ft)</Label>
//               <Input
//                 type="number"
//                 value={form.area}
//                 onChange={(e) => setForm({ ...form, area: e.target.value })}
//                 placeholder="650"
//               />
//             </div>
//             <div>
//               <Label>Bedrooms</Label>
//               <Input
//                 type="number"
//                 value={form.bedrooms}
//                 onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
//                 placeholder="1-5"
//               />
//             </div>
//             <div>
//               <Label>Bathrooms</Label>
//               <Input
//                 type="number"
//                 value={form.bathrooms}
//                 onChange={(e) =>
//                   setForm({ ...form, bathrooms: e.target.value })
//                 }
//                 placeholder="1"
//               />
//             </div>
//             <div>
//               <Label>Price (₹)</Label>
//               <Input
//                 type="number"
//                 value={form.price}
//                 onChange={(e) => setForm({ ...form, price: e.target.value })}
//                 placeholder="4500000"
//               />
//             </div>
//             <div>
//               <Label>Facing</Label>
//               <Select
//                 value={form.facing}
//                 onValueChange={(v) => setForm({ ...form, facing: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {FACING_OPTIONS.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Furnished</Label>
//               <Select
//                 value={form.furnished}
//                 onValueChange={(v) => setForm({ ...form, furnished: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {FURNISHED_OPTIONS.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-center gap-4 col-span-2">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.parking}
//                   onChange={(e) =>
//                     setForm({ ...form, parking: e.target.checked })
//                   }
//                 />
//                 Parking
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.balcony}
//                   onChange={(e) =>
//                     setForm({ ...form, balcony: e.target.checked })
//                   }
//                 />
//                 Balcony
//               </label>
//             </div>

//             <div className="col-span-2 border-t pt-3 mt-2">
//               <Label className="text-xs text-muted-foreground mb-2 block">
//                 Booking & Agreement Details (Optional)
//               </Label>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <Label>Type of Booking</Label>
//                   <Select
//                     value={form.typeOfBooking}
//                     onValueChange={(v) =>
//                       setForm({ ...form, typeOfBooking: v })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="CLP">CLP</SelectItem>
//                       <SelectItem value="ONE_TIME">ONE TIME</SelectItem>
//                       <SelectItem value="OTP">OTP</SelectItem>
//                       <SelectItem value="RENTAL">RENTAL</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Agreement Status</Label>
//                   <Select
//                     value={form.agreementStatus}
//                     onValueChange={(v) =>
//                       setForm({ ...form, agreementStatus: v })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="REGISTERED">REGISTERED</SelectItem>
//                       <SelectItem value="CANCELLED">CANCELLED</SelectItem>
//                       <SelectItem value="PENDING">PENDING</SelectItem>
//                       <SelectItem value="APPROVED">APPROVED</SelectItem>
//                       <SelectItem value="REJECTED">REJECTED</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Agreement Date</Label>
//                   <Input
//                     type="date"
//                     value={form.agreementDate}
//                     onChange={(e) =>
//                       setForm({ ...form, agreementDate: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="flex items-center">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={form.cancelled}
//                       onChange={(e) =>
//                         setForm({ ...form, cancelled: e.target.checked })
//                       }
//                     />
//                     Cancelled
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>
//             {flat ? "Update Flat" : "Add Flat"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ---------- Tower Editor Dialog ----------
// function TowerEditorDialog({ open, onOpenChange, tower, onSave }) {
//   const [towerName, setTowerName] = useState("");
//   const [floors, setFloors] = useState([]);
//   const [flatDialogOpen, setFlatDialogOpen] = useState(false);
//   const [editingFlat, setEditingFlat] = useState(null);
//   const [currentFloorIdx, setCurrentFloorIdx] = useState(null);

//   useEffect(() => {
//     if (open) {
//       if (tower) {
//         setTowerName(tower.towerName || "");
//         setFloors(tower.floors ? [...tower.floors] : []);
//       } else {
//         setTowerName("");
//         setFloors([]);
//       }
//     }
//   }, [open, tower]);

//   const addFloor = () => {
//     let nextNumber;
//     if (floors.length === 0) {
//       nextNumber = "Ground";
//     } else {
//       const last = floors[floors.length - 1].floorNumber;
//       if (last === "Ground") {
//         nextNumber = "1";
//       } else if (!isNaN(Number(last))) {
//         nextNumber = String(Number(last) + 1);
//       } else {
//         nextNumber = String(floors.length + 1);
//       }
//     }
//     setFloors([...floors, { floorNumber: nextNumber, flats: [] }]);
//   };

//   const updateFloorNumber = (idx, value) => {
//     const updated = floors.map((f, i) =>
//       i === idx ? { ...f, floorNumber: value } : f,
//     );
//     setFloors(updated);
//   };

//   const deleteFloor = (idx) => setFloors(floors.filter((_, i) => i !== idx));

//   const openAddFlat = (floorIdx) => {
//     setEditingFlat(null);
//     setCurrentFloorIdx(floorIdx);
//     setFlatDialogOpen(true);
//   };

//   const openEditFlat = (floorIdx, flatIdx) => {
//     setEditingFlat(floors[floorIdx].flats[flatIdx]);
//     setCurrentFloorIdx(floorIdx);
//     setFlatDialogOpen(true);
//   };

//   const handleSaveFlat = (flatData) => {
//     if (currentFloorIdx === null) return;
//     const updatedFloors = floors.map((floor, idx) => {
//       if (idx === currentFloorIdx) {
//         let updatedFlats;
//         if (editingFlat) {
//           updatedFlats = floor.flats.map((f, fi) =>
//             fi === floor.flats.indexOf(editingFlat) ? flatData : f,
//           );
//         } else {
//           updatedFlats = [...floor.flats, flatData];
//         }
//         return { ...floor, flats: updatedFlats };
//       }
//       return floor;
//     });
//     setFloors(updatedFloors);
//     setFlatDialogOpen(false);
//   };

//   const deleteFlat = (floorIdx, flatIdx) => {
//     const updatedFloors = floors.map((floor, idx) => {
//       if (idx === floorIdx) {
//         return {
//           ...floor,
//           flats: floor.flats.filter((_, fi) => fi !== flatIdx),
//         };
//       }
//       return floor;
//     });
//     setFloors(updatedFloors);
//   };

//   const handleSubmit = () => {
//     if (!towerName.trim()) return;
//     onSave({ towerName: towerName.trim(), floors });
//     onOpenChange(false);
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
//           <DialogHeader>
//             <DialogTitle>{tower ? "Edit Tower" : "Add Tower"}</DialogTitle>
//           </DialogHeader>
//           <div className="flex-1 overflow-y-auto space-y-4 p-2">
//             <div>
//               <Label>Tower Name *</Label>
//               <Input
//                 value={towerName}
//                 onChange={(e) => setTowerName(e.target.value)}
//                 placeholder="Tower A"
//               />
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <Label>Floors</Label>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={addFloor}
//                 >
//                   <Plus className="h-3 w-3 mr-1" /> Add Floor
//                 </Button>
//               </div>
//               {floors?.length === 0 ? (
//                 <p className="text-sm text-muted-foreground">
//                   No floors added.
//                 </p>
//               ) : (
//                 floors?.map((floor, floorIdx) => (
//                   <Card key={floorIdx}>
//                     <CardContent className="p-3 space-y-2">
//                       <div className="flex justify-between items-center">
//                         <Label className="text-xs">Floor #</Label>
//                         <Input
//                           value={floor.floorNumber}
//                           onChange={(e) =>
//                             updateFloorNumber(floorIdx, e.target.value)
//                           }
//                           className="h-7 w-24"
//                           placeholder="e.g. Ground"
//                         />
//                         <div className="flex-1" />
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => deleteFloor(floorIdx)}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>

//                       <div className="ml-2 space-y-1">
//                         {floor.flats?.length === 0 ? (
//                           <p className="text-xs text-muted-foreground">
//                             No flats
//                           </p>
//                         ) : (
//                           floor.flats?.map((flat, flatIdx) => (
//                             <div
//                               key={flatIdx}
//                               className="flex items-center justify-between p-2 bg-muted/40 rounded"
//                             >
//                               <div>
//                                 <span className="text-sm font-medium">
//                                   {flat.flatNumber}
//                                 </span>
//                                 <span className="text-xs text-muted-foreground ml-2">
//                                   {flat.bedrooms} BHK · {flat.area} sqft ·{" "}
//                                   {formatINR(flat.price)}
//                                 </span>
//                                 {flat.cancelled && (
//                                   <span className="text-xs text-red-500 ml-2">
//                                     (Cancelled)
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="flex gap-1">
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="icon"
//                                   onClick={() =>
//                                     openEditFlat(floorIdx, flatIdx)
//                                   }
//                                 >
//                                   <Edit className="h-3 w-3" />
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="icon"
//                                   onClick={() => deleteFlat(floorIdx, flatIdx)}
//                                 >
//                                   <Trash2 className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>

//                       <Button
//                         type="button"
//                         variant="link"
//                         size="sm"
//                         onClick={() => openAddFlat(floorIdx)}
//                         className="p-0 h-auto text-xs"
//                       >
//                         <Plus className="h-3 w-3 mr-1" /> Add Flat
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} disabled={!towerName.trim()}>
//               Save Tower
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <FlatFormDialog
//         open={flatDialogOpen}
//         onOpenChange={setFlatDialogOpen}
//         flat={editingFlat}
//         onSave={handleSaveFlat}
//       />
//     </>
//   );
// }

// // ---------- Towers Manager ----------
// function TowersManager({ towers, setTowers }) {
//   const [towerDialogOpen, setTowerDialogOpen] = useState(false);
//   const [editingTower, setEditingTower] = useState(null);

//   const openAddTower = () => {
//     setEditingTower(null);
//     setTowerDialogOpen(true);
//   };

//   const openEditTower = (index) => {
//     setEditingTower(towers[index]);
//     setTowerDialogOpen(true);
//   };

//   const handleSaveTower = (towerData) => {
//     if (editingTower) {
//       const updated = towers.map((t, i) =>
//         i === towers.indexOf(editingTower) ? towerData : t,
//       );
//       setTowers(updated);
//     } else {
//       setTowers([...towers, towerData]);
//     }
//   };

//   const deleteTower = (index) => {
//     setTowers(towers.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-3">
//       <div className="flex justify-between items-center">
//         <Label>Towers</Label>
//         <Button
//           type="button"
//           size="sm"
//           variant="outline"
//           onClick={openAddTower}
//         >
//           <Plus className="h-3 w-3 mr-1" /> Add Tower
//         </Button>
//       </div>
//       {towers?.length === 0 ? (
//         <p className="text-sm text-muted-foreground">No towers added yet.</p>
//       ) : (
//         <div className="space-y-2 max-h-80 overflow-y-auto">
//           {towers.map((tower, idx) => {
//             const totalFlats = tower.floors.reduce(
//               (sum, f) => sum + f.flats?.length,
//               0,
//             );
//             return (
//               <Card key={idx}>
//                 <CardContent className="p-3">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-medium">{tower.towerName}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {tower.floors?.length} Floor
//                         {tower.floors?.length !== 1 && "s"} · {totalFlats} Flat
//                         {totalFlats !== 1 && "s"}
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => openEditTower(idx)}
//                       >
//                         <Edit className="h-3 w-3" />
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => deleteTower(idx)}
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       <TowerEditorDialog
//         open={towerDialogOpen}
//         onOpenChange={setTowerDialogOpen}
//         tower={editingTower}
//         onSave={handleSaveTower}
//       />
//     </div>
//   );
// }

// // ---------- Image Upload Component ----------
// function ImageUploadSection({ coverImage, setCoverImage, coverImageKey, setCoverImageKey, galleryImages, setGalleryImages, galleryImageKeys, setGalleryImageKeys, uploading, setUploading, projectId }) {
//   const uploadImage = async (file, fileType, associatedId = "") => {
//     try {
//       const presignRes = await authApi.getPresignedUrl({
//         fileName: file.name,
//         fileType: fileType,
//         mimeType: file.type,
//         associatedId: associatedId,
//       });
      
//       const { url, key } = presignRes.data;
      
//       await fetch(url, {
//         method: 'PUT',
//         body: file,
//         headers: { 'Content-Type': file.type },
//       });
      
//       await authApi.confirmUpload({ fileKey: key, fileType: fileType });
      
//       return key;
//     } catch (error) {
//       toast.error('Image upload failed');
//       throw error;
//     }
//   };

//   const handleCoverImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     setUploading(true);
//     try {
//       const key = await uploadImage(file, 'project', projectId || 'temp');
//       setCoverImageKey(key);
//       setCoverImage(URL.createObjectURL(file));
//       toast.success('Cover image uploaded');
//     } catch (err) {
//       toast.error('Failed to upload cover image');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleGalleryUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;
    
//     setUploading(true);
//     try {
//       const keys = [];
//       for (const file of files) {
//         const key = await uploadImage(file, 'project', projectId || 'temp');
//         keys.push(key);
//       }
//       setGalleryImageKeys([...galleryImageKeys, ...keys]);
//       setGalleryImages([...galleryImages, ...files.map(f => URL.createObjectURL(f))]);
//       toast.success(`${files.length} gallery image(s) uploaded`);
//     } catch (err) {
//       toast.error('Failed to upload gallery images');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeGalleryImage = (index) => {
//     setGalleryImages(galleryImages.filter((_, i) => i !== index));
//     setGalleryImageKeys(galleryImageKeys.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="col-span-2 border-t pt-4 mt-2">
//       <Label className="text-sm font-semibold">Project Images</Label>
//       <p className="text-xs text-muted-foreground mb-3">
//         Upload cover image and gallery images using presigned URL
//       </p>

//       {/* Cover Image */}
//       <div className="mb-4">
//         <Label>Cover Image</Label>
//         <div className="flex items-center gap-4 mt-1">
//           {coverImage ? (
//             <div className="relative w-32 h-24 rounded border overflow-hidden">
//               <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
//               <button
//                 type="button"
//                 className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80"
//                 onClick={() => { setCoverImage(null); setCoverImageKey(""); }}
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ) : (
//             <label className="cursor-pointer border-2 border-dashed rounded p-4 text-center hover:bg-muted/50 transition w-32 h-24 flex flex-col items-center justify-center">
//               <Plus className="h-6 w-6 text-muted-foreground" />
//               <span className="text-xs text-muted-foreground">Upload</span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleCoverImageUpload}
//                 disabled={uploading}
//               />
//             </label>
//           )}
//           {uploading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
//           {coverImageKey && (
//             <span className="text-xs text-green-600">✓ Uploaded</span>
//           )}
//         </div>
//       </div>

//       {/* Gallery Images */}
//       <div>
//         <Label>Gallery Images</Label>
//         <div className="flex flex-wrap gap-3 mt-1">
//           {galleryImages.map((img, idx) => (
//             <div key={idx} className="relative w-24 h-20 rounded border overflow-hidden">
//               <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
//               <button
//                 type="button"
//                 className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80"
//                 onClick={() => removeGalleryImage(idx)}
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ))}
//           <label className="cursor-pointer border-2 border-dashed rounded p-3 text-center hover:bg-muted/50 transition w-24 h-20 flex flex-col items-center justify-center">
//             <Plus className="h-5 w-5 text-muted-foreground" />
//             <span className="text-xs text-muted-foreground">Add</span>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={handleGalleryUpload}
//               disabled={uploading}
//             />
//           </label>
//         </div>
//         <p className="text-xs text-muted-foreground mt-1">
//           {galleryImageKeys.length} image(s) uploaded
//         </p>
//       </div>
//     </div>
//   );
// }

// // ---------- Main Project Form ----------
// export function ProjectForm({ open, onOpenChange, initialData, onSave }) {
//   const [form, setForm] = useState(EMPTY_PROJECT);
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [coverImage, setCoverImage] = useState(null);
//   const [coverImageKey, setCoverImageKey] = useState("");
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [galleryImageKeys, setGalleryImageKeys] = useState([]);

//   useEffect(() => {
//     if (open) {
//       if (initialData) {
//         setForm({
//           name: initialData.name ?? "",
//           description: initialData.description ?? "",
//           location: initialData.location ?? "",
//           startDate: initialData.startDate
//             ? initialData.startDate.slice(0, 10)
//             : "",
//           endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
//           budget: initialData.budget ?? "",
//           status: initialData.status ?? "planning",
//           priority: initialData.priority ?? "medium",
//           address: {
//             street: initialData.address?.street ?? "",
//             city: initialData.address?.city ?? "",
//             state: initialData.address?.state ?? "",
//             pincode: initialData.address?.pincode ?? "",
//             country: initialData.address?.country ?? "India",
//           },
//           towers: initialData.towers ?? [],
//         });
//         // Set existing images if any
//         if (initialData.coverImage) {
//           setCoverImage(initialData.coverImage);
//         }
//         if (initialData.galleryImages) {
//           setGalleryImages(initialData.galleryImages);
//         }
//       } else {
//         setForm({ ...EMPTY_PROJECT, towers: [] });
//         setCoverImage(null);
//         setCoverImageKey("");
//         setGalleryImages([]);
//         setGalleryImageKeys([]);
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
//   const setAddressField = (key, val) =>
//     setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));

//   const handleSubmit = async () => {
//     if (!form.name?.trim()) return;
//     setSaving(true);
//     try {
//       const payload = {
//         ...form,
//         budget: Number(form.budget) || 0,
//         coverImageKey: coverImageKey || undefined,
//         galleryImageKeys: galleryImageKeys.length > 0 ? galleryImageKeys : undefined,
//       };
//       // Remove endDate if empty
//       if (!payload.endDate) delete payload.endDate;
//       await onSave(payload);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const isEditing = !!initialData;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="w-[95%] sm:max-w-3xl max-h-[90vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle>
//             {isEditing ? "Edit Project" : "Create New Project"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex-1 overflow-y-auto p-2">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Project Name */}
//             <div className="col-span-2 space-y-1.5">
//               <Label>
//                 Project Name <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 value={form.name}
//                 onChange={(e) => setField("name", e.target.value)}
//                 placeholder="Sky Tower Construction"
//               />
//             </div>

//             {/* Status + Priority */}
//             <div className="space-y-1.5">
//               <Label>Status</Label>
//               <Select
//                 value={form.status}
//                 onValueChange={(v) => setField("status", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {STATUS_OPTIONS.map((o) => (
//                     <SelectItem key={o.value} value={o.value}>
//                       {o.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-1.5">
//               <Label>Priority</Label>
//               <Select
//                 value={form.priority}
//                 onValueChange={(v) => setField("priority", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {PRIORITY_OPTIONS.map((o) => (
//                     <SelectItem key={o.value} value={o.value}>
//                       {o.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Location */}
//             <div className="space-y-1.5">
//               <Label>Location (City/Area)</Label>
//               <Input
//                 value={form.location}
//                 onChange={(e) => setField("location", e.target.value)}
//                 placeholder="Mumbai, Maharashtra"
//               />
//             </div>

//             {/* Dates */}
//             <div className="space-y-1.5">
//               <Label>Start Date</Label>
//               <Input
//                 type="date"
//                 value={form.startDate}
//                 onChange={(e) => setField("startDate", e.target.value)}
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label>End Date (optional)</Label>
//               <Input
//                 type="date"
//                 value={form.endDate}
//                 onChange={(e) => setField("endDate", e.target.value)}
//               />
//             </div>

//             {/* Budget */}
//             <div className="space-y-1.5">
//               <Label>Budget (₹)</Label>
//               <Input
//                 type="number"
//                 value={form.budget}
//                 onChange={(e) => setField("budget", e.target.value)}
//                 placeholder="10000000"
//               />
//             </div>

//             {/* Detailed Address */}
//             <div className="col-span-2">
//               <p className="text-sm font-medium text-muted-foreground mb-2">
//                 Address Details
//               </p>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="col-span-2">
//                   <Label>Street / Building</Label>
//                   <Input
//                     value={form.address.street}
//                     onChange={(e) => setAddressField("street", e.target.value)}
//                     placeholder="MG Road, Andheri East"
//                   />
//                 </div>
//                 <div>
//                   <Label>City</Label>
//                   <Input
//                     value={form.address.city}
//                     onChange={(e) => setAddressField("city", e.target.value)}
//                     placeholder="Mumbai"
//                   />
//                 </div>
//                 <div>
//                   <Label>State</Label>
//                   <Input
//                     value={form.address.state}
//                     onChange={(e) => setAddressField("state", e.target.value)}
//                     placeholder="Maharashtra"
//                   />
//                 </div>
//                 <div>
//                   <Label>Pincode</Label>
//                   <Input
//                     value={form.address.pincode}
//                     onChange={(e) => setAddressField("pincode", e.target.value)}
//                     placeholder="400069"
//                   />
//                 </div>
//                 <div>
//                   <Label>Country</Label>
//                   <Input
//                     value={form.address.country}
//                     onChange={(e) => setAddressField("country", e.target.value)}
//                     placeholder="India"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* 🆕 Image Upload */}
//             <ImageUploadSection
//               coverImage={coverImage}
//               setCoverImage={setCoverImage}
//               coverImageKey={coverImageKey}
//               setCoverImageKey={setCoverImageKey}
//               galleryImages={galleryImages}
//               setGalleryImages={setGalleryImages}
//               galleryImageKeys={galleryImageKeys}
//               setGalleryImageKeys={setGalleryImageKeys}
//               uploading={uploading}
//               setUploading={setUploading}
//               projectId={initialData?._id || ""}
//             />

//             {/* Towers Management */}
//             <div className="col-span-2">
//               <TowersManager
//                 towers={form.towers}
//                 setTowers={(towers) => setField("towers", towers)}
//               />
//             </div>

//             {/* Description */}
//             <div className="col-span-2 space-y-1.5">
//               <Label>Description</Label>
//               <Textarea
//                 rows={3}
//                 value={form.description}
//                 onChange={(e) => setField("description", e.target.value)}
//                 placeholder="Brief description of the project…"
//               />
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             disabled={saving}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={saving || !form.name?.trim()}
//           >
//             {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
//             {isEditing ? "Save Changes" : "Create Project"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }





// // src/components/project/ProjectForm.jsx
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2, Plus, Trash2, Edit, X, Image as ImageIcon } from "lucide-react";
// import { formatINR } from "@/lib/helpers";
// import { Card, CardContent } from "@/components/ui/card";
// import { toast } from "sonner";
// import { authApi } from "@/api";

// const STATUS_OPTIONS = [
//   { value: "planning", label: "Planning" },
//   { value: "in_progress", label: "In Progress" },
//   { value: "delayed", label: "Delayed" },
//   { value: "completed", label: "Completed" },
//   { value: "on_hold", label: "On Hold" },
// ];

// const PRIORITY_OPTIONS = [
//   { value: "low", label: "Low" },
//   { value: "medium", label: "Medium" },
//   { value: "high", label: "High" },
// ];

// const FACING_OPTIONS = [
//   { value: "East", label: "East" },
//   { value: "West", label: "West" },
//   { value: "North", label: "North" },
//   { value: "South", label: "South" },
// ];

// const FURNISHED_OPTIONS = [
//   { value: "unfurnished", label: "Unfurnished" },
//   { value: "semi-furnished", label: "Semi-Furnished" },
//   { value: "fully-furnished", label: "Fully Furnished" },
// ];

// const EMPTY_FLAT = {
//   flatNumber: "",
//   area: "",
//   bedrooms: "",
//   bathrooms: "",
//   price: "",
//   facing: "",
//   parking: false,
//   balcony: false,
//   furnished: "unfurnished",
//   typeOfBooking: "",
//   agreementStatus: "",
//   agreementDate: "",
//   cancelled: false,
// };

// const EMPTY_ADDRESS = {
//   street: "",
//   city: "",
//   state: "",
//   pincode: "",
//   country: "India",
// };

// const EMPTY_PROJECT = {
//   name: "",
//   description: "",
//   location: "",
//   startDate: "",
//   endDate: "",
//   budget: "",
//   status: "planning",
//   priority: "medium",
//   address: { ...EMPTY_ADDRESS },
//   towers: [],
// };

// // ---------- Helper: Upload Function ----------
// // Isko alag se define kiya taaki handleSubmit mein easily use ho sake
// const uploadImageToCloud = async (file, fileType) => {
//   // 1. Get Presigned URL (associatedId hata diya gaya hai)
//   const presignRes = await authApi.getPresignedUrl({
//     fileName: file.name,
//     fileType: fileType,
//     mimeType: file.type,
//   });
  
//   const { url, key } = presignRes.data;
  
//   // 2. Upload to S3 via PUT request
//   await fetch(url, {
//     method: 'PUT',
//     body: file,
//     headers: { 'Content-Type': file.type },
//   });
  
//   // 3. Confirm Upload
//   await authApi.confirmUpload({ fileKey: key, fileType: fileType });
  
//   return key;
// };

// // ---------- Flat Editor Dialog ----------
// function FlatFormDialog({ open, onOpenChange, flat, onSave }) {
//   const [form, setForm] = useState(flat || { ...EMPTY_FLAT });

//   useEffect(() => {
//     if (open) {
//       setForm(flat || { ...EMPTY_FLAT });
//     }
//   }, [open, flat]);

//   const handleSave = () => {
//     if (!form.flatNumber) return;
//     onSave({
//       ...form,
//       area: Number(form.area) || 0,
//       bedrooms: Number(form.bedrooms) || 0,
//       bathrooms: Number(form.bathrooms) || 0,
//       price: Number(form.price) || 0,
//       typeOfBooking: form.typeOfBooking || undefined,
//       agreementStatus: form.agreementStatus || undefined,
//       agreementDate: form.agreementDate || undefined,
//       cancelled: form.cancelled || false,
//     });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>{flat ? "Edit Flat" : "Add Flat"}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-3 max-h-[60vh] overflow-y-auto">
//           <div className="grid grid-cols-2 gap-2 p-1">
//             <div>
//               <Label>Flat Number *</Label>
//               <Input
//                 value={form.flatNumber}
//                 onChange={(e) =>
//                   setForm({ ...form, flatNumber: e.target.value })
//                 }
//                 placeholder="101"
//               />
//             </div>
//             <div>
//               <Label>Area (sq ft)</Label>
//               <Input
//                 type="number"
//                 value={form.area}
//                 onChange={(e) => setForm({ ...form, area: e.target.value })}
//                 placeholder="650"
//               />
//             </div>
//             <div>
//               <Label>Bedrooms</Label>
//               <Input
//                 type="number"
//                 value={form.bedrooms}
//                 onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
//                 placeholder="1-5"
//               />
//             </div>
//             <div>
//               <Label>Bathrooms</Label>
//               <Input
//                 type="number"
//                 value={form.bathrooms}
//                 onChange={(e) =>
//                   setForm({ ...form, bathrooms: e.target.value })
//                 }
//                 placeholder="1"
//               />
//             </div>
//             <div>
//               <Label>Price (₹)</Label>
//               <Input
//                 type="number"
//                 value={form.price}
//                 onChange={(e) => setForm({ ...form, price: e.target.value })}
//                 placeholder="4500000"
//               />
//             </div>
//             <div>
//               <Label>Facing</Label>
//               <Select
//                 value={form.facing}
//                 onValueChange={(v) => setForm({ ...form, facing: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {FACING_OPTIONS.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Furnished</Label>
//               <Select
//                 value={form.furnished}
//                 onValueChange={(v) => setForm({ ...form, furnished: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {FURNISHED_OPTIONS.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="flex items-center gap-4 col-span-2">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.parking}
//                   onChange={(e) =>
//                     setForm({ ...form, parking: e.target.checked })
//                   }
//                 />
//                 Parking
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={form.balcony}
//                   onChange={(e) =>
//                     setForm({ ...form, balcony: e.target.checked })
//                   }
//                 />
//                 Balcony
//               </label>
//             </div>

//             <div className="col-span-2 border-t pt-3 mt-2">
//               <Label className="text-xs text-muted-foreground mb-2 block">
//                 Booking & Agreement Details (Optional)
//               </Label>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <Label>Type of Booking</Label>
//                   <Select
//                     value={form.typeOfBooking}
//                     onValueChange={(v) =>
//                       setForm({ ...form, typeOfBooking: v })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="CLP">CLP</SelectItem>
//                       <SelectItem value="ONE_TIME">ONE TIME</SelectItem>
//                       <SelectItem value="OTP">OTP</SelectItem>
//                       <SelectItem value="RENTAL">RENTAL</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Agreement Status</Label>
//                   <Select
//                     value={form.agreementStatus}
//                     onValueChange={(v) =>
//                       setForm({ ...form, agreementStatus: v })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="REGISTERED">REGISTERED</SelectItem>
//                       <SelectItem value="CANCELLED">CANCELLED</SelectItem>
//                       <SelectItem value="PENDING">PENDING</SelectItem>
//                       <SelectItem value="APPROVED">APPROVED</SelectItem>
//                       <SelectItem value="REJECTED">REJECTED</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Agreement Date</Label>
//                   <Input
//                     type="date"
//                     value={form.agreementDate}
//                     onChange={(e) =>
//                       setForm({ ...form, agreementDate: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="flex items-center">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={form.cancelled}
//                       onChange={(e) =>
//                         setForm({ ...form, cancelled: e.target.checked })
//                       }
//                     />
//                     Cancelled
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>
//             {flat ? "Update Flat" : "Add Flat"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ---------- Tower Editor Dialog ----------
// function TowerEditorDialog({ open, onOpenChange, tower, onSave }) {
//   const [towerName, setTowerName] = useState("");
//   const [floors, setFloors] = useState([]);
//   const [flatDialogOpen, setFlatDialogOpen] = useState(false);
//   const [editingFlat, setEditingFlat] = useState(null);
//   const [currentFloorIdx, setCurrentFloorIdx] = useState(null);

//   useEffect(() => {
//     if (open) {
//       if (tower) {
//         setTowerName(tower.towerName || "");
//         setFloors(tower.floors ? [...tower.floors] : []);
//       } else {
//         setTowerName("");
//         setFloors([]);
//       }
//     }
//   }, [open, tower]);

//   const addFloor = () => {
//     let nextNumber;
//     if (floors.length === 0) {
//       nextNumber = "Ground";
//     } else {
//       const last = floors[floors.length - 1].floorNumber;
//       if (last === "Ground") {
//         nextNumber = "1";
//       } else if (!isNaN(Number(last))) {
//         nextNumber = String(Number(last) + 1);
//       } else {
//         nextNumber = String(floors.length + 1);
//       }
//     }
//     setFloors([...floors, { floorNumber: nextNumber, flats: [] }]);
//   };

//   const updateFloorNumber = (idx, value) => {
//     const updated = floors.map((f, i) =>
//       i === idx ? { ...f, floorNumber: value } : f,
//     );
//     setFloors(updated);
//   };

//   const deleteFloor = (idx) => setFloors(floors.filter((_, i) => i !== idx));

//   const openAddFlat = (floorIdx) => {
//     setEditingFlat(null);
//     setCurrentFloorIdx(floorIdx);
//     setFlatDialogOpen(true);
//   };

//   const openEditFlat = (floorIdx, flatIdx) => {
//     setEditingFlat(floors[floorIdx].flats[flatIdx]);
//     setCurrentFloorIdx(floorIdx);
//     setFlatDialogOpen(true);
//   };

//   const handleSaveFlat = (flatData) => {
//     if (currentFloorIdx === null) return;
//     const updatedFloors = floors.map((floor, idx) => {
//       if (idx === currentFloorIdx) {
//         let updatedFlats;
//         if (editingFlat) {
//           updatedFlats = floor.flats.map((f, fi) =>
//             fi === floor.flats.indexOf(editingFlat) ? flatData : f,
//           );
//         } else {
//           updatedFlats = [...floor.flats, flatData];
//         }
//         return { ...floor, flats: updatedFlats };
//       }
//       return floor;
//     });
//     setFloors(updatedFloors);
//     setFlatDialogOpen(false);
//   };

//   const deleteFlat = (floorIdx, flatIdx) => {
//     const updatedFloors = floors.map((floor, idx) => {
//       if (idx === floorIdx) {
//         return {
//           ...floor,
//           flats: floor.flats.filter((_, fi) => fi !== flatIdx),
//         };
//       }
//       return floor;
//     });
//     setFloors(updatedFloors);
//   };

//   const handleSubmit = () => {
//     if (!towerName.trim()) return;
//     onSave({ towerName: towerName.trim(), floors });
//     onOpenChange(false);
//   };

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
//           <DialogHeader>
//             <DialogTitle>{tower ? "Edit Tower" : "Add Tower"}</DialogTitle>
//           </DialogHeader>
//           <div className="flex-1 overflow-y-auto space-y-4 p-2">
//             <div>
//               <Label>Tower Name *</Label>
//               <Input
//                 value={towerName}
//                 onChange={(e) => setTowerName(e.target.value)}
//                 placeholder="Tower A"
//               />
//             </div>

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <Label>Floors</Label>
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={addFloor}
//                 >
//                   <Plus className="h-3 w-3 mr-1" /> Add Floor
//                 </Button>
//               </div>
//               {floors?.length === 0 ? (
//                 <p className="text-sm text-muted-foreground">
//                   No floors added.
//                 </p>
//               ) : (
//                 floors?.map((floor, floorIdx) => (
//                   <Card key={floorIdx}>
//                     <CardContent className="p-3 space-y-2">
//                       <div className="flex justify-between items-center">
//                         <Label className="text-xs">Floor #</Label>
//                         <Input
//                           value={floor.floorNumber}
//                           onChange={(e) =>
//                             updateFloorNumber(floorIdx, e.target.value)
//                           }
//                           className="h-7 w-24"
//                           placeholder="e.g. Ground"
//                         />
//                         <div className="flex-1" />
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => deleteFloor(floorIdx)}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>

//                       <div className="ml-2 space-y-1">
//                         {floor.flats?.length === 0 ? (
//                           <p className="text-xs text-muted-foreground">
//                             No flats
//                           </p>
//                         ) : (
//                           floor.flats?.map((flat, flatIdx) => (
//                             <div
//                               key={flatIdx}
//                               className="flex items-center justify-between p-2 bg-muted/40 rounded"
//                             >
//                               <div>
//                                 <span className="text-sm font-medium">
//                                   {flat.flatNumber}
//                                 </span>
//                                 <span className="text-xs text-muted-foreground ml-2">
//                                   {flat.bedrooms} BHK · {flat.area} sqft ·{" "}
//                                   {formatINR(flat.price)}
//                                 </span>
//                                 {flat.cancelled && (
//                                   <span className="text-xs text-red-500 ml-2">
//                                     (Cancelled)
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="flex gap-1">
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="icon"
//                                   onClick={() =>
//                                     openEditFlat(floorIdx, flatIdx)
//                                   }
//                                 >
//                                   <Edit className="h-3 w-3" />
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="icon"
//                                   onClick={() => deleteFlat(floorIdx, flatIdx)}
//                                 >
//                                   <Trash2 className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </div>
//                           ))
//                         )}
//                       </div>

//                       <Button
//                         type="button"
//                         variant="link"
//                         size="sm"
//                         onClick={() => openAddFlat(floorIdx)}
//                         className="p-0 h-auto text-xs"
//                       >
//                         <Plus className="h-3 w-3 mr-1" /> Add Flat
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} disabled={!towerName.trim()}>
//               Save Tower
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <FlatFormDialog
//         open={flatDialogOpen}
//         onOpenChange={setFlatDialogOpen}
//         flat={editingFlat}
//         onSave={handleSaveFlat}
//       />
//     </>
//   );
// }

// // ---------- Towers Manager ----------
// function TowersManager({ towers, setTowers }) {
//   const [towerDialogOpen, setTowerDialogOpen] = useState(false);
//   const [editingTower, setEditingTower] = useState(null);

//   const openAddTower = () => {
//     setEditingTower(null);
//     setTowerDialogOpen(true);
//   };

//   const openEditTower = (index) => {
//     setEditingTower(towers[index]);
//     setTowerDialogOpen(true);
//   };

//   const handleSaveTower = (towerData) => {
//     if (editingTower) {
//       const updated = towers.map((t, i) =>
//         i === towers.indexOf(editingTower) ? towerData : t,
//       );
//       setTowers(updated);
//     } else {
//       setTowers([...towers, towerData]);
//     }
//   };

//   const deleteTower = (index) => {
//     setTowers(towers.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-3">
//       <div className="flex justify-between items-center">
//         <Label>Towers</Label>
//         <Button
//           type="button"
//           size="sm"
//           variant="outline"
//           onClick={openAddTower}
//         >
//           <Plus className="h-3 w-3 mr-1" /> Add Tower
//         </Button>
//       </div>
//       {towers?.length === 0 ? (
//         <p className="text-sm text-muted-foreground">No towers added yet.</p>
//       ) : (
//         <div className="space-y-2 max-h-80 overflow-y-auto">
//           {towers.map((tower, idx) => {
//             const totalFlats = tower.floors.reduce(
//               (sum, f) => sum + f.flats?.length,
//               0,
//             );
//             return (
//               <Card key={idx}>
//                 <CardContent className="p-3">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-medium">{tower.towerName}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {tower.floors?.length} Floor
//                         {tower.floors?.length !== 1 && "s"} · {totalFlats} Flat
//                         {totalFlats !== 1 && "s"}
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => openEditTower(idx)}
//                       >
//                         <Edit className="h-3 w-3" />
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => deleteTower(idx)}
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       <TowerEditorDialog
//         open={towerDialogOpen}
//         onOpenChange={setTowerDialogOpen}
//         tower={editingTower}
//         onSave={handleSaveTower}
//       />
//     </div>
//   );
// }

// // ---------- Offline Image Upload Section ----------
// // Ye section ab sirf files ko state me preview ke liye rakhega
// function ImageUploadSection({
//   coverPreview,
//   onCoverSelect,
//   onCoverRemove,
//   existingGalleryImages,
//   onExistingGalleryRemove,
//   newGalleryPreviews,
//   onNewGallerySelect,
//   onNewGalleryRemove,
// }) {
//   return (
//     <div className="col-span-2 border-t pt-4 mt-2">
//       <Label className="text-sm font-semibold">Project Images</Label>
//       <p className="text-xs text-muted-foreground mb-3">
//         Images will be uploaded to the server when you save the project.
//       </p>

//       {/* Cover Image */}
//       <div className="mb-4">
//         <Label>Cover Image</Label>
//         <div className="flex items-center gap-4 mt-1">
//           {coverPreview ? (
//             <div className="relative w-32 h-24 rounded border overflow-hidden">
//               <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
//               <button
//                 type="button"
//                 className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
//                 onClick={onCoverRemove}
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ) : (
//             <label className="cursor-pointer border-2 border-dashed rounded p-4 text-center hover:bg-muted/50 transition w-32 h-24 flex flex-col items-center justify-center">
//               <Plus className="h-6 w-6 text-muted-foreground" />
//               <span className="text-xs text-muted-foreground mt-1">Select</span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={onCoverSelect}
//               />
//             </label>
//           )}
//         </div>
//       </div>

//       {/* Gallery Images */}
//       <div>
//         <Label>Gallery Images</Label>
//         <div className="flex flex-wrap gap-3 mt-1">
          
//           {/* Display Existing Uploaded Images */}
//           {existingGalleryImages.map((imgUrl, idx) => (
//             <div key={`existing-${idx}`} className="relative w-24 h-20 rounded border overflow-hidden">
//               <img src={imgUrl} alt={`Gallery Existing ${idx}`} className="w-full h-full object-cover" />
//               <button
//                 type="button"
//                 className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
//                 onClick={() => onExistingGalleryRemove(idx)}
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ))}

//           {/* Display New Selected Previews */}
//           {newGalleryPreviews.map((preview, idx) => (
//             <div key={`new-${idx}`} className="relative w-24 h-20 rounded border border-blue-400 overflow-hidden ring-1 ring-blue-400">
//               <img src={preview} alt={`Gallery New ${idx}`} className="w-full h-full object-cover opacity-90" />
//               <div className="absolute bottom-0 w-full bg-blue-500/80 text-[10px] text-white text-center py-0.5">
//                 New
//               </div>
//               <button
//                 type="button"
//                 className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
//                 onClick={() => onNewGalleryRemove(idx)}
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </div>
//           ))}

//           {/* Upload Button */}
//           <label className="cursor-pointer border-2 border-dashed rounded p-3 text-center hover:bg-muted/50 transition w-24 h-20 flex flex-col items-center justify-center">
//             <Plus className="h-5 w-5 text-muted-foreground" />
//             <span className="text-xs text-muted-foreground mt-1">Add</span>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={onNewGallerySelect}
//             />
//           </label>
//         </div>
//         <p className="text-xs text-muted-foreground mt-2">
//           {existingGalleryImages.length + newGalleryPreviews.length} image(s) selected
//         </p>
//       </div>
//     </div>
//   );
// }

// // ---------- Main Project Form ----------
// export function ProjectForm({ open, onOpenChange, initialData, onSave }) {
//   const [form, setForm] = useState(EMPTY_PROJECT);
//   const [saving, setSaving] = useState(false);

//   // States for Image Handling
//   const [coverPreview, setCoverPreview] = useState(null);
//   const [coverFile, setCoverFile] = useState(null); // Actual file to upload
//   const [coverKey, setCoverKey] = useState(""); // Existing Key for DB
  
//   const [existingGalleryImages, setExistingGalleryImages] = useState([]); // URLs from DB
//   const [existingGalleryKeys, setExistingGalleryKeys] = useState([]); // Keys from DB
  
//   const [newGalleryFiles, setNewGalleryFiles] = useState([]); // Actual new files
//   const [newGalleryPreviews, setNewGalleryPreviews] = useState([]); // ObjectURLs for UI

//   useEffect(() => {
//     if (open) {
//       if (initialData) {
//         setForm({
//           name: initialData.name ?? "",
//           description: initialData.description ?? "",
//           location: initialData.location ?? "",
//           startDate: initialData.startDate
//             ? initialData.startDate.slice(0, 10)
//             : "",
//           endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
//           budget: initialData.budget ?? "",
//           status: initialData.status ?? "planning",
//           priority: initialData.priority ?? "medium",
//           address: {
//             street: initialData.address?.street ?? "",
//             city: initialData.address?.city ?? "",
//             state: initialData.address?.state ?? "",
//             pincode: initialData.address?.pincode ?? "",
//             country: initialData.address?.country ?? "India",
//           },
//           towers: initialData.towers ?? [],
//         });
        
//         // Initialize existing images
//         setCoverPreview(initialData.coverImage || null);
//         setCoverKey(initialData.coverImageKey || "");
        
//         setExistingGalleryImages(initialData.galleryImages || []);
//         setExistingGalleryKeys(initialData.galleryImageKeys || []);
//       } else {
//         setForm({ ...EMPTY_PROJECT, towers: [] });
//         setCoverPreview(null);
//         setCoverKey("");
//         setExistingGalleryImages([]);
//         setExistingGalleryKeys([]);
//       }
      
//       // Reset new files states
//       setCoverFile(null);
//       setNewGalleryFiles([]);
//       setNewGalleryPreviews([]);
//     }
//   }, [open, initialData]);

//   const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
//   const setAddressField = (key, val) =>
//     setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));

//   // Handlers for Cover Image
//   const handleCoverSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setCoverFile(file);
//     setCoverPreview(URL.createObjectURL(file));
//     setCoverKey(""); // clear existing key since we're replacing it
//     e.target.value = null; // reset input
//   };
  
//   const handleCoverRemove = () => {
//     setCoverPreview(null);
//     setCoverFile(null);
//     setCoverKey("");
//   };

//   // Handlers for Gallery Images
//   const handleNewGallerySelect = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;
    
//     setNewGalleryFiles((prev) => [...prev, ...files]);
//     setNewGalleryPreviews((prev) => [
//       ...prev,
//       ...files.map((f) => URL.createObjectURL(f)),
//     ]);
//     e.target.value = null; // reset input
//   };

//   const handleExistingGalleryRemove = (index) => {
//     setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
//     setExistingGalleryKeys((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleNewGalleryRemove = (index) => {
//     setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
//     setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Submit Handler -> Yaha par final S3 upload trigger hoga
//   const handleSubmit = async () => {
//     if (!form.name?.trim()) return;
//     setSaving(true);
    
//     try {
//       let finalCoverKey = coverKey;
//       let finalGalleryKeys = [...existingGalleryKeys];
      
//       const pId = initialData?._id || "temp";

//       // 1. Upload Cover Image if a new file is selected
//       if (coverFile) {
//         finalCoverKey = await uploadImageToCloud(coverFile, "project", pId);
//       }

//       // 2. Upload ALL New Gallery Images in Parallel
//       if (newGalleryFiles.length > 0) {
//         const uploadPromises = newGalleryFiles.map((file) =>
//           uploadImageToCloud(file, "project", pId)
//         );
//         const newKeys = await Promise.all(uploadPromises);
//         finalGalleryKeys = [...finalGalleryKeys, ...newKeys];
//       }

//       // 3. Prepare Final Payload
//       const payload = {
//         ...form,
//         budget: Number(form.budget) || 0,
//         coverImageKey: finalCoverKey || undefined,
//         galleryImageKeys: finalGalleryKeys.length > 0 ? finalGalleryKeys : undefined,
//       };
      
//       if (!payload.endDate) delete payload.endDate;
      
//       // 4. Save to Database
//       await onSave(payload);
      
//     } catch (error) {
//       console.error("Upload Error: ", error);
//       toast.error("File upload failed. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const isEditing = !!initialData;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="w-[95%] sm:max-w-3xl max-h-[90vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle>
//             {isEditing ? "Edit Project" : "Create New Project"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex-1 overflow-y-auto p-2">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Project Name */}
//             <div className="col-span-2 space-y-1.5">
//               <Label>
//                 Project Name <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 value={form.name}
//                 onChange={(e) => setField("name", e.target.value)}
//                 placeholder="Sky Tower Construction"
//               />
//             </div>

//             {/* Status + Priority */}
//             <div className="space-y-1.5">
//               <Label>Status</Label>
//               <Select
//                 value={form.status}
//                 onValueChange={(v) => setField("status", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {STATUS_OPTIONS.map((o) => (
//                     <SelectItem key={o.value} value={o.value}>
//                       {o.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-1.5">
//               <Label>Priority</Label>
//               <Select
//                 value={form.priority}
//                 onValueChange={(v) => setField("priority", v)}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {PRIORITY_OPTIONS.map((o) => (
//                     <SelectItem key={o.value} value={o.value}>
//                       {o.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Location */}
//             <div className="space-y-1.5">
//               <Label>Location (City/Area)</Label>
//               <Input
//                 value={form.location}
//                 onChange={(e) => setField("location", e.target.value)}
//                 placeholder="Mumbai, Maharashtra"
//               />
//             </div>

//             {/* Dates */}
//             <div className="space-y-1.5">
//               <Label>Start Date</Label>
//               <Input
//                 type="date"
//                 value={form.startDate}
//                 onChange={(e) => setField("startDate", e.target.value)}
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label>End Date (optional)</Label>
//               <Input
//                 type="date"
//                 value={form.endDate}
//                 onChange={(e) => setField("endDate", e.target.value)}
//               />
//             </div>

//             {/* Budget */}
//             <div className="space-y-1.5">
//               <Label>Budget (₹)</Label>
//               <Input
//                 type="number"
//                 value={form.budget}
//                 onChange={(e) => setField("budget", e.target.value)}
//                 placeholder="10000000"
//               />
//             </div>

//             {/* Detailed Address */}
//             <div className="col-span-2">
//               <p className="text-sm font-medium text-muted-foreground mb-2">
//                 Address Details
//               </p>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="col-span-2">
//                   <Label>Street / Building</Label>
//                   <Input
//                     value={form.address.street}
//                     onChange={(e) => setAddressField("street", e.target.value)}
//                     placeholder="MG Road, Andheri East"
//                   />
//                 </div>
//                 <div>
//                   <Label>City</Label>
//                   <Input
//                     value={form.address.city}
//                     onChange={(e) => setAddressField("city", e.target.value)}
//                     placeholder="Mumbai"
//                   />
//                 </div>
//                 <div>
//                   <Label>State</Label>
//                   <Input
//                     value={form.address.state}
//                     onChange={(e) => setAddressField("state", e.target.value)}
//                     placeholder="Maharashtra"
//                   />
//                 </div>
//                 <div>
//                   <Label>Pincode</Label>
//                   <Input
//                     value={form.address.pincode}
//                     onChange={(e) => setAddressField("pincode", e.target.value)}
//                     placeholder="400069"
//                   />
//                 </div>
//                 <div>
//                   <Label>Country</Label>
//                   <Input
//                     value={form.address.country}
//                     onChange={(e) => setAddressField("country", e.target.value)}
//                     placeholder="India"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Offline Image Upload */}
//             <ImageUploadSection
//               coverPreview={coverPreview}
//               onCoverSelect={handleCoverSelect}
//               onCoverRemove={handleCoverRemove}
//               existingGalleryImages={existingGalleryImages}
//               onExistingGalleryRemove={handleExistingGalleryRemove}
//               newGalleryPreviews={newGalleryPreviews}
//               onNewGallerySelect={handleNewGallerySelect}
//               onNewGalleryRemove={handleNewGalleryRemove}
//             />

//             {/* Towers Management */}
//             <div className="col-span-2">
//               <TowersManager
//                 towers={form.towers}
//                 setTowers={(towers) => setField("towers", towers)}
//               />
//             </div>

//             {/* Description */}
//             <div className="col-span-2 space-y-1.5">
//               <Label>Description</Label>
//               <Textarea
//                 rows={3}
//                 value={form.description}
//                 onChange={(e) => setField("description", e.target.value)}
//                 placeholder="Brief description of the project…"
//               />
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             disabled={saving}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={saving || !form.name?.trim()}
//           >
//             {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
//             {isEditing ? "Save Changes" : "Create Project"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }




// src/components/project/ProjectForm.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Plus, Trash2, Edit, X, Image as ImageIcon } from "lucide-react";
import { formatINR } from "@/lib/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { authApi } from "@/api";

const STATUS_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "in_progress", label: "In Progress" },
  { value: "delayed", label: "Delayed" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const FACING_OPTIONS = [
  { value: "East", label: "East" },
  { value: "West", label: "West" },
  { value: "North", label: "North" },
  { value: "South", label: "South" },
];

const FURNISHED_OPTIONS = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
  { value: "fully-furnished", label: "Fully Furnished" },
];

const EMPTY_FLAT = {
  flatNumber: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  price: "",
  facing: "",
  parking: false,
  balcony: false,
  furnished: "unfurnished",
  typeOfBooking: "",
  agreementStatus: "",
  agreementDate: "",
  cancelled: false,
};

const EMPTY_ADDRESS = {
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const EMPTY_PROJECT = {
  name: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  budget: "",
  status: "planning",
  priority: "medium",
  address: { ...EMPTY_ADDRESS },
  towers: [],
};

// ---------- Helper: Upload Function ----------
// Isko alag se define kiya taaki handleSubmit mein easily use ho sake
const uploadImageToCloud = async (file, fileType) => {
  // 1. Get Presigned URL (associatedId hata diya gaya hai)
  const presignRes = await authApi.getPresignedUrl({
    fileName: file.name,
    fileType: fileType,
    mimeType: file.type,
  });
  
  const { url, key } = presignRes.data;
  
  // 2. Upload to S3 via PUT request
  await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  
  // 3. Confirm Upload
  await authApi.confirmUpload({ fileKey: key, fileType: fileType });
  
  return key;
};

// ---------- Flat Editor Dialog ----------
function FlatFormDialog({ open, onOpenChange, flat, onSave }) {
  const [form, setForm] = useState(flat || { ...EMPTY_FLAT });

  useEffect(() => {
    if (open) {
      setForm(flat || { ...EMPTY_FLAT });
    }
  }, [open, flat]);

  const handleSave = () => {
    if (!form.flatNumber) return;
    onSave({
      ...form,
      area: Number(form.area) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      price: Number(form.price) || 0,
      typeOfBooking: form.typeOfBooking || undefined,
      agreementStatus: form.agreementStatus || undefined,
      agreementDate: form.agreementDate || undefined,
      cancelled: form.cancelled || false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{flat ? "Edit Flat" : "Add Flat"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 p-1">
            <div>
              <Label>Flat Number *</Label>
              <Input
                value={form.flatNumber}
                onChange={(e) =>
                  setForm({ ...form, flatNumber: e.target.value })
                }
                placeholder="101"
              />
            </div>
            <div>
              <Label>Area (sq ft)</Label>
              <Input
                type="number"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="650"
              />
            </div>
            <div>
              <Label>Bedrooms</Label>
              <Input
                type="number"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                placeholder="1-5"
              />
            </div>
            <div>
              <Label>Bathrooms</Label>
              <Input
                type="number"
                value={form.bathrooms}
                onChange={(e) =>
                  setForm({ ...form, bathrooms: e.target.value })
                }
                placeholder="1"
              />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="4500000"
              />
            </div>
            <div>
              <Label>Facing</Label>
              <Select
                value={form.facing}
                onValueChange={(v) => setForm({ ...form, facing: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {FACING_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Furnished</Label>
              <Select
                value={form.furnished}
                onValueChange={(v) => setForm({ ...form, furnished: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {FURNISHED_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.parking}
                  onChange={(e) =>
                    setForm({ ...form, parking: e.target.checked })
                  }
                />
                Parking
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.balcony}
                  onChange={(e) =>
                    setForm({ ...form, balcony: e.target.checked })
                  }
                />
                Balcony
              </label>
            </div>

            <div className="col-span-2 border-t pt-3 mt-2">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Booking & Agreement Details (Optional)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Type of Booking</Label>
                  <Select
                    value={form.typeOfBooking}
                    onValueChange={(v) =>
                      setForm({ ...form, typeOfBooking: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLP">CLP</SelectItem>
                      <SelectItem value="ONE_TIME">ONE TIME</SelectItem>
                      <SelectItem value="OTP">OTP</SelectItem>
                      <SelectItem value="RENTAL">RENTAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Agreement Status</Label>
                  <Select
                    value={form.agreementStatus}
                    onValueChange={(v) =>
                      setForm({ ...form, agreementStatus: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REGISTERED">REGISTERED</SelectItem>
                      <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="APPROVED">APPROVED</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Agreement Date</Label>
                  <Input
                    type="date"
                    value={form.agreementDate}
                    onChange={(e) =>
                      setForm({ ...form, agreementDate: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.cancelled}
                      onChange={(e) =>
                        setForm({ ...form, cancelled: e.target.checked })
                      }
                    />
                    Cancelled
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {flat ? "Update Flat" : "Add Flat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Tower Editor Dialog ----------
function TowerEditorDialog({ open, onOpenChange, tower, onSave }) {
  const [towerName, setTowerName] = useState("");
  const [floors, setFloors] = useState([]);
  const [flatDialogOpen, setFlatDialogOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState(null);
  const [currentFloorIdx, setCurrentFloorIdx] = useState(null);

  useEffect(() => {
    if (open) {
      if (tower) {
        setTowerName(tower.towerName || "");
        setFloors(tower.floors ? [...tower.floors] : []);
      } else {
        setTowerName("");
        setFloors([]);
      }
    }
  }, [open, tower]);

  const addFloor = () => {
    let nextNumber;
    if (floors.length === 0) {
      nextNumber = "Ground";
    } else {
      const last = floors[floors.length - 1].floorNumber;
      if (last === "Ground") {
        nextNumber = "1";
      } else if (!isNaN(Number(last))) {
        nextNumber = String(Number(last) + 1);
      } else {
        nextNumber = String(floors.length + 1);
      }
    }
    setFloors([...floors, { floorNumber: nextNumber, flats: [] }]);
  };

  const updateFloorNumber = (idx, value) => {
    const updated = floors.map((f, i) =>
      i === idx ? { ...f, floorNumber: value } : f,
    );
    setFloors(updated);
  };

  const deleteFloor = (idx) => setFloors(floors.filter((_, i) => i !== idx));

  const openAddFlat = (floorIdx) => {
    setEditingFlat(null);
    setCurrentFloorIdx(floorIdx);
    setFlatDialogOpen(true);
  };

  const openEditFlat = (floorIdx, flatIdx) => {
    setEditingFlat(floors[floorIdx].flats[flatIdx]);
    setCurrentFloorIdx(floorIdx);
    setFlatDialogOpen(true);
  };

  const handleSaveFlat = (flatData) => {
    if (currentFloorIdx === null) return;
    const updatedFloors = floors.map((floor, idx) => {
      if (idx === currentFloorIdx) {
        let updatedFlats;
        if (editingFlat) {
          updatedFlats = floor.flats.map((f, fi) =>
            fi === floor.flats.indexOf(editingFlat) ? flatData : f,
          );
        } else {
          updatedFlats = [...floor.flats, flatData];
        }
        return { ...floor, flats: updatedFlats };
      }
      return floor;
    });
    setFloors(updatedFloors);
    setFlatDialogOpen(false);
  };

  const deleteFlat = (floorIdx, flatIdx) => {
    const updatedFloors = floors.map((floor, idx) => {
      if (idx === floorIdx) {
        return {
          ...floor,
          flats: floor.flats.filter((_, fi) => fi !== flatIdx),
        };
      }
      return floor;
    });
    setFloors(updatedFloors);
  };

  const handleSubmit = () => {
    if (!towerName.trim()) return;
    onSave({ towerName: towerName.trim(), floors });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{tower ? "Edit Tower" : "Add Tower"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 p-2">
            <div>
              <Label>Tower Name *</Label>
              <Input
                value={towerName}
                onChange={(e) => setTowerName(e.target.value)}
                placeholder="Tower A"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Floors</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addFloor}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Floor
                </Button>
              </div>
              {floors?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No floors added.
                </p>
              ) : (
                floors?.map((floor, floorIdx) => (
                  <Card key={floorIdx}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Floor #</Label>
                        <Input
                          value={floor.floorNumber}
                          onChange={(e) =>
                            updateFloorNumber(floorIdx, e.target.value)
                          }
                          className="h-7 w-24"
                          placeholder="e.g. Ground"
                        />
                        <div className="flex-1" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFloor(floorIdx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="ml-2 space-y-1">
                        {floor.flats?.length === 0 ? (
                          <p className="text-xs text-muted-foreground">
                            No flats
                          </p>
                        ) : (
                          floor.flats?.map((flat, flatIdx) => (
                            <div
                              key={flatIdx}
                              className="flex items-center justify-between p-2 bg-muted/40 rounded"
                            >
                              <div>
                                <span className="text-sm font-medium">
                                  {flat.flatNumber}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {flat.bedrooms} BHK · {flat.area} sqft ·{" "}
                                  {formatINR(flat.price)}
                                </span>
                                {flat.cancelled && (
                                  <span className="text-xs text-red-500 ml-2">
                                    (Cancelled)
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    openEditFlat(floorIdx, flatIdx)
                                  }
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteFlat(floorIdx, flatIdx)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => openAddFlat(floorIdx)}
                        className="p-0 h-auto text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Flat
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!towerName.trim()}>
              Save Tower
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FlatFormDialog
        open={flatDialogOpen}
        onOpenChange={setFlatDialogOpen}
        flat={editingFlat}
        onSave={handleSaveFlat}
      />
    </>
  );
}

// ---------- Towers Manager ----------
function TowersManager({ towers, setTowers }) {
  const [towerDialogOpen, setTowerDialogOpen] = useState(false);
  const [editingTower, setEditingTower] = useState(null);

  const openAddTower = () => {
    setEditingTower(null);
    setTowerDialogOpen(true);
  };

  const openEditTower = (index) => {
    setEditingTower(towers[index]);
    setTowerDialogOpen(true);
  };

  const handleSaveTower = (towerData) => {
    if (editingTower) {
      const updated = towers.map((t, i) =>
        i === towers.indexOf(editingTower) ? towerData : t,
      );
      setTowers(updated);
    } else {
      setTowers([...towers, towerData]);
    }
  };

  const deleteTower = (index) => {
    setTowers(towers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Towers</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={openAddTower}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Tower
        </Button>
      </div>
      {towers?.length === 0 ? (
        <p className="text-sm text-muted-foreground">No towers added yet.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {towers.map((tower, idx) => {
            const totalFlats = tower.floors.reduce(
              (sum, f) => sum + f.flats?.length,
              0,
            );
            return (
              <Card key={idx}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{tower.towerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {tower.floors?.length} Floor
                        {tower.floors?.length !== 1 && "s"} · {totalFlats} Flat
                        {totalFlats !== 1 && "s"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditTower(idx)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTower(idx)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <TowerEditorDialog
        open={towerDialogOpen}
        onOpenChange={setTowerDialogOpen}
        tower={editingTower}
        onSave={handleSaveTower}
      />
    </div>
  );
}

// ---------- Offline Image Upload Section ----------
// Ye section ab sirf files ko state me preview ke liye rakhega
function ImageUploadSection({
  coverPreview,
  onCoverSelect,
  onCoverRemove,
  existingGalleryImages,
  onExistingGalleryRemove,
  newGalleryPreviews,
  onNewGallerySelect,
  onNewGalleryRemove,
}) {
  return (
    <div className="col-span-2 border-t pt-4 mt-2">
      <Label className="text-sm font-semibold">Project Images</Label>
      <p className="text-xs text-muted-foreground mb-3">
        Images will be uploaded to the server when you save the project.
      </p>

      {/* Cover Image */}
      <div className="mb-4">
        <Label>Cover Image</Label>
        <div className="flex items-center gap-4 mt-1">
          {coverPreview ? (
            <div className="relative w-32 h-24 rounded border overflow-hidden">
              <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
                onClick={onCoverRemove}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer border-2 border-dashed rounded p-4 text-center hover:bg-muted/50 transition w-32 h-24 flex flex-col items-center justify-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Select</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onCoverSelect}
              />
            </label>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <Label>Gallery Images</Label>
        <div className="flex flex-wrap gap-3 mt-1">
          
          {/* Display Existing Uploaded Images */}
          {existingGalleryImages.map((imgUrl, idx) => (
            <div key={`existing-${idx}`} className="relative w-24 h-20 rounded border overflow-hidden">
              <img src={imgUrl} alt={`Gallery Existing ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
                onClick={() => onExistingGalleryRemove(idx)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Display New Selected Previews */}
          {newGalleryPreviews.map((preview, idx) => (
            <div key={`new-${idx}`} className="relative w-24 h-20 rounded border border-blue-400 overflow-hidden ring-1 ring-blue-400">
              <img src={preview} alt={`Gallery New ${idx}`} className="w-full h-full object-cover opacity-90" />
              <div className="absolute bottom-0 w-full bg-blue-500/80 text-[10px] text-white text-center py-0.5">
                New
              </div>
              <button
                type="button"
                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
                onClick={() => onNewGalleryRemove(idx)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          <label className="cursor-pointer border-2 border-dashed rounded p-3 text-center hover:bg-muted/50 transition w-24 h-20 flex flex-col items-center justify-center">
            <Plus className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onNewGallerySelect}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {existingGalleryImages.length + newGalleryPreviews.length} image(s) selected
        </p>
      </div>
    </div>
  );
}

// ---------- Main Project Form ----------
export function ProjectForm({ open, onOpenChange, initialData, onSave }) {
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [saving, setSaving] = useState(false);

  // States for Image Handling
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null); // Actual file to upload
  const [coverKey, setCoverKey] = useState(""); // Existing Key for DB
  
  const [existingGalleryImages, setExistingGalleryImages] = useState([]); // URLs from DB
  const [existingGalleryKeys, setExistingGalleryKeys] = useState([]); // Keys from DB
  
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); // Actual new files
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]); // ObjectURLs for UI

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          name: initialData.name ?? "",
          description: initialData.description ?? "",
          location: initialData.location ?? "",
          startDate: initialData.startDate
            ? initialData.startDate.slice(0, 10)
            : "",
          endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
          budget: initialData.budget ?? "",
          status: initialData.status ?? "planning",
          priority: initialData.priority ?? "medium",
          address: {
            street: initialData.address?.street ?? "",
            city: initialData.address?.city ?? "",
            state: initialData.address?.state ?? "",
            pincode: initialData.address?.pincode ?? "",
            country: initialData.address?.country ?? "India",
          },
          towers: initialData.towers ?? [],
        });
        
        // Initialize existing images
        setCoverPreview(initialData.coverImage || null);
        setCoverKey(initialData.coverImageKey || "");
        
        setExistingGalleryImages(initialData.galleryImages || []);
        setExistingGalleryKeys(initialData.galleryImageKeys || []);
      } else {
        setForm({ ...EMPTY_PROJECT, towers: [] });
        setCoverPreview(null);
        setCoverKey("");
        setExistingGalleryImages([]);
        setExistingGalleryKeys([]);
      }
      
      // Reset new files states
      setCoverFile(null);
      setNewGalleryFiles([]);
      setNewGalleryPreviews([]);
    }
  }, [open, initialData]);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setAddressField = (key, val) =>
    setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));

  // Handlers for Cover Image
  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setCoverKey(""); // clear existing key since we're replacing it
    e.target.value = null; // reset input
  };
  
  const handleCoverRemove = () => {
    setCoverPreview(null);
    setCoverFile(null);
    setCoverKey("");
  };

  // Handlers for Gallery Images
  const handleNewGallerySelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setNewGalleryFiles((prev) => [...prev, ...files]);
    setNewGalleryPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = null; // reset input
  };

  const handleExistingGalleryRemove = (index) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setExistingGalleryKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewGalleryRemove = (index) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler -> Yaha par final S3 upload trigger hoga
  const handleSubmit = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    
    try {
      let finalCoverKey = coverKey;
      let finalGalleryKeys = [...existingGalleryKeys];

      // 1. Upload Cover Image if a new file is selected
      if (coverFile) {
        finalCoverKey = await uploadImageToCloud(coverFile, "project"); // pId hata diya yahan se
      }

      // 2. Upload ALL New Gallery Images in Parallel
      if (newGalleryFiles.length > 0) {
        const uploadPromises = newGalleryFiles.map((file) =>
          uploadImageToCloud(file, "project") // pId hata diya yahan se bhi
        );
        const newKeys = await Promise.all(uploadPromises);
        finalGalleryKeys = [...finalGalleryKeys, ...newKeys];
      }

      // 3. Prepare Final Payload
      const payload = {
        ...form,
        budget: Number(form.budget) || 0,
        coverImageKey: finalCoverKey || undefined,
        galleryImageKeys: finalGalleryKeys.length > 0 ? finalGalleryKeys : undefined,
      };
      
      if (!payload.endDate) delete payload.endDate;
      
      // 4. Save to Database
      await onSave(payload);
      
    } catch (error) {
      console.error("Upload Error: ", error);
      toast.error("File upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="col-span-2 space-y-1.5">
              <Label>
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Sky Tower Construction"
              />
            </div>

            {/* Status + Priority */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setField("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setField("priority", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label>Location (City/Area)</Label>
              <Input
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="Mumbai, Maharashtra"
              />
            </div>

            {/* Dates */}
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End Date (optional)</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
              />
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <Label>Budget (₹)</Label>
              <Input
                type="number"
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
                placeholder="10000000"
              />
            </div>

            {/* Detailed Address */}
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Address Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Street / Building</Label>
                  <Input
                    value={form.address.street}
                    onChange={(e) => setAddressField("street", e.target.value)}
                    placeholder="MG Road, Andheri East"
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={form.address.city}
                    onChange={(e) => setAddressField("city", e.target.value)}
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={form.address.state}
                    onChange={(e) => setAddressField("state", e.target.value)}
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input
                    value={form.address.pincode}
                    onChange={(e) => setAddressField("pincode", e.target.value)}
                    placeholder="400069"
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={form.address.country}
                    onChange={(e) => setAddressField("country", e.target.value)}
                    placeholder="India"
                  />
                </div>
              </div>
            </div>

            {/* Offline Image Upload */}
            <ImageUploadSection
              coverPreview={coverPreview}
              onCoverSelect={handleCoverSelect}
              onCoverRemove={handleCoverRemove}
              existingGalleryImages={existingGalleryImages}
              onExistingGalleryRemove={handleExistingGalleryRemove}
              newGalleryPreviews={newGalleryPreviews}
              onNewGallerySelect={handleNewGallerySelect}
              onNewGalleryRemove={handleNewGalleryRemove}
            />

            {/* Towers Management */}
            <div className="col-span-2">
              <TowersManager
                towers={form.towers}
                setTowers={(towers) => setField("towers", towers)}
              />
            </div>

            {/* Description */}
            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Brief description of the project…"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !form.name?.trim()}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            {isEditing ? "Save Changes" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}