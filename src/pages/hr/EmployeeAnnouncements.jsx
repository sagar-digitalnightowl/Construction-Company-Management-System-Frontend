import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHR } from "@/hooks/useHR";
import { formatDate } from "@/lib/helpers";

export const EmployeeAnnouncements = () => {
	const { announcements, fetchAnnouncements } = useHR();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadAnnouncements = async () => {
			setLoading(true);
			await fetchAnnouncements();
			setLoading(false);
		};
		loadAnnouncements();
	}, [fetchAnnouncements]);

	if (loading) return <Skeleton className="h-64" />;

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle>Company Announcements</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{announcements?.length === 0 ? (
					<p className="text-center text-muted-foreground">No announcements</p>
				) : (
					announcements?.map((ann) => (
						<div key={ann._id} className="border-b last:border-0 pb-3">
							<h4 className="font-semibold">{ann.title}</h4>
							<p className="text-sm text-muted-foreground mt-1">{ann.message}</p>
							<p className="text-xs text-muted-foreground mt-2">
								Posted on {formatDate(ann.createdAt)}
							</p>
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
};