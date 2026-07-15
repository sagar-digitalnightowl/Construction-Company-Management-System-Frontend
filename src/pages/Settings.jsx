// import React, { useState } from "react";
// import { toast } from "sonner";
// import { PageHeader } from "@/components/common/PageHeader";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { useAuthStore, useUsersStore, useThemeStore } from "@/store/authStore";
// import { ROLES } from "@/data/permissions";
// import { initials } from "@/lib/helpers";
// import { authApi } from "@/api";

// export default function Settings() {
//     const { current, updateProfile } = useAuthStore();
//     const { dark, toggle } = useThemeStore();

//     // console.log(current)

//     const [name, setName] = useState(current.name);
//     const [profileImage, setProfileImage] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const save = async () => {
//         try {
//             setLoading(true);
//             const formData = new FormData();
//             formData.append("name", name);

//             if (profileImage) {
//                 formData.append("profileImage", profileImage);
//             }

//             const res = await authApi.updateProfile(formData);

//             if (res?.data?.success) {
//                 updateProfile(res.data.data);
//                 toast.success("Profile updated successfully");
//             }
//         } catch (error) {
//             toast.error(error?.response?.data?.message || "Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             < PageHeader eyebrow="Account" title="Settings & Profile" description="Manage your account, appearance and notifications." />

//             < div className="grid lg:grid-cols-[1fr_2fr] gap-5">
//                 < Card >
//                     <CardContent className="p-6 text-center">
//                         <Avatar
//                             className="h-20 w-20 mx-auto"
//                         >
//                             {current?.profileImage && (
//                                 <AvatarImage
//                                     src={current.profileImage}
//                                     alt={current.name}
//                                 />
//                             )}
//                             <AvatarFallback className="bg-foreground text-background text-xl">{initials(current.name)}</AvatarFallback>
//                         </Avatar>
//                         <div className="font-display text-lg font-semibold mt-3">{current.name}</div>
//                         <div className="text-sm text-muted-foreground">{current.email}</div>
//                         <Badge className="mt-3" variant="default">{ROLES[current.role]}</Badge>
//                         <Separator className="my-5" />
//                         <div className="text-left space-y-2 text-sm">
//                             {/* <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span>{current.department || "—"}</span></div> */}
//                             {/* <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>{current.joinedAt}</span></div> */}
//                             <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="success">{current.isActive ? "Active" : "In Active"}</Badge></div>
//                         </div >
//                     </CardContent >
//                 </Card >

//                 <div className="space-y-5">
//                     < Card >
//                         <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal details.</CardDescription></CardHeader>
//                         <CardContent className="grid grid-cols-2 gap-3">
//                             <div className="col-span-2 space-y-1.5">
//                                 <Label>Profile Image</Label>
//                                 <Input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => setProfileImage(e.target.files[0])}
//                                 />
//                             </div>
//                             <div div className="col-span-2 space-y-1.5"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
//                             <div div className="space-y-1.5"><Label>Email</Label><Input value={current.email} disabled /></div>
//                             <div className="space-y-1.5"><Label>Phone</Label><Input value={current.phone} disabled /></div>
//                             <div div className="col-span-2 flex justify-end">
//                                 <Button
//                                     onClick={save}
//                                     disabled={loading}
//                                 >
//                                     {loading ? "Saving..." : "Save changes"}
//                                 </Button>
//                             </div>
//                         </CardContent >
//                     </Card >

//                     <Card>
//                         <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Switch between bone-light and graphite-dark.</CardDescription></CardHeader>
//                         <CardContent>
//                             <div className="flex items-center justify-between p-4 rounded-lg border border-border">
//                                 <div>
//                                     <div className="font-medium">Dark mode</div>
//                                     <div className="text-xs text-muted-foreground">Easier on the eyes after sundown.</div>
//                                 </div>
//                                 <Button variant={dark ? "default" : "outline"} onClick={toggle}>{dark ? "On" : "Off"}</Button>
//                             </div >
//                         </CardContent >
//                     </Card >

