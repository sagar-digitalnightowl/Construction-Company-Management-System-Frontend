import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useIncentive } from "@/hooks/useIncentive";
import { useAuthStore } from "@/store/authStore";
import { canMutate } from "@/data/permissions";

// Normal rates are % of the paid (GST-exclusive) amount, e.g. 0.8 = 0.80%
const NORMAL_RATES = [
	{ key: "normalBmRate", label: "Business Manager (BM)" },
	{ key: "normalTmRate", label: "Team Manager (TM)" },
	{ key: "normalPmRate", label: "Project Manager (PM)" },
];

// Extra work rates are % of the extra work amount, e.g. 80 = 80%
const EXTRA_WORK_RATES = [
	{ key: "extraWorkBmRate", label: "Business Manager (BM)" },
	{ key: "extraWorkTmRate", label: "Team Manager (TM)" },
	{ key: "extraWorkPmRate", label: "Project Manager (PM)" },
];

const NUMERIC_KEYS = [
	...NORMAL_RATES.map((f) => f.key),
	...EXTRA_WORK_RATES.map((f) => f.key),
	"pre2020PmRate",
];

const ROUNDING_OPTIONS = [{ value: "nearest_rupee", label: "Nearest rupee" }];
const roundingLabel = (v) => ROUNDING_OPTIONS.find((o) => o.value === v)?.label || v || "—";

// Flat form – one object for the whole modal
const toForm = (c) => ({
	normalBmRate: String(c?.normalBmRate ?? ""),
	normalTmRate: String(c?.normalTmRate ?? ""),
	normalPmRate: String(c?.normalPmRate ?? ""),
	extraWorkBmRate: String(c?.extraWorkBmRate ?? ""),
	extraWorkTmRate: String(c?.extraWorkTmRate ?? ""),
	extraWorkPmRate: String(c?.extraWorkPmRate ?? ""),
	pre2020PmRate: String(c?.pre2020PmRate ?? ""),
	pre2020RuleEnabled: Boolean(c?.pre2020RuleEnabled),
	extraWorkEnabled: Boolean(c?.extraWorkEnabled),
	roundingMode: c?.roundingMode || "nearest_rupee",
});

const formatRate = (v) => (v === undefined || v === null ? "—" : `${v}%`);

