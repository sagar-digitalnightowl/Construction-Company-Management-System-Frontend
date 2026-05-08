import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore, useUsersStore, useThemeStore } from "@/store/authStore";
import { ROLES } from "@/data/permissions";
import { initials } from "@/lib/helpers";

export default function Settings() {
    const { current, updateProfile } = useAuthStore();
    const updateUser = useUsersStore((s) => s.updateUser);
    const { dark, toggle } = useThemeStore();

    const [name, setName] = useState(current.name);
    const [phone, setPhone] = useState(current.phone || "");

    const save = () => {
        updateUser(current.id, { name, phone });
        updateProfile({ name, phone });
        toast.success("Profile updated");
    };

    return (
        <div className="space-y-6">
            < PageHeader eyebrow="Account" title="Settings & Profile" description="Manage your account, appearance and notifications." />

            < div className="grid lg:grid-cols-[1fr_2fr] gap-5">
                < Card >
                    <CardContent className="p-6 text-center">
                        <Avatar className="h-20 w-20 mx-auto"><AvatarFallback className="bg-foreground text-background text-xl">{initials(current.name)}</AvatarFallback></Avatar>
                        <div className="font-display text-lg font-semibold mt-3">{current.name}</div>
                        <div className="text-sm text-muted-foreground">{current.email}</div>
                        <Badge className="mt-3" variant="default">{ROLES[current.role]}</Badge>
                        <Separator className="my-5" />
                        <div className="text-left space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span>{current.department || "—"}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>{current.joinedAt}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="success">{current.status}</Badge></div>
                        </div >
                    </CardContent >
                </Card >

                <div className="space-y-5">
                    < Card >
                        <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal details.</CardDescription></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <div div className="col-span-2 space-y-1.5"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                            <div div className="space-y-1.5"><Label>Email</Label><Input value={current.email} disabled /></div>
                            <div className="space-y-1.5"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                            <div div className="col-span-2 flex justify-end"><Button onClick={save}>Save changes</Button></div>
                        </CardContent >
                    </Card >

                    <Card>
                        <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Switch between bone-light and graphite-dark.</CardDescription></CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                                <div>
                                    <div className="font-medium">Dark mode</div>
                                    <div className="text-xs text-muted-foreground">Easier on the eyes after sundown.</div>
                                </div>
                                <Button variant={dark ? "default" : "outline"} onClick={toggle}>{dark ? "On" : "Off"}</Button>
                            </div >
                        </CardContent >
                    </Card >

                    {/* <Card>
                        <CardHeader><CardTitle>Integrations</CardTitle><CardDescription>Connected services (demo).</CardDescription></CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-3">
                            {[
                                { name: "Tally ERP", status: "connected" },
                                { name: "GST Suvidha API", status: "connected" },
                                { name: "WhatsApp Business", status: "connected" },
                                { name: "Razorpay Payments", status: "not_connected" },
                            ].map((it) => (
                                <div key={it.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                                    <div className="text-sm font-medium">{it.name}</div>
                                    <Badge variant={it.status === "connected" ? "success" : "muted"}>{it.status.replace("_", " ")}</Badge>
                                </div >
                            ))
                            }
                        </CardContent >
                    </Card > */}
                </div >
            </div >
        </div >
    );
}