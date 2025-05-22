import React, { useState, useEffect } from "react";
import { BasicDropdown } from "./BasicDropdown";
import { DatePickerDropdown } from "./DatePickerDropdown";
import { useFilterContext, DateOptionType, DateRange } from "@/contexts/FilterContext";
import ErrorBoundary from "@/components/ErrorBoundary";

interface FilterBarProps {
  onVendorChange?: (values: string[]) => void;
  onPeriodChange?: (values: string[]) => void;
  onDateOptionChange?: (option: DateOptionType) => void;
  onDateRangeChange?: (range: DateRange) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onVendorChange,
  onPeriodChange,
  onDateOptionChange,
  onDateRangeChange,
}) => {
  // Local state as fallback for context
  const [localState, setLocalState] = useState({
    vendors: ["All Vendors", "Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"],
    timePeriods: ["Last 6 Months", "Last 3 Months", "Last Month", "Last Week", "Custom Range"],
    selectedVendors: ["All Vendors"],
    selectedTimePeriods: ["Last 6 Months"],
    selectedDateOption: "Last 6 Months" as DateOptionType,
    customDateRange: { startDate: null, endDate: null } as DateRange,
  });

  // Try to use context, but fallback to local state if there's an error
  const contextValues = (() => {
    try {
      return useFilterContext();
    } catch (error) {
      console.error("Error using FilterContext:", error);
      return {
        selectedVendors: localState.selectedVendors,
        setSelectedVendors: (v: string[]) => setLocalState(prev => ({ ...prev, selectedVendors: v })),
        selectedTimePeriods: localState.selectedTimePeriods,
        setSelectedTimePeriods: (p: string[]) => setLocalState(prev => ({ ...prev, selectedTimePeriods: p })),
        selectedDateOption: localState.selectedDateOption,
        setSelectedDateOption: (o: DateOptionType) => setLocalState(prev => ({ ...prev, selectedDateOption: o })),
        customDateRange: localState.customDateRange,
        setCustomDateRange: (r: DateRange) => setLocalState(prev => ({ ...prev, customDateRange: r })),
        isReady: true
      };
    }
  })();

  const {
    selectedVendors, 
    setSelectedVendors,
    selectedTimePeriods, 
    setSelectedTimePeriods,
    selectedDateOption,
    setSelectedDateOption,
    customDateRange,
    setCustomDateRange,
    isReady
  } = contextValues;

  // Ensure safe values
  const safeSelectedVendors = Array.isArray(selectedVendors) ? selectedVendors : ["All Vendors"];
  const safeSelectedTimePeriods = Array.isArray(selectedTimePeriods) ? selectedTimePeriods : ["Last 6 Months"];

  // Safe handler functions with try-catch blocks
  const handleVendorChange = (values: string[]) => {
    if (!Array.isArray(values)) return;
    
    try {
      setSelectedVendors(values);
      if (onVendorChange) onVendorChange(values);
    } catch (error) {
      console.error("Error in vendor change:", error);
      setLocalState(prev => ({ ...prev, selectedVendors: values }));
    }
  };

  const handlePeriodChange = (values: string[]) => {
    if (!Array.isArray(values)) return;
    
    try {
      setSelectedTimePeriods(values);
      if (onPeriodChange) onPeriodChange(values);
    } catch (error) {
      console.error("Error in period change:", error);
      setLocalState(prev => ({ ...prev, selectedTimePeriods: values }));
    }
  };

  // Handle date option change
  const handleDateOptionChange = (option: DateOptionType) => {
    try {
      setSelectedDateOption(option);
      if (onDateOptionChange) onDateOptionChange(option);
    } catch (error) {
      console.error("Error in date option change:", error);
      setLocalState(prev => ({ ...prev, selectedDateOption: option }));
    }
  };

  // Handle custom date range change
  const handleDateRangeChange = (range: DateRange) => {
    try {
      setCustomDateRange(range);
      if (onDateRangeChange) onDateRangeChange(range);
    } catch (error) {
      console.error("Error in date range change:", error);
      setLocalState(prev => ({ ...prev, customDateRange: range }));
    }
  };

  // Loading state
  if (!isReady) {
    return (
      <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="w-full text-center text-gray-500">
          Loading filters...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px]">
        <ErrorBoundary>
          <BasicDropdown
            label="Vendor"
            options={localState.vendors}
            selectedValues={safeSelectedVendors}
            onChange={handleVendorChange}
          />
        </ErrorBoundary>
      </div>

      <div className="flex-1 min-w-[200px]">
        <ErrorBoundary>
          <DatePickerDropdown
            label="Time Period"
            selectedOption={selectedDateOption}
            customDateRange={customDateRange}
            onOptionChange={handleDateOptionChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};
