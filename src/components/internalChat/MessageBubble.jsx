import { CornerUpLeft, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";
import {
	attachmentName,
	attachmentUrl,
	formatChatTime,
	isImageAttachment,
	messagePreview,
	DELETED_TEXT,
} from "@/lib/chatHelpers";

export function MessageBubble({ message, mine, seen, quoted, canDelete, onReply, onDelete }) {
	const deleted = !!message.isDeleted;
	const attachments = Array.isArray(message.attachments) ? message.attachments : [];

	return (
		<div className={cn("group flex", mine ? "justify-end" : "justify-start")}>
			<div className={cn("max-w-[78%] space-y-1", mine ? "items-end" : "items-start")}>
				<div
					className={cn(
						"rounded-2xl px-3 py-2 text-sm shadow-sm",
						mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm",
						deleted && "italic opacity-70",
					)}
				>
					{quoted && !deleted && (
						<div
							className={cn(
								"mb-1 rounded-md border-l-2 px-2 py-1 text-xs",
								mine ? "border-primary-foreground/60 bg-primary-foreground/10" : "border-foreground/30 bg-background/60",
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
							{attachments.map((attachment, index) => {
								const url = attachmentUrl(attachment);
								if (!url) {
									return (
										<div key={attachment?._id || index} className="mt-1 text-xs opacity-80">
											Attachment
										</div>
									);
								}
								if (isImageAttachment(attachment)) {
									return (
										<a key={attachment._id || index} href={url} target="_blank" rel="noreferrer" className="mt-1 block">
											<img src={url} alt={attachmentName(attachment)} className="max-h-60 rounded-md object-cover" />
										</a>
									);
								}
								return (
									<a
										key={attachment._id || index}
										href={url}
										target="_blank"
										rel="noreferrer"
										className="mt-1 flex items-center gap-2 rounded-md border px-2 py-1 text-xs underline-offset-2 hover:underline"
									>
										<FileText className="size-4 shrink-0" />
										<span className="truncate">{attachmentName(attachment)}</span>
									</a>
								);
							})}
						</>
					)}
				</div>

				<div className={cn("flex items-center gap-2 px-1 text-[11px] text-muted-foreground", mine && "flex-row-reverse")}>
					<span>{formatChatTime(message.createdAt)}</span>
					{mine && !deleted && <span>{seen ? "Seen" : "Sent"}</span>}
					{!deleted && (
						<Button
							variant="ghost"
							size="xs"
							className="h-5 px-1 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
							onClick={() => onReply(message)}
							aria-label="Reply"
						>
							<CornerUpLeft className="size-3" /> Reply
						</Button>
					)}
					{canDelete && (
						<Button
							variant="ghost"
							size="xs"
							className="h-5 px-1 text-destructive opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
							onClick={() => onDelete(message)}
							aria-label="Delete message"
						>
							<Trash2 className="size-3" /> Delete
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
