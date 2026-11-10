import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { CornerUpLeft, FileText, Loader2, Paperclip, Send, X } from "lucide-react";
import { toast } from "sonner";
import { chatErrorMessage, messagePreview, TYPING_STOP_DELAY_MS } from "@/lib/chatHelpers";
import { uploadChatAttachment, validateChatFile } from "@/lib/chatUploads";
import { cn } from "@/lib/helpers";

const MAX_INPUT_HEIGHT_PX = 160;

// Message input: text, file attachments, reply banner and typing notifications.
// The parent renders this with a key per conversation, so a draft never moves to another chat.
export function Composer({ disabled, replyTo, onCancelReply, onSend, onTyping }) {
	const [text, setText] = useState("");
	const [pending, setPending] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [sending, setSending] = useState(false);
	const fileInput = useRef(null);
	const input = useRef(null);
	const typingRef = useRef(false);
	const stopTimer = useRef(null);

	useEffect(() => () => clearTimeout(stopTimer.current), []);

	// Grow the field with its content, up to a limit, then let it scroll
	useLayoutEffect(() => {
		const field = input.current;
		if (!field) return;
		field.style.height = "auto";
		field.style.height = `${Math.min(field.scrollHeight, MAX_INPUT_HEIGHT_PX)}px`;
	}, [text]);

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
		if ((!content && pending.length === 0) || sending || uploading || disabled) return;
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
		// Enter sends, Shift+Enter adds a line. Enter that confirms IME text input does not send.
		if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault();
			send();
		}
	};

	const canSend = !disabled && !sending && !uploading && (text.trim() || pending.length > 0);

	return (
		<div className="border-t bg-card px-3 py-3 md:px-5">
			{replyTo && (
				<div className="mb-2 flex items-start gap-2 rounded-lg border-l-4 border-primary bg-muted px-3 py-2 text-xs">
					<CornerUpLeft className="mt-0.5 size-3.5 shrink-0 text-primary" />
					<div className="min-w-0 flex-1">
						<p className="font-medium text-primary">Replying</p>
						<p className="truncate text-muted-foreground">{messagePreview(replyTo)}</p>
					</div>
					<button
						type="button"
						onClick={onCancelReply}
						aria-label="Cancel reply"
						className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
					>
						<X className="size-4" />
					</button>
				</div>
			)}

			{pending.length > 0 && (
				<div className="mb-2 flex flex-wrap gap-2">
					{pending.map((item) => (
						<span
							key={item.attachment._id}
							className="inline-flex max-w-full items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs"
						>
							<FileText className="size-3.5 shrink-0 text-muted-foreground" />
							<span className="max-w-45 truncate">{item.name}</span>
							<button
								type="button"
								aria-label={`Remove ${item.name}`}
								onClick={() => setPending((list) => list.filter((entry) => entry !== item))}
								className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
							>
								<X className="size-3" />
							</button>
						</span>
					))}
				</div>
			)}

			<div className="flex items-end gap-2">
				<input ref={fileInput} type="file" className="hidden" onChange={handleFiles} aria-label="Attach file" />
				<button
					type="button"
					onClick={() => fileInput.current?.click()}
					disabled={disabled || uploading}
					aria-label="Attach file"
					title="Attach file (up to 25 MB)"
					className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
				>
					{uploading ? <Loader2 className="size-5 animate-spin" /> : <Paperclip className="size-5" />}
				</button>

				<textarea
					ref={input}
					value={text}
					onChange={(e) => handleChange(e.target.value)}
					onKeyDown={onKeyDown}
					onBlur={stopTyping}
					placeholder="Write a message"
					disabled={disabled}
					rows={1}
					aria-label="Message"
					className={cn(
						"min-h-10 flex-1 resize-none rounded-2xl border bg-background px-4 py-2.5 text-sm leading-5 outline-none transition-colors",
						"placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
						"disabled:opacity-50",
					)}
				/>

				<button
					type="button"
					onClick={send}
					disabled={!canSend}
					aria-label="Send message"
					title="Send (Enter)"
					className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40"
				>
					{sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
				</button>
			</div>
			<p className="mt-1.5 hidden px-1 text-[11px] text-muted-foreground md:block">
				Enter to send, Shift+Enter for a new line
			</p>
		</div>
	);
}
