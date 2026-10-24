/**
 * FILE: src/components/chat/ChatMessage.jsx
 * PURPOSE: Chat message bubble for the AI ChatBot — user vs assistant styling,
 *          lightweight markdown rendering (bold, bullets, headings, ---) without any
 *          extra dependency, copy button and "rules engine / AI" source badge.
 */

import React, { useState } from "react";
import { Bot, User, Copy, Check, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/helpers";

/** Tiny markdown-lite renderer: **bold**, _italic_, bullets, `code`, --- hr */
function renderInline(text) {
	const parts = [];
	const regex = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g;
	let lastIndex = 0;
	let match;
	let key = 0;
	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
		const token = match[0];
		if (token.startsWith("**")) {
			parts.push(
				<strong key={key++} className="font-semibold">
					{token.slice(2, -2)}
				</strong>,
			);
		} else if (token.startsWith("_")) {
			parts.push(
				<em key={key++} className="opacity-80">
					{token.slice(1, -1)}
				</em>,
			);
		} else if (token.startsWith("`")) {
			parts.push(
				<code key={key++} className="rounded bg-muted px-1 py-0.5 text-[0.85em] font-mono">
					{token.slice(1, -1)}
				</code>,
			);
		}
		lastIndex = match.index + token.length;
	}
	if (lastIndex < text.length) parts.push(text.slice(lastIndex));
	return parts;
}

function MarkdownLite({ content }) {
	const lines = (content || "").split("\n");
	const blocks = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			blocks.push(<div key={i} className="h-2" />);
			continue;
		}
		if (trimmed === "---") {
			blocks.push(<hr key={i} className="my-2 border-border/60" />);
			continue;
		}
		// bullets: "- ", "• ", "* "
		if (/^[-•*]\s+/.test(trimmed)) {
			const rest = trimmed.replace(/^[-•*]\s+/, "");
			blocks.push(
				<div key={i} className="flex gap-2 items-start">
					<span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
					<span className="min-w-0">{renderInline(rest)}</span>
				</div>,
			);
			continue;
		}
		// numbered
		if (/^\d+[.)]\s+/.test(trimmed)) {
			const num = trimmed.match(/^(\d+)/)[1];
			const rest = trimmed.replace(/^\d+[.)]\s+/, "");
			blocks.push(
				<div key={i} className="flex gap-2 items-start">
					<span className="shrink-0 font-semibold opacity-70">{num}.</span>
					<span className="min-w-0">{renderInline(rest)}</span>
				</div>,
			);
			continue;
		}
		blocks.push(<p key={i}>{renderInline(trimmed)}</p>);
	}

	return <div className="space-y-0.5 leading-relaxed">{blocks}</div>;
}

export function ChatMessage({ message }) {
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
		<div className={cn("flex w-full gap-2.5 group", isUser ? "justify-end" : "justify-start")}>
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
					<MarkdownLite content={message.content} />
				</div>

				<div className={cn("flex items-center gap-2 px-1 text-[10px] text-muted-foreground", isUser && "flex-row-reverse")}>
					<span>{time}</span>
					{!isUser && message.source === "rules" && !isError && (
						<span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 font-medium">
							<Zap className="h-2.5 w-2.5" /> Built-in engine
						</span>
					)}
					{!isUser && message.source === "ai" && (
						<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
							<Cpu className="h-2.5 w-2.5" /> AI {message.model ? `· ${message.model}` : ""}
						</span>
					)}
					{!isUser && (
						<button
							onClick={handleCopy}
							className="opacity-0 transition-opacity group-hover:opacity-100 inline-flex items-center gap-1 hover:text-foreground"
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
		<div className="flex w-full gap-2.5 justify-start">
			<div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
				<Bot className="h-4 w-4" />
			</div>
			<div className="rounded-2xl rounded-bl-md border border-border/80 bg-card px-4 py-3 shadow-sm">
				<div className="flex gap-1">
					{[0, 150, 300].map((delay) => (
						<span
							key={delay}
							className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
							style={{ animationDelay: `${delay}ms` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
