// src/pages/stockManager/AddStockPage.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useSiteStock } from "@/hooks/useSiteStock";
import { useAuthStore } from "@/store/authStore";
import { MyReportsTab } from "./tabs/MyReportsTab";
import { rolePerms } from "./stockPermissions";

export default function AddStockPage() {
	const navigate = useNavigate();
	const { current } = useAuthStore();
	const perms = rolePerms(current?.role);
	const { reports, pagination, loading, fetchMyReports, deleteReport } = useSiteStock();

	useEffect(() => {
		fetchMyReports({ page: 1, limit: 20 });
	}, []);

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Add Stock"
				description="Record material that arrived at your site and review the entries you have added."
				actions={
					perms.canAddStock && (
						<Button onClick={() => navigate("/site-manager/add-stock")}>
							<Plus className="h-4 w-4 mr-2" />
							Add Stock
						</Button>
					)
				}
			/>

			<MyReportsTab
				reports={reports}
				pagination={pagination}
				loading={loading}
				onRefresh={(params = {}) => fetchMyReports({ page: 1, limit: 20, ...params })}
				onDelete={deleteReport}
			/>
		</div>
	);
}
