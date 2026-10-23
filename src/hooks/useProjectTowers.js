// src/hooks/useProjectTowers.js

import { useEffect, useState } from "react";
import { projectApi } from "@/api";

// Towers of one project (towers[].towerName, towers[].floors[].floorNumber) for consumption dropdowns.
// Uses GET /project/:id/towers, which site managers can read (GET /project/:id returns 403 for them).
export function useProjectTowers(projectId) {
	const [towers, setTowers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!projectId) {
			setTowers([]);
			setError(false);
			return;
		}
		let cancelled = false;
		setLoading(true);
		setError(false);
		projectApi.towers
			.getAll(projectId)
			.then((res) => {
				if (!cancelled) setTowers(res.data?.data?.towers || []);
			})
			.catch(() => {
				if (!cancelled) {
					setTowers([]);
					setError(true);
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [projectId]);

	return { towers, loading, error };
}
