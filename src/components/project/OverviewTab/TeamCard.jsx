// src/components/project/OverviewTab/TeamCard.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Check, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { authApi, projectApi } from "@/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/hooks/useProject";

export function TeamCard({ project, canEdit, onAssignTeam, onUpdateTeamRole, onRemoveTeamMember }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const { removeTeamMember, updateTeamRole } = useProject();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authApi.getUsers();
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );

  const handleAssign = async () => {
    if (selected.length === 0) return;
    const success = await onAssignTeam(project._id, selected);
    if (success) setOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Project Manager</p>
              <p className="font-medium">
                {project?.projectManager?.name ?? "—"}
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-muted-foreground text-xs">Team Members</p>
              {canEdit && (
                <Button
                  size="xs"
                  onClick={() => {
                    fetchUsers();
                    setOpen(true);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              )}
            </div>
            {project?.teamMembers?.length > 0 ? (
              <div className="space-y-2">
                {project?.teamMembers?.map((member) => (
                  <div
                    key={member._id}
                    className="flex justify-between items-center border rounded-md px-3 py-2"
                  >
                    <div>
                      <span className="font-medium text-sm">{member.name}</span>
                      <span className="text-xs text-muted-foreground ml-2 capitalize">
                        {member.role?.split("_").join(" ")}
                      </span>
                    </div>
                    {canEdit && (
                      <div className="flex gap-1">
                        <Select
                          defaultValue={member.role}
                          onValueChange={async (newRole) =>
                            onUpdateTeamRole(project._id, member._id, {
                              role: newRole,
                            })
                          }
                        >
                          <SelectTrigger className="w-28 h-7">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="site_engineer">
                              Site Engineer
                            </SelectItem>
                            <SelectItem value="supervisor">
                              Supervisor
                            </SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (confirm("Remove this member?")) {
                              await onRemoveTeamMember(project._id, member._id);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No team assigned</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Members</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              <p>Loading...</p>
            ) : (
              users
                .filter((u) =>
                  u.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((user) => (
                  <div
                    key={user._id}
                    onClick={() => toggleUser(user._id)}
                    className={`flex justify-between items-center border rounded-md px-3 py-2 cursor-pointer ${selected.includes(user._id) ? "bg-primary/10 border-primary" : ""}`}
                  >
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    {selected.includes(user._id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
