// Photo and document rules for work reports, from the Site Engineer API guide v2.9 (section 3).
// Pure functions only, so they can be unit tested without the API client.
export const PHOTO_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
export const PHOTO_ACCEPT = PHOTO_TYPES.join(",");
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB, checked on the file the user picked
// Images above this size are scaled down and re-encoded as JPEG before upload to save data on site
export const COMPRESS_ABOVE_BYTES = 2 * 1024 * 1024;
export const COMPRESS_MAX_SIDE = 1600;

const HEIC_TYPES = ["image/heic", "image/heif"];
const HEIC_NAME = /\.(heic|heif)$/i;

// iPhones often send HEIC with an empty or generic type, so the file name is checked as well
export const isHeic = (file) => HEIC_TYPES.includes(file?.type) || HEIC_NAME.test(file?.name || "");

export function validatePhoto(file) {
	if (isHeic(file)) return "HEIC photos are not supported. Convert the photo to JPEG first.";
	if (!PHOTO_TYPES.includes(file.type)) return "Only JPG, PNG, WebP or PDF files can be uploaded";
	if (file.size > MAX_PHOTO_BYTES) return "The file is larger than 10 MB";
	return null;
}

// Scales a width and height so the longer side is at most `max`
export function fitWithin(width, height, max = COMPRESS_MAX_SIDE) {
	if (!width || !height) return { width, height };
	const scale = Math.min(1, max / Math.max(width, height));
	return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export const shouldCompress = (file) => file.type.startsWith("image/") && file.size > COMPRESS_ABOVE_BYTES;
