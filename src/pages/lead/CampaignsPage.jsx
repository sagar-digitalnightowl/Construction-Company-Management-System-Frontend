import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLead } from "@/hooks/useLead";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import CampaignFormModal from "@/components/lead/CampaignFormModal";

const CampaignsPage = () => {
  const { campaigns, fetchCampaigns, deleteCampaign } = useLead();
  const [open, setOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async () => {
    if (confirmId) {
      await deleteCampaign(confirmId);
      setConfirmId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Calling Campaigns</h2>
        <Button
          onClick={() => {
            setEditingCampaign(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> New Campaign
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((camp) => (
                <TableRow key={camp._id}>
                  <TableCell className="font-mono text-xs">
                    {camp.campaignCode}
                  </TableCell>
                  <TableCell className="font-medium">{camp.name}</TableCell>
                  <TableCell className="capitalize">{camp.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        camp.priority === "high" ? "destructive" : "secondary"
                      }
                    >
                      {camp.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={camp.status === "active" ? "success" : "outline"}
                    >
                      {camp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(camp.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(camp.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingCampaign(camp);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setConfirmId(camp._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {campaigns.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No campaigns found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CampaignFormModal
        open={open}
        onOpenChange={setOpen}
        editingCampaign={editingCampaign}
        onSuccess={() => {
          setOpen(false);
          setEditingCampaign(null);
          fetchCampaigns();
        }}
      />

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(v) => !v && setConfirmId(null)}
        title="Delete Campaign?"
        description="This will permanently delete the campaign and unassign its leads."
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CampaignsPage;
