import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	CalendarDays,
	User,
	Phone,
	Mail,
	Briefcase,
	Layers,
	Building2,
	FileText,
	Compass
} from "lucide-react";

export default function LeadDetailsModal({ open, onOpenChange, lead }) {
	if (!lead) return null;

	// Status variant configuration mapping
	const getStatusVariant = (status) => {
		const mapping = {
			new: "secondary",
			contacted: "outline",
			interested: "default",
			negotiation: "warning",
			converted: "success",
			lost: "destructive",
			cancelled: "destructive",
		};
		return mapping[status?.toLowerCase()] || "default";
	};

	// Sub-component for consistent information data rendering blocks
	const MetaItem = ({ label, value, icon: Icon }) => (
		<div className="space-y-1 p-3 rounded-xl bg-secondary/20 border border-border/40 flex items-start gap-3">
			{Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
			<div className="min-w-0 flex-1">
				<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
					{label}
				</span>
				<span className="text-sm font-medium text-foreground block truncate">
					{value || <span className="text-muted-foreground/60 italic font-normal text-xs">Not Provided</span>}
				</span>
			</div>
		</div>
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{/* Viewport optimized modal container */}
			<DialogContent className="w-[95vw] sm:max-w-xl max-h-[85vh] flex flex-col p-4 sm:p-6 rounded-xl gap-4 overflow-hidden">

				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b shrink-0">
					<div className="space-y-1 pr-4 min-w-0">
						<DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
							{lead.clientName}
						</DialogTitle>
						<p className="text-xs text-muted-foreground font-mono">
							ID: {lead.leadId || "N/A"}
						</p>
					</div>
					<Badge
						variant={getStatusVariant(lead.status)}
						className="capitalize shrink-0 px-2.5 py-0.5 text-xs font-semibold"
					>
						{lead.status}
					</Badge>
				</DialogHeader>

				{/* Content body wrapper with isolated scrolling fields */}
				<div className="flex-1 overflow-y-auto space-y-5 pr-1 py-1 no-scrollbar">

					{/* Section 1: Core Contact Metrics */}
					<div className="space-y-2">
						<h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
							<User className="h-3 w-3" /> Contact Credentials
						</h4>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
							<MetaItem label="Phone Number" value={lead.clientPhone} icon={Phone} />
							<MetaItem label="Email Address" value={lead.clientEmail} icon={Mail} />
						</div>
					</div>

					{/* Section 2: Opportunity Details */}
					<div className="space-y-2">
						<h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
							<Briefcase className="h-3 w-3" /> Acquisition Parameters
						</h4>
						<div className="grid grid-cols-2 gap-2.5">
							<MetaItem label="Lead Source" value={lead.source} icon={Compass} />
							<MetaItem label="Interested Unit" value={lead.interestedUnit} icon={Layers} />
						</div>

						{/* Interested Project Card Block */}
						<div className="p-3.5 rounded-xl bg-secondary/30 border border-border/60 mt-2 flex items-start gap-3">
							<Building2 className="h-5 w-5 text-primary/80 mt-0.5 shrink-0" />
							<div className="space-y-0.5">
								<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
									Target Real Estate Property
								</span>
								<span className="text-sm font-semibold text-foreground block">
									{lead.interestedProject?.name || "Unassigned Project"}
								</span>
								{lead.interestedProject?.location && (
									<span className="text-xs text-muted-foreground block">
										{lead.interestedProject.location}
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Section 3: Meta Attribution Details */}
					{(lead.budgetRange || lead.campaignName || lead.referralCode) && (
						<div className="space-y-2">
							<Separator className="my-2" />
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
								{lead.budgetRange && <MetaItem label="Budget Range" value={lead.budgetRange} />}
								{lead.campaignName && <MetaItem label="Campaign Reference" value={lead.campaignName} />}
								{lead.referralCode && <MetaItem label="Referral Code" value={lead.referralCode} />}
							</div>
						</div>
					)}

					{/* Section 4: External Logs / Ownership */}
					<div className="space-y-2">
						<Separator className="my-2" />
						<h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
							<FileText className="h-3 w-3" /> Timeline Logs & Notes
						</h4>
						<div className="p-3 rounded-xl bg-muted/60 border text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
							{lead.notes || <span className="text-muted-foreground/60 italic">No notes appended to this dossier record.</span>}
						</div>
					</div>

					{/* Row 5: Time Auditing Blocks */}
					<div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-dashed">
						<div className="flex items-center gap-1.5">
							<CalendarDays className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
							<div>
								<span className="font-semibold block uppercase text-[9px] tracking-wide">Next Follow Up</span>
								<span>{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString("en-IN") : "No action set"}</span>
							</div>
						</div>
						<div className="flex items-center gap-1.5 border-l pl-3 sm:pl-4">
							<CalendarDays className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
							<div>
								<span className="font-semibold block uppercase text-[9px] tracking-wide">Dossier Created</span>
								<span>{lead.createdAt ? new Date(lead.createdAt).toLocaleString("en-IN") : "—"}</span>
							</div>
						</div>
					</div>

					{/* Ownership / Originator Log Footer */}
					{lead.generatedBy && (
						<div className="text-[11px] text-muted-foreground/80 flex items-center gap-1 px-1">
							<span>Dossier logged under attribution scope of:</span>
							<span className="font-semibold text-foreground">{lead.generatedBy.name || lead.generatedByName}</span>
							{lead.generatedBy.employeeId && (
								<span className="font-mono text-[10px] bg-secondary px-1 py-0.2 rounded text-muted-foreground">({lead.generatedBy.employeeId})</span>
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}