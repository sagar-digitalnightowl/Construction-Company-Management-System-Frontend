import api from "@/api/axios";
import { cleanParams, downloadBlobResponse } from "@/lib/bank";

// Universal export (guide v2.9.6): the same list endpoint with ?export=xlsx or ?export=pdf returns a file.
// The current filters are sent with it, so only the filtered rows are exported.
export const EXPORT_FORMATS = {
	xlsx: { label: "Export Excel", ext: "xlsx" },
	pdf: { label: "Export PDF", ext: "pdf" },
};

export async function exportList(url, params, format, name = "export") {
	const res = await api.get(url, {
		params: { ...cleanParams(params || {}), export: format },
		responseType: "blob",
	});
	downloadBlobResponse(res, `${name}.${EXPORT_FORMATS[format].ext}`);
}
