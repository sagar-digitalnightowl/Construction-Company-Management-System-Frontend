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
            "w-full justify-between h-auto min-h-10 px-3 py-2",
            !value.length && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {selectedLabels.length === 0 && placeholder}
            {selectedLabels.map((label) => (
              <Badge key={label} variant="secondary" className="mr-1 mb-0.5">
                {label}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
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
      <PopoverContent className="w-full p-0" align="start" sideOffset={4}>
        <div className="flex flex-col">
          {/* Search input */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search vendors..."
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {/* Options list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No vendor found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent",
                    value.includes(option.value) && "bg-accent",
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
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
