// src/components/project/OverviewTab/WeatherCard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectApi } from "@/api/projectApi";
import { toast } from "sonner";
import { CloudSun, Plus, History, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { canMutate } from "@/data/permissions";
import { useAuthStore } from "@/store/authStore";

export function WeatherCard({ projectId, canOperationsEdit }) {

  const [logs, setLogs] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [open, setOpen] = useState(false);
  const [allLogsOpen, setAllLogsOpen] = useState(false);
  const [allLogs, setAllLogs] = useState([]);
  const [loadingAllLogs, setLoadingAllLogs] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    temperature: "",
    humidity: "",
    weatherCondition: "",
    windSpeed: "",
    rainfall: "",
    remarks: "",
  });

  const fetchLogs = async () => {
    try {
      const res = await projectApi.getWeatherLogs(projectId);
      const allLogs = res.data?.data || [];
      setLogs(allLogs);

      // Filter log for today's date
      const todayStr = new Date().toISOString().split("T")[0];
      const todaysEntry = allLogs.find((log) => {
        const logDate = new Date(log.date).toISOString().split("T")[0];
        return logDate === todayStr;
      });
      setTodayLog(todaysEntry || null);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllLogs = async () => {
    setLoadingAllLogs(true);
    try {
      const res = await projectApi.getWeatherLogs(projectId);
      const allLogs = res.data?.data || [];
      // Sort by date descending (latest first)
      const sorted = [...allLogs].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setAllLogs(sorted);
    } catch (err) {
      toast.error("Failed to load weather history");
    } finally {
      setLoadingAllLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!form.date) form.date = new Date().toISOString().split("T")[0];
    try {
      await projectApi.addWeatherLog(projectId, form);
      toast.success("Weather log added");
      setOpen(false);
      setForm({
        date: new Date().toISOString().split("T")[0],
        temperature: "",
        humidity: "",
        weatherCondition: "",
        windSpeed: "",
        rainfall: "",
        remarks: "",
      });
      fetchLogs();
      // Also refresh all logs modal if open
      if (allLogsOpen) fetchAllLogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add log");
    }
  };

  const openAllLogsModal = () => {
    setAllLogsOpen(true);
    fetchAllLogs();
  };

  const getWeatherEmoji = (condition) => {
    switch (condition?.toLowerCase()) {
      case "sunny":
        return "☀️";
      case "cloudy":
        return "☁️";
      case "rainy":
        return "🌧️";
      case "windy":
        return "💨";
      case "storm":
        return "⛈️";
      default:
        return "🌡️";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center gap-2">
            <CloudSun className="h-4 w-4" />
            Weather Today
          </CardTitle>
          {logs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={openAllLogsModal}
            >
              <History className="h-3 w-3 mr-1" />
              History
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {todayLog ? (
          <div>
            <p className="text-lg font-semibold">
              {getWeatherEmoji(todayLog.weatherCondition)}{" "}
              {todayLog.weatherCondition || "—"}{" "}
              {todayLog.temperature ? `${todayLog.temperature}°C` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(todayLog.date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <div className="mt-1 text-sm space-y-0.5">
              <p>💧 Humidity: {todayLog.humidity ?? "—"}%</p>
              <p>💨 Wind: {todayLog.windSpeed ?? "—"} km/h</p>
              <p>🌧️ Rainfall: {todayLog.rainfall ?? "—"} mm</p>
              {todayLog.remarks && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  "{todayLog.remarks}"
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No weather data for today
          </p>
        )}
        {canOperationsEdit && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                <Plus className="h-3 w-3 mr-1" />
                {todayLog ? "Update Today's Log" : "Add Log"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {todayLog ? "Update Today's Weather" : "Add Weather Log"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <Input
                  placeholder="Temperature (°C)"
                  type="number"
                  value={form.temperature}
                  onChange={(e) =>
                    setForm({ ...form, temperature: e.target.value })
                  }
                />
                <Input
                  placeholder="Humidity (%)"
                  type="number"
                  value={form.humidity}
                  onChange={(e) =>
                    setForm({ ...form, humidity: e.target.value })
                  }
                />
                <Select
                  value={form.weatherCondition}
                  onValueChange={(v) =>
                    setForm({ ...form, weatherCondition: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Weather condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">☀️ Sunny</SelectItem>
                    <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                    <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                    <SelectItem value="windy">💨 Windy</SelectItem>
                    <SelectItem value="storm">⛈️ Storm</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Wind speed (km/h)"
                  type="number"
                  value={form.windSpeed}
                  onChange={(e) =>
                    setForm({ ...form, windSpeed: e.target.value })
                  }
                />
                <Input
                  placeholder="Rainfall (mm)"
                  type="number"
                  step="0.1"
                  value={form.rainfall}
                  onChange={(e) =>
                    setForm({ ...form, rainfall: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Remarks (optional)"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm({ ...form, remarks: e.target.value })
                  }
                />
                <Button onClick={handleSubmit} className="w-full">
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>

      {/* All Logs Modal */}
      <Dialog
        open={allLogsOpen}
        onOpenChange={(open) => {
          setAllLogsOpen(open);
          if (!open) setAllLogs([]);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Weather History</DialogTitle>
          </DialogHeader>
          {loadingAllLogs ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : allLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No weather logs found.
            </p>
          ) : (
            <div className="space-y-3">
              {allLogs.map((log) => (
                <div key={log._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {getWeatherEmoji(log.weatherCondition)}{" "}
                        {log.weatherCondition || "—"} •{" "}
                        {log.temperature ? `${log.temperature}°C` : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>💧 Humidity: {log.humidity ?? "—"}%</div>
                    <div>💨 Wind: {log.windSpeed ?? "—"} km/h</div>
                    <div>🌧️ Rainfall: {log.rainfall ?? "—"} mm</div>
                    <div>📝 By: {log.recordedBy?.name || "Unknown"}</div>
                  </div>
                  {log.remarks && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      "{log.remarks}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
