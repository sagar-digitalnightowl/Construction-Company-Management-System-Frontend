import { Outlet, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";

const pageTitles = {
	"/finance/dashboard": "Finance Overview",
	"/finance/bookings": "Bookings",
	"/finance/bookings-reminder": "Bookings Reminder",
	"/finance/expense-reports": "Expense Reports",
	"/finance/due-installments": "WhatsApp Reminders",
	"/finance/milestones": "Milestones",
	"/finance/payroll": "Payroll Approvals",
	"/finance/expenses": "Expense Approvals",
	"/finance/reminders": "Reminder Logs",
};

export default function FinanceLayout() {
	const { pathname } = useLocation();

	let title = pageTitles[pathname] || "Finance";

	if (pathname.startsWith("/finance/bookings/")) {
		title = "Booking Details";
	}

	return (
		<div className="space-y-6">
			<PageHeader title={title} />
			<Outlet />
		</div>
	);
}