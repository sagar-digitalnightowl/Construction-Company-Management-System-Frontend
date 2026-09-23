import { StatCard } from "@/components/common/PageHeader";
import { formatINR } from "@/lib/helpers";

export function FinanceStats({
	stats,
	pureBaseReceived,
	currentView,
}) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4">
			{/* Property Stats */}
			<StatCard
				size="compact"
				label="Total Flats"
				value={stats.totalFlats}
				accent="neutral"
				valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
			/>
			<StatCard
				size="compact"
				label="Booked / Sold"
				value={stats.bookedFlats}
				accent="neutral"
				valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
			/>
			<StatCard
				size="compact"
				label="Received (Incl. GST)"
				value={formatINR(stats.totalPaid)}
				accent="neutral"
				valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
			/>
			<StatCard
				size="compact"
				label="Due (Incl. GST)"
				value={formatINR(stats.totalRemaining)}
				accent="neutral"
				valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
			/>
			<StatCard
				size="compact"
				label="Pure Revenue"
				value={formatINR(pureBaseReceived > 0 ? pureBaseReceived : 0)}
				accent="neutral"
				valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
			/>

			{/* Tax & Expense Stats */}
			<StatCard
				size="compact"
				label="GST Collected"
				value={formatINR(stats.gstCollected)}
				accent="neutral"
				valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
			/>

			{currentView !== "floors" && currentView !== "flats" && (
				<>
					<StatCard
						size="compact"
						label="Total Expenses"
						value={formatINR(stats.totalExpenses)}
						accent="neutral"
						valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
					/>

					<StatCard
						size="compact"
						label="Expenses Paid"
						value={formatINR(stats.totalExpensesPaid)}
						accent="neutral"
						valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
					/>

					<StatCard
						size="compact"
						label="Expenses Pending"
						value={formatINR(stats.totalExpensesPending)}
						accent="neutral"
						valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
					/>

					<StatCard
						size="compact"
						label="Expense Tickets"
						value={stats.totalExpenseTickets}
						accent="neutral"
						valueClassName="text-sm sm:text-lg lg:text-2xl truncate"
					/>
				</>
			)}
		</div>
	);
}