import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHR } from "@/hooks/useHR";
import { toast } from "sonner";
import { formatDate } from "@/lib/helpers";

export function AnnouncementsTab({ announcements, canEdit, onRefresh }) {
  const { createAnnouncement, loading } = useHR();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    expiresAt: "",
  });

  const handleSubmit = async () => {
    if (!form.title || !form.message) {
      toast.error("Title and message are required");
      return;
    }
    const payload = {
      title: form.title,
      message: form.message,
      expiresAt: form.expiresAt || undefined,
    };
    const success = await createAnnouncement(payload);
    if (success) {
      setDialogOpen(false);
      setForm({ title: "", message: "", expiresAt: "" });
      onRefresh?.();
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {announcements.length} announcement(s)
        </p>
        {canEdit && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> New Announcement
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No announcements
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((ann) => (
                  <TableRow key={ann._id}>
                    <TableCell className="font-medium">{ann.title}</TableCell>
                    <TableCell>{ann.message}</TableCell>
                    <TableCell>{formatDate(ann.createdAt)}</TableCell>
                    <TableCell>
                      {ann.expiresAt ? formatDate(ann.expiresAt) : "Never"}
                    </TableCell>
                    <TableCell>
                      {isExpired(ann.expiresAt) ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Announcement Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Holiday Notice"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Message *</Label>
              <Textarea
                rows={3}
                placeholder="Announcement details..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <div>
              <Label>Expiry Date (Optional)</Label>
              <Input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                After expiry, the announcement will be marked as expired (not
                deleted).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              Post Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
