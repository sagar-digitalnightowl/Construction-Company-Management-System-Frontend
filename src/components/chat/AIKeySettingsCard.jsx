/**
 * FILE: src/components/chat/AIKeySettingsCard.jsx
 * PURPOSE: Admin "AI ChatBot — API Key" card shown directly on the Settings page
 *          (/settings). Lets the admin paste the AI provider API key (Gemini / OpenAI /
 *          OpenRouter / Groq / Custom), pick the model, enable/disable AI replies, test
 *          the connection and save — without opening any separate page or dialog.
 * UPDATED: Created for the "admin dashboard me hi API key field" requirement.
 *          Key is stored AES-256-GCM encrypted server-side; only a masked preview
 *          (last 4 chars) is ever returned. No key → bot answers with the built-in
 *          rules engine automatically.
 */

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, PlugZap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import { aiChatApi } from "@/api";

const PROVIDERS = [
        { value: "gemini", label: "Google Gemini", hint: "Free tier available — aistudio.google.com se key milegi" },
        { value: "openai", label: "OpenAI (ChatGPT)", hint: "platform.openai.com se key milegi" },
        { value: "openrouter", label: "OpenRouter", hint: "Ek key, 100+ models — openrouter.ai" },
        { value: "groq", label: "Groq (fast + free)", hint: "console.groq.com se key milegi" },
        { value: "custom", label: "Custom (OpenAI-compatible)", hint: "Apna base URL do (e.g. Ollama, vLLM)" },
];

const PLACEHOLDER_MODELS = {
        gemini: "gemini-2.0-flash",
        openai: "gpt-4o-mini",
        openrouter: "openrouter/auto",
        groq: "llama-3.3-70b-versatile",
        custom: "model-id",
};

