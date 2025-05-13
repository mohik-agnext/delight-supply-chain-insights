import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface SimpleDropdownProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  placeholder?: string;
}

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  options = [],
  selectedValues = [],
  onChange,
  label,
  placeholder = "Select options...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Safe options and values
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

  // Close dropdown when clicking outside
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

  // Safe handler
  const handleChange = (values: string[]) => {
    if (typeof onChange === 'function') {
      onChange(Array.isArray(values) ? values : []);
    }
  };

  const toggleOption = (option: string) => {
    // For "All..." options, select only that option
    if (option.startsWith("All") && !safeSelectedValues.includes(option)) {
      handleChange([option]);
      return;
    }

    // When selecting a specific option, remove any "All..." options
    const withoutAllOptions = safeSelectedValues.filter(v => !v.startsWith("All"));
    
    // Toggle the option
    if (withoutAllOptions.includes(option)) {
      // If this would leave us with no options, select "All..."
      if (withoutAllOptions.length === 1) {
        const allOption = safeOptions.find(o => o.startsWith("All"));
        handleChange(allOption ? [allOption] : []);
      } else {
        handleChange(withoutAllOptions.filter(v => v !== option));
      }
    } else {
      handleChange([...withoutAllOptions, option]);
    }
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
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
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg border border-gray-200">
            <div className="py-1">
              {safeOptions.map((option) => (
                <div
                  key={option}
                  className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    safeSelectedValues.includes(option) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleOption(option)}
                >
                  <div className="flex items-center h-4 w-4 mr-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={safeSelectedValues.includes(option)}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 