/**
 * FILE: src/components/chat/AISettingsDialog.jsx
 * PURPOSE: Admin dialog to configure the AI ChatBot — provider (Gemini/OpenAI/OpenRouter/
 *          Groq/Custom), API key (stored encrypted server-side), model, base URL, system
 *          prompt, temperature, max tokens, enabled switch + "Test Connection" button.
 */

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, PlugZap } from "lucide-react";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";

const PROVIDERS = [
        { value: "gemini", label: "Google Gemini", hint: "Free tier available · aistudio.google.com se key milegi" },
        { value: "openai", label: "OpenAI (ChatGPT)", hint: "platform.openai.com se key milegi" },
        { value: "openrouter", label: "OpenRouter", hint: "Ek key, 100+ models · openrouter.ai" },
        { value: "groq", label: "Groq (fast + free)", hint: "console.groq.com se key milegi" },
        { value: "custom", label: "Custom (OpenAI-compatible)", hint: "Apna base URL do (e.g. Ollama, vLLM)" },
];

const EMPTY_FORM = {
        provider: "gemini",
        apiKeyInput: "",
        baseUrl: "",
        model: "",
        systemPrompt: "",
        temperature: 0.4,
        maxTokens: 1024,
        enabled: true,
};

export function AISettingsDialog({ open, onOpenChange, fetchSettings, saveSettings, testConnection, onSaved }) {
        const [form, setForm] = useState(EMPTY_FORM);
        const [meta, setMeta] = useState(null); // { hasKey, apiKeyPreview, keySource, provider, model, ... }
        const [loading, setLoading] = useState(false);
        const [saving, setSaving] = useState(false);
        const [testing, setTesting] = useState(false);
        const [showKey, setShowKey] = useState(false);

        useEffect(() => {
                if (!open) return;
                setLoading(true);
                setShowKey(false);
                fetchSettings()
                        .then((data) => {
                                if (!data) return;
                                setMeta(data);
                                setForm({
                                        provider: data.provider || "gemini",
                                        apiKeyInput: "",
                                        baseUrl: data.baseUrl || "",
                                        model: data.model || "",
                                        systemPrompt: data.systemPrompt || "",
                                        temperature: data.temperature ?? 0.4,
                                        maxTokens: data.maxTokens ?? 1024,
                                        enabled: data.enabled !== false,
                                });
                        })
                        .catch((err) => toast.error(err?.response?.data?.message || "Settings load nahi hui"))
                        .finally(() => setLoading(false));
        }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

        const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

        const buildPayload = (includeKey) => {
                const payload = {
                        provider: form.provider,
                        baseUrl: form.baseUrl?.trim(),
                        model: form.model?.trim(),
                        systemPrompt: form.systemPrompt,
                        temperature: Number(form.temperature),
                        maxTokens: Number(form.maxTokens),
                        enabled: form.enabled,
                };
                if (includeKey) {
                        payload.apiKey = form.apiKeyInput.trim() || "__KEEP__";
                }
                return payload;
        };

        const handleTest = async () => {
                setTesting(true);
                try {
                        const payload = buildPayload(true);
                        if (meta?.keySource === "env" && !form.apiKeyInput.trim()) {
                                payload.apiKey = ""; // resolve from env server-side
                        }
                        const result = await testConnection(payload);
                        if (result?.success) {
                                toast.success(`Connection OK${result.data?.sampleReply ? ` — "${result.data.sampleReply}"` : ""}`);
                        } else {
                                toast.error(result?.message || "Test fail hua");
                        }
                } catch (err) {
                        toast.error(err?.response?.data?.message || "Test fail hua");
                } finally {
                        setTesting(false);
                }
        };

        const handleSave = async () => {
                if (form.provider === "custom" && !form.baseUrl?.trim()) {
                        toast.error("Custom provider ke liye Base URL zaroori hai");
                        return;
                }
                setSaving(true);
                try {
                        const payload = buildPayload(true);
                        // nothing typed and key exists in DB/env → keep whatever is configured
                        if (!form.apiKeyInput.trim() && (meta?.hasKey || meta?.keySource === "env")) {
                                payload.apiKey = "__KEEP__";
                        }
                        await saveSettings(payload);
                        toast.success("AI ChatBot settings save ho gayi");
                        onOpenChange(false);
                        onSaved?.();
                } catch (err) {
                        toast.error(err?.response?.data?.message || "Save nahi hua");
                } finally {
                        setSaving(false);
                }
        };

        const activeProvider = PROVIDERS.find((p) => p.value === form.provider);

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 font-display">
                                                <KeyRound className="h-4 w-4 text-primary" /> AI ChatBot Settings
                                        </DialogTitle>
                                        <DialogDescription>
                                                API key encrypted (AES-256-GCM) store hoti hai — dobara kabhi nahi dikhegi. Key na ho to bot
                                                built-in rule engine se hi kaam karega.
                                        </DialogDescription>
                                </DialogHeader>

                                {loading ? (
                                        <div className="flex items-center justify-center py-10">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                ) : (
                                        <div className="space-y-4 py-2">
                                                {/* ---------- enabled ---------- */}
                                                <div className="flex items-center justify-between rounded-md border border-border/80 bg-muted/20 px-3 py-2.5">
                                                        <div>
                                                                <div className="text-sm font-medium">AI replies enable</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                        Off = sirf built-in rule engine (bina API key ke bhi DB answers)
                                                                </div>
                                                        </div>
                                                        <Switch checked={form.enabled} onCheckedChange={(v) => set("enabled", v)} />
                                                </div>

                                                {/* ---------- provider ---------- */}
                                                <div className="space-y-1.5">
                                                        <Label>AI Provider</Label>
                                                        <Select value={form.provider} onValueChange={(v) => set("provider", v)}>
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

                                                {/* ---------- api key ---------- */}
                                                <div className="space-y-1.5">
                                                        <div className="flex items-center justify-between">
                                                                <Label>API Key</Label>
                                                                {meta?.hasKey && (
                                                                        <Badge variant="secondary" className="font-mono text-[10px]">
                                                                                saved: {meta.apiKeyPreview}
                                                                        </Badge>
                                                                )}
                                                                {meta?.keySource === "env" && !meta?.hasKey && (
                                                                        <Badge variant="secondary" className="text-[10px]">
                                                                                .env fallback active
                                                                        </Badge>
                                                                )}
                                                        </div>
                                                        <div className="relative">
                                                                <Input
                                                                        type={showKey ? "text" : "password"}
                                                                        placeholder={meta?.hasKey ? "Nayi key daalein (blank = purani rakhein)" : "Paste API key here…"}
                                                                        value={form.apiKeyInput}
                                                                        onChange={(e) => set("apiKeyInput", e.target.value)}
                                                                        className="pr-10 font-mono text-sm"
                                                                        autoComplete="off"
                                                                />
                                                                <button
                                                                        type="button"
                                                                        onClick={() => setShowKey((s) => !s)}
                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                                >
                                                                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </button>
                                                        </div>
                                                        {meta?.keySource === "env" && (
                                                                <p className="text-xs text-amber-600">
                                                                        Abhi .env se key use ho rahi hai — yahan se save karne par wo DB me encrypt ho jayegi.
                                                                </p>
                                                        )}
                                                </div>

                                                {/* ---------- model + base url ---------- */}
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        <div className="space-y-1.5">
                                                                <Label>Model</Label>
                                                                <Input
                                                                        placeholder={
                                                                                form.provider === "gemini"
                                                                                        ? "gemini-2.0-flash"
                                                                                        : form.provider === "openai"
                                                                                                ? "gpt-4o-mini"
                                                                                                : form.provider === "groq"
                                                                                                        ? "llama-3.3-70b-versatile"
                                                                                                        : "model-id"
                                                                        }
                                                                        value={form.model}
                                                                        onChange={(e) => set("model", e.target.value)}
                                                                        className="font-mono text-sm"
                                                                />
                                                                <p className="text-xs text-muted-foreground">Blank = provider default</p>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                                <Label>Base URL {form.provider === "custom" && <span className="text-destructive">*</span>}</Label>
                                                                <Input
                                                                        placeholder="https://api.example.com/v1"
                                                                        value={form.baseUrl}
                                                                        onChange={(e) => set("baseUrl", e.target.value)}
                                                                        className="font-mono text-sm"
                                                                />
                                                                <p className="text-xs text-muted-foreground">Blank = provider default URL</p>
                                                        </div>
                                                </div>

                                                {/* ---------- temperature + max tokens ---------- */}
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                        <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                        <Label>Creativity (temperature)</Label>
                                                                        <span className="text-xs font-mono text-muted-foreground">{Number(form.temperature).toFixed(1)}</span>
                                                                </div>
                                                                <Slider
                                                                        min={0}
                                                                        max={1.5}
                                                                        step={0.1}
                                                                        value={[Number(form.temperature)]}
                                                                        onValueChange={([v]) => set("temperature", v)}
                                                                />
                                                                <p className="text-xs text-muted-foreground">Kam = accurate data answers, zyada = creative</p>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                                <Label>Max response tokens</Label>
                                                                <Input
                                                                        type="number"
                                                                        min={64}
                                                                        max={8192}
                                                                        value={form.maxTokens}
                                                                        onChange={(e) => set("maxTokens", Number(e.target.value))}
                                                                        className="font-mono text-sm"
                                                                />
                                                        </div>
                                                </div>

                                                {/* ---------- system prompt ---------- */}
                                                <div className="space-y-1.5">
                                                        <Label>Custom System Prompt (optional)</Label>
                                                        <Textarea
                                                                rows={4}
                                                                placeholder="Blank = built-in Nirman AI prompt jo live DB data use karta hai"
                                                                value={form.systemPrompt}
                                                                onChange={(e) => set("systemPrompt", e.target.value)}
                                                                className="text-sm"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                                Advanced: yahan bot ki personality aur rules customize kar sakte hain. Live DB context har
                                                                message ke saath automatically inject hota hai.
                                                        </p>
                                                </div>
                                        </div>
                                )}

                                <DialogFooter className="gap-2 sm:gap-0">
                                        <Button variant="outline" onClick={handleTest} disabled={testing || loading}>
                                                {testing ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <PlugZap className="h-4 w-4 mr-1.5" />}
                                                Test Connection
                                        </Button>
                                        <Button onClick={handleSave} disabled={saving || loading}>
                                                {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                                                Save Settings
                                        </Button>
                                </DialogFooter>
                        </DialogContent>
                </Dialog>
        );
}
