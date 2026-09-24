import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }) {
	const variant =
		status === "available"
			? "success"
			: status === "pending"
				? "warning"
				: status === "sold" || status === "booked"
					? "secondary"
					: "outline";

	const displayLabel =
		status === "pending" ? "Pending Approval" : status;

	return (
		<Badge variant={variant} className="capitalize">
			{displayLabel}
		</Badge>
	);
}