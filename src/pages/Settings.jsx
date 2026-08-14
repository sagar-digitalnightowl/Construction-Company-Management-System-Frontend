import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore, useThemeStore } from "@/store/authStore";
import { ROLES } from "@/data/permissions";
import { initials } from "@/lib/helpers";
import { authApi } from "@/api";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
	const { current, updateProfile } = useAuthStore();
	const { dark, toggle } = useThemeStore();

	const [name, setName] = useState(current.name);
	const [preview, setPreview] = useState(current.profileImage || null);
	const [loadingImage, setLoadingImage] = useState(false);
	const [loadingName, setLoadingName] = useState(false);

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			setLoadingImage(true);

			const localPreview = URL.createObjectURL(file);
			setPreview(localPreview);

			const presignedRes = await authApi.getPresignedUrl({
				fileName: file.name,
				fileType: "profile",
				mimeType: file.type,
			});

			const { url, key } = presignedRes.data;

			const uploadRes = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": file.type,
				},
				body: file,
			});

			if (!uploadRes.ok) {
				throw new Error("Failed to upload file to storage");
			}

			await authApi.confirmUpload({
				fileKey: key,
				fileType: "profile",
			});

			const updateRes = await authApi.updateProfile({
				name: name,
				profileImageKey: key,
			});

			if (updateRes?.data?.success) {
				updateProfile(updateRes.data.data);
				toast.success("Profile image updated");
			}

		} catch (err) {
			console.error("Upload error:", err);
			toast.error(err?.message || "Image upload failed");
		} finally {
			setLoadingImage(false);
		}
	};

	const handleNameSave = async () => {
		if (name === current.name) return;

		try {
			setLoadingName(true);

			const res = await authApi.updateProfile({
				name: name,
			});

			if (res?.data?.success) {
				updateProfile(res.data.data);
				toast.success("Name updated");
			}

		} catch (err) {
			console.error("Update error:", err);
			toast.error("Update failed");
		} finally {
			setLoadingName(false);
		}
	};

	return (
		<div className="space-y-6 md:space-y-8">
			<PageHeader
				eyebrow="Account"
				title="Settings & Profile"
				description="Manage your system identity and preferences."
			/>

			<div className="grid lg:grid-cols-[1fr_2fr] gap-6">

				<Card className="h-fit">
					<CardContent className="p-6 text-center flex flex-col items-center">

						{/* BuildHive: Updated to rounded-md for a square/architectural DP */}
						<div className="relative w-28 h-28 mx-auto cursor-pointer group rounded-md border border-border/80 p-1 bg-muted/10 shadow-sm">
							<Avatar className="h-full w-full rounded-sm overflow-hidden">
								{preview && (
									<AvatarImage src={preview} className="object-cover rounded-sm" />
								)}
								<AvatarFallback className="text-2xl font-display text-muted-foreground bg-background rounded-sm">
									{initials(current.name)}
								</AvatarFallback>
							</Avatar>

							{/* EDIT OVERLAY */}
							<div className="absolute inset-1 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-sm transition-all duration-200">
								{loadingImage ? (
									<span className="text-white text-[11px] font-medium tracking-wide uppercase">Uploading</span>
								) : (
									<span className="text-white text-[11px] font-medium tracking-wide uppercase">Change</span>
								)}
							</div>

							<input
								type="file"
								accept="image/*"
								className="absolute inset-0 opacity-0 cursor-pointer"
								onChange={handleImageChange}
							/>
						</div>

						<div className="font-semibold text-lg text-foreground mt-5">{current.name}</div>
						<div className="text-sm font-mono text-muted-foreground mt-1">{current.email}</div>

						<Badge variant="secondary" className="mt-4 font-mono text-[11px] uppercase tracking-wider">
							{ROLES[current.role]}
						</Badge>

						<Separator className="my-6 border-border/40" />

						<div className="w-full flex items-center justify-between p-3 rounded-md bg-muted/30 border border-border/40">
							<span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">System Status</span>
							<Badge variant={current.isActive ? "success" : "secondary"} className="font-mono text-[10px]">
								{current.isActive ? "ACTIVE" : "INACTIVE"}
							</Badge>
						</div>

					</CardContent>
				</Card>

				<Card>
					<CardHeader className="border-b border-border/40 pb-4">
						<CardTitle className="font-display text-sm uppercase tracking-wider text-foreground">Profile Configuration</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-6">

						<div className="space-y-1.5">
							<label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground block">Full Name</label>
							<div className="relative">
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									onBlur={handleNameSave}
									className="rounded-sm"
								/>
								{loadingName && (
									<span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground uppercase">
										Saving...
									</span>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-1.5">
								<label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground block">Email Address</label>
								<Input value={current.email} disabled className="font-mono text-sm rounded-sm bg-muted/30" />
							</div>

							<div className="space-y-1.5">
								<label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground block">Phone Number</label>
								<Input value={current.phone || "Not provided"} disabled className="font-mono text-sm rounded-sm bg-muted/30" />
							</div>
						</div>

						<Separator className="my-2 border-border/40" />

						<div className="flex items-center justify-between border border-border/60 rounded-md p-4 bg-accent/5">
							<div>
								<div className="text-sm font-medium text-foreground">Interface Theme</div>
								<div className="text-xs text-muted-foreground mt-0.5">
									Toggle between light and dark modes.
								</div>
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={toggle}
								className="h-auto rounded-sm border-border/80 px-3 py-2 text-[11px] font-display font-medium uppercase tracking-wider hover:bg-accent/15"
							>
								{dark ? (
									<>
										<Moon className="h-3.5 w-3.5" />
										Dark
									</>
								) : (
									<>
										<Sun className="h-3.5 w-3.5" />
										Light
									</>
								)}
							</Button>
						</div>

					</CardContent>
				</Card>

			</div>
		</div>
	);
}