// src/lib/bookingNotifications.js
// Helpers for booking notifications (PDF v2.9). WhatsApp only in this release.

// Result of the WhatsApp cancellation notice, from the notification history.
// status: "sent" | "failed" | "pending" (no log yet); reason is set when failed.
export function whatsappCancellationStatus(logs = []) {
	const rows = logs
		.filter((log) => log.channel === "whatsapp" && log.type === "flat_cancellation")
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	const latest = rows[0];
	if (!latest) return { status: "pending", reason: null };
	if (latest.status === "failed") return { status: "failed", reason: latest.errorMessage || "unknown reason" };
	if (latest.status === "sent") return { status: "sent", reason: null };
	return { status: "pending", reason: null };
}

// Buyer phone check for new bookings: at least 10 digits once spaces, + and dashes are removed.
export function buyerPhoneError(phone) {
	const digits = String(phone || "").replace(/\D/g, "");
	if (!digits) return "Enter the buyer's phone number. The buyer receives the booking notice on WhatsApp.";
	if (digits.length < 10) return "The buyer's phone number needs at least 10 digits.";
	return null;
}

// Text for the cancel dialog, from the WhatsApp result (option C: show the real result, not a guess)
export function cancelNoticeText(whatsapp) {
	if (!whatsapp || whatsapp.status === "pending") {
		return "The WhatsApp cancellation notice is being sent. Check Notification History on this page for the result.";
	}
	if (whatsapp.status === "failed") {
		return `The cancellation notice was not delivered on WhatsApp: ${whatsapp.reason}. Share the cancellation letter with the buyer yourself.`;
	}
	return "Cancellation notice has been sent to the buyer via WhatsApp.";
}