export function AIKeySettingsCard() {
        const [meta, setMeta] = useState(null); // masked settings from GET /settings
        const [status, setStatus] = useState(null); // live mode badge from GET /status
        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [testing, setTesting] = useState(false);
        const [showKey, setShowKey] = useState(false);
        const [apiKeyInput, setApiKeyInput] = useState("");

        const [provider, setProvider] = useState("gemini");
        const [model, setModel] = useState("");
        const [enabled, setEnabled] = useState(true);

        const loadAll = async () => {
                setLoading(true);
                try {
                        const [settingsRes, statusRes] = await Promise.all([
                                aiChatApi.getSettings(),
                                aiChatApi.getStatus(),
                        ]);
                        const d = settingsRes.data?.data || {};
                        setMeta(d);
                        setStatus(statusRes.data?.data || null);
                        setProvider(d.provider || "gemini");
                        setModel(d.model || "");
                        setEnabled(d.enabled !== false);
                } catch (err) {
                        toast.error(err?.response?.data?.message || "AI ChatBot settings load nahi hui");
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                loadAll();
        }, []);

        const buildPayload = () => {
                const payload = {
                        provider,
                        model: model?.trim(),
                        enabled,
                        apiKey: apiKeyInput.trim() || "__KEEP__",
                };
                return payload;
        };

        const handleTest = async () => {
                setTesting(true);
                try {
                        const payload = buildPayload();
                        if (meta?.keySource === "env" && !apiKeyInput.trim()) payload.apiKey = "";
                        const result = await aiChatApi.testConnection(payload);
                        if (result?.data?.success) {
                                toast.success(`Connection OK${result.data?.sampleReply ? ` — "${result.data.sampleReply}"` : ""}`);
                        } else {
                                toast.error(result?.data?.message || result?.message || "Test fail hua");
                        }
                } catch (err) {
                        toast.error(err?.response?.data?.message || "Test fail hua");
                } finally {
                        setTesting(false);
                }
        };

        const handleSave = async () => {
                if (provider === "custom" && !meta?.baseUrl) {
                        toast.error("Custom provider ke liye Settings dialog se Base URL bhi set karein");
                        return;
                }
                setSaving(true);
                try {
                        await aiChatApi.updateSettings(buildPayload());
                        setApiKeyInput("");
                        toast.success("AI ChatBot settings save ho gayi — ab bot is key se reply karega");
                        await loadAll();
                } catch (err) {
                        toast.error(err?.response?.data?.message || "Save nahi hua");
                } finally {
                        setSaving(false);
                }
        };

        const activeProvider = PROVIDERS.find((p) => p.value === provider);
        const aiLive = Boolean(status?.aiConfigured && status?.aiEnabled);

        return (
                <Card id="ai-chatbot-settings">
                        <CardHeader className="border-b border-border/40 pb-4">
                                <CardTitle className="font-display text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                                        <KeyRound className="h-4 w-4 text-primary" /> AI ChatBot — API Key &amp; Provider
                                </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                                {loading ? (
                                        <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                ) : (
                                        <>
                                                {/* ---------- current mode ---------- */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/80 bg-muted/20 px-3 py-2.5">
                                                        <div className="flex items-center gap-2">
                                                                {aiLive ? (
                                                                        <Badge className="gap-1 text-[10px] bg-primary/15 text-primary hover:bg-primary/20">
                                                                                <Sparkles className="h-3 w-3" /> AI connected · {status.provider}
                                                                        </Badge>
                                                                ) : (
                                                                        <Badge variant="secondary" className="gap-1 text-[10px]">
                                                                                <Sparkles className="h-3 w-3" /> Built-in engine mode
                                                                        </Badge>
                                                                )}
                                                                {meta?.hasKey && (
                                                                        <Badge variant="secondary" className="font-mono text-[10px]">
                                                                                saved key: {meta.apiKeyPreview}
                                                                        </Badge>
                                                                )}
                                                                {meta?.keySource === "env" && !meta?.hasKey && (
                                                                        <Badge variant="secondary" className="text-[10px]">
                                                                                .env fallback active
                                                                        </Badge>
                                                                )}
                                                        </div>
                                                        <span className="text-[11px] text-muted-foreground">
                                                                Key na ho to chatbot built-in engine se khud reply karta hai
                                                        </span>
                                                </div>

                                                {/* ---------- enable switch ---------- */}
                                                <div className="flex items-center justify-between rounded-md border border-border/80 bg-muted/20 px-3 py-2.5">
                                                        <div>
                                                                <div className="text-sm font-medium">AI replies enable</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                        Off = sirf built-in rule engine (bina API key ke bhi live DB answers)
                                                                </div>
                                                        </div>
                                                        <Switch checked={enabled} onCheckedChange={setEnabled} />
                                                </div>

                                                {/* ---------- provider ---------- */}
                                                <div className="space-y-1.5">
                                                        <Label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">AI Provider</Label>
                                                        <Select value={provider} onValueChange={setProvider}>
                                                                <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Provider chunein" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        {PROVIDERS.map((p) => (
                                                                                <SelectItem key={p.value} value={p.value}>
                                                                                        {p.label}
                                                                                </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                        </Select>
                                                        {activeProvider?.hint && <p className="text-xs text-muted-foreground">{activeProvider.hint}</p>}
                                                </div>

                                                {/* ---------- api key + model ---------- */}
                                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                        <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">API Key</Label>
                                                                <div className="relative">
                                                                        <Input
                                                                                type={showKey ? "text" : "password"}
                                                                                placeholder={meta?.hasKey ? "Nayi key daalein (blank = purani rakhein)" : "Paste API key here…"}
                                                                                value={apiKeyInput}
                                                                                onChange={(e) => setApiKeyInput(e.target.value)}
                                                                                className="pr-10 font-mono text-sm"
                                                                                autoComplete="off"
                                                                        />
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => setShowKey((s) => !s)}
                                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                                                tabIndex={-1}
                                                                        >
                                                                                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                        </button>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">
                                                                        Encrypted (AES-256-GCM) store hoti hai — dobara kabhi nahi dikhegi.
                                                                </p>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">Model</Label>
                                                                <Input
                                                                        placeholder={PLACEHOLDER_MODELS[provider] || "model-id"}
                                                                        value={model}
                                                                        onChange={(e) => setModel(e.target.value)}
                                                                        className="font-mono text-sm"
                                                                />
                                                                <p className="text-xs text-muted-foreground">Blank = provider default model</p>
                                                        </div>
                                                </div>

                                                {/* ---------- actions ---------- */}
                                                <div className="flex items-center gap-2 pt-1">
                                                        <Button onClick={handleSave} disabled={saving}>
                                                                {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                                                                Save Settings
                                                        </Button>
                                                        <Button variant="outline" onClick={handleTest} disabled={testing}>
                                                                {testing ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <PlugZap className="h-4 w-4 mr-1.5" />}
                                                                Test Connection
                                                        </Button>
                                                </div>
                                        </>
                                )}
                        </CardContent>
                </Card>
        );
}
