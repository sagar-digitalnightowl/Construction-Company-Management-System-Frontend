import { CheckCheck, CornerUpLeft, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/helpers";
import {
	attachmentName,
	attachmentUrl,
	isImageAttachment,
	messagePreview,
	DELETED_TEXT,
} from "@/lib/chatHelpers";
import { bubbleTime } from "@/lib/chatUi";

const ACTION_BUTTON = "flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

function Attachments({ attachments, mine }) {
	return attachments.map((attachment, index) => {
		const url = attachmentUrl(attachment);
		const key = attachment?._id || index;
		if (!url) {
			return (
				<div key={key} className="mt-1 text-xs opacity-80">
					Attachment unavailable
				</div>
			);
		}
		if (isImageAttachment(attachment)) {
			return (
				<a key={key} href={url} target="_blank" rel="noreferrer" className="mt-1 block overflow-hidden rounded-xl">
					<img src={url} alt={attachmentName(attachment)} loading="lazy" className="max-h-72 w-full object-cover" />
				</a>
			);
		}
		return (
			<a
				key={key}
				href={url}
				target="_blank"
				rel="noreferrer"
				className={cn(
					"mt-1 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs hover:underline",
					mine ? "border-primary-foreground/30" : "border-border",
				)}
			>
				<FileText className="size-4 shrink-0" />
				<span className="truncate">{attachmentName(attachment)}</span>
			</a>
		);
	});
}

// One message bubble. `first` and `last` say where it sits in a group of messages from the same sender,
// so only the last bubble of a group shows its time and its tail.
export function MessageBubble({ message, mine, first, last, seen, quoted, canDelete, onReply, onDelete }) {
	const deleted = !!message.isDeleted;
	const attachments = Array.isArray(message.attachments) ? message.attachments : [];

	return (
		<div className={cn("group flex", mine ? "justify-end" : "justify-start", first ? "mt-3" : "mt-0.5")}>
			<div className={cn("relative flex max-w-[80%] flex-col md:max-w-[65%]", mine ? "items-end" : "items-start")}>
				<div
					className={cn(
						"rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
						mine ? "bg-primary text-primary-foreground" : "border bg-card text-card-foreground",
						mine && last && "rounded-br-md",
						!mine && last && "rounded-bl-md",
						deleted && "border border-dashed bg-transparent shadow-none italic text-muted-foreground",
					)}
				>
					{quoted && !deleted && (
						<div
							className={cn(
								"mb-1.5 rounded-md border-l-2 px-2 py-1 text-xs",
								mine ? "border-primary-foreground/60 bg-primary-foreground/10" : "border-primary/60 bg-muted",
							)}
						>
							{messagePreview(quoted)}
						</div>
					)}

					{deleted ? (
						<span>{DELETED_TEXT}</span>
					) : (
						<>
							{message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
							<Attachments attachments={attachments} mine={mine} />
						</>
					)}
				</div>

				{last && (
					<div className={cn("mt-1 flex items-center gap-1 px-1 text-[11px] text-muted-foreground", mine && "flex-row-reverse")}>
						<span>{bubbleTime(message.createdAt)}</span>
						{mine && !deleted && (
							<span className={cn("flex items-center gap-0.5", seen && "text-sky-600 dark:text-sky-400")}>
								{seen && <CheckCheck className="size-3.5" />}
								{seen ? "Seen" : "Sent"}
							</span>
						)}
					</div>
				)}

				{!deleted && (
					<div
						className={cn(
							"absolute top-0 hidden items-center gap-0.5 rounded-full border bg-card p-0.5 shadow-md group-hover:flex group-focus-within:flex",
							mine ? "right-full mr-2" : "left-full ml-2",
						)}
					>
						<button type="button" className={ACTION_BUTTON} onClick={() => onReply(message)} aria-label="Reply" title="Reply">
							<CornerUpLeft className="size-3.5" />
						</button>
						{canDelete && (
							<button
								type="button"
								className={cn(ACTION_BUTTON, "hover:text-destructive")}
								onClick={() => onDelete(message)}
								aria-label="Delete message"
								title="Delete"
							>
								<Trash2 className="size-3.5" />
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
