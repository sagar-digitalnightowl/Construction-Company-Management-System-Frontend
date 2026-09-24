export const getEffectiveFlatStatus = (flat) => {
	const flatStatus = (flat.flatStatus || flat.status || "").toLowerCase();

	const bookingStatus = (
		flat.bookingStatus ||
		flat.booking?.status ||
		""
	).toLowerCase();

	const approvalStatus = (
		flat.approvalStatus ||
		flat.booking?.approvalStatus ||
		""
	).toLowerCase();

	if (
		flatStatus === "cancelled" ||
		bookingStatus === "cancelled" ||
		bookingStatus === "rejected" ||
		approvalStatus === "rejected"
	) {
		return "available";
	}

	const hasBookingIntention =
		flatStatus === "booked" ||
		flatStatus === "sold" ||
		bookingStatus === "booked" ||
		bookingStatus === "sold";

	if (hasBookingIntention && approvalStatus === "approved") {
		return "sold";
	}

	if (
		(hasBookingIntention || bookingStatus || flatStatus === "pending") &&
		approvalStatus !== "approved"
	) {
		return "pending";
	}

	return "available";
};
