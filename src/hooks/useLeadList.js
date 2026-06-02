import { useState, useEffect } from "react";
import { toast } from "sonner";
import { leadApi } from "@/api/leadApi";

export const useLeadList = () => {
	const [leads, setLeads] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchLeads = async () => {
			setLoading(true);

			try {
				const res = await leadApi.getAllLeads({
					limit: 1000,
				});

				setLeads(res?.data?.data?.leads || []);
			} catch (err) {
				toast.error(
					err?.response?.data?.message || "Failed to load leads",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchLeads();
	}, []);

	return {
		leads,
		loading,
	};
};
