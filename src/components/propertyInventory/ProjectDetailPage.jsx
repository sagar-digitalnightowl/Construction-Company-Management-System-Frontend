
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePropertyInventory } from "@/hooks/usePropertyInventory";
import BookingPaymentModal from "./BookingPaymentModal";
import ProjectTowersTab from "./ProjectTowersTab";
import ProjectBookingsTab from "./ProjectBookingsTab";
import BookingDetailsDialog from "./BookingDetailsDialog";
import FlatDetailsDialog from "./FlatDetailsDialog";

export default function ProjectDetailPage() {
	const topRef = useRef(null);
	const { projectId } = useParams();
	const navigate = useNavigate();

	const {
		selectedProject: project,
		projectBookings: bookings,
		bookingsPagination,
		projectAgreements: agreements,
		siteEngineers,
		bookingPayment,
		loading,
		fetchProjectDetails,
		fetchProjectBookings,
		fetchProjectAgreements,
		fetchSiteEngineers,
		fetchBookingPaymentDetails,
	} = usePropertyInventory();

	const [selectedTowerIdx, setSelectedTowerIdx] = useState(0);
	const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
	const [selectedFlat, setSelectedFlat] = useState(null);
	const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [bookingSearch, setBookingSearch] = useState("");

	useEffect(() => {
		topRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}, [bookingsPagination?.page]);

	useEffect(() => {
		fetchProjectDetails(projectId);
		fetchProjectBookings(projectId, { page: 1, limit: 10 });
		fetchProjectAgreements(projectId);
		fetchSiteEngineers(projectId);
	}, [projectId]);

	const handleBookingPageChange = (page) => {
		fetchProjectBookings(projectId, { page, limit: 10, search: bookingSearch.trim(), });
	};

	const handleBookingSearch = (value = bookingSearch) => {
		const search = value.trim();
		setBookingSearch(value);
		fetchProjectBookings(projectId, { page: 1, limit: 10, search, });
	};

	const handleViewPayments = async (bookingId) => {
		await fetchBookingPaymentDetails(bookingId);
		setPaymentModalOpen(true);
	};

	const towers = project?.towers || [];
	const selectedTower = towers[selectedTowerIdx] || null;
	const floors = selectedTower?.floors || [];
	const safeFloorIdx = Math.min(selectedFloorIdx, floors.length - 1);
	const currentFloor = floors[safeFloorIdx] || null;
	const currentFlats = currentFloor?.flats || [];

	if (!project) return null;

	return (

		<div ref={topRef} className="space-y-6">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<h1 className="text-xl font-semibold flex items-center gap-2">
					<Building2 className="h-6 w-6" />
					{project.name} – Inventory Dashboard
				</h1>
			</div>

			<Tabs defaultValue="towers" className="mt-2">
				<TabsList className="mb-4">
					<TabsTrigger value="towers">
						<Building2 className="h-4 w-4 mr-2" /> Towers & Flats
					</TabsTrigger>
					<TabsTrigger value="bookings">
						<BookOpen className="h-4 w-4 mr-2" /> Bookings
					</TabsTrigger>
				</TabsList>

				{/* ==================== TOWERS & FLATS TAB ==================== */}
				<ProjectTowersTab
					towers={towers}
					selectedTowerIdx={selectedTowerIdx}
					setSelectedTowerIdx={setSelectedTowerIdx}
					floors={floors}
					safeFloorIdx={safeFloorIdx}
					setSelectedFloorIdx={setSelectedFloorIdx}
					currentFloor={currentFloor}
					currentFlats={currentFlats}
					setSelectedFlat={setSelectedFlat}
					selectedTower={selectedTower}
				/>

				{/* ==================== BOOKINGS TAB ==================== */}
				<ProjectBookingsTab
					projectId={projectId}
					bookings={bookings}
					bookingsPagination={bookingsPagination}
					bookingSearch={bookingSearch}
					setBookingSearch={setBookingSearch}
					fetchProjectBookings={fetchProjectBookings}
					handleBookingSearch={handleBookingSearch}
					handleBookingPageChange={handleBookingPageChange}
					setSelectedBookingDetails={setSelectedBookingDetails}
					handleViewPayments={handleViewPayments}
				/>
			</Tabs>

			{/* FULL BOOKING DETAILS MODAL */}
			<BookingDetailsDialog
				selectedBookingDetails={selectedBookingDetails}
				setSelectedBookingDetails={setSelectedBookingDetails}
			/>

			{/* EXISTING FLAT DETAILS MODAL */}
			<FlatDetailsDialog
				selectedFlat={selectedFlat}
				setSelectedFlat={setSelectedFlat}
			/>

			<BookingPaymentModal
				open={paymentModalOpen}
				onOpenChange={setPaymentModalOpen}
				bookingPayment={bookingPayment}
			/>
		</div>
	);
}