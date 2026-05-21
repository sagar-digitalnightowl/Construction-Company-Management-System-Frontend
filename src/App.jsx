import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Projects from "@/pages/projects/Projects";
import Finance from "@/pages/Finance";
import HR from "@/pages/HR";
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

          <Route path="/procurement/dashboard" element={<Procurement />} />
          <Route path="/procurement/rfqs" element={<RFQs />} />
          <Route path="/procurement/quotations" element={<Quotations />} />
          <Route
            path="/procurement/purchase-orders"
            element={<PurchaseOrders />}
          />
          <Route path="/procurement/deliveries" element={<Deliveries />} />

          <Route path="/inventory/stock-management" element={<Inventory />} />
          <Route path="/inventory/materials" element={<Materials />} />
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

          <Route path="/inventory" element={<Inventory />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/hr" element={<HR />} />
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
