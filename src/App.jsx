import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Projects from "@/pages/projects/Projects";
import Finance from "@/pages/Finance";
import CRM from "@/pages/CRM";
import Documents from "@/pages/Documents";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import { useAuthStore } from "./store/authStore";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProjectDetail from "./pages/projects/ProjectDetailsPage";
import ProjectTemplate from "./pages/projectTemplete/projectTemplete";
import Inventory from "./pages/inventory/Inventory";
import Materials from "./pages/inventory/Materials";
import Warehouses from "./pages/inventory/Warehouses";
import StockTransactions from "./pages/inventory/StockTransactions";
import LowStockAlerts from "./pages/inventory/LowStockAlerts";
import Valuation from "./pages/inventory/Valuation";
import StockCounts from "./pages/inventory/StockCounts";

import { createPortal } from "react-dom";

import Procurement from "./pages/procurement/Procurement";
import RFQs from "./pages/procurement/RFQs";
import Quotations from "./pages/procurement/Quotations";
import PurchaseOrders from "./pages/procurement/PurchaseOrders";
import Deliveries from "./pages/procurement/Deliveries";
import TaskRequests from "./pages/projects/TaskRequests";
import MyTasks from "./pages/projects/MyTasks";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import SiteManagement from "./pages/site/SiteManagement";
import MaterialDetail from "./pages/inventory/MaterialDetail";
import Bookings from "./pages/booking/Bookings";
import BookingDetail from "./pages/booking/BookingDetail";
import MyBookings from "./pages/booking/MyBookings";
import MyInstallments from "./pages/booking/MyInstallments";
import PendingBookings from "./pages/booking/PendingBookings";
import CountDetail from "./pages/inventory/CountDetail";
import TaskDetailPage from "./pages/projects/TaskDetailPage";
import HR from "./pages/hr/HR";
import EmployeeDetail from "./pages/hr/EmployeeDetail";
import LaborDetail from "./pages/hr/LaborDetail";
import EmployeeDashboard from "./pages/hr/EmployeeDashboard";
import LeadManagement from "./pages/lead/LeadManagement";

export default function App() {
	const { initAuth, loading } = useAuthStore((s) => s);

	useEffect(() => {
		initAuth();
	}, [initAuth]);

	if (loading) return null;

	return (
		<>
			{createPortal(
				<Toaster
					position="top-right"
					richColors
					expand={true}
					portalProps={{
						container: document.body,
					}}
				/>,
				document.body,
			)}

			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password/:token" element={<ResetPassword />} />

				<Route element={<AppShell />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/users" element={<Users />} />

					<Route path="/projects" element={<Projects />} />
					<Route path="/project-templates" element={<ProjectTemplate />} />
					<Route path="/projects/:id" element={<ProjectDetail />} />

					<Route path="/tasks/my-tasks" element={<MyTasks />} />
					<Route path="/tasks/requests" element={<TaskRequests />} />
					<Route path="/tasks/:taskId" element={<TaskDetailPage />} />

					<Route path="/procurement/dashboard" element={<Procurement />} />
					<Route path="/procurement/rfqs" element={<RFQs />} />
					<Route path="/procurement/quotations" element={<Quotations />} />
					<Route
						path="/procurement/purchase-orders"
						element={<PurchaseOrders />}
					/>
					<Route path="/procurement/deliveries" element={<Deliveries />} />

					<Route path="/inventory/stock-management" element={<Inventory />} />
					<Route path="/inventory/counts/:id" element={<CountDetail />} />
					<Route path="/inventory/materials" element={<Materials />} />
					<Route path="/inventory/material/:id" element={<MaterialDetail />} />
					<Route path="/inventory/warehouses" element={<Warehouses />} />
					<Route
						path="/inventory/transactions"
						element={<StockTransactions />}
					/>
					<Route path="/inventory/alerts" element={<LowStockAlerts />} />
					<Route path="/inventory/valuation" element={<Valuation />} />
					<Route path="/inventory/counts" element={<StockCounts />} />

					<Route path="/site-management" element={<SiteManagement />} />

					<Route path="/vendor/dashboard" element={<VendorDashboard />} />

					<Route path="/bookings" element={<Bookings />} />
					<Route path="/bookings/:id" element={<BookingDetail />} />
					<Route path="/my-bookings" element={<MyBookings />} />
					<Route path="/my-bookings/:id" element={<BookingDetail />} />
					<Route path="/my-installments" element={<MyInstallments />} />
					<Route path="/pending-bookings" element={<PendingBookings />} />

					<Route path="/hr" element={<HR />} />
					<Route path="/hr/employees/:id" element={<EmployeeDetail />} />
					<Route path="/hr/labors/:id" element={<LaborDetail />} />
					<Route path="/leaves" element={<EmployeeDashboard />} />

					<Route path="/crm" element={<LeadManagement />} />

					<Route path="/inventory" element={<Inventory />} />
					<Route path="/finance" element={<Finance />} />
					<Route path="/crm" element={<CRM />} />
					<Route path="/documents" element={<Documents />} />
					<Route path="/reports" element={<Reports />} />
					<Route path="/settings" element={<Settings />} />
				</Route>

				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Routes>
		</>
	);
}
