import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface BasicDropdownProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  placeholder?: string;
  multiSelect?: boolean;
  formatOptionLabel?: (option: string) => string;
}

export const BasicDropdown: React.FC<BasicDropdownProps> = ({
  options = [],
  selectedValues = [],
  onChange,
  label,
  placeholder = "Select...",
  multiSelect = false,
  formatOptionLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Safe options and values
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

  // Format option for display if formatter provided
  const displayLabel = (option: string): string => {
    if (formatOptionLabel) {
      return formatOptionLabel(option);
    }
    return option;
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleOptionClick = (option: string) => {
    try {
      // If multiSelect is false, just select the clicked option
      if (!multiSelect) {
        onChange([option]);
        setIsOpen(false);
        return;
      }
      
      // Special handling for "All Vendors" option
      if (option === "All Vendors") {
        onChange(["All Vendors"]);
        setIsOpen(false);
        return;
      }

      // If selecting a specific vendor
      let newSelectedValues: string[];
      
      // If "All Vendors" is currently selected, remove it
      if (safeSelectedValues.includes("All Vendors")) {
        newSelectedValues = [option];
      } else {
        // Toggle the selected option
        if (safeSelectedValues.includes(option)) {
          // Remove the option if it's already selected
          newSelectedValues = safeSelectedValues.filter(v => v !== option);
          
          // If no options remain selected, select "All Vendors"
          if (newSelectedValues.length === 0) {
            newSelectedValues = ["All Vendors"];
          }
        } else {
          // Add the option to the selected values
          newSelectedValues = [...safeSelectedValues, option];
        }
      }
      
      onChange(newSelectedValues);
    } catch (error) {
      console.error("Error handling selection:", error);
    }
  };

  // Display selected values in the dropdown button
  const getDisplayText = () => {
    if (safeSelectedValues.length === 0) {
      return placeholder;
    }
    
    if (safeSelectedValues.length === 1) {
      return displayLabel(safeSelectedValues[0]);
    }
    
    // For multiple selections
    if (safeSelectedValues.includes("All Vendors")) {
      return "All Vendors";
    }
    
    if (safeSelectedValues.length <= 2) {
      return safeSelectedValues.map(displayLabel).join(", ");
    }
    
    return `${safeSelectedValues.length} selected`;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="truncate">
          {getDisplayText()}
        </span>
        <ChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {safeOptions.map((option) => (
            <div
              key={option}
              className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
                safeSelectedValues.includes(option) ? "bg-blue-50" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                handleOptionClick(option);
              }}
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                checked={safeSelectedValues.includes(option)}
                onChange={() => {}} // Controlled via parent div click
                onClick={(e) => e.stopPropagation()} // Prevent double toggling
              />
              <span>{displayLabel(option)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 