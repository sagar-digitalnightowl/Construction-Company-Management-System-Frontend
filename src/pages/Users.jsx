
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, ShieldCheck, ChevronLeft, ChevronRight, Upload, X, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuthStore } from "@/store/authStore";
import { ROLES, canMutate } from "@/data/permissions";
import { initials } from "@/lib/helpers";
import { authApi } from "@/api";
import { hrApi } from "@/api/hrApi";

const empty = {
    name: "", email: "", phone: "", role: "site_engineer", department: "", password: "", status: "active",
    employeeId: "", dateOfBirth: "", gender: "", bloodGroup: "", maritalStatus: "",
    aadharNumber: "", panNumber: "", fatherName: "", motherName: "",
    emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelation: "",
    addressLine1: "", addressLine2: "", city: "", state: "", pincode: "",
    sameAsPermanent: true,
    currentAddressLine1: "", currentCity: "", currentState: "", currentPincode: "",
    bankName: "", accountNumber: "", ifscCode: "", upiId: "", accountType: "Savings", branchName: "",
    designation: "", joiningDate: "", employmentType: "Full-Time",
    basicSalary: "", hra: "", allowances: "", totalCTC: "",
    totalExperienceYears: "", probationPeriodMonths: "",
};

export default function Users() {
    const { current } = useAuthStore();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [form, setForm] = useState(empty);
    const [confirmId, setConfirmId] = useState(null);

    const [step, setStep] = useState(1);
    const [users, setUsers] = useState([]);
    const [roleStats, setRoleStats] = useState({}); // 🆕 Backend Role Stats
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });

    const [otpStep, setOtpStep] = useState(null);
    const [otpData, setOtpData] = useState({ identifier: "", otp: "", type: "email" });
    const [displayEmailOtp, setDisplayEmailOtp] = useState("");
    const [displayPhoneOtp, setDisplayPhoneOtp] = useState("");

    const [formError, setFormError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [fileUploading, setFileUploading] = useState(false);
    const [togglingUser, setTogglingUser] = useState(null);

    const [departments, setDepartments] = useState([]);

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [tenthMarksheetFile, setTenthMarksheetFile] = useState(null);
    const [twelfthMarksheetFile, setTwelfthMarksheetFile] = useState(null);
    const [graduationCertFile, setGraduationCertFile] = useState(null);
    const [postGraduationCertFile, setPostGraduationCertFile] = useState(null);
    const [aadharCardFile, setAadharCardFile] = useState(null);
    const [panCardFile, setPanCardFile] = useState(null);
    const [profileImageKey, setProfileImageKey] = useState(null);

    const fetchDepartments = async () => {
        try {
            const res = await hrApi.getAllDepartments();
            setDepartments(res.data?.data || []);
        } catch {
            toast.error("Failed to load departments");
        }
    };

    // Debounce for Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Server-Side API Fetch
    const fetchUsers = async () => {
        try {
            const params = { page, limit };
            if (debouncedSearch) params.search = debouncedSearch;
            if (roleFilter !== "all") params.role = roleFilter;

            const res = await authApi.getUsers(params);
            if (res?.data?.success) {
                setUsers(res.data.data.users || []);
                
                // 🆕 Store roleStats from API to build dynamic dropdown
                if (res.data.data.roleStats) {
                    setRoleStats(res.data.data.roleStats);
                }

                if (res.data.data.pagination) {
                    setPagination({
                        total: res.data.data.pagination.total || 0,
                        pages: res.data.data.pagination.pages || 1
                    });
                }
            }
        } catch {
            toast.error("Failed to load users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit, debouncedSearch, roleFilter]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleRoleChange = (val) => {
        setRoleFilter(val);
        setPage(1);
    };

    const handleStatusToggle = async (user) => {
        if (!canMutate(current?.role, "users")) {
            toast.error("You don't have permission to update users");
            return;
        }
        setTogglingUser(user._id);
        try {
            const newStatus = !user.isActive;
            await authApi.updateUser(user._id, { isActive: newStatus });
            setUsers(prevUsers => prevUsers.map(u => u._id === user._id ? { ...u, isActive: newStatus } : u));
            toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update user status");
        } finally {
            setTogglingUser(null);
        }
    };

    const startCreate = () => {
        setEditing(null);
        setViewMode(false);
        setForm({ ...empty, password: "demo123" });
        setStep(1);
        resetFiles();
        setFormError('');
        setOpen(true);
    };

    const resetFiles = () => {
        setProfileImageFile(null);
        setProfileImagePreview(null);
        setTenthMarksheetFile(null);
        setTwelfthMarksheetFile(null);
        setGraduationCertFile(null);
        setPostGraduationCertFile(null);
        setAadharCardFile(null);
        setPanCardFile(null);
        setProfileImageKey(null);
    };

    const loadUserDetails = async (user, isViewMode) => {
        const loadingId = toast.loading("Fetching user details...");
        try {
            const res = await authApi.getUserById(user._id);
            toast.dismiss(loadingId);

            if (res?.data?.success) {
                const freshUser = res.data.data || res.data;
                const personal = freshUser.personalDetails || {};
                const permAddr = personal.address?.permanentAddress || personal.permanentAddress || {};
                const currAddr = personal.address?.currentAddress || personal.currentAddress || {};
                const isSame = personal.sameAsPermanent !== undefined ? personal.sameAsPermanent : (personal.address?.sameAsPermanent !== false);
                const emergencyContact = personal.emergencyContact || {};
                const bank = freshUser.bankDetails || {};
                const job = freshUser.jobDetails || {};
                const salary = job.salary || {};

                setForm({
                    name: freshUser.name || "",
                    email: freshUser.email || "",
                    phone: freshUser.phone || "",
                    role: freshUser.role || "",
                    employeeId: freshUser.employeeId || "",
                    department: freshUser.department?._id || freshUser.department || "",
                    password: "",
                    status: freshUser.isActive ? "active" : "inactive",
                    dateOfBirth: personal.dateOfBirth?.slice(0, 10) || "",
                    gender: personal.gender || "",
                    bloodGroup: personal.bloodGroup || "",
                    maritalStatus: personal.maritalStatus || "",
                    aadharNumber: personal.aadharNumber || "",
                    panNumber: personal.panNumber || "",
                    fatherName: personal.fatherName || "",
                    motherName: personal.motherName || "",
                    emergencyContactName: emergencyContact.name || personal.emergencyContactName || "",
                    emergencyContactPhone: emergencyContact.phone || personal.emergencyContactPhone || "",
                    emergencyContactRelation: emergencyContact.relation || personal.emergencyContactRelation || "",
                    addressLine1: permAddr.line1 || "",
                    addressLine2: permAddr.line2 || "",
                    city: permAddr.city || "",
                    state: permAddr.state || "",
                    pincode: permAddr.pincode || "",
                    sameAsPermanent: isSame,
                    currentAddressLine1: currAddr.line1 || "",
                    currentCity: currAddr.city || "",
                    currentState: currAddr.state || "",
                    currentPincode: currAddr.pincode || "",
                    bankName: bank.bankName || "",
                    accountNumber: bank.accountNumber || "",
                    ifscCode: bank.ifscCode || "",
                    upiId: bank.upiId || "",
                    accountType: bank.accountType || "Savings",
                    branchName: bank.branchName || "",
                    designation: job.designation || "",
                    joiningDate: job.joiningDate?.slice(0, 10) || "",
                    employmentType: job.employmentType || "Full-Time",
                    basicSalary: salary.basic || job.basicSalary || "",
                    hra: salary.hra || job.hra || "",
                    allowances: salary.allowances || job.allowances || "",
                    totalCTC: salary.totalCTC || job.totalCTC || "",
                    totalExperienceYears: freshUser.totalExperienceYears !== undefined && freshUser.totalExperienceYears !== null ? String(freshUser.totalExperienceYears) : "",
                    probationPeriodMonths: job.probationPeriodMonths !== undefined && job.probationPeriodMonths !== null ? String(job.probationPeriodMonths) : "",
                });
                
                resetFiles();
                setProfileImagePreview(freshUser.profileImage || null);
                setFormError("");
                setViewMode(isViewMode);
                setEditing(freshUser);
                setStep(1);
                setOpen(true);
            }
        } catch (err) {
            toast.dismiss(loadingId);
            toast.error("Failed to load user details");
        }
    };

    const viewUser = (user) => loadUserDetails(user, true);
    const startEdit = (user) => loadUserDetails(user, false);

    const handleDelete = async () => {
        if (!confirmId) return;
        try {
            await authApi.deleteUser(confirmId);
            toast.success("User deleted successfully!");
            fetchUsers();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete user");
        } finally {
            setConfirmId(null);
        }
    };

    const validateStep1 = () => {
        if (viewMode) return true;
        if (!form.name.trim()) { toast.error("Full name is required"); return false; }
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Invalid email"); return false; }
        if (form.phone && !/^\+?\d{10,15}$/.test(form.phone)) { toast.error("Invalid phone format"); return false; }
        if (!editing && (!form.password || form.password.length < 6)) { toast.error("Password must be at least 6 characters"); return false; }
        return true;
    };

    const validateStep2 = () => {
        if (viewMode) return true;
        if (!form.dateOfBirth) { toast.error("Date of Birth is required"); return false; }
        if (!form.gender) { toast.error("Gender is required"); return false; }
        if (!form.bloodGroup) { toast.error("Blood group is required"); return false; }
        if (form.aadharNumber && !/^\d{12}$/.test(form.aadharNumber)) { toast.error("Aadhar must be exactly 12 digits"); return false; }
        if (!form.addressLine1 || !form.city || !form.state || !form.pincode) { toast.error("Permanent address is incomplete"); return false; }
        return true;
    };

    const validateStep3 = () => {
        if (viewMode) return true;
        if (!form.designation) { toast.error("Designation is required"); return false; }
        if (!form.joiningDate) { toast.error("Joining date is required"); return false; }
        if (!form.basicSalary) { toast.error("Basic salary is required"); return false; }
        if (!form.totalCTC) { toast.error("Total CTC is required"); return false; }
        if (Number(form.totalCTC) < Number(form.basicSalary)) { toast.error("Total CTC cannot be less than basic salary"); return false; }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        if (step === 3 && !validateStep3()) return;
        
        if (editing && step === 3) {
            save(); 
            return;
        }
        
        if (step < 4) setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const uploadFileWithPresignedUrl = async (file, fileType) => {
        if (!file) return null;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            toast.error(`Invalid file type. Allowed: JPEG, PNG, JPG, WEBP, PDF`);
            return null;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size should be less than 10MB');
            return null;
        }
        try {
            const presignedRes = await authApi.getPresignedUrl({
                fileName: file.name, fileType, mimeType: file.type,
            });
            const { url, key } = presignedRes.data;
            const uploadRes = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
            if (!uploadRes.ok) throw new Error("Failed to upload file");
            await authApi.confirmUpload({ fileKey: key, fileType });
            return key;
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error?.message || `Failed to upload ${fileType}`);
            return null;
        }
    };

    const handleFileSelect = (e, setFile, setPreview, fileType) => {
        const file = e.target.files?.[0];
        if (file) {
            if (fileType === "profile") {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(file);
            }
            setFile(file);
            toast.info(`${file.name} selected`);
        }
        e.target.value = '';
    };

    const uploadAllFiles = async () => {
        setFileUploading(true);
        const keys = {};
        try {
            if (profileImageFile) keys.profileImageKey = await uploadFileWithPresignedUrl(profileImageFile, "profile");
            if (tenthMarksheetFile) keys.tenthMarksheetKey = await uploadFileWithPresignedUrl(tenthMarksheetFile, "document");
            if (twelfthMarksheetFile) keys.twelfthMarksheetKey = await uploadFileWithPresignedUrl(twelfthMarksheetFile, "document");
            if (graduationCertFile) keys.graduationCertKey = await uploadFileWithPresignedUrl(graduationCertFile, "document");
            if (postGraduationCertFile) keys.postGraduationCertKey = await uploadFileWithPresignedUrl(postGraduationCertFile, "document");
            if (aadharCardFile) keys.aadharCardKey = await uploadFileWithPresignedUrl(aadharCardFile, "document");
            if (panCardFile) keys.panCardKey = await uploadFileWithPresignedUrl(panCardFile, "document");
            return keys;
        } catch (error) {
            toast.error("Failed to upload files");
            return null;
        } finally {
            setFileUploading(false);
        }
    };

    const buildRegisterPayload = (uploadedKeys = {}) => {
        return {
            email: form.email, phone: form.phone, password: form.password, name: form.name,
            role: form.role, department: form.department || null, employeeId: form.employeeId || `EMP${Date.now()}`,
            totalExperienceYears: form.totalExperienceYears !== "" ? Number(form.totalExperienceYears) : undefined,
            personalDetails: {
                dateOfBirth: form.dateOfBirth || undefined, gender: form.gender || undefined,
                bloodGroup: form.bloodGroup || undefined, maritalStatus: form.maritalStatus || undefined,
                aadharNumber: form.aadharNumber || undefined, panNumber: form.panNumber || undefined,
                fatherName: form.fatherName || undefined, motherName: form.motherName || undefined,
                emergencyContactName: form.emergencyContactName || undefined,
                emergencyContactPhone: form.emergencyContactPhone || undefined,
                emergencyContactRelation: form.emergencyContactRelation || undefined,
                permanentAddress: {
                    line1: form.addressLine1 || undefined, line2: form.addressLine2 || undefined,
                    city: form.city || undefined, state: form.state || undefined, country: "India", pincode: form.pincode || undefined,
                },
                sameAsPermanent: form.sameAsPermanent !== undefined ? form.sameAsPermanent : true,
                currentAddress: form.sameAsPermanent ? undefined : {
                    line1: form.currentAddressLine1 || undefined, city: form.currentCity || undefined,
                    state: form.currentState || undefined, country: "India", pincode: form.currentPincode || undefined,
                }
            },
            bankDetails: {
                bankName: form.bankName || undefined, accountNumber: form.accountNumber || undefined,
                ifscCode: form.ifscCode || undefined, upiId: form.upiId || undefined, accountHolderName: form.name,
                accountType: form.accountType || "Savings", branchName: form.branchName || undefined,
            },
            jobDetails: {
                designation: form.designation || undefined, joiningDate: form.joiningDate || undefined,
                employmentType: form.employmentType || "Full-Time", basicSalary: form.basicSalary !== "" ? Number(form.basicSalary) : undefined,
                hra: form.hra !== "" ? Number(form.hra) : undefined, allowances: form.allowances !== "" ? Number(form.allowances) : undefined,
                totalCTC: form.totalCTC !== "" ? Number(form.totalCTC) : undefined, probationPeriodMonths: form.probationPeriodMonths !== "" ? Number(form.probationPeriodMonths) : undefined,
            },
            ...uploadedKeys
        };
    };

    const buildUpdatePayload = () => {
        const payload = {
            name: form.name, email: form.email, phone: form.phone, role: form.role,
            department: form.department || null, employeeId: form.employeeId || undefined, isActive: form.status === "active",
            totalExperienceYears: form.totalExperienceYears !== "" ? Number(form.totalExperienceYears) : 0,
            emergencyContactName: form.emergencyContactName, emergencyContactPhone: form.emergencyContactPhone, emergencyContactRelation: form.emergencyContactRelation,
            basicSalary: form.basicSalary !== "" ? Number(form.basicSalary) : 0, hra: form.hra !== "" ? Number(form.hra) : 0,
            allowances: form.allowances !== "" ? Number(form.allowances) : 0, totalCTC: form.totalCTC !== "" ? Number(form.totalCTC) : 0,
            personalDetails: {
                dateOfBirth: form.dateOfBirth || undefined, gender: form.gender || undefined, bloodGroup: form.bloodGroup || undefined,
                maritalStatus: form.maritalStatus || undefined, aadharNumber: form.aadharNumber || undefined, panNumber: form.panNumber || undefined,
                fatherName: form.fatherName || undefined, motherName: form.motherName || undefined,
                address: {
                    permanentAddress: {
                        line1: form.addressLine1 || undefined, line2: form.addressLine2 || undefined,
                        city: form.city || undefined, state: form.state || undefined, country: "India", pincode: form.pincode || undefined,
                    },
                    sameAsPermanent: form.sameAsPermanent !== undefined ? form.sameAsPermanent : true,
                    currentAddress: form.sameAsPermanent ? undefined : {
                        line1: form.currentAddressLine1 || undefined, city: form.currentCity || undefined,
                        state: form.currentState || undefined, country: "India", pincode: form.currentPincode || undefined,
                    }
                }
            },
            bankDetails: {
                bankName: form.bankName || undefined, accountNumber: form.accountNumber || undefined, ifscCode: form.ifscCode || undefined,
                upiId: form.upiId || undefined, accountHolderName: form.name, accountType: form.accountType || "Savings", branchName: form.branchName || undefined,
            },
            jobDetails: {
                designation: form.designation || undefined, joiningDate: form.joiningDate || undefined, employmentType: form.employmentType || "Full-Time",
                probationPeriodMonths: form.probationPeriodMonths !== "" ? Number(form.probationPeriodMonths) : undefined,
            },
        };
        if (form.password && form.password.trim() !== "") payload.password = form.password;
        return payload;
    };

    const save = async () => {
        if (viewMode) return;
        try {
            setLoadingBtn(true);
            setFormError("");

            if (editing) {
                let profileImageKeyToSend = null;
                if (profileImageFile) {
                    profileImageKeyToSend = await uploadFileWithPresignedUrl(profileImageFile, "profile");
                    if (!profileImageKeyToSend) { setLoadingBtn(false); return; }
                }
                const updatePayload = buildUpdatePayload();
                if (profileImageKeyToSend) updatePayload.profileImageKey = profileImageKeyToSend;
                await authApi.updateUser(editing._id, updatePayload);
                toast.success("User updated successfully");
                setOpen(false);
                fetchUsers();
            } else {
                if (!tenthMarksheetFile) {
                    toast.error("10th Marksheet is required!");
                    setLoadingBtn(false);
                    return;
                }
                const uploadedKeys = await uploadAllFiles();
                if (!uploadedKeys) { setLoadingBtn(false); return; }

                const registerData = buildRegisterPayload(uploadedKeys);
                const res = await authApi.registerUser(registerData);
                if (res?.data?.success) {
                    const responseData = res.data.data;
                    setDisplayEmailOtp(responseData.emailOtp || "");
                    setDisplayPhoneOtp(responseData.phoneOtp || "");
                    setOtpData({ identifier: form.email, otp: "", type: "email" });
                    setOtpStep("email");
                    setOpen(false);
                }
            }
        } catch (err) {
            setFormError(err?.response?.data?.message || err?.message || "Failed to save user");
        } finally {
            setLoadingBtn(false);
        }
    };

    const verifyOtp = async () => {
        try {
            setLoadingBtn(true);
            setOtpError("");
            const res = await authApi.verifyOtp(otpData);
            if (res?.data?.success) {
                if (otpStep === "email") {
                    setOtpData({ identifier: form.phone, otp: "", type: "phone" });
                    setOtpStep("phone");
                } else {
                    setOtpStep(null);
                    fetchUsers();
                    toast.success("User created successfully");
                }
            }
        } catch (err) {
            setOtpError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoadingBtn(false);
        }
    };

    const canEdit = canMutate(current?.role, "users");
    
    // Safety check just in case Backend returns "client" data on "All" fetch
    const displayUsers = users.filter(u => u.role !== "client");

    const renderFileUpload = (label, file, setFile, setPreview, fileType, accept = ".pdf,.jpg,.jpeg,.png,.webp", required = false) => {
        const hasFile = file !== null;
        return (
            <div className="space-y-1.5">
                <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline" size="sm" type="button"
                        onClick={() => document.getElementById(`file-${fileType}`)?.click()}
                        disabled={fileUploading || viewMode} className="flex-1"
                    >
                        <Upload className="h-4 w-4 mr-1" />
                        {hasFile ? "Change File" : "Select File"}
                    </Button>
                    <input
                        id={`file-${fileType}`} type="file" accept={accept} className="hidden"
                        onChange={(e) => handleFileSelect(e, setFile, setPreview, fileType)}
                        disabled={viewMode}
                    />
                    {hasFile && <Badge variant="success" className="text-xs">Selected ✓</Badge>}
                </div>
                {hasFile && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{file.name}</p>}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Administration" title="User & Role Management"
                description="Create accounts for any role; users can sign in with the credentials you set here."
                actions={canEdit && (
                    <Button data-testid="users-create-btn" onClick={startCreate}><Plus className="h-4 w-4 mr-1" /> New user</Button>
                )}
            />

            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        data-testid="users-search" 
                        className="pl-9" 
                        placeholder="Search by name, email, or ID…" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
                
                {/* 🆕 Dynamic Dropdown Based on roleStats */}
                <Select value={roleFilter} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-[250px]" data-testid="users-role-filter">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {Object.entries(roleStats)
                            .filter(([key]) => key !== "client") // Hiding client from UI
                            .map(([key, count]) => (
                                <SelectItem key={key} value={key}>
                                    {ROLES[key] || key} ({count})
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[150px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* 💯 Restored TableBody loop! */}
                            {displayUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayUsers.map((u) => (
                                    <TableRow key={u._id} data-testid={`user-row-${u._id}`}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    {u.profileImage && <AvatarImage src={u.profileImage} />}
                                                    <AvatarFallback className="bg-foreground text-background">{initials(u.name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="leading-tight">
                                                    <div className="font-medium">{u.name}</div>
                                                    <div className="text-xs text-muted-foreground">{u.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={u.role === "admin" ? "default" : "outline"}>
                                                {ROLES[u.role] || u.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm tabular-nums">{u.phone}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={u.isActive ? "success" : "muted"}>{u.isActive ? "Active" : "In Active"}</Badge>
                                                {canEdit && (
                                                    <Switch
                                                        checked={u.isActive} onCheckedChange={() => handleStatusToggle(u)}
                                                        disabled={togglingUser === u._id || u._id === current?.id}
                                                        className="data-[state=checked]:bg-green-500"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {canEdit && (
                                                <div className="flex justify-end gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => viewUser(u)} title="View Details">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => startEdit(u)} title="Edit User">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setConfirmId(u._id)} disabled={u._id === current?.id} title="Delete User">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{pagination.pages}</span> (Total: {pagination.total} users)
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.pages}>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            {/* ─── CREATE/EDIT/VIEW USER DIALOG WIZARD ─── */}
            <Dialog open={open} onOpenChange={(val) => { 
                setOpen(val); 
                if (!val) { setEditing(null); setViewMode(false); }
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{viewMode ? "User Details" : (editing ? "Edit User" : "Add New User")}</DialogTitle>
                        <div className="flex flex-wrap items-center space-x-2 pt-2 text-sm text-muted-foreground">
                            <span className={step === 1 ? "font-bold text-primary" : ""}>1. Credentials</span><span>&rarr;</span>
                            <span className={step === 2 ? "font-bold text-primary" : ""}>2. Personal</span><span>&rarr;</span>
                            <span className={step === 3 ? "font-bold text-primary" : ""}>3. Job & Salary</span>
                            {!editing && (
                                <><span>&rarr;</span><span className={step === 4 ? "font-bold text-primary" : ""}>4. Documents</span></>
                            )}
                        </div>
                    </DialogHeader>

                    {formError && (
                        <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-md mx-4 mt-2">
                            {formError}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 pt-2">
                        {/* ─── STEP 1: CREDENTIALS ─── */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 flex items-center gap-4 border-b pb-4">
                                        <Avatar className="h-14 w-14">
                                            {profileImagePreview && <AvatarImage src={profileImagePreview} />}
                                            <AvatarFallback className="bg-foreground text-background">{initials(form.name) || "U"}</AvatarFallback>
                                        </Avatar>
                                        {!viewMode && (
                                            <div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => document.getElementById('profileImageInput')?.click()} disabled={fileUploading || loadingBtn}>
                                                        <Upload className="h-4 w-4 mr-1" /> {profileImageFile ? "Change" : "Upload Profile Image"}
                                                    </Button>
                                                    <input id="profileImageInput" type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden" onChange={(e) => handleFileSelect(e, setProfileImageFile, setProfileImagePreview, "profile")} />
                                                    {(profileImagePreview || editing) && profileImageFile && (
                                                        <Button variant="ghost" size="icon" onClick={() => { setProfileImageFile(null); setProfileImagePreview(editing ? editing?.profileImage : null); }} className="text-destructive h-9 w-9">
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, JPG, or WEBP (max 10MB)</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Full Name <span className="text-red-500">*</span></Label>
                                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={viewMode} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Employee ID</Label>
                                        <Input placeholder="Leave blank for auto-generate" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} disabled={editing || viewMode} />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <Label>Email <span className="text-red-500">*</span></Label>
                                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={viewMode} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Phone</Label>
                                        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={viewMode} />
                                    </div>

                                    {!viewMode && (
                                        <div className="col-span-2 space-y-1.5">
                                            <Label>Password {!editing && <span className="text-red-500">*</span>}</Label>
                                            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editing ? "Leave blank to keep unchanged" : "Min 6 characters"} />
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <Label>Role</Label>
                                        <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })} disabled={viewMode}>
                                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(ROLES).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Department</Label>
                                        <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })} disabled={viewMode}>
                                            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept._id} value={dept._id}>
                                                        {dept.name} ({dept.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {(editing || viewMode) && (
                                        <div className="col-span-2 flex items-center justify-between rounded-lg border p-3 mt-2 shadow-sm bg-muted/20">
                                            <div className="space-y-0.5">
                                                <Label>Account Status</Label>
                                                <div className="text-[0.8rem] text-muted-foreground">{form.status === "active" ? "Active - User can access the system" : "Inactive - User access is revoked"}</div>
                                            </div>
                                            <Switch checked={form.status === "active"} onCheckedChange={(c) => !viewMode && setForm({ ...form, status: c ? "active" : "inactive" })} disabled={viewMode} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ─── STEP 2: PERSONAL & BANK ─── */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground">Personal Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Date of Birth *</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5">
                                            <Label>Gender *</Label>
                                            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })} disabled={viewMode}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Blood Group *</Label>
                                            <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })} disabled={viewMode}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (<SelectItem key={bg} value={bg}>{bg}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Marital Status</Label>
                                            <Select value={form.maritalStatus} onValueChange={(v) => setForm({ ...form, maritalStatus: v })} disabled={viewMode}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Single">Single</SelectItem>
                                                    <SelectItem value="Married">Married</SelectItem>
                                                    <SelectItem value="Divorced">Divorced</SelectItem>
                                                    <SelectItem value="Widowed">Widowed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5"><Label>Aadhar Number *</Label><Input placeholder="12 digit number" value={form.aadharNumber} onChange={(e) => setForm({ ...form, aadharNumber: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>PAN Number</Label><Input placeholder="ABCDE1234F" value={form.panNumber} onChange={(e) => setForm({ ...form, panNumber: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>Father's Name</Label><Input value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>Mother's Name</Label><Input value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} disabled={viewMode} /></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">Emergency Contact</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Contact Name</Label><Input value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>Contact Phone</Label><Input value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} disabled={viewMode} /></div>
                                        <div className="col-span-2 space-y-1.5"><Label>Relation</Label><Input placeholder="e.g., Spouse" value={form.emergencyContactRelation} onChange={(e) => setForm({ ...form, emergencyContactRelation: e.target.value })} disabled={viewMode} /></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">Permanent Address</h4>
                                    <div className="space-y-2">
                                        <Input placeholder="Line 1 *" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} disabled={viewMode} />
                                        <Input placeholder="Line 2 (optional)" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} disabled={viewMode} />
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} disabled={viewMode} />
                                            <Input placeholder="State *" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} disabled={viewMode} />
                                            <Input placeholder="Pincode *" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} disabled={viewMode} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4 mb-2">
                                        <Switch id="sameAsPermanent" checked={form.sameAsPermanent} onCheckedChange={(checked) => setForm({ ...form, sameAsPermanent: checked })} disabled={viewMode} />
                                        <Label htmlFor="sameAsPermanent">Current Address same as Permanent</Label>
                                    </div>

                                    {!form.sameAsPermanent && (
                                        <div className="space-y-2 pl-4 border-l-2 border-muted mt-2">
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Current Address</h4>
                                            <Input placeholder="Line 1" value={form.currentAddressLine1} onChange={(e) => setForm({ ...form, currentAddressLine1: e.target.value })} disabled={viewMode} />
                                            <div className="grid grid-cols-3 gap-2">
                                                <Input placeholder="City" value={form.currentCity} onChange={(e) => setForm({ ...form, currentCity: e.target.value })} disabled={viewMode} />
                                                <Input placeholder="State" value={form.currentState} onChange={(e) => setForm({ ...form, currentState: e.target.value })} disabled={viewMode} />
                                                <Input placeholder="Pincode" value={form.currentPincode} onChange={(e) => setForm({ ...form, currentPincode: e.target.value })} disabled={viewMode} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground mt-6">Bank Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Bank Name</Label><Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>Account Number</Label><Input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>IFSC Code</Label><Input value={form.ifscCode} onChange={(e) => setForm({ ...form, ifscCode: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>UPI ID</Label><Input value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5">
                                            <Label>Account Type</Label>
                                            <Select value={form.accountType} onValueChange={(v) => setForm({ ...form, accountType: v })} disabled={viewMode}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Savings">Savings</SelectItem>
                                                    <SelectItem value="Current">Current</SelectItem>
                                                    <SelectItem value="Salary">Salary</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5"><Label>Branch Name</Label><Input value={form.branchName} onChange={(e) => setForm({ ...form, branchName: e.target.value })} disabled={viewMode} /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── STEP 3: JOB & PAYROLL ─── */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground">Employment Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Designation *</Label><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>Joining Date *</Label><Input type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5">
                                            <Label>Employment Type</Label>
                                            <Select value={form.employmentType} onValueChange={(v) => setForm({ ...form, employmentType: v })} disabled={viewMode}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                                                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                                                    <SelectItem value="Contract">Contract</SelectItem>
                                                    <SelectItem value="Internship">Internship</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5"><Label>Total Experience (Years)</Label><Input type="number" min="0" step="0.1" value={form.totalExperienceYears} onChange={(e) => setForm({ ...form, totalExperienceYears: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>Probation Period (Months)</Label><Input type="number" min="0" value={form.probationPeriodMonths} onChange={(e) => setForm({ ...form, probationPeriodMonths: e.target.value })} disabled={viewMode} /></div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground">Salary Breakdown</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Basic Salary *</Label><Input type="number" placeholder="0" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>HRA</Label><Input type="number" placeholder="0" value={form.hra} onChange={(e) => setForm({ ...form, hra: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>Allowances</Label><Input type="number" placeholder="0" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: e.target.value })} disabled={viewMode} /></div>
                                        <div className="space-y-1.5"><Label>Total CTC (Annual) *</Label><Input type="number" placeholder="0" value={form.totalCTC} onChange={(e) => setForm({ ...form, totalCTC: e.target.value })} disabled={viewMode} /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── STEP 4: DOCUMENTS ─── */}
                        {!editing && !viewMode && step === 4 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground">Required Documents</h3>
                                {renderFileUpload("10th Marksheet", tenthMarksheetFile, setTenthMarksheetFile, null, "tenthMarksheet", ".pdf,.jpg,.jpeg,.png,.webp", true)}
                                
                                <h3 className="text-sm font-semibold mb-3 border-b pb-1 text-muted-foreground pt-4">Optional Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {renderFileUpload("12th Marksheet", twelfthMarksheetFile, setTwelfthMarksheetFile, null, "twelfthMarksheet")}
                                    {renderFileUpload("Graduation Certificate", graduationCertFile, setGraduationCertFile, null, "graduationCert")}
                                    {renderFileUpload("Post-Graduation Certificate", postGraduationCertFile, setPostGraduationCertFile, null, "postGraduationCert")}
                                    {renderFileUpload("Aadhar Card", aadharCardFile, setAadharCardFile, null, "aadharCard")}
                                    {renderFileUpload("PAN Card", panCardFile, setPanCardFile, null, "panCard")}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex items-center justify-between border-t pt-4 px-4 pb-4">
                        <div>
                            {step === 1 ? (
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            ) : (
                                <Button type="button" variant="outline" onClick={handleBack} disabled={loadingBtn || fileUploading}>Back</Button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {viewMode ? (
                                step < 3 ? <Button onClick={handleNext}>Next Step</Button> : <Button onClick={() => setOpen(false)}>Close</Button>
                            ) : (
                                <>
                                    {step < 3 && <Button onClick={handleNext}>Next Step</Button>}
                                    {step === 3 && !editing && <Button onClick={handleNext}>Next Step</Button>}
                                    {step === 3 && editing && (
                                        <Button onClick={handleNext} disabled={loadingBtn || fileUploading}>
                                            {loadingBtn ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                                        </Button>
                                    )}
                                    {step === 4 && !editing && (
                                        <Button onClick={save} disabled={loadingBtn || fileUploading || !tenthMarksheetFile}>
                                            {loadingBtn || fileUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading & Creating...</> : "Create User"}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── OTP DIALOG ─── */}
            <Dialog open={!!otpStep}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{otpStep === "email" ? "Verify Email OTP" : "Verify Phone OTP"}</DialogTitle>
                        <DialogDescription>Enter OTP sent to {otpData.identifier}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        {otpStep === "email" && displayEmailOtp && (
                            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                                <p className="text-xs uppercase font-semibold text-amber-700 mb-1">Development OTP</p>
                                <p className="text-3xl font-bold tracking-widest text-amber-700">{displayEmailOtp}</p>
                            </div>
                        )}
                        {otpStep === "phone" && displayPhoneOtp && (
                            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                                <p className="text-xs uppercase font-semibold text-amber-700 mb-1">Development OTP</p>
                                <p className="text-3xl font-bold tracking-widest text-amber-700">{displayPhoneOtp}</p>
                            </div>
                        )}
                        {otpError && (
                            <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-md">{otpError}</div>
                        )}
                        <Input placeholder="Enter 6-digit OTP" value={otpData.otp} onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })} />
                    </div>
                    <DialogFooter>
                        <Button onClick={verifyOtp} disabled={loadingBtn}>{loadingBtn ? "Verifying..." : "Verify OTP"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── CONFIRM DELETE ─── */}
            <ConfirmDialog
                open={!!confirmId}
                onOpenChange={(v) => !v && setConfirmId(null)}
                title="Delete user?"
                description="This will revoke access immediately. This action cannot be undone."
                onConfirm={handleDelete}
            />
        </div>
    );
}