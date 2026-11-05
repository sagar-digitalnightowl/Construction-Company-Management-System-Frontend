// Admin / HR / Director / Project Manager: reports forwarded to them (acknowledge)
import React from "react";
import { WorkReportQueue } from "@/components/workReports/WorkReportQueue";

export default function WorkReportInbox() {
	return (
		<WorkReportQueue
			title="Work Reports"
			description="Reports forwarded to you by the site managers. Acknowledge them to close the flow."
			allowed={["acknowledge"]}
			defaultStatus="forwarded"
			statusOptions={[
				{ value: "forwarded", label: "Forwarded to me" },
				{ value: "acknowledged", label: "Acknowledged" },
				{ value: "all", label: "All statuses" },
			]}
		/>
	);
}
