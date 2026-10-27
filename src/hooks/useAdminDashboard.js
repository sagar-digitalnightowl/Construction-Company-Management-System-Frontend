import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { dashboardApi } from "@/api/dashboardApi";
import { ADMIN_DASHBOARD_ROLES } from "@/data/permissions";
import { useAuthStore } from "@/store/authStore";

// Loads the v2.5 admin dashboard. Only admin panel users get this data.
export function useAdminDashboard() {
	const { current } = useAuthStore();
	const allowed = ADMIN_DASHBOARD_ROLES.includes(current?.role);

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState(null);

	// Full load: all sections in one call
	const fetchDashboard = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await dashboardApi.getDashboard();
			setData(res.data?.data || null);
		} catch (err) {
			const message = err.response?.data?.message || "Failed to load dashboard";
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	}, []);

	// Refresh: reload the KPI cards, active projects and latest DPRs through their own endpoints.
	// Cashflow and material consumption have no section endpoint, so they keep their last values.
	const refreshSections = useCallback(async () => {
		setRefreshing(true);
		try {
			const [kpis, projects, dprs] = await Promise.all([
				dashboardApi.getDashboardKpis(),
				dashboardApi.getDashboardActiveProjects(),
				dashboardApi.getDashboardLatestDprs(5),
			]);
			// Section endpoints may return the section wrapped in { data } or unwrapped
			const section = (res, key) => {
				const body = res.data?.data ?? res.data;
				return body?.[key] ?? body ?? null;
			};
			setData((prev) => ({
				...(prev || {}),
				kpiCards: section(kpis, "kpiCards"),
				activeProjects: section(projects, "activeProjects"),
				latestDprs: section(dprs, "latestDprs"),
			}));
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to refresh dashboard");
		} finally {
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		if (allowed) fetchDashboard();
	}, [allowed, fetchDashboard]);

	return { allowed, data, loading, refreshing, error, refreshSections };
}
