// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ConstructionIcon, Eye, EyeOff } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuthStore, useUsersStore } from "@/store/authStore";
// import { ROLES } from "@/data/permissions";
// import { Toaster } from "@/components/ui/sonner";
// import { authApi } from "@/api";

// // const demoAccounts = [
// //     {
// //         role: "admin", email: "admin@gmail.com", pass: "admin123"
// //     },
// //     {
// //         role: "director", email: "director@gmail.com", pass: "demo123"
// //     },
// //     {
// //         role: "project_manager", email: "pm.aria@gmail.com", pass: "demo123"
// //     },
// //     {
// //         role: "site_engineer", email: "site.kabir@gmail.com", pass: "demo123"
// //     },
// //     {
// //         role: "accountant", email: "finance.neha@gmail.com", pass: "demo123"
// //     },
// //     {
// //         role: "hr_manager", email: "hr.varun@gmail.com", pass: "demo123"
// //     },
// //     {
// //         role: "vendor", email: "vendor.steelmart@gmail.com", pass: "demo123"
// //     },
// //     { role: "client", email: "client.zenith@gmail.com", pass: "demo123" },
// // ];

// export default function Login() {
//     const navigate = useNavigate();
//     const [identifier, setIdentifier] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPwd, setShowPwd] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const login = useAuthStore((s) => s.login);

//     const submit = async (e) => {
//         e?.preventDefault();
//         setLoading(true);
//         try {
//             const res = await authApi.login({ identifier, password });

//             if (res?.data?.success) {
//                 login(res.data.data?.user);
//                 localStorage.setItem("accessToken", res.data.data?.accessToken);
//                 localStorage.setItem("refreshToken", res.data.data?.refreshToken);
//                 toast.success(`Welcome back, ${res.data.data?.user.name.split(" ")[0]}`);
//                 navigate("/dashboard");
//             }

//         } catch (error) {
//             toast.error(error?.response?.data?.message || "Something went wrong");
//             console.log("Error in login : ", error);
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
//             {/* Left — brand panel */}
//             <div className="h-lvh relative hidden lg:flex flex-col justify-between p-10 bg-sidebar text-sidebar-foreground overflow-hidden">
//                 <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
//                     style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--color-sidebar-primary) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-sidebar-primary) 0, transparent 35%)" }}
//                 />
//                 <div className="relative">
//                     <div className="flex items-center gap-3">
//                         <div className="h-11 w-11 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center shadow-md">
//                             <ConstructionIcon className="h-6 w-6" />
//                         </div>
//                         <div>
//                             <div className="font-display text-2xl font-semibold">Ashirwaad</div>
//                             <div className="text-[11px] uppercase tracking-[0.22em] text-sidebar-foreground/55">Construction Operations Platform</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="relative space-y-7 max-w-md mb-32">
//                     <div className="text-[11px] uppercase tracking-[0.22em] text-sidebar-primary font-medium">Built for what holds up</div>
//                     <h2 className="font-display text-[2.4rem] leading-[1.05] font-semibold">
//                         One platform for projects, sites, procurement, finance & people.
//                     </h2>
//                     <p className="text-sidebar-foreground/70 text-[15px] leading-relaxed">
//                         From the first BOQ to the final handover — coordinate every stakeholder, track every rupee, and ship projects on time.
//                     </p>
//                     <div className="flex flex-wrap gap-3 pt-2">
//                         {["BOQ → PO automation", "DPR with geo-tagging", "GST-ready billing", "RBAC for 8 personas"].map((t) => (
//                             <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-sidebar-accent/70 border border-sidebar-border">{t}</span>
//                         ))}
//                     </div>
//                 </div>

//             </div>

//             <div className="flex items-center justify-center p-6 sm:p-10">
//                 <div className="w-full max-w-[420px]">
//                     <div className="lg:hidden flex items-center gap-2 mb-8">
//                         <div className="h-9 w-9 rounded-lg bg-foreground text-background grid place-items-center">
//                             <ConstructionIcon className="h-5 w-5" />
//                         </div>
//                         <div className="font-display text-base sm:text-xl font-semibold">CCMS</div>
//                     </div>

