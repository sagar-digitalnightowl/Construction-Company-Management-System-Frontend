// src/components/site/CreateDailyReportDialog.jsx
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
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { taskApi } from "@/api";

export function CreateDailyReportDialog({
  open,
  onOpenChange,
  projects,
  initialData,
  onSubmit,
}) {
  const [form, setForm] = useState({
    projectId: "",
    date: new Date().toISOString().split("T")[0],
    weather: "",
    temperature: "",
    humidity: "",
    workDone: [],
    nextDayPlan: "",
    siteImages: [],
    laborCount: { skilled: "", semiSkilled: "", unskilled: "" },
    machineryUsed: [],
    materialReceived: [],
    safetyObservation: "",
    progress: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch tasks when project changes
  useEffect(() => {
    if (form.projectId) {
      const fetchTasks = async () => {
        setLoadingTasks(true);
        try {
          const res = await taskApi.getMyTasks({ limit: 100 });
          const myTaskOfThisProject = res.data?.data?.tasks?.filter(
            (task) => task.projectId?._id.toString() === form.projectId,
          );
          setTasks(myTaskOfThisProject || []);
        } catch (err) {
          console.error("Failed to fetch tasks", err);
        } finally {
          setLoadingTasks(false);
        }
      };
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [form.projectId]);

  useEffect(() => {
    if (initialData) {
      setForm({
        projectId: initialData.projectId?._id || initialData.projectId || "",
        date: initialData.date?.split("T")[0] || "",
        weather: initialData.weather || "",
        temperature: initialData.temperature ?? "",
        humidity: initialData.humidity ?? "",
        workDone: initialData.workDone || [],
        nextDayPlan: initialData.nextDayPlan || "",
        siteImages: initialData.siteImages || [],
        laborCount: initialData.laborCount || {
          skilled: "",
          semiSkilled: "",
          unskilled: "",
        },
        machineryUsed: initialData.machineryUsed || [],
        materialReceived: initialData.materialReceived || [],
        safetyObservation: initialData.safetyObservation || "",
        progress: initialData.progress ?? 0,
      });
    } else {
      setForm({
        projectId: "",
        date: new Date().toISOString().split("T")[0],
        weather: "",
        temperature: "",
        humidity: "",
        workDone: [],
        nextDayPlan: "",
        siteImages: [],
        laborCount: { skilled: "", semiSkilled: "", unskilled: "" },
        machineryUsed: [],
        materialReceived: [],
        safetyObservation: "",
        progress: 0,
      });
    }
  }, [initialData, open]);

  // Work Done handlers
  const handleWorkDoneChange = (idx, field, value) => {
    const newWorkDone = [...form.workDone];
    newWorkDone[idx] = { ...newWorkDone[idx], [field]: value };
    setForm({ ...form, workDone: newWorkDone });
  };
  const addWorkDone = () => {
    setForm({
      ...form,
      workDone: [
        ...form.workDone,
        {
          taskName: "",
          taskId: "",
          quantity: "",
          unit: "",
          location: "",
          remarks: "",
        },
      ],
    });
  };
  const removeWorkDone = (idx) => {
    setForm({ ...form, workDone: form.workDone.filter((_, i) => i !== idx) });
  };

  // Machinery Used handlers
  const handleMachineryChange = (idx, field, value) => {
    const newMachinery = [...form.machineryUsed];
    newMachinery[idx] = { ...newMachinery[idx], [field]: value };
    setForm({ ...form, machineryUsed: newMachinery });
  };
  const addMachinery = () => {
    setForm({
      ...form,
      machineryUsed: [
        ...form.machineryUsed,
        { name: "", hours: "", remarks: "" },
      ],
    });
  };
  const removeMachinery = (idx) => {
    setForm({
      ...form,
      machineryUsed: form.machineryUsed.filter((_, i) => i !== idx),
    });
  };

  // Material Received handlers
  const handleMaterialChange = (idx, field, value) => {
    const newMaterials = [...form.materialReceived];
    newMaterials[idx] = { ...newMaterials[idx], [field]: value };
    setForm({ ...form, materialReceived: newMaterials });
  };
  const addMaterial = () => {
    setForm({
      ...form,
      materialReceived: [
        ...form.materialReceived,
        { materialName: "", quantity: "", unit: "", fromVendor: "" },
      ],
    });
  };
  const removeMaterial = (idx) => {
    setForm({
      ...form,
      materialReceived: form.materialReceived.filter((_, i) => i !== idx),
    });
  };

  // Helper to clean and convert numbers
  const preparePayload = () => {
    const payload = {
      projectId: form.projectId,
      date: form.date,
    };

    if (form.weather) payload.weather = form.weather;
    if (form.temperature !== "" && !isNaN(Number(form.temperature)))
      payload.temperature = Number(form.temperature);
    if (form.humidity !== "" && !isNaN(Number(form.humidity)))
      payload.humidity = Number(form.humidity);
    if (form.nextDayPlan) payload.nextDayPlan = form.nextDayPlan;
    if (form.safetyObservation)
      payload.safetyObservation = form.safetyObservation;
    if (form.progress !== "" && !isNaN(Number(form.progress)))
      payload.progress = Number(form.progress);
    if (form.siteImages.length) payload.siteImages = form.siteImages;

    // Work Done
    if (form.workDone.length) {
      payload.workDone = form.workDone
        .filter((item) => item.taskName && item.quantity && item.unit)
        .map((item) => ({
          taskName: item.taskName,
          quantity: Number(item.quantity),
          unit: item.unit,
          ...(item.taskId && { taskId: item.taskId }),
          ...(item.location && { location: item.location }),
          ...(item.remarks && { remarks: item.remarks }),
        }));
    }

    // Labor Count
    const labor = form.laborCount;
    payload.laborCount = {
      skilled: Number(labor.skilled) || 0,
      semiSkilled: Number(labor.semiSkilled) || 0,
      unskilled: Number(labor.unskilled) || 0,
      total:
        Number(labor.skilled) +
          Number(labor.semiSkilled) +
          Number(labor.unskilled) || 0,
    };

    // Machinery Used
    if (form.machineryUsed.length) {
      payload.machineryUsed = form.machineryUsed
        .filter((item) => item.name)
        .map((item) => ({
          name: item.name,
          ...(item.hours && { hours: Number(item.hours) }),
          ...(item.remarks && { remarks: item.remarks }),
        }));
    }

    // Material Received
    if (form.materialReceived.length) {
      payload.materialReceived = form.materialReceived
        .filter((item) => item.materialName && item.quantity && item.unit)
        .map((item) => ({
          materialName: item.materialName,
          quantity: Number(item.quantity),
          unit: item.unit,
          ...(item.fromVendor && { fromVendor: item.fromVendor }),
        }));
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (!form.projectId) return toast.error("Project is required");
    if (!form.date) return toast.error("Date is required");
    const payload = preparePayload();
    setLoading(true);
    const success = await onSubmit(payload);
    setLoading(false);
    if (success) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Daily Report" : "Create Daily Report"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-1">
            <Label>Project *</Label>
            <Select
              value={form.projectId}
              onValueChange={(v) => setForm({ ...form, projectId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Weather</Label>
              <Select
                value={form.weather}
                onValueChange={(v) => setForm({ ...form, weather: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="windy">Windy</SelectItem>
                  <SelectItem value="storm">Storm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Temperature (°C)</Label>
              <Input
                type="number"
                step="any"
                value={form.temperature}
                onChange={(e) =>
                  setForm({ ...form, temperature: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Humidity (%)</Label>
              <Input
                type="number"
                step="any"
                value={form.humidity}
                onChange={(e) => setForm({ ...form, humidity: e.target.value })}
              />
            </div>
          </div>

          {/* Work Done with Task Selection */}
          <div className="space-y-2">
            <Label className="block">Work Done</Label>
            {form.workDone.map((item, idx) => (
              <div key={idx} className="border rounded-md p-2 space-y-2">
                {/* Task selection dropdown */}
                <div className="flex gap-2 items-center">
                  <Select
                    value={item.taskId}
                    onValueChange={(val) => {
                      const selectedTask = tasks.find((t) => t._id === val);
                      handleWorkDoneChange(idx, "taskId", val);
                      handleWorkDoneChange(
                        idx,
                        "taskName",
                        selectedTask?.title || "",
                      );
                    }}
                    disabled={loadingTasks}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue
                        placeholder={
                          loadingTasks ? "Loading tasks..." : "Select task"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.map((task) => (
                        <SelectItem key={task._id} value={task._id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Optional manual task name */}
                  <Input
                    placeholder="Or custom task name"
                    value={item.taskName}
                    onChange={(e) =>
                      handleWorkDoneChange(idx, "taskName", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeWorkDone(idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Quantity *"
                    value={item.quantity}
                    onChange={(e) =>
                      handleWorkDoneChange(idx, "quantity", e.target.value)
                    }
                    className=""
                  />
                  <Input
                    placeholder="Unit *"
                    value={item.unit}
                    onChange={(e) =>
                      handleWorkDoneChange(idx, "unit", e.target.value)
                    }
                    className=""
                  />
                </div>
                <Input
                  placeholder="Location"
                  value={item.location}
                  onChange={(e) =>
                    handleWorkDoneChange(idx, "location", e.target.value)
                  }
                />
                <Input
                  placeholder="Remarks"
                  value={item.remarks}
                  onChange={(e) =>
                    handleWorkDoneChange(idx, "remarks", e.target.value)
                  }
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={addWorkDone}
              disabled={!form.projectId}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Work Done
            </Button>
          </div>

          <div className="space-y-1">
            <Label>Next Day Plan</Label>
            <Textarea
              rows={2}
              value={form.nextDayPlan}
              onChange={(e) =>
                setForm({ ...form, nextDayPlan: e.target.value })
              }
            />
          </div>

          {/* Labor Count */}
          <div className="space-y-1">
            <Label>Labor Count</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Skilled"
                value={form.laborCount.skilled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    laborCount: { ...form.laborCount, skilled: e.target.value },
                  })
                }
              />
              <Input
                type="number"
                placeholder="Semi-skilled"
                value={form.laborCount.semiSkilled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    laborCount: {
                      ...form.laborCount,
                      semiSkilled: e.target.value,
                    },
                  })
                }
              />
              <Input
                type="number"
                placeholder="Unskilled"
                value={form.laborCount.unskilled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    laborCount: {
                      ...form.laborCount,
                      unskilled: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Machinery Used */}
          <div className="space-y-2">
            <Label className="block">Machinery Used</Label>
            {form.machineryUsed.map((item, idx) => (
              <div key={idx} className="border rounded-md p-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Machine name *"
                    value={item.name}
                    onChange={(e) =>
                      handleMachineryChange(idx, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Hours"
                    value={item.hours}
                    onChange={(e) =>
                      handleMachineryChange(idx, "hours", e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Remarks"
                    value={item.remarks}
                    onChange={(e) =>
                      handleMachineryChange(idx, "remarks", e.target.value)
                    }
                  />
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => removeMachinery(idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={addMachinery}>
              <Plus className="h-3 w-3 mr-1" /> Add Machinery
            </Button>
          </div>

          {/* Material Received */}
          <div className="space-y-2">
            <Label className="block">Material Received</Label>
            {form.materialReceived.map((item, idx) => (
              <div key={idx} className="border rounded-md p-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Material name *"
                    value={item.materialName}
                    onChange={(e) =>
                      handleMaterialChange(idx, "materialName", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Quantity *"
                    value={item.quantity}
                    onChange={(e) =>
                      handleMaterialChange(idx, "quantity", e.target.value)
                    }
                    className="w-24"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Unit *"
                    value={item.unit}
                    onChange={(e) =>
                      handleMaterialChange(idx, "unit", e.target.value)
                    }
                    className="w-20"
                  />
                  <Input
                    placeholder="From Vendor"
                    value={item.fromVendor}
                    onChange={(e) =>
                      handleMaterialChange(idx, "fromVendor", e.target.value)
                    }
                  />
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => removeMaterial(idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={addMaterial}>
              <Plus className="h-3 w-3 mr-1" /> Add Material
            </Button>
          </div>

          <div className="space-y-1">
            <Label>Progress (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Safety Observation</Label>
            <Textarea
              rows={2}
              value={form.safetyObservation}
              onChange={(e) =>
                setForm({ ...form, safetyObservation: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
