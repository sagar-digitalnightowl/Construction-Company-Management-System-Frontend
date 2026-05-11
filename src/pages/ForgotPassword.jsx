import { useState } from "react";
import { ConstructionIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api";
import { Toaster } from "@/components/ui/sonner";

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
        <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">

            {/* LEFT PANEL */}
            <div className="min-h-screen hidden lg:flex flex-col justify-center p-10 bg-sidebar text-sidebar-foreground">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-11 w-11 rounded-xl bg-sidebar-primary grid place-items-center">
                        <ConstructionIcon className="h-6 w-6" />
                    </div>
                    <div className="font-display text-2xl font-semibold">
                        CCMS
                    </div>
                </div>

                <h2 className="text-3xl font-semibold leading-tight">
                    Reset your password securely
                </h2>
                <p className="text-muted-foreground mt-3 max-w-md">
                    Enter your email or mobile number and we’ll send you a reset link.
                </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-[420px]">

                    <div className="space-y-1.5 mb-7">
                        <div className="text-xs uppercase text-muted-foreground">
                            Forgot Password
                        </div>
                        <h1 className="text-3xl font-semibold">Recover Access</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your registered email or mobile.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label>Work email or mobile</Label>
                            <Input
                                type="text"
                                placeholder="you@gmail.com"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                </div>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    );
}