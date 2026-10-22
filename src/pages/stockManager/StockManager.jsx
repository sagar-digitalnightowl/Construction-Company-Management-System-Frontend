// src/pages/stockManager/StockManager.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Package,
	Plus,
	BarChart3,
	FileText,
	ClipboardList,
} from "lucide-react";

import { PageHeader, StatCard } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useSiteStock } from "@/hooks/useSiteStock";
import { useAuthStore } from "@/store/authStore";

// Tab components
import { MyReportsTab } from "./tabs/MyReportsTab";
import { AllReportsTab } from "./tabs/AllReportsTab";
import { StatsTab } from "./tabs/StatsTab";

const TAB_HEADERS = {
	"my-reports": { title: "My Reports", desc: "View and manage your stock reports." },
	"all-reports": { title: "All Reports", desc: "View all stock reports across projects." },
	stats: { title: "Statistics", desc: "Dashboard with aggregated stock data and analytics." },
};

export default function StockManager() {
	const { current } = useAuthStore();
	const location = useLocation();
	const navigate = useNavigate();

	const role = current?.role?.toLowerCase();
	const isStockManager = role === "stock_manager";
	const canVerify = ["admin", "hr_manager", "finance_executive", "project_manager"].includes(role);
	const canViewAllReports = ["admin", "director", "hr_manager", "finance_executive", "project_manager"].includes(role);

	const currentTab = location.pathname.split("/")[2] || "my-reports";

	const handleTabChange = (value) => {
		navigate(`/stock-manager/${value}`);
	};

	const {
		reports,
		pagination,
		stats,
		loading,
		fetchReports,
		fetchMyReports,
		fetchStats,
		verifyReport,
		deleteReport,
	} = useSiteStock();

	// Initial load
	useEffect(() => {
		if (currentTab === "stats" && canViewAllReports) {
			fetchStats();
		}
	}, [currentTab, canViewAllReports]);

	// Lazy load based on active tab
	useEffect(() => {
		switch (currentTab) {
			case "my-reports":
				if (isStockManager || canViewAllReports) {
					fetchMyReports({ page: 1, limit: 20 });
				}
				break;
			case "all-reports":
				if (canViewAllReports) {
					fetchReports({ page: 1, limit: 20 });
				}
				break;
			case "stats":
				if (canViewAllReports) {
					fetchStats();
				}
				break;
			default:
				break;
		}
	}, [currentTab]);

	const headerInfo = canViewAllReports
		? { title: "Stock Management", desc: "Manage site material stock reports and track inventory across projects." }
		: (TAB_HEADERS[currentTab] || { title: "Stock Manager", desc: "Material Stock Reporting" });

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title={headerInfo.title}
				description={headerInfo.desc}
				actions={
					(isStockManager || canViewAllReports) && (
						<Button onClick={() => navigate("/stock-manager/add-report")}>
							<Plus className="h-4 w-4 mr-2" />
							Add Report
						</Button>
					)
				}
			/>

			{/* Stats Row - Show for all users */}
			{stats && canViewAllReports && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<StatCard
						label="Total Reports"
						value={stats.totals?.totalReports || 0}
						icon={FileText}
						size="compact"
					/>
					<StatCard
						label="Total Amount"
						value={`₹${(stats.totals?.totalAmount || 0).toLocaleString()}`}
						icon={BarChart3}
						accent="success"
						size="compact"
					/>
					<StatCard
						label="Pending"
						value={stats.byVerificationStatus?.find(s => s._id === "pending")?.count || 0}
						icon={ClipboardList}
						accent="warning"
						size="compact"
					/>
					<StatCard
						label="Verified"
						value={stats.byVerificationStatus?.find(s => s._id === "verified")?.count || 0}
						icon={Package}
						accent="primary"
						size="compact"
					/>
				</div>
			)}

			<Tabs value={currentTab} onValueChange={handleTabChange}>
				<div className="w-full overflow-auto scrollbar-none">
					<TabsList>
						{(isStockManager || canViewAllReports) && (
							<TabsTrigger value="my-reports">
								<FileText className="h-3.5 w-3.5 mr-1.5" />
								My Reports
							</TabsTrigger>
						)}
						{canViewAllReports && (
							<TabsTrigger value="all-reports">
								<ClipboardList className="h-3.5 w-3.5 mr-1.5" />
								All Reports
							</TabsTrigger>
						)}
						{canViewAllReports && (
							<TabsTrigger value="stats">
								<BarChart3 className="h-3.5 w-3.5 mr-1.5" />
								Statistics
							</TabsTrigger>
						)}
					</TabsList>
				</div>

				<div className="mt-5">
					<TabsContent value="my-reports">
						<MyReportsTab
							reports={reports}
							pagination={pagination}
							loading={loading}
							onRefresh={(params = {}) => fetchMyReports({ page: 1, limit: 20, ...params })}
							onDelete={deleteReport}
						/>
					</TabsContent>

					{canViewAllReports && (
						<TabsContent value="all-reports">
							<AllReportsTab
								reports={reports}
								pagination={pagination}
								loading={loading}
								onRefresh={() => fetchReports({ page: 1, limit: 20 })}
								onVerify={verifyReport}
								canVerify={canVerify}
							/>
						</TabsContent>
					)}

					{canViewAllReports && (
						<TabsContent value="stats">
							<StatsTab
								stats={stats}
								loading={loading}
								onRefresh={fetchStats}
							/>
						</TabsContent>
					)}
				</div>
			</Tabs>
		</div>
	);
}
