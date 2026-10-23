// src/pages/stockManager/AddConsumptionPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { ConsumptionTab } from "./tabs/ConsumptionTab";
import { rolePerms } from "./stockPermissions";

export default function AddConsumptionPage() {
	const navigate = useNavigate();
	const { current } = useAuthStore();
	const perms = rolePerms(current?.role);

	return (
		<div className="space-y-5 sm:space-y-6">
			<PageHeader
				title="Add Consumption"
				description="Material used on site. Each record reduces the remaining stock for its item."
				actions={
					perms.canAddConsumption && (
						<Button onClick={() => navigate("/site-manager/add-consumption/new")}>
							<Plus className="h-4 w-4 mr-2" />
							Add Consumption
						</Button>
					)
				}
			/>

			<ConsumptionTab />
		</div>
	);
}
