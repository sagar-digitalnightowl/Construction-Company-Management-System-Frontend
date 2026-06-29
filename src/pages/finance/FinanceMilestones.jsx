// src/pages/finance/FinanceMilestones.jsx
import React, { useEffect, useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useProjectsStore } from "@/store/dataStore";
import { formatDate } from "@/lib/helpers";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { projectApi } from "@/api";

const ALL_MILESTONES = [
  "Within 30 days of Booking",
  "On Completion of Plinth Work",
  "At the time of Ground Roof Casting",
  "2nd Slab Casting",
  "3rd Slab Casting",
  "4th Slab Casting",
  "5th Slab Casting",
  "6th Slab Casting",
  "7th Slab Casting",
  "8th Slab Casting",
  "At the completion of Internal Wall of Flat",
  "At the time of Flooring",
  "At the time of Possession",
];

export function FinanceMilestones() {
  const { milestones, fetchProjectMilestones, markMilestone, loading } =
    useFinance();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [markOpen, setMarkOpen] = useState(false);
  const [markMilestoneName, setMarkMilestoneName] = useState("");
  const [markCompletedAt, setMarkCompletedAt] = useState(
    new Date().toISOString().slice(0, 16),
  );

  const fetchProjects = async () => {
    try {
      const res = await projectApi.getAll();
      if (res.data.success) {
        setProjects(res.data.data?.projects || []);
        setSelectedProject(res.data.data?.projects[0]?._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    if (projects.length && selectedProject) {
      fetchProjectMilestones(selectedProject);
    }
  }, [projects, selectedProject, fetchProjectMilestones]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleMark = async () => {
    if (!markMilestoneName) return;
    await markMilestone(selectedProject, {
      milestone: markMilestoneName,
      completedAt: new Date(markCompletedAt).toISOString(),
    });
    setMarkOpen(false);
    setMarkMilestoneName("");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1.5">
          <Label>Select Project</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Choose a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedProject && (
          <Button onClick={() => setMarkOpen(true)}>
            Mark Milestone Completed
          </Button>
        )}
      </div>

      {selectedProject && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ALL_MILESTONES.map((name) => {
                  const found = milestones.find((m) => m.milestone === name);
                  const completed = found?.completed;
                  return (
                    <TableRow key={name}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>
                        {completed ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle className="h-3 w-3" /> Completed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {completed ? formatDate(found.completedAt) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Mark Milestone Dialog */}
      <Dialog open={markOpen} onOpenChange={setMarkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Milestone as Completed</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Milestone</Label>
              <Select
                value={markMilestoneName}
                onValueChange={setMarkMilestoneName}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select milestone" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_MILESTONES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Completed At</Label>
              <Input
                type="datetime-local"
                value={markCompletedAt}
                onChange={(e) => setMarkCompletedAt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMark}
              disabled={!markMilestoneName || loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Mark Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