//                     {/* <Card>
//                         <CardHeader><CardTitle>Integrations</CardTitle><CardDescription>Connected services (demo).</CardDescription></CardHeader>
//                         <CardContent className="grid sm:grid-cols-2 gap-3">
//                             {[
//                                 { name: "Tally ERP", status: "connected" },
//                                 { name: "GST Suvidha API", status: "connected" },
//                                 { name: "WhatsApp Business", status: "connected" },
//                                 { name: "Razorpay Payments", status: "not_connected" },
//                             ].map((it) => (
//                                 <div key={it.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
//                                     <div className="text-sm font-medium">{it.name}</div>
//                                     <Badge variant={it.status === "connected" ? "success" : "muted"}>{it.status.replace("_", " ")}</Badge>
//                                 </div >
//                             ))
//                             }
//                         </CardContent >
//                     </Card > */}
//                 </div >
//             </div >
//         </div >
//     );
// }




// import React, { useState } from "react";
// import { toast } from "sonner";
// import { PageHeader } from "@/components/common/PageHeader";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { useAuthStore, useThemeStore } from "@/store/authStore";
// import { ROLES } from "@/data/permissions";
// import { initials } from "@/lib/helpers";
// import { authApi } from "@/api";

// export default function Settings() {
//     const { current, updateProfile } = useAuthStore();
//     const { dark, toggle } = useThemeStore();

//     const [name, setName] = useState(current.name);
//     const [preview, setPreview] = useState(current.profileImage || null);
//     const [loadingImage, setLoadingImage] = useState(false);
//     const [loadingName, setLoadingName] = useState(false);

//     // 🔥 HANDLE IMAGE CHANGE (AUTO UPLOAD)
//     const handleImageChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         try {
//             setLoadingImage(true);

//             // preview instantly
//             const localPreview = URL.createObjectURL(file);
//             setPreview(localPreview);

//             // 1. get presigned URL
//             const { data } = await authApi.getPresignedUrl({
//                 fileName: file.name,
//                 fileType: "profile",
//                 mimeType: file.type,
//             });


//             // 2. upload to S3
//             await fetch(data.data.uploadUrl, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": file.type,
//                 },
//                 body: file,
//             });

//             // 3. confirm upload
//             await authApi.confirmUpload({
//                 fileKey: data.data.fileKey,
//                 fileType: "profile",
//             });

//             // 4. update profile with URL
//             const res = await authApi.updateProfile({
//                 name,
//                 profileImage: data.data.publicUrl,
//             });

//             console.log("Respose from the api  : ", res)

//             if (res?.data?.success) {
//                 updateProfile(res.data.data);
//                 toast.success("Profile image updated");
//             }

//         } catch (err) {
//             toast.error("Image upload failed");
//         } finally {
//             setLoadingImage(false);
//         }
//     };

//     // 🔥 AUTO SAVE NAME ON BLUR
//     const handleNameSave = async () => {
//         if (name === current.name) return;

//         try {
//             setLoadingName(true);

//             const res = await authApi.updateProfile({
//                 name,
//                 profileImage: current.profileImage,
//             });

//             if (res?.data?.success) {
//                 updateProfile(res.data.data);
//                 toast.success("Name updated");
//             }

//         } catch (err) {
//             toast.error("Update failed");
//         } finally {
//             setLoadingName(false);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <PageHeader
//                 eyebrow="Account"
//                 title="Settings & Profile"
//                 description="Manage your account."
//             />

//             <div className="grid lg:grid-cols-[1fr_2fr] gap-5">

//                 {/* LEFT CARD */}
//                 <Card>
//                     <CardContent className="p-6 text-center">

