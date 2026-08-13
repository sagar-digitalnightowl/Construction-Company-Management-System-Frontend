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

// IMPORTANT: Place logo-removebg.png in your assets folder (e.g., src/assets/)
import AshirwadLogo from "@/assets/logo-removebg.png";
import AshirwadLogoIso from "@/assets/logo-removebg-iso.png";

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
		<div className="min-h-screen grid lg:grid-cols-[1fr_1fr]">
			{/* Left — Brand Panel */}
			<div
				className="h-lvh relative hidden lg:flex flex-col justify-center p-10 text-sidebar-foreground overflow-hidden"
				style={{
					background: `
						radial-gradient(
							circle at 10% 10%,
							color-mix(in oklch, var(--sidebar-primary) 20%, transparent),
							transparent 32%
						),
						radial-gradient(
							circle at 90% 90%,
							color-mix(in oklch, var(--sidebar-primary) 14%, transparent),
							transparent 35%
						),
						linear-gradient(
							135deg,
							var(--sidebar) 0%,
							var(--sidebar-accent) 100%
						)
					`,
				}}
			>
				<div className="relative space-y-12">
					{/* Top part with Logo and Extracted Text */}
					<div className="flex items-center gap-4">
						<img src={AshirwadLogo} alt="Ashirwad Engicon Group Logo" className="h-18 w-auto bg-white p-1.5 rounded-lg shadow-sm" />
						<div className="flex flex-col">
							<div className="font-display text-2xl font-bold text-red-600 leading-none tracking-wider">ASHIRWAD</div>
							<div className="text-sm font-bold tracking-widest text-sidebar-foreground mt-1">ENGICON GROUP</div>
							<div className="text-[11px] mt-1.5 tracking-[0.05em] text-sidebar-foreground/80 font-medium border-t border-sidebar-foreground/20 pt-1 w-max">
								An ISO 9001:2008 Certified Company
							</div>
						</div>
					</div>

					<div className="relative space-y-7 max-w-lg">
						{/* Heading */}
						<h2 className="font-display text-3xl lg:text-[2rem] leading-[1.2] font-semibold tracking-tight text-white">
							One platform for projects, sites, procurement, finance & people.
						</h2>

						{/* Paragraph */}
						<p className="text-sidebar-foreground/70 text-[16px] leading-relaxed">
							From the first BOQ to the final handover — coordinate every stakeholder, track every rupee, and ship projects on time.
						</p>

						{/* 🌟 Eye-Catching Features Grid with Icons 🌟 */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
							{platformFeatures.map((feature, idx) => (
								<div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-default">
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
					{/* Mobile Header & Welcome Text (Combined) */}
					<div className="space-y-8 mb-7">
						{/* Full Logo Display */}
						<div className="flex items-center justify-center gap-3 lg:hidden">
							{/* Note: if 'h-18' doesn't work in standard Tailwind, use 'h-16' or 'h-20' */}
							<img src={AshirwadLogoIso} alt="Ashirwad Engicon Group Logo" className="h-20 sm:h-24 w-auto p-1.5" />
						</div>

						{/* Welcome Text */}
						<div className="space-y-1 flex flex-col items-center lg:items-start text-center">
							<h3 className="text-2xl lg:text-3xl text-muted-foreground font-semibold">
								Sign in
							</h3>
							<p className="text-sm text-muted-foreground">
								Enter your credentials to continue.
							</p>
						</div>
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