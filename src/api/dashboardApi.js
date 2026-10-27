import api from "./axios";

// Admin dashboard API (v2.5)
export const dashboardApi = {
	// Full dashboard: KPI cards, cashflow, material consumption, active projects, latest DPRs
	getDashboard: () => api.get("/dashboard"),
	// KPI cards only (quick refresh)
	getDashboardKpis: () => api.get("/dashboard/kpis"),
	// Active projects list only
	getDashboardActiveProjects: () => api.get("/dashboard/active-projects"),
	// Latest daily progress reports only
	getDashboardLatestDprs: (limit = 5) => api.get("/dashboard/latest-dprs", { params: { limit } }),
};
