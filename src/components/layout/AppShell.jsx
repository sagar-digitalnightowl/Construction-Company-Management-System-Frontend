import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuthStore } from "@/store/authStore";
import { canView } from "@/data/permissions";

export function AppShell() {
    const { current } = useAuthStore();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!current) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // route-level guard
    const seg = location.pathname.split("/")[1] || "dashboard";
    if (!canView(current.role, seg)) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="h-screen flex overflow-hidden">

            <div className={` fixed top-0 left-0 h-screen w-64 z-50 
                    transform transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:relative md:translate-x-0 md:h-screen`}
            >
                <div className="h-full overflow-auto w-full">
                    <Sidebar role={current.role} onClickLink={() => setSidebarOpen(false)}/>
                </div>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 h-screen bg-black/40 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto" data-testid="main-content">
                    <div className="px-2 sm:px-6 lg:px-10 py-8 max-w-[1500px] mx-auto w-full animate-rise">
                        < Outlet />
                    </div>
                </main >
            </div>
        </div >
    );
}