import React, { useState, useEffect } from "react";
import { BasicDropdown } from "./BasicDropdown";
import { useFilterContext } from "@/contexts/FilterContext";
import ErrorBoundary from "@/components/ErrorBoundary";

interface FilterBarProps {
  onVendorChange?: (values: string[]) => void;
  onPeriodChange?: (values: string[]) => void;
  onCategoryChange?: (values: string[]) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onVendorChange,
  onPeriodChange,
  onCategoryChange,
}) => {
  // Local state as fallback for context
  const [localState, setLocalState] = useState({
    vendors: ["All Vendors", "Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"],
    timePeriods: ["Last 6 Months", "Last 3 Months", "Last Month", "Last Week", "Custom Range"],
    categories: ["All Categories", "Dairy", "Produce", "Meat", "Beverages"],
    selectedVendors: ["All Vendors"],
    selectedTimePeriods: ["Last 6 Months"],
    selectedCategories: ["All Categories"]
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
        selectedCategories: localState.selectedCategories,
        setSelectedCategories: (c: string[]) => setLocalState(prev => ({ ...prev, selectedCategories: c })),
        isReady: true
      };
    }
  })();

  const {
    selectedVendors, 
    setSelectedVendors,
    selectedTimePeriods, 
    setSelectedTimePeriods,
    selectedCategories, 
    setSelectedCategories,
    isReady
  } = contextValues;

  // Ensure safe values
  const safeSelectedVendors = Array.isArray(selectedVendors) ? selectedVendors : ["All Vendors"];
  const safeSelectedTimePeriods = Array.isArray(selectedTimePeriods) ? selectedTimePeriods : ["Last 6 Months"];
  const safeSelectedCategories = Array.isArray(selectedCategories) ? selectedCategories : ["All Categories"];

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

  const handleCategoryChange = (values: string[]) => {
    if (!Array.isArray(values)) return;
    
    try {
      setSelectedCategories(values);
      if (onCategoryChange) onCategoryChange(values);
    } catch (error) {
      console.error("Error in category change:", error);
      setLocalState(prev => ({ ...prev, selectedCategories: values }));
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
          <BasicDropdown
            label="Time Period"
            options={localState.timePeriods}
            selectedValues={safeSelectedTimePeriods}
            onChange={handlePeriodChange}
          />
        </ErrorBoundary>
      </div>

      <div className="flex-1 min-w-[200px]">
        <ErrorBoundary>
          <BasicDropdown
            label="Category"
            options={localState.categories}
            selectedValues={safeSelectedCategories}
            onChange={handleCategoryChange}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};
