
import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import Login from "@/pages/Login";
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Users = lazy(() => import("@/pages/Users"));
const Projects = lazy(() => import("@/pages/projects/Projects"));
const CRM = lazy(() => import("@/pages/CRM"));
const Documents = lazy(() => import("@/pages/Documents"));
const Reports = lazy(() => import("@/pages/Reports"));
const Settings = lazy(() => import("@/pages/Settings"));
import { useAuthStore } from "./store/authStore";
import { rolePerms } from "./pages/stockManager/stockPermissions";
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProjectDetail = lazy(() => import("./pages/projects/ProjectDetailsPage"));
const ProjectTemplate = lazy(() => import("./pages/projectTemplete/projectTemplete"));
const Inventory = lazy(() => import("./pages/inventory/Inventory"));
const Materials = lazy(() => import("./pages/inventory/Materials"));
const Warehouses = lazy(() => import("./pages/inventory/Warehouses"));
const StockTransactions = lazy(() => import("./pages/inventory/StockTransactions"));
const LowStockAlerts = lazy(() => import("./pages/inventory/LowStockAlerts"));
const Valuation = lazy(() => import("./pages/inventory/Valuation"));
const StockCounts = lazy(() => import("./pages/inventory/StockCounts"));

import { createPortal } from "react-dom";

const Procurement = lazy(() => import("./pages/procurement/Procurement"));
const RFQs = lazy(() => import("./pages/procurement/RFQs"));
const Quotations = lazy(() => import("./pages/procurement/Quotations"));
const PurchaseOrders = lazy(() => import("./pages/procurement/PurchaseOrders"));
const Deliveries = lazy(() => import("./pages/procurement/Deliveries"));
const TaskRequests = lazy(() => import("./pages/projects/TaskRequests"));
const MyTasks = lazy(() => import("./pages/projects/MyTasks"));
const VendorDashboard = lazy(() => import("./pages/vendor/VendorDashboard"));
const SiteManagement = lazy(() => import("./pages/site/SiteManagement"));
const MaterialDetail = lazy(() => import("./pages/inventory/MaterialDetail"));
const Bookings = lazy(() => import("./pages/booking/Bookings"));
const BookingDetail = lazy(() => import("./pages/booking/BookingDetail"));
const MyBookings = lazy(() => import("./pages/booking/MyBookings"));
const MyInstallments = lazy(() => import("./pages/booking/MyInstallments"));
const PendingBookings = lazy(() => import("./pages/booking/PendingBookings"));
const CountDetail = lazy(() => import("./pages/inventory/CountDetail"));
const TaskDetailPage = lazy(() => import("./pages/projects/TaskDetailPage"));
const HR = lazy(() => import("./pages/hr/HR"));
const EmployeeDetail = lazy(() => import("./pages/hr/EmployeeDetail"));
const LaborDetail = lazy(() => import("./pages/hr/LaborDetail"));
const EmployeeDashboard = lazy(() => import("./pages/hr/EmployeeDashboard"));
const LeadManagement = lazy(() => import("./pages/lead/LeadManagement"));
const PropertyInventory = lazy(() => import("./pages/PropertyInventory"));
const Finance = lazy(() => import("./pages/finance/Finance"));

const FinanceLayout = lazy(() => import("./pages/finance/FinanceLayout"));
const FinanceDashboard = lazy(() => import("./pages/finance/FinanceDashboard").then((m) => ({ default: m.FinanceDashboard })));
const FinanceBookingsReminder = lazy(() => import("./pages/finance/FinanceBookingsReminder").then((m) => ({ default: m.FinanceBookingsReminder })));
const FinanceDueInstallments = lazy(() => import("./pages/finance/FinanceDueInstallments").then((m) => ({ default: m.FinanceDueInstallments })));
const FinanceMilestones = lazy(() => import("./pages/finance/FinanceMilestones").then((m) => ({ default: m.FinanceMilestones })));
const FinancePayrollApprovals = lazy(() => import("./pages/finance/FinancePayrollApprovals").then((m) => ({ default: m.FinancePayrollApprovals })));
const FinanceExpenses = lazy(() => import("./pages/finance/FinanceExpenses").then((m) => ({ default: m.FinanceExpenses })));
const FinanceReminders = lazy(() => import("./pages/finance/FinanceReminders").then((m) => ({ default: m.FinanceReminders })));

