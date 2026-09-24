import React from "react";

export const renderStatus = (status) => {
	const s = (status || "").toLowerCase();

	if (s === "paid" || s === "approved" || s === "wallet adjusted") {
		return (
			<span className="font-medium text-success capitalize">
				{status}
			</span>
		);
	}

	if (s === "rejected") {
		return (
			<span className="font-medium text-destructive capitalize">
				{status}
			</span>
		);
	}

	return (
		<span className="font-medium text-amber-600 capitalize">
			{status || "Pending"}
		</span>
	);
};