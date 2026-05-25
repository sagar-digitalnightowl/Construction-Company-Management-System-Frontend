// src/components/project/DprTab.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Trash2,
  Eye,
  Loader2,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  CloudSnow,
} from "lucide-react";
import { toast } from "sonner";
import { projectApi } from "@/api/projectApi";

const getWeatherIcon = (weather) => {
  switch (weather?.toLowerCase()) {
    case "sunny":
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case "cloudy":
      return <Cloud className="h-4 w-4 text-gray-500" />;
    case "rainy":
      return <CloudRain className="h-4 w-4 text-blue-500" />;
    case "windy":
      return <Wind className="h-4 w-4 text-teal-500" />;
    case "storm":
      return <CloudSnow className="h-4 w-4 text-purple-500" />;
    default:
      return null;
  }
};

export function DprTab({ projectId, canOperationsEdit }) {
  const [dprs, setDprs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedDpr, setSelectedDpr] = useState(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weather: "",
    temperature: "",
    workDone: [{ taskName: "", quantity: "", unit: "" }],
    nextDayPlan: "",
    issues: [],
    siteImages: [],
    laborCount: { skilled: "", semiSkilled: "", unskilled: "" },
    machineryUsed: [{ name: "", hours: "" }],
    materialReceived: "",
    safetyObservation: "",
    progress: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchDprs = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getDPR(projectId);
      setDprs(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load DPRs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDprs();
  }, [projectId]);

  const uploadImage = async (file) => {
    try {
      const presignRes = await projectApi.getPresignedUrl(projectId, {
        fileName: file.name,
        fileType: "site",
        mimeType: file.type,
      });
      const { uploadUrl, fileKey } = presignRes.data.data;
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      const res = await projectApi.confirmUpload(projectId, {
        fileKey,
        fileType: "site",
      });
      return res.data.data?.fileUrl;
    } catch (err) {
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) uploaded.push(url);
    }
    setForm({ ...form, siteImages: [...form.siteImages, ...uploaded] });
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm({
      ...form,
      siteImages: form.siteImages.filter((_, i) => i !== index),
    });
  };

  const handleWorkDoneChange = (idx, field, value) => {
    const newWork = [...form.workDone];
    newWork[idx][field] = value;
    setForm({ ...form, workDone: newWork });
  };

  const addWorkDoneRow = () => {
    setForm({
      ...form,
      workDone: [...form.workDone, { taskName: "", quantity: "", unit: "" }],
    });
  };

  const removeWorkDoneRow = (idx) => {
    if (form.workDone.length === 1) return;
    const newWork = form.workDone.filter((_, i) => i !== idx);
    setForm({ ...form, workDone: newWork });
  };

  const handleMachineryChange = (idx, field, value) => {
    const newMach = [...form.machineryUsed];
    newMach[idx][field] = value;
    setForm({ ...form, machineryUsed: newMach });
  };

  const addMachineryRow = () => {
    setForm({
      ...form,
      machineryUsed: [...form.machineryUsed, { name: "", hours: "" }],
    });
  };

  const removeMachineryRow = (idx) => {
    if (form.machineryUsed.length === 1) return;
    const newMach = form.machineryUsed.filter((_, i) => i !== idx);
    setForm({ ...form, machineryUsed: newMach });
  };

  const handleSubmit = async () => {
    if (!form.date) return toast.error("Date required");
    const payload = {
      date: form.date,
      weather: form.weather || undefined,
      temperature: form.temperature ? Number(form.temperature) : undefined,
      workDone: form.workDone.filter((w) => w.taskName.trim()),
      nextDayPlan: form.nextDayPlan || undefined,
      issues: form.issues.filter((i) => i.trim()),
      siteImages: form.siteImages,
      laborCount: {
        skilled: Number(form.laborCount.skilled) || 0,
        semiSkilled: Number(form.laborCount.semiSkilled) || 0,
        unskilled: Number(form.laborCount.unskilled) || 0,
      },
      machineryUsed: form.machineryUsed
        .filter((m) => m.name.trim())
        .map((m) => ({ name: m.name, hours: Number(m.hours) || 0 })),
      materialReceived: form.materialReceived
        ? Number(form.materialReceived)
        : undefined,
      safetyObservation: form.safetyObservation || undefined,
      progress: form.progress ? Number(form.progress) : undefined,
    };
    setSubmitting(true);
    try {
      await projectApi.createDPR(projectId, payload);
      toast.success("DPR created");
      setOpen(false);
      fetchDprs();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create DPR");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split("T")[0],
      weather: "",
      temperature: "",
      workDone: [{ taskName: "", quantity: "", unit: "" }],
      nextDayPlan: "",
      issues: [],
      siteImages: [],
      laborCount: { skilled: "", semiSkilled: "", unskilled: "" },
      machineryUsed: [{ name: "", hours: "" }],
      materialReceived: "",
      safetyObservation: "",
      progress: "",
    });
  };

  const handleDelete = async (dprId) => {
    if (!confirm("Are you sure you want to delete this DPR?")) return;
    try {
      // Note: Add delete endpoint if available, else just refresh
      // For now, assuming no delete API, we'll just show error
      toast.error("Delete not implemented yet");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Daily Progress Reports</h2>
        {canOperationsEdit && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> New DPR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Daily Progress Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Weather</Label>
                    <Select
                      value={form.weather}
                      onValueChange={(v) => setForm({ ...form, weather: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunny">☀️ Sunny</SelectItem>
                        <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                        <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                        <SelectItem value="windy">💨 Windy</SelectItem>
                        <SelectItem value="storm">⛈️ Storm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Temperature (°C)</Label>
                    <Input
                      type="number"
                      value={form.temperature}
                      onChange={(e) =>
                        setForm({ ...form, temperature: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Progress (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={form.progress}
                      onChange={(e) =>
                        setForm({ ...form, progress: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Work Done</Label>
                  {form.workDone.map((w, idx) => (
                    <div key={idx} className="flex gap-2 mt-2 items-center">
                      <Input
                        placeholder="Task name"
                        value={w.taskName}
                        onChange={(e) =>
                          handleWorkDoneChange(idx, "taskName", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Quantity"
                        value={w.quantity}
                        onChange={(e) =>
                          handleWorkDoneChange(idx, "quantity", e.target.value)
                        }
                        className="w-28"
                      />
                      <Input
                        placeholder="Unit"
                        value={w.unit}
                        onChange={(e) =>
                          handleWorkDoneChange(idx, "unit", e.target.value)
                        }
                        className="w-24"
                      />
                      {form.workDone.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWorkDoneRow(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addWorkDoneRow}
                    className="mt-2"
                  >
                    + Add task
                  </Button>
                </div>

                <div>
                  <Label>Next Day Plan</Label>
                  <Textarea
                    rows={2}
                    value={form.nextDayPlan}
                    onChange={(e) =>
                      setForm({ ...form, nextDayPlan: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Issues (comma separated)</Label>
                  <Input
                    placeholder="Rain delay, material shortage"
                    value={form.issues.join(", ")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        issues: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Site Images</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.siteImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt="site"
                          className="w-20 h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-0 right-0 bg-red-500 rounded-full p-0.5"
                        >
                          <Trash2 className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading...
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Skilled Labor</Label>
                    <Input
                      type="number"
                      value={form.laborCount.skilled}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          laborCount: {
                            ...form.laborCount,
                            skilled: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Semi-skilled</Label>
                    <Input
                      type="number"
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
                  </div>
                  <div>
                    <Label>Unskilled</Label>
                    <Input
                      type="number"
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

                <div>
                  <Label>Machinery Used</Label>
                  {form.machineryUsed.map((m, idx) => (
                    <div key={idx} className="flex gap-2 mt-2 items-center">
                      <Input
                        placeholder="Machine name"
                        value={m.name}
                        onChange={(e) =>
                          handleMachineryChange(idx, "name", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Hours"
                        type="number"
                        value={m.hours}
                        onChange={(e) =>
                          handleMachineryChange(idx, "hours", e.target.value)
                        }
                        className="w-28"
                      />
                      {form.machineryUsed.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMachineryRow(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMachineryRow}
                    className="mt-2"
                  >
                    + Add machine
                  </Button>
                </div>

                <div>
                  <Label>Material Received (quantity)</Label>
                  <Input
                    type="number"
                    value={form.materialReceived}
                    onChange={(e) =>
                      setForm({ ...form, materialReceived: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Safety Observation</Label>
                  <Textarea
                    rows={2}
                    value={form.safetyObservation}
                    onChange={(e) =>
                      setForm({ ...form, safetyObservation: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting && (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    )}
                    Submit DPR
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {dprs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No daily progress reports yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dprs.map((dpr) => (
            <Card
              key={dpr._id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedDpr(dpr)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {new Date(dpr.date).toLocaleDateString()}
                      </p>
                      {dpr.isApproved ? (
                        <Badge variant="default" className="bg-green-500">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      {getWeatherIcon(dpr.weather)}
                      <span>{dpr.weather || "N/A"}</span>
                      {dpr.temperature && <span>• {dpr.temperature}°C</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-lg font-semibold">
                      {dpr.progress || 0}%
                    </Badge>
                    <Progress
                      value={dpr.progress || 0}
                      className="w-24 h-1 mt-1"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm">
                    <span className="font-medium">Work done:</span>{" "}
                    {dpr.workDone
                      ?.slice(0, 2)
                      .map((w) => `${w.taskName} (${w.quantity} ${w.unit})`)
                      .join(", ")}
                    {dpr.workDone?.length > 2 &&
                      ` +${dpr.workDone.length - 2} more`}
                  </p>
                  {dpr.nextDayPlan && (
                    <p className="text-sm mt-1 line-clamp-2">
                      <span className="font-medium">Next plan:</span>{" "}
                      {dpr.nextDayPlan}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t">
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>
                      👥{" "}
                      {Object.values(dpr.laborCount || {}).reduce(
                        (a, b) => a + (Number(b) || 0),
                        0,
                      )}{" "}
                      workers
                    </span>
                    {dpr.materialReceived > 0 && (
                      <span>📦 {dpr.materialReceived} units recv.</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDpr(dpr);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" /> Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedDpr} onOpenChange={() => setSelectedDpr(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedDpr && (
            <>
              <DialogHeader>
                <DialogTitle>
                  DPR Details -{" "}
                  {new Date(selectedDpr.date).toLocaleDateString()}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(selectedDpr.weather)}
                    <div>
                      <p className="font-medium">
                        Weather: {selectedDpr.weather || "Not recorded"}
                      </p>
                      {selectedDpr.temperature && (
                        <p className="text-sm text-muted-foreground">
                          Temperature: {selectedDpr.temperature}°C
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {selectedDpr.progress || 0}%
                    </p>
                    <Progress
                      value={selectedDpr.progress || 0}
                      className="w-32 h-2 mt-1"
                    />
                  </div>
                  {selectedDpr.isApproved ? (
                    <Badge variant="default" className="bg-green-500">
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>

                <div className="border rounded-lg p-3">
                  <h3 className="font-semibold mb-2">Work Done</h3>
                  {selectedDpr.workDone?.length ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left">Task</th>
                          <th className="text-left">Quantity</th>
                          <th className="text-left">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDpr.workDone.map((w, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td>{w.taskName}</td>
                            <td>{w.quantity}</td>
                            <td>{w.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted-foreground">
                      No work done recorded.
                    </p>
                  )}
                </div>

                {selectedDpr.nextDayPlan && (
                  <div className="border rounded-lg p-3">
                    <h3 className="font-semibold mb-1">Next Day Plan</h3>
                    <p className="text-sm">{selectedDpr.nextDayPlan}</p>
                  </div>
                )}

                {selectedDpr.issues?.length > 0 && (
                  <div className="border rounded-lg p-3 bg-red-50">
                    <h3 className="font-semibold mb-1 text-red-700">Issues</h3>
                    <ul className="list-disc list-inside text-sm text-red-600">
                      {selectedDpr.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3">
                    <h3 className="font-semibold mb-1">Labor Count</h3>
                    <div className="space-y-1 text-sm">
                      <p>Skilled: {selectedDpr.laborCount?.skilled || 0}</p>
                      <p>
                        Semi-skilled: {selectedDpr.laborCount?.semiSkilled || 0}
                      </p>
                      <p>Unskilled: {selectedDpr.laborCount?.unskilled || 0}</p>
                      <p className="font-medium mt-1">
                        Total:{" "}
                        {Object.values(selectedDpr.laborCount || {}).reduce(
                          (a, b) => a + (Number(b) || 0),
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h3 className="font-semibold mb-1">Machinery Used</h3>
                    {selectedDpr.machineryUsed?.length ? (
                      <ul className="text-sm space-y-1">
                        {selectedDpr.machineryUsed.map((m, i) => (
                          <li key={i}>
                            {m.name} - {m.hours} hrs
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">None</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedDpr.materialReceived > 0 && (
                    <div className="border rounded-lg p-3">
                      <h3 className="font-semibold mb-1">Material Received</h3>
                      <p className="text-sm">
                        {selectedDpr.materialReceived} units
                      </p>
                    </div>
                  )}
                  {selectedDpr.safetyObservation && (
                    <div className="border rounded-lg p-3">
                      <h3 className="font-semibold mb-1">Safety Observation</h3>
                      <p className="text-sm">{selectedDpr.safetyObservation}</p>
                    </div>
                  )}
                </div>

                {selectedDpr.siteImages?.length > 0 && (
                  <div className="border rounded-lg p-3">
                    <h3 className="font-semibold mb-2">Site Images</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDpr.siteImages.map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={img}
                            alt={`site-${i}`}
                            className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground text-right border-t pt-2">
                  Created: {new Date(selectedDpr.createdAt).toLocaleString()}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
