// src/components/project/OverviewTab/VisitorsCard.jsx
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, LogOut } from "lucide-react";
import { projectApi } from "@/api/projectApi";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";

export function VisitorsCard({ projectId, canOperationsEdit }) {
  const [visitors, setVisitors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    visitorName: "",
    purpose: "",
    phone: "",
    notes: "",
    checkIn: new Date().toISOString().slice(0, 16),
  });

  const fetchVisitors = async () => {
    try {
      const res = await projectApi.getVisitors(projectId);
      setVisitors(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [projectId]);

  const handleSubmit = async () => {
    if (!form.visitorName || !form.purpose) {
      toast.error("Name and purpose are required");
      return;
    }
    try {
      await projectApi.addVisitor(projectId, form);
      toast.success("Visitor added");
      setOpen(false);
      fetchVisitors();
      setForm({
        visitorName: "",
        purpose: "",
        phone: "",
        notes: "",
        checkIn: new Date().toISOString().slice(0, 16),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add visitor");
    }
  };

  const handleCheckout = async (visitorId) => {
    try {
      await projectApi.checkoutVisitor(projectId, visitorId);
      toast.success("Visitor checked out");
      fetchVisitors();
    } catch (err) {
      toast.error("Checkout failed");
    }
  };

  const activeVisitors = visitors.filter((v) => !v.checkOut);
  const pastVisitors = visitors.filter((v) => v.checkOut);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" /> Visitors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeVisitors.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Current on site
            </p>
            {activeVisitors.map((v) => (
              <div
                key={v._id}
                className="flex justify-between items-center border-b pb-1 mb-1"
              >
                <div>
                  <p className="text-sm font-medium">{v.visitorName}</p>
                  <p className="text-xs text-muted-foreground">{v.purpose}</p>
                  <p className="text-xs">
                    In: {new Date(v.checkIn).toLocaleTimeString()}
                  </p>
                </div>
                {canOperationsEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCheckout(v._id)}
                  >
                    <LogOut className="h-3 w-3" /> Out
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        {pastVisitors.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Past visitors
            </p>
            {pastVisitors.slice(0, 3).map((v) => (
              <div key={v._id} className="text-sm border-b pb-1 mb-1">
                <span className="font-medium">{v.visitorName}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {new Date(v.checkIn).toLocaleDateString()}
                </span>
                <Badge variant="outline" className="ml-2 text-xs">
                  Out
                </Badge>
              </div>
            ))}
            {pastVisitors.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{pastVisitors.length - 3} more
              </p>
            )}
          </div>
        )}
        {visitors.length === 0 && (
          <p className="text-sm text-muted-foreground">No visitors yet</p>
        )}
        {canOperationsEdit && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Plus className="h-3 w-3 mr-1" /> New Visitor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Visitor</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={form.visitorName}
                    onChange={(e) =>
                      setForm({ ...form, visitorName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Purpose *</Label>
                  <Input
                    value={form.purpose}
                    onChange={(e) =>
                      setForm({ ...form, purpose: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Check-in time</Label>
                  <Input
                    type="datetime-local"
                    value={form.checkIn}
                    onChange={(e) =>
                      setForm({ ...form, checkIn: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleSubmit}>Add Visitor</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
