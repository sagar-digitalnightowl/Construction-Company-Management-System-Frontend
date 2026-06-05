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
// import { Loader2, Plus, Trash2, Edit, X } from "lucide-react";
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

// const EMPTY_UNIT = {
//   unitNumber: "",
//   floor: "",
//   area: "",
//   bedrooms: "",
//   bathrooms: "",
//   price: "",
//   facing: "",
//   parking: false,
//   balcony: false,
//   furnished: "unfurnished",
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
//   clientName: "",
//   clientPhone: "",
//   clientEmail: "",
//   location: "",
//   startDate: "",
//   endDate: "",
//   budget: "",
//   status: "planning",
//   priority: "medium",
//   address: { ...EMPTY_ADDRESS },
//   units: [],
// };

// // Units Manager Component
// function UnitsManager({ units, setUnits }) {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [unitForm, setUnitForm] = useState({ ...EMPTY_UNIT });

//   const openAddDialog = () => {
//     setEditingIndex(null);
//     setUnitForm({ ...EMPTY_UNIT });
//     setIsDialogOpen(true);
//   };

//   const openEditDialog = (index) => {
//     setEditingIndex(index);
//     setUnitForm({ ...units[index] });
//     setIsDialogOpen(true);
//   };

//   const saveUnit = () => {
//     if (
//       !unitForm.unitNumber ||
//       !unitForm.floor ||
//       !unitForm.area ||
//       !unitForm.bedrooms ||
//       !unitForm.bathrooms ||
//       !unitForm.price
//     ) {
//       // Basic validation
//       return;
//     }
//     const newUnit = {
//       ...unitForm,
//       floor: Number(unitForm.floor),
//       area: Number(unitForm.area),
//       bedrooms: Number(unitForm.bedrooms),
//       bathrooms: Number(unitForm.bathrooms),
//       price: Number(unitForm.price),
//       parking: unitForm.parking === true || unitForm.parking === "true",
//       balcony: unitForm.balcony === true || unitForm.balcony === "true",
//     };
//     if (editingIndex !== null) {
//       const updated = [...units];
//       updated[editingIndex] = newUnit;
//       setUnits(updated);
//     } else {
//       setUnits([...units, newUnit]);
//     }
//     setIsDialogOpen(false);
//   };

