import React, { useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	CalendarCheck,
	CalendarDays,
	Clock,
	IndianRupee,
	FileText,
	WalletCards,
	ArrowUpRight,
	ArrowDownRight,
	TrendingUp,
	Activity,
	PieChart as PieChartIcon,
	BarChart3,
} from "lucide-react";
import { PageHeader, StatCard, EmptyState } from "@/components/common/PageHeader";
import { useHR } from "@/hooks/useHR";
import {
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	AreaChart,
	Area,
	CartesianGrid,
	RadialBarChart,
	RadialBar,
} from "recharts";

const getGreeting = () => {
	const hour = new Date().getHours();

	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
};

export default function EmployeeOverview() {
	const {
		employeeDashboard,
		fetchEmployeeDashboard,
		employeeDashboardLoading,
	} = useHR();

	useEffect(() => {
		fetchEmployeeDashboard();
	}, [fetchEmployeeDashboard]);

	const data = employeeDashboard;

	const formatCurrency = (amount = 0) =>
		`₹${Number(amount).toLocaleString("en-IN")}`;

	const formatDate = (date) => {
		if (!date) return "-";
		return new Date(date).toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	if (employeeDashboardLoading && !data) {
		return (
			<div className="space-y-4">
				<PageHeader
					eyebrow="Dashboard"
					title="Employee Overview"
					description="Your attendance, leaves, salary and upcoming payments at a glance."
				/>
				<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton key={index} className="h-[90px] w-full rounded-md" />
					))}
				</div>
			</div>
		);
	}

	if (!data) return null;

	const {
		attendance,
		leaveBalance,
		pendingLeaves,
		salary,
		totalSalarySlips,
		upcomingInstallments = [],
		employee,
	} = data;

	const totalAvailableLeaves = Object.values(leaveBalance || {}).reduce(
		(sum, value) => sum + Number(value || 0),
		0
	);

	// Prepare data for charts
	const attendanceData = [
		{ name: "Present", value: attendance?.present ?? 0, color: "#10b981" },
		{ name: "Absent", value: attendance?.absent ?? 0, color: "#ef4444" },
		{ name: "Late", value: attendance?.late ?? 0, color: "#f59e0b" },
		{ name: "Half Day", value: attendance?.halfDay ?? 0, color: "#6b7280" },
	];

	const leaveBalanceData = Object.entries(leaveBalance || {}).map(
		([type, value]) => ({
			name: type.charAt(0).toUpperCase() + type.slice(1),
			value: Number(value),
			color:
				type === "annual"
					? "#3b82f6"
					: type === "sick"
						? "#ef4444"
						: type === "casual"
							? "#10b981"
							: type === "emergency"
								? "#f59e0b"
								: "#8b5cf6",
		})
	);

	const salaryBreakdownData = [
		{
			name: "Earnings",
			value: salary?.totalEarnings ?? 0,
			color: "#10b981",
		},
		{
			name: "Deductions",
			value: salary?.totalDeductions ?? 0,
			color: "#ef4444",
		},
		{
			name: "Net Pay",
			value: salary?.currentMonthSalary ?? 0,
			color: "#3b82f6",
		},
	];

	const attendanceRateData = [
		{
			name: "Attendance Rate",
			value: attendance?.attendanceRate ?? 0,
			fill: "#3b82f6",
		},
	];

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
					<p className="font-semibold text-gray-900 text-sm">{payload[0].name}</p>
					<p className="text-xs text-gray-600">
						Value: <span className="font-semibold">{payload[0].value}</span>
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="space-y-4">
			<div className="mb-5">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					{getGreeting()},{" "}
					<span className="text-primary">
						{employee?.name || "Employee"}
					</span>
				</h1>

				<p className="mt-1 text-sm text-muted-foreground">
					Here's your attendance, leaves, salary and payment overview.
				</p>
			</div>

			{/* Top KPI Stats */}
			<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="Present Days"
					value={attendance?.present ?? 0}
					icon={CalendarCheck}
					accent="primary"
					delta={`Out of ${attendance?.totalWorkingDays ?? 0} working days`}
					deltaTone="neutral"
				/>

				<StatCard
					label="Leave Balance"
					value={totalAvailableLeaves}
					icon={CalendarDays}
					accent="primary"
					delta="Total available leaves"
					deltaTone="neutral"
				/>

				<StatCard
					label="Pending Leaves"
					value={pendingLeaves ?? 0}
					icon={FileText}
					accent="warning"
					delta="Awaiting HR approval"
					deltaTone="neutral"
				/>

				<StatCard
					label="Salary Slips"
					value={totalSalarySlips ?? 0}
					icon={WalletCards}
					accent="success"
					delta="Available for download"
					deltaTone="neutral"
				/>
			</div>

			{/* Attendance Analytics Section */}
			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-lg">Attendance Overview</CardTitle>
								<CardDescription className="text-xs">
									Your attendance breakdown for the current period
								</CardDescription>
							</div>
							<BarChart3 className="h-6 w-6 text-primary/60" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={attendanceData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
									<XAxis
										dataKey="name"
										tick={{ fontSize: 11, fill: "#6b7280" }}
										axisLine={false}
										tickLine={false}
									/>
									<YAxis
										tick={{ fontSize: 11, fill: "#6b7280" }}
										axisLine={false}
										tickLine={false}
										allowDecimals={false}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Bar
										dataKey="value"
										radius={[6, 6, 0, 0]}
										maxBarSize={40}
									>
										{attendanceData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-lg">Attendance Rate</CardTitle>
								<CardDescription className="text-xs">Your performance indicator</CardDescription>
							</div>
							<Activity className="h-6 w-6 text-primary/60" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="h-[200px] flex items-center justify-center">
							<ResponsiveContainer width="100%" height="100%">
								<RadialBarChart
									innerRadius="75%"
									outerRadius="100%"
									data={attendanceRateData}
									startAngle={90}
									endAngle={-270}
								>
									<RadialBar
										background={{ fill: "#f3f4f6" }}
										dataKey="value"
										cornerRadius={30}
									/>
									<text
										x="50%"
										y="50%"
										textAnchor="middle"
										dominantBaseline="middle"
										className="text-2xl font-bold"
										fill="#3b82f6"
									>
										{attendance?.attendanceRate ?? 0}%
									</text>
								</RadialBarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Leave Balance & Distribution */}
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg">Leave Balance Distribution</CardTitle>
							<CardDescription className="text-xs">
								Your available leaves by category
							</CardDescription>
						</div>
						<PieChartIcon className="h-6 w-6 text-primary/60" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid lg:grid-cols-2 gap-4">
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={leaveBalanceData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }) =>
											`${name} (${(percent * 100).toFixed(0)}%)`
										}
										outerRadius={70}
										fill="#8884d8"
										dataKey="value"
									>
										{leaveBalanceData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip content={<CustomTooltip />} />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 content-center">
							{leaveBalanceData.map((item, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all"
								>
									<div className="flex items-center gap-2">
										<div
											className="w-2.5 h-2.5 rounded-full"
											style={{ backgroundColor: item.color }}
										/>
										<div>
											<p className="font-medium text-gray-900 text-sm">
												{item.name}
											</p>
											<p className="text-xs text-gray-500">
												Days Available
											</p>
										</div>
									</div>
									<span className="text-base font-bold text-gray-900">
										{item.value}
									</span>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Salary & Financial Overview */}
			<div className="grid gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-lg">Current Month Salary</CardTitle>
						<CardDescription className="text-xs">Financial summary for this month</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between mb-4 bg-gradient-to-r from-primary/5 to-transparent p-3 rounded-lg">
							<div>
								<p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
									Net Payable Amount
								</p>
								<p className="text-2xl font-display font-bold tracking-tight mt-1 text-primary">
									{formatCurrency(salary?.currentMonthSalary)}
								</p>
							</div>
							<div className="rounded-lg bg-primary/10 p-3">
								<IndianRupee className="h-6 w-6 text-primary" />
							</div>
						</div>

						<div className="h-[180px]">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={salaryBreakdownData}>
									<defs>
										<linearGradient
											id="colorEarnings"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor="#10b981"
												stopOpacity={0.8}
											/>
											<stop
												offset="95%"
												stopColor="#10b981"
												stopOpacity={0.1}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
									<XAxis
										dataKey="name"
										tick={{ fontSize: 11, fill: "#6b7280" }}
										axisLine={false}
										tickLine={false}
									/>
									<YAxis
										tick={{ fontSize: 11, fill: "#6b7280" }}
										axisLine={false}
										tickLine={false}
										tickFormatter={(value) => `₹${value / 1000}k`}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Area
										type="monotone"
										dataKey="value"
										stroke="#10b981"
										fill="url(#colorEarnings)"
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>

						<div className="grid grid-cols-2 gap-3 mt-3">
							<StatCard
								size="compact"
								label="Earnings"
								value={formatCurrency(salary?.totalEarnings)}
								icon={ArrowUpRight}
								accent="success"
								valueClassName="text-base text-success"
							/>
							<StatCard
								size="compact"
								label="Deductions"
								value={formatCurrency(salary?.totalDeductions)}
								icon={ArrowDownRight}
								accent="destructive"
								valueClassName="text-base text-destructive"
							/>
						</div>

						<div className="flex items-center justify-between mt-4 pt-3 border-t">
							<span className="text-xs font-medium text-muted-foreground">
								Payment Status
							</span>
							<Badge
								className={
									salary?.paymentStatus === "Paid"
										? "bg-success text-white hover:bg-success/90 text-xs"
										: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20 text-xs"
								}
								variant={
									salary?.paymentStatus === "Paid" ? "default" : "outline"
								}
							>
								{salary?.paymentStatus || "Pending"}
							</Badge>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Upcoming Installments */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-lg">Upcoming Installments</CardTitle>
					<CardDescription className="text-xs">
						Scheduled deductions or loan payments
					</CardDescription>
				</CardHeader>
				<CardContent>
					{upcomingInstallments.length === 0 ? (
						<EmptyState
							icon={FileText}
							title="No upcoming installments"
							description="You don't have any pending payments scheduled for the near future."
						/>
					) : (
						<div className="space-y-2">
							{upcomingInstallments.map((installment) => (
								<div
									key={installment.id}
									className="flex items-center justify-between gap-4 rounded-md border border-border/80 p-3 hover:border-border hover:shadow-sm transition-all"
								>
									<div>
										<p className="font-semibold font-display text-primary text-sm">
											Installment #{installment.installmentNumber}
										</p>
										<p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
											Flat {installment.flatNumber}{" "}
											<span className="text-border">•</span>{" "}
											{installment.reference}
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-base font-display">
											{formatCurrency(installment.amount)}
										</p>
										<p className="text-[10px] uppercase tracking-wider font-medium text-warning mt-1 bg-warning/10 px-2 py-0.5 rounded-sm inline-block">
											Due: {formatDate(installment.dueDate)}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}