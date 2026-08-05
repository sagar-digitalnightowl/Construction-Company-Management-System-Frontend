import { Outlet, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";

const pageTitles = {
	"/finance/dashboard": "Finance Overview",
	"/finance/bookings": "Bookings",
	"/finance/due-installments": "WhatsApp Reminders",
	"/finance/milestones": "Milestones",
	"/finance/payroll": "Payroll Approvals",
	"/finance/expenses": "Expense Approvals",
	"/finance/reminders": "Reminder Logs",
};

export default function FinanceLayout() {
	const { pathname } = useLocation();

	const title = pageTitles[pathname] || "Finance";

	return (
		<div className="space-y-6">
			<PageHeader title={title} />
			<Outlet />
		</div>
	);
}
