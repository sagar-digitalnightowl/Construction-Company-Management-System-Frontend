
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

//       // 1. Upload Cover Image if a new file is selected
//       if (coverFile) {
//         finalCoverKey = await uploadImageToCloud(coverFile, "project"); // pId hata diya yahan se
//       }

//       // 2. Upload ALL New Gallery Images in Parallel
//       if (newGalleryFiles.length > 0) {
//         const uploadPromises = newGalleryFiles.map((file) =>
//           uploadImageToCloud(file, "project") // pId hata diya yahan se bhi
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
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, Plus, Trash2, Edit, X, 
  Search, FolderKanban, MapPin, Calendar, 
  IndianRupee, Pencil, Eye, Filter, Copy, 
  Download, ChevronDown, Video 
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { authApi, projectApi, hrApi } from "@/api";
import { useNavigate } from "react-router-dom";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
// Now handles both Images and Videos
const uploadMediaToCloud = async (file, fileType) => {
  const presignRes = await authApi.getPresignedUrl({
    fileName: file.name,
    fileType: fileType,
    mimeType: file.type,
  });
  
  const { url, key } = presignRes.data;
  
  await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  
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
                onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
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
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
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
              <Select value={form.facing} onValueChange={(v) => setForm({ ...form, facing: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {FACING_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Furnished</Label>
              <Select value={form.furnished} onValueChange={(v) => setForm({ ...form, furnished: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {FURNISHED_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.parking}
                  onChange={(e) => setForm({ ...form, parking: e.target.checked })}
                /> Parking
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.balcony}
                  onChange={(e) => setForm({ ...form, balcony: e.target.checked })}
                /> Balcony
              </label>
            </div>

            <div className="col-span-2 border-t pt-3 mt-2">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Booking & Agreement Details (Optional)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Type of Booking</Label>
                  <Select value={form.typeOfBooking} onValueChange={(v) => setForm({ ...form, typeOfBooking: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
                  <Select value={form.agreementStatus} onValueChange={(v) => setForm({ ...form, agreementStatus: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
                    onChange={(e) => setForm({ ...form, agreementDate: e.target.value })}
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.cancelled}
                      onChange={(e) => setForm({ ...form, cancelled: e.target.checked })}
                    /> Cancelled
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{flat ? "Update Flat" : "Add Flat"}</Button>
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
                <Button type="button" size="sm" variant="outline" onClick={addFloor}>
                  <Plus className="h-3 w-3 mr-1" /> Add Floor
                </Button>
              </div>
              {floors?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No floors added.</p>
              ) : (
                floors?.map((floor, floorIdx) => (
                  <Card key={floorIdx}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">Floor #</Label>
                        <Input
                          value={floor.floorNumber}
                          onChange={(e) => updateFloorNumber(floorIdx, e.target.value)}
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
                          <p className="text-xs text-muted-foreground">No flats</p>
                        ) : (
                          floor.flats?.map((flat, flatIdx) => (
                            <div key={flatIdx} className="flex items-center justify-between p-2 bg-muted/40 rounded">
                              <div>
                                <span className="text-sm font-medium">{flat.flatNumber}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {flat.bedrooms} BHK · {flat.area} sqft · {formatINR(flat.price)}
                                </span>
                                {flat.cancelled && (
                                  <span className="text-xs text-red-500 ml-2">(Cancelled)</span>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button type="button" variant="ghost" size="icon" onClick={() => openEditFlat(floorIdx, flatIdx)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" onClick={() => deleteFlat(floorIdx, flatIdx)}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!towerName.trim()}>Save Tower</Button>
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

  const deleteTower = (index) => setTowers(towers.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Towers</Label>
        <Button type="button" size="sm" variant="outline" onClick={openAddTower}>
          <Plus className="h-3 w-3 mr-1" /> Add Tower
        </Button>
      </div>
      {towers?.length === 0 ? (
        <p className="text-sm text-muted-foreground">No towers added yet.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {towers.map((tower, idx) => {
            const totalFlats = tower.floors.reduce((sum, f) => sum + f.flats?.length, 0);
            return (
              <Card key={idx}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{tower.towerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {tower.floors?.length} Floor{tower.floors?.length !== 1 && "s"} · {totalFlats} Flat{totalFlats !== 1 && "s"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => openEditTower(idx)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => deleteTower(idx)}>
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

// ---------- Media (Images & Videos) Upload Section ----------
function MediaUploadSection({
  coverPreview,
  onCoverSelect,
  onCoverRemove,
  
  existingGalleryImages,
  onExistingGalleryRemove,
  newGalleryPreviews,
  onNewGallerySelect,
  onNewGalleryRemove,

  existingVideos,
  onExistingVideoRemove,
  newVideoPreviews,
  onNewVideoSelect,
  onNewVideoRemove,
}) {
  return (
    <div className="col-span-2 border-t pt-4 mt-2">
      <Label className="text-sm font-semibold">Project Media</Label>
      <p className="text-xs text-muted-foreground mb-3">
        Media files will be uploaded to the server when you save the project.
      </p>

      {/* Cover Image */}
      <div className="mb-4">
        <Label className="text-xs mb-1 block">Cover Image</Label>
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
              <input type="file" accept="image/*" className="hidden" onChange={onCoverSelect} />
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gallery Images */}
        <div>
          <Label className="text-xs mb-1 block">Gallery Images</Label>
          <div className="flex flex-wrap gap-3 mt-1">
            {/* Existing Uploaded Images */}
            {existingGalleryImages.map((imgUrl, idx) => (
              <div key={`existing-img-${idx}`} className="relative w-24 h-20 rounded border overflow-hidden">
                <img src={imgUrl} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
                  onClick={() => onExistingGalleryRemove(idx)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* New Selected Previews */}
            {newGalleryPreviews.map((preview, idx) => (
              <div key={`new-img-${idx}`} className="relative w-24 h-20 rounded border border-blue-400 overflow-hidden ring-1 ring-blue-400">
                <img src={preview} alt={`New ${idx}`} className="w-full h-full object-cover opacity-90" />
                <div className="absolute bottom-0 w-full bg-blue-500/80 text-[10px] text-white text-center py-0.5">New</div>
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
              <span className="text-[10px] text-muted-foreground mt-1 text-center leading-tight">Add Images</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={onNewGallerySelect} />
            </label>
          </div>
        </div>

        {/* Project Videos */}
        <div>
          <Label className="text-xs mb-1 block">Project Videos</Label>
          <div className="flex flex-wrap gap-3 mt-1">
            {/* Existing Uploaded Videos */}
            {existingVideos.map((vidUrl, idx) => (
              <div key={`existing-vid-${idx}`} className="relative w-24 h-20 rounded border bg-black overflow-hidden">
                <video src={vidUrl} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-black/50 rounded p-0.5">
                  <Video className="h-3 w-3 text-white" />
                </div>
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
                  onClick={() => onExistingVideoRemove(idx)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* New Video Previews */}
            {newVideoPreviews.map((preview, idx) => (
              <div key={`new-vid-${idx}`} className="relative w-24 h-20 rounded border border-blue-400 overflow-hidden ring-1 ring-blue-400 bg-black">
                <video src={preview} className="w-full h-full object-cover opacity-90" />
                <div className="absolute top-1 left-1 bg-black/50 rounded p-0.5">
                  <Video className="h-3 w-3 text-white" />
                </div>
                <div className="absolute bottom-0 w-full bg-blue-500/80 text-[10px] text-white text-center py-0.5">New</div>
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 hover:opacity-80 shadow-md"
                  onClick={() => onNewVideoRemove(idx)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Upload Video Button */}
            <label className="cursor-pointer border-2 border-dashed rounded p-3 text-center hover:bg-muted/50 transition w-24 h-20 flex flex-col items-center justify-center">
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1 text-center leading-tight">Add Videos</span>
              <input type="file" accept="video/*" multiple className="hidden" onChange={onNewVideoSelect} />
            </label>
          </div>
        </div>
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
  const [coverFile, setCoverFile] = useState(null);
  const [coverKey, setCoverKey] = useState("");
  
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [existingGalleryKeys, setExistingGalleryKeys] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);

  // States for Video Handling
  const [existingVideos, setExistingVideos] = useState([]);
  const [existingVideoKeys, setExistingVideoKeys] = useState([]);
  const [newVideoFiles, setNewVideoFiles] = useState([]);
  const [newVideoPreviews, setNewVideoPreviews] = useState([]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          name: initialData.name ?? "",
          description: initialData.description ?? "",
          location: initialData.location ?? "",
          startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : "",
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
        
        // Load existing images
        setCoverPreview(initialData.coverImage || null);
        setCoverKey(initialData.coverImageKey || "");
        setExistingGalleryImages(initialData.galleryImages || []);
        setExistingGalleryKeys(initialData.galleryImageKeys || []);

        // Load existing videos
        setExistingVideos(initialData.videos || []);
        setExistingVideoKeys(initialData.videoKeys || []);
      } else {
        setForm({ ...EMPTY_PROJECT, towers: [] });
        setCoverPreview(null);
        setCoverKey("");
        setExistingGalleryImages([]);
        setExistingGalleryKeys([]);
        
        setExistingVideos([]);
        setExistingVideoKeys([]);
      }
      
      // Reset new files states
      setCoverFile(null);
      setNewGalleryFiles([]);
      setNewGalleryPreviews([]);
      
      setNewVideoFiles([]);
      setNewVideoPreviews([]);
    }
  }, [open, initialData]);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setAddressField = (key, val) => setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));

  // Handlers for Cover Image
  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setCoverKey("");
    e.target.value = null;
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
    setNewGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = null;
  };

  const handleExistingGalleryRemove = (index) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setExistingGalleryKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewGalleryRemove = (index) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handlers for Videos
  const handleNewVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setNewVideoFiles((prev) => [...prev, ...files]);
    setNewVideoPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = null;
  };

  const handleExistingVideoRemove = (index) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
    setExistingVideoKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewVideoRemove = (index) => {
    setNewVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setNewVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    
    try {
      let finalCoverKey = coverKey;
      let finalGalleryKeys = [...existingGalleryKeys];
      let finalVideoKeys = [...existingVideoKeys];

      // 1. Upload Cover Image
      if (coverFile) {
        finalCoverKey = await uploadMediaToCloud(coverFile, "project");
      }

      // 2. Upload Gallery Images
      if (newGalleryFiles.length > 0) {
        const uploadPromises = newGalleryFiles.map((file) => uploadMediaToCloud(file, "project"));
        const newKeys = await Promise.all(uploadPromises);
        finalGalleryKeys = [...finalGalleryKeys, ...newKeys];
      }

      // 3. Upload Videos
      if (newVideoFiles.length > 0) {
        const uploadPromises = newVideoFiles.map((file) => uploadMediaToCloud(file, "project"));
        const newKeys = await Promise.all(uploadPromises);
        finalVideoKeys = [...finalVideoKeys, ...newKeys];
      }

      // 4. Prepare Final Payload
      const payload = {
        ...form,
        budget: Number(form.budget) || 0,
        coverImageKey: finalCoverKey || undefined,
        galleryImageKeys: finalGalleryKeys.length > 0 ? finalGalleryKeys : undefined,
        videoKeys: finalVideoKeys.length > 0 ? finalVideoKeys : undefined,
      };
      
      if (!payload.endDate) delete payload.endDate;
      
      // 5. Save to Database
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
          <DialogTitle>{isEditing ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="col-span-2 space-y-1.5">
              <Label>Project Name <span className="text-destructive">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Sky Tower Construction"
              />
            </div>

            {/* Status + Priority */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setField("priority", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
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
              <p className="text-sm font-medium text-muted-foreground mb-2">Address Details</p>
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

            {/* Offline Media Upload */}
            <MediaUploadSection
              coverPreview={coverPreview}
              onCoverSelect={handleCoverSelect}
              onCoverRemove={handleCoverRemove}
              
              existingGalleryImages={existingGalleryImages}
              onExistingGalleryRemove={handleExistingGalleryRemove}
              newGalleryPreviews={newGalleryPreviews}
              onNewGallerySelect={handleNewGallerySelect}
              onNewGalleryRemove={handleNewGalleryRemove}

              existingVideos={existingVideos}
              onExistingVideoRemove={handleExistingVideoRemove}
              newVideoPreviews={newVideoPreviews}
              onNewVideoSelect={handleNewVideoSelect}
              onNewVideoRemove={handleNewVideoRemove}
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !form.name?.trim()}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
            {isEditing ? "Save Changes" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}  

// ======================================================================
// The rest of your components (Projects, DateRangePicker, Filters, etc.)
// remain exactly the same as your previous code. Below is the main export 
// to keep the file fully intact and functional.
// ======================================================================

export const STATUS = {
  planning: { label: "Planning", variant: "muted" },
  in_progress: { label: "In Progress", variant: "default" },
  delayed: { label: "Delayed", variant: "destructive" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "warning" },
};

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function DateRangePicker({ from, to, onFromChange, onToChange, placeholderFrom, placeholderTo }) {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            {from ? formatDate(from) : placeholderFrom}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent mode="single" selected={from} onSelect={onFromChange} initialFocus />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            {to ? formatDate(to) : placeholderTo}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent mode="single" selected={to} onSelect={onToChange} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function AdvancedFiltersModal({ open, onOpenChange, filters, setFilters, onClearAll }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (open && !users.length) {
      setLoadingUsers(true);
      hrApi
        .getAllEmployees()
        .then((res) => {
          const list = res?.data?.data?.users ?? res?.data?.data ?? [];
          setUsers(Array.isArray(list) ? list : []);
        })
        .catch(() => toast.error("Failed to load users"))
        .finally(() => setLoadingUsers(false));
    }
  }, [open, users.length]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>Refine project list using additional criteria.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select value={filters.priority || ""} onValueChange={(v) => updateFilter("priority", v || undefined)}>
              <SelectTrigger><SelectValue placeholder="Any priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Current Phase</label>
            <Select value={filters.currentPhase || ""} onValueChange={(v) => updateFilter("currentPhase", v || undefined)}>
              <SelectTrigger><SelectValue placeholder="Any phase" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="tender">Tender</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="excavation">Excavation</SelectItem>
                <SelectItem value="foundation">Foundation</SelectItem>
                <SelectItem value="structure">Structure</SelectItem>
                <SelectItem value="brickwork">Brickwork</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="finishing">Finishing</SelectItem>
                <SelectItem value="handover">Handover</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Health</label>
            <Select value={filters.health || ""} onValueChange={(v) => updateFilter("health", v || undefined)}>
              <SelectTrigger><SelectValue placeholder="Any health" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Budget (₹)</label>
            <div className="flex gap-2">
              <Input type="number" placeholder="Min" value={filters.minBudget ?? ""} onChange={(e) => updateFilter("minBudget", e.target.value ? Number(e.target.value) : undefined)} />
              <Input type="number" placeholder="Max" value={filters.maxBudget ?? ""} onChange={(e) => updateFilter("maxBudget", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Progress (%)</label>
            <div className="flex gap-2">
              <Input type="number" placeholder="Min" min={0} max={100} value={filters.minProgress ?? ""} onChange={(e) => updateFilter("minProgress", e.target.value ? Number(e.target.value) : undefined)} />
              <Input type="number" placeholder="Max" min={0} max={100} value={filters.maxProgress ?? ""} onChange={(e) => updateFilter("maxProgress", e.target.value ? Number(e.target.value) : undefined)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <DateRangePicker
              from={filters.startDateFrom ? new Date(filters.startDateFrom) : undefined}
              to={filters.startDateTo ? new Date(filters.startDateTo) : undefined}
              onFromChange={(date) => updateFilter("startDateFrom", date ? date.toISOString().split("T")[0] : undefined)}
              onToChange={(date) => updateFilter("startDateTo", date ? date.toISOString().split("T")[0] : undefined)}
              placeholderFrom="From" placeholderTo="To"
            />
          </div>
          <div>
            <label className="text-sm font-medium">End Date</label>
            <DateRangePicker
              from={filters.endDateFrom ? new Date(filters.endDateFrom) : undefined}
              to={filters.endDateTo ? new Date(filters.endDateTo) : undefined}
              onFromChange={(date) => updateFilter("endDateFrom", date ? date.toISOString().split("T")[0] : undefined)}
              onToChange={(date) => updateFilter("endDateTo", date ? date.toISOString().split("T")[0] : undefined)}
              placeholderFrom="From" placeholderTo="To"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Project Manager</label>
            <Select value={filters.projectManager || ""} onValueChange={(v) => updateFilter("projectManager", v || undefined)}>
              <SelectTrigger><SelectValue placeholder="Any PM" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {loadingUsers ? <SelectItem disabled>Loading...</SelectItem> : users.map((u) => <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Created By</label>
            <Select value={filters.createdBy || ""} onValueChange={(v) => updateFilter("createdBy", v || undefined)}>
              <SelectTrigger><SelectValue placeholder="Any user" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {loadingUsers ? <SelectItem disabled>Loading...</SelectItem> : users.map((u) => <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Team Member</label>
            <Select value={filters.teamMember || ""} onValueChange={(v) => updateFilter("teamMember", v || undefined)}>
              <SelectTrigger><SelectValue placeholder="Any member" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {loadingUsers ? <SelectItem disabled>Loading...</SelectItem> : users.map((u) => <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClearAll}>Clear all filters</Button>
          <Button onClick={() => onOpenChange(false)}>Apply filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProjectCard({ project, canEdit, onEdit, onDelete, onClone }) {
  const navigate = useNavigate();
  const burn = project.budget ? Math.round((project.spent / project.budget) * 100) : 0;

  return (
    <Card data-testid={`proj-card-${project._id}`} className="group transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer" onClick={() => navigate(`/projects/${project._id}`)}>
      <CardContent className="p-3 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-display text-lg font-semibold leading-tight mt-0.5 truncate">{project.name}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{project.location}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Buyer: <span className="text-foreground">{project.clientName}</span></div>
          </div>
          <Badge variant={STATUS[project.status]?.variant} className="text-nowrap shrink-0">{STATUS[project.status]?.label ?? project.status}</Badge>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Progress</span><span className="font-medium tabular-nums">{project.progress ?? 0}%</span>
          </div>
          <Progress value={project.progress ?? 0} indicatorClassName={project.status === "delayed" ? "bg-destructive" : (project.progress ?? 0) > 70 ? "bg-[color:var(--color-success)]" : "bg-primary"} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><div className="text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3 w-3" />Budget</div><div className="font-medium mt-0.5">{formatINR(project.budget)}</div></div>
          <div><div className="text-muted-foreground">Spent ({burn || 0}%)</div><div className="font-medium mt-0.5">{formatINR(project.spent ?? 0)}</div></div>
          <div><div className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Start</div><div className="font-medium mt-0.5">{formatDate(project.startDate)}</div></div>
          <div><div className="text-muted-foreground">End</div><div className="font-medium mt-0.5">{formatDate(project.endDate)}</div></div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 -mb-1">
          <div className="text-xs text-muted-foreground">
            <div>PM: <span className="text-foreground">{project.projectManager?.name ?? "—"}</span></div>
            <div>Priority: <span className="text-foreground capitalize">{project.priority ?? "—"}</span></div>
          </div>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => navigate(`/projects/${project._id}`)}><Eye className="h-4 w-4" /></Button>
            {canEdit && (
              <>
                <Button variant="ghost" size="icon" onClick={() => onEdit(project)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(project._id)}><Trash2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onClone(project._id)} title="Clone Project"><Copy className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectSkeleton() {
  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between"><div className="space-y-2 flex-1"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-3 w-1/2" /></div><Skeleton className="h-5 w-20" /></div>
        <Skeleton className="h-2 w-full" />
        <div className="grid grid-cols-2 gap-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
      </CardContent>
    </Card>
  );
}

export default function Projects() {
  const { current } = useAuthStore();
  const canEdit = canMutate(current?.role, "projects");

  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [advFiltersOpen, setAdvFiltersOpen] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState({
    priority: "", currentPhase: "", health: "", minBudget: undefined, maxBudget: undefined,
    minProgress: undefined, maxProgress: undefined, startDateFrom: undefined, startDateTo: undefined,
    endDateFrom: undefined, endDateTo: undefined, projectManager: "", createdBy: "", teamMember: "",
  });

  const buildQueryParams = useCallback(
    (pageNum = 1) => {
      const params = { page: pageNum, limit: 20 };
      if (tab !== "all") params.status = tab;
      if (debouncedSearch) params.search = debouncedSearch;
      if (advancedFilters.priority && advancedFilters.priority !== "any") params.priority = advancedFilters.priority;
      if (advancedFilters.currentPhase && advancedFilters.currentPhase !== "any") params.currentPhase = advancedFilters.currentPhase;
      if (advancedFilters.health && advancedFilters.health !== "any") params.health = advancedFilters.health;
      if (advancedFilters.minBudget !== undefined) params.minBudget = advancedFilters.minBudget;
      if (advancedFilters.maxBudget !== undefined) params.maxBudget = advancedFilters.maxBudget;
      if (advancedFilters.minProgress !== undefined) params.minProgress = advancedFilters.minProgress;
      if (advancedFilters.maxProgress !== undefined) params.maxProgress = advancedFilters.maxProgress;
      if (advancedFilters.startDateFrom) params.startDateFrom = advancedFilters.startDateFrom;
      if (advancedFilters.startDateTo) params.startDateTo = advancedFilters.startDateTo;
      if (advancedFilters.endDateFrom) params.endDateFrom = advancedFilters.endDateFrom;
      if (advancedFilters.endDateTo) params.endDateTo = advancedFilters.endDateTo;
      if (advancedFilters.projectManager && advancedFilters.projectManager !== "any") params.projectManager = advancedFilters.projectManager;
      if (advancedFilters.createdBy && advancedFilters.createdBy !== "any") params.createdBy = advancedFilters.createdBy;
      if (advancedFilters.teamMember && advancedFilters.teamMember !== "any") params.teamMember = advancedFilters.teamMember;
      return params;
    },
    [tab, debouncedSearch, advancedFilters],
  );

  const loadProjects = useCallback(
    async (pageNum, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const params = buildQueryParams(pageNum);
        const res = await projectApi.getAll(params);
        const list = res?.data?.data?.projects ?? res?.data?.data ?? res?.data ?? [];
        const safeList = Array.isArray(list) ? list : [];
        const total = res?.data?.total ?? res?.data?.data?.total;
        
        if (total !== undefined) {
          const currentTotal = append ? projects.length + safeList.length : safeList.length;
          setHasMore(currentTotal < total);
        } else {
          setHasMore(safeList.length === 20);
        }

        if (append) setProjects((prev) => [...prev, ...safeList]);
        else setProjects(safeList);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load projects");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildQueryParams, projects.length],
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadProjects(1, false);
  }, [
    tab, debouncedSearch, advancedFilters.priority, advancedFilters.currentPhase, advancedFilters.health,
    advancedFilters.minBudget, advancedFilters.maxBudget, advancedFilters.minProgress, advancedFilters.maxProgress,
    advancedFilters.startDateFrom, advancedFilters.startDateTo, advancedFilters.endDateFrom, advancedFilters.endDateTo,
    advancedFilters.projectManager, advancedFilters.createdBy, advancedFilters.teamMember,
  ]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadProjects(nextPage, true);
  };

  const clearAllFilters = () => {
    setTab("all");
    setSearch("");
    setAdvancedFilters({
      priority: "", currentPhase: "", health: "", minBudget: undefined, maxBudget: undefined, minProgress: undefined, maxProgress: undefined,
      startDateFrom: undefined, startDateTo: undefined, endDateFrom: undefined, endDateTo: undefined, projectManager: "", createdBy: "", teamMember: "",
    });
    toast.info("All filters cleared");
  };

  const startCreate = () => { setEditing(null); setFormOpen(true); };
  const startEdit = (p) => { setEditing(p); setFormOpen(true); };

  const handleSave = async (formData) => {
    try {
      delete formData.endDate;
      if (editing) {
        await projectApi.update(editing._id, formData);
        toast.success("Project updated");
      } else {
        await projectApi.create(formData);
        toast.success("Project created");
      }
      setFormOpen(false);
      setPage(1);
      loadProjects(1, false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      await projectApi.delete(confirmId);
      toast.success("Project deleted");
      setConfirmId(null);
      setPage(1);
      loadProjects(1, false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete project");
    }
  };

  const handleClone = async (id) => {
    try {
      await projectApi.clone(id);
      toast.success("Project cloned successfully");
      setPage(1);
      loadProjects(1, false);
    } catch (err) {
      toast.error(err?.message || err?.response?.data?.message || "Failed to clone project");
    }
  };

  const exportToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(","), ...data.map((row) => headers.map((field) => `"${row[field] ?? ""}"`).join(","))];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    a.click();
  };

  const exportToPDF = (data) => { toast.info("PDF export not fully implemented in this snippet."); };

  const handleExport = async (format = "excel") => {
    try {
      if (!projects.length) { toast.error("No data to export"); return; }
      if (format === "excel" || format === "csv") exportToCSV(projects);
      else if (format === "pdf") exportToPDF(projects);
      toast.success("Export completed");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  const activeAdvFilterCount = useMemo(() => {
    return Object.values(advancedFilters).filter((v) => v && v !== "" && v !== undefined).length;
  }, [advancedFilters]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Operations" title="Projects" description="Track every construction project from BOQ to handover."
        actions={
          <div className="flex gap-2">
            {canEdit && <Button onClick={startCreate}><Plus className="h-4 w-4" /> New project</Button>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={setTab} className="overflow-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="delayed">Delayed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input data-testid="proj-search" className="pl-9" placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" onClick={() => setAdvFiltersOpen(true)} className="relative">
            <Filter className="h-4 w-4 mr-2" /> Filters
            {activeAdvFilterCount > 0 && <Badge variant="secondary" className="ml-2 rounded-full px-1.5">{activeAdvFilterCount}</Badge>}
          </Button>
          {(search || tab !== "all" || activeAdvFilterCount > 0) && (
            <Button variant="ghost" onClick={clearAllFilters} size="icon" title="Clear all filters"><X className="h-4 w-4" /></Button>
          )}
        </div>
      </div>

      <AdvancedFiltersModal open={advFiltersOpen} onOpenChange={setAdvFiltersOpen} filters={advancedFilters} setFilters={setAdvancedFilters} onClearAll={clearAllFilters} />

      {loading && !loadingMore ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)}</div>
      ) : projects.length === 0 && !loading ? (
        <EmptyState icon={FolderKanban} title="No projects match your filters" description="Try adjusting filters or create a new project." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((p) => <ProjectCard key={p._id} project={p} canEdit={canEdit} onEdit={startEdit} onDelete={setConfirmId} onClone={handleClone} />)}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading…</> : <>Load More <ChevronDown className="h-4 w-4 ml-2" /></>}
              </Button>
            </div>
          )}
        </>
      )}

      <ProjectForm open={formOpen} onOpenChange={setFormOpen} initialData={editing} onSave={handleSave} />

      <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete project?" description="This will permanently remove the project and all linked data." onConfirm={handleDelete} />
    </div>
  );
}