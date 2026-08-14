import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api";
import AshirwadLogo from "@/assets/logo-removebg.png";
import AshirwadLogoIso from "@/assets/logo-removebg-iso.png";

export default function ResetPassword() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPwd, setShowPwd] = useState(false);
	const [loading, setLoading] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			return toast.error("Passwords do not match");
		}
		setLoading(true);
		try {
			const res = await authApi.resetPassword({
				token,
				password,
			});

			if (res?.data?.success) {
				toast.success("Password reset successful");
				navigate("/login");
			}
		} catch (error) {
			toast.error(error?.response?.data?.message || "Reset failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen grid lg:grid-cols-[1fr_1fr]">

			{/* LEFT — Brand Panel */}
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

					{/* Brand */}
					<div className="flex items-center gap-4">
						<img
							src={AshirwadLogo}
							alt="Ashirwad Engicon Group Logo"
							className="h-18 w-auto bg-white p-1.5 rounded-lg shadow-sm"
						/>

						<div className="flex flex-col">
							<div className="font-display text-2xl font-bold text-red-600 leading-none tracking-wider">
								ASHIRWAD
							</div>

							<div className="text-sm font-bold tracking-widest text-sidebar-foreground mt-1">
								ENGICON GROUP
							</div>

							<div className="text-[11px] mt-1.5 tracking-[0.05em] text-sidebar-foreground/80 font-medium border-t border-sidebar-foreground/20 pt-1 w-max">
								An ISO 9001:2008 Certified Company
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="relative space-y-5 max-w-lg">
						<h2 className="font-display text-2xl lg:text-3xl leading-[1.2] font-semibold tracking-tight text-white">
							Create a secure new password.
						</h2>

						<p className="text-sidebar-foreground/70 text-[16px] leading-relaxed">
							Choose a strong password to protect your account and
							keep your project information secure.
						</p>
					</div>
				</div>
			</div>

			{/* RIGHT — Reset Password */}
			<div className="flex items-center justify-center p-6 sm:p-10 bg-background">
				<div className="w-full max-w-[420px]">

					{/* Mobile Logo + Heading */}
					<div className="space-y-8 mb-7">

						<div className="flex items-center justify-center gap-3 lg:hidden">
							<img
								src={AshirwadLogoIso}
								alt="Ashirwad Engicon Group Logo"
								className="h-20 sm:h-24 w-auto p-1.5"
							/>
						</div>

						<div className="space-y-1 flex flex-col items-center lg:items-start text-center">
							<h3 className="text-2xl lg:text-3xl text-muted-foreground font-semibold">
								Create New Password
							</h3>

							<p className="text-sm text-muted-foreground">
								Enter your new password below.
							</p>
						</div>
					</div>

					<form onSubmit={submit} className="space-y-5">

						{/* NEW PASSWORD */}
						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="text-sm font-medium"
							>
								New Password
							</Label>

							<div className="relative">
								<Input
									id="password"
									type={showPwd ? "text" : "password"}
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="h-11 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary pr-10"
								/>

								<button
									type="button"
									onClick={() => setShowPwd((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
								>
									{showPwd ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{/* CONFIRM PASSWORD */}
						<div className="space-y-2">
							<Label
								htmlFor="confirmPassword"
								className="text-sm font-medium"
							>
								Confirm Password
							</Label>

							<Input
								id="confirmPassword"
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="h-11 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary"
							/>
						</div>

						<Button
							type="submit"
							className="w-full h-11 text-md font-medium mt-2"
							disabled={loading}
						>
							{loading ? "Updating…" : "Reset Password"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}