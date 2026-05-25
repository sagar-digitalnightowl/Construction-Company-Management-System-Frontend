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
import { useProject } from "@/hooks/useProject";
import { authApi, projectApi } from "@/api";
import { bookingApi } from "@/api/bookingApi";
import { PAYMENT_MODE } from "@/data/constants/booking";
import { formatINR } from "@/lib/helpers";
import { toast } from "sonner";

export function CreateBookingDialog({ open, onOpenChange, onSuccess }) {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    clientId: "",
    unitNumber: "",
    advanceAmount: "",
    paymentMode: "",
    transactionId: "",
    remarks: "",
    agreementDate: "",
    nomineeName: "",
    nomineeRelation: "",
  });

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

  useEffect(() => {
    if (open) {
      fetchProjects();
      authApi
        .getUsers({ role: "client", limit: 100 })
        .then((res) => setClients(res.data?.data?.users || []))
        .catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    if (form.projectId) {
      const project = projects.find((p) => p._id === form.projectId);
      if (project?.units)
        setUnits(project.units.filter((u) => u.status === "available"));
      else setUnits([]);
    } else setUnits([]);
  }, [form.projectId, projects]);

  const handleSubmit = async () => {
    if (!form.projectId || !form.unitNumber || !form.advanceAmount) {
      toast.error("Project, unit, and advance amount required");
      return;
    }
    setLoading(true);
    const payload = {
      projectId: form.projectId,
      unitNumber: form.unitNumber,
      advanceAmount: Number(form.advanceAmount),
      paymentMode: form.paymentMode,
      transactionId: form.transactionId || undefined,
      remarks: form.remarks || undefined,
      agreementDate: form.agreementDate || undefined,
      nomineeName: form.nomineeName || undefined,
      nomineeRelation: form.nomineeRelation || undefined,
    };
    // Convert "none" to undefined for clientId
    if (form.clientId && form.clientId !== "none") {
      payload.clientId = form.clientId;
    }
    try {
      const res = await bookingApi.createBooking(payload);
      toast.success("Booking created successfully");
      onSuccess?.(res.data?.data);
      onOpenChange(false);
      setForm({
        projectId: "",
        clientId: "",
        unitNumber: "",
        advanceAmount: "",
        paymentMode: "",
        transactionId: "",
        remarks: "",
        agreementDate: "",
        nomineeName: "",
        nomineeRelation: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto p-1">
          <div>
            <Label>Project *</Label>
            <Select
              value={form.projectId}
              onValueChange={(v) =>
                setForm({ ...form, projectId: v, unitNumber: "" })
              }
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
          <div>
            <Label>Client (leave empty for self-booking)</Label>
            <Select
              value={form.clientId || "none"}
              onValueChange={(v) => setForm({ ...form, clientId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (self-booking)</SelectItem>
                {clients?.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name} ({c.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Unit Number *</Label>
            <Select
              value={form.unitNumber}
              onValueChange={(v) => setForm({ ...form, unitNumber: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units?.map((u) => (
                  <SelectItem key={u.unitNumber} value={u.unitNumber}>
                    #{u.unitNumber} - {u.bedrooms} BHK - {formatINR(u.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Advance Amount *</Label>
            <Input
              type="number"
              value={form.advanceAmount}
              onChange={(e) =>
                setForm({ ...form, advanceAmount: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Payment Mode</Label>
            <Select
              value={form.paymentMode}
              onValueChange={(v) => setForm({ ...form, paymentMode: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PAYMENT_MODE).map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Transaction ID (if Cheque/Bank Transfer/Card)</Label>
            <Input
              value={form.transactionId}
              onChange={(e) =>
                setForm({ ...form, transactionId: e.target.value })
              }
            />
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
          <div>
            <Label>Nominee Name</Label>
            <Input
              value={form.nomineeName}
              onChange={(e) =>
                setForm({ ...form, nomineeName: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Nominee Relation</Label>
            <Input
              value={form.nomineeRelation}
              onChange={(e) =>
                setForm({ ...form, nomineeRelation: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Remarks</Label>
            <Input
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Create Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
