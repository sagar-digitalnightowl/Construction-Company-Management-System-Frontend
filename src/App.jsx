import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Projects from "@/pages/Projects";
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

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/projects" element={<Projects />} />
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

      <Toaster position="top-right" richColors />
    </>
  );
}