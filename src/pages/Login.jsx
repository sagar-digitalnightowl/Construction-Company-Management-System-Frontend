import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConstructionIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore, useUsersStore } from "@/store/authStore";
import { ROLES } from "@/data/permissions";
import { Toaster } from "@/components/ui/sonner";

const demoAccounts = [
    {
        role: "admin", email: "admin@gmail.com", pass: "admin123"
    },
    {
        role: "director", email: "director@gmail.com", pass: "demo123"
    },
    {
        role: "project_manager", email: "pm.aria@gmail.com", pass: "demo123"
    },
    {
        role: "site_engineer", email: "site.kabir@gmail.com", pass: "demo123"
    },
    {
        role: "accountant", email: "finance.neha@gmail.com", pass: "demo123"
    },
    {
        role: "hr_manager", email: "hr.varun@gmail.com", pass: "demo123"
    },
    {
        role: "vendor", email: "vendor.steelmart@gmail.com", pass: "demo123"
    },
    { role: "client", email: "client.zenith@gmail.com", pass: "demo123" },
];

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const findByEmail = useUsersStore((s) => s.findByEmail);
    const login = useAuthStore((s) => s.login);

    const submit = (e) => {
        e?.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const user = findByEmail(email.trim());
            if (!user || user.password !== password) {
                toast.error("Invalid credentials. Try one of the demo accounts on the right.");
                setLoading(false); return;
            }
            if (user.status !== "active") {
                toast.error("This account has been disabled by the administrator.");
                setLoading(false); return;
            }
            const { password: _pw, ...safe } = user;
            login(safe);
            toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
            navigate("/dashboard");
        }, 350);
    };

    const quickFill = (acc) => { setEmail(acc.email); setPassword(acc.pass); };

    return (
        <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] p-2">
            {/* Left — brand panel */}
            <div className="h-lvh relative hidden lg:flex flex-col justify-between p-10 bg-sidebar text-sidebar-foreground overflow-hidden">
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--color-sidebar-primary) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-sidebar-primary) 0, transparent 35%)" }}
                />
                <div className="relative">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center shadow-md">
                            <ConstructionIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="font-display text-2xl font-semibold">Construction Company Management System</div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-sidebar-foreground/55">Construction Operations Platform</div>
                        </div>
                    </div>
                </div>

                <div className="relative space-y-7 max-w-md mb-32">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-sidebar-primary font-medium">Built for what holds up</div>
                    <h2 className="font-display text-[2.4rem] leading-[1.05] font-semibold">
                        One platform for projects, sites, procurement, finance & people.
                    </h2>
                    <p className="text-sidebar-foreground/70 text-[15px] leading-relaxed">
                        From the first BOQ to the final handover — coordinate every stakeholder, track every rupee, and ship projects on time.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        {["BOQ → PO automation", "DPR with geo-tagging", "GST-ready billing", "RBAC for 8 personas"].map((t) => (
                            <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-sidebar-accent/70 border border-sidebar-border">{t}</span>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right — form */}
            <div className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-[420px]">
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="h-9 w-9 rounded-lg bg-foreground text-background grid place-items-center">
                            <ConstructionIcon className="h-5 w-5" />
                        </div>
                        <div className="font-display text-base sm:text-xl font-semibold">CCMS</div>
                    </div>

                    <div className="space-y-1.5 mb-7">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">Sign in</div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Continue to your construction operations workspace.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4" data-testid="login-form">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Work email</Label>
                            <Input id="email" type="email" placeholder="you@gmail.com" value={email}
                                onChange={(e) => setEmail(e.target.value)} required data-testid="login-email" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <button type="button" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</button>
                            </div>
                            <div className="relative">
                                <Input id="password" type={showPwd ? "text" : "password"} placeholder="••••••••" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required data-testid="login-password" />
                                <button type="button" onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
                                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-10" disabled={loading} data-testid="login-submit">
                            {loading ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>

                    <div className="mt-7">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2.5">
                            Quick demo · click to fill
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                            {demoAccounts.map((acc) => (
                                <button key={acc.email} type="button" onClick={() => quickFill(acc)}
                                    data-testid={`quick - ${acc.role}`}
                                    className="text-left text-xs px-2.5 py-2 rounded-md border border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors">
                                    <div className="font-medium text-foreground">{ROLES[acc.role]}</div>
                                    <div className="text-muted-foreground truncate">{acc.email}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    );
}