//                         {/* 🔥 CLICKABLE AVATAR */}
//                         <div className="relative w-24 h-24 mx-auto cursor-pointer group">
//                             <Avatar className="h-24 w-24">
//                                 {preview && (
//                                     <AvatarImage src={preview} />
//                                 )}
//                                 <AvatarFallback className="text-xl">
//                                     {initials(current.name)}
//                                 </AvatarFallback>
//                             </Avatar>

//                             {/* EDIT OVERLAY */}
//                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
//                                 {loadingImage ? (
//                                     <span className="text-white text-xs">Uploading...</span>
//                                 ) : (
//                                     <span className="text-white text-xs">Edit</span>
//                                 )}
//                             </div>

//                             {/* HIDDEN INPUT */}
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 className="absolute inset-0 opacity-0 cursor-pointer"
//                                 onChange={handleImageChange}
//                             />
//                         </div>

//                         <div className="font-semibold mt-3">{current.name}</div>
//                         <div className="text-sm text-muted-foreground">{current.email}</div>

//                         <Badge className="mt-3">
//                             {ROLES[current.role]}
//                         </Badge>

//                         <Separator className="my-5" />

//                         <div className="flex justify-between text-sm">
//                             <span className="text-muted-foreground">Status</span>
//                             <Badge variant="success">
//                                 {current.isActive ? "Active" : "Inactive"}
//                             </Badge>
//                         </div>

//                     </CardContent>
//                 </Card>

//                 {/* RIGHT CARD */}
//                 <Card>
//                     <CardContent className="p-6 space-y-4">

//                         <div>
//                             <label className="text-sm">Full Name</label>
//                             <Input
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 onBlur={handleNameSave}
//                             />
//                             {loadingName && (
//                                 <p className="text-xs text-muted-foreground mt-1">
//                                     Saving...
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <label className="text-sm">Email</label>
//                             <Input value={current.email} disabled />
//                         </div>

//                         <div>
//                             <label className="text-sm">Phone</label>
//                             <Input value={current.phone || ""} disabled />
//                         </div>

//                         {/* DARK MODE */}
//                         <div className="flex items-center justify-between border rounded-lg p-4">
//                             <div>
//                                 <div className="font-medium">Dark mode</div>
//                                 <div className="text-xs text-muted-foreground">
//                                     Toggle theme
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={toggle}
//                                 className="px-3 py-1 border rounded"
//                             >
//                                 {dark ? "On" : "Off"}
//                             </button>
//                         </div>

//                     </CardContent>
//                 </Card>

//             </div>
//         </div>
//     );
// }






// import React, { useState } from "react";
// import { toast } from "sonner";
// import { PageHeader } from "@/components/common/PageHeader";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { useAuthStore, useThemeStore } from "@/store/authStore";
// import { ROLES } from "@/data/permissions";
// import { initials } from "@/lib/helpers";
// import { authApi } from "@/api";

// export default function Settings() {
//     const { current, updateProfile } = useAuthStore();
//     const { dark, toggle } = useThemeStore();

//     const [name, setName] = useState(current.name);
//     const [preview, setPreview] = useState(current.profileImage || null);
//     const [loadingImage, setLoadingImage] = useState(false);
//     const [loadingName, setLoadingName] = useState(false);

//     // 🔥 HANDLE IMAGE CHANGE (PRESIGNED URL FLOW)
//     const handleImageChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         try {
//             setLoadingImage(true);

//             // preview instantly
//             const localPreview = URL.createObjectURL(file);
//             setPreview(localPreview);

//             // 1. get presigned URL
//             const { data } = await authApi.getPresignedUrl({
//                 fileName: file.name,
//                 fileType: "profile",
//                 mimeType: file.type,
//             });

//             // ✅ Store fileKey for later
//             const fileKey = data.data.fileKey;

//             // 2. upload to S3
//             await fetch(data.data.uploadUrl, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": file.type,
//                 },
//                 body: file,
//             });

//             // 3. confirm upload (optional but recommended)
//             await authApi.confirmUpload({
//                 fileKey: fileKey,
//                 fileType: "profile",
//             });

