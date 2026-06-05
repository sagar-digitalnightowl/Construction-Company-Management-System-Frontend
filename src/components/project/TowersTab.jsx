// src/components/project/TowersTab.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatINR } from "@/lib/helpers";
import { useProject } from "@/hooks/useProject";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Building2,
  Layers,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";

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

// ---------- Flat Form Dialog (Add/Edit) ----------
function FlatFormDialog({ open, onOpenChange, flat, onSave }) {
  const [form, setForm] = useState(flat || { ...EMPTY_FLAT });

  useEffect(() => {
    if (open) setForm(flat || { ...EMPTY_FLAT });
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
                placeholder="e.g., 101"
              />
            </div>
            <div>
              <Label>Area (sq ft) *</Label>
              <Input
                type="number"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="e.g., 650"
              />
            </div>
            <div>
              <Label>Bedrooms *</Label>
              <Input
                type="number"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                placeholder="e.g., 2"
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
                placeholder="e.g., 1"
              />
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g., 4500000"
              />
            </div>
            <div>
              <Label>Facing</Label>
              <Select
                value={form.facing}
                onValueChange={(v) => setForm({ ...form, facing: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select facing" />
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
                  <SelectValue placeholder="Select furnishing" />
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
          <Button onClick={handleSave}>Save Flat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Add Tower Dialog ----------
function AddTowerDialog({ open, onOpenChange, onSave }) {
  const [towerName, setTowerName] = useState("");
  const [floors, setFloors] = useState([]);
  const [flatDialogOpen, setFlatDialogOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState(null);
  const [currentFloorIdx, setCurrentFloorIdx] = useState(null);

  useEffect(() => {
    if (open) {
      setTowerName("");
      setFloors([]);
    }
  }, [open]);

  const addFloor = () => {
    const nextNumber = floors.length + 1;
    setFloors([...floors, { floorNumber: nextNumber, flats: [] }]);
  };

  const updateFloorNumber = (idx, value) => {
    const updated = floors.map((floor, i) => {
      if (i === idx) {
        return { ...floor, floorNumber: Number(value) || 0 };
      }
      return floor;
    });
    setFloors(updated);
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
    onSave({
      towerName: towerName.trim(),
      floors: floors.map(({ floorNumber, flats }) => ({ floorNumber, flats })),
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Tower</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            <div>
              <Label>Tower Name *</Label>
              <Input
                value={towerName}
                onChange={(e) => setTowerName(e.target.value)}
                placeholder="e.g., Tower A"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Floors (optional)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addFloor}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Floor
                </Button>
              </div>
              {floors.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No floors added.
                </p>
              ) : (
                floors.map((floor, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Floor</span>
                          <Input
                            type="number"
                            className="w-20 h-8 text-sm"
                            value={floor.floorNumber}
                            onChange={(e) =>
                              updateFloorNumber(idx, e.target.value)
                            }
                            placeholder="1"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFloor(idx)}
                        >
                          ✕
                        </Button>
                      </div>
                      <div className="ml-4 space-y-1">
                        {floor.flats.length === 0 ? (
                          <p className="text-xs text-muted-foreground">
                            No flats
                          </p>
                        ) : (
                          floor.flats.map((flat, flatIdx) => (
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
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditFlat(idx, flatIdx)}
                                >
                                  ✎
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteFlat(idx, flatIdx)}
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => openAddFlat(idx)}
                          className="p-0 h-auto text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Flat
                        </Button>
                      </div>
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
              Create Tower
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

// ---------- Add Floor Dialog ----------
function AddFloorDialog({ open, onOpenChange, tower, onSave }) {
  const [floorNumber, setFloorNumber] = useState(1);
  const [flats, setFlats] = useState([]);
  const [flatDialogOpen, setFlatDialogOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState(null);

  useEffect(() => {
    if (open) {
      // Suggest floor number = max existing floor number + 1
      const existingNumbers = tower.floors?.map((f) => f.floorNumber) || [];
      const nextNum =
        existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      setFloorNumber(nextNum);
      setFlats([]);
    }
  }, [open, tower]);

  const handleAddFlat = () => {
    setEditingFlat(null);
    setFlatDialogOpen(true);
  };

  const handleEditFlat = (idx) => {
    setEditingFlat(flats[idx]);
    setFlatDialogOpen(true);
  };

  const handleSaveFlat = (flatData) => {
    if (editingFlat) {
      setFlats((prev) => prev.map((f) => (f === editingFlat ? flatData : f)));
    } else {
      setFlats((prev) => [...prev, flatData]);
    }
    setFlatDialogOpen(false);
  };

  const deleteFlat = (idx) => {
    setFlats((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!floorNumber || floorNumber < 1) return;
    onSave({
      floorNumber: Number(floorNumber),
      flats,
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Floor to {tower.towerName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            <div className="flex items-center gap-2">
              <Label>Floor Number *</Label>
              <Input
                type="number"
                className="w-24"
                value={floorNumber}
                onChange={(e) => setFloorNumber(Number(e.target.value) || 0)}
                placeholder="e.g., 1"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Flats (optional)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddFlat}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Flat
                </Button>
              </div>
              {flats.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No flats added yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {flats.map((flat, idx) => (
                    <div
                      key={idx}
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
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditFlat(idx)}
                        >
                          ✎
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFlat(idx)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!floorNumber || floorNumber < 1}
            >
              Add Floor
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

// ---------- Main TowersTab Component ----------
export function TowersTab({ projectId }) {
  const { current } = useAuthStore();

  const canEdit = canMutate(current?.role, "tower-operations");

  const { towersData, loading, fetchTowers, addTower, addFloor, addFlat } =
    useProject();

  const [addTowerOpen, setAddTowerOpen] = useState(false);
  const [addFloorOpen, setAddFloorOpen] = useState(false);
  const [selectedTower, setSelectedTower] = useState(null);
  const [flatDialogOpen, setFlatDialogOpen] = useState(false);
  const [currentTowerForFlat, setCurrentTowerForFlat] = useState(null);
  const [currentFloorForFlat, setCurrentFloorForFlat] = useState(null);
  const [expandedFloors, setExpandedFloors] = useState({});

  useEffect(() => {
    if (projectId) {
      fetchTowers(projectId);
    }
  }, [projectId, fetchTowers]);

  const towers = towersData.towers || [];
  const totalTowers = towersData.totalTowers || 0;
  const totalFloors = towers.reduce(
    (sum, t) => sum + (t.floors?.length || 0),
    0,
  );
  const totalFlats = towers.reduce(
    (sum, t) =>
      sum + (t.floors?.reduce((s, f) => s + (f.flats?.length || 0), 0) || 0),
    0,
  );

  const handleCreateTower = async (towerData) => {
    await addTower(projectId, towerData);
    setAddTowerOpen(false);
  };

  const handleAddFloor = async (tower, floorData) => {
    const towerIdx = towers.indexOf(tower);
    if (towerIdx >= 0) {
      await addFloor(projectId, towerIdx, floorData);
    }
    setAddFloorOpen(false);
  };

  const handleAddFlat = async (tower, floor, flatData) => {
    const towerIdx = towers.indexOf(tower);
    const floorIdx = tower.floors.indexOf(floor);
    if (towerIdx >= 0 && floorIdx >= 0) {
      await addFlat(projectId, towerIdx, floorIdx, flatData);
    }
  };

  const openAddFlatDialog = (tower, floor) => {
    setCurrentTowerForFlat(tower);
    setCurrentFloorForFlat(floor);
    setFlatDialogOpen(true);
  };

  const saveFlat = async (flatData) => {
    if (currentTowerForFlat && currentFloorForFlat) {
      await handleAddFlat(currentTowerForFlat, currentFloorForFlat, flatData);
      setFlatDialogOpen(false);
    }
  };

  const toggleFloorExpand = (towerName, floorNumber) => {
    const key = `${towerName}-${floorNumber}`;
    setExpandedFloors((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading && towers.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              Total Towers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTowers}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-500" />
              Total Floors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalFloors}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Home className="h-4 w-4 text-emerald-500" />
              Total Flats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalFlats}</p>
          </CardContent>
        </Card>
      </div>

      {/* Towers List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Towers Inventory</CardTitle>
          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddTowerOpen(true)}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Tower
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {towers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No towers added yet. Click “Add Tower” to start building.
            </p>
          ) : (
            <div className="space-y-2">
              {towers.map((tower) => {
                const floors = tower.floors || [];
                const flatCount = floors.reduce(
                  (sum, f) => sum + (f.flats?.length || 0),
                  0,
                );
                return (
                  <Card key={tower.towerName} className="border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">
                          {tower.towerName}
                        </h3>
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTower(tower);
                              setAddFloorOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Floor
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {floors.length} Floor{floors.length !== 1 && "s"} ·{" "}
                        {flatCount} Flat{flatCount !== 1 && "s"}
                      </div>

                      {floors.length > 0 && (
                        <div className="overflow-auto border rounded-md">
                          <table className="min-w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium w-10"></th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Floor
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Flats
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Total Area
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Avg Price
                                </th>
                                <th className="px-3 py-2 text-left font-medium"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {floors.map((floor) => {
                                const flatList = floor.flats || [];
                                const totalArea = flatList.reduce(
                                  (sum, f) => sum + (f.area || 0),
                                  0,
                                );
                                const avgPrice =
                                  flatList.length > 0
                                    ? flatList.reduce(
                                        (sum, f) => sum + (f.price || 0),
                                        0,
                                      ) / flatList.length
                                    : 0;
                                const isExpanded =
                                  expandedFloors[
                                    `${tower.towerName}-${floor.floorNumber}`
                                  ] || false;

                                return (
                                  <React.Fragment
                                    key={`${tower.towerName}-${floor.floorNumber}`}
                                  >
                                    <tr
                                      className="border-t cursor-pointer hover:bg-muted/30"
                                      onClick={() =>
                                        toggleFloorExpand(
                                          tower.towerName,
                                          floor.floorNumber,
                                        )
                                      }
                                    >
                                      <td className="px-3 py-2">
                                        {isExpanded ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </td>
                                      <td className="px-3 py-2 font-medium">
                                        {floor.floorNumber}
                                      </td>
                                      <td className="px-3 py-2">
                                        {flatList.length} units
                                      </td>
                                      <td className="px-3 py-2">
                                        {totalArea} sqft
                                      </td>
                                      <td className="px-3 py-2">
                                        {flatList.length
                                          ? formatINR(avgPrice)
                                          : "-"}
                                      </td>
                                      {canEdit && (
                                        <td className="px-3 py-2 text-right">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openAddFlatDialog(tower, floor);
                                            }}
                                          >
                                            <Plus className="h-3 w-3 mr-1" />{" "}
                                            Add Flat
                                          </Button>
                                        </td>
                                      )}
                                    </tr>
                                    {isExpanded && (
                                      <tr key={`expanded-${floor.floorNumber}`}>
                                        <td
                                          colSpan={6}
                                          className="p-0 bg-muted/20"
                                        >
                                          <div className="p-3">
                                            <table className="min-w-full text-xs">
                                              <thead>
                                                <tr className="border-b">
                                                  <th className="px-2 py-1 text-left font-medium">
                                                    Flat #
                                                  </th>
                                                  <th className="px-2 py-1 text-left font-medium">
                                                    Area
                                                  </th>
                                                  <th className="px-2 py-1 text-left font-medium">
                                                    BHK
                                                  </th>
                                                  <th className="px-2 py-1 text-left font-medium">
                                                    Bath
                                                  </th>
                                                  <th className="px-2 py-1 text-left font-medium">
                                                    Price
                                                  </th>
                                                  <th className="px-2 py-1 text-left font-medium">
                                                    Facing
                                                  </th>
                                                  <th className="px-2 py-1 text-left font-medium">
                                                    Features
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {flatList.length === 0 ? (
                                                  <tr>
                                                    <td
                                                      colSpan={7}
                                                      className="px-2 py-2 text-center text-muted-foreground"
                                                    >
                                                      No flats on this floor
                                                    </td>
                                                  </tr>
                                                ) : (
                                                  flatList.map((flat, idx) => (
                                                    <tr
                                                      key={idx}
                                                      className="border-b last:border-0"
                                                    >
                                                      <td className="px-2 py-1 font-medium">
                                                        {flat.flatNumber}
                                                      </td>
                                                      <td className="px-2 py-1">
                                                        {flat.area} sqft
                                                      </td>
                                                      <td className="px-2 py-1">
                                                        {flat.bedrooms}
                                                      </td>
                                                      <td className="px-2 py-1">
                                                        {flat.bathrooms}
                                                      </td>
                                                      <td className="px-2 py-1">
                                                        {formatINR(flat.price)}
                                                      </td>
                                                      <td className="px-2 py-1">
                                                        {flat.features
                                                          ?.facing || "-"}
                                                      </td>
                                                      <td className="px-2 py-1">
                                                        <div className="flex flex-wrap gap-1">
                                                          {flat?.features
                                                            .parking && (
                                                            <Badge variant="outline">
                                                              Parking
                                                            </Badge>
                                                          )}
                                                          {flat?.features
                                                            .balcony && (
                                                            <Badge variant="outline">
                                                              Balcony
                                                            </Badge>
                                                          )}
                                                          {flat?.features
                                                            .furnished &&
                                                            flat?.features
                                                              .furnished !==
                                                              "unfurnished" && (
                                                              <Badge variant="outline">
                                                                {
                                                                  flat?.features
                                                                    .furnished
                                                                }
                                                              </Badge>
                                                            )}
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  ))
                                                )}
                                              </tbody>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Tower Dialog */}
      <AddTowerDialog
        open={addTowerOpen}
        onOpenChange={setAddTowerOpen}
        onSave={handleCreateTower}
      />

      {/* Add Floor Dialog */}
      {selectedTower && (
        <AddFloorDialog
          open={addFloorOpen}
          onOpenChange={setAddFloorOpen}
          tower={selectedTower}
          onSave={(data) => handleAddFloor(selectedTower, data)}
        />
      )}

      {/* Add Flat Dialog (direct) */}
      <FlatFormDialog
        open={flatDialogOpen}
        onOpenChange={setFlatDialogOpen}
        flat={null}
        onSave={saveFlat}
      />
    </div>
  );
}
