import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/common/PageHeader";
import { formatINR } from "@/lib/helpers";

const formatMonthLabel = (ym) => {
	if (!ym) return "-";
	const [y, m] = ym.split("-");
	return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-IN", {
		month: "short",
		year: "numeric",
	});
};

const renderDelta = (added, released, format = (v) => v) => {
	if (!added && !released) return <span className="text-muted-foreground">-</span>;
	return (
		<div className="space-y-0.5">
			{added > 0 && <div className="text-green-600">+ {format(added)}</div>}
			{released > 0 && <div className="text-red-600">− {format(released)}</div>}
		</div>
	);
};

export function BookingLedgerTab({
	bookingLedger,
	ledgerLoading,
	canEdit,
	onOpeningBalance,
}) {
	const ledgerRows = [...(bookingLedger?.rows || [])].sort((a, b) =>
		b.month.localeCompare(a.month)
	);

	return (
		<div className="space-y-4">
			{ledgerLoading && !bookingLedger ? (
				<Skeleton className="h-24" />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<StatCard
						size="compact"
						label="Hold balance"
						value={formatINR(bookingLedger?.currentHoldBalance ?? 0)}
						valueClassName="text-sm"
					/>
					<StatCard
						size="compact"
						label="Bonus queue"
						value={`${bookingLedger?.currentBonusQueueUnits ?? 0} units (${formatINR(bookingLedger?.currentBonusQueueAmount ?? 0)})`}
						valueClassName="text-sm"
					/>
					<StatCard
						size="compact"
						label="Next month bonus release"
						value={formatINR(bookingLedger?.nextMonthBonusRelease ?? 0)}
						valueClassName="text-sm"
					/>
				</div>
			)}

			{canEdit && (
				<Button variant="outline" size="sm" onClick={onOpeningBalance}>
					Opening balance
				</Button>
			)}

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm">Monthly ledger</CardTitle>
				</CardHeader>
				<CardContent>
					{ledgerRows.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No ledger entries yet. Entries are created when salary slips are generated.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b text-left text-xs text-muted-foreground">
										<th className="py-2 pr-4 font-medium">Month</th>
										<th className="py-2 pr-4 font-medium">Type</th>
										<th className="py-2 pr-4 font-medium">Bookings</th>
										<th className="py-2 pr-4 font-medium">Salary</th>
										<th className="py-2 pr-4 font-medium">Hold</th>
										<th className="py-2 pr-4 font-medium">Hold balance</th>
										<th className="py-2 pr-4 font-medium">Bonus units</th>
										<th className="py-2 pr-4 font-medium">Queue after</th>
										<th className="py-2 font-medium">Note</th>
									</tr>
								</thead>
								<tbody>
									{ledgerRows.map((row) => (
										<tr key={row._id} className="border-b last:border-0 align-top">
											<td className="py-2 pr-4 whitespace-nowrap">{formatMonthLabel(row.month)}</td>
											<td className="py-2 pr-4">
												<Badge variant={row.type === "auto" ? "outline" : "warning"} className="capitalize">
													{row.type}
												</Badge>
											</td>
											<td className="py-2 pr-4">{row.bookingsCount ?? 0}</td>
											<td className="py-2 pr-4 whitespace-nowrap">
												{row.monthlySalarySnapshot > 0 ? formatINR(row.monthlySalarySnapshot) : "-"}
											</td>
											<td className="py-2 pr-4 whitespace-nowrap">
												{renderDelta(row.holdAccrued, row.holdReleased, formatINR)}
											</td>
											<td className="py-2 pr-4 whitespace-nowrap font-medium">
												{formatINR(row.holdBalanceAfter ?? 0)}
											</td>
											<td className="py-2 pr-4 whitespace-nowrap">
												{renderDelta(row.bonusUnitsAccrued, row.bonusUnitsReleased)}
												{row.bonusAmountAccrued > 0 && (
													<div className="text-xs text-muted-foreground">
														{formatINR(row.bonusAmountAccrued)} accrued
													</div>
												)}
												{row.bonusAmountReleased > 0 && (
													<div className="text-xs text-muted-foreground">
														{formatINR(row.bonusAmountReleased)} released
													</div>
												)}
											</td>
											<td className="py-2 pr-4 whitespace-nowrap">
												{row.bonusQueueUnitsAfter ?? 0} units ({formatINR(row.bonusQueueAmountAfter ?? 0)})
											</td>
											<td className="py-2 text-muted-foreground">{row.note || "-"}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}