//             // ✅ 4. update profile with fileKey (NOT publicUrl)
//             const res = await authApi.updateProfile({
//                 name: name,
//                 profileImageKey: fileKey, // ✅ CORRECT FIELD
//             });

//             console.log("Response from the API:", res);

//             if (res?.data?.success) {
//                 // ✅ Profile image URL backend se update ho jayega
//                 updateProfile(res.data.data);
//                 toast.success("Profile image updated");
//             }

//         } catch (err) {
//             console.error("Upload error:", err);
//             toast.error("Image upload failed");
//         } finally {
//             setLoadingImage(false);
//         }
//     };

//     // 🔥 AUTO SAVE NAME ON BLUR
//     const handleNameSave = async () => {
//         if (name === current.name) return;

//         try {
//             setLoadingName(true);

//             // ✅ Only send name, no profileImage field
//             const res = await authApi.updateProfile({
//                 name: name,
//             });

//             if (res?.data?.success) {
//                 updateProfile(res.data.data);
//                 toast.success("Name updated");
//             }

//         } catch (err) {
//             console.error("Update error:", err);
//             toast.error("Update failed");
//         } finally {
//             setLoadingName(false);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <PageHeader
//                 eyebrow="Account"
//                 title="Settings & Profile"
//                 description="Manage your account."
//             />

//             <div className="grid lg:grid-cols-[1fr_2fr] gap-5">

//                 {/* LEFT CARD */}
//                 <Card>
//                     <CardContent className="p-6 text-center">

//                         {/* 🔥 CLICKABLE AVATAR */}
//                         <div className="relative w-24 h-24 mx-auto cursor-pointer group">
//                             <Avatar className="h-24 w-24">
//                                 {preview && (
//                                     <AvatarImage src={preview} />
//                                 )}
//                                 <AvatarFallback className="text-xl">
//                                     {initials(current.name)}
//                                 </AvatarFallback>
//                             </Avatar>

//                             {/* EDIT OVERLAY */}
//                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
//                                 {loadingImage ? (
//                                     <span className="text-white text-xs">Uploading...</span>
//                                 ) : (
//                                     <span className="text-white text-xs">Edit</span>
//                                 )}
//                             </div>

//                             {/* HIDDEN INPUT */}
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 className="absolute inset-0 opacity-0 cursor-pointer"
//                                 onChange={handleImageChange}
//                             />
//                         </div>

//                         <div className="font-semibold mt-3">{current.name}</div>
//                         <div className="text-sm text-muted-foreground">{current.email}</div>

//                         <Badge className="mt-3">
//                             {ROLES[current.role]}
//                         </Badge>

//                         <Separator className="my-5" />

//                         <div className="flex justify-between text-sm">
//                             <span className="text-muted-foreground">Status</span>
//                             <Badge variant="success">
//                                 {current.isActive ? "Active" : "Inactive"}
//                             </Badge>
//                         </div>

//                     </CardContent>
//                 </Card>

//                 {/* RIGHT CARD */}
//                 <Card>
//                     <CardContent className="p-6 space-y-4">

//                         <div>
//                             <label className="text-sm">Full Name</label>
//                             <Input
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 onBlur={handleNameSave}
//                             />
//                             {loadingName && (
//                                 <p className="text-xs text-muted-foreground mt-1">
//                                     Saving...
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <label className="text-sm">Email</label>
//                             <Input value={current.email} disabled />
//                         </div>

//                         <div>
//                             <label className="text-sm">Phone</label>
//                             <Input value={current.phone || ""} disabled />
//                         </div>

//                         {/* DARK MODE */}
//                         <div className="flex items-center justify-between border rounded-lg p-4">
//                             <div>
//                                 <div className="font-medium">Dark mode</div>
//                                 <div className="text-xs text-muted-foreground">
//                                     Toggle theme
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={toggle}
//                                 className="px-3 py-1 border rounded"
//                             >
//                                 {dark ? "On" : "Off"}
//                             </button>
//                         </div>

