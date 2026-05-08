import React, { useState } from "react";
import { Plus, Trash2, Users2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useHRStore } from "@/store/dataStore";
import { useUsersStore, useAuthStore } from "@/store/authStore";
import { canMutate, ROLES } from "@/data/permissions";
import { initials, formatDate } from "@/lib/helpers";

export default function HR() {
    const { attendance, addAttendance, removeAttendance } = useHRStore();
    const users = useUsersStore((s) => s.users);
    const { current } = useAuthStore();
    const canEdit = canMutate(current.role, "hr");

    const employees = users.filter(u => !["vendor", "client"].includes(u.role));

    const [open, setOpen] = useState(false);
    const empty = { employeeId: "", date: new Date().toISOString().slice(0, 10), checkIn: "09:00", checkOut: "18:00", site: "HQ", hours: 9 };
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const totalHours = attendance.reduce((a, x) => a + x.hours, 0);

    const save = () => {
        if (!form.employeeId) { toast.error("Pick employee"); return; }
        addAttendance({ ...form, hours: Number(form.hours) });
        toast.success("Attendance logged");
        setOpen(false); setForm(empty);
    };

    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Business" title="HR & Payroll" description="Headcount, on-site attendance, and payroll-ready timesheets." />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Active Employees" value={employees.length} icon={Users2} />
                <StatCard label="On site today" value={attendance.filter(a => a.date === new Date().toISOString().slice(0, 10)).length} icon={Users2} accent="primary" />
                <StatCard label="Logged hours" value={`${totalHours.toFixed(1)} h`} icon={Users2} accent="success" />
                <StatCard label="Open positions" value={3} icon={Users2} accent="warning" />
            </div>

            <Tabs defaultValue="employees">
                <TabsList>
                    <TabsTrigger value="employees">Employees</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                </TabsList>
                <TabsContent value="employees">
                    <Card><CardContent className="p-0">
                        <Table>
                            <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {employees.map(u => (
                                    <TableRow key={u.id}>
                                        <TableCell><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarFallback className="bg-foreground text-background">{initials(u.name)}</AvatarFallback></Avatar><div><div className="font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div></div></TableCell>
                                        <TableCell><Badge variant="outline">{ROLES[u.role]}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{u.department}</TableCell>
                                        <TableCell className="text-sm">{formatDate(u.joinedAt)}</TableCell>
                                        <TableCell><Badge variant={u.status === "active" ? "success" : "muted"}>{u.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent></Card>
                </TabsContent>
                <TabsContent value="attendance">
                    <div className="flex justify-end mb-3">{canEdit && <Button variant="outline" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Log attendance</Button>}</div>
                    <Card><CardContent className="p-0">
                        <Table>
                            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Employee</TableHead><TableHead>Site</TableHead><TableHead>Check-in</TableHead><TableHead>Check-out</TableHead><TableHead className="text-right">Hours</TableHead><TableHead className="text-right w-[80px]"></TableHead></TableRow></TableHeader>
                            <TableBody>
                                {attendance.map(a => {
                                    const emp = users.find(u => u.id === a.employeeId);
                                    return (<TableRow key={a.id}>
                                        <TableCell className="text-sm">{formatDate(a.date)}</TableCell>
                                        <TableCell className="text-sm font-medium">{emp?.name || "—"}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{a.site}</TableCell>
                                        <TableCell className="font-mono text-xs">{a.checkIn}</TableCell>
                                        <TableCell className="font-mono text-xs">{a.checkOut}</TableCell>
                                        <TableCell className="text-right tabular-nums font-medium">{a.hours} h</TableCell>
                                        <TableCell className="text-right">{canEdit && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setConfirmId(a.id)}><Trash2 className="h-4 w-4" /></Button>}</TableCell>
                                    </TableRow>);
                                })}
                            </TableBody>
                        </Table>
                    </CardContent></Card>
                </TabsContent>
            </Tabs>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Log attendance</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5"><Label>Employee</Label>
                            <Select value={form.employeeId} onValueChange={v => setForm({ ...form, employeeId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>{employees.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Site</Label><Input value={form.site} onChange={e => setForm({ ...form, site: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Check-in</Label><Input type="time" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} /></div>
                        <div className="space-y-1.5"><Label>Check-out</Label><Input type="time" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} /></div>
                        <div className="col-span-2 space-y-1.5"><Label>Hours</Label><Input type="number" step="0.1" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Log</Button></DialogFooter>
                </DialogContent>
            </Dialog>
            <ConfirmDialog open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)} title="Delete entry?" onConfirm={() => { removeAttendance(confirmId); toast.success("Entry deleted"); setConfirmId(null); }} />
        </div>
    );
}