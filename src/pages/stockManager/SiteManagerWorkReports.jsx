// Site Manager panel: work reports routed to this manager (review, reject, forward)
import React from "react";
import { WorkReportQueue } from "@/components/workReports/WorkReportQueue";

export default function SiteManagerWorkReports() {
	return (
		<WorkReportQueue
			title="Work Reports"
			description="Reports routed to you. Review them, reject them for more information, or forward them to admin and HR."
			allowed={["review", "reject", "forward"]}
			defaultStatus="submitted"
		/>
	);
}