//                     </CardContent>
//                 </Card>

//             </div>
//         </div>
//     );
// }



import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore, useThemeStore } from "@/store/authStore";
import { ROLES } from "@/data/permissions";
import { initials } from "@/lib/helpers";
import { authApi } from "@/api";

export default function Settings() {
    const { current, updateProfile } = useAuthStore();
    const { dark, toggle } = useThemeStore();

    const [name, setName] = useState(current.name);
    const [preview, setPreview] = useState(current.profileImage || null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingName, setLoadingName] = useState(false);

    // 🔥 HANDLE IMAGE CHANGE (PRESIGNED URL FLOW)
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoadingImage(true);

            // preview instantly
            const localPreview = URL.createObjectURL(file);
            setPreview(localPreview);

            // 1. get presigned URL
            const presignedRes = await authApi.getPresignedUrl({
                fileName: file.name,
                fileType: "profile",
                mimeType: file.type,
            });

            // ✅ FIXED: Access url and key directly from res.data
            const { url, key } = presignedRes.data;

            // 2. upload to S3
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

            // 3. confirm upload (optional but recommended)
            await authApi.confirmUpload({
                fileKey: key,
                fileType: "profile",
            });

            // 4. update profile with fileKey
            const updateRes = await authApi.updateProfile({
                name: name,
                profileImageKey: key,
            });

            console.log("Response from the API:", updateRes);

            // ✅ FIXED: Check the correct response structure
            if (updateRes?.data?.success) {
                // Profile image URL backend se update ho jayega
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

    // 🔥 AUTO SAVE NAME ON BLUR
    const handleNameSave = async () => {
        if (name === current.name) return;

        try {
            setLoadingName(true);

            // Only send name, no profileImage field
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
        <div className="space-y-6">
            <PageHeader
                eyebrow="Account"
                title="Settings & Profile"
                description="Manage your account."
            />

            <div className="grid lg:grid-cols-[1fr_2fr] gap-5">

                {/* LEFT CARD */}
                <Card>
                    <CardContent className="p-6 text-center">

                        {/* 🔥 CLICKABLE AVATAR */}
                        <div className="relative w-24 h-24 mx-auto cursor-pointer group">
                            <Avatar className="h-24 w-24">
                                {preview && (
                                    <AvatarImage src={preview} />
                                )}
                                <AvatarFallback className="text-xl">
                                    {initials(current.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* EDIT OVERLAY */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
                                {loadingImage ? (
                                    <span className="text-white text-xs">Uploading...</span>
                                ) : (
                                    <span className="text-white text-xs">Edit</span>
                                )}
                            </div>

                            {/* HIDDEN INPUT */}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="font-semibold mt-3">{current.name}</div>
                        <div className="text-sm text-muted-foreground">{current.email}</div>

                        <Badge className="mt-3">
                            {ROLES[current.role]}
                        </Badge>

                        <Separator className="my-5" />

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant="success">
                                {current.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>

                    </CardContent>
                </Card>

                {/* RIGHT CARD */}
                <Card>
                    <CardContent className="p-6 space-y-4">

                        <div>
                            <label className="text-sm">Full Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={handleNameSave}
                            />
                            {loadingName && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Saving...
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm">Email</label>
                            <Input value={current.email} disabled />
                        </div>

                        <div>
                            <label className="text-sm">Phone</label>
                            <Input value={current.phone || ""} disabled />
                        </div>

                        {/* DARK MODE */}
                        <div className="flex items-center justify-between border rounded-lg p-4">
                            <div>
                                <div className="font-medium">Dark mode</div>
                                <div className="text-xs text-muted-foreground">
                                    Toggle theme
                                </div>
                            </div>
                            <button
                                onClick={toggle}
                                className="px-3 py-1 border rounded"
                            >
                                {dark ? "On" : "Off"}
                            </button>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}