// 👇 NEW COMPONENTS IMPORTED HERE 👇
const MyExpenses = lazy(() => import("./pages/hr/MyExpenses"));
const EmployeeAttendance = lazy(() => import("./pages/hr/EmployeeAttendance").then((m) => ({ default: m.EmployeeAttendance })));
const EmployeeLeaves = lazy(() => import("./pages/hr/EmployeeLeaves").then((m) => ({ default: m.EmployeeLeaves })));
const EmployeeSalary = lazy(() => import("./pages/hr/EmployeeSalary").then((m) => ({ default: m.EmployeeSalary })));
const EmployeeAnnouncements = lazy(() => import("./pages/hr/EmployeeAnnouncements").then((m) => ({ default: m.EmployeeAnnouncements })));
const EmployeeLayout = lazy(() => import("./pages/hr/EmployeeLayout"));
const FinanceBookings = lazy(() => import("./pages/finance/FinanceBookings"));
const FinanceBookingDetail = lazy(() => import("./pages/finance/FinanceBookings/FinanceBookingDetail"));
const ExpenseReports = lazy(() => import("./pages/finance/ExpenseReports"));
const ProjectDetailPage = lazy(() => import("./components/propertyInventory/ProjectDetailPage"));
import { AppLoader } from "./AppLoader";
const EmployeeOverview = lazy(() => import("./pages/hr/EmployeeOverview"));
const OfficeViewPage = lazy(() => import("./pages/hr/OfficeViewPage").then((m) => ({ default: m.OfficeViewPage })));
const MilestoneBuyersPage = lazy(() => import("./pages/finance/MilestoneBuyersPage").then((m) => ({ default: m.MilestoneBuyersPage })));
const MilestonePaymentSummaryPage = lazy(() => import("./pages/finance/MilestonePaymentSummaryPage").then((m) => ({ default: m.MilestonePaymentSummaryPage })));
const MilestoneBuyerDetailPage = lazy(() => import("./pages/finance/MilestoneBuyerDetailPage").then((m) => ({ default: m.MilestoneBuyerDetailPage })));
const ManagerBookingDetail = lazy(() => import("./pages/booking/ManagerBookingDetail"));
const ManagersList = lazy(() => import("./pages/booking/ManagersList"));
const EmployeeAdvanceSalary = lazy(() => import("./pages/hr/tabs/EmployeeAdvanceSalary").then((m) => ({ default: m.EmployeeAdvanceSalary })));
const FinanceAdvanceSalary = lazy(() => import("./pages/finance/FinanceAdvanceSalary").then((m) => ({ default: m.FinanceAdvanceSalary })));
const FinanceIncentives = lazy(() => import("./pages/finance/FinanceIncentives").then((m) => ({ default: m.FinanceIncentives })));
const IncentiveConfig = lazy(() => import("./pages/IncentiveConfig"));
const WorkingDays = lazy(() => import("./pages/hr/WorkingDays").then((m) => ({ default: m.WorkingDays })));
const TowerMilestonesMatrix = lazy(() => import("./pages/projects/TowerMilestonesMatrix"));
const StockManager = lazy(() => import("./pages/stockManager/StockManager"));
const AddReportPage = lazy(() => import("./pages/stockManager/AddReportPage"));
const AddStockPage = lazy(() => import("./pages/stockManager/AddStockPage"));
const AddConsumptionPage = lazy(() => import("./pages/stockManager/AddConsumptionPage"));
const AddConsumptionFormPage = lazy(() => import("./pages/stockManager/AddConsumptionFormPage"));
const ConsumptionReportPage = lazy(() => import("./pages/stockManager/ConsumptionReportPage"));
const SiteManagerDashboard = lazy(() => import("./pages/stockManager/SiteManagerDashboard"));

// Opens the page only for roles that can create the record; other roles go to a page they can use
function StockRoute({ can, to, children }) {
        const { current } = useAuthStore();
        return rolePerms(current?.role)[can] ? children : <Navigate to={to} replace />;
}

