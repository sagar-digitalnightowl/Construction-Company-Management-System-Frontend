import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Added ChevronDown to the imports
import { Bell, LogOut, Moon, Search, Sun, UserCog, Menu, ChevronDown } from "lucide-react";
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
import { cn } from "@/lib/helpers";

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
		<header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/80 bg-background/80 px-2 backdrop-blur-md md:px-5">
			<Button
				variant="ghost"
				size="icon"
				className="rounded-md border border-border/60 md:hidden hover:bg-accent/10"
				onClick={onMenuClick}
			>
				<Menu className="h-5 w-5" />
			</Button>

			<div className="relative max-w-xl flex-1">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					data-testid="topbar-search"
					placeholder="Search projects, vendors, POs, documents…"
					className="rounded-md border-border/50 bg-muted/30 pl-9 transition-colors focus-visible:bg-card focus-visible:border-primary"
				/>
			</div>

			<div className="flex items-center gap-2">
				<Button data-testid="theme-toggle" variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-md hover:bg-accent/10">
					{dark ? <Sun className="h-4 w-4 text-muted-foreground hover:text-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
				</Button>

				<Button variant="ghost" size="icon" className="relative rounded-md hover:bg-accent/10" data-testid="notif-btn" aria-label="Notifications">
					<Bell className="h-4 w-4 text-muted-foreground hover:text-foreground" />
					<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warning ring-2 ring-background" />
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button data-testid="user-menu-btn" className="cursor-pointer group flex items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 transition-colors hover:border-border/50 hover:bg-accent/10">
							<Avatar className="h-8 w-8 rounded-sm">
								<AvatarImage src={current?.profileImage} />
								<AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-sm">
									{initials(current?.name || "U")}
								</AvatarFallback>
							</Avatar>
							<div className="hidden flex-col text-left leading-tight sm:flex">
								<span className="text-sm font-semibold">{current?.name}</span>
								<span className="font-display text-[10px] tracking-wider uppercase text-muted-foreground">
									{ROLES[current?.role]}
								</span>
							</div>
							{/* 2. Added Chevron icon to indicate dropdown action */}
							<ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
						</button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end" className="w-60">
						<DropdownMenuLabel>Signed in as</DropdownMenuLabel>
						<div className="px-2.5 pb-2">
							<div className="text-sm font-medium">{current?.name}</div>
							<div className="text-xs text-muted-foreground">{current?.email}</div>
							<Badge variant="outline" className="mt-2 font-display text-[10px] tracking-wider uppercase rounded-sm border-border/80 text-muted-foreground bg-muted/30">
								{ROLES[current?.role]}
							</Badge>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => navigate("/settings")} data-testid="menu-settings">
							<UserCog className="h-4 w-4" /> Account & Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							data-testid="menu-logout"
							className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
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