function Field({ label, hint, children }) {
	return (
		<div className="space-y-1.5">
			<Label className="text-sm">{label}</Label>
			{children}
			{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
		</div>
	);
}

function ReadItem({ label, children }) {
	return (
		<div>
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className="text-lg font-semibold mt-0.5">{children}</div>
		</div>
	);
}

function EnabledBadge({ enabled }) {
	return (
		<Badge
			variant="secondary"
			className={enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}
		>
			{enabled ? "Enabled" : "Disabled"}
		</Badge>
	);
}

export default function IncentiveConfig() {
	const { current } = useAuthStore();
	const canEdit = canMutate(current?.role, "incentive-config");

	const { config, loading, fetchConfig, updateConfig } = useIncentive();
	const [form, setForm] = useState(toForm(null));
	const [editOpen, setEditOpen] = useState(false);

	// Route-mounted page with no props, so it loads its own config once
	useEffect(() => {
		fetchConfig();
	}, []);

	// ─── Handlers ───
	const handleFormChange = (patch) => setForm((prev) => ({ ...prev, ...patch }));

	const openEdit = () => {
		setForm(toForm(config));
		setEditOpen(true);
	};

	const closeEdit = () => setEditOpen(false);

	// Only fields that differ from the saved config are sent
	const buildPayload = () => {
		const payload = {};
		for (const key of NUMERIC_KEYS) {
			if (Number(form[key]) !== Number(config?.[key])) payload[key] = Number(form[key]);
		}
		for (const key of ["pre2020RuleEnabled", "extraWorkEnabled", "roundingMode"]) {
			if (form[key] !== config?.[key]) payload[key] = form[key];
		}
		return payload;
	};

	const validate = () => {
		for (const key of NUMERIC_KEYS) {
			const v = form[key];
			if (v === "" || Number.isNaN(Number(v)) || Number(v) < 0 || Number(v) > 100) {
				return "Rates must be between 0 and 100";
			}
		}
		return null;
	};

	const handleSave = async () => {
		const error = validate();
		if (error) return toast.error(error);

		const payload = buildPayload();
		if (Object.keys(payload).length === 0) return toast.info("No changes to save");

		const result = await updateConfig(payload);
		if (result) closeEdit();
	};

	const dirty = config ? Object.keys(buildPayload()).length > 0 : false;

	const roundingOptions = ROUNDING_OPTIONS.some((o) => o.value === form.roundingMode)
		? ROUNDING_OPTIONS
		: [...ROUNDING_OPTIONS, { value: form.roundingMode, label: form.roundingMode }];

	const rateInput = (key) => (
		<div className="relative">
			<Input
				type="number"
				min={0}
				max={100}
				step="any"
				className="pr-8"
				value={form[key]}
				onChange={(e) => handleFormChange({ [key]: e.target.value })}
			/>
			<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
		</div>
	);

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Administration"
				title="Incentive Configuration"
				description="Rates used to calculate BM, TM and PM incentives. Changes apply to new calculations."
			/>

			<div className="flex items-center justify-between gap-3">
				<span className="text-sm text-muted-foreground">
					{config?.updatedAt
						? `Last updated ${new Date(config.updatedAt).toLocaleString("en-IN", {
							day: "2-digit",
							month: "short",
							year: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}`
						: loading
							? "Loading configuration…"
							: ""}
				</span>
				{canEdit && (
					<Button size="sm" disabled={!config || loading} onClick={openEdit}>
						<Pencil className="h-4 w-4 mr-1" /> Edit configuration
					</Button>
				)}
			</div>

			{/* ─── Read-only view ─── */}
			<div className="grid lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader className="border-b border-border/40 pb-4">
						<CardTitle className="text-sm uppercase tracking-wider">Normal Rates</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-4">
						<p className="text-xs text-muted-foreground">
							Applied to bookings and installment payments, on the GST-exclusive paid amount.
						</p>
						<div className="grid grid-cols-3 gap-4">
							{NORMAL_RATES.map((f) => (
								<ReadItem key={f.key} label={f.label}>{formatRate(config?.[f.key])}</ReadItem>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="border-b border-border/40 pb-4">
						<CardTitle className="text-sm uppercase tracking-wider">Extra Work Rates</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-4">
						<div className="flex items-center gap-2 text-sm">
							<span className="text-muted-foreground">Status</span>
							<EnabledBadge enabled={Boolean(config?.extraWorkEnabled)} />
						</div>
						<div className="grid grid-cols-3 gap-4">
							{EXTRA_WORK_RATES.map((f) => (
								<ReadItem key={f.key} label={f.label}>{formatRate(config?.[f.key])}</ReadItem>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="border-b border-border/40 pb-4">
						<CardTitle className="text-sm uppercase tracking-wider">Pre-2020 Rule</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-4">
						<div className="flex items-center gap-2 text-sm">
							<span className="text-muted-foreground">Bookings before 01-01-2020</span>
							<EnabledBadge enabled={Boolean(config?.pre2020RuleEnabled)} />
						</div>
						<ReadItem label="PM rate (pre-2020)">{formatRate(config?.pre2020PmRate)}</ReadItem>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="border-b border-border/40 pb-4">
						<CardTitle className="text-sm uppercase tracking-wider">Rounding</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<ReadItem label="Rounding mode">{roundingLabel(config?.roundingMode)}</ReadItem>
					</CardContent>
				</Card>
			</div>

			{/* ─── Edit modal ─── */}
			<Dialog open={editOpen} onOpenChange={(open) => !open && closeEdit()}>
				<DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] flex flex-col">
					<DialogHeader>
						<DialogTitle>Edit incentive configuration</DialogTitle>
						<DialogDescription>
							Only the fields you change are saved. New rates apply to new calculations.
						</DialogDescription>
					</DialogHeader>

					<div className="flex-1 min-h-0 overflow-y-auto space-y-6 px-1">
						<section className="space-y-3">
							<h4 className="text-sm font-semibold uppercase tracking-wider">Normal rates</h4>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								{NORMAL_RATES.map((f) => (
									<Field key={f.key} label={f.label}>{rateInput(f.key)}</Field>
								))}
							</div>
						</section>

						<section className="space-y-3">
							<h4 className="text-sm font-semibold uppercase tracking-wider">Extra work rates</h4>
							<div className="flex items-center gap-2">
								<Checkbox
									id="extra-work-enabled"
									checked={form.extraWorkEnabled}
									onCheckedChange={(checked) => handleFormChange({ extraWorkEnabled: checked === true })}
								/>
								<Label htmlFor="extra-work-enabled" className="cursor-pointer text-sm">
									Enable extra work incentives
								</Label>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								{EXTRA_WORK_RATES.map((f) => (
									<Field key={f.key} label={f.label}>{rateInput(f.key)}</Field>
								))}
							</div>
						</section>

						<section className="space-y-3">
							<h4 className="text-sm font-semibold uppercase tracking-wider">Pre-2020 rule</h4>
							<div className="flex items-center gap-2">
								<Checkbox
									id="pre-2020-enabled"
									checked={form.pre2020RuleEnabled}
									onCheckedChange={(checked) => handleFormChange({ pre2020RuleEnabled: checked === true })}
								/>
								<Label htmlFor="pre-2020-enabled" className="cursor-pointer text-sm">
									Apply special PM rate to bookings before 01-01-2020
								</Label>
							</div>
							<div className="max-w-[200px]">
								<Field label="PM rate (pre-2020)" hint="0 means no automatic PM incentive.">
									{rateInput("pre2020PmRate")}
								</Field>
							</div>
						</section>

						<section className="space-y-3">
							<h4 className="text-sm font-semibold uppercase tracking-wider">Rounding</h4>
							<div className="max-w-[240px]">
								<Field label="Rounding mode">
									<Select value={form.roundingMode} onValueChange={(v) => handleFormChange({ roundingMode: v })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{roundingOptions.map((o) => (
												<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							</div>
						</section>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={closeEdit}>Cancel</Button>
						<Button onClick={handleSave} disabled={!dirty || loading}>
							{loading ? "Saving…" : "Save changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}