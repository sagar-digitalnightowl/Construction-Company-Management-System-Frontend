import { useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportList } from "@/lib/exportFile";

// Excel and PDF export for a list screen. `url` is the list endpoint (for example "/hr/employees"),
// `params` are the screen's current filters, and `name` is the file name without the extension.
export function ExportButtons({ url, params, name = "export", size = "sm" }) {
	const [exporting, setExporting] = useState(null);

	const run = async (format) => {
		setExporting(format);
		try {
			await exportList(url, params, format, name);
		} catch {
			toast.error("Export failed. Please try again.");
		} finally {
			setExporting(null);
		}
	};

	const busy = !!exporting;

	return (
		<div className="flex flex-wrap gap-2">
			<Button variant="outline" size={size} onClick={() => run("xlsx")} disabled={busy} aria-busy={exporting === "xlsx"}>
				{exporting === "xlsx" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <FileSpreadsheet className="mr-2 size-4" />}
				{exporting === "xlsx" ? "Preparing..." : "Export Excel"}
			</Button>
			<Button variant="outline" size={size} onClick={() => run("pdf")} disabled={busy} aria-busy={exporting === "pdf"}>
				{exporting === "pdf" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <FileText className="mr-2 size-4" />}
				{exporting === "pdf" ? "Preparing..." : "Export PDF"}
			</Button>
		</div>
	);
}
