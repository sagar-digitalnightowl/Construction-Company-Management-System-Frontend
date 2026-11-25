/**
 * FILE: src/components/chat/ChatMessage.jsx
 * PURPOSE: Chat message bubble for the AI ChatBot — user vs assistant styling,
 *          lightweight markdown rendering (bold, bullets, headings, ---) without any
 *          extra dependency, copy button and "rules engine / AI" source badge.
 */

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { Bot, User, Copy, Check, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/helpers";

/** Markdown for chat answers (react-markdown). Single line breaks are kept, as the guide asks. */
const markdownComponents = {
	p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
	strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
	em: ({ children }) => <em className="opacity-80">{children}</em>,
	ul: ({ children }) => <ul className="mb-2 space-y-1 pl-4 last:mb-0 list-disc">{children}</ul>,
	ol: ({ children }) => <ol className="mb-2 space-y-1 pl-5 last:mb-0 list-decimal">{children}</ol>,
	li: ({ children }) => <li className="text-sm">{children}</li>,
	hr: () => <hr className="my-2 border-border/60" />,
	code: ({ children }) => <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
};

function MarkdownLite({ content }) {
	return (
		<div className="text-sm leading-relaxed">
			<ReactMarkdown remarkPlugins={[remarkBreaks]} components={markdownComponents}>
				{(content || "").replace(/^(\s*)•\s+/gm, "$1- ")}
			</ReactMarkdown>
		</div>
	);
}

/** Multi-question answers come back separated by "---": each part is its own block, with a divider above it. */
export function AnswerBlocks({ content }) {
	const blocks = (content || "").split(/\n\n---\n\n/);
	return (
		<div className="space-y-0">
			{blocks.map((block, i) => (
				<div key={i} data-testid="answer-block" className={i > 0 ? "mt-4 border-t border-border/60 pt-4" : ""}>
					<MarkdownLite content={block} />
				</div>
			))}
		</div>
	);
}

/** Follow-up questions returned with this answer; clicking one sends it as the next message. */
function AnswerSuggestions({ suggestions, onSuggest }) {
	if (!suggestions?.length || !onSuggest) return null;
	return (
		<div className="mt-2.5 flex flex-wrap gap-1.5">
			{suggestions.map((text, i) => (
				<button
					key={`${i}-${text}`}
					onClick={() => onSuggest(text)}
					className="rounded-full border border-border/80 bg-card px-2.5 py-1 text-[11px] chat-interactive hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
				>
					{text}
				</button>
			))}
		</div>
	);
}

/** "AI" only when the answer came from the AI provider and no fallback happened; everything else is the built-in engine. */
export function isAiAnswer(message) {
	return message.source === "ai" && !message.aiFallback;
}

export function ChatMessage({ message, onSuggest, onRetry }) {
	const isUser = message.role === "user";
	const isError = message.source === "error";
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(message.content);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// clipboard unavailable
		}
	};

	const time = message.createdAt
		? new Date(message.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
		: "";

	return (
		<div className={cn("chat-message-in flex w-full gap-2.5 group", isUser ? "justify-end" : "justify-start")}>
			{!isUser && (
				<div
					className={cn(
						"mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full",
						isError ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary",
					)}
				>
					<Bot className="h-4 w-4" />
				</div>
			)}

			<div className={cn("flex max-w-[82%] flex-col gap-1", isUser && "items-end")}>
				<div
					className={cn(
						"relative rounded-2xl px-4 py-2.5 text-sm shadow-sm",
						isUser
							? "rounded-br-md bg-primary text-primary-foreground"
							: isError
								? "rounded-bl-md border border-destructive/30 bg-destructive/5 text-destructive"
								: "rounded-bl-md border border-border/80 bg-card text-card-foreground",
					)}
				>
					{isUser ? <MarkdownLite content={message.content} /> : <AnswerBlocks content={message.content} />}
					{!isUser && !isError && <AnswerSuggestions suggestions={message.suggestions} onSuggest={onSuggest} />}
					{isError && message.retryText && onRetry && (
						<button
							type="button"
							onClick={() => onRetry(message)}
							className="mt-2 rounded-full border border-destructive/40 px-2.5 py-1 text-[11px] font-medium text-destructive chat-interactive hover:bg-destructive/10"
						>
							Retry
						</button>
					)}
				</div>

				<div className={cn("flex items-center gap-2 px-1 text-[10px] text-muted-foreground", isUser && "flex-row-reverse")}>
					<span>{time}</span>
					{!isUser && !isError && (isAiAnswer(message) ? (
						<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
							<Cpu className="h-2.5 w-2.5" /> AI {message.model ? `· ${message.model}` : ""}
						</span>
					) : (
						<span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 font-medium">
							<Zap className="h-2.5 w-2.5" /> Built-in engine
						</span>
					))}
					{!isUser && (
						<button
							onClick={handleCopy}
							className="opacity-0 chat-interactive group-hover:opacity-100 inline-flex items-center gap-1 hover:text-foreground"
							title="Copy"
						>
							{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
						</button>
					)}
					{isUser && <User className="h-2.5 w-2.5 opacity-60" />}
				</div>
			</div>
		</div>
	);
}

export function TypingBubble() {
	return (
		<div className="chat-message-in flex w-full gap-2.5 justify-start">
			<div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
				<Bot className="h-4 w-4" />
			</div>
			<div className="rounded-2xl rounded-bl-md border border-border/80 bg-card px-4 py-3 shadow-sm">
				<div className="flex gap-1">
					{[0, 150, 300].map((delay) => (
						<span
							key={delay}
							className="h-1.5 w-1.5 chat-dot rounded-full bg-muted-foreground/60"
							style={{ animationDelay: `${delay}ms` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
