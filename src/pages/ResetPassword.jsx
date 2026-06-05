import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConstructionIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api";
import { Toaster } from "@/components/ui/sonner";

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
        <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">

            {/* LEFT PANEL */}
            <div className="min-h-screen hidden lg:flex flex-col justify-center p-10 bg-sidebar text-sidebar-foreground">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-11 w-11 rounded-xl bg-sidebar-primary grid place-items-center">
                        <ConstructionIcon className="h-6 w-6" />
                    </div>
                    <div className="font-display text-2xl font-semibold">
                        Ashirwaad
                    </div>
                </div>

                <h2 className="text-3xl font-semibold leading-tight">
                    Set a new password
                </h2>
                <p className="text-muted-foreground mt-3 max-w-md">
                    Choose a strong password to secure your account.
                </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-[420px]">

                    <div className="space-y-1.5 mb-7">
                        <div className="text-xs uppercase text-muted-foreground">
                            Reset Password
                        </div>
                        <h1 className="text-3xl font-semibold">Create New Password</h1>
                    </div>

                    <form onSubmit={submit} className="space-y-4">

                        {/* NEW PASSWORD */}
                        <div className="space-y-1.5">
                            <Label>New Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPwd ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                >
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="space-y-1.5">
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Updating..." : "Reset Password"}
                        </Button>
                    </form>
                </div>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    );
}