/**
 * FILE: src/components/chat/ChatWidget.jsx
 * PURPOSE: Floating side-popup AI chat widget ("Nirman AI") — bubble button at the
 *          bottom-right corner of EVERY admin page; clicking it opens a popup chat
 *          panel. NO sidebar menu entry — the chatbot lives as a side popup only.
 * UPDATED: Created to replace the /ai-chatbot page (menu item removed as requested).
 *          Reuses the same backend endpoints + useAIChat hook. Mode badge shows
 *          "AI connected" vs "Built-in engine" (rules engine answers when no API key).
 *          Admins get a gear shortcut to AI Settings (API key) right inside the popup.
 */

import React, { useEffect, useRef, useState } from "react";
import { Bot, MessageSquarePlus, Send, Settings2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/helpers";
import { ChatMessage, TypingBubble } from "@/components/chat/ChatMessage";
import { AISettingsDialog } from "@/components/chat/AISettingsDialog";
import { useAIChat } from "@/hooks/useAIChat";
import { useAuthStore } from "@/store/authStore";

export function ChatWidget() {
        const {
                messages,
                sending,
                send,
                suggestions,
                startNewChat,
                status,
                statusLoading,
                fetchStatus,
                fetchSettings,
                saveSettings,
                testConnection,
        } = useAIChat();

        const { current } = useAuthStore();
        const isAdmin = ["admin", "director"].includes((current?.role || "").toLowerCase());

        const [open, setOpen] = useState(false);
        const [input, setInput] = useState("");
        const [settingsOpen, setSettingsOpen] = useState(false);

        const scrollRef = useRef(null);
        const inputRef = useRef(null);

        // auto-scroll to bottom on new messages / typing
        useEffect(() => {
                const el = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]");
                if (el) el.scrollTop = el.scrollHeight;
        }, [messages, sending, open]);

        // keep textarea auto-height
        useEffect(() => {
                const el = inputRef.current;
                if (!el) return;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
        }, [input]);

        const handleSend = () => {
                if (!input.trim() || sending) return;
                send(input);
                setInput("");
        };

        const handleKeyDown = (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                }
        };

        const aiMode = Boolean(status?.aiConfigured && status?.aiEnabled);

        return (
                <>
                        {/* ================= POPUP PANEL ================= */}
                        {open && (
                                <div
                                        className={cn(
                                                "fixed z-[45] bottom-[4.75rem] right-3 sm:right-6 flex flex-col overflow-hidden",
                                                "w-[calc(100vw-1.5rem)] sm:w-[400px]",
                                                "h-[min(560px,calc(100dvh-7.5rem))]",
                                                "rounded-2xl border border-border/70 bg-card shadow-2xl animate-rise",
                                        )}
                                        role="dialog"
                                        aria-label="Nirman AI chat"
                                >
                                        {/* header */}
                                        <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-muted/20 px-3.5 py-2.5">
                                                <div className="flex min-w-0 items-center gap-2">
                                                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                                                                <Bot className="h-4.5 w-4.5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                                <div className="truncate text-sm font-semibold font-display leading-tight">Nirman AI</div>
                                                                <div className="truncate text-[10px] text-muted-foreground leading-tight">
                                                                        {aiMode ? `Live data + ${status.provider} AI` : "Built-in engine · live DB answers"}
                                                                </div>
                                                        </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1">
                                                        {statusLoading ? null : aiMode ? (
                                                                <Badge className="gap-1 text-[10px] bg-primary/15 text-primary hover:bg-primary/20">
                                                                        <Sparkles className="h-3 w-3" /> AI
                                                                </Badge>
                                                        ) : (
                                                                <Badge variant="secondary" className="gap-1 text-[10px]">
                                                                        <Sparkles className="h-3 w-3" /> Built-in
                                                                </Badge>
                                                        )}
                                                        <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={startNewChat}
                                                                title="New chat"
                                                        >
                                                                <MessageSquarePlus className="h-4 w-4" />
                                                        </Button>
                                                        {isAdmin && (
                                                                <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        onClick={() => setSettingsOpen(true)}
                                                                        title="AI Settings (API key)"
                                                                >
                                                                        <Settings2 className="h-4 w-4" />
                                                                </Button>
                                                        )}
                                                        <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => setOpen(false)}
                                                                title="Close"
                                                        >
                                                                <X className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                        </div>

                                        {/* messages */}
                                        <ScrollArea className="flex-1" ref={scrollRef}>
                                                <div className="space-y-3.5 p-3.5">
                                                        {messages.length === 0 && !sending && (
                                                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                                                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mb-2.5">
                                                                                <Bot className="h-6 w-6" />
                                                                        </div>
                                                                        <div className="font-display text-base font-semibold">Nirman AI me swagat hai</div>
                                                                        <p className="mt-1 max-w-[20rem] text-xs text-muted-foreground">
                                                                                Flat availability, price, bookings, leads ya site stock — live data se kuch bhi poocho.
                                                                        </p>
                                                                        {suggestions.length > 0 && (
                                                                                <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-sm">
                                                                                        {suggestions.map((s) => (
                                                                                                <button
                                                                                                        key={s}
                                                                                                        onClick={() => send(s)}
                                                                                                        className="rounded-full border border-border/80 bg-card px-2.5 py-1 text-[11px] transition-colors hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
                                                                                                >
                                                                                                        {s}
                                                                                                </button>
                                                                                        ))}
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        )}

                                                        {messages.map((m) => (
                                                                <ChatMessage key={m.id} message={m} />
                                                        ))}
                                                        {sending && <TypingBubble />}
                                                </div>
                                        </ScrollArea>

                                        {/* suggestions row (when chatting) */}
                                        {messages.length > 0 && suggestions.length > 0 && !sending && (
                                                <div className="flex gap-1.5 overflow-x-auto border-t border-border/60 px-3.5 py-1.5">
                                                        {suggestions.slice(0, 3).map((s) => (
                                                                <button
                                                                        key={s}
                                                                        onClick={() => send(s)}
                                                                        className="shrink-0 rounded-full border border-border/80 px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                                                                >
                                                                        {s}
                                                                </button>
                                                        ))}
                                                </div>
                                        )}

                                        {/* input */}
                                        <div className="border-t border-border/70 p-2.5">
                                                <div className="flex items-end gap-1.5">
                                                        <Textarea
                                                                ref={inputRef}
                                                                rows={1}
                                                                placeholder="Poocho… e.g. How many 2 bhk north facing is available?"
                                                                value={input}
                                                                onChange={(e) => setInput(e.target.value)}
                                                                onKeyDown={handleKeyDown}
                                                                className="min-h-[40px] max-h-[110px] resize-none text-sm"
                                                                disabled={sending}
                                                        />
                                                        <Button
                                                                size="icon"
                                                                className="h-10 w-10 shrink-0"
                                                                onClick={handleSend}
                                                                disabled={sending || !input.trim()}
                                                        >
                                                                <Send className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                                <div className="mt-1 text-[9.5px] text-muted-foreground">
                                                        Enter = send · Shift+Enter = new line · Reply aapki question ki language me aayega
                                                </div>
                                        </div>
                                </div>
                        )}

                        {/* ================= FLOATING BUBBLE ================= */}
                        <button
                                onClick={() => setOpen((o) => !o)}
                                className={cn(
                                        "fixed z-[45] bottom-4 right-3 sm:right-6 grid h-14 w-14 place-items-center rounded-full",
                                        "bg-primary text-primary-foreground shadow-xl transition-all duration-200",
                                        "hover:scale-105 hover:shadow-2xl active:scale-95",
                                        open && "bg-muted text-foreground hover:bg-muted",
                                )}
                                title={open ? "Chat band karein" : "Nirman AI se poochein"}
                                aria-label={open ? "Close AI chat" : "Open AI chat"}
                        >
                                {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                                {!open && !statusLoading && (
                                        <span
                                                className={cn(
                                                        "absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-background",
                                                        aiMode ? "bg-emerald-500" : "bg-amber-400",
                                                )}
                                                title={aiMode ? "AI connected" : "Built-in engine mode"}
                                        />
                                )}
                        </button>

                        {/* admin AI settings dialog (API key) */}
                        <AISettingsDialog
                                open={settingsOpen}
                                onOpenChange={setSettingsOpen}
                                fetchSettings={fetchSettings}
                                saveSettings={saveSettings}
                                testConnection={testConnection}
                                onSaved={fetchStatus}
                        />
                </>
        );
}
