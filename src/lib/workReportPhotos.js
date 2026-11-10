// Photo upload for work reports: presigned URL (fileType "work_report"), then a PUT of the file to that URL.
// The saved value is the publicUrl returned by the server, which goes in the report's `photos` array.
// The accepted types, the 10 MB limit and the HEIC rule are in ./photoRules (guide v2.9, section 3).
import { authApi } from "@/api";
import { COMPRESS_MAX_SIDE, fitWithin, shouldCompress } from "./photoRules";

export { PHOTO_ACCEPT, PHOTO_TYPES, MAX_PHOTO_BYTES, validatePhoto, isHeic } from "./photoRules";

const COMPRESS_QUALITY = 0.8;

// Returns a smaller JPEG when that helps, otherwise the original file. Any failure keeps the original.
export async function compressPhoto(file) {
	if (!shouldCompress(file) || typeof document === "undefined" || typeof createImageBitmap === "undefined") return file;
	try {
		const bitmap = await createImageBitmap(file);
		const { width, height } = fitWithin(bitmap.width, bitmap.height, COMPRESS_MAX_SIDE);
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
		bitmap.close?.();
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", COMPRESS_QUALITY));
		if (!blob || blob.size >= file.size) return file;
		const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
		return new File([blob], name, { type: "image/jpeg" });
	} catch (err) {
		return file;
	}
}

export async function uploadWorkReportPhoto(file) {
	const prepared = await compressPhoto(file);
	const res = await authApi.getPresignedUrl({
		fileName: prepared.name,
		fileType: "work_report",
		mimeType: prepared.type,
	});
	const body = res?.data?.data ?? res?.data ?? {};
	const { url, publicUrl } = body;
	if (!url || !publicUrl) throw new Error("The server did not return an upload address");

	const put = await fetch(url, {
		method: "PUT",
		body: prepared,
		headers: { "Content-Type": prepared.type },
	});
	if (!put.ok) throw new Error("The photo could not be uploaded");
	return publicUrl;
}
