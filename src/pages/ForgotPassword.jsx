import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api";
import AshirwadLogo from "@/assets/logo-removebg.png";
import AshirwadLogoIso from "@/assets/logo-removebg-iso.png";

export default function ForgotPassword() {
	const [identifier, setIdentifier] = useState("");
	const [loading, setLoading] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await authApi.forgotPassword({ identifier });
			console.log("response : ", res);
			if (res?.data?.success) {
				toast.success(res?.data?.message || "Reset link sent to your email");
			}
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to send reset link");
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
							Securely recover your account access.
						</h2>

						<p className="text-sidebar-foreground/70 text-[16px] leading-relaxed">
							Enter your registered email or mobile number and we'll
							help you securely reset your password and get back to
							managing your projects.
						</p>
					</div>
				</div>
			</div>

			{/* RIGHT — Forgot Password Form */}
			<div className="flex items-center justify-center p-6 sm:p-10 bg-background">
				<div className="w-full max-w-[420px]">

					{/* Mobile Logo */}
					<div className="space-y-8 mb-7">
						<div className="flex items-center justify-center gap-3 lg:hidden">
							<img
								src={AshirwadLogoIso}
								alt="Ashirwad Engicon Group Logo"
								className="h-20 sm:h-24 w-auto p-1.5"
							/>
						</div>

						{/* Heading */}
						<div className="space-y-1 flex flex-col items-center lg:items-start text-center">
							<h3 className="text-2xl lg:text-3xl text-muted-foreground font-semibold">
								Recover Access
							</h3>

							<p className="text-sm text-muted-foreground">
								Enter your credentials to reset your password.
							</p>
						</div>
					</div>

					<form onSubmit={submit} className="space-y-5">

						<div className="space-y-2">
							<Label
								htmlFor="identifier"
								className="text-sm font-medium"
							>
								Work email or mobile
							</Label>

							<Input
								id="identifier"
								type="text"
								placeholder="you@gmail.com"
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
								required
								className="h-11 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary"
							/>
						</div>

						<Button
							type="submit"
							className="w-full h-11 text-md font-medium mt-2"
							disabled={loading}
						>
							{loading ? "Sending…" : "Send Reset Link"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}