//                     <div className="space-y-1.5 mb-7">
//                         <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">Sign in</div>
//                         <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
//                         <p className="text-sm text-muted-foreground">Continue to your construction operations workspace.</p>
//                     </div>

//                     <form onSubmit={submit} className="space-y-4" data-testid="login-form">
//                         <div className="space-y-1.5">
//                             <Label htmlFor="email">Work email or mobile</Label>
//                             <Input id="identifier" type="text" placeholder="you@gmail.com" value={identifier}
//                                 onChange={(e) => setIdentifier(e.target.value)} required data-testid="login-identifier" />
//                         </div>
//                         <div className="space-y-1.5">
//                             <div className="flex items-center justify-between">
//                                 <Label htmlFor="password">Password</Label>
//                                 <button
//                                     type="button"
//                                     onClick={() => navigate("/forgot-password")}
//                                     className="text-xs text-muted-foreground hover:text-foreground"
//                                 >
//                                     Forgot?
//                                 </button>
//                             </div>
//                             <div className="relative">
//                                 <Input id="password" type={showPwd ? "text" : "password"} placeholder="••••••••" value={password}
//                                     onChange={(e) => setPassword(e.target.value)} required data-testid="login-password" />
//                                 <button type="button" onClick={() => setShowPwd(v => !v)}
//                                     className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
//                                     {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                 </button>
//                             </div>
//                         </div>
//                         <Button type="submit" className="w-full h-10" disabled={loading} data-testid="login-submit">
//                             {loading ? "Signing in…" : "Sign in"}
//                         </Button>
//                     </form>

//                     {/* <div className="mt-7">
//                         <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2.5">
//                             Quick demo · click to fill
//                         </div>
//                         <div className="grid grid-cols-2 gap-1.5">
//                             {demoAccounts.map((acc) => (
//                                 <button key={acc.email} type="button" onClick={() => quickFill(acc)}
//                                     data-testid={`quick - ${acc.role}`}
//                                     className="text-left text-xs px-2.5 py-2 rounded-md border border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors">
//                                     <div className="font-medium text-foreground">{ROLES[acc.role]}</div>
//                                     <div className="text-muted-foreground truncate">{acc.email}</div>
//                                 </button>
//                             ))}
//                         </div>
//                     </div> */}
//                 </div>
//             </div>

//             <Toaster position="top-right" richColors />
//         </div>
//     );
// }




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import { Eye, EyeOff } from "lucide-react"; // Removed ConstructionIcon import
// import { ConstructionIcon, Eye, EyeOff } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuthStore, useUsersStore } from "@/store/authStore";
// import { Toaster } from "@/components/ui/sonner";
// import { authApi } from "@/api";

// // IMPORTANT: Place image_0.png in your assets folder (e.g., src/assets/)
// // and adjust the path here. Assuming it is saved as `src/assets/logo.png`
// import AshirwadLogo from "@/assets/logo.jpg"; // Use your actual asset path and filename

// export default function Login() {
//     const navigate = useNavigate();
//     const [identifier, setIdentifier] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPwd, setShowPwd] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const login = useAuthStore((s) => s.login);

//     const submit = async (e) => {
//         e?.preventDefault();
//         setLoading(true);
//         try {
//             const res = await authApi.login({ identifier, password });

//             if (res?.data?.success) {
//                 login(res.data.data?.user);
//                 localStorage.setItem("accessToken", res.data.data?.accessToken);
//                 localStorage.setItem("refreshToken", res.data.data?.refreshToken);
//                 toast.success(`Welcome back, ${res.data.data?.user.name.split(" ")[0]}`);
//                 navigate("/dashboard");
//             }

