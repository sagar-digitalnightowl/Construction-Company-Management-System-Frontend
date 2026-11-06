import { useEffect, useRef, useState } from "react";
import { Loader2, Paperclip, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatErrorMessage, messagePreview, TYPING_STOP_DELAY_MS } from "@/lib/chatHelpers";
import { uploadChatAttachment, validateChatFile } from "@/lib/chatUploads";

// Message input: text, file attachments, reply banner and typing notifications.
export function Composer({ disabled, replyTo, onCancelReply, onSend, onTyping }) {
	const [text, setText] = useState("");
	const [pending, setPending] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [sending, setSending] = useState(false);
	const fileInput = useRef(null);
	const typingRef = useRef(false);
	const stopTimer = useRef(null);

	useEffect(() => () => clearTimeout(stopTimer.current), []);

	const stopTyping = () => {
		clearTimeout(stopTimer.current);
		if (typingRef.current) {
			typingRef.current = false;
			onTyping(false);
		}
	};

	const handleChange = (value) => {
		setText(value);
		if (!typingRef.current && value.trim()) {
			typingRef.current = true;
			onTyping(true);
		}
		clearTimeout(stopTimer.current);
		stopTimer.current = setTimeout(stopTyping, TYPING_STOP_DELAY_MS);
		if (!value.trim()) stopTyping();
	};

	const handleFiles = async (event) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;
		const problem = validateChatFile(file);
		if (problem) {
			toast.error(problem);
			return;
		}
		setUploading(true);
		try {
			const { attachment, messageType } = await uploadChatAttachment(file);
			setPending((list) => [...list, { attachment, messageType, name: file.name }]);
		} catch (error) {
			toast.error(chatErrorMessage(error, "Could not upload the file."));
		} finally {
			setUploading(false);
		}
	};

	const send = async () => {
		const content = text.trim();
		if ((!content && pending.length === 0) || sending || uploading) return;
		const messageType = pending.length ? pending[0].messageType : "text";
		setSending(true);
		try {
			await onSend({
				content,
				attachmentIds: pending.map((item) => item.attachment._id),
				messageType,
				replyTo: replyTo?._id ?? null,
			});
			setText("");
			setPending([]);
			onCancelReply();
			stopTyping();
		} catch (error) {
			toast.error(chatErrorMessage(error, "Message could not be sent."));
		} finally {
			setSending(false);
		}
	};

	const onKeyDown = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			send();
		}
	};

	const canSend = !disabled && !sending && !uploading && (text.trim() || pending.length > 0);

	return (
		<div className="border-t bg-background p-3">
			{replyTo && (
				<div className="mb-2 flex items-center justify-between gap-2 rounded-md border-l-2 bg-muted px-3 py-2 text-xs">
					<span className="truncate">Replying to: {messagePreview(replyTo)}</span>
					<button type="button" onClick={onCancelReply} aria-label="Cancel reply" className="shrink-0">
						<X className="size-4" />
					</button>
				</div>
			)}
			{pending.length > 0 && (
				<div className="mb-2 flex flex-wrap gap-2">
					{pending.map((item) => (
						<span key={item.attachment._id} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
							<Paperclip className="size-3" />
							<span className="max-w-[160px] truncate">{item.name}</span>
							<button
								type="button"
								aria-label={`Remove ${item.name}`}
								onClick={() => setPending((list) => list.filter((entry) => entry !== item))}
							>
								<X className="size-3" />
							</button>
						</span>
					))}
				</div>
			)}
			<div className="flex items-end gap-2">
				<input ref={fileInput} type="file" className="hidden" onChange={handleFiles} aria-label="Attach file" />
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={() => fileInput.current?.click()}
					disabled={disabled || uploading}
					aria-label="Attach file"
					title="Attach file"
				>
					{uploading ? <Loader2 className="size-4 animate-spin" /> : <Paperclip className="size-4" />}
				</Button>
				<Textarea
					value={text}
					onChange={(e) => handleChange(e.target.value)}
					onKeyDown={onKeyDown}
					onBlur={stopTyping}
					placeholder={disabled ? "Select a conversation to start" : "Type a message. Enter to send, Shift+Enter for a new line"}
					disabled={disabled}
					rows={1}
					className="max-h-40 min-h-9 resize-none"
					aria-label="Message"
				/>
				<Button type="button" onClick={send} disabled={!canSend} aria-label="Send message">
					{sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
					<span className="hidden sm:inline">Send</span>
				</Button>
			</div>
		</div>
	);
}
