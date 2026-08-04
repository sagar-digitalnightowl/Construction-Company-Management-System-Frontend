


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConstructionIcon, Eye, EyeOff, FileText, MapPin, Receipt, Users } from "lucide-react"; 
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { Toaster } from "@/components/ui/sonner";
import { authApi } from "@/api";

// IMPORTANT: Place image_0.png in your assets folder (e.g., src/assets/)
import AshirwadLogo from "@/assets/logo.jpg"; 

// Features array with icons for the left panel
const platformFeatures = [
    { text: "BOQ → PO automation", icon: FileText },
    { text: "DPR with geo-tagging", icon: MapPin },
    { text: "GST-ready billing", icon: Receipt },
    { text: "RBAC for 8 personas", icon: Users },
];

export default function Login() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((s) => s.login);

    const submit = async (e) => {
        e?.preventDefault();
        setLoading(true);
        try {
            const res = await authApi.login({ identifier, password });

            if (res?.data?.success) {
                login(res.data.data?.user);
                localStorage.setItem("accessToken", res.data.data?.accessToken);
                localStorage.setItem("refreshToken", res.data.data?.refreshToken);
                toast.success(`Welcome back, ${res.data.data?.user.name.split(" ")[0]}`);
                navigate("/dashboard");
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.log("Error in login : ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
            {/* Left — Brand Panel */}
            <div className="h-lvh relative hidden lg:flex flex-col justify-between p-10 bg-sidebar text-sidebar-foreground overflow-hidden">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--color-sidebar-primary) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-sidebar-primary) 0, transparent 35%)" }}
                />
                
                <div className="relative space-y-12">
                    {/* Top part with Logo */}
                    <div className="flex items-center gap-4">
                        {/* Optional: Added bg-white and padding to the logo if it looks weird on dark background, remove className if not needed */}
                        <img src={AshirwadLogo} alt="Ashirwad Engicon Group Logo" className="h-16 w-auto bg-white/90 p-1.5 rounded-lg shadow-sm" /> 
                        <div className="text-[11px] uppercase tracking-[0.22em] text-sidebar-foreground/60 font-semibold">
                            Construction Operations Platform
                        </div>
                    </div>

                    <div className="relative space-y-7 max-w-lg mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sidebar-primary/10 border border-sidebar-primary/20">
                            <span className="h-2 w-2 rounded-full bg-sidebar-primary animate-pulse"></span>
                            <span className="text-[11px] uppercase tracking-[0.2em] text-sidebar-primary font-semibold">Built for what holds up</span>
                        </div>
                        
                        <h2 className="font-display text-[2.6rem] leading-[1.1] font-semibold tracking-tight text-white">
                            One platform for projects, sites, procurement, finance & people.
                        </h2>
                        
                        <p className="text-sidebar-foreground/70 text-[16px] leading-relaxed">
                            From the first BOQ to the final handover — coordinate every stakeholder, track every rupee, and ship projects on time.
                        </p>
                        
                        {/* 🌟 New Eye-Catching Features Grid with Icons 🌟 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                            {platformFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sidebar-primary/30 transition-all duration-300 group cursor-default">
                                    <div className="h-10 w-10 rounded-lg bg-sidebar-primary/10 text-sidebar-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-sidebar-foreground/90 group-hover:text-white transition-colors">
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Login Form Panel */}
            <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
                <div className="w-full max-w-[420px]">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="h-10 w-10 rounded-xl bg-foreground text-background grid place-items-center shadow-sm">
                            <ConstructionIcon className="h-5 w-5" /> 
                        </div>
                        <div className="font-display text-2xl font-bold tracking-tight">CCMS</div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <div className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Sign in</div>
                        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Continue to your construction operations workspace.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5" data-testid="login-form">
                        <div className="space-y-2">
                            <Label htmlFor="identifier" className="text-sm font-medium">Work email or mobile</Label>
                            <Input id="identifier" type="text" placeholder="you@gmail.com" value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)} required data-testid="login-identifier" 
                                className="h-11 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary" />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Input id="password" type={showPwd ? "text" : "password"} placeholder="••••••••" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required data-testid="login-password" 
                                    className="h-11 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary pr-10" />
                                <button type="button" onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        
                        <Button type="submit" className="w-full h-11 text-md font-medium mt-2" disabled={loading} data-testid="login-submit">
                            {loading ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>
                </div>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    );
}