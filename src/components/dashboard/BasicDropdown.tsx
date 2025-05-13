import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface BasicDropdownProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  placeholder?: string;
}

export const BasicDropdown: React.FC<BasicDropdownProps> = ({
  options = [],
  selectedValues = [],
  onChange,
  label,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Safe options and values
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

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
      // If "All..." option
      if (option.startsWith("All") && !safeSelectedValues.includes(option)) {
        onChange([option]);
        return;
      }

      // Remove any "All..." options when selecting specific options
      const withoutAllOptions = safeSelectedValues.filter(v => !v.startsWith("All"));
      
      // Toggle selection
      if (withoutAllOptions.includes(option)) {
        // If this is the last selected option, select "All..."
        if (withoutAllOptions.length === 1) {
          const allOption = safeOptions.find(o => o.startsWith("All"));
          onChange(allOption ? [allOption] : []);
        } else {
          onChange(withoutAllOptions.filter(v => v !== option));
        }
      } else {
        onChange([...withoutAllOptions, option]);
      }
    } catch (error) {
      console.error("Error handling selection:", error);
    }
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
          {safeSelectedValues.length === 0
            ? placeholder
            : safeSelectedValues.length === 1
            ? safeSelectedValues[0]
            : `${safeSelectedValues.length} selected`}
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
                // Don't close dropdown after selection to allow multiple selections
              }}
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2"
                checked={safeSelectedValues.includes(option)}
                onChange={() => {}} // Controlled via parent div click
                onClick={(e) => e.stopPropagation()} // Prevent double toggling
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 