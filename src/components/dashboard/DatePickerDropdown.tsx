import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DateOptionType, DateRange, getDateRangeFromOption } from "@/contexts/FilterContext";
import { format, isValid, parseISO } from "date-fns";

interface DatePickerDropdownProps {
  label: string;
  selectedOption: DateOptionType;
  customDateRange: DateRange;
  onOptionChange: (option: DateOptionType) => void;
  onDateRangeChange: (range: DateRange) => void;
}

// Format date to YYYY-MM-DD for input value
const formatDateForInput = (date: Date | null): string => {
  if (!date || !isValid(date)) return "";
  return format(date, "yyyy-MM-dd");
};

// Format date for display
const formatDateForDisplay = (date: Date | null): string => {
  if (!date || !isValid(date)) return "";
  return format(date, "MMM d, yyyy"); // Format as "Jan 1, 2025"
};

// Parse date from YYYY-MM-DD
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const date = parseISO(dateString);
  return !isValid(date) ? null : date;
};

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  label,
  selectedOption,
  customDateRange,
  onOptionChange,
  onDateRangeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Option labels
  const options: DateOptionType[] = [
    "Last 6 Months",
    "Last 3 Months",
    "Last Month",
    "Custom Range"
  ];

  // Handle option click
  const handleOptionClick = (option: DateOptionType) => {
    onOptionChange(option);
    setIsOpen(false);
  };

  // Handle date range change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startDate' | 'endDate') => {
    const newDate = parseDate(e.target.value);
    onDateRangeChange({
      ...customDateRange,
      [field]: newDate
    });
  };

  // Get display text
  const getDisplayText = (): string => {
    if (selectedOption !== "Custom Range") {
      return selectedOption;
    }

    // For custom range, show the date range if available
    if (customDateRange.startDate && customDateRange.endDate) {
      return `${formatDateForDisplay(customDateRange.startDate)} to ${formatDateForDisplay(customDateRange.endDate)}`;
    }
    
    return "Custom Range";
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {/* Main dropdown button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-auto">
          {/* Preset options */}
          <div className="divide-y divide-gray-200">
            {options.map((option) => (
              <div
                key={option}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  selectedOption === option ? "bg-blue-50" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
          
          {/* Custom date picker (shown when Custom Range is selected) */}
          {selectedOption === "Custom Range" && (
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-3">
                <div>
                  <label htmlFor="start-date" className="block text-xs font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={formatDateForInput(customDateRange.startDate)}
                    onChange={(e) => handleDateChange(e, 'startDate')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-xs font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={formatDateForInput(customDateRange.endDate)}
                    onChange={(e) => handleDateChange(e, 'endDate')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min={formatDateForInput(customDateRange.startDate)}
                  />
                </div>
                <div className="pt-2">
                  <button
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 