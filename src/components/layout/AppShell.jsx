import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuthStore } from "@/store/authStore";
import { canView } from "@/data/permissions";

export function AppShell() {
    const { current } = useAuthStore();
    const location = useLocation();

    if (!current) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // route-level guard
    const seg = location.pathname.split("/")[1] || "dashboard";
    if (!canView(current.role, seg)) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen flex">
            <Sidebar role={current.role} />
            <div className="flex-1 flex flex-col min-w-0">
                < Topbar />
                <main className="flex-1 overflow-y-auto" data-testid="main-content">
                    <div className="px-6 lg:px-10 py-8 max-w-[1500px] mx-auto w-full animate-rise">
                        < Outlet />
                    </div>
                </main >
            </div >
        </div >
    );
}