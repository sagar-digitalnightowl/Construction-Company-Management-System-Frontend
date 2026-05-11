import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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

const EMPTY = {
    name: "", description: "", clientName: "", clientPhone: "", clientEmail: "",
    location: "", startDate: "", endDate: "", budget: "", status: "planning",
    priority: "medium",
    address: { city: "", state: "", pincode: "" },
};


export function ProjectForm({ open, onOpenChange, initialData, onSave }) {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setForm({
                    name: initialData.name ?? "",
                    description: initialData.description ?? "",
                    clientName: initialData.clientName ?? "",
                    clientPhone: initialData.clientPhone ?? "",
                    clientEmail: initialData.clientEmail ?? "",
                    location: initialData.location ?? "",
                    startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : "",
                    endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
                    budget: initialData.budget ?? "",
                    status: initialData.status ?? "planning",
                    priority: initialData.priority ?? "medium",
                    address: {
                        city: initialData.address?.city ?? "",
                        state: initialData.address?.state ?? "",
                        pincode: initialData.address?.pincode ?? "",
                    },
                });
            } else {
                setForm(EMPTY);
            }
        }
    }, [open, initialData]);

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
    const setAddr = (key, val) => setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));

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
            <DialogContent className="w-[95%] sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Project" : "Create New Project"}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* Row 1: Name (full width) */}
                        <div className="col-span-2 space-y-1.5">
                            <Label>Project Name <span className="text-destructive">*</span></Label>
                            <Input
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                                placeholder="Sky Tower Construction"
                            />
                        </div>

                        {/* Row 2: Status + Priority */}
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <Select value={form.status} onValueChange={(v) => set("status", v)}>
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
                            <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {PRIORITY_OPTIONS.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Row 3: Client Name + Phone */}
                        <div className="space-y-1.5">
                            <Label>Client Name</Label>
                            <Input
                                value={form.clientName}
                                onChange={(e) => set("clientName", e.target.value)}
                                placeholder="ABC Developers"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Client Phone</Label>
                            <Input
                                value={form.clientPhone}
                                onChange={(e) => set("clientPhone", e.target.value)}
                                placeholder="+919876543210"
                            />
                        </div>

                        {/* Row 4: Client Email + Location */}
                        <div className="space-y-1.5">
                            <Label>Client Email</Label>
                            <Input
                                type="email"
                                value={form.clientEmail}
                                onChange={(e) => set("clientEmail", e.target.value)}
                                placeholder="client@example.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Location</Label>
                            <Input
                                value={form.location}
                                onChange={(e) => set("location", e.target.value)}
                                placeholder="Mumbai, Maharashtra"
                            />
                        </div>

                        {/* Row 5: Dates */}
                        <div className="space-y-1.5">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => set("startDate", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={form.endDate}
                                onChange={(e) => set("endDate", e.target.value)}
                            />
                        </div>

                        {/* Row 6: Budget */}
                        <div className="space-y-1.5">
                            <Label>Budget (₹)</Label>
                            <Input
                                type="number"
                                value={form.budget}
                                onChange={(e) => set("budget", e.target.value)}
                                placeholder="10000000"
                            />
                        </div>

                        {/* Address section */}
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-muted-foreground mb-2 mt-1">Address</p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label>City</Label>
                                    <Input
                                        value={form.address.city}
                                        onChange={(e) => setAddr("city", e.target.value)}
                                        placeholder="Mumbai"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>State</Label>
                                    <Input
                                        value={form.address.state}
                                        onChange={(e) => setAddr("state", e.target.value)}
                                        placeholder="Maharashtra"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Pincode</Label>
                                    <Input
                                        value={form.address.pincode}
                                        onChange={(e) => setAddr("pincode", e.target.value)}
                                        placeholder="400001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-span-2 space-y-1.5">
                            <Label>Description</Label>
                            <Textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => set("description", e.target.value)}
                                placeholder="Brief description of the project…"
                            />
                        </div>

                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving || !form.name?.trim()} data-testid="proj-form-save">
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                        {isEditing ? "Save Changes" : "Create Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}