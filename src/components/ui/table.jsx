import * as React from "react";
import { cn } from "../../lib/helpers";

const Table = React.forwardRef(({ className, ...props }, ref) => (
	<div className="relative w-full overflow-auto">
		<table
			ref={ref}
			className={cn("w-full caption-bottom text-sm", className)}
			{...props}
		/>
	</div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		// BuildHive: Subtle muted background to ground the header row
		className={cn("[&_tr]:border-b border-border/80 bg-muted/30", className)}
		{...props}
	/>
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			"border-b border-border/80 transition-colors hover:bg-muted/40",
			// BuildHive: Selected state uses a faint wash of the mid-teal accent
			"data-[state=selected]:bg-accent/15 data-[state=selected]:border-accent/30",
			className
		)}
		{...props}
	/>
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			// BuildHive: Applied font-display (Oswald) for industrial blueprint labels
			"h-10 px-3 text-left align-middle text-muted-foreground font-display text-[11px] md:text-xs [&:has([role=checkbox])]:pr-0",
			className
		)}
		{...props}
	/>
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
	<td
		ref={ref}
		// BuildHive: Tighter p-3 padding for better data density in operations views
		className={cn("p-3 align-middle [&:has([role=checkbox])]:pr-0", className)}
		{...props}
	/>
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };