export const getEffectiveFlatStatus = (flat) => {
	const flatStatus = (flat.flatStatus || flat.status || "").toLowerCase();
	const bookingStatus = (flat.bookingStatus || "").toLowerCase();
	const approvalStatus = (flat.approvalStatus || "").toLowerCase();

	if (flatStatus === "cancelled" || approvalStatus === "rejected") {
		return "available";
	}

	const isBookedOrSold =
		flatStatus === "booked" ||
		flatStatus === "sold" ||
		bookingStatus === "booked" ||
		bookingStatus === "sold";

	if (isBookedOrSold && approvalStatus === "approved") {
		return "sold";
	}

	if (
		(isBookedOrSold || bookingStatus || flatStatus === "pending") &&
		approvalStatus !== "approved"
	) {
		return "pending";
	}

	return "available";
};

export const getFlatDisplay = (flat) => {
	const eff = getEffectiveFlatStatus(flat);
	if (eff === "sold")
		return { status: "sold", label: "Sold", variant: "success" };
	if (eff === "pending")
		return {
			status: "pending",
			label: "Pending Approval",
			variant: "warning",
		};
	return { status: "available", label: "Available", variant: "secondary" };
};