//   const deleteUnit = (index) => {
//     setUnits(units.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-3">
//       <div className="flex justify-between items-center">
//         <Label>Units / Flats</Label>
//         <Button
//           type="button"
//           size="sm"
//           variant="outline"
//           onClick={openAddDialog}
//         >
//           <Plus className="h-3 w-3 mr-1" /> Add Unit
//         </Button>
//       </div>
//       {units.length === 0 ? (
//         <p className="text-sm text-muted-foreground">No units added yet.</p>
//       ) : (
//         <div className="space-y-2 max-h-80 overflow-y-auto">
//           {units.map((unit, idx) => (
//             <Card key={idx}>
//               <CardContent className="p-3">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="font-medium">{unit.unitNumber}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Floor {unit.floor} · {unit.bedrooms} BHK · {unit.area} sq
//                       ft
//                     </p>
//                     <p className="text-sm font-semibold mt-1">
//                       {formatINR(unit.price)}
//                     </p>
//                   </div>
//                   <div className="flex gap-1">
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => openEditDialog(idx)}
//                     >
//                       <Edit className="h-3 w-3" />
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => deleteUnit(idx)}
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Unit Form Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {editingIndex !== null ? "Edit Unit" : "Add Unit"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-3 max-h-[60vh] overflow-y-auto">
//             <div className="grid grid-cols-2 gap-2 p-1">
//               <div>
//                 <Label>Unit Number *</Label>
//                 <Input
//                   value={unitForm.unitNumber}
//                   onChange={(e) =>
//                     setUnitForm({ ...unitForm, unitNumber: e.target.value })
//                   }
//                   placeholder="101"
//                 />
//               </div>
//               <div>
//                 <Label>Floor *</Label>
//                 <Input
//                   type="number"
//                   value={unitForm.floor}
//                   onChange={(e) =>
//                     setUnitForm({ ...unitForm, floor: e.target.value })
//                   }
//                   placeholder="1"
//                 />
//               </div>
//               <div>
//                 <Label>Area (sq ft) *</Label>
//                 <Input
//                   type="number"
//                   value={unitForm.area}
//                   onChange={(e) =>
//                     setUnitForm({ ...unitForm, area: e.target.value })
//                   }
//                   placeholder="650"
//                 />
//               </div>
//               <div>
//                 <Label>Bedrooms *</Label>
//                 <Input
//                   type="number"
//                   value={unitForm.bedrooms}
//                   onChange={(e) =>
//                     setUnitForm({ ...unitForm, bedrooms: e.target.value })
//                   }
//                   placeholder="1-5"
//                 />
//               </div>
//               <div>
//                 <Label>Bathrooms *</Label>
//                 <Input
//                   type="number"
//                   value={unitForm.bathrooms}
//                   onChange={(e) =>
//                     setUnitForm({ ...unitForm, bathrooms: e.target.value })
//                   }
//                   placeholder="1"
//                 />
//               </div>
//               <div>
//                 <Label>Price (₹) *</Label>
//                 <Input
//                   type="number"
//                   value={unitForm.price}
//                   onChange={(e) =>
//                     setUnitForm({ ...unitForm, price: e.target.value })
//                   }
//                   placeholder="4500000"
//                 />
//               </div>
//               <div>
//                 <Label>Facing</Label>
//                 <Select
//                   value={unitForm.facing}
//                   onValueChange={(v) => setUnitForm({ ...unitForm, facing: v })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {FACING_OPTIONS.map((opt) => (
//                       <SelectItem key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label>Furnished</Label>
//                 <Select
//                   value={unitForm.furnished}
//                   onValueChange={(v) =>
//                     setUnitForm({ ...unitForm, furnished: v })
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {FURNISHED_OPTIONS.map((opt) => (
//                       <SelectItem key={opt.value} value={opt.value}>
//                         {opt.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-4 col-span-2">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={unitForm.parking}
//                     onChange={(e) =>
//                       setUnitForm({ ...unitForm, parking: e.target.checked })
//                     }
//                   />
//                   Parking
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={unitForm.balcony}
//                     onChange={(e) =>
//                       setUnitForm({ ...unitForm, balcony: e.target.checked })
//                     }
//                   />
//                   Balcony
//                 </label>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={saveUnit}>Save Unit</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export function ProjectForm({ open, onOpenChange, initialData, onSave }) {
//   const [form, setForm] = useState(EMPTY_PROJECT);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (open) {
//       if (initialData) {
//         setForm({
//           name: initialData.name ?? "",
//           description: initialData.description ?? "",
//           clientName: initialData.clientName ?? "",
//           clientPhone: initialData.clientPhone ?? "",
//           clientEmail: initialData.clientEmail ?? "",
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
//           units: initialData.units ?? [],
//         });
//       } else {
//         setForm({ ...EMPTY_PROJECT, units: [] });
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

//             {/* Client Details */}
//             <div className="space-y-1.5">
//               <Label>Client Name</Label>
//               <Input
//                 value={form.clientName}
//                 onChange={(e) => setField("clientName", e.target.value)}
//                 placeholder="ABC Developers"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label>Client Phone</Label>
//               <Input
//                 value={form.clientPhone}
//                 onChange={(e) => setField("clientPhone", e.target.value)}
//                 placeholder="+919876543210"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label>Client Email</Label>
//               <Input
//                 type="email"
//                 value={form.clientEmail}
//                 onChange={(e) => setField("clientEmail", e.target.value)}
//                 placeholder="client@example.com"
//               />
//             </div>
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
//               <Label>End Date</Label>
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

//             {/* Units Management */}
//             <div className="col-span-2">
//               <UnitsManager
//                 units={form.units}
//                 setUnits={(units) => setField("units", units)}
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
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { formatINR } from "@/lib/helpers";
import { Card, CardContent } from "@/components/ui/card";

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

// ---------- Flat Editor Dialog ----------
function FlatFormDialog({ open, onOpenChange, flat, onSave }) {
  const [form, setForm] = useState(flat || { ...EMPTY_FLAT });

  useEffect(() => {
    if (open) {
      setForm(flat || { ...EMPTY_FLAT });
    }
  }, [open, flat]);

  const handleSave = () => {
    if (
      !form.flatNumber ||
      !form.area ||
      !form.bedrooms ||
      !form.bathrooms ||
      !form.price
    )
      return;
    onSave({
      ...form,
      area: Number(form.area),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      price: Number(form.price),
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
              <Label>Area (sq ft) *</Label>
              <Input
                type="number"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="650"
              />
            </div>
            <div>
              <Label>Bedrooms *</Label>
              <Input
                type="number"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                placeholder="1-5"
              />
            </div>
            <div>
              <Label>Bathrooms *</Label>
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
              <Label>Price (₹) *</Label>
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

// ---------- Tower Editor Dialog (Floors & Flats) ----------
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
    const floorNumber = floors?.length + 1;
    setFloors([...floors, { floorNumber, flats: [] }]);
  };

  const deleteFloor = (idx) => {
    setFloors(floors.filter((_, i) => i !== idx));
  };

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
          // find and replace
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
          <div className="flex-1 overflow-y-auto space-y-4 p-2 ">
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
                        <h4 className="font-medium">
                          Floor {floor.floorNumber}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFloor(floorIdx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Flats list */}
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

      {/* Flat dialog nested inside tower editor */}
      <FlatFormDialog
        open={flatDialogOpen}
        onOpenChange={setFlatDialogOpen}
        flat={editingFlat}
        onSave={handleSaveFlat}
      />
    </>
  );
}

// ---------- Towers Manager (used in main form) ----------
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

      {/* Tower Editor Dialog */}
      <TowerEditorDialog
        open={towerDialogOpen}
        onOpenChange={setTowerDialogOpen}
        tower={editingTower}
        onSave={handleSaveTower}
      />
    </div>
  );
}

// ---------- Main Project Form ----------
export function ProjectForm({ open, onOpenChange, initialData, onSave }) {
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [saving, setSaving] = useState(false);

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
      } else {
        setForm({ ...EMPTY_PROJECT, towers: [] });
      }
    }
  }, [open, initialData]);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setAddressField = (key, val) =>
    setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));

  const handleSubmit = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        budget: Number(form.budget) || 0,
      });
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
              <Label>End Date</Label>
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

            {/* Towers Management (replaces Units) */}
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
