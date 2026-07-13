// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Bell, LogOut, Moon, Search, Sun, UserCog, Menu } from "lucide-react";
// import {
//     DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
//     DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useAuthStore, useThemeStore } from "@/store/authStore";
// import { ROLES } from "@/data/permissions";
// import { initials } from "@/lib/helpers";
// import { authApi } from "@/api";
// import { toast } from "sonner";

// export function Topbar({ onMenuClick }) {
//     const navigate = useNavigate();
//     const { current, logout } = useAuthStore();
//     const { dark, toggle } = useThemeStore();
//     const [loading, setLoading] = useState(false);

//     const handleLogout = async () => {
//         try {
//             setLoading(true);
//             const res = await authApi.logout()
//             if (res.data.success) {
//                 localStorage.clear();
//                 logout();
//                 toast.success(res.data.message || "Logout successful");
//                 navigate("/login");
//             }
//         } catch (error) {
//             toast.error(error?.response?.data?.message || "Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <header className="h-16 border-b border-border bg-card/70 backdrop-blur-md flex items-center justify-between px-2 md:px-5 gap-3 sticky top-0 z-30">
//             <Button
//                 variant="ghost"
//                 size="icon"
//                 className="md:hidden border border-gray-50 rounded-lg"
//                 onClick={onMenuClick}
//             >
//                 <Menu className="h-5 w-5" />
//             </Button>

//             <div className="flex-1 max-w-xl relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                     data-testid="topbar-search"
//                     placeholder="Search projects, vendors, POs, documents…"
//                     className="pl-9 bg-muted/40 border-transparent focus-visible:bg-card focus-visible:border-input"
//                 />
//             </div>

//             <div className="flex items-center gap-2">
//                 <Button data-testid="theme-toggle" variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
//                     {
//                         dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
//                     }
//                 </Button>

//                 <Button variant="ghost" size="icon" className="relative" data-testid="notif-btn" aria-label="Notifications">
//                     <Bell className="h-4 w-4" />
//                     <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
//                 </Button >

//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <button data-testid="user-menu-btn" className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-muted transition-colors">
//                             <Avatar className="h-8 w-8">
//                                 <AvatarImage src={current?.profileImage} />
//                                 <AvatarFallback className="bg-foreground text-background">
//                                     {initials(current?.name || "U")}
//                                 </AvatarFallback>
//                             </Avatar>
//                             <div className="hidden sm:flex flex-col text-left leading-tight">
//                                 < span className="text-sm font-medium">{current?.name}</span>
//                                 < span className="text-[11px] text-muted-foreground">{ROLES[current?.role]}</span>
//                             </div >
//                         </button >
//                     </DropdownMenuTrigger >
//                     <DropdownMenuContent align="end" className="w-60">
//                         < DropdownMenuLabel > Signed in as</DropdownMenuLabel >
//                         <div className="px-2 pb-2">
//                             < div className="text-sm font-medium">{current?.name}</div>
//                             < div className="text-xs text-muted-foreground">{current?.email}</div>
//                             < Badge variant="muted" className="mt-1.5">{ROLES[current?.role]}</Badge>
//                         </div >
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem onClick={() => navigate("/settings")} data-testid="menu-settings">
//                             <UserCog className="h-4 w-4" /> Account & Settings
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                             data-testid="menu-logout"
//                             className="text-destructive focus:text-destructive"
//                             onClick={handleLogout}
//                         >
//                             <LogOut className="h-4 w-4" /> {loading? "Signing out..." : "Sign out"}
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>
//         </header>
//     );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Moon, Search, Sun, UserCog, Menu } from "lucide-react";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, useThemeStore } from "@/store/authStore";
import { ROLES } from "@/data/permissions";
import { initials } from "@/lib/helpers";
import { authApi } from "@/api";
import { toast } from "sonner";

export function Topbar({ onMenuClick }) {
    const navigate = useNavigate();
    const { current, logout } = useAuthStore();
    const { dark, toggle } = useThemeStore();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            const refreshToken = localStorage.getItem("refreshToken");
            const res = await authApi.logout(refreshToken);
            if (res.data.success) {
                localStorage.clear();
                logout();
                toast.success(res.data.message || "Logout successful");
                navigate("/login");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <header className="h-16 border-b border-border bg-card/70 backdrop-blur-md flex items-center justify-between px-2 md:px-5 gap-3 sticky top-0 z-30">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden border border-gray-50 rounded-lg"
                onClick={onMenuClick}
            >
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 max-w-xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    data-testid="topbar-search"
                    placeholder="Search projects, vendors, POs, documents…"
                    className="pl-9 bg-muted/40 border-transparent focus-visible:bg-card focus-visible:border-input"
                />
            </div>

            <div className="flex items-center gap-2">
                <Button data-testid="theme-toggle" variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                    {
                        dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
                    }
                </Button>

                <Button variant="ghost" size="icon" className="relative" data-testid="notif-btn" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                </Button >

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button data-testid="user-menu-btn" className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-muted transition-colors">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={current?.profileImage} />
                                <AvatarFallback className="bg-foreground text-background">
                                    {initials(current?.name || "U")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex flex-col text-left leading-tight">
                                <span className="text-sm font-medium">{current?.name}</span>
                                <span className="text-[11px] text-muted-foreground">{ROLES[current?.role]}</span>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                        <div className="px-2 pb-2">
                            <div className="text-sm font-medium">{current?.name}</div>
                            <div className="text-xs text-muted-foreground">{current?.email}</div>
                            <Badge variant="muted" className="mt-1.5">{ROLES[current?.role]}</Badge>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/settings")} data-testid="menu-settings">
                            <UserCog className="h-4 w-4" /> Account & Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            data-testid="menu-logout"
                            className="text-destructive focus:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" /> {loading ? "Signing out..." : "Sign out"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}