// src/pages/booking/Bookings.jsx
import React, { useState, useEffect } from "react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingCard } from "@/components/booking/BookingCard";
import { CreateBookingDialog } from "@/components/booking/CreateBookingDialog";
import { useBooking } from "@/hooks/useBooking";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
	const { current } = useAuthStore();
	const canCreate = canMutate(current?.role, "booking");
	const navigate = useNavigate();
	const { bookings, fetchBookings, loading, pagination } = useBooking();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [createOpen, setCreateOpen] = useState(false);

	useEffect(() => {
		fetchBookings({
			page: 1,
			limit: 12,
			search: search || undefined,
			status: statusFilter === "all" ? undefined : statusFilter,
		});
	}, [search, statusFilter]);

	const handleView = (id) => navigate(`/bookings/${id}`);

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Real Estate"
				title="Bookings"
				description="Manage all flat/unit bookings across projects."
				actions={
					canCreate && (
						<Button onClick={() => setCreateOpen(true)}>
							<Plus className="h-4 w-4 mr-2" /> New Booking
						</Button>
					)
				}
			/>
			<div className="flex flex-col sm:flex-row gap-3 justify-between">
				<Tabs value={statusFilter} onValueChange={setStatusFilter}>
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="booked">Booked</TabsTrigger>
						<TabsTrigger value="sold">Sold</TabsTrigger>
						<TabsTrigger value="cancelled">Cancelled</TabsTrigger>
					</TabsList>
				</Tabs>
				<div className="relative">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
					<Input
						className="pl-7 w-64"
						placeholder="Search by unit/ref..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>
			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className="h-40" />
					))}
				</div>
			) : bookings.length === 0 ? (
				<EmptyState
					title="No bookings"
					description="Create a new booking to get started."
				/>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						{bookings.map((b) => (
							<BookingCard key={b._id} booking={b} onClick={handleView} />
						))}
					</div>
					{/* Pagination component can be added here */}
				</>
			)}

			<CreateBookingDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSuccess={() => fetchBookings()}
			/>
		</div>
	);
}
