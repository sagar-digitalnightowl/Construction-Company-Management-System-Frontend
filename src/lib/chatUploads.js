// Chat attachment upload (guide section 3.8): presigned URL, PUT to storage, then confirm.
import axios from "axios";
import { chatApi } from "@/api/chatApi";
import { CHAT_MAX_FILE_BYTES, messageTypeFromMime } from "./chatHelpers";

export function validateChatFile(file) {
	if (!file) return "Choose a file to attach.";
	if (file.size > CHAT_MAX_FILE_BYTES) return "This file is too large. The limit is 25 MB.";
	return null;
}

// Returns the confirmed attachment: { _id, fileUrl, fileName }
export async function uploadChatAttachment(file) {
	const mimeType = file.type || "application/octet-stream";
	const presign = await chatApi.presignedUpload({ fileName: file.name, mimeType, fileSize: file.size });
	const { uploadUrl, fileKey, publicUrl } = presign.data.data;

	// Plain axios, not the API instance: the storage host must not receive our bearer token
	await axios.put(uploadUrl, file, { headers: { "Content-Type": mimeType } });

	const confirmed = await chatApi.confirmAttachment({
		fileKey,
		fileName: file.name,
		mimeType,
		fileSize: file.size,
		publicUrl,
	});
	return { attachment: confirmed.data.data, messageType: messageTypeFromMime(mimeType) };
}
