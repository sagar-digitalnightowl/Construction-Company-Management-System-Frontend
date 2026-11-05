// Photo upload for work reports: presigned URL (fileType "work_report"), then a PUT of the file to that URL.
// The saved value is the publicUrl returned by the server, which goes in the report's `photos` array.
import { authApi } from "@/api";

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB

export function validatePhoto(file) {
	if (!PHOTO_TYPES.includes(file.type)) return "Only JPG, PNG or WebP photos can be uploaded";
	if (file.size > MAX_PHOTO_BYTES) return "The photo is larger than 10 MB";
	return null;
}

export async function uploadWorkReportPhoto(file) {
	const res = await authApi.getPresignedUrl({
		fileName: file.name,
		fileType: "work_report",
		mimeType: file.type,
	});
	const body = res?.data?.data ?? res?.data ?? {};
	const { url, publicUrl } = body;
	if (!url || !publicUrl) throw new Error("The server did not return an upload address");

	const put = await fetch(url, {
		method: "PUT",
		body: file,
		headers: { "Content-Type": file.type },
	});
	if (!put.ok) throw new Error("The photo could not be uploaded");
	return publicUrl;
}
