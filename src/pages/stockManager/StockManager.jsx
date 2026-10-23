// src/pages/stockManager/StockManager.jsx

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, ClipboardList, Minus, Bell, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useSiteStock } from "@/hooks/useSiteStock";
import { useAuthStore } from "@/store/authStore";
import SiteManagerDashboard from "./SiteManagerDashboard";
import { AllReportsTab } from "./tabs/AllReportsTab";
import { ConsumptionTab } from "./tabs/ConsumptionTab";
import { ReorderLevelsTab } from "./tabs/ReorderLevelsTab";
import { StatsTab } from "./tabs/StatsTab";
import { rolePerms } from "./stockPermissions";

const TABS = ["dashboard", "reports", "consumption", "reorder-levels", "stats"];

const TAB_HEADERS = {
	dashboard: { title: "Site Manager", desc: "Stock arrived, used and remaining across projects." },
	reports: { title: "Stock Reports", desc: "Stock entries from site managers. Verify or reject pending entries." },
	consumption: { title: "Consumption", desc: "Material used on site. Verify or reject pending records." },
	"reorder-levels": { title: "Reorder Levels", desc: "Low-stock thresholds and target levels per item per project." },
	stats: { title: "Statistics", desc: "Aggregated stock data and analytics." },
};

export default function StockManager() {
	const { current } = useAuthStore();
	const location = useLocation();
	const navigate = useNavigate();
	const perms = rolePerms(current?.role);

	const segments = location.pathname.split("/");
	const requested = segments[3] || "dashboard";
	const currentTab = TABS.includes(requested) ? requested : "dashboard";

	const { reports, pagination, stats, loading, fetchReports, fetchStats, verifyReport } = useSiteStock();

	useEffect(() => {
		if (currentTab === "reports") fetchReports({ page: 1, limit: 20 });
		if (currentTab === "stats") fetchStats();
	}, [currentTab]);

	const header = TAB_HEADERS[currentTab];

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title={header.title}
				description={header.desc}
				actions={
					<div className="flex flex-wrap gap-2">
						{perms.canAddConsumption && (
							<button
								type="button"
								onClick={() => navigate("/site-manager/add-consumption/new")}
								className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
							>
								Add Consumption
							</button>
						)}
						{perms.canAddStock && (
							<button
								type="button"
								onClick={() => navigate("/site-manager/add-stock")}
								className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
							>
								Add Stock
							</button>
						)}
						<button
							type="button"
							onClick={() => navigate("/site-manager/consumption-report")}
							className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
						>
							Consumption Report
						</button>
					</div>
				}
			/>

			<Tabs value={currentTab} onValueChange={(value) => navigate(`/site-manager/manage/${value}`)}>
				<div className="w-full overflow-auto scrollbar-none">
					<TabsList>
						<TabsTrigger value="dashboard">
							<LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
							Dashboard
						</TabsTrigger>
						<TabsTrigger value="reports">
							<ClipboardList className="h-3.5 w-3.5 mr-1.5" />
							Reports
						</TabsTrigger>
						<TabsTrigger value="consumption">
							<Minus className="h-3.5 w-3.5 mr-1.5" />
							Consumption
						</TabsTrigger>
						<TabsTrigger value="reorder-levels">
							<Bell className="h-3.5 w-3.5 mr-1.5" />
							Reorder Levels
						</TabsTrigger>
						<TabsTrigger value="stats">
							<BarChart3 className="h-3.5 w-3.5 mr-1.5" />
							Statistics
						</TabsTrigger>
					</TabsList>
				</div>

				<div className="mt-5">
					<TabsContent value="dashboard">
						<SiteManagerDashboard />
					</TabsContent>

					<TabsContent value="reports">
						<AllReportsTab
							reports={reports}
							pagination={pagination}
							loading={loading}
							onRefresh={(params = {}) => fetchReports({ page: 1, limit: 20, ...params })}
							onVerify={verifyReport}
							canVerify={perms.canVerify}
						/>
					</TabsContent>

					<TabsContent value="consumption">
						<ConsumptionTab />
					</TabsContent>

					<TabsContent value="reorder-levels">
						<ReorderLevelsTab />
					</TabsContent>

					<TabsContent value="stats">
						<StatsTab stats={stats} loading={loading} onRefresh={fetchStats} />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
