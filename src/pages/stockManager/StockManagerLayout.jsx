// src/pages/stockManager/StockManagerLayout.jsx

import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";

const pageTitles = {
	"/stock-manager/my-reports": "My Reports",
	"/stock-manager/all-reports": "All Reports",
	"/stock-manager/stats": "Statistics",
	"/stock-manager/add-report": "Add Report",
};

export default function StockManagerLayout({ children }) {
	const { pathname } = useLocation();

	const title = pageTitles[pathname] || "Stock Manager";

	return (
		<div className="space-y-6">
			<PageHeader title={title} />
			{children}
		</div>
	);
}
