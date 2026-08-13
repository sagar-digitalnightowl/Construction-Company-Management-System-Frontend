// src/components/ui/multi-select.jsx
import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function MultiSelect({
	options = [],
	value = [],
	onValueChange,
	placeholder = "Select items...",
	disabled = false,
	className,
}) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleSelect = (optionValue) => {
		const newValue = value.includes(optionValue)
			? value.filter((v) => v !== optionValue)
			: [...value, optionValue];
		onValueChange(newValue);
	};

	const handleRemove = (optionValue, e) => {
		e.stopPropagation();
		onValueChange(value.filter((v) => v !== optionValue));
	};

	const selectedLabels = options
		.filter((opt) => value.includes(opt.value))
		.map((opt) => opt.label);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						// BuildHive: Overriding button defaults to perfectly match the Input component footprint
						"w-full justify-between h-auto min-h-9 px-3 py-1 font-normal",
						!value.length && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
				>
					<div className="flex flex-wrap gap-1">
						{selectedLabels.length === 0 && placeholder}
						{selectedLabels.map((label) => (
							// Note: This automatically inherits your updated industrial Badge styles!
							<Badge key={label} variant="secondary" className="mr-1 mb-0.5">
								{label}
								<X
									className="ml-1 h-3 w-3 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
									onClick={(e) => {
										const opt = options.find((o) => o.label === label);
										if (opt) handleRemove(opt.value, e);
									}}
								/>
							</Badge>
						))}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			{/* BuildHive: Added softer border and explicit shadow */}
			<PopoverContent className="w-full p-0 border-border/80 shadow-md rounded-md" align="start" sideOffset={4}>
				<div className="flex flex-col">
					{/* Search input */}
					<div className="p-2 border-b border-border/60">
						<input
							type="text"
							placeholder="Search..."
							// BuildHive: Inherits the exact styling of your global Input component
							className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:border-primary"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>

					{/* Options list */}
					<div className="max-h-64 overflow-y-auto p-1">
						{filteredOptions.length === 0 ? (
							<div className="py-6 text-center text-sm text-muted-foreground">
								No results found.
							</div>
						) : (
							filteredOptions.map((option) => (
								<div
									key={option.value}
									className={cn(
										// BuildHive: Accent washes, rounded-sm interior geometry, and pointer cursor
										"flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm transition-colors hover:bg-accent/15 hover:text-foreground",
										value.includes(option.value) && "bg-accent/10 font-medium text-foreground",
									)}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleSelect(option.value);
									}}
								>
									<Check
										className={cn(
											// BuildHive: Industrial stroke-3 checkmark, pulling in the primary brand teal
											"mr-2 h-4 w-4 stroke-[3] text-primary transition-opacity",
											value.includes(option.value)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									{option.label}
								</div>
							))
						)}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}