export default function App() {
        const { initAuth, loading } = useAuthStore((s) => s);

        useEffect(() => {
                initAuth();
        }, [initAuth]);

        if (loading) return <AppLoader />;

        return (
                <>
                        {createPortal(
                                <Toaster
                                        position="bottom-right"
                                        richColors
                                        expand={true}
                                        portalProps={{
                                                container: document.body,
                                        }}
                                />,
                                document.body,
                        )}

                        <Suspense fallback={<AppLoader />}>
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
                                        <Route path="/projects/:id/tower-milestones" element={<TowerMilestonesMatrix />} />
                                        <Route path="/property-inventory" element={<PropertyInventory />} />
                                        <Route path="/property-inventory/:projectId" element={<ProjectDetailPage />} />

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
                                        <Route path="/managers-bookings" element={<ManagersList />} />
                                        <Route path="/managers-bookings/:userId" element={<ManagerBookingDetail />} />
                                        <Route path="/my-installments" element={<MyInstallments />} />
                                        <Route path="/pending-bookings" element={<PendingBookings />} />

                                        {/* 👇 HR & EXPENSES ROUTES 👇 */}
                                        {/* Base path redirect to default tab */}
                                        <Route path="/hr" element={<Navigate to="/hr/employees" replace />} />

                                        {/* Dynamic tab route */}
                                        <Route path="/hr/:tab" element={<HR />} />

                                        <Route path="/hr/offices/:id" element={<OfficeViewPage />} />

                                        <Route path="/hr/employees/:id" element={<EmployeeDetail />} />
                                        <Route path="/hr/labors/:id" element={<LaborDetail />} />
                                        
                                        {/* Working Days Page */}
                                        <Route path="/hr/salary/working-days" element={<WorkingDays />} />

                                        <Route path="/leaves" element={<EmployeeDashboard />} />

                                        <Route
                                                path="/employee-overview"
                                                element={
                                                        <EmployeeLayout>
                                                                <EmployeeOverview />
                                                        </EmployeeLayout>
                                                }
                                        />

                                        <Route
                                                path="/employee-attendance"
                                                element={
                                                        <EmployeeLayout>
                                                                <EmployeeAttendance />
                                                        </EmployeeLayout>
                                                }
                                        />

                                        <Route
                                                path="/employee-leaves"
                                                element={
                                                        <EmployeeLayout>
                                                                <EmployeeLeaves />
                                                        </EmployeeLayout>
                                                }
                                        />

                                        <Route
                                                path="/employee-salary"
                                                element={
                                                        <EmployeeLayout>
                                                                <EmployeeSalary />
                                                        </EmployeeLayout>
                                                }
                                        />

                                        <Route
                                                path="/employee-advance-salary"
                                                element={
                                                        <EmployeeLayout>
                                                                <EmployeeAdvanceSalary />
                                                        </EmployeeLayout>
                                                }
                                        />

                                        <Route
                                                path="/employee-announcements"
                                                element={
                                                        <EmployeeLayout>
                                                                <EmployeeAnnouncements />
                                                        </EmployeeLayout>
                                                }
                                        />

                                        {/* My Expenses Route */}
                                        <Route path="/my-expenses" element={<MyExpenses />} />

                                        <Route path="/crm" element={<LeadManagement />} />

                                        <Route path="/inventory" element={<Inventory />} />

                                        <Route path="/finance" element={<Finance />} />

                                        <Route
                                                path="/finance-dashboard"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceDashboard />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-bookings-reminder"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceBookingsReminder />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-bookings"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceBookings />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-bookings/:id"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceBookingDetail />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-expense-reports"
                                                element={
                                                        <FinanceLayout>
                                                                <ExpenseReports />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-due-installments"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceDueInstallments />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-milestones"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceMilestones />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-milestones-summary"
                                                element={
                                                        <FinanceLayout>
                                                                <MilestonePaymentSummaryPage />
                                                        </FinanceLayout>}
                                        />
                                        <Route
                                                path="/finance-milestones-buyers"
                                                element={
                                                        <FinanceLayout>
                                                                <MilestoneBuyersPage />
                                                        </FinanceLayout>}
                                        />
                                        <Route
                                                path="/finance-milestones-buyers/:bookingId"
                                                element={
                                                        <FinanceLayout>
                                                                <MilestoneBuyerDetailPage />
                                                        </FinanceLayout>}
                                        />

                                        <Route
                                                path="/finance-advance-salary"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceAdvanceSalary />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-incentives"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceIncentives />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-payroll"
                                                element={
                                                        <FinanceLayout>
                                                                <FinancePayrollApprovals />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-expenses"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceExpenses />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route
                                                path="/finance-reminders"
                                                element={
                                                        <FinanceLayout>
                                                                <FinanceReminders />
                                                        </FinanceLayout>
                                                }
                                        />

                                        <Route path="/crm" element={<CRM />} />
                                        <Route path="/documents" element={<Documents />} />
                                        <Route path="/reports" element={<Reports />} />
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="/incentive-config" element={<IncentiveConfig />} />

                                        {/* Site Manager Routes */}
                                        <Route path="/site-manager" element={<Navigate to="/site-manager/dashboard" replace />} />
                                        <Route path="/site-manager/dashboard" element={<SiteManagerDashboard />} />
                                        <Route path="/site-manager/list" element={<AddStockPage />} />
                                        <Route
                                                path="/site-manager/add-stock"
                                                element={
                                                        <StockRoute can="canAddStock" to="/site-manager/list">
                                                                <AddReportPage />
                                                        </StockRoute>
                                                }
                                        />
                                        <Route path="/site-manager/add-consumption" element={<AddConsumptionPage />} />
                                        <Route
                                                path="/site-manager/add-consumption/new"
                                                element={
                                                        <StockRoute can="canAddConsumption" to="/site-manager/add-consumption">
                                                                <AddConsumptionFormPage />
                                                        </StockRoute>
                                                }
                                        />
                                        <Route path="/site-manager/consumption-report" element={<ConsumptionReportPage />} />
                                        <Route path="/admin/consumptionreport" element={<ConsumptionReportPage />} />
                                        <Route path="/site-manager/manage" element={<Navigate to="/site-manager/manage/dashboard" replace />} />
                                        <Route path="/site-manager/manage/:tab" element={<StockManager />} />
                                </Route>

                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                        </Suspense>
                </>
        );
}