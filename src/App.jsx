import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Projects from "@/pages/projects/Projects";
import Sites from "@/pages/Sites";
import Procurement from "@/pages/Procurement";
import Vendors from "@/pages/Vendors";
import Inventory from "@/pages/Inventory";
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

export default function App() {

  const { initAuth, loading } = useAuthStore(s => s);

  useEffect(() => {
    initAuth()
  }, [initAuth]);

  if (loading) return null;

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        expand={true}
        portalProps={{
          container: document.body,
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/vendors" element={<Vendors />} />
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