//         } catch (error) {
//             toast.error(error?.response?.data?.message || "Something went wrong");
//             console.log("Error in login : ", error);
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]"> {/* Adjusted grid ratio */}
//             {/* Left — brand panel (UPDATED with image) */}
//             <div className="h-lvh relative hidden lg:flex flex-col justify-between p-10 bg-sidebar text-sidebar-foreground overflow-hidden">
//                 <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
//                     style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--color-sidebar-primary) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-sidebar-primary) 0, transparent 35%)" }}
//                 />
                
//                 {/* Grouping the logo and main brand content for layout */}
//                 <div className="relative space-y-12">
//                     {/* Top part with NEW logo instead of construction icon box */}
//                     <div className="flex items-center gap-4">
//                         <img src={AshirwadLogo} alt="Ashirwad Engicon Group Logo" className="h-16 w-auto" /> {/* Logo image here */}
//                         <div className="text-[11px] uppercase tracking-[0.22em] text-sidebar-foreground/55">Construction Operations Platform</div>
//                     </div>

//                     <div className="relative space-y-7 max-w-lg mb-10">
//                         <div className="text-[11px] uppercase tracking-[0.22em] text-sidebar-primary font-medium">Built for what holds up</div>
//                         <h2 className="font-display text-[2.4rem] leading-[1.05] font-semibold">
//                             One platform for projects, sites, procurement, finance & people.
//                         </h2>
//                         <p className="text-sidebar-foreground/70 text-[15px] leading-relaxed">
//                             From the first BOQ to the final handover — coordinate every stakeholder, track every rupee, and ship projects on time.
//                         </p>
//                         <div className="flex flex-wrap gap-3 pt-2">
//                             {["BOQ → PO automation", "DPR with geo-tagging", "GST-ready billing", "RBAC for 8 personas"].map((t) => (
//                                 <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-sidebar-accent/70 border border-sidebar-border">{t}</span>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//             </div>

//             <div className="flex items-center justify-center p-6 sm:p-10">
//                 <div className="w-full max-w-[420px]">
//                     <div className="lg:hidden flex items-center gap-2 mb-8">
//                         <div className="h-9 w-9 rounded-lg bg-foreground text-background grid place-items-center">
//                             {/* Retained a construction icon here, but you could add a simplified icon, or remove this and add a small text 'CCMS' or the small logo image */}
//                             <ConstructionIcon className="h-5 w-5" />
//                         </div>
//                         <div className="font-display text-base sm:text-xl font-semibold">CCMS</div>
//                     </div>

//                     <div className="space-y-1.5 mb-7">
//                         <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">Sign in</div>
//                         <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
//                         <p className="text-sm text-muted-foreground">Continue to your construction operations workspace.</p>
//                     </div>

//                     <form onSubmit={submit} className="space-y-4" data-testid="login-form">
//                         <div className="space-y-1.5">
//                             <Label htmlFor="email">Work email or mobile</Label>
//                             <Input id="identifier" type="text" placeholder="you@gmail.com" value={identifier}
//                                 onChange={(e) => setIdentifier(e.target.value)} required data-testid="login-identifier" />
//                         </div>
//                         <div className="space-y-1.5">
//                             <div className="flex items-center justify-between">
//                                 <Label htmlFor="password">Password</Label>
//                                 <button
//                                     type="button"
//                                     onClick={() => navigate("/forgot-password")}
//                                     className="text-xs text-muted-foreground hover:text-foreground"
//                                 >
//                                     Forgot?
//                                 </button>
//                             </div>
//                             <div className="relative">
//                                 <Input id="password" type={showPwd ? "text" : "password"} placeholder="••••••••" value={password}
//                                     onChange={(e) => setPassword(e.target.value)} required data-testid="login-password" />
//                                 <button type="button" onClick={() => setShowPwd(v => !v)}
//                                     className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
//                                     {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                 </button>
//                             </div>
//                         </div>
//                         <Button type="submit" className="w-full h-10" disabled={loading} data-testid="login-submit">
//                             {loading ? "Signing in…" : "Sign in"}
//                         </Button>
//                     </form>
//                 </div>
//             </div>

//             <Toaster position="top-right" richColors />
//         </div>
//     );
// }



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