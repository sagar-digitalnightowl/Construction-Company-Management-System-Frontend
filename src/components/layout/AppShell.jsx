import React, { useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { BarLoader, BeatLoader, ScaleLoader } from "react-spinners";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuthStore } from "@/store/authStore";
import { canView } from "@/data/permissions";

export function AppShell() {
	const { current } = useAuthStore();
	const location = useLocation();

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [routeLoading, setRouteLoading] = useState(false);
	const timeoutRef = useRef(null);

	// route-level guard
	const seg = location.pathname.split("/")[1] || "dashboard";

	useEffect(() => {
		setRouteLoading(true);
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setRouteLoading(false), 250);
		return () => clearTimeout(timeoutRef.current);
	}, [seg]); // only top-level segment change triggers loader, not nested params/tabs

	if (!current) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	console.log("Seg : ", seg)
	if (!canView(current.role, seg)) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="h-lvh flex overflow-hidden">

			<div className={` fixed top-0 left-0 h-lvh w-60 z-50 
                    transform transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:relative md:translate-x-0 md:h-lvh`}
			>
				<div className="h-full overflow-auto w-full">
					<Sidebar role={current.role} onClickLink={() => setSidebarOpen(false)} />
				</div>
			</div>

			{sidebarOpen && (
				<div
					className="fixed inset-0 h-lvh bg-black/40 z-40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<div className="flex-1 flex flex-col min-w-0">
				<Topbar onMenuClick={() => setSidebarOpen(true)} />
				<main className="flex-1 overflow-y-auto" data-testid="main-content">
					{routeLoading ? (
						<div className="w-full h-full mt-20 flex items-start justify-center">
							<BeatLoader
								color="#0f766e"
								size={12}
								margin={5}
								speedMultiplier={1.2}
							/>
						</div>
					) : (
						<div className="px-2 sm:px-6 lg:px-10 py-8 max-w-[1500px] mx-auto w-full animate-rise">
							<Outlet />
						</div>
					)}
				</main>
			</div>
		</div>
	);
}