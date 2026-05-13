import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useUsersStore, useAuthStore } from "@/store/authStore";
import { ROLES, canMutate } from "@/data/permissions";
import { initials } from "@/lib/helpers";
import { authApi } from "@/api";

const empty = {
    name: "", email: "", phone: "", role: "site_engineer", department: "", password: "demo123", status: "active"
};

export default function Users() {
    const { current } = useAuthStore();
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const [users, setUsers] = useState([]);
    const [otpStep, setOtpStep] = useState(null);
    const [otpData, setOtpData] = useState({
        identifier: "",
        otp: "",
        type: "email",
    });

    const [formError, setFormError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [loadingBtn, setLoadingBtn] = useState(false);



    const fetchUsers = async () => {
        try {
            const res = await authApi.getUsers();
            if (res?.data?.success) {
                setUsers(res.data.data.users);
            }
        } catch {
            toast.error("Failed to load users");
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);



    const save = async () => {
        if (!form.name || !form.email || !form.password) {
            setFormError("Name, email and password are required");
            return;
        }


        try {
            setLoadingBtn(true);
            setFormError("");

            const res = await authApi.registerUser({
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                role: form.role,
            });

            if (res?.data?.success) {
                setOtpData({
                    identifier: form.email,
                    otp: "",
                    type: "email",
                });

                setOtpStep("email");
                setOpen(false);
            }

        } catch (err) {
            setFormError(err?.response?.data?.message || err?.message || "Failed to create user");
        } finally {
            setLoadingBtn(false);
        }
    };


    const verifyOtp = async () => {
        try {
            setLoadingBtn(true);
            setOtpError("");

            const res = await authApi.verifyOtp(otpData);

            if (res?.data?.success) {

                if (otpStep === "email") {
                    setOtpData({
                        identifier: form.phone,
                        otp: "",
                        type: "phone",
                    });

                    setOtpStep("phone");

                } else {
                    setOtpStep(null);
                    fetchUsers();
                    toast.success("User created successfully");
                }
            }

        } catch (err) {
            setOtpError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoadingBtn(false);
        }
    };


    const canEdit = canMutate(current.role, "users");
    const filtered = users.filter((u) => {
        const m = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const r = roleFilter === "all" || u.role === roleFilter;
        return m && r;
    });

    const startCreate = () => { setForm(empty); setFormError(''); setOpen(true); };


    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Administration" title="User & Role Management"
                description="Create accounts for any role; users can sign in with the credentials you set here."
                actions={canEdit && (
                    <Button data-testid="users-create-btn" onClick={startCreate}><Plus className="h-4 w-4" /> New user</Button>
                )}
            />

            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input data-testid="users-search" className="pl-9" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div >
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[200px]" data-testid="users-role-filter"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        {Object.entries(ROLES).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                    </SelectContent >
                </Select >
            </div >

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                {/* <TableHead>Department</TableHead> */}
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((u) => (
                                <TableRow key={u._id} data-testid={`user-row-${u._id}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                {u.profileImage && (
                                                    <AvatarImage src={u.profileImage} />
                                                )}
                                                <AvatarFallback className="bg-foreground text-background">
                                                    {initials(u.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="leading-tight">
                                                <div className="font-medium">{u.name}</div>
                                                <div className="text-xs text-muted-foreground">{u.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant={u.role === "admin" ? "default" : "outline"}>{ROLES[u.role]}</Badge></TableCell >
                                    {/* <TableCell className="text-sm text-muted-foreground">{u.department}</TableCell> */}
                                    < TableCell className="text-sm tabular-nums">{u.phone}</TableCell>
                                    < TableCell >
                                        <Badge variant={u.isActive ? "success" : "muted"}>{u.isActive ? "Active" : "In Active"}</Badge>
                                    </TableCell >
                                    <TableCell className="text-right">
                                        {
                                            canEdit && (
                                                <div className="flex justify-end gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => startEdit(u)} data-testid={`user-edit-${u.id}`}><Pencil className="h-4 w-4" /></Button>
                                                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setConfirmId(u.id)} data-testid={`user-delete-${u.id}`} disabled={u.id === current.id}><Trash2 className="h-4 w-4" /></Button>
                                                </div >
                                            )
                                        }
                                    </TableCell >
                                </TableRow >
                            ))}
                        </TableBody >
                    </Table >
                </CardContent >
            </Card >

            <Dialog open={open} onOpenChange={setOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit user" : "Create new user"}</DialogTitle>
                        <DialogDescription>
                            {editing ? "Update profile details and role permissions." : "Set credentials — the user will be able to sign in immediately."}
                        </DialogDescription>
                    </DialogHeader>

                    {formError && (
                        <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                            {formError}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5"><Label>Full name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="user-form-name" /></div>
                        <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="user-form-email" /></div>
                        <div className="space-y-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                        <div className="col-span-2 space-y-1.5">
                            <Label> Role</Label >
                            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                                <SelectTrigger data-testid="user-form-role"><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.entries(ROLES).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}</SelectContent>
                            </Select >
                        </div >
                        {/* <div className="space-y-1.5"><Label>Department</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div> */}
                        < div className="col-span-2 space-y-1.5">
                            < Label > Password</Label >
                            <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="user-form-password" />
                            < p className="text-xs text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> User signs in with this exact password.</p>
                        </div >
                    </div >
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={save} disabled={loadingBtn}>
                            {loadingBtn ? "Creating..." : "Create user"}
                        </Button>
                    </DialogFooter >
                </DialogContent >
            </Dialog >


            <Dialog open={!!otpStep}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {otpStep === "email" ? "Verify Email OTP" : "Verify Phone OTP"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter OTP sent to {otpData.identifier}
                        </DialogDescription>
                    </DialogHeader>



                    <div className="space-y-3">
                        {otpError && (
                            <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                                {otpError}
                            </div>
                        )}

                        <Input
                            placeholder="Enter 6-digit OTP"
                            value={otpData.otp}
                            onChange={(e) =>
                                setOtpData({ ...otpData, otp: e.target.value })
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button onClick={verifyOtp} disabled={loadingBtn}>
                            {loadingBtn ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!confirmId}
                onOpenChange={(v) => !v && setConfirmId(null)}
                title="Delete user?" description="This will revoke access immediately. This action cannot be undone in the demo."
            // onConfirm={del}
            />
        </div >
    );
}