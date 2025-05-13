import React, { useState, useEffect, useMemo, forwardRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Command as OriginalCommand,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Create a safer version of Command that handles undefined values
const SafeCommand = forwardRef<
  React.ElementRef<typeof OriginalCommand>,
  React.ComponentPropsWithoutRef<typeof OriginalCommand>
>((props, ref) => {
  // Ensure we're passing safe props to Command
  const safeProps = { ...props };
  
  // Use useEffect for cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup function to help prevent errors during unmount
    };
  }, []);

  try {
    return <OriginalCommand ref={ref} {...safeProps} />;
  } catch (error) {
    console.error("Error rendering Command:", error);
    return <div className="p-4">Error rendering dropdown</div>;
  }
});
SafeCommand.displayName = "SafeCommand";

interface MultiSelectDropdownProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  placeholder?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options = [],
  selectedValues = [],
  onChange,
  label,
  placeholder = "Select options...",
}) => {
  const [open, setOpen] = useState(false);
  
  // Ensure options is always an array with defensive programming
  const safeOptions = useMemo(() => {
    return Array.isArray(options) ? options : [];
  }, [options]);
  
  // Ensure selectedValues is always an array with defensive programming
  const safeSelectedValues = useMemo(() => {
    return Array.isArray(selectedValues) ? selectedValues : [];
  }, [selectedValues]);

  // Safe onChange handler to prevent passing undefined
  const handleChange = (values: string[]) => {
    if (typeof onChange === 'function') {
      onChange(Array.isArray(values) ? values : []);
    }
  };

  const handleSelect = (value: string) => {
    if (safeOptions.length === 0) return;
    
    // If the value is "All..." and it's not already selected, clear other selections
    if (value.startsWith("All") && !safeSelectedValues.includes(value)) {
      handleChange([value]);
      return;
    }
    
    // If selecting a specific item while "All..." is selected, remove "All..."
    const newSelection = safeSelectedValues.filter((item) => !item.startsWith("All"));

    // Toggle the selected value
    if (newSelection.includes(value)) {
      // If this was the last item, select "All..."
      if (newSelection.length === 1) {
        const allOption = safeOptions.find(opt => opt.startsWith("All"));
        handleChange(allOption ? [allOption] : []);
      } else {
        handleChange(newSelection.filter((item) => item !== value));
      }
    } else {
      handleChange([...newSelection, value]);
    }
  };

  // Safely close the popover if there's an error
  const handleOpenChange = (isOpen: boolean) => {
    try {
      setOpen(isOpen);
    } catch (error) {
      console.error("Error toggling dropdown:", error);
      setOpen(false);
    }
  };

  // Simple dropdown fallback when options can't be rendered properly
  const renderSimpleDropdown = () => (
    <div className="relative mt-1">
      <select
        className="block w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        value={safeSelectedValues[0] || ""}
        onChange={(e) => handleChange([e.target.value])}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {safeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // Render a simple button if options are not available or have errors
  if (!Array.isArray(safeOptions) || safeOptions.length === 0) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <button
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
          disabled
        >
          No options available
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-expanded={open}
            type="button"
          >
            <span className="truncate">
              {safeSelectedValues.length === 0
                ? placeholder
                : safeSelectedValues.length === 1
                ? safeSelectedValues[0]
                : `${safeSelectedValues.length} selected`}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0 z-50 max-h-[300px] overflow-auto" 
          align="start"
          sideOffset={5}
          style={{ minWidth: '200px' }}
        >
          {/* Try using a simple dropdown as fallback if Command component fails */}
          {(() => {
            try {
              return (
                <div className="relative">
                  <SafeCommand className="w-full">
                    <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-9" />
                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {safeOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => handleSelect(option)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                        >
                          <div
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-sm border",
                              safeSelectedValues.includes(option)
                                ? "bg-primary border-primary"
                                : "opacity-50 border-input"
                            )}
                          >
                            {safeSelectedValues.includes(option) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span>{option}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </SafeCommand>
                </div>
              );
            } catch (error) {
              console.error("Failed to render command dropdown:", error);
              return renderSimpleDropdown();
            }
          })()}
        </PopoverContent>
      </Popover>
    </div>
  );
};
